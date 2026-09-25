import * as THREE from 'three';

export interface MaterialPalette {
  carbonSteel: THREE.MeshStandardMaterial;
  polishedSteel: THREE.MeshStandardMaterial;
  heatSteel: THREE.MeshStandardMaterial;
  copperBronze: THREE.MeshStandardMaterial;
  insulationMat: THREE.MeshStandardMaterial;
  concreteMat: THREE.MeshStandardMaterial;
  flangeMat: THREE.MeshStandardMaterial;
  catalystGlowMat: THREE.MeshStandardMaterial;
  catwalkMat: THREE.MeshStandardMaterial;
  railingMat: THREE.MeshStandardMaterial;
}

export class Equipment3DBuilder {
  private mats: MaterialPalette;

  constructor(mats: MaterialPalette) {
    this.mats = mats;
  }

  // 1. Build Fired Heaters / Reforming Furnaces (H-101, R-101)
  public buildFurnace(options: {
    width: number;
    height: number;
    depth: number;
    hasTopConvectionBank?: boolean;
    stackHeight?: number;
    numBurners?: number;
    hasRadiantTubes?: boolean;
  }): THREE.Group {
    const group = new THREE.Group();

    // Reinforced Concrete Foundation Pad
    const padGeo = new THREE.BoxGeometry(options.width + 1.6, 0.6, options.depth + 1.6);
    const pad = new THREE.Mesh(padGeo, this.mats.concreteMat);
    pad.position.set(0, 0.3, 0);
    group.add(pad);

    // Radiant Firebox Enclosure (Insulated heavy refractory lined casing)
    const boxGeo = new THREE.BoxGeometry(options.width, options.height, options.depth);
    const box = new THREE.Mesh(boxGeo, this.mats.carbonSteel);
    box.position.set(0, options.height / 2 + 0.6, 0);
    group.add(box);

    // Structural I-Beam External Stiffeners along walls
    for (let z = -options.depth / 2 + 1; z <= options.depth / 2 - 1; z += 2.5) {
      const colGeo = new THREE.BoxGeometry(0.3, options.height + 0.4, 0.3);
      const colL = new THREE.Mesh(colGeo, this.mats.flangeMat);
      colL.position.set(-options.width / 2 - 0.15, options.height / 2 + 0.6, z);
      const colR = new THREE.Mesh(colGeo, this.mats.flangeMat);
      colR.position.set(options.width / 2 + 0.15, options.height / 2 + 0.6, z);
      group.add(colL);
      group.add(colR);
    }

    // Top Convection Bank housing waste heat coils
    let topY = options.height + 0.6;
    if (options.hasTopConvectionBank) {
      const convGeo = new THREE.BoxGeometry(options.width * 0.8, 3.2, options.depth * 0.75);
      const conv = new THREE.Mesh(convGeo, this.mats.polishedSteel);
      conv.position.set(0, topY + 1.6, 0);
      group.add(conv);

      // Induced draft transition duct
      const ductGeo = new THREE.ConeGeometry(options.width * 0.45, 2.2, 4);
      const duct = new THREE.Mesh(ductGeo, this.mats.carbonSteel);
      duct.rotation.y = Math.PI / 4;
      duct.position.set(0, topY + 3.2 + 1.1, 0);
      group.add(duct);
      topY += 5.4;
    }

    // Tall Exhaust Flue Gas Stack
    const stackH = options.stackHeight || 12;
    const stackGeo = new THREE.CylinderGeometry(0.65, 0.95, stackH, 20);
    const stack = new THREE.Mesh(stackGeo, this.mats.carbonSteel);
    stack.position.set(0, topY + stackH / 2, 0);
    group.add(stack);

    // Glowing Radiant Tubes inside / peeping doors
    if (options.hasRadiantTubes) {
      for (let x = -options.width / 2 + 1.2; x <= options.width / 2 - 1.2; x += 1.6) {
        const tubeGeo = new THREE.CylinderGeometry(0.12, 0.12, options.height * 0.85, 12);
        const tube = new THREE.Mesh(tubeGeo, this.mats.catalystGlowMat);
        tube.position.set(x, options.height / 2 + 0.6, options.depth / 2 + 0.1);
        group.add(tube);
      }
    }

    // External Access Catwalks & Safety Railing
    const platGeo = new THREE.BoxGeometry(options.width + 1.4, 0.15, options.depth + 1.4);
    const plat = new THREE.Mesh(platGeo, this.mats.catwalkMat);
    plat.position.set(0, options.height * 0.65 + 0.6, 0);
    group.add(plat);

    return group;
  }

  // 2. Build High-Pressure Catalytic Reactors (R-102, R-103, R-104, R-105, R-106, R-401)
  public buildReactor(options: {
    diameter: number;
    height: number;
    isMultiBed?: boolean;
    hasWaterJacket?: boolean;
    skirtHeight?: number;
    hasSpiralStairs?: boolean;
  }): THREE.Group {
    const group = new THREE.Group();
    const r = options.diameter / 2;
    const skirtH = options.skirtHeight || 2.2;
    const totalCylinderH = options.height;

    // Concrete Footing & Base Anchor Ring
    const baseGeo = new THREE.CylinderGeometry(r * 1.3, r * 1.35, 0.5, 24);
    const baseMesh = new THREE.Mesh(baseGeo, this.mats.concreteMat);
    baseMesh.position.set(0, 0.25, 0);
    group.add(baseMesh);

    // Reactor Support Skirt with Access Manhole
    const skirtGeo = new THREE.CylinderGeometry(r * 1.05, r * 1.1, skirtH, 32, 1, true);
    const skirt = new THREE.Mesh(skirtGeo, this.mats.carbonSteel);
    skirt.position.set(0, skirtH / 2 + 0.5, 0);
    group.add(skirt);

    // Main Cylindrical Heavy Pressure Shell
    const shellGeo = new THREE.CylinderGeometry(r, r, totalCylinderH, 32);
    const shell = new THREE.Mesh(shellGeo, this.mats.carbonSteel);
    shell.position.set(0, skirtH + totalCylinderH / 2 + 0.5, 0);
    group.add(shell);

    // Semi-Ellipsoidal Dished Heads (Top and Bottom)
    const domeGeo = new THREE.SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const topDome = new THREE.Mesh(domeGeo, this.mats.carbonSteel);
    topDome.position.set(0, skirtH + totalCylinderH + 0.5, 0);
    group.add(topDome);

    const botDome = new THREE.Mesh(domeGeo, this.mats.carbonSteel);
    botDome.rotation.x = Math.PI;
    botDome.position.set(0, skirtH + 0.5, 0);
    group.add(botDome);

    // Inlet and Outlet Nozzles with Bolted Heavy Flanges
    const topNozzleGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 16);
    const topNozzle = new THREE.Mesh(topNozzleGeo, this.mats.polishedSteel);
    topNozzle.position.set(0, skirtH + totalCylinderH + r + 0.8, 0);
    group.add(topNozzle);

