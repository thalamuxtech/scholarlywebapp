# ScholarlyEcho Web Platform

A premium Next.js 14 web platform for ScholarlyEcho — a global youth empowerment ecosystem built around three pillars: **Learn**, **Inspire**, and **Engage**.

## Tech Stack

- **Framework:** Next.js 14 (App Router, Static Export)
- **Styling:** Tailwind CSS with custom brand design system
- **Animations:** Framer Motion
- **Backend:** Firebase (Auth, Firestore, Analytics, Hosting)
- **CI/CD:** GitHub Actions → Firebase Hosting auto-deploy on push

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Deploy

```bash
npm run build     # Static export to /out
```

Pushing to `master` auto-deploys to Firebase Hosting via GitHub Actions.

## Environment

No `.env` required — Firebase config is embedded for this public web app.
