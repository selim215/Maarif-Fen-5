import React, { useState } from 'react';
import { Check, Lightbulb, Sparkles, Zap } from 'lucide-react';
import { soundEngine } from '../../utils/sound';

interface SimProps {
  onComplete: () => void;
  isCompleted: boolean;
}

// ---------------------------------------------------------------------------
// 6.1 DEVRE ELEMANLARININ SEMBOLLERLE GÖSTERİMİ: Canlı Devre Şeması & Anahtar
// ---------------------------------------------------------------------------
const SYMBOL_CARDS = [
  {
    id: 'battery',
    name: 'Pil',
    hasSymbol: true,
    desc: 'Elektrik enerjisi kaynağıdır. Uzun çizgi (+) kutbu, kısa kalın çizgi (−) kutbu gösterir.',
  },
  {
    id: 'bulb',
    name: 'Ampul',
    hasSymbol: true,
    desc: 'Elektrik enerjisini ışığa dönüştürür. Sembolü içinde çarpı (⊗) bulunan dairedir.',
  },
  {
    id: 'switch',
    name: 'Anahtar',
    hasSymbol: true,
    desc: 'Devreyi açıp kapatır. AÇIK anahtarda akım geçmez (ampul yanmaz); KAPALI anahtarda ampul YANAR!',
  },
  {
    id: 'wire',
    name: 'Bağlantı Kablosu',
    hasSymbol: true,
    desc: 'Devre elemanlarını birbirine bağlar. Düz çizgi ile gösterilir.',
  },
  {
    id: 'holder',
    name: 'Pil Yatağı & Duy',
    hasSymbol: false,
    desc: 'DİKKAT! Pil yatağı ve duyun evrensel devre sembolü YOKTUR; şemada çizilmezler.',
  },
];

