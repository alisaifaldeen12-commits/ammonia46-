// Complete Data extracted verbatim from the Plant Operations Manual (ملزمة المهندس ماجد مرسي داود)
import { 
  SteamHeaderSpec, 
  SectionEquipmentSpec, 
  InterlockRule, 
  CalculationModel, 
  TroubleScenario, 
  StartupStepItem, 
  ShutdownStepItem 
} from './BookKnowledgeBase';

// ==========================================
// 1. STEAM BALANCING & HEADERS (خطوط البخار وموازنته)
// ==========================================
export const STEAM_HEADERS_DATA: SteamHeaderSpec[] = [
  {
    name: 'S65',
    type: 'Superheated High Pressure (محمص ضغط عالي)',
    temp: '435°C',
    generationSources: ['V102A (20% بطاقة)', 'V102B (غلاية الحرارة المفقودة E104 / E103B)', 'Boiler Unit (وحدة البويلر الرئيسية)'],
    consumers: ['K301 (ضاغطة الغاز المصنع)', 'K302 (ضاغطة الهواء)', 'K501 (ضاغطة ثاني أكسيد الكربون عبر PRC506 أو PRC342)'],
    controllers: ['PRC342 (تحويل إلى S39)', 'PRC506 (تحويل إلى S25)', 'PIC165 (تفريغ/طرد إلى الجو في بداية التشغيل)', 'PIC162 / 163 (Vent)'],
    ventValve: 'PIC165 / PIC162 / PIC163',
    notes: 'يتم توليد بخار S65 بعد إدخال V102A,B ورفع حرارات المفاعل الأولي بالتدريج، وتبدأ بطاقة 20% وتتزايد. في بدايه التشغيل يُطرد البخار المتولد عبر PIC165 حتى يصل الضغط 65 kg/cm² وتجف خطوط البخار.'
  },
  {
    name: 'S39',
    type: 'Superheated Medium-High Pressure (محمص)',
    temp: '375°C',
    generationSources: ['تخفيض من S65 بواسطة PRC342', 'التحويل من وحدة البويلر'],
    consumers: ['K401 (ضاغطة التبريد بالأمونيا)', 'K303 (ضاغطة الغاز الطبيعي)', 'تغذية تفاعل التهذيب مع الغاز الطبيعي (العملية الإنتاجية)', 'P101 / P711 / K101 (توربينات المضخات والمنفاخ)'],
    controllers: ['PRC342', 'TIC341 (حقن ماء التبريد للسيطرة على الحرارة)', 'PIC161 (تحويل إلى S3 أو S12)', 'PIC162-1V (Vent)'],
    ventValve: 'PIC162-1V',
    notes: 'يُستخدم كبخار تفاعل في المفاعل الأولي R101 بعد خلطه بنسبة S/G = 4.9 و S/C = 3.8.'
  },
  {
    name: 'S25',
    type: 'Superheated Intermediate Pressure (محمص)',
    temp: '240°C',
    generationSources: ['استهلاك في وحدة اليوريا ويتم تصديره من الضاغطة K501 أو تحويله بواسطة PRC506 من S65'],
    consumers: ['وحدة اليوريا (Urea Plant)', 'مراحل الضاغطة K501'],
    controllers: ['PRC506', 'PIC551'],
    ventValve: 'PIC207',
    notes: 'خط الربط والتصدير الحيوي بين قسم الأمونيا ومصنع اليوريا.'
  },
  {
    name: 'S12',
    type: 'Saturated Low-Medium Pressure (مشبع)',
    temp: '200°C',
    generationSources: ['توليد من V109 بطاقة 40% (عبر مياه التبريد لمفاعل R104 و E110)', 'تخفيض من S39'],
    consumers: ['المكثفات (Ejectors لكسر الضغط وتوليد الفاكيوم)', 'التحويل إلى خط S3'],
    controllers: ['PIC160', 'PIC164-1V', 'TIC153', 'LRC157 (مستوى V109)', 'FRQ160 (عداد التدفق)'],
    ventValve: 'PIC164-1V',
    notes: 'يتم توليده في V109 عند إدخال مفاعل التحول العالي R104 بالعمل بطاقة 40%.'
  },
  {
    name: 'S3',
    type: 'Superheated Low Pressure (محمص ضغط منخفض)',
    temp: '245°C',
    generationSources: ['تخفيض من S12 عبر PIC164-2V', 'تخفيض من S39 عبر PIC161'],
    consumers: ['Admission للضاغطة K302 لرفع طاقتها', 'نزع الأكسجين O2 المذاب في BFW في مزيل الغازات V103', 'تسخين محلول الكاتكارب في مرجل إعادة الغلي E202', 'تدفئة الخزانات (V451)', 'وحدة اليوريا نادراً بواسطة FI164'],
    controllers: ['PIC164-2V', 'PIC167 (Vent)', 'TIC154', 'PRC151'],
    ventValve: 'PIC167',
    notes: 'خط البخار الخدمي والحراري لمزيل الغازات V103 ومرجل التجريد E202.'
  }
];

