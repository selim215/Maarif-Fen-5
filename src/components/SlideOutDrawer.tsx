import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Compass,
  Flame,
  FlaskConical,
  Gift,
  Home,
  Microscope,
  Orbit,
  Recycle,
  RotateCcw,
  Sun,
  Trophy,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';
import {
  BADGES,
  CURRICULUM,
  DAILY_QUESTS,
  getLevelForXp,
  getTopicRequiredTests,
} from '../data/curriculum';
import { StudentProgress, UnitThemeId } from '../types';
import { UNIT_THEMES } from '../utils/theme';
import { soundEngine } from '../utils/sound';
import { BadgeIcon } from './GamificationModals';

interface SlideOutDrawerProps {
  open: boolean;
  onClose: () => void;
  progress: StudentProgress;
  themeId: UnitThemeId;
  solvedTestsCount: number;
  totalTestsCount: number;
  onSelectTopic: (unitId: string, topicId: string) => void;
  onOpenTestPanel: () => void;
  onToggleSound: () => void;
  onClaimQuest: (questId: string) => void;
  onResetProgress: () => void;
  onGoWelcome: () => void;
}

export const SlideOutDrawer: React.FC<SlideOutDrawerProps> = ({
  open,
  onClose,
  progress,
  themeId,
  solvedTestsCount,
  totalTestsCount,
  onSelectTopic,
  onOpenTestPanel,
  onToggleSound,
  onClaimQuest,
  onResetProgress,
  onGoWelcome,
}) => {
  const theme = UNIT_THEMES[themeId];
  const [drawerTab, setDrawerTab] = useState<'units' | 'quests'>('units');
  const [confirmReset, setConfirmReset] = useState(false);

  const levelInfo = getLevelForXp(progress.xp);
  const claimableCount = DAILY_QUESTS.filter(
    (q) => progress.dailyStats[q.metric] >= q.target && !progress.claimedQuests.includes(q.id)
  ).length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex bg-slate-950/60 backdrop-blur-[2px]"
          onClick={() => {
            setConfirmReset(false);
            onClose();
          }}
        >
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Ünite ve konu seçim paneli"
            className={`flex h-full w-[86vw] max-w-[340px] flex-col border-r shadow-2xl ${theme.drawerBg}`}
          >
            {/* Drawer Header */}
            <div className={`flex items-center justify-between border-b px-4 py-3.5 ${theme.border}`}>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <div className={`font-display text-base font-extrabold leading-tight ${theme.textPrimary}`}>
                    Maarif Fen 5
                  </div>
                  <div className={`text-[11px] font-semibold ${theme.primaryText}`}>
                    Seviye {levelInfo.level} · {progress.xp} XP
                  </div>
                </div>
              </div>

              <button
                type="button"
                aria-label="Paneli kapat"
                onClick={() => {
                  soundEngine.playTap();
                  setConfirmReset(false);
                  onClose();
                }}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border ${theme.surfaceSubtle}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Direct Test Panel Shortcut */}
            <div className="px-4 pt-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  onOpenTestPanel();
                  onClose();
                }}
                className={`min-h-[48px] w-full rounded-xl border px-3.5 py-2.5 text-left transition-all active:scale-[0.98] flex items-center justify-between gap-2 ${
                  theme.isDark
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <ClipboardCheck className="h-5 w-5 shrink-0 text-emerald-500" />
                  <div className="min-w-0">
                    <div className="font-display text-xs font-extrabold">
                      Tüm Test Paneli
                    </div>
                    <div className="text-[11px] opacity-85 tabular-nums">
                      {solvedTestsCount} / {totalTestsCount} test çözüldü ✓
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-emerald-500" />
              </button>
            </div>

            {/* Segmented Switcher */}
            <div className="px-4 pt-2.5">
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-black/30 p-1">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setDrawerTab('units');
                  }}
                  className={`min-h-[40px] rounded-lg text-xs font-bold transition-colors ${
                    drawerTab === 'units'
                      ? `${theme.surfaceSubtle} ${theme.primaryText}`
                      : theme.textMuted
                  }`}
                >
                  Üniteler & Konular
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setDrawerTab('quests');
                  }}
                  className={`min-h-[40px] rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    drawerTab === 'quests'
                      ? `${theme.surfaceSubtle} ${theme.primaryText}`
                      : theme.textMuted
                  }`}
                >
                  <span>Görev & Rozet</span>
                  {claimableCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-extrabold text-slate-950">
                      {claimableCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {drawerTab === 'units' ? (
                CURRICULUM.map((unit) => {
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
                  const unitColor =
                    unit.theme === 'space'
                      ? 'text-amber-300'
                      : unit.theme === 'force'
                      ? 'text-emerald-300'
                      : unit.theme === 'life'
                      ? 'text-cyan-300'
                      : unit.theme === 'light'
                      ? 'text-rose-300'
                      : unit.theme === 'matter'
                      ? 'text-sky-300'
                      : unit.theme === 'electric'
                      ? 'text-yellow-300'
                      : 'text-teal-300';

                  return (
                    <div key={unit.id} className="space-y-2">
                      <div className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide ${unitColor}`}>
                        <UnitIcon className="h-4 w-4 shrink-0" />
                        <span>
                          {unit.number}. Ünite · {unit.shortTitle}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {unit.topics.map((topic) => {
                          const stations = progress.completedStations[topic.id] ?? [];
                          const baseDone = (['hap', 'sim', 'cards', 'fill'] as const).filter((s) =>
                            stations.includes(s)
                          ).length;
                          const reqTests = getTopicRequiredTests(topic);
                          const reqDone = reqTests.filter(
                            (t) => progress.completedTests[t.id]?.passed
                          ).length;
                          const doneSteps = baseDone + reqDone;
                          const allDone = doneSteps >= 8;
                          const isActive = progress.activeTopicId === topic.id;

                          return (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() => {
                                soundEngine.playTap();
                                onSelectTopic(unit.id, topic.id);
                                onClose();
                              }}
                              className={`min-h-[52px] w-full rounded-xl border px-3 py-2.5 text-left transition-all active:scale-[0.98] flex items-center justify-between gap-2 ${
                                isActive
                                  ? theme.isDark
                                    ? 'border-amber-400/70 bg-amber-500/15 text-white'
                                    : 'border-emerald-600 bg-emerald-50 text-slate-900'
                                  : theme.surface
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                                  <span className={isActive ? theme.primaryText : theme.textMuted}>
                                    {topic.orderLabel}
                                  </span>
                                  <span className={theme.textMuted}>·</span>
                                  <span
                                    className={`tabular-nums ${
                                      allDone ? 'text-emerald-500' : theme.textMuted
                                    }`}
                                  >
                                    {doneSteps}/8 adım · {reqDone}/4 test
                                  </span>
                                </div>
                                <div className="mt-0.5 truncate text-sm font-bold">
                                  {topic.shortTitle}
                                </div>
                              </div>

                              {allDone ? (
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                              ) : (
                                <ChevronRight className={`h-4 w-4 shrink-0 ${theme.textMuted}`} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className={`flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide ${theme.primaryText}`}>
                      <Trophy className="h-4 w-4" />
                      <span>Günlük Görevler</span>
                    </div>
                    {DAILY_QUESTS.map((quest) => {
                      const val = progress.dailyStats[quest.metric];
                      const done = val >= quest.target;
                      const claimed = progress.claimedQuests.includes(quest.id);
                      return (
                        <div key={quest.id} className={`rounded-xl border p-3 space-y-2 ${theme.surface}`}>
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-xs font-bold">{quest.title}</div>
                              <div className={`text-[11px] tabular-nums ${theme.textMuted}`}>
                                {Math.min(val, quest.target)}/{quest.target} · +{quest.xpReward} XP
                              </div>
                            </div>
                            {claimed ? (
                              <span className="text-[11px] font-bold text-emerald-500">Alındı ✓</span>
                            ) : done ? (
                              <button
                                type="button"
                                onClick={() => onClaimQuest(quest.id)}
                                className={`min-h-[36px] rounded-lg px-2.5 py-1 text-[11px] font-bold flex items-center gap-1 ${theme.primaryBtn}`}
                              >
                                <Gift className="h-3.5 w-3.5" />
                                <span>Al</span>
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    <div className={`text-xs font-extrabold uppercase tracking-wide ${theme.textMuted}`}>
                      Rozetler ({progress.unlockedBadges.length}/{BADGES.length})
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {BADGES.map((b) => {
                        const unlocked = progress.unlockedBadges.includes(b.id);
                        return (
                          <div
                            key={b.id}
                            className={`rounded-xl border p-2.5 text-center ${
                              unlocked ? theme.surface : `${theme.surfaceSubtle} opacity-55`
                            }`}
                          >
                            <div
                              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl ${
                                unlocked
                                  ? 'bg-amber-400 text-slate-950'
                                  : theme.isDark
                                  ? 'bg-slate-800 text-slate-500'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              <BadgeIcon icon={b.icon} className="h-4 w-4" />
                            </div>
                            <div className="mt-1.5 text-[11px] font-bold leading-tight">
                              {b.title}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Controls */}
            <div className={`border-t p-3.5 pb-safe space-y-2 ${theme.border}`}>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onToggleSound();
                  }}
                  className={`min-h-[44px] rounded-xl border px-3 py-2 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 ${theme.surfaceSubtle}`}
                >
                  {progress.soundEnabled ? (
                    <>
                      <Volume2 className="h-4 w-4 text-emerald-500" />
                      <span>Sesler Açık</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="h-4 w-4 text-rose-500" />
                      <span>Sesler Kapalı</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    onGoWelcome();
                    onClose();
                  }}
                  className={`min-h-[44px] rounded-xl border px-3 py-2 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 ${theme.surfaceSubtle}`}
                >
                  <Home className="h-4 w-4" />
                  <span>Giriş Ekranı</span>
                </button>
              </div>

              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setConfirmReset(true);
                  }}
                  className={`min-h-[40px] w-full rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 ${theme.textMuted} hover:text-rose-500`}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>İlerlemeyi Sıfırla</span>
                </button>
              ) : (
                <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-2.5 text-center space-y-2">
                  <p className="text-[11px] font-semibold text-rose-400">
                    Tüm XP, test tikleri ve rozetler sıfırlansın mı?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className={`min-h-[38px] rounded-lg border text-xs font-bold ${theme.surface}`}
                    >
                      Vazgeç
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playError();
                        setConfirmReset(false);
                        onResetProgress();
                        onClose();
                      }}
                      className="min-h-[38px] rounded-lg bg-rose-600 text-xs font-bold text-white"
                    >
                      Evet, Sıfırla
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
