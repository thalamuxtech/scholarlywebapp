import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export type FormType = 'newsletter' | 'contact' | 'waitlist' | 'enrollment' | 'free-trial' | 'summer-coding';

export async function submitForm(formType: FormType, data: Record<string, string>): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const ref = collection(db, 'submissions');
    const docRef = await addDoc(ref, {
      formType,
      ...data,
      createdAt: serverTimestamp(),
      read: false,
    });
    return { success: true, id: docRef.id };
  } catch (err: any) {
    console.error('Form submission error:', err);
    return { success: false, error: err?.message || 'Failed to submit. Please try again.' };
  }
}
