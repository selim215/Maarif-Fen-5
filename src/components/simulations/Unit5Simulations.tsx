import React, { useState } from 'react';
import { ArrowRight, Check, Flame, Snowflake, Sparkles, Thermometer } from 'lucide-react';
import { soundEngine } from '../../utils/sound';

interface SimProps {
  onComplete: () => void;
  isCompleted: boolean;
}

// ---------------------------------------------------------------------------
// 5.1 MADDENİN TANECİKLİ YAPISI: Katı / Sıvı / Gaz + Şırınga Sıkıştırma Testi
// ---------------------------------------------------------------------------
type MatterState = 'solid' | 'liquid' | 'gas';

const STATE_INFO: Record<
  MatterState,
  { label: string; example: string; motion: string; gap: string; compress: string; canCompress: boolean }
> = {
  solid: {
    label: 'Katı (Taş / Demir)',
    example: 'Taş dolu şırınga',
    motion: 'Sadece TİTREŞİM hareketi yapar.',
    gap: 'Tanecikler çok düzenli ve boşluk EN AZ.',
    compress: 'Sıkıştırılamaz!',
    canCompress: false,
  },
  liquid: {
    label: 'Sıvı (Su / Süt)',
    example: 'Su dolu şırınga',
    motion: 'Titreşim + Dönme + Öteleme yapar (Akışkan).',
    gap: 'Boşluk katıdan fazla, gazdan az.',
    compress: 'Sıkıştırılamadığı varsayılır!',
    canCompress: false,
  },
  gas: {
    label: 'Gaz (Hava / Buhar)',
    example: 'Hava dolu şırınga',
    motion: 'Titreşim + Dönme + Öteleme (Çok hızlı ve serbest).',
    gap: 'En düzensiz hâl, boşluk EN FAZLA!',
    compress: 'KOLAYCA SIKIŞTIRILABİLİR!',
    canCompress: true,
  },
};

