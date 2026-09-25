/**
 * render_steam_bfw_svg.ts
 * Vector Blueprint Renderer for Boiler Feed Water (BFW) & Steam Generation Circuits
 * Based on the Engineer's Process Flowsheet & DWG NO. 6112P 100-103-00
 * Khor Al-Zubair Phase-1 (M.O.I. Iraq Fertilizer Project No. 3)
 */

export function renderSteamBFWSVG(showParticles: boolean): string {
  const isAnim = showParticles ? 'pfd-pipe-anim' : '';

  return `
    <!-- BLUEPRINT DRAWING: BFW & STEAM GENERATION FLOWSHEET -->
    <g id="pfd-steam-bfw-layers">
      
      <!-- ========================================== -->
      <!-- TITLE BLOCK & SPECIFICATION GUIDE -->
      <!-- ========================================== -->
      <g transform="translate(2360, 800)">
        <rect width="600" height="250" fill="#f8fafc" stroke="#0f172a" stroke-width="1.8" rx="4"/>
        <text x="20" y="26" fill="#0284c7" font-size="14" font-weight="bold" font-family="'Cairo', sans-serif">IRAQ NO. 3 PROJECT - KHOR AL-ZUBAIR</text>
        <text x="20" y="46" fill="#334155" font-size="11" font-family="'Cairo', sans-serif">CUSTOMER: M.O.I. IRAQ - FERTILIZER COMPLEX</text>
        <text x="20" y="64" fill="#334155" font-size="11" font-family="'Cairo', sans-serif">PLANT: AMMONIA & STEAM UTILITIES (PHASE-1)</text>
        <text x="20" y="88" fill="#0f172a" font-size="14" font-weight="bold" font-family="'Cairo', sans-serif">BFW PREPARATION & STEAM GENERATION NETWORK</text>
        <text x="20" y="108" fill="#16a34a" font-size="12" font-weight="bold">DWG NO. 6112P 100-103-00 (REV. 4)</text>
        <line x1="0" y1="120" x2="600" y2="120" stroke="#0f172a" stroke-width="1"/>
        
        <text x="20" y="140" fill="#1e293b" font-size="10.5">ORDER NO: 563030-016</text>
        <text x="20" y="158" fill="#1e293b" font-size="10.5">HP STEAM RATING: 105 kg/cm²G @ 510°C (Superheated)</text>
        <text x="20" y="176" fill="#1e293b" font-size="10.5">MP STEAM RATING: 50 kg/cm²G | LP BFW: 18 kg/cm²G</text>
        <text x="20" y="194" fill="#1e293b" font-size="10.5">TOTAL BFW DEMAND: 160,000 kg/h @ 115 kg/cm²G</text>
        <text x="20" y="214" fill="#16a34a" font-size="11" font-weight="bold">P = Pump (مضخة) | E = Exchanger (مبادل) | V = Vessel (وعاء/خزان)</text>
        
        <!-- Legend Symbols -->
        <g transform="translate(380, 130)">
          <polygon points="0,6 6,0 12,6 6,12" fill="#16a34a" stroke="#0f172a" stroke-width="1"/>
          <text x="18" y="9" fill="#0f172a" font-size="9.5" font-weight="600">Stream No.</text>
          <circle cx="6" cy="24" r="6" fill="#e0f2fe" stroke="#0284c7" stroke-width="1"/>
          <text x="18" y="27" fill="#0f172a" font-size="9.5" font-weight="600">Press. kg/cm²G</text>
          <rect x="0" y="38" width="14" height="11" rx="2" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
          <text x="18" y="47" fill="#0f172a" font-size="9.5" font-weight="600">Temp. °C</text>
          <circle cx="6" cy="62" r="7" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
          <text x="18" y="65" fill="#d97706" font-size="9.5" font-weight="bold">TIC / LIC / FRC</text>
        </g>
      </g>

      <!-- Operation & Operating Conditions Box (Top Right) -->
      <g transform="translate(2520, 30)">
        <rect width="440" height="215" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5" rx="4"/>
        <text x="14" y="20" fill="#b45309" font-size="11" font-weight="bold">PROCESS STATIONS & CONTROL SUMMARY</text>
        <line x1="0" y1="28" x2="440" y2="28" stroke="#0f172a" stroke-width="1"/>
        <text x="12" y="45" fill="#475569" font-size="9.5" font-weight="bold">SECTION</text>
        <text x="160" y="45" fill="#475569" font-size="9.5" font-weight="bold">CONTROLLER</text>
        <text x="260" y="45" fill="#475569" font-size="9.5" font-weight="bold">TEMP °C</text>
        <text x="350" y="45" fill="#475569" font-size="9.5" font-weight="bold">PRESS (kg)</text>
        <line x1="0" y1="52" x2="440" y2="52" stroke="#0f172a" stroke-width="0.8"/>
        
        <text x="12" y="68" fill="#0284c7" font-size="9.5" font-weight="600">P-761 Supply -> E-204</text>
        <text x="160" y="68" fill="#d97706" font-size="9.5" font-weight="600">TIC-203 (Bypass)</text>
        <text x="260" y="68" fill="#0f172a" font-size="9.5">50° -> 90°C</text>
        <text x="350" y="68" fill="#0f172a" font-size="9.5">14 kg/cm²</text>

        <text x="12" y="88" fill="#0284c7" font-size="9.5" font-weight="600">Deaerator V-103 Feed</text>
        <text x="160" y="88" fill="#d97706" font-size="9.5" font-weight="600">LIC-151 (Level)</text>
        <text x="260" y="88" fill="#0f172a" font-size="9.5">125°C</text>
        <text x="350" y="88" fill="#0f172a" font-size="9.5">1.4 kg/cm²</text>

        <text x="12" y="108" fill="#0284c7" font-size="9.5" font-weight="600">P-101 Feed to MP Header</text>
        <text x="160" y="108" fill="#d97706" font-size="9.5" font-weight="600">TIC-153 / TIC-507</text>
        <text x="260" y="108" fill="#0f172a" font-size="9.5">125°C</text>
        <text x="350" y="108" fill="#0f172a" font-size="9.5">50 kg/cm²</text>

        <text x="12" y="128" fill="#0284c7" font-size="9.5" font-weight="600">HP BFW E-105B/402/105A</text>
        <text x="160" y="128" fill="#d97706" font-size="9.5" font-weight="600">TIC-152 / TIC-341</text>
        <text x="260" y="128" fill="#0f172a" font-size="9.5">125°->280°C</text>
        <text x="350" y="128" fill="#0f172a" font-size="9.5">115->104 kg</text>

        <text x="12" y="148" fill="#0284c7" font-size="9.5" font-weight="600">Steam Drum V-102A</text>
        <text x="160" y="148" fill="#d97706" font-size="9.5" font-weight="600">FRC-153S</text>
        <text x="260" y="148" fill="#0f172a" font-size="9.5">280° -> 314°</text>
        <text x="350" y="148" fill="#0f172a" font-size="9.5">65 kg/cm²</text>

        <text x="12" y="168" fill="#0284c7" font-size="9.5" font-weight="600">Steam Drum V-102</text>
        <text x="160" y="168" fill="#d97706" font-size="9.5" font-weight="600">FRC-153</text>
        <text x="260" y="168" fill="#0f172a" font-size="9.5">280° -> 314°</text>
        <text x="350" y="168" fill="#0f172a" font-size="9.5">65 kg/cm²</text>

        <text x="12" y="188" fill="#0284c7" font-size="9.5" font-weight="600">LP Header P-104 -> V-109</text>
        <text x="160" y="188" fill="#d97706" font-size="9.5" font-weight="600">LRC-157 / TIC-154</text>
        <text x="260" y="188" fill="#0f172a" font-size="9.5">125°C</text>
        <text x="350" y="188" fill="#0f172a" font-size="9.5">18 kg/cm²</text>

        <text x="12" y="206" fill="#0284c7" font-size="9.5" font-weight="600">Plant Quench / Flush</text>
        <text x="160" y="206" fill="#d97706" font-size="9.5" font-weight="600">FIC-204 / P-201/202</text>
        <text x="260" y="206" fill="#0f172a" font-size="9.5">125°C</text>
        <text x="350" y="206" fill="#0f172a" font-size="9.5">18 kg/cm²</text>
      </g>

      <!-- ========================================== -->
      <!-- SECTION DIVIDERS & BOUNDARY FRAMES -->
      <!-- ========================================== -->
      <!-- Circuit 1 Frame -->
      <g opacity="0.8">
        <rect x="30" y="40" width="2440" height="230" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="6,4" rx="6"/>
        <text x="45" y="60" fill="#0284c7" font-size="11" font-weight="bold">CIRCUIT 1: BFW PREPARATION, DEAERATION & HP CHARGING (منظومة نزع الغازات وضخ مياه المراجل)</text>
      </g>

      <!-- Circuit 2 Frame -->
      <g opacity="0.8">
        <rect x="30" y="290" width="2440" height="200" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="6,4" rx="6"/>
        <text x="45" y="310" fill="#0284c7" font-size="11" font-weight="bold">CIRCUIT 2: HIGH PRESSURE BFW PREHEATING & STEAM DRUM DISTRIBUTION (سلسلة التسخين والتوزيع على أوعية البخار)</text>
      </g>

      <!-- Circuit 3 Frame -->
      <g opacity="0.8">
        <rect x="30" y="510" width="2440" height="190" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="6,4" rx="6"/>
        <text x="45" y="530" fill="#0284c7" font-size="11" font-weight="bold">CIRCUIT 3: BOILER STEAM DRUM FORCED & NATURAL CIRCULATION LOOPS (دورات تدوير وتوليد البخار V-102 / V-102A)</text>
      </g>

      <!-- Circuit 4 Frame -->
      <g opacity="0.8">
        <rect x="30" y="720" width="2300" height="290" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="6,4" rx="6"/>
        <text x="45" y="740" fill="#0284c7" font-size="11" font-weight="bold">CIRCUIT 4: LOW PRESSURE BFW & AUXILIARY DISTRIBUTION & BLOWDOWN (مياه الضغط المنخفض ونزع الأملاح المستمر)</text>
      </g>

      <!-- ========================================== -->
      <!-- PIPING LAYER -->
      <!-- ========================================== -->
      <g id="pfd-steam-bfw-piping">
        
        <!-- --- CIRCUIT 1 PIPING: P-761 -> E-204 -> V-103 -> P-101 A/B/C --- -->
        <!-- P-761 Suction & Discharge (50°C, 14 kg/cm²G) -->
        <path d="M 50 170 L 110 170" fill="none" stroke="#00c8ef" stroke-width="4" class="${isAnim}"/>
        <path d="M 155 170 L 290 170" fill="none" stroke="#00c8ef" stroke-width="4" class="${isAnim}"/>
        
        <!-- E-204 Bypass Line controlled by TIC-203 -->
        <path d="M 230 170 L 230 110 L 460 110 L 460 170" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="4,2"/>
        
        <!-- E-204 Discharge (90°C) through LIC-151 Valve to V-103 Deaerator -->
        <path d="M 390 170 L 590 170" fill="none" stroke="#00c8ef" stroke-width="4" class="${isAnim}"/>
        <path d="M 590 170 L 590 190" fill="none" stroke="#00c8ef" stroke-width="4" class="${isAnim}"/>

        <!-- V-103 Bottom Liquid Effluent (125°C, 1.4 kg/cm²G) to P-101 A/B/C -->
        <path d="M 680 230 L 680 250 L 790 250 L 790 180 L 820 180" fill="none" stroke="#00c8ef" stroke-width="4.5" class="${isAnim}"/>

        <!-- P-101 Discharge Line (HP Header) -->
        <path d="M 875 170 L 980 170" fill="none" stroke="#ef4444" stroke-width="4.5" class="${isAnim}"/>
        
        <!-- P-101 Branch 1: M.P 50 KG (TIC-153 / TIC-507) -->
        <path d="M 980 170 L 980 110 L 1150 110" fill="none" stroke="#f59e0b" stroke-width="3.5" class="${isAnim}"/>
        <path d="M 1150 110 L 1205 110" fill="none" stroke="#f59e0b" stroke-width="3.5" marker-end="url(#pfdArrowYellow)" class="${isAnim}"/>

        <!-- P-101 Branch 2: H.P 90 KG (HP Steam Generation Header) -->
        <path d="M 980 170 L 1215 170" fill="none" stroke="#ef4444" stroke-width="4.5" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>

        <!-- --- CIRCUIT 2 PIPING: P-101 HP (125°C) -> E-105B (150°C) -> E-402 (200°C) -> E-105A (280°C) -> V-102 / V-102A --- -->
        <!-- HP Water Supply from P-101 Header down to E-105B -->
        <path d="M 80 410 L 330 410" fill="none" stroke="#ef4444" stroke-width="4" class="${isAnim}"/>
        
        <!-- TIC-152 & TIC-341 instrumentation take-off lines -->
        <path d="M 210 410 L 210 340 L 300 340" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,2"/>
        <path d="M 210 340 L 210 310 L 300 310" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,2"/>

        <!-- E-105B (150°C) -> E-402 (200°C) -->
        <path d="M 430 410 L 510 410" fill="none" stroke="#f97316" stroke-width="4" class="${isAnim}"/>

        <!-- E-402 (200°C) -> E-105A (280°C) -->
        <path d="M 610 410 L 680 410" fill="none" stroke="#ea580c" stroke-width="4" class="${isAnim}"/>

        <!-- E-105A Discharge (280°C, 104 kg/cm²G) to Steam Drums Distribution Header -->
        <path d="M 780 410 L 890 410" fill="none" stroke="#ef4444" stroke-width="4.5" class="${isAnim}"/>

        <!-- Distribution Branch 1: via FRC-153S (65 KG) to Secondary Steam Drum V-102A -->
        <path d="M 890 410 L 890 350 L 1000 350 L 1000 340 L 1030 340" fill="none" stroke="#ef4444" stroke-width="4" class="${isAnim}"/>

        <!-- Distribution Branch 2: via FRC-153 (65 KG) to Primary Steam Drum V-102 -->
        <path d="M 890 410 L 1030 410" fill="none" stroke="#ef4444" stroke-width="4" class="${isAnim}"/>

        <!-- --- CIRCUIT 3 PIPING: V-102 & V-102A RECIRCULATION LOOPS --- -->
        <!-- Loop A (Left): V-102 Downcomer -> P-102 A/B -> E-104 -> V-102 Riser -->
        <!-- V-102 Downcomer from bottom of V-102 -->
        <path d="M 80 610 L 180 610" fill="none" stroke="#00c8ef" stroke-width="4.5" class="${isAnim}"/>
        <!-- P-102 Discharge to E-104 Waste Heat Boiler -->
        <path d="M 235 610 L 360 610" fill="none" stroke="#00c8ef" stroke-width="4.5" class="${isAnim}"/>
        <!-- E-104 Two-Phase Steam/Water Riser back to V-102 -->
        <path d="M 470 610 L 605 610" fill="none" stroke="#ef4444" stroke-width="4.5" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>

        <!-- Loop B (Right): V-102A Downcomer -> E-108 & E-109 -> V-102A Risers -->
        <!-- V-102A Downcomer -->
        <path d="M 750 610 L 850 610" fill="none" stroke="#00c8ef" stroke-width="4" class="${isAnim}"/>
        <!-- Upper branch to E-108 -->
        <path d="M 850 610 L 850 570 L 920 570" fill="none" stroke="#00c8ef" stroke-width="3.5" class="${isAnim}"/>
        <path d="M 1025 570 L 1100 570 L 1100 610 L 1165 610" fill="none" stroke="#ef4444" stroke-width="3.5" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>
        <!-- Lower branch to E-109 -->
        <path d="M 850 610 L 850 650 L 920 650" fill="none" stroke="#00c8ef" stroke-width="3.5" class="${isAnim}"/>
        <path d="M 1025 650 L 1100 650 L 1100 610 L 1165 610" fill="none" stroke="#ef4444" stroke-width="3.5" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>

        <!-- Interconnecting Steam Header from Drums (Top Steam Outlets) -->
        <path d="M 1120 310 L 1120 270 L 1275 270" fill="none" stroke="#fbbf24" stroke-width="4" marker-end="url(#pfdArrowYellow)" class="${isAnim}"/>
        <path d="M 1120 380 L 1160 380 L 1160 270" fill="none" stroke="#fbbf24" stroke-width="4" class="${isAnim}"/>

        <!-- --- CIRCUIT 4 PIPING: LP BFW P-104 A/B (125°C, 18 kg) & DISTRIBUTION --- -->
        <!-- P-104 A/B Discharge Header -->
        <path d="M 70 850 L 180 850" fill="none" stroke="#00c8ef" stroke-width="4" class="${isAnim}"/>
        <path d="M 235 850 L 400 850" fill="none" stroke="#00c8ef" stroke-width="4" class="${isAnim}"/>

        <!-- Main Vertical Distribution Manifold -->
        <path d="M 400 770 L 400 950" fill="none" stroke="#00c8ef" stroke-width="4" class="${isAnim}"/>

        <!-- User 1: TIC-154 (Attemperator / Desuperheating Spray) -->
        <path d="M 400 770 L 615 770" fill="none" stroke="#38bdf8" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- User 2: P-201 A/B (Benfield Solution Wash & Quench) -->
        <path d="M 400 810 L 615 810" fill="none" stroke="#38bdf8" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- User 3: P-202 A/B (Auxiliary Pump Flushing) -->
        <path d="M 400 850 L 615 850" fill="none" stroke="#38bdf8" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- User 4: FIC-204 (Flow Control Loop to Utilities) -->
        <path d="M 400 890 L 615 890" fill="none" stroke="#38bdf8" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- User 5: V-103 (Deaerator Balance / Recycle Line) -->
        <path d="M 400 930 L 615 930" fill="none" stroke="#38bdf8" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- User 6: Continuous Blowdown to V-109 Flash Drum via LRC-157 -->
        <path d="M 400 960 L 800 960 L 800 910 L 860 910" fill="none" stroke="#f59e0b" stroke-width="3.5" class="${isAnim}"/>

        <!-- V-109 Overhead Flash Steam & Bottom Waste -->
        <path d="M 920 840 L 920 810 L 1032 810" fill="none" stroke="#38bdf8" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 920 950 L 920 980 L 1032 980" fill="none" stroke="#64748b" stroke-width="2.5" marker-end="url(#pfdArrowSlate)"/>
      </g>

      <!-- ========================================== -->
      <!-- INSTRUMENTATION & CONTROL LOOPS (TIC, LIC, FRC, LRC) -->
      <!-- ========================================== -->
      <g id="pfd-steam-bfw-instruments">
        <!-- TIC-203 (E-204 Temperature Controller) -->
        <g transform="translate(320, 95)" class="pfd-ctrl-item cursor-pointer" data-loop="TIC-203">
          <circle cx="20" cy="15" r="16" fill="#ffffff" stroke="#f59e0b" stroke-width="2"/>
          <line x1="4" y1="15" x2="36" y2="15" stroke="#f59e0b" stroke-width="1"/>
          <text x="20" y="11" fill="#f59e0b" font-size="8" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">TIC</text>
          <text x="20" y="24" fill="#0f172a" font-size="8.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">203</text>
          <!-- Signal to bypass valve -->
          <line x1="20" y1="31" x2="20" y2="60" stroke="#f59e0b" stroke-width="1" stroke-dasharray="2,2"/>
          <polygon points="15,60 25,60 20,68" fill="#f59e0b"/>
        </g>

        <!-- LIC-151 (V-103 Deaerator Level Controller) -->
        <g transform="translate(480, 125)" class="pfd-ctrl-item cursor-pointer" data-loop="LIC-151">
          <circle cx="20" cy="15" r="16" fill="#ffffff" stroke="#f59e0b" stroke-width="2"/>
          <line x1="4" y1="15" x2="36" y2="15" stroke="#f59e0b" stroke-width="1"/>
          <text x="20" y="11" fill="#f59e0b" font-size="8" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">LIC</text>
          <text x="20" y="24" fill="#0f172a" font-size="8.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">151</text>
          <!-- Control Valve on line -->
          <g transform="translate(40, 37)">
            <polygon points="0,0 12,8 0,16" fill="#f59e0b"/>
            <polygon points="24,0 12,8 24,16" fill="#f59e0b"/>
            <line x1="12" y1="0" x2="12" y2="-12" stroke="#f59e0b" stroke-width="1.2"/>
            <circle cx="12" cy="-14" r="4" fill="#ffffff" stroke="#f59e0b" stroke-width="1"/>
          </g>
        </g>

        <!-- TIC-153 & TIC-507 (MP Steam Line) -->
        <g transform="translate(1060, 60)" class="pfd-ctrl-item cursor-pointer" data-loop="TIC-153">
          <circle cx="18" cy="15" r="15" fill="#ffffff" stroke="#f59e0b" stroke-width="1.8"/>
          <line x1="3" y1="15" x2="33" y2="15" stroke="#f59e0b" stroke-width="0.8"/>
          <text x="18" y="11" fill="#f59e0b" font-size="7.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">TIC</text>
          <text x="18" y="23" fill="#0f172a" font-size="8" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">153</text>
        </g>

        <g transform="translate(1110, 60)" class="pfd-ctrl-item cursor-pointer" data-loop="TIC-507">
          <circle cx="18" cy="15" r="15" fill="#ffffff" stroke="#f59e0b" stroke-width="1.8"/>
          <line x1="3" y1="15" x2="33" y2="15" stroke="#f59e0b" stroke-width="0.8"/>
          <text x="18" y="11" fill="#f59e0b" font-size="7.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">TIC</text>
          <text x="18" y="23" fill="#0f172a" font-size="8" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">507</text>
        </g>

        <!-- TIC-152 & TIC-341 (HP Line to E-105B) -->
        <g transform="translate(230, 290)" class="pfd-ctrl-item cursor-pointer" data-loop="TICA-152">
          <circle cx="18" cy="15" r="15" fill="#ffffff" stroke="#f59e0b" stroke-width="1.8"/>
          <line x1="3" y1="15" x2="33" y2="15" stroke="#f59e0b" stroke-width="0.8"/>
          <text x="18" y="11" fill="#f59e0b" font-size="7.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">TIC</text>
          <text x="18" y="23" fill="#0f172a" font-size="8" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">152</text>
        </g>

        <g transform="translate(230, 330)" class="pfd-ctrl-item cursor-pointer" data-loop="TICA-341">
          <circle cx="18" cy="15" r="15" fill="#ffffff" stroke="#f59e0b" stroke-width="1.8"/>
          <line x1="3" y1="15" x2="33" y2="15" stroke="#f59e0b" stroke-width="0.8"/>
          <text x="18" y="11" fill="#f59e0b" font-size="7.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">TIC</text>
          <text x="18" y="23" fill="#0f172a" font-size="8" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">341</text>
        </g>

        <!-- FRC-153S (Feed to V-102A, 65 KG) -->
        <g transform="translate(930, 295)" class="pfd-ctrl-item cursor-pointer" data-loop="FRC-153S">
          <circle cx="20" cy="15" r="16" fill="#ffffff" stroke="#f59e0b" stroke-width="2"/>
          <line x1="4" y1="15" x2="36" y2="15" stroke="#f59e0b" stroke-width="1"/>
          <text x="20" y="11" fill="#f59e0b" font-size="7.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">FRC</text>
          <text x="20" y="24" fill="#0f172a" font-size="8" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">153S</text>
          <text x="50" y="18" fill="#10b981" font-size="9" font-weight="bold">65 KG</text>
          <!-- Control Valve -->
          <g transform="translate(25, 42)">
            <polygon points="0,0 12,8 0,16" fill="#f59e0b"/>
            <polygon points="24,0 12,8 24,16" fill="#f59e0b"/>
          </g>
        </g>

        <!-- FRC-153 (Feed to V-102, 65 KG) -->
        <g transform="translate(930, 395)" class="pfd-ctrl-item cursor-pointer" data-loop="FRC-153">
          <circle cx="20" cy="15" r="16" fill="#ffffff" stroke="#f59e0b" stroke-width="2"/>
          <line x1="4" y1="15" x2="36" y2="15" stroke="#f59e0b" stroke-width="1"/>
          <text x="20" y="11" fill="#f59e0b" font-size="7.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">FRC</text>
          <text x="20" y="24" fill="#0f172a" font-size="8" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">153</text>
          <text x="50" y="18" fill="#10b981" font-size="9" font-weight="bold">65 KG</text>
          <!-- Control Valve -->
          <g transform="translate(25, 7)">
            <polygon points="0,0 12,8 0,16" fill="#f59e0b"/>
            <polygon points="24,0 12,8 24,16" fill="#f59e0b"/>
          </g>
        </g>

        <!-- TIC-154 (Attemperation Spray) -->
        <g transform="translate(620, 755)" class="pfd-ctrl-item cursor-pointer" data-loop="TIC-154">
          <circle cx="18" cy="15" r="15" fill="#ffffff" stroke="#f59e0b" stroke-width="1.8"/>
          <line x1="3" y1="15" x2="33" y2="15" stroke="#f59e0b" stroke-width="0.8"/>
          <text x="18" y="11" fill="#f59e0b" font-size="7.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">TIC</text>
          <text x="18" y="23" fill="#0f172a" font-size="8" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">154</text>
          <text x="42" y="19" fill="#475569" font-size="9" font-weight="700">DESUPERHEATER SPRAY</text>
        </g>

        <!-- P-201 A/B & P-202 A/B (Flush / Quench Lines) -->
        <g transform="translate(620, 800)">
          <text x="0" y="15" fill="#38bdf8" font-size="11" font-weight="bold">P-201 A/B</text>
          <text x="75" y="15" fill="#94a3b8" font-size="8.5">(BENFIELD SOLUTION MAKEUP & WASH)</text>
        </g>

        <g transform="translate(620, 840)">
          <text x="0" y="15" fill="#38bdf8" font-size="11" font-weight="bold">P-202 A/B</text>
          <text x="75" y="15" fill="#94a3b8" font-size="8.5">(SECONDARY PUMP SEAL FLUSH)</text>
        </g>

        <!-- FIC-204 (Flow Loop) -->
        <g transform="translate(620, 875)" class="cursor-pointer">
          <circle cx="18" cy="15" r="15" fill="#142c4c" stroke="#f59e0b" stroke-width="1.5"/>
          <line x1="3" y1="15" x2="33" y2="15" stroke="#f59e0b" stroke-width="0.8"/>
          <text x="18" y="11" fill="#f8fafc" font-size="7.5" font-weight="bold" text-anchor="middle">FIC</text>
          <text x="18" y="23" fill="#fbbf24" font-size="7.5" font-weight="bold" text-anchor="middle">204</text>
          <text x="42" y="19" fill="#94a3b8" font-size="8.5">UTILITY FLOW CONTROL</text>
        </g>

        <!-- V-103 Return -->
        <g transform="translate(620, 920)">
          <text x="0" y="15" fill="#10b981" font-size="11" font-weight="bold">V-103</text>
          <text x="50" y="15" fill="#94a3b8" font-size="8.5">(MINIMUM FLOW / BALANCE RECYCLE)</text>
        </g>

        <!-- LRC-157 (Continuous Blowdown Control Valve to V-109) -->
        <g transform="translate(730, 895)" class="cursor-pointer">
          <circle cx="20" cy="15" r="16" fill="#142c4c" stroke="#f59e0b" stroke-width="1.8"/>
          <line x1="4" y1="15" x2="36" y2="15" stroke="#f59e0b" stroke-width="1"/>
          <text x="20" y="11" fill="#f8fafc" font-size="7.5" font-weight="bold" text-anchor="middle">LRC</text>
          <text x="20" y="24" fill="#fbbf24" font-size="7.5" font-weight="bold" text-anchor="middle">157</text>
          <!-- Control Valve on blowdown line -->
          <g transform="translate(10, 57)">
            <polygon points="0,0 12,8 0,16" fill="#f59e0b"/>
            <polygon points="24,0 12,8 24,16" fill="#f59e0b"/>
          </g>
        </g>
      </g>

      <!-- ========================================== -->
      <!-- EQUIPMENT LAYER (Pumps, Exchangers, Vessels) -->
      <!-- ========================================== -->
      <g id="pfd-steam-bfw-equipment">
        
        <!-- P-761: DEMIN WATER SUPPLY PUMP -->
        <g class="pfd-eq-item cursor-pointer" data-tag="P-761" transform="translate(100, 145)">
          <circle cx="25" cy="25" r="22" fill="#f8fafc" stroke="#0284c7" stroke-width="2"/>
          <polygon points="10,25 35,10 35,40" fill="#0284c7"/>
          <g transform="translate(-30, -45)">
            <rect x="0" y="0" width="110" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="55" y="16" fill="#0284c7" font-size="12.5" font-weight="900" text-anchor="middle">P-761</text>
            <text x="55" y="30" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مضخة مياه منزوعة المعادن</text>
          </g>
          <!-- Stream tags: 50°C, 14 kg/cm² -->
          <g transform="translate(45, -5)">
            <rect x="0" y="0" width="55" height="18" rx="3" fill="#ffffff" stroke="#d97706" stroke-width="1.2"/>
            <text x="27" y="13" fill="#d97706" font-size="9.5" font-weight="bold" text-anchor="middle">50 °C</text>
            <rect x="0" y="22" width="55" height="18" rx="3" fill="#ffffff" stroke="#0284c7" stroke-width="1.2"/>
            <text x="27" y="35" fill="#0284c7" font-size="9.5" font-weight="bold" text-anchor="middle">14 kg</text>
          </g>
        </g>

        <!-- E-204: BFW PREHEATER EXCHANGER -->
        <g class="pfd-eq-item cursor-pointer" data-tag="E-204" transform="translate(290, 130)">
          <circle cx="45" cy="40" r="38" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <path d="M 20 40 Q 32 20 45 40 T 70 40" fill="none" stroke="#0284c7" stroke-width="2.5"/>
          <g transform="translate(-15, -45)">
            <rect x="0" y="0" width="120" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="60" y="16" fill="#0284c7" font-size="13" font-weight="900" text-anchor="middle">E-204</text>
            <text x="60" y="30" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مسخن مياه التغذية BFW</text>
          </g>
          <!-- Heated to 90°C -->
          <g transform="translate(100, 20)">
            <rect x="0" y="0" width="55" height="18" rx="3" fill="#ffffff" stroke="#d97706" stroke-width="1.2"/>
            <text x="27" y="13" fill="#d97706" font-size="10" font-weight="bold" text-anchor="middle">90 °C</text>
          </g>
        </g>

        <!-- V-103: DEAERATOR VESSEL & STORAGE DRUM -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-103" transform="translate(560, 80)">
          <!-- Top vertical deaerator stripping column dome -->
          <rect x="25" y="20" width="50" height="70" rx="12" fill="url(#pfdBedGrad)" stroke="#0f172a" stroke-width="2"/>
          <line x1="30" y1="45" x2="70" y2="45" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="3,2"/>
          <line x1="30" y1="65" x2="70" y2="65" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="3,2"/>
          
          <!-- Bottom horizontal storage drum -->
          <rect x="0" y="85" width="130" height="65" rx="15" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2.2"/>
          
          <!-- High-Clarity Plaque -->
          <g transform="translate(-10, -45)">
            <rect x="0" y="0" width="150" height="42" rx="6" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
            <text x="75" y="17" fill="#0284c7" font-size="14" font-weight="900" text-anchor="middle">V-103</text>
            <text x="75" y="33" fill="#0f172a" font-size="10.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">خزان ومجرد الغازات Deaerator</text>
          </g>
          
          <!-- Operating condition tags: 125°C, 1.4 kg/cm² -->
          <g transform="translate(140, 95)">
            <rect x="0" y="0" width="58" height="18" rx="3" fill="#ffffff" stroke="#d97706" stroke-width="1.2"/>
            <text x="29" y="13" fill="#d97706" font-size="9.5" font-weight="bold" text-anchor="middle">125 °C</text>
            <rect x="0" y="22" width="58" height="18" rx="3" fill="#ffffff" stroke="#0284c7" stroke-width="1.2"/>
            <text x="29" y="35" fill="#0284c7" font-size="9.5" font-weight="bold" text-anchor="middle">1.4 kg</text>
          </g>
        </g>

        <!-- P-101 A/B/C: HP BOILER FEED WATER PUMPS -->
        <g class="pfd-eq-item cursor-pointer" data-tag="P-101" transform="translate(820, 145)">
          <circle cx="25" cy="25" r="24" fill="#f8fafc" stroke="#dc2626" stroke-width="2.2"/>
          <polygon points="10,25 35,10 35,40" fill="#dc2626"/>
          <circle cx="65" cy="25" r="24" fill="#f8fafc" stroke="#dc2626" stroke-width="2.2"/>
          <polygon points="50,25 75,10 75,40" fill="#dc2626"/>
          
          <g transform="translate(-15, -45)">
            <rect x="0" y="0" width="130" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="65" y="16" fill="#dc2626" font-size="12.5" font-weight="900" text-anchor="middle">P-101 A/B/C</text>
            <text x="65" y="30" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مضخات تغذية المرجل HP BFW</text>
          </g>
          
          <!-- Discharge Header Labels -->
          <g transform="translate(230, -50)">
            <rect x="0" y="0" width="130" height="28" rx="4" fill="#ffffff" stroke="#d97706" stroke-width="1.8"/>
            <text x="65" y="18" fill="#d97706" font-size="11.5" font-weight="900" text-anchor="middle">M-P 50 KG</text>
          </g>
          <g transform="translate(230, 10)">
            <rect x="0" y="0" width="130" height="28" rx="4" fill="#ffffff" stroke="#dc2626" stroke-width="1.8"/>
            <text x="65" y="18" fill="#dc2626" font-size="11.5" font-weight="900" text-anchor="middle">H-P 90 KG</text>
          </g>
        </g>

        <!-- --- CIRCUIT 2 EQUIPMENT --- -->
        <!-- P-101 START SYMBOL (H.P 125°C) -->
        <g class="pfd-eq-item cursor-pointer" data-tag="P-101" transform="translate(70, 390)">
          <circle cx="20" cy="20" r="18" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
          <polygon points="8,20 28,8 28,32" fill="#dc2626"/>
          <g transform="translate(-10, -40)">
            <rect x="0" y="0" width="70" height="34" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="35" y="15" fill="#dc2626" font-size="11.5" font-weight="bold" text-anchor="middle">P-101</text>
            <text x="35" y="27" fill="#0f172a" font-size="8.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">منظومة HP</text>
          </g>
          <g transform="translate(45, -5)">
            <text x="0" y="12" fill="#dc2626" font-size="10.5" font-weight="bold">H.P</text>
            <text x="0" y="26" fill="#d97706" font-size="10.5" font-weight="bold">125 °C</text>
          </g>
        </g>

        <!-- E-105B: 1ST HP BFW PREHEATER -->
        <g class="pfd-eq-item cursor-pointer" data-tag="E-105B" transform="translate(330, 370)">
          <circle cx="45" cy="40" r="36" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <path d="M 20 40 Q 32 20 45 40 T 70 40" fill="none" stroke="#ea580c" stroke-width="2.5"/>
          <g transform="translate(-15, -45)">
            <rect x="0" y="0" width="120" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="60" y="16" fill="#ea580c" font-size="13" font-weight="900" text-anchor="middle">E-105B</text>
            <text x="60" y="30" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مسخن المرجل الأولي 1</text>
          </g>
          <g transform="translate(100, 25)">
            <rect x="0" y="0" width="55" height="18" rx="3" fill="#ffffff" stroke="#d97706" stroke-width="1.2"/>
            <text x="27" y="13" fill="#d97706" font-size="10" font-weight="bold" text-anchor="middle">150 °C</text>
          </g>
        </g>

        <!-- E-402: SYNTHESIS LOOP WASTE HEAT EXCHANGER -->
        <g class="pfd-eq-item cursor-pointer" data-tag="E-402" transform="translate(510, 370)">
          <circle cx="45" cy="40" r="36" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <path d="M 20 40 Q 32 20 45 40 T 70 40" fill="none" stroke="#ea580c" stroke-width="2.5"/>
          <g transform="translate(-15, -45)">
            <rect x="0" y="0" width="120" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="60" y="16" fill="#16a34a" font-size="13" font-weight="900" text-anchor="middle">E-402</text>
            <text x="60" y="30" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مرجل حلقة التخليق</text>
          </g>
          <g transform="translate(100, 25)">
            <rect x="0" y="0" width="55" height="18" rx="3" fill="#ffffff" stroke="#d97706" stroke-width="1.2"/>
            <text x="27" y="13" fill="#d97706" font-size="10" font-weight="bold" text-anchor="middle">200 °C</text>
          </g>
        </g>

        <!-- E-105A: REFORMER CONVECTION HIGH TEMP BFW PREHEATER -->
        <g class="pfd-eq-item cursor-pointer" data-tag="E-105A" transform="translate(680, 370)">
          <rect x="0" y="10" width="95" height="60" rx="8" fill="url(#pfdFurnaceGrad)" stroke="#0f172a" stroke-width="2.2"/>
          <line x1="20" y1="20" x2="75" y2="20" stroke="#d97706" stroke-width="2"/>
          <line x1="20" y1="40" x2="75" y2="40" stroke="#d97706" stroke-width="2"/>
          <g transform="translate(-15, -45)">
            <rect x="0" y="0" width="125" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="62" y="16" fill="#dc2626" font-size="13" font-weight="900" text-anchor="middle">E-105A</text>
            <text x="62" y="30" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مسخن منطقة الحمل الحراري</text>
          </g>
          <g transform="translate(110, 25)">
            <rect x="0" y="0" width="55" height="18" rx="3" fill="#ffffff" stroke="#d97706" stroke-width="1.2"/>
            <text x="27" y="13" fill="#d97706" font-size="10" font-weight="bold" text-anchor="middle">280 °C</text>
          </g>
        </g>

        <!-- V-102A: SECONDARY STEAM DRUM -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-102A" transform="translate(1030, 305)">
          <rect x="0" y="0" width="130" height="55" rx="14" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <!-- Water level representation -->
          <line x1="10" y1="35" x2="120" y2="35" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="4,2"/>
          <g transform="translate(5, -45)">
            <rect x="0" y="0" width="120" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="60" y="16" fill="#dc2626" font-size="13" font-weight="900" text-anchor="middle">V-102A</text>
            <text x="60" y="30" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">درام البخار الثانوي</text>
          </g>
        </g>

        <!-- V-102: PRIMARY HIGH PRESSURE STEAM DRUM -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-102" transform="translate(1030, 375)">
          <rect x="0" y="0" width="130" height="65" rx="15" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2.5"/>
          <!-- Internal cyclone/demister details -->
          <line x1="10" y1="40" x2="120" y2="40" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="4,2"/>
          <circle cx="45" cy="22" r="8" fill="#f8fafc" stroke="#dc2626" stroke-width="1"/>
          <circle cx="85" cy="22" r="8" fill="#f8fafc" stroke="#dc2626" stroke-width="1"/>
          <g transform="translate(-10, 75)">
            <rect x="0" y="0" width="150" height="42" rx="6" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
            <text x="75" y="17" fill="#dc2626" font-size="14" font-weight="900" text-anchor="middle">V-102</text>
            <text x="75" y="33" fill="#0f172a" font-size="10.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">درام البخار الرئيسي HP Drum</text>
          </g>
        </g>

        <!-- --- CIRCUIT 3 EQUIPMENT (RECIRCULATION LOOPS) --- -->
        <!-- V-102 START SYMBOL -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-102" transform="translate(50, 590)">
          <rect x="0" y="0" width="70" height="40" rx="8" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <text x="35" y="24" fill="#dc2626" font-size="12" font-weight="bold" text-anchor="middle">V-102</text>
          <text x="35" y="55" fill="#0f172a" font-size="8.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">أنبوب الهبوط Downcomer</text>
        </g>

        <!-- P-102 A/B: BOILER CIRCULATION PUMPS -->
        <g class="pfd-eq-item cursor-pointer" data-tag="P-102" transform="translate(180, 585)">
          <circle cx="25" cy="25" r="22" fill="#f8fafc" stroke="#0284c7" stroke-width="2"/>
          <polygon points="10,25 35,10 35,40" fill="#0284c7"/>
          <g transform="translate(-25, -45)">
            <rect x="0" y="0" width="115" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="57" y="16" fill="#0284c7" font-size="12" font-weight="900" text-anchor="middle">P-102 A/B</text>
            <text x="57" y="30" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مضخات تدوير المرجل</text>
          </g>
        </g>

        <!-- E-104: PRIMARY WASTE HEAT BOILER -->
        <g class="pfd-eq-item cursor-pointer" data-tag="E-104" transform="translate(360, 575)">
          <rect x="0" y="0" width="105" height="70" rx="10" fill="url(#pfdFurnaceGrad)" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="20" y1="20" x2="85" y2="20" stroke="#d97706" stroke-width="2"/>
          <line x1="20" y1="45" x2="85" y2="45" stroke="#d97706" stroke-width="2"/>
          <g transform="translate(-15, -45)">
            <rect x="0" y="0" width="135" height="40" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
            <text x="67" y="16" fill="#dc2626" font-size="13.5" font-weight="900" text-anchor="middle">E-104</text>
            <text x="67" y="31" fill="#0f172a" font-size="10" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مرجل استرجاع الحرارة الرئيسي</text>
          </g>
        </g>

        <!-- V-102 RETURN SYMBOL -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-102" transform="translate(605, 590)">
          <rect x="0" y="0" width="70" height="40" rx="8" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <text x="35" y="24" fill="#dc2626" font-size="12" font-weight="bold" text-anchor="middle">V-102</text>
          <text x="35" y="55" fill="#0f172a" font-size="8.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">أنبوب الصعود Riser</text>
        </g>

        <!-- V-102A (LOOP 2 START) -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-102A" transform="translate(730, 590)">
          <rect x="0" y="0" width="70" height="40" rx="8" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <text x="35" y="24" fill="#dc2626" font-size="11.5" font-weight="bold" text-anchor="middle">V-102A</text>
          <text x="35" y="55" fill="#0f172a" font-size="8.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">أنبوب الهبوط 2</text>
        </g>

        <!-- E-108: HTS EXIT WASTE HEAT BOILER -->
        <g class="pfd-eq-item cursor-pointer" data-tag="E-108" transform="translate(920, 540)">
          <circle cx="40" cy="30" r="28" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-15, -42)">
            <rect x="0" y="0" width="110" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="55" y="15" fill="#dc2626" font-size="12" font-weight="bold" text-anchor="middle">E-108</text>
            <text x="55" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مرجل مخرج HTS</text>
          </g>
        </g>

        <!-- E-109: SYN GAS WASTE HEAT EXCHANGER -->
        <g class="pfd-eq-item cursor-pointer" data-tag="E-109" transform="translate(920, 620)">
          <circle cx="40" cy="30" r="28" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-15, 60)">
            <rect x="0" y="0" width="110" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="55" y="15" fill="#dc2626" font-size="12" font-weight="bold" text-anchor="middle">E-109</text>
            <text x="55" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مرجل غاز التخليق</text>
          </g>
        </g>

        <!-- V-102A RETURN SYMBOL -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-102A" transform="translate(1165, 590)">
          <rect x="0" y="0" width="70" height="40" rx="8" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <text x="35" y="24" fill="#dc2626" font-size="11.5" font-weight="bold" text-anchor="middle">V-102A</text>
          <text x="35" y="55" fill="#0f172a" font-size="8.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">أنبوب الصعود 2</text>
        </g>

        <!-- --- CIRCUIT 4 EQUIPMENT (LP BFW & BLOWDOWN) --- -->
        <!-- P-104 A/B: LP BOILER FEED WATER PUMPS -->
        <g class="pfd-eq-item cursor-pointer" data-tag="P-104" transform="translate(180, 825)">
          <circle cx="25" cy="25" r="22" fill="#f8fafc" stroke="#0284c7" stroke-width="2"/>
          <polygon points="10,25 35,10 35,40" fill="#0284c7"/>
          <g transform="translate(-25, -45)">
            <rect x="0" y="0" width="125" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="62" y="16" fill="#0284c7" font-size="12" font-weight="900" text-anchor="middle">P-104 A/B</text>
            <text x="62" y="30" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مضخات التغذية LP BFW</text>
          </g>
          <!-- Pressure & Temp Tag -->
          <g transform="translate(-110, -5)">
            <text x="0" y="12" fill="#0284c7" font-size="11.5" font-weight="bold">L.P</text>
            <text x="0" y="26" fill="#d97706" font-size="11" font-weight="bold">125 °C</text>
            <text x="0" y="40" fill="#0284c7" font-size="11" font-weight="bold">18 kg/cm²</text>
          </g>
        </g>

        <!-- V-109: CONTINUOUS BLOWDOWN & FLASH DRUM -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-109" transform="translate(860, 840)">
          <rect x="0" y="10" width="65" height="100" rx="15" fill="url(#pfdBedGrad)" stroke="#0f172a" stroke-width="2"/>
          <g transform="translate(-30, -45)">
            <rect x="0" y="0" width="130" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="65" y="16" fill="#d97706" font-size="13" font-weight="900" text-anchor="middle">V-109</text>
            <text x="65" y="30" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">خزان التبخير الوميضي والتفريغ</text>
          </g>
          <!-- Flash Steam Out -->
          <text x="110" y="815" fill="#0284c7" font-size="9.5" font-weight="bold">FLASH STEAM (3.5 kg)</text>
          <!-- Drain to Neutralization Pit -->
          <text x="110" y="985" fill="#475569" font-size="9.5" font-weight="bold">TO DRAIN PIT</text>
        </g>
      </g>

      <!-- ========================================== -->
      <!-- STREAM FLAGS & BADGES -->
      <!-- ========================================== -->
      <g id="pfd-steam-bfw-stream-tags">
        <!-- Stream 1 (P-761 Water Supply) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="1" transform="translate(60, 160)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#00c8ef" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">1</text>
        </g>

        <!-- Stream 2 (Heated after E-204) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="2" transform="translate(420, 160)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#00c8ef" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">2</text>
        </g>

        <!-- Stream 3 (Deaerated Water from V-103) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="3" transform="translate(730, 240)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#00c8ef" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">3</text>
        </g>

        <!-- Stream 4 (HP BFW ex P-101) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="4" transform="translate(930, 160)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#ef4444" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">4</text>
        </g>

        <!-- Stream 5 (MP BFW Branch 50 kg) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="5" transform="translate(1040, 100)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#f59e0b" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">5</text>
        </g>

        <!-- Stream 6 (Preheated ex E-105B) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="6" transform="translate(460, 400)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#f97316" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">6</text>
        </g>

        <!-- Stream 7 (Preheated ex E-402) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="7" transform="translate(640, 400)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#ea580c" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">7</text>
        </g>

        <!-- Stream 8 (HP BFW ex E-105A) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="8" transform="translate(830, 400)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#ef4444" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">8</text>
        </g>

        <!-- Stream 9 (Feed to V-102A via FRC-153S) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="9" transform="translate(980, 330)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#ef4444" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">9</text>
        </g>

        <!-- Stream 10 (Feed to V-102 via FRC-153) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="10" transform="translate(980, 400)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#ef4444" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">10</text>
        </g>

        <!-- Stream 11 (V-102 Downcomer to P-102) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="11" transform="translate(130, 600)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#00c8ef" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">11</text>
        </g>

        <!-- Stream 12 (E-104 Generated Steam Riser) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="12" transform="translate(520, 600)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#ef4444" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">12</text>
        </g>

        <!-- Stream 13 (V-102A Circulation to E-108/E-109) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="13" transform="translate(810, 600)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#00c8ef" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">13</text>
        </g>

        <!-- Stream 14 (LP BFW Discharge ex P-104) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="14" transform="translate(300, 840)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#00c8ef" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">14</text>
        </g>

        <!-- Stream 15 (LP to Attemperator TIC-154) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="15" transform="translate(500, 760)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#38bdf8" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">15</text>
        </g>

        <!-- Stream 18 (Blowdown via LRC-157 to V-109) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="18" transform="translate(800, 950)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#f59e0b" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">18</text>
        </g>
      </g>
    </g>
  `;
}
