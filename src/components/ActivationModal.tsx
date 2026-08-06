import React, { useState } from 'react';
import { X, Key, Lock, CheckCircle2, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { redeemToken } from '../services/userService';
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
        }, 1800);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Activation failed. Please check network or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#151310] border border-[#2e271d] shadow-2xl p-6 space-y-6 text-[#f4ecd8] relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2e271d]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#282117] border border-[#483a26]">
              <Key className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-classical text-[#f8f2e4]">
                Support Activation Token
              </h2>
              <p className="text-xs text-[#b8a78a] font-writeup">
                Unlock answers, hints & detail solution images
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

        {/* Lock Banner / Description */}
        <div className="p-4 rounded-xl bg-[#1d1914] border border-[#3e3223] space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#d4af37] font-bold font-mono uppercase tracking-wider">
            <Lock className="w-4 h-4 text-[#d4af37]" />
            <span>Support Token Access Policy</span>
          </div>
          <p className="text-[#c8b89a] leading-relaxed font-writeup">
            By system requirement, hints, answer options, and step-by-step detail solution diagrams are locked by default. Obtain an activation token from support to permanently unlock all study resources on this device.
          </p>
        </div>

        {/* Activation Form */}
        <form onSubmit={handleRedeem} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#2d1a1a] border border-red-900/60 text-red-300 text-xs font-mono leading-relaxed flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-[#1b281d] border border-emerald-900/60 text-emerald-300 text-xs font-mono leading-relaxed flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#b8a78a] uppercase font-bold block">
              Enter Support Activation Code
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#8a7a60] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="e.g. CALC-7X9B-4M2P"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1d1914] border border-[#382f22] text-sm text-[#f4ecd8] font-mono tracking-widest uppercase placeholder-[#8a7a60] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <p className="text-[11px] text-[#8a7a60] font-mono pt-1">
              Activating a valid token permanently unlocks the app on this device and stores activation offline.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !tokenInput.trim()}
            className="w-full py-3 rounded-xl bg-[#c9a24d] hover:bg-[#d8b45c] text-black font-bold text-xs sm:text-sm font-classical tracking-wide shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Verifying Token...' : 'Unlock App on This Device'}</span>
          </button>
        </form>

        <ModalWatermark />
      </div>
    </div>
  );
};
