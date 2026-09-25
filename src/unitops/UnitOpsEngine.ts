// Dynamic Physics & Mathematical Process Simulation Engine for Unit Operations
import { UnitSectionData, SectionId, ControllerPoint, SectionStatus } from './UnitOpsTypes';

export class UnitOpsEngine {
  public sections: Record<SectionId, UnitSectionData>;
  private timer: number | null = null;
  private onUpdateCallbacks: ((secId: SectionId) => void)[] = [];
  public activeSectionId: SectionId = 'sec_desulf';

  constructor() {
    this.sections = this.initializeSections();
    this.startSimulationLoop();
  }

  public subscribe(cb: (secId: SectionId) => void) {
    this.onUpdateCallbacks.push(cb);
  }

  private notify(secId: SectionId) {
    this.onUpdateCallbacks.forEach(cb => cb(secId));
  }

  public getSection(id: SectionId): UnitSectionData {
    return this.sections[id] || this.sections.sec_desulf;
  }

  public setSectionStatus(secId: SectionId, status: SectionStatus) {
    const sec = this.sections[secId];
    if (!sec) return;
    sec.status = status;
    if (status === 'SHUTDOWN') {
      sec.loadPct = 0;
      sec.controllers.forEach(c => {
        if (c.mode === 'AUTO') c.sp = c.min;
        c.mv = 0;
      });
    } else if (status === 'WARMING') {
      sec.loadPct = 25;
      sec.controllers.forEach(c => {
        c.mv = Math.max(10, c.mv * 0.4);
      });
    } else if (status === 'RUNNING') {
      sec.loadPct = 100;
      sec.controllers.forEach(c => {
        if (c.isTripped) c.isTripped = false;
      });
    }
    this.notify(secId);
  }

  public updateControllerMode(secId: SectionId, tag: string, mode: 'AUTO' | 'MAN' | 'CAS') {
    const sec = this.sections[secId];
    if (!sec) return;
    const c = sec.controllers.find(item => item.tag === tag);
    if (c) {
      c.mode = mode;
      this.notify(secId);
    }
  }

  public updateControllerSP(secId: SectionId, tag: string, sp: number) {
    const sec = this.sections[secId];
    if (!sec) return;
    const c = sec.controllers.find(item => item.tag === tag);
    if (c) {
      c.sp = Math.max(c.min, Math.min(c.max, sp));
      this.notify(secId);
    }
  }

  public updateControllerMV(secId: SectionId, tag: string, mv: number) {
    const sec = this.sections[secId];
    if (!sec) return;
    const c = sec.controllers.find(item => item.tag === tag);
    if (c && c.mode === 'MAN') {
      c.mv = Math.max(0, Math.min(100, mv));
      this.notify(secId);
    }
  }

  public updatePID(secId: SectionId, tag: string, kp: number, ti: number, td: number) {
    const sec = this.sections[secId];
    if (!sec) return;
    const c = sec.controllers.find(item => item.tag === tag);
    if (c) {
      c.pid = { kp, ti, td };
      this.notify(secId);
    }
  }

  public toggleDisturbance(secId: SectionId, disturbanceId: string) {
    const sec = this.sections[secId];
    if (!sec) return;
    const dist = sec.disturbances.find(d => d.id === disturbanceId);
    if (dist) {
      dist.applied = !dist.applied;
      this.notify(secId);
    }
  }

  // Main Dynamic Physics Loop (runs every 500ms)
  private startSimulationLoop() {
    this.timer = window.setInterval(() => {
      this.stepSimulation(0.5);
    }, 500);
  }

  private stepSimulation(dt: number) {
    const now = Date.now();

    Object.keys(this.sections).forEach((key) => {
      const secId = key as SectionId;
      const sec = this.sections[secId];
      if (!sec) return;

      const isRunning = sec.status === 'RUNNING';
      const isWarming = sec.status === 'WARMING';
      const isShutdown = sec.status === 'SHUTDOWN';

      // 1. PID Controller Calculations for AUTO loops
      sec.controllers.forEach((c) => {
        if (c.mode === 'AUTO' && !isShutdown) {
          const error = c.sp - c.pv;
          const kp = c.pid.kp || 1.0;
          const ti = Math.max(1, c.pid.ti || 20);
          // Standard velocity-form discrete PI calculation
          const pTerm = kp * (error / (c.max - c.min || 1)) * 100;
          const iTerm = (kp / ti) * (error / (c.max - c.min || 1)) * 100 * dt;
          
          c.mv = Math.max(0, Math.min(100, c.mv + pTerm * 0.08 + iTerm));
        }

        // Apply disturbances if active
        sec.disturbances.forEach((dist) => {
          if (dist.applied) {
            dist.effect({ [c.tag]: c }, { secStatus: sec.status, loadPct: sec.loadPct });
          }
        });

        // 2. Physical Dynamic Response (First Order Lag: tau * dy/dt + y = K * MV)
        let targetPV = c.min;
        if (isRunning) {
          targetPV = c.min + (c.mv / 100) * (c.max - c.min);
          // Add realistic process noise (+- 0.15%)
          targetPV += (Math.random() - 0.5) * 0.003 * (c.max - c.min);
        } else if (isWarming) {
          targetPV = c.min + (c.mv / 100) * (c.max - c.min) * 0.45;
        } else {
          // Shutdown state decays toward baseline
          targetPV = c.min;
        }

        const lagRate = 0.08; // dynamic inertia
        c.pv = c.pv + (targetPV - c.pv) * lagRate;

        // Check Alarms
        if (c.alarms.hh !== undefined && c.pv >= c.alarms.hh) {
          c.isTripped = true;
        } else if (c.alarms.ll !== undefined && c.pv <= c.alarms.ll) {
          c.isTripped = true;
        } else {
          c.isTripped = false;
        }

        // Update Trend History (keep 40 samples)
        c.history.push({ time: now, sp: c.sp, pv: c.pv, mv: c.mv });
        if (c.history.length > 40) {
          c.history.shift();
        }
      });

      // 3. Update Section KPIs
      this.updateSectionKPIs(sec);

      this.notify(secId);
    });
  }

  private updateSectionKPIs(sec: UnitSectionData) {
    if (sec.id === 'sec_desulf') {
      const fic = sec.controllers.find(c => c.tag === 'FIC-101')?.pv || 0;
      const trc = sec.controllers.find(c => c.tag === 'TRC-102')?.pv || 0;
      sec.kpis[0].value = fic.toFixed(0);
      sec.kpis[1].value = trc.toFixed(1);
      sec.kpis[2].value = (fic * 0.00072).toFixed(1); // Tonnes/h
      sec.kpis[3].value = trc > 370 && trc < 390 ? '< 0.05 ppm' : '0.12 ppm';
    } else if (sec.id === 'sec_reformer') {
      const trc101 = sec.controllers.find(c => c.tag === 'TRC-101')?.pv || 0;
      const frc103 = sec.controllers.find(c => c.tag === 'FRC-103')?.pv || 0;
      const trc103 = sec.controllers.find(c => c.tag === 'TRC-103')?.pv || 0;
      sec.kpis[0].value = trc101.toFixed(1);
      sec.kpis[1].value = frc103.toFixed(2);
      sec.kpis[2].value = trc103.toFixed(0);
      sec.kpis[3].value = (9.86 * Math.exp(-(trc101 - 795) * 0.013)).toFixed(2) + ' %';
    } else if (sec.id === 'sec_comp_k301') {
      const sic = sec.controllers.find(c => c.tag === 'SIC-301')?.pv || 0;
      const pic302 = sec.controllers.find(c => c.tag === 'PIC-302')?.pv || 0;
      sec.kpis[0].value = sic.toFixed(0);
      sec.kpis[1].value = pic302.toFixed(1);
      sec.kpis[2].value = (sic / 10450 * 18.5).toFixed(1); // Shaft Power MW
      sec.kpis[3].value = '84.2 %';
    } else if (sec.id === 'sec_comp_k302') {
      const frc = sec.controllers.find(c => c.tag === 'FRC-302')?.pv || 0;
      const pic = sec.controllers.find(c => c.tag === 'PIC-304')?.pv || 0;
      sec.kpis[0].value = frc.toFixed(0);
      sec.kpis[1].value = pic.toFixed(1);
      sec.kpis[2].value = (frc * 0.00042).toFixed(1); // Power MW
    } else if (sec.id === 'sec_comp_k303') {
      const pic = sec.controllers.find(c => c.tag === 'PIC-303')?.pv || 0;
      sec.kpis[0].value = pic.toFixed(1);
    } else if (sec.id === 'sec_comp_k401') {
      const pic1 = sec.controllers.find(c => c.tag === 'PIC-401')?.pv || 0;
      const pic4 = sec.controllers.find(c => c.tag === 'PIC-404')?.pv || 0;
      sec.kpis[0].value = pic1.toFixed(2);
      sec.kpis[1].value = pic4.toFixed(1);
      sec.kpis[2].value = '-33.2 °C';
    } else if (sec.id === 'sec_purif') {
      const trc104 = sec.controllers.find(c => c.tag === 'TRC-104')?.pv || 0;
      const frc201 = sec.controllers.find(c => c.tag === 'FRC-201')?.pv || 0;
      const trc106 = sec.controllers.find(c => c.tag === 'TRC-106')?.pv || 0;
      sec.kpis[0].value = trc104.toFixed(1);
      sec.kpis[1].value = frc201.toFixed(0);
      sec.kpis[2].value = trc106.toFixed(1);
      sec.kpis[3].value = '< 3 ppm';
    } else if (sec.id === 'sec_synloop') {
      const pic = sec.controllers.find(c => c.tag === 'PIC-401')?.pv || 0;
      const trc = sec.controllers.find(c => c.tag === 'TRC-401')?.pv || 0;
      const arc = sec.controllers.find(c => c.tag === 'ARC-401')?.pv || 0;
      sec.kpis[0].value = pic.toFixed(1);
      sec.kpis[1].value = trc.toFixed(1);
      sec.kpis[2].value = arc.toFixed(2);
      sec.kpis[3].value = (pic / 239 * 1000).toFixed(0); // Production MT/D
    }
  }

