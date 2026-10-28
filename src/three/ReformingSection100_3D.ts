import * as THREE from 'three';
import { EquipmentInfo, MASTER_EQUIPMENT_DATA } from './PlantDiagramData';
import {
  createCarbonSteelTexture,
  createIndustrialCarbonSteelPipeTexture,
  createCarbonSteelBumpTexture,
  createAluminumCladdingTexture,
  createCladdingBumpTexture
} from './TextureGenerator';

/**
 * Colossal Professional 3D Digital Twin of Section 100: Gas Reforming, Shift Conversion & Convection Zone
 * Blueprint: DWG NO. 6112P 100-100-00 (IRAQ NO. 3 FERTILIZER COMPLEX - KHOR AL-ZUBAIR)
 *
 * Exact Plant Architecture:
 * 1. R-101 Primary Reformer:
 *    - 6 Distinct Vertical Layers / Tiers (الطبقات الست: Layer 1 to Layer 6).
 *    - 4 Radiant Cell Walls / Quadrants (جدارات A, B, C, D) in each layer.
 *    - 2 Tube Banks containing 200 HK-40 Catalyst Tubes (100 North + 100 South) carrying NG + HP Steam.
 *    - Exactly 480 Distributed Burners (80 burners per layer across Walls ABCD x 6 layers = 480 مشعل).
 *    - Sub-Floor Effluent Collector System beneath furnace floor where all 200 tubes converge into bottom collector.
 *    - Hot Transfer Line emerges directly from the BOTTOM of R-101 (Y=3.8m) and routes to R-103.
 * 2. E-101 to R-101 Mixed Feed Overhead Line:
 *    - Continuous overhead high gantry (Y = 41m) routing directly from E-101 into dual R-101 arch headers.
 *    - ZERO clashing with Convection Zone heat exchangers (E-102..E-105B).
 * 3. Continuous HP Steam S-39 Line & Mixing Station:
 *    - Fully connected from battery limit rack (Z = 4.0, X = -92) directly into R-102 desulfurized gas outlet line (X = -22, Y = 12, Z = -18) forming Mixed Feed entering E-101.
 * 4. Convection Zone 7-Stack Exchanger Tower (E-101..E-105B), Dual ID Fans K-101A/B, 70m Stack ST-101.
 * 5. 100% Strict Orthogonal Manhattan Routing throughout.
 */
export class ReformingSection100_3D {
  public group: THREE.Group;
  public interactiveMeshes: THREE.Object3D[] = [];
  public claddingMeshes: THREE.Mesh[] = [];
  public onSelectCallback?: (info: EquipmentInfo) => void;

  private rotatingShafts: THREE.Object3D[] = [];

  // Authentic Heavy Industrial Materials (No Plastic)
  private matCarbonSteel!: THREE.MeshStandardMaterial;
  private matRefractoryBrick!: THREE.MeshStandardMaterial;
  private matAlloySteel!: THREE.MeshStandardMaterial;
  private matPolishedSteel!: THREE.MeshStandardMaterial;
  private matHotSteelEffluent!: THREE.MeshStandardMaterial;
  private matConcretePad!: THREE.MeshStandardMaterial;
  private matConcreteCurb!: THREE.MeshStandardMaterial;
  private matYellowSafety!: THREE.MeshStandardMaterial;
  private matCatwalkSteel!: THREE.MeshStandardMaterial;
  private matFlange!: THREE.MeshStandardMaterial;
  private matFurnaceFireGlow!: THREE.MeshStandardMaterial;
  private matBurnerFlame!: THREE.MeshStandardMaterial;
  private matCatalystTube!: THREE.MeshStandardMaterial;
  public matAluminumCladding!: THREE.MeshStandardMaterial;
  public matCladdingStraps!: THREE.MeshStandardMaterial;
  public matLobsterElbow!: THREE.MeshStandardMaterial;
  public isCladdingTranslucent: boolean = false;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'ReformingSection100_3D_Twin';

