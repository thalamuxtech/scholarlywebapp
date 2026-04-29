'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updatePassword, updateEmail, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, onSnapshot, deleteDoc, query, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRole } from '@/lib/useRole';
import { useToast } from '@/components/Toast';
import { useConfirm } from '@/components/ConfirmDialog';
import {
  Shield, Mail, Lock, Globe, Save, Loader2, ExternalLink, Database,
  Users, Plus, Trash2, X, UserCheck, Eye, EyeOff, Crown
} from 'lucide-react';

type TeamMember = { id: string; email: string; role: string; createdAt: any };

export default function SettingsPage() {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState<string | null>(null);
  const { showToast } = useToast();
  const { isAdmin } = useRole();
  const { confirm } = useConfirm();

  const user = auth.currentUser;

  // Team members
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'viewer' });
  const [creating, setCreating] = useState(false);
  const [showNewUserPw, setShowNewUserPw] = useState(false);
  const [showUpdatePw, setShowUpdatePw] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'admin_users'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setTeam(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMember)));
    }, () => {});
    return () => unsub();
  }, []);

  const handleUpdateEmail = async () => {
    if (!newEmail || !user) return;
    setSaving('email');
    try {
      await updateEmail(user, newEmail);
      showToast('success', 'Email updated successfully.');
      setNewEmail('');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update email.');
    }
    setSaving(null);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !user) return;
    setSaving('password');
    try {
      await updatePassword(user, newPassword);
      showToast('success', 'Password updated successfully.');
      setNewPassword('');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update password.');
    }
    setSaving(null);
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password) return;
    setCreating(true);
    try {
      // Create via REST API to avoid signing out current user
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA7K2-uii2ZAfk-eKyBKl6RCruTROdRFxs`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: newUser.email, password: newUser.password, returnSecureToken: false }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      // Store role in Firestore
      await setDoc(doc(db, 'admin_users', data.localId), {
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date(),
      });

      showToast('success', `User ${newUser.email} created as ${newUser.role}.`);
      setNewUser({ email: '', password: '', role: 'viewer' });
      setShowAddUser(false);
    } catch (err: any) {
      const msg = err.message?.replace(/_/g, ' ').toLowerCase() || 'Failed to create user.';
      showToast('error', msg);
    }
    setCreating(false);
  };

  const handleRemoveUser = async (member: TeamMember) => {
    const ok = await confirm({
      tone: 'danger',
      title: 'Remove team member?',
      itemName: member.email,
      description: `${member.email} will lose access to the admin dashboard. Their Firebase Auth account remains — re-add them here to restore access.`,
      confirmLabel: 'Remove member',
    });
    if (!ok) return;
    await deleteDoc(doc(db, 'admin_users', member.id));
    showToast('success', `Removed ${member.email} from team.`);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Settings</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your account, team, and platform settings.</p>
      </div>

      <div className="space-y-6">

        {/* ── Team Management (Admin only) ── */}
        {isAdmin && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-brand-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Team Members</h3>
                  <p className="text-xs text-slate-400">Viewers can see submissions & programs but cannot delete.</p>
                </div>
              </div>
              <button onClick={() => setShowAddUser(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl gradient-bg text-white text-xs font-bold shadow-md hover:-translate-y-0.5 transition-all">
                <Plus className="w-3.5 h-3.5" /> Add User
              </button>
            </div>

            {/* Current admin */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-50/50 border border-brand-100 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{user?.email}</p>
                <p className="text-[11px] text-slate-400">You</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-100 text-brand-700 text-[10px] font-bold">
                <Crown className="w-3 h-3" /> Admin
              </span>
            </div>

            {/* Team list */}
            {team.length > 0 && (
              <div className="space-y-2">
                {team.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 group">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                      {member.email?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{member.email}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      member.role === 'admin' ? 'bg-brand-100 text-brand-700' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {member.role === 'admin' ? <Crown className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {member.role === 'admin' ? 'Admin' : 'Viewer'}
                    </span>
                    <button onClick={() => handleRemoveUser(member)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {team.length === 0 && (
              <p className="text-xs text-slate-300 text-center py-4">No team members added yet.</p>
            )}

            {/* Add User Modal */}
            <AnimatePresence>
              {showAddUser && (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={() => setShowAddUser(false)} />
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Add Team Member</h3>
                      <button onClick={() => setShowAddUser(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1.5 block">Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            placeholder="user@example.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1.5 block">Password *</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input type={showNewUserPw ? 'text' : 'password'} value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            placeholder="Min 6 characters"
                            className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
                          <button type="button" onClick={() => setShowNewUserPw(!showNewUserPw)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                            {showNewUserPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1.5 block">Role</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: 'viewer', label: 'Viewer', desc: 'View only — no delete', icon: Eye },
                            { value: 'admin', label: 'Admin', desc: 'Full access', icon: Crown },
                          ].map(({ value, label, desc, icon: Icon }) => (
                            <button key={value} type="button" onClick={() => setNewUser({ ...newUser, role: value })}
                              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                                newUser.role === value ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                              }`}>
                              <Icon className={`w-4 h-4 ${newUser.role === value ? 'text-brand-600' : 'text-slate-400'}`} />
                              <div>
                                <div className={`text-sm font-semibold ${newUser.role === value ? 'text-brand-700' : 'text-slate-700'}`}>{label}</div>
                                <div className="text-[10px] text-slate-400">{desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <button onClick={handleCreateUser} disabled={creating || !newUser.email || !newUser.password}
                        className="w-full py-3.5 rounded-xl gradient-bg text-white text-sm font-bold shadow-md disabled:opacity-50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                        {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserCheck className="w-4 h-4" /> Create User</>}
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Account ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Account</h3>
              <p className="text-xs text-slate-400">Current: {user?.email}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Update Email</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="New email address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
                </div>
                <button onClick={handleUpdateEmail} disabled={!newEmail || saving === 'email'}
                  className="px-4 py-3 rounded-xl gradient-bg text-white text-sm font-bold shadow-md disabled:opacity-50 hover:-translate-y-0.5 transition-all flex items-center gap-1.5">
                  {saving === 'email' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Update Password</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type={showUpdatePw ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
                  <button type="button" onClick={() => setShowUpdatePw(!showUpdatePw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                    {showUpdatePw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button onClick={handleUpdatePassword} disabled={!newPassword || saving === 'password'}
                  className="px-4 py-3 rounded-xl gradient-bg text-white text-sm font-bold shadow-md disabled:opacity-50 hover:-translate-y-0.5 transition-all flex items-center gap-1.5">
                  {saving === 'password' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Platform Links ── */}
        {isAdmin && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-[15px] font-bold text-slate-900 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Platform Links</h3>
            <div className="space-y-2">
              {[
                { label: 'Firebase Console', href: 'https://console.firebase.google.com/project/scholarly-echo', icon: Database, desc: 'Manage Firestore, Auth, Hosting' },
                { label: 'Google Analytics', href: 'https://analytics.google.com', icon: Globe, desc: 'Traffic & user behavior data' },
                { label: 'GitHub Repository', href: 'https://github.com/scholarlyecho/scholarlywebapp', icon: ExternalLink, desc: 'Source code & deployments' },
              ].map(({ label, href, icon: Icon, desc }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 hover:border-brand-200 hover:shadow-sm transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-brand-600 transition-colors">{label}</p>
                    <p className="text-[11px] text-slate-400">{desc}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-400 transition-colors" />
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Firebase Info (Admin only) ── */}
        {isAdmin && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
            <h3 className="text-[15px] font-bold text-slate-900 mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Firebase Configuration</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              {[
                { label: 'Project ID', value: 'scholarly-echo' },
                { label: 'Auth Domain', value: 'scholarly-echo.firebaseapp.com' },
                { label: 'Hosting', value: 'scholarly-echo.web.app' },
                { label: 'Measurement ID', value: 'G-4ZJL7K6PQB' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-lg p-3 border border-slate-100">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">{label}</span>
                  <span className="text-slate-700 font-mono text-[11px]">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
