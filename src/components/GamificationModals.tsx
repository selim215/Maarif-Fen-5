import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Award,
  Check,
  Flame,
  FlaskConical,
  Gauge,
  Gift,
  Layers,
  Lock,
  Microscope,
  Orbit,
  Recycle,
  Sparkles,
  Sun,
  Target,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { BADGES, DAILY_QUESTS, getLevelForXp } from '../data/curriculum';
import { CelebrationPayload, StudentProgress, UnitThemeId } from '../types';
import { UNIT_THEMES } from '../utils/theme';
import { soundEngine } from '../utils/sound';

export const BadgeIcon: React.FC<{ icon: string; className?: string }> = ({
  icon,
  className = 'h-5 w-5',
}) => {
  switch (icon) {
    case 'flask':
      return <FlaskConical className={className} />;
    case 'layers':
      return <Layers className={className} />;
    case 'target':
      return <Target className={className} />;
    case 'orbit':
      return <Orbit className={className} />;
    case 'gauge':
      return <Gauge className={className} />;
    case 'microscope':
      return <Microscope className={className} />;
    case 'sun':
      return <Sun className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'zap':
      return <Zap className={className} />;
    case 'recycle':
      return <Recycle className={className} />;
    default:
      return <Award className={className} />;
  }
};

// ---------------------------------------------------------------------------
// CELEBRATION MODAL (Level-Up / Badge / Huge Topic & Unit Transition Panel)
// ---------------------------------------------------------------------------
interface CelebrationModalProps {
  celebration: CelebrationPayload | null;
  themeId: UnitThemeId;
  onClose: () => void;
  onNavigateTarget?: (unitId: string, topicId: string) => void;
  onOpenTestPanel?: () => void;
}