    this.initMaterials();
    this.buildCivilFoundationAndPaving();
    this.buildStructuralPiperacksAndCatwalks();
    this.buildFeedGasCompressorK303();
    this.buildNaturalGasPreheaterH101();
    this.buildDesulfurizationReactorsR102AB();
    this.buildPrimaryReformerFurnaceR101();
    this.buildConvectionZoneBuildingAndIDFans();
    this.buildProcessAirCompressorK302();
    this.buildSecondaryReformerR103();
    this.buildWasteHeatBoilerE108AndSteamDrumV102A();
    this.buildHighTempShiftConverterR104();
    this.buildHeatRecoveryTrainE109E107E110();
    this.buildKnockOutDrumV101();
    this.buildLowTempShiftConverterR105();
    this.buildMethanationSystemR106();
    this.buildProcessPipingNetwork();
    this.buildEquipmentBadgesAndSigns();
    this.buildDcsInfoScreens();
  }

  private initMaterials() {
    const csDiff = createCarbonSteelTexture();
    const pipeDiff = createIndustrialCarbonSteelPipeTexture();
    const pipeBump = createCarbonSteelBumpTexture();
    const cladDiff = createAluminumCladdingTexture();
    const cladBump = createCladdingBumpTexture();

    // Heavy Industrial Carbon Steel
    this.matCarbonSteel = new THREE.MeshStandardMaterial({
      color: 0x36414c,
      map: csDiff,
      bumpMap: pipeBump,
      bumpScale: 0.06,
      roughness: 0.38,
      metalness: 0.92
    });

    // Refractory Brick / Castable Lining for Firebox and Transition Ducts
    this.matRefractoryBrick = new THREE.MeshStandardMaterial({
      color: 0x54382c,
      roughness: 0.94,
      metalness: 0.08
    });

    // Structural Rolled Steel
    this.matAlloySteel = new THREE.MeshStandardMaterial({
      color: 0x242d38,
      roughness: 0.44,
      metalness: 0.9
    });

    // Machined Polished Steel
    this.matPolishedSteel = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.16,
      metalness: 0.96
    });

    // HK-40 / HP Microalloy Catalyst Reformer Tubes
    this.matCatalystTube = new THREE.MeshStandardMaterial({
      color: 0x8a9ba8,
      roughness: 0.28,
      metalness: 0.88
    });

    // Oxidized High-Temperature Effluent Steel
    this.matHotSteelEffluent = new THREE.MeshStandardMaterial({
      color: 0x483a30,
      roughness: 0.46,
      metalness: 0.85
    });

    // Dark Industrial Foundation Concrete
    this.matConcretePad = new THREE.MeshStandardMaterial({
      color: 0x1b222c,
      roughness: 0.96,
      metalness: 0.02
    });

    this.matConcreteCurb = new THREE.MeshStandardMaterial({
      color: 0x26303d,
      roughness: 0.9,
      metalness: 0.05
    });

    // Industrial Safety Amber
    this.matYellowSafety = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.45,
      metalness: 0.25
    });

    // Galvanized Catwalk Grating & Stair Treads
    this.matCatwalkSteel = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.55,
      metalness: 0.82
    });

    // Forged Steel Pipe Flanges
    this.matFlange = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.28,
      metalness: 0.92
    });

    this.matFurnaceFireGlow = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xd946ef,
      emissiveIntensity: 0.4,
      roughness: 0.6
    });

    this.matBurnerFlame = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf97316,
      emissiveIntensity: 0.85,
      roughness: 0.3
    });

    // Brushed Aluminum Thermal Insulation Cladding
    this.matAluminumCladding = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      map: cladDiff,
      bumpMap: cladBump,
      bumpScale: 0.04,
      roughness: 0.28,
      metalness: 0.86
    });

    this.matCladdingStraps = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.2,
      metalness: 0.94
    });

    this.matLobsterElbow = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      map: cladDiff,
      roughness: 0.26,
      metalness: 0.86
    });
  }

  // 1. Civil Foundation & Industrial Reinforced Concrete Paving
  private buildCivilFoundationAndPaving() {
    const padGeo = new THREE.BoxGeometry(220, 2.0, 160);
    const pad = new THREE.Mesh(padGeo, this.matConcretePad);
    pad.position.set(0, 1.0, -22);
    pad.receiveShadow = true;
    this.group.add(pad);

    const curbGeo = new THREE.BoxGeometry(222, 0.6, 162);
    const curb = new THREE.Mesh(curbGeo, this.matYellowSafety);
    curb.position.set(0, 0.3, -22);
    this.group.add(curb);

    [-78, -32, 2, 44].forEach((z) => {
      const trench = new THREE.Mesh(new THREE.BoxGeometry(214, 0.3, 2.0), this.matConcreteCurb);
      trench.position.set(0, 2.05, z);
      this.group.add(trench);
    });

    [-44, 16, 44, 72].forEach((x) => {
      const trench = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 150), this.matConcreteCurb);
      trench.position.set(x, 2.05, -22);
      this.group.add(trench);
    });
  }

  // 2. Line Supports & Piperacks Removed (إلغاء حمالات الخطوط بالكامل لمنع التداخل والازدحام البصري)
  private buildStructuralPiperacksAndCatwalks() {
    // Pipe racks and line supports removed per operational specification
    // All process piping runs freely in 3D open space with pure orthogonal clearance
  }

  // 3. K-303 / K-303T Natural Gas Feed Compressor Train (X = -75.0, Z = -18.0)
  private buildFeedGasCompressorK303() {
    const k303Group = new THREE.Group();
    k303Group.position.set(-75.0, 2.0, -18.0);

    const plinth = new THREE.Mesh(new THREE.BoxGeometry(14.0, 2.0, 7.5), this.matConcreteCurb);
    plinth.position.set(0, 1.0, 0);
    k303Group.add(plinth);

    const turbine = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.9, 4.0, 24), this.matAlloySteel);
    turbine.rotation.z = Math.PI / 2;
    turbine.position.set(-4.0, 3.2, 0);
    k303Group.add(turbine);

    const coupling = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.2, 16), this.matYellowSafety);
    coupling.rotation.z = Math.PI / 2;
    coupling.position.set(-1.4, 3.2, 0);
    k303Group.add(coupling);

    const compBody = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 5.0, 24), this.matCarbonSteel);
    compBody.rotation.z = Math.PI / 2;
    compBody.position.set(2.0, 3.2, 0);
    k303Group.add(compBody);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 11.5, 16), this.matPolishedSteel);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(0, 3.2, 0);
    k303Group.add(shaft);
    this.rotatingShafts.push(shaft);

    this.addNozzleWithFlange(k303Group, new THREE.Vector3(1.2, 5.2, 0), new THREE.Vector3(0, 1, 0), 0.55, 1.8);
    this.addNozzleWithFlange(k303Group, new THREE.Vector3(2.8, 5.2, 0), new THREE.Vector3(0, 1, 0), 0.45, 1.8);

    const lubeOilConsole = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.8, 3.0), this.matCarbonSteel);
    lubeOilConsole.position.set(0, 2.9, 4.5);
    k303Group.add(lubeOilConsole);

    this.registerInteractive(k303Group, 'k-303');
    this.group.add(k303Group);
  }

  // 4. H-101 Natural Gas Fired Preheater (X = -52.0, Z = -18.0)
  private buildNaturalGasPreheaterH101() {
    const h101Group = new THREE.Group();
    h101Group.position.set(-52.0, 2.0, -18.0);

    const plinth = new THREE.Mesh(new THREE.BoxGeometry(11.0, 1.8, 9.0), this.matConcreteCurb);
    plinth.position.set(0, 0.9, 0);
    h101Group.add(plinth);

    [-3.8, 3.8].forEach((x) => {
      [-2.8, 2.8].forEach((z) => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.85, 4.5, 0.85), this.matAlloySteel);
        col.position.set(x, 3.25, z);
        h101Group.add(col);
      });
    });

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(8.5, 9.0, 6.5), this.matCarbonSteel);
    cabin.position.set(0, 9.5, 0);
    h101Group.add(cabin);

    const hood = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 4.0, 4.0, 4, 1, false, Math.PI / 4), this.matCarbonSteel);
    hood.position.set(0, 16.0, 0);
    h101Group.add(hood);

    const stack = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.0, 30.0, 24, 1, true), this.matCarbonSteel);
    stack.position.set(0, 31.0, 0);
    h101Group.add(stack);

    const stackInner = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.9, 30.0, 24, 1, true), this.matRefractoryBrick);
    stackInner.position.set(0, 31.0, 0);
    h101Group.add(stackInner);

    // Open Top Crown Rim Ring
    const stackRim = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.08, 12, 24), this.matAlloySteel);
    stackRim.rotation.x = Math.PI / 2;
    stackRim.position.set(0, 46.0, 0);
    h101Group.add(stackRim);

    [22.0, 34.0, 44.0].forEach((y) => {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 0.35, 24), this.matCatwalkSteel);
      ring.position.set(0, y, 0);
      h101Group.add(ring);

      const rail = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.35, 1.1, 24, 1, true), this.matYellowSafety);
      rail.position.set(0, y + 0.55, 0);
      h101Group.add(rail);
    });

    this.addNozzleWithFlange(h101Group, new THREE.Vector3(-4.4, 5.5, 0), new THREE.Vector3(-1, 0, 0), 0.55, 1.6);
    this.addNozzleWithFlange(h101Group, new THREE.Vector3(4.4, 10.5, 0), new THREE.Vector3(1, 0, 0), 0.55, 1.6);

    this.registerInteractive(h101Group, 'h-101');
    this.group.add(h101Group);
  }

  // 5. R-102 A & R-102 B Twin Desulfurization Reactors (X = -30.0, Z = -18.0)
  private buildDesulfurizationReactorsR102AB() {
    const desulfGroup = new THREE.Group();
    desulfGroup.position.set(-30.0, 2.0, -18.0);

    [-4.5, 4.5].forEach((zOffset, idx) => {
      const tag = idx === 0 ? 'r-102a' : 'r-102b';
      const rGroup = new THREE.Group();
      rGroup.position.set(0, 0, zOffset);

      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.4, 2.0, 24), this.matConcreteCurb);
      plinth.position.set(0, 1.0, 0);
      rGroup.add(plinth);

      const skirt = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 3.8, 24), this.matAlloySteel);
      skirt.position.set(0, 3.9, 0);
      rGroup.add(skirt);

      const vessel = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 13.0, 32), this.matCarbonSteel);
      vessel.position.set(0, 12.3, 0);
      rGroup.add(vessel);

      const topHead = new THREE.Mesh(new THREE.SphereGeometry(2.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), this.matCarbonSteel);
      topHead.position.set(0, 18.8, 0);
      rGroup.add(topHead);

      [8.5, 15.0, 18.8].forEach((y) => {
        const plat = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, 0.35, 24), this.matCatwalkSteel);
        plat.position.set(0, y, 0);
        rGroup.add(plat);

        const handrail = new THREE.Mesh(new THREE.CylinderGeometry(3.85, 3.85, 1.1, 24, 1, true), this.matYellowSafety);
        handrail.position.set(0, y + 0.55, 0);
        rGroup.add(handrail);
      });

      this.addNozzleWithFlange(rGroup, new THREE.Vector3(0, 21.6, 0), new THREE.Vector3(0, 1, 0), 0.6, 1.8);
      this.addNozzleWithFlange(rGroup, new THREE.Vector3(0, 5.8, 0), new THREE.Vector3(1, 0, 0), 0.6, 3.2);

      this.registerInteractive(rGroup, tag);
      desulfGroup.add(rGroup);
    });

    const manifold = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 9.0, 16), this.matCarbonSteel);
    manifold.position.set(-2.8, 9.5, 0);
    desulfGroup.add(manifold);

    this.registerInteractive(desulfGroup, 'r-102');
    this.group.add(desulfGroup);
  }

  // 6. R-101 Primary Reformer Radiant Firebox (X = 0.0, Z = -14.0)
  // Structured Architecture:
  // - 3 Main Industrial Stories (الطوابق الثلاثة الرئيسية), each housing 2 layers = 6 Layers total.
  // - Complete Industrial Ascending & Descending Staircase Tower (درج صعود ونزول لجميع الطوابق) with landings & safety handrails.
  // - Open Cutaway Front Architectural Framing (داخله مفتوح للطوابق الثلاثة) enabling direct view of the interior:
  //   200 HK-40 Catalyst tubes in 2 banks, 4 radiant walls A, B, C, D, and 480 distributed burners firing inside.
  // - Sub-Floor Effluent Collection Manifolds beneath furnace floor where all tubes converge into bottom collector.
  private buildPrimaryReformerFurnaceR101() {
    const r101Group = new THREE.Group();
    r101Group.position.set(0.0, 2.0, -14.0);

    // Heavy Concrete Foundation Mat (Width 28m, Depth 18m)
    const pad = new THREE.Mesh(new THREE.BoxGeometry(28.0, 2.0, 18.0), this.matConcretePad);
    pad.position.set(0, 1.0, 0);
    r101Group.add(pad);

    // 16 Heavy Steel Support Columns elevating furnace floor at Y = 5.0m
    for (let x = -10.0; x <= 10.0; x += 5.0) {
      for (let z = -6.5; z <= 6.5; z += 6.5) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.0, 1.2), this.matAlloySteel);
        leg.position.set(x, 3.5, z);
        r101Group.add(leg);
      }
    }

    // =========================================================================
    // OPEN CUTAWAY FURNACE ENCLOSURE FOR THE 3 STORIES (داخله مفتوح)
    // Solid Back Wall, Side Walls, Floor, and Roof with Cutaway Open Front Viewport
    // =========================================================================
    // 1. Refractory Floor Slab (Y = 5.0m)
    const floorSlab = new THREE.Mesh(new THREE.BoxGeometry(22.0, 0.8, 14.0), this.matRefractoryBrick);
    floorSlab.position.set(0, 5.4, 0);
    r101Group.add(floorSlab);

    // 2. Refractory Back Solid Wall (North Wall at Z = -7.0m)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(22.0, 16.0, 0.8), this.matRefractoryBrick);
    backWall.position.set(0, 13.0, -6.8);
    r101Group.add(backWall);

    // 3. West & East Side Refractory Walls (with inspection portals)
    [-10.8, 10.8].forEach((wX) => {
      const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, 16.0, 14.0), this.matRefractoryBrick);
      sideWall.position.set(wX, 13.0, 0);
      r101Group.add(sideWall);
    });

    // 4. Open Architectural Front Framing (South Wall at Z = +6.8m)
    // Left & Right Corner Pillars + Top and Bottom Beams, leaving the 3 stories OPEN to view inside
    const leftFrontPillar = new THREE.Mesh(new THREE.BoxGeometry(2.0, 16.0, 0.8), this.matRefractoryBrick);
    leftFrontPillar.position.set(-10.0, 13.0, 6.8);
    r101Group.add(leftFrontPillar);

    const rightFrontPillar = new THREE.Mesh(new THREE.BoxGeometry(2.0, 16.0, 0.8), this.matRefractoryBrick);
    rightFrontPillar.position.set(10.0, 13.0, 6.8);
    r101Group.add(rightFrontPillar);

    // Subtle Internal Firebox Glow Plane for realistic illumination of catalyst tubes
    const glowGeo = new THREE.PlaneGeometry(20.0, 15.0);
    const glowMesh = new THREE.Mesh(glowGeo, this.matFurnaceFireGlow);
    glowMesh.position.set(0, 13.0, -6.2);
    r101Group.add(glowMesh);

    // =========================================================================
    // 3 MAIN STORIES (الطوابق الثلاثة) & 6 DISTINCT LAYERS (Layer 1 to Layer 6)
    // Story 1: Layer 1 (7.0m) & Layer 2 (9.5m)
    // Story 2: Layer 3 (12.0m) & Layer 4 (14.5m)
    // Story 3: Layer 5 (17.0m) & Layer 6 (19.5m)
    // =========================================================================
    const layerElevations = [7.0, 9.5, 12.0, 14.5, 17.0, 19.5]; // 6 Layers across 3 Stories
    const storyMainPlatforms = [7.0, 12.0, 17.0, 22.0]; // 3 Main Story Decks + Top Roof Deck

    // Buckstays across all 6 layers
    layerElevations.forEach((yL) => {
      const stayFront = new THREE.Mesh(new THREE.BoxGeometry(22.6, 0.35, 0.35), this.matAlloySteel);
      stayFront.position.set(0, yL, 7.2);
      r101Group.add(stayFront);

      const stayBack = new THREE.Mesh(new THREE.BoxGeometry(22.6, 0.35, 0.35), this.matAlloySteel);
      stayBack.position.set(0, yL, -7.2);
      r101Group.add(stayBack);
    });

    // Catwalks and Handrails for the 3 Main Stories (الطوابق الثلاثة) + Roof
    storyMainPlatforms.forEach((yS, sIdx) => {
      // Front Main Catwalk Platform (Full access corridor)
      const catwalkFront = new THREE.Mesh(new THREE.BoxGeometry(24.0, 0.25, 2.2), this.matCatwalkSteel);
      catwalkFront.position.set(0, yS, 8.2);
      r101Group.add(catwalkFront);

      const railFront = new THREE.Mesh(new THREE.BoxGeometry(24.0, 1.1, 0.08), this.matYellowSafety);
      railFront.position.set(0, yS + 0.55, 9.2);
      r101Group.add(railFront);

      // Back Catwalk Platform
      const catwalkBack = new THREE.Mesh(new THREE.BoxGeometry(24.0, 0.25, 2.2), this.matCatwalkSteel);
      catwalkBack.position.set(0, yS, -8.2);
      r101Group.add(catwalkBack);

      const railBack = new THREE.Mesh(new THREE.BoxGeometry(24.0, 1.1, 0.08), this.matYellowSafety);
      railBack.position.set(0, yS + 0.55, -9.2);
      r101Group.add(railBack);

      // Side Catwalk Connecting Corridors (West and East)
      [-11.5, 11.5].forEach((cX) => {
        const sideWalk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 18.0), this.matCatwalkSteel);
        sideWalk.position.set(cX, yS, 0);
        r101Group.add(sideWalk);

        const sideRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 18.0), this.matYellowSafety);
        sideRail.position.set(cX + (cX > 0 ? 0.8 : -0.8), yS + 0.55, 0);
        r101Group.add(sideRail);
      });
    });

    // =========================================================================
    // INDUSTRIAL ASCENDING & DESCENDING STAIRCASE TOWER (درج صعود ونزول للطوابق)
    // Positioned at West Wing (X = -13.5m) Connecting Ground -> Story 1 -> Story 2 -> Story 3 -> Roof
    // =========================================================================
    const stairTowerGroup = new THREE.Group();
    stairTowerGroup.name = 'R101_Staircase_Tower';

    // 4 Main Vertical Stair Tower Structural Columns
    [[-14.5, -3.5], [-12.5, -3.5], [-14.5, 3.5], [-12.5, 3.5]].forEach(([sx, sz]) => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.4, 23.0, 0.4), this.matAlloySteel);
      col.position.set(sx, 11.5, sz);
      stairTowerGroup.add(col);
    });

    // Stair Flights Connecting Stories (Ground Y=2m -> Story 1 Y=7m -> Story 2 Y=12m -> Story 3 Y=17m -> Roof Y=22m)
    const stairLevels = [
      { yBottom: 2.0, yTop: 7.0, zDir: 1 },    // Ground to Story 1 (Ascending +Z)
      { yBottom: 7.0, yTop: 12.0, zDir: -1 },  // Story 1 to Story 2 (Ascending -Z)
      { yBottom: 12.0, yTop: 17.0, zDir: 1 },  // Story 2 to Story 3 (Ascending +Z)
      { yBottom: 17.0, yTop: 22.0, zDir: -1 }  // Story 3 to Top Roof (Ascending -Z)
    ];

    stairLevels.forEach((flight, fIdx) => {
      const numSteps = 12;
      const stepH = (flight.yTop - flight.yBottom) / numSteps;
      const stepZ = (5.0 * flight.zDir) / numSteps;
      const startZ = flight.zDir > 0 ? -2.5 : 2.5;

      for (let s = 0; s < numSteps; s++) {
        const stepY = flight.yBottom + (s + 0.5) * stepH;
        const curZ = startZ + (s + 0.5) * stepZ;

        // Step Tread
        const tread = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.45), this.matCatwalkSteel);
        tread.position.set(-13.5, stepY, curZ);
        stairTowerGroup.add(tread);

        // Handrail Posts on stairs
        if (s % 3 === 0) {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.0, 0.06), this.matYellowSafety);
          post.position.set(-14.3, stepY + 0.5, curZ);
          stairTowerGroup.add(post);
        }
      }

      // Continuous Angled Safety Handrail Stringer for each flight
      const angle = Math.atan2(flight.yTop - flight.yBottom, 5.0);
      const railLen = Math.sqrt(Math.pow(flight.yTop - flight.yBottom, 2) + 25.0);
      const angledRail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, railLen, 8), this.matYellowSafety);
      angledRail.position.set(-14.3, (flight.yBottom + flight.yTop) / 2 + 0.6, 0);
      angledRail.rotation.x = flight.zDir > 0 ? -angle : angle;
      stairTowerGroup.add(angledRail);

      // Intermediate Rest Landing Platform at each story
      const landing = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 2.4), this.matCatwalkSteel);
      landing.position.set(-13.5, flight.yTop, flight.zDir > 0 ? 3.0 : -3.0);
      stairTowerGroup.add(landing);

      const landingRail = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 0.08), this.matYellowSafety);
      landingRail.position.set(-13.5, flight.yTop + 0.55, flight.zDir > 0 ? 4.1 : -4.1);
      stairTowerGroup.add(landingRail);
    });

    r101Group.add(stairTowerGroup);

    // Top Penthouse Arch Enclosure (Y = 21m to 24.5m)
    const arch = new THREE.Mesh(new THREE.BoxGeometry(21.0, 3.5, 13.0), this.matCarbonSteel);
    arch.position.set(0, 22.75, 0);
    r101Group.add(arch);

    // =========================================================================
    // 2 TUBE BANKS (200 CATALYST TUBES: 100 in North Bank + 100 in South Bank)
    // Carrying Preheated Natural Gas + HP Steam Mixture (795°C Effluent)
    // FULLY VISIBLE THROUGH THE OPEN FRONT TIERS
    // =========================================================================
    const tubeGeo = new THREE.CylinderGeometry(0.14, 0.14, 15.0, 12);
    const tubeMeshNorth = new THREE.InstancedMesh(tubeGeo, this.matCatalystTube, 100);
    const tubeMeshSouth = new THREE.InstancedMesh(tubeGeo, this.matCatalystTube, 100);

    const dummy = new THREE.Object3D();
    const xStart = -9.2;
    const xPitch = 18.4 / 99;

    for (let i = 0; i < 100; i++) {
      const curX = xStart + i * xPitch;

      // North Tube Bank (Z = -3.2m)
      dummy.position.set(curX, 13.0, -3.2);
      dummy.updateMatrix();
      tubeMeshNorth.setMatrixAt(i, dummy.matrix);

      // South Tube Bank (Z = +3.2m)
      dummy.position.set(curX, 13.0, 3.2);
      dummy.updateMatrix();
      tubeMeshSouth.setMatrixAt(i, dummy.matrix);
    }
    tubeMeshNorth.instanceMatrix.needsUpdate = true;
    tubeMeshSouth.instanceMatrix.needsUpdate = true;
    r101Group.add(tubeMeshNorth);
    r101Group.add(tubeMeshSouth);

    // Twin Overhead Arch Distribution Headers (North & South)
    [-3.2, 3.2].forEach((zH) => {
      const archHeader = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 20.0, 24), this.matCarbonSteel);
      archHeader.rotation.z = Math.PI / 2;
      archHeader.position.set(0, 24.5, zH);
      r101Group.add(archHeader);

      const tJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.8, 16), this.matFlange);
      tJoint.position.set(0, 24.5, zH);
      r101Group.add(tJoint);
    });

    // 200 Top Inlet Pigtails (Hairpin connections from overhead headers into each tube)
    for (let i = 0; i < 100; i += 2) {
      const curX = xStart + i * xPitch;
      [-3.2, 3.2].forEach((zH) => {
        const pigtail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.5, 8), this.matCatalystTube);
        pigtail.position.set(curX, 22.0, zH);
        r101Group.add(pigtail);
      });
    }

    // =========================================================================
    // 480 BURNERS DISTRIBUTED ACROSS THE 6 LAYERS AND WALLS A, B, C, D
    // (6 Layers x 4 Walls ABCD x 20 Burners = 480 Burners Total)
    // =========================================================================
    const burnerGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.5, 12);
    const flameGeo = new THREE.ConeGeometry(0.18, 1.0, 8);

    const totalBurners = 480;
    const burnerMesh = new THREE.InstancedMesh(burnerGeo, this.matAlloySteel, totalBurners);
    const flameMesh = new THREE.InstancedMesh(flameGeo, this.matBurnerFlame, totalBurners);

    // 4 Cell Walls in each layer:
    // Wall A: North Outer Wall (Z = -6.8m)
    // Wall B: North Inner Radiant Wall (Z = -1.6m)
    // Wall C: South Inner Radiant Wall (Z = +1.6m)
    // Wall D: South Outer Wall (Z = +6.8m)
    const wallZCoords = [-6.8, -1.6, 1.6, 6.8];
    let bCount = 0;

    layerElevations.forEach((yL) => {
      wallZCoords.forEach((zW, wIdx) => {
        const bPitch = 18.0 / 19;
        for (let b = 0; b < 20; b++) {
          const bX = -9.0 + b * bPitch;

          dummy.position.set(bX, yL, zW);
          // Orient flame inward toward catalyst tube banks
          if (wIdx === 0) {
            dummy.rotation.set(Math.PI / 2, 0, 0); // Wall A fires toward +Z
          } else if (wIdx === 1) {
            dummy.rotation.set(-Math.PI / 2, 0, 0); // Wall B fires toward -Z
          } else if (wIdx === 2) {
            dummy.rotation.set(Math.PI / 2, 0, 0); // Wall C fires toward +Z
          } else {
            dummy.rotation.set(-Math.PI / 2, 0, 0); // Wall D fires toward -Z
          }
          dummy.updateMatrix();
          burnerMesh.setMatrixAt(bCount, dummy.matrix);

          dummy.position.set(bX, yL, zW + (wIdx < 2 ? 0.3 : -0.3));
          dummy.updateMatrix();
          flameMesh.setMatrixAt(bCount, dummy.matrix);

          bCount++;
        }
      });
    });
    burnerMesh.instanceMatrix.needsUpdate = true;
    flameMesh.instanceMatrix.needsUpdate = true;
    r101Group.add(burnerMesh);
    r101Group.add(flameMesh);

    // =========================================================================
    // SUB-FLOOR EFFLUENT COLLECTION SYSTEM (مجمع أسفل المفاعل الأولي)
    // Under the furnace floor at Y = 3.8m: North & South Sub-headers converge
    // and the main Hot Transfer Line exits directly from the BOTTOM to R-103
    // =========================================================================
    // North and South Refractory Sub-Floor Collector Tunnels (Y = 3.8m)
    [-3.2, 3.2].forEach((zH) => {
      const tunnel = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 20.0, 24), this.matHotSteelEffluent);
      tunnel.rotation.z = Math.PI / 2;
      tunnel.position.set(0, 3.8, zH);
      r101Group.add(tunnel);

      // 200 Bottom Outlet Pigtails connecting catalyst tube bottoms into sub-floor collectors
      for (let i = 0; i < 100; i += 2) {
        const curX = xStart + i * xPitch;
        const outPigtail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8), this.matHotSteelEffluent);
        outPigtail.position.set(curX, 4.8, zH);
        r101Group.add(outPigtail);
      }
    });

    // Transverse Bottom Converging Manifold under East Floor
    const bottomConverger = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 7.0, 24), this.matHotSteelEffluent);
    bottomConverger.rotation.x = Math.PI / 2;
    bottomConverger.position.set(9.8, 3.8, 0);
    r101Group.add(bottomConverger);

    // Sub-floor exit connection nozzle flanged collar (World position: X = 11.2, Y = 5.8m, Z = -14.0m)
    const bottomExitNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 2.8, 24), this.matHotSteelEffluent);
    bottomExitNozzle.rotation.z = Math.PI / 2;
    bottomExitNozzle.position.set(11.2, 3.8, 0);
    r101Group.add(bottomExitNozzle);

    this.registerInteractive(r101Group, 'r-101');
    this.group.add(r101Group);
  }

  // 7. Dedicated Convection Zone Building (X = 0.0, Z = -46.0)
  // Stacked Exchangers (E-101 to E-105B) + Crossover Duct + ID Fans K-101A/B + 70m Stack ST-101
  private buildConvectionZoneBuildingAndIDFans() {
    const convGroup = new THREE.Group();
    convGroup.name = 'ConvectionZone_Building';
    convGroup.position.set(0.0, 2.0, -46.0);

    const pad = new THREE.Mesh(new THREE.BoxGeometry(22.0, 2.2, 18.0), this.matConcreteCurb);
    pad.position.set(0, 1.1, 0);
    convGroup.add(pad);

    [-8.0, 8.0].forEach((x) => {
      [-6.0, 6.0].forEach((z) => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(1.3, 44.0, 1.3), this.matAlloySteel);
        col.position.set(x, 23.0, z);
        convGroup.add(col);
      });
    });

    const ductCasing = new THREE.Mesh(new THREE.BoxGeometry(14.0, 38.0, 10.0), this.matCarbonSteel);
    ductCasing.position.set(0, 23.0, 0);
    convGroup.add(ductCasing);

    [14.0, 26.0, 38.0].forEach((y) => {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(16.0, 0.45, 12.0), this.matAlloySteel);
      frame.position.set(0, y, 0);
      convGroup.add(frame);

      const catwalk = new THREE.Mesh(new THREE.BoxGeometry(18.0, 0.25, 14.0), this.matCatwalkSteel);
      catwalk.position.set(0, y, 0);
      convGroup.add(catwalk);

      const rail = new THREE.Mesh(new THREE.BoxGeometry(18.2, 1.1, 14.2), this.matCatwalkSteel);
      rail.position.set(0, y + 0.55, 0);
      convGroup.add(rail);
    });

    for (let sy = 2.0; sy <= 38.0; sy += 4.0) {
      const stairTread = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 3.2), this.matCatwalkSteel);
      stairTread.position.set(-10.2, sy, 0);
      convGroup.add(stairTread);

      const stairRail = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.1, 0.08), this.matYellowSafety);
      stairRail.position.set(-10.2, sy + 0.55, 1.6);
      convGroup.add(stairRail);
    }

    const crossoverDuct = new THREE.Mesh(new THREE.BoxGeometry(10.0, 4.5, 26.0), this.matRefractoryBrick);
    crossoverDuct.position.set(0, 37.0, 15.0);
    convGroup.add(crossoverDuct);

    // 7 Vertically Stacked Heat Exchangers (وحدة فوق الثانية)
    const coilConfigs = [
      { id: 'e-101', tag: 'E-101', name: 'Mixed Feed Preheater (NG+Steam)', y: 37.0 },
      { id: 'e-102', tag: 'E-102', name: 'Process Air Preheater (Air to R-103)', y: 32.0 },
      { id: 'e-103a', tag: 'E-103A', name: 'HP Turbine Steam Superheater A', y: 27.0 },
      { id: 'e-103b', tag: 'E-103B', name: 'HP Turbine Steam Superheater B', y: 22.0 },
      { id: 'e-104', tag: 'E-104', name: 'Flue Gas Waste Heat Boiler (WHB)', y: 17.0 },
      { id: 'e-105a', tag: 'E-105A', name: 'B.F.W. Economizer Bank A', y: 12.0 },
      { id: 'e-105b', tag: 'E-105B', name: 'B.F.W. Economizer Bank B', y: 7.0 }
    ];

    coilConfigs.forEach((coil) => {
      const coilGroup = new THREE.Group();
      coilGroup.name = coil.id;
      coilGroup.position.set(0, coil.y, 0);

      [-7.2, 7.2].forEach((hx) => {
        const headerBox = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 6.0), this.matAlloySteel);
        headerBox.position.set(hx, 0, 0);
        coilGroup.add(headerBox);

        const header = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 5.5, 20), this.matCarbonSteel);
        header.rotation.x = Math.PI / 2;
        header.position.set(hx + (hx > 0 ? 0.8 : -0.8), 0, 0);
        coilGroup.add(header);

        const flange = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.45, 20), this.matFlange);
        flange.rotation.x = Math.PI / 2;
        flange.position.set(hx + (hx > 0 ? 0.8 : -0.8), 0, 3.0);
        coilGroup.add(flange);
      });

      for (let tz = -3.2; tz <= 3.2; tz += 1.6) {
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 14.2, 12), this.matPolishedSteel);
        tube.rotation.z = Math.PI / 2;
        tube.position.set(0, 0, tz);
        coilGroup.add(tube);
      }

      this.registerInteractive(coilGroup, coil.id);
      convGroup.add(coilGroup);
    });

    const breeching = new THREE.Mesh(new THREE.BoxGeometry(13.0, 3.8, 8.5), this.matAlloySteel);
    breeching.position.set(0, 4.0, -8.5);
    convGroup.add(breeching);

    // K-101A (Turbine Driven - Left, X = -8.0, Z = -66.0 World)
    const k101aGroup = new THREE.Group();
    k101aGroup.position.set(-8.0, 0, -20.0);

    const padA = new THREE.Mesh(new THREE.BoxGeometry(8.5, 1.8, 7.0), this.matConcreteCurb);
    padA.position.set(0, 0.9, 0);
    k101aGroup.add(padA);

    const scrollA = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 2.2, 24), this.matCarbonSteel);
    scrollA.rotation.x = Math.PI / 2;
    scrollA.position.set(0, 3.8, 0);
    k101aGroup.add(scrollA);

    const turbA = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.7, 3.2, 20), this.matAlloySteel);
    turbA.rotation.z = Math.PI / 2;
    turbA.position.set(-3.2, 3.8, 0);
    k101aGroup.add(turbA);

    const shaftA = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 2.0, 16), this.matPolishedSteel);
    shaftA.rotation.z = Math.PI / 2;
    shaftA.position.set(-1.2, 3.8, 0);
    k101aGroup.add(shaftA);
    this.rotatingShafts.push(shaftA);

    const ductA = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 8.0, 16), this.matAlloySteel);
    ductA.rotation.x = Math.PI / 2;
    ductA.position.set(0, 3.8, 4.5);
    k101aGroup.add(ductA);

    this.registerInteractive(k101aGroup, 'k-101a');
    convGroup.add(k101aGroup);

    // K-101B (Electric Motor Driven - Right, X = +8.0, Z = -66.0 World)
    const k101bGroup = new THREE.Group();
    k101bGroup.position.set(8.0, 0, -20.0);

    const padB = new THREE.Mesh(new THREE.BoxGeometry(8.5, 1.8, 7.0), this.matConcreteCurb);
    padB.position.set(0, 0.9, 0);
    k101bGroup.add(padB);

    const scrollB = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 2.2, 24), this.matCarbonSteel);
    scrollB.rotation.x = Math.PI / 2;
    scrollB.position.set(0, 3.8, 0);
    k101bGroup.add(scrollB);

    const motorB = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.6, 2.6), this.matAlloySteel);
    motorB.position.set(3.2, 3.8, 0);
    k101bGroup.add(motorB);

    const shaftB = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 2.0, 16), this.matPolishedSteel);
    shaftB.rotation.z = Math.PI / 2;
    shaftB.position.set(1.2, 3.8, 0);
    k101bGroup.add(shaftB);
    this.rotatingShafts.push(shaftB);

    const ductB = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 8.0, 16), this.matAlloySteel);
    ductB.rotation.x = Math.PI / 2;
    ductB.position.set(0, 3.8, 4.5);
    k101bGroup.add(ductB);

    this.registerInteractive(k101bGroup, 'k-101b');
    convGroup.add(k101bGroup);

    const dischargeManifold = new THREE.Mesh(new THREE.BoxGeometry(18.0, 2.4, 2.8), this.matAlloySteel);
    dischargeManifold.position.set(0, 5.2, -23.0);
    convGroup.add(dischargeManifold);

    // STACK ST-101 (World Z = -78.0)
    const stackGroup = new THREE.Group();
    stackGroup.name = 'Primary_Flue_Stack_101';
    stackGroup.position.set(0, 0, -32.0);

    const stackPlinth = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 5.8, 3.0, 8), this.matConcreteCurb);
    stackPlinth.position.set(0, 1.5, 0);
    stackGroup.add(stackPlinth);

    // Open-Ended Stack Column (68m High)
    const stack = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 3.6, 68.0, 32, 1, true), this.matCarbonSteel);
    stack.position.set(0, 37.0, 0);
    stackGroup.add(stack);

    // Inner Dark Refractory Soot Lining
    const stackInner = new THREE.Mesh(new THREE.CylinderGeometry(2.08, 3.48, 68.0, 32, 1, true), this.matRefractoryBrick);
    stackInner.position.set(0, 37.0, 0);
    stackGroup.add(stackInner);

    // Open Top Crown Flange / Rim Ring (الفوهة المفتوحة العلوية)
    const stackTopRim = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.14, 16, 32), this.matAlloySteel);
    stackTopRim.rotation.x = Math.PI / 2;
    stackTopRim.position.set(0, 71.0, 0);
    stackGroup.add(stackTopRim);

    // Hot Flue Gas Thermal Exhaust Heat Plume (حرارة وغازات العادم المنطلقة من الفوهة)
    const fluePlumeGeo = new THREE.ConeGeometry(2.6, 12.0, 16, 1, true);
    const fluePlumeMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const fluePlume = new THREE.Mesh(fluePlumeGeo, fluePlumeMat);
    fluePlume.position.set(0, 77.0, 0);
    stackGroup.add(fluePlume);

    const damperBox = new THREE.Mesh(new THREE.BoxGeometry(4.8, 4.0, 4.8), this.matAlloySteel);
    damperBox.position.set(0, 5.0, 0);
    stackGroup.add(damperBox);

    [15.0, 28.0, 41.0, 54.0, 66.0].forEach((y) => {
      const plat = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 0.35, 24), this.matCatwalkSteel);
      plat.position.set(0, y, 0);
      stackGroup.add(plat);

      const rail = new THREE.Mesh(new THREE.CylinderGeometry(4.55, 4.55, 1.1, 24, 1, true), this.matYellowSafety);
      rail.position.set(0, y + 0.55, 0);
      stackGroup.add(rail);
    });

    [-1.8, 1.8].forEach((bx) => {
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
      beacon.position.set(bx, 71.5, 0);
      stackGroup.add(beacon);
    });

    this.registerInteractive(stackGroup, 'st-101');
    convGroup.add(stackGroup);

    this.group.add(convGroup);
  }

  // 8. K-302 Process Air Compressor Multi-Stage Train (X = 32.0, Z = -46.0)
  private buildProcessAirCompressorK302() {
    const k302Group = new THREE.Group();
    k302Group.position.set(32.0, 2.0, -46.0);

    const plinth = new THREE.Mesh(new THREE.BoxGeometry(16.0, 2.0, 9.0), this.matConcreteCurb);
    plinth.position.set(0, 1.0, 0);
    k302Group.add(plinth);

    const turb = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.3, 4.8, 24), this.matAlloySteel);
    turb.rotation.z = Math.PI / 2;
    turb.position.set(-4.8, 3.5, 0);
    k302Group.add(turb);

    [-0.5, 4.4].forEach((xPos) => {
      const compCase = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 4.2, 24), this.matCarbonSteel);
      compCase.rotation.z = Math.PI / 2;
      compCase.position.set(xPos, 3.5, 0);
      k302Group.add(compCase);
    });

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 13.5, 16), this.matPolishedSteel);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(0, 3.5, 0);
    k302Group.add(shaft);
    this.rotatingShafts.push(shaft);

    this.addNozzleWithFlange(k302Group, new THREE.Vector3(4.4, 5.6, 0), new THREE.Vector3(0, 1, 0), 0.75, 2.0);

    this.registerInteractive(k302Group, 'k-302');
    this.group.add(k302Group);
  }

  // 9. R-103 Secondary Reformer Autothermal Reactor (X = 32.0, Z = -14.0)
  private buildSecondaryReformerR103() {
    const r103Group = new THREE.Group();
    r103Group.position.set(32.0, 2.0, -14.0);

    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 6.0, 2.8, 8), this.matConcretePad);
    plinth.position.set(0, 1.4, 0);
    r103Group.add(plinth);

    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 5.5, 32), this.matAlloySteel);
    skirt.position.set(0, 5.5, 0);
    r103Group.add(skirt);

    const vessel = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 18.0, 32), this.matHotSteelEffluent);
    vessel.position.set(0, 17.2, 0);
    r103Group.add(vessel);

    const cone = new THREE.Mesh(new THREE.ConeGeometry(4.6, 6.5, 32), this.matHotSteelEffluent);
    cone.position.set(0, 29.5, 0);
    r103Group.add(cone);

    const airNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 3.4, 20), this.matHotSteelEffluent);
    airNozzle.position.set(0, 34.2, 0);
    r103Group.add(airNozzle);

    [11.0, 17.0, 23.0, 28.0].forEach((y) => {
      const jacketRing = new THREE.Mesh(new THREE.TorusGeometry(4.85, 0.14, 8, 32), this.matCarbonSteel);
      jacketRing.rotation.x = Math.PI / 2;
      jacketRing.position.set(0, y, 0);
      r103Group.add(jacketRing);

      const plat = new THREE.Mesh(new THREE.CylinderGeometry(5.9, 5.9, 0.35, 24), this.matCatwalkSteel);
      plat.position.set(0, y, 0);
      r103Group.add(plat);

      const rail = new THREE.Mesh(new THREE.CylinderGeometry(5.95, 5.95, 1.1, 24, 1, true), this.matYellowSafety);
      rail.position.set(0, y + 0.55, 0);
      r103Group.add(rail);
    });

    // Upper side inlet nozzle for Hot Transfer Line from R-101 sub-floor (local Y = 27.0m, world Y = 29.0m)
    // "يدخل من الاعلى بس مو كلش" - على المخروط العلوي للخلط مع هواء العمليات
    this.addNozzleWithFlange(r103Group, new THREE.Vector3(-4.2, 27.0, 0), new THREE.Vector3(-1, 0, 0), 1.2, 2.4);
    // Refractory-lined middle outlet neck exiting strictly from the vertical mid-height of R-103
    // ("خط الغاز الطالع من R103 يجب ان يطلع من منتصف R103 و ليس من اسفله") - local Y = 17.2m, world Y = 19.2m
    const r103OutletNeck = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.25, 1.0, 24), this.matHotSteelEffluent);
    r103OutletNeck.rotation.z = Math.PI / 2;
    r103OutletNeck.position.set(4.8, 17.2, 0);
    r103Group.add(r103OutletNeck);

    const r103OutletFlange = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.25, 24), this.matFlange);
    r103OutletFlange.rotation.z = Math.PI / 2;
    r103OutletFlange.position.set(5.35, 17.2, 0);
    r103Group.add(r103OutletFlange);

    this.registerInteractive(r103Group, 'r-103');
    this.group.add(r103Group);
  }

  // 10. E-108 Reformed Gas Shell & Tube Waste Heat Boiler & V-102A Elevated Steam Drum (X = 58.0, Z = -14.0)
  // تصميم هندسي تفصيلي متكامل من نوع القشرة والأنابيب (Shell and Tube WHB):
  // - يدخل غاز الإصلاح الثانوي الحار (980°C) مباشرة داخل أنابيب الغلاية (Tube Side)
  // - يتبخر ماء المراجل في القشرة المحيطة بالأنابيب (Shell Side) لتوليد البخار عالي الضغط
  // - مقطع عرضي هندسي مكشوف (Cutaway Window) لإظهار حزمة الأنابيب الداخلية وسطح لوح الأنابيب وصفائح التوجيه Baffles
  private buildWasteHeatBoilerE108AndSteamDrumV102A() {
    const e108Group = new THREE.Group();
    e108Group.position.set(58.0, 2.0, -14.0);

    // 1. Heavy Reinforced Concrete Saddles with Steel Curved Cradles
    [-4.0, 4.0].forEach((x) => {
      const saddleConcrete = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 6.6), this.matConcreteCurb);
      saddleConcrete.position.set(x, 1.3, 0);
      e108Group.add(saddleConcrete);

      const saddleSolePlate = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.35, 6.8), this.matFlange);
      saddleSolePlate.position.set(x, 2.7, 0);
      e108Group.add(saddleSolePlate);

      // Curved steel cradle matching shell radius (2.75m)
      const cradle = new THREE.Mesh(
        new THREE.CylinderGeometry(2.8, 2.8, 2.1, 24, 1, false, Math.PI * 0.75, Math.PI * 0.5),
        this.matAlloySteel
      );
      cradle.rotation.z = Math.PI / 2;
      cradle.position.set(x, 5.2, 0);
      e108Group.add(cradle);
    });

    // 2. Tube-Side Conical Inlet Channel Head (غرفة توزيع الغاز لمدخل الأنابيب - Conical Channel Bonnet)
    // يدخل الغاز الحار (980°C) من خط النقل P-110 مباشرة بدون فلنجات عشوائية
    const inletCone = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 1.05, 2.0, 32), this.matHotSteelEffluent);
    inletCone.rotation.z = Math.PI / 2;
    inletCone.position.set(-7.0, 5.2, 0);
    e108Group.add(inletCone);

    // Inlet neck collar (local x = -8.0, world X = 50.0, Y = 7.2) receiving P-110
    const inletNeck = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.4, 32), this.matHotSteelEffluent);
    inletNeck.rotation.z = Math.PI / 2;
    inletNeck.position.set(-8.0, 5.2, 0);
    e108Group.add(inletNeck);

    // 3. Stationary Inlet Tubesheet & Girth Bolting Ring (لوح تثبيت الأنابيب الأمامي)
    const inletTubesheetFlange = new THREE.Mesh(new THREE.CylinderGeometry(2.95, 2.95, 0.45, 32), this.matFlange);
    inletTubesheetFlange.rotation.z = Math.PI / 2;
    inletTubesheetFlange.position.set(-6.0, 5.2, 0);
    e108Group.add(inletTubesheetFlange);

    const tubesheetFace = new THREE.Mesh(new THREE.CylinderGeometry(2.65, 2.65, 0.15, 32), this.matPolishedSteel);
    tubesheetFace.rotation.z = Math.PI / 2;
    tubesheetFace.position.set(-5.9, 5.2, 0);
    e108Group.add(tubesheetFace);

    // 4. Heavy Cylindrical Boiler Shell with Cutaway Viewing Window
    // (قشرة المرجل الخارجية مع مقطع رؤية هندسي مكشوف لإبراز الأنابيب وحزمة التيوب الداخلية)
    const shellCutaway = new THREE.Mesh(
      new THREE.CylinderGeometry(2.7, 2.7, 11.6, 36, 1, false, Math.PI * 0.4, Math.PI * 1.5),
      this.matCarbonSteel
    );
    shellCutaway.rotation.z = Math.PI / 2;
    shellCutaway.position.set(0, 5.2, 0);
    e108Group.add(shellCutaway);

    // Beveled Cutaway Edge Highlight (إطار حافة المقطع لإبراز سماكة جدار القشرة الفولاذية)
    [-5.8, 5.8].forEach((cx) => {
      const cutEdgeRing = new THREE.Mesh(
        new THREE.CylinderGeometry(2.72, 2.72, 0.25, 36, 1, false, Math.PI * 1.9, Math.PI * 0.5),
        this.matFlange
      );
      cutEdgeRing.rotation.z = Math.PI / 2;
      cutEdgeRing.position.set(cx, 5.2, 0);
      e108Group.add(cutEdgeRing);
    });

    // Shell Reinforcing Girth Stiffener Rings (حلقات تقوية أسطوانة القشرة)
    [-4.5, -2.2, 0, 2.2, 4.5].forEach((rx) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.74, 0.07, 8, 36), this.matAlloySteel);
      ring.rotation.y = Math.PI / 2;
      ring.position.set(rx, 5.2, 0);
      e108Group.add(ring);
    });

    // ASME Boiler Nameplate on Shell
    const nameplate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 1.0), this.matFlange);
    nameplate.position.set(0, 5.2, 2.72);
    e108Group.add(nameplate);

    // 5. Internal Boiler Tube Bundle (حزمة أنابيب الغلاية الداخلية - Tube Bundle)
    // 44 high-temperature boiler fire tubes (Inconel / Cr-Mo alloy) carrying 980°C syngas
    const tubeGeo = new THREE.CylinderGeometry(0.065, 0.065, 11.6, 12);
    tubeGeo.rotateZ(Math.PI / 2);

    const tubeOffsets: [number, number][] = [
      // Center & Inner Ring
      [0, 0], [0.35, 0], [-0.35, 0], [0, 0.35], [0, -0.35],
      [0.25, 0.25], [-0.25, 0.25], [0.25, -0.25], [-0.25, -0.25],
      // Ring 2 (r ~ 0.7 - 0.9m)
      [0.7, 0], [-0.7, 0], [0, 0.7], [0, -0.7],
      [0.5, 0.5], [-0.5, 0.5], [0.5, -0.5], [-0.5, -0.5],
      [0.75, 0.35], [-0.75, 0.35], [0.75, -0.35], [-0.75, -0.35],
      [0.35, 0.75], [-0.35, 0.75], [0.35, -0.75], [-0.35, -0.75],
      // Ring 3 (r ~ 1.2 - 1.5m)
      [1.2, 0], [-1.2, 0], [0, 1.2], [0, -1.2],
      [0.9, 0.8], [-0.9, 0.8], [0.9, -0.8], [-0.9, -0.8],
      [1.3, 0.45], [-1.3, 0.45], [1.3, -0.45], [-1.3, -0.45],
      [0.45, 1.3], [-0.45, 1.3], [0.45, -1.3], [-0.45, -1.3],
      // Ring 4 (r ~ 1.7 - 1.9m)
      [1.65, 0], [-1.65, 0], [0, 1.65], [0, -1.65],
      [1.25, 1.1], [-1.25, 1.1], [1.25, -1.1], [-1.25, -1.1]
    ];

    tubeOffsets.forEach(([dy, dz]) => {
      const tubeMesh = new THREE.Mesh(tubeGeo, this.matPolishedSteel);
      tubeMesh.position.set(0, 5.2 + dy, dz);
      e108Group.add(tubeMesh);
    });

    // 6. Internal Segmental Baffle Plates & Tube Support Plates (صفائح الدعم والتوجيه Baffles)
    [-3.8, -1.4, 1.2, 3.6].forEach((bx, bIdx) => {
      const baffleGeo = new THREE.CylinderGeometry(2.38, 2.38, 0.08, 28, 1, false, bIdx % 2 === 0 ? 0 : Math.PI, Math.PI * 1.5);
      baffleGeo.rotateZ(Math.PI / 2);
      const baffle = new THREE.Mesh(baffleGeo, this.matFlange);
      baffle.position.set(bx, 5.2, 0);
      e108Group.add(baffle);
    });

    // Longitudinal Tie Rods holding baffles
    [[1.8, 0], [-1.8, 0], [0, -1.8]].forEach(([ty, tz]) => {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 11.6, 8), this.matFlange);
      rod.rotation.z = Math.PI / 2;
      rod.position.set(0, 5.2 + ty, tz);
      e108Group.add(rod);
    });

    // 7. Shell Nozzles: Steam-Water Risers (Center) & BFW Downcomers (Ends)
    // Top Riser Nozzles on Shell to V-102A (y = 7.9m, z = 0)
    [-2.0, 0, 2.0].forEach((rx) => {
      const riserNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.65, 16), this.matFlange);
      riserNozzle.position.set(rx, 7.9, 0);
      e108Group.add(riserNozzle);
    });

    // Bottom Downcomer Nozzles on Shell from V-102A (y = 2.5m, z = 0)
    [-4.2, 4.2].forEach((dx) => {
      const downNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.65, 16), this.matFlange);
      downNozzle.position.set(dx, 2.5, 0);
      e108Group.add(downNozzle);
    });

    // Bottom Continuous Blowdown Drain Nozzle (X = 0, Y = 2.4, Z = 0)
    const blowdownNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.65, 12), this.matFlange);
    blowdownNozzle.position.set(0, 2.4, 0);
    e108Group.add(blowdownNozzle);

    const blowdownValve = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), this.matFlange);
    blowdownValve.position.set(0, 2.0, 0);
    e108Group.add(blowdownValve);

    const blowdownWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16), this.matYellowSafety);
    blowdownWheel.rotation.x = Math.PI / 2;
    blowdownWheel.position.set(0, 2.0, 0.35);
    e108Group.add(blowdownWheel);

    // 8. Tube-Side Outlet Channel Head & Rear Stationary Tubesheet (X = +6.0 to +7.8)
    // Cooled gas (365°C) exits through tubes into rear bonnet leading to R-104
    const outletTubesheetFlange = new THREE.Mesh(new THREE.CylinderGeometry(2.95, 2.95, 0.45, 32), this.matFlange);
    outletTubesheetFlange.rotation.z = Math.PI / 2;
    outletTubesheetFlange.position.set(6.0, 5.2, 0);
    e108Group.add(outletTubesheetFlange);

    const outletBonnet = new THREE.Mesh(new THREE.SphereGeometry(2.7, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), this.matHotSteelEffluent);
    outletBonnet.rotation.z = -Math.PI / 2;
    outletBonnet.position.set(6.25, 5.2, 0);
    e108Group.add(outletBonnet);

    const outletNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.1, 24), this.matHotSteelEffluent);
    outletNozzle.rotation.z = Math.PI / 2;
    outletNozzle.position.set(7.3, 5.2, 0);
    e108Group.add(outletNozzle);

    const outletFlange = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.25, 24), this.matFlange);
    outletFlange.rotation.z = Math.PI / 2;
    outletFlange.position.set(7.8, 5.2, 0);
    e108Group.add(outletFlange);

    this.registerInteractive(e108Group, 'e-108');
    this.group.add(e108Group);

    // =========================================================================
    // 2. E-109 CONVERTED GAS SHELL & TUBE WASTE HEAT BOILER (X = 58.0, Z = -6.0)
    // غلاية غاز التحويل E-109 مجمعة جنباً إلى جنب مع E-108 وتشترك معها في طبلة البخار V-102A
    // Tubes: Hot Converted Gas from R-104 (433°C -> 320°C) to E-107 Tubes
    // Shell: High Pressure Boiling Water generating 65 bar Steam to V-102A
    // =========================================================================
    const e109Group = new THREE.Group();
    e109Group.position.set(58.0, 2.0, -6.0); // Exactly 8 meters parallel to E-108 (Z = -14.0)

    // Concrete Saddles for E-109 Shell
    [-3.2, 3.2].forEach((sx) => {
      const saddle109 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.4, 5.2), this.matConcreteCurb);
      saddle109.position.set(sx, 1.2, 0);
      e109Group.add(saddle109);

      const plate109 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.3, 5.4), this.matFlange);
      plate109.position.set(sx, 2.5, 0);
      e109Group.add(plate109);
    });

    // E-109 Boiler Shell (Diameter 4.2m, Length 10.4m)
    const e109Shell = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 10.4, 32), this.matCarbonSteel);
    e109Shell.rotation.z = Math.PI / 2;
    e109Shell.position.set(0, 4.2, 0);
    e109Group.add(e109Shell);

    // Dished Elliptical Channel Heads & Flanges
    [-5.2, 5.2].forEach((hx) => {
      const head = new THREE.Mesh(new THREE.SphereGeometry(2.1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), this.matCarbonSteel);
      head.rotation.z = hx < 0 ? Math.PI / 2 : -Math.PI / 2;
      head.position.set(hx, 4.2, 0);
      e109Group.add(head);

      const flange = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.45, 28), this.matFlange);
      flange.rotation.z = Math.PI / 2;
      flange.position.set(hx * 0.96, 4.2, 0);
      e109Group.add(flange);
    });

    // East Process Gas Inlet Nozzle from R-104 @ 433°C (World X = 64.5, Y = 6.2, Z = -6.0)
    this.addNozzleWithFlange(e109Group, new THREE.Vector3(6.5, 4.2, 0), new THREE.Vector3(1, 0, 0), 0.75, 1.8);

    // West Process Gas Outlet Nozzle to E-107 @ 320°C (World X = 51.5, Y = 6.2, Z = -6.0)
    this.addNozzleWithFlange(e109Group, new THREE.Vector3(-6.5, 4.2, 0), new THREE.Vector3(-1, 0, 0), 0.7, 1.8);

    // Shell Top Riser Nozzles (Center) & Bottom Downcomer Nozzles (Ends) for E-109
    [-1.8, 0, 1.8].forEach((rx) => {
      const riserNozzle109 = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.65, 16), this.matFlange);
      riserNozzle109.position.set(rx, 6.3, 0);
      e109Group.add(riserNozzle109);
    });

    [-3.8, 3.8].forEach((dx) => {
      const downNozzle109 = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.65, 16), this.matFlange);
      downNozzle109.position.set(dx, 2.1, 0);
      e109Group.add(downNozzle109);
    });

    // Bottom Continuous Blowdown Drain on E-109 Shell
    const bdNozzle109 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.6, 12), this.matFlange);
    bdNozzle109.position.set(0, 1.9, 0);
    e109Group.add(bdNozzle109);

    // ASME Boiler Nameplate on E-109 Shell
    const nameplate109 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 1.0), this.matFlange);
    nameplate109.position.set(0, 4.2, 2.15);
    e109Group.add(nameplate109);

    this.registerInteractive(e109Group, 'e-109');
    this.group.add(e109Group);

    // =========================================================================
    // 3. SINGLE UNIFIED ELEVATED STEAM DRUM V-102A & STRUCTURAL TOWER
    // (طبلة بخار موحدة واحدة V-102A فوق كل من E-108 و E-109 بضغط 65 bar وحرارة 280°C)
    // Centered at X = 58.0, Y = 2.0, Z = -10.0 (Directly between E-108 at Z=-14 and E-109 at Z=-6)
    // =========================================================================
    const v102aGroup = new THREE.Group();
    v102aGroup.name = 'Unified_Steam_Drum_V102A_Structure';
    v102aGroup.position.set(58.0, 2.0, -10.0);

    // 6 Heavy Structural Steel Columns (Height 18m) spanning across BOTH boilers
    [-5.4, 5.4].forEach((x) => {
      [-6.5, 0.0, 6.5].forEach((z) => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.95, 18.0, 0.95), this.matAlloySteel);
        col.position.set(x, 9.0, z);
        v102aGroup.add(col);

        const basePlate = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.35, 1.3), this.matFlange);
        basePlate.position.set(x, 0.2, z);
        v102aGroup.add(basePlate);
      });
    });

    // Top Platform Structural Steel Beams under Drum (Y = 16.2m)
    [-5.4, 5.4].forEach((bx) => {
      const beamZ = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.75, 14.0), this.matAlloySteel);
      beamZ.position.set(bx, 16.2, 0);
      v102aGroup.add(beamZ);
    });
    [-6.5, 0.0, 6.5].forEach((bz) => {
      const beamX = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.75, 0.55), this.matAlloySteel);
      beamX.position.set(0, 16.2, bz);
      v102aGroup.add(beamX);
    });

    // Intermediate Tie Beams (Y = 8.5m)
    [-5.4, 5.4].forEach((bx) => {
      const tieZ = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 14.0), this.matAlloySteel);
      tieZ.position.set(bx, 8.5, 0);
      v102aGroup.add(tieZ);
    });
    [-6.5, 0.0, 6.5].forEach((bz) => {
      const tieX = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.5, 0.4), this.matAlloySteel);
      tieX.position.set(0, 8.5, bz);
      v102aGroup.add(tieX);
    });

    // Full Upper Operating Catwalk Platform (Grating Deck spanning across both boilers)
    const topDeck = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.3, 14.8), this.matCatwalkSteel);
    topDeck.position.set(0, 16.2, 0);
    v102aGroup.add(topDeck);

    // OSHA Yellow Perimeter Handrails
    const topRail = new THREE.Mesh(new THREE.BoxGeometry(13.7, 1.1, 14.9), this.matYellowSafety);
    topRail.position.set(0, 16.85, 0);
    v102aGroup.add(topRail);

    // Intermediate Maintenance Walkway
    const midDeck = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.25, 14.6), this.matCatwalkSteel);
    midDeck.position.set(0, 8.5, 0);
    v102aGroup.add(midDeck);

    const midRail = new THREE.Mesh(new THREE.BoxGeometry(13.7, 1.1, 14.7), this.matYellowSafety);
    midRail.position.set(0, 9.15, 0);
    v102aGroup.add(midRail);

    // Caged Access Ladder (West Side)
    const ladderWest = new THREE.Mesh(new THREE.BoxGeometry(0.15, 16.5, 0.6), this.matCatwalkSteel);
    ladderWest.position.set(-6.0, 8.25, 3.0);
    v102aGroup.add(ladderWest);

    // UNIFIED HIGH-PRESSURE STEAM DRUM VESSEL V-102A (طبلة البخار عالي الضغط المشتركة 65 bar / 280°C)
    // Spanning Length 13.0m, Radius 1.7m along X axis at Y = 18.0m (World Y = 20.0, Z = -10.0)
    const steamDrum = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 13.0, 32), this.matCarbonSteel);
    steamDrum.rotation.z = Math.PI / 2;
    steamDrum.position.set(0, 18.0, 0);
    steamDrum.name = 'Steam_Drum_V102A';
    v102aGroup.add(steamDrum);
    this.claddingMeshes.push(steamDrum);

    // Dished Elliptical Heads & Girth Rings
    [-6.5, 6.5].forEach((hx) => {
      const head = new THREE.Mesh(new THREE.SphereGeometry(1.7, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), this.matCarbonSteel);
      head.rotation.z = hx < 0 ? Math.PI / 2 : -Math.PI / 2;
      head.position.set(hx, 18.0, 0);
      v102aGroup.add(head);

      const stiffRing = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.75, 0.3, 32), this.matFlange);
      stiffRing.rotation.z = Math.PI / 2;
      stiffRing.position.set(hx * 0.95, 18.0, 0);
      v102aGroup.add(stiffRing);
    });

    // Inspection Manway on East head
    const manway102A = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.55, 16), this.matFlange);
    manway102A.rotation.z = Math.PI / 2;
    manway102A.position.set(7.3, 18.0, 0);
    v102aGroup.add(manway102A);

    // Combined Reinforced Concrete Foundation Pad for Bay (E-108, E-109 & V-102A)
    const combinedBayPad = new THREE.Mesh(new THREE.BoxGeometry(18.0, 0.6, 16.0), this.matConcreteCurb);
    combinedBayPad.position.set(0, -0.1, 0);
    v102aGroup.add(combinedBayPad);

    const curbStripe = new THREE.Mesh(new THREE.BoxGeometry(18.2, 0.08, 16.2), this.matYellowSafety);
    curbStripe.position.set(0, 0.22, 0);
    v102aGroup.add(curbStripe);

    // -------------------------------------------------------------------------
    // THERMOSIPHON RISERS & DOWNCOMERS CONNECTING BOTH BOILERS TO SINGLE V-102A
    // Organized with zero tangling: Risers in center, Downcomers at outer ends
    // -------------------------------------------------------------------------
    // 1. Natural Circulation Circuit connecting E-108 (located at local Z = -4.0)
    // Downcomers (outer ends x = -4.2 and +4.2): Supply cool boiler water from V-102A bottom down to E-108 bottom shell
    [-4.2, 4.2].forEach((x) => {
      this.addNozzleWithFlange(v102aGroup, new THREE.Vector3(x, 16.3, -1.2), new THREE.Vector3(0, -1, 0), 0.5, 1.1);

      // Vertical downcomer leg
      const vertDown = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 12.7, 16), this.matAluminumCladding);
      vertDown.position.set(x, 9.95, -1.2);
      v102aGroup.add(vertDown);
      this.claddingMeshes.push(vertDown);

      const elbow1 = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16), this.matAluminumCladding);
      elbow1.position.set(x, 3.6, -1.2);
      v102aGroup.add(elbow1);
      this.claddingMeshes.push(elbow1);

      // Horizontal run along Z into E-108 bottom manifold
      const horizDown = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 2.8, 16), this.matAluminumCladding);
      horizDown.rotation.x = Math.PI / 2;
      horizDown.position.set(x, 3.6, -2.6);
      v102aGroup.add(horizDown);
      this.claddingMeshes.push(horizDown);

      const elbow2 = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16), this.matAluminumCladding);
      elbow2.position.set(x, 3.6, -4.0);
      v102aGroup.add(elbow2);
      this.claddingMeshes.push(elbow2);

      const dropToShell = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 1.1, 16), this.matAluminumCladding);
      dropToShell.position.set(x, 3.05, -4.0);
      v102aGroup.add(dropToShell);
      this.claddingMeshes.push(dropToShell);

      const flangeBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.2, 16), this.matFlange);
      flangeBottom.position.set(x, 2.5, -4.0);
      v102aGroup.add(flangeBottom);
    });

    // Risers (central section x = -2.0, 0.0, +2.0): Return steam/water boiling mix from E-108 top shell into V-102A
    [-2.0, 0.0, 2.0].forEach((x) => {
      // Vertical riser leg from E-108 top shell
      const vertRiser = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 6.9, 16), this.matAluminumCladding);
      vertRiser.position.set(x, 11.35, -4.0);
      v102aGroup.add(vertRiser);
      this.claddingMeshes.push(vertRiser);

      const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16), this.matAluminumCladding);
      elbow.position.set(x, 14.8, -4.0);
      v102aGroup.add(elbow);
      this.claddingMeshes.push(elbow);

      // Angled branch directly entering V-102A drum bottom/side
      const angledRiser = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 3.02, 16), this.matAluminumCladding);
      angledRiser.rotation.x = Math.atan2(2.5, 1.7);
      angledRiser.position.set(x, 15.65, -2.75);
      v102aGroup.add(angledRiser);
      this.claddingMeshes.push(angledRiser);

      this.addNozzleWithFlange(v102aGroup, new THREE.Vector3(x, 16.5, -1.5), new THREE.Vector3(0, -1, 1).normalize(), 0.5, 1.1);
    });

    // 2. Natural Circulation Circuit connecting E-109 (located at local Z = +4.0)
    // Downcomers (outer ends x = -3.8 and +3.8): Supply cool boiler water from V-102A bottom down to E-109 bottom shell
    [-3.8, 3.8].forEach((x) => {
      this.addNozzleWithFlange(v102aGroup, new THREE.Vector3(x, 16.3, 1.2), new THREE.Vector3(0, -1, 0), 0.48, 1.1);

      // Vertical downcomer leg
      const vertDown = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 13.1, 16), this.matAluminumCladding);
      vertDown.position.set(x, 9.75, 1.2);
      v102aGroup.add(vertDown);
      this.claddingMeshes.push(vertDown);

      const elbow1 = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), this.matAluminumCladding);
      elbow1.position.set(x, 3.2, 1.2);
      v102aGroup.add(elbow1);
      this.claddingMeshes.push(elbow1);

      // Horizontal run along Z into E-109 bottom manifold
      const horizDown = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 2.8, 16), this.matAluminumCladding);
      horizDown.rotation.x = Math.PI / 2;
      horizDown.position.set(x, 3.2, 2.6);
      v102aGroup.add(horizDown);
      this.claddingMeshes.push(horizDown);

      const elbow2 = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), this.matAluminumCladding);
      elbow2.position.set(x, 3.2, 4.0);
      v102aGroup.add(elbow2);
      this.claddingMeshes.push(elbow2);

      const dropToShell = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.1, 16), this.matAluminumCladding);
      dropToShell.position.set(x, 2.65, 4.0);
      v102aGroup.add(dropToShell);
      this.claddingMeshes.push(dropToShell);

      const flangeBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.2, 16), this.matFlange);
      flangeBottom.position.set(x, 2.1, 4.0);
      v102aGroup.add(flangeBottom);
    });

    // Risers (central section x = -1.8, 0.0, +1.8): Return steam/water boiling mix from E-109 top shell into V-102A
    [-1.8, 0.0, 1.8].forEach((x) => {
      // Vertical riser leg from E-109 top shell
      const vertRiser = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 8.5, 16), this.matAluminumCladding);
      vertRiser.position.set(x, 10.55, 4.0);
      v102aGroup.add(vertRiser);
      this.claddingMeshes.push(vertRiser);

      const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), this.matAluminumCladding);
      elbow.position.set(x, 14.8, 4.0);
      v102aGroup.add(elbow);
      this.claddingMeshes.push(elbow);

      // Angled branch entering V-102A drum bottom/side
      const angledRiser = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 3.02, 16), this.matAluminumCladding);
      angledRiser.rotation.x = -Math.atan2(2.5, 1.7);
      angledRiser.position.set(x, 15.65, 2.75);
      v102aGroup.add(angledRiser);
      this.claddingMeshes.push(angledRiser);

      this.addNozzleWithFlange(v102aGroup, new THREE.Vector3(x, 16.5, 1.5), new THREE.Vector3(0, -1, -1).normalize(), 0.48, 1.1);
    });

    // Armored Reflex Sight Level Gauges on Platform
    [-0.8, 0.8].forEach((gz) => {
      const gauge = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.9, 0.25), this.matAlloySteel);
      gauge.position.set(7.3, 18.0, gz);
      v102aGroup.add(gauge);

      const glass = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.5, 0.08), this.matPolishedSteel);
      glass.position.set(7.42, 18.0, gz);
      v102aGroup.add(glass);
    });

    // Twin High-Pressure Safety Relief Valves (PSV-102A & PSV-102B)
    [-2.0, 2.0].forEach((psvX) => {
      this.addNozzleWithFlange(v102aGroup, new THREE.Vector3(psvX, 19.7, 0), new THREE.Vector3(0, 1, 0), 0.38, 0.95);

      const psvBody = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.85, 12), this.matFlange);
      psvBody.position.set(psvX, 20.4, 0);
      v102aGroup.add(psvBody);

      const psvVent = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 3.2, 12), this.matCarbonSteel);
      psvVent.position.set(psvX, 22.2, 0);
      v102aGroup.add(psvVent);
    });

    // Central Main HP Steam Export Nozzle and Stop Check Valve with Handwheel
    this.addNozzleWithFlange(v102aGroup, new THREE.Vector3(0, 19.7, 0), new THREE.Vector3(0, 1, 0), 0.7, 1.7);

    const mainValve102A = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 12), this.matFlange);
    mainValve102A.position.set(0, 20.5, 0);
    v102aGroup.add(mainValve102A);

    const wheel102A = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.1, 16), this.matYellowSafety);
    wheel102A.position.set(0, 21.2, 0);
    v102aGroup.add(wheel102A);

    // High-Pressure 65 bar Saturated Steam Export Line Spool emerging from top of unified V-102A
    const exportSpool = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 2.2, 16), this.matCarbonSteel);
    exportSpool.position.set(0, 22.3, 0);
    v102aGroup.add(exportSpool);

    const exportElbow = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), this.matFlange);
    exportElbow.position.set(0, 23.4, 0);
    v102aGroup.add(exportElbow);

    const exportRun = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 4.5, 16), this.matCarbonSteel);
    exportRun.rotation.x = Math.PI / 2;
    exportRun.position.set(0, 23.4, 2.25);
    v102aGroup.add(exportRun);

    const exportFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.2, 20), this.matFlange);
    exportFlange.rotation.x = Math.PI / 2;
    exportFlange.position.set(0, 23.4, 4.5);
    v102aGroup.add(exportFlange);

    this.registerInteractive(steamDrum, 'v-102a');
    this.group.add(v102aGroup);
  }

  // 11. R-104 High Temperature Shift (HTS) Converter (X = 84.0, Z = -14.0)
  // تصميم هندسي ثلاثي الأبعاد فائق الاحترافية: دخول وخروج الغاز كلاهما من قمة المفاعل بفعل فرق الكثافة
  private buildHighTempShiftConverterR104() {
    const r104Group = new THREE.Group();
    r104Group.position.set(84.0, 2.0, -14.0);

    // Reinforced octagonal concrete plinth with chamfer
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.4, 2.6, 8), this.matConcreteCurb);
    plinth.position.set(0, 1.3, 0);
    r104Group.add(plinth);

    // Anchor bolt ring on foundation perimeter
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8), this.matFlange);
      bolt.position.set(Math.cos(angle) * 4.6, 2.7, Math.sin(angle) * 4.6);
      r104Group.add(bolt);
    }

    // Cylindrical heavy steel skirt with access manway & ventilation port
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.0, 4.6, 32), this.matAlloySteel);
    skirt.position.set(0, 4.6, 0);
    r104Group.add(skirt);

    const skirtManhole = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.5, 16), this.matFlange);
    skirtManhole.rotation.z = Math.PI / 2;
    skirtManhole.position.set(4.0, 4.2, 0);
    r104Group.add(skirtManhole);

    // Lower ellipsoidal dished head
    const bottomHead = new THREE.Mesh(new THREE.SphereGeometry(4.0, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), this.matCarbonSteel);
    bottomHead.position.set(0, 7.0, 0);
    r104Group.add(bottomHead);

    // Reactor main pressure shell (Fe3O4/Cr2O3 catalyst bed vessel)
    const vessel = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.0, 15.0, 32), this.matCarbonSteel);
    vessel.position.set(0, 14.5, 0);
    r104Group.add(vessel);

    // Circumferential vacuum/stiffening rings representing catalyst bed support grid levels
    [9.5, 13.0, 16.5, 20.0].forEach((ringY) => {
      const stiffRing = new THREE.Mesh(new THREE.CylinderGeometry(4.18, 4.18, 0.22, 32), this.matFlange);
      stiffRing.position.set(0, ringY, 0);
      r104Group.add(stiffRing);
    });

    // Top 2:1 ellipsoidal dished head
    const topHead = new THREE.Mesh(new THREE.SphereGeometry(4.0, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), this.matCarbonSteel);
    topHead.position.set(0, 22.0, 0);
    r104Group.add(topHead);

    // Maintenance & inspection catwalk platforms with safety handrails & vertical ladders
    [9.5, 16.5, 22.0].forEach((y) => {
      const plat = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 5.4, 0.35, 32), this.matCatwalkSteel);
      plat.position.set(0, y, 0);
      r104Group.add(plat);

      const rail = new THREE.Mesh(new THREE.CylinderGeometry(5.45, 5.45, 1.1, 32, 1, true), this.matYellowSafety);
      rail.position.set(0, y + 0.55, 0);
      r104Group.add(rail);

      const toePlate = new THREE.Mesh(new THREE.CylinderGeometry(5.42, 5.42, 0.2, 32, 1, true), this.matFlange);
      toePlate.position.set(0, y + 0.1, 0);
      r104Group.add(toePlate);
    });

    // Caged access ladder connecting platforms vertically
    const ladderSide = new THREE.Mesh(new THREE.BoxGeometry(0.12, 13.0, 0.6), this.matCatwalkSteel);
    ladderSide.position.set(-5.15, 16.0, 1.8);
    r104Group.add(ladderSide);

    // 1. GAS INLET FROM E-108 ENTERS AT THE TOP OF R-104 ("دخول الغاز من فوق وليس من أسفل بسبب فرق الكثافة وديناميكا الغازات")
    // Top dome West nozzle (-2.2, 25.2, 0) with weld-neck flange and gas distributor collar
    this.addNozzleWithFlange(r104Group, new THREE.Vector3(-2.2, 25.2, 0), new THREE.Vector3(0, 1, 0), 0.85, 2.0);

    // 2. CONVERTED GAS OUTLET TO E-109 EXITS FROM THE TOP OF R-104 ("خروج الغاز من أعلى المفاعل وليس من أسفل")
    // Top dome East nozzle (+2.2, 25.2, 0) with flanged collar leading to overhead transfer line to E-109
    this.addNozzleWithFlange(r104Group, new THREE.Vector3(2.2, 25.2, 0), new THREE.Vector3(0, 1, 0), 0.85, 2.0);

    // Central Catalyst Loading Manway with Davit Arm on top dome
    const catManway = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.6, 16), this.matFlange);
    catManway.position.set(0, 25.8, 0);
    r104Group.add(catManway);

    const davitArm = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.4, 0.8), this.matYellowSafety);
    davitArm.position.set(0.45, 26.2, 0);
    r104Group.add(davitArm);

    // Multi-point Thermocouple Profile Flange (TI-104-1..4 across catalyst beds)
    const thermoFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.5, 12), this.matFlange);
    thermoFlange.rotation.z = Math.PI / 2;
    thermoFlange.position.set(4.15, 18.0, 1.2);
    r104Group.add(thermoFlange);

    // Differential Pressure Transmitter tapping lines (dPT-104 across catalyst bed)
    const dpTapping1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8), this.matFlange);
    dpTapping1.rotation.z = Math.PI / 2;
    dpTapping1.position.set(4.1, 21.0, -1.0);
    r104Group.add(dpTapping1);

    const dpTapping2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8), this.matFlange);
    dpTapping2.rotation.z = Math.PI / 2;
    dpTapping2.position.set(4.1, 8.5, -1.0);
    r104Group.add(dpTapping2);

    // Bottom catalyst unloading nozzle and drain connection (closed off during operation; NO process gas pipes at bottom!)
    const botManhole = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.2, 16), this.matFlange);
    botManhole.position.set(0, 5.2, 0);
    r104Group.add(botManhole);

    const blindFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.25, 16), this.matFlange);
    blindFlange.position.set(0, 4.5, 0);
    r104Group.add(blindFlange);

    // ASME Section VIII Division 2 Vessel Stamped Nameplate
    const nameplate = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 1.1), this.matFlange);
    nameplate.position.set(4.05, 10.0, 0);
    r104Group.add(nameplate);

    this.registerInteractive(r104Group, 'r-104');
    this.group.add(r104Group);
  }

  // 12. Heat Recovery Exchangers E-107 & E-110 with Dedicated Tube Mixing Manifold (South Corridor, Z = +22.0)
  // تصميم هندسي متقدم: غاز التحويل من أنابيب E-109 و E-107 يلتقي عند مشعب التجميع ليدخل أنابيب E-110 بدون أي اقتراب أو تداخل مع V-101
  private buildHeatRecoveryTrainE109E107E110() {
    // 1. Reinforced concrete foundation pad for South Corridor heat recovery train
    const pad109 = new THREE.Mesh(new THREE.BoxGeometry(28.0, 1.2, 8.0), this.matConcreteCurb);
    pad109.position.set(72.0, 0.6, 22.0);
    this.group.add(pad109);

    const padStripe = new THREE.Mesh(new THREE.BoxGeometry(28.2, 0.08, 8.2), this.matYellowSafety);
    padStripe.position.set(72.0, 1.22, 22.0);
    this.group.add(padStripe);

    // 2. E-107 Shifted Gas / Methanator Feed Preheater (X = 80.0, Z = +22.0)
    // Tubes: Converted Gas from E-109 (320°C -> 265°C) to E-110 Tubes
    // Shell: Decarbonated Gas from E-106 Shell (245°C) preheating to 310°C to R-106
    const e107Group = new THREE.Group();
    e107Group.position.set(80.0, 2.0, 22.0);

    [-2.5, 2.5].forEach((sx) => {
      const saddle = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 3.6), this.matConcretePad);
      saddle.position.set(sx, 1.8, 0);
      e107Group.add(saddle);

      const saddleBaseplate = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 3.8), this.matFlange);
      saddleBaseplate.position.set(sx, 0.7, 0);
      e107Group.add(saddleBaseplate);
    });

    // E-107 Exchanger Shell (Diameter 3.6m, Length 6.8m)
    const e107Shell = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 6.8, 32), this.matCarbonSteel);
    e107Shell.rotation.z = Math.PI / 2;
    e107Shell.position.set(0, 4.2, 0);
    e107Group.add(e107Shell);

    // Stationary Tube Sheet & Channel Head Flanges
    [-3.4, 3.4].forEach((hx) => {
      const head = new THREE.Mesh(new THREE.SphereGeometry(1.8, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2), this.matCarbonSteel);
      head.rotation.z = hx < 0 ? Math.PI / 2 : -Math.PI / 2;
      head.scale.set(1.0, 0.45, 1.0); // 2:1 semi-ellipsoidal dish (depth = 0.81m)
      head.position.set(hx, 4.2, 0);
      e107Group.add(head);

      const tubeSheetFlange = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 2.15, 0.45, 28), this.matFlange);
      tubeSheetFlange.rotation.z = Math.PI / 2;
      tubeSheetFlange.position.set(hx * 0.96, 4.2, 0);
      e107Group.add(tubeSheetFlange);
    });

    // Tube side nozzles (Converted Gas)
    // East Head Tube Inlet (+4.2, 4.2, 0) receiving hot gas from R-104 Tubes (starts at crown of dished head)
    this.addNozzleWithFlange(e107Group, new THREE.Vector3(4.2, 4.2, 0), new THREE.Vector3(1, 0, 0), 0.7, 1.3);
    // West Head Tube Outlet (-4.2, 4.2, 0) - straight horizontal nozzle matching inlet (starts at crown of dished head)
    this.addNozzleWithFlange(e107Group, new THREE.Vector3(-4.2, 4.2, 0), new THREE.Vector3(-1, 0, 0), 0.7, 1.3);

    // Shell side nozzles (Decarbonated gas from E-106 shell & to R-106)
    this.addNozzleWithFlange(e107Group, new THREE.Vector3(-1.5, 6.0, 0), new THREE.Vector3(0, 1, 0), 0.6, 1.6); // Shell outlet to R-106 (310°C)
    this.addNozzleWithFlange(e107Group, new THREE.Vector3(1.5, 2.4, 0), new THREE.Vector3(0, -1, 0), 0.6, 1.6);  // Shell inlet from E-106 shell (245°C)

    // Thermowell & Temperature Transmitter TIC-107
    const tw107 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12), this.matFlange);
    tw107.position.set(-2.2, 6.1, 0);
    e107Group.add(tw107);

    this.registerInteractive(e107Group, 'e-107');
    this.group.add(e107Group);

    // -------------------------------------------------------------------------
    // 3. PHYSICAL 3D FLANGED TEE & TUBE MIXING MANIFOLD (Corridor Rack X = 71.0, Y = 8.5, Z = 10.0)
    // حيث يرتبط خط أنابيب E-107 مع خط أنابيب E-109 على ممر الأنابيب بعيداً تماماً وبدون أي ربط مع E-110
    // -------------------------------------------------------------------------
    const manifoldGroup = new THREE.Group();
    manifoldGroup.position.set(71.0, 8.5, 10.0);

    // Heavy forged steel mixing tee body
    const teeBody = new THREE.Mesh(new THREE.SphereGeometry(0.72, 16, 16), this.matFlange);
    manifoldGroup.add(teeBody);

    // East inlet spool & flange receiving line coming from E-107
    const eastTeeSpool = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.7, 16), this.matCarbonSteel);
    eastTeeSpool.rotation.z = Math.PI / 2;
    eastTeeSpool.position.set(0.45, 0, 0);
    manifoldGroup.add(eastTeeSpool);

    const eastTeeFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.22, 20), this.matFlange);
    eastTeeFlange.rotation.z = Math.PI / 2;
    eastTeeFlange.position.set(0.8, 0, 0);
    manifoldGroup.add(eastTeeFlange);

    // West inlet flange receiving line from E-109
    const westTeeFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.22, 20), this.matFlange);
    westTeeFlange.rotation.z = Math.PI / 2;
    westTeeFlange.position.set(-0.65, 0, 0);
    manifoldGroup.add(westTeeFlange);

    // South outlet gate valve with yellow handwheel on line heading towards E-110
    const valveBody = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.65, 16), this.matFlange);
    valveBody.rotation.x = Math.PI / 2;
    valveBody.position.set(0, 0, 0.9);
    manifoldGroup.add(valveBody);

    const valveBonnet = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.6, 12), this.matFlange);
    valveBonnet.position.set(0, 0.6, 0.9);
    manifoldGroup.add(valveBonnet);

    const valveWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.08, 16), this.matYellowSafety);
    valveWheel.position.set(0, 0.95, 0.9);
    manifoldGroup.add(valveWheel);

    // Drain bleed valve
    const drainBleed = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 12), this.matFlange);
    drainBleed.position.set(0, -0.6, 0);
    manifoldGroup.add(drainBleed);

    this.group.add(manifoldGroup);

    // 4. E-110 MP Steam Boiler & Converted Gas Cooler (X = 64.0, Z = +22.0)
    // Tubes: Combined Converted Gas from E-109 & E-107 (265°C -> 185°C) to V-101 KO Drum
    // Shell: Boiler Feed Water connected to V-109 Steam Drum (12 kg/cm² MP Steam)
    const e110Group = new THREE.Group();
    e110Group.position.set(64.0, 2.0, 22.0);

    [-2.8, 2.8].forEach((sx) => {
      const saddle = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 4.0), this.matConcretePad);
      saddle.position.set(sx, 1.8, 0);
      e110Group.add(saddle);

      const saddleBaseplate = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.2, 4.2), this.matFlange);
      saddleBaseplate.position.set(sx, 0.7, 0);
      e110Group.add(saddleBaseplate);
    });

    // E-110 Boiler Shell (Diameter 4.0m, Length 7.2m)
    const e110Shell = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 7.2, 32), this.matCarbonSteel);
    e110Shell.rotation.z = Math.PI / 2;
    e110Shell.position.set(0, 4.2, 0);
    e110Group.add(e110Shell);

    // Dished Channel Heads & Stationary Tube Sheet Flanges (ASME 2:1 Semi-Ellipsoidal)
    [-3.6, 3.6].forEach((hx) => {
      const head = new THREE.Mesh(new THREE.SphereGeometry(2.0, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2), this.matCarbonSteel);
      head.rotation.z = hx < 0 ? Math.PI / 2 : -Math.PI / 2;
      head.scale.set(1.0, 0.45, 1.0); // 2:1 semi-ellipsoidal dish (depth = 0.9m)
      head.position.set(hx, 4.2, 0);
      e110Group.add(head);

      const flange = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.35, 0.45, 28), this.matFlange);
      flange.rotation.z = Math.PI / 2;
      flange.position.set(hx * 0.96, 4.2, 0);
      e110Group.add(flange);
    });

    // Tube side nozzles:
    // East Head Tube Inlet (+4.5, 4.2, 0) - straight horizontal nozzle mounted at the apex/crown of the dished head
    this.addNozzleWithFlange(e110Group, new THREE.Vector3(4.5, 4.2, 0), new THREE.Vector3(1, 0, 0), 0.7, 1.3);
    // West Head Tube Outlet (-4.5, 4.2, 0) - straight horizontal nozzle mounted at the apex/crown discharging to V-101
    this.addNozzleWithFlange(e110Group, new THREE.Vector3(-4.5, 4.2, 0), new THREE.Vector3(-1, 0, 0), 0.65, 1.5);

    // Shell side nozzles connecting to V-109 steam drum
    this.addNozzleWithFlange(e110Group, new THREE.Vector3(-1.8, 6.2, 0), new THREE.Vector3(0, 1, 0), 0.55, 1.4);
    this.addNozzleWithFlange(e110Group, new THREE.Vector3(1.8, 6.2, 0), new THREE.Vector3(0, 1, 0), 0.55, 1.4);
    this.addNozzleWithFlange(e110Group, new THREE.Vector3(-1.8, 2.2, 0), new THREE.Vector3(0, -1, 0), 0.55, 1.4);
    this.addNozzleWithFlange(e110Group, new THREE.Vector3(1.8, 2.2, 0), new THREE.Vector3(0, -1, 0), 0.55, 1.4);

    // Thermowell & Temperature Transmitter TIC-110
    const tw110 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12), this.matFlange);
    tw110.position.set(-2.5, 6.3, 0);
    e110Group.add(tw110);

    // =========================================================================
    // V-109 MEDIUM PRESSURE STEAM DRUM (طبلة البخار متوسط الضغط 12 كغم/سم²)
    // Elevated above E-110 (Y = 16.0m), generating 12 kg/cm² MP Steam
    // =========================================================================
    const v109Group = new THREE.Group();
    v109Group.name = 'MP_Steam_Drum_V109';
    v109Group.position.set(0, 14.0, 0);

    // Structural support columns elevating V-109 drum above E-110
    [[-3.2, -1.8], [3.2, -1.8], [-3.2, 1.8], [3.2, 1.8]].forEach(([cx, cz]) => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.55, 14.0, 0.55), this.matAlloySteel);
      col.position.set(cx, -7.0, cz);
      v109Group.add(col);
    });

    // Cross-bracing for drum support tower
    const brace1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 14.5, 0.2), this.matAlloySteel);
    brace1.rotation.z = Math.PI / 6;
    brace1.position.set(0, -7.0, -1.8);
    v109Group.add(brace1);

    const brace2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 14.5, 0.2), this.matAlloySteel);
    brace2.rotation.z = -Math.PI / 6;
    brace2.position.set(0, -7.0, 1.8);
    v109Group.add(brace2);

    const drumPlatform = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.25, 5.2), this.matCatwalkSteel);
    drumPlatform.position.set(0, -0.6, 0);
    v109Group.add(drumPlatform);

    const drumRail = new THREE.Mesh(new THREE.BoxGeometry(9.9, 1.1, 5.3), this.matYellowSafety);
    drumRail.position.set(0, -0.05, 0);
    v109Group.add(drumRail);

    // V-109 Drum Shell (Length 8.0m, Radius 1.35m) with Aluminum Cladding
    const v109Shell = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 8.0, 24), this.matAluminumCladding);
    v109Shell.rotation.z = Math.PI / 2;
    v109Shell.position.set(0, 1.4, 0);
    v109Group.add(v109Shell);
    this.claddingMeshes.push(v109Shell);

    [-4.0, 4.0].forEach((hx) => {
      const head = new THREE.Mesh(new THREE.SphereGeometry(1.35, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), this.matAluminumCladding);
      head.rotation.z = hx < 0 ? Math.PI / 2 : -Math.PI / 2;
      head.position.set(hx, 1.4, 0);
      v109Group.add(head);
      this.claddingMeshes.push(head);
    });

    // Risers connecting E-110 top shell to V-109 bottom
    [-1.8, 1.8].forEach((rx) => {
      const riser = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 8.0, 16), this.matAluminumCladding);
      riser.position.set(rx, -4.5, -0.8);
      v109Group.add(riser);
      this.claddingMeshes.push(riser);

      const downcomer = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 8.0, 16), this.matAluminumCladding);
      downcomer.position.set(rx, -4.5, 0.8);
      v109Group.add(downcomer);
      this.claddingMeshes.push(downcomer);
    });

    // Top MP Steam Outlet Nozzle (12 kg/cm²)
    this.addNozzleWithFlange(v109Group, new THREE.Vector3(0, 2.9, 0), new THREE.Vector3(0, 1, 0), 0.55, 1.6);

    // Safety relief valves on V-109 (PSV-109)
    [-1.5, 1.5].forEach((psvX) => {
      const psvBody = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.65, 12), this.matFlange);
      psvBody.position.set(psvX, 2.9, 0);
      v109Group.add(psvBody);

      const psvVent = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.4, 12), this.matCarbonSteel);
      psvVent.position.set(psvX, 4.3, 0);
      v109Group.add(psvVent);
    });

    this.registerInteractive(v109Group, 'v-109');
    e110Group.add(v109Group);

    this.registerInteractive(e110Group, 'e-110');
    this.group.add(e110Group);
  }

  // 13. V-101 Knockout Condensate Separator Drum (X = 48.0, Z = +22.0)
  // وعاء فصل المتكاثف V-101 بتصميم هندسي ثلاثي الأبعاد فائق الاحترافية
  // يبعد أكثر من 16 متراً عن E-110 و 22 متراً عن مشعب التجميع بدون أي تداخل أو تقاطع
  private buildKnockOutDrumV101() {
    const v101Group = new THREE.Group();
    v101Group.position.set(48.0, 2.0, 22.0);

    // 1. Reinforced concrete circular foundation plinth with chamfer
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.1, 2.0, 24), this.matConcreteCurb);
    plinth.position.set(0, 1.0, 0);
    v101Group.add(plinth);

    // Anchor bolt studs on perimeter
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 8), this.matFlange);
      bolt.position.set(Math.cos(angle) * 2.6, 2.1, Math.sin(angle) * 2.6);
      v101Group.add(bolt);
    }

    // 2. Steel structural skirt with access door and ventilation port
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 2.8, 24), this.matAlloySteel);
    skirt.position.set(0, 3.4, 0);
    v101Group.add(skirt);

    const skirtDoor = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.3, 16), this.matFlange);
    skirtDoor.rotation.z = Math.PI / 2;
    skirtDoor.position.set(2.2, 3.2, 0);
    v101Group.add(skirtDoor);

    // 3. Lower 2:1 ellipsoidal dished head with bottom condensate drain boot
    const bottomHead = new THREE.Mesh(new THREE.SphereGeometry(2.2, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), this.matCarbonSteel);
    bottomHead.position.set(0, 4.8, 0);
    v101Group.add(bottomHead);

    // Condensate collection boot (drip leg) at bottom of head
    const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.8, 16), this.matCarbonSteel);
    boot.position.set(0, 3.2, 0);
    v101Group.add(boot);

    // Automated drain control valve (LCV-101) with pneumatic diaphragm actuator on boot
    const lcvBody = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5, 12), this.matFlange);
    lcvBody.rotation.z = Math.PI / 2;
    lcvBody.position.set(-0.6, 2.6, 0);
    v101Group.add(lcvBody);

    const lcvActuator = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16), this.matYellowSafety);
    lcvActuator.position.set(-0.6, 3.1, 0);
    v101Group.add(lcvActuator);

    // 4. Vertical pressure vessel body (Diameter 4.4m, Height 6.5m)
    const vessel = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 6.5, 32), this.matCarbonSteel);
    vessel.position.set(0, 8.0, 0);
    v101Group.add(vessel);

    // Demister pad indicator band (stainless steel collar representing the wire mesh mist eliminator)
    const demisterBand = new THREE.Mesh(new THREE.CylinderGeometry(2.26, 2.26, 0.45, 32), this.matFlange);
    demisterBand.position.set(0, 9.8, 0);
    v101Group.add(demisterBand);

    // 5. Top 2:1 ellipsoidal dished head
    const topHead = new THREE.Mesh(new THREE.SphereGeometry(2.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), this.matCarbonSteel);
    topHead.position.set(0, 11.25, 0);
    v101Group.add(topHead);

    // 6. Tangential / Radial Gas Inlet Nozzle from E-110 (World X = 50.2, Y = 7.8, Z = 22.0)
    // Nozzle tip sits at relative x = +2.2, y = +5.8, z = 0 -> cleanly flanged and ready for E-110 effluent
    this.addNozzleWithFlange(v101Group, new THREE.Vector3(2.2, 5.8, 0), new THREE.Vector3(1, 0, 0), 0.65, 1.6);

    // Reinforcing pad (rep-pad) on vessel shell around inlet nozzle
    const repPadInlet = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.1, 16), this.matFlange);
    repPadInlet.rotation.z = Math.PI / 2;
    repPadInlet.position.set(2.18, 5.8, 0);
    v101Group.add(repPadInlet);

    // 7. Top Vapor Outlet Nozzle (World X = 48.0, Y = 13.5, Z = 22.0) leading overhead to LTS R-105
    this.addNozzleWithFlange(v101Group, new THREE.Vector3(0, 11.5, 0), new THREE.Vector3(0, 1, 0), 0.7, 1.6);

    // Pressure Relief Valve PSV-101 on top head with vertical discharge tail pipe
    const psv101 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.6, 12), this.matFlange);
    psv101.position.set(-1.1, 12.0, 0);
    v101Group.add(psv101);

    const psvVent101 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.4, 12), this.matCarbonSteel);
    psvVent101.position.set(-1.1, 13.4, 0);
    v101Group.add(psvVent101);

    // 8. External Magnetic Level Bridle Column (LT-101 & Level Gauge) on North face
    const bridleColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.8, 12), this.matFlange);
    bridleColumn.position.set(0, 7.8, 2.45);
    v101Group.add(bridleColumn);

    // Bridle upper & lower process isolation valves
    [5.6, 10.0].forEach((vy) => {
      const bValve = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 12), this.matCarbonSteel);
      bValve.rotation.x = Math.PI / 2;
      bValve.position.set(0, vy, 2.35);
      v101Group.add(bValve);
    });

    // Magnetic dual-color level indicator scale
    const levelScale = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.8, 0.05), this.matYellowSafety);
    levelScale.position.set(0, 7.8, 2.55);
    v101Group.add(levelScale);

    // High Level Trip Switch LSHH-101 (protects LTS catalyst from liquid carryover)
    const lshhBox = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.3, 0.2), this.matFlange);
    lshhBox.position.set(0.25, 9.6, 2.45);
    v101Group.add(lshhBox);

    // 9. Mid-elevation access catwalk platform with safety yellow handrails & ladder
    const plat101 = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.25, 24), this.matCatwalkSteel);
    plat101.position.set(0, 9.5, 0);
    v101Group.add(plat101);

    const rail101 = new THREE.Mesh(new THREE.CylinderGeometry(3.25, 3.25, 1.0, 24, 1, true), this.matYellowSafety);
    rail101.position.set(0, 10.05, 0);
    v101Group.add(rail101);

    // Access ladder from plinth up to platform
    const ladder101 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7.5, 0.5), this.matCatwalkSteel);
    ladder101.position.set(-3.0, 5.75, 0);
    v101Group.add(ladder101);

    // ASME Identification Stamped Nameplate
    const nameplate101 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 0.9), this.matFlange);
    nameplate101.position.set(2.25, 7.5, 0.8);
    v101Group.add(nameplate101);

    this.registerInteractive(v101Group, 'v-101');
    this.group.add(v101Group);
  }

  // 14. R-105 Low Temperature Shift (LTS) Converter (X = 28.0, Z = +22.0)
  // تصميم هندسي ثلاثي الأبعاد فائق الاحترافية: خروج الغاز المتحول من قمة المفاعل (من فوق وليس من أسفل)
  private buildLowTempShiftConverterR105() {
    const r105Group = new THREE.Group();
    r105Group.position.set(28.0, 2.0, 22.0);

    // Reinforced concrete plinth with chamfer
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.8, 2.4, 24), this.matConcreteCurb);
    plinth.position.set(0, 1.2, 0);
    r105Group.add(plinth);

    // Foundation anchor bolts
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8), this.matFlange);
      bolt.position.set(Math.cos(angle) * 4.4, 2.5, Math.sin(angle) * 4.4);
      r105Group.add(bolt);
    }

    // Cylindrical heavy steel skirt with access manhole
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, 4.4, 32), this.matAlloySteel);
    skirt.position.set(0, 4.4, 0);
    r105Group.add(skirt);

    const skirtManhole = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.45, 16), this.matFlange);
    skirtManhole.rotation.z = Math.PI / 2;
    skirtManhole.position.set(3.8, 4.0, 0);
    r105Group.add(skirtManhole);

    // Lower ellipsoidal dished head
    const bottomHead = new THREE.Mesh(new THREE.SphereGeometry(3.8, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), this.matCarbonSteel);
    bottomHead.position.set(0, 6.75, 0);
    r105Group.add(bottomHead);

    // Main reactor pressure shell (Cu-Zn-Al catalyst bed)
    const vessel = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, 13.5, 32), this.matCarbonSteel);
    vessel.position.set(0, 13.5, 0);
    r105Group.add(vessel);

    // Circumferential vacuum/stiffening rings representing catalyst support bed levels
    [9.5, 13.5, 17.5].forEach((ringY) => {
      const stiffRing = new THREE.Mesh(new THREE.CylinderGeometry(3.96, 3.96, 0.2, 32), this.matFlange);
      stiffRing.position.set(0, ringY, 0);
      r105Group.add(stiffRing);
    });

    // Top ellipsoidal dished head
    const topHead = new THREE.Mesh(new THREE.SphereGeometry(3.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), this.matCarbonSteel);
    topHead.position.set(0, 20.25, 0);
    r105Group.add(topHead);

    // Operating and maintenance catwalk platforms
    [9.0, 15.0, 20.25].forEach((y) => {
      const plat = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.0, 0.35, 24), this.matCatwalkSteel);
      plat.position.set(0, y, 0);
      r105Group.add(plat);

      const rail = new THREE.Mesh(new THREE.CylinderGeometry(5.05, 5.05, 1.1, 24, 1, true), this.matYellowSafety);
      rail.position.set(0, y + 0.55, 0);
      r105Group.add(rail);

      const toePlate = new THREE.Mesh(new THREE.CylinderGeometry(5.02, 5.02, 0.18, 24, 1, true), this.matFlange);
      toePlate.position.set(0, y + 0.09, 0);
      r105Group.add(toePlate);
    });

    // Caged access ladder
    const ladderSide = new THREE.Mesh(new THREE.BoxGeometry(0.12, 15.5, 0.6), this.matCatwalkSteel);
    ladderSide.position.set(-4.85, 12.0, 1.6);
    r105Group.add(ladderSide);

    // 1. GAS INLET NOZZLE FROM V-101 (215°C) AT TOP DOME (East Nozzle +2.0, 23.8, 0)
    // فوهة دخول الغاز القادم من V-101 في قمة المفاعل الشرقية العلوية
    this.addNozzleWithFlange(r105Group, new THREE.Vector3(2.0, 23.8, 0), new THREE.Vector3(0, 1, 0), 0.85, 2.0);

    // 2. CONVERTED GAS OUTLET NOZZLE EXITS FROM TOP DOME (West Nozzle -2.0, 23.8, 0)
    // "خط الغاز الخارج من R105 لازم من فوك و ليس من اسفل" - فوهة خروج الغاز المتحول من قمة المفاعل الغربية العلوية
    this.addNozzleWithFlange(r105Group, new THREE.Vector3(-2.0, 23.8, 0), new THREE.Vector3(0, 1, 0), 0.85, 2.0);

    // Central Catalyst Loading Manway with Davit Arm on top dome
    const catManway = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.55, 16), this.matFlange);
    catManway.position.set(0, 24.3, 0);
    r105Group.add(catManway);

    const davitArm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.3, 0.75), this.matYellowSafety);
    davitArm.position.set(0.4, 24.7, 0);
    r105Group.add(davitArm);

    // Bottom catalyst unloading nozzle with blind flange (closed during operation; NO process gas lines at bottom!)
    // فوهة تفريغ العامل المساعد السفلية مع فلنجة مغلقة (لا يوجد أي خط غاز تشغيلي في الأسفل نهائياً)
    const botDump = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.1, 16), this.matFlange);
    botDump.position.set(0, 5.0, 0);
    r105Group.add(botDump);

    const blindFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.22, 16), this.matFlange);
    blindFlange.position.set(0, 4.35, 0);
    r105Group.add(blindFlange);

    // ASME Section VIII Division 2 Vessel Nameplate
    const nameplate = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.65, 1.0), this.matFlange);
    nameplate.position.set(3.85, 9.5, 0);
    r105Group.add(nameplate);

    this.registerInteractive(r105Group, 'r-105');
    this.group.add(r105Group);
  }

  // 15. R-106 Methanator System & E-106 Feed/Effluent Exchanger (X = +4.0, Z = +22.0)
  // E-106: Shell carries cold decarbonated gas from V-204 to E-107 Shell
  //        Tubes carry hot methanated effluent from R-106 bottom to E-301
  // R-106: Top receives preheated gas from E-107 Shell (310°C)
  //        Bottom discharges to E-106 Tubes (330°C)
  private buildMethanationSystemR106() {
    const methGroup = new THREE.Group();
    methGroup.position.set(4.0, 2.0, 22.0);

    // --- E-106 Methanator Feed/Effluent Cross Exchanger (X = -4.0 relative, World X = 0.0) ---
    const e106Group = new THREE.Group();
    e106Group.position.set(-4.0, 0, 0);

    const pad106 = new THREE.Mesh(new THREE.BoxGeometry(8.5, 1.8, 4.8), this.matConcreteCurb);
    pad106.position.set(0, 0.9, 0);
    e106Group.add(pad106);

    [-2.2, 2.2].forEach((sx) => {
      const saddle = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.0, 3.6), this.matConcretePad);
      saddle.position.set(sx, 1.8, 0);
      e106Group.add(saddle);
    });

    const e106Shell = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 6.5, 24), this.matCarbonSteel);
    e106Shell.rotation.z = Math.PI / 2;
    e106Shell.position.set(0, 3.6, 0);
    e106Group.add(e106Shell);

    [-3.3, 3.3].forEach((hx) => {
      const head = new THREE.Mesh(new THREE.SphereGeometry(1.6, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), this.matCarbonSteel);
      head.rotation.z = hx < 0 ? Math.PI / 2 : -Math.PI / 2;
      head.position.set(hx, 3.6, 0);
      e106Group.add(head);

      const flange = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 0.35, 24), this.matFlange);
      flange.rotation.z = Math.PI / 2;
      flange.position.set(hx * 0.96, 3.6, 0);
      e106Group.add(flange);
    });

    // Tube side nozzles (Hot effluent from R-106 at +X -> Cooled to E-301 at -X)
    this.addNozzleWithFlange(e106Group, new THREE.Vector3(3.3, 3.6, 0), new THREE.Vector3(1, 0, 0), 0.6, 1.6);
    this.addNozzleWithFlange(e106Group, new THREE.Vector3(-3.3, 3.6, 0), new THREE.Vector3(-1, 0, 0), 0.6, 1.6);

    // Shell side nozzles (Cold gas from V-204 at bottom -> Preheated out at top to E-107 shell)
    this.addNozzleWithFlange(e106Group, new THREE.Vector3(-1.2, 2.0, 0), new THREE.Vector3(0, -1, 0), 0.6, 1.4);
    this.addNozzleWithFlange(e106Group, new THREE.Vector3(1.2, 5.2, 0), new THREE.Vector3(0, 1, 0), 0.6, 1.4);

    this.registerInteractive(e106Group, 'e-106');
    methGroup.add(e106Group);

    // --- R-106 Methanator Reactor Vessel (X = +4.0 relative, World X = 8.0) ---
    const r106Group = new THREE.Group();
    r106Group.position.set(4.0, 0, 0);

    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.2, 2.0, 24), this.matConcreteCurb);
    plinth.position.set(0, 1.0, 0);
    r106Group.add(plinth);

    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 3.6, 24), this.matAlloySteel);
    skirt.position.set(0, 3.6, 0);
    r106Group.add(skirt);

    const vessel = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 10.0, 24), this.matCarbonSteel);
    vessel.position.set(0, 10.4, 0);
    r106Group.add(vessel);

    const head = new THREE.Mesh(new THREE.SphereGeometry(2.6, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), this.matCarbonSteel);
    head.position.set(0, 15.4, 0);
    r106Group.add(head);

    [8.0, 15.4].forEach((y) => {
      const plat = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.35, 24), this.matCatwalkSteel);
      plat.position.set(0, y, 0);
      r106Group.add(plat);

      const rail = new THREE.Mesh(new THREE.CylinderGeometry(3.65, 3.65, 1.1, 24, 1, true), this.matYellowSafety);
      rail.position.set(0, y + 0.55, 0);
      r106Group.add(rail);
    });

    // Top inlet nozzle receiving gas from E-107 Shell (310°C)
    this.addNozzleWithFlange(r106Group, new THREE.Vector3(0, 18.0, 0), new THREE.Vector3(0, 1, 0), 0.7, 1.8);
    // Bottom outlet nozzle discharging to E-106 Tubes (330°C)
    this.addNozzleWithFlange(r106Group, new THREE.Vector3(-2.6, 4.2, 0), new THREE.Vector3(-1, 0, 0), 0.65, 1.8);

    this.registerInteractive(r106Group, 'r-106');
    methGroup.add(r106Group);

    this.group.add(methGroup);
  }

  // 16. Pure Orthogonal Thermal Clad Process Piping Network
  private buildProcessPipingNetwork() {
    const pipeList: Array<{
      id: string;
      tag: string;
      color: number;
      radius: number;
      points: THREE.Vector3[];
    }> = [
      // 1. Natural Gas Feed: Battery Limit -> K-303 Suction
      {
        id: 'P-101-NG-FEED',
        tag: '1. تغذية الغاز الطبيعي (NG FEED 39.5 kg/cm²)',
        color: 0x0284c7,
        radius: 0.45,
        points: [
          new THREE.Vector3(-92.0, 5.0, -18.0),
          new THREE.Vector3(-77.5, 5.0, -18.0)
        ]
      },
      // 2. K-303 Discharge -> H-101 Inlet
      {
        id: 'P-102-K303-H101',
        tag: '2. مخرج ضاغط K-303 إلى مسخن H-101 (117°C)',
        color: 0x0284c7,
        radius: 0.45,
        points: [
          new THREE.Vector3(-72.0, 5.5, -18.0),
          new THREE.Vector3(-72.0, 8.5, -18.0),
          new THREE.Vector3(-56.4, 8.5, -18.0),
          new THREE.Vector3(-56.4, 5.5, -18.0)
        ]
      },
      // 3. H-101 Outlet (400°C) -> R-102 A/B Desulfurizers Top Header
      {
        id: 'P-103-H101-R102',
        tag: '3. مخرج مسخن H-101 (400°C) إلى مفاعلات إزالة الكبريت R-102 A/B',
        color: 0xf59e0b,
        radius: 0.55,
        points: [
          new THREE.Vector3(-47.6, 12.5, -18.0),
          new THREE.Vector3(-40.0, 12.5, -18.0),
          new THREE.Vector3(-40.0, 24.5, -18.0),
          new THREE.Vector3(-30.0, 24.5, -18.0),
          new THREE.Vector3(-30.0, 24.5, -22.5),
          new THREE.Vector3(-30.0, 22.5, -22.5)
        ]
      },
      // 3b. Branch to R-102B
      {
        id: 'P-103B-R102B',
        tag: 'تفريعة مدخل مفاعل إزالة الكبريت R-102B',
        color: 0xf59e0b,
        radius: 0.5,
        points: [
          new THREE.Vector3(-30.0, 24.5, -18.0),
          new THREE.Vector3(-30.0, 24.5, -13.5),
          new THREE.Vector3(-30.0, 22.5, -13.5)
        ]
      },
      // 4. R-102 Outlets (380°C) -> Steam Injection Point (Y=12m) -> E-101 Inlet (Mixed Feed)
      {
        id: 'P-104-R102-E101',
        tag: '4. مخرج غاز R-102 ومزجه ببخار العملية (مزيج التغذية Mixed Feed) إلى مدخل E-101',
        color: 0xf59e0b,
        radius: 0.55,
        points: [
          new THREE.Vector3(-26.8, 7.8, -18.0),
          new THREE.Vector3(-22.0, 7.8, -18.0),
          new THREE.Vector3(-22.0, 12.0, -18.0), // نقطة حقن ومزج بخار العملية S-39
          new THREE.Vector3(-22.0, 38.0, -18.0),
          new THREE.Vector3(-22.0, 38.0, -46.0),
          new THREE.Vector3(-8.8, 38.0, -46.0)  // يدخل إلى مدخل الغاز في E-101
        ]
      },
      // 4a. R-102A Bottom Outlet to Common Header
      {
        id: 'P-104A-R102A-OUT',
        tag: 'مخرج قاع مفاعل الكبريت R-102A إلى مجمع الجمع',
        color: 0xf59e0b,
        radius: 0.5,
        points: [
          new THREE.Vector3(-26.8, 7.8, -22.5),
          new THREE.Vector3(-26.8, 7.8, -18.0)
        ]
      },
      // 4b. R-102B Bottom Outlet to Common Header
      {
        id: 'P-104B-R102B-OUT',
        tag: 'مخرج قاع مفاعل الكبريت R-102B إلى مجمع الجمع',
        color: 0xf59e0b,
        radius: 0.5,
        points: [
          new THREE.Vector3(-26.8, 7.8, -13.5),
          new THREE.Vector3(-26.8, 7.8, -18.0)
        ]
      },
      // 5. HP Process Steam S-39 (Injects into Desulfurized Gas Line from R-102)
      {
        id: 'P-105-STEAM-S39',
        tag: '5. بخار العملية S-39 (39 kg/cm²) قادماً من المجمع ويحقن في خط خروج غاز R-102',
        color: 0x38bdf8,
        radius: 0.55,
        points: [
          new THREE.Vector3(-92.0, 12.0, 4.0),
          new THREE.Vector3(-22.0, 12.0, 4.0),
          new THREE.Vector3(-22.0, 12.0, -18.0) // يلتقي ويحقن مباشرة في خط خروج الغاز من مفاعل إزالة الكبريت
        ]
      },
      // 6. Preheated Mixed Feed (520°C NG + Steam) from E-101 -> High Central Bridge -> R-101 Twin Arch Headers
      {
        id: 'P-106-E101-R101ARCH',
        tag: '6. مزيج الغاز والبخار المسخن (520°C) من E-101 إلى مشاعل وتيوبات R-101',
        color: 0x0284c7,
        radius: 0.65,
        points: [
          new THREE.Vector3(8.8, 38.0, -46.0),
          new THREE.Vector3(8.8, 41.0, -46.0),
          new THREE.Vector3(0.0, 41.0, -46.0),
          new THREE.Vector3(0.0, 41.0, -14.0),
          new THREE.Vector3(0.0, 26.5, -14.0)
        ]
      },
      // 6b. North Arch Distribution Header Branch
      {
        id: 'P-106B-NORTH-ARCH',
        tag: 'مجمع التوزيع الشمالي لأنابيب R-101 (North Header 100 Tubes)',
        color: 0x0284c7,
        radius: 0.55,
        points: [
          new THREE.Vector3(0.0, 26.5, -14.0),
          new THREE.Vector3(0.0, 26.5, -17.2)
        ]
      },
      // 6c. South Arch Distribution Header Branch
      {
        id: 'P-106C-SOUTH-ARCH',
        tag: 'مجمع التوزيع الجنوبي لأنابيب R-101 (South Header 100 Tubes)',
        color: 0x0284c7,
        radius: 0.55,
        points: [
          new THREE.Vector3(0.0, 26.5, -14.0),
          new THREE.Vector3(0.0, 26.5, -10.8)
        ]
      },
      // 7. Process Air from Compressor K-302 -> E-102 Process Air Preheater
      {
        id: 'P-107-K302-E102',
        tag: '7. هواء العمليات من K-302 إلى مسخن E-102 في بناية الحمل الحراري',
        color: 0x00e5aa,
        radius: 0.65,
        points: [
          new THREE.Vector3(36.4, 7.6, -46.0),
          new THREE.Vector3(36.4, 32.0, -46.0),
          new THREE.Vector3(8.8, 32.0, -46.0)
        ]
      },
      // 8. 550°C Process Air from E-102 -> Overhead Cross-over -> Top of R-103
      {
        id: 'P-108-E102-R103TOP',
        tag: '8. هواء العمليات المسخن (550°C) من E-102 إلى قمة المصلح الثانوي R-103',
        color: 0x00e5aa,
        radius: 0.65,
        points: [
          new THREE.Vector3(8.8, 34.0, -46.0),
          new THREE.Vector3(34.0, 34.0, -46.0),
          new THREE.Vector3(34.0, 44.0, -46.0),
          new THREE.Vector3(34.0, 44.0, -14.0),
          new THREE.Vector3(32.0, 44.0, -14.0),
          new THREE.Vector3(32.0, 36.5, -14.0)
        ]
      },
      // 9. Sub-floor Effluent Line: Emerges strictly from BOTTOM of R-101 (Y=5.8m) -> R-103 Upper Reaction Cone
      {
        id: 'P-109-HOT-TRANSFER',
        tag: '9. خط النقل الحار الصاعد (795°C) من أسفل R-101 إلى أعلى المصلح الثانوي R-103',
        color: 0x9a3412,
        radius: 0.85,
        points: [
          new THREE.Vector3(12.2, 5.8, -14.0),
          new THREE.Vector3(20.0, 5.8, -14.0),
          new THREE.Vector3(20.0, 29.0, -14.0), // Vertical refractory-lined riser duct rising to upper reaction cone
          new THREE.Vector3(27.8, 29.0, -14.0)  // Enters R-103 upper reaction section (من الاعلى بس مو كلش)
        ]
      },
      // 10. R-103 Secondary Reformer Exit (980°C) -> E-108 Waste Heat Boiler Tube Side Channel Head
      // يخرج خط الغاز من منتصف R-103 (World Y = 19.2m) وليس من أسفله وينزل عمودياً ليدخل مباشرة أنابيب غلاية E-108
      {
        id: 'P-110-R103-E108',
        tag: '10. خط غاز الإصلاح الحار (980°C) من منتصف R-103 إلى أنابيب غلاية E-108 (Tube Side)',
        color: 0xb45309,
        radius: 0.95,
        points: [
          new THREE.Vector3(37.35, 19.2, -14.0), // Nozzle at middle of R-103 shell
          new THREE.Vector3(43.5, 19.2, -14.0),
          new THREE.Vector3(43.5, 7.2, -14.0),  // Vertical drop to E-108 channel head
          new THREE.Vector3(50.0, 7.2, -14.0)   // Enters E-108 Tube Side inlet duct
        ]
      },
      // 11. E-108 WHB Outlet (365°C) -> R-104 HTS Converter TOP Inlet
      // يدخل الغاز من أعلى المفاعل R-104 وليس من أسفله بسبب فرق الكثافة وحركة الغازات للأسفل عبر المحفز
      {
        id: 'P-111-E108-R104',
        tag: '11. مخرج غلاية E-108 (365°C) إلى قمة مفاعل التحويل العالي HTS R-104 (دخول الغاز من الأعلى - فرق الكثافة)',
        color: 0x0284c7,
        radius: 0.75,
        points: [
          new THREE.Vector3(65.8, 7.2, -14.0),
          new THREE.Vector3(74.0, 7.2, -14.0),
          new THREE.Vector3(74.0, 31.0, -14.0),
          new THREE.Vector3(81.8, 31.0, -14.0),
          new THREE.Vector3(81.8, 27.2, -14.0)
        ]
      },
      // 12. R-104 HTS Exit (433°C) TOP Outlet -> Overhead Bridge -> E-109 WHB Tube Inlet (East Head)
      // يخرج خط غاز التحويل من قمة R-104 ليدخل في أنابيب غلاية E-109 (Tube Side)
      {
        id: 'P-112-R104-E109',
        tag: '12. خط غاز التحويل من قمة R-104 (433°C) إلى مدخل أنابيب غلاية E-109 (Tube Side)',
        color: 0x9a3412,
        radius: 0.75,
        points: [
          new THREE.Vector3(86.2, 27.2, -14.0),
          new THREE.Vector3(86.2, 33.0, -14.0),
          new THREE.Vector3(86.2, 33.0, -1.5),
          new THREE.Vector3(68.0, 33.0, -1.5),
          new THREE.Vector3(68.0, 6.2, -1.5),
          new THREE.Vector3(68.0, 6.2, -6.0),
          new THREE.Vector3(64.5, 6.2, -6.0)
        ]
      },
      // 12b. Dedicated Line from R-104 (433°C) -> Directly into E-107 Tubes (East Head)
      // "ال E107 يجيها خط من R104 بالتيوب" - خط غاز مستقل مباشر من R104 يدخل في تيوبات E107
      {
        id: 'P-112B-R104-E107',
        tag: '12ب. خط غاز التحويل من R-104 (433°C) مباشرة إلى أنابيب مسخن E-107 (Tube Side)',
        color: 0x9a3412,
        radius: 0.70,
        points: [
          new THREE.Vector3(86.2, 33.0, -14.0),
          new THREE.Vector3(86.2, 33.0, 10.0),
          new THREE.Vector3(86.2, 10.5, 10.0),
          new THREE.Vector3(86.2, 10.5, 22.0),
          new THREE.Vector3(86.2, 6.2, 22.0),
          new THREE.Vector3(85.5, 6.2, 22.0)  // يدخل أفقياً وعدل ومباشرة في فوهة أنابيب E-107 الشرقية
        ]
      },
      // 13. E-109 Tube Outlet (320°C) -> Piperack (Z=10.0) -> Enters E-110 Tube Inlet
      // خط غاز أنابيب E-109 يمر عبر ممر الأنابيب ويستقبل ربط مخرج E-107 على الحامل، ثم يدخل أفقياً ومحورياً وعدل تماماً في أنابيب E-110
      {
        id: 'P-113-E109-E110',
        tag: '13. خط غاز أنابيب E-109 المتجه إلى أنابيب مرجل E-110 (دخول أفقي عدل ومحوري مستقيم في التيوب بدون أي حفر أو تداخل)',
        color: 0xf59e0b,
        radius: 0.65,
        points: [
          new THREE.Vector3(51.5, 6.2, -6.0),
          new THREE.Vector3(51.5, 8.5, -6.0),
          new THREE.Vector3(51.5, 8.5, 10.0),
          new THREE.Vector3(71.0, 8.5, 10.0), // يستقبل خط E-107 هنا على ممر الأنابيب عند مشعب التجميع
          new THREE.Vector3(72.0, 8.5, 10.0), // يمتد شرقاً
          new THREE.Vector3(72.0, 8.5, 14.0), // يتجه جنوباً نحو الممر المفتوح
          new THREE.Vector3(72.0, 6.2, 14.0), // ينزل مسبقاً لمنسوب المحور الأفقي Y=6.2 في المساحة المفتوحة
          new THREE.Vector3(72.0, 6.2, 22.0), // يصل إلى خط محور التيوب Z=22.0
          new THREE.Vector3(69.8, 6.2, 22.0)  // يدخل أفقياً وعدل ومحورياً بشكل مستقيم تماماً في فوهة أنابيب E-110
        ]
      },
      // 14. E-107 Tube Outlet (265°C) -> Exits Straight Horizontally from head, turns North to Piperack to meet E-109 Line
      // "ماكو داعي يرتبط الخط الطالع من تيوب E107 ب تيوب E110 لان هو راح يرتبط وي خط E109"
      // "الخط الطالع من تيوب E107 و رايح وي الخط مال E109 الطالع من تيوب صاير طلعته من فوك و مو عدل خلي عدل مثل خط دخول"
      // غير مرتبط بـ E-110 نهائياً: يخرج عدل ثم يذهب شمالاً لممر الأنابيب ليرتبط بخط E-109
      {
        id: 'P-114-E107-TIEIN',
        tag: '14. خط مخرج أنابيب مسخن E-107 (أفقي عدل) يتجه لممر الأنابيب ليرتبط بخط E-109 (غير مرتبط بـ E-110 نهائياً)',
        color: 0x0284c7,
        radius: 0.65,
        points: [
          new THREE.Vector3(74.5, 6.2, 22.0), // يخرج أفقياً وعدل من فوهة قبعة أنابيب E-107 الغربية
          new THREE.Vector3(74.0, 6.2, 22.0), // يمتد أفقياً
          new THREE.Vector3(74.0, 6.2, 10.0), // ينعطف شمالاً نحو ممر الأنابيب (بعيداً ومنفصلاً تماماً عن E-110)
          new THREE.Vector3(74.0, 8.5, 10.0), // يرتفع للحامل
          new THREE.Vector3(71.0, 8.5, 10.0)  // يرتبط بمشعب التجميع مع خط غاز E-109
        ]
      },
      // 15. E-110 Tube Exit (128°C) -> V-101 Knockout Condensate Drum Flanged Side Inlet
      // يخرج الغاز المبرد من أنابيب E-110 الغربية ويرتفع ليدخل فوهة V-101 بدقة بدون أي تداخل مع جسم الوعاء
      {
        id: 'P-115-E110-V101',
        tag: '15. مخرج أنابيب مرجل E-110 إلى فوهة جانب وعاء فصل المتكاثف V-101 (بدون أي تداخل)',
        color: 0x0284c7,
        radius: 0.65,
        points: [
          new THREE.Vector3(58.0, 6.2, 22.0), // يخرج أفقياً وعدل من فوهة أنابيب E-110 الغربية
          new THREE.Vector3(54.0, 6.2, 22.0), // يمتد أفقياً
          new THREE.Vector3(54.0, 7.8, 22.0),
          new THREE.Vector3(50.2, 7.8, 22.0)
        ]
      },
      // 15b. V-101 Top Gas Exit (215°C) -> Overhead Clearance -> R-105 LTS Converter Top Inlet (East Nozzle)
      {
        id: 'P-115B-V101-R105',
        tag: '15ب. قمة فاصل المتكاثف V-101 إلى قمة مفاعل التحويل الواطئ LTS R-105 (فوهة القمة الشرقية)',
        color: 0x0284c7,
        radius: 0.65,
        points: [
          new THREE.Vector3(48.0, 13.5, 22.0),
          new THREE.Vector3(48.0, 27.5, 22.0),
          new THREE.Vector3(30.0, 27.5, 22.0),
          new THREE.Vector3(30.0, 25.8, 22.0)
        ]
      },
      // 16. R-105 LTS Gas OUTLET EXITS FROM THE TOP (West Nozzle) -> Clear South Service Corridor (Z=12.0 Tier 1: Y=4.0) -> Section 200 Catacarb
      // "خط الغاز الخارج من R105 لازم من فوك و ليس من اسفل" - خروج علوي مباشر من قمة المفاعل
      {
        id: 'P-116-R105-CO2',
        tag: '16. خط الغاز الخارج من قمة مفاعل LTS R-105 (خروج علوي من فوق وليس من أسفل) متجهاً إلى قسم كاتاكارب CO2',
        color: 0x00e5aa,
        radius: 0.75,
        points: [
          new THREE.Vector3(26.0, 25.8, 22.0), // يخرج من فوهة القمة العلوية لمفاعل R-105 (من فوق وليس من أسفل)
          new THREE.Vector3(26.0, 29.5, 22.0), // يرتفع للأعلى بمسار علوي صافي (أعلى من خط الدخول بـ 2 متر)
          new THREE.Vector3(26.0, 29.5, 12.0), // ينعطف جنوباً نحو ممر الأنابيب Z=12.0
          new THREE.Vector3(26.0, 4.0, 12.0),  // ينزل إلى مسار الأنابيب Y=4.0
          new THREE.Vector3(-92.0, 4.0, 12.0)  // يمتد غرباً إلى قسم كاتاكارب (Section 200)
        ]
      },
      // 17. Return Pure Gas from Catacarb -> Corridor (Z=12.0 Tier 3: Y=8.0) -> E-106 Shell Side Bottom (77°C)
      {
        id: 'P-117-CATACARB-E106S',
        tag: '17. الغاز الخالي من CO2 من V-204 إلى غلاف مبادل E-106 (Shell Side 77°C)',
        color: 0xa855f7,
        radius: 0.65,
        points: [
          new THREE.Vector3(-92.0, 8.0, 12.0),
          new THREE.Vector3(-1.2, 8.0, 12.0),
          new THREE.Vector3(-1.2, 4.0, 12.0),
          new THREE.Vector3(-1.2, 4.0, 22.0)
        ]
      },
      // 18. E-106 Shell Exit (245°C) -> Corridor (Z=12.0 Tier 4: Y=10.0) -> E-107 Shell Inlet
      {
        id: 'P-118-E106S-E107S',
        tag: '18. مخرج شيل E-106 (245°C) عبر مسار الأنابيب إلى شيل مبادل E-107',
        color: 0xf59e0b,
        radius: 0.6,
        points: [
          new THREE.Vector3(1.2, 7.2, 22.0),
          new THREE.Vector3(1.2, 10.0, 22.0),
          new THREE.Vector3(1.2, 10.0, 12.0),
          new THREE.Vector3(81.5, 10.0, 12.0),
          new THREE.Vector3(81.5, 10.0, 22.0),
          new THREE.Vector3(81.5, 4.4, 22.0)
        ]
      },
      // 19. E-107 Shell Exit (310°C) -> Corridor (Z=12.0 Tier 5: Y=12.0) -> Approach Zone (Z=16.0) -> Overhead to R-106 Methanator Top
      // مسار مفصول ومنظم بالكامل بدون أي تقاطع أو تشابك مع خط بخار 12 أو أي معدة
      {
        id: 'P-119-E107S-R106',
        tag: '19. مخرج شيل E-107 المسخن (310°C) عبر مسار الأنابيب إلى قمة R-106 (مسار مستقل تماماً)',
        color: 0xef4444,
        radius: 0.65,
        points: [
          new THREE.Vector3(78.5, 8.0, 22.0),
          new THREE.Vector3(78.5, 12.0, 22.0),
          new THREE.Vector3(78.5, 12.0, 12.0),
          new THREE.Vector3(8.0, 12.0, 12.0),
          new THREE.Vector3(8.0, 12.0, 16.0),  // ينعطف جنوباً لمنطقة الدخول المفتوحة بعيداً عن مسارات المرافق
          new THREE.Vector3(8.0, 22.0, 16.0),  // يرتفع عمودياً بمسار علوي صافي تماماً
          new THREE.Vector3(8.0, 22.0, 22.0),  // يتجه جنوباً لمحور فوهة قمة R-106
          new THREE.Vector3(8.0, 20.0, 22.0)   // ينزل عمودياً مباشرة في فوهة قمة المفاعل العلوية
        ]
      },
      // 20. R-106 Bottom Effluent (330°C) -> E-106 Tube Side Inlet (Direct Clearance Connection)
      {
        id: 'P-120-R106-E106T',
        tag: '20. مخرج قاع R-106 (330°C) إلى أنابيب E-106 (Tube Side) لاسترجاع الحرارة',
        color: 0xef4444,
        radius: 0.65,
        points: [
          new THREE.Vector3(5.4, 6.2, 22.0),
          new THREE.Vector3(4.2, 6.2, 22.0),
          new THREE.Vector3(4.2, 5.6, 22.0),
          new THREE.Vector3(3.3, 5.6, 22.0)
        ]
      },
      // 21. E-106 Tube Side Exit (135°C) -> Corridor (Z=12.0 Tier 2: Y=6.0) -> E-301 Syngas Precooler
      {
        id: 'P-121-E106T-E301',
        tag: '21. مخرج أنابيب E-106 المبرد (135°C) إلى مبرد غاز التخليق الأولي E-301',
        color: 0x0284c7,
        radius: 0.65,
        points: [
          new THREE.Vector3(-3.3, 5.6, 22.0),
          new THREE.Vector3(-3.3, 6.0, 22.0),
          new THREE.Vector3(-3.3, 6.0, 12.0),
          new THREE.Vector3(-92.0, 6.0, 12.0)
        ]
      },
      // 22. V-109 Medium Pressure Steam (12 kg/cm²) Header along Dedicated Utility Corridor (Z=6.0, Y=16.0)
      // ممر المرافق المستقل تماماً (Z=6.0) بعيداً بمسافة 16 متراً عن R-106 و 10 أمتار عن أنبوب الدخول لمنع أي تداخل أو تشابك
      {
        id: 'P-123-V109-STEAM12',
        tag: '22. خط تصدير بخار الضغط المتوسط (MP Steam 12 kg/cm²) من V-109 عبر ممر المرافق المستقل (Z=6.0)',
        color: 0xf59e0b,
        radius: 0.55,
        points: [
          new THREE.Vector3(64.0, 18.9, 22.0), // يخرج من فوهة قمة طبلة البخار V-109
          new THREE.Vector3(64.0, 20.5, 22.0), // يرتفع للأعلى بمسار علوي صافي
          new THREE.Vector3(64.0, 20.5, 6.0),  // ينعطف شمالاً نحو ممر المرافق المستقل (Z=6.0)
          new THREE.Vector3(64.0, 16.0, 6.0),  // ينزل إلى منسوب حامل البخار الرئيسي Y=16.0
          new THREE.Vector3(-92.0, 16.0, 6.0)  // يمتد غرباً بخط مستقيم ومستقل تماماً بدون أي تقاطع أو تشابك مع R-106
        ]
      },
      // 23. High Pressure Saturated Steam Export Line (65 bar, 280°C) from Unified V-102A above E-108 & E-109
      // خط تصدير بخار مشبع عالي الضغط (65 bar / 280°C) من أعلى طبلة البخار الموحدة V-102A فوق غلايتي E-108 و E-109
      {
        id: 'P-125-STEAM65-V102A',
        tag: '23. خط تصدير بخار مشبع عالي الضغط (HP Steam 65 bar / 280°C) من أعلى طبلة V-102A الموحدة فوق E-108 و E-109',
        color: 0xf59e0b,
        radius: 0.45,
        points: [
          new THREE.Vector3(58.0, 25.4, -5.5),
          new THREE.Vector3(58.0, 25.4, 0.0),
          new THREE.Vector3(20.0, 25.4, 0.0)
        ]
      }
    ];

    pipeList.forEach((pipeData) => {
      const pipeGroup = new THREE.Group();
      pipeGroup.name = pipeData.id;

      for (let i = 0; i < pipeData.points.length - 1; i++) {
        const p1 = pipeData.points[i];
        const p2 = pipeData.points[i + 1];
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const len = dir.length();
        if (len < 0.05) continue;

        const cylGeo = new THREE.CylinderGeometry(pipeData.radius, pipeData.radius, len, 20);
        const cylMesh = new THREE.Mesh(cylGeo, this.matAluminumCladding);
        this.claddingMeshes.push(cylMesh);

        cylMesh.position.copy(p1).addScaledVector(dir, 0.5);
        const up = new THREE.Vector3(0, 1, 0);
        if (Math.abs(dir.clone().normalize().dot(up)) < 0.9999) {
          cylMesh.quaternion.setFromUnitVectors(up, dir.clone().normalize());
        } else if (dir.y < 0) {
          cylMesh.rotation.x = Math.PI;
        }
        pipeGroup.add(cylMesh);

        if (i < pipeData.points.length - 2) {
          const corner = new THREE.Mesh(new THREE.SphereGeometry(pipeData.radius, 16, 16), this.matAluminumCladding);
          corner.position.copy(p2);
          pipeGroup.add(corner);
          this.claddingMeshes.push(corner);
        }
      }

      const info: EquipmentInfo = {
        id: pipeData.id,
        tag: pipeData.id,
        name: pipeData.tag,
        arabicName: `خط أنبوب: ${pipeData.tag}`,
        type: 'piping',
        section: 'Gas Reforming & Shift (Unit 100)',
        sectionNumber: 1,
        rowNumber: 1,
        position: pipeData.points[0].clone(),
        inletStream: 'Process Feed / Steam / Gas',
        outletStream: 'Reformed Stream',
        operatingTemp: '117°C - 980°C',
        operatingPress: '28.6 - 39.5 kg/cm²G',
        catalystOrInternals: 'Thermal Insulation & Aluminum Cladding',
        description: `شبكة الأنابيب المعزولة حرارياً التابعة للمخطط 6112P-100-100: ${pipeData.tag}`
      };

      pipeGroup.userData = { equipmentId: pipeData.id, equipmentInfo: info, isClickable: true };
      this.interactiveMeshes.push(pipeGroup);
      this.group.add(pipeGroup);
    });

    // Steam-to-Carbon Injection & Mixing Station (X = -22.0, Y = 12.0, Z = -18.0)
    // حيث يحقن بخار العملية S-39 مباشرة في خط خروج الغاز من مفاعل إزالة الكبريت R-102
    const mixStationGroup = new THREE.Group();
    mixStationGroup.position.set(-22.0, 12.0, -18.0);

    const teeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 2.2, 20), this.matFlange);
    mixStationGroup.add(teeBody);

    const branchFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.4, 20), this.matFlange);
    branchFlange.rotation.x = Math.PI / 2;
    branchFlange.position.set(0, 0, 0.8);
    mixStationGroup.add(branchFlange);

    const valveBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.9), this.matAlloySteel);
    valveBody.position.set(0, 0, 1.8);
    mixStationGroup.add(valveBody);

    const actuatorStem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 12), this.matPolishedSteel);
    actuatorStem.position.set(0, 0.7, 1.8);
    mixStationGroup.add(actuatorStem);

    const actuatorDome = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.45, 20), this.matYellowSafety);
    actuatorDome.position.set(0, 1.2, 1.8);
    mixStationGroup.add(actuatorDome);

    const handwheel = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.05, 8, 20), this.matCatwalkSteel);
    handwheel.rotation.x = Math.PI / 2;
    handwheel.position.set(0, 1.5, 1.8);
    mixStationGroup.add(handwheel);

    this.registerInteractive(mixStationGroup, 'mix-s-c');
    this.group.add(mixStationGroup);
  }

  // 17. High-Contrast DCS 3D Industrial Equipment Badges Mounted on Stanchion Posts (Zero Collisions)
  private buildEquipmentBadgesAndSigns() {
    const badges = [
      { id: 'k-303', name: 'NG Compressor', tag: 'K-303 / K-303T', pos: new THREE.Vector3(-75.0, 14.0, -10.0), basePos: new THREE.Vector3(-75.0, 3.0, -10.0), color: '#38bdf8' },
      { id: 'h-101', name: 'Fired Preheater', tag: 'H-101 (400°C)', pos: new THREE.Vector3(-52.0, 24.0, -10.0), basePos: new THREE.Vector3(-52.0, 3.0, -10.0), color: '#f59e0b' },
      { id: 'r-102', name: 'Desulfurizers', tag: 'R-102 A/B (ZnO)', pos: new THREE.Vector3(-30.0, 30.0, -10.0), basePos: new THREE.Vector3(-30.0, 3.0, -10.0), color: '#0284c7' },
      { id: 'mix-s-c', name: 'Steam Mixing Station', tag: 'FRCA-103/105 (Steam Injection S/C=3.2)', pos: new THREE.Vector3(-22.0, 16.0, -14.0), basePos: new THREE.Vector3(-22.0, 3.0, -14.0), color: '#38bdf8' },
      { id: 'r-101', name: 'Primary Reformer (6 Layers / 200 Tubes / 480 Burners)', tag: 'R-101 (795°C / 6 Layers / 480 Burners)', pos: new THREE.Vector3(0.0, 36.0, -4.0), basePos: new THREE.Vector3(0.0, 3.0, -4.0), color: '#ef4444' },

      // Convection Zone Exchangers (Clean sightlines to West and East)
      { id: 'e-101', name: 'Mixed Feed Preheater', tag: 'E-101 (520°C)', pos: new THREE.Vector3(-20.0, 39.0, -46.0), basePos: new THREE.Vector3(-20.0, 3.0, -46.0), color: '#0284c7' },
      { id: 'e-102', name: 'Air Preheater', tag: 'E-102 (550°C Air)', pos: new THREE.Vector3(20.0, 34.0, -46.0), basePos: new THREE.Vector3(20.0, 3.0, -46.0), color: '#00e5aa' },
      { id: 'e-103a', name: 'Steam Superheater A', tag: 'E-103A (510°C Steam)', pos: new THREE.Vector3(-20.0, 29.0, -46.0), basePos: new THREE.Vector3(-20.0, 3.0, -46.0), color: '#f59e0b' },
      { id: 'e-103b', name: 'Steam Superheater B', tag: 'E-103B (HP Steam)', pos: new THREE.Vector3(20.0, 24.0, -46.0), basePos: new THREE.Vector3(20.0, 3.0, -46.0), color: '#f59e0b' },
      { id: 'e-104', name: 'Flue Gas WHB', tag: 'E-104 (Flue WHB)', pos: new THREE.Vector3(-20.0, 19.0, -46.0), basePos: new THREE.Vector3(-20.0, 3.0, -46.0), color: '#ef4444' },
      { id: 'e-105a', name: 'BFW Economizer A', tag: 'E-105A (BFW 220°C)', pos: new THREE.Vector3(14.0, 14.0, -36.0), basePos: new THREE.Vector3(14.0, 3.0, -36.0), color: '#38bdf8' },
      { id: 'e-105b', name: 'BFW Economizer B', tag: 'E-105B (BFW 160°C)', pos: new THREE.Vector3(-20.0, 9.0, -46.0), basePos: new THREE.Vector3(-20.0, 3.0, -46.0), color: '#38bdf8' },

      // ID Fans & Stack
      { id: 'k-101a', name: 'ID Fan Turbine', tag: 'K-101A (Turbine ID Fan)', pos: new THREE.Vector3(-8.0, 10.0, -72.0), basePos: new THREE.Vector3(-8.0, 3.0, -72.0), color: '#38bdf8' },
      { id: 'k-101b', name: 'ID Fan Motor', tag: 'K-101B (Motor ID Fan)', pos: new THREE.Vector3(8.0, 10.0, -72.0), basePos: new THREE.Vector3(8.0, 3.0, -72.0), color: '#00e5aa' },
      { id: 'st-101', name: 'Primary Flue Stack', tag: 'STACK ST-101 (70m)', pos: new THREE.Vector3(0.0, 50.0, -84.0), basePos: new THREE.Vector3(0.0, 3.0, -84.0), color: '#ef4444' },

      // Downstream Process Equipment
      { id: 'k-302', name: 'Process Air Compressor', tag: 'K-302 (Air to E-102)', pos: new THREE.Vector3(32.0, 14.0, -36.0), basePos: new THREE.Vector3(32.0, 3.0, -36.0), color: '#00e5aa' },
      { id: 'r-103', name: 'Secondary Reformer', tag: 'R-103 (980°C Autothermal)', pos: new THREE.Vector3(32.0, 44.0, -6.0), basePos: new THREE.Vector3(32.0, 3.0, -6.0), color: '#ff4500' },
      { id: 'e-108', name: 'Shell & Tube WHB', tag: 'E-108 (Reformed Gas WHB 980°C -> 365°C)', pos: new THREE.Vector3(58.0, 12.0, -18.0), basePos: new THREE.Vector3(58.0, 3.0, -18.0), color: '#38bdf8' },
      { id: 'e-109', name: 'Converted Gas WHB', tag: 'E-109 (Shifted Gas WHB 433°C -> 320°C)', pos: new THREE.Vector3(58.0, 12.0, -2.0), basePos: new THREE.Vector3(58.0, 3.0, -2.0), color: '#ef4444' },
      { id: 'v-102a', name: 'HP Steam Drum (65 bar)', tag: 'V-102A (Unified HP Steam Drum 65 bar / 280°C)', pos: new THREE.Vector3(58.0, 26.0, -10.0), basePos: new THREE.Vector3(58.0, 3.0, -10.0), color: '#00e5aa' },
      { id: 'r-104', name: 'HTS Shift Converter', tag: 'R-104 (HTS 433°C | Top In & Out - Density)', pos: new THREE.Vector3(84.0, 34.0, -6.0), basePos: new THREE.Vector3(84.0, 3.0, -6.0), color: '#0284c7' },
      { id: 'e-107', name: 'Gas/Gas Preheater', tag: 'E-107 (Gas/Gas Preheater)', pos: new THREE.Vector3(80.0, 14.0, 28.0), basePos: new THREE.Vector3(80.0, 3.0, 28.0), color: '#f59e0b' },
      { id: 'e-110', name: 'MP Steam Boiler', tag: 'E-110 (MP Boiler / V-109)', pos: new THREE.Vector3(64.0, 14.0, 28.0), basePos: new THREE.Vector3(64.0, 3.0, 28.0), color: '#00e5aa' },
      { id: 'v-109', name: 'MP Steam Drum (12 bar)', tag: 'V-109 (MP Steam 12 bar)', pos: new THREE.Vector3(64.0, 24.0, 28.0), basePos: new THREE.Vector3(64.0, 3.0, 28.0), color: '#f59e0b' },
      { id: 'v-101', name: 'Knockout Separator', tag: 'V-101 Knock Out', pos: new THREE.Vector3(48.0, 18.0, 28.0), basePos: new THREE.Vector3(48.0, 3.0, 28.0), color: '#0284c7' },
      { id: 'r-105', name: 'LTS Shift Converter', tag: 'R-105 (LTS 240°C)', pos: new THREE.Vector3(28.0, 32.0, 28.0), basePos: new THREE.Vector3(28.0, 3.0, 28.0), color: '#0284c7' },
      { id: 'e-106', name: 'Feed/Effluent Exchanger', tag: 'E-106 (Feed/Effluent)', pos: new THREE.Vector3(0.0, 14.0, 28.0), basePos: new THREE.Vector3(0.0, 3.0, 28.0), color: '#38bdf8' },
      { id: 'r-106', name: 'Methanator Reactor', tag: 'R-106 (< 5 ppm CO)', pos: new THREE.Vector3(8.0, 24.0, 28.0), basePos: new THREE.Vector3(8.0, 3.0, 28.0), color: '#a855f7' }
    ];

    badges.forEach((b) => {
      const stanchionHeight = b.pos.y - b.basePos.y;
      if (stanchionHeight > 0.5) {
        const postGeo = new THREE.CylinderGeometry(0.08, 0.08, stanchionHeight, 8);
        const post = new THREE.Mesh(postGeo, this.matAlloySteel);
        post.position.set(b.pos.x, b.basePos.y + stanchionHeight / 2, b.pos.z);
        this.group.add(post);
      }

      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 180;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0a121c';
        ctx.fillRect(0, 0, 512, 180);

        ctx.strokeStyle = b.color;
        ctx.lineWidth = 6;
        ctx.strokeRect(4, 4, 504, 172);

        ctx.fillStyle = b.color;
        ctx.font = 'bold 44px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(b.tag, 256, 68);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 32px "Cairo", sans-serif';
        ctx.fillText(b.name, 256, 134);
      }

      const tex = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, depthTest: true, depthWrite: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(b.pos);
      sprite.scale.set(7.5, 2.6, 1.0);
      this.group.add(sprite);
    });
  }

  // 18. Master DCS Operational Telemetry Display Billboard (Upright Dual Display)
  private buildDcsInfoScreens() {
    const stationGroup = new THREE.Group();
    stationGroup.name = 'Master_DCS_Station_Unit100';
    stationGroup.position.set(0, 0, 38.0);

    const pad = new THREE.Mesh(new THREE.BoxGeometry(32.0, 1.2, 8.0), this.matConcreteCurb);
    pad.position.set(0, 0.6, 0);
    stationGroup.add(pad);

    [-12.0, -4.0, 4.0, 12.0].forEach((px) => {
      const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.8, 14.0, 0.8), this.matAlloySteel);
      pylon.position.set(px, 7.0, 0);
      stationGroup.add(pylon);
    });

    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(28.0, 12.0, 1.2), this.matAlloySteel);
    cabinet.position.set(0, 12.0, 0);
    stationGroup.add(cabinet);

    const createDcsCanvas = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1536;
      canvas.height = 768;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#040d18';
      ctx.fillRect(0, 0, 1536, 768);

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 12;
      ctx.strokeRect(6, 6, 1524, 756);

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 4;
      ctx.strokeRect(18, 18, 1500, 732);

      ctx.fillStyle = 'rgba(2, 132, 199, 0.2)';
      ctx.fillRect(22, 22, 1492, 130);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 46px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🔥 قسم تحويل الغاز والإصلاح ومنطقة الحمل الحراري 3D (UNIT 100)', 768, 76);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px "IBM Plex Mono", monospace';
      ctx.fillText('IRAQ NO. 3 FERTILIZER COMPLEX - KHOR AL-ZUBAIR (OFFICIAL MANUAL DWG 6112P 100-100-00)', 768, 122);

      const columns = [
        {
          title: '1. إزالة الكبريت واللقيم',
          badge: 'S < 0.2 ppm',
          badgeColor: '#00e5aa',
          lines: [
            'PICA-001: 19 kg/cm²G (K-303)',
            'H-101 Preheater: 380°C - 400°C',
            'TIC-102 / Recycled H2 (K-301)',
            'R-102AB: Co-Mo & ZnO Pellets',
            'FCV-105: 385°C | FRCA-103: 380°C',
            'E-101 Mixed Feed: 520°C (36 kg)'
          ]
        },
        {
          title: '2. الفرن الأولي R-101',
          badge: '795°C / 31 kg',
          badgeColor: '#f59e0b',
          lines: [
            'Topsoe Box Heater / 2 Chambers',
            '200 Catalyst Tubes (HK-40 Alloy)',
            '6 Rows Wall Radiant Burners (480)',
            'Fuel Gas: 1.1 kg (PIC-106/115/117)',
            'Flue Gas: 1030°C (TRA-101-8 Alarm)',
            'Residual Methane: 9.86% vol dry'
          ]
        },
        {
          title: '3. المصلح الثانوي R-103',
          badge: '969°C / 30 kg',
          badgeColor: '#ef4444',
          lines: [
            'Process Air: 550°C (TRA-121-4)',
            'Combustion Zone: 1100°C - 1150°C',
            'Ratio Control: FRCA-107 (3:1 H2:N2)',
            'Reforming Catalyst Bed (Ni/Al2O3)',
            'Mid-Shell Exit Nozzle (Y=19.2m)',
            'Residual Methane: 0.3% vol dry'
          ]
        },
        {
          title: '4. استرجاع الطاقة والتحويل',
          badge: '71 & 12 kg Steam',
          badgeColor: '#0284c7',
          lines: [
            'E-108 WHB: 365°C -> 71 kg Steam',
            'R-104 HTS (Fe-Cr): 390°C (CO 2.8%)',
            'E-109 (71 kg) + E-107 Tube Preheater',
            'E-110 LP Boiler: 215°C -> 12 kg Steam',
            'V-101 KO Drum (Condensate Trap)',
            'R-105 LTS (Cu-Zn): 220°C (CO 0.33%)'
          ]
        }
      ];

      columns.forEach((col, idx) => {
        const x = 200 + idx * 365;
        ctx.fillStyle = 'rgba(10, 24, 40, 0.94)';
        ctx.fillRect(x - 165, 165, 330, 480);
        ctx.strokeStyle = '#1e3a5f';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 165, 165, 330, 480);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 24px "Cairo", sans-serif';
        ctx.fillText(col.title, x, 206);

        ctx.fillStyle = col.badgeColor;
        ctx.font = 'bold 26px "IBM Plex Mono", monospace';
        ctx.fillText(col.badge, x, 250);

        ctx.strokeStyle = '#1e3a5f';
        ctx.beginPath();
        ctx.moveTo(x - 145, 270);
        ctx.lineTo(x + 145, 270);
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '20px "Cairo", sans-serif';
        col.lines.forEach((l, li) => {
          ctx.fillText(l, x, 310 + li * 54);
        });
      });

      // Bottom Call-to-action
      ctx.fillStyle = 'rgba(2, 132, 199, 0.3)';
      ctx.fillRect(35, 660, 1466, 85);
      ctx.strokeStyle = '#00e5aa';
      ctx.lineWidth = 2;
      ctx.strokeRect(35, 660, 1466, 85);

      ctx.fillStyle = '#00e5aa';
      ctx.font = 'bold 28px "Cairo", sans-serif';
      ctx.fillText('🎓 انقر هنا أو على أي معدة لفتح مركز الاختبارات الأكاديمية (100 سؤال عميق مع التصحيح الفوري) ودليل التشغيل الكامل', 768, 712);

      return canvas;
    };

    const dcsCanvas = createDcsCanvas();
    const dcsTex = new THREE.CanvasTexture(dcsCanvas);
    dcsTex.needsUpdate = true;

    const frontScreenGeo = new THREE.PlaneGeometry(27.4, 11.4);
    const frontScreenMat = new THREE.MeshBasicMaterial({
      map: dcsTex,
      side: THREE.FrontSide
    });
    const frontScreen = new THREE.Mesh(frontScreenGeo, frontScreenMat);
    frontScreen.position.set(0, 12.0, 0.62);
    stationGroup.add(frontScreen);

    const rearScreen = new THREE.Mesh(frontScreenGeo, frontScreenMat);
    rearScreen.rotation.y = Math.PI;
    rearScreen.position.set(0, 12.0, -0.62);
    stationGroup.add(rearScreen);

    this.group.add(stationGroup);
  }

  private addNozzleWithFlange(group: THREE.Group, pos: THREE.Vector3, dir: THREE.Vector3, radius: number, length: number) {
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.copy(pos);

    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 20), this.matCarbonSteel);
    pipe.position.y = length / 2;
    nozzleGroup.add(pipe);

    const flange = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.5, radius * 1.5, 0.55, 24), this.matFlange);
    flange.position.y = length;
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
      name: `${equipmentId.toUpperCase()} Reforming Equipment`,
      arabicName: `معدة قسم الإصلاح والتحويل ${equipmentId.toUpperCase()}`,
      type: 'furnace',
      section: 'Gas Reforming & Shift Conversion (Unit 100)',
      sectionNumber: 1,
      rowNumber: 1,
      position: obj.position.clone(),
      inletStream: 'Natural Gas / Process Steam / Flue Gas',
      outletStream: 'Reformed Stream / Exhaust Flue Gas',
      operatingTemp: '117°C - 980°C',
      operatingPress: '28.6 - 39.5 kg/cm²G',
      catalystOrInternals: '6 Layers / Walls ABCD / 200 Catalyst Tubes / 480 Burners / Sub-floor Collector',
      description: 'فرن الإصلاح الأولي الرئيسي R-101 بست طبقات وجدارات ABCD و480 مشعل ومجمع سفلي ينقل الغاز إلى المصلح الثانوي R-103.'
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

  // Animation Update for Rotating Equipment (ID Fans & Compressor Shafts)
  public update(delta: number) {
    this.rotatingShafts.forEach((shaft) => {
      shaft.rotation.x += delta * 18.0;
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
