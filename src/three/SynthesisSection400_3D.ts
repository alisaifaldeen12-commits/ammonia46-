import * as THREE from 'three';
import { EquipmentInfo, MASTER_EQUIPMENT_DATA } from './PlantDiagramData';
import {
  createIndustrialCarbonSteelPipeTexture,
  createCarbonSteelBumpTexture
} from './TextureGenerator';

/**
 * Colossal 3D Digital Twin of Section 4: Ammonia Synthesis & Refrigeration (Unit 400)
 * Scaled up to Doubled Gigantic Engineering Proportions:
 * - Reactor R-401: Height 102m, Diameter 24m (Colossal Multi-Bed Converter Column)
 * - Fired Heater H-401: 28m x 26m Cabin Box, 108m Exhaust Stack with Strakes
 * - Effluent Exchangers E-401, E-402, E-403: Heights 50m - 68m, Diameters 14m - 15m
 * - Condenser Bank E-404 A/B: Dual 13m x 38m Shells
 * - Chilling Battery E-407, E-405, E-406: 13.5m - 14.5m Diameters, 38m Lengths
 * - High Pressure Separators V-401, V-402, V-409, V-405/6/7, V-408, V-310: Doubled Gigantic Vessels
 * - Compressors K-301 (Make-up/Recycle) & K-401 (Refrigeration Multi-Casing Train)
 * - 100% Stable, Rock-Solid, Zero Z-Fighting / Zero Flickering Geometry
 */
export class SynthesisSection400_3D {
  public group: THREE.Group;
  public interactiveMeshes: THREE.Object3D[] = [];
  public onSelectCallback?: (info: EquipmentInfo) => void;

  private particleSystems: Array<{
    points: THREE.Points;
    curve: THREE.CurvePath<THREE.Vector3>;
    progress: Float32Array;
    speed: number;
  }> = [];

  private rotatingShafts: THREE.Object3D[] = [];

  // Photorealistic Materials palette
  private matCarbonSteel!: THREE.MeshStandardMaterial;
  private matAlloySteel!: THREE.MeshStandardMaterial;
  private matHotSteelEffluent!: THREE.MeshStandardMaterial;
  private matCryoInsulation!: THREE.MeshStandardMaterial;
  private matConcretePad!: THREE.MeshStandardMaterial;
  private matTrenchGrate!: THREE.MeshStandardMaterial;
  private matYellowSafety!: THREE.MeshStandardMaterial;
  private matCatwalkSteel!: THREE.MeshStandardMaterial;
  private matFlange!: THREE.MeshStandardMaterial;
  private matStudBolt!: THREE.MeshStandardMaterial;
  private matValveBlue!: THREE.MeshStandardMaterial;
  private matValveGreen!: THREE.MeshStandardMaterial;
  private matValveAmber!: THREE.MeshStandardMaterial;
  private matLiquidAmmonia!: THREE.MeshStandardMaterial;
  private matFireGlow!: THREE.MeshStandardMaterial;
  private matBurnerFlame!: THREE.MeshStandardMaterial;
  private matChromeMoly!: THREE.MeshStandardMaterial;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'SynthesisSection400_3D_Twin';

