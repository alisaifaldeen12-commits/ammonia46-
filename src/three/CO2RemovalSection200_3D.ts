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
 * Colossal 3D Digital Twin of Section 2: CO2 Removal Section (Catacarb Unit 200)
 * Blueprint: DWG NO. 6112P 100-200-00
 * Fully aligned with 2D PFD with Authentic Carbon Steel Finish,
 * Industrial Zoning, Wide Spacious Clearances, and Professional Piperack Routing.
 */
export class CO2RemovalSection200_3D {
  public group: THREE.Group;
  public interactiveMeshes: THREE.Object3D[] = [];
  public claddingMeshes: THREE.Mesh[] = [];
  public onSelectCallback?: (info: EquipmentInfo) => void;

  private particleSystems: Array<{
    points: THREE.Points;
    curve: THREE.CurvePath<THREE.Vector3>;
    progress: Float32Array;
    speed: number;
  }> = [];

  private rotatingShafts: THREE.Object3D[] = [];

  // Photorealistic Carbon Steel, Thermal Cladding and Industrial Materials Palette
  private matCarbonSteel!: THREE.MeshStandardMaterial;
  private matCarbonSteelDark!: THREE.MeshStandardMaterial;
  private matAlloySteel!: THREE.MeshStandardMaterial;
  private matPolishedSteel!: THREE.MeshStandardMaterial;
  private matHotSteelEffluent!: THREE.MeshStandardMaterial;
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
  private matPackingMesh!: THREE.MeshStandardMaterial;
  private matPipeInsulation!: THREE.MeshStandardMaterial;
  public matAluminumCladding!: THREE.MeshStandardMaterial;
  public matCladdingStraps!: THREE.MeshStandardMaterial;
  public matFlangeInsulationBox!: THREE.MeshStandardMaterial;
  public matLobsterElbow!: THREE.MeshStandardMaterial;
  public isCladdingTranslucent: boolean = false;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'CO2RemovalSection200_3D_Twin';