export const ParticleStatesSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [state, setState] = useState<MatterState>('solid');
  const [pressed, setPressed] = useState(false);
  const [visited, setVisited] = useState<MatterState[]>(['solid']);
  const [testedCompress, setTestedCompress] = useState(false);

  const info = STATE_INFO[state];
  const pistonX = pressed ? (info.canCompress ? 185 : 96) : 90;
  const ready = visited.length >= 3 && testedCompress;

  const choose = (s: MatterState) => {
    soundEngine.playTap();
    setState(s);
    setPressed(false);
    if (!visited.includes(s)) setVisited((prev) => [...prev, s]);
  };

  return (
    <div className="rounded-3xl border border-sky-900/80 bg-[#131D3B] p-4 sm:p-5 text-sky-50 space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {(['solid', 'liquid', 'gas'] as MatterState[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => choose(s)}
            className={`min-h-[44px] rounded-xl border text-xs font-extrabold transition-all active:scale-95 ${
              state === s
                ? 'border-sky-300 bg-sky-400 text-slate-950'
                : 'border-sky-800 bg-[#1B2952] text-sky-100'
            }`}
          >
            {s === 'solid' ? 'Katı' : s === 'liquid' ? 'Sıvı' : 'Gaz'}
          </button>
        ))}
      </div>

      {/* Syringe SVG */}
      <div className="overflow-hidden rounded-2xl border border-sky-900/70 bg-[#0B1226] p-3 space-y-2">
        <svg viewBox="0 0 360 120" className="w-full h-auto">
          {/* Syringe barrel */}
          <rect x="88" y="24" width="215" height="72" rx="10" fill="#101B38" stroke="#38BDF8" strokeWidth="2.5" />
          {/* Closed nozzle */}
          <rect x="303" y="48" width="28" height="24" rx="4" fill="#F97316" />
          <text x="317" y="64" fill="#0F172A" fontSize="9" fontWeight="800" textAnchor="middle">
            KAPALI
          </text>
          {/* Piston */}
          <rect x="20" y="54" width={pistonX - 20} height="12" rx="3" fill="#94A3B8" />
          <rect x={pistonX} y="27" width="14" height="66" rx="3" fill="#E2E8F0" />

          {/* Particles inside chamber */}
          {state === 'solid' &&
            Array.from({ length: 18 }).map((_, i) => (
              <circle
                key={i}
                cx={182 + (i % 6) * 19}
                cy={40 + Math.floor(i / 6) * 20}
                r="7.5"
                fill="#38BDF8"
              />
            ))}
          {state === 'liquid' &&
            [
              [130, 74], [154, 62], [178, 78], [202, 58], [226, 76], [250, 64],
              [274, 78], [142, 44], [190, 42], [238, 46], [282, 48], [216, 82],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="7.5" fill="#22D3EE" />
            ))}
          {state === 'gas' &&
            [
              [pressed ? 215 : 132, 42],
              [pressed ? 245 : 185, 78],
              [pressed ? 268 : 240, 44],
              [pressed ? 228 : 280, 74],
              [pressed ? 282 : 162, 58],
              [pressed ? 256 : 212, 36],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="6.5" fill="#FB923C" />
            ))}
        </svg>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-extrabold text-sky-300">{info.label}</div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setPressed((prev) => !prev);
              setTestedCompress(true);
            }}
            className="min-h-[40px] rounded-xl bg-orange-400 px-3.5 py-2 text-xs font-extrabold text-slate-950 active:scale-95"
          >
            {pressed ? 'Pistonu Geri Çek' : 'Pistonu İt (Sıkıştırmayı Dene)'}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-sky-800/70 bg-[#1B2952]/70 p-3.5 space-y-1 text-xs">
        <div className="font-bold text-orange-300">{info.compress}</div>
        <p className="text-sky-100">{info.motion}</p>
        <p className="text-sky-200/80">{info.gap}</p>
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
            : 'bg-sky-950/70 text-sky-300/60 cursor-not-allowed'
        }`}
      >
        {ready || isCompleted ? <Check className="h-5 w-5" /> : <Sparkles className="h-4 w-4" />}
        <span>
          {isCompleted
            ? 'Keşif Tamamlandı · Konu Hattına Dön'
            : ready
            ? 'Keşfi Tamamladım (+40 XP)'
            : `3 hâli de incele (${visited.length}/3) ve pistonu it`}
        </span>
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 5.2 ISI VE SICAKLIK: İki Sıvıyı Karıştır & Isı Akış Yönünü İzle
// ---------------------------------------------------------------------------
export const HeatExchangeSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [tempA, setTempA] = useState(70);
  const [tempB, setTempB] = useState(20);
  const [mixed, setMixed] = useState(false);
  const [mixCount, setMixCount] = useState(0);

  const equal = tempA === tempB;
  const equilibrium = Math.round((tempA + tempB) / 2);
  const flowLabel = equal
    ? 'Sıcaklıklar eşit → Isı alışverişi OLMAZ!'
    : tempA > tempB
    ? 'Isı A kabından B kabına akar →'
    : '← Isı B kabından A kabına akar';

  const ready = mixCount >= 2;

  return (
    <div className="rounded-3xl border border-sky-900/80 bg-[#131D3B] p-4 sm:p-5 text-sky-50 space-y-4">
      <div className="grid grid-cols-11 items-center gap-2 rounded-2xl border border-sky-900/70 bg-[#0B1226] p-4 text-center">
        <div className="col-span-4 rounded-2xl border border-orange-500/40 bg-orange-500/15 p-3">
          <div className="text-[11px] font-bold text-orange-300">A Kabı (Özdeş Su)</div>
          <div className="mt-1 font-display text-2xl font-extrabold tabular-nums text-white">
            {mixed ? equilibrium : tempA} °C
          </div>
        </div>

        <div className="col-span-3 flex flex-col items-center justify-center gap-1">
          <ArrowRight
            className={`h-6 w-6 transition-transform ${
              equal
                ? 'opacity-25'
                : tempA > tempB
                ? 'text-orange-400'
                : 'rotate-180 text-sky-400'
            }`}
          />
          <span className="text-[10px] font-bold text-amber-300">
            {mixed ? 'Denge!' : equal ? 'Akış Yok' : 'Isı Akışı'}
          </span>
        </div>

        <div className="col-span-4 rounded-2xl border border-sky-500/40 bg-sky-500/15 p-3">
          <div className="text-[11px] font-bold text-sky-300">B Kabı (Özdeş Su)</div>
          <div className="mt-1 font-display text-2xl font-extrabold tabular-nums text-white">
            {mixed ? equilibrium : tempB} °C
          </div>
        </div>
      </div>

      <p className="text-center text-xs font-bold text-amber-300">{flowLabel}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="rounded-2xl border border-sky-800/70 bg-[#1B2952]/70 p-3 space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span>A Kabı Sıcaklığı:</span>
            <span className="tabular-nums text-orange-300">{tempA} °C</span>
          </div>
          <input
            type="range"
            min={10}
            max={90}
            step={10}
            value={tempA}
            onChange={(e) => {
              setTempA(Number(e.target.value));
              setMixed(false);
            }}
            className="h-3 w-full accent-orange-400 cursor-pointer"
          />
        </label>

        <label className="rounded-2xl border border-sky-800/70 bg-[#1B2952]/70 p-3 space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span>B Kabı Sıcaklığı:</span>
            <span className="tabular-nums text-sky-300">{tempB} °C</span>
          </div>
          <input
            type="range"
            min={10}
            max={90}
            step={10}
            value={tempB}
            onChange={(e) => {
              setTempB(Number(e.target.value));
              setMixed(false);
            }}
            className="h-3 w-full accent-sky-400 cursor-pointer"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => {
          soundEngine.playTap();
          setMixed(true);
          setMixCount((c) => c + 1);
        }}
        className="min-h-[46px] w-full rounded-2xl bg-sky-400 px-4 py-2.5 font-display text-sm font-extrabold text-slate-950 active:scale-[0.98]"
      >
        {mixed
          ? `Son Denge Sıcaklığı: ${equilibrium} °C (Yeni değer seçip tekrar dene!)`
          : 'Kapları Temas Ettir / Karıştır'}
      </button>

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
            : 'bg-sky-950/70 text-sky-300/60 cursor-not-allowed'
        }`}
      >
        {ready || isCompleted ? <Check className="h-5 w-5" /> : <Thermometer className="h-4 w-4" />}
        <span>
          {isCompleted
            ? 'Keşif Tamamlandı · Konu Hattına Dön'
            : ready
            ? 'Keşfi Tamamladım (+40 XP)'
            : `En az 2 farklı sıcaklık deneyi yap (${Math.min(mixCount, 2)}/2)`}
        </span>
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 5.3 MADDENİN HÂL DEĞİŞİMİ: 6 Hâl Değişimi & Sabit Sıcaklık Isıtıcı
// ---------------------------------------------------------------------------
const PHASE_EVENTS = [
  {
    id: 'erime',
    title: 'Erime',
    fromTo: 'Katı → Sıvı',
    heat: 'Isı Alır',
    example: 'Buzun 0 °C’ta sabit sıcaklıkta erimesi, tereyağı erimesi.',
  },
  {
    id: 'donma',
    title: 'Donma',
    fromTo: 'Sıvı → Katı',
    heat: 'Isı Verir',
    example: 'Suyun 0 °C’ta donması, erimiş çikolatanın buzlukta katılaşması.',
  },
  {
    id: 'buharlasma',
    title: 'Buharlaşma / Kaynama',
    fromTo: 'Sıvı → Gaz',
    heat: 'Isı Alır',
    example: 'Islak çamaşır kuruması (her sıcaklıkta), suyun 100 °C’ta kaynaması.',
  },
  {
    id: 'yogusma',
    title: 'Yoğuşma',
    fromTo: 'Gaz → Sıvı',
    heat: 'Isı Verir',
    example: 'Soğuk şişe dışındaki su damlacıkları, yağmur ve çiy.',
  },
  {
    id: 'sublimlesme',
    title: 'Süblimleşme',
    fromTo: 'Katı → Gaz (Doğrudan)',
    heat: 'Isı Alır',
    example: 'Naftalin, kuru buz, katı iyot ve kükürt.',
  },
  {
    id: 'kiragilasma',
    title: 'Kırağılaşma',
    fromTo: 'Gaz → Katı (Doğrudan)',
    heat: 'Isı Verir',
    example: 'Soğuk kış sabahında araba camı ve yapraklardaki kırağı.',
  },
];

