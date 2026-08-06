import React from 'react';
import { X, Settings, Shuffle, Clock, BookOpen, HelpCircle, FileCheck2 } from 'lucide-react';
import { QuizSettings, QuizMode } from '../types';
import { ModalWatermark } from './Watermark';

interface SettingsModalProps {
  isOpen: boolean;
  settings: QuizSettings;
  onClose: () => void;
  onSaveSettings: (newSettings: QuizSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSaveSettings
}) => {
  const [localSettings, setLocalSettings] = React.useState<QuizSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const counts: (number | 'all')[] = [5, 10, 15, 20, 'all'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#121215] border border-zinc-800 shadow-2xl p-6 space-y-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
              <Settings className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Quiz & Study Settings</h2>
              <p className="text-xs text-zinc-400">Customize your session parameters</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setting 1: Question Count */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-semibold">
            Questions per Quiz
          </label>
          <div className="grid grid-cols-5 gap-2">
            {counts.map((c) => (
              <button
                key={String(c)}
                type="button"
                onClick={() => setLocalSettings((prev) => ({ ...prev, count: c }))}
                className={`py-2 px-3 rounded-lg border text-xs font-mono font-bold transition-all ${
                  localSettings.count === c
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800'
                }`}
              >
                {c === 'all' ? 'ALL' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Setting 2: Quiz Mode Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-semibold">
            Study Mode Selection
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setLocalSettings((prev) => ({ ...prev, mode: 'study' }))}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                localSettings.mode === 'study'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Study Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setLocalSettings((prev) => ({ ...prev, mode: 'qa' }))}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                localSettings.mode === 'qa'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Q&A Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setLocalSettings((prev) => ({ ...prev, mode: 'test' }))}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                localSettings.mode === 'test'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Test Mode</span>
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 pt-1">
            {localSettings.mode === 'study'
              ? 'Step-by-step disclosure, pattern hints, and instant review on wrong answers.'
              : localSettings.mode === 'qa'
              ? 'Q&A Mode: Topic selection is optional. Hints available on demand, submit answers whenever ready.'
              : 'Standard timed exam mode with direct question grid and final submission.'}
          </p>
        </div>

        {/* Setting 3: Randomize Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center gap-3">
            <Shuffle className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-sm font-medium">Randomize Question Order</p>
              <p className="text-xs text-zinc-400">Shuffle questions and answer options every time</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={localSettings.randomize}
            onChange={(e) => setLocalSettings((prev) => ({ ...prev, randomize: e.target.checked }))}
            className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
          />
        </div>

        {/* Setting 4: Timer Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-sm font-medium">Show Active Timer</p>
              <p className="text-xs text-zinc-400">Track total time spent on quiz</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={localSettings.timer}
            onChange={(e) => setLocalSettings((prev) => ({ ...prev, timer: e.target.checked }))}
            className="w-5 h-5 accent-white rounded cursor-pointer"
          />
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              onSaveSettings(localSettings);
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-sm transition-all shadow-lg"
          >
            Apply & Save Settings
          </button>
        </div>

        <ModalWatermark />
      </div>
    </div>
  );
};
