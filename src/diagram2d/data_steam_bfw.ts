/**
 * data_steam_bfw.ts
 * Process Flow Diagram Data for Boiler Feed Water (BFW) & Steam Generation Network
 * Blueprint: DWG NO. 6112P 100-103-00 / BFW-STEAM-P&ID
 * Project: IRAQ NO. 3 PROJECT / M.O.I. IRAQ - FERTILIZER PROJECT, KHOR AL-ZUBAIR PHASE-1
 * AMMONIA & UTILITIES UNIT - BOILER FEED WATER & STEAM GENERATION CIRCUITS
 */

import { PFDStreamData, PFDEquipment, PFDSheetInfo } from './types';

export const SHEET_STEAM_BFW_INFO: PFDSheetInfo = {
  id: 'steam_bfw',
  dwgNo: 'DWG NO. 6112P 100-103-00',
  title: 'BFW PREPARATION, STEAM GENERATION & DISTRIBUTION NETWORK',
  titleAr: 'منظومة مياه تغذية المراجل (BFW)، نزع الغازات، وتوليد البخار عالي الضغط ودورات التدوير',
  orderNo: '563030-016',
  date: '15 FEB \'76',
  customer: 'M.O.I. IRAQ - FERTILIZER PROJECT KHOR AL-ZUBAIR PHASE-1',
  filters: [
    { id: 'all', label: 'All Circuits', labelAr: 'المخطط الكامل للمنظومة' },
    { id: 'deaeration', label: 'Deaeration (P-761 / V-103 / P-101)', labelAr: 'منظومة نزع الغازات ومضخات التغذية V-103 / P-101' },
    { id: 'preheating', label: 'HP Preheating (E-105B / E-402 / E-105A)', labelAr: 'سلسلة تسخين مياه المراجل E-105B / E-402 / E-105A' },
    { id: 'steam_drums', label: 'Steam Drums (V-102 / V-102A / E-104 / E-108)', labelAr: 'أوعية البخار والتدوير القسري V-102 / V-102A' },
    { id: 'lp_distribution', label: 'LP BFW & Blowdown (P-104 / V-109)', labelAr: 'مياه الضغط المنخفض ونزع الأملاح P-104 / V-109' }
  ]
};

