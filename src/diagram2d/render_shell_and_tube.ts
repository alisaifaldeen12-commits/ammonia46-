/**
 * render_shell_and_tube.ts
 * Industrial Shell-and-Tube Heat Exchanger Vector Renderer
 * Authentic TEMA design:
 * - Cylindrical outer shell with weld lines and specular highlight
 * - Dished channel heads (Stationary head & Floating/Rear head)
 * - Girth flanges with gasket line and bolt circle studs
 * - Multi-pass internal tube bundle with fluid color coding
 * - Alternating segmental cross-flow baffles (حواجز التوجيه المقطعية)
 * - Flanged process nozzles with WNRF flanges and clean connection points
 * - Clear, non-overlapping process nameplate and compact specification card
 */

export interface ShellAndTubeConfig {
  tag: string;
  nameAr: string;
  temaType: string;
  tagColor: string;
  x: number;
  y: number;
  width?: number; // default: 120 (for horiz) or 65 (for vert)
  height?: number; // default: 46 (for horiz) or 160 (for vert)
  orientation?: 'horizontal' | 'vertical';
  // Tube side specifications
  tubeSide: {
    fluidAr: string;
    tempIn: string;
    tempOut: string;
    color: string;
    inPos: 'bottom-left' | 'top-left' | 'axial-left' | 'axial-right' | 'top-mid' | 'bottom-mid' | 'axial-top' | 'axial-bottom' | 'top-right' | 'bottom-right';
    outPos: 'bottom-right' | 'top-right' | 'axial-right' | 'axial-left' | 'top-mid' | 'bottom-mid' | 'axial-top' | 'axial-bottom' | 'bottom-left' | 'top-left';
    inBadgeText?: string;
    outBadgeText?: string;
  };
  // Shell side specifications
  shellSide: {
    fluidAr: string;
    tempIn: string;
    tempOut: string;
    color: string;
    inPos: 'top' | 'bottom' | 'axial-left' | 'left' | 'right';
    outPos: 'top' | 'bottom' | 'axial-right' | 'left' | 'right';
    inOffsetX?: number; // 0..1 relative to shell width/height
    outOffsetX?: number; // 0..1 relative to shell width/height
    inBadgeText?: string;
    outBadgeText?: string;
  };
}

