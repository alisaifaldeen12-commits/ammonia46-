import * as THREE from 'three';

/**
 * Procedural texture generator for industrial carbon steel, metallic panels,
 * floor tiles, ceiling grid, screens, and control room instruments.
 */

// 1. Weathered Industrial Carbon Steel Texture (High Fidelity PBR)
export function createCarbonSteelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Base metallic dark carbon steel gradient
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, '#3a4148');
  grad.addColorStop(0.25, '#2e353c');
  grad.addColorStop(0.5, '#252a2f');
  grad.addColorStop(0.75, '#2c3238');
  grad.addColorStop(1, '#383e45');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. High density micro-noise and steel grain
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 26;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise + 2)); // Subtle cold industrial steel tint
  }
  ctx.putImageData(imgData, 0, 0);

  // 3. Fine anisotropic brushed steel streaks
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 1024; y += 3) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y + (Math.random() - 0.5) * 6);
    ctx.stroke();
  }

  // 4. Industrial steel plate weld lines & bevels
  ctx.strokeStyle = 'rgba(15, 18, 22, 0.7)';
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, 1008, 1008);
  ctx.beginPath();
  ctx.moveTo(0, 512);
  ctx.lineTo(1024, 512);
  ctx.moveTo(512, 0);
  ctx.lineTo(512, 1024);
  ctx.stroke();

  // Subtle highlight on weld seams
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, 1004, 1004);
  ctx.beginPath();
  ctx.moveTo(0, 514);
  ctx.lineTo(1024, 514);
  ctx.moveTo(514, 0);
  ctx.lineTo(514, 1024);
  ctx.stroke();

  // 5. Heavy duty hex bolt / rivet patterns along plates
  ctx.fillStyle = '#181b1f';
  for (let x = 32; x < 1024; x += 48) {
    // Top & Bottom rows
    ctx.beginPath();
    ctx.arc(x, 22, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, 1002, 4, 0, Math.PI * 2);
    ctx.fill();
    // Center divider row
    ctx.beginPath();
    ctx.arc(x, 502, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let y = 32; y < 1024; y += 48) {
    // Left & Right columns
    ctx.beginPath();
    ctx.arc(22, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1002, y, 4, 0, Math.PI * 2);
    ctx.fill();
    // Center vertical divider
    ctx.beginPath();
    ctx.arc(502, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. Control Room Epoxy Floor Tile Texture
export function createFloorTileTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Light grey terrazzo / epoxy tile base
  ctx.fillStyle = '#b0b8b2';
  ctx.fillRect(0, 0, 512, 512);

  // Speckle noise for terrazzo floor effect
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 2 + 1;
    const shade = Math.random() > 0.5 ? '#7a827c' : '#d8deda';
    ctx.fillStyle = shade;
    ctx.fillRect(x, y, size, size);
  }

  // Tile grout lines (64x64 tiles)
  ctx.strokeStyle = '#5a625d';
  ctx.lineWidth = 2;
  for (let x = 0; x <= 512; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 3. Control Room Ceiling Acoustic Tile Texture
export function createCeilingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#dbe0d8';
  ctx.fillRect(0, 0, 512, 512);

  // Acoustic dots
  ctx.fillStyle = '#a8b0a6';
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Metal grid gridlines
  ctx.strokeStyle = '#808882';
  ctx.lineWidth = 4;
  for (let x = 0; x <= 512; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 4. Vintage Green Panel Texture (Reference Image 1 - Japanese Mitsubishi / Yokogawa DCS Style)
export function createVintageGreenPanelTexture(title: string = 'AMMONIA PANEL', secId: string = 'II'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Retro industrial sage green color
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#8aa285');
  grad.addColorStop(0.5, '#789173');
  grad.addColorStop(1, '#627a5d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Section specific controller dictionary
  const secData: Record<string, { tags: Array<{ name: string; val: string; pv: string; unit: string }>; mim: string }> = {
    'I': {
      tags: [
        { name: 'PICA-151', val: '54.0', pv: '54.2', unit: 'Bar' },
        { name: 'TICA-152', val: '312', pv: '310', unit: '°C' },
        { name: 'LICA-155', val: '65.2', pv: '65.0', unit: '%' },
        { name: 'FRCA-153', val: '85.0', pv: '84.8', unit: 't/h' }
      ],
      mim: 'BFW → STEAM DRUM → DEAERATOR'
    },
    'II': {
      tags: [
        { name: 'PICA-101', val: '24.5', pv: '24.5', unit: 'Bar' },
        { name: 'FRQA-101', val: '42500', pv: '42480', unit: 'Nm³/h' },
        { name: 'TA-102', val: '820', pv: '822', unit: '°C' },
        { name: 'TRA-121', val: '380', pv: '379', unit: '°C' }
      ],
      mim: 'NG FEED → REFORMER H-101 → SYNGAS'
    },
    'III': {
      tags: [
        { name: 'FRCA-103', val: '105.0', pv: '104.8', unit: 't/h' },
        { name: 'TA-121', val: '315', pv: '316', unit: '°C' },
        { name: 'ARA-101', val: '0.20', pv: '0.19', unit: '% CO' },
        { name: 'ARA-122', val: '5.0', pv: '4.8', unit: 'ppm' }
      ],
      mim: 'CO SHIFT → METHANATOR R-106'
    },
    'IV': {
      tags: [
        { name: 'FRCA-201', val: '950', pv: '948', unit: 'm³/h' },
        { name: 'LRC-202', val: '55.4', pv: '55.0', unit: '%' },
        { name: 'PICA-206', val: '1.25', pv: '1.24', unit: 'Bar' },
        { name: 'TICA-203', val: '118', pv: '117.8', unit: '°C' }
      ],
      mim: 'CO2 ABSORBER C-101 → CATACARB'
    },
    'V': {
      tags: [
        { name: 'FRCA-502', val: '22000', pv: '21950', unit: 'Nm³/h' },
        { name: 'PRCA-504', val: '28.0', pv: '28.1', unit: 'Bar' },
        { name: 'SR-501', val: '9562', pv: '9560', unit: 'RPM' },
        { name: 'VIB-501', val: '12.4', pv: '12.1', unit: 'µm' }
      ],
      mim: 'CO2 COMPRESSOR K-501 (4 STAGES)'
    },
    'VI': {
      tags: [
        { name: 'FRCA-301', val: '68000', pv: '67900', unit: 'Nm³/h' },
        { name: 'PRCA-301', val: '32.0', pv: '31.9', unit: 'Bar' },
        { name: 'SR-301', val: '10450', pv: '10450', unit: 'RPM' },
        { name: 'SR-311', val: '8900', pv: '8905', unit: 'RPM' }
      ],
      mim: 'PROCESS AIR K-302 & NG K-303'
    },
    'VII': {
      tags: [
        { name: 'FRCA-331', val: '145000', pv: '144800', unit: 'Nm³/h' },
        { name: 'LICA-408', val: '48.5', pv: '48.2', unit: '%' },
        { name: 'SR-331', val: '11774', pv: '11774', unit: 'RPM' },
        { name: 'PR-332', val: '160.0', pv: '159.5', unit: 'Bar' }
      ],
      mim: 'SYNGAS COMPRESSOR K-301 → 160 BAR'
    },
    'VIII': {
      tags: [
        { name: 'PFR-100', val: '485.0', pv: '485.2', unit: '°C (BED-1)' },
        { name: 'PFR-101', val: '465.0', pv: '464.8', unit: '°C (BED-2)' },
        { name: 'PIC-100', val: '155.0', pv: '154.8', unit: 'Bar (TEE-100)' },
        { name: 'LIC-100', val: '62.4', pv: '62.0', unit: '% (V-100)' }
      ],
      mim: 'PFR-100/101/102 → E-104 → V-100 → K-100 → V-101'
    },
    'IX': {
      tags: [
        { name: 'FRCA-421', val: '1250', pv: '1248', unit: 't/d' },
        { name: 'TICA-421', val: '-33.5', pv: '-33.4', unit: '°C' },
        { name: 'FRQ-425', val: '52.4', pv: '52.2', unit: 't/h' },
        { name: 'A1CA-791', val: '8.5', pv: '8.5', unit: 'pH' }
      ],
      mim: 'CRYOGENIC NH3 STORAGE TK-101 (-33°C)'
    }
  };

  const currentSec = secData[secId] || secData['VIII'];

  // Japanese Panel Header Plate (Top Black & Gold Metal Sign)
  ctx.fillStyle = '#111913';
  ctx.fillRect(16, 16, 480, 54);
  ctx.strokeStyle = '#f5a800';
  ctx.lineWidth = 3;
  ctx.strokeRect(18, 18, 476, 50);

  ctx.fillStyle = '#00e5aa';
  ctx.font = 'bold 20px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`AMMONIA — ${secId}`, 256, 40);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText(title.substring(0, 42), 256, 58);

  // Render 4 Controller Faceplates (Yokogawa / Foxboro DCS Single-Loop Controller Modules)
  const tagBoxW = 112;
  const tagBoxH = 135;
  const tagStartY = 78;

  for (let i = 0; i < 4; i++) {
    const tData = currentSec.tags[i] || { name: `TAG-${secId}0${i+1}`, val: '100', pv: '99', unit: 'PV' };
    const bx = 24 + i * 118;

    // Outer Controller Frame
    ctx.fillStyle = '#222923';
    ctx.fillRect(bx, tagStartY, tagBoxW, tagBoxH);
    ctx.strokeStyle = '#556a52';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, tagStartY, tagBoxW, tagBoxH);

    // Metal Nameplate Tag Header
    ctx.fillStyle = '#0c140d';
    ctx.fillRect(bx + 4, tagStartY + 4, tagBoxW - 8, 24);
    ctx.strokeStyle = '#f5a800';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx + 4, tagStartY + 4, tagBoxW - 8, 24);

    ctx.fillStyle = '#00e5aa';
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(tData.name, bx + tagBoxW / 2, tagStartY + 20);

    // Bargraph Indicator
    ctx.fillStyle = '#111111';
    ctx.fillRect(bx + 8, tagStartY + 32, 16, 70);
    ctx.fillStyle = '#00ff66';
    const barH = Math.min(65, Math.max(10, (parseFloat(tData.pv) % 100) * 0.65));
    ctx.fillRect(bx + 10, tagStartY + 32 + (65 - barH), 12, barH);

    // Digital LED Readout Box
    ctx.fillStyle = '#050a06';
    ctx.fillRect(bx + 28, tagStartY + 32, tagBoxW - 34, 42);
    ctx.strokeStyle = '#00e5aa';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx + 28, tagStartY + 32, tagBoxW - 34, 42);

    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(tData.pv, bx + tagBoxW - 6, tagStartY + 50);

    ctx.fillStyle = '#88aa99';
    ctx.font = '9px sans-serif';
    ctx.fillText(tData.unit, bx + tagBoxW - 6, tagStartY + 68);

    // SV / PV setpoint text
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '9px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SV:${tData.val}`, bx + 8, tagStartY + 116);
    ctx.fillText(`AUTO`, bx + 8, tagStartY + 128);

    // Mode status LED
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(bx + tagBoxW - 12, tagStartY + 122, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Row 2: Analog Meters with explicit variable titles & tick marks (y: 222 to 340)
  const meterY = 270;
  const meterR = 38;
  for (let m = 0; m < 3; m++) {
    const mx = 80 + m * 176;

    // Meter Housing
    ctx.fillStyle = '#182019';
    ctx.beginPath();
    ctx.arc(mx, meterY, meterR + 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c0c0c0';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Dial Face
    ctx.fillStyle = '#fdfdf7';
    ctx.beginPath();
    ctx.arc(mx, meterY, meterR, 0, Math.PI * 2);
    ctx.fill();

    // Red warning sector
    ctx.beginPath();
    ctx.arc(mx, meterY, meterR - 4, -Math.PI * 0.2, Math.PI * 0.25);
    ctx.lineTo(mx, meterY);
    ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';
    ctx.fill();

    // Tick marks & Needle
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1.5;
    for (let a = -Math.PI * 0.75; a <= Math.PI * 0.75; a += Math.PI * 0.25) {
      const tx1 = mx + Math.cos(a) * (meterR - 8);
      const ty1 = meterY + Math.sin(a) * (meterR - 8);
      const tx2 = mx + Math.cos(a) * meterR;
      const ty2 = meterY + Math.sin(a) * meterR;
      ctx.beginPath();
      ctx.moveTo(tx1, ty1);
      ctx.lineTo(tx2, ty2);
      ctx.stroke();
    }

    // Needle pointing to green zone
    const needleAngle = -Math.PI * 0.25 + m * 0.3;
    const nx = mx + Math.cos(needleAngle) * (meterR - 6);
    const ny = meterY + Math.sin(needleAngle) * (meterR - 6);
    ctx.strokeStyle = '#cc0000';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(mx, meterY);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    // Center pivot
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(mx, meterY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Meter Title Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    const meterTitles = [
      `PV-1: ${currentSec.tags[0]?.name || 'PRESS'}`,
      `PV-2: ${currentSec.tags[1]?.name || 'TEMP'}`,
      `PV-3: ${currentSec.tags[2]?.name || 'FLOW'}`
    ];
    ctx.fillText(meterTitles[m], mx, meterY + meterR + 16);
  }

  // Row 3: Mini Mimic Diagram & Chart Recorder (y: 345 to 445)
  ctx.fillStyle = '#0b130c';
  ctx.fillRect(20, 350, 472, 90);
  ctx.strokeStyle = '#3d523b';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 350, 472, 90);

  // Mimic schematic title & flow line
  ctx.fillStyle = '#00e5aa';
  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`MIMIC FLOWSHEET: ${currentSec.mim}`, 28, 368);

  // Flow line & vessel symbols
  ctx.strokeStyle = '#ffaa00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(30, 405);
  ctx.lineTo(130, 405);
  ctx.lineTo(160, 385);
  ctx.lineTo(250, 385);
  ctx.lineTo(280, 415);
  ctx.lineTo(470, 415);
  ctx.stroke();

  // Vessel icons
  ctx.fillStyle = '#1e382b';
  ctx.fillRect(130, 390, 36, 30);
  ctx.strokeStyle = '#00e5aa';
  ctx.strokeRect(130, 390, 36, 30);

  ctx.fillRect(250, 370, 36, 30);
  ctx.strokeRect(250, 370, 36, 30);

  // Labels on vessels
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(secId === 'VIII' ? 'PFR-100' : 'VESSEL-1', 148, 408);
  ctx.fillText(secId === 'VIII' ? 'V-100' : 'VESSEL-2', 268, 388);

  // Panel borders & screws
  ctx.strokeStyle = '#4e614a';
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, 500, 500);

  ctx.strokeStyle = '#a8bca3';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, 492, 492);

  // Screws at corners
  ctx.fillStyle = '#2f3b2c';
  [
    [20, 20],
    [492, 20],
    [20, 492],
    [492, 492],
  ].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 4b. Flow Label Billboard Texture (For 3D Liquid and Gas arrows)
export function createFlowLabelTexture(label: string, isLiquid: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = isLiquid ? 'rgba(0, 40, 70, 0.92)' : 'rgba(70, 30, 0, 0.92)';
  ctx.fillRect(0, 0, 384, 96);

  ctx.strokeStyle = isLiquid ? '#00c8ef' : '#ffaa00';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 376, 88);

  ctx.fillStyle = isLiquid ? '#00e5aa' : '#ffcc00';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const prefix = isLiquid ? '💧 LIQUID [سائل]: ' : '⛽ GAS [غاز]: ';
  ctx.fillText(`${prefix}${label}`, 192, 48);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 5. Annunciator Warning Lights Grid Texture
export function createAnnunciatorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#181f19';
  ctx.fillRect(0, 0, 512, 256);

  const cols = 8;
  const rows = 4;
  const cellW = 512 / cols;
  const cellH = 256 / rows;

  const labels = [
    'R-101 TRIP',
    'H-101 HI T',
    'K-301 TRIP',
    'PA-110 LL',
    'K-302 ALARM',
    'C-101 HI L',
    'E-103 LO P',
    'SYSTEM OK',
    'FRQA-101 L',
    'TA-105 HH',
    'PA-111 LL',
    'K-101 STOP',
    'PA-113 HH',
    'PA-322 LL',
    'LA-158 LL',
    'PA-108 LL',
    'K-501 TRIP',
    'R-106 S/D',
    'K-401 TRIP',
    'V-405 HI L',
    'P-101A RUN',
    'P-102B TRIP',
    'TK-101 OK',
    'FLARE ON',
    'GEN POWER',
    'UPS NORMAL',
    'ESD READY',
    'FIRE ALARM',
    'GAS DETECT',
    'STEAM DRUM',
    'COOL TWR',
    'SUMMARY',
  ];

  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW;
      const y = r * cellH;

      // Cell box
      ctx.fillStyle = idx % 5 === 1 ? '#ffdede' : idx % 7 === 2 ? '#fffae0' : '#f0f5ee';
      ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 2);

      ctx.strokeStyle = '#222';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, cellW, cellH);

      // Label text
      ctx.fillStyle = idx % 5 === 1 ? '#990000' : idx % 7 === 2 ? '#996600' : '#1a291d';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[idx] || 'ANNUNCIATOR', x + cellW / 2, y + cellH / 2);

      idx++;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 6. DCS Screen Screen Content Texture (Reference Image 2)