// ==========================================
// 2. DETAILED SECTIONS & EQUIPMENT (الأقسام والمعدات التفصيلية)
// ==========================================
export const SECTIONS_EQUIPMENT_DATA: Record<string, SectionEquipmentSpec[]> = {
  'sec100': [
    {
      tag: 'V115 / V117',
      nameAr: 'فواصل الغاز الطبيعي الوارد (NG Knockout Drums)',
      functionAr: 'فصل السوائل والشوائب الهيدروكربونية الثقيلة الواردة مع الغاز الطبيعي من الرميلة الشمالية بضغط 40 kg/cm² وتخفيضه إلى 20 kg/cm² عبر PIC001 لحماية الضاغطة K303 والمشاعل.',
      opConditions: { pressure: '20 kg/cm² (من 40 kg/cm²)', temp: '25°C - 30°C' },
      controllers: ['PIC001', 'LC001', 'LC002'],
      valves: ['HC001', 'Vent to burn pit']
    },
    {
      tag: 'H101',
      nameAr: 'السخان الأولي للغاز الطبيعي (Primary NG Preheater)',
      functionAr: 'تسخين غاز التفاعل من 100°C إلى 385°C لتهيئته قبل الدخول إلى مفاعلات إزالة الكبريت R102A,B.',
      opConditions: { temp: '385°C خروج', pressure: '37 kg/cm²' },
      controllers: ['TIC102', 'PIC110', 'PIC112 (Pilot)', 'FRQ101', 'ZC107', 'ZC108'],
      valves: ['ZC107 (Fuel main)', 'ZC108 (Vent)', 'PIC110', 'PIC112', 'HC103 (Vent)']
    },
    {
      tag: 'R102A,B',
      nameAr: 'مفاعلات إزالة الكبريت (Desulfurizers)',
      functionAr: 'إزالة مركبات الكبريت من الغاز الطبيعي؛ الطبقة الأولى Ni-Mo تحول المركبات العضوية إلى H2S، والطبقة الثانية ZnO تمتص H2S وتخفض نسبته إلى أقل من 0.1 ppm لحماية عوامل المصلح المساعد R101 و R103 من التسمم.',
      opConditions: { temp: '385°C (الحد الأقصى 450°C لمنع تلف العامل المساعد)', pressure: '37 kg/cm²', other: 'H2S out < 0.01-0.1 ppm' },
      controllers: ['TIC102', 'FRC105', 'HC103'],
      valves: ['HC103 (طرد الغازات إلى الجو قبل إدخال R101)']
    },
    {
      tag: 'R101',
      nameAr: 'المصلح الأولي (Primary Reformer)',
      functionAr: 'تكسير الغاز الطبيعي مع بخار الماء S39 عند 750°C داخل أنابيب ممتلئة بعامل النيكل لتحويل 70% من الميثان إلى غاز مصنع (H2 + CO + CO2). يحتوي على 480 مشعل موزعة على 4 طبقات و 5 بانكات.',
      opConditions: { temp: '750°C inside, 890°C skin, 1000°C flue gas', pressure: '30 kg/cm²', dp: 'PdR104 = 2.1 - 2.6 kg/cm²', other: 'S/G=4.9, S/C=3.8, CH4 out = 9.81 mol%' },
      controllers: ['FRC105 (NG feed)', 'FRC103 (Steam S39)', 'PIC106', 'PIC115', 'PIC117', 'TR101 (1 to 5)', 'PA107LL', 'PA116LL', 'PA118LL', 'PA113HH'],
      valves: ['ZC101', 'ZC102', 'ZC103', 'ZC104', 'ZC105', 'ZC106', 'FIHC104', 'FIHC106', 'FIHC108']
    },
    {
      tag: 'R103',
      nameAr: 'المصلح الثانوي (Secondary Reformer)',
      functionAr: 'إكمال تفاعل الميثان مع الأكسجين القادم من ضاغطة الهواء K302 عند 1200°C لخفض الميثان إلى 0.33% وتوفير نسبة النيتروجين المطلوبة لتكوين الأمونيا H2/N2 = 3:1.',
      opConditions: { temp: '900°C - 1000°C out, 1200°C flame', pressure: '29 kg/cm²', dp: 'PdR105 = 2.4 kg/cm²', other: 'CH4 out = 0.33 mol%, H2/N2 = 3.0' },
      controllers: ['FRC107 (Air Flow)', 'FIHC108', 'TR101-7', 'FI110', 'TIC109'],
      valves: ['ZC101 (Air trip valve)', 'FRC107', 'FIHC109']
    },
    {
      tag: 'V103',
      nameAr: 'مزيل الغازات وتغذية المراجل (BFW Deaerator)',
      functionAr: 'طرد الأكسجين والغازات المذابة من مياه تغذية المراجل BFW بواسطة بخار S3 عند 120°C وإضافة الهيدرازين N2H4 والكيماويات لرفع pH > 7 ومنع التآكل.',
      opConditions: { temp: '120°C', pressure: '1.4 kg/cm²', other: 'pH > 7, Dissolved O2 = 0' },
      controllers: ['LIC151', 'PIC151', 'TIC203', 'LA153HH', 'LA152LL'],
      valves: ['ZC151', 'P761 feed', 'P101 suction']
    }
  ],
  'sec200': [
    {
      tag: 'R104',
      nameAr: 'مفاعل التحول لدرجات الحرارة العالية (HT Shift Converter)',
      functionAr: 'تحويل أول أكسيد الكربون CO مع بخار الماء إلى CO2 و H2 على عامل مساعد حديدي عند 365°C-400°C لخفض CO إلى 2-8 mol%.',
      opConditions: { temp: '365°C - 400°C', pressure: '27 kg/cm²', dp: 'PdR127', other: 'CO out = 2.8 mol%' },
      controllers: ['TIC107', 'PRC121', 'PIC123', 'PdR127'],
      valves: ['MV101 (Bypass)', 'PIC127 (Vent)']
    },
    {
      tag: 'R105',
      nameAr: 'مفاعل التحول لدرجات الحرارة المنخفضة (LT Shift Converter)',
      functionAr: 'إكمال تحويل ما تبقى من CO إلى CO2 و H2 على عامل مساعد نحاسي عند 200°C-220°C لخفض CO إلى 0.33 mol%.',
      opConditions: { temp: '200°C - 220°C', pressure: '26 kg/cm²', other: 'CO out = 0.33 mol%' },
      controllers: ['TIC122', 'PRC121', 'PIC121'],
      valves: ['MV102 (Bypass)', 'PIC121 (Vent)']
    },
    {
      tag: 'T201',
      nameAr: 'برج امتصاص ثاني أكسيد الكربون (CO2 Absorber)',
      functionAr: 'برج بارتفاع 28 م بحشوات Rashig Rings لامتصاص غاز CO2 من غاز التصنيع بواسطة محلول الكاتكارب (K2CO3 + 251H + 100H) عند ضغط 26 kg/cm² وحرارة 75°C-110°C.',
      opConditions: { temp: '75°C - 110°C', pressure: '26 kg/cm²', other: 'CO2 out < 0.1 mol%' },
      controllers: ['LRC201', 'FRC201 (Semi-Lean flow)', 'FRC203 (Lean flow)', 'LRC202-2V', 'PIC203'],
      valves: ['P201HT Hydraulic turbine valve', 'P201A,B discharge', 'LRC202-2V']
    },
    {
      tag: 'T202',
      nameAr: 'برج تجريد وتنشيط الكاتكارب (CO2 Stripper / Regenerator)',
      functionAr: 'تجريد غاز CO2 من محلول الكاتكارب المشبع بالغليان عبر مراجل E202 و E204 عند 120°C وضغط 0.4 kg/cm² وطرد CO2 النقي إلى وحدة اليوريا أو الجو.',
      opConditions: { temp: '120°C', pressure: '0.4 kg/cm²', other: 'Purity > 99% CO2' },
      controllers: ['PIC207 (CO2 to Urea/Vent)', 'LRA204', 'FIC204 (Steam S3 to E202)', 'TIC203', 'LIC206', 'LIC207'],
      valves: ['PIC207', 'PIC206', 'ZC201', 'P202 suction/discharge']
    },
    {
      tag: 'R106',
      nameAr: 'مفاعل الميثنة (Methanator)',
      functionAr: 'التخلص النهائي من آثار غازات CO و CO2 السامة لعامل تحفيز الأمونيا بتحويلها إلى ميثان CH4 عند 280°C-300°C وضمان خروجها بأقل من 5 ppm.',
      opConditions: { temp: '280°C - 300°C (Trip عند TA123HH = 400°C)', pressure: '26 kg/cm²', other: 'CO + CO2 < 5 ppm (أو صفر)' },
      controllers: ['TIC124', 'PIC122', 'TA123HH', 'AR123'],
      valves: ['ZC121 (Trip shutoff)', 'PRC203 (Bypass vent)']
    }
  ],
  'sec400': [
    {
      tag: 'R401',
      nameAr: 'مفاعل تصنيع الأمونيا (Ammonia Converter)',
      functionAr: 'مفاعل عالي الضغط (190 kg/cm²) يتكون من 3 طبقات عامل مساعد حديدي لتفاعل 3H2 + N2 -> 2NH3 عند 450°C. التفاعل باعث للحرارة وتتم السيطرة على حرارات الطبقات بواسطة غازات التبريد Quench Gas عبر TRC402, 403, 404.',
      opConditions: { temp: '450°C (Bed 1, 2, 3), 162°C inlet', pressure: '190 kg/cm²', dp: 'PdA405 HH = 14 kg/cm²', other: 'Exit NH3 = 18-20%' },
      controllers: ['TRC402 (Quench 1)', 'TRC403 (Quench 2)', 'TRC404 (Quench 3)', 'HC401 (Main inlet)', 'FIA404 (Flow)', 'PdA405'],
      valves: ['HC401', 'TRC402', 'TRC403', 'TRC404', 'FIC424 (Purge gas to boiler)']
    },
    {
      tag: 'H401',
      nameAr: 'سخان بدء التشغيل للمفاعل (Start-up Heater H401)',
      functionAr: 'تسخين غازات التدوير إلى 450°C لتدفئة وتنشيط طبقات مفاعل الأمونيا R401 أثناء الإقلاع ويتم عزله وإطفاؤه فور بدء التفاعل الباعث للحرارة.',
      opConditions: { temp: '450°C', other: 'Damper 45% open' },
      controllers: ['PIC406', 'PCV407', 'ZC401', 'FIA404LL (9200 m3/h)', 'TA408HH (470°C)', 'PA408LL (0.05 kg/cm2)'],
      valves: ['ZC401', 'PIC406', 'PCV407', 'Inlet/Outlet isolate valves']
    },
    {
      tag: 'V401 / V402',
      nameAr: 'فواصل سائل الأمونيا وحلقة التدوير (High & Low Pressure Catchpots)',
      functionAr: 'فصل وتكثيف سائل الأمونيا المتكون في حلقة التفاعل عند -2°C إلى 20°C وإرساله إلى خزانات الوميض V409 و V408 ومضخات P401.',
      opConditions: { temp: '-2°C إلى 20°C', pressure: '190 kg/cm² (V401) / 15-20 kg/cm² (V409)' },
      controllers: ['LIC401', 'LIC402', 'LIC408', 'LIC407', 'PIC401', 'PIC402'],
      valves: ['Niddle valves (صمامات إبرية لتخفيض الضغط)', 'LIC401', 'LIC408']
    },
    {
      tag: 'V451A,B / V454',
      nameAr: 'خزانات الأمونيا الرئيسية والمحطة (Atmospheric Storage Tanks)',
      functionAr: 'خزانات لحفظ الأمونيا السائلة عند -33°C؛ الخزان A بقطر 45 م وسعة 886 طن لكل متر ارتفاع، والخزان B بقطر 22 م وسعة 486 طن لكل متر ارتفاع، مع مضخات الشحن P451A,B وضواغط التبريد K451.',
      opConditions: { temp: '-33°C', pressure: 'Atmospheric / 0.05 kg/cm²', other: 'Tank A: 886 ton/m, Tank B: 486 ton/m' },
      controllers: ['LIC451', 'LIC452', 'FIC451 (40-60 m3/h)', 'FIC452', 'ZC451', 'ZC452', 'ZC453 ( طرد الأبخرة للجو)'],
      valves: ['ZC451', 'ZC452', 'ZC453', 'P451A,B pump manifold']
    }
  ],
  'compressors': [
    {
      tag: 'K301',
      nameAr: 'ضاغطة الغاز المصنع والتدوير (Synthesis Gas & Recycle Compressor)',
      functionAr: 'ضاغطة طرد مركزي توربينية ضخمة لرفع ضغط الغاز المصنع من 25 kg/cm² إلى 190 kg/cm² وتدوير الغاز غير المتفاعل في حلقة التفاعل R401.',
      opConditions: { speed: '10,000 - 11,200 rpm', pressure: '190 kg/cm² disch, 25 kg/cm² suction', other: '4 Stages + Recycle Stage' },
      controllers: ['PRC331 (Speed)', 'FRC331, 332, 333 (Anti-Surge)', 'HC301, 302 (Tension)', 'PA332LL (14 kg/cm2)', 'LA331-339 HH', 'TA331-335 HH (193°C)'],
      valves: ['ZC331', 'FRC331', 'FRC332', 'FRC333', 'PRC342']
    },
    {
      tag: 'K302',
      nameAr: 'ضاغطة هواء المصلح الثانوي (Process Air Compressor)',
      functionAr: 'تجهيز الهواء الجوي المضغوط إلى المصلح الثانوي R103 عند 30 kg/cm² وحرارة 500°C عبر E102 لتأمين الأكسجين والنيتروجين.',
      opConditions: { speed: '9,500 rpm', pressure: '30 kg/cm²', other: '4 Stages with Intercoolers' },
      controllers: ['FRC107', 'PRC312', 'LA318HH', 'LA312HH', 'LA314HH', 'LA316HH', 'TA311-314 HH (232°C/204°C)'],
      valves: ['ZC101', 'Anti-surge valves', 'Admission S3 valve']
    },
    {
      tag: 'K303',
      nameAr: 'ضاغطة الغاز الطبيعي (Natural Gas Compressor)',
      functionAr: 'رفع ضغط الغاز الطبيعي القادم من V115 من 20 kg/cm² إلى 39 kg/cm² لإدخاله إلى السخان H101 ومفاعلات الكبريت R102.',
      opConditions: { temp: '100°C out', pressure: '39 kg/cm² disch (من 20 kg/cm²)' },
      controllers: ['PRC301 (Speed)', 'FRC301 (Anti-Surge)', 'PA109LL (10 kg/cm2)', 'TA301HH (193°C)'],
      valves: ['ZC301 (Trip valve)', 'FRC301', 'PRC301']
    },
    {
      tag: 'K401',
      nameAr: 'ضاغطة تبريد الأمونيا (Refrigeration Compressor)',
      functionAr: 'سحب أبخرة الأمونيا المتبخرة من مبردات التخليق وتكثيفها عند 3 مراحل لتوفير التبريد لدرجات تصل إلى -33°C لفرز الأمونيا السائلة.',
      opConditions: { speed: '8,000 rpm', pressure: '3 Stages: 1st, 2nd, 3rd' },
      controllers: ['PA109LL (10 kg/cm2)', 'PA424LL', 'PA426H (20 kg/cm2)', 'TA424HH (197°C)', 'TA425HH (197°C)', 'LA424HH'],
      valves: ['ZC421', 'FRC421, 422, 423 (Anti-Surge)', 'FIC424']
    },
    {
      tag: 'K501',
      nameAr: 'ضاغطة ثاني أكسيد الكربون لليوريا (CO2 Compressor to Urea)',
      functionAr: 'ضغط غاز CO2 المنفصل من برج التجريد T202 ودفعه بـ 4 مراحل بضغط يصل إلى 150 kg/cm² إلى مصنع اليوريا.',
      opConditions: { pressure: '150 kg/cm² out (من 0.4 kg/cm²)', temp: 'Stage 1-4: max 232°C-240°C' },
      controllers: ['FRC501 (Speed)', 'PRC504', 'FRC502, 503, 504, 505 (Anti-Surge)', 'PA502LL (0 kg/cm2)', 'TA502-506 HH (232°C/240°C)', 'LA501-507 HH'],
      valves: ['FRC506', 'PRC504', 'PIC207']
    }
  ]
};