export const PhaseChangeSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [selected, setSelected] = useState(PHASE_EVENTS[0]);
  const [visited, setVisited] = useState<string[]>(['erime']);
  const [heatStep, setHeatStep] = useState(0); // 0..6 representing -10, 0, 0(erime), 50, 100, 100(kaynama), 110

  const temps = [-10, 0, 0, 50, 100, 100, 110];
  const labels = [
    '−10 °C · Katı Buz',
    '0 °C · Erime Başladı (Sıcaklık SABİT!)',
    '0 °C · Erime Sürüyor (Katı + Sıvı, SABİT!)',
    '50 °C · Sıvı Su Isınıyor',
    '100 °C · Kaynama Başladı (Sıcaklık SABİT!)',
    '100 °C · Kaynama Sürüyor (Sıvı + Gaz, SABİT!)',
    '110 °C · Su Buharı (Gaz)',
  ];

  const ready = visited.length >= 4 && heatStep >= 4;

  return (
    <div className="rounded-3xl border border-sky-900/80 bg-[#131D3B] p-4 sm:p-5 text-sky-50 space-y-4">
      {/* Interactive Heater for Pure Water */}
      <div className="rounded-2xl border border-sky-900/70 bg-[#0B1226] p-3.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-extrabold text-amber-300">
            Saf Su Isıtma Deneyi (Sabit Sıcaklık)
          </div>
          <span className="font-display text-lg font-extrabold tabular-nums text-sky-300">
            {temps[heatStep]} °C
          </span>
        </div>
        <div className="text-xs font-bold text-sky-100">{labels[heatStep]}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setHeatStep((s) => Math.max(0, s - 1));
            }}
            className="min-h-[42px] flex-1 rounded-xl border border-sky-700 bg-sky-500/15 text-xs font-extrabold text-sky-200 flex items-center justify-center gap-1 active:scale-95"
          >
            <Snowflake className="h-4 w-4" />
            <span>Soğut</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setHeatStep((s) => Math.min(temps.length - 1, s + 1));
            }}
            className="min-h-[42px] flex-1 rounded-xl bg-orange-400 text-xs font-extrabold text-slate-950 flex items-center justify-center gap-1 active:scale-95"
          >
            <Flame className="h-4 w-4" />
            <span>Isıt (+Isı Ver)</span>
          </button>
        </div>
      </div>

      {/* 6 Phase Change Selector */}
      <div className="space-y-2">
        <div className="text-xs font-extrabold text-sky-300">
          6 Hâl Değişimine Dokun ve Keşfet:
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PHASE_EVENTS.map((ev) => {
            const active = selected.id === ev.id;
            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setSelected(ev);
                  if (!visited.includes(ev.id)) setVisited((prev) => [...prev, ev.id]);
                }}
                className={`min-h-[48px] rounded-xl border p-2 text-left transition-all active:scale-95 ${
                  active
                    ? 'border-amber-300 bg-sky-400 text-slate-950'
                    : 'border-sky-800 bg-[#1B2952] text-sky-100'
                }`}
              >
                <div className="text-xs font-extrabold leading-tight">{ev.title}</div>
                <div className="text-[10px] font-semibold opacity-85">{ev.fromTo}</div>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-sky-800/70 bg-[#1B2952]/70 p-3 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sky-200">{selected.title} ({selected.fromTo})</span>
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-extrabold ${
                selected.heat === 'Isı Alır'
                  ? 'bg-orange-500/20 text-orange-300'
                  : 'bg-sky-500/20 text-sky-300'
              }`}
            >
              {selected.heat}
            </span>
          </div>
          <p className="text-sky-100">{selected.example}</p>
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
            : 'bg-sky-950/70 text-sky-300/60 cursor-not-allowed'
        }`}
      >
        {ready || isCompleted ? <Check className="h-5 w-5" /> : <Sparkles className="h-4 w-4" />}
        <span>
          {isCompleted
            ? 'Keşif Tamamlandı · Konu Hattına Dön'
            : ready
            ? 'Keşfi Tamamladım (+40 XP)'
            : `Suyu 100 °C’a kadar ısıt ve en az 4 hâl değişimine dokun (${visited.length}/4)`}
        </span>
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 5.4 MADDE VE ISI: Isı İletkenliği & Yalıtım Malzemesi Testi
// ---------------------------------------------------------------------------
const INSULATION_MATERIALS = [
  {
    id: 'copper',
    name: 'Bakır / Çelik',
    type: 'Isı İletkeni',
    heatLossPct: 92,
    tempAfter10m: 34,
    desc: 'Metaller ısıyı çok hızlı iletir! Tencere gövdesi için harika ama yalıtım için uygun değil.',
  },
  {
    id: 'wood',
    name: 'Ahşap / Tahta',
    type: 'Isı Yalıtkanı',
    heatLossPct: 32,
    tempAfter10m: 68,
    desc: 'Isıyı yavaş iletir. Tencere kulpu, kaşık ve nihale için uygundur.',
  },
  {
    id: 'styrofoam',
    name: 'Plastik Köpük (Strafor)',
    type: 'Güçlü Isı Yalıtkanı',
    heatLossPct: 16,
    tempAfter10m: 78,
    desc: 'Tanecikler arası bol hava boşluğu vardır. Bina dış cephesinde ve Maraş dondurması kutularında kullanılır!',
  },
  {
    id: 'vacuum',
    name: 'Vakumlu Termos Duvarı',
    type: 'En Güçlü Yalıtım',
    heatLossPct: 6,
    tempAfter10m: 84,
    desc: 'İki parlak duvar arasındaki hava vakumlandığı için ısı geçişi neredeyse tamamen engellenir!',
  },
];

