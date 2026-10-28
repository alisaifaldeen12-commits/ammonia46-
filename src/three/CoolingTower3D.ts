import * as THREE from 'three';
import { EquipmentInfo } from './PlantDiagramData';

export interface CoolingEquipmentData extends EquipmentInfo {
  fanNumber?: number;
  fanType?: string;
  ratedAirflow?: string;
  rotationalSpeed?: string;
  operatingStatus?: string;
  motorInfo?: string;
  driverType?: string;
  suctionSource?: string;
  dischargeDestination?: string;
  designFlowRate?: string;
  operatingFlowRate?: string;
  suctionPressure?: string;
  dischargePressure?: string;
  connectedEquipment?: string;
  coolingWaterInletOutlet?: string;
  inletOutletTemps?: string;
  pAndIdStatus?: string;
}

export class CoolingTower3D {
  public group: THREE.Group;
  public interactiveMeshes: THREE.Object3D[] = [];
  public onSelectCallback?: (info: EquipmentInfo) => void;

  // Subgroups
  public towerStructureGroup: THREE.Group = new THREE.Group();
  public fansGroup: THREE.Group = new THREE.Group();
  public pumpsGroup: THREE.Group = new THREE.Group();
  public condenserGroup: THREE.Group = new THREE.Group();
  public pipingGroup: THREE.Group = new THREE.Group();
  public badgesGroup: THREE.Group = new THREE.Group();
  public flowParticlesGroup: THREE.Group = new THREE.Group();

  // Animation states
  public isFanAnimationActive: boolean = true;
  public isWaterFlowActive: boolean = true;
  private fanBladesMeshes: THREE.Group[] = [];
  private flowParticleSystems: Array<{
    points: THREE.Points;
    curve: THREE.Curve<THREE.Vector3>;
    progress: Float32Array;
    speed: number;
  }> = [];

  // Currently highlighted mesh
  private selectedMesh: THREE.Object3D | null = null;
  private selectedOrigColor: THREE.Color | null = null;

  // Equipment Catalog
  public coolingEquipmentMap: Map<string, CoolingEquipmentData> = new Map();

  // Materials
  private matDarkLouvers!: THREE.MeshStandardMaterial;
  private matTowerFrame!: THREE.MeshStandardMaterial;
  private matFanShroudWhite!: THREE.MeshStandardMaterial;
  private matFanBladeDark!: THREE.MeshStandardMaterial;
  private matBasinConcrete!: THREE.MeshStandardMaterial;
  private matWaterSurface!: THREE.MeshStandardMaterial;
  private matWalkwaySteel!: THREE.MeshStandardMaterial;
  private matGuardrailYellow!: THREE.MeshStandardMaterial;
  private matPumpCasingBlue!: THREE.MeshStandardMaterial;
  private matMotorGreen!: THREE.MeshStandardMaterial;
  private matTurbineSilver!: THREE.MeshStandardMaterial;
  private matCondenserSteel!: THREE.MeshStandardMaterial;
  private matCoolingPipeBlue!: THREE.MeshStandardMaterial;
  private matReturnPipeCyan!: THREE.MeshStandardMaterial;
  private matFlangeSteel!: THREE.MeshStandardMaterial;
  private matValveBody!: THREE.MeshStandardMaterial;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'AmmoniaPlantCoolingTower3D';

    this.group.add(this.towerStructureGroup);
    this.group.add(this.fansGroup);
    this.group.add(this.pumpsGroup);
    this.group.add(this.condenserGroup);
    this.group.add(this.pipingGroup);
    this.group.add(this.badgesGroup);
    this.group.add(this.flowParticlesGroup);

