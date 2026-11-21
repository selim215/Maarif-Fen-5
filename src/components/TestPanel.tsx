import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Compass,
  Flame,
  Lock,
  Microscope,
  Orbit,
  Play,
  Recycle,
  Sparkles,
  Star,
  Sun,
  Zap,
} from 'lucide-react';
import { CURRICULUM, getAllTests, getTopicExtraTests, getTopicRequiredTests } from '../data/curriculum';
import { StudentProgress, TopicData, TopicTest, UnitThemeId } from '../types';
import { UNIT_THEMES } from '../utils/theme';
import { soundEngine } from '../utils/sound';

interface TestPanelProps {
  progress: StudentProgress;
  themeId: UnitThemeId;
  onLaunchTest: (unitId: string, topicId: string, testId: string) => void;
  onGoToTopic: (unitId: string, topicId: string) => void;
  onClose: () => void;
}

type StatusFilter = 'all' | 'solved' | 'unsolved' | 'required' | 'extra';

export function isTopicTestUnlocked(
  topic: TopicData,
  test: TopicTest,
  progress: StudentProgress
): boolean {
  // Extra tests are always unlocked so students who want additional practice can jump in anytime
  if (test.isExtra) return true;

  const doneStations = progress.completedStations[topic.id] ?? [];
  const baseDone =
    doneStations.includes('hap') &&
    doneStations.includes('sim') &&
    doneStations.includes('cards') &&
    doneStations.includes('fill');

  if (!baseDone) return false;

  const reqTests = getTopicRequiredTests(topic);
  const idx = reqTests.findIndex((t) => t.id === test.id);
  if (idx <= 0) return true;

  const prevTest = reqTests[idx - 1];
  return Boolean(progress.completedTests[prevTest.id]?.passed);
}

