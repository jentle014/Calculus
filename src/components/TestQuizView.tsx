import React from 'react';
import { ShuffledQuestion } from '../types';
import { ChevronLeft, ChevronRight, Clock, Flag, LayoutGrid, CheckCircle2, Lock, Key } from 'lucide-react';
import { formatTime } from '../utils/quizUtils';
import { useAuth } from '../context/AuthContext';
import { isUserActivated } from '../services/userService';
import { cleanMathText } from '../utils/mathUtils';

interface TestQuizViewProps {
  question: ShuffledQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswers: (number | null)[];
  flaggedQuestions: boolean[];
  elapsedSeconds: number;
  showTimer: boolean;
  onSelectOption: (optionIdx: number) => void;
  onToggleFlag: (idx: number) => void;
  onJumpToQuestion: (idx: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmitExam: () => void;
  onOpenActivationModal?: () => void;
}

export const TestQuizView: React.FC<TestQuizViewProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswers,
  flaggedQuestions,
  elapsedSeconds,
  showTimer,
  onSelectOption,
  onToggleFlag,
  onJumpToQuestion,
  onPrevious,
  onNext,
  onSubmitExam,
  onOpenActivationModal
}) => {
  const { profile } = useAuth();
  const isActivated = isUserActivated(profile);

  const [showGridDrawer, setShowGridDrawer] = React.useState<boolean>(false);
  const selectedOption = selectedAnswers[currentIndex];
  const isFlagged = flaggedQuestions[currentIndex];

  const answeredCount = selectedAnswers.filter((a) => a !== null).length;

  const handleOptionClick = (idx: number) => {
    if (!isActivated) {
      if (onOpenActivationModal) onOpenActivationModal();
      return;
    }
    onSelectOption(idx);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Test Bar Header */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#131316] border border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            EXAM QUESTION {currentIndex + 1} / {totalQuestions}
          </span>
          <span className="hidden sm:inline text-xs text-zinc-500 font-mono">
            ({answeredCount} Answered)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {showTimer && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 font-mono text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          )}

          <button
            onClick={() => setShowGridDrawer((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition-colors"
          >
            <LayoutGrid className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Map</span>
          </button>

          <button
            onClick={() => onToggleFlag(currentIndex)}
            className={`p-2 rounded-lg border transition-colors ${
              isFlagged
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
            title="Flag for Review"
          >
            <Flag className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Question Map Grid Drawer */}
      {showGridDrawer && (
        <div className="p-4 rounded-xl bg-zinc-900/95 border border-zinc-800 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>QUESTION MAP</span>
            <span>Click any number to jump</span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const isAns = selectedAnswers[idx] !== null;
              const isFlg = flaggedQuestions[idx];
              const isCurr = idx === currentIndex;

              let style = 'bg-zinc-800/80 text-zinc-400 border-zinc-700';
              if (isAns) style = 'bg-emerald-950/80 text-emerald-400 border-emerald-800 font-bold';
              if (isFlg) style = 'bg-amber-950/80 text-amber-400 border-amber-800 font-bold';
              if (isCurr) style += ' ring-2 ring-white text-white font-extrabold';

              return (
                <button
                  key={idx}
                  onClick={() => {
                    onJumpToQuestion(idx);
                    setShowGridDrawer(false);
                  }}
                  className={`h-9 rounded-lg border text-xs font-mono flex items-center justify-center transition-all ${style}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="rounded-2xl bg-[#131316] border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-zinc-500 tracking-widest">Formal Assessment</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug tracking-tight font-serif">
            {cleanMathText(question.q)}
          </h2>
          {question.imageUrl && (
            <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-black max-h-72 sm:max-h-96 flex items-center justify-center my-2 p-2">
              <img
                src={question.imageUrl}
                alt="Question Diagram Attachment"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-semibold">
            Choose exact answer option:
          </p>

          {!isActivated ? (
            <div className="p-5 rounded-xl bg-[#251e16] border border-[#483a26] text-center space-y-3">
              <Lock className="w-6 h-6 text-[#d4af37] mx-auto" />
              <p className="text-xs font-mono text-[#f4ecd8] font-bold">
                Exam Answer Options Locked
              </p>
              <p className="text-xs text-[#c8b89a] max-w-md mx-auto font-writeup">
                You are currently in unactivated online preview mode (questions only). Enter your support token to unlock answer submission and full exam evaluation.
              </p>
              {onOpenActivationModal && (
                <button
                  onClick={onOpenActivationModal}
                  className="px-4 py-2 rounded-xl bg-[#c9a24d] hover:bg-[#d8b45c] text-black font-bold text-xs font-mono transition-all inline-flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Enter Support Activation Token</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {question.options.map((opt, idx) => {
                const optionLetter = String.fromCharCode(65 + idx);
                const isSelected = selectedOption === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    className={`w-full text-left flex items-center justify-between p-4 rounded-xl border text-sm transition-all duration-200 ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-500 text-white font-bold shadow-md'
                        : 'bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-200 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg border font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 text-black border-emerald-400'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                        }`}
                      >
                        {optionLetter}
                      </span>
                      <span className="font-mono text-sm leading-snug">{cleanMathText(opt)}</span>
                    </div>

                    {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="pt-6 border-t border-zinc-800 flex items-center justify-between gap-4">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 border border-zinc-800 text-xs font-semibold transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onSubmitExam}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-rose-950 text-rose-300 border border-zinc-800 text-xs font-semibold transition-colors"
            >
              Submit Exam
            </button>

            {currentIndex < totalQuestions - 1 && (
              <button
                onClick={onNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs sm:text-sm transition-all shadow-lg hover:scale-[1.02]"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
