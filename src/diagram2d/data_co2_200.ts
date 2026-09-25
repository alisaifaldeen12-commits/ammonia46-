/**
 * data_co2_200.ts
 * Process Flow Diagram Data for CO2 Removal Section (Catacarb System)
 * Blueprint: DWG NO. 6112P 100-200-00
 * Project: IRAQ NO. 3 PROJECT / M.O.I. IRAQ - FERTILIZER PROJECT, KHOR AL-ZUBAIR PHASE-1
 * AMMONIA UNIT - CO2 REMOVAL SECTION
 */

import { PFDStreamData, PFDEquipment, PFDSheetInfo } from './types';

export const SHEET_CO2_200_INFO: PFDSheetInfo = {
  id: 'co2_200',
  dwgNo: 'DWG NO. 6112P 100-200-00',
  title: 'AMMONIA UNIT - CO2 REMOVAL SECTION (CATACARB)',
  titleAr: 'قسم إزالة غاز ثاني أكسيد الكربون (نظام كاتاكارب البوتاسيوم المنشط)',
  orderNo: '563030-012',
  date: '7 JAN \'76',
  customer: 'M.O.I. IRAQ - FERTILIZER PROJECT KHOR AL-ZUBAIR PHASE-1',
  filters: [
    { id: 'all', label: 'All Plant', labelAr: 'المخطط الكامل' },
    { id: 'absorber', label: 'T-201 Absorber', labelAr: 'برج الامتصاص T-201' },
    { id: 'regenerator', label: 'T-202 Stripper', labelAr: 'برج التجريد T-202' },
    { id: 'reboilers', label: 'Reboilers E-201/202', labelAr: 'أجهزة إعادة الغليان' },
    { id: 'degasser', label: 'V-209 Degassing', labelAr: 'تجريد المكثفات V-209' }
  ]
};

export const STREAMS_CO2_200: Record<number, PFDStreamData> = {
  1: {
    id: 1,
    name: "CONVERTED GAS (FROM GAS REFORM SECTION)",
    nameAr: "غاز التحويل القادم من قسم الإصلاح والتحويل (خروج LTS)",
    pressure: "28.9",
    temperature: "185",
    flowKgH: "165,200 (Wet) / 107,100 (Dry)",
    dryGasMolH: "6,974.88",
    wetGasMolH: "10,205.06",
    h2oMolH: "3,230.18",
    dryGasTh: "107.100",
    wetGasTh: "165.200",
    dryMw: "15.36",
    wetMw: "16.21",
    comp: {
      co: "0.33 % (23.03 mol/h)",
      co2: "19.01 % (1,325.77 mol/h)",
      h2: "60.38 % (4,211.39 mol/h)",
      n2: "19.69 % (1,373.36 mol/h)",
      ar: "0.32 % (22.19 mol/h)",
      ch4: "0.27 % (19.14 mol/h)"
    }
  },
  2: {
    id: 2,
    name: "INLET ABSORBER T-201",
    nameAr: "مدخل الغاز إلى أسفل برج الامتصاص T-201",
    pressure: "28.2",
    temperature: "127",
    flowKgH: "119,300 (Wet) / 107,100 (Dry)",
    dryGasMolH: "6,974.88",
    wetGasMolH: "7,652.83",
    h2oMolH: "677.95",
    dryGasTh: "107.100",
    wetGasTh: "119.300",
    dryMw: "15.36",
    wetMw: "15.59",
    comp: {
      co: "0.33 % (23.03 mol/h)",
      co2: "19.01 % (1,325.77 mol/h)",
      h2: "60.38 % (4,211.39 mol/h)",
      n2: "19.69 % (1,373.36 mol/h)",
      ar: "0.32 % (22.19 mol/h)",
      ch4: "0.27 % (19.14 mol/h)"
    }
  },
  3: {
    id: 3,
    name: "EXIT ABSORBER (TO GAS REFORM / METHANATOR)",
    nameAr: "مخرج قمة برج الامتصاص T-201 (غاز التخليق الخالي من CO2)",
    pressure: "28.0",
    temperature: "80",
    flowKgH: "50,680 (Wet) / 48,910 (Dry)",
    dryGasMolH: "5,634.51",
    wetGasMolH: "5,733.51",
    h2oMolH: "99.00",
    dryGasTh: "48.910",
    wetGasTh: "50.680",
    dryMw: "8.68",
    wetMw: "8.84",
    comp: {
      co: "0.41 % (22.95 mol/h)",
      co2: "0.10 % (5.63 mol/h ~ 1000 ppm)",
      h2: "74.48 % (4,196.39 mol/h)",
      n2: "24.29 % (1,369.47 mol/h)",
      ar: "0.39 % (22.10 mol/h)",
      ch4: "0.33 % (18.97 mol/h)"
    }
  },
  4: {
    id: 4,
    name: "ACID GAS EXIT REGENERATOR T-202",
    nameAr: "غاز ثاني أكسيد الكربون الحامضي الرطب من قمة برج التجريد T-202",
    pressure: "1.46",
    temperature: "97",
    flowKgH: "98,770 (Wet) / 58,270 (Dry)",
    dryGasMolH: "1,340.25",
    wetGasMolH: "3,584.70",
    h2oMolH: "2,244.45",
    dryGasTh: "58.270",
    wetGasTh: "98.770",
    dryMw: "43.48",
    wetMw: "27.55",
    comp: {
      co: "0.01 % (0.08 mol/h)",
      co2: "98.50 % (1,320.14 mol/h)",
      h2: "1.12 % (14.97 mol/h)",
      n2: "0.36 % (4.89 mol/h)",
      ar: "0.01 % (0.08 mol/h)",
      ch4: "0.01 % (0.17 mol/h)"
    }
  },
  5: {
    id: 5,
    name: "ACID GAS TO UREA UNIT / ATM",
    nameAr: "غاز ثاني أكسيد الكربون النقي إلى مصنع اليوريا أو الجو",
    pressure: "1.24",
    temperature: "50",
    flowKgH: "61,000 MAX (61.0 t/h) / 58,270 (Dry)",
    dryGasMolH: "1,340.25",
    wetGasMolH: "1,491.58",
    h2oMolH: "151.33",
    dryGasTh: "58.270",
    wetGasTh: "61.000",
    dryMw: "43.48",
    wetMw: "40.89",
    comp: {
      co: "0.01 % (0.08 mol/h)",
      co2: "98.50 % (1,320.14 mol/h - نقاوة عالية)",
      h2: "1.12 % (14.97 mol/h)",
      n2: "0.36 % (4.89 mol/h)",
      ar: "0.01 % (0.08 mol/h)",
      ch4: "0.01 % (0.17 mol/h)"
    }
  }
};

