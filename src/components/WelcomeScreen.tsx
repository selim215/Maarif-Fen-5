import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Compass,
  Flame,
  FlaskConical,
  Microscope,
  Orbit,
  Play,
  Recycle,
  Sparkles,
  Sun,
  Trophy,
  Zap,
} from 'lucide-react';
import { CURRICULUM, getAllTests, IMAGES } from '../data/curriculum';
import { SafeImage } from './SafeImage';
import { FooterSignature } from './FooterSignature';
import { soundEngine } from '../utils/sound';

interface WelcomeScreenProps {
  hasProgress: boolean;
  xp: number;
  completedCount: number;
  totalStations: number;
  onStart: (unitId?: string, topicId?: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  hasProgress,
  xp,
  completedCount,
  totalStations,
  onStart,
}) => {
  const { topicCount, testCount } = useMemo(() => {
    const topics = CURRICULUM.reduce((sum, u) => sum + u.topics.length, 0);
    const tests = getAllTests().length;
    return { topicCount: topics, testCount: tests };
  }, []);

  return (
    <div className="min-h-dvh bg-[#0B1120] space-starfield text-slate-100 flex flex-col">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-between px-4 py-6 sm:px-6 sm:py-10">
        {/* Top brand bar */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shadow-md">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-lg font-extrabold tracking-tight text-white">
                Maarif Fen 5
              </div>
              <div className="text-xs text-slate-400">5. Sınıf Fen Bilimleri Oyun Platformu</div>
            </div>
          </div>

          {hasProgress && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 tabular-nums">
              <Trophy className="h-4 w-4" />
              <span>{xp} XP</span>
            </div>
          )}
        </header>

        {/* Hero section */}
        <section className="my-6 grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:my-9">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="md:col-span-6 space-y-4"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
              5. Sınıf · MEB 1. & 2. Kitap · {CURRICULUM.length} Ünite · {topicCount} Konu · {testCount} Test
            </p>

            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              Hoş geldin! Eğlenerek öğrenmeye var mısın?
            </h1>

            <p className="text-base leading-relaxed text-slate-300">
              5. sınıf Fen Bilimleri 1. ve 2. dönem tüm üniteleri için interaktif ve eğlenceli bir oyun uygulaması! Hap bilgileri oku, dokunmatik deneyler yap, bilgi kartlarını kaydır, 4 zorunlu test ve ekstra testlerle konuları eksiksiz öğren!
            </p>

            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playUnlock();
                  onStart();
                }}
                className="min-h-[54px] w-full rounded-2xl bg-amber-400 px-6 py-3.5 font-display text-base font-extrabold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-300 active:scale-[0.98] flex items-center justify-center gap-2.5 sm:w-auto"
              >
                <Play className="h-5 w-5 fill-slate-950" />
                <span>{hasProgress ? 'Kaldığın Yerden Devam Et' : 'Maceraya Başla!'}</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              {hasProgress && (
                <p className="text-xs text-slate-400 tabular-nums">
                  Şimdiye kadar {completedCount} / {totalStations} etkinlik istasyonunu tamamladın.
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-6"
          >
            <div className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900 shadow-2xl">
              <SafeImage
                src={IMAGES.welcome}
                alt="5. sınıf fen bilimleri keşif dünyası: gezegenler, kuvvet, hücre, ışık, madde, elektrik ve geri dönüşüm"
                theme="space"
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span>Güneş & Ay · Kuvvet · Hücre · Işık · Madde · Elektrik · Sıfır Atık</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Quick 7-Unit Visual Picker */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>İstersen doğrudan bir üniteden başla (1. & 2. Dönem):</span>
            <span className="hidden sm:inline">Her ünitenin kendine özel koyu teması var</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CURRICULUM.map((unit) => {
              const Icon =
                unit.number === 1
                  ? Orbit
                  : unit.number === 2
                  ? Compass
                  : unit.number === 3
                  ? Microscope
                  : unit.number === 4
                  ? Sun
                  : unit.number === 5
                  ? Flame
                  : unit.number === 6
                  ? Zap
                  : Recycle;

              const accent =
                unit.theme === 'space'
                  ? 'text-amber-300'
                  : unit.theme === 'force'
                  ? 'text-emerald-300'
                  : unit.theme === 'life'
                  ? 'text-cyan-300'
                  : unit.theme === 'light'
                  ? 'text-rose-300'
                  : unit.theme === 'matter'
                  ? 'text-sky-300'
                  : unit.theme === 'electric'
                  ? 'text-yellow-300'
                  : 'text-teal-300';

              return (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    onStart(unit.id, unit.topics[0].id);
                  }}
                  className="group flex items-center gap-3 overflow-hidden rounded-2xl border border-slate-800 bg-[#131C31]/90 p-2.5 text-left transition-all hover:border-slate-600 active:scale-[0.98] sm:flex-col sm:items-stretch sm:p-3"
                >
                  <SafeImage
                    src={unit.coverImage}
                    alt={unit.title}
                    theme={unit.theme}
                    className="h-16 w-20 shrink-0 rounded-xl object-cover sm:aspect-[16/9] sm:h-auto sm:w-full"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${accent}`}>
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {unit.number}. Ünite · {unit.topics.length} Konu
                      </span>
                    </div>
                    <h2 className="font-display text-sm font-bold leading-snug text-white group-hover:text-amber-300">
                      {unit.shortTitle}
                    </h2>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
      <FooterSignature themeId="space" />
    </div>
  );
};