// ==========================================
// 3. MASTER INTERLOCK & SIS MATRIX (مصفوفة الأمان والربط التداخلي)
// ==========================================
export const INTERLOCK_RULES_DATA: InterlockRule[] = [
  // Primary Reformer R101 Total / Partial S/D
  {
    id: 'R101-TSD-1',
    initiator: 'S-801 A~D trip',
    setpoint: 'Trip signal from Boilers',
    actionAr: 'توقف كلي لمصنع الأمونيا وعزل كامل للمصلح R101 بسبب انقطاع بخار S65 وتوقف توربينات التدوير والمضخات.',
    type: 'Total S/D',
    valvesAffected: [
      { tag: 'ZC102', state: 'close' },
      { tag: 'ZC104', state: 'open' },
      { tag: 'PIC117', state: 'close' },
      { tag: 'PIC115', state: 'close' },
      { tag: 'PIC106', state: 'close' },
      { tag: 'ZC103', state: 'close' },
      { tag: 'ZC105', state: 'close' },
      { tag: 'PIC108', state: 'close' },
      { tag: 'PIC114', state: 'close' },
      { tag: 'FRC103', state: 'close' },
      { tag: 'FIHC104', state: 'open' },
      { tag: 'FRC105', state: 'close' },
      { tag: 'FIHC106', state: 'close' },
      { tag: 'FRC107', state: 'close' },
      { tag: 'ZC101', state: 'close' },
      { tag: 'FIHC109', state: 'open' },
      { tag: 'HC101', state: 'min' },
      { tag: 'HC102', state: 'min' }
    ]
  },
  {
    id: 'R101-TSD-2',
    initiator: 'K101 A,B trip',
    setpoint: 'Total Failure of Induced Draft Fans',
    actionAr: 'توقف ساحبات غازات الاحتراق K101A,B يؤدي إلى ارتفاع ضغط الفلغاس داخل R101 وخروج الشعلة للخارج وارتفاع حرارات الأنابيب وتلفها، فيحدث توقف كلي وفوري.',
    type: 'Total S/D',
    valvesAffected: [
      { tag: 'ZC102', state: 'close' },
      { tag: 'FRC105', state: 'close' },
      { tag: 'FRC103', state: 'close' },
      { tag: 'ZC101', state: 'close' },
      { tag: 'FIHC104', state: 'open' },
      { tag: 'FIHC109', state: 'open' }
    ]
  },
  {
    id: 'R101-TSD-3',
    initiator: 'PA322 LL',
    setpoint: '< 5 kg/cm²',
    actionAr: 'انقطاع أو نزول ضغط هواء الآلات الدقيقة Inst. Air يؤدي لخروج صمامات السيطرة عن الخدمة (AFC/AFO) واستحالة التحكم بالعمليات، فيحدث إغلاق أمان كلي.',
    type: 'Total S/D',
    valvesAffected: [
      { tag: 'ZC102', state: 'close' },
      { tag: 'FRC105', state: 'close' },
      { tag: 'FRC103', state: 'close' },
      { tag: 'ZC101', state: 'close' }
    ]
  },
  {
    id: 'R101-TSD-4',
    initiator: 'PA109 LL',
    setpoint: '< 10 kg/cm²',
    actionAr: 'نزول ضغط الغاز الطبيعي الوارد يؤدي إلى توقف ضاغطة الغاز الطبيعي K303 ونزول كمية الغاز الداخل إلى R101 مما يوجب الإغلاق الفوري.',
    type: 'Total S/D',
    valvesAffected: [
      { tag: 'ZC102', state: 'close' },
      { tag: 'FRC105', state: 'close' },
      { tag: 'ZC301', state: 'close' }
    ]
  },
  {
    id: 'R101-TSD-5',
    initiator: 'PA113 HH',
    setpoint: '> 0.0 mmH2O (انعدام الفاكيوم)',
    actionAr: 'انعدام ضغط التخلخل (Vacuum) داخل بيت النار بسبب نقص سحب K101 أو عطل الدامبر، مما يسبب خروج ألسنة اللهب إلى الأجواء.',
    type: 'Total S/D',
    valvesAffected: [
      { tag: 'ZC102', state: 'close' },
      { tag: 'FRC105', state: 'close' }
    ]
  },
  {
    id: 'R101-PSD-1',
    initiator: 'Elec. Failure (انقطاع كهرباء جزئي)',
    setpoint: 'Loss of MCC Bus',
    actionAr: 'توقف المضخات الكهربائية لبرج التبريد P711 مما يؤدي إلى توقف الضواغط ويحدث توقف جزئي للمصلح R101 مع إبقاء طبقة مشاعل واحدة 100°C لمنع تجمد وفقدان حرارة العامل المساعد.',
    type: 'Partial S/D',
    valvesAffected: [
      { tag: 'ZC102', state: 'still open' },
      { tag: 'ZC104', state: 'still close' },
      { tag: 'PIC117', state: 'close' },
      { tag: 'PIC115', state: 'close' },
      { tag: 'PIC106', state: 'still open' },
      { tag: 'ZC103', state: 'close' },
      { tag: 'ZC105', state: 'still open' },
      { tag: 'PIC108', state: 'close' },
      { tag: 'PIC114', state: 'still open' },
      { tag: 'FRC103', state: 'close' },
      { tag: 'FIHC104', state: 'open' },
      { tag: 'FRC105', state: 'close' },
      { tag: 'FIHC106', state: 'close' },
      { tag: 'FRC107', state: 'close' },
      { tag: 'ZC101', state: 'close' },
      { tag: 'FIHC109', state: 'open' },
      { tag: 'HC101', state: 'min' },
      { tag: 'HC102', state: 'min' }
    ]
  },
  {
    id: 'R101-PSD-2',
    initiator: 'FRC103 LL (نقص بخار التفاعل)',
    setpoint: '< 25 t/h',
    actionAr: 'نزول كمية بخار التفاعل S39 يؤدي إلى عدم اكتمال التفاعل ونزول نسبة S/C و S/G مما يسبب ترسب الكاربون وتكسر العامل المساعد فورياً فيعزل الغاز ويخفض R101 إلى Partial S/D.',
    type: 'Partial S/D',
    valvesAffected: [
      { tag: 'FRC105', state: 'close' },
      { tag: 'FIHC104', state: 'open' },
      { tag: 'ZC101', state: 'close' }
    ]
  },
  {
    id: 'R101-PSD-3',
    initiator: 'FRC105 LL (انقطاع غاز التفاعل)',
    setpoint: '< 6500 m3/h',
    actionAr: 'انقطاع الغاز الطبيعي التفاعلي يؤدي إلى ارتفاع شديد بالحرارة بسبب بقاء البخار فقط وقلة كفاءة R101 ويسبب تلف العامل المساعد في R103.',
    type: 'Partial S/D',
    valvesAffected: [
      { tag: 'FRC105', state: 'close' },
      { tag: 'ZC101', state: 'close' },
      { tag: 'FIHC109', state: 'open' }
    ]
  },

  // Heater H101 Interlocks
  {
    id: 'H101-TRIP-1',
    initiator: 'FRQ101 LL (نقص تدفق غاز التفاعل في الأنابيب)',
    setpoint: '< 4700 m3/h',
    actionAr: 'نزول كمية الغاز الداخل يؤدي إلى ارتفاع حرارة أنابيب السخان H101 وتلفها وانفجارها فيتم إغلاق صمامات وقود المشاعل فورياً.',
    type: 'Trip',
    valvesAffected: [
      { tag: 'PIC110', state: 'close' },
      { tag: 'PIC112', state: 'close' },
      { tag: 'ZC107', state: 'close' },
      { tag: 'ZC108', state: 'open' },
      { tag: 'HC103', state: 'open' }
    ]
  },
  {
    id: 'H101-TRIP-2',
    initiator: 'TA105 HH (ارتفاع حرارة خروج الغاز الطبيعي)',
    setpoint: '> 420°C',
    actionAr: 'ارتفاع حرارة خروج الغاز الطبيعي فوق 420°C (التشغيلي 385°C) يسبب تفحم وتلف أنابيب H101 وعامل ZnO في R102 فيتم إطفاء السخان تلقائياً.',
    type: 'Trip',
    valvesAffected: [
      { tag: 'PIC110', state: 'close' },
      { tag: 'PIC112', state: 'close' },
      { tag: 'ZC107', state: 'close' },
      { tag: 'ZC108', state: 'open' }
    ]
  },

  // Methanator R106 Trip
  {
    id: 'R106-TRIP-1',
    initiator: 'TA123 HH (ارتفاع حرارة الميثنيتر العنيف)',
    setpoint: '> 400°C',
    actionAr: 'عبور تراكيز عالية من CO/CO2 من قسم الكاتكارب يسبب تفاعل ميثنة طارد بشدة للحرارة (Runaway Reaction) ووصول الحرارة إلى 400°C، مما يوجب عزل المفاعل فوراً عبر ZC121 وتنفيس الغاز عبر PRC203 وتوقيف K301 لحماية العامل المساعد.',
    type: 'Trip',
    valvesAffected: [
      { tag: 'ZC121', state: 'close' },
      { tag: 'PRC203', state: 'open' },
      { tag: 'K301', state: 'close' }
    ]
  },

  // Compressor K301 Interlocks
  {
    id: 'K301-TRIP-1',
    initiator: 'PA332 LL (ضغط سحب الغاز المصنع)',
    setpoint: '< 14 kg/cm²',
    actionAr: 'نزول ضغط السحب عن 14 kg/cm² يسبب دخول الضاغطة K301 في ظاهرة الرفرفة العنيفة (Surge) مما يؤدي لتدمير المحامل وتلف التوربين، فيحدث Trip فوري.',
    type: 'Trip',
    valvesAffected: [
      { tag: 'ZC331', state: 'close' },
      { tag: 'FRC331', state: 'open' },
      { tag: 'FRC332', state: 'open' },
      { tag: 'FRC333', state: 'open' },
      { tag: 'PRC342', state: 'open' }
    ]
  },
  {
    id: 'K301-TRIP-2',
    initiator: 'PdA405 HH (فرق ضغط مفاعل الأمونيا R401)',
    setpoint: '> 14 kg/cm²',
    actionAr: 'انسداد أو ترسب أو تكسر في طبقات العامل المساعد لمفاعل الأمونيا R401 يؤدي لارتفاع فرق الضغط وإجهاد ضاغطة التدوير K301 فتنطفئ فوراً.',
    type: 'Trip',
    valvesAffected: [
      { tag: 'ZC331', state: 'close' },
      { tag: 'FRC331', state: 'open' }
    ]
  },
  {
    id: 'K301-TRIP-3',
    initiator: 'LA331, 334, 338, 339 HH (مستويات فواصل المراحل)',
    setpoint: 'High High Level in V301, V302, V303, V304',
    actionAr: 'ارتفاع مستوى السائل في فواصل مراحل ضاغطة الغاز المصنع يهدد بدخول قطرات السائل إلى دوارات الضاغطة وتكسير الشفرات، مما يطلق رحلة طوارئ فورية.',
    type: 'Trip',
    valvesAffected: [
      { tag: 'ZC331', state: 'close' }
    ]
  },

  // Compressor K303 Interlocks
  {
    id: 'K303-TRIP-1',
    initiator: 'TA301 HH (حرارة تصريف الغاز الطبيعي)',
    setpoint: '> 193°C',
    actionAr: 'ارتفاع حرارة تفريغ K303 عن 193°C يسبب تمدد الدوارات وتلف موانع التسرب الزيتية Seal Oil.',
    type: 'Trip',
    valvesAffected: [
      { tag: 'ZC301', state: 'close' },
      { tag: 'FRC301', state: 'open' }
    ]
  },

  // Compressor K501 Interlocks
  {
    id: 'K501-TRIP-1',
    initiator: 'PA502 LL (ضغط سحب ثاني أكسيد الكربون)',
    setpoint: '< 0.0 kg/cm²',
    actionAr: 'نزول ضغط سحب K501 إلى ما دون الصفر (تخلخل) يسبب شفط الهواء الجوي واختلاطه بـ CO2 وتكوين مزيج خطر، ويؤدي إلى اهتزاز الضاغطة ورحلتها.',
    type: 'Trip',
    valvesAffected: [
      { tag: 'FRC506', state: 'close' },
      { tag: 'PRC504', state: 'open' },
      { tag: 'PIC207', state: 'open' }
    ]
  }
];

