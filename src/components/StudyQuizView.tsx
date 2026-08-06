import React from 'react';
import { ShuffledQuestion } from '../types';
import { Check, X, ArrowRight, RotateCcw, Lightbulb, Key, Lock, HelpCircle, Eye, ShieldCheck, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isUserActivated } from '../services/userService';

import derivativesImg from '../assets/images/calculus_derivatives_diagram_1786048382838.jpg';
import integralsImg from '../assets/images/calculus_integrals_area_1786048442186.jpg';
import limitsImg from '../assets/images/calculus_limits_graph_1786048455996.jpg';

interface StudyQuizViewProps {
  question: ShuffledQuestion;
  currentIndex: number;
  totalQuestions: number;
  onAnswerSelected: (selectedOptionIndex: number, isCorrect: boolean) => void;
  onNextQuestion: () => void;
  onOpenActivationModal?: () => void;
}

export const StudyQuizView: React.FC<StudyQuizViewProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onAnswerSelected,
  onNextQuestion,
  onOpenActivationModal
}) => {
  const { profile } = useAuth();
  const isActivated = isUserActivated(profile);

  // Engine Module 2 Guided States
  const [showOptions, setShowOptions] = React.useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = React.useState<boolean>(false);
  const [wrongAttempts, setWrongAttempts] = React.useState<number>(0);
  const [showVisualDiagram, setShowVisualDiagram] = React.useState<boolean>(true);
  const [showDetailedHint, setShowDetailedHint] = React.useState<boolean>(false);

  // Reset local state when question changes
  React.useEffect(() => {
    setShowOptions(false);
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setWrongAttempts(0);
    setShowDetailedHint(false);
  }, [question.id, currentIndex]);

  const totalSteps = question.steps?.length || 0;
  const allStepsRevealed = currentStepIndex >= totalSteps - 1 || totalSteps === 0;

  // Determine appropriate topic illustration diagram
  const getTopicImage = () => {
    const topic = (question.topic || '').toLowerCase();
    const text = (question.q || '').toLowerCase();

    if (topic.includes('limit') || topic.includes('continu') || text.includes('lim')) {
      return { src: limitsImg, title: 'Limits & Asymptotes Graph Concept' };
    }
    if (topic.includes('integr') || topic.includes('area') || text.includes('∫') || text.includes('integral')) {
      return { src: integralsImg, title: 'Definite Integral & Area Under Curve' };
    }
    return { src: derivativesImg, title: 'Tangent Line & Rate of Change (Derivative)' };
  };

  const topicIllustration = getTopicImage();

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleUnhideOptions = () => {
    setShowOptions(true);
  };

  const handleOptionClick = (optionIdx: number) => {
    if (!isActivated) {
      if (onOpenActivationModal) onOpenActivationModal();
      return;
    }
    setSelectedOption(optionIdx);
    setHasAnswered(true);
    const isCorrect = optionIdx === question.answer;

    if (!isCorrect) {
      setWrongAttempts((prev) => prev + 1);
      setCurrentStepIndex(0); // reset steps to top so user re-evaluates
    }

    onAnswerSelected(optionIdx, isCorrect);
  };

  const handleRetryQuestion = () => {
    setHasAnswered(false);
    setSelectedOption(null);
    setCurrentStepIndex(0);
  };

  const isSelectedCorrect = selectedOption !== null && selectedOption === question.answer;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#b8a78a]">
          <span className="font-bold text-[#f4ecd8] uppercase tracking-wider flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#282117] border border-[#483a26] text-[#d4af37] text-[10px]">
              MODULE 2: GUIDED STUDY
            </span>
            QUESTION {currentIndex + 1} OF {totalQuestions}
          </span>
          <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}% Completed</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#251f17] overflow-hidden border border-[#322a1f]">
          <div
            className="h-full bg-[#d4af37] transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Guided Question Card */}
      <div className="relative rounded-2xl bg-[#151310] border border-[#2e271d] p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* STEP 1: PRESENT QUESTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono uppercase text-[#d4af37] tracking-wider font-bold flex items-center gap-1.5 bg-[#282117] px-2.5 py-1 rounded-md border border-[#483925]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              Step 1: Question Presentation
            </span>
            {question.topic && (
              <span className="text-xs font-mono text-[#c8b89a] bg-[#1d1914] border border-[#382f22] px-2.5 py-1 rounded uppercase">
                {question.topic}
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#f8f2e4] leading-snug tracking-tight font-classical pt-1">
            {question.q}
          </h2>
        </div>

        {/* VISUAL DIAGRAM REFERENCE */}
        <div className="rounded-xl border border-[#2e271d] bg-[#1a1713] overflow-hidden">
          <button
            onClick={() => setShowVisualDiagram(!showVisualDiagram)}
            className="w-full p-3.5 flex items-center justify-between text-xs font-mono font-bold text-[#d4af37] uppercase tracking-wider hover:bg-[#252019] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#d4af37]" />
              <span>Calculus Visual Reference Diagram ({topicIllustration.title})</span>
            </span>
            {showVisualDiagram ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showVisualDiagram && (
            <div className="p-4 border-t border-[#2e271d] space-y-2">
              {!isActivated ? (
                <div className="p-6 rounded-lg bg-[#251e16] border border-[#483a26] text-center space-y-3">
                  <Lock className="w-8 h-8 text-[#d4af37] mx-auto" />
                  <p className="text-xs font-mono text-[#f4ecd8] font-bold">
                    Detail Diagram Image Locked
                  </p>
                  <p className="text-xs text-[#c8b89a] max-w-md mx-auto">
                    Support token activation is required to load detailed calculus concept images.
                  </p>
                  {onOpenActivationModal && (
                    <button
                      onClick={onOpenActivationModal}
                      className="px-4 py-2 rounded-xl bg-[#c9a24d] hover:bg-[#d8b45c] text-black font-bold text-xs font-mono transition-all flex items-center gap-1.5 mx-auto"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Enter Support Token to Unlock</span>
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="relative rounded-lg overflow-hidden border border-[#382f22] max-h-64 sm:max-h-80 bg-black flex items-center justify-center">
                    <img
                      src={topicIllustration.src}
                      alt={topicIllustration.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-lg opacity-90 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <p className="text-[11px] font-mono text-[#b09f82] text-center">
                    Visualizing geometric concept: {topicIllustration.title}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* STEP 2: NEXT-STEP GUIDANCE */}
        <div className="p-4 rounded-xl bg-[#1d1914] border border-[#2e271d] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#d4af37] uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Step 2: Tactical Next-Step Guidance</span>
            </div>

            <button
              onClick={() => {
                if (!isActivated && onOpenActivationModal) {
                  onOpenActivationModal();
                  return;
                }
                setShowDetailedHint(!showDetailedHint);
              }}
              className="text-xs font-mono text-[#e2b958] hover:text-[#f3d17c] underline flex items-center gap-1"
            >
              <span>{showDetailedHint ? 'Hide Detailed Hint' : 'Detailed Study Hint'}</span>
            </button>
          </div>

          {!isActivated ? (
            <div className="p-4 rounded-lg bg-[#251e16] border border-[#483a26] text-center space-y-2">
              <Lock className="w-5 h-5 text-[#d4af37] mx-auto" />
              <p className="text-xs font-mono text-[#f4ecd8] font-bold">
                Detailed Hint & Step Breakdown Locked
              </p>
              <p className="text-[11px] text-[#c8b89a]">
                Obtain a token from support (jentlecasper014@gmail.com) to load hints and step-by-step solutions offline.
              </p>
              {onOpenActivationModal && (
                <button
                  onClick={onOpenActivationModal}
                  className="px-3.5 py-1.5 rounded-lg bg-[#c9a24d] hover:bg-[#d8b45c] text-black font-bold text-xs font-mono transition-all inline-flex items-center gap-1 mt-1"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Enter Token</span>
                </button>
              )}
            </div>
          ) : (
            <div className="text-xs text-[#e8dec5] font-writeup leading-relaxed space-y-2">
              <p className="font-medium bg-[#282117] border border-[#423523] p-3 rounded-lg text-[#f4ecd8]">
                Action Plan: Read the problem carefully, write down your given parameters, and apply the appropriate calculus theorem or differentiation/integration rule before selecting options.
              </p>

              {showDetailedHint && (
                <div className="p-3.5 rounded-lg bg-[#2d2419] border border-[#4e3c28] text-[#f4ecd8] text-xs font-writeup space-y-1.5 animate-in fade-in duration-200">
                  <span className="font-bold text-[#d4af37] uppercase block text-[11px] font-mono">Calculus Deep-Dive Hint:</span>
                  <p className="leading-relaxed">
                    {question.hint ||
                      'Break down complex algebraic terms, evaluate individual limits or derivatives, and simplify systematically before substituting values.'}
                  </p>
                </div>
              )}

              {question.steps && question.steps.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] text-[#b5a386] font-mono uppercase font-bold block">Solving Steps Checklist:</span>
                  {question.steps.slice(0, currentStepIndex + 1).map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-[#14120e] border border-[#2e271d] space-y-1 animate-in slide-in-from-bottom-2 duration-300"
                    >
                      <span className="text-[#d4af37] font-bold block font-mono text-xs">{step.title}</span>
                      <p className="text-[#f4ecd8] font-writeup leading-relaxed text-xs sm:text-sm">{step.body}</p>
                    </div>
                  ))}

                  {!allStepsRevealed && (
                    <button
                      onClick={handleNextStep}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#28221b] hover:bg-[#342c22] text-xs font-mono text-[#f4ecd8] border border-[#403527] transition-colors mt-2"
                    >
                      <span>Reveal Next Step ({currentStepIndex + 2}/{totalSteps}) →</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* STEP 3: PATTERN RECOGNITION */}
        {question.pattern && (
          <div className="p-4 rounded-xl bg-[#231e17] border border-[#423726] text-[#f4ecd8] text-xs font-writeup space-y-1.5">
            <div className="flex items-center gap-2 font-bold font-mono text-xs uppercase tracking-wider text-[#d4af37]">
              <Key className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Step 3: Pattern & Formula Recognition</span>
            </div>
            {!isActivated ? (
              <p className="text-xs font-mono text-[#b8a78a] italic">
                🔒 Pattern formula hidden until token activation.
              </p>
            ) : (
              <p className="text-sm font-semibold text-[#f8f2e4] pl-6 font-classical">{question.pattern}</p>
            )}
          </div>
        )}

        {/* STEP 4: FINAL ANSWER PROMPT & UNHIDE OPTIONS */}
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>Step 4: Final Answer Selection</span>
            </div>

            {!showOptions && (
              <button
                onClick={handleUnhideOptions}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all shadow-md"
              >
                <Eye className="w-4 h-4" />
                <span>Unhide Randomized Options (A, B, C, D)</span>
              </button>
            )}
          </div>

          {!isActivated ? (
            <div className="p-5 rounded-xl bg-[#251e16] border border-[#483a26] text-center space-y-3">
              <Lock className="w-6 h-6 text-[#d4af37] mx-auto" />
              <p className="text-xs font-mono text-[#f4ecd8] font-bold">
                Answer Options Locked
              </p>
              <p className="text-xs text-[#c8b89a] max-w-md mx-auto font-writeup">
                To load answer keys and enable question submission, enter your activation token provided by support.
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
          ) : showOptions ? (
            <div className="space-y-3 animate-in fade-in duration-300">
              <p className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-semibold">
                Select your calculated answer below (Options are dynamically randomized):
              </p>

              <div className="grid grid-cols-1 gap-3">
                {question.options.map((opt, idx) => {
                  const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
                  const isSelected = selectedOption === idx;
                  const isCorrectOption = idx === question.answer;

                  let btnStyle =
                    'bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-200 border-zinc-800 hover:border-zinc-700';

                  if (hasAnswered) {
                    if (isCorrectOption) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrectOption) {
                      btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold';
                    } else {
                      btnStyle = 'bg-zinc-900/40 text-zinc-600 border-zinc-900';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      disabled={hasAnswered && isSelectedCorrect}
                      className={`w-full text-left flex items-center justify-between p-4 rounded-xl border text-sm transition-all duration-200 ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg border font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                            hasAnswered && isCorrectOption
                              ? 'bg-emerald-500 text-black border-emerald-400'
                              : hasAnswered && isSelected && !isCorrectOption
                              ? 'bg-rose-500 text-white border-rose-400'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                          }`}
                        >
                          {optionLetter}
                        </span>
                        <span className="font-mono text-sm leading-snug">{opt}</span>
                      </div>

                      {hasAnswered && isCorrectOption && <Check className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {hasAnswered && isSelected && !isCorrectOption && <X className="w-5 h-5 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-dashed border-zinc-800 text-center text-xs text-zinc-500 font-mono">
              Multiple Choice Options are currently hidden for open-book guided thinking. Click "Unhide Randomized Options" above when ready to choose!
            </div>
          )}
        </div>

        {/* STEP 5: VALIDATION & RETRY LOOP */}
        {hasAnswered && isActivated && (
          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
            <div>
              {isSelectedCorrect ? (
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Check className="w-5 h-5" />
                  <span>Step 5 Success! Excellent application of concept.</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <X className="w-5 h-5" />
                    <span>Incorrect Option Selected. Routing back to Step 2 Guidance!</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono">
                    Re-read the solving steps above and re-attempt until you hit the correct option.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isSelectedCorrect && (
                <button
                  onClick={handleRetryQuestion}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Re-attempt Question</span>
                </button>
              )}

              {isSelectedCorrect && (
                <button
                  onClick={onNextQuestion}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs sm:text-sm transition-all shadow-lg hover:scale-[1.02]"
                >
                  <span>{currentIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



