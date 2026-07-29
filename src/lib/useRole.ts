'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export type UserRole = 'admin' | 'viewer' | null;

export function useRole() {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setRole(null); setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, 'admin_users', user.uid));
        // No admin_users doc, or a doc without role: 'admin', means viewer.
        // Do not fail open — admin status must be explicitly granted.
        setRole(snap.exists() ? (snap.data().role as UserRole) ?? 'viewer' : 'viewer');
      } catch {
        setRole(null); // fail closed if Firestore rules block the read
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { role, isAdmin: role === 'admin', isViewer: role === 'viewer', loading };
}
