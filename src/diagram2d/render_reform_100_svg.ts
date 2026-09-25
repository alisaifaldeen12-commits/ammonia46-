/**
 * render_reform_100_svg.ts
 * Vector Blueprint Renderer for DWG NO. 6112P 100-100-00
 * Ammonia Unit - Gas Reform & Shift Conversion Section
 * Process Flow:
 * NG -> H-101 -> R-102 A,B -> R-101 (Primary Reformer) -> R-103 (Secondary Reformer)
 * -> E-108 (RG WH Boiler) -> R-104 (HTS Converter)
 * -> E-109 & E-107 Heat Exchangers -> E-110 (LP Boiler) -> V-101 (Separator)
 * -> R-105 (LTS Converter) -> To Section 200 (CO2 Removal Section)
 */

import { renderShellAndTubeSVG } from './render_shell_and_tube';

export function renderReform100SVG(showParticles: boolean): string {
  const isAnim = showParticles ? 'pfd-pipe-anim' : '';

  const e108Svg = renderShellAndTubeSVG({
    tag: 'E-108',
    nameAr: 'مرجل الغاز المصلح HP',
    temaType: 'BEM / Kettle',
    tagColor: '#0284c7',
    x: 950,
    y: 235,
    width: 110,
    height: 48,
    tubeSide: {
      fluidAr: 'غاز مصلح',
      tempIn: '980°C',
      tempOut: '365°C',
      color: '#dc2626',
      inPos: 'bottom-left',
      outPos: 'axial-right'
    },
    shellSide: {
      fluidAr: 'مياه BFW / توليد بخار HP',
      tempIn: '240°C',
      tempOut: '315°C',
      color: '#00c8ef',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  const e109Svg = renderShellAndTubeSVG({
    tag: 'E-109',
    nameAr: 'مرجل غاز التحويل',
    temaType: 'AES / Floating Head',
    tagColor: '#0284c7',
    x: 1330,
    y: 205,
    width: 105,
    height: 46,
    tubeSide: {
      fluidAr: 'غاز HTS المحول',
      tempIn: '433°C',
      tempOut: '235°C',
      color: '#ea580c',
      inPos: 'axial-left',
      outPos: 'axial-right'
    },
    shellSide: {
      fluidAr: 'توليد بخار MP / مياه غلايات',
      tempIn: '180°C',
      tempOut: '220°C',
      color: '#00c8ef',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  const e107Svg = renderShellAndTubeSVG({
    tag: 'E-107',
    nameAr: 'مسخن التبادل الحراري',
    temaType: 'BEU / U-Tube',
    tagColor: '#0284c7',
    x: 1330,
    y: 315,
    width: 105,
    height: 46,
    tubeSide: {
      fluidAr: 'غاز HTS المحول',
      tempIn: '433°C',
      tempOut: '235°C',
      color: '#ea580c',
      inPos: 'axial-left',
      outPos: 'axial-right'
    },
    shellSide: {
      fluidAr: 'مياه تغذية الغلايات BFW',
      tempIn: '115°C',
      tempOut: '190°C',
      color: '#0284c7',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  const e110Svg = renderShellAndTubeSVG({
    tag: 'E-110',
    nameAr: 'مرجل الغاز LP Boiler',
    temaType: 'AEL / Fixed Sheet',
    tagColor: '#0284c7',
    x: 1490,
    y: 215,
    width: 110,
    height: 48,
    tubeSide: {
      fluidAr: 'غاز خام مبرد',
      tempIn: '235°C',
      tempOut: '128°C',
      color: '#d97706',
      inPos: 'axial-left',
      outPos: 'axial-right'
    },
    shellSide: {
      fluidAr: 'مياه إزالة الغازات / بخار منخفض',
      tempIn: '105°C',
      tempOut: '145°C',
      color: '#00c8ef',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  return `
    <g id="pfd-reform-100-layers">
      
      <!-- ========================================== -->
      <!-- TITLE BLOCK / LEGEND (Bottom Right) -->
      <!-- ========================================== -->
      <g transform="translate(1740, 840)">
        <rect width="480" height="220" fill="#f8fafc" stroke="#0f172a" stroke-width="1.8" rx="4"/>
        <text x="18" y="28" fill="#0284c7" font-size="13" font-weight="bold" font-family="'Cairo', sans-serif">IRAQ NO. 3 PROJECT</text>
        <text x="18" y="48" fill="#334155" font-size="11" font-family="'Cairo', sans-serif">CUSTOMER: M.O.I. IRAQ - FERTILIZER PROJECT</text>
        <text x="18" y="66" fill="#334155" font-size="11" font-family="'Cairo', sans-serif">KHOR AL-ZUBAIR PHASE-1 (AMMONIA UNIT)</text>
        <text x="18" y="88" fill="#0f172a" font-size="14" font-weight="bold" font-family="'Cairo', sans-serif">GAS REFORM & SHIFT CONVERSION SECTION</text>
        <text x="18" y="108" fill="#0284c7" font-size="12" font-weight="bold">DWG NO. 6112P 100-100-00</text>
        <line x1="0" y1="122" x2="480" y2="122" stroke="#0f172a" stroke-width="1"/>
        
        <text x="18" y="144" fill="#1e293b" font-size="10.5">ORDER NO: 563030-012</text>
        <text x="18" y="164" fill="#1e293b" font-size="10.5">DATE: 7 JAN '76 | UNIT: 100</text>
        <text x="18" y="186" fill="#0f172a" font-size="11.5" font-weight="bold">قسم إصلاح الغاز وتحويل أول أكسيد الكربون (Shift)</text>
        
        <!-- Legend Symbols -->
        <g transform="translate(280, 134)">
          <polygon points="0,6 6,0 12,6 6,12" fill="#0284c7" stroke="#0f172a" stroke-width="1"/>
          <text x="18" y="9" fill="#0f172a" font-size="9.5" font-weight="600">Stream No.</text>
          <circle cx="6" cy="26" r="6" fill="#e0f2fe" stroke="#0284c7" stroke-width="1"/>
          <text x="18" y="29" fill="#0f172a" font-size="9.5" font-weight="600">Press. kg/cm²</text>
          <rect x="0" y="42" width="14" height="11" rx="2" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
          <text x="18" y="51" fill="#0f172a" font-size="9.5" font-weight="600">Temp. °C</text>
          <rect x="0" y="60" width="14" height="11" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
          <text x="18" y="69" fill="#0f172a" font-size="9.5" font-weight="600">Flow kg/h</text>
        </g>
      </g>

      <!-- ========================================== -->
      <!-- PIPING LAYER (CLEAN & PRECISE PROCESS FLOW) -->
      <!-- ========================================== -->
      <g id="pfd-reform-piping">
        <!-- 1. Natural Gas Feed -> H-101 Fired Preheater -->
        <path d="M 30 290 L 98 290" fill="none" stroke="#0284c7" stroke-width="3.5" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>
        
        <!-- 2. Heated NG from H-101 (400°C) -> R-102 A,B Desulfurizers -->
        <path d="M 190 290 L 248 290" fill="none" stroke="#0284c7" stroke-width="3.5" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>

        <!-- 3. Desulfurized NG from R-102 -> Convection Coil E-101 in R-101 -->
        <path d="M 335 290 L 390 290 L 390 145 L 435 145 L 435 208" fill="none" stroke="#0284c7" stroke-width="3" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>

        <!-- 4. Steam Supply -> Mixing with NG in Convection Section -->
        <path d="M 390 180 L 433 180" fill="none" stroke="#00c8ef" stroke-width="2.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- 5. Process Air Feed -> Convection Coil E-104 -> Secondary Reformer R-103 -->
        <path d="M 30 420 L 380 420 L 380 320 L 433 320" fill="none" stroke="#00c8ef" stroke-width="2.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 515 320 L 760 320 L 760 250 L 798 250" fill="none" stroke="#00c8ef" stroke-width="2.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- 6. Mixed Feed (NG + Steam, Stream 1) -> R-101 Radiant Tubes Header -->
        <path d="M 515 210 L 555 210 L 555 190 L 608 190" fill="none" stroke="#0284c7" stroke-width="3.5" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>

        <!-- 7. Primary Reformer Effluent (Stream 2, 795°C) -> Secondary Reformer R-103 -->
        <path d="M 640 480 L 640 530 L 750 530 L 750 220 L 798 220" fill="none" stroke="#dc2626" stroke-width="4" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>

        <!-- 8. Secondary Reformer Effluent (Stream 3, 980°C) -> E-108 Reformed Gas WH Boiler -->
        <path d="M 855 450 L 855 490 L 980 490 L 980 332" fill="none" stroke="#dc2626" stroke-width="4" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>
        <path d="M 1030 275 L 1128 275" fill="none" stroke="#ef4444" stroke-width="3.5" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>

        <!-- 9. HTS R-104 Effluent (Stream 4, 433°C) -> E-109 WH Boiler & E-107 Heat Exchanger -->
        <path d="M 1190 435 L 1190 480 L 1300 480 L 1300 240 L 1328 240" fill="none" stroke="#ea580c" stroke-width="3.5" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <!-- Split to E-107 -->
        <path d="M 1300 350 L 1328 350" fill="none" stroke="#ea580c" stroke-width="3" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>

        <!-- 10. Effluent from E-109 and E-107 -> E-110 LP Boiler -->
        <path d="M 1420 240 L 1460 240 L 1460 250 L 1488 250" fill="none" stroke="#d97706" stroke-width="3.5" marker-end="url(#pfdArrowYellow)" class="${isAnim}"/>
        <path d="M 1420 350 L 1460 350 L 1460 250" fill="none" stroke="#d97706" stroke-width="3" class="${isAnim}"/>

        <!-- 11. Effluent from E-110 (128°C) -> V-101 Knock Out Separator -->
        <path d="M 1585 250 L 1658 250" fill="none" stroke="#0284c7" stroke-width="3.5" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>

        <!-- 12. V-101 Condensate Drain (Bottoms) -->
        <path d="M 1705 320 L 1705 390 L 1758 390" fill="none" stroke="#00c8ef" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#pfdArrowCyan)"/>

        <!-- 13. V-101 Overhead Vapor (Stream 5) -> R-105 LTS Converter Top Inlet -->
        <path d="M 1705 210 L 1705 150 L 1885 150 L 1885 193" fill="none" stroke="#0284c7" stroke-width="3.5" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>

        <!-- 14. R-105 LTS Effluent (Stream 6) -> Out to Section 200 (CO2 Removal Section) -->
        <path d="M 1885 435 L 1885 510 L 2218 510" fill="none" stroke="#10b981" stroke-width="4" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
      </g>

      <!-- ========================================== -->
      <!-- DCS CONTROLLER LOOPS & INSTRUMENTATION -->
      <!-- ========================================== -->
      <g id="pfd-reform-dcs-controls">
        <!-- TRC-101 (Primary Reformer Exit Temp 795°C) -->
        <g class="pfd-ctrl-badge" data-ctrl="TRC-101" transform="translate(670, 520)" cursor="pointer">
          <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#ef4444" stroke-width="1.8"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#ef4444" stroke-width="1"/>
          <text x="0" y="-4" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">TRC</text>
          <text x="0" y="9" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">101</text>
        </g>
        <line x1="670" y1="505" x2="670" y2="480" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="3,2"/>

        <!-- TRC-103 (Secondary Reformer Exit Temp 980°C) -->
        <g class="pfd-ctrl-badge" data-ctrl="TRC-103" transform="translate(895, 470)" cursor="pointer">
          <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#dc2626" stroke-width="1.8"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#dc2626" stroke-width="1"/>
          <text x="0" y="-4" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">TRC</text>
          <text x="0" y="9" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">103</text>
        </g>
        <line x1="880" y1="470" x2="855" y2="470" stroke="#dc2626" stroke-width="1.2" stroke-dasharray="3,2"/>

        <!-- TRC-104 (HTS Converter Exit Temp 433°C) -->
        <g class="pfd-ctrl-badge" data-ctrl="TRC-104" transform="translate(1215, 475)" cursor="pointer">
          <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#ea580c" stroke-width="1.8"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#ea580c" stroke-width="1"/>
          <text x="0" y="-4" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">TRC</text>
          <text x="0" y="9" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">104</text>
        </g>
        <line x1="1200" y1="475" x2="1190" y2="475" stroke="#ea580c" stroke-width="1.2" stroke-dasharray="3,2"/>

        <!-- TRC-105 (LTS Converter Exit Temp 215°C) -->
        <g class="pfd-ctrl-badge" data-ctrl="TRC-105" transform="translate(1925, 480)" cursor="pointer">
          <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#10b981" stroke-width="1.8"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#10b981" stroke-width="1"/>
          <text x="0" y="-4" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">TRC</text>
          <text x="0" y="9" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">105</text>
        </g>
        <line x1="1910" y1="480" x2="1885" y2="480" stroke="#10b981" stroke-width="1.2" stroke-dasharray="3,2"/>
      </g>

      <!-- ========================================== -->
      <!-- STREAM FLAGS & LABELS -->
      <!-- ========================================== -->
      <g id="pfd-reform-streams">
        <!-- Stream 1: Inlet R-101 -->
        <g class="pfd-stream-flag" data-stream="1" transform="translate(580, 165)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="8" y="11" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">1</text>
          <text x="8" y="-9" fill="#0284c7" font-size="9.5" font-weight="bold" text-anchor="middle">INLET R-101 (NG+STEAM)</text>
        </g>

        <!-- Process Steam Supply (S-39 Carbon Steel) -->
        <g transform="translate(330, 160)">
          <rect x="-10" y="-18" width="105" height="18" rx="3" fill="#ffffff" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="42" y="-5" fill="#d97706" font-size="8.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">بخار S-39 (كاربون ستيل)</text>
        </g>

        <!-- Stream 2: Exit R-101 -->
        <g class="pfd-stream-flag" data-stream="2" transform="translate(700, 505)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#dc2626" stroke="#f87171" stroke-width="1.5"/>
          <text x="8" y="11" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">2</text>
          <rect x="-18" y="18" width="52" height="14" rx="2" fill="#0f2942" stroke="#ef4444" stroke-width="0.8"/>
          <text x="8" y="28" fill="#ef4444" font-size="8.5" text-anchor="middle">795 °C</text>
        </g>

        <!-- Stream 8: Process Air -->
        <g class="pfd-stream-flag" data-stream="8" transform="translate(120, 395)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="8" y="11" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">8</text>
          <text x="8" y="-8" fill="#0284c7" font-size="9.5" font-weight="bold" text-anchor="middle">PROCESS AIR (K-302)</text>
        </g>

        <!-- Stream 3: Inlet HTS R-104 -->
        <g class="pfd-stream-flag" data-stream="3" transform="translate(1080, 250)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#dc2626" stroke="#f87171" stroke-width="1.5"/>
          <text x="8" y="11" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">3</text>
          <rect x="-18" y="18" width="52" height="14" rx="2" fill="#0f2942" stroke="#fbbf24" stroke-width="0.8"/>
          <text x="8" y="28" fill="#fbbf24" font-size="8.5" text-anchor="middle">365 °C</text>
        </g>

        <!-- Stream 4: Exit HTS R-104 -->
        <g class="pfd-stream-flag" data-stream="4" transform="translate(1240, 455)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#ea580c" stroke="#fb923c" stroke-width="1.5"/>
          <text x="8" y="11" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">4</text>
          <rect x="-18" y="18" width="52" height="14" rx="2" fill="#0f2942" stroke="#ea580c" stroke-width="0.8"/>
          <text x="8" y="28" fill="#ea580c" font-size="8.5" text-anchor="middle">433 °C</text>
        </g>

        <!-- Stream 5: Inlet LTS R-105 (After E-110 & V-101) -->
        <g class="pfd-stream-flag" data-stream="5" transform="translate(1780, 125)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="8" y="11" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">5</text>
          <rect x="-18" y="18" width="52" height="14" rx="2" fill="#0f2942" stroke="#fbbf24" stroke-width="0.8"/>
          <text x="8" y="28" fill="#fbbf24" font-size="8.5" text-anchor="middle">215 °C</text>
        </g>

        <!-- Stream 6: LTS Exit to Section 200 (CO2 Removal) -->
        <g class="pfd-stream-flag" data-stream="6" transform="translate(2040, 485)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#10b981" stroke="#34d399" stroke-width="1.5"/>
          <text x="8" y="11" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">6</text>
          <text x="8" y="-10" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">TO CO2 REMOVAL SECTION (SECTION 200)</text>
          <rect x="-24" y="18" width="64" height="14" rx="2" fill="#0f2942" stroke="#10b981" stroke-width="0.8"/>
          <text x="8" y="28" fill="#10b981" font-size="8.5" text-anchor="middle">28.9 kg/cm²</text>
        </g>
      </g>

      <!-- ========================================== -->
      <!-- EQUIPMENT LAYER (HIGH-VISIBILITY VECTOR) -->
      <!-- ========================================== -->
      <g id="pfd-reform-equipment">

        <!-- 1. H-101: FIRED GAS PREHEATER -->
        <g class="pfd-eq-item" data-tag="H-101" transform="translate(100, 190)">
          <!-- Top Dished Head -->
          <path d="M 0 25 C 0 0, 90 0, 90 25 Z" fill="url(#pfdDishTopGrad)" stroke="#0f172a" stroke-width="2"/>
          <!-- Cylinder Body -->
          <rect x="0" y="25" width="90" height="160" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <!-- Bottom Combustion Hearth -->
          <rect x="5" y="150" width="80" height="35" rx="4" fill="url(#pfdFireGrad)" stroke="#dc2626" stroke-width="1.5"/>
          <!-- Serpentine Heating Coil -->
          <path d="M 15 145 L 45 45 L 75 145" fill="none" stroke="#d97706" stroke-width="2.5"/>
          <!-- Support Skirt -->
          <rect x="10" y="185" width="70" height="15" fill="url(#pfdSkirtGrad)" stroke="#0f172a" stroke-width="1.5"/>
          
          <g transform="translate(-20, -42)">
            <rect width="130" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="65" y="16" fill="#d97706" font-size="13" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">H-101</text>
            <text x="65" y="30" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مسخن الغاز الأولي بالفرن</text>
          </g>
        </g>

        <!-- 2. R-102 A,B: DESULFURIZERS -->
        <g class="pfd-eq-item" data-tag="R-102" transform="translate(250, 190)">
          <!-- Top Dished Head -->
          <path d="M 0 30 C 0 0, 85 0, 85 30 Z" fill="url(#pfdDishTopGrad)" stroke="#0f172a" stroke-width="2"/>
          <!-- Vertical Shell -->
          <rect x="0" y="30" width="85" height="195" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <!-- Bottom Dished Head -->
          <path d="M 0 225 C 0 250, 85 250, 85 225 Z" fill="url(#pfdDishBotGrad)" stroke="#0f172a" stroke-width="2"/>
          <!-- Skirt -->
          <rect x="10" y="238" width="65" height="16" fill="url(#pfdSkirtGrad)" stroke="#0f172a" stroke-width="1.5"/>
          
          <!-- Catalyst Beds (ZnO Packing) -->
          <rect x="10" y="50" width="65" height="65" rx="3" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
          <rect x="10" y="50" width="65" height="65" fill="url(#pfdPackingPattern)"/>
          
          <rect x="10" y="135" width="65" height="65" rx="3" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
          <rect x="10" y="135" width="65" height="65" fill="url(#pfdPackingPattern)"/>

          <g transform="translate(-25, -42)">
            <rect width="135" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="67" y="16" fill="#0284c7" font-size="13" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">R-102 A, B</text>
            <text x="67" y="30" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مفاعل إزالة الكبريت ZnO</text>
          </g>
        </g>

        <!-- 3. R-101: PRIMARY REFORMER -->
        <g class="pfd-eq-item" data-tag="R-101" transform="translate(410, 160)">
          <!-- Convection Section Box -->
          <rect x="15" y="30" width="90" height="240" fill="#334155" stroke="#0f172a" stroke-width="2"/>
          <!-- Chimney Exhaust Stack ST-101 -->
          <path d="M 50 30 L 50 0 L 70 0 L 70 30 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          
          <!-- Convection Coils: E-101 to E-105 -->
          <g class="pfd-sub-eq" data-tag="E-101">
            <rect x="20" y="45" width="80" height="26" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
            <text x="60" y="62" fill="#0284c7" font-size="10" font-weight="800" text-anchor="middle">E-101 (غاز التغذية)</text>
          </g>
          <g class="pfd-sub-eq" data-tag="E-102">
            <rect x="20" y="80" width="80" height="26" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
            <text x="60" y="97" fill="#0284c7" font-size="10" font-weight="800" text-anchor="middle">E-102 (بخار MP)</text>
          </g>
          <g class="pfd-sub-eq" data-tag="E-103">
            <rect x="20" y="115" width="80" height="26" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
            <text x="60" y="132" fill="#0284c7" font-size="10" font-weight="800" text-anchor="middle">E-103 (غاز+بخار)</text>
          </g>
          <g class="pfd-sub-eq" data-tag="E-104">
            <rect x="20" y="150" width="80" height="26" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
            <text x="60" y="167" fill="#0284c7" font-size="10" font-weight="800" text-anchor="middle">E-104 (هواء العملية)</text>
          </g>
          <g class="pfd-sub-eq" data-tag="E-105">
            <rect x="20" y="185" width="80" height="26" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
            <text x="60" y="202" fill="#0284c7" font-size="10" font-weight="800" text-anchor="middle">E-105 (مياه BFW)</text>
          </g>

          <!-- Radiant Section Box with Glowing Fire -->
          <rect x="120" y="30" width="130" height="300" rx="4" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <rect x="125" y="235" width="120" height="90" rx="3" fill="url(#pfdFireGrad)" stroke="#dc2626" stroke-width="1.8"/>
          
          <!-- 288 Catalyst Tubes Lines in metallic silver -->
          <line x1="140" y1="45" x2="140" y2="305" stroke="#cbd5e1" stroke-width="3"/>
          <line x1="160" y1="45" x2="160" y2="305" stroke="#cbd5e1" stroke-width="3"/>
          <line x1="180" y1="45" x2="180" y2="305" stroke="#cbd5e1" stroke-width="3"/>
          <line x1="200" y1="45" x2="200" y2="305" stroke="#cbd5e1" stroke-width="3"/>
          <line x1="220" y1="45" x2="220" y2="305" stroke="#cbd5e1" stroke-width="3"/>
          <line x1="240" y1="45" x2="240" y2="305" stroke="#cbd5e1" stroke-width="3"/>

          <g transform="translate(105, -42)">
            <rect width="160" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
            <text x="80" y="16" fill="#dc2626" font-size="14.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">R-101</text>
            <text x="80" y="30" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">المصلح الأولي (288 أنبوب)</text>
          </g>
        </g>

        <!-- 4. R-103: SECONDARY REFORMER -->
        <g class="pfd-eq-item" data-tag="R-103" transform="translate(800, 190)">
          <!-- Top Dished Conical Section -->
          <path d="M 0 35 C 0 0, 95 0, 95 35 L 95 200 C 95 230, 0 230, 0 200 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <!-- Catalyst Bed with Mesh -->
          <rect x="12" y="85" width="71" height="105" rx="3" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
          <rect x="12" y="85" width="71" height="105" fill="url(#pfdPackingPattern)"/>
          <!-- Skirt -->
          <rect x="12" y="215" width="71" height="16" fill="url(#pfdSkirtGrad)" stroke="#0f172a" stroke-width="1.5"/>

          <g transform="translate(-20, -42)">
            <rect width="135" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
            <text x="67" y="16" fill="#dc2626" font-size="13.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">R-103</text>
            <text x="67" y="30" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">المصلح الثانوي مع الهواء</text>
          </g>
        </g>

        <!-- 5. E-108: REFORMED GAS W.H. BOILER -->
        ${e108Svg}

        <!-- 6. R-104: PRIMARY CO CONVERTER (HTS) -->
        <g class="pfd-eq-item" data-tag="R-104" transform="translate(1130, 190)">
          <!-- Top Dished Head -->
          <path d="M 0 30 C 0 0, 95 0, 95 30 Z" fill="url(#pfdDishTopGrad)" stroke="#0f172a" stroke-width="2"/>
          <!-- Shell -->
          <rect x="0" y="30" width="95" height="200" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <!-- Bottom Dished Head -->
          <path d="M 0 230 C 0 255, 95 255, 95 230 Z" fill="url(#pfdDishBotGrad)" stroke="#0f172a" stroke-width="2"/>
          <!-- Skirt -->
          <rect x="12" y="245" width="71" height="16" fill="url(#pfdSkirtGrad)" stroke="#0f172a" stroke-width="1.5"/>

          <!-- Catalyst Bed with Mesh -->
          <rect x="12" y="50" width="71" height="155" rx="3" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
          <rect x="12" y="50" width="71" height="155" fill="url(#pfdPackingPattern)"/>

          <g transform="translate(-20, -42)">
            <rect width="135" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
            <text x="67" y="16" fill="#0284c7" font-size="13.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">R-104</text>
            <text x="67" y="30" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">محول CO عالي الحرارة HTS</text>
          </g>
        </g>

        <!-- 7. E-109: CONVERTED GAS W.H. BOILER -->
        ${e109Svg}

        <!-- 8. E-107: PREHEATER / HEAT EXCHANGER -->
        ${e107Svg}

        <!-- 9. E-110: L.P. BOILER / RAW GAS COOLER -->
        ${e110Svg}

        <!-- 10. V-101: CONVERTED GAS SEPARATOR -->
        <g class="pfd-eq-item" data-tag="V-101" transform="translate(1660, 205)">
          <!-- Top Dished Head -->
          <path d="M 0 20 C 0 0, 75 0, 75 20 L 75 80 C 75 100, 0 100, 0 80 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <line x1="8" y1="65" x2="67" y2="65" stroke="#0284c7" stroke-dasharray="3,2"/>
          <g transform="translate(-15, 110)">
            <rect width="105" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="52" y="15" fill="#0284c7" font-size="12.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">V-101</text>
            <text x="52" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل الغاز والماء</text>
          </g>
        </g>

        <!-- 11. R-105: SECONDARY CO CONVERTER (LTS) -->
        <g class="pfd-eq-item" data-tag="R-105" transform="translate(1830, 190)">
          <!-- Top Dished Head -->
          <path d="M 0 30 C 0 0, 95 0, 95 30 Z" fill="url(#pfdDishTopGrad)" stroke="#0f172a" stroke-width="2"/>
          <!-- Shell -->
          <rect x="0" y="30" width="95" height="200" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <!-- Bottom Dished Head -->
          <path d="M 0 230 C 0 255, 95 255, 95 230 Z" fill="url(#pfdDishBotGrad)" stroke="#0f172a" stroke-width="2"/>
          <!-- Skirt -->
          <rect x="12" y="245" width="71" height="16" fill="url(#pfdSkirtGrad)" stroke="#0f172a" stroke-width="1.5"/>

          <!-- Catalyst Bed with Mesh -->
          <rect x="12" y="50" width="71" height="155" rx="3" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
          <rect x="12" y="50" width="71" height="155" fill="url(#pfdPackingPattern)"/>

          <g transform="translate(-20, -42)">
            <rect width="135" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
            <text x="67" y="16" fill="#0284c7" font-size="13.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">R-105</text>
            <text x="67" y="30" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">محول CO منخفض الحرارة LTS</text>
          </g>
        </g>

      </g>
    </g>
  `;
}