export const STREAMS_STEAM_BFW: Record<number, PFDStreamData> = {
  1: {
    id: 1,
    name: "DEMIN WATER EX P-761",
    nameAr: "مياه منزوعة الأملاح ومكثفات من مضخة P-761",
    pressure: "14.0",
    temperature: "50.0",
    flowKgH: "145,000",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "8,049.0",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  2: {
    id: 2,
    name: "PREHEATED WATER EX E-204",
    nameAr: "مياه مسخنة بعد المبادل E-204 (تحكم TIC-203)",
    pressure: "13.2",
    temperature: "90.0",
    flowKgH: "145,000",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "8,049.0",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  3: {
    id: 3,
    name: "DEAERATED BFW EX V-103",
    nameAr: "مياه مراجل منزوعة الأكسجين والغازات من قعر V-103",
    pressure: "1.4",
    temperature: "125.0",
    flowKgH: "185,000",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "10,266.0",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %",
      o2: "< 0.005 ppm"
    }
  },
  4: {
    id: 4,
    name: "HP BFW DISCHARGE EX P-101",
    nameAr: "مياه مراجل عالية الضغط من مضخات P-101 A/B/C",
    pressure: "115.0",
    temperature: "125.0",
    flowKgH: "160,000",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "8,879.0",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  5: {
    id: 5,
    name: "MP BFW BRANCH (50 KG)",
    nameAr: "فرع مياه المراجل للضغط المتوسط 50 بار (TIC-153 / TIC-507)",
    pressure: "50.0",
    temperature: "125.0",
    flowKgH: "25,000",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "1,387.0",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  6: {
    id: 6,
    name: "PREHEATED BFW EX E-105B",
    nameAr: "مياه مراجل مسخنة بعد المبادل E-105B",
    pressure: "112.0",
    temperature: "150.0",
    flowKgH: "135,000",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "7,492.0",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  7: {
    id: 7,
    name: "PREHEATED BFW EX E-402",
    nameAr: "مياه مراجل مسخنة بحرارة تخليق الأمونيا E-402",
    pressure: "108.0",
    temperature: "200.0",
    flowKgH: "135,000",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "7,492.0",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  8: {
    id: 8,
    name: "HP BFW EX REFORMER CONVECTION E-105A",
    nameAr: "مياه مراجل مسخنة بحمل غازات المصلح E-105A (280°C)",
    pressure: "104.0",
    temperature: "280.0",
    flowKgH: "135,000",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "7,492.0",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  9: {
    id: 9,
    name: "FEED TO STEAM DRUM V-102A (FRC-153S)",
    nameAr: "تغذية وعاء البخار الثانوي V-102A عبر FRC-153S (65 kg/cm²G)",
    pressure: "65.0",
    temperature: "280.0",
    flowKgH: "45,000",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "2,497.0",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  10: {
    id: 10,
    name: "FEED TO STEAM DRUM V-102 (FRC-153)",
    nameAr: "تغذية وعاء البخار الرئيسي V-102 عبر FRC-153 (65 kg/cm²G)",
    pressure: "65.0",
    temperature: "280.0",
    flowKgH: "90,000",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "4,994.0",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  11: {
    id: 11,
    name: "V-102 FORCED CIRCULATION TO P-102",
    nameAr: "مياه التدوير القسري النازلة من V-102 لمضخات P-102A/B",
    pressure: "105.0",
    temperature: "314.0",
    flowKgH: "450,000",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "24,972.0",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  12: {
    id: 12,
    name: "E-104 GENERATED STEAM RISER RETURN",
    nameAr: "خليط البخار والماء المتولد من مرجل E-104 العائد إلى V-102",
    pressure: "103.5",
    temperature: "314.0",
    flowKgH: "450,000 (Mixture)",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "24,972.0",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  13: {
    id: 13,
    name: "V-102A CIRCULATION TO E-108 / E-109",
    nameAr: "مياه التدوير من وعاء V-102A إلى مبادلات E-108 و E-109",
    pressure: "105.0",
    temperature: "314.0",
    flowKgH: "220,000",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "12,208.0",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  14: {
    id: 14,
    name: "LP BFW DISCHARGE EX P-104",
    nameAr: "مياه التغذية بالضغط المنخفض من مضخات P-104A/B (18 kg/cm²G)",
    pressure: "18.0",
    temperature: "125.0",
    flowKgH: "35,000",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "1,942.0",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  15: {
    id: 15,
    name: "LP BFW TO DESUPERHEATING TIC-154",
    nameAr: "مياه حقن تبريد وتعديل حرارة البخار عبر المحكم TIC-154",
    pressure: "18.0",
    temperature: "125.0",
    flowKgH: "6,500",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "360.7",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  16: {
    id: 16,
    name: "LP FLUSH & SEAL WATER TO P-201 / P-202",
    nameAr: "مياه غسيل وتبريد حشوات مضخات محلول بنفيلد P-201 / P-202",
    pressure: "18.0",
    temperature: "125.0",
    flowKgH: "4,200",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "233.0",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  17: {
    id: 17,
    name: "LP UTILITY & RETURN VIA FIC-204 / V-103",
    nameAr: "خط التدوير والاتزان لوعاء إزالة الغازات V-103 عبر FIC-204",
    pressure: "18.0",
    temperature: "125.0",
    flowKgH: "12,000",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "665.9",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 %"
    }
  },
  18: {
    id: 18,
    name: "CONTINUOUS BLOWDOWN TO V-109 (LRC-157)",
    nameAr: "مياه التفريغ المستمر لنزع الأملاح إلى V-109 عبر LRC-157",
    pressure: "105.0 -> 3.5",
    temperature: "314.0 -> 148.0",
    flowKgH: "3,500",
    dryGasMolH: "-",
    wetGasMolH: "-",
    h2oMolH: "194.2",
    dryMw: "-",
    wetMw: "18.02",
    comp: {
      h2o: "100.0 % (With TDS & Phosphate Residues)"
    }
  }
};

export const EQUIPMENT_STEAM_BFW: Record<string, PFDEquipment> = {
  'P-761': {
    tag: 'P-761',
    name: 'Demineralized Water Supply Pump',
    nameAr: 'مضخة تجهيز المياه منزوعة الأملاح والمكثفات',
    duty: '145 m³/h @ 14 kg/cm²G',
    pressIn: '1.2 kg/cm²G',
    pressOut: '14.0 kg/cm²G',
    tempIn: '50 °C',
    tempOut: '50 °C',
    descAr: 'تسحب المياه المعالجة الخالية من المعادن وتدفعها بضغط 14 كغم/سم² نحو مبادل التسخين E-204 ومنظومة نزع الغازات.',
    x: 80,
    y: 180,
    w: 60,
    h: 50
  },
  'E-204': {
    tag: 'E-204',
    name: 'BFW Preheater Exchanger',
    nameAr: 'مبادل التسخين الأولي لمياه المراجل (E-204)',
    duty: '5.8 x 10⁶ kcal/h',
    tempIn: '50 °C',
    tempOut: '90 °C',
    pressIn: '14.0 kg/cm²G',
    pressOut: '13.2 kg/cm²G',
    descAr: 'يقوم بتسخين مياه التغذية من 50°C إلى 90°C مسترجعاً الحرارة، ومزود بمسار تجاوز جانبي ومحكم حراري TIC-203.',
    x: 280,
    y: 170,
    w: 90,
    h: 60
  },
  'V-103': {
    tag: 'V-103',
    name: 'Deaerator Vessel & Storage Tank',
    nameAr: 'برج وخزان نزع الغازات والأكسجين الذائب (Deaerator V-103)',
    duty: 'Volume: 95 m³ | Operating Temp: 125 °C',
    tempIn: '90 °C',
    tempOut: '125 °C',
    pressIn: '1.4 kg/cm²G',
    pressOut: '1.4 kg/cm²G',
    descAr: 'برج نزع الغازات يعمل بحقن بخار التجريد لطرد غازي O2 و CO2 الذائبين لمنع التآكل، ويحفظ مخزون مياه المراجل عند 125°C بتنظيم صمام المنسوب LIC-151.',
    x: 520,
    y: 140,
    w: 110,
    h: 120
  },
  'P-101': {
    tag: 'P-101',
    name: 'HP Boiler Feed Water Pumps (A/B/C)',
    nameAr: 'مضخات مياه المراجل الرئيسية عالية الضغط (P-101 A/B/C)',
    duty: '3x Multi-Stage Turbopumps | 160 t/h @ 115 bar',
    pressIn: '1.4 kg/cm²G',
    pressOut: '115.0 kg/cm²G',
    tempIn: '125 °C',
    tempOut: '125 °C',
    descAr: 'مضخات الطرد المركزي متعددة المراحل العملاقة المدارة بتوربينات بخارية وكهربائية لرفع ضغط مياه التغذية من 1.4 كغم/سم² إلى 115 كغم/سم².',
    x: 740,
    y: 170,
    w: 90,
    h: 60
  },
  'E-105B': {
    tag: 'E-105B',
    name: '1st Stage HP BFW Preheater',
    nameAr: 'مبادل التسخين الأولي لمياه الضغط العالي (E-105B)',
    duty: '3.6 x 10⁶ kcal/h',
    tempIn: '125 °C',
    tempOut: '150 °C',
    pressIn: '115.0 kg/cm²G',
    pressOut: '112.0 kg/cm²G',
    descAr: 'المرحلة الأولى لتسخين مياه المراجل عالية الضغط من 125°C إلى 150°C.',
    x: 320,
    y: 360,
    w: 80,
    h: 60
  },
  'E-402': {
    tag: 'E-402',
    name: 'Synthesis Loop BFW Preheater',
    nameAr: 'مبادل استرجاع حرارة تخليق الأمونيا لمياه المراجل (E-402)',
    duty: '6.4 x 10⁶ kcal/h',
    tempIn: '150 °C',
    tempOut: '200 °C',
    pressIn: '112.0 kg/cm²G',
    pressOut: '108.0 kg/cm²G',
    descAr: 'يسترجع الحرارة الفائضة من غازات مخرج مفاعل تخليق الأمونيا R-401 لتسخين مياه المراجل إلى 200°C.',
    x: 470,
    y: 360,
    w: 80,
    h: 60
  },
  'E-105A': {
    tag: 'E-105A',
    name: 'Reformer Convection High Temp BFW Preheater',
    nameAr: 'حزمة التسخين النهائي لمياه المراجل في مدخنة المصلح (E-105A)',
    duty: '11.2 x 10⁶ kcal/h',
    tempIn: '200 °C',
    tempOut: '280 °C',
    pressIn: '108.0 kg/cm²G',
    pressOut: '104.0 kg/cm²G',
    descAr: 'تقع داخل منطقة الحمل الحراري (Convection Section) للمصلح الأولي R-101 وترفع حرارة المياه إلى 280°C قريباً من نقطة الغليان.',
    x: 620,
    y: 360,
    w: 80,
    h: 60
  },
  'V-102': {
    tag: 'V-102',
    name: 'Main HP Steam Drum',
    nameAr: 'وعاء توليد وفصل البخار عالي الضغط الرئيسي (HP Steam Drum V-102)',
    duty: 'Operating Pressure: 105 kg/cm²G | Temp: 314 °C',
    tempIn: '280 °C',
    tempOut: '314 °C (Steam/Water Saturation)',
    pressIn: '65 - 105 kg/cm²G',
    pressOut: '105 kg/cm²G',
    descAr: 'وعاء الضغط العالي الرئيسي لفصل البخار المشبع عن الماء بواسطة السايكلونات وفواصل الرطوبة، ومغذى عبر متحكم التدفق FRC-153.',
    x: 880,
    y: 380,
    w: 120,
    h: 70
  },
  'V-102A': {
    tag: 'V-102A',
    name: 'Secondary Steam Drum',
    nameAr: 'وعاء البخار عالي الضغط الثانوي (Secondary Steam Drum V-102A)',
    duty: 'Operating Pressure: 105 kg/cm²G | Temp: 314 °C',
    tempIn: '280 °C',
    tempOut: '314 °C',
    pressIn: '65 - 105 kg/cm²G',
    pressOut: '105 kg/cm²G',
    descAr: 'وعاء فصل البخار الثانوي المرتبط بمبادلات استرجاع الحرارة E-108 و E-109، ويغذى بمياه المراجل عبر FRC-153S.',
    x: 880,
    y: 280,
    w: 120,
    h: 70
  },
  'P-102': {
    tag: 'P-102',
    name: 'HP Boiler Circulation Pumps (A/B)',
    nameAr: 'مضخات التدوير القسري لمرجل البخار عالي الضغط (P-102 A/B)',
    duty: '2x High-Head Canned/Sealed Pumps | 450 t/h',
    pressIn: '105.0 kg/cm²G',
    pressOut: '108.5 kg/cm²G',
    tempIn: '314 °C',
    tempOut: '314 °C',
    descAr: 'مضخات تدوير خاصة للضغط ودرجة الحرارة الفائقة تسحب مياه الغليان من قعر V-102 وتضخها بقوة عبر مرجل النفايات E-104.',
    x: 170,
    y: 530,
    w: 80,
    h: 55
  },
  'E-104': {
    tag: 'E-104',
    name: 'Primary Waste Heat Boiler (Secondary Reformer Exit)',
    nameAr: 'مرجل استرجاع حرارة غازات المصلح الثانوي (Waste Heat Boiler E-104)',
    duty: '32.5 x 10⁶ kcal/h',
    tempIn: '314 °C',
    tempOut: '314 °C (Steam Generation 90 t/h)',
    pressIn: '108.5 kg/cm²G',
    pressOut: '105.0 kg/cm²G',
    descAr: 'مرجل توليد البخار الرئيسي الذي يبرد الغازات الخارجة من المصلح الثانوي R-103 من 1000°C إلى 370°C مولداً كميات هائلة من البخار عالي الضغط العائد إلى V-102.',
    x: 320,
    y: 520,
    w: 90,
    h: 65
  },
  'E-108': {
    tag: 'E-108',
    name: 'HTS Exit Waste Heat Boiler Exchanger',
    nameAr: 'مرجل استرجاع حرارة مخرج مفاعل التحويل العالي HTS (E-108)',
    duty: '14.8 x 10⁶ kcal/h',
    tempIn: '314 °C',
    tempOut: '314 °C',
    pressIn: '105.0 kg/cm²G',
    pressOut: '105.0 kg/cm²G',
    descAr: 'مرجل تدوير طبيعي يبرد غازات مخرج مفاعل التحويل R-104 ويولد بخاراً عالي الضغط يعود إلى وعاء V-102A.',
    x: 740,
    y: 520,
    w: 85,
    h: 60
  },
  'E-109': {
    tag: 'E-109',
    name: 'Synthesis Gas Waste Heat Exchanger',
    nameAr: 'مرجل استرجاع حرارة غاز التخليق الثانوي (E-109)',
    duty: '8.5 x 10⁶ kcal/h',
    tempIn: '314 °C',
    tempOut: '314 °C',
    pressIn: '105.0 kg/cm²G',
    pressOut: '105.0 kg/cm²G',
    descAr: 'مبادل توليد بخار إضافي يغذي وعاء البخار الثانوي V-102A.',
    x: 880,
    y: 520,
    w: 85,
    h: 60
  },
  'P-104': {
    tag: 'P-104',
    name: 'LP Boiler Feed Water / Condensate Pumps (A/B)',
    nameAr: 'مضخات مياه المراجل بالضغط المنخفض (P-104 A/B)',
    duty: '2x Pumps | 35 m³/h @ 18 kg/cm²G',
    pressIn: '1.4 kg/cm²G',
    pressOut: '18.0 kg/cm²G',
    tempIn: '125 °C',
    tempOut: '125 °C',
    descAr: 'تسحب من خزان V-103 وتضخ بضغط 18 كغم/سم² لتغذية بخاخات تبريد البخار TIC-154، غسيل حشوات مضخات بنفيلد P-201/P-202، وتفريغ الأملاح V-109.',
    x: 100,
    y: 720,
    w: 85,
    h: 55
  },
  'V-109': {
    tag: 'V-109',
    name: 'Continuous Blowdown & Flash Drum',
    nameAr: 'وعاء التبخير الومضي لتفريغ أملاح المراجل (Blowdown Drum V-109)',
    duty: 'Flash Pressure: 3.5 kg/cm²G',
    tempIn: '314 °C',
    tempOut: '148 °C',
    pressIn: '105 kg/cm²G (Throttle)',
    pressOut: '3.5 kg/cm²G',
    descAr: 'يستقبل مياه التفريغ المستمر المحملة بالأملاح من قعر أوعية البخار عبر متحكم المنسوب LRC-157 لاسترجاع البخار الومضي المنخفض والتخلص من الرواسب.',
    x: 520,
    y: 710,
    w: 90,
    h: 80
  }
};
