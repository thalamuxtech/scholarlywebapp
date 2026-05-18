# Fix: blog create from admin shows permission + CORS errors

The admin "create post" flow on production fails with two errors:

1. `FirebaseError: Missing or insufficient permissions` on the Firestore `posts` collection.
2. `Access to XMLHttpRequest at firebasestorage.googleapis.com... blocked by CORS policy`.

Both are infrastructure problems, not code bugs. Code changes in the repo
fix one half (the rule shape and the upload filename), but you must also
deploy the rules and apply a CORS policy to the Storage bucket.

## What changed in code (already committed)

- `firestore.rules` — public `/blog` listing now requires `status == 'published'` and we updated the lib hook to query with that filter explicitly. This satisfies the per-document rule check.
- `src/lib/posts.ts` — `usePosts()` now adds `where('status', '==', 'published')` so the public page does not try to read drafts (which would be denied per-document and abort the whole listener).
- `src/app/admin/dashboard/blog/page.tsx` — image upload path now keeps the file extension (e.g. `blog/172...-post1.png` instead of `blog/172...-post1png`).
- `storage.cors.json` — the CORS policy to apply to the bucket.

## Steps to deploy

### 1. Make sure you are logged in and on the right project

```
firebase login
firebase use scholarly-echo
```

### 2. Deploy Firestore + Storage rules

```
firebase deploy --only firestore:rules,storage
```

If `firebase deploy --only storage` complains the bucket has no rules
target, run:

```
firebase init storage
# Pick the existing scholarly-echo.firebasestorage.app bucket
# Use storage.rules (already in this repo) when asked
```

then redo the deploy.

### 3. Apply CORS to the Storage bucket

This is the actual fix for the CORS error. Run via Google Cloud SDK
(`gcloud`). The bucket name is taken from `firebase.ts`:
`scholarly-echo.firebasestorage.app`.

```
gsutil cors set storage.cors.json gs://scholarly-echo.firebasestorage.app
```

Verify it took effect:

```
gsutil cors get gs://scholarly-echo.firebasestorage.app
```

You should see the four allowed origins from `storage.cors.json` printed back.

### 4. Rebuild and deploy the site

```
npm run build
firebase deploy --only hosting
```

### 5. Smoke test

1. Open `https://scholarly-echo.web.app/admin/dashboard/blog`.
2. Click **New Post**.
3. Upload an image. Should succeed (no CORS error in browser console).
4. Fill in title, body, set status to `Published`, save.
5. Open `https://scholarly-echo.web.app/blog` in an incognito window. The new post should be listed.

## If the CORS step still fails

You probably don't have `gsutil`/`gcloud` installed. Two options:

**Option A (recommended): install Google Cloud SDK.**
Download from https://cloud.google.com/sdk/docs/install, then run
`gcloud auth login` and the `gsutil cors set` command above.

**Option B: temporarily widen the CORS to `*` to unblock yourself.**
Edit `storage.cors.json` and change the `origin` array to `["*"]`. This
should only be used briefly while you finish setup.

## Why both errors happen at once

Firebase Storage runs on the Google Cloud Storage API at
`firebasestorage.googleapis.com`, which is a different origin from your
Hosting domain `scholarly-echo.web.app`. The browser sends a CORS
preflight `OPTIONS` request before any upload. Without a bucket-level
CORS policy permitting your origin, the preflight returns 403 and the
upload never starts.

The Firestore "permission denied" was a separate problem: the previous
rule allowed reads only when the document's `status == 'published'`, but
the public `/blog` listener queried *all* posts without filtering,
including any drafts. Firestore evaluates rules per document, so as
soon as one draft was in the result the whole listener errored. The
fix is in `src/lib/posts.ts`: the public hook now filters by `status`
in the query itself.