// ==========================================
// 4. PLANT CALCULATION MODELS (حسابات المصنع الرياضية والكيميائية من الملزمة)
// ==========================================
export const CALCULATION_MODELS_DATA: CalculationModel[] = [
  // 1. حساب الطاقة والتدفق الفعلي (Load % & FRQ101 Actual Flow)
  {
    id: 'calc-load-frq101',
    titleAr: 'حساب طاقة المصنع وتدفق الغاز الطبيعي الفعلي (Load % & FRQ101 Actual)',
    descriptionAr: 'حساب النسبة المئوية لطاقة تشغيل المصنع بناءً على كمية غاز التغذية الفعلية المصححة للضغط والحرارة والوزن الجزيئي مقارنة بالحمولة التصميمية (100% Load = 26563.8 m³/h).',
    formulaTex: 'FRQ101_{100\\%Load} = 21900 \\times \\frac{1.4}{[C]} \\\\ FRQ101_{act} = FRQ101_{read} \\times \\sqrt{\\frac{PT119 + 1.03}{14.23}} \\times \\frac{303}{TR001 + 273} \\times \\frac{22.4}{M.wt} \\\\ Load\\% = \\frac{FRQ101_{act}}{FRQ101_{100\\%Load}} \\times 100',
    parameters: [
      { key: 'frqRead', nameAr: 'قراءة عداد الغاز FRQ101 غير المصححة', defaultVal: 16000, unit: 'm³/h', min: 2000, max: 35000 },
      { key: 'pt119', nameAr: 'ضغط الغاز في العداد PT119', defaultVal: 18.0, unit: 'kg/cm²', min: 5, max: 30 },
      { key: 'tr001', nameAr: 'حرارة الغاز في العداد TR001', defaultVal: 30.0, unit: '°C', min: 5, max: 60 },
      { key: 'mwt', nameAr: 'الوزن الجزيئي لخليط الغاز M.wt', defaultVal: 19.0, unit: 'g/mol', min: 16, max: 25 },
      { key: 'nCarbon', nameAr: 'عدد ذرات الكاربون في المكونات [C]', defaultVal: 1.155, unit: 'mol C', min: 1.0, max: 1.5 }
    ],
    calculate: (inputs) => {
      const { frqRead, pt119, tr001, mwt, nCarbon } = inputs;
      const frq100Load = (21900 * 1.4) / nCarbon;
      const pCorrection = Math.sqrt((pt119 + 1.03) / 14.23);
      const tCorrection = 303 / (tr001 + 273);
      const mwtCorrection = 22.4 / mwt;
      const frqAct = frqRead * pCorrection * tCorrection * mwtCorrection;
      const loadPercent = (frqAct / frq100Load) * 100;

      return {
        result: parseFloat(loadPercent.toFixed(1)),
        unit: '%',
        steps: [
          `حساب حمولة 100% للمصنع: FRQ101(100% Load) = (21900 × 1.4) / ${nCarbon} = ${frq100Load.toFixed(1)} m³/h`,
          `معامل تصحيح الضغط: √(${pt119} + 1.03) / 14.23 = ${pCorrection.toFixed(4)}`,
          `معامل تصحيح الحرارة: 303 / (${tr001} + 273) = ${tCorrection.toFixed(4)}`,
          `معامل تصحيح الوزن الجزيئي: 22.4 / ${mwt} = ${mwtCorrection.toFixed(4)}`,
          `التدفق الفعلي المصحح FRQ101 Act = ${frqRead} × ${pCorrection.toFixed(3)} × ${tCorrection.toFixed(3)} × ${mwtCorrection.toFixed(3)} = ${frqAct.toFixed(1)} m³/h`,
          `نسبة طاقة التشغيل Load% = (${frqAct.toFixed(1)} / ${frq100Load.toFixed(1)}) × 100 = ${loadPercent.toFixed(1)} %`
        ],
        statusNote: loadPercent < 50 ? 'تحذير: طاقة منخفضة جداً (حالة إقلاع أو خفض حمولة طارئ)' : (loadPercent > 105 ? 'إنذار: تجاوز الطاقة التصميمية القصوى للمصلح!' : 'ضمن النطاق التشغيلي الطبيعي (Normal Operation)')
      };
    }
  },

  // 2. حساب نسبة البخار إلى الغاز S/G في المصلح الأولي
  {
    id: 'calc-sg-ratio',
    titleAr: 'حساب نسبة البخار إلى الغاز (Steam to Gas Ratio - S/G)',
    descriptionAr: 'حساب نسبة البخار إلى الغاز الداخلة إلى المصلح الأولي R101 لضمان عدم ترسب الكاربون على العامل المساعد. القيمة التصميمية هي 4.9.',
    formulaTex: 'S/G = \\frac{FRC103}{FRC105} \\times 1245 \\\\ \\text{where } 1245 = \\frac{t}{h} \\times 1000\\frac{kg}{t} \\times \\frac{1}{18\\frac{kg}{kmol}} \\times 22.4\\frac{m^3}{kmol}',
    parameters: [
      { key: 'frc103', nameAr: 'تدفق بخار التفاعل FRC103 (S39)', defaultVal: 78.0, unit: 't/h', min: 10, max: 150 },
      { key: 'frc105', nameAr: 'تدفق غاز التفاعل FRC105 (NG)', defaultVal: 17500, unit: 'm³/h', min: 3000, max: 30000 }
    ],
    calculate: (inputs) => {
      const { frc103, frc105 } = inputs;
      const ratio = (frc103 / frc105) * 1245;

      return {
        result: parseFloat(ratio.toFixed(2)),
        unit: 'mol/mol',
        steps: [
          `معامل التحويل الحجمي للبخار = (1000 kg / 18 kg/kmol) × 22.4 m³/kmol = 1245`,
          `نسبة البخار إلى الغاز S/G = (${frc103} / ${frc105}) × 1245 = ${ratio.toFixed(2)}`,
          `النسبة التصميمية المرجعية (Design) = 4.9`
        ],
        statusNote: ratio < 4.0 ? 'خطر حرج: انخفاض S/G عن 4.0 يسبب ترسب الكاربون وتكسر وتسمم العامل المساعد في R101!' : (ratio > 5.5 ? 'ملاحظة: استهلاك زائد للبخار وطاقة إضافية على المرجل E108' : 'النسبة ممتازة ومطابقة للمحددات الهندسية')
      };
    }
  },

  // 3. حساب نسبة البخار إلى الكاربون S/C في المصلح الأولي
  {
    id: 'calc-sc-ratio',
    titleAr: 'حساب نسبة البخار إلى الكاربون (Steam to Carbon Ratio - S/C)',
    descriptionAr: 'حساب نسبة جزيئات بخار الماء إلى ذرات الكاربون الكلية في الغاز الطبيعي الداخل. القيمة التصميمية هي 3.8.',
    formulaTex: 'S/C = \\frac{FRC103}{FRQ101} \\times \\frac{1245}{[C]} \\\\ [C] = \\sum (n_i \\times x_i)',
    parameters: [
      { key: 'frc103', nameAr: 'تدفق بخار التفاعل FRC103', defaultVal: 78.0, unit: 't/h', min: 10, max: 150 },
      { key: 'frq101', nameAr: 'تدفق الغاز الطبيعي الكلي FRQ101', defaultVal: 17500, unit: 'm³/h', min: 3000, max: 30000 },
      { key: 'cFactor', nameAr: 'معامل الكاربون في الغاز [C]', defaultVal: 1.183, unit: 'mol C/mol gas', min: 1.0, max: 1.6 }
    ],
    calculate: (inputs) => {
      const { frc103, frq101, cFactor } = inputs;
      const ratio = (frc103 / (frq101 * cFactor)) * 1245;

      return {
        result: parseFloat(ratio.toFixed(2)),
        unit: 'mol steam / mol C',
        steps: [
          `معامل الكاربون الفعلي [C] = ${cFactor}`,
          `معامل البخار = 1245`,
          `نسبة البخار إلى الكاربون S/C = (${frc103} / (${frq101} × ${cFactor})) × 1245 = ${ratio.toFixed(2)}`,
          `النسبة التصميمية المعتمدة (Design S/C) = 3.8`
        ],
        statusNote: ratio < 3.2 ? 'تحذير شديد: خطر داهم لتفحم الأنابيب (Coking) وظهور بقع ساخنة Hot Spots على أنابيب المصلح!' : 'النسبة آمنة تماماً وتحمي العامل المساعد'
      };
    }
  },

  // 4. حساب إنتاج الأمونيا وطاقة قسم التخليق (Ammonia Production Rate)
  {
    id: 'calc-nh3-production',
    titleAr: 'حساب معدل إنتاج الأمونيا وطاقة القسم الرابع (NH3 Production & Sec 400 Load)',
    descriptionAr: 'حساب كمية الأمونيا السائلة المنتجة في الساعة بناءً على كمية الغاز المصنع النقي الداخل مطروحاً منه غازات التطهير (Purge) والغازات المطرودة (Vent) مقسوماً على الثابت التصميمي 2635.',
    formulaTex: 'Production (t/h) = \\frac{FR127_{act} - (FIC424 + FR402)}{2635} \\\\ Load\\% = \\frac{FR127_{act}}{127000} \\times 100',
    parameters: [
      { key: 'fr127', nameAr: 'تدفق الغاز المصنع إلى قسم التخليق FR127', defaultVal: 93000, unit: 'm³/h', min: 20000, max: 150000 },
      { key: 'fic424', nameAr: 'غاز التطهير إلى البويلر FIC424 (Purge Gas)', defaultVal: 7300, unit: 'm³/h', min: 500, max: 20000 },
      { key: 'fr402', nameAr: 'غاز التنفيس FR402 (Vent Gas)', defaultVal: 550, unit: 'm³/h', min: 0, max: 5000 }
    ],
    calculate: (inputs) => {
      const { fr127, fic424, fr402 } = inputs;
      const netGas = fr127 - (fic424 + fr402);
      const production = netGas / 2635;
      const load400 = (fr127 / 127000) * 100;

      return {
        result: parseFloat(production.toFixed(1)),
        unit: 't/h (طن أمونيا / ساعة)',
        steps: [
          `صافي الغاز المتفاعل في الحلقة = ${fr127} - (${fic424} + ${fr402}) = ${netGas} m³/h`,
          `معدل إنتاج الأمونيا السائلة = ${netGas} / 2635 = ${production.toFixed(1)} t/h`,
          `الإنتاج اليومي المتوقع = ${production.toFixed(1)} × 24 = ${(production * 24).toFixed(0)} طن/يوم`,
          `نسبة طاقة قسم التخليق (Sec 400 Load%) = (${fr127} / 127000) × 100 = ${load400.toFixed(1)} %`
        ],
        statusNote: `الإنتاج يغذي خزانات V451 ووحدة اليوريا بمعدل ${production.toFixed(1)} طن/ساعة.`
      };
    }
  },

  // 5. حساب كمية النيتروجين المطلوبة لإنتاج طن أمونيا
  {
    id: 'calc-n2-per-ton-nh3',
    titleAr: 'حساب استهلاك النيتروجين لإنتاج الأمونيا (N2 Requirement per Ton NH3)',
    descriptionAr: 'حساب الحجم القياسي لغاز النيتروجين N2 المطلوب نظرياً وعملياً لإنتاج واحد طن من الأمونيا النقية عبر التفاعل N2 + 3H2 -> 2NH3.',
    formulaTex: 'N_2 + 3H_2 \\rightleftharpoons 2NH_3 \\\\ N_2 (m^3/ton) = \\frac{1000 kg NH_3}{34 kg NH_3} \\times 22.4 = 658.8 m^3 / ton NH_3',
    parameters: [
      { key: 'nh3Tons', nameAr: 'كمية الأمونيا المستهدفة', defaultVal: 1000, unit: 'ton', min: 1, max: 5000 }
    ],
    calculate: (inputs) => {
      const { nh3Tons } = inputs;
      const n2PerTon = 658.8;
      const totalN2 = nh3Tons * n2PerTon;

      return {
        result: parseFloat(totalN2.toFixed(0)),
        unit: 'm³ N2',
        steps: [
          `الوزن الجزيئي للتفاعل: 28 kg N2 + 6 kg H2 -> 34 kg NH3`,
          `حجم النيتروجين لإنتاج 1 طن أمونيا = (1000 / 34) × 22.4 = 658.8 m³/ton`,
          `إجمالي النيتروجين المطلوب لإنتاج ${nh3Tons} طن = ${nh3Tons} × 658.8 = ${totalN2.toFixed(0)} m³`
        ],
        statusNote: 'يتم تأمين هذا النيتروجين عبر سحب الهواء الجوي بواسطة ضاغطة الهواء K302 وحرقه في R103.'
      };
    }
  },

  // 6. حساب الأمونيا اللازمة لإنتاج اليوريا (NH3 Requirement for Urea Production)
  {
    id: 'calc-nh3-for-urea',
    titleAr: 'حساب كمية الأمونيا اللازمة لإنتاج اليوريا (NH3 for Urea)',
    descriptionAr: 'حساب كمية الأمونيا السائلة المرسلة عبر المضخات P401 / P451 إلى وحدة اليوريا لإنتاج كمية محددة من سماد اليوريا (Design: 1600 ton Urea يتطلب 906.66 ton NH3).',
    formulaTex: '2NH_3 + CO_2 \\rightarrow CO(NH_2)_2 + H_2 O \\\\ NH_3 (ton) = \\frac{34}{60} \\times Urea (ton) = 0.5667 \\times Urea (ton)',
    parameters: [
      { key: 'ureaProduction', nameAr: 'إنتاج اليوريا المطلوب', defaultVal: 1600, unit: 'ton Urea', min: 100, max: 3000 }
    ],
    calculate: (inputs) => {
      const { ureaProduction } = inputs;
      const nh3Required = (34 / 60) * ureaProduction;

      return {
        result: parseFloat(nh3Required.toFixed(2)),
        unit: 'ton NH3',
        steps: [
          `المعادلة: 34 طن أمونيا + 44 طن CO2 -> 60 طن يوريا + 18 طن ماء`,
          `نسبة الاستهلاك = 34 / 60 = 0.56667 طن أمونيا لكل طن يوريا`,
          `الأمونيا المطلوبة لـ ${ureaProduction} طن يوريا = (${ureaProduction} × 34) / 60 = ${nh3Required.toFixed(2)} طن أمونيا`,
          `المعدل الساعي المطلوب ضخه من P401 = ${(nh3Required / 24).toFixed(1)} t/h`
        ],
        statusNote: 'يتم تأمين الأمونيا مباشرة من فاصل الضغط المنخفض V409 أو سحبها من الخزانات V451 عبر P451A,B.'
      };
    }
  },

  // 7. حساب إضافة كربونات البوتاسيوم لمحلول الكاتكارب (K2CO3 Addition)
  {
    id: 'calc-k2co3-addition',
    titleAr: 'حساب كمية كربونات البوتاسيوم المطلوبة لتعديل تركيز الكاتكارب (K2CO3 Addition)',
    descriptionAr: 'حساب وزن كربونات البوتاسيوم الصلبة (K2CO3) الواجب إضافتها لرفع التركيز الكلي لمحلول الكاتكارب في المنظومة (الحجم الكلي 300 m³) إلى التركيز المستهدف.',
    formulaTex: 'Weight (kg) = \\text{Total Volume } (m^3) \\times \\frac{M.wt_{K_2 CO_3}}{2} \\times (N_T - N_{op}) \\\\ = 300 \\times \\frac{138.2}{2} \\times (N_{target} - N_{current})',
    parameters: [
      { key: 'targetN', nameAr: 'العيارية المستهدفة Target Normality (NT)', defaultVal: 4.5, unit: 'N', min: 3.0, max: 6.0 },
      { key: 'currentN', nameAr: 'العيارية الحالية للمحلول Current Normality (Nop)', defaultVal: 3.5, unit: 'N', min: 2.0, max: 5.0 },
      { key: 'systemVol', nameAr: 'الحجم الكلي لمحلول الكاتكارب في القسم', defaultVal: 300, unit: 'm³', min: 100, max: 500 }
    ],
    calculate: (inputs) => {
      const { targetN, currentN, systemVol } = inputs;
      const deltaN = Math.max(0, targetN - currentN);
      const weightKg = systemVol * (138.2 / 2) * deltaN;
      const weightTon = weightKg / 1000;

      return {
        result: parseFloat(weightTon.toFixed(2)),
        unit: 'ton K2CO3',
        steps: [
          `فرق العيارية المطلوب تعويضه ΔN = ${targetN} - ${currentN} = ${deltaN.toFixed(2)} N`,
          `الوزن المكافئ لكربونات البوتاسيوم = 138.2 / 2 = 69.1 g/eq`,
          `الوزن بالكيلوغرام = ${systemVol} m³ × 69.1 × ${deltaN.toFixed(2)} = ${weightKg.toFixed(0)} kg`,
          `الوزن بالطن = ${weightTon.toFixed(2)} طن K2CO3 صلبة تُذاب وتُحقن عبر حوض التحضير V205 ومضخة P204.`
        ],
        statusNote: deltaN === 0 ? 'تركيز المحلول ممتاز ومطابق للمواصفة القياسية المختبرية.' : `يجب إضافة ${weightTon.toFixed(2)} طن كربونات بوتاسيوم لرفع كفاءة امتصاص CO2 في البرج T201.`
      };
    }
  },

  // 8. حساب إضافة مانع التآكل والمنشط (251-H and 100-H Additions)
  {
    id: 'calc-additives-drums',
    titleAr: 'حساب عدد براميل المنشط 251-H ومانع التآكل 100-H (Catacarb Additives)',
    descriptionAr: 'حساب عدد البراميل (سعة البرميل 200 لتر = 0.2 m³) المطلوبة من المادة المنشطة 251-H (تركيز 85% DEA/MEA) ومانع التآكل 100-H (أكسيد الفناديوم V2O5 تركيز 15%) لتعديل محتوى المحلول.',
    formulaTex: 'V_{req} = 300 m^3 \\times (\\%_{target} - \\%_{actual}) \\\\ \\text{Drums}_{251-H} = \\frac{V_{req}}{0.2 \\times 0.85} \\\\ \\text{Drums}_{100-H} = \\frac{V_{req}}{0.2}',
    parameters: [
      { key: 'act251', nameAr: 'النسبة الحالية للمنشط 251-H في المحلول', defaultVal: 8.9, unit: '% vol', min: 5, max: 20 },
      { key: 'tgt251', nameAr: 'النسبة المستهدفة للمنشط 251-H', defaultVal: 11.0, unit: '% vol', min: 8, max: 15 },
      { key: 'act100', nameAr: 'النسبة الحالية لمانع التآكل 100-H', defaultVal: 4.3, unit: '% wt', min: 2, max: 7 },
      { key: 'tgt100', nameAr: 'النسبة المستهدفة لمانع التآكل 100-H', defaultVal: 5.0, unit: '% wt', min: 4, max: 6 }
    ],
    calculate: (inputs) => {
      const { act251, tgt251, act100, tgt100 } = inputs;
      const v251 = 300 * ((tgt251 - act251) / 100);
      const drums251 = Math.max(0, v251 / (0.2 * 0.85));
      const v100 = 300 * ((tgt100 - act100) / 100);
      const drums100 = Math.max(0, (v100 - (drums251 * 0.2 * 0.15)) / 0.2);

      return {
        result: Math.ceil(drums251),
        unit: 'برميل 251-H',
        steps: [
          `حجم المنشط 251-H النقي المطلوب = 300 × (${(tgt251 - act251) / 100}) = ${v251.toFixed(2)} m³`,
          `عدد براميل 251-H (تركيز 85%) = ${v251.toFixed(2)} / (0.2 × 0.85) = ${drums251.toFixed(1)} برميل (≈ ${Math.ceil(drums251)} برميل)`,
          `حجم مانع التآكل 100-H الإضافي المطلوب = ${v100.toFixed(2)} m³`,
          `صافي عدد براميل 100-H بعد خصم محتوى الفناديوم في براميل 251-H = ${Math.max(0, Math.ceil(drums100))} برميل`
        ],
        statusNote: 'تضاف البراميل تدريجياً عبر مضخة P204 مع مراقبة رغوة المحلول وحقن مانع الرغوة WBU عند اللزوم.'
      };
    }
  },

  // 9. موازنة البخار الشاملة (Steam Balance per Manual Sec 6)
  {
    id: 'calc-steam-balance',
    titleAr: 'الموازنة الشاملة للبخار (Plant Steam Balance)',
    descriptionAr: 'موازنة توليد واستهلاك وتصدير كافة أنواع البخار الأربعة (S65, S39, S25, S3) مع رصد الفواقد بدقة طبقاً للجداول الواردة في الفصل السادس من الملزمة.',
    formulaTex: '\\text{Boiler Generation } (3 \\times 110 = 330 t/h) - \\text{Internal } (44 t/h) = 286 t/h \\\\ \\text{Total S65 Supply } = 286 + 110 (V102A,B) = 396 t/h \\\\ \\text{Total S65 Consumption } = K301 (255) + K501 (106) + K302 (32) = 393 t/h \\\\ \\text{S65 Steam Loss } = 396 - 393 = 3 t/h',
    parameters: [
      { key: 'boilerGen', nameAr: 'توليد البويلرات الكلي (3 Boilers)', defaultVal: 330, unit: 't/h', min: 100, max: 400 },
      { key: 'boilerInternal', nameAr: 'استهلاك البويلر الداخلي (V804+K801+G951+P801)', defaultVal: 44, unit: 't/h', min: 20, max: 60 },
      { key: 'v102Gen', nameAr: 'توليد مراجل الأمونيا V102A,B (FRQ154)', defaultVal: 110, unit: 't/h', min: 20, max: 150 },
      { key: 'k301Cons', nameAr: 'استهلاك ضاغطة الغاز المصنع K301 (FR341)', defaultVal: 255, unit: 't/h', min: 100, max: 300 },
      { key: 'k501Cons', nameAr: 'استهلاك ضاغطة ثاني أكسيد الكربون K501 (FRQ507)', defaultVal: 106, unit: 't/h', min: 40, max: 140 },
      { key: 'k302Cons', nameAr: 'استهلاك ضاغطة الهواء K302 (FR312)', defaultVal: 32, unit: 't/h', min: 10, max: 50 }
    ],
    calculate: (inputs) => {
      const { boilerGen, boilerInternal, v102Gen, k301Cons, k501Cons, k302Cons } = inputs;
      const netFromBoiler = boilerGen - boilerInternal; // 286
      const totalS65Supply = netFromBoiler + v102Gen; // 396
      const totalS65Cons = k301Cons + k501Cons + k302Cons; // 393
      const lossS65 = totalS65Supply - totalS65Cons; // 3 t/h

      return {
        result: parseFloat(lossS65.toFixed(1)),
        unit: 't/h فاقد S65',
        steps: [
          `صافي البخار الوارد من البويلر FRQ159 = ${boilerGen} - ${boilerInternal} = ${netFromBoiler} t/h`,
          `إجمالي بخار S65 المتاح = ${netFromBoiler} + ${v102Gen} = ${totalS65Supply} t/h`,
          `إجمالي استهلاك الضواغط S65 = ${k301Cons} (K301) + ${k501Cons} (K501) + ${k302Cons} (K302) = ${totalS65Cons} t/h`,
          `فرق الفواقد والتكثيف في شبكة S65 = ${totalS65Supply} - ${totalS65Cons} = ${lossS65.toFixed(1)} t/h`,
          `استهلاك S39 (K401=31, R101=77, K303=6, P711=11, P101=7, P102=10, K101=2.7...) = 154.7 t/h`,
          `كمية البخار المحول عبر صمام التخفيض PIC161 (من S39 إلى S3) = 180 - 154.7 = 25.3 t/h`,
          `استهلاك شبكة S3 الكلي = 48.3 t/h (وفاقد شبكة S3 = 51.5 - 48.3 = 3.2 t/h)`
        ],
        statusNote: 'موازنة البخار متطابقة ومستقرة تماماً بين كافة الأقسام التوربينية والتفاعلية.'
      };
    }
  },

  // 10. حساب سعة وتخزين خزانات الأمونيا V451 A & B
  {
    id: 'calc-storage-tank',
    titleAr: 'حساب خزن وسعة خزانات الأمونيا V451 A & B (Storage Tanks Capacity)',
    descriptionAr: 'حساب مخزون الأمونيا السائلة بالطن بناءً على قراءة المنسوب بالمتر للخزان A (قطر 45 م، 886 طن/م) والخزان B (قطر 22 م، 486 طن/م).',
    formulaTex: '\\text{Tank A (ton)} = \\text{Level}_A (m) \\times 886 \\\\ \\text{Tank B (ton)} = \\text{Level}_B (m) \\times 486',
    parameters: [
      { key: 'levelA', nameAr: 'ارتفاع سائل الأمونيا في الخزان A', defaultVal: 18.5, unit: 'm', min: 0, max: 30 },
      { key: 'levelB', nameAr: 'ارتفاع سائل الأمونيا في الخزان B', defaultVal: 12.0, unit: 'm', min: 0, max: 25 }
    ],
    calculate: (inputs) => {
      const { levelA, levelB } = inputs;
      const tonA = levelA * 886;
      const tonB = levelB * 486;
      const totalTons = tonA + tonB;

      return {
        result: parseFloat(totalTons.toFixed(1)),
        unit: 'طن أمونيا مخزونة',
        steps: [
          `مخزون الخزان A الرئيسي (قطر 45م) = ${levelA} m × 886 ton/m = ${tonA.toFixed(1)} طن`,
          `مخزون الخزان B الاحتياطي (قطر 22م) = ${levelB} m × 486 ton/m = ${tonB.toFixed(1)} طن`,
          `إجمالي الأمونيا المخزونة في المجمع = ${totalTons.toFixed(1)} طن`,
          `الأيام التشغيلية المتبقية للتصدير بمعدل إنتاج 1000 طن/يوم = ${(totalTons / 1000).toFixed(1)} يوم`
        ],
        statusNote: levelA > 26 ? 'تحذير: الخزان A قارب الامتلاء! يجب تشغيل مضخات الشحن P451A,B لقطارات وسيارات نقل الأمونيا.' : 'المنسوب آمن ومضخات التدوير والتبريد K451 تعمل بانتظام.'
      };
    }
  }
];

