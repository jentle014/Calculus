import React, { useState } from 'react';
import {
  FunctionSquare,
  GitCommitVertical,
  TrendingUp,
  Activity,
  Layers,
  PieChart,
  Sigma,
  Award,
  Play,
  BookOpen,
  CheckCircle2,
  Trophy,
  BarChart2,
  Zap,
  ChevronDown,
  Compass,
  Search,
  Wifi,
  WifiOff,
  CheckSquare,
  Square,
  X,
  ListChecks,
  RotateCcw,
  Plus
} from 'lucide-react';
import { TopicSection, ProgressMap, QuizSettings, QuizMode } from '../types';
import { TOPIC_SECTIONS } from '../data/questionBank';
import { useAuth } from '../context/AuthContext';

interface HomeScreenProps {
  progressMap: ProgressMap;
  customQuestionsCount: number;
  settings: QuizSettings;
  onSelectTopic: (topicId: string | string[], mode?: QuizMode) => void;
  onOpenSettings: () => void;
  onOpenFormulaSheet: () => void;
  onOpenCustomModal: () => void;
}

// Unified Icon map with consistent gold theme color
const ICON_MAP: Record<string, React.ReactNode> = {
  FunctionSquare: <FunctionSquare className="w-5 h-5 text-[#d4af37]" />,
  GitCommitVertical: <GitCommitVertical className="w-5 h-5 text-[#d4af37]" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-[#d4af37]" />,
  Activity: <Activity className="w-5 h-5 text-[#d4af37]" />,
  Layers: <Layers className="w-5 h-5 text-[#d4af37]" />,
  PieChart: <PieChart className="w-5 h-5 text-[#d4af37]" />,
  Sigma: <Sigma className="w-5 h-5 text-[#d4af37]" />,
  Award: <Award className="w-5 h-5 text-[#d4af37]" />
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progressMap,
  customQuestionsCount,
  settings,
  onSelectTopic,
  onOpenSettings,
  onOpenFormulaSheet,
  onOpenCustomModal
}) => {
  const { profile, isOffline } = useAuth();

  // Multi-topic selection state
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [selectedSingleFocusId, setSelectedSingleFocusId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Compute overall progress stats
  const progressList = Object.values(progressMap) as { attempts: number; bestScore: number }[];
  const totalAttempts = progressList.reduce((acc, curr) => acc + curr.attempts, 0);
  const bestScores = progressList.map((p) => p.bestScore);
  const avgBestScore = bestScores.length > 0 ? Math.round(bestScores.reduce((a, b) => a + b, 0) / bestScores.length) : 0;

  // Filter sections by category tab menu and search query
  const categories = ['All', 'Differential', 'Integral', 'Advanced'];
  const filteredSections = TOPIC_SECTIONS.filter((section) => {
    const matchesCategory = selectedCategory === 'All' || section.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Toggle single topic selection in multi-select mode
  const toggleTopicSelection = (id: string) => {
    setSelectedTopicIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Quick Select Presets
  const handleSelectAll = () => {
    setSelectedTopicIds(TOPIC_SECTIONS.map((s) => s.id));
  };

  const handleClearSelection = () => {
    setSelectedTopicIds([]);
  };

  const handleSelectCategoryPreset = (categoryName: string) => {
    const matchingIds = TOPIC_SECTIONS.filter((s) => {
      if (categoryName === 'Calculus I') return ['limits', 'differentiation', 'stationary'].includes(s.id);
      if (categoryName === 'Calculus II') return ['integration', 'applications', 'series'].includes(s.id);
      if (categoryName === 'Pre-Calculus') return s.id === 'functions';
      if (categoryName === 'Advanced') return s.id === 'challenge';
      return false;
    }).map((s) => s.id);

    setSelectedTopicIds((prev) => {
      const combined = new Set([...prev, ...matchingIds]);
      return Array.from(combined);
    });
  };

  // Calculate question count for selected topic subset
  const selectedSections = TOPIC_SECTIONS.filter((s) => selectedTopicIds.includes(s.id));
  const totalSelectedQuestionsCount = selectedTopicIds.length === 0
    ? 111
    : selectedSections.reduce((acc, s) => acc + s.questionCount, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[#151310] border border-[#2e271d] p-6 sm:p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#382b18]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#251f16] border border-[#483a26] text-xs font-mono uppercase tracking-wider text-[#d4af37]">
                <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
                Calculus Study Suite
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1a14] border border-[#322a1f] text-xs font-mono text-[#c8b89a]">
                {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isOffline ? 'Offline Mode' : 'Online Sync'}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f4ecd8] font-classical tracking-tight leading-tight">
              {profile ? `Welcome back, ${profile.name.split(' ')[0]}!` : 'Master Calculus.'}<br className="hidden sm:inline" /> Choose One or Multiple Topics.
            </h1>
            <p className="text-sm sm:text-base text-[#c8b89a] font-writeup leading-relaxed">
              Select single topics or check multiple topics to practice custom combinations with step-by-step solutions, formulas, and randomized options.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 min-w-[240px]">
            <button
              onClick={() => onSelectTopic(selectedTopicIds.length > 0 ? selectedTopicIds : 'all', 'qa')}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#c9a24d] text-black hover:bg-[#d8b45c] font-bold text-xs sm:text-sm font-classical transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 text-black" />
              <span>
                {selectedTopicIds.length > 0
                  ? `Q&A Practice (${selectedTopicIds.length} Topics)`
                  : 'Launch Q&A Mode (All Topics)'}
              </span>
            </button>

            <button
              onClick={() => onSelectTopic(selectedTopicIds.length > 0 ? selectedTopicIds : 'all', 'study')}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#282117] hover:bg-[#342a1d] text-[#d4af37] font-bold text-xs sm:text-sm border border-[#483a26] transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-[#d4af37]" />
              <span>
                {selectedTopicIds.length > 0
                  ? `Guided Study (${selectedTopicIds.length} Topics)`
                  : 'Guided Study Suite'}
              </span>
            </button>

            <button
              onClick={onOpenFormulaSheet}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1d1914] hover:bg-[#28221b] text-[#c8b89a] text-xs font-semibold border border-[#382f22] transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
              <span>Reference Formula Sheet</span>
            </button>
          </div>
        </div>

        {/* Global Progress Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#2e271d]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#1d1914] border border-[#382f22] text-[#d4af37]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#b8a78a] font-medium font-writeup">Total Questions</p>
              <p className="text-lg font-bold text-[#f4ecd8] font-mono">111 Bank Qs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#1d1914] border border-[#382f22] text-[#d4af37]">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#b8a78a] font-medium font-writeup">Quizzes Completed</p>
              <p className="text-lg font-bold text-[#f4ecd8] font-mono">{totalAttempts}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#1d1914] border border-[#382f22] text-[#d4af37]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#b8a78a] font-medium font-writeup">Avg Best Accuracy</p>
              <p className="text-lg font-bold text-[#f4ecd8] font-mono">{avgBestScore}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#1d1914] border border-[#382f22] text-[#d4af37]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#b8a78a] font-medium font-writeup">Custom User Qs</p>
              <p className="text-lg font-bold text-[#f4ecd8] font-mono">{customQuestionsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MULTI-TOPIC SELECTION BUILDER BANNER */}
      <div className="p-5 rounded-2xl bg-[#1a1612] border border-[#3e3223] space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#282117] border border-[#483a26] text-[#d4af37]">
              <ListChecks className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#f4ecd8] font-classical">
                  Multi-Topic Combination Builder
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#282117] text-[#d4af37] border border-[#483a26] text-[11px] font-mono font-bold">
                  {selectedTopicIds.length > 0 ? `${selectedTopicIds.length} Selected` : 'Select Topics Below'}
                </span>
              </div>
              <p className="text-xs text-[#b8a78a] font-writeup">
                {selectedTopicIds.length === 0
                  ? 'Check multiple topic cards below to generate a tailored multi-topic calculus practice quiz'
                  : `Combines ${totalSelectedQuestionsCount} practice questions from your selected topics`}
              </p>
            </div>
          </div>

          {/* Quick Selection Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1.5 rounded-lg bg-[#282117] hover:bg-[#382c1a] text-[#d4af37] text-xs font-semibold border border-[#483a26] transition-colors"
            >
              Select All (8)
            </button>
            <button
              onClick={() => handleSelectCategoryPreset('Calculus I')}
              className="px-3 py-1.5 rounded-lg bg-[#1d1914] hover:bg-[#28221b] text-[#c8b89a] text-xs font-semibold border border-[#382f22] transition-colors"
            >
              Calculus I
            </button>
            <button
              onClick={() => handleSelectCategoryPreset('Calculus II')}
              className="px-3 py-1.5 rounded-lg bg-[#1d1914] hover:bg-[#28221b] text-[#c8b89a] text-xs font-semibold border border-[#382f22] transition-colors"
            >
              Calculus II
            </button>
            {selectedTopicIds.length > 0 && (
              <button
                onClick={handleClearSelection}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#241c18] hover:bg-[#33221b] text-amber-300 text-xs font-semibold border border-amber-900/60 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Selection</span>
              </button>
            )}
          </div>
        </div>

        {/* Selected Topic Badges */}
        {selectedTopicIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2e271d]">
            <span className="text-xs text-[#8a7a60] font-mono font-medium">Selected Topics:</span>
            {selectedSections.map((sec) => (
              <span
                key={sec.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#282117] border border-[#483a26] text-[#d4af37] text-xs font-medium font-mono"
              >
                <span>{sec.name}</span>
                <button
                  onClick={() => toggleTopicSelection(sec.id)}
                  className="hover:text-white transition-colors"
                  title="Remove topic"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Action buttons for multi-selection */}
        {selectedTopicIds.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-[#2e271d]">
            <button
              onClick={() => onSelectTopic(selectedTopicIds, 'qa')}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#c9a24d] hover:bg-[#d8b45c] text-black font-bold text-xs sm:text-sm font-classical transition-all shadow-md"
            >
              <Zap className="w-4 h-4 text-black" />
              <span>Start Q&A Mode ({selectedTopicIds.length} Topics)</span>
            </button>

            <button
              onClick={() => onSelectTopic(selectedTopicIds, 'study')}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#282117] hover:bg-[#342a1d] text-[#d4af37] font-bold text-xs sm:text-sm border border-[#483a26] transition-all"
            >
              <Play className="w-4 h-4 fill-[#d4af37]" />
              <span>Start Guided Study ({selectedTopicIds.length} Topics)</span>
            </button>

            <button
              onClick={() => onSelectTopic(selectedTopicIds, 'test')}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1d1914] hover:bg-[#28221b] text-[#f4ecd8] font-bold text-xs sm:text-sm border border-[#3d3323] transition-all"
            >
              <Zap className="w-4 h-4 text-[#d4af37]" />
              <span>Start Speed Test ({selectedTopicIds.length} Topics)</span>
            </button>
          </div>
        )}
      </div>

      {/* MODULE MENU SECTION */}
      <div className="space-y-6">
        {/* Menu Header & Dropdown Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#151310] border border-[#2e271d]">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-[#d4af37]" />
            <div>
              <h2 className="text-lg font-bold text-[#f4ecd8] font-classical">Calculus Module Explorer</h2>
              <p className="text-xs text-[#b8a78a] font-writeup">Toggle topic checkboxes below to combine multiple topics</p>
            </div>
          </div>

          {/* Interactive Dropdown Menu Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <select
                value={selectedSingleFocusId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedSingleFocusId(val);
                  if (val !== 'all' && val !== 'custom') {
                    if (!selectedTopicIds.includes(val)) {
                      setSelectedTopicIds([val]);
                    }
                  } else if (val === 'all') {
                    setSelectedTopicIds([]);
                  }
                }}
                className="w-full sm:w-72 px-4 py-2.5 rounded-xl bg-[#1d1914] border border-[#382f22] text-sm font-medium text-[#f4ecd8] appearance-none focus:outline-none focus:border-[#d4af37] cursor-pointer pr-10"
              >
                <optgroup label="General / All Topics">
                  <option value="all">All Topics Combined</option>
                </optgroup>
                <optgroup label="Core Calculus Sections">
                  {TOPIC_SECTIONS.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name} ({sec.questionCount} Qs)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="User Custom Bank">
                  <option value="custom">Custom Question Bank ({customQuestionsCount} Qs)</option>
                </optgroup>
              </select>
              <ChevronDown className="w-4 h-4 text-[#d4af37] absolute right-3.5 top-3.5 pointer-events-none" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenFormulaSheet}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#1d1914] hover:bg-[#28221b] text-[#c8b89a] text-xs font-medium border border-[#382f22] transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#d4af37]" />
                <span>Formulas</span>
              </button>
              <button
                onClick={onOpenCustomModal}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#1d1914] hover:bg-[#28221b] text-[#c8b89a] text-xs font-medium border border-[#382f22] transition-colors"
              >
                <Plus className="w-4 h-4 text-[#d4af37]" />
                <span>Add Qs</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar & Category Menu Bar */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[#2e271d]">
            {/* Search topics input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#8a7a60] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search topics e.g. limits, derivatives, integration, series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1d1914] border border-[#382f22] text-xs text-[#f4ecd8] placeholder-[#8a7a60] focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#282117] text-[#d4af37] border border-[#483a26] font-bold'
                      : 'bg-[#151310] text-[#b8a78a] border border-[#2e271d] hover:text-[#f4ecd8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Topic Cards with Checkboxes for Multi-Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSections.length === 0 ? (
              <div className="col-span-full p-8 text-center text-[#8a7a60] font-mono text-xs">
                No calculus topics matching "{searchQuery}"
              </div>
            ) : (
              filteredSections.map((sec) => {
                const isChecked = selectedTopicIds.includes(sec.id);
                const p = progressMap[sec.id];

                return (
                  <div
                    key={sec.id}
                    onClick={() => toggleTopicSelection(sec.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isChecked
                        ? 'bg-[#251f16] border-[#d4af37] shadow-lg ring-1 ring-[#d4af37]/30'
                        : 'bg-[#151310] hover:bg-[#1d1914] border-[#2e271d]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox Icon */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTopicSelection(sec.id);
                        }}
                        className={`p-1.5 rounded-lg border transition-all shrink-0 ${
                          isChecked
                            ? 'bg-[#d4af37] text-black border-[#d4af37]'
                            : 'bg-[#1d1914] text-[#8a7a60] border-[#382f22] hover:border-[#d4af37]'
                        }`}
                        title={isChecked ? 'Unselect topic' : 'Select topic'}
                      >
                        {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      </button>

                      <div className="p-2 rounded-lg bg-[#1d1914] border border-[#382f22] shrink-0">
                        {ICON_MAP[sec.iconName] || <BookOpen className="w-5 h-5 text-[#d4af37]" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#f4ecd8] font-classical truncate">{sec.name}</h4>
                        </div>
                        <p className="text-xs text-[#b8a78a] font-mono mt-0.5 truncate">
                          {sec.category} • {sec.questionCount} Questions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {p ? (
                        <span className="text-xs font-mono text-[#d4af37] font-bold bg-[#282117] px-2 py-1 rounded border border-[#483a26]">
                          {p.bestScore}%
                        </span>
                      ) : null}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTopic(sec.id, 'qa');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#282117] hover:bg-[#382c1a] text-[#d4af37] text-xs font-bold transition-all border border-[#483a26]"
                        title="Start Q&A Mode for this topic"
                      >
                        Q&A
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTopic(sec.id, 'study');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1d1914] hover:bg-[#c9a24d] hover:text-black text-[#f4ecd8] text-xs font-bold transition-all border border-[#382f22]"
                        title="Start Guided Study for this topic"
                      >
                        Study
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
