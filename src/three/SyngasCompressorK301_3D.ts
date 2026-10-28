import * as THREE from 'three';
import { EquipmentInfo, MASTER_EQUIPMENT_DATA } from './PlantDiagramData';
import {
  createCarbonSteelTexture,
  createIndustrialCarbonSteelPipeTexture,
  createCarbonSteelBumpTexture,
  createAluminumCladdingTexture,
  createCladdingBumpTexture,
  createThermalInsulationBandTexture
} from './TextureGenerator';

/**
 * Colossal 3D Digital Twin of Section 3: Synthesis Gas Compressor Complex (Unit 300 / K-301 Train)
 * Engineered to match the exact aesthetic, palette, expansive footprint, width, and fidelity of Section 200 & Section 400:
 * - Grand Industrial Slab & Roadways (380m x 280m) with Drainage Trenches and 70m High-Mast Floodlight Towers
 * - Elevated Concrete Tabletop Mezzanine (Deck at Y = 8.5m) with Overhead Traveling Maintenance Bridge Crane
 * - K-301T HP Extraction/Condensing Steam Turbine Driver (18.5 MW, 10,000 RPM, 105 kg/cm²G Steam -> 38 kg/cm²G Extraction)
 * - K-301 LP Casing (Stages 1 & 2 Barrel Centrifugal Compressor with End Closure Forgings & Bolting)
 * - K-301 HP Casing (Stages 3 & 4 Barrel Centrifugal Compressor + Integrated Recycle Impeller Wheel)
 * - North Equipment Yard (Z = -60m): Knock-Out Separator Drums V-301 (25 bar), V-302 (52 bar), V-303 (105 bar), V-310 (220 bar)
 * - South Equipment Yard (Z = +60m): Shell & Tube Coolers E-301, E-302, E-303, E-315
 * - West Skid: Complete Lube Oil & Dry Gas Seal Console (LO/SO Console) with Dual AC Pumps, Turbine Pump, Coolers & Filters
 * - Fast-Acting Anti-Surge Bypass Stations (FV-301, FV-302, FV-303)
 * - Grade-Level Surface Condenser Package under K-301T Exhaust
 * - Multi-Tier Overhead Heavy Structural Steel Piperacks with Pure Orthogonal Routing & Zero Clashing
 * - Thickened Industrial Piping (PIPE_SCALE = 1.75) with Stucco Aluminum Cladding, SS304 Straps, Lobster Elbows & Flange Boxes
 * - ASME Fluid Identification Bands & Glowing Neon Dynamic Particle Flow Streams
 * - High-Visibility DCS Industrial Telemetry HUD Cards with Arabic & English Engineering Nomenclature
 */
export class SyngasCompressorK301_3D {
  public group: THREE.Group;
  public interactiveMeshes: THREE.Object3D[] = [];
  public claddingMeshes: THREE.Mesh[] = [];
  public onSelectCallback?: (info: EquipmentInfo) => void;

  private rotatingShafts: THREE.Object3D[] = [];
  public isCladdingTranslucent: boolean = false;

  // Photorealistic Materials palette matching Section 200 and Section 400
  private matCarbonSteel!: THREE.MeshStandardMaterial;
  private matCarbonSteelDark!: THREE.MeshStandardMaterial;
  private matAlloySteel!: THREE.MeshStandardMaterial;
  private matPolishedChrome!: THREE.MeshStandardMaterial;
  private matCompressorBlue!: THREE.MeshStandardMaterial;
  private matTurbineCasing!: THREE.MeshStandardMaterial;
  private matConcretePad!: THREE.MeshStandardMaterial;
  private matTrenchGrate!: THREE.MeshStandardMaterial;
  private matYellowSafety!: THREE.MeshStandardMaterial;
  private matCatwalkSteel!: THREE.MeshStandardMaterial;
  private matFlange!: THREE.MeshStandardMaterial;
  private matStudBolt!: THREE.MeshStandardMaterial;
  private matValveBlue!: THREE.MeshStandardMaterial;
  private matValveGreen!: THREE.MeshStandardMaterial;
  private matValveAmber!: THREE.MeshStandardMaterial;
  private matValvePurple!: THREE.MeshStandardMaterial;
  public matAluminumCladding!: THREE.MeshStandardMaterial;
  public matCladdingStraps!: THREE.MeshStandardMaterial;
  public matFlangeInsulationBox!: THREE.MeshStandardMaterial;
  public matLobsterElbow!: THREE.MeshStandardMaterial;
  private matSteamGlow!: THREE.MeshStandardMaterial;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'SyngasCompressorK301_3D_Twin';