// ==========================================
// 5. TROUBLESHOOTING SCENARIOS (الفصل الرابع: مشاكل وحلول مصنع الأمونيا)
// ==========================================
export const TROUBLESHOOTING_DATA: TroubleScenario[] = [
  {
    id: 'trb-k401-trip',
    titleAr: 'توقف مفاجئ لضاغطة التبريد K401 (Refrigeration Compressor Trip)',
    causeAr: 'إشارة إنذار كاذبة أو اهتزاز وازاحة محورية في المحور (Shaft displacement excess) أو ضغط زر التوقف اليدوي في اللوحة الحقلية (Manual Stop on Local Panel).',
    indicatorsAr: [
      'نزول سريع في مستوى فاصل الأمونيا V408 إلى الصفر',
      'توقف K401 وتوقف E412 بالكامل',
      'بقاء ZC421 مفتوحاً إذا لم يُغلق بالأمان مما يؤدي إلى عبور الأمونيا غير المسالة عبر مسيطرات التبريد TIC421, 422, 423',
      'نزول الفاكيوم في K303',
      'ارتفاع ضغط مرحلة الغازات المدورة في K301',
      'ارتفاع حرارة الغازات الداخلة إلى E405 و E406 بسبب غلق LIC427',
      'ارتفاع الضغط في خزان الأمونيا V451 بسبب ارتفاع حرارة الأمونيا السائلة المرسلة',
      'نزول إنتاج البخار من مرجل WHB بسبب تخفيض طاقة القسم الرابع (E402)'
    ],
    effectsAr: [
      'تراكم الغازات غير المكثفة',
      'توقف تبريد حلقة التفاعل R401 وخطر ارتفاع حرارات الطبقات',
      'احتمال اضطرار المصنع لخفض الحمولة إلى 45%'
    ],
    ccrActionsAr: [
      'فتح مسيطرات التبريد كلياً: FRC421, FRC422, FRC423 إلى 100%',
      'فتح مسيطرات الكزارة يدوياً: TIC421, TIC422, TIC423',
      'فتح صمامات LIC422 و LIC423 مع ملاحظة ارتفاع مستوى الأمونيا في V407 و V406',
      'السيطرة على حرارة R401 بواسطة مسيطرات الكزارة TRC402, 403, 404 بعد تحويلها إلى Manual',
      'تخفيض طاقة القسم الرابع بتخفيض حمل K301 إلى MGS',
      'تهيئة سخان H401 كإجراء احتياطي للسيطرة على الحرارة',
      'إعادة تشغيل الضاغطة K401 فور إزالة سبب التوقف'
    ],
    fieldActionsAr: [
      'فتح خط vent على suction الضاغطة K401',
      'فتح صمام min flow لمضخة P401 للسيطرة على مستوى V405',
      'عزل وتجاوز FRQ425 بفتح الـ ByPass',
      'عزل بخار S39 عن الضاغطة وغلق الصمامات الرئيسية M.S.V و Main B.V',
      'المحافظة على الفاكيوم بتشغيل طلمبة سريعة عند الحاجة',
      'مراقبة ضغط وزيت التزيين Lube Oil والمانع Seal Oil',
      'عزل B.V للمرحلة الثالثة ومراقبة مستوى المكثف E711 وبخار المنع Sealing Steam'
    ],
    valvesState: {
      'FRC421': '100% Open',
      'FRC422': '100% Open',
      'FRC423': '100% Open',
      'TRC402': 'Manual Control',
      'TRC403': 'Manual Control',
      'TRC404': 'Manual Control',
      'K301_Load': 'Reduced to MGS'
    }
  },
  {
    id: 'trb-h101-sudden-sd',
    titleAr: 'توقف مفاجئ لسخان الغاز الطبيعي H101 (H101 Suddenly S/D)',
    causeAr: 'هبوط تدفق غاز التفاعل FRQ101 < 4700 m3/h أو ارتفاع حرارة المخرج TA105 > 420°C أو نزول ضغط الغاز PA111 LL < 0.07 kg/cm2.',
    indicatorsAr: [
      'انغلاق فوري لصمامات الوقود ZC107 و PIC110 و PIC112',
      'انفتاح صمام التنفيس ZC108 إلى الشعلة',
      'انخفاض تدريجي في حرارة الغاز الداخل إلى مزيلات الكبريت R102A,B والمصلح R101',
      'خطر ترسب الكاربون على العامل المساعد في R101 عند انخفاض الحرارة'
    ],
    effectsAr: [
      'انخفاض كفاءة إزالة الكبريت وخطر تسمم عامل النيكل في R101 و R103',
      'انخفاض حرارة التفاعل وارتفاع نسبة الميثان غير المتفاعل'
    ],
    ccrActionsAr: [
      'عزل PIC110 من السيطرة والإسراع بعزل صمامات المشاعل والتأكد من غلق ZC107 وفتح ZC108',
      'مراقبة حرارة مفاعل R101 وتنزيل الطاقة إذا انخفضت الحرارة لتلافي تكون الكاربون',
      'عزل ZC108 وفتح ZC107 وعمل Reset على PIC112 و PIC110',
      'فتح PIC110 بنسبة 2% وفتح صمام مشاعل الإشعال الثانوي (Pilot) وإشعالها تدريجياً ثم إشعال المشاعل الكبيرة واحدة تلو الأخرى',
      'إذا استمر التوقف لفترة طويلة يتم عمل Partial S/D لمفاعل R101'
    ],
    fieldActionsAr: [
      'فحص مشاعل السخان H101 حقلياً والتأكد من عدم وجود تسريب غاز',
      'تجهيز مشعل الشرارة اليدوي لإعادة إشعال الشعلات التجريبية فور سماح غرفة السيطرة',
      'مراقبة ضغط هواء الاحتراق والفاكيوم في مدخنة السخان'
    ],
    valvesState: {
      'ZC107': 'Closed',
      'ZC108': 'Open (Vent)',
      'PIC110': '0%',
      'PIC112': 'Closed'
    }
  },
  {
    id: 'trb-zc121-close',
    titleAr: 'غلق صمام أمان الميثنيتر ZC121 (Trip on R106 Methanator)',
    causeAr: 'ارتفاع حرارة المفاعل TA123HH > 400°C أو انقطاع كهربائي أو اختلال تركيز CO/CO2 القادم من برج الكاتكارب.',
    indicatorsAr: [
      'نزول سريع ومفاجئ في تدفق غاز التصنيع FR127',
      'نزول تدفق الغازات في مراحل ضاغطة الغاز المصنع K301 (FRC331, 332, 333)',
      'صعود مفاجئ في الضغوط العكسية: PRC121 و PRC203 وفتح صمام PIC127',
      'نزول سريع في ضغوط تفريغ الكاتكارب PIC206 و PIC207 ودخول الضاغطة K501 في Surge',
      'ظهور إشارة إنذار Methanator S/D على لوحة التحكم المركزية'
    ],
    effectsAr: [
      'انقطاع الغاز المصنع عن ضاغطة K301 وحلقة الأمونيا بالكامل',
      'اضطراب شديد في موازنة بخار S65 و S39'
    ],
    ccrActionsAr: [
      'إيقاف الضاغطة K301 فوراً وتحويل بخار S39 إلى PRC342 لمنع ارتفاع ضغط البخار',
      'عدم إيقاف الضاغطة K501 بالقسم الثاني',
      'إطفاء عدد من مشاعل السخان المساعد Aux لمنع ارتفاع ضغط وحرارة بخار S65',
      'تنزيل طاقة المصنع فورياً مع مراعاة طاقة وحدة اليوريا',
      'تنزيل طاقة ضاغطة التبريد K401',
      'سحب الأمونيا من وحدة اليوريا وتصريفها عبر خزان V451',
      'إعادة التشغيل بعد معرفة وإزالة سبب رحلة الميثنيتر'
    ],
    fieldActionsAr: [
      'التحقق من حرارات طبقات المفاعل R106 حقلياً',
      'التأكد من سلامة صمام التنفيس PRC203 وعدم انحباس الضغط',
      'أخذ عينات تحليلات مختبرية فورية لنسب CO و CO2 قبل التفكير في فتح ZC121 ثانية'
    ],
    valvesState: {
      'ZC121': 'Tripped Closed',
      'PRC203': 'Fully Open',
      'K301': 'Stopped (Trip)',
      'PRC342': 'Open to balance S39'
    }
  },
  {
    id: 'trb-foam-catacarb',
    titleAr: 'تكون الرغوة في قسم الكاتكارب (Foaming in CO2 Removal System)',
    causeAr: 'تلوث محلول الكاتكارب بالزيوت أو الشحوم أو الشوائب الصلبة أو زيادة تدفق الغاز أو نقص مانع التآكل والمنشط.',
    indicatorsAr: [
      'نزول سريع في منسوب سائل الكاتكارب في قاع البرج T202',
      'ارتفاع حاد في فرق الضغط PdR عبر طبقات الحشوات في البرج T201',
      'غلق صمام تصدير ثاني أكسيد الكربون PIC207 بسبب قلة تدفق CO2 ونزول جريان الغاز إلى ضاغطة K501 ودخولها في Surge'
    ],
    effectsAr: [
      'فقدان كفاءة امتصاص CO2 وعبوره إلى الميثنيتر R106 مما يسبب ارتفاع حرارته المفرط وتوقفه',
      'انخفاض كمية CO2 المرسلة إلى مصنع اليوريا وتوقف الإنتاج'
    ],
    ccrActionsAr: [
      'زيادة شوط مضخة حقن مانع الرغوة P205 (Stroke Increase) وحقن مادة WBU بتركيز 5 ppm إلى V206',
      'زيادة تدفق ماء التبريد FIC205 وصعود مؤقت لـ FIC204 لرفع منسوب T202',
      'إضافة وتغذية المحلول المركز (K2CO3 + 251-H) عن طريق P204',
      'تقليل تدفق الغاز FRC201 وتقليل طاقة الضاغطة K501 وفتح PIC207 لتلافي دخول الضاغطة في Surge',
      'إضافة 3-2 براميل من WBU مباشرة إلى V207 ومراقبة تدوير المحلول'
    ],
    fieldActionsAr: [
      'تشغيل فلتر الكاربون النشط F201 لامتصاص الزيوت والشحوم والشوائب من المحلول بمعدل 40 m³/h',
      'أخذ عينات مختبرية لفحص زمن الرغوة Foaming Time (يجب ألا يتجاوز ثوانٍ معدودة)',
      'فحص مضخات تدوير الكاتكارب P201A,B و P202 والتأكد من عدم حدوث تكهف Cavitation'
    ],
    valvesState: {
      'P205_Stroke': 'Increased to Max',
      'WBU_Injection': 'Active (5 ppm)',
      'F201_Filter': 'In Service (40 m3/h)',
      'K501_Load': 'Reduced'
    }
  },
  {
    id: 'trb-bfw-p761-trip',
    titleAr: 'توقف مضخات مياه تغذية المراجل P761 (BFW Pump Trip)',
    causeAr: 'انقطاع كهربائي في محطة البويلر أو هبوط ضغط السحب أو عطل ميكانيكي في التوربين.',
    indicatorsAr: [
      'نزول سريع في منسوب مزيل الغازات V103',
      'ارتفاع حرارة محلول الكاتكارب الخارج من E204 إلى 100°C وملاحظة غلق صمام TIC203 مما يهدد بنضوح المحلول في P202 بسبب سخونة المحلول',
      'ارتفاع ضغط V103',
      'انخفاض تغذية مياه المراجل V102A,B وخطر جفاف أنابيب توليد البخار'
    ],
    effectsAr: [
      'انقطاع مياه التغذية عن مراجل التوليد S65 و S12',
      'توقف كلي وشيك للمصنع إذا لم يتم تدارك المنسوب خلال دقائق معدودة'
    ],
    ccrActionsAr: [
      'تنزيل طاقة المصنع سريعاً لتلافي التوقف الكلي، وإيقاف وحدة اليوريا فوراً',
      'تقليل سرعة وتدفق P101 إلى الحد الأدنى',
      'إذا لم تتم السيطرة على مستويات V102A,B و V103 يتم عمل Total S/D فورياً لحماية الأنابيب من الاحتراق'
    ],
    fieldActionsAr: [
      'تشغيل مضخة BFW الاحتياطية فوراً وإعادة رفع الضغط إلى 14 kg/cm²',
      'مراقبة منسوب ماء المراجل في زجاجات الرؤية الموقعية لـ V102A,B و V109',
      'تأمين مياه التغذية الطارئة من وحدة البويلر المجاورة'
    ],
    valvesState: {
      'Plant_Load': 'Emergency Ramp Down',
      'Urea_Supply': 'Isolated',
      'P761_Standby': 'Started'
    }
  }
];

