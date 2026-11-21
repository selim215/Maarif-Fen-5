import React, { useMemo, useState } from 'react';
import { Check, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';
import { FillBlankItem, UnitThemeId } from '../../types';
import { UNIT_THEMES } from '../../utils/theme';
import { soundEngine } from '../../utils/sound';

interface FillBlanksActivityProps {
  items: FillBlankItem[];
  themeId: UnitThemeId;
  isCompleted: boolean;
  onComplete: () => void;
}

function deterministicShuffle(words: string[], seedStr: string): string[] {
  const arr = [...words];
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) % 100000;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    hash = (hash * 17 + 13) % 100000;
    const j = hash % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const FillBlanksActivity: React.FC<FillBlanksActivityProps> = ({
  items,
  themeId,
  isCompleted,
  onComplete,
}) => {
  const theme = UNIT_THEMES[themeId];
  const [idx, setIdx] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);

  const current = items[idx];

  const options = useMemo(() => {
    if (!current) return [];
    return deterministicShuffle([current.answer, ...current.distractors], current.id);
  }, [current]);

  const handleSelectWord = (word: string) => {
    if (solved || !current) return;
    if (word === current.answer) {
      soundEngine.playSuccess();
      setWrongChoice(null);
      setSolved(true);
    } else {
      soundEngine.playError();
      setWrongChoice(word);
      setShowHint(true);
    }
  };

  const handleNext = () => {
    soundEngine.playTap();
    if (idx + 1 < items.length) {
      setIdx((i) => i + 1);
      setSolved(false);
      setWrongChoice(null);
      setShowHint(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
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
            Boşluk Doldurma Tamamlandı!
          </h3>
          <p className={`text-sm ${theme.textSecondary}`}>
            {items.length} bilimsel cümleyi doğru kavramlarla tamamladın. Artık istasyon sınavına hazırsın!
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            soundEngine.playUnlock();
            onComplete();
          }}
          className={`min-h-[48px] w-full rounded-xl px-4 py-3 text-sm font-bold active:scale-[0.98] flex items-center justify-center gap-2 ${theme.primaryBtn}`}
        >
          <span>{isCompleted ? 'Hatta Dön ve Devam Et' : 'Sınav İstasyonunu Aç (+35 XP)'}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className={`rounded-2xl border p-3.5 ${theme.surface}`}>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className={`font-semibold ${theme.textSecondary}`}>Doğru kelimeye dokunarak boşluğu doldur</span>
          <span className={`tabular-nums font-bold ${theme.primaryText}`}>
            Cümle {idx + 1} / {items.length}
          </span>
        </div>
        <div className={`h-2 w-full overflow-hidden rounded-full ${theme.isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <div
            className={`h-full rounded-full transition-all duration-300 ${theme.lineDoneColor}`}
            style={{ width: `${((idx + (solved ? 1 : 0)) / items.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Sentence Stage */}
      <div className={`rounded-2xl border p-5 space-y-5 ${theme.surface}`}>
        <div className={`text-lg font-medium leading-loose sm:text-xl ${theme.textPrimary}`}>
          <span>{current.beforeBlank} </span>
          <span
            className={`mx-1 inline-flex min-w-[116px] items-center justify-center rounded-xl border-2 px-3 py-0.5 font-display font-bold transition-all ${
              solved
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-500'
                : wrongChoice
                ? 'border-rose-400 bg-rose-500/10 text-rose-400'
                : theme.isDark
                ? 'border-dashed border-amber-400/70 bg-amber-500/10 text-amber-300'
                : 'border-dashed border-emerald-500 bg-emerald-50 text-emerald-700'
            }`}
          >
            {solved ? current.answer : '........'}
          </span>
          <span> {current.afterBlank}</span>
        </div>

        {/* Word Bank */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {options.map((word) => {
            const isCorrectPick = solved && word === current.answer;
            const isWrongPick = wrongChoice === word && !solved;
            return (
              <button
                key={word}
                type="button"
                disabled={solved}
                onClick={() => handleSelectWord(word)}
                className={`min-h-[48px] rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                  isCorrectPick
                    ? 'border-emerald-500 bg-emerald-600 text-white'
                    : isWrongPick
                    ? 'border-rose-400 bg-rose-500/15 text-rose-500'
                    : theme.isDark
                    ? 'border-slate-700 bg-slate-800/80 text-slate-100 hover:border-amber-400/60'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-emerald-400'
                }`}
              >
                {isCorrectPick && <Check className="h-4 w-4 shrink-0" />}
                <span>{word}</span>
              </button>
            );
          })}
        </div>

        {/* Hint / Mini Explanation */}
        {!solved && !showHint && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setShowHint(true);
            }}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${theme.accentText}`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>İpucu gör</span>
          </button>
        )}

        {(showHint || solved) && (
          <div
            className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
              solved
                ? theme.isDark
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : theme.surfaceSubtle
            }`}
          >
            <strong className="block mb-0.5">
              {solved ? 'Doğru! Kısa Açıklama:' : 'Küçük İpucu:'}
            </strong>
            {current.explanation}
          </div>
        )}

        {solved && (
          <button
            type="button"
            onClick={handleNext}
            className={`min-h-[48px] w-full rounded-xl px-4 py-3 text-sm font-bold active:scale-[0.98] flex items-center justify-center gap-2 ${theme.primaryBtn}`}
          >
            <span>{idx + 1 < items.length ? 'Sonraki Cümle' : 'Sonucu Gör'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
