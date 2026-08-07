import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Play,
  FileCheck2,
  Clock,
  CheckSquare,
  Square,
  RotateCcw,
  BookOpen,
  Shuffle,
  Compass,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { QuizMode, QuizSettings } from '../types';
import { TOPIC_SECTIONS } from '../data/questionBank';
import { ModalWatermark } from './Watermark';

interface QuizLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopicIds?: string[];
  initialMode?: QuizMode;
  settings: QuizSettings;
  customQuestionsCount: number;
  onStartQuiz: (
    topicIds: string[],
    count: number | 'all',
    mode: QuizMode,
    timerEnabled: boolean,
    randomize: boolean
  ) => void;
}

export const QuizLaunchModal: React.FC<QuizLaunchModalProps> = ({
  isOpen,
  onClose,
  initialTopicIds = [],
  initialMode = 'qa',
  settings,
  customQuestionsCount,
  onStartQuiz
}) => {
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [mode, setMode] = useState<QuizMode>(initialMode);
  const [count, setCount] = useState<number | 'all'>(settings.count || 20);
  const [timerEnabled, setTimerEnabled] = useState<boolean>(settings.timer);
  const [randomize, setRandomize] = useState<boolean>(settings.randomize ?? true);

  useEffect(() => {
    if (isOpen) {
      if (!initialTopicIds || initialTopicIds.length === 0 || initialTopicIds.includes('all')) {
        setSelectedTopicIds(TOPIC_SECTIONS.map((s) => s.id));
      } else {
        setSelectedTopicIds(initialTopicIds);
      }
      setMode(initialMode || settings.mode || 'qa');
      setCount(settings.count || 20);
      setTimerEnabled(settings.timer);
      setRandomize(settings.randomize ?? true);
    }
  }, [isOpen, initialTopicIds, initialMode, settings]);

  if (!isOpen) return null;

  const toggleTopic = (id: string) => {
    setSelectedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const all = TOPIC_SECTIONS.map((s) => s.id);
    if (customQuestionsCount > 0) {
      all.push('custom');
    }
    setSelectedTopicIds(all);
  };

  const handleClearAll = () => {
    setSelectedTopicIds([]);
  };

  const handlePreset = (category: string) => {
    if (category === 'Calc1') {
      setSelectedTopicIds(['functions', 'limits', 'differentiation', 'stationary']);
    } else if (category === 'Calc2') {
      setSelectedTopicIds(['integration', 'applications', 'series', 'challenge']);
    }
  };

  // Calculate estimated questions
  const selectedSections = TOPIC_SECTIONS.filter((s) => selectedTopicIds.includes(s.id));
  let totalAvailableInTopics = selectedSections.reduce((acc, curr) => acc + curr.questionCount, 0);
  if (selectedTopicIds.includes('custom')) {
    totalAvailableInTopics += customQuestionsCount;
  }

  const effectiveCount =
    count === 'all'
      ? totalAvailableInTopics
      : Math.min(count, totalAvailableInTopics || count);

  const counts: (number | 'all')[] = [5, 10, 15, 20, 25, 50, 'all'];

  const handleLaunch = () => {
    if (selectedTopicIds.length === 0) {
      alert('Please select at least one topic to start the quiz.');
      return;
    }
    onStartQuiz(selectedTopicIds, count, mode, timerEnabled, randomize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#08080b] border border-[#22222a] shadow-2xl p-6 space-y-6 text-[#ffffff]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1c1c24]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#14141a] border border-[#2a2a35]">
              <Compass className="w-6 h-6 text-[#e5c158]" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-classical text-[#ffffff]">
                Quiz & Topic Setup
              </h2>
              <p className="text-xs text-[#a0a0b0] font-writeup">
                Choose your topics, set question count & time parameters
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#111115] hover:bg-[#1a1a20] text-[#a0a0b0] hover:text-[#ffffff] border border-[#262630] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: TOPIC SELECTION */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-mono uppercase text-[#e5c158] tracking-wider font-bold flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#e5c158] text-black font-bold flex items-center justify-center text-[10px]">
                1
              </span>
              Choose Topics ({selectedTopicIds.length} Selected)
            </label>

            {/* Quick Action Preset Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-2.5 py-1 rounded-md bg-[#181820] hover:bg-[#22222d] text-[#e5c158] border border-[#2a2a35] text-[11px] font-mono font-bold transition-all"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => handlePreset('Calc1')}
                className="px-2.5 py-1 rounded-md bg-[#111115] hover:bg-[#1a1a20] text-[#d0d0d8] border border-[#262630] text-[11px] font-mono transition-all"
              >
                Calc I
              </button>
              <button
                type="button"
                onClick={() => handlePreset('Calc2')}
                className="px-2.5 py-1 rounded-md bg-[#111115] hover:bg-[#1a1a20] text-[#d0d0d8] border border-[#262630] text-[11px] font-mono transition-all"
              >
                Calc II
              </button>
              {selectedTopicIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-2.5 py-1 rounded-md bg-[#241515] hover:bg-[#331c1c] text-amber-300 border border-amber-900/60 text-[11px] font-mono transition-all flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Topics Checkbox Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-1">
            {TOPIC_SECTIONS.map((sec) => {
              const isChecked = selectedTopicIds.includes(sec.id);
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => toggleTopic(sec.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isChecked
                      ? 'bg-[#14141a] border-[#e5c158] text-[#ffffff] font-bold shadow-md'
                      : 'bg-[#0f0f13] border-[#1f1f26] text-[#a0a0b0] hover:border-[#2a2a35]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-[#e5c158] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-[#808090] shrink-0" />
                    )}
                    <span className="text-xs font-classical truncate">{sec.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#808090] shrink-0 pl-1">
                    {sec.questionCount} Qs
                  </span>
                </button>
              );
            })}

            {customQuestionsCount > 0 && (
              <button
                type="button"
                onClick={() => toggleTopic('custom')}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  selectedTopicIds.includes('custom')
                    ? 'bg-[#14141a] border-[#e5c158] text-[#ffffff] font-bold shadow-md'
                    : 'bg-[#0f0f13] border-[#1f1f26] text-[#a0a0b0] hover:border-[#2a2a35]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {selectedTopicIds.includes('custom') ? (
                    <CheckSquare className="w-4 h-4 text-[#e5c158] shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-[#808090] shrink-0" />
                  )}
                  <span className="text-xs font-classical truncate">Custom Bank</span>
                </div>
                <span className="text-[10px] font-mono text-[#808090] shrink-0 pl-1">
                  {customQuestionsCount} Qs
                </span>
              </button>
            )}
          </div>
        </div>

        {/* STEP 2: NUMBER OF QUESTIONS */}
        <div className="space-y-2 pt-2 border-t border-[#1c1c24]">
          <label className="text-xs font-mono uppercase text-[#e5c158] tracking-wider font-bold flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#e5c158] text-black font-bold flex items-center justify-center text-[10px]">
              2
            </span>
            Number of Questions
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {counts.map((c) => (
              <button
                key={String(c)}
                type="button"
                onClick={() => setCount(c)}
                className={`py-2 px-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                  count === c
                    ? 'bg-[#e5c158] text-black border-[#e5c158] shadow-md scale-105'
                    : 'bg-[#0f0f13] text-[#d0d0d8] border-[#1f1f26] hover:border-[#2a2a35]'
                }`}
              >
                {c === 'all' ? 'ALL' : c}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#808090] font-mono pt-0.5">
            Will prepare <span className="text-[#e5c158] font-bold">{effectiveCount}</span> questions from your selected topics.
          </p>
        </div>

        {/* STEP 3: MODE & TIMER */}
        <div className="space-y-3 pt-2 border-t border-[#1c1c24]">
          <label className="text-xs font-mono uppercase text-[#e5c158] tracking-wider font-bold flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#e5c158] text-black font-bold flex items-center justify-center text-[10px]">
              3
            </span>
            Quiz Mode & Timer Settings
          </label>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setMode('qa')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all ${
                mode === 'qa'
                  ? 'bg-[#14141a] border-[#e5c158] text-[#e5c158] shadow-md font-bold'
                  : 'bg-[#0f0f13] border-[#1f1f26] text-[#a0a0b0] hover:border-[#2a2a35]'
              }`}
            >
              <Zap className="w-4 h-4 text-[#e5c158]" />
              <span>Q&A Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('study')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all ${
                mode === 'study'
                  ? 'bg-[#14141a] border-[#e5c158] text-[#e5c158] shadow-md font-bold'
                  : 'bg-[#0f0f13] border-[#1f1f26] text-[#a0a0b0] hover:border-[#2a2a35]'
              }`}
            >
              <Play className="w-4 h-4 fill-[#e5c158]" />
              <span>Guided Study</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('test')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all ${
                mode === 'test'
                  ? 'bg-[#14141a] border-[#e5c158] text-[#e5c158] shadow-md font-bold'
                  : 'bg-[#0f0f13] border-[#1f1f26] text-[#a0a0b0] hover:border-[#2a2a35]'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-[#e5c158]" />
              <span>Speed Test</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Timer Toggle */}
            <div
              onClick={() => setTimerEnabled((prev) => !prev)}
              className="flex items-center justify-between p-3 rounded-xl bg-[#0f0f13] border border-[#1f1f26] cursor-pointer hover:border-[#2a2a35]"
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#e5c158]" />
                <div>
                  <p className="text-xs font-bold text-[#ffffff]">Active Timer</p>
                  <p className="text-[11px] text-[#808090]">Track time during quiz</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={timerEnabled}
                onChange={() => {}}
                className="w-4 h-4 accent-[#e5c158] rounded cursor-pointer"
              />
            </div>

            {/* Randomize Toggle */}
            <div
              onClick={() => setRandomize((prev) => !prev)}
              className="flex items-center justify-between p-3 rounded-xl bg-[#0f0f13] border border-[#1f1f26] cursor-pointer hover:border-[#2a2a35]"
            >
              <div className="flex items-center gap-2.5">
                <Shuffle className="w-4 h-4 text-[#e5c158]" />
                <div>
                  <p className="text-xs font-bold text-[#ffffff]">Randomize Order</p>
                  <p className="text-[11px] text-[#808090]">Shuffle Qs & answers</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={randomize}
                onChange={() => {}}
                className="w-4 h-4 accent-[#e5c158] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* LAUNCH BUTTON */}
        <div className="pt-3 border-t border-[#1c1c24]">
          <button
            type="button"
            onClick={handleLaunch}
            disabled={selectedTopicIds.length === 0}
            className="w-full py-3.5 rounded-xl bg-[#e5c158] hover:bg-[#f3d172] text-black font-bold text-sm font-classical tracking-wide shadow-xl disabled:opacity-40 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-black fill-black" />
            <span>
              {selectedTopicIds.length === 0
                ? 'Select Topics First'
                : `Start Quiz (${effectiveCount} Questions across ${selectedTopicIds.length} Topics)`}
            </span>
          </button>
        </div>

        <ModalWatermark />
      </div>
    </div>
  );
};