// ==========================================
// 6. DETAILED STARTUP PROCEDURES (الفصل الثاني: تشغيل وحدة الأمونيا خطوة بخطوة)
// ==========================================
export const STARTUP_PROCEDURES_DATA: StartupStepItem[] = [
  {
    stepNum: 1,
    stageNameAr: 'تجهيز ماء الطوارئ WE والمكثفات',
    descAr: 'تجهيز ماء الطوارئ WE لوحدة البويلر أولاً، والتأكد من عدم وجود أوساخ في البرج، وتشغيل إحدى المضخات الكهربائية P711 وضخ ماء WE بضغط 4 kg/cm² عبر غسل وتدوير الخطوط WC/WCR إلى وحدة اليوريا وتعبئة المكثف E711.',
    checksAr: ['ضغط ماء WE = 4 kg/cm²', 'مستوى المكثف E711 = 60%', 'خلو منظومة الأنابيب من التكلسات والأوساخ'],
    controllersAction: [
      { tag: 'P711', action: 'Start Electric Pump' },
      { tag: 'E711', action: 'Fill with BFW Startup line to 60%' }
    ],
    cautionAr: 'يجب غسل خطوط ماء التبريد وتدويرها لتفادي انتقال الصدأ والأوساخ إلى مبادلات الحرارة الحساسة E205A,B و E112.'
  },
  {
    stepNum: 2,
    stageNameAr: 'ربط خطوط البخار وتدفئة الشبكة (Steam Header Warm-up)',
    descAr: 'إبلاغ وحدة البويلر بالجاهزية، وفتح جميع درينات خطوط البخار S65, S39, S12, S3 لتلافي ظاهرة الطرق المائي (Hammering). فتح صمام البخار S65 جزئياً مع فتح المسيطرات PRC342 (إلى S39) و PIC164-1V (إلى S12) و PIC161 (إلى S3) وفتح صمامات التنفيس PIC162 و PIC163.',
    checksAr: ['تصريف كافة المتكثفات من الدرينات', 'صعود ضغط S65 تدريجياً', 'رفع حرارات الخطوط ببطء'],
    controllersAction: [
      { tag: 'PRC342', action: 'Set to Auto / modulate to S39' },
      { tag: 'PIC164-1V', action: 'Modulate to S12' },
      { tag: 'PIC161', action: 'Modulate to S3' },
      { tag: 'PIC165', action: 'Open for Line Blowing & Warm-up' }
    ],
    cautionAr: 'حذار من إدخال البخار بسرعة؛ الطرق المائي قد يؤدي لتمزق فلانجات الأنابيب وتلف الصمامات.'
  },
  {
    stepNum: 3,
    stageNameAr: 'تشغيل ضاغطة الهواء K302 لتجهيز هواء الآلات',
    descAr: 'تشغيل ضاغطة الهواء K302 لتجهيز هواء الآلات الدقيقة Inst. Air للمصنع ولوحدة البويلر ورفع الضغط لضمان جاهزية أنظمة التحكم الهوائي والصمامات.',
    checksAr: ['ضغط Inst. Air > 5.5 kg/cm²', 'استقرار سرعة K302'],
    controllersAction: [
      { tag: 'K302', action: 'Start Turbine & modulate speed' },
      { tag: 'PRC312', action: 'Auto' }
    ]
  },
  {
    stepNum: 4,
    stageNameAr: 'تدوير النيتروجين N2 وتدفئة المصلح R101 والسخان H101',
    descAr: 'تعبئة وتدوير النيتروجين N2 بواسطة الضاغطة K102 في المصلح الأولي R101 ومفاعلات التحول R104 و R105 بمعدل 21,000 m³/h عبر FI031 وطرد الأكسجين O2 حتى يصبح أقل من 10 ppm. إشعال شعلات الإشعال Pilot في H101 و R101 ورفع الحرارة بمعدل 30°C/h.',
    checksAr: ['O2 in loop < 10 ppm', 'معدل رفع الحرارة = 30°C/h', 'مراقبة تمدد أنابيب R101 عبر TR101-1..5'],
    controllersAction: [
      { tag: 'FI031', action: 'Maintain 21,000 m3/h N2 circulation' },
      { tag: 'PIC106', action: 'Maintain 0.3 - 0.5 kg/cm2 fuel pressure' },
      { tag: 'H101_Pilot', action: 'Ignite & stabilize at 385°C' }
    ],
    cautionAr: 'يجب ألا تتجاوز حرارة غلاف الأنابيب Skin Temp في R101 حد 850°C مع مراقبة ألوان الأنابيب (أحمر قاتم منتظم دون بقع سوداء أو بيضاء).'
  },
  {
    stepNum: 5,
    stageNameAr: 'إدخال بخار التفاعل واستبدال النيتروجين بالبخار',
    descAr: 'عند وصول حرارة غازات الاحتراق Flue gas إلى 500°C وحرارة طبقات R101 إلى 400°C، يتم استبدال N2 بالبخار S39 بإدخال 35 t/h إلى E101 عبر FIHC104 و 7 t/h إلى E102 عبر FIHC109 والسيطرة على الضغط عند 4-5 kg/cm² عبر PIC123.',
    checksAr: ['Flue gas temp = 500°C', 'R101 Bed temp = 400°C', 'Steam flow = 35 t/h (FIHC104) + 7 t/h (FIHC109)'],
    controllersAction: [
      { tag: 'FIHC104', action: 'Open to feed 35 t/h steam' },
      { tag: 'FIHC109', action: 'Open to feed 7 t/h steam' },
      { tag: 'PIC123', action: 'Modulate to 4-5 kg/cm2' }
    ]
  },
  {
    stepNum: 6,
    stageNameAr: 'إدخال الغاز الطبيعي التفاعلي وبدء تفاعل التهذيب',
    descAr: 'عند وصول حرارة الأنابيب إلى 650°C-700°C، يتم فتح صمام FRC105 وإدخال الغاز الطبيعي بمعدل 5000 m³/h وعزل صمام التنفيس HC103. إشعال مشاعل إضافية لتعويض برودة التفاعل الماص للحرارة، وضبط S/G = 4.9 ورفع طاقة R101 تدريجياً إلى 40% ثم ربط مراجل V102A,B بشبكة S65.',
    checksAr: ['R101 Tube temp = 700°C', 'FRC105 = 5000 m³/h', 'S/G = 4.9', 'V102A,B pressure reached 38 kg/cm²'],
    controllersAction: [
      { tag: 'FRC105', action: 'Ramp to 5000 m3/h' },
      { tag: 'HC103', action: 'Close to process' },
      { tag: 'PRC342', action: 'Open when S65 reaches 38 kg/cm2' },
      { tag: 'PIC165', action: 'Gradually close' }
    ]
  },
  {
    stepNum: 7,
    stageNameAr: 'إدخال الهواء إلى المصلح الثانوي R103',
    descAr: 'عند طاقة 40%، يتم فتح صمام FRC107 وإدخال هواء التفاعل من K302 بمعدل 500 m³/h (FI110). مراقبة اشتعال المشعل الداخلي وارتفاع حرارة R103 فورياً إلى 600°C ثم 900°C، ثم رفع تدفق الهواء وتثبيت نسبة H2/N2 = 3:1.',
    checksAr: ['TR101-7 indicates flame ignition (600°C -> 900°C)', 'Air preheat temp in E102 = 500°C', 'H2/N2 ratio = 3.0'],
    controllersAction: [
      { tag: 'FRC107', action: 'Open to feed air from K302' },
      { tag: 'FIHC109', action: 'Adjust steam to maintain air mix' }
    ]
  },
  {
    stepNum: 8,
    stageNameAr: 'إدخال مفاعلات التحول R104 و R105 وقسم الكاتكارب',
    descAr: 'إدخال R104 وفتح مرجل V109 لتوليد بخار S12 (40% load)، ثم تدفئة وإدخال R105 عبر MV102 عند 200°C. تشغيل مضخات تدوير الكاتكارب P201A,B وضخ المحلول المنشط في البرج T201 وفتح مراجل إعادة الغلي E202 و E204 لتجريد CO2 في T202.',
    checksAr: ['V109 generating S12', 'CO out R104 = 2.8 mol%', 'CO out R105 = 0.33 mol%', 'Catacarb circulation = 200-350 m3/h'],
    controllersAction: [
      { tag: 'PRC121', action: 'Auto' },
      { tag: 'FRC201', action: 'Ramp Semi-Lean to 200 m3/h' },
      { tag: 'FRC203', action: 'Ramp Lean to 80 m3/h' },
      { tag: 'FIC204', action: 'Feed 6 t/h steam S3 to E202' }
    ]
  },
  {
    stepNum: 9,
    stageNameAr: 'إدخال الميثنيتر R106 وتدفئة حلقة التخليق R401',
    descAr: 'تدفئة R106 إلى 280°C عبر TIC124، ثم فتح ZC121 والتأكد من خروج CO+CO2 < 5 ppm. تشغيل ضاغطة التدوير والغاز المصنع K301 ورفع السرعة إلى 7000 rpm وإشعال سخان بدء التشغيل H401 لتدفئة طبقات مفاعل الأمونيا R401 إلى 450°C.',
    checksAr: ['R106 outlet CO+CO2 < 5 ppm', 'K301 speed = 7000 rpm', 'H401 outlet temp = 450°C'],
    controllersAction: [
      { tag: 'ZC121', action: 'Open' },
      { tag: 'PRC203', action: 'Close vent' },
      { tag: 'K301', action: 'Start and ramp to 7000 rpm' },
      { tag: 'H401', action: 'Start & fire to heat R401 beds' }
    ]
  },
  {
    stepNum: 10,
    stageNameAr: 'بدء تفاعل تصنيع الأمونيا وإنتاج السائل وتعبئة الخزانات',
    descAr: 'عند 450°C يبدأ تفاعل تصنيع الأمونيا الباعث للحرارة؛ يتم عزل وإطفاء سخان H401 والسيطرة على حرارة الطبقات بواسطة كزارات التبريد TRC402, 403, 404. تشغيل ضاغطة التبريد K401، ويبدأ سائل الأمونيا بالتجمع في الفواصل V401, V402, V409 وضخه عبر P401 إلى خزان V451 ومصنع اليوريا.',
    checksAr: ['R401 Bed ΔT active (Exothermic reaction)', 'H401 shut down and isolated', 'K401 online with 3 chilling stages', 'Liquid NH3 flowing to V451 at -33°C'],
    controllersAction: [
      { tag: 'H401', action: 'Extinguish burners & isolate bypass' },
      { tag: 'TRC402', action: 'Auto (Quench 1)' },
      { tag: 'TRC403', action: 'Auto (Quench 2)' },
      { tag: 'TRC404', action: 'Auto (Quench 3)' },
      { tag: 'K401', action: 'Online with full refrigeration' },
      { tag: 'P401', action: 'Start product pump to V451 & Urea' }
    ],
    cautionAr: 'مراقبة الضغوط في V451 وتثبيت الـ Purge Gas عبر FIC424 لحماية الحلقة من تراكم غازات الميثان والآرغون غير المتفاعلة.'
  }
];

