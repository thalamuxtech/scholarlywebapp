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
        if (snap.exists()) {
          setRole(snap.data().role as UserRole);
        } else {
          // First user (no doc) = admin by default
          setRole('admin');
        }
      } catch {
        setRole('admin'); // fallback if Firestore rules block
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { role, isAdmin: role === 'admin', isViewer: role === 'viewer', loading };
}