export const TestPanel: React.FC<TestPanelProps> = ({
  progress,
  themeId,
  onLaunchTest,
  onGoToTopic,
  onClose,
}) => {
  const theme = UNIT_THEMES[themeId];
  const [unitFilter, setUnitFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const allTests = useMemo(() => getAllTests(), []);

  const stats = useMemo(() => {
    let totalReq = 0;
    let solvedReq = 0;
    let totalExtra = 0;
    let solvedExtra = 0;
    let totalQuestions = 0;

    for (const { test } of allTests) {
      totalQuestions += test.questions.length;
      const passed = Boolean(progress.completedTests[test.id]?.passed);
      if (test.isExtra) {
        totalExtra += 1;
        if (passed) solvedExtra += 1;
      } else {
        totalReq += 1;
        if (passed) solvedReq += 1;
      }
    }

    return {
      totalAll: totalReq + totalExtra,
      solvedAll: solvedReq + solvedExtra,
      totalReq,
      solvedReq,
      totalExtra,
      solvedExtra,
      totalQuestions,
    };
  }, [allTests, progress.completedTests]);

  const filteredUnits = useMemo(() => {
    return CURRICULUM.filter((u) => unitFilter === 'all' || u.id === unitFilter)
      .map((unit) => {
        const topics = unit.topics
          .map((topic) => {
            const orderedTests = [
              ...getTopicRequiredTests(topic),
              ...getTopicExtraTests(topic),
            ].filter((test) => {
              const solved = Boolean(progress.completedTests[test.id]?.passed);
              if (statusFilter === 'solved') return solved;
              if (statusFilter === 'unsolved') return !solved;
              if (statusFilter === 'required') return !test.isExtra;
              if (statusFilter === 'extra') return test.isExtra;
              return true;
            });

            return { topic, tests: orderedTests };
          })
          .filter((entry) => entry.tests.length > 0);

        return { unit, topics };
      })
      .filter((entry) => entry.topics.length > 0);
  }, [unitFilter, statusFilter, progress.completedTests]);

  const pct = stats.totalAll > 0 ? Math.round((stats.solvedAll / stats.totalAll) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-12 pt-4 sm:px-6 space-y-5">
      {/* Top Return & Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            soundEngine.playTap();
            onClose();
          }}
          className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-xs font-bold active:scale-95 flex items-center gap-1.5 ${theme.surface}`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="whitespace-nowrap">Konu Hattına Dön</span>
        </button>

        <div className="text-right">
          <div className={`text-xs font-bold uppercase tracking-wider ${theme.primaryText}`}>
            MEB Maarif Modeli · {stats.totalQuestions} Soru
          </div>
          <h1 className={`font-display text-xl font-extrabold leading-tight sm:text-2xl ${theme.textPrimary}`}>
            Test Paneli
          </h1>
        </div>
      </div>

      {/* Overall Summary Card */}
      <div className={`rounded-3xl border p-4 sm:p-5 space-y-4 shadow-sm ${theme.surface}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <div>
              <div className={`font-display text-base font-extrabold ${theme.textPrimary}`}>
                Tüm Testlerin Takip Panosu
              </div>
              <p className={`text-xs leading-relaxed ${theme.textSecondary}`}>
                Çözdüğün her test yeşil tikle işaretlenir. Her konuda 4 zorunlu test ve 2 ekstra test bulunur.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center tabular-nums">
            <div className={`rounded-xl border px-3 py-2 ${theme.surfaceSubtle}`}>
              <div className={`font-display text-lg font-extrabold ${theme.primaryText}`}>
                {stats.solvedAll}/{stats.totalAll}
              </div>
              <div className={`text-[11px] font-semibold ${theme.textMuted}`}>Toplam</div>
            </div>
            <div className={`rounded-xl border px-3 py-2 ${theme.surfaceSubtle}`}>
              <div className="font-display text-lg font-extrabold text-emerald-500">
                {stats.solvedReq}/{stats.totalReq}
              </div>
              <div className={`text-[11px] font-semibold ${theme.textMuted}`}>Zorunlu</div>
            </div>
            <div className={`rounded-xl border px-3 py-2 ${theme.surfaceSubtle}`}>
              <div className={`font-display text-lg font-extrabold ${theme.accentText}`}>
                {stats.solvedExtra}/{stats.totalExtra}
              </div>
              <div className={`text-[11px] font-semibold ${theme.textMuted}`}>Ekstra</div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold tabular-nums">
            <span className={theme.textMuted}>Genel Test Tamamlama</span>
            <span className={`font-bold ${theme.primaryText}`}>%{pct}</span>
          </div>
          <div className={`h-2.5 w-full overflow-hidden rounded-full ${theme.isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2.5">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Tüm Üniteler' },
            ...CURRICULUM.map((u) => ({ id: u.id, label: `${u.number}. Ünite` })),
          ].map((item) => {
            const active = unitFilter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setUnitFilter(item.id);
                }}
                className={`min-h-[40px] shrink-0 whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                  active ? `${theme.primaryBtn} border-transparent` : theme.surface
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: 'all', label: 'Hepsi' },
              { id: 'solved', label: 'Çözülenler ✓' },
              { id: 'unsolved', label: 'Çözülmeyenler' },
              { id: 'required', label: 'Zorunlu (4/Konu)' },
              { id: 'extra', label: 'Ekstra Testler' },
            ] as { id: StatusFilter; label: string }[]
          ).map((f) => {
            const active = statusFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setStatusFilter(f.id);
                }}
                className={`min-h-[38px] whitespace-nowrap rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? theme.isDark
                      ? 'border-emerald-400/60 bg-emerald-500/20 text-emerald-300'
                      : 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : theme.surfaceSubtle
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty filter notice */}
      {filteredUnits.length === 0 && (
        <div className={`rounded-2xl border p-8 text-center space-y-2 ${theme.surface}`}>
          <p className={`font-display text-base font-bold ${theme.textPrimary}`}>
            Bu filtrede gösterilecek test yok
          </p>
          <p className={`text-xs ${theme.textSecondary}`}>
            Filtreyi değiştirerek tüm testleri görebilir ve çözmeye devam edebilirsin.
          </p>
        </div>
      )}

      {/* Units -> Topics -> Tests */}
      <div className="space-y-6">
        {filteredUnits.map(({ unit, topics }) => {
          const UnitIcon =
            unit.number === 1
              ? Orbit
              : unit.number === 2
              ? Compass
              : unit.number === 3
              ? Microscope
              : unit.number === 4
              ? Sun
              : unit.number === 5
              ? Flame
              : unit.number === 6
              ? Zap
              : Recycle;

          return (
            <section key={unit.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <UnitIcon className={`h-4 w-4 shrink-0 ${theme.primaryText}`} />
                <h2 className={`font-display text-base font-extrabold ${theme.textPrimary}`}>
                  {unit.number}. Ünite · {unit.title}
                </h2>
              </div>

              <div className="space-y-4">
                {topics.map(({ topic, tests }) => {
                  const reqList = getTopicRequiredTests(topic);
                  const extraList = getTopicExtraTests(topic);
                  const reqDone = reqList.filter((t) => progress.completedTests[t.id]?.passed).length;
                  const extraDone = extraList.filter((t) => progress.completedTests[t.id]?.passed).length;

                  return (
                    <div
                      key={topic.id}
                      className={`rounded-2xl border p-4 space-y-3 ${theme.surface}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className={`text-xs font-bold tabular-nums ${theme.primaryText}`}>
                            Konu {topic.orderLabel} · {reqDone}/4 Zorunlu · {extraDone}/2 Ekstra
                          </div>
                          <h3 className={`font-display text-sm font-extrabold sm:text-base ${theme.textPrimary}`}>
                            {topic.title}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playTap();
                            onGoToTopic(unit.id, topic.id);
                          }}
                          className={`min-h-[38px] rounded-xl border px-3 py-1.5 text-xs font-bold active:scale-95 flex items-center gap-1 ${theme.surfaceSubtle}`}
                        >
                          <span className="whitespace-nowrap">Konuya Git</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {tests.map((test) => {
                          const record = progress.completedTests[test.id];
                          const solved = Boolean(record?.passed);
                          const unlocked = isTopicTestUnlocked(topic, test, progress);

                          return (
                            <div
                              key={test.id}
                              className={`rounded-xl border p-3.5 flex items-center justify-between gap-3 transition-all ${
                                solved
                                  ? theme.isDark
                                    ? 'border-emerald-500/40 bg-emerald-500/10'
                                    : 'border-emerald-300 bg-emerald-50/70'
                                  : unlocked
                                  ? theme.surfaceSubtle
                                  : `${theme.surfaceSubtle} opacity-65`
                              }`}
                            >
                              <div className="flex min-w-0 items-start gap-2.5">
                                <div className="mt-0.5 shrink-0">
                                  {solved ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                  ) : unlocked ? (
                                    test.isExtra ? (
                                      <Sparkles className={`h-5 w-5 ${theme.accentText}`} />
                                    ) : (
                                      <Circle className={`h-5 w-5 ${theme.textMuted}`} />
                                    )
                                  ) : (
                                    <Lock className={`h-4 w-4 ${theme.textMuted}`} />
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                                    <span
                                      className={
                                        test.isExtra
                                          ? theme.accentText
                                          : solved
                                          ? 'text-emerald-500'
                                          : theme.primaryText
                                      }
                                    >
                                      {test.isExtra ? 'Ekstra Test' : `Zorunlu Test ${test.order}`}
                                    </span>
                                    <span className={theme.textMuted}>·</span>
                                    <span className={`tabular-nums ${theme.textMuted}`}>
                                      {test.questions.length} Soru
                                    </span>
                                    {solved && record && (
                                      <>
                                        <span className={theme.textMuted}>·</span>
                                        <span className="inline-flex items-center gap-0.5 tabular-nums text-emerald-500">
                                          {record.bestScore}/{record.total}
                                          {record.isPerfect && (
                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                          )}
                                        </span>
                                      </>
                                    )}
                                  </div>

                                  <div className={`mt-0.5 truncate text-xs font-extrabold sm:text-sm ${theme.textPrimary}`}>
                                    {test.title}
                                  </div>
                                  <div className={`truncate text-[11px] ${theme.textSecondary}`}>
                                    {unlocked
                                      ? test.subtitle
                                      : 'Önceki adım tamamlanınca açılır'}
                                  </div>
                                </div>
                              </div>

                              {unlocked ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    soundEngine.playTap();
                                    onLaunchTest(unit.id, topic.id, test.id);
                                  }}
                                  className={`min-h-[40px] shrink-0 rounded-xl px-3 py-2 text-xs font-extrabold active:scale-95 flex items-center gap-1 ${
                                    solved
                                      ? theme.isDark
                                        ? 'border border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                                        : 'border border-emerald-300 bg-white text-emerald-700'
                                      : theme.primaryBtn
                                  }`}
                                >
                                  <Play className="h-3.5 w-3.5 fill-current" />
                                  <span className="whitespace-nowrap">
                                    {solved ? 'Tekrar' : 'Çöz'}
                                  </span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    soundEngine.playTap();
                                    onGoToTopic(unit.id, topic.id);
                                  }}
                                  className={`min-h-[40px] shrink-0 rounded-xl border px-2.5 py-2 text-[11px] font-bold active:scale-95 ${theme.surface}`}
                                >
                                  <span className="whitespace-nowrap">Aç</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
