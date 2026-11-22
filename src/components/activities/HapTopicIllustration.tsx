import React from 'react';
import { HapBilgiItem, SimulationType, UnitThemeId } from '../../types';

interface HapTopicIllustrationProps {
  simType: SimulationType;
  themeId: UnitThemeId;
  category?: HapBilgiItem['category'];
  title?: string;
  content?: string;
  size?: 'sm' | 'md';
}

const THEME_PALETTE: Record<
  UnitThemeId,
  {
    primary: string;
    secondary: string;
    soft: string;
    frame: string;
  }
> = {
  space: {
    primary: '#FBBF24',
    secondary: '#38BDF8',
    soft: 'rgba(251, 191, 36, 0.14)',
    frame: 'border-amber-400/30 bg-[#0D162B]',
  },
  force: {
    primary: '#34D399',
    secondary: '#FB923C',
    soft: 'rgba(52, 211, 153, 0.14)',
    frame: 'border-emerald-400/30 bg-[#0A1D18]',
  },
  life: {
    primary: '#22D3EE',
    secondary: '#E879F9',
    soft: 'rgba(34, 211, 238, 0.14)',
    frame: 'border-cyan-400/30 bg-[#17112D]',
  },
  light: {
    primary: '#FB7185',
    secondary: '#FBBF24',
    soft: 'rgba(251, 113, 133, 0.14)',
    frame: 'border-rose-400/30 bg-[#220E1A]',
  },
  matter: {
    primary: '#38BDF8',
    secondary: '#FB923C',
    soft: 'rgba(56, 189, 248, 0.14)',
    frame: 'border-sky-400/30 bg-[#101936]',
  },
  electric: {
    primary: '#FACC15',
    secondary: '#FB923C',
    soft: 'rgba(250, 204, 21, 0.14)',
    frame: 'border-yellow-400/30 bg-[#20180C]',
  },
  eco: {
    primary: '#2DD4BF',
    secondary: '#A3E635',
    soft: 'rgba(45, 212, 191, 0.14)',
    frame: 'border-teal-400/30 bg-[#0A2025]',
  },
};

type MotifKey =
  | SimulationType
  | 'scientist-lens'
  | 'telescope'
  | 'parachute'
  | 'thermometer'
  | 'battery-power'
  | 'recycle-leaf';

function resolveMotif(
  simType: SimulationType,
  category?: HapBilgiItem['category'],
  title = '',
  content = ''
): MotifKey {
  const text = `${title} ${content}`.toLocaleLowerCase('tr-TR');

  // Historical scientists / "Çağını Aşanlar" cards get a distinctive scientific instrument emblem
  if (
    category === 'cagini-asanlar' ||
    text.includes('galileo') ||
    text.includes('ibnülheysem') ||
    text.includes('ibni sina') ||
    text.includes('thales') ||
    text.includes('eratosthenes') ||
    text.includes('cabir') ||
    text.includes('democritus') ||
    text.includes('volta') ||
    text.includes('edison') ||
    text.includes('tesla') ||
    text.includes('sezerar') ||
    text.includes('ali kuşçu') ||
    text.includes('newton') ||
    text.includes('hooke')
  ) {
    if (
      simType === 'sun-spots' ||
      simType === 'moon-phases' ||
      simType === 'sun-earth-moon' ||
      text.includes('teleskop')
    ) {
      return 'telescope';
    }
    return 'scientist-lens';
  }

  // Specific concept keywords inside cards for richer visual variety
  if (simType === 'friction-lab' && (text.includes('paraşüt') || text.includes('hava direnci'))) {
    return 'parachute';
  }
  if (
    (simType === 'heat-exchange' || simType === 'phase-change') &&
    (text.includes('termometre') || text.includes('celsius') || text.includes('fahrenheit'))
  ) {
    return 'thermometer';
  }
  if (
    (simType === 'circuit-symbols' || simType === 'bulb-brightness') &&
    (text.includes('pil') || text.includes('enerji') || text.includes('batarya'))
  ) {
    return 'battery-power';
  }
  if (
    (simType === 'waste-sorting' || simType === 'zero-waste-hierarchy') &&
    (text.includes('sıfır atık') || text.includes('ağaç') || text.includes('doğa') || text.includes('kompost'))
  ) {
    return 'recycle-leaf';
  }

  return simType;
}