export const EQUIPMENT_CO2_200: Record<string, PFDEquipment> = {
  "T-201": {
    tag: "T-201",
    name: "CO2 ABSORBER",
    nameAr: "برج امتصاص ثاني أكسيد الكربون (كاتاكارب)",
    pressIn: "28.2 kg/cm²A (Bottom) / 36.0 kg/cm²A (Top Liquid)",
    pressOut: "28.0 kg/cm²A (Top Gas) / 13.11 kg/cm²A (Rich Sol'n)",
    tempIn: "127°C (Gas) / 80°C (Lean) / 105°C (Semi-Lean)",
    tempOut: "80°C (Gas) / 112°C (Rich Sol'n)",
    descAr: "برج امتصاص عملاق ذو حشوات متعددة (Multi-Bed Packed Column) يعمل بنظام التدفق المجزأ (Split-Flow System). يدخل غاز التحويل من الأسفل ويلتقي بمحلول شبه نقي (Semi-Lean) في الوسط، ثم محلول نقي بارد (Lean 80°C) في القمة لتخفيض نسبة CO₂ من 19.01% إلى 0.10% (1000 ppm).",
    x: 1250,
    y: 120,
    w: 120,
    h: 460
  },
  "V-204": {
    tag: "V-204",
    name: "ABSORBER KO DRUM",
    nameAr: "وعاء فصل قطرات المحلول من قمة برج الامتصاص",
    deltaP: "ΔP = 0.03 kg/cm²",
    pressOut: "28.0 kg/cm²A",
    tempOut: "80°C",
    descAr: "وعاء فاصل مثبت في قمة برج الامتصاص لحجز أي قطرات متطايرة من محلول كاتاكارب وضمان خروج غاز تخليق نقي إلى قسم الإصلاح (مسخن الميثانايتر E-107).",
    x: 1280,
    y: 40,
    w: 60,
    h: 50
  },
  "P-201HT": {
    tag: "P-201 HT",
    name: "HYDRAULIC TURBINE",
    nameAr: "التوربين الهيدروليكي لاسترجاع الطاقة الحركية",
    tempIn: "112°C",
    pressIn: "13.11 kg/cm²A",
    descAr: "توربين هيدروليكي يستغل فرق الضغط العالي لمحلول كاتاكارب الغني الخارج من أسفل T-201 لتوليد طاقة ميكانيكية وإدارة مضخة المحلول شبه النقي P-201 A,B مباشرة لتوفير الطاقة الكهربائية.",
    x: 940,
    y: 520,
    w: 70,
    h: 60
  },
  "P-201": {
    tag: "P-201 A, B",
    name: "SEMI-LEAN SOLUTION PUMP",
    nameAr: "مضخات تدوير المحلول شبه النقي",
    tempIn: "114°C",
    pressOut: "8.55 kg/cm²A",
    descAr: "مضخات طرد مركزي رئيسية تسحب المحلول شبه النقي من الصينية المتوسطة لبرج التجريد T-202 وتدفعه بمعدل 855 m³/h عبر المبرد E-207 إلى المنطقة الوسطى من برج الامتصاص T-201.",
    x: 1020,
    y: 520,
    w: 80,
    h: 60
  },
  "E-207": {
    tag: "E-207",
    name: "SEMI-LEAN SOL'N COOLER",
    nameAr: "مبرد المحلول شبه النقي بمياه التبريد",
    duty: "6.94 × 10⁶ kcal/h",
    deltaP: "ΔP_S = 0.30 kg/cm²",
    tempIn: "114°C",
    tempOut: "105°C",
    descAr: "مبادل حراري لتبريد المحلول شبه النقي من 114°C إلى 105°C باستخدام مياه التبريد الصناعية (CW) لتحسين كفاءة امتصاص ثاني أكسيد الكربون في البرج T-201.",
    x: 1030,
    y: 290,
    w: 70,
    h: 40
  },
  "T-202": {
    tag: "T-202",
    name: "CO2 REGENERATOR",
    nameAr: "برج تجريد وإعادة تنشيط محلول كاتاكارب (Stripper)",
    tempIn: "112°C (Rich) / 50°C (Reflux)",
    tempOut: "97°C (Acid Gas) / 120°C (Lean Sol'n) / 114°C (Semi-Lean)",
    pressIn: "1.46 kg/cm²A (Top)",
    descAr: "برج تجريد راسي كبير متعدد الحشوات (Beds 1-4) يعمل عند ضغط منخفض (1.46 kg/cm²A). يتم فيه طرد غاز CO₂ من المحلول بفعل الحرارة الموفرة من غلايات إعادة الغليان E-201 و E-202 وخفض الضغط.",
    x: 520,
    y: 120,
    w: 120,
    h: 460
  },
  "E-201": {
    tag: "E-201",
    name: "CATACARB REBOILER",
    nameAr: "جهاز إعادة الغليان الرئيسي بحرارة غاز التحويل",
    duty: "32.26 × 10⁶ kcal/h",
    deltaP: "ΔP_T = 0.28 kg/cm²",
    tempIn: "185°C (Gas) / 118°C (Sol'n)",
    tempOut: "120°C (Gas) / 120°C (Boiling Sol'n)",
    pressIn: "28.9 kg/cm²A",
    descAr: "مبادل حراري ضخم يستغل الحرارة المحتواة في غاز التحويل القادم من مفاعل التحويل منخفض الحرارة (LTS) لإعادة غليان محلول كاتاكارب وتوليد بخار التجريد داخل T-202 بمعدل تدفق 59,706 kg/h.",
    x: 370,
    y: 410,
    w: 80,
    h: 60
  },
  "E-202": {
    tag: "E-202",
    name: "STEAM REBOILER",
    nameAr: "جهاز إعادة الغليان المساعد بالبخار منخفض الضغط",
    duty: "3.31 × 10⁶ kcal/h",
    tempIn: "118°C (Sol'n) / L.P. Steam",
    tempOut: "120°C",
    descAr: "مبادل حراري مساعد يستخدم البخار منخفض الضغط (L.P. Steam بمعدل 6,500 kg/h) للتحكم الدقيق في حرارة أسفل برج التجريد وإكمال الطاقة الحرارية المطلوبة للتجريد.",
    x: 690,
    y: 410,
    w: 70,
    h: 55
  },
  "V-201": {
    tag: "V-201",
    name: "CATACARB REBOILER SEPARATOR",
    nameAr: "وعاء فصل مكثفات غاز التحويل بعد جهاز إعادة الغليان",
    deltaP: "ΔP = 0.04 kg/cm²",
    tempIn: "120°C / 127°C",
    pressOut: "28.2 kg/cm²A",
    descAr: "وعاء فاصل يفصل الغاز المعالج (المتجه إلى T-201) عن المكثفات المائية (56,691 kg/h) التي ترسل إلى برج تجريد الغازات V-209 أو للحقن والتبريد.",
    x: 270,
    y: 450,
    w: 60,
    h: 70
  },
  "P-206": {
    tag: "P-206 A, B",
    name: "CONDENSATE INJECTION PUMP",
    nameAr: "مضخات حقن وتدوير المكثفات",
    tempIn: "127°C",
    descAr: "مضخات طرد مركزي لإعادة حقن المكثفات المائية لتخفيض درجة حرارة الغاز في مسخن التبريد المباشر وتغذية برج التجريد V-209.",
    x: 270,
    y: 555,
    w: 60,
    h: 40
  },
  "P-202": {
    tag: "P-202 A, B",
    name: "LEAN SOL'N PUMP",
    nameAr: "مضخات دفع المحلول النقي (Lean Solution)",
    tempIn: "80°C (بعد التبريد في E-204)",
    pressOut: "36.0 kg/cm²A",
    descAr: "مضخات طرد مركزي عالية الضغط تسحب المحلول النقي (Lean Solution) من مخرج مبادل E-204 المتصل بأسفل برج التجريد T-202، وتدفعه بضغط 36.0 kg/cm²A عبر الفلتر F-201 مباشرة إلى أعلى برج الامتصاص T-201 بمعدل 360 m³/h.",
    x: 1050,
    y: 495,
    w: 75,
    h: 55
  },
  "E-204": {
    tag: "E-204",
    name: "BFW / LEAN SOL'N EXCHANGER",
    nameAr: "مبادل تبريد المحلول النقي وتسخين مياه BFW",
    duty: "13.48 × 10⁶ kcal/h",
    deltaP: "ΔP_S = 0.37 kg/cm²",
    tempIn: "120°C (من قاع T-202)",
    tempOut: "80°C (إلى سحب مضخات P-202 A,B)",
    descAr: "مبادل حراري متصل مباشرة بأسفل برج التجريد T-202 لاسترجاع الحرارة العالية من المحلول النقي وتبريده (من 120°C إلى 80°C) عبر تسخين مياه تغذية المراجل BFW قبل سحبه بواسطة مضخات P-202 A,B.",
    x: 1205,
    y: 495,
    w: 80,
    h: 48
  },
  "F-201": {
    tag: "F-201",
    name: "LEAN SOL'N FILTER",
    nameAr: "فلتر تنقية محلول كاتاكارب النقي",
    deltaP: "ΔP = 0.70 kg/cm²",
    tempIn: "80°C",
    descAr: "مرشح ميكانيكي عالي الكفاءة على خط طرد مضخات P-202 A,B لإزالة الرواسب الدقيقة وجسيمات الفحم من المحلول النقي قبل دخوله لقمة برج الامتصاص T-201.",
    x: 1055,
    y: 250,
    w: 60,
    h: 50
  },
  "E-205": {
    tag: "E-205 A, B",
    name: "OVERHEAD CONDENSER",
    nameAr: "مكثف غازات قمة برج التجريد الحامضية",
    duty: "22.82 × 10⁶ kcal/h",
    deltaP: "ΔP_S = 0.16 kg/cm²",
    tempIn: "97°C",
    tempOut: "50°C",
    descAr: "مكثفات مائية كبيرة لتبريد غاز ثاني أكسيد الكربون الحامضي وبخار الماء المتصاعد من قمة T-202 من 97°C إلى 50°C وتكثيف بخار الماء لفصله في V-203.",
    x: 320,
    y: 250,
    w: 75,
    h: 45
  },
  "V-203": {
    tag: "V-203",
    name: "ACID GAS SEPARATOR",
    nameAr: "وعاء فصل غاز CO2 الحامضي عن ماء الراجع",
    deltaP: "ΔP = 0.02 kg/cm²",
    pressOut: "1.24 kg/cm²A",
    tempOut: "50°C",
    descAr: "يفصل غاز CO₂ عالي النقاوة (98.50%) المتجه لمصنع اليوريا (بمعدل يصل لـ 61,000 kg/h) عن الماء المكثف الذي يعاد ضخه كراجع (Reflux) لقمة T-202.",
    x: 200,
    y: 240,
    w: 55,
    h: 65
  },
  "P-203": {
    tag: "P-203 A, B",
    name: "REFLUX PUMP",
    nameAr: "مضخات إعادة السائل الراجع لبرج التجريد",
    tempIn: "50°C",
    descAr: "مضخات لضخ ماء التكثيف من V-203 إلى قمة برج التجريد T-202 بمعدل 31,886 kg/h للحفاظ على موازنة المياه ومنع هروب أبخرة كاتاكارب.",
    x: 440,
    y: 330,
    w: 60,
    h: 40
  },
  "P-205": {
    tag: "P-205 A, B",
    name: "ANTI-FOAM INJECTION PUMP",
    nameAr: "مضخات حقن مانع الرغوة",
    descAr: "مضخات دقيقة لحقن المواد الكيميائية المضادة للرغوة من الخزان V-206 في خطوط المحلول لمنع حدوث الفوران داخل أبراج الامتصاص والتجريد.",
    x: 1060,
    y: 590,
    w: 50,
    h: 35
  },
  "V-206": {
    tag: "V-206",
    name: "ANTI-FOAM INJECTION TANK",
    nameAr: "خزان مادة مانع الرغوة الكيميائية",
    descAr: "خزان إعداد وتخزين المحلول الكيميائي المضاد للرغوة وتغذيته لمضخات الحقن P-205 A,B.",
    x: 1130,
    y: 580,
    w: 45,
    h: 45
  },
  "V-205": {
    tag: "V-205",
    name: "CATACARB STORAGE TANK",
    nameAr: "خزان خزن وتجهيز محلول كاتاكارب",
    descAr: "خزان تخزين رئيسي لمحلول كربونات البوتاسيوم المنشطة وفانادات البوتاسيوم لتزويد النظام وتعويض الفواقد.",
    x: 140,
    y: 540,
    w: 70,
    h: 70
  },
  "V-207": {
    tag: "V-207",
    name: "SUMP TANK",
    nameAr: "حوض تجميع التسريبات والمحاليل المسترجعة",
    descAr: "حوض تجميع سفلي لاستقبال تصريفات الصيانة وغسيل المعدات وإعادتها عبر مضخة P-204 إلى الخزان الرئيسي.",
    x: 210,
    y: 575,
    w: 45,
    h: 40
  },
  "P-204": {
    tag: "P-204",
    name: "SOLVENT TRANSFER PUMP",
    nameAr: "مضخة نقل واسترجاع المحلول",
    descAr: "مضخة غاطسة لنقل المحلول المجمع من حوض V-207 إلى خزان التخزين V-205 بمعدل 8,055 kg/h.",
    x: 210,
    y: 625,
    w: 45,
    h: 30
  },
  "V-209": {
    tag: "V-209",
    name: "DEGASSING COLUMN",
    nameAr: "برج تجريد الغازات الذائبة من المكثفات",
    tempIn: "110°C / 90°C",
    descAr: "برج حشوات لتجريد الغازات الحامضية والذائبة من المكثفات العملية وتنقيتها قبل تبريد المكثفات وتصريفها.",
    x: 370,
    y: 560,
    w: 60,
    h: 90
  },
  "E-206": {
    tag: "E-206",
    name: "PROCESS CONDENSATE COOLER",
    nameAr: "مبرد المكثفات العملية",
    duty: "3.19 × 10⁶ kcal/h",
    deltaP: "ΔP_T = 0.20 kg/cm²",
    tempIn: "90°C",
    tempOut: "45°C",
    descAr: "مبادل حراري لتبريد المكثفات المعالجة الخارجة من V-209 من 90°C إلى 45°C قبل ضخها لبرج التبريد.",
    x: 470,
    y: 620,
    w: 65,
    h: 40
  },
  "P-208": {
    tag: "P-208 A, B",
    name: "PROCESS CONDENSATE PUMP",
    nameAr: "مضخات تصريف المكثفات لبرج التبريد",
    tempIn: "45°C",
    descAr: "مضخات تصريف وضخ المكثفات المبردة بمعدل 32,946 kg/h إلى أبراج التبريد الصناعية ووحدة معالجة المياه.",
    x: 570,
    y: 620,
    w: 60,
    h: 40
  }
};
