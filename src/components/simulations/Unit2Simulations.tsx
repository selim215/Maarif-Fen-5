import React, { useState } from 'react';
import { AlertTriangle, Check, Play, RotateCcw, Sparkles } from 'lucide-react';
import { soundEngine } from '../../utils/sound';

interface SimProps {
  onComplete: () => void;
  isCompleted: boolean;
}

// ---------------------------------------------------------------------------
// 2.1 SANAL DİNAMOMETRE LABORATUVARI
// ---------------------------------------------------------------------------
const DYNAMOMETERS = [
  { id: 'thin', label: 'İnce Yay · 10 N', maxN: 10, divisions: 10, strokeW: 1.8, note: 'Çok hassas ölçüm yapar!' },
  { id: 'med', label: 'Orta Yay · 50 N', maxN: 50, divisions: 10, strokeW: 2.8, note: 'Günlük cisimler için ideal.' },
  { id: 'thick', label: 'Kalın Yay · 100 N', maxN: 100, divisions: 10, strokeW: 4, note: 'Ağır cisimleri bozulmadan ölçer.' },
];

const HANG_OBJECTS = [
  { id: 'apple', name: 'Elma', forceN: 2, color: '#EF4444' },
  { id: 'pencil', name: 'Kalemlik', forceN: 5, color: '#3B82F6' },
  { id: 'book', name: 'Fen Kitabı', forceN: 12, color: '#10B981' },
  { id: 'bottle', name: 'Su Şişesi', forceN: 20, color: '#0EA5E9' },
  { id: 'stone', name: 'Ağır Taş', forceN: 60, color: '#64748B' },
];

