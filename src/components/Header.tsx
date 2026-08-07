import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Settings,
  Home,
  Plus,
  User as UserIcon,
  ShieldCheck,
  Key,
  CheckCircle2,
  MoreVertical,
  X
} from 'lucide-react';
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050505]/95 border-b border-[#1c1c22] backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo / Back Button */}
        <div className="flex items-center gap-3">
          {currentScreen !== 'home' ? (
            <button
              onClick={onGoHome}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111115] hover:bg-[#1a1a20] text-[#d0d0d8] hover:text-[#ffffff] border border-[#262630] transition-all text-xs sm:text-sm font-medium"
              title="Return to Home Screen"
            >
              <Home className="w-4 h-4 text-[#e5c158]" />
              <span className="hidden sm:inline font-mono">Home</span>
            </button>
          ) : null}

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onGoHome}>
            <div className="w-8 h-8 rounded-lg bg-[#e5c158] text-black font-extrabold flex items-center justify-center text-lg shadow-inner font-classical">
              ∫
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#ffffff] font-classical flex items-center gap-2">
                Calculus
                <span className="text-[10px] font-mono uppercase bg-[#18181f] text-[#e5c158] px-2 py-0.5 rounded border border-[#2a2a35] hidden md:inline-block">
                  Mastery Suite
                </span>
              </h1>
              {topicName && currentScreen === 'quiz' && (
                <p className="text-xs text-[#a0a0b0] font-writeup truncate max-w-[180px] sm:max-w-xs">
                  {topicName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Center / Mode Badge */}
        {currentScreen === 'quiz' && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border bg-[#14141a] text-[#e5c158] border-[#2a2a35]">
              {mode === 'study' ? 'Guided Study Mode' : mode === 'qa' ? 'Q&A Mode' : 'Speed Test Mode'}
            </span>
          </div>
        )}

        {/* Right Side Tools & Three Dots Menu */}
        <div className="flex items-center gap-2.5">
          {/* Activation Status Badge */}
          <button
            onClick={onOpenActivationModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              activated
                ? 'bg-[#0f2416] text-emerald-400 border-emerald-900/80 font-bold'
                : 'bg-[#14141a] hover:bg-[#1a1a22] text-[#e5c158] border-[#2a2a35]'
            }`}
            title={activated ? 'Device Activated' : 'Enter Support Token'}
          >
            {activated ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Activated</span>
              </>
            ) : (
              <>
                <Key className="w-3.5 h-3.5 text-[#e5c158]" />
                <span className="hidden sm:inline font-bold">Token</span>
              </>
            )}
          </button>

          {/* User Registration/Auth Button */}
          <button
            onClick={onOpenAuthModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
              user
                ? 'bg-[#181820] hover:bg-[#22222c] text-[#e5c158] border-[#2a2a35]'
                : 'bg-[#e5c158] hover:bg-[#f3d172] text-black border-[#e5c158] font-bold'
            }`}
            title="User Profile & Registration"
          >
            <UserIcon className={`w-4 h-4 ${user ? 'text-[#e5c158]' : 'text-black'}`} />
            <span className="font-classical font-bold">
              {user ? (profile?.name ? profile.name.split(' ')[0] : 'Account') : 'Login'}
            </span>
          </button>

          {/* Three Dots Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className={`p-2 rounded-lg border transition-all ${
                isMenuOpen
                  ? 'bg-[#e5c158] text-black border-[#e5c158]'
                  : 'bg-[#111115] hover:bg-[#1a1a20] text-[#d0d0d8] hover:text-[#ffffff] border border-[#262630]'
              }`}
              title="More Options & Tools"
              aria-label="More options"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <MoreVertical className="w-5 h-5" />}
            </button>

            {/* Dropdown Menu List */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0b0b0e] border border-[#262632] shadow-2xl py-2 z-50 text-sm font-sans animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-[#1c1c24] mb-1">
                  <p className="text-[11px] font-mono uppercase text-[#808090] font-bold tracking-wider">
                    Menu & Tools
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenFormulaSheet();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[#f0f0f5] hover:bg-[#181822] hover:text-[#e5c158] transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-[#e5c158]" />
                  <div className="flex flex-col">
                    <span className="font-medium">Calculus Formula Sheet</span>
                    <span className="text-[11px] text-[#808090]">Derivatives, Integrals, Series</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenCustomQuestionModal();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[#f0f0f5] hover:bg-[#181822] hover:text-[#e5c158] transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#e5c158]" />
                  <div className="flex flex-col">
                    <span className="font-medium">Add Custom Questions</span>
                    <span className="text-[11px] text-[#808090]">Import CSV/JSON or custom Bank</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[#f0f0f5] hover:bg-[#181822] hover:text-[#e5c158] transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#e5c158]" />
                  <div className="flex flex-col">
                    <span className="font-medium">Quiz Settings</span>
                    <span className="text-[11px] text-[#808090]">Timer, Questions Count, Mode</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenActivationModal();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[#f0f0f5] hover:bg-[#181822] hover:text-[#e5c158] transition-colors"
                >
                  <Key className="w-4 h-4 text-[#e5c158]" />
                  <div className="flex flex-col">
                    <span className="font-medium">Activation Token</span>
                    <span className="text-[11px] text-[#808090]">
                      {activated ? 'Device Unlocked (Offline)' : 'Enter token to unlock'}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAuthModal();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[#f0f0f5] hover:bg-[#181822] hover:text-[#e5c158] transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-[#e5c158]" />
                  <div className="flex flex-col">
                    <span className="font-medium">Account Profile</span>
                    <span className="text-[11px] text-[#808090]">
                      {user ? `Logged in as ${user.email}` : 'Login to save questions'}
                    </span>
                  </div>
                </button>

                {isAdmin && onOpenAdminModal && (
                  <div className="pt-1 mt-1 border-t border-[#1c1c24]">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenAdminModal();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[#f3d17c] bg-[#1a150a]/80 hover:bg-[#28200d] transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#e5c158]" />
                      <div className="flex flex-col">
                        <span className="font-bold font-mono text-xs">Admin Console</span>
                        <span className="text-[10px] text-[#b8a78a]">Manage Activation Tokens</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};



