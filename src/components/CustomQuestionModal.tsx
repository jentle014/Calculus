import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  Camera,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  Paperclip,
  Send,
  FileSpreadsheet,
  AlertCircle,
  Crop
} from 'lucide-react';
import { Question } from '../types';
import { ModalWatermark } from './Watermark';
import { ImageCropperModal } from './ImageCropperModal';
import { cleanMathText, cleanQuestionObject } from '../utils/mathUtils';

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
  onSaveQuestion,
  onDeleteQuestion
}) => {
  const [activeTab, setActiveTab] = useState<'type' | 'manual' | 'import' | 'list'>('type');

  // Telegram-style Typing & Image Attachment State
  const [questionText, setQuestionText] = useState<string>('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Image Cropper State
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState<boolean>(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Bulk Import File State
  const [importText, setImportText] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Manual Form State
  const [manualQ, setManualQ] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0);
  const [patternText, setPatternText] = useState('');
  const [hintText, setHintText] = useState('');
  const [step1Title, setStep1Title] = useState('');
  const [step1Body, setStep1Body] = useState('');

  if (!isOpen) return null;

  // Handle image attachment from gallery or camera -> Open Image Cropper
  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMime(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCropperImage(result);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);

    // reset input value so re-selecting same file triggers change
    e.target.value = '';
  };

  // Submit Question (Text + Attached Image) via Telegram-Style Input
  const handleSendTypedQuestion = async () => {
    if (!questionText.trim() && !attachedImage) {
      alert('Please type a question or attach an image.');
      return;
    }

    setIsSubmitting(true);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/generate-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawQuestion: questionText,
          imageBase64: attachedImage || undefined,
          imageMime: attachedImage ? imageMime : undefined,
          topic: 'Custom Typed Question'
        })
      });

      const data = await res.json();
      if (data.success && data.question) {
        const qObj = data.question;
        const newQuestion: Question = {
          id: `custom_${Date.now()}`,
          topic: 'Custom Question',
          q: qObj.q || questionText || 'Calculus Custom Problem',
          options: qObj.options || ['Option A', 'Option B', 'Option C', 'Option D'],
          answer: typeof qObj.answer === 'number' ? qObj.answer : 0,
          pattern: qObj.pattern || 'Calculus Formula Rule',
          hint: qObj.hint || 'Calculus problem hint',
          steps: qObj.steps || [
            { title: 'Step 1: Problem Setup', body: 'Analyze problem expressions and formulas.' },
            { title: 'Step 2: Solution Step', body: 'Evaluate to reach correct option.' }
          ]
        };

        onSaveQuestion(cleanQuestionObject(newQuestion));
        setQuestionText('');
        setAttachedImage(null);
        setSuccessMsg('Question added successfully to your practice bank!');

        setTimeout(() => {
          setSuccessMsg(null);
          setActiveTab('list');
        }, 1200);
      } else {
        alert('Could not parse question. Please try rephrasing or uploading a clearer photo.');
      }
    } catch (e) {
      console.error('Error submitting custom question:', e);
      alert('Network error submitting question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bulk Import JSON or CSV Handler
  const handleBulkImport = () => {
    if (!importText.trim()) return;

    try {
      let countAdded = 0;
      if (importText.trim().startsWith('[') || importText.trim().startsWith('{')) {
        const parsed = JSON.parse(importText);
        const list = Array.isArray(parsed) ? parsed : [parsed];

        list.forEach((item, idx) => {
          if (item.q || item.question) {
            const qObj: Question = {
              id: `custom_${Date.now()}_${idx}`,
              topic: item.topic || 'Imported Question',
              q: item.q || item.question,
              options: Array.isArray(item.options) ? item.options : ['Option A', 'Option B', 'Option C', 'Option D'],
              answer: typeof item.answer === 'number' ? item.answer : 0,
              pattern: item.pattern || 'Formula Rule',
              hint: item.hint || 'Formula hint',
              steps: item.steps || [{ title: 'Step 1: Solution', body: 'Evaluate steps.' }]
            };
            onSaveQuestion(cleanQuestionObject(qObj));
            countAdded++;
          }
        });
      } else {
        const lines = importText.split('\n').filter((l) => l.trim().length > 0);
        lines.forEach((line, idx) => {
          const cols = line.split(',').map((c) => c.trim().replace(/^"/, '').replace(/"$/, ''));
          if (cols.length >= 2) {
            const qText = cols[0];
            const opt1 = cols[1] || 'Option A';
            const opt2 = cols[2] || 'Option B';
            const opt3 = cols[3] || 'Option C';
            const opt4 = cols[4] || 'Option D';
            const ansIdx = parseInt(cols[5] || '0', 10);

            const qObj: Question = {
              id: `custom_${Date.now()}_${idx}`,
              topic: 'Imported CSV',
              q: qText,
              options: [opt1, opt2, opt3, opt4],
              answer: isNaN(ansIdx) ? 0 : Math.min(3, Math.max(0, ansIdx)),
              pattern: 'Imported Formula',
              hint: 'Imported question hint',
              steps: [{ title: 'Step 1: Evaluation', body: 'Solve problem.' }]
            };
            onSaveQuestion(cleanQuestionObject(qObj));
            countAdded++;
          }
        });
      }

      setImportStatus(`Successfully imported ${countAdded} custom questions!`);
      setImportText('');
      setTimeout(() => {
        setImportStatus(null);
        setActiveTab('list');
      }, 1500);
    } catch (err: any) {
      alert('Invalid JSON or CSV format. Please check formatting.');
    }
  };

  // Manual Form Submit
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

    onSaveQuestion(cleanQuestionObject(newQuestion));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-[#08080b] border border-[#22222a] shadow-2xl p-5 space-y-4 text-white overflow-hidden">
        
        {/* Hidden inputs for gallery & camera */}
        <input
          type="file"
          ref={galleryInputRef}
          accept="image/*"
          onChange={handleImageSelected}
          className="hidden"
        />
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleImageSelected}
          className="hidden"
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1c1c24]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#14141a] border border-[#2a2a35]">
              <Plus className="w-5 h-5 text-[#e5c158]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-classical text-white">
                Add Custom Question
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#181820] text-[#a0a0b0] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Tab Bar */}
        <div className="flex items-center gap-1.5 border-b border-[#1c1c24] pb-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('type')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
              activeTab === 'type'
                ? 'bg-[#e5c158] text-black shadow-md'
                : 'bg-[#101015] text-[#a0a0b0] hover:text-white border border-[#22222a]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Type / Attach Image</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
              activeTab === 'manual'
                ? 'bg-[#181820] border border-[#2a2a35] text-white'
                : 'bg-[#101015] text-[#a0a0b0] hover:text-white border border-[#22222a]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Options</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
              activeTab === 'import'
                ? 'bg-[#181820] border border-[#2a2a35] text-[#e5c158]'
                : 'bg-[#101015] text-[#a0a0b0] hover:text-white border border-[#22222a]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>JSON / CSV</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
              activeTab === 'list'
                ? 'bg-[#181820] border border-[#2a2a35] text-white'
                : 'bg-[#101015] text-[#a0a0b0] hover:text-white border border-[#22222a]'
            }`}
          >
            <span>Custom Bank ({customQuestions.length})</span>
          </button>
        </div>

        {/* Tab 1: Telegram-Style Question Typing Input with Image Attachment */}
        {activeTab === 'type' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {successMsg && (
              <div className="p-3 rounded-xl bg-[#142618] border border-emerald-900/60 text-emerald-300 font-mono flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Telegram-style Composite Input Container */}
            <div className="rounded-2xl bg-[#101015] border border-[#22222c] focus-within:border-[#e5c158] transition-all p-3 space-y-3">
              {/* Attached Image Thumbnail (Telegram-style preview pill) */}
              {attachedImage && (
                <div className="relative inline-flex items-center gap-3 p-2.5 rounded-xl bg-[#181822] border border-[#2a2a38] animate-in fade-in">
                  <div className="w-12 h-12 rounded-lg bg-black overflow-hidden shrink-0 border border-[#333342]">
                    <img src={attachedImage} alt="Attached" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 pr-14">
                    <span className="text-[11px] font-bold text-white font-mono block">Image Attached</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCropperImage(attachedImage);
                        setIsCropperOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-[10px] text-[#e5c158] hover:underline font-mono"
                    >
                      <Crop className="w-3 h-3" />
                      <span>Crop / Adjust Image</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedImage(null)}
                    className="absolute top-2.5 right-2.5 p-1 rounded-full bg-black/60 text-[#a0a0b0] hover:text-white hover:bg-black transition-colors"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Textarea Input */}
              <textarea
                rows={4}
                placeholder="Type your question text here (e.g. Find derivative of f(x) = x^2 * sin(x)...)"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-[#808090] focus:outline-none resize-none font-mono leading-relaxed"
              />

              {/* Telegram-Style Toolbar inside input box */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1c1c24]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="p-2 rounded-xl bg-[#161620] hover:bg-[#20202c] text-[#e5c158] border border-[#2a2a38] flex items-center gap-1.5 transition-all text-xs font-mono"
                    title="Attach image from gallery"
                  >
                    <Paperclip className="w-4 h-4 text-[#e5c158]" />
                    <span className="hidden sm:inline">Attach Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="p-2 rounded-xl bg-[#161620] hover:bg-[#20202c] text-[#e5c158] border border-[#2a2a38] flex items-center gap-1.5 transition-all text-xs font-mono"
                    title="Snap photo with camera"
                  >
                    <Camera className="w-4 h-4 text-[#e5c158]" />
                    <span className="hidden sm:inline">Snap Photo</span>
                  </button>
                </div>

                <div className="text-[10px] text-[#808090] font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#e5c158]" />
                  <span>AI Auto-Generates Options & Steps</span>
                </div>
              </div>
            </div>

            {/* Telegram-style Send / Submit Action Button */}
            <button
              onClick={handleSendTypedQuestion}
              disabled={isSubmitting || (!questionText.trim() && !attachedImage)}
              className="w-full py-3 rounded-xl bg-[#e5c158] hover:bg-[#f3d172] text-black font-bold text-xs sm:text-sm font-classical disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4 text-black" />
              <span>
                {isSubmitting
                  ? 'Analyzing & Generating Options...'
                  : attachedImage
                  ? 'Send Photo & Generate Options'
                  : 'Add Question to Bank'}
              </span>
            </button>
          </div>
        )}

        {/* Tab 2: Manual Form */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            <div>
              <label className="text-[#a0a0b0] font-mono block mb-1">Question Text *</label>
              <input
                type="text"
                placeholder="Find y' for y = x^3 + 2x..."
                value={manualQ}
                onChange={(e) => setManualQ(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#121217] border border-[#262632] text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[#a0a0b0] font-mono block mb-1">Option A *</label>
                <input
                  type="text"
                  placeholder="3x^2 + 2"
                  value={optA}
                  onChange={(e) => setOptA(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#121217] border border-[#262632] text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[#a0a0b0] font-mono block mb-1">Option B *</label>
                <input
                  type="text"
                  placeholder="3x^2"
                  value={optB}
                  onChange={(e) => setOptB(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#121217] border border-[#262632] text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[#a0a0b0] font-mono block mb-1">Option C</label>
                <input
                  type="text"
                  placeholder="x^2 + 2"
                  value={optC}
                  onChange={(e) => setOptC(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#121217] border border-[#262632] text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[#a0a0b0] font-mono block mb-1">Option D</label>
                <input
                  type="text"
                  placeholder="0"
                  value={optD}
                  onChange={(e) => setOptD(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#121217] border border-[#262632] text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[#a0a0b0] font-mono block mb-1">Correct Option Position</label>
              <select
                value={correctIndex}
                onChange={(e) => setCorrectIndex(Number(e.target.value))}
                className="w-full p-2 rounded-lg bg-[#121217] border border-[#262632] text-white font-mono"
              >
                <option value={0}>Option A is Correct</option>
                <option value={1}>Option B is Correct</option>
                <option value={2}>Option C is Correct</option>
                <option value={3}>Option D is Correct</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[#a0a0b0] font-mono block mb-1">Pattern Formula</label>
                <input
                  type="text"
                  placeholder="Power Rule: d/dx[x^n] = n x^(n-1)"
                  value={patternText}
                  onChange={(e) => setPatternText(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#121217] border border-[#262632] text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[#a0a0b0] font-mono block mb-1">Hint</label>
                <input
                  type="text"
                  placeholder="Differentiate term by term"
                  value={hintText}
                  onChange={(e) => setHintText(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#121217] border border-[#262632] text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[#a0a0b0] font-mono block mb-1">Step 1 Title & Body</label>
              <input
                type="text"
                placeholder="Title: Apply Power Rule"
                value={step1Title}
                onChange={(e) => setStep1Title(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#121217] border border-[#262632] text-white font-mono mb-1"
              />
              <textarea
                rows={2}
                placeholder="Body: d/dx(x^3) = 3x^2 and d/dx(2x) = 2"
                value={step1Body}
                onChange={(e) => setStep1Body(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#121217] border border-[#262632] text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#e5c158] hover:bg-[#f3d172] text-black font-bold font-classical transition-all shadow-md"
            >
              Save Custom Question
            </button>
          </form>
        )}

        {/* Tab 3: JSON / CSV File Import */}
        {activeTab === 'import' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">

            {importStatus && (
              <div className="p-3 rounded-xl bg-[#142618] border border-emerald-900/60 text-emerald-300 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{importStatus}</span>
              </div>
            )}

            <textarea
              rows={6}
              placeholder={`Paste JSON array or CSV content:
