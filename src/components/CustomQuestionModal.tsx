import React from 'react';
import { X, Sparkles, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Question } from '../types';
import { ModalWatermark } from './Watermark';

interface CustomQuestionModalProps {
  isOpen: boolean;
  customQuestions: Question[];
  onClose: () => void;
  onSaveQuestion: (question: Question) => void;
  onDeleteQuestion?: (id: string) => void;
}

export const CustomQuestionModal: React.FC<CustomQuestionModalProps> = ({
  isOpen,
  customQuestions,
  onClose,
  onSaveQuestion
}) => {
  const [rawInput, setRawInput] = React.useState('');
  const [isProcessingAi, setIsProcessingAi] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'ai' | 'manual' | 'list'>('ai');

  // Manual Form State
  const [manualQ, setManualQ] = React.useState('');
  const [optA, setOptA] = React.useState('');
  const [optB, setOptB] = React.useState('');
  const [optC, setOptC] = React.useState('');
  const [optD, setOptD] = React.useState('');
  const [correctIndex, setCorrectIndex] = React.useState(0);
  const [patternText, setPatternText] = React.useState('');
  const [hintText, setHintText] = React.useState('');
  const [step1Title, setStep1Title] = React.useState('');
  const [step1Body, setStep1Body] = React.useState('');

  if (!isOpen) return null;

  const handleAiAutoFix = async () => {
    if (!rawInput.trim()) return;
    setIsProcessingAi(true);

    try {
      const res = await fetch('/api/generate-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawQuestion: rawInput,
          topic: 'Calculus & General Study'
        })
      });

      const data = await res.json();
      if (data.success && data.question) {
        const qObj = data.question;
        const newQuestion: Question = {
          id: `custom_${Date.now()}`,
          topic: 'User Custom',
          q: qObj.q || rawInput,
          options: qObj.options || ['Option A', 'Option B', 'Option C', 'Option D'],
          answer: typeof qObj.answer === 'number' ? qObj.answer : 0,
          pattern: qObj.pattern || 'Custom Formula Identity',
          hint: qObj.hint || 'Custom study problem hint',
          steps: qObj.steps || [
            { title: 'Step 1: Analysis', body: 'Analyze problem requirements.' },
            { title: 'Step 2: Solution', body: 'Derive correct answer choice.' }
          ]
        };

        onSaveQuestion(newQuestion);
        setRawInput('');
        setActiveTab('list');
      } else {
        alert('AI processed with fallback options.');
      }
    } catch (e) {
      console.error('Failed to auto-fix missing options:', e);
      alert('Error contacting AI server. Please check your network or try manual input.');
    } finally {
      setIsProcessingAi(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQ.trim() || !optA.trim() || !optB.trim()) {
      alert('Please fill in question text and options A & B.');
      return;
    }

    const optionsArr = [
      optA,
      optB,
      optC.trim() || 'Option C',
      optD.trim() || 'Option D'
    ];

    const newQuestion: Question = {
      id: `custom_${Date.now()}`,
      topic: 'User Custom',
      q: manualQ,
      options: optionsArr,
      answer: correctIndex,
      pattern: patternText || undefined,
      hint: hintText || undefined,
      steps: [
        {
          title: step1Title || 'Step 1: Solution Step',
          body: step1Body || 'Evaluate function using calculus rules.'
        }
      ]
    };

    onSaveQuestion(newQuestion);
    // Reset manual form
    setManualQ('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setPatternText('');
    setHintText('');
    setStep1Title('');
    setStep1Body('');
    setActiveTab('list');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-[#121215] border border-zinc-800 shadow-2xl p-6 space-y-4 text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Custom Question Importer</h2>
              <p className="text-xs text-zinc-400">Add custom questions with AI auto-fix options</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'ai'
                ? 'bg-emerald-950 border border-emerald-700 text-emerald-200'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            AI Option Fixer
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'manual'
                ? 'bg-zinc-800 border border-zinc-700 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Manual Form
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'list'
                ? 'bg-zinc-800 border border-zinc-700 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Bank ({customQuestions.length})
          </button>
        </div>

        {/* Tab 1: AI Auto Fixer */}
        {activeTab === 'ai' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-300">
              Paste any raw calculus question (even if missing options). Our AI automatically constructs 4 plausible multiple choice options, a formula pattern, and step-by-step solution breakdown!
            </div>

            <textarea
              rows={5}
              placeholder="Paste raw question here e.g.: Find the limit as x approaches 0 of (sin 3x)/x..."
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-600 font-mono"
            />

            <button
              onClick={handleAiAutoFix}
              disabled={isProcessingAi || !rawInput.trim()}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{isProcessingAi ? 'AI Generating Options & Solution Steps...' : 'Generate 4 Options & Save to Bank'}</span>
            </button>
          </div>
        )}

        {/* Tab 2: Manual Form */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            <div>
              <label className="text-zinc-400 font-mono block mb-1">Question Text *</label>
              <input
                type="text"
                placeholder="Find y' for y = x^3 + 2x..."
                value={manualQ}
                onChange={(e) => setManualQ(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-zinc-400 font-mono block mb-1">Option A *</label>
                <input
                  type="text"
                  placeholder="3x^2 + 2"
                  value={optA}
                  onChange={(e) => setOptA(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-mono block mb-1">Option B *</label>
                <input
                  type="text"
                  placeholder="3x^2"
                  value={optB}
                  onChange={(e) => setOptB(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-mono block mb-1">Option C</label>
                <input
                  type="text"
                  placeholder="x^2 + 2"
                  value={optC}
                  onChange={(e) => setOptC(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-mono block mb-1">Option D</label>
                <input
                  type="text"
                  placeholder="0"
                  value={optD}
                  onChange={(e) => setOptD(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 font-mono block mb-1">Correct Option Position</label>
              <select
                value={correctIndex}
                onChange={(e) => setCorrectIndex(Number(e.target.value))}
                className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono"
              >
                <option value={0}>Option A is Correct</option>
                <option value={1}>Option B is Correct</option>
                <option value={2}>Option C is Correct</option>
                <option value={3}>Option D is Correct</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-zinc-400 font-mono block mb-1">Pattern Float Rule</label>
                <input
                  type="text"
                  placeholder="Power Rule: d/dx[x^n] = n x^(n-1)"
                  value={patternText}
                  onChange={(e) => setPatternText(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-mono block mb-1">Hint</label>
                <input
                  type="text"
                  placeholder="Differentiate term by term"
                  value={hintText}
                  onChange={(e) => setHintText(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 font-mono block mb-1">Step 1 Title & Body</label>
              <input
                type="text"
                placeholder="Title: Apply Power Rule"
                value={step1Title}
                onChange={(e) => setStep1Title(e.target.value)}
                className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono mb-1"
              />
              <textarea
                rows={2}
                placeholder="Body: d/dx(x^3) = 3x^2 and d/dx(2x) = 2"
                value={step1Body}
                onChange={(e) => setStep1Body(e.target.value)}
                className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-md"
            >
              Save Custom Question
            </button>
          </form>
        )}

        {/* Tab 3: Question Bank List */}
        {activeTab === 'list' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {customQuestions.length === 0 ? (
              <p className="text-xs text-zinc-500 font-mono text-center py-8">
                No custom questions added yet. Use Tab 1 or 2 above!
              </p>
            ) : (
              customQuestions.map((cq, idx) => (
                <div key={cq.id || idx} className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-purple-400 font-bold">Custom Question #{idx + 1}</span>
                  </div>
                  <p className="font-serif font-bold text-white">{cq.q}</p>
                  <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-zinc-400">
                    {cq.options.map((o, oIdx) => (
                      <span key={oIdx} className={oIdx === cq.answer ? 'text-emerald-400 font-bold' : ''}>
                        {String.fromCharCode(65 + oIdx)}: {o}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <ModalWatermark />
      </div>
    </div>
  );
};
