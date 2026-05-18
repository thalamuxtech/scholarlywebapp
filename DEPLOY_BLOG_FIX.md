# Fix blog admin upload errors (CORS + permissions)

The admin "create post" flow shows two related errors on production:

1. `Access to XMLHttpRequest at firebasestorage.googleapis.com... blocked by CORS policy` (image upload)
2. `FirebaseError: Missing or insufficient permissions` (Firestore listener)

Both are infrastructure problems. The code-side fixes are already committed.
The remaining step you must run yourself is to apply a **bucket CORS
policy** to the Firebase Storage bucket. Firebase CLI does not do this.
You need `gcloud` or `gsutil`.

## TL;DR fix in 5 minutes

```powershell
# from the app/ folder
firebase login
firebase use scholarly-echo
firebase deploy --only firestore:rules,storage

# then apply CORS to the bucket (one-time)
.\scripts\apply-storage-cors.ps1

# finally redeploy hosting so the code changes go live
npm run build
firebase deploy --only hosting
```

If `apply-storage-cors.ps1` says "Neither gsutil nor gcloud is installed",
follow the install guide below.

## Install Google Cloud SDK (if you do not have it)

Download from https://cloud.google.com/sdk/docs/install

After install, open a **new** PowerShell window so `gcloud` is on PATH, then:

```powershell
gcloud auth login
gcloud config set project scholarly-echo
```

Now `.\scripts\apply-storage-cors.ps1` will work.

## Manual fallback (if you cannot install gcloud)

Open https://console.cloud.google.com/storage/browser/scholarly-echo.firebasestorage.app — sign in as the Google account that owns the project. Click the bucket. Click the **Permissions** tab; CORS is not there. Instead use Cloud Shell:

1. Click the **Activate Cloud Shell** icon in the top-right of console.cloud.google.com
2. In the shell, upload `storage.cors.json` (Cloud Shell has a drag-and-drop file upload)
3. Run:
   ```
   gsutil cors set storage.cors.json gs://scholarly-echo.firebasestorage.app
   gsutil cors get gs://scholarly-echo.firebasestorage.app
   ```

That's it. The bucket policy applies in seconds.

## Why this is necessary

Firebase Storage is built on Google Cloud Storage. The browser sends a CORS
preflight `OPTIONS` request to `firebasestorage.googleapis.com` before any
upload. Without a bucket-level CORS configuration permitting your origin
(`https://scholarly-echo.web.app`), the preflight returns 403 and the
upload never starts. The Firebase CLI manages Firestore rules and Storage
*security* rules, but the *CORS* policy is a property of the underlying
GCS bucket and must be set via gsutil/gcloud.

## What changed in code (already committed)

- `firestore.rules`: `posts/{docId}` allows public read only when
  `status == 'published'`, admin sees all.
- `src/lib/posts.ts`: `usePosts()` now filters `where('status', '==', 'published')`
  so the public listener never tries to read drafts (per-doc rule check
  would otherwise reject the whole listener).
- `src/app/admin/dashboard/blog/page.tsx`: upload preserves the file
  extension (`.png`, `.jpg`, `.webp`, etc.) so Cloud Storage sets a
  correct `Content-Type` and the storage.rules `image/.*` check matches.
- `storage.cors.json`: the CORS policy file to apply to the bucket.
- `scripts/apply-storage-cors.ps1`: one-shot PowerShell script that finds
  gsutil or gcloud and runs the right command.

## Smoke test

1. Open `https://scholarly-echo.web.app/admin/dashboard/blog`
2. Click **New Post**
3. Upload an image. Should succeed silently (no error in browser console).
4. Fill title + body, set **Status** to **Published**, click **Create**.
5. Open `https://scholarly-echo.web.app/blog` in an incognito window.
6. The new post should appear in the list. Click it. The full post should render.
