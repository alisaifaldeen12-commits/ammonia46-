import * as THREE from 'three';
import {
  createCarbonSteelTexture,
  createFlowLabelTexture,
  createSunsetEnvMap,
  createIraqiFlagTexture,
  createWetGroundTexture,
  createPalmTrunkTexture,
  createOilDrumTexture,
  createTemperatureBadgeTexture,
  createControllerBadgeTexture,
  createEquipmentTagTexture,
  createPressureBadgeTexture,
} from './TextureGenerator';
import {
  MASTER_EQUIPMENT_DATA,
  MASTER_TEMPERATURE_POINTS,
  MASTER_CONTROLLER_POINTS,
  MASTER_PRESSURE_ANNOTATIONS,
  EquipmentInfo,
} from './PlantDiagramData';
import { Equipment3DBuilder, MaterialPalette } from './Equipment3DBuilder';
import { SteamSystem3D } from './SteamSystem3D';
import { SynthesisSection400_3D } from './SynthesisSection400_3D';
import { CO2RemovalSection200_3D } from './CO2RemovalSection200_3D';

export class AmmoniaPlant3D {
  public group: THREE.Group;
  public interactiveMeshes: THREE.Object3D[] = [];
  public equipmentMap: Map<string, THREE.Object3D> = new Map();
  public steamSystem!: SteamSystem3D;
  public synthesisSection400!: SynthesisSection400_3D;
  public co2RemovalSection200!: CO2RemovalSection200_3D;
  public onSelectCallback?: (info: EquipmentInfo) => void;

  // Subgroups for clean toggling
  private equipmentGroup: THREE.Group;
  private pipingGroup: THREE.Group;
  private flowParticlesGroup: THREE.Group;
  private tempBadgesGroup: THREE.Group;
  private controllerBadgesGroup: THREE.Group;
  private pressureBadgesGroup: THREE.Group;
  private equipmentTagsGroup: THREE.Group;
  private flagsGroup: THREE.Group;
  private nightLightsGroup: THREE.Group;
  private catalystGlowGroup: THREE.Group;

  // Materials
  private mats!: MaterialPalette;
  private pipeMat!: THREE.MeshStandardMaterial;
  private liquidPipeMat!: THREE.MeshStandardMaterial;
  private envMap!: THREE.CanvasTexture;
  private iraqiFlagTex!: THREE.CanvasTexture;

  // Animation assets
  private flareFlameMesh!: THREE.Mesh;
  private turbineRotors: THREE.Mesh[] = [];
  private particleSystems: Array<{
    points: THREE.Points;
    curve: THREE.Curve<THREE.Vector3>;
    progress: Float32Array;
    speed: number;
    isSection1?: boolean;
    isSectionCO2?: boolean;
    isSectionK301?: boolean;
    isSectionSynLoop?: boolean;
    isSectionRefrig?: boolean;
  }> = [];

  public static readonly SECTION_1_EQUIPMENT_IDS = new Set([
    'v-115', 'v-111', 'k-303', 'h-101', 'r-102ab', 'e-101', 'r-101', 'r-103', 'e-108',
    'r-104', 'e-107_e-109', 'e-110', 'v-101', 'r-105', 'e-106', 'e-107_meth', 'r-106', 'e-102', 'e-103', 'e-104', 'e-105'
  ]);

  public static readonly SECTION_CO2_EQUIPMENT_IDS = new Set([
    't-201', 'v-204', 'p-201ht', 'p-201ab', 'e-207', 't-202', 'e-201', 'v-201',
    'e-202', 'v-208', 'p-207', 'e-204', 'p-202ab', 'e-205ab', 'v-203', 'p-203ab',
    'k-501', 'j-201', 'v-206', 'p-205', 'v-209', 'e-206', 'p-208',
    'v-205', 'v-207', 'p-204', 'p-201', 'r-105', 'v-101'
  ]);

  public static readonly SECTION_K301_EQUIPMENT_IDS = new Set([
    'k-301', 'v-301', 'e-301', 'v-302', 'e-302', 'v-303', 'e-303', 'v-304', 'e-304', 'e-315', 'v-310',
    'r-106', 'e-106', 'e-107_meth'
  ]);

  public static readonly SECTION_SYNLOOP_EQUIPMENT_IDS = new Set([
    'h-401', 'j-401', 'r-401', 'e-401', 'e-402', 'e-403_shell', 'e-403_tube', 'e-404', 'v-401',
    'e-407', 'e-405', 'e-406', 'v-402', 'v-409', 'p-401ab', 'v-451b',
    'e-408', 'v-403', 'e-416', 'e-409', 'v-404',
    'k-401', 'v-405', 'v-406', 'v-407', 'e-412', 'v-408'
  ]);

  public static readonly SECTION_REFRIG_EQUIPMENT_IDS = new Set([
    'e-405', 'e-406', 'v-402', 'e-407', 'k-401', 'v-405', 'v-406', 'v-407', 'e-412', 'v-408', 'v-409', 'p-401ab', 'v-451b'
  ]);

  public static readonly SECTION_STEAM_EQUIPMENT_IDS = new Set([
    'e-108', 'v-103', 'e-102', 'e-103'
  ]);

  public static readonly SECTION_STORAGE_EQUIPMENT_IDS = new Set([
    'v-409', 'p-401ab', 'v-451b', 'f-401'
  ]);

  public currentIsolatedSection: string | null = null;

  constructor() {
    this.group = new THREE.Group();
    this.equipmentGroup = new THREE.Group();
    this.pipingGroup = new THREE.Group();
    this.flowParticlesGroup = new THREE.Group();
    this.tempBadgesGroup = new THREE.Group();
    this.controllerBadgesGroup = new THREE.Group();
    this.pressureBadgesGroup = new THREE.Group();
    this.equipmentTagsGroup = new THREE.Group();
    this.flagsGroup = new THREE.Group();
    this.nightLightsGroup = new THREE.Group();
    this.catalystGlowGroup = new THREE.Group();

    this.group.add(this.equipmentGroup);
    this.group.add(this.pipingGroup);
    this.group.add(this.flowParticlesGroup);
    this.group.add(this.tempBadgesGroup);
    // Controller badges removed as requested for cleaner 3D view
    this.group.add(this.pressureBadgesGroup);
    this.group.add(this.equipmentTagsGroup);
    this.group.add(this.flagsGroup);
    this.group.add(this.nightLightsGroup);
    this.group.add(this.catalystGlowGroup);

    this.initMaterials();
    this.buildGroundAndInfrastructure();
    this.buildAllMasterEquipment();
    this.buildMasterPipingNetwork();
    this.buildMasterTemperatureBadges();
    // buildMasterControllerBadges omitted for pristine, uncluttered 3D view
    this.buildMasterPressureBadges();
    this.buildEquipmentTags();

    // Isolated 3D Steam System & PRDS Unit
    this.steamSystem = new SteamSystem3D();
    this.steamSystem.group.position.set(-65, 0, 85);
    this.group.add(this.steamSystem.group);
    this.interactiveMeshes.push(...this.steamSystem.interactiveMeshes);
    this.steamSystem.onSelectCallback = (info) => {
      if (this.onSelectCallback) {
        this.onSelectCallback(info);
      }
    };

    // Isolated Dedicated 3D Digital Twin of Section 4: Ammonia Synthesis & Refrigeration
    this.synthesisSection400 = new SynthesisSection400_3D();
    this.synthesisSection400.group.visible = false;
    this.group.add(this.synthesisSection400.group);
    this.interactiveMeshes.push(...this.synthesisSection400.interactiveMeshes);
    this.synthesisSection400.onSelectCallback = (info) => {
      if (this.onSelectCallback) {
        this.onSelectCallback(info);
      }
    };

    // Isolated Dedicated 3D Digital Twin of Section 2: CO2 Removal (Catacarb Unit 200)
    this.co2RemovalSection200 = new CO2RemovalSection200_3D();
    this.co2RemovalSection200.group.visible = false;
    this.group.add(this.co2RemovalSection200.group);
    this.interactiveMeshes.push(...this.co2RemovalSection200.interactiveMeshes);
    this.co2RemovalSection200.onSelectCallback = (info) => {
      if (this.onSelectCallback) {
        this.onSelectCallback(info);
      }
    };
  }

