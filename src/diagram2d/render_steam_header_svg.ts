// High-precision Industrial SVG Renderer for Steam Headers & PRDS Distribution Network
// Based on Engineering Flow Diagram (S-65 / S-39 / S-12 / S-3 kg)

export function renderSteamHeaderSVG(showParticles = true): string {
  const particleAnims = showParticles
    ? `
      <style>
        @keyframes steamFlowFast {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes steamFlowMed {
          from { stroke-dashoffset: 32; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes waterFlow {
          from { stroke-dashoffset: 24; }
          to { stroke-dashoffset: 0; }
        }
        .flow-s65 {
          stroke-dasharray: 8 6;
          animation: steamFlowFast 0.8s linear infinite;
        }
        .flow-s39 {
          stroke-dasharray: 8 6;
          animation: steamFlowMed 1.0s linear infinite;
        }
        .flow-s12 {
          stroke-dasharray: 6 6;
          animation: steamFlowMed 1.2s linear infinite;
        }
        .flow-s3 {
          stroke-dasharray: 6 6;
          animation: steamFlowMed 1.5s linear infinite;
        }
        .flow-water {
          stroke-dasharray: 5 5;
          animation: waterFlow 1.2s linear infinite;
        }
        .pfd-inst-bubble {
          cursor: pointer;
          transition: transform 0.15s ease, stroke-width 0.15s ease;
        }
        .pfd-inst-bubble:hover {
          transform: scale(1.1);
        }
        .pfd-inst-bubble:hover circle {
          stroke-width: 2.8px;
        }
        .pfd-valve-hover:hover {
          opacity: 0.85;
        }
        .pfd-interactive-eq {
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .pfd-interactive-eq:hover {
          opacity: 0.9;
        }
        .pfd-stream-flag {
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .pfd-stream-flag:hover {
          transform: scale(1.2);
        }
      </style>
    `
    : '';

  return `
    <defs>
      ${particleAnims}
      <!-- Gradients -->
      <linearGradient id="s65Grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ef4444" />
        <stop offset="50%" stop-color="#f97316" />
        <stop offset="100%" stop-color="#fb923c" />
      </linearGradient>
      <linearGradient id="s39Grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="50%" stop-color="#eab308" />
        <stop offset="100%" stop-color="#facc15" />
      </linearGradient>
      <linearGradient id="s12Grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0284c7" />
        <stop offset="50%" stop-color="#06b6d4" />
        <stop offset="100%" stop-color="#38bdf8" />
      </linearGradient>
      <linearGradient id="s3Grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#059669" />
        <stop offset="50%" stop-color="#10b981" />
        <stop offset="100%" stop-color="#34d399" />
      </linearGradient>
      <linearGradient id="vesselGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc" />
        <stop offset="50%" stop-color="#ffffff" />
        <stop offset="100%" stop-color="#e2e8f0" />
      </linearGradient>
      <linearGradient id="turbineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e0f2fe" />
        <stop offset="100%" stop-color="#bae6fd" />
      </linearGradient>
      <linearGradient id="superheaterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#fee2e2" />
        <stop offset="100%" stop-color="#fca5a5" />
      </linearGradient>

      <!-- Markers -->
      <marker id="arrSteamS65" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#f97316" />
      </marker>
      <marker id="arrSteamS39" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#eab308" />
      </marker>
      <marker id="arrSteamS12" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#06b6d4" />
      </marker>
      <marker id="arrSteamS3" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
      </marker>
      <marker id="arrWater" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#00c8ef" />
      </marker>
    </defs>

    <!-- Background Blueprint Grid (Subtle Light DCS Theme) -->
    <rect width="1800" height="1180" fill="#ffffff" />
    <g stroke="#f1f5f9" stroke-width="1">
      ${Array.from({ length: 36 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="1180" />`).join('')}
      ${Array.from({ length: 24 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="1800" y2="${i * 50}" />`).join('')}
    </g>

    <!-- Title Header Banner -->
    <g transform="translate(40, 20)">
      <rect width="1720" height="52" rx="6" fill="#f8fafc" stroke="#0f172a" stroke-width="1.8" />
      <text x="24" y="24" fill="#0284c7" font-size="13" font-weight="700" font-family="'Cairo', sans-serif">
        DWG: 6112P-100-104-00 | STEAM HEADERS &amp; PRDS DISTRIBUTION NETWORK (شبكة مجمعات البخار والتخفيض والتبريد)
      </text>
      <text x="24" y="42" fill="#475569" font-size="10" font-weight="700" font-family="'Cairo', sans-serif">
        مواصفات الأنابيب الصناعية: ASTM A106 Gr. B / ASTM A335 P11 Seamless Carbon Steel (أنابيب كاربون ستيل معزولة حرارياً طبقاً لمعايير ASME B31.3)
      </text>
      <text x="1320" y="32" fill="#0f172a" font-size="11.5" font-weight="700">
        FOUR PRESSURE LEVELS: S-65 kg | S-39 kg | S-12 kg | S-3 kg
      </text>
    </g>

    <!-- =================================================================================== -->
    <!-- SECTION 1: STEAM GENERATION & SUPERHEATERS (TOP LEFT)                                -->
    <!-- =================================================================================== -->
    
    <!-- P-101 H.P Box (BFW Source for Desuperheating) -->
    <g class="pfd-interactive-eq" data-tag="P-101" transform="translate(60, 90)">
      <rect width="90" height="34" rx="4" fill="#0e2a47" stroke="#00c8ef" stroke-width="1.5" />
      <text x="45" y="22" text-anchor="middle" fill="#00e5ff" font-size="11" font-weight="700">P-101 H.P</text>
    </g>
    <!-- Line from P-101 H.P to TICA-152 -->
    <path d="M 150 107 L 290 107 L 290 128" fill="none" stroke="#00c8ef" stroke-width="2" />
    ${showParticles ? '<path d="M 150 107 L 290 107 L 290 128" fill="none" stroke="#67e8f9" stroke-width="2" class="flow-water" />' : ''}

    <!-- Steam Drum V-102 -->
    <g class="pfd-interactive-eq" data-tag="V-102" transform="translate(60, 150)">
      <rect width="85" height="50" rx="20" fill="url(#vesselGrad)" stroke="#f97316" stroke-width="2" />
      <line x1="15" y1="25" x2="70" y2="25" stroke="#38bdf8" stroke-dasharray="4 2" stroke-width="1.5" />
      <text x="42" y="30" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="700">V-102</text>
      <text x="42" y="44" text-anchor="middle" fill="#f97316" font-size="9">280°C / 65k</text>
    </g>

    <!-- Stream 1: Saturated Steam to E-103B -->
    <path d="M 145 175 L 180 175" fill="none" stroke="#f97316" stroke-width="3" />
    ${renderStreamBadge(180, 175, 1)}

    <!-- Superheater 1: E-103B -->
    <g class="pfd-interactive-eq" data-tag="E-103B" transform="translate(200, 150)">
      <rect width="65" height="50" rx="6" fill="#450a0a" stroke="#ef4444" stroke-width="1.8" />
      <path d="M 10 25 C 20 10, 20 40, 30 25 C 40 10, 40 40, 50 25" fill="none" stroke="#fca5a5" stroke-width="2.5" />
      <text x="32" y="44" text-anchor="middle" fill="#fecaca" font-size="10" font-weight="700">E-103B</text>
    </g>

    <!-- Interstage Line with TICA-152 Spray Station -->
    <path d="M 265 175 L 340 175" fill="none" stroke="#f97316" stroke-width="3" />
    ${showParticles ? '<path d="M 265 175 L 340 175" fill="none" stroke="#ffedd5" stroke-width="1.5" class="flow-s65" />' : ''}
    ${renderStreamBadge(295, 188, 2)}

    <!-- Spray Injection Valve & Bubble TICA-152 -->
    ${renderControlValve(290, 150, 'vert', '#00c8ef')}
    ${renderInstrumentBubble(290, 130, 'TICA', '152', '#00c8ef')}

    <!-- Superheater 2: E-103A -->
    <g class="pfd-interactive-eq" data-tag="E-103A" transform="translate(340, 150)">
      <rect width="65" height="50" rx="6" fill="#7f1d1d" stroke="#ef4444" stroke-width="2" />
      <path d="M 10 25 C 20 10, 20 40, 30 25 C 40 10, 40 40, 50 25" fill="none" stroke="#fca5a5" stroke-width="2.5" />
      <text x="32" y="44" text-anchor="middle" fill="#fecaca" font-size="10" font-weight="700">E-103A</text>
    </g>

    <!-- Steam Line from E-103A to S-65 Header -->
    <path d="M 405 175 L 530 175 L 530 230" fill="none" stroke="#f97316" stroke-width="4" />
    ${showParticles ? '<path d="M 405 175 L 530 175 L 530 230" fill="none" stroke="#fff7ed" stroke-width="2" class="flow-s65" />' : ''}
    ${renderStreamBadge(460, 160, 3)}

    <!-- TIC-156, FRQA-154, and PIC-155 Vent Station on HP Steam Line -->
    ${renderInstrumentBubble(440, 130, 'TIC', '156', '#f97316')}
    ${renderInstrumentBox(485, 195, 'FRQA-154', '#f97316')}
    
    <!-- Vent Line to Atmosphere with PIC-155 -->
    <path d="M 505 175 L 505 110" fill="none" stroke="#f97316" stroke-width="2" />
    ${renderControlValve(505, 140, 'vert', '#f97316')}
    ${renderInstrumentBubble(545, 140, 'PIC', '155', '#f97316')}
    ${renderAtmosphericVent(505, 100, '#f97316')}

    <!-- =================================================================================== -->
    <!-- HEADER 1: S-65 kg (HP STEAM HEADER - 65 kg/cm²G @ 435 °C)                           -->
    <!-- =================================================================================== -->
    <g class="pfd-interactive-eq" data-tag="S-65" transform="translate(60, 230)">
      <!-- Main Header Bar -->
      <rect width="1680" height="14" rx="3" fill="url(#s65Grad)" stroke="#c2410c" stroke-width="1" />
      <text x="-40" y="11" fill="#f97316" font-size="13" font-weight="900" font-family="monospace">S-65 kg</text>
    </g>

    <!-- Temperature & Flow Badges for S-65 -->
    <g transform="translate(1500, 210)">
      <rect width="110" height="30" rx="4" fill="#1e1005" stroke="#f97316" stroke-width="1.5" />
      <text x="55" y="20" text-anchor="middle" fill="#fb923c" font-size="12" font-weight="700">FRQA-159 B</text>
    </g>
    <g transform="translate(1640, 210)">
      <circle cx="20" cy="15" r="14" fill="#450a0a" stroke="#ef4444" stroke-width="1.5" />
      <text x="20" y="19" text-anchor="middle" fill="#fca5a5" font-size="10" font-weight="800">T</text>
      <text x="45" y="20" fill="#f97316" font-size="15" font-weight="900">435 °C</text>
    </g>

    <!-- HP Steam Consumers from S-65 (Top Right) -->
    <!-- 1. K-501 (CO2 Compressor Turbine) -->
    <path d="M 640 230 L 640 120 L 710 120" fill="none" stroke="#f97316" stroke-width="2.5" />
    ${renderStreamBadge(650, 160, 4)}
    <g class="pfd-interactive-eq" data-tag="K-501" transform="translate(715, 102)">
      <rect width="85" height="34" rx="4" fill="#172554" stroke="#3b82f6" stroke-width="1.5" />
      <text x="42" y="22" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="700">K-501</text>
      <text x="95" y="22" fill="#94a3b8" font-size="10">كباس اليوريا CO₂</text>
    </g>

    <!-- 2. K-302 (Syngas Compressor Turbine) -->
    <path d="M 670 230 L 670 155 L 710 155" fill="none" stroke="#f97316" stroke-width="2.5" />
    ${renderStreamBadge(680, 185, 5)}
    <g class="pfd-interactive-eq" data-tag="K-302" transform="translate(715, 138)">
      <rect width="85" height="34" rx="4" fill="#172554" stroke="#3b82f6" stroke-width="1.5" />
      <text x="42" y="22" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="700">K-302</text>
      <text x="95" y="22" fill="#94a3b8" font-size="10">كباس غاز التخليق</text>
    </g>

    <!-- 3. K-301 (Process Air Compressor Turbine - HP Inlet) -->
    <path d="M 700 230 L 700 190 L 710 190" fill="none" stroke="#f97316" stroke-width="2.5" />
    ${renderStreamBadge(705, 205, 6)}
    <g class="pfd-interactive-eq" data-tag="K-301" transform="translate(715, 174)">
      <rect width="85" height="34" rx="4" fill="#172554" stroke="#3b82f6" stroke-width="1.5" />
      <text x="42" y="22" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="700">K-301</text>
      <text x="95" y="22" fill="#94a3b8" font-size="10">كباس هواء العملية</text>
    </g>

    <!-- S-65 Vent Station on Far Right (PICA-162 with 1V and 2V) -->
    <path d="M 1450 230 L 1450 120" fill="none" stroke="#f97316" stroke-width="2" />
    ${renderControlValve(1450, 160, 'vert', '#f97316')}
    ${renderInstrumentBubble(1410, 160, 'PICA', '162', '#f97316')}
    <text x="1465" y="165" fill="#94a3b8" font-size="9">1V / 2V</text>
    ${renderAtmosphericVent(1450, 110, '#f97316')}

    <!-- =================================================================================== -->
    <!-- INTERCONNECTION / PRDS 1: FROM S-65 kg TO S-39 kg                                   -->
    <!-- =================================================================================== -->
    <!-- 1. K-301 Turbine Extraction to S-39 kg -->
    <g class="pfd-interactive-eq" data-tag="K-301" transform="translate(380, 290)">
      <!-- Turbine Symbol -->
      <polygon points="0 0, 50 15, 50 35, 0 50" fill="url(#turbineGrad)" stroke="#60a5fa" stroke-width="1.5" />
      <text x="22" y="30" fill="#ffffff" font-size="10" font-weight="700">K-301</text>
    </g>
    <!-- Inlet from S-65 to K-301 turbine -->
    <path d="M 390 244 L 390 290" fill="none" stroke="#f97316" stroke-width="3" />
    <!-- Exhaust from K-301 turbine down to S-39 -->
    <path d="M 430 315 L 430 450" fill="none" stroke="#eab308" stroke-width="3" />
    ${renderStreamBadge(445, 360, 7)}

    <!-- 2. Letdown Line 1: PRCA-341 1V (Pressure Reducing Station) -->
    <path d="M 580 244 L 580 450" fill="none" stroke="#f97316" stroke-width="2.5" />
    ${renderIsolationValve(580, 270, 'vert', '#f97316')}
    ${renderControlValve(580, 330, 'vert', '#f97316')}
    ${renderIsolationValve(580, 390, 'vert', '#eab308')}
    ${renderInstrumentBubble(520, 330, 'PRCA', '341', '#f97316')}
    <text x="548" y="350" fill="#94a3b8" font-size="9">1V</text>

    <!-- 3. Letdown Line 2: PRCA-342 2V (Parallel Pressure Reducing Station) -->
    <path d="M 780 244 L 780 450" fill="none" stroke="#f97316" stroke-width="2.5" />
    ${renderIsolationValve(780, 270, 'vert', '#f97316')}
    ${renderControlValve(780, 330, 'vert', '#f97316')}
    ${renderIsolationValve(780, 390, 'vert', '#eab308')}
    ${renderInstrumentBubble(720, 330, 'PRCA', '342', '#f97316')}
    <text x="748" y="350" fill="#94a3b8" font-size="9">2V</text>

    <!-- 4. Desuperheating Station (Water from P-101 H.P + Steam from S-65 to S-39) -->
    <g transform="translate(1000, 280)">
      <!-- Source Box P-101 H.P -->
      <rect width="80" height="30" rx="4" fill="#0e2a47" stroke="#00c8ef" stroke-width="1.5" />
      <text x="40" y="20" text-anchor="middle" fill="#00e5ff" font-size="11" font-weight="700">P-101 H.P</text>
    </g>
    <!-- Water injection line with TICA-341 and bypass PIC-343 -->
    <path d="M 1040 310 L 1040 360 L 1150 360 L 1150 430" fill="none" stroke="#00c8ef" stroke-width="2" />
    <!-- Steam from S-65 through letdown to S-39 -->
    <path d="M 940 244 L 940 360 L 1110 360 L 1110 450" fill="none" stroke="#f97316" stroke-width="2.5" />
    <!-- Stream indicator (S-65) -->
    <circle cx="940" cy="270" r="14" fill="#1e1005" stroke="#f97316" stroke-width="1" />
    <text x="940" y="274" text-anchor="middle" fill="#fb923c" font-size="8" font-weight="700">S-65</text>
    <!-- Valves on spray and steam -->
    ${renderControlValve(970, 360, 'horiz', '#f97316')}
    ${renderInstrumentBubble(970, 320, 'PIC', '343', '#f97316')}
    ${renderControlValve(1070, 360, 'horiz', '#00c8ef')}
    ${renderInstrumentBubble(1070, 320, 'TICA', '341', '#00c8ef')}
    ${renderStreamBadge(850, 420, 8)}

    <!-- =================================================================================== -->
    <!-- HEADER 2: S-39 kg (MP STEAM HEADER - 39 kg/cm²G @ 380 °C)                           -->
    <!-- =================================================================================== -->
    <g class="pfd-interactive-eq" data-tag="S-39" transform="translate(60, 450)">
      <!-- Main Header Bar -->
      <rect width="1680" height="14" rx="3" fill="url(#s39Grad)" stroke="#a16207" stroke-width="1" />
      <text x="-40" y="11" fill="#eab308" font-size="13" font-weight="900" font-family="monospace">S-39 kg</text>
    </g>

    <!-- Temperature Badge for S-39 -->
    <g transform="translate(1640, 430)">
      <circle cx="20" cy="15" r="14" fill="#422006" stroke="#eab308" stroke-width="1.5" />
      <text x="20" y="19" text-anchor="middle" fill="#fde047" font-size="10" font-weight="800">T</text>
      <text x="45" y="20" fill="#eab308" font-size="15" font-weight="900">380 °C</text>
    </g>

    <!-- MP Steam Consumers from S-39 (Left Side Box) -->
    <g transform="translate(60, 310)">
      <rect width="180" height="120" rx="5" fill="#111c2e" stroke="#eab308" stroke-width="1.5" />
      <text x="12" y="20" fill="#facc15" font-size="11" font-weight="700">مستهلكو بخار S-39 kg:</text>
      
      <text x="15" y="40" fill="#ffffff" font-size="10" font-weight="700">FRCA-102</text>
      <text x="90" y="40" fill="#94a3b8" font-size="9">بخار المصلح H-101</text>
      
      <text x="15" y="55" fill="#ffffff" font-size="10" font-weight="700">K-303</text>
      <text x="90" y="55" fill="#94a3b8" font-size="9">توربين إضافي</text>
      
      <text x="15" y="70" fill="#ffffff" font-size="10" font-weight="700">P-101 A-B</text>
      <text x="90" y="70" fill="#94a3b8" font-size="9">توربينات مضخات المراجل</text>
      
      <text x="15" y="85" fill="#ffffff" font-size="10" font-weight="700">P-711 A-B</text>
      <text x="90" y="85" fill="#94a3b8" font-size="9">توربينات الأمونيا</text>
      
      <text x="15" y="100" fill="#ffffff" font-size="10" font-weight="700">K-101A</text>
      <text x="90" y="100" fill="#94a3b8" font-size="9">مروحة هواء الاحتراق</text>

      <text x="15" y="115" fill="#ffffff" font-size="10" font-weight="700">K-401</text>
      <text x="90" y="115" fill="#94a3b8" font-size="9">كباس التبريد</text>
    </g>
    <!-- Lines feeding the consumer box -->
    <path d="M 240 370 L 300 370 L 300 450" fill="none" stroke="#eab308" stroke-width="2.5" />
    ${renderStreamBadge(265, 410, 9)}
    ${renderStreamBadge(210, 440, 10)}
    ${renderStreamBadge(160, 440, 11)}
    ${renderStreamBadge(110, 440, 12)}

    <!-- =================================================================================== -->
    <!-- INTERCONNECTION / PRDS 2: FROM S-39 kg TO S-12 kg                                   -->
    <!-- =================================================================================== -->
    <!-- Letdown Station PICA-164 1V -->
    <path d="M 780 464 L 780 670" fill="none" stroke="#eab308" stroke-width="2.5" />
    ${renderIsolationValve(780, 490, 'vert', '#eab308')}
    ${renderControlValve(780, 540, 'vert', '#eab308')}
    ${renderIsolationValve(780, 600, 'vert', '#06b6d4')}
    ${renderInstrumentBubble(710, 540, 'PICA', '164', '#eab308')}
    <text x="740" y="560" fill="#94a3b8" font-size="9">1V</text>

    <!-- Spray Desuperheater Station: Water from P-101 M.P + Steam from S-39 to S-12 -->
    <g transform="translate(1120, 500)">
      <rect width="80" height="30" rx="4" fill="#0e2a47" stroke="#00c8ef" stroke-width="1.5" />
      <text x="40" y="20" text-anchor="middle" fill="#00e5ff" font-size="11" font-weight="700">P-101 M.P</text>
    </g>
    <!-- Water injection line with TICA-153 and bypass 2C-152 -->
    <path d="M 1160 530 L 1160 590 L 1260 590 L 1260 650" fill="none" stroke="#00c8ef" stroke-width="2" />
    <!-- Steam line from S-39 -->
    <path d="M 1020 464 L 1020 590 L 1220 590 L 1220 670" fill="none" stroke="#eab308" stroke-width="2.5" />
    <!-- Stream indicator (S-39) -->
    <circle cx="1020" cy="490" r="14" fill="#1e1005" stroke="#eab308" stroke-width="1" />
    <text x="1020" y="494" text-anchor="middle" fill="#facc15" font-size="8" font-weight="700">S-39</text>
    <!-- Controllers on spray and steam -->
    ${renderControlValve(1060, 590, 'horiz', '#eab308')}
    ${renderInstrumentBubble(1060, 550, '2C', '152', '#eab308')}
    ${renderControlValve(1190, 590, 'horiz', '#00c8ef')}
    ${renderInstrumentBubble(1190, 550, 'TICA', '153', '#00c8ef')}
    ${renderStreamBadge(860, 640, 13)}

    <!-- =================================================================================== -->
    <!-- HEADER 3: S-12 kg (LP STEAM HEADER - 12 kg/cm²G @ 190 °C)                           -->
    <!-- =================================================================================== -->
    <!-- Blowdown Flash Drum V-109 Section (Far Left) -->
    <g transform="translate(60, 480)">
      <!-- P-104 Feed Box -->
      <rect width="60" height="24" rx="3" fill="#0e2a47" stroke="#00c8ef" stroke-width="1" />
      <text x="30" y="16" text-anchor="middle" fill="#00e5ff" font-size="9" font-weight="700">P-104</text>
    </g>
    <path d="M 90 504 L 90 530" fill="none" stroke="#00c8ef" stroke-width="1.5" />
    ${renderControlValve(90, 515, 'vert', '#00c8ef')}
    ${renderInstrumentBubble(130, 515, 'LRCA', '157', '#00c8ef')}

    <!-- Flash Vessel V-109 -->
    <g class="pfd-interactive-eq" data-tag="V-109" transform="translate(60, 530)">
      <rect width="65" height="48" rx="8" fill="url(#vesselGrad)" stroke="#06b6d4" stroke-width="1.5" />
      <text x="32" y="28" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">V-109</text>
      <text x="32" y="40" text-anchor="middle" fill="#67e8f9" font-size="8">Flash Drum</text>
    </g>
    <!-- Steam from V-109 to S-12 with PIC-166 & Vent -->
    <path d="M 125 554 L 320 554 L 320 670" fill="none" stroke="#06b6d4" stroke-width="2.5" />
    ${renderControlValve(220, 554, 'horiz', '#06b6d4')}
    ${renderInstrumentBubble(220, 515, 'PIC', '166', '#06b6d4')}
    <!-- Vent from V-109 -->
    <path d="M 280 554 L 280 500" fill="none" stroke="#06b6d4" stroke-width="1.5" />
    ${renderAtmosphericVent(280, 490, '#06b6d4')}
    ${renderStreamBadge(330, 610, 14)}

    <!-- LP Steam Consumers Box (E-112, E-711, Hot Condensate Reboilers) -->
    <g transform="translate(420, 500)">
      <rect width="180" height="75" rx="5" fill="#082f49" stroke="#06b6d4" stroke-width="1.5" />
      <text x="12" y="20" fill="#38bdf8" font-size="11" font-weight="700">E-112</text>
      <text x="12" y="38" fill="#38bdf8" font-size="11" font-weight="700">E-711 (B)</text>
      <text x="12" y="58" fill="#e2e8f0" font-size="10" font-weight="700">جميع المكثفات الساخنة</text>
    </g>
    <path d="M 510 575 L 510 670" fill="none" stroke="#06b6d4" stroke-width="2" />
    ${renderStreamBadge(530, 620, 15)}

    <!-- Main S-12 Header Bar -->
    <g class="pfd-interactive-eq" data-tag="S-12" transform="translate(60, 670)">
      <rect width="1680" height="14" rx="3" fill="url(#s12Grad)" stroke="#0891b2" stroke-width="1" />
      <text x="-40" y="11" fill="#06b6d4" font-size="13" font-weight="900" font-family="monospace">S-12 kg</text>
    </g>

    <!-- Temperature Badge for S-12 -->
    <g transform="translate(1640, 650)">
      <circle cx="20" cy="15" r="14" fill="#082f49" stroke="#06b6d4" stroke-width="1.5" />
      <text x="20" y="19" text-anchor="middle" fill="#67e8f9" font-size="10" font-weight="800">T</text>
      <text x="45" y="20" fill="#06b6d4" font-size="15" font-weight="900">190 °C</text>
    </g>

    <!-- =================================================================================== -->
    <!-- INTERCONNECTION / PRDS 3: FROM S-12 kg TO S-3 kg                                    -->
    <!-- =================================================================================== -->
    <!-- 1. Letdown Line 1: PICA-164 2V -->
    <path d="M 480 684 L 480 890" fill="none" stroke="#06b6d4" stroke-width="2.5" />
    ${renderIsolationValve(480, 715, 'vert', '#06b6d4')}
    ${renderControlValve(480, 765, 'vert', '#06b6d4')}
    ${renderIsolationValve(480, 815, 'vert', '#10b981')}
    ${renderInstrumentBubble(410, 765, 'PICA', '164', '#06b6d4')}
    <text x="440" y="785" fill="#94a3b8" font-size="9">2V</text>

    <!-- 2. K-101A Fan Turbine Exhaust to S-3 -->
    <g class="pfd-interactive-eq" data-tag="K-101A" transform="translate(620, 750)">
      <polygon points="0 0, 40 12, 40 28, 0 40" fill="url(#turbineGrad)" stroke="#60a5fa" stroke-width="1.5" />
      <text x="18" y="24" fill="#ffffff" font-size="9" font-weight="700">K-101A</text>
    </g>
    <!-- Inlet from S-39 to K-101A -->
    <path d="M 640 464 L 640 750" fill="none" stroke="#eab308" stroke-width="2" />
    <circle cx="640" cy="715" r="14" fill="#1e1005" stroke="#eab308" stroke-width="1" />
    <text x="640" y="719" text-anchor="middle" fill="#facc15" font-size="8" font-weight="700">S-39</text>
    <!-- Exhaust from K-101A to S-3 -->
    <path d="M 660 770 L 660 890" fill="none" stroke="#10b981" stroke-width="2.5" />
    ${renderStreamBadge(680, 830, 17)}

    <!-- 3. Letdown Line 2: PICA-161 -->
    <path d="M 880 684 L 880 890" fill="none" stroke="#06b6d4" stroke-width="2.5" />
    ${renderIsolationValve(880, 715, 'vert', '#06b6d4')}
    ${renderControlValve(880, 765, 'vert', '#06b6d4')}
    ${renderIsolationValve(880, 815, 'vert', '#10b981')}
    ${renderInstrumentBubble(810, 765, 'PICA', '161', '#06b6d4')}
    ${renderStreamBadge(900, 830, 16)}

    <!-- 4. Spray Desuperheating Station: Water from P-104 L-P + Steam to S-3 -->
    <g transform="translate(1200, 720)">
      <rect width="80" height="30" rx="4" fill="#0e2a47" stroke="#00c8ef" stroke-width="1.5" />
      <text x="40" y="20" text-anchor="middle" fill="#00e5ff" font-size="11" font-weight="700">P-104 L-P</text>
    </g>
    <!-- Water injection line with TICA-154 and PIC-160 -->
    <path d="M 1240 750 L 1240 810 L 1340 810 L 1340 870" fill="none" stroke="#00c8ef" stroke-width="2" />
    <!-- Steam line from S-39 / S-12 -->
    <path d="M 1080 684 L 1080 810 L 1300 810 L 1300 890" fill="none" stroke="#06b6d4" stroke-width="2.5" />
    <!-- Stream indicator (S-39) -->
    <circle cx="1080" cy="715" r="14" fill="#1e1005" stroke="#eab308" stroke-width="1" />
    <text x="1080" y="719" text-anchor="middle" fill="#facc15" font-size="8" font-weight="700">S-39</text>
    <!-- Controllers on spray and steam -->
    ${renderControlValve(1130, 810, 'horiz', '#06b6d4')}
    ${renderInstrumentBubble(1130, 770, 'PIC', '160', '#06b6d4')}
    ${renderControlValve(1270, 810, 'horiz', '#00c8ef')}
    ${renderInstrumentBubble(1270, 770, 'TICA', '154', '#00c8ef')}

    <!-- =================================================================================== -->
    <!-- HEADER 4: S-3 kg (LL-P STEAM HEADER - 3 kg/cm²G @ 245 °C)                           -->
    <!-- =================================================================================== -->
    <!-- Atmospheric Vent with PICA-163 on Left of S-3 -->
    <path d="M 180 890 L 180 770" fill="none" stroke="#10b981" stroke-width="2" />
    ${renderControlValve(180, 820, 'vert', '#10b981')}
    ${renderInstrumentBubble(230, 820, 'PICA', '163', '#10b981')}
    ${renderAtmosphericVent(180, 760, '#10b981')}

    <!-- Main S-3 Header Bar -->
    <g class="pfd-interactive-eq" data-tag="S-3" transform="translate(60, 890)">
      <rect width="1680" height="14" rx="3" fill="url(#s3Grad)" stroke="#059669" stroke-width="1" />
      <text x="-40" y="11" fill="#10b981" font-size="13" font-weight="900" font-family="monospace">S-3 kg</text>
    </g>

    <!-- Temperature Badge for S-3 -->
    <g transform="translate(1640, 870)">
      <circle cx="20" cy="15" r="14" fill="#064e3b" stroke="#10b981" stroke-width="1.5" />
      <text x="20" y="19" text-anchor="middle" fill="#6ee7b7" font-size="10" font-weight="800">T</text>
      <text x="45" y="20" fill="#10b981" font-size="15" font-weight="900">245 °C</text>
    </g>

    <!-- Consumers from S-3 Header (Bottom) -->
    <!-- 1. E-453 A-B Reboiler Exchangers -->
    <path d="M 520 904 L 520 960 L 610 960" fill="none" stroke="#10b981" stroke-width="2.5" />
    <g transform="translate(615, 942)">
      <rect width="90" height="36" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5" />
      <text x="45" y="22" text-anchor="middle" fill="#6ee7b7" font-size="11" font-weight="700">E-453 A-B</text>
    </g>
    ${renderStreamBadge(540, 930, 20)}

    <!-- 2. خدمات القسم (Plant Utility Services Box) -->
    <path d="M 750 904 L 750 960 L 780 960" fill="none" stroke="#10b981" stroke-width="2.5" />
    <g transform="translate(785, 925)">
      <rect width="220" height="155" rx="6" fill="#09271d" stroke="#10b981" stroke-width="1.8" />
      <text x="110" y="22" text-anchor="middle" fill="#34d399" font-size="12" font-weight="800">خدمات القسم (Services)</text>
      
      <!-- H-401 -->
      <rect x="15" y="32" width="70" height="24" rx="3" fill="#064e3b" stroke="#34d399" stroke-width="1" />
      <text x="50" y="48" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700">H-401</text>
      <text x="95" y="48" fill="#94a3b8" font-size="9">مسخن الغاز</text>

      <!-- H-101 -->
      <rect x="15" y="60" width="70" height="24" rx="3" fill="#064e3b" stroke="#34d399" stroke-width="1" />
      <text x="50" y="76" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700">H-101</text>
      <text x="95" y="76" fill="#94a3b8" font-size="9">المصلح الأولي</text>

      <!-- V-103 -->
      <rect x="15" y="88" width="70" height="24" rx="3" fill="#064e3b" stroke="#34d399" stroke-width="1" />
      <text x="50" y="104" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700">V-103</text>
      <text x="95" y="104" fill="#67e8f9" font-size="9">نزع الغازات Deaerator</text>

      <!-- E-202 -->
      <rect x="15" y="116" width="70" height="24" rx="3" fill="#064e3b" stroke="#34d399" stroke-width="1" />
      <text x="50" y="132" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700">E-202</text>
      <text x="95" y="132" fill="#94a3b8" font-size="9">مرجل بنفيلد Benfield</text>

      <!-- K-302 -->
      <rect x="120" y="116" width="85" height="24" rx="3" fill="#064e3b" stroke="#34d399" stroke-width="1" />
      <text x="162" y="132" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700">K-302 Glands</text>
    </g>
    ${renderStreamBadge(765, 930, 18)}
    ${renderStreamBadge(765, 960, 19)}

    <!-- Legend Box (Bottom Left) -->
    <g transform="translate(60, 950)">
      <rect width="400" height="130" rx="6" fill="#09182b" stroke="#1e3a5f" stroke-width="1.5" />
      <text x="16" y="22" fill="#00e5ff" font-size="12" font-weight="700">دليل خطوط ومجمعات البخار (Steam Legend):</text>
      
      <!-- S-65 -->
      <line x1="16" y1="40" x2="60" y2="40" stroke="#f97316" stroke-width="4" />
      <text x="70" y="44" fill="#fb923c" font-size="11" font-weight="700">S-65 kg (65 kg/cm²G @ 435°C): HP Steam للتوربينات الكبرى ومحطات PRDS</text>

      <!-- S-39 -->
      <line x1="16" y1="62" x2="60" y2="62" stroke="#eab308" stroke-width="4" />
      <text x="70" y="66" fill="#facc15" font-size="11" font-weight="700">S-39 kg (39 kg/cm²G @ 380°C): بخار عملية المصلح والتوربينات المساعدة</text>

      <!-- S-12 -->
      <line x1="16" y1="84" x2="60" y2="84" stroke="#06b6d4" stroke-width="4" />
      <text x="70" y="88" fill="#38bdf8" font-size="11" font-weight="700">S-12 kg (12 kg/cm²G @ 190°C): بخار التدفئة والمكثفات وتبخير V-109</text>

      <!-- S-3 -->
      <line x1="16" y1="106" x2="60" y2="106" stroke="#10b981" stroke-width="4" />
      <text x="70" y="110" fill="#34d399" font-size="11" font-weight="700">S-3 kg (3 kg/cm²G @ 245°C): بخار نزع الغازات V-103 وإعادة غليان E-202</text>
    </g>
  `;
}

// Helper: Render Instrument Bubble (circle with divider)
function renderInstrumentBubble(cx: number, cy: number, type: string, tag: string, color: string): string {
  return `
    <g class="pfd-inst-bubble" transform="translate(${cx}, ${cy})">
      <circle cx="0" cy="0" r="16" fill="#ffffff" stroke="${color}" stroke-width="1.8" />
      <line x1="-16" y1="0" x2="16" y2="0" stroke="${color}" stroke-width="1" />
      <text x="0" y="-4" text-anchor="middle" fill="${color}" font-size="8" font-weight="700">${type}</text>
      <text x="0" y="10" text-anchor="middle" fill="#0f172a" font-size="8" font-weight="700">${tag}</text>
    </g>
  `;
}

// Helper: Render Instrument Box (for totalizers / meters)
function renderInstrumentBox(x: number, y: number, text: string, color: string): string {
  return `
    <g transform="translate(${x}, ${y})">
      <rect width="70" height="20" rx="3" fill="#ffffff" stroke="${color}" stroke-width="1.5" />
      <text x="35" y="14" text-anchor="middle" fill="${color}" font-size="9" font-weight="700">${text}</text>
    </g>
  `;
}

// Helper: Render Control Valve
function renderControlValve(x: number, y: number, orientation: 'horiz' | 'vert', color: string): string {
  if (orientation === 'horiz') {
    return `
      <g class="pfd-valve-hover" transform="translate(${x}, ${y})">
        <!-- Valve Body -->
        <polygon points="-8 -6, 8 6, 8 -6, -8 6" fill="${color}" stroke="#0f172a" stroke-width="0.8" />
        <!-- Actuator stem & dome -->
        <line x1="0" y1="0" x2="0" y2="-12" stroke="${color}" stroke-width="1.5" />
        <path d="M -8 -12 C -8 -17, 8 -17, 8 -12 Z" fill="#ffffff" stroke="${color}" stroke-width="1.2" />
      </g>
    `;
  }
  return `
    <g class="pfd-valve-hover" transform="translate(${x}, ${y})">
      <!-- Valve Body -->
      <polygon points="-6 -8, 6 8, -6 8, 6 -8" fill="${color}" stroke="#0f172a" stroke-width="0.8" />
      <!-- Actuator stem & dome -->
      <line x1="0" y1="0" x2="12" y2="0" stroke="${color}" stroke-width="1.5" />
      <path d="M 12 -8 C 17 -8, 17 8, 12 8 Z" fill="#ffffff" stroke="${color}" stroke-width="1.2" />
    </g>
  `;
}

// Helper: Render Isolation Block Valve
function renderIsolationValve(x: number, y: number, orientation: 'horiz' | 'vert', color: string): string {
  if (orientation === 'horiz') {
    return `
      <g transform="translate(${x}, ${y})">
        <polygon points="-6 -5, 6 5, 6 -5, -6 5" fill="${color}" stroke="#0f172a" stroke-width="0.8" />
        <line x1="0" y1="0" x2="0" y2="-6" stroke="${color}" stroke-width="1" />
        <line x1="-4" y1="-6" x2="4" y2="-6" stroke="${color}" stroke-width="1" />
      </g>
    `;
  }
  return `
    <g transform="translate(${x}, ${y})">
      <polygon points="-5 -6, 5 6, -5 6, 5 -6" fill="${color}" stroke="#0f172a" stroke-width="0.8" />
      <line x1="0" y1="0" x2="6" y2="0" stroke="${color}" stroke-width="1" />
      <line x1="6" y1="-4" x2="6" y2="4" stroke="${color}" stroke-width="1" />
    </g>
  `;
}

// Helper: Render Atmospheric Vent
function renderAtmosphericVent(x: number, y: number, color: string): string {
  return `
    <g transform="translate(${x}, ${y})">
      <line x1="0" y1="0" x2="0" y2="-15" stroke="${color}" stroke-width="2" />
      <path d="M -8 -15 L 0 -22 L 8 -15 Z" fill="#ffffff" stroke="${color}" stroke-width="1.5" />
      <circle cx="0" cy="-30" r="8" fill="#ffffff" stroke="${color}" stroke-width="1.5" />
      <text x="0" y="-27" text-anchor="middle" fill="${color}" font-size="8" font-weight="700">V</text>
    </g>
  `;
}

// Helper: Render Stream Badge (Diamond / Pill)
function renderStreamBadge(x: number, y: number, streamNo: number): string {
  return `
    <g class="pfd-stream-flag" data-stream="${streamNo}" transform="translate(${x}, ${y})">
      <polygon points="0 -10, 11 0, 0 10, -11 0" fill="#0284c7" stroke="#ffffff" stroke-width="1.5" />
      <text x="0" y="3" text-anchor="middle" fill="#ffffff" font-size="8" font-weight="800" font-family="monospace">${streamNo}</text>
    </g>
  `;
}
