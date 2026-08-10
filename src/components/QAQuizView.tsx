import React from 'react';
import { ShuffledQuestion } from '../types';
import { HelpCircle, ChevronLeft, ChevronRight, Flag, CheckCircle, Lock, Key, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isUserActivated } from '../services/userService';
import { getOfflineImageHint } from '../services/offlineSyncService';
import { cleanMathText } from '../utils/mathUtils';
import derivativesImg from '../assets/images/calculus_derivatives_diagram_1786048382838.jpg';
import integralsImg from '../assets/images/calculus_integrals_area_1786048442186.jpg';
import limitsImg from '../assets/images/calculus_limits_graph_1786048455996.jpg';

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
      <div className="flex items-center justify-between text-xs font-mono text-[#a0a0b0]">
        <span className="font-bold text-[#ffffff] uppercase tracking-wider">
          QUESTION {currentIndex + 1} OF {totalQuestions}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleFlag}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-colors border ${
              isFlagged
                ? 'bg-[#181820] text-[#e5c158] border-[#2a2a35]'
                : 'bg-[#0f0f13] text-[#a0a0b0] border-[#1f1f26] hover:text-[#ffffff]'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-[#e5c158]" />
            <span>{isFlagged ? 'Flagged' : 'Flag Question'}</span>
          </button>
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-[#121217] overflow-hidden border border-[#22222a]">
        <div
          className="h-full bg-[#e5c158] transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="rounded-2xl bg-[#08080a] border border-[#1f1f26] p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-[#e5c158] tracking-widest font-bold">Q&A Mode Assessment</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#ffffff] leading-snug tracking-tight font-classical">
            {cleanMathText(question.q)}
          </h2>
          {question.imageUrl && (
            <div className="relative rounded-xl overflow-hidden border border-[#2a2a35] bg-black max-h-72 sm:max-h-96 flex items-center justify-center my-2 p-2">
              <img
                src={question.imageUrl}
                alt="Question Diagram Attachment"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Hint Trigger & Expandable Panel */}
        <div className="space-y-2 pt-2">
          {!isActivated ? (
            <div className="p-3.5 rounded-xl bg-[#14141c] border border-[#262632] text-xs flex items-center justify-between gap-3">
              <span className="text-[#d0d0d8] font-mono flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#e5c158]" />
                <span>Hint & Formula Tip Locked (Support Token Required)</span>
              </span>
              {onOpenActivationModal && (
                <button
                  onClick={onOpenActivationModal}
                  className="px-3 py-1.5 rounded-lg bg-[#e5c158] hover:bg-[#f3d172] text-black font-bold text-xs font-mono transition-all flex items-center gap-1 shrink-0"
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
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#14141a] hover:bg-[#1a1a22] border border-[#2a2a35] text-[#e5c158] text-xs font-medium transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-[#e5c158]" />
                  <span>{showHint ? 'Hide Hint & Diagram' : 'Show Hint & Diagram'}</span>
                </button>

                {showHint && (
                  <div className="p-4 rounded-xl bg-[#101015] border border-[#22222c] text-[#e8e8f0] text-xs font-mono leading-relaxed space-y-3 animate-in fade-in duration-200">
                    <div>
                      <span className="font-bold uppercase tracking-wider block mb-1 text-[#e5c158]">Hint / Formula Tip:</span>
                      <p>{cleanMathText(question.hint)}</p>
                    </div>

                    {/* Image Hint Diagram */}
                    {(() => {
                      const topic = (question.topic || '').toLowerCase();
                      const text = (question.q || '').toLowerCase();
                      const cached = getOfflineImageHint(topic || text);
                      const fallbackImg = (topic.includes('limit') || text.includes('lim'))
                        ? limitsImg
                        : (topic.includes('integr') || text.includes('∫'))
                        ? integralsImg
                        : derivativesImg;
                      const imgSrc = cached || fallbackImg;

                      return (
                        <div className="pt-2 border-t border-[#22222a] space-y-1.5">
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#e5c158] uppercase">
                            <ImageIcon className="w-3.5 h-3.5 text-[#e5c158]" />
                            <span>Visual Concept Diagram (Offline Synced)</span>
                          </span>
                          <div className="relative rounded-lg overflow-hidden border border-[#2a2a35] max-h-48 bg-black flex items-center justify-center">
                            <img
                              src={imgSrc}
                              alt="Calculus Concept Diagram"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover rounded-lg opacity-90"
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </>
            )
          )}
        </div>

        {/* Options Grid */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-mono uppercase text-[#a0a0b0] tracking-wider font-semibold">
            Select Your Answer:
          </p>

          {!isActivated ? (
            <div className="p-5 rounded-xl bg-[#14141c] border border-[#262632] text-center space-y-3">
              <Lock className="w-6 h-6 text-[#e5c158] mx-auto" />
              <p className="text-xs font-mono text-[#ffffff] font-bold">
                Answer Options Locked
              </p>
              <p className="text-xs text-[#d0d0d8] max-w-md mx-auto font-writeup">
                To load answers and select options, enter your support activation token.
              </p>
              {onOpenActivationModal && (
                <button
                  onClick={onOpenActivationModal}
                  className="px-4 py-2 rounded-xl bg-[#e5c158] hover:bg-[#f3d172] text-black font-bold text-xs font-mono transition-all inline-flex items-center gap-1.5"
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
                        ? 'bg-[#14141a] border-[#e5c158] text-[#ffffff] font-bold shadow-md'
                        : 'bg-[#101015] hover:bg-[#181820] text-[#e8e8f0] border-[#22222a] hover:border-[#2a2a35]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg border font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#e5c158] text-black border-[#e5c158]'
                            : 'bg-[#08080a] border-[#22222a] text-[#a0a0b0]'
                        }`}
                      >
                        {optionLetter}
                      </span>
                      <span className="font-mono text-sm leading-snug">{cleanMathText(opt)}</span>
                    </div>

                    {isSelected && <CheckCircle className="w-5 h-5 text-[#e5c158] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-[#1c1c24] flex items-center justify-between gap-4">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#101015] hover:bg-[#181820] disabled:opacity-40 text-[#d0d0d8] border border-[#22222a] text-xs font-semibold transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-[#e5c158]" />
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#e5c158] hover:bg-[#f3d172] text-black font-bold text-xs sm:text-sm font-classical transition-all shadow-lg hover:scale-[1.02]"
              >
                <span>Submit Quiz</span>
              </button>
            ) : (
              <button
                onClick={onNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#14141a] hover:bg-[#1a1a22] text-[#e5c158] border border-[#2a2a35] font-bold text-xs sm:text-sm transition-all shadow-lg hover:scale-[1.02]"
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



