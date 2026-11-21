export type UnitThemeId =
  | 'space'
  | 'force'
  | 'life'
  | 'light'
  | 'matter'
  | 'electric'
  | 'eco';

export type StationType = 'hap' | 'sim' | 'cards' | 'fill' | 'quiz';

export type SimulationType =
  | 'sun-spots'
  | 'moon-phases'
  | 'sun-earth-moon'
  | 'dynamometer'
  | 'mass-weight'
  | 'friction-lab'
  | 'cell-explorer'
  | 'cell-to-organism'
  | 'skeleton-motion'
  | 'light-rays'
  | 'light-transparency'
  | 'shadow-lab'
  | 'particle-states'
  | 'heat-exchange'
  | 'phase-change'
  | 'heat-insulation'
  | 'circuit-symbols'
  | 'bulb-brightness'
  | 'waste-sorting'
  | 'zero-waste-hierarchy';

export interface FlashcardItem {
  id: string;
  frontPrompt: string;
  frontHint: string;
  backAnswer: string;
  miniSummaryTitle: string;
  miniSummaryPoints: string[];
  dailyLifeTip: string;
}

export interface FillBlankItem {
  id: string;
  beforeBlank: string;
  afterBlank: string;
  answer: string;
  distractors: string[];
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'tf';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  miniSummaryTitle: string;
}

export interface HapBilgiItem {
  id: string;
  category: 'bilgi-istasyonu' | 'kopru' | 'cagini-asanlar' | 'kritik-not';
  title: string;
  content: string;
}

export interface TopicTest {
  id: string;
  order: number;
  isExtra: boolean;
  title: string;
  subtitle: string;
  xpReward: number;
  questions: QuizQuestion[];
}

export interface TestRecord {
  bestScore: number;
  total: number;
  passed: boolean;
  isPerfect: boolean;
}

export interface TopicData {
  id: string;
  unitId: string;
  orderLabel: string;
  title: string;
  shortTitle: string;
  tagline: string;
  heroImage: string;
  secondaryImage: string;
  imageAlt: string;
  simType: SimulationType;
  simTitle: string;
  simSubtitle: string;
  keyNoteTitle: string;
  keyNotes: string[];
  hapBilgiler: HapBilgiItem[];
  flashcards: FlashcardItem[];
  fillBlanks: FillBlankItem[];
  tests: TopicTest[];
}

export interface UnitData {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  theme: UnitThemeId;
  coverImage: string;
  description: string;
  topics: TopicData[];
}

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
}

export interface DailyQuestDef {
  id: string;
  title: string;
  target: number;
  xpReward: number;
  metric: 'cardsSwiped' | 'simsDone' | 'quizzesDone';
}

export interface StudentProgress {
  hasStarted: boolean;
  activeUnitId: string;
  activeTopicId: string;
  completedStations: Record<string, StationType[]>;
  completedTests: Record<string, TestRecord>;
  xp: number;
  soundEnabled: boolean;
  unlockedBadges: string[];
  perfectQuizTopics: string[];
  dailyDate: string;
  dailyStats: {
    cardsSwiped: number;
    simsDone: number;
    quizzesDone: number;
  };
  claimedQuests: string[];
}

export interface CelebrationPayload {
  type: 'level-up' | 'badge' | 'topic-complete' | 'unit-complete' | 'all-complete';
  title: string;
  subtitle: string;
  xpBonus?: number;
  badgeIcon?: string;
  actionLabel?: string;
  nextTarget?: {
    unitId: string;
    topicId: string;
    label: string;
  };
}