    this.initMaterials();
    this.buildBasinAndFoundation();
    this.buildRectangularTowerStructure();
    this.buildNineCoolingFans();
    this.buildTenCoolingPumps();
    this.buildCondenserE711();
    this.buildInterconnectingPiping();
    this.buildWaterFlowParticles();
  }

  private initMaterials() {
    // 1. Dark grey horizontally ribbed louvers (air intake slats from reference photo)
    this.matDarkLouvers = new THREE.MeshStandardMaterial({
      color: 0x33383f,
      roughness: 0.65,
      metalness: 0.35,
      name: 'cooling_louvers_dark_grey'
    });

    // 2. Tower structural columns & beams (heavy industrial steel & concrete)
    this.matTowerFrame = new THREE.MeshStandardMaterial({
      color: 0x5a636e,
      roughness: 0.45,
      metalness: 0.65,
      name: 'cooling_tower_frame'
    });

    // 3. White / Light-grey fan housings / shrouds (matching flared stacks in reference photo)
    this.matFanShroudWhite = new THREE.MeshStandardMaterial({
      color: 0xebedf0,
      roughness: 0.28,
      metalness: 0.15,
      name: 'fan_shroud_light_grey'
    });

    // 4. Fan aerofoil blades
    this.matFanBladeDark = new THREE.MeshStandardMaterial({
      color: 0x1e242b,
      roughness: 0.3,
      metalness: 0.7,
      name: 'fan_blade_metallic'
    });

    // 5. Reinforced concrete basin and pump plinths
    this.matBasinConcrete = new THREE.MeshStandardMaterial({
      color: 0x8a9299,
      roughness: 0.88,
      metalness: 0.08,
      name: 'basin_concrete'
    });

    // 6. Water surface in basin
    this.matWaterSurface = new THREE.MeshStandardMaterial({
      color: 0x084b6f,
      roughness: 0.1,
      metalness: 0.4,
      transparent: true,
      opacity: 0.85,
      name: 'basin_water_surface'
    });

    // 7. Steel walkways & platforms
    this.matWalkwaySteel = new THREE.MeshStandardMaterial({
      color: 0x717c88,
      roughness: 0.55,
      metalness: 0.6,
      name: 'walkway_grating'
    });

    // 8. Safety guardrails
    this.matGuardrailYellow = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.35,
      metalness: 0.45,
      name: 'guardrail_yellow'
    });

    // 9. Industrial centrifugal pump casing (classic petrochemical blue)
    this.matPumpCasingBlue = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.35,
      metalness: 0.7,
      name: 'pump_casing_blue'
    });

    // 10. Electric motor driver (industrial green)
    this.matMotorGreen = new THREE.MeshStandardMaterial({
      color: 0x047857,
      roughness: 0.4,
      metalness: 0.65,
      name: 'motor_driver_green'
    });

    // 11. Steam turbine driver for P-A & P-B (heat resistant metallic silver/chrome)
    this.matTurbineSilver = new THREE.MeshStandardMaterial({
      color: 0xcfd6dc,
      roughness: 0.22,
      metalness: 0.9,
      name: 'steam_turbine_silver'
    });

    // 12. Condenser E711 shell
    this.matCondenserSteel = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.3,
      metalness: 0.8,
      name: 'condenser_e711_steel'
    });

    // 13. Cooling water supply piping (heavy blue industrial coating)
    this.matCoolingPipeBlue = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.25,
      metalness: 0.75,
      name: 'cooling_water_pipe_blue'
    });

    // 14. Return cooling water piping (cyan/light blue)
    this.matReturnPipeCyan = new THREE.MeshStandardMaterial({
      color: 0x00c8ef,
      roughness: 0.25,
      metalness: 0.75,
      name: 'return_cooling_pipe_cyan'
    });

    // 15. Flanges & bolt studs
    this.matFlangeSteel = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.25,
      metalness: 0.9,
      name: 'pipe_flange_steel'
    });

    // 16. Valves body
    this.matValveBody = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      roughness: 0.35,
      metalness: 0.6,
      name: 'valve_body_red'
    });
  }

  // 1. Concrete water collection basin & floor pad
  private buildBasinAndFoundation() {
    const basinGroup = new THREE.Group();

    // Large ground yard
    const yardGeo = new THREE.PlaneGeometry(160, 120);
    const yardMat = new THREE.MeshStandardMaterial({
      color: 0x1e242c,
      roughness: 0.85,
      metalness: 0.1
    });
    const yardMesh = new THREE.Mesh(yardGeo, yardMat);
    yardMesh.rotation.x = -Math.PI / 2;
    yardMesh.position.set(0, -0.05, 10);
    yardMesh.receiveShadow = true;
    basinGroup.add(yardMesh);

    // Concrete Basin Wall Perimeter (Outer: 114m x 26m, Wall thickness 1.2m, Height 3.2m)
    const basinWidth = 114;
    const basinDepth = 26;
    const basinHeight = 2.8;

    // Basin base slab
    const slabGeo = new THREE.BoxGeometry(basinWidth + 2, 0.6, basinDepth + 2);
    const slabMesh = new THREE.Mesh(slabGeo, this.matBasinConcrete);
    slabMesh.position.set(0, 0.3, -10);
    slabMesh.receiveShadow = true;
    basinGroup.add(slabMesh);

    // Basin Water Surface
    const waterGeo = new THREE.PlaneGeometry(basinWidth - 1.2, basinDepth - 1.2);
    const waterMesh = new THREE.Mesh(waterGeo, this.matWaterSurface);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(0, 2.0, -10);
    basinGroup.add(waterMesh);

    // Curb walls around basin
    const curbMat = this.matBasinConcrete;
    // Front curb wall
    const fWall = new THREE.Mesh(new THREE.BoxGeometry(basinWidth, basinHeight, 1.0), curbMat);
    fWall.position.set(0, basinHeight / 2 + 0.3, -10 + basinDepth / 2);
    basinGroup.add(fWall);

    // Back curb wall
    const bWall = new THREE.Mesh(new THREE.BoxGeometry(basinWidth, basinHeight, 1.0), curbMat);
    bWall.position.set(0, basinHeight / 2 + 0.3, -10 - basinDepth / 2);
    basinGroup.add(bWall);

    // Left curb wall
    const lWall = new THREE.Mesh(new THREE.BoxGeometry(1.0, basinHeight, basinDepth), curbMat);
    lWall.position.set(-basinWidth / 2, basinHeight / 2 + 0.3, -10);
    basinGroup.add(lWall);

    // Right curb wall
    const rWall = new THREE.Mesh(new THREE.BoxGeometry(1.0, basinHeight, basinDepth), curbMat);
    rWall.position.set(basinWidth / 2, basinHeight / 2 + 0.3, -10);
    basinGroup.add(rWall);

    // Equipment plinth apron in front of tower for the 10 pumps (Length 110m, Depth 14m, Height 0.6m)
    const pumpPadGeo = new THREE.BoxGeometry(110, 0.6, 14);
    const pumpPadMesh = new THREE.Mesh(pumpPadGeo, this.matBasinConcrete);
    pumpPadMesh.position.set(0, 0.3, 14);
    pumpPadMesh.receiveShadow = true;
    basinGroup.add(pumpPadMesh);

    const basinData: CoolingEquipmentData = {
      id: 'cooling_basin',
      tag: 'BASIN-01',
      name: 'Cold Water Collection Basin',
      arabicName: 'حوض تجميع مياه التبريد الباردة الرئيسي',
      type: 'vessel',
      section: 'Cooling Tower',
      sectionNumber: 900,
      rowNumber: 1,
      position: new THREE.Vector3(0, 1.0, -10),
      inletStream: 'Cooled water cascading down from PVC fill packs',
      outletStream: 'Flooded suction feed to Pumps P711A-J',
      operatingTemp: '28°C - 30°C (Cold Water Return to Plant)',
      operatingPress: 'Atmospheric Static Head (2.8m water depth)',
      catalystOrInternals: 'Reinforced concrete sumps, anti-vortex suction baffles, drain sloped floor',
      description: 'حوض خرساني مسلّح ضخم لتجميع مياه التبريد الباردة المتساقطة من حشوات التبريد العلوية، يوفر ضغطاً هيدروستاتيكياً موجباً لسحب جميع مضخات مياه التبريد العشرة (P711A..J).',
      operatingStatus: 'Normal Water Level (مستوى مياه تشغيلي مستقر)'
    };
    slabMesh.userData = { isCoolingEquipment: true, data: basinData };
    this.interactiveMeshes.push(slabMesh);
    this.coolingEquipmentMap.set('cooling_basin', basinData);
    this.coolingEquipmentMap.set('basin', basinData);

    const towerData: CoolingEquipmentData = {
      id: 'cooling_tower',
      tag: 'CT-01',
      name: 'Cooling Tower CT-01',
      arabicName: 'برج التبريد الصناعي CT-01',
      type: 'tower',
      section: 'Cooling Water System',
      sectionNumber: 900,
      rowNumber: 1,
      position: new THREE.Vector3(0, 10.0, -10.0),
      inletStream: 'Warm Cooling Water Return (WCR) from Ammonia Plant & E711',
      outletStream: 'Cooled Water Supply (CW) to Ammonia Plant & E711',
      operatingTemp: '38°C Inlet / 28°C Outlet',
      operatingPress: 'Atmospheric / 4.8 bar Discharge',
      catalystOrInternals: '9 Induced draft axial fans, PVC honeycomb fill pack, 10 cooling water pumps P711A-J, E711 surface condenser',
      description: 'برج التبريد الصناعي الرئيسي للمصنع مكون من 9 خلايا تبريد ومراوح سحب علوية عملاقة مع 10 مضخات تسحب الماء البارد والمكثف السطحي E711 المتصل بمضخات البخار.',
      operatingStatus: 'Normal Operation (تشغيل طبيعي)'
    };
    this.coolingEquipmentMap.set('cooling_tower', towerData);
    this.coolingEquipmentMap.set('ct-01', towerData);

    this.towerStructureGroup.add(basinGroup);
  }

  // 2. Main Rectangular Cooling Tower Body matching Reference Photograph
  private buildRectangularTowerStructure() {
    const towerGroup = new THREE.Group();

    const towerLength = 108; // 9 cells x 12m
    const towerHeight = 16.5; // from basin top to roof deck
    const towerDepth = 24.0;
    const baseY = 2.4;

    // Structural steel/concrete columns dividing the 9 cells (10 transverse frames)
    const numColumns = 10;
    const colSpacing = towerLength / (numColumns - 1);
    const startX = -towerLength / 2;

    for (let c = 0; c < numColumns; c++) {
      const cx = startX + c * colSpacing;

      // Front column
      const fColGeo = new THREE.BoxGeometry(1.0, towerHeight, 1.2);
      const fCol = new THREE.Mesh(fColGeo, this.matTowerFrame);
      fCol.position.set(cx, baseY + towerHeight / 2, -10 + towerDepth / 2);
      fCol.castShadow = true;
      towerGroup.add(fCol);

      // Back column
      const bCol = new THREE.Mesh(fColGeo, this.matTowerFrame);
      bCol.position.set(cx, baseY + towerHeight / 2, -10 - towerDepth / 2);
      bCol.castShadow = true;
      towerGroup.add(bCol);

      // Transverse top tie beam
      const tieGeo = new THREE.BoxGeometry(0.8, 1.0, towerDepth);
      const tie = new THREE.Mesh(tieGeo, this.matTowerFrame);
      tie.position.set(cx, baseY + towerHeight - 0.5, -10);
      towerGroup.add(tie);
    }

    // Horizontal Louvers (Front Facade):
    // In the photograph, the front facade is covered by dense horizontal inclined slats
    // angled downward to allow fresh air intake while preventing water splash-out.
    const louverCount = 18;
    const louverHeight = 0.65;
    const louverStep = (towerHeight - 2.5) / louverCount;

    for (let i = 0; i < louverCount; i++) {
      const ly = baseY + 1.2 + i * louverStep;
      const louverGeo = new THREE.BoxGeometry(towerLength - 0.5, louverHeight, 0.15);
      const louverMesh = new THREE.Mesh(louverGeo, this.matDarkLouvers);
      louverMesh.position.set(0, ly, -10 + towerDepth / 2);
      // Inclined at ~32 degrees matching industrial air-intake louvers
      louverMesh.rotation.x = -Math.PI / 5.5;
      louverMesh.castShadow = true;
      towerGroup.add(louverMesh);

      // Back facade louvers
      const backLouverMesh = new THREE.Mesh(louverGeo, this.matDarkLouvers);
      backLouverMesh.position.set(0, ly, -10 - towerDepth / 2);
      backLouverMesh.rotation.x = Math.PI / 5.5;
      backLouverMesh.castShadow = true;
      towerGroup.add(backLouverMesh);
    }

    // Internal cooling fill blocks (cellular PVC honeycomb pack visible between louvers)
    const fillMat = new THREE.MeshStandardMaterial({
      color: 0x24282f,
      roughness: 0.9,
      metalness: 0.1
    });
    for (let cell = 0; cell < 9; cell++) {
      const cellX = -towerLength / 2 + colSpacing / 2 + cell * colSpacing;
      const fillGeo = new THREE.BoxGeometry(colSpacing - 1.2, towerHeight * 0.65, towerDepth - 3.0);
      const fillMesh = new THREE.Mesh(fillGeo, fillMat);
      fillMesh.position.set(cellX, baseY + towerHeight * 0.45, -10);
      towerGroup.add(fillMesh);
    }

    // End Walls (Left & Right solid cladding with vertical stiffening ribs)
    const endWallGeo = new THREE.BoxGeometry(0.8, towerHeight, towerDepth);
    const leftEndWall = new THREE.Mesh(endWallGeo, this.matTowerFrame);
    leftEndWall.position.set(-towerLength / 2 - 0.4, baseY + towerHeight / 2, -10);
    towerGroup.add(leftEndWall);

    const rightEndWall = new THREE.Mesh(endWallGeo, this.matTowerFrame);
    rightEndWall.position.set(towerLength / 2 + 0.4, baseY + towerHeight / 2, -10);
    towerGroup.add(rightEndWall);

    // Roof Deck (Flat top platform where fans are mounted)
    const roofGeo = new THREE.BoxGeometry(towerLength + 2.0, 0.6, towerDepth + 2.0);
    const roofMesh = new THREE.Mesh(roofGeo, this.matWalkwaySteel);
    const roofY = baseY + towerHeight;
    roofMesh.position.set(0, roofY, -10);
    roofMesh.receiveShadow = true;
    towerGroup.add(roofMesh);

    // Perimeter Handrails / Guardrails on Roof Deck (Front, Back, Left, Right)
    this.buildRoofGuardrails(towerGroup, towerLength + 1.8, towerDepth + 1.8, roofY + 0.3);

    // Industrial Safety Cage Ladder on Left End Wall
    this.buildSafetyLadder(towerGroup, -towerLength / 2 - 1.2, 0.5, -10, roofY);

    // Main Industrial Access Staircase for Operators (درج الصعود الهيكلي إلى أعلى برج التبريد)
    this.buildMainAccessStaircase(towerGroup, -towerLength / 2 - 1.2, -4.0, roofY);

    this.towerStructureGroup.add(towerGroup);
  }

  // Helper: Roof safety guardrails with top rail, mid rail, and vertical posts
  private buildRoofGuardrails(parent: THREE.Group, length: number, depth: number, deckY: number) {
    const railHeight = 1.3;
    const postMat = this.matGuardrailYellow;

    // Posts along front and back
    const numPostsX = 24;
    for (let i = 0; i <= numPostsX; i++) {
      const x = -length / 2 + (i / numPostsX) * length;
      // Front post
      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, railHeight, 8), postMat);
      p1.position.set(x, deckY + railHeight / 2, -10 + depth / 2);
      parent.add(p1);

      // Back post
      const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, railHeight, 8), postMat);
      p2.position.set(x, deckY + railHeight / 2, -10 - depth / 2);
      parent.add(p2);
    }

    // Continuous rails (top rail & mid rail)
    const railGeoF = new THREE.CylinderGeometry(0.035, 0.035, length, 8);
    // Front top rail
    const ftRail = new THREE.Mesh(railGeoF, postMat);
    ftRail.rotation.z = Math.PI / 2;
    ftRail.position.set(0, deckY + railHeight, -10 + depth / 2);
    parent.add(ftRail);

    // Front mid rail
    const fmRail = new THREE.Mesh(railGeoF, postMat);
    fmRail.rotation.z = Math.PI / 2;
    fmRail.position.set(0, deckY + railHeight * 0.5, -10 + depth / 2);
    parent.add(fmRail);

    // Back top rail
    const btRail = new THREE.Mesh(railGeoF, postMat);
    btRail.rotation.z = Math.PI / 2;
    btRail.position.set(0, deckY + railHeight, -10 - depth / 2);
    parent.add(btRail);

    // Back mid rail
    const bmRail = new THREE.Mesh(railGeoF, postMat);
    bmRail.rotation.z = Math.PI / 2;
    bmRail.position.set(0, deckY + railHeight * 0.5, -10 - depth / 2);
    parent.add(bmRail);
  }

  // Helper: Steel cage ladder leading from ground to roof deck
  private buildSafetyLadder(parent: THREE.Group, x: number, startY: number, z: number, topY: number) {
    const ladderGroup = new THREE.Group();
    const ladderHeight = topY - startY;

    // Stringers
    const stringerGeo = new THREE.CylinderGeometry(0.03, 0.03, ladderHeight, 8);
    const s1 = new THREE.Mesh(stringerGeo, this.matWalkwaySteel);
    s1.position.set(x, startY + ladderHeight / 2, z - 0.35);
    ladderGroup.add(s1);

    const s2 = new THREE.Mesh(stringerGeo, this.matWalkwaySteel);
    s2.position.set(x, startY + ladderHeight / 2, z + 0.35);
    ladderGroup.add(s2);

    // Rungs
    const numRungs = Math.floor(ladderHeight / 0.35);
    for (let r = 0; r < numRungs; r++) {
      const ry = startY + 0.4 + r * 0.35;
      const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8), this.matWalkwaySteel);
      rung.rotation.x = Math.PI / 2;
      rung.position.set(x, ry, z);
      ladderGroup.add(rung);
    }

    // Safety cage hoops
    for (let h = 4; h < numRungs; h += 2) {
      const hy = startY + 0.4 + h * 0.35;
      const hoopGeo = new THREE.TorusGeometry(0.48, 0.02, 6, 12, Math.PI * 1.4);
      const hoop = new THREE.Mesh(hoopGeo, this.matGuardrailYellow);
      hoop.rotation.x = Math.PI / 2;
      hoop.rotation.z = -Math.PI / 1.4 / 2;
      hoop.position.set(x - 0.25, hy, z);
      ladderGroup.add(hoop);
    }

    parent.add(ladderGroup);
  }

  // Helper: Grand Multi-Flight Industrial Steel Access Staircase for Operators (درج الصعود إلى أعلى برج التبريد)
  private buildMainAccessStaircase(parent: THREE.Group, startX: number, startZ: number, topY: number) {
    const stairGroup = new THREE.Group();
    stairGroup.name = 'MainAccessStaircase';

    const landingWidth = 2.4;
    const landingDepth = 2.4;

    // Concrete Footing Pads at Ground (Y=0.3)
    const footingGeo = new THREE.BoxGeometry(1.2, 0.6, 1.2);
    const f1 = new THREE.Mesh(footingGeo, this.matBasinConcrete);
    f1.position.set(startX - 0.8, 0.3, startZ);
    stairGroup.add(f1);

    const f2 = new THREE.Mesh(footingGeo, this.matBasinConcrete);
    f2.position.set(startX - 0.8 - landingWidth, 0.3, startZ);
    stairGroup.add(f2);

    const f3 = new THREE.Mesh(footingGeo, this.matBasinConcrete);
    f3.position.set(startX - 0.8, 0.3, startZ + 6.0);
    stairGroup.add(f3);

    const f4 = new THREE.Mesh(footingGeo, this.matBasinConcrete);
    f4.position.set(startX - 0.8 - landingWidth, 0.3, startZ + 6.0);
    stairGroup.add(f4);

    // Vertical Support H-Columns for Landings
    const colGeo1 = new THREE.BoxGeometry(0.22, 6.5, 0.22);
    const col1 = new THREE.Mesh(colGeo1, this.matTowerFrame);
    col1.position.set(startX - 0.8, 3.25, startZ + 6.0);
    stairGroup.add(col1);

    const col2 = new THREE.Mesh(colGeo1, this.matTowerFrame);
    col2.position.set(startX - 0.8 - landingWidth, 3.25, startZ + 6.0);
    stairGroup.add(col2);

    const colGeo2 = new THREE.BoxGeometry(0.22, 12.5, 0.22);
    const col3 = new THREE.Mesh(colGeo2, this.matTowerFrame);
    col3.position.set(startX - 0.8, 6.25, startZ);
    stairGroup.add(col3);

    const col4 = new THREE.Mesh(colGeo2, this.matTowerFrame);
    col4.position.set(startX - 0.8 - landingWidth, 6.25, startZ);
    stairGroup.add(col4);

    const colGeo3 = new THREE.BoxGeometry(0.22, topY, 0.22);
    const col5 = new THREE.Mesh(colGeo3, this.matTowerFrame);
    col5.position.set(startX - 0.8, topY / 2, startZ + 6.0);
    stairGroup.add(col5);

    const col6 = new THREE.Mesh(colGeo3, this.matTowerFrame);
    col6.position.set(startX - 0.8 - landingWidth, topY / 2, startZ + 6.0);
    stairGroup.add(col6);

    // Landing Platforms (Landing 1 at Y=6.5, Landing 2 at Y=12.5, Top Deck Landing at Y=topY)
    const landings = [
      { y: 6.5, z: startZ + 6.0 },
      { y: 12.5, z: startZ },
      { y: topY, z: startZ + 6.0 }
    ];

    landings.forEach((land, idx) => {
      // Steel Deck Grating
      const deckGeo = new THREE.BoxGeometry(landingWidth + 0.4, 0.18, landingDepth + 0.4);
      const deck = new THREE.Mesh(deckGeo, this.matWalkwaySteel);
      deck.position.set(startX - 0.8 - landingWidth / 2, land.y, land.z);
      deck.receiveShadow = true;
      stairGroup.add(deck);

      // Support Frame Beams
      const frameGeo = new THREE.BoxGeometry(landingWidth + 0.6, 0.35, landingDepth + 0.6);
      const frame = new THREE.Mesh(frameGeo, this.matTowerFrame);
      frame.position.set(startX - 0.8 - landingWidth / 2, land.y - 0.2, land.z);
      stairGroup.add(frame);

      // Guardrails around landing (3 sides)
      const gHeight = 1.2;
      const gPosts = [
        new THREE.Vector3(startX - 0.8, land.y + gHeight / 2, land.z - landingDepth / 2),
        new THREE.Vector3(startX - 0.8 - landingWidth, land.y + gHeight / 2, land.z - landingDepth / 2),
        new THREE.Vector3(startX - 0.8 - landingWidth, land.y + gHeight / 2, land.z + landingDepth / 2),
        new THREE.Vector3(startX - 0.8, land.y + gHeight / 2, land.z + landingDepth / 2)
      ];

      gPosts.forEach((pPos) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, gHeight, 8), this.matGuardrailYellow);
        post.position.copy(pPos);
        stairGroup.add(post);
      });

      // Top rail along outer edge
      const railGeo = new THREE.CylinderGeometry(0.035, 0.035, landingWidth, 8);
      railGeo.rotateZ(Math.PI / 2);
      const rail1 = new THREE.Mesh(railGeo, this.matGuardrailYellow);
      rail1.position.set(startX - 0.8 - landingWidth / 2, land.y + gHeight, land.z + (idx % 2 === 0 ? landingDepth / 2 : -landingDepth / 2));
      stairGroup.add(rail1);
    });

    // Stair Flights (Flight 1: 0.5->6.5, Flight 2: 6.5->12.5, Flight 3: 12.5->topY)
    const flights = [
      { start: new THREE.Vector3(startX - 0.8 - landingWidth / 2, 0.5, startZ), end: new THREE.Vector3(startX - 0.8 - landingWidth / 2, 6.5, startZ + 6.0) },
      { start: new THREE.Vector3(startX - 0.8 - landingWidth / 2, 6.5, startZ + 6.0), end: new THREE.Vector3(startX - 0.8 - landingWidth / 2, 12.5, startZ) },
      { start: new THREE.Vector3(startX - 0.8 - landingWidth / 2, 12.5, startZ), end: new THREE.Vector3(startX - 0.8 - landingWidth / 2, topY, startZ + 6.0) }
    ];

    flights.forEach((fl) => {
      const deltaVec = new THREE.Vector3().subVectors(fl.end, fl.start);
      const flightLen = deltaVec.length();
      const numSteps = 16;

      // Diagonal C-Channel Steel Stringers (Left & Right)
      const stringerGeo = new THREE.BoxGeometry(0.12, 0.3, flightLen);
      const stringerL = new THREE.Mesh(stringerGeo, this.matTowerFrame);
      stringerL.position.copy(fl.start).add(fl.end).multiplyScalar(0.5);
      stringerL.position.x -= landingWidth / 2 - 0.1;
      stringerL.lookAt(fl.end);
      stairGroup.add(stringerL);

      const stringerR = new THREE.Mesh(stringerGeo, this.matTowerFrame);
      stringerR.position.copy(fl.start).add(fl.end).multiplyScalar(0.5);
      stringerR.position.x += landingWidth / 2 - 0.1;
      stringerR.lookAt(fl.end);
      stairGroup.add(stringerR);

      // Individual Tread Steps (درجات السلم المعدنية)
      for (let s = 0; s < numSteps; s++) {
        const t = s / numSteps;
        const stepPos = new THREE.Vector3().lerpVectors(fl.start, fl.end, t);
        const treadGeo = new THREE.BoxGeometry(landingWidth - 0.2, 0.08, 0.38);
        const tread = new THREE.Mesh(treadGeo, this.matWalkwaySteel);
        tread.position.copy(stepPos);
        stairGroup.add(tread);

        // Nosing & Yellow Safety Edge
        const edgeGeo = new THREE.BoxGeometry(landingWidth - 0.2, 0.09, 0.06);
        const edge = new THREE.Mesh(edgeGeo, this.matGuardrailYellow);
        edge.position.copy(stepPos);
        edge.position.z += 0.18;
        stairGroup.add(edge);
      }

      // Sloped Yellow Safety Handrail along staircase flight
      const handrailGeo = new THREE.CylinderGeometry(0.035, 0.035, flightLen, 8);
      const hRailL = new THREE.Mesh(handrailGeo, this.matGuardrailYellow);
      const midPoint = new THREE.Vector3().addVectors(fl.start, fl.end).multiplyScalar(0.5);
      hRailL.position.copy(midPoint);
      hRailL.position.y += 1.1;
      hRailL.position.x -= landingWidth / 2 - 0.1;
      hRailL.lookAt(fl.end.clone().add(new THREE.Vector3(0, 1.1, 0)));
      hRailL.rotateX(Math.PI / 2);
      stairGroup.add(hRailL);

      const hRailR = new THREE.Mesh(handrailGeo, this.matGuardrailYellow);
      hRailR.position.copy(midPoint);
      hRailR.position.y += 1.1;
      hRailR.position.x += landingWidth / 2 - 0.1;
      hRailR.lookAt(fl.end.clone().add(new THREE.Vector3(0, 1.1, 0)));
      hRailR.rotateX(Math.PI / 2);
      stairGroup.add(hRailR);
    });

    // Top Bridge Walkway Connecting Staircase Landing to Cooling Tower Top Roof Deck
    const bridgeGeo = new THREE.BoxGeometry(2.8, 0.18, 3.2);
    const bridge = new THREE.Mesh(bridgeGeo, this.matWalkwaySteel);
    bridge.position.set(startX - 0.2, topY, startZ + 6.0 - landingDepth / 2);
    stairGroup.add(bridge);

    const bridgeFrame = new THREE.BoxGeometry(2.8, 0.35, 3.2);
    const bFrame = new THREE.Mesh(bridgeFrame, this.matTowerFrame);
    bFrame.position.set(startX - 0.2, topY - 0.2, startZ + 6.0 - landingDepth / 2);
    stairGroup.add(bFrame);

    // 3D Floating Badge
    const badge = this.createBadge3D('MAIN ACCESS STAIRCASE (درج الصعود إلى أعلى برج التبريد)', 0xeab308);
    badge.position.set(startX - 2.0, topY + 2.5, startZ + 3.0);
    stairGroup.add(badge);

    parent.add(stairGroup);
  }

  // 3. Nine Large Cooling Fans along top roof deck in a single longitudinal row
  private buildNineCoolingFans() {
    const towerLength = 108;
    const numFans = 9;
    const spacing = towerLength / numFans;
    const deckY = 19.2;
    const stackHeight = 5.2;

    for (let f = 0; f < numFans; f++) {
      const fanIndex = f + 1;
      const fanTag = `FAN-${fanIndex}`;
      const fanId = `fan-${fanIndex}`;
      const fx = -towerLength / 2 + spacing / 2 + f * spacing;
      const fz = -10;

      const fanAssembly = new THREE.Group();
      fanAssembly.position.set(fx, deckY, fz);
      fanAssembly.name = fanTag;

      // Outer Fan Cowl / Stack (Authentic Flared Geometry from Reference Image)
      // Bottom radius ~3.6m, throat radius ~3.2m, flared top radius ~4.2m
      const points: THREE.Vector2[] = [];
      points.push(new THREE.Vector2(3.6, 0.0));
      points.push(new THREE.Vector2(3.4, 1.2));
      points.push(new THREE.Vector2(3.2, 2.8));
      points.push(new THREE.Vector2(3.5, 4.4));
      points.push(new THREE.Vector2(4.2, stackHeight)); // flared top rim
      points.push(new THREE.Vector2(4.1, stackHeight + 0.15));

      const latheGeo = new THREE.LatheGeometry(points, 28);
      const shroudMesh = new THREE.Mesh(latheGeo, this.matFanShroudWhite);
      shroudMesh.castShadow = true;
      shroudMesh.receiveShadow = true;
      fanAssembly.add(shroudMesh);

      // Vertical reinforcement ribs on stack exterior
      for (let r = 0; r < 12; r++) {
        const ang = (r / 12) * Math.PI * 2;
        const ribGeo = new THREE.BoxGeometry(0.1, stackHeight * 0.85, 0.18);
        const rib = new THREE.Mesh(ribGeo, this.matFanShroudWhite);
        const rx = Math.cos(ang) * 3.4;
        const rz = Math.sin(ang) * 3.4;
        rib.position.set(rx, stackHeight * 0.48, rz);
        rib.rotation.y = -ang;
        fanAssembly.add(rib);
      }

      // Internal Fan Mechanism (Hub + 6 Aerofoil Blades)
      const impellerGroup = new THREE.Group();
      impellerGroup.position.set(0, 3.0, 0);

      // Center nose cone / hub
      const hubGeo = new THREE.CylinderGeometry(0.65, 0.8, 0.9, 16);
      const hubMesh = new THREE.Mesh(hubGeo, this.matFanBladeDark);
      impellerGroup.add(hubMesh);

      // 6 Aerofoil Fan Blades
      const bladeCount = 6;
      for (let b = 0; b < bladeCount; b++) {
        const bAngle = (b / bladeCount) * Math.PI * 2;
        const bladeGeo = new THREE.BoxGeometry(2.4, 0.08, 0.48);
        const bladeMesh = new THREE.Mesh(bladeGeo, this.matFanBladeDark);
        bladeMesh.position.set(Math.cos(bAngle) * 1.8, 0, Math.sin(bAngle) * 1.8);
        bladeMesh.rotation.y = -bAngle;
        bladeMesh.rotation.z = 0.22; // Aerofoil pitch angle
        impellerGroup.add(bladeMesh);
      }

      fanAssembly.add(impellerGroup);
      this.fanBladesMeshes.push(impellerGroup);

      // Gearbox & Motor Support Beams beneath fan
      const supportGeo = new THREE.BoxGeometry(7.0, 0.4, 0.4);
      const sup1 = new THREE.Mesh(supportGeo, this.matTowerFrame);
      sup1.position.set(0, 1.2, 0);
      fanAssembly.add(sup1);

      const sup2 = new THREE.Mesh(supportGeo, this.matTowerFrame);
      sup2.rotation.y = Math.PI / 2;
      sup2.position.set(0, 1.2, 0);
      fanAssembly.add(sup2);

      // Gearbox cylinder
      const gbGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 12);
      const gbMesh = new THREE.Mesh(gbGeo, this.matTowerFrame);
      gbMesh.position.set(0, 2.0, 0);
      fanAssembly.add(gbMesh);

      // 3D Tag Badge
      const badge = this.createBadge3D(fanTag, 0x00c8ef);
      badge.position.set(0, stackHeight + 1.2, 0);
      fanAssembly.add(badge);

      // Interactive metadata setup
      const fanData: CoolingEquipmentData = {
        id: fanId,
        tag: fanTag,
        name: `Cooling Tower Fan #${fanIndex}`,
        arabicName: `مروحة سحب برج التبريد رقم ${fanIndex}`,
        type: 'tower',
        section: 'Cooling Tower',
        sectionNumber: 900,
        rowNumber: 1,
        position: new THREE.Vector3(fx, deckY + stackHeight / 2, fz),
        inletStream: 'Warm Ambient Air / Cooling Cell Vapor',
        outletStream: 'Humid Hot Exhaust Air plume',
        operatingTemp: '34.5°C wet bulb exhaust',
        operatingPress: 'Atmospheric (Induced Draft)',
        catalystOrInternals: '6 Aerofoil FRP composite blades, right-angle spiral bevel reduction gearbox',
        description: `مروحة سحب محوري علوية عملاقة (Fan ${fanIndex}) مثبتة فوق الخلية رقم ${fanIndex} لسحب الهواء الجوي عبر حشوات التبريد (PVC Fill) وتبريد مياه التبريد العائدة من مكثفات ومبادلات مجمع الأمونيا.`,
        fanNumber: fanIndex,
        fanType: 'Induced Draft Axial Fan (مروحة سحب محوري)',
        ratedAirflow: 'Data not provided',
        rotationalSpeed: 'Data not provided',
        operatingStatus: 'Operational (دوران تشغيلي مستمر)',
        motorInfo: 'Electric Motor Driven via Gearbox'
      };

      shroudMesh.userData = { isCoolingEquipment: true, data: fanData };
      this.interactiveMeshes.push(shroudMesh);
      this.coolingEquipmentMap.set(fanId, fanData);

      this.fansGroup.add(fanAssembly);
    }
  }

  // 4. Ten Cooling Water Pumps (P711A, P711B, P-C through P-J)
  // - First 2 pumps (P711A & P711B) are massive steam turbine-driven pumps for E711
  // - Remaining 8 pumps (P-C to P-J) are large high-voltage electric motor-driven pumps
  // - All pumps feature realistic large split-case volutes, flexible shaft couplings with yellow guards,
  //   large-bore suction lines from basin, and underground discharge loops diving into the concrete trench
  private buildTenCoolingPumps() {
    const pumpTags = ['P711A', 'P711B', 'P-C', 'P-D', 'P-E', 'P-F', 'P-G', 'P-H', 'P-I', 'P-J'];
    const startX = -45;
    const spacingX = 10.0;
    const pumpZ = 14.0;
    const baseElevation = 0.6; // atop concrete equipment pad

    pumpTags.forEach((tag, idx) => {
      const px = startX + idx * spacingX;
      const isTurbine = idx < 2; // P711A & P711B are turbine-driven
      const pumpId = tag.toLowerCase().replace(' ', '-');

      const pumpAssembly = new THREE.Group();
      pumpAssembly.position.set(px, baseElevation, pumpZ);
      pumpAssembly.name = tag;

      // Dimensions based on driver type (Turbine pumps are particularly massive)
      const plinthL = isTurbine ? 6.6 : 5.6;
      const plinthW = isTurbine ? 3.8 : 3.2;
      const skidL = isTurbine ? 6.2 : 5.2;
      const skidW = isTurbine ? 3.4 : 2.8;
      const pumpCenterY = isTurbine ? 1.85 : 1.65;
      const pumpXOffset = isTurbine ? 1.35 : 1.15;
      const voluteRadius = isTurbine ? 1.05 : 0.88;
      const voluteWidth = isTurbine ? 1.3 : 1.1;

      // 1. Heavy Reinforced Concrete Plinth (قاعدة خرسانية ضخمة مسلحة)
      const plinthGeo = new THREE.BoxGeometry(plinthL, 0.55, plinthW);
      const plinth = new THREE.Mesh(plinthGeo, this.matBasinConcrete);
      plinth.position.set(0, 0.28, 0);
      plinth.receiveShadow = true;
      pumpAssembly.add(plinth);

      // Machined Heavy Structural Steel Skid (هيكل قاعدة حديدية متينة للمضخة والمحرك)
      const skidGeo = new THREE.BoxGeometry(skidL, 0.25, skidW);
      const skid = new THREE.Mesh(skidGeo, this.matTowerFrame);
      skid.position.set(0, 0.68, 0);
      pumpAssembly.add(skid);

      // 2. Large Centrifugal Pump Volute Casing (جسم المضخة الحلزوني الضخم ذو الانقسام الأفقي)
      const voluteGroup = new THREE.Group();
      voluteGroup.position.set(pumpXOffset, pumpCenterY, 0);

      // Main volute cylinder with heavy industrial blue coating
      const voluteGeo = new THREE.CylinderGeometry(voluteRadius, voluteRadius, voluteWidth, 24);
      voluteGeo.rotateZ(Math.PI / 2);
      const voluteMesh = new THREE.Mesh(voluteGeo, this.matPumpCasingBlue);
      voluteMesh.castShadow = true;
      voluteGroup.add(voluteMesh);

      // Horizontal split-case parting flange (شفة الانقسام الأفقي مع صف من مسامير التثبيت)
      const splitFlangeGeo = new THREE.BoxGeometry(voluteWidth + 0.15, 0.12, voluteRadius * 2 + 0.35);
      const splitFlange = new THREE.Mesh(splitFlangeGeo, this.matFlangeSteel);
      voluteGroup.add(splitFlange);

      // Impeller center hub & twin bearing housings (كراسي التحميل على جانبي المضخة)
      const bearingL = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.7, 16), this.matFlangeSteel);
      bearingL.rotation.z = Math.PI / 2;
      bearingL.position.set(-voluteWidth / 2 - 0.35, 0, 0);
      voluteGroup.add(bearingL);

      const bearingR = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.7, 16), this.matFlangeSteel);
      bearingR.rotation.z = Math.PI / 2;
      bearingR.position.set(voluteWidth / 2 + 0.35, 0, 0);
      voluteGroup.add(bearingR);

      // Horizontal Large-Bore Suction Nozzle (فوهة السحب الأفقية الكبيرة المتجهة للخلف نحو الحوض)
      const sNozzleR = isTurbine ? 0.62 : 0.54;
      const suctionNozzleGeo = new THREE.CylinderGeometry(sNozzleR, sNozzleR, 1.1, 20);
      suctionNozzleGeo.rotateX(Math.PI / 2);
      const suctionNozzle = new THREE.Mesh(suctionNozzleGeo, this.matFlangeSteel);
      suctionNozzle.position.set(0, 0, -0.85);
      voluteGroup.add(suctionNozzle);

      // Vertical Large-Bore Discharge Nozzle (فوهة الطرد الرأسية الكبيرة المتجهة لأعلى)
      const dNozzleR = isTurbine ? 0.52 : 0.46;
      const dischargeNozzleGeo = new THREE.CylinderGeometry(dNozzleR, dNozzleR, 1.0, 20);
      const dischargeNozzle = new THREE.Mesh(dischargeNozzleGeo, this.matFlangeSteel);
      dischargeNozzle.position.set(0, voluteRadius + 0.3, 0);
      voluteGroup.add(dischargeNozzle);

      pumpAssembly.add(voluteGroup);

      // 3. Driver: Giant Steam Turbine for P711A/B or Heavy HV Electric Motor for P-C..J
      if (isTurbine) {
        // =========================================================================
        // STEAM TURBINE DRIVER (توربين بخاري صناعي عملاق لمضخات P711A و P711B)
        // =========================================================================
        const turbineGroup = new THREE.Group();
        turbineGroup.position.set(-1.6, pumpCenterY, 0);

        // Stepped multi-stage heavy steam turbine casing (جسم التوربين المتدرج)
        const tCasingGeo = new THREE.CylinderGeometry(0.85, 1.05, 2.7, 24);
        tCasingGeo.rotateZ(Math.PI / 2);
        const tCasing = new THREE.Mesh(tCasingGeo, this.matTurbineSilver);
        tCasing.castShadow = true;
        turbineGroup.add(tCasing);

        // Turbine horizontal joint split flanges with heavy studs
        const tSplitGeo = new THREE.BoxGeometry(2.8, 0.14, 2.2);
        const tSplit = new THREE.Mesh(tSplitGeo, this.matTowerFrame);
        turbineGroup.add(tSplit);

        // Governor Valve Chest & Emergency Trip Throttle Valve on top (صندوق صمامات الحاكم والبخار)
        const govGeo = new THREE.BoxGeometry(0.85, 0.9, 0.75);
        const gov = new THREE.Mesh(govGeo, this.matValveBody);
        gov.position.set(0.2, 1.15, 0);
        turbineGroup.add(gov);

        // High-pressure steam inlet header pipe
        const steamInlet = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.2, 14), this.matFlangeSteel);
        steamInlet.position.set(0.2, 1.8, 0);
        turbineGroup.add(steamInlet);

        // Steam inlet companion flange
        const steamFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.16, 14), this.matFlangeSteel);
        steamFlange.position.set(0.2, 2.35, 0);
        turbineGroup.add(steamFlange);

        // Low-pressure steam exhaust duct nozzle (فوهة العادم السفلية للتوربين)
        const steamExhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.9, 16), this.matFlangeSteel);
        steamExhaust.position.set(-0.6, -0.8, 0.4);
        turbineGroup.add(steamExhaust);

        // Heavy bearing pedestals with oil reservoir & sight glasses
        const tPed1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.8), this.matFlangeSteel);
        tPed1.position.set(-1.4, -0.4, 0);
        turbineGroup.add(tPed1);

        const tPed2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.8), this.matFlangeSteel);
        tPed2.position.set(1.4, -0.4, 0);
        turbineGroup.add(tPed2);

        pumpAssembly.add(turbineGroup);
      } else {
        // =========================================================================
        // HEAVY HIGH-VOLTAGE ELECTRIC MOTOR (محرك كهربائي صناعي ضخم مربع الشكل للمضخات P-C إلى P-J)
        // =========================================================================
        const motorGroup = new THREE.Group();
        motorGroup.position.set(-1.6, pumpCenterY, 0);

        // Large square/box-like high-voltage motor main enclosure (جسم المحرك الكهربائي الضخم المربع)
        const motorBoxGeo = new THREE.BoxGeometry(2.4, 1.75, 1.8);
        const motorMesh = new THREE.Mesh(motorBoxGeo, this.matMotorGreen);
        motorMesh.castShadow = true;
        motorGroup.add(motorMesh);

        // Longitudinal cooling ribs along top & bottom sides of the square motor
        for (let rib = -3; rib <= 3; rib++) {
          const ribZ = rib * 0.24;
          const ribTop = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.1, 0.08), this.matMotorGreen);
          ribTop.position.set(0, 0.92, ribZ);
          motorGroup.add(ribTop);

          const ribBottom = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.1, 0.08), this.matMotorGreen);
          ribBottom.position.set(0, -0.92, ribZ);
          motorGroup.add(ribBottom);
        }

        // Heavy High-Voltage Terminal Connection Box on top of the square motor (صندوق توصيل الجهد العالي)
        const termGeo = new THREE.BoxGeometry(0.85, 0.65, 0.75);
        const termBox = new THREE.Mesh(termGeo, this.matTowerFrame);
        termBox.position.set(0.1, 1.2, 0);
        motorGroup.add(termBox);

        // High voltage warning plate on terminal box
        const hvPlate = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.35), this.matGuardrailYellow);
        hvPlate.position.set(0.1, 1.2, 0.39);
        motorGroup.add(hvPlate);

        // Rear motor cooling fan cowl (غطاء مروحة التبريد المربعة الخلفية)
        const cowlGeo = new THREE.BoxGeometry(0.5, 1.7, 1.7);
        const cowl = new THREE.Mesh(cowlGeo, this.matTowerFrame);
        cowl.position.set(-1.45, 0, 0);
        motorGroup.add(cowl);

        // Heavy motor mounting feet bolted to skid sole plates
        const footGeo = new THREE.BoxGeometry(2.0, 0.35, 0.45);
        const footFront = new THREE.Mesh(footGeo, this.matTowerFrame);
        footFront.position.set(0, -0.88, 0.75);
        motorGroup.add(footFront);

        const footBack = new THREE.Mesh(footGeo, this.matTowerFrame);
        footBack.position.set(0, -0.88, -0.75);
        motorGroup.add(footBack);

        pumpAssembly.add(motorGroup);
      }

      // =========================================================================
      // 4. HEAVY FLEXIBLE SHAFT COUPLING (كوبلنج مرن بين المحرك / التوربين والمضخة)
      // High-torque API 671 spacer coupling with prominent Safety-Yellow Guard
      // =========================================================================
      const couplingGroup = new THREE.Group();
      couplingGroup.position.set(0.0, pumpCenterY, 0);

      // Rotating shaft & spacer coupling body
      const shaftGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.0, 16);
      shaftGeo.rotateZ(Math.PI / 2);
      const shaft = new THREE.Mesh(shaftGeo, this.matFlangeSteel);
      couplingGroup.add(shaft);

      // Coupling hubs on pump & motor sides
      const hubGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.28, 16);
      hubGeo.rotateZ(Math.PI / 2);
      const hubL = new THREE.Mesh(hubGeo, this.matFlangeSteel);
      hubL.position.set(-0.35, 0, 0);
      couplingGroup.add(hubL);

      const hubR = new THREE.Mesh(hubGeo, this.matFlangeSteel);
      hubR.position.set(0.35, 0, 0);
      couplingGroup.add(hubR);

      // Industrial Heavy Protective Coupling Guard (غطاء حماية الكوبلنج بلون أصفر سلامة تحذيري)
      const guardRadius = isTurbine ? 0.58 : 0.52;
      const guardGeo = new THREE.CylinderGeometry(guardRadius, guardRadius, 0.85, 20);
      guardGeo.rotateZ(Math.PI / 2);
      const guardMesh = new THREE.Mesh(guardGeo, this.matGuardrailYellow);
      guardMesh.castShadow = true;
      couplingGroup.add(guardMesh);

      // Guard mounting bracket to skid base
      const guardStrap = new THREE.Mesh(new THREE.BoxGeometry(0.12, pumpCenterY - 0.68, 0.35), this.matTowerFrame);
      guardStrap.position.set(0, -(pumpCenterY - 0.68) / 2, 0);
      couplingGroup.add(guardStrap);

      pumpAssembly.add(couplingGroup);

      // =========================================================================
      // 5. LARGE-BORE SUCTION LINE (أنابيب السحب الكبيرة من أسفل حوض البرج)
      // Connected directly to front basin wall at Z = -11.0, Y = 0.6
      // =========================================================================
      const suctionGroup = new THREE.Group();
      suctionGroup.position.set(pumpXOffset, 0, 0);

      // A. Basin Wall Penetration Sleeve & Double Flanges at local Z = -11.0
      const wallSleeveGeo = new THREE.CylinderGeometry(0.72, 0.72, 1.4, 18);
      wallSleeveGeo.rotateX(Math.PI / 2);
      const wallSleeve = new THREE.Mesh(wallSleeveGeo, this.matFlangeSteel);
      wallSleeve.position.set(0, 0.6, -11.0);
      suctionGroup.add(wallSleeve);

      const wallFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.88, 0.24, 20), this.matFlangeSteel);
      wallFlange.rotation.x = Math.PI / 2;
      wallFlange.position.set(0, 0.6, -10.3);
      suctionGroup.add(wallFlange);

      // Submerged intake bellmouth strainer inside basin water
      const bellmouthGeo = new THREE.ConeGeometry(0.95, 1.7, 20, 1, true);
      bellmouthGeo.rotateX(-Math.PI / 2);
      const bellmouth = new THREE.Mesh(bellmouthGeo, this.matTowerFrame);
      bellmouth.position.set(0, 0.6, -11.85);
      suctionGroup.add(bellmouth);

      // B. Massive Horizontal Suction Pipe (Large-Bore DN1100 / DN1200)
      const sPipeR = isTurbine ? 0.58 : 0.52;
      const sPipeGeo = new THREE.CylinderGeometry(sPipeR, sPipeR, 8.4, 22);
      sPipeGeo.rotateX(Math.PI / 2);
      const sPipeMesh = new THREE.Mesh(sPipeGeo, this.matCoolingPipeBlue);
      sPipeMesh.position.set(0, 0.6, -6.1);
      sPipeMesh.castShadow = true;
      suctionGroup.add(sPipeMesh);

      // Heavy concrete support sleeper pedestal
      const sleeperGeo = new THREE.BoxGeometry(1.8, 0.45, 1.2);
      const sleeper = new THREE.Mesh(sleeperGeo, this.matBasinConcrete);
      sleeper.position.set(0, 0.22, -6.5);
      suctionGroup.add(sleeper);

      // C. Heavy Suction Isolation Gate Valve (صمام سحب رئيسي - صمام الدخول) at Z = -7.0
      const sValveGroup = new THREE.Group();
      sValveGroup.position.set(0, 0.6, -7.0);

      const sValveBody = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.4, 1.1), this.matValveBody);
      sValveBody.castShadow = true;
      sValveGroup.add(sValveBody);

      const sFlange1 = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.84, 0.2, 20), this.matFlangeSteel);
      sFlange1.rotation.x = Math.PI / 2;
      sFlange1.position.set(0, 0, -0.58);
      sValveGroup.add(sFlange1);

      const sFlange2 = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.84, 0.2, 20), this.matFlangeSteel);
      sFlange2.rotation.x = Math.PI / 2;
      sFlange2.position.set(0, 0, 0.58);
      sValveGroup.add(sFlange2);

      // Valve bonnet, rising stem & handwheel
      const sBonnet = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 0.75, 14), this.matFlangeSteel);
      sBonnet.position.set(0, 0.95, 0);
      sValveGroup.add(sBonnet);

      const sStem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.65, 8), this.matFlangeSteel);
      sStem.position.set(0, 1.4, 0);
      sValveGroup.add(sStem);

      const sWheelGeo = new THREE.TorusGeometry(0.48, 0.07, 8, 24);
      const sWheel = new THREE.Mesh(sWheelGeo, this.matValveBody);
      sWheel.rotation.x = Math.PI / 2;
      sWheel.position.set(0, 1.75, 0);
      sValveGroup.add(sWheel);

      for (let sp = 0; sp < 4; sp++) {
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.94, 8), this.matFlangeSteel);
        spoke.rotation.z = (sp * Math.PI) / 4;
        spoke.position.set(0, 1.75, 0);
        sValveGroup.add(spoke);
      }
      suctionGroup.add(sValveGroup);

      // D. Suction T-Type Basket Strainer (مصفي سحب لحماية دافعة المضخة) at Z = -4.2
      const strainerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.64, 1.2, 18), this.matFlangeSteel);
      strainerBody.position.set(0, 0.15, -4.2);
      suctionGroup.add(strainerBody);

      const strainerBlind = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.74, 0.16, 18), this.matTowerFrame);
      strainerBlind.position.set(0, -0.45, -4.2);
      suctionGroup.add(strainerBlind);

      // E. Eccentric Reducer & Transition lifting line smoothly to pump centerline
      const reducerCurve = [
        new THREE.Vector3(0, 0.6, -1.9),
        new THREE.Vector3(0, (0.6 + pumpCenterY) / 2, -1.3),
        new THREE.Vector3(0, pumpCenterY, -0.85) // connects to pump suction nozzle
      ];
      this.createPipePath(reducerCurve, sPipeR, this.matCoolingPipeBlue, suctionGroup, 'Suction Reducer');

      const pumpSF = new THREE.Mesh(new THREE.CylinderGeometry(sNozzleR + 0.15, sNozzleR + 0.15, 0.2, 20), this.matFlangeSteel);
      pumpSF.rotation.x = Math.PI / 2;
      pumpSF.position.set(0, pumpCenterY, -0.85);
      suctionGroup.add(pumpSF);

      pumpAssembly.add(suctionGroup);

      // =========================================================================
      // 6. UNDERGROUND DISCHARGE LINE (خطوط الطرد / الدسجارج تنزل تحت الأرض)
      // Exits vertical discharge nozzle, passes through check & isolation valves,
      // and loops downward diving UNDERGROUND into the concrete trench!
      // =========================================================================
      const dischargeGroup = new THREE.Group();
      dischargeGroup.position.set(pumpXOffset, 0, 0);

      const nozzleTopY = pumpCenterY + voluteRadius + 0.3;

      // Pump discharge companion flange
      const pumpDF = new THREE.Mesh(new THREE.CylinderGeometry(dNozzleR + 0.14, dNozzleR + 0.14, 0.18, 20), this.matFlangeSteel);
      pumpDF.position.set(0, nozzleTopY + 0.1, 0);
      dischargeGroup.add(pumpDF);

      // Concentric increaser spool
      const dPipeR = isTurbine ? 0.52 : 0.46;
      const increaserGeo = new THREE.CylinderGeometry(dPipeR, dNozzleR, 0.45, 20);
      const increaser = new THREE.Mesh(increaserGeo, this.matCoolingPipeBlue);
      increaser.position.set(0, nozzleTopY + 0.35, 0);
      dischargeGroup.add(increaser);

      // Non-return Check Valve (صمام عدم رجوع)
      const checkY = nozzleTopY + 0.8;
      const checkGroup = new THREE.Group();
      checkGroup.position.set(0, checkY, 0);

      const checkBody = new THREE.Mesh(new THREE.CylinderGeometry(dPipeR + 0.1, dPipeR + 0.1, 0.55, 20), this.matFlangeSteel);
      checkGroup.add(checkBody);

      const cF1 = new THREE.Mesh(new THREE.CylinderGeometry(dPipeR + 0.22, dPipeR + 0.22, 0.14, 20), this.matFlangeSteel);
      cF1.position.set(0, -0.27, 0);
      checkGroup.add(cF1);

      const cF2 = new THREE.Mesh(new THREE.CylinderGeometry(dPipeR + 0.22, dPipeR + 0.22, 0.14, 20), this.matFlangeSteel);
      cF2.position.set(0, 0.27, 0);
      checkGroup.add(cF2);

      const cCover = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.16), this.matTowerFrame);
      cCover.position.set(0, 0, dPipeR + 0.15);
      checkGroup.add(cCover);

      dischargeGroup.add(checkGroup);

      // Pressure Gauge PI
      const piGroup = new THREE.Group();
      piGroup.position.set(0, checkY - 0.25, dPipeR + 0.12);
      const piStem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.25, 8), this.matFlangeSteel);
      piStem.rotation.x = Math.PI / 2;
      piGroup.add(piStem);

      const piDial = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.09, 16), this.matFanShroudWhite);
      piDial.rotation.x = Math.PI / 2;
      piDial.position.set(0, 0, 0.16);
      piGroup.add(piDial);
      dischargeGroup.add(piGroup);

      // Discharge Isolation Gate Valve (صمام طرد / دسجارج رئيسي)
      const valveY = checkY + 0.75;
      const dValveGroup = new THREE.Group();
      dValveGroup.position.set(0, valveY, 0);

      const dValveBody = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.1, 1.0), this.matValveBody);
      dValveBody.castShadow = true;
      dValveGroup.add(dValveBody);

      const dF1 = new THREE.Mesh(new THREE.CylinderGeometry(dPipeR + 0.22, dPipeR + 0.22, 0.16, 20), this.matFlangeSteel);
      dF1.position.set(0, -0.5, 0);
      dValveGroup.add(dF1);

      const dF2 = new THREE.Mesh(new THREE.CylinderGeometry(dPipeR + 0.22, dPipeR + 0.22, 0.16, 20), this.matFlangeSteel);
      dF2.position.set(0, 0.5, 0);
      dValveGroup.add(dF2);

      // Forward-facing Handwheel for plant operators
      const dWheelShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.55, 8), this.matFlangeSteel);
      dWheelShaft.rotation.x = Math.PI / 2;
      dWheelShaft.position.set(0, 0, 0.65);
      dValveGroup.add(dWheelShaft);

      const dWheel = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.06, 8, 20), this.matValveBody);
      dWheel.position.set(0, 0, 0.95);
      dValveGroup.add(dWheel);

      dischargeGroup.add(dValveGroup);

      // Downward Loop Diving Underground (ينحني للأمام ويغطس عمودياً تحت الأرض)
      const loopTopY = valveY + 0.6;
      const undergroundDischargePoints = [
        new THREE.Vector3(0, valveY + 0.5, 0),
        new THREE.Vector3(0, loopTopY, 0.6),
        new THREE.Vector3(0, loopTopY - 0.1, 1.4), // turns forward
        new THREE.Vector3(0, 2.0, 1.4),            // dives down
        new THREE.Vector3(0, 0.0, 1.4),            // passes floor trench collar
        new THREE.Vector3(0, -1.0, 1.4)           // underground level connecting to buried header
      ];
      this.createPipePath(undergroundDischargePoints, dPipeR, this.matCoolingPipeBlue, dischargeGroup, 'Underground Discharge Pipe');

      // Concrete Trench Opening & Steel Grating Collar at floor level
      const trenchOpening = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 1.8), this.matBasinConcrete);
      trenchOpening.position.set(0, 0.45, 1.4);
      dischargeGroup.add(trenchOpening);

      const gratingFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 1.6), this.matWalkwaySteel);
      gratingFrame.position.set(0, 0.58, 1.4);
      dischargeGroup.add(gratingFrame);

      pumpAssembly.add(dischargeGroup);

      // 3D Tag Badge above pump
      const badgeColor = isTurbine ? 0xf59e0b : 0x10b981;
      const badge = this.createBadge3D(tag, badgeColor);
      badge.position.set(0, 5.6, 0);
      pumpAssembly.add(badge);

      // Equipment Data & Metadata Registration
      const driverDesc = isTurbine
        ? 'Industrial Multi-Stage Steam Turbine (توربين بخاري صناعي عملاق)'
        : 'Heavy High-Voltage Induction Electric Motor (محرك كهربائي صناعي ضخم 6.6kV)';

      const connDesc = isTurbine
        ? 'Condenser E711 & Cooling Tower Cold Water Basin (مكثف E711 وحوض ماء البرج)'
        : 'Underground CW Supply Headers & Basin (مجمعات تبريد المصنع المدفونة تحت الأرض)';

      const destDesc = isTurbine
        ? 'Underground CW Pipe to Condenser E711 (خط مدفون إلى مكثف E711)'
        : 'Underground CW Supply Distribution Header (مجمع إمداد مياه التبريد المدفون تحت الأرض)';

      const pumpData: CoolingEquipmentData = {
        id: pumpId,
        tag: tag,
        name: isTurbine ? `Turbine Cooling Water Pump ${tag}` : `Electric Cooling Water Pump ${tag}`,
        arabicName: isTurbine
          ? `مضخة مياه التبريد التوربينية العملاقة (${tag})`
          : `مضخة مياه التبريد الكهربائية الكبيرة (${tag})`,
        type: 'pump',
        section: 'Cooling Tower & Pumping Station',
        sectionNumber: 900,
        rowNumber: 2,
        position: new THREE.Vector3(px, baseElevation + pumpCenterY, pumpZ),
        inletStream: 'Cooling Water (CW / Wc) from Tower Basin via Flooded Suction Line',
        outletStream: isTurbine ? 'CW to Condenser E711 via Underground Discharge Line' : 'CW to Underground Header via Floor Trench Penetration',
        operatingTemp: 'Data not provided',
        operatingPress: 'Data not provided',
        catalystOrInternals: isTurbine
          ? 'Large horizontal split-case casing, double-suction impeller, multi-stage steam turbine driver, API 671 flexible spacer coupling with yellow guard, underground discharge loop'
          : 'Large horizontal split-case casing, heavy-duty induction motor, API 671 flexible coupling with yellow guard, underground discharge trench connection',
        driverType: driverDesc,
        rotationalSpeed: isTurbine ? '4500 RPM (High-Speed Steam Turbine)' : '1480 RPM (HV Electric Motor)',
        suctionSource: 'Cooling Tower Cold Water Basin (حوض ماء التبريد أسفل البرج عبر صمام سحب كبير)',
        dischargeDestination: destDesc,
        connectedEquipment: connDesc,
        designFlowRate: 'Not provided',
        operatingFlowRate: 'Data not provided',
        suctionPressure: 'Data not provided',
        dischargePressure: 'Data not provided',
        operatingStatus: 'Standby / Operational (جاهزة للتشغيل بـ 4500 RPM)',
        description: isTurbine
          ? `مضخة مياه تبريد رئيسية عملاقة (${tag}) مدفوعة بواسطة توربين بخاري صناعي عالي السرعة بـ 4500 دورة/دقيقة (4500 RPM). يخرج البخار المعدوم (Low Pressure Exhaust Steam) من التوربين عبر خط سحب بخار عادم معزول ضخم مزود بصمام قطعي رئيسي كبير متهاوي مباشرة إلى أعلى رأس المكثفة السطحية E711. بينما تسحب المضخة الماء البارد من قاع حوض البرج وتضخه إلى المكثفة عبر أنبوب سحب وطرد مدفون تحت الأرض.`
          : `مضخة مياه تبريد كهربائية كبيرة الحجم (${tag}) مدفوعة بمحرك كهربائي صناعي ضخم عالي الجهد مع زعانف تبريد وصندوق كابلات وكوبلنج مرن محمي بغطاء أصفر. تسحب ماء التبريد من قاع حوض البرج وتضخه عبر صمام عدم رجوع وصمام دسجارج ليغطس الأنبوب تحت الأرض داخل خندق مجمع مياه التبريد الرئيسي للمعمل.`,
        pAndIdStatus: isTurbine ? 'Verified 4500 RPM Turbine Exhaust Connection to E711' : 'Awaiting P&ID verification'
      };

      voluteMesh.userData = { isCoolingEquipment: true, data: pumpData };
      this.interactiveMeshes.push(voluteMesh);

      // Register primary and alias keys in the catalog map
      this.coolingEquipmentMap.set(pumpId, pumpData);
      if (tag === 'P711A') {
        this.coolingEquipmentMap.set('p-711a', pumpData);
        this.coolingEquipmentMap.set('p-a', pumpData);
      } else if (tag === 'P711B') {
        this.coolingEquipmentMap.set('p-711b', pumpData);
        this.coolingEquipmentMap.set('p-b', pumpData);
      }

      this.pumpsGroup.add(pumpAssembly);
    });
  }

  // 5. Separate Industrial Condenser E711
  private buildCondenserE711() {
    const e711Group = new THREE.Group();
    const cx = -66.0;
    const cy = 0.6;
    const cz = 18.0;
    e711Group.position.set(cx, cy, cz);
    e711Group.name = 'E711_Condenser';

    // Concrete saddle foundation piers
    const pierGeo = new THREE.BoxGeometry(2.4, 2.2, 5.5);
    const pier1 = new THREE.Mesh(pierGeo, this.matBasinConcrete);
    pier1.position.set(-6.0, 1.1, 0);
    e711Group.add(pier1);

    const pier2 = new THREE.Mesh(pierGeo, this.matBasinConcrete);
    pier2.position.set(6.0, 1.1, 0);
    e711Group.add(pier2);

    // Steel Saddle Supports
    const saddleGeo = new THREE.BoxGeometry(1.6, 0.8, 5.0);
    const s1 = new THREE.Mesh(saddleGeo, this.matTowerFrame);
    s1.position.set(-6.0, 2.6, 0);
    e711Group.add(s1);

    const s2 = new THREE.Mesh(saddleGeo, this.matTowerFrame);
    s2.position.set(6.0, 2.6, 0);
    e711Group.add(s2);

    // Main Cylindrical Condenser Shell (Diameter 4.6m, Length 16m)
    const shellGeo = new THREE.CylinderGeometry(2.3, 2.3, 16.0, 24);
    shellGeo.rotateZ(Math.PI / 2);
    const shellMesh = new THREE.Mesh(shellGeo, this.matCondenserSteel);
    shellMesh.position.set(0, 5.0, 0);
    shellMesh.castShadow = true;
    e711Group.add(shellMesh);

    // Domed Channel Heads / Water Boxes at both ends
    const headGeo = new THREE.SphereGeometry(2.3, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    // Left water box
    const lHead = new THREE.Mesh(headGeo, this.matFlangeSteel);
    lHead.rotation.z = Math.PI / 2;
    lHead.position.set(-8.0, 5.0, 0);
    e711Group.add(lHead);

    // Right water box (cooling water inlet/outlet connection head)
    const rHead = new THREE.Mesh(headGeo, this.matFlangeSteel);
    rHead.rotation.z = -Math.PI / 2;
    rHead.position.set(8.0, 5.0, 0);
    e711Group.add(rHead);

    // Water box flanges
    const flangeGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.4, 24);
    flangeGeo.rotateZ(Math.PI / 2);
    const f1 = new THREE.Mesh(flangeGeo, this.matFlangeSteel);
    f1.position.set(-8.0, 5.0, 0);
    e711Group.add(f1);

    const f2 = new THREE.Mesh(flangeGeo, this.matFlangeSteel);
    f2.position.set(8.0, 5.0, 0);
    e711Group.add(f2);

    // Steam Inlet Neck on top of shell (large neck connecting to turbine exhaust)
    const steamNeckGeo = new THREE.CylinderGeometry(1.6, 1.8, 2.2, 20);
    const steamNeck = new THREE.Mesh(steamNeckGeo, this.matCondenserSteel);
    steamNeck.position.set(0, 7.8, 0);
    e711Group.add(steamNeck);

    const steamFlange = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 0.35, 20), this.matFlangeSteel);
    steamFlange.position.set(0, 8.9, 0);
    e711Group.add(steamFlange);

    // Hotwell Condensate Collection Sump at bottom
    const hotwellGeo = new THREE.CylinderGeometry(1.1, 1.1, 1.8, 16);
    const hotwell = new THREE.Mesh(hotwellGeo, this.matCondenserSteel);
    hotwell.position.set(0, 2.0, 0);
    e711Group.add(hotwell);

    // Cooling Water Nozzles on Right Channel Head:
    // Bottom Nozzle: Cooling Water INLET (from P-A and P-B)
    const inNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.4, 16), this.matCoolingPipeBlue);
    inNozzle.position.set(8.6, 3.8, 0);
    inNozzle.rotation.z = Math.PI / 2;
    e711Group.add(inNozzle);

    // Top Nozzle: Cooling Water OUTLET (return to Cooling Tower top header)
    const outNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.4, 16), this.matReturnPipeCyan);
    outNozzle.position.set(8.6, 6.2, 0);
    outNozzle.rotation.z = Math.PI / 2;
    e711Group.add(outNozzle);

    // 3D Tag Badge
    const badge = this.createBadge3D('E711 — Condenser', 0x38bdf8);
    badge.position.set(0, 10.2, 0);
    e711Group.add(badge);

    // Equipment Data
    const e711Data: CoolingEquipmentData = {
      id: 'e-711',
      tag: 'E711',
      name: 'Surface Condenser E711',
      arabicName: 'المكثف السطحي الصناعي E711',
      type: 'exchanger',
      section: 'Condensing & Cooling Water Circuit',
      sectionNumber: 900,
      rowNumber: 3,
      position: new THREE.Vector3(cx, 5.0, cz),
      inletStream: 'Turbine Exhaust Steam & Cooling Water from P-A / P-B',
      outletStream: 'Condensate to BFW System & Return Cooling Water to Tower',
      operatingTemp: 'Inlet/Outlet temperatures: Not provided',
      operatingPress: 'Flow rate & operating pressure: Not provided',
      catalystOrInternals: 'Titanium/Brass shell & tube heat exchanger bundle, expansion joints, vacuum hotwell',
      description: 'مكثف سطحي صناعي ضخم (E711 Condenser) يتصل مباشرة بمضخات مياه التبريد التوربينية الأولى (P-A و P-B) لتكثيف البخار العادم من التوربينات وتحويله إلى ماء مكثف نقي يعاد إلى منظومة مياه المراجل B.F.W.',
      coolingWaterInletOutlet: 'Connected to turbine-driven pumps P-A & P-B discharge line (Awaiting P&ID verification)',
      inletOutletTemps: 'Not provided',
      connectedEquipment: 'Cooling Water Pumps P-A & P-B, Steam Turbine Exhaust, BFW Deaerator',
      pAndIdStatus: 'Verified connection to P-A & P-B'
    };

    shellMesh.userData = { isCoolingEquipment: true, data: e711Data };
    this.interactiveMeshes.push(shellMesh);
    this.coolingEquipmentMap.set('e-711', e711Data);

    this.condenserGroup.add(e711Group);
  }

  // 6. Traceable Industrial Piping & Directional Arrows
  // - Cooling Water Supply (CW / Wc Supply) to Condenser E711 and Ammonia Plant Units
  // - Cooling Water Recycle / Return (CW Recycle / Return) bringing warm water back from plant to tower top
  // - 9 Cell spray distribution droppers with nozzles
  // 6. Traceable Industrial Piping & Directional Arrows
  // - Large-Bore Underground Cooling Water Supply (CW Supply) to E711 & Ammonia Plant Units
  // - Large-Bore Overhead Cooling Water Recycle / Return (CW Recycle / Return)
  // - 9 Cell spray distribution droppers with nozzles
  private buildInterconnectingPiping() {
    const pipeGroup = new THREE.Group();

    // =========================================================================
    // A. CONDENSER E711 UNDERGROUND SUPPLY & OVERHEAD RETURN PIPING
    // P-A & P-B discharges dive underground at Z = 15.4, Y = -0.8.
    // The underground supply line runs beneath the plinth to Condenser E711
    // and rises up out of the ground directly into the bottom inlet nozzle!
    // =========================================================================
    const e711UndergroundSupply = [
      new THREE.Vector3(-35 + 1.35, -0.8, 15.4), // P711B underground tie
      new THREE.Vector3(-45 + 1.35, -0.8, 15.4), // P711A underground tie
      new THREE.Vector3(-57.4, -0.8, 15.4),      // underground run towards E711
      new THREE.Vector3(-57.4, -0.8, 18.0),      // right below E711 inlet nozzle
      new THREE.Vector3(-57.4, 3.8, 18.0)        // rises up out of ground into inlet nozzle
    ];
    this.createPipePath(e711UndergroundSupply, 0.52, this.matCoolingPipeBlue, pipeGroup, 'P711A/B to E711 Underground Supply Pipe');

    // Concrete trench opening & sleeve collar around E711 inlet riser
    const e711SleeveGeo = new THREE.BoxGeometry(1.8, 0.3, 1.8);
    const e711Sleeve = new THREE.Mesh(e711SleeveGeo, this.matBasinConcrete);
    e711Sleeve.position.set(-57.4, 0.15, 18.0);
    pipeGroup.add(e711Sleeve);

    // Directional chevron arrow on rising pipe to E711
    this.addDirectionalArrow(pipeGroup, new THREE.Vector3(-57.4, 2.2, 18.0), new THREE.Vector3(0, 1, 0), 0x0284c7);

    // Condenser E711 Return Warm Water Pipe (rises up to top overhead header)
    const e711ReturnPoints = [
      new THREE.Vector3(-57.4, 6.8, 18.0),  // from E711 top outlet nozzle
      new THREE.Vector3(-57.4, 19.8, 18.0), // massive vertical riser
      new THREE.Vector3(-57.4, 19.8, -4.0), // turns toward tower roof deck
      new THREE.Vector3(-54.0, 19.8, -4.0)  // joins top overhead distribution header
    ];
    this.createPipePath(e711ReturnPoints, 0.48, this.matReturnPipeCyan, pipeGroup, 'E711 to Tower Return Pipe');

    // =========================================================================
    // EXHAUST STEAM DUCT FROM BOTH 4500 RPM P711A & P711B TURBINES TO CONDENSER E711
    // (خط البخار المعدوم القادم من كلا التوربينين البخاريين P711A و P711B بـ 4500 RPM إلى المكثفة E711)
    // =========================================================================
    const matSteamPipe = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.25,
      metalness: 0.85,
      name: 'steam_exhaust_pipe_silver'
    });

    // P711A Turbine Exhaust Branch (Riser from P711A turbine nozzle)
    const p711aSteamBranch = [
      new THREE.Vector3(-47.2, 1.05, 14.4), // P711A turbine steam exhaust nozzle
      new THREE.Vector3(-47.2, 8.9, 14.4)   // rises up to header elevation
    ];
    this.createPipePath(p711aSteamBranch, 0.42, matSteamPipe, pipeGroup, 'P711A Turbine Exhaust Branch');

    // P711B Turbine Exhaust Branch (Riser from P711B turbine nozzle running west)
    const p711bSteamBranch = [
      new THREE.Vector3(-37.2, 1.05, 14.4), // P711B turbine steam exhaust nozzle
      new THREE.Vector3(-37.2, 8.9, 14.4),  // rises up to header elevation
      new THREE.Vector3(-47.2, 8.9, 14.4)   // runs west to merge with P711A branch at header junction
    ];
    this.createPipePath(p711bSteamBranch, 0.42, matSteamPipe, pipeGroup, 'P711B Turbine Exhaust Branch');

    // Common Steam Exhaust Collector Header to Condenser E711
    const commonSteamHeader = [
      new THREE.Vector3(-47.2, 8.9, 14.4), // junction point of P711A & P711B branches
      new THREE.Vector3(-47.2, 8.9, 18.0), // turns north toward E711 steam neck
      new THREE.Vector3(-66.0, 8.9, 18.0)  // connects into E711 top steam inlet neck
    ];
    this.createPipePath(commonSteamHeader, 0.48, matSteamPipe, pipeGroup, 'Common Turbine Exhaust Collector Header to E711');

    // Flange Stud Rings & T-Junction fitting at (-47.2, 8.9, 14.4)
    const tJunctionMesh = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), this.matFlangeSteel);
    tJunctionMesh.position.set(-47.2, 8.9, 14.4);
    pipeGroup.add(tJunctionMesh);

    // Large Steam Isolation / Emergency Trip Valve on the common exhaust header
    const steamValveGroup = new THREE.Group();
    steamValveGroup.position.set(-56.0, 8.9, 18.0);

    const sVBody = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.6, 1.4), this.matValveBody);
    sVBody.castShadow = true;
    steamValveGroup.add(sVBody);

    const sVFlange1 = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.22, 20), this.matFlangeSteel);
    sVFlange1.rotation.z = Math.PI / 2;
    sVFlange1.position.set(-0.9, 0, 0);
    steamValveGroup.add(sVFlange1);

    const sVFlange2 = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.22, 20), this.matFlangeSteel);
    sVFlange2.rotation.z = Math.PI / 2;
    sVFlange2.position.set(0.9, 0, 0);
    steamValveGroup.add(sVFlange2);

    // Actuator Bonnet & Large Control Handwheel
    const sVActuator = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 1.1, 16), this.matFlangeSteel);
    sVActuator.position.set(0, 1.35, 0);
    steamValveGroup.add(sVActuator);

    const sVWheel = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.09, 8, 24), this.matValveBody);
    sVWheel.rotation.x = Math.PI / 2;
    sVWheel.position.set(0, 2.1, 0);
    steamValveGroup.add(sVWheel);

    pipeGroup.add(steamValveGroup);

    // 3D Floating Badge for Exhaust Steam
    const steamBadge = this.createBadge3D('EXHAUST STEAM 4500 RPM (خط البخار المعدوم من التوربينات P711A و P711B إلى المكثفة E711)', 0xf59e0b);
    steamBadge.position.set(-51.0, 11.2, 18.0);
    pipeGroup.add(steamBadge);

    // Directional Chevron Arrow showing Exhaust Steam flow into E711
    this.addDirectionalArrow(pipeGroup, new THREE.Vector3(-51.0, 8.9, 18.0), new THREE.Vector3(-1, 0, 0), 0xf59e0b);

    // =========================================================================
    // B. MASSIVE UNDERGROUND CW SUPPLY HEADER (خط إمداد مياه التبريد المدفون تحت الأرض)
    // Runs underground at Y = -0.8, Z = 15.4 collecting all pump discharges (P-C..P-J)
    // Large-Bore Diameter = 1.44m (DN1400)
    // Concrete trench covers and inspection pits along the ground route
    // =========================================================================
    const undergroundMainHeader = [
      new THREE.Vector3(-25.0 + 1.15, -0.8, 15.4),
      new THREE.Vector3(52.0, -0.8, 15.4),
      new THREE.Vector3(52.0, -0.8, 40.0) // runs underground to ammonia plant units
    ];
    this.createPipePath(undergroundMainHeader, 0.72, this.matCoolingPipeBlue, pipeGroup, 'Underground CW Supply Header');

    // Underground pipe trench concrete covers & inspection access manholes along the pump row
    const trenchCheckPointsX = [-20, -5, 10, 25, 40, 52];
    trenchCheckPointsX.forEach((tx) => {
      // Concrete trench inspection pit frame
      const pitGeo = new THREE.BoxGeometry(2.4, 0.15, 2.4);
      const pit = new THREE.Mesh(pitGeo, this.matBasinConcrete);
      pit.position.set(tx, 0.08, 15.4);
      pipeGroup.add(pit);

      // Steel trench diamond grating cover
      const grateGeo = new THREE.BoxGeometry(2.1, 0.06, 2.1);
      const grate = new THREE.Mesh(grateGeo, this.matWalkwaySteel);
      grate.position.set(tx, 0.16, 15.4);
      pipeGroup.add(grate);
    });

    // Trench covers along the underground route heading to the plant (Z: 22, 32, 40)
    [22, 32, 40].forEach((tz) => {
      const pitGeo = new THREE.BoxGeometry(2.4, 0.15, 2.4);
      const pit = new THREE.Mesh(pitGeo, this.matBasinConcrete);
      pit.position.set(52.0, 0.08, tz);
      pipeGroup.add(pit);

      const grateGeo = new THREE.BoxGeometry(2.1, 0.06, 2.1);
      const grate = new THREE.Mesh(grateGeo, this.matWalkwaySteel);
      grate.position.set(52.0, 0.16, tz);
      pipeGroup.add(grate);
    });

    // Supply Header 3D Floating Badge
    const supplyBadge = this.createBadge3D('CW SUPPLY (مجمع مياه التبريد المدفون تحت الأرض)', 0x0284c7);
    supplyBadge.position.set(52.0, 2.2, 28.0);
    pipeGroup.add(supplyBadge);

    // Directional arrows along Underground CW Supply
    this.addDirectionalArrow(pipeGroup, new THREE.Vector3(15.0, 0.4, 15.4), new THREE.Vector3(1, 0, 0), 0x0284c7);
    this.addDirectionalArrow(pipeGroup, new THREE.Vector3(52.0, 0.4, 25.0), new THREE.Vector3(0, 0, 1), 0x0284c7);

    // =========================================================================
    // C. MASSIVE CW RECYCLE / RETURN HEADER (الخط الراجع الرئيسي لماء التبريد من المعمل)
    // Large-Bore Diameter = 1.44m (DN1400)
    // 1. Enters from plant battery limits at X = 55.0, Z = 40.0, Y = 5.6
    // 2. Runs along heavy steel pipe racks to Z = -10.0
    // 3. Climbs as a Giant Vertical Riser up tower right wall (Y = 5.6 to Y = 20.0)
    // 4. Continues as a 1.35m overhead distribution manifold across all 9 cells
    // =========================================================================
    const recyclePipePoints = [
      new THREE.Vector3(55.0, 5.6, 40.0),  // from ammonia synthesis & reforming
      new THREE.Vector3(55.0, 5.6, 0.0),   // along pipe rack
      new THREE.Vector3(54.0, 5.6, -10.0),  // turns toward cooling tower end wall
      new THREE.Vector3(54.0, 20.0, -10.0), // massive vertical riser climbing up right wall
      new THREE.Vector3(54.0, 20.0, -4.0),  // turns onto top roof distribution deck
      new THREE.Vector3(-54.0, 20.0, -4.0)  // longitudinal distribution header above all 9 cells
    ];
    this.createPipePath(recyclePipePoints, 0.72, this.matReturnPipeCyan, pipeGroup, 'CW Recycle Return Header');

    // Heavy pipe racks supporting the return line along Z: 10, 25, 40
    [10, 25, 40].forEach((rz) => {
      this.buildPipeRackGantry(pipeGroup, 55.0, rz, 5.8, 3.8);
    });

    // Massive wall anchor bracket clamps on tower right wall (Y: 8, 12, 16, 19)
    [8.0, 12.0, 16.0, 19.0].forEach((wy) => {
      const bracketGeo = new THREE.BoxGeometry(1.2, 0.35, 0.8);
      const bracket = new THREE.Mesh(bracketGeo, this.matTowerFrame);
      bracket.position.set(54.0, wy, -10.35);
      pipeGroup.add(bracket);
    });

    // Main Return Header Isolation Valve with handwheel at riser base (Y = 8.5)
    const riserValve = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.5, 1.5), this.matValveBody);
    riserValve.position.set(54.0, 8.5, -10.0);
    pipeGroup.add(riserValve);

    const riserValveWheel = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.08, 8, 24), this.matValveBody);
    riserValveWheel.rotation.y = Math.PI / 2;
    riserValveWheel.position.set(54.9, 8.5, -10.0);
    pipeGroup.add(riserValveWheel);

      // =========================================================================
      // D. TOP HOT WATER DISTRIBUTION BASINS & WCR DISCHARGE SPOUTS (أحواض التوزيع العلوية وخط الراجع WCR الذي يصب فيها)
      // In each of the 9 cells, the WCR line discharges directly into an open top hot water distribution basin trough on top deck
      // =========================================================================
      const towerLength = 108;
      const numCells = 9;
      const cellSpacing = towerLength / numCells;

      for (let c = 0; c < numCells; c++) {
        const cellCenterX = -towerLength / 2 + cellSpacing / 2 + c * cellSpacing;

        // 1. Open Top Hot Water Distribution Basin Trough atop Cell Deck (Y = 18.9 to 19.4)
        const basinTroughGeo = new THREE.BoxGeometry(cellSpacing - 1.4, 0.5, 12.0);
        const basinTrough = new THREE.Mesh(basinTroughGeo, this.matTowerFrame);
        basinTrough.position.set(cellCenterX, 19.15, -4.0);
        pipeGroup.add(basinTrough);

        // Water surface inside the open top distribution basin
        const topWaterGeo = new THREE.BoxGeometry(cellSpacing - 1.8, 0.12, 11.6);
        const topWater = new THREE.Mesh(topWaterGeo, this.matWaterSurface);
        topWater.position.set(cellCenterX, 19.35, -4.0);
        pipeGroup.add(topWater);

        // 2. Curved WCR Discharge Spout / Elbow pouring directly down into the top basin
        const spoutCurve = [
          new THREE.Vector3(cellCenterX, 20.0, -4.0),
          new THREE.Vector3(cellCenterX, 19.8, -4.0),
          new THREE.Vector3(cellCenterX, 19.6, -4.0)
        ];
        this.createPipePath(spoutCurve, 0.38, this.matReturnPipeCyan, pipeGroup, `Cell-${c + 1} WCR Discharge Spout`);

        // Flanged Spout Outlet Mouth
        const spoutMouthGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.18, 16);
        const spoutMouth = new THREE.Mesh(spoutMouthGeo, this.matFlangeSteel);
        spoutMouth.position.set(cellCenterX, 19.55, -4.0);
        pipeGroup.add(spoutMouth);

        // 3. Water Discharge Cascade / Stream Pouring into the top basin
        const pourStreamGeo = new THREE.CylinderGeometry(0.42, 0.58, 0.3, 16);
        const pourStream = new THREE.Mesh(pourStreamGeo, new THREE.MeshStandardMaterial({
          color: 0x00e5aa,
          roughness: 0.1,
          metalness: 0.3,
          transparent: true,
          opacity: 0.85,
          emissive: 0x00c8ef,
          emissiveIntensity: 0.3
        }));
        pourStream.position.set(cellCenterX, 19.4, -4.0);
        pipeGroup.add(pourStream);

        // Splash ring / ripple in top hot water basin
        const splashRingGeo = new THREE.TorusGeometry(0.75, 0.08, 8, 20);
        const splashRing = new THREE.Mesh(splashRingGeo, this.matWaterSurface);
        splashRing.rotation.x = Math.PI / 2;
        splashRing.position.set(cellCenterX, 19.38, -4.0);
        pipeGroup.add(splashRing);

        // Vertical dropper pipe into cell interior (Y: 19.2 down to 16.5)
        const dropperPoints = [
          new THREE.Vector3(cellCenterX, 19.2, -4.0),
          new THREE.Vector3(cellCenterX, 16.5, -4.0),
          new THREE.Vector3(cellCenterX, 16.5, -10.0) // enters cell spray deck
        ];
        this.createPipePath(dropperPoints, 0.32, this.matReturnPipeCyan, pipeGroup, `Cell-${c + 1} Internal Spray Dropper`);

        // Cell feed isolation valve
        const cellValve = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.8, 0.8), this.matValveBody);
        cellValve.position.set(cellCenterX, 18.6, -4.0);
        pipeGroup.add(cellValve);

        const cellValveWheel = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.05, 8, 18), this.matValveBody);
        cellValveWheel.rotation.x = Math.PI / 2;
        cellValveWheel.position.set(cellCenterX, 19.0, -4.0);
        pipeGroup.add(cellValveWheel);

        // Transverse & Lateral internal spray manifold distribution grid inside cell
        const sprayHeaderCenterZ = -10.0;
        const mainHeaderGeo = new THREE.CylinderGeometry(0.26, 0.26, 12.0, 14);
        mainHeaderGeo.rotateX(Math.PI / 2);
        const mainHeader = new THREE.Mesh(mainHeaderGeo, this.matReturnPipeCyan);
        mainHeader.position.set(cellCenterX, 16.6, sprayHeaderCenterZ);
        pipeGroup.add(mainHeader);

        // Lateral branch pipes branching sideways in each cell (4 lateral branches per cell)
        const branchOffsetZ = [-4.5, -1.5, 1.5, 4.5];
        const sprayConeMat = new THREE.MeshStandardMaterial({
          color: 0x00e5aa,
          roughness: 0.15,
          metalness: 0.2,
          transparent: true,
          opacity: 0.65,
          emissive: 0x00c8ef,
          emissiveIntensity: 0.4,
          side: THREE.DoubleSide
        });

        const nozzleMat = this.matFlangeSteel;

        branchOffsetZ.forEach((zOff) => {
          const branchZ = sprayHeaderCenterZ + zOff;
          // Lateral pipe running along X axis across cell width
          const branchGeo = new THREE.CylinderGeometry(0.18, 0.18, cellSpacing - 2.2, 12);
          branchGeo.rotateZ(Math.PI / 2);
          const branchMesh = new THREE.Mesh(branchGeo, this.matReturnPipeCyan);
          branchMesh.position.set(cellCenterX, 16.5, branchZ);
          pipeGroup.add(branchMesh);

          // 4 Spray Nozzles along each lateral branch (total 16 nozzles per cell)
          const nozzleXOffsets = [-3.6, -1.2, 1.2, 3.6];
          nozzleXOffsets.forEach((xOff) => {
            const nozzleX = cellCenterX + xOff;

            // Brass / PVC Anti-Clog Swirl Spray Nozzle Body
            const nozzleNipple = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 10), nozzleMat);
            nozzleNipple.position.set(nozzleX, 16.25, branchZ);
            pipeGroup.add(nozzleNipple);

            const nozzleTip = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.32, 12), nozzleMat);
            nozzleTip.rotation.x = Math.PI; // pointing downwards
            nozzleTip.position.set(nozzleX, 16.0, branchZ);
            pipeGroup.add(nozzleTip);

            // Translucent Atomized Water Spray Cone (قمع الرش المائي النفاث لأسفل)
            const coneGeo = new THREE.ConeGeometry(0.85, 2.2, 16, 1, true);
            coneGeo.rotateX(Math.PI); // pointing down
            const sprayCone = new THREE.Mesh(coneGeo, sprayConeMat);
            sprayCone.position.set(nozzleX, 14.8, branchZ);
            pipeGroup.add(sprayCone);
          });
        });
      }

      // HOT WATER SPRAY NOZZLES 3D Floating Badge
      const sprayBadge = this.createBadge3D('HOT WATER SPRAY NOZZLES (فوهات ونوزلات الرش العلوية)', 0x00e5aa);
      sprayBadge.position.set(0, 18.2, -10.0);
      pipeGroup.add(sprayBadge);

      // WCR Recycle Header 3D Floating Badge
      const recycleBadge = this.createBadge3D('WCR RECYCLE / RETURN (الخط الراجع WCR يصب في أعلى البرج)', 0x00c8ef);
      recycleBadge.position.set(55.0, 8.2, 18.0);
      pipeGroup.add(recycleBadge);

      // Top Hot Water Basins 3D Badge
      const basinBadge = this.createBadge3D('HOT WATER DISTRIBUTION BASINS (أحواض التوزيع العلوية)', 0x00e5aa);
      basinBadge.position.set(0, 21.8, -4.0);
      pipeGroup.add(basinBadge);

    // Directional arrows along CW Recycle
    this.addDirectionalArrow(pipeGroup, new THREE.Vector3(55.0, 5.6, 22.0), new THREE.Vector3(0, 0, -1), 0x00c8ef);
    this.addDirectionalArrow(pipeGroup, new THREE.Vector3(54.0, 14.0, -10.0), new THREE.Vector3(0, 1, 0), 0x00c8ef);
    this.addDirectionalArrow(pipeGroup, new THREE.Vector3(20.0, 20.0, -4.0), new THREE.Vector3(-1, 0, 0), 0x00c8ef);
    this.addDirectionalArrow(pipeGroup, new THREE.Vector3(-25.0, 20.0, -4.0), new THREE.Vector3(-1, 0, 0), 0x00c8ef);

    this.pipingGroup.add(pipeGroup);
  }

  // Helper: Structural steel pipe rack gantry (H-beam portal frame)
  private buildPipeRackGantry(parent: THREE.Group, x: number, z: number, topY: number, width: number) {
    const rackGroup = new THREE.Group();
    rackGroup.position.set(x, 0, z);

    // Left post
    const postGeo = new THREE.BoxGeometry(0.4, topY, 0.4);
    const p1 = new THREE.Mesh(postGeo, this.matTowerFrame);
    p1.position.set(-width / 2, topY / 2, 0);
    rackGroup.add(p1);

    // Right post
    const p2 = new THREE.Mesh(postGeo, this.matTowerFrame);
    p2.position.set(width / 2, topY / 2, 0);
    rackGroup.add(p2);

    // Concrete footings
    const footGeo = new THREE.BoxGeometry(1.0, 0.6, 1.0);
    const f1 = new THREE.Mesh(footGeo, this.matBasinConcrete);
    f1.position.set(-width / 2, 0.3, 0);
    rackGroup.add(f1);

    const f2 = new THREE.Mesh(footGeo, this.matBasinConcrete);
    f2.position.set(width / 2, 0.3, 0);
    rackGroup.add(f2);

    // Cross beam supporting pipes
    const beamGeo = new THREE.BoxGeometry(width + 1.0, 0.4, 0.45);
    const beam = new THREE.Mesh(beamGeo, this.matTowerFrame);
    beam.position.set(0, topY - 0.2, 0);
    rackGroup.add(beam);

    parent.add(rackGroup);
  }

  // Helper: Build cylindrical pipe path with elbows
  private createPipePath(points: THREE.Vector3[], radius: number, mat: THREE.Material, parent: THREE.Group, name: string) {
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.1);
    const tubeGeo = new THREE.TubeGeometry(curve, points.length * 8, radius, 14, false);
    const pipeMesh = new THREE.Mesh(tubeGeo, mat);
    pipeMesh.name = name;
    pipeMesh.castShadow = true;
    parent.add(pipeMesh);
  }

  // Helper: Directional flow chevron arrow
  private addDirectionalArrow(parent: THREE.Group, pos: THREE.Vector3, dir: THREE.Vector3, color: number) {
    const arrowGroup = new THREE.Group();
    arrowGroup.position.copy(pos);

    const arrowMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.2,
      metalness: 0.8,
      emissive: color,
      emissiveIntensity: 0.4
    });

    const coneGeo = new THREE.ConeGeometry(0.65, 1.3, 14);
    const cone = new THREE.Mesh(coneGeo, arrowMat);

    // Orient cone along direction
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
    cone.quaternion.copy(quat);

    arrowGroup.add(cone);
    parent.add(arrowGroup);
  }

  // 7. Water Flow Animated Particle Systems (4 Realistic Industrial Streams)
  private buildWaterFlowParticles() {
    // Stream 1: CW Cold Water from Basin through P711A & P711B diving Underground to E711
    const stream1Points = [
      new THREE.Vector3(-45 + 1.35, 1.2, 3.0),    // from tower basin sump
      new THREE.Vector3(-45 + 1.35, 1.85, 13.15), // through suction valve into pump P711A
      new THREE.Vector3(-45 + 1.35, 3.9, 14.0),   // through check & isolation valves
      new THREE.Vector3(-45 + 1.35, 4.4, 15.4),   // loops downward
      new THREE.Vector3(-45 + 1.35, -0.8, 15.4),  // underground level
      new THREE.Vector3(-57.4, -0.8, 15.4),       // running underground to E711
      new THREE.Vector3(-57.4, -0.8, 18.0),
      new THREE.Vector3(-57.4, 3.8, 18.0)         // rises out of ground into E711 inlet nozzle
    ];
    this.createParticleFlow(stream1Points, 50, 0x38bdf8, 0.45);

    // Stream 2: CW Cold Water from Basin through Pumps P-C..J diving Underground into Main Header
    const stream2Points = [
      new THREE.Vector3(5.0 + 1.15, 1.2, 3.0),    // from tower basin sump
      new THREE.Vector3(5.0 + 1.15, 1.65, 13.15), // through suction valve into pump P-F
      new THREE.Vector3(5.0 + 1.15, 3.6, 14.0),   // through check & discharge valves
      new THREE.Vector3(5.0 + 1.15, 4.2, 15.4),   // loops downward
      new THREE.Vector3(5.0 + 1.15, -0.8, 15.4),  // dives underground
      new THREE.Vector3(52.0, -0.8, 15.4),       // along underground CW Supply header
      new THREE.Vector3(52.0, -0.8, 40.0)        // underground route to ammonia plant units
    ];
    this.createParticleFlow(stream2Points, 60, 0x0284c7, 0.42);

    // Stream 3: CW Warm Water Recycle / Return from Plant into Tower & Top Distribution
    const stream3Points = [
      new THREE.Vector3(55.0, 5.6, 40.0),        // returning from ammonia synthesis & reforming
      new THREE.Vector3(55.0, 5.6, 0.0),         // along heavy pipe rack
      new THREE.Vector3(54.0, 5.6, -10.0),       // to tower right wall
      new THREE.Vector3(54.0, 20.0, -10.0),      // climbing giant vertical riser pipe
      new THREE.Vector3(54.0, 20.0, -4.0),       // onto top roof distribution header
      new THREE.Vector3(0.0, 20.0, -4.0),        // across top of all 9 cells
      new THREE.Vector3(-48.0, 20.0, -4.0)       // to end of header
    ];
    this.createParticleFlow(stream3Points, 75, 0x00e5aa, 0.38);

    // Stream 4: CW Return from Condenser E711 to top distribution header
    const stream4Points = [
      new THREE.Vector3(-57.4, 6.8, 18.0),       // from E711 warm outlet
      new THREE.Vector3(-57.4, 20.0, 18.0),      // rising up
      new THREE.Vector3(-57.4, 20.0, -4.0),      // turning toward roof
      new THREE.Vector3(-48.0, 20.0, -4.0),      // entering Cell 1 & 2 droppers
      new THREE.Vector3(-48.0, 16.5, -10.0)      // spraying down over fill pack
    ];
    this.createParticleFlow(stream4Points, 40, 0x00c8ef, 0.36);

    // Stream 5: Atomized Spray Nozzles Water Droplets Spraying Downwards onto PVC Fill Media
    for (let c = 0; c < 9; c += 2) {
      const cellCenterX = -108 / 2 + 12 / 2 + c * 12;
      const sprayDownPoints = [
        new THREE.Vector3(cellCenterX, 16.5, -10.0),
        new THREE.Vector3(cellCenterX, 14.8, -10.0),
        new THREE.Vector3(cellCenterX, 10.0, -10.0),
        new THREE.Vector3(cellCenterX, 2.5, -10.0) // falling down into cold water basin
      ];
      this.createParticleFlow(sprayDownPoints, 35, 0x00e5aa, 0.55);
    }

    // Stream 6A: Exhaust Steam Flow from P711A 4500 RPM Steam Turbine to Condenser E711
    const steamFlowPointsA = [
      new THREE.Vector3(-47.2, 1.05, 14.4),
      new THREE.Vector3(-47.2, 8.9, 14.4),
      new THREE.Vector3(-47.2, 8.9, 18.0),
      new THREE.Vector3(-66.0, 8.9, 18.0)
    ];
    this.createParticleFlow(steamFlowPointsA, 30, 0xf59e0b, 0.65);

    // Stream 6B: Exhaust Steam Flow from P711B 4500 RPM Steam Turbine to Condenser E711
    const steamFlowPointsB = [
      new THREE.Vector3(-37.2, 1.05, 14.4),
      new THREE.Vector3(-37.2, 8.9, 14.4),
      new THREE.Vector3(-47.2, 8.9, 14.4),
      new THREE.Vector3(-47.2, 8.9, 18.0),
      new THREE.Vector3(-66.0, 8.9, 18.0)
    ];
    this.createParticleFlow(steamFlowPointsB, 35, 0xf59e0b, 0.65);
  }

  private createParticleFlow(points: THREE.Vector3[], count: number, color: number, speed: number) {
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.15);
    const geo = new THREE.BufferGeometry();
    const posArr = new Float32Array(count * 3);
    const progress = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      progress[i] = i / count;
      const pt = curve.getPoint(progress[i]);
      posArr[i * 3] = pt.x;
      posArr[i * 3 + 1] = pt.y;
      posArr[i * 3 + 2] = pt.z;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

    const pMat = new THREE.PointsMaterial({
      color: color,
      size: 0.85,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const pointsMesh = new THREE.Points(geo, pMat);
    this.flowParticlesGroup.add(pointsMesh);

    this.flowParticleSystems.push({
      points: pointsMesh,
      curve,
      progress,
      speed
    });
  }

  // 8. Procedural 3D Tag Badge with high-contrast text canvas
  private createBadge3D(label: string, colorHex: number): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 380;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;

    // Rounded rectangle card
    ctx.fillStyle = 'rgba(7, 18, 30, 0.92)';
    ctx.strokeStyle = `#${colorHex.toString(16).padStart(6, '0')}`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(10, 10, 360, 80, 18);
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.font = 'bold 36px "IBM Plex Mono", "Cairo", monospace, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 190, 52);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    const planeGeo = new THREE.PlaneGeometry(3.6, 0.95);
    const planeMat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(planeGeo, planeMat);
    return mesh;
  }

  private tempPoint: THREE.Vector3 = new THREE.Vector3();
  private particleFrameCount: number = 0;

  // 9. Frame-by-frame Animation update
  public update(delta: number) {
    if (!this.group.visible) return;

    // 1. Fan Rotation Animation
    if (this.isFanAnimationActive && this.fanBladesMeshes.length > 0) {
      const rotDelta = delta * 3.8;
      this.fanBladesMeshes.forEach((bladeGroup) => {
        bladeGroup.rotation.y += rotDelta;
      });
    }

    // 2. Water Flow Particle Movement (optimized: only when active & visible)
    if (this.isWaterFlowActive && this.flowParticleSystems.length > 0 && this.flowParticlesGroup.visible) {
      this.particleFrameCount = (this.particleFrameCount + 1) % 60;
      if (this.particleFrameCount % 2 === 0) {
        const stepDelta = delta * 2.0;
        this.flowParticleSystems.forEach((ps) => {
          if (!ps.points.visible) return;
          const positions = ps.points.geometry.attributes.position as THREE.BufferAttribute;
          const count = ps.progress.length;

          for (let i = 0; i < count; i++) {
            ps.progress[i] = (ps.progress[i] + stepDelta * ps.speed) % 1.0;
            ps.curve.getPoint(ps.progress[i], this.tempPoint);
            positions.setXYZ(i, this.tempPoint.x, this.tempPoint.y, this.tempPoint.z);
          }
          positions.needsUpdate = true;
        });
      }
    }
  }

  // 10. Interactive Controls & Visibility Filters
  public setFanAnimation(active: boolean) {
    this.isFanAnimationActive = active;
  }

  public setWaterFlow(active: boolean) {
    this.isWaterFlowActive = active;
    this.flowParticlesGroup.visible = active;
  }

  public setLabelsVisible(visible: boolean) {
    this.badgesGroup.visible = visible;
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshBasicMaterial && obj.material.map) {
        obj.visible = visible;
      }
    });
  }

  public setGroupVisibility(groupKey: 'all' | 'fans' | 'pumps' | 'condenser' | 'piping', visible: boolean) {
    if (groupKey === 'all') {
      this.towerStructureGroup.visible = visible;
      this.fansGroup.visible = visible;
      this.pumpsGroup.visible = visible;
      this.condenserGroup.visible = visible;
      this.pipingGroup.visible = visible;
    } else if (groupKey === 'fans') {
      this.fansGroup.visible = visible;
    } else if (groupKey === 'pumps') {
      this.pumpsGroup.visible = visible;
    } else if (groupKey === 'condenser') {
      this.condenserGroup.visible = visible;
    } else if (groupKey === 'piping') {
      this.pipingGroup.visible = visible;
    }
  }

  // 11. Highlight Component
  public highlightComponent(mesh: THREE.Object3D | null) {
    if (this.selectedMesh && this.selectedOrigColor) {
      if ((this.selectedMesh as any).material && (this.selectedMesh as any).material.color) {
        (this.selectedMesh as any).material.color.copy(this.selectedOrigColor);
      }
      this.selectedMesh = null;
      this.selectedOrigColor = null;
    }

    if (mesh && (mesh as any).material && (mesh as any).material.color) {
      this.selectedMesh = mesh;
      this.selectedOrigColor = (mesh as any).material.color.clone();
      (mesh as any).material.color.setHex(0xffaa00);
    }
  }
}
