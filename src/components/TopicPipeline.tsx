import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  Layers,
  Lightbulb,
  Lock,
  PenTool,
  Play,
  Sparkles,
  Star,
} from 'lucide-react';
import { getAllTests, getTopicExtraTests, getTopicRequiredTests } from '../data/curriculum';
import { StationType, TestRecord, TopicData, TopicTest, UnitData } from '../types';
import { UNIT_THEMES } from '../utils/theme';
import { soundEngine } from '../utils/sound';
import { SafeImage } from './SafeImage';
import { SimulationStage } from './simulations/SimulationStage';
import { HapBilgilerActivity } from './activities/HapBilgilerActivity';
import { SwipeFlashcards } from './activities/SwipeFlashcards';
import { FillBlanksActivity } from './activities/FillBlanksActivity';
import { QuizActivity } from './activities/QuizActivity';

type BaseStationType = Exclude<StationType, 'quiz'>;

interface TopicPipelineProps {
  unit: UnitData;
  topic: TopicData;
  completedStations: StationType[];
  completedTests: Record<string, TestRecord>;
  activeStation: BaseStationType | null;
  activeTestId: string | null;
  onOpenStation: (station: BaseStationType | null) => void;
  onOpenTest: (testId: string | null) => void;
  onCompleteStation: (station: BaseStationType) => void;
  onCompleteTest: (
    topicId: string,
    test: TopicTest,
    result: { score: number; total: number; passed: boolean; isPerfect: boolean }
  ) => void;
  onCardSwiped: () => void;
  nextTopic: { unitId: string; topicId: string; title: string } | null;
  onSelectTopic: (unitId: string, topicId: string) => void;
  onOpenTestPanel: () => void;
}

const BASE_STATIONS: {
  id: BaseStationType;
  step: number;
  title: string;
  subtitle: string;
  xp: number;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    id: 'hap',
    step: 1,
    title: 'Kitaptan Hap Bilgiler & Özet',
    subtitle: 'MEB kitabındaki kritik hap bilgileri ve altın özetleri oku, sonra etkinliklere geç!',
    xp: 25,
    icon: Lightbulb,
  },
  {
    id: 'sim',
    step: 2,
    title: 'İnteraktif Keşif',
    subtitle: 'Dokunarak modeli hareket ettir ve gözlem yap',
    xp: 40,
    icon: FlaskConical,
  },
  {
    id: 'cards',
    step: 3,
    title: 'Bilgi Kartları (Kaydır & Çevir)',
    subtitle: 'Biliyorsan sağa, bilmiyorsan sola kaydırıp özeti oku',
    xp: 35,
    icon: Layers,
  },
  {
    id: 'fill',
    step: 4,
    title: 'Boşluk Doldurma',
    subtitle: 'Doğru fen kavramlarını cümlelere yerleştir',
    xp: 35,
    icon: PenTool,
  },
];

