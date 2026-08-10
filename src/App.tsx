import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { ShuffledQuestion, QuizSettings, ProgressMap, QuizResult, Question, QuizMode } from './types';
import {
  getStoredSettings,
  saveSettings,
  getStoredProgress,
  saveProgress,
  getCustomQuestions,
  saveCustomQuestion,
  prepareQuizQuestions,
  getResultsHistory,
  saveResultToHistory
} from './utils/quizUtils';
import { TOPIC_SECTIONS } from './data/questionBank';
import { useAuth } from './context/AuthContext';
import { syncUserDataToFirestore, loadUserDataFromFirestore, isUserActivated } from './services/userService';
import { syncOfflineBankWithImages } from './services/offlineSyncService';

import { Header } from './components/Header';
import { Watermark } from './components/Watermark';

// Lazy loaded views and screens
const HomeScreen = lazy(() => import('./components/HomeScreen').then((m) => ({ default: m.HomeScreen })));
const StudyQuizView = lazy(() => import('./components/StudyQuizView').then((m) => ({ default: m.StudyQuizView })));
const QAQuizView = lazy(() => import('./components/QAQuizView').then((m) => ({ default: m.QAQuizView })));
const TestQuizView = lazy(() => import('./components/TestQuizView').then((m) => ({ default: m.TestQuizView })));
const ResultsScreen = lazy(() => import('./components/ResultsScreen').then((m) => ({ default: m.ResultsScreen })));

// Lazy loaded modals
const SettingsModal = lazy(() => import('./components/SettingsModal').then((m) => ({ default: m.SettingsModal })));
const FormulaSheetModal = lazy(() => import('./components/FormulaSheetModal').then((m) => ({ default: m.FormulaSheetModal })));
const CustomQuestionModal = lazy(() => import('./components/CustomQuestionModal').then((m) => ({ default: m.CustomQuestionModal })));
const AuthModal = lazy(() => import('./components/AuthModal').then((m) => ({ default: m.AuthModal })));
const ActivationModal = lazy(() => import('./components/ActivationModal').then((m) => ({ default: m.ActivationModal })));
const AdminTokenModal = lazy(() => import('./components/AdminTokenModal').then((m) => ({ default: m.AdminTokenModal })));
const QuizLaunchModal = lazy(() => import('./components/QuizLaunchModal').then((m) => ({ default: m.QuizLaunchModal })));

function ScreenLoader() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in duration-300">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-[#3a2f20]"></div>
        <div className="absolute inset-0 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin"></div>
      </div>
      <p className="text-xs font-mono text-[#c9a24d] tracking-widest uppercase animate-pulse">
        Loading module...
      </p>
    </div>
  );
}

function ModalLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-[#151310] border border-[#2e271d] p-6 text-center space-y-3">
        <div className="relative w-8 h-8 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-[#3a2f20]"></div>
          <div className="absolute inset-0 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin"></div>
        </div>
        <p className="text-xs font-mono text-[#b8a78a] tracking-wider uppercase">
          Loading dialog...
        </p>
      </div>
    </div>
  );
}

