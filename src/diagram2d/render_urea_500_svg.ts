/**
 * render_urea_500_svg.ts
 * Vector Blueprint Renderer for DWG NO. 6112P 100-501-00
 * Urea Unit - Process Flow Diagram (PFD)
 * Khor Al-Zubair Phase-1 (M.O.I. Iraq Fertilizer Project No. 3)
 */

import { renderShellAndTubeSVG } from './render_shell_and_tube';

export function renderUrea500SVG(showParticles: boolean): string {
  const isAnim = showParticles ? 'pfd-pipe-anim' : '';

  const e511Svg = renderShellAndTubeSVG({
    tag: 'E-511',
    nameAr: 'مبرد CO2 مرحلة 1',
    temaType: 'AES / CO2 Intercooler',
    tagColor: '#0284c7',
    x: 155,
    y: 110,
    width: 85,
    height: 44,
    tubeSide: {
      fluidAr: 'غاز CO2 مرحلة 1',
      tempIn: '135°C',
      tempOut: '40°C',
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

  const e512Svg = renderShellAndTubeSVG({
    tag: 'E-512',
    nameAr: 'مبرد CO2 مرحلة 2',
    temaType: 'AES / CO2 Intercooler',
    tagColor: '#0284c7',
    x: 255,
    y: 110,
    width: 85,
    height: 44,
    tubeSide: {
      fluidAr: 'غاز CO2 مرحلة 2',
      tempIn: '140°C',
      tempOut: '40°C',
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

  const e513Svg = renderShellAndTubeSVG({
    tag: 'E-513',
    nameAr: 'مبرد CO2 مرحلة 3',
    temaType: 'AES / CO2 Intercooler',
    tagColor: '#0284c7',
    x: 355,
    y: 110,
    width: 85,
    height: 44,
    tubeSide: {
      fluidAr: 'غاز CO2 مرحلة 3',
      tempIn: '145°C',
      tempOut: '40°C',
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

  const e504Svg = renderShellAndTubeSVG({
    tag: 'E-504',
    nameAr: 'مكثف كاربامات 1',
    temaType: 'BEM / HP Carbamate Condenser',
    tagColor: '#16a34a',
    x: 840,
    y: 130,
    width: 130,
    height: 52,
    tubeSide: {
      fluidAr: 'غازات التفاعل والغاز المسترجع',
      tempIn: '168°C',
      tempOut: '175°C',
      color: '#10b981',
      inPos: 'axial-left',
      outPos: 'axial-right'
    },
    shellSide: {
      fluidAr: 'توليد بخار LP (4.5 ata)',
      tempIn: '105°C',
      tempOut: '148°C',
      color: '#d97706',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  const e505Svg = renderShellAndTubeSVG({
    tag: 'E-505',
    nameAr: 'مكثف كاربامات 2',
    temaType: 'BEM / HP Carbamate Condenser',
    tagColor: '#16a34a',
    x: 840,
    y: 260,
    width: 130,
    height: 52,
    tubeSide: {
      fluidAr: 'غازات التفاعل والغاز المسترجع',
      tempIn: '175°C',
      tempOut: '170°C',
      color: '#10b981',
      inPos: 'axial-left',
      outPos: 'axial-right'
    },
    shellSide: {
      fluidAr: 'مياه تغذية المراجل BFW',
      tempIn: '105°C',
      tempOut: '140°C',
      color: '#0284c7',
      inPos: 'bottom',
      outPos: 'top'
    }
  });

  const e501Svg = renderShellAndTubeSVG({
    tag: 'E-501',
    nameAr: 'المجرد الأنبوبي Stripper',
    temaType: 'Vertical Falling Film Stripper',
    tagColor: '#ea580c',
    x: 1040,
    y: 180,
    width: 75,
    height: 260,
    orientation: 'vertical',
    tubeSide: {
      fluidAr: 'محلول اليوريا والكاربامات الهابط',
      tempIn: '190°C',
      tempOut: '160°C',
      color: '#16a34a',
      inPos: 'axial-top',
      outPos: 'axial-bottom'
    },
    shellSide: {
      fluidAr: 'بخار عالي الضغط (26 ata Steam)',
      tempIn: '215°C',
      tempOut: '215°C',
      color: '#dc2626',
      inPos: 'right',
      outPos: 'right'
    }
  });

  const e502Svg = renderShellAndTubeSVG({
    tag: 'E-502',
    nameAr: 'محلل الضغط المتوسط',
    temaType: 'Vertical Falling Film Decomposer',
    tagColor: '#0284c7',
    x: 1175,
    y: 300,
    width: 70,
    height: 115,
    orientation: 'vertical',
    tubeSide: {
      fluidAr: 'محلول اليوريا MP',
      tempIn: '160°C',
      tempOut: '138°C',
      color: '#16a34a',
      inPos: 'axial-top',
      outPos: 'axial-bottom'
    },
    shellSide: {
      fluidAr: 'بخار تسخين MP Steam',
      tempIn: '155°C',
      tempOut: '140°C',
      color: '#ea580c',
      inPos: 'right',
      outPos: 'right'
    }
  });

  const e506Svg = renderShellAndTubeSVG({
    tag: 'E-506',
    nameAr: 'مكثف MP',
    temaType: 'AES / MP Condenser',
    tagColor: '#0284c7',
    x: 1290,
    y: 130,
    width: 90,
    height: 44,
    tubeSide: {
      fluidAr: 'غازات MP المكثفة',
      tempIn: '125°C',
      tempOut: '75°C',
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

  const e503Svg = renderShellAndTubeSVG({
    tag: 'E-503',
    nameAr: 'محلل الضغط المنخفض',
    temaType: 'Vertical LP Decomposer',
    tagColor: '#0284c7',
    x: 1600,
    y: 300,
    width: 68,
    height: 115,
    orientation: 'vertical',
    tubeSide: {
      fluidAr: 'محلول اليوريا LP (75%)',
      tempIn: '138°C',
      tempOut: '135°C',
      color: '#16a34a',
      inPos: 'axial-top',
      outPos: 'axial-bottom'
    },
    shellSide: {
      fluidAr: 'بخار تسخين LP Steam',
      tempIn: '145°C',
      tempOut: '130°C',
      color: '#ea580c',
      inPos: 'right',
      outPos: 'right'
    }
  });

  const e507Svg = renderShellAndTubeSVG({
    tag: 'E-507',
    nameAr: 'مكثف LP',
    temaType: 'AES / LP Condenser',
    tagColor: '#0284c7',
    x: 1710,
    y: 130,
    width: 90,
    height: 44,
    tubeSide: {
      fluidAr: 'غازات LP المكثفة',
      tempIn: '85°C',
      tempOut: '45°C',
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

  const e521Svg = renderShellAndTubeSVG({
    tag: 'E-521',
    nameAr: 'محلل اليوريا المائي',
    temaType: 'Vertical HP Hydrolyzer',
    tagColor: '#dc2626',
    x: 2020,
    y: 130,
    width: 70,
    height: 190,
    orientation: 'vertical',
    tubeSide: {
      fluidAr: 'مياه الصرف المحملة باليوريا',
      tempIn: '120°C',
      tempOut: '190°C',
      color: '#0284c7',
      inPos: 'axial-top',
      outPos: 'axial-bottom'
    },
    shellSide: {
      fluidAr: 'بخار عالي الضغط (28 ata Steam)',
      tempIn: '230°C',
      tempOut: '230°C',
      color: '#dc2626',
      inPos: 'right',
      outPos: 'right'
    }
  });

  const e561Svg = renderShellAndTubeSVG({
    tag: 'E-561',
    nameAr: 'مبخر التركيز 1 (95%)',
    temaType: 'Vertical Calandria Evaporator',
    tagColor: '#16a34a',
    x: 2160,
    y: 130,
    width: 75,
    height: 120,
    orientation: 'vertical',
    tubeSide: {
      fluidAr: 'محلول اليوريا الصاعد 95%',
      tempIn: '130°C',
      tempOut: '135°C',
      color: '#16a34a',
      inPos: 'axial-bottom',
      outPos: 'axial-top'
    },
    shellSide: {
      fluidAr: 'بخار تسخين LP Steam',
      tempIn: '145°C',
      tempOut: '135°C',
      color: '#ea580c',
      inPos: 'left',
      outPos: 'left'
    }
  });

  const e562Svg = renderShellAndTubeSVG({
    tag: 'E-562',
    nameAr: 'مبخر التركيز 2 (99.7%)',
    temaType: 'Vertical Calandria Evaporator',
    tagColor: '#16a34a',
    x: 2270,
    y: 160,
    width: 75,
    height: 110,
    orientation: 'vertical',
    tubeSide: {
      fluidAr: 'مصهور اليوريا النهائي 99.7%',
      tempIn: '135°C',
      tempOut: '140°C',
      color: '#16a34a',
      inPos: 'axial-bottom',
      outPos: 'axial-top'
    },
    shellSide: {
      fluidAr: 'بخار تسخين MP Steam',
      tempIn: '155°C',
      tempOut: '145°C',
      color: '#ea580c',
      inPos: 'left',
      outPos: 'left'
    }
  });

  return `
    <!-- BLUEPRINT DRAWING 6112P-100-501-00 GRAPHICS (UREA PROCESS FLOW DIAGRAM) -->
    <g id="pfd-urea-500-layers">
      
      <!-- ========================================== -->
      <!-- TITLE BLOCK & OPERATION GUIDE (Top & Bottom) -->
      <!-- ========================================== -->
      <g transform="translate(2440, 840)">
        <rect width="520" height="210" fill="#f8fafc" stroke="#0f172a" stroke-width="1.8" rx="4"/>
        <text x="15" y="24" fill="#0284c7" font-size="13" font-weight="bold" font-family="'Cairo', sans-serif">IRAQ NO. 3 PROJECT</text>
        <text x="15" y="42" fill="#334155" font-size="11" font-family="'Cairo', sans-serif">CUSTOMER: M.O.I. IRAQ - FERTILIZER PROJECT</text>
        <text x="15" y="58" fill="#334155" font-size="11" font-family="'Cairo', sans-serif">KHOR AL-ZUBAIR PHASE-1 (UREA UNIT)</text>
        <text x="15" y="78" fill="#0f172a" font-size="14" font-weight="bold" font-family="'Cairo', sans-serif">UREA PROCESS FLOW DIAGRAM (PFD)</text>
        <text x="15" y="96" fill="#16a34a" font-size="12" font-weight="bold">DWG NO. 6112P 100-501-00</text>
        <line x1="0" y1="108" x2="520" y2="108" stroke="#0f172a" stroke-width="1"/>
        
        <text x="15" y="126" fill="#1e293b" font-size="10.5">ORDER NO: 563030-014</text>
        <text x="15" y="144" fill="#1e293b" font-size="10.5">DATE: 9.25.'75</text>
        <text x="15" y="162" fill="#1e293b" font-size="10.5">CAPACITY: 1,000 MTD PRILLED UREA (42.5 T/H)</text>
        <text x="15" y="180" fill="#1e293b" font-size="10.5">LICENSOR: SNAMPROGETTI / STAMICARBON CO2 STRIPPING PROCESS</text>
        
        <!-- Legend Symbols -->
        <g transform="translate(320, 116)">
          <polygon points="0,6 6,0 12,6 6,12" fill="#16a34a" stroke="#0f172a" stroke-width="1"/>
          <text x="18" y="9" fill="#0f172a" font-size="9.5" font-weight="600">Stream No.</text>
          <circle cx="6" cy="26" r="6" fill="#e0f2fe" stroke="#0284c7" stroke-width="1"/>
          <text x="18" y="29" fill="#0f172a" font-size="9.5" font-weight="600">Press. kg/cm²A</text>
          <rect x="0" y="42" width="14" height="11" rx="2" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
          <text x="18" y="51" fill="#0f172a" font-size="9.5" font-weight="600">Temp. °C</text>
          <rect x="0" y="60" width="14" height="11" fill="#fce7f3" stroke="#db2777" stroke-width="1"/>
          <text x="18" y="69" fill="#0f172a" font-size="9.5" font-weight="600">Urea Content %</text>
        </g>
      </g>

      <!-- Operation Guide Quick Reference Box (Top Right) -->
      <g transform="translate(2620, 30)">
        <rect width="330" height="190" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5" rx="4"/>
        <text x="12" y="20" fill="#b45309" font-size="11" font-weight="bold">OPERATION GUIDE & COMPOSITION (WT %)</text>
        <line x1="0" y1="28" x2="330" y2="28" stroke="#0f172a" stroke-width="1"/>
        <text x="10" y="45" fill="#475569" font-size="9.5" font-weight="bold">STREAM</text>
        <text x="70" y="45" fill="#475569" font-size="9.5" font-weight="bold">NH3</text>
        <text x="115" y="45" fill="#475569" font-size="9.5" font-weight="bold">CO2</text>
        <text x="160" y="45" fill="#475569" font-size="9.5" font-weight="bold">UREA</text>
        <text x="210" y="45" fill="#475569" font-size="9.5" font-weight="bold">H2O</text>
        <text x="260" y="45" fill="#475569" font-size="9.5" font-weight="bold">TEMP °C</text>
        <line x1="0" y1="52" x2="330" y2="52" stroke="#0f172a" stroke-width="0.8"/>
        
        <text x="10" y="68" fill="#0284c7" font-size="9" font-weight="600">REACTOR (11)</text>
        <text x="70" y="68" fill="#0f172a" font-size="9">33.5%</text>
        <text x="115" y="68" fill="#0f172a" font-size="9">13.5%</text>
        <text x="160" y="68" fill="#16a34a" font-size="9" font-weight="bold">32.5%</text>
        <text x="210" y="68" fill="#0f172a" font-size="9">20.5%</text>
        <text x="260" y="68" fill="#d97706" font-size="9" font-weight="bold">190°C</text>

        <text x="10" y="88" fill="#0284c7" font-size="9" font-weight="600">STRIPPER (14)</text>
        <text x="70" y="88" fill="#0f172a" font-size="9">6.5%</text>
        <text x="115" y="88" fill="#0f172a" font-size="9">4.5%</text>
        <text x="160" y="88" fill="#16a34a" font-size="9" font-weight="bold">58.0%</text>
        <text x="210" y="88" fill="#0f172a" font-size="9">31.0%</text>
        <text x="260" y="88" fill="#d97706" font-size="9" font-weight="bold">160°C</text>

        <text x="10" y="108" fill="#0284c7" font-size="9" font-weight="600">MP DECOMP (15)</text>
        <text x="70" y="108" fill="#0f172a" font-size="9">1.5%</text>
        <text x="115" y="108" fill="#0f172a" font-size="9">0.6%</text>
        <text x="160" y="108" fill="#16a34a" font-size="9" font-weight="bold">72.0%</text>
        <text x="210" y="108" fill="#0f172a" font-size="9">25.9%</text>
        <text x="260" y="108" fill="#d97706" font-size="9" font-weight="bold">138°C</text>

        <text x="10" y="128" fill="#0284c7" font-size="9" font-weight="600">LP DECOMP (16)</text>
        <text x="70" y="128" fill="#0f172a" font-size="9">0.3%</text>
        <text x="115" y="128" fill="#0f172a" font-size="9">0.1%</text>
        <text x="160" y="128" fill="#16a34a" font-size="9" font-weight="bold">74.5%</text>
        <text x="210" y="128" fill="#0f172a" font-size="9">25.1%</text>
        <text x="260" y="128" fill="#d97706" font-size="9" font-weight="bold">135°C</text>

        <text x="10" y="148" fill="#0284c7" font-size="9" font-weight="600">VACUUM (18)</text>
        <text x="70" y="148" fill="#0f172a" font-size="9">0.05%</text>
        <text x="115" y="148" fill="#0f172a" font-size="9">-</text>
        <text x="160" y="148" fill="#16a34a" font-size="9" font-weight="bold">99.7%</text>
        <text x="210" y="148" fill="#0f172a" font-size="9">0.25%</text>
        <text x="260" y="148" fill="#d97706" font-size="9" font-weight="bold">140°C</text>

        <text x="10" y="168" fill="#0284c7" font-size="9" font-weight="600">PRILLED UREA</text>
        <text x="70" y="168" fill="#0f172a" font-size="9">-</text>
        <text x="115" y="168" fill="#0f172a" font-size="9">-</text>
        <text x="160" y="168" fill="#16a34a" font-size="9" font-weight="bold">46.4% N</text>
        <text x="210" y="168" fill="#0f172a" font-size="9">0.3% H2O</text>
        <text x="260" y="168" fill="#0f172a" font-size="9">45°C</text>
      </g>

      <!-- ========================================== -->
      <!-- PIPING LAYER -->
      <!-- ========================================== -->
      <g id="pfd-urea-piping">
        
        <!-- --- SECTION 1: CO2 FEED & COMPRESSION PIPING --- -->
        <!-- Stream 1 (CO2 from V-203 Acid Gas Separator) -->
        <path d="M 10 240 L 58 240" fill="none" stroke="#00c8ef" stroke-width="4" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <!-- Stream 2 (Passivation Air from K-302) -->
        <path d="M 10 190 L 45 190 L 45 238" fill="none" stroke="#8b5cf6" stroke-width="2.5" stroke-dasharray="4,2" marker-end="url(#pfdArrowPurple)"/>
        
        <!-- V-509 Bottom drain & Overhead to K-501 1st Stage -->
        <path d="M 95 220 L 95 190 L 160 190 L 160 380 L 260 380 L 260 418" fill="none" stroke="#00c8ef" stroke-width="3.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        
        <!-- K-501 1st Stage Discharge (Stream 4) -> E-511 Cooler -> V-510 Separator -->
        <path d="M 280 420 L 280 150 L 242 150" fill="none" stroke="#f97316" stroke-width="3" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <path d="M 160 150 L 190 150 L 190 218" fill="none" stroke="#00c8ef" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 190 220 L 190 390 L 300 390 L 300 418" fill="none" stroke="#00c8ef" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- K-501 2nd Stage Discharge (Stream 5) -> E-512 Cooler -> V-511 Separator -->
        <path d="M 330 420 L 330 150 L 342 150" fill="none" stroke="#f97316" stroke-width="3" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <path d="M 260 150 L 290 150 L 290 218" fill="none" stroke="#00c8ef" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 290 220 L 290 400 L 360 400 L 360 418" fill="none" stroke="#00c8ef" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- K-501 3rd Stage Discharge (Stream 6) -> E-513 Cooler -> V-512 Separator -->
        <path d="M 390 420 L 390 150 L 438 150" fill="none" stroke="#f97316" stroke-width="3" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <path d="M 360 150 L 390 150 L 390 218" fill="none" stroke="#00c8ef" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 390 220 L 390 410 L 430 410 L 430 418" fill="none" stroke="#00c8ef" stroke-width="3" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- K-501 4th Stage High Pressure Delivery (Stream 7: 145 kg/cm2A) -> V-514 Delivery Drum -->
        <path d="M 450 420 L 450 320 L 458 320" fill="none" stroke="#ef4444" stroke-width="3.5" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>
        <!-- Ex V-514 Delivery Drum to Stripper E-501 Bottom (Stream 7) -->
        <path d="M 495 220 L 495 180 L 530 180 L 530 520 L 1080 520 L 1080 482" fill="none" stroke="#ef4444" stroke-width="3.5" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>

        <!-- Bypass line through E-516 -->
        <path d="M 280 320 L 160 320 L 160 292" fill="none" stroke="#64748b" stroke-width="1.8" stroke-dasharray="3,3" marker-end="url(#pfdArrowSlate)"/>

        <!-- --- SECTION 2: SYNTHESIS & CARBAMATE REACTION LOOP (HP LOOP) --- -->
        <!-- Stream 8 (Make-up Liquid Ammonia from Storage / P-401) to P-501 A/B/C Feed Pumps -->
        <path d="M 10 510 L 938 510" fill="none" stroke="#00c8ef" stroke-width="3.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <!-- Ammonia Jacket Heater E-520 to P-501 -->
        <path d="M 680 510 L 680 530 L 740 530 L 740 512" fill="none" stroke="#00c8ef" stroke-width="2" marker-end="url(#pfdArrowCyan)"/>

        <!-- Stream 9 (HP Ammonia 200 kg/cm2A ex P-501) to Carbamate Ejector J-501 Motive Inlet -->
        <path d="M 1000 480 L 1000 450 L 640 450 L 640 470 L 612 470" fill="none" stroke="#00c8ef" stroke-width="3.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        
        <!-- Ex J-501 Ejector Discharge (Stream 10: NH3 + Carbamate) -> R-501 Reactor Bottom -->
        <path d="M 580 485 L 560 485 L 560 440 L 618 440" fill="none" stroke="#10b981" stroke-width="4" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- Stream 11 (Urea Reactor R-501 Effluent Overflow) -> Stripper E-501 Top -->
        <path d="M 700 130 L 1040 130 L 1040 178" fill="none" stroke="#10b981" stroke-width="4" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- Stream 12 (Reactor Top Off-gas) -> Carbamate Separator V-501 -->
        <path d="M 660 80 L 660 60 L 770 60 L 770 118" fill="none" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#pfdArrowYellow)" class="${isAnim}"/>

        <!-- Stream 13 (Stripper E-501 Overhead Mixed Gases: NH3, CO2, H2O) -> Carbamate Condensers E-504 & E-505 -->
        <path d="M 1080 180 L 1080 110 L 970 110 L 970 158" fill="none" stroke="#f97316" stroke-width="4" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <path d="M 970 110 L 970 290 L 932 290" fill="none" stroke="#f97316" stroke-width="3.5" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>

        <!-- Condensers Effluent & Recycle back to Carbamate Separator V-501 / Ejector J-501 / R-501 -->
        <path d="M 840 180 L 775 180 L 775 250" fill="none" stroke="#10b981" stroke-width="3.5" class="${isAnim}"/>
        <path d="M 840 320 L 775 320 L 775 250" fill="none" stroke="#10b981" stroke-width="3.5" class="${isAnim}"/>
        <path d="M 775 250 L 775 420 L 595 420 L 595 468" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- 26 ata Steam to Stripper Shell E-501 & Condensate to Drum V-516 -->
        <path d="M 1010 240 L 1038 240" fill="none" stroke="#ef4444" stroke-width="2.5" marker-end="url(#pfdArrowRed)"/>
        <path d="M 1120 440 L 1150 440 L 1150 478" fill="none" stroke="#00c8ef" stroke-width="2" marker-end="url(#pfdArrowCyan)"/>

        <!-- --- SECTION 3: MEDIUM PRESSURE DECOMPOSITION & RECOVERY --- -->
        <!-- Stream 14 (Stripper Bottom Urea Solution 58% Urea) -> MP Separator V-502 & Decomposer E-502 -->
        <path d="M 1080 480 L 1080 500 L 1140 500 L 1140 190 L 1178 190" fill="none" stroke="#10b981" stroke-width="4" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- V-502 Liquid -> E-502 Decomposer -> V-503 Solution Holder -->
        <path d="M 1210 280 L 1210 298" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <path d="M 1210 420 L 1210 438" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- V-502 Overhead Gases -> MP Condenser E-506 -> MP Absorber T-501 -->
        <path d="M 1210 130 L 1210 90 L 1340 90 L 1340 128" fill="none" stroke="#f97316" stroke-width="3" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <path d="M 1340 240 L 1340 280 L 1398 280" fill="none" stroke="#10b981" stroke-width="3" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- T-501 Bottom Carbamate Solution -> P-502 A/B/C HP Carbamate Pumps (Stream 20) -->
        <path d="M 1430 340 L 1430 460 L 1300 460 L 1300 478" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <!-- P-502 Discharge back to High Pressure Loop J-501 / E-505 -->
        <path d="M 1240 510 L 890 510 L 890 382" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- T-501 Overhead Ammonia Vapor -> Condenser E-508 & Tower T-503 -->
        <path d="M 1430 120 L 1430 70 L 1340 70 L 1340 258" fill="none" stroke="#00c8ef" stroke-width="2.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <path d="M 1430 70 L 1510 70 L 1510 118" fill="none" stroke="#00c8ef" stroke-width="2.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <!-- Liquid Ammonia from E-508 to Booster Pump P-512 -->
        <path d="M 1340 360 L 1340 390 L 1380 390 L 1380 418" fill="none" stroke="#00c8ef" stroke-width="2.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>

        <!-- --- SECTION 4: LOW PRESSURE DECOMPOSITION & CARBONATE RECOVERY --- -->
        <!-- Stream 15 (ex V-503 Holder) -> LP Separator V-504 & Decomposer E-503 -->
        <path d="M 1255 480 L 1560 480 L 1560 190 L 1598 190" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- V-504 Liquid -> E-503 LP Decomposer -> V-505 Solution Holder (Stream 16: 75% Urea) -->
        <path d="M 1630 280 L 1630 298" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <path d="M 1630 420 L 1630 438" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- V-504 Overhead Gases -> LP Condenser E-507 -> Carbonate Tank V-507 -->
        <path d="M 1630 130 L 1630 90 L 1760 90 L 1760 128" fill="none" stroke="#f97316" stroke-width="2.5" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <path d="M 1760 240 L 1760 258" fill="none" stroke="#10b981" stroke-width="3" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- V-507 Bottom Liquid -> P-503 A/B Carbonate Pumps -> T-501 MP Absorber Top (Stream 21) -->
        <path d="M 1780 360 L 1780 478" fill="none" stroke="#10b981" stroke-width="3" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <path d="M 1730 510 L 1460 510 L 1460 160 L 1442 160" fill="none" stroke="#10b981" stroke-width="3" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- --- SECTION 5: WASTE WATER TREATMENT & HYDROLYZER SYSTEM --- -->
        <!-- Waste Water Feed ex Vacuum System -> Preheaters E-509 / E-522 -> Stripping Tower T-502 -->
        <path d="M 2150 490 L 1950 490 L 1950 360 L 1943 360" fill="none" stroke="#00c8ef" stroke-width="2.5" marker-end="url(#pfdArrowCyan)" class="${isAnim}"/>
        <!-- T-502 Overhead Vapor (Recovered NH3/CO2) -> LP Condenser E-507 -->
        <path d="M 1910 120 L 1910 60 L 1800 60 L 1800 128" fill="none" stroke="#f97316" stroke-width="2.5" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <!-- T-502 Bottom Effluent -> Hydrolyzer Feed Pumps -> Hydrolyzer E-521 (Stream 22: 28 ata steam) -->
        <path d="M 1910 400 L 1910 440 L 2020 440 L 2020 352" fill="none" stroke="#f97316" stroke-width="3" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <path d="M 2055 130 L 2055 90 L 1930 90 L 1930 118" fill="none" stroke="#f97316" stroke-width="2.5" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <!-- Purified Waste Water to Pond (Stream 23) -->
        <path d="M 1910 420 L 1910 540 L 2078 540" fill="none" stroke="#10b981" stroke-width="2.5" marker-end="url(#pfdArrowGreen)"/>

        <!-- --- SECTION 6: VACUUM CONCENTRATION & EVAPORATION --- -->
        <!-- Stream 16 ex V-505 (75% Solution) -> No.1 Concentrator E-561 -> V-561 Separator -->
        <path d="M 1675 480 L 2160 480 L 2160 262" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <path d="M 2200 130 L 2200 112" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- Stream 17 ex V-561 (95% Solution) -> No.2 Concentrator E-562 -> V-562 Separator -->
        <path d="M 2235 90 L 2270 90 L 2270 278" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <path d="M 2310 160 L 2310 142" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- Stream 18 ex V-562 (99.7% Molten Urea Melt) -> V-564 Melt Holder -> P-561 A/B Pumps -->
        <path d="M 2310 110 L 2310 298" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <path d="M 2310 370 L 2310 478" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <!-- P-561 Discharge (Melt 138°C) to Prilling Tower Top Spray T-571 -->
        <path d="M 2370 510 L 2410 510 L 2410 70 L 2458 70" fill="none" stroke="#10b981" stroke-width="4" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- Vacuum System Overhead Vapors from V-561 / V-562 to Ejectors J-563 / J-564 & Condensers -->
        <path d="M 2200 80 L 2200 40 L 2228 40" fill="none" stroke="#0284c7" stroke-width="2" marker-end="url(#pfdArrowBlue)"/>
        <path d="M 2310 80 L 2310 40 L 2328 40" fill="none" stroke="#0284c7" stroke-width="2" marker-end="url(#pfdArrowBlue)"/>

        <!-- --- SECTION 7: PRILLING TOWER & FINISHING CONVEYORS --- -->
        <!-- Urea solid prills falling inside T-571 to Scraper M-571 -->
        <g stroke="#10b981" stroke-width="1.2" stroke-dasharray="2,4" opacity="0.7">
          <line x1="2460" y1="120" x2="2460" y2="460"/>
          <line x1="2480" y1="120" x2="2480" y2="460"/>
          <line x1="2505" y1="120" x2="2505" y2="460"/>
          <line x1="2530" y1="120" x2="2530" y2="460"/>
          <line x1="2550" y1="120" x2="2550" y2="460"/>
        </g>

        <!-- Conveyor C-571 -> Screener F-571 -> Belt C-573 -> Weigher W-571 (Stream 19: 42.35 t/h) -->
        <path d="M 2555 500 L 2678 500" fill="none" stroke="#10b981" stroke-width="3.5" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <path d="M 2750 485 L 2760 485 L 2760 500 L 2878 500" fill="none" stroke="#10b981" stroke-width="4" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>
        <path d="M 2940 500 L 3018 500" fill="none" stroke="#10b981" stroke-width="4" marker-end="url(#pfdArrowGreen)" class="${isAnim}"/>

        <!-- Recycle Belt C-572 (Oversize / Undersize to Dissolving Tank V-571) -->
        <path d="M 2715 520 L 2715 560 L 2850 560 L 2850 540" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,2"/>
        <path d="M 2850 540 L 2850 420 L 2878 420" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,2" marker-end="url(#pfdArrowYellow)"/>

        <!-- Ambient Cooling Air Flow into bottom of Prilling Tower and up to top -->
        <path d="M 2420 460 L 2438 460" fill="none" stroke="#00c8ef" stroke-width="2.5" marker-end="url(#pfdArrowCyan)"/>
        <path d="M 2590 460 L 2572 460" fill="none" stroke="#00c8ef" stroke-width="2.5" marker-end="url(#pfdArrowCyan)"/>
      </g>

      <!-- ========================================== -->
      <!-- DCS CONTROLLER LOOPS & INSTRUMENTATION -->
      <!-- ========================================== -->
      <g id="pfd-urea-dcs-controls">
        <!-- TRC-501 (Reactor Top Temp 190°C) -->
        <g class="pfd-ctrl-badge" data-ctrl="TRC-501" transform="translate(640, 30)" cursor="pointer">
          <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#ef4444" stroke-width="1.8"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#ef4444" stroke-width="1"/>
          <text x="0" y="-4" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">TRC</text>
          <text x="0" y="9" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">501</text>
        </g>
        <line x1="640" y1="45" x2="660" y2="80" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="3,2"/>

        <!-- PRC-501 (Reactor Top Pressure 150 kg/cm²A) -->
        <g class="pfd-ctrl-badge" data-ctrl="PRC-501" transform="translate(710, 30)" cursor="pointer">
          <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#0284c7" stroke-width="1.8"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#0284c7" stroke-width="1"/>
          <text x="0" y="-4" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">PRC</text>
          <text x="0" y="9" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">501</text>
        </g>
        <line x1="710" y1="45" x2="680" y2="80" stroke="#0284c7" stroke-width="1.2" stroke-dasharray="3,2"/>

        <!-- TRC-502 (Stripper Bottom Temp 160°C) -->
        <g class="pfd-ctrl-badge" data-ctrl="TRC-502" transform="translate(1020, 520)" cursor="pointer">
          <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#f97316" stroke-width="1.8"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#f97316" stroke-width="1"/>
          <text x="0" y="-4" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">TRC</text>
          <text x="0" y="9" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">502</text>
        </g>
        <line x1="1035" y1="520" x2="1080" y2="480" stroke="#f97316" stroke-width="1.2" stroke-dasharray="3,2"/>
      </g>

      <!-- ========================================== -->
      <!-- EQUIPMENT LAYER (Vessels, Reactors, Compressors) -->
      <!-- ========================================== -->
      <g id="pfd-urea-equipment">
        
        <!-- K-501T: CO2 COMPRESSOR TURBINE -->
        <g class="pfd-eq-item cursor-pointer" data-tag="K-501T" transform="translate(100, 420)">
          <polygon points="0,20 100,0 100,90 0,70" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <circle cx="50" cy="45" r="18" fill="#f8fafc" stroke="#dc2626" stroke-width="1.8"/>
          <path d="M 40 45 L 60 45 M 50 35 L 50 55" stroke="#dc2626" stroke-width="1.5"/>
          <g transform="translate(0, -45)">
            <rect x="0" y="0" width="100" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="50" y="16" fill="#dc2626" font-size="12.5" font-weight="900" text-anchor="middle">K-501T</text>
            <text x="50" y="30" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">توربين ضاغط CO2</text>
          </g>
        </g>

        <!-- K-501: CO2 COMPRESSOR (4 STAGES) -->
        <g class="pfd-eq-item cursor-pointer" data-tag="K-501" transform="translate(240, 420)">
          <!-- Compressor housing with 4 stages -->
          <rect x="0" y="10" width="220" height="70" rx="6" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <!-- Stage partitions -->
          <line x1="55" y1="10" x2="55" y2="80" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="3,2"/>
          <line x1="110" y1="10" x2="110" y2="80" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="3,2"/>
          <line x1="165" y1="10" x2="165" y2="80" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="3,2"/>
          
          <text x="27" y="50" fill="#0284c7" font-size="11" font-weight="bold" text-anchor="middle">1ST</text>
          <text x="82" y="50" fill="#0284c7" font-size="11" font-weight="bold" text-anchor="middle">2ND</text>
          <text x="137" y="50" fill="#0284c7" font-size="11" font-weight="bold" text-anchor="middle">3RD</text>
          <text x="192" y="50" fill="#0284c7" font-size="11" font-weight="bold" text-anchor="middle">4TH</text>
          
          <g transform="translate(50, -45)">
            <rect x="0" y="0" width="120" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="60" y="16" fill="#0284c7" font-size="13" font-weight="900" text-anchor="middle">K-501</text>
            <text x="60" y="30" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">ضاغط CO2 (4 مراحل)</text>
          </g>
        </g>

        <!-- V-509: SUCTION K.O. DRUM -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-509" transform="translate(60, 220)">
          <rect x="0" y="15" width="70" height="120" rx="20" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <ellipse cx="35" cy="15" rx="35" ry="15" fill="#e0f2fe" stroke="#0f172a" stroke-width="1.8"/>
          <ellipse cx="35" cy="135" rx="35" ry="15" fill="#e0f2fe" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-15, -42)">
            <rect x="0" y="0" width="100" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="50" y="15" fill="#0284c7" font-size="12.5" font-weight="bold" text-anchor="middle">V-509</text>
            <text x="50" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">عازل سحب CO2</text>
          </g>
        </g>

        <!-- E-511: 1ST STAGE CO2 COOLER -->
        ${e511Svg}

        <!-- V-510: 1ST STAGE SEPARATOR -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-510" transform="translate(160, 220)">
          <rect x="5" y="10" width="55" height="110" rx="15" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-15, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">V-510</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل مرحلة 1</text>
          </g>
        </g>

        <!-- E-512: 2ND STAGE COOLER -->
        ${e512Svg}

        <!-- V-511: 2ND STAGE SEPARATOR -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-511" transform="translate(260, 220)">
          <rect x="5" y="10" width="55" height="110" rx="15" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-15, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">V-511</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل مرحلة 2</text>
          </g>
        </g>

        <!-- E-513: 3RD STAGE COOLER -->
        ${e513Svg}

        <!-- V-512: 3RD STAGE SEPARATOR -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-512" transform="translate(360, 220)">
          <rect x="5" y="10" width="55" height="110" rx="15" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-15, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">V-512</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل مرحلة 3</text>
          </g>
        </g>

        <!-- V-514: DELIVERY DRUM -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-514" transform="translate(460, 220)">
          <rect x="5" y="10" width="60" height="120" rx="18" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-20, -42)">
            <rect x="0" y="0" width="105" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="52" y="15" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">V-514</text>
            <text x="52" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مجمع ضخ CO2</text>
          </g>
        </g>

        <!-- R-501: UREA REACTOR (TALL VERTICAL HIGH PRESSURE VESSEL) -->
        <g class="pfd-eq-item cursor-pointer" data-tag="R-501" transform="translate(620, 80)">
          <!-- Outer vessel shell -->
          <rect x="0" y="25" width="80" height="330" rx="25" fill="url(#pfdBedGrad)" stroke="#0f172a" stroke-width="2.5"/>
          <ellipse cx="40" cy="25" rx="40" ry="18" fill="#dcfce7" stroke="#0f172a" stroke-width="2.5"/>
          <ellipse cx="40" cy="355" rx="40" ry="18" fill="#dcfce7" stroke="#0f172a" stroke-width="2.5"/>
          
          <!-- Sieve trays / reaction compartments -->
          <line x1="8" y1="90" x2="72" y2="90" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="4,2"/>
          <line x1="8" y1="145" x2="72" y2="145" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="4,2"/>
          <line x1="8" y1="200" x2="72" y2="200" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="4,2"/>
          <line x1="8" y1="255" x2="72" y2="255" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="4,2"/>
          <line x1="8" y1="310" x2="72" y2="310" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="4,2"/>

          <!-- High-Clarity Plaque -->
          <g transform="translate(-25, -48)">
            <rect x="0" y="0" width="130" height="42" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
            <text x="65" y="17" fill="#16a34a" font-size="14" font-weight="900" text-anchor="middle">R-501</text>
            <text x="65" y="32" fill="#0f172a" font-size="10.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مفاعل اليوريا (155 bar)</text>
          </g>
          
          <text x="40" y="195" fill="#0f172a" font-size="9" font-weight="bold" text-anchor="middle">UREA REACTOR</text>
          <text x="40" y="210" fill="#334155" font-size="8.5" font-weight="600" text-anchor="middle">142 kg/cm²A</text>
          <text x="40" y="224" fill="#d97706" font-size="8.5" font-weight="bold" text-anchor="middle">190 °C</text>
        </g>

        <!-- V-501: CARBAMATE SEPARATOR -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-501" transform="translate(740, 120)">
          <rect x="5" y="10" width="55" height="100" rx="15" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-20, -42)">
            <rect x="0" y="0" width="105" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="52" y="15" fill="#16a34a" font-size="12" font-weight="bold" text-anchor="middle">V-501</text>
            <text x="52" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل الكاربامات</text>
          </g>
        </g>

        <!-- E-504: 1ST CARBAMATE CONDENSER -->
        ${e504Svg}

        <!-- E-505: 2ND CARBAMATE CONDENSER -->
        ${e505Svg}

        <!-- J-501: CARBAMATE RECYCLE EJECTOR -->
        <g class="pfd-eq-item cursor-pointer" data-tag="J-501" transform="translate(580, 465)">
          <polygon points="0,5 30,15 30,25 0,35" fill="#0284c7" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="30,15 50,5 50,35 30,25" fill="#0284c7" stroke="#0f172a" stroke-width="1.5"/>
          <g transform="translate(-20, -42)">
            <rect x="0" y="0" width="90" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="45" y="15" fill="#0284c7" font-size="11.5" font-weight="bold" text-anchor="middle">J-501</text>
            <text x="45" y="28" fill="#0f172a" font-size="8.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">قاذف الكاربامات</text>
          </g>
        </g>

        <!-- E-501: STRIPPER (FALLING FILM STRIPPER) -->
        ${e501Svg}

        <!-- P-501 A/B/C: AMMONIA REACTOR FEED PUMPS -->
        <g class="pfd-eq-item cursor-pointer" data-tag="P-501A/B/C" transform="translate(940, 480)">
          <circle cx="30" cy="25" r="22" fill="#f8fafc" stroke="#0284c7" stroke-width="2"/>
          <polygon points="12,25 38,10 38,40" fill="#0284c7"/>
          <circle cx="85" cy="25" r="22" fill="#f8fafc" stroke="#0284c7" stroke-width="2"/>
          <polygon points="67,25 93,10 93,40" fill="#0284c7"/>
          <g transform="translate(0, -45)">
            <rect x="0" y="0" width="120" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="60" y="16" fill="#0284c7" font-size="12" font-weight="900" text-anchor="middle">P-501 A/B/C</text>
            <text x="60" y="30" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مضخات تغذية NH3 (200 bar)</text>
          </g>
        </g>

        <!-- V-502 & E-502: MP SEPARATOR & MP DECOMPOSER -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-502" transform="translate(1180, 130)">
          <rect x="5" y="10" width="55" height="130" rx="15" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-20, -42)">
            <rect x="0" y="0" width="105" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="52" y="15" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">V-502</text>
            <text x="52" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل الضغط المتوسط</text>
          </g>
        </g>

        ${e502Svg}

        <g class="pfd-eq-item cursor-pointer" data-tag="V-503" transform="translate(1175, 435)">
          <rect x="0" y="0" width="70" height="50" rx="8" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-15, -38)">
            <rect x="0" y="0" width="100" height="32" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.4"/>
            <text x="50" y="14" fill="#0284c7" font-size="11" font-weight="bold" text-anchor="middle">V-503</text>
            <text x="50" y="25" fill="#0f172a" font-size="8" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">خزان المحلول MP</text>
          </g>
        </g>

        <!-- E-506 & T-501 & T-503: MP CONDENSER & ABSORBER -->
        ${e506Svg}

        <g class="pfd-eq-item cursor-pointer" data-tag="T-501" transform="translate(1400, 120)">
          <rect x="0" y="15" width="60" height="190" rx="15" fill="url(#pfdBedGrad)" stroke="#0f172a" stroke-width="2"/>
          <line x1="10" y1="70" x2="50" y2="70" stroke="#0f172a" stroke-width="1.2" stroke-dasharray="3,2"/>
          <line x1="10" y1="130" x2="50" y2="130" stroke="#0f172a" stroke-width="1.2" stroke-dasharray="3,2"/>
          <g transform="translate(-25, -45)">
            <rect x="0" y="0" width="110" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="55" y="16" fill="#0284c7" font-size="13" font-weight="900" text-anchor="middle">T-501</text>
            <text x="55" y="30" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">برج امتصاص MP</text>
          </g>
        </g>

        <g class="pfd-eq-item cursor-pointer" data-tag="T-503" transform="translate(1480, 120)">
          <rect x="0" y="15" width="55" height="170" rx="12" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-25, -45)">
            <rect x="0" y="0" width="105" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="52" y="16" fill="#0284c7" font-size="12" font-weight="900" text-anchor="middle">T-503</text>
            <text x="52" y="30" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">برج استرجاع NH3</text>
          </g>
        </g>

        <!-- P-502 A/B/C: CARBAMATE HP PUMPS -->
        <g class="pfd-eq-item cursor-pointer" data-tag="P-502A/B/C" transform="translate(1240, 480)">
          <circle cx="30" cy="25" r="22" fill="#f8fafc" stroke="#16a34a" stroke-width="2"/>
          <polygon points="12,25 38,10 38,40" fill="#16a34a"/>
          <circle cx="85" cy="25" r="22" fill="#f8fafc" stroke="#16a34a" stroke-width="2"/>
          <polygon points="67,25 93,10 93,40" fill="#16a34a"/>
          <g transform="translate(0, -45)">
            <rect x="0" y="0" width="120" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="60" y="16" fill="#16a34a" font-size="12" font-weight="900" text-anchor="middle">P-502 A/B/C</text>
            <text x="60" y="30" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مضخات كاربامات (150 bar)</text>
          </g>
        </g>

        <!-- V-504 & E-503 & V-505: LP SECTION -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-504" transform="translate(1600, 130)">
          <rect x="5" y="10" width="55" height="130" rx="15" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-20, -42)">
            <rect x="0" y="0" width="105" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="52" y="15" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">V-504</text>
            <text x="52" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل الضغط المنخفض</text>
          </g>
        </g>

        ${e503Svg}

        <g class="pfd-eq-item cursor-pointer" data-tag="V-505" transform="translate(1600, 435)">
          <rect x="0" y="0" width="65" height="50" rx="8" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-20, -38)">
            <rect x="0" y="0" width="110" height="32" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.4"/>
            <text x="55" y="14" fill="#0284c7" font-size="11" font-weight="bold" text-anchor="middle">V-505 (75%)</text>
            <text x="55" y="25" fill="#0f172a" font-size="8" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">خزان اليوريا 75%</text>
          </g>
        </g>

        <!-- E-507 & V-507: LP CONDENSER & CARBONATE TANK -->
        ${e507Svg}

        <g class="pfd-eq-item cursor-pointer" data-tag="V-507" transform="translate(1720, 260)">
          <rect x="0" y="0" width="110" height="90" rx="12" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(5, -45)">
            <rect x="0" y="0" width="105" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="52" y="16" fill="#0284c7" font-size="12.5" font-weight="900" text-anchor="middle">V-507</text>
            <text x="52" y="30" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">خزان الكاربونات</text>
          </g>
        </g>

        <!-- P-503 A/B: MP CARBONATE PUMPS -->
        <g class="pfd-eq-item cursor-pointer" data-tag="P-503A/B" transform="translate(1730, 480)">
          <circle cx="30" cy="25" r="20" fill="#f8fafc" stroke="#0284c7" stroke-width="1.8"/>
          <polygon points="14,25 36,12 36,38" fill="#0284c7"/>
          <circle cx="75" cy="25" r="20" fill="#f8fafc" stroke="#0284c7" stroke-width="1.8"/>
          <polygon points="59,25 81,12 81,38" fill="#0284c7"/>
          <g transform="translate(-5, -45)">
            <rect x="0" y="0" width="115" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="57" y="16" fill="#0284c7" font-size="12" font-weight="900" text-anchor="middle">P-503 A/B</text>
            <text x="57" y="30" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مضخات الكاربونات MP</text>
          </g>
        </g>

        <!-- T-502 & E-521: STRIPPING TOWER & HYDROLYZER -->
        <g class="pfd-eq-item cursor-pointer" data-tag="T-502" transform="translate(1880, 120)">
          <rect x="0" y="15" width="60" height="250" rx="15" fill="url(#pfdBedGrad)" stroke="#0f172a" stroke-width="2"/>
          <line x1="10" y1="80" x2="50" y2="80" stroke="#0f172a" stroke-width="1.2" stroke-dasharray="3,2"/>
          <line x1="10" y1="160" x2="50" y2="160" stroke="#0f172a" stroke-width="1.2" stroke-dasharray="3,2"/>
          <g transform="translate(-25, -45)">
            <rect x="0" y="0" width="110" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="55" y="16" fill="#0284c7" font-size="13" font-weight="900" text-anchor="middle">T-502</text>
            <text x="55" y="30" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">برج تجريد المياه</text>
          </g>
        </g>

        ${e521Svg}

        <!-- E-561 & V-561: 1ST CONCENTRATOR & VACUUM SEPARATOR -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-561" transform="translate(2160, 80)">
          <ellipse cx="37" cy="25" rx="37" ry="18" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-10, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#16a34a" font-size="12" font-weight="bold" text-anchor="middle">V-561</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل فراغي 1</text>
          </g>
        </g>

        ${e561Svg}

        <!-- E-562 & V-562 & V-564: 2ND CONCENTRATOR & MELT HOLDER -->
        <g class="pfd-eq-item cursor-pointer" data-tag="V-562" transform="translate(2270, 110)">
          <ellipse cx="37" cy="20" rx="37" ry="15" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-10, -42)">
            <rect x="0" y="0" width="95" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="47" y="15" fill="#16a34a" font-size="12" font-weight="bold" text-anchor="middle">V-562</text>
            <text x="47" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">فاصل فراغي 2</text>
          </g>
        </g>

        ${e562Svg}

        <g class="pfd-eq-item cursor-pointer" data-tag="V-564" transform="translate(2270, 300)">
          <rect x="0" y="0" width="75" height="60" rx="8" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-15, -40)">
            <rect x="0" y="0" width="105" height="34" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="52" y="15" fill="#16a34a" font-size="12" font-weight="bold" text-anchor="middle">V-564</text>
            <text x="52" y="27" fill="#0f172a" font-size="8.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مستودع مصهور اليوريا</text>
          </g>
        </g>

        <!-- P-561 A/B: PRILLING TOWER FEED PUMPS -->
        <g class="pfd-eq-item cursor-pointer" data-tag="P-561A/B" transform="translate(2270, 480)">
          <circle cx="30" cy="25" r="20" fill="#f8fafc" stroke="#16a34a" stroke-width="1.8"/>
          <polygon points="14,25 36,12 36,38" fill="#16a34a"/>
          <circle cx="75" cy="25" r="20" fill="#f8fafc" stroke="#16a34a" stroke-width="1.8"/>
          <polygon points="59,25 81,12 81,38" fill="#16a34a"/>
          <g transform="translate(-5, -45)">
            <rect x="0" y="0" width="115" height="38" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
            <text x="57" y="16" fill="#16a34a" font-size="12" font-weight="900" text-anchor="middle">P-561 A/B</text>
            <text x="57" y="30" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">مضخات المصهور للبرج</text>
          </g>
        </g>

        <!-- T-571: PRILLING TOWER (TALL CONCRETE TOWER) -->
        <g class="pfd-eq-item cursor-pointer" data-tag="T-571" transform="translate(2440, 60)">
          <!-- Concrete tower silhouette -->
          <polygon points="15,0 115,0 130,420 0,420" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2.5"/>
          
          <!-- Tower Top Spray Header & Louvers -->
          <rect x="25" y="10" width="80" height="25" fill="#dcfce7" stroke="#0f172a" stroke-width="1.5"/>
          <text x="65" y="27" fill="#16a34a" font-size="9" font-weight="bold" text-anchor="middle">ROTARY SPRAY</text>

          <!-- High-Clarity Plaque for Tower -->
          <g transform="translate(-10, 150)">
            <rect x="0" y="0" width="150" height="46" rx="6" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
            <text x="75" y="18" fill="#16a34a" font-size="15" font-weight="900" text-anchor="middle">T-571</text>
            <text x="75" y="35" fill="#0f172a" font-size="11" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">برج التحبيب (ارتفاع 85م)</text>
          </g>

          <!-- Middle Details -->
          <text x="65" y="225" fill="#0f172a" font-size="10" font-weight="bold" text-anchor="middle">PRILLING TOWER</text>
          <text x="65" y="242" fill="#334155" font-size="9" font-weight="600" text-anchor="middle">Height: ~85 m</text>
          <text x="65" y="258" fill="#d97706" font-size="9" font-weight="bold" text-anchor="middle">Cooling: Air Draft</text>
          <text x="65" y="274" fill="#16a34a" font-size="9" font-weight="bold" text-anchor="middle">Melt -> Prills 45°C</text>

          <!-- Bottom Air Intake Louvers -->
          <line x1="5" y1="390" x2="30" y2="390" stroke="#0284c7" stroke-width="2"/>
          <line x1="5" y1="400" x2="30" y2="400" stroke="#0284c7" stroke-width="2"/>
          <line x1="100" y1="390" x2="125" y2="390" stroke="#0284c7" stroke-width="2"/>
          <line x1="100" y1="400" x2="125" y2="400" stroke="#0284c7" stroke-width="2"/>
        </g>

        <!-- M-571: ROTARY SCRAPER -->
        <g class="pfd-eq-item cursor-pointer" data-tag="M-571" transform="translate(2455, 485)">
          <rect x="0" y="0" width="100" height="30" rx="4" fill="#f8fafc" stroke="#0f172a" stroke-width="1.8"/>
          <circle cx="50" cy="15" r="10" fill="#16a34a"/>
          <g transform="translate(-5, -38)">
            <rect x="0" y="0" width="110" height="32" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.4"/>
            <text x="55" y="14" fill="#16a34a" font-size="11" font-weight="bold" text-anchor="middle">M-571</text>
            <text x="55" y="25" fill="#0f172a" font-size="8" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">كاشطة قاع البرج</text>
          </g>
        </g>

        <!-- C-571: BELT CONVEYOR -->
        <g class="pfd-eq-item cursor-pointer" data-tag="C-571" transform="translate(2570, 490)">
          <line x1="0" y1="12" x2="100" y2="12" stroke="#0f172a" stroke-width="4"/>
          <circle cx="10" cy="12" r="8" fill="#16a34a" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="90" cy="12" r="8" fill="#16a34a" stroke="#0f172a" stroke-width="1.5"/>
          <g transform="translate(-5, -38)">
            <rect x="0" y="0" width="110" height="32" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.4"/>
            <text x="55" y="14" fill="#16a34a" font-size="11" font-weight="bold" text-anchor="middle">C-571</text>
            <text x="55" y="25" fill="#0f172a" font-size="8" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">سير ناقل قاع البرج</text>
          </g>
        </g>

        <!-- F-571: SCREENER -->
        <g class="pfd-eq-item cursor-pointer" data-tag="F-571" transform="translate(2680, 450)">
          <polygon points="0,0 70,0 55,60 15,60" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <line x1="10" y1="25" x2="60" y2="25" stroke="#d97706" stroke-width="1.5" stroke-dasharray="2,2"/>
          <g transform="translate(-15, -42)">
            <rect x="0" y="0" width="100" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="50" y="15" fill="#16a34a" font-size="12" font-weight="bold" text-anchor="middle">F-571</text>
            <text x="50" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">غربال حبات اليوريا</text>
          </g>
        </g>

        <!-- C-573: PRODUCT BELT CONVEYOR -->
        <g class="pfd-eq-item cursor-pointer" data-tag="C-573" transform="translate(2760, 490)">
          <line x1="0" y1="12" x2="110" y2="12" stroke="#0f172a" stroke-width="4"/>
          <circle cx="10" cy="12" r="8" fill="#16a34a" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="100" cy="12" r="8" fill="#16a34a" stroke="#0f172a" stroke-width="1.5"/>
          <g transform="translate(0, -38)">
            <rect x="0" y="0" width="110" height="32" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.4"/>
            <text x="55" y="14" fill="#16a34a" font-size="11" font-weight="bold" text-anchor="middle">C-573</text>
            <text x="55" y="25" fill="#0f172a" font-size="8" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">سير المنتج النهائي</text>
          </g>
        </g>

        <!-- W-571: WEIGHING MACHINE -->
        <g class="pfd-eq-item cursor-pointer" data-tag="W-571" transform="translate(2880, 470)">
          <rect x="0" y="0" width="60" height="45" rx="4" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
          <g transform="translate(-20, -42)">
            <rect x="0" y="0" width="100" height="36" rx="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <text x="50" y="15" fill="#16a34a" font-size="12" font-weight="bold" text-anchor="middle">W-571</text>
            <text x="50" y="28" fill="#0f172a" font-size="9" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">ميزان الإنتاج الكلي</text>
          </g>
        </g>

        <!-- FINAL PRODUCT DELIVERY ARROWS (To Train 1 & Train 2) -->
        <g transform="translate(2950, 480)">
          <path d="M 20 20 L 70 20" fill="none" stroke="#10b981" stroke-width="4"/>
          <polygon points="70,12 85,20 70,28" fill="#10b981"/>
          <text x="90" y="16" fill="#10b981" font-size="11" font-weight="bold">UREA PRODUCT</text>
          <text x="90" y="30" fill="#94a3b8" font-size="9">TO QU-C-601A / 601B</text>
        </g>

        <!-- N-571: DUST SCRUBBER -->
        <g class="pfd-eq-item cursor-pointer" data-tag="N-571" transform="translate(2900, 350)">
          <rect x="0" y="10" width="65" height="80" rx="10" fill="url(#pfdSteelGrad)" stroke="#38bdf8" stroke-width="1.8"/>
          <text x="32" y="45" fill="#f8fafc" font-size="9" font-weight="bold" text-anchor="middle">N-571</text>
          <text x="32" y="60" fill="#94a3b8" font-size="7.5" text-anchor="middle">SCRUBBER</text>
        </g>
      </g>

      <!-- ========================================== -->
      <!-- STREAM FLAGS & FLOW TAGS -->
      <!-- ========================================== -->
      <g id="pfd-urea-stream-tags">
        <!-- Stream 1 (CO2 Feed) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="1" transform="translate(25, 230)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#38bdf8" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">1</text>
        </g>

        <!-- Stream 2 (Passivation Air) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="2" transform="translate(25, 180)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#a78bfa" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">2</text>
        </g>

        <!-- Stream 7 (CO2 145 bar Delivery) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="7" transform="translate(510, 350)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#ef4444" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">7</text>
        </g>

        <!-- Stream 8 (NH3 Make-up Feed) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="8" transform="translate(350, 500)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#00c8ef" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">8</text>
        </g>

        <!-- Stream 9 (HP NH3 200 bar) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="9" transform="translate(800, 440)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#00c8ef" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">9</text>
        </g>

        <!-- Stream 10 (Condenser to Reactor) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="10" transform="translate(560, 450)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#10b981" stroke="#ffffff" stroke-width="0.8"/>
          <text x="8" y="11" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">10</text>
        </g>

        <!-- Stream 11 (Reactor Effluent Overflow) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="11" transform="translate(870, 120)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#10b981" stroke="#ffffff" stroke-width="0.8"/>
          <text x="8" y="11" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">11</text>
        </g>

        <!-- Stream 13 (Stripper Overhead Gas) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="13" transform="translate(1010, 100)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#f97316" stroke="#ffffff" stroke-width="0.8"/>
          <text x="8" y="11" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">13</text>
        </g>

        <!-- Stream 14 (Stripper Bottom Solution) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="14" transform="translate(1110, 490)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#10b981" stroke="#ffffff" stroke-width="0.8"/>
          <text x="8" y="11" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">14</text>
        </g>

        <!-- Stream 15 (MP Bottom Solution) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="15" transform="translate(1380, 470)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#10b981" stroke="#ffffff" stroke-width="0.8"/>
          <text x="8" y="11" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">15</text>
        </g>

        <!-- Stream 16 (LP Bottom 75% Solution) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="16" transform="translate(1870, 470)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#10b981" stroke="#ffffff" stroke-width="0.8"/>
          <text x="8" y="11" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">16</text>
        </g>

        <!-- Stream 17 (95% Concentrated Solution) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="17" transform="translate(2245, 80)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#10b981" stroke="#ffffff" stroke-width="0.8"/>
          <text x="8" y="11" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">17</text>
        </g>

        <!-- Stream 18 (99.7% Melt to Prilling Tower) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="18" transform="translate(2400, 200)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#10b981" stroke="#ffffff" stroke-width="0.8"/>
          <text x="8" y="11" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">18</text>
        </g>

        <!-- Stream 19 (Final Prills 42.35 t/h) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="19" transform="translate(2820, 485)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#10b981" stroke="#ffffff" stroke-width="0.8"/>
          <text x="8" y="11" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">19</text>
        </g>

        <!-- Stream 20 (HP Carbamate Recycle) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="20" transform="translate(1080, 500)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#10b981" stroke="#ffffff" stroke-width="0.8"/>
          <text x="8" y="11" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">20</text>
        </g>

        <!-- Stream 21 (LP Carbonate Recycle) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="21" transform="translate(1580, 500)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#10b981" stroke="#ffffff" stroke-width="0.8"/>
          <text x="8" y="11" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">21</text>
        </g>

        <!-- Stream 22 (Hydrolyzer Feed) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="22" transform="translate(1960, 430)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#f97316" stroke="#ffffff" stroke-width="0.8"/>
          <text x="8" y="11" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">22</text>
        </g>

        <!-- Stream 23 (Purified Waste Water) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="23" transform="translate(2020, 530)">
          <polygon points="0,8 8,0 16,8 8,16" fill="#10b981" stroke="#ffffff" stroke-width="0.8"/>
          <text x="8" y="11" fill="#061224" font-size="7.5" font-weight="bold" text-anchor="middle">23</text>
        </g>
      </g>
    </g>
  `;
}