    this.initMaterials();
    this.buildFoundationsAndStructures();
    this.buildMakeUpFeedAndRecycleK301Train();
    this.buildSynthesisReactorR401();
    this.buildEffluentCoolersTrain();
    this.buildChillingBatteryTrain();
    this.buildProductLetdownAndPumps();
    this.buildStartupHeaterAndManifold();
    this.buildRefrigerationCompressorTrain();
    this.buildPurgeAndVentRecoveryTrain();
    this.buildProcessPipingNetwork();
    this.buildEquipmentBadgesAndSigns();
    this.buildDcsInfoScreens();
  }

  private initMaterials() {
    const pipeDiff = createIndustrialCarbonSteelPipeTexture();
    const pipeBump = createCarbonSteelBumpTexture();

    this.matCarbonSteel = new THREE.MeshStandardMaterial({
      map: pipeDiff,
      bumpMap: pipeBump,
      bumpScale: 0.04,
      roughness: 0.35,
      metalness: 0.85,
      name: 'synth_carbon_steel'
    });

    this.matAlloySteel = new THREE.MeshStandardMaterial({
      color: 0x485a6a,
      roughness: 0.28,
      metalness: 0.9,
      name: 'synth_alloy_steel'
    });

    this.matHotSteelEffluent = new THREE.MeshStandardMaterial({
      color: 0x823326,
      roughness: 0.38,
      metalness: 0.82,
      name: 'synth_hot_effluent'
    });

    this.matCryoInsulation = new THREE.MeshStandardMaterial({
      color: 0xd6e4ee,
      roughness: 0.55,
      metalness: 0.2,
      name: 'synth_cryo_insul'
    });

    this.matConcretePad = new THREE.MeshStandardMaterial({
      color: 0x2a3644,
      roughness: 0.85,
      metalness: 0.1,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      name: 'synth_concrete'
    });

    this.matTrenchGrate = new THREE.MeshStandardMaterial({
      color: 0x182230,
      roughness: 0.7,
      metalness: 0.65,
      name: 'synth_grate'
    });

    this.matYellowSafety = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.4,
      name: 'synth_yellow'
    });

    this.matCatwalkSteel = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.75,
      name: 'synth_catwalk'
    });

    this.matFlange = new THREE.MeshStandardMaterial({
      color: 0x546577,
      roughness: 0.3,
      metalness: 0.88,
      name: 'synth_flange'
    });

    this.matStudBolt = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.95,
      name: 'synth_bolt'
    });

    this.matValveBlue = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.6,
      name: 'synth_valve_blue'
    });

    this.matValveGreen = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.3,
      metalness: 0.6,
      name: 'synth_valve_green'
    });

    this.matValveAmber = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.6,
      name: 'synth_valve_amber'
    });

    this.matLiquidAmmonia = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.2,
      metalness: 0.8,
      name: 'synth_nh3_liquid'
    });

    this.matFireGlow = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: 0xff4400,
      emissiveIntensity: 0.95,
      roughness: 0.2,
      name: 'furnace_fire_glow'
    });

    this.matBurnerFlame = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.0,
      roughness: 0.1,
      name: 'furnace_burner_flame'
    });

    this.matChromeMoly = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.2,
      metalness: 0.92,
      name: 'furnace_chrome_moly'
    });
  }

  // 1. Reinforced Concrete Foundation Yard (280m x 220m Gigantic Complex)
  private buildFoundationsAndStructures() {
    const slabGeo = new THREE.BoxGeometry(290, 1.6, 230);
    const slab = new THREE.Mesh(slabGeo, this.matConcretePad);
    slab.position.set(0, -0.8, 30);
    slab.receiveShadow = true;
    this.group.add(slab);

    // Perimeter Access Road
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x18202a, roughness: 0.94, metalness: 0.05 });
    const roadN = new THREE.Mesh(new THREE.BoxGeometry(320, 0.15, 18), roadMat);
    roadN.position.set(0, -0.9, -95);
    this.group.add(roadN);

    const roadS = new THREE.Mesh(new THREE.BoxGeometry(320, 0.15, 18), roadMat);
    roadS.position.set(0, -0.9, 155);
    this.group.add(roadS);

    const roadE = new THREE.Mesh(new THREE.BoxGeometry(18, 0.15, 250), roadMat);
    roadE.position.set(155, -0.9, 30);
    this.group.add(roadE);

    const roadW = new THREE.Mesh(new THREE.BoxGeometry(18, 0.15, 250), roadMat);
    roadW.position.set(-155, -0.9, 30);
    this.group.add(roadW);

    // Perimeter Yellow Safety Curbs
    const curbGeoL = new THREE.BoxGeometry(1.0, 0.45, 230);
    const curbL = new THREE.Mesh(curbGeoL, this.matYellowSafety);
    curbL.position.set(-145.5, 0.22, 30);
    this.group.add(curbL);

    const curbR = new THREE.Mesh(curbGeoL, this.matYellowSafety);
    curbR.position.set(145.5, 0.22, 30);
    this.group.add(curbR);

    // Drainage Grates
    [-55, -10, 35, 75, 115].forEach((zPos) => {
      const trenchGeo = new THREE.BoxGeometry(270, 0.1, 2.2);
      const trench = new THREE.Mesh(trenchGeo, this.matTrenchGrate);
      trench.position.set(0, 0.05, zPos);
      this.group.add(trench);
    });

    // Colossal Multi-Tier Structural Steel Pipe Racks (Bents)
    const rackBents = [-115, -80, -45, -10, 25, 60, 95, 125];
    rackBents.forEach((x) => {
      [-35.0, 0.0, 25.0, 45.0, 65.0, 95.0].forEach((z) => {
        const colGeo = new THREE.BoxGeometry(1.0, 36.0, 1.0);
        const col = new THREE.Mesh(colGeo, this.matCatwalkSteel);
        col.position.set(x, 18.0, z);
        this.group.add(col);

        const footGeo = new THREE.BoxGeometry(2.8, 1.2, 2.8);
        const foot = new THREE.Mesh(footGeo, this.matConcretePad);
        foot.position.set(x, 0.6, z);
        this.group.add(foot);
      });

      // 4-Tier Heavy transverse Piperack beams
      [6.5, 15.0, 24.0, 33.0].forEach((y) => {
        const beamGeo = new THREE.BoxGeometry(0.8, 0.8, 140.0);
        const beam = new THREE.Mesh(beamGeo, this.matCatwalkSteel);
        beam.position.set(x, y, 30.0);
        this.group.add(beam);
      });
    });

    // 6 High-Mast Floodlight Towers (70m height)
    [
      { x: -135, z: -75 },
      { x: 135, z: -75 },
      { x: -135, z: 135 },
      { x: 135, z: 135 },
      { x: -135, z: 30 },
      { x: 135, z: 30 }
    ].forEach((mast) => {
      const mastGeo = new THREE.CylinderGeometry(1.0, 2.2, 70.0, 16);
      const mastMesh = new THREE.Mesh(mastGeo, this.matCarbonSteel);
      mastMesh.position.set(mast.x, 35.0, mast.z);
      this.group.add(mastMesh);

      const mastBase = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.8, 5.5), this.matConcretePad);
      mastBase.position.set(mast.x, 0.9, mast.z);
      this.group.add(mastBase);

      const crown = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 0.8, 16), this.matCatwalkSteel);
      crown.position.set(mast.x, 70.0, mast.z);
      this.group.add(crown);

      for (let f = 0; f < 8; f++) {
        const angle = (f / 8) * Math.PI * 2;
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.8), this.matValveBlue);
        lamp.position.set(mast.x + Math.cos(angle) * 3.8, 70.5, mast.z + Math.sin(angle) * 3.8);
        this.group.add(lamp);
      }
    });
  }

  // 2. R-401 Ammonia Synthesis Converter Column (Doubled Colossal Reactor: 102m Height, 24m Diameter)
  private buildSynthesisReactorR401() {
    const rGroup = new THREE.Group();
    rGroup.position.set(65, 0, -35);
    rGroup.name = 'R-401';

    // Colossal Octagonal Reinforced Concrete Foundation Mat
    const footGeo = new THREE.CylinderGeometry(18.0, 20.0, 4.5, 8);
    const foot = new THREE.Mesh(footGeo, this.matConcretePad);
    foot.position.set(0, 2.25, 0);
    rGroup.add(foot);

    // Heavy Support Skirt with Base Anchor Ring (Diameter 24m, Height 14m)
    const skirtGeo = new THREE.CylinderGeometry(12.0, 13.2, 14.0, 36, 1, true);
    const skirt = new THREE.Mesh(skirtGeo, this.matCarbonSteel);
    skirt.position.set(0, 11.5, 0);
    rGroup.add(skirt);

    // Skirt Access Manways
    [-12.0, 12.0].forEach((mx) => {
      const manwayGeo = new THREE.CylinderGeometry(1.8, 1.8, 3.2, 16);
      const manway = new THREE.Mesh(manwayGeo, this.matFlange);
      manway.rotation.z = Math.PI / 2;
      manway.position.set(mx, 10.0, 0);
      rGroup.add(manway);
    });

    // Colossal Forged Alloy Steel Pressure Shell (Diameter 23.0m, Height 76.0m)
    const shellGeo = new THREE.CylinderGeometry(11.5, 11.5, 76.0, 40);
    const shell = new THREE.Mesh(shellGeo, this.matAlloySteel);
    shell.position.set(0, 56.5, 0);
    rGroup.add(shell);

    // Outer Thermal Insulation Shroud Jacket (Diameter 24.2m, Height 70.0m)
    const shroudGeo = new THREE.CylinderGeometry(12.1, 12.1, 70.0, 40, 1, true);
    const shroud = new THREE.Mesh(shroudGeo, this.matCarbonSteel);
    shroud.position.set(0, 55.0, 0);
    rGroup.add(shroud);

    // Forged Hemispherical Heads (Radius 11.5m)
    const domeGeo = new THREE.SphereGeometry(11.5, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const topDome = new THREE.Mesh(domeGeo, this.matAlloySteel);
    topDome.position.set(0, 94.5, 0);
    rGroup.add(topDome);

    const botDome = new THREE.Mesh(domeGeo, this.matHotSteelEffluent);
    botDome.rotation.x = Math.PI;
    botDome.position.set(0, 18.5, 0);
    rGroup.add(botDome);

    // Top Main Closure Girth Flange with 96 Stud Bolts (Diameter 25.5m)
    const topFlangeGeo = new THREE.CylinderGeometry(12.8, 12.8, 2.2, 40);
    const topFlange = new THREE.Mesh(topFlangeGeo, this.matFlange);
    topFlange.position.set(0, 94.5, 0);
    rGroup.add(topFlange);

    for (let i = 0; i < 96; i++) {
      const angle = (i / 96) * Math.PI * 2;
      const boltGeo = new THREE.CylinderGeometry(0.24, 0.24, 2.8, 8);
      const bolt = new THREE.Mesh(boltGeo, this.matStudBolt);
      bolt.position.set(Math.cos(angle) * 12.3, 94.5, Math.sin(angle) * 12.3);
      rGroup.add(bolt);
    }

    // 5 Internal Catalyst Bed Catwalk Galleries & Safety Handrails
    const bedElevations = [28.0, 46.0, 64.0, 82.0, 96.0];
    bedElevations.forEach((y) => {
      const ringGeo = new THREE.TorusGeometry(12.15, 0.45, 12, 40);
      const ring = new THREE.Mesh(ringGeo, this.matFlange);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, y, 0);
      rGroup.add(ring);

      const platGeo = new THREE.CylinderGeometry(15.2, 15.2, 0.45, 40);
      const plat = new THREE.Mesh(platGeo, this.matCatwalkSteel);
      plat.position.set(0, y - 0.2, 0);
      rGroup.add(plat);

      const railGeo = new THREE.TorusGeometry(15.1, 0.15, 8, 40);
      const rail = new THREE.Mesh(railGeo, this.matYellowSafety);
      rail.rotation.x = Math.PI / 2;
      rail.position.set(0, y + 1.8, 0);
      rGroup.add(rail);
    });

    // Spiral Access Staircase (180 steps wrapping up to 96m)
    const steps = 180;
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 10.5;
      const y = 18.5 + (i / steps) * 78.0;
      const stepGeo = new THREE.BoxGeometry(3.2, 0.2, 0.85);
      const step = new THREE.Mesh(stepGeo, this.matCatwalkSteel);
      step.position.set(Math.cos(angle) * 13.6, y, Math.sin(angle) * 13.6);
      step.rotation.y = -angle;
      rGroup.add(step);
    }

    // Top Bed 1 Main Feed Nozzle (380°C) with WNRF Flange at Y=106.0m
    this.addNozzleWithFlange(rGroup, new THREE.Vector3(0, 106.0, 0), new THREE.Vector3(0, 1, 0), 1.6, 5.0);

    // Quench Gas Side Injection Nozzles (TIC-403 / TIC-404)
    this.addNozzleWithFlange(rGroup, new THREE.Vector3(12.2, 46.0, 0), new THREE.Vector3(1, 0, 0), 0.95, 3.2);
    this.addNozzleWithFlange(rGroup, new THREE.Vector3(12.2, 28.0, 0), new THREE.Vector3(1, 0, 0), 0.95, 3.2);

    // Reactor Bottom Hot Effluent Nozzle (470°C) at Y=12.0m
    this.addNozzleWithFlange(rGroup, new THREE.Vector3(0, 12.0, 0), new THREE.Vector3(0, -1, 0), 1.6, 5.0);

    // Reactor Wall Shroud Inlet (Bottom Annulus y=20.0) & Outlet (Top Annulus y=88.0)
    this.addNozzleWithFlange(rGroup, new THREE.Vector3(0, 20.0, 12.2), new THREE.Vector3(0, 0, 1), 1.2, 3.5);
    this.addNozzleWithFlange(rGroup, new THREE.Vector3(-12.2, 88.0, 0), new THREE.Vector3(-1, 0, 0), 1.2, 3.5);

    this.registerInteractive(rGroup, 'r-401');
    this.group.add(rGroup);
  }

  // 3. Massive Sequential Effluent Coolers Row (Row Z = -35)
  private buildEffluentCoolersTrain() {
    // E-401: Hot Gas Feed Effluent Exchanger (Vertical Shell & Tube: Diameter 15.0m, Height 56.0m) at (25, 0, -35)
    const e401 = this.createVerticalExchanger('E-401', 15.0, 56.0, this.matHotSteelEffluent, this.matAlloySteel);
    e401.position.set(25, 0, -35);
    this.addNozzleWithFlange(e401, new THREE.Vector3(0, 68.0, 0), new THREE.Vector3(0, 1, 0), 1.4, 4.5);
    this.addNozzleWithFlange(e401, new THREE.Vector3(7.5, 8.5, 0), new THREE.Vector3(1, 0, 0), 1.4, 4.0);
    this.addNozzleWithFlange(e401, new THREE.Vector3(0, 54.0, 7.5), new THREE.Vector3(0, 0, 1), 1.2, 3.8);
    this.addNozzleWithFlange(e401, new THREE.Vector3(0, 16.0, 7.5), new THREE.Vector3(0, 0, 1), 1.2, 3.8);
    this.registerInteractive(e401, 'e-401');
    this.group.add(e401);

    // E-402: Boiler Feed Water Preheater (Vertical Shell & Tube: Diameter 14.0m, Height 50.0m) at (0, 0, -35)
    const e402 = this.createVerticalExchanger('E-402', 14.0, 50.0, this.matAlloySteel, this.matCarbonSteel);
    e402.position.set(0, 0, -35);
    this.addNozzleWithFlange(e402, new THREE.Vector3(0, 62.0, 0), new THREE.Vector3(0, 1, 0), 1.3, 4.2);
    this.addNozzleWithFlange(e402, new THREE.Vector3(-7.0, 8.5, 0), new THREE.Vector3(-1, 0, 0), 1.3, 3.8);
    this.addNozzleWithFlange(e402, new THREE.Vector3(0, 48.0, -7.0), new THREE.Vector3(0, 0, -1), 1.1, 3.5);
    this.addNozzleWithFlange(e402, new THREE.Vector3(0, 14.0, -7.0), new THREE.Vector3(0, 0, -1), 1.1, 3.5);
    this.registerInteractive(e402, 'e-402');
    this.group.add(e402);

    // E-403: Syngas Feed Preheater (Vertical Shell & Tube: Diameter 14.0m, Height 50.0m) at (-25, 0, -35)
    const e403 = this.createVerticalExchanger('E-403', 14.0, 50.0, this.matCarbonSteel, this.matCarbonSteel);
    e403.position.set(-25, 0, -35);
    this.addNozzleWithFlange(e403, new THREE.Vector3(0, 62.0, 0), new THREE.Vector3(0, 1, 0), 1.3, 4.2);
    this.addNozzleWithFlange(e403, new THREE.Vector3(-7.0, 8.5, 0), new THREE.Vector3(-1, 0, 0), 1.3, 3.8);
    this.addNozzleWithFlange(e403, new THREE.Vector3(0, 48.0, 7.0), new THREE.Vector3(0, 0, 1), 1.3, 3.8);
    this.addNozzleWithFlange(e403, new THREE.Vector3(0, 14.0, -7.0), new THREE.Vector3(0, 0, -1), 1.3, 3.8);
    this.registerInteractive(e403, 'e-403_shell');
    this.group.add(e403);

    // E-404 A/B: Water Cooled Ammonia Condenser Bank (Dual Horizontal Shells: Diameter 13.0m, Length 38.0m) at (-56, 0, -35)
    const e404Group = new THREE.Group();
    e404Group.position.set(-56, 0, -35);
    e404Group.name = 'E-404 A/B';

    const plinthGeo = new THREE.BoxGeometry(28.0, 2.4, 26.0);
    const plinth = new THREE.Mesh(plinthGeo, this.matConcretePad);
    plinth.position.set(0, 1.2, 0);
    e404Group.add(plinth);

    const shellA = this.createHorizontalShell(13.0, 38.0, this.matCarbonSteel);
    shellA.position.set(0, 12.0, -8.0);
    e404Group.add(shellA);

    const shellB = this.createHorizontalShell(13.0, 38.0, this.matCarbonSteel);
    shellB.position.set(0, 12.0, 8.0);
    e404Group.add(shellB);

    this.addNozzleWithFlange(e404Group, new THREE.Vector3(19.0, 12.0, 0), new THREE.Vector3(1, 0, 0), 1.4, 4.2);
    this.addNozzleWithFlange(e404Group, new THREE.Vector3(-19.0, 12.0, 0), new THREE.Vector3(-1, 0, 0), 1.4, 4.2);
    this.addNozzleWithFlange(e404Group, new THREE.Vector3(0, 4.8, -8.5), new THREE.Vector3(0, -1, 0), 1.1, 3.5);
    this.addNozzleWithFlange(e404Group, new THREE.Vector3(0, 19.2, 8.5), new THREE.Vector3(0, 1, 0), 1.1, 3.5);
    this.registerInteractive(e404Group, 'e-404');
    this.group.add(e404Group);

    // V-401: Primary Ammonia Separator Column (Diameter 14.0m, Height 64.0m) at (-92, 0, -35)
    const v401Group = new THREE.Group();
    v401Group.position.set(-92, 0, -35);
    v401Group.name = 'V-401';

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const legGeo = new THREE.CylinderGeometry(0.9, 0.9, 12.0, 16);
      const leg = new THREE.Mesh(legGeo, this.matCarbonSteel);
      leg.position.set(Math.cos(angle) * 7.5, 6.0, Math.sin(angle) * 7.5);
      v401Group.add(leg);
    }

    const v401ShellGeo = new THREE.CylinderGeometry(7.0, 7.0, 44.0, 36);
    const v401Shell = new THREE.Mesh(v401ShellGeo, this.matCarbonSteel);
    v401Shell.position.set(0, 34.0, 0);
    v401Group.add(v401Shell);

    const v401DomeGeo = new THREE.SphereGeometry(7.0, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2);
    const v401TopDome = new THREE.Mesh(v401DomeGeo, this.matCarbonSteel);
    v401TopDome.position.set(0, 56.0, 0);
    v401Group.add(v401TopDome);

    const v401BotDome = new THREE.Mesh(v401DomeGeo, this.matCarbonSteel);
    v401BotDome.rotation.x = Math.PI;
    v401BotDome.position.set(0, 12.0, 0);
    v401Group.add(v401BotDome);

    [32.0, 55.0].forEach((yPos) => {
      const v401Plat = new THREE.Mesh(new THREE.CylinderGeometry(9.8, 9.8, 0.4, 36), this.matCatwalkSteel);
      v401Plat.position.set(0, yPos, 0);
      v401Group.add(v401Plat);

      const v401Rail = new THREE.Mesh(new THREE.TorusGeometry(9.7, 0.12, 8, 36), this.matYellowSafety);
      v401Rail.rotation.x = Math.PI / 2;
      v401Rail.position.set(0, yPos + 1.8, 0);
      v401Group.add(v401Rail);
    });

    [-2.5, 2.5].forEach((offset) => {
      const psvGeo = new THREE.CylinderGeometry(0.65, 0.65, 5.0, 16);
      const psv = new THREE.Mesh(psvGeo, this.matValveBlue);
      psv.position.set(offset, 65.0, 0);
      v401Group.add(psv);
    });

    this.addNozzleWithFlange(v401Group, new THREE.Vector3(0, 67.0, 0), new THREE.Vector3(0, 1, 0), 1.4, 4.5);
    this.addNozzleWithFlange(v401Group, new THREE.Vector3(0, 6.5, 0), new THREE.Vector3(0, -1, 0), 1.1, 3.8);
    this.addNozzleWithFlange(v401Group, new THREE.Vector3(7.0, 34.0, 0), new THREE.Vector3(1, 0, 0), 1.3, 3.8);

    this.registerInteractive(v401Group, 'v-401');
    this.group.add(v401Group);
  }

  // 4. Massive Deep Chilling Battery (Row Z = 25)
  private buildChillingBatteryTrain() {
    // E-407: Cold Gas Interchanger (Diameter 13.5m, Length 38.0m) at (-70, 0, 25)
    const e407Group = new THREE.Group();
    e407Group.position.set(-70, 0, 25);
    e407Group.name = 'E-407';
    const e407Shell = this.createHorizontalShell(13.5, 38.0, this.matCryoInsulation);
    e407Shell.position.set(0, 13.5, 0);
    e407Group.add(e407Shell);
    this.addNozzleWithFlange(e407Group, new THREE.Vector3(0, 20.5, 0), new THREE.Vector3(0, 1, 0), 1.4, 4.2);
    this.addNozzleWithFlange(e407Group, new THREE.Vector3(-19.0, 13.5, 0), new THREE.Vector3(-1, 0, 0), 1.3, 3.8);
    this.addNozzleWithFlange(e407Group, new THREE.Vector3(19.0, 13.5, 0), new THREE.Vector3(1, 0, 0), 1.3, 3.8);
    this.registerInteractive(e407Group, 'e-407');
    this.group.add(e407Group);

    // E-405: Primary Ammonia Chiller (+8°C Boiling Kettle Type: Diameter 14.5m, Length 38.0m) at (-35, 0, 25)
    const e405Group = new THREE.Group();
    e405Group.position.set(-35, 0, 25);
    e405Group.name = 'E-405';
    const e405Shell = this.createHorizontalShell(14.5, 38.0, this.matCarbonSteel);
    e405Shell.position.set(0, 13.5, 0);
    e405Group.add(e405Shell);

    const vDome5 = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 9.0, 32), this.matCarbonSteel);
    vDome5.position.set(0, 22.5, 0);
    e405Group.add(vDome5);

    this.addNozzleWithFlange(e405Group, new THREE.Vector3(-19.0, 13.5, 0), new THREE.Vector3(-1, 0, 0), 1.3, 3.8);
    this.addNozzleWithFlange(e405Group, new THREE.Vector3(19.0, 13.5, 0), new THREE.Vector3(1, 0, 0), 1.3, 3.8);
    this.addNozzleWithFlange(e405Group, new THREE.Vector3(0, 27.0, 0), new THREE.Vector3(0, 1, 0), 1.3, 3.8);
    this.registerInteractive(e405Group, 'e-405');
    this.group.add(e405Group);

    // E-406: Secondary Deep Ammonia Chiller (-10°C Kettle Type: Diameter 14.5m, Length 38.0m) at (0, 0, 25)
    const e406Group = new THREE.Group();
    e406Group.position.set(0, 0, 25);
    e406Group.name = 'E-406';
    const e406Shell = this.createHorizontalShell(14.5, 38.0, this.matCryoInsulation);
    e406Shell.position.set(0, 13.5, 0);
    e406Group.add(e406Shell);

    const vDome6 = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 9.0, 32), this.matCryoInsulation);
    vDome6.position.set(0, 22.5, 0);
    e406Group.add(vDome6);

    this.addNozzleWithFlange(e406Group, new THREE.Vector3(-19.0, 13.5, 0), new THREE.Vector3(-1, 0, 0), 1.3, 3.8);
    this.addNozzleWithFlange(e406Group, new THREE.Vector3(19.0, 13.5, 0), new THREE.Vector3(1, 0, 0), 1.3, 3.8);
    this.addNozzleWithFlange(e406Group, new THREE.Vector3(0, 27.0, 0), new THREE.Vector3(0, 1, 0), 1.3, 3.8);
    this.registerInteractive(e406Group, 'e-406');
    this.group.add(e406Group);

    // V-402: Secondary Cold Cryogenic Ammonia Separator Tower (Diameter 13.5m, Height 60.0m) at (35, 0, 25)
    const v402Group = new THREE.Group();
    v402Group.position.set(35, 0, 25);
    v402Group.name = 'V-402';

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const legGeo = new THREE.CylinderGeometry(0.9, 0.9, 12.0, 16);
      const leg = new THREE.Mesh(legGeo, this.matCryoInsulation);
      leg.position.set(Math.cos(angle) * 7.0, 6.0, Math.sin(angle) * 7.0);
      v402Group.add(leg);
    }

    const v402ShellGeo = new THREE.CylinderGeometry(6.75, 6.75, 40.0, 36);
    const v402Shell = new THREE.Mesh(v402ShellGeo, this.matCryoInsulation);
    v402Shell.position.set(0, 32.0, 0);
    v402Group.add(v402Shell);

    const v402DomeGeo = new THREE.SphereGeometry(6.75, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2);
    const v402Top = new THREE.Mesh(v402DomeGeo, this.matCryoInsulation);
    v402Top.position.set(0, 52.0, 0);
    v402Group.add(v402Top);

    const v402Bot = new THREE.Mesh(v402DomeGeo, this.matCryoInsulation);
    v402Bot.rotation.x = Math.PI;
    v402Bot.position.set(0, 12.0, 0);
    v402Group.add(v402Bot);

    const v402Plat = new THREE.Mesh(new THREE.CylinderGeometry(9.5, 9.5, 0.4, 36), this.matCatwalkSteel);
    v402Plat.position.set(0, 51.5, 0);
    v402Group.add(v402Plat);

    const v402Rail = new THREE.Mesh(new THREE.TorusGeometry(9.4, 0.12, 8, 36), this.matYellowSafety);
    v402Rail.rotation.x = Math.PI / 2;
    v402Rail.position.set(0, 53.3, 0);
    v402Group.add(v402Rail);

    this.addNozzleWithFlange(v402Group, new THREE.Vector3(0, 61.5, 0), new THREE.Vector3(0, 1, 0), 1.3, 4.2);
    this.addNozzleWithFlange(v402Group, new THREE.Vector3(0, 6.5, 0), new THREE.Vector3(0, -1, 0), 1.1, 3.8);
    this.addNozzleWithFlange(v402Group, new THREE.Vector3(-6.75, 32.0, 0), new THREE.Vector3(-1, 0, 0), 1.3, 3.8);
    this.registerInteractive(v402Group, 'v-402');
    this.group.add(v402Group);
  }

  // 5. Product Letdown Flash Drum V-409 & Product Pumps P-401 A/B (Row Z = 65)
  private buildProductLetdownAndPumps() {
    // V-409: Ammonia Letdown Flash Drum (Diameter 14.0m, Length 38.0m) at (-10, 0, 65)
    const v409Group = new THREE.Group();
    v409Group.position.set(-10, 0, 65);
    v409Group.name = 'V-409';

    const saddleGeo = new THREE.BoxGeometry(4.5, 7.0, 16.0);
    const s1 = new THREE.Mesh(saddleGeo, this.matConcretePad);
    s1.position.set(-12.0, 3.5, 0);
    v409Group.add(s1);

    const s2 = new THREE.Mesh(saddleGeo, this.matConcretePad);
    s2.position.set(12.0, 3.5, 0);
    v409Group.add(s2);

    const v409Body = this.createHorizontalShell(14.0, 38.0, this.matCarbonSteel);
    v409Body.position.set(0, 13.0, 0);
    v409Group.add(v409Body);

    this.addNozzleWithFlange(v409Group, new THREE.Vector3(0, 21.5, 0), new THREE.Vector3(0, 1, 0), 1.3, 3.8);
    this.addNozzleWithFlange(v409Group, new THREE.Vector3(0, 5.5, 0), new THREE.Vector3(0, -1, 0), 1.3, 3.8);
    this.registerInteractive(v409Group, 'v-409');
    this.group.add(v409Group);

    // P-401 A/B: Dual Heavy Product Ammonia Pumps at (25, 0, 65)
    const pGroup = new THREE.Group();
    pGroup.position.set(25, 0, 65);
    pGroup.name = 'P-401 A/B';

    const pPlinthGeo = new THREE.BoxGeometry(24.0, 2.2, 16.0);
    const pPlinth = new THREE.Mesh(pPlinthGeo, this.matConcretePad);
    pPlinth.position.set(0, 1.1, 0);
    pGroup.add(pPlinth);

    [-4.8, 4.8].forEach((zPos) => {
      const casingGeo = new THREE.CylinderGeometry(2.5, 2.5, 4.2, 20);
      const casing = new THREE.Mesh(casingGeo, this.matAlloySteel);
      casing.rotation.x = Math.PI / 2;
      casing.position.set(-4.0, 4.6, zPos);
      pGroup.add(casing);

      const motorGeo = new THREE.CylinderGeometry(2.6, 2.6, 6.5, 20);
      const motor = new THREE.Mesh(motorGeo, this.matValveBlue);
      motor.rotation.z = Math.PI / 2;
      motor.position.set(4.0, 4.6, zPos);
      pGroup.add(motor);
    });

    this.registerInteractive(pGroup, 'p-401ab');
    this.group.add(pGroup);

    // V-451 B: Colossal Refrigerated Ammonia Cryogenic Double-Wall Storage Tank (Diameter 32m, Height 26m) at (85, 0, 55)
    const v451Group = new THREE.Group();
    v451Group.position.set(85, 0, 55);
    v451Group.name = 'V-451 B';

    // Massive Concrete Ring Foundation Base (Radius 17.5m, Height 1.6m)
    const v451PadGeo = new THREE.CylinderGeometry(17.5, 18.2, 1.6, 48);
    const v451Pad = new THREE.Mesh(v451PadGeo, this.matConcretePad);
    v451Pad.position.set(0, 0.8, 0);
    v451Group.add(v451Pad);

    // Main Outer Insulated Cryogenic Cylindrical Shell (Radius 16m, Height 24m)
    const v451ShellGeo = new THREE.CylinderGeometry(16.0, 16.0, 24.0, 48);
    const v451Shell = new THREE.Mesh(v451ShellGeo, this.matCryoInsulation);
    v451Shell.position.set(0, 13.6, 0);
    v451Group.add(v451Shell);

    // Spherical Cryogenic Domed Roof (Radius 16m, Dome Height 5.5m)
    const v451DomeGeo = new THREE.SphereGeometry(16.0, 48, 24, 0, Math.PI * 2, 0, Math.PI / 3);
    const v451Dome = new THREE.Mesh(v451DomeGeo, this.matCryoInsulation);
    v451Dome.position.set(0, 25.6, 0);
    v451Group.add(v451Dome);

    // Roof Center Nitrogen Breather & Relief Valve (PSV) Manifold Station
    const psvHubGeo = new THREE.CylinderGeometry(1.2, 1.2, 4.2, 20);
    const psvHub = new THREE.Mesh(psvHubGeo, this.matAlloySteel);
    psvHub.position.set(0, 31.8, 0);
    v451Group.add(psvHub);

    [-1.8, 1.8].forEach((offX) => {
      const psvValveGeo = new THREE.CylinderGeometry(0.55, 0.55, 3.8, 16);
      const psvValve = new THREE.Mesh(psvValveGeo, this.matValveBlue);
      psvValve.position.set(offX, 33.5, 0);
      v451Group.add(psvValve);
    });

    // Top Perimeter Safety Catwalk Gallery & High Handrails
    const v451Plat = new THREE.Mesh(new THREE.CylinderGeometry(17.2, 17.2, 0.4, 48), this.matCatwalkSteel);
    v451Plat.position.set(0, 25.6, 0);
    v451Group.add(v451Plat);

    const v451Rail = new THREE.Mesh(new THREE.TorusGeometry(17.1, 0.15, 8, 48), this.matYellowSafety);
    v451Rail.rotation.x = Math.PI / 2;
    v451Rail.position.set(0, 27.2, 0);
    v451Group.add(v451Rail);

    // Spiral Catwalk Stairs wrapping the outer circumference
    const stepCount = 36;
    for (let i = 0; i < stepCount; i++) {
      const frac = i / stepCount;
      const angle = frac * Math.PI * 1.7;
      const sy = 1.6 + frac * 24.0;
      const stepGeo = new THREE.BoxGeometry(2.4, 0.2, 1.0);
      const step = new THREE.Mesh(stepGeo, this.matCatwalkSteel);
      step.position.set(Math.cos(angle) * 17.2, sy, Math.sin(angle) * 17.2);
      step.rotation.y = -angle;
      v451Group.add(step);

      if (i % 3 === 0) {
        const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 8);
        const post = new THREE.Mesh(postGeo, this.matYellowSafety);
        post.position.set(Math.cos(angle) * 18.2, sy + 0.9, Math.sin(angle) * 18.2);
        v451Group.add(post);
      }
    }

    // Side Radar Level Transmitter & Gauge Column (LT-451)
    const ltColGeo = new THREE.CylinderGeometry(0.3, 0.3, 22.0, 16);
    const ltCol = new THREE.Mesh(ltColGeo, this.matAlloySteel);
    ltCol.position.set(16.8, 13.6, 0);
    v451Group.add(ltCol);

    // Product Ammonia Inlet Nozzle with Flange from P-401 A/B at (-16.0, 8.5, 0)
    this.addNozzleWithFlange(v451Group, new THREE.Vector3(-16.0, 8.5, 0), new THREE.Vector3(-1, 0, 0), 1.2, 3.8);

    this.registerInteractive(v451Group, 'v-451b');
    this.group.add(v451Group);
  }

  // 6. Fired Start-Up Heater H-401 & J-401 Bypass Manifold Station (Colossal 108m Elevation)
  private buildStartupHeaterAndManifold() {
    // H-401: Industrial Heavy Process Fired Start-Up Furnace at (95, 0, 15)
    const hGroup = new THREE.Group();
    hGroup.position.set(95, 0, 15);
    hGroup.name = 'H-401';

    // Mat Foundation (36m x 30m x 2.2m)
    const padGeo = new THREE.BoxGeometry(36.0, 2.2, 30.0);
    const pad = new THREE.Mesh(padGeo, this.matConcretePad);
    pad.position.set(0, 1.1, 0);
    hGroup.add(pad);

    // 8 Elevated Substructure Piers (3.0m x 3.0m x 5.5m)
    const pierGeo = new THREE.BoxGeometry(3.0, 5.5, 3.0);
    for (let px of [-12.0, -4.0, 4.0, 12.0]) {
      for (let pz of [-9.5, 9.5]) {
        const pier = new THREE.Mesh(pierGeo, this.matConcretePad);
        pier.position.set(px, 3.85, pz);
        hGroup.add(pier);

        const bpGeo = new THREE.BoxGeometry(3.5, 0.25, 3.5);
        const bp = new THREE.Mesh(bpGeo, this.matCatwalkSteel);
        bp.position.set(px, 6.7, pz);
        hGroup.add(bp);
      }
    }

    // Elevated Burner Hearth Deck at Y=6.8m
    const deckGeo = new THREE.BoxGeometry(30.0, 0.8, 25.0);
    const deck = new THREE.Mesh(deckGeo, this.matCatwalkSteel);
    deck.position.set(0, 7.0, 0);
    hGroup.add(deck);

    // 20 Low-NOx Gas Burners (Array 5 x 4)
    const burnerOffsetsX = [-9.5, -4.8, 0, 4.8, 9.5];
    const burnerOffsetsZ = [-6.5, -2.2, 2.2, 6.5];
    burnerOffsetsX.forEach((bx) => {
      burnerOffsetsZ.forEach((bz) => {
        const bHousingGeo = new THREE.CylinderGeometry(1.3, 1.7, 2.5, 16);
        const bHousing = new THREE.Mesh(bHousingGeo, this.matAlloySteel);
        bHousing.position.set(bx, 5.2, bz);
        hGroup.add(bHousing);

        const flameGeo = new THREE.ConeGeometry(0.8, 2.2, 12);
        const flame = new THREE.Mesh(flameGeo, this.matBurnerFlame);
        flame.position.set(bx, 7.2, bz);
        hGroup.add(flame);
      });
    });

    // Main Radiant Firebox Cabin (Width 28.0m, Height 26.0m, Depth 22.0m)
    const boxGeo = new THREE.BoxGeometry(28.0, 26.0, 22.0);
    const box = new THREE.Mesh(boxGeo, this.matCarbonSteel);
    box.position.set(0, 20.0, 0);
    hGroup.add(box);

    // 8 Structural Columns
    for (let sx of [-14.2, -4.7, 4.7, 14.2]) {
      for (let sz of [-11.2, 11.2]) {
        const colGeo = new THREE.BoxGeometry(1.2, 27.0, 1.2);
        const col = new THREE.Mesh(colGeo, this.matCatwalkSteel);
        col.position.set(sx, 20.0, sz);
        hGroup.add(col);
      }
    }

    // Buckstays Wrapping Walls
    [10.5, 18.0, 25.5, 32.0].forEach((gy) => {
      const gXGeo = new THREE.BoxGeometry(30.0, 0.6, 0.6);
      const gX1 = new THREE.Mesh(gXGeo, this.matCatwalkSteel);
      gX1.position.set(0, gy, 11.3);
      hGroup.add(gX1);

      const gX2 = new THREE.Mesh(gXGeo, this.matCatwalkSteel);
      gX2.position.set(0, gy, -11.3);
      hGroup.add(gX2);

      const gZGeo = new THREE.BoxGeometry(0.6, 0.6, 23.5);
      const gZ1 = new THREE.Mesh(gZGeo, this.matCatwalkSteel);
      gZ1.position.set(14.3, gy, 0);
      hGroup.add(gZ1);

      const gZ2 = new THREE.Mesh(gZGeo, this.matCatwalkSteel);
      gZ2.position.set(-14.3, gy, 0);
      hGroup.add(gZ2);
    });

    // Illuminated Glowing Peep-Hole Sight Glasses
    [13.5, 22.0].forEach((py) => {
      for (let px of [-8.0, 0, 8.0]) {
        const portGeo = new THREE.CylinderGeometry(0.5, 0.6, 1.0, 16);
        const port = new THREE.Mesh(portGeo, this.matHotSteelEffluent);
        port.rotation.x = Math.PI / 2;
        port.position.set(px, py, 11.3);
        hGroup.add(port);

        const glowLensGeo = new THREE.CircleGeometry(0.4, 16);
        const glowLens = new THREE.Mesh(glowLensGeo, this.matFireGlow);
        glowLens.position.set(px, py, 11.9);
        hGroup.add(glowLens);
      }
    });

    // Upper Convection Chamber (Width 22.0m, Height 14.0m, Depth 18.0m)
    const convGeo = new THREE.BoxGeometry(22.0, 14.0, 18.0);
    const conv = new THREE.Mesh(convGeo, this.matCarbonSteel);
    conv.position.set(0, 40.0, 0);
    hGroup.add(conv);

    // Breeching Duct (Height 9.0m)
    const breechGeo = new THREE.CylinderGeometry(4.5, 9.8, 9.0, 24);
    const breech = new THREE.Mesh(breechGeo, this.matCarbonSteel);
    breech.position.set(0, 51.5, 0);
    hGroup.add(breech);

    // Monumental Heavy Exhaust Stack (Height 52m, Rising to 108m Elevation!)
    const stackGeo = new THREE.CylinderGeometry(3.6, 4.8, 52.0, 32);
    const stack = new THREE.Mesh(stackGeo, this.matCarbonSteel);
    stack.position.set(0, 82.0, 0);
    hGroup.add(stack);

    // Helical Vortex Strakes
    const strakeCount = 90;
    for (let i = 0; i < strakeCount; i++) {
      const frac = i / strakeCount;
      const angle = frac * Math.PI * 8;
      const sy = 65.0 + frac * 40.0;
      const sr = 3.8 + (1.0 - frac) * 0.6;
      const stGeo = new THREE.BoxGeometry(0.24, 0.65, 0.95);
      const strake = new THREE.Mesh(stGeo, this.matCatwalkSteel);
      strake.position.set(Math.cos(angle) * sr, sy, Math.sin(angle) * sr);
      strake.rotation.y = -angle;
      hGroup.add(strake);
    }

    // Stack Circular Galleries
    [75.0, 96.0].forEach((sy) => {
      const cWalkGeo = new THREE.CylinderGeometry(7.0, 7.0, 0.4, 32);
      const cWalk = new THREE.Mesh(cWalkGeo, this.matCatwalkSteel);
      cWalk.position.set(0, sy, 0);
      hGroup.add(cWalk);

      const cRailGeo = new THREE.TorusGeometry(6.9, 0.12, 8, 32);
      const cRail = new THREE.Mesh(cRailGeo, this.matYellowSafety);
      cRail.rotation.x = Math.PI / 2;
      cRail.position.set(0, sy + 1.8, 0);
      hGroup.add(cRail);
    });

    // Top Bellmouth Cowl & Lightning Rod
    const capGeo = new THREE.ConeGeometry(5.4, 2.0, 32);
    const cap = new THREE.Mesh(capGeo, this.matCatwalkSteel);
    cap.position.set(0, 108.5, 0);
    hGroup.add(cap);

    const lightRod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5.5, 8), this.matStudBolt);
    lightRod.position.set(0, 111.5, 0);
    hGroup.add(lightRod);

    this.addNozzleWithFlange(hGroup, new THREE.Vector3(-14.2, 9.5, 0), new THREE.Vector3(-1, 0, 0), 0.65, 2.2);
    this.addNozzleWithFlange(hGroup, new THREE.Vector3(-14.2, 26.0, 0), new THREE.Vector3(-1, 0, 0), 0.65, 2.2);

    this.registerInteractive(hGroup, 'h-401');
    this.group.add(hGroup);

    // J-401 Bypass Manifold at (60, 0, 10)
    const jGroup = new THREE.Group();
    jGroup.position.set(60, 0, 10);
    jGroup.name = 'J-401';
    const teeBodyGeo = new THREE.CylinderGeometry(1.2, 1.2, 6.0, 16);
    const teeBody = new THREE.Mesh(teeBodyGeo, this.matAlloySteel);
    teeBody.rotation.z = Math.PI / 2;
    teeBody.position.set(0, 5.5, 0);
    jGroup.add(teeBody);
    this.registerInteractive(jGroup, 'j-401');
    this.group.add(jGroup);
  }

  // 7. Refrigeration Compressor K-401 & Suction Separators (Row Z = 95)
  private buildRefrigerationCompressorTrain() {
    const kGroup = new THREE.Group();
    kGroup.position.set(30, 0, 95);
    kGroup.name = 'K-401';

    const kPlinthGeo = new THREE.BoxGeometry(42.0, 2.4, 20.0);
    const kPlinth = new THREE.Mesh(kPlinthGeo, this.matConcretePad);
    kPlinth.position.set(0, 1.2, 0);
    kGroup.add(kPlinth);

    // Steam Turbine Driver K-401T
    const turbGeo = new THREE.CylinderGeometry(3.1, 3.6, 12.0, 24);
    const turb = new THREE.Mesh(turbGeo, this.matCarbonSteel);
    turb.rotation.z = Math.PI / 2;
    turb.position.set(-13.0, 6.2, 0);
    kGroup.add(turb);

    // LP/MP Casing
    const case1Geo = new THREE.CylinderGeometry(3.3, 3.3, 11.5, 24);
    const case1 = new THREE.Mesh(case1Geo, this.matValveBlue);
    case1.rotation.z = Math.PI / 2;
    case1.position.set(2.0, 6.2, 0);
    kGroup.add(case1);

    // HP Casing
    const case2Geo = new THREE.CylinderGeometry(3.1, 3.1, 10.5, 24);
    const case2 = new THREE.Mesh(case2Geo, this.matValveBlue);
    case2.rotation.z = Math.PI / 2;
    case2.position.set(15.0, 6.2, 0);
    kGroup.add(case2);

    this.registerInteractive(kGroup, 'k-401');
    this.group.add(kGroup);

    // V-405, V-406, V-407 Suction Columns (Diameter 9.0m, Height 36.0m)
    const vList = [
      { id: 'v-405', tag: 'V-405', x: 60 },
      { id: 'v-406', tag: 'V-406', x: 76 },
      { id: 'v-407', tag: 'V-407', x: 92 }
    ];

    vList.forEach((v) => {
      const colGroup = new THREE.Group();
      colGroup.position.set(v.x, 0, 95);
      colGroup.name = v.tag;

      const fGeo = new THREE.CylinderGeometry(5.2, 5.8, 1.8, 20);
      const foot = new THREE.Mesh(fGeo, this.matConcretePad);
      foot.position.set(0, 0.9, 0);
      colGroup.add(foot);

      const sGeo = new THREE.CylinderGeometry(4.5, 4.7, 5.5, 24, 1, true);
      const skirt = new THREE.Mesh(sGeo, this.matCarbonSteel);
      skirt.position.set(0, 4.5, 0);
      colGroup.add(skirt);

      const vGeo = new THREE.CylinderGeometry(4.5, 4.5, 26.0, 36);
      const vMesh = new THREE.Mesh(vGeo, this.matCryoInsulation);
      vMesh.position.set(0, 20.5, 0);
      colGroup.add(vMesh);

      const topD = new THREE.Mesh(new THREE.SphereGeometry(4.5, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2), this.matCryoInsulation);
      topD.position.set(0, 33.5, 0);
      colGroup.add(topD);

      const botD = new THREE.Mesh(new THREE.SphereGeometry(4.5, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2), this.matCryoInsulation);
      botD.rotation.x = Math.PI;
      botD.position.set(0, 7.5, 0);
      colGroup.add(botD);

      const colPlat = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 6.5, 0.35, 28), this.matCatwalkSteel);
      colPlat.position.set(0, 33.0, 0);
      colGroup.add(colPlat);

      const colRail = new THREE.Mesh(new THREE.TorusGeometry(6.4, 0.1, 8, 28), this.matYellowSafety);
      colRail.rotation.x = Math.PI / 2;
      colRail.position.set(0, 34.8, 0);
      colGroup.add(colRail);

      this.addNozzleWithFlange(colGroup, new THREE.Vector3(0, 39.0, 0), new THREE.Vector3(0, 1, 0), 0.95, 3.2);
      this.addNozzleWithFlange(colGroup, new THREE.Vector3(0, 3.5, 0), new THREE.Vector3(0, -1, 0), 0.8, 2.5);
      this.addNozzleWithFlange(colGroup, new THREE.Vector3(0, 20.0, -4.5), new THREE.Vector3(0, 0, -1), 0.95, 2.6);

      this.registerInteractive(colGroup, v.id);
      this.group.add(colGroup);
    });

    // Connecting Bridge across V-405, V-406, V-407
    const bridgeGeo = new THREE.BoxGeometry(36.0, 0.35, 3.2);
    const bridge = new THREE.Mesh(bridgeGeo, this.matCatwalkSteel);
    bridge.position.set(76, 33.0, 95.0);
    this.group.add(bridge);

    // E-412 Ammonia Condenser (Diameter 13.0m, Length 38.0m) at (60, 0, 125)
    const e412Group = new THREE.Group();
    e412Group.position.set(60, 0, 125);
    e412Group.name = 'E-412';
    const e412Shell = this.createHorizontalShell(13.0, 38.0, this.matCarbonSteel);
    e412Shell.position.set(0, 11.5, 0);
    e412Group.add(e412Shell);
    this.addNozzleWithFlange(e412Group, new THREE.Vector3(0, 19.0, 0), new THREE.Vector3(0, 1, 0), 1.1, 3.5);
    this.addNozzleWithFlange(e412Group, new THREE.Vector3(0, 4.5, 0), new THREE.Vector3(0, -1, 0), 0.95, 3.2);
    this.registerInteractive(e412Group, 'e-412');
    this.group.add(e412Group);

    // V-408 Receiver Drum (Diameter 14.5m, Length 42.0m) at (92, 0, 125)
    const v408Group = new THREE.Group();
    v408Group.position.set(92, 0, 125);
    v408Group.name = 'V-408';
    const v408Shell = this.createHorizontalShell(14.5, 42.0, this.matCarbonSteel);
    v408Shell.position.set(0, 13.0, 0);
    v408Group.add(v408Shell);
    this.addNozzleWithFlange(v408Group, new THREE.Vector3(0, 21.0, 0), new THREE.Vector3(0, 1, 0), 1.1, 3.5);
    this.addNozzleWithFlange(v408Group, new THREE.Vector3(0, 5.0, 0), new THREE.Vector3(0, -1, 0), 0.95, 3.2);
    this.registerInteractive(v408Group, 'v-408');
    this.group.add(v408Group);
  }

  // 8. Purge & Vent Gas Recovery Train (Row Z = 65 & 95, X = -75 to -20)
  private buildPurgeAndVentRecoveryTrain() {
    // E-408 Purge Condenser (Diameter 9.5m, Length 30.0m) at (-75, 0, 65)
    const e408Group = new THREE.Group();
    e408Group.position.set(-75, 0, 65);
    e408Group.name = 'E-408';
    const e408Shell = this.createHorizontalShell(9.5, 30.0, this.matCryoInsulation);
    e408Shell.position.set(0, 8.5, 0);
    e408Group.add(e408Shell);
    this.addNozzleWithFlange(e408Group, new THREE.Vector3(-15.0, 8.5, 0), new THREE.Vector3(-1, 0, 0), 0.9, 2.8);
    this.addNozzleWithFlange(e408Group, new THREE.Vector3(15.0, 8.5, 0), new THREE.Vector3(1, 0, 0), 0.9, 2.8);
    this.addNozzleWithFlange(e408Group, new THREE.Vector3(0, 14.0, 0), new THREE.Vector3(0, 1, 0), 0.8, 2.6);
    this.registerInteractive(e408Group, 'e-408');
    this.group.add(e408Group);

    // V-403 Purge Gas Separator (Diameter 9.0m, Height 36.0m) at (-45, 0, 65)
    const v403Group = new THREE.Group();
    v403Group.position.set(-45, 0, 65);
    v403Group.name = 'V-403';
    const v403Geo = new THREE.CylinderGeometry(4.5, 4.5, 24.0, 32);
    const v403 = new THREE.Mesh(v403Geo, this.matCryoInsulation);
    v403.position.set(0, 18.0, 0);
    v403Group.add(v403);
    const v403Top = new THREE.Mesh(new THREE.SphereGeometry(4.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), this.matCryoInsulation);
    v403Top.position.set(0, 30.0, 0);
    v403Group.add(v403Top);
    const v403Bot = new THREE.Mesh(new THREE.SphereGeometry(4.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), this.matCryoInsulation);
    v403Bot.rotation.x = Math.PI;
    v403Bot.position.set(0, 6.0, 0);
    v403Group.add(v403Bot);

    this.addNozzleWithFlange(v403Group, new THREE.Vector3(0, 35.5, 0), new THREE.Vector3(0, 1, 0), 0.9, 2.8);
    this.addNozzleWithFlange(v403Group, new THREE.Vector3(0, 3.5, 0), new THREE.Vector3(0, -1, 0), 0.75, 2.5);
    this.registerInteractive(v403Group, 'v-403');
    this.group.add(v403Group);

    // E-416 Purge Gas Steam Heater (Diameter 9.5m, Length 30.0m) at (-20, 0, 65)
    const e416Group = new THREE.Group();
    e416Group.position.set(-20, 0, 65);
    e416Group.name = 'E-416';
    const e416Shell = this.createHorizontalShell(9.5, 30.0, this.matCarbonSteel);
    e416Shell.position.set(0, 8.5, 0);
    e416Group.add(e416Shell);
    this.addNozzleWithFlange(e416Group, new THREE.Vector3(-15.0, 8.5, 0), new THREE.Vector3(-1, 0, 0), 0.85, 2.6);
    this.addNozzleWithFlange(e416Group, new THREE.Vector3(15.0, 8.5, 0), new THREE.Vector3(1, 0, 0), 0.85, 2.6);
    this.registerInteractive(e416Group, 'e-416');
    this.group.add(e416Group);

    // E-409 Ammonia Vent Condenser (Diameter 9.5m, Length 30.0m) at (-75, 0, 95)
    const e409Group = new THREE.Group();
    e409Group.position.set(-75, 0, 95);
    e409Group.name = 'E-409';
    const e409Shell = this.createHorizontalShell(9.5, 30.0, this.matCryoInsulation);
    e409Shell.position.set(0, 8.5, 0);
    e409Group.add(e409Shell);
    this.addNozzleWithFlange(e409Group, new THREE.Vector3(0, 14.0, 0), new THREE.Vector3(0, 1, 0), 0.85, 2.6);
    this.addNozzleWithFlange(e409Group, new THREE.Vector3(15.0, 8.5, 0), new THREE.Vector3(1, 0, 0), 0.85, 2.6);
    this.registerInteractive(e409Group, 'e-409');
    this.group.add(e409Group);

    // V-404 Vent Separator (Diameter 9.0m, Height 36.0m) at (-45, 0, 95)
    const v404Group = new THREE.Group();
    v404Group.position.set(-45, 0, 95);
    v404Group.name = 'V-404';
    const v404Geo = new THREE.CylinderGeometry(4.5, 4.5, 24.0, 32);
    const v404 = new THREE.Mesh(v404Geo, this.matCarbonSteel);
    v404.position.set(0, 18.0, 0);
    v404Group.add(v404);
    const v404Top = new THREE.Mesh(new THREE.SphereGeometry(4.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), this.matCarbonSteel);
    v404Top.position.set(0, 30.0, 0);
    v404Group.add(v404Top);
    const v404Bot = new THREE.Mesh(new THREE.SphereGeometry(4.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), this.matCarbonSteel);
    v404Bot.rotation.x = Math.PI;
    v404Bot.position.set(0, 6.0, 0);
    v404Group.add(v404Bot);

    this.addNozzleWithFlange(v404Group, new THREE.Vector3(0, 35.5, 0), new THREE.Vector3(0, 1, 0), 0.85, 2.6);
    this.addNozzleWithFlange(v404Group, new THREE.Vector3(0, 3.5, 0), new THREE.Vector3(0, -1, 0), 0.75, 2.5);
    this.registerInteractive(v404Group, 'v-404');
    this.group.add(v404Group);
  }

  // 8B. K-301 Make-Up & Recycle Compressor Train, E-315 Cooler & V-310 Knock-Out Drum
  private buildMakeUpFeedAndRecycleK301Train() {
    // K-301 at (-105, 0, 25)
    const k301Group = new THREE.Group();
    k301Group.position.set(-105, 0, 25);
    k301Group.name = 'K-301';

    const kPlinthGeo = new THREE.BoxGeometry(38.0, 2.2, 20.0);
    const kPlinth = new THREE.Mesh(kPlinthGeo, this.matConcretePad);
    kPlinth.position.set(0, 1.1, 0);
    k301Group.add(kPlinth);

    const turbGeo = new THREE.CylinderGeometry(3.0, 3.5, 11.0, 24);
    const turb = new THREE.Mesh(turbGeo, this.matCarbonSteel);
    turb.rotation.z = Math.PI / 2;
    turb.position.set(-10.5, 6.0, 0);
    k301Group.add(turb);

    const st4Geo = new THREE.CylinderGeometry(3.2, 3.2, 9.5, 24);
    const st4 = new THREE.Mesh(st4Geo, this.matValveBlue);
    st4.rotation.z = Math.PI / 2;
    st4.position.set(-0.5, 6.0, -2.2);
    k301Group.add(st4);

    const recGeo = new THREE.CylinderGeometry(3.4, 3.4, 9.0, 24);
    const rec = new THREE.Mesh(recGeo, this.matAlloySteel);
    rec.rotation.z = Math.PI / 2;
    rec.position.set(9.0, 6.0, 2.2);
    k301Group.add(rec);

    this.addNozzleWithFlange(k301Group, new THREE.Vector3(-0.5, 6.0, -7.0), new THREE.Vector3(0, 0, -1), 0.95, 2.8);
    this.addNozzleWithFlange(k301Group, new THREE.Vector3(-0.5, 9.5, 0), new THREE.Vector3(0, 1, 0), 0.95, 3.0);
    this.addNozzleWithFlange(k301Group, new THREE.Vector3(9.0, 6.0, 7.0), new THREE.Vector3(0, 0, 1), 1.1, 3.2);
    this.addNozzleWithFlange(k301Group, new THREE.Vector3(9.0, 9.8, 0), new THREE.Vector3(0, 1, 0), 1.1, 3.2);

    this.registerInteractive(k301Group, 'k-301');
    this.group.add(k301Group);

    // E-315: Make-Up Gas Cooler (Diameter 10.0m, Length 30.0m) at (-105, 0, -10)
    const e315Group = new THREE.Group();
    e315Group.position.set(-105, 0, -10);
    e315Group.name = 'E-315';

    const sGeo = new THREE.BoxGeometry(3.0, 4.5, 11.0);
    const s1 = new THREE.Mesh(sGeo, this.matConcretePad);
    s1.position.set(-8.5, 2.25, 0);
    e315Group.add(s1);
    const s2 = new THREE.Mesh(sGeo, this.matConcretePad);
    s2.position.set(8.5, 2.25, 0);
    e315Group.add(s2);

    const e315Shell = this.createHorizontalShell(10.0, 30.0, this.matAlloySteel);
    e315Shell.position.set(0, 8.5, 0);
    e315Group.add(e315Shell);

    this.addNozzleWithFlange(e315Group, new THREE.Vector3(-15.0, 8.5, 0), new THREE.Vector3(-1, 0, 0), 0.95, 3.0);
    this.addNozzleWithFlange(e315Group, new THREE.Vector3(15.0, 8.5, 0), new THREE.Vector3(1, 0, 0), 0.95, 3.0);
    this.registerInteractive(e315Group, 'e-315');
    this.group.add(e315Group);

    // V-310: Make-Up Separator (Diameter 9.5m, Height 42.0m) at (-105, 0, -45)
    const v310Group = new THREE.Group();
    v310Group.position.set(-105, 0, -45);
    v310Group.name = 'V-310';

    const v310Foot = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 6.0, 1.8, 20), this.matConcretePad);
    v310Foot.position.set(0, 0.9, 0);
    v310Group.add(v310Foot);

    const v310Skirt = new THREE.Mesh(new THREE.CylinderGeometry(4.75, 4.85, 5.5, 24, 1, true), this.matCarbonSteel);
    v310Skirt.position.set(0, 4.5, 0);
    v310Group.add(v310Skirt);

    const v310Shell = new THREE.Mesh(new THREE.CylinderGeometry(4.75, 4.75, 28.0, 32), this.matCarbonSteel);
    v310Shell.position.set(0, 21.0, 0);
    v310Group.add(v310Shell);

    const v310TopHead = new THREE.Mesh(new THREE.SphereGeometry(4.75, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), this.matCarbonSteel);
    v310TopHead.position.set(0, 35.0, 0);
    v310Group.add(v310TopHead);

    const v310BotHead = new THREE.Mesh(new THREE.SphereGeometry(4.75, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), this.matCarbonSteel);
    v310BotHead.rotation.x = Math.PI;
    v310BotHead.position.set(0, 7.0, 0);
    v310Group.add(v310BotHead);

    this.addNozzleWithFlange(v310Group, new THREE.Vector3(-4.75, 18.0, 0), new THREE.Vector3(-1, 0, 0), 0.95, 2.8);
    this.addNozzleWithFlange(v310Group, new THREE.Vector3(0, 40.5, 0), new THREE.Vector3(0, 1, 0), 1.1, 3.5);
    this.addNozzleWithFlange(v310Group, new THREE.Vector3(0, 3.2, 0), new THREE.Vector3(0, -1, 0), 0.75, 2.5);

    this.registerInteractive(v310Group, 'v-310');
    this.group.add(v310Group);
  }

  // 9. Process Piping Network
  private buildProcessPipingNetwork() {
    const pipeDefinitions: Array<{
      name: string;
      color: number;
      radius: number;
      speed: number;
      particleColor: number;
      points: THREE.Vector3[];
    }> = [
      // 0A. Fresh Syngas Battery Limit -> K-301 Stage 4 Suction
      {
        name: 'Fresh Syngas Battery Limit -> K-301 Stage 4 Suction',
        color: 0x0284c7,
        radius: 0.75,
        speed: 0.08,
        particleColor: 0x38bdf8,
        points: [
          new THREE.Vector3(-140.0, 6.0, 18.0),
          new THREE.Vector3(-105.5, 6.0, 18.0)
        ]
      },
      // 0B. K-301 Stage 4 Discharge -> E-315 Tube Inlet
      {
        name: 'K-301 Stage 4 Discharge -> E-315 Tube Inlet',
        color: 0x0284c7,
        radius: 0.72,
        speed: 0.08,
        particleColor: 0x38bdf8,
        points: [
          new THREE.Vector3(-105.5, 9.5, 25.0),
          new THREE.Vector3(-105.5, 15.0, 25.0),
          new THREE.Vector3(-120.0, 15.0, 25.0),
          new THREE.Vector3(-120.0, 15.0, -10.0),
          new THREE.Vector3(-120.0, 8.5, -10.0)
        ]
      },
      // 0C. E-315 Tube Outlet -> V-310 Separator Inlet
      {
        name: 'E-315 Tube Outlet -> V-310 Separator Inlet',
        color: 0x0284c7,
        radius: 0.72,
        speed: 0.08,
        particleColor: 0x38bdf8,
        points: [
          new THREE.Vector3(-90.0, 8.5, -10.0),
          new THREE.Vector3(-90.0, 8.5, -45.0),
          new THREE.Vector3(-100.0, 8.5, -45.0),
          new THREE.Vector3(-100.0, 18.0, -45.0),
          new THREE.Vector3(-109.75, 18.0, -45.0)
        ]
      },
      // 0D. V-310 Top Overhead Make-up Gas -> High Corridor -> Join between E-405/E-406
      {
        name: 'V-310 Top Make-Up Syngas -> Joins E-405/E-406 Interstage',
        color: 0x0284c7,
        radius: 0.72,
        speed: 0.08,
        particleColor: 0x38bdf8,
        points: [
          new THREE.Vector3(-105.0, 40.5, -45.0),
          new THREE.Vector3(-105.0, 46.0, -45.0),
          new THREE.Vector3(-17.5, 46.0, -45.0),
          new THREE.Vector3(-17.5, 46.0, 25.0),
          new THREE.Vector3(-17.5, 13.5, 25.0)
        ]
      },
      // 0H. V-401 Overhead Recycle Gas -> K-301 Recycle Wheel Suction
      {
        name: 'V-401 Overhead Recycle Gas -> K-301 Recycle Wheel Suction',
        color: 0x0284c7,
        radius: 0.95,
        speed: 0.09,
        particleColor: 0x38bdf8,
        points: [
          new THREE.Vector3(-92.0, 67.0, -35.0),
          new THREE.Vector3(-92.0, 72.0, -35.0),
          new THREE.Vector3(-92.0, 72.0, 32.0),
          new THREE.Vector3(-96.0, 72.0, 32.0),
          new THREE.Vector3(-96.0, 6.0, 32.0)
        ]
      },
      // 0I. K-301 Recycle Wheel Discharge -> High Corridor -> E-407 Shell Top Inlet
      {
        name: 'K-301 Recycle Wheel Discharge -> E-407 Shell Top Inlet',
        color: 0x0284c7,
        radius: 0.95,
        speed: 0.09,
        particleColor: 0x38bdf8,
        points: [
          new THREE.Vector3(-96.0, 9.8, 25.0),
          new THREE.Vector3(-96.0, 26.0, 25.0),
          new THREE.Vector3(-70.0, 26.0, 25.0),
          new THREE.Vector3(-70.0, 20.5, 25.0)
        ]
      },

      // 1A. R-401 Bottom Effluent (470°C) -> E-401 Tubes In (Bottom Channel)
      {
        name: 'R-401 Bottom Effluent (470°C) -> E-401 Tubes In',
        color: 0xdc2626,
        radius: 1.1,
        speed: 0.08,
        particleColor: 0xff3b30,
        points: [
          new THREE.Vector3(65.0, 12.0, -35.0),
          new THREE.Vector3(65.0, 6.0, -35.0),
          new THREE.Vector3(32.5, 6.0, -35.0),
          new THREE.Vector3(32.5, 8.5, -35.0)
        ]
      },
      // 1B. E-401 Tube Outlet (336°C) -> E-402 Tube Inlet (Top Channel)
      {
        name: 'E-401 Tube Outlet (336°C) -> E-402 Tubes In',
        color: 0xea580c,
        radius: 1.0,
        speed: 0.08,
        particleColor: 0xff9500,
        points: [
          new THREE.Vector3(25.0, 68.0, -35.0),
          new THREE.Vector3(25.0, 76.0, -35.0),
          new THREE.Vector3(0.0, 76.0, -35.0),
          new THREE.Vector3(0.0, 62.0, -35.0)
        ]
      },
      // 1C. E-402 Tube Outlet (196°C) -> E-403 Tube Inlet (Top Channel)
      {
        name: 'E-402 Tube Outlet (196°C) -> E-403 Tubes In',
        color: 0xd97706,
        radius: 0.95,
        speed: 0.08,
        particleColor: 0xffcc00,
        points: [
          new THREE.Vector3(-7.0, 8.5, -35.0),
          new THREE.Vector3(-12.5, 8.5, -35.0),
          new THREE.Vector3(-12.5, 74.0, -35.0),
          new THREE.Vector3(-25.0, 74.0, -35.0),
          new THREE.Vector3(-25.0, 62.0, -35.0)
        ]
      },
      // 1D. E-403 Tube Outlet (93°C) -> E-404 Tubes Inlet
      {
        name: 'E-403 Tube Outlet (93°C) -> E-404 Tubes In',
        color: 0x0284c7,
        radius: 0.95,
        speed: 0.08,
        particleColor: 0x38bdf8,
        points: [
          new THREE.Vector3(-32.0, 8.5, -35.0),
          new THREE.Vector3(-37.0, 8.5, -35.0),
          new THREE.Vector3(-37.0, 12.0, -35.0)
        ]
      },
      // 1E. E-404 Tubes Outlet -> V-401 Primary Separator
      {
        name: 'E-404 Condenser Outlet -> V-401 Primary Separator',
        color: 0x0284c7,
        radius: 1.0,
        speed: 0.08,
        particleColor: 0x38bdf8,
        points: [
          new THREE.Vector3(-75.0, 12.0, -35.0),
          new THREE.Vector3(-85.0, 12.0, -35.0),
          new THREE.Vector3(-85.0, 34.0, -35.0)
        ]
      },

      // 3A. E-407 Tube Outlet (-10°C -> +30°C) -> E-403 Shell Bottom Inlet
      {
        name: 'E-407 Tube Outlet (+30°C) -> E-403 Shell Bottom Inlet',
        color: 0x0284c7,
        radius: 0.95,
        speed: 0.08,
        particleColor: 0x38bdf8,
        points: [
          new THREE.Vector3(-51.0, 13.5, 25.0),
          new THREE.Vector3(-25.0, 13.5, 25.0),
          new THREE.Vector3(-25.0, 13.5, -42.0),
          new THREE.Vector3(-25.0, 14.0, -42.0)
        ]
      },
      // 3B. E-403 Shell Top Outlet (148.2°C) -> R-401 Bottom Shroud Annulus
      {
        name: 'E-403 Shell Top (148.2°C) -> R-401 Shroud Annulus Wall In',
        color: 0xea580c,
        radius: 0.95,
        speed: 0.08,
        particleColor: 0xff9500,
        points: [
          new THREE.Vector3(-25.0, 48.0, -28.0),
          new THREE.Vector3(-25.0, 52.0, -28.0),
          new THREE.Vector3(65.0, 52.0, -28.0),
          new THREE.Vector3(65.0, 20.0, -28.0),
          new THREE.Vector3(65.0, 20.0, -22.8)
        ]
      },
      // 3C. R-401 Shroud Top Outlet (165°C) -> E-401 Shell Top Inlet
      {
        name: 'R-401 Top Shroud Out -> E-401 Shell Top Inlet',
        color: 0xea580c,
        radius: 0.95,
        speed: 0.08,
        particleColor: 0xff9500,
        points: [
          new THREE.Vector3(52.8, 88.0, -35.0),
          new THREE.Vector3(48.0, 88.0, -35.0),
          new THREE.Vector3(48.0, 88.0, -20.0),
          new THREE.Vector3(25.0, 88.0, -20.0),
          new THREE.Vector3(25.0, 54.0, -20.0),
          new THREE.Vector3(25.0, 54.0, -27.5)
        ]
      },
      // 3D. E-401 Shell Bottom Outlet (235.5°C) -> J-401 Bypass Manifold
      {
        name: 'E-401 Shell Bottom (235.5°C) -> J-401 Bypass Manifold',
        color: 0xea580c,
        radius: 0.95,
        speed: 0.08,
        particleColor: 0xff9500,
        points: [
          new THREE.Vector3(25.0, 16.0, -27.5),
          new THREE.Vector3(25.0, 5.5, -27.5),
          new THREE.Vector3(60.0, 5.5, -27.5),
          new THREE.Vector3(60.0, 5.5, 10.0)
        ]
      },
      // 3E. J-401 Normal Run Bypass -> R-401 Top Bed 1 (380°C)
      {
        name: 'J-401 Normal Bypass -> R-401 Top Bed 1 (380°C)',
        color: 0xdc2626,
        radius: 1.1,
        speed: 0.08,
        particleColor: 0xff3b30,
        points: [
          new THREE.Vector3(60.0, 5.5, 10.0),
          new THREE.Vector3(65.0, 5.5, 10.0),
          new THREE.Vector3(65.0, 112.0, 10.0),
          new THREE.Vector3(65.0, 112.0, -35.0),
          new THREE.Vector3(65.0, 106.0, -35.0)
        ]
      },
      // 3F. V-401 Bottom Liquid Ammonia (41°C) -> V-409 Letdown Drum
      {
        name: 'V-401 Bottom Liquid NH3 (41°C) -> V-409 Letdown Drum',
        color: 0x8b5cf6,
        radius: 0.85,
        speed: 0.07,
        particleColor: 0xa78bfa,
        points: [
          new THREE.Vector3(-92.0, 6.5, -35.0),
          new THREE.Vector3(-92.0, 3.5, -35.0),
          new THREE.Vector3(-10.0, 3.5, -35.0),
          new THREE.Vector3(-10.0, 3.5, 65.0),
          new THREE.Vector3(-10.0, 5.5, 65.0)
        ]
      },
      // 3G. V-402 Bottom Liquid Ammonia (-10°C) -> V-409 Letdown Drum
      {
        name: 'V-402 Bottom Liquid NH3 (-10°C) -> V-409 Letdown Drum',
        color: 0x8b5cf6,
        radius: 0.85,
        speed: 0.07,
        particleColor: 0xa78bfa,
        points: [
          new THREE.Vector3(35.0, 6.5, 25.0),
          new THREE.Vector3(35.0, 3.5, 25.0),
          new THREE.Vector3(-10.0, 3.5, 25.0),
          new THREE.Vector3(-10.0, 3.5, 65.0)
        ]
      },
      // 3H. V-405 1st Stage Suction Separator Bottom (-33°C) -> P-401 A/B Product Pumps Suction
      {
        name: 'V-405 Bottom Liquid NH3 (-33°C) -> P-401 A/B Suction',
        color: 0x8b5cf6,
        radius: 0.85,
        speed: 0.07,
        particleColor: 0xa78bfa,
        points: [
          new THREE.Vector3(60.0, 3.5, 95.0),
          new THREE.Vector3(60.0, 2.0, 95.0),
          new THREE.Vector3(21.0, 2.0, 95.0),
          new THREE.Vector3(21.0, 2.0, 65.0),
          new THREE.Vector3(21.0, 4.6, 65.0)
        ]
      },
      // 3I. P-401 A/B Discharge (25 kg/cm²G, -33°C) -> V-451 B Giant Cryogenic Storage Tank
      {
        name: 'P-401 A/B Discharge (25 kg/cm²G, -33°C) -> V-451 B Cryogenic Tank',
        color: 0x8b5cf6,
        radius: 0.95,
        speed: 0.08,
        particleColor: 0xc4b5fd,
        points: [
          new THREE.Vector3(25.0, 4.6, 65.0),
          new THREE.Vector3(29.0, 4.6, 65.0),
          new THREE.Vector3(29.0, 8.5, 65.0),
          new THREE.Vector3(68.0, 8.5, 65.0),
          new THREE.Vector3(68.0, 8.5, 55.0),
          new THREE.Vector3(69.0, 8.5, 55.0)
        ]
      }
    ];

    pipeDefinitions.forEach((def) => {
      const curve = this.createOrthogonalCurve(def.points);
      const tubeGeo = new THREE.TubeGeometry(curve, Math.max(20, Math.floor(curve.getLength() * 1.5)), def.radius, 16, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: def.color,
        roughness: 0.3,
        metalness: 0.85
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      this.group.add(tubeMesh);

      this.addParticleFlowStream(curve, def.particleColor, def.speed);
    });
  }

  // 10. High-Visibility Industrial Badges & Tags
  private buildEquipmentBadgesAndSigns() {
    const badgeDirectory: Array<{
      tag: string;
      ar: string;
      param: string;
      pos: THREE.Vector3;
      scale?: [number, number];
    }> = [
      { tag: 'K-301', ar: 'ضاغط التعويض والتدوير K-301', param: '95°C | 240 kg/cm²', pos: new THREE.Vector3(-105, 20.0, 25), scale: [12.0, 4.5] },
      { tag: 'E-315', ar: 'مبرد غاز التعويض المائي E-315', param: '95°C -> 26°C | C.W.', pos: new THREE.Vector3(-105, 20.0, -10), scale: [11.0, 4.0] },
      { tag: 'V-310', ar: 'عازل رطوبة غاز التعويض V-310', param: '26°C | 240 kg/cm²', pos: new THREE.Vector3(-105, 45.0, -45), scale: [11.0, 4.0] },
      { tag: 'E-407', ar: 'مبادل تبريد الغاز E-407', param: '40°C -> 26.5°C | Q=5.1 Gcal/h', pos: new THREE.Vector3(-70, 26.0, 25), scale: [11.0, 4.0] },
      { tag: 'E-405', ar: 'مبرد الأمونيا الأولي E-405', param: '26.5°C -> 14°C (+8°C Evap)', pos: new THREE.Vector3(-35, 30.0, 25), scale: [11.0, 4.0] },
      { tag: 'E-406', ar: 'مبرد الأمونيا الثانوي E-406', param: '14°C -> -10°C (-10°C Evap)', pos: new THREE.Vector3(0, 30.0, 25), scale: [11.0, 4.0] },
      { tag: 'V-402', ar: 'عازل الأمونيا الباردة V-402', param: '-10.0°C | 220.0 kg/cm²', pos: new THREE.Vector3(35, 65.0, 25), scale: [12.0, 4.5] },
      { tag: 'R-401', ar: 'مفاعل تخليق الأمونيا R-401 (العملاق 102m)', param: 'Bed 1: 380°C | Effluent: 470°C | 224 bar', pos: new THREE.Vector3(65, 105.0, -35), scale: [16.0, 6.0] },
      { tag: 'H-401', ar: 'مسخن بدء التشغيل الفرني H-401 (108m)', param: 'API 560 Process Cabin Heater | 108m Stack', pos: new THREE.Vector3(95, 48.0, 15), scale: [14.0, 5.2] },
      { tag: 'J-401', ar: 'خلاط التمرير الجانبي J-401', param: '148.2°C - 235.5°C | 230 kg/cm²', pos: new THREE.Vector3(60, 22.0, 10), scale: [10.0, 3.8] },
      { tag: 'E-401', ar: 'مبادل مبرد منتج التخليق E-401', param: '470°C -> 336.0°C (Tubes) | Shell: 235.5°C', pos: new THREE.Vector3(25, 72.0, -35), scale: [12.0, 4.5] },
      { tag: 'E-402', ar: 'مسخن مياه المراجل E-402', param: '336.0°C -> 196°C (B.F.W.)', pos: new THREE.Vector3(0, 65.0, -35), scale: [11.0, 4.0] },
      { tag: 'E-403', ar: 'مسخن الغاز المغذي E-403', param: '196°C -> 93°C (Shell: 148.2°C)', pos: new THREE.Vector3(-25, 65.0, -35), scale: [11.0, 4.0] },
      { tag: 'E-404 A/B', ar: 'مكثف الأمونيا المائي E-404', param: '93°C -> 41.0°C (C.W.)', pos: new THREE.Vector3(-56, 26.0, -35), scale: [11.0, 4.0] },
      { tag: 'V-401', ar: 'عازل الأمونيا الأولي V-401', param: '41.0°C | 214.3 kg/cm²', pos: new THREE.Vector3(-92, 70.0, -35), scale: [12.0, 4.5] },
      { tag: 'V-409', ar: 'وعاء تخفيض الضغط V-409', param: '13.2°C | 22.0 kg/cm²', pos: new THREE.Vector3(-10, 26.0, 65), scale: [11.0, 4.0] },
      { tag: 'P-401 A/B', ar: 'مضخات منتج الأمونيا P-401', param: '41,670 kg/h | -33°C | V-405 -> V-451 B', pos: new THREE.Vector3(25, 14.0, 65), scale: [11.0, 4.0] },
      { tag: 'V-451 B', ar: 'خزان الأمونيا المبردة V-451 B (العملاق)', param: '-33°C | 0.04 kg/cm² | 20,000 MT', pos: new THREE.Vector3(85, 36.0, 55), scale: [16.0, 6.0] },
      { tag: 'K-401', ar: 'ضاغط منظومة التثليج K-401', param: '3-Casing Train + Turbine K-401T', pos: new THREE.Vector3(30, 22.0, 95), scale: [12.0, 4.5] }
    ];

    badgeDirectory.forEach((item) => {
      const tagCanvas = document.createElement('canvas');
      tagCanvas.width = 512;
      tagCanvas.height = 200;
      const ctx = tagCanvas.getContext('2d')!;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 512, 200);

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 504, 192);

      ctx.strokeStyle = '#00e5aa';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 492, 180);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 52px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(item.tag, 256, 68);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(item.ar, 256, 124);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(item.param, 256, 170);

      const tex = new THREE.CanvasTexture(tagCanvas);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      const sprite = new THREE.Sprite(spriteMat);
      const sx = item.scale ? item.scale[0] : 6.0;
      const sy = item.scale ? item.scale[1] : 2.4;
      sprite.scale.set(sx, sy, 1);
      sprite.position.copy(item.pos);
      this.group.add(sprite);
    });
  }

  // 11. Grand Master DCS Operations & PFD Display Screen
  private buildDcsInfoScreens() {
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 0, 120);
    screenGroup.name = 'Unit400_Master_PFD_Station';

    [-12.0, 0, 12.0].forEach((xPos) => {
      const pylonGeo = new THREE.BoxGeometry(0.8, 6.5, 0.8);
      const pylon = new THREE.Mesh(pylonGeo, this.matCatwalkSteel);
      pylon.position.set(xPos, 3.25, 0);
      screenGroup.add(pylon);

      const footGeo = new THREE.BoxGeometry(2.0, 0.6, 2.0);
      const foot = new THREE.Mesh(footGeo, this.matConcretePad);
      foot.position.set(xPos, 0.3, 0);
      screenGroup.add(foot);
    });

    const walkGeo = new THREE.BoxGeometry(32.0, 0.3, 3.0);
    const walk = new THREE.Mesh(walkGeo, this.matCatwalkSteel);
    walk.position.set(0, 5.8, 1.8);
    screenGroup.add(walk);

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#050b14';
    ctx.fillRect(0, 0, 2048, 1024);

    ctx.strokeStyle = '#00e5aa';
    ctx.lineWidth = 14;
    ctx.strokeRect(6, 6, 2036, 1012);

    ctx.strokeStyle = '#00c8ef';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 2008, 984);

    ctx.fillStyle = 'rgba(0, 229, 170, 0.15)';
    ctx.fillRect(24, 24, 2000, 90);

    ctx.fillStyle = '#00e5aa';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('⚛️ المخطط التشغيلي الشامل لقسم تخليق وتبريد الأمونيا (القسم 400)', 50, 75);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('AMMONIA SYNTHESIS & REFRIGERATION LOOP (SECTION 400 - DWG 6112P-100-400-00)', 1060, 75);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('● وضع التشغيل الطبيعي: نشط مستقر (NORMAL RUN)', 50, 105);

    ctx.fillStyle = '#f59e0b';
    ctx.fillText('● صمامات H-401: معزولة ومغلقة | صمام بايباص J-401: مفتوح', 680, 105);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('● ضغط الحلقة: 224 bar | المفاعل R-401: بارتفاع 102m | التصدير: -33°C', 1320, 105);

    // 4 Main Column Sections
    const cols = [
      { x: 40, w: 460, title: '1. قطار التدوير والتثليج الأولي', sub: 'Recycle & Chilling (K-301 -> V-402)', color: '#0ea5e9' },
      { x: 530, w: 470, title: '2. قطار التسخين والتفاعل R-401', sub: 'Feed Preheat & Reactor Loop', color: '#ea580c' },
      { x: 1030, w: 470, title: '3. قطار استرجاع الحرارة والتكثيف', sub: 'Effluent Cooling & Condensation', color: '#dc2626' },
      { x: 1530, w: 475, title: '4. غاز التعويض وتثليج K-401', sub: 'Make-up & Refrigeration Cycle', color: '#8b5cf6' }
    ];

    cols.forEach((col) => {
      ctx.fillStyle = 'rgba(10, 20, 35, 0.85)';
      ctx.fillRect(col.x, 130, col.w, 730);
      ctx.strokeStyle = col.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(col.x, 130, col.w, 730);

      ctx.fillStyle = col.color;
      ctx.fillRect(col.x, 130, col.w, 55);
      ctx.fillStyle = '#030c14';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(col.title, col.x + 14, 160);
      ctx.font = '14px monospace';
      ctx.fillText(col.sub, col.x + 14, 178);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16;
    const monGeo = new THREE.BoxGeometry(30.0, 14.0, 0.4);
    const monMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.25,
      metalness: 0.15,
      emissive: 0x051520,
      emissiveMap: tex
    });
    const mon = new THREE.Mesh(monGeo, monMat);
    mon.position.set(0, 12.0, 0);
    screenGroup.add(mon);

    this.registerInteractive(screenGroup, 'unit400_master_pfd_board');
    this.group.add(screenGroup);
  }

  // --- Helper Methods ---

  private createVerticalExchanger(name: string, diameter: number, height: number, shellMat: THREE.MeshStandardMaterial, headMat: THREE.MeshStandardMaterial): THREE.Group {
    const group = new THREE.Group();
    group.name = name;
    const r = diameter / 2;

    const bGeo = new THREE.CylinderGeometry(r * 1.35, r * 1.4, 1.2, 28);
    const bMesh = new THREE.Mesh(bGeo, this.matConcretePad);
    bMesh.position.set(0, 0.6, 0);
    group.add(bMesh);

    const sGeo = new THREE.CylinderGeometry(r * 1.05, r * 1.15, 2.5, 28, 1, true);
    const skirt = new THREE.Mesh(sGeo, this.matCarbonSteel);
    skirt.position.set(0, 2.5, 0);
    group.add(skirt);

    const cylGeo = new THREE.CylinderGeometry(r, r, height, 32);
    const cyl = new THREE.Mesh(cylGeo, shellMat);
    cyl.position.set(0, 3.8 + height / 2, 0);
    group.add(cyl);

    const domeGeo = new THREE.SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const topDome = new THREE.Mesh(domeGeo, headMat);
    topDome.position.set(0, 3.8 + height, 0);
    group.add(topDome);

    const botDome = new THREE.Mesh(domeGeo, headMat);
    botDome.rotation.x = Math.PI;
    botDome.position.set(0, 3.8, 0);
    group.add(botDome);

    const fGeo = new THREE.CylinderGeometry(r * 1.25, r * 1.25, 0.4, 32);
    const f1 = new THREE.Mesh(fGeo, this.matFlange);
    f1.position.set(0, 3.8 + height - 0.4, 0);
    group.add(f1);

    const f2 = new THREE.Mesh(fGeo, this.matFlange);
    f2.position.set(0, 4.2, 0);
    group.add(f2);

    return group;
  }

  private createHorizontalShell(diameter: number, length: number, mat: THREE.MeshStandardMaterial): THREE.Group {
    const group = new THREE.Group();
    const r = diameter / 2;

    const saddleDist = length * 0.32;
    [-saddleDist, saddleDist].forEach((sx) => {
      const sPadGeo = new THREE.BoxGeometry(1.8, 4.0, r * 2.5);
      const sPad = new THREE.Mesh(sPadGeo, this.matConcretePad);
      sPad.position.set(sx, -r * 0.2, 0);
      group.add(sPad);
    });

    const cylGeo = new THREE.CylinderGeometry(r, r, length, 32);
    const cyl = new THREE.Mesh(cylGeo, mat);
    cyl.rotation.z = Math.PI / 2;
    group.add(cyl);

    const headGeo = new THREE.SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const headL = new THREE.Mesh(headGeo, mat);
    headL.rotation.z = Math.PI / 2;
    headL.position.set(-length / 2, 0, 0);
    group.add(headL);

    const headR = new THREE.Mesh(headGeo, mat);
    headR.rotation.z = -Math.PI / 2;
    headR.position.set(length / 2, 0, 0);
    group.add(headR);

    const fGeo = new THREE.CylinderGeometry(r * 1.22, r * 1.22, 0.4, 32);
    const f1 = new THREE.Mesh(fGeo, this.matFlange);
    f1.rotation.z = Math.PI / 2;
    f1.position.set(-length / 2 + 0.6, 0, 0);
    group.add(f1);

    const f2 = new THREE.Mesh(fGeo, this.matFlange);
    f2.rotation.z = Math.PI / 2;
    f2.position.set(length / 2 - 0.6, 0, 0);
    group.add(f2);

    return group;
  }

  private addNozzleWithFlange(parent: THREE.Group, pos: THREE.Vector3, dir: THREE.Vector3, radius: number, len: number) {
    const nGeo = new THREE.CylinderGeometry(radius, radius, len, 16);
    const nozzle = new THREE.Mesh(nGeo, this.matAlloySteel);
    nozzle.position.copy(pos);

    const up = new THREE.Vector3(0, 1, 0);
    if (!dir.equals(up)) {
      const q = new THREE.Quaternion().setFromUnitVectors(up, dir.normalize());
      nozzle.quaternion.copy(q);
    }
    parent.add(nozzle);

    const fGeo = new THREE.CylinderGeometry(radius * 1.6, radius * 1.6, 0.22, 16);
    const flange = new THREE.Mesh(fGeo, this.matFlange);
    flange.position.copy(pos.clone().add(dir.clone().multiplyScalar(len * 0.45)));
    if (!dir.equals(up)) {
      const q = new THREE.Quaternion().setFromUnitVectors(up, dir.normalize());
      flange.quaternion.copy(q);
    }
    parent.add(flange);
  }

  private createOrthogonalCurve(points: THREE.Vector3[]): THREE.CurvePath<THREE.Vector3> {
    const path = new THREE.CurvePath<THREE.Vector3>();
    for (let i = 0; i < points.length - 1; i++) {
      path.add(new THREE.LineCurve3(points[i], points[i + 1]));
    }
    return path;
  }

  private addParticleFlowStream(curve: THREE.CurvePath<THREE.Vector3>, color: number, speed: number) {
    const count = 45;
    const geo = new THREE.BufferGeometry();
    const posArr = new Float32Array(count * 3);
    const progressArr = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const p = i / count;
      progressArr[i] = p;
      const pt = curve.getPoint(p);
      posArr[i * 3] = pt.x;
      posArr[i * 3 + 1] = pt.y;
      posArr[i * 3 + 2] = pt.z;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const mat = new THREE.PointsMaterial({
      color: color,
      size: 1.4,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geo, mat);
    this.group.add(points);

    this.particleSystems.push({
      points,
      curve,
      progress: progressArr,
      speed
    });
  }

  private registerInteractive(meshGroup: THREE.Group, eqId: string) {
    const eqData = MASTER_EQUIPMENT_DATA.find((e) => e.id === eqId || e.tag.toLowerCase() === eqId.toLowerCase());
    meshGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.userData = { isEquipment: true, equipmentId: eqId, data: eqData };
        this.interactiveMeshes.push(child);
      }
    });
  }

  // Animation Update
  public update(delta: number) {
    this.particleSystems.forEach((ps) => {
      const pos = ps.points.geometry.attributes.position.array as Float32Array;
      const count = ps.progress.length;
      for (let i = 0; i < count; i++) {
        ps.progress[i] = (ps.progress[i] + ps.speed * delta * 1.5) % 1.0;
        const pt = ps.curve.getPoint(ps.progress[i]);
        pos[i * 3] = pt.x;
        pos[i * 3 + 1] = pt.y;
        pos[i * 3 + 2] = pt.z;
      }
      ps.points.geometry.attributes.position.needsUpdate = true;
    });

    this.rotatingShafts.forEach((s) => {
      s.rotation.x += delta * 12.0;
    });
  }
}
