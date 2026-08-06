export interface QuestionStep {
  title: string;
  body: string;
}

export interface Question {
  id: string;
  topic: string; // Section name (e.g., 'Functions', 'Limits & Continuity', 'Differentiation', etc.)
  q: string; // Question text
  options: string[]; // 4 multiple choice options
  answer: number; // 0-based index of correct option
  pattern?: string; // Formula pattern or key identity rule float
  hint?: string; // Quick hint for Q&A mode
  steps: QuestionStep[]; // Step-by-step solution breakdown for Study mode & Review
}

export interface ShuffledQuestion extends Question {
  shuffledOptions: string[];
  shuffledAnswerIndex: number;
}

export type QuizMode = 'study' | 'qa' | 'test';

export interface QuizSettings {
  count: number | 'all';
  randomize: boolean;
  mode: QuizMode;
  timer: boolean;
}

export interface TopicSection {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  iconName: string;
  category: string;
}

export interface QuizResult {
  id?: string;
  topicId?: string;
  topicName: string;
  mode: QuizMode;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  percentage: number;
  timeElapsedSeconds: number;
  date: string;
  answers: {
    question: ShuffledQuestion;
    selectedOption: number;
    isCorrect: boolean;
    flagged?: boolean;
  }[];
}

export interface TopicProgress {
  attempts: number;
  bestScore: number;
  lastScore: number;
  lastAttempt: string;
}

export type ProgressMap = Record<string, TopicProgress>;

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  department: string;
  school: string;
  isActivated?: boolean;
  activationToken?: string;
  activatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivationToken {
  id?: string;
  code: string;
  isUsed: boolean;
  usedByUid?: string;
  usedByEmail?: string;
  createdAt: string;
  usedAt?: string;
}

