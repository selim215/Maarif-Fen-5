import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Flame,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { HapBilgiItem, TopicData, UnitThemeId } from '../../types';
import { UNIT_THEMES } from '../../utils/theme';
import { soundEngine } from '../../utils/sound';

interface HapBilgilerActivityProps {
  topic: TopicData;
  themeId: UnitThemeId;
  isCompleted: boolean;
  onComplete: () => void;
}

const HAP_CATEGORY_META: Record<
  HapBilgiItem['category'],
  {
    label: string;
    borderClass: string;
    badgeClass: string;
    icon: React.FC<{ className?: string }>;
  }
> = {
  'bilgi-istasyonu': {
    label: 'Bilgi İstasyonu',
    borderClass: 'border-l-emerald-400',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    icon: Lightbulb,
  },
  kopru: {
    label: 'Köprü İstasyonu',
    borderClass: 'border-l-sky-400',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
    icon: Compass,
  },
  'cagini-asanlar': {
    label: 'Çağını Aşanlar',
    borderClass: 'border-l-amber-400',
    badgeClass: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    icon: Award,
  },
  'kritik-not': {
    label: 'Kritik Hap Bilgi',
    borderClass: 'border-l-rose-400',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
    icon: Flame,
  },
};

export const HapBilgilerActivity: React.FC<HapBilgilerActivityProps> = ({
  topic,
  themeId,
  isCompleted,
  onComplete,
}) => {
  const theme = UNIT_THEMES[themeId];
  const totalSections = topic.hapBilgiler.length + 1; // Hap cards + Key Notes card
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (isCompleted) {
      topic.hapBilgiler.forEach((h) => initial.add(h.id));
      initial.add('key-notes');
    } else if (topic.hapBilgiler[0]) {
      initial.add(topic.hapBilgiler[0].id);
    }
    return initial;
  });

  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [topic.id]);

  // Automatically mark each Hap Bilgi section as read as the student scrolls through it
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      const all = new Set<string>(topic.hapBilgiler.map((h) => h.id));
      all.add('key-notes');
      setReadIds(all);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const newlySeen: string[] = [];
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-hap-id');
            if (id) newlySeen.push(id);
          }
        }
        if (newlySeen.length > 0) {
          setReadIds((prev) => {
            let changed = false;
            const next = new Set(prev);
            for (const id of newlySeen) {
              if (!next.has(id)) {
                next.add(id);
                changed = true;
              }
            }
            return changed ? next : prev;
          });
        }
      },
      { threshold: 0.25 }
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [topic]);

  const registerRef = (id: string) => (el: HTMLDivElement | null) => {
    if (el) {
      sectionRefs.current.set(id, el);
    } else {
      sectionRefs.current.delete(id);
    }
  };

  const readCount = Math.min(totalSections, readIds.size);
  const progressPct = Math.round((readCount / totalSections) * 100);

  return (
    <div className="space-y-4">
      {/* Crisp Fluorescent Hero Header for Hap Bilgiler */}
      <div
        className={`relative overflow-hidden rounded-3xl border border-lime-400/70 bg-lime-400/10 p-5 sm:p-6 hap-card-glow ${theme.surface}`}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-lime-300 text-slate-950 hap-icon-glow">
            <Lightbulb className="h-9 w-9 stroke-[2.3]" />
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-lime-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>1. Adım · MEB Ders Kitabı Özeti</span>
            </div>
            <h2 className="font-display text-xl font-extrabold leading-tight text-white sm:text-2xl">
              Kitaptan Hap Bilgiler
            </h2>
            <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>
              Sorulara ve etkinliklere geçmeden önce aşağıdaki{' '}
              <span className="font-bold text-lime-300">{topic.hapBilgiler.length} hap bilgiyi</span> ve{' '}
              <span className="font-bold text-lime-300">temel notları</span> dikkatlice oku. En altta seni hazır butonu bekliyor!
            </p>
          </div>
        </div>

        {/* Reading Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-amber-200/90">Okuma İlerlemesi</span>
            <span className="tabular-nums text-amber-300">
              {readCount} / {totalSections} Bölüm (%{progressPct})
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-950/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* All Structured Hap Bilgiler Cards */}
      <div className="space-y-3.5">
        {topic.hapBilgiler.map((item, idx) => {
          const meta = HAP_CATEGORY_META[item.category];
          const CatIcon = meta.icon;
          const isSeen = readIds.has(item.id);

          return (
            <motion.div
              key={item.id}
              ref={registerRef(item.id)}
              data-hap-id={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: Math.min(idx * 0.04, 0.24) }}
              onClick={() => {
                setReadIds((prev) => {
                  const next = new Set(prev);
                  next.add(item.id);
                  return next;
                });
              }}
              className={`rounded-2xl border border-l-4 p-4 sm:p-5 space-y-2.5 transition-colors ${meta.borderClass} ${theme.surface}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-extrabold ${meta.badgeClass}`}
                >
                  <CatIcon className="h-4 w-4 shrink-0" />
                  <span>{meta.label}</span>
                </div>

                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold tabular-nums ${
                    isSeen ? 'text-emerald-400' : theme.textMuted
                  }`}
                >
                  {isSeen ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Okundu</span>
                    </>
                  ) : (
                    <span>
                      {idx + 1}/{topic.hapBilgiler.length}
                    </span>
                  )}
                </span>
              </div>

              <h3 className={`font-display text-base font-extrabold leading-snug sm:text-lg ${theme.textPrimary}`}>
                {item.title}
              </h3>

              <p className={`text-sm leading-relaxed sm:text-[15px] ${theme.textSecondary}`}>
                {item.content}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Core Key Summary Notes */}
      <div
        ref={registerRef('key-notes')}
        data-hap-id="key-notes"
        className={`rounded-2xl border border-amber-400/35 p-5 space-y-3 ${theme.surface}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                Altın Özet · Aklında Tut
              </div>
              <h3 className={`font-display text-base font-extrabold sm:text-lg ${theme.textPrimary}`}>
                {topic.keyNoteTitle}
              </h3>
            </div>
          </div>

          {readIds.has('key-notes') && (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          )}
        </div>

        <ul className={`space-y-2.5 text-sm leading-relaxed sm:text-[15px] ${theme.textSecondary}`}>
          {topic.keyNotes.map((note, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-2.5 rounded-xl border p-3 ${theme.surfaceSubtle}`}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-400/20 text-xs font-extrabold text-amber-300">
                {idx + 1}
              </span>
              <span className="font-medium text-slate-100">{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Completion CTA Button */}
      <div
        className={`rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/15 via-amber-400/10 to-transparent p-5 text-center space-y-3.5 ${theme.surface}`}
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-400">
            <Sparkles className="h-4 w-4" />
            <span>{isCompleted ? 'Hap Bilgiler Tamamlandı' : 'Tüm Hap Bilgileri İnceledin!'}</span>
          </div>
          <p className={`text-sm ${theme.textSecondary}`}>
            {isCompleted
              ? 'Bu konunun özetini tekrar ettin. Şimdi etkinlik ve sorulara devam edebilirsin!'
              : 'Artık interaktif keşif, bilgi kartları ve testlere geçmeye hazırsın!'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSuccess();
            onComplete();
          }}
          className="min-h-[56px] w-full rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 px-5 py-3.5 font-display text-base font-extrabold text-slate-950 shadow-lg shadow-amber-500/25 transition-transform active:scale-[0.98] flex items-center justify-center gap-2.5 sm:text-lg"
        >
          <CheckCircle2 className="h-6 w-6 shrink-0" />
          <span>Okudum, soruları çözmeye hazırım!</span>
          <ArrowRight className="h-5 w-5 shrink-0" />
        </button>
      </div>
    </div>
  );
};
