import * as THREE from 'three';
import { EquipmentInfo, MASTER_EQUIPMENT_DATA } from './PlantDiagramData';
import {
  createCarbonSteelTexture,
  createIndustrialCarbonSteelPipeTexture,
  createCarbonSteelBumpTexture
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
  public onSelectCallback?: (info: EquipmentInfo) => void;

  private particleSystems: Array<{
    points: THREE.Points;
    curve: THREE.CurvePath<THREE.Vector3>;
    progress: Float32Array;
    speed: number;
  }> = [];

  private rotatingShafts: THREE.Object3D[] = [];

  // Photorealistic Carbon Steel and Industrial Materials Palette
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

    // Central Multi-Tier Structural Steel Pipe Rack Corridor along East-West Axis (Z = 0)
    // Runs from X = -180 to X = +220 with wide 25m spans
    const rackBents = [-175, -150, -125, -100, -75, -50, -25, 0, 25, 50, 75, 100, 125, 150, 175, 200];
    rackBents.forEach((x) => {
      // Dual H-Columns per bent (Span Z = -5 to +5)
      [-5.0, 5.0].forEach((z) => {
        const colGeo = new THREE.BoxGeometry(0.85, 22.0, 0.85);
        const col = new THREE.Mesh(colGeo, this.matCatwalkSteel);
        col.position.set(x, 11.0, z);
        this.group.add(col);

        // Concrete Pedestal
        const footGeo = new THREE.BoxGeometry(2.2, 1.2, 2.2);
        const foot = new THREE.Mesh(footGeo, this.matConcretePad);
        foot.position.set(x, 0.6, z);
        this.group.add(foot);
      });

      // 4-Tier Transverse Steel Beams spanning between columns
      [5.0, 9.0, 13.0, 17.0].forEach((y) => {
        const beamGeo = new THREE.BoxGeometry(0.7, 0.7, 10.8);
        const beam = new THREE.Mesh(beamGeo, this.matCatwalkSteel);
        beam.position.set(x, y, 0);
        this.group.add(beam);
      });
    });

    // Longitudinal Stringers & Cable Trays along Pipe Rack Corridor
    [5.0, 9.0, 13.0, 17.0].forEach((y) => {
      [-5.0, 5.0].forEach((z) => {
        const stringerGeo = new THREE.BoxGeometry(395.0, 0.45, 0.45);
        const stringer = new THREE.Mesh(stringerGeo, this.matCatwalkSteel);
        stringer.position.set(12.5, y, z);
        this.group.add(stringer);
      });
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
  // E-201 at (-140, 7.5, -60), V-201 at (-95, 0, -60), P-206 A/B at (-95, 0, +30)
  private buildInletGasReboilerAndSeparator() {
    // E-201: Catacarb Reboiler (Horizontal Kettle Reboiler: Dia 12m, Length 30m)
    const e201 = this.createHorizontalShell(12.0, 30.0, this.matCarbonSteel);
    e201.position.set(-140, 7.5, -60);
    e201.name = 'E-201';

    // Kettle Vapor Dome
    const domeGeo = new THREE.CylinderGeometry(3.6, 3.6, 5.0, 24);
    const dome = new THREE.Mesh(domeGeo, this.matCarbonSteel);
    dome.position.set(-140, 16.0, -60);
    this.group.add(dome);

    // Nozzles
    this.addNozzleWithFlange(e201, new THREE.Vector3(-15.0, 0, 0), new THREE.Vector3(-1, 0, 0), 1.5, 4.0); // Stream 1 Tube In from LTS
    this.addNozzleWithFlange(e201, new THREE.Vector3(15.0, 0, 0), new THREE.Vector3(1, 0, 0), 1.5, 4.0); // Tube Out to V-201
    this.addNozzleWithFlange(e201, new THREE.Vector3(0, 8.5, 0), new THREE.Vector3(0, 1, 0), 1.4, 3.6); // Shell Vapor Out to T-202
    this.addNozzleWithFlange(e201, new THREE.Vector3(0, -6.0, 0), new THREE.Vector3(0, -1, 0), 1.4, 3.6); // Shell Liquid In from T-202

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

    const p206Pad = new THREE.Mesh(new THREE.BoxGeometry(16.0, 1.4, 10.0), this.matConcretePad);
    p206Pad.position.set(0, 0.7, 0);
    p206Group.add(p206Pad);

    [-4.0, 4.0].forEach((xOff) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(xOff, 1.4, 0);

      const volute = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 1.8, 24), this.matValveBlue);
      volute.rotation.z = Math.PI / 2;
      volute.position.set(0, 2.0, 0);
      pGroup.add(volute);

      const motor = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 3.8, 20), this.matCatwalkSteel);
      motor.rotation.x = Math.PI / 2;
      motor.position.set(0, 2.0, 3.2);
      pGroup.add(motor);

      this.addNozzleWithFlange(pGroup, new THREE.Vector3(0, 3.8, 0), new THREE.Vector3(0, 1, 0), 0.7, 1.8);
      this.addNozzleWithFlange(pGroup, new THREE.Vector3(0, 2.0, -2.0), new THREE.Vector3(0, 0, -1), 0.7, 1.8);

      p206Group.add(pGroup);
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
    this.addNozzleWithFlange(v204, new THREE.Vector3(0, 22.0, 0), new THREE.Vector3(0, 1, 0), 1.4, 3.6); // Gas to Methanator
    this.addNozzleWithFlange(v204, new THREE.Vector3(0, 13.0, 3.8), new THREE.Vector3(0, 0, 1), 1.4, 3.2); // Gas In from T-201
    this.addNozzleWithFlange(v204, new THREE.Vector3(0, 2.0, 0), new THREE.Vector3(0, -1, 0), 0.8, 2.0); // Bottom Drain
    this.registerInteractive(v204, 'v-204');
    this.group.add(v204);
  }

  // 5. Zone C (Machinery Bay South): Hydraulic Turbine P-201HT & Semi-Lean Pumps P-201 A,B at (-35, 0, +30)
  private buildHydraulicTurbineAndSemiLeanPumpTrain() {
    const p1Train = new THREE.Group();
    p1Train.position.set(-35, 0, 30);
    p1Train.name = 'P-201_Train';

    // Heavy Concrete Skid Foundation
    const pad = new THREE.Mesh(new THREE.BoxGeometry(32.0, 1.6, 14.0), this.matConcretePad);
    pad.position.set(0, 0.8, 0);
    p1Train.add(pad);

    // P-201HT: Hydraulic Energy Recovery Turbine
    const turbine = new THREE.Group();
    turbine.position.set(-10.0, 1.6, 0);
    const turbCasing = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 3.8, 24), this.matValveGreen);
    turbCasing.rotation.z = Math.PI / 2;
    turbCasing.position.set(0, 2.4, 0);
    turbine.add(turbCasing);

    this.addNozzleWithFlange(turbine, new THREE.Vector3(0, 2.4, -2.5), new THREE.Vector3(0, 0, -1), 1.4, 3.0); // Rich Sol'n Inlet (28 bar)
    this.addNozzleWithFlange(turbine, new THREE.Vector3(0, 5.0, 0), new THREE.Vector3(0, 1, 0), 1.4, 3.0); // Rich Sol'n Outlet (1.46 bar)
    p1Train.add(turbine);

    // Rotating Drive Shaft Coupling
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 7.0, 16), this.matPolishedSteel);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(-5.0, 4.0, 0);
    p1Train.add(shaft);
    this.rotatingShafts.push(shaft);

    // P-201 A,B: Dual Centrifugal Pump Units
    [-1.0, 9.0].forEach((xOff) => {
      const pUnit = new THREE.Group();
      pUnit.position.set(xOff, 1.6, 0);

      const casing = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 3.2, 24), this.matValveGreen);
      casing.rotation.z = Math.PI / 2;
      casing.position.set(0, 2.5, 0);
      pUnit.add(casing);

      const motor = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 5.0, 24), this.matCatwalkSteel);
      motor.rotation.x = Math.PI / 2;
      motor.position.set(0, 2.5, 3.8);
      pUnit.add(motor);

      this.addNozzleWithFlange(pUnit, new THREE.Vector3(0, 2.5, -2.8), new THREE.Vector3(0, 0, -1), 1.4, 3.0); // Suction
      this.addNozzleWithFlange(pUnit, new THREE.Vector3(0, 5.5, 0), new THREE.Vector3(0, 1, 0), 1.4, 3.0); // Discharge

      p1Train.add(pUnit);
    });

    this.registerInteractive(turbine, 'p-201ht');
    this.registerInteractive(p1Train, 'p-201ab');
    this.registerInteractive(p1Train, 'p-201');
    this.group.add(p1Train);
  }

  // 6. E-207: Semi-Lean Solution Cooler at (-35, 6.0, +65)
  private buildSemiLeanCoolerE207() {
    const e207 = this.createHorizontalShell(9.0, 24.0, this.matCarbonSteel);
    e207.position.set(-35, 6.0, 65);
    e207.name = 'E-207';

    this.addNozzleWithFlange(e207, new THREE.Vector3(0, 0, -13.0), new THREE.Vector3(0, 0, -1), 1.3, 3.0); // Sol'n In from P-201
    this.addNozzleWithFlange(e207, new THREE.Vector3(13.0, 0, 0), new THREE.Vector3(1, 0, 0), 1.3, 3.0); // Sol'n Out to T-201
    this.addNozzleWithFlange(e207, new THREE.Vector3(0, 4.8, 0), new THREE.Vector3(0, 1, 0), 1.1, 2.5); // CW Out
    this.addNozzleWithFlange(e207, new THREE.Vector3(0, -4.8, 0), new THREE.Vector3(0, -1, 0), 1.1, 2.5); // CW In

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

    // Nozzles - Strictly Separated
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(-7.6, 74.0, 0), new THREE.Vector3(-1, 0, 0), 1.4, 3.6); // Top Flash In from P-201HT
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(7.6, 78.0, 0), new THREE.Vector3(1, 0, 0), 1.1, 2.8); // Top Reflux In from P-203
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(-7.6, 44.0, 0), new THREE.Vector3(-1, 0, 0), 1.4, 3.6); // Semi-Lean Draw to P-201
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(0, 86.0, 0), new THREE.Vector3(0, 1, 0), 1.5, 4.2); // Stream 4 Acid Gas Out
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(0, 6.0, 7.6), new THREE.Vector3(0, 0, 1), 1.4, 3.8); // Lean Sol'n Bottom Out to E-204
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(-7.6, 14.0, 0), new THREE.Vector3(-1, 0, 0), 1.3, 3.2); // Reboiler 1 Draw to E-201
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(-7.6, 26.0, 0), new THREE.Vector3(-1, 0, 0), 1.3, 3.2); // Reboiler 1 Return from E-201
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(7.6, 14.0, 0), new THREE.Vector3(1, 0, 0), 1.2, 3.0); // Reboiler 2 Draw to E-202
    this.addNozzleWithFlange(t2Group, new THREE.Vector3(7.6, 26.0, 0), new THREE.Vector3(1, 0, 0), 1.2, 3.0); // Reboiler 2 Return from E-202

    this.registerInteractive(t2Group, 't-202');
    this.group.add(t2Group);
  }

  // 8. Zone D: Reboiler Thermosiphon Auxiliary Train (East / North-East)
  // E-202 at (+115, 7.0, -60), V-208 at (+115, 3.5, -25), P-207 at (+115, 0, -12)
  private buildReboilerThermosiphonTrains() {
    // E-202: Steam Reboiler (LP Steam Heated: Dia 9.5m, Length 24m)
    const e202 = this.createHorizontalShell(9.5, 24.0, this.matCarbonSteel);
    e202.position.set(115, 7.0, -60);
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

    const p207Pad = new THREE.Mesh(new THREE.BoxGeometry(8.0, 1.2, 5.0), this.matConcretePad);
    p207Pad.position.set(0, 0.6, 0);
    p207Group.add(p207Pad);

    const volute207 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1.4, 20), this.matValveBlue);
    volute207.rotation.z = Math.PI / 2;
    volute207.position.set(-1.4, 1.5, 0);
    p207Group.add(volute207);

    const motor207 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.6, 20), this.matCatwalkSteel);
    motor207.rotation.z = Math.PI / 2;
    motor207.position.set(1.4, 1.5, 0);
    p207Group.add(motor207);

    this.addNozzleWithFlange(p207Group, new THREE.Vector3(-1.4, 2.6, 0), new THREE.Vector3(0, 1, 0), 0.6, 1.5);
    this.registerInteractive(p207Group, 'p-207');
    this.group.add(p207Group);
  }

  // 9. Zone C (East Central Bay): Lean Solution Train: E-204, P-202 A,B, F-201
  // E-204 at (+35, 6.0, +65), P-202 A/B at (+35, 0, +30), F-201 at (+65, 0, +30)
  private buildLeanSolutionAndBfwExchangerTrain() {
    // E-204: Lean Solution / BFW Exchanger (Dia 9.0m, Length 22m)
    const e204 = this.createHorizontalShell(9.0, 22.0, this.matCarbonSteel);
    e204.position.set(35, 6.0, 65);
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

    const p202Pad = new THREE.Mesh(new THREE.BoxGeometry(18.0, 1.6, 11.0), this.matConcretePad);
    p202Pad.position.set(0, 0.8, 0);
    p202Group.add(p202Pad);

    [-4.5, 4.5].forEach((xOff) => {
      const pumpSub = new THREE.Group();
      pumpSub.position.set(xOff, 1.6, 0);

      // Multi-stage high pressure barrel
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 4.6, 24), this.matValveGreen);
      barrel.rotation.z = Math.PI / 2;
      barrel.position.set(0, 2.2, 0);
      pumpSub.add(barrel);

      const motor = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 5.0, 24), this.matCatwalkSteel);
      motor.rotation.z = Math.PI / 2;
      motor.position.set(4.8, 2.2, 0);
      pumpSub.add(motor);

      this.addNozzleWithFlange(pumpSub, new THREE.Vector3(-2.4, 2.2, 0), new THREE.Vector3(-1, 0, 0), 1.3, 2.5); // Suction from E-204
      this.addNozzleWithFlange(pumpSub, new THREE.Vector3(0, 4.8, 0), new THREE.Vector3(0, 1, 0), 1.3, 2.6); // Discharge (36 bar)

      p202Group.add(pumpSub);
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
  // E-205 A,B at (+160, 8.5, -60), V-203 at (+190, 0, -60), P-203 A,B at (+190, 0, -25)
  private buildAcidGasCondensersAndRefluxTrain() {
    // E-205 A,B: Overhead Acid Gas Condensers (Twin Shells: Dia 8.5m, Length 24m)
    const e205Group = new THREE.Group();
    e205Group.position.set(160, 8.5, -60);
    e205Group.name = 'E-205';

    [-5.5, 5.5].forEach((zOff) => {
      const shell = this.createHorizontalShell(8.5, 24.0, this.matCarbonSteel);
      shell.position.set(0, 0, zOff);
      this.addNozzleWithFlange(shell, new THREE.Vector3(-12.0, 0, 0), new THREE.Vector3(-1, 0, 0), 1.4, 3.0); // Stream 4 Acid Gas In
      this.addNozzleWithFlange(shell, new THREE.Vector3(12.0, 0, 0), new THREE.Vector3(1, 0, 0), 1.4, 3.0); // Out to V-203
      this.addNozzleWithFlange(shell, new THREE.Vector3(0, 4.5, 0), new THREE.Vector3(0, 1, 0), 1.1, 2.3); // CW Out
      this.addNozzleWithFlange(shell, new THREE.Vector3(0, -4.5, 0), new THREE.Vector3(0, -1, 0), 1.1, 2.3); // CW In
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

    const p203Pad = new THREE.Mesh(new THREE.BoxGeometry(15.0, 1.4, 9.0), this.matConcretePad);
    p203Pad.position.set(0, 0.7, 0);
    p203Group.add(p203Pad);

    [-3.8, 3.8].forEach((xOff) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(xOff, 1.4, 0);

      const volute = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 1.6, 24), this.matValveBlue);
      volute.rotation.z = Math.PI / 2;
      volute.position.set(0, 1.8, 0);
      pGroup.add(volute);

      const motor = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 3.5, 20), this.matCatwalkSteel);
      motor.rotation.x = Math.PI / 2;
      motor.position.set(0, 1.8, 3.0);
      pGroup.add(motor);

      this.addNozzleWithFlange(pGroup, new THREE.Vector3(0, 3.8, 0), new THREE.Vector3(0, 1, 0), 0.7, 1.8);
      this.addNozzleWithFlange(pGroup, new THREE.Vector3(0, 1.8, -1.8), new THREE.Vector3(0, 0, -1), 0.7, 1.8);

      p203Group.add(pGroup);
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

    const p208Pad = new THREE.Mesh(new THREE.BoxGeometry(15.0, 1.4, 9.0), this.matConcretePad);
    p208Pad.position.set(0, 0.7, 0);
    p208Group.add(p208Pad);

    [-3.5, 3.5].forEach((xOff) => {
      const pSub = new THREE.Group();
      pSub.position.set(xOff, 1.4, 0);
      const volute = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 1.6, 20), this.matValveBlue);
      volute.rotation.z = Math.PI / 2;
      volute.position.set(0, 1.6, 0);
      pSub.add(volute);
      p208Group.add(pSub);
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

    const p205Pad = new THREE.Mesh(new THREE.BoxGeometry(12.0, 1.2, 8.0), this.matConcretePad);
    p205Pad.position.set(0, 0.6, 0);
    p205Group.add(p205Pad);

    [-2.5, 2.5].forEach((xOff) => {
      const dPump = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.2, 2.5), this.matValvePurple);
      dPump.position.set(xOff, 2.3, 0);
      p205Group.add(dPump);
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
      // 1. Stream 1: Converted Gas from LTS R-105 -> E-201 Tube Inlet (-140, 7.5, -60)
      {
        name: 'Stream 1: Converted Gas (185°C, 28.9 bar) -> E-201 Reboiler',
        color: 0x2d4a66,
        radius: 1.35,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'STREAM 1',
        fluidLabel: 'Converted Gas (185°C)',
        points: [
          new THREE.Vector3(-185.0, 9.0, -60.0),
          new THREE.Vector3(-155.0, 9.0, -60.0),
          new THREE.Vector3(-155.0, 7.5, -60.0)
        ]
      },
      // 2. E-201 Tube Outlet (120°C) -> V-201 Separator Inlet
      {
        name: 'E-201 Tube Outlet -> V-201 Separator',
        color: 0x2d4a66,
        radius: 1.3,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'SYNGAS',
        fluidLabel: 'Gas/Condensate Mix',
        points: [
          new THREE.Vector3(-125.0, 7.5, -60.0),
          new THREE.Vector3(-110.0, 7.5, -60.0),
          new THREE.Vector3(-110.0, 15.0, -60.0),
          new THREE.Vector3(-98.8, 15.0, -60.0)
        ]
      },
      // 3. Stream 2: V-201 Overhead Vapor (127°C) -> T-201 Bottom Feed (28.2 bar)
      {
        name: 'Stream 2: V-201 Overhead Vapor -> T-201 Bottom Feed (28.2 bar)',
        color: 0x334e68,
        radius: 1.35,
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
      // 4. V-201 Bottom Condensate -> P-206 A,B Pumps Suction
      {
        name: 'V-201 Bottom Condensate -> P-206 A/B Pumps',
        color: 0x1e3a5f,
        radius: 1.0,
        speed: 0.07,
        particleColor: 0x38bdf8,
        streamTag: 'CONDENSATE',
        points: [
          new THREE.Vector3(-95.0, 2.0, -60.0),
          new THREE.Vector3(-95.0, 2.0, -35.0),
          new THREE.Vector3(-95.0, 2.0, 0.0),
          new THREE.Vector3(-95.0, 2.0, 28.0)
        ]
      },
      // 5. P-206 A,B Discharge -> V-209 Degasser Column Top Feed (110°C) via Central Pipe Rack
      {
        name: 'P-206 A/B Discharge -> V-209 Degasser Top Feed',
        color: 0x1e3a5f,
        radius: 1.0,
        speed: 0.07,
        particleColor: 0x38bdf8,
        streamTag: 'CONDENSATE TO DEGASSER',
        points: [
          new THREE.Vector3(-95.0, 3.8, 30.0),
          new THREE.Vector3(-95.0, 5.0, 30.0),
          new THREE.Vector3(-95.0, 5.0, 0.0),
          new THREE.Vector3(-18.6, 5.0, 0.0),
          new THREE.Vector3(-18.6, 5.0, 105.0),
          new THREE.Vector3(-18.6, 28.0, 105.0)
        ]
      },
      // 6. Stream 3: T-201 Overhead Purified Syngas (80°C, 28 bar) -> V-204 KO Drum
      {
        name: 'Stream 3: T-201 Overhead Purified Gas -> V-204 KO Drum',
        color: 0x2d4a66,
        radius: 1.45,
        speed: 0.09,
        particleColor: 0x67e8f9,
        streamTag: 'STREAM 3',
        fluidLabel: 'Purified Syngas (<0.1% CO2)',
        points: [
          new THREE.Vector3(-45.0, 90.0, -60.0),
          new THREE.Vector3(-45.0, 95.0, -60.0),
          new THREE.Vector3(-45.0, 95.0, -111.2),
          new THREE.Vector3(-45.0, 13.0, -111.2)
        ]
      },
      // 7. V-204 Overhead Gas -> Methanation Section 100
      {
        name: 'V-204 Overhead -> Methanation Section 100 (E-107 Feed)',
        color: 0x2d4a66,
        radius: 1.45,
        speed: 0.09,
        particleColor: 0x67e8f9,
        streamTag: 'TO METHANATOR',
        points: [
          new THREE.Vector3(-45.0, 22.0, -115.0),
          new THREE.Vector3(-45.0, 28.0, -115.0),
          new THREE.Vector3(200.0, 28.0, -115.0)
        ]
      },
      // 8. Rich Catacarb Solution: T-201 Bottom (112°C, 28.2 bar) -> Hydraulic Turbine P-201HT
      {
        name: 'T-201 Bottom Rich Soln -> P-201 HT Recovery Turbine',
        color: 0x14532d,
        radius: 1.4,
        speed: 0.08,
        particleColor: 0x34d399,
        streamTag: 'RICH SOLN',
        fluidLabel: 'Rich Catacarb (28.2 bar)',
        points: [
          new THREE.Vector3(-45.0, 6.0, -51.8),
          new THREE.Vector3(-45.0, 6.0, -35.0),
          new THREE.Vector3(-35.0, 6.0, -35.0),
          new THREE.Vector3(-35.0, 6.0, 0.0),
          new THREE.Vector3(-35.0, 6.0, 27.5),
          new THREE.Vector3(-35.0, 4.0, 27.5)
        ]
      },
      // 9. P-201HT Discharge (1.46 bar) -> T-202 Top Flash Chamber Nozzle via Central Pipe Rack
      {
        name: 'P-201 HT Discharge (1.46 bar) -> T-202 Top Flash Inlet',
        color: 0x14532d,
        radius: 1.4,
        speed: 0.08,
        particleColor: 0x34d399,
        streamTag: 'FLASH FEED',
        points: [
          new THREE.Vector3(-35.0, 5.0, 30.0),
          new THREE.Vector3(-35.0, 9.0, 30.0),
          new THREE.Vector3(-35.0, 9.0, 0.0),
          new THREE.Vector3(57.4, 9.0, 0.0),
          new THREE.Vector3(57.4, 9.0, -60.0),
          new THREE.Vector3(57.4, 74.0, -60.0)
        ]
      },
      // 10. Semi-Lean Solution: T-202 Mid Draw (114°C) -> P-201 A,B Suction
      {
        name: 'T-202 Mid Draw (114°C) -> P-201 A/B Pump Suction',
        color: 0x115e59,
        radius: 1.4,
        speed: 0.07,
        particleColor: 0x6ee7b7,
        streamTag: 'SEMI-LEAN DRAW',
        points: [
          new THREE.Vector3(57.4, 44.0, -60.0),
          new THREE.Vector3(57.4, 5.0, -60.0),
          new THREE.Vector3(-35.0, 5.0, -60.0),
          new THREE.Vector3(-35.0, 5.0, 0.0),
          new THREE.Vector3(-35.0, 5.0, 27.2),
          new THREE.Vector3(-35.0, 4.1, 27.2)
        ]
      },
      // 11. P-201 A,B Discharge (8.55 bar) -> E-207 Semi-Lean Cooler
      {
        name: 'P-201 A/B Discharge -> E-207 Cooler (8.55 bar)',
        color: 0x115e59,
        radius: 1.35,
        speed: 0.08,
        particleColor: 0x6ee7b7,
        streamTag: 'SEMI-LEAN DISCHARGE',
        points: [
          new THREE.Vector3(-35.0, 6.5, 30.0),
          new THREE.Vector3(-35.0, 6.0, 30.0),
          new THREE.Vector3(-35.0, 6.0, 52.0)
        ]
      },
      // 12. E-207 Cooler Outlet (105°C) -> T-201 Mid Bed Feed Nozzle
      {
        name: 'E-207 Outlet (105°C) -> T-201 Mid Bed Feed',
        color: 0x115e59,
        radius: 1.35,
        speed: 0.08,
        particleColor: 0x6ee7b7,
        streamTag: 'SEMI-LEAN FEED',
        points: [
          new THREE.Vector3(-22.0, 6.0, 65.0),
          new THREE.Vector3(-22.0, 9.0, 65.0),
          new THREE.Vector3(-22.0, 9.0, 0.0),
          new THREE.Vector3(-36.8, 9.0, 0.0),
          new THREE.Vector3(-36.8, 9.0, -60.0),
          new THREE.Vector3(-36.8, 52.0, -60.0)
        ]
      },
      // 13. Lean Solution: T-202 Bottom (120°C) -> E-204 BFW Exchanger Shell
      {
        name: 'T-202 Bottom Lean Soln (120°C) -> E-204 Exchanger',
        color: 0x155e75,
        radius: 1.45,
        speed: 0.07,
        particleColor: 0xa7f3d0,
        streamTag: 'LEAN SOLN',
        points: [
          new THREE.Vector3(65.0, 6.0, -52.4),
          new THREE.Vector3(65.0, 6.0, -35.0),
          new THREE.Vector3(35.0, 6.0, -35.0),
          new THREE.Vector3(35.0, 6.0, 0.0),
          new THREE.Vector3(35.0, 6.0, 54.0)
        ]
      },
      // 14. E-204 BFW Preheating Circuit (BFW In 45°C -> Out 105°C)
      {
        name: 'E-204 BFW Preheating Circuit (45°C -> 105°C)',
        color: 0x1e40af,
        radius: 1.1,
        speed: 0.08,
        particleColor: 0x38bdf8,
        streamTag: 'BFW 105°C',
        points: [
          new THREE.Vector3(35.0, 1.2, 65.0),
          new THREE.Vector3(35.0, 13.0, 65.0),
          new THREE.Vector3(35.0, 13.0, 0.0),
          new THREE.Vector3(200.0, 13.0, 0.0)
        ]
      },
      // 15. E-204 Cooled Lean Solution (80°C) -> P-202 A,B Pump Suction
      {
        name: 'E-204 Cooled Lean Soln (80°C) -> P-202 A/B Suction',
        color: 0x155e75,
        radius: 1.4,
        speed: 0.07,
        particleColor: 0xa7f3d0,
        streamTag: 'LEAN SUCTION',
        points: [
          new THREE.Vector3(46.0, 6.0, 65.0),
          new THREE.Vector3(46.0, 3.8, 65.0),
          new THREE.Vector3(46.0, 3.8, 30.0),
          new THREE.Vector3(32.6, 3.8, 30.0)
        ]
      },
      // 16. P-202 A,B Discharge (36 bar) -> F-201 Filter
      {
        name: 'P-202 A/B Discharge (36 bar) -> F-201 Filter',
        color: 0x155e75,
        radius: 1.35,
        speed: 0.08,
        particleColor: 0xa7f3d0,
        streamTag: 'HP LEAN (36 BAR)',
        points: [
          new THREE.Vector3(35.0, 6.4, 30.0),
          new THREE.Vector3(61.6, 6.4, 30.0),
          new THREE.Vector3(61.6, 6.5, 30.0)
        ]
      },
      // 17. F-201 Filtered Lean Solution -> T-201 Top Distributor (80°C) via Central Pipe Rack
      {
        name: 'F-201 Filtered Lean Soln -> T-201 Top Feed (80°C)',
        color: 0x155e75,
        radius: 1.35,
        speed: 0.08,
        particleColor: 0xa7f3d0,
        streamTag: 'LEAN TOP FEED',
        points: [
          new THREE.Vector3(68.4, 7.5, 30.0),
          new THREE.Vector3(68.4, 13.0, 30.0),
          new THREE.Vector3(68.4, 13.0, 0.0),
          new THREE.Vector3(-36.8, 13.0, 0.0),
          new THREE.Vector3(-36.8, 13.0, -60.0),
          new THREE.Vector3(-36.8, 80.0, -60.0)
        ]
      },
      // 18. Reboiler Thermosiphon 1: T-202 Bottom -> E-201 Shell -> T-202 Vapor Return
      {
        name: 'Thermosiphon Draw: T-202 -> E-201 Shell',
        color: 0x14532d,
        radius: 1.3,
        speed: 0.06,
        particleColor: 0x34d399,
        streamTag: 'REBOILER 1 LIQUID',
        points: [
          new THREE.Vector3(57.4, 14.0, -60.0),
          new THREE.Vector3(57.4, 3.0, -60.0),
          new THREE.Vector3(-140.0, 3.0, -60.0),
          new THREE.Vector3(-140.0, 1.5, -60.0)
        ]
      },
      {
        name: 'Thermosiphon Return: E-201 Boiling Vapor -> T-202',
        color: 0x14532d,
        radius: 1.35,
        speed: 0.08,
        particleColor: 0x34d399,
        streamTag: 'REBOILER 1 VAPOR',
        points: [
          new THREE.Vector3(-140.0, 16.0, -60.0),
          new THREE.Vector3(-140.0, 26.0, -60.0),
          new THREE.Vector3(57.4, 26.0, -60.0)
        ]
      },
      // 19. Reboiler Thermosiphon 2: T-202 -> E-202 LP Steam Reboiler -> T-202
      {
        name: 'Thermosiphon Loop: T-202 <-> E-202 LP Steam Reboiler',
        color: 0xb45309,
        radius: 1.25,
        speed: 0.07,
        particleColor: 0xfcd34d,
        streamTag: 'LP STEAM REBOILER',
        points: [
          new THREE.Vector3(72.6, 14.0, -60.0),
          new THREE.Vector3(115.0, 14.0, -60.0),
          new THREE.Vector3(115.0, 2.0, -60.0)
        ]
      },
      {
        name: 'E-202 Vapor Return -> T-202',
        color: 0xb45309,
        radius: 1.25,
        speed: 0.07,
        particleColor: 0xfcd34d,
        streamTag: 'E-202 VAPOR RETURN',
        points: [
          new THREE.Vector3(115.0, 12.0, -60.0),
          new THREE.Vector3(115.0, 26.0, -60.0),
          new THREE.Vector3(72.6, 26.0, -60.0)
        ]
      },
      // 20. E-202 Steam Condensate Drain -> V-208 -> P-207 -> Deaerator
      {
        name: 'E-202 Steam Condensate Drain -> V-208 -> P-207 -> Deaerator',
        color: 0x1e3a5f,
        radius: 0.9,
        speed: 0.06,
        particleColor: 0x38bdf8,
        streamTag: 'STEAM CONDENSATE',
        points: [
          new THREE.Vector3(127.0, 7.0, -60.0),
          new THREE.Vector3(127.0, 3.5, -60.0),
          new THREE.Vector3(127.0, 3.5, -25.0),
          new THREE.Vector3(120.0, 3.5, -25.0),
          new THREE.Vector3(115.0, 1.6, -25.0),
          new THREE.Vector3(115.0, 1.6, -12.0),
          new THREE.Vector3(115.0, 5.0, -12.0),
          new THREE.Vector3(115.0, 5.0, 0.0),
          new THREE.Vector3(-185.0, 5.0, 0.0)
        ]
      },
      // 21. Stream 4: T-202 Overhead Acid Gas (97°C, 1.46 bar) -> E-205 A,B Condensers
      {
        name: 'Stream 4: T-202 Overhead Acid Gas -> E-205 A/B Condensers',
        color: 0x991b1b,
        radius: 1.5,
        speed: 0.09,
        particleColor: 0xfb7185,
        streamTag: 'STREAM 4 ACID GAS',
        fluidLabel: 'CO2 / H2O Vapor (97°C)',
        points: [
          new THREE.Vector3(65.0, 86.0, -60.0),
          new THREE.Vector3(65.0, 92.0, -60.0),
          new THREE.Vector3(148.0, 92.0, -60.0),
          new THREE.Vector3(148.0, 8.5, -60.0)
        ]
      },
      // 22. E-205 Condenser Outlet (40°C) -> V-203 Acid Gas Separator
      {
        name: 'E-205 Condenser Outlet -> V-203 Separator',
        color: 0x991b1b,
        radius: 1.45,
        speed: 0.08,
        particleColor: 0xfb7185,
        streamTag: 'COOLED ACID GAS',
        points: [
          new THREE.Vector3(172.0, 8.5, -60.0),
          new THREE.Vector3(172.0, 16.0, -60.0),
          new THREE.Vector3(185.7, 16.0, -60.0)
        ]
      },
      // 23. Stream 5: V-203 Overhead Pure CO2 Gas (61,000 kg/h max) -> To Urea Unit / ATM
      {
        name: 'Stream 5: V-203 Pure CO2 Gas -> To Urea Unit / ATM',
        color: 0xb91c1c,
        radius: 1.6,
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
      // 24. Reflux Water: V-203 Bottom -> P-203 A,B Pumps -> T-202 Top Reflux
      {
        name: 'V-203 Condensate -> P-203 A/B Reflux Pumps -> T-202 Top',
        color: 0x1e3a5f,
        radius: 1.1,
        speed: 0.07,
        particleColor: 0x38bdf8,
        streamTag: 'WATER REFLUX',
        points: [
          new THREE.Vector3(190.0, 2.0, -60.0),
          new THREE.Vector3(190.0, 2.0, -25.0),
          new THREE.Vector3(190.0, 5.0, -25.0),
          new THREE.Vector3(190.0, 5.0, 0.0),
          new THREE.Vector3(72.6, 5.0, 0.0),
          new THREE.Vector3(72.6, 5.0, -60.0),
          new THREE.Vector3(72.6, 78.0, -60.0)
        ]
      },
      // 25. K-201 Stripping Air Blower -> V-209 Degasser Column Bottom Air Inlet
      {
        name: 'K-201 Stripping Air Blower -> V-209 Degasser Bottom',
        color: 0xa16207,
        radius: 0.9,
        speed: 0.08,
        particleColor: 0xfcd34d,
        streamTag: 'STRIPPING AIR',
        points: [
          new THREE.Vector3(-50.0, 2.0, 105.0),
          new THREE.Vector3(-50.0, 6.0, 105.0),
          new THREE.Vector3(-18.6, 6.0, 105.0)
        ]
      },
      // 26. Degasser System: V-209 Bottom Stripped Condensate -> E-206 Cooler -> P-208 -> CW Towers
      {
        name: 'V-209 Bottom Stripped Condensate -> E-206 Cooler -> P-208 -> CW Towers',
        color: 0x1e3a5f,
        radius: 1.1,
        speed: 0.07,
        particleColor: 0x38bdf8,
        streamTag: 'STRIPPED CONDENSATE',
        points: [
          new THREE.Vector3(-15.0, 2.0, 105.0),
          new THREE.Vector3(17.0, 2.0, 105.0),
          new THREE.Vector3(17.0, 5.0, 105.0),
          new THREE.Vector3(33.0, 5.0, 105.0),
          new THREE.Vector3(55.0, 5.0, 105.0),
          new THREE.Vector3(55.0, 3.5, 105.0),
          new THREE.Vector3(200.0, 3.5, 105.0)
        ]
      },
      // 27. Sump Recovery & Make-Up: V-205 Storage -> V-207 Sump Pit -> P-204 -> V-205 Tank
      {
        name: 'Sump & Solvent Recovery: V-207 -> P-204 -> V-205 Storage Tank',
        color: 0x14532d,
        radius: 0.85,
        speed: 0.06,
        particleColor: 0x34d399,
        streamTag: 'SOLVENT RECOVERY',
        points: [
          new THREE.Vector3(-90.0, 3.5, 105.0),
          new THREE.Vector3(-90.0, 14.0, 105.0),
          new THREE.Vector3(-128.8, 14.0, 105.0)
        ]
      },
      // 28. Anti-Foam Dosing Line: V-206 -> P-205 A,B -> Solution Pumps Suction
      {
        name: 'Anti-Foam Dosing: V-206 -> P-205 A/B -> P-201/P-202 Suction Headers',
        color: 0x6b21a8,
        radius: 0.75,
        speed: 0.06,
        particleColor: 0xc084fc,
        streamTag: 'ANTI-FOAM DOSING',
        points: [
          new THREE.Vector3(90.0, 2.0, 105.0),
          new THREE.Vector3(120.0, 2.0, 105.0),
          new THREE.Vector3(120.0, 5.0, 105.0),
          new THREE.Vector3(120.0, 5.0, 30.0),
          new THREE.Vector3(-35.0, 5.0, 30.0)
        ]
      }
    ];

    pipeDefinitions.forEach((def) => {
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
        fluidLabel: def.fluidLabel
      };

      // 1. Build perfectly straight, crisp cylinder spools along each segment (Zero Faceting / Zero Kinks)
      for (let i = 0; i < def.points.length - 1; i++) {
        const p1 = def.points[i];
        const p2 = def.points[i + 1];
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const len = dir.length();

        if (len > 0.01) {
          const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
          const cylGeo = new THREE.CylinderGeometry(def.radius, def.radius, len, 24, 1, false);
          const cylMesh = new THREE.Mesh(cylGeo, tubeMat);
          cylMesh.position.copy(mid);

          const up = new THREE.Vector3(0, 1, 0);
          const normDir = dir.clone().normalize();
          if (Math.abs(normDir.dot(up)) < 0.9999) {
            cylMesh.quaternion.setFromUnitVectors(up, normDir);
          } else if (normDir.y < 0) {
            cylMesh.rotation.x = Math.PI;
          }
          pipeGroup.add(cylMesh);
        }
      }

      // 2. Seamless spherical elbow fittings and weld-neck flanges at all 90-degree corners
      def.points.forEach((pt, idx) => {
        if (idx > 0 && idx < def.points.length - 1) {
          // Seamless polished corner union
          const elbowGeo = new THREE.SphereGeometry(def.radius * 1.015, 24, 16);
          const elbowMesh = new THREE.Mesh(elbowGeo, tubeMat);
          elbowMesh.position.copy(pt);
          pipeGroup.add(elbowMesh);

          // Weld-neck Flange ring
          const fRing = new THREE.Mesh(new THREE.CylinderGeometry(def.radius * 1.45, def.radius * 1.45, 0.45, 20), this.matFlange);
          fRing.position.copy(pt);
          pipeGroup.add(fRing);
        }

        // Structural pipe shoe support clamp when crossing pipe rack elevation (y ≈ 5.0, 9.0, 13.0, 17.0)
        if (Math.abs(pt.z) < 15.0 && pt.y > 3.0 && pt.y < 22.0) {
          const shoeGeo = new THREE.BoxGeometry(def.radius * 2.2, 0.8, def.radius * 2.2);
          const shoe = new THREE.Mesh(shoeGeo, this.matCatwalkSteel);
          shoe.position.set(pt.x, pt.y - def.radius - 0.4, pt.z);
          pipeGroup.add(shoe);
        }
      });

      // 3. Process Fluid Identification Bands (ASME A13.1)
      for (let i = 0; i < def.points.length - 1; i++) {
        const p1 = def.points[i];
        const p2 = def.points[i + 1];
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        const dist = p1.distanceTo(p2);

        if (dist > 15.0) {
          const bandGeo = new THREE.CylinderGeometry(def.radius * 1.06, def.radius * 1.06, 2.0, 20);
          const bandMat = new THREE.MeshBasicMaterial({ color: def.particleColor });
          const band = new THREE.Mesh(bandGeo, bandMat);
          band.position.copy(mid);

          const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
          const up = new THREE.Vector3(0, 1, 0);
          if (Math.abs(dir.dot(up)) < 0.99) {
            band.quaternion.setFromUnitVectors(up, dir);
          }
          pipeGroup.add(band);
        }
      }

      this.group.add(pipeGroup);

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

  // 13. High-Visibility Industrial Badges & Tags with Arabic Typography & DCS Telemetry
  private buildEquipmentBadgesAndSigns() {
    const badgeDirectory: Array<{
      tag: string;
      ar: string;
      param: string;
      pos: THREE.Vector3;
      scale?: [number, number];
    }> = [
      { tag: 'T-201', ar: 'برج امتصاص كاتاكارب T-201 (العملاق 92m)', param: '4 Packed Beds | 80°C Top | 28 bar | 92m Height', pos: new THREE.Vector3(-45, 100.0, -60), scale: [18.0, 6.8] },
      { tag: 'T-202', ar: 'برج التجريد والتنشيط T-202 (العملاق 88m)', param: 'Flash & Stripping Beds | 122°C | 1.46 bar', pos: new THREE.Vector3(65, 96.0, -60), scale: [18.0, 6.8] },
      { tag: 'E-201', ar: 'مرجل كاتاكارب الرئيسي E-201', param: '185°C -> 120°C (Tubes) | Q=42.5 Gcal/h', pos: new THREE.Vector3(-140, 22.0, -60), scale: [14.0, 5.2] },
      { tag: 'V-201', ar: 'فاصل سائل المرجل V-201', param: '127°C | 28.2 kg/cm²A', pos: new THREE.Vector3(-95, 32.0, -60), scale: [12.0, 4.4] },
      { tag: 'P-206 A,B', ar: 'مضخات حقن المتكاثف P-206', param: 'V-201 Bottom -> Degasser V-209', pos: new THREE.Vector3(-95, 8.0, 30), scale: [12.0, 4.4] },
      { tag: 'V-204', ar: 'وعاء فصل الغاز المنقى V-204', param: '80°C | 28.0 kg/cm²A -> Methanator', pos: new THREE.Vector3(-45, 28.0, -115), scale: [13.0, 4.8] },
      { tag: 'P-201 HT', ar: 'توربين استرجاع الضغط P-201 HT', param: 'Hydraulic Power Recovery (28 -> 1.46 bar)', pos: new THREE.Vector3(-45, 10.0, 30), scale: [13.0, 4.8] },
      { tag: 'P-201 A,B', ar: 'مضخات المحلول شبه النقي P-201', param: '1,280 m³/h | 8.55 bar -> E-207', pos: new THREE.Vector3(-25, 10.0, 30), scale: [13.0, 4.8] },
      { tag: 'E-207', ar: 'مبرد المحلول شبه النقي E-207', param: '114°C -> 105°C (C.W. Cooled)', pos: new THREE.Vector3(-35, 14.0, 65), scale: [12.0, 4.4] },
      { tag: 'E-204', ar: 'مبادل تسخين BFW ومبرد المحلول E-204', param: 'Lean Soln: 120°C -> 80°C | BFW: 45°C -> 105°C', pos: new THREE.Vector3(35, 14.0, 65), scale: [14.0, 5.2] },
      { tag: 'P-202 A,B', ar: 'مضخات المحلول النقي P-202', param: '36.0 kg/cm² | Lean Soln -> F-201 -> T-201 Top', pos: new THREE.Vector3(35, 10.0, 30), scale: [13.0, 4.8] },
      { tag: 'F-201', ar: 'فلتر المحلول النقي F-201', param: 'High Efficiency Cartridge Filter', pos: new THREE.Vector3(65, 18.0, 30), scale: [11.0, 4.2] },
      { tag: 'E-202', ar: 'مرجل البخار المساعد E-202', param: 'LP Steam (145°C) -> 122°C Boiled Soln', pos: new THREE.Vector3(115, 18.0, -60), scale: [12.0, 4.4] },
      { tag: 'V-208', ar: 'وعاء متكثف بخار المرجل V-208', param: 'Steam Condensate Recovery Drum', pos: new THREE.Vector3(115, 9.0, -25), scale: [12.0, 4.4] },
      { tag: 'P-207', ar: 'مضخة متكثف البخار P-207', param: 'Condensate -> Deaerator V-103', pos: new THREE.Vector3(115, 6.0, -12), scale: [11.0, 4.2] },
      { tag: 'E-205 A,B', ar: 'مكثفات غاز CO2 العلوي E-205', param: '97°C -> 40°C | Dual Condenser Bank', pos: new THREE.Vector3(160, 22.0, -60), scale: [13.0, 4.8] },
      { tag: 'V-203', ar: 'فاصل الغاز الحامضي V-203', param: '40°C | 1.46 bar | Pure CO2 to Urea Unit', pos: new THREE.Vector3(190, 34.0, -60), scale: [13.0, 4.8] },
      { tag: 'P-203 A,B', ar: 'مضخات الراجع P-203', param: 'Condensed Water Reflux -> T-202 Top', pos: new THREE.Vector3(190, 8.0, -25), scale: [12.0, 4.4] },
      { tag: 'V-205', ar: 'خزان محلول كاتاكارب الرئيسي V-205', param: 'Catacarb Solution Bulk Storage (22m Dia)', pos: new THREE.Vector3(-140, 28.0, 105), scale: [15.0, 5.6] },
      { tag: 'V-207', ar: 'حوض التجميع السفلي V-207', param: 'Sump Collection Pit & Drainage', pos: new THREE.Vector3(-90, 8.0, 105), scale: [12.0, 4.4] },
      { tag: 'P-204', ar: 'مضخة حوض التجميع P-204', param: 'Submersible Sump Pump -> V-205', pos: new THREE.Vector3(-90, 12.0, 105), scale: [11.0, 4.2] },
      { tag: 'K-201', ar: 'منفاخ هواء التجريد K-201', param: 'Degasser Stripping Air Blower', pos: new THREE.Vector3(-50, 8.0, 105), scale: [11.0, 4.2] },
      { tag: 'V-209', ar: 'برج نزع غاز المتكاثف V-209', param: 'Condensate Degasser & Stripping Column', pos: new THREE.Vector3(-15, 42.0, 105), scale: [12.0, 4.4] },
      { tag: 'E-206', ar: 'مبرد المتكاثف المعالج E-206', param: 'Stripped Condensate Cooler (90°C -> 45°C)', pos: new THREE.Vector3(25, 11.0, 105), scale: [12.0, 4.4] },
      { tag: 'P-208 A,B', ar: 'مضخات تصريف المتكاثف P-208', param: 'Treated Condensate -> CW Tower Make-up', pos: new THREE.Vector3(55, 8.0, 105), scale: [12.0, 4.4] },
      { tag: 'V-206', ar: 'خزان مانع الرغوة V-206', param: 'Chemical Anti-Foam Preparation', pos: new THREE.Vector3(90, 12.0, 105), scale: [11.0, 4.2] },
      { tag: 'P-205 A,B', ar: 'مضخات حقن مانع الرغوة P-205', param: 'Precision Chemical Dosing', pos: new THREE.Vector3(120, 8.0, 105), scale: [11.0, 4.2] }
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

    ctx.fillStyle = '#050b14';
    ctx.fillRect(0, 0, 2048, 1024);

    ctx.strokeStyle = '#00e5aa';
    ctx.lineWidth = 14;
    ctx.strokeRect(6, 6, 2036, 1012);

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 2008, 984);

    ctx.fillStyle = 'rgba(0, 229, 170, 0.15)';
    ctx.fillRect(24, 24, 2000, 90);

    ctx.fillStyle = '#00e5aa';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('🧪 المخطط التشغيلي والتدفق التكنولوجي لقسم إزالة واستخلاص CO₂ كاتاكارب (القسم 200)', 50, 75);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('CO2 REMOVAL SECTION - CATACARB SYSTEM (SECTION 200 - DWG 6112P-100-200-00)', 920, 75);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('● برج الامتصاص T-201: ارتفاع 96m (4 طبقات حشوات) | إزالة CO2 إلى أقل من 0.1%', 50, 105);

    ctx.fillStyle = '#f59e0b';
    ctx.fillText('● برج التجريد T-202: استرجاع الطاقة الهيدروليكية عبر توربين P-201 HT', 850, 105);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('● إنتاجية غاز CO2 النقي إلى وحدة اليوريا: 61,000 kg/h', 1520, 105);

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

    this.group.add(screenGroup);
  }

  // --- Geometry Construction Helpers ---

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

  public update(delta: number) {
    // Dynamic Fluid Particle Loop Animation
    this.particleSystems.forEach((sys) => {
      const positions = sys.points.geometry.attributes.position.array as Float32Array;
      const count = sys.progress.length;

      for (let i = 0; i < count; i++) {
        sys.progress[i] += delta * sys.speed;
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

    // Rotating Shafts Simulation
    this.rotatingShafts.forEach((shaft) => {
      shaft.rotation.x += delta * 15.0;
    });
  }
}
