import * as THREE from 'three';
import { EquipmentInfo, MASTER_EQUIPMENT_DATA } from './PlantDiagramData';
import {
  createIndustrialCarbonSteelPipeTexture,
  createCarbonSteelBumpTexture,
  createPipeIdentificationBandTexture
} from './TextureGenerator';

/**
 * High-Precision 3D Digital Twin of the Industrial Steam Headers & PRDS Distribution Network
 * Engineered to authentic petrochemical & refinery standards:
 * - ASTM A106 Grade B / A335 Heavy-Wall Carbon Steel Piping with hot-rolled mill scale finish
 * - Raised Face Weld Neck (WNRF) Flanges with ASTM A193 B7 high-tensile stud bolts & hex nuts
 * - ASME A13.1 Service Identification Wrap Bands & Flow Direction Arrows
 * - Structural ASTM A36 Welded Pipe T-Shoes with PTFE slide pads on concrete sleepers
 * - Condensate Drip Legs & Steam Traps (Drip Pockets) underneath headers
 * - Elevated "FEED HEATER & AMMONIA" vessel with safety yellow stairs and handrails
 * - "CONDENSATE FLASH TANK" vertical vessel on steel legs with level gauges & piping
 * - Right Header End Signs: HP STEAM HEADER, MP STEAM HEADER, LP STEAM HEADER, UTILITY HEADER
 * - Left Inlet & PRDS Badges: STEAM INLET, FROM 39-12 / 3, KBDV-3912, PRDS, DESIGN 100.0%, PLANT LOAD 100.0%
 * - Manifolds with Blue Control Valves: HP USERS, MP USERS, LP USERS, INDUSTRIAL STEAM
 * - Precision Pressure Gauges with pigtail curved siphon pipes and dials
 * - Two Foreground High-Fidelity DCS Display Screens: LEGEND SCREEN and STEAM LOAD SUMMARY
 * - Industrial concrete yard with drainage trench grates
 */
export class SteamSystem3D {
  public group: THREE.Group;
  public interactiveMeshes: THREE.Object3D[] = [];
  public onSelectCallback?: (info: EquipmentInfo) => void;

  // Particle systems
  private s65Particles!: THREE.Points;
  private s39Particles!: THREE.Points;
  private s12Particles!: THREE.Points;
  private s3Particles!: THREE.Points;

  // Materials palette
  private matSteel!: THREE.MeshStandardMaterial;
  private matDarkSteel!: THREE.MeshStandardMaterial;
  private matChrome!: THREE.MeshStandardMaterial;
  private matConcrete!: THREE.MeshStandardMaterial;
  private matTrenchGrate!: THREE.MeshStandardMaterial;
  private matYellowStairs!: THREE.MeshStandardMaterial;

  // Authentic Industrial Carbon Steel materials
  private matCarbonSteelPipe!: THREE.MeshStandardMaterial;
  private matFlangeSteel!: THREE.MeshStandardMaterial;
  private matStudBolt!: THREE.MeshStandardMaterial;
  private matGasket!: THREE.MeshStandardMaterial;
  private matPipeShoe!: THREE.MeshStandardMaterial;
  private matSteamTrap!: THREE.MeshStandardMaterial;
  private matWeldBead!: THREE.MeshStandardMaterial;

  // ASME A13.1 Service Identification Band Materials
  private matBandHp!: THREE.MeshStandardMaterial;
  private matBandMp!: THREE.MeshStandardMaterial;
  private matBandLp!: THREE.MeshStandardMaterial;
  private matBandUtility!: THREE.MeshStandardMaterial;

  // Header insulation materials matching image colors
  private matHpOrange!: THREE.MeshStandardMaterial;
  private matMpYellow!: THREE.MeshStandardMaterial;
  private matLpBlue!: THREE.MeshStandardMaterial;
  private matUtilityGreen!: THREE.MeshStandardMaterial;

  // Valve & Equipment materials
  private matValveBodyBlue!: THREE.MeshStandardMaterial;
  private matActuatorBlue!: THREE.MeshStandardMaterial;
  private matHandwheelBlue!: THREE.MeshStandardMaterial;
  private matVesselSilver!: THREE.MeshStandardMaterial;
  private matGaugeBrass!: THREE.MeshStandardMaterial;

  // Texture caches to avoid recreating
  private textureCache: Map<string, THREE.CanvasTexture> = new Map();


  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'SteamSystem3D_ExactTwin';

