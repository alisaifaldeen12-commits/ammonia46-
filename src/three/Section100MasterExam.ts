/**
 * Master 100-Question Examination & Technical Training Bank for Section 100
 * (Gas Reforming, Shift Conversion, Steam Generation & Heat Recovery)
 * Derived strictly from Iraqi Fertilizer Complex No. 3 Operating Manual (Dwg. 6112P-100-100-00, C-2 to C-8)
 */

export interface ExamQuestion {
  id: number;
  type: 'mcq' | 'fill_blank';
  category: string;
  arabicCategory: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  technicalReference: string;
  equipmentRef: string;
}

export const SECTION_100_EXAM_QUESTIONS: ExamQuestion[] = [
  // =========================================================================
  // SECTION 1: استقبال وضغط الغاز الطبيعي (K-303, V-115, PICA-001, PICA-101) [1-10]
  // =========================================================================
  {
    id: 1,
    type: 'mcq',
    category: 'gas_reception',
    arabicCategory: 'استقبال الغاز الطبيعي والضغط',
    question: 'ما هو مدى ضغط الغاز الطبيعي الخام المجهز إلى حدود بطارية المصنع (Battery Limit)؟',
    options: [
      'من 20 إلى 39 كغم/سم² قياسي (20 to 39 Kg/cm²G)',
      'من 10 إلى 15 كغم/سم² قياسي',
      'من 50 إلى 65 كغم/سم² قياسي',
      'من 5 إلى 8 كغم/سم² قياسي'
    ],
    correctIndex: 0,
    explanation: 'يدخل الغاز الطبيعي الخام إلى حدود البطارية بضغط يتراوح بين 20 إلى 39 كغم/سم² قياسي (20 - 39 Kg/cm²G) وفق الفقرة 2.1 من دليل التشغيل.',
    technicalReference: 'دليل التشغيل - الفقرة 2.1 (صفحة C-2)',
    equipmentRef: 'v-115'
  },
  {
    id: 2,
    type: 'mcq',
    category: 'gas_reception',
    arabicCategory: 'استقبال الغاز الطبيعي والضغط',
    question: 'إلى أي قيمة ضغط يتم تخفيض الغاز الطبيعي المستخدم كتغذية للعملية (Process Feedstock) وبواسطة أي متحكم؟',
    options: [
      'إلى حوالي 19 كغم/سم² بواسطة صمام ومتحكم PICA-001',
      'إلى 3 كغم/سم² بواسطة PICA-101',
      'إلى 31 كغم/سم² بواسطة PR-103',
      'إلى 12 كغم/سم² بواسطة PIC-112'
    ],
    correctIndex: 0,
    explanation: 'يتم تخفيض ضغط الغاز الطبيعي المخصص كتغذية للعملية إلى حوالي 19 كغم/سم² بواسطة صمام السيطرة والمتحكم PICA-001 قبل دخوله إلى ضاغط الغاز الطبيعي K-303.',
    technicalReference: 'دليل التشغيل - الفقرة 2.1 ومخطط P&ID (صفحة C-2 و C-8)',
    equipmentRef: 'v-111'
  },
  {
    id: 3,
    type: 'fill_blank',
    category: 'gas_reception',
    arabicCategory: 'استقبال الغاز الطبيعي والضغط',
    question: 'يتم تخفيض ضغط غاز الوقود (Fuel Gas) بواسطة المتحكم PICA-101 إلى حوالي ______ كغم/سم² قبل توزيعه إلى مرجل الضغط العالي والفرن الأولي ومسخن الغاز.',
    options: [
      '3 كغم/سم² قياسي (3 Kg/cm²G)',
      '19 كغم/سم² قياسي',
      '1.1 كغم/سم² قياسي',
      '12 كغم/سم² قياسي'
    ],
    correctIndex: 0,
    explanation: 'يخفض المتحكم PICA-101 ضغط غاز الوقود إلى 3 كغم/سم² لتغذية شبكة وقود الأفران والمراجل (R-101, H-101, H-401, HP Boiler).',
    technicalReference: 'دليل التشغيل - الفقرة 2.1 (صفحة C-2)',
    equipmentRef: 'v-115'
  },
  {
    id: 4,
    type: 'mcq',
    category: 'gas_reception',
    arabicCategory: 'استقبال الغاز الطبيعي والضغط',
    question: 'ما هي المعدات المستلمة لغاز الوقود المخفض بضغط 3 كغم/سم² من PICA-101؟',
    options: [
      'مرجل الضغط العالي، الفرن الأولي R-101، مسخن الغاز H-101، ومسخن بدء التشغيل H-401',
      'مفاعلات إزالة الكبريت R-102AB ومفاعل التحويل R-104',
      'ضاغط غاز التخليق K-301 وضواغط الهواء K-302',
      'برج امتصاص ثاني أكسيد الكربون T-201 وخزانات الأمونيا'
    ],
    correctIndex: 0,
    explanation: 'يوزع غاز الوقود المخفض إلى High Pressure Boiler Unit, Primary Reformer (R-101), Fired Gas Heater (H-101), Start-Up Heater (H-401).',
    technicalReference: 'دليل التشغيل - الفقرة 2.1 (صفحة C-2)',
    equipmentRef: 'r-101'
  },
  {
    id: 5,
    type: 'mcq',
    category: 'gas_reception',
    arabicCategory: 'استقبال الغاز الطبيعي والضغط',
    question: 'ما هو ضغط طرد ضاغط الغاز الطبيعي K-303 عند تجهيز الغاز إلى مسخن الغاز H-101؟',
    options: [
      'حوالي 39 - 40 كغم/سم² قياسي (39 to 40 Kg/cm²G)',
      '19 كغم/سم² قياسي',
      '71 كغم/سم² قياسي',
      '12 كغم/سم² قياسي'
    ],
    correctIndex: 0,
    explanation: 'يرفع ضاغط الغاز الطبيعي K-303 ضغط الغاز من 19 كغم/سم² عند السحب إلى حوالي 39 - 40 كغم/سم² عند الطرد للتغلب على هبوط الضغط عبر منظومة إزالة الكبريت والإصلاح.',
    technicalReference: 'مخطط التدفق ودرجات الحرارة (صفحة C-8)',
    equipmentRef: 'k-303'
  },
  {
    id: 6,
    type: 'fill_blank',
    category: 'gas_reception',
    arabicCategory: 'استقبال الغاز الطبيعي والضغط',
    question: 'وعاء الفصل والسحب الموجود قبل ضاغط الغاز الطبيعي K-303 هو ______ ويستقبل الغاز بضغط 19 كغم/سم².',
    options: [
      'V-111 (Suction Knockout Drum)',
      'V-115 (Feed Filter Separator)',
      'V-101 (Condensate Drum)',
      'V-102 (Steam Drum)'
    ],
    correctIndex: 0,
    explanation: 'الوعاء V-111 هو عازل سحب ضاغط الغاز الطبيعي، ويعمل على حماية كباس K-303 من أي سوائل أو رطوبة متكاثفة.',
    technicalReference: 'مخطط التدفق اليدوي PFD (صفحة C-8)',
    equipmentRef: 'v-111'
  },
  {
    id: 7,
    type: 'mcq',
    category: 'gas_reception',
    arabicCategory: 'استقبال الغاز الطبيعي والضغط',
    question: 'ما هو الهدف الأساسي من وحدة إعداد غاز التخليق (Synthesis Gas Preparation)؟',
    options: [
      'إنتاج غاز مناسب لتصنيع الأمونيا بنسبة هيدروجين إلى نيتروجين 3:1 مع أقل حد ممكن من الميثان المتبقي',
      'إنتاج غاز الميثان النقي بنسبة 99% لتصديره',
      'فصل النيتروجين عن الهواء وتخزينه كغاز خامل فقط',
      'توليد بخار الماء المشبع بضغط 120 كغم/سم²'
    ],
    correctIndex: 0,
    explanation: 'الوظيفة الأساسية هي: Production of gas suitable for ammonia production, with a hydrogen to nitrogen ratio of 3 to 1, with a minimum of residual methane.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2 (صفحة C-2)',
    equipmentRef: 'r-103'
  },
  {
    id: 8,
    type: 'mcq',
    category: 'gas_reception',
    arabicCategory: 'استقبال الغاز الطبيعي والضغط',
    question: 'ما هي المركبات الكبريتية الموجودة عادة في تيار الغاز الطبيعي المغذي؟',
    options: [
      'كبريتيد الهيدروجين (H2S) والميركابتانات (Mercaptans)',
      'حامض الكبريتيك وثاني أكسيد الكبريت فقط',
      'الكبريت العنصري الصلب فقط',
      'كبريتات الصوديوم والجبس'
    ],
    correctIndex: 0,
    explanation: 'يحتوي الغاز الطبيعي الخام على مركبات الكبريت على شكل كبريتيد الهيدروجين (H2S) والمركبتانات العضوية (R-SH).',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.a (صفحة C-2)',
    equipmentRef: 'r-102ab'
  },
  {
    id: 9,
    type: 'mcq',
    category: 'gas_reception',
    arabicCategory: 'استقبال الغاز الطبيعي والضغط',
    question: 'لماذا يعتبر وجود مركبات الكبريت خطراً جسيماً على وحدة إنتاج الأمونيا؟',
    options: [
      'لأن الكبريت حتى بتركيز أجزاء بالمليون (ppm) يعتبر سماً قاتلاً لعوامل مساعدة المصلح الأولي والثانوي ومحول CO',
      'لأنه يسبب تآكل خطوط البخار فقط',
      'لأنه يزيد من سرعة احتراق الغاز في الفرن بشكل مفرط',
      'لأنه يؤدي إلى انخفاض ضغط الضاغط K-303'
    ],
    correctIndex: 0,
    explanation: 'مركبات الكبريت حتى لو كانت بضعة أجزاء في المليون (ppm) تسمم العامل المساعد في Primary Reformer و Secondary Reformer و Secondary CO Converter وتفقده الفعالية.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.a (صفحة C-2)',
    equipmentRef: 'r-102ab'
  },
  {
    id: 10,
    type: 'fill_blank',
    category: 'gas_reception',
    arabicCategory: 'استقبال الغاز الطبيعي والضغط',
    question: 'وعاء التصفية الأولي للغاز الطبيعي عند مدخل المصنع هو ______ والذي يستقبل الغاز بضغط 45 كغم/سم².',
    options: [
      'V-115 (Raw Gas Knockout / Filter)',
      'V-101',
      'V-109',
      'V-401'
    ],
    correctIndex: 0,
    explanation: 'الوعاء V-115 هو وعاء استلام وتصفية الغاز الطبيعي الخام عند مدخل حدود البطارية قبل صمام التخفيض PIC-001.',
    technicalReference: 'مخطط PFD اليدوي المرفق (صفحة C-8)',
    equipmentRef: 'v-115'
  },

  // =========================================================================
  // SECTION 2: إزالة الكبريت وهدرجة المركبات (H-101, R-102AB, TIC-102) [11-20]
  // =========================================================================
  {
    id: 11,
    type: 'mcq',
    category: 'desulfurization',
    arabicCategory: 'إزالة الكبريت والهدرجة',
    question: 'من أين يتم تدوير الهيدروجين المطلوب لعملية الهدرجة الحفزية قبل إدخال الغاز لمسخن H-101؟',
    options: [
      'من ضاغط غاز التخليق K-301 (Syn Gas Compressor)',
      'من ضاغط الهواء K-302',
      'من مروحة السحب K-101A',
      'من مستودعات الأمونيا السائلة'
    ],
    correctIndex: 0,
    explanation: 'يتم تدوير الهيدروجين المطلوب لعملية الهدرجة من ضاغط غاز التخليق K-301 ويخلط مع الغاز الطبيعي قبل H-101.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.a (صفحة C-3)',
    equipmentRef: 'h-101'
  },
  {
    id: 12,
    type: 'mcq',
    category: 'desulfurization',
    arabicCategory: 'إزالة الكبريت والهدرجة',
    question: 'إلى أي درجة حرارة يتم تسخين الغاز الطبيعي المخلوط بالهيدروجين في مسخن الغاز H-101؟',
    options: [
      'تصل إلى 380°C - 400°C',
      'إلى 520°C',
      'إلى 120°C',
      'إلى 795°C'
    ],
    correctIndex: 0,
    explanation: 'يسخن الغاز الطبيعي في المسخن المباشر H-101 إلى 380°C (وتصل إلى 400°C في دليل التشغيل) لتأمين طاقة التنشيط للعامل المساعد.',
    technicalReference: 'دليل التشغيل ومخطط PFD (صفحة C-3 و C-8)',
    equipmentRef: 'h-101'
  },
  {
    id: 13,
    type: 'fill_blank',
    category: 'desulfurization',
    arabicCategory: 'إزالة الكبريت والهدرجة',
    question: 'يتم التحكم بدرجة حرارة دخول الغاز إلى مفاعلات إزالة الكبريت R-102AB بواسطة متحكم الحرارة ______ .',
    options: [
      'TIC-102',
      'FRCA-103',
      'PIC-106',
      'TR-101'
    ],
    correctIndex: 0,
    explanation: 'The inlet temperature of the Sulfur Removal Vessel is controlled by TIC-102.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.a (صفحة C-3)',
    equipmentRef: 'r-102ab'
  },
  {
    id: 14,
    type: 'mcq',
    category: 'desulfurization',
    arabicCategory: 'إزالة الكبريت والهدرجة',
    question: 'ما هو الحد الأقصى لمحتوى الكبريت المسموح به في الغاز الخارج من مفاعلات إزالة الكبريت R-102AB؟',
    options: [
      'أقل من 0.2 جزء بالمليون وزناً (below 0.2 ppm by weight)',
      'أقل من 5 ppm',
      'أقل من 2.8%',
      'أقل من 0.33%'
    ],
    correctIndex: 0,
    explanation: 'ينخفض محتوى الكبريت بعد مروره بالعامل المساعد للهدرجة وامتصاص الكبريت في R-102AB إلى ما دون 0.2 ppm وزناً.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.a (صفحة C-3)',
    equipmentRef: 'r-102ab'
  },
  {
    id: 15,
    type: 'mcq',
    category: 'desulfurization',
    arabicCategory: 'إزالة الكبريت والهدرجة',
    question: 'ما نوعا العامل المساعد الموجودان داخل مفاعل إزالة الكبريت R-102AB؟',
    options: [
      'عامل مساعد هدرجة (Co-Mo) في الطبقة العلوية وعامل امتصاص كبريت (أكسيد الزنك ZnO) في الطبقة السفلية',
      'عامل مساعد نيكل وعامل مساعد حديد-كروم',
      'عامل مساعد نحاس-خارصين وفحم منشط',
      'حبيبات رملية وسيليكا جل'
    ],
    correctIndex: 0,
    explanation: 'تتم هدرجة المركبتانات إلى H2S على عامل Co-Mo، ثم يمتص H2S بواسطة حبيبات أكسيد الخارصين ZnO ليتكون كبريتيد الخارصين ZnS.',
    technicalReference: 'دليل التشغيل ومواصفات R-102AB (صفحة C-3)',
    equipmentRef: 'r-102ab'
  },
  {
    id: 16,
    type: 'mcq',
    category: 'desulfurization',
    arabicCategory: 'إزالة الكبريت والهدرجة',
    question: 'ما هي المعادلة الكيميائية الرئيسية لامتصاص كبريتيد الهيدروجين بواسطة أكسيد الخارصين في R-102AB؟',
    options: [
      'H2S + ZnO → ZnS + H2O',
      'H2S + Fe → FeS + H2',
      'SO2 + 2H2 → S + 2H2O',
      'CH4 + H2S → CS2 + 3H2'
    ],
    correctIndex: 0,
    explanation: 'يتفاعل كبريتيد الهيدروجين مع أكسيد الزنك في تفاعل كيميائي غير استرجاعي منتجاً كبريتيد الزنك الصلب والماء: H2S + ZnO -> ZnS + H2O.',
    technicalReference: 'الأساس النظري لإزالة الكبريت - قسم 100',
    equipmentRef: 'r-102ab'
  },
  {
    id: 17,
    type: 'fill_blank',
    category: 'desulfurization',
    arabicCategory: 'إزالة الكبريت والهدرجة',
    question: 'يخرج الغاز الطبيعي منزوع الكبريت من وعاء R-102AB عند درجة حرارة حوالي ______ مئوية متجهاً إلى صمام التحكم FCV-105.',
    options: [
      '385°C (أو 380°C)',
      '520°C',
      '795°C',
      '215°C'
    ],
    correctIndex: 0,
    explanation: 'The desulfurized natural gas leaving the Sulfur Removal Vessel flows at a temperature of about 385°C through the flow control valve FCV-105.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-3)',
    equipmentRef: 'r-102ab'
  },
  {
    id: 18,
    type: 'mcq',
    category: 'desulfurization',
    arabicCategory: 'إزالة الكبريت والهدرجة',
    question: 'ما هو الصمام المتحكم بتدفق الغاز الطبيعي منزوع الكبريت الداخل إلى محطة الخلط مع البخار؟',
    options: [
      'FCV-105 (مع متحكم FRCA-105)',
      'FCV-103',
      'PCV-101',
      'HCV-201'
    ],
    correctIndex: 0,
    explanation: 'يمر الغاز الطبيعي منزوع الكبريت عبر صمام السيطرة FCV-105.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-3)',
    equipmentRef: 'e-101'
  },
  {
    id: 19,
    type: 'mcq',
    category: 'desulfurization',
    arabicCategory: 'إزالة الكبريت والهدرجة',
    question: 'ما هو صمام ومتحكم نسبة حقن الهيدروجين المدوّر إلى تيار الغاز الطبيعي في مخطط PFD؟',
    options: [
      'HC-103 / FRC-103 للغاز',
      'PIC-106',
      'TIC-156',
      'PIC-102'
    ],
    correctIndex: 0,
    explanation: 'يتم ضبط حقن الهيدروجين المدوّر بنسبة محددة بواسطة محطة وصمام التحكم HC-103 / FRC-103.',
    technicalReference: 'مخطط PFD اليدوي المرفق (صفحة C-8)',
    equipmentRef: 'r-102ab'
  },
  {
    id: 20,
    type: 'fill_blank',
    category: 'desulfurization',
    arabicCategory: 'إزالة الكبريت والهدرجة',
    question: 'إذا انخفضت درجة حرارة الغاز في H-101 دون 350°C، فإن الخطر التشغيلي الأكبر هو ______ .',
    options: [
      'عدم اكتمال تفاعل الهدرجة وعبور الكبريت مسبباً تسمم عامل النيكل المساعد في الفرن الأولي R-101',
      'انفجار أنابيب المسخن H-101 فوراً',
      'تجمد الغاز الطبيعي داخل الأنابيب',
      'تضاعف إنتاج الأمونيا في قسم 400'
    ],
    correctIndex: 0,
    explanation: 'انخفاض الحرارة دون نافذة التنشيط (350-400°C) يمنع تفاعل هدرجة الكبريت العضوي مما يؤدي إلى هروب الكبريت (Sulfur Slip) وتسمم محفز الفرن الأولي.',
    technicalReference: 'دليل التشغيل - حساسية العامل المساعد (صفحة C-2 و C-3)',
    equipmentRef: 'h-101'
  },

  // =========================================================================
  // SECTION 3: خلط البخار مع اللقيم والنسبة S/C ومسخن E-101 [21-30]
  // =========================================================================
  {
    id: 21,
    type: 'mcq',
    category: 'steam_mixing',
    arabicCategory: 'خلط البخار وغاز التغذية ومسخن E-101',
    question: 'ما هي درجة حرارة البخار المحمص (Superheated Steam) الذي يخلط مع الغاز الطبيعي منزوع الكبريت؟',
    options: [
      '380°C',
      '520°C',
      '190°C',
      '125°C'
    ],
    correctIndex: 0,
    explanation: 'The gas is mixed with superheated steam of 380°C.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-3)',
    equipmentRef: 'e-101'
  },
  {
    id: 22,
    type: 'mcq',
    category: 'steam_mixing',
    arabicCategory: 'خلط البخار وغاز التغذية ومسخن E-101',
    question: 'ما هو المتحكم المنظم لجريان البخار المحمص المضاف للغاز الطبيعي؟',
    options: [
      'FRCA-103',
      'FRCA-107',
      'PICA-001',
      'TIC-102'
    ],
    correctIndex: 0,
    explanation: 'The steam flow is regulated by the flow controller FRCA-103.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-3)',
    equipmentRef: 'e-101'
  },
  {
    id: 23,
    type: 'fill_blank',
    category: 'steam_mixing',
    arabicCategory: 'خلط البخار وغاز التغذية ومسخن E-101',
    question: 'عند بدء التشغيل والتشغيل الجزئي، يتم توفير مؤشرات الجريان ذات المدى المنخفض وهما: FI-HC-106 و ______ .',
    options: [
      'FI-HC-104',
      'FI-HC-108',
      'FI-HC-201',
      'FI-HC-101'
    ],
    correctIndex: 0,
    explanation: 'For start-up and partial load operation, the low range indicators FI-HC-106 and FI-HC-104 are provided.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-3)',
    equipmentRef: 'e-101'
  },
  {
    id: 24,
    type: 'mcq',
    category: 'steam_mixing',
    arabicCategory: 'خلط البخار وغاز التغذية ومسخن E-101',
    question: 'ما هو ضغط خليط البخار والغاز (Steam/Gas Mixture) عند تدفقه إلى المسخن الأولي E-101؟',
    options: [
      '36 كغم/سم² قياسي (36 Kg/cm²G)',
      '19 كغم/سم² قياسي',
      '71 كغم/سم² قياسي',
      '1.1 كغم/سم² قياسي'
    ],
    correctIndex: 0,
    explanation: 'The steam/gas mixture at a pressure of 36 Kg/cm²G flows to the Steam Natural Gas Preheater (E-101).',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-3)',
    equipmentRef: 'e-101'
  },
  {
    id: 25,
    type: 'mcq',
    category: 'steam_mixing',
    arabicCategory: 'خلط البخار وغاز التغذية ومسخن E-101',
    question: 'إلى أي درجة حرارة يتم تسخين خليط البخار والغاز في المسخن E-101 بواسطة غازات العادم؟ وبأي جهاز تسجل؟',
    options: [
      'إلى 520°C (وتسجل بواسطة TRA-121-3)',
      'إلى 795°C (وتسجل بواسطة TR-101)',
      'إلى 380°C (وتسجل بواسطة TIC-102)',
      'إلى 1030°C (وتسجل بواسطة TRA-101-8)'
    ],
    correctIndex: 0,
    explanation: 'The mixture is heated by the flue gas from the Primary Reformer to 520°C, recorded by TRA-121-3 (وتظهر 500°C في بعض المخططات الميدانية).',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b ومخطط PFD (صفحة C-3 و C-8)',
    equipmentRef: 'e-101'
  },
  {
    id: 26,
    type: 'fill_blank',
    category: 'steam_mixing',
    arabicCategory: 'خلط البخار وغاز التغذية ومسخن E-101',
    question: 'أين يقع المبادل المسخن لخليط الغاز والبخار E-101 في هيكل المصنع؟',
    options: [
      'في قسم استرجاع الحرارة المهدرة لمنطقة الحمل الحراري (Waste Heat Recovery Convection Section)',
      'داخل حجرة الإشعاع لفرن R-101 بجانب المشاعل',
      'فوق طبلة البخار V-102A مباشرة',
      'بجانب ضاغط الهواء K-302'
    ],
    correctIndex: 0,
    explanation: 'يقع E-101 في الجزء العلوي من منطقة الحمل الحراري (Convection Section) مستفيداً من الحرارة المحسوسة لغازات الاحتراق الخارجة من R-101.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-3 و C-5)',
    equipmentRef: 'e-101'
  },
  {
    id: 27,
    type: 'mcq',
    category: 'steam_mixing',
    arabicCategory: 'خلط البخار وغاز التغذية ومسخن E-101',
    question: 'ما هي نسبة البخار إلى الكربون (Steam-to-Carbon Ratio - S/C) التصميمية المعتمدة لخليط التغذية؟',
    options: [
      'حوالي 3.0 إلى 3.5 مول بخار لكل مول كربون',
      '1.0 مول بخار لكل مول كربون',
      '0.5 مول بخار لكل مول كربون',
      '7.0 مول بخار لكل مول كربون'
    ],
    correctIndex: 0,
    explanation: 'تبلغ نسبة البخار إلى الكربون التصميمية حوالي 3.0 - 3.3 لضمان دفع تفاعل الإصلاح للأمام ومنع تشكل الكربون والترسبات على العامل المساعد.',
    technicalReference: 'مواصفات تشغيل الفرن الأولي - قسم 100',
    equipmentRef: 'e-101'
  },
  {
    id: 28,
    type: 'mcq',
    category: 'steam_mixing',
    arabicCategory: 'خلط البخار وغاز التغذية ومسخن E-101',
    question: 'ماذا يحدث إذا انخفضت نسبة البخار إلى الكربون (S/C) عن الحد الأدنى المسموح به؟',
    options: [
      'يحدث ترسب كربوني شديد (Coking) على عامل النيكل المساعد، مما يسبب بقعاً ساخنة (Hot Spots) وتلف الأنابيب',
      'يتوقف احتراق المشاعل في الفرن فوراً',
      'يزداد تركيز الأكسجين في غازات العادم',
      'تنخفض درجة حرارة غازات العادم إلى الصفر'
    ],
    correctIndex: 0,
    explanation: 'نقص البخار يؤدي إلى تفكك الميثان والتكسير الحراري وترسب الكربون الصلب (Coking) الذي يسد مسامات العامل المساعد ويسخن جدران الأنابيب حتى الانفجار.',
    technicalReference: 'دليل التشغيل - إنذارات انخفاض الجريان (صفحة C-3)',
    equipmentRef: 'r-101'
  },
  {
    id: 29,
    type: 'fill_blank',
    category: 'steam_mixing',
    arabicCategory: 'خلط البخار وغاز التغذية ومسخن E-101',
    question: 'كلا متحكمي تدفق الغاز والبخار (FRCA-105 و FRCA-103) مزودان بإنذارات ______ (Low Flow Alarms).',
    options: [
      'انخفاض معدل الجريان (Low Flow Alarms)',
      'ارتفاع الضغط التفاضلي',
      'ارتفاع نسبة الكبريت',
      'انخفاض مستوى الزيت'
    ],
    correctIndex: 0,
    explanation: 'Both flow controllers are provided with low flow alarms to prevent operating with unsafe fuel/steam ratios.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-3)',
    equipmentRef: 'e-101'
  },
  {
    id: 30,
    type: 'mcq',
    category: 'steam_mixing',
    arabicCategory: 'خلط البخار وغاز التغذية ومسخن E-101',
    question: 'كيف ينتقل خليط البخار والغاز من مسخن E-101 إلى أنابيب العامل المساعد في R-101؟',
    options: [
      'عبر مجمع التوزيع العلوي (Inlet Manifold / Arch Headers) الممتد أعلى الفرن',
      'عبر مضخات تدوير قاع الفرن',
      'من خلال قاع أنابيب الفرن متجهاً للأعلى',
      'عبر خط التحويل المبطن بالطوب الحراري'
    ],
    correctIndex: 0,
    explanation: 'From the Steam Natural Gas Preheater the steam/gas mixture passes through the inlet manifold to the catalyst tubes of the Primary Reformer.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-3)',
    equipmentRef: 'r-101'
  },

  // =========================================================================
  // SECTION 4: فرن الإصلاح الأولي R-101 ومواصفاته الدقيقة [31-45]
  // =========================================================================
  {
    id: 31,
    type: 'mcq',
    category: 'primary_reformer',
    arabicCategory: 'فرن الإصلاح الأولي R-101',
    question: 'ما هو طراز الفرن الأولي R-101 وفق التصميم المعتمد في الدليل؟',
    options: [
      'فرن من طراز توبسو بصندوق سحب مستحث (Topsoe type furnace, induced draft box heater)',
      'فرن كلوغ أسطواني بحرق قاعي (Kellogg cylindrical bottom-fired)',
      'فرن إشعاعي بقبة علوية فقط',
      'غلاية كهربائية ذات أنابيب ماء'
    ],
    correctIndex: 0,
    explanation: 'The Primary Reformer is the Topsoe type furnace which is an induced draft box heater.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-3)',
    equipmentRef: 'r-101'
  },
  {
    id: 32,
    type: 'mcq',
    category: 'primary_reformer',
    arabicCategory: 'فرن الإصلاح الأولي R-101',
    question: 'كم يبلغ العدد الكلي لأنابيب العامل المساعد داخل الفرن الأولي R-101 وكيف تم توزيعها؟',
    options: [
      '200 أنبوب محشو بالعامل المساعد مثبتة عمودياً في حجرتي احتراق منفصلتين (100 أنبوب في كل حجرة)',
      '50 أنبوباً فقط في حجرة واحدة',
      '480 أنبوباً موزعة أفقياً',
      '1000 أنبوب شعري دقيق'
    ],
    correctIndex: 0,
    explanation: 'Having 200 catalyst filled tubes vertically installed in two separate chambers (100 tubes in each chamber).',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-3)',
    equipmentRef: 'r-101'
  },
  {
    id: 33,
    type: 'fill_blank',
    category: 'primary_reformer',
    arabicCategory: 'فرن الإصلاح الأولي R-101',
    question: 'يتم تسخين أنابيب الفرن الأولي بواسطة مشاعل جدارية إشعاعية مثبتة في ______ صفوف أفقية على الجدران الرأسية الطولية.',
    options: [
      'ستة صفوف أفقية (6 horizontal rows)',
      'صفين أفقيين فقط',
      'عشرة صفوف أفقية',
      'أربعة صفوف رأسية'
    ],
    correctIndex: 0,
    explanation: 'Radiant type wall burners mounted equidistantly in six horizontal rows in the two vertical and longitudinal walls of each chamber.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-4)',
    equipmentRef: 'r-101'
  },
  {
    id: 34,
    type: 'mcq',
    category: 'primary_reformer',
    arabicCategory: 'فرن الإصلاح الأولي R-101',
    question: 'كيف تسحب مشاعل الفرن الأولي الجدارية هواء الاحتراق؟',
    options: [
      'هي مشاعل ذاتية السحب للهواء الجوي المحيط (Self-aspiring ambient air)',
      'تستلم هواء مضغوطاً بضغط 30 كغم/سم² من ضاغط K-302',
      'تعمل بحقن الأكسجين النقي بنسبة 100%',
      'تعتمد على بخار الماء بدلاً من الهواء'
    ],
    correctIndex: 0,
    explanation: 'The wall burners are fed with natural gas and they are self-aspiring ambient air for the combustion.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-4)',
    equipmentRef: 'r-101'
  },
  {
    id: 35,
    type: 'mcq',
    category: 'primary_reformer',
    arabicCategory: 'فرن الإصلاح الأولي R-101',
    question: 'ما هي المتحكمات المسؤولة عن تنظيم تدفق غاز الوقود إلى مشاعل R-101؟',
    options: [
      'PIC-106 و PIC-115 و PIC-117',
      'TIC-102 و FCV-105',
      'FRCA-107 و PdR-104',
      'PR-103 و TR-101'
    ],
    correctIndex: 0,
    explanation: 'The flow of fuel gas to the burners is regulated by PIC-106, PIC-115, PIC-117.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-4)',
    equipmentRef: 'r-101'
  },
  {
    id: 36,
    type: 'fill_blank',
    category: 'primary_reformer',
    arabicCategory: 'فرن الإصلاح الأولي R-101',
    question: 'يتم تغذية الصفين السفليين من المشاعل بخط غاز وقود منفصل من أجل ______ عند توقف الفرن (Tripped).',
    options: [
      'الحفاظ على إشعال جزئي (Maintain a partial firing of Primary Reformer)',
      'إطفاء الفرن بالكامل خلال ثانية واحدة',
      'غسل الأنابيب بالنيتروجين',
      'زيادة الضغط إلى 100 كغم/سم²'
    ],
    correctIndex: 0,
    explanation: 'The two lower rows of burners are fed by a separate fuel gas line in order to maintain a partial firing of the Primary Reformer, when the Reformer is tripped.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-4)',
    equipmentRef: 'r-101'
  },
  {
    id: 37,
    type: 'mcq',
    category: 'primary_reformer',
    arabicCategory: 'فرن الإصلاح الأولي R-101',
    question: 'كم يبلغ ضغط غاز الوقود عند مشاعل الفرن الأولي في الظروف التشغيلية الطبيعية؟',
    options: [
      'حوالي 1.1 كغم/سم² قياسي (about 1.1 Kg/cm²G)',
      '39 كغم/سم² قياسي',
      '19 كغم/سم² قياسي',
      '6 كغم/سم² قياسي'
    ],
    correctIndex: 0,
    explanation: 'At normal operation, the fuel gas pressure at the burners will be about 1.1 Kg/cm²G.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-4)',
    equipmentRef: 'r-101'
  },
  {
    id: 38,
    type: 'mcq',
    category: 'primary_reformer',
    arabicCategory: 'فرن الإصلاح الأولي R-101',
    question: 'لماذا يكون ارتفاع درجة حرارة الغاز داخل أنابيب العامل المساعد بطيئاً وتدريجياً؟',
    options: [
      'لأن معظم الحرارة يمتصها التفاعل الماص للحرارة الشديد بين الهيدروكربون والبخار',
      'بسبب رداءة التوصيل الحراري لجدران الأنابيب',
      'بسبب برودة غازات العادم في حجرة الاحتراق',
      'لأن التفاعل طارد للحرارة ويولد برودة ذاتية'
    ],
    correctIndex: 0,
    explanation: 'As most of the heat will be absorbed by the endothermic reaction between hydrocarbon and steam producing hydrogen, carbon monoxide, and carbon dioxide.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-4)',
    equipmentRef: 'r-101'
  },
  {
    id: 39,
    type: 'mcq',
    category: 'primary_reformer',
    arabicCategory: 'فرن الإصلاح الأولي R-101',
    question: 'ما هو ضغط ودرجة حرارة غاز العمليات عند خروجه من قاع أنابيب الفرن الأولي R-101؟',
    options: [
      'ضغط 31 كغم/سم² ودرجة حرارة 795°C (أو 750°C في بعض قراءات المخطط)',
      'ضغط 39 كغم/سم² وحرارة 520°C',
      'ضغط 19 كغم/سم² وحرارة 380°C',
      'ضغط 71 كغم/سم² وحرارة 969°C'
    ],
    correctIndex: 0,
    explanation: 'The process gas leaving the tubes will be at a pressure of 31 Kg/cm²G and a temperature of 795°C (وتظهر 750°C في قراءات المخطط الميداني).',
    technicalReference: 'دليل التشغيل ومخطط PFD (صفحة C-4 و C-8)',
    equipmentRef: 'r-101'
  },
  {
    id: 40,
    type: 'fill_blank',
    category: 'primary_reformer',
    arabicCategory: 'فرن الإصلاح الأولي R-101',
    question: 'تبلغ نسبة الميثان المتبقي (Residual Methane) في الغاز الخارج من R-101 على الأساس الجاف حوالي ______ بالحجم.',
    options: [
      '9.86% بالحجم (9.86% by volume on dry basis)',
      '0.3% بالحجم',
      '0.2 ppm',
      '25% بالحجم'
    ],
    correctIndex: 0,
    explanation: 'The residual methane content on dry basis will be 9.86% by volume, while other hydrocarbons are practically nil.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-4)',
    equipmentRef: 'r-101'
  },
  {
    id: 41,
    type: 'mcq',
    category: 'primary_reformer',
    arabicCategory: 'فرن الإصلاح الأولي R-101',
    question: 'كم عدد مجمعات الخروج (Outlet Collectors) المزودة لكل حجرة احتراق في R-101؟ وبأي جهاز تسجل درجات حرارتها؟',
    options: [
      'خمسة مجمعات لكل حجرة، وتسجل بواحد من TR-101 (من 1 إلى 5)',
      'مجمع واحد فقط لكل الفرن ويسجل بـ TIC-102',
      'عشرة مجمعات وتسجل بـ TRA-101-8',
      'ثمانية مجمعات وتسجل بـ PdR-104'
    ],
    correctIndex: 0,
    explanation: 'From the outlet collectors - five collectors are provided for each chamber - the temperatures are recorded by TR-101 (1 to 5).',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-4 و C-5)',
    equipmentRef: 'r-101'
  },
  {
    id: 42,
    type: 'mcq',
    category: 'primary_reformer',
    arabicCategory: 'فرن الإصلاح الأولي R-101',
    question: 'ما هما الجهازان اللذان يقيسان الضغط التفاضلي عبر أنابيب الفرن وضغط الدخول؟',
    options: [
      'الضغط التفاضلي يسجل على PdR-104، وضغط الدخول على PR-103',
      'الضغط التفاضلي على PICA-001 وضغط الدخول على PICA-101',
      'الضغط التفاضلي على PIC-106 وضغط الدخول على PIC-115',
      'كلاهما على جهاز TR-101'
    ],
    correctIndex: 0,
    explanation: 'The differential pressure across the reformer tubes is indicated on PdR-104, and the inlet pressure is recorded by PR-103.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-4)',
    equipmentRef: 'r-101'
  },
  {
    id: 43,
    type: 'fill_blank',
    category: 'primary_reformer',
    arabicCategory: 'فرن الإصلاح الأولي R-101',
    question: 'يتدفق غاز العمليات من مجمعات الخروج إلى المصلح الثانوي R-103 عبر خط التحويل المبطن بـ ______ (Bricklined Transfer Line).',
    options: [
      'الطوب الحراري المقاوم (Bricklined Refractory)',
      'طبقة من المطاط المقوى',
      'أنابيب الرصاص العازل',
      'ألياف الكربون البلاستيكية'
    ],
    correctIndex: 0,
    explanation: 'The process gas flows through the bricklined transfer line to the Secondary Reformer to withstand ~800°C temperatures.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-5)',
    equipmentRef: 'r-101'
  },
  {
    id: 44,
    type: 'mcq',
    category: 'primary_reformer',
    arabicCategory: 'فرن الإصلاح الأولي R-101',
    question: 'ما هو جهاز تسجيل حرارة الغاز في خط النقل الساخن المزود بإنذار ارتفاع الحرارة العالية؟',
    options: [
      'TRA-101-6 (مزود بإنذار حرارة عالية High Temp Alarm)',
      'TIC-102',
      'TRA-121-3',
      'TRCA-106'
    ],
    correctIndex: 0,
    explanation: 'The gas temperature in the transfer line is recorded by TRA-101-6, and furthermore a high temperature alarm is installed.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-5)',
    equipmentRef: 'r-101'
  },
  {
    id: 45,
    type: 'mcq',
    category: 'primary_reformer',
    arabicCategory: 'فرن الإصلاح الأولي R-101',
    question: 'ما هي المادة المصنعة لأنابيب العامل المساعد في فرن R-101 لمقاومة الزحف الحراري الشديد؟',
    options: [
      'سبيكة ميكرو-ألوي عالية الكروم والنيكل HK-40 / HP Microalloy الطاردة مركزياً',
      'الصلب الكربوني منخفض المقاومة A106',
      'سبائك النحاس الأصفر',
      'سبائك الألمنيوم النقي'
    ],
    correctIndex: 0,
    explanation: 'تصنع الأنابيب بالطرد المركزي من سبائك HK-40 / HP-50 المحتوية على 25% كروم و20-35% نيكل لمقاومة الزحف والإجهاد عند 900°C.',
    technicalReference: 'المواصفات المعدنية لأنابيب الفرن الأولي - قسم 100',
    equipmentRef: 'r-101'
  },

  // =========================================================================
  // SECTION 5: منطقة الحمل الحراري ومراوح السحب K-101AB [46-55]
  // =========================================================================
  {
    id: 46,
    type: 'mcq',
    category: 'convection_zone',
    arabicCategory: 'منطقة الحمل الحراري واسترجاع الطاقة',
    question: 'ما هي درجة حرارة غازات العادم (Flue Gas) لحظة خروجها من حجرتي الاحتراق لفرن R-101؟',
    options: [
      'حوالي 1030°C (تسجل بواسطة TRA-101-8)',
      '520°C',
      '795°C',
      '380°C'
    ],
    correctIndex: 0,
    explanation: 'The flue gas leaves the two combustion chambers of the Primary Reformer at a temperature of about 1030°C recorded by TRA-101-8.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-5)',
    equipmentRef: 'r-101'
  },
  {
    id: 47,
    type: 'mcq',
    category: 'convection_zone',
    arabicCategory: 'منطقة الحمل الحراري واسترجاع الطاقة',
    question: 'ما هي المبادلات الحرارية الستة الموجودة في قسم استرجاع الحرارة المهدرة لمنطقة الحمل الحراري؟',
    options: [
      'مسخن اللقيم E-101، مسخن هواء العملية E-102، محمصا بخار التوربين E-103AB، مرجل غاز العادم E-104، ومقتصدا ماء المراجل E-105AB',
      'غلاية E-108، غلاية E-109، مرجل E-110، ومبردات E-405/406',
      'مبادلات كاتاكارب E-201 ومسخنات الميثنة E-106/107 فقط',
      'مكثفات الأمونيا E-401 إلى E-404'
    ],
    correctIndex: 0,
    explanation: 'The waste heat recovery section contains: E-101, E-102, E-103AB, E-104, E-105AB.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-5)',
    equipmentRef: 'e-101'
  },
  {
    id: 48,
    type: 'fill_blank',
    category: 'convection_zone',
    arabicCategory: 'منطقة الحمل الحراري واسترجاع الطاقة',
    question: 'يتم التحكم بدرجة حرارة البخار المحمص (TICA-156) بواسطة مشاعل مساعدة موجودة في المنبع قبل ______ .',
    options: [
      'محمص بخار التوربين E-103AB (Turbine Steam Superheaters)',
      'مسخن اللقيم E-101',
      'مقتصد ماء المراجل E-105',
      'المدخنة ST-101'
    ],
    correctIndex: 0,
    explanation: 'The superheated steam temperature (TICA-156) is controlled by the auxiliary burners provided upstream of Turbine Steam Superheater.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-5)',
    equipmentRef: 'r-101'
  },
  {
    id: 49,
    type: 'mcq',
    category: 'convection_zone',
    arabicCategory: 'منطقة الحمل الحراري واسترجاع الطاقة',
    question: 'ما هي وظيفة مراوح السحب المستحث K-101AB داخل الفرن الأولي؟',
    options: [
      'توليد ضغط سحب أدنى قليلاً من الضغط الجوي (Draft below atmospheric) لمنع تسرب غازات الاحتراق للخارج',
      'ضخ الهواء المضغوط داخل أنابيب العامل المساعد',
      'كبس الغاز الطبيعي لرفع ضغطه إلى 40 كغم/سم²',
      'تبريد المدخنة لمنع تشقق الخرسانة'
    ],
    correctIndex: 0,
    explanation: 'Induced Draft Fans establish the draft slightly below atmospheric pressure inside the combustion chambers to ensure against leakage of flue gas to surroundings.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-5)',
    equipmentRef: 'r-101'
  },
  {
    id: 50,
    type: 'fill_blank',
    category: 'convection_zone',
    arabicCategory: 'منطقة الحمل الحراري واسترجاع الطاقة',
    question: 'يتم التحكم بضغط السحب الداخلي لمنع تسرب الغازات بواسطة المتحكم ______ .',
    options: [
      'PIC-102',
      'PIC-001',
      'PICA-101',
      'PIC-106'
    ],
    correctIndex: 0,
    explanation: 'This draft pressure ensures against leakage of flue gas to surroundings and is controlled by PIC-102.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-5)',
    equipmentRef: 'r-101'
  },
  {
    id: 51,
    type: 'mcq',
    category: 'convection_zone',
    arabicCategory: 'منطقة الحمل الحراري واسترجاع الطاقة',
    question: 'بواسطة أي جهاز تحليلي يتم قياس وتسجيل محتوى الأكسجين الحر في غازات العادم؟',
    options: [
      'AR-102 (محلل الأكسجين المستمر)',
      'TRA-101-8',
      'PdR-104',
      'TIC-102'
    ],
    correctIndex: 0,
    explanation: 'The content of oxygen in the flue gas is recorded by AR-102.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-5)',
    equipmentRef: 'r-101'
  },
  {
    id: 52,
    type: 'mcq',
    category: 'convection_zone',
    arabicCategory: 'منطقة الحمل الحراري واسترجاع الطاقة',
    question: 'كيف يتم تشغيل محركي مروحتي السحب المستحث K-101A و K-101B؟',
    options: [
      'إحداهما تدار بواسطة توربين بخاري ذي ضغط عادم خلفي (Back-pressure turbine) والأخرى بمحرك كهربائي',
      'كلاهما يدار بمحرك ديزل ضخم',
      'كلاهما يدار بمحرك كهربائي ثلاثي الطور',
      'تداران بضغط الغاز الطبيعي المضغوط'
    ],
    correctIndex: 0,
    explanation: 'One of the Induced Draft Fans is driven by a back pressure steam turbine and the other by an electric motor for dual redundancy.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.b (صفحة C-5)',
    equipmentRef: 'r-101'
  },
  {
    id: 53,
    type: 'mcq',
    category: 'convection_zone',
    arabicCategory: 'منطقة الحمل الحراري واسترجاع الطاقة',
    question: 'ما هي وظيفة مقتصدي ماء تغذية المراجل E-105AB في منطقة الحمل الحراري؟',
    options: [
      'تسخين ماء تغذية المراجل (BFW) القادم من مضخات P-101 قبل دخوله طبلة البخار V-102',
      'تبريد الغاز الطبيعي قبل دخوله للمصلح',
      'تكثيف غاز الأمونيا المنتج',
      'غسل غازات العادم من الكبريت'
    ],
    correctIndex: 0,
    explanation: 'يقوم E-105AB باسترجاع الحرارة المتبقية في غازات العادم لتسخين ماء التغذية BFW لرفع كفاءة دورة البخار الحرارية.',
    technicalReference: 'دليل التشغيل - منظومة BFW (صفحة C-5)',
    equipmentRef: 'e-101'
  },
  {
    id: 54,
    type: 'fill_blank',
    category: 'convection_zone',
    arabicCategory: 'منطقة الحمل الحراري واسترجاع الطاقة',
    question: 'يتم طرد غازات العادم النهائية بعد مراوح K-101AB إلى الغلاف الجوي عبر المدخنة الخرسانية ______ بارتفاع 70 متراً.',
    options: [
      'ST-101 (Main Reformer Stack)',
      'H-101 Stack',
      'H-401 Stack',
      'Flare Stack'
    ],
    correctIndex: 0,
    explanation: 'The flue gas is exhausted by the Induced Draft Fans through stack ST-101 to the atmosphere.',
    technicalReference: 'دليل التشغيل والمخطط الإنشائي للفرن (صفحة C-5)',
    equipmentRef: 'r-101'
  },
  {
    id: 55,
    type: 'mcq',
    category: 'convection_zone',
    arabicCategory: 'منطقة الحمل الحراري واسترجاع الطاقة',
    question: 'ما هو الخطر التشغيلي إذا تحول ضغط صندوق الفرن من سالب (سحب) إلى موجب (Positive Pressure)؟',
    options: [
      'تسرب ألسنة اللهب وغازات الاحتراق السامة والحارقة إلى الخارج عبر فتحات الملاحظة وإلحاق أضرار بالهيكل والمشغلين',
      'انطفاء المشاعل فوراً',
      'زيادة كفاءة انتقال الحرارة',
      'توقف ضاغط الهواء K-302'
    ],
    correctIndex: 0,
    explanation: 'الضغط الموجب يطرد الغازات الساخنة واللهب من فتحات الفرن (Blow-out) مما يدمر عوازل الجدران ويهدد سلامة المشغلين، ولذلك يضبط PIC-102 سحباً سالباً خفيفاً.',
    technicalReference: 'دليل التشغيل - السيطرة على ضغط الفرن (صفحة C-5)',
    equipmentRef: 'r-101'
  },

  // =========================================================================
  // SECTION 6: ضاغط الهواء K-302 والمصلح الثانوي R-103 [56-70]
  // =========================================================================
  {
    id: 56,
    type: 'mcq',
    category: 'secondary_reformer',
    arabicCategory: 'ضاغط الهواء والمصلح الثانوي R-103',
    question: 'إلى أي درجة حرارة يتم تسخين هواء العملية المضغوط في المسخن E-102 قبل دخوله إلى R-103؟',
    options: [
      '550°C (تسجل بواسطة TRA-121-4)',
      '380°C',
      '795°C',
      '1150°C'
    ],
    correctIndex: 0,
    explanation: 'While the air coming from Process Air Compressor (K-302) passes E-102, the air is preheated to 550°C, recorded by TRA-121-4.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.c (صفحة C-6)',
    equipmentRef: 'r-103'
  },
  {
    id: 57,
    type: 'mcq',
    category: 'secondary_reformer',
    arabicCategory: 'ضاغط الهواء والمصلح الثانوي R-103',
    question: 'كيف يدخل الهواء المسخن إلى قمة المصلح الثانوي R-103؟',
    options: [
      'عبر مشعل مصمم خصيصاً (Specially designed burner) يضمن الخلط التام مع غاز العمليات',
      'عبر مروحة سحب سفلية',
      'من خلال فتحات جانبية أسفل طبقة العامل المساعد',
      'عبر رشاشات مائية محيطية'
    ],
    correctIndex: 0,
    explanation: 'The preheated air enters the top of the Secondary Reformer through a specially designed burner which ensures a thorough mixing with the process gas.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.c (صفحة C-6)',
    equipmentRef: 'r-103'
  },
  {
    id: 58,
    type: 'fill_blank',
    category: 'secondary_reformer',
    arabicCategory: 'ضاغط الهواء والمصلح الثانوي R-103',
    question: 'يؤدي تفاعل الاحتراق الجزئي بين الأكسجين وغاز العمليات في قمة R-103 إلى رفع درجة الحرارة فورياً إلى حوالي ______ مئوية.',
    options: [
      'من 1100°C إلى 1150°C',
      'من 500°C إلى 600°C',
      'من 750°C إلى 800°C',
      'أكثر من 2000°C'
    ],
    correctIndex: 0,
    explanation: 'The process gas and air react in a partial combustion, thereby raising the temperature to approximately 1100 - 1150°C.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.c (صفحة C-6)',
    equipmentRef: 'r-103'
  },
  {
    id: 59,
    type: 'mcq',
    category: 'secondary_reformer',
    arabicCategory: 'ضاغط الهواء والمصلح الثانوي R-103',
    question: 'ما هو الأساس الذي يتحدد بناءً عليه معدل تدفق هواء العملية الدقيق المضخ إلى R-103؟ وبأي متحكم يتم ضبطه؟',
    options: [
      'النسبة المطلوبة 3 إلى 1 بين الهيدروجين والنيتروجين في غاز التغذية لتخليق الأمونيا، ويضبط بواسطة FRCA-107',
      'نسبة الميثان في الغاز الطبيعي الخام بواسطة PIC-101',
      'مستوى الماء في طبلة البخار V-102 بواسطة LIC-102',
      'درجة حرارة مياه التبريد في E-404'
    ],
    correctIndex: 0,
    explanation: 'The exact air flow rate will principally be determined from the required 3 to 1 hydrogen-nitrogen ratio in ammonia synthesis feed gas, controlled by FRCA-107.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.c (صفحة C-6)',
    equipmentRef: 'r-103'
  },
  {
    id: 60,
    type: 'mcq',
    category: 'secondary_reformer',
    arabicCategory: 'ضاغط الهواء والمصلح الثانوي R-103',
    question: 'ما هو اتجاه جريان خليط الغاز عبر طبقة العامل المساعد في المصلح الثانوي R-103؟',
    options: [
      'يتدفق إلى الأسفل (Flows downwards through the catalyst bed)',
      'يتدفق إلى الأعلى من القاع إلى القمة',
      'يدور أفقياً بحركة حلزونية صاعدة',
      'يدخل من الجوانب باتجاه المركز فقط'
    ],
    correctIndex: 0,
    explanation: 'The resulting gas mixture flows downwards through the catalyst bed containing reforming catalyst where the reforming takes place.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.c (صفحة C-6)',
    equipmentRef: 'r-103'
  },
  {
    id: 61,
    type: 'mcq',
    category: 'secondary_reformer',
    arabicCategory: 'ضاغط الهواء والمصلح الثانوي R-103',
    question: 'ما هي درجة الحرارة والضغط ومحتوى الميثان المتبقي للغاز بعد مروره بطبقة العامل المساعد في R-103؟',
    options: [
      'حرارة 969°C (أو 900°C في المخطط)، ضغط 30 كغم/سم²، وميثان متبقي 0.3% بالحجم على الأساس الجاف',
      'حرارة 1250°C، ضغط 45 كغم/سم²، وميثان 5%',
      'حرارة 550°C، ضغط 36 كغم/سم²، وميثان 9.86%',
      'حرارة 365°C، ضغط 71 كغم/سم²، وميثان 0.01%'
    ],
    correctIndex: 0,
    explanation: 'After passage of catalyst bed, temperature and pressure are 969°C and 30 Kg/cm²G, whereas methane is reduced to 0.3% by volume on dry basis (وتظهر 900°C في قراءة المخطط C-8).',
    technicalReference: 'دليل التشغيل ومخطط PFD (صفحة C-6 و C-8)',
    equipmentRef: 'r-103'
  },
  {
    id: 62,
    type: 'fill_blank',
    category: 'secondary_reformer',
    arabicCategory: 'ضاغط الهواء والمصلح الثانوي R-103',
    question: 'في طبقة العامل المساعد لـ R-103، تنخفض درجة الحرارة من 1150°C إلى 969°C بسبب ______ .',
    options: [
      'التفاعل الماص للحرارة للميثان المتبقي مع بخار الماء لإنتاج H2 و CO و CO2',
      'حقن مياه التبريد المباشرة',
      'فقدان الحرارة الشديد عبر جدران المفاعل',
      'امتصاص غاز النيتروجين للحرارة'
    ],
    correctIndex: 0,
    explanation: 'Reforming reaction (CH4 + H2O -> CO + 3H2) is highly endothermic and consumes the heat generated by the combustion zone, dropping the temp to 969°C.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.c (صفحة C-6)',
    equipmentRef: 'r-103'
  },
  {
    id: 63,
    type: 'mcq',
    category: 'secondary_reformer',
    arabicCategory: 'ضاغط الهواء والمصلح الثانوي R-103',
    question: 'ما نوع العامل المساعد المستخدم داخل مفاعل الإصلاح الثانوي R-103؟',
    options: [
      'حبيبات النيكل المساعد المحمولة على قواعد ألومينا حرارية مقاومة لدرجات الحرارة الفائقة (Ni/Al2O3)',
      'عامل مساعد حديد-كروم',
      'عامل مساعد أكسيد الخارصين',
      'بلاتين نقي'
    ],
    correctIndex: 0,
    explanation: 'يحتوي R-103 على عامل مساعد من النيكل المقاوم للحرارة الفائقة حتى 1200°C محمول على مادة ألفا ألومينا الحرارية الخاملة.',
    technicalReference: 'مواصفات حشوة المصلح الثانوي R-103',
    equipmentRef: 'r-103'
  },
  {
    id: 64,
    type: 'mcq',
    category: 'secondary_reformer',
    arabicCategory: 'ضاغط الهواء والمصلح الثانوي R-103',
    question: 'أين تقع فوهة خروج الغاز المحول من المصلح الثانوي R-103 وفق التعديل الهندسي المطابق للواقع؟',
    options: [
      'من منتصف بدن المفاعل R-103 (Mid-Height Shell Nozzle)',
      'من قمة القبة العلوية',
      'من أسفل القاع تماماً ملامساً للخرسانة',
      'عبر أنبوب داخلي صاعد للقمة'
    ],
    correctIndex: 0,
    explanation: 'يخرج خط الغاز المعزول من منتصف بدن R-103 متجهاً مباشرة إلى مدخل غلاية E-108 لتفادي الإجهادات الميكانيكية.',
    technicalReference: 'المخطط الهندسي المعدل ومطابقة النموذج ثلاثي الأبعاد',
    equipmentRef: 'r-103'
  },
  {
    id: 65,
    type: 'fill_blank',
    category: 'secondary_reformer',
    arabicCategory: 'ضاغط الهواء والمصلح الثانوي R-103',
    question: 'الغاز الذي يجهزه ضاغط K-302 لتأمين النيتروجين اللازم لصناعة الأمونيا هو ______ .',
    options: [
      'الهواء الجوي (Atmospheric Process Air)',
      'الغاز الطبيعي',
      'غاز الأرجون',
      'ثاني أكسيد الكربون'
    ],
    correctIndex: 0,
    explanation: 'K-302 هو ضاغط هواء العملية (Process Air Compressor)، ويستمد الهواء من الجو ليمد العملية بالنيتروجين اللازم بنسبة 3:1 مع الهيدروجين.',
    technicalReference: 'دليل التشغيل - الفقرة 2.2.c (صفحة C-6)',
    equipmentRef: 'k-302'
  },
  {
    id: 66,
    type: 'mcq',
    category: 'secondary_reformer',
    arabicCategory: 'ضاغط الهواء والمصلح الثانوي R-103',
    question: 'ماذا يحدث إذا اختلت نسبة التحكم FRCA-107 وزاد تدفق الهواء عن المطلوب في R-103؟',
    options: [
      'ترتفع نسبة النيتروجين في غاز التخليق عن النسبة المتكافئة 3:1 وترتفع حرارة قمة R-103 مهددة بتلف الحشوة',
      'ينطفئ الفرن الأولي R-101 فوراً',
      'يتجمد مرجل E-108',
      'ينخفض ضغط الغاز إلى الصفر'
    ],
    correctIndex: 0,
    explanation: 'زيادة الهواء تحرق هيدروكربونات أكثر رافعة الحرارة بشكل خطر، كما تزيد النيتروجين في الدورة مسببة تراكم الغازات الخاملة واضطراب حلقة الأمونيا R-401.',
    technicalReference: 'دليل التشغيل - السيطرة على نسبة H2/N2 (صفحة C-6)',
    equipmentRef: 'r-103'
  },
  {
    id: 67,
    type: 'mcq',
    category: 'secondary_reformer',
    arabicCategory: 'ضاغط الهواء والمصلح الثانوي R-103',
    question: 'ما هي البطانة الداخلية لمفاعل R-103 لحماية جدار المعدة الفولاذي من حرارة 1150°C؟',
    options: [
      'بطانة حرارية مزدوجة من الطوب عالي الألومينا والخرسانة العازلة مع غلاف خارجي مبرد',
      'طبقة من الإيبوكسي العادي',
      'ألواح التفلون المقاومة للمذيبات',
      'غلاف رصاصي مصبوب'
    ],
    correctIndex: 0,
    explanation: 'يبطن R-103 بطبقات من الطوب والخرسانة المقاومة للحرارة (High Alumina Refractory Brick) لمنع وصول الحرارة إلى الغلاف المعدني للوعاء.',
    technicalReference: 'المواصفات الميكانيكية للمصلح الثانوي R-103',
    equipmentRef: 'r-103'
  },
  {
    id: 68,
    type: 'fill_blank',
    category: 'secondary_reformer',
    arabicCategory: 'ضاغط الهواء والمصلح الثانوي R-103',
    question: 'تبلغ نسبة أول أكسيد الكربون (CO) في الغاز الخارج من R-103 حوالي ______ قبل دخوله مرحلة التنقية والتحويل.',
    options: [
      '12% إلى 14% بالحجم',
      '0.33%',
      '2.8%',
      '0.05%'
    ],
    correctIndex: 0,
    explanation: 'يحتوي الغاز الخارج من R-103 على كمية كبيرة من CO تتراوح بين 12-14%، وتتم معالجتها في مفاعلات التحويل HTS و LTS لإنتاج المزيد من الهيدروجين.',
    technicalReference: 'توازن المواد - قسم 100',
    equipmentRef: 'r-103'
  },
  {
    id: 69,
    type: 'mcq',
    category: 'secondary_reformer',
    arabicCategory: 'ضاغط الهواء والمصلح الثانوي R-103',
    question: 'ما نوع المحرك الرئيسي المحرك لضاغط هواء العملية K-302؟',
    options: [
      'توربين بخاري ذو ضغط فائق يعمل ببخار 65 - 105 كغم/سم²',
      'محرك ديزل 12 أسطوانة',
      'محرك كهربائي صغير بقوة 50 حصان',
      'عنفة غازية تعمل بالهواء المضغوط'
    ],
    correctIndex: 0,
    explanation: 'يدار K-302 بواسطة توربين بخاري ضخم يعمل ببخار الضغط العالي الفائق المنتج من غلايات المصنع.',
    technicalReference: 'مواصفات التوربين K-302T - قسم 100',
    equipmentRef: 'k-302'
  },
  {
    id: 70,
    type: 'mcq',
    category: 'secondary_reformer',
    arabicCategory: 'ضاغط الهواء والمصلح الثانوي R-103',
    question: 'إلى أي معدة يتجه الغاز الخارج من R-103 عند درجة حرارة 969°C مباشرة؟',
    options: [
      'إلى جانب الغلاف (Shell Side) لغلاية استرجاع الحرارة E-108',
      'إلى مفاعل التحويل R-104 مباشرة',
      'إلى برج امتصاص CO2 T-201',
      'إلى مضخة مياه المراجل P-101'
    ],
    correctIndex: 0,
    explanation: 'The effluent stream from the Secondary Reformer at 969°C enters the shell side of the Reform Gas Waste Heat Boiler (E-108).',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.a (صفحة C-6)',
    equipmentRef: 'e-108'
  },

  // =========================================================================
  // SECTION 7: غلاية الحرارة المهدرة E-108 وطبلة V-102A وبخار 71 كغم [71-80]
  // =========================================================================
  {
    id: 71,
    type: 'mcq',
    category: 'boiler_e108',
    arabicCategory: 'غلاية E-108 وطبلة البخار V-102A',
    question: 'إلى أي درجة حرارة يتم تبريد غاز العمليات داخل غلاية استرجاع الحرارة E-108؟',
    options: [
      'يبرد إلى 365°C (أو 340°C في قراءة المخطط)',
      'يبرد إلى 215°C',
      'يبرد إلى 120°C',
      'يبرد إلى 77°C'
    ],
    correctIndex: 0,
    explanation: 'Is cooled to 365°C while producing 71 Kg/cm²G steam (وتظهر 340°C في مخطط PFD).',
    technicalReference: 'دليل التشغيل ومخطط PFD (صفحة C-7 و C-8)',
    equipmentRef: 'e-108'
  },
  {
    id: 72,
    type: 'mcq',
    category: 'boiler_e108',
    arabicCategory: 'غلاية E-108 وطبلة البخار V-102A',
    question: 'كم يبلغ ضغط البخار المتولد في غلاية E-108 وغلاية E-109؟',
    options: [
      '71 كغم/سم² قياسي (71 Kg/cm²G steam)',
      '12 كغم/سم² قياسي',
      '3 كغم/سم² قياسي',
      '19 كغم/سم² قياسي'
    ],
    correctIndex: 0,
    explanation: 'While producing 71 Kg/cm²G steam. يتم إنتاج بخار عالي الضغط بضغط 71 كغم/سم² قياسي.',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.a (صفحة C-7)',
    equipmentRef: 'e-108'
  },
  {
    id: 73,
    type: 'fill_blank',
    category: 'boiler_e108',
    arabicCategory: 'غلاية E-108 وطبلة البخار V-102A',
    question: 'يدخل غاز الإصلاح الساخن إلى جانب ______ في غلاية E-108 بينما يدور ماء الغلاية داخل الأنابيب.',
    options: [
      'جانب الغلاف (Shell Side)',
      'جانب الأنابيب (Tube Side)',
      'جانب المشاعل',
      'المجمع العلوي'
    ],
    correctIndex: 0,
    explanation: 'Enters shell side of the Reform Gas Waste Heat Boiler (E-108) where it is cooled to 365°C.',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.a (صفحة C-6)',
    equipmentRef: 'e-108'
  },
  {
    id: 74,
    type: 'mcq',
    category: 'boiler_e108',
    arabicCategory: 'غلاية E-108 وطبلة البخار V-102A',
    question: 'ما هي طبلة البخار الموحدة التي ترتبط بها غلايتا استرجاع الحرارة E-108 و E-109؟',
    options: [
      'طبلة البخار عالي الضغط الموحدة V-102A (Elevated HP Steam Drum)',
      'طبلة البخار متوسط الضغط V-109',
      'وعاء فصل المتكاثف V-101',
      'خزان التمدد V-408'
    ],
    correctIndex: 0,
    explanation: 'ترتبط غلايتا E-108 و E-109 بطبلة البخار المرتفعة V-102A عبر شبكة من الأنابيب الصاعدة والهابطة لتوليد بخار 71 كغم/سم².',
    technicalReference: 'المخطط الهندسي 6112P-300-103 ومطابقة الـ 3D',
    equipmentRef: 'e-108'
  },
  {
    id: 75,
    type: 'mcq',
    category: 'boiler_e108',
    arabicCategory: 'غلاية E-108 وطبلة البخار V-102A',
    question: 'ما هي طريقة تدوير ماء الغلاية بين E-108 وطبلة V-102A؟',
    options: [
      'الدوران الطبيعي بالثرموسيفون (Natural Thermosiphon Circulation) بفارق الكثافة بين الماء الساخن وخليط البخار',
      'الضخ القسري بمضخات ترددية',
      'الجاذبية البسيطة بدون أنابيب صاعدة',
      'الدفع بالهواء المضغوط'
    ],
    correctIndex: 0,
    explanation: 'يعتمد النظام على الدوران الطبيعي (Thermosiphon)؛ حيث يهبط الماء الأبرد عبر الهوابط (Downcomers) ويصعد خليط الماء والبخار الأخف كثافة عبر الصواعد (Risers).',
    technicalReference: 'التصميم الميكانيكي لدورة المراجل V-102A/E-108',
    equipmentRef: 'e-108'
  },
  {
    id: 76,
    type: 'fill_blank',
    category: 'boiler_e108',
    arabicCategory: 'غلاية E-108 وطبلة البخار V-102A',
    question: 'وظيفة الأنابيب الصاعدة (Risers) في دورة الغلاية هي ______ .',
    options: [
      'إعادة خليط الماء والبخار المتولد في الغلاية إلى طبلة البخار لفصلهما',
      'تزويد الغلاية بالغاز الطبيعي',
      'تفريغ الرواسب من قاع الطبلة',
      'سحب غازات العادم'
    ],
    correctIndex: 0,
    explanation: 'تنقل الصواعد (Risers) خليط البخار والماء المغلي المتولد في الغلاية إلى طبلة البخار ليتم فصل البخار المشبع وإرساله إلى شبكة التحميص.',
    technicalReference: 'هندسة تشغيل دورات المراجل - قسم 100',
    equipmentRef: 'e-108'
  },
  {
    id: 77,
    type: 'mcq',
    category: 'boiler_e108',
    arabicCategory: 'غلاية E-108 وطبلة البخار V-102A',
    question: 'ما هو الخطر التشغيلي الكارثي إذا هبط منسوب المياه في طبلة البخار V-102A إلى الصفر؟',
    options: [
      'جفاف أنابيب غلاية E-108 وانهيارها حرارياً فوراً بفعل حرارة الغاز الداخل البالغة 969°C',
      'توقف مفاعل التحويل الواطئ فقط',
      'انخفاض درجة حرارة غازات العادم',
      'زيادة توليد الكهرباء في التوربين'
    ],
    correctIndex: 0,
    explanation: 'جفاف الأنابيب (Boiler Dry-out) تحت حرارة الغاز القصوى 969°C يؤدي لانصهار وتمزق الأنابيب فورياً؛ لذا يزود بنظام إطفاء طارئ (Emergency Low Level Trip).',
    technicalReference: 'إجراءات السلامة الصناعية والحماية للمراجل - قسم 100',
    equipmentRef: 'e-108'
  },
  {
    id: 78,
    type: 'mcq',
    category: 'boiler_e108',
    arabicCategory: 'غلاية E-108 وطبلة البخار V-102A',
    question: 'لماذا يعتبر التبريد السريع لغاز العمليات في E-108 من 969°C إلى 365°C ضرورياً جداً كيميائياً؟',
    options: [
      'لتثبيت التركيب الكيميائي للغاز ومنع تفاعل التفكك العكسي للميثان وتكون الكربون (Metal Dusting / Boudouard)',
      'لتسريع امتصاص النيتروجين',
      'لفصل غاز الهيدروجين كسائل',
      'لتقليل استهلاك مياه التبريد'
    ],
    correctIndex: 0,
    explanation: 'التبريد السريع (Rapid Quench) يمنع تفاعل بودوارد العكسي 2CO -> C + CO2 وظاهرة تآكل الغبار المعدني (Metal Dusting) ويحفظ الهيدروجين المنتج.',
    technicalReference: 'كيمياء وهندسة غاز التخليق - تبريد غلايات الإصلاح',
    equipmentRef: 'e-108'
  },
  {
    id: 79,
    type: 'fill_blank',
    category: 'boiler_e108',
    arabicCategory: 'غلاية E-108 وطبلة البخار V-102A',
    question: 'يخرج الغاز المبرد من E-108 عند حرارة 365°C ليدخل مباشرة إلى مفاعل التحويل الأولي لـ CO المسمى ______ .',
    options: [
      'R-104 (Primary CO Converter / HTS)',
      'R-105 (Secondary CO Converter / LTS)',
      'R-106 (Methanator)',
      'R-101 (Primary Reformer)'
    ],
    correctIndex: 0,
    explanation: 'Then the Process Gas enters the Primary CO Converter (R-104).',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.a (صفحة C-7)',
    equipmentRef: 'r-104'
  },
  {
    id: 80,
    type: 'mcq',
    category: 'boiler_e108',
    arabicCategory: 'غلاية E-108 وطبلة البخار V-102A',
    question: 'كم عدد أنابيب النزول (Downcomers) المجهزة لغلاية E-108 في التصميم ثلاثي الأبعاد؟',
    options: [
      'أنبوبا نزول خارجيان بأقطار كبيرة متصلان بقاع الطبلة وقاع الغلاية',
      'أنبوب واحد شعري دقيق',
      'عشرون أنبوباً صغيراً',
      'لا توجد أنابيب نزول'
    ],
    correctIndex: 0,
    explanation: 'تزود الغلاية بأنبوبي نزول رئيسيين عند الأطراف الخارجية لتأمين تدفق مستمر وهادئ لمياه التغذية الباردة دون إعاقة صعود البخار.',
    technicalReference: 'التجسيد الهندسي لغلاية E-108 في النموذج 3D',
    equipmentRef: 'e-108'
  },

  // =========================================================================
  // SECTION 8: مفاعل التحويل العالي HTS R-104 وتفاعل الإزاحة [81-88]
  // =========================================================================
  {
    id: 81,
    type: 'mcq',
    category: 'hts_converter',
    arabicCategory: 'مفاعل التحويل العالي HTS R-104',
    question: 'ما هو العامل المساعد التقليدي المستخدم في مفاعل التحويل الأولي R-104؟',
    options: [
      'عامل مساعد من أكاسيد الحديد والكروم (Conventional Iron and Chromium Catalyst Bed)',
      'عامل مساعد من النحاس والزنك (Cu-Zn)',
      'عامل مساعد نيكل على ألومينا',
      'أكسيد التيتانيوم النقي'
    ],
    correctIndex: 0,
    explanation: 'Where the gas stream passes over a conventional iron and chromium catalyst bed.',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.a (صفحة C-7)',
    equipmentRef: 'r-104'
  },
  {
    id: 82,
    type: 'mcq',
    category: 'hts_converter',
    arabicCategory: 'مفاعل التحويل العالي HTS R-104',
    question: 'ما هي نسبة أول أكسيد الكربون (CO) التي تتفاعل في مفاعل R-104؟ وما هي طبيعة التفاعل حرارياً؟',
    options: [
      'يتفاعل حوالي 75% من CO في تفاعل طارد للحرارة (Exothermically) مع البخار لإنتاج الهيدروجين وCO2',
      'يتفاعل 10% في تفاعل ماص للحرارة',
      'يتفاعل 100% بالكامل بدون بقايا',
      'لا يحدث أي تفاعل وظيفته التبريد فقط'
    ],
    correctIndex: 0,
    explanation: 'Where about 75% of the carbon monoxide (CO) reacts exothermically with the steam contained in the gas stream to form more hydrogen and carbon dioxide.',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.a (صفحة C-7)',
    equipmentRef: 'r-104'
  },
  {
    id: 83,
    type: 'fill_blank',
    category: 'hts_converter',
    arabicCategory: 'مفاعل التحويل العالي HTS R-104',
    question: 'ينخفض محتوى أول أكسيد الكربون (CO) في تيار الغاز الخارج من مفاعل R-104 إلى حوالي ______ .',
    options: [
      '2.8% (approximately 2.8%)',
      '0.33%',
      '9.86%',
      '0.05%'
    ],
    correctIndex: 0,
    explanation: 'In the Primary CO Converter the carbon monoxide content of the gas stream is reduced to approximately 2.8%.',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.a (صفحة C-7)',
    equipmentRef: 'r-104'
  },
  {
    id: 84,
    type: 'mcq',
    category: 'hts_converter',
    arabicCategory: 'مفاعل التحويل العالي HTS R-104',
    question: 'كيف يتم التحكم بمحتوى أول أكسيد الكربون في الغاز الخارج من R-104؟',
    options: [
      'بواسطة ضبط درجة حرارة الغاز الداخل إلى المفاعل (Adjusting the temperature of the inlet gas)',
      'بزيادة حقن الهواء من K-302',
      'بتغيير سرعة ضاغط K-303',
      'بإضافة حامض الكبريتيك'
    ],
    correctIndex: 0,
    explanation: 'The CO content of the Primary CO Converter effluent is controlled by adjusting the temperature of the inlet gas. The lowest temperature compatible with design CO leakage should always be used.',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.a (صفحة C-7)',
    equipmentRef: 'r-104'
  },
  {
    id: 85,
    type: 'mcq',
    category: 'hts_converter',
    arabicCategory: 'مفاعل التحويل العالي HTS R-104',
    question: 'ما هي المعادلة الكيميائية الرئيسية لتفاعل إزاحة الغاز المائي (Water Gas Shift Reaction) في R-104؟',
    options: [
      'CO + H2O ⇌ CO2 + H2 + Heat (طارد للحرارة)',
      'CO2 + H2 → CO + H2O (ماص للحرارة)',
      'CH4 + H2O → CO + 3H2',
      '2H2 + O2 → 2H2O'
    ],
    correctIndex: 0,
    explanation: 'تفاعل إزاحة الغاز المائي: CO + H2O ⇌ CO2 + H2 وهو تفاعل متوازن طارد للحرارة يفضل درجات الحرارة المنخفضة ثرموديناميكياً.',
    technicalReference: 'الأساس الكيميائي لتحويل غاز المصلح - قسم 100',
    equipmentRef: 'r-104'
  },
  {
    id: 86,
    type: 'fill_blank',
    category: 'hts_converter',
    arabicCategory: 'مفاعل التحويل العالي HTS R-104',
    question: 'بما أن تفاعل التحويل في R-104 طارد للحرارة، فإن درجة حرارة الغاز ترتفع من 340-365°C عند الدخول إلى حوالي ______ مئوية عند المخرج.',
    options: [
      '390°C (أو 433°C في بعض الحسابات القصوى)',
      '550°C',
      '200°C',
      '969°C'
    ],
    correctIndex: 0,
    explanation: 'تؤدي حرارة التفاعل الطاردة إلى ارتفاع درجة حرارة الغاز بمقدار 40-50°C ليصل المخرج إلى حوالي 390°C كما هو مثبت في مخطط PFD (C-8).',
    technicalReference: 'مخطط PFD اليدوي المرفق (صفحة C-8)',
    equipmentRef: 'r-104'
  },
  {
    id: 87,
    type: 'mcq',
    category: 'hts_converter',
    arabicCategory: 'مفاعل التحويل العالي HTS R-104',
    question: 'من أين يدخل الغاز وأين يخرج في مفاعل R-104 وفق القواعد الديناميكية وفارق الكثافة؟',
    options: [
      'يدخل من القمة ويخرج من القمة أيضاً عبر أنبوب داخلي لمنع ركود وتجمع الغازات الثقيلة',
      'يدخل من القاع ويخرج من القمة',
      'يدخل من الجانب ويخرج من القاع',
      'يدخل من القاع ويخرج من القاع'
    ],
    correctIndex: 0,
    explanation: 'يدخل تيار الغاز من قمة المفاعل R-104 وينتشر عبر موزع علوي، ويخرج أيضاً من قمة المفاعل لتأمين أفضل تدرج حراري وتجنب التكثف في القاع.',
    technicalReference: 'التصميم الميكانيكي ومطابقة الـ 3D لمفاعل R-104',
    equipmentRef: 'r-104'
  },
  {
    id: 88,
    type: 'mcq',
    category: 'hts_converter',
    arabicCategory: 'مفاعل التحويل العالي HTS R-104',
    question: 'لماذا تنص القاعدة التشغيلية في الدليل على: "The lowest temperature compatible with design CO leakage should always be used"؟',
    options: [
      'لأن ثرموديناميكا تفاعل إزاحة الغاز المائي تفضل الحرارة المنخفضة لزيادة نسبة التحويل وتقليل تركيز CO المتبقي',
      'لأن درجات الحرارة المنخفضة توقف تفاعل إنتاج الهيدروجين',
      'لمنع تجمد الغاز في المفاعل',
      'لتقليل استهلاك النيتروجين'
    ],
    correctIndex: 0,
    explanation: 'ثابت الاتزان الكيميائي Kp لتفاعل إزاحة الغاز المائي يزداد بانخفاض درجة الحرارة (وفق قاعدة لوشاتيليه)، لذا تعطي الحرارة الأقل الممكنة تحويلاً أعلى لـ CO.',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.a (صفحة C-7)',
    equipmentRef: 'r-104'
  },

  // =========================================================================
  // SECTION 9: منظومة التبريد والتجزئة E-109 و E-107 ومرجل E-110 [89-94]
  // =========================================================================
  {
    id: 89,
    type: 'mcq',
    category: 'heat_recovery_train',
    arabicCategory: 'استرجاع الحرارة والتجزئة E-109 / E-107 / E-110',
    question: 'إلى أي معدتين يتم تجزئة (Split) تيار الغاز الخارج من مفاعل التحويل الأولي R-104؟',
    options: [
      'الجزء الأكبر يمر عبر غلاية E-109، والجزء الأصغر يمر عبر أنابيب مسخن الميثنة E-107',
      'الجزء الأكبر يذهب إلى المدخنة، والجزء الأصغر إلى الضاغط K-303',
      'يقسم بالتساوي بين الفرن الأولي R-101 والمصلح الثانوي R-103',
      'يتجه بالكامل إلى فاصل المتكاثف V-101 دون تجزئة'
    ],
    correctIndex: 0,
    explanation: 'Primary CO Converter effluent is split with the major portion passing through Converted Gas Waste Heat Boiler (E-109) and the smaller portion passing through tube side of Methanation Preheater (E-107).',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.a (صفحة C-7)',
    equipmentRef: 'e-109'
  },
  {
    id: 90,
    type: 'mcq',
    category: 'heat_recovery_train',
    arabicCategory: 'استرجاع الحرارة والتجزئة E-109 / E-107 / E-110',
    question: 'ما الذي يحدد نسبة توزيع الجريان بين الغلاية E-109 والمسخن E-107؟',
    options: [
      'درجة حرارة الدخول المطلوبة لمفاعل الميثنة R-106 (Determined by Methanator inlet temperature)',
      'ضغط البخار في طبلة V-102A',
      'مستوى السائل في خزان الأمونيا',
      'سرعة دوران مروحة السحب K-101A'
    ],
    correctIndex: 0,
    explanation: 'The proportion of flow to each Exchanger is determined by the Methanator inlet temperature.',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.a (صفحة C-7)',
    equipmentRef: 'e-107'
  },
  {
    id: 91,
    type: 'fill_blank',
    category: 'heat_recovery_train',
    arabicCategory: 'استرجاع الحرارة والتجزئة E-109 / E-107 / E-110',
    question: 'تنتج غلاية الغاز المحول E-109 بخاراً عالي الضغط بضغط ______ كغم/سم² قياسي مساهمة في تغذية V-102A.',
    options: [
      '71 كغم/سم² قياسي (71 Kg/cm²G)',
      '12 كغم/سم² قياسي',
      '3 كغم/سم² قياسي',
      '36 كغم/سم² قياسي'
    ],
    correctIndex: 0,
    explanation: 'Utilizing the process heat to produce approximately 71 Kg/cm²G steam.',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.a (صفحة C-7)',
    equipmentRef: 'e-109'
  },
  {
    id: 92,
    type: 'mcq',
    category: 'heat_recovery_train',
    arabicCategory: 'استرجاع الحرارة والتجزئة E-109 / E-107 / E-110',
    question: 'أين يلتقي تيارا الغاز الخارجان من E-109 و E-107، وإلى أين يتجه التيار الموحد؟',
    options: [
      'يتحد التياران معاً ويدخلان إلى مرجل الضغط المنخفض E-110 (L.P. Boiler)',
      'يتحدان ويدخلان قمة الفرن الأولي R-101',
      'يتحدان ويدخلان مباشرة إلى ضاغط غاز التخليق K-301',
      'يفرغان في خزان تصريف المياه'
    ],
    correctIndex: 0,
    explanation: 'The two flows unite again and pass through L.P. Boiler (E-110).',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.a (صفحة C-7)',
    equipmentRef: 'e-110'
  },
  {
    id: 93,
    type: 'mcq',
    category: 'heat_recovery_train',
    arabicCategory: 'استرجاع الحرارة والتجزئة E-109 / E-107 / E-110',
    question: 'ما هو ضغط البخار المنتج في مرجل E-110، وما هي الوظيفة الحرارية المزدوجة لهذا المرجل؟',
    options: [
      'ينتج بخاراً بضغط 12 كغم/سم² قياسي ويتحكم بدرجة حرارة الغاز الداخل إلى مفاعل التحويل الثانوي R-105',
      'ينتج بخاراً بضغط 71 كغم/سم² لتغذية التوربينات',
      'ينتج ماءً ساخناً لغسل الأرضيات فقط',
      'ينتج بخاراً فائق التحميص بضغط 120 كغم/سم²'
    ],
    correctIndex: 0,
    explanation: 'Which utilizes the process heat to produce 12 Kg/cm²G steam while controlling the temperature of the stream to the Secondary CO Converter.',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.a (صفحة C-7)',
    equipmentRef: 'e-110'
  },
  {
    id: 94,
    type: 'fill_blank',
    category: 'heat_recovery_train',
    arabicCategory: 'استرجاع الحرارة والتجزئة E-109 / E-107 / E-110',
    question: 'يخرج الغاز المبرد من مرجل E-110 عند درجة حرارة حوالي ______ مئوية متجهاً إلى مفاعل التحويل الثانوي R-105.',
    options: [
      '215°C (أو 185°C - 200°C في قراءات المخطط)',
      '365°C',
      '795°C',
      '77°C'
    ],
    correctIndex: 0,
    explanation: 'The cooled gas by the L.P. Boiler at 215°C enters the Secondary CO Converter (R-105) (وتظهر 200°C في مخطط PFD).',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.b ومخطط PFD (صفحة C-7 و C-8)',
    equipmentRef: 'e-110'
  },

  // =========================================================================
  // SECTION 10: فاصل المتكاثف V-101 ومحول LTS R-105 والميثنة [95-100]
  // =========================================================================
  {
    id: 95,
    type: 'mcq',
    category: 'lts_converter',
    arabicCategory: 'فاصل V-101 ومحول LTS R-105 والميثنة',
    question: 'ما هي وظيفة وعاء فصل المتكاثف V-101 الموجود بين مرجل E-110 ومفاعل R-105؟',
    options: [
      'فصل قطرات الماء المتكاثف ميكانيكياً لحماية عامل النحاس المساعد الحساس في R-105 من التلف بالرطوبة السائلة',
      'توليد بخار الضغط العالي',
      'حقن النيتروجين في الغاز',
      'امتصاص غاز ثاني أكسيد الكربون'
    ],
    correctIndex: 0,
    explanation: 'يقوم V-101 (Knockout Drum) بفصل أي متكاثفات سائلة مائية لحماية حبيبات عامل النحاس المساعد في LTS من التفتت والانهيار الميكانيكي.',
    technicalReference: 'مخطط P&ID ومنظومة حماية محول LTS - قسم 100',
    equipmentRef: 'v-101'
  },
  {
    id: 96,
    type: 'mcq',
    category: 'lts_converter',
    arabicCategory: 'فاصل V-101 ومحول LTS R-105 والميثنة',
    question: 'ما هي حشوة الحماية العلوية (Sulfur Guard Bed) الموجودة في قمة مفاعل التحويل الثانوي R-105؟',
    options: [
      'طبقة لحجز وإزالة أي آثار متبقية من مركبات الكبريت لحماية العامل المساعد الرئيسي الحساس',
      'طبقة من فحم الكوك لتسريع التفاعل',
      'طبقة من كرات السيراميك لمنع تدفق الغاز',
      'طبقة جليدية لتبريد الغاز'
    ],
    correctIndex: 0,
    explanation: 'Passes through a bed of sulfur guard to remove all traces of sulfur before it passes through the catalyst bed.',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.b (صفحة C-7)',
    equipmentRef: 'r-105'
  },
  {
    id: 97,
    type: 'fill_blank',
    category: 'lts_converter',
    arabicCategory: 'فاصل V-101 ومحول LTS R-105 والميثنة',
    question: 'ينخفض تركيز أول أكسيد الكربون (CO) في مفاعل التحويل الثانوي R-105 إلى نسبة ضئيلة جداً تبلغ ______ .',
    options: [
      '0.33% (أو أقل من 0.3%)',
      '2.8%',
      '9.86%',
      '5.0%'
    ],
    correctIndex: 0,
    explanation: 'In which the carbon monoxide concentration is reduced to 0.33% by conversion of carbon monoxide to carbon dioxide.',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.b (صفحة C-7)',
    equipmentRef: 'r-105'
  },
  {
    id: 98,
    type: 'mcq',
    category: 'lts_converter',
    arabicCategory: 'فاصل V-101 ومحول LTS R-105 والميثنة',
    question: 'ما هي منظومات بدء التشغيل المجهزة لمفاعل التحويل الثانوي R-105 لعملية اختزال العامل المساعد؟',
    options: [
      'دورة تدوير الغاز الخامل (Inert Gas Circulation Loop) وخط حقن غاز التخليق (Synthesis Gas Injection Line)',
      'خط هواء مضغوط عالي الضغط',
      'خط حاقن لمياه البحر',
      'مضخات حقن وقود الديزل'
    ],
    correctIndex: 0,
    explanation: 'The Secondary CO Converter is provided with the inert gas circulation loop and the synthesis gas injection line which are used for the reduction of the catalyst at start-up.',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.b (صفحة C-7 و C-8)',
    equipmentRef: 'r-105'
  },
  {
    id: 99,
    type: 'mcq',
    category: 'lts_converter',
    arabicCategory: 'فاصل V-101 ومحول LTS R-105 والميثنة',
    question: 'ما الفائدتان الأساسيتان لخط التجاوز (Bypass Connection) المحيط بمفاعل التحويل الثانوي R-105؟',
    options: [
      '1. تجاوز المفاعل أثناء اختزال العامل المساعد عند بدء التشغيل، و2. السماح بتشغيل المصنع بطاقة مخفضة عند تسمم العامل المساعد وتوقفه عن العمل',
      'تفريغ الغاز في الجو وزيادة استهلاك الوقود',
      'خلط الغاز مع مياه المراجل وتبريد التوربينات',
      'إلغاء الحاجة لفرن الإصلاح الأولي'
    ],
    correctIndex: 0,
    explanation: '1. Bypassing Secondary CO Converter during reduction of catalyst at start-up. 2. Bypassing to permit reduced capacity operation in case Converter has to be taken out of service because of catalyst poisoning.',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.b (صفحة C-7)',
    equipmentRef: 'r-105'
  },
  {
    id: 100,
    type: 'mcq',
    category: 'lts_converter',
    arabicCategory: 'فاصل V-101 ومحول LTS R-105 والميثنة',
    question: 'إلى أين يتجه الغاز الخارج من مفاعل التحويل الثانوي R-105 قبل وصوله إلى مفاعل الميثنة النهائي R-106؟',
    options: [
      'يتجه إلى قسم إزالة واستخلاص ثاني أكسيد الكربون (CO2 Removal Section - Catacarb Unit 200)',
      'يتجه إلى خزانات الأمونيا مباشرة',
      'يعود إلى الفرن الأولي R-101 كوقود',
      'يتجه إلى شبكة مياه التبريد'
    ],
    correctIndex: 0,
    explanation: 'يخرج الغاز المتحول من قمة المفاعل العلوية (من فوق وليس من أسفل) ويتجه إلى قسم إزالة واستخلاص ثاني أكسيد الكربون (قسم 200 كاتاكارب - Catacarb Unit 200) قبل مروره إلى مفاعل الميثنة النهائي R-106 (The effluent from Secondary CO Converter R-105 exits from top dome and flows to CO2 Removal Section).',
    technicalReference: 'دليل التشغيل - الفقرة 2.3.b ومخطط التدفق (صفحة C-7 و C-8)',
    equipmentRef: 'r-105'
  }
];
