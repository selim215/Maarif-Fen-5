import React, { useState } from 'react';
import { Check, Eye, EyeOff, Lightbulb, Sparkles } from 'lucide-react';
import { soundEngine } from '../../utils/sound';

interface SimProps {
  onComplete: () => void;
  isCompleted: boolean;
}

// ---------------------------------------------------------------------------
// 4.1 IŞIĞIN YAYILMASI: 3 Delikli Karton & Düz/Eğik Boru Deneyi
// ---------------------------------------------------------------------------
export const LightRaysSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [tubeBent, setTubeBent] = useState(false);
  const [card2Offset, setCard2Offset] = useState(32); // 0 = aligned
  const [testedTube, setTestedTube] = useState(false);
  const [alignedCards, setAlignedCards] = useState(false);

  const isAligned = Math.abs(card2Offset) <= 4;
  const ready = testedTube && alignedCards;

  const handleCardSlider = (val: number) => {
    setCard2Offset(val);
    if (Math.abs(val) <= 4 && !alignedCards) {
      soundEngine.playSuccess();
      setAlignedCards(true);
    }
  };

  return (
    <div className="rounded-3xl border border-rose-900/80 bg-[#26111E] p-4 sm:p-5 text-rose-50 space-y-4">
      {/* Part A: 3 Delikli Karton Hizalama */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            Deney 1 · 3 Delikli Karton Hizalama
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold ${
              isAligned
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-rose-950 text-rose-300'
            }`}
          >
            {isAligned ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            {isAligned ? 'Mum Alevi Görülüyor!' : 'Işık Engellendi'}
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-rose-900/70 bg-[#140812] p-2">
          <svg viewBox="0 0 360 150" className="w-full h-auto">
            {/* Candle on left */}
            <rect x="26" y="84" width="16" height="44" rx="3" fill="#FDE68A" />
            <ellipse cx="34" cy="72" rx="7" ry="13" fill="#FDE047" />
            <ellipse cx="34" cy="74" rx="3.5" ry="7" fill="#FB923C" />
            <text x="34" y="142" fill="#FDE68A" fontSize="10" textAnchor="middle" fontWeight="700">
              Mum
            </text>

            {/* Light ray */}
            <line
              x1="44"
              y1="72"
              x2={isAligned ? 314 : 178}
              y2="72"
              stroke="#FDE047"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {isAligned && (
              <polygon points="318,72 306,66 306,78" fill="#FDE047" />
            )}

            {/* Card 1 (fixed hole at y=72) */}
            <rect x="108" y="20" width="12" height="44" rx="2" fill="#881337" stroke="#FB7185" strokeWidth="1.5" />
            <rect x="108" y="80" width="12" height="50" rx="2" fill="#881337" stroke="#FB7185" strokeWidth="1.5" />

            {/* Card 2 (movable with card2Offset) */}
            <g transform={`translate(0, ${card2Offset})`}>
              <rect x="178" y="20" width="14" height="44" rx="2" fill="#BE123C" stroke="#FDA4AF" strokeWidth="2" />
              <rect x="178" y="80" width="14" height="50" rx="2" fill="#BE123C" stroke="#FDA4AF" strokeWidth="2" />
            </g>

            {/* Card 3 (fixed hole at y=72) */}
            <rect x="248" y="20" width="12" height="44" rx="2" fill="#881337" stroke="#FB7185" strokeWidth="1.5" />
            <rect x="248" y="80" width="12" height="50" rx="2" fill="#881337" stroke="#FB7185" strokeWidth="1.5" />

            {/* Observer Eye */}
            <g transform="translate(322, 72)">
              <ellipse cx="0" cy="0" rx="16" ry="10" fill={isAligned ? '#FEF9C3' : '#3F1D2E'} stroke="#FDA4AF" strokeWidth="2" />
              <circle cx="-2" cy="0" r="5" fill={isAligned ? '#0EA5E9' : '#881337'} />
              <circle cx="-2" cy="0" r="2.2" fill="#0F172A" />
            </g>
            <text x="322" y="100" fill="#FDA4AF" fontSize="10" textAnchor="middle" fontWeight="700">
              Gözlemci
            </text>
          </svg>
        </div>

        <label className="block space-y-1">
          <div className="flex justify-between text-xs font-bold text-rose-200">
            <span>Ortadaki Kartonu Hizala (0’a getir):</span>
            <span className="tabular-nums text-amber-300">
              {isAligned ? 'Tam Hizalı ✓' : `${Math.abs(card2Offset)} mm kayık`}
            </span>
          </div>
          <input
            type="range"
            min={-36}
            max={36}
            value={card2Offset}
            onChange={(e) => handleCardSlider(Number(e.target.value))}
            className="h-3 w-full accent-amber-400 cursor-pointer"
          />
        </label>
      </div>

      {/* Part B: Düz ve Eğik Boru Testi */}
      <div className="rounded-2xl border border-rose-800/70 bg-[#331728]/70 p-3.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-extrabold text-amber-300">
            Deney 2 · Düz Boru vs Eğik Boru
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setTubeBent((prev) => !prev);
              setTestedTube(true);
            }}
            className="min-h-[40px] rounded-xl bg-rose-400 px-3.5 py-2 text-xs font-extrabold text-slate-950 active:scale-95"
          >
            {tubeBent ? 'Boruyu Düzleştir' : 'Boruyu Bük'}
          </button>
        </div>

        <p className="text-xs leading-relaxed text-rose-100">
          {tubeBent
            ? 'Boru büküldü! Işık doğrusal yayıldığı için borunun kıvrımından dönemez; karşıdaki ışık kaynağı GÖRÜLMEZ.'
            : 'Boru düz! Kaynaktan çıkan ışınlar düz bir çizgi boyunca gözüne ulaşır; ışık kaynağı NET GÖRÜLÜR.'}
        </p>
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
            : 'bg-rose-950/70 text-rose-300/60 cursor-not-allowed'
        }`}
      >
        {ready || isCompleted ? <Check className="h-5 w-5" /> : <Sparkles className="h-4 w-4" />}
        <span>
          {isCompleted
            ? 'Keşif Tamamlandı · Konu Hattına Dön'
            : ready
            ? 'Keşfi Tamamladım (+40 XP)'
            : 'Ortadaki kartonu hizala ve boruyu büküp test et'}
        </span>
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 4.2 IŞIĞIN MADDE İLE ETKİLEŞİMİ: Saydam / Yarı Saydam / Opak & Kalınlık
// ---------------------------------------------------------------------------
type MaterialItem = {
  id: string;
  name: string;
  group: 'saydam' | 'yari-saydam' | 'opak';
  groupLabel: string;
  basePass: number; // 0..1
  color: string;
  note: string;
};

const LIGHT_MATERIALS: MaterialItem[] = [
  {
    id: 'glass',
    name: 'Pencere Camı',
    group: 'saydam',
    groupLabel: 'Saydam Madde',
    basePass: 0.95,
    color: '#38BDF8',
    note: 'Işığı geçirir, arkası net görülür. Ancak çok kalınlaşırsa netlik azalır!',
  },
  {
    id: 'water',
    name: 'Temiz Su',
    group: 'saydam',
    groupLabel: 'Saydam Madde',
    basePass: 0.9,
    color: '#22D3EE',
    note: 'Sığ su saydamdır, tabanı görünür; derinleştikçe (kalınlık arttıkça) ışık geçmez.',
  },
  {
    id: 'frosted',
    name: 'Buzlu Cam / Yağlı Kâğıt',
    group: 'yari-saydam',
    groupLabel: 'Yarı Saydam Madde',
    basePass: 0.48,
    color: '#F472B6',
    note: 'Işığın bir kısmını geçirir; arkadaki cisimler bulanık görünür.',
  },
  {
    id: 'tulle',
    name: 'İnce Tül Perde',
    group: 'yari-saydam',
    groupLabel: 'Yarı Saydam Madde',
    basePass: 0.55,
    color: '#E879F9',
    note: 'Işığı kısmen geçirir; kat sayısı (kalınlık) arttıkça ışık iyice azalır.',
  },
  {
    id: 'wood',
    name: 'Tahta / Alüminyum Folyo',
    group: 'opak',
    groupLabel: 'Opak (Saydam Olmayan)',
    basePass: 0,
    color: '#EA580C',
    note: 'Işığı hiç geçirmez! Arkasında karanlık bölge (gölge) oluşur.',
  },
];

export const LightTransparencySim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [selected, setSelected] = useState<MaterialItem>(LIGHT_MATERIALS[0]);
  const [thickness, setThickness] = useState(1); // 1..5 layers
  const [testedGroups, setTestedGroups] = useState<string[]>(['saydam']);
  const [changedThickness, setChangedThickness] = useState(false);

  const effectivePass =
    selected.basePass === 0
      ? 0
      : Math.max(0.08, selected.basePass - (thickness - 1) * 0.16);

  const ready = testedGroups.length >= 3 && changedThickness;

  const pickMat = (m: MaterialItem) => {
    soundEngine.playTap();
    setSelected(m);
    if (!testedGroups.includes(m.group)) {
      setTestedGroups((prev) => [...prev, m.group]);
    }
  };

  return (
    <div className="rounded-3xl border border-rose-900/80 bg-[#26111E] p-4 sm:p-5 text-rose-50 space-y-4">
      <div className="overflow-hidden rounded-2xl border border-rose-900/70 bg-[#140812] p-3">
        <svg viewBox="0 0 360 135" className="w-full h-auto">
          {/* Flashlight */}
          <rect x="16" y="54" width="38" height="26" rx="5" fill="#475569" stroke="#CBD5E1" strokeWidth="1.5" />
          <polygon points="54,50 68,44 68,90 54,84" fill="#FDE047" />
          {/* Incoming bright beam */}
          <rect x="68" y="56" width="104" height="22" fill="#FDE047" opacity="0.88" />
          {/* Material slab whose width grows with thickness */}
          <rect
            x="172"
            y="24"
            width={10 + thickness * 7}
            height="86"
            rx="5"
            fill={selected.color}
            fillOpacity={selected.group === 'opak' ? 0.95 : 0.22 + thickness * 0.12}
            stroke={selected.color}
            strokeWidth="2.5"
          />
          {/* Outgoing beam */}
          {effectivePass > 0 ? (
            <rect
              x={182 + thickness * 7}
              y="56"
              width={150 - thickness * 7}
              height="22"
              fill="#FDE047"
              opacity={effectivePass}
            />
          ) : (
            <rect x={182 + thickness * 7} y="34" width="128" height="66" rx="8" fill="#09030A" opacity="0.85" />
          )}
          {/* Target screen */}
          <rect x="326" y="20" width="16" height="94" rx="4" fill="#3B162C" stroke="#FB7185" strokeWidth="1.5" />
          <circle
            cx="334"
            cy="67"
            r="15"
            fill="#FDE047"
            opacity={effectivePass}
          />
        </svg>
        <div className="mt-2 flex items-center justify-between text-xs font-bold">
          <span className="text-amber-300">{selected.groupLabel}</span>
          <span className="tabular-nums text-rose-200">
            Geçen Işık: %{Math.round(effectivePass * 100)}
          </span>
        </div>
      </div>

      {/* Material buttons */}
      <div className="flex flex-wrap gap-2">
        {LIGHT_MATERIALS.map((m) => {
          const active = selected.id === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => pickMat(m)}
              className={`min-h-[42px] rounded-xl border px-3 py-2 text-xs font-bold transition-all active:scale-95 ${
                active
                  ? 'border-amber-300 bg-rose-400 text-slate-950'
                  : 'border-rose-800 bg-[#331728] text-rose-100'
              }`}
            >
              {m.name}
            </button>
          );
        })}
      </div>

      {/* Thickness slider */}
      <label className="block space-y-1 rounded-2xl border border-rose-800/70 bg-[#331728]/70 p-3">
        <div className="flex justify-between text-xs font-bold">
          <span>Madde Kalınlığı ({thickness} kat):</span>
          <span className="text-amber-300">
            {thickness >= 4 ? 'Çok Kalın (Az Işık Geçer)' : thickness === 1 ? 'İnce' : 'Orta'}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={thickness}
          onChange={(e) => {
            setThickness(Number(e.target.value));
            setChangedThickness(true);
          }}
          className="h-3 w-full accent-amber-400 cursor-pointer"
        />
        <p className="text-[11px] leading-relaxed text-rose-200">{selected.note}</p>
      </label>

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
            : 'bg-rose-950/70 text-rose-300/60 cursor-not-allowed'
        }`}
      >
        {ready || isCompleted ? <Check className="h-5 w-5" /> : <Lightbulb className="h-4 w-4" />}
        <span>
          {isCompleted
            ? 'Keşif Tamamlandı · Konu Hattına Dön'
            : ready
            ? 'Keşfi Tamamladım (+40 XP)'
            : `3 grubu da dene (${testedGroups.length}/3) ve kalınlığı değiştir`}
        </span>
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 4.3 TAM GÖLGENİN OLUŞUMU: Kaynak–Cisim–Ekran Gölge Laboratuvarı
// ---------------------------------------------------------------------------
export const ShadowLabSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [objectX, setObjectX] = useState(165); // 95..275 (light at x=42, screen at x=328)
  const [objectRadius, setObjectRadius] = useState(22); // 14 (tenis topu) or 28 (futbol topu)
  const [movedObject, setMovedObject] = useState(false);
  const [changedSize, setChangedSize] = useState(false);

  const lightX = 42;
  const screenX = 328;
  const distLightObj = Math.max(45, objectX - lightX);
  const shadowRadius = Math.min(72, Math.round((objectRadius * (screenX - lightX)) / distLightObj));

  const ready = movedObject && changedSize;

  return (
    <div className="rounded-3xl border border-rose-900/80 bg-[#26111E] p-4 sm:p-5 text-rose-50 space-y-4">
      <div className="overflow-hidden rounded-2xl border border-rose-900/70 bg-[#12060E] p-2">
        <svg viewBox="0 0 360 170" className="w-full h-auto">
          {/* Light cone */}
          <polygon
            points={`${lightX},85 ${screenX},${85 - shadowRadius} ${screenX},${85 + shadowRadius}`}
            fill="#FDE047"
            opacity="0.16"
          />
          {/* Umbra shadow */}
          <polygon
            points={`${objectX},${85 - objectRadius} ${screenX},${85 - shadowRadius} ${screenX},${85 + shadowRadius} ${objectX},${85 + objectRadius}`}
            fill="#050206"
            opacity="0.92"
          />
          {/* Top & bottom tangent rays */}
          <line
            x1={lightX}
            y1="85"
            x2={screenX}
            y2={85 - shadowRadius}
            stroke="#FDE047"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <line
            x1={lightX}
            y1="85"
            x2={screenX}
            y2={85 + shadowRadius}
            stroke="#FDE047"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          {/* Light source */}
          <circle cx={lightX} cy="85" r="14" fill="#FDE047" />
          <circle cx={lightX} cy="85" r="22" fill="#FDE047" opacity="0.22" />
          {/* Opaque sphere */}
          <circle cx={objectX} cy="85" r={objectRadius} fill="#4C1D35" stroke="#FB7185" strokeWidth="2.5" />
          {/* Screen */}
          <rect x={screenX} y="10" width="14" height="150" rx="4" fill="#881337" stroke="#FDA4AF" strokeWidth="1.5" />
          {/* Shadow projected on screen */}
          <ellipse cx={screenX + 7} cy="85" rx="5" ry={shadowRadius} fill="#020103" />
          <text x={lightX} y="156" fill="#FDE68A" fontSize="10" textAnchor="middle" fontWeight="700">
            Kaynak
          </text>
          <text x={objectX} y="156" fill="#FDA4AF" fontSize="10" textAnchor="middle" fontWeight="700">
            Opak Top
          </text>
          <text x={screenX} y="168" fill="#FDA4AF" fontSize="9" textAnchor="middle" fontWeight="700">
            Perde
          </text>
        </svg>
      </div>

      {/* Controls */}
      <div className="space-y-3 rounded-2xl border border-rose-800/70 bg-[#331728]/70 p-3.5">
        <label className="block space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span>Opak Cismi Kaydır (Kaynağa / Perdeye):</span>
            <span className="tabular-nums text-amber-300">Gölge Çapı: {shadowRadius * 2} br</span>
          </div>
          <input
            type="range"
            min={98}
            max={265}
            value={objectX}
            onChange={(e) => {
              setObjectX(Number(e.target.value));
              setMovedObject(true);
            }}
            className="h-3 w-full accent-amber-400 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-rose-300">
            <span>← Kaynağa Yakın (BÜYÜK Gölge)</span>
            <span>Perdeye Yakın (KÜÇÜK Gölge) →</span>
          </div>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setObjectRadius(14);
              setChangedSize(true);
            }}
            className={`min-h-[42px] rounded-xl border text-xs font-bold ${
              objectRadius === 14
                ? 'border-amber-300 bg-rose-400 text-slate-950'
                : 'border-rose-800 bg-[#26111E] text-rose-100'
            }`}
          >
            Tenis Topu (Küçük)
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setObjectRadius(28);
              setChangedSize(true);
            }}
            className={`min-h-[42px] rounded-xl border text-xs font-bold ${
              objectRadius === 28
                ? 'border-amber-300 bg-rose-400 text-slate-950'
                : 'border-rose-800 bg-[#26111E] text-rose-100'
            }`}
          >
            Futbol Topu (Büyük)
          </button>
        </div>
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
            : 'bg-rose-950/70 text-rose-300/60 cursor-not-allowed'
        }`}
      >
        {ready || isCompleted ? <Check className="h-5 w-5" /> : <Sparkles className="h-4 w-4" />}
        <span>
          {isCompleted
            ? 'Keşif Tamamlandı · Konu Hattına Dön'
            : ready
            ? 'Keşfi Tamamladım (+40 XP)'
            : 'Topun yerini kaydır ve top büyüklüğünü değiştir'}
        </span>
      </button>
    </div>
  );
};