    const topFlangeGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.18, 20);
    const topFlange = new THREE.Mesh(topFlangeGeo, this.mats.flangeMat);
    topFlange.position.set(0, skirtH + totalCylinderH + r + 1.3, 0);
    group.add(topFlange);

    // Bottom Outlet Nozzle
    const botNozzle = new THREE.Mesh(topNozzleGeo, this.mats.polishedSteel);
    botNozzle.position.set(0, skirtH * 0.4, 0);
    group.add(botNozzle);

    // Multiple Bed Division Girth Rings (if multi-bed like R-401 or R-102)
    if (options.isMultiBed) {
      for (let f = 0.3; f <= 0.8; f += 0.3) {
        const ringGeo = new THREE.TorusGeometry(r + 0.08, 0.08, 12, 32);
        const ring = new THREE.Mesh(ringGeo, this.mats.flangeMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(0, skirtH + totalCylinderH * f + 0.5, 0);
        group.add(ring);

        // Access Platform at bed level
        const platGeo = new THREE.CylinderGeometry(r + 1.2, r + 1.2, 0.1, 24);
        const plat = new THREE.Mesh(platGeo, this.mats.catwalkMat);
        plat.position.set(0, skirtH + totalCylinderH * f + 0.45, 0);
        group.add(plat);
      }
    }

    // Spiral Catwalk Stairs around Reactor Shell
    if (options.hasSpiralStairs || options.height > 8) {
      const steps = Math.floor(options.height * 2.2);
      for (let i = 0; i < steps; i++) {
        const angle = (i / steps) * Math.PI * 3.5;
        const y = skirtH + 0.5 + (i / steps) * totalCylinderH;
        const stepGeo = new THREE.BoxGeometry(0.7, 0.06, 0.3);
        const step = new THREE.Mesh(stepGeo, this.mats.catwalkMat);
        step.position.set(Math.cos(angle) * (r + 0.4), y, Math.sin(angle) * (r + 0.4));
        step.rotation.y = -angle;
        group.add(step);
      }
    }

    return group;
  }

  // 3. Build Shell-and-Tube Heat Exchangers & Reboilers (E-101, E-108, E-107, E-109, E-110, E-201, E-106, E-401..E-408)
  public buildHeatExchanger(options: {
    length: number;
    diameter: number;
    isVertical?: boolean;
    hasUHead?: boolean;
    isDualShell?: boolean;
  }): THREE.Group {
    const group = new THREE.Group();
    const r = options.diameter / 2;
    const len = options.length;

    const buildSingleShell = (yOffset: number, zOffset: number) => {
      const shellGroup = new THREE.Group();
      shellGroup.position.set(0, yOffset, zOffset);

      // Main Cylinder Shell
      const cylGeo = new THREE.CylinderGeometry(r, r, len, 24);
      const cyl = new THREE.Mesh(cylGeo, this.mats.polishedSteel);
      if (!options.isVertical) {
        cyl.rotation.z = Math.PI / 2;
      }
      shellGroup.add(cyl);

      // Channel Head End Covers (Bolted Bonnets)
      const headGeo = new THREE.SphereGeometry(r, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const leftHead = new THREE.Mesh(headGeo, this.mats.carbonSteel);
      const rightHead = new THREE.Mesh(headGeo, this.mats.carbonSteel);

      if (!options.isVertical) {
        leftHead.rotation.z = Math.PI / 2;
        leftHead.position.set(-len / 2, 0, 0);
        rightHead.rotation.z = -Math.PI / 2;
        rightHead.position.set(len / 2, 0, 0);
      } else {
        leftHead.position.set(0, len / 2, 0);
        rightHead.rotation.x = Math.PI;
        rightHead.position.set(0, -len / 2, 0);
      }
      shellGroup.add(leftHead);
      shellGroup.add(rightHead);

      // Tube Sheet Girth Flanges
      const flangeGeo = new THREE.CylinderGeometry(r * 1.25, r * 1.25, 0.15, 24);
      const f1 = new THREE.Mesh(flangeGeo, this.mats.flangeMat);
      const f2 = new THREE.Mesh(flangeGeo, this.mats.flangeMat);

      if (!options.isVertical) {
        f1.rotation.z = Math.PI / 2;
        f1.position.set(-len / 2 + 0.2, 0, 0);
        f2.rotation.z = Math.PI / 2;
        f2.position.set(len / 2 - 0.2, 0, 0);
      } else {
        f1.position.set(0, len / 2 - 0.2, 0);
        f2.position.set(0, -len / 2 + 0.2, 0);
      }
      shellGroup.add(f1);
      shellGroup.add(f2);

      // Shell-side Inlet & Outlet Nozzles
      const nozGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.6, 16);
      const noz1 = new THREE.Mesh(nozGeo, this.mats.carbonSteel);
      const noz2 = new THREE.Mesh(nozGeo, this.mats.carbonSteel);

      if (!options.isVertical) {
        noz1.position.set(-len * 0.28, r + 0.3, 0);
        noz2.position.set(len * 0.28, -r - 0.3, 0);
      } else {
        noz1.rotation.z = Math.PI / 2;
        noz1.position.set(r + 0.3, len * 0.22, 0);
        noz2.rotation.z = Math.PI / 2;
        noz2.position.set(-r - 0.3, -len * 0.22, 0);
      }
      shellGroup.add(noz1);
      shellGroup.add(noz2);

      // Structural Saddle or Vertical Base Skirt Supports
      if (!options.isVertical) {
        for (let sx of [-len * 0.32, len * 0.32]) {
          const saddleGeo = new THREE.BoxGeometry(0.35, yOffset - 0.2, r * 2.2);
          const saddle = new THREE.Mesh(saddleGeo, this.mats.carbonSteel);
          saddle.position.set(sx, -(yOffset - 0.2) / 2 - r, 0);
          shellGroup.add(saddle);
        }
      } else {
        // Vertical Skirt Support
        const skirtH = 1.4;
        const skirtGeo = new THREE.CylinderGeometry(r * 1.02, r * 1.06, skirtH, 24, 1, true);
        const skirt = new THREE.Mesh(skirtGeo, this.mats.carbonSteel);
        skirt.position.set(0, -len / 2 - skirtH / 2 + 0.05, 0);
        shellGroup.add(skirt);

        const baseRingGeo = new THREE.CylinderGeometry(r * 1.25, r * 1.25, 0.15, 24);
        const baseRing = new THREE.Mesh(baseRingGeo, this.mats.flangeMat);
        baseRing.position.set(0, -len / 2 - skirtH + 0.08, 0);
        shellGroup.add(baseRing);
      }

      return shellGroup;
    };

    if (options.isDualShell) {
      group.add(buildSingleShell(2.8, -r * 1.3));
      group.add(buildSingleShell(2.8, r * 1.3));
    } else {
      group.add(buildSingleShell(options.isVertical ? len / 2 + 1.2 : 2.5, 0));
    }

    return group;
  }

  // 4. Build Knock-Out Drums & Vapor-Liquid Separators (V-115, V-111, V-101, V-201, V-204, V-310, V-401, V-402)
  public buildVessel(options: {
    diameter: number;
    height: number;
    isVertical?: boolean;
    hasLevelGlass?: boolean;
  }): THREE.Group {
    const group = new THREE.Group();
    const r = options.diameter / 2;
    const h = options.height;

    if (options.isVertical !== false) {
      // Vertical Vessel with 4 Tubular Legs
      for (let a = 0; a < 4; a++) {
        const angle = (a / 4) * Math.PI * 2;
        const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.8, 12);
        const leg = new THREE.Mesh(legGeo, this.mats.carbonSteel);
        leg.position.set(Math.cos(angle) * (r * 0.9), 0.9, Math.sin(angle) * (r * 0.9));
        group.add(leg);
      }

      // Cylindrical Vessel Shell
      const cylGeo = new THREE.CylinderGeometry(r, r, h, 24);
      const cyl = new THREE.Mesh(cylGeo, this.mats.carbonSteel);
      cyl.position.set(0, 1.8 + h / 2, 0);
      group.add(cyl);

      // Top & Bottom Dished Heads
      const domeGeo = new THREE.SphereGeometry(r, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const topDome = new THREE.Mesh(domeGeo, this.mats.carbonSteel);
      topDome.position.set(0, 1.8 + h, 0);
      group.add(topDome);

      const botDome = new THREE.Mesh(domeGeo, this.mats.carbonSteel);
      botDome.rotation.x = Math.PI;
      botDome.position.set(0, 1.8, 0);
      group.add(botDome);

      // Top Gas Exit Nozzle & Bottom Liquid Drain
      const nozGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.8, 16);
      const topNoz = new THREE.Mesh(nozGeo, this.mats.polishedSteel);
      topNoz.position.set(0, 1.8 + h + r + 0.4, 0);
      group.add(topNoz);

      const botNoz = new THREE.Mesh(nozGeo, this.mats.polishedSteel);
      botNoz.position.set(0, 0.9, 0);
      group.add(botNoz);

      // Visual Level Gauge Glass Indicator along side
      if (options.hasLevelGlass !== false) {
        const gaugeGeo = new THREE.CylinderGeometry(0.04, 0.04, h * 0.6, 8);
        const gauge = new THREE.Mesh(gaugeGeo, this.mats.polishedSteel);
        gauge.position.set(r + 0.18, 1.8 + h / 2, 0);
        group.add(gauge);
      }
    }

    return group;
  }

  // 5. Build Packed / Tray Absorption & Stripping Columns (T-201, T-202)
  public buildTowerColumn(options: {
    diameter: number;
    height: number;
    numPlatforms?: number;
  }): THREE.Group {
    const group = new THREE.Group();
    const r = options.diameter / 2;
    const h = options.height;

    // Concrete Pedestal
    const baseGeo = new THREE.CylinderGeometry(r * 1.4, r * 1.45, 0.8, 32);
    const baseMesh = new THREE.Mesh(baseGeo, this.mats.concreteMat);
    baseMesh.position.set(0, 0.4, 0);
    group.add(baseMesh);

    // Skirt Support
    const skirtGeo = new THREE.CylinderGeometry(r * 1.1, r * 1.15, 3.2, 32, 1, true);
    const skirt = new THREE.Mesh(skirtGeo, this.mats.carbonSteel);
    skirt.position.set(0, 2.4, 0);
    group.add(skirt);

    // Main Column Tower Cylinder
    const colGeo = new THREE.CylinderGeometry(r, r, h, 32);
    const col = new THREE.Mesh(colGeo, this.mats.carbonSteel);
    col.position.set(0, 4.0 + h / 2, 0);
    group.add(col);

    // Hemispherical Heads
    const domeGeo = new THREE.SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const topDome = new THREE.Mesh(domeGeo, this.mats.carbonSteel);
    topDome.position.set(0, 4.0 + h, 0);
    group.add(topDome);

    const botDome = new THREE.Mesh(domeGeo, this.mats.carbonSteel);
    botDome.rotation.x = Math.PI;
    botDome.position.set(0, 4.0, 0);
    group.add(botDome);

    // Access Platforms & Safety Cages
    const numPlat = options.numPlatforms || Math.floor(h / 5);
    for (let p = 1; p <= numPlat; p++) {
      const py = 4.0 + (p / (numPlat + 1)) * h;
      const platGeo = new THREE.CylinderGeometry(r + 1.2, r + 1.2, 0.12, 24);
      const plat = new THREE.Mesh(platGeo, this.mats.catwalkMat);
      plat.position.set(0, py, 0);
      group.add(plat);

      // Outer Safety Railing Ring
      const railGeo = new THREE.CylinderGeometry(r + 1.2, r + 1.2, 0.9, 24, 1, true);
      const rail = new THREE.Mesh(railGeo, this.mats.railingMat);
      rail.position.set(0, py + 0.45, 0);
      group.add(rail);
    }

    // Safety Cage Ladder Running Full Column Height
    const ladderSteps = Math.floor(h * 3);
    for (let i = 0; i < ladderSteps; i++) {
      const ly = 1.0 + (i / ladderSteps) * (h + 3.0);
      const rungGeo = new THREE.BoxGeometry(0.45, 0.04, 0.04);
      const rung = new THREE.Mesh(rungGeo, this.mats.polishedSteel);
      rung.position.set(r + 0.25, ly, 0);
      group.add(rung);
    }

    return group;
  }

  // 6. Build Multi-Stage Centrifugal Compressors & Steam Turbines (K-303, K-302, K-301, K-401)
  public buildCompressorUnit(options: {
    length: number;
    hasTurbine?: boolean;
    numCasings?: number;
  }): { group: THREE.Group; shaftRotor: THREE.Mesh } {
    const group = new THREE.Group();
    const len = options.length;

    // Heavy Reinforced Inertia Skid Baseplate
    const skidGeo = new THREE.BoxGeometry(len, 0.8, 4.5);
    const skid = new THREE.Mesh(skidGeo, this.mats.carbonSteel);
    skid.position.set(0, 0.4, 0);
    group.add(skid);

    // Compressor Casings (Split barrel casing with suction & discharge volutes)
    const numCasing = options.numCasings || 2;
    for (let c = 0; c < numCasing; c++) {
      const cx = -len * 0.3 + c * (len * 0.32);
      const caseGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.0, 24);
      const casing = new THREE.Mesh(caseGeo, this.mats.polishedSteel);
      casing.rotation.z = Math.PI / 2;
      casing.position.set(cx, 1.8, 0);
      group.add(casing);

      // Suction & Discharge Nozzles
      const nozGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.4, 16);
      const nozTop = new THREE.Mesh(nozGeo, this.mats.flangeMat);
      nozTop.position.set(cx, 3.0, 0);
      group.add(nozTop);

      const nozBot = new THREE.Mesh(nozGeo, this.mats.flangeMat);
      nozBot.position.set(cx, 0.6, 1.2);
      nozBot.rotation.x = Math.PI / 2;
      group.add(nozBot);
    }

    // High Pressure Steam Turbine Driver (K-301T / K-303T)
    if (options.hasTurbine !== false) {
      const turbX = len * 0.35;
      const turbGeo = new THREE.CylinderGeometry(1.0, 1.0, 2.6, 20);
      const turb = new THREE.Mesh(turbGeo, this.mats.heatSteel);
      turb.rotation.z = Math.PI / 2;
      turb.position.set(turbX, 1.8, 0);
      group.add(turb);
    }

    // Rotating Coupling Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.18, 0.18, len * 0.9, 16);
    const shaftRotor = new THREE.Mesh(shaftGeo, this.mats.polishedSteel);
    shaftRotor.rotation.z = Math.PI / 2;
    shaftRotor.position.set(0, 1.8, 0);
    group.add(shaftRotor);

    return { group, shaftRotor };
  }

  // 7. Build Heavy Industrial Centrifugal Pump Skid (e.g. Catacarb Solution Pumps P-201 A/B/C, Boiler Feed Pumps P-101)
  public buildPumpSkid(options: {
    numPumps?: number;
    hasSpare?: boolean;
  }): THREE.Group {
    const group = new THREE.Group();
    const num = options.numPumps || 3;

    // Concrete Equipment Plinth
    const plinthW = num * 3.2 + 1.0;
    const plinthGeo = new THREE.BoxGeometry(plinthW, 0.5, 3.2);
    const plinth = new THREE.Mesh(plinthGeo, this.mats.concreteMat);
    plinth.position.set(0, 0.25, 0);
    group.add(plinth);

    for (let i = 0; i < num; i++) {
      const px = -plinthW / 2 + 2.0 + i * 3.2;
      const pumpGroup = new THREE.Group();
      pumpGroup.position.set(px, 0.5, 0);

      // Steel Baseplate Skid
      const baseGeo = new THREE.BoxGeometry(2.4, 0.2, 1.4);
      const baseMesh = new THREE.Mesh(baseGeo, this.mats.carbonSteel);
      baseMesh.position.set(0, 0.1, 0);
      pumpGroup.add(baseMesh);

      // Electric Motor Body
      const motorGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.1, 20);
      const motorMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.7, roughness: 0.3 }); // Industrial Blue
      const motor = new THREE.Mesh(motorGeo, motorMat);
      motor.rotation.z = Math.PI / 2;
      motor.position.set(-0.55, 0.65, 0);
      pumpGroup.add(motor);

      // Motor Terminal Box
      const tBoxGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
      const tBox = new THREE.Mesh(tBoxGeo, this.mats.carbonSteel);
      tBox.position.set(-0.55, 1.15, 0);
      pumpGroup.add(tBox);

      // Coupling Guard
      const coupGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.35, 16);
      const coupMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.5, roughness: 0.4 }); // Safety Amber
      const coup = new THREE.Mesh(coupGeo, coupMat);
      coup.rotation.z = Math.PI / 2;
      coup.position.set(0.12, 0.65, 0);
      pumpGroup.add(coup);

      // Centrifugal Pump Volute Casing
      const voluteGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.45, 24);
      const volute = new THREE.Mesh(voluteGeo, this.mats.polishedSteel);
      volute.rotation.z = Math.PI / 2;
      volute.position.set(0.55, 0.65, 0);
      pumpGroup.add(volute);

      // Suction Nozzle (Front Horizontal)
      const sucNozGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.6, 16);
      const sucNoz = new THREE.Mesh(sucNozGeo, this.mats.flangeMat);
      sucNoz.rotation.x = Math.PI / 2;
      sucNoz.position.set(0.55, 0.65, 0.5);
      pumpGroup.add(sucNoz);

      // Discharge Nozzle (Top Vertical)
      const disNozGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.7, 16);
      const disNoz = new THREE.Mesh(disNozGeo, this.mats.flangeMat);
      disNoz.position.set(0.55, 1.15, 0);
      pumpGroup.add(disNoz);

      group.add(pumpGroup);
    }

    return group;
  }

  // 8. Build Atmospheric Relief Vent Silencer Stack (e.g. J-201)
  public buildVentSilencer(options: {
    stackHeight?: number;
    silencerDiameter?: number;
    silencerHeight?: number;
  }): THREE.Group {
    const group = new THREE.Group();
    const sH = options.stackHeight || 12.0;
    const silD = options.silencerDiameter || 2.0;
    const silH = options.silencerHeight || 4.5;

    // Concrete Footing
    const baseGeo = new THREE.CylinderGeometry(silD * 0.9, silD * 0.95, 0.6, 24);
    const base = new THREE.Mesh(baseGeo, this.mats.concreteMat);
    base.position.set(0, 0.3, 0);
    group.add(base);

    // Inlet Riser Stack
    const pipeGeo = new THREE.CylinderGeometry(silD * 0.35, silD * 0.35, sH, 20);
    const pipe = new THREE.Mesh(pipeGeo, this.mats.carbonSteel);
    pipe.position.set(0, 0.6 + sH / 2, 0);
    group.add(pipe);

    // Acoustic Expansion Silencer Barrel
    const silGeo = new THREE.CylinderGeometry(silD / 2, silD / 2, silH, 24);
    const silencer = new THREE.Mesh(silGeo, this.mats.polishedSteel);
    silencer.position.set(0, 0.6 + sH + silH / 2, 0);
    group.add(silencer);

    // Top Weather Cowl / Rain Hood Diffuser
    const cowlGeo = new THREE.ConeGeometry(silD * 0.65, 1.2, 20);
    const cowl = new THREE.Mesh(cowlGeo, this.mats.carbonSteel);
    cowl.position.set(0, 0.6 + sH + silH + 0.6, 0);
    group.add(cowl);

    // Guy Wire Attachment Ring
    const ringGeo = new THREE.TorusGeometry(silD / 2 + 0.05, 0.05, 12, 24);
    const ring = new THREE.Mesh(ringGeo, this.mats.flangeMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0.6 + sH + silH * 0.8, 0);
    group.add(ring);

    return group;
  }

  // 9. Build Hydraulic Energy Recovery Power Turbine Skid (e.g. P-201HT + P-201A/B)
  public buildHydraulicTurbinePumpSkid(): THREE.Group {
    const group = new THREE.Group();

    // Heavy Concrete Plinth
    const plinthGeo = new THREE.BoxGeometry(9.0, 0.6, 3.6);
    const plinth = new THREE.Mesh(plinthGeo, this.mats.concreteMat);
    plinth.position.set(0, 0.3, 0);
    group.add(plinth);

    // Steel Structural Base Skid
    const baseGeo = new THREE.BoxGeometry(8.4, 0.25, 3.0);
    const base = new THREE.Mesh(baseGeo, this.mats.carbonSteel);
    base.position.set(0, 0.72, 0);
    group.add(base);

    // Left: Hydraulic Recovery Power Turbine (P-201HT)
    const turbX = -2.8;
    const turbGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.4, 24);
    const turbMat = new THREE.MeshStandardMaterial({ color: 0x9333ea, metalness: 0.8, roughness: 0.2 }); // Recovery Purple
    const turbine = new THREE.Mesh(turbGeo, turbMat);
    turbine.rotation.z = Math.PI / 2;
    turbine.position.set(turbX, 1.4, 0);
    group.add(turbine);

    // Turbine High Pressure Inlet Nozzle
    const turbInNoz = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.8, 16), this.mats.flangeMat);
    turbInNoz.position.set(turbX, 2.1, 0);
    group.add(turbInNoz);

    // Middle: Electric Motor / Dual-Shaft Drive
    const motorX = 0;
    const motorGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.8, 24);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.7, roughness: 0.3 });
    const motor = new THREE.Mesh(motorGeo, motorMat);
    motor.rotation.z = Math.PI / 2;
    motor.position.set(motorX, 1.4, 0);
    group.add(motor);

    // Common Drive Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 6.8, 16);
    const shaft = new THREE.Mesh(shaftGeo, this.mats.polishedSteel);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(0, 1.4, 0);
    group.add(shaft);

    // Right: Semi-Lean Solution Pumps (P-201A & P-201B)
    const pumpX = 2.6;
    const voluteGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.6, 24);
    const volute = new THREE.Mesh(voluteGeo, this.mats.polishedSteel);
    volute.rotation.z = Math.PI / 2;
    volute.position.set(pumpX, 1.4, 0);
    group.add(volute);

    const disNoz = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.9, 16), this.mats.flangeMat);
    disNoz.position.set(pumpX, 2.1, 0);
    group.add(disNoz);

    return group;
  }

  // 10. Build Compact Chemical Dosing / Degassing Utility Skid
  public buildChemicalSkid(options: {
    tankDiameter: number;
    tankHeight: number;
    hasPump?: boolean;
    hasBlower?: boolean;
    color?: number;
  }): THREE.Group {
    const group = new THREE.Group();
    const r = options.tankDiameter / 2;
    const h = options.tankHeight;

    // Concrete Pad
    const padGeo = new THREE.BoxGeometry(r * 2.8 + (options.hasPump || options.hasBlower ? 2.2 : 0.8), 0.4, r * 2.8 + 0.8);
    const pad = new THREE.Mesh(padGeo, this.mats.concreteMat);
    pad.position.set(0, 0.2, 0);
    group.add(pad);

    // Vertical Storage / Degasser Vessel
    const tankGeo = new THREE.CylinderGeometry(r, r, h, 24);
    const tankMat = options.color ? new THREE.MeshStandardMaterial({ color: options.color, metalness: 0.6, roughness: 0.3 }) : this.mats.carbonSteel;
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.set(- (options.hasPump || options.hasBlower ? 0.8 : 0), 0.4 + h / 2, 0);
    group.add(tank);

    // Top Dome Head
    const domeGeo = new THREE.SphereGeometry(r, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, tankMat);
    dome.position.set(- (options.hasPump || options.hasBlower ? 0.8 : 0), 0.4 + h, 0);
    group.add(dome);

    // Dosing Pump or Blower
    if (options.hasPump) {
      const pGroup = new THREE.Group();
      pGroup.position.set(r + 0.5, 0.4, 0);
      const mMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16), this.mats.polishedSteel);
      mMesh.rotation.z = Math.PI / 2;
      mMesh.position.set(0, 0.3, 0);
      pGroup.add(mMesh);
      group.add(pGroup);
    } else if (options.hasBlower) {
      const bGroup = new THREE.Group();
      bGroup.position.set(r + 0.6, 0.4, 0);
      const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.4, 16), this.mats.carbonSteel);
      bMesh.position.set(0, 0.35, 0);
      bGroup.add(bMesh);
      group.add(bGroup);
    }

    return group;
  }

  // 11. Build Overhead Condenser Bank on Structural Rack (e.g. E-205 A/B)
  public buildOverheadCondenserBank(options: {
    length: number;
    diameter: number;
    numShells: number;
  }): THREE.Group {
    const group = new THREE.Group();
    const len = options.length;
    const d = options.diameter;
    const num = options.numShells;

    // Elevated Steel Support Structure
    const rackH = 5.0;
    const rackW = num * (d * 1.8) + 1.2;
    const rackGeo = new THREE.BoxGeometry(rackW, 0.3, len + 1.2);
    const platform = new THREE.Mesh(rackGeo, this.mats.catwalkMat);
    platform.position.set(0, rackH, 0);
    group.add(platform);

    // Support Legs
    for (let x of [-rackW / 2 + 0.4, rackW / 2 - 0.4]) {
      for (let z of [-len / 2 + 0.4, len / 2 - 0.4]) {
        const legGeo = new THREE.BoxGeometry(0.3, rackH, 0.3);
        const leg = new THREE.Mesh(legGeo, this.mats.carbonSteel);
        leg.position.set(x, rackH / 2, z);
        group.add(leg);
      }
    }

    // Exchanger Shells
    for (let i = 0; i < num; i++) {
      const sx = -rackW / 2 + 1.0 + i * (d * 1.8);
      const shellGeo = new THREE.CylinderGeometry(d / 2, d / 2, len, 24);
      const shell = new THREE.Mesh(shellGeo, this.mats.polishedSteel);
      shell.rotation.x = Math.PI / 2;
      shell.position.set(sx, rackH + d / 2 + 0.2, 0);
      group.add(shell);

      // Channel Heads (End Covers)
      const headGeo = new THREE.SphereGeometry(d / 2, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const frontHead = new THREE.Mesh(headGeo, this.mats.carbonSteel);
      frontHead.rotation.x = Math.PI / 2;
      frontHead.position.set(sx, rackH + d / 2 + 0.2, len / 2);
      group.add(frontHead);

      const rearHead = new THREE.Mesh(headGeo, this.mats.carbonSteel);
      rearHead.rotation.x = -Math.PI / 2;
      rearHead.position.set(sx, rackH + d / 2 + 0.2, -len / 2);
      group.add(rearHead);
    }

    return group;
  }

  // 12. Build World-Scale Synthesis Gas Compressor Train (K-301 & KT-301 HP Turbine Driver with Interstages, Condenser & Skids)
  public buildSyngasCompressorK301Train(): { group: THREE.Group; shaftRotors: THREE.Mesh[] } {
    const group = new THREE.Group();
    const shaftRotors: THREE.Mesh[] = [];

    const concreteMat = this.mats.concreteMat;
    const carbonSteel = this.mats.carbonSteel;
    const polishedSteel = this.mats.polishedSteel;
    const heatSteel = this.mats.heatSteel;
    const flangeMat = this.mats.flangeMat;
    const catwalkMat = this.mats.catwalkMat;
    const railingMat = this.mats.railingMat;
    const amberMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.3 }); // Safety Amber
    const motorBlue = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.7, roughness: 0.3 }); // Electric Motor Blue
    const lubeGreen = new THREE.MeshStandardMaterial({ color: 0x065f46, metalness: 0.5, roughness: 0.4 }); // Lube Skid Green
    const panelGrey = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 }); // Instrument Panel Stainless

    // ==========================================
    // A. REINFORCED CONCRETE TABLETOP FOUNDATION
    // ==========================================
    // 1. Grade Foundation Footing Mat
    const footMatGeo = new THREE.BoxGeometry(17.0, 0.4, 7.0);
    const footMat = new THREE.Mesh(footMatGeo, concreteMat);
    footMat.position.set(0, 0.2, 0);
    group.add(footMat);

    // 2. Heavy Concrete Columns supporting the Tabletop Deck
    const colPositions = [
      [-7.2, -2.4], [-7.2, 2.4],
      [-2.4, -2.4], [-2.4, 2.4],
      [2.4, -2.4], [2.4, 2.4],
      [7.2, -2.4], [7.2, 2.4]
    ];
    colPositions.forEach(([cx, cz]) => {
      const colGeo = new THREE.BoxGeometry(1.0, 1.2, 1.0);
      const colMesh = new THREE.Mesh(colGeo, concreteMat);
      colMesh.position.set(cx, 1.0, cz);
      group.add(colMesh);
    });

    // 3. Elevated Tabletop Deck (Grade Y = 1.6m)
    const deckGeo = new THREE.BoxGeometry(16.0, 0.6, 6.2);
    const deck = new THREE.Mesh(deckGeo, concreteMat);
    deck.position.set(0, 1.9, 0);
    group.add(deck);

    // 4. Industrial Steel Platform Catwalk & Yellow Safety Handrails on Deck
    const catGeo = new THREE.BoxGeometry(16.4, 0.08, 6.6);
    const catwalk = new THREE.Mesh(catGeo, catwalkMat);
    catwalk.position.set(0, 2.24, 0);
    group.add(catwalk);

    // Railing perimeter around deck
    const makeRail = (x: number, y: number, z: number, w: number, d: number) => {
      const rGeo = new THREE.BoxGeometry(w, 0.9, d);
      const rMesh = new THREE.Mesh(rGeo, railingMat);
      rMesh.position.set(x, y + 0.45, z);
      group.add(rMesh);
    };
    makeRail(0, 2.28, 3.25, 16.2, 0.06); // Front rail
    makeRail(0, 2.28, -3.25, 16.2, 0.06); // Back rail
    makeRail(-8.1, 2.28, 0, 0.06, 6.4); // Left rail
    makeRail(8.1, 2.28, 0, 0.06, 6.4); // Right rail

    // Access Stairway on East Side (Grade to Deck)
    const numSteps = 8;
    for (let s = 0; s < numSteps; s++) {
      const sy = 0.2 + (s / numSteps) * 2.08;
      const sz = 3.4 + s * 0.35;
      const stepGeo = new THREE.BoxGeometry(1.2, 0.12, 0.35);
      const stepMesh = new THREE.Mesh(stepGeo, catwalkMat);
      stepMesh.position.set(7.2, sy, sz);
      group.add(stepMesh);
    }

    // Heavy Continuous Steel Machine Baseplate Skid
    const baseplateGeo = new THREE.BoxGeometry(14.8, 0.35, 3.2);
    const baseplate = new THREE.Mesh(baseplateGeo, carbonSteel);
    baseplate.position.set(0, 2.45, 0);
    group.add(baseplate);

    // =========================================================================
    // B. MACHINE TRAIN (ON CENTERLINE Y = 3.6m, Z = 0)
    // 1. KT-301 HP Steam Turbine -> 2. Coupling 1 -> 3. K-301 LPC -> 4. Coupling 2 -> 5. K-301 HPC
    // =========================================================================

    // 1. KT-301 / K-301T HIGH-PRESSURE EXTRACTION STEAM TURBINE DRIVER (X = +4.5m)
    const turbX = 4.6;
    const turbCenterY = 3.6;

    // Steam Turbine Outer Heavy Barrel Casing
    const turbGeo = new THREE.CylinderGeometry(1.35, 1.45, 3.2, 24);
    const turbCasing = new THREE.Mesh(turbGeo, heatSteel);
    turbCasing.rotation.z = Math.PI / 2;
    turbCasing.position.set(turbX, turbCenterY, 0);
    group.add(turbCasing);

    // Thermal Insulation Lagging Cover Plates
    const lagGeo = new THREE.CylinderGeometry(1.48, 1.48, 2.6, 16);
    const lagging = new THREE.Mesh(lagGeo, this.mats.insulationMat);
    lagging.rotation.z = Math.PI / 2;
    lagging.position.set(turbX, turbCenterY, 0);
    group.add(lagging);

    // HP Steam Inlet Steam Chest & Emergency Stop Valve (ESV-301) on Top
    const chestGeo = new THREE.BoxGeometry(1.6, 0.8, 1.2);
    const chest = new THREE.Mesh(chestGeo, heatSteel);
    chest.position.set(turbX + 0.3, turbCenterY + 1.6, 0);
    group.add(chest);

    // Hydraulic Actuator for Governor Throttle Valves (SIC-301)
    const actGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.9, 16);
    const actMesh = new THREE.Mesh(actGeo, polishedSteel);
    actMesh.position.set(turbX + 0.3, turbCenterY + 2.3, 0);
    group.add(actMesh);

    // 104 kg/cm²G High Pressure Steam Inlet Pipe (510°C) with insulation
    const hpSteamGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.2, 16);
    const hpSteamPipe = new THREE.Mesh(hpSteamGeo, this.mats.insulationMat);
    hpSteamPipe.position.set(turbX + 0.3, turbCenterY + 3.4, 0);
    group.add(hpSteamPipe);

    // Turbine Turning Gear (Barring Motor Unit) on Outboard End
    const barGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
    const barringMotor = new THREE.Mesh(barGeo, motorBlue);
    barringMotor.rotation.z = Math.PI / 2;
    barringMotor.position.set(turbX + 1.9, turbCenterY - 0.3, 0.6);
    group.add(barringMotor);

    // Turbine Downward Exhaust Hood (leading to Surface Condenser E-306 underneath)
    const exhGeo = new THREE.BoxGeometry(2.0, 1.4, 1.8);
    const exhHood = new THREE.Mesh(exhGeo, carbonSteel);
    exhHood.position.set(turbX - 0.2, turbCenterY - 1.2, 0);
    group.add(exhHood);

    // 2. HIGH-SPEED FLEXIBLE COUPLING 1 (Turbine to LPC) (X = +2.4m)
    const coup1X = 2.4;
    const cGuard1Geo = new THREE.CylinderGeometry(0.65, 0.65, 0.9, 20);
    const cGuard1 = new THREE.Mesh(cGuard1Geo, amberMat);
    cGuard1.rotation.z = Math.PI / 2;
    cGuard1.position.set(coup1X, turbCenterY, 0);
    group.add(cGuard1);

    // 3. K-301 LOW PRESSURE CENTRIFUGAL COMPRESSOR CASING (STAGES 1 & 2) (X = 0.0m)
    const lpcX = 0.0;
    const lpcGeo = new THREE.CylinderGeometry(1.25, 1.25, 3.4, 24);
    const lpcCasing = new THREE.Mesh(lpcGeo, polishedSteel);
    lpcCasing.rotation.z = Math.PI / 2;
    lpcCasing.position.set(lpcX, turbCenterY, 0);
    group.add(lpcCasing);

    // Horizontal Split Flange Ribs
    const ribGeo = new THREE.BoxGeometry(3.6, 0.15, 2.7);
    const rib = new THREE.Mesh(ribGeo, flangeMat);
    rib.position.set(lpcX, turbCenterY, 0);
    group.add(rib);

    // LPC Nozzles:
    // - Stage 1 Suction (DN500 / 20", 25 bar from Methanation, Front Bottom)
    const s1NozGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.4, 16);
    const s1Noz = new THREE.Mesh(s1NozGeo, flangeMat);
    s1Noz.rotation.x = Math.PI / 2;
    s1Noz.position.set(lpcX + 1.0, turbCenterY - 0.5, 1.4);
    group.add(s1Noz);

    // - Stage 1 Discharge (Top to E-311 Intercooler)
    const d1NozGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.2, 16);
    const d1Noz = new THREE.Mesh(d1NozGeo, flangeMat);
    d1Noz.position.set(lpcX + 0.3, turbCenterY + 1.5, 0);
    group.add(d1Noz);

    // - Stage 2 Suction (Rear Bottom from V-311 Knockout Drum)
    const s2NozGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.4, 16);
    const s2Noz = new THREE.Mesh(s2NozGeo, flangeMat);
    s2Noz.rotation.x = -Math.PI / 2;
    s2Noz.position.set(lpcX - 0.3, turbCenterY - 0.5, -1.4);
    group.add(s2Noz);

    // - Stage 2 Discharge (Top to E-312 Intercooler)
    const d2NozGeo = new THREE.CylinderGeometry(0.30, 0.30, 1.2, 16);
    const d2Noz = new THREE.Mesh(d2NozGeo, flangeMat);
    d2Noz.position.set(lpcX - 1.0, turbCenterY + 1.5, 0);
    group.add(d2Noz);

    // Bearing Pedestals & Bently Nevada Vibration Probes on LPC
    for (let bx of [lpcX - 1.7, lpcX + 1.7]) {
      const bPedGeo = new THREE.BoxGeometry(0.6, 1.2, 1.0);
      const bPed = new THREE.Mesh(bPedGeo, carbonSteel);
      bPed.position.set(bx, turbCenterY - 0.6, 0);
      group.add(bPed);

      // Proximity probe terminal junction box
      const jBoxGeo = new THREE.BoxGeometry(0.2, 0.25, 0.2);
      const jBox = new THREE.Mesh(jBoxGeo, amberMat);
      jBox.position.set(bx, turbCenterY, 0.6);
      group.add(jBox);
    }

    // 4. HIGH-SPEED INTERMEDIATE DIAPHRAGM COUPLING 2 (LPC to HPC) (X = -2.2m)
    const coup2X = -2.2;
    const cGuard2Geo = new THREE.CylinderGeometry(0.60, 0.60, 0.8, 20);
    const cGuard2 = new THREE.Mesh(cGuard2Geo, amberMat);
    cGuard2.rotation.z = Math.PI / 2;
    cGuard2.position.set(coup2X, turbCenterY, 0);
    group.add(cGuard2);

    // 5. K-301 INTERMEDIATE/HIGH-PRESSURE CASING (CASING 2: STAGES 3 & 4) (X = -4.0m)
    const hpcX = -4.0;
    // Heavy Barrel Forged Steel Casing for high pressure (up to 239 kg/cm²G)
    const hpcGeo = new THREE.CylinderGeometry(1.28, 1.28, 2.6, 24);
    const hpcCasing = new THREE.Mesh(hpcGeo, polishedSteel);
    hpcCasing.rotation.z = Math.PI / 2;
    hpcCasing.position.set(hpcX, turbCenterY, 0);
    group.add(hpcCasing);

    // Circular End Covers for HPC
    const coverGeo = new THREE.CylinderGeometry(1.40, 1.40, 0.30, 24);
    const coverL = new THREE.Mesh(coverGeo, flangeMat);
    coverL.rotation.z = Math.PI / 2;
    coverL.position.set(hpcX - 1.35, turbCenterY, 0);
    group.add(coverL);

    const coverR = new THREE.Mesh(coverGeo, flangeMat);
    coverR.rotation.z = Math.PI / 2;
    coverR.position.set(hpcX + 1.35, turbCenterY, 0);
    group.add(coverR);

    // HPC Nozzles:
    // - Stage 3 Suction (from V-303 KO Drum, 43°C)
    const s3NozGeo = new THREE.CylinderGeometry(0.28, 0.28, 1.3, 16);
    const s3Noz = new THREE.Mesh(s3NozGeo, flangeMat);
    s3Noz.rotation.x = Math.PI / 2;
    s3Noz.position.set(hpcX + 0.8, turbCenterY - 0.4, 1.4);
    group.add(s3Noz);

    // - Stage 3 Discharge (to E-304 Intercooler)
    const d3NozGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.2, 16);
    const d3Noz = new THREE.Mesh(d3NozGeo, flangeMat);
    d3Noz.position.set(hpcX + 0.3, turbCenterY + 1.5, 0);
    group.add(d3Noz);

    // - Stage 4 Suction (from V-304 KO Drum, 43°C)
    const s4NozGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.3, 16);
    const s4Noz = new THREE.Mesh(s4NozGeo, flangeMat);
    s4Noz.rotation.x = -Math.PI / 2;
    s4Noz.position.set(hpcX - 0.3, turbCenterY - 0.4, -1.4);
    group.add(s4Noz);

    // - Stage 4 FINAL DISCHARGE (239 kg/cm²G to E-315 Aftercooler)
    const d4NozGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.3, 16);
    const d4Noz = new THREE.Mesh(d4NozGeo, flangeMat);
    d4Noz.position.set(hpcX - 0.8, turbCenterY + 1.5, 0);
    group.add(d4Noz);

    // 6. HIGH-SPEED INTERMEDIATE DIAPHRAGM COUPLING 3 (HPC to Recycle Casing) (X = -5.8m)
    const coup3X = -5.8;
    const cGuard3Geo = new THREE.CylinderGeometry(0.58, 0.58, 0.7, 20);
    const cGuard3 = new THREE.Mesh(cGuard3Geo, amberMat);
    cGuard3.rotation.z = Math.PI / 2;
    cGuard3.position.set(coup3X, turbCenterY, 0);
    group.add(cGuard3);

    // 7. K-301 R-S RECYCLE SYNTHESIS GAS CASING (CASING 3: CIRCULATOR STAGE) (X = -7.2m)
    const recX = -7.2;
    const recGeo = new THREE.CylinderGeometry(1.22, 1.22, 2.0, 24);
    const recCasing = new THREE.Mesh(recGeo, polishedSteel);
    recCasing.rotation.z = Math.PI / 2;
    recCasing.position.set(recX, turbCenterY, 0);
    group.add(recCasing);

    // Heavy Internal Diaphragm Bulkhead Indicator Ring (Diaphragm separation from make-up gas)
    const diaGeo = new THREE.TorusGeometry(1.30, 0.08, 16, 32);
    const diaRing = new THREE.Mesh(diaGeo, amberMat);
    diaRing.rotation.y = Math.PI / 2;
    diaRing.position.set(recX, turbCenterY, 0);
    group.add(diaRing);

    // Circular End Covers for Recycle Casing
    const recCoverL = new THREE.Mesh(coverGeo, flangeMat);
    recCoverL.rotation.z = Math.PI / 2;
    recCoverL.position.set(recX - 1.05, turbCenterY, 0);
    group.add(recCoverL);

    const recCoverR = new THREE.Mesh(coverGeo, flangeMat);
    recCoverR.rotation.z = Math.PI / 2;
    recCoverR.position.set(recX + 1.05, turbCenterY, 0);
    group.add(recCoverR);

    // Recycle Suction Nozzle (from V-401 Overheads, Loop gas)
    const rSucNozGeo = new THREE.CylinderGeometry(0.30, 0.30, 1.4, 16);
    const rSucNoz = new THREE.Mesh(rSucNozGeo, flangeMat);
    rSucNoz.rotation.x = Math.PI / 2;
    rSucNoz.position.set(recX + 0.4, turbCenterY - 0.4, 1.4);
    group.add(rSucNoz);

    // Recycle Discharge Nozzle (239 kg/cm²G, +28.6 kg/cm²G boost head to Loop)
    const rDisNozGeo = new THREE.CylinderGeometry(0.30, 0.30, 1.3, 16);
    const rDisNoz = new THREE.Mesh(rDisNozGeo, flangeMat);
    rDisNoz.position.set(recX - 0.4, turbCenterY + 1.5, 0);
    group.add(rDisNoz);

    // Balance Piston Leak-Off Return Line
    const balGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.2, 12);
    const balPipe = new THREE.Mesh(balGeo, polishedSteel);
    balPipe.rotation.z = Math.PI / 2;
    balPipe.position.set(hpcX - 1.0, turbCenterY + 1.45, 0.9);
    group.add(balPipe);

    // =========================================================================
    // ANTI-SURGE BYPASS PROTECTION SYSTEMS (As detailed in Technical Manual)
    // =========================================================================
    const asValveMat = new THREE.MeshStandardMaterial({
      color: 0xd32f2f,
      roughness: 0.3,
      metalness: 0.6,
      name: 'anti_surge_valve_red'
    });

    // 1. Loop 1 Anti-Surge: 2nd Stage Discharge -> 1st Stage Suction with FV-301
    const as1PipeGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.6, 12);
    const as1Pipe = new THREE.Mesh(as1PipeGeo, amberMat);
    as1Pipe.rotation.z = Math.PI / 2;
    as1Pipe.position.set(0.0, turbCenterY + 2.2, 1.0);
    group.add(as1Pipe);

    const fv301Geo = new THREE.SphereGeometry(0.24, 16, 16);
    const fv301 = new THREE.Mesh(fv301Geo, asValveMat); // Safety red control valve
    fv301.position.set(0.0, turbCenterY + 2.2, 1.0);
    group.add(fv301);

    // 2. Loop 2 Anti-Surge: 4th Stage Discharge -> 3rd Stage Suction with FV-303
    const as2PipeGeo = new THREE.CylinderGeometry(0.10, 0.10, 2.4, 12);
    const as2Pipe = new THREE.Mesh(as2PipeGeo, amberMat);
    as2Pipe.rotation.z = Math.PI / 2;
    as2Pipe.position.set(hpcX, turbCenterY + 2.2, 1.0);
    group.add(as2Pipe);

    const fv303Geo = new THREE.SphereGeometry(0.22, 16, 16);
    const fv303 = new THREE.Mesh(fv303Geo, asValveMat);
    fv303.position.set(hpcX, turbCenterY + 2.2, 1.0);
    group.add(fv303);

    // 3. Loop 3 Anti-Surge: Recycle Discharge -> Recycle Suction via Condenser with FV-305
    const as3PipeGeo = new THREE.CylinderGeometry(0.10, 0.10, 1.8, 12);
    const as3Pipe = new THREE.Mesh(as3PipeGeo, amberMat);
    as3Pipe.rotation.z = Math.PI / 2;
    as3Pipe.position.set(recX, turbCenterY + 2.2, 1.0);
    group.add(as3Pipe);

    const fv305Geo = new THREE.SphereGeometry(0.22, 16, 16);
    const fv305 = new THREE.Mesh(fv305Geo, asValveMat);
    fv305.position.set(recX, turbCenterY + 2.2, 1.0);
    group.add(fv305);

    // 8. CONTINUOUS SPINNING ROTOR SHAFT
    const mainShaftGeo = new THREE.CylinderGeometry(0.20, 0.20, 16.2, 16);
    const shaftRotor = new THREE.Mesh(mainShaftGeo, polishedSteel);
    shaftRotor.rotation.z = Math.PI / 2;
    shaftRotor.position.set(-1.2, turbCenterY, 0);
    group.add(shaftRotor);
    shaftRotors.push(shaftRotor);

    // =========================================================================
    // C. SUPPORT AUXILIARY SKIDS & EQUIPMENT
    // =========================================================================

    // 1. TURBINE SURFACE CONDENSER (E-306) (Located underneath turbine)
    const condGeo = new THREE.CylinderGeometry(0.95, 0.95, 3.6, 24);
    const condenser = new THREE.Mesh(condGeo, polishedSteel);
    condenser.rotation.x = Math.PI / 2;
    condenser.position.set(turbX - 0.2, 0.9, 0);
    group.add(condenser);

    // Hotwell Sump on Bottom
    const hotwellGeo = new THREE.BoxGeometry(1.6, 0.5, 1.2);
    const hotwell = new THREE.Mesh(hotwellGeo, carbonSteel);
    hotwell.position.set(turbX - 0.2, 0.25, 0);
    group.add(hotwell);

    // Dual Condensate Extraction Pumps (P-306 A/B)
    for (let cp of [-0.6, 0.6]) {
      const pGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16);
      const pMesh = new THREE.Mesh(pGeo, motorBlue);
      pMesh.rotation.z = Math.PI / 2;
      pMesh.position.set(turbX + 1.8, 0.4, cp);
      group.add(pMesh);
    }

    // 2. LUBE OIL CONSOLE SKID (V-305, P-305 A/B, E-305 A/B, DUPLEX FILTERS)
    // Lube Oil Reservoir Tank V-305
    const oilTankGeo = new THREE.BoxGeometry(3.6, 1.0, 1.4);
    const oilTank = new THREE.Mesh(oilTankGeo, lubeGreen);
    oilTank.position.set(0, 0.5, 3.6);
    group.add(oilTank);

    // Main AC Motor Lube Pump & Auxiliary DC Lube Pump P-305 A/B
    for (let op of [-1.0, 1.0]) {
      const opGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.7, 16);
      const opMesh = new THREE.Mesh(opGeo, motorBlue);
      opMesh.position.set(op, 1.2, 3.6);
      group.add(opMesh);
    }

    // Dual Lube Oil Coolers E-305 A/B (Shell & Tube)
    for (let oc of [-0.4, 0.4]) {
      const ocGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.6, 16);
      const ocMesh = new THREE.Mesh(ocGeo, polishedSteel);
      ocMesh.rotation.z = Math.PI / 2;
      ocMesh.position.set(oc, 1.6, 3.6);
      group.add(ocMesh);
    }

    // Duplex Oil Filters with Differential Pressure Switch (DPS-305)
    for (let fl of [-1.5, -1.2]) {
      const flGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.9, 16);
      const flMesh = new THREE.Mesh(flGeo, carbonSteel);
      flMesh.position.set(fl, 1.5, 3.6);
      group.add(flMesh);
    }

    // Overhead Emergency Lube Oil Rundown Tank (Mounted high on support column)
    const runPostGeo = new THREE.BoxGeometry(0.2, 3.6, 0.2);
    const runPost = new THREE.Mesh(runPostGeo, carbonSteel);
    runPost.position.set(2.6, 3.8, 3.6);
    group.add(runPost);

    const runTankGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.2, 16);
    const runTank = new THREE.Mesh(runTankGeo, polishedSteel);
    runTank.rotation.z = Math.PI / 2;
    runTank.position.set(2.6, 5.8, 3.6);
    group.add(runTank);

    // 3. DRY GAS SEAL CONSOLE & BUFFER CONDITIONING ENCLOSURE (V-306)
    const sealCabGeo = new THREE.BoxGeometry(1.6, 2.0, 0.8);
    const sealCab = new THREE.Mesh(sealCabGeo, panelGrey);
    sealCab.position.set(-4.8, 1.0, 3.6);
    group.add(sealCab);

    // Dual Seal Gas Coalescing Filter Bowls
    for (let sfx of [-5.2, -4.4]) {
      const sfGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 16);
      const sfMesh = new THREE.Mesh(sfGeo, polishedSteel);
      sfMesh.position.set(sfx, 1.2, 4.1);
      group.add(sfMesh);
    }

    // 4. INTERSTAGE COOLERS & KNOCKOUT SEPARATORS (North Side Z = -3.6m)
    // - E-311 (1st Stage Cooler) + V-311 (1st Stage KO Drum)
    const e311Geo = new THREE.CylinderGeometry(0.45, 0.45, 2.6, 16);
    const e311 = new THREE.Mesh(e311Geo, polishedSteel);
    e311.rotation.x = Math.PI / 2;
    e311.position.set(1.4, 1.6, -3.6);
    group.add(e311);

    const v311Geo = new THREE.CylinderGeometry(0.40, 0.40, 1.8, 16);
    const v311 = new THREE.Mesh(v311Geo, carbonSteel);
    v311.position.set(2.8, 1.5, -3.6);
    group.add(v311);

    // - E-312 (2nd Stage Cooler) + V-312 (2nd Stage KO Drum)
    const e312Geo = new THREE.CylinderGeometry(0.40, 0.40, 2.4, 16);
    const e312 = new THREE.Mesh(e312Geo, polishedSteel);
    e312.rotation.x = Math.PI / 2;
    e312.position.set(-1.0, 1.6, -3.6);
    group.add(e312);

    const v312Geo = new THREE.CylinderGeometry(0.35, 0.35, 1.7, 16);
    const v312 = new THREE.Mesh(v312Geo, carbonSteel);
    v312.position.set(0.2, 1.5, -3.6);
    group.add(v312);

    // - E-313 (3rd Stage Cooler) + V-313 (3rd Stage KO Drum)
    const e313Geo = new THREE.CylinderGeometry(0.35, 0.35, 2.2, 16);
    const e313 = new THREE.Mesh(e313Geo, polishedSteel);
    e313.rotation.x = Math.PI / 2;
    e313.position.set(-3.4, 1.6, -3.6);
    group.add(e313);

    const v313Geo = new THREE.CylinderGeometry(0.32, 0.32, 1.6, 16);
    const v313 = new THREE.Mesh(v313Geo, carbonSteel);
    v313.position.set(-2.2, 1.5, -3.6);
    group.add(v313);

    // 5. LOCAL UNIT CONTROL PANEL & DCS INSTRUMENTATION RACK (UCP-301)
    const ucpGeo = new THREE.BoxGeometry(1.6, 2.2, 0.6);
    const ucp = new THREE.Mesh(ucpGeo, panelGrey);
    ucp.position.set(6.4, 3.4, 2.2);
    group.add(ucp);

    // Digital Monitor Display Face
    const scrGeo = new THREE.BoxGeometry(1.2, 0.7, 0.05);
    const scrMat = new THREE.MeshBasicMaterial({ color: 0x052e16 }); // DCS Matrix Dark Green
    const scrMesh = new THREE.Mesh(scrGeo, scrMat);
    scrMesh.position.set(6.4, 3.7, 2.53);
    group.add(scrMesh);

    // Emergency ESD Push Button (Safety Red)
    const esdGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16);
    const esdMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 }); // Crimson Red
    const esdBtn = new THREE.Mesh(esdGeo, esdMat);
    esdBtn.rotation.x = Math.PI / 2;
    esdBtn.position.set(6.4, 2.8, 2.53);
    group.add(esdBtn);

    return { group, shaftRotors };
  }

  // 12. Build Atmospheric Refrigerated Cryogenic Ammonia Storage Tank (V-451 B)
  public buildRefrigeratedAmmoniaStorageTank(options: {
    diameter: number;
    height: number;
    isDoubleWall?: boolean;
    hasSpiralStairs?: boolean;
  }): THREE.Group {
    const group = new THREE.Group();
    const r = options.diameter / 2;
    const h = options.height;

    // Foundation Base Pad
    const padGeo = new THREE.CylinderGeometry(r + 1.2, r + 1.6, 0.8, 36);
    const pad = new THREE.Mesh(padGeo, this.mats.concreteMat);
    pad.position.set(0, 0.4, 0);
    group.add(pad);

    // Main Outer Cryogenic Cylindrical Shell
    const shellGeo = new THREE.CylinderGeometry(r, r, h, 36);
    const shell = new THREE.Mesh(shellGeo, this.mats.insulationMat);
    shell.position.set(0, h / 2 + 0.8, 0);
    group.add(shell);

    // Domed Spherical Roof
    const domeGeo = new THREE.SphereGeometry(r, 36, 18, 0, Math.PI * 2, 0, Math.PI / 3);
    const dome = new THREE.Mesh(domeGeo, this.mats.insulationMat);
    dome.position.set(0, h + 0.8, 0);
    group.add(dome);

    // Roof Center Nitrogen Breather / PSV Relief Manifold
    const reliefGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.5, 16);
    const relief = new THREE.Mesh(reliefGeo, this.mats.flangeMat);
    relief.position.set(0, h + r * 0.5 + 2.0, 0);
    group.add(relief);

    // Perimeter Top Safety Gallery & Railing
    const platGeo = new THREE.CylinderGeometry(r + 0.6, r + 0.6, 0.2, 36);
    const plat = new THREE.Mesh(platGeo, this.mats.catwalkMat);
    plat.position.set(0, h + 0.8, 0);
    group.add(plat);

    const railGeo = new THREE.TorusGeometry(r + 0.55, 0.08, 8, 36);
    const rail = new THREE.Mesh(railGeo, this.mats.railingMat);
    rail.rotation.x = Math.PI / 2;
    rail.position.set(0, h + 1.8, 0);
    group.add(rail);

    // Spiral Staircase climbing the outer circumference
    if (options.hasSpiralStairs !== false) {
      const stepCount = 28;
      for (let i = 0; i < stepCount; i++) {
        const frac = i / stepCount;
        const angle = frac * Math.PI * 1.6;
        const sy = 0.8 + frac * h;
        const stepGeo = new THREE.BoxGeometry(1.2, 0.1, 0.6);
        const step = new THREE.Mesh(stepGeo, this.mats.catwalkMat);
        step.position.set(Math.cos(angle) * (r + 0.6), sy, Math.sin(angle) * (r + 0.6));
        step.rotation.y = -angle;
        group.add(step);
      }
    }

    // Liquid Ammonia Inlet Nozzle from P-401 A/B
    const nozzleGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.2, 16);
    const nozzle = new THREE.Mesh(nozzleGeo, this.mats.polishedSteel);
    nozzle.rotation.z = Math.PI / 2;
    nozzle.position.set(-r - 0.8, 2.5, 0);
    group.add(nozzle);

    // Tank Side Radar Level Gauge & Transmitter
    const ltGeo = new THREE.CylinderGeometry(0.15, 0.15, h * 0.8, 12);
    const lt = new THREE.Mesh(ltGeo, this.mats.flangeMat);
    lt.position.set(r + 0.4, h / 2 + 0.8, 0);
    group.add(lt);

    return group;
  }
}

