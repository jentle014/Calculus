import React, { useState } from 'react';
import { X, Key, Lock, CheckCircle2, ShieldCheck, AlertCircle, HelpCircle, HardDriveDownload, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { redeemToken } from '../services/userService';
import { sanitizeErrorText } from '../utils/cleanError';
import { ModalWatermark } from './Watermark';

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal?: () => void;
}

export const ActivationModal: React.FC<ActivationModalProps> = ({
  isOpen,
  onClose,
  onOpenAuthModal
}) => {
  const { user, profile, updateLocalProfile } = useAuth();
  const [tokenInput, setTokenInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!user || !profile) {
      setErrorMsg('Please register or sign in to your student account first before activating your token.');
      return;
    }

    if (!tokenInput.trim()) {
      setErrorMsg('Please enter a valid support activation token.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await redeemToken(tokenInput, profile);
      if (res.success) {
        setSuccessMsg(res.message);
        if (res.updatedProfile) {
          updateLocalProfile(res.updatedProfile);
        }
        setTimeout(() => {
          onClose();
        }, 2200);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(sanitizeErrorText(err.message) || 'Activation failed. Please check network or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#08080b] border border-[#22222a] shadow-2xl p-6 space-y-6 text-[#ffffff] relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1c1c24]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#14141a] border border-[#2a2a35]">
              <Key className="w-5 h-5 text-[#e5c158]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-classical text-[#ffffff]">
                Support Activation Token
              </h2>
              <p className="text-xs text-[#a0a0b0] font-writeup">
                Unlock answers, hints & image diagrams offline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#181820] text-[#a0a0b0] hover:text-[#ffffff] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lock Banner / Description */}
        <div className="p-4 rounded-xl bg-[#101015] border border-[#22222c] space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#e5c158] font-bold font-mono uppercase tracking-wider">
            <Lock className="w-4 h-4 text-[#e5c158]" />
            <span>Support Token Access & Offline Sync</span>
          </div>
          <p className="text-[#d0d0d8] leading-relaxed font-writeup">
            Activating a valid token permanently unlocks answer options, text hints, step-by-step solutions, and synchronizes all calculus concept image diagrams directly to your device for offline study.
          </p>
        </div>

        {/* Activation Form */}
        <form onSubmit={handleRedeem} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#2b1616] border border-red-900/60 text-red-300 text-xs font-mono leading-relaxed flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-[#142618] border border-emerald-900/60 text-emerald-300 text-xs font-mono leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Device Activated Successfully!</span>
              </div>
              <p className="text-[11px] text-emerald-200 leading-snug">{successMsg}</p>
              <div className="flex items-center gap-3 pt-1 border-t border-emerald-900/40 text-[10px] text-emerald-300 font-mono">
                <span className="flex items-center gap-1">
                  <HardDriveDownload className="w-3 h-3 text-emerald-400" />
                  111 Qs Synced Offline
                </span>
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-emerald-400" />
                  Image Hints Saved
                </span>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#a0a0b0] uppercase font-bold block">
              Enter Support Activation Code
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#808090] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="e.g. CALC-7X9B-4M2P"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#121217] border border-[#262632] text-sm text-[#ffffff] font-mono tracking-widest uppercase placeholder-[#808090] focus:outline-none focus:border-[#e5c158]"
              />
            </div>
            <p className="text-[11px] text-[#808090] font-mono pt-1">
              Valid token activation automatically caches question bank & image hints to local storage for offline use.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !tokenInput.trim()}
            className="w-full py-3 rounded-xl bg-[#e5c158] hover:bg-[#f3d172] text-black font-bold text-xs sm:text-sm font-classical tracking-wide shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-black" />
            <span>{isSubmitting ? 'Verifying Token & Syncing Offline...' : 'Unlock App & Sync Image Hints'}</span>
          </button>
        </form>

        <ModalWatermark />
      </div>
    </div>
  );
};
