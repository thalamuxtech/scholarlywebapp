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

// Sibling discounts — compounding rule mirrors siblingOptions hints.
// Returns the % discount applied off the base plan tuition due to sibling status.
export function siblingDiscountPercent(label: string): number {
  if (!label) return 0;
  if (label.startsWith('Just me')) return 0;
  if (label.startsWith('1 sibling')) return 10;
  if (label.startsWith('2 siblings')) return 25; // 10 + 15
  return 0; // 3+ contact us — no auto discount
}

export type FeeBreakdown = {
  basePrice: number;
  per: 'mo' | 'one' | null;
  siblingPercent: number;
  siblingAmount: number;
  couponLabel: string | null;
  couponAmount: number;
  subtotal: number; // base
  total: number;    // after all discounts
  planLabel: string | null;
};

export function computeFee(planLabel: string, siblingsLabel: string, coupon: Coupon | null): FeeBreakdown {
  const plan = findPlan(planLabel);
  const base = plan?.price || 0;
  const sibPct = siblingDiscountPercent(siblingsLabel);
  const sibAmt = Math.round((base * sibPct) / 100);
  const afterSiblings = Math.max(0, base - sibAmt);

  let couponAmt = 0;
  let couponLabel: string | null = null;
  if (coupon && plan) {
    const planMatch = coupon.appliesTo.includes('all') || coupon.appliesTo.includes(plan.id);
    if (planMatch) {
      if (coupon.discountType === 'percent') {
        couponAmt = Math.round((afterSiblings * coupon.discountValue) / 100);
        couponLabel = `${coupon.code} (-${coupon.discountValue}%)`;
      } else {
        couponAmt = Math.min(afterSiblings, coupon.discountValue);
        couponLabel = `${coupon.code} (-$${coupon.discountValue})`;
      }
    }
  }

  return {
    basePrice: base,
    per: plan?.per || null,
    siblingPercent: sibPct,
    siblingAmount: sibAmt,
    couponLabel,
    couponAmount: couponAmt,
    subtotal: base,
    total: Math.max(0, afterSiblings - couponAmt),
    planLabel: plan?.label || null,
  };
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
  if (c.programs && c.programs.length && !c.programs.includes('all') && !c.programs.includes(programId)) {
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