export function createDCSMonitorTexture(title: string, tag: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d')!;

  // Screen dark background
  ctx.fillStyle = '#06111a';
  ctx.fillRect(0, 0, 512, 384);

  // Top header bar
  ctx.fillStyle = '#0f2938';
  ctx.fillRect(0, 0, 512, 28);
  ctx.fillStyle = '#00e5aa';
  ctx.font = 'bold 13px Courier New, monospace';
  ctx.fillText(`[DCS SCREEN] - ${title.toUpperCase()}`, 10, 19);

  ctx.fillStyle = '#f5a800';
  ctx.fillText('STATUS: ONLINE', 380, 19);

  // Grid lines
  ctx.strokeStyle = '#122a3b';
  ctx.lineWidth = 1;
  for (let x = 0; x < 512; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 28);
    ctx.lineTo(x, 384);
    ctx.stroke();
  }
  for (let y = 28; y < 384; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Draw simulated P&ID diagram lines & vessels on screen
  ctx.strokeStyle = '#00c8ef';
  ctx.lineWidth = 3;

  // Vessels
  ctx.fillStyle = '#0a2233';
  ctx.fillRect(60, 80, 70, 160);
  ctx.strokeRect(60, 80, 70, 160);

  ctx.fillStyle = '#00e5aa';
  ctx.font = 'bold 12px Courier New';
  ctx.fillText('R-101', 75, 160);

  ctx.fillStyle = '#0a2233';
  ctx.beginPath();
  ctx.arc(260, 160, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f5a800';
  ctx.fillText('K-301', 242, 165);

  ctx.fillStyle = '#0a2233';
  ctx.fillRect(380, 60, 80, 220);
  ctx.strokeRect(380, 60, 80, 220);
  ctx.fillStyle = '#00c8ef';
  ctx.fillText('C-101', 400, 170);

  // Interconnecting pipes
  ctx.beginPath();
  ctx.moveTo(130, 160);
  ctx.lineTo(215, 160);
  ctx.moveTo(305, 160);
  ctx.lineTo(380, 160);
  ctx.stroke();

  // Bottom trend graph area
  ctx.fillStyle = '#040a12';
  ctx.fillRect(10, 280, 492, 90);
  ctx.strokeStyle = '#18384a';
  ctx.strokeRect(10, 280, 492, 90);

  // Live trend curve
  ctx.strokeStyle = '#00e5aa';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 320);
  for (let x = 20; x < 490; x += 10) {
    const y = 320 + Math.sin(x * 0.05) * 18 + (Math.random() - 0.5) * 6;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '11px Courier New';
  ctx.fillText(`TAG: ${tag} | PV: 18.7 kg/cm²G | SP: 20.0 | OP: 45.2%`, 20, 360);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 12. Golden Sunset Environment Map for High Metallic PBR Reflections
export function createSunsetEnvMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Sunset sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#0c1a2e');   // Deep twilight zenith
  grad.addColorStop(0.3, '#301828'); // Sunset purple sky
  grad.addColorStop(0.55, '#f56218'); // Bright golden orange horizon
  grad.addColorStop(0.68, '#ffaa22'); // Sun glow
  grad.addColorStop(0.70, '#42322a'); // Ground dark horizon
  grad.addColorStop(1, '#1a1816');   // Lower ground reflection
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Bright Sun disk
  ctx.fillStyle = '#fffbee';
  ctx.shadowColor = '#ff8800';
  ctx.shadowBlur = 60;
  ctx.beginPath();
  ctx.arc(512, 330, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Sunset clouds
  ctx.fillStyle = 'rgba(255, 120, 40, 0.25)';
  for (let i = 0; i < 20; i++) {
    const cx = (i * 120 + 50) % 1024;
    const cy = 180 + Math.sin(i) * 60;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 140, 30, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return texture;
}

// 13. Iraqi Flag Texture ( علم العراق الأصلي )
export function createIraqiFlagTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 341; // 3:2 ratio
  const ctx = canvas.getContext('2d')!;

  // Top Red Stripe
  ctx.fillStyle = '#ce1126';
  ctx.fillRect(0, 0, 512, 113.6);

  // Middle White Stripe
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 113.6, 512, 113.6);

  // Bottom Black Stripe
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 227.2, 512, 113.8);

  // Green Kufic Arabic Script: الله أكبر
  ctx.fillStyle = '#007a3d';
  ctx.font = 'bold 36px "Traditional Arabic", "Kufi", "Noto Naskh Arabic", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('الله أكبر', 256, 170);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 14. Wet Reflective Concrete Pad Texture
export function createWetGroundTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base wet concrete
  ctx.fillStyle = '#3a4448';
  ctx.fillRect(0, 0, 1024, 1024);

  // Concrete grid expansion joints
  ctx.strokeStyle = '#1d2326';
  ctx.lineWidth = 4;
  for (let x = 0; x <= 1024; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Safety yellow boundary lines
  ctx.strokeStyle = '#f5a800';
  ctx.lineWidth = 8;
  ctx.strokeRect(30, 30, 964, 964);

  // Wet puddles / glossy patches
  for (let i = 0; i < 35; i++) {
    const px = Math.random() * 1024;
    const py = Math.random() * 1024;
    const pr = 20 + Math.random() * 60;
    const pGrad = ctx.createRadialGradient(px, py, 5, px, py, pr);
    pGrad.addColorStop(0, 'rgba(80, 110, 120, 0.45)');
    pGrad.addColorStop(1, 'rgba(58, 68, 72, 0.0)');
    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 15. Palm Tree Bark Texture ( جذع النخلة )
export function createPalmTrunkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#5c4333';
  ctx.fillRect(0, 0, 256, 512);

  // Ringed palm bark scales
  ctx.strokeStyle = '#38261a';
  ctx.lineWidth = 4;
  for (let y = 0; y < 512; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(128, y + 12, 256, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 16. Oil / Chemical Drum Texture
export function createOilDrumTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 256, 512);

  // Steel ridges
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(0, 150); ctx.lineTo(256, 150);
  ctx.moveTo(0, 360); ctx.lineTo(256, 360);
  ctx.stroke();

  // Yellow safety hazard symbol box
  ctx.fillStyle = '#f5a800';
  ctx.fillRect(50, 220, 156, 70);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('NH3 / CATACARB', 128, 250);
  ctx.font = 'bold 12px Arial';
  ctx.fillText('HAZARDOUS', 128, 275);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 17. High-Precision Temperature Badge Texture (Exact from Master Diagram)
export function createTemperatureBadgeTexture(tempStr: string, numericVal: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;

  // Determine color theme based on temperature
  let bgGradientStart = '#1a0505';
  let bgGradientEnd = '#440a0a';
  let borderColor = '#ff3b30';
  let glowColor = '#ff453a';
  let icon = '🔥';

  if (numericVal >= 700) {
    // Ultra high temp (Primary/Secondary reformer 750°C, 900°C)
    bgGradientStart = '#330000';
    bgGradientEnd = '#800000';
    borderColor = '#ff2a00';
    glowColor = '#ff5500';
    icon = '⚡';
  } else if (numericVal >= 350) {
    // High temp (HTS, Methanator inlet, etc. 380°C, 500°C, 390°C)
    bgGradientStart = '#2b0c00';
    bgGradientEnd = '#5e1e00';
    borderColor = '#ff6b00';
    glowColor = '#ff8800';
    icon = '🔥';
  } else if (numericVal >= 150) {
    // Medium temp (LTS, Reboilers, 185°C, 200°C, 220°C, 285°C, 340°C)
    bgGradientStart = '#241a00';
    bgGradientEnd = '#543d00';
    borderColor = '#ffcc00';
    glowColor = '#ffd700';
    icon = '🌡';
  } else if (numericVal >= 50) {
    // Warm / Moderate (77°C, 95°C, 120°C, 137°C, 155°C)
    bgGradientStart = '#0a2010';
    bgGradientEnd = '#144020';
    borderColor = '#34c759';
    glowColor = '#30d158';
    icon = '💧';
  } else {
    // Cold / Chilled / Cryogenic (2°C, 14°C, 26°C, 40°C, -33°C)
    bgGradientStart = '#03182b';
    bgGradientEnd = '#083359';
    borderColor = '#00c8ef';
    glowColor = '#64d2ff';
    icon = '❄';
  }

  // Draw background pill
  const grad = ctx.createLinearGradient(0, 0, 256, 96);
  grad.addColorStop(0, bgGradientStart);
  grad.addColorStop(1, bgGradientEnd);
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.roundRect(4, 4, 248, 88, 16);
  ctx.fill();

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Inner subtle highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(8, 8, 240, 80, 12);
  ctx.stroke();

  // Temperature Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${icon} ${tempStr}`, 128, 48);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 18. Instrumentation & Controller Badge Texture (FIC, PIC, HC, FRC, TRC, LIC, ARC)
export function createControllerBadgeTexture(tag: string, type: 'PIC' | 'FRC' | 'FRCA' | 'HC' | 'TRC' | 'LIC' | 'ARC' | string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(10, 25, 40, 0.95)';
  ctx.beginPath();
  ctx.roundRect(4, 4, 248, 88, 14);
  ctx.fill();

  ctx.strokeStyle = type === 'PIC' ? '#ff9500' : type === 'HC' ? '#af52de' : type === 'TRC' ? '#ff3b30' : type === 'LIC' ? '#5856d6' : '#00e5aa';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Header mini bar
  ctx.fillStyle = type === 'PIC' ? '#ff9500' : type === 'HC' ? '#af52de' : type === 'TRC' ? '#ff3b30' : type === 'LIC' ? '#5856d6' : '#00e5aa';
  ctx.fillRect(8, 8, 240, 22);

  ctx.fillStyle = '#030c14';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`CONTROLLER / DCS LOOP`, 128, 19);

  // Tag value
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Courier New", monospace';
  ctx.fillText(tag, 128, 62);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 19. Pressure / Process Annotation Badge Texture (e.g. 45 kg, 46 kg, 19 kg, 6 kg, 39 kg)
export function createPressureBadgeTexture(pressStr: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 220;
  canvas.height = 76;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(25, 20, 5, 0.92)';
  ctx.beginPath();
  ctx.roundRect(3, 3, 214, 70, 10);
  ctx.fill();

  ctx.strokeStyle = '#f5a800';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#ffcc00';
  ctx.font = 'bold 22px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`⯈ ${pressStr}`, 110, 38);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 20. Professional Equipment Tag Badge Texture
export function createEquipmentTagTexture(tag: string, name: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 110;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(6, 18, 30, 0.95)';
  ctx.beginPath();
  ctx.roundRect(4, 4, 312, 102, 12);
  ctx.fill();

  ctx.strokeStyle = '#00c8ef';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Top header bar
  ctx.fillStyle = '#00c8ef';
  ctx.fillRect(8, 8, 304, 28);

  ctx.fillStyle = '#030c14';
  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tag, 160, 22);

  // Subtitle
  ctx.fillStyle = '#dbeeff';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(name.length > 24 ? name.substring(0, 23) + '..' : name, 160, 68);

  ctx.fillStyle = '#7a9bb5';
  ctx.font = '11px sans-serif';
  ctx.fillText('CLICK TO INSPECT EQUIPMENT', 160, 92);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 21. Authentic Industrial Carbon Steel Pipe Texture (ASTM A106 / A335)
export function createIndustrialCarbonSteelPipeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base metallic dark carbon steel gradient (ASTM A106 Gr.B mill scale)
  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0, '#2e353c');
  grad.addColorStop(0.2, '#38404a');
  grad.addColorStop(0.4, '#303740');
  grad.addColorStop(0.6, '#3e4650');
  grad.addColorStop(0.8, '#323942');
  grad.addColorStop(1, '#2e353c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Micro-noise & mill scale surface roughness
  const imgData = ctx.getImageData(0, 0, 1024, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 22;
    data[i] = Math.min(255, Math.max(0, data[i] + n));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n + 1));
  }
  ctx.putImageData(imgData, 0, 0);

  // Fine longitudinal mill rolling striations
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 512; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y + (Math.random() - 0.5) * 4);
    ctx.stroke();
  }

  // Circumferential lathe turning marks
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  for (let x = 0; x < 1024; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  // Butt-weld seams with Heat Affected Zone (HAZ) tempering colors
  const weldXPositions = [128, 384, 640, 896];
  weldXPositions.forEach((wx) => {
    // HAZ straw/bronze discoloration ring
    const hazGrad = ctx.createLinearGradient(wx - 20, 0, wx + 20, 0);
    hazGrad.addColorStop(0, 'rgba(80, 65, 45, 0)');
    hazGrad.addColorStop(0.35, 'rgba(110, 85, 50, 0.25)');
    hazGrad.addColorStop(0.5, 'rgba(40, 45, 52, 0.6)');
    hazGrad.addColorStop(0.65, 'rgba(110, 85, 50, 0.25)');
    hazGrad.addColorStop(1, 'rgba(80, 65, 45, 0)');
    ctx.fillStyle = hazGrad;
    ctx.fillRect(wx - 20, 0, 40, 512);

    // Weld bead crown
    ctx.strokeStyle = 'rgba(25, 28, 33, 0.85)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(wx, 0);
    ctx.lineTo(wx, 512);
    ctx.stroke();

    // Weld ripple highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(wx + 1.5, 0);
    ctx.lineTo(wx + 1.5, 512);
    ctx.stroke();
  });

  // Stenciled specification print in industrial white ink
  ctx.fillStyle = 'rgba(230, 235, 245, 0.55)';
  ctx.font = 'bold 13px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const stencilText = 'ASTM A106-B / ASME SA106 SEAMLESS • HEAVY WALL • SCH 80 • HEAT NO. 948210 • HYDROTESTED 110 BARG • ';
  ctx.fillText(stencilText + stencilText, 24, 180);
  ctx.fillText(stencilText + stencilText, 24, 340);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  return texture;
}

// 22. Carbon Steel Bump & Roughness Texture
export function createCarbonSteelBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 256);

  const imgData = ctx.getImageData(0, 0, 512, 256);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 35;
    const val = Math.min(255, Math.max(0, 128 + n));
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }
  ctx.putImageData(imgData, 0, 0);

  // Weld lines bump
  for (let x of [128, 384]) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 3, 0, 6, 256);
    ctx.fillStyle = '#404040';
    ctx.fillRect(x - 6, 0, 3, 256);
    ctx.fillRect(x + 3, 0, 3, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 23. ASME A13.1 Industrial Pipe Identification Band with Service Text & Flow Direction Arrows
export function createPipeIdentificationBandTexture(
  serviceName: string,
  serviceCode: string,
  colorHex: string,
  pressTemp: string,
  textColor: string = '#000000'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Background is the official ASME service color
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 1024, 256);

  // Industrial edge safety border / reflective trim
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillRect(0, 0, 1024, 12);
  ctx.fillRect(0, 244, 1024, 12);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 12, 1024, 4);
  ctx.fillRect(0, 240, 1024, 4);

  // Service Name & Service Code repeated twice around circumference
  ctx.fillStyle = textColor;
  ctx.font = '900 36px "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let offset of [256, 768]) {
    // Top line: Service Name + Code
    ctx.fillText(`${serviceName} [${serviceCode}]`, offset, 80);

    // Bottom line: Flow Direction Arrows + Operating Conditions
    ctx.font = 'bold 26px "Courier New", monospace';
    ctx.fillText(`➔ ➔ ➔  ${pressTemp}  ➔ ➔ ➔`, offset, 160);

    // Reset font for next iteration
    ctx.font = '900 36px "Arial Black", sans-serif';
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}



