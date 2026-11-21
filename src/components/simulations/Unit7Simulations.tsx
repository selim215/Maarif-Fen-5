import React, { useState } from 'react';
import { Check, Recycle, Sparkles } from 'lucide-react';
import { soundEngine } from '../../utils/sound';

interface SimProps {
  onComplete: () => void;
  isCompleted: boolean;
}

// ---------------------------------------------------------------------------
// 7.1 EVSEL ATIKLAR VE GERİ DÖNÜŞÜM: Kaynağında Ayrıştırma Oyunu
// ---------------------------------------------------------------------------
type BinType = 'plastik' | 'kagit' | 'cam' | 'metal' | 'ozel' | 'cop';

const WASTE_ITEMS: { id: string; name: string; bin: BinType; hint: string }[] = [
  { id: 'w1', name: 'Plastik Su Şişesi', bin: 'plastik', hint: 'Plastik şişe ve kapaklar plastik kutusuna!' },
  { id: 'w2', name: 'Eski Gazete & Defter', bin: 'kagit', hint: 'Temiz kâğıt ve kartonlar kâğıt kutusuna (1000 ton = 17.000 ağaç!).' },
  { id: 'w3', name: 'Kırılmamış Cam Kavanoz', bin: 'cam', hint: 'Cam şişe ve kavanozlar cam kumbarasına!' },
  { id: 'w4', name: 'Alüminyum İçecek Kutusu', bin: 'metal', hint: 'Alüminyum kutu ve tenekeler metal kutusuna!' },
  { id: 'w5', name: 'Bitmiş Pil & Kızartma Yağı', bin: 'ozel', hint: 'Atık pil kutusuna ve atık yağ toplama noktasına verilmeli!' },
  { id: 'w6', name: 'Yağlı Kâğıt & Çürümüş Meyve', bin: 'cop', hint: 'Besin artıkları, kâğıt havlu ve yağlı kâğıt geri dönüştürülemez (çöp).' },
];

const BINS: { id: BinType; label: string; color: string }[] = [
  { id: 'plastik', label: 'Plastik', color: 'border-yellow-400/60 bg-yellow-400/15 text-yellow-200' },
  { id: 'kagit', label: 'Kâğıt', color: 'border-sky-400/60 bg-sky-400/15 text-sky-200' },
  { id: 'cam', label: 'Cam', color: 'border-emerald-400/60 bg-emerald-400/15 text-emerald-200' },
  { id: 'metal', label: 'Metal', color: 'border-slate-400/60 bg-slate-400/15 text-slate-200' },
  { id: 'ozel', label: 'Özel Pil/Yağ', color: 'border-orange-400/60 bg-orange-400/15 text-orange-200' },
  { id: 'cop', label: 'Çöp (Dönüşmez)', color: 'border-rose-400/60 bg-rose-400/15 text-rose-200' },
];

