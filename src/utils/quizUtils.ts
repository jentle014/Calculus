import { Question, ShuffledQuestion, QuizSettings, ProgressMap, QuizResult } from '../types';
import { RAW_QUESTION_BANK, TOPIC_SECTIONS } from '../data/questionBank';
import { cleanQuestionObject } from './mathUtils';

// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Option Shuffling Algorithm:
// Guarantees the correct option position is randomized for every execution
export function shuffleQuestion(question: Question): ShuffledQuestion {
  // Ensure question has 4 options
  let options = [...question.options];
  let answerIndex = question.answer;

  if (options.length < 4) {
    const fixed = autoGenerateMissingOptions(question.q, options, answerIndex);
    options = fixed.options;
    answerIndex = fixed.answer;
  }

  const correctOptionText = options[answerIndex] ?? options[0];
  const shuffledOptions = shuffleArray(options);
  const shuffledAnswerIndex = shuffledOptions.indexOf(correctOptionText);

  return {
    ...question,
    options: shuffledOptions,
    answer: shuffledAnswerIndex, // New answer index in shuffled array
    shuffledOptions,
    shuffledAnswerIndex
  };
}

export function prepareQuizQuestions(
  topicIdOrIds: string | string[],
  customQuestions: Question[],
  settings: QuizSettings
): ShuffledQuestion[] {
  const allBank = [...RAW_QUESTION_BANK, ...customQuestions];

  const topicIds = Array.isArray(topicIdOrIds)
    ? topicIdOrIds
    : topicIdOrIds.includes(',')
    ? topicIdOrIds.split(',').map((s) => s.trim())
    : [topicIdOrIds];

  let filtered: Question[] = [];

  if (topicIds.length === 0 || topicIds.includes('all')) {
    filtered = allBank;
  } else if (topicIds.length === 1 && topicIds[0] === 'custom') {
    filtered = customQuestions;
  } else {
    // Collect section names for matching
    const selectedSections = TOPIC_SECTIONS.filter((s) => topicIds.includes(s.id));
    const sectionNamesLower = selectedSections.map((s) => s.name.toLowerCase());

    filtered = allBank.filter((q) => {
      const qTopicLower = q.topic.toLowerCase();
      // Match if question topic equals or contains any selected section name
      const matchesSection = sectionNamesLower.some(
        (secName) => qTopicLower === secName || qTopicLower.includes(secName) || secName.includes(qTopicLower)
      );
      // Also match if topic ID string appears in question topic or ID
      const matchesId = topicIds.some((tid) => qTopicLower.includes(tid.toLowerCase()));
      return matchesSection || matchesId;
    });
  }

  if (filtered.length === 0) {
    filtered = RAW_QUESTION_BANK;
  }

  // Question Order Randomization
  let processed = settings.randomize ? shuffleArray(filtered) : [...filtered];

  // Limit count
  const limit = settings.count === 'all' ? processed.length : Math.min(settings.count, processed.length);
  processed = processed.slice(0, limit);

  // Apply Option Shuffling to every question instance!
  return processed.map((q) => shuffleQuestion(q));
}

// Fallback logic for missing options in user input questions
export function autoGenerateMissingOptions(
  questionText: string,
  existingOptions: string[] = [],
  correctIndex = 0
): { options: string[]; answer: number } {
  let correctVal = existingOptions[correctIndex] || 'Correct Solution';
  if (!existingOptions || existingOptions.length === 0) {
    correctVal = 'Calculated exact value / identity';
  }

  const distractors = [
    '0',
    '1',
    'Undefined / Does not exist',
    'x + C',
    '2x + 1',
    'None of the above',
    'Cannot be determined from given data'
  ];

  const pool = [correctVal];
  for (const item of existingOptions) {
    if (item && !pool.includes(item)) {
      pool.push(item);
    }
  }

  for (const d of distractors) {
    if (pool.length >= 4) break;
    if (!pool.includes(d)) {
      pool.push(d);
    }
  }

  while (pool.length < 4) {
    pool.push(`Option ${pool.length + 1}`);
  }

  return {
    options: pool.slice(0, 4),
    answer: 0 // In pool, index 0 is correctVal, shuffleQuestion will then randomize position!
  };
}

// LocalStorage Persistence Keys
const SETTINGS_KEY = 'studySuite_settings';
const PROGRESS_KEY = 'studySuite_progress';
const CUSTOM_QS_KEY = 'studySuite_custom_questions';
const RESULTS_HISTORY_KEY = 'studySuite_results_history';

export const DEFAULT_SETTINGS: QuizSettings = {
  count: 20,
  randomize: true,
  mode: 'study',
  timer: false
};

export function getStoredSettings(): QuizSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Failed to read settings from storage:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: QuizSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings to storage:', e);
  }
}

export function getStoredProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read progress from storage:', e);
  }
  return {};
}

export function saveProgress(topicId: string, scorePercentage: number): void {
  try {
    const progress = getStoredProgress();
    const existing = progress[topicId] || { attempts: 0, bestScore: 0, lastScore: 0, lastAttempt: '' };
    progress[topicId] = {
      attempts: existing.attempts + 1,
      bestScore: Math.max(existing.bestScore, scorePercentage),
      lastScore: scorePercentage,
      lastAttempt: new Date().toISOString()
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save progress to storage:', e);
  }
}

export function getCustomQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(CUSTOM_QS_KEY);
    if (raw) {
      const parsed: Question[] = JSON.parse(raw);
      return (parsed || []).map((q) => cleanQuestionObject(q));
    }
  } catch (e) {
    console.warn('Failed to read custom questions from storage:', e);
  }
  return [];
}

export function saveCustomQuestion(question: Question): Question[] {
  try {
    const cleaned = cleanQuestionObject(question);
    const current = getCustomQuestions();
    const updated = [cleaned, ...current];
    localStorage.setItem(CUSTOM_QS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Failed to save custom question:', e);
    return getCustomQuestions();
  }
}

export function getResultsHistory(): QuizResult[] {
  try {
    const raw = localStorage.getItem(RESULTS_HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read results history:', e);
  }
  return [];
}

export function saveResultToHistory(result: QuizResult): void {
  try {
    const current = getResultsHistory();
    const updated = [result, ...current].slice(0, 50); // keep last 50
    localStorage.setItem(RESULTS_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save result history:', e);
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
