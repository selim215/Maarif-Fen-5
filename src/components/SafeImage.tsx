import React, { useState } from 'react';
import {
  Atom,
  Compass,
  Flame,
  Microscope,
  Orbit,
  Recycle,
  Sun,
  Zap,
} from 'lucide-react';
import { UnitThemeId } from '../types';

interface SafeImageProps {
  src: string;
  alt: string;
  theme?: UnitThemeId;
  className?: string;
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  theme = 'space',
  className = '',
  fallbackLabel,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    const gradientMap: Record<UnitThemeId, string> = {
      space: 'from-slate-900 via-indigo-950 to-slate-900 text-amber-300',
      force: 'from-emerald-900 via-teal-900 to-emerald-950 text-emerald-200',
      life: 'from-violet-950 via-purple-900 to-slate-950 text-cyan-200',
      light: 'from-rose-950 via-pink-950 to-slate-950 text-amber-300',
      matter: 'from-sky-950 via-indigo-950 to-slate-950 text-sky-200',
      electric: 'from-amber-950 via-stone-900 to-slate-950 text-yellow-300',
      eco: 'from-teal-950 via-emerald-950 to-slate-950 text-lime-200',
    };

    const Icon =
      theme === 'space'
        ? Orbit
        : theme === 'force'
        ? Compass
        : theme === 'life'
        ? Microscope
        : theme === 'light'
        ? Sun
        : theme === 'matter'
        ? Flame
        : theme === 'electric'
        ? Zap
        : theme === 'eco'
        ? Recycle
        : Atom;

    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br p-4 text-center ${gradientMap[theme]} ${className}`}
      >
        <Icon className="h-9 w-9 opacity-90" />
        <span className="max-w-[200px] text-xs font-semibold opacity-90">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
