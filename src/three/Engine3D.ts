import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ControlRoom3D, Hotspot3D } from './ControlRoom3D';
import { AmmoniaPlant3D } from './AmmoniaPlant3D';
import { EquipmentInfo, MASTER_EQUIPMENT_DATA } from './PlantDiagramData';

export type ViewMode3D = 'control_room' | 'plant_overview' | 'combined' | 'top_layout';

export class Engine3D {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls;

  public controlRoom: ControlRoom3D;
  public plant: AmmoniaPlant3D;

  private container: HTMLElement;
  private animFrameId: number = 0;
  private isRunning: boolean = false;
  private currentMode: ViewMode3D = 'plant_overview';

  // Target camera lerp animation
  private isCameraLerping: boolean = false;
  private targetCamPos = new THREE.Vector3();
  private targetCamLookAt = new THREE.Vector3();

  // Raycasting for interactive hotspots & equipment
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private onHotspotSelectCallback?: (hotspot: Hotspot3D) => void;
  private onEquipmentSelectCallback?: (equipment: EquipmentInfo) => void;

  private ambientLight!: THREE.AmbientLight;
  private hemiLight!: THREE.HemisphereLight;
  private sunLight!: THREE.DirectionalLight;
  private isXRay: boolean = false;
  private tourTimer: any = null;
  public isTourActive: boolean = false;
  public currentProcessStep: number = 0;

  private isSplashOrbiting: boolean = false;
  private splashCenter: THREE.Vector3 = new THREE.Vector3(-25, 6.0, -24);
  private splashRadius: number = 38;
  private splashHeight: number = 20;
  private splashAngle: number = 0;
  private splashSpeed: number = 0.42;