const CONFETTI_PIECES = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  left: `${4 + ((i * 4.1) % 92)}%`,
  delay: `${(i % 6) * 0.1}s`,
  color: ['#BEF264', '#10B981', '#38BDF8', '#F59E0B', '#C084FC'][i % 5],
}));

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  celebration,
  themeId,
  onClose,
  onNavigateTarget,
  onOpenTestPanel,
}) => {
  const theme = UNIT_THEMES[themeId];
  const isJourneyEnd =
    celebration?.type === 'topic-complete' ||
    celebration?.type === 'unit-complete' ||
    celebration?.type === 'all-complete';

  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Animated Confetti Shower */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            {CONFETTI_PIECES.map((c) => (
              <span
                key={c.id}
                className="animate-confetti absolute top-0 h-3.5 w-2 rounded-xs"
                style={{
                  left: c.left,
                  backgroundColor: c.color,
                  animationDelay: c.delay,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.85, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 310, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full rounded-3xl border text-center text-white shadow-2xl ${
              isJourneyEnd
                ? `max-w-md sm:max-w-lg p-7 sm:p-9 ${theme.modalBg} border-emerald-400/50`
                : `max-w-sm p-6 ${theme.modalBg}`
            }`}
          >
            <div
              className={`mx-auto flex items-center justify-center rounded-3xl shadow-lg ${
                isJourneyEnd
                  ? 'h-24 w-24 bg-gradient-to-br from-emerald-400 via-teal-400 to-lime-300 text-slate-950 shadow-emerald-500/25'
                  : 'h-20 w-20 bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-amber-500/30'
              }`}
            >
              {celebration.badgeIcon ? (
                <BadgeIcon icon={celebration.badgeIcon} className={isJourneyEnd ? 'h-12 w-12' : 'h-10 w-10'} />
              ) : celebration.type === 'level-up' || celebration.type === 'unit-complete' || celebration.type === 'all-complete' ? (
                <Trophy className={isJourneyEnd ? 'h-12 w-12' : 'h-10 w-10'} />
              ) : (
                <Sparkles className={isJourneyEnd ? 'h-12 w-12' : 'h-10 w-10'} />
              )}
            </div>

            <div
              className={`mt-5 font-extrabold uppercase tracking-widest ${
                isJourneyEnd ? 'text-xs sm:text-sm text-emerald-400' : 'text-xs text-amber-400'
              }`}
            >
              {celebration.type === 'level-up'
                ? 'Seviye Atladın!'
                : celebration.type === 'badge'
                ? 'Yeni Rozet Kazandın!'
                : celebration.type === 'unit-complete'
                ? 'Ünite Yolculuğu Tamamlandı!'
                : celebration.type === 'all-complete'
                ? 'Tüm Üniteler Tamamlandı!'
                : 'Konu Yolculuğu Tamamlandı!'}
            </div>

            <h3
              className={`mt-2 font-display font-extrabold leading-tight text-white ${
                isJourneyEnd ? 'text-2xl sm:text-3xl' : 'text-2xl'
              }`}
            >
              {celebration.title}
            </h3>

            <p
              className={`mt-3 leading-relaxed text-slate-200 ${
                isJourneyEnd ? 'text-base sm:text-lg font-medium' : 'text-sm text-slate-300'
              }`}
            >
              {celebration.subtitle}
            </p>

            {celebration.xpBonus ? (
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-amber-400/15 px-4 py-2 text-sm font-extrabold text-amber-300 tabular-nums">
                <Sparkles className="h-4 w-4" />
                <span>+{celebration.xpBonus} XP Kazanıldı</span>
              </div>
            ) : null}

            {isJourneyEnd && celebration.nextTarget && onNavigateTarget ? (
              <div className="mt-6 space-y-2.5">
                <div className={`rounded-2xl border p-3 text-xs font-bold ${theme.surfaceSubtle}`}>
                  <span className={theme.textMuted}>Sıradaki Hedef: </span>
                  <span className={theme.primaryText}>{celebration.nextTarget.label}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playUnlock();
                    const target = celebration.nextTarget!;
                    onNavigateTarget(target.unitId, target.topicId);
                  }}
                  className="min-h-[56px] w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-lime-300 px-6 py-4 font-display text-base font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20 hover:brightness-105 active:scale-[0.98] sm:text-lg"
                >
                  {celebration.actionLabel ??
                    (celebration.type === 'unit-complete'
                      ? 'Diğer Üniteye Geçelim!'
                      : 'Diğer Konuya Geçelim!')}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    onClose();
                  }}
                  className={`min-h-[44px] w-full rounded-xl border px-4 py-2.5 text-xs font-bold active:scale-[0.98] ${theme.surfaceSubtle}`}
                >
                  Şimdilik Burada Kal
                </button>
              </div>
            ) : celebration.type === 'all-complete' && onOpenTestPanel ? (
              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playUnlock();
                    onOpenTestPanel();
                  }}
                  className="min-h-[56px] w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-lime-300 px-6 py-4 font-display text-base font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20 hover:brightness-105 active:scale-[0.98] sm:text-lg"
                >
                  Test Paneline Geç (Ekstra Testler)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    onClose();
                  }}
                  className={`min-h-[44px] w-full rounded-xl border px-4 py-2.5 text-xs font-bold active:scale-[0.98] ${theme.surfaceSubtle}`}
                >
                  Kapat
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  onClose();
                }}
                className="mt-6 min-h-[50px] w-full rounded-2xl bg-amber-400 px-5 py-3 font-display text-sm font-extrabold text-slate-950 hover:bg-amber-300 active:scale-[0.98]"
              >
                Harika, Devam Et!
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ---------------------------------------------------------------------------
// DAILY QUESTS & BADGES BOTTOM SHEET
// ---------------------------------------------------------------------------
interface QuestsBadgesSheetProps {
  open: boolean;
  onClose: () => void;
  progress: StudentProgress;
  themeId: UnitThemeId;
  onClaimQuest: (questId: string) => void;
}

export const QuestsBadgesSheet: React.FC<QuestsBadgesSheetProps> = ({
  open,
  onClose,
  progress,
  themeId,
  onClaimQuest,
}) => {
  const theme = UNIT_THEMES[themeId];
  const levelInfo = getLevelForXp(progress.xp);
  const xpSpan = Math.max(1, levelInfo.nextXp - levelInfo.minXp);
  const levelPct = Math.min(100, Math.round(((progress.xp - levelInfo.minXp) / xpSpan) * 100));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 330, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className={`max-h-[86dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border p-5 pb-safe shadow-2xl sm:rounded-3xl ${theme.modalBg}`}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-400/40 sm:hidden" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Trophy className={`h-5 w-5 ${theme.primaryText}`} />
                <h3 className={`font-display text-lg font-extrabold ${theme.textPrimary}`}>
                  Günlük Görevler & Rozetler
                </h3>
              </div>
              <button
                type="button"
                aria-label="Kapat"
                onClick={() => {
                  soundEngine.playTap();
                  onClose();
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${theme.surfaceSubtle}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Level Progress Card */}
            <div className={`mt-4 rounded-2xl border p-4 ${theme.surfaceSubtle}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-xs font-bold uppercase tracking-wider ${theme.primaryText}`}>
                    Seviye {levelInfo.level}
                  </div>
                  <div className={`font-display text-lg font-extrabold ${theme.textPrimary}`}>
                    {levelInfo.title}
                  </div>
                </div>
                <div className="text-right tabular-nums">
                  <div className={`font-display text-xl font-extrabold ${theme.primaryText}`}>
                    {progress.xp} XP
                  </div>
                  <div className={`text-[11px] ${theme.textMuted}`}>
                    Sonraki seviye: {levelInfo.nextXp} XP
                  </div>
                </div>
              </div>
              <div className={`mt-3 h-2.5 w-full overflow-hidden rounded-full ${theme.isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-300 ${theme.lineDoneColor}`}
                  style={{ width: `${levelPct}%` }}
                />
              </div>
            </div>

            {/* Daily Quests */}
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className={`font-display text-sm font-bold ${theme.textPrimary}`}>
                  Bugünün Görevleri
                </h4>
                <span className={`text-xs ${theme.textMuted}`}>Her gün yenilenir</span>
              </div>

              {DAILY_QUESTS.map((quest) => {
                const currentVal = progress.dailyStats[quest.metric];
                const done = currentVal >= quest.target;
                const claimed = progress.claimedQuests.includes(quest.id);
                const pct = Math.min(100, Math.round((currentVal / quest.target) * 100));

                return (
                  <div
                    key={quest.id}
                    className={`rounded-2xl border p-3.5 space-y-2 ${theme.surface}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className={`text-sm font-bold ${theme.textPrimary}`}>{quest.title}</div>
                        <div className={`text-xs tabular-nums ${theme.textMuted}`}>
                          İlerleme: {Math.min(currentVal, quest.target)} / {quest.target} · Ödül: +{quest.xpReward} XP
                        </div>
                      </div>

                      {claimed ? (
                        <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-500">
                          <Check className="h-4 w-4" />
                          Alındı
                        </span>
                      ) : done ? (
                        <button
                          type="button"
                          onClick={() => onClaimQuest(quest.id)}
                          className={`min-h-[40px] shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold active:scale-95 flex items-center gap-1.5 ${theme.primaryBtn}`}
                        >
                          <Gift className="h-3.5 w-3.5" />
                          <span className="whitespace-nowrap">Ödülü Al</span>
                        </button>
                      ) : (
                        <span className={`shrink-0 text-xs font-semibold tabular-nums ${theme.textMuted}`}>
                          %{pct}
                        </span>
                      )}
                    </div>

                    <div className={`h-1.5 w-full overflow-hidden rounded-full ${theme.isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          done ? 'bg-emerald-500' : theme.lineDoneColor
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Badges Grid */}
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className={`font-display text-sm font-bold ${theme.textPrimary}`}>
                  Bilim Rozetlerim
                </h4>
                <span className={`text-xs font-semibold tabular-nums ${theme.primaryText}`}>
                  {progress.unlockedBadges.length} / {BADGES.length}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {BADGES.map((badge) => {
                  const unlocked = progress.unlockedBadges.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`rounded-2xl border p-3 transition-all ${
                        unlocked ? theme.surface : `${theme.surfaceSubtle} opacity-65`
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            unlocked
                              ? 'bg-amber-400 text-slate-950'
                              : theme.isDark
                              ? 'bg-slate-800 text-slate-500'
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {unlocked ? (
                            <BadgeIcon icon={badge.icon} className="h-5 w-5" />
                          ) : (
                            <Lock className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className={`truncate text-xs font-bold ${theme.textPrimary}`}>
                            {badge.title}
                          </div>
                          <div className={`text-[11px] font-semibold ${unlocked ? 'text-emerald-500' : theme.textMuted}`}>
                            {unlocked ? 'Kazanıldı' : 'Kilitli'}
                          </div>
                        </div>
                      </div>
                      <p className={`mt-2 text-[11px] leading-relaxed ${theme.textSecondary}`}>
                        {badge.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
