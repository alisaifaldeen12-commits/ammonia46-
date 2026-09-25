import { PFDSheetInfo, PFDStreamData, PFDEquipment } from './types';

export const SHEET_STEAM_HEADER_INFO: PFDSheetInfo = {
  id: 'steam_header',
  dwgNo: 'DWG NO. 6112P 100-104-00',
  title: 'STEAM HEADERS & PRDS DISTRIBUTION NETWORK (S-65 / S-39 / S-12 / S-3 KG)',
  titleAr: 'مخطط مجمعات البخار ومحطات تخفيض وتبريد الضغط PRDS (65 / 39 / 12 / 3 كغم/سم²)',
  orderNo: '563030-017',
  date: 'REV 04 - 2026',
  customer: 'FERTILIZER & AMMONIA INDUSTRIAL COMPLEX - STEAM UTILITY',
  filters: [
    { id: 'all', label: 'All Headers', labelAr: 'كامل شبكة مجمعات البخار' },
    { id: 's65', label: 'HP Steam (S-65 kg)', labelAr: 'مجمع الضغط العالي S-65' },
    { id: 's39', label: 'MP Steam (S-39 kg)', labelAr: 'مجمع الضغط المتوسط S-39' },
    { id: 's12', label: 'LP Steam (S-12 kg)', labelAr: 'مجمع الضغط المنخفض S-12' },
    { id: 's3', label: 'LL-P Steam (S-3 kg)', labelAr: 'مجمع الضغط الشديد الانخفاض S-3' }
  ]
};

