/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ClipboardCheck, Menu, Trophy, Volume2, VolumeX } from 'lucide-react';
import {
  BADGES,
  CURRICULUM,
  DAILY_QUESTS,
  findTestById,
  findTopicById,
  getAllTests,
  getLevelForXp,
  getTopicExtraTests,
  getTopicRequiredTests,
} from './data/curriculum';
import { CelebrationPayload, StationType, StudentProgress, TopicTest } from './types';
import { UNIT_THEMES } from './utils/theme';
import { soundEngine } from './utils/sound';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SlideOutDrawer } from './components/SlideOutDrawer';
import { TopicPipeline } from './components/TopicPipeline';
import { TestPanel } from './components/TestPanel';
import { QuizActivity } from './components/activities/QuizActivity';
import { CelebrationModal, QuestsBadgesSheet } from './components/GamificationModals';
import { FooterSignature } from './components/FooterSignature';

const STORAGE_KEY = 'maarif-fen-5-progress-v1';

type BaseStationType = Exclude<StationType, 'quiz'>;

function getTodayDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function createInitialProgress(): StudentProgress {
  return {
    hasStarted: false,
    activeUnitId: CURRICULUM[0].id,
    activeTopicId: CURRICULUM[0].topics[0].id,
    completedStations: {},
    completedTests: {},
    xp: 0,
    soundEnabled: true,
    unlockedBadges: [],
    perfectQuizTopics: [],
    dailyDate: getTodayDate(),
    dailyStats: {
      cardsSwiped: 0,
      simsDone: 0,
      quizzesDone: 0,
    },
    claimedQuests: [],
  };
}

function loadProgress(): StudentProgress {
  const fallback = createInitialProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<StudentProgress>;
    const today = getTodayDate();
    const isSameDay = parsed.dailyDate === today;

    const rawStations = parsed.completedStations ?? {};
    const migratedStations: Record<string, StationType[]> = {};
    for (const [tId, list] of Object.entries(rawStations)) {
      if (Array.isArray(list)) {
        // Keep existing learners' progress unlocked if they had already started the topic
        migratedStations[tId] =
          list.includes('sim') && !list.includes('hap') ? ['hap', ...list] : list;
      }
    }

    return {
      ...fallback,
      ...parsed,
      completedStations: migratedStations,
      completedTests: parsed.completedTests ?? {},
      unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : [],
      perfectQuizTopics: Array.isArray(parsed.perfectQuizTopics) ? parsed.perfectQuizTopics : [],
      dailyDate: today,
      dailyStats:
        isSameDay && parsed.dailyStats
          ? {
              cardsSwiped: parsed.dailyStats.cardsSwiped ?? 0,
              simsDone: parsed.dailyStats.simsDone ?? 0,
              quizzesDone: parsed.dailyStats.quizzesDone ?? 0,
            }
          : fallback.dailyStats,
      claimedQuests: isSameDay && Array.isArray(parsed.claimedQuests) ? parsed.claimedQuests : [],
    };
  } catch {
    return fallback;
  }
}

const BASE_STATION_XP: Record<BaseStationType, number> = {
  hap: 25,
  sim: 40,
  cards: 35,
  fill: 35,
};

