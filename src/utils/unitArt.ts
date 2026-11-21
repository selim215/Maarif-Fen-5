// Self-contained high-contrast dark-mode SVG illustrations for Unit 3.2 and Semester 2 (Units 4-7)
function toSvgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;
}

export const UNIT_ART = {
  // 3.2 Hücreden Organizmaya (Purple/Cyan Bio-Hierarchy)
  cellOrganism: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
      <defs>
        <linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1E143B"/>
          <stop offset="100%" stop-color="#0D2233"/>
        </linearGradient>
        <radialGradient id="g3" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#22D3EE" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="640" height="400" fill="url(#bg3)"/>
      <rect width="640" height="400" fill="url(#g3)"/>
      <g opacity="0.2" stroke="#A78BFA" stroke-width="1.5" fill="none">
        <path d="M60 220 Q180 120 320 190 T580 160"/>
        <path d="M40 280 Q210 210 360 260 T600 220"/>
      </g>
      <!-- 5 escalating steps: Hücre -> Doku -> Organ -> Sistem -> Organizma -->
      <g transform="translate(46,230)">
        <circle cx="44" cy="44" r="34" fill="#312060" stroke="#22D3EE" stroke-width="3"/>
        <circle cx="44" cy="44" r="11" fill="#C084FC"/>
        <text x="44" y="102" fill="#E0E7FF" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle">Hücre</text>
      </g>
      <path d="M132 270 L158 256" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
      <g transform="translate(158,194)">
        <rect x="6" y="10" width="84" height="68" rx="16" fill="#2A1D54" stroke="#38BDF8" stroke-width="3"/>
        <circle cx="30" cy="34" r="10" fill="#22D3EE" opacity="0.8"/>
        <circle cx="62" cy="34" r="10" fill="#22D3EE" opacity="0.8"/>
        <circle cx="30" cy="58" r="10" fill="#A78BFA" opacity="0.8"/>
        <circle cx="62" cy="58" r="10" fill="#A78BFA" opacity="0.8"/>
        <text x="48" y="102" fill="#E0E7FF" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle">Doku</text>
      </g>
      <path d="M254 236 L280 218" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
      <g transform="translate(278,154)">
        <rect x="4" y="8" width="88" height="72" rx="20" fill="#311E5E" stroke="#C084FC" stroke-width="3"/>
        <path d="M48 64 C28 50 24 34 34 26 C42 20 48 28 48 32 C48 28 54 20 62 26 C72 34 68 50 48 64 Z" fill="#F472B6"/>
        <text x="48" y="104" fill="#E0E7FF" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle">Organ</text>
      </g>
      <path d="M376 196 L402 178" stroke="#C084FC" stroke-width="3" stroke-linecap="round"/>
      <g transform="translate(400,114)">
        <rect x="4" y="8" width="90" height="74" rx="20" fill="#261E52" stroke="#34D399" stroke-width="3"/>
        <circle cx="49" cy="32" r="10" fill="#34D399"/>
        <path d="M32 62 C32 48 66 48 66 62" stroke="#67E8F9" stroke-width="4" fill="none" stroke-linecap="round"/>
        <line x1="49" y1="42" x2="49" y2="66" stroke="#34D399" stroke-width="4" stroke-linecap="round"/>
        <text x="49" y="106" fill="#E0E7FF" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle">Sistem</text>
      </g>
      <path d="M498 156 L524 138" stroke="#34D399" stroke-width="3" stroke-linecap="round"/>
      <g transform="translate(514,72)">
        <circle cx="54" cy="54" r="46" fill="#1F2F4D" stroke="#FDE047" stroke-width="3.5"/>
        <circle cx="54" cy="34" r="11" fill="#FDE047"/>
        <path d="M34 64 Q54 46 74 64" stroke="#67E8F9" stroke-width="5" fill="none" stroke-linecap="round"/>
        <line x1="54" y1="46" x2="54" y2="78" stroke="#FDE047" stroke-width="5" stroke-linecap="round"/>
        <text x="54" y="120" fill="#FEF08A" font-family="sans-serif" font-size="14" font-weight="800" text-anchor="middle">Organizma</text>
      </g>
    </svg>
  `),

  // 4.1 Işığın Yayılması (Deep Crimson/Rose Optical Rays)
  lightPropagation: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
      <defs>
        <linearGradient id="bg4a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2A0E1E"/>
          <stop offset="100%" stop-color="#140812"/>
        </linearGradient>
        <radialGradient id="sun4" cx="24%" cy="50%" r="48%">
          <stop offset="0%" stop-color="#FDE047" stop-opacity="0.95"/>
          <stop offset="35%" stop-color="#FB7185" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#FB7185" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="640" height="400" fill="url(#bg4a)"/>
      <rect width="640" height="400" fill="url(#sun4)"/>
      <!-- Light source emitting straight rays in all directions -->
      <circle cx="155" cy="200" r="34" fill="#FDE047"/>
      <circle cx="155" cy="200" r="48" fill="none" stroke="#FDE047" stroke-width="2" opacity="0.45"/>
      <g stroke="#FDE047" stroke-width="3.5" stroke-linecap="round">
        <line x1="205" y1="200" x2="570" y2="200"/>
        <line x1="200" y1="176" x2="545" y2="105"/>
        <line x1="200" y1="224" x2="545" y2="295"/>
        <line x1="184" y1="158" x2="430" y2="48"/>
        <line x1="184" y1="242" x2="430" y2="352"/>
        <line x1="120" y1="168" x2="45" y2="95" opacity="0.7"/>
        <line x1="120" y1="232" x2="45" y2="305" opacity="0.7"/>
        <line x1="155" y1="148" x2="155" y2="45" opacity="0.75"/>
        <line x1="155" y1="252" x2="155" y2="355" opacity="0.75"/>
      </g>
      <!-- Arrowheads showing ray direction -->
      <polygon points="576,200 560,192 560,208" fill="#FDE047"/>
      <polygon points="552,104 534,100 538,115" fill="#FDE047"/>
      <polygon points="552,296 538,285 534,300" fill="#FDE047"/>
      <!-- Aligned 3 cards silhouette -->
      <g fill="#4C1D35" stroke="#FB7185" stroke-width="2">
        <rect x="300" y="130" width="14" height="58" rx="3"/>
        <rect x="300" y="212" width="14" height="58" rx="3"/>
        <rect x="415" y="130" width="14" height="58" rx="3"/>
        <rect x="415" y="212" width="14" height="58" rx="3"/>
      </g>
    </svg>
  `),

  // 4.2 Işığın Madde ile Etkileşimi (Transparent / Translucent / Opaque)
  lightMatter: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
      <defs>
        <linearGradient id="bg4b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#290D1F"/>
          <stop offset="100%" stop-color="#170915"/>
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#bg4b)"/>
      <!-- 3 horizontal lanes -->
      <!-- Row 1: Saydam -->
      <line x1="50" y1="95" x2="585" y2="95" stroke="#FDE047" stroke-width="6" stroke-linecap="round"/>
      <rect x="275" y="58" width="26" height="74" rx="6" fill="#38BDF8" fill-opacity="0.22" stroke="#7DD3FC" stroke-width="2.5"/>
      <text x="480" y="80" fill="#7DD3FC" font-family="sans-serif" font-size="16" font-weight="800">SAYDAM</text>
      <!-- Row 2: Yarı Saydam -->
      <line x1="50" y1="200" x2="275" y2="200" stroke="#FDE047" stroke-width="6" stroke-linecap="round"/>
      <line x1="301" y1="200" x2="570" y2="200" stroke="#FDE047" stroke-width="3" stroke-dasharray="10 8" opacity="0.65"/>
      <rect x="275" y="163" width="26" height="74" rx="6" fill="#F9A8D4" fill-opacity="0.38" stroke="#F472B6" stroke-width="2.5"/>
      <text x="455" y="185" fill="#F9A8D4" font-family="sans-serif" font-size="16" font-weight="800">YARI SAYDAM</text>
      <!-- Row 3: Opak -->
      <line x1="50" y1="305" x2="275" y2="305" stroke="#FDE047" stroke-width="6" stroke-linecap="round"/>
      <rect x="275" y="268" width="30" height="74" rx="6" fill="#7C2D12" stroke="#FB923C" stroke-width="2.5"/>
      <rect x="305" y="274" width="265" height="62" rx="8" fill="#09040A" opacity="0.72"/>
      <text x="475" y="295" fill="#FDA4AF" font-family="sans-serif" font-size="16" font-weight="800">OPAK (GEÇİRMEZ)</text>
    </svg>
  `),

  // 4.3 Tam Gölge (Shadow Projection)
  lightShadow: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
      <defs>
        <linearGradient id="bg4c" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#270D1D"/>
          <stop offset="100%" stop-color="#110710"/>
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#bg4c)"/>
      <!-- Screen -->
      <rect x="520" y="42" width="24" height="316" rx="8" fill="#4C1D35" stroke="#FB7185" stroke-width="2"/>
      <!-- Light cone -->
      <polygon points="90,200 520,86 520,314" fill="#FDE047" opacity="0.16"/>
      <!-- Shadow umbra behind ball -->
      <polygon points="278,150 520,86 520,314 278,250" fill="#09030A" opacity="0.88"/>
      <!-- Boundary rays -->
      <line x1="90" y1="200" x2="520" y2="86" stroke="#FDE047" stroke-width="2.5" stroke-dasharray="8 6"/>
      <line x1="90" y1="200" x2="520" y2="314" stroke="#FDE047" stroke-width="2.5" stroke-dasharray="8 6"/>
      <!-- Lamp -->
      <circle cx="90" cy="200" r="22" fill="#FDE047"/>
      <circle cx="90" cy="200" r="34" fill="#FDE047" opacity="0.25"/>
      <!-- Opaque sphere -->
      <circle cx="278" cy="200" r="50" fill="#3B1B30" stroke="#FB7185" stroke-width="3"/>
      <!-- Projected shadow oval -->
      <ellipse cx="532" cy="200" rx="10" ry="114" fill="#050206"/>
    </svg>
  `),

  // 5.1 Maddenin Tanecikli Yapısı (Solid / Liquid / Gas)
  matterParticles: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
      <defs>
        <linearGradient id="bg5a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0E1733"/>
          <stop offset="100%" stop-color="#172448"/>
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#bg5a)"/>
      <!-- Katı -->
      <rect x="44" y="88" width="160" height="190" rx="20" fill="#132145" stroke="#38BDF8" stroke-width="3"/>
      <g fill="#38BDF8">
        <circle cx="88" cy="144" r="14"/><circle cx="124" cy="144" r="14"/><circle cx="160" cy="144" r="14"/>
        <circle cx="88" cy="180" r="14"/><circle cx="124" cy="180" r="14"/><circle cx="160" cy="180" r="14"/>
        <circle cx="88" cy="216" r="14"/><circle cx="124" cy="216" r="14"/><circle cx="160" cy="216" r="14"/>
      </g>
      <text x="124" y="314" fill="#BAE6FD" font-family="sans-serif" font-size="18" font-weight="800" text-anchor="middle">KATI</text>
      <!-- Sıvı -->
      <rect x="240" y="88" width="160" height="190" rx="20" fill="#132145" stroke="#22D3EE" stroke-width="3"/>
      <g fill="#22D3EE">
        <circle cx="278" cy="166" r="13"/><circle cx="322" cy="158" r="13"/><circle cx="362" cy="174" r="13"/>
        <circle cx="294" cy="206" r="13"/><circle cx="342" cy="212" r="13"/><circle cx="272" cy="242" r="13"/>
        <circle cx="318" cy="246" r="13"/><circle cx="366" cy="242" r="13"/>
      </g>
      <text x="320" y="314" fill="#A5F3FC" font-family="sans-serif" font-size="18" font-weight="800" text-anchor="middle">SIVI</text>
      <!-- Gaz -->
      <rect x="436" y="88" width="160" height="190" rx="20" fill="#132145" stroke="#FB923C" stroke-width="3"/>
      <g fill="#FB923C">
        <circle cx="472" cy="126" r="12"/><circle cx="556" cy="142" r="12"/><circle cx="512" cy="196" r="12"/>
        <circle cx="468" cy="240" r="12"/><circle cx="562" cy="246" r="12"/>
      </g>
      <text x="516" y="314" fill="#FED7AA" font-family="sans-serif" font-size="18" font-weight="800" text-anchor="middle">GAZ</text>
    </svg>
  `),

  // 5.2 / 5.3 / 5.4 Isı, Sıcaklık, Hâl Değişimi ve Yalıtım
  matterThermal: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
      <defs>
        <linearGradient id="bg5b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#111A38"/>
          <stop offset="100%" stop-color="#1E142C"/>
        </linearGradient>
        <linearGradient id="flow5" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#F97316"/>
          <stop offset="100%" stop-color="#38BDF8"/>
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#bg5b)"/>
      <!-- Hot vessel -->
      <rect x="74" y="110" width="160" height="180" rx="22" fill="#431407" stroke="#FB923C" stroke-width="3.5"/>
      <text x="154" y="195" fill="#FDBA74" font-family="sans-serif" font-size="36" font-weight="800" text-anchor="middle">80°C</text>
      <text x="154" y="232" fill="#FED7AA" font-family="sans-serif" font-size="15" font-weight="700" text-anchor="middle">SICAK MADDE</text>
      <!-- Heat flow arrow -->
      <path d="M252 200 L380 200" stroke="url(#flow5)" stroke-width="10" stroke-linecap="round"/>
      <polygon points="396,200 370,184 370,216" fill="#38BDF8"/>
      <text x="320" y="172" fill="#FDE047" font-family="sans-serif" font-size="16" font-weight="800" text-anchor="middle">ISI AKIŞI</text>
      <!-- Cold vessel -->
      <rect x="406" y="110" width="160" height="180" rx="22" fill="#082F49" stroke="#38BDF8" stroke-width="3.5"/>
      <text x="486" y="195" fill="#7DD3FC" font-family="sans-serif" font-size="36" font-weight="800" text-anchor="middle">20°C</text>
      <text x="486" y="232" fill="#BAE6FD" font-family="sans-serif" font-size="15" font-weight="700" text-anchor="middle">SOĞUK MADDE</text>
    </svg>
  `),

  // 6.1 / 6.2 Yaşamımızdaki Elektrik (Electric Circuit & Glowing Bulb)
  electricCircuit: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
      <defs>
        <linearGradient id="bg6" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#211A0D"/>
          <stop offset="100%" stop-color="#120E08"/>
        </linearGradient>
        <radialGradient id="bulbGlow" cx="50%" cy="32%" r="36%">
          <stop offset="0%" stop-color="#FDE047" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="#FDE047" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="640" height="400" fill="url(#bg6)"/>
      <rect width="640" height="400" fill="url(#bulbGlow)"/>
      <!-- Circuit rectangle -->
      <rect x="130" y="115" width="380" height="185" rx="22" fill="none" stroke="#FACC15" stroke-width="5"/>
      <!-- Bulb Symbol at top center -->
      <circle cx="320" cy="115" r="38" fill="#2A2110" stroke="#FDE047" stroke-width="4.5"/>
      <line x1="295" y1="90" x2="345" y2="140" stroke="#FDE047" stroke-width="4"/>
      <line x1="345" y1="90" x2="295" y2="140" stroke="#FDE047" stroke-width="4"/>
      <!-- Battery Symbol at bottom center -->
      <rect x="275" y="275" width="90" height="50" fill="#17120A"/>
      <line x1="305" y1="268" x2="305" y2="332" stroke="#FACC15" stroke-width="5"/>
      <line x1="335" y1="282" x2="335" y2="318" stroke="#FB923C" stroke-width="9"/>
      <text x="288" y="280" fill="#FDE047" font-family="sans-serif" font-size="22" font-weight="800">+</text>
      <text x="348" y="282" fill="#FB923C" font-family="sans-serif" font-size="24" font-weight="800">−</text>
      <!-- Closed switch on right side -->
      <circle cx="510" cy="182" r="7" fill="#34D399"/>
      <circle cx="510" cy="232" r="7" fill="#34D399"/>
      <line x1="510" y1="182" x2="510" y2="232" stroke="#34D399" stroke-width="5"/>
    </svg>
  `),

  // 7.1 / 7.2 Sürdürülebilir Yaşam ve Geri Dönüşüm (Teal/Lime Recycling Loop)
  ecoRecycling: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
      <defs>
        <linearGradient id="bg7" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#092126"/>
          <stop offset="100%" stop-color="#07151A"/>
        </linearGradient>
        <radialGradient id="ecoGlow" cx="50%" cy="48%" r="48%">
          <stop offset="0%" stop-color="#2DD4BF" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#2DD4BF" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="640" height="400" fill="url(#bg7)"/>
      <rect width="640" height="400" fill="url(#ecoGlow)"/>
      <!-- Mobius / Recycling triangular loop -->
      <g fill="none" stroke-width="14" stroke-linecap="round" stroke-linejoin="round">
        <path d="M250 165 L320 74 L390 165" stroke="#2DD4BF"/>
        <path d="M405 190 L446 290 L330 290" stroke="#A3E635"/>
        <path d="M300 290 L194 290 L235 190" stroke="#38BDF8"/>
      </g>
      <circle cx="320" cy="204" r="44" fill="#0F2E34" stroke="#A3E635" stroke-width="3"/>
      <path d="M306 220 C306 196 322 184 340 184 C340 206 328 222 306 220 Z" fill="#A3E635"/>
      <text x="320" y="352" fill="#99F6E4" font-family="sans-serif" font-size="18" font-weight="800" text-anchor="middle">SIFIR ATIK · GERİ DÖNÜŞÜM</text>
    </svg>
  `),
};
