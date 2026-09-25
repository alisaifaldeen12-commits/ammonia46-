/**
 * render_co2_200_svg.ts
 * Vector Blueprint Renderer for DWG NO. 6112P 100-200-00
 * Ammonia Unit - CO2 Removal Section (Catacarb Absorption & Regeneration)
 * Spacious, Well-Separated Left-to-Right Engineering Layout on Crisp DCS Canvas
 */

import { renderShellAndTubeSVG } from './render_shell_and_tube';

export function renderCO2Removal200SVG(showParticles: boolean): string {
  const isAnim = showParticles ? 'pfd-pipe-anim' : '';

  const e201Svg = renderShellAndTubeSVG({
    tag: 'E-201',
    nameAr: 'مرجل كاتاكارب الرئيسي',
    temaType: 'BEM / Kettle',
    tagColor: '#0284c7',
    x: 200,
    y: 380,
    width: 105,
    height: 48,
    tubeSide: {
      fluidAr: 'غاز مصلح خارج من التحويل',
      tempIn: '215°C',
      tempOut: '125°C',
      color: '#00c8ef',
      inPos: 'axial-left',
      outPos: 'axial-right'
    },
    shellSide: {
      fluidAr: 'محلول كاتاكارب المغلي (Thermosiphon)',
      tempIn: '115°C',
      tempOut: '122°C',
      color: '#10b981',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  const e207Svg = renderShellAndTubeSVG({
    tag: 'E-207',
    nameAr: 'مبرد المحلول شبه النقي',
    temaType: 'AES / Floating Head',
    tagColor: '#0284c7',
    x: 880,
    y: 270,
    width: 100,
    height: 46,
    tubeSide: {
      fluidAr: 'مياه تبريد صناعية CW',
      tempIn: '32°C',
      tempOut: '42°C',
      color: '#0284c7',
      inPos: 'bottom-left',
      outPos: 'top-right'
    },
    shellSide: {
      fluidAr: 'محلول شبه نقي Semi-Lean',
      tempIn: '116°C',
      tempOut: '105°C',
      color: '#10b981',
      inPos: 'top',
      outPos: 'bottom'
    }
  });

  const e204Svg = renderShellAndTubeSVG({
    tag: 'E-204',
    nameAr: 'مبادل تسخين مياه BFW',
    temaType: 'BEU / U-Tube',
    tagColor: '#0284c7',
    x: 1205,
    y: 495,
    width: 105,
    height: 48,
    tubeSide: {
      fluidAr: 'مياه تغذية الغلايات BFW',
      tempIn: '45°C',
      tempOut: '105°C',
      color: '#00c8ef',
      inPos: 'bottom-left',
      outPos: 'top-left'
    },
    shellSide: {
      fluidAr: 'محلول كاتاكارب نقي حار',
      tempIn: '122°C',
      tempOut: '80°C',
      color: '#059669',
      inPos: 'axial-left',
      outPos: 'axial-right'
    }
  });

  const e202Svg = renderShellAndTubeSVG({
    tag: 'E-202',
    nameAr: 'مرجل بخار LP المساعد',
    temaType: 'BEM / Fixed Sheet',
    tagColor: '#0284c7',
    x: 1560,
    y: 390,
    width: 105,
    height: 48,
    tubeSide: {
      fluidAr: 'بخار ضغط منخفض LP Steam',
      tempIn: '145°C',
      tempOut: '125°C',
      color: '#f59e0b',
      inPos: 'axial-right',
      outPos: 'bottom-mid'
    },
    shellSide: {
      fluidAr: 'محلول كاتاكارب المغلي',
      tempIn: '118°C',
      tempOut: '122°C',
      color: '#047857',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  const e205Svg = renderShellAndTubeSVG({
    tag: 'E-205 A,B',
    nameAr: 'مكثف غاز CO2 العلوي',
    temaType: 'AES / Condenser',
    tagColor: '#0284c7',
    x: 1760,
    y: 200,
    width: 110,
    height: 48,
    tubeSide: {
      fluidAr: 'مياه التبريد CW',
      tempIn: '32°C',
      tempOut: '42°C',
      color: '#0284c7',
      inPos: 'bottom-left',
      outPos: 'top-right'
    },
    shellSide: {
      fluidAr: 'غاز CO2 مشبع بالبخار',
      tempIn: '97°C',
      tempOut: '40°C',
      color: '#f43f5e',
      inPos: 'top',
      outPos: 'bottom'
    }
  });

  return `
    <g id="pfd-co2-200-layers">
      
      <!-- ========================================== -->
      <!-- TITLE BLOCK / LEGEND (Bottom Right) -->
      <!-- ========================================== -->
      <g transform="translate(1760, 860)">
        <rect width="480" height="220" fill="#f8fafc" stroke="#0f172a" stroke-width="1.8" rx="4"/>
        <text x="18" y="28" fill="#0284c7" font-size="13" font-weight="bold" font-family="'Cairo', sans-serif">IRAQ NO. 3 PROJECT</text>
        <text x="18" y="48" fill="#334155" font-size="11" font-family="'Cairo', sans-serif">CUSTOMER: M.O.I. IRAQ - FERTILIZER PROJECT</text>
        <text x="18" y="66" fill="#334155" font-size="11" font-family="'Cairo', sans-serif">KHOR AL-ZUBAIR PHASE-1 (AMMONIA UNIT)</text>
        <text x="18" y="88" fill="#0f172a" font-size="14" font-weight="bold" font-family="'Cairo', sans-serif">CO2 REMOVAL SECTION (CATACARB)</text>
        <text x="18" y="108" fill="#0284c7" font-size="12" font-weight="bold">DWG NO. 6112P 100-200-00</text>
        <line x1="0" y1="122" x2="480" y2="122" stroke="#0f172a" stroke-width="1"/>
        
        <text x="18" y="144" fill="#1e293b" font-size="10.5">ORDER NO: 563030-012</text>
        <text x="18" y="164" fill="#1e293b" font-size="10.5">DATE: 7 JAN '76 | CATACARB SPLIT-FLOW</text>
        <text x="18" y="186" fill="#0f172a" font-size="11.5" font-weight="bold">قسم إزالة ثاني أكسيد الكربون (T-201 / T-202)</text>
        
        <!-- Symbol Legend inside Title Block -->
        <g transform="translate(280, 134)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#0284c7" stroke="#0f172a" stroke-width="1"/>
          <text x="20" y="11" fill="#0f172a" font-size="9.5" font-weight="600">Stream No.</text>
          <circle cx="7" cy="30" r="7" fill="#e0f2fe" stroke="#0284c7" stroke-width="1"/>
          <text x="20" y="34" fill="#0f172a" font-size="9.5" font-weight="600">Press. kg/cm²A</text>
          <rect x="0" y="48" width="16" height="12" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
          <text x="20" y="58" fill="#0f172a" font-size="9.5" font-weight="600">Temp. °C</text>
          <rect x="0" y="68" width="16" height="12" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
          <text x="20" y="78" fill="#0f172a" font-size="9.5" font-weight="600">Flow kg/h</text>
        </g>
      </g>

      <!-- ========================================== -->
      <!-- PIPING LINES LAYER (CLEAN & SPACIOUS) -->
      <!-- ========================================== -->
      <g id="pfd-co2-piping">
        <!-- 1. Stream 1: Converted Gas from LTS (R-105) -> E-201 -> V-201 -> T-201 Bottom -->
        <path d="M 40 405 L 198 405" fill="none" stroke="#00c8ef" stroke-width="3.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 290 405 L 358 405" fill="none" stroke="#00c8ef" stroke-width="3.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <!-- V-201 Vapor Overhead (Stream 2) into T-201 Bottom -->
        <path d="M 390 380 L 390 340 L 480 340 L 480 470 L 518 470" fill="none" stroke="#00c8ef" stroke-width="3.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <!-- V-201 Condensate Bottom -> P-206 A,B -->
        <path d="M 390 450 L 390 533" fill="none" stroke="#0284c7" stroke-width="2.5" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>
        <path d="M 405 560 L 460 560 L 460 758" fill="none" stroke="#0284c7" stroke-width="2" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>

        <!-- 2. T-201 Overhead Purified Gas (Stream 3) -> V-204 -> To Methanation Section 100 -->
        <path d="M 585 110 L 585 70" fill="none" stroke="#00c8ef" stroke-width="3.5"/>
        <path d="M 615 45 L 2248 45" fill="none" stroke="#00c8ef" stroke-width="3.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- 3. T-201 Bottom Rich Sol'n -> Hydraulic Turbine P-201HT -> T-202 Top Flash -->
        <path d="M 585 530 L 585 550 L 778 550" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <path d="M 830 540 L 830 180 L 1358 180" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- 4. T-202 Semi-Lean Sol'n Draw -> P-201 A,B -> E-207 -> T-201 Mid Feed (105°C) -->
        <path d="M 1360 360 L 920 360 L 920 503" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <path d="M 920 505 L 920 330" fill="none" stroke="#10b981" stroke-width="3.5" class="${isAnim}"/>
        <path d="M 920 280 L 920 270 L 652 270" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- 5. T-202 Bottom Lean Sol'n -> E-204 -> P-202 A,B -> F-201 -> T-201 Top Feed (80°C) -->
        <!-- Hot Lean Solution (120°C) from T-202 Bottom into E-204 -->
        <path d="M 1425 530 L 1425 580 L 1295 580 L 1295 520 L 1287 520" fill="none" stroke="#059669" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <!-- Cooled Lean Solution (80°C) from E-204 Outlet to P-202 A,B Suction -->
        <path d="M 1205 520 L 1117 520" fill="none" stroke="#059669" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <!-- P-202 A,B Discharge (36 kg/cm²A) to F-201 Filter -->
        <path d="M 1085 495 L 1085 307" fill="none" stroke="#059669" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <!-- Filtered Lean Solution from F-201 to T-201 Top Liquid Distributor (80°C) -->
        <path d="M 1085 250 L 1085 160 L 652 160" fill="none" stroke="#059669" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <!-- E-204 BFW Preheating Circuits -->
        <path d="M 1245 640 L 1245 542" fill="none" stroke="#00c8ef" stroke-width="2.2" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 1265 495 L 1265 430 L 1212 430" fill="none" stroke="#0284c7" stroke-width="2.2" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>

        <!-- 6. T-202 Reboilers Circulation: E-201 & E-202 -->
        <!-- Thermosiphon from T-202 to E-201 -->
        <path d="M 1360 490 L 1260 490 L 1260 460 L 290 460 L 290 437" fill="none" stroke="#047857" stroke-width="2.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <path d="M 200 435 L 170 435 L 170 500 L 1330 500 L 1330 460 L 1358 460" fill="none" stroke="#047857" stroke-width="2.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <!-- LP Steam Reboiler E-202 loop -->
        <path d="M 1490 490 L 1560 490 L 1560 422" fill="none" stroke="#047857" stroke-width="2.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <path d="M 1605 390 L 1605 360 L 1492 360" fill="none" stroke="#047857" stroke-width="2.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <!-- LP Steam Supply into E-202 -->
        <path d="M 1690 400 L 1652 400" fill="none" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#pfdArrowYellow)"/>

        <!-- 7. T-202 Overhead Acid Gas (Stream 4) -> E-205 A,B -> V-203 -->
        <path d="M 1425 110 L 1425 80 L 1805 80 L 1805 198" fill="none" stroke="#f43f5e" stroke-width="3.5" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>
        <path d="M 1850 225 L 1948 225" fill="none" stroke="#f43f5e" stroke-width="3.5" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>

        <!-- 8. V-203 Top CO2 Pure Gas (Stream 5) -> To Urea Unit / ATM -->
        <path d="M 1982 200 L 1982 140 L 2248 140" fill="none" stroke="#ef4444" stroke-width="3.5" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>
        <!-- Vent / ATM line -->
        <path d="M 2150 140 L 2150 90 L 2248 90" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#pfdArrowRed)"/>

        <!-- 9. V-203 Bottom Condensate -> P-203 A,B -> T-202 Top Reflux -->
        <path d="M 1982 275 L 1982 353" fill="none" stroke="#0284c7" stroke-width="2.5" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>
        <path d="M 1950 380 L 1490 380 L 1490 142" fill="none" stroke="#0284c7" stroke-width="2.5" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>

        <!-- 10. Degassing System (V-209, E-206, P-208 A,B) -->
        <path d="M 480 840 L 480 870 L 740 870 L 740 832" fill="none" stroke="#0284c7" stroke-width="2" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>
        <path d="M 780 810 L 853 810" fill="none" stroke="#0284c7" stroke-width="2" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>
        <path d="M 905 810 L 1018 810" fill="none" stroke="#0284c7" stroke-width="2" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>

        <!-- 11. Solvent Makeup & Sump recovery (V-205, V-207, P-204) -->
        <path d="M 165 850 L 165 890 L 260 890 L 260 842" fill="none" stroke="#059669" stroke-width="1.8" marker-end="url(#pfdArrowGreen)"/>
        <path d="M 305 820 L 338 820" fill="none" stroke="#059669" stroke-width="1.8" marker-end="url(#pfdArrowGreen)"/>
        <path d="M 365 820 L 400 820 L 400 680 L 848 680" fill="none" stroke="#059669" stroke-width="1.8" marker-end="url(#pfdArrowGreen)"/>

        <!-- 12. Anti-foam injection from V-206 / P-205 -->
        <path d="M 1125 820 L 1148 820" fill="none" stroke="#8b5cf6" stroke-width="1.8" marker-end="url(#pfdArrowPurple)"/>
        <path d="M 1175 800 L 1175 640 L 922 640" fill="none" stroke="#8b5cf6" stroke-width="1.8" stroke-dasharray="4,3" marker-end="url(#pfdArrowPurple)"/>
      </g>

      <!-- ========================================== -->
      <!-- DCS CONTROLLER LOOPS & INSTRUMENTATION -->
      <!-- ========================================== -->
      <g id="pfd-co2-dcs-controls">
        <!-- TRC-201 (Absorber Overhead Temp 80°C) -->
        <g class="pfd-ctrl-badge" data-ctrl="TRC-201" transform="translate(680, 70)" cursor="pointer">
          <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#0284c7" stroke-width="1.8"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#0284c7" stroke-width="1"/>
          <text x="0" y="-4" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">TRC</text>
          <text x="0" y="9" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">201</text>
        </g>
        <line x1="665" y1="70" x2="615" y2="70" stroke="#0284c7" stroke-width="1.2" stroke-dasharray="3,2"/>

        <!-- LRC-201 (Absorber Rich Solution Level Controller) -->
        <g class="pfd-ctrl-badge" data-ctrl="LRC-201" transform="translate(660, 560)" cursor="pointer">
          <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#10b981" stroke-width="1.8"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#10b981" stroke-width="1"/>
          <text x="0" y="-4" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">LRC</text>
          <text x="0" y="9" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">201</text>
        </g>
        <line x1="645" y1="560" x2="585" y2="550" stroke="#10b981" stroke-width="1.2" stroke-dasharray="3,2"/>

        <!-- TRC-202 (Regenerator Bottom Reboiler Temp 120°C) -->
        <g class="pfd-ctrl-badge" data-ctrl="TRC-202" transform="translate(1500, 540)" cursor="pointer">
          <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#d97706" stroke-width="1.8"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#d97706" stroke-width="1"/>
          <text x="0" y="-4" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">TRC</text>
          <text x="0" y="9" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">202</text>
        </g>
        <line x1="1485" y1="540" x2="1425" y2="540" stroke="#d97706" stroke-width="1.2" stroke-dasharray="3,2"/>

        <!-- PRC-202 (Regenerator Overhead Pressure 1.46 kg/cm²A) -->
        <g class="pfd-ctrl-badge" data-ctrl="PRC-202" transform="translate(1490, 80)" cursor="pointer">
          <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#ef4444" stroke-width="1.8"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#ef4444" stroke-width="1"/>
          <text x="0" y="-4" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">PRC</text>
          <text x="0" y="9" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">202</text>
        </g>
        <line x1="1475" y1="80" x2="1425" y2="80" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="3,2"/>
      </g>

      <!-- ========================================== -->
      <!-- STREAM FLAGS & LABELS -->
      <!-- ========================================== -->
      <g id="pfd-co2-streams">
        <!-- Stream [1]: Converted Gas from Gas Reform -->
        <g class="pfd-stream-flag" data-stream="1" transform="translate(90, 385)">
          <polygon points="0,10 12,0 24,10 12,20" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="12" y="14" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">1</text>
          <text x="12" y="-12" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">CONV. GAS FROM GAS REF. SECT.</text>
          <!-- Process tags -->
          <rect x="-30" y="24" width="40" height="15" rx="3" fill="#0f2942" stroke="#00c8ef" stroke-width="0.8"/>
          <text x="-10" y="35" fill="#00c8ef" font-size="9" text-anchor="middle">28.9</text>
          <rect x="16" y="24" width="40" height="15" rx="3" fill="#0f2942" stroke="#fbbf24" stroke-width="0.8"/>
          <text x="36" y="35" fill="#fbbf24" font-size="9" text-anchor="middle">185 °C</text>
        </g>

        <!-- Stream [2]: Inlet Absorber -->
        <g class="pfd-stream-flag" data-stream="2" transform="translate(460, 315)">
          <polygon points="0,10 12,0 24,10 12,20" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="12" y="14" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">2</text>
          <rect x="-10" y="24" width="44" height="15" rx="3" fill="#0f2942" stroke="#fbbf24" stroke-width="0.8"/>
          <text x="12" y="35" fill="#fbbf24" font-size="9" text-anchor="middle">127 °C</text>
        </g>

        <!-- Stream [3]: Exit Absorber to Gas Reform -->
        <g class="pfd-stream-flag" data-stream="3" transform="translate(1400, 25)">
          <polygon points="0,10 12,0 24,10 12,20" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="12" y="14" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">3</text>
          <text x="12" y="-10" fill="#00c8ef" font-size="10.5" font-weight="bold" text-anchor="middle">TO GAS REFORM SECTION (METHANATOR)</text>
          <rect x="-20" y="24" width="36" height="15" rx="3" fill="#0f2942" stroke="#00c8ef" stroke-width="0.8"/>
          <text x="-2" y="35" fill="#00c8ef" font-size="9" text-anchor="middle">28.0</text>
          <rect x="20" y="24" width="36" height="15" rx="3" fill="#0f2942" stroke="#fbbf24" stroke-width="0.8"/>
          <text x="38" y="35" fill="#fbbf24" font-size="9" text-anchor="middle">80 °C</text>
        </g>

        <!-- Stream [4]: Acid Gas Exit Regenerator -->
        <g class="pfd-stream-flag" data-stream="4" transform="translate(1620, 60)">
          <polygon points="0,10 12,0 24,10 12,20" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="12" y="14" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">4</text>
          <rect x="-20" y="24" width="36" height="15" rx="3" fill="#0f2942" stroke="#00c8ef" stroke-width="0.8"/>
          <text x="-2" y="35" fill="#00c8ef" font-size="9" text-anchor="middle">1.46</text>
          <rect x="20" y="24" width="36" height="15" rx="3" fill="#0f2942" stroke="#fbbf24" stroke-width="0.8"/>
          <text x="38" y="35" fill="#fbbf24" font-size="9" text-anchor="middle">97 °C</text>
        </g>

        <!-- Stream [5]: Acid Gas to Urea Unit / ATM -->
        <g class="pfd-stream-flag" data-stream="5" transform="translate(2120, 120)">
          <polygon points="0,10 12,0 24,10 12,20" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="12" y="14" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">5</text>
          <text x="12" y="-12" fill="#ef4444" font-size="10.5" font-weight="bold" text-anchor="middle">TO UREA UNIT / ATM</text>
          <rect x="-35" y="24" width="42" height="15" rx="3" fill="#0f2942" stroke="#10b981" stroke-width="0.8"/>
          <text x="-14" y="35" fill="#10b981" font-size="8.5" text-anchor="middle">61000 MAX</text>
        </g>
      </g>

      <!-- ========================================== -->
      <!-- EQUIPMENT LAYER (INTERACTIVE & SPACIOUS) -->
      <!-- ========================================== -->
      <g id="pfd-co2-equipment">

        <!-- 1. E-201: CATACARB REBOILER (Inlet Exchanger) -->
        ${e201Svg}

        <!-- 2. V-201: REBOILER SEPARATOR -->
        <g class="pfd-eq-item" data-tag="V-201" transform="translate(360, 380)">
          <path d="M 0 15 C 0 0, 60 0, 60 15 L 60 55 C 60 70, 0 70, 0 55 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <line x1="5" y1="42" x2="55" y2="42" stroke="#0284c7" stroke-dasharray="2,2"/>
          
          <g transform="translate(-25, -40)">
            <rect width="110" height="34" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="55" y="15" fill="#0284c7" font-size="12.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">V-201</text>
            <text x="55" y="27" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل سائل المرجل</text>
          </g>
        </g>

        <!-- 3. P-206 A,B: CONDENSATE INJECTION PUMP -->
        <g class="pfd-eq-item" data-tag="P-206" transform="translate(360, 535)">
          <circle cx="28" cy="24" r="20" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <circle cx="28" cy="24" r="9" fill="url(#pfdMotorGrad)" stroke="#0f172a" stroke-width="1.2"/>
          <g transform="translate(-25, 48)">
            <rect width="105" height="34" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="52" y="15" fill="#0284c7" font-size="11.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">P-206 A,B</text>
            <text x="52" y="27" fill="#0f172a" font-size="8.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مضخة حقن المتكاثف</text>
          </g>
        </g>

        <!-- 4. T-201: CO2 ABSORBER COLUMN (LEFT MAIN TOWER) -->
        <g class="pfd-eq-item" data-tag="T-201" transform="translate(520, 110)">
          <!-- Top Dished Head -->
          <path d="M 0 35 C 0 0, 130 0, 130 35 Z" fill="url(#pfdDishTopGrad)" stroke="#0f172a" stroke-width="2.2"/>
          <!-- Main Cylinder Shell -->
          <rect x="0" y="35" width="130" height="390" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2.2"/>
          <!-- Bottom Dished Head -->
          <path d="M 0 425 C 0 455, 130 455, 130 425 Z" fill="url(#pfdDishBotGrad)" stroke="#0f172a" stroke-width="2.2"/>
          <!-- Support Skirt & Base -->
          <rect x="10" y="445" width="110" height="25" fill="url(#pfdSkirtGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <rect x="0" y="470" width="130" height="6" rx="2" fill="#334155" stroke="#0f172a" stroke-width="1.5"/>
          
          <!-- Internal Packed Beds (Mesh Packing) -->
          <g opacity="0.85">
            <rect x="14" y="55" width="102" height="70" rx="3" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
            <rect x="14" y="55" width="102" height="70" fill="url(#pfdPackingPattern)"/>
            
            <rect x="14" y="145" width="102" height="70" rx="3" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
            <rect x="14" y="145" width="102" height="70" fill="url(#pfdPackingPattern)"/>

            <rect x="14" y="235" width="102" height="70" rx="3" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
            <rect x="14" y="235" width="102" height="70" fill="url(#pfdPackingPattern)"/>

            <rect x="14" y="325" width="102" height="70" rx="3" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
            <rect x="14" y="325" width="102" height="70" fill="url(#pfdPackingPattern)"/>
          </g>

          <!-- Liquid Distributors -->
          <line x1="12" y1="48" x2="118" y2="48" stroke="#0284c7" stroke-width="2.5"/>
          <line x1="12" y1="228" x2="118" y2="228" stroke="#0284c7" stroke-width="2.5"/>

          <!-- Equipment Tag & Labels -->
          <g transform="translate(0, 485)">
            <rect width="130" height="44" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
            <text x="65" y="18" fill="#0284c7" font-size="14.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">T-201</text>
            <text x="65" y="34" fill="#0f172a" font-size="10.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">برج امتصاص كاتاكارب</text>
          </g>
        </g>

        <!-- 5. V-204: ABSORBER KO DRUM -->
        <g class="pfd-eq-item" data-tag="V-204" transform="translate(555, 30)">
          <path d="M 0 15 C 0 0, 60 0, 60 15 L 60 40 C 60 55, 0 55, 0 40 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <line x1="5" y1="26" x2="55" y2="26" stroke="#475569" stroke-dasharray="3,2"/>
          <g transform="translate(-30, -38)">
            <rect width="120" height="34" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="60" y="15" fill="#0284c7" font-size="12.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">V-204</text>
            <text x="60" y="27" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">وعاء فصل الغاز العلوي</text>
          </g>
        </g>

        <!-- 6. P-201 HT: HYDRAULIC TURBINE -->
        <g class="pfd-eq-item" data-tag="P-201HT" transform="translate(780, 520)">
          <path d="M 0 10 L 50 20 L 50 45 L 0 55 Z" fill="url(#pfdTurbineGrad)" stroke="#0f172a" stroke-width="2"/>
          <rect x="10" y="55" width="30" height="8" fill="url(#pfdSkirtGrad)" stroke="#0f172a" stroke-width="1.2"/>
          <g transform="translate(-25, 70)">
            <rect width="100" height="34" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="50" y="15" fill="#16a34a" font-size="11.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">P-201 HT</text>
            <text x="50" y="27" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">توربين استرجاع الضغط</text>
          </g>
        </g>

        <!-- Shaft Coupling -->
        <line x1="835" y1="545" x2="875" y2="545" stroke="#0f172a" stroke-width="3.5" stroke-dasharray="2,2"/>

        <!-- 7. P-201 A,B: SEMI-LEAN SOLUTION PUMP -->
        <g class="pfd-eq-item" data-tag="P-201" transform="translate(875, 510)">
          <circle cx="35" cy="35" r="28" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <circle cx="35" cy="35" r="14" fill="url(#pfdMotorGrad)" stroke="#0f172a" stroke-width="1.5"/>
          <rect x="25" y="0" width="12" height="12" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.2"/>
          <rect x="10" y="65" width="50" height="8" rx="2" fill="url(#pfdSkirtGrad)" stroke="#0f172a" stroke-width="1.2"/>
          <g transform="translate(-25, 78)">
            <rect width="120" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="60" y="16" fill="#0284c7" font-size="13" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">P-201 A,B</text>
            <text x="60" y="29" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مضخة المحلول شبه النقي</text>
          </g>
        </g>

        <!-- 8. E-207: SEMI-LEAN COOLER -->
        ${e207Svg}

        <!-- 9. P-202 A,B: LEAN SOL'N PUMP (Draws from E-204, Discharges to T-201 Top) -->
        <g class="pfd-eq-item" data-tag="P-202" transform="translate(1050, 495)">
          <circle cx="35" cy="35" r="26" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <circle cx="35" cy="35" r="12" fill="url(#pfdMotorGrad)" stroke="#0f172a" stroke-width="1.5"/>
          <rect x="10" y="62" width="50" height="8" rx="2" fill="url(#pfdSkirtGrad)" stroke="#0f172a" stroke-width="1.2"/>
          <g transform="translate(-25, 78)">
            <rect width="120" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="60" y="16" fill="#16a34a" font-size="13" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">P-202 A,B</text>
            <text x="60" y="29" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مضخة المحلول النقي</text>
          </g>
        </g>

        <!-- 10. E-204: BFW / LEAN SOL'N EXCHANGER (Directly connected to T-202 Bottom) -->
        ${e204Svg}

        <!-- 11. F-201: LEAN SOL'N FILTER (Discharge to T-201 Top) -->
        <g class="pfd-eq-item" data-tag="F-201" transform="translate(1055, 250)">
          <path d="M 0 10 C 0 0, 60 0, 60 10 L 60 45 C 60 55, 0 55, 0 45 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <line x1="6" y1="28" x2="54" y2="28" stroke="#d97706" stroke-dasharray="2,2"/>
          <g transform="translate(-22, -36)">
            <rect width="105" height="34" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="52" y="15" fill="#0284c7" font-size="12.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">F-201</text>
            <text x="52" y="27" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فلتر المحلول النقي</text>
          </g>
        </g>

        <!-- 12. T-202: CO2 REGENERATOR / STRIPPER (RIGHT MAIN TOWER) -->
        <g class="pfd-eq-item" data-tag="T-202" transform="translate(1360, 110)">
          <!-- Top Dished Head -->
          <path d="M 0 35 C 0 0, 130 0, 130 35 Z" fill="url(#pfdDishTopGrad)" stroke="#0f172a" stroke-width="2.2"/>
          <!-- Main Cylinder Shell -->
          <rect x="0" y="35" width="130" height="390" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2.2"/>
          <!-- Bottom Dished Head -->
          <path d="M 0 425 C 0 455, 130 455, 130 425 Z" fill="url(#pfdDishBotGrad)" stroke="#0f172a" stroke-width="2.2"/>
          <!-- Support Skirt & Base -->
          <rect x="10" y="445" width="110" height="25" fill="url(#pfdSkirtGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <rect x="0" y="470" width="130" height="6" rx="2" fill="#334155" stroke="#0f172a" stroke-width="1.5"/>
          
          <!-- Packed Beds -->
          <g opacity="0.85">
            <rect x="14" y="55" width="102" height="65" rx="3" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
            <rect x="14" y="55" width="102" height="65" fill="url(#pfdPackingPattern)"/>

            <rect x="14" y="135" width="102" height="65" rx="3" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
            <rect x="14" y="135" width="102" height="65" fill="url(#pfdPackingPattern)"/>

            <rect x="14" y="225" width="102" height="75" rx="3" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
            <rect x="14" y="225" width="102" height="75" fill="url(#pfdPackingPattern)"/>

            <rect x="14" y="320" width="102" height="75" rx="3" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
            <rect x="14" y="320" width="102" height="75" fill="url(#pfdPackingPattern)"/>
          </g>

          <!-- Equipment Tag & Labels -->
          <g transform="translate(-5, 485)">
            <rect width="140" height="44" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
            <text x="70" y="18" fill="#0284c7" font-size="14.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">T-202</text>
            <text x="70" y="34" fill="#0f172a" font-size="10.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">برج التجريد والتنشيط</text>
          </g>
        </g>

        <!-- 13. E-202: STEAM REBOILER -->
        ${e202Svg}

        <!-- 14. E-205 A,B: OVERHEAD CONDENSER -->
        ${e205Svg}

        <!-- 15. V-203: ACID GAS SEPARATOR -->
        <g class="pfd-eq-item" data-tag="V-203" transform="translate(1950, 195)">
          <path d="M 0 15 C 0 0, 65 0, 65 15 L 65 55 C 65 70, 0 70, 0 55 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <line x1="6" y1="42" x2="59" y2="42" stroke="#0284c7" stroke-dasharray="2,2"/>
          <g transform="translate(-25, -38)">
            <rect width="115" height="34" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="57" y="15" fill="#0284c7" font-size="12.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">V-203</text>
            <text x="57" y="27" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل الغاز الحامضي</text>
          </g>
        </g>

        <!-- 16. P-203 A,B: REFLUX PUMP -->
        <g class="pfd-eq-item" data-tag="P-203" transform="translate(1950, 360)">
          <circle cx="30" cy="24" r="20" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <circle cx="30" cy="24" r="9" fill="url(#pfdMotorGrad)" stroke="#0f172a" stroke-width="1.2"/>
          <g transform="translate(-25, 48)">
            <rect width="110" height="34" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="55" y="15" fill="#0284c7" font-size="11.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">P-203 A,B</text>
            <text x="55" y="27" fill="#0f172a" font-size="8.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مضخة الراجع (Reflux)</text>
          </g>
        </g>

        <!-- ========================================== -->
        <!-- BOTTOM DECK: CHEMICAL PREPARATION & DEGASSING -->
        <!-- ========================================== -->

        <!-- 17. V-205: CATACARB STORAGE TANK -->
        <g class="pfd-eq-item" data-tag="V-205" transform="translate(120, 780)">
          <path d="M 0 15 C 0 0, 80 0, 80 15 L 80 60 C 80 75, 0 75, 0 60 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <g transform="translate(-15, 78)">
            <rect width="110" height="34" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="55" y="15" fill="#16a34a" font-size="12.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">V-205</text>
            <text x="55" y="27" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">خزان محلول كاتاكارب</text>
          </g>
        </g>

        <!-- 18. V-207 & P-204: SUMP SYSTEM -->
        <g class="pfd-eq-item" data-tag="V-207" transform="translate(260, 800)">
          <rect x="0" y="0" width="50" height="40" rx="4" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.5"/>
          <text x="25" y="24" fill="#16a34a" font-size="11" font-weight="800" text-anchor="middle">V-207</text>
          <text x="25" y="55" fill="#0f172a" font-size="8.5" font-weight="bold" text-anchor="middle">حفرة التجميع</text>
        </g>

        <g class="pfd-eq-item" data-tag="P-204" transform="translate(340, 805)">
          <circle cx="22" cy="18" r="16" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.5"/>
          <text x="22" y="22" fill="#16a34a" font-size="10" font-weight="800" text-anchor="middle">P-204</text>
          <text x="22" y="50" fill="#0f172a" font-size="8.5" font-weight="bold" text-anchor="middle">مضخة الحفرة</text>
        </g>

        <!-- 19. V-209: CONDENSATE STRIPPER / DEGASSER -->
        <g class="pfd-eq-item" data-tag="V-209" transform="translate(480, 750)">
          <path d="M 0 15 C 0 0, 60 0, 60 15 L 60 70 C 60 85, 0 85, 0 70 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <rect x="8" y="20" width="44" height="42" fill="url(#pfdPackingPattern)" opacity="0.8"/>
          <g transform="translate(-25, -36)">
            <rect width="110" height="34" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="55" y="15" fill="#0284c7" font-size="12.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">V-209</text>
            <text x="55" y="27" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">برج نزع غاز المتكاثف</text>
          </g>
        </g>

        <!-- 20. E-206: CONDENSATE COOLER -->
        <g class="pfd-eq-item" data-tag="E-206" transform="translate(740, 790)">
          <circle cx="28" cy="22" r="18" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-15, 46)">
            <rect width="85" height="32" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="42" y="14" fill="#0284c7" font-size="11.5" font-weight="800" text-anchor="middle">E-206</text>
            <text x="42" y="26" fill="#0f172a" font-size="8.5" font-weight="bold" text-anchor="middle">مبرد المتكاثف</text>
          </g>
        </g>

        <!-- 22. P-208 A,B: CONDENSATE RETURN PUMP -->
        <g class="pfd-eq-item" data-tag="P-208" transform="translate(870, 790)">
          <circle cx="28" cy="22" r="18" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <circle cx="28" cy="22" r="8" fill="url(#pfdMotorGrad)" stroke="#0f172a" stroke-width="1.2"/>
          <g transform="translate(-20, 46)">
            <rect width="95" height="32" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="14" fill="#0284c7" font-size="11.5" font-weight="800" text-anchor="middle">P-208 A,B</text>
            <text x="47" y="26" fill="#0f172a" font-size="8.5" font-weight="bold" text-anchor="middle">مضخة المتكاثف</text>
          </g>
        </g>

        <!-- 23. V-206 & P-205 A,B: ANTI-FOAM SYSTEM -->
        <g class="pfd-eq-item" data-tag="V-206" transform="translate(1080, 795)">
          <rect x="0" y="0" width="45" height="45" rx="6" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-20, 50)">
            <rect width="85" height="32" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="42" y="14" fill="#7c3aed" font-size="11.5" font-weight="800" text-anchor="middle">V-206</text>
            <text x="42" y="26" fill="#0f172a" font-size="8.5" font-weight="bold" text-anchor="middle">مانع رغوة</text>
          </g>
        </g>

        <g class="pfd-eq-item" data-tag="P-205" transform="translate(1150, 805)">
          <circle cx="25" cy="18" r="16" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <circle cx="25" cy="18" r="7" fill="url(#pfdMotorGrad)" stroke="#0f172a" stroke-width="1.2"/>
          <g transform="translate(-20, 40)">
            <rect width="90" height="32" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="45" y="14" fill="#7c3aed" font-size="11" font-weight="800" text-anchor="middle">P-205 A,B</text>
            <text x="45" y="25" fill="#0f172a" font-size="8.5" font-weight="bold" text-anchor="middle">مضخة مانع الرغوة</text>
          </g>
        </g>

      </g>
    </g>
  `;
}