    this.initMaterials();
    this.buildFoundationsAndStructures();
    // Gantry crane removed to keep piping and machinery view completely unobstructed
    this.buildCompressorMachineTrain();
    this.buildSurfaceCondenserPackage();
    this.buildInterstageSeparators();
    this.buildInterstageCoolers();
    this.buildLubeAndSealOilConsole();
    this.buildProcessPipingNetwork();
    this.buildEquipmentBadgesAndSigns();
    this.buildDcsInfoScreens();
  }

  private initMaterials() {
    const csDiff = createCarbonSteelTexture();
    const pipeDiff = createIndustrialCarbonSteelPipeTexture();
    const pipeBump = createCarbonSteelBumpTexture();
    const cladTex = createAluminumCladdingTexture();
    cladTex.repeat.set(1, 2);
    const cladBump = createCladdingBumpTexture();
    cladBump.repeat.set(1, 2);

    this.matCarbonSteel = new THREE.MeshStandardMaterial({
      map: pipeDiff,
      bumpMap: pipeBump,
      bumpScale: 0.04,
      roughness: 0.32,
      metalness: 0.88,
      name: 'k301_carbon_steel'
    });

    this.matCarbonSteelDark = new THREE.MeshStandardMaterial({
      color: 0x222831,
      roughness: 0.38,
      metalness: 0.85,
      name: 'k301_cs_dark'
    });

    this.matAlloySteel = new THREE.MeshStandardMaterial({
      map: pipeDiff,
      bumpMap: pipeBump,
      bumpScale: 0.03,
      roughness: 0.26,
      metalness: 0.92,
      name: 'k301_alloy_steel'
    });

    this.matPolishedChrome = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.97,
      name: 'k301_chrome_rotor'
    });

    // Authentic Industrial Machinery Blue for Heavy Centrifugal Compressors (Nuovo Pignone / GE style)
    this.matCompressorBlue = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.28,
      metalness: 0.82,
      name: 'k301_casing_blue'
    });

    this.matTurbineCasing = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.3,
      metalness: 0.9,
      name: 'k301_turbine_steel'
    });

    // Dark industrial concrete slab matching Section 2 & 4
    this.matConcretePad = new THREE.MeshStandardMaterial({
      color: 0x2b3542,
      roughness: 0.9,
      metalness: 0.1,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      name: 'k301_concrete'
    });

    this.matTrenchGrate = new THREE.MeshStandardMaterial({
      color: 0x16202c,
      roughness: 0.7,
      metalness: 0.65,
      name: 'k301_grate'
    });

    this.matYellowSafety = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.4,
      name: 'k301_yellow'
    });

    this.matCatwalkSteel = new THREE.MeshStandardMaterial({
      color: 0x1b2430,
      roughness: 0.55,
      metalness: 0.8,
      name: 'k301_catwalk'
    });

    this.matFlange = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.28,
      metalness: 0.9,
      name: 'k301_flange'
    });

    this.matStudBolt = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.95,
      name: 'k301_bolt'
    });

    this.matValveBlue = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.6,
      name: 'k301_valve_blue'
    });

    this.matValveGreen = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.3,
      metalness: 0.6,
      name: 'k301_valve_green'
    });

    this.matValveAmber = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.6,
      name: 'k301_valve_amber'
    });

    this.matValvePurple = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.3,
      metalness: 0.6,
      name: 'k301_valve_purple'
    });

    this.matAluminumCladding = new THREE.MeshStandardMaterial({
      map: cladTex,
      bumpMap: cladBump,
      bumpScale: 0.05,
      roughness: 0.22,
      metalness: 0.94,
      name: 'k301_aluminum_cladding'
    });

    this.matCladdingStraps = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.15,
      metalness: 0.98,
      name: 'k301_straps'
    });

    this.matFlangeInsulationBox = new THREE.MeshStandardMaterial({
      map: cladTex,
      bumpMap: cladBump,
      bumpScale: 0.04,
      roughness: 0.25,
      metalness: 0.92,
      name: 'k301_flange_box'
    });

    this.matLobsterElbow = new THREE.MeshStandardMaterial({
      map: cladTex,
      bumpMap: cladBump,
      bumpScale: 0.04,
      roughness: 0.24,
      metalness: 0.93,
      name: 'k301_lobster_elbow'
    });

    this.matSteamGlow = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8
    });
  }

  // 1. Reinforced Concrete Foundation Yard & Elevated Table-Top Mezzanine Structure
  private buildFoundationsAndStructures() {
    // Grand Industrial Slab (380m x 280m) matching Section 2 & 4 scale
    const slabGeo = new THREE.BoxGeometry(380, 1.8, 280);
    const slab = new THREE.Mesh(slabGeo, this.matConcretePad);
    slab.position.set(0, -0.9, 0);
    slab.receiveShadow = true;
    this.group.add(slab);

    // Perimeter Asphalt Access Roads
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x131820, roughness: 0.95, metalness: 0.05 });
    const roadN = new THREE.Mesh(new THREE.BoxGeometry(410, 0.15, 24), roadMat);
    roadN.position.set(0, -0.9, -135);
    this.group.add(roadN);

    const roadS = new THREE.Mesh(new THREE.BoxGeometry(410, 0.15, 24), roadMat);
    roadS.position.set(0, -0.9, 135);
    this.group.add(roadS);

    const roadE = new THREE.Mesh(new THREE.BoxGeometry(24, 0.15, 300), roadMat);
    roadE.position.set(195, -0.9, 0);
    this.group.add(roadE);

    const roadW = new THREE.Mesh(new THREE.BoxGeometry(24, 0.15, 300), roadMat);
    roadW.position.set(-195, -0.9, 0);
    this.group.add(roadW);

    // Yellow Safety Curbs
    const curbGeoL = new THREE.BoxGeometry(1.2, 0.45, 280);
    const curbL = new THREE.Mesh(curbGeoL, this.matYellowSafety);
    curbL.position.set(-179.4, 0.22, 0);
    this.group.add(curbL);

    const curbR = new THREE.Mesh(curbGeoL, this.matYellowSafety);
    curbR.position.set(179.4, 0.22, 0);
    this.group.add(curbR);

    // Concrete Drainage Trenches with Cast Iron Grates
    [-90, -45, 0, 45, 90].forEach((zPos) => {
      const trench = new THREE.Mesh(new THREE.BoxGeometry(360, 0.12, 2.5), this.matTrenchGrate);
      trench.position.set(0, 0.06, zPos);
      this.group.add(trench);
    });

    // Elevated Table-Top Concrete Compressor Mezzanine (Length 110m, Width 32m, Deck at Y = 8.5m)
    const tableTop = new THREE.Group();
    tableTop.position.set(0, 0, 0);

    // 16 Heavy Concrete Support Piers (4.2m x 4.2m x 8.5m) with Beveled Chamfers
    for (let cx of [-45, -30, -15, 0, 15, 30, 45]) {
      for (let cz of [-12, 12]) {
        const colGeo = new THREE.BoxGeometry(4.2, 8.5, 4.2);
        const col = new THREE.Mesh(colGeo, this.matConcretePad);
        col.position.set(cx, 4.25, cz);
        col.castShadow = true;
        col.receiveShadow = true;
        tableTop.add(col);

        // Column Foundation Footing
        const foot = new THREE.Mesh(new THREE.BoxGeometry(6.0, 1.2, 6.0), this.matConcretePad);
        foot.position.set(cx, 0.6, cz);
        tableTop.add(foot);
      }
    }

    // Heavy Elevated Table-Top Concrete Slab (Thickness 2.5m at Y = 8.5m)
    const slabDeckGeo = new THREE.BoxGeometry(116.0, 2.5, 34.0);
    const slabDeck = new THREE.Mesh(slabDeckGeo, this.matConcretePad);
    slabDeck.position.set(0, 9.75, 0);
    slabDeck.receiveShadow = true;
    tableTop.add(slabDeck);

    // Mezzanine Perimeter Safety Handrails (Yellow Industrial Safety Standard)
    const railMat = this.matYellowSafety;
    const railN = new THREE.Mesh(new THREE.BoxGeometry(116.0, 1.3, 0.15), railMat);
    railN.position.set(0, 11.65, -16.9);
    tableTop.add(railN);

    const railS = new THREE.Mesh(new THREE.BoxGeometry(116.0, 1.3, 0.15), railMat);
    railS.position.set(0, 11.65, 16.9);
    tableTop.add(railS);

    const railE = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.3, 34.0), railMat);
    railE.position.set(57.9, 11.65, 0);
    tableTop.add(railE);

    const railW = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.3, 34.0), railMat);
    railW.position.set(-57.9, 11.65, 0);
    tableTop.add(railW);

    // Twin Access Staircases (East and West ends) with Intermediate Landings
    [-59.5, 59.5].forEach((sx) => {
      const stairGroup = new THREE.Group();
      stairGroup.position.set(sx, 0, 0);
      const steps = 26;
      for (let s = 0; s < steps; s++) {
        const sy = (s / steps) * 11.0;
        const sz = (s / steps) * 20.0 - 10.0;
        const step = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.35, 1.1), this.matCatwalkSteel);
        step.position.set(0, sy, sz);
        stairGroup.add(step);
      }
      // Stair Handrail
      const sRail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 22.0), this.matYellowSafety);
      sRail.position.set(1.9, 6.0, 0);
      sRail.rotation.x = Math.atan2(11.0, 20.0);
      stairGroup.add(sRail);

      tableTop.add(stairGroup);
    });

    this.group.add(tableTop);

    // 6 High-Mast Industrial Floodlight Towers (70m Height) matching Section 2 & 4
    [
      { x: -160, z: -105 },
      { x: 0, z: -105 },
      { x: 160, z: -105 },
      { x: -160, z: 105 },
      { x: 0, z: 105 },
      { x: 160, z: 105 }
    ].forEach((mast) => {
      const mastGeo = new THREE.CylinderGeometry(0.9, 2.2, 70.0, 16);
      const mastMesh = new THREE.Mesh(mastGeo, this.matCarbonSteel);
      mastMesh.position.set(mast.x, 35.0, mast.z);
      this.group.add(mastMesh);

      const mastBase = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.8, 5.2), this.matConcretePad);
      mastBase.position.set(mast.x, 0.9, mast.z);
      this.group.add(mastBase);

      const crown = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.4, 0.8, 16), this.matCatwalkSteel);
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

  // 1B. Overhead Heavy Maintenance Traveling Bridge Crane & Structural Portal Columns
  private buildOverheadGantryCrane() {
    const craneGroup = new THREE.Group();
    craneGroup.position.set(0, 0, 0);

    // Crane Runway Beams (Elevated at Y = 28.0m on structural columns along North & South mezzanine)
    [-14.0, 14.0].forEach((cz) => {
      const runwayBeam = new THREE.Mesh(new THREE.BoxGeometry(112.0, 1.6, 1.0), this.matCatwalkSteel);
      runwayBeam.position.set(0, 27.5, cz);
      craneGroup.add(runwayBeam);

      // Support Columns for Crane Runway
      for (let cx of [-45, -22.5, 0, 22.5, 45]) {
        const cCol = new THREE.Mesh(new THREE.BoxGeometry(1.4, 16.5, 1.4), this.matCatwalkSteel);
        cCol.position.set(cx, 19.25, cz);
        craneGroup.add(cCol);
      }
    });

    // Yellow Heavy Overhead Crane Bridge Girder (Positioned over machine train at X = 5.0m)
    const bridgeGirder = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.4, 30.0), this.matYellowSafety);
    bridgeGirder.position.set(5.0, 29.5, 0);
    craneGroup.add(bridgeGirder);

    // Crane Hoist Trolley & Hook (Lift Capacity: 65 Tons)
    const trolley = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.4, 3.5), this.matCatwalkSteel);
    trolley.position.set(5.0, 31.0, 2.0);
    craneGroup.add(trolley);

    // Wire Ropes & Heavy Forged Lifting Hook
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 12.0, 8), this.matStudBolt);
    rope.position.set(5.0, 24.5, 2.0);
    craneGroup.add(rope);

    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.22, 12, 24, Math.PI * 1.5), this.matAlloySteel);
    hook.position.set(5.0, 18.0, 2.0);
    hook.rotation.z = Math.PI;
    craneGroup.add(hook);

    this.group.add(craneGroup);
  }

  // 2. K-301 Steam Turbine & Multi-Stage Centrifugal Compressor Machine Train
  private buildCompressorMachineTrain() {
    const trainGroup = new THREE.Group();
    trainGroup.position.set(0, 11.0, 0); // Sits on top of tabletop mezzanine deck (Y = 11.0m)
    trainGroup.name = 'K-301_Machine_Train';

    // Base Skid Soleplates (Continuous Heavy Alloy Steel Base, Length 96m, Width 16m)
    const solePlate = new THREE.Mesh(new THREE.BoxGeometry(96.0, 1.0, 16.0), this.matAlloySteel);
    solePlate.position.set(0, 0.5, 0);
    trainGroup.add(solePlate);

    // Centerline High-Speed Rotor Shaft (Diameter 0.9m, Length 90.0m)
    const shaftGeo = new THREE.CylinderGeometry(0.45, 0.45, 90.0, 24);
    const shaft = new THREE.Mesh(shaftGeo, this.matPolishedChrome);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(0, 4.5, 0);
    trainGroup.add(shaft);
    this.rotatingShafts.push(shaft);

    // ==========================================
    // A. K-301T HP Extraction/Condensing Steam Turbine Driver (X = -32.0m)
    // ==========================================
    const turbGroup = new THREE.Group();
    turbGroup.position.set(-32.0, 0, 0);
    turbGroup.name = 'K-301T_Steam_Turbine';

    // Heavy Pedestal Bearings & Journal Bearing Housings
    [-11.5, 11.5].forEach((bx) => {
      const bBlock = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.2, 5.2), this.matTurbineCasing);
      bBlock.position.set(bx, 2.5, 0);
      turbGroup.add(bBlock);
    });

    // Stepped High-Pressure Steam Turbine Casing (Length 20.0m, Outer Diameter 5.8m -> 7.4m)
    const tCasingGeo = new THREE.CylinderGeometry(3.7, 2.9, 19.0, 32);
    const tCasing = new THREE.Mesh(tCasingGeo, this.matTurbineCasing);
    tCasing.rotation.z = Math.PI / 2;
    tCasing.position.set(0, 4.5, 0);
    turbGroup.add(tCasing);

    // Horizontal Split-Line Flange Bolting
    const tFlange = new THREE.Mesh(new THREE.BoxGeometry(18.5, 0.25, 6.8), this.matTurbineCasing);
    tFlange.position.set(0, 4.5, 0);
    turbGroup.add(tFlange);

    // HP Steam Chest (105 kg/cm²G, 510°C) with 4 Hydraulic Actuator Governor Valves
    const chestGeo = new THREE.BoxGeometry(6.5, 3.6, 6.5);
    const chest = new THREE.Mesh(chestGeo, this.matTurbineCasing);
    chest.position.set(-5.5, 8.5, 0);
    turbGroup.add(chest);

    [-2.0, 2.0].forEach((vx) => {
      [-2.0, 2.0].forEach((vz) => {
        const govGeo = new THREE.CylinderGeometry(0.65, 0.65, 4.0, 16);
        const gov = new THREE.Mesh(govGeo, this.matValveAmber);
        gov.position.set(-5.5 + vx, 11.0, vz);
        turbGroup.add(gov);

        const handWheel = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.12, 8, 20), this.matYellowSafety);
        handWheel.rotation.x = Math.PI / 2;
        handWheel.position.set(-5.5 + vx, 13.2, vz);
        turbGroup.add(handWheel);
      });
    });

    // MP Steam Extraction Chest (38 kg/cm²G) at X = 2.0m
    const extChest = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 3.8, 20), this.matTurbineCasing);
    extChest.position.set(2.0, 8.0, 0);
    turbGroup.add(extChest);

    // Steam Chest Inlet Flange on Top
    this.addNozzleWithFlange(turbGroup, new THREE.Vector3(-5.5, 10.3, 0), new THREE.Vector3(0, 1, 0), 1.3, 1.2);
    // MP Extraction Nozzle on Top
    this.addNozzleWithFlange(turbGroup, new THREE.Vector3(2.0, 9.9, 0), new THREE.Vector3(0, 1, 0), 1.2, 1.2);

    // Downward Steam Exhaust Neck to Surface Condenser (Diameter 4.8m)
    const exNozzle = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 4.5, 24), this.matTurbineCasing);
    exNozzle.position.set(6.0, 1.5, 0);
    turbGroup.add(exNozzle);

    this.registerInteractive(turbGroup, 'k-301t');
    trainGroup.add(turbGroup);

    // Flexible High-Speed Diaphragm Coupling Guard 1 (Between Turbine and LP Casing)
    const coup1 = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 2.5, 20), this.matYellowSafety);
    coup1.rotation.z = Math.PI / 2;
    coup1.position.set(-19.0, 4.5, 0);
    trainGroup.add(coup1);

    // ==========================================
    // B. K-301 LP Barrel Casing: Case 1 - Stage 1 (X = -8.5m)
    // ==========================================
    const lpGroup = new THREE.Group();
    lpGroup.position.set(-8.5, 0, 0);
    lpGroup.name = 'K-301_LP_Casing_Case1';

    // Pedestal Bearings for LP Case
    [-6.5, 6.5].forEach((bx) => {
      const bBlock = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.8, 4.8), this.matCompressorBlue);
      bBlock.position.set(bx, 2.2, 0);
      lpGroup.add(bBlock);
    });

    const lpCasingGeo = new THREE.CylinderGeometry(3.6, 3.6, 13.0, 32);
    const lpCasing = new THREE.Mesh(lpCasingGeo, this.matCompressorBlue);
    lpCasing.rotation.z = Math.PI / 2;
    lpCasing.position.set(0, 4.5, 0);
    lpGroup.add(lpCasing);

    // End Barrel Closure Heads & Heavy Shear Ring Flanges
    [-6.5, 6.5].forEach((hx) => {
      const headGeo = new THREE.CylinderGeometry(3.9, 3.9, 1.4, 32);
      const head = new THREE.Mesh(headGeo, this.matFlange);
      head.rotation.z = Math.PI / 2;
      head.position.set(hx, 4.5, 0);
      lpGroup.add(head);

      for (let b = 0; b < 24; b++) {
        const angle = (b / 24) * Math.PI * 2;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.8, 8), this.matStudBolt);
        bolt.rotation.z = Math.PI / 2;
        bolt.position.set(hx, 4.5 + Math.sin(angle) * 3.5, Math.cos(angle) * 3.5);
        lpGroup.add(bolt);
      }
    });

    // Stage 1 Suction Nozzle (Bottom-In: Diameter 1.4m at world X = -10.5m -> local X = -2.0m)
    this.addNozzleWithFlange(lpGroup, new THREE.Vector3(-2.0, 0.9, 0), new THREE.Vector3(0, -1, 0), 1.4, 0.9);
    // Stage 1 Discharge Nozzle (Top-Out: Diameter 1.3m at world X = -6.0m -> local X = +2.5m)
    this.addNozzleWithFlange(lpGroup, new THREE.Vector3(2.5, 8.1, 0), new THREE.Vector3(0, 1, 0), 1.3, 1.2);

    this.registerInteractive(lpGroup, 'k-301_lp');
    trainGroup.add(lpGroup);

    // Flexible High-Speed Diaphragm Coupling Guard 2 (Between LP Case 1 and MP Case 2)
    const coup2 = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 2.5, 20), this.matYellowSafety);
    coup2.rotation.z = Math.PI / 2;
    coup2.position.set(1.75, 4.5, 0);
    trainGroup.add(coup2);

    // ==========================================
    // C. K-301 MP Barrel Casing: Case 2 - Stage 2 (X = +12.0m)
    // ==========================================
    const mpGroup = new THREE.Group();
    mpGroup.position.set(12.0, 0, 0);
    mpGroup.name = 'K-301_MP_Casing_Case2';

    // Pedestal Bearings for MP Case
    [-6.5, 6.5].forEach((bx) => {
      const bBlock = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.8, 4.8), this.matCompressorBlue);
      bBlock.position.set(bx, 2.2, 0);
      mpGroup.add(bBlock);
    });

    const mpCasingGeo = new THREE.CylinderGeometry(3.4, 3.4, 13.0, 32);
    const mpCasing = new THREE.Mesh(mpCasingGeo, this.matCompressorBlue);
    mpCasing.rotation.z = Math.PI / 2;
    mpCasing.position.set(0, 4.5, 0);
    mpGroup.add(mpCasing);

    // End Barrel Closure Heads & Heavy Shear Ring Flanges
    [-6.5, 6.5].forEach((hx) => {
      const headGeo = new THREE.CylinderGeometry(3.7, 3.7, 1.4, 32);
      const head = new THREE.Mesh(headGeo, this.matFlange);
      head.rotation.z = Math.PI / 2;
      head.position.set(hx, 4.5, 0);
      mpGroup.add(head);

      for (let b = 0; b < 24; b++) {
        const angle = (b / 24) * Math.PI * 2;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.8, 8), this.matStudBolt);
        bolt.rotation.z = Math.PI / 2;
        bolt.position.set(hx, 4.5 + Math.sin(angle) * 3.3, Math.cos(angle) * 3.3);
        mpGroup.add(bolt);
      }
    });

    // Stage 2 Suction Nozzle (Bottom-In: Diameter 1.3m at world X = +9.5m -> local X = -2.5m)
    this.addNozzleWithFlange(mpGroup, new THREE.Vector3(-2.5, 1.1, 0), new THREE.Vector3(0, -1, 0), 1.3, 1.1);
    // Stage 2 Discharge Nozzle (Top-Out: Diameter 1.2m at world X = +14.5m -> local X = +2.5m)
    this.addNozzleWithFlange(mpGroup, new THREE.Vector3(2.5, 7.9, 0), new THREE.Vector3(0, 1, 0), 1.2, 1.4);

    this.registerInteractive(mpGroup, 'k-301_mp');
    trainGroup.add(mpGroup);

    // Flexible High-Speed Diaphragm Coupling Guard 3 (Between MP Case 2 and HP Case 3)
    const coup3 = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 2.5, 20), this.matYellowSafety);
    coup3.rotation.z = Math.PI / 2;
    coup3.position.set(22.25, 4.5, 0);
    trainGroup.add(coup3);

    // ==========================================
    // D. K-301 HP Barrel Casing: Case 3 - Stages 3 & 4 + Recycle Impeller (X = +34.0m)
    // ==========================================
    const hpGroup = new THREE.Group();
    hpGroup.position.set(34.0, 0, 0);
    hpGroup.name = 'K-301_HP_Casing_Case3';

    // Pedestal Bearings for HP Case
    [-10.0, 10.0].forEach((bx) => {
      const bBlock = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.0, 4.8), this.matCompressorBlue);
      bBlock.position.set(bx, 2.2, 0);
      hpGroup.add(bBlock);
    });

    const hpCasingGeo = new THREE.CylinderGeometry(3.3, 3.3, 20.0, 32);
    const hpCasing = new THREE.Mesh(hpCasingGeo, this.matCompressorBlue);
    hpCasing.rotation.z = Math.PI / 2;
    hpCasing.position.set(0, 4.5, 0);
    hpGroup.add(hpCasing);

    // End Barrel Heavy Closure Forgings
    [-10.0, 10.0].forEach((hx) => {
      const head = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 1.6, 32), this.matFlange);
      head.rotation.z = Math.PI / 2;
      head.position.set(hx, 4.5, 0);
      hpGroup.add(head);

      for (let b = 0; b < 28; b++) {
        const angle = (b / 28) * Math.PI * 2;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.0, 8), this.matStudBolt);
        bolt.rotation.z = Math.PI / 2;
        bolt.position.set(hx, 4.5 + Math.sin(angle) * 3.2, Math.cos(angle) * 3.2);
        hpGroup.add(bolt);
      }
    });

    // Stage 3 Suction Nozzle (Bottom-In: Diameter 1.2m at world X = +27.5m -> local X = -6.5m)
    this.addNozzleWithFlange(hpGroup, new THREE.Vector3(-6.5, 1.2, 0), new THREE.Vector3(0, -1, 0), 1.2, 1.2);
    // Stage 3 Discharge Nozzle (Top-Out: Diameter 1.1m at world X = +31.5m -> local X = -2.5m)
    this.addNozzleWithFlange(hpGroup, new THREE.Vector3(-2.5, 7.8, 0), new THREE.Vector3(0, 1, 0), 1.1, 1.5);
    // Stage 4 Suction Nozzle (Bottom-In: Diameter 1.1m at world X = +36.5m -> local X = +2.5m)
    this.addNozzleWithFlange(hpGroup, new THREE.Vector3(2.5, 1.2, 0), new THREE.Vector3(0, -1, 0), 1.1, 1.2);
    // Stage 4 Discharge / Recycle Discharge (Top-Out: Diameter 1.1m at world X = +40.5m -> local X = +6.5m)
    this.addNozzleWithFlange(hpGroup, new THREE.Vector3(6.5, 7.8, 0), new THREE.Vector3(0, 1, 0), 1.1, 1.5);

    this.registerInteractive(hpGroup, 'k-301');
    this.registerInteractive(hpGroup, 'k-301_hp');
    trainGroup.add(hpGroup);

    this.group.add(trainGroup);
  }

  // 2B. Grade-Level Surface Condenser Package under K-301T Exhaust
  private buildSurfaceCondenserPackage() {
    const condGroup = new THREE.Group();
    condGroup.position.set(-26.0, 0, 0);
    condGroup.name = 'K-301T_Surface_Condenser';

    // Massive Horizontal Surface Condenser Shell (Length 24m, Diameter 6.5m at Y = 4.2m under mezzanine)
    const shellGeo = new THREE.CylinderGeometry(3.25, 3.25, 24.0, 32);
    const shell = new THREE.Mesh(shellGeo, this.matCarbonSteel);
    shell.rotation.z = Math.PI / 2;
    shell.position.set(0, 4.2, 0);
    condGroup.add(shell);

    // Twin Hotwell Sump Vessels at bottom of condenser
    const hotwell = new THREE.Mesh(new THREE.BoxGeometry(8.0, 2.4, 4.5), this.matCarbonSteel);
    hotwell.position.set(0, 1.2, 0);
    condGroup.add(hotwell);

    // Condensate Extraction Pumps (P-302 A/B)
    [-3.0, 3.0].forEach((pz) => {
      const pMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.5, 16), this.matValveBlue);
      pMotor.position.set(8.0, 2.8, pz);
      condGroup.add(pMotor);

      const pPump = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.8, 16), this.matAlloySteel);
      pPump.position.set(8.0, 0.9, pz);
      condGroup.add(pPump);
    });

    this.group.add(condGroup);
  }

  // 3. Interstage Knock-Out Separator Drums (North Yard: Z = -60m)
  private buildInterstageSeparators() {
    const sepList = [
      { id: 'v-301', tag: 'V-301', name: '1st Stage Suction KO Drum (25 bar)', x: -75, h: 26.0, d: 7.2 },
      { id: 'v-302', tag: 'V-302', name: '2nd Stage Suction KO Drum (44 bar)', x: -25, h: 28.0, d: 6.8 },
      { id: 'v-303', tag: 'V-303', name: '3rd Stage Suction KO Drum (105 bar)', x: 25, h: 30.0, d: 6.4 },
      { id: 'v-310', tag: 'V-310', name: 'Make-Up Final High-Pressure Separator (220 bar)', x: 75, h: 36.0, d: 7.8 }
    ];

    sepList.forEach((sep) => {
      const vGroup = new THREE.Group();
      vGroup.position.set(sep.x, 0, -60);
      vGroup.name = sep.tag;

      // Reinforced Concrete Octagonal Foundation Base
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(sep.d * 0.68, sep.d * 0.76, 2.2, 8), this.matConcretePad);
      foot.position.set(0, 1.1, 0);
      vGroup.add(foot);

      // Support Skirt with Access Manhole
      const skirt = new THREE.Mesh(new THREE.CylinderGeometry(sep.d * 0.5, sep.d * 0.52, 5.5, 24, 1, true), this.matCarbonSteel);
      skirt.position.set(0, 4.8, 0);
      vGroup.add(skirt);

      // Cylindrical Shell Body
      const shellH = sep.h - 10.5;
      const shell = new THREE.Mesh(new THREE.CylinderGeometry(sep.d * 0.5, sep.d * 0.5, shellH, 32), this.matAlloySteel);
      shell.position.set(0, 5.5 + shellH / 2, 0);
      vGroup.add(shell);

      // Hemispherical Top & Bottom Heads
      const topHead = new THREE.Mesh(new THREE.SphereGeometry(sep.d * 0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), this.matAlloySteel);
      topHead.position.set(0, 5.5 + shellH, 0);
      vGroup.add(topHead);

      const botHead = new THREE.Mesh(new THREE.SphereGeometry(sep.d * 0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), this.matAlloySteel);
      botHead.rotation.x = Math.PI;
      botHead.position.set(0, 5.5, 0);
      vGroup.add(botHead);

      // Circular Access Platforms & Handrails
      [0.45, 0.85].forEach((frac) => {
        const platY = 5.5 + shellH * frac;
        const plat = new THREE.Mesh(new THREE.CylinderGeometry(sep.d * 0.75, sep.d * 0.75, 0.4, 28), this.matCatwalkSteel);
        plat.position.set(0, platY, 0);
        vGroup.add(plat);

        const rail = new THREE.Mesh(new THREE.TorusGeometry(sep.d * 0.74, 0.14, 8, 28), this.matYellowSafety);
        rail.rotation.x = Math.PI / 2;
        rail.position.set(0, platY + 1.8, 0);
        vGroup.add(rail);
      });

      // Nozzles (Top Gas Outlet, South Tangential Feed Inlet, Bottom Liquid Drain)
      this.addNozzleWithFlange(vGroup, new THREE.Vector3(0, 5.5 + shellH + sep.d * 0.5, 0), new THREE.Vector3(0, 1, 0), 1.4, 3.6);
      this.addNozzleWithFlange(vGroup, new THREE.Vector3(0, 2.2, 0), new THREE.Vector3(0, -1, 0), 0.9, 2.8);
      this.addNozzleWithFlange(vGroup, new THREE.Vector3(0, 5.5 + shellH * 0.5, sep.d * 0.5), new THREE.Vector3(0, 0, 1), 1.4, 3.6); // Feed Inlet

      this.registerInteractive(vGroup, sep.id);
      this.group.add(vGroup);
    });
  }

  // 4. Interstage Shell & Tube Heat Exchangers (South Yard: Z = +60m)
  // Specific Process Rule:
  // - E-301: Gas in SHELL, Cooling Water (WC) in TUBES
  // - E-302, E-303, E-315: Gas in TUBES, Cooling Water (WC) in SHELL
  private buildInterstageCoolers() {
    const clrList = [
      {
        id: 'e-301',
        tag: 'E-301',
        name: '1st Stage Intercooler (Gas in Shell / WC in Tubes)',
        x: -75,
        l: 32.0,
        d: 6.6,
        gasInShell: true
      },
      {
        id: 'e-302',
        tag: 'E-302',
        name: '2nd Stage Intercooler (Gas in Tubes / WC in Shell)',
        x: -25,
        l: 34.0,
        d: 7.0,
        gasInShell: false
      },
      {
        id: 'e-303',
        tag: 'E-303',
        name: '3rd Stage Intercooler (Gas in Tubes / WC in Shell)',
        x: 25,
        l: 34.0,
        d: 7.0,
        gasInShell: false
      },
      {
        id: 'e-315',
        tag: 'E-315',
        name: '4th Stage Make-Up Final Cooler (Gas in Tubes / WC in Shell)',
        x: 75,
        l: 38.0,
        d: 7.5,
        gasInShell: false
      }
    ];

    clrList.forEach((clr) => {
      const eGroup = new THREE.Group();
      eGroup.position.set(clr.x, 0, 60);
      eGroup.name = clr.tag;

      // Heavy Reinforced Concrete Saddles
      [-clr.l * 0.3, clr.l * 0.3].forEach((sx) => {
        const saddle = new THREE.Mesh(new THREE.BoxGeometry(3.0, 5.2, clr.d * 1.35), this.matConcretePad);
        saddle.position.set(sx, 2.6, 0);
        eGroup.add(saddle);
      });

      // Shell Body (Horizontal Cylinder)
      const shellGeo = new THREE.CylinderGeometry(clr.d * 0.5, clr.d * 0.5, clr.l, 32);
      const shell = new THREE.Mesh(shellGeo, this.matCarbonSteel);
      shell.rotation.z = Math.PI / 2;
      shell.position.set(0, 7.2, 0);
      eGroup.add(shell);

      // Channel Heads (Tube Side Water Boxes with Bolted Cover Plates)
      [-clr.l * 0.5, clr.l * 0.5].forEach((cx, idx) => {
        const headGeo = new THREE.CylinderGeometry(clr.d * 0.54, clr.d * 0.54, 3.4, 32);
        const head = new THREE.Mesh(headGeo, this.matFlange);
        head.rotation.z = Math.PI / 2;
        head.position.set(cx, 7.2, 0);
        eGroup.add(head);

        const cover = new THREE.Mesh(new THREE.CylinderGeometry(clr.d * 0.56, clr.d * 0.56, 0.8, 32), this.matAlloySteel);
        cover.rotation.z = Math.PI / 2;
        cover.position.set(cx + (idx === 0 ? -1.8 : 1.8), 7.2, 0);
        eGroup.add(cover);
      });

      if (clr.gasInShell) {
        // E-301: Process Gas in SHELL, Cooling Water (WC) in TUBES
        // Shell Process Nozzles: Gas Inlet Top, Gas Outlet Bottom (100% straight vertical)
        this.addNozzleWithFlange(eGroup, new THREE.Vector3(0, 7.2 + clr.d * 0.5, 0), new THREE.Vector3(0, 1, 0), 1.5, 1.8); // Gas In Top
        this.addNozzleWithFlange(eGroup, new THREE.Vector3(0, 7.2 - clr.d * 0.5, 0), new THREE.Vector3(0, -1, 0), 1.5, 1.8); // Gas Out Bottom

        // Channel Head Nozzles: WC In Bottom at West, WC Out Top at East
        this.addNozzleWithFlange(eGroup, new THREE.Vector3(-clr.l * 0.5, 7.2 - clr.d * 0.54 * 0.5, 0), new THREE.Vector3(0, -1, 0), 1.3, 2.7); // WC In Bottom
        this.addNozzleWithFlange(eGroup, new THREE.Vector3(clr.l * 0.5, 7.2 + clr.d * 0.54 * 0.5, 0), new THREE.Vector3(0, 1, 0), 1.3, 2.0);   // WC Out Top
      } else {
        // E-302, E-303, E-315: High Pressure Process Gas in TUBES, Cooling Water (WC) in SHELL
        // Channel Head Process Nozzles: Gas In Top at West Channel Head, Gas Out Bottom at East Channel Head (100% straight vertical)
        const gasNozzleLen = clr.id === 'e-315' ? 2.0 : 2.0;
        const gasOutLen = clr.id === 'e-315' ? 2.7 : 2.8;
        this.addNozzleWithFlange(eGroup, new THREE.Vector3(-clr.l * 0.5, 7.2 + clr.d * 0.54 * 0.5, 0), new THREE.Vector3(0, 1, 0), 1.4, gasNozzleLen); // Gas In Top (West)
        this.addNozzleWithFlange(eGroup, new THREE.Vector3(clr.l * 0.5, 7.2 - clr.d * 0.54 * 0.5, 0), new THREE.Vector3(0, -1, 0), 1.4, gasOutLen);    // Gas Out Bottom (East)

        // Shell Utility Nozzles: Cooling Water WC In at Bottom, Out at Top (100% straight vertical)
        const wcInOffset = clr.id === 'e-315' ? 9.5 : 8.5;
        const wcOutOffset = clr.id === 'e-315' ? -9.5 : -8.5;
        const wcLen = clr.id === 'e-315' ? 1.4 : 1.6;
        this.addNozzleWithFlange(eGroup, new THREE.Vector3(wcInOffset, 7.2 - clr.d * 0.5, 0), new THREE.Vector3(0, -1, 0), 1.3, wcLen); // WC Supply In Bottom
        this.addNozzleWithFlange(eGroup, new THREE.Vector3(wcOutOffset, 7.2 + clr.d * 0.5, 0), new THREE.Vector3(0, 1, 0), 1.3, wcLen); // WC Return Out Top
      }

      this.registerInteractive(eGroup, clr.id);
      this.group.add(eGroup);
    });
  }

  // 5. Lube Oil & Dry Gas Seal Console Skid (LO/SO Console)
  private buildLubeAndSealOilConsole() {
    const loGroup = new THREE.Group();
    loGroup.position.set(-115, 0, 0);
    loGroup.name = 'Lube_and_Seal_Oil_Console';

    // Oil Reservoir Tank (Length 24m, Width 12m, Height 5.5m)
    const tank = new THREE.Mesh(new THREE.BoxGeometry(24.0, 5.5, 12.0), this.matCompressorBlue);
    tank.position.set(0, 2.75, 0);
    loGroup.add(tank);

    // Dual Main & Standby AC Motor-Driven Oil Pumps (P-301 A/B)
    [-4.2, 4.2].forEach((pz) => {
      const pMotor = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 4.2, 16), this.matValveBlue);
      pMotor.rotation.z = Math.PI / 2;
      pMotor.position.set(-6.5, 6.5, pz);
      loGroup.add(pMotor);

      const pPump = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3.0, 16), this.matAlloySteel);
      pPump.rotation.z = Math.PI / 2;
      pPump.position.set(-2.5, 6.5, pz);
      loGroup.add(pPump);
    });

    // Emergency Steam Turbine-Driven Lube Oil Pump (P-301C)
    const eTurb = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 3.6, 16), this.matTurbineCasing);
    eTurb.rotation.z = Math.PI / 2;
    eTurb.position.set(6.5, 6.5, 0);
    loGroup.add(eTurb);

    // Dual Duplex Plate Oil Coolers (E-308 A/B)
    [-3.5, 3.5].forEach((cz) => {
      const clr = new THREE.Mesh(new THREE.BoxGeometry(3.2, 6.2, 2.4), this.matAlloySteel);
      clr.position.set(3.0, 7.0, cz);
      loGroup.add(clr);
    });

    // Duplex Micronic Oil Filter Housings (F-301 A/B)
    [-2.2, 2.2].forEach((fz) => {
      const fMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 5.2, 16), this.matFlange);
      fMesh.position.set(-11.0, 7.0, fz);
      loGroup.add(fMesh);
    });

    this.registerInteractive(loGroup, 'lo_console');
    this.group.add(loGroup);
  }

  // 6. Complete Thermal Insulation Process Piping Network & Cladding Jackets
  private buildProcessPipingNetwork() {
    const PIPE_SCALE = 1.15; // Clean, realistic industrial pipe scaling preventing clashing and obstruction

    const pipeDefinitions: Array<{
      name: string;
      color: number;
      radius: number;
      speed: number;
      particleColor: number;
      streamTag: string;
      fluidLabel: string;
      points: THREE.Vector3[];
    }> = [
      // 1. Fresh Make-Up Syngas (25 bar, 40°C) from Methanator V-104 -> V-301 1st Stage Suction
      {
        name: 'Fresh Syngas (25 bar) -> V-301 1st Stage Suction',
        color: 0x0284c7,
        radius: 0.58,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'FRESH SYNGAS 25 BAR',
        fluidLabel: 'Fresh Syngas (3H2 + N2) to V-301',
        points: [
          new THREE.Vector3(-190.0, 13.25, -52.8), // from West Battery Limit at North pipe corridor
          new THREE.Vector3(-75.0, 13.25, -52.8)   // runs east into V-301 South Feed Nozzle flange
        ]
      },
      // 2. V-301 Overhead Gas -> K-301 LP 1st Stage Suction Nozzle (Elevated Clear Corridor)
      {
        name: 'V-301 Overhead -> K-301 LP 1st Stage Inlet',
        color: 0x0284c7,
        radius: 0.56,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'STAGE 1 SUCTION',
        fluidLabel: '1st Stage Syngas Suction (25 bar)',
        points: [
          new THREE.Vector3(-75.0, 28.2, -60.0), // V-301 top head outlet flange
          new THREE.Vector3(-75.0, 40.0, -60.0), // rises to High North Bridge Tier at Y = 40m
          new THREE.Vector3(-75.0, 40.0, -48.0), // turns south to High North Bridge at Z = -48m
          new THREE.Vector3(-10.5, 40.0, -48.0), // runs east to Stage 1 X-plane
          new THREE.Vector3(-10.5, 40.0, -15.0), // turns south across High Bridge
          new THREE.Vector3(-10.5, 5.5, -15.0),  // drops vertically to basement elevation Tier 0 at Y = 5.5m
          new THREE.Vector3(-10.5, 5.5, 0.0),    // runs south under tabletop mezzanine
          new THREE.Vector3(-10.5, 11.0, 0.0)    // rises vertically into Stage 1 Bottom Suction Flange
        ]
      },
      // 3. K-301 1st Stage Discharge (44 bar, 140°C) -> E-301 Precooler (Gas in Shell)
      {
        name: 'K-301 1st Stage Discharge (44 bar) -> E-301 Intercooler (Gas in Shell)',
        color: 0x0369a1,
        radius: 0.54,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'STAGE 1 DISCHARGE (44 BAR)',
        fluidLabel: 'Hot Compressed Syngas (44 bar, 140°C) to E-301 Shell',
        points: [
          new THREE.Vector3(-6.0, 20.3, 0.0),   // top discharge nozzle of LP casing flange
          new THREE.Vector3(-6.0, 24.0, 0.0),   // rises vertically to Tier 3 elevation Y = 24m
          new THREE.Vector3(-6.0, 24.0, 28.0),  // turns south across South Bridge to Lane 1
          new THREE.Vector3(-75.0, 24.0, 28.0), // runs west along Lane 1 at Z = 28m
          new THREE.Vector3(-75.0, 24.0, 60.0), // turns south to E-301 top nozzle plane
          new THREE.Vector3(-75.0, 12.3, 60.0)  // drops vertically into E-301 top shell nozzle flange
        ]
      },
      // 4. E-301 Cooled Gas (44 bar, 40°C) from Shell Bottom -> V-302 Suction KO Drum (Trench Corridor 1)
      {
        name: 'E-301 Cooled Gas (44 bar) -> V-302 2nd Stage Suction',
        color: 0x0284c7,
        radius: 0.52,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'COOLED STAGE 1 (44 BAR)',
        fluidLabel: 'Cooled Syngas (44 bar, 40°C) from E-301 Shell to V-302',
        points: [
          new THREE.Vector3(-75.0, 2.1, 60.0),   // E-301 bottom shell outlet flange
          new THREE.Vector3(-75.0, 2.1, 20.0),   // runs north in Trench Corridor 1
          new THREE.Vector3(-25.0, 2.1, 20.0),   // turns east along Trench Corridor 1 at Z = 20m
          new THREE.Vector3(-25.0, 2.1, -42.0),  // runs north across central trench to North yard
          new THREE.Vector3(-25.0, 14.25, -42.0),// rises to North yard feed header level
          new THREE.Vector3(-25.0, 14.25, -53.0) // runs north into V-302 feed inlet nozzle flange
        ]
      },
      // 5. V-302 Overhead Gas -> K-301 MP 2nd Stage Suction Nozzle (MP Casing Case 2)
      {
        name: 'V-302 Overhead (44 bar) -> K-301 MP 2nd Stage Inlet',
        color: 0x0284c7,
        radius: 0.52,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'STAGE 2 SUCTION (44 BAR)',
        fluidLabel: '2nd Stage Syngas Suction (44 bar) into MP Casing',
        points: [
          new THREE.Vector3(-25.0, 30.0, -60.0), // V-302 top head outlet flange
          new THREE.Vector3(-25.0, 36.0, -60.0), // rises to North Bridge Tier at Y = 36m
          new THREE.Vector3(-25.0, 36.0, -42.0), // turns south to Lane at Z = -42m
          new THREE.Vector3(9.5, 36.0, -42.0),   // runs east to MP Case Stage 2 X-plane
          new THREE.Vector3(9.5, 36.0, -18.0),   // turns south across High Bridge
          new THREE.Vector3(9.5, 5.5, -18.0),    // drops vertically to basement elevation Tier 0 at Y = 5.5m
          new THREE.Vector3(9.5, 5.5, 0.0),      // runs south under tabletop mezzanine
          new THREE.Vector3(9.5, 11.0, 0.0)      // rises vertically into MP Case 2 Bottom Suction Flange
        ]
      },
      // 6. K-301 MP 2nd Stage Discharge (110 bar, 145°C) -> E-302 Intercooler (Gas in Tubes)
      {
        name: 'K-301 2nd Stage Discharge -> E-302 TUBE INLET (Gas in Tubes)',
        color: 0x0369a1,
        radius: 0.50,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'STAGE 2 DISCHARGE -> TUBES',
        fluidLabel: '2nd Stage Compressed Syngas into E-302 Tubes',
        points: [
          new THREE.Vector3(14.5, 20.3, 0.0),   // top discharge nozzle of MP casing flange
          new THREE.Vector3(14.5, 30.0, 0.0),   // rises to Upper Elevation Tier Y = 30m (+6m clearance over Stage 1!)
          new THREE.Vector3(14.5, 30.0, 38.0),  // turns south across South Bridge to Lane 2 at Z = 38m
          new THREE.Vector3(-42.0, 30.0, 38.0), // runs west along Lane 2 to E-302 West Channel Head X-plane
          new THREE.Vector3(-42.0, 30.0, 60.0), // turns south to E-302 West Channel Head plane at Z = 60m
          new THREE.Vector3(-42.0, 11.1, 60.0)  // drops straight vertically into E-302 West TUBE top nozzle flange
        ]
      },
      // 7. E-302 TUBE OUTLET -> V-303 3rd Stage Suction KO Drum (Trench Corridor 2)
      {
        name: 'E-302 TUBE OUTLET -> V-303 3rd Stage Suction',
        color: 0x0284c7,
        radius: 0.50,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'COOLED STAGE 2 (FROM TUBES)',
        fluidLabel: 'Cooled Syngas from E-302 Tubes to V-303',
        points: [
          new THREE.Vector3(-8.0, 2.5, 60.0),   // E-302 East TUBE bottom nozzle flange
          new THREE.Vector3(-8.0, 2.5, 12.0),   // runs north in Trench Corridor 2 at Z = 12m
          new THREE.Vector3(25.0, 2.5, 12.0),   // turns east along Trench Corridor 2
          new THREE.Vector3(25.0, 2.5, -45.0),  // runs north across central trench to North yard
          new THREE.Vector3(25.0, 15.25, -45.0),// rises to feed header level
          new THREE.Vector3(25.0, 15.25, -53.2) // runs north into V-303 South feed nozzle flange
        ]
      },
      // 8. V-303 Overhead Gas -> K-301 HP 3rd Stage Suction Nozzle (HP Casing Case 3)
      {
        name: 'V-303 Overhead -> K-301 HP 3rd Stage Inlet',
        color: 0x0284c7,
        radius: 0.48,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'STAGE 3 SUCTION',
        fluidLabel: '3rd Stage Syngas Suction (105 bar) into HP Casing',
        points: [
          new THREE.Vector3(25.0, 31.8, -60.0), // V-303 top head outlet flange
          new THREE.Vector3(25.0, 38.0, -60.0), // vertical riser to upper rack Tier 4 at Y = 38m
          new THREE.Vector3(25.0, 38.0, -45.0), // turns south to Lane at Z = -45m
          new THREE.Vector3(27.5, 38.0, -45.0), // runs east to HP Case Stage 3 X-plane
          new THREE.Vector3(27.5, 38.0, -15.0), // turns south across overhead bridge
          new THREE.Vector3(27.5, 5.5, -15.0),  // drops vertically to basement elevation Tier 0 at Y = 5.5m
          new THREE.Vector3(27.5, 5.5, 0.0),    // runs south under tabletop mezzanine
          new THREE.Vector3(27.5, 11.0, 0.0)    // rises vertically into HP Case 3 Bottom Suction Flange
        ]
      },
      // 9. K-301 HP 3rd Stage Discharge -> E-303 Intercooler (Gas in Tubes, Lane 3 at Z = 28m)
      {
        name: 'K-301 3rd Stage Discharge -> E-303 TUBE INLET (Gas in Tubes)',
        color: 0x0369a1,
        radius: 0.46,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'STAGE 3 DISCHARGE -> TUBES',
        fluidLabel: '3rd Stage Compressed Syngas into E-303 Tubes',
        points: [
          new THREE.Vector3(31.5, 20.3, 0.0),  // top discharge nozzle of HP casing flange (Stage 3)
          new THREE.Vector3(31.5, 24.0, 0.0),  // rises vertically to Tier 3 elevation Y = 24m
          new THREE.Vector3(31.5, 24.0, 28.0), // turns south across overhead bridge to Lane 3 at Z = 28m
          new THREE.Vector3(8.0, 24.0, 28.0),  // turns west along Lane 3 to E-303 West inlet plane
          new THREE.Vector3(8.0, 24.0, 60.0),  // turns south to E-303 West Channel Head plane at Z = 60m
          new THREE.Vector3(8.0, 11.1, 60.0)   // drops straight vertically into E-303 West TUBE top nozzle flange
        ]
      },
      // 10. E-303 TUBE OUTLET -> K-301 HP 4th Stage Final Compression (HP Casing Case 3)
      {
        name: 'E-303 TUBE OUTLET -> K-301 4th Stage Final Make-Up',
        color: 0x0284c7,
        radius: 0.46,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'STAGE 4 SUCTION (FROM TUBES)',
        fluidLabel: '4th Stage Suction Gas from E-303 Tubes into HP Casing',
        points: [
          new THREE.Vector3(42.0, 2.5, 60.0),  // E-303 East TUBE bottom nozzle flange
          new THREE.Vector3(42.0, 2.5, 16.0),  // runs north along Trench Corridor 3 at Z = 16m
          new THREE.Vector3(36.5, 2.5, 16.0),  // turns west along Trench Corridor 3 to X = 36.5m
          new THREE.Vector3(36.5, 5.5, 16.0),  // rises to basement suction elevation Tier 0
          new THREE.Vector3(36.5, 5.5, 0.0),   // runs north under tabletop mezzanine
          new THREE.Vector3(36.5, 11.0, 0.0)   // rises vertically into HP Case 3 Stage 4 Bottom Suction Flange
        ]
      },
      // 11. K-301 HP 4th Stage Discharge (220 bar) -> E-315 Final Make-Up Cooler (Upper Corridor Y = 30m)
      {
        name: 'K-301 4th Stage Discharge -> E-315 TUBE INLET (Gas in Tubes)',
        color: 0x0284c7,
        radius: 0.48,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'HP MAKE-UP -> E-315 TUBES',
        fluidLabel: 'High Pressure Syngas (220 bar) from HP Casing into E-315 Tubes',
        points: [
          new THREE.Vector3(40.5, 20.3, 0.0),  // top discharge nozzle of HP casing flange (Stage 4)
          new THREE.Vector3(40.5, 30.0, 0.0),  // rises to Upper Elevation Tier Y = 30m
          new THREE.Vector3(40.5, 30.0, 38.0), // turns south across overhead bridge to Lane 4 at Z = 38m
          new THREE.Vector3(56.0, 30.0, 38.0), // turns east along Lane 4 to E-315 West Channel Head X-plane
          new THREE.Vector3(56.0, 30.0, 60.0), // turns south to E-315 West Channel Head plane at Z = 60m
          new THREE.Vector3(56.0, 11.2, 60.0)  // drops straight vertically into E-315 West TUBE top nozzle flange
        ]
      },
      // 12. E-315 TUBE OUTLET -> V-310 High-Pressure Separator (East Yard Trench)
      {
        name: 'E-315 TUBE OUTLET -> V-310 HP Separator',
        color: 0x0284c7,
        radius: 0.48,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'TO V-310 HP DRUM (FROM TUBES)',
        fluidLabel: 'Cooled Make-Up Syngas from E-315 Tubes to V-310',
        points: [
          new THREE.Vector3(94.0, 2.5, 60.0),  // E-315 East TUBE bottom nozzle flange
          new THREE.Vector3(94.0, 2.5, -45.0), // runs north across East trench corridor to North yard
          new THREE.Vector3(75.0, 2.5, -45.0), // turns west to V-310 centerline
          new THREE.Vector3(75.0, 18.25, -45.0),// rises to feed elevation
          new THREE.Vector3(75.0, 18.25, -52.5) // runs north into V-310 feed inlet flange
        ]
      },
      // 13. V-310 Overhead Syngas -> Battery Limit to Section 400 Synthesis Loop
      {
        name: 'V-310 Overhead HP Syngas -> Section 400 Synthesis Loop',
        color: 0x0284c7,
        radius: 0.54,
        speed: 0.09,
        particleColor: 0x67e8f9,
        streamTag: 'HP SYNGAS TO SYNLOOP',
        fluidLabel: 'Pure Make-up Syngas (220 bar) to R-401 Loop',
        points: [
          new THREE.Vector3(75.0, 38.5, -60.0),  // V-310 top head outlet flange
          new THREE.Vector3(75.0, 44.0, -60.0),  // rises vertically to top rack Tier 5 at Y = 44m
          new THREE.Vector3(75.0, 44.0, -45.0),  // turns south to North piperack corridor at Z = -45m
          new THREE.Vector3(190.0, 44.0, -45.0)  // runs east along North piperack straight to plant boundary
        ]
      },
      // 14. High-Pressure 105 bar Steam Supply Header to K-301T Turbine (North Utility Corridor Z = -8m)
      {
        name: 'HP Steam Supply (105 bar, 510°C) -> K-301T Turbine Chest',
        color: 0xd97706,
        radius: 0.56,
        speed: 0.09,
        particleColor: 0xfcd34d,
        streamTag: 'HP STEAM 105 BAR',
        fluidLabel: 'Superheated High Pressure Steam',
        points: [
          new THREE.Vector3(-190.0, 26.0, -8.0), // enters from West Battery Limit in North utility corridor
          new THREE.Vector3(-37.5, 26.0, -8.0),  // runs east along North utility lane at Z = -8m
          new THREE.Vector3(-37.5, 26.0, 0.0),   // turns south to K-301T turbine chest plane
          new THREE.Vector3(-37.5, 22.5, 0.0)    // drops vertically into K-301T Steam Chest inlet flange
        ]
      },
      // 15. Medium Pressure 38 bar Steam Extraction Header from K-301T Turbine (North Utility Corridor Z = -12m)
      {
        name: 'MP Steam Extraction (38 bar) from K-301T -> Plant MP Header',
        color: 0xb45309,
        radius: 0.50,
        speed: 0.08,
        particleColor: 0xfcd34d,
        streamTag: 'MP STEAM EXTRACTION',
        fluidLabel: 'Extracted MP Steam for Process Reboilers',
        points: [
          new THREE.Vector3(-30.0, 22.1, 0.0),  // extraction nozzle from K-301T casing flange
          new THREE.Vector3(-30.0, 24.5, 0.0),  // rises to utility corridor elevation
          new THREE.Vector3(-30.0, 24.5, -12.0),// turns north to North utility corridor at Z = -12m
          new THREE.Vector3(190.0, 24.5, -12.0) // runs east along North utility corridor straight to boundary
        ]
      },
      // 16. Cooling Water Supply Header (WC Supply 32°C - 4.5 kg/cm²G at Z = 82m, Y = 5.0m)
      {
        name: 'Cooling Water Supply Main Header (WC Supply 32°C)',
        color: 0x0284c7,
        radius: 0.54,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'WC SUPPLY 32°C (ماء التبريد الداخل)',
        fluidLabel: 'Industrial Cooling Water Supply (WC) - 32°C, 4.5 bar (شبكة ماء التبريد الداخل)',
        points: [
          new THREE.Vector3(-190.0, 5.0, 82.0),
          new THREE.Vector3(190.0, 5.0, 82.0)
        ]
      },
      // 19a. WC Supply Branch -> E-301 TUBE INLET (Gas in Shell / WC in Tubes)
      {
        name: 'WC Supply -> E-301 TUBES (Gas in Shell / WC in Tubes)',
        color: 0x0284c7,
        radius: 0.44,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'WC -> E-301 TUBES (ماء داخل للأنابيب)',
        fluidLabel: 'Cooling Water WC into E-301 Tube Side (ماء التبريد الداخل بالأنابيب)',
        points: [
          new THREE.Vector3(-91.0, 5.0, 82.0), // take-off from WC supply main at Z = 82m
          new THREE.Vector3(-91.0, 2.5, 82.0), // drops to trench elevation
          new THREE.Vector3(-91.0, 2.5, 60.0)  // runs north into E-301 West TUBE Channel Head bottom nozzle flange
        ]
      },
      // 19b. WC Supply Branch -> E-302 SHELL INLET (Gas in Tubes / WC in Shell)
      {
        name: 'WC Supply -> E-302 SHELL (Gas in Tubes / WC in Shell)',
        color: 0x0284c7,
        radius: 0.44,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'WC -> E-302 SHELL (ماء داخل للشيل)',
        fluidLabel: 'Cooling Water WC into E-302 Shell Side (ماء التبريد الداخل بالشيل)',
        points: [
          new THREE.Vector3(-16.5, 5.0, 82.0), // take-off from WC supply main
          new THREE.Vector3(-16.5, 2.1, 82.0), // drops down to trench elevation
          new THREE.Vector3(-16.5, 2.1, 60.0)  // runs north into E-302 Bottom SHELL Nozzle flange
        ]
      },
      // 19c. WC Supply Branch -> E-303 SHELL INLET (Gas in Tubes / WC in Shell)
      {
        name: 'WC Supply -> E-303 SHELL (Gas in Tubes / WC in Shell)',
        color: 0x0284c7,
        radius: 0.44,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'WC -> E-303 SHELL (ماء داخل للشيل)',
        fluidLabel: 'Cooling Water WC into E-303 Shell Side (ماء التبريد الداخل بالشيل)',
        points: [
          new THREE.Vector3(33.5, 5.0, 82.0),  // take-off from WC supply main
          new THREE.Vector3(33.5, 2.1, 82.0),  // drops down to trench elevation
          new THREE.Vector3(33.5, 2.1, 60.0)   // runs north into E-303 Bottom SHELL Nozzle flange
        ]
      },
      // 19d. WC Supply Branch -> E-315 SHELL INLET (Gas in Tubes / WC in Shell)
      {
        name: 'WC Supply -> E-315 SHELL (Gas in Tubes / WC in Shell)',
        color: 0x0284c7,
        radius: 0.44,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'WC -> E-315 SHELL (ماء داخل للشيل)',
        fluidLabel: 'Cooling Water WC into E-315 Shell Side (ماء التبريد الداخل بالشيل)',
        points: [
          new THREE.Vector3(84.5, 5.0, 82.0),  // take-off from WC supply main
          new THREE.Vector3(84.5, 2.05, 82.0), // drops down to trench elevation
          new THREE.Vector3(84.5, 2.05, 60.0)  // runs north into E-315 Bottom SHELL Nozzle flange
        ]
      },
      // 20. Cooling Water Return Header (WCR Return 40°C - 2.8 kg/cm²G at Z = 82m, Y = 16.0m)
      {
        name: 'Cooling Water Return (WCR) Main Header (40°C)',
        color: 0x0369a1,
        radius: 0.56,
        speed: 0.08,
        particleColor: 0x0284c7,
        streamTag: 'WCR RETURN 40°C (ماء التبريد الراجع)',
        fluidLabel: 'Warm Cooling Water Return (WCR) to Cooling Towers - 40°C, 2.8 bar (شبكة ماء التبريد الراجع)',
        points: [
          new THREE.Vector3(-190.0, 16.0, 82.0),
          new THREE.Vector3(190.0, 16.0, 82.0)
        ]
      },
      // 20a. WCR Return Branch: E-301 TUBE OUTLET -> Return Header (Gas in Shell / WCR out Tubes)
      {
        name: 'E-301 TUBES -> WCR Return Header (Gas in Shell / WCR out Tubes)',
        color: 0x0369a1,
        radius: 0.44,
        speed: 0.08,
        particleColor: 0x0284c7,
        streamTag: 'E-301 TUBES -> WCR RETURN (ماء راجع من الأنابيب)',
        fluidLabel: 'Warm Water WCR from E-301 Tube Side (خروج ماء التبريد الراجع WCR من أنابيب E-301)',
        points: [
          new THREE.Vector3(-59.0, 11.2, 60.0), // from E-301 East TUBE Channel Head top nozzle flange
          new THREE.Vector3(-59.0, 16.0, 60.0), // rises vertically to upper rack Tier 2
          new THREE.Vector3(-59.0, 16.0, 82.0)  // turns south into WCR Return Header at Z = 82m
        ]
      },
      // 20b. WCR Return Branch: E-302 SHELL OUTLET -> Return Header (Gas in Tubes / WCR out Shell)
      {
        name: 'E-302 SHELL -> WCR Return Header (Gas in Tubes / WCR out Shell)',
        color: 0x0369a1,
        radius: 0.44,
        speed: 0.08,
        particleColor: 0x0284c7,
        streamTag: 'E-302 SHELL -> WCR RETURN (ماء راجع من الشيل)',
        fluidLabel: 'Warm Water WCR from E-302 Shell Side (خروج ماء التبريد الراجع WCR من شيل E-302)',
        points: [
          new THREE.Vector3(-33.5, 12.3, 60.0), // from E-302 Top SHELL Nozzle flange
          new THREE.Vector3(-33.5, 16.0, 60.0), // rises vertically to rack elevation Y = 16m
          new THREE.Vector3(-33.5, 16.0, 82.0)  // turns south into WCR Return Header at Z = 82m
        ]
      },
      // 20c. WCR Return Branch: E-303 SHELL OUTLET -> Return Header (Gas in Tubes / WCR out Shell)
      {
        name: 'E-303 SHELL -> WCR Return Header (Gas in Tubes / WCR out Shell)',
        color: 0x0369a1,
        radius: 0.44,
        speed: 0.08,
        particleColor: 0x0284c7,
        streamTag: 'E-303 SHELL -> WCR RETURN (ماء راجع من الشيل)',
        fluidLabel: 'Warm Water WCR from E-303 Shell Side (خروج ماء التبريد الراجع WCR من شيل E-303)',
        points: [
          new THREE.Vector3(16.5, 12.3, 60.0),  // from E-303 Top SHELL Nozzle flange
          new THREE.Vector3(16.5, 16.0, 60.0),  // rises vertically to rack elevation Y = 16m
          new THREE.Vector3(16.5, 16.0, 82.0)   // turns south into WCR Return Header at Z = 82m
        ]
      },
      // 20d. WCR Return Branch: E-315 SHELL OUTLET -> Return Header (Gas in Tubes / WCR out Shell)
      {
        name: 'E-315 SHELL -> WCR Return Header (Gas in Tubes / WCR out Shell)',
        color: 0x0369a1,
        radius: 0.44,
        speed: 0.08,
        particleColor: 0x0284c7,
        streamTag: 'E-315 SHELL -> WCR RETURN (ماء راجع من الشيل)',
        fluidLabel: 'Warm Water WCR from E-315 Shell Side (خروج ماء التبريد الراجع WCR من شيل E-315)',
        points: [
          new THREE.Vector3(65.5, 12.35, 60.0), // from E-315 Top SHELL Nozzle flange
          new THREE.Vector3(65.5, 16.0, 60.0),  // rises vertically to rack elevation Y = 16m
          new THREE.Vector3(65.5, 16.0, 82.0)   // turns south into WCR Return Header at Z = 82m
        ]
      }
    ];

    pipeDefinitions.forEach((def) => {
      const effectiveRadius = def.radius * PIPE_SCALE;
      const cladRadius = effectiveRadius + 0.12;

      const tubeMat = new THREE.MeshStandardMaterial({
        color: def.color,
        roughness: 0.28,
        metalness: 0.92
      });

      const pipeGroup = new THREE.Group();
      pipeGroup.name = def.name;
      pipeGroup.userData = {
        name: def.name,
        streamTag: def.streamTag,
        fluidLabel: def.fluidLabel,
        isInsulated: true,
        insulationType: 'Mineral Wool / Stucco Aluminum Cladding (صوف صخري + غلاف ألومنيوم مضلع)',
        operatingPress: def.name.match(/\(([^)]+bar[^)]*)\)/)?.[1] || '105 bar'
      };

      // Straight Segment Spools & Aluminum Cladding
      for (let i = 0; i < def.points.length - 1; i++) {
        const p1 = def.points[i];
        const p2 = def.points[i + 1];
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const len = dir.length();

        if (len > 0.01) {
          const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
          const up = new THREE.Vector3(0, 1, 0);
          const normDir = dir.clone().normalize();

          // Core Pipe
          const coreGeo = new THREE.CylinderGeometry(effectiveRadius, effectiveRadius, len, 16, 1, false);
          const coreMesh = new THREE.Mesh(coreGeo, tubeMat);
          coreMesh.position.copy(mid);
          if (Math.abs(normDir.dot(up)) < 0.9999) {
            coreMesh.quaternion.setFromUnitVectors(up, normDir);
          } else if (normDir.y < 0) {
            coreMesh.rotation.x = Math.PI;
          }
          pipeGroup.add(coreMesh);

          // Aluminum Thermal Cladding Jacket
          const cladGeo = new THREE.CylinderGeometry(cladRadius, cladRadius, Math.max(0.05, len - 0.2), 24, 1, false);
          const cladMesh = new THREE.Mesh(cladGeo, this.matAluminumCladding);
          cladMesh.position.copy(mid);
          if (Math.abs(normDir.dot(up)) < 0.9999) {
            cladMesh.quaternion.setFromUnitVectors(up, normDir);
          } else if (normDir.y < 0) {
            cladMesh.rotation.x = Math.PI;
          }
          cladMesh.castShadow = true;
          cladMesh.receiveShadow = true;
          pipeGroup.add(cladMesh);
          this.claddingMeshes.push(cladMesh);

          // SS304 Clamping Straps
          const numBands = Math.max(1, Math.floor(len / 2.5));
          for (let b = 1; b <= numBands; b++) {
            const frac = b / (numBands + 1);
            const bandPos = new THREE.Vector3().addVectors(p1, dir.clone().multiplyScalar(frac));
            const strapGeo = new THREE.CylinderGeometry(cladRadius * 1.025, cladRadius * 1.025, 0.18, 24);
            const strapMesh = new THREE.Mesh(strapGeo, this.matCladdingStraps);
            strapMesh.position.copy(bandPos);
            if (Math.abs(normDir.dot(up)) < 0.9999) {
              strapMesh.quaternion.setFromUnitVectors(up, normDir);
            } else if (normDir.y < 0) {
              strapMesh.rotation.x = Math.PI;
            }
            pipeGroup.add(strapMesh);
          }

          // ASME Identification Band
          if (len > 8.0) {
            const bandTex = createThermalInsulationBandTexture(
              def.streamTag,
              def.fluidLabel,
              def.name.split(':')[0],
              def.name.match(/\(([^)]+)\)/)?.[1] || 'SYNGAS 105 BAR',
              `#${def.color.toString(16).padStart(6, '0')}`,
              true
            );
            const idBandGeo = new THREE.CylinderGeometry(cladRadius * 1.035, cladRadius * 1.035, 1.8, 24);
            const idBandMat = new THREE.MeshStandardMaterial({ map: bandTex, roughness: 0.25, metalness: 0.3 });
            const idBandMesh = new THREE.Mesh(idBandGeo, idBandMat);
            idBandMesh.position.copy(mid);
            if (Math.abs(normDir.dot(up)) < 0.9999) {
              idBandMesh.quaternion.setFromUnitVectors(up, normDir);
            } else if (normDir.y < 0) {
              idBandMesh.rotation.x = Math.PI;
            }
            pipeGroup.add(idBandMesh);
          }
        }
      }

      // Smooth 90° Elbow Gores at turn vertices & Companion Mating Flanges at pipeline terminations
      def.points.forEach((pt, idx) => {
        if (idx > 0 && idx < def.points.length - 1) {
          // Seamless Elbow Turn Node
          const elbowMesh = new THREE.Mesh(new THREE.SphereGeometry(cladRadius * 1.02, 24, 18), this.matLobsterElbow);
          elbowMesh.position.copy(pt);
          pipeGroup.add(elbowMesh);
          this.claddingMeshes.push(elbowMesh);
        } else {
          // Terminal Companion Mating Flange
          const nextPt = idx === 0 ? def.points[1] : def.points[def.points.length - 2];
          const termDir = new THREE.Vector3().subVectors(idx === 0 ? pt : pt, nextPt).normalize();
          const termFlangeGeo = new THREE.CylinderGeometry(effectiveRadius * 1.7, effectiveRadius * 1.7, 0.42, 24);
          const termFlange = new THREE.Mesh(termFlangeGeo, this.matFlange);
          termFlange.position.copy(pt);
          const up = new THREE.Vector3(0, 1, 0);
          if (Math.abs(termDir.dot(up)) < 0.9999) {
            termFlange.quaternion.setFromUnitVectors(up, termDir);
          } else if (termDir.y < 0) {
            termFlange.rotation.x = Math.PI;
          }
          pipeGroup.add(termFlange);
        }
      });

      this.group.add(pipeGroup);

      // Register pipeline clicking
      const pipeId = def.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const info: EquipmentInfo = {
        id: pipeId,
        tag: def.streamTag,
        name: def.name,
        arabicName: `خط غاز التصنيع والضاغط: ${def.fluidLabel}`,
        type: 'piping',
        section: 'Syngas Compression (K-301 Complex)',
        sectionNumber: 3,
        rowNumber: 5,
        position: def.points[Math.floor(def.points.length / 2)].clone(),
        inletStream: 'Upstream Stage',
        outletStream: 'Downstream Stage / Intercooler',
        operatingTemp: '40°C - 145°C',
        operatingPress: def.name.match(/\(([^)]+bar[^)]*)\)/)?.[1] || '105 bar',
        catalystOrInternals: 'عزل حراري وغلاف ألومنيوم معزول Stucco-Embossed 0.8mm مع أحزمة شد SS304',
        description: 'خط أنابيب نقل وضغط غاز التصنيع عالي الضغط مجهز بحماية ضد الاهتزازات (Anti-Vibration Supports) وعزل حراري كامل.'
      };

      pipeGroup.userData = { equipmentId: pipeId, equipmentInfo: info, isClickable: true };
      this.interactiveMeshes.push(pipeGroup);
    });
  }

  // 8. High-Visibility Industrial Telemetry Badges with Arabic Typography
  private buildEquipmentBadgesAndSigns() {
    const badges: Array<{
      tag: string;
      ar: string;
      param: string;
      pos: THREE.Vector3;
      scale?: [number, number];
    }> = [
      {
        tag: 'K-301 TRAIN',
        ar: 'قطار ضاغط غاز التخليق: ٣ أكياس (L.P. و M.P. و H.P.) بـ ٤ مراحل كبس + التوربين الدافع K-301T',
        param: '3 Casings: Case 1 (LP / St.1), Case 2 (MP / St.2), Case 3 (HP / St.3 & 4 + Recycle) | Steam Turbine K-301T (18.5 MW)',
        pos: new THREE.Vector3(0, 36.0, 0),
        scale: [32.0, 7.5]
      },
      { tag: 'K-301T', ar: 'التوربين البخاري الدافع K-301T', param: 'HP Steam 105 bar (510°C) -> MP Extraction (38 bar) | 18.5 MW | 10,000 RPM Driver', pos: new THREE.Vector3(-32, 26.0, 0), scale: [16.0, 5.5] },
      { tag: 'K-301 LP', ar: 'جسم الضغط المنخفض L.P. (Case 1 - المرحلة الأولى)', param: 'LP Casing (Stage 1): 25.5 bar -> 44.0 bar | 1st Stage Suction from V-301 -> Discharge to E-301', pos: new THREE.Vector3(-8.5, 26.0, 0), scale: [16.0, 5.5] },
      { tag: 'K-301 MP', ar: 'جسم الضغط المتوسط M.P. (Case 2 - المرحلة الثانية)', param: 'MP Casing (Stage 2): 44.0 bar -> 110.0 bar | 2nd Stage Suction from V-302 -> Discharge to E-302', pos: new THREE.Vector3(12.0, 26.0, 0), scale: [16.0, 5.5] },
      { tag: 'K-301 HP', ar: 'جسم الضغط العالي H.P. (Case 3 - المرحلتان 3 و 4 وعجلة التدوير)', param: 'HP Casing (Stages 3 & 4): 105 -> 160 -> 240 bar + Synthesis Loop Recycle Circulator (205 t/h)', pos: new THREE.Vector3(34.0, 26.0, 0), scale: [16.0, 5.5] },
      { tag: 'V-301', ar: 'عازل سحب المرحلة الأولى V-301', param: '25.0 kg/cm²G | 40°C -> Knock-out Droplets before Stage 1', pos: new THREE.Vector3(-75, 38.0, -60), scale: [14.0, 4.8] },
      { tag: 'E-301', ar: 'مبادل E-301 (الغاز بالشيل / ماء التبريد WC الداخل بالأنابيب و WCR الخارج بالأنابيب)', param: 'Gas in SHELL (140°C -> 40°C) | Water: WC in TUBES (32°C) -> WCR out TUBES (40°C) | 44 bar', pos: new THREE.Vector3(-75, 18.0, 60), scale: [16.0, 5.5] },
      { tag: 'V-302', ar: 'عازل سحب المرحلة الثانية V-302', param: '44.0 kg/cm²G | 40°C -> Interstage Knock-Out', pos: new THREE.Vector3(-25, 40.0, -60), scale: [14.0, 4.8] },
      { tag: 'E-302', ar: 'مبادل E-302 (الغاز بالأنابيب / ماء التبريد WC الداخل بالشيل و WCR الخارج بالشيل)', param: 'Gas in TUBES (145°C -> 40°C) | Water: WC in SHELL (32°C) -> WCR out SHELL (40°C) | 110 bar', pos: new THREE.Vector3(-25, 18.0, 60), scale: [16.0, 5.5] },
      { tag: 'V-303', ar: 'عازل سحب المرحلة الثالثة V-303', param: '105.0 kg/cm²G | 40°C -> Interstage Knock-Out', pos: new THREE.Vector3(25, 42.0, -60), scale: [14.0, 4.8] },
      { tag: 'E-303', ar: 'مبادل E-303 (الغاز بالأنابيب / ماء التبريد WC الداخل بالشيل و WCR الخارج بالشيل)', param: 'Gas in TUBES (140°C -> 40°C) | Water: WC in SHELL (32°C) -> WCR out SHELL (40°C) | 160 bar', pos: new THREE.Vector3(25, 18.0, 60), scale: [16.0, 5.5] },
      { tag: 'V-310', ar: 'فاصل غاز التصنيع النهائي V-310', param: '220.0 kg/cm²G | 40°C -> HP Make-Up Feed to SynLoop R-401', pos: new THREE.Vector3(75, 48.0, -60), scale: [16.0, 5.5] },
      { tag: 'E-315', ar: 'مبادل E-315 (الغاز بالأنابيب / ماء التبريد WC الداخل بالشيل و WCR الخارج بالشيل)', param: 'Gas in TUBES (135°C -> 26°C) | Water: WC in SHELL (32°C) -> WCR out SHELL (40°C) | 220 bar', pos: new THREE.Vector3(75, 18.0, 60), scale: [16.0, 5.5] },
      { tag: 'WC HEADER', ar: 'أنبوب التغذية الرئيسي لمياه التبريد الداخلة WC', param: 'Cooling Water Supply (WC) - 32°C, 4.5 bar -> To E-301 Tubes & E-302/303/315 Shells', pos: new THREE.Vector3(0, 10.0, 82.0), scale: [18.0, 5.0] },
      { tag: 'WCR HEADER', ar: 'أنبوب التجميع الرئيسي لمياه التبريد الراجعة WCR', param: 'Cooling Water Return (WCR) - 40°C, 2.8 bar -> From E-301 Tubes & E-302/303/315 Shells', pos: new THREE.Vector3(0, 21.0, 82.0), scale: [18.0, 5.0] },
      { tag: 'LO/SO CONSOLE', ar: 'وحدة التزييت والغاز المانع للتسرب', param: 'Main/Standby AC Pumps + Steam Auxiliary Pump + Duplex Filters', pos: new THREE.Vector3(-115, 16.0, 0), scale: [16.0, 5.5] },
      {
        tag: 'DCS-300-PFD',
        ar: 'شاشة المخطط التشغيلي والتحكم الرقمي لضاغط K-301',
        param: 'K-301 Complex Master Digital PFD Screen | DWG 6112P-100-300-00 | Click to inspect',
        pos: new THREE.Vector3(0, 22.0, 125.0),
        scale: [22.0, 5.5]
      }
    ];

    badges.forEach((b) => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark Industrial HUD Card
      ctx.fillStyle = 'rgba(10, 18, 30, 0.96)';
      ctx.fillRect(0, 0, 2048, 720);

      // Gradient Accent Header
      const grad = ctx.createLinearGradient(0, 0, 2048, 0);
      grad.addColorStop(0, '#0284c7');
      grad.addColorStop(0.5, '#38bdf8');
      grad.addColorStop(1, '#0284c7');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 2048, 28);

      // Border
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 10;
      ctx.strokeRect(6, 6, 2036, 708);

      // Tag Badge Box
      ctx.direction = 'ltr';
      ctx.font = 'bold 64px sans-serif';
      const measuredTag = ctx.measureText(b.tag).width;
      const tagBoxWidth = Math.max(480, measuredTag + 80);
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(60, 70, tagBoxWidth, 120);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(b.tag, 60 + tagBoxWidth / 2, 155);

      // Arabic Name
      ctx.direction = 'rtl';
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fef08a';
      ctx.font = b.ar.length > 45 ? 'bold 50px sans-serif' : (b.ar.length > 30 ? 'bold 60px sans-serif' : 'bold 70px sans-serif');
      ctx.fillText(b.ar, 1980, 155);

      // DCS Telemetry Line
      ctx.direction = 'ltr';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 46px monospace';
      ctx.fillText(`⚡ DCS TELEMETRY:`, 60, 300);

      ctx.fillStyle = '#f8fafc';
      ctx.font = b.param.length > 70 ? 'bold 40px sans-serif' : 'bold 46px sans-serif';
      ctx.fillText(b.param, 60, 420);

      // Status indicator pill
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.fillRect(60, 520, 1928, 120);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.strokeRect(60, 520, 1928, 120);

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(120, 580, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 46px sans-serif';
      ctx.fillText('ONLINE • NORMAL RUNNING (10,000 RPM / ZERO VIBRATION)', 170, 595);

      const tex = new THREE.CanvasTexture(canvas);
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = 16;
      tex.needsUpdate = true;
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(b.pos);
      const s = b.scale || [14.0, 4.8];
      sprite.scale.set(s[0], s[1], 1.0);
      this.group.add(sprite);
    });
  }

  // 9. Grand Master DCS Operations & PFD Display Screen (Unit 300 / K-301)
  private buildDcsInfoScreens() {
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 0, 125);
    screenGroup.name = 'Unit300_Master_PFD_Station';

    // 3 Structural Pylons with Heavy Concrete Footings
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

    // Elevated Inspection Catwalk with Handrail
    const walkGeo = new THREE.BoxGeometry(32.0, 0.3, 3.0);
    const walk = new THREE.Mesh(walkGeo, this.matCatwalkSteel);
    walk.position.set(0, 5.8, 1.8);
    screenGroup.add(walk);

    const railGeo = new THREE.BoxGeometry(32.0, 1.2, 0.1);
    const rail = new THREE.Mesh(railGeo, this.matYellowSafety);
    rail.position.set(0, 6.5, 3.2);
    screenGroup.add(rail);

    // Ultra High-Resolution 4096x2048 Canvas for Razor-Sharp Legibility in 3D
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;

    // 1. Deep Solid Dark Navy Industrial Background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, 4096, 2048);

    // Crisp Blueprint Technical Grid
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
    ctx.lineWidth = 2;
    for (let x = 0; x < 4096; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 2048);
      ctx.stroke();
    }
    for (let y = 0; y < 2048; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(4096, y);
      ctx.stroke();
    }

    // Outer Heavy Amber / Gold Neon Frame
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 24;
    ctx.strokeRect(16, 16, 4064, 2016);

    // Inner Glowing Electric Cyan Sub-Border
    ctx.strokeStyle = '#00c8ef';
    ctx.lineWidth = 8;
    ctx.strokeRect(44, 44, 4008, 1960);

    // Master Header Bar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.fillRect(56, 56, 3984, 180);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    ctx.strokeRect(56, 56, 3984, 180);

    // Header Title (Arabic)
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 74px sans-serif';
    ctx.fillText('⚡ المخطط التشغيلي والتحكم الرقمي الشامل لضاغط غاز التخليق K-301 والتوربين ومبرداته', 3980, 155);

    // Header English Subtitle
    ctx.direction = 'ltr';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 44px monospace';
    ctx.fillText('SYNTHESIS GAS COMPRESSOR COMPLEX (K-301 / DWG 6112P-100-300-00)', 100, 155);

    // 4 Top Key Performance Indicators (KPI Telemetry Strip)
    const kpis = [
      { label: 'سرعة الدوران (DRIVER SPEED)', val: '10,000 RPM', col: '#10b981', sub: 'NORMAL CONTINUOUS' },
      { label: 'ضغط الطرد النهائي (FINAL HP)', val: '240.5 bar', col: '#00c8ef', sub: 'TO SYNLOOP R-401' },
      { label: 'تغذية البخار (HP STEAM)', val: '105 bar @ 510°C', col: '#f59e0b', sub: 'K-301T STEAM CHEST' },
      { label: 'تدوير الغاز (SYN RECYCLE)', val: '205.0 t/h', col: '#a855f7', sub: 'CIRCULATOR STAGE' }
    ];

    const kpiW = 950;
    const kpiGap = 42;
    const startX = 80;
    kpis.forEach((k, idx) => {
      const kx = startX + idx * (kpiW + kpiGap);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(kx, 260, kpiW, 160);
      ctx.strokeStyle = k.col;
      ctx.lineWidth = 4;
      ctx.strokeRect(kx, 260, kpiW, 160);

      ctx.direction = 'ltr';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText(k.label, kx + kpiW / 2, 305);

      ctx.fillStyle = k.col;
      ctx.font = 'bold 54px monospace';
      ctx.fillText(k.val, kx + kpiW / 2, 365);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(k.sub, kx + kpiW / 2, 402);
    });

    // 4 Main Structured Operations Cards (Wide, Ultra-Clean & Clear)
    const sections = [
      {
        title: '1. قطار التوربين الدافع K-301T والمكثف',
        sub: 'Steam Turbine Driver & Surface Condenser (18.5 MW)',
        col: '#f59e0b',
        x: 80,
        w: 950,
        items: [
          { label: 'تغذية البخار عالي الضغط HP:', val: '105 bar @ 510°C عبر 4 صمامات حاكم' },
          { label: 'استخراج بخار متوسط MP:', val: '38 bar (82 طن/ساعة) لمبادلات E-201' },
          { label: 'عادم التوربين والمكثف:', val: '0.1 barA (مخلخل) بمياه تبريد WC' },
          { label: 'مضخات المتكثف P-302:', val: 'إعادة ماء التكثيف لشبكة BFW' }
        ]
      },
      {
        title: '2. كابينة الكبس المنخفض والمتوسط (LP & MP)',
        sub: 'Stages 1 & 2 Centrifugal Casings + E-301 / E-302',
        col: '#00c8ef',
        x: 80 + 950 + 42,
        w: 950,
        items: [
          { label: 'سحب غاز التصنيع V-301:', val: '25.5 bar / 40°C من الميثانايتر' },
          { label: 'كبس المرحلة الأولى (LP):', val: '25.5 -> 44.0 bar (148°C) -> E-301' },
          { label: 'مبرد E-301 وفاصل V-302:', val: 'الغاز بالشيل / ماء WC و WCR بالأنابيب (44 bar)' },
          { label: 'كبس المرحلة الثانية (MP):', val: '44.0 -> 110.0 bar (134°C) -> E-302' }
        ]
      },
      {
        title: '3. كابينة الكبس عالي الضغط وعجلة التدوير',
        sub: 'Stages 3 & 4 + Synthesis Loop Recycle Impeller',
        col: '#10b981',
        x: 80 + (950 + 42) * 2,
        w: 950,
        items: [
          { label: 'مبرد E-303 وفاصل V-303:', val: 'الغاز بالتيوب / ماء WC و WCR بالشيل -> 43°C' },
          { label: 'كبس المرحلة الثالثة (HP):', val: '105.0 -> 160.0 bar (140°C)' },
          { label: 'مبرد E-315 وفاصل V-310:', val: 'الغاز بالتيوب / ماء WC و WCR بالشيل -> 240 bar' },
          { label: 'عجلة تدوير غاز التخليق:', val: '205 طن/ساعة @ 245 bar لحلقة R-401' }
        ]
      },
      {
        title: '4. منظومة التزييت وموانع التسرب والأمان',
        sub: 'Lube Oil Skid, Dry Gas Seals & Anti-Surge System',
        col: '#a855f7',
        x: 80 + (950 + 42) * 3,
        w: 950,
        items: [
          { label: 'وحدة التزييت LO/SO:', val: 'مضخات P-301 بضغط 2.8 bar وفلاتر 5µm' },
          { label: 'موانع التسرب الجافة DGS:', val: 'حاجز نيتروجين لمنع تسرب الهيدروجين' },
          { label: 'صمامات مانع الارتجاف:', val: 'حلقات سريعة FV-301 و 302 و 303' },
          { label: 'نظام الإيقاف والرحلة ESD:', val: 'إغلاق صمام البخار في 0.2 ثانية' }
        ]
      }
    ];

    sections.forEach((sec) => {
      // Column Box Container
      ctx.fillStyle = 'rgba(10, 20, 35, 0.94)';
      ctx.fillRect(sec.x, 450, sec.w, 1420);
      ctx.strokeStyle = sec.col;
      ctx.lineWidth = 5;
      ctx.strokeRect(sec.x, 450, sec.w, 1420);

      // Section Header Banner
      ctx.fillStyle = sec.col;
      ctx.fillRect(sec.x, 450, sec.w, 130);

      ctx.direction = 'rtl';
      ctx.textAlign = 'right';
      ctx.fillStyle = '#030712';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(sec.title, sec.x + sec.w - 30, 515);

      ctx.direction = 'ltr';
      ctx.textAlign = 'left';
      ctx.font = 'bold 28px monospace';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(sec.sub, sec.x + 30, 560);

      // 4 Clean Item Cards inside Column
      let itemY = 610;
      sec.items.forEach((item, itemIdx) => {
        // Item Box Background
        ctx.fillStyle = 'rgba(15, 28, 48, 0.9)';
        ctx.fillRect(sec.x + 24, itemY, sec.w - 48, 280);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.strokeRect(sec.x + 24, itemY, sec.w - 48, 280);

        // Step Number Badge
        ctx.fillStyle = sec.col;
        ctx.beginPath();
        ctx.arc(sec.x + sec.w - 65, itemY + 55, 26, 0, Math.PI * 2);
        ctx.fill();

        ctx.direction = 'ltr';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#030712';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText(`${itemIdx + 1}`, sec.x + sec.w - 65, itemY + 66);

        // Item Title
        ctx.direction = 'rtl';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 38px sans-serif';
        ctx.fillText(item.label, sec.x + sec.w - 110, itemY + 66);

        // Item Value
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 34px sans-serif';
        ctx.fillText(item.val, sec.x + sec.w - 50, itemY + 145);

        // Visual Status Pill
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.fillRect(sec.x + 40, itemY + 195, sec.w - 80, 54);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.strokeRect(sec.x + 40, itemY + 195, sec.w - 80, 54);

        ctx.direction = 'rtl';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 28px monospace';
        ctx.fillText('● الحالة: نشط ومستقر ضمن الحدود الهندسية المصممة', sec.x + sec.w / 2, itemY + 233);

        itemY += 315;
      });
    });

    // Bottom Navigation & Click Instructions Strip
    ctx.fillStyle = 'rgba(255, 235, 59, 0.22)';
    ctx.fillRect(80, 1875, 3936, 130);
    ctx.strokeStyle = '#ffeb3b';
    ctx.lineWidth = 6;
    ctx.strokeRect(80, 1875, 3936, 130);

    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('⚡ انقر بالفأرة أو المس الشاشة هنا لفتح بنك الـ 100 سؤال ودليل التشغيل C-13..C-14 والمخطط الرقمي لضاغط K-301 والتوربين', 2048, 1955);

    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 16;

    const monGeo = new THREE.PlaneGeometry(30.0, 14.0);
    const monMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.25,
      metalness: 0.15,
      emissive: 0x051520,
      emissiveMap: tex,
      side: THREE.FrontSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });
    const mon = new THREE.Mesh(monGeo, monMat);
    mon.position.set(0, 12.0, 0.28);
    screenGroup.add(mon);

    const frameGeo = new THREE.BoxGeometry(30.8, 14.8, 0.5);
    const frameMesh = new THREE.Mesh(frameGeo, this.matCatwalkSteel);
    frameMesh.position.set(0, 12.0, 0.0);
    screenGroup.add(frameMesh);

    this.registerInteractive(screenGroup, 'unit300_master_pfd_board');
    this.group.add(screenGroup);
  }

  private renderCanvasWrappedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number = 4
  ) {
    const words = text.split(' ');
    let line = '';
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, y);
        line = words[n] + ' ';
        y += lineHeight;
        lineCount++;
        if (lineCount >= maxLines - 1 && n < words.length - 1) {
          const remaining = words.slice(n).join(' ');
          let fit = remaining;
          while (ctx.measureText(fit + '...').width > maxWidth && fit.length > 0) {
            fit = fit.substring(0, fit.length - 1);
          }
          ctx.fillText(fit.trim() + '...', x, y);
          return;
        }
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, y);
  }

  private addNozzleWithFlange(group: THREE.Group, pos: THREE.Vector3, dir: THREE.Vector3, d: number, l: number) {
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.copy(pos);

    const pipeGeo = new THREE.CylinderGeometry(d * 0.5, d * 0.5, l, 24);
    const pipe = new THREE.Mesh(pipeGeo, this.matCarbonSteel);
    pipe.position.set(0, l * 0.5, 0);
    nozzleGroup.add(pipe);

    const flangeGeo = new THREE.CylinderGeometry(d * 0.85, d * 0.85, 0.45, 24);
    const flange = new THREE.Mesh(flangeGeo, this.matFlange);
    flange.position.set(0, l, 0);
    nozzleGroup.add(flange);

    const up = new THREE.Vector3(0, 1, 0);
    if (Math.abs(dir.dot(up)) < 0.9999) {
      nozzleGroup.quaternion.setFromUnitVectors(up, dir.normalize());
    } else if (dir.y < 0) {
      nozzleGroup.rotation.x = Math.PI;
    }

    group.add(nozzleGroup);
  }

  private registerInteractive(obj: THREE.Object3D, equipmentId: string) {
    const info = MASTER_EQUIPMENT_DATA.find((e) => e.id.toLowerCase() === equipmentId.toLowerCase()) || {
      id: equipmentId,
      tag: equipmentId.toUpperCase(),
      name: `${equipmentId.toUpperCase()} Compressor Equipment`,
      arabicName: `معدة ضاغط غاز التصنيع ${equipmentId.toUpperCase()}`,
      type: 'compressor',
      section: 'Syngas Compression (K-301 Complex)',
      sectionNumber: 3,
      rowNumber: 5,
      position: obj.position.clone(),
      inletStream: 'Syngas Feed',
      outletStream: 'High Pressure Syngas Stream',
      operatingTemp: '40°C - 145°C',
      operatingPress: '25.0 - 220.0 kg/cm²G',
      catalystOrInternals: 'Multi-stage Centrifugal Impellers & Dry Gas Seals',
      description: 'Syngas Compressor Train Component with Anti-Surge & Vibration Protection.'
    };

    obj.userData = {
      equipmentId: equipmentId,
      equipmentInfo: info,
      isClickable: true
    };
    this.interactiveMeshes.push(obj);

    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.userData = {
          equipmentId: equipmentId,
          equipmentInfo: info,
          isClickable: true
        };
        this.interactiveMeshes.push(child);
      }
    });
  }

  // Animation Update Tick (Rotating Rotor Shafts)
  public update(delta: number) {
    // 1. Rotate compressor & turbine rotor shaft at 10,000 RPM equivalent
    this.rotatingShafts.forEach((shaft) => {
      shaft.rotation.x += delta * 24.0;
    });
  }

  // Toggle Thermal Insulation Cladding Mode
  public toggleCladdingMode() {
    this.isCladdingTranslucent = !this.isCladdingTranslucent;
    this.claddingMeshes.forEach((mesh) => {
      if (this.isCladdingTranslucent) {
        mesh.material = new THREE.MeshStandardMaterial({
          color: 0xe2e8f0,
          roughness: 0.15,
          metalness: 0.9,
          transparent: true,
          opacity: 0.35,
          depthWrite: false
        });
      } else {
        mesh.material = this.matAluminumCladding;
      }
    });
  }
}
