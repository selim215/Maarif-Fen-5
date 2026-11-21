import React, { useState } from 'react';
import { Award, BookOpen, Check, CheckCircle2, ChevronRight, RotateCcw, Sparkles, X } from 'lucide-react';
import { QuizQuestion, UnitThemeId } from '../../types';
import { UNIT_THEMES } from '../../utils/theme';
import { soundEngine } from '../../utils/sound';

interface QuizActivityProps {
  testTitle: string;
  testSubtitle?: string;
  isExtra?: boolean;
  xpReward?: number;
  questions: QuizQuestion[];
  themeId: UnitThemeId;
  isCompleted: boolean;
  hasNextTest?: boolean;
  nextTestLabel?: string;
  returnLabel?: string;
  onComplete: (result: {
    score: number;
    total: number;
    passed: boolean;
    isPerfect: boolean;
  }) => void;
  onNextTest?: () => void;
  onExit: () => void;
}

export const QuizActivity: React.FC<QuizActivityProps> = ({
  testTitle,
  testSubtitle,
  isExtra = false,
  xpReward = 45,
  questions,
  themeId,
  isCompleted,
  hasNextTest = false,
  nextTestLabel = 'Sıradaki Teste Geç',
  returnLabel = 'Konu Hattına Dön',
  onComplete,
  onNextTest,
  onExit,
}) => {
  const theme = UNIT_THEMES[themeId];
  const [qIdx, setQIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [earnedXpThisAttempt, setEarnedXpThisAttempt] = useState(0);

  const current = questions[qIdx];
  const answered = selectedIdx !== null;
  const isCorrect = answered && selectedIdx === current.correctIndex;
  const passThreshold = Math.ceil(questions.length * 0.6);

  const handleChoose = (optIdx: number) => {
    if (answered) return;
    setSelectedIdx(optIdx);
    if (optIdx === current.correctIndex) {
      soundEngine.playSuccess();
      setCorrectCount((c) => c + 1);
    } else {
      soundEngine.playError();
    }
  };

  const handleNext = () => {
    if (qIdx + 1 < questions.length) {
      soundEngine.playTap();
      setQIdx((i) => i + 1);
      setSelectedIdx(null);
    } else {
      const total = questions.length;
      const passed = correctCount >= passThreshold;
      const isPerfect = correctCount === total;
      const xpWon = !isCompleted && passed ? xpReward + (isPerfect ? 15 : 0) : 0;
      setEarnedXpThisAttempt(xpWon);
      if (passed) {
        soundEngine.playUnlock();
      } else {
        soundEngine.playError();
      }
      setFinished(true);
      onComplete({ score: correctCount, total, passed, isPerfect });
    }
  };

  const handleRetry = () => {
    soundEngine.playTap();
    setQIdx(0);
    setSelectedIdx(null);
    setCorrectCount(0);
    setEarnedXpThisAttempt(0);
    setFinished(false);
  };

  if (finished) {
    const isPerfect = correctCount === questions.length;
    const passed = correctCount >= passThreshold;
    const totalXpWon = earnedXpThisAttempt;

    return (
      <div className={`rounded-2xl border p-6 text-center space-y-4 ${theme.surface}`}>
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
            isPerfect
              ? 'bg-amber-400/20 text-amber-400'
              : passed
              ? 'bg-emerald-500/20 text-emerald-500'
              : 'bg-rose-500/20 text-rose-500'
          }`}
        >
          {passed ? <CheckCircle2 className="h-9 w-9" /> : <Award className="h-9 w-9" />}
        </div>

        <div className="space-y-1">
          <div className={`text-xs font-bold uppercase tracking-wider ${theme.primaryText}`}>
            {isExtra ? 'Ekstra Pekiştirme Testi' : testTitle}
          </div>
          <h3 className={`font-display text-2xl font-extrabold tabular-nums ${theme.textPrimary}`}>
            {correctCount} / {questions.length} Doğru
          </h3>
          <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>
            {isPerfect
              ? 'Muhteşem! Tüm soruları tek seferde hatasız bildin ve testi tam puanla geçtin!'
              : passed
              ? 'Tebrikler! Testi başarıyla geçtin ve tik işaretini kazandın.'
              : `Testi geçmek için en az ${passThreshold} doğru yapmalısın. Kısa özetleri aklında tutup hemen tekrar dene!`}
          </p>
        </div>

        {totalXpWon > 0 && (
          <div
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-extrabold tabular-nums ${
              theme.isDark ? 'bg-amber-400/15 text-amber-300' : 'bg-amber-100 text-amber-900'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>
              +{totalXpWon} XP Kazanıldı{isPerfect ? ' (Tam Puan Bonusu Dahil!)' : ''}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
          <button
            type="button"
            onClick={handleRetry}
            className={`min-h-[48px] flex-1 rounded-xl border px-4 py-3 text-sm font-semibold active:scale-[0.98] flex items-center justify-center gap-2 ${theme.surfaceSubtle}`}
          >
            <RotateCcw className="h-4 w-4" />
            <span>{passed ? 'Tekrar Çöz' : 'Yeniden Dene'}</span>
          </button>

          {passed && hasNextTest && onNextTest ? (
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                onNextTest();
              }}
              className={`min-h-[48px] flex-1 rounded-xl px-4 py-3 text-sm font-bold active:scale-[0.98] flex items-center justify-center gap-2 ${theme.primaryBtn}`}
            >
              <span>{nextTestLabel}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                onExit();
              }}
              className={`min-h-[48px] flex-1 rounded-xl px-4 py-3 text-sm font-bold active:scale-[0.98] flex items-center justify-center gap-2 ${
                passed ? theme.primaryBtn : theme.surfaceSubtle
              }`}
            >
              <span>{returnLabel}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {passed && hasNextTest && onNextTest && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              onExit();
            }}
            className={`min-h-[42px] w-full rounded-xl px-4 py-2 text-xs font-bold ${theme.textMuted} hover:underline`}
          >
            {returnLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Test Header & Progress */}
      <div className={`rounded-2xl border p-4 space-y-2.5 ${theme.surface}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className={`text-[11px] font-bold uppercase tracking-wider ${theme.primaryText}`}>
              {isExtra ? 'Ekstra Test · İleri Pekiştirme' : `Zorunlu Test · Geçme: ${passThreshold}/${questions.length}`}
            </div>
            <h2 className={`font-display text-base font-extrabold leading-snug ${theme.textPrimary}`}>
              {testTitle}
            </h2>
            {testSubtitle && (
              <p className={`mt-0.5 text-xs ${theme.textSecondary}`}>{testSubtitle}</p>
            )}
          </div>
          <div className="shrink-0 text-right tabular-nums">
            <div className={`text-xs font-extrabold ${theme.primaryText}`}>
              Soru {qIdx + 1} / {questions.length}
            </div>
            <div className={`text-[11px] font-semibold ${theme.textMuted}`}>
              {correctCount} Doğru
            </div>
          </div>
        </div>

        <div className={`h-2 w-full overflow-hidden rounded-full ${theme.isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <div
            className={`h-full rounded-full transition-all duration-300 ${theme.lineDoneColor}`}
            style={{ width: `${((qIdx + (answered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className={`rounded-2xl border p-5 space-y-4 ${theme.surface}`}>
        <div className={`text-[11px] font-bold uppercase tracking-wider ${theme.textMuted}`}>
          {current.type === 'tf' ? 'Doğru / Yanlış Sorusu' : 'Çoktan Seçmeli Soru'}
        </div>

        <h3 className={`font-display text-lg font-bold leading-snug sm:text-xl ${theme.textPrimary}`}>
          {current.question}
        </h3>

        <div className={current.type === 'tf' ? 'grid grid-cols-2 gap-2.5' : 'space-y-2.5'}>
          {current.options.map((opt, idx) => {
            const isPicked = selectedIdx === idx;
            const isRightOption = idx === current.correctIndex;
            let stateStyle = theme.isDark
              ? 'border-slate-700 bg-slate-800/80 text-slate-100 hover:border-amber-400/50'
              : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-emerald-400';

            if (answered) {
              if (isRightOption) {
                stateStyle = 'border-emerald-500 bg-emerald-600 text-white';
              } else if (isPicked && !isRightOption) {
                stateStyle = 'border-rose-500 bg-rose-600 text-white';
              } else {
                stateStyle = theme.isDark
                  ? 'border-slate-800 bg-slate-900/50 text-slate-500'
                  : 'border-slate-200 bg-slate-50/50 text-slate-400';
              }
            }

            const letter = current.type === 'tf' ? null : String.fromCharCode(65 + idx);

            return (
              <button
                key={idx}
                type="button"
                disabled={answered}
                onClick={() => handleChoose(idx)}
                className={`min-h-[52px] w-full rounded-xl border-2 px-3.5 py-3 text-left text-sm font-semibold transition-all active:scale-[0.99] flex items-center justify-between gap-2.5 ${stateStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  {letter && (
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        answered && (isRightOption || isPicked)
                          ? 'bg-white/20 text-white'
                          : theme.isDark
                          ? 'bg-slate-700 text-slate-200'
                          : 'bg-white text-slate-700'
                      }`}
                    >
                      {letter}
                    </span>
                  )}
                  <span className="leading-snug">{opt}</span>
                </div>
                {answered && isRightOption && <Check className="h-4 w-4 shrink-0" />}
                {answered && isPicked && !isRightOption && <X className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Instant Mini Konu Özeti on Answer */}
        {answered && (
          <div
            className={`rounded-xl border p-4 space-y-1.5 ${
              isCorrect
                ? theme.isDark
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-100'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-950'
                : theme.isDark
                ? 'border-amber-400/50 bg-amber-500/15 text-amber-100'
                : 'border-amber-300 bg-amber-50 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="h-4 w-4 shrink-0" />
              <span>
                {isCorrect ? 'Harika Doğru Cevap!' : `Kısa Konu Özeti · ${current.miniSummaryTitle}`}
              </span>
            </div>
            <p className="text-xs leading-relaxed opacity-95">{current.explanation}</p>
          </div>
        )}

        {answered && (
          <button
            type="button"
            onClick={handleNext}
            className={`min-h-[48px] w-full rounded-xl px-4 py-3 text-sm font-bold active:scale-[0.98] flex items-center justify-center gap-2 ${theme.primaryBtn}`}
          >
            <span>{qIdx + 1 < questions.length ? 'Sonraki Soru' : 'Test Sonucunu Gör'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