export const TopicPipeline: React.FC<TopicPipelineProps> = ({
  unit,
  topic,
  completedStations,
  completedTests,
  activeStation,
  activeTestId,
  onOpenStation,
  onOpenTest,
  onCompleteStation,
  onCompleteTest,
  onCardSwiped,
  nextTopic,
  onSelectTopic,
  onOpenTestPanel,
}) => {
  const theme = UNIT_THEMES[unit.theme];

  const requiredTests = useMemo(() => getTopicRequiredTests(topic), [topic]);
  const extraTests = useMemo(() => getTopicExtraTests(topic), [topic]);
  const totalAllTestsCount = useMemo(() => getAllTests().length, []);

  const isBaseDone = (st: BaseStationType) => completedStations.includes(st);
  const isBaseUnlocked = (index: number) => {
    if (index === 0) return true;
    return completedStations.includes(BASE_STATIONS[index - 1].id);
  };

  const allBaseDone = BASE_STATIONS.every((s) => isBaseDone(s.id));

  const isReqTestDone = (testId: string) => Boolean(completedTests[testId]?.passed);
  const isReqTestUnlocked = (reqIdx: number) => {
    if (!allBaseDone) return false;
    if (reqIdx === 0) return true;
    return isReqTestDone(requiredTests[reqIdx - 1].id);
  };

  const baseDoneCount = BASE_STATIONS.filter((s) => isBaseDone(s.id)).length;
  const reqTestsDoneCount = requiredTests.filter((t) => isReqTestDone(t.id)).length;
  const extraTestsDoneCount = extraTests.filter((t) => isReqTestDone(t.id)).length;
  const totalSteps = BASE_STATIONS.length + requiredTests.length; // 4 + 4 = 8
  const completedSteps = baseDoneCount + reqTestsDoneCount;
  const allTopicDone = completedSteps >= totalSteps;

  // Focused Test Runner inside Topic Pipeline
  if (activeTestId) {
    const activeTest = topic.tests.find((t) => t.id === activeTestId);
    if (activeTest) {
      const sameGroup = activeTest.isExtra ? extraTests : requiredTests;
      const curIdx = sameGroup.findIndex((t) => t.id === activeTest.id);
      const nextTest = curIdx >= 0 && curIdx + 1 < sameGroup.length ? sameGroup[curIdx + 1] : null;
      const stepLabel = activeTest.isExtra
        ? `Ekstra Test ${activeTest.order} · ${topic.orderLabel}`
        : `Adım ${4 + activeTest.order} / ${totalSteps} · Test ${activeTest.order}/4`;

      return (
        <motion.div
          key={`${topic.id}-${activeTest.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="mx-auto w-full max-w-3xl px-4 pb-10 pt-3 sm:px-6 space-y-4"
        >
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                onOpenTest(null);
              }}
              className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-xs font-bold active:scale-95 flex items-center gap-1.5 ${theme.surface}`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="whitespace-nowrap">Konu Hattına Dön</span>
            </button>

            <div className="text-right min-w-0">
              <div className={`truncate text-xs font-bold ${theme.primaryText}`}>{stepLabel}</div>
              <div className={`truncate text-xs font-semibold ${theme.textSecondary}`}>
                {topic.shortTitle}
              </div>
            </div>
          </div>

          <QuizActivity
            key={activeTest.id}
            testTitle={activeTest.title}
            testSubtitle={activeTest.subtitle}
            isExtra={activeTest.isExtra}
            xpReward={activeTest.xpReward}
            questions={activeTest.questions}
            themeId={unit.theme}
            isCompleted={isReqTestDone(activeTest.id)}
            hasNextTest={Boolean(nextTest)}
            nextTestLabel={
              nextTest
                ? nextTest.isExtra
                  ? `Sıradaki: Ekstra Test ${nextTest.order}`
                  : `Sıradaki: Test ${nextTest.order}`
                : undefined
            }
            returnLabel="Konu Hattına Dön"
            onComplete={(res) => onCompleteTest(topic.id, activeTest, res)}
            onNextTest={nextTest ? () => onOpenTest(nextTest.id) : undefined}
            onExit={() => onOpenTest(null)}
          />
        </motion.div>
      );
    }
  }

  // Focused Base Station Runner (Sim / Flashcards / Fill Blanks)
  if (activeStation) {
    const activeMeta = BASE_STATIONS.find((s) => s.id === activeStation)!;
    return (
      <motion.div
        key={`${topic.id}-${activeStation}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="mx-auto w-full max-w-3xl px-4 pb-10 pt-3 sm:px-6 space-y-4"
      >
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              onOpenStation(null);
            }}
            className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-xs font-bold active:scale-95 flex items-center gap-1.5 ${theme.surface}`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="whitespace-nowrap">Konu Hattına Dön</span>
          </button>

          <div className="text-right min-w-0">
            <div className={`truncate text-xs font-bold ${theme.primaryText}`}>
              Adım {activeMeta.step} / {totalSteps} · {topic.orderLabel}
            </div>
            <div className={`truncate text-xs font-semibold ${theme.textSecondary}`}>
              {activeStation === 'sim' ? topic.simTitle : activeMeta.title}
            </div>
          </div>
        </div>

        {activeStation === 'hap' && (
          <HapBilgilerActivity
            key={topic.id}
            topic={topic}
            themeId={unit.theme}
            isCompleted={isBaseDone('hap')}
            onComplete={() => {
              onCompleteStation('hap');
              onOpenStation(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeStation === 'sim' && (
          <div className="space-y-3">
            <div className={`rounded-2xl border p-4 ${theme.surface}`}>
              <h2 className={`font-display text-lg font-extrabold ${theme.textPrimary}`}>
                {topic.simTitle}
              </h2>
              <p className={`mt-0.5 text-xs leading-relaxed ${theme.textSecondary}`}>
                {topic.simSubtitle}
              </p>
            </div>
            <SimulationStage
              simType={topic.simType}
              isCompleted={isBaseDone('sim')}
              onComplete={() => {
                onCompleteStation('sim');
                onOpenStation(null);
              }}
            />
          </div>
        )}

        {activeStation === 'cards' && (
          <SwipeFlashcards
            key={topic.id}
            cards={topic.flashcards}
            themeId={unit.theme}
            isCompleted={isBaseDone('cards')}
            onCardSwiped={onCardSwiped}
            onComplete={() => {
              onCompleteStation('cards');
              onOpenStation(null);
            }}
          />
        )}

        {activeStation === 'fill' && (
          <FillBlanksActivity
            key={topic.id}
            items={topic.fillBlanks}
            themeId={unit.theme}
            isCompleted={isBaseDone('fill')}
            onComplete={() => {
              onCompleteStation('fill');
              onOpenStation(null);
            }}
          />
        )}
      </motion.div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-12 pt-4 sm:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* LEFT / TOP: Topic Hero Photo + MEB Hap Bilgiler + Secondary Visual */}
        <div className="space-y-4 lg:col-span-5 lg:sticky lg:top-20">
          {/* Topic Visual Hero Card */}
          <div className={`overflow-hidden rounded-3xl border shadow-md ${theme.surface}`}>
            <div className="relative">
              <SafeImage
                src={topic.heroImage}
                alt={topic.imageAlt}
                theme={unit.theme}
                fallbackLabel={topic.title}
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  {unit.number}. Ünite · Konu {topic.orderLabel}
                </div>
                <h1 className="mt-0.5 font-display text-xl font-extrabold leading-tight sm:text-2xl">
                  {topic.title}
                </h1>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>
                {topic.tagline}
              </p>

              {/* Progress summary bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={theme.textMuted}>
                    Konu İlerlemesi ({reqTestsDoneCount}/4 Test)
                  </span>
                  <span className={`tabular-nums font-bold ${theme.primaryText}`}>
                    {completedSteps} / {totalSteps} Adım
                  </span>
                </div>
                <div className={`h-2 w-full overflow-hidden rounded-full ${theme.isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${theme.lineDoneColor}`}
                    style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Prominent Fluorescent MEB Hap Bilgiler Spotlight Card */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              onOpenStation('hap');
            }}
            className={`group relative w-full overflow-hidden rounded-3xl border border-lime-400/75 bg-lime-400/10 p-4 sm:p-5 text-left transition-all active:scale-[0.985] hap-card-glow ${theme.surface}`}
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-lime-300 text-slate-950 hap-icon-glow">
                <Lightbulb className="h-8 w-8 stroke-[2.3]" />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider">
                  <span className="text-lime-300">1. Adım · Önce Burayı Oku</span>
                  {isBaseDone('hap') && (
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      · Okundu ✓
                    </span>
                  )}
                </div>
                <div className="font-display text-lg font-extrabold leading-tight text-lime-200 sm:text-xl">
                  Kitaptan Hap Bilgiler
                </div>
                <div className="text-xs font-semibold text-lime-100/85">
                  {topic.hapBilgiler.length} Bilgi İstasyonu · {topic.keyNotes.length} Altın Özet
                </div>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-300 text-slate-950 transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-5 w-5 stroke-[2.5]" />
              </div>
            </div>
          </button>

          {/* Secondary Contextual Topic Photo Card (Desktop) */}
          <div className={`hidden overflow-hidden rounded-2xl border lg:block ${theme.surface}`}>
            <div className="grid grid-cols-12 items-center">
              <div className="col-span-5">
                <SafeImage
                  src={topic.secondaryImage}
                  alt={topic.simTitle}
                  theme={unit.theme}
                  className="h-28 w-full object-cover"
                />
              </div>
              <div className="col-span-7 p-3.5 space-y-1">
                <div className={`text-[11px] font-bold uppercase tracking-wider ${theme.accentText}`}>
                  Tam Öğrenme Yolu
                </div>
                <p className={`text-xs leading-relaxed ${theme.textSecondary}`}>
                  Hap Bilgileri oku, 3 etkileşimli etkinliği ve 4 zorunlu testi sırayla bitir!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT / BOTTOM: Vertical Flowing 8-Step Sequential Pipeline + Extra Tests Section */}
        <div className="space-y-6 lg:col-span-7">
          {/* MAIN 8-STEP PIPELINE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className={`font-display text-lg font-extrabold ${theme.textPrimary}`}>
                Öğrenme Yolu
              </h2>
              <span className={`text-xs font-semibold tabular-nums ${theme.textMuted}`}>
                4 Adım + 4 Zorunlu Test
              </span>
            </div>

            <div className="relative pl-6 sm:pl-8">
              {/* Vertical Connecting Spine */}
              <div
                aria-hidden="true"
                className={`absolute left-[19px] top-6 bottom-6 w-1 rounded-full sm:left-[23px] ${theme.lineColor}`}
              />

              <div className="space-y-3.5">
                {/* Steps 1..4: Hap Bilgiler + Base Interactive Stations */}
                {BASE_STATIONS.map((station, idx) => {
                  const done = isBaseDone(station.id);
                  const unlocked = isBaseUnlocked(idx);
                  const isNextActive = unlocked && !done;
                  const isHap = station.id === 'hap';
                  const Icon = station.icon;
                  const labelTitle =
                    station.id === 'sim' ? `${station.title}: ${topic.simTitle}` : station.title;
                  const labelSub =
                    station.id === 'sim'
                      ? topic.simSubtitle
                      : isHap
                      ? `${topic.hapBilgiler.length} Bilgi İstasyonu + ${topic.keyNotes.length} Altın Özet · Önce oku, sonra soruları çöz!`
                      : station.subtitle;

                  return (
                    <div key={station.id} className="relative">
                      <div
                        className={`absolute -left-6 top-5 flex items-center justify-center rounded-full border-2 font-display text-sm font-extrabold shadow-sm transition-all sm:-left-8 ${
                          isHap
                            ? done
                              ? 'h-11 w-11 border-emerald-400 bg-emerald-500 text-white sm:h-12 sm:w-12'
                              : 'h-11 w-11 border-lime-200 bg-lime-300 text-slate-950 hap-icon-glow sm:h-12 sm:w-12'
                            : done
                            ? 'h-10 w-10 border-emerald-500 bg-emerald-500 text-white sm:h-11 sm:w-11'
                            : isNextActive
                            ? `h-10 w-10 ${theme.primaryBtn} border-transparent ring-4 ${theme.ringColor} sm:h-11 sm:w-11`
                            : `h-10 w-10 ${theme.surfaceSubtle} ${theme.textMuted} sm:h-11 sm:w-11`
                        }`}
                      >
                        {done ? (
                          <Check className="h-5 w-5" />
                        ) : unlocked ? (
                          <Icon className={isHap ? 'h-6 w-6 stroke-[2.4]' : 'h-5 w-5'} />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={!unlocked}
                        onClick={() => {
                          if (!unlocked) return;
                          soundEngine.playTap();
                          onOpenStation(station.id);
                        }}
                        className={`ml-7 w-[calc(100%-1.75rem)] rounded-2xl border p-4 text-left transition-all sm:ml-8 sm:w-[calc(100%-2rem)] ${
                          isHap
                            ? done
                              ? `${theme.surface} border-lime-400/45 bg-lime-400/5 active:scale-[0.99]`
                              : `${theme.surface} border-lime-400/75 bg-lime-400/10 hap-card-glow active:scale-[0.99]`
                            : isNextActive
                            ? `${theme.surface} ring-2 ${theme.ringColor} shadow-md active:scale-[0.99]`
                            : done
                            ? `${theme.surface} active:scale-[0.99]`
                            : `${theme.surfaceSubtle} opacity-65 cursor-not-allowed`
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                              <span
                                className={
                                  done
                                    ? 'text-emerald-400'
                                    : isHap
                                    ? 'text-lime-300'
                                    : unlocked
                                    ? theme.primaryText
                                    : theme.textMuted
                                }
                              >
                                {station.step}. Adım{isHap ? ' · Başlangıç' : ''}
                              </span>
                              <span className={theme.textMuted}>·</span>
                              <span className={`tabular-nums ${isHap && !done ? 'text-lime-200' : theme.textMuted}`}>
                                {done ? 'Tamamlandı ✓' : unlocked ? `+${station.xp} XP` : 'Kilitli'}
                              </span>
                            </div>

                            <h3
                              className={`font-display font-extrabold leading-snug ${
                                isHap
                                  ? 'text-lg sm:text-xl text-lime-200'
                                  : `text-base ${theme.textPrimary}`
                              }`}
                            >
                              {labelTitle}
                            </h3>

                            <p
                              className={`leading-relaxed ${
                                isHap
                                  ? 'text-xs sm:text-sm text-lime-100/85'
                                  : `text-xs ${theme.textSecondary}`
                              }`}
                            >
                              {unlocked ? labelSub : 'Önce bir önceki adımı tamamlamalısın.'}
                            </p>
                          </div>

                          {unlocked && (
                            <div
                              className={`mt-1 flex shrink-0 items-center justify-center rounded-xl ${
                                isHap && !done
                                  ? 'h-12 w-12 bg-lime-300 text-slate-950 hap-icon-glow'
                                  : isNextActive
                                  ? `h-10 w-10 ${theme.primaryBtn}`
                                  : done
                                  ? 'h-10 w-10 bg-emerald-500/15 text-emerald-300'
                                  : `h-10 w-10 ${theme.surfaceSubtle}`
                              }`}
                            >
                              {isHap && !done ? (
                                <Lightbulb className="h-6 w-6 stroke-[2.3]" />
                              ) : (
                                <Play className="h-4 w-4 fill-current" />
                              )}
                            </div>
                          )}
                        </div>

                        {isNextActive && (
                          <div
                            className={`mt-3 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-extrabold ${
                              isHap
                                ? 'bg-lime-300 text-slate-950'
                                : theme.primaryBtn
                            }`}
                          >
                            <span>{isHap ? 'Hap Bilgileri Oku' : 'Etkinliğe Başla'}</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}

                {/* Steps 5..8: 4 Sequential Required Tests */}
                {requiredTests.map((test, reqIdx) => {
                  const stepNum = 5 + reqIdx;
                  const record = completedTests[test.id];
                  const done = Boolean(record?.passed);
                  const unlocked = isReqTestUnlocked(reqIdx);
                  const isNextActive = unlocked && !done;

                  return (
                    <div key={test.id} className="relative">
                      <div
                        className={`absolute -left-6 top-5 flex h-10 w-10 items-center justify-center rounded-full border-2 font-display text-sm font-extrabold shadow-sm transition-all sm:-left-8 sm:h-11 sm:w-11 ${
                          done
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : isNextActive
                            ? `${theme.primaryBtn} border-transparent ring-4 ${theme.ringColor}`
                            : `${theme.surfaceSubtle} ${theme.textMuted}`
                        }`}
                      >
                        {done ? (
                          <Check className="h-5 w-5" />
                        ) : unlocked ? (
                          <ClipboardCheck className="h-5 w-5" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={!unlocked}
                        onClick={() => {
                          if (!unlocked) return;
                          soundEngine.playTap();
                          onOpenTest(test.id);
                        }}
                        className={`ml-7 w-[calc(100%-1.75rem)] rounded-2xl border p-4 text-left transition-all sm:ml-8 sm:w-[calc(100%-2rem)] ${
                          isNextActive
                            ? `${theme.surface} ring-2 ${theme.ringColor} shadow-md active:scale-[0.99]`
                            : done
                            ? `${theme.surface} active:scale-[0.99]`
                            : `${theme.surfaceSubtle} opacity-65 cursor-not-allowed`
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                              <span
                                className={
                                  done
                                    ? 'text-emerald-500'
                                    : unlocked
                                    ? theme.primaryText
                                    : theme.textMuted
                                }
                              >
                                {stepNum}. Adım · Zorunlu Test {test.order}/4
                              </span>
                              <span className={theme.textMuted}>·</span>
                              {done && record ? (
                                <span className="inline-flex items-center gap-1 tabular-nums text-emerald-500">
                                  <span>
                                    Çözüldü ({record.bestScore}/{record.total})
                                  </span>
                                  {record.isPerfect && (
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                  )}
                                </span>
                              ) : (
                                <span className={`tabular-nums ${theme.textMuted}`}>
                                  {unlocked
                                    ? `${test.questions.length} Soru · +${test.xpReward} XP`
                                    : 'Kilitli'}
                                </span>
                              )}
                            </div>

                            <h3 className={`font-display text-base font-extrabold leading-snug ${theme.textPrimary}`}>
                              {test.title}
                            </h3>

                            <p className={`text-xs leading-relaxed ${theme.textSecondary}`}>
                              {unlocked
                                ? test.subtitle
                                : reqIdx === 0
                                ? 'Önce ilk 4 adımı (Hap Bilgiler, Keşif, Kartlar, Boşluk Doldurma) tamamlamalısın.'
                                : `Önce Test ${test.order - 1}’i en az 3 doğruyla geçmelisin.`}
                            </p>
                          </div>

                          {unlocked && (
                            <div
                              className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                isNextActive
                                  ? theme.primaryBtn
                                  : done
                                  ? theme.isDark
                                    ? 'bg-emerald-500/15 text-emerald-300'
                                    : 'bg-emerald-50 text-emerald-700'
                                  : theme.surfaceSubtle
                              }`}
                            >
                              <Play className="h-4 w-4 fill-current" />
                            </div>
                          )}
                        </div>

                        {isNextActive && (
                          <div
                            className={`mt-3 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold ${theme.primaryBtn}`}
                          >
                            <span>Teste Başla</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DEDICATED EXTRA TESTS SECTION */}
          <section className={`rounded-3xl border p-4 sm:p-5 space-y-3.5 ${theme.surface}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-500">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className={`font-display text-base font-extrabold ${theme.textPrimary}`}>
                    Ekstra Testler · İleri Pekiştirme
                  </h2>
                  <p className={`text-xs ${theme.textSecondary}`}>
                    Daha fazla pratik yapmak ister misin? Ekstra testler her zaman açık!
                  </p>
                </div>
              </div>

              <span className={`text-xs font-bold tabular-nums ${theme.primaryText}`}>
                {extraTestsDoneCount} / {extraTests.length} Çözüldü
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {extraTests.map((test) => {
                const record = completedTests[test.id];
                const solved = Boolean(record?.passed);

                return (
                  <button
                    key={test.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playTap();
                      onOpenTest(test.id);
                    }}
                    className={`rounded-2xl border p-3.5 text-left transition-all active:scale-[0.98] flex flex-col justify-between gap-3 ${
                      solved
                        ? theme.isDark
                          ? 'border-emerald-500/40 bg-emerald-500/10'
                          : 'border-emerald-300 bg-emerald-50/70'
                        : theme.surfaceSubtle
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2 text-xs font-bold">
                        <span className={solved ? 'text-emerald-500' : theme.accentText}>
                          {test.title}
                        </span>
                        {solved ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <span className={`tabular-nums text-[11px] ${theme.textMuted}`}>
                            +{test.xpReward} XP
                          </span>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed ${theme.textSecondary}`}>
                        {test.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={`tabular-nums ${solved ? 'text-emerald-500' : theme.textMuted}`}>
                        {solved && record
                          ? `En iyi: ${record.bestScore}/${record.total} Doğru`
                          : `${test.questions.length} Soru · Açık`}
                      </span>
                      <span className={`inline-flex items-center gap-1 ${theme.primaryText}`}>
                        <span>{solved ? 'Tekrar Çöz' : 'Çözmeye Başla'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                onOpenTestPanel();
              }}
              className={`min-h-[44px] w-full rounded-xl border px-4 py-2.5 text-xs font-extrabold active:scale-[0.99] flex items-center justify-center gap-2 ${theme.surfaceSubtle}`}
            >
              <ClipboardCheck className={`h-4 w-4 ${theme.primaryText}`} />
              <span>Tüm Ünitelerin Test Panelini Aç ({totalAllTestsCount} Test)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </section>

          {/* Mobile Secondary Visual Context Card */}
          <div className={`overflow-hidden rounded-2xl border lg:hidden ${theme.surface}`}>
            <div className="flex items-center gap-3 p-3">
              <SafeImage
                src={topic.secondaryImage}
                alt={topic.simTitle}
                theme={unit.theme}
                className="h-16 w-20 shrink-0 rounded-xl object-cover"
              />
              <p className={`text-xs leading-relaxed ${theme.textSecondary}`}>
                Soldaki menüden istediğin üniteye geçebilir, üstteki Test Panelinden tüm çözdüğün testleri tikleriyle takip edebilirsin.
              </p>
            </div>
          </div>

          {/* Next Topic / Unit Card when all 8 steps are complete */}
          {allTopicDone && nextTopic && (
            <div
              className={`rounded-2xl border p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${
                theme.isDark
                  ? 'border-emerald-500/40 bg-emerald-500/15'
                  : 'border-emerald-300 bg-emerald-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-400">
                    {nextTopic.unitId !== unit.id
                      ? 'Bu Ünitedeki Yolculuğu Tamamladın!'
                      : 'Bu Konunun Yolculuğunu Eksiksiz Tamamladın!'}
                  </div>
                  <div className={`font-display text-sm font-extrabold ${theme.textPrimary}`}>
                    {nextTopic.unitId !== unit.id
                      ? `Diğer Üniteye Geçelim: ${nextTopic.title}`
                      : `Diğer Konuya Geçelim: ${nextTopic.title}`}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playUnlock();
                  onSelectTopic(nextTopic.unitId, nextTopic.topicId);
                }}
                className={`min-h-[46px] shrink-0 rounded-xl px-4 py-2.5 text-xs font-extrabold active:scale-95 flex items-center justify-center gap-1.5 ${theme.primaryBtn}`}
              >
                <span className="whitespace-nowrap">
                  {nextTopic.unitId !== unit.id ? 'Diğer Üniteye Geçelim' : 'Diğer Konuya Geçelim'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