export default function App() {
  const [progress, setProgress] = useState<StudentProgress>(() => loadProgress());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [questsOpen, setQuestsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'pipeline' | 'test-panel'>('pipeline');
  const [activeStation, setActiveStation] = useState<BaseStationType | null>(null);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [celebrationQueue, setCelebrationQueue] = useState<CelebrationPayload[]>([]);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    soundEngine.setEnabled(progress.soundEnabled);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
  }, [progress]);

  const { unit, topic } = useMemo(
    () => findTopicById(progress.activeTopicId),
    [progress.activeTopicId]
  );

  const theme = UNIT_THEMES[unit.theme];
  const levelInfo = getLevelForXp(progress.xp);

  const allTests = useMemo(() => getAllTests(), []);
  const totalTestsCount = allTests.length;
  const totalQuestionsCount = useMemo(
    () => allTests.reduce((acc, item) => acc + item.test.questions.length, 0),
    [allTests]
  );

  const solvedTestsCount = useMemo(
    () => allTests.filter(({ test }) => progress.completedTests[test.id]?.passed).length,
    [allTests, progress.completedTests]
  );

  // Total required pipeline checkpoints = 8 topics * 8 steps (Hap Bilgiler + 3 activities + 4 required tests)
  const totalStations = useMemo(
    () => CURRICULUM.reduce((acc, u) => acc + u.topics.length * 8, 0),
    []
  );

  const totalCompletedCount = useMemo(() => {
    let count = 0;
    for (const u of CURRICULUM) {
      for (const t of u.topics) {
        const st = progress.completedStations[t.id] ?? [];
        if (st.includes('hap')) count += 1;
        if (st.includes('sim')) count += 1;
        if (st.includes('cards')) count += 1;
        if (st.includes('fill')) count += 1;
        for (const reqTest of getTopicRequiredTests(t)) {
          if (progress.completedTests[reqTest.id]?.passed) {
            count += 1;
          }
        }
      }
    }
    return count;
  }, [progress.completedStations, progress.completedTests]);

  const claimableQuestsCount = useMemo(
    () =>
      DAILY_QUESTS.filter(
        (q) =>
          progress.dailyStats[q.metric] >= q.target &&
          !progress.claimedQuests.includes(q.id)
      ).length,
    [progress.dailyStats, progress.claimedQuests]
  );

  const nextTopic = useMemo(() => {
    const flat = CURRICULUM.flatMap((u) =>
      u.topics.map((t) => ({ unitId: u.id, topicId: t.id, title: t.shortTitle }))
    );
    const idx = flat.findIndex((item) => item.topicId === topic.id);
    if (idx >= 0 && idx + 1 < flat.length) {
      return flat[idx + 1];
    }
    return null;
  }, [topic.id]);

  const buildJourneyCompletionCelebration = (
    finishedTopicId: string,
    stationsMap: Record<string, StationType[]>,
    testsMap: Record<string, { passed: boolean }>,
    xpBonus: number
  ): CelebrationPayload | null => {
    const { unit: currentUnit, topic: finishedTopic } = findTopicById(finishedTopicId);

    const isTopicDone = (tId: string) => {
      const st = stationsMap[tId] ?? [];
      const tData = findTopicById(tId).topic;
      const reqDone = getTopicRequiredTests(tData).every((rt) => testsMap[rt.id]?.passed);
      return (
        st.includes('hap') &&
        st.includes('sim') &&
        st.includes('cards') &&
        st.includes('fill') &&
        reqDone
      );
    };

    if (!isTopicDone(finishedTopicId)) return null;

    // 1. Check if there are still unfinished topics in the same unit
    const currentIdx = currentUnit.topics.findIndex((t) => t.id === finishedTopicId);
    const remainingSameUnit = [
      ...currentUnit.topics.slice(currentIdx + 1),
      ...currentUnit.topics.slice(0, currentIdx),
    ].find((t) => !isTopicDone(t.id));

    if (remainingSameUnit) {
      return {
        type: 'topic-complete',
        title: `${finishedTopic.shortTitle} Tamamlandı!`,
        subtitle: `${currentUnit.number}. ünitedeki bu konunun öğrenme yolunu eksiksiz bitirdin. Haydi diğer konuya geçelim!`,
        xpBonus,
        actionLabel: 'Diğer Konuya Geçelim',
        nextTarget: {
          unitId: currentUnit.id,
          topicId: remainingSameUnit.id,
          label: `${remainingSameUnit.orderLabel} · ${remainingSameUnit.shortTitle}`,
        },
      };
    }

    // 2. Current unit is completely done! Find next unit (prefer sequential next unit if unfinished)
    const unitIdx = CURRICULUM.findIndex((u) => u.id === currentUnit.id);
    const nextIncompleteUnit = [
      ...CURRICULUM.slice(unitIdx + 1),
      ...CURRICULUM.slice(0, unitIdx),
    ].find((u) => u.topics.some((t) => !isTopicDone(t.id)));

    if (nextIncompleteUnit) {
      const firstTopicInNextUnit =
        nextIncompleteUnit.topics.find((t) => !isTopicDone(t.id)) ?? nextIncompleteUnit.topics[0];
      return {
        type: 'unit-complete',
        title: `${currentUnit.number}. Ünite Bitti!`,
        subtitle: `Bu ünitedeki tüm konuların yolculuğunu başarıyla tamamladın. Artık diğer üniteye geçelim!`,
        xpBonus,
        actionLabel: 'Diğer Üniteye Geçelim',
        nextTarget: {
          unitId: nextIncompleteUnit.id,
          topicId: firstTopicInNextUnit.id,
          label: `${nextIncompleteUnit.number}. Ünite · ${nextIncompleteUnit.shortTitle}`,
        },
      };
    }

    // 3. All 7 units completed!
    return {
      type: 'all-complete',
      title: 'Tüm Üniteleri Bitirdin!',
      subtitle:
        `5. Sınıf Fen Bilimleri müfredatındaki ${CURRICULUM.length} ünitenin tüm konularını ve zorunlu testlerini eksiksiz tamamladın!`,
      xpBonus,
    };
  };

  const queueCelebrations = (items: CelebrationPayload[]) => {
    if (items.length === 0) return;
    soundEngine.playLevelUp();
    setCelebrationQueue((prev) => [...prev, ...items]);
  };

  const handleStart = (unitId?: string, topicId?: string) => {
    setProgress((prev) => ({
      ...prev,
      hasStarted: true,
      activeUnitId: unitId ?? prev.activeUnitId,
      activeTopicId: topicId ?? prev.activeTopicId,
    }));
    setViewMode('pipeline');
    setActiveStation(null);
    setActiveTestId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTopic = (unitId: string, topicId: string) => {
    setProgress((prev) => ({
      ...prev,
      hasStarted: true,
      activeUnitId: unitId,
      activeTopicId: topicId,
    }));
    setViewMode('pipeline');
    setActiveStation(null);
    setActiveTestId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTestPanel = () => {
    setViewMode('test-panel');
    setActiveStation(null);
    setActiveTestId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchTestFromPanel = (unitId: string, topicId: string, testId: string) => {
    setProgress((prev) => ({
      ...prev,
      activeUnitId: unitId,
      activeTopicId: topicId,
    }));
    setActiveStation(null);
    setActiveTestId(testId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardSwiped = () => {
    setProgress((prev) => ({
      ...prev,
      dailyStats: {
        ...prev.dailyStats,
        cardsSwiped: prev.dailyStats.cardsSwiped + 1,
      },
    }));
  };

  const handleCompleteStation = (station: BaseStationType) => {
    const newCelebrations: CelebrationPayload[] = [];

    setProgress((prev) => {
      const prevList = prev.completedStations[topic.id] ?? [];
      const alreadyDone = prevList.includes(station);
      const updatedList = alreadyDone ? prevList : [...prevList, station];
      const updatedStationsMap = {
        ...prev.completedStations,
        [topic.id]: updatedList,
      };

      const earnedXp = alreadyDone ? 0 : BASE_STATION_XP[station];
      const prevLevel = getLevelForXp(prev.xp);
      const nextXp = prev.xp + earnedXp;
      const nextLevel = getLevelForXp(nextXp);

      const nextBadges = [...prev.unlockedBadges];
      const tryUnlock = (badgeId: string) => {
        if (nextBadges.includes(badgeId)) return;
        const def = BADGES.find((b) => b.id === badgeId);
        if (!def) return;
        nextBadges.push(badgeId);
        newCelebrations.push({
          type: 'badge',
          title: def.title,
          subtitle: def.description,
          badgeIcon: def.icon,
        });
      };

      if (station === 'sim') tryUnlock('first-lab');
      if (station === 'cards') tryUnlock('card-master');

      if (nextLevel.level > prevLevel.level) {
        newCelebrations.unshift({
          type: 'level-up',
          title: `Seviye ${nextLevel.level}: ${nextLevel.title}`,
          subtitle: 'Bilim yolculuğunda yeni bir rütbeye yükseldin. Harika gidiyorsun!',
          xpBonus: earnedXp,
        });
      }

      const nextDailyStats = {
        ...prev.dailyStats,
        simsDone: prev.dailyStats.simsDone + (station === 'sim' ? 1 : 0),
      };

      return {
        ...prev,
        completedStations: updatedStationsMap,
        xp: nextXp,
        unlockedBadges: nextBadges,
        dailyStats: nextDailyStats,
      };
    });

    if (newCelebrations.length > 0) {
      queueCelebrations(newCelebrations);
    }
  };

  const handleCompleteTest = (
    topicId: string,
    test: TopicTest,
    result: { score: number; total: number; passed: boolean; isPerfect: boolean }
  ) => {
    const newCelebrations: CelebrationPayload[] = [];

    setProgress((prev) => {
      const prevRecord = prev.completedTests[test.id];
      const wasAlreadyPassed = Boolean(prevRecord?.passed);

      // Update best record even if not passed (keeps prior passed status intact)
      const nextRecord = {
        bestScore: Math.max(prevRecord?.bestScore ?? 0, result.score),
        total: result.total,
        passed: wasAlreadyPassed || result.passed,
        isPerfect: Boolean(prevRecord?.isPerfect) || result.isPerfect,
      };

      const updatedTestsMap = {
        ...prev.completedTests,
        [test.id]: nextRecord,
      };

      if (!result.passed) {
        return {
          ...prev,
          completedTests: updatedTestsMap,
        };
      }

      // First time passing this test awards full XP (+15 bonus for 5/5 perfect)
      let earnedXp = wasAlreadyPassed ? 0 : test.xpReward;
      if (!wasAlreadyPassed && result.isPerfect) {
        earnedXp += 15;
      } else if (wasAlreadyPassed && !prevRecord?.isPerfect && result.isPerfect) {
        earnedXp += 15;
      }

      const prevLevel = getLevelForXp(prev.xp);
      const nextXp = prev.xp + earnedXp;
      const nextLevel = getLevelForXp(nextXp);

      const updatedPerfect =
        result.isPerfect && !prev.perfectQuizTopics.includes(test.id)
          ? [...prev.perfectQuizTopics, test.id]
          : prev.perfectQuizTopics;

      // Check if all 4 required tests of this topic are now passed -> mark 'quiz' in completedStations
      const targetTopicData = findTopicById(topicId).topic;
      const reqTests = getTopicRequiredTests(targetTopicData);
      const allReqTestsPassed = reqTests.every((rt) => updatedTestsMap[rt.id]?.passed);

      const prevTopicStations = prev.completedStations[topicId] ?? [];
      const hadQuizStation = prevTopicStations.includes('quiz');
      const nextTopicStations =
        allReqTestsPassed && !hadQuizStation
          ? [...prevTopicStations, 'quiz' as StationType]
          : prevTopicStations;

      const updatedStationsMap = {
        ...prev.completedStations,
        [topicId]: nextTopicStations,
      };

      const nextBadges = [...prev.unlockedBadges];
      const tryUnlock = (badgeId: string) => {
        if (nextBadges.includes(badgeId)) return;
        const def = BADGES.find((b) => b.id === badgeId);
        if (!def) return;
        nextBadges.push(badgeId);
        newCelebrations.push({
          type: 'badge',
          title: def.title,
          subtitle: def.description,
          badgeIcon: def.icon,
        });
      };

      if (result.isPerfect) tryUnlock('perfect-quiz');

      const totalPassedTestsNow = Object.values(updatedTestsMap).filter((r) => r.passed).length;
      if (totalPassedTestsNow >= 10) tryUnlock('test-champion');

      const isTopicCompletelyDone = (tId: string) => {
        const st = updatedStationsMap[tId] ?? [];
        const tData = findTopicById(tId).topic;
        const reqDone = getTopicRequiredTests(tData).every((rt) => updatedTestsMap[rt.id]?.passed);
        return (
          st.includes('hap') &&
          st.includes('sim') &&
          st.includes('cards') &&
          st.includes('fill') &&
          reqDone
        );
      };

      const isUnitDone = (uIdx: number) =>
        Boolean(CURRICULUM[uIdx]) &&
        CURRICULUM[uIdx].topics.every((t) => isTopicCompletelyDone(t.id));

      if (isUnitDone(0)) tryUnlock('unit1-hero');
      if (isUnitDone(1)) tryUnlock('unit2-hero');
      if (isUnitDone(2)) tryUnlock('unit3-hero');
      if (isUnitDone(3)) tryUnlock('unit4-hero');
      if (isUnitDone(4)) tryUnlock('unit5-hero');
      if (isUnitDone(5)) tryUnlock('unit6-hero');
      if (isUnitDone(6)) tryUnlock('unit7-hero');

      if (nextLevel.level > prevLevel.level) {
        newCelebrations.unshift({
          type: 'level-up',
          title: `Seviye ${nextLevel.level}: ${nextLevel.title}`,
          subtitle: 'Bilim yolculuğunda yeni bir rütbeye yükseldin. Harika gidiyorsun!',
          xpBonus: earnedXp,
        });
      }

      if (!hadQuizStation && allReqTestsPassed) {
        const journeyPanel = buildJourneyCompletionCelebration(
          topicId,
          updatedStationsMap,
          updatedTestsMap,
          earnedXp
        );
        if (journeyPanel) {
          newCelebrations.unshift(journeyPanel);
        }
      }

      return {
        ...prev,
        completedStations: updatedStationsMap,
        completedTests: updatedTestsMap,
        xp: nextXp,
        unlockedBadges: nextBadges,
        perfectQuizTopics: updatedPerfect,
        dailyStats: {
          ...prev.dailyStats,
          quizzesDone: prev.dailyStats.quizzesDone + 1,
        },
      };
    });

    if (newCelebrations.length > 0) {
      queueCelebrations(newCelebrations);
    }
  };

  const handleClaimQuest = (questId: string) => {
    const quest = DAILY_QUESTS.find((q) => q.id === questId);
    if (!quest) return;

    const newCelebrations: CelebrationPayload[] = [];
    setProgress((prev) => {
      if (prev.claimedQuests.includes(questId)) return prev;
      if (prev.dailyStats[quest.metric] < quest.target) return prev;

      const prevLevel = getLevelForXp(prev.xp);
      const nextXp = prev.xp + quest.xpReward;
      const nextLevel = getLevelForXp(nextXp);

      if (nextLevel.level > prevLevel.level) {
        newCelebrations.push({
          type: 'level-up',
          title: `Seviye ${nextLevel.level}: ${nextLevel.title}`,
          subtitle: 'Günlük görev ödülünle yeni seviyeye çıktın!',
          xpBonus: quest.xpReward,
        });
      }

      return {
        ...prev,
        xp: nextXp,
        claimedQuests: [...prev.claimedQuests, questId],
      };
    });

    soundEngine.playUnlock();
    if (newCelebrations.length > 0) {
      queueCelebrations(newCelebrations);
    }
  };

  const handleToggleSound = () => {
    setProgress((prev) => {
      const next = !prev.soundEnabled;
      soundEngine.setEnabled(next);
      if (next) soundEngine.playTap();
      return { ...prev, soundEnabled: next };
    });
  };

  const handleResetProgress = () => {
    const fresh = { ...createInitialProgress(), hasStarted: true };
    setProgress(fresh);
    setViewMode('pipeline');
    setActiveStation(null);
    setActiveTestId(null);
    setCelebrationQueue([]);
  };

  // Left-edge swipe gesture to slide open drawer on touch devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (drawerOpen || activeStation || activeTestId) return;
    const touch = e.touches[0];
    if (touch && touch.clientX <= 32) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    } else {
      touchStartRef.current = null;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    if (touch) {
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = Math.abs(touch.clientY - touchStartRef.current.y);
      if (dx > 56 && dy < 52) {
        soundEngine.playTap();
        setDrawerOpen(true);
      }
    }
    touchStartRef.current = null;
  };

  if (!progress.hasStarted) {
    return (
      <WelcomeScreen
        hasProgress={progress.xp > 0 || totalCompletedCount > 0 || solvedTestsCount > 0}
        xp={progress.xp}
        completedCount={totalCompletedCount}
        totalStations={totalStations}
        onStart={handleStart}
      />
    );
  }

  // Focused test launched from Test Panel
  const panelActiveTestEntry =
    viewMode === 'test-panel' && activeTestId ? findTestById(activeTestId) : null;

  const panelNextTest = (() => {
    if (!panelActiveTestEntry) return null;
    const { topic: tData, test } = panelActiveTestEntry;
    const list = test.isExtra ? getTopicExtraTests(tData) : getTopicRequiredTests(tData);
    const idx = list.findIndex((item) => item.id === test.id);
    if (idx >= 0 && idx + 1 < list.length) {
      return list[idx + 1];
    }
    return null;
  })();

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`flex min-h-dvh flex-col transition-colors duration-300 ${theme.pageBg}`}
    >
      {/* Compact Sticky Top Bar (56px height, mobile-first touch targets >=44px) */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-300 ${theme.headerBg}`}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              aria-label="Ünite ve konu menüsünü aç"
              onClick={() => {
                soundEngine.playTap();
                setDrawerOpen(true);
              }}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-transform active:scale-95 ${theme.surfaceSubtle}`}
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                if (viewMode === 'test-panel') {
                  setViewMode('pipeline');
                  setActiveTestId(null);
                } else {
                  setDrawerOpen(true);
                }
              }}
              className="min-w-0 text-left"
            >
              <div className={`truncate text-[11px] font-bold ${theme.primaryText}`}>
                {viewMode === 'test-panel'
                  ? `Tüm Üniteler · ${totalQuestionsCount} Soru`
                  : `${unit.number}. Ünite · ${topic.orderLabel}`}
              </div>
              <div className={`truncate font-display text-sm font-extrabold leading-tight ${theme.textPrimary}`}>
                {viewMode === 'test-panel' ? 'Test Paneli' : topic.shortTitle}
              </div>
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {/* Test Panel Toggle Button */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                if (viewMode === 'test-panel' && !activeTestId) {
                  setViewMode('pipeline');
                } else {
                  handleOpenTestPanel();
                }
              }}
              aria-label="Test panelini aç"
              className={`min-h-[44px] rounded-xl border px-2.5 py-1.5 text-xs font-extrabold tabular-nums transition-transform active:scale-95 flex items-center gap-1.5 sm:px-3 ${
                viewMode === 'test-panel'
                  ? `${theme.primaryBtn} border-transparent`
                  : theme.surfaceSubtle
              }`}
            >
              <ClipboardCheck
                className={`h-4 w-4 shrink-0 ${
                  viewMode === 'test-panel' ? '' : 'text-emerald-500'
                }`}
              />
              <span className="whitespace-nowrap">
                <span className="hidden sm:inline">Testler </span>
                {solvedTestsCount}/{totalTestsCount}
              </span>
            </button>

            {/* Daily Quests & XP Button */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setQuestsOpen(true);
              }}
              aria-label="Günlük görevler ve rozetler"
              className={`relative min-h-[44px] rounded-xl border px-2.5 py-1.5 text-xs font-extrabold tabular-nums transition-transform active:scale-95 flex items-center gap-1.5 sm:px-3 ${theme.surfaceSubtle}`}
            >
              <Trophy className="h-4 w-4 shrink-0 text-amber-500" />
              <span className="whitespace-nowrap">
                <span className="hidden sm:inline">Sv.{levelInfo.level} · </span>
                {progress.xp} XP
              </span>
              {claimableQuestsCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-extrabold text-slate-950">
                  {claimableQuestsCount}
                </span>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              aria-label={progress.soundEnabled ? 'Sesleri kapat' : 'Sesleri aç'}
              onClick={handleToggleSound}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-transform active:scale-95 ${theme.surfaceSubtle}`}
            >
              {progress.soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4 opacity-60" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {viewMode === 'test-panel' ? (
          panelActiveTestEntry ? (
            <div className="mx-auto w-full max-w-3xl px-4 pb-10 pt-3 sm:px-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setActiveTestId(null);
                  }}
                  className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-xs font-bold active:scale-95 flex items-center gap-1.5 ${theme.surface}`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="whitespace-nowrap">Test Paneline Dön</span>
                </button>

                <div className="text-right min-w-0">
                  <div className={`truncate text-xs font-bold ${theme.primaryText}`}>
                    {panelActiveTestEntry.unit.number}. Ünite · {panelActiveTestEntry.topic.orderLabel}
                  </div>
                  <div className={`truncate text-xs font-semibold ${theme.textSecondary}`}>
                    {panelActiveTestEntry.topic.shortTitle}
                  </div>
                </div>
              </div>

              <QuizActivity
                key={panelActiveTestEntry.test.id}
                testTitle={panelActiveTestEntry.test.title}
                testSubtitle={panelActiveTestEntry.test.subtitle}
                isExtra={panelActiveTestEntry.test.isExtra}
                xpReward={panelActiveTestEntry.test.xpReward}
                questions={panelActiveTestEntry.test.questions}
                themeId={panelActiveTestEntry.unit.theme}
                isCompleted={Boolean(progress.completedTests[panelActiveTestEntry.test.id]?.passed)}
                hasNextTest={Boolean(panelNextTest)}
                nextTestLabel={
                  panelNextTest
                    ? panelNextTest.isExtra
                      ? `Sıradaki: Ekstra Test ${panelNextTest.order}`
                      : `Sıradaki: Test ${panelNextTest.order}`
                    : undefined
                }
                returnLabel="Test Paneline Dön"
                onComplete={(res) =>
                  handleCompleteTest(
                    panelActiveTestEntry.topic.id,
                    panelActiveTestEntry.test,
                    res
                  )
                }
                onNextTest={
                  panelNextTest
                    ? () => setActiveTestId(panelNextTest.id)
                    : undefined
                }
                onExit={() => setActiveTestId(null)}
              />
            </div>
          ) : (
            <TestPanel
              progress={progress}
              themeId={unit.theme}
              onLaunchTest={handleLaunchTestFromPanel}
              onGoToTopic={handleSelectTopic}
              onClose={() => setViewMode('pipeline')}
            />
          )
        ) : (
          <TopicPipeline
            unit={unit}
            topic={topic}
            completedStations={progress.completedStations[topic.id] ?? []}
            completedTests={progress.completedTests}
            activeStation={activeStation}
            activeTestId={activeTestId}
            onOpenStation={setActiveStation}
            onOpenTest={setActiveTestId}
            onCompleteStation={handleCompleteStation}
            onCompleteTest={handleCompleteTest}
            onCardSwiped={handleCardSwiped}
            nextTopic={nextTopic}
            onSelectTopic={handleSelectTopic}
            onOpenTestPanel={handleOpenTestPanel}
          />
        )}
      </main>

      {/* Subtle Italic Footer Signature & Feedback Mail Modal */}
      <FooterSignature themeId={unit.theme} />

      {/* Left Slide-Out Drawer (Units, Topics, Test Panel, Quests, Badges, Settings) */}
      <SlideOutDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        progress={progress}
        themeId={unit.theme}
        solvedTestsCount={solvedTestsCount}
        totalTestsCount={totalTestsCount}
        onSelectTopic={handleSelectTopic}
        onOpenTestPanel={handleOpenTestPanel}
        onToggleSound={handleToggleSound}
        onClaimQuest={handleClaimQuest}
        onResetProgress={handleResetProgress}
        onGoWelcome={() =>
          setProgress((prev) => ({ ...prev, hasStarted: false }))
        }
      />

      {/* Daily Quests & Badges Quick Sheet */}
      <QuestsBadgesSheet
        open={questsOpen}
        onClose={() => setQuestsOpen(false)}
        progress={progress}
        themeId={unit.theme}
        onClaimQuest={handleClaimQuest}
      />

      {/* Confetti Celebration Modal (Level-Up / Badge / Huge Topic & Unit Transition Panel) */}
      <CelebrationModal
        celebration={celebrationQueue[0] ?? null}
        themeId={unit.theme}
        onClose={() => setCelebrationQueue((prev) => prev.slice(1))}
        onNavigateTarget={(nextUnitId, nextTopicId) => {
          setCelebrationQueue([]);
          handleSelectTopic(nextUnitId, nextTopicId);
        }}
        onOpenTestPanel={() => {
          setCelebrationQueue([]);
          handleOpenTestPanel();
        }}
      />
    </div>
  );
}
