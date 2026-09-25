/**
 * render_comp_300_svg.ts
 * Vector Blueprint Renderer for DWG NO. 6112P 100-300-00
 * Ammonia Unit - Compression Section (K-301, K-302, K-303, Intercoolers & Separators)
 */

import { renderShellAndTubeSVG } from './render_shell_and_tube';

export function renderCompression300SVG(showParticles: boolean): string {
  const isAnim = showParticles ? 'pfd-pipe-anim' : '';

  const e301Svg = renderShellAndTubeSVG({
    tag: 'E-301',
    nameAr: 'مبرد أولي للغاز',
    temaType: 'AES / Water Cooler',
    tagColor: '#0284c7',
    x: 65,
    y: 620,
    width: 90,
    height: 44,
    tubeSide: {
      fluidAr: 'غاز التخليق الخام',
      tempIn: '129°C',
      tempOut: '43°C',
      color: '#0284c7',
      inPos: 'axial-left',
      outPos: 'axial-right'
    },
    shellSide: {
      fluidAr: 'مياه التبريد CW',
      tempIn: '32°C',
      tempOut: '40°C',
      color: '#00c8ef',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  const e302Svg = renderShellAndTubeSVG({
    tag: 'E-302',
    nameAr: 'مبرد مرحلة 1',
    temaType: 'AES / Intercooler',
    tagColor: '#0284c7',
    x: 240,
    y: 200,
    width: 90,
    height: 44,
    tubeSide: {
      fluidAr: 'غاز مضغوط مرحلة 1',
      tempIn: '135°C',
      tempOut: '43°C',
      color: '#0284c7',
      inPos: 'axial-left',
      outPos: 'axial-right'
    },
    shellSide: {
      fluidAr: 'مياه التبريد CW',
      tempIn: '32°C',
      tempOut: '42°C',
      color: '#00c8ef',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  const e303Svg = renderShellAndTubeSVG({
    tag: 'E-303',
    nameAr: 'مبرد مرحلة 2',
    temaType: 'AES / Intercooler',
    tagColor: '#0284c7',
    x: 320,
    y: 620,
    width: 90,
    height: 44,
    tubeSide: {
      fluidAr: 'غاز مضغوط مرحلة 2',
      tempIn: '142°C',
      tempOut: '43°C',
      color: '#0284c7',
      inPos: 'axial-left',
      outPos: 'axial-right'
    },
    shellSide: {
      fluidAr: 'مياه التبريد CW',
      tempIn: '32°C',
      tempOut: '42°C',
      color: '#00c8ef',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  const e304Svg = renderShellAndTubeSVG({
    tag: 'E-304',
    nameAr: 'مبرد مرحلة 3',
    temaType: 'AES / HP Cooler',
    tagColor: '#0284c7',
    x: 425,
    y: 620,
    width: 90,
    height: 44,
    tubeSide: {
      fluidAr: 'غاز مضغوط مرحلة 3 HP',
      tempIn: '138°C',
      tempOut: '43°C',
      color: '#0284c7',
      inPos: 'axial-left',
      outPos: 'axial-right'
    },
    shellSide: {
      fluidAr: 'مياه التبريد CW',
      tempIn: '32°C',
      tempOut: '42°C',
      color: '#00c8ef',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  const e315Svg = renderShellAndTubeSVG({
    tag: 'E-315',
    nameAr: 'مبرد غاز التدوير',
    temaType: 'BEU / Recycle Cooler',
    tagColor: '#7c3aed',
    x: 360,
    y: 85,
    width: 90,
    height: 44,
    tubeSide: {
      fluidAr: 'غاز التدوير المعاد',
      tempIn: '55°C',
      tempOut: '43°C',
      color: '#7c3aed',
      inPos: 'axial-right',
      outPos: 'axial-left'
    },
    shellSide: {
      fluidAr: 'مياه التبريد CW',
      tempIn: '32°C',
      tempOut: '38°C',
      color: '#00c8ef',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  const e305Svg = renderShellAndTubeSVG({
    tag: 'E-305',
    nameAr: 'مبرد هواء 1',
    temaType: 'AEL / Air Intercooler',
    tagColor: '#0284c7',
    x: 900,
    y: 310,
    width: 80,
    height: 44,
    tubeSide: {
      fluidAr: 'هواء عملية مضغوط',
      tempIn: '120°C',
      tempOut: '38°C',
      color: '#00c8ef',
      inPos: 'axial-left',
      outPos: 'axial-right'
    },
    shellSide: {
      fluidAr: 'مياه التبريد CW',
      tempIn: '32°C',
      tempOut: '40°C',
      color: '#0284c7',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  const e306Svg = renderShellAndTubeSVG({
    tag: 'E-306',
    nameAr: 'مبرد هواء 2',
    temaType: 'AEL / Air Intercooler',
    tagColor: '#0284c7',
    x: 980,
    y: 310,
    width: 80,
    height: 44,
    tubeSide: {
      fluidAr: 'هواء مرحلة 2',
      tempIn: '130°C',
      tempOut: '38°C',
      color: '#00c8ef',
      inPos: 'axial-left',
      outPos: 'axial-right'
    },
    shellSide: {
      fluidAr: 'مياه التبريد CW',
      tempIn: '32°C',
      tempOut: '40°C',
      color: '#0284c7',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  const e307Svg = renderShellAndTubeSVG({
    tag: 'E-307',
    nameAr: 'مبرد هواء 3',
    temaType: 'AEL / Air Intercooler',
    tagColor: '#0284c7',
    x: 1060,
    y: 310,
    width: 80,
    height: 44,
    tubeSide: {
      fluidAr: 'هواء مرحلة 3',
      tempIn: '140°C',
      tempOut: '38°C',
      color: '#00c8ef',
      inPos: 'axial-left',
      outPos: 'axial-right'
    },
    shellSide: {
      fluidAr: 'مياه التبريد CW',
      tempIn: '32°C',
      tempOut: '40°C',
      color: '#0284c7',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  const e308Svg = renderShellAndTubeSVG({
    tag: 'E-308',
    nameAr: 'مبرد تجاوز الغاز',
    temaType: 'AES / Gas Cooler',
    tagColor: '#d97706',
    x: 1420,
    y: 310,
    width: 85,
    height: 44,
    tubeSide: {
      fluidAr: 'غاز طبيعي معاد By-pass',
      tempIn: '115°C',
      tempOut: '40°C',
      color: '#d97706',
      inPos: 'axial-left',
      outPos: 'axial-right'
    },
    shellSide: {
      fluidAr: 'مياه التبريد CW',
      tempIn: '32°C',
      tempOut: '40°C',
      color: '#0284c7',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  return `
    <!-- BLUEPRINT DRAWING 6112P-100-300-00 GRAPHICS -->
    <g id="pfd-comp-300-layers">
      
      <!-- ========================================== -->
      <!-- TITLE BLOCK / LEGEND (Bottom Right) -->
      <!-- ========================================== -->
      <g transform="translate(1420, 840)">
        <rect width="470" height="210" fill="#f8fafc" stroke="#0f172a" stroke-width="1.8" rx="4"/>
        <text x="15" y="24" fill="#0284c7" font-size="13" font-weight="bold" font-family="'Cairo', sans-serif">IRAQ NO. 3 PROJECT</text>
        <text x="15" y="42" fill="#334155" font-size="11" font-family="'Cairo', sans-serif">CUSTOMER: M.O.I. IRAQ - FERTILIZER PROJECT</text>
        <text x="15" y="58" fill="#334155" font-size="11" font-family="'Cairo', sans-serif">KHOR AL-ZUBAIR PHASE-1</text>
        <text x="15" y="78" fill="#0f172a" font-size="14" font-weight="bold" font-family="'Cairo', sans-serif">AMMONIA UNIT - COMPRESSION SECTION</text>
        <text x="15" y="96" fill="#0284c7" font-size="12" font-weight="bold">PROCESS FLOW DIAGRAM (K-301 / K-302 / K-303)</text>
        <line x1="0" y1="110" x2="470" y2="110" stroke="#0f172a" stroke-width="1"/>
        
        <text x="15" y="130" fill="#1e293b" font-size="10">ORDER NO: 563030-012</text>
        <text x="15" y="148" fill="#1e293b" font-size="10">DATE: 9.19.'75</text>
        <text x="15" y="166" fill="#1e293b" font-size="10">DWG NO: 6112P 100-300-00</text>
        
        <!-- Symbol Legend inside Title Block -->
        <g transform="translate(260, 120)">
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
      <!-- PIPING LINES LAYER -->
      <!-- ========================================== -->
      <g id="pfd-comp-piping">
        
        <!-- SECTION 1: SYNTHESIS GAS COMPRESSOR K-301 PIPING -->
        <!-- Stream 1: Inflow from Gas Reform -> E-301 -> V-301 -->
        <path d="M 40 760 L 95 760 L 95 698" fill="none" stroke="#0284c7" stroke-width="3.5" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>
        <path d="M 95 625 L 95 565 L 140 565 L 140 578" fill="none" stroke="#0284c7" stroke-width="3" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>
        
        <!-- Stream 2: V-301 overhead -> K-301 Case 1 Suction -->
        <path d="M 140 530 L 140 480 L 225 480 L 225 458" fill="none" stroke="#0284c7" stroke-width="3.5" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>

        <!-- K-301 Case 1 Discharge -> E-302 -> V-302 -> K-301 Case 2 Suction -->
        <path d="M 245 360 L 245 277" fill="none" stroke="#0284c7" stroke-width="3" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>
        <path d="M 280 240 L 320 240 L 320 205 L 205 205 L 205 218" fill="none" stroke="#0284c7" stroke-width="3" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>
        <path d="M 205 180 L 205 150 L 400 150 L 400 358" fill="none" stroke="#0284c7" stroke-width="3" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>

        <!-- K-301 Case 2 Discharge -> E-303 -> V-303 -> K-301 Case 3 Suction -->
        <path d="M 430 460 L 430 580 L 360 580 L 360 623" fill="none" stroke="#0284c7" stroke-width="3" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>
        <path d="M 360 695 L 360 720 L 295 720 L 295 682" fill="none" stroke="#0284c7" stroke-width="3" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>
        <path d="M 295 620 L 295 520 L 515 520 L 515 458" fill="none" stroke="#0284c7" stroke-width="3" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>

        <!-- K-301 Case 3 Discharge -> E-304 -> V-304 -> Stream 3 To Synthesis -->
        <path d="M 545 460 L 545 580 L 465 580 L 465 623" fill="none" stroke="#0284c7" stroke-width="3.5" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>
        <path d="M 465 695 L 465 720 L 510 720 L 510 682" fill="none" stroke="#0284c7" stroke-width="3.5" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>
        <path d="M 510 620 L 510 540 L 610 540 L 610 760 L 668 760" fill="none" stroke="#0284c7" stroke-width="4" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>

        <!-- RECYCLE LOOP (Stream 4 & Stream 5): Syn Loop Recycle to K-301 Case 3 Wheel -->
        <!-- Stream 4 from Synth Sect. -> Circulator Inflow -->
        <path d="M 40 100 L 530 100 L 530 358" fill="none" stroke="#8b5cf6" stroke-width="3.5" marker-end="url(#pfdArrowPurple)" class="${isAnim}"/>
        <!-- Circulator Discharge -> E-315 -> V-310 -> Stream 5 to Synth Sect. -->
        <path d="M 550 360 L 550 160 L 420 160 L 420 137" fill="none" stroke="#8b5cf6" stroke-width="3.5" marker-end="url(#pfdArrowPurple)" class="${isAnim}"/>
        <path d="M 370 120 L 345 120 L 345 138" fill="none" stroke="#8b5cf6" stroke-width="3.5" marker-end="url(#pfdArrowPurple)" class="${isAnim}"/>
        <path d="M 345 90 L 345 60 L 600 60 L 600 100 L 668 100" fill="none" stroke="#8b5cf6" stroke-width="4" marker-end="url(#pfdArrowPurple)" class="${isAnim}"/>

        <!-- Stream 6: Inter-connecting Purge/Balance Line from Syn Gas suction -->
        <path d="M 140 480 L 80 480 L 80 340 L 1260 340 L 1260 480 L 1333 480" fill="none" stroke="#0284c7" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>

        <!-- Steam Turbine Steam Lines (HP Steam & Exhaust) for K-301 -->
        <path d="M 325 300 L 325 378" fill="none" stroke="#ef4444" stroke-width="2.5" marker-end="url(#pfdArrowRed)"/>
        <path d="M 345 440 L 345 498" fill="none" stroke="#475569" stroke-width="2.5" marker-end="url(#pfdArrowSlate)"/>

        <!-- Drains for K-301 Separators (V-301, V-302, V-303, V-304, V-310) -->
        <path d="M 140 645 L 140 700 L 42 700" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#pfdArrowGreen)"/>
        <path d="M 205 265 L 205 310 L 152 310" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#pfdArrowGreen)"/>
        <path d="M 295 725 L 295 780 L 222 780" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#pfdArrowGreen)"/>
        <path d="M 510 725 L 510 780 L 442 780" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#pfdArrowGreen)"/>
        <path d="M 345 165 L 345 200 L 302 200" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#pfdArrowGreen)"/>

        <!-- SECTION 2: PROCESS AIR COMPRESSOR K-302 PIPING -->
        <!-- Atmospheric Intake: H-301 -> F-301 -> V-308 -> K-302 Case 1 (1st Stage) -->
        <path d="M 680 430 L 708 430" fill="none" stroke="#00c8ef" stroke-width="3.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 760 430 L 773 430" fill="none" stroke="#00c8ef" stroke-width="3.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 805 430 L 850 430 L 850 488" fill="none" stroke="#00c8ef" stroke-width="3.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- K-302 Case 1 (1st Stage Disch) -> E-305 -> V-305 -> 2nd Stage Suction -->
        <path d="M 875 490 L 875 400 L 935 400 L 935 377" fill="none" stroke="#00c8ef" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 935 310 L 935 297" fill="none" stroke="#00c8ef" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 935 230 L 935 200 L 910 200 L 910 488" fill="none" stroke="#00c8ef" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- K-302 Case 1 (2nd Stage Disch) -> E-306 -> V-306 -> K-302 Case 2 (3rd Stage Suction) -->
        <path d="M 935 550 L 935 600 L 1015 600 L 1015 377" fill="none" stroke="#00c8ef" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 1015 310 L 1015 297" fill="none" stroke="#00c8ef" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 1015 230 L 1015 200 L 1075 200 L 1075 488" fill="none" stroke="#00c8ef" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- K-302 Case 2 (3rd Stage Disch) -> E-307 -> V-307 -> 4th Stage Suction -->
        <path d="M 1095 490 L 1095 400 L 1095 377" fill="none" stroke="#00c8ef" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 1095 310 L 1095 297" fill="none" stroke="#00c8ef" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 1095 230 L 1095 180 L 1150 180 L 1150 488" fill="none" stroke="#00c8ef" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- K-302 Case 2 (4th Stage Final Disch) -> Stream 7 (Process Air to Gas Reform) & Utilities -->
        <path d="M 1170 550 L 1170 670 L 1198 670" fill="none" stroke="#00c8ef" stroke-width="4" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <!-- Branches: Process Air, Urea Unit, CO2 Removal, Inst Air -->
        <path d="M 1200 670 L 1200 760 L 1258 760" fill="none" stroke="#00c8ef" stroke-width="3.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 1200 670 L 1200 810 L 1258 810" fill="none" stroke="#00c8ef" stroke-width="2.5" stroke-dasharray="3,2" marker-end="url(#pfdArrowCyan)"/>
        <path d="M 1200 670 L 1200 860 L 1258 860" fill="none" stroke="#00c8ef" stroke-width="2.5" stroke-dasharray="3,2" marker-end="url(#pfdArrowCyan)"/>
        <path d="M 1200 670 L 1200 910 L 1258 910" fill="none" stroke="#00c8ef" stroke-width="2.5" stroke-dasharray="3,2" marker-end="url(#pfdArrowCyan)"/>

        <!-- Drains for K-302 Separators (V-305, V-306, V-307) -->
        <path d="M 935 295 L 900 295 L 900 328" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#pfdArrowGreen)"/>
        <path d="M 1015 295 L 980 295 L 980 328" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#pfdArrowGreen)"/>
        <path d="M 1095 295 L 1060 295 L 1060 328" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#pfdArrowGreen)"/>

        <!-- Steam Turbine Steam Lines for K-302 -->
        <path d="M 785 450 L 785 508" fill="none" stroke="#ef4444" stroke-width="2.5" marker-end="url(#pfdArrowRed)"/>
        <path d="M 785 580 L 785 638" fill="none" stroke="#475569" stroke-width="2.5" marker-end="url(#pfdArrowSlate)"/>

        <!-- SECTION 3: NATURAL GAS COMPRESSOR K-303 PIPING -->
        <!-- Stream 8 from B.L (V-115) -> V-111 -> K-303 Suction -->
        <path d="M 1300 130 L 1375 130 L 1375 228" fill="none" stroke="#f97316" stroke-width="3.5" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <path d="M 1375 295 L 1375 480 L 1375 508" fill="none" stroke="#f97316" stroke-width="3.5" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>

        <!-- K-303 Discharge -> Stream 9 To Gas Reform Section -->
        <path d="M 1435 510 L 1435 440 L 1550 440 L 1550 760 L 1598 760" fill="none" stroke="#f97316" stroke-width="4" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>

        <!-- Anti-Surge & Recycle By-Pass Loop -> E-308 -> V-111 -->
        <path d="M 1435 440 L 1460 440 L 1460 377" fill="none" stroke="#f97316" stroke-width="2.5" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <path d="M 1460 310 L 1460 200 L 1377 200" fill="none" stroke="#f97316" stroke-width="2.5" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>

        <!-- Steam Turbine Steam Lines for K-303 -->
        <path d="M 1300 460 L 1300 518" fill="none" stroke="#ef4444" stroke-width="2.5" marker-end="url(#pfdArrowRed)"/>
        <path d="M 1300 590 L 1300 648" fill="none" stroke="#475569" stroke-width="2.5" marker-end="url(#pfdArrowSlate)"/>
      </g>

      <!-- ========================================== -->
      <!-- DCS CONTROLLER LOOPS & INSTRUMENTATION -->
      <!-- ========================================== -->
      <g id="pfd-comp-dcs-controls">
        <!-- PIC-301 (Syn Gas Suction Pressure 25.5 kg/cm²A) -->
        <g class="pfd-ctrl-badge" data-ctrl="PIC-301" transform="translate(140, 440)" cursor="pointer">
          <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#0284c7" stroke-width="1.8"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#0284c7" stroke-width="1"/>
          <text x="0" y="-4" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">PIC</text>
          <text x="0" y="9" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">301</text>
        </g>
        <line x1="140" y1="455" x2="140" y2="480" stroke="#0284c7" stroke-width="1.2" stroke-dasharray="3,2"/>

        <!-- PIC-302 (Process Air Compressor Discharge 35 kg/cm²A) -->
        <g class="pfd-ctrl-badge" data-ctrl="PIC-302" transform="translate(1200, 610)" cursor="pointer">
          <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#00c8ef" stroke-width="1.8"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#00c8ef" stroke-width="1"/>
          <text x="0" y="-4" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">PIC</text>
          <text x="0" y="9" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">302</text>
        </g>
        <line x1="1200" y1="625" x2="1200" y2="670" stroke="#00c8ef" stroke-width="1.2" stroke-dasharray="3,2"/>

        <!-- PIC-303 (Natural Gas Compressor Discharge 35 kg/cm²A) -->
        <g class="pfd-ctrl-badge" data-ctrl="PIC-303" transform="translate(1550, 390)" cursor="pointer">
          <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#f97316" stroke-width="1.8"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#f97316" stroke-width="1"/>
          <text x="0" y="-4" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">PIC</text>
          <text x="0" y="9" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">303</text>
        </g>
        <line x1="1550" y1="405" x2="1550" y2="440" stroke="#f97316" stroke-width="1.2" stroke-dasharray="3,2"/>
      </g>

      <!-- ========================================== -->
      <!-- EQUIPMENT GRAPHICS LAYER -->
      <!-- ========================================== -->
      <g id="pfd-comp-equipment">

        <!-- 1. K-301: SYN. GAS COMPRESSOR & CIRCULATOR TRAIN -->
        <rect x="170" y="475" width="440" height="15" fill="url(#pfdSkirtGrad)" stroke="#0f172a" stroke-width="1.5" rx="3"/>
        <text x="390" y="505" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">K-301: SYN. GAS COMPRESSOR &amp; CIRCULATOR</text>
        <text x="390" y="520" fill="#475569" font-size="9" font-weight="600" text-anchor="middle">MULTI-CASE CENTRIFUGAL TRAIN WITH STEAM TURBINE DRIVER</text>

        <!-- K-301 Casing 1 (Stage 1) -->
        <g class="pfd-eq-item" data-tag="K-301-C1" transform="translate(190, 360)">
          <rect x="0" y="0" width="70" height="110" rx="8" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <circle cx="35" cy="55" r="26" fill="url(#pfdSteelHorizGrad)" stroke="#0284c7" stroke-width="1.5"/>
          <line x1="35" y1="29" x2="35" y2="81" stroke="#0f172a" stroke-width="1.8"/>
          <line x1="9" y1="55" x2="61" y2="55" stroke="#0f172a" stroke-width="1.8"/>
          <!-- Shaft -->
          <rect x="68" y="50" width="35" height="10" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1"/>
          <!-- High Clarity Plaque -->
          <g transform="translate(-15, -45)">
            <rect x="0" y="0" width="100" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="50" y="16" fill="#0284c7" font-size="13" font-weight="900" text-anchor="middle">K-301 C1</text>
            <text x="50" y="30" fill="#0f172a" font-size="10" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">المرحلة الأولى</text>
          </g>
          <text x="35" y="125" fill="#475569" font-size="8" font-weight="bold" text-anchor="middle">25.5 IN → 74.5 kg/cm²</text>
        </g>

        <!-- K-301 STEAM TURBINE DRIVER -->
        <g class="pfd-eq-item" data-tag="K-301-TURB" transform="translate(295, 375)">
          <polygon points="5,5 65,15 65,80 5,90" fill="url(#pfdTurbineGrad)" stroke="#0f172a" stroke-width="2"/>
          <circle cx="35" cy="47" r="20" fill="url(#pfdSteelHorizGrad)" stroke="#0f172a" stroke-width="1.2"/>
          <!-- Shaft extension -->
          <rect x="64" y="42" width="30" height="10" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1"/>
          <!-- High Clarity Plaque -->
          <g transform="translate(-15, -50)">
            <rect x="0" y="0" width="105" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="52" y="16" fill="#dc2626" font-size="13" font-weight="900" text-anchor="middle">K-301 TURB</text>
            <text x="52" y="30" fill="#0f172a" font-size="10" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">توربين البخار</text>
          </g>
        </g>

        <!-- K-301 Casing 2 (Stage 2) -->
        <g class="pfd-eq-item" data-tag="K-301-C2" transform="translate(390, 360)">
          <rect x="0" y="0" width="70" height="110" rx="8" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <circle cx="35" cy="55" r="24" fill="url(#pfdSteelHorizGrad)" stroke="#0284c7" stroke-width="1.5"/>
          <line x1="35" y1="31" x2="35" y2="79" stroke="#0f172a" stroke-width="1.8"/>
          <line x1="11" y1="55" x2="59" y2="55" stroke="#0f172a" stroke-width="1.8"/>
          <!-- Shaft extension to Case 3 -->
          <rect x="68" y="50" width="35" height="10" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1"/>
          <!-- High Clarity Plaque -->
          <g transform="translate(-15, -45)">
            <rect x="0" y="0" width="100" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="50" y="16" fill="#0284c7" font-size="13" font-weight="900" text-anchor="middle">K-301 C2</text>
            <text x="50" y="30" fill="#0f172a" font-size="10" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">المرحلة الثانية</text>
          </g>
          <text x="35" y="125" fill="#475569" font-size="8" font-weight="bold" text-anchor="middle">73.7 → 134.4 kg/cm²</text>
        </g>

        <!-- K-301 Casing 3 (Stage 3 + Circulator Wheel) -->
        <g class="pfd-eq-item" data-tag="K-301-C3" transform="translate(495, 360)">
          <rect x="0" y="0" width="85" height="110" rx="8" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <!-- Left side: 3rd stage compression -->
          <circle cx="28" cy="55" r="20" fill="url(#pfdSteelHorizGrad)" stroke="#0284c7" stroke-width="1.5"/>
          <!-- Right side: Circulator Impeller -->
          <circle cx="62" cy="55" r="20" fill="url(#pfdSteelHorizGrad)" stroke="#7c3aed" stroke-width="1.5"/>
          <line x1="45" y1="5" x2="45" y2="105" stroke="#0f172a" stroke-dasharray="2,2"/>
          <!-- High Clarity Plaque -->
          <g transform="translate(-15, -45)">
            <rect x="0" y="0" width="115" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="57" y="16" fill="#7c3aed" font-size="12.5" font-weight="900" text-anchor="middle">K-301 CASE 3</text>
            <text x="57" y="30" fill="#0f172a" font-size="10" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مرحلة 3 + التدوير</text>
          </g>
          <text x="42" y="125" fill="#475569" font-size="8" font-weight="bold" text-anchor="middle">P = 240.5 kg/cm²A</text>
        </g>

        <!-- K-301 COOLERS & SEPARATORS -->
        <!-- E-301: Syn Gas Precooler -->
        ${e301Svg}

        <!-- V-301: Precooler Separator -->
        <g class="pfd-eq-item" data-tag="V-301" transform="translate(120, 575)">
          <path d="M 0 15 C 0 0, 45 0, 45 15 L 45 50 C 45 65, 0 65, 0 50 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <line x1="4" y1="38" x2="41" y2="38" stroke="#0284c7" stroke-dasharray="2,2"/>
          <g transform="translate(-25, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#0284c7" font-size="12.5" font-weight="bold" text-anchor="middle">V-301</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل المبرد الأولي</text>
          </g>
        </g>

        <!-- E-302: 1st Stage Syn Gas Cooler -->
        ${e302Svg}

        <!-- V-302: 1st Stage Separator -->
        <g class="pfd-eq-item" data-tag="V-302" transform="translate(185, 195)">
          <path d="M 0 15 C 0 0, 45 0, 45 15 L 45 50 C 45 65, 0 65, 0 50 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <line x1="4" y1="38" x2="41" y2="38" stroke="#0284c7" stroke-dasharray="2,2"/>
          <g transform="translate(-25, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#0284c7" font-size="12.5" font-weight="bold" text-anchor="middle">V-302</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل مرحلة 1</text>
          </g>
        </g>

        <!-- E-303: 2nd Stage Syn Gas Cooler -->
        ${e303Svg}

        <!-- V-303: 2nd Stage Separator -->
        <g class="pfd-eq-item" data-tag="V-303" transform="translate(275, 615)">
          <path d="M 0 15 C 0 0, 45 0, 45 15 L 45 50 C 45 65, 0 65, 0 50 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <line x1="4" y1="38" x2="41" y2="38" stroke="#0284c7" stroke-dasharray="2,2"/>
          <g transform="translate(-25, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#0284c7" font-size="12.5" font-weight="bold" text-anchor="middle">V-303</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل مرحلة 2</text>
          </g>
        </g>

        <!-- E-304: 3rd Stage Syn Gas Cooler -->
        ${e304Svg}

        <!-- V-304: 3rd Stage Separator -->
        <g class="pfd-eq-item" data-tag="V-304" transform="translate(490, 615)">
          <path d="M 0 15 C 0 0, 45 0, 45 15 L 45 50 C 45 65, 0 65, 0 50 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <line x1="4" y1="38" x2="41" y2="38" stroke="#0284c7" stroke-dasharray="2,2"/>
          <g transform="translate(-25, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#0284c7" font-size="12.5" font-weight="bold" text-anchor="middle">V-304</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل مرحلة 3</text>
          </g>
        </g>

        <!-- E-315: Recycle Gas After Cooler -->
        ${e315Svg}

        <!-- V-310: Recycle Gas After Cooler Separator -->
        <g class="pfd-eq-item" data-tag="V-310" transform="translate(325, 85)">
          <path d="M 0 15 C 0 0, 40 0, 40 15 L 40 45 C 40 60, 0 60, 0 45 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-25, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#7c3aed" font-size="12.5" font-weight="bold" text-anchor="middle">V-310</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل غاز التدوير</text>
          </g>
        </g>

        <!-- 2. K-302: PROCESS AIR COMPRESSOR TRAIN -->
        <rect x="740" y="565" width="450" height="15" fill="url(#pfdSkirtGrad)" stroke="#0f172a" stroke-width="1.5" rx="3"/>
        <text x="965" y="595" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">K-302: PROCESS AIR COMPRESSOR</text>
        <text x="965" y="610" fill="#475569" font-size="9" font-weight="600" text-anchor="middle">4-STAGE AIR COMPRESSOR WITH INTERCOOLERS E-305, E-306, E-307</text>

        <!-- Air Intake Stack H-301 -->
        <g class="pfd-eq-item" data-tag="H-301" transform="translate(655, 380)">
          <polygon points="10,0 35,0 45,20 0,20" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.5"/>
          <rect x="10" y="20" width="25" height="70" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.5"/>
          <g transform="translate(-25, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">H-301</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مدخنة سحب الهواء</text>
          </g>
        </g>

        <!-- Air Filter F-301 -->
        <g class="pfd-eq-item" data-tag="F-301" transform="translate(710, 395)">
          <rect x="0" y="0" width="50" height="60" rx="4" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M 5 0 L 45 60 M 45 0 L 5 60" fill="none" stroke="#0284c7" stroke-dasharray="2,2"/>
          <g transform="translate(-22, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">F-301</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فلتر الهواء</text>
          </g>
        </g>

        <!-- Suction Air Separator V-308 -->
        <g class="pfd-eq-item" data-tag="V-308" transform="translate(775, 395)">
          <path d="M 0 15 C 0 0, 35 0, 35 15 L 35 45 C 35 60, 0 60, 0 45 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.5"/>
          <g transform="translate(-30, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">V-308</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل سحب الهواء</text>
          </g>
        </g>

        <!-- K-302 Steam Turbine Driver -->
        <g class="pfd-eq-item" data-tag="K-302-TURB" transform="translate(755, 500)">
          <polygon points="5,5 55,12 55,70 5,78" fill="url(#pfdTurbineGrad)" stroke="#0f172a" stroke-width="2"/>
          <rect x="54" y="35" width="25" height="10" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1"/>
          <g transform="translate(-20, -46)">
            <rect x="0" y="0" width="105" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="52" y="16" fill="#dc2626" font-size="12.5" font-weight="900" text-anchor="middle">K-302 TURB</text>
            <text x="52" y="30" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">توربين ضاغط الهواء</text>
          </g>
        </g>

        <!-- K-302 Case 1 (Stages 1 & 2) -->
        <g class="pfd-eq-item" data-tag="K-302-C1" transform="translate(835, 475)">
          <rect x="0" y="0" width="115" height="90" rx="8" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <circle cx="35" cy="45" r="24" fill="url(#pfdSteelHorizGrad)" stroke="#0284c7" stroke-width="1.5"/>
          <circle cx="80" cy="45" r="24" fill="url(#pfdSteelHorizGrad)" stroke="#0284c7" stroke-width="1.5"/>
          <rect x="114" y="40" width="30" height="10" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1"/>
          <g transform="translate(0, -45)">
            <rect x="0" y="0" width="115" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="57" y="16" fill="#0284c7" font-size="12.5" font-weight="900" text-anchor="middle">K-302 CASE 1</text>
            <text x="57" y="30" fill="#0f172a" font-size="10" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">المرحلة 1 و 2</text>
          </g>
        </g>

        <!-- K-302 Case 2 (Stages 3 & 4) -->
        <g class="pfd-eq-item" data-tag="K-302-C2" transform="translate(980, 475)">
          <rect x="0" y="0" width="115" height="90" rx="8" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <circle cx="35" cy="45" r="22" fill="url(#pfdSteelHorizGrad)" stroke="#0284c7" stroke-width="1.5"/>
          <circle cx="80" cy="45" r="22" fill="url(#pfdSteelHorizGrad)" stroke="#0284c7" stroke-width="1.5"/>
          <g transform="translate(0, -45)">
            <rect x="0" y="0" width="115" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="57" y="16" fill="#0284c7" font-size="12.5" font-weight="900" text-anchor="middle">K-302 CASE 2</text>
            <text x="57" y="30" fill="#0f172a" font-size="10" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">المرحلة 3 و 4</text>
          </g>
        </g>

        <!-- K-302 Intercoolers & Separators -->
        ${e305Svg}
        <g class="pfd-eq-item" data-tag="V-305" transform="translate(915, 230)">
          <path d="M 0 12 C 0 0, 40 0, 40 12 L 40 45 C 40 57, 0 57, 0 45 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.5"/>
          <g transform="translate(-28, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">V-305</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل هواء 1</text>
          </g>
        </g>

        ${e306Svg}
        <g class="pfd-eq-item" data-tag="V-306" transform="translate(995, 230)">
          <path d="M 0 12 C 0 0, 40 0, 40 12 L 40 45 C 40 57, 0 57, 0 45 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.5"/>
          <g transform="translate(-28, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">V-306</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل هواء 2</text>
          </g>
        </g>

        ${e307Svg}
        <g class="pfd-eq-item" data-tag="V-307" transform="translate(1075, 230)">
          <path d="M 0 12 C 0 0, 40 0, 40 12 L 40 45 C 40 57, 0 57, 0 45 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.5"/>
          <g transform="translate(-28, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">V-307</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل هواء 3</text>
          </g>
        </g>

        <!-- 3. K-303: NATURAL GAS COMPRESSOR TRAIN -->
        <rect x="1270" y="585" width="220" height="15" fill="url(#pfdSkirtGrad)" stroke="#0f172a" stroke-width="1.5" rx="3"/>
        <text x="1380" y="615" fill="#d97706" font-size="11" font-weight="bold" text-anchor="middle">K-303: NATURAL GAS COMPRESSOR</text>

        <!-- V-111: Natural Gas Drain Separator -->
        <g class="pfd-eq-item" data-tag="V-111" transform="translate(1350, 225)">
          <path d="M 0 15 C 0 0, 50 0, 50 15 L 50 55 C 50 70, 0 70, 0 55 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <line x1="5" y1="42" x2="45" y2="42" stroke="#d97706" stroke-dasharray="2,2"/>
          <g transform="translate(-25, -42)">
            <rect x="0" y="0" width="100" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="50" y="15" fill="#d97706" font-size="12" font-weight="bold" text-anchor="middle">V-111</text>
            <text x="50" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل الغاز الطبيعي</text>
          </g>
        </g>

        <!-- K-303 Turbine Driver -->
        <g class="pfd-eq-item" data-tag="K-303-TURB" transform="translate(1270, 515)">
          <polygon points="5,5 50,12 50,60 5,68" fill="url(#pfdTurbineGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <rect x="49" y="30" width="25" height="10" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1"/>
          <g transform="translate(-25, -44)">
            <rect x="0" y="0" width="105" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="52" y="16" fill="#dc2626" font-size="12" font-weight="900" text-anchor="middle">K-303 TURB</text>
            <text x="52" y="30" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">توربين ضاغط الغاز</text>
          </g>
        </g>

        <!-- K-303 Compressor Casing -->
        <g class="pfd-eq-item" data-tag="K-303" transform="translate(1345, 495)">
          <rect x="0" y="0" width="80" height="90" rx="8" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <circle cx="40" cy="45" r="26" fill="url(#pfdSteelHorizGrad)" stroke="#d97706" stroke-width="1.5"/>
          <line x1="40" y1="19" x2="40" y2="71" stroke="#0f172a" stroke-width="1.8"/>
          <line x1="14" y1="45" x2="66" y2="45" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-15, -44)">
            <rect x="0" y="0" width="110" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="55" y="16" fill="#d97706" font-size="13" font-weight="900" text-anchor="middle">K-303</text>
            <text x="55" y="30" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">ضاغط الغاز الطبيعي</text>
          </g>
        </g>

        <!-- E-308: Natural Gas By-Pass Cooler -->
        ${e308Svg}
      </g>


      <!-- ========================================== -->
      <!-- STREAM FLAGS & LABELS LAYER -->
      <!-- ========================================== -->
      <g id="pfd-comp-stream-flags">

        <!-- STREAM 1: SYNTHESIS GAS FROM GAS REFORM -->
        <g class="pfd-stream-flag" data-stream="1" transform="translate(30, 750)">
          <polygon points="0,10 10,0 20,10 10,20" fill="#0284c7" stroke="#0f172a" stroke-width="1.5"/>
          <text x="10" y="14" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">1</text>
          <text x="30" y="8" fill="#0284c7" font-size="10" font-weight="bold">SYN. GAS FROM GAS REFORM</text>
          <text x="30" y="20" fill="#475569" font-size="8.5" font-weight="600">50,680 kg/h | 129.3°C | 26.8 kg/cm²A</text>
        </g>

        <!-- STREAM 2: MAKE-UP GAS TO COMPRESSOR -->
        <g class="pfd-stream-flag" data-stream="2" transform="translate(170, 470)">
          <polygon points="0,10 10,0 20,10 10,20" fill="#0284c7" stroke="#0f172a" stroke-width="1.5"/>
          <text x="10" y="14" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">2</text>
          <text x="28" y="12" fill="#0284c7" font-size="9" font-weight="bold">MAKE-UP GAS TO COMP</text>
          <text x="28" y="22" fill="#475569" font-size="7.5" font-weight="600">48,040 kg/h | 43°C | 26 kg/cm²</text>
        </g>

        <!-- STREAM 3: MAKE-UP GAS TO SYNTHESIS (HP DISCHARGE) -->
        <g class="pfd-stream-flag" data-stream="3" transform="translate(680, 750)">
          <polygon points="0,10 10,0 20,10 10,20" fill="#0284c7" stroke="#0f172a" stroke-width="1.5"/>
          <text x="10" y="14" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">3</text>
          <text x="28" y="8" fill="#0284c7" font-size="10" font-weight="bold">MAKE-UP GAS TO SYNTHESIS</text>
          <text x="28" y="20" fill="#475569" font-size="8.5" font-weight="600">47,610 kg/h | 43°C | 240.5 kg/cm²A</text>
        </g>

        <!-- STREAM 4: RECYCLE GAS FROM SYNTHESIS SECTION -->
        <g class="pfd-stream-flag" data-stream="4" transform="translate(30, 90)">
          <polygon points="0,10 10,0 20,10 10,20" fill="#7c3aed" stroke="#0f172a" stroke-width="1.5"/>
          <text x="10" y="14" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">4</text>
          <text x="28" y="8" fill="#7c3aed" font-size="10" font-weight="bold">RECYCLE GAS FROM SYNTHESIS</text>
          <text x="28" y="20" fill="#475569" font-size="8.5" font-weight="600">205,100 kg/h (205.1 t/h) | 43°C</text>
        </g>

        <!-- STREAM 5: RECYCLE GAS TO SYNTHESIS SECTION -->
        <g class="pfd-stream-flag" data-stream="5" transform="translate(680, 90)">
          <polygon points="0,10 10,0 20,10 10,20" fill="#7c3aed" stroke="#0f172a" stroke-width="1.5"/>
          <text x="10" y="14" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">5</text>
          <text x="28" y="8" fill="#7c3aed" font-size="10" font-weight="bold">RECYCLE GAS TO SYNTHESIS</text>
          <text x="28" y="20" fill="#475569" font-size="8.5" font-weight="600">205,100 kg/h | 43°C | 245 kg/cm²A</text>
        </g>

        <!-- STREAM 6: SYNTHESIS GAS FROM SUCTION BALANCE -->
        <g class="pfd-stream-flag" data-stream="6" transform="translate(620, 330)">
          <polygon points="0,10 10,0 20,10 10,20" fill="#0284c7" stroke="#0f172a" stroke-width="1.5"/>
          <text x="10" y="14" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">6</text>
          <text x="28" y="12" fill="#0284c7" font-size="8.5" font-weight="bold">SYN. GAS BALANCE PURGE</text>
        </g>

        <!-- STREAM 7: PROCESS AIR TO GAS REFORM SECTION -->
        <g class="pfd-stream-flag" data-stream="7" transform="translate(1270, 750)">
          <polygon points="0,10 10,0 20,10 10,20" fill="#0284c7" stroke="#0f172a" stroke-width="1.5"/>
          <text x="10" y="14" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">7</text>
          <text x="28" y="8" fill="#0284c7" font-size="10" font-weight="bold">PROCESS AIR TO REFORM (R-102)</text>
          <text x="28" y="20" fill="#475569" font-size="8.5" font-weight="600">50,590 kg/h | 167°C | 35.0 kg/cm²A</text>
        </g>

        <!-- PROCESS AIR UTILITY BRANCHES -->
        <g transform="translate(1270, 800)">
          <text x="0" y="10" fill="#475569" font-size="8.5" font-weight="600">➔ AIR TO UREA UNIT (16.73 kg-mol/h / 7.14 t/d)</text>
          <text x="0" y="30" fill="#475569" font-size="8.5" font-weight="600">➔ AIR TO CO2 REMOVAL (V-209 DEGASSER)</text>
          <text x="0" y="50" fill="#475569" font-size="8.5" font-weight="600">➔ AIR TO INSTRUMENT AIR SYSTEM (71.38 mol/h)</text>
        </g>

        <!-- STREAM 8: NATURAL GAS FROM B.L (V-115) -->
        <g class="pfd-stream-flag" data-stream="8" transform="translate(1180, 120)">
          <polygon points="0,10 10,0 20,10 10,20" fill="#d97706" stroke="#0f172a" stroke-width="1.5"/>
          <text x="10" y="14" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">8</text>
          <text x="28" y="8" fill="#d97706" font-size="10" font-weight="bold">NATURAL GAS FROM B.L (V-115)</text>
          <text x="28" y="20" fill="#475569" font-size="8.5" font-weight="600">27,725 kg/h | 40°C | 19.0 kg/cm²A</text>
        </g>

        <!-- STREAM 9: NATURAL GAS TO GAS REFORM SECTION -->
        <g class="pfd-stream-flag" data-stream="9" transform="translate(1610, 750)">
          <polygon points="0,10 10,0 20,10 10,20" fill="#d97706" stroke="#0f172a" stroke-width="1.5"/>
          <text x="10" y="14" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">9</text>
          <text x="28" y="8" fill="#d97706" font-size="10" font-weight="bold">NATURAL GAS TO REFORM</text>
          <text x="28" y="20" fill="#475569" font-size="8.5" font-weight="600">104,226 kg/h | 117°C | 41.0 kg/cm²A</text>
        </g>

      </g>

    </g>
  `;
}
