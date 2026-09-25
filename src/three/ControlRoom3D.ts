import * as THREE from 'three';
import {
  createFloorTileTexture,
  createCeilingTexture,
  createVintageGreenPanelTexture,
  createAnnunciatorTexture,
  createDCSMonitorTexture,
} from './TextureGenerator';

export interface Hotspot3D {
  id: string;
  name: string;
  description: string;
  position: THREE.Vector3;
  targetCameraPos: THREE.Vector3;
  targetCameraLookAt: THREE.Vector3;
  mesh?: THREE.Mesh;
}

export class ControlRoom3D {
  public group: THREE.Group;
  public hotspots: Hotspot3D[] = [];
  public clockDigitalMesh!: THREE.Mesh;
  public interactiveObjects: THREE.Object3D[] = [];

  // Enlarged spacious room dimensions
  private roomW = 44; // Length (X)
  private roomD = 28; // Depth (Z)
  private roomH = 6.5; // Ceiling Height (Y)

  constructor() {
    this.group = new THREE.Group();
    this.buildRoomStructure();
    this.buildVintagePanelWall();
    this.buildDCSWallPanels();
    this.buildMainControlDesk();
    this.buildSupervisorDesk();
    this.buildAirConditionersAndCabinets();
    this.buildWindowsAndPlantView();
    this.createHotspots();
  }