  // Initialize all complete plant units with industrial tags and realistic PID parameters
  private initializeSections(): Record<SectionId, UnitSectionData> {
    return {
      // 1. DESULFURIZATION & FEED
      sec_desulf: {
        id: 'sec_desulf',
        category: 'feed',
        numberStr: 'القسم الأول',
        nameAr: 'قسم التغذية وإزالة الكبريت',
        nameEn: 'Natural Gas Feed & Desulfurization Unit',
        equipmentSummary: 'V-115 Separator, E-101 Preheater, R-102A/B CoMo Hydrogenation & ZnO Absorbers',
        descriptionAr: 'معالجة الغاز الطبيعي الخام القادم من حقول البصرة، فصل السوائل والشوائب وهدرجة المركبات الكبريتية ثم امتصاص H₂S بواسطة أكسيد الخارصين ZnO عند 380°C لحماية عوامل الفرن المساعد.',
        status: 'RUNNING',
        loadPct: 100,
        controllers: [
          {
            tag: 'PIC-001',
            nameEn: 'Natural Gas Feed Pressure',
            nameAr: 'ضغط الغاز الطبيعي المغذي',
            type: 'PIC',
            unit: 'kg/cm²G',
            min: 0,
            max: 50,
            decimals: 1,
            sp: 34.5,
            pv: 34.5,
            mv: 65,
            mode: 'AUTO',
            alarms: { hh: 45, h: 40, l: 26, ll: 22 },
            pid: { kp: 1.8, ti: 15, td: 1 },
            history: [],
            description: 'يتحكم في صمام تخفيض وضبط ضغط الغاز الطبيعي الرئيسي PV-001 الداخل إلى وحدة المعالجة.',
            valveTag: 'PV-001'
          },
          {
            tag: 'FIC-101',
            nameEn: 'Natural Gas Feed Flow',
            nameAr: 'معدل تدفق الغاز الطبيعي',
            type: 'FIC',
            unit: 'Nm³/h',
            min: 0,
            max: 35000,
            decimals: 0,
            sp: 24500,
            pv: 24500,
            mv: 70,
            mode: 'AUTO',
            alarms: { hh: 32000, h: 28000, l: 15000, ll: 10000 },
            pid: { kp: 1.2, ti: 10, td: 0.5 },
            history: [],
            description: 'ينظم كمية الغاز المغذي الكلية للمصنع عبر صمام الجريان FV-101 ويحدد الحمل الإنتاجي الكلي.',
            valveTag: 'FV-101'
          },
          {
            tag: 'TRC-102',
            nameEn: 'Desulfurizer Inlet Temperature',
            nameAr: 'حرارة مدخل مفاعلات إزالة الكبريت',
            type: 'TRC',
            unit: '°C',
            min: 100,
            max: 500,
            decimals: 1,
            sp: 380.0,
            pv: 380.0,
            mv: 58,
            mode: 'AUTO',
            alarms: { hh: 420, h: 400, l: 340, ll: 310 },
            pid: { kp: 2.2, ti: 45, td: 4 },
            history: [],
            description: 'يتحكم في كمية الوقود/البخار للمسخن E-101 لضمان درجة الحرارة المثالية لتفاعل ZnO (380°C).',
            valveTag: 'TV-102'
          },
          {
            tag: 'HIC-101',
            nameEn: 'H₂ Recycle to Hydrotreater',
            nameAr: 'تدفق الهيدروجين المدوّر للهدرجة',
            type: 'HIC',
            unit: 'mol %',
            min: 0,
            max: 10,
            decimals: 1,
            sp: 2.5,
            pv: 2.5,
            mv: 42,
            mode: 'AUTO',
            alarms: { hh: 8.0, h: 6.0, l: 1.2, ll: 0.8 },
            pid: { kp: 1.0, ti: 20, td: 0 },
            history: [],
            description: 'يتحكم في نسبة الهيدروجين الراجع من حلقة التخليق لإتمام هدرجة الكبريت العضوي في مفاعل CoMo.',
            valveTag: 'HV-101'
          },
          {
            tag: 'PDC-102',
            nameEn: 'ZnO Reactor ΔP Differential',
            nameAr: 'فرق الضغط عبر طبقة أكسيد الخارصين',
            type: 'PDC',
            unit: 'kg/cm²',
            min: 0,
            max: 3.0,
            decimals: 2,
            sp: 0.65,
            pv: 0.65,
            mv: 30,
            mode: 'AUTO',
            alarms: { hh: 2.2, h: 1.5, l: 0.2, ll: 0.05 },
            pid: { kp: 1.0, ti: 30, td: 0 },
            history: [],
            description: 'يراقب هبوط الضغط عبر المفاعلات R-102A/B للكشف عن انسداد أو تفتت حبيبات العامل المساعد.',
            valveTag: 'PDV-102'
          },
          {
            tag: 'LIC-115',
            nameEn: 'V-115 KO Drum Liquid Level',
            nameAr: 'منسوب السوائل في فاصل التغذية',
            type: 'LIC',
            unit: '%',
            min: 0,
            max: 100,
            decimals: 1,
            sp: 45.0,
            pv: 45.0,
            mv: 45,
            mode: 'AUTO',
            alarms: { hh: 85, h: 70, l: 20, ll: 10 },
            pid: { kp: 2.5, ti: 25, td: 1 },
            history: [],
            description: 'يتحكم في تفريغ الهيدروكربونات السائلة والمياه المفصولة من الغاز لمنع وصول السوائل للفرن.',
            valveTag: 'LV-115'
          }
        ],
        kpis: [
          { id: 'kpi_feed_flow', labelAr: 'تدفق الغاز المغذي', labelEn: 'Feed Flow', value: '24,500', unit: 'Nm³/h', status: 'normal' },
          { id: 'kpi_desulf_temp', labelAr: 'حرارة تفاعل الكبريت', labelEn: 'Desulf Temp', value: '380.0', unit: '°C', status: 'normal' },
          { id: 'kpi_mass_rate', labelAr: 'الحمل الكتلي للغاز', labelEn: 'Mass Flow', value: '17.6', unit: 't/h', status: 'normal' },
          { id: 'kpi_s_slip', labelAr: 'نسبة الكبريت المتبقي', labelEn: 'H2S Slip', value: '< 0.05 ppm', unit: 'ppm', status: 'normal' }
        ],
        disturbances: [
          {
            id: 'dist_feed_press_drop',
            titleAr: 'هبوط ضغط خط الغاز المغذي الرئيسي (Feed Pressure Drop)',
            titleEn: 'Main Gas Pipeline Pressure Drop',
            descriptionAr: 'محاكاة انخفاض ضغط الأنبوب القادم من محطة الرميلة إلى 26 kg/cm² واختبار استجابة صمام PIC-001.',
            severity: 'medium',
            applied: false,
            effect: (ctrls) => {
              if (ctrls['PIC-001']) {
                ctrls['PIC-001'].pv = Math.max(ctrls['PIC-001'].min, ctrls['PIC-001'].pv - 0.25);
              }
            },
            recoveryHintAr: 'قم بفتح صمام PIC-001 يدوياً أو زيادة فتح الصمام التعويضي حتى استقرار ضغط الشبكة.'
          },
          {
            id: 'dist_zno_dp_spike',
            titleAr: 'ارتفاع فرق الضغط عبر المفاعل R-102 (ZnO High ΔP)',
            titleEn: 'ZnO Reactor Bed Dusting / High ΔP',
            descriptionAr: 'تفتت جزيئات المحفز وزيادة ممانعة الجريان مما يرفع PDC-102 ويهدد بانهيار الشباك السفلية.',
            severity: 'critical',
            applied: false,
            effect: (ctrls) => {
              if (ctrls['PDC-102']) {
                ctrls['PDC-102'].pv = Math.min(ctrls['PDC-102'].max, ctrls['PDC-102'].pv + 0.08);
              }
            },
            recoveryHintAr: 'قم بالتحويل على المفاعل الاحتياطي R-102B وتخفيض معدل الجريان FIC-101 لمنع التلف.'
          }
        ],
        interlocks: [
          { tag: 'I-101A', conditionAr: 'انخفاض ضغط الغاز الطبيعي < 22 kg/cm²', actionAr: 'إغلاق صمام القطع الرئيسي XV-001 وإطلاق إنذار ESD', status: 'healthy' },
          { tag: 'I-101B', conditionAr: 'ارتفاع منسوب السوائل في V-115 > 85%', actionAr: 'فتح صمام التصريف الطارئ وفصل التغذية', status: 'healthy' }
        ],
        operatingGuide: {
          startupStepsAr: [
            '1. التأكد من جهوزية الفاصل V-115 وتفريغ السوائل المتجمعة.',
            '2. فتح صمام التطهير بالنتروجين والتأكد من خلو المنظومة من الأكسجين O₂ < 0.1%.',
            '3. بدء تسخين المفاعلات R-102A/B تدريجياً بمعدل لا يتجاوز 30°C/h حتى بلوغ 380°C.',
            '4. إدخال غاز الهيدروجين H₂ وضبط مسيطر HIC-101 على 2.5% لبدء الهدرجة.',
            '5. إدخال الغاز الطبيعي ورفع الضغط تدريجياً عبر PIC-001 إلى 34.5 kg/cm².'
          ],
          shutdownStepsAr: [
            '1. إيقاف تدفق الغاز الطبيعي عبر غلق FIC-101 تدريجياً.',
            '2. الاستمرار في تدوير الهيدروجين والنتروجين لتبريد المفاعل إلى ما دون 150°C.',
            '3. عزل المفاعلات بحشوة نتروجين موجبة لمنع دخول الهواء وتأكسد العامل المساعد.'
          ],
          safetyNotesAr: [
            '⚠️ غاز كبريتيد الهيدروجين H₂S مادة سامة وقاتلة للغاية، يجب فحص التسريبات بأجهزة كشف الغاز.',
            '⚠️ تجنب تجاوز درجة حرارة 400°C في R-102 لمنع تلبد مادة أكسيد الخارصين ZnO.'
          ]
        }
      },

      // 2. REFORMING & STEAM
      sec_reformer: {
        id: 'sec_reformer',
        category: 'reforming',
        numberStr: 'القسم الثاني',
        nameAr: 'قسم الإصلاح الأولي والثانوي وتوليد البخار',
        nameEn: 'Primary & Secondary Reforming & WHB Boiler',
        equipmentSummary: 'R-101 Primary Reformer (288 tubes), R-103 Secondary Reformer, E-108 Waste Heat Boiler',
        descriptionAr: 'تفاعل غاز الميثان مع البخار عالي الضغط فوق محفز النيكل (Ni/Al₂O₃) في الفرن R-101 عند 795°C، ثم الإحراق الجزئي بالهواء في المصلح الثانوي R-103 عند 980°C لتوليد H₂ و N₂ بنسبة 3:1، واسترجاع الطاقة في مرجل البخار E-108.',
        status: 'RUNNING',
        loadPct: 100,
        controllers: [
          {
            tag: 'FRC-103',
            nameEn: 'Steam to Carbon Ratio (S/C)',
            nameAr: 'نسبة البخار إلى الكربون (S/C)',
            type: 'FRC',
            unit: 'mol/mol',
            min: 2.0,
            max: 5.5,
            decimals: 2,
            sp: 3.80,
            pv: 3.80,
            mv: 76,
            mode: 'AUTO',
            alarms: { hh: 5.0, h: 4.5, l: 3.2, ll: 2.8 },
            pid: { kp: 2.0, ti: 12, td: 1 },
            history: [],
            description: 'أهم مسيطر في المصنع: يربط تدفق البخار مع تدفق الغاز لمنع ترسب الكاربون وتدمير أنابيب الفرن.',
            valveTag: 'FV-103'
          },
          {
            tag: 'TRC-101',
            nameEn: 'Primary Reformer Outlet Temp',
            nameAr: 'حرارة مخرج فرن الإصلاح الأولي',
            type: 'TRC',
            unit: '°C',
            min: 600,
            max: 950,
            decimals: 1,
            sp: 795.0,
            pv: 795.0,
            mv: 82,
            mode: 'AUTO',
            alarms: { hh: 850, h: 825, l: 730, ll: 690 },
            pid: { kp: 1.5, ti: 40, td: 5 },
            history: [],
            description: 'يتحكم في معدل احتراق غاز الوقود TC-101 لحفظ حرارة الغاز الخارج عند 795°C لتحقيق أعلى تحويل للميثان.',
            valveTag: 'TC-101'
          },
          {
            tag: 'FRC-105',
            nameEn: 'Process Air Flow to Sec Reformer',
            nameAr: 'معدل تدفق هواء العملية للمصلح الثانوي',
            type: 'FRC',
            unit: 'Nm³/h',
            min: 0,
            max: 28000,
            decimals: 0,
            sp: 18200,
            pv: 18200,
            mv: 68,
            mode: 'AUTO',
            alarms: { hh: 24000, h: 21000, l: 12000, ll: 8000 },
            pid: { kp: 1.4, ti: 15, td: 1 },
            history: [],
            description: 'يتحكم في إدخال النتروجين اللازم للتخليق ويوفر الأكسجين للاحتراق الجزئي في R-103 لرفع الحرارة لـ 980°C.',
            valveTag: 'FV-105'
          },
          {
            tag: 'TRC-103',
            nameEn: 'Secondary Reformer Outlet Temp',
            nameAr: 'حرارة مخرج المصلح الثانوي',
            type: 'TRC',
            unit: '°C',
            min: 800,
            max: 1100,
            decimals: 1,
            sp: 980.0,
            pv: 980.0,
            mv: 74,
            mode: 'AUTO',
            alarms: { hh: 1040, h: 1010, l: 920, ll: 880 },
            pid: { kp: 1.8, ti: 30, td: 3 },
            history: [],
            description: 'يقيس حرارة غاز التخليق الخارج من R-103 بعد اكتمال تفاعل الإصلاح واحتراق الأكسجين بالكامل.',
            valveTag: 'TV-103'
          },
          {
            tag: 'PIC-101',
            nameEn: 'Reformer Draft / Arch Pressure',
            nameAr: 'سحب هواء الفرن وضغط القبة',
            type: 'PIC',
            unit: 'mmH2O',
            min: -20,
            max: 10,
            decimals: 1,
            sp: -5.0,
            pv: -5.0,
            mv: 52,
            mode: 'AUTO',
            alarms: { hh: 2.0, h: 0.0, l: -12.0, ll: -16.0 },
            pid: { kp: 3.0, ti: 8, td: 0.5 },
            history: [],
            description: 'يتحكم في دمبر مدخنة غازات الاحتراق ومروحة السحب القسري ID Fan لمنع هروب اللهب للخارج.',
            valveTag: 'PV-101'
          },
          {
            tag: 'LIC-108',
            nameEn: 'E-108 Steam Drum Level',
            nameAr: 'منسوب خزان البخار عالي الضغط E-108',
            type: 'LIC',
            unit: '%',
            min: 0,
            max: 100,
            decimals: 1,
            sp: 50.0,
            pv: 50.0,
            mv: 50,
            mode: 'AUTO',
            alarms: { hh: 80, h: 65, l: 35, ll: 20 },
            pid: { kp: 2.8, ti: 18, td: 2 },
            history: [],
            description: 'نظام سيطرة ثلاثي العناصر (3-Element Level Control) لضبط ماء تغذية المراجل BFW وحماية الغلاية.',
            valveTag: 'LV-108'
          },
          {
            tag: 'PIC-108',
            nameEn: 'HP Steam Header Pressure',
            nameAr: 'ضغط شبكة البخار عالي الضغط 110 Bar',
            type: 'PIC',
            unit: 'kg/cm²G',
            min: 50,
            max: 140,
            decimals: 1,
            sp: 105.0,
            pv: 105.0,
            mv: 62,
            mode: 'AUTO',
            alarms: { hh: 125, h: 118, l: 90, ll: 80 },
            pid: { kp: 2.0, ti: 20, td: 1 },
            history: [],
            description: 'ينظم ضغط البخار المحمص المغذي لتوربينات الضواغط K-301 و K-302 ومحطات التخفيض.',
            valveTag: 'PV-108'
          }
        ],
        kpis: [
          { id: 'kpi_ref_out_temp', labelAr: 'حرارة مخرج الفرن الأولي', labelEn: 'Pri Ref Outlet', value: '795.0', unit: '°C', status: 'normal' },
          { id: 'kpi_sc_ratio', labelAr: 'نسبة البخار للكربون', labelEn: 'S/C Ratio', value: '3.80', unit: 'mol/mol', status: 'normal' },
          { id: 'kpi_sec_ref_temp', labelAr: 'حرارة المصلح الثانوي', labelEn: 'Sec Ref Outlet', value: '980.0', unit: '°C', status: 'normal' },
          { id: 'kpi_ch4_leak', labelAr: 'الميثان المتبقي (CH4 Slip)', labelEn: 'CH4 Residual', value: '0.45 %', unit: '% vol', status: 'normal' }
        ],
        disturbances: [
          {
            id: 'dist_steam_trip',
            titleAr: 'انخفاض مفاجئ في ضغط البخار (Steam Supply Dip / Coking Risk)',
            titleEn: 'Steam Pressure Drop Hazard',
            descriptionAr: 'هبوط تدفق البخار مما يهدد بانخفاض نسبة S/C وترسب الكاربون داخل أنابيب الفرن الملتهبة.',
            severity: 'critical',
            applied: false,
            effect: (ctrls) => {
              if (ctrls['FRC-103']) {
                ctrls['FRC-103'].pv = Math.max(ctrls['FRC-103'].min, ctrls['FRC-103'].pv - 0.08);
              }
            },
            recoveryHintAr: 'قم فوراً بزيادة فتح صمام البخار FV-103 أو تقليل تدفق الغاز FIC-101 لحفظ S/C > 3.2.'
          },
          {
            id: 'dist_air_trip',
            titleAr: 'تذبذب تدفق هواء المصلح الثانوي (Process Air Flow Dip)',
            titleEn: 'Process Air Surge Disturbance',
            descriptionAr: 'انخفاض تدفق الهواء مما يؤدي إلى هبوط حرارة R-103 وزيادة نسبة الميثان غير المتفاعل.',
            severity: 'medium',
            applied: false,
            effect: (ctrls) => {
              if (ctrls['FRC-105']) {
                ctrls['FRC-105'].pv = Math.max(ctrls['FRC-105'].min, ctrls['FRC-105'].pv - 150);
              }
              if (ctrls['TRC-103']) {
                ctrls['TRC-103'].pv = Math.max(ctrls['TRC-103'].min, ctrls['TRC-103'].pv - 3.5);
              }
            },
            recoveryHintAr: 'ارفع سرعة ضاغطة الهواء K-302 واضبط صمام FRC-105 لاستعادة الحرارة عند 980°C.'
          }
        ],
        interlocks: [
          { tag: 'I-102A', conditionAr: 'انخفاض نسبة S/C < 2.8 mol/mol', actionAr: 'إطفاء الحوارق بالكامل وغلق صمامات الغاز فوراً (ESD Trip)', status: 'healthy' },
          { tag: 'I-102B', conditionAr: 'هبوط منسوب المرجل E-108 < 20%', actionAr: 'إيقاف الفرن وتفعيل مضخة ماء الطوارئ لتفادي انفجار الأنابيب', status: 'healthy' }
        ],
        operatingGuide: {
          startupStepsAr: [
            '1. إشعال حوارق التسخين الأولي تدريجياً لرفع حرارة الفرن بمعدل 25°C/h.',
            '2. إدخال البخار المحمص أولاً وتثبيت الجريان قبل إدخال أي ذرة غاز طبيعي.',
            '3. تثبيت نسبة البخار إلى الكربون S/C عند 4.0 كإجراء أمان أثناء التحميل.',
            '4. تشغيل ضاغطة الهواء K-302 وإدخال الهواء للمصلح الثانوي R-103 ببطء.',
            '5. مراقبة حرارة الغلاية E-108 وتثبيت منسوب ماء المرجل LIC-108.'
          ],
          shutdownStepsAr: [
            '1. قطع الهواء عن المصلح الثانوي فوراً لمنع تراكم الأكسجين.',
            '2. قطع غاز التغذية مع إبقاء تدفق البخار مستمراً لكسح وتبريد الأنابيب.',
            '3. تبريد الفرن تدريجياً عبر مراوح السحب والدمبر حتى وصوله إلى 100°C.'
          ],
          safetyNotesAr: [
            '⚠️ لا تدخل الغاز أبداً بدون وجود تدفق بخار مؤكد — ترسب الكاربون يسبب تمدد وانفجار الأنابيب خلال دقائق.',
            '⚠️ احذر من الضغط الإيجابي في غرفة الاحتراق؛ حافظ دائماً على سحب سالب PIC-101 = -5 mmH2O.'
          ]
        }
      },

      // 3. COMPRESSORS (كل ضاغطة على حدة)
      // 3.1 K-301 Syngas Compressor
      sec_comp_k301: {
        id: 'sec_comp_k301',
        category: 'compressors',
        numberStr: 'القسم الثالث (أ)',
        nameAr: 'ضاغطة غاز التخليق الرئيسية (K-301)',
        nameEn: 'Synthesis Gas Compressor (K-301 & Steam Turbine)',
        equipmentSummary: '4-Stage Centrifugal Compressor driven by 18.5 MW HP Steam Turbine + Intercoolers',
        descriptionAr: 'ضغط غاز التخليق المنقى من 25.5 kg/cm² إلى ضغط حلقة التخليق العالي 245 kg/cm² عبر 4 مراحل انضغاطية مع تدوير الغاز غير المتفاعل (Recycle Wheel) والتحكم بسرعة التوربين وصمامات مانع السرج.',
        status: 'RUNNING',
        loadPct: 100,
        controllers: [
          {
            tag: 'SIC-301',
            nameEn: 'K-301 Turbine Speed Governor',
            nameAr: 'مسيطر سرعة توربين الضاغطة K-301',
            type: 'SIC',
            unit: 'RPM',
            min: 0,
            max: 12000,
            decimals: 0,
            sp: 10450,
            pv: 10450,
            mv: 78,
            mode: 'AUTO',
            alarms: { hh: 11400, h: 10900, l: 8000, ll: 6500 },
            pid: { kp: 2.5, ti: 8, td: 0.5 },
            history: [],
            description: 'يتحكم في صمام دخول بخار الضغط العالي للتوربين لضبط السرعة الدورانية بدقة عالية.',
            valveTag: 'SV-301'
          },
          {
            tag: 'PIC-301',
            nameEn: 'K-301 1st Stage Suction Pressure',
            nameAr: 'ضغط سحب المرحلة الأولى K-301',
            type: 'PIC',
            unit: 'kg/cm²G',
            min: 0,
            max: 40,
            decimals: 1,
            sp: 25.5,
            pv: 25.5,
            mv: 60,
            mode: 'AUTO',
            alarms: { hh: 32, h: 28, l: 20, ll: 16 },
            pid: { kp: 1.8, ti: 12, td: 1 },
            history: [],
            description: 'يراقب وينظم ضغط سحب الغاز القادم من مفاعل الميثانايتر ومكثفات المياه E-116.',
            valveTag: 'PV-301'
          },
          {
            tag: 'PIC-302',
            nameEn: 'K-301 Final Discharge to SynLoop',
            nameAr: 'ضغط تفريغ الضاغطة النهائي لحلقة التخليق',
            type: 'PIC',
            unit: 'kg/cm²G',
            min: 100,
            max: 300,
            decimals: 1,
            sp: 245.0,
            pv: 245.0,
            mv: 82,
            mode: 'AUTO',
            alarms: { hh: 265, h: 255, l: 200, ll: 170 },
            pid: { kp: 2.0, ti: 15, td: 2 },
            history: [],
            description: 'يتحكم في تدفق الغاز المضغوط وحقنه داخل حلقة التخليق والمكثفات الأولية.',
            valveTag: 'PV-302'
          },
          {
            tag: 'HIC-301',
            nameEn: 'Anti-Surge Recycle Valve (Stages 1-4)',
            nameAr: 'صمام مانع السرج وتدوير الغاز K-301',
            type: 'HIC',
            unit: '% Open',
            min: 0,
            max: 100,
            decimals: 1,
            sp: 0.0,
            pv: 0.0,
            mv: 0,
            mode: 'AUTO',
            alarms: { hh: 100, h: 80, l: 0, ll: 0 },
            pid: { kp: 4.0, ti: 2, td: 0.1 },
            history: [],
            description: 'نظام حماية فائق السرعة يفتح صمام التدوير فور اقتراب نقطة التشغيل من خط السرج (Surge Line).',
            valveTag: 'HV-301'
          },
          {
            tag: 'TIC-301',
            nameEn: 'Interstage Coolers Gas Outlet Temp',
            nameAr: 'حرارة الغاز بعد مبردات المراحل البينية',
            type: 'TIC',
            unit: '°C',
            min: 10,
            max: 80,
            decimals: 1,
            sp: 38.0,
            pv: 38.0,
            mv: 54,
            mode: 'AUTO',
            alarms: { hh: 55, h: 45, l: 25, ll: 15 },
            pid: { kp: 1.5, ti: 25, td: 1 },
            history: [],
            description: 'يتحكم في مياه التبريد لمبادلات المراحل لحماية الضاغطة وتقليل طاقة الانضغاط النوعية.',
            valveTag: 'TV-301'
          }
        ],
        kpis: [
          { id: 'kpi_k301_speed', labelAr: 'سرعة التوربين K-301', labelEn: 'Turbine Speed', value: '10,450', unit: 'RPM', status: 'normal' },
          { id: 'kpi_k301_disch', labelAr: 'ضغط التفريغ النهائي', labelEn: 'Discharge Press', value: '245.0', unit: 'kg/cm²', status: 'normal' },
          { id: 'kpi_k301_power', labelAr: 'القدرة التوربينية المستهلكة', labelEn: 'Shaft Power', value: '18.5', unit: 'MW', status: 'normal' },
          { id: 'kpi_k301_eff', labelAr: 'الكفاءة المتعددة (Polytropic)', labelEn: 'Polytropic Eff', value: '84.2 %', unit: '%', status: 'normal' }
        ],
        disturbances: [
          {
            id: 'dist_k301_surge',
            titleAr: 'اقتراب من منطقة السرج (Compressor Surge Condition)',
            titleEn: 'K-301 Impending Surge Event',
            descriptionAr: 'انخفاض مفاجئ في التدفق وارتفاع الضغط مما يدفع الضاغطة نحو خط السرج الاهتزازي.',
            severity: 'critical',
            applied: false,
            effect: (ctrls) => {
              if (ctrls['HIC-301']) {
                ctrls['HIC-301'].pv = Math.min(ctrls['HIC-301'].max, ctrls['HIC-301'].pv + 15);
              }
              if (ctrls['SIC-301']) {
                ctrls['SIC-301'].pv = Math.min(ctrls['SIC-301'].max, ctrls['SIC-301'].pv + 120);
              }
            },
            recoveryHintAr: 'افتح صمام مانع السرج HIC-301 فوراً وزد التدفق لمنع التدمير الميكانيكي للمحاور.'
          }
        ],
        interlocks: [
          { tag: 'I-301A', conditionAr: 'ارتفاع اهتزاز المحور > 38 µm', actionAr: 'فصل التوربين وغلق صمام البخار الرئيسي فوراً (Trip)', status: 'healthy' },
          { tag: 'I-301B', conditionAr: 'هبوط ضغط زيت التزييت < 1.2 kg/cm²', actionAr: 'تشغيل مضخة زيت الطوارئ وفصل الضاغطة', status: 'healthy' }
        ],
        operatingGuide: {
          startupStepsAr: [
            '1. تدوير منظومة التزييت وختم الغاز (Lube & Seal Oil) والتأكد من ضغطها الطبيعي.',
            '2. تدفئة التوربين البخاري البطيئة (Slow Rolling at 500 RPM) لمنع تقوس المحور.',
            '3. فتح صمامات مانع السرج HIC-301 بنسبة 100% بالكامل قبل التسريع.',
            '4. رفع السرعة تدريجياً وتجاوز السرعات الحرجة (Critical Speeds) بسرعة وبدون توقف.',
            '5. بعد استقرار السرعة عند 10,450 RPM، يتم غلق صمامات السرج تدريجياً.'
          ],
          shutdownStepsAr: [
            '1. فتح صمام مانع السرج HIC-301 بنسبة 100% فوراً لتفريغ الحمل.',
            '2. خفض سرعة التوربين تدريجياً ثم غلق صمام البخار SV-301.',
            '3. تشغيل جهاز التدوير البطيء (Barring Gear / Turning Device) لعدة ساعات أثناء التبريد.'
          ],
          safetyNotesAr: [
            '⚠️ ظاهرة السرج (Surge) تؤدي إلى ارتداد الغاز واهتزازات عنيفة قد تدمر ريش الضاغطة خلال ثوانٍ معدودة.',
            '⚠️ لا تتوقف أبداً عند السرعة الحرجة للتوربين أثناء الإقلاع أو التباطؤ.'
          ]
        }
      },

      // 3.2 K-302 Process Air Compressor
      sec_comp_k302: {
        id: 'sec_comp_k302',
        category: 'compressors',
        numberStr: 'القسم الثالث (ب)',
        nameAr: 'ضاغطة هواء المصلح الثانوي (K-302)',
        nameEn: 'Process Air Compressor (K-302)',
        equipmentSummary: 'Multi-Stage Centrifugal Air Compressor with Intercoolers & Steam Turbine Drive',
        descriptionAr: 'سحب الهواء الجوي وترشيحه ثم ضغطه إلى 33.5 kg/cm² وضخه إلى المصلح الثانوي R-103 لتوفير الأكسجين للاحتراق والنتروجين لتخليق الأمونيا مع منظومة صمامات التفريغ الجوي (Blow-off).',
        status: 'RUNNING',
        loadPct: 100,
        controllers: [
          {
            tag: 'SIC-302',
            nameEn: 'K-302 Air Turbine Speed',
            nameAr: 'سرعة توربين ضاغطة الهواء K-302',
            type: 'SIC',
            unit: 'RPM',
            min: 0,
            max: 10500,
            decimals: 0,
            sp: 8800,
            pv: 8800,
            mv: 72,
            mode: 'AUTO',
            alarms: { hh: 9800, h: 9300, l: 6500, ll: 5500 },
            pid: { kp: 2.2, ti: 10, td: 0.5 },
            history: [],
            description: 'يتحكم في صمام دخول البخار للتوربين لتعديل سرعة ضخ الهواء للفرن الثانوي.',
            valveTag: 'SV-302'
          },
          {
            tag: 'FRC-302',
            nameEn: 'Discharge Air Flow Controller',
            nameAr: 'معدل تدفق الهواء المضغوط',
            type: 'FRC',
            unit: 'Nm³/h',
            min: 0,
            max: 26000,
            decimals: 0,
            sp: 18500,
            pv: 18500,
            mv: 70,
            mode: 'AUTO',
            alarms: { hh: 24000, h: 21000, l: 12000, ll: 8000 },
            pid: { kp: 1.6, ti: 12, td: 1 },
            history: [],
            description: 'ينظم كمية الهواء الصافية الداخلة للمصلح الثانوي بدقة بالغة لضبط نسبة H2:N2.',
            valveTag: 'FV-302'
          },
          {
            tag: 'HIC-302',
            nameEn: 'Air Blow-Off to Atmosphere',
            nameAr: 'صمام تفريغ الهواء الجوي / مانع السرج',
            type: 'HIC',
            unit: '% Open',
            min: 0,
            max: 100,
            decimals: 1,
            sp: 0.0,
            pv: 0.0,
            mv: 0,
            mode: 'AUTO',
            alarms: { hh: 100, h: 80, l: 0, ll: 0 },
            pid: { kp: 3.5, ti: 3, td: 0.2 },
            history: [],
            description: 'يفرغ الهواء الفائض إلى الجو عبر كاتم الصوت في حالات الإقلاع والاضطرابات.',
            valveTag: 'HV-302'
          },
          {
            tag: 'PIC-304',
            nameEn: 'K-302 Discharge Air Pressure',
            nameAr: 'ضغط تفريغ هواء العملية',
            type: 'PIC',
            unit: 'kg/cm²G',
            min: 0,
            max: 50,
            decimals: 1,
            sp: 33.5,
            pv: 33.5,
            mv: 66,
            mode: 'AUTO',
            alarms: { hh: 42, h: 38, l: 26, ll: 20 },
            pid: { kp: 1.8, ti: 15, td: 1 },
            history: [],
            description: 'يراقب ضغط مخرج الضاغطة قبل دخوله مسخن الهواء ومفاعل R-103.',
            valveTag: 'PV-304'
          }
        ],
        kpis: [
          { id: 'kpi_k302_flow', labelAr: 'تدفق الهواء الإجمالي', labelEn: 'Air Flow Rate', value: '18,500', unit: 'Nm³/h', status: 'normal' },
          { id: 'kpi_k302_press', labelAr: 'ضغط تفريغ الهواء', labelEn: 'Air Press', value: '33.5', unit: 'kg/cm²', status: 'normal' },
          { id: 'kpi_k302_power', labelAr: 'استهلاك التوربين', labelEn: 'Power Duty', value: '7.8', unit: 'MW', status: 'normal' }
        ],
        disturbances: [],
        interlocks: [
          { tag: 'I-302A', conditionAr: 'هبوط ضغط تفريغ الهواء < 20 kg/cm²', actionAr: 'إغلاق صمام دخول الهواء للمصلح الثانوي وعزل الضاغطة', status: 'healthy' }
        ],
        operatingGuide: {
          startupStepsAr: [
            '1. فحص فلاتر الهواء وسحب الهواء الجوي.',
            '2. فتح صمام التفريغ الجوي HIC-302 بالكامل.',
            '3. رفع سرعة التوربين إلى 8,800 RPM.',
            '4. التحويل التدريجي للهواء نحو المصلح الثانوي R-103 مع غلق صمام Blow-off.'
          ],
          shutdownStepsAr: [
            '1. فتح صمام التفريغ HIC-302 وعزل الخط المتجه للفرن الثانوي.',
            '2. خفض سرعة التوربين وتبريد الضاغطة.'
          ],
          safetyNotesAr: [
            '⚠️ لا تسمح أبداً بارتداد الغاز القابل للاشتعال من المصلح الثانوي إلى ضاغطة الهواء.'
          ]
        }
      },

      // 3.3 K-303 Natural Gas Booster Compressor
      sec_comp_k303: {
        id: 'sec_comp_k303',
        category: 'compressors',
        numberStr: 'القسم الثالث (ج)',
        nameAr: 'ضاغطة الغاز الطبيعي والوقود (K-303)',
        nameEn: 'Natural Gas Booster Compressor (K-303)',
        equipmentSummary: 'Electric Motor / Steam Driven Booster Compressor for Low Pressure Feed Gas',
        descriptionAr: 'رفع ضغط الغاز الطبيعي القادم من خطوط الأنابيب من 15 kg/cm² إلى 38 kg/cm² لتأمين ضغط التغذية المطلوب لوحدات إزالة الكبريت وغاز الوقود لحوارق الفرن.',
        status: 'RUNNING',
        loadPct: 100,
        controllers: [
          {
            tag: 'SIC-303',
            nameEn: 'K-303 Compressor Speed',
            nameAr: 'سرعة ضاغطة الغاز الطبيعي K-303',
            type: 'SIC',
            unit: 'RPM',
            min: 0,
            max: 8000,
            decimals: 0,
            sp: 6200,
            pv: 6200,
            mv: 65,
            mode: 'AUTO',
            alarms: { hh: 7200, h: 6800, l: 4500, ll: 3500 },
            pid: { kp: 2.0, ti: 12, td: 0.5 },
            history: [],
            description: 'يتحكم في محرك الضاغطة لتعديل معدل تدفق الغاز المضغوط.',
            valveTag: 'SV-303'
          },
          {
            tag: 'PIC-303',
            nameEn: 'K-303 Booster Discharge Pressure',
            nameAr: 'ضغط تفريغ ضاغطة الغاز المغذي',
            type: 'PIC',
            unit: 'kg/cm²G',
            min: 0,
            max: 50,
            decimals: 1,
            sp: 38.0,
            pv: 38.0,
            mv: 70,
            mode: 'AUTO',
            alarms: { hh: 45, h: 42, l: 28, ll: 22 },
            pid: { kp: 1.8, ti: 14, td: 1 },
            history: [],
            description: 'يضبط ضغط خروج الغاز المتجه لوحدة إزالة الكبريت والفرن الأولي.',
            valveTag: 'PV-303'
          },
          {
            tag: 'HIC-303',
            nameEn: 'K-303 Suction Recycle / Bypass',
            nameAr: 'صمام تدوير وتجاوز الغاز الطبيعي',
            type: 'HIC',
            unit: '% Open',
            min: 0,
            max: 100,
            decimals: 1,
            sp: 0.0,
            pv: 0.0,
            mv: 0,
            mode: 'AUTO',
            alarms: { hh: 100, h: 80, l: 0, ll: 0 },
            pid: { kp: 3.0, ti: 5, td: 0.1 },
            history: [],
            description: 'يعيد تدوير الغاز من التفريغ إلى السحب لحماية الضاغطة عند انخفاض الطلب.',
            valveTag: 'HV-303'
          }
        ],
        kpis: [
          { id: 'kpi_k303_press', labelAr: 'ضغط التفريغ', labelEn: 'Discharge Press', value: '38.0', unit: 'kg/cm²', status: 'normal' }
        ],
        disturbances: [],
        interlocks: [
          { tag: 'I-303A', conditionAr: 'ارتفاع حرارة محامل الضاغطة > 95°C', actionAr: 'فصل الضاغطة فوراً', status: 'healthy' }
        ],
        operatingGuide: {
          startupStepsAr: ['1. التطهير بالنتروجين ثم إدخال الغاز الطبيعي.', '2. تشغيل الضاغطة ورفع الضغط لـ 38 kg/cm².'],
          shutdownStepsAr: ['1. فتح صمام التدوير HIC-303 وتفريغ الضغط.'],
          safetyNotesAr: ['⚠️ فحص مانعات التسرب الغازية الجافة (Dry Gas Seals) بانتظام.']
        }
      },

      // 3.4 K-401 Ammonia Refrigeration Machine
      sec_comp_k401: {
        id: 'sec_comp_k401',
        category: 'compressors',
        numberStr: 'القسم الثالث (د)',
        nameAr: 'ضاغطة التبريد والتثليج للأمونيا (K-401)',
        nameEn: 'Ammonia Refrigeration Compressor (K-401)',
        equipmentSummary: '4-Stage Centrifugal Refrigeration Compressor with Multi-Level Flash Chillers',
        descriptionAr: 'منظومة تثليج مغلقة تستخدم بخار الأمونيا كوسيط تبريد عبر 4 مراحل ضغط لتكثيف وفصل الأمونيا السائلة من حلقة التخليق عند درجات حرارة تصل إلى -33°C وتبريد خزانات الخزن الجوي F-401.',
        status: 'RUNNING',
        loadPct: 100,
        controllers: [
          {
            tag: 'SIC-401',
            nameEn: 'K-401 Refrigeration Turbine Speed',
            nameAr: 'سرعة توربين ضاغطة التثليج K-401',
            type: 'SIC',
            unit: 'RPM',
            min: 0,
            max: 11000,
            decimals: 0,
            sp: 9200,
            pv: 9200,
            mv: 74,
            mode: 'AUTO',
            alarms: { hh: 10200, h: 9700, l: 7000, ll: 5800 },
            pid: { kp: 2.0, ti: 12, td: 0.5 },
            history: [],
            description: 'يتحكم في بخار التوربين لتوفير طاقة التبريد المطلوبة للمصنع.',
            valveTag: 'SV-401'
          },
          {
            tag: 'PIC-401',
            nameEn: '1st Stage Chiller Suction (-33°C)',
            nameAr: 'ضغط سحب المرحلة الأولى (-33°C)',
            type: 'PIC',
            unit: 'kg/cm²G',
            min: -0.5,
            max: 1.5,
            decimals: 2,
            sp: 0.05,
            pv: 0.05,
            mv: 58,
            mode: 'AUTO',
            alarms: { hh: 0.8, h: 0.4, l: -0.2, ll: -0.4 },
            pid: { kp: 2.5, ti: 15, td: 1 },
            history: [],
            description: 'يحافظ على ضغط مبرد الأمونيا العميق (-33°C) لفصل الغاز وتبريد الخزانات.',
            valveTag: 'PV-401A'
          },
          {
            tag: 'PIC-404',
            nameEn: '4th Stage Discharge to NH3 Condenser',
            nameAr: 'ضغط التفريغ لمكثف الأمونيا المائي',
            type: 'PIC',
            unit: 'kg/cm²G',
            min: 5.0,
            max: 22.0,
            decimals: 1,
            sp: 15.2,
            pv: 15.2,
            mv: 66,
            mode: 'AUTO',
            alarms: { hh: 19.5, h: 17.5, l: 11.0, ll: 9.0 },
            pid: { kp: 1.8, ti: 18, td: 1 },
            history: [],
            description: 'يتحكم في تبريد المكثف E-404 لتحويل بخار الأمونيا إلى سائل عند ضغط 15.2 kg/cm².',
            valveTag: 'PV-404'
          },
          {
            tag: 'HIC-401',
            nameEn: 'Ammonia Hot-Gas Bypass Valve',
            nameAr: 'صمام الغاز الساخن لتنظيم حمل التبريد',
            type: 'HIC',
            unit: '% Open',
            min: 0,
            max: 100,
            decimals: 1,
            sp: 5.0,
            pv: 5.0,
            mv: 5,
            mode: 'AUTO',
            alarms: { hh: 100, h: 80, l: 0, ll: 0 },
            pid: { kp: 3.0, ti: 8, td: 0.2 },
            history: [],
            description: 'يقوم بحقن غاز ساخن من التفريغ إلى السحب لمنع تكون فراغ (Vacuum) وحماية الضاغطة.',
            valveTag: 'HV-401'
          }
        ],
        kpis: [
          { id: 'kpi_k401_p1', labelAr: 'ضغط مرحلة -33°C', labelEn: 'Stage 1 Press', value: '0.05', unit: 'kg/cm²', status: 'normal' },
          { id: 'kpi_k401_p4', labelAr: 'ضغط تكثيف الأمونيا', labelEn: 'Condenser Press', value: '15.2', unit: 'kg/cm²', status: 'normal' },
          { id: 'kpi_k401_t1', labelAr: 'أدنى حرارة تثليج', labelEn: 'Lowest Chill Temp', value: '-33.2 °C', unit: '°C', status: 'normal' }
        ],
        disturbances: [],
        interlocks: [
          { tag: 'I-401A', conditionAr: 'ارتفاع ضغط المكثف > 19.5 kg/cm²', actionAr: 'فصل الضاغطة فوراً لحماية الأوعية من الضغط الزائد', status: 'healthy' }
        ],
        operatingGuide: {
          startupStepsAr: [
            '1. التأكد من توفر مياه التبريد لمكثفات الأمونيا E-404.',
            '2. تسخين التوربين وتدوير الزيت.',
            '3. بدء تشغيل K-401 وتبريد مبردات الأمونيا بالتدريج.'
          ],
          shutdownStepsAr: ['1. إيقاف الضاغطة واسترجاع بخار الأمونيا إلى أوعية التجميع.'],
          safetyNotesAr: ['⚠️ الأمونيا مادة حارقة وخانقة وتسبب حروق تجميد قاسية عند ملامسة السوائل.']
        }
      },

      // 4. SHIFT, CO2 REMOVAL & METHANATION
      sec_purif: {
        id: 'sec_purif',
        category: 'purification',
        numberStr: 'القسم الرابع',
        nameAr: 'قسم التحويل وإزالة CO₂ والميثانايتر',
        nameEn: 'Shift Conversion, CO2 Removal (Catacarb) & Methanation',
        equipmentSummary: 'HTS R-104 (Fe/Cr), LTS R-105 (Cu/Zn), Absorber T-201, Stripper T-202, Methanator R-106 (Ni)',
        descriptionAr: 'تحويل أول أكسيد الكربون السام إلى CO₂ وهيدروجين إضافي عبر مفاعلي HTS (360°C) و LTS (210°C)، ثم امتصاص غاز CO₂ بالكامل في برج الكاتاكارب T-201، وأخيراً تحويل ما تبقى من أكاسيد الكربون (<5 ppm) إلى ميثان في R-106 لحماية محفز تخليق الأمونيا.',
        status: 'RUNNING',
        loadPct: 100,
        controllers: [
          {
            tag: 'TRC-104',
            nameEn: 'HTS Reactor Inlet Temperature',
            nameAr: 'حرارة مدخل مفاعل التحويل العالي HTS',
            type: 'TRC',
            unit: '°C',
            min: 250,
            max: 450,
            decimals: 1,
            sp: 360.0,
            pv: 360.0,
            mv: 55,
            mode: 'AUTO',
            alarms: { hh: 410, h: 385, l: 330, ll: 300 },
            pid: { kp: 2.0, ti: 25, td: 2 },
            history: [],
            description: 'يتحكم في صمام حقن الماء/البخار أو مبادل التبريد لضبط حرارة تفاعل HTS عند 360°C.',
            valveTag: 'TV-104'
          },
          {
            tag: 'TRC-105',
            nameEn: 'LTS Reactor Inlet Temperature',
            nameAr: 'حرارة مدخل مفاعل التحويل الواطئ LTS',
            type: 'TRC',
            unit: '°C',
            min: 150,
            max: 300,
            decimals: 1,
            sp: 210.0,
            pv: 210.0,
            mv: 48,
            mode: 'AUTO',
            alarms: { hh: 250, h: 230, l: 190, ll: 175 },
            pid: { kp: 2.2, ti: 30, td: 2 },
            history: [],
            description: 'يضبط حرارة غاز التخليق فوق محفز النحاس Cu/ZnO الحساس جداً لخفض نسبة CO إلى ما دون 0.3%.',
            valveTag: 'TV-105'
          },
          {
            tag: 'FRC-201',
            nameEn: 'Catacarb Solution Circulation Rate',
            nameAr: 'معدل تدوير محلول الكاتاكارب K2CO3',
            type: 'FRC',
            unit: 'm³/h',
            min: 0,
            max: 800,
            decimals: 0,
            sp: 480,
            pv: 480,
            mv: 68,
            mode: 'AUTO',
            alarms: { hh: 700, h: 620, l: 300, ll: 200 },
            pid: { kp: 1.5, ti: 12, td: 0.5 },
            history: [],
            description: 'يتحكم في مضخات تدوير محلول كربونات البوتاسيوم الحار لامتصاص ثاني أكسيد الكربون في T-201.',
            valveTag: 'FV-201'
          },
          {
            tag: 'TRC-202',
            nameEn: 'Catacarb Reboiler Steam Heating',
            nameAr: 'حرارة مرجل تجريد الكاتاكارب T-202',
            type: 'TRC',
            unit: '°C',
            min: 80,
            max: 160,
            decimals: 1,
            sp: 125.0,
            pv: 125.0,
            mv: 62,
            mode: 'AUTO',
            alarms: { hh: 145, h: 135, l: 110, ll: 95 },
            pid: { kp: 2.0, ti: 20, td: 2 },
            history: [],
            description: 'يتحكم في تدفق بخار الضغط المنخفض لغلي المحلول وطرد غاز CO₂ النقي المتجه لمصنع اليوريا.',
            valveTag: 'TV-202'
          },
          {
            tag: 'LIC-201',
            nameEn: 'Absorber T-201 Bottom Level',
            nameAr: 'منسوب المحلول في قعر برج الامتصاص T-201',
            type: 'LIC',
            unit: '%',
            min: 0,
            max: 100,
            decimals: 1,
            sp: 55.0,
            pv: 55.0,
            mv: 55,
            mode: 'AUTO',
            alarms: { hh: 85, h: 70, l: 30, ll: 15 },
            pid: { kp: 2.6, ti: 15, td: 1 },
            history: [],
            description: 'يتحكم في صمام تفريغ المحلول الغني بالـ CO₂ وتمريره إلى توربين استرجاع الطاقة الهيدروليكية.',
            valveTag: 'LV-201'
          },
          {
            tag: 'TRC-106',
            nameEn: 'Methanator Inlet Temperature',
            nameAr: 'حرارة مدخل مفاعل الميثانايتر R-106',
            type: 'TRC',
            unit: '°C',
            min: 200,
            max: 400,
            decimals: 1,
            sp: 290.0,
            pv: 290.0,
            mv: 52,
            mode: 'AUTO',
            alarms: { hh: 340, h: 315, l: 260, ll: 230 },
            pid: { kp: 2.0, ti: 25, td: 2 },
            history: [],
            description: 'يضبط حرارة الغاز الداخل إلى R-106 لضمان التفاعل التام لتحويل CO و CO₂ إلى ميثان.',
            valveTag: 'TV-106'
          },
          {
            tag: 'ARC-106',
            nameEn: 'Methanator Exit Residual CO+CO₂',
            nameAr: 'نسبة أكاسيد الكربون المتبقية بعد الميثانايتر',
            type: 'ARC',
            unit: 'ppm',
            min: 0,
            max: 50,
            decimals: 1,
            sp: 2.0,
            pv: 2.0,
            mv: 20,
            mode: 'AUTO',
            alarms: { hh: 20.0, h: 10.0, l: 0.0, ll: 0.0 },
            pid: { kp: 1.0, ti: 30, td: 0 },
            history: [],
            description: 'محلل غازي مستمر فائق الحساسية لحماية محفز تخليق الأمونيا من التسمم بأكاسيد الكربون.',
            valveTag: 'AV-106'
          }
        ],
        kpis: [
          { id: 'kpi_hts_temp', labelAr: 'حرارة مفاعل التحويل العالي', labelEn: 'HTS Temp', value: '360.0', unit: '°C', status: 'normal' },
          { id: 'kpi_cat_flow', labelAr: 'تدوير محلول الكاتاكارب', labelEn: 'Catacarb Circ', value: '480', unit: 'm³/h', status: 'normal' },
          { id: 'kpi_meth_temp', labelAr: 'حرارة الميثانايتر R-106', labelEn: 'Methanator Temp', value: '290.0', unit: '°C', status: 'normal' },
          { id: 'kpi_co_slip', labelAr: 'الشوائب المتبقية (CO+CO2)', labelEn: 'Residual Oxides', value: '< 3 ppm', unit: 'ppm', status: 'normal' }
        ],
        disturbances: [
          {
            id: 'dist_co2_slip',
            titleAr: 'هروب ثاني أكسيد الكربون من البرج (Catacarb High CO2 Slip)',
            titleEn: 'CO2 Breakthrough Hazard',
            descriptionAr: 'انخفاض كفاءة الامتصاص في T-201 مما يرفع نسبة CO₂ الداخلة للميثانايتر ويؤدي لارتفاع حرارة مفاجئ Runaway.',
            severity: 'critical',
            applied: false,
            effect: (ctrls) => {
              if (ctrls['ARC-106']) {
                ctrls['ARC-106'].pv = Math.min(ctrls['ARC-106'].max, ctrls['ARC-106'].pv + 3.5);
              }
              if (ctrls['TRC-106']) {
                ctrls['TRC-106'].pv = Math.min(ctrls['TRC-106'].max, ctrls['TRC-106'].pv + 12);
              }
            },
            recoveryHintAr: 'ارفع معدل تدوير الكاتاكارب FRC-201 وزد تسخين المرجل TRC-202 فوراً.'
          }
        ],
        interlocks: [
          { tag: 'I-106A', conditionAr: 'ارتفاع حرارة الميثانايتر > 340°C أو CO+CO2 > 20 ppm', actionAr: 'تنفيس الغاز للجو وعزل حلقة التخليق لمنع تسمم محفز الأمونيا', status: 'healthy' }
        ],
        operatingGuide: {
          startupStepsAr: [
            '1. تدفئة مفاعلات التحويل HTS و LTS بالنتروجين والبخار.',
            '2. ملء أبراج الكاتاكارب وتدوير المحلول وتثبيت حرارة المرجل عند 125°C.',
            '3. إدخال الغاز تدريجياً وضبط حرارة مدخل الميثانايتر R-106 عند 290°C.',
            '4. التحقق من نقاوة الغاز وخلوه من CO و CO₂ (<5 ppm) قبل إدخاله لضاغطة التخليق.'
          ],
          shutdownStepsAr: [
            '1. عزل مفاعلات LTS و HTS بحشوة نتروجين خامل.',
            '2. غسل وتدوير أبراج الكاتاكارب بالماء المقطر في حالات الصيانة الطويلة.'
          ],
          safetyNotesAr: [
            '⚠️ أكاسيد الكربون (CO + CO₂) هي سم قاتل لمحفز الحديد في برج الأمونيا، يجب عزل الغاز فوراً إذا تجاوزت 10 ppm.'
          ]
        }
      },

      // 5. AMMONIA SYNTHESIS LOOP & STORAGE
      sec_synloop: {
        id: 'sec_synloop',
        category: 'synthesis',
        numberStr: 'القسم الخامس',
        nameAr: 'قسم حلقة تخليق الأمونيا والتبريد والخزن',
        nameEn: 'Ammonia Synthesis Loop, Converter & Storage',
        equipmentSummary: 'R-401 4-Bed Radial Flow Converter, E-401/402 Heat Exchangers, V-401 Separator, F-401 Storage Tank',
        descriptionAr: 'تفاعل الهيدروجين مع النتروجين (N₂ + 3H₂ ⇌ 2NH₃) تحت ضغط 239 kg/cm² وحرارة 470°C فوق محفز الحديد المنشط (Promoted Fe)، مع استخدام صمامات التبريد المباشر (Quench Valves) بين الطبقات، وفصل الأمونيا السائلة بالتبريد، وتخزينها في الخزان المبرد F-401 عند -33°C.',
        status: 'RUNNING',
        loadPct: 100,
        controllers: [
          {
            tag: 'TRC-401',
            nameEn: 'R-401 Converter Bed 1 Inlet Temp',
            nameAr: 'حرارة مدخل الطبقة الأولى لمفاعل الأمونيا',
            type: 'TRC',
            unit: '°C',
            min: 350,
            max: 550,
            decimals: 1,
            sp: 410.0,
            pv: 410.0,
            mv: 62,
            mode: 'AUTO',
            alarms: { hh: 520, h: 485, l: 380, ll: 350 },
            pid: { kp: 2.5, ti: 20, td: 3 },
            history: [],
            description: 'يتحكم في صمام التغذية الرئيسي والمبادل البيني E-401 لبدء تفاعل هابر عند 410°C.',
            valveTag: 'TV-401'
          },
          {
            tag: 'HC-401A',
            nameEn: 'Bed 2 Cold Shot Quench Valve',
            nameAr: 'صمام تبريد الطبقة الثانية (Quench 1)',
            type: 'HIC',
            unit: '% Open',
            min: 0,
            max: 100,
            decimals: 1,
            sp: 18.0,
            pv: 18.0,
            mv: 18,
            mode: 'AUTO',
            alarms: { hh: 100, h: 80, l: 0, ll: 0 },
            pid: { kp: 2.0, ti: 15, td: 1 },
            history: [],
            description: 'يحقن غازاً بارداً بين الطبقة 1 و 2 لخفض الحرارة إلى 395°C وتعظيم معدل الاتزان الكيميائي.',
            valveTag: 'HV-401A'
          },
          {
            tag: 'HC-401B',
            nameEn: 'Bed 3 Cold Shot Quench Valve',
            nameAr: 'صمام تبريد الطبقة الثالثة (Quench 2)',
            type: 'HIC',
            unit: '% Open',
            min: 0,
            max: 100,
            decimals: 1,
            sp: 22.0,
            pv: 22.0,
            mv: 22,
            mode: 'AUTO',
            alarms: { hh: 100, h: 80, l: 0, ll: 0 },
            pid: { kp: 2.0, ti: 15, td: 1 },
            history: [],
            description: 'يضبط حرارة مدخل الطبقة الثالثة عند 390°C.',
            valveTag: 'HV-401B'
          },
          {
            tag: 'PIC-401',
            nameEn: 'Synthesis Loop System Pressure',
            nameAr: 'ضغط منظومة حلقة تخليق الأمونيا',
            type: 'PIC',
            unit: 'kg/cm²G',
            min: 150,
            max: 280,
            decimals: 1,
            sp: 239.0,
            pv: 239.0,
            mv: 75,
            mode: 'AUTO',
            alarms: { hh: 265, h: 252, l: 190, ll: 165 },
            pid: { kp: 2.2, ti: 18, td: 2 },
            history: [],
            description: 'ينظم الضغط التشغيلي الكلي لحلقة التخليق عبر موازنة معدل الإنتاج والغازات المطرودة.',
            valveTag: 'PV-401'
          },
          {
            tag: 'ARC-401',
            nameEn: 'Loop H₂/N₂ Molar Ratio Analyzer',
            nameAr: 'نسبة الهيدروجين إلى النتروجين في الحلقة',
            type: 'ARC',
            unit: 'mol/mol',
            min: 1.5,
            max: 4.5,
            decimals: 2,
            sp: 3.00,
            pv: 3.00,
            mv: 50,
            mode: 'AUTO',
            alarms: { hh: 3.6, h: 3.3, l: 2.7, ll: 2.3 },
            pid: { kp: 1.2, ti: 40, td: 1 },
            history: [],
            description: 'يحافظ على النسبة التفاعلية المثالية 3:1 لتحقيق أعلى مردود إنتاجي للأمونيا.',
            valveTag: 'AV-401'
          },
          {
            tag: 'FRC-401',
            nameEn: 'Purge Gas Flow to Recovery',
            nameAr: 'معدل طرد الغازات الخاملة من الحلقة (Purge)',
            type: 'FRC',
            unit: 'Nm³/h',
            min: 0,
            max: 8000,
            decimals: 0,
            sp: 2400,
            pv: 2400,
            mv: 42,
            mode: 'AUTO',
            alarms: { hh: 6000, h: 4500, l: 800, ll: 300 },
            pid: { kp: 1.5, ti: 12, td: 0.5 },
            history: [],
            description: 'يطرد الميثان والأرغون المتراكمين في الحلقة لمنع هبوط الضغط الجزئي للهيدروجين والنتروجين.',
            valveTag: 'FV-401'
          },
          {
            tag: 'LIC-401',
            nameEn: 'V-401 Ammonia Catchpot Level',
            nameAr: 'منسوب فاصل الأمونيا السائلة V-401',
            type: 'LIC',
            unit: '%',
            min: 0,
            max: 100,
            decimals: 1,
            sp: 50.0,
            pv: 50.0,
            mv: 50,
            mode: 'AUTO',
            alarms: { hh: 80, h: 65, l: 30, ll: 15 },
            pid: { kp: 2.4, ti: 15, td: 1 },
            history: [],
            description: 'يتحكم في سحب الأمونيا السائلة النقية المنتجة وإرسالها إلى مبردات الفلاش والخزان F-401.',
            valveTag: 'LV-401'
          },
          {
            tag: 'PIC-405',
            nameEn: 'F-401 Atmospheric Storage Tank Pressure',
            nameAr: 'ضغط خزان الأمونيا المبرد F-401',
            type: 'PIC',
            unit: 'mmH2O',
            min: 0,
            max: 800,
            decimals: 0,
            sp: 350,
            pv: 350,
            mv: 45,
            mode: 'AUTO',
            alarms: { hh: 700, h: 550, l: 150, ll: 50 },
            pid: { kp: 2.0, ti: 10, td: 0.5 },
            history: [],
            description: 'يتحكم في ضواغط استرجاع الغاز المتبخر (BOG Compressors) لحفظ الخزان عند ضغط آمن.',
            valveTag: 'PV-405'
          }
        ],
        kpis: [
          { id: 'kpi_syn_press', labelAr: 'ضغط حلقة التخليق', labelEn: 'Loop Pressure', value: '239.0', unit: 'kg/cm²', status: 'normal' },
          { id: 'kpi_conv_temp', labelAr: 'حرارة المفاعل القصوى', labelEn: 'Peak Conv Temp', value: '470.0', unit: '°C', status: 'normal' },
          { id: 'kpi_h2n2_ratio', labelAr: 'نسبة H2 / N2', labelEn: 'H2/N2 Ratio', value: '3.00', unit: 'mol/mol', status: 'normal' },
          { id: 'kpi_daily_prod', labelAr: 'الإنتاج اليومي للأمونيا', labelEn: 'Daily Production', value: '1,000', unit: 'MT/Day', status: 'normal' }
        ],
        disturbances: [
          {
            id: 'dist_inerts_buildup',
            titleAr: 'تراكم الغازات الخاملة في الحلقة (High Inerts > 14%)',
            titleEn: 'Loop Inerts Accumulation Hazard',
            descriptionAr: 'انغلاق صمام الطرد FRC-401 مما يرفع تركيز الميثان والأرغون ويخفض الضغط الجزئي لتفاعل الأمونيا.',
            severity: 'critical',
            applied: false,
            effect: (ctrls) => {
              if (ctrls['PIC-401']) {
                ctrls['PIC-401'].pv = Math.min(ctrls['PIC-401'].max, ctrls['PIC-401'].pv + 4.5);
              }
            },
            recoveryHintAr: 'افتح صمام الطرد FRC-401 إلى 3500 Nm³/h لتصريف الخامل واستعادة الإنتاجية.'
          }
        ],
        interlocks: [
          { tag: 'I-401A', conditionAr: 'ارتفاع حرارة طبقات المفاعل > 520°C', actionAr: 'فتح صمامات التبريد Quench بنسبة 100% وتنفيس الغاز', status: 'healthy' },
          { tag: 'I-401B', conditionAr: 'ارتفاع ضغط الحلقة > 265 kg/cm²', actionAr: 'فصل ضاغطة التخليق K-301 وفتح صمامات التنفيس الآمنة', status: 'healthy' }
        ],
        operatingGuide: {
          startupStepsAr: [
            '1. تدوير الغاز الخامل بالنتروجين وتسخين المفاعل R-401 عبر المسخن الابتدائي Start-up Heater.',
            '2. عند بلوغ 380°C، يتم إدخال غاز التخليق ورفع الضغط تدريجياً لـ 239 kg/cm².',
            '3. عند اشتعال تفاعل هابر (Exothermic Auto-Thermal Kick)، يتم إطفاء المسخن الابتدائي.',
            '4. ضبط صمامات التبريد Quench للحفاظ على درجات الحرارة بين 390°C و 470°C.',
            '5. تدوير منظومة التبريد K-401 لتكثيف الأمونيا وتفريغها للخزان F-401.'
          ],
          shutdownStepsAr: [
            '1. خفض تغذية غاز التخليق وتخفيف ضغط الحلقة تدريجياً.',
            '2. إبقاء تدوير الغاز لتبريد طبقات المحفز ببطء (أقل من 30°C/h).',
            '3. عزل المفاعل تحت ضغط نتروجين موجب.'
          ],
          safetyNotesAr: [
            '⚠️ تفاعل هابر طارد للحرارة بشدة؛ يجب مراقبة درجات حرارة الطبقات لمنع هروب الحرارة (Thermal Runaway).',
            '⚠️ خزان الأمونيا المبرد F-401 يجب أن يبقى دائماً عند -33.4°C وضغط موجب طفيف.'
          ]
        }
      }
    };
  }
}

export const unitOpsEngine = new UnitOpsEngine();
