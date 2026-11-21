import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Copy, Mail, X } from 'lucide-react';
import { UnitThemeId } from '../types';
import { UNIT_THEMES } from '../utils/theme';
import { soundEngine } from '../utils/sound';

interface FooterSignatureProps {
  themeId?: UnitThemeId;
}

const CONTACT_EMAIL = 'selimh.aytekin@gmail.com';
const MAILTO_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Geri Bildirim')}`;

export const FooterSignature: React.FC<FooterSignatureProps> = ({ themeId = 'space' }) => {
  const theme = UNIT_THEMES[themeId];
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    soundEngine.playTap();
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API may be unavailable in restricted contexts
    }
  };

  return (
    <>
      <footer className="mt-auto w-full py-5 pb-safe text-center">
        <button
          type="button"
          onClick={() => {
            soundEngine.playTap();
            setOpen(true);
          }}
          className="inline-flex min-h-[36px] items-center justify-center rounded-lg px-3 py-1.5 text-xs italic tracking-wide text-slate-300 opacity-35 transition-opacity hover:opacity-80 focus:opacity-90 active:scale-95"
        >
          Selim H. Aytekin
        </button>
      </footer>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 14, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-xs rounded-3xl border p-5 text-center shadow-2xl space-y-4 ${theme.modalBg}`}
            >
              <button
                type="button"
                aria-label="Kapat"
                onClick={() => {
                  soundEngine.playTap();
                  setOpen(false);
                }}
                className={`absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-xl border ${theme.surfaceSubtle}`}
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-400">
                <Mail className="h-6 w-6" />
              </div>

              <div className="space-y-1">
                <p className={`text-xs italic opacity-75 ${theme.textMuted}`}>Selim H. Aytekin</p>
                <h3 className={`font-display text-base font-extrabold leading-snug ${theme.textPrimary}`}>
                  Beğendin mi? Ücretsiz mail ile artı ve eksileri söyleyebilirsin.
                </h3>
              </div>

              <div className="space-y-2">
                <a
                  href={MAILTO_HREF}
                  onClick={() => soundEngine.playTap()}
                  className={`min-h-[48px] w-full rounded-xl px-4 py-3 text-xs font-extrabold transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${theme.primaryBtn}`}
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{CONTACT_EMAIL}</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`min-h-[40px] w-full rounded-xl border px-3 py-2 text-xs font-semibold transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5 ${theme.surfaceSubtle}`}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">E-posta Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 opacity-75" />
                      <span>Adresi Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