  // 1. Room Shell (Enlarged Floor, No-Flicker Ceiling, Realistic Walls & Courtyard Ground)
  private buildRoomStructure() {
    const roomW = this.roomW;
    const roomD = this.roomD;
    const roomH = this.roomH;

    // Outdoor Asphalt/Concrete Courtyard Ground Slab (Extends between Control Room & Plant)
    const courtyardGeo = new THREE.BoxGeometry(160, 0.2, 180);
    const courtyardMat = new THREE.MeshStandardMaterial({
      color: 0x3a4245,
      roughness: 0.85,
    });
    const courtyard = new THREE.Mesh(courtyardGeo, courtyardMat);
    courtyard.position.set(0, -0.15, 50);
    courtyard.receiveShadow = true;
    this.group.add(courtyard);

    // Safety Road Marking Line outside Control Room
    const roadLine = new THREE.Mesh(
      new THREE.BoxGeometry(80, 0.02, 0.4),
      new THREE.MeshBasicMaterial({ color: 0xffcc00 })
    );
    roadLine.position.set(0, 0.01, roomD / 2 + 5.0);
    this.group.add(roadLine);

    // Interior Floor (Epoxy terrazzo)
    const floorGeo = new THREE.PlaneGeometry(roomW, roomD);
    const floorTex = createFloorTileTexture();
    floorTex.repeat.set(22, 14);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.25,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.group.add(floor);

    // Ceiling plane - NO FLICKER / NO Z-FIGHTING (Single sided, no receiveShadow acne, depthWrite)
    const ceilGeo = new THREE.PlaneGeometry(roomW, roomD);
    const ceilTex = createCeilingTexture();
    ceilTex.repeat.set(22, 14);
    const ceilMat = new THREE.MeshStandardMaterial({
      map: ceilTex,
      roughness: 0.95,
      color: 0xf4f7f5,
      side: THREE.FrontSide, // FrontSide prevents double-face depth ambiguity
    });
    const ceil = new THREE.Mesh(ceilGeo, ceilMat);
    ceil.position.y = roomH;
    ceil.rotation.x = Math.PI / 2;
    ceil.receiveShadow = false; // Disable shadow acne noise on ceiling surface
    this.group.add(ceil);

    // Exterior Roof Concrete Slab Structure (Positioned safely above ceiling plane)
    const roofSlab = new THREE.Mesh(
      new THREE.BoxGeometry(roomW + 0.8, 0.5, roomD + 0.8),
      new THREE.MeshStandardMaterial({ color: 0x3d4749, roughness: 0.8 })
    );
    roofSlab.position.set(0, roomH + 0.35, 0); // Bottom face is at roomH + 0.1m, no z-fighting
    this.group.add(roofSlab);

    // Recessed Fluorescent Light Fixtures Grid on Ceiling
    const lightGeo = new THREE.PlaneGeometry(2.2, 1.0);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xfffdf2, depthWrite: true });

    for (let x = -18; x <= 18; x += 6) {
      for (let z = -10; z <= 10; z += 5) {
        const lightMesh = new THREE.Mesh(lightGeo, lightMat);
        lightMesh.position.set(x, roomH - 0.05, z); // 5cm below ceiling plane
        lightMesh.rotation.x = Math.PI / 2;
        this.group.add(lightMesh);

        const pLight = new THREE.PointLight(0xfff8e7, 0.4, 18);
        pLight.position.set(x, roomH - 0.4, z);
        this.group.add(pLight);
      }
    }

    // Interior & Exterior Wall Materials
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xc2cecf, // Industrial mint grey
      roughness: 0.5,
    });

    const extWallMat = new THREE.MeshStandardMaterial({
      color: 0x364143, // Dark concrete exterior finish
      roughness: 0.8,
    });

    // Back Wall (Z = -roomD/2)
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
    backWall.position.set(0, roomH / 2, -roomD / 2);
    this.group.add(backWall);

    // Front Wall (Z = roomD/2) with Entrance Double Doors & Panoramic Plant Observation Window
    const frontWallLeft = new THREE.Mesh(new THREE.PlaneGeometry(roomW / 2 - 4.0, roomH), wallMat);
    frontWallLeft.position.set(-roomW / 4 - 2.0, roomH / 2, roomD / 2);
    frontWallLeft.rotation.y = Math.PI;
    this.group.add(frontWallLeft);

    const frontWallRight = new THREE.Mesh(new THREE.PlaneGeometry(roomW / 2 - 4.0, roomH), wallMat);
    frontWallRight.position.set(roomW / 4 + 2.0, roomH / 2, roomD / 2);
    frontWallRight.rotation.y = Math.PI;
    this.group.add(frontWallRight);

    // Entrance Double Doors on Front Wall
    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 3.8, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x111111 })
    );
    doorFrame.position.set(-15, 1.9, roomD / 2 - 0.1);
    this.group.add(doorFrame);

    // Left Wall (X = -roomW/2)
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
    leftWall.position.set(-roomW / 2, roomH / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    this.group.add(leftWall);

    // Right Wall (X = roomW/2)
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
    rightWall.position.set(roomW / 2, roomH / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    this.group.add(rightWall);

    // Baseboards around floor
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x2e3833 });
    const trimBack = new THREE.Mesh(new THREE.BoxGeometry(roomW, 0.2, 0.05), trimMat);
    trimBack.position.set(0, 0.1, -roomD / 2 + 0.025);
    this.group.add(trimBack);
  }

  // 2. Vintage Japanese Green Control Panel Wall (All 9 Sections: Ammonia I -> IX)
  private buildVintagePanelWall() {
    const roomD = this.roomD;
    const wallZ = -roomD / 2 + 0.3; // -13.7
    const panelW = 1.6;
    const panelH = 3.6;
    const panelD = 0.5;

    const secTitles = [
      { id: 'I', title: 'Deaerator & BFW System' },
      { id: 'II', title: 'Primary Reformer H-101 / F-101' },
      { id: 'III', title: 'Methanator R-106 & CO Shift' },
      { id: 'IV', title: 'CO2 Absorber C-101 & Catacarb' },
      { id: 'V', title: 'CO2 Compressor K-501' },
      { id: 'VI', title: 'Process Air & NG Compressors' },
      { id: 'VII', title: 'SynGas Compressor K-301' },
      { id: 'VIII', title: 'Ammonia Converter R-301' },
      { id: 'IX', title: 'Refrigeration K-401 & Storage' },
    ];

    const annunciatorTex = createAnnunciatorTexture();
    const startX = -15.5;

    for (let i = 0; i < 9; i++) {
      const px = startX + i * 1.95;
      const secInfo = secTitles[i];

      const vintageTex = createVintageGreenPanelTexture(secInfo.title, secInfo.id);
      const panelMat = new THREE.MeshStandardMaterial({
        map: vintageTex,
        roughness: 0.35,
        metalness: 0.2,
      });

      const panelMesh = new THREE.Mesh(new THREE.BoxGeometry(panelW, panelH, panelD), panelMat);
      panelMesh.position.set(px, panelH / 2 + 0.4, wallZ);
      this.group.add(panelMesh);
      this.interactiveObjects.push(panelMesh);

      // Top Annunciator warning light grid
      const annMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.4, 0.65),
        new THREE.MeshBasicMaterial({ map: annunciatorTex })
      );
      annMesh.position.set(px, panelH / 2 + 1.4, wallZ + panelD / 2 + 0.01);
      this.group.add(annMesh);

      // Analog Needle Dial Gauges (Rows of circular meters)
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const dialRadius = 0.14;
          const dialGeo = new THREE.CylinderGeometry(dialRadius, dialRadius, 0.03, 24);
          const dialMat = new THREE.MeshStandardMaterial({ color: 0xf4f0e6, roughness: 0.2 });
          const dial = new THREE.Mesh(dialGeo, dialMat);
          dial.rotation.x = Math.PI / 2;
          dial.position.set(
            px - 0.45 + c * 0.45,
            panelH / 2 + 0.6 - r * 0.4,
            wallZ + panelD / 2 + 0.02
          );
          this.group.add(dial);

          const needleGeo = new THREE.BoxGeometry(0.012, 0.11, 0.005);
          const needleMat = new THREE.MeshBasicMaterial({ color: 0xcc0000 });
          const needle = new THREE.Mesh(needleGeo, needleMat);
          needle.position.set(0, 0.03, 0.02);
          needle.rotation.z = (Math.random() - 0.5) * 1.2;
          dial.add(needle);
        }
      }

      // Middle Chart Recorders
      const chartGeo = new THREE.BoxGeometry(0.4, 0.55, 0.05);
      const chartMat = new THREE.MeshStandardMaterial({ color: 0x111e15, roughness: 0.1 });
      const chart1 = new THREE.Mesh(chartGeo, chartMat);
      chart1.position.set(px - 0.35, panelH / 2 - 0.45, wallZ + panelD / 2 + 0.02);
      this.group.add(chart1);

      const chart2 = new THREE.Mesh(chartGeo, chartMat);
      chart2.position.set(px + 0.35, panelH / 2 - 0.45, wallZ + panelD / 2 + 0.02);
      this.group.add(chart2);

      // Bottom Row Push Buttons / Switches
      for (let b = 0; b < 6; b++) {
        const btnGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.03, 12);
        const btnColor = b % 3 === 0 ? 0xcc0000 : b % 3 === 1 ? 0x00cc44 : 0xffaa00;
        const btnMat = new THREE.MeshStandardMaterial({ color: btnColor });
        const btn = new THREE.Mesh(btnGeo, btnMat);
        btn.rotation.x = Math.PI / 2;
        btn.position.set(px - 0.55 + b * 0.22, panelH / 2 - 1.1, wallZ + panelD / 2 + 0.02);
        this.group.add(btn);
      }
    }

    // Top Digital Red Status Clock
    const clockFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.6, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x111111 })
    );
    clockFrame.position.set(-6.0, 5.2, wallZ + 0.1);
    this.group.add(clockFrame);

    const clockCanvas = document.createElement('canvas');
    clockCanvas.width = 256;
    clockCanvas.height = 80;
    const cctx = clockCanvas.getContext('2d')!;
    cctx.fillStyle = '#000000';
    cctx.fillRect(0, 0, 256, 80);
    cctx.fillStyle = '#ff1100';
    cctx.font = 'bold 36px Courier New, monospace';
    cctx.textAlign = 'center';
    cctx.textBaseline = 'middle';
    cctx.fillText('10:24:35', 128, 40);

    const clockTex = new THREE.CanvasTexture(clockCanvas);
    const clockMat = new THREE.MeshBasicMaterial({ map: clockTex });
    const clockMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.5), clockMat);
    clockMesh.position.set(-6.0, 5.2, wallZ + 0.16);
    this.group.add(clockMesh);
    this.clockDigitalMesh = clockMesh;
  }

  // 3. Modern DCS Wall Panels (Mitsubishi MHI panels)
  private buildDCSWallPanels() {
    const roomD = this.roomD;
    const startX = 4.0;
    const wallZ = -roomD / 2 + 0.8; // -13.2

    for (let i = 0; i < 5; i++) {
      const px = startX + i * 2.2;
      const boardGeo = new THREE.BoxGeometry(1.8, 3.2, 0.4);
      const boardMat = new THREE.MeshStandardMaterial({
        color: 0x222a33,
        roughness: 0.4,
      });
      const board = new THREE.Mesh(boardGeo, boardMat);
      board.position.set(px, 2.6, wallZ + 0.2);
      this.group.add(board);

      // Display screen
      const scrTex = createDCSMonitorTexture(`UNIT SECTION 0${i + 1}`, `SECTION-${i + 1}`);
      const scrMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.6, 1.2),
        new THREE.MeshBasicMaterial({ map: scrTex })
      );
      scrMesh.position.set(px, 3.0, wallZ + 0.42);
      this.group.add(scrMesh);
    }
  }

  // 4. Main Control Console Desk & Operator Workstations
  private buildMainControlDesk() {
    const deskGroup = new THREE.Group();

    // Large Angled Front Console Desk
    const deskTopGeo = new THREE.BoxGeometry(7.5, 0.15, 2.6);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x93a28f, // Retro grey-green metal
      roughness: 0.3,
      metalness: 0.2,
    });
    const deskTop = new THREE.Mesh(deskTopGeo, deskMat);
    deskTop.position.set(-2.0, 0.85, -6.5);
    deskTop.rotation.x = 0.15; // Slanted top control surface
    deskGroup.add(deskTop);

    // Desk Base
    const baseGeo = new THREE.BoxGeometry(7.2, 0.8, 2.2);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x4a5548 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(-2.0, 0.4, -6.5);
    deskGroup.add(base);

    // Slanted Panel Controls
    for (let c = 0; c < 10; c++) {
      for (let r = 0; r < 3; r++) {
        const meterGeo = new THREE.BoxGeometry(0.4, 0.05, 0.4);
        const meterMat = new THREE.MeshStandardMaterial({ color: 0x111c14 });
        const meter = new THREE.Mesh(meterGeo, meterMat);
        meter.position.set(-5.0 + c * 0.65, 0.95, -7.3 + r * 0.5);
        meter.rotation.x = 0.15;
        deskGroup.add(meter);
      }
    }

    // Desk Telephone Handset
    const phoneGeo = new THREE.BoxGeometry(0.3, 0.1, 0.35);
    const phoneMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const phone = new THREE.Mesh(phoneGeo, phoneMat);
    phone.position.set(-5.2, 0.98, -5.2);
    deskGroup.add(phone);

    // Logbook Binder on Desk
    const bookGeo = new THREE.BoxGeometry(0.5, 0.04, 0.6);
    const bookMat = new THREE.MeshStandardMaterial({ color: 0xe8e4d8 });
    const book = new THREE.Mesh(bookGeo, bookMat);
    book.position.set(-0.8, 0.98, -5.5);
    book.rotation.y = 0.2;
    deskGroup.add(book);

    // Operator Executive Leather Chairs
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });

    for (let ch = 0; ch < 2; ch++) {
      const chairGroup = new THREE.Group();
      const cx = -4.0 + ch * 4.0;
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.7), leatherMat);
      seat.position.set(cx, 0.55, -4.5);
      chairGroup.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.8, 0.1), leatherMat);
      back.position.set(cx, 1.0, -4.2);
      chairGroup.add(back);

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 12), chromeMat);
      stem.position.set(cx, 0.25, -4.5);
      chairGroup.add(stem);

      deskGroup.add(chairGroup);
    }

    // Modern Curved Multi-Monitor DCS Workstation Desk
    const curveDeskMat = new THREE.MeshStandardMaterial({
      color: 0xc2c9c0,
      roughness: 0.4,
    });
    const curveDeskGeo = new THREE.BoxGeometry(11.0, 0.1, 2.2);
    const curveDesk = new THREE.Mesh(curveDeskGeo, curveDeskMat);
    curveDesk.position.set(7.5, 0.8, -5.5);
    curveDesk.rotation.y = -0.15;
    deskGroup.add(curveDesk);

    // 6 Flat-Panel LCD Monitors on Workstation Desk
    for (let m = 0; m < 6; m++) {
      const monGroup = new THREE.Group();
      const frameGeo = new THREE.BoxGeometry(1.1, 0.65, 0.05);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x111820 });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      monGroup.add(frame);

      const scrTex = createDCSMonitorTexture(`DCS MONITOR 0${m + 1}`, `P&ID-SYS-${m + 1}`);
      const scrMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.05, 0.6),
        new THREE.MeshBasicMaterial({ map: scrTex })
      );
      scrMesh.position.z = 0.028;
      monGroup.add(scrMesh);

      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.25, 12), frameMat);
      stand.position.set(0, -0.4, -0.05);
      monGroup.add(stand);

      monGroup.position.set(3.0 + m * 1.7, 1.35, -5.5 - m * 0.1);
      monGroup.rotation.y = -0.15 + (m - 2.5) * 0.15;
      deskGroup.add(monGroup);
    }

    this.group.add(deskGroup);
  }

  // 5. Supervisor Wooden Desk
  private buildSupervisorDesk() {
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x543623, // Dark polished mahogany wood
      roughness: 0.4,
    });

    const deskGeo = new THREE.BoxGeometry(2.6, 0.8, 1.4);
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(-15.0, 0.4, 0.0);
    this.group.add(desk);

    // Monitor on supervisor desk
    const monFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.5, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x151515 })
    );
    monFrame.position.set(-15.0, 1.15, 0.0);
    this.group.add(monFrame);

    // Desk Lamp
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16), lampMat);
    lampBase.position.set(-15.8, 0.82, 0.3);
    this.group.add(lampBase);
  }

  // 6. Air Conditioning Units & Switchgear Cabinets
  private buildAirConditionersAndCabinets() {
    const acMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      roughness: 0.5,
    });

    for (let i = 0; i < 3; i++) {
      const acGeo = new THREE.BoxGeometry(1.0, 2.8, 0.7);
      const acUnit = new THREE.Mesh(acGeo, acMat);
      acUnit.position.set(16.0 + i * 1.5, 1.4, -12.0);
      this.group.add(acUnit);

      const louverMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
      const louver = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.5, 0.02), louverMat);
      louver.position.set(16.0 + i * 1.5, 2.3, -11.64);
      this.group.add(louver);
    }
  }

  // 7. Large Observation Windows Overlooking Plant Outside
  private buildWindowsAndPlantView() {
    const roomW = this.roomW;
    const roomD = this.roomD;

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x2a332d,
      roughness: 0.3,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xddf5ff,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      transmission: 0.9,
    });

    // Front Wall Panoramic Window Facing Plant Outside
    const windowW = 16.0;
    const windowH = 4.0;

    const frameFront = new THREE.Mesh(new THREE.BoxGeometry(windowW, windowH, 0.12), frameMat);
    frameFront.position.set(0, 3.2, roomD / 2 - 0.06);
    this.group.add(frameFront);

    const glassFront = new THREE.Mesh(new THREE.PlaneGeometry(windowW - 0.2, windowH - 0.2), glassMat);
    glassFront.position.set(0, 3.2, roomD / 2 - 0.01);
    this.group.add(glassFront);

    // Right Wall Window
    const windowRightW = 12.0;
    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(windowRightW, windowH, 0.12), frameMat);
    frameRight.position.set(roomW / 2 - 0.06, 3.2, 0);
    frameRight.rotation.y = -Math.PI / 2;
    this.group.add(frameRight);

    const glassRight = new THREE.Mesh(new THREE.PlaneGeometry(windowRightW - 0.2, windowH - 0.2), glassMat);
    glassRight.position.set(roomW / 2 - 0.01, 3.2, 0);
    glassRight.rotation.y = -Math.PI / 2;
    this.group.add(glassRight);
  }

  // 8. Create Hotspot Pins for All 9 Japanese Control Panel Sections (AMMONIA I -> IX)
  private createHotspots() {
    const roomD = this.roomD;
    const wallZ = -roomD / 2 + 0.3; // -13.7
    const startX = -15.5;

    const sectionsInfo = [
      {
        id: 'I',
        name: 'AMMONIA — I (Deaerator & BFW System)',
        desc: 'مسيطر الضغط PICA-151, حرارة البخار TICA-152, منسوب الـDrum LA-155, تدفق الماعز FRCA-153.',
      },
      {
        id: 'II',
        name: 'AMMONIA — II (Primary Reformer H-101 / F-101)',
        desc: 'ضغط الوقود PICA-101HL, تدفق الغاز الطبيعي FRQA-101, حرارة المسخن TA-102, درجة حرارة الكبريت TRA-121.',
      },
      {
        id: 'III',
        name: 'AMMONIA — III (Methanator R-106 & CO Shift)',
        desc: 'تدفق البخار FRCA-103, حرارة الميثانيتر TA-121, نسبة CH4 المحولة ARA-101, تركيز CO2 المتبقي ARA-122.',
      },
      {
        id: 'IV',
        name: 'AMMONIA — IV (CO2 Absorber C-101 & Catacarb)',
        desc: 'تدفق كاتاكارب FRCA-201, منسوب ممتص CO2 LRC-202, ضغط المنشط PICA-206, حرارة المحلول TICA-203.',
      },
      {
        id: 'V',
        name: 'AMMONIA — V (CO2 Compressor K-501)',
        desc: 'تدفق المرحلة الأولى FRCA-502, ضغط المرحلة 4 PRCA-504, سرعة الكومبريسر SR-501 (9562 rpm).',
      },
      {
        id: 'VI',
        name: 'AMMONIA — VI (Process Air K-302 & NG K-303)',
        desc: 'تدفق الغاز FRCA-301, ضغط التفريغ PRCA-301, سرعة K-303 SR-301, سرعة كومبريسر الهواء SR-311.',
      },
      {
        id: 'VII',
        name: 'AMMONIA — VII (SynGas Compressor K-301)',
        desc: 'تدفق سحب 1st Stg FRCA-331, منسوب الفاصل LICA-408, سرعة كومبريسر غاز التخليق SR-331 (11774 rpm).',
      },
      {
        id: 'VIII',
        name: 'AMMONIA — VIII (Ammonia Converter R-301 & H-401)',
        desc: 'حرارات طبقات مفاعل الأمونيا TRC-402, TRC-403, TRC-404, فرق الضغط PdI-409, وقود المسخن PIC-406.',
      },
      {
        id: 'IX',
        name: 'AMMONIA — IX (Refrigeration K-401 & Storage)',
        desc: 'تدفق التبريد FRCA-421, حرارة السحب TICA-421, إنتاج الأمونيا السائلة FRQ-425, حموضة الماء A1CA-791.',
      },
    ];

    this.hotspots = sectionsInfo.map((sec, idx) => {
      const px = startX + idx * 1.95;
      return {
        id: sec.id,
        name: sec.name,
        description: sec.desc,
        position: new THREE.Vector3(px, 2.5, wallZ + 0.3),
        targetCameraPos: new THREE.Vector3(px, 2.0, wallZ + 3.5),
        targetCameraLookAt: new THREE.Vector3(px, 2.2, wallZ),
      };
    });

    // Create glowing 3D pin meshes for hotspots
    const pinGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0x00e5aa });

    this.hotspots.forEach((hs) => {
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(hs.position);
      this.group.add(pinMesh);
      hs.mesh = pinMesh;
      this.interactiveObjects.push(pinMesh);
    });
  }

  public update(timeSec: number) {
    // Pulse hotspot pins
    this.hotspots.forEach((hs) => {
      if (hs.mesh) {
        const scale = 1.0 + Math.sin(timeSec * 4) * 0.15;
        hs.mesh.scale.set(scale, scale, scale);
      }
    });

    // Update Digital Clock LED text
    if (this.clockDigitalMesh) {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const timeStr = `${h}:${m}:${s}`;

      const canvas = (this.clockDigitalMesh.material as THREE.MeshBasicMaterial).map!
        .image as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 256, 80);
        ctx.fillStyle = '#ff1100';
        ctx.font = 'bold 36px Courier New, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(timeStr, 128, 40);
        (
          this.clockDigitalMesh.material as THREE.MeshBasicMaterial
        ).map!.needsUpdate = true;
      }
    }
  }
}