export function renderShellAndTubeSVG(config: ShellAndTubeConfig): string {
  const isVert = config.orientation === 'vertical';
  const W = config.width || (isVert ? 65 : 120);
  const H = config.height || (isVert ? 160 : 46);

  if (isVert) {
    // Vertical Shell and Tube Exchanger
    const HH = 18; // Head height
    const FH = 4.5; // Flange height
    const SY = HH + FH * 2; // Shell start Y
    const SH = H - 2 * (HH + FH * 2); // Shell height
    const EY = SY + SH; // Shell end Y

    // Tube Nozzles (Vertical)
    let tubeInNozzleSvg = '';
    if (config.tubeSide.inPos === 'axial-top' || config.tubeSide.inPos === 'top-mid') {
      tubeInNozzleSvg = `
        <g class="tube-in-nozzle">
          <rect x="${W / 2 - 6}" y="-16" width="12" height="16" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
          <rect x="${W / 2 - 9}" y="-20" width="18" height="5" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        </g>`;
    } else if (config.tubeSide.inPos === 'top-left') {
      tubeInNozzleSvg = `
        <g class="tube-in-nozzle">
          <rect x="-16" y="4" width="16" height="12" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
          <rect x="-20" y="2" width="5" height="16" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        </g>`;
    }

    let tubeOutNozzleSvg = '';
    if (config.tubeSide.outPos === 'axial-bottom' || config.tubeSide.outPos === 'bottom-mid') {
      tubeOutNozzleSvg = `
        <g class="tube-out-nozzle">
          <rect x="${W / 2 - 6}" y="${H}" width="12" height="16" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
          <rect x="${W / 2 - 9}" y="${H + 15}" width="18" height="5" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        </g>`;
    } else if (config.tubeSide.outPos === 'bottom-right') {
      tubeOutNozzleSvg = `
        <g class="tube-out-nozzle">
          <rect x="${W}" y="${H - 16}" width="16" height="12" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
          <rect x="${W + 15}" y="${H - 18}" width="5" height="16" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        </g>`;
    }

    // Shell Nozzles (Vertical)
    let shellInNozzleSvg = '';
    const sinY = SY + SH * (config.shellSide.inOffsetX !== undefined ? config.shellSide.inOffsetX : 0.25);
    if (config.shellSide.inPos === 'left') {
      shellInNozzleSvg = `
        <g class="shell-in-nozzle">
          <rect x="-16" y="${sinY - 6}" width="16" height="12" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
          <rect x="-20" y="${sinY - 9}" width="5" height="18" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        </g>`;
    } else if (config.shellSide.inPos === 'right') {
      shellInNozzleSvg = `
        <g class="shell-in-nozzle">
          <rect x="${W}" y="${sinY - 6}" width="16" height="12" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
          <rect x="${W + 15}" y="${sinY - 9}" width="5" height="18" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        </g>`;
    }

    let shellOutNozzleSvg = '';
    const soutY = SY + SH * (config.shellSide.outOffsetX !== undefined ? config.shellSide.outOffsetX : 0.75);
    if (config.shellSide.outPos === 'left') {
      shellOutNozzleSvg = `
        <g class="shell-out-nozzle">
          <rect x="-16" y="${soutY - 6}" width="16" height="12" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
          <rect x="-20" y="${soutY - 9}" width="5" height="18" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        </g>`;
    } else if (config.shellSide.outPos === 'right') {
      shellOutNozzleSvg = `
        <g class="shell-out-nozzle">
          <rect x="${W}" y="${soutY - 6}" width="16" height="12" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
          <rect x="${W + 15}" y="${soutY - 9}" width="5" height="18" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        </g>`;
    }

    return `
      <g class="pfd-eq-item cursor-pointer" data-tag="${config.tag}" transform="translate(${config.x}, ${config.y})">
        <!-- Vertical Shell & Tube Structure -->
        <g id="exchanger-body-${config.tag}">
          <!-- Top Dished Channel Head -->
          <path d="M 4 ${SY - FH * 2} C 4 ${SY - FH * 2 - HH}, ${W - 4} ${SY - FH * 2 - HH}, ${W - 4} ${SY - FH * 2} Z" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="2"/>
          
          <!-- Top Girth Flanges -->
          <rect x="0" y="${SY - FH * 2}" width="${W}" height="${FH}" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
          <rect x="0" y="${SY - FH}" width="${W}" height="${FH}" rx="1" fill="#475569" stroke="#0f172a" stroke-width="1.2"/>
          
          <!-- Main Vertical Shell -->
          <rect x="3" y="${SY}" width="${W - 6}" height="${SH}" rx="2" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="2"/>
          
          <!-- Vertical Tubes -->
          <line x1="${W * 0.25}" y1="${SY + 2}" x2="${W * 0.25}" y2="${EY - 2}" stroke="${config.tubeSide.color}" stroke-width="1.8" stroke-dasharray="6,2"/>
          <line x1="${W * 0.5}" y1="${SY + 2}" x2="${W * 0.5}" y2="${EY - 2}" stroke="${config.tubeSide.color}" stroke-width="1.8" stroke-dasharray="6,2"/>
          <line x1="${W * 0.75}" y1="${SY + 2}" x2="${W * 0.75}" y2="${EY - 2}" stroke="${config.tubeSide.color}" stroke-width="1.8" stroke-dasharray="6,2"/>
          
          <!-- Horizontal Baffles in Shell -->
          <line x1="3" y1="${SY + SH * 0.2}" x2="${W - 14}" y2="${SY + SH * 0.2}" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
          <line x1="14" y1="${SY + SH * 0.4}" x2="${W - 3}" y2="${SY + SH * 0.4}" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
          <line x1="3" y1="${SY + SH * 0.6}" x2="${W - 14}" y2="${SY + SH * 0.6}" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
          <line x1="14" y1="${SY + SH * 0.8}" x2="${W - 3}" y2="${SY + SH * 0.8}" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
          
          <!-- Bottom Girth Flanges -->
          <rect x="0" y="${EY}" width="${W}" height="${FH}" rx="1" fill="#475569" stroke="#0f172a" stroke-width="1.2"/>
          <rect x="0" y="${EY + FH}" width="${W}" height="${FH}" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
          
          <!-- Bottom Dished Head -->
          <path d="M 4 ${EY + FH * 2} C 4 ${EY + FH * 2 + HH}, ${W - 4} ${EY + FH * 2 + HH}, ${W - 4} ${EY + FH * 2} Z" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="2"/>
        </g>

        <!-- Nozzles -->
        ${tubeInNozzleSvg}
        ${tubeOutNozzleSvg}
        ${shellInNozzleSvg}
        ${shellOutNozzleSvg}

        <!-- Top Equipment Nameplate -->
        <g transform="translate(${W / 2 - 70}, -44)">
          <rect class="pfd-eq-nameplate" width="140" height="34" rx="5" fill="#ffffff" stroke="${config.tagColor}" stroke-width="1.8"/>
          <text class="pfd-eq-tag-text" x="70" y="14" fill="${config.tagColor}" font-size="12" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">${config.tag}</text>
          <text class="pfd-eq-name-ar" x="70" y="27" fill="#0f172a" font-size="8.5" font-weight="800" font-family="'Cairo', sans-serif" text-anchor="middle">${config.nameAr}</text>
        </g>
      </g>
    `;
  }

  // Geometry dimensions
  const HW = 18; // Head width
  const FW = 4.5; // Flange width
  const SX = HW + FW * 2; // Shell start X
  const SW = W - 2 * (HW + FW * 2); // Shell width
  const EX = SX + SW; // Shell end X

  // 1. Tube nozzles geometry (Clean flanged nozzles without bulky overlapping text boxes)
  let tubeInNozzleSvg = '';
  if (config.tubeSide.inPos === 'bottom-left') {
    const nx = SX - FW * 2 - 6;
    tubeInNozzleSvg = `
      <g class="tube-in-nozzle">
        <rect x="${nx - 6}" y="${H - 3}" width="12" height="15" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
        <rect x="${nx - 9}" y="${H + 10}" width="18" height="4.5" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="${nx - 5}" cy="${H + 12}" r="1" fill="#e2e8f0"/>
        <circle cx="${nx + 5}" cy="${H + 12}" r="1" fill="#e2e8f0"/>
      </g>`;
  } else if (config.tubeSide.inPos === 'top-left') {
    const nx = SX - FW * 2 - 6;
    tubeInNozzleSvg = `
      <g class="tube-in-nozzle">
        <rect x="${nx - 6}" y="-12" width="12" height="15" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
        <rect x="${nx - 9}" y="-15" width="18" height="4.5" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="${nx - 5}" cy="-13" r="1" fill="#e2e8f0"/>
        <circle cx="${nx + 5}" cy="-13" r="1" fill="#e2e8f0"/>
      </g>`;
  } else if (config.tubeSide.inPos === 'axial-left') {
    const ny = H / 2;
    tubeInNozzleSvg = `
      <g class="tube-in-nozzle">
        <rect x="-16" y="${ny - 6}" width="16" height="12" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
        <rect x="-20" y="${ny - 9}" width="5" height="18" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="-18" cy="${ny - 5}" r="1" fill="#e2e8f0"/>
        <circle cx="-18" cy="${ny + 5}" r="1" fill="#e2e8f0"/>
      </g>`;
  } else if (config.tubeSide.inPos === 'top-mid') {
    const nx = W / 2;
    tubeInNozzleSvg = `
      <g class="tube-in-nozzle">
        <rect x="${nx - 6}" y="-12" width="12" height="15" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
        <rect x="${nx - 9}" y="-15" width="18" height="4.5" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="${nx - 5}" cy="-13" r="1" fill="#e2e8f0"/>
        <circle cx="${nx + 5}" cy="-13" r="1" fill="#e2e8f0"/>
      </g>`;
  }

  let tubeOutNozzleSvg = '';
  if (config.tubeSide.outPos === 'top-right') {
    const nx = EX + FW * 2 + 6;
    tubeOutNozzleSvg = `
      <g class="tube-out-nozzle">
        <rect x="${nx - 6}" y="-12" width="12" height="15" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
        <rect x="${nx - 9}" y="-15" width="18" height="4.5" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="${nx - 5}" cy="-13" r="1" fill="#e2e8f0"/>
        <circle cx="${nx + 5}" cy="-13" r="1" fill="#e2e8f0"/>
      </g>`;
  } else if (config.tubeSide.outPos === 'bottom-right') {
    const nx = EX + FW * 2 + 6;
    tubeOutNozzleSvg = `
      <g class="tube-out-nozzle">
        <rect x="${nx - 6}" y="${H - 3}" width="12" height="15" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
        <rect x="${nx - 9}" y="${H + 10}" width="18" height="4.5" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="${nx - 5}" cy="${H + 12}" r="1" fill="#e2e8f0"/>
        <circle cx="${nx + 5}" cy="${H + 12}" r="1" fill="#e2e8f0"/>
      </g>`;
  } else if (config.tubeSide.outPos === 'axial-right') {
    const ny = H / 2;
    tubeOutNozzleSvg = `
      <g class="tube-out-nozzle">
        <rect x="${W}" y="${ny - 6}" width="16" height="12" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
        <rect x="${W + 15}" y="${ny - 9}" width="5" height="18" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="${W + 17}" cy="${ny - 5}" r="1" fill="#e2e8f0"/>
        <circle cx="${W + 17}" cy="${ny + 5}" r="1" fill="#e2e8f0"/>
      </g>`;
  } else if (config.tubeSide.outPos === 'bottom-mid') {
    const nx = W / 2;
    tubeOutNozzleSvg = `
      <g class="tube-out-nozzle">
        <rect x="${nx - 6}" y="${H - 3}" width="12" height="15" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
        <rect x="${nx - 9}" y="${H + 10}" width="18" height="4.5" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="${nx - 5}" cy="${H + 12}" r="1" fill="#e2e8f0"/>
        <circle cx="${nx + 5}" cy="${H + 12}" r="1" fill="#e2e8f0"/>
      </g>`;
  }

  // 2. Shell nozzles geometry
  let shellInNozzleSvg = '';
  const sinX = SX + SW * (config.shellSide.inOffsetX !== undefined ? config.shellSide.inOffsetX : 0.28);
  if (config.shellSide.inPos === 'bottom') {
    shellInNozzleSvg = `
      <g class="shell-in-nozzle">
        <rect x="${sinX - 6}" y="${H - 3}" width="12" height="15" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
        <rect x="${sinX - 9}" y="${H + 10}" width="18" height="4.5" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="${sinX - 5}" cy="${H + 12}" r="1" fill="#e2e8f0"/>
        <circle cx="${sinX + 5}" cy="${H + 12}" r="1" fill="#e2e8f0"/>
      </g>`;
  } else if (config.shellSide.inPos === 'top') {
    shellInNozzleSvg = `
      <g class="shell-in-nozzle">
        <rect x="${sinX - 6}" y="-12" width="12" height="15" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
        <rect x="${sinX - 9}" y="-15" width="18" height="4.5" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="${sinX - 5}" cy="-13" r="1" fill="#e2e8f0"/>
        <circle cx="${sinX + 5}" cy="-13" r="1" fill="#e2e8f0"/>
      </g>`;
  } else if (config.shellSide.inPos === 'axial-left') {
    const ny = H / 2;
    shellInNozzleSvg = `
      <g class="shell-in-nozzle">
        <rect x="-16" y="${ny - 6}" width="16" height="12" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
        <rect x="-20" y="${ny - 9}" width="5" height="18" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="-18" cy="${ny - 5}" r="1" fill="#e2e8f0"/>
        <circle cx="-18" cy="${ny + 5}" r="1" fill="#e2e8f0"/>
      </g>`;
  }

  let shellOutNozzleSvg = '';
  const soutX = SX + SW * (config.shellSide.outOffsetX !== undefined ? config.shellSide.outOffsetX : 0.72);
  if (config.shellSide.outPos === 'top') {
    shellOutNozzleSvg = `
      <g class="shell-out-nozzle">
        <rect x="${soutX - 6}" y="-12" width="12" height="15" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
        <rect x="${soutX - 9}" y="-15" width="18" height="4.5" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="${soutX - 5}" cy="-13" r="1" fill="#e2e8f0"/>
        <circle cx="${soutX + 5}" cy="-13" r="1" fill="#e2e8f0"/>
      </g>`;
  } else if (config.shellSide.outPos === 'bottom') {
    shellOutNozzleSvg = `
      <g class="shell-out-nozzle">
        <rect x="${soutX - 6}" y="${H - 3}" width="12" height="15" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
        <rect x="${soutX - 9}" y="${H + 10}" width="18" height="4.5" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="${soutX - 5}" cy="${H + 12}" r="1" fill="#e2e8f0"/>
        <circle cx="${soutX + 5}" cy="${H + 12}" r="1" fill="#e2e8f0"/>
      </g>`;
  } else if (config.shellSide.outPos === 'axial-right') {
    const ny = H / 2;
    shellOutNozzleSvg = `
      <g class="shell-out-nozzle">
        <rect x="${W}" y="${ny - 6}" width="16" height="12" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="1.3"/>
        <rect x="${W + 15}" y="${ny - 9}" width="5" height="18" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="${W + 17}" cy="${ny - 5}" r="1" fill="#e2e8f0"/>
        <circle cx="${W + 17}" cy="${ny + 5}" r="1" fill="#e2e8f0"/>
      </g>`;
  }

  return `
    <g class="pfd-eq-item cursor-pointer" data-tag="${config.tag}" transform="translate(${config.x}, ${config.y})">
      <!-- Outer Shell & Tube Structure -->
      <g id="exchanger-body-${config.tag}">
        
        <!-- Dual Welded Saddle Supports underneath -->
        <polygon points="${SX + SW * 0.2 - 7},${H - 3} ${SX + SW * 0.2 - 10},${H + 8} ${SX + SW * 0.2 + 10},${H + 8} ${SX + SW * 0.2 + 7},${H - 3}" fill="#334155" stroke="#0f172a" stroke-width="1"/>
        <line x1="${SX + SW * 0.2 - 12}" y1="${H + 8}" x2="${SX + SW * 0.2 + 12}" y2="${H + 8}" stroke="#0f172a" stroke-width="2"/>
        
        <polygon points="${SX + SW * 0.8 - 7},${H - 3} ${SX + SW * 0.8 - 10},${H + 8} ${SX + SW * 0.8 + 10},${H + 8} ${SX + SW * 0.8 + 7},${H - 3}" fill="#334155" stroke="#0f172a" stroke-width="1"/>
        <line x1="${SX + SW * 0.8 - 12}" y1="${H + 8}" x2="${SX + SW * 0.8 + 12}" y2="${H + 8}" stroke="#0f172a" stroke-width="2"/>

        <!-- Stationary Channel Head (Left Dished Bonnet) -->
        <path d="M ${SX - FW * 2} 4 C ${SX - FW * 2 - HW} 4, ${SX - FW * 2 - HW} ${H - 4}, ${SX - FW * 2} ${H - 4} Z" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="2"/>

        <!-- Left Girth Flanges (Tube-Sheet Joint) -->
        <rect x="${SX - FW * 2}" y="0" width="${FW}" height="${H}" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <line x1="${SX - FW}" y1="0" x2="${SX - FW}" y2="${H}" stroke="#94a3b8" stroke-width="1"/>
        <rect x="${SX - FW}" y="0" width="${FW}" height="${H}" rx="1" fill="#475569" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="${SX - FW * 1.5}" cy="5" r="1" fill="#cbd5e1"/>
        <circle cx="${SX - FW * 1.5}" cy="${H / 2}" r="1" fill="#cbd5e1"/>
        <circle cx="${SX - FW * 1.5}" cy="${H - 5}" r="1" fill="#cbd5e1"/>

        <!-- Main Cylindrical Shell Barrel -->
        <rect x="${SX}" y="3" width="${SW}" height="${H - 6}" rx="2" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="2"/>
        <line x1="${SX}" y1="${H / 2}" x2="${EX}" y2="${H / 2}" stroke="#64748b" stroke-width="0.8" stroke-dasharray="6,4" opacity="0.6"/>

        <!-- Internal Tube Bundle Passages (Visually Highlighting Tube Fluid) -->
        <line x1="${SX + 2}" y1="12" x2="${EX - 2}" y2="12" stroke="${config.tubeSide.color}" stroke-width="1.6" stroke-dasharray="5,2"/>
        <line x1="${SX + 2}" y1="20" x2="${EX - 2}" y2="20" stroke="${config.tubeSide.color}" stroke-width="1.6" stroke-dasharray="5,2"/>
        <line x1="${SX + 2}" y1="28" x2="${EX - 2}" y2="28" stroke="${config.tubeSide.color}" stroke-width="1.6" stroke-dasharray="5,2"/>
        <line x1="${SX + 2}" y1="36" x2="${EX - 2}" y2="36" stroke="${config.tubeSide.color}" stroke-width="1.6" stroke-dasharray="5,2"/>

        <!-- Alternating Segmental Cross-Flow Baffles (حواجز توجيه الشيل) -->
        <line x1="${SX + SW * 0.22}" y1="3" x2="${SX + SW * 0.22}" y2="${H - 12}" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="${SX + SW * 0.44}" y1="12" x2="${SX + SW * 0.44}" y2="${H - 3}" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="${SX + SW * 0.66}" y1="3" x2="${SX + SW * 0.66}" y2="${H - 12}" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="${SX + SW * 0.85}" y1="12" x2="${SX + SW * 0.85}" y2="${H - 3}" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>

        <!-- Right Girth Flanges (Rear Tube-Sheet Joint) -->
        <rect x="${EX}" y="0" width="${FW}" height="${H}" rx="1" fill="#475569" stroke="#0f172a" stroke-width="1.2"/>
        <line x1="${EX + FW}" y1="0" x2="${EX + FW}" y2="${H}" stroke="#94a3b8" stroke-width="1"/>
        <rect x="${EX + FW}" y="0" width="${FW}" height="${H}" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="${EX + FW * 0.5}" cy="5" r="1" fill="#cbd5e1"/>
        <circle cx="${EX + FW * 0.5}" cy="${H / 2}" r="1" fill="#cbd5e1"/>
        <circle cx="${EX + FW * 0.5}" cy="${H - 5}" r="1" fill="#cbd5e1"/>

        <!-- Floating / Rear Dished Head -->
        <path d="M ${EX + FW * 2} 4 C ${EX + FW * 2 + HW} 4, ${EX + FW * 2 + HW} ${H - 4}, ${EX + FW * 2} ${H - 4} Z" fill="url(#pfdExchangerShellGrad)" stroke="#0f172a" stroke-width="2"/>
      </g>

      <!-- Flanged Nozzles -->
      ${tubeInNozzleSvg}
      ${tubeOutNozzleSvg}
      ${shellInNozzleSvg}
      ${shellOutNozzleSvg}

      <!-- Top Equipment Nameplate with Clean Margin -->
      <g transform="translate(${W / 2 - 75}, -44)">
        <rect class="pfd-eq-nameplate" width="150" height="34" rx="5" fill="#ffffff" stroke="${config.tagColor}" stroke-width="1.8"/>
        <text class="pfd-eq-tag-text" x="75" y="14" fill="${config.tagColor}" font-size="12" font-weight="900" font-family="'IBM Plex Mono', monospace" text-anchor="middle">${config.tag}</text>
        <text class="pfd-eq-name-ar" x="75" y="27" fill="#0f172a" font-size="8.5" font-weight="800" font-family="'Cairo', sans-serif" text-anchor="middle">${config.nameAr}</text>
      </g>
    </g>
  `;
}
