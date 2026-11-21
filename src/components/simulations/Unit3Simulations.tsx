import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { soundEngine } from '../../utils/sound';

interface SimProps {
  onComplete: () => void;
  isCompleted: boolean;
}

// ---------------------------------------------------------------------------
// 3.1 HÜCRE MİKROSKOBU VE HÜCRE -> ORGANİZMA YAKINLAŞTIRMA
// ---------------------------------------------------------------------------
interface OrganelleInfo {
  id: string;
  name: string;
  role: string;
  analogy: string;
  inPlant: boolean;
  inAnimal: boolean;
  color: string;
}

const ORGANELLES: OrganelleInfo[] = [
  {
    id: 'nucleus',
    name: 'Çekirdek',
    role: 'Hücredeki tüm yaşamsal olayları yönetir ve kalıtsal özellikleri taşır.',
    analogy: 'Okul Müdürü',
    inPlant: true,
    inAnimal: true,
    color: '#8B5CF6',
  },
  {
    id: 'mitochondria',
    name: 'Mitokondri',
    role: 'Hücrenin ihtiyacı olan enerjiyi üretir.',
    analogy: 'Elektrik Santrali',
    inPlant: true,
    inAnimal: true,
    color: '#F97316',
  },
  {
    id: 'chloroplast',
    name: 'Kloroplast',
    role: 'Sadece bitki hücrelerinde bulunur; besin ve oksijen üretir.',
    analogy: 'Güneş Enerjili Mutfak',
    inPlant: true,
    inAnimal: false,
    color: '#22C55E',
  },
  {
    id: 'wall',
    name: 'Hücre Duvarı (Çeperi)',
    role: 'Sadece bitki hücresinde zarın dışında bulunur; hücreyi korur ve köşeli şekil verir.',
    analogy: 'Koruyucu Kale Duvarı',
    inPlant: true,
    inAnimal: false,
    color: '#16A34A',
  },
  {
    id: 'vacuole',
    name: 'Koful',
    role: 'Su, besin ve atık depolar. Bitkide büyük ve az, hayvanda küçük ve çoktur.',
    analogy: 'Depo Odası',
    inPlant: true,
    inAnimal: true,
    color: '#22D3EE',
  },
  {
    id: 'centrosome',
    name: 'Sentrozom',
    role: 'Hayvan hücrelerinde hücre bölünmesinde görev alır.',
    analogy: 'Bölünme Yardımcısı',
    inPlant: false,
    inAnimal: true,
    color: '#F59E0B',
  },
];

const HIERARCHY_STEPS = [
  { level: 1, title: 'Hücre', example: 'Kas Hücresi', analogy: 'Tek bir tuğla / Ev', desc: 'Canlıların en küçük yapı taşıdır.' },
  { level: 2, title: 'Doku', example: 'Kas Dokusu', analogy: 'Tuğla duvar / Mahalle', desc: 'Aynı görevli hücreler birleşerek dokuyu oluşturur.' },
  { level: 3, title: 'Organ', example: 'Kol veya Kalp', analogy: 'Oda / İlçe', desc: 'Farklı dokular bir araya gelerek organı oluşturur.' },
  { level: 4, title: 'Sistem', example: 'Destek ve Hareket Sistemi', analogy: 'Ev / İl', desc: 'Belirli görevli organlar sistemleri oluşturur.' },
  { level: 5, title: 'Organizma', example: 'İnsan / Elma Ağacı', analogy: 'Köy / Ülke', desc: 'Sistemlerin uyumlu bütünü canlı organizmadır.' },
];