export const HeatInsulationSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [selected, setSelected] = useState(INSULATION_MATERIALS[0]);
  const [tested, setTested] = useState<string[]>(['copper']);

  const ready = tested.length >= 3;

  return (
    <div className="rounded-3xl border border-sky-900/80 bg-[#131D3B] p-4 sm:p-5 text-sky-50 space-y-4">
      <div className="rounded-2xl border border-sky-900/70 bg-[#0B1226] p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-bold text-sky-300">Başlangıç: 90 °C Sıcak Çay</div>
            <div className="font-display text-base font-extrabold text-white">
              Kaplama: {selected.name}
            </div>
          </div>
          <div className="text-right tabular-nums">
            <div className="font-display text-2xl font-extrabold text-orange-400">
              {selected.tempAfter10m} °C
            </div>
            <div className="text-[11px] text-sky-300">10 dk sonraki sıcaklık</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-amber-300">{selected.type}</span>
            <span className="tabular-nums text-sky-200">
              Isı Kaybı: %{selected.heatLossPct}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                selected.heatLossPct > 50 ? 'bg-orange-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${selected.heatLossPct}%` }}
            />
          </div>
        </div>

        <p className="text-xs leading-relaxed text-sky-100">{selected.desc}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {INSULATION_MATERIALS.map((mat) => {
          const active = selected.id === mat.id;
          return (
            <button
              key={mat.id}
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setSelected(mat);
                if (!tested.includes(mat.id)) setTested((prev) => [...prev, mat.id]);
              }}
              className={`min-h-[48px] rounded-xl border p-2.5 text-left transition-all active:scale-95 ${
                active
                  ? 'border-amber-300 bg-sky-400 text-slate-950'
                  : 'border-sky-800 bg-[#1B2952] text-sky-100'
              }`}
            >
              <div className="text-xs font-extrabold">{mat.name}</div>
              <div className="text-[10px] font-semibold opacity-80">{mat.type}</div>
            </button>
          );
        })}
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
            : 'bg-sky-950/70 text-sky-300/60 cursor-not-allowed'
        }`}
      >
        {ready || isCompleted ? <Check className="h-5 w-5" /> : <Sparkles className="h-4 w-4" />}
        <span>
          {isCompleted
            ? 'Keşif Tamamlandı · Konu Hattına Dön'
            : ready
            ? 'Keşfi Tamamladım (+40 XP)'
            : `En az 3 farklı malzemeyi test et (${tested.length}/3)`}
        </span>
      </button>
    </div>
  );
};
