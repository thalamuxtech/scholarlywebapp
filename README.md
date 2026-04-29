# ScholarlyEcho Web Platform

[![Deploy to Firebase](https://github.com/thalamuxtech/scholarlywebapp/actions/workflows/firebase-deploy.yml/badge.svg)](https://github.com/thalamuxtech/scholarlywebapp/actions/workflows/firebase-deploy.yml)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?logo=firebase&logoColor=white)](https://scholarly-echo.web.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0050?logo=framer&logoColor=white)](https://www.framer.com/motion)

A premium Next.js 14 web platform for ScholarlyEcho — a global youth empowerment ecosystem built around three pillars: **Learn**, **Inspire**, and **Engage**.

**Live:** [scholarly-echo.web.app](https://scholarly-echo.web.app)
**Repo:** [thalamuxtech/scholarlywebapp](https://github.com/thalamuxtech/scholarlywebapp)

## Tech Stack

- **Framework:** Next.js 14 (App Router, Static Export)
- **Styling:** Tailwind CSS with custom brand design system
- **Animations:** Framer Motion
- **Backend:** Firebase (Auth, Firestore, Analytics, Hosting)
- **CI/CD:** GitHub Actions → Firebase Hosting auto-deploy on push to `master`

## Project Structure

```
src/
├── app/                       # Next.js App Router pages
│   ├── enroll/                # Multi-program enrollment with live tuition + coupons
│   ├── pricing/               # Public pricing page
│   ├── learning-hub/          # Coders Ladder programs
│   ├── book/                  # Office-hour booking flow
│   └── admin/
│       ├── login/
│       └── dashboard/
│           ├── submissions/   # All form submissions, CSV export
│           ├── programs/      # Programs, student assignment, office hours
│           ├── coupons/       # Discount-code generator
│           ├── analytics/
│           └── settings/      # Profile, team members, roles
├── components/
│   ├── ConfirmDialog.tsx      # Animated confirm dialog (useConfirm hook)
│   ├── Toast.tsx              # Toast notifications (useToast hook)
│   └── ...
└── lib/
    ├── firebase.ts            # Firebase init (Auth, Firestore, Analytics)
    ├── formSubmit.ts          # Unified submission writer for all public forms
    ├── coupons.ts             # Plan catalog, sibling-discount math, coupon lookup
    └── useRole.ts             # admin / viewer role hook
```

## Public Surface

| Route | Purpose |
|---|---|
| `/` | Marketing home — three pillars, programs grid |
| `/enroll` | 4-track application form (Learning Hub, Inspire Media, AI Assessment, Code Prodigy). Live per-student tuition panel, sibling discounts, coupon redemption |
| `/pricing` | Plan comparison |
| `/book?id=<officeHourId>` | Student-facing office-hour slot booking |
| `/blog`, `/events`, `/impact`, `/about`, `/contact` | Standard pages |

## Admin Dashboard

Sign in at `/admin/login`. First sign-in becomes admin by default; subsequent users are added via Settings → Team.

- **Submissions** — All form submissions (newsletter, contact, enrollment, etc.), filterable, exportable to CSV. Animated confirm dialog on delete.
- **Programs** — CRUD programs, assign enrolled students from the unassigned pool, set up recurring office-hour blocks (multi-day, configurable slot length), manage bookings, get a shareable booking link.
- **Coupons** — Generate (or auto-generate) discount codes. Restrict by program and pricing plan, set max uses and expiry. Edit, enable/disable, delete. Each redemption increments `uses` automatically.
- **Settings** — Update email/password, manage team members and roles (admin / viewer).

## Enrollment Pricing Engine

The Learning Hub form computes tuition in real time as the user fills it in:

- **Plan catalog** is centralized in [`src/lib/coupons.ts`](src/lib/coupons.ts) (`PLAN_CATALOG`).
- **Sibling discounts** are per-student tiered: applicant 0%, sibling 1 −10%, siblings 2+ −15%. Each sibling picks their own plan; the panel shows a line item per child.
- **Coupons** apply to the household subtotal, scoped to plans the coupon allows. Validated against Firestore on Apply.
- Submission saves an itemized breakdown — `student0_*`, `student1_*`, `householdSubtotal`, `couponCode`, `couponDiscountAmount`, `totalFee`, `feeCadence`.

## Firestore Collections

| Collection | Purpose |
|---|---|
| `submissions` | All public form submissions (newsletter, contact, enrollment, etc.). `formType` discriminates. |
| `programs` | Admin-managed program catalog used for student assignment. |
| `office_hours` | Recurring office-hour blocks with `bookings[]`. |
| `coupons` | Discount codes (`code`, `discountType`, `discountValue`, `appliesTo`, `programs`, `maxUses`, `expiresAt`, `uses`). |
| `admin_users` | Team members with roles. First-login fallback grants admin. |

Rules in [`firestore.rules`](firestore.rules). Public can create submissions and redeem coupons (increment `uses`); everything else requires auth.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Deploy

```bash
npm run build      # Static export to /out
```

Pushing to `master` auto-deploys to Firebase Hosting via GitHub Actions.

To deploy Firestore rules manually (requires Editor on the `scholarly-echo` Firebase project):

```bash
npx firebase deploy --only firestore:rules
```

## Environment

No `.env` required — Firebase config is embedded for this public web app. The deploy workflow uses a `FIREBASE_SERVICE_ACCOUNT` secret to authenticate against Firebase Hosting.
