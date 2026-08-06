import React from 'react';
import { ShuffledQuestion } from '../types';
import { HelpCircle, ChevronLeft, ChevronRight, Flag, CheckCircle, Lock, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isUserActivated } from '../services/userService';

interface QAQuizViewProps {
  question: ShuffledQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  isFlagged: boolean;
  onSelectOption: (optionIdx: number) => void;
  onToggleFlag: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onOpenActivationModal?: () => void;
}

export const QAQuizView: React.FC<QAQuizViewProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isFlagged,
  onSelectOption,
  onToggleFlag,
  onPrevious,
  onNext,
  onSubmit,
  onOpenActivationModal
}) => {
  const { profile } = useAuth();
  const isActivated = isUserActivated(profile);
  const [showHint, setShowHint] = React.useState<boolean>(false);

  React.useEffect(() => {
    setShowHint(false);
  }, [question.id, currentIndex]);

  const handleOptionClick = (idx: number) => {
    if (!isActivated) {
      if (onOpenActivationModal) onOpenActivationModal();
      return;
    }
    onSelectOption(idx);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Progress & Flag Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-[#b8a78a]">
        <span className="font-bold text-[#f4ecd8] uppercase tracking-wider">
          QUESTION {currentIndex + 1} OF {totalQuestions}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleFlag}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-colors border ${
              isFlagged
                ? 'bg-[#282117] text-[#d4af37] border-[#483a26]'
                : 'bg-[#151310] text-[#b8a78a] border-[#2e271d] hover:text-[#f4ecd8]'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{isFlagged ? 'Flagged' : 'Flag Question'}</span>
          </button>
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-[#251f17] overflow-hidden border border-[#322a1f]">
        <div
          className="h-full bg-[#d4af37] transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="rounded-2xl bg-[#151310] border border-[#2e271d] p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-[#d4af37] tracking-widest font-bold">Q&A Mode Assessment</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f4ecd8] leading-snug tracking-tight font-classical">
            {question.q}
          </h2>
        </div>

        {/* Hint Trigger & Expandable Panel */}
        <div className="space-y-2 pt-2">
          {!isActivated ? (
            <div className="p-3.5 rounded-xl bg-[#251e16] border border-[#483a26] text-xs flex items-center justify-between gap-3">
              <span className="text-[#c8b89a] font-mono flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#d4af37]" />
                <span>Hint & Formula Tip Locked (Support Token Required)</span>
              </span>
              {onOpenActivationModal && (
                <button
                  onClick={onOpenActivationModal}
                  className="px-3 py-1.5 rounded-lg bg-[#c9a24d] hover:bg-[#d8b45c] text-black font-bold text-xs font-mono transition-all flex items-center gap-1 shrink-0"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Unlock</span>
                </button>
              )}
            </div>
          ) : (
            question.hint && (
              <>
                <button
                  onClick={() => setShowHint((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#282117] hover:bg-[#342a1d] border border-[#483a26] text-[#d4af37] text-xs font-medium transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-[#d4af37]" />
                  <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                </button>

                {showHint && (
                  <div className="p-4 rounded-xl bg-[#1d1914] border border-[#3e3223] text-[#e8dec5] text-xs font-mono leading-relaxed animate-in fade-in duration-200">
                    <span className="font-bold uppercase tracking-wider block mb-1 text-[#d4af37]">Hint / Formula Tip:</span>
                    {question.hint}
                  </div>
                )}
              </>
            )
          )}
        </div>

        {/* Options Grid */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-mono uppercase text-[#b8a78a] tracking-wider font-semibold">
            Select Your Answer:
          </p>

          {!isActivated ? (
            <div className="p-5 rounded-xl bg-[#251e16] border border-[#483a26] text-center space-y-3">
              <Lock className="w-6 h-6 text-[#d4af37] mx-auto" />
              <p className="text-xs font-mono text-[#f4ecd8] font-bold">
                Answer Options Locked
              </p>
              <p className="text-xs text-[#c8b89a] max-w-md mx-auto font-writeup">
                To load answers and select options, enter your support activation token.
              </p>
              {onOpenActivationModal && (
                <button
                  onClick={onOpenActivationModal}
                  className="px-4 py-2 rounded-xl bg-[#c9a24d] hover:bg-[#d8b45c] text-black font-bold text-xs font-mono transition-all inline-flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Enter Support Token</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {question.options.map((opt, idx) => {
                const optionLetter = String.fromCharCode(65 + idx);
                const isSelected = selectedAnswer === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    className={`w-full text-left flex items-center justify-between p-4 rounded-xl border text-sm transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#251f16] border-[#d4af37] text-[#f4ecd8] font-bold shadow-md'
                        : 'bg-[#1d1914] hover:bg-[#251f16] text-[#e8dec5] border-[#382f22] hover:border-[#483a26]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg border font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#d4af37] text-black border-[#d4af37]'
                            : 'bg-[#151310] border-[#382f22] text-[#b8a78a]'
                        }`}
                      >
                        {optionLetter}
                      </span>
                      <span className="font-mono text-sm leading-snug">{opt}</span>
                    </div>

                    {isSelected && <CheckCircle className="w-5 h-5 text-[#d4af37] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-[#2e271d] flex items-center justify-between gap-4">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1d1914] hover:bg-[#28221b] disabled:opacity-40 text-[#c8b89a] border border-[#382f22] text-xs font-semibold transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-[#d4af37]" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {currentIndex === totalQuestions - 1 ? (
              <button
                onClick={() => {
                  if (!isActivated && onOpenActivationModal) {
                    onOpenActivationModal();
                    return;
                  }
                  onSubmit();
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#c9a24d] hover:bg-[#d8b45c] text-black font-bold text-xs sm:text-sm font-classical transition-all shadow-lg hover:scale-[1.02]"
              >
                <span>Submit Quiz</span>
              </button>
            ) : (
              <button
                onClick={onNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#282117] hover:bg-[#342a1d] text-[#d4af37] border border-[#483a26] font-bold text-xs sm:text-sm transition-all shadow-lg hover:scale-[1.02]"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



