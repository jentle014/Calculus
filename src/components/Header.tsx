import React from 'react';
import { BookOpen, Settings, Home, Plus, User as UserIcon, ShieldCheck, Key, Lock, CheckCircle2 } from 'lucide-react';
import { QuizMode } from '../types';
import { useAuth } from '../context/AuthContext';
import { isUserActivated, ADMIN_EMAIL } from '../services/userService';

interface HeaderProps {
  currentScreen: 'home' | 'quiz' | 'results';
  topicName?: string;
  mode: QuizMode;
  onGoHome: () => void;
  onOpenSettings: () => void;
  onOpenFormulaSheet: () => void;
  onOpenCustomQuestionModal: () => void;
  onOpenAuthModal: () => void;
  onOpenActivationModal: () => void;
  onOpenAdminModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  topicName,
  mode,
  onGoHome,
  onOpenSettings,
  onOpenFormulaSheet,
  onOpenCustomQuestionModal,
  onOpenAuthModal,
  onOpenActivationModal,
  onOpenAdminModal
}) => {
  const { user, profile } = useAuth();
  const activated = isUserActivated(profile);
  const isAdmin =
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
    profile?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#100e0c]/95 border-b border-[#2e271d] backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo / Back Button */}
        <div className="flex items-center gap-3">
          {currentScreen !== 'home' ? (
            <button
              onClick={onGoHome}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1e1a14] hover:bg-[#28221b] text-[#c8b89a] hover:text-[#f8f2e4] border border-[#382f22] transition-all text-xs sm:text-sm font-medium"
              title="Return to Home Screen"
            >
              <Home className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden sm:inline font-mono">Home</span>
            </button>
          ) : null}

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onGoHome}>
            <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-black font-extrabold flex items-center justify-center text-lg shadow-inner font-classical">
              ∫
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#f8f2e4] font-classical flex items-center gap-2">
                Calculus
                <span className="text-[10px] font-mono uppercase bg-[#282117] text-[#d4af37] px-2 py-0.5 rounded border border-[#483a26] hidden md:inline-block">
                  Mastery Suite
                </span>
              </h1>
              {topicName && currentScreen === 'quiz' && (
                <p className="text-xs text-[#b8a78a] font-writeup truncate max-w-[180px] sm:max-w-xs">
                  {topicName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Center / Mode Badge */}
        {currentScreen === 'quiz' && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border bg-[#282117] text-[#d4af37] border-[#483a26]">
              {mode === 'study' ? 'Guided Study Mode' : mode === 'qa' ? 'Q&A Mode' : 'Speed Test Mode'}
            </span>
          </div>
        )}

        {/* Right Side Tools & Account Profile */}
        <div className="flex items-center gap-2">
          {/* Admin Button */}
          {isAdmin && onOpenAdminModal && (
            <button
              onClick={onOpenAdminModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2b1f0d] hover:bg-[#382810] text-[#f3d17c] border border-[#d4af37]/60 text-xs font-mono font-bold transition-all shadow"
              title="Admin Console"
            >
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden lg:inline">Admin Console</span>
            </button>
          )}

          {/* Activation Status / Redeem Token */}
          <button
            onClick={onOpenActivationModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              activated
                ? 'bg-[#18261a] text-emerald-400 border-emerald-900/80 font-bold'
                : 'bg-[#282117] hover:bg-[#382d1c] text-[#d4af37] border-[#483a26]'
            }`}
            title={activated ? 'Account Activated (Offline Enabled)' : 'Enter Support Token to Unlock Hints & Answers'}
          >
            {activated ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Activated</span>
              </>
            ) : (
              <>
                <Key className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="hidden sm:inline font-bold">Enter Token</span>
              </>
            )}
          </button>

          {/* User Registration/Auth */}
          <button
            onClick={onOpenAuthModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
              user
                ? 'bg-[#251f16] hover:bg-[#342a1d] text-[#d4af37] border-[#483a26]'
                : 'bg-[#c9a24d] hover:bg-[#d8b45c] text-black border-[#d8b45c] font-bold'
            }`}
            title="User Profile & Registration"
          >
            {user ? (
              <>
                <UserIcon className="w-4 h-4 text-[#d4af37]" />
                <span className="hidden md:inline truncate max-w-[100px] font-classical">
                  {profile?.name || 'Account'}
                </span>
              </>
            ) : (
              <>
                <UserIcon className="w-4 h-4 text-black" />
                <span className="font-classical font-bold">Register</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenFormulaSheet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e1a14] hover:bg-[#28221b] text-[#c8b89a] hover:text-[#f8f2e4] border border-[#382f22] text-xs sm:text-sm font-medium transition-colors"
            title="Calculus Formula Cheat Sheet"
          >
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span className="hidden xl:inline font-mono">Formulas</span>
          </button>

          <button
            onClick={onOpenCustomQuestionModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e1a14] hover:bg-[#28221b] text-[#c8b89a] hover:text-[#f8f2e4] border border-[#382f22] text-xs sm:text-sm font-medium transition-colors"
            title="Import or Add Custom Questions"
          >
            <Plus className="w-4 h-4 text-[#d4af37]" />
            <span className="hidden xl:inline font-mono">Add Qs</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-[#1e1a14] hover:bg-[#28221b] text-[#c8b89a] hover:text-[#f8f2e4] border border-[#382f22] transition-colors"
            title="Quiz Settings"
          >
            <Settings className="w-4 h-4 text-[#d4af37]" />
          </button>
        </div>
      </div>
    </header>
  );
};



