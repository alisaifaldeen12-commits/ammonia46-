/**
 * render_synth_400_svg.ts
 * Vector Blueprint Renderer for Unit 400 - Ammonia Synthesis & Refrigeration Section
 * Spacious, Wide-Canvas Architecture (2400 x 1150)
 * Fully Ordered Process Flow:
 * 1. Synthesis & Sequential Effluent Train: R-401 -> E-401 -> E-402 -> E-403 -> E-404 -> V-401
 * 2. Sequential Chilling & Secondary Separation: E-407 -> E-405 -> E-406 -> V-402
 * 3. Purge Gas Recovery: E-408 -> V-403 -> E-416
 * 4. Letdown & Vent: V-409 -> E-409 -> V-404
 * 5. Refrigeration Cycle: V-405/406/407 -> K-401T/K-401 -> E-412 -> V-408 -> P-401A/B
 */

import { renderShellAndTubeSVG } from './render_shell_and_tube';

export function renderSynthesis400SVG(showParticles: boolean): string {
  const isAnim = showParticles ? 'pfd-pipe-anim' : '';

  return `
    <g id="pfd-synth-400-layers">
      
      <!-- ========================================== -->
      <!-- TITLE BLOCK / PROCESS LEGEND (Bottom Right) -->
      <!-- ========================================== -->
      <g transform="translate(1760, 800)">
        <rect width="600" height="290" fill="#ffffff" stroke="#0f172a" stroke-width="2.5" rx="8"/>
        <rect x="0" y="0" width="600" height="38" fill="#0f172a" rx="8 8 0 0"/>
        <text x="25" y="24" fill="#38bdf8" font-size="14" font-weight="900" font-family="'Cairo', sans-serif">IRAQ NO. 3 PROJECT - KHOR AL-ZUBAIR PHASE-1</text>
        <text x="25" y="60" fill="#0284c7" font-size="12" font-weight="800" font-family="'Cairo', sans-serif">AMMONIA UNIT - SYNTHESIS & REFRIGERATION (SECTION 400)</text>
        <text x="25" y="82" fill="#0f172a" font-size="14.5" font-weight="900" font-family="'Cairo', sans-serif">مخطط دورة تخليق وتبريد الأمونيا (الترتيب المتسلسل للمعدات)</text>
        <text x="25" y="104" fill="#7c3aed" font-size="12" font-weight="800" font-family="'IBM Plex Mono', monospace">DWG NO. 6112P 300-401-00 & 300-402-00</text>
        <line x1="0" y1="116" x2="600" y2="116" stroke="#cbd5e1" stroke-width="1.4"/>
        
        <!-- Sequential Architecture Highlights -->
        <text x="25" y="140" fill="#b91c1c" font-size="11.5" font-weight="800" font-family="'Cairo', sans-serif">1. سلسلة تبريد غاز التفاعل بالترتيب المتسلسل (تيوب إلى تيوب):</text>
        <text x="40" y="160" fill="#334155" font-size="11" font-weight="700" font-family="'Cairo', sans-serif">R-401 (قاع 440°C) ➔ E-401 (336°C) ➔ E-402 (196°C) ➔ E-403 (93°C) ➔ E-404 (40°C) ➔ V-401</text>
        
        <text x="25" y="184" fill="#1d4ed8" font-size="11.5" font-weight="800" font-family="'Cairo', sans-serif">2. دورة التدوير (Recycle) والتثليج العميق بالترتيب المتسلسل:</text>
        <text x="40" y="204" fill="#334155" font-size="10.5" font-weight="700" font-family="'Cairo', sans-serif">V-401 (قمة) ➔ ضاغط K-301 تدوير ➔ شيل E-407 ➔ تيوب E-405 (+8°C) + غاز V-310 ➔ تيوب E-406 (-10°C) ➔ V-402 ➔ V-409</text>
        
        <text x="25" y="228" fill="#047857" font-size="11" font-weight="700" font-family="'Cairo', sans-serif">• خط Make-up: من K-301 ➔ تيوب E-315 (شيل C.W) ➔ فاصل V-310 ➔ يندمج مع خارج تيوب E-405 ويدخلان تيوب E-406</text>
        <text x="25" y="248" fill="#6d28d9" font-size="11" font-weight="700" font-family="'Cairo', sans-serif">• سوائل الأمونيا المفصولة من V-401 / V-402 / V-403 تصب في خزان خفض الضغط V-409 (18K)</text>

        <g transform="translate(25, 264)">
          <polygon points="0,6 6,0 12,6 6,12" fill="#dc2626" stroke="#0f172a" stroke-width="1.2"/>
          <text x="18" y="10" fill="#0f172a" font-size="10" font-weight="700" font-family="'Cairo', sans-serif">غاز تفاعل ساخن</text>
          
          <polygon points="135,6 141,0 147,6 141,12" fill="#0284c7" stroke="#0f172a" stroke-width="1.2"/>
          <text x="153" y="10" fill="#0f172a" font-size="10" font-weight="700" font-family="'Cairo', sans-serif">غاز مصنع / تدوير</text>
          
          <polygon points="275,6 281,0 287,6 281,12" fill="#7c3aed" stroke="#0f172a" stroke-width="1.2"/>
          <text x="293" y="10" fill="#0f172a" font-size="10" font-weight="700" font-family="'Cairo', sans-serif">أمونيا سائلة وتثليج</text>
          
          <polygon points="415,6 421,0 427,6 421,12" fill="#d97706" stroke="#0f172a" stroke-width="1.2"/>
          <text x="433" y="10" fill="#0f172a" font-size="10" font-weight="700" font-family="'Cairo', sans-serif">بيرج وفنت</text>
        </g>
      </g>

      <!-- ========================================== -->
      <!-- MAJOR PROCESS STREAM HIGH-VISIBILITY HEADERS -->
      <!-- ========================================== -->
      <g id="pfd-synth-major-stream-headers">
        <!-- 1. Make-up & Recycle Section Header -->
        <g transform="translate(25, 2)">
          <rect width="290" height="22" rx="4" fill="#0284c7" stroke="#0f172a" stroke-width="1.2"/>
          <text x="145" y="15" fill="#ffffff" font-size="10" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">منظومة غاز التعويض والتدوير (K-301 ➔ E-315 ➔ V-310)</text>
        </g>
        
        <!-- 2. Sequential Train Header Banner -->
        <g transform="translate(560, 140)">
          <rect width="750" height="30" rx="5" fill="#f8fafc" stroke="#dc2626" stroke-width="1.8"/>
          <text x="375" y="20" fill="#dc2626" font-size="12" font-weight="900" font-family="'Cairo', sans-serif" text-anchor="middle">
            سلسلة التبريد المتسلسلة لغاز التفاعل بالتيوب (R-401 ➔ E-401 ➔ E-402 ➔ E-403 ➔ E-404 ➔ V-401)
          </text>
        </g>

        <!-- 3. Chilling Train Header Banner -->
        <g transform="translate(1420, 140)">
          <rect width="580" height="30" rx="5" fill="#f8fafc" stroke="#2563eb" stroke-width="1.8"/>
          <text x="290" y="20" fill="#1d4ed8" font-size="12" font-weight="900" font-family="'Cairo', sans-serif" text-anchor="middle">
            سلسلة التبريد العميق والتثليج بالترتيب (V-401 ➔ E-407 ➔ E-405 ➔ E-406 ➔ V-402)
          </text>
        </g>

        <!-- 4. Purge Gas to Boiler Header -->
        <g transform="translate(2100, 75)">
          <rect width="220" height="26" rx="5" fill="#10b981" stroke="#0f172a" stroke-width="1.4"/>
          <text x="110" y="18" fill="#ffffff" font-size="10.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">غاز التطهير إلى الغلايات (6 kg/cm²)</text>
        </g>

        <!-- 5. Liquid Ammonia Product Header -->
        <g transform="translate(1250, 635)">
          <rect width="265" height="28" rx="5" fill="#7c3aed" stroke="#0f172a" stroke-width="1.6"/>
          <text x="132.5" y="19" fill="#ffffff" font-size="11" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">منتج الأمونيا النهائي إلى خزان V-451 B (-33°C)</text>
        </g>
      </g>

      <!-- ========================================== -->
      <!-- PIPING LAYER - CONTINUOUS SEQUENTIAL RUNS -->
      <!-- ========================================== -->
      <g id="pfd-synth-piping">
        
        <!-- --- 1. MAKE-UP GAS TRAIN (K-301 St.4 -> E-315 Tubes -> V-310 -> E-405/E-406 Junction) --- -->
        <!-- Fresh Gas Supply -> K-301 Stage 4 -->
        <path d="M 10 75 L 40 75" fill="none" stroke="#0284c7" stroke-width="3" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        
        <!-- K-301 Stage 4 Discharge (240 kg/cm²G, 95°C) -> E-315 Tube Inlet -->
        <path d="M 105 75 L 140 75" fill="none" stroke="#0284c7" stroke-width="2.5" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        
        <!-- E-315 Tube Outlet (26°C) -> V-310 Make-up Separator -->
        <path d="M 220 75 L 250 75" fill="none" stroke="#0284c7" stroke-width="2.5" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        
        <!-- E-315 Shell C.W. Cooling Water Lines -->
        <!-- C.W. In to E-315 Shell (Bottom) -->
        <path d="M 180 115 L 180 97" fill="none" stroke="#0284c7" stroke-width="1.6" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        <!-- C.W. Out from E-315 Shell (Top) -->
        <path d="M 180 55 L 180 38 L 210 38" fill="none" stroke="#0284c7" stroke-width="1.6" marker-end="url(#pfdArrow)" class="${isAnim}"/>

        <!-- Ex V-310 Top (26°C, 240 kg/cm²G): Runs along top header (y: 26) straight to join E-405/E-406 tubes -->
        <path d="M 272 50 L 272 26 L 1740 26 L 1740 283" fill="none" stroke="#0284c7" stroke-width="3" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        <!-- Junction dot where V-310 Make-up line connects to E-405/E-406 tube stream -->
        <circle cx="1740" cy="283" r="5" fill="#0284c7" stroke="#0f172a" stroke-width="1.8"/>
        
        <!-- Clarification Callout Badge on the junction -->
        <g transform="translate(1570, 48)">
          <rect width="270" height="38" rx="5" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
          <text x="135" y="15" fill="#0284c7" font-size="10.5" font-weight="900" font-family="'Cairo', sans-serif" text-anchor="middle">انضمام غاز التعويض Make-up Gas</text>
          <text x="135" y="29" fill="#0f172a" font-size="9.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">من V-310 مع خارج تيوب E-405 إلى تيوب E-406</text>
        </g>

        <!-- --- 2. RECYCLE GAS TRAIN (V-401 Top -> K-301 Recycle Wheel -> E-407 Shell) --- -->
        <!-- Step R1: V-401 Overhead Recycle Gas (40°C) -> Runs along y: 42 to K-301 Recycle Wheel Suction -->
        <path d="M 1275 210 L 1275 42 L 18 42 L 18 185 L 40 185" fill="none" stroke="#0284c7" stroke-width="3.2" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        <!-- Tag on Recycle Suction Line -->
        <g transform="translate(680, 28)">
          <rect width="220" height="22" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
          <text x="110" y="15" fill="#38bdf8" font-size="9.5" font-weight="800" font-family="'Cairo', sans-serif" text-anchor="middle">سحب غاز التدوير Recycle من قمة V-401 لـ K-301</text>
        </g>

        <!-- Step R2: K-301 Recycle Wheel Discharge -> Runs through clear top highway corridor at y: 16 to E-407 Shell Top Inlet -->
        <path d="M 105 185 L 125 185 L 125 16 L 1457 16 L 1457 245" fill="none" stroke="#0284c7" stroke-width="3.6" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        <g transform="translate(680, 5)">
          <rect width="270" height="22" rx="4" fill="#0f172a" stroke="#0284c7" stroke-width="1.3"/>
          <text x="135" y="15" fill="#38bdf8" font-size="9.5" font-weight="800" font-family="'Cairo', sans-serif" text-anchor="middle">دفع غاز التدوير Recycle من K-301 إلى شيل E-407 (40°C)</text>
        </g>

        <!-- ======================================================= -->
        <!-- THE HOT EFFLUENT TRAIN (STRICT SEQUENTIAL TUBE-TO-TUBE) -->
        <!-- R-401 -> E-401 -> E-402 -> E-403 -> E-404 -> V-401      -->
        <!-- ======================================================= -->

        <!-- Step A: R-401 Bottom (440°C) -> E-401 Tube Inlet (Bottom-Left Nozzle) -->
        <path d="M 420 365 L 420 440 L 552 440 L 552 322" fill="none" stroke="#dc2626" stroke-width="4.2" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>
        
        <!-- Step B: Ex E-401 Tubes (336°C, Top-Right Nozzle) -> DIRECTLY to E-402 Tubes (Top-Left Nozzle) -->
        <path d="M 648 243 L 648 215 L 722 215 L 722 243" fill="none" stroke="#ea580c" stroke-width="3.8" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <!-- Temperature badge between E-401 & E-402 -->
        <g transform="translate(645, 205)">
          <rect width="90" height="20" rx="4" fill="#0f172a" stroke="#ea580c" stroke-width="1.2"/>
          <text x="45" y="14" fill="#fb923c" font-size="10" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">336°C (تيوب)</text>
        </g>

        <!-- E-402 Shell: Boiler Feed Water (B.F.W.) cooling circuit -->
        <!-- B.F.W. Cold feed into E-402 Shell (Bottom Nozzle) -->
        <path d="M 756 420 L 756 322" fill="none" stroke="#0284c7" stroke-width="2.5" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        <g transform="translate(710, 425)">
          <rect width="130" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
          <text x="65" y="14" fill="#38bdf8" font-size="9" font-weight="800" font-family="'Cairo', sans-serif" text-anchor="middle">دخول ماء B.F.W للشيل</text>
        </g>
        <!-- Heated B.F.W. out of E-402 Shell (Top Nozzle) to V-102 -->
        <path d="M 785 243 L 785 215 L 855 215" fill="none" stroke="#ea580c" stroke-width="2.5" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <g transform="translate(820, 195)">
          <rect width="130" height="20" rx="4" fill="#0f172a" stroke="#fb923c" stroke-width="1.2"/>
          <text x="65" y="14" fill="#fed7aa" font-size="9" font-weight="800" font-family="'Cairo', sans-serif" text-anchor="middle">خروج BFW مسخن لـ V-102</text>
        </g>

        <!-- Step C: Ex E-402 Tubes (196°C, Bottom-Right Nozzle) -> DIRECTLY to E-403 Tubes (Bottom-Left Nozzle) -->
        <path d="M 818 322 L 818 440 L 892 440 L 892 322" fill="none" stroke="#d97706" stroke-width="3.6" marker-end="url(#pfdArrowYellow)" class="${isAnim}"/>
        <!-- Temperature badge between E-402 & E-403 -->
        <g transform="translate(815, 425)">
          <rect width="90" height="20" rx="4" fill="#0f172a" stroke="#d97706" stroke-width="1.2"/>
          <text x="45" y="14" fill="#fcd34d" font-size="10" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">196°C (تيوب)</text>
        </g>

        <!-- Step D: Ex E-403 Tubes (93°C, Top-Right Nozzle) -> DIRECTLY to E-404 Tubes (Top-Left Nozzle) -->
        <path d="M 988 243 L 988 215 L 1062 215 L 1062 243" fill="none" stroke="#0284c7" stroke-width="3.6" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        <!-- Temperature badge between E-403 & E-404 -->
        <g transform="translate(985, 205)">
          <rect width="90" height="20" rx="4" fill="#0f172a" stroke="#0284c7" stroke-width="1.2"/>
          <text x="45" y="14" fill="#38bdf8" font-size="10" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">93°C (تيوب)</text>
        </g>

        <!-- E-404 Shell: Cooling Water (C.W.) circuit -->
        <!-- Cooling water into E-404 Shell (Bottom Nozzle) -->
        <path d="M 1096 420 L 1096 322" fill="none" stroke="#0284c7" stroke-width="2.5" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        <g transform="translate(1055, 425)">
          <rect width="120" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
          <text x="60" y="14" fill="#38bdf8" font-size="9" font-weight="800" font-family="'Cairo', sans-serif" text-anchor="middle">دخول مياه تبريد C.W</text>
        </g>
        <!-- Return cooling water out of E-404 Shell (Top Nozzle) -->
        <path d="M 1125 243 L 1125 200 L 1190 200" fill="none" stroke="#0284c7" stroke-width="2.5" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        <g transform="translate(1160, 195)">
          <rect width="110" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
          <text x="55" y="14" fill="#38bdf8" font-size="9" font-weight="800" font-family="'Cairo', sans-serif" text-anchor="middle">رجوع مياه C.W</text>
        </g>

        <!-- Step E: Ex E-404 Tubes (40°C, Axial-Right Nozzle) -> DIRECTLY to V-401 Primary Separator -->
        <path d="M 1194 283 L 1240 283" fill="none" stroke="#0284c7" stroke-width="3.8" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        <!-- Temperature badge between E-404 & V-401 -->
        <g transform="translate(1145, 310)">
          <rect width="85" height="20" rx="4" fill="#0f172a" stroke="#0284c7" stroke-width="1.2"/>
          <text x="42.5" y="14" fill="#38bdf8" font-size="10" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">40°C / 214K</text>
        </g>

        <!-- ======================================================= -->
        <!-- V-401 LIQUID & VAPOR FLOWS                              -->
        <!-- ======================================================= -->
        <!-- V-401 Bottom: Primary Liquid NH3 to V-409 via LIC-401 -->
        <path d="M 1275 360 L 1275 520 L 1220 520 L 1220 560" fill="none" stroke="#7c3aed" stroke-width="3.2" marker-end="url(#pfdArrowPurple)" class="${isAnim}"/>
        
        <!-- Purge gas takeoff from V-401 top to E-408 Tube Inlet -->
        <path d="M 1275 135 L 1275 105 L 2000 105 L 2000 221 L 2036 221" fill="none" stroke="#d97706" stroke-width="2.2" marker-end="url(#pfdArrowYellow)" class="${isAnim}"/>

        <!-- ======================================================= -->
        <!-- CHILLING BATTERY IN SEQUENTIAL ORDER:                   -->
        <!-- E-407 (Cold Exchanger) -> E-405 -> E-406 -> V-402        -->
        <!-- ======================================================= -->
        
        <!-- Step 1: E-407 Shell Out (Axial-Right Nozzle cooled to 26.5°C) -> E-405 Tubes Inlet (Axial-Left Nozzle) -->
        <path d="M 1530 283 L 1560 283" fill="none" stroke="#0284c7" stroke-width="3.5" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        <!-- Temperature badge between E-407 & E-405 -->
        <g transform="translate(1505, 248)">
          <rect width="80" height="18" rx="3" fill="#0f172a" stroke="#0284c7" stroke-width="1.2"/>
          <text x="40" y="13" fill="#38bdf8" font-size="9" font-weight="bold" font-family="'IBM Plex Mono', monospace" text-anchor="middle">26.5°C</text>
        </g>

        <!-- Step 2: E-405 Tubes Out (Axial-Right Nozzle 14°C) -> Joined by V-310 line -> E-406 Tubes Inlet (Axial-Left Nozzle) -->
        <path d="M 1724 283 L 1756 283" fill="none" stroke="#0284c7" stroke-width="3.5" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        <!-- Temperature badge between E-405 & E-406 -->
        <g transform="translate(1695, 275)">
          <rect width="55" height="18" rx="3" fill="#0f172a" stroke="#0284c7" stroke-width="1"/>
          <text x="27.5" y="13" fill="#38bdf8" font-size="9" font-weight="bold" font-family="'IBM Plex Mono', monospace" text-anchor="middle">14.0°C</text>
        </g>

        <!-- Step 3: E-406 Tubes Out (Axial-Right Nozzle -10°C / Deep Chilled) -> into V-402 Secondary Separator -->
        <path d="M 1924 283 L 1945 283" fill="none" stroke="#2563eb" stroke-width="3.8" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>
        <!-- Temperature badge between E-406 & V-402 -->
        <g transform="translate(1865, 312)">
          <rect width="60" height="18" rx="3" fill="#0f172a" stroke="#2563eb" stroke-width="1"/>
          <text x="30" y="13" fill="#93c5fd" font-size="9" font-weight="bold" font-family="'IBM Plex Mono', monospace" text-anchor="middle">-10.0°C</text>
        </g>

        <!-- Step 4: V-402 Bottom Liquid NH3 (-10°C) -> via LIC-403 to V-409 Letdown Tank -->
        <path d="M 1965 360 L 1965 520 L 1260 520 L 1260 560" fill="none" stroke="#7c3aed" stroke-width="3" marker-end="url(#pfdArrowPurple)" class="${isAnim}"/>

        <!-- Step 5: V-402 Overhead Cold Vapor (-10°C) -> goes to E-407 TUBES (Axial-Left Channel Head Nozzle) -->
        <path d="M 1965 210 L 1965 140 L 1390 140 L 1390 283" fill="none" stroke="#2563eb" stroke-width="3.5" marker-end="url(#pfdArrowBlue)" class="${isAnim}"/>
        <g transform="translate(1520, 126)">
          <rect width="230" height="20" rx="4" fill="#0f172a" stroke="#2563eb" stroke-width="1.2"/>
          <text x="115" y="14" fill="#93c5fd" font-size="9.5" font-weight="800" font-family="'Cairo', sans-serif" text-anchor="middle">بخار قمة V-402 (-10°C) إلى تيوبات E-407</text>
        </g>

        <!-- Step 6: E-407 Tubes Outlet (Bottom-Right Nozzle Warmed to ~30°C): -->
        <!-- Warmed Feed Gas returns to E-403 Shell (Bottom Nozzle) to be preheated by hot effluent -->
        <path d="M 1518 322 L 1518 480 L 914 480 L 914 322" fill="none" stroke="#0284c7" stroke-width="3.5" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        <g transform="translate(1080, 485)">
          <rect width="230" height="20" rx="4" fill="#0f172a" stroke="#0284c7" stroke-width="1.2"/>
          <text x="115" y="14" fill="#38bdf8" font-size="9.5" font-weight="800" font-family="'Cairo', sans-serif" text-anchor="middle">خروج تيوبات E-407 (+30°C) إلى شيل E-403</text>
        </g>
        
        <!-- Step 7: Ex E-403 Shell (Top Nozzle preheated to 148°C) -> goes to REACTOR WALL / SHROUD (جدار المفاعل R-401) -->
        <path d="M 966 243 L 966 115 L 348 115 L 348 335 L 358 335" fill="none" stroke="#ea580c" stroke-width="3.5" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <g transform="translate(620, 105)">
          <rect width="270" height="22" rx="4" fill="#0f172a" stroke="#ea580c" stroke-width="1.3"/>
          <text x="135" y="15" fill="#fed7aa" font-size="9.5" font-weight="800" font-family="'Cairo', sans-serif" text-anchor="middle">خروج شيل E-403 (148°C) إلى جدار المفاعل R-401 (Shroud)</text>
        </g>

        <!-- Step 8: Upward Flow inside Reactor Shroud / Annulus Wall (تبريد جدار المفاعل وحمايته) -->
        <path d="M 353 335 L 353 140 L 348 140" fill="none" stroke="#ea580c" stroke-width="3.2" stroke-dasharray="4,2" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>

        <!-- Step 9: Ex Reactor Wall (جدار المفاعل R-401) -> goes to E-401 Shell (Top Nozzle) -->
        <path d="M 348 140 L 348 135 L 586 135 L 586 243" fill="none" stroke="#ea580c" stroke-width="3.5" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <g transform="translate(370, 137)">
          <rect width="200" height="20" rx="4" fill="#0f172a" stroke="#ea580c" stroke-width="1.2"/>
          <text x="100" y="14" fill="#fed7aa" font-size="9.5" font-weight="800" font-family="'Cairo', sans-serif" text-anchor="middle">من جدار المفاعل إلى شيل E-401 (410°C)</text>
        </g>

        <!-- Step 10: Ex E-401 Shell (Bottom Nozzle 410°C) -> Goes to H-401 & By-pass Manifold -->
        <path d="M 615 322 L 615 380 L 325 380" fill="none" stroke="#dc2626" stroke-width="3.8" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>

        <!-- ======================================================= -->
        <!-- H-401 STARTUP HEATER & BY-PASS VALVE MANIFOLD           -->
        <!-- ======================================================= -->
        
        <!-- MAIN BY-PASS LINE (runs vertically from y: 380 to y: 190) -->
        <path d="M 325 380 L 325 190" fill="none" stroke="#dc2626" stroke-width="3.8" class="${isAnim}"/>
        
        <!-- By-pass Valve on line (OPEN in normal operation, CLOSED during H-401 startup) -->
        <g transform="translate(325, 275)">
          <polygon points="-8,-6 8,6 -8,6 8,-6" fill="#10b981" stroke="#0f172a" stroke-width="1.5"/>
          <line x1="0" y1="0" x2="0" y2="-8" stroke="#0f172a" stroke-width="1.5"/>
          <line x1="-5" y1="-8" x2="5" y2="-8" stroke="#0f172a" stroke-width="2"/>
          <!-- Valve State Badge -->
          <rect x="-65" y="-25" width="130" height="17" rx="3" fill="#ecfdf5" stroke="#10b981" stroke-width="1.2"/>
          <text x="0" y="-13" fill="#047857" font-size="8.5" font-weight="900" font-family="'Cairo', sans-serif" text-anchor="middle">صمام By-pass (مفتوح بالتشغيل)</text>
        </g>

        <!-- H-401 INLET BRANCH: takes off BEFORE the bypass valve (at y: 380) -->
        <path d="M 325 380 L 325 495 L 270 495" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="4,2" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>
        <!-- Heater Inlet Valve (ISOLATED/CLOSED in normal run) -->
        <g transform="translate(295, 495)">
          <polygon points="-7,-5 7,5 -7,5 7,-5" fill="#f59e0b" stroke="#0f172a" stroke-width="1.3"/>
          <line x1="0" y1="0" x2="0" y2="-7" stroke="#0f172a" stroke-width="1.3"/>
          <rect x="-45" y="-22" width="90" height="15" rx="3" fill="#fffbeb" stroke="#f59e0b" stroke-width="1"/>
          <text x="0" y="-11" fill="#b45309" font-size="7.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">دخول H-401 (معزول)</text>
        </g>

        <!-- H-401 OUTLET BRANCH: exits heater H-401 -> passes outlet valve -> ties into line AFTER By-pass valve -->
        <path d="M 270 467 L 295 467 L 295 190 L 325 190" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="4,2" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>
        <!-- Heater Outlet Valve (ISOLATED/CLOSED in normal run) -->
        <g transform="translate(295, 340)">
          <polygon points="-7,-5 7,5 -7,5 7,-5" fill="#f59e0b" stroke="#0f172a" stroke-width="1.3"/>
          <line x1="0" y1="0" x2="0" y2="-7" stroke="#0f172a" stroke-width="1.3"/>
          <rect x="-45" y="-22" width="90" height="15" rx="3" fill="#fffbeb" stroke="#f59e0b" stroke-width="1"/>
          <text x="0" y="-11" fill="#b45309" font-size="7.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">خروج H-401 (معزول)</text>
        </g>

        <!-- Tie-in Junction Dot AFTER the By-pass Valve -->
        <circle cx="325" cy="190" r="5" fill="#dc2626" stroke="#0f172a" stroke-width="1.8"/>

        <!-- FINAL UNIFIED FEED LINE: from tie-in junction (after By-pass) directly into R-401 Top Bed 1 -->
        <path d="M 325 190 L 325 90 L 420 90 L 420 110" fill="none" stroke="#dc2626" stroke-width="4.2" marker-end="url(#pfdArrowRed)" class="${isAnim}"/>
        <g transform="translate(340, 68)">
          <rect width="120" height="20" rx="4" fill="#0f172a" stroke="#dc2626" stroke-width="1.2"/>
          <text x="60" y="14" fill="#fca5a5" font-size="9" font-weight="900" font-family="'Cairo', sans-serif" text-anchor="middle">تغذية الطبقة 1 (380°C)</text>
        </g>

        <!-- Bed 2 & Bed 3 Quench Lines from Feed Line to R-401 Interbed Injection Nozzles -->
        <path d="M 420 90 L 420 190 L 435 190" fill="none" stroke="#ea580c" stroke-width="2.2" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>
        <path d="M 420 190 L 420 255 L 435 255" fill="none" stroke="#ea580c" stroke-width="2.2" marker-end="url(#pfdArrowOrange)" class="${isAnim}"/>

        <!-- ======================================================= -->
        <!-- PURGE GAS & VENT GAS RECOVERY LINES                     -->
        <!-- ======================================================= -->
        <!-- E-408 Tubes (Axial-Right Nozzle) -> V-403 Separator -->
        <path d="M 2160 221 L 2190 221" fill="none" stroke="#d97706" stroke-width="2.5" marker-end="url(#pfdArrowYellow)" class="${isAnim}"/>
        <!-- V-403 Bottom: Liquid NH3 to V-409 Letdown Tank -->
        <path d="M 2217 265 L 2217 540 L 1290 540 L 1290 560" fill="none" stroke="#7c3aed" stroke-width="2.2" marker-end="url(#pfdArrowPurple)" class="${isAnim}"/>
        <!-- V-403 Top: Gas -> E-416 Steam Heater (Axial-Left Nozzle) -->
        <path d="M 2217 190 L 2217 170 L 2270 170 L 2270 221" fill="none" stroke="#d97706" stroke-width="2.5" marker-end="url(#pfdArrowYellow)" class="${isAnim}"/>
        <!-- Ex E-416 (Axial-Right Nozzle, 150°C) -> to Boiler / Flare via PIC-403 -->
        <path d="M 2370 221 L 2410 221 L 2410 110 L 2320 110" fill="none" stroke="#d97706" stroke-width="2.8" marker-end="url(#pfdArrowYellow)" class="${isAnim}"/>

        <!-- V-409 Letdown Tank Vents -> E-409 Vent Condenser (Axial-Left Nozzle) -->
        <path d="M 1230 560 L 1230 500 L 1330 500 L 1330 576 L 1390 576" fill="none" stroke="#d97706" stroke-width="2.2" marker-end="url(#pfdArrowYellow)" class="${isAnim}"/>
        <g transform="translate(1245, 478)">
          <rect width="130" height="18" rx="3" fill="#0f172a" stroke="#d97706" stroke-width="1"/>
          <text x="65" y="13" fill="#fcd34d" font-size="8.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">غاز وميض V-409 لـ E-409</text>
        </g>

        <!-- E-409 Tubes Out (Axial-Right Nozzle) -> V-404 Vent Separator In -->
        <path d="M 1490 576 L 1530 576" fill="none" stroke="#d97706" stroke-width="2.5" marker-end="url(#pfdArrowYellow)" class="${isAnim}"/>
        
        <!-- V-404 Bottom Liquid NH3 -> to Suction column V-405 (-32°C) -->
        <path d="M 1557 620 L 1557 680 L 190 680 L 190 790" fill="none" stroke="#7c3aed" stroke-width="2.4" marker-end="url(#pfdArrowPurple)" class="${isAnim}"/>
        <g transform="translate(1360, 685)">
          <rect width="170" height="18" rx="3" fill="#0f172a" stroke="#7c3aed" stroke-width="1"/>
          <text x="85" y="13" fill="#c4b5fd" font-size="8.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">سائل NH3 من V-404 إلى V-405</text>
        </g>

        <!-- V-404 Top Non-Condensable Vent Gas -> to Flare / Fuel System -->
        <path d="M 1557 550 L 1557 510 L 1650 510 L 1650 490 L 1750 490" fill="none" stroke="#0284c7" stroke-width="2" marker-end="url(#pfdArrow)" class="${isAnim}"/>
        <g transform="translate(1620, 465)">
          <rect width="145" height="18" rx="3" fill="#0f172a" stroke="#0284c7" stroke-width="1"/>
          <text x="72.5" y="13" fill="#38bdf8" font-size="8" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">غاز تنفيس V-404 للمشعل Flare</text>
        </g>

        <!-- ======================================================= -->
        <!-- REFRIGERATION LOOP (LOWER DECK)                         -->
        <!-- ======================================================= -->
        <!-- V-409 Bottom Liquid NH3 -> to Suction Column V-407/406/405 -->
        <path d="M 1200 625 L 1200 660 L 190 660 L 190 700" fill="none" stroke="#7c3aed" stroke-width="3" marker-end="url(#pfdArrowPurple)" class="${isAnim}"/>

        <!-- Suction Tower -> K-401 Compressor Inlet -->
        <path d="M 190 850 L 190 880 L 320 880 L 320 820" fill="none" stroke="#7c3aed" stroke-width="3.5" marker-end="url(#pfdArrowPurple)" class="${isAnim}"/>

        <!-- K-401 Discharge (17 kg/cm², 105.6°C) -> E-412 Condenser Shell Inlet -->
        <path d="M 440 775 L 652 775 L 652 723" fill="none" stroke="#7c3aed" stroke-width="3.5" marker-end="url(#pfdArrowPurple)" class="${isAnim}"/>

        <!-- E-412 Condenser Shell Out (43°C) -> V-408 Receiver -->
        <path d="M 691 800 L 691 820 L 760 820 L 760 775 L 780 775" fill="none" stroke="#7c3aed" stroke-width="3.5" marker-end="url(#pfdArrowPurple)" class="${isAnim}"/>

        <!-- V-408 Receiver Bottom -> Liquid Refrigerant Expansion Distribution -->
        <path d="M 880 800 L 880 835 L 560 835 L 560 660 L 190 660" fill="none" stroke="#7c3aed" stroke-width="2.2" stroke-dasharray="4,2" marker-end="url(#pfdArrowPurple)" class="${isAnim}"/>

        <!-- SUCTION LINE: V-405 Bottom (-33°C, 0.1 kg/cm²) -> P-401 A/B Product Ammonia Pumps Suction -->
        <path d="M 135 855 L 135 915 L 1040 915 L 1040 815" fill="none" stroke="#7c3aed" stroke-width="4.2" marker-end="url(#pfdArrowPurple)" class="${isAnim}"/>
        <!-- Suction Line Tag -->
        <g transform="translate(420, 903)">
          <rect width="320" height="24" rx="4" fill="#0f172a" stroke="#7c3aed" stroke-width="1.4"/>
          <text x="160" y="16" fill="#c4b5fd" font-size="10.5" font-weight="800" font-family="'Cairo', sans-serif" text-anchor="middle">سحب سائل الأمونيا (-33°C) من قعر V-405 إلى مضخات P-401 A/B</text>
        </g>

        <!-- DISCHARGE LINE: P-401 A/B Discharge (25 kg/cm², -33°C) -> V-451 B Refrigerated Storage Tank -->
        <path d="M 1098 785 L 1263 785" fill="none" stroke="#7c3aed" stroke-width="4.5" marker-end="url(#pfdArrowPurple)" class="${isAnim}"/>
        <!-- Discharge Line Tag -->
        <g transform="translate(1110, 755)">
          <rect width="140" height="22" rx="4" fill="#0f172a" stroke="#a855f7" stroke-width="1.3"/>
          <text x="70" y="15" fill="#e9d5ff" font-size="9.5" font-weight="900" font-family="'Cairo', sans-serif" text-anchor="middle">25 kg/cm²G (-33°C)</text>
        </g>
      </g>

      <!-- ========================================== -->
      <!-- STREAM IDENTIFIER FLAGS (CLICKABLE DIAMONDS) -->
      <!-- ========================================== -->
      <g id="pfd-synth-stream-flags">
        <!-- Stream 1 (Make-up Syngas) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="1" transform="translate(110, 65)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#0284c7" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">1</text>
        </g>
        <!-- Stream 4 (Preheated Feed to R-401) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="4" transform="translate(770, 180)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#ea580c" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">4</text>
        </g>
        <!-- Stream 5 (Combined Feed to R-401 Top) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="5" transform="translate(460, 70)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#dc2626" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">5</text>
        </g>
        <!-- Stream 7 (Hot Reacted Effluent ex R-401 Bottom) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="7" transform="translate(470, 430)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#dc2626" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">7</text>
        </g>
        <!-- Stream 8 (Effluent ex E-401 to E-402) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="8" transform="translate(685, 205)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#ea580c" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">8</text>
        </g>
        <!-- Stream 9 (Effluent ex E-402 to E-403) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="9" transform="translate(855, 430)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#d97706" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">9</text>
        </g>
        <!-- Stream 10 (Effluent ex E-403 to E-404) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="10" transform="translate(1025, 205)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#0284c7" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">10</text>
        </g>
        <!-- Stream 11 (Chilled Mixture ex E-404 to V-401) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="11" transform="translate(1185, 273)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#0284c7" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">11</text>
        </g>
        <!-- Stream 12 (Liquid NH3 ex V-401 to V-409) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="12" transform="translate(1260, 485)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#7c3aed" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">12</text>
        </g>
        <!-- Stream 13 (Vapor ex V-401 to E-407 Cold Exchanger) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="13" transform="translate(1375, 273)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#0284c7" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">13</text>
        </g>
        <!-- Stream 14 (Gas ex E-407 to E-405 Chiller) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="14" transform="translate(1545, 273)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#0284c7" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">14</text>
        </g>
        <!-- Stream 15 (Gas ex E-405 to E-406 Deep Chiller) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="15" transform="translate(1725, 273)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#2563eb" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">15</text>
        </g>
        <!-- Stream 16 (Chilled Stream to V-402 Secondary Separator) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="16" transform="translate(1890, 273)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#2563eb" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">16</text>
        </g>
        <!-- Stream 18 (Purge Gas ex V-401 to E-408) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="18" transform="translate(1580, 90)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#d97706" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">18</text>
        </g>
        <!-- Stream 28 (Liquid NH3 ex V-409 to Suction Column) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="28" transform="translate(680, 645)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#7c3aed" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">28</text>
        </g>
        <!-- Stream 29 (Refrigeration Compressor Discharge) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="29" transform="translate(480, 760)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#7c3aed" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">29</text>
        </g>
        <!-- Stream 32 (Product Liquid Ammonia to Storage V-451 B) -->
        <g class="pfd-stream-badge cursor-pointer" data-st="32" transform="translate(1170, 775)">
          <polygon points="0,7 7,0 14,7 7,14" fill="#7c3aed" stroke="#ffffff" stroke-width="0.8"/>
          <text x="7" y="10" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">32</text>
        </g>
      </g>

      <!-- ========================================== -->
      <!-- DCS CONTROLLERS (ISA 5.1 SYMBOLS)         -->
      <!-- ========================================== -->
      <g id="pfd-synth-controllers">
        <!-- TRC-402 on R-401 Bed 1 (380°C) -->
        <g class="pfd-ctrl-item cursor-pointer" data-loop="TRC-402" transform="translate(495, 145)">
          <circle cx="17" cy="17" r="16" fill="#ffffff" stroke="#dc2626" stroke-width="2.2"/>
          <line x1="1" y1="17" x2="33" y2="17" stroke="#dc2626" stroke-width="1.2"/>
          <text x="17" y="13" fill="#dc2626" font-size="9" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">TRC</text>
          <text x="17" y="28" fill="#0f172a" font-size="9.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">402</text>
        </g>
        <line x1="480" y1="162" x2="495" y2="162" stroke="#dc2626" stroke-width="1.4" stroke-dasharray="3,2"/>

        <!-- TRC-403 on R-401 Bed 2 Quench (420°C) -->
        <g class="pfd-ctrl-item cursor-pointer" data-loop="TRC-403" transform="translate(495, 210)">
          <circle cx="17" cy="17" r="16" fill="#ffffff" stroke="#dc2626" stroke-width="2"/>
          <line x1="1" y1="17" x2="33" y2="17" stroke="#dc2626" stroke-width="1"/>
          <text x="17" y="13" fill="#dc2626" font-size="9" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">TRC</text>
          <text x="17" y="28" fill="#0f172a" font-size="9.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">403</text>
        </g>
        <line x1="480" y1="227" x2="495" y2="227" stroke="#dc2626" stroke-width="1.4" stroke-dasharray="3,2"/>

        <!-- TRC-404 on R-401 Bed 3 Quench (430°C) -->
        <g class="pfd-ctrl-item cursor-pointer" data-loop="TRC-404" transform="translate(495, 275)">
          <circle cx="17" cy="17" r="16" fill="#ffffff" stroke="#dc2626" stroke-width="2"/>
          <line x1="1" y1="17" x2="33" y2="17" stroke="#dc2626" stroke-width="1"/>
          <text x="17" y="13" fill="#dc2626" font-size="9" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">TRC</text>
          <text x="17" y="28" fill="#0f172a" font-size="9.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">404</text>
        </g>
        <line x1="480" y1="292" x2="495" y2="292" stroke="#dc2626" stroke-width="1.4" stroke-dasharray="3,2"/>

        <!-- LIC-401 on V-401 Bottom Liquid -->
        <g class="pfd-ctrl-item cursor-pointer" data-loop="LIC-401" transform="translate(1315, 375)">
          <circle cx="17" cy="17" r="16" fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
          <line x1="1" y1="17" x2="33" y2="17" stroke="#7c3aed" stroke-width="1"/>
          <text x="17" y="13" fill="#7c3aed" font-size="9" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">LIC</text>
          <text x="17" y="28" fill="#0f172a" font-size="9.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">401</text>
        </g>
        <line x1="1315" y1="392" x2="1275" y2="392" stroke="#7c3aed" stroke-width="1.3" stroke-dasharray="3,2"/>

        <!-- LIC-406 on E-405 Shell Level -->
        <g class="pfd-ctrl-item cursor-pointer" data-loop="LIC-406" transform="translate(1620, 375)">
          <circle cx="17" cy="17" r="16" fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
          <line x1="1" y1="17" x2="33" y2="17" stroke="#7c3aed" stroke-width="1"/>
          <text x="17" y="13" fill="#7c3aed" font-size="9" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">LIC</text>
          <text x="17" y="28" fill="#0f172a" font-size="9.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">406</text>
        </g>
        <line x1="1637" y1="375" x2="1637" y2="350" stroke="#7c3aed" stroke-width="1.3" stroke-dasharray="3,2"/>

        <!-- LIC-402 on E-406 Shell Level -->
        <g class="pfd-ctrl-item cursor-pointer" data-loop="LIC-402" transform="translate(1790, 375)">
          <circle cx="17" cy="17" r="16" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
          <line x1="1" y1="17" x2="33" y2="17" stroke="#2563eb" stroke-width="1"/>
          <text x="17" y="13" fill="#2563eb" font-size="9" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">LIC</text>
          <text x="17" y="28" fill="#0f172a" font-size="9.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">402</text>
        </g>
        <line x1="1807" y1="375" x2="1807" y2="350" stroke="#2563eb" stroke-width="1.3" stroke-dasharray="3,2"/>

        <!-- LIC-403 on V-402 Bottom Liquid -->
        <g class="pfd-ctrl-item cursor-pointer" data-loop="LIC-403" transform="translate(2010, 375)">
          <circle cx="17" cy="17" r="16" fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
          <line x1="1" y1="17" x2="33" y2="17" stroke="#7c3aed" stroke-width="1"/>
          <text x="17" y="13" fill="#7c3aed" font-size="9" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">LIC</text>
          <text x="17" y="28" fill="#0f172a" font-size="9.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">403</text>
        </g>
        <line x1="2010" y1="392" x2="1965" y2="392" stroke="#7c3aed" stroke-width="1.3" stroke-dasharray="3,2"/>

        <!-- LIC-425 on E-408 Purge Condenser Level -->
        <g class="pfd-ctrl-item cursor-pointer" data-loop="LIC-425" transform="translate(2100, 295)">
          <circle cx="17" cy="17" r="16" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
          <line x1="1" y1="17" x2="33" y2="17" stroke="#d97706" stroke-width="1"/>
          <text x="17" y="13" fill="#d97706" font-size="9" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">LIC</text>
          <text x="17" y="28" fill="#0f172a" font-size="9.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">425</text>
        </g>
        <line x1="2117" y1="295" x2="2117" y2="275" stroke="#d97706" stroke-width="1.3" stroke-dasharray="3,2"/>

        <!-- FIC-424 & PIC-403 on Purge Gas to Boiler -->
        <g class="pfd-ctrl-item cursor-pointer" data-loop="FIC-424" transform="translate(2300, 45)">
          <circle cx="17" cy="17" r="16" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
          <line x1="1" y1="17" x2="33" y2="17" stroke="#d97706" stroke-width="1"/>
          <text x="17" y="13" fill="#d97706" font-size="9" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">FIC</text>
          <text x="17" y="28" fill="#0f172a" font-size="9.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">424</text>
        </g>
        <line x1="2317" y1="79" x2="2317" y2="110" stroke="#d97706" stroke-width="1.3" stroke-dasharray="3,2"/>

        <g class="pfd-ctrl-item cursor-pointer" data-loop="PIC-403" transform="translate(2355, 45)">
          <circle cx="17" cy="17" r="16" fill="#ffffff" stroke="#10b981" stroke-width="2"/>
          <line x1="1" y1="17" x2="33" y2="17" stroke="#10b981" stroke-width="1"/>
          <text x="17" y="13" fill="#10b981" font-size="9" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">PIC</text>
          <text x="17" y="28" fill="#0f172a" font-size="9.5" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">403</text>
        </g>
        <line x1="2372" y1="79" x2="2372" y2="110" stroke="#10b981" stroke-width="1.3" stroke-dasharray="3,2"/>
      </g>

      <!-- ========================================== -->
      <!-- EQUIPMENT LAYER (STRICT SEQUENTIAL ORDER)  -->
      <!-- ========================================== -->
      <g id="pfd-synth-equipment">

        <!-- 0A. K-301: MAKE-UP & RECYCLE COMPRESSOR (COMBINED CASING) -->
        <!-- Top: Stage 4 (Make-Up Gas @ 240 kg/cm²G) -->
        <g class="pfd-eq-item" data-tag="K-301-ST4" transform="translate(40, 55)">
          <polygon points="0,5 65,15 65,45 0,55" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <line x1="32" y1="10" x2="32" y2="50" stroke="#0284c7" stroke-width="1.2" stroke-dasharray="3,2"/>
          <g transform="translate(-15, -42)">
            <rect class="pfd-eq-nameplate" width="105" height="36" rx="4"/>
            <text class="pfd-eq-tag-text" x="52.5" y="15" fill="#0284c7" font-size="11.5" text-anchor="middle">K-301 (St.4)</text>
            <text class="pfd-eq-name-ar" x="52.5" y="29" fill="#0f172a" font-size="8.5" text-anchor="middle">ضاغط غاز التعويض (240K)</text>
          </g>
        </g>

        <!-- Bottom: K-301 Recycle Wheel (عجلة تدوير غاز التفاعل) -->
        <g class="pfd-eq-item" data-tag="K-301-REC" transform="translate(40, 155)">
          <polygon points="0,5 65,15 65,45 0,55" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <circle cx="32" cy="30" r="14" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
          <path d="M 24 30 L 40 30 M 32 22 L 32 38" stroke="#0284c7" stroke-width="1.5"/>
          <g transform="translate(-15, 62)">
            <rect class="pfd-eq-nameplate" width="115" height="36" rx="4"/>
            <text class="pfd-eq-tag-text" x="57.5" y="15" fill="#0284c7" font-size="11.5" text-anchor="middle">K-301 (Recycle)</text>
            <text class="pfd-eq-name-ar" x="57.5" y="29" fill="#0f172a" font-size="8.5" text-anchor="middle">عجلة تدوير الغاز لـ E-407</text>
          </g>
        </g>

        <!-- 0B. E-315: MAKE-UP GAS COOLER (Tubes: Syngas 95°C -> 26°C | Shell: C.W. Cooling Water) -->
        <g class="pfd-eq-item" data-tag="E-315" transform="translate(140, 55)">
          <rect x="0" y="0" width="80" height="42" rx="4" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <!-- Tubes representation inside -->
          <line x1="5" y1="14" x2="75" y2="14" stroke="#0284c7" stroke-width="1.8" stroke-dasharray="4,2"/>
          <line x1="5" y1="28" x2="75" y2="28" stroke="#0284c7" stroke-width="1.8" stroke-dasharray="4,2"/>
          <!-- Shell C.W. badges -->
          <text x="40" y="22" fill="#0284c7" font-size="7.5" font-weight="900" font-family="'Cairo', sans-serif" text-anchor="middle">مياه C.W بالشيل</text>
          <g transform="translate(-15, -42)">
            <rect class="pfd-eq-nameplate" width="115" height="36" rx="4"/>
            <text class="pfd-eq-tag-text" x="57.5" y="15" fill="#0284c7" font-size="11.5" text-anchor="middle">E-315 (95°C➔26°C)</text>
            <text class="pfd-eq-name-ar" x="57.5" y="29" fill="#0f172a" font-size="8.5" text-anchor="middle">مبرد غاز التعويض (تيوب/شيل CW)</text>
          </g>
        </g>

        <!-- 0C. V-310: MAKE-UP GAS SEPARATOR (240 kg/cm²G @ 26°C) -->
        <g class="pfd-eq-item" data-tag="V-310" transform="translate(250, 50)">
          <path d="M 0 10 C 0 0, 45 0, 45 10 L 45 52 C 45 62, 0 62, 0 52 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <line x1="4" y1="42" x2="41" y2="42" stroke="#0284c7" stroke-dasharray="3,2"/>
          <g transform="translate(-25, -42)">
            <rect class="pfd-eq-nameplate" width="105" height="36" rx="4"/>
            <text class="pfd-eq-tag-text" x="52.5" y="15" fill="#0284c7" font-size="12" text-anchor="middle">V-310</text>
            <text class="pfd-eq-name-ar" x="52.5" y="29" fill="#0f172a" font-size="8.5" text-anchor="middle">فاصل غاز التعويض (26°C)</text>
          </g>
        </g>

        <!-- 1. R-401: AMMONIA SYNTHESIS CONVERTER (3 BEDS + SHROUD) -->
        <g class="pfd-eq-item" data-tag="R-401" transform="translate(360, 110)">
          <!-- Annulus Wall Shroud / Reactor Wall (جدار المفاعل) -->
          <rect x="-8" y="15" width="136" height="248" rx="8" fill="rgba(234, 88, 12, 0.06)" stroke="#ea580c" stroke-width="2" stroke-dasharray="5,3"/>
          <text x="60" y="12" fill="#ea580c" font-size="8.5" font-weight="900" font-family="'Cairo', sans-serif" text-anchor="middle">▲ جدار المفاعل (تبريد الغلاف بالغاز) ▲</text>

          <path d="M 0 25 C 0 0, 120 0, 120 25 Z" fill="url(#pfdDishTopGrad)" stroke="#0f172a" stroke-width="2"/>
          <rect x="0" y="25" width="120" height="230" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <path d="M 0 255 C 0 280, 120 280, 120 255 Z" fill="url(#pfdDishBotGrad)" stroke="#0f172a" stroke-width="2"/>
          
          <!-- Bed 1 (Top, 380°C Inlet) -->
          <rect x="10" y="45" width="100" height="42" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="1.4"/>
          <text x="60" y="70" fill="#b45309" font-size="10.5" font-weight="900" font-family="'Cairo', sans-serif" text-anchor="middle">BED 1 (مدخل 380°C)</text>

          <!-- Bed 2 (Middle, Quench TRC-403 to 420°C) -->
          <rect x="10" y="112" width="100" height="46" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="1.4"/>
          <text x="60" y="140" fill="#b45309" font-size="10.5" font-weight="900" font-family="'Cairo', sans-serif" text-anchor="middle">BED 2 (كوينش 420°C)</text>

          <!-- Bed 3 (Bottom, Quench TRC-404 to 430°C) -->
          <rect x="10" y="184" width="100" height="50" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="1.4"/>
          <text x="60" y="214" fill="#b45309" font-size="10.5" font-weight="900" font-family="'Cairo', sans-serif" text-anchor="middle">BED 3 (كوينش 430°C)</text>

          <!-- Reactor Nameplate -->
          <g transform="translate(-35, 290)">
            <rect class="pfd-eq-nameplate" width="190" height="48" rx="6"/>
            <text class="pfd-eq-tag-text" x="95" y="19" fill="#dc2626" font-size="16" text-anchor="middle">R-401 (440°C)</text>
            <text class="pfd-eq-name-ar" x="95" y="36" fill="#0f172a" font-size="11.5" text-anchor="middle">مفاعل تخليق الأمونيا (3 طبقات)</text>
          </g>
        </g>

        <!-- 1B. H-401 / 401-H: START-UP FIRED HEATER (مسخن بدء تشغيل المفاعل) -->
        <g class="pfd-eq-item cursor-pointer" data-tag="H-401" transform="translate(160, 410)">
          <!-- Foundation Skid & Support Pillars -->
          <rect x="5" y="122" width="100" height="8" rx="2" fill="#334155" stroke="#0f172a" stroke-width="1.5"/>
          <line x1="20" y1="130" x2="20" y2="142" stroke="#0f172a" stroke-width="3"/>
          <line x1="90" y1="130" x2="90" y2="142" stroke="#0f172a" stroke-width="3"/>
          <line x1="55" y1="130" x2="55" y2="142" stroke="#0f172a" stroke-width="3"/>

          <!-- Exhaust Flue Gas Stack (المدخنة) -->
          <path d="M 32 35 L 44 10 L 66 10 L 78 35 Z" fill="#475569" stroke="#0f172a" stroke-width="1.8"/>
          <!-- Chimney Cylinder -->
          <rect x="45" y="-22" width="20" height="32" rx="2" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <!-- Stack Damper & Rain Cap -->
          <rect x="41" y="-26" width="28" height="5" rx="1.5" fill="#334155" stroke="#0f172a" stroke-width="1.5"/>
          <line x1="55" y1="-12" x2="62" y2="-12" stroke="#dc2626" stroke-width="2"/>
          <circle cx="55" cy="-12" r="2" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
          <!-- Flue Gas Heat Waves / Plume -->
          <path d="M 50 -28 Q 46 -36 50 -44" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,2"/>
          <path d="M 60 -28 Q 64 -36 60 -44" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,2"/>

          <!-- Main Radiant & Convection Firebox Casing -->
          <rect x="10" y="35" width="90" height="87" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
          <!-- Refractory Lining Interior (البطانة العازلة المقاومة للحرارة) -->
          <rect x="14" y="39" width="82" height="79" rx="2" fill="#2d1305" stroke="#78350f" stroke-width="1.2"/>
          
          <!-- Convection Tube Bank (Finned section at top) -->
          <g opacity="0.85">
            <line x1="22" y1="46" x2="88" y2="46" stroke="#ea580c" stroke-width="1.5" stroke-dasharray="3,2"/>
            <line x1="22" y1="52" x2="88" y2="52" stroke="#ea580c" stroke-width="1.5" stroke-dasharray="3,2"/>
            <text x="55" y="44" fill="#fed7aa" font-size="6.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">قسم الحمل الحراري (Convection)</text>
          </g>

          <!-- Process Heating Coils (Serpentine U-Bends in Radiant Chamber) -->
          <g>
            <!-- Pass 1: from Right Inlet (x: 100, y: 85) to Left (x: 24, y: 85) -->
            <line x1="100" y1="85" x2="24" y2="85" stroke="#ef4444" stroke-width="2.6"/>
            <!-- U-bend Left -->
            <path d="M 24 85 A 7 7 0 0 1 24 71" fill="none" stroke="#ef4444" stroke-width="2.6"/>
            <!-- Pass 2: from Left to Right (x: 86, y: 71) -->
            <line x1="24" y1="71" x2="86" y2="71" stroke="#dc2626" stroke-width="2.6"/>
            <!-- U-bend Right -->
            <path d="M 86 71 A 7 7 0 0 0 86 57" fill="none" stroke="#dc2626" stroke-width="2.6"/>
            <!-- Pass 3: from Left to Right (x: 100, y: 57) to Outlet Nozzle -->
            <line x1="86" y1="57" x2="100" y2="57" stroke="#b91c1c" stroke-width="2.8"/>
          </g>

          <!-- Flanged Process Nozzles (Facing Right towards Manifold) -->
          <!-- Right Inlet Nozzle (connects to M 270 495) -->
          <rect x="100" y="80" width="10" height="10" fill="#475569" stroke="#0f172a" stroke-width="1.2"/>
          <rect x="108" y="77" width="4" height="16" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1"/>
          <!-- Right Outlet Nozzle (connects to M 270 467) -->
          <rect x="100" y="52" width="10" height="10" fill="#475569" stroke="#0f172a" stroke-width="1.2"/>
          <rect x="108" y="49" width="4" height="16" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1"/>

          <!-- Sight Glass / Peep Hole (عين مراقبة اللهب) -->
          <circle cx="55" cy="71" r="5" fill="#f59e0b" stroke="#78350f" stroke-width="1.5"/>
          <circle cx="55" cy="71" r="3" fill="#fef08a" opacity="0.8"/>

          <!-- Structural External Stiffener Ribs -->
          <line x1="30" y1="35" x2="30" y2="122" stroke="#0f172a" stroke-width="1.2"/>
          <line x1="80" y1="35" x2="80" y2="122" stroke="#0f172a" stroke-width="1.2"/>

          <!-- Bottom Gas Burners Array & Luminous Flames (الشعلات واللهب) -->
          <g id="h401-burners">
            <!-- Burner 1 (Left) -->
            <rect x="25" y="116" width="12" height="6" fill="#64748b" stroke="#0f172a" stroke-width="1"/>
            <path d="M 27 116 Q 31 96 31 98 Q 35 116 35 116 Z" fill="#ef4444"/>
            <path d="M 29 116 Q 31 103 31 105 Q 33 116 33 116 Z" fill="#fef08a"/>

            <!-- Burner 2 (Center) -->
            <rect x="49" y="116" width="12" height="6" fill="#64748b" stroke="#0f172a" stroke-width="1"/>
            <path d="M 51 116 Q 55 93 55 95 Q 59 116 59 116 Z" fill="#f97316"/>
            <path d="M 53 116 Q 55 100 55 102 Q 57 116 57 116 Z" fill="#fef08a"/>

            <!-- Burner 3 (Right) -->
            <rect x="73" y="116" width="12" height="6" fill="#64748b" stroke="#0f172a" stroke-width="1"/>
            <path d="M 75 116 Q 79 96 79 98 Q 83 116 83 116 Z" fill="#ef4444"/>
            <path d="M 77 116 Q 79 103 79 105 Q 81 116 81 116 Z" fill="#fef08a"/>
          </g>

          <!-- Fuel Gas Supply Manifold (خط وقود الغاز الطبيعي) -->
          <line x1="20" y1="135" x2="90" y2="135" stroke="#f59e0b" stroke-width="2"/>
          <line x1="31" y1="122" x2="31" y2="135" stroke="#f59e0b" stroke-width="1.5"/>
          <line x1="55" y1="122" x2="55" y2="135" stroke="#f59e0b" stroke-width="1.5"/>
          <line x1="79" y1="122" x2="79" y2="135" stroke="#f59e0b" stroke-width="1.5"/>
          <!-- Fuel Gas Valve -->
          <polygon points="10,132 18,138 10,138 18,132" fill="#f59e0b" stroke="#0f172a" stroke-width="0.8"/>
          <text x="14" y="146" fill="#b45309" font-size="6.5" font-weight="bold" font-family="'Cairo', sans-serif" text-anchor="middle">Fuel Gas</text>

          <!-- Professional Equipment Nameplate & Industrial Data Card -->
          <g transform="translate(-35, 155)">
            <rect class="pfd-eq-nameplate" width="180" height="52" rx="6"/>
            <!-- Equipment Tag -->
            <text class="pfd-eq-tag-text" x="90" y="17" fill="#ea580c" font-size="13.5" text-anchor="middle">H-401 (401-H)</text>
            <!-- Arabic Name -->
            <text class="pfd-eq-name-ar" x="90" y="32" fill="#0f172a" font-size="9.5" text-anchor="middle">مسخن بدء تشغيل المفاعل (Fired Heater)</text>
            <!-- Standby / Isolation Badge -->
            <rect x="15" y="38" width="150" height="11" rx="2" fill="#fef3c7" stroke="#f59e0b" stroke-width="0.8"/>
            <text x="90" y="46.5" fill="#b45309" font-size="7.5" font-weight="900" font-family="'Cairo', sans-serif" text-anchor="middle">معزول أثناء الإنتاج الطبيعي (STANDBY)</text>
          </g>
        </g>

        <!-- ======================================================= -->
        <!-- THE FOUR CONSECUTIVE EFFLUENT EXCHANGERS:               -->
        <!-- E-401 -> E-402 -> E-403 -> E-404 -> V-401               -->
        <!-- ======================================================= -->

        <!-- 2. E-401: CONVERTER INTERCHANGER (1st Cooler: 440°C -> 336°C) -->
        ${renderShellAndTubeSVG({
          tag: 'E-401',
          nameAr: 'مبادل مخرج المفاعل (المبرد 1)',
          temaType: 'TEMA BEM',
          tagColor: '#dc2626',
          x: 540,
          y: 260,
          width: 120,
          height: 46,
          tubeSide: {
            fluidAr: 'غاز تفاعل ساخن من قعر المفاعل',
            tempIn: '440°C',
            tempOut: '336°C',
            color: '#dc2626',
            inPos: 'bottom-left',
            outPos: 'top-right',
            inBadgeText: 'دخول التيوب 440°C من قعر المفاعل',
            outBadgeText: 'خروج التيوب 336°C لـ E-402',
          },
          shellSide: {
            fluidAr: 'غاز تغذية قادم من جدار المفاعل',
            tempIn: '155°C',
            tempOut: '410°C',
            color: '#ea580c',
            inPos: 'top',
            outPos: 'bottom',
            inOffsetX: 0.28,
            outOffsetX: 0.72,
            inBadgeText: 'دخول الشيل (من جدار المفاعل 155°C)',
            outBadgeText: 'خروج الشيل 410°C (للهيتر / بايباص)',
          },
        })}

        <!-- 3. E-402: BFW PREHEATER (2nd Cooler: 336°C -> 196°C) -->
        ${renderShellAndTubeSVG({
          tag: 'E-402',
          nameAr: 'مسخن مياه المراجل BFW (المبرد 2)',
          temaType: 'TEMA AEM',
          tagColor: '#ea580c',
          x: 710,
          y: 260,
          width: 120,
          height: 46,
          tubeSide: {
            fluidAr: 'غاز تفاعل مبرد',
            tempIn: '336°C',
            tempOut: '196°C',
            color: '#ea580c',
            inPos: 'top-left',
            outPos: 'bottom-right',
            inBadgeText: 'دخول التيوب 336°C',
            outBadgeText: 'خروج التيوب 196°C',
          },
          shellSide: {
            fluidAr: 'ماء تغذية المراجل BFW',
            tempIn: '105°C',
            tempOut: '190°C',
            color: '#0284c7',
            inPos: 'bottom',
            outPos: 'top',
            inOffsetX: 0.28,
            outOffsetX: 0.72,
            inBadgeText: 'دخول ماء BFW للشيل',
            outBadgeText: 'خروج BFW مسخن لـ V-102',
          },
        })}

        <!-- 4. E-403: FEED PREHEATER (3rd Cooler: 196°C -> 93°C) -->
        ${renderShellAndTubeSVG({
          tag: 'E-403',
          nameAr: 'مسخن الغاز المغذي (المبرد 3)',
          temaType: 'TEMA BEU',
          tagColor: '#d97706',
          x: 880,
          y: 260,
          width: 120,
          height: 46,
          tubeSide: {
            fluidAr: 'غاز تفاعل مبرد من E-402',
            tempIn: '196°C',
            tempOut: '93°C',
            color: '#d97706',
            inPos: 'bottom-left',
            outPos: 'top-right',
            inBadgeText: 'دخول التيوب 196°C من E-402',
            outBadgeText: 'خروج التيوب 93°C لـ E-404',
          },
          shellSide: {
            fluidAr: 'غاز بارد راجع من تيوب E-407',
            tempIn: '30°C',
            tempOut: '148°C',
            color: '#0284c7',
            inPos: 'bottom',
            outPos: 'top',
            inOffsetX: 0.28,
            outOffsetX: 0.72,
            inBadgeText: 'دخول الشيل (+30°C من تيوب E-407)',
            outBadgeText: 'خروج الشيل 148°C لجدار المفاعل',
          },
        })}

        <!-- 5. E-404: WATER CONDENSER (4th Cooler: 93°C -> 40°C) -->
        ${renderShellAndTubeSVG({
          tag: 'E-404A/B',
          nameAr: 'المكثف المائي للأمونيا (المبرد 4)',
          temaType: 'TEMA AEM',
          tagColor: '#0284c7',
          x: 1050,
          y: 260,
          width: 120,
          height: 46,
          tubeSide: {
            fluidAr: 'مزيج غاز/سائل الأمونيا',
            tempIn: '93°C',
            tempOut: '40°C',
            color: '#0284c7',
            inPos: 'top-left',
            outPos: 'axial-right',
            inBadgeText: 'دخول التيوب 93°C',
            outBadgeText: 'خروج التيوب 40°C لـ V-401',
          },
          shellSide: {
            fluidAr: 'مياه تبريد C.W',
            tempIn: '32°C',
            tempOut: '42°C',
            color: '#0284c7',
            inPos: 'bottom',
            outPos: 'top',
            inOffsetX: 0.28,
            outOffsetX: 0.72,
            inBadgeText: 'دخول مياه تبريد C.W',
            outBadgeText: 'رجوع مياه C.W',
          },
        })}

        <!-- 6. V-401: PRIMARY SEPARATOR (Separates liquid at 40°C) -->
        <g class="pfd-eq-item" data-tag="V-401" transform="translate(1240, 210)">
          <path d="M 0 15 C 0 0, 70 0, 70 15 L 70 135 C 70 150, 0 150, 0 135 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <line x1="5" y1="110" x2="65" y2="110" stroke="#0284c7" stroke-dasharray="3,2"/>
          <g transform="translate(-45, -50)">
            <rect class="pfd-eq-nameplate" width="160" height="44" rx="6"/>
            <text class="pfd-eq-tag-text" x="80" y="17" fill="#0284c7" font-size="14" text-anchor="middle">V-401</text>
            <text class="pfd-eq-name-ar" x="80" y="33" fill="#0f172a" font-size="11" text-anchor="middle">الفاصل الأولي (40°C / 214K)</text>
          </g>
        </g>

        <!-- ======================================================= -->
        <!-- CHILLING & SECONDARY SEPARATION BATTERY                 -->
        <!-- E-407 -> E-405 -> E-406 -> V-402                        -->
        <!-- ======================================================= -->

        <!-- 7. E-407: COLD EXCHANGER (Gas-Gas Heat Recovery - AT CHILLING HEAD) -->
        ${renderShellAndTubeSVG({
          tag: 'E-407',
          nameAr: 'المبادل البارد (استرجاع البرودة)',
          temaType: 'TEMA BEU',
          tagColor: '#0284c7',
          x: 1410,
          y: 260,
          width: 120,
          height: 46,
          tubeSide: {
            fluidAr: 'غاز تدوير بارد راجع من قمة V-402',
            tempIn: '-10°C',
            tempOut: '+30°C',
            color: '#2563eb',
            inPos: 'axial-left',
            outPos: 'bottom-right',
            inBadgeText: 'دخول التيوب -10°C من قمة V-402',
            outBadgeText: 'خروج التيوب +30°C لشيل E-403',
          },
          shellSide: {
            fluidAr: 'غاز التدوير الساخن من طرد K-301 Recycle',
            tempIn: '40°C',
            tempOut: '26.5°C',
            color: '#0284c7',
            inPos: 'top',
            outPos: 'axial-right',
            inOffsetX: 0.3,
            inBadgeText: 'دخول الشيل من طرد K-301 Recycle',
            outBadgeText: 'خروج الشيل 26.5°C لتيوب E-405',
          },
        })}

        <!-- 8. E-405: PRIMARY AMMONIA CHILLER (+8°C) -->
        ${renderShellAndTubeSVG({
          tag: 'E-405',
          nameAr: 'مبرد الأمونيا الأولي (+8°C)',
          temaType: 'TEMA BKU',
          tagColor: '#2563eb',
          x: 1580,
          y: 260,
          width: 120,
          height: 46,
          tubeSide: {
            fluidAr: 'غاز تفاعل مبرد',
            tempIn: '26.5°C',
            tempOut: '14.0°C',
            color: '#0284c7',
            inPos: 'axial-left',
            outPos: 'axial-right',
            inBadgeText: 'دخول التيوب 26.5°C',
            outBadgeText: 'خروج التيوب 14.0°C لـ E-406',
          },
          shellSide: {
            fluidAr: 'أمونيا تثليج غالية (+8°C)',
            tempIn: '+8°C',
            tempOut: '+8°C',
            color: '#2563eb',
            inPos: 'bottom',
            outPos: 'top',
            inOffsetX: 0.3,
            outOffsetX: 0.7,
            inBadgeText: 'تغذية NH3 سائلة (+8°C)',
            outBadgeText: 'بخار NH3 إلى V-407',
          },
        })}

        <!-- 9. E-406: SECONDARY AMMONIA CHILLER (-10°C) -->
        ${renderShellAndTubeSVG({
          tag: 'E-406',
          nameAr: 'مبرد الأمونيا العميق (-10°C)',
          temaType: 'TEMA BKU',
          tagColor: '#1d4ed8',
          x: 1780,
          y: 260,
          width: 120,
          height: 46,
          tubeSide: {
            fluidAr: 'غاز تفاعل مبرد عميق',
            tempIn: '14.0°C',
            tempOut: '-10.0°C',
            color: '#2563eb',
            inPos: 'axial-left',
            outPos: 'axial-right',
            inBadgeText: 'دخول التيوب 14.0°C',
            outBadgeText: 'خروج التيوب -10.0°C لـ V-402',
          },
          shellSide: {
            fluidAr: 'أمونيا تثليج غالية (-10°C)',
            tempIn: '-10°C',
            tempOut: '-10°C',
            color: '#1e40af',
            inPos: 'bottom',
            outPos: 'top',
            inOffsetX: 0.3,
            outOffsetX: 0.7,
            inBadgeText: 'تغذية NH3 سائلة (-10°C)',
            outBadgeText: 'بخار NH3 إلى V-406',
          },
        })}

        <!-- 10. V-402: SECONDARY SEPARATOR (Separates liquid at -10°C) -->
        <g class="pfd-eq-item" data-tag="V-402" transform="translate(1930, 210)">
          <path d="M 0 15 C 0 0, 70 0, 70 15 L 70 135 C 70 150, 0 150, 0 135 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <line x1="5" y1="110" x2="65" y2="110" stroke="#2563eb" stroke-dasharray="3,2"/>
          <g transform="translate(-45, -50)">
            <rect class="pfd-eq-nameplate" width="160" height="44" rx="6"/>
            <text class="pfd-eq-tag-text" x="80" y="17" fill="#2563eb" font-size="14" text-anchor="middle">V-402 (-10°C)</text>
            <text class="pfd-eq-name-ar" x="80" y="33" fill="#0f172a" font-size="11" text-anchor="middle">الفاصل الثانوي (فصل NH3 السائلة)</text>
          </g>
        </g>

        <!-- ======================================================= -->
        <!-- PURGE GAS TRAIN: E-408, V-403, E-416                    -->
        <!-- ======================================================= -->
        <!-- E-408: Purge Condenser -->
        ${renderShellAndTubeSVG({
          tag: 'E-408',
          nameAr: 'مكثف غاز التطهير Purge',
          temaType: 'TEMA BEM',
          tagColor: '#d97706',
          x: 2060,
          y: 200,
          width: 100,
          height: 42,
          tubeSide: {
            fluidAr: 'غاز تطهير غني بـ NH3',
            tempIn: '40°C',
            tempOut: '-25°C',
            color: '#d97706',
            inPos: 'axial-left',
            outPos: 'axial-right',
            inBadgeText: 'دخول غاز التطهير 40°C',
            outBadgeText: 'خروج الغاز المكثف لـ V-403',
          },
          shellSide: {
            fluidAr: 'أمونيا تثليج (-33°C)',
            tempIn: '-33°C',
            tempOut: '-33°C',
            color: '#1d4ed8',
            inPos: 'bottom',
            outPos: 'top',
            inOffsetX: 0.3,
            outOffsetX: 0.7,
            inBadgeText: 'تغذية سائل NH3 (-33°C)',
            outBadgeText: 'بخار تثليج إلى V-405',
          },
        })}

        <!-- V-403: Purge Separator -->
        <g class="pfd-eq-item" data-tag="V-403" transform="translate(2190, 190)">
          <path d="M 0 12 C 0 0, 55 0, 55 12 L 55 75 C 55 87, 0 87, 0 75 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-45, -50)">
            <rect class="pfd-eq-nameplate" width="145" height="44" rx="6"/>
            <text class="pfd-eq-tag-text" x="72.5" y="17" fill="#d97706" font-size="14" text-anchor="middle">V-403</text>
            <text class="pfd-eq-name-ar" x="72.5" y="33" fill="#0f172a" font-size="10.5" text-anchor="middle">فاصل غاز التطهير (-25°C)</text>
          </g>
        </g>

        <!-- E-416: Purge Heater (Heated by Steam S-3 to 150°C) -->
        ${renderShellAndTubeSVG({
          tag: 'E-416A/B/C',
          nameAr: 'مسخن غاز التطهير (بخار S-3)',
          temaType: 'TEMA BEM',
          tagColor: '#d97706',
          x: 2270,
          y: 200,
          width: 100,
          height: 42,
          tubeSide: {
            fluidAr: 'غاز تطهير غير متفاعل (وقود)',
            tempIn: '-25°C',
            tempOut: '150°C',
            color: '#d97706',
            inPos: 'axial-left',
            outPos: 'axial-right',
            inBadgeText: 'دخول غاز بارد -25°C',
            outBadgeText: 'خروج غاز ساخن 150°C للوقود',
          },
          shellSide: {
            fluidAr: 'بخار منخفض الضغط (S-3)',
            tempIn: '160°C',
            tempOut: '140°C',
            color: '#f59e0b',
            inPos: 'top',
            outPos: 'bottom',
            inOffsetX: 0.3,
            outOffsetX: 0.7,
            inBadgeText: 'دخول بخار S-3 للشيل',
            outBadgeText: 'خروج متكاثف البخار Condensate',
          },
        })}

        <!-- ======================================================= -->
        <!-- LETDOWN TANK & VENT GAS (MIDDLE DECK)                   -->
        <!-- ======================================================= -->
        <!-- V-409: LET DOWN TANK (18 kg/cm²) -->
        <g class="pfd-eq-item" data-tag="V-409" transform="translate(1150, 560)">
          <rect x="0" y="0" width="160" height="65" rx="18" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <line x1="12" y1="38" x2="148" y2="38" stroke="#7c3aed" stroke-dasharray="3,2"/>
          <g transform="translate(-10, 75)">
            <rect class="pfd-eq-nameplate" width="180" height="46" rx="6"/>
            <text class="pfd-eq-tag-text" x="90" y="18" fill="#7c3aed" font-size="14" text-anchor="middle">V-409 (18 kg/cm²)</text>
            <text class="pfd-eq-name-ar" x="90" y="34" fill="#0f172a" font-size="11" text-anchor="middle">خزان خفض الضغط والوميض Flash</text>
          </g>
        </g>

        <!-- E-409: Vent Condenser -->
        ${renderShellAndTubeSVG({
          tag: 'E-409',
          nameAr: 'مكثف غاز التنفيس Flash Vent',
          temaType: 'TEMA BEM',
          tagColor: '#0284c7',
          x: 1390,
          y: 555,
          width: 100,
          height: 42,
          tubeSide: {
            fluidAr: 'غاز وميض V-409',
            tempIn: '18°C',
            tempOut: '-25°C',
            color: '#d97706',
            inPos: 'axial-left',
            outPos: 'axial-right',
            inBadgeText: 'دخول غاز الوميض 18°C',
            outBadgeText: 'خروج الغاز المكثف لـ V-404',
          },
          shellSide: {
            fluidAr: 'أمونيا تثليج (-33°C)',
            tempIn: '-33°C',
            tempOut: '-33°C',
            color: '#1d4ed8',
            inPos: 'bottom',
            outPos: 'top',
            inOffsetX: 0.3,
            outOffsetX: 0.7,
            inBadgeText: 'تغذية سائل NH3 (-33°C)',
            outBadgeText: 'بخار تثليج إلى V-405',
          },
        })}

        <!-- V-404: Vent Separator -->
        <g class="pfd-eq-item" data-tag="V-404" transform="translate(1530, 550)">
          <path d="M 0 10 C 0 0, 55 0, 55 10 L 55 70 C 55 80, 0 80, 0 70 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <g transform="translate(-45, 85)">
            <rect class="pfd-eq-nameplate" width="145" height="44" rx="6"/>
            <text class="pfd-eq-tag-text" x="72.5" y="17" fill="#0284c7" font-size="14" text-anchor="middle">V-404</text>
            <text class="pfd-eq-name-ar" x="72.5" y="33" fill="#0f172a" font-size="10.5" text-anchor="middle">فاصل غاز التنفيس (-25°C)</text>
          </g>
        </g>

        <!-- ======================================================= -->
        <!-- REFRIGERATION MACHINERY (LOWER DECK)                    -->
        <!-- ======================================================= -->
        <!-- 3-STAGE REFRIGERATION SUCTION TOWER (V-407, V-406, V-405) -->
        <g class="pfd-eq-item" data-tag="V-407" transform="translate(80, 640)">
          <!-- V-407: Stage 3 (+8°C, 4.6 kg/cm²) -->
          <rect x="0" y="0" width="110" height="65" rx="5" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <text x="55" y="38" fill="#0284c7" font-size="12" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">V-407 (+8°C/4.6K)</text>
          
          <!-- V-406: Stage 2 (-10°C, 2.5 kg/cm²) -->
          <rect x="0" y="75" width="110" height="65" rx="5" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <text x="55" y="113" fill="#2563eb" font-size="12" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">V-406 (-10°C/2.5K)</text>
          
          <!-- V-405: Stage 1 (-32°C, 0.1 kg/cm²) -->
          <rect x="0" y="150" width="110" height="65" rx="5" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <text x="55" y="188" fill="#1d4ed8" font-size="12" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">V-405 (-32°C/0.1K)</text>

          <g transform="translate(-30, 225)">
            <rect class="pfd-eq-nameplate" width="170" height="46" rx="6"/>
            <text class="pfd-eq-tag-text" x="85" y="18" fill="#7c3aed" font-size="14" text-anchor="middle">V-405 / 406 / 407</text>
            <text class="pfd-eq-name-ar" x="85" y="34" fill="#0f172a" font-size="11" text-anchor="middle">برج فواصل سحب التثليج</text>
          </g>
        </g>

        <!-- K-401T: STEAM TURBINE DRIVER -->
        <g class="pfd-eq-item" data-tag="K-401T" transform="translate(300, 750)">
          <polygon points="10,0 75,12 75,68 10,80" fill="url(#pfdTurbineGrad)" stroke="#0f172a" stroke-width="2"/>
          <g transform="translate(-30, 90)">
            <rect class="pfd-eq-nameplate" width="145" height="44" rx="6"/>
            <text class="pfd-eq-tag-text" x="72.5" y="17" fill="#dc2626" font-size="14" text-anchor="middle">K-401T</text>
            <text class="pfd-eq-name-ar" x="72.5" y="33" fill="#0f172a" font-size="10.5" text-anchor="middle">توربين ضاغط التثليج البخاري</text>
          </g>
        </g>

        <!-- K-401: 2-CASING REFRIGERATION COMPRESSOR -->
        <g class="pfd-eq-item" data-tag="K-401" transform="translate(420, 745)">
          <polygon points="10,10 65,18 65,62 10,70" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <polygon points="75,14 130,20 130,60 75,66" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1.8"/>
          <line x1="65" y1="40" x2="75" y2="40" stroke="#0f172a" stroke-width="3"/>
          <g transform="translate(-20, 85)">
            <rect class="pfd-eq-nameplate" width="175" height="46" rx="6"/>
            <text class="pfd-eq-tag-text" x="87.5" y="18" fill="#7c3aed" font-size="14" text-anchor="middle">K-401 (LP / HP)</text>
            <text class="pfd-eq-name-ar" x="87.5" y="34" fill="#0f172a" font-size="11" text-anchor="middle">ضاغط تثليج الأمونيا (17 kg/cm²)</text>
          </g>
        </g>

        <!-- E-412: AMMONIA CONDENSER (17 kg/cm², 105.6°C -> 43°C) -->
        ${renderShellAndTubeSVG({
          tag: 'E-412A/B/C',
          nameAr: 'مكثف وسيط التثليج المائي (43°C)',
          temaType: 'TEMA AEM',
          tagColor: '#0284c7',
          x: 630,
          y: 735,
          width: 120,
          height: 46,
          tubeSide: {
            fluidAr: 'مياه تبريد C.W',
            tempIn: '32°C',
            tempOut: '42°C',
            color: '#0284c7',
            inPos: 'bottom-left',
            outPos: 'top-right',
            inBadgeText: 'دخول مياه التبريد C.W',
            outBadgeText: 'رجوع مياه التبريد C.W',
          },
          shellSide: {
            fluidAr: 'بخار وسيط التثليج K-401',
            tempIn: '105.6°C',
            tempOut: '43°C',
            color: '#7c3aed',
            inPos: 'top',
            outPos: 'bottom',
            inOffsetX: 0.28,
            outOffsetX: 0.72,
            inBadgeText: 'دخول بخار NH3 من K-401',
            outBadgeText: 'سائل NH3 مكثف إلى V-408',
          },
        })}

        <!-- V-408: REFRIGERANT RECEIVER (Feeds E-405, E-408, E-409, V-407) -->
        <g class="pfd-eq-item" data-tag="V-408" transform="translate(830, 735)">
          <rect x="0" y="0" width="150" height="65" rx="18" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <line x1="12" y1="38" x2="138" y2="38" stroke="#7c3aed" stroke-dasharray="3,2"/>
          <g transform="translate(-15, 75)">
            <rect class="pfd-eq-nameplate" width="180" height="46" rx="6"/>
            <text class="pfd-eq-tag-text" x="90" y="18" fill="#7c3aed" font-size="14" text-anchor="middle">V-408 (16.5 kg/cm²)</text>
            <text class="pfd-eq-name-ar" x="90" y="34" fill="#0f172a" font-size="11" text-anchor="middle">مستقبل وخزان وسيط التثليج</text>
          </g>
        </g>

        <!-- P-401A/B: AMMONIA PRODUCT PUMPS (Suction from V-405 @ -33°C) -->
        <g class="pfd-eq-item" data-tag="P-401A/B" transform="translate(1040, 755)">
          <circle cx="35" cy="35" r="28" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2"/>
          <circle cx="35" cy="35" r="14" fill="url(#pfdMotorGrad)" stroke="#0f172a" stroke-width="1.5"/>
          <rect x="25" y="2" width="12" height="10" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="1"/>
          <!-- Suction inlet flange on pump bottom -->
          <rect x="28" y="60" width="14" height="8" fill="#7c3aed" stroke="#0f172a" stroke-width="1.2"/>
          <!-- Discharge outlet flange on pump right -->
          <rect x="58" y="28" width="8" height="14" fill="#7c3aed" stroke="#0f172a" stroke-width="1.2"/>
          <g transform="translate(-50, 75)">
            <rect class="pfd-eq-nameplate" width="170" height="46" rx="6"/>
            <text class="pfd-eq-tag-text" x="85" y="18" fill="#7c3aed" font-size="14" text-anchor="middle">P-401 A/B</text>
            <text class="pfd-eq-name-ar" x="85" y="34" fill="#0f172a" font-size="11" text-anchor="middle">مضخات منتج الأمونيا (-33°C)</text>
          </g>
        </g>

        <!-- 14. V-451 B: REFRIGERATED AMMONIA STORAGE TANK (-33°C @ 0.04 kg/cm²G) -->
        <g class="pfd-eq-item" data-tag="V-451 B" transform="translate(1260, 680)">
          <!-- Foundation Base Pad -->
          <rect x="0" y="170" width="230" height="15" rx="3" fill="#334155" stroke="#0f172a" stroke-width="1.8"/>
          <line x1="5" y1="177" x2="225" y2="177" stroke="#475569" stroke-width="1.5" stroke-dasharray="6,4"/>
          
          <!-- Outer Cryogenic Tank Shell with Dome Roof -->
          <path d="M 10 38 C 10 8, 220 8, 220 38 L 220 170 L 10 170 Z" fill="url(#pfdSteelGrad)" stroke="#0f172a" stroke-width="2.2"/>
          
          <!-- Insulation Jacket / Double Wall Outline -->
          <rect x="22" y="44" width="186" height="122" rx="4" fill="#0f172a" fill-opacity="0.03" stroke="#7c3aed" stroke-width="1.4" stroke-dasharray="4,3"/>
          
          <!-- Liquid Ammonia Content (-33°C) Pool -->
          <rect x="24" y="85" width="182" height="81" fill="#7c3aed" fill-opacity="0.28"/>
          <line x1="24" y1="85" x2="206" y2="85" stroke="#7c3aed" stroke-width="2.2" stroke-dasharray="5,2"/>
          
          <!-- Tank Status & Fluid Text Inside -->
          <text x="115" y="125" fill="#581c87" font-size="12" font-weight="900" font-family="'Cairo', sans-serif" text-anchor="middle">أمونيا سائلة مبردة (-33°C)</text>
          <text x="115" y="145" fill="#475569" font-size="9.5" font-weight="800" font-family="'IBM Plex Mono', monospace" text-anchor="middle">سعة 20,000 طن متري</text>

          <!-- Top Dome Relief / Nitrogen Inbreathing Vent -->
          <path d="M 115 12 L 115 2 L 135 2" fill="none" stroke="#0f172a" stroke-width="1.8"/>
          
          <!-- Spiral Ladder / Tank Shell Ribs -->
          <path d="M 14 165 L 40 135 L 14 105 L 40 75 L 20 45" fill="none" stroke="#64748b" stroke-width="1.4"/>
          
          <!-- Level Transmitter & Gauge on Tank Side -->
          <line x1="212" y1="55" x2="212" y2="165" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="212" cy="110" r="9" fill="#ffffff" stroke="#7c3aed" stroke-width="1.8"/>
          <text x="212" y="113" fill="#7c3aed" font-size="7.5" font-weight="bold" font-family="'IBM Plex Mono', monospace" text-anchor="middle">LT</text>

          <!-- Inlet Liquid Nozzle (From P-401 A/B Discharge) -->
          <rect x="3" y="100" width="10" height="14" fill="#7c3aed" stroke="#0f172a" stroke-width="1.4"/>
          
          <!-- Equipment Nameplate -->
          <g transform="translate(5, -50)">
            <rect class="pfd-eq-nameplate" width="220" height="46" rx="6"/>
            <text class="pfd-eq-tag-text" x="110" y="18" fill="#7c3aed" font-size="14.5" text-anchor="middle">V-451 B (-33°C)</text>
            <text class="pfd-eq-name-ar" x="110" y="34" fill="#0f172a" font-size="11" text-anchor="middle">خزان الأمونيا المبردة الجوي الرئيسي</text>
          </g>
        </g>

      </g>
    </g>
  `;
}