export const WasteSortingSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [index, setIndex] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [feedback, setFeedback] = useState<string>('Atığı doğru geri dönüşüm kutusuna dokunarak ayrıştır!');

  const current = WASTE_ITEMS[index % WASTE_ITEMS.length];
  const allDone = solvedCount >= WASTE_ITEMS.length;

  const pickBin = (binId: BinType) => {
    if (allDone) return;
    if (binId === current.bin) {
      soundEngine.playSuccess();
      setFeedback(`Harika! ${current.hint}`);
      setSolvedCount((c) => c + 1);
      setIndex((i) => i + 1);
    } else {
      soundEngine.playError();
      setFeedback(`Tekrar dene! İpucu: ${current.hint}`);
    }
  };

  return (
    <div className="rounded-3xl border border-teal-900/80 bg-[#0D2429] p-4 sm:p-5 text-teal-50 space-y-4">
      <div className="rounded-2xl border border-teal-800/70 bg-[#07171A] p-4 text-center space-y-2">
        <div className="text-xs font-extrabold uppercase tracking-wider text-lime-300 tabular-nums">
          Ayrıştırılan Atık: {Math.min(solvedCount, WASTE_ITEMS.length)} / {WASTE_ITEMS.length}
        </div>
        {allDone ? (
          <div className="py-2 font-display text-lg font-extrabold text-emerald-400">
            Tüm Evsel Atıkları Doğru Kutulara Ayırdın!
          </div>
        ) : (
          <div className="py-2">
            <div className="text-[11px] text-teal-300">Sıradaki Evsel Atık:</div>
            <div className="mt-1 font-display text-xl font-extrabold text-white">
              {current.name}
            </div>
          </div>
        )}
        <p className="text-xs leading-relaxed text-teal-200">{feedback}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {BINS.map((b) => (
          <button
            key={b.id}
            type="button"
            disabled={allDone}
            onClick={() => pickBin(b.id)}
            className={`min-h-[48px] rounded-xl border px-3 py-2.5 text-xs font-extrabold transition-all active:scale-95 ${b.color} ${
              allDone ? 'opacity-50' : ''
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!allDone && !isCompleted}
        onClick={() => {
          soundEngine.playSuccess();
          onComplete();
        }}
        className={`min-h-[48px] w-full rounded-2xl px-4 py-3 font-display text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
          allDone || isCompleted
            ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 active:scale-[0.98]'
            : 'bg-teal-950/70 text-teal-300/60 cursor-not-allowed'
        }`}
      >
        {allDone || isCompleted ? <Check className="h-5 w-5" /> : <Recycle className="h-4 w-4" />}
        <span>
          {isCompleted
            ? 'Keşif Tamamlandı · Konu Hattına Dön'
            : allDone
            ? 'Keşfi Tamamladım (+40 XP)'
            : '6 atığın tamamını doğru kutuya yerleştir'}
        </span>
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 7.2 ATIK YÖNETİMİ: Sıfır Atık 6 Basamaklı Hiyerarşi & Kavram Keşfi
// ---------------------------------------------------------------------------
const HIERARCHY_LEVELS = [
  {
    rank: 1,
    name: 'Önleme (En Öncelikli!)',
    badge: '1. Adım',
    desc: 'Atığın daha baştan hiç oluşmasını engellemek. Örnek: Alışverişe bez torba ve su matarasıyla gitmek.',
    color: 'border-lime-400 bg-lime-400/15 text-lime-200',
  },
  {
    rank: 2,
    name: 'Azaltma',
    badge: '2. Adım',
    desc: 'İhtiyacımız kadar tüketmek, tek kullanımlık ürünleri azaltmak, şarj edilebilir pil kullanmak.',
    color: 'border-emerald-400 bg-emerald-400/15 text-emerald-200',
  },
  {
    rank: 3,
    name: 'Tekrar Kullanım (Yeniden Kullanım)',
    badge: '3. Adım',
    desc: 'Ürünü aynı/benzer amaçla tekrar kullanmak: Sandalyeyi tamir etmek, cam kavanozu tekrar kullanmak, kıyafet bağışlamak.',
    color: 'border-teal-400 bg-teal-400/15 text-teal-200',
  },
  {
    rank: 4,
    name: 'Geri Dönüşüm / İleri Dönüşüm',
    badge: '4. Adım',
    desc: 'Geri kazanımla pet şişeden iplik/mont üretmek; ileri dönüşümle eski kot pantolondan çanta veya deterjan kutusundan kitaplık yapmak.',
    color: 'border-sky-400 bg-sky-400/15 text-sky-200',
  },
  {
    rank: 5,
    name: 'Enerji Geri Kazanımı',
    badge: '5. Adım',
    desc: 'Dönüştürülemeyen bazı atıklardan özel tesislerde elektrik veya ısı enerjisi elde edilmesi.',
    color: 'border-amber-400 bg-amber-400/15 text-amber-200',
  },
  {
    rank: 6,
    name: 'Bertaraf (En Son Seçenek)',
    badge: '6. Adım',
    desc: 'Hiçbir şekilde değerlendirilemeyen atıkların çevreye zarar vermeden güvenli biçimde yok edilmesi.',
    color: 'border-rose-400 bg-rose-400/15 text-rose-200',
  },
];

export const ZeroWasteHierarchySim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [selectedRank, setSelectedRank] = useState(1);
  const [visited, setVisited] = useState<number[]>([1]);

  const current = HIERARCHY_LEVELS.find((l) => l.rank === selectedRank) ?? HIERARCHY_LEVELS[0];
  const ready = visited.length >= 4;

  return (
    <div className="rounded-3xl border border-teal-900/80 bg-[#0D2429] p-4 sm:p-5 text-teal-50 space-y-4">
      <div className="text-xs font-extrabold uppercase tracking-wider text-lime-300">
        Sıfır Atık Hiyerarşisi (En Öncelikliden En Son Seçeneğe)
      </div>

      <div className="space-y-1.5">
        {HIERARCHY_LEVELS.map((lvl) => {
          const active = lvl.rank === selectedRank;
          const widthPct = 100 - (lvl.rank - 1) * 7;
          return (
            <div key={lvl.rank} className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setSelectedRank(lvl.rank);
                  if (!visited.includes(lvl.rank)) setVisited((prev) => [...prev, lvl.rank]);
                }}
                style={{ width: `${widthPct}%` }}
                className={`min-h-[42px] rounded-xl border px-3 py-2 text-left text-xs font-extrabold transition-all active:scale-[0.98] flex items-center justify-between ${
                  active ? `${lvl.color} ring-2 ring-white/40` : 'border-teal-800/80 bg-[#123238] text-teal-100'
                }`}
              >
                <span className="truncate">{lvl.rank}. {lvl.name}</span>
                {visited.includes(lvl.rank) && <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />}
              </button>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-teal-800/70 bg-[#07171A] p-3.5 space-y-1 text-xs">
        <div className="font-extrabold text-lime-300">
          {current.badge} · {current.name}
        </div>
        <p className="leading-relaxed text-teal-100">{current.desc}</p>
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
            : 'bg-teal-950/70 text-teal-300/60 cursor-not-allowed'
        }`}
      >
        {ready || isCompleted ? <Check className="h-5 w-5" /> : <Sparkles className="h-4 w-4" />}
        <span>
          {isCompleted
            ? 'Keşif Tamamlandı · Konu Hattına Dön'
            : ready
            ? 'Keşfi Tamamladım (+40 XP)'
            : `Hiyerarşide en az 4 basamağı incele (${visited.length}/4)`}
        </span>
      </button>
    </div>
  );
};
