import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

export type Coupon = {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  appliesTo: string[]; // plan IDs or ['all']
  programs: string[]; // program IDs from /enroll (e.g. 'learning-hub') or ['all']
  description?: string;
  active: boolean;
  maxUses?: number | null;
  uses: number;
  expiresAt?: string | null; // ISO date
  createdAt: any;
};

// Plan parsing — keep in sync with /enroll planOptions strings.
export const PLAN_CATALOG: { id: string; label: string; price: number; per: 'mo' | 'one' }[] = [
  { id: 'starter', label: 'Starter — $110/mo (1 session/week)', price: 110, per: 'mo' },
  { id: 'standard', label: 'Standard — $200/mo (2 sessions/week)', price: 200, per: 'mo' },
  { id: 'premium', label: 'Premium 1-on-1 — $350/mo', price: 350, per: 'mo' },
  { id: 'prodigy', label: 'Code Prodigy — $450/mo (Elite)', price: 450, per: 'mo' },
];

export function findPlan(label: string) {
  return PLAN_CATALOG.find((p) => p.label === label) || null;
}

// Per-student sibling discount: applicant full price, 2nd child -10%, 3rd child -15%.
export const SIBLING_DISCOUNT_PCT = [0, 10, 15, 15];

export type StudentLine = {
  index: number; // 0 = primary applicant
  label: string; // "Primary applicant" or "Sibling 1", etc.
  planLabel: string | null;
  planId: string | null;
  basePrice: number;
  per: 'mo' | 'one' | null;
  discountPct: number;
  discountAmount: number;
  subtotal: number; // after sibling discount, before coupon
};

export type FeeBreakdown = {
  students: StudentLine[];
  householdSubtotal: number; // sum of student subtotals
  couponLabel: string | null;
  couponAmount: number;
  total: number;
  per: 'mo' | 'one' | null;
};

export function computeFee(
  primaryPlanLabel: string,
  siblingPlans: string[], // labels for each sibling, in order
  coupon: Coupon | null
): FeeBreakdown {
  const planLabels = [primaryPlanLabel, ...siblingPlans];
  const students: StudentLine[] = planLabels.map((label, i) => {
    const plan = findPlan(label);
    const base = plan?.price || 0;
    const pct = SIBLING_DISCOUNT_PCT[Math.min(i, SIBLING_DISCOUNT_PCT.length - 1)];
    const disc = Math.round((base * pct) / 100);
    return {
      index: i,
      label: i === 0 ? 'Primary applicant' : `Sibling ${i}`,
      planLabel: plan?.label || null,
      planId: plan?.id || null,
      basePrice: base,
      per: plan?.per || null,
      discountPct: pct,
      discountAmount: disc,
      subtotal: Math.max(0, base - disc),
    };
  });

  const householdSubtotal = students.reduce((s, x) => s + x.subtotal, 0);
  // Cadence: if any student has 'mo' use mo (all our plans are mo today).
  const per = students.find((s) => s.per)?.per || null;

  let couponAmt = 0;
  let couponLabel: string | null = null;
  if (coupon && householdSubtotal > 0) {
    // Coupon applies to all students whose plan matches appliesTo (or 'all').
    const eligibleSubtotal = students.reduce((s, x) => {
      if (!x.planId) return s;
      const match = coupon.appliesTo.includes('all') || coupon.appliesTo.includes(x.planId);
      return s + (match ? x.subtotal : 0);
    }, 0);
    if (eligibleSubtotal > 0) {
      if (coupon.discountType === 'percent') {
        couponAmt = Math.round((eligibleSubtotal * coupon.discountValue) / 100);
        couponLabel = `${coupon.code} (-${coupon.discountValue}%)`;
      } else {
        couponAmt = Math.min(eligibleSubtotal, coupon.discountValue);
        couponLabel = `${coupon.code} (-$${coupon.discountValue})`;
      }
    }
  }

  return {
    students,
    householdSubtotal,
    couponLabel,
    couponAmount: couponAmt,
    total: Math.max(0, householdSubtotal - couponAmt),
    per,
  };
}

// Programs that belong to multiple equivalent IDs.
// A coupon scoped to any one of these IDs is valid for any other ID in the same group.
// Add new groupings here when new registration flows are added.
const PROGRAM_ALIASES: Record<string, string[]> = {
  'idea2mvp-2026': ['idea2mvp-2026', 'idea2mvp', 'accelerator'],
  'summer-coding-2026': ['summer-coding-2026', 'summer-coding', 'bootcamp'],
};

function programMatches(couponPrograms: string[], programId: string): boolean {
  if (!couponPrograms || couponPrograms.length === 0) return true;
  if (couponPrograms.includes('all')) return true;
  if (couponPrograms.includes(programId)) return true;
  const aliases = PROGRAM_ALIASES[programId];
  if (aliases && aliases.some((a) => couponPrograms.includes(a))) return true;
  return false;
}

export async function lookupCoupon(code: string, programId: string, planLabel: string): Promise<{ ok: true; coupon: Coupon } | { ok: false; error: string }> {
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return { ok: false, error: 'Enter a coupon code.' };
  const q = query(collection(db, 'coupons'), where('code', '==', trimmed));
  const snap = await getDocs(q);
  if (snap.empty) return { ok: false, error: 'Coupon not found.' };
  const c = { id: snap.docs[0].id, ...snap.docs[0].data() } as Coupon;
  if (!c.active) return { ok: false, error: 'This coupon is no longer active.' };
  if (c.expiresAt && new Date(c.expiresAt).getTime() < Date.now()) return { ok: false, error: 'This coupon has expired.' };
  if (c.maxUses && c.uses >= c.maxUses) return { ok: false, error: 'This coupon has reached its usage limit.' };
  if (!programMatches(c.programs || [], programId)) {
    return { ok: false, error: 'This coupon does not apply to the selected program.' };
  }
  const plan = findPlan(planLabel);
  if (c.appliesTo && c.appliesTo.length && !c.appliesTo.includes('all')) {
    if (!plan || !c.appliesTo.includes(plan.id)) {
      return { ok: false, error: 'This coupon does not apply to the selected pricing plan.' };
    }
  }
  return { ok: true, coupon: c };
}

export async function incrementCouponUse(couponId: string) {
  try {
    await updateDoc(doc(db, 'coupons', couponId), { uses: increment(1) });
  } catch (err) {
    console.error('Failed to increment coupon use:', err);
  }
}