  // Touch & Pointer Gesture Tracking to prevent accidental selection during drag/orbit
  private pointerStartX: number = 0;
  private pointerStartY: number = 0;
  private pointerStartTime: number = 0;
  private isPointerDragging: boolean = false;
  private lastTouchRaycastTime: number = 0;

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Scene - Golden Sunset Industrial Sky Backdrop
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e1b2b);
    this.scene.fog = new THREE.FogExp2(0x152335, 0.0025);

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight || 16 / 9;
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.5, 3000);
    this.camera.position.set(0, 65, 140);

    // 3. High precision WebGL Renderer with ACES Tone Mapping & PBR Environment
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: false
    });
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.25));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.shadowMap.enabled = !isMobile;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;
    this.renderer.domElement.style.touchAction = 'none';
    this.renderer.domElement.style.outline = 'none';

    container.appendChild(this.renderer.domElement);

    // Procedural PBR Studio Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Orbit Controls (Tuned for ultra-smooth touch & pointer manipulation)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.screenSpacePanning = true; // Natural screen-space panning across mobile and desktop
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent camera dipping under ground
    this.controls.minPolarAngle = 0.05;
    this.controls.minDistance = 3.0;
    this.controls.maxDistance = 1000;
    this.controls.enableZoom = true;
    this.controls.enableRotate = true;
    this.controls.enablePan = true;
    this.controls.rotateSpeed = 0.75; // Balanced, non-twitchy rotation
    this.controls.zoomSpeed = 0.95;   // Controlled zoom
    this.controls.panSpeed = 0.8;    // Stable two-finger panning
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 1.0;
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    this.controls.listenToKeyEvents(window);

    const stopAutomatedMotion = () => {
      this.isCameraLerping = false;
      this.isSplashOrbiting = false;
      this.controls.autoRotate = false;
    };

    // OrbitControls event listeners
    this.controls.addEventListener('start', () => {
      stopAutomatedMotion();
      this.isPointerDragging = true;
    });

    this.controls.addEventListener('end', () => {
      setTimeout(() => {
        this.isPointerDragging = false;
      }, 80);
    });

    this.controls.target.set(0, 18.0, 20);
    this.controls.update();

    // 5. Lighting
    this.setupLighting();

    // 6. Instantiate 3D Sub-scenes
    this.controlRoom = new ControlRoom3D();
    this.controlRoom.group.position.set(0, 0, -110);
    this.controlRoom.group.visible = false;
    this.scene.add(this.controlRoom.group);

    this.plant = new AmmoniaPlant3D();
    this.plant.group.position.set(0, 0, 0);
    this.scene.add(this.plant.group);

    // 7. Event listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.domElement.addEventListener('click', this.onClick.bind(this));

    // Pointer events (handles mouse and pen)
    this.renderer.domElement.addEventListener('pointerdown', (e: PointerEvent) => {
      stopAutomatedMotion();
      this.pointerStartX = e.clientX;
      this.pointerStartY = e.clientY;
      this.pointerStartTime = performance.now();
      this.isPointerDragging = false;
    });

    this.renderer.domElement.addEventListener('pointermove', (e: PointerEvent) => {
      if (e.buttons > 0 || e.pointerType === 'touch') {
        const dist = Math.hypot(e.clientX - this.pointerStartX, e.clientY - this.pointerStartY);
        if (dist > 8) {
          this.isPointerDragging = true;
          stopAutomatedMotion();
        }
      }
    });

    // Touch events (mobile/tablet devices)
    this.renderer.domElement.addEventListener('touchstart', (e: TouchEvent) => {
      stopAutomatedMotion();
      if (e.touches.length === 1) {
        this.pointerStartX = e.touches[0].clientX;
        this.pointerStartY = e.touches[0].clientY;
        this.pointerStartTime = performance.now();
        this.isPointerDragging = false;
      } else {
        // Multi-touch is always pinch or pan
        this.isPointerDragging = true;
      }
    }, { passive: true });

    this.renderer.domElement.addEventListener('touchmove', (e: TouchEvent) => {
      if (e.touches.length > 1) {
        this.isPointerDragging = true;
      } else if (e.touches.length === 1) {
        const dist = Math.hypot(e.touches[0].clientX - this.pointerStartX, e.touches[0].clientY - this.pointerStartY);
        if (dist > 8) {
          this.isPointerDragging = true;
        }
      }
    }, { passive: true });

    this.renderer.domElement.addEventListener('touchend', (e: TouchEvent) => {
      if (e.changedTouches.length === 1 && !this.isPointerDragging) {
        const dx = Math.abs(e.changedTouches[0].clientX - this.pointerStartX);
        const dy = Math.abs(e.changedTouches[0].clientY - this.pointerStartY);
        const dt = performance.now() - this.pointerStartTime;
        // Clean single tap detection
        if (dx < 10 && dy < 10 && dt < 400) {
          this.lastTouchRaycastTime = performance.now();
          this.handlePointerRaycast(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
      }
    }, { passive: true });

    this.start();
  }

  private setupLighting() {
    // 1. Warm Golden Sunset Ambient Light
    this.ambientLight = new THREE.AmbientLight(0xffe2cc, 1.2);
    this.scene.add(this.ambientLight);

    // 2. Sky/Ground Hemisphere Light
    this.hemiLight = new THREE.HemisphereLight(0xffb870, 0x1a2e3b, 1.4);
    this.hemiLight.position.set(0, 60, 0);
    this.scene.add(this.hemiLight);

    // 3. Main Directional Sun Light with High-Resolution Soft Shadows
    this.sunLight = new THREE.DirectionalLight(0xffedd5, 2.6);
    this.sunLight.position.set(90, 110, 80);
    const isMobileLight = typeof window !== 'undefined' && (window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    this.sunLight.castShadow = !isMobileLight;
    this.sunLight.shadow.mapSize.width = isMobileLight ? 512 : 1024;
    this.sunLight.shadow.mapSize.height = isMobileLight ? 512 : 1024;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 400;
    this.sunLight.shadow.camera.left = -150;
    this.sunLight.shadow.camera.right = 150;
    this.sunLight.shadow.camera.top = 150;
    this.sunLight.shadow.camera.bottom = -150;
    this.sunLight.shadow.bias = -0.0003;
    this.sunLight.shadow.normalBias = 0.02;
    this.scene.add(this.sunLight);

    // 4. Cool Rim Light for cinematic industrial edge highlights
    const rimLight = new THREE.DirectionalLight(0x00c8ef, 1.5);
    rimLight.position.set(-70, 40, -50);
    this.scene.add(rimLight);

    // 5. Front Fill Light
    const frontLight = new THREE.DirectionalLight(0xffeedd, 0.9);
    frontLight.position.set(0, 35, 70);
    this.scene.add(frontLight);
  }

  // Request shadow map recalculation on demand (conserves massive GPU render cycles)
  public requestShadowUpdate() {
    if (this.renderer && this.renderer.shadowMap) {
      this.renderer.shadowMap.needsUpdate = true;
    }
  }

  // Switch Environment Lighting Mode
  public setEnvironmentMode(mode: 'sunset' | 'daylight' | 'night') {
    if (mode === 'sunset') {
      this.scene.background = new THREE.Color(0x0e1b2b);
      this.scene.fog = new THREE.FogExp2(0x152335, 0.0025);
      this.ambientLight.color.setHex(0xffe2cc);
      this.ambientLight.intensity = 1.2;
      this.sunLight.color.setHex(0xffaa44);
      this.sunLight.intensity = 2.5;
    } else if (mode === 'daylight') {
      this.scene.background = new THREE.Color(0x719cb8);
      this.scene.fog = new THREE.FogExp2(0x81acca, 0.0018);
      this.ambientLight.color.setHex(0xffffff);
      this.ambientLight.intensity = 1.5;
      this.sunLight.color.setHex(0xfffaea);
      this.sunLight.intensity = 2.9;
    } else if (mode === 'night') {
      this.scene.background = new THREE.Color(0x050a12);
      this.scene.fog = new THREE.FogExp2(0x08101c, 0.004);
      this.ambientLight.color.setHex(0x223355);
      this.ambientLight.intensity = 0.45;
      this.sunLight.color.setHex(0x4466aa);
      this.sunLight.intensity = 0.7;
    }
    this.requestShadowUpdate();
  }

  // Toggle X-Ray Inspection View
  public toggleXRayMode(): boolean {
    this.isXRay = !this.isXRay;
    this.plant.setXRayMode(this.isXRay);
    return this.isXRay;
  }

  // Step through Process Flow from Feed to Product (Rows 1 to 7)
  public stepProcessRoute(direction: 'next' | 'prev' | number, onStepChange?: (step: any) => void) {
    const sequence = [
      { id: 'v-115', title: '1. Natural Gas Feed & Pressure Letdown (V-115 / PIC-001)', target: new THREE.Vector3(-45, 3.5, -35), cam: new THREE.Vector3(-45, 12, -18) },
      { id: 'k-303', title: '2. Natural Gas Compression & Preheater (K-303 / H-101 380°C)', target: new THREE.Vector3(5, 3.5, -35), cam: new THREE.Vector3(5, 14, -16) },
      { id: 'r-102ab', title: '3. Catalytic Desulfurization (R-102 AB / HC-103)', target: new THREE.Vector3(15, 4.0, -22), cam: new THREE.Vector3(15, 14, -4) },
      { id: 'r-101', title: '4. Primary Reforming Furnace (R-101 750°C & E-101 500°C)', target: new THREE.Vector3(-28, 6.0, -22), cam: new THREE.Vector3(-28, 20, -2) },
      { id: 'r-103', title: '5. Secondary Autothermal Reformer (R-103 900°C & K-302 Air)', target: new THREE.Vector3(-45, 7.0, -22), cam: new THREE.Vector3(-45, 22, -3) },
      { id: 'e-108', title: '6. Reformed Gas Waste Heat Boiler (E-108 340°C)', target: new THREE.Vector3(-45, 3.0, -9), cam: new THREE.Vector3(-45, 12, 8) },
      { id: 'r-104', title: '7. High Temp Shift Conversion (R-104 HTS 390°C)', target: new THREE.Vector3(-28, 4.5, -9), cam: new THREE.Vector3(-28, 14, 8) },
      { id: 'r-105', title: '8. Low Temp Shift Conversion (R-105 LTS 220°C & V-101)', target: new THREE.Vector3(-3, 4.5, 4), cam: new THREE.Vector3(-3, 14, 20) },
      { id: 't-201', title: '9. Catacarb CO2 Absorber Column (T-201 38m Tower)', target: new THREE.Vector3(-34, 16.0, 4), cam: new THREE.Vector3(-34, 36, 26) },
      { id: 'r-106', title: '10. Methanator Purification Reactor (R-106 295°C & E-106)', target: new THREE.Vector3(-5, 4.0, 17), cam: new THREE.Vector3(-5, 14, 33) },
      { id: 'k-301', title: '11. Synthesis Gas Compressor & Recycle (K-301 180 bar)', target: new THREE.Vector3(16, 3.5, 23), cam: new THREE.Vector3(16, 16, 42) },
      { id: 'e-405', title: '12. Chilling Train & Secondary Separator (E-405, E-406 2°C, V-402)', target: new THREE.Vector3(-4, 3.5, 36), cam: new THREE.Vector3(-4, 14, 52) },
      { id: 'r-401', title: '13. Ammonia Synthesis Converter Column (R-401 440°C 180 bar)', target: new THREE.Vector3(40, 12.0, 46), cam: new THREE.Vector3(40, 26, 66) },
      { id: 'v-401', title: '14. Primary Separator, Purge & Recycle (V-401 40°C & E-408)', target: new THREE.Vector3(-45, 4.5, 46), cam: new THREE.Vector3(-45, 16, 64) },
      { id: 'v-409', title: '15. Ammonia Product Letdown Flash Drum (V-409 / LIC-409 24 kg/cm²)', target: new THREE.Vector3(-30, 3.5, 55), cam: new THREE.Vector3(-30, 12, 72) },
    ];

    if (typeof direction === 'number') {
      this.currentProcessStep = Math.max(0, Math.min(sequence.length - 1, direction));
    } else if (direction === 'next') {
      this.currentProcessStep = (this.currentProcessStep + 1) % sequence.length;
    } else {
      this.currentProcessStep = (this.currentProcessStep - 1 + sequence.length) % sequence.length;
    }

    const step = sequence[this.currentProcessStep];
    this.flyToPosition(step.cam, step.target);

    const eqData = MASTER_EQUIPMENT_DATA.find((e) => e.id === step.id);
    if (onStepChange) {
      onStepChange({ ...step, equipment: eqData, stepIndex: this.currentProcessStep, totalSteps: sequence.length });
    }
  }

  // Camera Presets
  public setViewMode(mode: ViewMode3D) {
    this.currentMode = mode;
    this.stopGuidedTour();
    this.stopSplashOrbit();

    if (mode === 'plant_overview') {
      this.controlRoom.group.visible = false;
      this.plant.group.visible = true;
      this.plant.isolateSection(null);
      this.flyToPosition(new THREE.Vector3(0, 48, 80), new THREE.Vector3(0, 6.0, 10));
    } else if (mode === 'top_layout') {
      this.controlRoom.group.visible = false;
      this.plant.group.visible = true;
      this.plant.isolateSection(null);
      // Direct Top-Down Orthogonal/Perspective P&ID Layout
      this.flyToPosition(new THREE.Vector3(0, 115, 10), new THREE.Vector3(0, 0, 10));
    } else if (mode === 'control_room') {
      this.controlRoom.group.visible = true;
      this.flyToPosition(new THREE.Vector3(0, 2.5, -104), new THREE.Vector3(0, 2.2, -116));
    } else if (mode === 'combined') {
      this.controlRoom.group.visible = true;
      this.plant.group.visible = true;
      this.plant.isolateSection(null);
      this.flyToPosition(new THREE.Vector3(0, 40, 95), new THREE.Vector3(0, 5, 20));
    }
    this.requestShadowUpdate();
  }

  public focusSection(sectionId: string, onFocus?: (info: any) => void) {
    this.stopGuidedTour();
    if (sectionId === 'control_room') {
      this.setViewMode('control_room');
      return;
    }
    if (sectionId === 'top_layout') {
      this.setViewMode('top_layout');
      return;
    }

    this.currentMode = 'plant_overview';
    this.controlRoom.group.visible = false;
    this.plant.group.visible = true;

    const isSecFullComplex = sectionId === 'sec_full_complex' || sectionId === 'full_complex' || sectionId === 'full_plant_complex';
    const isSec1 = sectionId === 'sec_reformer' || sectionId === 'sec_primary_reformer' || sectionId === 'reform';
    const isSecSynloop = sectionId === 'sec_synloop' || sectionId === 'sec_synth' || sectionId === 'synth_400' || sectionId === 'section_4' || sectionId === 'sec_loop';
    const isSecCO2 = sectionId === 'sec_co2' || sectionId === 'sec_catacarb' || sectionId === 'co2' || sectionId === 'section_3';
    const isSecK301 = sectionId === 'sec_k301' || sectionId === 'sec_compressor' || sectionId === 'sec_syngas' || sectionId === 'k301' || sectionId === 'section_5';
    const isSecSteam = sectionId === 'sec_steam' || sectionId === 'sec_steam_utility' || sectionId === 'steam' || sectionId === 'section_9';
    const isSecRefrig = sectionId === 'sec_refrigeration' || sectionId === 'sec_k401' || sectionId === 'k401ref';
    const isSecStorage = sectionId === 'sec_storage' || sectionId === 'storage' || sectionId === 'section_8';
    const isSecCooling = sectionId === 'sec_cooling_tower' || sectionId === 'cooling_tower' || sectionId === 'sec_cooling' || sectionId === 'cooling';

    if (isSecFullComplex) {
      this.plant.isolateSection('sec_full_complex');
      this.renderer.shadowMap.enabled = false;
    } else {
      this.renderer.shadowMap.enabled = true;
      if (isSecCooling) {
        this.plant.isolateSection('sec_cooling_tower');
      } else if (isSec1) {
        this.plant.isolateSection('sec_reformer');
      } else if (isSecSynloop) {
        this.plant.isolateSection('sec_synloop');
      } else if (isSecCO2) {
        this.plant.isolateSection('sec_co2');
      } else if (isSecK301) {
        this.plant.isolateSection('sec_k301');
      } else if (isSecSteam) {
        this.plant.isolateSection('sec_steam');
      } else if (isSecRefrig) {
        this.plant.isolateSection('sec_refrigeration');
      } else if (isSecStorage) {
        this.plant.isolateSection('sec_storage');
      } else {
        this.plant.isolateSection(null);
        this.stopSplashOrbit();
      }
    }
    if (!isSecFullComplex) {
      this.requestShadowUpdate();
    }

    const sectionMap: Record<string, { cam: THREE.Vector3; target: THREE.Vector3; eqId?: string; title: string; stepIdx?: number }> = {
      sec_full_complex: { cam: new THREE.Vector3(0, 160.0, 390.0), target: new THREE.Vector3(0, 20.0, 0), title: '🏭 المعمل الشامل 3D (دمج برج التبريد + القسم 1 + القسم 2 + الضاغطات + القسم 4)' },
      full_complex: { cam: new THREE.Vector3(0, 160.0, 390.0), target: new THREE.Vector3(0, 20.0, 0), title: '🏭 المعمل الشامل 3D (دمج برج التبريد + القسم 1 + القسم 2 + الضاغطات + القسم 4)' },
      overview: { cam: new THREE.Vector3(0, 48, 80), target: new THREE.Vector3(0, 6.0, 10), title: 'استعراض مجمع تصنيع الأمونيا بالكامل 3D (Full Plant Complex)' },
      all: { cam: new THREE.Vector3(0, 48, 80), target: new THREE.Vector3(0, 6.0, 10), title: 'استعراض مجمع تصنيع الأمونيا بالكامل 3D (Full Plant Complex)' },
      plant_overview: { cam: new THREE.Vector3(0, 48, 80), target: new THREE.Vector3(0, 6.0, 10), title: 'استعراض مجمع تصنيع الأمونيا بالكامل 3D (Full Plant Complex)' },
      sec_desulf: { cam: new THREE.Vector3(15, 14, -4), target: new THREE.Vector3(15, 4.0, -22), eqId: 'r-102ab', title: '1. إزالة الكبريت وضغط الغاز الطبيعي (V-115 / R-102AB)', stepIdx: 2 },
      sec_feed: { cam: new THREE.Vector3(-45, 12, -18), target: new THREE.Vector3(-45, 3.5, -35), eqId: 'v-115', title: '1. استلام الغاز الطبيعي والضغط (V-115)', stepIdx: 0 },
      sec_reformer: { cam: new THREE.Vector3(0, 36.0, 85.0), target: new THREE.Vector3(0, 16.0, -15.0), eqId: 'r-101', title: '🔥 مجسم قسم تحويل الغاز والإصلاح والأفران ومفاعلات التحويل 3D (Unit 100)', stepIdx: 3 },
      sec_primary_reformer: { cam: new THREE.Vector3(0, 24.0, 32.0), target: new THREE.Vector3(0, 16.0, -14.0), eqId: 'r-101', title: '🔥 فرن الإصلاح الأولي الرئيسي R-101 (288 أنبوب إشعاعي)', stepIdx: 3 },
      sec_secondary_reformer: { cam: new THREE.Vector3(32, 28.0, 28.0), target: new THREE.Vector3(32, 18.0, -14.0), eqId: 'r-103', title: '3. المصلح الثانوي الأوتوثيرمال R-103 وغلاية البخار E-108 / V-102A', stepIdx: 4 },
      sec_shift: { cam: new THREE.Vector3(56, 26.0, 52.0), target: new THREE.Vector3(56, 14.0, 4.0), eqId: 'r-104', title: '4. مفاعلات تحويل أول أكسيد الكربون HTS R-104 & LTS R-105', stepIdx: 6 },
      sec_co2: { cam: new THREE.Vector3(0, 105.0, 235.0), target: new THREE.Vector3(0, 32.0, 25.0), eqId: 't-201', title: '5. امتصاص وإزالة CO₂ (Catacarb Absorber T-201 & Stripper T-202)', stepIdx: 8 },
      sec_methanation: { cam: new THREE.Vector3(-5, 14, 33), target: new THREE.Vector3(-5, 4.0, 17), eqId: 'r-106', title: '6. مفاعل الميثانايتر للتنقية النهائية (Methanator R-106)', stepIdx: 9 },
      sec_compressor: { cam: new THREE.Vector3(55.0, 36.0, 60.0), target: new THREE.Vector3(0, 15.5, 0), eqId: 'k-301', title: '⚡ ضاغط غاز التخليق K-301 والتوربين ومبرداته 3D', stepIdx: 10 },
      sec_syngas: { cam: new THREE.Vector3(55.0, 36.0, 60.0), target: new THREE.Vector3(0, 15.5, 0), eqId: 'k-301', title: '⚡ ضاغط غاز التخليق الرئيسي K-301', stepIdx: 10 },
      sec_k301: { cam: new THREE.Vector3(55.0, 36.0, 60.0), target: new THREE.Vector3(0, 15.5, 0), eqId: 'k-301', title: '⚡ مجسم ضاغط غاز التخليق K-301 والتوربين ومبرداته 3D', stepIdx: 10 },
      sec_synloop: { cam: new THREE.Vector3(20, 100.0, 230.0), target: new THREE.Vector3(0, 32.0, 20.0), eqId: 'r-401', title: '⚛️ برج تخليق الأمونيا وحلقة التفاعل R-401', stepIdx: 12 },
      sec_refrigeration: { cam: new THREE.Vector3(-4, 14, 52), target: new THREE.Vector3(-4, 3.5, 36), eqId: 'e-405', title: '❄️ منظومة التثليج وتبريد الأمونيا (Chilling Train E-405/E-406 & K-401)', stepIdx: 11 },
      sec_k401: { cam: new THREE.Vector3(-4, 14, 52), target: new THREE.Vector3(-4, 3.5, 36), eqId: 'e-405', title: '❄️ ضاغط التبريد والتثليج (K-401 & Flash Chillers)', stepIdx: 11 },
      sec_storage: { cam: new THREE.Vector3(-30, 12, 72), target: new THREE.Vector3(-30, 3.5, 55), eqId: 'v-409', title: '🛢️ خزانات الأمونيا المبردة ومحطات التحميل (F-401 / V-409 / Loading)', stepIdx: 14 },
      sec_steam: { cam: new THREE.Vector3(-65 + 6, 28.0, 85 + 44), target: new THREE.Vector3(-65 + 2, 3.2, 85 + 4), eqId: 's-65', title: '💨 مجمع ومحطات تخفيض البخار 3D (Steam Headers & PRDS Stations)', stepIdx: 5 },
      sec_steam_utility: { cam: new THREE.Vector3(-65 + 6, 28.0, 85 + 44), target: new THREE.Vector3(-65 + 2, 3.2, 85 + 4), eqId: 's-65', title: '💨 مجمع ومحطات تخفيض البخار 3D (Steam Headers & PRDS Stations)', stepIdx: 5 },
      sec_cooling_tower: { cam: new THREE.Vector3(38, 28.0, 58), target: new THREE.Vector3(-10, 8.0, 5), eqId: 'cooling_tower', title: '🌊 برج التبريد الصناعي ومضخات P-A..J والمكثف E711 ثلاثي الأبعاد 3D', stepIdx: 13 },
      cooling_tower: { cam: new THREE.Vector3(38, 28.0, 58), target: new THREE.Vector3(-10, 8.0, 5), eqId: 'cooling_tower', title: '🌊 برج التبريد الصناعي ومضخات P-A..J والمكثف E711 ثلاثي الأبعاد 3D', stepIdx: 13 },
    };

    const sec = sectionMap[sectionId] || sectionMap.overview;
    this.flyToPosition(sec.cam, sec.target);

    let eqData: EquipmentInfo | undefined;
    if (sec.eqId) {
      eqData = MASTER_EQUIPMENT_DATA.find((e) => e.id === sec.eqId);
      if (eqData && this.onEquipmentSelectCallback) {
        this.onEquipmentSelectCallback(eqData);
      }
    }

    if (sec.stepIdx !== undefined) {
      this.currentProcessStep = sec.stepIdx;
    }

    if (onFocus) {
      onFocus({ sectionId, title: sec.title, equipment: eqData, stepIndex: this.currentProcessStep, totalSteps: 15 });
    }
  }

  public focusEquipment(equipmentId: string) {
    let eq = MASTER_EQUIPMENT_DATA.find((e) => e.id === equipmentId || e.tag.toLowerCase() === equipmentId.toLowerCase());
    if (!eq && this.plant.coolingTower) {
      eq = this.plant.coolingTower.coolingEquipmentMap.get(equipmentId.toLowerCase());
    }
    if (eq) {
      if (this.plant.coolingTower && (this.plant.currentIsolatedSection === 'sec_cooling_tower' || this.plant.currentIsolatedSection === 'cooling_tower')) {
        const targetPos = eq.position.clone();
        const camOffset = equipmentId.toLowerCase().startsWith('fan-')
          ? new THREE.Vector3(0, 16, 24)
          : equipmentId.toLowerCase() === 'e711'
          ? new THREE.Vector3(18, 14, 22)
          : new THREE.Vector3(12, 10, 16);
        const camPos = targetPos.clone().add(camOffset);
        this.flyToPosition(camPos, targetPos);
        return;
      }
      if (eq.id === 'unit200_master_dcs_screen') {
        const targetPos = new THREE.Vector3(0, 13.5, 135);
        const camPos = new THREE.Vector3(0, 14.0, 168);
        this.flyToPosition(camPos, targetPos);
        return;
      }
      if (eq.id === 'unit300_master_pfd_board') {
        const targetPos = new THREE.Vector3(0, 12.0, 125);
        const camPos = new THREE.Vector3(0, 14.0, 160);
        this.flyToPosition(camPos, targetPos);
        return;
      }
      if (eq.id === 'unit400_master_pfd_board') {
        const targetPos = new THREE.Vector3(0, 12.0, 120);
        const camPos = new THREE.Vector3(0, 14.0, 155);
        this.flyToPosition(camPos, targetPos);
        return;
      }

      // Check if K-301 Section 3 Twin is active
      if (this.plant.currentIsolatedSection === 'sec_k301' || this.plant.currentIsolatedSection === 'sec_compressor') {
        const k301VantageMap: Record<string, { cam: THREE.Vector3; target: THREE.Vector3 }> = {
          'k-301': { cam: new THREE.Vector3(45.0, 30.0, 48.0), target: new THREE.Vector3(0, 15.5, 0) },
          'k-301t': { cam: new THREE.Vector3(-32.0, 24.0, 28.0), target: new THREE.Vector3(-32.0, 15.5, 0) },
          'k-301_lp': { cam: new THREE.Vector3(-8.5, 24.0, 28.0), target: new THREE.Vector3(-8.5, 15.5, 0) },
          'k-301_mp': { cam: new THREE.Vector3(12.0, 24.0, 28.0), target: new THREE.Vector3(12.0, 15.5, 0) },
          'k-301_hp': { cam: new THREE.Vector3(34.0, 24.0, 28.0), target: new THREE.Vector3(34.0, 15.5, 0) },
          'v-301': { cam: new THREE.Vector3(-75.0, 28.0, -32.0), target: new THREE.Vector3(-75.0, 18.0, -60.0) },
          'v-302': { cam: new THREE.Vector3(-25.0, 28.0, -32.0), target: new THREE.Vector3(-25.0, 18.0, -60.0) },
          'v-303': { cam: new THREE.Vector3(25.0, 28.0, -32.0), target: new THREE.Vector3(25.0, 18.0, -60.0) },
          'v-310': { cam: new THREE.Vector3(75.0, 30.0, -30.0), target: new THREE.Vector3(75.0, 20.0, -60.0) },
          'e-301': { cam: new THREE.Vector3(-75.0, 22.0, 85.0), target: new THREE.Vector3(-75.0, 10.0, 60.0) },
          'e-302': { cam: new THREE.Vector3(-25.0, 22.0, 85.0), target: new THREE.Vector3(-25.0, 10.0, 60.0) },
          'e-303': { cam: new THREE.Vector3(25.0, 22.0, 85.0), target: new THREE.Vector3(25.0, 10.0, 60.0) },
          'e-315': { cam: new THREE.Vector3(75.0, 22.0, 85.0), target: new THREE.Vector3(75.0, 10.0, 60.0) },
          'lo_console': { cam: new THREE.Vector3(-115.0, 22.0, 28.0), target: new THREE.Vector3(-115.0, 8.0, 0) },
          'fv-301': { cam: new THREE.Vector3(-50.0, 28.0, -5.0), target: new THREE.Vector3(-50.0, 22.0, -25.0) },
          'fv-302': { cam: new THREE.Vector3(0, 28.0, -5.0), target: new THREE.Vector3(0, 22.0, -25.0) },
          'fv-303': { cam: new THREE.Vector3(50.0, 28.0, -5.0), target: new THREE.Vector3(50.0, 22.0, -25.0) }
        };

        const vantage = k301VantageMap[equipmentId.toLowerCase()];
        if (vantage) {
          this.flyToPosition(vantage.cam, vantage.target);
          return;
        }
      }

      const targetPos = eq.position.clone();
      const camPos = targetPos.clone().add(new THREE.Vector3(12, 10, 14));
      this.flyToPosition(camPos, targetPos);
    }
  }

  public startSection360Splash(sectionId = 'sec_reformer', onFocus?: (info: any) => void) {
    this.stopGuidedTour();
    this.currentMode = 'plant_overview';
    this.controlRoom.group.visible = false;
    this.plant.group.visible = true;

    const isCO2 =
      sectionId === 'sec_co2' ||
      sectionId === 'sec_catacarb' ||
      sectionId === 'sec_co2_removal' ||
      sectionId === 'co2' ||
      sectionId === 'co2_removal' ||
      sectionId === 'section_3';

    const isK301 =
      sectionId === 'sec_k301' ||
      sectionId === 'sec_compressor' ||
      sectionId === 'sec_syngas' ||
      sectionId === 'k301' ||
      sectionId === 'compressor' ||
      sectionId === 'section_5';

    const isSynLoop =
      sectionId === 'sec_synloop' ||
      sectionId === 'sec_synth' ||
      sectionId === 'synth' ||
      sectionId === 'section_4';

    const isRefrig =
      sectionId === 'sec_refrigeration' ||
      sectionId === 'sec_k401' ||
      sectionId === 'k401ref' ||
      sectionId === 'section_7';

    const isSteam =
      sectionId === 'sec_steam' ||
      sectionId === 'sec_steam_utility' ||
      sectionId === 'steam' ||
      sectionId === 'section_9';

    const isStorage =
      sectionId === 'sec_storage' ||
      sectionId === 'storage' ||
      sectionId === 'section_8';

    const isCooling =
      sectionId === 'sec_cooling_tower' ||
      sectionId === 'cooling_tower' ||
      sectionId === 'sec_cooling' ||
      sectionId === 'cooling';

    if (isCO2) {
      // Isolate complete dedicated CO2 removal section 3D digital twin (Unit 200)
      this.plant.isolateSection('sec_co2');
      this.renderer.shadowMap.enabled = true;
      this.isSplashOrbiting = false;
      this.flyToPosition(
        new THREE.Vector3(0, 105.0, 235.0),
        new THREE.Vector3(0, 32.0, 25.0)
      );

      const eqData = MASTER_EQUIPMENT_DATA.find((e) => e.id === 't-201');
      if (eqData && this.onEquipmentSelectCallback) {
        this.onEquipmentSelectCallback(eqData);
      }
      if (onFocus) {
        onFocus({
          sectionId: 'sec_co2',
          title: '🧪 مجسم قسم إزالة واستخلاص ثاني أكسيد الكربون 3D (Catacarb Unit 200 DWG 6112P-100-200-00)',
          equipment: eqData,
          stepIndex: 8,
          totalSteps: 15,
        });
      }
    } else if (isK301) {
      // Isolate K-301 Syngas Compressor Complex (Dedicated Colossal 3D Twin matching Section 2 & 4)
      this.plant.isolateSection('sec_k301');
      this.isSplashOrbiting = false;
      this.flyToPosition(
        new THREE.Vector3(55.0, 36.0, 60.0),
        new THREE.Vector3(0, 15.5, 0)
      );

      const eqData = MASTER_EQUIPMENT_DATA.find((e) => e.id === 'k-301');
      if (eqData && this.onEquipmentSelectCallback) {
        this.onEquipmentSelectCallback(eqData);
      }
      if (onFocus) {
        onFocus({
          sectionId: 'sec_k301',
          title: '⚡ مجسم ضاغط غاز التخليق K-301 (٣ أكياس: LP و MP و HP و ٤ مراحل مع التوربين K-301T والمبردات والعوازل 3D)',
          equipment: eqData,
          stepIndex: 10,
          totalSteps: 15,
        });
      }
    } else if (isSynLoop) {
      this.plant.isolateSection('sec_synloop');
      this.isSplashOrbiting = false;
      this.flyToPosition(
        new THREE.Vector3(20, 100.0, 230.0),
        new THREE.Vector3(0, 32.0, 20.0)
      );

      const eqData = MASTER_EQUIPMENT_DATA.find((e) => e.id === 'r-401');
      if (eqData && this.onEquipmentSelectCallback) {
        this.onEquipmentSelectCallback(eqData);
      }
      if (onFocus) {
        onFocus({
          sectionId: 'sec_synloop',
          title: '⚛️ مجسم برج وحلقة تخليق الأمونيا R-401 ومبادلات التفاعل والمبردات 3D (Ammonia Synthesis Loop DWG 6112P-100-400-00)',
          equipment: eqData,
          stepIndex: 12,
          totalSteps: 15,
        });
      }
    } else if (isRefrig) {
      this.plant.isolateSection('sec_refrigeration');
      this.isCameraLerping = false;
      this.isSplashOrbiting = false;
      this.controls.autoRotate = false;
      this.flyToPosition(
        new THREE.Vector3(110 + 40, 45.0, 130 + 55),
        new THREE.Vector3(110, 16.0, 130)
      );

      const eqData = MASTER_EQUIPMENT_DATA.find((e) => e.id === 'e-405');
      if (eqData && this.onEquipmentSelectCallback) {
        this.onEquipmentSelectCallback(eqData);
      }
      if (onFocus) {
        onFocus({
          sectionId: 'sec_refrigeration',
          title: '❄️ مجسم منظومة التثليج والتبريد ومكثفات الأمونيا E-405/E-406/K-401 ثلاثية الأبعاد 3D (Isolated)',
          equipment: eqData,
          stepIndex: 11,
          totalSteps: 15,
        });
      }
    } else if (isSteam) {
      this.plant.isolateSection('sec_steam');
      this.isCameraLerping = false;
      this.isSplashOrbiting = false;
      this.flyToPosition(
        new THREE.Vector3(-65 + 6, 28.0, 85 + 44),
        new THREE.Vector3(-65 + 2, 3.2, 85 + 4)
      );

      const eqData = MASTER_EQUIPMENT_DATA.find((e) => e.id === 's-65') || MASTER_EQUIPMENT_DATA.find((e) => e.id === 'v-102_steam');
      if (eqData && this.onEquipmentSelectCallback) {
        this.onEquipmentSelectCallback(eqData);
      }
      if (onFocus) {
        onFocus({
          sectionId: 'sec_steam',
          title: '💨 مجمع ومحطات توزيع البخار 3D (Exact Steam Headers & PRDS 3D Digital Twin)',
          equipment: eqData,
          stepIndex: 5,
          totalSteps: 15,
        });
      }
    } else if (isStorage) {
      this.plant.isolateSection('sec_storage');
      this.isCameraLerping = false;
      this.isSplashOrbiting = false;
      this.controls.autoRotate = false;
      this.flyToPosition(
        new THREE.Vector3(-30 + 28, 20.0, 55 + 32),
        new THREE.Vector3(-30, 3.5, 55)
      );

      const eqData = MASTER_EQUIPMENT_DATA.find((e) => e.id === 'v-409');
      if (eqData && this.onEquipmentSelectCallback) {
        this.onEquipmentSelectCallback(eqData);
      }
      if (onFocus) {
        onFocus({
          sectionId: 'sec_storage',
          title: '🛢️ مجسم خزانات الأمونيا الكروية F-401 ومحطة الشحن 3D (Isolated)',
          equipment: eqData,
          stepIndex: 14,
          totalSteps: 15,
        });
      }
    } else if (isCooling) {
      this.plant.isolateSection('sec_cooling_tower');
      this.isCameraLerping = false;
      this.isSplashOrbiting = false;
      this.controls.autoRotate = false;
      this.flyToPosition(
        new THREE.Vector3(38, 28.0, 58),
        new THREE.Vector3(-10, 8.0, 5)
      );

      const ct = this.plant.ensureCoolingTower();
      const eqData = ct.coolingEquipmentMap.get('cooling_tower') || ct.coolingEquipmentMap.get('p-a');
      if (eqData && this.onEquipmentSelectCallback) {
        this.onEquipmentSelectCallback(eqData);
      }
      if (onFocus) {
        onFocus({
          sectionId: 'sec_cooling_tower',
          title: '🌊 مجسم برج التبريد الصناعي ومضخات P-A..J والمكثف E711 ثلاثي الأبعاد 3D',
          equipment: eqData,
          stepIndex: 13,
          totalSteps: 15,
        });
      }
    } else {
      // Isolate dedicated Section 100 Reforming & Shift Conversion 3D Digital Twin
      this.plant.isolateSection('sec_reformer');
      this.isCameraLerping = false;
      this.isSplashOrbiting = false;
      this.controls.autoRotate = false;
      this.flyToPosition(
        new THREE.Vector3(0, 36.0, 85.0),
        new THREE.Vector3(0, 16.0, -15.0)
      );

      const eqData = MASTER_EQUIPMENT_DATA.find((e) => e.id === 'r-101');
      if (eqData && this.onEquipmentSelectCallback) {
        this.onEquipmentSelectCallback(eqData);
      }
      if (onFocus) {
        onFocus({
          sectionId: 'sec_reformer',
          title: '🔥 مجسم قسم تحويل الغاز والإصلاح والأفران ومفاعلات التحويل 3D (Reforming Unit 100 DWG 6112P-100-100-00)',
          equipment: eqData,
          stepIndex: 3,
          totalSteps: 15,
        });
      }
    }
  }

  public startCO2Section360Splash(onFocus?: (info: any) => void) {
    this.startSection360Splash('sec_co2', onFocus);
  }

  public startK301Section360Splash(onFocus?: (info: any) => void) {
    this.startSection360Splash('sec_k301', onFocus);
  }

  public startSynLoopSection360Splash(onFocus?: (info: any) => void) {
    this.startSection360Splash('sec_synloop', onFocus);
  }

  public startRefrigSection360Splash(onFocus?: (info: any) => void) {
    this.startSection360Splash('sec_refrigeration', onFocus);
  }

  public stopSplashOrbit() {
    this.isSplashOrbiting = false;
  }

  public toggleSynLoopSectionIsolation(onFocus?: (info: any) => void): boolean {
    if (
      this.plant.currentIsolatedSection === 'sec_synloop' ||
      this.plant.currentIsolatedSection === 'sec_synth' ||
      this.plant.currentIsolatedSection === 'synth' ||
      this.plant.currentIsolatedSection === 'section_7' ||
      this.plant.currentIsolatedSection === 'sec_loop'
    ) {
      // Return to full plant
      this.plant.isolateSection(null);
      this.stopSplashOrbit();
      this.flyToPosition(new THREE.Vector3(0, 48, 80), new THREE.Vector3(0, 6.0, 10));
      if (onFocus) {
        onFocus({
          sectionId: 'overview',
          title: 'استعراض مجمع تصنيع الأمونيا بالكامل 3D (Full Plant Complex)',
          stepIndex: 0,
          totalSteps: 15,
        });
      }
      return false;
    } else {
      // Isolate SynLoop section
      this.startSynLoopSection360Splash(onFocus);
      return true;
    }
  }

  public toggleRefrigSectionIsolation(onFocus?: (info: any) => void): boolean {
    if (
      this.plant.currentIsolatedSection === 'sec_refrigeration' ||
      this.plant.currentIsolatedSection === 'sec_k401' ||
      this.plant.currentIsolatedSection === 'k401ref' ||
      this.plant.currentIsolatedSection === 'sec_refrig'
    ) {
      // Return to full plant
      this.plant.isolateSection(null);
      this.stopSplashOrbit();
      this.flyToPosition(new THREE.Vector3(0, 48, 80), new THREE.Vector3(0, 6.0, 10));
      if (onFocus) {
        onFocus({
          sectionId: 'overview',
          title: 'استعراض مجمع تصنيع الأمونيا بالكامل 3D (Full Plant Complex)',
          stepIndex: 0,
          totalSteps: 15,
        });
      }
      return false;
    } else {
      // Isolate Refrigeration section
      this.startRefrigSection360Splash(onFocus);
      return true;
    }
  }

  public toggleK301SectionIsolation(onFocus?: (info: any) => void): boolean {
    if (
      this.plant.currentIsolatedSection === 'sec_k301' ||
      this.plant.currentIsolatedSection === 'sec_compressor' ||
      this.plant.currentIsolatedSection === 'sec_syngas'
    ) {
      // Return to full plant
      this.plant.isolateSection(null);
      this.stopSplashOrbit();
      this.flyToPosition(new THREE.Vector3(0, 48, 80), new THREE.Vector3(0, 6.0, 10));
      if (onFocus) {
        onFocus({
          sectionId: 'overview',
          title: 'استعراض مجمع تصنيع الأمونيا بالكامل 3D (Full Plant Complex)',
          stepIndex: 0,
          totalSteps: 15,
        });
      }
      return false;
    } else {
      // Isolate K-301 Section
      this.startK301Section360Splash(onFocus);
      return true;
    }
  }

  public toggleCO2SectionIsolation(onFocus?: (info: any) => void): boolean {
    if (this.plant.currentIsolatedSection === 'sec_co2' || this.plant.currentIsolatedSection === 'sec_catacarb') {
      // Return to full plant
      this.plant.isolateSection(null);
      this.stopSplashOrbit();
      this.flyToPosition(new THREE.Vector3(0, 48, 80), new THREE.Vector3(0, 6.0, 10));
      if (onFocus) {
        onFocus({
          sectionId: 'overview',
          title: 'استعراض مجمع تصنيع الأمونيا بالكامل 3D (Full Plant Complex)',
          stepIndex: 0,
          totalSteps: 15,
        });
      }
      return false;
    } else {
      // Isolate CO2 section
      this.startCO2Section360Splash(onFocus);
      return true;
    }
  }

  public toggleSection1Isolation(onFocus?: (info: any) => void): boolean {
    if (this.plant.currentIsolatedSection === 'sec_reformer') {
      // Return to full plant
      this.plant.isolateSection(null);
      this.stopSplashOrbit();
      this.flyToPosition(new THREE.Vector3(0, 48, 80), new THREE.Vector3(0, 6.0, 10));
      if (onFocus) {
        onFocus({
          sectionId: 'overview',
          title: 'استعراض مجمع تصنيع الأمونيا بالكامل 3D (Full Plant Complex)',
          stepIndex: 0,
          totalSteps: 15,
        });
      }
      return false;
    } else {
      // Isolate Section 1
      this.startSection360Splash('sec_reformer', onFocus);
      return true;
    }
  }

  public startIntroAnimation(onFinish?: () => void) {
    this.setViewMode('plant_overview');
    this.camera.position.set(110, 90, 120);
    this.controls.target.set(0, 6, 10);
    this.flyToPosition(new THREE.Vector3(0, 48, 80), new THREE.Vector3(0, 6, 10));
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 2800);
  }

  public zoomIn(factor = 0.75) {
    this.isCameraLerping = false;
    const dir = new THREE.Vector3().subVectors(this.controls.target, this.camera.position);
    if (dir.length() > this.controls.minDistance + 0.5) {
      this.camera.position.addScaledVector(dir, 1 - factor);
      this.controls.update();
    }
  }

  public zoomOut(factor = 1.35) {
    this.isCameraLerping = false;
    const dir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target);
    if (dir.length() < this.controls.maxDistance - 5) {
      this.camera.position.addScaledVector(dir, factor - 1);
      this.controls.update();
    }
  }

  public resetCamera() {
    this.setViewMode(this.currentMode);
  }

  public toggleAutoRotate(): boolean {
    this.controls.autoRotate = !this.controls.autoRotate;
    this.controls.autoRotateSpeed = 1.4;
    return this.controls.autoRotate;
  }

  public flyToPosition(pos: THREE.Vector3, lookAt: THREE.Vector3) {
    this.targetCamPos.copy(pos);
    this.targetCamLookAt.copy(lookAt);
    this.isCameraLerping = true;
  }

  public setHotspotSelectCallback(cb: (hotspot: Hotspot3D) => void) {
    this.onHotspotSelectCallback = cb;
  }

  public setEquipmentSelectCallback(cb: (equipment: EquipmentInfo) => void) {
    this.onEquipmentSelectCallback = cb;
  }

  // Traverses up to root scene ensuring this object and every ancestor is visible
  public isObjectGloballyVisible(obj: THREE.Object3D | null): boolean {
    let curr: THREE.Object3D | null = obj;
    while (curr) {
      if (!curr.visible) return false;
      curr = curr.parent;
    }
    return true;
  }

  // Validates that selected equipment belongs to the current isolated section
  // to prevent accidental cross-section overlap
  public isEquipmentAllowedInCurrentSection(eq: EquipmentInfo): boolean {
    const sec = this.plant.currentIsolatedSection;
    if (
      !sec ||
      sec === 'overview' ||
      sec === 'all' ||
      sec === 'sec_full_complex' ||
      sec === 'full_complex' ||
      sec === 'full_plant_complex' ||
      sec === 'sec_integrated'
    ) {
      return true;
    }
    const isSec1 = sec === 'sec_reformer' || sec === 'sec_primary_reformer' || sec === 'reform' || sec === 'section_1';
    const isSecCO2 = sec === 'sec_co2' || sec === 'sec_catacarb' || sec === 'sec_co2_removal' || sec === 'co2' || sec === 'co2_removal' || sec === 'section_2' || sec === 'section_3';
    const isSecK301 = sec === 'sec_k301' || sec === 'sec_compressor' || sec === 'sec_syngas' || sec === 'k301' || sec === 'section_5';
    const isSecSynLoop = sec === 'sec_synloop' || sec === 'sec_synth' || sec === 'synth_400' || sec === 'section_4' || sec === 'section_7' || sec === 'sec_loop';
    const isSecSteam = sec === 'sec_steam' || sec === 'sec_steam_utility' || sec === 'steam' || sec === 'section_9';

    const eqId = eq.id.toLowerCase();
    const eqSecNum = eq.sectionNumber;
    const eqSecName = (eq.section || '').toLowerCase();

    if (isSec1) {
      return (
        eqSecNum === 1 ||
        eqSecName.includes('reforming') ||
        eqSecName.includes('shift') ||
        eqSecName.includes('100') ||
        eqId.startsWith('p-1') ||
        eqId === 'v-102a' ||
        eqId === 'v-109' ||
        eqId === 'e-108' ||
        eqId === 'e-109' ||
        eqId === 'e-107' ||
        eqId === 'e-110' ||
        eqId === 'r-101' ||
        eqId === 'r-103' ||
        eqId === 'r-104' ||
        eqId === 'r-105' ||
        eqId === 'r-106' ||
        eqId === 'e-106' ||
        eqId === 'v-101' ||
        eqId === 'k-303' ||
        eqId === 'h-101' ||
        eqId === 'r-102' ||
        eqId === 'r-102a' ||
        eqId === 'r-102b' ||
        eqId === 'k-302' ||
        eqId === 'k-101a' ||
        eqId === 'k-101b' ||
        eqId === 'st-101' ||
        eqId.includes('100')
      );
    }
    if (isSecCO2) {
      return (
        eqSecNum === 2 ||
        eqSecNum === 3 ||
        eqSecName.includes('co2') ||
        eqSecName.includes('catacarb') ||
        eqSecName.includes('200') ||
        eqId.startsWith('p-2') ||
        eqId.includes('201') ||
        eqId.includes('202') ||
        eqId.includes('204') ||
        eqId.includes('207') ||
        eqId.includes('208') ||
        eqId.includes('209') ||
        eqId.includes('203') ||
        eqId.includes('205') ||
        eqId.includes('206')
      );
    }
    if (isSecK301) {
      return (
        eqSecNum === 3 ||
        eqSecNum === 5 ||
        eqSecName.includes('compressor') ||
        eqSecName.includes('syngas') ||
        eqSecName.includes('k-301') ||
        eqSecName.includes('300') ||
        eqId.startsWith('p-3') ||
        eqId.includes('301') ||
        eqId.includes('302') ||
        eqId.includes('303') ||
        eqId.includes('304') ||
        eqId.includes('310') ||
        eqId.includes('315')
      );
    }
    if (isSecSynLoop) {
      return (
        eqSecNum === 4 ||
        eqSecNum === 7 ||
        eqSecName.includes('synthesis') ||
        eqSecName.includes('synloop') ||
        eqSecName.includes('loop') ||
        eqSecName.includes('400') ||
        eqId.startsWith('p-4') ||
        eqId.includes('401') ||
        eqId.includes('402') ||
        eqId.includes('403') ||
        eqId.includes('404') ||
        eqId.includes('405') ||
        eqId.includes('406') ||
        eqId.includes('407') ||
        eqId.includes('408') ||
        eqId.includes('409') ||
        eqId.includes('412') ||
        eqId.includes('416')
      );
    }
    if (isSecSteam) {
      return (
        eqSecName.includes('steam') ||
        eqId.startsWith('s-') ||
        eqId.includes('steam')
      );
    }
    const isSecCooling =
      sec === 'sec_cooling_tower' ||
      sec === 'cooling_tower' ||
      sec === 'sec_cooling' ||
      sec === 'cooling';
    if (isSecCooling) {
      return (
        eqId.startsWith('p-') ||
        eqId.startsWith('fan-') ||
        eqId === 'e711' ||
        eqId.includes('cooling') ||
        eqSecName.includes('cooling') ||
        (eq.type as string) === 'pump' ||
        (eq.type as string) === 'fan' ||
        (eq.type as string) === 'condenser'
      );
    }
    return true;
  }

  public handlePointerRaycast(clientX: number, clientY: number) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 1. Raycast into Plant interactive objects (Equipment, Badges, Pipes) for active section only
    const activeCandidates = this.plant.getActiveInteractiveMeshes();
    const plantIntersects = this.raycaster.intersectObjects(activeCandidates, true);

    // Filter strictly to intersections that are globally visible in the 3D scene
    const validIntersects = plantIntersects.filter((hit) => this.isObjectGloballyVisible(hit.object));

    if (validIntersects.length > 0) {
      for (const hit of validIntersects) {
        let eqData: EquipmentInfo | undefined = undefined;
        let curr: THREE.Object3D | null = hit.object;

        while (curr && !eqData) {
          if (curr.userData?.data) {
            eqData = curr.userData.data;
          } else if (curr.userData?.equipmentInfo) {
            eqData = curr.userData.equipmentInfo;
          } else if (curr.userData?.equipmentId) {
            eqData = MASTER_EQUIPMENT_DATA.find((e) => e.id.toLowerCase() === curr!.userData.equipmentId.toLowerCase());
          }
          curr = curr.parent;
        }

        if (eqData && this.isEquipmentAllowedInCurrentSection(eqData)) {
          if (this.plant.coolingTower && this.plant.coolingTower.group.visible) {
            this.plant.coolingTower.highlightComponent(hit.object);
          }
          if (this.onEquipmentSelectCallback) {
            this.onEquipmentSelectCallback(eqData);
          }
          // Only focus camera if equipment is not a generic long piping network line
          if (eqData.type !== 'piping' && (!eqData.id.startsWith('P-') || eqData.type === 'pump')) {
            this.focusEquipment(eqData.id);
          }
          return;
        }
      }
    }

    // 2. Raycast into Control room hotspots
    if (this.controlRoom.group.visible) {
      const roomIntersects = this.raycaster.intersectObjects(this.controlRoom.interactiveObjects, true);
      if (roomIntersects.length > 0) {
        const hitObj = roomIntersects[0].object;
        const hs = this.controlRoom.hotspots.find((h) => h.mesh === hitObj || hitObj.parent === h.mesh);
        if (hs) {
          this.flyToPosition(hs.targetCameraPos, hs.targetCameraLookAt);
          if (this.onHotspotSelectCallback) {
            this.onHotspotSelectCallback(hs);
          }
        }
      }
    }
  }

  private onClick(event: MouseEvent) {
    // If a mobile touch tap just fired in the last 600ms, ignore the synthetic mouse click!
    if (performance.now() - this.lastTouchRaycastTime < 600) return;
    // If the user was dragging/orbiting the camera, ignore the click!
    if (this.isPointerDragging) return;
    const dist = Math.hypot(event.clientX - this.pointerStartX, event.clientY - this.pointerStartY);
    if (dist > 8) return;

    this.handlePointerRaycast(event.clientX, event.clientY);
  }

  public resize() {
    this.onWindowResize();
  }

  private onWindowResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    let lastTime = performance.now();

    const animate = (time: number) => {
      if (!this.isRunning) return;
      this.animFrameId = requestAnimationFrame(animate);

      const deltaSec = Math.min((time - lastTime) / 1000, 0.04);
      lastTime = time;

      // Update 3D animations only when corresponding group is visible
      if (this.controlRoom.group.visible) {
        this.controlRoom.update(time / 1000);
      }
      if (this.plant.group.visible) {
        this.plant.update(deltaSec, time / 1000);
      }

      // Smooth Camera Lerp if active
      if (this.isSplashOrbiting) {
        this.splashAngle += this.splashSpeed * deltaSec;
        this.camera.position.x = this.splashCenter.x + Math.sin(this.splashAngle) * this.splashRadius;
        this.camera.position.z = this.splashCenter.z + Math.cos(this.splashAngle) * this.splashRadius;
        this.camera.position.y = this.splashHeight + Math.sin(this.splashAngle * 0.5) * 5.0;
        this.controls.target.copy(this.splashCenter);
        this.controls.update();
      } else if (this.isCameraLerping) {
        this.camera.position.lerp(this.targetCamPos, 0.08);
        this.controls.target.lerp(this.targetCamLookAt, 0.08);
        this.controls.update();

        if (this.camera.position.distanceTo(this.targetCamPos) < 0.15) {
          this.isCameraLerping = false;
        }
      } else {
        this.controls.update();
      }

      this.renderer.render(this.scene, this.camera);
    };

    requestAnimationFrame(animate);
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  public stopGuidedTour() {
    this.isTourActive = false;
    if (this.tourTimer) {
      clearTimeout(this.tourTimer);
      this.tourTimer = null;
    }
  }

  // Camera Presets (Front, Side, Top, Isometric, Reset)
  public setCameraAngle(angle: 'front' | 'side' | 'top' | 'isometric' | 'reset') {
    const isFullComplex =
      this.plant.currentIsolatedSection === 'sec_full_complex' ||
      this.plant.currentIsolatedSection === 'full_complex' ||
      this.plant.currentIsolatedSection === 'full_plant_complex';

    if (isFullComplex) {
      const target = new THREE.Vector3(0, 20.0, 0);
      if (angle === 'front') {
        this.flyToPosition(new THREE.Vector3(0, 60.0, 370.0), target);
      } else if (angle === 'side') {
        this.flyToPosition(new THREE.Vector3(360.0, 60.0, 0.0), target);
      } else if (angle === 'top') {
        this.flyToPosition(new THREE.Vector3(0, 420.0, 10.0), target);
      } else if (angle === 'isometric') {
        this.flyToPosition(new THREE.Vector3(180.0, 160.0, 320.0), target);
      } else {
        this.flyToPosition(new THREE.Vector3(0, 160.0, 390.0), target);
      }
      return;
    }

    const isCooling =
      this.plant.currentIsolatedSection === 'sec_cooling_tower' ||
      this.plant.currentIsolatedSection === 'cooling_tower';

    if (isCooling) {
      const target = new THREE.Vector3(-10, 8.0, 5);
      if (angle === 'front') {
        this.flyToPosition(new THREE.Vector3(-10, 16.0, 68), target);
      } else if (angle === 'side') {
        this.flyToPosition(new THREE.Vector3(75, 18.0, 5), target);
      } else if (angle === 'top') {
        this.flyToPosition(new THREE.Vector3(-10, 85.0, 5.1), target);
      } else if (angle === 'isometric') {
        this.flyToPosition(new THREE.Vector3(42, 34.0, 56), target);
      } else {
        this.flyToPosition(new THREE.Vector3(38, 28.0, 58), target);
      }
    } else {
      const target = new THREE.Vector3(0, 10, 10);
      if (angle === 'front') {
        this.flyToPosition(new THREE.Vector3(0, 18.0, 85), target);
      } else if (angle === 'side') {
        this.flyToPosition(new THREE.Vector3(95, 20.0, 10), target);
      } else if (angle === 'top') {
        this.flyToPosition(new THREE.Vector3(0, 120.0, 10.1), target);
      } else if (angle === 'isometric') {
        this.flyToPosition(new THREE.Vector3(60, 48.0, 75), target);
      } else {
        this.flyToPosition(new THREE.Vector3(0, 48.0, 80), new THREE.Vector3(0, 6.0, 10));
      }
    }
  }

  // Cooling Tower Interactive Features
  public toggleCoolingFanAnimation(active?: boolean): boolean {
    if (this.plant.coolingTower) {
      const state = active !== undefined ? active : !this.plant.coolingTower.isFanAnimationActive;
      this.plant.coolingTower.setFanAnimation(state);
      return state;
    }
    return false;
  }

  public toggleCoolingWaterFlow(active?: boolean): boolean {
    if (this.plant.coolingTower) {
      const state = active !== undefined ? active : !this.plant.coolingTower.isWaterFlowActive;
      this.plant.coolingTower.setWaterFlow(state);
      return state;
    }
    return false;
  }

  public toggleCoolingLabels(visible?: boolean): boolean {
    if (this.plant.coolingTower) {
      const state = visible !== undefined ? visible : !this.plant.coolingTower.badgesGroup.visible;
      this.plant.coolingTower.setLabelsVisible(state);
      return state;
    }
    return false;
  }

  public setCoolingGroupVisibility(groupKey: 'all' | 'fans' | 'pumps' | 'condenser' | 'piping', visible: boolean) {
    if (this.plant.coolingTower) {
      this.plant.coolingTower.setGroupVisibility(groupKey, visible);
    }
  }
}