// ==========================================
// 7. DETAILED SHUTDOWN PROCEDURES (الفصل الثالث: إيقاف وحدة الأمونيا)
// ==========================================
export const SHUTDOWN_PROCEDURES_DATA: ShutdownStepItem[] = [
  {
    stepNum: 1,
    stageNameAr: 'تخفيض طاقة المصنع الاعتيادي (Normal S/D Ramp Down)',
    type: 'Normal S/D',
    descAr: 'تخفيض طاقة المصنع بالتدريج إلى 50% طبقاً لجدول تقليل الأحمال: تخفيض FRC107 (الهواء) و FRC105 (الغاز) و FRC103 (البخار) وتخفيض ضغوط مشاعل R101 (PIC106, 115, 117) مع مراقبة مستوى مراجل V102A,B.',
    valvesSequence: [
      { tag: 'FRC107', state: 'Reduce step-by-step' },
      { tag: 'FRC105', state: 'Reduce step-by-step' },
      { tag: 'FRC103', state: 'Reduce to maintain S/G=4.9' },
      { tag: 'PIC106', state: 'Lower fuel pressure' },
      { tag: 'PIC115', state: 'Lower fuel pressure' },
      { tag: 'PIC117', state: 'Lower fuel pressure' }
    ],
    cautionAr: 'يجب خفض الغاز والبخار بنسب متزامنة للحفاظ على S/C فوق 3.8 ومنع تفحم الأنابيب.'
  },
  {
    stepNum: 2,
    stageNameAr: 'إيقاف ضاغطة الغاز المصنع K301 وعزل القسم الرابع',
    type: 'Normal S/D',
    descAr: 'إبلاغ البويلر، وتقليل سرعة K301 عبر PRC331 وفتح صمامات الرفرفة FRC331, 332, 333 وفتح صمام تجاوز التوربين وبخار S39 عبر PRC342، ثم عزل غاز Purge gas عن البويلر بفتح PIC403، ونقل الأمونيا المتبقية إلى الخزان V451 ثم إيقاف P401 و K401.',
    valvesSequence: [
      { tag: 'PRC331', state: 'Reduce to minimum speed' },
      { tag: 'FRC331', state: 'Open 100%' },
      { tag: 'FRC332', state: 'Open 100%' },
      { tag: 'FRC333', state: 'Open 100%' },
      { tag: 'PRC342', state: 'Open to Askania/Hard manual' },
      { tag: 'PIC403', state: 'Open vent' },
      { tag: 'LIC401', state: 'Close' },
      { tag: 'LIC408', state: 'Close' },
      { tag: 'P401', state: 'Stop after draining catchpots' }
    ]
  },
  {
    stepNum: 3,
    stageNameAr: 'عزل الميثنيتر R106 وضاغطة K501',
    type: 'Normal S/D',
    descAr: 'تحويل التنفيس من PRC203 إلى PIC122، وغلق صمام أمان الميثنيتر ZC121 وعزل صمامات الدخول والخروج وطرد الغازات بإدخال النيتروجين N2. إيقاف ضاغطة K501 بفتح صمامات الرفرفة FRC502..505 وغلق FRC506 وفتح PRC504 وتخفيض S25.',
    valvesSequence: [
      { tag: 'ZC121', state: 'Close' },
      { tag: 'PRC203', state: 'Vent' },
      { tag: 'FRC506', state: 'Close' },
      { tag: 'PRC504', state: 'Open to vent' },
      { tag: 'FRC502..505', state: 'Open 100%' }
    ]
  },
  {
    stepNum: 4,
    stageNameAr: 'عزل قسم إزالة الكربون (T201 & T202)',
    type: 'Normal S/D',
    descAr: 'تنزيل طاقة القسم إلى 40%، تحويل تنفيس الغاز من PRC121 إلى PRC203 Vent والاحتفاظ بضغط 20 kg/cm² لتركيز المحلول وتدويره عبر P201 و P202 مع إبقاء بخار S3 على مرجل E202 لمدة 2-4 ساعات، ثم تفريغ المحلول إلى خزان الحفظ V205 وإيقاف المضخات.',
    valvesSequence: [
      { tag: 'PRC203', state: 'Open vent' },
      { tag: 'FIC204', state: 'Maintain S3 on E202 for 2-4 hrs' },
      { tag: 'P204', state: 'Transfer solution to V205' },
      { tag: 'P201A,B', state: 'Stop when level depleted' },
      { tag: 'P202', state: 'Stop after draining T202' }
    ]
  },
  {
    stepNum: 5,
    stageNameAr: 'عزل المصلح الثانوي R103 و R104 و R105 والمصلح الأولي R101',
    type: 'Normal S/D',
    descAr: 'عزل هواء K302 عن R103 بفتح FIHC109 وغلق ZC101، وعزل R104 و R105 بفتح خطوط التجاوز، ثم عزل غاز التفاعل FRC105 كلياً عن R101، وإطفاء مشاعل الطبقات 4 و 3 و 2 و 1 بالتدريج، وخفض كمية البخار إلى 30 t/h للحفاظ على حرارة 400°C لمدة ساعتين، ثم إدخال N2 للتبريد وتدويره عبر K102 وتفريغ مراجل V102 و V109.',
    valvesSequence: [
      { tag: 'ZC101', state: 'Close' },
      { tag: 'FRC107', state: 'Close' },
      { tag: 'FRC105', state: 'Close 100%' },
      { tag: 'PIC117', state: 'Close' },
      { tag: 'PIC115', state: 'Close' },
      { tag: 'PIC106', state: 'Close' },
      { tag: 'FIHC104', state: 'Maintain 30 t/h steam cooling' },
      { tag: 'N2_Purge', state: 'Feed N2 via K102 for cooling' }
    ],
    cautionAr: 'يمنع تبريد مفاعل R101 بصورة سريعة لتلافي تشقق وانكماش بطانة الطابوق الحراري وتلف الأنابيب.'
  }
];