    this.initMaterials();
    this.buildYardFoundationWithTrenches();
    this.buildElevatedFeedHeaterVessel();
    this.buildCondensateFlashTank();
    this.buildFourParallelGroundHeaders();
    this.buildUserManifoldsAndControlValves();
    this.buildHeaderEndSigns();
    this.buildInletAndPrdsBadges();
    this.buildPressureGauges();
    this.buildForegroundDcsScreens();
    this.buildSteamFlowParticles();
  }

  private initMaterials() {
    this.matSteel = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.4,
      metalness: 0.7,
      name: 'steam_steel'
    });

    this.matDarkSteel = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.8,
      name: 'steam_dark_steel'
    });

    this.matChrome = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.95,
      name: 'steam_chrome'
    });

    this.matConcrete = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.85,
      metalness: 0.1,
      name: 'steam_concrete'
    });

    this.matTrenchGrate = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      metalness: 0.9,
      name: 'steam_trench_grate'
    });

    this.matYellowStairs = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.35,
      metalness: 0.5,
      name: 'steam_yellow_stairs'
    });

    // Authentic ASTM A106 Grade B Heavy-Wall Carbon Steel Pipe Material
    const carbonSteelTex = createIndustrialCarbonSteelPipeTexture();
    const carbonSteelBump = createCarbonSteelBumpTexture();
    this.matCarbonSteelPipe = new THREE.MeshStandardMaterial({
      map: carbonSteelTex,
      bumpMap: carbonSteelBump,
      bumpScale: 0.04,
      roughness: 0.38,
      metalness: 0.88,
      color: 0xffffff,
      name: 'carbon_steel_pipe'
    });

    // ASTM A105 Forged Carbon Steel Raised-Face Flanges
    this.matFlangeSteel = new THREE.MeshStandardMaterial({
      color: 0x333b45,
      roughness: 0.42,
      metalness: 0.86,
      name: 'flange_carbon_steel'
    });

    // ASTM A193 B7 Alloy High-Tensile Stud Bolts & A194 2H Hex Nuts
    this.matStudBolt = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.28,
      metalness: 0.95,
      name: 'stud_bolt_steel'
    });

    // Spiral-Wound 316L / Flexible Graphite High-Temp Gasket
    this.matGasket = new THREE.MeshStandardMaterial({
      color: 0x181e24,
      roughness: 0.7,
      metalness: 0.4,
      name: 'spiral_wound_gasket'
    });

    // ASTM A36 Structural Carbon Steel Welded Pipe Shoe & Saddle Support
    this.matPipeShoe = new THREE.MeshStandardMaterial({
      color: 0x272d36,
      roughness: 0.5,
      metalness: 0.8,
      name: 'carbon_steel_pipe_shoe'
    });

    // Circumferential Butt-Weld Seam with Heat-Affected Zone (HAZ)
    this.matWeldBead = new THREE.MeshStandardMaterial({
      color: 0x47505a,
      roughness: 0.55,
      metalness: 0.82,
      name: 'butt_weld_seam'
    });

    // Inverted Bucket / Thermodynamic Cast Steel Steam Trap Body
    this.matSteamTrap = new THREE.MeshStandardMaterial({
      color: 0x21262d,
      roughness: 0.38,
      metalness: 0.85,
      name: 'steam_trap_cast_steel'
    });

    // ASME A13.1 Identification Bands with Safety Color, Stenciled Text & Flow Arrows
    this.matBandHp = new THREE.MeshStandardMaterial({
      map: createPipeIdentificationBandTexture('HIGH PRESSURE STEAM', 'S-65', '#f97316', '65.0 kg/cm²G • 435°C', '#ffffff'),
      roughness: 0.35,
      metalness: 0.45,
      name: 'asme_band_hp'
    });

    this.matBandMp = new THREE.MeshStandardMaterial({
      map: createPipeIdentificationBandTexture('MEDIUM PRESSURE STEAM', 'S-39', '#eab308', '39.0 kg/cm²G • 380°C', '#000000'),
      roughness: 0.35,
      metalness: 0.45,
      name: 'asme_band_mp'
    });

    this.matBandLp = new THREE.MeshStandardMaterial({
      map: createPipeIdentificationBandTexture('LOW PRESSURE STEAM', 'S-12', '#0284c7', '12.0 kg/cm²G • 190°C', '#ffffff'),
      roughness: 0.35,
      metalness: 0.45,
      name: 'asme_band_lp'
    });

    this.matBandUtility = new THREE.MeshStandardMaterial({
      map: createPipeIdentificationBandTexture('UTILITY STEAM', 'S-3', '#16a34a', '3.0 kg/cm²G • 245°C', '#ffffff'),
      roughness: 0.35,
      metalness: 0.45,
      name: 'asme_band_utility'
    });

    // 1. HP STEAM: Vibrant Industrial Orange (#ea580c / #f97316)
    this.matHpOrange = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.25,
      metalness: 0.65,
      name: 'steam_hp_orange'
    });

    // 2. MP STEAM: Vibrant Golden Yellow (#eab308 / #facc15)
    this.matMpYellow = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.25,
      metalness: 0.65,
      name: 'steam_mp_yellow'
    });

    // 3. LP STEAM: Royal Industrial Blue (#0284c7 / #0ea5e9)
    this.matLpBlue = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.25,
      metalness: 0.65,
      name: 'steam_lp_blue'
    });

    // 4. UTILITY: Fresh Industrial Green (#16a34a / #22c55e)
    this.matUtilityGreen = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.25,
      metalness: 0.65,
      name: 'steam_utility_green'
    });

    // Valves in image: Distinctive Industrial Cobalt Blue bodies, actuators & handwheels
    this.matValveBodyBlue = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.35,
      metalness: 0.7,
      name: 'valve_body_blue'
    });

    this.matActuatorBlue = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.3,
      metalness: 0.5,
      name: 'actuator_blue'
    });

    this.matHandwheelBlue = new THREE.MeshStandardMaterial({
      color: 0x1e40af,
      roughness: 0.3,
      metalness: 0.8,
      name: 'handwheel_blue'
    });

    this.matVesselSilver = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      roughness: 0.3,
      metalness: 0.85,
      name: 'vessel_silver'
    });

    this.matGaugeBrass = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.8,
      name: 'gauge_brass'
    });
  }

  // Helper: Create crisp CanvasTexture with High-DPI
  private createBoardCanvas(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
    const scale = 2; // 2x resolution for sharp text
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);
    draw(ctx);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  }

  // Register interactive mesh helper
  private registerEquipment(mesh: THREE.Object3D, eqId: string, name: string, fallbackInfo?: Partial<EquipmentInfo>) {
    let eqData = MASTER_EQUIPMENT_DATA.find((e) => e.id === eqId);
    if (!eqData && fallbackInfo) {
      eqData = {
        id: eqId,
        tag: fallbackInfo.tag || eqId.toUpperCase(),
        name: name,
        type: fallbackInfo.type || 'vessel',
        section: 'Steam Network & PRDS Utilities',
        sectionNumber: 11,
        rowNumber: 11,
        position: new THREE.Vector3(0, 0, 0),
        inletStream: fallbackInfo.inletStream || '',
        outletStream: fallbackInfo.outletStream || '',
        operatingTemp: fallbackInfo.operatingTemp || '',
        operatingPress: fallbackInfo.operatingPress || '',
        catalystOrInternals: fallbackInfo.catalystOrInternals || 'Steam distribution & control internals',
        controllers: fallbackInfo.controllers || [],
        description: fallbackInfo.description || name,
      };
    }

    mesh.userData = {
      isInteractive: true,
      equipmentId: eqId,
      name: name,
      data: eqData
    };
    this.interactiveMeshes.push(mesh);
  }

  // 1. Yard Foundation with Floor Drainage Channels
  private buildYardFoundationWithTrenches() {
    const yardGroup = new THREE.Group();

    // Main heavy asphalt / smooth concrete floor slab
    const floorGeo = new THREE.BoxGeometry(82, 0.6, 64);
    const floor = new THREE.Mesh(floorGeo, this.matConcrete);
    floor.position.set(0, -0.3, 2);
    floor.receiveShadow = true;
    yardGroup.add(floor);

    // Perimeter curb wall
    const curbMat = this.matDarkSteel;
    const curbW = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 64), curbMat);
    curbW.position.set(-41, 0.2, 2);
    yardGroup.add(curbW);

    const curbE = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 64), curbMat);
    curbE.position.set(41, 0.2, 2);
    yardGroup.add(curbE);

    // Dark drainage trenches with metallic slot grates as seen in the photo
    // 1. Diagonal drainage channel across left-to-foreground
    const trenchDiagGeo = new THREE.BoxGeometry(0.9, 0.08, 48);
    const trenchDiag = new THREE.Mesh(trenchDiagGeo, this.matTrenchGrate);
    trenchDiag.position.set(-28, 0.04, 8);
    trenchDiag.rotation.y = Math.PI / 6; // 30 degrees angle like in photo
    yardGroup.add(trenchDiag);

    // 2. Foreground transverse drainage trench along Z = +26
    const trenchForeGeo = new THREE.BoxGeometry(78, 0.08, 1.2);
    const trenchFore = new THREE.Mesh(trenchForeGeo, this.matTrenchGrate);
    trenchFore.position.set(0, 0.04, 26);
    yardGroup.add(trenchFore);

    // 3. Far right drainage trench along X = +36
    const trenchRightGeo = new THREE.BoxGeometry(1.2, 0.08, 54);
    const trenchRight = new THREE.Mesh(trenchRightGeo, this.matTrenchGrate);
    trenchRight.position.set(36, 0.04, 2);
    yardGroup.add(trenchRight);

    // Concrete plinth foundation strips holding the headers
    const sleeperX = [-26, -14, -2, 10, 22, 32];
    sleeperX.forEach((sx) => {
      // Pedestal strip along Z
      const stripGeo = new THREE.BoxGeometry(1.2, 0.45, 34);
      const strip = new THREE.Mesh(stripGeo, this.matDarkSteel);
      strip.position.set(sx, 0.22, 1);
      strip.castShadow = true;
      strip.receiveShadow = true;
      yardGroup.add(strip);
    });

    // Background structural rack / fence in far background
    const bgFenceGroup = new THREE.Group();
    const fenceLength = 76;
    for (let fx = -36; fx <= 36; fx += 8) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.8, 8), this.matSteel);
      post.position.set(fx, 1.9, -22);
      bgFenceGroup.add(post);
    }
    const railTop = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, fenceLength, 8), this.matSteel);
    railTop.rotation.z = Math.PI / 2;
    railTop.position.set(0, 3.6, -22);
    bgFenceGroup.add(railTop);

    const railMid = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, fenceLength, 8), this.matSteel);
    railMid.rotation.z = Math.PI / 2;
    railMid.position.set(0, 1.8, -22);
    bgFenceGroup.add(railMid);
    yardGroup.add(bgFenceGroup);

    this.group.add(yardGroup);
  }

  // 2. Elevated "FEED HEATER & AMMONIA" Vessel (Background Left)
  private buildElevatedFeedHeaterVessel() {
    const heaterGroup = new THREE.Group();
    heaterGroup.position.set(-24, 0, -15);

    // Elevated structural steel skid frame
    const skidW = 10.0;
    const skidD = 6.0;
    const skidH = 3.2;

    // Platform deck grating
    const deckGeo = new THREE.BoxGeometry(skidW, 0.2, skidD);
    const deck = new THREE.Mesh(deckGeo, this.matDarkSteel);
    deck.position.set(0, skidH, 0);
    heaterGroup.add(deck);

    // 6 Structural Steel Columns
    const colX = [-skidW / 2 + 0.4, 0, skidW / 2 - 0.4];
    const colZ = [-skidD / 2 + 0.4, skidD / 2 - 0.4];
    colX.forEach((cx) => {
      colZ.forEach((cz) => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.3, skidH, 0.3), this.matSteel);
        col.position.set(cx, skidH / 2, cz);
        heaterGroup.add(col);
      });
    });

    // Yellow Safety Staircase on Left
    const stairSteps = 10;
    const stepH = skidH / stairSteps;
    const stepL = 0.5;
    for (let i = 0; i < stairSteps; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, stepL), this.matYellowStairs);
      step.position.set(-skidW / 2 - 0.8, (i + 0.5) * stepH, skidD / 2 - (i + 0.5) * (skidD / stairSteps));
      heaterGroup.add(step);
    }
    // Yellow handrail along stairs
    const stairRail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 5.2, 8), this.matYellowStairs);
    stairRail.position.set(-skidW / 2 - 1.6, skidH / 2 + 0.9, 0);
    stairRail.rotation.x = Math.atan2(skidH, skidD);
    heaterGroup.add(stairRail);

    // Yellow Safety Handrails on Platform
    const perimeterRails = [
      { x: 0, z: -skidD / 2, rot: Math.PI / 2, len: skidW },
      { x: skidW / 2, z: 0, rot: 0, len: skidD },
      { x: 0, z: skidD / 2, rot: Math.PI / 2, len: skidW - 2.0 }
    ];
    perimeterRails.forEach((pr) => {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, pr.len, 8), this.matYellowStairs);
      rail.position.set(pr.x, skidH + 1.1, pr.z);
      rail.rotation.y = pr.rot;
      rail.rotation.z = Math.PI / 2;
      heaterGroup.add(rail);

      // Mid rail
      const mid = rail.clone();
      mid.position.y = skidH + 0.55;
      heaterGroup.add(mid);
    });

    // Horizontal Cylindrical Vessel (Shell & Tube Heat Exchanger / Steam Superheater)
    const vesselRadius = 1.35;
    const vesselLength = 7.5;
    const vesselBodyGeo = new THREE.CylinderGeometry(vesselRadius, vesselRadius, vesselLength, 24);
    const vesselBody = new THREE.Mesh(vesselBodyGeo, this.matVesselSilver);
    vesselBody.rotation.z = Math.PI / 2;
    vesselBody.position.set(0, skidH + vesselRadius + 0.4, 0);
    vesselBody.castShadow = true;
    heaterGroup.add(vesselBody);

    // Dish Heads on Ends
    for (let side of [-1, 1]) {
      const headGeo = new THREE.SphereGeometry(vesselRadius, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const head = new THREE.Mesh(headGeo, this.matVesselSilver);
      head.rotation.z = side * Math.PI / 2;
      head.position.set(side * vesselLength / 2, skidH + vesselRadius + 0.4, 0);
      heaterGroup.add(head);
    }

    // Saddles holding vessel
    for (let sx of [-2.0, 2.0]) {
      const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 3.2), this.matDarkSteel);
      saddle.position.set(sx, skidH + 0.25, 0);
      heaterGroup.add(saddle);
    }

    // Vessel Blue Label Sign: "FEED HEATER & AMMONIA"
    const signBoard = this.createSignboardMesh(
      'FEED HEATER\n& AMMONIA',
      '#1d4ed8',
      '#ffffff',
      3.2,
      1.6,
      'v-102_steam',
      'V-102 Steam Drum & Superheater E-103',
      {
        tag: 'V-102 / E-103',
        catalystOrInternals: '198.5 t/h Steam Generation & Superheating',
        operatingTemp: '280.0°C -> 435.0°C',
        operatingPress: '65.0 kg/cm²G',
        description: 'V-102 Steam Drum receives steam from waste heat boiler E-104 and delivers saturated steam to superheaters E-103B and E-103A.'
      }
    );
    signBoard.position.set(0, skidH + 2.0, skidD / 2 + 0.2);
    heaterGroup.add(signBoard);

    // Connecting carbon steel pipes from vessel down to HP header with weld neck flanges
    const feedPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.5, 16), this.matCarbonSteelPipe);
    feedPipe.position.set(skidW / 2 + 0.5, skidH + 0.8, 1.5);
    feedPipe.rotation.x = Math.PI / 2;
    heaterGroup.add(feedPipe);

    // ASME Identification band on feed pipe
    const feedBand = new THREE.Mesh(new THREE.CylinderGeometry(0.208, 0.208, 0.8, 16), this.matBandHp);
    feedBand.position.set(skidW / 2 + 0.5, skidH + 0.8, 1.5);
    feedBand.rotation.x = Math.PI / 2;
    heaterGroup.add(feedBand);

    // Weld neck flange at vessel nozzle
    const feedFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 16), this.matFlangeSteel);
    feedFlange.position.set(skidW / 2 + 0.5, skidH + 0.8, 3.2);
    feedFlange.rotation.x = Math.PI / 2;
    heaterGroup.add(feedFlange);

    this.registerEquipment(vesselBody, 'v-102_steam', 'V-102 Steam Drum & E-103 Superheaters', {
      tag: 'V-102 / E-103',
      catalystOrInternals: '198.5 t/h Steam Generation',
      operatingTemp: '280.0°C -> 435.0°C',
      operatingPress: '65.0 kg/cm²G'
    });

    this.group.add(heaterGroup);
  }

  // 3. "CONDENSATE FLASH TANK" (Vertical Vessel on Far Left of Green Line)
  private buildCondensateFlashTank() {
    const flashGroup = new THREE.Group();
    flashGroup.position.set(-27, 0, 14);

    const tankRadius = 1.35;
    const tankHeight = 3.6;

    // 4 Steel Support Legs with baseplates
    for (let angle of [Math.PI / 4, 3 * Math.PI / 4, 5 * Math.PI / 4, 7 * Math.PI / 4]) {
      const lx = Math.cos(angle) * (tankRadius + 0.15);
      const lz = Math.sin(angle) * (tankRadius + 0.15);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.0, 12), this.matSteel);
      leg.position.set(lx, 1.0, lz);
      flashGroup.add(leg);

      const base = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.1, 0.35), this.matDarkSteel);
      base.position.set(lx, 0.05, lz);
      flashGroup.add(base);
    }

    // Vertical Vessel Cylinder
    const cylGeo = new THREE.CylinderGeometry(tankRadius, tankRadius, tankHeight, 24);
    const cylMesh = new THREE.Mesh(cylGeo, this.matVesselSilver);
    cylMesh.position.set(0, 2.0 + tankHeight / 2, 0);
    cylMesh.castShadow = true;
    flashGroup.add(cylMesh);

    // Top & Bottom Torispherical / Ellipsoidal Dish Heads
    const headTopGeo = new THREE.SphereGeometry(tankRadius, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const headTop = new THREE.Mesh(headTopGeo, this.matVesselSilver);
    headTop.position.set(0, 2.0 + tankHeight, 0);
    flashGroup.add(headTop);

    const headBottomGeo = new THREE.SphereGeometry(tankRadius, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const headBottom = new THREE.Mesh(headBottomGeo, this.matVesselSilver);
    headBottom.position.set(0, 2.0, 0);
    flashGroup.add(headBottom);

    // Level sight glass and side nozzles
    const sightGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8);
    const sightMesh = new THREE.Mesh(sightGeo, this.matChrome);
    sightMesh.position.set(tankRadius + 0.25, 3.8, 0.4);
    flashGroup.add(sightMesh);

    // Manhole flange on top
    const manhole = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.4, 16), this.matDarkSteel);
    manhole.position.set(0, 2.0 + tankHeight + tankRadius + 0.2, 0);
    flashGroup.add(manhole);

    // Connecting Carbon Steel Vapor Outlet Pipe directly into the Utility Header
    const connPipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.8, 16), this.matCarbonSteelPipe);
    connPipe1.position.set(tankRadius + 1.4, 2.6, 0);
    connPipe1.rotation.z = Math.PI / 2;
    flashGroup.add(connPipe1);

    // ASME Utility identification band
    const connBand = new THREE.Mesh(new THREE.CylinderGeometry(0.188, 0.188, 0.8, 16), this.matBandUtility);
    connBand.position.set(tankRadius + 1.0, 2.6, 0);
    connBand.rotation.z = Math.PI / 2;
    flashGroup.add(connBand);

    // Flanged weld neck connection
    const connFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.08, 16), this.matFlangeSteel);
    connFlange.position.set(tankRadius + 0.3, 2.6, 0);
    connFlange.rotation.z = Math.PI / 2;
    flashGroup.add(connFlange);

    // Flanged blue control valve with handwheel on inlet
    const vValve = this.createControlValveMesh(1.0);
    vValve.position.set(tankRadius + 2.4, 2.6, 0);
    flashGroup.add(vValve);

    // Blue Signboard: "CONDENSATE FLASH TANK"
    const signBoard = this.createSignboardMesh(
      'CONDENSATE\nFLASH TANK',
      '#1d4ed8',
      '#ffffff',
      2.8,
      1.5,
      'v-109',
      'V-109 Blowdown & Condensate Flash Tank',
      {
        tag: 'V-109',
        catalystOrInternals: '6.5 t/h Flash Steam Recovery @ 12 kg/cm²G',
        operatingTemp: '190.0°C',
        operatingPress: '12.0 kg/cm²G / 3.0 kg/cm²G',
        description: 'V-109 receives continuous blowdown and boiler drains, flashing vapor to supply LP and Utility headers safely with PIC-166.'
      }
    );
    signBoard.position.set(0, 0.9, tankRadius + 0.6);
    flashGroup.add(signBoard);

    this.registerEquipment(cylMesh, 'v-109', 'V-109 Condensate Flash Tank', {
      tag: 'V-109',
      catalystOrInternals: '6.5 t/h Flash Steam Recovery',
      operatingTemp: '190.0°C',
      operatingPress: '12.0 kg/cm²G'
    });

    this.group.add(flashGroup);
  }

  // Helper: Raised Face Weld Neck (WNRF) Flanged Spool Joint (ASME B16.5)
  private createFlangedSpoolJoint(radius: number, x: number, y: number, z: number): THREE.Group {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const flangeR = radius * 1.52;
    const flangeThick = 0.065;
    const gap = 0.02;
    const boltCircleR = radius * 1.26;
    const numBolts = radius >= 0.3 ? 16 : 12;

    // Flange A (West)
    const flangeGeo = new THREE.CylinderGeometry(flangeR, flangeR, flangeThick, 24);
    const flangeA = new THREE.Mesh(flangeGeo, this.matFlangeSteel);
    flangeA.rotation.z = Math.PI / 2;
    flangeA.position.set(-flangeThick / 2 - gap / 2, 0, 0);
    group.add(flangeA);

    // Flange B (East)
    const flangeB = new THREE.Mesh(flangeGeo, this.matFlangeSteel);
    flangeB.rotation.z = Math.PI / 2;
    flangeB.position.set(flangeThick / 2 + gap / 2, 0, 0);
    group.add(flangeB);

    // Spiral-Wound 316L / Graphite Gasket ring in between
    const gasketGeo = new THREE.CylinderGeometry(radius * 1.25, radius * 1.25, gap, 24);
    const gasket = new THREE.Mesh(gasketGeo, this.matGasket);
    gasket.rotation.z = Math.PI / 2;
    group.add(gasket);

    // ASTM A193 B7 Stud Bolt Circle with ASTM A194 2H Hex Nuts
    const boltGeo = new THREE.CylinderGeometry(0.016, 0.016, flangeThick * 2 + gap + 0.04, 6);
    for (let i = 0; i < numBolts; i++) {
      const angle = (i / numBolts) * Math.PI * 2;
      const by = Math.sin(angle) * boltCircleR;
      const bz = Math.cos(angle) * boltCircleR;

      const bolt = new THREE.Mesh(boltGeo, this.matStudBolt);
      bolt.rotation.z = Math.PI / 2;
      bolt.position.set(0, by, bz);
      group.add(bolt);
    }

    return group;
  }

  // Helper: ASME A13.1 Service Identification Wrap Band with Safety Color & Flow Arrows
  private createASMEIdentificationBand(radius: number, bandMat: THREE.Material, x: number, y: number, z: number): THREE.Group {
    const bandGroup = new THREE.Group();
    bandGroup.position.set(x, y, z);

    // Identification wrap collar
    const bandGeo = new THREE.CylinderGeometry(radius + 0.008, radius + 0.008, 1.8, 32);
    const bandMesh = new THREE.Mesh(bandGeo, bandMat);
    bandMesh.rotation.z = Math.PI / 2;
    bandGroup.add(bandMesh);

    // Dual stainless steel / chrome clamping bands on edges
    for (let offset of [-0.88, 0.88]) {
      const clampGeo = new THREE.TorusGeometry(radius + 0.012, 0.007, 8, 24);
      const clamp = new THREE.Mesh(clampGeo, this.matChrome);
      clamp.rotation.y = Math.PI / 2;
      clamp.position.set(offset, 0, 0);
      bandGroup.add(clamp);
    }

    return bandGroup;
  }

  // Helper: ASTM A36 Structural Carbon Steel Welded T-Shoe on Concrete Sleeper
  private createWeldedPipeShoe(radius: number, x: number, y: number, z: number): THREE.Group {
    const shoeGroup = new THREE.Group();
    shoeGroup.position.set(x, y, z);

    // 1. Reinforced concrete sleeper pedestal underneath
    const sleeperW = 0.55;
    const sleeperL = radius * 2 + 0.7;
    const sleeperH = y - radius - 0.14; // from ground y=0 up to shoe slide sheet
    if (sleeperH > 0.15) {
      const concretePedestal = new THREE.Mesh(
        new THREE.BoxGeometry(sleeperW, sleeperH, sleeperL),
        this.matConcrete
      );
      concretePedestal.position.set(0, -y + sleeperH / 2 + 0.05, 0);
      shoeGroup.add(concretePedestal);
    }

    // 2. PTFE / Graphite low-friction slide plate
    const slidePlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.02, radius * 2 + 0.3),
      this.matSteel
    );
    slidePlate.position.set(0, -radius - 0.13, 0);
    shoeGroup.add(slidePlate);

    // 3. ASTM A36 Structural Carbon Steel T-Shoe:
    // Base plate
    const basePlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.025, radius * 2 + 0.22),
      this.matPipeShoe
    );
    basePlate.position.set(0, -radius - 0.11, 0);
    shoeGroup.add(basePlate);

    // Vertical web plate (T-stem)
    const stemH = 0.1;
    const stem = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, stemH, 0.035),
      this.matPipeShoe
    );
    stem.position.set(0, -radius - stemH / 2, 0);
    shoeGroup.add(stem);

    // Curved saddle cradle welded to pipe
    const saddleGeo = new THREE.CylinderGeometry(radius + 0.015, radius + 0.015, 0.35, 16, 1, true, Math.PI * 0.65, Math.PI * 0.7);
    const saddle = new THREE.Mesh(saddleGeo, this.matPipeShoe);
    saddle.rotation.z = Math.PI / 2;
    saddle.rotation.x = Math.PI / 2;
    shoeGroup.add(saddle);

    // Lateral guide clips / lugs bolted to concrete to prevent lateral derailing
    for (let side of [-1, 1]) {
      const guideClip = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.14, 0.03),
        this.matDarkSteel
      );
      guideClip.position.set(0, -radius - 0.07, side * (radius + 0.15));
      shoeGroup.add(guideClip);
    }

    return shoeGroup;
  }

  // Helper: Condensate Drip Leg & Steam Trap Station (Drip Pocket)
  private createCondensateDripPocket(radius: number, x: number, y: number, z: number): THREE.Group {
    const dripGroup = new THREE.Group();
    dripGroup.position.set(x, y - radius, z);

    // Vertical drip leg / pocket pipe (ASTM A106 carbon steel DN80/DN100)
    const legH = 0.65;
    const legR = 0.07;
    const legPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(legR, legR, legH, 16),
      this.matCarbonSteelPipe
    );
    legPipe.position.set(0, -legH / 2, 0);
    dripGroup.add(legPipe);

    // Bottom blind flange & blowdown drain valve
    const blindFlange = new THREE.Mesh(
      new THREE.CylinderGeometry(legR * 1.5, legR * 1.5, 0.05, 16),
      this.matFlangeSteel
    );
    blindFlange.position.set(0, -legH - 0.025, 0);
    dripGroup.add(blindFlange);

    // Drain gate valve with blue handwheel
    const drainValve = this.createControlValveMesh(0.42);
    drainValve.position.set(0, -legH - 0.2, 0);
    dripGroup.add(drainValve);

    // Side take-off impulse tubing leading to steam trap
    const trapBranch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.35, 8),
      this.matCarbonSteelPipe
    );
    trapBranch.rotation.z = Math.PI / 2;
    trapBranch.position.set(0.18, -legH * 0.5, 0);
    dripGroup.add(trapBranch);

    // Cast Steel Steam Trap Body (Thermodynamic Disc / Inverted Bucket Trap)
    const trapBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.09, 0.22, 12),
      this.matSteamTrap
    );
    trapBody.position.set(0.38, -legH * 0.5, 0);
    dripGroup.add(trapBody);

    // Trap cap
    const trapCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.08, 0.06, 6),
      this.matFlangeSteel
    );
    trapCap.position.set(0.38, -legH * 0.5 + 0.13, 0);
    dripGroup.add(trapCap);

    // Discharge line to drainage trench
    const discharge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8),
      this.matCarbonSteelPipe
    );
    discharge.position.set(0.48, -legH * 0.5 - 0.18, 0);
    dripGroup.add(discharge);

    return dripGroup;
  }

  // 4. The 4 Parallel Ground Headers Running Horizontally Across the Yard
  private buildFourParallelGroundHeaders() {
    const headersGroup = new THREE.Group();
    const length = 62; // from X = -28 to X = +34

    // Header Specifications exactly as in P&ID and refinery standards
    const headerConfigs = [
      {
        id: 's-65',
        name: 'HP STEAM HEADER (S-65)',
        tag: 'S-65',
        z: -10,
        radius: 0.38,
        bandMat: this.matBandHp,
        colorHex: '#ea580c',
        y: 2.6,
        data: {
          operatingPress: '65.0 kg/cm²G',
          operatingTemp: '435.0 °C',
          catalystOrInternals: '210.0 t/h Superheated HP Steam (FRQA-154)',
          inletStream: 'From Steam Superheaters E-103A / V-102',
          outletStream: 'To K-302, K-501, K-301 Turbines and PRDS Letdown Stations'
        }
      },
      {
        id: 's-39',
        name: 'MP STEAM HEADER (S-39)',
        tag: 'S-39',
        z: -2,
        radius: 0.32,
        bandMat: this.matBandMp,
        colorHex: '#eab308',
        y: 2.4,
        data: {
          operatingPress: '39.0 kg/cm²G',
          operatingTemp: '380.0 °C',
          catalystOrInternals: '144.0 t/h Medium Pressure Steam (PIC-139)',
          inletStream: 'From K-301 Extraction & PRDS Stations (PRCA-341/342)',
          outletStream: 'To Primary Reformer H-101 (52 t/h), P-101 A/B, K-303, K-401'
        }
      },
      {
        id: 's-12',
        name: 'LP STEAM HEADER (S-12)',
        tag: 'S-12',
        z: 6,
        radius: 0.28,
        bandMat: this.matBandLp,
        colorHex: '#0284c7',
        y: 2.2,
        data: {
          operatingPress: '12.0 kg/cm²G',
          operatingTemp: '190.0 °C',
          catalystOrInternals: '31.5 t/h Low Pressure Steam (PIC-112)',
          inletStream: 'From PRDS Letdown (PICA-164 1V) & Flash Drum V-109',
          outletStream: 'To E-112, E-711, Condensate Reboilers, PRDS to S-3'
        }
      },
      {
        id: 's-3',
        name: 'UTILITY HEADER (S-3)',
        tag: 'S-3',
        z: 14,
        radius: 0.24,
        bandMat: this.matBandUtility,
        colorHex: '#16a34a',
        y: 2.0,
        data: {
          operatingPress: '3.0 kg/cm²G',
          operatingTemp: '245.0 °C',
          catalystOrInternals: '42.5 t/h Stripping & Utility Steam (PIC-103)',
          inletStream: 'From PRDS Letdown (PICA-164 2V) & K-101A Fan Turbine Exhaust',
          outletStream: 'To Deaerator V-103 (20 t/h), Benfield Reboiler E-202 (14 t/h), Tracing'
        }
      }
    ];

    headerConfigs.forEach((cfg) => {
      // 1. Heavy-Wall ASTM A106 Carbon Steel Main Continuous Pipe Body
      const pipeGeo = new THREE.CylinderGeometry(cfg.radius, cfg.radius, length, 32);
      const pipeMesh = new THREE.Mesh(pipeGeo, this.matCarbonSteelPipe);
      pipeMesh.rotation.z = Math.PI / 2;
      pipeMesh.position.set(3.0, cfg.y, cfg.z);
      pipeMesh.castShadow = true;
      pipeMesh.receiveShadow = true;
      headersGroup.add(pipeMesh);

      this.registerEquipment(pipeMesh, cfg.id, cfg.name, cfg.data);

      // 2. ASME B16.5 Raised Face Weld Neck (WNRF) Flanged Spool Joints
      const spoolPositions = [-18, -6, 6, 18, 28];
      spoolPositions.forEach((sx) => {
        const flangedJoint = this.createFlangedSpoolJoint(cfg.radius, sx, cfg.y, cfg.z);
        headersGroup.add(flangedJoint);
      });

      // 3. Circumferential Butt Welds (Weld Beads with HAZ rings)
      const weldPositions = [-24, -12, 0, 12, 24];
      weldPositions.forEach((wx) => {
        const weldRingGeo = new THREE.TorusGeometry(cfg.radius + 0.006, 0.008, 8, 24);
        const weldRing = new THREE.Mesh(weldRingGeo, this.matWeldBead);
        weldRing.rotation.y = Math.PI / 2;
        weldRing.position.set(wx, cfg.y, cfg.z);
        headersGroup.add(weldRing);
      });

      // 4. ASME A13.1 Service Identification Collars with Flow Arrows
      const bandPositions = [-22, -4, 10, 22];
      bandPositions.forEach((bx) => {
        const idBand = this.createASMEIdentificationBand(cfg.radius, cfg.bandMat, bx, cfg.y, cfg.z);
        headersGroup.add(idBand);
      });

      // 5. ASTM A36 Structural Welded Pipe T-Shoes on Concrete Sleepers
      const shoePositions = [-24, -16, -8, 0, 8, 16, 24, 32];
      shoePositions.forEach((sx) => {
        const pipeShoe = this.createWeldedPipeShoe(cfg.radius, sx, cfg.y, cfg.z);
        headersGroup.add(pipeShoe);
      });

      // 6. Condensate Drip Legs & Steam Traps (Drip Pockets)
      const dripPositions = [-14, 14];
      dripPositions.forEach((dx) => {
        const dripPocket = this.createCondensateDripPocket(cfg.radius, dx, cfg.y, cfg.z);
        headersGroup.add(dripPocket);
      });

      // 7. Heavy-Duty ASME B16.5 Raised-Face Blind Flange at East Header End
      const endX = 3 + length / 2;
      const blindGroup = new THREE.Group();
      blindGroup.position.set(endX, cfg.y, cfg.z);

      const blindGeo = new THREE.CylinderGeometry(cfg.radius * 1.52, cfg.radius * 1.52, 0.1, 24);
      const blindMesh = new THREE.Mesh(blindGeo, this.matFlangeSteel);
      blindMesh.rotation.z = Math.PI / 2;
      blindGroup.add(blindMesh);

      // Gasket between header pipe end and blind flange
      const endGasket = new THREE.Mesh(
        new THREE.CylinderGeometry(cfg.radius * 1.25, cfg.radius * 1.25, 0.02, 24),
        this.matGasket
      );
      endGasket.rotation.z = Math.PI / 2;
      endGasket.position.set(-0.06, 0, 0);
      blindGroup.add(endGasket);

      // Stud bolts circle on blind flange
      const numEndBolts = cfg.radius > 0.3 ? 16 : 12;
      const boltCircleR = cfg.radius * 1.26;
      const endBoltGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.16, 6);
      for (let b = 0; b < numEndBolts; b++) {
        const angle = (b / numEndBolts) * Math.PI * 2;
        const bMesh = new THREE.Mesh(endBoltGeo, this.matStudBolt);
        bMesh.rotation.z = Math.PI / 2;
        bMesh.position.set(0, Math.sin(angle) * boltCircleR, Math.cos(angle) * boltCircleR);
        blindGroup.add(bMesh);
      }
      headersGroup.add(blindGroup);
    });

    this.group.add(headersGroup);
  }

  // 5. User Manifolds with Blue Control Valves on Concrete Plinths
  private buildUserManifoldsAndControlValves() {
    const manifoldGroup = new THREE.Group();

    // 1. "HP USERS" Manifold: Concrete plinth with 3 blue control valves & bypasses
    const hpPlinth = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.35, 2.2), this.matConcrete);
    hpPlinth.position.set(16, 0.18, -6);
    manifoldGroup.add(hpPlinth);

    // Signboard: "HP USERS"
    const hpUserSign = this.createSignboardMesh(
      'HP\nUSERS',
      '#1d4ed8',
      '#ffffff',
      1.8,
      1.2,
      's-65_users',
      'HP Steam Consumers (65 kg/cm²G)',
      {
        tag: 'HP USERS',
        catalystOrInternals: 'Total Demand: 192.0 t/h',
        description: 'K-302 Syngas Comp Turbine (82 t/h), K-501 CO2 Comp Turbine (65 t/h), K-301 Air Comp Turbine (45 t/h).'
      }
    );
    hpUserSign.position.set(16, 1.8, -4.8);
    manifoldGroup.add(hpUserSign);

    // 3 Control Valves on HP plinth with authentic ASTM A106 Carbon Steel Drop Pipes
    for (let vx of [-2.0, 0, 2.0]) {
      const cv = this.createControlValveMesh(0.85);
      cv.position.set(16 + vx, 1.2, -6);
      manifoldGroup.add(cv);

      // Connecting Carbon Steel pipe down from HP header (Z = -10)
      const dropPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.4, 16), this.matCarbonSteelPipe);
      dropPipe.position.set(16 + vx, 2.0, -8);
      dropPipe.rotation.x = Math.PI / 3;
      manifoldGroup.add(dropPipe);

      // ASME HP Identification collar on drop branch
      const bandMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.128, 0.128, 0.6, 16), this.matBandHp);
      bandMesh.position.set(16 + vx, 2.0, -8);
      bandMesh.rotation.x = Math.PI / 3;
      manifoldGroup.add(bandMesh);

      // Weld neck flange at valve inlet
      const flgMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16), this.matFlangeSteel);
      flgMesh.position.set(16 + vx, 1.35, -6.6);
      flgMesh.rotation.x = Math.PI / 3;
      manifoldGroup.add(flgMesh);
    }

    // 2. "MP USERS" Manifold: Concrete plinth with control valves & bypasses
    const mpPlinth = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.35, 2.0), this.matConcrete);
    mpPlinth.position.set(16, 0.18, 2);
    manifoldGroup.add(mpPlinth);

    // Signboard: "MP USERS"
    const mpUserSign = this.createSignboardMesh(
      'MP\nUSERS',
      '#1d4ed8',
      '#ffffff',
      1.8,
      1.2,
      's-39_users',
      'MP Steam Consumers (39 kg/cm²G)',
      {
        tag: 'MP USERS',
        catalystOrInternals: 'Total Demand: 104.0 t/h',
        description: 'Primary Reformer H-101 (52 t/h via FRCA-102), BFW Pumps P-101 A/B (22 t/h), Auxiliary Turbine K-303 (18 t/h), K-401 (12 t/h).'
      }
    );
    mpUserSign.position.set(16, 1.6, 3.2);
    manifoldGroup.add(mpUserSign);

    // Control valves on MP plinth with authentic ASTM A106 Carbon Steel Drop Pipes
    for (let vx of [-1.5, 1.5]) {
      const cv = this.createControlValveMesh(0.8);
      cv.position.set(16 + vx, 1.1, 2);
      manifoldGroup.add(cv);

      const dropPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.2, 16), this.matCarbonSteelPipe);
      dropPipe.position.set(16 + vx, 1.8, 0);
      dropPipe.rotation.x = Math.PI / 3;
      manifoldGroup.add(dropPipe);

      // ASME MP Identification collar
      const bandMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.108, 0.108, 0.5, 16), this.matBandMp);
      bandMesh.position.set(16 + vx, 1.8, 0);
      bandMesh.rotation.x = Math.PI / 3;
      manifoldGroup.add(bandMesh);

      // Weld neck flange at valve inlet
      const flgMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 16), this.matFlangeSteel);
      flgMesh.position.set(16 + vx, 1.25, 1.35);
      flgMesh.rotation.x = Math.PI / 3;
      manifoldGroup.add(flgMesh);
    }

    // 3. "LP USERS" Manifold: Concrete plinth with control valves
    const lpPlinth = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.35, 2.0), this.matConcrete);
    lpPlinth.position.set(16, 0.18, 10);
    manifoldGroup.add(lpPlinth);

    // Signboard: "LP USERS"
    const lpUserSign = this.createSignboardMesh(
      'LP\nUSERS',
      '#1d4ed8',
      '#ffffff',
      1.8,
      1.2,
      's-12_users',
      'LP Steam Consumers (12 kg/cm²G)',
      {
        tag: 'LP USERS',
        catalystOrInternals: 'Total Demand: 25.0 t/h',
        description: 'Process Heaters E-112 & E-711, Condensate Reboilers, and PRDS Letdown Station to S-3 Header.'
      }
    );
    lpUserSign.position.set(16, 1.5, 11.2);
    manifoldGroup.add(lpUserSign);

    for (let vx of [-1.5, 1.5]) {
      const cv = this.createControlValveMesh(0.75);
      cv.position.set(16 + vx, 1.0, 10);
      manifoldGroup.add(cv);

      const dropPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.0, 16), this.matCarbonSteelPipe);
      dropPipe.position.set(16 + vx, 1.6, 8);
      dropPipe.rotation.x = Math.PI / 3;
      manifoldGroup.add(dropPipe);

      // ASME LP Identification collar
      const bandMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.098, 0.5, 16), this.matBandLp);
      bandMesh.position.set(16 + vx, 1.6, 8);
      bandMesh.rotation.x = Math.PI / 3;
      manifoldGroup.add(bandMesh);

      // Weld neck flange at valve inlet
      const flgMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 16), this.matFlangeSteel);
      flgMesh.position.set(16 + vx, 1.15, 9.35);
      flgMesh.rotation.x = Math.PI / 3;
      manifoldGroup.add(flgMesh);
    }

    // 4. "INDUSTRIAL STEAM" branch on Left of MP Header
    const indPlinth = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.35, 1.8), this.matConcrete);
    indPlinth.position.set(-16, 0.18, 0);
    manifoldGroup.add(indPlinth);

    const indSign = this.createSignboardMesh(
      'INDUSTRIAL\nSTEAM',
      '#1d4ed8',
      '#ffffff',
      2.2,
      1.3,
      'ind_steam',
      'Industrial Process Steam to Reformer H-101',
      {
        tag: 'FRCA-102',
        catalystOrInternals: '52.0 t/h @ 39.0 kg/cm²G - 380°C',
        description: 'Mixed with desulfurized natural gas at S/C ratio of 3.0 before catalyst tubes in Reformer H-101.'
      }
    );
    indSign.position.set(-16, 1.5, 1.1);
    manifoldGroup.add(indSign);

    const indCv = this.createControlValveMesh(0.85);
    indCv.position.set(-16, 1.1, 0);
    manifoldGroup.add(indCv);

    // Carbon steel branch pipe connecting MP Header (Z = -2) to Industrial Steam Valve (Z = 0)
    const indPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 16), this.matCarbonSteelPipe);
    indPipe.position.set(-16, 1.8, -1);
    indPipe.rotation.x = Math.PI / 4;
    manifoldGroup.add(indPipe);

    const indBand = new THREE.Mesh(new THREE.CylinderGeometry(0.128, 0.128, 0.5, 16), this.matBandMp);
    indBand.position.set(-16, 1.8, -1);
    indBand.rotation.x = Math.PI / 4;
    manifoldGroup.add(indBand);

    const indFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16), this.matFlangeSteel);
    indFlange.position.set(-16, 1.25, -0.4);
    indFlange.rotation.x = Math.PI / 4;
    manifoldGroup.add(indFlange);

    this.group.add(manifoldGroup);
  }

  // 6. Right Header End Signs (Exact Colors, Fonts & Posts as in image)
  private buildHeaderEndSigns() {
    const signsGroup = new THREE.Group();
    const signX = 33.5;

    // 1. HP STEAM HEADER (Orange signboard)
    const hpSign = this.createHeaderEndSignMesh('HP STEAM\nHEADER', '#f97316', '#ffffff', 3.8, 1.9, 's-65');
    hpSign.position.set(signX, 3.2, -10);
    signsGroup.add(hpSign);

    // 2. MP STEAM HEADER (Yellow signboard)
    const mpSign = this.createHeaderEndSignMesh('MP STEAM\nHEADER', '#eab308', '#0f172a', 3.8, 1.9, 's-39');
    mpSign.position.set(signX, 3.0, -2);
    signsGroup.add(mpSign);

    // 3. LP STEAM HEADER (Blue signboard)
    const lpSign = this.createHeaderEndSignMesh('LP STEAM\nHEADER', '#0284c7', '#ffffff', 3.8, 1.9, 's-12');
    lpSign.position.set(signX, 2.8, 6);
    signsGroup.add(lpSign);

    // 4. UTILITY HEADER (Green signboard with Arrow pointing right)
    const utSign = this.createHeaderEndSignMesh('UTILITY\nHEADER ➔', '#22c55e', '#ffffff', 3.8, 1.9, 's-3');
    utSign.position.set(signX, 2.6, 14);
    signsGroup.add(utSign);

    this.group.add(signsGroup);
  }

  // 7. Left Inlet & PRDS Badges (STEAM INLET, FROM 39-12 / 3, KBDV-3912, PRDS, DESIGN 100.0%, PLANT LOAD 100.0%)
  private buildInletAndPrdsBadges() {
    const badgesGroup = new THREE.Group();

    // 1. "STEAM INLET" (Blue badge on left)
    const inletSign = this.createBadgeMesh('STEAM INLET', '#1d4ed8', '#ffffff', 2.8, 1.1);
    inletSign.position.set(-27, 3.6, -10);
    badgesGroup.add(inletSign);

    // 2. "FROM 39-12 / 3" (White text on thin bypass pipe above inlet)
    const fromSign = this.createBadgeMesh('FROM 39-12 / 3', '#334155', '#e2e8f0', 2.8, 0.7);
    fromSign.position.set(-27, 4.4, -10);
    badgesGroup.add(fromSign);

    // 3. Flanged Valve tagged "KBDV-3912" (Big blue handwheel valve on HP inlet)
    const inletValve = this.createControlValveMesh(1.1);
    inletValve.position.set(-21, 2.6, -10);
    badgesGroup.add(inletValve);

    const kbdvBadge = this.createBadgeMesh('KBDV-3912', '#1d4ed8', '#ffffff', 2.0, 0.75);
    kbdvBadge.position.set(-21, 4.2, -10);
    badgesGroup.add(kbdvBadge);

    // 4. Red Badges: "PRDS" and "DESIGN 100.0%"
    const prdsBadge = this.createBadgeMesh('PRDS', '#dc2626', '#ffffff', 1.8, 0.9);
    prdsBadge.position.set(-15, 3.8, -10);
    badgesGroup.add(prdsBadge);

    const designBadge = this.createBadgeMesh('DESIGN\n100.0%', '#dc2626', '#ffffff', 2.0, 1.1);
    designBadge.position.set(-11, 3.8, -10);
    badgesGroup.add(designBadge);

    // 5. Blue Badge: "PLANT LOAD 100.0%"
    const loadBadge = this.createBadgeMesh('PLANT LOAD\n100.0%', '#1d4ed8', '#ffffff', 2.4, 1.2);
    loadBadge.position.set(-3, 3.8, -10);
    badgesGroup.add(loadBadge);

    this.group.add(badgesGroup);
  }

  // 8. Industrial Pressure Gauges with Pigtail Siphons and Round Dials
  private buildPressureGauges() {
    const gaugeGroup = new THREE.Group();

    // Locations along headers
    const gaugeLocs = [
      { x: -7, y: 2.6, z: -10, val: '65.0' },
      { x: 3, y: 2.4, z: -2, val: '39.0' },
      { x: -14, y: 2.4, z: -2, val: '39.0' },
      { x: 2, y: 2.2, z: 6, val: '12.0' },
      { x: -10, y: 2.2, z: 6, val: '12.0' },
      { x: -4, y: 2.0, z: 14, val: '3.0' },
      { x: 10, y: 2.0, z: 14, val: '3.0' }
    ];

    gaugeLocs.forEach((g) => {
      const gObj = new THREE.Group();
      gObj.position.set(g.x, g.y, g.z);

      // Pigtail curved siphon pipe (Torus arc + vertical rise)
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 8), this.matGaugeBrass);
      stem.position.set(0, 0.4, 0.35);
      gObj.add(stem);

      const siphonGeo = new THREE.TorusGeometry(0.12, 0.02, 8, 16, Math.PI * 1.5);
      const siphon = new THREE.Mesh(siphonGeo, this.matGaugeBrass);
      siphon.position.set(0, 0.9, 0.35);
      siphon.rotation.y = Math.PI / 2;
      gObj.add(siphon);

      // Gauge body casing (Cylinder facing camera +Z)
      const dialCasing = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.12, 24), this.matChrome);
      dialCasing.rotation.x = Math.PI / 2;
      dialCasing.position.set(0, 1.25, 0.35);
      gObj.add(dialCasing);

      // Gauge face dial texture
      const dialTex = this.createBoardCanvas(256, 256, (ctx) => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(128, 128, 120, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Graduation ticks
        for (let a = 0; a < 12; a++) {
          const angle = (a / 12) * Math.PI * 1.5 + Math.PI * 0.75;
          const x1 = 128 + Math.cos(angle) * 110;
          const y1 = 128 + Math.sin(angle) * 110;
          const x2 = 128 + Math.cos(angle) * 90;
          const y2 = 128 + Math.sin(angle) * 90;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineWidth = 4;
          ctx.stroke();
        }

        // Value text
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 36px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(g.val, 128, 160);

        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('kg/cm²G', 128, 192);

        // Needle
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(128, 128);
        ctx.lineTo(128 + Math.cos(-Math.PI * 0.25) * 85, 128 + Math.sin(-Math.PI * 0.25) * 85);
        ctx.stroke();

        // Center hub
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(128, 128, 10, 0, Math.PI * 2);
        ctx.fill();
      });

      const faceMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.58, 0.58),
        new THREE.MeshBasicMaterial({ map: dialTex, transparent: true })
      );
      faceMesh.position.set(0, 1.25, 0.42);
      gObj.add(faceMesh);

      gaugeGroup.add(gObj);
    });

    this.group.add(gaugeGroup);
  }

  // 9. Two Foreground High-Fidelity DCS Display Screens (LEGEND & STEAM LOAD SUMMARY)
  private buildForegroundDcsScreens() {
    const screensGroup = new THREE.Group();

    // =========================================================================
    // SCREEN 1 (LEFT): COLOR CODED PIPING & VALVE LEGEND
    // Position: X = -14, Y = 1.8, Z = 22
    // =========================================================================
    const legW = 7.2;
    const legH = 4.6;
    const legFrame = new THREE.Mesh(new THREE.BoxGeometry(legW, legH, 0.35), this.matDarkSteel);
    legFrame.position.set(-14, 2.6, 22);
    screensGroup.add(legFrame);

    // Dual support legs on ground
    for (let lx of [-2.4, 2.4]) {
      const legPost = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 12), this.matSteel);
      legPost.position.set(-14 + lx, 0.75, 22);
      screensGroup.add(legPost);

      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.45), this.matDarkSteel);
      foot.position.set(-14 + lx, 0.05, 22);
      screensGroup.add(foot);
    }

    // Legend Texture Face
    const legendTex = this.createBoardCanvas(512, 360, (ctx) => {
      // Dark slate glass backdrop
      ctx.fillStyle = '#0a101d';
      ctx.fillRect(0, 0, 512, 360);

      // Border highlight
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 500, 348);

      const items = [
        { color: '#f97316', label: 'HP STEAM', sub: 'S-65 (65 kg/cm²G @ 435°C)' },
        { color: '#eab308', label: 'MP STEAM', sub: 'S-39 (39 kg/cm²G @ 380°C)' },
        { color: '#0284c7', label: 'LP STEAM', sub: 'S-12 (12 kg/cm²G @ 190°C)' },
        { color: '#22c55e', label: 'UTILITY', sub: 'S-3 (3.0 kg/cm²G @ 245°C)' },
        { color: '#15803d', label: 'CONDENSATE', sub: 'Flash & Return V-109' },
        { color: '#94a3b8', label: 'INSTRUMENT', sub: 'Impulse Lines & Gauges' },
        { color: '#2563eb', label: 'CONTROL VALVE', sub: 'Pneumatic Actuated' }
      ];

      items.forEach((it, idx) => {
        const y = 38 + idx * 44;

        // Color Swatch Box
        ctx.fillStyle = it.color;
        ctx.beginPath();
        ctx.roundRect(28, y - 14, 48, 24, 4);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(it.label, 95, y);

        // Subtitle / Engineering spec
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px "Courier New", monospace';
        ctx.fillText(it.sub, 270, y);
      });
    });

    const legendScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(legW - 0.4, legH - 0.4),
      new THREE.MeshBasicMaterial({ map: legendTex })
    );
    legendScreen.position.set(-14, 2.6, 22.2);
    screensGroup.add(legendScreen);

    // =========================================================================
    // SCREEN 2 (RIGHT): STEAM LOAD SUMMARY
    // Position: X = 8, Y = 1.8, Z = 22
    // =========================================================================
    const sumW = 7.4;
    const sumH = 4.8;
    const sumFrame = new THREE.Mesh(new THREE.BoxGeometry(sumW, sumH, 0.35), this.matDarkSteel);
    sumFrame.position.set(8, 2.7, 22);
    screensGroup.add(sumFrame);

    for (let lx of [-2.4, 2.4]) {
      const sumPost = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 12), this.matSteel);
      sumPost.position.set(8 + lx, 0.75, 22);
      screensGroup.add(sumPost);

      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.45), this.matDarkSteel);
      foot.position.set(8 + lx, 0.05, 22);
      screensGroup.add(foot);
    }

    // Steam Load Summary Canvas Texture (Real Engineering Values from 2D P&ID)
    const sumTex = this.createBoardCanvas(540, 380, (ctx) => {
      // Dark slate CRT backdrop
      ctx.fillStyle = '#060d17';
      ctx.fillRect(0, 0, 540, 380);

      // Cyan / Dark frame
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 5;
      ctx.strokeRect(6, 6, 528, 368);

      // Header title banner
      ctx.fillStyle = '#0c4a6e';
      ctx.fillRect(8, 8, 524, 52);

      ctx.fillStyle = '#e0f2fe';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('STEAM LOAD SUMMARY', 270, 34);

      // Table Rows
      const rows = [
        { name: 'HP :', pct: '100.0 %', flow: '210.0 t/h', press: '65.0 kg/cm²G', color: '#f97316' },
        { name: 'MP :', pct: '100.0 %', flow: '144.0 t/h', press: '39.0 kg/cm²G', color: '#eab308' },
        { name: 'LP :', pct: '100.0 %', flow: '31.5 t/h', press: '12.0 kg/cm²G', color: '#38bdf8' },
        { name: 'UTILITY :', pct: '100.0 %', flow: '42.5 t/h', press: '3.0 kg/cm²G', color: '#4ade80' }
      ];

      rows.forEach((r, idx) => {
        const y = 98 + idx * 50;

        ctx.fillStyle = r.color;
        ctx.font = 'bold 20px "Courier New", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(r.name, 36, y);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px "Courier New", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(r.pct, 240, y);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '15px "Courier New", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`(${r.flow} @ ${r.press})`, 265, y);
      });

      // Divider line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, 298);
      ctx.lineTo(510, 298);
      ctx.stroke();

      // TOTAL Line
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px "Courier New", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('TOTAL :', 36, 335);

      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 26px "Courier New", monospace';
      ctx.textAlign = 'right';
      ctx.fillText('100.0 %', 240, 335);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 16px "Courier New", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('(210.0 t/h Total Net)', 265, 335);
    });

    const sumScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(sumW - 0.4, sumH - 0.4),
      new THREE.MeshBasicMaterial({ map: sumTex })
    );
    sumScreen.position.set(8, 2.7, 22.2);
    screensGroup.add(sumScreen);

    this.group.add(screensGroup);
  }

  // 10. Steam Flow Particle Systems inside the Pipes
  private buildSteamFlowParticles() {
    const createPoints = (z: number, y: number, color: number, count: number, size: number) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 0] = -28 + Math.random() * 60;
        pos[i * 3 + 1] = y + (Math.random() - 0.5) * 0.2;
        pos[i * 3 + 2] = z + (Math.random() - 0.5) * 0.2;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: color,
        size: size,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      const pts = new THREE.Points(geo, mat);
      this.group.add(pts);
      return pts;
    };

    this.s65Particles = createPoints(-10, 2.6, 0xf97316, 120, 0.25);
    this.s39Particles = createPoints(-2, 2.4, 0xeab308, 100, 0.22);
    this.s12Particles = createPoints(6, 2.2, 0x0284c7, 80, 0.18);
    this.s3Particles = createPoints(14, 2.0, 0x22c55e, 70, 0.16);
  }

  // =========================================================================
  // HELPER MESH GENERATORS
  // =========================================================================

  // Create Standard Blue Control Valve (Pneumatic Diaphragm Actuator + Body + Handwheel)
  private createControlValveMesh(scale = 1.0): THREE.Group {
    const valveGroup = new THREE.Group();

    // Valve flanged body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7 * scale, 0.45 * scale, 0.45 * scale), this.matValveBodyBlue);
    valveGroup.add(body);

    for (let side of [-1, 1]) {
      const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.28 * scale, 0.28 * scale, 0.08 * scale, 12), this.matChrome);
      flange.rotation.z = Math.PI / 2;
      flange.position.set(side * 0.38 * scale, 0, 0);
      valveGroup.add(flange);
    }

    // Bonnet stem
    const bonnet = new THREE.Mesh(new THREE.CylinderGeometry(0.06 * scale, 0.06 * scale, 0.6 * scale, 12), this.matSteel);
    bonnet.position.set(0, 0.45 * scale, 0);
    valveGroup.add(bonnet);

    // Dome Pneumatic Diaphragm Actuator (Blue)
    const actGeo = new THREE.CylinderGeometry(0.38 * scale, 0.38 * scale, 0.35 * scale, 16);
    const act = new THREE.Mesh(actGeo, this.matActuatorBlue);
    act.position.set(0, 0.85 * scale, 0);
    valveGroup.add(act);

    // Blue Manual Handwheel
    const wheelGeo = new THREE.TorusGeometry(0.2 * scale, 0.025 * scale, 8, 16);
    const wheel = new THREE.Mesh(wheelGeo, this.matHandwheelBlue);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(0, 1.15 * scale, 0);
    valveGroup.add(wheel);

    return valveGroup;
  }

  // Create Header End Signboard (Orange, Yellow, Blue, Green)
  private createHeaderEndSignMesh(
    text: string,
    bgColor: string,
    textColor: string,
    width: number,
    height: number,
    eqId: string
  ): THREE.Group {
    const group = new THREE.Group();

    // Steel post on ground
    const postH = 2.4;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, postH, 12), this.matSteel);
    post.position.set(0, -postH / 2, 0);
    group.add(post);

    // Base plate
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.4), this.matDarkSteel);
    base.position.set(0, -postH, 0);
    group.add(base);

    // Sign box casing
    const box = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.18), this.matDarkSteel);
    group.add(box);

    // Face Texture
    const tex = this.createBoardCanvas(380, 200, (ctx) => {
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(8, 8, 364, 184, 12);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lines = text.split('\n');
      if (lines.length === 1) {
        ctx.fillText(lines[0], 190, 100);
      } else {
        ctx.fillText(lines[0], 190, 75);
        ctx.fillText(lines[1], 190, 125);
      }
    });

    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(width - 0.2, height - 0.2),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    face.position.set(0, 0, 0.1);
    group.add(face);

    this.registerEquipment(box, eqId, text.replace('\n', ' '));

    return group;
  }

  // Create General Signboard Mesh on Stand
  private createSignboardMesh(
    text: string,
    bgColor: string,
    textColor: string,
    width: number,
    height: number,
    eqId: string,
    title: string,
    info?: Partial<EquipmentInfo>
  ): THREE.Group {
    const group = new THREE.Group();

    // Frame box
    const box = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.15), this.matDarkSteel);
    group.add(box);

    const tex = this.createBoardCanvas(320, 180, (ctx) => {
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(6, 6, 308, 168, 10);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lines = text.split('\n');
      if (lines.length === 1) {
        ctx.fillText(lines[0], 160, 90);
      } else {
        ctx.fillText(lines[0], 160, 68);
        ctx.fillText(lines[1], 160, 114);
      }
    });

    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(width - 0.15, height - 0.15),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    face.position.set(0, 0, 0.08);
    group.add(face);

    this.registerEquipment(box, eqId, title, info);

    return group;
  }

  // Create Smaller Tag Badge Mesh (Red, Blue, Slate)
  private createBadgeMesh(text: string, bgColor: string, textColor: string, width: number, height: number): THREE.Group {
    const group = new THREE.Group();

    const box = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.1), this.matDarkSteel);
    group.add(box);

    const tex = this.createBoardCanvas(256, 128, (ctx) => {
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(4, 4, 248, 120, 8);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lines = text.split('\n');
      if (lines.length === 1) {
        ctx.fillText(lines[0], 128, 64);
      } else {
        ctx.fillText(lines[0], 128, 46);
        ctx.fillText(lines[1], 128, 84);
      }
    });

    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(width - 0.08, height - 0.08),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    face.position.set(0, 0, 0.06);
    group.add(face);

    return group;
  }

  // Animation Update
  public update(delta: number) {
    const advance = (pts: THREE.Points, speed: number) => {
      if (!pts || !pts.geometry) return;
      const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      const c = arr.length / 3;
      for (let i = 0; i < c; i++) {
        arr[i * 3 + 0] += speed * delta;
        if (arr[i * 3 + 0] > 32) {
          arr[i * 3 + 0] = -28;
        }
      }
      attr.needsUpdate = true;
    };

    advance(this.s65Particles, 18.0);
    advance(this.s39Particles, 14.0);
    advance(this.s12Particles, 10.0);
    advance(this.s3Particles, 8.0);
  }
}