export function App() {
  const { user, profile } = useAuth();

  // Navigation & Screen State
  const [currentScreen, setCurrentScreen] = useState<'home' | 'quiz' | 'results'>('home');

  // App Settings & Saved Data
  const [settings, setSettings] = useState<QuizSettings>(getStoredSettings);
  const [progressMap, setProgressMap] = useState<ProgressMap>(getStoredProgress);
  const [customQuestions, setCustomQuestions] = useState<Question[]>(getCustomQuestions);

  // Auto-load & cache image storage on token unlocked devices while online
  useEffect(() => {
    const isUnlocked = isUserActivated(profile);
    if (isUnlocked && typeof window !== 'undefined') {
      // Sync image hints & custom question attached images to persistent local storage
      syncOfflineBankWithImages(customQuestions).catch((e) => {
        console.warn('Background image storage sync failed:', e);
      });
    }
  }, [profile, customQuestions]);

  // Modal Dialog States
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isFormulaSheetOpen, setIsFormulaSheetOpen] = useState<boolean>(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isActivationModalOpen, setIsActivationModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isQuizLaunchModalOpen, setIsQuizLaunchModalOpen] = useState<boolean>(false);
  const [launchInitialTopicIds, setLaunchInitialTopicIds] = useState<string[]>([]);
  const [launchInitialMode, setLaunchInitialMode] = useState<QuizMode>('qa');

  // Active Quiz State
  const [activeTopicId, setActiveTopicId] = useState<string>('all');
  const [activeQuestions, setActiveQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<boolean[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [lastQuizResult, setLastQuizResult] = useState<QuizResult | null>(null);

  // Timer Ref
  const timerIntervalRef = useRef<any>(null);

  // Load Firestore data when user logs in
  useEffect(() => {
    if (user) {
      loadUserDataFromFirestore(user.uid).then((remoteData) => {
        if (remoteData) {
          if (remoteData.progress) setProgressMap(remoteData.progress);
          if (remoteData.customQuestions) setCustomQuestions(remoteData.customQuestions);
          if (remoteData.settings) setSettings(remoteData.settings);
        }
      });
    }
  }, [user]);

  // Helper to trigger background Firestore sync if logged in
  const syncToCloud = (
    newProgress = progressMap,
    newCustomQs = customQuestions,
    newSettings = settings
  ) => {
    if (user?.uid) {
      syncUserDataToFirestore(
        user.uid,
        newProgress,
        getResultsHistory(),
        newCustomQs,
        newSettings
      );
    }
  };

  // Start timer when entering quiz screen
  useEffect(() => {
    if (currentScreen === 'quiz') {
      setElapsedSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [currentScreen]);

  // Handler: Open Quiz Launch Modal with initial topic selection
  const handleOpenQuizLaunchModal = (topicIdOrIds?: string | string[], overrideMode?: QuizMode) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    let initialIds: string[] = [];
    if (Array.isArray(topicIdOrIds)) {
      initialIds = topicIdOrIds;
    } else if (topicIdOrIds && topicIdOrIds !== 'all') {
      initialIds = topicIdOrIds.split(',');
    } else {
      initialIds = TOPIC_SECTIONS.map((s) => s.id);
    }

    setLaunchInitialTopicIds(initialIds);
    setLaunchInitialMode(overrideMode || settings.mode || 'qa');
    setIsQuizLaunchModalOpen(true);
  };

  // Handler: Execute Quiz Start with configured settings from modal
  const handleExecuteStartQuiz = (
    topicIds: string[],
    count: number | 'all',
    mode: QuizMode,
    timerEnabled: boolean,
    randomize: boolean
  ) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const topicIdStr = topicIds.join(',');
    const effectiveSettings: QuizSettings = {
      count,
      mode,
      timer: timerEnabled,
      randomize
    };

    const questions = prepareQuizQuestions(topicIds, customQuestions, effectiveSettings);
    if (questions.length === 0) {
      alert('No questions available in the selected topics.');
      return;
    }

    setActiveTopicId(topicIdStr);
    setActiveQuestions(questions);
    setCurrentIndex(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setFlaggedQuestions(new Array(questions.length).fill(false));

    setSettings(effectiveSettings);
    saveSettings(effectiveSettings);
    syncToCloud(progressMap, customQuestions, effectiveSettings);

    setCurrentScreen('quiz');
  };

  // Legacy/Direct handleStartQuiz helper
  const handleStartQuiz = (topicIdOrIds: string | string[], overrideMode?: QuizMode) => {
    handleOpenQuizLaunchModal(topicIdOrIds, overrideMode);
  };

  // Handler: Record option selection
  const handleSelectOption = (index: number, optionIdx: number) => {
    setSelectedAnswers((prev) => {
      const updated = [...prev];
      updated[index] = optionIdx;
      return updated;
    });
  };

  // Handler: Toggle question flag
  const handleToggleFlag = (index: number) => {
    setFlaggedQuestions((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // Handler: Submit Quiz and Compute Results
  const handleSubmitQuiz = () => {
    let correctCount = 0;
    const answerBreakdown = activeQuestions.map((q, idx) => {
      const sel = selectedAnswers[idx] ?? -1;
      const isCorrect = sel === q.answer;
      if (isCorrect) correctCount++;
      return {
        question: q,
        selectedOption: sel,
        isCorrect
      };
    });

    const totalCount = activeQuestions.length;
    const percentage = Math.round((correctCount / totalCount) * 100);

    let topicName = 'Full Calculus Suite';
    if (activeTopicId === 'custom') {
      topicName = 'Custom Questions';
    } else if (activeTopicId.includes(',')) {
      const ids = activeTopicId.split(',');
      const matchedSections = TOPIC_SECTIONS.filter((s) => ids.includes(s.id));
      topicName = `Combined Practice (${matchedSections.length} Topics: ${matchedSections.map((s) => s.name).join(', ')})`;
    } else {
      const topicObj = TOPIC_SECTIONS.find((s) => s.id === activeTopicId);
      if (topicObj) topicName = topicObj.name;
    }

    const result: QuizResult = {
      id: `result_${Date.now()}`,
      topicId: activeTopicId,
      topicName,
      totalQuestions: totalCount,
      correctCount,
      wrongCount: totalCount - correctCount,
      percentage,
      timeElapsedSeconds: elapsedSeconds,
      date: new Date().toISOString(),
      mode: settings.mode,
      answers: answerBreakdown
    };

    // Save progress to local storage
    saveProgress(activeTopicId, percentage);
    saveResultToHistory(result);
    const updatedProgress = getStoredProgress();
    setProgressMap(updatedProgress);

    // Sync to Firestore cloud
    syncToCloud(updatedProgress);

    setLastQuizResult(result);
    setCurrentScreen('results');
  };

  // Handler: Save settings
  const handleSaveSettings = (newSettings: QuizSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    syncToCloud(progressMap, customQuestions, newSettings);
  };

  // Handler: Add custom question
  const handleSaveCustomQuestion = (newQ: Question) => {
    const updated = saveCustomQuestion(newQ);
    setCustomQuestions(updated);
    syncToCloud(progressMap, updated, settings);
  };

  // Handler: Delete custom question
  const handleDeleteCustomQuestion = (id: string) => {
    const updated = customQuestions.filter((q) => q.id !== id);
    setCustomQuestions(updated);
    localStorage.setItem('studySuite_custom_questions', JSON.stringify(updated));
    syncToCloud(progressMap, updated, settings);
  };

  // Resolve Topic Display Name
  let currentTopicName = 'Full Calculus Mixed Test';
  if (activeTopicId === 'custom') {
    currentTopicName = 'Custom Question List';
  } else if (activeTopicId.includes(',')) {
    const ids = activeTopicId.split(',');
    const matchedSections = TOPIC_SECTIONS.filter((s) => ids.includes(s.id));
    if (matchedSections.length === TOPIC_SECTIONS.length) {
      currentTopicName = 'All Calculus Topics Combined';
    } else {
      currentTopicName = `Combined Practice (${matchedSections.length} Selected Topics)`;
    }
  } else {
    const currentTopicObj = TOPIC_SECTIONS.find((s) => s.id === activeTopicId);
    if (currentTopicObj) currentTopicName = currentTopicObj.name;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#100e0c] text-[#f4ecd8] selection:bg-[#c9a24d] selection:text-black font-sans antialiased">
      {/* Permanent Top Navigation Header */}
      <Header
        currentScreen={currentScreen}
        topicName={currentTopicName}
        mode={settings.mode}
        onGoHome={() => setCurrentScreen('home')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenFormulaSheet={() => setIsFormulaSheetOpen(true)}
        onOpenCustomQuestionModal={() => setIsCustomModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenActivationModal={() => setIsActivationModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col justify-start">
        <Suspense fallback={<ScreenLoader />}>
          {currentScreen === 'home' && (
            <HomeScreen
              progressMap={progressMap}
              customQuestionsCount={customQuestions.length}
              settings={settings}
              onSelectTopic={(topicId, mode) => handleStartQuiz(topicId, mode)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenFormulaSheet={() => setIsFormulaSheetOpen(true)}
              onOpenCustomModal={() => setIsCustomModalOpen(true)}
            />
          )}

          {currentScreen === 'quiz' && activeQuestions.length > 0 && (
            <div className="w-full my-auto">
              {settings.mode === 'study' && (
                <StudyQuizView
                  question={activeQuestions[currentIndex]}
                  currentIndex={currentIndex}
                  totalQuestions={activeQuestions.length}
                  onAnswerSelected={(optIdx) => {
                    handleSelectOption(currentIndex, optIdx);
                  }}
                  onNextQuestion={() => {
                    if (currentIndex < activeQuestions.length - 1) {
                      setCurrentIndex((prev) => prev + 1);
                    } else {
                      handleSubmitQuiz();
                    }
                  }}
                  onOpenActivationModal={() => setIsActivationModalOpen(true)}
                />
              )}

              {settings.mode === 'qa' && (
                <QAQuizView
                  question={activeQuestions[currentIndex]}
                  currentIndex={currentIndex}
                  totalQuestions={activeQuestions.length}
                  selectedAnswer={selectedAnswers[currentIndex]}
                  isFlagged={flaggedQuestions[currentIndex]}
                  onSelectOption={(optIdx) => handleSelectOption(currentIndex, optIdx)}
                  onToggleFlag={() => handleToggleFlag(currentIndex)}
                  onPrevious={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  onNext={() => setCurrentIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                  onSubmit={handleSubmitQuiz}
                  onOpenActivationModal={() => setIsActivationModalOpen(true)}
                />
              )}

              {settings.mode === 'test' && (
                <TestQuizView
                  question={activeQuestions[currentIndex]}
                  currentIndex={currentIndex}
                  totalQuestions={activeQuestions.length}
                  selectedAnswers={selectedAnswers}
                  flaggedQuestions={flaggedQuestions}
                  elapsedSeconds={elapsedSeconds}
                  showTimer={settings.timer}
                  onSelectOption={(optIdx) => handleSelectOption(currentIndex, optIdx)}
                  onToggleFlag={(idx) => handleToggleFlag(idx)}
                  onJumpToQuestion={(idx) => setCurrentIndex(idx)}
                  onPrevious={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  onNext={() => setCurrentIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                  onSubmitExam={handleSubmitQuiz}
                  onOpenActivationModal={() => setIsActivationModalOpen(true)}
                />
              )}
            </div>
          )}

          {currentScreen === 'results' && lastQuizResult && (
            <ResultsScreen
              result={lastQuizResult}
              onRestartQuiz={() => handleStartQuiz(activeTopicId)}
              onGoHome={() => setCurrentScreen('home')}
              onOpenActivationModal={() => setIsActivationModalOpen(true)}
            />
          )}
        </Suspense>
      </main>

      {/* Permanent Footer Watermark (On Every Screen) */}
      <Watermark />

      {/* Global Modals (Lazy Loaded with Suspense) */}
      <Suspense fallback={<ModalLoader />}>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
        />

        <ActivationModal
          isOpen={isActivationModalOpen}
          onClose={() => setIsActivationModalOpen(false)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        <AdminTokenModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          settings={settings}
          onClose={() => setIsSettingsOpen(false)}
          onSaveSettings={handleSaveSettings}
        />

        <FormulaSheetModal
          isOpen={isFormulaSheetOpen}
          onClose={() => setIsFormulaSheetOpen(false)}
        />

        <CustomQuestionModal
          isOpen={isCustomModalOpen}
          customQuestions={customQuestions}
          onClose={() => setIsCustomModalOpen(false)}
          onSaveQuestion={handleSaveCustomQuestion}
          onDeleteQuestion={handleDeleteCustomQuestion}
        />

        <QuizLaunchModal
          isOpen={isQuizLaunchModalOpen}
          onClose={() => setIsQuizLaunchModalOpen(false)}
          initialTopicIds={launchInitialTopicIds}
          initialMode={launchInitialMode}
          settings={settings}
          customQuestionsCount={customQuestions.length}
          onStartQuiz={handleExecuteStartQuiz}
        />
      </Suspense>
    </div>
  );
}

export default App;