export const CircuitSymbolsSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [switchClosed, setSwitchClosed] = useState(false);
  const [selectedId, setSelectedId] = useState('battery');
  const [inspected, setInspected] = useState<string[]>(['battery']);
  const [toggledSwitch, setToggledSwitch] = useState(false);

  const selected = SYMBOL_CARDS.find((c) => c.id === selectedId) ?? SYMBOL_CARDS[0];
  const ready = inspected.length >= 4 && toggledSwitch;

  return (
    <div className="rounded-3xl border border-amber-900/80 bg-[#221B0F] p-4 sm:p-5 text-amber-50 space-y-4">
      <div className="overflow-hidden rounded-2xl border border-amber-900/70 bg-[#120E08] p-3">
        <svg viewBox="0 0 360 155" className="w-full h-auto">
          {/* Glowing aura when closed */}
          {switchClosed && <circle cx="180" cy="36" r="34" fill="#FDE047" opacity="0.24" />}
          {/* Top, left, bottom wires */}
          <path
            d="M70 36 L156 36 M204 36 L290 36 L290 58 M290 100 L290 124 L196 124 M164 124 L70 124 L70 36"
            fill="none"
            stroke={switchClosed ? '#FACC15' : '#92400E'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bulb symbol */}
          <circle
            cx="180"
            cy="36"
            r="22"
            fill={switchClosed ? '#FEF08A' : '#271F11'}
            stroke="#FACC15"
            strokeWidth="3"
          />
          <line x1="165" y1="21" x2="195" y2="51" stroke={switchClosed ? '#713F12' : '#FACC15'} strokeWidth="2.8" />
          <line x1="195" y1="21" x2="165" y2="51" stroke={switchClosed ? '#713F12' : '#FACC15'} strokeWidth="2.8" />

          {/* Battery symbol */}
          <line x1="166" y1="106" x2="166" y2="142" stroke="#FDE047" strokeWidth="4" />
          <line x1="192" y1="114" x2="192" y2="134" stroke="#FB923C" strokeWidth="7" />
          <text x="150" y="114" fill="#FDE047" fontSize="14" fontWeight="800">+</text>
          <text x="200" y="114" fill="#FB923C" fontSize="16" fontWeight="800">−</text>

          {/* Switch symbol on right */}
          <circle cx="290" cy="58" r="5" fill="#34D399" />
          <circle cx="290" cy="100" r="5" fill="#34D399" />
          <line
            x1="290"
            y1="100"
            x2={switchClosed ? 290 : 318}
            y2={switchClosed ? 58 : 66}
            stroke="#34D399"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="text-xs font-extrabold">
            {switchClosed ? (
              <span className="text-emerald-400">Anahtar KAPALI · Ampul YANIYOR ✓</span>
            ) : (
              <span className="text-rose-300">Anahtar AÇIK · Ampul Yanmıyor</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setSwitchClosed((p) => !p);
              setToggledSwitch(true);
            }}
            className="min-h-[40px] rounded-xl bg-yellow-400 px-3.5 py-2 text-xs font-extrabold text-slate-950 active:scale-95"
          >
            {switchClosed ? 'Anahtarı Aç' : 'Anahtarı Kapat'}
          </button>
        </div>
      </div>

      {/* Inspect symbols */}
      <div className="flex flex-wrap gap-2">
        {SYMBOL_CARDS.map((card) => {
          const active = card.id === selectedId;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setSelectedId(card.id);
                if (!inspected.includes(card.id)) setInspected((prev) => [...prev, card.id]);
              }}
              className={`min-h-[42px] rounded-xl border px-3 py-2 text-xs font-bold active:scale-95 ${
                active
                  ? 'border-yellow-300 bg-yellow-400 text-slate-950'
                  : 'border-amber-800 bg-[#2E2414] text-amber-100'
              }`}
            >
              {card.name}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-amber-800/70 bg-[#2E2414]/80 p-3.5 space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-yellow-300">{selected.name}</span>
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-extrabold ${
              selected.hasSymbol
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/20 text-rose-300'
            }`}
          >
            {selected.hasSymbol ? 'Sembolü VAR' : 'Sembolü YOK'}
          </span>
        </div>
        <p className="leading-relaxed text-amber-100">{selected.desc}</p>
      </div>

      <button
        type="button"
        disabled={!ready && !isCompleted}
        onClick={() => {
          soundEngine.playSuccess();
          onComplete();
        }}
        className={`min-h-[48px] w-full rounded-2xl px-4 py-3 font-display text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
          ready || isCompleted
            ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 active:scale-[0.98]'
            : 'bg-amber-950/70 text-amber-300/60 cursor-not-allowed'
        }`}
      >
        {ready || isCompleted ? <Check className="h-5 w-5" /> : <Zap className="h-4 w-4" />}
        <span>
          {isCompleted
            ? 'Keşif Tamamlandı · Konu Hattına Dön'
            : ready
            ? 'Keşfi Tamamladım (+40 XP)'
            : `Anahtarı kapat ve en az 4 elemanı incele (${inspected.length}/4)`}
        </span>
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 6.2 AMPUL PARLAKLIĞINI ETKİLEYEN DEĞİŞKENLER: Pil & Ampul Sayısı Labı
// ---------------------------------------------------------------------------
export const BulbBrightnessSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [batteries, setBatteries] = useState(1); // 1..3
  const [bulbs, setBulbs] = useState(1); // 1..3
  const [changedBatteries, setChangedBatteries] = useState(false);
  const [changedBulbs, setChangedBulbs] = useState(false);

  const ratio = batteries / bulbs; // 0.33 .. 3.0
  const glowOpacity = Math.min(1, 0.18 + ratio * 0.3);
  const glowRadius = Math.round(14 + ratio * 10);
  const levelLabel =
    ratio >= 2.5
      ? 'ÇOK PARLAK! (En Yüksek Parlaklık)'
      : ratio >= 1.5
      ? 'Parlak'
      : ratio >= 0.9
      ? 'Normal Parlaklık'
      : ratio >= 0.5
      ? 'Az Parlak (Sönük)'
      : 'EN AZ PARLAK (Çok Sönük)';

  const ready = changedBatteries && changedBulbs;

  return (
    <div className="rounded-3xl border border-amber-900/80 bg-[#221B0F] p-4 sm:p-5 text-amber-50 space-y-4">
      <div className="rounded-2xl border border-amber-900/70 bg-[#120E08] p-4 space-y-3">
        <div className="flex items-center justify-center gap-5 py-3">
          {Array.from({ length: bulbs }).map((_, i) => (
            <div key={i} className="relative flex flex-col items-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-yellow-300 transition-all duration-300"
                style={{
                  backgroundColor: `rgba(253, 224, 71, ${glowOpacity})`,
                  boxShadow: `0 0 ${glowRadius}px rgba(250, 204, 21, ${glowOpacity})`,
                }}
              >
                <Lightbulb className="h-8 w-8 text-slate-950" />
              </div>
              <span className="mt-1.5 text-[11px] font-bold text-amber-200">
                Ampul {i + 1}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center space-y-0.5">
          <div className="font-display text-sm font-extrabold text-yellow-300">{levelLabel}</div>
          <div className="text-xs text-amber-200/80 tabular-nums">
            {batteries} Pil ÷ {bulbs} Ampul = Ampul başına {ratio.toFixed(2)} pil enerjisi
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-amber-800/70 bg-[#2E2414]/80 p-3 space-y-2">
          <div className="text-xs font-extrabold text-yellow-300">Pil Sayısı (1–3)</div>
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setBatteries(n);
                  setChangedBatteries(true);
                }}
                className={`min-h-[42px] rounded-xl border text-xs font-extrabold ${
                  batteries === n
                    ? 'border-yellow-300 bg-yellow-400 text-slate-950'
                    : 'border-amber-800 bg-[#221B0F] text-amber-100'
                }`}
              >
                {n} Pil
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-800/70 bg-[#2E2414]/80 p-3 space-y-2">
          <div className="text-xs font-extrabold text-orange-300">Ampul Sayısı (1–3)</div>
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setBulbs(n);
                  setChangedBulbs(true);
                }}
                className={`min-h-[42px] rounded-xl border text-xs font-extrabold ${
                  bulbs === n
                    ? 'border-orange-300 bg-orange-400 text-slate-950'
                    : 'border-amber-800 bg-[#221B0F] text-amber-100'
                }`}
              >
                {n} Ampul
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-800/60 bg-[#2E2414]/50 p-3 text-xs leading-relaxed text-amber-100">
        <strong className="text-yellow-300">Kural:</strong> Pil sayısı artarsa parlaklık{' '}
        <strong>ARTAR</strong>; ampul sayısı artarsa parlaklık <strong>AZALIR</strong>. Gözlemlenen sonuç (ampul parlaklığı) her zaman <strong>bağımlı değişkendir</strong>!
      </div>

      <button
        type="button"
        disabled={!ready && !isCompleted}
        onClick={() => {
          soundEngine.playSuccess();
          onComplete();
        }}
        className={`min-h-[48px] w-full rounded-2xl px-4 py-3 font-display text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
          ready || isCompleted
            ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 active:scale-[0.98]'
            : 'bg-amber-950/70 text-amber-300/60 cursor-not-allowed'
        }`}
      >
        {ready || isCompleted ? <Check className="h-5 w-5" /> : <Sparkles className="h-4 w-4" />}
        <span>
          {isCompleted
            ? 'Keşif Tamamlandı · Konu Hattına Dön'
            : ready
            ? 'Keşfi Tamamladım (+40 XP)'
            : 'Hem pil sayısını hem ampul sayısını değiştirerek test et'}
        </span>
      </button>
    </div>
  );
};