export const CellExplorerSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [mode, setMode] = useState<'cell' | 'hierarchy'>('cell');
  const [cellKind, setCellKind] = useState<'plant' | 'animal'>('plant');
  const [selectedOrg, setSelectedOrg] = useState<OrganelleInfo>(ORGANELLES[0]);
  const [inspectedOrgs, setInspectedOrgs] = useState<string[]>(['nucleus']);
  const [hierStep, setHierStep] = useState(0);
  const [checkedHierarchy, setCheckedHierarchy] = useState(false);

  const visibleOrgs = ORGANELLES.filter((o) => (cellKind === 'plant' ? o.inPlant : o.inAnimal));
  const ready = inspectedOrgs.length >= 4 && checkedHierarchy;

  const pickOrganelle = (org: OrganelleInfo) => {
    soundEngine.playTap();
    setSelectedOrg(org);
    setInspectedOrgs((prev) => (prev.includes(org.id) ? prev : [...prev, org.id]));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-violet-900/80 bg-[#1C1534] p-4 shadow-sm space-y-4">
        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#120D22] p-1">
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setMode('cell');
            }}
            className={`min-h-[44px] rounded-lg text-xs font-bold transition-colors ${
              mode === 'cell' ? 'bg-[#2B2050] text-cyan-300 shadow-sm' : 'text-violet-300/70'
            }`}
          >
            1. Bitki & Hayvan Hücresi
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setMode('hierarchy');
              setCheckedHierarchy(true);
            }}
            className={`min-h-[44px] rounded-lg text-xs font-bold transition-colors ${
              mode === 'hierarchy' ? 'bg-[#2B2050] text-cyan-300 shadow-sm' : 'text-violet-300/70'
            }`}
          >
            2. Hücre → Organizma
          </button>
        </div>

        {mode === 'cell' ? (
          <div className="space-y-3">
            {/* Plant / Animal Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playFlip();
                  setCellKind('plant');
                  setSelectedOrg(ORGANELLES[2]);
                  setInspectedOrgs((p) => (p.includes('chloroplast') ? p : [...p, 'chloroplast']));
                }}
                className={`min-h-[44px] rounded-xl border text-xs font-bold active:scale-95 ${
                  cellKind === 'plant'
                    ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                    : 'border-violet-800/70 bg-[#261D45] text-violet-100'
                }`}
              >
                Bitki Hücresi (Köşeli)
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playFlip();
                  setCellKind('animal');
                  setSelectedOrg(ORGANELLES[5]);
                  setInspectedOrgs((p) => (p.includes('centrosome') ? p : [...p, 'centrosome']));
                }}
                className={`min-h-[44px] rounded-xl border text-xs font-bold active:scale-95 ${
                  cellKind === 'animal'
                    ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                    : 'border-violet-800/70 bg-[#261D45] text-violet-100'
                }`}
              >
                Hayvan Hücresi (Oval)
              </button>
            </div>

            {/* Interactive SVG Cell Diagram */}
            <div className="rounded-xl border border-violet-800/60 bg-[#120D23] p-3">
              <svg viewBox="0 0 300 185" className="mx-auto h-48 w-full max-w-xs select-none">
                {cellKind === 'plant' ? (
                  <>
                    {/* Hexagonal Cell Wall + Membrane */}
                    <polygon
                      points="45,25 255,25 282,92 255,160 45,160 18,92"
                      fill="#143326"
                      stroke="#22C55E"
                      strokeWidth="7"
                      onClick={() => pickOrganelle(ORGANELLES[3])}
                      className="cursor-pointer"
                    />
                    <polygon
                      points="50,33 250,33 272,92 250,152 50,152 28,92"
                      fill="#1A4232"
                      stroke="#4ADE80"
                      strokeWidth="2"
                    />
                    {/* Large Vacuole */}
                    <ellipse
                      cx="125"
                      cy="112"
                      rx="58"
                      ry="28"
                      fill="#0E7490"
                      stroke={selectedOrg.id === 'vacuole' ? '#67E8F9' : '#22D3EE'}
                      strokeWidth={selectedOrg.id === 'vacuole' ? '4' : '2'}
                      onClick={() => pickOrganelle(ORGANELLES[4])}
                      className="cursor-pointer"
                    />
                    <text x="125" y="116" textAnchor="middle" fill="#ECFEFF" fontSize="10" fontWeight="700" pointerEvents="none">
                      Büyük Koful
                    </text>

                    {/* Chloroplast */}
                    <g onClick={() => pickOrganelle(ORGANELLES[2])} className="cursor-pointer">
                      <ellipse cx="78" cy="64" rx="22" ry="12" fill="#16A34A" stroke={selectedOrg.id === 'chloroplast' ? '#FEF08A' : '#86EFAC'} strokeWidth="2.5" />
                      <text x="78" y="67" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="700">Kloroplast</text>
                    </g>

                    {/* Nucleus */}
                    <g onClick={() => pickOrganelle(ORGANELLES[0])} className="cursor-pointer">
                      <circle cx="195" cy="68" r="24" fill="#7C3AED" stroke={selectedOrg.id === 'nucleus' ? '#FDE047' : '#DDD6FE'} strokeWidth="3" />
                      <text x="195" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="700">Çekirdek</text>
                    </g>

                    {/* Mitochondria */}
                    <g onClick={() => pickOrganelle(ORGANELLES[1])} className="cursor-pointer">
                      <ellipse cx="222" cy="124" rx="22" ry="12" fill="#EA580C" stroke={selectedOrg.id === 'mitochondria' ? '#FDE047' : '#FED7AA'} strokeWidth="2.5" />
                      <text x="222" y="127" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="700">Mitokondri</text>
                    </g>
                  </>
                ) : (
                  <>
                    {/* Oval Animal Cell Membrane */}
                    <ellipse cx="150" cy="92" rx="122" ry="72" fill="#182747" stroke="#38BDF8" strokeWidth="4" />
                    {/* Nucleus center */}
                    <g onClick={() => pickOrganelle(ORGANELLES[0])} className="cursor-pointer">
                      <circle cx="150" cy="88" r="26" fill="#7C3AED" stroke={selectedOrg.id === 'nucleus' ? '#FDE047' : '#DDD6FE'} strokeWidth="3" />
                      <text x="150" y="92" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="700">Çekirdek</text>
                    </g>
                    {/* Small Vacuoles */}
                    <g onClick={() => pickOrganelle(ORGANELLES[4])} className="cursor-pointer">
                      <circle cx="80" cy="116" r="14" fill="#0891B2" stroke={selectedOrg.id === 'vacuole' ? '#FDE047' : '#67E8F9'} strokeWidth="2.5" />
                      <circle cx="215" cy="64" r="11" fill="#0891B2" stroke="#67E8F9" strokeWidth="2" />
                      <text x="80" y="119" textAnchor="middle" fill="#ECFEFF" fontSize="8" fontWeight="700">Koful</text>
                    </g>
                    {/* Mitochondria */}
                    <g onClick={() => pickOrganelle(ORGANELLES[1])} className="cursor-pointer">
                      <ellipse cx="214" cy="120" rx="24" ry="12" fill="#EA580C" stroke={selectedOrg.id === 'mitochondria' ? '#FDE047' : '#FED7AA'} strokeWidth="2.5" />
                      <text x="214" y="123" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="700">Mitokondri</text>
                    </g>
                    {/* Centrosome */}
                    <g onClick={() => pickOrganelle(ORGANELLES[5])} className="cursor-pointer">
                      <rect x="64" y="52" width="44" height="22" rx="8" fill="#D97706" stroke={selectedOrg.id === 'centrosome' ? '#FDE047' : '#FEF3C7'} strokeWidth="2.5" />
                      <text x="86" y="66" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="700">Sentrozom</text>
                    </g>
                  </>
                )}
              </svg>
            </div>

            {/* Tappable organelle selectors */}
            <div className="flex flex-wrap gap-1.5">
              {visibleOrgs.map((org) => (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => pickOrganelle(org)}
                  className={`min-h-[40px] rounded-xl border px-3 py-1.5 text-xs font-semibold active:scale-95 ${
                    selectedOrg.id === org.id
                      ? 'border-cyan-400 bg-cyan-400 text-slate-950 font-bold'
                      : 'border-violet-800/70 bg-[#261D45] text-violet-100'
                  }`}
                >
                  {org.name}
                </button>
              ))}
            </div>

            {/* Selected Organelle Card */}
            <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-display text-base font-bold text-violet-50">{selectedOrg.name}</h4>
                <span className="text-xs font-semibold text-cyan-300">Benzetme: {selectedOrg.analogy}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-violet-200/90">{selectedOrg.role}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 5-step interactive hierarchy */}
            <div className="flex items-center justify-between gap-1">
              {HIERARCHY_STEPS.map((st, idx) => (
                <button
                  key={st.title}
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setHierStep(idx);
                    setCheckedHierarchy(true);
                  }}
                  className={`min-h-[44px] flex-1 rounded-xl border px-1 py-2 text-[11px] font-bold transition-all active:scale-95 ${
                    hierStep === idx
                      ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                      : idx < hierStep
                      ? 'border-cyan-400/40 bg-cyan-500/15 text-cyan-200'
                      : 'border-violet-800/70 bg-[#261D45] text-violet-200/75'
                  }`}
                >
                  {st.title}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#241B45] to-[#17112D] p-4 text-center space-y-2">
              <div className="text-xs font-semibold text-cyan-300">
                Basitten Karmaşığa · Aşama {HIERARCHY_STEPS[hierStep].level} / 5
              </div>
              <h4 className="font-display text-2xl font-extrabold text-white">
                {HIERARCHY_STEPS[hierStep].title}
              </h4>
              <div className="text-sm font-semibold text-emerald-400">
                Örnek: {HIERARCHY_STEPS[hierStep].example}
              </div>
              <p className="text-xs leading-relaxed text-violet-200/90">
                {HIERARCHY_STEPS[hierStep].desc}
              </p>
              <div className="pt-1 text-xs text-violet-300/75">
                Günlük hayat benzetmesi: <strong className="text-violet-50">{HIERARCHY_STEPS[hierStep].analogy}</strong>
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={4}
              value={hierStep}
              aria-label="Hücreden organizmaya aşama"
              onChange={(e) => {
                setHierStep(Number(e.target.value));
                setCheckedHierarchy(true);
              }}
              className="h-3 w-full cursor-pointer accent-cyan-400"
            />
          </div>
        )}
      </div>

      {/* Checklist */}
      <div className="rounded-2xl border border-violet-900/80 bg-[#1C1534] p-4 space-y-3">
        <div className="space-y-1.5 text-sm text-violet-100">
          <div className="flex items-center gap-2">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${inspectedOrgs.length >= 4 ? 'bg-cyan-400 text-slate-950' : 'bg-[#2B2050] text-violet-300'}`}>
              {inspectedOrgs.length >= 4 ? <Check className="h-3.5 w-3.5" /> : '1'}
            </span>
            <span>Bitki ve hayvan hücrelerinde en az 4 organele dokun ({inspectedOrgs.length}/4)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${checkedHierarchy ? 'bg-cyan-400 text-slate-950' : 'bg-[#2B2050] text-violet-300'}`}>
              {checkedHierarchy ? <Check className="h-3.5 w-3.5" /> : '2'}
            </span>
            <span>Hücre → Organizma sıralamasını incele</span>
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
              ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
              : 'bg-[#261D45] text-violet-300/45 cursor-not-allowed'
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
// 3.2 İSKELET, EKLEM VE KAS HAREKET MODELİ
// ---------------------------------------------------------------------------
const BODY_PARTS = [
  {
    id: 'skull',
    name: 'Kafatası',
    category: 'Yassı Kemik · Oynamaz Eklem',
    detail: 'Beynimizi darbelere karşı korur. Kemikleri birbirine hiç hareket etmeyen oynamaz eklemlerle bağlıdır.',
  },
  {
    id: 'spine',
    name: 'Omurga',
    category: 'Yarı Oynar Eklem',
    detail: 'Dik durmamızı ve eğilip doğrulmamızı sağlar. Omurga kemikleri arasında kısıtlı hareket eden yarı oynar eklemler bulunur.',
  },
  {
    id: 'arm',
    name: 'Kol & Dirsek',
    category: 'Uzun Kemik · Oynar Eklem · Çizgili Kas',
    detail: 'Pazu ve ön kol uzun kemiktir; dirsek oynar eklemdir. Çizgili kasların kasılıp gevşemesiyle kolumuz bükülür!',
  },
  {
    id: 'wrist',
    name: 'El Bileği',
    category: 'Kısa Kemik',
    detail: 'El ve ayak bileklerindeki boyu ve eni birbirine yakın olan kemikler kısa kemiklere örnektir.',
  },
  {
    id: 'heart',
    name: 'Kalp',
    category: 'Kalp Kası',
    detail: 'Sadece kalpte bulunan kalp kası, anne karnından yaşam sonuna kadar yorulmadan çalışır.',
  },
  {
    id: 'stomach',
    name: 'Mide (İç Organ)',
    category: 'Düz Kas',
    detail: 'Mide ve bağırsak gibi iç organların yapısında isteğimiz dışında düzenli çalışan düz kaslar bulunur.',
  },
];