export const STREAMS_STEAM_HEADER: Record<number, PFDStreamData> = {
  1: {
    id: 1,
    name: 'SATURATED STEAM FROM DRUM V-102',
    nameAr: 'بخار مشبع خارج من وعاء البخار V-102 إلى المحمص E-103B',
    pressure: '65.0',
    temperature: '280.0',
    flowKgH: '198,500',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '11,015.0',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 % (Saturated Vapor)'
    }
  },
  2: {
    id: 2,
    name: 'INTERSTAGE SUPERHEATED STEAM (E-103B TO E-103A)',
    nameAr: 'بخار محمص مرحلي بين المحمصين مع بخاخ TICA-152',
    pressure: '64.5',
    temperature: '370.0',
    flowKgH: '198,500',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '11,015.0',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 % (Superheated Steam)'
    }
  },
  3: {
    id: 3,
    name: 'HP SUPERHEATED STEAM TO S-65 HEADER',
    nameAr: 'بخار عالي الضغط والتحميص إلى مجمع S-65 (FRQA-154)',
    pressure: '65.0',
    temperature: '435.0',
    flowKgH: '210,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '11,653.7',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 % (HP Superheated)'
    }
  },
  4: {
    id: 4,
    name: 'HP STEAM TO CO2 COMPRESSOR TURBINE K-501',
    nameAr: 'بخار عالي الضغط 65 كغم لتشغيل توربين كباس CO₂ (K-501)',
    pressure: '64.0',
    temperature: '435.0',
    flowKgH: '65,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '3,607.1',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  5: {
    id: 5,
    name: 'HP STEAM TO SYNGAS COMPRESSOR TURBINE K-302',
    nameAr: 'بخار عالي الضغط 65 كغم لتشغيل توربين كباس غاز التخليق K-302',
    pressure: '64.0',
    temperature: '435.0',
    flowKgH: '82,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '4,550.5',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  6: {
    id: 6,
    name: 'HP STEAM TO PROCESS AIR COMPRESSOR K-301',
    nameAr: 'بخار عالي الضغط 65 كغم لتشغيل توربين كباس الهواء K-301',
    pressure: '64.0',
    temperature: '435.0',
    flowKgH: '45,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '2,497.2',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  7: {
    id: 7,
    name: 'K-301 TURBINE EXTRACTION STEAM TO S-39',
    nameAr: 'بخار مستخلص من عادم كباس الهواء K-301 المغذي لمجمع S-39',
    pressure: '39.0',
    temperature: '380.0',
    flowKgH: '40,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '2,219.8',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  8: {
    id: 8,
    name: 'PRDS LETDOWN FROM S-65 TO S-39 (PRCA-341/342)',
    nameAr: 'بخار مخفض الضغط ومبرد من مجمع 65 كغم إلى 39 كغم',
    pressure: '39.0',
    temperature: '380.0',
    flowKgH: '35,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '1,942.3',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  9: {
    id: 9,
    name: 'PROCESS STEAM TO PRIMARY REFORMER (FRCA-102)',
    nameAr: 'بخار العملية المتجه إلى المصلح الأولي H-101 عبر FRCA-102',
    pressure: '39.0',
    temperature: '380.0',
    flowKgH: '52,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '2,885.7',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  10: {
    id: 10,
    name: 'MP STEAM TO AUXILIARY TURBINE K-303',
    nameAr: 'بخار متوسط لتشغيل توربين K-303',
    pressure: '38.5',
    temperature: '380.0',
    flowKgH: '18,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '998.9',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  11: {
    id: 11,
    name: 'MP STEAM TO HP BFW PUMPS P-101 A/B',
    nameAr: 'بخار متوسط لتشغيل توربينات مضخات المراجل P-101 A/B',
    pressure: '38.5',
    temperature: '380.0',
    flowKgH: '22,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '1,220.9',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  12: {
    id: 12,
    name: 'MP STEAM TO P-711, K-101A, K-401 TURBINES',
    nameAr: 'بخار متوسط لتوربينات P-711 ومروحة K-101A وكباس التبريد K-401',
    pressure: '38.5',
    temperature: '380.0',
    flowKgH: '12,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '665.9',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  13: {
    id: 13,
    name: 'PRDS LETDOWN FROM S-39 TO S-12 (PICA-164 1V)',
    nameAr: 'بخار مخفض ومبرد من S-39 إلى S-12 مع بخاخ P-101 M.P',
    pressure: '12.0',
    temperature: '190.0',
    flowKgH: '25,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '1,387.3',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  14: {
    id: 14,
    name: 'FLASH STEAM FROM BLOWDOWN DRUM V-109',
    nameAr: 'بخار ومضي من وعاء التفريغ المستمر V-109 (PIC-166)',
    pressure: '12.0',
    temperature: '190.0',
    flowKgH: '6,500',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '360.7',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  15: {
    id: 15,
    name: 'LP STEAM TO E-112, E-711 & CONDENSATE REBOILERS',
    nameAr: 'بخار التدفئة للمبادلات E-112 و E-711 والمكثفات الساخنة',
    pressure: '12.0',
    temperature: '190.0',
    flowKgH: '15,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '832.4',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  16: {
    id: 16,
    name: 'PRDS LETDOWN FROM S-12 TO S-3 (PICA-164 2V / PICA-161)',
    nameAr: 'بخار مخفض ومبرد من S-12 إلى S-3 مع بخاخ P-104 L-P',
    pressure: '3.0',
    temperature: '245.0',
    flowKgH: '28,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '1,553.8',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  17: {
    id: 17,
    name: 'K-101A FAN TURBINE EXHAUST TO S-3',
    nameAr: 'عادم توربين مروحة هواء الاحتراق K-101A إلى مجمع S-3',
    pressure: '3.0',
    temperature: '245.0',
    flowKgH: '8,500',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '471.7',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  18: {
    id: 18,
    name: 'LP STEAM TO DEAERATOR V-103 (STRIPPING/HEATING)',
    nameAr: 'بخار منخفض 3 كغم لغلي ونزع الغازات في وعاء V-103',
    pressure: '3.0',
    temperature: '245.0',
    flowKgH: '20,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '1,109.9',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  19: {
    id: 19,
    name: 'LP STEAM TO BENFIELD REBOILER E-202',
    nameAr: 'بخار منخفض 3 كغم لإعادة غليان محلول بنفيلد في مرجل E-202',
    pressure: '3.0',
    temperature: '245.0',
    flowKgH: '14,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '776.9',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  },
  20: {
    id: 20,
    name: 'PLANT UTILITY STEAM (H-401, H-101, E-453, K-302 GLAND)',
    nameAr: 'بخار خدمات القسم (المسخنات H-401/H-101، حابكات K-302، ومبادلات E-453)',
    pressure: '3.0',
    temperature: '245.0',
    flowKgH: '9,000',
    dryGasMolH: '-',
    wetGasMolH: '-',
    h2oMolH: '499.4',
    dryMw: '-',
    wetMw: '18.02',
    comp: {
      h2o: '100.0 %'
    }
  }
};

export const EQUIPMENT_STEAM_HEADER: Record<string, PFDEquipment> = {
  'V-102': {
    tag: 'V-102',
    name: 'Steam Drum',
    nameAr: 'وعاء تجميع البخار المشبع الرئيسي',
    duty: '198.5 t/h Steam Generation',
    tempIn: '280.0 °C',
    tempOut: '280.0 °C',
    pressIn: '66.5 kg/cm²G',
    pressOut: '65.0 kg/cm²G',
    descAr: 'يستقبل خليط الماء والبخار من مرجل النفايات E-104 ومراجل التبخير ليفصل البخار المشبع عند ضغط 65 kg/cm²G وحرارة 280°C لتغذية محمصات البخار.',
    x: 100,
    y: 100,
    w: 70,
    h: 50
  },
  'E-103B': {
    tag: 'E-103B',
    name: 'Primary Steam Superheater',
    nameAr: 'محمص البخار عالي الضغط الأولي',
    duty: '14.2 x 10⁶ kcal/h',
    tempIn: '280.0 °C',
    tempOut: '370.0 °C',
    pressIn: '65.0 kg/cm²G',
    pressOut: '64.8 kg/cm²G',
    descAr: 'حزمة أنابيب داخل منطقة الحمل الحراري لفرن الإصلاح الأولي H-101 تقوم برفع حرارة البخار المشبع من 280°C إلى 370°C.',
    x: 220,
    y: 100,
    w: 55,
    h: 45
  },
  'E-103A': {
    tag: 'E-103A',
    name: 'Secondary Steam Superheater',
    nameAr: 'محمص البخار عالي الضغط الثانوي',
    duty: '11.8 x 10⁶ kcal/h',
    tempIn: '370.0 °C',
    tempOut: '435.0 °C',
    pressIn: '64.8 kg/cm²G',
    pressOut: '65.0 kg/cm²G',
    descAr: 'المحمص النهائي داخل مدخنة H-101 لرفع حرارة البخار إلى 435°C والتحكم بها بدقة عبر حقن ماء التبريد TICA-152 و TIC-156.',
    x: 320,
    y: 100,
    w: 55,
    h: 45
  },
  'K-501': {
    tag: 'K-501',
    name: 'CO2 Compressor Steam Turbine',
    nameAr: 'توربين كباس ثاني أكسيد الكربون (مصنع اليوريا)',
    duty: '18,500 kW Mechanical Drive',
    tempIn: '435.0 °C',
    tempOut: 'Condensate @ 45°C',
    pressIn: '64.0 kg/cm²G',
    pressOut: '0.1 kg/cm²A',
    descAr: 'توربين بخاري يعمل ببخار S-65 عالي الضغط (435°C / 65 kg/cm²G) لإدارة كباس غاز CO₂ لتغذية مصنع اليوريا.',
    x: 520,
    y: 80,
    w: 65,
    h: 40
  },
  'K-302': {
    tag: 'K-302',
    name: 'Syngas Compressor HP Turbine',
    nameAr: 'توربين كباس غاز التخليق الرئيسي',
    duty: '26,800 kW Multi-Stage Drive',
    tempIn: '435.0 °C',
    tempOut: 'Condensate @ 48°C',
    pressIn: '64.0 kg/cm²G',
    pressOut: '0.12 kg/cm²A',
    descAr: 'أكبر توربين في مصنع الأمونيا يعمل ببخار 65 كغم لإدارة المراحل عالية الضغط لكباس غاز التخليق وتدوير الغاز.',
    x: 520,
    y: 130,
    w: 65,
    h: 40
  },
  'K-301': {
    tag: 'K-301',
    name: 'Process Air Compressor Turbine',
    nameAr: 'توربين كباس هواء العملية (مع الاستخلاص S-39)',
    duty: '14,200 kW Back-Pressure & Extraction',
    tempIn: '435.0 °C',
    tempOut: '380.0 °C (Exhaust to S-39)',
    pressIn: '64.0 kg/cm²G',
    pressOut: '39.0 kg/cm²G',
    descAr: 'توربين إدارة كباس الهواء يدخل إليه بخار S-65 ويستخرج من قمره عادم بخار منظم عند 39 kg/cm²G ليغذي شبكة S-39.',
    x: 320,
    y: 280,
    w: 65,
    h: 50
  },
  'S-65': {
    tag: 'S-65',
    name: 'HP Steam Header (65 kg/cm²G @ 435°C)',
    nameAr: 'مجمع البخار عالي الضغط (65 كغم/سم² - 435 مئوية)',
    duty: 'Total Capacity: 210 t/h',
    tempIn: '435.0 °C',
    tempOut: '435.0 °C',
    pressIn: '65.0 kg/cm²G',
    pressOut: '65.0 kg/cm²G',
    descAr: 'المجمع الرئيسي لتوزيع الطاقة الحرارية والميكانيكية للتوربينات الكبرى ومحطات التخفيض، مزود بعداد رئيسي FRQA-159 B وصمامات تصريف PICA-162 و PIC-155.',
    x: 80,
    y: 210,
    w: 900,
    h: 18
  },
  'S-39': {
    tag: 'S-39',
    name: 'MP Steam Header (39 kg/cm²G @ 380°C)',
    nameAr: 'مجمع البخار متوسط الضغط (39 كغم/سم² - 380 مئوية)',
    duty: 'Total Flow: 144 t/h',
    tempIn: '380.0 °C',
    tempOut: '380.0 °C',
    pressIn: '39.0 kg/cm²G',
    pressOut: '39.0 kg/cm²G',
    descAr: 'المجمع المغذي لبخار العملية للمصلح الأولي عبر FRCA-102، وتوربينات المضخات P-101 و P-711 و K-101A و K-303 و K-401.',
    x: 80,
    y: 430,
    w: 900,
    h: 18
  },
  'S-12': {
    tag: 'S-12',
    name: 'LP Steam Header (12 kg/cm²G @ 190°C)',
    nameAr: 'مجمع البخار منخفض الضغط (12 كغم/سم² - 190 مئوية)',
    duty: 'Total Flow: 31.5 t/h',
    tempIn: '190.0 °C',
    tempOut: '190.0 °C',
    pressIn: '12.0 kg/cm²G',
    pressOut: '12.0 kg/cm²G',
    descAr: 'يستقبل البخار من محطة التخفيض PICA-164 1V ومن وعاء التبخير الومضي V-109، ويغذي مبادلات E-112 و E-711 والمكثفات الساخنة.',
    x: 80,
    y: 650,
    w: 900,
    h: 18
  },
  'S-3': {
    tag: 'S-3',
    name: 'LL-P Steam Header (3 kg/cm²G @ 245°C)',
    nameAr: 'مجمع البخار منخفض الضغط جداً (3 كغم/سم² - 245 مئوية)',
    duty: 'Total Flow: 42.5 t/h',
    tempIn: '245.0 °C',
    tempOut: '245.0 °C',
    pressIn: '3.0 kg/cm²G',
    pressOut: '3.0 kg/cm²G',
    descAr: 'مجمع البخار المغذي لوعاء نزع الغازات V-103 ومراجل بنفيلد E-202 والمسخنات H-401/H-101 وحابكات التوربينات.',
    x: 80,
    y: 870,
    w: 900,
    h: 18
  },
  'V-109': {
    tag: 'V-109',
    name: 'Continuous Blowdown Flash Drum',
    nameAr: 'وعاء التبخير الومضي لتفريغ المراجل المستمر',
    duty: '6.5 t/h Flash Steam Recovery',
    tempIn: '280.0 °C',
    tempOut: '190.0 °C',
    pressIn: '65.0 kg/cm²G',
    pressOut: '12.0 kg/cm²G',
    descAr: 'يستقبل مياه التفريغ المستمر من وعاء البخار عبر صمام المنسوب LRCA-157 ويقوم بتوليد بخار ومضي يضخ إلى مجمع S-12 بضغط 12 kg/cm²G منظم بـ PIC-166.',
    x: 70,
    y: 530,
    w: 60,
    h: 48
  },
  'K-101A': {
    tag: 'K-101A',
    name: 'Combustion Air Fan Turbine Driver',
    nameAr: 'توربين مروحة هواء الاحتراق لفرن الإصلاح',
    duty: '850 kW Mechanical Driver',
    tempIn: '380.0 °C',
    tempOut: '245.0 °C',
    pressIn: '39.0 kg/cm²G',
    pressOut: '3.0 kg/cm²G',
    descAr: 'يعمل ببخار S-39 متوسط الضغط ويخرج عادمه مباشرة إلى مجمع البخار S-3 المنخفض جداً.',
    x: 480,
    y: 770,
    w: 60,
    h: 40
  },
  'V-103': {
    tag: 'V-103',
    name: 'Deaerator Vessel Steam User',
    nameAr: 'وعاء نزع الغازات ومسخن مياه التغذية V-103',
    duty: '20.0 t/h Low Pressure Steam Consumption',
    tempIn: '245.0 °C',
    tempOut: '125.0 °C',
    pressIn: '3.0 kg/cm²G',
    pressOut: '1.4 kg/cm²G',
    descAr: 'يستهلك البخار من مجمع S-3 (3 كغم/سم²) لغلي مياه التغذية عند 125°C وطرد الأكسجين وثاني أكسيد الكربون لمنع التآكل.',
    x: 580,
    y: 935,
    w: 65,
    h: 40
  },
  'E-202': {
    tag: 'E-202',
    name: 'Benfield Solution Regenerator Reboiler',
    nameAr: 'مرجل إعادة توليد محلول امتصاص ثاني أكسيد الكربون',
    duty: '8.4 x 10⁶ kcal/h',
    tempIn: '245.0 °C',
    tempOut: '125.0 °C',
    pressIn: '3.0 kg/cm²G',
    pressOut: '2.8 kg/cm²G',
    descAr: 'يستخدم بخار S-3 لتسخين وغلي محلول كربونات البوتاسيوم في برج التجريد T-202 لطرد غاز CO₂.',
    x: 655,
    y: 935,
    w: 60,
    h: 40
  }
};