export const DynamometerSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [selectedDyn, setSelectedDyn] = useState(DYNAMOMETERS[0]);
  const [selectedObj, setSelectedObj] = useState(HANG_OBJECTS[0]);
  const [measuredIds, setMeasuredIds] = useState<string[]>(['apple']);
  const [triedDiffDyn, setTriedDiffDyn] = useState(false);

  const isOverload = selectedObj.forceN > selectedDyn.maxN;
  const stretchRatio = isOverload ? 1.15 : selectedObj.forceN / selectedDyn.maxN;
  const springEndY = 66 + stretchRatio * 84;
  const perDivision = selectedDyn.maxN / selectedDyn.divisions;

  // Build coiled spring SVG path from y=46 to springEndY
  const coils = 8;
  const springStep = (springEndY - 46) / coils;
  let springPath = 'M 100 40 L 100 46';
  for (let i = 0; i < coils; i++) {
    const yMid = 46 + i * springStep + springStep / 2;
    const yNext = 46 + (i + 1) * springStep;
    const xSide = i % 2 === 0 ? 89 : 111;
    springPath += ` L ${xSide} ${yMid} L 100 ${yNext}`;
  }

  const ready = measuredIds.length >= 3 && triedDiffDyn;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-900/80 bg-[#0E241E] p-4 shadow-sm">
        {/* Dynamometer selector */}
        <div className="mb-3 grid grid-cols-3 gap-1.5">
          {DYNAMOMETERS.map((d) => {
            const active = selectedDyn.id === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setSelectedDyn(d);
                  setTriedDiffDyn(true);
                }}
                className={`min-h-[44px] rounded-xl border px-2 py-2 text-xs font-semibold transition-all active:scale-95 ${
                  active
                    ? 'border-emerald-400 bg-emerald-500 text-slate-950 font-bold'
                    : 'border-emerald-800/70 bg-[#133028] text-emerald-100'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        {/* Visual stage */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-center">
          <div className="flex flex-col items-center rounded-xl border border-emerald-900/70 bg-[#081713] p-3">
            <svg viewBox="0 0 200 230" className="h-56 w-48 select-none">
              {/* Top hook ring */}
              <circle cx="100" cy="18" r="10" fill="none" stroke="#94A3B8" strokeWidth="3" />
              {/* Dynamometer body */}
              <rect x="76" y="28" width="48" height="128" rx="12" fill="#1E3A32" stroke="#34D399" strokeOpacity="0.45" strokeWidth="2" />
              {/* Scale window */}
              <rect x="84" y="42" width="32" height="104" rx="6" fill="#0B1F1A" />
              {/* Tick marks */}
              {Array.from({ length: 11 }).map((_, idx) => {
                const ty = 48 + idx * 9;
                return (
                  <g key={idx}>
                    <line x1="86" y1={ty} x2={idx % 2 === 0 ? 96 : 92} y2={ty} stroke="#6EE7B7" strokeOpacity="0.6" strokeWidth="1.2" />
                  </g>
                );
              })}

              {/* Animated spring */}
              <path
                d={springPath}
                fill="none"
                stroke={isOverload ? '#F87171' : '#34D399'}
                strokeWidth={selectedDyn.strokeW}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Pointer indicator */}
              <line x1="82" y1={springEndY} x2="118" y2={springEndY} stroke={isOverload ? '#F87171' : '#FB923C'} strokeWidth="3" />

              {/* Lower rod + hook */}
              <line x1="100" y1={springEndY} x2="100" y2={springEndY + 26} stroke="#94A3B8" strokeWidth="2.5" />
              <path
                d={`M 100 ${springEndY + 26} Q 108 ${springEndY + 33} 100 ${springEndY + 38} Q 93 ${springEndY + 36} 95 ${springEndY + 32}`}
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2.5"
              />

              {/* Hanging object */}
              <rect
                x="76"
                y={springEndY + 38}
                width="48"
                height="28"
                rx="8"
                fill={selectedObj.color}
              />
              <text
                x="100"
                y={springEndY + 56}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="700"
              >
                {selectedObj.name}
              </text>
            </svg>
          </div>

          <div className="space-y-3">
            {/* Readout */}
            <div
              className={`rounded-xl border p-3.5 ${
                isOverload
                  ? 'border-rose-500/40 bg-rose-500/15'
                  : 'border-emerald-500/35 bg-emerald-500/10'
              }`}
            >
              <div className="text-xs font-medium text-emerald-200/80">Ölçülen Kuvvet</div>
              {isOverload ? (
                <div className="mt-1 flex items-start gap-2 text-rose-300">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <div className="font-display text-base font-bold">Esneklik Sınırı Aşıldı!</div>
                    <p className="text-xs leading-relaxed text-rose-200/90">
                      {selectedObj.name} ({selectedObj.forceN} N), bu {selectedDyn.maxN} N’lık yayı bozar. Daha kalın yaylı dinamometre seç!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mt-0.5 font-display text-3xl font-extrabold tabular-nums text-emerald-400">
                    {selectedObj.forceN} N
                  </div>
                  <p className="mt-1 text-xs text-emerald-100/85">
                    Her 1 bölme <strong className="tabular-nums text-white">{perDivision} N</strong> değerindedir. {selectedDyn.note}
                  </p>
                </>
              )}
            </div>

            {/* Object buttons */}
            <div>
              <div className="mb-1.5 text-xs font-semibold text-emerald-200/80">Kancaya Asılacak Cismi Seç:</div>
              <div className="flex flex-wrap gap-1.5">
                {HANG_OBJECTS.map((obj) => {
                  const active = selectedObj.id === obj.id;
                  return (
                    <button
                      key={obj.id}
                      type="button"
                      onClick={() => {
                        if (obj.forceN > selectedDyn.maxN) {
                          soundEngine.playError();
                        } else {
                          soundEngine.playTap();
                        }
                        setSelectedObj(obj);
                        setMeasuredIds((prev) => (prev.includes(obj.id) ? prev : [...prev, obj.id]));
                      }}
                      className={`min-h-[44px] rounded-xl border px-3 py-2 text-xs font-semibold transition-all active:scale-95 ${
                        active
                          ? 'border-orange-400 bg-orange-500 text-slate-950 font-bold'
                          : 'border-emerald-800/70 bg-[#133028] text-emerald-100'
                      }`}
                    >
                      {obj.name} ({obj.forceN} N)
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="rounded-2xl border border-emerald-900/80 bg-[#0E241E] p-4 space-y-3">
        <div className="space-y-1.5 text-sm text-emerald-100">
          <div className="flex items-center gap-2">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${measuredIds.length >= 3 ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-950 text-emerald-300'}`}>
              {measuredIds.length >= 3 ? <Check className="h-3.5 w-3.5" /> : '1'}
            </span>
            <span>En az 3 farklı cismi kancaya as ({measuredIds.length}/3)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${triedDiffDyn ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-950 text-emerald-300'}`}>
              {triedDiffDyn ? <Check className="h-3.5 w-3.5" /> : '2'}
            </span>
            <span>Farklı kalınlıkta bir dinamometre dene</span>
          </div>
        </div>
        <button
          type="button"
          disabled={!isCompleted && !ready}
          onClick={() => {
            soundEngine.playUnlock();
            onComplete();
          }}
          className={`min-h-[48px] w-full rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            isCompleted || ready
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              : 'bg-emerald-950/90 text-emerald-400/50 cursor-not-allowed'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{isCompleted ? 'Keşif Tamamlandı · Devam Et' : ready ? 'Keşfi Tamamla (+40 XP)' : 'Görevleri Tamamla'}</span>
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 2.2 DÜNYA – AY KÜTLE VE AĞIRLIK KARŞILAŞTIRICISI
// ---------------------------------------------------------------------------
const LOCATIONS = [
  { id: 'pole', label: 'Dünya · Kutup', factor: 10.05, jumpPx: 22, bg: 'from-[#0D2A38] to-[#0A1E29]', desc: 'Kutuplar Dünya merkezine en yakındır; yer çekimi ve ağırlık EN FAZLADIR.' },
  { id: 'equator', label: 'Dünya · Ekvator', factor: 9.95, jumpPx: 24, bg: 'from-[#0E2E24] to-[#0A2019]', desc: 'Ekvator merkeze kutuplardan ~21 km uzaktır; ağırlık kutuplara göre biraz azdır.' },
  { id: 'mountain', label: 'Dağ Zirvesi', factor: 9.75, jumpPx: 28, bg: 'from-[#162C2C] to-[#0D1C1E]', desc: 'Deniz seviyesinden yükseğe çıkıldıkça yer çekimi azalır, ağırlık hafifler!' },
  { id: 'moon', label: 'Ay Yüzeyi', factor: 10 / 6, jumpPx: 68, bg: 'from-[#111827] to-[#080C17]', desc: 'Ay’ın çekimi Dünya’nın 1/6’sı kadardır! Ağırlığın 6 kat azalır ama kütlen AYNI kalır.' },
];

export const MassWeightSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [massKg, setMassKg] = useState(60);
  const [locIdx, setLocIdx] = useState(0);
  const [visitedLocs, setVisitedLocs] = useState<string[]>(['pole']);
  const [jumping, setJumping] = useState(false);

  const loc = LOCATIONS[locIdx];
  const weightN = loc.id === 'moon' ? Math.round((massKg * 10) / 6) : Math.round(massKg * loc.factor);

  const triggerJump = () => {
    soundEngine.playFlip();
    setJumping(true);
    window.setTimeout(() => setJumping(false), 650);
  };

  const ready = visitedLocs.length >= 3 && visitedLocs.includes('moon');

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-900/80 bg-[#0E241E] p-4 shadow-sm space-y-4">
        {/* Location selector */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LOCATIONS.map((item, idx) => {
            const active = idx === locIdx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setLocIdx(idx);
                  setVisitedLocs((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
                }}
                className={`min-h-[44px] rounded-xl border px-2 py-2 text-xs font-semibold transition-all active:scale-95 ${
                  active
                    ? 'border-emerald-400 bg-emerald-500 text-slate-950 font-bold'
                    : 'border-emerald-800/70 bg-[#133028] text-emerald-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Visual Jump & Measurement Stage */}
        <div className={`relative overflow-hidden rounded-2xl border border-emerald-800/60 bg-gradient-to-b ${loc.bg} p-4 transition-colors duration-300`}>
          <div className="grid grid-cols-2 gap-3">
            {/* Equal Arm Balance = Mass */}
            <div className="rounded-xl border border-white/10 bg-black/35 p-3 text-white">
              <div className="text-[11px] font-semibold text-emerald-300">
                Eşit Kollu Terazi (Kütle)
              </div>
              <div className="mt-1 font-display text-2xl font-extrabold tabular-nums">{massKg} kg</div>
              <div className="mt-0.5 text-[11px] text-emerald-100/75">
                Konuma göre DEĞİŞMEZ!
              </div>
            </div>

            {/* Dynamometer = Weight */}
            <div className="rounded-xl border border-white/10 bg-black/35 p-3 text-white">
              <div className="text-[11px] font-semibold text-orange-300">
                Dinamometre (Ağırlık)
              </div>
              <div className="mt-1 font-display text-2xl font-extrabold tabular-nums">{weightN} N</div>
              <div className="mt-0.5 text-[11px] text-emerald-100/75">
                Yer çekimine göre DEĞİŞİR!
              </div>
            </div>
          </div>

          {/* Interactive Jump Demonstration */}
          <div className="mt-4 flex items-end justify-between rounded-xl border border-white/10 bg-black/25 px-4 py-3">
            <div className="relative flex h-24 w-24 items-end justify-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 font-display text-xs font-bold text-slate-950 shadow-md transition-transform duration-500"
                style={{ transform: jumping ? `translateY(-${loc.jumpPx}px)` : 'translateY(0px)' }}
              >
                {massKg} kg
              </div>
            </div>
            <div className="flex-1 pl-3">
              <p className="text-xs leading-relaxed text-emerald-100/90">
                {loc.desc}
              </p>
              <button
                type="button"
                onClick={triggerJump}
                className="mt-2 min-h-[44px] rounded-xl bg-orange-500 px-4 py-2 text-xs font-extrabold text-slate-950 active:scale-95"
              >
                Zıplama Testi Yap!
              </button>
            </div>
          </div>
        </div>

        {/* Mass Picker */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs text-emerald-200/80">
            <span className="font-semibold">Cismin Kütlesini Değiştir:</span>
            <span className="tabular-nums font-bold text-emerald-400">{massKg} kg</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[6, 30, 60, 90].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setMassKg(m);
                }}
                className={`min-h-[44px] rounded-xl border text-xs font-bold tabular-nums active:scale-95 ${
                  massKg === m
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                    : 'border-emerald-800/70 bg-[#133028] text-emerald-100'
                }`}
              >
                {m} kg
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="rounded-2xl border border-emerald-900/80 bg-[#0E241E] p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-emerald-200/80">
          <span className="font-semibold text-emerald-50">Dünya ve Ay dâhil en az 3 konumu karşılaştır</span>
          <span className="tabular-nums font-bold text-emerald-400">{visitedLocs.length} / 4</span>
        </div>
        <button
          type="button"
          disabled={!isCompleted && !ready}
          onClick={() => {
            soundEngine.playUnlock();
            onComplete();
          }}
          className={`min-h-[48px] w-full rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            isCompleted || ready
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              : 'bg-emerald-950/90 text-emerald-400/50 cursor-not-allowed'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{isCompleted ? 'Keşif Tamamlandı · Devam Et' : ready ? 'Keşfi Tamamla (+40 XP)' : 'Ay Yüzeyi ve 2 Konum Daha Dene'}</span>
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 2.3 SÜRTÜNME PİSTİ VE HAVA / SU DİRENCİ
// ---------------------------------------------------------------------------
const SURFACES = [
  { id: 'glass', name: 'Cam Zemin', roughness: 'Çok az pürüzlü', distanceCm: 92, pattern: 'bg-sky-500/35' },
  { id: 'marble', name: 'Mermer', roughness: 'Az pürüzlü', distanceCm: 76, pattern: 'bg-slate-400/35' },
  { id: 'carpet', name: 'Halı Zemin', roughness: 'Pürüzlü', distanceCm: 42, pattern: 'bg-amber-500/40' },
  { id: 'sand', name: 'Kum Kaplama', roughness: 'Çok pürüzlü', distanceCm: 24, pattern: 'bg-orange-600/45' },
];

export const FrictionLabSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [tab, setTab] = useState<'surface' | 'airwater'>('surface');
  const [surface, setSurface] = useState(SURFACES[0]);
  const [carPos, setCarPos] = useState(0);
  const [testedSurfaces, setTestedSurfaces] = useState<string[]>([]);
  const [airDropped, setAirDropped] = useState(false);
  const [testedAir, setTestedAir] = useState(false);

  const launchCar = (targetSurface = surface) => {
    soundEngine.playFlip();
    setCarPos(0);
    window.setTimeout(() => {
      setCarPos(targetSurface.distanceCm);
      setTestedSurfaces((prev) => (prev.includes(targetSurface.id) ? prev : [...prev, targetSurface.id]));
    }, 60);
  };

  const ready = testedSurfaces.length >= 2 && testedAir;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-900/80 bg-[#0E241E] p-4 shadow-sm space-y-4">
        {/* Segmented mode switcher */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#081713] p-1">
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setTab('surface');
            }}
            className={`min-h-[44px] rounded-lg text-xs font-bold transition-colors ${
              tab === 'surface' ? 'bg-[#16382E] text-emerald-300 shadow-sm' : 'text-emerald-200/65'
            }`}
          >
            1. Zemin Pisti Deneyi
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setTab('airwater');
            }}
            className={`min-h-[44px] rounded-lg text-xs font-bold transition-colors ${
              tab === 'airwater' ? 'bg-[#16382E] text-emerald-300 shadow-sm' : 'text-emerald-200/65'
            }`}
          >
            2. Hava Direnci Testi
          </button>
        </div>

        {tab === 'surface' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {SURFACES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSurface(s);
                    setCarPos(0);
                    soundEngine.playTap();
                  }}
                  className={`min-h-[44px] rounded-xl border px-2 py-2 text-xs font-semibold active:scale-95 ${
                    surface.id === s.id
                      ? 'border-emerald-400 bg-emerald-500 text-slate-950 font-bold'
                      : 'border-emerald-800/70 bg-[#133028] text-emerald-100'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {/* Track stage */}
            <div className="rounded-xl border border-emerald-800/70 bg-[#091A15] p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-100">
                  {surface.name} · {surface.roughness}
                </span>
                <span className="tabular-nums font-bold text-orange-400">
                  {carPos > 0 ? `${carPos} cm gitti` : 'Hazır'}
                </span>
              </div>

              <div className="relative h-24 w-full overflow-hidden rounded-lg border border-emerald-900/80 bg-[#0D211C]">
                {/* Track floor */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-7 ${surface.pattern} border-t border-emerald-400/30`}
                />
                {/* Toy car */}
                <div
                  className="absolute bottom-7 left-3 flex h-10 w-14 flex-col items-center justify-center rounded-lg bg-emerald-400 text-[10px] font-extrabold text-slate-950 shadow transition-all duration-1000 ease-out"
                  style={{ transform: `translateX(${carPos * 2.1}px)` }}
                >
                  <span>ARABA</span>
                  <div className="mt-0.5 flex gap-5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-950" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-950" />
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => launchCar(surface)}
                  className="min-h-[46px] flex-1 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-extrabold text-slate-950 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Play className="h-4 w-4" />
                  <span>Arabayı Bırak!</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setCarPos(0);
                  }}
                  aria-label="Sıfırla"
                  className="min-h-[46px] min-w-[46px] rounded-xl border border-emerald-800/70 bg-[#133028] flex items-center justify-center text-emerald-200"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-emerald-200/85">
              İki özdeş kâğıt: biri <strong className="text-white">buruşturulmuş top</strong>, diğeri <strong className="text-white">açık paraşüt gibi düz</strong>. Hangisi yere daha çabuk ulaşır?
            </p>
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-emerald-800/70 bg-gradient-to-b from-[#0C2629] to-[#091A16] p-3">
              {/* Crumpled paper */}
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-bold text-emerald-100">Buruşturulmuş (Az Direnç)</span>
                <div className="relative mt-2 h-36 w-full rounded-lg border border-emerald-800/60 bg-black/30">
                  <div
                    className="absolute left-1/2 top-2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-[10px] font-extrabold text-slate-950 shadow transition-transform duration-500 ease-in"
                    style={{ transform: airDropped ? 'translate(-50%, 96px)' : 'translate(-50%, 0px)' }}
                  >
                    TOP
                  </div>
                </div>
                <span className="mt-1 text-[11px] font-semibold text-emerald-400">
                  {airDropped ? 'Hızlı indi!' : 'Bekliyor'}
                </span>
              </div>

              {/* Open parachute */}
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-bold text-emerald-100">Açık Paraşüt (Çok Direnç)</span>
                <div className="relative mt-2 h-36 w-full rounded-lg border border-emerald-800/60 bg-black/30">
                  <div
                    className="absolute left-1/2 top-2 -translate-x-1/2 flex h-9 w-16 items-center justify-center rounded-t-full bg-emerald-400 text-[10px] font-extrabold text-slate-950 shadow transition-transform duration-[1800ms] ease-out"
                    style={{ transform: airDropped ? 'translate(-50%, 96px)' : 'translate(-50%, 0px)' }}
                  >
                    PARAŞÜT
                  </div>
                </div>
                <span className="mt-1 text-[11px] font-semibold text-sky-300">
                  {airDropped ? 'Yavaş ve güvenli!' : 'Bekliyor'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playFlip();
                setAirDropped((v) => !v);
                setTestedAir(true);
              }}
              className="min-h-[46px] w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-extrabold text-slate-950 active:scale-[0.98]"
            >
              {airDropped ? 'Yukarı Çıkar ve Tekrar Dene' : 'İkisini Aynı Anda Bırak!'}
            </button>
          </div>
        )}
      </div>

      {/* Checklist */}
      <div className="rounded-2xl border border-emerald-900/80 bg-[#0E241E] p-4 space-y-3">
        <div className="space-y-1.5 text-sm text-emerald-100">
          <div className="flex items-center gap-2">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${testedSurfaces.length >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-950 text-emerald-300'}`}>
              {testedSurfaces.length >= 2 ? <Check className="h-3.5 w-3.5" /> : '1'}
            </span>
            <span>Zemin pistinde en az 2 farklı yüzeyde araba bırak ({testedSurfaces.length}/2)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${testedAir ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-950 text-emerald-300'}`}>
              {testedAir ? <Check className="h-3.5 w-3.5" /> : '2'}
            </span>
            <span>Hava direnci (Paraşüt) testini çalıştır</span>
          </div>
        </div>
        <button
          type="button"
          disabled={!isCompleted && !ready}
          onClick={() => {
            soundEngine.playUnlock();
            onComplete();
          }}
          className={`min-h-[48px] w-full rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            isCompleted || ready
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              : 'bg-emerald-950/90 text-emerald-400/50 cursor-not-allowed'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{isCompleted ? 'Keşif Tamamlandı · Devam Et' : ready ? 'Keşfi Tamamla (+40 XP)' : '2 Deneyi de Tamamla'}</span>
        </button>
      </div>
    </div>
  );
};
