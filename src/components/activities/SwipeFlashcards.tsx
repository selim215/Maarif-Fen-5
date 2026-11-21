import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion, PanInfo, useMotionValue, useTransform } from 'motion/react';
import { BookOpen, Check, ChevronRight, Lightbulb, RotateCw, Sparkles, X } from 'lucide-react';
import { FlashcardItem, UnitThemeId } from '../../types';
import { UNIT_THEMES } from '../../utils/theme';
import { soundEngine } from '../../utils/sound';

interface SwipeFlashcardsProps {
  cards: FlashcardItem[];
  themeId: UnitThemeId;
  isCompleted: boolean;
  onCardSwiped: () => void;
  onComplete: () => void;
}

export const SwipeFlashcards: React.FC<SwipeFlashcardsProps> = ({
  cards,
  themeId,
  isCompleted,
  onCardSwiped,
  onComplete,
}) => {
  const theme = UNIT_THEMES[themeId];
  const [queue, setQueue] = useState<FlashcardItem[]>(() => [...cards]);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [flipped, setFlipped] = useState(false);
  const [summaryCard, setSummaryCard] = useState<FlashcardItem | null>(null);
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null);

  const currentCard = queue[0] ?? null;
  const totalCount = cards.length;
  const masteredCount = masteredIds.length;
  const allMastered = queue.length === 0 || masteredCount >= totalCount;

  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, [-200, 0, 200], [-14, 0, 14]);
  const rightBadgeOpacity = useTransform(dragX, [25, 110], [0, 1]);
  const leftBadgeOpacity = useTransform(dragX, [-110, -25], [1, 0]);

  const progressPct = useMemo(
    () => Math.min(100, Math.round((masteredCount / Math.max(1, totalCount)) * 100)),
    [masteredCount, totalCount]
  );

  const handleKnow = () => {
    if (!currentCard || summaryCard) return;
    soundEngine.playSuccess();
    onCardSwiped();
    setExitDir('right');
    setFlipped(false);
    const id = currentCard.id;
    window.setTimeout(() => {
      setMasteredIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      setQueue((prev) => prev.slice(1));
      setExitDir(null);
      dragX.set(0);
    }, 180);
  };

  const handleDontKnow = () => {
    if (!currentCard || summaryCard) return;
    soundEngine.playError();
    onCardSwiped();
    setExitDir('left');
    setFlipped(false);
    const cardToExplain = currentCard;
    window.setTimeout(() => {
      // Re-queue this card at the end so the student reviews it again after reading the mini summary
      setQueue((prev) => {
        if (prev.length <= 1) return prev;
        return [...prev.slice(1), prev[0]];
      });
      setExitDir(null);
      dragX.set(0);
      setSummaryCard(cardToExplain);
    }, 180);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 88 || info.velocity.x > 420) {
      handleKnow();
    } else if (info.offset.x < -88 || info.velocity.x < -420) {
      handleDontKnow();
    }
  };

  const handleFlip = () => {
    if (summaryCard) return;
    soundEngine.playFlip();
    setFlipped((f) => !f);
  };

  const handleResetDeck = () => {
    soundEngine.playTap();
    setQueue([...cards]);
    setMasteredIds([]);
    setFlipped(false);
    setSummaryCard(null);
  };

  if (allMastered) {
    return (
      <div className={`rounded-2xl border p-6 text-center space-y-4 ${theme.surface}`}>
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
            theme.isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className={`font-display text-xl font-bold ${theme.textPrimary}`}>
            Harikasın! Tüm Bilgi Kartlarını Öğrendin
          </h3>
          <p className={`text-sm ${theme.textSecondary}`}>
            {totalCount} kartın tamamını sağa kaydırarak bu istasyonu ustalıkla tamamladın.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={handleResetDeck}
            className={`min-h-[48px] flex-1 rounded-xl border px-4 py-3 text-sm font-semibold active:scale-[0.98] ${theme.surfaceSubtle}`}
          >
            Kartları Tekrar Karıştır
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playUnlock();
              onComplete();
            }}
            className={`min-h-[48px] flex-1 rounded-xl px-4 py-3 text-sm font-bold active:scale-[0.98] flex items-center justify-center gap-2 ${theme.primaryBtn}`}
          >
            <span>{isCompleted ? 'Hatta Dön ve Devam Et' : 'İstasyonu Tamamla (+35 XP)'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compact deck progress bar */}
      <div className={`rounded-2xl border p-3.5 ${theme.surface}`}>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className={`font-semibold ${theme.textSecondary}`}>
            Kartı çevirmek için dokun · Biliyorsan sağa, bilmiyorsan sola kaydır
          </span>
          <span className={`ml-2 shrink-0 tabular-nums font-bold ${theme.primaryText}`}>
            {masteredCount} / {totalCount}
          </span>
        </div>
        <div className={`h-2 w-full overflow-hidden rounded-full ${theme.isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <div
            className={`h-full rounded-full transition-all duration-300 ${theme.lineDoneColor}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Swipeable 3D Flip Deck */}
      <div className="relative mx-auto h-[320px] w-full max-w-md select-none sm:h-[340px]">
        {/* Background preview card for depth */}
        {queue.length > 1 && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-4 top-3 bottom-0 rounded-3xl border opacity-55 scale-[0.96] ${theme.surface}`}
          />
        )}

        <AnimatePresence mode="wait">
          {currentCard && (
            <motion.div
              key={currentCard.id + '-' + queue.length}
              style={{ x: dragX, rotate }}
              drag={summaryCard ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.85}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={
                exitDir === 'right'
                  ? { x: 320, opacity: 0, rotate: 16 }
                  : exitDir === 'left'
                  ? { x: -320, opacity: 0, rotate: -16 }
                  : { x: 0, opacity: 1, y: 0, scale: 1 }
              }
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={handleFlip}
              className="perspective-1000 absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
            >
              {/* Live Swipe Overlays */}
              <motion.div
                style={{ opacity: rightBadgeOpacity }}
                className="pointer-events-none absolute left-4 top-4 z-20 rounded-xl border-2 border-emerald-400 bg-emerald-600/95 px-3 py-1.5 text-sm font-extrabold tracking-wide text-white shadow-lg"
              >
                BİLİYORUM ✓
              </motion.div>
              <motion.div
                style={{ opacity: leftBadgeOpacity }}
                className="pointer-events-none absolute right-4 top-4 z-20 rounded-xl border-2 border-amber-300 bg-amber-500/95 px-3 py-1.5 text-sm font-extrabold tracking-wide text-slate-950 shadow-lg"
              >
                KONUYU ANLAT ?
              </motion.div>

              {/* 3D Flipping Inner Wrapper */}
              <div
                className={`preserve-3d relative h-full w-full transition-transform duration-500 ${
                  flipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* FRONT FACE */}
                <div
                  className={`backface-hidden absolute inset-0 flex flex-col justify-between rounded-3xl border-2 p-6 shadow-lg ${theme.cardFrontBg}`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold uppercase tracking-wider ${theme.primaryText}`}>
                      Soru Kartı
                    </span>
                    <span className={`flex items-center gap-1 font-medium ${theme.textMuted}`}>
                      <RotateCw className="h-3.5 w-3.5" />
                      Çevirmek için dokun
                    </span>
                  </div>

                  <div className="my-auto space-y-3 text-center">
                    <h3 className={`font-display text-xl font-bold leading-snug sm:text-2xl ${theme.textPrimary}`}>
                      {currentCard.frontPrompt}
                    </h3>
                    <p className={`text-xs font-medium ${theme.textMuted}`}>
                      İpucu: {currentCard.frontHint}
                    </p>
                  </div>

                  <div className={`flex items-center justify-between text-[11px] font-semibold ${theme.textMuted}`}>
                    <span>← Bilmiyorum (Özet açılır)</span>
                    <span>Biliyorum →</span>
                  </div>
                </div>

                {/* BACK FACE */}
                <div
                  className={`backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-3xl border-2 p-6 shadow-lg ${theme.cardBackBg}`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold uppercase tracking-wider ${theme.accentText}`}>
                      Cevap & Bilgi
                    </span>
                    <span className={`font-medium ${theme.textMuted}`}>Ön yüz için dokun</span>
                  </div>

                  <div className="my-auto space-y-3 text-center">
                    <p className={`font-display text-lg font-bold leading-relaxed sm:text-xl ${theme.textPrimary}`}>
                      {currentCard.backAnswer}
                    </p>
                    <div
                      className={`mx-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium ${theme.surfaceSubtle}`}
                    >
                      <Lightbulb className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                      <span>{currentCard.dailyLifeTip}</span>
                    </div>
                  </div>

                  <div className={`text-center text-[11px] font-semibold ${theme.textMuted}`}>
                    Bildiysen sağa, tekrar anlatım istersen sola kaydır!
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thumb-zone Action Buttons */}
      <div className="mx-auto grid max-w-md grid-cols-[1fr_auto_1fr] items-center gap-2.5">
        <button
          type="button"
          onClick={handleDontKnow}
          className={`min-h-[52px] rounded-2xl border px-3 py-2.5 text-sm font-bold transition-transform active:scale-95 flex items-center justify-center gap-1.5 ${
            theme.isDark
              ? 'border-amber-400/40 bg-amber-500/15 text-amber-200'
              : 'border-amber-300 bg-amber-50 text-amber-900'
          }`}
        >
          <X className="h-4 w-4 shrink-0" />
          <span className="whitespace-nowrap">Bilmiyorum</span>
        </button>

        <button
          type="button"
          onClick={handleFlip}
          aria-label="Kartı çevir"
          className={`min-h-[52px] min-w-[52px] rounded-2xl border px-3.5 py-2.5 text-xs font-bold transition-transform active:scale-95 flex items-center justify-center gap-1.5 ${theme.surface}`}
        >
          <RotateCw className="h-4 w-4" />
          <span className="hidden sm:inline">Çevir</span>
        </button>

        <button
          type="button"
          onClick={handleKnow}
          className="min-h-[52px] rounded-2xl bg-emerald-600 px-3 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:bg-emerald-700 active:scale-95 flex items-center justify-center gap-1.5"
        >
          <Check className="h-4 w-4 shrink-0" />
          <span className="whitespace-nowrap">Biliyorum</span>
        </button>
      </div>

      {/* Mini Konu Özeti Bottom Sheet when Swiped Left ("Bilmiyorum") */}
      <AnimatePresence>
        {summaryCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 p-0 sm:items-center sm:p-4"
            onClick={() => setSummaryCard(null)}
          >
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg rounded-t-3xl border p-5 pb-safe shadow-2xl sm:rounded-3xl ${theme.modalBg}`}
            >
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-400/40 sm:hidden" />

              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    theme.isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-bold uppercase tracking-wider ${theme.primaryText}`}>
                    Kısa Konu Özeti · Hemen Öğren
                  </div>
                  <h4 className={`mt-0.5 font-display text-lg font-bold ${theme.textPrimary}`}>
                    {summaryCard.miniSummaryTitle}
                  </h4>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {summaryCard.miniSummaryPoints.map((pt, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 rounded-xl border p-3 text-sm leading-relaxed ${theme.surfaceSubtle}`}
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div
                className={`mt-3 flex items-start gap-2 rounded-xl border p-3 text-xs leading-relaxed ${
                  theme.isDark
                    ? 'border-sky-400/30 bg-sky-500/10 text-sky-200'
                    : 'border-sky-200 bg-sky-50 text-sky-900'
                }`}
              >
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>
                  <strong>Akılda Tutma İpucu:</strong> {summaryCard.dailyLifeTip}
                </span>
              </div>

              <p className={`mt-3 text-center text-xs ${theme.textMuted}`}>
                Bu kartı birazdan tekrar karşına getireceğiz ki iyice pekişsin!
              </p>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setSummaryCard(null);
                }}
                className={`mt-3 min-h-[48px] w-full rounded-xl px-4 py-3 text-sm font-bold active:scale-[0.98] ${theme.primaryBtn}`}
              >
                Anladım, Devam Et!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
