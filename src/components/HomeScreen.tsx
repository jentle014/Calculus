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
  Search,
  Wifi,
  WifiOff,
  CheckSquare,
  Square,
  X,
  RotateCcw,
  Compass,
  Image as ImageIcon,
  Camera,
  Plus,
  Upload
} from 'lucide-react';
import { ProgressMap, QuizSettings, QuizMode } from '../types';
import { TOPIC_SECTIONS } from '../data/questionBank';
import { useAuth } from '../context/AuthContext';
import { isUserActivated } from '../services/userService';

interface HomeScreenProps {
  progressMap: ProgressMap;
  customQuestionsCount: number;
  settings: QuizSettings;
  onSelectTopic: (topicId: string | string[], mode?: QuizMode) => void;
  onOpenSettings: () => void;
  onOpenFormulaSheet: () => void;
  onOpenCustomModal: () => void;
}

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
  onSelectTopic,
  onOpenFormulaSheet,
  onOpenCustomModal
}) => {
  const { profile, isOffline } = useAuth();

  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
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

  // Toggle topic selection
  const toggleTopicSelection = (id: string) => {
    setSelectedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedTopicIds(TOPIC_SECTIONS.map((s) => s.id));
  };

  const handleClearSelection = () => {
    setSelectedTopicIds([]);
  };

  const selectedSections = TOPIC_SECTIONS.filter((s) => selectedTopicIds.includes(s.id));
  const totalSelectedQuestionsCount = selectedTopicIds.length === 0
    ? 111
    : selectedSections.reduce((acc, s) => acc + s.questionCount, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Clean Welcome Banner & Quick Actions */}
      <div className="rounded-2xl bg-[#08080a] border border-[#1f1f26] p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14141a] border border-[#2a2a35] text-xs font-mono text-[#e5c158]">
                <Compass className="w-3.5 h-3.5 text-[#e5c158]" />
                <span>Calculus Practice Suite</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#101015] border border-[#22222a] text-xs font-mono text-[#a0a0b0]">
                {isOffline ? <WifiOff className="w-3 h-3 text-amber-400" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
                <span>{isOffline ? 'Offline' : 'Online'}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#ffffff] font-classical tracking-tight">
              {profile ? `Welcome back, ${profile.name.split(' ')[0]}!` : 'Calculus Mastery'}
            </h1>
            <p className="text-xs sm:text-sm text-[#d0d0d8] font-writeup leading-relaxed">
              Select any topic below or check multiple topics to practice custom combinations with step-by-step solutions and formula references.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 min-w-[220px]">
            <button
              onClick={() => onSelectTopic(selectedTopicIds.length > 0 ? selectedTopicIds : 'all', 'qa')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#e5c158] text-black hover:bg-[#f3d172] font-bold text-xs sm:text-sm font-classical transition-all shadow-md"
            >
              <Zap className="w-4 h-4 text-black fill-black" />
              <span>
                {selectedTopicIds.length > 0
                  ? `Launch Q&A (${selectedTopicIds.length} Selected)`
                  : 'Start All Topics Q&A'}
              </span>
            </button>

            <button
              onClick={() => onSelectTopic(selectedTopicIds.length > 0 ? selectedTopicIds : 'all', 'study')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#14141a] hover:bg-[#1a1a22] text-[#e5c158] font-bold text-xs sm:text-sm border border-[#2a2a35] transition-all"
            >
              <Play className="w-4 h-4 fill-[#e5c158]" />
              <span>
                {selectedTopicIds.length > 0
                  ? `Guided Study (${selectedTopicIds.length} Selected)`
                  : 'Guided Study Suite'}
              </span>
            </button>

            <button
              onClick={onOpenCustomModal}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#181822] hover:bg-[#222230] text-[#ffffff] font-bold text-xs sm:text-sm border border-[#2a2a38] transition-all"
            >
              <Plus className="w-4 h-4 text-[#e5c158]" />
              <span>Add Custom Question</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#1c1c24]">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#e5c158]" />
            <div>
              <p className="text-[11px] text-[#808090] font-mono uppercase">Bank Qs</p>
              <p className="text-sm font-bold text-[#ffffff] font-mono">111 Questions</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <BarChart2 className="w-4 h-4 text-[#e5c158]" />
            <div>
              <p className="text-[11px] text-[#808090] font-mono uppercase">Completed</p>
              <p className="text-sm font-bold text-[#ffffff] font-mono">{totalAttempts} Quizzes</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-[#e5c158]" />
            <div>
              <p className="text-[11px] text-[#808090] font-mono uppercase">Accuracy</p>
              <p className="text-sm font-bold text-[#ffffff] font-mono">{avgBestScore}% Avg</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-[#e5c158]" />
            <div>
              <p className="text-[11px] text-[#808090] font-mono uppercase">Custom Qs</p>
              <p className="text-sm font-bold text-[#ffffff] font-mono">{customQuestionsCount} Custom</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Topic Explorer & Selection Section */}
      <div className="space-y-4">
        {/* Search, Categories, and Quick Select Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0a0a0d] border border-[#1f1f26]">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#808090] absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search calculus topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121217] border border-[#262632] text-xs text-[#ffffff] placeholder-[#808090] focus:outline-none focus:border-[#e5c158]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#181820] text-[#e5c158] border border-[#2a2a35] font-bold'
                    : 'bg-[#101014] text-[#a0a0b0] border border-[#1f1f26] hover:text-[#ffffff]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Selection Active Bar (if topics are selected) */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#22222c]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#ffffff] font-classical">
              {selectedTopicIds.length > 0
                ? `${selectedTopicIds.length} Topic${selectedTopicIds.length > 1 ? 's' : ''} Selected (${totalSelectedQuestionsCount} Qs)`
                : 'Check boxes to select multiple topics'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="px-2.5 py-1 rounded-lg bg-[#181820] hover:bg-[#22222d] text-[#e5c158] text-xs font-mono border border-[#2a2a35] transition-colors"
            >
              Select All
            </button>
            {selectedTopicIds.length > 0 && (
              <button
                onClick={handleClearSelection}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#241515] hover:bg-[#331c1c] text-amber-300 text-xs font-mono border border-amber-900/60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Selected Topic Pills */}
        {selectedTopicIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {selectedSections.map((sec) => (
              <span
                key={sec.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#181820] border border-[#2a2a35] text-[#e5c158] text-xs font-mono"
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

        {/* Grid of Topic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredSections.length === 0 ? (
            <div className="col-span-full p-8 text-center text-[#808090] font-mono text-xs">
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
                      ? 'bg-[#14141a] border-[#e5c158] shadow-lg ring-1 ring-[#e5c158]/30'
                      : 'bg-[#08080a] hover:bg-[#101014] border-[#1f1f26]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTopicSelection(sec.id);
                      }}
                      className={`p-1.5 rounded-lg border transition-all shrink-0 ${
                        isChecked
                          ? 'bg-[#e5c158] text-black border-[#e5c158]'
                          : 'bg-[#121217] text-[#808090] border-[#262632] hover:border-[#e5c158]'
                      }`}
                      title={isChecked ? 'Unselect topic' : 'Select topic'}
                    >
                      {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </button>

                    <div className="p-2 rounded-lg bg-[#121217] border border-[#262632] shrink-0">
                      {ICON_MAP[sec.iconName] || <BookOpen className="w-5 h-5 text-[#e5c158]" />}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#ffffff] font-classical truncate">{sec.name}</h4>
                      <p className="text-xs text-[#a0a0b0] font-mono mt-0.5 truncate">
                        {sec.category} • {sec.questionCount} Qs
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
  );
};
