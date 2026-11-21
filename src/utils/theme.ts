import { UnitThemeId } from '../types';

export interface ThemeTokens {
  isDark: boolean;
  pageBg: string;
  headerBg: string;
  drawerBg: string;
  modalBg: string;
  surface: string;
  surfaceSubtle: string;
  cardFrontBg: string;
  cardBackBg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primaryBtn: string;
  primaryText: string;
  primarySoft: string;
  accentText: string;
  accentBg: string;
  lineColor: string;
  lineDoneColor: string;
  ringColor: string;
}

export const UNIT_THEMES: Record<UnitThemeId, ThemeTokens> = {
  // 1. Ünite: Derin Gece Laciverti & Altın Sarısı (Uzay)
  space: {
    isDark: true,
    pageBg: 'bg-[#0B1120] space-starfield text-slate-100',
    headerBg: 'bg-[#0B1120]/90 border-slate-800/80 text-slate-100',
    drawerBg: 'border-slate-800 bg-[#0E1629] text-slate-100',
    modalBg: 'border-slate-700 bg-[#131C31] text-slate-100',
    surface: 'bg-[#131C31] border-slate-800 text-slate-100',
    surfaceSubtle: 'bg-[#1A2540]/90 border-slate-700/70 text-slate-200',
    cardFrontBg: 'border-slate-700 bg-gradient-to-b from-[#17223B] to-[#11192E]',
    cardBackBg: 'border-amber-400/50 bg-gradient-to-b from-[#1E2B4A] to-[#121C33]',
    border: 'border-slate-800',
    textPrimary: 'text-slate-50',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    primaryBtn: 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-semibold',
    primaryText: 'text-amber-400',
    primarySoft: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
    accentText: 'text-sky-400',
    accentBg: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
    lineColor: 'bg-slate-800',
    lineDoneColor: 'bg-amber-400',
    ringColor: 'ring-amber-400/50',
  },

  // 2. Ünite: Derin Zümrüt Orman Koyu & Parlak Zümrüt / Turuncu (Kuvvet Labı)
  force: {
    isDark: true,
    pageBg: 'bg-[#071512] force-lab-grid text-emerald-50',
    headerBg: 'bg-[#071512]/90 border-emerald-900/70 text-emerald-50',
    drawerBg: 'border-emerald-900/70 bg-[#091B17] text-emerald-50',
    modalBg: 'border-emerald-800/80 bg-[#0E241E] text-emerald-50',
    surface: 'bg-[#0E241E] border-emerald-900/80 text-emerald-50',
    surfaceSubtle: 'bg-[#133028]/90 border-emerald-800/70 text-emerald-100',
    cardFrontBg: 'border-emerald-800/80 bg-gradient-to-b from-[#122D25] to-[#0B1D18]',
    cardBackBg: 'border-emerald-400/50 bg-gradient-to-b from-[#173A30] to-[#0D221C]',
    border: 'border-emerald-900/80',
    textPrimary: 'text-emerald-50',
    textSecondary: 'text-emerald-200/85',
    textMuted: 'text-emerald-300/65',
    primaryBtn: 'bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-semibold',
    primaryText: 'text-emerald-400',
    primarySoft: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    accentText: 'text-orange-400',
    accentBg: 'bg-orange-500/15 text-orange-300 border-orange-400/30',
    lineColor: 'bg-emerald-950',
    lineDoneColor: 'bg-emerald-400',
    ringColor: 'ring-emerald-400/50',
  },

  // 3. Ünite: Derin Biyo-Mor / Gece Eflatunu & Turkuaz / Lila (Canlılar & Mikroskop)
  life: {
    isDark: true,
    pageBg: 'bg-[#120D21] life-bio-glow text-violet-50',
    headerBg: 'bg-[#120D21]/90 border-violet-900/70 text-violet-50',
    drawerBg: 'border-violet-900/70 bg-[#17112B] text-violet-50',
    modalBg: 'border-violet-800/80 bg-[#1D1636] text-violet-50',
    surface: 'bg-[#1C1534] border-violet-900/80 text-violet-50',
    surfaceSubtle: 'bg-[#261D45]/90 border-violet-800/70 text-violet-100',
    cardFrontBg: 'border-violet-800/80 bg-gradient-to-b from-[#231B40] to-[#17112B]',
    cardBackBg: 'border-cyan-400/50 bg-gradient-to-b from-[#2A204C] to-[#191330]',
    border: 'border-violet-900/80',
    textPrimary: 'text-violet-50',
    textSecondary: 'text-violet-200/85',
    textMuted: 'text-violet-300/65',
    primaryBtn: 'bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-slate-950 font-semibold',
    primaryText: 'text-cyan-400',
    primarySoft: 'bg-cyan-400/15 text-cyan-300 border-cyan-400/30',
    accentText: 'text-fuchsia-300',
    accentBg: 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/30',
    lineColor: 'bg-violet-950',
    lineDoneColor: 'bg-cyan-400',
    ringColor: 'ring-cyan-400/50',
  },

  // 4. Ünite: Derin Bordo / Optik Koyu & Gül Mercan / Altın Işık (Işığın Dünyası)
  light: {
    isDark: true,
    pageBg: 'bg-[#1A0B14] light-optics-bg text-rose-50',
    headerBg: 'bg-[#1A0B14]/90 border-rose-900/70 text-rose-50',
    drawerBg: 'border-rose-900/70 bg-[#210E1A] text-rose-50',
    modalBg: 'border-rose-800/80 bg-[#2A1221] text-rose-50',
    surface: 'bg-[#26111E] border-rose-900/80 text-rose-50',
    surfaceSubtle: 'bg-[#331728]/90 border-rose-800/70 text-rose-100',
    cardFrontBg: 'border-rose-800/80 bg-gradient-to-b from-[#321527] to-[#210D19]',
    cardBackBg: 'border-amber-400/50 bg-gradient-to-b from-[#3E1B2F] to-[#25101D]',
    border: 'border-rose-900/80',
    textPrimary: 'text-rose-50',
    textSecondary: 'text-rose-200/85',
    textMuted: 'text-rose-300/65',
    primaryBtn: 'bg-rose-400 hover:bg-rose-300 active:bg-rose-500 text-slate-950 font-semibold',
    primaryText: 'text-rose-300',
    primarySoft: 'bg-rose-400/15 text-rose-200 border-rose-400/30',
    accentText: 'text-amber-300',
    accentBg: 'bg-amber-400/15 text-amber-200 border-amber-400/30',
    lineColor: 'bg-rose-950',
    lineDoneColor: 'bg-rose-400',
    ringColor: 'ring-rose-400/50',
  },

  // 5. Ünite: Derin Termal İndigo-Çelik Koyu & Buz Mavisi / Termal Turuncu (Maddenin Doğası)
  matter: {
    isDark: true,
    pageBg: 'bg-[#0C1226] matter-thermal-bg text-sky-50',
    headerBg: 'bg-[#0C1226]/90 border-sky-900/70 text-sky-50',
    drawerBg: 'border-sky-900/70 bg-[#101833] text-sky-50',
    modalBg: 'border-sky-800/80 bg-[#152042] text-sky-50',
    surface: 'bg-[#131D3B] border-sky-900/80 text-sky-50',
    surfaceSubtle: 'bg-[#1B2952]/90 border-sky-800/70 text-sky-100',
    cardFrontBg: 'border-sky-800/80 bg-gradient-to-b from-[#1A2850] to-[#101933]',
    cardBackBg: 'border-orange-400/50 bg-gradient-to-b from-[#213261] to-[#131E3C]',
    border: 'border-sky-900/80',
    textPrimary: 'text-sky-50',
    textSecondary: 'text-sky-200/85',
    textMuted: 'text-sky-300/65',
    primaryBtn: 'bg-sky-400 hover:bg-sky-300 active:bg-sky-500 text-slate-950 font-semibold',
    primaryText: 'text-sky-300',
    primarySoft: 'bg-sky-400/15 text-sky-200 border-sky-400/30',
    accentText: 'text-orange-400',
    accentBg: 'bg-orange-500/15 text-orange-300 border-orange-400/30',
    lineColor: 'bg-sky-950',
    lineDoneColor: 'bg-sky-400',
    ringColor: 'ring-sky-400/50',
  },

  // 6. Ünite: Derin Karbon-Bronz Koyu & Elektrik Sarısı / Kehribar (Yaşamımızdaki Elektrik)
  electric: {
    isDark: true,
    pageBg: 'bg-[#17120A] electric-circuit-bg text-amber-50',
    headerBg: 'bg-[#17120A]/90 border-amber-900/70 text-amber-50',
    drawerBg: 'border-amber-900/70 bg-[#1E170D] text-amber-50',
    modalBg: 'border-amber-800/80 bg-[#271F11] text-amber-50',
    surface: 'bg-[#221B0F] border-amber-900/80 text-amber-50',
    surfaceSubtle: 'bg-[#2E2414]/90 border-amber-800/70 text-amber-100',
    cardFrontBg: 'border-amber-800/80 bg-gradient-to-b from-[#2C2313] to-[#1B150B]',
    cardBackBg: 'border-yellow-400/50 bg-gradient-to-b from-[#362B16] to-[#20190D]',
    border: 'border-amber-900/80',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-amber-200/85',
    textMuted: 'text-amber-300/65',
    primaryBtn: 'bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-slate-950 font-semibold',
    primaryText: 'text-yellow-300',
    primarySoft: 'bg-yellow-400/15 text-yellow-200 border-yellow-400/30',
    accentText: 'text-orange-300',
    accentBg: 'bg-orange-500/15 text-orange-200 border-orange-400/30',
    lineColor: 'bg-amber-950',
    lineDoneColor: 'bg-yellow-400',
    ringColor: 'ring-yellow-400/50',
  },

  // 7. Ünite: Derin Okyanus-Çam Koyu & Turkuaz-Teal / Doğal Lime (Sürdürülebilir Yaşam)
  eco: {
    isDark: true,
    pageBg: 'bg-[#07171A] eco-forest-bg text-teal-50',
    headerBg: 'bg-[#07171A]/90 border-teal-900/70 text-teal-50',
    drawerBg: 'border-teal-900/70 bg-[#0A1F23] text-teal-50',
    modalBg: 'border-teal-800/80 bg-[#0E292E] text-teal-50',
    surface: 'bg-[#0D2429] border-teal-900/80 text-teal-50',
    surfaceSubtle: 'bg-[#123238]/90 border-teal-800/70 text-teal-100',
    cardFrontBg: 'border-teal-800/80 bg-gradient-to-b from-[#123137] to-[#0A1D21]',
    cardBackBg: 'border-lime-400/50 bg-gradient-to-b from-[#163D44] to-[#0C2227]',
    border: 'border-teal-900/80',
    textPrimary: 'text-teal-50',
    textSecondary: 'text-teal-200/85',
    textMuted: 'text-teal-300/65',
    primaryBtn: 'bg-teal-400 hover:bg-teal-300 active:bg-teal-500 text-slate-950 font-semibold',
    primaryText: 'text-teal-300',
    primarySoft: 'bg-teal-400/15 text-teal-200 border-teal-400/30',
    accentText: 'text-lime-300',
    accentBg: 'bg-lime-400/15 text-lime-200 border-lime-400/30',
    lineColor: 'bg-teal-950',
    lineDoneColor: 'bg-teal-400',
    ringColor: 'ring-teal-400/50',
  },
};