  private initMaterials() {
    this.envMap = createSunsetEnvMap();
    this.iraqiFlagTex = createIraqiFlagTexture();

    const steelTex = createCarbonSteelTexture();
    steelTex.repeat.set(2, 4);

    const carbonSteel = new THREE.MeshStandardMaterial({
      map: steelTex,
      roughness: 0.28,
      metalness: 0.82,
      envMap: this.envMap,
      envMapIntensity: 1.5,
    });

    const polishedSteel = new THREE.MeshStandardMaterial({
      color: 0xddeefc,
      roughness: 0.12,
      metalness: 0.95,
      envMap: this.envMap,
      envMapIntensity: 2.0,
    });

    const heatSteel = new THREE.MeshStandardMaterial({
      color: 0x4a5a68,
      roughness: 0.35,
      metalness: 0.75,
      envMap: this.envMap,
    });

    const copperBronze = new THREE.MeshStandardMaterial({
      color: 0xb87333,
      roughness: 0.3,
      metalness: 0.8,
      envMap: this.envMap,
    });

    const insulationMat = new THREE.MeshStandardMaterial({
      color: 0xe0e6ed,
      roughness: 0.65,
      metalness: 0.2,
    });

    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x455058,
      roughness: 0.85,
      metalness: 0.1,
    });

    const flangeMat = new THREE.MeshStandardMaterial({
      color: 0x2c3842,
      roughness: 0.25,
      metalness: 0.9,
    });

    const catalystGlowMat = new THREE.MeshStandardMaterial({
      color: 0xff4500,
      emissive: 0xff2200,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });

    const catwalkMat = new THREE.MeshStandardMaterial({
      color: 0x22303c,
      roughness: 0.4,
      metalness: 0.8,
    });

    const railingMat = new THREE.MeshStandardMaterial({
      color: 0x00c8ef,
      roughness: 0.2,
      metalness: 0.85,
    });

    this.mats = {
      carbonSteel,
      polishedSteel,
      heatSteel,
      copperBronze,
      insulationMat,
      concreteMat,
      flangeMat,
      catalystGlowMat,
      catwalkMat,
      railingMat,
    };

    this.pipeMat = new THREE.MeshStandardMaterial({
      color: 0x5a6d7c,
      roughness: 0.22,
      metalness: 0.88,
      envMap: this.envMap,
      envMapIntensity: 1.4,
    });

    this.liquidPipeMat = new THREE.MeshStandardMaterial({
      color: 0x0088cc,
      roughness: 0.18,
      metalness: 0.9,
      envMap: this.envMap,
      envMapIntensity: 1.6,
    });
  }

  // Ground, Pipe Racks, Palm Trees, Chemical Drums, Safety Markings
  private buildGroundAndInfrastructure() {
    // Wet Concrete Ground Pad with Sunset Specular Reflection
    const groundGeo = new THREE.PlaneGeometry(160, 150);
    const groundTex = createWetGroundTexture();
    groundTex.repeat.set(4, 4);
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.22,
      metalness: 0.55,
      envMap: this.envMap,
      envMapIntensity: 1.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.01, 10);
    ground.receiveShadow = true;
    this.group.add(ground);

    // Multi-Tier Pipe Racks spanning across the plant rows
    const rackSteelMat = new THREE.MeshStandardMaterial({
      color: 0x2c3b48,
      metalness: 0.85,
      roughness: 0.25,
      envMap: this.envMap,
    });

    const rackZPositions = [-29, -15, -2, 11, 23, 37, 52];
    rackZPositions.forEach((z) => {
      for (let x = -55; x <= 50; x += 15) {
        // Vertical H-Columns
        const colGeo = new THREE.BoxGeometry(0.4, 5.8, 0.4);
        const col1 = new THREE.Mesh(colGeo, rackSteelMat);
        col1.position.set(x, 2.9, z - 1.5);
        const col2 = new THREE.Mesh(colGeo, rackSteelMat);
        col2.position.set(x, 2.9, z + 1.5);
        this.group.add(col1);
        this.group.add(col2);

        // Lower & Upper Crossbeams
        const beamGeo = new THREE.BoxGeometry(0.35, 0.35, 3.4);
        const b1 = new THREE.Mesh(beamGeo, rackSteelMat);
        b1.position.set(x, 3.2, z);
        const b2 = new THREE.Mesh(beamGeo, rackSteelMat);
        b2.position.set(x, 5.4, z);
        this.group.add(b1);
        this.group.add(b2);
      }

      // Longitudinal Pipe Support Trusses
      const trussGeo = new THREE.BoxGeometry(110, 0.25, 0.25);
      const t1 = new THREE.Mesh(trussGeo, rackSteelMat);
      t1.position.set(-2.5, 3.2, z - 1.2);
      const t2 = new THREE.Mesh(trussGeo, rackSteelMat);
      t2.position.set(-2.5, 3.2, z + 1.2);
      const t3 = new THREE.Mesh(trussGeo, rackSteelMat);
      t3.position.set(-2.5, 5.4, z);
      this.group.add(t1);
      this.group.add(t2);
      this.group.add(t3);
    });

    // Basra Palm Trees lining the perimeter (نخيل البصرة)
    const palmGroup = new THREE.Group();
    const trunkTex = createPalmTrunkTexture();
    const trunkMat = new THREE.MeshStandardMaterial({ map: trunkTex, roughness: 0.7 });
    const frondMat = new THREE.MeshStandardMaterial({ color: 0x185922, roughness: 0.4, side: THREE.DoubleSide });

    const palmCoords = [
      [-72, -45], [-72, -25], [-72, -5], [-72, 15], [-72, 35], [-72, 55],
      [72, -45], [72, -25], [72, -5], [72, 15], [72, 35], [72, 55],
      [-50, -52], [-25, -52], [0, -52], [25, -52], [50, -52],
    ];

    palmCoords.forEach(([px, pz]) => {
      const palm = new THREE.Group();
      palm.position.set(px, 0, pz);

      const trunkGeo = new THREE.CylinderGeometry(0.35, 0.55, 9.5, 12);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(0, 4.75, 0);
      trunk.rotation.z = (Math.random() - 0.5) * 0.15;
      palm.add(trunk);

      for (let f = 0; f < 12; f++) {
        const angle = (f / 12) * Math.PI * 2;
        const frondGeo = new THREE.PlaneGeometry(0.85, 4.8);
        const frond = new THREE.Mesh(frondGeo, frondMat);
        frond.position.set(0, 9.5, 0);
        frond.rotation.y = angle;
        frond.rotation.x = Math.PI / 3.2;
        frond.rotation.z = 0.2;
        palm.add(frond);
      }
      palmGroup.add(palm);
    });
    this.group.add(palmGroup);

    // Stored Chemical & Catalyst Drums
    const drumGroup = new THREE.Group();
    const colors = ['#0055aa', '#f5a800', '#222222', '#009966'];
    const drumSpots = [
      { x: -35, z: -30 },
      { x: 5, z: -18 },
      { x: -28, z: 20 },
      { x: 18, z: 38 },
    ];
    drumSpots.forEach((spot) => {
      const palletGeo = new THREE.BoxGeometry(3.2, 0.2, 3.2);
      const palletMat = new THREE.MeshStandardMaterial({ color: 0x6e4726 });
      const pallet = new THREE.Mesh(palletGeo, palletMat);
      pallet.position.set(spot.x, 0.1, spot.z);
      drumGroup.add(pallet);

      let c = 0;
      for (let dx of [-0.8, 0.8]) {
        for (let dz of [-0.8, 0.8]) {
          const drumTex = createOilDrumTexture(colors[c % colors.length]);
          c++;
          const dMat = new THREE.MeshStandardMaterial({ map: drumTex, metalness: 0.8, roughness: 0.3 });
          const dGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
          const drum = new THREE.Mesh(dGeo, dMat);
          drum.position.set(spot.x + dx, 0.95, spot.z + dz);
          drumGroup.add(drum);
        }
      }
    });
    this.group.add(drumGroup);
  }

  // Build all 50 pieces of equipment according to MASTER_EQUIPMENT_DATA
  private buildAllMasterEquipment() {
    const builder = new Equipment3DBuilder(this.mats);

    MASTER_EQUIPMENT_DATA.forEach((eq) => {
      let meshGroup: THREE.Group | null = null;

      switch (eq.id) {
        // --- ROW 1 ---
        case 'v-115':
          meshGroup = builder.buildVessel({ diameter: 2.4, height: 4.2, isVertical: true });
          break;
        case 'v-111':
          meshGroup = builder.buildVessel({ diameter: 2.2, height: 3.8, isVertical: true });
          break;
        case 'k-303': {
          const comp = builder.buildCompressorUnit({ length: 6.5, hasTurbine: true, numCasings: 2 });
          meshGroup = comp.group;
          this.turbineRotors.push(comp.shaftRotor);
          break;
        }
        case 'h-101':
          meshGroup = builder.buildFurnace({ width: 5.5, height: 5.8, depth: 5.5, stackHeight: 12 });
          break;

        // --- ROW 2 ---
        case 'r-102ab': {
          meshGroup = new THREE.Group();
          const rA = builder.buildReactor({ diameter: 2.2, height: 6.8, skirtHeight: 2.0 });
          rA.position.set(-1.8, 0, 0);
          const rB = builder.buildReactor({ diameter: 2.2, height: 6.8, skirtHeight: 2.0 });
          rB.position.set(1.8, 0, 0);
          meshGroup.add(rA);
          meshGroup.add(rB);
          break;
        }
        case 'e-101':
          meshGroup = builder.buildHeatExchanger({ length: 7.2, diameter: 1.8, isVertical: false });
          break;
        case 'r-101':
          meshGroup = builder.buildFurnace({
            width: 10.5,
            height: 9.0,
            depth: 13.5,
            hasTopConvectionBank: true,
            stackHeight: 22,
            hasRadiantTubes: true,
          });
          // Add Iraqi Flag on Top of Primary Reformer Stack
          const flagMesh = this.createIraqiFlagMesh(5.0);
          flagMesh.position.set(0, 36, 0);
          meshGroup.add(flagMesh);
          break;
        case 'r-103':
          meshGroup = builder.buildReactor({ diameter: 4.2, height: 11.5, skirtHeight: 3.0, hasWaterJacket: true });
          break;

        // --- ROW 3 ---
        case 'e-108':
          meshGroup = builder.buildHeatExchanger({ length: 6.5, diameter: 2.6, isVertical: false });
          break;
        case 'r-104':
          meshGroup = builder.buildReactor({ diameter: 3.8, height: 8.5, skirtHeight: 2.5, isMultiBed: true });
          break;
        case 'e-107_e-109':
          meshGroup = builder.buildHeatExchanger({ length: 6.8, diameter: 1.8, isDualShell: true });
          break;
        case 'e-110':
          meshGroup = builder.buildHeatExchanger({ length: 6.2, diameter: 2.0, isVertical: false });
          break;

        // --- ROW 4: CO2 REMOVAL & CATACARB ABSORPTION SYSTEM (2D P&ID 3D MATCH) ---
        case 'v-101':
          meshGroup = builder.buildVessel({ diameter: 2.4, height: 4.5, isVertical: true });
          break;
        case 'r-105':
          meshGroup = builder.buildReactor({ diameter: 3.6, height: 8.0, skirtHeight: 2.2 });
          break;
        case 't-201':
          meshGroup = builder.buildTowerColumn({ diameter: 4.4, height: 38.0, numPlatforms: 6 });
          break;
        case 'v-204':
          meshGroup = builder.buildVessel({ diameter: 2.2, height: 4.0, isVertical: true });
          break;
        case 'p-201ht':
          meshGroup = builder.buildHydraulicTurbinePumpSkid();
          break;
        case 'p-201ab':
          meshGroup = builder.buildPumpSkid({ numPumps: 2 });
          break;
        case 'e-207':
          meshGroup = builder.buildHeatExchanger({ length: 6.2, diameter: 2.0, isVertical: false });
          break;
        case 't-202':
          meshGroup = builder.buildTowerColumn({ diameter: 4.8, height: 46.0, numPlatforms: 7 });
          break;
        case 'e-201':
          meshGroup = builder.buildHeatExchanger({ length: 7.5, diameter: 2.4, isVertical: false });
          break;
        case 'v-201':
          meshGroup = builder.buildVessel({ diameter: 2.5, height: 4.5, isVertical: true });
          break;
        case 'e-202':
          meshGroup = builder.buildHeatExchanger({ length: 6.0, diameter: 2.0, isVertical: false });
          break;
        case 'v-208':
          meshGroup = builder.buildVessel({ diameter: 1.8, height: 3.5, isVertical: false });
          break;
        case 'p-207':
          meshGroup = builder.buildPumpSkid({ numPumps: 2 });
          break;
        case 'e-204':
          meshGroup = builder.buildHeatExchanger({ length: 6.5, diameter: 2.0, isVertical: false });
          break;
        case 'p-202ab':
          meshGroup = builder.buildPumpSkid({ numPumps: 2 });
          break;
        case 'e-205ab':
          meshGroup = builder.buildOverheadCondenserBank({ length: 7.0, diameter: 1.8, numShells: 2 });
          break;
        case 'v-203':
          meshGroup = builder.buildVessel({ diameter: 3.2, height: 5.5, isVertical: true });
          break;
        case 'p-203ab':
          meshGroup = builder.buildPumpSkid({ numPumps: 2 });
          break;
        case 'k-501': {
          const comp = builder.buildCompressorUnit({ length: 10.0, hasTurbine: true, numCasings: 4 });
          meshGroup = comp.group;
          this.turbineRotors.push(comp.shaftRotor);
          break;
        }
        case 'j-201':
          meshGroup = builder.buildVentSilencer({ stackHeight: 14.0, silencerDiameter: 2.2 });
          break;
        case 'v-206':
          meshGroup = builder.buildChemicalSkid({ tankDiameter: 1.6, tankHeight: 2.5, hasPump: true, color: 0x226688 });
          break;
        case 'p-205':
          meshGroup = builder.buildPumpSkid({ numPumps: 1 });
          break;
        case 'v-209':
          meshGroup = builder.buildChemicalSkid({ tankDiameter: 1.4, tankHeight: 4.0, hasBlower: true });
          break;
        case 'k-201': {
          const bComp = builder.buildCompressorUnit({ length: 3.0, hasTurbine: false, numCasings: 1 });
          meshGroup = bComp.group;
          break;
        }
        case 'e-206':
          meshGroup = builder.buildHeatExchanger({ length: 4.5, diameter: 1.4, isVertical: false });
          break;
        case 'p-208':
          meshGroup = builder.buildPumpSkid({ numPumps: 2 });
          break;
        case 'v-205':
          meshGroup = builder.buildChemicalSkid({ tankDiameter: 3.8, tankHeight: 4.5 });
          break;
        case 'v-207':
          meshGroup = builder.buildVessel({ diameter: 2.5, height: 2.5, isVertical: true });
          break;
        case 'p-204':
          meshGroup = builder.buildPumpSkid({ numPumps: 1 });
          break;
        case 'p-201':
          meshGroup = builder.buildPumpSkid({ numPumps: 3 });
          break;

        // --- ROW 5 ---
        case 'e-106':
          meshGroup = builder.buildHeatExchanger({ length: 6.8, diameter: 2.0, isVertical: false });
          break;
        case 'e-107_meth':
          meshGroup = builder.buildHeatExchanger({ length: 5.5, diameter: 1.6, isVertical: false });
          break;
        case 'r-106':
          meshGroup = builder.buildReactor({ diameter: 3.2, height: 7.2, skirtHeight: 2.2 });
          break;

        // --- ROW 6 ---
        case 'v-301':
          meshGroup = builder.buildVessel({ diameter: 2.2, height: 4.8, isVertical: true });
          break;
        case 'k-301': {
          const comp = builder.buildSyngasCompressorK301Train();
          meshGroup = comp.group;
          comp.shaftRotors.forEach((r) => this.turbineRotors.push(r));
          break;
        }
        case 'e-301':
          meshGroup = builder.buildHeatExchanger({ length: 6.0, diameter: 1.8, isVertical: false });
          break;
        case 'v-302':
          meshGroup = builder.buildVessel({ diameter: 2.0, height: 4.5, isVertical: true });
          break;
        case 'e-302':
          meshGroup = builder.buildHeatExchanger({ length: 6.0, diameter: 1.8, isVertical: false });
          break;
        case 'v-303':
          meshGroup = builder.buildVessel({ diameter: 1.9, height: 4.4, isVertical: true });
          break;
        case 'e-303':
          meshGroup = builder.buildHeatExchanger({ length: 5.8, diameter: 1.8, isVertical: false });
          break;
        case 'v-304':
          meshGroup = builder.buildVessel({ diameter: 1.8, height: 4.2, isVertical: true });
          break;
        case 'e-304':
          meshGroup = builder.buildHeatExchanger({ length: 5.5, diameter: 1.8, isVertical: false });
          break;
        case 'e-315':
          meshGroup = builder.buildHeatExchanger({ length: 5.5, diameter: 1.8, isVertical: false });
          break;
        case 'v-310':
          meshGroup = builder.buildVessel({ diameter: 2.0, height: 4.0, isVertical: true });
          break;
        case 'e-407':
          meshGroup = builder.buildHeatExchanger({ length: 6.5, diameter: 2.0, isVertical: false });
          break;
        case 'e-405':
          meshGroup = builder.buildHeatExchanger({ length: 6.2, diameter: 2.2, isVertical: false });
          break;
        case 'e-406':
          meshGroup = builder.buildHeatExchanger({ length: 6.2, diameter: 2.2, isVertical: false });
          break;
        case 'v-402':
          meshGroup = builder.buildVessel({ diameter: 2.4, height: 4.8, isVertical: true });
          break;
        case 'e-403_tube':
          meshGroup = builder.buildHeatExchanger({ length: 6.5, diameter: 2.0, isVertical: true });
          break;

        // --- ROW 7 & SYNTHESIS LOOP ---
        case 'h-401':
          meshGroup = builder.buildFurnace({ width: 4.5, depth: 4.5, height: 5.5, stackHeight: 14.0 });
          break;
        case 'j-401': {
          meshGroup = new THREE.Group();
          const bodyGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.4, 16);
          const body = new THREE.Mesh(bodyGeo, this.mats.polishedSteel);
          body.position.set(0, 2.0, 0);
          body.rotation.z = Math.PI / 2;
          meshGroup.add(body);
          const flangeGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 16);
          const f1 = new THREE.Mesh(flangeGeo, this.mats.flangeMat);
          f1.position.set(1.2, 2.0, 0);
          f1.rotation.z = Math.PI / 2;
          meshGroup.add(f1);
          const f2 = new THREE.Mesh(flangeGeo, this.mats.flangeMat);
          f2.position.set(-1.2, 2.0, 0);
          f2.rotation.z = Math.PI / 2;
          meshGroup.add(f2);
          break;
        }
        case 'r-401':
          meshGroup = builder.buildReactor({ diameter: 4.6, height: 26.0, skirtHeight: 3.5, isMultiBed: true, hasSpiralStairs: true });
          break;
        case 'e-401':
          meshGroup = builder.buildHeatExchanger({ length: 6.8, diameter: 2.2, isVertical: true });
          break;
        case 'e-402':
          meshGroup = builder.buildHeatExchanger({ length: 6.5, diameter: 2.0, isVertical: true });
          break;
        case 'e-403_shell':
          meshGroup = builder.buildHeatExchanger({ length: 6.5, diameter: 2.0, isVertical: true });
          break;
        case 'e-404':
          meshGroup = builder.buildHeatExchanger({ length: 6.8, diameter: 2.2, isVertical: true });
          break;
        case 'v-401':
          meshGroup = builder.buildVessel({ diameter: 2.8, height: 5.5, isVertical: true });
          break;
        case 'e-408':
          meshGroup = builder.buildHeatExchanger({ length: 5.2, diameter: 1.6, isVertical: false });
          break;
        case 'v-403':
          meshGroup = builder.buildVessel({ diameter: 1.8, height: 4.0, isVertical: true });
          break;
        case 'e-416':
          meshGroup = builder.buildHeatExchanger({ length: 4.5, diameter: 1.4, isVertical: false });
          break;
        case 'e-409':
          meshGroup = builder.buildHeatExchanger({ length: 4.5, diameter: 1.4, isVertical: false });
          break;
        case 'v-404':
          meshGroup = builder.buildVessel({ diameter: 1.6, height: 3.5, isVertical: true });
          break;

        // --- AMMONIA LETDOWN SEPARATION & STORAGE (ROW 7) ---
        case 'v-409':
          meshGroup = builder.buildVessel({ diameter: 2.6, height: 6.2, isVertical: false });
          break;
        case 'p-401ab':
          meshGroup = builder.buildPumpSkid({ numPumps: 2, hasSpare: true });
          break;
        case 'v-451b':
          meshGroup = builder.buildRefrigeratedAmmoniaStorageTank({ diameter: 14.0, height: 10.5, isDoubleWall: true, hasSpiralStairs: true });
          break;

        // --- REFRIGERATION SYSTEM (K-401, V-405, V-406, V-407, E-412, V-408) ---
        case 'v-405':
          meshGroup = builder.buildVessel({ diameter: 2.0, height: 4.2, isVertical: true });
          break;
        case 'v-406':
          meshGroup = builder.buildVessel({ diameter: 2.0, height: 4.2, isVertical: true });
          break;
        case 'v-407':
          meshGroup = builder.buildVessel({ diameter: 2.0, height: 4.2, isVertical: true });
          break;
        case 'k-401': {
          const comp = builder.buildCompressorUnit({ length: 7.8, hasTurbine: true, numCasings: 2 });
          meshGroup = comp.group;
          this.turbineRotors.push(comp.shaftRotor);
          break;
        }
        case 'e-412':
          meshGroup = builder.buildHeatExchanger({ length: 6.8, diameter: 2.2, isVertical: false });
          break;
        case 'v-408':
          meshGroup = builder.buildVessel({ diameter: 2.8, height: 6.5, isVertical: false });
          break;
        case 'flare': {
          // 35m Guyed Safety Flare Stack
          meshGroup = new THREE.Group();
          const stackGeo = new THREE.CylinderGeometry(0.65, 1.2, 34.0, 24);
          const stack = new THREE.Mesh(stackGeo, this.mats.carbonSteel);
          stack.position.set(0, 17.0, 0);
          meshGroup.add(stack);

          // Flare Flame Tip
          const flameGeo = new THREE.ConeGeometry(1.8, 6.5, 16);
          const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
          this.flareFlameMesh = new THREE.Mesh(flameGeo, flameMat);
          this.flareFlameMesh.position.set(0, 37.0, 0);
          meshGroup.add(this.flareFlameMesh);
          break;
        }
      }

      if (meshGroup) {
        // Firmly anchor all equipment foundations and support legs to the ground pad (Y = 0)
        meshGroup.position.set(eq.position.x, 0, eq.position.z);
        meshGroup.userData = { isEquipment: true, data: eq };
        this.equipmentGroup.add(meshGroup);
        this.equipmentMap.set(eq.id, meshGroup);

        // Register interactive child meshes
        meshGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.userData = { isEquipment: true, equipmentId: eq.id, data: eq };
            this.interactiveMeshes.push(child);
          }
        });
      }
    });
  }

  // Helper to construct strictly orthogonal, non-wobbly, realistic industrial piping paths with smooth 90-degree corner fillets
  private createOrthogonalPipePath(rawPoints: THREE.Vector3[], cornerRadius: number = 0.5): THREE.CurvePath<THREE.Vector3> {
    const curvePath = new THREE.CurvePath<THREE.Vector3>();

    // Filter out any identical adjacent points
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < rawPoints.length; i++) {
      if (i === 0 || rawPoints[i].distanceTo(rawPoints[i - 1]) > 0.01) {
        points.push(rawPoints[i].clone());
      }
    }

    if (points.length < 2) return curvePath;

    if (points.length === 2) {
      curvePath.add(new THREE.LineCurve3(points[0], points[1]));
      return curvePath;
    }

    let currentStart = points[0].clone();

    for (let i = 1; i < points.length - 1; i++) {
      const pPrev = points[i - 1];
      const pCorner = points[i];
      const pNext = points[i + 1];

      const lenIn = pPrev.distanceTo(pCorner);
      const lenOut = pCorner.distanceTo(pNext);

      if (lenIn < 0.01 || lenOut < 0.01) continue;

      const dirIn = new THREE.Vector3().subVectors(pCorner, pPrev).normalize();
      const dirOut = new THREE.Vector3().subVectors(pNext, pCorner).normalize();

      // If directions are collinear, continue straight
      if (dirIn.dot(dirOut) > 0.99) {
        continue;
      }

      const maxFillet = Math.min(cornerRadius, lenIn * 0.45, lenOut * 0.45);
      const cornerStart = new THREE.Vector3().copy(pCorner).sub(dirIn.clone().multiplyScalar(maxFillet));
      const cornerEnd = new THREE.Vector3().copy(pCorner).add(dirOut.clone().multiplyScalar(maxFillet));

      // Add straight line from currentStart to cornerStart
      if (currentStart.distanceTo(cornerStart) > 0.01) {
        curvePath.add(new THREE.LineCurve3(currentStart.clone(), cornerStart.clone()));
      }

      // Add smooth 90-degree corner elbow
      curvePath.add(new THREE.QuadraticBezierCurve3(cornerStart.clone(), pCorner.clone(), cornerEnd.clone()));
      currentStart = cornerEnd.clone();
    }

    // Final straight line to the end point
    const lastPoint = points[points.length - 1];
    if (currentStart.distanceTo(lastPoint) > 0.01) {
      curvePath.add(new THREE.LineCurve3(currentStart.clone(), lastPoint.clone()));
    }

    return curvePath;
  }

  // Build Master Interconnecting Piping Network following EXACT Master Diagram layout
  private buildMasterPipingNetwork() {
    const pipeSegments: Array<{
      points: THREE.Vector3[];
      radius: number;
      isLiquid: boolean;
      name: string;
      color?: number;
      isSection1?: boolean;
      isSectionCO2?: boolean;
      isSectionK301?: boolean;
      isSectionSynLoop?: boolean;
      isSectionRefrig?: boolean;
    }> = [
      // Row 1: NG Feed Pipeline -> V-115 -> PIC-001 -> V-111 -> K-303 -> H-101
      {
        name: 'NG Feed 45 kg -> V-115',
        points: [new THREE.Vector3(-60, 2.5, -35), new THREE.Vector3(-45, 2.5, -35)],
        radius: 0.18,
        isLiquid: false,
      },
      {
        name: 'V-115 -> PIC-001 -> V-111 (19 kg)',
        points: [
          new THREE.Vector3(-45, 4.5, -35),
          new THREE.Vector3(-32, 4.5, -35),
          new THREE.Vector3(-20, 4.5, -35),
          new THREE.Vector3(-20, 2.5, -35),
        ],
        radius: 0.18,
        isLiquid: false,
      },
      {
        name: 'PIC-101 Spillback Line (6 kg)',
        points: [
          new THREE.Vector3(-5, 4.0, -35),
          new THREE.Vector3(-5, 6.8, -35),
          new THREE.Vector3(-20, 6.8, -35),
          new THREE.Vector3(-20, 4.5, -35),
        ],
        radius: 0.12,
        isLiquid: false,
      },
      {
        name: 'V-111 -> K-303 Suction',
        points: [new THREE.Vector3(-20, 2.5, -35), new THREE.Vector3(-8, 2.5, -35)],
        radius: 0.22,
        isLiquid: false,
      },
      {
        name: 'K-303 -> H-101 (39 kg)',
        points: [new THREE.Vector3(-2, 2.5, -35), new THREE.Vector3(15, 2.5, -35)],
        radius: 0.22,
        isLiquid: false,
      },

      // Row 1 -> Row 2: H-101 (380°C) -> R-102 AB
      {
        name: 'H-101 (380°C) -> R-102 AB Desulfurizer',
        points: [new THREE.Vector3(15, 4.5, -35), new THREE.Vector3(15, 4.5, -22)],
        radius: 0.22,
        isLiquid: false,
      },
      // Row 2: R-102 AB -> HC-103 -> FRC-105 -> FRC-103 Steam Injection -> E-101 (500°C) -> R-101 (750°C)
      {
        name: 'R-102 AB -> HC-103 -> FRC-105 -> E-101',
        points: [
          new THREE.Vector3(15, 2.5, -22),
          new THREE.Vector3(-10, 2.5, -22),
        ],
        radius: 0.22,
        isLiquid: false,
      },
      {
        name: 'Steam Injection FRC-103 into E-101',
        points: [new THREE.Vector3(-10, 6.0, -22), new THREE.Vector3(-10, 3.5, -22)],
        radius: 0.16,
        isLiquid: false,
        color: 0xffffff,
      },
      {
        name: 'E-101 (500°C) -> R-101 Primary Reformer',
        points: [new THREE.Vector3(-10, 4.5, -22), new THREE.Vector3(-28, 4.5, -22)],
        radius: 0.26,
        isLiquid: false,
      },
      {
        name: 'R-101 (750°C) -> R-103 Secondary Reformer',
        points: [new THREE.Vector3(-28, 5.5, -22), new THREE.Vector3(-45, 5.5, -22)],
        radius: 0.32,
        isLiquid: false,
      },
      {
        name: 'Process Air K-302 / FRCA-107 -> R-103 Top',
        points: [
          new THREE.Vector3(-45, 10.0, -30),
          new THREE.Vector3(-45, 10.0, -22),
          new THREE.Vector3(-45, 8.5, -22),
        ],
        radius: 0.18,
        isLiquid: false,
        color: 0x33aaff,
      },

      // Row 2 -> Row 3: R-103 (900°C) -> E-108 (340°C) -> R-104 HTS (390°C) -> E-107/109 (285°C) -> E-110 (200°C)
      {
        name: 'R-103 (900°C) -> E-108 Waste Heat Boiler',
        points: [new THREE.Vector3(-45, 3.5, -22), new THREE.Vector3(-45, 3.5, -9)],
        radius: 0.32,
        isLiquid: false,
      },
      {
        name: 'E-108 (340°C) -> R-104 HTS Converter',
        points: [new THREE.Vector3(-45, 2.5, -9), new THREE.Vector3(-28, 2.5, -9)],
        radius: 0.28,
        isLiquid: false,
      },
      {
        name: 'R-104 (390°C) -> E-107/E-109 Exchangers',
        points: [new THREE.Vector3(-28, 2.5, -9), new THREE.Vector3(-5, 2.5, -9)],
        radius: 0.28,
        isLiquid: false,
      },
      {
        name: 'E-107/109 (285°C) -> E-110 Cooler (200°C)',
        points: [new THREE.Vector3(-5, 2.5, -9), new THREE.Vector3(15, 2.5, -9)],
        radius: 0.26,
        isLiquid: false,
      },

      // Row 3 -> Row 4: E-110 (200°C) -> V-101 -> R-105 LTS (220°C) -> HC-201 (185°C) -> E-201 (120°C) -> V-201 -> T-201 -> V-204 (77°C)
      {
        name: 'E-110 (200°C) -> V-101 KO Drum',
        points: [new THREE.Vector3(15, 2.5, -9), new THREE.Vector3(15, 2.5, 4)],
        radius: 0.26,
        isLiquid: false,
        isSectionCO2: true,
      },
      {
        name: 'V-101 -> R-105 LTS Converter',
        points: [new THREE.Vector3(15, 4.0, 4), new THREE.Vector3(-3, 4.0, 4)],
        radius: 0.26,
        isLiquid: false,
        isSectionCO2: true,
      },
      // Row 4: CO2 Removal (Catacarb System - P&ID Exact Orthogonal Routing)
      {
        name: 'R-105 LTS Outlet -> E-201 Reboiler (Shift Gas 185°C)',
        points: [
          new THREE.Vector3(-3, 2.5, 4),
          new THREE.Vector3(-50, 2.5, 4),
          new THREE.Vector3(-50, 2.5, -10),
        ],
        radius: 0.26,
        isLiquid: false,
        isSectionCO2: true,
      },
      {
        name: 'E-201 (120°C Cooled Syngas) -> V-201 Separator Drum',
        points: [new THREE.Vector3(-50, 2.5, -10), new THREE.Vector3(-40, 2.5, -10)],
        radius: 0.24,
        isLiquid: false,
        isSectionCO2: true,
      },
      {
        name: 'V-201 Gas Separator -> T-201 Absorber Column Bottom Feed (43°C, 26.5 kg/cm²G)',
        points: [
          new THREE.Vector3(-40, 3.5, -10),
          new THREE.Vector3(-34, 3.5, -10),
          new THREE.Vector3(-34, 3.5, 4),
        ],
        radius: 0.24,
        isLiquid: false,
        isSectionCO2: true,
      },
      {
        name: 'T-201 Bottom Rich Solution (127°C) -> P-201HT Hydraulic Recovery Turbine',
        points: [
          new THREE.Vector3(-34, 1.8, 4),
          new THREE.Vector3(-42, 1.8, 4),
        ],
        radius: 0.22,
        isLiquid: true,
        color: 0x9333ea,
        isSectionCO2: true,
      },
      {
        name: 'P-201HT Turbine Rich Outlet -> T-202 Stripper Column Top (0.69 kg/cm²G)',
        points: [
          new THREE.Vector3(-42, 2.5, 4),
          new THREE.Vector3(-64, 2.5, 4),
          new THREE.Vector3(-64, 36.0, 4),
        ],
        radius: 0.22,
        isLiquid: true,
        color: 0x9333ea,
        isSectionCO2: true,
      },
      {
        name: 'T-202 Middle Semi-Lean Draw -> P-201 A/B Semi-Lean Pumps',
        points: [
          new THREE.Vector3(-64, 18.0, 4),
          new THREE.Vector3(-47, 18.0, 4),
          new THREE.Vector3(-47, 1.5, 4),
        ],
        radius: 0.24,
        isLiquid: true,
        color: 0x06b6d4,
        isSectionCO2: true,
      },
      {
        name: 'P-201 A/B Pumps -> E-207 Semi-Lean Cooler (118°C -> 105°C)',
        points: [
          new THREE.Vector3(-47, 2.2, 4),
          new THREE.Vector3(-42, 2.2, 4),
          new THREE.Vector3(-42, 2.2, -6),
        ],
        radius: 0.22,
        isLiquid: true,
        color: 0x06b6d4,
        isSectionCO2: true,
      },
      {
        name: 'E-207 Cooled Semi-Lean (105°C) -> T-201 Middle Feed Wash',
        points: [
          new THREE.Vector3(-42, 3.5, -6),
          new THREE.Vector3(-34, 3.5, -6),
          new THREE.Vector3(-34, 20.0, -6),
          new THREE.Vector3(-34, 20.0, 4),
        ],
        radius: 0.22,
        isLiquid: true,
        color: 0x06b6d4,
        isSectionCO2: true,
      },
      {
        name: 'T-202 Sump Lean Solution (120°C) -> E-204 BFW / Lean Exchanger (80°C)',
        points: [
          new THREE.Vector3(-64, 1.2, 4),
          new THREE.Vector3(-64, 1.2, 16),
          new THREE.Vector3(-64, 2.5, 16),
        ],
        radius: 0.2,
        isLiquid: true,
        color: 0x00e5ff,
        isSectionCO2: true,
      },
      {
        name: 'E-204 (80°C Cooled Lean) -> P-202 A/B High-Pressure Pumps',
        points: [
          new THREE.Vector3(-64, 2.5, 16),
          new THREE.Vector3(-64, 2.5, 24),
          new THREE.Vector3(-64, 1.2, 24),
        ],
        radius: 0.2,
        isLiquid: true,
        color: 0x00e5ff,
        isSectionCO2: true,
      },
      {
        name: 'P-202 A/B Pumps (28.5 kg/cm²G) -> T-201 Top Lean Polishing Wash',
        points: [
          new THREE.Vector3(-64, 2.5, 24),
          new THREE.Vector3(-34, 2.5, 24),
          new THREE.Vector3(-34, 32.0, 24),
          new THREE.Vector3(-34, 32.0, 4),
        ],
        radius: 0.18,
        isLiquid: true,
        color: 0x00e5ff,
        isSectionCO2: true,
      },
      {
        name: 'E-201 Reboiler Thermosiphon Return Loop -> T-202 Stripper Base',
        points: [
          new THREE.Vector3(-50, 3.5, -10),
          new THREE.Vector3(-64, 3.5, -10),
          new THREE.Vector3(-64, 3.5, 4),
        ],
        radius: 0.24,
        isLiquid: false,
        color: 0xf59e0b,
        isSectionCO2: true,
      },
      {
        name: 'E-202 Steam Reboiler Boiling Loop -> T-202 Stripper Base',
        points: [
          new THREE.Vector3(-74, 3.5, -10),
          new THREE.Vector3(-64, 3.5, -10),
          new THREE.Vector3(-64, 3.5, 4),
        ],
        radius: 0.22,
        isLiquid: false,
        color: 0xf59e0b,
        isSectionCO2: true,
      },
      {
        name: 'E-202 Steam Condensate -> V-208 Recovery Drum -> P-207 Pump',
        points: [
          new THREE.Vector3(-74, 1.8, -10),
          new THREE.Vector3(-80, 1.8, -10),
          new THREE.Vector3(-85, 1.8, -10),
          new THREE.Vector3(-85, 1.0, -10),
        ],
        radius: 0.16,
        isLiquid: true,
        color: 0x38bdf8,
        isSectionCO2: true,
      },
      {
        name: 'T-202 Overhead Acid Gas (100°C) -> E-205 A/B Condensers',
        points: [
          new THREE.Vector3(-64, 44.0, 4),
          new THREE.Vector3(-64, 48.0, 4),
          new THREE.Vector3(-64, 48.0, -20),
          new THREE.Vector3(-64, 7.0, -20),
        ],
        radius: 0.28,
        isLiquid: false,
        color: 0xa855f7,
        isSectionCO2: true,
      },
      {
        name: 'E-205 A/B (50°C 2-Phase) -> V-203 Acid Gas Separator',
        points: [
          new THREE.Vector3(-64, 5.0, -20),
          new THREE.Vector3(-74, 5.0, -20),
        ],
        radius: 0.24,
        isLiquid: false,
        color: 0xa855f7,
        isSectionCO2: true,
      },
      {
        name: 'V-203 Acid Condensate Sump -> P-203 A/B Reflux Pumps -> T-202 Top Wash',
        points: [
          new THREE.Vector3(-74, 1.0, -20),
          new THREE.Vector3(-74, 1.0, -14),
          new THREE.Vector3(-64, 1.0, -14),
          new THREE.Vector3(-64, 40.0, -14),
          new THREE.Vector3(-64, 40.0, 4),
        ],
        radius: 0.18,
        isLiquid: true,
        color: 0x38bdf8,
        isSectionCO2: true,
      },
      {
        name: 'V-203 Pure Dry CO2 (99.9%) -> Export Header 16"-F-502 to Urea Plant Battery Limit (قسم اليوريا)',
        points: [
          new THREE.Vector3(-74, 5.5, -20),
          new THREE.Vector3(-74, 6.5, -20),
          new THREE.Vector3(-88, 6.5, -20),
          new THREE.Vector3(-88, 6.5, -30),
          new THREE.Vector3(-88, 1.0, -30),
        ],
        radius: 0.24,
        isLiquid: false,
        color: 0x10b981,
        isSectionCO2: true,
      },
      {
        name: 'V-206 Anti-Foam Tank -> P-205 Injection Pump -> Solution Loop',
        points: [
          new THREE.Vector3(-24, 1.5, -12),
          new THREE.Vector3(-22, 1.5, -12),
          new THREE.Vector3(-22, 1.0, -12),
          new THREE.Vector3(-22, 1.0, 4),
          new THREE.Vector3(-42, 1.0, 4),
        ],
        radius: 0.12,
        isLiquid: true,
        color: 0xeab308,
        isSectionCO2: true,
      },
      {
        name: 'V-205 Storage Tank / V-207 Sump -> P-204 Transfer Pump',
        points: [
          new THREE.Vector3(-24, 2.0, 24),
          new THREE.Vector3(-24, 2.0, 30),
          new THREE.Vector3(-24, 1.2, 30),
          new THREE.Vector3(-24, 1.0, 34),
        ],
        radius: 0.16,
        isLiquid: true,
        color: 0x06b6d4,
        isSectionCO2: true,
      },
      {
        name: 'K-201 Degassing Air Blower -> V-209 Degassing Column',
        points: [
          new THREE.Vector3(-22, 1.2, -18),
          new THREE.Vector3(-24, 1.2, -18),
          new THREE.Vector3(-24, 2.0, -18),
        ],
        radius: 0.14,
        isLiquid: false,
        color: 0x38bdf8,
        isSectionCO2: true,
      },
      {
        name: 'E-206 Condensate Cooler -> P-208 Transfer Pump',
        points: [
          new THREE.Vector3(-30, 1.5, -18),
          new THREE.Vector3(-30, 1.0, -18),
          new THREE.Vector3(-30, 1.0, -14),
        ],
        radius: 0.14,
        isLiquid: true,
        color: 0x38bdf8,
        isSectionCO2: true,
      },
      {
        name: 'T-201 Overhead SynGas (CO2 < 500 ppm, 77°C) -> V-204 Knock-Out Drum',
        points: [
          new THREE.Vector3(-34, 36.0, 4),
          new THREE.Vector3(-34, 36.0, 18),
          new THREE.Vector3(-34, 5.0, 18),
        ],
        radius: 0.22,
        isLiquid: false,
        isSectionCO2: true,
      },

      // Row 4 -> Row 5: V-204 (77°C) -> E-106 Shell (245°C) -> E-107 (310°C) -> R-106 Methanator (330°C) -> E-106 Tubes (135°C)
      {
        name: 'V-204 (77°C) -> E-106 Shell Side (Feed Preheating)',
        points: [
          new THREE.Vector3(-34, 2.5, 18),
          new THREE.Vector3(-55, 2.5, 18),
          new THREE.Vector3(-55, 2.5, 17),
          new THREE.Vector3(-45, 2.5, 17),
        ],
        radius: 0.22,
        isLiquid: false,
      },
      {
        name: 'E-106 Shell (245°C) -> E-107 Trim Preheater (310°C)',
        points: [new THREE.Vector3(-45, 3.5, 17), new THREE.Vector3(-25, 3.5, 17)],
        radius: 0.22,
        isLiquid: false,
      },
      {
        name: 'E-107 (310°C) -> R-106 Methanator Reactor Top',
        points: [new THREE.Vector3(-25, 2.5, 17), new THREE.Vector3(-5, 5.5, 17)],
        radius: 0.22,
        isLiquid: false,
      },
      {
        name: 'R-106 Bottom Effluent (330°C) -> E-106 Tube Side (Exothermic Heat Recovery)',
        points: [
          new THREE.Vector3(-5, 1.5, 17),
          new THREE.Vector3(-5, 0.8, 17),
          new THREE.Vector3(-45, 0.8, 17),
          new THREE.Vector3(-45, 2.5, 17),
        ],
        radius: 0.22,
        isLiquid: false,
      },

      // Complete Syngas Compression & Methanation Train:
      // R-106 -> E-106 (Tubes) -> E-301 -> V-301 -> K-301 Stage 1 -> E-302 -> V-302 -> K-301 Stage 2 -> E-303 -> V-303 -> K-301 Stage 3 -> E-304 -> V-304 -> K-301 Stage 4 -> E-315 -> V-310
      {
        name: 'E-106 Tubes (135°C) -> E-301 Precooler Shell Side',
        points: [
          new THREE.Vector3(-45.0, 2.5, 17),
          new THREE.Vector3(-45.0, 4.0, 17),
          new THREE.Vector3(30.0, 4.0, 17),
          new THREE.Vector3(30.0, 4.0, 23),
          new THREE.Vector3(30.0, 3.2, 23),
        ],
        radius: 0.24,
        isLiquid: false,
        isSectionK301: true,
      },
      {
        name: 'E-301 Precooler Shell (43°C) -> V-301 Suction KO Drum',
        points: [
          new THREE.Vector3(30.0, 2.0, 23),
          new THREE.Vector3(30.0, 2.0, 28),
        ],
        radius: 0.24,
        isLiquid: false,
        isSectionK301: true,
      },
      {
        name: 'V-301 Separator (43°C, 25 kg/cm²G) -> K-301 Stage 1 LPC Suction',
        points: [
          new THREE.Vector3(30.0, 4.5, 28),
          new THREE.Vector3(30.0, 5.0, 28),
          new THREE.Vector3(21.0, 5.0, 28),
          new THREE.Vector3(21.0, 5.0, 18.4),
          new THREE.Vector3(21.0, 3.1, 18.4),
        ],
        radius: 0.22,
        isLiquid: false,
        isSectionK301: true,
      },
      {
        name: 'K-301 Stage 1 Discharge (130°C) -> E-302 1st Intercooler',
        points: [
          new THREE.Vector3(20.3, 5.1, 17),
          new THREE.Vector3(20.3, 5.6, 17),
          new THREE.Vector3(22.5, 5.6, 17),
          new THREE.Vector3(22.5, 5.6, 23),
          new THREE.Vector3(22.5, 3.2, 23),
        ],
        radius: 0.20,
        isLiquid: false,
        isSectionK301: true,
      },
      {
        name: 'E-302 Intercooler (43°C) -> V-302 1st Interstage Separator',
        points: [
          new THREE.Vector3(22.5, 2.0, 23),
          new THREE.Vector3(22.5, 2.0, 28),
        ],
        radius: 0.20,
        isLiquid: false,
        isSectionK301: true,
      },
      {
        name: 'V-302 Separator (43°C) -> K-301 Stage 2 LPC Suction',
        points: [
          new THREE.Vector3(22.5, 4.5, 28),
          new THREE.Vector3(22.5, 5.2, 28),
          new THREE.Vector3(19.7, 5.2, 28),
          new THREE.Vector3(19.7, 5.2, 15.6),
          new THREE.Vector3(19.7, 3.1, 15.6),
        ],
        radius: 0.20,
        isLiquid: false,
        isSectionK301: true,
      },
      {
        name: 'K-301 Stage 2 Discharge (135°C) -> E-303 2nd Intercooler',
        points: [
          new THREE.Vector3(19.0, 5.1, 17),
          new THREE.Vector3(19.0, 5.6, 17),
          new THREE.Vector3(15.0, 5.6, 17),
          new THREE.Vector3(15.0, 5.6, 23),
          new THREE.Vector3(15.0, 3.2, 23),
        ],
        radius: 0.20,
        isLiquid: false,
        isSectionK301: true,
      },
      {
        name: 'E-303 Intercooler (43°C) -> V-303 2nd Interstage Separator',
        points: [
          new THREE.Vector3(15.0, 2.0, 23),
          new THREE.Vector3(15.0, 2.0, 28),
        ],
        radius: 0.18,
        isLiquid: false,
        isSectionK301: true,
      },
      {
        name: 'V-303 Separator (43°C) -> K-301 Stage 3 HPC Suction',
        points: [
          new THREE.Vector3(15.0, 4.5, 28),
          new THREE.Vector3(15.0, 5.0, 28),
          new THREE.Vector3(16.8, 5.0, 28),
          new THREE.Vector3(16.8, 5.0, 18.4),
          new THREE.Vector3(16.8, 3.2, 18.4),
        ],
        radius: 0.18,
        isLiquid: false,
        isSectionK301: true,
      },
      {
        name: 'K-301 Stage 3 Discharge (138°C) -> E-304 3rd Intercooler',
        points: [
          new THREE.Vector3(16.3, 5.1, 17),
          new THREE.Vector3(16.3, 5.6, 17),
          new THREE.Vector3(7.5, 5.6, 17),
          new THREE.Vector3(7.5, 5.6, 23),
          new THREE.Vector3(7.5, 3.2, 23),
        ],
        radius: 0.18,
        isLiquid: false,
        isSectionK301: true,
      },
      {
        name: 'E-304 Intercooler (43°C) -> V-304 3rd Interstage Separator',
        points: [
          new THREE.Vector3(7.5, 2.0, 23),
          new THREE.Vector3(7.5, 2.0, 28),
        ],
        radius: 0.18,
        isLiquid: false,
        isSectionK301: true,
      },
      {
        name: 'V-304 Separator (43°C) -> K-301 Stage 4 HPC Suction',
        points: [
          new THREE.Vector3(7.5, 4.5, 28),
          new THREE.Vector3(7.5, 5.2, 28),
          new THREE.Vector3(15.7, 5.2, 28),
          new THREE.Vector3(15.7, 5.2, 15.6),
          new THREE.Vector3(15.7, 3.2, 15.6),
        ],
        radius: 0.18,
        isLiquid: false,
        isSectionK301: true,
      },
      {
        name: 'K-301 Stage 4 Final Discharge (239 kg/cm²G, 135°C) -> E-315 After-Cooler',
        points: [
          new THREE.Vector3(15.2, 5.1, 17),
          new THREE.Vector3(15.2, 5.6, 17),
          new THREE.Vector3(0.0, 5.6, 17),
          new THREE.Vector3(0.0, 5.6, 23),
          new THREE.Vector3(0.0, 3.2, 23),
        ],
        radius: 0.18,
        isLiquid: false,
        isSectionK301: true,
      },
      {
        name: 'E-315 Cooled Gas (26°C) -> V-310 Make-Up Separator',
        points: [
          new THREE.Vector3(0.0, 2.0, 23),
          new THREE.Vector3(0.0, 2.0, 28),
        ],
        radius: 0.18,
        isLiquid: false,
        isSectionK301: true,
      },

      // ==========================================
      // SECTION 7: AMMONIA SYNTHESIS LOOP & REFRIGERATION (DWG 6112P-100-400-00)
      // ==========================================

      // 1. Loop Recycle & Make-Up Syngas Pre-Chilling Train
      {
        name: 'Recycle Gas + Make-Up Syngas -> E-407 Cold Gas Exchanger Shell (26.5°C)',
        points: [
          new THREE.Vector3(-34, 5.5, 25),
          new THREE.Vector3(-34, 5.5, 35),
          new THREE.Vector3(-34, 3.0, 35),
        ],
        radius: 0.24,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'E-407 Shell Outlet (26.5°C) -> E-405 Primary Chiller (12.3°C)',
        points: [
          new THREE.Vector3(-34, 2.5, 35),
          new THREE.Vector3(-20, 2.5, 35),
        ],
        radius: 0.24,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'E-405 Chiller (12.3°C) -> E-406 Secondary Chiller (-4.0°C)',
        points: [
          new THREE.Vector3(-20, 2.5, 35),
          new THREE.Vector3(-6, 2.5, 35),
        ],
        radius: 0.24,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'E-406 Secondary Chiller (-4.0°C) -> V-402 Secondary Separator',
        points: [
          new THREE.Vector3(-6, 2.5, 35),
          new THREE.Vector3(8, 2.5, 35),
        ],
        radius: 0.24,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'V-402 Top Vapor (-4.0°C) -> E-407 Tube Side (Cold Syngas Return)',
        points: [
          new THREE.Vector3(8, 5.0, 35),
          new THREE.Vector3(8, 5.0, 31),
          new THREE.Vector3(-34, 5.0, 31),
          new THREE.Vector3(-34, 2.0, 35),
        ],
        radius: 0.24,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'E-407 Tube Outlet (50°C) -> E-403 Shell Preheater Inlet',
        points: [
          new THREE.Vector3(-34, 1.5, 35),
          new THREE.Vector3(-6, 1.5, 35),
          new THREE.Vector3(-6, 1.8, 46),
        ],
        radius: 0.26,
        isLiquid: false,
        isSectionSynLoop: true,
      },

      // 2. Reactor Feed & Quench Distribution Train (E-403 -> E-401 -> J-401 -> R-401)
      {
        name: 'E-403 Shell Preheater Outlet (148.2°C) -> E-401 Shell Preheater Inlet',
        points: [
          new THREE.Vector3(-6, 3.2, 46),
          new THREE.Vector3(8, 3.2, 46),
          new THREE.Vector3(22, 1.8, 46),
        ],
        radius: 0.26,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'E-401 Shell Outlet (235.5°C) -> J-401 Mixer -> R-401 Converter Top Head',
        points: [
          new THREE.Vector3(22, 3.5, 46),
          new THREE.Vector3(30, 3.5, 46),
          new THREE.Vector3(44, 2.0, 46),
          new THREE.Vector3(44, 22.0, 46),
          new THREE.Vector3(36, 22.0, 46),
        ],
        radius: 0.28,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'Cold Syngas Interbed Quench Nozzle -> R-401 Bed 2',
        points: [
          new THREE.Vector3(-6, 3.5, 46),
          new THREE.Vector3(36, 4.0, 42),
          new THREE.Vector3(36, 14.0, 46),
        ],
        radius: 0.16,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'Cold Syngas Interbed Quench Nozzle -> R-401 Bed 3',
        points: [
          new THREE.Vector3(-6, 3.5, 46),
          new THREE.Vector3(36, 4.0, 42),
          new THREE.Vector3(36, 8.0, 46),
        ],
        radius: 0.16,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'H-401 Startup Heater Feed Loop & Discharge to R-401',
        points: [
          new THREE.Vector3(22, 4.5, 42),
          new THREE.Vector3(50, 4.5, 40),
          new THREE.Vector3(50, 2.5, 40),
          new THREE.Vector3(50, 5.0, 40),
          new THREE.Vector3(36, 5.0, 40),
          new THREE.Vector3(36, 22.0, 46),
        ],
        radius: 0.18,
        isLiquid: false,
        isSectionSynLoop: true,
      },

      // 3. Hot Reactor Effluent Cooling & Heat Recovery Train (Sequential Tube-to-Tube Lines)
      {
        name: 'R-401 Converter Bottom Effluent (440°C) -> E-401 Tube Inlet (Top Channel)',
        points: [
          new THREE.Vector3(36, 1.8, 46),
          new THREE.Vector3(26, 1.8, 46),
          new THREE.Vector3(22, 5.2, 46),
        ],
        radius: 0.28,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'E-401 Tube Outlet (352°C) -> E-402 Tube Inlet (Top Channel) [Direct Tube-to-Tube Line]',
        points: [
          new THREE.Vector3(22, 0.8, 46),
          new THREE.Vector3(15, 0.8, 46),
          new THREE.Vector3(8, 5.2, 46),
        ],
        radius: 0.28,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'E-402 Tube Outlet (195°C) -> E-403 Tube Inlet (Top Channel) [Direct Tube-to-Tube Line]',
        points: [
          new THREE.Vector3(8, 0.8, 46),
          new THREE.Vector3(1, 0.8, 46),
          new THREE.Vector3(-6, 5.2, 46),
        ],
        radius: 0.28,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'E-403 Tube Outlet (95°C) -> E-404 Water Condenser Tube Inlet [Direct Tube-to-Tube Line]',
        points: [
          new THREE.Vector3(-6, 0.8, 46),
          new THREE.Vector3(-13, 0.8, 46),
          new THREE.Vector3(-20, 5.2, 46),
        ],
        radius: 0.28,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'E-404 Water Condenser Tube Outlet (40°C) -> V-401 Primary Separator Inlet',
        points: [
          new THREE.Vector3(-20, 0.8, 46),
          new THREE.Vector3(-27, 0.8, 46),
          new THREE.Vector3(-34, 3.8, 46),
        ],
        radius: 0.28,
        isLiquid: false,
        isSectionSynLoop: true,
      },

      // 4. Primary & Secondary Separation, Recycle & Letdown
      {
        name: 'V-401 Overhead Recycle Gas -> K-301 R-S Recycle Stage',
        points: [
          new THREE.Vector3(-34, 5.8, 46),
          new THREE.Vector3(-34, 5.8, 18.4),
          new THREE.Vector3(13.2, 5.8, 18.4),
          new THREE.Vector3(13.2, 3.2, 18.4),
        ],
        radius: 0.24,
        isLiquid: false,
        isSectionSynLoop: true,
        isSectionK301: true,
      },
      {
        name: 'V-401 Liquid NH3 Product (41°C) -> V-409 Letdown Flash Drum',
        points: [
          new THREE.Vector3(-34, 1.0, 46),
          new THREE.Vector3(-34, 1.0, 55),
          new THREE.Vector3(-20, 1.8, 55),
        ],
        radius: 0.18,
        isLiquid: true,
        isSectionSynLoop: true,
      },
      {
        name: 'V-402 Liquid NH3 Product (-4°C) -> V-409 Letdown Flash Drum',
        points: [
          new THREE.Vector3(8, 1.0, 35),
          new THREE.Vector3(8, 1.0, 55),
          new THREE.Vector3(-20, 1.8, 55),
        ],
        radius: 0.18,
        isLiquid: true,
        isSectionSynLoop: true,
      },
      {
        name: 'V-405 Bottom Cold Product (-33°C) -> P-401 A/B Product Pumps Suction',
        points: [
          new THREE.Vector3(8, 0.8, 60),
          new THREE.Vector3(8, 0.8, 55),
          new THREE.Vector3(-6, 0.8, 55),
          new THREE.Vector3(-6, 1.2, 55),
        ],
        radius: 0.18,
        isLiquid: true,
        isSectionSynLoop: true,
        isSectionRefrig: true,
      },
      {
        name: 'P-401 A/B Discharge (25 kg/cm²G, -33°C) -> V-451 B Storage Tank',
        points: [
          new THREE.Vector3(-6, 1.5, 55),
          new THREE.Vector3(-6, 1.5, 70),
          new THREE.Vector3(14.5, 1.5, 70),
          new THREE.Vector3(15.0, 2.5, 70),
        ],
        radius: 0.20,
        isLiquid: true,
        isSectionSynLoop: true,
        isSectionRefrig: true,
      },

      // 5. Purge Gas Condensation & Ammonia Recovery Circuit (E-408, V-403, E-416, E-409, V-404)
      {
        name: 'V-401 Purge Gas Branch -> E-408 Purge Condenser',
        points: [
          new THREE.Vector3(-34, 6.2, 46),
          new THREE.Vector3(-44, 6.2, 46),
          new THREE.Vector3(-44, 2.5, 46),
        ],
        radius: 0.14,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'E-408 Chilled Purge (-27.8°C) -> V-403 Purge Separator',
        points: [
          new THREE.Vector3(-44, 2.5, 46),
          new THREE.Vector3(-44, 3.8, 54),
          new THREE.Vector3(-44, 2.8, 54),
        ],
        radius: 0.14,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'V-403 Bottom Liquid NH3 (302.7 kg/h) -> V-409 Letdown Tank',
        points: [
          new THREE.Vector3(-44, 0.8, 54),
          new THREE.Vector3(-44, 0.8, 55),
          new THREE.Vector3(-20, 1.2, 55),
        ],
        radius: 0.12,
        isLiquid: true,
        isSectionSynLoop: true,
      },
      {
        name: 'V-403 Top Purge Gas -> E-416 Jacket Heater (35°C)',
        points: [
          new THREE.Vector3(-44, 4.2, 54),
          new THREE.Vector3(-36, 4.2, 54),
          new THREE.Vector3(-36, 2.2, 54),
        ],
        radius: 0.14,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'E-416 Warmed Gas (35°C) -> E-409 Ammonia Vent Condenser',
        points: [
          new THREE.Vector3(-36, 2.2, 54),
          new THREE.Vector3(-44, 2.2, 62),
        ],
        radius: 0.14,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'E-409 Chilled Vent (-2.5°C) -> V-404 Vent Separator',
        points: [
          new THREE.Vector3(-44, 2.2, 62),
          new THREE.Vector3(-36, 2.2, 62),
          new THREE.Vector3(-36, 2.6, 62),
        ],
        radius: 0.14,
        isLiquid: false,
        isSectionSynLoop: true,
      },
      {
        name: 'V-404 Clean Purge Vent -> Primary Reformer Fuel Gas Header',
        points: [
          new THREE.Vector3(-36, 4.2, 62),
          new THREE.Vector3(-36, 4.2, 70),
          new THREE.Vector3(5, 4.2, 70),
        ],
        radius: 0.14,
        isLiquid: false,
        isSectionSynLoop: true,
      },

      // 6. Refrigeration & Compression Loop (K-401, V-405, V-406, V-407, E-412, V-408)
      {
        name: 'E-406 & E-408 Vapors (-32°C) -> V-405 1st Stage Suction Drum',
        points: [
          new THREE.Vector3(-6, 4.2, 35),
          new THREE.Vector3(8, 4.2, 50),
          new THREE.Vector3(8, 4.2, 55),
          new THREE.Vector3(8, 2.8, 55),
        ],
        radius: 0.20,
        isLiquid: false,
        color: 0x00e5aa,
        isSectionSynLoop: true,
        isSectionRefrig: true,
      },
      {
        name: 'V-405 Overhead Vapor -> K-401 LP Suction Stage',
        points: [
          new THREE.Vector3(8, 4.5, 55),
          new THREE.Vector3(36, 4.5, 55),
          new THREE.Vector3(36, 2.5, 55),
        ],
        radius: 0.20,
        isLiquid: false,
        color: 0x00e5aa,
        isSectionSynLoop: true,
        isSectionRefrig: true,
      },
      {
        name: 'E-405 Vapors (-8°C) -> V-406 2nd Stage Suction Drum',
        points: [
          new THREE.Vector3(-20, 4.0, 35),
          new THREE.Vector3(16, 4.0, 50),
          new THREE.Vector3(16, 2.8, 55),
        ],
        radius: 0.20,
        isLiquid: false,
        color: 0x00e5aa,
        isSectionSynLoop: true,
        isSectionRefrig: true,
      },
      {
        name: 'V-406 Overhead -> K-401 Intermediate Stage',
        points: [
          new THREE.Vector3(16, 4.5, 55),
          new THREE.Vector3(36, 4.5, 55),
        ],
        radius: 0.20,
        isLiquid: false,
        color: 0x00e5aa,
        isSectionSynLoop: true,
        isSectionRefrig: true,
      },
      {
        name: 'V-409 Flash Gas (+13°C) -> V-407 3rd Stage Suction Drum',
        points: [
          new THREE.Vector3(-20, 5.5, 55),
          new THREE.Vector3(24, 5.5, 55),
          new THREE.Vector3(24, 2.8, 55),
        ],
        radius: 0.20,
        isLiquid: false,
        color: 0x00e5aa,
        isSectionSynLoop: true,
        isSectionRefrig: true,
      },
      {
        name: 'V-407 Overhead -> K-401 HP Stage',
        points: [
          new THREE.Vector3(24, 4.5, 55),
          new THREE.Vector3(36, 4.5, 55),
        ],
        radius: 0.20,
        isLiquid: false,
        color: 0x00e5aa,
        isSectionSynLoop: true,
        isSectionRefrig: true,
      },
      {
        name: 'K-401 Discharge (17.5 kg/cm²G, 37.4°C) -> E-412 NH3 Condenser',
        points: [
          new THREE.Vector3(36, 2.8, 55),
          new THREE.Vector3(48, 2.8, 55),
        ],
        radius: 0.22,
        isLiquid: false,
        color: 0x00e5aa,
        isSectionSynLoop: true,
        isSectionRefrig: true,
      },
      {
        name: 'E-412 Condensed Liquid NH3 -> V-408 Liquid Receiver',
        points: [
          new THREE.Vector3(48, 1.5, 55),
          new THREE.Vector3(48, 1.5, 63),
          new THREE.Vector3(48, 2.5, 63),
        ],
        radius: 0.20,
        isLiquid: true,
        color: 0x00e5ff,
        isSectionSynLoop: true,
        isSectionRefrig: true,
      },
      {
        name: 'V-408 Liquid Refrigerant Header -> Chillers (E-405, E-406, E-408, E-409)',
        points: [
          new THREE.Vector3(48, 1.0, 63),
          new THREE.Vector3(28, 1.0, 42),
          new THREE.Vector3(-20, 1.0, 35),
        ],
        radius: 0.18,
        isLiquid: true,
        color: 0x00e5ff,
        isSectionSynLoop: true,
        isSectionRefrig: true,
      },
    ];

    pipeSegments.forEach((seg, idx) => {
      const curve = this.createOrthogonalPipePath(seg.points, 0.5);
      const tubeGeo = new THREE.TubeGeometry(curve, 64, seg.radius, 12, false);

      const isSec1Pipe = seg.isSection1 ?? (idx < 12); // First 12 lines belong to Section 1
      const isSecCO2Pipe = seg.isSectionCO2 ?? false;
      const isSecK301Pipe = seg.isSectionK301 ?? false;
      const isSecSynLoopPipe = seg.isSectionSynLoop ?? false;
      const isSecRefrigPipe = seg.isSectionRefrig ?? false;

      const mat = seg.color
        ? new THREE.MeshStandardMaterial({ color: seg.color, metalness: 0.8, roughness: 0.25 })
        : seg.isLiquid
        ? this.liquidPipeMat
        : this.pipeMat;

      const pipeMesh = new THREE.Mesh(tubeGeo, mat);
      pipeMesh.userData = { 
        isPipe: true, 
        name: seg.name, 
        isLiquid: seg.isLiquid, 
        isSection1: isSec1Pipe,
        isSectionCO2: isSecCO2Pipe,
        isSectionK301: isSecK301Pipe,
        isSectionSynLoop: isSecSynLoopPipe,
        isSectionRefrig: isSecRefrigPipe,
      };
      this.pipingGroup.add(pipeMesh);
      this.interactiveMeshes.push(pipeMesh);

      // Create Particle Animation System for this stream
      const curveLen = curve.getLength();
      const particleCount = Math.max(12, Math.floor(curveLen * 2.5));
      const pGeo = new THREE.BufferGeometry();
      const pPositions = new Float32Array(particleCount * 3);
      const progress = new Float32Array(particleCount);

      for (let p = 0; p < particleCount; p++) {
        progress[p] = p / particleCount;
        const pt = curve.getPoint(progress[p]);
        pPositions[p * 3] = pt.x;
        pPositions[p * 3 + 1] = pt.y;
        pPositions[p * 3 + 2] = pt.z;
      }

      pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

      const pColor = seg.isLiquid ? 0x00e5ff : seg.color || 0xffb700;
      const pMat = new THREE.PointsMaterial({
        color: pColor,
        size: seg.radius * 2.2,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });

      const pPoints = new THREE.Points(pGeo, pMat);
      this.flowParticlesGroup.add(pPoints);

      this.particleSystems.push({
        points: pPoints,
        curve,
        progress,
        speed: 0.08 / Math.max(1, curveLen * 0.05),
        isSection1: isSec1Pipe,
        isSectionCO2: isSecCO2Pipe,
        isSectionK301: isSecK301Pipe,
        isSectionSynLoop: isSecSynLoopPipe,
        isSectionRefrig: isSecRefrigPipe,
      });
    });
  }

  // Build floating 3D Temperature Badges for ALL 28 points from Master Diagram
  private buildMasterTemperatureBadges() {
    MASTER_TEMPERATURE_POINTS.forEach((tp) => {
      const tex = createTemperatureBadgeTexture(tp.tempStr, tp.numericVal);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(4.8, 1.8, 1);
      sprite.position.copy(tp.position);
      sprite.userData = { isTemperatureBadge: true, data: tp };
      this.tempBadgesGroup.add(sprite);

      // Vertical connector stem line down to pipe/equipment
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(tp.position.x, tp.position.y - 0.9, tp.position.z),
        new THREE.Vector3(tp.position.x, tp.position.y - 2.2, tp.position.z),
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xffcc00, linewidth: 2 });
      const stem = new THREE.Line(lineGeo, lineMat);
      this.tempBadgesGroup.add(stem);
    });
  }

  // Build floating 3D Controller Badges (PIC-001, PIC-101, HC-103, FRC-105, FRC-103, FRCA-107, HC-201)
  private buildMasterControllerBadges() {
    MASTER_CONTROLLER_POINTS.forEach((cp) => {
      const tex = createControllerBadgeTexture(cp.tag, cp.type);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(4.2, 1.6, 1);
      sprite.position.copy(cp.position);
      sprite.userData = { isControllerBadge: true, data: cp };
      this.controllerBadgesGroup.add(sprite);

      // Vertical connector stem
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(cp.position.x, cp.position.y - 0.8, cp.position.z),
        new THREE.Vector3(cp.position.x, cp.position.y - 1.8, cp.position.z),
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x00e5aa, linewidth: 2 });
      const stem = new THREE.Line(lineGeo, lineMat);
      this.controllerBadgesGroup.add(stem);
    });
  }

  // Build floating Pressure Badges (45 kg, 46 kg, 19 kg, 6 kg, 39 kg)
  private buildMasterPressureBadges() {
    MASTER_PRESSURE_ANNOTATIONS.forEach((pa) => {
      const tex = createPressureBadgeTexture(pa.pressStr);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(3.8, 1.3, 1);
      sprite.position.copy(pa.position);
      this.pressureBadgesGroup.add(sprite);
    });
  }

  // Build Equipment Identifier Tag Badges
  private buildEquipmentTags() {
    MASTER_EQUIPMENT_DATA.forEach((eq) => {
      const tex = createEquipmentTagTexture(eq.tag, eq.name);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(5.2, 1.8, 1);

      // Position badge floating cleanly above equipment
      let tagHeight = 6.2;
      if (eq.id === 't-201') tagHeight = 42.0;
      else if (eq.id === 't-202') tagHeight = 50.0;
      else if (eq.id === 'flare') tagHeight = 41.0;
      else if (eq.id === 'j-201') tagHeight = 16.5;
      else if (eq.id === 'r-101') tagHeight = 35.0;
      else if (eq.id === 'r-401') tagHeight = 29.0;
      else if (eq.id === 'r-103') tagHeight = 16.0;
      else if (eq.id === 'v-409') tagHeight = 8.0;
      else if (eq.id === 'e-205ab') tagHeight = 8.5;
      else if (eq.id === 'k-501') tagHeight = 5.5;
      else if (eq.type === 'reactor') tagHeight = 12.5;
      else if (eq.type === 'furnace') tagHeight = 15.0;
      else if (eq.type === 'vessel') tagHeight = 7.5;
      else if (eq.type === 'compressor') tagHeight = 6.0;

      sprite.position.set(eq.position.x, tagHeight, eq.position.z);
      sprite.userData = { isEquipmentTag: true, data: eq };
      this.equipmentTagsGroup.add(sprite);
    });
  }

  // Helper method for waving Iraqi Flag
  private createIraqiFlagMesh(height: number): THREE.Group {
    const flagGroup = new THREE.Group();

    const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, height, 16);
    const poleMat = this.mats.polishedSteel;
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(0, height / 2, 0);
    flagGroup.add(pole);

    const finialGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const finialMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 });
    const finial = new THREE.Mesh(finialGeo, finialMat);
    finial.position.set(0, height, 0);
    flagGroup.add(finial);

    const flagGeo = new THREE.PlaneGeometry(3.0, 2.0, 16, 10);
    const flagMat = new THREE.MeshStandardMaterial({
      map: this.iraqiFlagTex,
      side: THREE.DoubleSide,
      roughness: 0.4,
      metalness: 0.1,
    });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(1.5, height - 1.2, 0);
    flagGroup.add(flagMesh);

    this.flagsGroup.add(flagGroup);
    return flagGroup;
  }

  // Animation Update Tick (Turbines rotating, Flare flame flickering, Flow particles advancing)
  public update(delta: number, elapsedTime: number) {
    // 1. Rotate compressor & turbine shafts
    this.turbineRotors.forEach((rotor) => {
      rotor.rotation.x += delta * 18.0;
    });

    // 2. Flicker Flare tip flame
    if (this.flareFlameMesh) {
      this.flareFlameMesh.scale.y = 1.0 + Math.sin(elapsedTime * 12) * 0.18;
      this.flareFlameMesh.scale.x = 1.0 + Math.cos(elapsedTime * 9) * 0.12;
      this.flareFlameMesh.rotation.y += delta * 2.0;
    }

    // 3. Advance flow particles along curves
    this.particleSystems.forEach((ps) => {
      const positions = ps.points.geometry.attributes.position.array as Float32Array;
      const count = ps.progress.length;

      for (let i = 0; i < count; i++) {
        ps.progress[i] = (ps.progress[i] + ps.speed * delta * 10) % 1.0;
        const pt = ps.curve.getPoint(ps.progress[i]);
        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = pt.z;
      }
      ps.points.geometry.attributes.position.needsUpdate = true;
    });

    // 4. Update isolated Steam System & PRDS Unit animations
    if (this.steamSystem) {
      this.steamSystem.update(delta);
    }

    // 5. Update isolated Section 4 Synthesis & Refrigeration Twin animations
    if (this.synthesisSection400) {
      this.synthesisSection400.update(delta);
    }

    // 6. Update isolated Section 2 CO2 Removal Twin animations
    if (this.co2RemovalSection200) {
      this.co2RemovalSection200.update(delta);
    }
  }

  // Toggle Visibility Methods for UI Controls
  public setTemperatureBadgesVisible(visible: boolean) {
    this.tempBadgesGroup.visible = visible;
  }

  public setControllersVisible(visible: boolean) {
    this.controllerBadgesGroup.visible = visible;
  }

  public setPressureBadgesVisible(visible: boolean) {
    this.pressureBadgesGroup.visible = visible;
  }

  public setEquipmentTagsVisible(visible: boolean) {
    this.equipmentTagsGroup.visible = visible;
  }

  public setFlowParticlesVisible(visible: boolean) {
    this.flowParticlesGroup.visible = visible;
  }

  public setXRayMode(enabled: boolean) {
    this.equipmentGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => {
            m.transparent = enabled;
            m.opacity = enabled ? 0.35 : 1.0;
            m.wireframe = enabled;
          });
        } else {
          child.material.transparent = enabled;
          child.material.opacity = enabled ? 0.35 : 1.0;
          child.material.wireframe = enabled;
        }
      }
    });
  }

  public getEquipmentById(id: string): EquipmentInfo | undefined {
    return MASTER_EQUIPMENT_DATA.find((eq) => eq.id === id || eq.tag.toLowerCase() === id.toLowerCase());
  }

  // Isolate a specific unit/section (e.g. Section 1 Reforming, Section CO2 Removal) or show full plant
  public isolateSection(sectionId: string | null) {
    this.currentIsolatedSection = sectionId;
    const isSec1 =
      sectionId === 'sec_reformer' ||
      sectionId === 'sec_feed' ||
      sectionId === 'sec_desulf' ||
      sectionId === 'section_1' ||
      sectionId === 'reform';

    const isSecCO2 =
      sectionId === 'sec_co2' ||
      sectionId === 'sec_catacarb' ||
      sectionId === 'sec_co2_removal' ||
      sectionId === 'co2' ||
      sectionId === 'co2_removal' ||
      sectionId === 'section_3';

    const isSecK301 =
      sectionId === 'sec_k301' ||
      sectionId === 'sec_compressor' ||
      sectionId === 'sec_syngas' ||
      sectionId === 'k301' ||
      sectionId === 'compressor' ||
      sectionId === 'section_5';

    const isSecSynLoop =
      sectionId === 'sec_synloop' ||
      sectionId === 'sec_synth' ||
      sectionId === 'synth' ||
      sectionId === 'synth_400' ||
      sectionId === 'synth_loop' ||
      sectionId === 'chilling_sep' ||
      sectionId === 'letdown' ||
      sectionId === 'refrig_comp' ||
      sectionId === 'refrig_sep' ||
      sectionId === 'purge_rec' ||
      sectionId === 'startup_h401' ||
      sectionId === 'section_4' ||
      sectionId === 'section_6' ||
      sectionId === 'section_7' ||
      sectionId === 'sec_loop' ||
      sectionId === 'sec_refrigeration' ||
      sectionId === 'sec_k401' ||
      sectionId === 'k401ref' ||
      sectionId === 'sec_refrig';

    const isSecRefrig =
      sectionId === 'sec_refrigeration' ||
      sectionId === 'sec_k401' ||
      sectionId === 'k401ref' ||
      sectionId === 'sec_refrig';

    const isSecSteam =
      sectionId === 'sec_steam' ||
      sectionId === 'sec_steam_utility' ||
      sectionId === 'steam' ||
      sectionId === 'steam_header' ||
      sectionId === 'steam_system' ||
      sectionId === 'section_11' ||
      sectionId === 'section_9';

    const isSecStorage =
      sectionId === 'sec_storage' ||
      sectionId === 'storage' ||
      sectionId === 'section_8';

    // 1. Equipment Visibility
    this.equipmentMap.forEach((meshGroup, eqId) => {
      if (!sectionId || sectionId === 'overview' || sectionId === 'all') {
        meshGroup.visible = true;
      } else if (isSec1) {
        meshGroup.visible = AmmoniaPlant3D.SECTION_1_EQUIPMENT_IDS.has(eqId);
      } else if (isSecCO2) {
        meshGroup.visible = false; // High-precision dedicated 3D Section 2 Catacarb digital twin is displayed instead
      } else if (isSecK301) {
        meshGroup.visible = AmmoniaPlant3D.SECTION_K301_EQUIPMENT_IDS.has(eqId);
      } else if (isSecSynLoop) {
        meshGroup.visible = false; // High-precision dedicated 3D Section 4 digital twin is displayed instead
      } else if (isSecRefrig) {
        meshGroup.visible = AmmoniaPlant3D.SECTION_REFRIG_EQUIPMENT_IDS.has(eqId);
      } else if (isSecSteam) {
        meshGroup.visible = false; // Isolated dedicated 3D steam unit is displayed instead
      } else if (isSecStorage) {
        meshGroup.visible = AmmoniaPlant3D.SECTION_STORAGE_EQUIPMENT_IDS.has(eqId);
      } else {
        meshGroup.visible = true;
      }
    });

    // 2. Equipment Tags Visibility
    this.equipmentTagsGroup.children.forEach((child) => {
      const data = child.userData?.data;
      if (!sectionId || sectionId === 'overview' || sectionId === 'all') {
        child.visible = true;
      } else if (isSec1 && data) {
        child.visible = AmmoniaPlant3D.SECTION_1_EQUIPMENT_IDS.has(data.id);
      } else if (isSecCO2 && data) {
        child.visible = false; // Dedicated 3D badges on co2RemovalSection200
      } else if (isSecK301 && data) {
        child.visible = AmmoniaPlant3D.SECTION_K301_EQUIPMENT_IDS.has(data.id);
      } else if (isSecSynLoop && data) {
        child.visible = false; // Built-in dedicated signs on synthesisSection400
      } else if (isSecRefrig && data) {
        child.visible = AmmoniaPlant3D.SECTION_REFRIG_EQUIPMENT_IDS.has(data.id);
      } else if (isSecSteam) {
        child.visible = false;
      } else if (isSecStorage && data) {
        child.visible = AmmoniaPlant3D.SECTION_STORAGE_EQUIPMENT_IDS.has(data.id);
      } else {
        child.visible = true;
      }
    });

    // 3. Temperature Badges Visibility
    this.tempBadgesGroup.children.forEach((child) => {
      const data = child.userData?.data;
      if (!sectionId || sectionId === 'overview' || sectionId === 'all') {
        child.visible = true;
      } else if (isSec1 && data) {
        child.visible = AmmoniaPlant3D.SECTION_1_EQUIPMENT_IDS.has(data.equipmentRef);
      } else if (isSecCO2 && data) {
        child.visible = false;
      } else if (isSecK301 && data) {
        child.visible = AmmoniaPlant3D.SECTION_K301_EQUIPMENT_IDS.has(data.equipmentRef);
      } else if (isSecSynLoop && data) {
        child.visible = false;
      } else if (isSecRefrig && data) {
        child.visible = AmmoniaPlant3D.SECTION_REFRIG_EQUIPMENT_IDS.has(data.equipmentRef);
      } else if (isSecSteam) {
        child.visible = false;
      } else {
        child.visible = true;
      }
    });

    // 4. Controller Badges Visibility
    this.controllerBadgesGroup.children.forEach((child) => {
      const data = child.userData?.data;
      if (!sectionId || sectionId === 'overview' || sectionId === 'all') {
        child.visible = true;
      } else if (isSec1 && data) {
        child.visible = AmmoniaPlant3D.SECTION_1_EQUIPMENT_IDS.has(data.equipmentRef);
      } else if (isSecCO2 && data) {
        child.visible = false;
      } else if (isSecK301 && data) {
        child.visible = AmmoniaPlant3D.SECTION_K301_EQUIPMENT_IDS.has(data.equipmentRef);
      } else if (isSecSynLoop && data) {
        child.visible = false;
      } else if (isSecRefrig && data) {
        child.visible = AmmoniaPlant3D.SECTION_REFRIG_EQUIPMENT_IDS.has(data.equipmentRef);
      } else if (isSecSteam) {
        child.visible = false;
      } else {
        child.visible = true;
      }
    });

    // 5. Piping Visibility
    this.pipingGroup.children.forEach((child) => {
      if (!sectionId || sectionId === 'overview' || sectionId === 'all') {
        child.visible = true;
      } else if (isSec1) {
        child.visible = child.userData?.isSection1 === true;
      } else if (isSecCO2) {
        child.visible = false;
      } else if (isSecK301) {
        child.visible = child.userData?.isSectionK301 === true;
      } else if (isSecSynLoop) {
        child.visible = false;
      } else if (isSecRefrig) {
        child.visible = child.userData?.isSectionRefrig === true;
      } else if (isSecSteam) {
        child.visible = false;
      } else {
        child.visible = true;
      }
    });

    // 6. Flow Particles Visibility
    this.particleSystems.forEach((ps) => {
      if (!sectionId || sectionId === 'overview' || sectionId === 'all') {
        ps.points.visible = true;
      } else if (isSec1) {
        ps.points.visible = ps.isSection1 === true;
      } else if (isSecCO2) {
        ps.points.visible = false;
      } else if (isSecK301) {
        ps.points.visible = ps.isSectionK301 === true;
      } else if (isSecSynLoop) {
        ps.points.visible = false;
      } else if (isSecRefrig) {
        ps.points.visible = ps.isSectionRefrig === true;
      } else if (isSecSteam) {
        ps.points.visible = false;
      } else {
        ps.points.visible = true;
      }
    });

    // 7. Isolated Steam System 3D Twin Visibility
    if (this.steamSystem) {
      if (isSecSteam) {
        this.steamSystem.group.visible = true;
      } else if (isSec1 || isSecCO2 || isSecK301 || isSecSynLoop || isSecRefrig || isSecStorage) {
        this.steamSystem.group.visible = false;
      } else {
        this.steamSystem.group.visible = true;
      }
    }

    // 8. Isolated Section 4 (Unit 400 - Synthesis & Refrigeration) 3D Twin Visibility
    if (this.synthesisSection400) {
      if (isSecSynLoop) {
        this.synthesisSection400.group.visible = true;
      } else {
        this.synthesisSection400.group.visible = false;
      }
    }

    // 9. Isolated Section 2 (Unit 200 - Catacarb CO2 Removal) 3D Twin Visibility
    if (this.co2RemovalSection200) {
      if (isSecCO2) {
        this.co2RemovalSection200.group.visible = true;
      } else {
        this.co2RemovalSection200.group.visible = false;
      }
    }
  }
}