[
  {
    "q": "What is d/dx[x^2]?",
    "options": ["2x", "x", "x^3", "2"],
    "answer": 0,
    "hint": "Use power rule"
  }
]`}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#121217] border border-[#262632] text-xs text-white placeholder-[#808090] focus:outline-none focus:border-[#e5c158] font-mono"
            />

            <button
              onClick={handleBulkImport}
              disabled={!importText.trim()}
              className="w-full py-3 rounded-xl bg-[#e5c158] hover:bg-[#f3d172] text-black font-bold text-xs sm:text-sm font-classical disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Upload className="w-4 h-4 text-black" />
              <span>Import Questions to Custom Bank</span>
            </button>
          </div>
        )}

        {/* Tab 4: Question Bank List */}
        {activeTab === 'list' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {customQuestions.length === 0 ? (
              <p className="text-xs text-[#808090] font-mono text-center py-8">
                No custom questions added yet. Type a question or attach a photo above!
              </p>
            ) : (
              customQuestions.map((cq, idx) => (
                <div key={cq.id || idx} className="p-3.5 rounded-xl bg-[#121217] border border-[#262632] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[#e5c158] font-bold">
                      Custom Question #{idx + 1} ({cq.topic || 'Custom'})
                    </span>
                    {onDeleteQuestion && cq.id && (
                      <button
                        onClick={() => onDeleteQuestion(cq.id)}
                        className="p-1 rounded hover:bg-[#1f1f2a] text-[#a0a0b0] hover:text-[#e5c158] transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="font-classical font-bold text-white text-sm">{cleanMathText(cq.q)}</p>
                  <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-[#a0a0b0]">
                    {cq.options.map((o, oIdx) => (
                      <span key={oIdx} className={oIdx === cq.answer ? 'text-emerald-400 font-bold' : ''}>
                        {String.fromCharCode(65 + oIdx)}: {cleanMathText(o)}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Image Cropper Overlay Modal */}
        {isCropperOpen && cropperImage && (
          <ImageCropperModal
            imageSrc={cropperImage}
            onCropComplete={(croppedBase64) => {
              setAttachedImage(croppedBase64);
              setIsCropperOpen(false);
              setCropperImage(null);
            }}
            onCancel={() => {
              setIsCropperOpen(false);
              setCropperImage(null);
            }}
          />
        )}

        <ModalWatermark />
      </div>
    </div>
  );
};