export const HapTopicIllustration: React.FC<HapTopicIllustrationProps> = ({
  simType,
  themeId,
  category,
  title,
  content,
  size = 'md',
}) => {
  const palette = THEME_PALETTE[themeId];
  const motif = resolveMotif(simType, category, title, content);
  const boxClass = size === 'sm' ? 'h-11 w-11 rounded-xl p-1.5' : 'h-14 w-14 rounded-2xl p-2';

  const renderSvg = () => {
    const p = palette.primary;
    const s = palette.secondary;

    switch (motif) {
      case 'sun-spots':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <circle cx="24" cy="24" r="11" fill={p} fillOpacity="0.22" stroke={p} strokeWidth="2" />
            <circle cx="20.5" cy="21.5" r="2.1" fill="#92400E" />
            <circle cx="27" cy="25.5" r="1.6" fill="#92400E" />
            <circle cx="23.5" cy="28" r="1.1" fill="#92400E" />
            <path
              d="M24 5v4M24 39v4M5 24h4M39 24h4M10.6 10.6l2.8 2.8M34.6 34.6l2.8 2.8M37.4 10.6l-2.8 2.8M13.4 34.6l-2.8 2.8"
              stroke={p}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M16 14a12 12 0 0 1 16 0" stroke={s} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 2" />
          </svg>
        );

      case 'moon-phases':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <circle cx="24" cy="24" r="17" stroke={s} strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 3" />
            <path
              d="M28.5 11.5A13 13 0 1 0 36.5 31a10.5 10.5 0 0 1-8-19.5Z"
              fill={p}
              fillOpacity="0.26"
              stroke={p}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="19" cy="23" r="2" fill={s} fillOpacity="0.6" />
            <circle cx="22.5" cy="29" r="1.4" fill={s} fillOpacity="0.55" />
            <circle cx="35" cy="14" r="2.2" fill={s} />
          </svg>
        );

      case 'sun-earth-moon':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <circle cx="24" cy="24" r="18" stroke={s} strokeOpacity="0.35" strokeWidth="1.4" strokeDasharray="3 3" />
            <circle cx="24" cy="24" r="7" fill={p} fillOpacity="0.3" stroke={p} strokeWidth="2" />
            <circle cx="38" cy="16" r="4.2" fill={s} fillOpacity="0.35" stroke={s} strokeWidth="1.8" />
            <circle cx="38" cy="16" r="8.5" stroke="#E2E8F0" strokeOpacity="0.35" strokeWidth="1.2" />
            <circle cx="43.5" cy="10" r="1.8" fill="#E2E8F0" />
            <path d="M10 34l3-1-1 3" stroke={p} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'dynamometer':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <circle cx="24" cy="7.5" r="2.5" stroke={p} strokeWidth="2" />
            <rect x="17" y="10" width="14" height="21" rx="4" fill={p} fillOpacity="0.16" stroke={p} strokeWidth="2" />
            <path
              d="M24 13l-2.5 2 5 2-5 2 5 2-2.5 2"
              stroke={s}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M27 16h3M27 20h3M27 24h3" stroke={p} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M24 31v4" stroke={p} strokeWidth="2" strokeLinecap="round" />
            <rect x="18.5" y="35" width="11" height="7" rx="2" fill={s} fillOpacity="0.28" stroke={s} strokeWidth="1.8" />
          </svg>
        );

      case 'mass-weight':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <path d="M24 10v28M16 38h16" stroke={p} strokeWidth="2" strokeLinecap="round" />
            <path d="M10 17l28-3" stroke={s} strokeWidth="2" strokeLinecap="round" />
            <path d="M12 17l-3.5 9h7L12 17Z" fill={p} fillOpacity="0.2" stroke={p} strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M36 14l-3.5 9h7L36 14Z" fill={s} fillOpacity="0.22" stroke={s} strokeWidth="1.7" strokeLinejoin="round" />
            <circle cx="24" cy="15.5" r="2.2" fill={p} />
          </svg>
        );

      case 'friction-lab':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <rect x="13" y="15" width="18" height="12" rx="3" fill={p} fillOpacity="0.22" stroke={p} strokeWidth="2" />
            <path d="M31 21h9m0 0-3-3m3 3-3 3" stroke={p} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 32H8m0 0 3-3m-3 3 3 3" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M6 29l4-2 4 2 4-2 4 2 4-2 4 2 4-2 4 2 4-2"
              stroke="#94A3B8"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'parachute':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <path
              d="M10 21a14 14 0 0 1 28 0H10Z"
              fill={s}
              fillOpacity="0.24"
              stroke={s}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M13 21l11 13M35 21L24 34M24 21v13" stroke={p} strokeWidth="1.5" />
            <rect x="20.5" y="34" width="7" height="6.5" rx="1.8" fill={p} fillOpacity="0.3" stroke={p} strokeWidth="1.8" />
            <path d="M9 36v-6m0 0-2 2m2-2 2 2M39 36v-6m0 0-2 2m2-2 2 2" stroke={p} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      case 'cell-explorer':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <rect x="8" y="10" width="32" height="28" rx="9" fill={p} fillOpacity="0.14" stroke={p} strokeWidth="2" />
            <circle cx="22" cy="23" r="6" fill={s} fillOpacity="0.28" stroke={s} strokeWidth="2" />
            <circle cx="22" cy="23" r="2" fill={s} />
            <ellipse cx="32.5" cy="18" rx="3.2" ry="1.8" transform="rotate(-25 32.5 18)" stroke={p} strokeWidth="1.6" />
            <ellipse cx="32" cy="29.5" rx="3.4" ry="2" transform="rotate(15 32 29.5)" fill={p} fillOpacity="0.26" stroke={p} strokeWidth="1.5" />
            <circle cx="14" cy="30" r="2" fill={p} fillOpacity="0.55" />
          </svg>
        );

      case 'cell-to-organism':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <rect x="7" y="31" width="6" height="9" rx="1.8" fill={p} fillOpacity="0.25" stroke={p} strokeWidth="1.6" />
            <rect x="15.5" y="26" width="6" height="14" rx="1.8" fill={p} fillOpacity="0.38" stroke={p} strokeWidth="1.6" />
            <rect x="24" y="20" width="6" height="20" rx="1.8" fill={s} fillOpacity="0.3" stroke={s} strokeWidth="1.6" />
            <rect x="32.5" y="13" width="8" height="27" rx="2.2" fill={s} fillOpacity="0.45" stroke={s} strokeWidth="1.8" />
            <path d="M9 24l10-7 8-5 7-4m0 0h-4.5m4.5 0v4.5" stroke={p} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'skeleton-motion':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <path
              d="M14 14a3.5 3.5 0 1 1 5-3.1l15.9 15.9a3.5 3.5 0 1 1-3.1 5 3.5 3.5 0 1 1-5 3.1L10.9 19a3.5 3.5 0 1 1 3.1-5Z"
              fill={p}
              fillOpacity="0.18"
              stroke={p}
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
            <path d="M27 11c5 1 9 5 10 10" stroke={s} strokeWidth="2" strokeLinecap="round" />
            <path d="M31 15c2.5.8 4.2 2.5 5 5" stroke={s} strokeOpacity="0.65" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        );

      case 'light-rays':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <circle cx="11" cy="24" r="4.5" fill={s} fillOpacity="0.35" stroke={s} strokeWidth="2" />
            <path d="M17 24h23m0 0-3-2.8m3 2.8-3 2.8" stroke={p} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 19l21-8m0 0-3.6-.5m3.6.5-1.9 3.2" stroke={s} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 29l21 8m0 0-1.9-3.2m1.9 3.2-3.6.5" stroke={s} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'light-transparency':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <rect x="21" y="9" width="6" height="30" rx="2" fill={p} fillOpacity="0.24" stroke={p} strokeWidth="1.8" />
            <path d="M7 16h14M27 16h14" stroke={s} strokeWidth="2" strokeLinecap="round" />
            <path d="M7 24h14" stroke={s} strokeWidth="2" strokeLinecap="round" />
            <path d="M27 24h13" stroke={s} strokeOpacity="0.55" strokeWidth="1.8" strokeDasharray="3 2.5" strokeLinecap="round" />
            <path d="M7 32h13" stroke={s} strokeWidth="2" strokeLinecap="round" />
            <path d="M31 29l6 6M37 29l-6 6" stroke={p} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        );

      case 'shadow-lab':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <circle cx="9.5" cy="24" r="3.5" fill={s} />
            <path d="M13 22l25-11M13 26l25 11" stroke={s} strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="22.5" cy="24" r="5.5" fill="#0F172A" stroke={p} strokeWidth="2" />
            <rect x="37" y="9" width="3.5" height="30" rx="1.7" fill="#334155" />
            <rect x="37" y="15" width="3.5" height="18" rx="1.5" fill={p} />
          </svg>
        );

      case 'particle-states':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            {/* Solid grid */}
            <circle cx="11" cy="18" r="2.3" fill={p} />
            <circle cx="16.5" cy="18" r="2.3" fill={p} />
            <circle cx="11" cy="23.5" r="2.3" fill={p} />
            <circle cx="16.5" cy="23.5" r="2.3" fill={p} />
            <circle cx="11" cy="29" r="2.3" fill={p} />
            <circle cx="16.5" cy="29" r="2.3" fill={p} />
            {/* Gas spread */}
            <circle cx="28" cy="14" r="2.4" fill={s} fillOpacity="0.85" />
            <circle cx="37" cy="20" r="2.4" fill={s} fillOpacity="0.85" />
            <circle cx="27" cy="26" r="2.4" fill={s} fillOpacity="0.85" />
            <circle cx="36" cy="33" r="2.4" fill={s} fillOpacity="0.85" />
            <path d="M21 24h3" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      case 'heat-exchange':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <rect x="7" y="15" width="12" height="18" rx="3" fill={s} fillOpacity="0.3" stroke={s} strokeWidth="2" />
            <rect x="29" y="15" width="12" height="18" rx="3" fill={p} fillOpacity="0.25" stroke={p} strokeWidth="2" />
            <path d="M20 21h8m0 0-2.5-2.5M28 21l-2.5 2.5" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 27h8m0 0-2.5-2.5M28 27l-2.5 2.5" stroke={p} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'thermometer':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <path
              d="M21 11a3 3 0 0 1 6 0v17.2a6.5 6.5 0 1 1-6 0V11Z"
              fill={p}
              fillOpacity="0.16"
              stroke={p}
              strokeWidth="2"
            />
            <circle cx="24" cy="33.5" r="3.4" fill={s} />
            <path d="M24 19v13" stroke={s} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M30 14h4M30 19h3M30 24h4" stroke={p} strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        );

      case 'phase-change':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <rect x="8" y="25" width="10" height="10" rx="2" fill={p} fillOpacity="0.28" stroke={p} strokeWidth="1.8" />
            <path
              d="M24 22c2.8 4 4.2 6.5 4.2 8.8a4.2 4.2 0 1 1-8.4 0c0-2.3 1.4-4.8 4.2-8.8Z"
              fill={p}
              fillOpacity="0.35"
              stroke={p}
              strokeWidth="1.8"
            />
            <path
              d="M32 18c0-2.2 1.8-4 4-4 1.8 0 3.4 1.2 3.8 2.9 1.3.4 2.2 1.5 2.2 2.9 0 1.7-1.3 3-3 3h-6c-1.7 0-3-1.3-3-3 0-1 .5-1.8 1.3-2.3"
              fill={s}
              fillOpacity="0.22"
              stroke={s}
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path d="M15 19c4-5 11-7 17-4" stroke={s} strokeWidth="1.7" strokeLinecap="round" />
            <path d="M30 12.5l2.5 2.6-3.4.9" stroke={s} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'heat-insulation':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <path
              d="M9 23 24 10l15 13v15a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V23Z"
              fill={p}
              fillOpacity="0.16"
              stroke={p}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M14 23l10-8.5L34 23v12H14V23Z" stroke={s} strokeWidth="1.8" strokeDasharray="3 2" strokeLinejoin="round" />
            <circle cx="24" cy="27.5" r="3.2" fill={s} fillOpacity="0.45" stroke={s} strokeWidth="1.6" />
          </svg>
        );

      case 'circuit-symbols':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <rect x="9" y="13" width="30" height="22" rx="4" stroke={p} strokeOpacity="0.65" strokeWidth="1.8" />
            {/* Bulb symbol ⊗ */}
            <circle cx="24" cy="13" r="5" fill="#17120A" stroke={p} strokeWidth="1.9" />
            <path d="M21 10l6 6M27 10l-6 6" stroke={p} strokeWidth="1.6" strokeLinecap="round" />
            {/* Battery symbol on bottom */}
            <rect x="19" y="31" width="10" height="8" fill="#17120A" />
            <path d="M21.5 31v8M26.5 33v4" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        );

      case 'bulb-brightness':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <path
              d="M17.5 23.5a6.5 6.5 0 1 1 13 0c0 2.5-1.4 4.2-2.5 5.8-.5.7-.8 1.5-.8 2.2h-6.4c0-.7-.3-1.5-.8-2.2-1.1-1.6-2.5-3.3-2.5-5.8Z"
              fill={p}
              fillOpacity="0.3"
              stroke={p}
              strokeWidth="2"
            />
            <path d="M20.5 35h7M21.5 38.5h5" stroke={s} strokeWidth="2" strokeLinecap="round" />
            <path
              d="M24 7v3.5M10.5 13.5l2.5 2.5M37.5 13.5 35 16M7 24h3.5M37.5 24H41"
              stroke={p}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'battery-power':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <rect x="9" y="15" width="27" height="18" rx="4" fill={p} fillOpacity="0.16" stroke={p} strokeWidth="2" />
            <path d="M36 20h3a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 39 28h-3" fill={p} />
            <path d="M23.5 18.5 18.5 25h4l-1 5 5.5-7h-4l.5-4.5Z" fill={s} stroke={s} strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        );

      case 'waste-sorting':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <path
              d="M21 12l3-4 5 8m-3-1 3 1 1-3M35 28l3 5-9 .2m2-2-2 2.2 2 2M14 33l-5-.2 4.5-8m-2.7 1.2 2.7-1.2.8 2.8"
              stroke={p}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="25" r="5" fill={s} fillOpacity="0.28" stroke={s} strokeWidth="1.8" />
          </svg>
        );

      case 'zero-waste-hierarchy':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <rect x="8" y="11" width="32" height="6" rx="2" fill={s} fillOpacity="0.35" stroke={s} strokeWidth="1.7" />
            <rect x="12" y="20" width="24" height="6" rx="2" fill={p} fillOpacity="0.32" stroke={p} strokeWidth="1.7" />
            <rect x="16" y="29" width="16" height="6" rx="2" fill={p} fillOpacity="0.18" stroke={p} strokeWidth="1.7" />
            <path d="M21 38h6" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        );

      case 'recycle-leaf':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <path
              d="M12 34c1-13 10-21 24-22-1 14-9 23-22 24"
              fill={s}
              fillOpacity="0.24"
              stroke={s}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M11 37c4-6 10-12 18-17" stroke={p} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'telescope':
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <path
              d="M11 24l22-10 4 8.5L15 32.5 11 24Z"
              fill={p}
              fillOpacity="0.22"
              stroke={p}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M23 28.5 18 39M23 28.5 29 39M23 28.5V39" stroke={s} strokeWidth="1.9" strokeLinecap="round" />
            <circle cx="38" cy="11" r="2" fill={s} />
          </svg>
        );

      case 'scientist-lens':
      default:
        return (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" aria-hidden="true">
            <circle cx="21" cy="21" r="10.5" fill={p} fillOpacity="0.18" stroke={p} strokeWidth="2" />
            <path d="M29 29l9 9" stroke={s} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M17 18.5c1.2-1.8 3.2-2.7 5.2-2.4" stroke={s} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="21" cy="21" r="3" fill={s} fillOpacity="0.4" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`shrink-0 flex items-center justify-center border ${palette.frame} ${boxClass}`}
      style={{ boxShadow: `inset 0 0 18px ${palette.soft}` }}
    >
      {renderSvg()}
    </div>
  );
};
