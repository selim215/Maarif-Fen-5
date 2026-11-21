import React, { useEffect, useRef, useState } from 'react';
import { Check, Eye, Pause, Play, ShieldCheck, Sparkles } from 'lucide-react';
import { soundEngine } from '../../utils/sound';

interface SimProps {
  onComplete: () => void;
  isCompleted: boolean;
}

// ---------------------------------------------------------------------------
// 1.1 GÜNEŞ LEKESİ GÖZLEMİ (Sun Spots & Counter-Clockwise Rotation)
// ---------------------------------------------------------------------------
export const SunSpotsSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [day, setDay] = useState(1);
  const [filterOn, setFilterOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [visitedFilter, setVisitedFilter] = useState(false);
  const [rotatedEnough, setRotatedEnough] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setDay((prev) => {
        const next = prev >= 14 ? 1 : prev + 1;
        if (next >= 8) setRotatedEnough(true);
        return next;
      });
    }, 520);
    return () => window.clearInterval(id);
  }, [playing]);

  const progress = (day - 1) / 13; // 0 to 1 (left/west to right/east across visible disk)
  const spots = [
    { label: 'A', baseX: -52, y: -24, r: 5.5 },
    { label: 'B', baseX: -36, y: 2, r: 7 },
    { label: 'C', baseX: -48, y: 26, r: 5 },
  ];

  const tasksDone = [visitedFilter, rotatedEnough].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-[#070B16] p-4">
        <div className="mb-3 flex items-center justify-between text-xs text-slate-300">
          <span className="font-medium text-amber-300">
            {filterOn ? 'Güneş Filtresi Açık · Güvenli Gözlem' : 'Uyarı: Doğrudan bakma, filtreyi tak!'}
          </span>
          <span className="tabular-nums text-slate-400">{day}. Gözlem Günü</span>
        </div>

        <div className="relative mx-auto flex aspect-[16/10] max-w-md items-center justify-center">
          <svg viewBox="0 0 320 200" className="h-full w-full select-none">
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={filterOn ? '#F59E0B' : '#FEF08A'} />
                <stop offset="68%" stopColor={filterOn ? '#D97706' : '#F59E0B'} />
                <stop offset="92%" stopColor={filterOn ? '#B45309' : '#EA580C'} />
                <stop offset="100%" stopColor="rgba(234,88,12,0)" />
              </radialGradient>
              <radialGradient id="sunCore" cx="38%" cy="35%" r="65%">
                <stop offset="0%" stopColor={filterOn ? '#FDE047' : '#FFFFFF'} />
                <stop offset="55%" stopColor={filterOn ? '#F59E0B' : '#FDE047'} />
                <stop offset="100%" stopColor={filterOn ? '#B45309' : '#F97316'} />
              </radialGradient>
              <clipPath id="sunDiskClip">
                <circle cx="160" cy="100" r="68" />
              </clipPath>
            </defs>

            {/* Corona halo */}
            <circle cx="160" cy="100" r={filterOn ? 82 : 95} fill="url(#sunGlow)" opacity={filterOn ? 0.45 : 0.85} />

            {/* Sun disk */}
            <circle cx="160" cy="100" r="68" fill="url(#sunCore)" />

            {/* Direction arrow: West -> East */}
            <path
              d="M 102 180 Q 160 192 218 180"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <polygon points="222,179 213,174 215,184" fill="#38BDF8" />
            <text x="160" y="196" textAnchor="middle" fill="#BAE6FD" fontSize="10" fontWeight="600">
              Batı → Doğu (Saat Yönünün Tersi)
            </text>

            {/* Sunspots moving West -> East */}
            <g clipPath="url(#sunDiskClip)">
              {spots.map((spot) => {
                const offsetX = spot.baseX + progress * 98;
                const distRatio = Math.min(1, Math.abs(offsetX) / 68);
                const foreshorten = Math.max(0.35, Math.sqrt(1 - distRatio * distRatio));
                return (
                  <g key={spot.label} opacity={filterOn ? 0.95 : 0.16}>
                    <ellipse
                      cx={160 + offsetX}
                      cy={100 + spot.y}
                      rx={spot.r * foreshorten}
                      ry={spot.r}
                      fill="#291202"
                    />
                    {filterOn && (
                      <text
                        x={160 + offsetX}
                        y={100 + spot.y - spot.r - 4}
                        textAnchor="middle"
                        fill="#FEF3C7"
                        fontSize="11"
                        fontWeight="700"
                      >
                        {spot.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {!filterOn && (
              <g>
                <rect x="64" y="82" width="192" height="36" rx="10" fill="rgba(15,23,42,0.82)" />
                <text x="160" y="104" textAnchor="middle" fill="#FDE68A" fontSize="11.5" fontWeight="600">
                  Çok parlak! Filtreyi açıp lekeleri gör
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Touch controls */}
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setFilterOn((v) => !v);
                setVisitedFilter(true);
              }}
              className={`min-h-[44px] flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                filterOn
                  ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200'
                  : 'border-amber-400/50 bg-amber-500/20 text-amber-200'
              }`}
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">{filterOn ? 'Filtre Takılı ✓' : 'Güneş Filtresi Tak'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setPlaying((p) => !p);
                if (!filterOn) {
                  setFilterOn(true);
                  setVisitedFilter(true);
                }
              }}
              className="min-h-[44px] rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-[0.98] flex items-center gap-2"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span className="whitespace-nowrap">{playing ? 'Duraklat' : 'Döndür'}</span>
            </button>
          </div>

          <div className="rounded-xl bg-slate-900/80 p-3">
            <div className="mb-1.5 flex items-center justify-between text-xs text-slate-300">
              <span>Gözlem Gününü Sürükle</span>
              <span className="tabular-nums font-semibold text-amber-300">Gün {day} / 14</span>
            </div>
            <input
              type="range"
              min={1}
              max={14}
              value={day}
              aria-label="Güneş gözlem günü"
              onChange={(e) => {
                const v = Number(e.target.value);
                setDay(v);
                if (v >= 8) setRotatedEnough(true);
              }}
              className="h-3 w-full cursor-pointer accent-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Discovery checklist & Complete CTA */}
      <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-semibold text-slate-100">Keşif Görevleri</span>
          <span className="tabular-nums text-amber-300">{tasksDone} / 2 tamamlandı</span>
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-slate-200">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${visitedFilter ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              {visitedFilter ? <Check className="h-3.5 w-3.5" /> : '1'}
            </span>
            <span>Teleskoba güvenli Güneş filtresini tak</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${rotatedEnough ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              {rotatedEnough ? <Check className="h-3.5 w-3.5" /> : '2'}
            </span>
            <span>Güneş’i en az 8. güne kadar döndürüp lekelerin kayışını gözle</span>
          </div>
        </div>

        <button
          type="button"
          disabled={!isCompleted && tasksDone < 2}
          onClick={() => {
            soundEngine.playUnlock();
            onComplete();
          }}
          className={`min-h-[48px] w-full rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            isCompleted || tasksDone >= 2
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              : 'bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{isCompleted ? 'Keşif Tamamlandı · Devam Et' : tasksDone >= 2 ? 'Keşfi Tamamla (+40 XP)' : '2 Görevi Tamamla'}</span>
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 1.2 AY'IN EVRELERİ DOKUNMATİK YÖRÜNGE ŞEMASI (Hand-Draggable Moon!)
// ---------------------------------------------------------------------------
function getMoonPhaseInfo(angleDeg: number) {
  // Sun is on the LEFT (180 deg in SVG coords, where 0 is right, 90 is bottom, 180 is left, 270 is top)
  // Let's normalize phaseDeg so:
  // 0 deg   = Yeni Ay (Moon between Sun & Earth -> left side of Earth)
  // 90 deg  = İlk Dördün (bottom of Earth, CCW from top)
  // 180 deg = Dolunay (right side of Earth)
  // 270 deg = Son Dördün (top of Earth)
  const norm = ((angleDeg % 360) + 360) % 360;
  const day = ((norm / 360) * 29.5).toFixed(1);

  if (norm < 22.5 || norm >= 337.5) {
    return {
      key: 'yeni-ay',
      name: 'Yeni Ay',
      type: 'Ana Evre',
      day,
      desc: 'Ay, Güneş ile Dünya arasındadır. Bize bakan yüzü ışık almaz, karanlık görünür.',
    };
  }
  if (norm < 67.5) {
    return {
      key: 'hilal-1',
      name: 'Hilal (Ters C)',
      type: 'Ara Evre',
      day,
      desc: 'Yeni Ay’dan sonra sağ kenarı incecik aydınlanır, "ters C" harfine benzer.',
    };
  }
  if (norm < 112.5) {
    return {
      key: 'ilk-dordun',
      name: 'İlk Dördün (D)',
      type: 'Ana Evre',
      day,
      desc: 'Yeni Ay’dan yaklaşık 1 hafta sonra sağ yarısı aydınlanır, "D" harfi gibi görünür.',
    };
  }
  if (norm < 157.5) {
    return {
      key: 'siskin-1',
      name: 'Şişkin Ay',
      type: 'Ara Evre',
      day,
      desc: 'İlk Dördün ile Dolunay arasındaki ara evredir; büyük kısmı aydınlıktır.',
    };
  }
  if (norm < 202.5) {
    return {
      key: 'dolunay',
      name: 'Dolunay',
      type: 'Ana Evre',
      day,
      desc: 'Dünya, Güneş ile Ay arasındadır. Ay’ın bize bakan yüzü tamamen parlak görünür!',
    };
  }
  if (norm < 247.5) {
    return {
      key: 'siskin-2',
      name: 'Şişkin Ay',
      type: 'Ara Evre',
      day,
      desc: 'Dolunay’dan Son Dördün’e geçerken görülen ara evredir.',
    };
  }
  if (norm < 292.5) {
    return {
      key: 'son-dordun',
      name: 'Son Dördün (Ters D)',
      type: 'Ana Evre',
      day,
      desc: 'Dolunay’dan 1 hafta sonra sol yarısı aydınlanır, "ters D" harfi gibi görünür.',
    };
  }
  return {
    key: 'hilal-2',
    name: 'Hilal (C)',
    type: 'Ara Evre',
    day,
    desc: 'Yeni Ay’dan önceki bu evrede Ay, bayrağımızdaki gibi "C" harfine benzer.',
  };
}

// Accurate SVG Moon Phase icon for "Dünya'dan Görünüm"
const MoonPhaseVisual: React.FC<{ phaseDeg: number }> = ({ phaseDeg }) => {
  const norm = ((phaseDeg % 360) + 360) % 360;
  const rad = (norm * Math.PI) / 180;
  const r = 34;
  // waxing: 0..180 (right side lit), waning: 180..360 (left side lit)
  const isWaxing = norm <= 180;
  const cosVal = Math.cos(rad); // 1 at 0 (new), 0 at 90 (first q), -1 at 180 (full)
  const rx = Math.abs(cosVal) * r;

  // Build lit path on circle centered at (40,40), r=34
  let litPath = '';
  if (norm < 3 || norm > 357) {
    litPath = '';
  } else if (Math.abs(norm - 180) < 3) {
    litPath = `M 40 ${40 - r} A ${r} ${r} 0 1 1 40 ${40 + r} A ${r} ${r} 0 1 1 40 ${40 - r} Z`;
  } else if (isWaxing) {
    // Right semicircle lit + terminator curve
    const sweepTerm = norm < 90 ? 0 : 1;
    litPath = `M 40 ${40 - r} A ${r} ${r} 0 0 1 40 ${40 + r} A ${rx} ${r} 0 0 ${sweepTerm} 40 ${40 - r} Z`;
  } else {
    // Left semicircle lit + terminator curve
    const sweepTerm = norm < 270 ? 0 : 1;
    litPath = `M 40 ${40 - r} A ${r} ${r} 0 0 0 40 ${40 + r} A ${rx} ${r} 0 0 ${sweepTerm} 40 ${40 - r} Z`;
  }

  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0">
      <circle cx="40" cy="40" r={r} fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
      {litPath && <path d={litPath} fill="#F8FAFC" />}
      {/* Subtle craters */}
      <circle cx="31" cy="29" r="4" fill="rgba(100,116,139,0.22)" />
      <circle cx="49" cy="45" r="5.5" fill="rgba(100,116,139,0.2)" />
      <circle cx="36" cy="52" r="3" fill="rgba(100,116,139,0.18)" />
    </svg>
  );
};

export const MoonPhasesSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  // phaseDeg: 0 = Yeni Ay (left, between Sun & Earth), 90 = İlk Dördün (bottom), 180 = Dolunay (right), 270 = Son Dördün (top)
  const [phaseDeg, setPhaseDeg] = useState(0);
  const [discoveredMain, setDiscoveredMain] = useState<string[]>(['yeni-ay']);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const info = getMoonPhaseInfo(phaseDeg);

  useEffect(() => {
    const mains = ['yeni-ay', 'ilk-dordun', 'dolunay', 'son-dordun'];
    if (mains.includes(info.key)) {
      setDiscoveredMain((prev) => (prev.includes(info.key) ? prev : [...prev, info.key]));
    }
  }, [info.key]);

  // Convert phaseDeg (0=left, 90=bottom CCW) into SVG coordinates centered at (185, 115), orbit radius 76
  const cx = 185;
  const cy = 115;
  const orbitR = 76;
  // In SVG (y down): left is PI, bottom is PI/2, right is 0, top is -PI/2
  // So svgRad = PI - (phaseDeg * PI / 180)
  const svgRad = Math.PI - (phaseDeg * Math.PI) / 180;
  const moonX = cx + Math.cos(svgRad) * orbitR;
  const moonY = cy + Math.sin(svgRad) * orbitR;

  const updateAngleFromPointer = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = 320 / rect.width;
    const scaleY = 230 / rect.height;
    const px = (clientX - rect.left) * scaleX;
    const py = (clientY - rect.top) * scaleY;
    const rad = Math.atan2(py - cy, px - cx); // -PI..PI
    const deg = ((Math.PI - rad) * 180) / Math.PI;
    setPhaseDeg(((deg % 360) + 360) % 360);
  };

  const quickPhases = [
    { label: 'Yeni Ay', deg: 0, key: 'yeni-ay' },
    { label: 'İlk Dördün', deg: 90, key: 'ilk-dordun' },
    { label: 'Dolunay', deg: 180, key: 'dolunay' },
    { label: 'Son Dördün', deg: 270, key: 'son-dordun' },
  ];

  // Angle from Moon pointing directly at Earth so the student sees the same face always points to Earth!
  const faceAngleDeg = (Math.atan2(cy - moonY, cx - moonX) * 180) / Math.PI;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-700/80 bg-[#070B16] p-3.5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold text-sky-300">Ay’ı parmağınla yörüngede sürükle!</span>
          <span className="tabular-nums text-slate-400">Gün {info.day} / 29,5</span>
        </div>

        {/* Interactive Orbit SVG */}
        <svg
          ref={svgRef}
          viewBox="0 0 320 230"
          className="h-auto w-full touch-none select-none cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragging(true);
            updateAngleFromPointer(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (!dragging) return;
            updateAngleFromPointer(e.clientX, e.clientY);
          }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
        >
          <defs>
            <linearGradient id="sunRays" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="sunEdge" cx="0%" cy="50%" r="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="65%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </radialGradient>
          </defs>

          {/* Sunlight beams from left */}
          <rect x="24" y="18" width="90" height="194" fill="url(#sunRays)" />
          {[42, 82, 115, 148, 188].map((ry) => (
            <line key={ry} x1="34" y1={ry} x2="78" y2={ry} stroke="#FCD34D" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
          ))}

          {/* Sun on left edge */}
          <circle cx="-16" cy="115" r="54" fill="url(#sunEdge)" />
          <text x="15" y="119" fill="#451A03" fontSize="10" fontWeight="800" transform="rotate(-90 15 119)" textAnchor="middle">
            GÜNEŞ
          </text>

          {/* Orbit track */}
          <circle cx={cx} cy={cy} r={orbitR} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5 5" />

          {/* Direction hint */}
          <text x={cx} y="22" textAnchor="middle" fill="#94A3B8" fontSize="9.5">
            Saat yönünün tersine dolanır ↺
          </text>

          {/* 4 Main Phase Guide Dots */}
          {quickPhases.map((qp) => {
            const qRad = Math.PI - (qp.deg * Math.PI) / 180;
            const qx = cx + Math.cos(qRad) * orbitR;
            const qy = cy + Math.sin(qRad) * orbitR;
            const found = discoveredMain.includes(qp.key);
            return (
              <circle
                key={qp.key}
                cx={qx}
                cy={qy}
                r="4"
                fill={found ? '#34D399' : '#475569'}
              />
            );
          })}

          {/* Earth at center (left half lit, right half shadow) */}
          <g>
            <circle cx={cx} cy={cy} r="25" fill="#0284C7" />
            <path d={`M ${cx} ${cy - 25} A 25 25 0 0 1 ${cx} ${cy + 25} Z`} fill="#0F172A" opacity="0.62" />
            <circle cx={cx - 7} cy={cy - 6} r="6" fill="#22C55E" opacity="0.85" />
            <circle cx={cx + 5} cy={cy + 6} r="5" fill="#16A34A" opacity="0.5" />
            <circle cx={cx} cy={cy} r="25" fill="none" stroke="#7DD3FC" strokeWidth="1.5" />
            <text x={cx} y={cy + 39} textAnchor="middle" fill="#E2E8F0" fontSize="10" fontWeight="700">
              DÜNYA
            </text>
          </g>

          {/* Draggable Moon */}
          <g>
            {/* Large touch glow ring */}
            <circle cx={moonX} cy={moonY} r="24" fill="#38BDF8" opacity={dragging ? 0.25 : 0.12} />
            {/* Moon dark body */}
            <circle cx={moonX} cy={moonY} r="14" fill="#334155" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Left half always illuminated by Sun */}
            <path
              d={`M ${moonX} ${moonY - 14} A 14 14 0 0 0 ${moonX} ${moonY + 14} Z`}
              fill="#F8FAFC"
            />
            {/* Red flag marker proving the SAME face always points toward Earth */}
            <g transform={`translate(${moonX}, ${moonY}) rotate(${faceAngleDeg})`}>
              <line x1="0" y1="0" x2="14" y2="0" stroke="#F59E0B" strokeWidth="2.5" />
              <circle cx="14" cy="0" r="2.8" fill="#F59E0B" />
            </g>
          </g>
        </svg>

        {/* Live View from Earth Box */}
        <div className="mt-2 flex items-center gap-3.5 rounded-xl border border-slate-700/80 bg-slate-900/90 p-3">
          <MoonPhaseVisual phaseDeg={phaseDeg} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Eye className="h-3.5 w-3.5 text-sky-400" />
              <span>Dünya’dan Görünüm · {info.type}</span>
            </div>
            <h4 className="mt-0.5 font-display text-lg font-bold text-white">{info.name}</h4>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-300">{info.desc}</p>
          </div>
        </div>

        {/* Quick phase jump buttons */}
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {quickPhases.map((qp) => {
            const active = info.key === qp.key;
            const found = discoveredMain.includes(qp.key);
            return (
              <button
                key={qp.key}
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setPhaseDeg(qp.deg);
                }}
                className={`min-h-[44px] rounded-xl border px-1.5 py-2 text-[11px] font-semibold transition-all active:scale-95 ${
                  active
                    ? 'border-amber-400 bg-amber-500 text-slate-950'
                    : found
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                    : 'border-slate-700 bg-slate-800/80 text-slate-300'
                }`}
              >
                {qp.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-center text-[11px] text-amber-300/90">
          Turuncu işaret çubuğuna bak: Ay’ın hep aynı yüzü Dünya’ya dönük kalır!
        </p>
      </div>

      {/* Discovery progress */}
      <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-100">4 Ana Evreyi Keşfet</span>
          <span className="tabular-nums font-semibold text-emerald-400">{discoveredMain.length} / 4</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-300"
            style={{ width: `${(discoveredMain.length / 4) * 100}%` }}
          />
        </div>
        <button
          type="button"
          disabled={!isCompleted && discoveredMain.length < 4}
          onClick={() => {
            soundEngine.playUnlock();
            onComplete();
          }}
          className={`min-h-[48px] w-full rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            isCompleted || discoveredMain.length >= 4
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              : 'bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>
            {isCompleted
              ? 'Keşif Tamamlandı · Devam Et'
              : discoveredMain.length >= 4
              ? 'Keşfi Tamamla (+40 XP)'
              : `${4 - discoveredMain.length} Ana Evre Daha Keşfet`}
          </span>
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 1.3 GÜNEŞ, DÜNYA VE AY'IN BİRBİRLERİNE GÖRE HAREKETLERİ (Simultaneous 3-Body)
// ---------------------------------------------------------------------------
export const SunEarthMoonSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [dayOfYear, setDayOfYear] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<1 | 3>(1);
  const [showArrows, setShowArrows] = useState(true);
  const [showFruitScale, setShowFruitScale] = useState(false);
  const [checkedFruit, setCheckedFruit] = useState(false);
  const [maxDaySeen, setMaxDaySeen] = useState(0);

  useEffect(() => {
    if (!playing) return;
    let frameId = 0;
    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setDayOfYear((prev) => {
        const next = (prev + dt * 18 * speed) % 365;
        setMaxDaySeen((m) => Math.max(m, next));
        return next;
      });
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [playing, speed]);

  // Counter-clockwise angles in SVG (subtract angle because y grows down)
  const earthAngleRad = -(dayOfYear / 365) * Math.PI * 2;
  const earthOrbitRx = 112;
  const earthOrbitRy = 74;
  const sunX = 160;
  const sunY = 112;
  const earthX = sunX + Math.cos(earthAngleRad) * earthOrbitRx;
  const earthY = sunY + Math.sin(earthAngleRad) * earthOrbitRy;

  // Moon orbits Earth ~12.4 times per year counter-clockwise
  const moonAngleRad = -(dayOfYear / 29.5) * Math.PI * 2;
  const moonOrbitR = 26;
  const moonX = earthX + Math.cos(moonAngleRad) * moonOrbitR;
  const moonY = earthY + Math.sin(moonAngleRad) * moonOrbitR;

  const moonOrbitsCompleted = Math.floor(dayOfYear / 29.5);
  const ready = maxDaySeen >= 45 && checkedFruit;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-700/80 bg-[#070B16] p-3.5">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
          <span className="font-semibold text-amber-300">Üçlü Hareket Simülasyonu</span>
          <span className="tabular-nums text-sky-300">
            Gün {Math.floor(dayOfYear)} · Ay Turu: {moonOrbitsCompleted}
          </span>
        </div>

        <svg viewBox="0 0 320 224" className="h-auto w-full select-none">
          <defs>
            <radialGradient id="centerSun" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="65%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </radialGradient>
          </defs>

          {/* Earth's elliptical orbit around Sun */}
          <ellipse cx={sunX} cy={sunY} rx={earthOrbitRx} ry={earthOrbitRy} fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="5 4" />

          {/* Direction arrows if enabled */}
          {showArrows && (
            <g fill="#38BDF8" stroke="#38BDF8">
              <text x="160" y="24" textAnchor="middle" stroke="none" fontSize="10" fontWeight="600" fill="#7DD3FC">
                ↺ Tüm hareketler saat yönünün tersinedir
              </text>
              <polygon points="154,38 164,33 164,43" />
              <polygon points="166,186 156,181 156,191" />
            </g>
          )}

          {/* Sun */}
          <circle cx={sunX} cy={sunY} r="32" fill="#F59E0B" opacity="0.2" />
          <circle cx={sunX} cy={sunY} r="24" fill="url(#centerSun)" />
          <text x={sunX} y={sunY + 3.5} textAnchor="middle" fill="#451A03" fontSize="9.5" fontWeight="800">
            GÜNEŞ
          </text>

          {/* Moon's orbit around Earth */}
          <circle cx={earthX} cy={earthY} r={moonOrbitR} fill="none" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" />

          {/* Earth */}
          <g transform={`translate(${earthX}, ${earthY})`}>
            <circle r="11" fill="#0284C7" stroke="#BAE6FD" strokeWidth="1.2" />
            <circle cx="-3" cy="-2" r="3.5" fill="#22C55E" />
            <circle cx="4" cy="3" r="2.5" fill="#16A34A" />
          </g>

          {/* Moon */}
          <circle cx={moonX} cy={moonY} r="4.8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
        </svg>

        {/* Controls */}
        <div className="mt-2 space-y-2.5">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setPlaying((p) => !p);
              }}
              className="min-h-[44px] rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white flex items-center justify-center gap-1.5 active:scale-95"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{playing ? 'Durdur' : 'Oynat'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setSpeed((s) => (s === 1 ? 3 : 1));
              }}
              className="min-h-[44px] rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-amber-300 active:scale-95"
            >
              Hız: {speed}×
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setShowArrows((a) => !a);
              }}
              className={`min-h-[44px] rounded-xl border px-2 py-2 text-xs font-semibold active:scale-95 ${
                showArrows ? 'border-sky-400/50 bg-sky-500/20 text-sky-200' : 'border-slate-700 bg-slate-800 text-slate-300'
              }`}
            >
              Yön Okları
            </button>
          </div>

          <div className="rounded-xl bg-slate-900/80 p-3">
            <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
              <span>Yıl İçinde İlerlet (365 Gün 6 Saat)</span>
              <span className="tabular-nums font-semibold text-amber-300">{Math.floor(dayOfYear)}. Gün</span>
            </div>
            <input
              type="range"
              min={0}
              max={364}
              value={Math.floor(dayOfYear)}
              aria-label="Yıl içindeki gün"
              onChange={(e) => {
                setPlaying(false);
                const val = Number(e.target.value);
                setDayOfYear(val);
                setMaxDaySeen((m) => Math.max(m, val));
              }}
              className="h-3 w-full cursor-pointer accent-amber-400"
            />
          </div>

          {/* Fruit volume model toggle */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playFlip();
              setShowFruitScale((v) => !v);
              setCheckedFruit(true);
            }}
            className="min-h-[44px] w-full rounded-xl border border-amber-400/40 bg-amber-500/15 px-3 py-2.5 text-xs font-semibold text-amber-200 active:scale-[0.98]"
          >
            {showFruitScale ? 'Hacim Modelini Gizle' : 'Hacimsel Büyüklük Modelini İncele (Karpuz · Elma · Erik)'}
          </button>

          {showFruitScale && (
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-center">
              <div className="flex flex-col items-center justify-end gap-1.5">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-300 to-orange-600 shadow-inner" />
                <div className="text-xs font-bold text-amber-300">Güneş</div>
                <div className="text-[11px] text-slate-400">Karpuz</div>
              </div>
              <div className="flex flex-col items-center justify-end gap-1.5">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-emerald-500" />
                <div className="text-xs font-bold text-sky-300">Dünya</div>
                <div className="text-[11px] text-slate-400">Elma</div>
              </div>
              <div className="flex flex-col items-center justify-end gap-1.5">
                <div className="h-4 w-4 rounded-full bg-gradient-to-br from-slate-200 to-slate-500" />
                <div className="text-xs font-bold text-slate-200">Ay</div>
                <div className="text-[11px] text-slate-400">Erik</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Complete Card */}
      <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 space-y-3">
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-slate-200">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${maxDaySeen >= 45 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              {maxDaySeen >= 45 ? <Check className="h-3.5 w-3.5" /> : '1'}
            </span>
            <span>Dünya ve Ay’ın birlikte dolanmasını en az 45 gün izle</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${checkedFruit ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              {checkedFruit ? <Check className="h-3.5 w-3.5" /> : '2'}
            </span>
            <span>Hacimsel Büyüklük Modelini (Karpuz–Elma–Erik) incele</span>
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
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              : 'bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{isCompleted ? 'Keşif Tamamlandı · Devam Et' : ready ? 'Keşfi Tamamla (+40 XP)' : 'Görevleri Tamamla'}</span>
        </button>
      </div>
    </div>
  );
};
