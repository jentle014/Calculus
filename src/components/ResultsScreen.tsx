import React from 'react';
import { QuizResult } from '../types';
import { Trophy, CheckCircle2, XCircle, Clock, RotateCcw, Home, ChevronDown, ChevronUp, Lock, Key, HelpCircle, BookOpen } from 'lucide-react';
import { formatTime } from '../utils/quizUtils';
import { useAuth } from '../context/AuthContext';
import { isUserActivated } from '../services/userService';
import { cleanMathText } from '../utils/mathUtils';

interface ResultsScreenProps {
  result: QuizResult;
  onRestartQuiz: () => void;
  onGoHome: () => void;
  onOpenActivationModal?: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  result,
  onRestartQuiz,
  onGoHome,
  onOpenActivationModal
}) => {
  const { profile } = useAuth();
  const isActivated = isUserActivated(profile);

  const [expandedSolutions, setExpandedSolutions] = React.useState<Record<number, boolean>>({});
  const [aiExplanations, setAiExplanations] = React.useState<Record<number, string>>({});
  const [loadingAi, setLoadingAi] = React.useState<Record<number, boolean>>({});

  const toggleSolution = (index: number) => {
    if (!isActivated) {
      if (onOpenActivationModal) onOpenActivationModal();
      return;
    }
    setExpandedSolutions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const fetchAiExplanation = async (index: number) => {
    if (!isActivated) {
      if (onOpenActivationModal) onOpenActivationModal();
      return;
    }
    const item = result.answers[index];
    if (!item) return;

    setLoadingAi((prev) => ({ ...prev, [index]: true }));
    try {
      const selectedText = item.selectedOption !== -1 ? item.question.options[item.selectedOption] : 'None (Unanswered)';
      const correctText = item.question.options[item.question.answer];

      const res = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: item.question.q,
          selectedOptionText: selectedText,
          correctOptionText: correctText,
          steps: item.question.steps
        })
      });

      const data = await res.json();
      if (data.explanation) {
        setAiExplanations((prev) => ({ ...prev, [index]: data.explanation }));
      }
    } catch (err) {
      console.error('Failed to get AI explanation:', err);
    } finally {
      setLoadingAi((prev) => ({ ...prev, [index]: false }));
    }
  };

  // Performance quote
  let performanceMessage = 'Great effort! Review your mistakes below to solidify your understanding.';
  if (result.percentage >= 90) {
    performanceMessage = 'Outstanding performance! You have thoroughly mastered this topic.';
  } else if (result.percentage >= 80) {
    performanceMessage = 'Excellent work! Almost flawless execution.';
  } else if (result.percentage >= 70) {
    performanceMessage = 'Solid job! A little more step-by-step review will get you to 100%.';
  } else if (result.percentage < 50) {
    performanceMessage = 'Keep pushing! Re-run Study Mode to walk through the step-by-step solutions.';
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Score Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#131316] border border-zinc-800 p-6 sm:p-8 text-center space-y-6 shadow-2xl">
        <div className="inline-flex p-3 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400">
          <Trophy className="w-8 h-8 text-emerald-400" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono uppercase text-zinc-400 tracking-widest">{result.topicName} Results</p>
          <div className="text-5xl sm:text-6xl font-extrabold text-white font-mono tracking-tight">
            {result.percentage}%
          </div>
          <p className="text-sm sm:text-base text-zinc-300 max-w-md mx-auto pt-1 font-medium">
            {performanceMessage}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-4 border-t border-zinc-800">
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-mono mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Correct</span>
            </div>
            <span className="text-lg font-bold font-mono text-white">{result.correctCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-mono mb-1">
              <XCircle className="w-3.5 h-3.5" />
              <span>Wrong</span>
            </div>
            <span className="text-lg font-bold font-mono text-white">{result.wrongCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-sky-400 text-xs font-mono mb-1">
              <span>Total</span>
            </div>
            <span className="text-lg font-bold font-mono text-white">{result.totalQuestions}</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-mono mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Time</span>
            </div>
            <span className="text-lg font-bold font-mono text-white">
              {formatTime(result.timeElapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onRestartQuiz}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs sm:text-sm transition-all shadow-lg hover:scale-[1.02]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Quiz Again</span>
          </button>

          <button
            onClick={onGoHome}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-semibold text-xs sm:text-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </button>
        </div>
      </div>

      {/* Answer Review Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">Full Answer & Solution Review</h2>
          <span className="text-xs text-zinc-400 font-mono">
            {result.answers.length} Questions Reviewed
          </span>
        </div>

        {!isActivated ? (
          <div className="p-8 rounded-2xl bg-[#1d1914] border border-[#3e3223] text-center space-y-4 shadow-xl">
            <Lock className="w-10 h-10 text-[#d4af37] mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#f4ecd8] font-classical">
                Detailed Solutions & Answer Key Locked
              </h3>
              <p className="text-xs text-[#c8b89a] max-w-md mx-auto leading-relaxed">
                No token detected. Get an activation token from support (jentlecasper014@gmail.com) to load full answers, step-by-step solutions, and AI explanations onto your device for offline access.
              </p>
            </div>
            {onOpenActivationModal && (
              <button
                onClick={onOpenActivationModal}
                className="px-6 py-2.5 rounded-xl bg-[#c9a24d] hover:bg-[#d8b45c] text-black font-bold text-xs sm:text-sm font-classical transition-all shadow-lg inline-flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>Enter Activation Token</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {result.answers.map((item, idx) => {
              const isExpanded = expandedSolutions[idx];
              const q = item.question;
              const userSelectedText =
                item.selectedOption !== -1 ? q.options[item.selectedOption] : 'Unanswered';
              const correctText = q.options[q.answer];

              return (
                <div
                  key={idx}
                  className={`rounded-xl border p-5 space-y-4 transition-all ${
                    item.isCorrect
                      ? 'bg-[#121413] border-emerald-900/50'
                      : 'bg-[#171213] border-rose-900/50'
                  }`}
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-zinc-400">Q{idx + 1}.</span>
                        {item.isCorrect ? (
                          <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white font-serif">{cleanMathText(q.q)}</h3>
                    </div>

                    <button
                      onClick={() => toggleSolution(idx)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors shrink-0"
                      title="Toggle Solution Steps"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Option Selections Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-2">
                    <div
                      className={`p-3 rounded-lg border ${
                        item.isCorrect
                          ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                          : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                      }`}
                    >
                      <span className="text-zinc-500 uppercase block text-[10px] mb-0.5">Your Choice:</span>
                      <span className="font-bold">{cleanMathText(userSelectedText)}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
                      <span className="text-zinc-500 uppercase block text-[10px] mb-0.5">Correct Solution:</span>
                      <span className="font-bold">{cleanMathText(correctText)}</span>
                    </div>
                  </div>

                  {/* Solution Steps Accordion */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-zinc-800/80 space-y-4 animate-in fade-in duration-200">
                      {q.pattern && (
                        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400">
                          <span className="font-bold">Pattern / Formula: </span>
                          <span className="text-zinc-200">{cleanMathText(q.pattern)}</span>
                        </div>
                      )}

                      {q.steps && q.steps.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-mono uppercase text-zinc-400 font-bold block">
                            Step-by-Step Breakdown:
                          </span>
                          {q.steps.map((st, stepIdx) => (
                            <div
                              key={stepIdx}
                              className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs space-y-1"
                            >
                              <span className="font-mono font-bold text-emerald-400 block">{cleanMathText(st.title)}</span>
                              <p className="text-zinc-300 font-mono leading-relaxed pl-2">{cleanMathText(st.body)}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* AI Explanation Generator Button */}
                      <div className="pt-2">
                        {aiExplanations[idx] ? (
                          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/50 text-xs text-purple-200 space-y-2">
                            <div className="flex items-center gap-2 font-bold text-purple-300">
                              <BookOpen className="w-4 h-4 text-purple-400" />
                              <span>AI Tutor Explanation</span>
                            </div>
                            <p className="whitespace-pre-line leading-relaxed font-sans">{aiExplanations[idx]}</p>
                          </div>
                        ) : (
                          <button
                            onClick={() => fetchAiExplanation(idx)}
                            disabled={loadingAi[idx]}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-700/80 text-purple-200 text-xs font-medium transition-all"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-purple-300" />
                            <span>{loadingAi[idx] ? 'Generating Explanation...' : 'Ask AI Tutor for Explanation'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