export const SkeletonMotionSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [selectedPart, setSelectedPart] = useState(BODY_PARTS[0]);
  const [visitedParts, setVisitedParts] = useState<string[]>(['skull']);
  const [armBend, setArmBend] = useState(25);
  const [testedArm, setTestedArm] = useState(false);

  const selectPart = (part: (typeof BODY_PARTS)[number]) => {
    soundEngine.playTap();
    setSelectedPart(part);
    setVisitedParts((prev) => (prev.includes(part.id) ? prev : [...prev, part.id]));
  };

  const ready = visitedParts.length >= 4 && testedArm;

  const elbowX = 110;
  const elbowY = 92;
  const forearmLen = 76;
  const angleRad = (-armBend * Math.PI) / 180;
  const handX = elbowX + Math.cos(angleRad) * forearmLen;
  const handY = elbowY + Math.sin(angleRad) * forearmLen;
  const bicepBulge = 10 + (armBend / 105) * 10;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-violet-900/80 bg-[#1C1534] p-4 shadow-sm space-y-4">
        {/* Body part selector grid */}
        <div>
          <div className="mb-2 text-xs font-semibold text-violet-200/80">Vücut Bölgesine Dokun ve Yapısını Keşfet:</div>
          <div className="grid grid-cols-3 gap-1.5">
            {BODY_PARTS.map((bp) => {
              const active = selectedPart.id === bp.id;
              const seen = visitedParts.includes(bp.id);
              return (
                <button
                  key={bp.id}
                  type="button"
                  onClick={() => selectPart(bp)}
                  className={`min-h-[44px] rounded-xl border px-2 py-2 text-xs font-semibold transition-all active:scale-95 ${
                    active
                      ? 'border-cyan-400 bg-cyan-400 text-slate-950 font-bold'
                      : seen
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                      : 'border-violet-800/70 bg-[#261D45] text-violet-100'
                  }`}
                >
                  {bp.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Body Part Detail */}
        <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-3.5">
          <div className="text-xs font-semibold text-cyan-300">{selectedPart.category}</div>
          <h4 className="mt-0.5 font-display text-lg font-bold text-white">{selectedPart.name}</h4>
          <p className="mt-1 text-xs leading-relaxed text-violet-200/90">{selectedPart.detail}</p>
        </div>

        {/* Interactive Elbow & Bicep Muscle Flex Model */}
        <div className="rounded-xl border border-violet-800/60 bg-[#120D23] p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-violet-100">Kas & Oynar Eklem Modeli</span>
            <span className="font-semibold text-fuchsia-300">
              {armBend > 60 ? 'Pazu Kası Kasıldı!' : 'Pazu Kası Gevşedi'}
            </span>
          </div>

          <svg viewBox="0 0 240 135" className="mx-auto h-36 w-full max-w-xs select-none">
            {/* Upper arm bone (Humerus) */}
            <line x1="34" y1="92" x2={elbowX} y2={elbowY} stroke="#CBD5E1" strokeWidth="14" strokeLinecap="round" />
            <line x1="34" y1="92" x2={elbowX} y2={elbowY} stroke="#64748B" strokeWidth="2" strokeLinecap="round" />

            {/* Forearm bone */}
            <line x1={elbowX} y1={elbowY} x2={handX} y2={handY} stroke="#CBD5E1" strokeWidth="12" strokeLinecap="round" />
            <line x1={elbowX} y1={elbowY} x2={handX} y2={handY} stroke="#64748B" strokeWidth="2" strokeLinecap="round" />

            {/* Contracting Bicep Muscle */}
            <path
              d={`M 42 84 Q 76 ${74 - bicepBulge} ${elbowX + 12} ${elbowY - 10} Q 76 ${86} 42 84 Z`}
              fill="#F43F5E"
              opacity="0.92"
            />

            {/* Elbow Oynar Eklem joint */}
            <circle cx={elbowX} cy={elbowY} r="9" fill="#22D3EE" stroke="#120D23" strokeWidth="2.5" />
            <text x={elbowX} y={elbowY + 22} textAnchor="middle" fill="#67E8F9" fontSize="9.5" fontWeight="700">
              Oynar Eklem
            </text>

            {/* Hand */}
            <circle cx={handX} cy={handY} r="8" fill="#FDBA74" stroke="#EA580C" strokeWidth="1.5" />
          </svg>

          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-violet-200/80">
              <span>Kolu Bük / Uzat</span>
              <span className="tabular-nums font-bold text-cyan-300">{armBend}°</span>
            </div>
            <input
              type="range"
              min={5}
              max={105}
              value={armBend}
              aria-label="Kol bükme açısı"
              onChange={(e) => {
                const v = Number(e.target.value);
                setArmBend(v);
                if (v >= 70) setTestedArm(true);
              }}
              className="h-3 w-full cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="rounded-2xl border border-violet-900/80 bg-[#1C1534] p-4 space-y-3">
        <div className="space-y-1.5 text-sm text-violet-100">
          <div className="flex items-center gap-2">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${visitedParts.length >= 4 ? 'bg-cyan-400 text-slate-950' : 'bg-[#2B2050] text-violet-300'}`}>
              {visitedParts.length >= 4 ? <Check className="h-3.5 w-3.5" /> : '1'}
            </span>
            <span>En az 4 farklı kemik, eklem veya kas bölgesini incele ({visitedParts.length}/4)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${testedArm ? 'bg-cyan-400 text-slate-950' : 'bg-[#2B2050] text-violet-300'}`}>
              {testedArm ? <Check className="h-3.5 w-3.5" /> : '2'}
            </span>
            <span>Sürgüyü çekerek kolu bük ve kasın kasılmasını izle</span>
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
              ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
              : 'bg-[#261D45] text-violet-300/45 cursor-not-allowed'
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
// 3.2 HÜCREDEN ORGANİZMAYA: Basitten Karmaşığa Piramit + 3 Kitap Benzetmesi
// ---------------------------------------------------------------------------
const ORGANISM_LEVELS = [
  {
    idx: 0,
    name: 'Hücre',
    body: 'Kas Hücresi / Akciğer Hücresi',
    village: 'Tuğla',
    country: 'Ev',
    school: 'Tuğla',
    desc: 'Canlılık özelliği gösteren en küçük yapı birimidir.',
  },
  {
    idx: 1,
    name: 'Doku',
    body: 'Kas Dokusu / Akciğer Dokusu',
    village: 'Duvar',
    country: 'Mahalle',
    school: 'Duvar',
    desc: 'Aynı görevi yerine getirmek için bir araya gelen hücreler topluluğudur.',
  },
  {
    idx: 2,
    name: 'Organ',
    body: 'Kalp / Kol / Akciğer / Beyin',
    village: 'Oda',
    country: 'İlçe',
    school: 'Sınıf',
    desc: 'Farklı dokuların belirli bir görevi yapmak için bir araya gelmesiyle oluşur.',
  },
  {
    idx: 3,
    name: 'Sistem',
    body: 'Dolaşım / Destek-Hareket / Solunum Sistemi',
    village: 'Ev',
    country: 'İl',
    school: 'Kat (6 Katlı Okulun 1 Katı)',
    desc: 'Belirli görevleri yerine getiren organların bir araya gelmesiyle oluşur.',
  },
  {
    idx: 4,
    name: 'Organizma',
    body: 'İnsan / Kuş / Elma Ağacı',
    village: 'Köy',
    country: 'Ülke',
    school: 'Okul Binası',
    desc: 'Tüm sistemlerin uyumlu birleşimiyle oluşan bağımsız canlıdır.',
  },
];

export const CellToOrganismSim: React.FC<SimProps> = ({ onComplete, isCompleted }) => {
  const [step, setStep] = useState(0);
  const [analogy, setAnalogy] = useState<'village' | 'country' | 'school'>('village');
  const [visitedSteps, setVisitedSteps] = useState<number[]>([0]);
  const [switchedAnalogy, setSwitchedAnalogy] = useState(false);

  const cur = ORGANISM_LEVELS[step];
  const analogyText =
    analogy === 'village'
      ? cur.village
      : analogy === 'country'
      ? cur.country
      : cur.school;

  const ready = visitedSteps.length >= 4 && switchedAnalogy;

  const pickStep = (idx: number) => {
    soundEngine.playTap();
    setStep(idx);
    if (!visitedSteps.includes(idx)) setVisitedSteps((prev) => [...prev, idx]);
  };

  return (
    <div className="rounded-3xl border border-violet-900/80 bg-[#1C1534] p-4 sm:p-5 text-violet-50 space-y-4">
      {/* Analogy Switcher (MEB Kitabı Benzetmeleri) */}
      <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-black/30 p-1">
        {[
          { id: 'village' as const, label: 'Köy Benzetmesi' },
          { id: 'country' as const, label: 'Ülke Benzetmesi' },
          { id: 'school' as const, label: 'Okul Binası' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setAnalogy(item.id);
              setSwitchedAnalogy(true);
            }}
            className={`min-h-[40px] rounded-lg px-2 text-[11px] font-extrabold transition-colors ${
              analogy === item.id
                ? 'bg-cyan-400 text-slate-950'
                : 'text-violet-200 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Interactive 5-Step Escalating Ladder */}
      <div className="space-y-1.5">
        {ORGANISM_LEVELS.map((lvl) => {
          const active = lvl.idx === step;
          const visited = visitedSteps.includes(lvl.idx);
          return (
            <button
              key={lvl.idx}
              type="button"
              onClick={() => pickStep(lvl.idx)}
              className={`min-h-[46px] w-full rounded-xl border px-3.5 py-2 text-left transition-all active:scale-[0.99] flex items-center justify-between gap-2 ${
                active
                  ? 'border-cyan-300 bg-cyan-400/20 text-white ring-2 ring-cyan-400/40'
                  : 'border-violet-800/80 bg-[#261D45]/75 text-violet-100'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                    active
                      ? 'bg-cyan-400 text-slate-950'
                      : visited
                      ? 'bg-emerald-500 text-white'
                      : 'bg-violet-950 text-violet-300'
                  }`}
                >
                  {lvl.idx + 1}
                </span>
                <span className="font-display text-sm font-extrabold">{lvl.name}</span>
              </div>
              <span className="truncate text-xs font-bold text-fuchsia-300">
                ≈ {analogy === 'village' ? lvl.village : analogy === 'country' ? lvl.country : lvl.school}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Level Detail Card */}
      <div className="rounded-2xl border border-violet-800/70 bg-[#120D21] p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-extrabold">
          <span className="text-cyan-400">{step + 1}. Basamak · {cur.name}</span>
          <span className="text-fuchsia-300">Benzetme: {analogyText}</span>
        </div>
        <p className="text-xs leading-relaxed text-violet-100">{cur.desc}</p>
        <div className="rounded-xl bg-violet-950/70 px-3 py-2 text-xs font-semibold text-cyan-200">
          Canlı Örneği: {cur.body}
        </div>
      </div>

      <button
        type="button"
        disabled={!ready && !isCompleted}
        onClick={() => {
          soundEngine.playUnlock();
          onComplete();
        }}
        className={`min-h-[48px] w-full rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
          isCompleted || ready
            ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
            : 'bg-[#261D45] text-violet-300/45 cursor-not-allowed'
        }`}
      >
        {isCompleted || ready ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
        <span>
          {isCompleted
            ? 'Keşif Tamamlandı · Devam Et'
            : ready
            ? 'Keşfi Tamamla (+40 XP)'
            : `En az 4 basamağı incele (${visitedSteps.length}/4) ve başka bir benzetme seç`}
        </span>
      </button>
    </div>
  );
};