    this.initMaterials();
    this.buildFoundationsAndStructures();
    this.buildInletGasReboilerAndSeparator();
    this.buildCatacarbAbsorberColumnT201();
    this.buildAbsorberOverheadKnockoutV204();
    this.buildHydraulicTurbineAndSemiLeanPumpTrain();
    this.buildSemiLeanCoolerE207();
    this.buildCatacarbRegeneratorColumnT202();
    this.buildReboilerThermosiphonTrains();
    this.buildLeanSolutionAndBfwExchangerTrain();
    this.buildAcidGasCondensersAndRefluxTrain();
    this.buildChemicalStorageAndDegasserDeck();
    this.buildProcessPipingNetwork();
    this.buildEquipmentBadgesAndSigns();
    this.buildDcsInfoScreens();
  }

  private initMaterials() {
    const csDiff = createCarbonSteelTexture();
    const pipeDiff = createIndustrialCarbonSteelPipeTexture();
    const pipeBump = createCarbonSteelBumpTexture();

    this.matCarbonSteel = new THREE.MeshStandardMaterial({
      map: csDiff,
      bumpMap: pipeBump,
      bumpScale: 0.04,
      roughness: 0.32,
      metalness: 0.88,
      name: 'co2_carbon_steel'
    });

    this.matCarbonSteelDark = new THREE.MeshStandardMaterial({
      color: 0x222831,
      roughness: 0.38,
      metalness: 0.85,
      name: 'co2_cs_dark'
    });

    this.matAlloySteel = new THREE.MeshStandardMaterial({
      map: pipeDiff,
      bumpMap: pipeBump,
      bumpScale: 0.03,
      roughness: 0.28,
      metalness: 0.92,
      name: 'co2_alloy_steel'
    });

    this.matPolishedSteel = new THREE.MeshStandardMaterial({
      color: 0xc8d6e5,
      roughness: 0.15,
      metalness: 0.95,
      name: 'co2_polished_steel'
    });

    this.matHotSteelEffluent = new THREE.MeshStandardMaterial({
      color: 0x544038,
      roughness: 0.35,
      metalness: 0.85,
      name: 'co2_hot_effluent'
    });

    this.matConcretePad = new THREE.MeshStandardMaterial({
      color: 0x2b3542,
      roughness: 0.9,
      metalness: 0.1,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      name: 'co2_concrete'
    });

    this.matTrenchGrate = new THREE.MeshStandardMaterial({
      color: 0x16202c,
      roughness: 0.7,
      metalness: 0.65,
      name: 'co2_grate'
    });

    this.matYellowSafety = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.4,
      name: 'co2_yellow'
    });

    this.matCatwalkSteel = new THREE.MeshStandardMaterial({
      color: 0x1b2430,
      roughness: 0.55,
      metalness: 0.8,
      name: 'co2_catwalk'
    });

    this.matFlange = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.28,
      metalness: 0.9,
      name: 'co2_flange'
    });

    this.matStudBolt = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.95,
      name: 'co2_bolt'
    });

    this.matValveBlue = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.6,
      name: 'co2_valve_blue'
    });

    this.matValveGreen = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.3,
      metalness: 0.6,
      name: 'co2_valve_green'
    });

    this.matValveAmber = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.6,
      name: 'co2_valve_amber'
    });

    this.matValvePurple = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.3,
      metalness: 0.6,
      name: 'co2_valve_purple'
    });

    this.matPackingMesh = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.45,
      metalness: 0.75,
      name: 'co2_packing'
    });

    this.matPipeInsulation = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.7,
      name: 'co2_insulation'
    });

    const cladTex = createAluminumCladdingTexture();
    cladTex.repeat.set(1, 2);
    const cladBump = createCladdingBumpTexture();
    cladBump.repeat.set(1, 2);

    this.matAluminumCladding = new THREE.MeshStandardMaterial({
      map: cladTex,
      bumpMap: cladBump,
      bumpScale: 0.05,
      roughness: 0.22,
      metalness: 0.94,
      name: 'co2_aluminum_cladding'
    });

    this.matCladdingStraps = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.15,
      metalness: 0.98,
      name: 'co2_cladding_straps'
    });

    this.matFlangeInsulationBox = new THREE.MeshStandardMaterial({
      map: cladTex,
      bumpMap: cladBump,
      bumpScale: 0.04,
      roughness: 0.25,
      metalness: 0.92,
      name: 'co2_flange_insulation_box'
    });

    this.matLobsterElbow = new THREE.MeshStandardMaterial({
      map: cladTex,
      bumpMap: cladBump,
      bumpScale: 0.04,
      roughness: 0.24,
      metalness: 0.93,
      name: 'co2_lobster_elbow'
    });
  }

  // 1. Reinforced Concrete Foundation Yard & Central Overhead Multi-Tier Pipe Rack
  private buildFoundationsAndStructures() {
    // Grand Industrial Slab (420m x 320m)
    const slabGeo = new THREE.BoxGeometry(420, 1.8, 320);
    const slab = new THREE.Mesh(slabGeo, this.matConcretePad);
    slab.position.set(20, -0.9, 15);
    slab.receiveShadow = true;
    this.group.add(slab);

    // Perimeter Asphalt Access Roads
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x131820, roughness: 0.95, metalness: 0.05 });
    const roadN = new THREE.Mesh(new THREE.BoxGeometry(450, 0.15, 24), roadMat);
    roadN.position.set(20, -0.9, -150);
    this.group.add(roadN);

    const roadS = new THREE.Mesh(new THREE.BoxGeometry(450, 0.15, 24), roadMat);
    roadS.position.set(20, -0.9, 170);
    this.group.add(roadS);

    const roadE = new THREE.Mesh(new THREE.BoxGeometry(24, 0.15, 340), roadMat);
    roadE.position.set(240, -0.9, 15);
    this.group.add(roadE);

    const roadW = new THREE.Mesh(new THREE.BoxGeometry(24, 0.15, 340), roadMat);
    roadW.position.set(-200, -0.9, 15);
    this.group.add(roadW);

    // Safety Curbs
    const curbGeoL = new THREE.BoxGeometry(1.2, 0.45, 320);
    const curbL = new THREE.Mesh(curbGeoL, this.matYellowSafety);
    curbL.position.set(-189.4, 0.22, 15);
    this.group.add(curbL);

    const curbR = new THREE.Mesh(curbGeoL, this.matYellowSafety);
    curbR.position.set(229.4, 0.22, 15);
    this.group.add(curbR);

    // Concrete Drainage Trenches with Cast Iron Grates
    [-85, -35, 15, 65, 115].forEach((zPos) => {
      const trenchGeo = new THREE.BoxGeometry(400, 0.12, 2.5);
      const trench = new THREE.Mesh(trenchGeo, this.matTrenchGrate);
      trench.position.set(20, 0.06, zPos);
      this.group.add(trench);
    });

    // High-Mast Floodlight Towers (70m height) for nighttime plant illumination
    [
      { x: -180, z: -120 },
      { x: 210, z: -120 },
      { x: -180, z: 140 },
      { x: 210, z: 140 },
      { x: -180, z: 15 },
      { x: 210, z: 15 }
    ].forEach((mast) => {
      const mastGeo = new THREE.CylinderGeometry(0.9, 2.0, 70.0, 16);
      const mastMesh = new THREE.Mesh(mastGeo, this.matCarbonSteel);
      mastMesh.position.set(mast.x, 35.0, mast.z);
      this.group.add(mastMesh);

      const mastBase = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.8, 5.0), this.matConcretePad);
      mastBase.position.set(mast.x, 0.9, mast.z);
      this.group.add(mastBase);

      const crown = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 0.8, 16), this.matCatwalkSteel);
      crown.position.set(mast.x, 70.0, mast.z);
      this.group.add(crown);

      for (let f = 0; f < 8; f++) {
        const angle = (f / 8) * Math.PI * 2;
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.8), this.matValveBlue);
        lamp.position.set(mast.x + Math.cos(angle) * 3.6, 70.5, mast.z + Math.sin(angle) * 3.6);
        this.group.add(lamp);
      }
    });
  }

  // 2. Zone B: Gas Inlet & Primary Reboiler Yard (West / North-West)
  // E-201 at (-140, 14.0, -60), V-201 at (-95, 0, -60), P-206 A/B at (-95, 0, +30)
  private buildInletGasReboilerAndSeparator() {
    // E-201 Elevated Table Platform Structure with Stairs (Deck at Y = 8.0m)
    const e201Platform = this.createElevatedPlatformWithStairs({
      widthX: 36.0,
      lengthZ: 18.0,
      deckHeight: 8.0,
      stairSide: 'south',
      stairOffset: 0
    });
    e201Platform.position.set(-140, 0, -60);
    this.group.add(e201Platform);

    // E-201: Catacarb Reboiler (Horizontal Kettle Reboiler: Dia 12m, Length 30m, Elevated at Y = 14.0m)
    const e201 = this.createHorizontalShell(12.0, 30.0, this.matCarbonSteel);
    e201.position.set(-140, 14.0, -60);
    e201.name = 'E-201';

    // Kettle Vapor Dome (rises to Y = 22.5m)
    const domeGeo = new THREE.CylinderGeometry(3.6, 3.6, 5.0, 24);
    const dome = new THREE.Mesh(domeGeo, this.matCarbonSteel);
    dome.position.set(-140, 22.5, -60);
    this.group.add(dome);

    // Elevated Nozzles (at rack & connection levels)
    this.addNozzleWithFlange(e201, new THREE.Vector3(-15.0, 0, 0), new THREE.Vector3(-1, 0, 0), 1.5, 4.0); // Stream 1 Tube In from LTS
    this.addNozzleWithFlange(e201, new THREE.Vector3(15.0, 0, 0), new THREE.Vector3(1, 0, 0), 1.5, 4.0); // Tube Out to V-201
    this.addNozzleWithFlange(e201, new THREE.Vector3(0, 8.5, 0), new THREE.Vector3(0, 1, 0), 1.4, 3.6); // Shell Vapor Out to T-202
    this.addNozzleWithFlange(e201, new THREE.Vector3(0, -6.0, 0), new THREE.Vector3(0, -1, 0), 1.4, 3.6); // Shell Liquid In from T-202 (Y = 8.0)

    this.registerInteractive(e201, 'e-201');
    this.group.add(e201);

    // V-201: Reboiler Separator Drum (Vertical Knockout Drum: Dia 7.5m, Height 22m)
    const v201 = this.createVerticalExchanger('V-201', 7.5, 22.0, this.matAlloySteel, this.matAlloySteel);
    v201.position.set(-95, 0, -60);
    this.addNozzleWithFlange(v201, new THREE.Vector3(-3.8, 15.0, 0), new THREE.Vector3(-1, 0, 0), 1.4, 3.2); // In from E-201
    this.addNozzleWithFlange(v201, new THREE.Vector3(0, 26.5, 0), new THREE.Vector3(0, 1, 0), 1.4, 3.6); // Stream 2 Overhead Vapor to T-201
    this.addNozzleWithFlange(v201, new THREE.Vector3(0, 2.0, 0), new THREE.Vector3(0, -1, 0), 1.0, 2.5); // Bottom Condensate to P-206
    this.registerInteractive(v201, 'v-201');
    this.group.add(v201);

    // P-206 A,B: Condensate Injection Pumps Skid at (-95, 0, +30)
    const p206Group = new THREE.Group();
    p206Group.position.set(-95, 0, 30);
    p206Group.name = 'P-206';

    const p206Pad = new THREE.Mesh(new THREE.BoxGeometry(22.0, 1.4, 14.0), this.matConcretePad);
    p206Pad.position.set(0, 0.7, 0);
    p206Group.add(p206Pad);

    [-5.5, 5.5].forEach((xOff) => {
      const pUnit = this.createIndustrialEngineeredPump({
        tag: `P-206${xOff < 0 ? 'A' : 'B'}`,
        arabicTitle: `مضخة حقن المتكاثف P-206${xOff < 0 ? 'A' : 'B'}`,
        voluteRadius: 1.8,
        suctionRadius: 0.7,
        dischargeRadius: 0.7,
        motorRadius: 1.5,
        motorLength: 3.8,
        casingColor: this.matValveBlue,
        suctionAxis: 'z',
        suctionSign: -1
      });
      pUnit.position.set(xOff, 1.4, 0);
      p206Group.add(pUnit);
    });

    // Professional Separated Suction & Overhead Discharge Manifold Rig
    this.createDualPumpManifoldRig({
      skidGroup: p206Group,
      pumpOffsets: [-5.5, 5.5],
      suctionAxis: 'z',
      suctionSign: -1,
      pumpBaseY: 1.4,
      suctionHeaderOffset: -8.0,
      suctionRadius: 0.75,
      suctionMaterial: this.matValveBlue,
      dischargeElevation: 11.5,
      dischargeHeaderOffset: 5.0,
      dischargeRadius: 0.75,
      dischargeMaterial: this.matValveBlue,
      voluteRadius: 1.8,
      fluidNameAr: 'متكاثف المعالجة',
      fluidNameEn: 'CONDENSATE',
      flowColor: 0x38bdf8,
      worldPos: new THREE.Vector3(-95, 0, 30)
    });

    this.registerInteractive(p206Group, 'p-206');
    this.registerInteractive(p206Group, 'p-206ab');
    this.group.add(p206Group);
  }

  // 3. Zone A (North Line): T-201 Catacarb CO2 Absorber Tower at (-45, 0, -60)
  // Colossal Stepped Column: Height 92m, Shell Radius 8.0m, 4 Packed Beds, 4 Catwalks, Caged Spiral Ladder
  private buildCatacarbAbsorberColumnT201() {
    const t1Group = new THREE.Group();
    t1Group.position.set(-45, 0, -60);
    t1Group.name = 'T-201';

    // Octagonal Reinforced Concrete Foundation Pedestal
    const footGeo = new THREE.CylinderGeometry(13.0, 15.0, 4.0, 8);
    const foot = new THREE.Mesh(footGeo, this.matConcretePad);
    foot.position.set(0, 2.0, 0);
    t1Group.add(foot);

    // Support Skirt
    const skirtGeo = new THREE.CylinderGeometry(8.0, 9.0, 10.0, 36, 1, true);
    const skirt = new THREE.Mesh(skirtGeo, this.matCarbonSteel);
    skirt.position.set(0, 9.0, 0);
    t1Group.add(skirt);

    // Main Column Shell (Height 68m, Radius 8.0m)
    const shellGeo = new THREE.CylinderGeometry(8.0, 8.0, 68.0, 40);
    const shell = new THREE.Mesh(shellGeo, this.matCarbonSteel);
    shell.position.set(0, 48.0, 0);
    t1Group.add(shell);

    // Dished Top and Bottom Heads
    const domeGeo = new THREE.SphereGeometry(8.0, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const topDome = new THREE.Mesh(domeGeo, this.matCarbonSteel);
    topDome.position.set(0, 82.0, 0);
    t1Group.add(topDome);

    const botDome = new THREE.Mesh(domeGeo, this.matCarbonSteel);
    botDome.rotation.x = Math.PI;
    botDome.position.set(0, 14.0, 0);
    t1Group.add(botDome);

    // 4 Packed Bed Indicator Bands and Catwalk Maintenance Galleries
    const bedElevations = [26.0, 44.0, 62.0, 76.0];
    bedElevations.forEach((y) => {
      const ringGeo = new THREE.CylinderGeometry(8.05, 8.05, 10.0, 40, 1, true);
      const ring = new THREE.Mesh(ringGeo, this.matPackingMesh);
      ring.position.set(0, y, 0);
      t1Group.add(ring);

      // Circular Catwalk Platform
      const platGeo = new THREE.CylinderGeometry(10.5, 10.5, 0.4, 40);
      const plat = new THREE.Mesh(platGeo, this.matCatwalkSteel);
      plat.position.set(0, y + 5.0, 0);
      t1Group.add(plat);

      // Yellow Safety Handrail
      const railGeo = new THREE.TorusGeometry(10.4, 0.12, 8, 40);
      const rail = new THREE.Mesh(railGeo, this.matYellowSafety);
      rail.rotation.x = Math.PI / 2;
      rail.position.set(0, y + 6.6, 0);
      t1Group.add(rail);
    });

    // Spiral Access Staircase with Caged Safety Protection
    const steps = 150;
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 10.0;
      const y = 14.0 + (i / steps) * 68.0;
      const stepGeo = new THREE.BoxGeometry(2.4, 0.18, 0.8);
      const step = new THREE.Mesh(stepGeo, this.matCatwalkSteel);
      step.position.set(Math.cos(angle) * 9.5, y, Math.sin(angle) * 9.5);
      step.rotation.y = -angle;
      t1Group.add(step);
    }

    // Nozzles - Strictly Positioned to Avoid Clash
    this.addNozzleWithFlange(t1Group, new THREE.Vector3(-8.2, 22.0, 0), new THREE.Vector3(-1, 0, 0), 1.5, 3.8); // Stream 2 Gas In
    this.addNozzleWithFlange(t1Group, new THREE.Vector3(0, 6.0, 8.2), new THREE.Vector3(0, 0, 1), 1.5, 4.0); // Rich Soln Bottom Out
    this.addNozzleWithFlange(t1Group, new THREE.Vector3(8.2, 52.0, 0), new THREE.Vector3(1, 0, 0), 1.4, 3.8); // Semi-Lean In
    this.addNozzleWithFlange(t1Group, new THREE.Vector3(8.2, 80.0, 0), new THREE.Vector3(1, 0, 0), 1.4, 3.8); // Lean Soln In
    this.addNozzleWithFlange(t1Group, new THREE.Vector3(0, 90.0, 0), new THREE.Vector3(0, 1, 0), 1.6, 4.2); // Stream 3 Overhead Gas Out

    this.registerInteractive(t1Group, 't-201');
    this.group.add(t1Group);
  }

  // 4. V-204: Absorber Overhead Knockout Drum at (-45, 0, -115)
  // Deep North Yard with spacious clearance (55m separation) behind T-201
  private buildAbsorberOverheadKnockoutV204() {
    const v204 = this.createVerticalExchanger('V-204', 7.5, 16.0, this.matCarbonSteel, this.matCarbonSteel);
    v204.position.set(-45, 0, -115);
    this.addNozzleWithFlange(v204, new THREE.Vector3(0, 21.8, 0), new THREE.Vector3(0, 1, 0), 1.4, 3.2); // Top Gas Outlet to Methanator
    this.addNozzleWithFlange(v204, new THREE.Vector3(0, 13.0, 3.75), new THREE.Vector3(0, 0, 1), 1.4, 3.25); // Gas In from T-201 (South Flange at Z=-108.0)
    this.addNozzleWithFlange(v204, new THREE.Vector3(0, 2.0, 0), new THREE.Vector3(0, -1, 0), 0.8, 2.0); // Bottom Drain
    this.registerInteractive(v204, 'v-204');
    this.group.add(v204);
  }

  // 5. Zone C (Machinery Bay South): Hydraulic Turbine P-201HT & Semi-Lean Pumps P-201 A,B & Control Valves LRC-202-1V / LRC-202-2V
  private buildHydraulicTurbineAndSemiLeanPumpTrain() {
    const p1Train = new THREE.Group();
    p1Train.name = 'P-201_Pumping_Bay';

    // =========================================================================
    // TRAIN 1 (Operating): P-201HT + P-201A Motor + P-201A Pump (Tandem Shaft Train at Z = 16.0)
    // [P-201HT Turbine (X=-45)] ==Coupling== [P-201A Motor (X=-35)] ==Coupling== [P-201A Pump (X=-25)]
    // =========================================================================
    const train1Z = 16.0;

    // Train 1 Dedicated Concrete Foundation Skid (36m x 1.6m x 10m)
    const pad1 = new THREE.Mesh(new THREE.BoxGeometry(36.0, 1.6, 10.0), this.matConcretePad);
    pad1.position.set(-35.0, 0.8, train1Z);
    p1Train.add(pad1);

    const frameGeo1 = new THREE.BoxGeometry(34.0, 0.5, 8.5);
    const frameMesh1 = new THREE.Mesh(frameGeo1, this.matCatwalkSteel);
    frameMesh1.position.set(-35.0, 1.85, train1Z);
    p1Train.add(frameMesh1);

    // Unit 1a: P-201HT Hydraulic Energy Recovery Turbine (at X = -45.0, Z = 16.0)
    const p201htGroup = new THREE.Group();
    p201htGroup.position.set(-45.0, 2.2, train1Z);
    p201htGroup.name = 'P-201HT';

    const turbPedestal = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.2, 4.0), this.matCarbonSteelDark);
    turbPedestal.position.set(0, 0.6, 0);
    p201htGroup.add(turbPedestal);

    const turbCasing = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 3.8, 24), this.matValveGreen);
    turbCasing.rotation.z = Math.PI / 2;
    turbCasing.position.set(0, 2.4, 0);
    p201htGroup.add(turbCasing);

    // Inlet nozzle (Rich Sol'n from LRC-202-1V at 28.2 bar)
    this.addNozzleWithFlange(p201htGroup, new THREE.Vector3(0, 2.4, -2.5), new THREE.Vector3(0, 0, -1), 0.58, 1.6);
    // Discharge nozzle (to T-202 top riser)
    this.addNozzleWithFlange(p201htGroup, new THREE.Vector3(0, 4.8, 0), new THREE.Vector3(0, 1, 0), 0.58, 1.6);

    // Turbine Vertical Discharge Riser (with Check Valve, Pressure Gauge, Gate Valve)
    const turbRiser = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 3.0, 20), this.matValveGreen);
    turbRiser.position.set(0, 6.3, 0);
    p201htGroup.add(turbRiser);

    const turbChk = this.createIndustrialCheckValve(0.58);
    turbChk.position.set(0, 5.8, 0);
    p201htGroup.add(turbChk);

    const turbPg = this.createIndustrialPressureGauge(0.58);
    turbPg.position.set(0.6, 6.8, 0);
    p201htGroup.add(turbPg);

    const turbDv = this.createIndustrialGateValve(0.58, 'z');
    turbDv.position.set(0, 7.4, 0);
    p201htGroup.add(turbDv);

    // 90° Overhead Elbow turning into Stream 9 at Y=10.0 (world (-45, 10.0, 16.0))
    const turbElbow = new THREE.Mesh(new THREE.SphereGeometry(0.59, 16, 16), this.matValveGreen);
    turbElbow.position.set(0, 7.8, 0);
    p201htGroup.add(turbElbow);

    p1Train.add(p201htGroup);
    this.registerInteractive(p201htGroup, 'p-201ht');

    // Drive Shaft Coupling 1: Between P-201HT Turbine and P-201A Electric Motor
    const shaft1 = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 4.2, 16), this.matPolishedSteel);
    shaft1.rotation.z = Math.PI / 2;
    shaft1.position.set(-40.0, 4.6, train1Z);
    p1Train.add(shaft1);
    this.rotatingShafts.push(shaft1);

    const shaft1Guard = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 3.8, 16, 1, true), this.matYellowSafety);
    shaft1Guard.rotation.z = Math.PI / 2;
    shaft1Guard.position.set(-40.0, 4.6, train1Z);
    p1Train.add(shaft1Guard);

    // Unit 1b: P-201A Heavy-Duty Dual-Shaft Electric Motor (at X = -35.0, Z = 16.0)
    const motor1Group = new THREE.Group();
    motor1Group.position.set(-35.0, 2.2, train1Z);
    motor1Group.name = 'P-201A_Motor';

    const mPedestal = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.2, 4.5), this.matCarbonSteelDark);
    mPedestal.position.set(0, 0.6, 0);
    motor1Group.add(mPedestal);

    const motorStator = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 5.8, 24), this.matCatwalkSteel);
    motorStator.rotation.z = Math.PI / 2;
    motorStator.position.set(0, 2.4, 0);
    motor1Group.add(motorStator);

    const jBox = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 1.2), this.matValveAmber);
    jBox.position.set(0, 4.4, 1.4);
    motor1Group.add(jBox);

    p1Train.add(motor1Group);

    // Drive Shaft Coupling 2: Between P-201A Electric Motor and P-201A Semi-Lean Pump
    const shaft2 = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 4.2, 16), this.matPolishedSteel);
    shaft2.rotation.z = Math.PI / 2;
    shaft2.position.set(-30.0, 4.6, train1Z);
    p1Train.add(shaft2);
    this.rotatingShafts.push(shaft2);

    const shaft2Guard = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 3.8, 16, 1, true), this.matYellowSafety);
    shaft2Guard.rotation.z = Math.PI / 2;
    shaft2Guard.position.set(-30.0, 4.6, train1Z);
    p1Train.add(shaft2Guard);

    // Unit 1c: P-201A Semi-Lean Solution Circulation Pump (at X = -25.0, Z = 16.0)
    const pump1Group = new THREE.Group();
    pump1Group.position.set(-25.0, 2.2, train1Z);
    pump1Group.name = 'P-201A_Pump';

    const p1Pedestal = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.2, 4.0), this.matCarbonSteelDark);
    p1Pedestal.position.set(0, 0.6, 0);
    pump1Group.add(p1Pedestal);

    const p1Volute = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 3.4, 24), this.matValveGreen);
    p1Volute.rotation.z = Math.PI / 2;
    p1Volute.position.set(0, 2.4, 0);
    pump1Group.add(p1Volute);

    // Suction nozzle from Suction Header
    this.addNozzleWithFlange(pump1Group, new THREE.Vector3(0, 2.4, -2.5), new THREE.Vector3(0, 0, -1), 0.55, 1.6);
    // Discharge nozzle to overhead header (top vertical nozzle)
    this.addNozzleWithFlange(pump1Group, new THREE.Vector3(0, 4.8, 0), new THREE.Vector3(0, 1, 0), 0.55, 1.6);

    // P-201A Suction Spool with Y-Strainer & Isolation Gate Valve
    const sucPipe1A = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 3.5, 20), this.matValveGreen);
    sucPipe1A.rotation.x = Math.PI / 2;
    sucPipe1A.position.set(0, 2.4, -4.25);
    pump1Group.add(sucPipe1A);

    // Prominent Y-Strainer on P-201A Suction
    const strainer1A = this.createIndustrialYStrainer(0.55);
    strainer1A.position.set(0, 2.4, -5.0);
    pump1Group.add(strainer1A);

    // Isolation Gate Valve on P-201A Suction
    const gate1A = this.createIndustrialGateValve(0.55, 'y');
    gate1A.position.set(0, 2.4, -3.5);
    pump1Group.add(gate1A);

    const sucArr1A = this.createFlowChevronArrows(
      new THREE.Vector3(0, 2.4, -6.0),
      new THREE.Vector3(0, 2.4, -2.6),
      3,
      0x10b981,
      0.38,
      0.6
    );
    pump1Group.add(sucArr1A);

    // P-201A Vertical Discharge Riser with Check Valve, Gate Valve & Pressure Gauge
    const riser1A = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 4.5, 20), this.matValveGreen);
    riser1A.position.set(0, 7.05, 0);
    pump1Group.add(riser1A);

    // Prominent Swing Check Valve on P-201A Discharge
    const chk1A = this.createIndustrialCheckValve(0.55);
    chk1A.position.set(0, 6.0, 0);
    pump1Group.add(chk1A);

    // Pressure Gauge on P-201A Discharge
    const pg1A = this.createIndustrialPressureGauge(0.55);
    pg1A.position.set(0.6, 7.0, 0);
    pump1Group.add(pg1A);

    // Discharge Gate Valve on P-201A Discharge
    const dv1A = this.createIndustrialGateValve(0.55, 'z');
    dv1A.position.set(0, 8.2, 0);
    pump1Group.add(dv1A);

    const disArr1A = this.createFlowChevronArrows(
      new THREE.Vector3(0, 5.0, 0),
      new THREE.Vector3(0, 9.0, 0),
      3,
      0x10b981,
      0.38,
      0.6
    );
    pump1Group.add(disArr1A);

    // 90° Overhead Elbow turning into overhead header at Y=11.5 (world (-25.0, 11.5, 16.0))
    const topElbow1A = new THREE.Mesh(new THREE.SphereGeometry(0.56, 16, 16), this.matValveGreen);
    topElbow1A.position.set(0, 9.3, 0);
    pump1Group.add(topElbow1A);

    p1Train.add(pump1Group);
    this.registerInteractive(pump1Group, 'p-201ab');

    // =========================================================================
    // Wide Clear Safety Walkway Between Train 1 and Train 2 (Z = 22.0 to 34.0)
    // =========================================================================
    const walkwayGeo = new THREE.BoxGeometry(32.0, 0.15, 10.0);
    const walkway = new THREE.Mesh(walkwayGeo, this.matCatwalkSteel);
    walkway.position.set(-30.0, 0.1, 28.0);
    p1Train.add(walkway);

    // =========================================================================
    // TRAIN 2 (Standby): P-201B Motor + P-201B Pump Skid (Spaciously separated at Z = 55.0)
    // [P-201B Motor (X=-35)] ==Coupling== [P-201B Pump (X=-25)]
    // =========================================================================
    const train2Z = 55.0;

    // Dedicated Separate Concrete Skid Foundation for P-201B (26m x 1.6m x 10m)
    const pad2 = new THREE.Mesh(new THREE.BoxGeometry(26.0, 1.6, 10.0), this.matConcretePad);
    pad2.position.set(-30.0, 0.8, train2Z);
    p1Train.add(pad2);

    const frameGeo2 = new THREE.BoxGeometry(24.0, 0.5, 8.5);
    const frameMesh2 = new THREE.Mesh(frameGeo2, this.matCatwalkSteel);
    frameMesh2.position.set(-30.0, 1.85, train2Z);
    p1Train.add(frameMesh2);

    const p201bGroup = new THREE.Group();
    p201bGroup.position.set(0, 2.2, train2Z);
    p201bGroup.name = 'P-201B_Standby_Train';

    // P-201B Motor (at X = -35.0, Z = 55.0)
    const m2Ped = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.2, 4.5), this.matCarbonSteelDark);
    m2Ped.position.set(-35.0, 0.6, 0);
    p201bGroup.add(m2Ped);

    const m2Stator = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 5.8, 24), this.matCatwalkSteel);
    m2Stator.rotation.z = Math.PI / 2;
    m2Stator.position.set(-35.0, 2.4, 0);
    p201bGroup.add(m2Stator);

    // Shaft 3 Coupling
    const shaft3 = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 4.2, 16), this.matPolishedSteel);
    shaft3.rotation.z = Math.PI / 2;
    shaft3.position.set(-30.0, 2.4, 0);
    p201bGroup.add(shaft3);

    // P-201B Pump Volute (at X = -25.0, Z = 55.0)
    const p2Ped = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.2, 4.0), this.matCarbonSteelDark);
    p2Ped.position.set(-25.0, 0.6, 0);
    p201bGroup.add(p2Ped);

    const p2Volute = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 3.4, 24), this.matValveGreen);
    p2Volute.rotation.z = Math.PI / 2;
    p2Volute.position.set(-25.0, 2.4, 0);
    p201bGroup.add(p2Volute);

    this.addNozzleWithFlange(p201bGroup, new THREE.Vector3(-25.0, 2.4, -2.5), new THREE.Vector3(0, 0, -1), 0.55, 1.6);
    this.addNozzleWithFlange(p201bGroup, new THREE.Vector3(-25.0, 4.8, 0), new THREE.Vector3(0, 1, 0), 0.55, 1.6);

    // P-201B Suction Spool with Y-Strainer & Isolation Gate Valve
    const sucPipe1B = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 3.5, 20), this.matValveGreen);
    sucPipe1B.rotation.x = Math.PI / 2;
    sucPipe1B.position.set(-25.0, 2.4, -4.25);
    p201bGroup.add(sucPipe1B);

    // Prominent Y-Strainer on P-201B Suction
    const strainer1B = this.createIndustrialYStrainer(0.55);
    strainer1B.position.set(-25.0, 2.4, -5.0);
    p201bGroup.add(strainer1B);

    // Isolation Gate Valve on P-201B Suction
    const gate1B = this.createIndustrialGateValve(0.55, 'y');
    gate1B.position.set(-25.0, 2.4, -3.5);
    p201bGroup.add(gate1B);

    const sucArr1B = this.createFlowChevronArrows(
      new THREE.Vector3(-25.0, 2.4, -6.0),
      new THREE.Vector3(-25.0, 2.4, -2.6),
      3,
      0x10b981,
      0.38,
      0.6
    );
    p201bGroup.add(sucArr1B);

    // P-201B Vertical Discharge Riser with Check Valve, Gate Valve & Pressure Gauge
    const riser1B = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 4.5, 20), this.matValveGreen);
    riser1B.position.set(-25.0, 7.05, 0);
    p201bGroup.add(riser1B);

    // Prominent Swing Check Valve on P-201B Discharge
    const chk1B = this.createIndustrialCheckValve(0.55);
    chk1B.position.set(-25.0, 6.0, 0);
    p201bGroup.add(chk1B);

    // Pressure Gauge on P-201B Discharge
    const pg1B = this.createIndustrialPressureGauge(0.55);
    pg1B.position.set(-24.4, 7.0, 0);
    p201bGroup.add(pg1B);

    // Discharge Gate Valve on P-201B Discharge
    const dv1B = this.createIndustrialGateValve(0.55, 'z');
    dv1B.position.set(-25.0, 8.2, 0);
    p201bGroup.add(dv1B);

    const disArr1B = this.createFlowChevronArrows(
      new THREE.Vector3(-25.0, 5.0, 0),
      new THREE.Vector3(-25.0, 9.0, 0),
      3,
      0x10b981,
      0.38,
      0.6
    );
    p201bGroup.add(disArr1B);

    // 90° Overhead Elbow turning into overhead header at Y=11.5 (world (-25.0, 11.5, 55.0))
    const topElbow1B = new THREE.Mesh(new THREE.SphereGeometry(0.56, 16, 16), this.matValveGreen);
    topElbow1B.position.set(-25.0, 9.3, 0);
    p201bGroup.add(topElbow1B);

    p1Train.add(p201bGroup);
    this.registerInteractive(p201bGroup, 'p-201ab');

    // =========================================================================
    // Clean Common Suction Header & Overhead Discharge Header
    // (Both at X = -25.0 in world space)
    // =========================================================================
    // Suction Header along Z (at X = -25.0, Y = 4.6 in world space)
    // Spans from Z = 6.0 (connecting to Stream 10 from T-202) to Z = 58.0 (ending with blind flange)
    const p201SucHeader = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 52.0, 20), this.matValveGreen);
    p201SucHeader.rotation.x = Math.PI / 2;
    p201SucHeader.position.set(-25.0, 4.6, 32.0); // center at Z = 32.0 (spans Z = 6.0 to 58.0)
    p1Train.add(p201SucHeader);

    // Suction Header End Blind Flange at Z = 58.0
    const sucBlindFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.25, 18), this.matFlange);
    sucBlindFlange.rotation.x = Math.PI / 2;
    sucBlindFlange.position.set(-25.0, 4.6, 58.0);
    p1Train.add(sucBlindFlange);

    // Overhead Discharge Header along Z (at X = -25.0, Y = 11.5 in world space)
    // Spans from Z = 16.0 (P-201A elbow) through Z = 55.0 (P-201B elbow) to Z = 65.0 (connecting to E-207)
    const p201DisHeader = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 49.0, 20), this.matValveGreen);
    p201DisHeader.rotation.x = Math.PI / 2;
    p201DisHeader.position.set(-25.0, 11.5, 40.5); // center at Z = 40.5 (spans Z = 16.0 to 65.0)
    p1Train.add(p201DisHeader);

    // Discharge Header Rear Blind Flange at Z = 16.0
    const disBlindFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.25, 18), this.matFlange);
    disBlindFlange.rotation.x = Math.PI / 2;
    disBlindFlange.position.set(-25.0, 11.5, 16.0);
    p1Train.add(disBlindFlange);

    // =========================================================================
    // Real Diaphragm Control Valves: LRC-202-1V and LRC-202-2V
    // =========================================================================
    // LRC-202-1V: Feed Control Valve directly in front of P-201HT Turbine Inlet
    const v1 = this.createPneumaticControlValve('LRC-202-1V', 'صمام تغذية توربين P-201HT', this.matValveGreen);
    v1.position.set(-45.0, 4.6, 9.0);
    p1Train.add(v1);
    this.registerInteractive(v1, 'lrc-202-1v');

    // LRC-202-2V: Split-range Bypass Control Valve merging to T-202 Top Line
    const v2 = this.createPneumaticControlValve('LRC-202-2V', 'صمام التجاوز التبادلي', this.matValveAmber);
    v2.position.set(-25.0, 4.6, 6.0);
    p1Train.add(v2);
    this.registerInteractive(v2, 'lrc-202-2v');

    this.group.add(p1Train);
  }

  // --- Dedicated Industrial Piping Components (Y-Strainer, Check Valve, Gate Valve, Pressure Gauge) ---

  // High-Definition Industrial Y-Strainer (مصفاة سحب على شكل Y)
  private createIndustrialYStrainer(pipeRadius: number): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Y_Strainer';

    // Main horizontal barrel
    const bodyLen = pipeRadius * 3.4;
    const bodyGeo = new THREE.CylinderGeometry(pipeRadius * 1.25, pipeRadius * 1.25, bodyLen, 18);
    const body = new THREE.Mesh(bodyGeo, this.matCarbonSteelDark);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    // Flanges
    [-bodyLen / 2, bodyLen / 2].forEach((z) => {
      const flGeo = new THREE.CylinderGeometry(pipeRadius * 1.6, pipeRadius * 1.6, 0.22, 18);
      const fl = new THREE.Mesh(flGeo, this.matFlange);
      fl.rotation.x = Math.PI / 2;
      fl.position.set(0, 0, z);
      group.add(fl);
    });

    // 45-degree Angled Strainer Leg pointing downward & backward
    const legLen = pipeRadius * 2.6;
    const legGeo = new THREE.CylinderGeometry(pipeRadius * 0.95, pipeRadius * 0.85, legLen, 16);
    const leg = new THREE.Mesh(legGeo, this.matCarbonSteelDark);
    leg.rotation.x = Math.PI / 4;
    leg.position.set(0, -pipeRadius * 0.7, -pipeRadius * 0.5);
    group.add(leg);

    // Bolted Strainer Basket Clean-out Flange Cap
    const capGeo = new THREE.CylinderGeometry(pipeRadius * 1.35, pipeRadius * 1.35, 0.25, 16);
    const cap = new THREE.Mesh(capGeo, this.matFlange);
    cap.rotation.x = Math.PI / 4;
    cap.position.set(0, -pipeRadius * 1.45, -pipeRadius * 1.25);
    group.add(cap);

    // Brass Blow-off Drain Plug
    const plugGeo = new THREE.CylinderGeometry(pipeRadius * 0.35, pipeRadius * 0.35, 0.35, 12);
    const plug = new THREE.Mesh(plugGeo, this.matValveAmber);
    plug.rotation.x = Math.PI / 4;
    plug.position.set(0, -pipeRadius * 1.65, -pipeRadius * 1.45);
    group.add(plug);

    return group;
  }

  // High-Definition Industrial Swing Check Valve (صمام عدم رجوع)
  private createIndustrialCheckValve(pipeRadius: number): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Swing_Check_Valve';

    // Main vertical valve body
    const bodyH = pipeRadius * 2.8;
    const bodyGeo = new THREE.CylinderGeometry(pipeRadius * 1.4, pipeRadius * 1.4, bodyH, 18);
    const body = new THREE.Mesh(bodyGeo, this.matValveAmber);
    group.add(body);

    // Flanges
    [-bodyH / 2, bodyH / 2].forEach((y) => {
      const flGeo = new THREE.CylinderGeometry(pipeRadius * 1.7, pipeRadius * 1.7, 0.22, 18);
      const fl = new THREE.Mesh(flGeo, this.matFlange);
      fl.position.set(0, y, 0);
      group.add(fl);
    });

    // Top Inspection / Hinge Cover Bonnet
    const coverGeo = new THREE.BoxGeometry(pipeRadius * 1.9, 0.28, pipeRadius * 1.9);
    const cover = new THREE.Mesh(coverGeo, this.matFlange);
    cover.position.set(0, 0, pipeRadius * 0.9);
    group.add(cover);

    // Side Hinge Bosses
    [-pipeRadius * 1.25, pipeRadius * 1.25].forEach((x) => {
      const bossGeo = new THREE.CylinderGeometry(pipeRadius * 0.38, pipeRadius * 0.38, 0.3, 12);
      const boss = new THREE.Mesh(bossGeo, this.matCarbonSteelDark);
      boss.rotation.z = Math.PI / 2;
      boss.position.set(x, 0, 0);
      group.add(boss);
    });

    // Embossed Flow Direction Arrow (OSHA Yellow)
    const arrGeo = new THREE.ConeGeometry(pipeRadius * 0.35, pipeRadius * 0.7, 12);
    const arr = new THREE.Mesh(arrGeo, this.matYellowSafety);
    arr.position.set(0, 0, -pipeRadius * 1.35);
    group.add(arr);

    return group;
  }

  // High-Definition Flanged Gate Valve with Yellow Safety Handwheel (محبس بوابة)
  private createIndustrialGateValve(pipeRadius: number, stemDir: 'y' | 'z' | 'x' = 'z'): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Gate_Valve';

    const bodyLen = pipeRadius * 2.6;
    const bodyGeo = new THREE.CylinderGeometry(pipeRadius * 1.35, pipeRadius * 1.35, bodyLen, 18);
    const body = new THREE.Mesh(bodyGeo, this.matValveAmber);

    if (stemDir === 'z') {
      group.add(body);
    } else if (stemDir === 'y') {
      body.rotation.x = Math.PI / 2;
      group.add(body);
    } else {
      body.rotation.z = Math.PI / 2;
      group.add(body);
    }

    // Flanges
    [-bodyLen / 2, bodyLen / 2].forEach((offset) => {
      const flGeo = new THREE.CylinderGeometry(pipeRadius * 1.65, pipeRadius * 1.65, 0.22, 18);
      const fl = new THREE.Mesh(flGeo, this.matFlange);
      if (stemDir === 'z') {
        fl.position.set(0, offset, 0);
      } else if (stemDir === 'y') {
        fl.rotation.x = Math.PI / 2;
        fl.position.set(0, 0, offset);
      } else {
        fl.rotation.z = Math.PI / 2;
        fl.position.set(offset, 0, 0);
      }
      group.add(fl);
    });

    // Stem and Handwheel
    if (stemDir === 'y') {
      const stemGeo = new THREE.CylinderGeometry(0.08, 0.08, pipeRadius * 2.2, 10);
      const stem = new THREE.Mesh(stemGeo, this.matPolishedSteel);
      stem.position.set(0, pipeRadius * 1.4, 0);
      group.add(stem);

      const wheelGeo = new THREE.TorusGeometry(pipeRadius * 1.05, 0.08, 8, 20);
      const wheel = new THREE.Mesh(wheelGeo, this.matYellowSafety);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(0, pipeRadius * 2.3, 0);
      group.add(wheel);
    } else if (stemDir === 'z') {
      const stemGeo = new THREE.CylinderGeometry(0.08, 0.08, pipeRadius * 2.2, 10);
      const stem = new THREE.Mesh(stemGeo, this.matPolishedSteel);
      stem.rotation.x = Math.PI / 2;
      stem.position.set(0, 0, pipeRadius * 1.4);
      group.add(stem);

      const wheelGeo = new THREE.TorusGeometry(pipeRadius * 1.05, 0.08, 8, 20);
      const wheel = new THREE.Mesh(wheelGeo, this.matYellowSafety);
      wheel.position.set(0, 0, pipeRadius * 2.3);
      group.add(wheel);
    }

    return group;
  }

  // High-Definition Industrial Pressure Gauge Assembly (مقياس ضغط)
  private createIndustrialPressureGauge(pipeRadius: number): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Pressure_Gauge';

    const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, pipeRadius * 1.6, 8);
    const stem = new THREE.Mesh(stemGeo, this.matPolishedSteel);
    stem.rotation.x = Math.PI / 2;
    stem.position.set(0, 0, pipeRadius * 0.8);
    group.add(stem);

    const dialGeo = new THREE.CylinderGeometry(pipeRadius * 0.7, pipeRadius * 0.7, 0.16, 24);
    const dial = new THREE.Mesh(dialGeo, this.matFlange);
    dial.rotation.x = Math.PI / 2;
    dial.position.set(0, 0, pipeRadius * 1.6);
    group.add(dial);

    const faceGeo = new THREE.CircleGeometry(pipeRadius * 0.6, 24);
    const faceMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.set(0, 0, pipeRadius * 1.6 + 0.09);
    group.add(face);

    return group;
  }

  private createPneumaticControlValve(
    tag: string,
    arabicDesc: string,
    actuatorMat: THREE.Material
  ): THREE.Group {
    const valveGroup = new THREE.Group();
    valveGroup.name = tag;

    // 1. Sleek Globe Valve Body
    const bodyGeo = new THREE.CylinderGeometry(0.75, 0.75, 1.8, 20);
    const bodyMesh = new THREE.Mesh(bodyGeo, this.matCarbonSteel);
    bodyMesh.rotation.z = Math.PI / 2;
    valveGroup.add(bodyMesh);

    // Flanges
    [-0.9, 0.9].forEach((x) => {
      const flGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.25, 20);
      const fl = new THREE.Mesh(flGeo, this.matFlange);
      fl.rotation.z = Math.PI / 2;
      fl.position.set(x, 0, 0);
      valveGroup.add(fl);
    });

    // 2. Bonnet & Stem
    const bonnetGeo = new THREE.CylinderGeometry(0.4, 0.55, 0.9, 16);
    const bonnet = new THREE.Mesh(bonnetGeo, this.matCarbonSteel);
    bonnet.position.set(0, 0.7, 0);
    valveGroup.add(bonnet);

    const stemGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 12);
    const stem = new THREE.Mesh(stemGeo, this.matPolishedSteel);
    stem.position.set(0, 1.5, 0);
    valveGroup.add(stem);

    // 3. Pneumatic Diaphragm Actuator Dome
    const actGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.65, 24);
    const actuator = new THREE.Mesh(actGeo, actuatorMat);
    actuator.position.set(0, 2.2, 0);
    valveGroup.add(actuator);

    const actDomeGeo = new THREE.SphereGeometry(1.05, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const actDome = new THREE.Mesh(actDomeGeo, actuatorMat);
    actDome.position.set(0, 2.5, 0);
    valveGroup.add(actDome);

    // 4. Smart Digital Valve Positioner Box
    const posBox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.4), this.matValveBlue);
    posBox.position.set(0.55, 1.5, 0);
    valveGroup.add(posBox);

    // 5. Manual Handwheel Override
    const wheelGeo = new THREE.TorusGeometry(0.5, 0.07, 8, 20);
    const wheel = new THREE.Mesh(wheelGeo, this.matYellowSafety);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(0, 3.2, 0);
    valveGroup.add(wheel);

    return valveGroup;
  }

  /**
   * High-Fidelity Industrial API-610 End-Suction Centrifugal Pump Builder
   * Complete with spiral volute casing, axial suction nozzle, vertical tangential discharge nozzle,
   * bearing housing with oil sight glass, mechanical seal flush tubing, flexible coupling with OSHA guard,
   * and heavy ribbed TEFC electric motor with terminal box and fan cowl.
   */
  private createIndustrialEngineeredPump(options: {
    tag: string;
    arabicTitle: string;
    voluteRadius?: number;
    suctionRadius?: number;
    dischargeRadius?: number;
    motorRadius?: number;
    motorLength?: number;
    casingColor?: THREE.Material;
    suctionAxis?: 'z' | 'x';
    suctionSign?: number;
  }): THREE.Group {
    const pumpGroup = new THREE.Group();
    pumpGroup.name = options.tag;

    const vRad = options.voluteRadius || 2.4;
    const sRad = options.suctionRadius || 1.1;
    const dRad = options.dischargeRadius || 1.0;
    const mRad = options.motorRadius || 1.9;
    const mLen = options.motorLength || 4.8;
    const casingMat = options.casingColor || this.matValveGreen;

    const suctionAxis = options.suctionAxis || 'z';
    const suctionSign = options.suctionSign || -1;

    // 1. Heavy Channel Steel Baseplate with Drip Rim
    const baseLen = mLen + vRad * 2 + 5.0;
    const baseWidth = Math.max(vRad, mRad) * 2.8;
    const baseplate = new THREE.Mesh(
      new THREE.BoxGeometry(baseWidth, 0.45, baseLen),
      this.matCatwalkSteel
    );
    baseplate.position.set(0, 0.22, mLen * 0.2);
    pumpGroup.add(baseplate);

    // Drip Rim border around baseplate
    const rimMat = this.matYellowSafety;
    const rimN = new THREE.Mesh(new THREE.BoxGeometry(baseWidth, 0.15, 0.2), rimMat);
    rimN.position.set(0, 0.5, mLen * 0.2 - baseLen / 2);
    pumpGroup.add(rimN);
    const rimS = new THREE.Mesh(new THREE.BoxGeometry(baseWidth, 0.15, 0.2), rimMat);
    rimS.position.set(0, 0.5, mLen * 0.2 + baseLen / 2);
    pumpGroup.add(rimS);

    // Anchor bolts with hex nuts (4 corners)
    [
      { x: -baseWidth * 0.42, z: mLen * 0.2 - baseLen * 0.42 },
      { x: baseWidth * 0.42, z: mLen * 0.2 - baseLen * 0.42 },
      { x: -baseWidth * 0.42, z: mLen * 0.2 + baseLen * 0.42 },
      { x: baseWidth * 0.42, z: mLen * 0.2 + baseLen * 0.42 }
    ].forEach((bPos) => {
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 8), this.matStudBolt);
      bolt.position.set(bPos.x, 0.5, bPos.z);
      pumpGroup.add(bolt);
    });

    // 2. Realistic Spiral Volute Casing & Impeller Chamber
    const voluteCenter = new THREE.Vector3(0, vRad + 0.45, 0);

    // Spiral Volute Body (Sculpted cylindrical scroll with front/rear dished heads)
    const voluteGeo = new THREE.CylinderGeometry(vRad, vRad * 0.88, 2.2, 32);
    const volute = new THREE.Mesh(voluteGeo, casingMat);
    if (suctionAxis === 'z') {
      volute.rotation.x = Math.PI / 2;
    } else {
      volute.rotation.z = Math.PI / 2;
    }
    volute.position.copy(voluteCenter);
    pumpGroup.add(volute);

    // Front Volute Casing Cover with circular split flange
    const splitFlangeGeo = new THREE.CylinderGeometry(vRad * 1.15, vRad * 1.15, 0.35, 28);
    const splitFlange = new THREE.Mesh(splitFlangeGeo, this.matFlange);
    if (suctionAxis === 'z') {
      splitFlange.rotation.x = Math.PI / 2;
      splitFlange.position.set(voluteCenter.x, voluteCenter.y, voluteCenter.z + (suctionSign * 0.9));
    } else {
      splitFlange.rotation.z = Math.PI / 2;
      splitFlange.position.set(voluteCenter.x + (suctionSign * 0.9), voluteCenter.y, voluteCenter.z);
    }
    pumpGroup.add(splitFlange);

    // Flange bolt circle (12 perimeter hex bolts)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.45, 6), this.matStudBolt);
      if (suctionAxis === 'z') {
        bMesh.rotation.x = Math.PI / 2;
        bMesh.position.set(
          voluteCenter.x + Math.cos(angle) * (vRad * 1.02),
          voluteCenter.y + Math.sin(angle) * (vRad * 1.02),
          voluteCenter.z + (suctionSign * 0.9)
        );
      } else {
        bMesh.rotation.z = Math.PI / 2;
        bMesh.position.set(
          voluteCenter.x + (suctionSign * 0.9),
          voluteCenter.y + Math.sin(angle) * (vRad * 1.02),
          voluteCenter.z + Math.cos(angle) * (vRad * 1.02)
        );
      }
      pumpGroup.add(bMesh);
    }

    // Pump Casing Support Foot
    const footGeo = new THREE.BoxGeometry(vRad * 1.6, vRad * 0.45, 1.8);
    const footMesh = new THREE.Mesh(footGeo, this.matCarbonSteelDark);
    footMesh.position.set(voluteCenter.x, 0.45 + (vRad * 0.45) / 2, voluteCenter.z);
    pumpGroup.add(footMesh);

    // 3. Suction Nozzle (Axial Horizontally Oriented Inlet)
    const sucNozzleLen = 2.4;
    const sucNeckGeo = new THREE.CylinderGeometry(sRad, sRad, sucNozzleLen, 24);
    const sucNeck = new THREE.Mesh(sucNeckGeo, casingMat);
    if (suctionAxis === 'z') {
      sucNeck.rotation.x = Math.PI / 2;
      sucNeck.position.set(voluteCenter.x, voluteCenter.y, voluteCenter.z + (suctionSign * (1.1 + sucNozzleLen / 2)));
    } else {
      sucNeck.rotation.z = Math.PI / 2;
      sucNeck.position.set(voluteCenter.x + (suctionSign * (1.1 + sucNozzleLen / 2)), voluteCenter.y, voluteCenter.z);
    }
    pumpGroup.add(sucNeck);

    // Suction ASME Class 300 Weld-Neck Flange
    const sucFlangeGeo = new THREE.CylinderGeometry(sRad * 1.6, sRad * 1.6, 0.45, 24);
    const sucFlange = new THREE.Mesh(sucFlangeGeo, this.matFlange);
    if (suctionAxis === 'z') {
      sucFlange.rotation.x = Math.PI / 2;
      sucFlange.position.set(voluteCenter.x, voluteCenter.y, voluteCenter.z + (suctionSign * (1.1 + sucNozzleLen)));
    } else {
      sucFlange.rotation.z = Math.PI / 2;
      sucFlange.position.set(voluteCenter.x + (suctionSign * (1.1 + sucNozzleLen)), voluteCenter.y, voluteCenter.z);
    }
    pumpGroup.add(sucFlange);

    // Suction Stud Bolts (8 bolts)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8), this.matStudBolt);
      if (suctionAxis === 'z') {
        bMesh.rotation.x = Math.PI / 2;
        bMesh.position.set(
          voluteCenter.x + Math.cos(angle) * (sRad * 1.3),
          voluteCenter.y + Math.sin(angle) * (sRad * 1.3),
          voluteCenter.z + (suctionSign * (1.1 + sucNozzleLen))
        );
      } else {
        bMesh.rotation.z = Math.PI / 2;
        bMesh.position.set(
          voluteCenter.x + (suctionSign * (1.1 + sucNozzleLen)),
          voluteCenter.y + Math.sin(angle) * (sRad * 1.3),
          voluteCenter.z + Math.cos(angle) * (sRad * 1.3)
        );
      }
      pumpGroup.add(bMesh);
    }

    // 4. Discharge Nozzle (Vertical Tangential Top Outlet)
    const disNozzleLen = 2.4;
    const disNeckGeo = new THREE.CylinderGeometry(dRad, dRad, disNozzleLen, 24);
    const disNeck = new THREE.Mesh(disNeckGeo, casingMat);
    disNeck.position.set(voluteCenter.x, voluteCenter.y + vRad * 0.7 + disNozzleLen / 2, voluteCenter.z);
    pumpGroup.add(disNeck);

    // Discharge ASME Class 300 Flange
    const disFlangeGeo = new THREE.CylinderGeometry(dRad * 1.6, dRad * 1.6, 0.45, 24);
    const disFlange = new THREE.Mesh(disFlangeGeo, this.matFlange);
    disFlange.position.set(voluteCenter.x, voluteCenter.y + vRad * 0.7 + disNozzleLen, voluteCenter.z);
    pumpGroup.add(disFlange);

    // Discharge Stud Bolts (8 bolts)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8), this.matStudBolt);
      bMesh.position.set(
        voluteCenter.x + Math.cos(angle) * (dRad * 1.3),
        voluteCenter.y + vRad * 0.7 + disNozzleLen,
        voluteCenter.z + Math.sin(angle) * (dRad * 1.3)
      );
      pumpGroup.add(bMesh);
    }

    // 5. Bearing Bracket & Mechanical Seal Housing
    const bracketZ = suctionAxis === 'z' ? (voluteCenter.z - suctionSign * 1.8) : voluteCenter.z;
    const bracketX = suctionAxis === 'x' ? (voluteCenter.x - suctionSign * 1.8) : voluteCenter.x;
    const bearingHousingGeo = new THREE.CylinderGeometry(vRad * 0.55, vRad * 0.55, 2.2, 20);
    const bearingHousing = new THREE.Mesh(bearingHousingGeo, this.matCarbonSteel);
    if (suctionAxis === 'z') {
      bearingHousing.rotation.x = Math.PI / 2;
      bearingHousing.position.set(voluteCenter.x, voluteCenter.y, bracketZ);
    } else {
      bearingHousing.rotation.z = Math.PI / 2;
      bearingHousing.position.set(bracketX, voluteCenter.y, voluteCenter.z);
    }
    pumpGroup.add(bearingHousing);

    // Oil Level Sight Glass / Constant Level Oiler (Brass Bulb)
    const oilerGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 12);
    const oiler = new THREE.Mesh(oilerGeo, this.matValveAmber);
    if (suctionAxis === 'z') {
      oiler.position.set(voluteCenter.x + vRad * 0.6, voluteCenter.y, bracketZ);
    } else {
      oiler.position.set(bracketX, voluteCenter.y, voluteCenter.z + vRad * 0.6);
    }
    pumpGroup.add(oiler);

    // Mechanical Seal Plan 11 Flush Tubing
    const flushGeo = new THREE.TorusGeometry(vRad * 0.7, 0.06, 8, 16, Math.PI);
    const flushTube = new THREE.Mesh(flushGeo, this.matPolishedSteel);
    if (suctionAxis === 'z') {
      flushTube.rotation.y = Math.PI / 2;
      flushTube.position.set(voluteCenter.x, voluteCenter.y, voluteCenter.z - suctionSign * 0.8);
    } else {
      flushTube.position.set(voluteCenter.x - suctionSign * 0.8, voluteCenter.y, voluteCenter.z);
    }
    pumpGroup.add(flushTube);

    // 6. Drive Shaft, Flexible Spacer Coupling & Yellow OSHA Safety Guard
    const coupZ = suctionAxis === 'z' ? (bracketZ - suctionSign * 1.8) : voluteCenter.z;
    const coupX = suctionAxis === 'x' ? (bracketX - suctionSign * 1.8) : voluteCenter.x;

    // Polished Drive Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.32, 0.32, 2.8, 16);
    const shaft = new THREE.Mesh(shaftGeo, this.matPolishedSteel);
    if (suctionAxis === 'z') {
      shaft.rotation.x = Math.PI / 2;
      shaft.position.set(voluteCenter.x, voluteCenter.y, coupZ);
    } else {
      shaft.rotation.z = Math.PI / 2;
      shaft.position.set(coupX, voluteCenter.y, voluteCenter.z);
    }
    pumpGroup.add(shaft);
    this.rotatingShafts.push(shaft);

    // Yellow Safety Coupling Guard
    const guardGeo = new THREE.CylinderGeometry(vRad * 0.65, vRad * 0.65, 2.0, 20, 1, true);
    const guard = new THREE.Mesh(guardGeo, this.matYellowSafety);
    if (suctionAxis === 'z') {
      guard.rotation.x = Math.PI / 2;
      guard.position.set(voluteCenter.x, voluteCenter.y, coupZ);
    } else {
      guard.rotation.z = Math.PI / 2;
      guard.position.set(coupX, voluteCenter.y, voluteCenter.z);
    }
    pumpGroup.add(guard);

    // 7. Industrial TEFC Electric Motor with Longitudinal Cooling Fins
    const motorCenterZ = suctionAxis === 'z' ? (coupZ - suctionSign * (mLen / 2 + 1.0)) : voluteCenter.z;
    const motorCenterX = suctionAxis === 'x' ? (coupX - suctionSign * (mLen / 2 + 1.0)) : voluteCenter.x;

    // Stator Body Core
    const motorStatorGeo = new THREE.CylinderGeometry(mRad, mRad, mLen, 32);
    const motorStator = new THREE.Mesh(motorStatorGeo, this.matCatwalkSteel);
    if (suctionAxis === 'z') {
      motorStator.rotation.x = Math.PI / 2;
      motorStator.position.set(voluteCenter.x, voluteCenter.y, motorCenterZ);
    } else {
      motorStator.rotation.z = Math.PI / 2;
      motorStator.position.set(motorCenterX, voluteCenter.y, voluteCenter.z);
    }
    pumpGroup.add(motorStator);

    // 16 Axial Cooling Ribs on Stator Frame
    for (let f = 0; f < 16; f++) {
      const angle = (f / 16) * Math.PI * 2;
      const finGeo = new THREE.BoxGeometry(0.12, mLen * 0.85, 0.35);
      const fin = new THREE.Mesh(finGeo, this.matCarbonSteelDark);
      if (suctionAxis === 'z') {
        fin.rotation.x = Math.PI / 2;
        fin.position.set(
          voluteCenter.x + Math.cos(angle) * (mRad + 0.15),
          voluteCenter.y + Math.sin(angle) * (mRad + 0.15),
          motorCenterZ
        );
      } else {
        fin.rotation.z = Math.PI / 2;
        fin.position.set(
          motorCenterX,
          voluteCenter.y + Math.sin(angle) * (mRad + 0.15),
          voluteCenter.z + Math.cos(angle) * (mRad + 0.15)
        );
      }
      pumpGroup.add(fin);
    }

    // Rear Fan Cowl (غلاف مروحة التبريد)
    const fanCowlGeo = new THREE.CylinderGeometry(mRad * 0.98, mRad * 0.98, 1.2, 28);
    const fanCowl = new THREE.Mesh(fanCowlGeo, this.matYellowSafety);
    if (suctionAxis === 'z') {
      fanCowl.rotation.x = Math.PI / 2;
      fanCowl.position.set(voluteCenter.x, voluteCenter.y, motorCenterZ - suctionSign * (mLen / 2 + 0.6));
    } else {
      fanCowl.rotation.z = Math.PI / 2;
      fanCowl.position.set(motorCenterX - suctionSign * (mLen / 2 + 0.6), voluteCenter.y, voluteCenter.z);
    }
    pumpGroup.add(fanCowl);

    // Terminal Junction Box on Top of Motor Frame
    const termBoxGeo = new THREE.BoxGeometry(mRad * 0.9, 1.1, mRad * 0.8);
    const termBox = new THREE.Mesh(termBoxGeo, this.matValveAmber);
    if (suctionAxis === 'z') {
      termBox.position.set(voluteCenter.x + mRad * 0.75, voluteCenter.y + mRad * 0.65, motorCenterZ);
    } else {
      termBox.position.set(motorCenterX, voluteCenter.y + mRad * 0.65, voluteCenter.z + mRad * 0.75);
    }
    pumpGroup.add(termBox);

    // Motor Feet
    const mFootGeo = new THREE.BoxGeometry(mRad * 2.2, (voluteCenter.y - mRad) + 0.45, mLen * 0.7);
    const mFoot = new THREE.Mesh(mFootGeo, this.matCarbonSteelDark);
    if (suctionAxis === 'z') {
      mFoot.position.set(voluteCenter.x, ((voluteCenter.y - mRad) + 0.45) / 2, motorCenterZ);
    } else {
      mFoot.position.set(motorCenterX, ((voluteCenter.y - mRad) + 0.45) / 2, voluteCenter.z);
    }
    pumpGroup.add(mFoot);

    return pumpGroup;
  }

  // 3D Flow Chevron Arrow Cones pointing along a pipe segment
  private createFlowChevronArrows(
    start: THREE.Vector3,
    end: THREE.Vector3,
    count: number,
    color: number,
    coneRadius: number = 0.5,
    coneHeight: number = 0.8
  ): THREE.Group {
    const group = new THREE.Group();
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();
    if (len < 0.1) return group;

    const normDir = dir.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion();
    if (Math.abs(normDir.dot(up)) < 0.999) {
      quat.setFromUnitVectors(up, normDir);
    } else if (normDir.y < 0) {
      quat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    }

    const mat = new THREE.MeshBasicMaterial({ color: color });
    const geo = new THREE.ConeGeometry(coneRadius, coneHeight, 16);

    for (let i = 1; i <= count; i++) {
      const t = i / (count + 1);
      const pos = new THREE.Vector3().lerpVectors(start, end, t);
      const cone = new THREE.Mesh(geo, mat);
      cone.position.copy(pos);
      cone.quaternion.copy(quat);
      group.add(cone);
    }

    return group;
  }

  // 3D Flow Indicator Badge (Arabic & English)
  private createPipingFlowBadge(textAr: string, textEn: string, arrowSymbol: string, colorHex: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.fillRect(0, 0, 512, 160);
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 5;
    ctx.strokeRect(4, 4, 504, 152);

    ctx.fillStyle = colorHex;
    ctx.font = 'bold 36px "Tajawal", "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${arrowSymbol} ${textAr}`, 256, 62);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(textEn, 256, 120);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(4.2, 1.3, 1);
    return sprite;
  }

  // Helper to build realistic Suction & Discharge Manifolds for dual pump skids (A/B)
  // Provides clean, unmistakable visual separation between low-elevation Suction lines and elevated Overhead Discharge lines.
  private createDualPumpManifoldRig(options: {
    skidGroup: THREE.Group;
    pumpOffsets: number[]; // e.g. [-5.5, 5.5]
    suctionAxis: 'x' | 'z';
    suctionSign: number; // -1: towards -Z/-X, +1: towards +Z/+X
    pumpBaseY?: number; // base Y elevation where pump is mounted (e.g. 1.4 or 1.6)
    suctionElevation?: number; // Y elevation of suction header (defaults to pump suction centerline)
    suctionHeaderOffset: number; // offset along axis from pump center (e.g. -8.0)
    suctionRadius: number;
    suctionMaterial: THREE.Material;
    dischargeElevation?: number; // Y elevation of overhead discharge header (defaults safely above pump)
    dischargeHeaderOffset: number; // offset along axis for overhead header (e.g. +5.0)
    dischargeRadius: number;
    dischargeMaterial: THREE.Material;
    voluteRadius: number;
    voluteCenterY?: number;
    headerSpanExtra?: number;
    fluidNameAr?: string;
    fluidNameEn?: string;
    flowColor?: number;
    worldPos?: THREE.Vector3;
  }) {
    const {
      skidGroup,
      pumpOffsets,
      suctionAxis,
      suctionSign,
      pumpBaseY = 1.4,
      suctionHeaderOffset,
      suctionRadius,
      suctionMaterial,
      dischargeHeaderOffset,
      dischargeRadius,
      dischargeMaterial,
      voluteRadius,
      headerSpanExtra = 3.5,
      fluidNameAr = 'السائل',
      fluidNameEn = 'PROCESS FLUID',
      flowColor = 0x38bdf8,
      worldPos
    } = options;

    const computedVoluteY = options.voluteCenterY ?? (pumpBaseY + 1.2 + voluteRadius * 1.05);
    const suctionElevation = options.suctionElevation ?? computedVoluteY;
    const pumpDischargeFlangeTop = computedVoluteY + voluteRadius * 0.7 + 2.4;
    const dischargeElevation = options.dischargeElevation ?? (pumpDischargeFlangeTop + 3.8);

    const minOff = Math.min(...pumpOffsets) - headerSpanExtra;
    const maxOff = Math.max(...pumpOffsets) + headerSpanExtra;
    const headerLen = maxOff - minOff;
    const headerMid = (minOff + maxOff) / 2;

    if (suctionAxis === 'z') {
      // =========================================================================
      // 1. SUCTION MANIFOLD (Low-Elevation Header along X in front of pumps)
      // =========================================================================
      const sucHeaderGeo = new THREE.CylinderGeometry(suctionRadius, suctionRadius, headerLen, 24);
      const sucHeader = new THREE.Mesh(sucHeaderGeo, suctionMaterial);
      sucHeader.rotation.z = Math.PI / 2;
      sucHeader.position.set(headerMid, suctionElevation, suctionHeaderOffset);
      skidGroup.add(sucHeader);

      // Blind flanges at both ends of suction header
      [minOff, maxOff].forEach((xEnd) => {
        const bFlange = new THREE.Mesh(
          new THREE.CylinderGeometry(suctionRadius * 1.5, suctionRadius * 1.5, 0.4, 20),
          this.matFlange
        );
        bFlange.rotation.z = Math.PI / 2;
        bFlange.position.set(xEnd, suctionElevation, suctionHeaderOffset);
        skidGroup.add(bFlange);
      });

      // Ground support stanchions for suction header
      [minOff + 1.5, maxOff - 1.5].forEach((xSt) => {
        const stMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.35, suctionElevation, 0.35),
          this.matCatwalkSteel
        );
        stMesh.position.set(xSt, suctionElevation / 2, suctionHeaderOffset);
        skidGroup.add(stMesh);
      });

      // Flow direction arrows on suction header
      const sucHArr = this.createFlowChevronArrows(
        new THREE.Vector3(minOff + 1.0, suctionElevation, suctionHeaderOffset),
        new THREE.Vector3(maxOff - 1.0, suctionElevation, suctionHeaderOffset),
        4,
        flowColor,
        suctionRadius * 0.7,
        0.8
      );
      skidGroup.add(sucHArr);

      // For each pump: branch towards pump suction nozzle, suction isolation gate valve, Y-strainer & FLOW ARROWS
      pumpOffsets.forEach((xOff) => {
        const flangeZ = suctionSign * 3.5;
        const branchLen = Math.abs(suctionHeaderOffset - flangeZ);
        const branchMidZ = (suctionHeaderOffset + flangeZ) / 2;

        // Branch pipe connecting directly into pump suction nozzle
        const brGeo = new THREE.CylinderGeometry(suctionRadius * 0.95, suctionRadius * 0.95, branchLen, 20);
        const brPipe = new THREE.Mesh(brGeo, suctionMaterial);
        brPipe.rotation.x = Math.PI / 2;
        brPipe.position.set(xOff, suctionElevation, branchMidZ);
        skidGroup.add(brPipe);

        // Suction Isolation Gate Valve Body (Amber with yellow handwheel)
        const vZ = suctionHeaderOffset + (flangeZ - suctionHeaderOffset) * 0.35;
        const gate = this.createIndustrialGateValve(suctionRadius, 'y');
        gate.position.set(xOff, suctionElevation, vZ);
        skidGroup.add(gate);

        // Prominent Y-Strainer before pump suction flange
        const yZ = suctionHeaderOffset + (flangeZ - suctionHeaderOffset) * 0.72;
        const strainer = this.createIndustrialYStrainer(suctionRadius);
        strainer.position.set(xOff, suctionElevation, yZ);
        skidGroup.add(strainer);

        // 3D Flow Arrows pointing INTO the pump suction nozzle
        const sucArrowStart = new THREE.Vector3(xOff, suctionElevation, suctionHeaderOffset);
        const sucArrowEnd = new THREE.Vector3(xOff, suctionElevation, flangeZ);
        const sucArrows = this.createFlowChevronArrows(
          sucArrowStart,
          sucArrowEnd,
          3,
          flowColor,
          suctionRadius * 0.65,
          0.7
        );
        skidGroup.add(sucArrows);
      });

      // =========================================================================
      // 2. DISCHARGE MANIFOLD (Elevated Overhead Header along X)
      // =========================================================================
      const disHeaderGeo = new THREE.CylinderGeometry(dischargeRadius, dischargeRadius, headerLen, 24);
      const disHeader = new THREE.Mesh(disHeaderGeo, dischargeMaterial);
      disHeader.rotation.z = Math.PI / 2;
      disHeader.position.set(headerMid, dischargeElevation, dischargeHeaderOffset);
      skidGroup.add(disHeader);

      // Blind flange at one end of overhead header
      const disBlind = new THREE.Mesh(
        new THREE.CylinderGeometry(dischargeRadius * 1.5, dischargeRadius * 1.5, 0.4, 20),
        this.matFlange
      );
      disBlind.rotation.z = Math.PI / 2;
      disBlind.position.set(minOff, dischargeElevation, dischargeHeaderOffset);
      skidGroup.add(disBlind);

      // Heavy Structural Stanchions for overhead header
      [minOff + 1.2, maxOff - 1.2].forEach((xSt) => {
        const colMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.45, dischargeElevation, 0.45),
          this.matCatwalkSteel
        );
        colMesh.position.set(xSt, dischargeElevation / 2, dischargeHeaderOffset);
        skidGroup.add(colMesh);
      });

      // Flow direction arrows on overhead discharge header
      const disHArr = this.createFlowChevronArrows(
        new THREE.Vector3(minOff + 1.0, dischargeElevation, dischargeHeaderOffset),
        new THREE.Vector3(maxOff - 1.0, dischargeElevation, dischargeHeaderOffset),
        4,
        flowColor,
        dischargeRadius * 0.7,
        0.8
      );
      skidGroup.add(disHArr);

      // For each pump: vertical riser straight out of top nozzle, swing check valve, gate valve, pressure gauge & FLOW ARROWS
      pumpOffsets.forEach((xOff) => {
        const riserStartY = pumpDischargeFlangeTop;
        const riserLen = Math.max(0.5, dischargeElevation - riserStartY);
        const riserMidY = (riserStartY + dischargeElevation) / 2;

        // Vertical riser spool emerging from top discharge flange
        const rGeo = new THREE.CylinderGeometry(dischargeRadius * 0.95, dischargeRadius * 0.95, riserLen, 20);
        const rPipe = new THREE.Mesh(rGeo, dischargeMaterial);
        rPipe.position.set(xOff, riserMidY, 0);
        skidGroup.add(rPipe);

        // Prominent Swing Check Valve (صمام عدم رجوع)
        const chkY = riserStartY + riserLen * 0.25;
        const chk = this.createIndustrialCheckValve(dischargeRadius);
        chk.position.set(xOff, chkY, 0);
        skidGroup.add(chk);

        // Pressure Gauge Indicator Assembly (مقياس ضغط الطرد)
        const pgy = riserStartY + riserLen * 0.5;
        const pg = this.createIndustrialPressureGauge(dischargeRadius);
        pg.position.set(xOff + dischargeRadius * 0.9, pgy, 0);
        skidGroup.add(pg);

        // Flanged Discharge Gate Valve (محبس طرد)
        const dvy = riserStartY + riserLen * 0.75;
        const dv = this.createIndustrialGateValve(dischargeRadius, 'z');
        dv.position.set(xOff, dvy, 0);
        skidGroup.add(dv);

        // 3D Flow Arrows pointing UPWARDS out of the pump top
        const disArrowStart = new THREE.Vector3(xOff, riserStartY + 0.3, 0);
        const disArrowEnd = new THREE.Vector3(xOff, dischargeElevation - 0.3, 0);
        const disArrows = this.createFlowChevronArrows(
          disArrowStart,
          disArrowEnd,
          3,
          flowColor,
          dischargeRadius * 0.65,
          0.7
        );
        skidGroup.add(disArrows);

        // Overhead 90° turn spool to header
        const runLen = Math.abs(dischargeHeaderOffset);
        const topTurnGeo = new THREE.CylinderGeometry(dischargeRadius * 0.95, dischargeRadius * 0.95, runLen, 16);
        const topTurn = new THREE.Mesh(topTurnGeo, dischargeMaterial);
        topTurn.rotation.x = Math.PI / 2;
        topTurn.position.set(xOff, dischargeElevation, dischargeHeaderOffset / 2);
        skidGroup.add(topTurn);

        // Turn arrows
        const turnArrowStart = new THREE.Vector3(xOff, dischargeElevation, 0.3);
        const turnArrowEnd = new THREE.Vector3(xOff, dischargeElevation, dischargeHeaderOffset - 0.3);
        const turnArrows = this.createFlowChevronArrows(
          turnArrowStart,
          turnArrowEnd,
          2,
          flowColor,
          dischargeRadius * 0.65,
          0.7
        );
        skidGroup.add(turnArrows);

        // Individual Dynamic Animated Flow Stream through the pump!
        if (worldPos) {
          const pumpPath = new THREE.CurvePath<THREE.Vector3>();
          const flangeZ = suctionSign * 3.5;
          const pt0 = new THREE.Vector3(worldPos.x + headerMid, suctionElevation, worldPos.z + suctionHeaderOffset);
          const pt1 = new THREE.Vector3(worldPos.x + xOff, suctionElevation, worldPos.z + suctionHeaderOffset);
          const pt2 = new THREE.Vector3(worldPos.x + xOff, suctionElevation, worldPos.z + flangeZ);
          const pt3 = new THREE.Vector3(worldPos.x + xOff, computedVoluteY, worldPos.z);
          const pt4 = new THREE.Vector3(worldPos.x + xOff, riserStartY, worldPos.z);
          const pt5 = new THREE.Vector3(worldPos.x + xOff, dischargeElevation, worldPos.z);
          const pt6 = new THREE.Vector3(worldPos.x + xOff, dischargeElevation, worldPos.z + dischargeHeaderOffset);
          pumpPath.add(new THREE.LineCurve3(pt0, pt1));
          pumpPath.add(new THREE.LineCurve3(pt1, pt2));
          pumpPath.add(new THREE.LineCurve3(pt2, pt3));
          pumpPath.add(new THREE.LineCurve3(pt3, pt4));
          pumpPath.add(new THREE.LineCurve3(pt4, pt5));
          pumpPath.add(new THREE.LineCurve3(pt5, pt6));
          this.addParticleFlowStream(pumpPath, flowColor, 0.08);
        }
      });
    } else {
      // Suction Axis X fallback
      const sucHeaderGeo = new THREE.CylinderGeometry(suctionRadius, suctionRadius, headerLen, 24);
      const sucHeader = new THREE.Mesh(sucHeaderGeo, suctionMaterial);
      sucHeader.rotation.x = Math.PI / 2;
      sucHeader.position.set(suctionHeaderOffset, suctionElevation, headerMid);
      skidGroup.add(sucHeader);

      pumpOffsets.forEach((zOff) => {
        const flangeX = suctionSign * 3.5;
        const branchLen = Math.abs(suctionHeaderOffset - flangeX);
        const branchMidX = (suctionHeaderOffset + flangeX) / 2;

        const brGeo = new THREE.CylinderGeometry(suctionRadius * 0.95, suctionRadius * 0.95, branchLen, 20);
        const brPipe = new THREE.Mesh(brGeo, suctionMaterial);
        brPipe.rotation.z = Math.PI / 2;
        brPipe.position.set(branchMidX, suctionElevation, zOff);
        skidGroup.add(brPipe);

        const rLen = Math.max(0.5, dischargeElevation - pumpDischargeFlangeTop);
        const rPipe = new THREE.Mesh(
          new THREE.CylinderGeometry(dischargeRadius * 0.95, dischargeRadius * 0.95, rLen, 20),
          dischargeMaterial
        );
        rPipe.position.set(0, (pumpDischargeFlangeTop + dischargeElevation) / 2, zOff);
        skidGroup.add(rPipe);
      });
    }
  }

  // Helper to build realistic Suction & Discharge Manifold for Single Pump Skids (e.g. P-207)
  private createSinglePumpManifoldRig(options: {
    skidGroup: THREE.Group;
    pumpOffset?: number;
    suctionAxis: 'x' | 'z';
    suctionSign: number;
    pumpBaseY?: number;
    suctionElevation?: number;
    suctionHeaderOffset: number; // e.g. -7.0
    suctionRadius: number;
    suctionMaterial: THREE.Material;
    dischargeElevation?: number; // e.g. 10.5
    dischargeHeaderOffset: number; // e.g. 4.0
    dischargeRadius: number;
    dischargeMaterial: THREE.Material;
    voluteRadius: number;
    fluidNameAr?: string;
    fluidNameEn?: string;
    flowColor?: number;
    worldPos?: THREE.Vector3;
  }) {
    const {
      skidGroup,
      pumpOffset = 0,
      suctionSign,
      pumpBaseY = 1.2,
      suctionHeaderOffset,
      suctionRadius,
      suctionMaterial,
      dischargeHeaderOffset,
      dischargeRadius,
      dischargeMaterial,
      voluteRadius,
      flowColor = 0x38bdf8,
      worldPos
    } = options;

    const computedVoluteY = pumpBaseY + 1.2 + voluteRadius * 1.05;
    const suctionElevation = options.suctionElevation ?? computedVoluteY;
    const pumpDischargeFlangeTop = computedVoluteY + voluteRadius * 0.7 + 2.4;
    const dischargeElevation = options.dischargeElevation ?? (pumpDischargeFlangeTop + 3.5);

    const flangeZ = suctionSign * 3.5;
    const branchLen = Math.abs(suctionHeaderOffset - flangeZ);
    const branchMidZ = (suctionHeaderOffset + flangeZ) / 2;

    // 1. Horizontal Suction Line entering into pump suction nozzle
    const sucPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(suctionRadius, suctionRadius, branchLen, 20),
      suctionMaterial
    );
    sucPipe.rotation.x = Math.PI / 2;
    sucPipe.position.set(pumpOffset, suctionElevation, branchMidZ);
    skidGroup.add(sucPipe);

    // Suction Isolation Gate Valve Body & Handwheel
    const vZ = suctionHeaderOffset + (flangeZ - suctionHeaderOffset) * 0.35;
    const gate = this.createIndustrialGateValve(suctionRadius, 'y');
    gate.position.set(pumpOffset, suctionElevation, vZ);
    skidGroup.add(gate);

    // Prominent Y-Strainer
    const yZ = suctionHeaderOffset + (flangeZ - suctionHeaderOffset) * 0.72;
    const strainer = this.createIndustrialYStrainer(suctionRadius);
    strainer.position.set(pumpOffset, suctionElevation, yZ);
    skidGroup.add(strainer);

    // Suction Flow Direction Arrows pointing INTO suction nozzle
    const sucArrows = this.createFlowChevronArrows(
      new THREE.Vector3(pumpOffset, suctionElevation, suctionHeaderOffset),
      new THREE.Vector3(pumpOffset, suctionElevation, flangeZ),
      3,
      flowColor,
      suctionRadius * 0.65,
      0.7
    );
    skidGroup.add(sucArrows);

    // 2. Vertical Discharge Riser rising from TOP nozzle of pump volute
    const riserStartY = pumpDischargeFlangeTop;
    const riserLen = Math.max(0.5, dischargeElevation - riserStartY);
    const riserMidY = (riserStartY + dischargeElevation) / 2;

    const rPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(dischargeRadius, dischargeRadius, riserLen, 20),
      dischargeMaterial
    );
    rPipe.position.set(pumpOffset, riserMidY, 0);
    skidGroup.add(rPipe);

    // Prominent Swing Check Valve
    const chkY = riserStartY + riserLen * 0.25;
    const chk = this.createIndustrialCheckValve(dischargeRadius);
    chk.position.set(pumpOffset, chkY, 0);
    skidGroup.add(chk);

    // Pressure Gauge
    const pgy = riserStartY + riserLen * 0.5;
    const pg = this.createIndustrialPressureGauge(dischargeRadius);
    pg.position.set(pumpOffset + dischargeRadius * 0.9, pgy, 0);
    skidGroup.add(pg);

    // Discharge Gate Valve
    const dvy = riserStartY + riserLen * 0.75;
    const dv = this.createIndustrialGateValve(dischargeRadius, 'z');
    dv.position.set(pumpOffset, dvy, 0);
    skidGroup.add(dv);

    // 3D Flow Arrows pointing UPWARDS
    const disArrows = this.createFlowChevronArrows(
      new THREE.Vector3(pumpOffset, riserStartY + 0.3, 0),
      new THREE.Vector3(pumpOffset, dischargeElevation - 0.3, 0),
      3,
      flowColor,
      dischargeRadius * 0.65,
      0.7
    );
    skidGroup.add(disArrows);

    // Turn to overhead line
    const runLen = Math.abs(dischargeHeaderOffset);
    const topTurn = new THREE.Mesh(
      new THREE.CylinderGeometry(dischargeRadius, dischargeRadius, runLen, 16),
      dischargeMaterial
    );
    topTurn.rotation.x = Math.PI / 2;
    topTurn.position.set(pumpOffset, dischargeElevation, dischargeHeaderOffset / 2);
    skidGroup.add(topTurn);

    // Animated particle stream
    if (worldPos) {
      const pumpPath = new THREE.CurvePath<THREE.Vector3>();
      const pt0 = new THREE.Vector3(worldPos.x + pumpOffset, suctionElevation, worldPos.z + suctionHeaderOffset);
      const pt1 = new THREE.Vector3(worldPos.x + pumpOffset, suctionElevation, worldPos.z + flangeZ);
      const pt2 = new THREE.Vector3(worldPos.x + pumpOffset, computedVoluteY, worldPos.z);
      const pt3 = new THREE.Vector3(worldPos.x + pumpOffset, riserStartY, worldPos.z);
      const pt4 = new THREE.Vector3(worldPos.x + pumpOffset, dischargeElevation, worldPos.z);
      const pt5 = new THREE.Vector3(worldPos.x + pumpOffset, dischargeElevation, worldPos.z + dischargeHeaderOffset);
      pumpPath.add(new THREE.LineCurve3(pt0, pt1));
      pumpPath.add(new THREE.LineCurve3(pt1, pt2));
      pumpPath.add(new THREE.LineCurve3(pt2, pt3));
      pumpPath.add(new THREE.LineCurve3(pt3, pt4));
      pumpPath.add(new THREE.LineCurve3(pt4, pt5));
      this.addParticleFlowStream(pumpPath, flowColor, 0.08);
    }
  }

  // 6. E-207: Semi-Lean Solution Cooler at (-35, 11.5, +65)
  private buildSemiLeanCoolerE207() {
    // Elevated Platform Structure with Access Stairs (Deck at Y = 6.0m)
    const e207Platform = this.createElevatedPlatformWithStairs({
      widthX: 30.0,
      lengthZ: 16.0,
      deckHeight: 6.0,
      stairSide: 'north',
      stairOffset: 0
    });
    e207Platform.position.set(-35, 0, 65);
    this.group.add(e207Platform);

    // E-207 Horizontal Shell elevated on platform at Y = 11.5m (oriented along X axis from X=-47 to X=-23)
    const e207 = this.createHorizontalShell(9.0, 24.0, this.matCarbonSteel);
    e207.position.set(-35, 11.5, 65);
    e207.name = 'E-207';

    // Tube-Side Inlet Nozzle on Right Channel Head (from P-201A discharge): at X = +12.0 in shell -> world X = -23.0, nozzle points in +X with length 3.0 -> flange at X = -20.0, Z = 65.0
    this.addNozzleWithFlange(e207, new THREE.Vector3(12.0, 0, 0), new THREE.Vector3(1, 0, 0), 0.55, 3.0);

    // Tube-Side Outlet Nozzle on Left Channel Head (to T-201 Mid Bed): at X = -12.0 in shell -> world X = -47.0, nozzle points in -X with length 3.0 -> flange at X = -50.0, Z = 65.0
    this.addNozzleWithFlange(e207, new THREE.Vector3(-12.0, 0, 0), new THREE.Vector3(-1, 0, 0), 0.55, 3.0);

    // Cooling Water Outlet Nozzle (top vertical) + Return pipe spool
    this.addNozzleWithFlange(e207, new THREE.Vector3(0, 4.5, 0), new THREE.Vector3(0, 1, 0), 0.5, 2.0);
    const cwOutSpool = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4.0, 16), this.matValveBlue);
    cwOutSpool.position.set(0, 7.5, 0);
    e207.add(cwOutSpool);

    // Cooling Water Inlet Nozzle (bottom vertical) + Supply pipe spool
    this.addNozzleWithFlange(e207, new THREE.Vector3(0, -4.5, 0), new THREE.Vector3(0, -1, 0), 0.5, 2.0);
    const cwInSpool = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4.5, 16), this.matValveBlue);
    cwInSpool.position.set(0, -7.5, 0);
    e207.add(cwInSpool);

    this.registerInteractive(e207, 'e-207');
    this.group.add(e207);
  }

  // 7. Zone A (North Line): T-202 Catacarb CO2 Regenerator / Stripper Tower at (+65, 0, -60)
  // Colossal Column: Height 88m, Radius 7.5m, 110m clear spacing from T-201, Multi-tier Catwalks
  private buildCatacarbRegeneratorColumnT202() {
    const t2Group = new THREE.Group();
    t2Group.position.set(65, 0, -60);
    t2Group.name = 'T-202';

    // Octagonal Foundation Pedestal
    const footGeo = new THREE.CylinderGeometry(13.0, 15.0, 4.0, 8);
    const foot = new THREE.Mesh(footGeo, this.matConcretePad);
    foot.position.set(0, 2.0, 0);
    t2Group.add(foot);

    // Support Skirt
    const skirtGeo = new THREE.CylinderGeometry(7.5, 8.5, 10.0, 36, 1, true);
    const skirt = new THREE.Mesh(skirtGeo, this.matCarbonSteel);
    skirt.position.set(0, 9.0, 0);
    t2Group.add(skirt);

    // Main Column Shell (Height 64m, Radius 7.5m)
    const shellGeo = new THREE.CylinderGeometry(7.5, 7.5, 64.0, 40);
    const shell = new THREE.Mesh(shellGeo, this.matCarbonSteel);
    shell.position.set(0, 46.0, 0);
    t2Group.add(shell);

    // Dished Heads
    const domeGeo = new THREE.SphereGeometry(7.5, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const topDome = new THREE.Mesh(domeGeo, this.matCarbonSteel);
    topDome.position.set(0, 78.0, 0);
    t2Group.add(topDome);

    const botDome = new THREE.Mesh(domeGeo, this.matCarbonSteel);
    botDome.rotation.x = Math.PI;
    botDome.position.set(0, 14.0, 0);
    t2Group.add(botDome);

    // Catwalk Galleries & Stripping Bed Bands
    const bedElevations = [24.0, 42.0, 58.0, 72.0];
    bedElevations.forEach((y) => {
      const ringGeo = new THREE.CylinderGeometry(7.55, 7.55, 9.0, 40, 1, true);
      const ring = new THREE.Mesh(ringGeo, this.matPackingMesh);
      ring.position.set(0, y, 0);
      t2Group.add(ring);

      const platGeo = new THREE.CylinderGeometry(10.0, 10.0, 0.4, 40);
      const plat = new THREE.Mesh(platGeo, this.matCatwalkSteel);
      plat.position.set(0, y + 4.5, 0);
      t2Group.add(plat);

      const railGeo = new THREE.TorusGeometry(9.9, 0.12, 8, 40);
      const rail = new THREE.Mesh(railGeo, this.matYellowSafety);
      rail.rotation.x = Math.PI / 2;
      rail.position.set(0, y + 6.1, 0);
      t2Group.add(rail);
    });

    // Spiral Staircase
    const steps = 140;
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 10.0;
      const y = 14.0 + (i / steps) * 64.0;
      const stepGeo = new THREE.BoxGeometry(2.3, 0.18, 0.8);
      const step = new THREE.Mesh(stepGeo, this.matCatwalkSteel);
      step.position.set(Math.cos(angle) * 9.0, y, Math.sin(angle) * 9.0);
      step.rotation.y = -angle;
      t2Group.add(step);
    }

    // Nozzles - Strictly Separated with Real Industrial Azimuths & Pure Orthogonal Alignment
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(0, 74.0, 7.6), new THREE.Vector3(0, 0, 1), 1.4, 3.4); // Top Flash In from P-201HT (South Azimuth - Flange at (65.0, 74.0, -49.0))
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(7.6, 78.0, 0), new THREE.Vector3(1, 0, 0), 1.1, 3.4); // Top Reflux In from P-203 (East Azimuth - Flange at (76.0, 78.0, -60.0))
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(-7.6, 44.0, 0), new THREE.Vector3(-1, 0, 0), 1.4, 3.4); // Semi-Lean Draw to P-201 (West Azimuth - Flange at (54.0, 44.0, -60.0))
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(0, 86.0, 0), new THREE.Vector3(0, 1, 0), 1.5, 4.0); // Stream 4 Acid Gas Out (Top Dome - Flange at (65.0, 90.0, -60.0))
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(0, 6.0, 7.6), new THREE.Vector3(0, 0, 1), 1.4, 3.4); // Lean Sol'n Bottom Out to E-204 (South Azimuth - Flange at (65.0, 6.0, -49.0))
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(0, 14.0, -7.6), new THREE.Vector3(0, 0, -1), 1.3, 3.4); // Reboiler 1 Draw to E-201 (North/Rear Azimuth - Flange at (65.0, 14.0, -71.0))
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(0, 26.0, -7.6), new THREE.Vector3(0, 0, -1), 1.3, 3.4); // Reboiler 1 Return from E-201 (North/Rear Azimuth - Flange at (65.0, 26.0, -71.0))
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(7.6, 14.0, 0), new THREE.Vector3(1, 0, 0), 1.2, 3.4); // Reboiler 2 Draw to E-202 (East Azimuth - Flange at (76.0, 14.0, -60.0))
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(7.6, 26.0, 0), new THREE.Vector3(1, 0, 0), 1.2, 3.4); // Reboiler 2 Return from E-202 (East Azimuth - Flange at (76.0, 26.0, -60.0))

    this.registerInteractive(t2Group, 't-202');
    this.group.add(t2Group);
  }

  // 8. Zone D: Reboiler Thermosiphon Auxiliary Train (East / North-East)
  // E-202 at (+115, 13.5, -60), V-208 at (+115, 3.5, -25), P-207 at (+115, 0, -12)
  private buildReboilerThermosiphonTrains() {
    // E-202 Elevated Table Platform Structure with Stairs (Deck at Y = 8.0m)
    const e202Platform = this.createElevatedPlatformWithStairs({
      widthX: 30.0,
      lengthZ: 16.0,
      deckHeight: 8.0,
      stairSide: 'south',
      stairOffset: 0
    });
    e202Platform.position.set(115, 0, -60);
    this.group.add(e202Platform);

    // E-202: Steam Reboiler (LP Steam Heated: Dia 9.5m, Length 24m, Elevated at Y = 13.5m)
    const e202 = this.createHorizontalShell(9.5, 24.0, this.matCarbonSteel);
    e202.position.set(115, 13.5, -60);
    e202.name = 'E-202';

    this.addNozzleWithFlange(e202, new THREE.Vector3(-12.0, 0, 0), new THREE.Vector3(-1, 0, 0), 1.2, 3.0); // LP Steam In
    this.addNozzleWithFlange(e202, new THREE.Vector3(12.0, 0, 0), new THREE.Vector3(1, 0, 0), 0.9, 2.4); // Condensate Out to V-208
    this.addNozzleWithFlange(e202, new THREE.Vector3(0, 5.0, 0), new THREE.Vector3(0, 1, 0), 1.3, 2.8); // Vapor Return to T-202
    this.addNozzleWithFlange(e202, new THREE.Vector3(0, -5.0, 0), new THREE.Vector3(0, -1, 0), 1.3, 2.8); // Liquid In from T-202

    this.registerInteractive(e202, 'e-202');
    this.group.add(e202);

    // V-208: Steam Condensate Recovery Drum at (+115, 3.5, -25)
    const v208 = this.createHorizontalShell(5.0, 10.0, this.matCarbonSteel);
    v208.position.set(115, 3.5, -25);
    v208.name = 'V-208';
    this.addNozzleWithFlange(v208, new THREE.Vector3(-5.0, 0, 0), new THREE.Vector3(-1, 0, 0), 0.8, 2.0);
    this.addNozzleWithFlange(v208, new THREE.Vector3(5.0, 0, 0), new THREE.Vector3(1, 0, 0), 0.8, 2.0);
    this.registerInteractive(v208, 'v-208');
    this.group.add(v208);

    // P-207: Steam Condensate Recovery Pump at (+115, 0, -12)
    const p207Group = new THREE.Group();
    p207Group.position.set(115, 0, -12);
    p207Group.name = 'P-207';

    const p207Pad = new THREE.Mesh(new THREE.BoxGeometry(12.0, 1.2, 8.0), this.matConcretePad);
    p207Pad.position.set(0, 0.6, 0);
    p207Group.add(p207Pad);

    const pump207 = this.createIndustrialEngineeredPump({
      tag: 'P-207',
      arabicTitle: 'مضخة متكثف البخار P-207',
      voluteRadius: 1.5,
      suctionRadius: 0.6,
      dischargeRadius: 0.6,
      motorRadius: 1.2,
      motorLength: 2.8,
      casingColor: this.matValveBlue,
      suctionAxis: 'z',
      suctionSign: -1
    });
    pump207.position.set(0, 1.2, 0);
    p207Group.add(pump207);

    // Engineered Suction & Top Discharge Manifold Rig for P-207
    this.createSinglePumpManifoldRig({
      skidGroup: p207Group,
      pumpOffset: 0,
      suctionAxis: 'z',
      suctionSign: -1,
      pumpBaseY: 1.2,
      suctionHeaderOffset: -7.0,
      suctionRadius: 0.65,
      suctionMaterial: this.matValveBlue,
      dischargeElevation: 10.0,
      dischargeHeaderOffset: 4.0,
      dischargeRadius: 0.65,
      dischargeMaterial: this.matValveBlue,
      voluteRadius: 1.5,
      fluidNameAr: 'متكاثف البخار',
      fluidNameEn: 'STEAM CONDENSATE',
      flowColor: 0x38bdf8,
      worldPos: new THREE.Vector3(115, 0, -12)
    });

    this.registerInteractive(p207Group, 'p-207');
    this.group.add(p207Group);
  }

  // 9. Zone C (East Central Bay): Lean Solution Train: E-204, P-202 A,B, F-201
  // E-204 at (+35, 11.5, +65), P-202 A/B at (+35, 0, +30), F-201 at (+65, 0, +30)
  private buildLeanSolutionAndBfwExchangerTrain() {
    // E-204 Elevated Table Platform Structure with Stairs (Deck at Y = 6.0m)
    const e204Platform = this.createElevatedPlatformWithStairs({
      widthX: 28.0,
      lengthZ: 16.0,
      deckHeight: 6.0,
      stairSide: 'north',
      stairOffset: 0
    });
    e204Platform.position.set(35, 0, 65);
    this.group.add(e204Platform);

    // E-204: Lean Solution / BFW Exchanger (Dia 9.0m, Length 22m, Elevated at Y = 11.5m)
    const e204 = this.createHorizontalShell(9.0, 22.0, this.matCarbonSteel);
    e204.position.set(35, 11.5, 65);
    e204.name = 'E-204';

    this.addNozzleWithFlange(e204, new THREE.Vector3(0, 0, -11.0), new THREE.Vector3(0, 0, -1), 1.4, 3.0); // Hot Lean In from T-202
    this.addNozzleWithFlange(e204, new THREE.Vector3(11.0, 0, 0), new THREE.Vector3(1, 0, 0), 1.4, 3.0); // Cooled Lean Out to P-202
    this.addNozzleWithFlange(e204, new THREE.Vector3(0, 4.8, 0), new THREE.Vector3(0, 1, 0), 1.2, 2.6); // BFW Out (105°C)
    this.addNozzleWithFlange(e204, new THREE.Vector3(0, -4.8, 0), new THREE.Vector3(0, -1, 0), 1.2, 2.6); // BFW In (45°C)

    this.registerInteractive(e204, 'e-204');
    this.group.add(e204);

    // P-202 A,B: High-Pressure Lean Solution Pumps Skid at (+35, 0, +30)
    const p202Group = new THREE.Group();
    p202Group.position.set(35, 0, 30);
    p202Group.name = 'P-202';

    const p202Pad = new THREE.Mesh(new THREE.BoxGeometry(24.0, 1.6, 14.0), this.matConcretePad);
    p202Pad.position.set(0, 0.8, 0);
    p202Group.add(p202Pad);

    [-6.0, 6.0].forEach((xOff) => {
      const pUnit = this.createIndustrialEngineeredPump({
        tag: `P-202${xOff < 0 ? 'A' : 'B'}`,
        arabicTitle: `مضخة المحلول النقي P-202${xOff < 0 ? 'A' : 'B'} (36 bar)`,
        voluteRadius: 2.4,
        suctionRadius: 1.3,
        dischargeRadius: 1.3,
        motorRadius: 2.1,
        motorLength: 5.2,
        casingColor: this.matValveGreen,
        suctionAxis: 'z',
        suctionSign: -1
      });
      pUnit.position.set(xOff, 1.6, 0);
      p202Group.add(pUnit);
    });

    // Separated Heavy-Duty Suction Header (Low level) and Overhead Discharge Header (High level)
    this.createDualPumpManifoldRig({
      skidGroup: p202Group,
      pumpOffsets: [-6.0, 6.0],
      suctionAxis: 'z',
      suctionSign: -1,
      pumpBaseY: 1.6,
      suctionHeaderOffset: -8.0,
      suctionRadius: 1.35,
      suctionMaterial: this.matAlloySteel,
      dischargeElevation: 13.5,
      dischargeHeaderOffset: 5.0,
      dischargeRadius: 1.35,
      dischargeMaterial: this.matAlloySteel,
      voluteRadius: 2.4,
      fluidNameAr: 'المحلول النقي (36 bar)',
      fluidNameEn: 'HP LEAN SOLN',
      flowColor: 0x10b981,
      worldPos: new THREE.Vector3(35, 0, 30)
    });

    this.registerInteractive(p202Group, 'p-202ab');
    this.registerInteractive(p202Group, 'p-202');
    this.group.add(p202Group);

    // F-201: Lean Solution High-Pressure Cartridge Filter at (+65, 0, +30)
    const f201 = this.createVerticalExchanger('F-201', 6.5, 14.0, this.matAlloySteel, this.matAlloySteel);
    f201.position.set(65, 0, 30);
    this.addNozzleWithFlange(f201, new THREE.Vector3(-3.4, 6.5, 0), new THREE.Vector3(-1, 0, 0), 1.3, 2.5); // In from P-202
    this.addNozzleWithFlange(f201, new THREE.Vector3(3.4, 7.5, 0), new THREE.Vector3(1, 0, 0), 1.3, 2.5); // Out to T-201 Top
    this.registerInteractive(f201, 'f-201');
    this.group.add(f201);
  }

  // 10. Zone D (North-East Deck): Overhead Acid Gas Condensers E-205 A,B, Separator V-203, Reflux Pumps P-203 A,B
  // E-205 A,B at (+160, 17.0, -60), V-203 at (+190, 0, -60), P-203 A,B at (+190, 0, -25)
  private buildAcidGasCondensersAndRefluxTrain() {
    // E-205 A,B Elevated Mezzanine Deck Platform Structure with Access Stairs (Deck at Y = 12.0m)
    const e205Platform = this.createElevatedPlatformWithStairs({
      widthX: 32.0,
      lengthZ: 22.0,
      deckHeight: 12.0,
      stairSide: 'south',
      stairOffset: 0
    });
    e205Platform.position.set(160, 0, -60);
    this.group.add(e205Platform);

    // E-205 A,B: Overhead Acid Gas Condensers (Twin Shells: Dia 8.5m, Length 24m, Elevated at Y = 17.0m)
    // Gas enters from TOP into the tubes (Tube Inlet Flange on Top of Left Channel Head)
    // Cooling Water (CW) enters bottom of shell and leaves from top of shell
    const e205Group = new THREE.Group();
    e205Group.position.set(160, 17.0, -60);
    e205Group.name = 'E-205';

    [-5.5, 5.5].forEach((zOff) => {
      const shell = this.createHorizontalShell(8.5, 24.0, this.matCarbonSteel);
      shell.position.set(0, 0, zOff);
      // Top Channel Head Gas Inlet (Stream 4 enters from top into tubes)
      this.addNozzleWithFlange(shell, new THREE.Vector3(-12.0, 4.3, 0), new THREE.Vector3(0, 1, 0), 1.3, 3.2); // Stream 4 Acid Gas In (Top Flange)
      // Axial Channel Head Outlet to V-203
      this.addNozzleWithFlange(shell, new THREE.Vector3(12.0, 0, 0), new THREE.Vector3(1, 0, 0), 1.3, 3.0); // Out to V-203
      // Shell Side Cooling Water (CW)
      this.addNozzleWithFlange(shell, new THREE.Vector3(0, -4.3, 0), new THREE.Vector3(0, -1, 0), 1.1, 2.5); // CW Supply In (Bottom of Shell)
      this.addNozzleWithFlange(shell, new THREE.Vector3(0, 4.3, 0), new THREE.Vector3(0, 1, 0), 1.1, 2.5); // CW Return Out (Top of Shell)
      e205Group.add(shell);
    });

    this.registerInteractive(e205Group, 'e-205ab');
    this.registerInteractive(e205Group, 'e-205');
    this.group.add(e205Group);

    // V-203: Acid Gas Separator Drum (Vertical Vessel: Dia 8.5m, Height 24m)
    const v203 = this.createVerticalExchanger('V-203', 8.5, 24.0, this.matCarbonSteel, this.matCarbonSteel);
    v203.position.set(190, 0, -60);
    this.addNozzleWithFlange(v203, new THREE.Vector3(-4.3, 16.0, 0), new THREE.Vector3(-1, 0, 0), 1.4, 3.0); // In from E-205
    this.addNozzleWithFlange(v203, new THREE.Vector3(0, 28.0, 0), new THREE.Vector3(0, 1, 0), 1.5, 3.8); // Stream 5 Pure CO2 Out
    this.addNozzleWithFlange(v203, new THREE.Vector3(0, 2.0, 0), new THREE.Vector3(0, -1, 0), 1.1, 2.5); // Bottom Condensate to P-203
    this.registerInteractive(v203, 'v-203');
    this.group.add(v203);

    // P-203 A,B: Reflux Pumps Skid at (+190, 0, -25)
    const p203Group = new THREE.Group();
    p203Group.position.set(190, 0, -25);
    p203Group.name = 'P-203';

    const p203Pad = new THREE.Mesh(new THREE.BoxGeometry(20.0, 1.4, 12.0), this.matConcretePad);
    p203Pad.position.set(0, 0.7, 0);
    p203Group.add(p203Pad);

    [-5.0, 5.0].forEach((xOff) => {
      const pUnit = this.createIndustrialEngineeredPump({
        tag: `P-203${xOff < 0 ? 'A' : 'B'}`,
        arabicTitle: `مضخة الراجع P-203${xOff < 0 ? 'A' : 'B'}`,
        voluteRadius: 1.9,
        suctionRadius: 0.7,
        dischargeRadius: 0.7,
        motorRadius: 1.5,
        motorLength: 3.5,
        casingColor: this.matValveBlue,
        suctionAxis: 'z',
        suctionSign: -1
      });
      pUnit.position.set(xOff, 1.4, 0);
      p203Group.add(pUnit);
    });

    // Separated Low Suction Header & Overhead High Discharge Manifold
    this.createDualPumpManifoldRig({
      skidGroup: p203Group,
      pumpOffsets: [-5.0, 5.0],
      suctionAxis: 'z',
      suctionSign: -1,
      pumpBaseY: 1.4,
      suctionHeaderOffset: -8.0,
      suctionRadius: 0.75,
      suctionMaterial: this.matValveBlue,
      dischargeElevation: 12.5,
      dischargeHeaderOffset: 5.0,
      dischargeRadius: 0.75,
      dischargeMaterial: this.matValveBlue,
      voluteRadius: 1.9,
      fluidNameAr: 'ماء الراجع',
      fluidNameEn: 'REFLUX WATER',
      flowColor: 0x38bdf8,
      worldPos: new THREE.Vector3(190, 0, -25)
    });

    this.registerInteractive(p203Group, 'p-203ab');
    this.registerInteractive(p203Group, 'p-203');
    this.group.add(p203Group);
  }

  // 11. Zone E (South Utility & Storage Yard, Z = +105)
  // V-205 at (-140, 0, 105), V-207/P-204 at (-90, 0, 105), K-201 at (-50, 0, 105),
  // V-209 at (-15, 0, 105), E-206 at (+25, 5, 105), P-208 at (+55, 0, 105),
  // V-206 at (+90, 0, 105), P-205 at (+120, 0, 105)
  private buildChemicalStorageAndDegasserDeck() {
    // V-205: Catacarb Storage Tank (Colossal Bulk Storage: Dia 22m, Height 20m)
    const v205Group = new THREE.Group();
    v205Group.position.set(-140, 0, 105);
    v205Group.name = 'V-205';

    const v205Pad = new THREE.Mesh(new THREE.CylinderGeometry(12.0, 13.0, 2.0, 32), this.matConcretePad);
    v205Pad.position.set(0, 1.0, 0);
    v205Group.add(v205Pad);

    const v205Shell = new THREE.Mesh(new THREE.CylinderGeometry(11.0, 11.0, 18.0, 36), this.matCarbonSteel);
    v205Shell.position.set(0, 11.0, 0);
    v205Group.add(v205Shell);

    const v205Roof = new THREE.Mesh(new THREE.ConeGeometry(11.5, 3.2, 36), this.matCarbonSteelDark);
    v205Roof.position.set(0, 21.6, 0);
    v205Group.add(v205Roof);

    // Spiral Staircase on Tank Wall
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2.5;
      const y = 2.0 + (i / 60) * 18.0;
      const step = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.15, 0.8), this.matCatwalkSteel);
      step.position.set(Math.cos(angle) * 12.0, y, Math.sin(angle) * 12.0);
      step.rotation.y = -angle;
      v205Group.add(step);
    }

    this.addNozzleWithFlange(v205Group, new THREE.Vector3(0, 23.5, 0), new THREE.Vector3(0, 1, 0), 0.8, 2.0); // Breather vent
    this.addNozzleWithFlange(v205Group, new THREE.Vector3(11.2, 3.5, 0), new THREE.Vector3(1, 0, 0), 1.0, 2.6); // Suction
    this.registerInteractive(v205Group, 'v-205');
    this.group.add(v205Group);

    // V-207: Sump Pit & P-204 Submersible Sump Pump at (-90, 0, 105)
    const v207Group = new THREE.Group();
    v207Group.position.set(-90, 0, 105);
    v207Group.name = 'V-207';

    const sumpWall = new THREE.Mesh(new THREE.BoxGeometry(10.0, 2.0, 10.0), this.matConcretePad);
    sumpWall.position.set(0, 0.5, 0);
    v207Group.add(sumpWall);

    const sumpGrate = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.2, 8.5), this.matTrenchGrate);
    sumpGrate.position.set(0, 1.5, 0);
    v207Group.add(sumpGrate);

    const p204 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4.5, 16), this.matValveGreen);
    p204.position.set(0, 3.5, 0);
    v207Group.add(p204);

    this.registerInteractive(v207Group, 'v-207');
    this.registerInteractive(v207Group, 'p-204');
    this.group.add(v207Group);

    // K-201: Degasser Stripping Air Blower at (-50, 0, 105)
    const k201Group = new THREE.Group();
    k201Group.position.set(-50, 0, 105);
    k201Group.name = 'K-201';

    const k201Pad = new THREE.Mesh(new THREE.BoxGeometry(8.0, 1.0, 6.0), this.matConcretePad);
    k201Pad.position.set(0, 0.5, 0);
    k201Group.add(k201Pad);

    const blowerScroll = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 1.5, 20), this.matValveAmber);
    blowerScroll.rotation.z = Math.PI / 2;
    blowerScroll.position.set(-1.2, 2.0, 0);
    k201Group.add(blowerScroll);

    const blowerMotor = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 2.5, 20), this.matCatwalkSteel);
    blowerMotor.rotation.z = Math.PI / 2;
    blowerMotor.position.set(1.5, 2.0, 0);
    k201Group.add(blowerMotor);

    const silencer = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.2, 16), this.matCarbonSteel);
    silencer.position.set(-1.2, 3.8, 0);
    k201Group.add(silencer);

    this.addNozzleWithFlange(k201Group, new THREE.Vector3(0, 2.0, -1.5), new THREE.Vector3(0, 0, -1), 0.6, 1.5);
    this.registerInteractive(k201Group, 'k-201');
    this.group.add(k201Group);

    // V-209: Process Condensate Degasser Column at (-15, 0, 105)
    const v209 = this.createVerticalExchanger('V-209', 7.0, 32.0, this.matCarbonSteel, this.matCarbonSteel);
    v209.position.set(-15, 0, 105);
    this.addNozzleWithFlange(v209, new THREE.Vector3(0, 37.0, 0), new THREE.Vector3(0, 1, 0), 1.1, 2.6); // Top Vent
    this.addNozzleWithFlange(v209, new THREE.Vector3(-3.6, 28.0, 0), new THREE.Vector3(-1, 0, 0), 1.0, 2.4); // Condensate In (110°C)
    this.addNozzleWithFlange(v209, new THREE.Vector3(-3.6, 6.0, 0), new THREE.Vector3(-1, 0, 0), 0.9, 2.2); // Stripping Air In
    this.addNozzleWithFlange(v209, new THREE.Vector3(0, 2.0, 0), new THREE.Vector3(0, -1, 0), 1.0, 2.4); // Stripped Condensate Out
    this.registerInteractive(v209, 'v-209');
    this.group.add(v209);

    // E-206: Condensate Cooler at (+25, 5.0, 105)
    const e206 = this.createHorizontalShell(6.5, 16.0, this.matCarbonSteel);
    e206.position.set(25, 5.0, 105);
    e206.name = 'E-206';
    this.addNozzleWithFlange(e206, new THREE.Vector3(-8.0, 0, 0), new THREE.Vector3(-1, 0, 0), 0.9, 2.2);
    this.addNozzleWithFlange(e206, new THREE.Vector3(8.0, 0, 0), new THREE.Vector3(1, 0, 0), 0.9, 2.2);
    this.registerInteractive(e206, 'e-206');
    this.group.add(e206);

    // P-208 A,B: Treated Condensate Transfer Pumps at (+55, 0, 105)
    const p208Group = new THREE.Group();
    p208Group.position.set(55, 0, 105);
    p208Group.name = 'P-208';

    const p208Pad = new THREE.Mesh(new THREE.BoxGeometry(20.0, 1.4, 12.0), this.matConcretePad);
    p208Pad.position.set(0, 0.7, 0);
    p208Group.add(p208Pad);

    [-4.5, 4.5].forEach((xOff) => {
      const pSub = this.createIndustrialEngineeredPump({
        tag: `P-208${xOff < 0 ? 'A' : 'B'}`,
        arabicTitle: `مضخة تصريف المتكاثف P-208${xOff < 0 ? 'A' : 'B'}`,
        voluteRadius: 1.7,
        suctionRadius: 0.65,
        dischargeRadius: 0.65,
        motorRadius: 1.4,
        motorLength: 3.2,
        casingColor: this.matValveBlue,
        suctionAxis: 'z',
        suctionSign: -1
      });
      pSub.position.set(xOff, 1.4, 0);
      p208Group.add(pSub);
    });

    // Separated Suction & Discharge Manifold for P-208
    this.createDualPumpManifoldRig({
      skidGroup: p208Group,
      pumpOffsets: [-4.5, 4.5],
      suctionAxis: 'z',
      suctionSign: -1,
      pumpBaseY: 1.4,
      suctionHeaderOffset: -7.5,
      suctionRadius: 0.65,
      suctionMaterial: this.matValveBlue,
      dischargeElevation: 12.0,
      dischargeHeaderOffset: 5.0,
      dischargeRadius: 0.65,
      dischargeMaterial: this.matValveBlue,
      voluteRadius: 1.7,
      fluidNameAr: 'المتكاثف المعالج',
      fluidNameEn: 'TREATED CONDENSATE',
      flowColor: 0x38bdf8,
      worldPos: new THREE.Vector3(55, 0, 105)
    });

    this.registerInteractive(p208Group, 'p-208');
    this.registerInteractive(p208Group, 'p-208ab');
    this.group.add(p208Group);

    // V-206: Anti-Foam Chemical Tank at (+90, 0, 105)
    const v206Group = new THREE.Group();
    v206Group.position.set(90, 0, 105);
    v206Group.name = 'V-206';

    const v206Shell = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 7.5, 24), this.matValvePurple);
    v206Shell.position.set(0, 4.5, 0);
    v206Group.add(v206Shell);

    const v206Pad = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.5, 1.0, 24), this.matConcretePad);
    v206Pad.position.set(0, 0.5, 0);
    v206Group.add(v206Pad);

    this.registerInteractive(v206Group, 'v-206');
    this.group.add(v206Group);

    // P-205 A,B: Anti-Foam Dosing Pumps at (+120, 0, 105)
    const p205Group = new THREE.Group();
    p205Group.position.set(120, 0, 105);
    p205Group.name = 'P-205';

    const p205Pad = new THREE.Mesh(new THREE.BoxGeometry(14.0, 1.2, 10.0), this.matConcretePad);
    p205Pad.position.set(0, 0.6, 0);
    p205Group.add(p205Pad);

    // Suction manifold for P-205 A,B (at low elevation)
    const p205SucH = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 9.0, 16), this.matValvePurple);
    p205SucH.rotation.z = Math.PI / 2;
    p205SucH.position.set(0, 1.8, -3.5);
    p205Group.add(p205SucH);

    // Overhead discharge header for P-205 A,B
    const p205DisH = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 9.0, 16), this.matValvePurple);
    p205DisH.rotation.z = Math.PI / 2;
    p205DisH.position.set(0, 6.0, 3.0);
    p205Group.add(p205DisH);

    [-3.0, 3.0].forEach((xOff) => {
      // Dosing pump body
      const dPump = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.2, 2.4), this.matValvePurple);
      dPump.position.set(xOff, 2.3, 0);
      p205Group.add(dPump);

      // Electric Motor
      const dMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.8, 16), this.matCatwalkSteel);
      dMotor.rotation.x = Math.PI / 2;
      dMotor.position.set(xOff, 2.3, 1.8);
      p205Group.add(dMotor);

      // Low Suction Branch into pump front
      const dSuc = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.3, 12), this.matValvePurple);
      dSuc.rotation.x = Math.PI / 2;
      dSuc.position.set(xOff, 1.8, -2.35);
      p205Group.add(dSuc);

      // Suction arrows
      const sucArr = this.createFlowChevronArrows(
        new THREE.Vector3(xOff, 1.8, -3.5),
        new THREE.Vector3(xOff, 1.8, -1.2),
        2,
        0xc084fc,
        0.35,
        0.5
      );
      p205Group.add(sucArr);

      // Vertical Discharge Riser rising from TOP of dosing pump
      const dDis = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.6, 12), this.matValvePurple);
      dDis.position.set(xOff, 4.7, 0);
      p205Group.add(dDis);

      // Pulsation Dampener (Accumulator Sphere) atop dosing pump discharge
      const dampener = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), this.matCarbonSteelDark);
      dampener.position.set(xOff + 0.6, 4.5, 0);
      p205Group.add(dampener);

      // Upward discharge arrows
      const disArr = this.createFlowChevronArrows(
        new THREE.Vector3(xOff, 3.5, 0),
        new THREE.Vector3(xOff, 5.8, 0),
        2,
        0xc084fc,
        0.35,
        0.5
      );
      p205Group.add(disArr);

      // Turn to discharge header
      const topTurn = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.0, 12), this.matValvePurple);
      topTurn.rotation.x = Math.PI / 2;
      topTurn.position.set(xOff, 6.0, 1.5);
      p205Group.add(topTurn);
    });

    this.registerInteractive(p205Group, 'p-205');
    this.registerInteractive(p205Group, 'p-205ab');
    this.group.add(p205Group);
  }

  // 12. Professional Orthogonal Carbon Steel Piping Network with Precision Geometry & ASME Color Codes
  private buildProcessPipingNetwork() {
    const pipeDefinitions: Array<{
      name: string;
      color: number;
      radius: number;
      speed: number;
      particleColor: number;
      points: THREE.Vector3[];
      streamTag?: string;
      fluidLabel?: string;
    }> = [
      // 1. Stream 1: Converted Gas from LTS R-105 -> E-201 Tube Inlet (-140, 14.0, -60)
      {
        name: 'Stream 1: Converted Gas (185°C, 28.9 bar) -> E-201 Reboiler',
        color: 0x2d4a66,
        radius: 0.62,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'STREAM 1',
        fluidLabel: 'Converted Gas (185°C)',
        points: [
          new THREE.Vector3(-185.0, 14.0, -60.0),
          new THREE.Vector3(-155.0, 14.0, -60.0)
        ]
      },
      // 2. E-201 Tube Outlet (120°C) -> V-201 Separator Inlet
      {
        name: 'E-201 Tube Outlet -> V-201 Separator',
        color: 0x2d4a66,
        radius: 0.6,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'SYNGAS',
        fluidLabel: 'Gas/Condensate Mix',
        points: [
          new THREE.Vector3(-125.0, 14.0, -60.0),
          new THREE.Vector3(-110.0, 14.0, -60.0),
          new THREE.Vector3(-110.0, 15.0, -60.0),
          new THREE.Vector3(-98.8, 15.0, -60.0)
        ]
      },
      // 3. Stream 2: V-201 Overhead Vapor (127°C) -> T-201 Bottom Feed (28.2 bar)
      {
        name: 'Stream 2: V-201 Overhead Vapor -> T-201 Bottom Feed (28.2 bar)',
        color: 0x334e68,
        radius: 0.62,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'STREAM 2',
        fluidLabel: 'Feed Syngas to T-201',
        points: [
          new THREE.Vector3(-95.0, 26.5, -60.0),
          new THREE.Vector3(-95.0, 30.0, -60.0),
          new THREE.Vector3(-53.2, 30.0, -60.0),
          new THREE.Vector3(-53.2, 22.0, -60.0)
        ]
      },
      // 4. V-201 Bottom Condensate -> P-206 A,B Pumps Suction Header
      {
        name: 'V-201 Bottom Condensate -> P-206 A/B Pumps Suction Header',
        color: 0x1e3a5f,
        radius: 0.45,
        speed: 0.07,
        particleColor: 0x38bdf8,
        streamTag: 'CONDENSATE SUCTION',
        points: [
          new THREE.Vector3(-95.0, 2.0, -60.0),
          new THREE.Vector3(-95.0, 4.49, -60.0),
          new THREE.Vector3(-95.0, 4.49, 22.0)
        ]
      },
      // 5. P-206 A,B Discharge Header -> V-209 Degasser Column Top Feed (110°C) via Dedicated Front Corridor
      {
        name: 'P-206 A/B Discharge Header -> V-209 Degasser Top Feed',
        color: 0x1e3a5f,
        radius: 0.45,
        speed: 0.07,
        particleColor: 0x38bdf8,
        streamTag: 'CONDENSATE DISCHARGE',
        points: [
          new THREE.Vector3(-95.0, 11.5, 35.0),
          new THREE.Vector3(-95.0, 11.5, 55.0), // routes through open front corridor Z = 55.0 (far clear of all tower lines!)
          new THREE.Vector3(-18.6, 11.5, 55.0),
          new THREE.Vector3(-18.6, 11.5, 105.0),
          new THREE.Vector3(-18.6, 28.0, 105.0)
        ]
      },
      // 6. Stream 3: T-201 Overhead Purified Syngas (80°C, 28 bar) -> V-204 KO Drum (Pure Orthogonal Route)
      {
        name: 'Stream 3: T-201 Overhead Purified Gas -> V-204 KO Drum',
        color: 0x2d4a66,
        radius: 0.65,
        speed: 0.09,
        particleColor: 0x67e8f9,
        streamTag: 'STREAM 3',
        fluidLabel: 'Purified Syngas (<0.1% CO2)',
        points: [
          new THREE.Vector3(-45.0, 90.0, -60.0),  // from T-201 top overhead nozzle
          new THREE.Vector3(-45.0, 95.0, -60.0),  // rises to overhead corridor
          new THREE.Vector3(-45.0, 95.0, -100.0), // runs north along overhead rack
          new THREE.Vector3(-45.0, 13.0, -100.0), // drops vertically in clear open space (8m in front of V-204)
          new THREE.Vector3(-45.0, 13.0, -108.0)  // enters directly and flush into V-204 South inlet nozzle flange face
        ]
      },
      // 7. V-204 Overhead Gas -> Methanation Section 100
      {
        name: 'V-204 Overhead -> Methanation Section 100 (E-107 Feed)',
        color: 0x2d4a66,
        radius: 0.65,
        speed: 0.09,
        particleColor: 0x67e8f9,
        streamTag: 'TO METHANATOR',
        fluidLabel: 'Purified Syngas to Methanation',
        points: [
          new THREE.Vector3(-45.0, 25.0, -115.0), // from V-204 top nozzle flange face
          new THREE.Vector3(-45.0, 30.0, -115.0), // vertical riser
          new THREE.Vector3(200.0, 30.0, -115.0)  // runs east along overhead pipe rack
        ]
      },
      // 8a. Rich Catacarb Solution: T-201 Bottom (112°C, 28.2 bar) -> Control Valve LRC-202-1V -> P-201HT Turbine Inlet
      {
        name: 'T-201 Bottom Rich Soln -> LRC-202-1V -> P-201HT Turbine Inlet',
        color: 0x14532d,
        radius: 0.58,
        speed: 0.08,
        particleColor: 0x34d399,
        streamTag: 'LRC-202-1V -> P-201HT',
        fluidLabel: 'Rich Catacarb to Turbine (28.2 bar)',
        points: [
          new THREE.Vector3(-45.0, 6.0, -51.8), // T-201 Bottom Rich Nozzle
          new THREE.Vector3(-45.0, 2.8, -51.8), // drops cleanly to ground grade Y=2.8
          new THREE.Vector3(-45.0, 2.8, 9.0),   // passes through LRC-202-1V at (-45.0, 2.8, 9.0)
          new THREE.Vector3(-45.0, 2.8, 13.5)   // into P-201HT Turbine Suction Flange
        ]
      },
      // 8b. Rich Solution Bypass Header: T-201 Bottom -> Control Valve LRC-202-2V -> Merge with Turbine Discharge
      {
        name: 'Rich Soln Bypass: T-201 Bottom -> LRC-202-2V -> Merge Header',
        color: 0x14532d,
        radius: 0.55,
        speed: 0.08,
        particleColor: 0x34d399,
        streamTag: 'LRC-202-2V BYPASS',
        fluidLabel: 'Rich Soln Bypass to T-202',
        points: [
          new THREE.Vector3(-45.0, 2.8, -25.0), // tee off rich bottom header at Z = -25
          new THREE.Vector3(-38.0, 2.8, -25.0), // offset to parallel valve run (X=-38)
          new THREE.Vector3(-38.0, 2.8, 6.0),   // passes through LRC-202-2V at (-38.0, 2.8, 6.0)
          new THREE.Vector3(-38.0, 9.0, 6.0),   // rises to merger elevation Y = 9.0
          new THREE.Vector3(-38.0, 9.0, 16.0)   // merges into P-201HT overhead riser
        ]
      },
      // 9. P-201HT Discharge (1.46 bar) + LRC-202-2V Merger -> T-202 Top Flash Chamber Nozzle (South Riser)
      {
        name: 'P-201HT Discharge + LRC-202-2V Combined Rich Line -> T-202 Top',
        color: 0x14532d,
        radius: 0.58,
        speed: 0.08,
        particleColor: 0x34d399,
        streamTag: 'FLASH FEED TO T-202',
        points: [
          new THREE.Vector3(-45.0, 9.0, 16.0), // from P-201HT top riser
          new THREE.Vector3(-38.0, 9.0, 16.0), // combined merger with LRC-202-2V
          new THREE.Vector3(55.0, 9.0, 16.0),  // runs east along corridor (Y=9.0, Z=16.0)
          new THREE.Vector3(55.0, 9.0, -35.0), // approaches T-202 South quadrant
          new THREE.Vector3(55.0, 74.0, -35.0),// RISER: Rises cleanly in open air (10m clear of any other lines)
          new THREE.Vector3(55.0, 74.0, -49.0),// turns north to T-202 South Nozzle
          new THREE.Vector3(65.0, 74.0, -49.0) // enters T-202 Top Flash Feed Nozzle Flange
        ]
      },
      // 10. Semi-Lean Solution: T-202 Mid Draw (114°C) -> P-201 A,B Suction Header (Elevated Tier 2 Corridor - Zero Clash)
      {
        name: 'T-202 Mid Draw (114°C) -> P-201 A/B Pump Suction Header',
        color: 0x115e59,
        radius: 0.56,
        speed: 0.07,
        particleColor: 0x6ee7b7,
        streamTag: 'SEMI-LEAN DRAW',
        fluidLabel: 'Semi-Lean from T-202 Mid Bed',
        points: [
          new THREE.Vector3(54.0, 44.0, -60.0), // T-202 Mid Draw West Nozzle Flange
          new THREE.Vector3(45.0, 44.0, -60.0), // extends west into clear air
          new THREE.Vector3(45.0, 15.0, -60.0), // drops to Tier 3 rack level Y = 15.0
          new THREE.Vector3(45.0, 15.0, -10.0), // runs forward to Z = -10.0
          new THREE.Vector3(-22.0, 15.0, -10.0),// crosses cleanly at Y = 15.0 with 6m vertical separation from all lines
          new THREE.Vector3(-22.0, 15.0, 6.0),  // turns south to P-201 suction bay
          new THREE.Vector3(-22.0, 4.6, 6.0)    // drops directly into P-201 Suction Header start
        ]
      },
      // 11. P-201 A,B Discharge (28 bar) -> E-207 Semi-Lean Cooler Tube Side Inlet (Right Channel Head)
      {
        name: 'P-201 A/B Discharge -> E-207 Cooler Tube Inlet (28 bar)',
        color: 0x115e59,
        radius: 0.55,
        speed: 0.08,
        particleColor: 0x6ee7b7,
        streamTag: 'SEMI-LEAN DISCHARGE',
        fluidLabel: 'P-201A Discharge to E-207 Tubes',
        points: [
          new THREE.Vector3(-25.0, 11.5, 16.0), // from P-201A vertical discharge riser top elbow
          new THREE.Vector3(-25.0, 11.5, 55.0), // P-201B standby tie-in junction
          new THREE.Vector3(-25.0, 11.5, 65.0), // overhead line arriving at E-207
          new THREE.Vector3(-20.0, 11.5, 65.0)  // flush flanged connection directly into E-207 Tube Inlet Nozzle
        ]
      },
      // 12. E-207 Cooler Tube Outlet (105°C) -> T-201 Mid Bed Feed Nozzle (Wide-Berth Multi-Tier Clear Route)
      {
        name: 'E-207 Cooler Tube Outlet (105°C) -> T-201 Mid Bed Feed',
        color: 0x115e59,
        radius: 0.55,
        speed: 0.08,
        particleColor: 0x6ee7b7,
        streamTag: 'SEMI-LEAN TO T-201 MID',
        fluidLabel: 'Cooled Semi-Lean (105°C) from E-207 Tubes to T-201 Mid',
        points: [
          new THREE.Vector3(-50.0, 11.5, 65.0), // from E-207 Left Channel Head Tube Outlet Flange
          new THREE.Vector3(-75.0, 11.5, 65.0), // wide offset westward to X = -75
          new THREE.Vector3(-75.0, 22.0, 65.0), // rises to High Corridor Tier 4 (Y = 22.0)
          new THREE.Vector3(-75.0, 22.0, -40.0),// runs along high corridor with generous clearance
          new THREE.Vector3(-25.0, 22.0, -40.0),// turns east toward South approach of T-201
          new THREE.Vector3(-25.0, 52.0, -40.0),// RISER 1: Rises cleanly in open air 20m away from tower/stairs
          new THREE.Vector3(-25.0, 52.0, -60.0),// turns north to T-201 mid nozzle plane at Y = 52
          new THREE.Vector3(-36.8, 52.0, -60.0) // enters T-201 Mid Bed Feed Distributor Nozzle
        ]
      },
      // 13. Lean Solution: T-202 Bottom (120°C) -> E-204 BFW Exchanger Shell (Elevated at Y = 11.5m)
      {
        name: 'T-202 Bottom Lean Soln (120°C) -> E-204 Exchanger',
        color: 0x155e75,
        radius: 0.58,
        speed: 0.07,
        particleColor: 0xa7f3d0,
        streamTag: 'LEAN SOLN FROM T-202 BOT',
        fluidLabel: 'Lean Carbonate Soln (120°C)',
        points: [
          new THREE.Vector3(65.0, 6.0, -49.0), // from T-202 South Bottom Nozzle Flange
          new THREE.Vector3(65.0, 6.0, -35.0),
          new THREE.Vector3(65.0, 11.5, -35.0),
          new THREE.Vector3(35.0, 11.5, -35.0),
          new THREE.Vector3(35.0, 11.5, 54.0)   // into elevated E-204 Exchanger nozzle
        ]
      },
      // 14. E-204 BFW Preheating Circuit (BFW In 45°C -> Out 105°C)
      {
        name: 'E-204 BFW Preheating Circuit (45°C -> 105°C)',
        color: 0x1e40af,
        radius: 0.48,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'BFW 105°C',
        points: [
          new THREE.Vector3(35.0, 6.7, 65.0),
          new THREE.Vector3(35.0, 18.0, 65.0),
          new THREE.Vector3(35.0, 18.0, -10.0),
          new THREE.Vector3(200.0, 18.0, -10.0)
        ]
      },
      // 15. E-204 Cooled Lean Solution (80°C) -> P-202 A,B Pump Suction Header
      {
        name: 'E-204 Cooled Lean Soln (80°C) -> P-202 A/B Suction Header',
        color: 0x155e75,
        radius: 0.56,
        speed: 0.07,
        particleColor: 0xa7f3d0,
        streamTag: 'LEAN SUCTION TO P-202',
        points: [
          new THREE.Vector3(46.0, 11.5, 65.0),
          new THREE.Vector3(46.0, 5.32, 65.0),
          new THREE.Vector3(35.0, 5.32, 65.0),
          new THREE.Vector3(35.0, 5.32, 22.0)
        ]
      },
      // 16. P-202 A,B Overhead Discharge Header (36 bar) -> F-201 Filter (Pure Orthogonal Engineering Alignment)
      {
        name: 'P-202 A/B Discharge Header (36 bar) -> F-201 Filter',
        color: 0x155e75,
        radius: 0.55,
        speed: 0.08,
        particleColor: 0xa7f3d0,
        streamTag: 'HP LEAN (36 BAR)',
        fluidLabel: 'High-Pressure Lean Solution to F-201 Filter',
        points: [
          new THREE.Vector3(35.0, 13.5, 35.0), // from P-202 overhead discharge header
          new THREE.Vector3(50.0, 13.5, 35.0), // runs east horizontally
          new THREE.Vector3(50.0, 13.5, 30.0), // turns to F-201 nozzle axis plane Z = 30.0
          new THREE.Vector3(50.0, 6.5, 30.0),  // drops vertically to inlet nozzle elevation Y = 6.5
          new THREE.Vector3(59.1, 6.5, 30.0)   // runs horizontally straight into F-201 West inlet nozzle flange face
        ]
      },
      // 17. F-201 Filtered Lean Solution -> T-201 Top Distributor (80°C) (Dedicated Corridor - Zero Clash with E-201)
      {
        name: 'F-201 Filtered Lean Soln -> T-201 Top Feed (80°C)',
        color: 0x155e75,
        radius: 0.55,
        speed: 0.08,
        particleColor: 0xa7f3d0,
        streamTag: 'LEAN TOP FEED TO T-201',
        fluidLabel: 'High Purity Lean Soln to T-201 Top',
        points: [
          new THREE.Vector3(70.9, 7.5, 30.0),   // from F-201 East outlet nozzle flange face
          new THREE.Vector3(76.0, 7.5, 30.0),   // extends east horizontally into clear space
          new THREE.Vector3(76.0, 14.0, 30.0),  // rises vertically to overhead pipe rack level Y = 14.0
          new THREE.Vector3(76.0, 14.0, 10.0),  // turns into central utility corridor Z = 10.0
          new THREE.Vector3(-15.0, 14.0, 10.0), // runs west along central corridor (55m south of E-201 thermosiphon!)
          new THREE.Vector3(-15.0, 14.0, -30.0),// turns north into T-201 approach corridor Z = -30.0
          new THREE.Vector3(-30.0, 14.0, -30.0),// offset to East quadrant of T-201
          new THREE.Vector3(-30.0, 80.0, -30.0),// RISER 2: Rises cleanly in open air (60m away from E-201 thermosiphon lines!)
          new THREE.Vector3(-30.0, 80.0, -60.0),// turns north to T-201 top nozzle plane at Y = 80
          new THREE.Vector3(-36.8, 80.0, -60.0) // enters T-201 Top Liquid Distributor Nozzle
        ]
      },
      // 18. Reboiler Thermosiphon 1: T-202 Bottom -> Elevated E-201 Shell -> T-202 Vapor Return (Rear Pipe Rack Route)
      {
        name: 'Thermosiphon Draw: T-202 -> Elevated E-201 Shell',
        color: 0x14532d,
        radius: 0.52,
        speed: 0.06,
        particleColor: 0x34d399,
        streamTag: 'REBOILER 1 LIQUID',
        points: [
          new THREE.Vector3(65.0, 14.0, -71.0), // T-202 North/Rear Draw Nozzle Flange
          new THREE.Vector3(65.0, 14.0, -90.0), // runs directly north to rear corridor Z = -90.0
          new THREE.Vector3(65.0, 8.0, -90.0),  // drops to rear pipe level
          new THREE.Vector3(-140.0, 8.0, -90.0),// runs safely behind towers (no crossing between towers!)
          new THREE.Vector3(-140.0, 8.0, -60.0) // into E-201 bottom shell nozzle
        ]
      },
      {
        name: 'Thermosiphon Return: E-201 Boiling Vapor -> T-202',
        color: 0x14532d,
        radius: 0.55,
        speed: 0.08,
        particleColor: 0x34d399,
        streamTag: 'REBOILER 1 VAPOR',
        points: [
          new THREE.Vector3(-140.0, 22.5, -60.0),
          new THREE.Vector3(-140.0, 26.0, -90.0),// routed through rear pipe corridor Z = -90.0
          new THREE.Vector3(65.0, 26.0, -90.0),  // runs behind towers
          new THREE.Vector3(65.0, 26.0, -71.0)  // into T-202 North/Rear vapor return nozzle flange
        ]
      },
      // 19. Reboiler Thermosiphon 2: T-202 -> Elevated E-202 LP Steam Reboiler -> T-202 (Clean Dedicated Loop)
      {
        name: 'Thermosiphon Loop: T-202 <-> Elevated E-202 LP Steam Reboiler',
        color: 0xb45309,
        radius: 0.5,
        speed: 0.07,
        particleColor: 0xfcd34d,
        streamTag: 'LP STEAM REBOILER',
        points: [
          new THREE.Vector3(76.0, 14.0, -60.0), // T-202 East Lower Draw Nozzle Flange
          new THREE.Vector3(82.0, 14.0, -60.0), // extends east into clear space
          new THREE.Vector3(82.0, 6.0, -60.0),  // drops to clear low corridor
          new THREE.Vector3(115.0, 6.0, -60.0), // runs directly under E-202
          new THREE.Vector3(115.0, 8.5, -60.0)  // rises into E-202 bottom liquid inlet nozzle
        ]
      },
      {
        name: 'E-202 Vapor Return -> T-202',
        color: 0xb45309,
        radius: 0.5,
        speed: 0.07,
        particleColor: 0xfcd34d,
        streamTag: 'E-202 VAPOR RETURN',
        points: [
          new THREE.Vector3(115.0, 18.5, -60.0), // from E-202 top vapor outlet nozzle
          new THREE.Vector3(115.0, 26.0, -60.0), // rises to Y=26.0
          new THREE.Vector3(76.0, 26.0, -60.0)  // into T-202 East Vapor Return Nozzle Flange
        ]
      },
      // 20a. E-202 Steam Condensate Drain -> V-208 Recovery Drum -> P-207 Suction
      {
        name: 'E-202 Steam Condensate Drain -> V-208 Drum -> P-207 Suction',
        color: 0x1e3a5f,
        radius: 0.42,
        speed: 0.06,
        particleColor: 0x38bdf8,
        streamTag: 'CONDENSATE TO P-207',
        points: [
          new THREE.Vector3(127.0, 13.5, -60.0), // from E-202 right channel head
          new THREE.Vector3(127.0, 3.5, -60.0),  // drops cleanly
          new THREE.Vector3(127.0, 3.5, -25.0),  // runs forward along dedicated side corridor
          new THREE.Vector3(120.0, 3.5, -25.0),  // enters V-208 Recovery Drum
          new THREE.Vector3(115.0, 1.0, -25.0),  // from V-208 bottom drain
          new THREE.Vector3(115.0, 1.0, -19.0),  // runs forward to P-207 suction header
          new THREE.Vector3(115.0, 1.8, -19.0)   // into P-207 suction manifold
        ]
      },
      // 20b. P-207 Overhead Discharge -> Battery Limits / Deaerator via Pipe Rack
      {
        name: 'P-207 Overhead Discharge -> Battery Limits / Deaerator',
        color: 0x1e3a5f,
        radius: 0.42,
        speed: 0.07,
        particleColor: 0x38bdf8,
        streamTag: 'CONDENSATE DISCHARGE',
        points: [
          new THREE.Vector3(115.0, 10.0, -8.0),
          new THREE.Vector3(115.0, 10.0, 0.0),
          new THREE.Vector3(-185.0, 10.0, 0.0)
        ]
      },
      // 21a. Stream 4: T-202 Overhead Acid Gas (97°C, 1.46 bar) -> E-205A Top Tube Inlet Flange
      {
        name: 'Stream 4: T-202 Overhead Acid Gas -> E-205A Top Tube Inlet',
        color: 0x991b1b,
        radius: 0.65,
        speed: 0.09,
        particleColor: 0xfb7185,
        streamTag: 'STREAM 4 ACID GAS',
        fluidLabel: 'CO2 / H2O Vapor (97°C) into E-205A Top Tube Nozzle',
        points: [
          new THREE.Vector3(65.0, 90.0, -60.0), // from T-202 Top Dome Nozzle Flange
          new THREE.Vector3(65.0, 95.0, -60.0), // vertical top riser
          new THREE.Vector3(148.0, 95.0, -60.0),// overhead transfer header to E-205
          new THREE.Vector3(148.0, 29.0, -60.0),// drops to distribution manifold level
          new THREE.Vector3(148.0, 29.0, -65.5),// branches towards E-205A centerline
          new THREE.Vector3(148.0, 24.5, -65.5) // drops vertically directly into top tube inlet flange of E-205A!
        ]
      },
      // 21b. Stream 4 Branch Header -> E-205B Top Tube Inlet Flange
      {
        name: 'Stream 4 Branch -> E-205B Top Tube Inlet',
        color: 0x991b1b,
        radius: 0.65,
        speed: 0.09,
        particleColor: 0xfb7185,
        streamTag: 'STREAM 4 BRANCH TO E-205B',
        fluidLabel: 'CO2 / H2O Vapor into E-205B Top Tube Nozzle',
        points: [
          new THREE.Vector3(148.0, 29.0, -60.0),// distribution manifold tee
          new THREE.Vector3(148.0, 29.0, -54.5),// branches towards E-205B centerline
          new THREE.Vector3(148.0, 24.5, -54.5) // drops vertically directly into top tube inlet flange of E-205B!
        ]
      },
      // 21c. Cooling Water Supply (CW) to E-205A Shell Side (Enters Bottom Nozzle)
      {
        name: 'Cooling Water (CW) Supply -> E-205A Shell (Bottom In)',
        color: 0x0284c7,
        radius: 0.5,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'CW SUPPLY 32°C',
        fluidLabel: 'Cooling Water Supply to E-205A Shell',
        points: [
          new THREE.Vector3(200.0, 6.0, -75.0),
          new THREE.Vector3(160.0, 6.0, -75.0),
          new THREE.Vector3(160.0, 6.0, -65.5),
          new THREE.Vector3(160.0, 10.2, -65.5) // enters bottom shell nozzle of E-205A
        ]
      },
      // 21d. Cooling Water Supply (CW) Branch to E-205B Shell Side (Enters Bottom Nozzle)
      {
        name: 'Cooling Water (CW) Supply -> E-205B Shell (Bottom In)',
        color: 0x0284c7,
        radius: 0.5,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'CW SUPPLY TO E-205B',
        fluidLabel: 'Cooling Water Supply to E-205B Shell',
        points: [
          new THREE.Vector3(160.0, 6.0, -65.5),
          new THREE.Vector3(160.0, 6.0, -54.5),
          new THREE.Vector3(160.0, 10.2, -54.5) // enters bottom shell nozzle of E-205B
        ]
      },
      // 21e. Cooling Water Return (CWR) from E-205A,B Shell Side (Leaves from Top)
      {
        name: 'Cooling Water (CW) Return -> From E-205A Shell (Top Out)',
        color: 0x0369a1,
        radius: 0.5,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'CW RETURN 42°C',
        fluidLabel: 'Cooling Water Return from E-205A Shell',
        points: [
          new THREE.Vector3(160.0, 23.8, -65.5), // leaves top shell nozzle of E-205A
          new THREE.Vector3(160.0, 26.0, -65.5),
          new THREE.Vector3(160.0, 26.0, -75.0),
          new THREE.Vector3(200.0, 26.0, -75.0)
        ]
      },
      {
        name: 'Cooling Water (CW) Return -> From E-205B Shell (Top Out)',
        color: 0x0369a1,
        radius: 0.5,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'CW RETURN FROM E-205B',
        fluidLabel: 'Cooling Water Return from E-205B Shell',
        points: [
          new THREE.Vector3(160.0, 23.8, -54.5), // leaves top shell nozzle of E-205B
          new THREE.Vector3(160.0, 26.0, -54.5),
          new THREE.Vector3(160.0, 26.0, -65.5)  // merges into CW return header
        ]
      },
      // 22. E-205A,B Condenser Outlets (40°C) -> V-203 Acid Gas Separator
      {
        name: 'E-205A Condenser Outlet -> V-203 Separator',
        color: 0x991b1b,
        radius: 0.62,
        speed: 0.08,
        particleColor: 0xfb7185,
        streamTag: 'COOLED ACID GAS E-205A',
        points: [
          new THREE.Vector3(175.0, 17.0, -65.5), // from E-205A axial outlet flange
          new THREE.Vector3(180.0, 17.0, -65.5),
          new THREE.Vector3(180.0, 17.0, -60.0), // combined manifold junction
          new THREE.Vector3(185.7, 17.0, -60.0)  // into V-203 inlet nozzle
        ]
      },
      {
        name: 'E-205B Condenser Outlet -> V-203 Separator',
        color: 0x991b1b,
        radius: 0.62,
        speed: 0.08,
        particleColor: 0xfb7185,
        streamTag: 'COOLED ACID GAS E-205B',
        points: [
          new THREE.Vector3(175.0, 17.0, -54.5), // from E-205B axial outlet flange
          new THREE.Vector3(180.0, 17.0, -54.5),
          new THREE.Vector3(180.0, 17.0, -60.0)  // merges into V-203 header
        ]
      },
      // 23. Stream 5: V-203 Overhead Pure CO2 Gas (61,000 kg/h max) -> To Urea Unit / ATM
      {
        name: 'Stream 5: V-203 Pure CO2 Gas -> To Urea Unit / ATM',
        color: 0xb91c1c,
        radius: 0.68,
        speed: 0.1,
        particleColor: 0xf87171,
        streamTag: 'STREAM 5 PURE CO2',
        fluidLabel: 'CO2 Product -> Urea Plant',
        points: [
          new THREE.Vector3(190.0, 28.0, -60.0),
          new THREE.Vector3(190.0, 34.0, -60.0),
          new THREE.Vector3(215.0, 34.0, -60.0)
        ]
      },
      // 24a. Reflux Condensate Suction: V-203 Bottom -> P-203 A,B Suction Header
      {
        name: 'V-203 Bottom Condensate -> P-203 A/B Suction Header',
        color: 0x1e3a5f,
        radius: 0.48,
        speed: 0.07,
        particleColor: 0x38bdf8,
        streamTag: 'WATER SUCTION TO P-203',
        points: [
          new THREE.Vector3(190.0, 2.0, -60.0), // from V-203 bottom nozzle
          new THREE.Vector3(190.0, 1.4, -60.0), // drops to ground skid level
          new THREE.Vector3(190.0, 1.4, -33.0)  // straight into P-203 suction header
        ]
      },
      // 24b. Reflux Water Discharge: P-203 A,B Overhead Discharge Header -> T-202 Top Reflux (Spacious Elevated Corridor)
      {
        name: 'P-203 A/B Discharge Header -> T-202 Top Reflux',
        color: 0x1e3a5f,
        radius: 0.48,
        speed: 0.07,
        particleColor: 0x38bdf8,
        streamTag: 'WATER REFLUX TO T-202',
        points: [
          new THREE.Vector3(185.0, 12.5, -20.0), // from P-203 overhead discharge manifold
          new THREE.Vector3(185.0, 20.0, -20.0), // RISER: elevated high above ground equipment
          new THREE.Vector3(185.0, 20.0, -35.0), // turns to front open corridor (25m clear of E-202!)
          new THREE.Vector3(85.0, 20.0, -35.0),  // runs cleanly west in open space
          new THREE.Vector3(85.0, 78.0, -35.0),  // RISER: Rises cleanly in open air to T-202 top level
          new THREE.Vector3(85.0, 78.0, -60.0),  // turns north to T-202 nozzle plane
          new THREE.Vector3(76.0, 78.0, -60.0)   // enters T-202 East Top Reflux Nozzle Flange
        ]
      },
      // 25. K-201 Stripping Air Blower -> V-209 Degasser Column Bottom Air Inlet
      {
        name: 'K-201 Stripping Air Blower -> V-209 Degasser Bottom',
        color: 0xa16207,
        radius: 0.42,
        speed: 0.08,
        particleColor: 0xfcd34d,
        streamTag: 'STRIPPING AIR',
        points: [
          new THREE.Vector3(-50.0, 2.0, 105.0),
          new THREE.Vector3(-50.0, 6.0, 105.0),
          new THREE.Vector3(-18.6, 6.0, 105.0)
        ]
      },
      // 26a. Degasser System: V-209 Bottom Stripped Condensate -> E-206 Cooler -> P-208 A,B Suction Header
      {
        name: 'V-209 Stripped Condensate -> E-206 -> P-208 Suction Header',
        color: 0x1e3a5f,
        radius: 0.48,
        speed: 0.07,
        particleColor: 0x38bdf8,
        streamTag: 'STRIPPED CONDENSATE',
        points: [
          new THREE.Vector3(-15.0, 2.0, 105.0),
          new THREE.Vector3(17.0, 2.0, 105.0),
          new THREE.Vector3(17.0, 5.0, 105.0),
          new THREE.Vector3(33.0, 5.0, 105.0),
          new THREE.Vector3(33.0, 4.39, 105.0),
          new THREE.Vector3(33.0, 4.39, 97.5),
          new THREE.Vector3(55.0, 4.39, 97.5)
        ]
      },
      // 26b. P-208 A,B Overhead Discharge Header -> CW Towers / Battery Limits
      {
        name: 'P-208 Discharge Header -> CW Towers / BL',
        color: 0x1e3a5f,
        radius: 0.46,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'TREATED CONDENSATE DISCHARGE',
        points: [
          new THREE.Vector3(55.0, 12.0, 110.0),
          new THREE.Vector3(55.0, 12.0, 120.0),
          new THREE.Vector3(200.0, 12.0, 120.0)
        ]
      },
      // 27. Sump Recovery & Make-Up: V-205 Storage -> V-207 Sump Pit -> P-204 -> V-205 Tank
      {
        name: 'Sump & Solvent Recovery: V-207 -> P-204 -> V-205 Storage Tank',
        color: 0x14532d,
        radius: 0.4,
        speed: 0.06,
        particleColor: 0x34d399,
        streamTag: 'SOLVENT RECOVERY',
        points: [
          new THREE.Vector3(-90.0, 3.5, 105.0),
          new THREE.Vector3(-90.0, 14.0, 105.0),
          new THREE.Vector3(-128.8, 14.0, 105.0)
        ]
      },
      // 28a. Anti-Foam Dosing: P-205 A,B -> Injection into Lean Solution Line (P-202 / E-204)
      {
        name: 'Anti-Foam Injection -> Lean Solution Stream',
        color: 0x6b21a8,
        radius: 0.28,
        speed: 0.06,
        particleColor: 0xc084fc,
        streamTag: 'ANTI-FOAM TO LEAN',
        fluidLabel: 'Anti-Foam Chemical to Lean Solution',
        points: [
          new THREE.Vector3(120.0, 6.0, 108.0), // from P-205 overhead discharge header
          new THREE.Vector3(120.0, 8.5, 108.0),
          new THREE.Vector3(120.0, 8.5, 0.0),   // runs along utility corridor
          new THREE.Vector3(35.0, 8.5, 0.0),
          new THREE.Vector3(35.0, 8.5, 22.0),
          new THREE.Vector3(35.0, 5.32, 22.0)   // injects into P-202 suction header
        ]
      },
      // 28b. Anti-Foam Dosing: P-205 A,B -> Injection into Semi-Lean Solution Line (P-201)
      {
        name: 'Anti-Foam Injection -> Semi-Lean Solution Stream',
        color: 0x6b21a8,
        radius: 0.28,
        speed: 0.06,
        particleColor: 0xc084fc,
        streamTag: 'ANTI-FOAM TO SEMI-LEAN',
        fluidLabel: 'Anti-Foam Chemical to Semi-Lean Solution',
        points: [
          new THREE.Vector3(35.0, 18.0, 0.0),    // branch off main anti-foam elevated header at Y=18.0
          new THREE.Vector3(-22.0, 18.0, 0.0),   // runs west to P-201 area
          new THREE.Vector3(-22.0, 18.0, 6.0),
          new THREE.Vector3(-22.0, 15.0, 6.0)    // injects vertically into P-201 semi-lean riser
        ]
      },
      // 28c. Anti-Foam Dosing: P-205 A,B -> Injection into Rich Solution Line (P-201HT / T-202 Flash Feed)
      {
        name: 'Anti-Foam Injection -> Rich Solution Stream',
        color: 0x6b21a8,
        radius: 0.28,
        speed: 0.06,
        particleColor: 0xc084fc,
        streamTag: 'ANTI-FOAM TO RICH',
        fluidLabel: 'Anti-Foam Chemical to Rich Solution (T-202 Feed)',
        points: [
          new THREE.Vector3(-22.0, 18.0, 0.0),   // branch off anti-foam header
          new THREE.Vector3(-38.0, 18.0, 0.0),
          new THREE.Vector3(-38.0, 18.0, 16.0),
          new THREE.Vector3(-38.0, 9.0, 16.0)    // injects into Rich flash feed line
        ]
      },
      // 29. Inhibitor Activation Air Line (FI-206): Process Air Injection into Rich Solution at Turbine P-201HT Discharge
      {
        name: 'Inhibitor Activation Air (FI-206) -> Rich Solution at Turbine Discharge',
        color: 0x0284c7,
        radius: 0.24,
        speed: 0.07,
        particleColor: 0x67e8f9,
        streamTag: 'INHIBITOR AIR (FI-206)',
        fluidLabel: 'Process Air (2C-201) to Maintain Vanadium Inhibitor (V+5)',
        points: [
          new THREE.Vector3(-185.0, 12.0, 20.0), // from Process Air Compressor 2C-201 header (Z = 20.0)
          new THREE.Vector3(-45.0, 12.0, 20.0),  // passes through Flow Indicator FI-206
          new THREE.Vector3(-45.0, 12.0, 16.0),
          new THREE.Vector3(-45.0, 9.0, 16.0)    // injects directly into P-201HT turbine discharge riser
        ]
      }
    ];

    const PIPE_SCALE_FACTOR = 1.75; // Increased pipe line thickness / diameter for bold, prominent industrial pipelines

    pipeDefinitions.forEach((def) => {
      const tubeMat = new THREE.MeshStandardMaterial({
        color: def.color,
        roughness: 0.28,
        metalness: 0.92
      });

      const effectiveRadius = def.radius * PIPE_SCALE_FACTOR;
      const isHotStream = !def.name.toLowerCase().includes('cw supply') && !def.name.toLowerCase().includes('cooled');
      const cladRadius = effectiveRadius + 0.22; // Scaled insulation thickness (mineral wool + stucco aluminum cladding)

      const pipeGroup = new THREE.Group();
      pipeGroup.name = def.name;
      pipeGroup.userData = {
        name: def.name,
        streamTag: def.streamTag,
        fluidLabel: def.fluidLabel,
        isInsulated: true,
        insulationType: 'Mineral Wool / Stucco Aluminum Cladding (صوف صخري + غلاف ألومنيوم مضلع)',
        operatingTemp: def.name.match(/\(([^)]+°C[^)]*)\)/)?.[1] || (isHotStream ? '115°C' : '38°C')
      };

      // 1. Build Thermal Insulation Cladding Spools along each straight segment
      for (let i = 0; i < def.points.length - 1; i++) {
        const p1 = def.points[i];
        const p2 = def.points[i + 1];
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const len = dir.length();

        if (len > 0.01) {
          const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
          const up = new THREE.Vector3(0, 1, 0);
          const normDir = dir.clone().normalize();

          // A. Inner Pipe Core (Internal process flow carrier)
          const coreGeo = new THREE.CylinderGeometry(effectiveRadius, effectiveRadius, len, 16, 1, false);
          const coreMesh = new THREE.Mesh(coreGeo, tubeMat);
          coreMesh.position.copy(mid);
          if (Math.abs(normDir.dot(up)) < 0.9999) {
            coreMesh.quaternion.setFromUnitVectors(up, normDir);
          } else if (normDir.y < 0) {
            coreMesh.rotation.x = Math.PI;
          }
          pipeGroup.add(coreMesh);

          // B. Outer Thermal Insulation Cladding Jacket (غلاف التغليف الحراري الخارجي بالألومنيوم المصقول)
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

          // C. Longitudinal Lap Seam Ridge (قفل التغليف الطولي)
          const seamGeo = new THREE.BoxGeometry(cladRadius * 0.08, len - 0.2, cladRadius * 0.08);
          const seamMesh = new THREE.Mesh(seamGeo, this.matCladdingStraps);
          seamMesh.position.copy(mid);
          if (Math.abs(normDir.dot(up)) < 0.9999) {
            seamMesh.quaternion.setFromUnitVectors(up, normDir);
          } else if (normDir.y < 0) {
            seamMesh.rotation.x = Math.PI;
          }
          seamMesh.translateX(cladRadius);
          pipeGroup.add(seamMesh);

          // D. Stainless Steel Cladding Band Straps & Wing Seals (أحزمة شد التغليف كل 2.5م)
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

            // Wing Seal Clip (قفل المشبك)
            const clipGeo = new THREE.BoxGeometry(0.12, 0.20, 0.16);
            const clipMesh = new THREE.Mesh(clipGeo, this.matCladdingStraps);
            clipMesh.position.copy(bandPos);
            if (Math.abs(normDir.dot(up)) < 0.9999) {
              clipMesh.quaternion.setFromUnitVectors(up, normDir);
            } else if (normDir.y < 0) {
              clipMesh.rotation.x = Math.PI;
            }
            clipMesh.translateZ(cladRadius * 1.03);
            pipeGroup.add(clipMesh);
          }

          // E. ISO 20560 / ASME A13.1 Thermal Insulation & Process Fluid Wrap Band
          if (len > 8.0) {
            const bandTex = createThermalInsulationBandTexture(
              def.streamTag || 'LINE',
              def.fluidLabel || 'مائع تشغيلي معزول',
              def.name.split(':')[0] || 'INSULATED PROCESS LINE',
              def.name.match(/\(([^)]+)\)/)?.[1] || (isHotStream ? 'HOT 115°C • 28 bar' : '38°C'),
              `#${def.color.toString(16).padStart(6, '0')}`,
              isHotStream
            );

            const idBandMat = new THREE.MeshStandardMaterial({
              map: bandTex,
              roughness: 0.25,
              metalness: 0.3
            });

            const idBandGeo = new THREE.CylinderGeometry(cladRadius * 1.035, cladRadius * 1.035, 1.8, 24);
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

      // 2. Smooth Industrial Elbow Fittings at Pipe Bends (Clean, seamless connection without bogus flanges)
      def.points.forEach((pt, idx) => {
        if (idx > 0 && idx < def.points.length - 1) {
          // A. Clean Spherical Elbow Fitting matching pipe radius perfectly
          const elbowGeo = new THREE.SphereGeometry(cladRadius * 1.01, 16, 12);
          const elbowMesh = new THREE.Mesh(elbowGeo, this.matLobsterElbow);
          elbowMesh.position.copy(pt);
          pipeGroup.add(elbowMesh);
          this.claddingMeshes.push(elbowMesh);
        } else if (idx === def.points.length - 1 || idx === 0) {
          // Terminal Connection Insulation Reducer / End Cap (نهاية التغليف المخروطية)
          const endCapGeo = new THREE.CylinderGeometry(effectiveRadius * 1.02, cladRadius * 1.02, 0.45, 16);
          const endCap = new THREE.Mesh(endCapGeo, this.matAluminumCladding);
          endCap.position.copy(pt);
          pipeGroup.add(endCap);
        }

        // Heavy Galvanized Pipe Support Saddle Shoe underneath cladding
        if (Math.abs(pt.z) < 25.0 && pt.y > 2.5 && pt.y < 24.0) {
          const shoeGeo = new THREE.BoxGeometry(cladRadius * 2.2, 0.45, cladRadius * 2.2);
          const shoe = new THREE.Mesh(shoeGeo, this.matCatwalkSteel);
          shoe.position.set(pt.x, pt.y - cladRadius - 0.22, pt.z);
          pipeGroup.add(shoe);
        }
      });

      this.group.add(pipeGroup);

      // Register interactive pipeline clicking for DCS Inspector Card
      const pipeEquipId = (def.streamTag || def.name).toLowerCase().replace(/[^a-z0-9]/g, '_');
      const pipeEquipInfo: EquipmentInfo = {
        id: pipeEquipId,
        tag: def.streamTag || 'PIPE-CLAD',
        name: def.name,
        arabicName: `خط مغلف ومعزول حرارياً: ${def.fluidLabel || def.name.split(':')[0]}`,
        type: 'piping',
        section: 'CO2 Removal (Catacarb Section 200)',
        sectionNumber: 3,
        rowNumber: 4,
        position: def.points[Math.floor(def.points.length / 2)].clone(),
        inletStream: 'Process Fluid Stream',
        outletStream: 'Downstream Unit',
        operatingTemp: def.name.match(/\(([^)]+°C[^)]*)\)/)?.[1] || (isHotStream ? '115°C' : '38°C'),
        operatingPress: def.name.match(/\(([^)]+bar[^)]*)\)/)?.[1] || '28.0 bar',
        catalystOrInternals: 'عزل حراري كامل: صوف صخري عالي الكثافة (Mineral Wool 100mm) مغلف بألواح ألومنيوم مضلعة Stucco-Embossed 0.8mm مع أحزمة تثبيت ستانلس ستيل SS304',
        description: 'خط أنابيب صناعي مغلف ومعزول حرارياً بالكامل وفق معايير ASME/ISO لمنع الفقد الحراري، وضمان كفاءة الطاقة، وحماية الكوادر التشغيلية (Personnel Protection).'
      };

      pipeGroup.userData = {
        equipmentId: pipeEquipId,
        equipmentInfo: pipeEquipInfo,
        isClickable: true
      };
      this.interactiveMeshes.push(pipeGroup);

      pipeGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.userData = {
            equipmentId: pipeEquipId,
            equipmentInfo: pipeEquipInfo,
            isClickable: true
          };
          this.interactiveMeshes.push(child);
        }
      });

      // 4. Smooth continuous particle flow stream along orthogonal segments
      const curvePath = new THREE.CurvePath<THREE.Vector3>();
      for (let i = 0; i < def.points.length - 1; i++) {
        const p1 = def.points[i];
        const p2 = def.points[i + 1];
        if (p1.distanceTo(p2) > 0.01) {
          curvePath.add(new THREE.LineCurve3(p1, p2));
        }
      }
      this.addParticleFlowStream(curvePath, def.particleColor, def.speed);
    });
  }

  // Toggle Thermal Insulation Cladding Mode (Full Aluminum Jacketing <-> Translucent Inspection)
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

  // 13. High-Visibility Industrial Badges & Tags with Arabic Typography & DCS Telemetry
  private buildEquipmentBadgesAndSigns() {
    const badgeDirectory: Array<{
      tag: string;
      ar: string;
      param: string;
      pos: THREE.Vector3;
      scale?: [number, number];
    }> = [
      { tag: 'T-201', ar: 'برج امتصاص كاتاكارب T-201', param: '4 Packed Beds | 80°C Top (Lean) | 105°C Mid (Semi-Lean) | 28 bar | 92m H', pos: new THREE.Vector3(-45, 96.0, -60), scale: [16.0, 5.8] },
      { tag: 'T-202', ar: 'برج التجريد والتنشيط T-202', param: 'Flash & Stripping Beds | 122°C Bottom | 1.46 bar | 88m Height', pos: new THREE.Vector3(65, 94.0, -60), scale: [16.0, 5.8] },
      { tag: 'E-201', ar: 'مرجل كاتاكارب الرئيسي E-201 (مرفوع على منصة)', param: '185°C -> 120°C (Tubes) | Q=42.5 Gcal/h | Primary Stripper Reboiler', pos: new THREE.Vector3(-140, 28.0, -60), scale: [11.0, 4.0] },
      { tag: 'V-201', ar: 'فاصل سائل المرجل V-201', param: '127°C | 28.2 kg/cm²A -> Syngas to T-201 Bottom Feed', pos: new THREE.Vector3(-95, 34.0, -60), scale: [10.0, 3.8] },
      { tag: 'V-204', ar: 'وعاء فصل الغاز المنقى V-204', param: '80°C | 28.0 kg/cm²A -> SynGas to Methanator Section 100', pos: new THREE.Vector3(-45, 32.0, -115), scale: [10.0, 3.8] },
      { tag: 'E-202', ar: 'مرجل البخار المساعد E-202 (مرفوع على منصة)', param: 'LP Steam (145°C) -> 122°C Boiled Soln to T-202 Bottom', pos: new THREE.Vector3(115, 26.0, -60), scale: [10.0, 3.8] },
      { tag: 'E-205 A,B', ar: 'مكثفات غاز CO2 العلوي E-205A/B (منصة علوية مع درج)', param: '97°C -> 40°C | In from T-202 Top -> Out to V-203', pos: new THREE.Vector3(160, 28.0, -60), scale: [11.0, 4.0] },
      { tag: 'V-203', ar: 'فاصل المتكثف والغاز الحامضي V-203', param: '40°C | 1.46 bar | Top Pure CO2 -> Urea Unit | Bot -> P-203', pos: new THREE.Vector3(190, 36.0, -60), scale: [11.0, 4.0] },
      { tag: 'P-203 A,B', ar: 'مضخات راجع المتكثف P-203A/B', param: 'Water Condensate from V-203 -> Reflux Wash to T-202 Top', pos: new THREE.Vector3(190, 20.0, -25), scale: [10.0, 3.8] },
      { tag: 'V-208 & P-207', ar: 'مستودع ومضخة متكثف البخار V-208 / P-207', param: 'Steam Condensate Recovery Drum & Pump -> Deaerator', pos: new THREE.Vector3(115, 18.0, -20), scale: [11.0, 4.0] },
      { tag: 'P-206 A,B', ar: 'مضخات حقن المتكاثف P-206A/B', param: 'V-201 Bottom -> Degasser Column V-209', pos: new THREE.Vector3(-95, 20.0, 30), scale: [10.0, 3.8] },
      { tag: 'P-201 A,B & P-201 HT', ar: 'قطار مضخات وتوربين استرجاع الطاقة P-201', param: 'Rich Soln to Turbine (28.2 bar) | Semi-Lean Pumps (28 bar) to E-207', pos: new THREE.Vector3(-35, 22.0, 30), scale: [13.0, 4.8] },
      { tag: 'E-207', ar: 'مبرد المحلول شبه المنقى E-207 (مرفوع على منصة)', param: '114°C -> 105°C (C.W. Cooled) -> Enters T-201 Middle Bed', pos: new THREE.Vector3(-35, 24.0, 65), scale: [10.0, 3.8] },
      { tag: 'E-204', ar: 'مبادل المحلول النقي E-204 (مرفوع على منصة)', param: 'Shell: Catacarb (120°C->80°C) | Tube: Water BFW (45°C->105°C)', pos: new THREE.Vector3(35, 24.0, 65), scale: [11.0, 4.0] },
      { tag: 'P-202 A,B', ar: 'مضخات المحلول النقي P-202A/B', param: '36.0 bar | Suction from E-204 -> F-201 Filter -> T-201 Top Feed', pos: new THREE.Vector3(35, 20.0, 30), scale: [11.0, 4.0] },
      { tag: 'F-201', ar: 'فلتر المحلول النقي عالي الضغط F-201', param: 'High Efficiency Cartridge Filter (P-202 Discharge -> T-201 Top)', pos: new THREE.Vector3(65, 20.0, 30), scale: [9.0, 3.4] },
      { tag: 'V-205', ar: 'خزان محلول كاتاكارب الرئيسي V-205', param: 'Catacarb Solution Bulk Storage (22m Dia)', pos: new THREE.Vector3(-140, 32.0, 105), scale: [11.0, 4.0] },
      { tag: 'V-207 & P-204', ar: 'حوض ومضخة التجميع السفلي V-207 / P-204', param: 'Sump Collection Pit & Submersible Pump -> V-205', pos: new THREE.Vector3(-90, 18.0, 105), scale: [10.0, 3.8] },
      { tag: 'K-201', ar: 'منفاخ هواء التجريد K-201', param: 'Degasser Stripping Air Blower -> V-209 Bottom', pos: new THREE.Vector3(-50, 18.0, 105), scale: [9.0, 3.4] },
      { tag: 'V-209', ar: 'برج نزع غاز المتكاثف V-209', param: 'Condensate Degasser & Stripping Column', pos: new THREE.Vector3(-15, 42.0, 105), scale: [10.0, 3.8] },
      { tag: 'E-206', ar: 'مبرد المتكاثف المعالج E-206', param: 'Stripped Condensate Cooler (90°C -> 45°C)', pos: new THREE.Vector3(25, 18.0, 105), scale: [9.0, 3.4] },
      { tag: 'P-208 A,B', ar: 'مضخات تصريف المتكاثف P-208A/B', param: 'Treated Condensate -> CW Tower Make-up', pos: new THREE.Vector3(55, 18.0, 105), scale: [10.0, 3.8] },
      { tag: 'V-206 & P-205 A,B', ar: 'منظومة حقن مانع الرغوة V-206 / P-205', param: 'Anti-Foam Chemical Tank & Precision Dosing Pumps', pos: new THREE.Vector3(105, 18.0, 105), scale: [11.0, 4.0] }
    ];

    badgeDirectory.forEach((item) => {
      const tagCanvas = document.createElement('canvas');
      tagCanvas.width = 1024;
      tagCanvas.height = 360;
      const ctx = tagCanvas.getContext('2d')!;

      // Glassmorphic dark badge background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(0, 0, 1024, 360);

      // Cyan accent border
      ctx.strokeStyle = '#00e5aa';
      ctx.lineWidth = 12;
      ctx.strokeRect(8, 8, 1008, 344);

      // Inner subtle border
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 984, 320);

      // Tag header
      ctx.fillStyle = '#00e5aa';
      ctx.font = 'bold 84px "Tajawal", "Cairo", "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.tag, 512, 105);

      // Arabic Description with crisp typography
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 44px "Tajawal", "Cairo", "Segoe UI", sans-serif';
      ctx.fillText(item.ar, 512, 210);

      // Engineering operating telemetry
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 36px "Consolas", monospace';
      ctx.fillText(item.param, 512, 295);

      const tex = new THREE.CanvasTexture(tagCanvas);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      const sprite = new THREE.Sprite(spriteMat);
      const sx = item.scale ? item.scale[0] : 8.0;
      const sy = item.scale ? item.scale[1] : 3.0;
      sprite.scale.set(sx, sy, 1);
      sprite.position.copy(item.pos);
      this.group.add(sprite);
    });
  }

  // 14. Grand Master DCS Operations & PFD Display Screen
  private buildDcsInfoScreens() {
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 0, 135);
    screenGroup.name = 'Unit200_Master_PFD_Station';

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

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    bgGrad.addColorStop(0, '#040b15');
    bgGrad.addColorStop(1, '#02060b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // High-tech borders
    ctx.strokeStyle = '#00e5aa';
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, 2032, 1008);

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 2008, 984);

    // Title banner
    ctx.fillStyle = 'rgba(0, 229, 170, 0.12)';
    ctx.fillRect(24, 24, 2000, 95);

    ctx.fillStyle = '#00e5aa';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText('🧪 لوحة القيادة التكنولوجية ومطابقة دليل التشغيل لقسم إزالة CO₂ كاتاكارب (Dwg. 6112P-100-200-00)', 45, 68);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('CATACARB CO2 REMOVAL & PURIFICATION SYSTEM — DWG 6112P (PAGES C-8 TO C-13) — BASRA FERTILIZER COMPLEX NO. 3', 45, 104);

    // Left Column: Process Streams & Technology Overview (X: 45 -> 1060)
    ctx.fillStyle = '#0a1d30';
    ctx.fillRect(45, 135, 1020, 770);
    ctx.strokeStyle = '#15416b';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 135, 1020, 770);

    ctx.fillStyle = '#00e5aa';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('⚙️ مسارات الدورة التكنولوجية وتوزيع التدفق (Process Streams & Flow Logic):', 65, 175);

    const streams = [
      {
        num: '1',
        title: 'امتصاص CO2 ثنائي المراحل في T-201 (C-8 & C-9):',
        desc: 'تغذية غاز العملية عند 127°C وضغط 27 kg/cm²G. خفض CO2 إلى 0.1% جاف بواسطة Semi-Lean في 3 أقسام سفلية و Lean في القمة.',
        color: '#10b981'
      },
      {
        num: '2',
        title: 'تجريد المحلول واسترجاع الحرارة في T-202 (C-9):',
        desc: 'ضغط القاع 0.7 kg/cm²G. 90% من الحرارة يزودها غاز العملية (185°C) في E-201، و 10% بالبخار 3 kg/cm²G في E-202.',
        color: '#06b6d4'
      },
      {
        num: '3',
        title: 'التوربين الهيدروليكي P-201HT وتدوير Semi-Lean (C-10):',
        desc: 'المحلول الغني (112°C, 27 bar) يدير التوربين P-201HT المقترن بمحرك P-201A موفراً > 50% من القدرة. بايباص LRC-202-2V.',
        color: '#f59e0b'
      },
      {
        num: '4',
        title: 'مبرد المحلول شبه المنقى E-207 (C-10):',
        desc: 'سحب Semi-Lean من وسط T-202 عند 114°C، وتبريده في E-207 إلى 105°C قبل ضخه بـ 28 kg/cm²G لوسط T-201.',
        color: '#fbbf24'
      },
      {
        num: '5',
        title: 'حلقة المحلول المنقى Lean ومبادل مياه المراجل E-204 (C-11):',
        desc: 'محلول القاع (120°C) يبرد في E-204 إلى 80°C (بتجاوز BFW و TIC-203)، ويضخ بـ P-202 A/B (28.5 bar) مع فلتر جانبي F-201.',
        color: '#38bdf8'
      },
      {
        num: '6',
        title: 'مثبط الفاناديوم V⁵⁺ ومانع الرغوة P-205 (C-11):',
        desc: 'حقن هواء العملية عبر FIC-206 بمخرج P-201HT لحفظ الفاناديوم خماسي التكافؤ النشط، مع حقن مانع الرغوة P-205AB.',
        color: '#a855f7'
      },
      {
        num: '7',
        title: 'مكثفات القمة E-205 A/B وتصدير 61,000 kg/h لليوريا (C-12):',
        desc: 'أبخرة القمة (97°C) تبرد إلى 50°C في E-205AB، ويفصل الماء الحامضي في V-203 ليرجع كغسيل لـ 4 صواني بـ T-202.',
        color: '#f87171'
      },
      {
        num: '8',
        title: 'عازل V-204 والميثانايتر R-106 للتنقية النهائية (C-12/13):',
        desc: 'V-204 يحجز رذاذ البوتاسيوم. R-106 يهدرج CO+CO2 عند 310°C (TIC-124) إلى ميثان وخفض أكاسيد الكربون إلى < 10 ppm.',
        color: '#4ade80'
      }
    ];

    let startY = 220;
    streams.forEach((st) => {
      ctx.fillStyle = st.color;
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`${st.num}. ${st.title}`, 65, startY);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '16.5px sans-serif';
      ctx.fillText(st.desc, 90, startY + 28);

      startY += 68;
    });

    // Right Column: Operating Parameters Matrix Table (X: 1090 -> 2003)
    ctx.fillStyle = '#0a1d30';
    ctx.fillRect(1090, 135, 913, 770);
    ctx.strokeStyle = '#15416b';
    ctx.lineWidth = 2;
    ctx.strokeRect(1090, 135, 913, 770);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('📊 مصفوفة المعاملات والظروف التشغيلية المطابقة (Operating Matrix):', 1110, 175);

    const paramHeaders = ['المعدة / النقطة', 'الحرارة Design', 'الضغط Operating', 'الوظيفة'];
    ctx.fillStyle = '#102d4c';
    ctx.fillRect(1110, 195, 873, 38);
    ctx.fillStyle = '#00e5aa';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(paramHeaders[0], 1125, 220);
    ctx.fillText(paramHeaders[1], 1340, 220);
    ctx.fillText(paramHeaders[2], 1530, 220);
    ctx.fillText(paramHeaders[3], 1750, 220);

    const paramRows = [
      ['برج الامتصاص T-201', '127°C قاع / 80°C قمة', '27.0 kg/cm²G', 'امتصاص CO2 إلى 0.1%'],
      ['برج التجريد T-202', '120°C قاع / 97°C قمة', '0.70 kg/cm²G', 'تجريد وتحرير CO2 عالي النقاوة'],
      ['مرجل الغاز E-201', '185°C دخول / 120°C خروج', '28.0 / 0.7 kg/cm²', 'تأمين 90% من حرارة التجريد'],
      ['المرجل البخاري E-202', '143°C بخار / 120°C غليان', '3.0 kg/cm²G بخار', 'تأمين 10% ضبط حراري إضافي'],
      ['التوربين P-201HT', '112°C محلول غني', '27 ➔ 0.7 kg/cm²', 'استرجاع الطاقة لتدوير P-201A'],
      ['مضخات Semi-Lean P-201', '114°C سحب ➔ 105°C مخرج', '0.7 ➔ 28.0 kg/cm²', 'ضخ 75% من المحلول لوسط T-201'],
      ['مبادل Lean / BFW E-204', '120°C مدخل ➔ 80°C مخرج', '0.7 kg/cm² (Shell)', 'تبريد Lean وتسخين ماء المراجل'],
      ['مضخات Lean P-202', '80°C سحب المحلول', '0.7 ➔ 28.5 kg/cm²', 'ضخ 25% من المحلول لقمة T-201'],
      ['مكثفات القمة E-205AB', '97°C مدخل ➔ 50°C مخرج', '0.65 kg/cm²G', 'تكثيف المتكثف الحامضي'],
      ['فاصل الغاز الحامضي V-203', '50°C فصل مائي/غازي', '0.60 kg/cm²G', 'تصدير 61,000 kg/h لليوريا'],
      ['برج نزع الغازات V-209', '60°C - 80°C متكثف', 'ضغط جوي (K-201)', 'تجريد H2/CH4 بالهواء قبل التبريد'],
      ['الميثانايتر R-106', '310°C مدخل (TIC-124)', '26.0 kg/cm²G', 'هدرجة أكاسيد الكربون (< 10 ppm)']
    ];

    let rowY = 265;
    paramRows.forEach((r, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? 'rgba(15, 39, 66, 0.4)' : 'rgba(8, 22, 38, 0.4)';
      ctx.fillRect(1110, rowY - 22, 873, 34);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(r[0], 1125, rowY);

      ctx.fillStyle = '#f59e0b';
      ctx.fillText(r[1], 1340, rowY);

      ctx.fillStyle = '#00e5aa';
      ctx.fillText(r[2], 1530, rowY);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '14.5px sans-serif';
      ctx.fillText(r[3], 1750, rowY);

      rowY += 40;
    });

    // Bottom Action Prompt Banner (X: 45 -> 2003, Y: 920 -> 995)
    ctx.fillStyle = 'rgba(0, 229, 170, 0.2)';
    ctx.fillRect(45, 920, 1958, 75);
    ctx.strokeStyle = '#00e5aa';
    ctx.lineWidth = 3;
    ctx.strokeRect(45, 920, 1958, 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('🔘 انقر على الشاشة لفتح بنك الـ 100 سؤال ودليل التشغيل التخصصي الشامل للقسم 200 (C-8..C-13) 📝', 180, 968);

    const texture = new THREE.CanvasTexture(canvas);
    const screenGeo = new THREE.PlaneGeometry(30.0, 15.0);
    const screenMat = new THREE.MeshBasicMaterial({ map: texture });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 13.5, 0.5);
    screenGroup.add(screenMesh);

    const frameGeo = new THREE.BoxGeometry(30.8, 15.8, 0.6);
    const frameMesh = new THREE.Mesh(frameGeo, this.matCatwalkSteel);
    frameMesh.position.set(0, 13.5, 0.1);
    screenGroup.add(frameMesh);

    // Interactive Terminal Desk in front of screen
    const terminalDeskGeo = new THREE.BoxGeometry(4.0, 1.2, 1.8);
    const terminalDesk = new THREE.Mesh(terminalDeskGeo, this.matCatwalkSteel);
    terminalDesk.position.set(0, 6.4, 2.5);
    screenGroup.add(terminalDesk);

    const terminalScreenGeo = new THREE.PlaneGeometry(3.6, 1.4);
    const terminalScreenMat = new THREE.MeshBasicMaterial({ color: 0x00e5aa });
    const terminalScreen = new THREE.Mesh(terminalScreenGeo, terminalScreenMat);
    terminalScreen.position.set(0, 7.05, 2.6);
    terminalScreen.rotation.x = -Math.PI / 4;
    screenGroup.add(terminalScreen);

    // Register screen and interactive terminal mesh
    this.registerInteractive(screenMesh, 'unit200_master_dcs_screen');
    this.registerInteractive(terminalScreen, 'unit200_master_dcs_screen');

    this.group.add(screenGroup);
  }

  // --- Geometry Construction Helpers ---

  // High-Detail Industrial Elevated Structural Steel Table / Platform with Access Staircase & OSHA Handrails
  private createElevatedPlatformWithStairs(options: {
    widthX: number;
    lengthZ: number;
    deckHeight: number;
    stairSide: 'south' | 'north' | 'east' | 'west';
    stairOffset?: number;
    railOpeningWidth?: number;
  }): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Elevated_Platform_Structure';
    const { widthX, lengthZ, deckHeight, stairSide, stairOffset = 0, railOpeningWidth = 3.2 } = options;

    const halfW = widthX / 2;
    const halfL = lengthZ / 2;

    // 1. Concrete Spread Footings & Heavy Structural Steel Columns (HEB bents)
    const numBentsX = Math.max(2, Math.round(widthX / 7.5) + 1);
    const numBentsZ = Math.max(2, Math.round(lengthZ / 6.5) + 1);

    for (let ix = 0; ix < numBentsX; ix++) {
      const x = -halfW + (ix / (numBentsX - 1)) * widthX;
      for (let iz = 0; iz < numBentsZ; iz++) {
        const z = -halfL + (iz / (numBentsZ - 1)) * lengthZ;

        // Concrete spread pedestal
        const foot = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 2.2), this.matConcretePad);
        foot.position.set(x, 0.6, z);
        group.add(foot);

        // Heavy H-Column
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.7, deckHeight, 0.7), this.matCatwalkSteel);
        col.position.set(x, deckHeight / 2, z);
        group.add(col);
      }
    }

    // 2. Transverse & Longitudinal Steel Girders beneath deck
    for (let ix = 0; ix < numBentsX; ix++) {
      const x = -halfW + (ix / (numBentsX - 1)) * widthX;
      const gZ = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, lengthZ), this.matCatwalkSteel);
      gZ.position.set(x, deckHeight - 0.35, 0);
      group.add(gZ);
    }
    for (let iz = 0; iz < numBentsZ; iz++) {
      const z = -halfL + (iz / (numBentsZ - 1)) * lengthZ;
      const gX = new THREE.Mesh(new THREE.BoxGeometry(widthX, 0.7, 0.5), this.matCatwalkSteel);
      gX.position.set(0, deckHeight - 0.35, z);
      group.add(gX);
    }

    // 3. Diagonal X-Bracing on perimeter bays
    [-halfW, halfW].forEach((xSide) => {
      const braceGeo = new THREE.CylinderGeometry(0.12, 0.12, Math.sqrt(deckHeight * deckHeight + 36), 8);
      const b1 = new THREE.Mesh(braceGeo, this.matCatwalkSteel);
      b1.position.set(xSide, deckHeight / 2, 0);
      b1.rotation.x = Math.atan2(6.0, deckHeight);
      group.add(b1);
    });

    // 4. Heavy Galvanized Steel Grating Floor Deck
    const deckGeo = new THREE.BoxGeometry(widthX, 0.25, lengthZ);
    const deck = new THREE.Mesh(deckGeo, this.matCatwalkSteel);
    deck.position.set(0, deckHeight, 0);
    group.add(deck);

    // 5. OSHA Yellow Safety Handrails (1.15m height with mid-rail and toe-board)
    const railMat = this.matYellowSafety;

    const buildRailLine = (start: THREE.Vector3, end: THREE.Vector3) => {
      const dist = start.distanceTo(end);
      if (dist < 0.5) return;
      const dir = new THREE.Vector3().subVectors(end, start).normalize();
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

      // Top rail (1.15m above deck)
      const topR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, dist, 8), railMat);
      topR.position.set(mid.x, deckHeight + 1.15, mid.z);
      if (Math.abs(dir.x) > 0.9) topR.rotation.z = Math.PI / 2;
      else topR.rotation.x = Math.PI / 2;
      group.add(topR);

      // Mid rail (0.6m above deck)
      const midR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, dist, 8), railMat);
      midR.position.set(mid.x, deckHeight + 0.6, mid.z);
      if (Math.abs(dir.x) > 0.9) midR.rotation.z = Math.PI / 2;
      else midR.rotation.x = Math.PI / 2;
      group.add(midR);

      // Toe-board (kickplate 0.15m high)
      const tbGeo = Math.abs(dir.x) > 0.9 ? new THREE.BoxGeometry(dist, 0.15, 0.04) : new THREE.BoxGeometry(0.04, 0.15, dist);
      const tb = new THREE.Mesh(tbGeo, railMat);
      tb.position.set(mid.x, deckHeight + 0.1, mid.z);
      group.add(tb);

      // Vertical Stanchions every 2.5m
      const numPosts = Math.max(2, Math.round(dist / 2.5) + 1);
      for (let p = 0; p < numPosts; p++) {
        const pt = new THREE.Vector3().addVectors(start, dir.clone().multiplyScalar((p / (numPosts - 1)) * dist));
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.15, 8), railMat);
        post.position.set(pt.x, deckHeight + 0.575, pt.z);
        group.add(post);
      }
    };

    // North rail (Z = -halfL)
    if (stairSide !== 'north') {
      buildRailLine(new THREE.Vector3(-halfW, 0, -halfL), new THREE.Vector3(halfW, 0, -halfL));
    } else {
      buildRailLine(new THREE.Vector3(-halfW, 0, -halfL), new THREE.Vector3(stairOffset - railOpeningWidth / 2, 0, -halfL));
      buildRailLine(new THREE.Vector3(stairOffset + railOpeningWidth / 2, 0, -halfL), new THREE.Vector3(halfW, 0, -halfL));
    }

    // South rail (Z = +halfL)
    if (stairSide !== 'south') {
      buildRailLine(new THREE.Vector3(-halfW, 0, halfL), new THREE.Vector3(halfW, 0, halfL));
    } else {
      buildRailLine(new THREE.Vector3(-halfW, 0, halfL), new THREE.Vector3(stairOffset - railOpeningWidth / 2, 0, halfL));
      buildRailLine(new THREE.Vector3(stairOffset + railOpeningWidth / 2, 0, halfL), new THREE.Vector3(halfW, 0, halfL));
    }

    // West rail (X = -halfW)
    if (stairSide !== 'west') {
      buildRailLine(new THREE.Vector3(-halfW, 0, -halfL), new THREE.Vector3(-halfW, 0, halfL));
    } else {
      buildRailLine(new THREE.Vector3(-halfW, 0, -halfL), new THREE.Vector3(-halfW, 0, stairOffset - railOpeningWidth / 2));
      buildRailLine(new THREE.Vector3(-halfW, 0, stairOffset + railOpeningWidth / 2), new THREE.Vector3(-halfW, 0, halfL));
    }

    // East rail (X = +halfW)
    if (stairSide !== 'east') {
      buildRailLine(new THREE.Vector3(halfW, 0, -halfL), new THREE.Vector3(halfW, 0, halfL));
    } else {
      buildRailLine(new THREE.Vector3(halfW, 0, -halfL), new THREE.Vector3(halfW, 0, stairOffset - railOpeningWidth / 2));
      buildRailLine(new THREE.Vector3(halfW, 0, stairOffset + railOpeningWidth / 2), new THREE.Vector3(halfW, 0, halfL));
    }

    // 6. Industrial Steel Access Staircase (درج وصول صناعي)
    const stairRun = deckHeight * 1.35; // ~37° industrial angle
    const numSteps = Math.max(8, Math.round(deckHeight / 0.28));
    const stairWidth = 2.4;

    const stairGroup = new THREE.Group();
    stairGroup.name = 'Access_Staircase';

    for (let s = 0; s < numSteps; s++) {
      const frac = s / numSteps;
      const stepY = frac * deckHeight;
      const stepZ = frac * stairRun;

      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(stairWidth, 0.12, 0.6), this.matCatwalkSteel);
      stepMesh.position.set(0, stepY + 0.06, stepZ);
      stairGroup.add(stepMesh);
    }

    // Dual Channel Stringers (عوارض الدرج)
    const stringerLen = Math.sqrt(deckHeight * deckHeight + stairRun * stairRun);
    const stringerAng = Math.atan2(deckHeight, stairRun);

    [-stairWidth / 2, stairWidth / 2].forEach((xSide) => {
      const str = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, stringerLen), this.matCatwalkSteel);
      str.position.set(xSide, deckHeight / 2, stairRun / 2);
      str.rotation.x = stringerAng;
      stairGroup.add(str);

      // Stair Handrail
      const sRail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, stringerLen, 8), railMat);
      sRail.position.set(xSide, deckHeight / 2 + 1.05, stairRun / 2);
      sRail.rotation.x = stringerAng;
      stairGroup.add(sRail);

      // Stair intermediate rail
      const sMidRail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, stringerLen, 8), railMat);
      sMidRail.position.set(xSide, deckHeight / 2 + 0.55, stairRun / 2);
      sMidRail.rotation.x = stringerAng;
      stairGroup.add(sMidRail);
    });

    // Position the staircase based on stairSide
    if (stairSide === 'south') {
      stairGroup.position.set(stairOffset, 0, halfL);
    } else if (stairSide === 'north') {
      stairGroup.rotation.y = Math.PI;
      stairGroup.position.set(stairOffset, 0, -halfL);
    } else if (stairSide === 'east') {
      stairGroup.rotation.y = -Math.PI / 2;
      stairGroup.position.set(halfW, 0, stairOffset);
    } else if (stairSide === 'west') {
      stairGroup.rotation.y = Math.PI / 2;
      stairGroup.position.set(-halfW, 0, stairOffset);
    }

    group.add(stairGroup);

    return group;
  }

  private createHorizontalShell(diameter: number, length: number, material: THREE.Material): THREE.Group {
    const group = new THREE.Group();
    const radius = diameter / 2;

    const cylGeo = new THREE.CylinderGeometry(radius, radius, length, 36);
    const cyl = new THREE.Mesh(cylGeo, material);
    cyl.rotation.z = Math.PI / 2;
    group.add(cyl);

    const headGeo = new THREE.SphereGeometry(radius, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2);
    const leftHead = new THREE.Mesh(headGeo, material);
    leftHead.rotation.z = Math.PI / 2;
    leftHead.position.set(-length / 2, 0, 0);
    group.add(leftHead);

    const rightHead = new THREE.Mesh(headGeo, material);
    rightHead.rotation.z = -Math.PI / 2;
    rightHead.position.set(length / 2, 0, 0);
    group.add(rightHead);

    // Dual Reinforced Concrete Support Saddles with Steel Base Plates
    [-length / 3.2, length / 3.2].forEach((xOff) => {
      const saddleGeo = new THREE.BoxGeometry(2.8, radius * 1.3, diameter * 1.2);
      const saddle = new THREE.Mesh(saddleGeo, this.matConcretePad);
      saddle.position.set(xOff, -radius * 0.7, 0);
      group.add(saddle);
    });

    return group;
  }

  private createVerticalExchanger(
    tag: string,
    diameter: number,
    height: number,
    shellMat: THREE.Material,
    headMat: THREE.Material
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = tag;
    const radius = diameter / 2;

    const padGeo = new THREE.CylinderGeometry(radius * 1.3, radius * 1.45, 1.8, 24);
    const pad = new THREE.Mesh(padGeo, this.matConcretePad);
    pad.position.set(0, 0.9, 0);
    group.add(pad);

    const skirtGeo = new THREE.CylinderGeometry(radius, radius * 1.08, 4.0, 24, 1, true);
    const skirt = new THREE.Mesh(skirtGeo, this.matCarbonSteel);
    skirt.position.set(0, 3.8, 0);
    group.add(skirt);

    const cylGeo = new THREE.CylinderGeometry(radius, radius, height, 32);
    const cyl = new THREE.Mesh(cylGeo, shellMat);
    cyl.position.set(0, height / 2 + 5.8, 0);
    group.add(cyl);

    const headGeo = new THREE.SphereGeometry(radius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const topHead = new THREE.Mesh(headGeo, headMat);
    topHead.position.set(0, height + 5.8, 0);
    group.add(topHead);

    const botHead = new THREE.Mesh(headGeo, headMat);
    botHead.rotation.x = Math.PI;
    botHead.position.set(0, 5.8, 0);
    group.add(botHead);

    return group;
  }

  private addNozzleWithFlange(
    parent: THREE.Group,
    pos: THREE.Vector3,
    dir: THREE.Vector3,
    pipeRadius: number = 0.8,
    nozzleLength: number = 2.5
  ) {
    const group = new THREE.Group();
    group.position.copy(pos);

    const normalizedDir = dir.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    if (Math.abs(normalizedDir.dot(up)) < 0.999) {
      group.quaternion.setFromUnitVectors(up, normalizedDir);
    } else if (normalizedDir.y < 0) {
      group.rotation.x = Math.PI;
    }

    const neckGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, nozzleLength, 16);
    const neck = new THREE.Mesh(neckGeo, this.matCarbonSteel);
    neck.position.set(0, nozzleLength / 2, 0);
    group.add(neck);

    const flangeGeo = new THREE.CylinderGeometry(pipeRadius * 1.5, pipeRadius * 1.5, 0.4, 16);
    const flange = new THREE.Mesh(flangeGeo, this.matFlange);
    flange.position.set(0, nozzleLength, 0);
    group.add(flange);

    for (let b = 0; b < 8; b++) {
      const angle = (b / 8) * Math.PI * 2;
      const boltGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.55, 8);
      const bolt = new THREE.Mesh(boltGeo, this.matStudBolt);
      bolt.position.set(Math.cos(angle) * (pipeRadius * 1.25), nozzleLength, Math.sin(angle) * (pipeRadius * 1.25));
      group.add(bolt);
    }

    parent.add(group);
  }

  private createSmoothOrthogonalCurve(points: THREE.Vector3[], elbowRadius: number = 2.5): THREE.CurvePath<THREE.Vector3> {
    const curvePath = new THREE.CurvePath<THREE.Vector3>();
    if (!points || points.length < 2) return curvePath;

    if (points.length === 2) {
      if (points[0].distanceTo(points[1]) > 0.01) {
        curvePath.add(new THREE.LineCurve3(points[0], points[1]));
      }
      return curvePath;
    }

    let currentStart = points[0].clone();

    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];

      const v1 = new THREE.Vector3().subVectors(prev, curr);
      const v2 = new THREE.Vector3().subVectors(next, curr);
      const len1 = v1.length();
      const len2 = v2.length();

      if (len1 < 0.1 || len2 < 0.1) continue;

      v1.normalize();
      v2.normalize();

      // Industrial elbow bend radius (up to max 42% of adjacent pipe length)
      const actualRadius = Math.min(elbowRadius, len1 * 0.42, len2 * 0.42);

      const cornerStart = curr.clone().addScaledVector(v1, actualRadius);
      const cornerEnd = curr.clone().addScaledVector(v2, actualRadius);

      // 1. Straight segment to the elbow start
      if (currentStart.distanceTo(cornerStart) > 0.02) {
        curvePath.add(new THREE.LineCurve3(currentStart, cornerStart));
      }

      // 2. Smooth quadratic bezier curve for the 90-degree elbow fitting
      curvePath.add(new THREE.QuadraticBezierCurve3(cornerStart, curr, cornerEnd));

      currentStart = cornerEnd;
    }

    // 3. Final straight segment to destination nozzle
    const lastPoint = points[points.length - 1];
    if (currentStart.distanceTo(lastPoint) > 0.02) {
      curvePath.add(new THREE.LineCurve3(currentStart, lastPoint));
    }

    return curvePath;
  }

  private createOrthogonalCurve(points: THREE.Vector3[]): THREE.CurvePath<THREE.Vector3> {
    return this.createSmoothOrthogonalCurve(points, 2.5);
  }

  private addParticleFlowStream(curve: THREE.CurvePath<THREE.Vector3>, color: number, speed: number = 0.08) {
    const particleCount = Math.max(30, Math.floor(curve.getLength() * 3.5));
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const progress = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      progress[i] = i / particleCount;
      const pt = curve.getPointAt(progress[i]);
      if (pt) {
        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = pt.z;
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: color,
      size: 1.2,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const pSystem = new THREE.Points(geo, mat);
    this.group.add(pSystem);

    this.particleSystems.push({
      points: pSystem,
      curve: curve,
      progress: progress,
      speed: speed
    });
  }

  private registerInteractive(obj: THREE.Object3D, equipmentId: string) {
    const info = MASTER_EQUIPMENT_DATA.find((e) => e.id.toLowerCase() === equipmentId.toLowerCase()) || {
      id: equipmentId,
      tag: equipmentId.toUpperCase(),
      name: `${equipmentId.toUpperCase()} Unit`,
      arabicName: `المعدة ${equipmentId.toUpperCase()}`,
      type: 'vessel',
      section: 'CO2 Removal (Catacarb)',
      sectionNumber: 3,
      rowNumber: 4,
      position: obj.position.clone(),
      inletStream: 'Process Fluid Stream',
      outletStream: 'Treated Process Fluid Stream',
      operatingTemp: '120°C',
      operatingPress: '28.0 kg/cm²G',
      catalystOrInternals: 'High-efficiency SS Internals',
      description: 'CO2 Removal System Equipment Component.'
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

  private particleFrameCount: number = 0;

  public update(delta: number) {
    if (!this.group.visible) return;

    // Dynamic Fluid Particle Loop Animation (optimized: only active & visible particle systems)
    this.particleFrameCount = (this.particleFrameCount + 1) % 60;
    if (this.particleFrameCount % 2 === 0) {
      const stepDelta = delta * 2.0;
      this.particleSystems.forEach((sys) => {
        if (!sys.points.visible) return;
        const positions = sys.points.geometry.attributes.position.array as Float32Array;
        const count = sys.progress.length;

        for (let i = 0; i < count; i++) {
          sys.progress[i] += stepDelta * sys.speed;
          if (sys.progress[i] > 1.0) sys.progress[i] -= 1.0;
          if (sys.progress[i] < 0.0) sys.progress[i] += 1.0;

          const pt = sys.curve.getPointAt(sys.progress[i]);
          if (pt) {
            positions[i * 3] = pt.x;
            positions[i * 3 + 1] = pt.y;
            positions[i * 3 + 2] = pt.z;
          }
        }
        sys.points.geometry.attributes.position.needsUpdate = true;
      });
    }

    // Rotating Shafts Simulation
    this.rotatingShafts.forEach((shaft) => {
      shaft.rotation.x += delta * 15.0;
    });
  }
}
