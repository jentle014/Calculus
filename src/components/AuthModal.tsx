import React, { useState } from 'react';
import { X, User, Mail, Lock, Building, GraduationCap, LogOut, CheckCircle2, Wifi, WifiOff, ShieldCheck, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sanitizeErrorText } from '../utils/cleanError';
import { ModalWatermark } from './Watermark';
import { ADMIN_EMAIL } from '../services/userService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminModal?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onOpenAdminModal }) => {
  const { user, profile, register, login, logout, isOffline } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register'>('register');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [school, setSchool] = useState('');

  // Status & error handling
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAdmin =
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
    profile?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        if (!email.trim() || !password || !name.trim() || !department.trim() || !school.trim()) {
          setError('Please fill out all fields (Email, Password, Name, Department, and School).');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }

        await register(email, password, name, department, school);
        setSuccessMsg(
          email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
            ? 'Administrator account registered successfully! Full access granted.'
            : 'Account registered successfully! Profile saved to device.'
        );
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        if (!email.trim() || !password) {
          setError('Please enter both your email and password.');
          setIsSubmitting(false);
          return;
        }

        await login(email, password);
        setSuccessMsg(
          email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
            ? 'Signed in as Administrator! Access granted.'
            : 'Signed in successfully! Progress synced.'
        );
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      console.error('Authentication Error:', err);
      let message = 'An authentication error occurred. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'This email address is already registered. Switching to Sign In mode for you.';
        setMode('signin');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password credentials.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (err.message) {
        message = sanitizeErrorText(err.message);
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#151310] border border-[#2e271d] shadow-2xl p-6 space-y-6 text-[#f4ecd8] relative overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2e271d]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#231e17] border border-[#3e3223]">
              <User className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-classical text-[#f8f2e4]">
                {user ? (isAdmin ? 'Admin Account' : 'User Account') : mode === 'register' ? 'Create Account' : 'Account Sign In'}
              </h2>
              <p className="text-xs text-[#b8a78a] font-writeup">
                {user ? 'Account Profile & Cloud Sync' : 'Sign in or create an account to access practice questions & sync progress'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#28221b] text-[#b8a78a] hover:text-[#f8f2e4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline Network Status Indicator */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#1e1a14] border border-[#322a1f] text-xs font-mono">
          <span className="flex items-center gap-2 text-[#c8b89a]">
            {isOffline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
            <span>Network Status: {isOffline ? 'Offline (Saved Locally)' : 'Online (Connected)'}</span>
          </span>
          <span className="text-[10px] text-[#d4af37] uppercase font-bold bg-[#282117] px-2 py-0.5 rounded border border-[#483a26]">
            Offline Ready
          </span>
        </div>

        {/* LOGGED IN ACCOUNT VIEW */}
        {user && profile ? (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-4 rounded-xl bg-[#1d1914] border border-[#322a1f] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#282117] border border-[#483a26] text-[#d4af37] font-bold text-lg flex items-center justify-center font-classical">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#f8f2e4] font-classical flex items-center gap-2">
                      {profile.name}
                      {isAdmin && (
                        <span className="text-[10px] font-mono uppercase bg-[#382810] text-[#f3d17c] px-2 py-0.5 rounded border border-[#d4af37]">
                          Admin
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[#b8a78a] font-mono">{profile.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#2e271d] text-xs">
                <div className="space-y-0.5">
                  <span className="text-[#8a7a60] font-mono text-[11px] block uppercase">Department</span>
                  <span className="text-[#f4ecd8] font-medium font-writeup block">{profile.department}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[#8a7a60] font-mono text-[11px] block uppercase">School / Institution</span>
                  <span className="text-[#f4ecd8] font-medium font-writeup block">{profile.school}</span>
                </div>
              </div>
            </div>

            {isAdmin ? (
              <div className="p-3.5 rounded-xl bg-[#282012] border border-[#524128] text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#f3d17c] font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                    Administrator Privileges Active
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700 font-mono uppercase font-bold">
                    Full Access
                  </span>
                </div>
                <p className="text-[#c8b89a] text-xs leading-relaxed font-writeup">
                  You are logged in as the System Administrator. You can generate one-time support activation tokens and manage user activation status.
                </p>
                {onOpenAdminModal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminModal();
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e4bf47] text-black font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow"
                  >
                    <Key className="w-4 h-4" />
                    <span>Open Admin Token Console</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#231e17] border border-[#423726] text-xs font-writeup text-[#e8dec5] space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#d4af37] font-mono">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                  <span>Offline Storage Enabled</span>
                </div>
                <p className="leading-relaxed text-[#c8b89a]">
                  All calculus questions, solution steps, user formula references, and quiz performance metrics are loaded onto this device.
                </p>
              </div>
            )}

            <button
              onClick={async () => {
                await logout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1a1714] hover:bg-[#25201a] text-[#e5c158] border border-[#3e3425] text-xs font-bold font-mono transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Account</span>
            </button>
          </div>
        ) : (
          /* REGISTRATION & LOGIN FORM */
          <div className="space-y-4">
            {/* Mode Switch Tabs (Register vs Sign In) */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#1d1914] border border-[#322a1f] text-xs font-medium font-mono">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`py-2 rounded-lg transition-colors ${
                  mode === 'register'
                    ? 'bg-[#282117] text-[#d4af37] font-bold border border-[#483a26]'
                    : 'text-[#8a7a60] hover:text-[#f4ecd8]'
                }`}
              >
                1. Create Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className={`py-2 rounded-lg transition-colors ${
                  mode === 'signin'
                    ? 'bg-[#282117] text-[#d4af37] font-bold border border-[#483a26]'
                    : 'text-[#8a7a60] hover:text-[#f4ecd8]'
                }`}
              >
                2. Sign In
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#2d1a1a] border border-red-900/60 text-red-300 text-xs font-mono leading-relaxed">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-[#1b281d] border border-emerald-900/60 text-emerald-300 text-xs font-mono leading-relaxed flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name field (Registration only) */}
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#b8a78a] uppercase font-bold block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8a7a60] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Isaac Newton"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1d1914] border border-[#382f22] text-xs text-[#f4ecd8] placeholder-[#8a7a60] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>
              )}

              {/* Email address */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#b8a78a] uppercase font-bold block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8a7a60] absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="e.g. scholar@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1d1914] border border-[#382f22] text-xs text-[#f4ecd8] placeholder-[#8a7a60] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#b8a78a] uppercase font-bold block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8a7a60] absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1d1914] border border-[#382f22] text-xs text-[#f4ecd8] placeholder-[#8a7a60] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Department & School (Registration only) */}
              {mode === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#b8a78a] uppercase font-bold block">
                      Department
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-[#8a7a60] absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Mathematics"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1d1914] border border-[#382f22] text-xs text-[#f4ecd8] placeholder-[#8a7a60] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#b8a78a] uppercase font-bold block">
                      School / College
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-[#8a7a60] absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Science Academy"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1d1914] border border-[#382f22] text-xs text-[#f4ecd8] placeholder-[#8a7a60] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#c9a24d] hover:bg-[#d8b45c] text-black font-bold text-xs sm:text-sm font-classical tracking-wide shadow-lg disabled:opacity-50 transition-all mt-4"
              >
                {isSubmitting
                  ? 'Processing...'
                  : mode === 'register'
                  ? 'Create Account & Save Profile'
                  : 'Sign In to Account'}
              </button>
            </form>
          </div>
        )}

        <ModalWatermark />
      </div>
    </div>
  );
};


