/**
 * Master 100-Question Technical Examination & Engineering Training Bank for Section 400
 * Ammonia Synthesis Loop & Refrigeration System (R-401, K-401 / KT-401, E-401..416, V-401..409, P-401A/B)
 * Derived strictly from Iraqi Fertilizer Complex No. 3 Operating Manual (Dwg. 6112P-100-400-00, Manual C-15 to C-22)
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

export const SECTION_400_EXAM_QUESTIONS: ExamQuestion[] = [
  // =========================================================================
  // CATEGORY 1: مبادئ تفاعل تخليق الأمونيا وتوازن الغازات والحرارة [1-10]
  // =========================================================================
  {
    id: 1,
    type: 'mcq',
    category: 'synthesis_principles',
    arabicCategory: 'مبادئ تفاعل تخليق الأمونيا وتوازن الغازات والحرارة',
    question: 'ما هي الوظيفة الأساسية لقسم تخليق الأمونيا (Section 400 - Synthesis)؟',
    options: [
      'الدمج التحفيزي بين الهيدروجين والنيتروجين لإنتاج الأمونيا وفصلها عن تيار الغاز المتبقي',
      'تحويل الميثان بواسطة البخار لإنتاج أول أكسيد الكربون والهيدروجين',
      'امتصاص غاز ثاني أكسيد الكربون بواسطة محلول كربونات البوتاسيوم',
      'فصل الماء والأكسجين لإنتاج النيتروجين النقي'
    ],
    correctIndex: 0,
    explanation: 'وفقاً لدليل التشغيل (الفقرة 2.5، صفحة C-15): "This section catalytically combines hydrogen and nitrogen to produce ammonia and separates the ammonia from the remaining gas stream."',
    technicalReference: 'دليل التشغيل - الفقرة 2.5 (صفحة C-15)',
    equipmentRef: 'r-401'
  },
  {
    id: 2,
    type: 'mcq',
    category: 'synthesis_principles',
    arabicCategory: 'مبادئ تفاعل تخليق الأمونيا وتوازن الغازات والحرارة',
    question: 'ما هي مكونات غاز التخليق (Synthesis Gas) الداخل إلى حلقة ومفاعل تخليق الأمونيا R-401؟',
    options: [
      'الهيدروجين والنيتروجين والأمونيا، مع غازات خاملة تشمل الميثان والأرغون (Methane and Argon)',
      'فقط الهيدروجين والنيتروجين بنقاوة مطلقة 100%',
      'أول أكسيد الكربون، ثاني أكسيد الكربون، وبخار الماء',
      'الغاز الطبيعي غير المعالج والأكسجين'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-15) على أن غاز التخليق يحتوي على الهيدروجين والنيتروجين ونسبة من الأمونيا بالإضافة إلى الغازات الخاملة غير المتفاعلة وهي الميثان والأرغون.',
    technicalReference: 'دليل التشغيل - صفحة C-15',
    equipmentRef: 'r-401'
  },
  {
    id: 3,
    type: 'mcq',
    category: 'synthesis_principles',
    arabicCategory: 'مبادئ تفاعل تخليق الأمونيا وتوازن الغازات والحرارة',
    question: 'ما هي طبيعة التفاعل الكيميائي لتخليق الأمونيا (N₂ + 3H₂ ⇌ 2NH₃) من حيث التأثير الحراري؟',
    options: [
      'تفاعل باعث بشدة للحرارة (Exothermic) مصحوب بارتفاع في درجة حرارة الغاز المتدفق عبر العامل المساعد',
      'تفاعل ماص للحرارة يتطلب تسخيناً خارجياً مستمراً داخل الطبقات',
      'تفاعل متزن حرارياً لا يولد ولا يمتص أي طاقة حرارية',
      'تفاعل انفجاري لا يمكن التحكم في توازنه'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-16) على: "While passing over the catalyst... react to form ammonia with the evolution of heat and a resultant temperature rise."',
    technicalReference: 'دليل التشغيل - صفحة C-16',
    equipmentRef: 'r-401'
  },
  {
    id: 4,
    type: 'mcq',
    category: 'synthesis_principles',
    arabicCategory: 'مبادئ تفاعل تخليق الأمونيا وتوازن الغازات والحرارة',
    question: 'ما هي النسبة المئوية المتبقية من غاز الأمونيا في الطور الغازي بعد إتمام مرحلتي التكثيف الأولي والثانوي وتبريد الغاز إلى 2.2°C؟',
    options: [
      'حوالي 4% فقط (Approximately 4% ammonia remains in the gas phase)',
      'حوالي 12% أمونيا',
      'أقل من 0.05% أمونيا',
      'حوالي 25% أمونيا'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-18) على أن تبريد المزيج في مكثف الأمونيا الثانوي E-406 إلى 2.2°C يؤدي إلى تكثيف الأمونيا بحيث لا يتبقى سوى حوالي 4% أمونيا في الطور الغازي المعود للمفاعل.',
    technicalReference: 'دليل التشغيل - صفحة C-18',
    equipmentRef: 'e-406'
  },
  {
    id: 5,
    type: 'mcq',
    category: 'synthesis_principles',
    arabicCategory: 'مبادئ تفاعل تخليق الأمونيا وتوازن الغازات والحرارة',
    question: 'أين يتم إدخال وخلط غاز التعويض التعويضي (Make-up Gas) القادم من ضاغط غاز التخليق مع غاز التدوير؟',
    options: [
      'في مكثف الأمونيا المبرد بالأمونيا الثانوي (Secondary Ammonia Cooled Condenser E-406)',
      'عند مدخل الطبقة الأولى لمفاعل الأمونيا مباشرة',
      'في وعاء فصل السوائل الأولي V-401',
      'في مدخنة المسخن الابتدائي E-403'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-15 و C-18) على: "make-up gas is introduced into and mixed with the recycle gas in the Secondary Ammonia Cooled Condenser (E-406)".',
    technicalReference: 'دليل التشغيل - صفحة C-15 و C-18',
    equipmentRef: 'e-406'
  },
  {
    id: 6,
    type: 'mcq',
    category: 'synthesis_principles',
    arabicCategory: 'مبادئ تفاعل تخليق الأمونيا وتوازن الغازات والحرارة',
    question: 'كم تبلغ النسبة المستهدفة للغازات الخاملة (Inert Gas Level) المسموح بها في حلقة غاز التدوير قبل استخلاص غاز التطهير (Purge Gas)؟',
    options: [
      'حوالي 10% (About 10%) للمحافظة على ضغوط جزيئية فعالة للهيدروجين والنيتروجين',
      'حوالي 0.5% فقط',
      'حوالي 30%',
      'أكثر من 50%'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-17) صراحة على: "A part of the recycle gas is extracted as the purge gas to maintain inert gas level in the recycle gas at about 10%."',
    technicalReference: 'دليل التشغيل - صفحة C-17',
    equipmentRef: 'v-403'
  },
  {
    id: 7,
    type: 'mcq',
    category: 'synthesis_principles',
    arabicCategory: 'مبادئ تفاعل تخليق الأمونيا وتوازن الغازات والحرارة',
    question: 'ما هو التأثير المباشر لارتفاع تركيز الغازات الخاملة (الميثان والأرغون) عن 10% في حلقة التخليق؟',
    options: [
      'انخفاض الضغوط الجزيئية للهيدروجين والنيتروجين، وانخفاض معدل تحويل الأمونيا، وزيادة استهلاك طاقة الكبس',
      'زيادة سرعة التفاعل وتبريد المفاعل تلقائياً',
      'تسمم دائم وغير قابل للاسترجاع للعامل المساعد',
      'ارتفاع تركيز الأمونيا السائلة المنتجة بصورة مفاجئة'
    ],
    correctIndex: 0,
    explanation: 'الغازات الخاملة (الميثان والأرغون) تشغل حجماً وضغطاً دون أن تتفاعل؛ مما يقلل الضغط الجزئي للغازات المتفاعلة N2 و H2 ويجبر المشغلين على تنفيس كمية أكبر من غاز التطهير (Purge Gas) لضبطها عند 10%.',
    technicalReference: 'دليل التشغيل - صفحة C-17',
    equipmentRef: 'r-401'
  },
  {
    id: 8,
    type: 'mcq',
    category: 'synthesis_principles',
    arabicCategory: 'مبادئ تفاعل تخليق الأمونيا وتوازن الغازات والحرارة',
    question: 'كيف تكتمل دورة حلقة تخليق الأمونيا (Synthesis Loop) بعد فصل الأمونيا السائلة؟',
    options: [
      'بإعادة إدخال الغازات غير المتكثفة إلى المفاعل R-401 بعد رفع ضغطها وإعادة تسخينها',
      'بحرق الغازات غير المتفاعلة مباشرة في الشعلة Flare',
      'بتصريف الغاز إلى وحدة إزالة ثاني أكسيد الكربون',
      'بإرسال كامل الغاز إلى عنبر التخزين المبرد'
    ],
    correctIndex: 0,
    explanation: 'حلقة التخليق حلقة مغلقة (Closed Loop)؛ حيث يُعاد الغاز المتبقي بعد فصل الأمونيا إلى مرحلة التدوير (Circulator Stage) بضاغط K-301 ثم يعود إلى المفاعل R-401.',
    technicalReference: 'دليل التشغيل - صفحة C-15',
    equipmentRef: 'r-401'
  },
  {
    id: 9,
    type: 'mcq',
    category: 'synthesis_principles',
    arabicCategory: 'مبادئ تفاعل تخليق الأمونيا وتوازن الغازات والحرارة',
    question: 'ما هي نسبة الأمونيا المنتجة التي يتم تكثيفها في مرحلة التكثيف الأولي بمياه التبريد (E-404 A,B)؟',
    options: [
      'حوالي 35% من مجمل إنتاج الأمونيا (about 35% of the ammonia product)',
      'حوالي 65% من الإنتاج',
      'حوالي 10% فقط',
      'كامل كمية الإنتاج بنسبة 100%'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-17) على: "Water Cooled Condensers (E-404 A,B) where about 35% of the Ammonia product is condensed."',
    technicalReference: 'دليل التشغيل - صفحة C-17',
    equipmentRef: 'e-404'
  },
  {
    id: 10,
    type: 'mcq',
    category: 'synthesis_principles',
    arabicCategory: 'مبادئ تفاعل تخليق الأمونيا وتوازن الغازات والحرارة',
    question: 'ما هي نسبة الأمونيا المنتجة التي يتم تكثيفها في مرحلة التكثيف الثانوي بواسطة مبرد التبادل البارد ومكثفي الأمونيا (E-407, E-405, E-406)؟',
    options: [
      'حوالي 65% من مجمل إنتاج الأمونيا (Approximately 65% of the product ammonia)',
      'حوالي 35% فقط',
      'أقل من 20%',
      'حوالي 95%'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-18) على: "Approximately 65% of the product ammonia is condensed in the Cold Exchanger and the two Ammonia Cooled Condensers (E-407, E-405, E-406)."',
    technicalReference: 'دليل التشغيل - صفحة C-18',
    equipmentRef: 'e-406'
  },

  // =========================================================================
  // CATEGORY 2: تصميم مفاعل الأمونيا R-401 والطبقات الثلاث وحماية الغلاف [11-22]
  // =========================================================================
  {
    id: 11,
    type: 'mcq',
    category: 'converter_r401_design',
    arabicCategory: 'تصميم مفاعل الأمونيا R-401 والطبقات الثلاث وحماية الغلاف',
    question: 'مما يتألف الهيكل الإنشائي لمفاعل تخليق الأمونيا R-401 وفقاً للمواصفات الهندسية؟',
    options: [
      'غلاف داخلي سلة العامل المساعد (Catalyst Basket) يضم 3 طبقات، وغلاف خارجي حاوٍ للضغط، وفراغ حلقي (Annular Space) بينهما',
      'غلاف أحادي مفرد غير مبطن يحتوي على طبقة عامل مساعد واحدة فقط',
      'أربعة مفاعلات رأسية متوازية مستقلة ذات سريان عكسي',
      'أنبوب حلزوني من الفولاذ الكربوني بدون عزل'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-15) على: "The Ammonia Converter consists of an inner shell (the catalyst basket) containing three separate catalyst beds, and an outer pressure-containing shell with a resultant annular space between the two shells."',
    technicalReference: 'دليل التشغيل - صفحة C-15',
    equipmentRef: 'r-401'
  },
  {
    id: 12,
    type: 'mcq',
    category: 'converter_r401_design',
    arabicCategory: 'تصميم مفاعل الأمونيا R-401 والطبقات الثلاث وحماية الغلاف',
    question: 'ما هي الغاية الهندسية الأساسية من تمرير الجزء الأكبر من غاز التغذية في الفراغ الحلقي (Annular Space) بين الغلافين؟',
    options: [
      'المحافظة على حرارة منخفضة ومستقرة للغلاف الخارجي الحامل للضغط لحمايته من الإجهادات الحرارية وهجوم الهيدروجين',
      'تبريد الأمونيا المتكونة وتكثيفها داخل جدار المفاعل',
      'زيادة الضغط الكلي داخل المفاعل إلى الضعف',
      'غسل الجدران من شوائب الكبريت'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-15) على: "The major part of the synthesis gas from the Feed Preheater (E-403) is passed through the annular space in order to maintain a low temperature on the outer shell."',
    technicalReference: 'دليل التشغيل - صفحة C-15',
    equipmentRef: 'r-401'
  },
  {
    id: 13,
    type: 'mcq',
    category: 'converter_r401_design',
    arabicCategory: 'تصميم مفاعل الأمونيا R-401 والطبقات الثلاث وحماية الغلاف',
    question: 'ما هي الوظيفة المخصصة للجزء المتبقي من غاز التغذية القادم من مسخن التغذية E-403 والذي لا يدخل الفراغ الحلقي؟',
    options: [
      'يستخدم كغاز إخماد وتبريد (Quench Gas) للتحكم في درجات حرارة العامل المساعد في الطبقتين الثانية والثالثة',
      'يتم تصريفه فوراً كغاز تطهير خارج الوحدة',
      'يُحقن كوقود لمشاعل فرن الإصلاح',
      'يستخدم لتشغيل توربين غاز التخليق'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-15) على: "The remaining gas is available as quench gas to control the catalyst temperature in the second and third beds of the Converter."',
    technicalReference: 'دليل التشغيل - صفحة C-15',
    equipmentRef: 'r-401'
  },
  {
    id: 14,
    type: 'mcq',
    category: 'converter_r401_design',
    arabicCategory: 'تصميم مفاعل الأمونيا R-401 والطبقات الثلاث وحماية الغلاف',
    question: 'إلى أي درجة حرارة يتم تسخين الغاز الخارج من الفراغ الحلقي في مبادل المفاعل E-401 قبل دخوله الطبقة الأولى؟',
    options: [
      'إلى حوالي 400°C في جانب الغلاف لمبادل المفاعل Converter Exchanger (E-401)',
      'إلى حوالي 150°C فقط',
      'إلى 750°C بواسطة مشاعل لهب مباشر',
      'إلى 250°C في مبرد التطهير'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-16) على: "The gas leaving the Converter annular space is heated to about 400°C in the shell side of the Converter Exchanger (E-401) before being introduced into the first catalyst bed of the Converter."',
    technicalReference: 'دليل التشغيل - صفحة C-16',
    equipmentRef: 'e-401'
  },
  {
    id: 15,
    type: 'mcq',
    category: 'converter_r401_design',
    arabicCategory: 'تصميم مفاعل الأمونيا R-401 والطبقات الثلاث وحماية الغلاف',
    question: 'كيف يتم التحكم في درجات الحرارة داخل الطبقة الأولى (First Catalyst Bed) لمفاعل الأمونيا؟',
    options: [
      'عبر خطوط التجاوز (By-passing) لمسخن التغذية E-403، الفراغ الحلقي، ومبادل المفاعل E-401',
      'عن طريق حقن الماء السائل مباشرة فوق العامل المساعد',
      'بزيادة سرعة كباس التثليج K-401 فقط',
      'بإيقاف ضخ غاز التعويض بالكامل'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-16) على: "Temperatures in the first bed are controlled with by-passing of the Feed Preheater, the Converter annular space, and the Converter Exchanger."',
    technicalReference: 'دليل التشغيل - صفحة C-16',
    equipmentRef: 'r-401'
  },
  {
    id: 16,
    type: 'mcq',
    category: 'converter_r401_design',
    arabicCategory: 'تصميم مفاعل الأمونيا R-401 والطبقات الثلاث وحماية الغلاف',
    question: 'كيف يتم تبريد (Quenching) غازات المخرج الساخنة الناتجة من الطبقة الأولى قبل دخولها الطبقة الثانية؟',
    options: [
      'بخلطها بجزء من الغاز الأبرد القادم مباشرة من مسخن التغذية Feed Preheater (E-403)',
      'بتمريرها عبر حزمة أنابيب مبردة بالماء الصناعي',
      'بحقن النيتروجين السائل فائق البرودة',
      'بتوسيع الغاز فجائياً عبر صمام اختناق'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-16) على: "The hot effluent from the first catalyst bed is quenched (i.e. cooled) by mixing with a part of the cooler gas from the Feed Preheater before the mixture passes through the second catalyst bed."',
    technicalReference: 'دليل التشغيل - صفحة C-16',
    equipmentRef: 'r-401'
  },
  {
    id: 17,
    type: 'mcq',
    category: 'converter_r401_design',
    arabicCategory: 'تصميم مفاعل الأمونيا R-401 والطبقات الثلاث وحماية الغلاف',
    question: 'ما هي الطريقة المتبعة لتبريد تدفق مخرج الطبقة الثانية قبل دخوله الطبقة الثالثة في مفاعل R-401؟',
    options: [
      'بنفس الطريقة عبر الخلط المباشر مع تيار غاز التبريد الكظومي (Quench Gas) القادم من E-403',
      'بتدوير الغاز عبر مبردات التثليج بالأمونيا E-405',
      'بتبخير ماء المراجل داخل الطبقة',
      'بإخراج الغاز من المفاعل ثم إعادته بأنبوب خارجي'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-16) على: "In a similar manner the effluent from the second bed is quenched before passing to the third bed."',
    technicalReference: 'دليل التشغيل - صفحة C-16',
    equipmentRef: 'r-401'
  },
  {
    id: 18,
    type: 'mcq',
    category: 'converter_r401_design',
    arabicCategory: 'تصميم مفاعل الأمونيا R-401 والطبقات الثلاث وحماية الغلاف',
    question: 'ما هو التركيب الكيميائي الشائع للعامل المساعد المستخدم في سلة مفاعل الأمونيا R-401؟',
    options: [
      'الحديد المنشط بأكاسيد البوتاسيوم والألومنيوم والكالسيوم (Promoted Iron Catalyst: Fe / K₂O / Al₂O₃ / CaO)',
      'البلاتين والبالاديوم النقي المحمل على السيليكا',
      'أكسيد النيكل المحمل على الألومينا المقاومة للحرارة',
      'أكسيد النحاس والزنك المستخدم في مفاعل LTS'
    ],
    correctIndex: 0,
    explanation: 'عامل مساعد تخليق الأمونيا الكلاسيكي هو الحديد المروج (Promoted Magnetite Fe3O4) الذي يختزل إلى حديد معدني مروج ذي بنية بلورية مسامية نشطة ومستقرة تحت درجات الحرارة والضغوط العالية.',
    technicalReference: 'دليل التشغيل وقسم العامل المساعد - وحدة 400',
    equipmentRef: 'r-401'
  },
  {
    id: 19,
    type: 'mcq',
    category: 'converter_r401_design',
    arabicCategory: 'تصميم مفاعل الأمونيا R-401 والطبقات الثلاث وحماية الغلاف',
    question: 'ما هو الخطر الرئيسي المترتب على ارتفاع حرارة طبقات العامل المساعد في R-401 عن الحدود التصميمية القصوى؟',
    options: [
      'تلبد العامل المساعد (Catalyst Sintering)، فقدان المساحة السطحية النشطة، وحدوث تفكك عكسي للأمونيا',
      'تصلب الغاز وتحوله إلى سائل داخل الطبقة',
      'انفجار فوري لصمامات التنفيس في E-408',
      'توقف مفاجئ لكباس غاز التخليق K-301'
    ],
    correctIndex: 0,
    explanation: 'الحرارة الزائدة تؤدي إلى التلبد والالتحام المجهري لبلورات الحديد؛ مما يقلل المسامية السطحية ويدمر كفاءة التحويل بصورة دائمة، فضلاً عن انزياح التوازن الثرموديناميكي عكسياً نحو تفكك الأمونيا.',
    technicalReference: 'دليل التشغيل - صفحة C-16',
    equipmentRef: 'r-401'
  },
  {
    id: 20,
    type: 'mcq',
    category: 'converter_r401_design',
    arabicCategory: 'تصميم مفاعل الأمونيا R-401 والطبقات الثلاث وحماية الغلاف',
    question: 'ما هي وظيفة خط التجاوز الجانبي للمسخن الأولي للغاز وبطانة المفاعل (Converter Annular Space Bypass)؟',
    options: [
      'ضبط دقيق لحرارة مدخل الطبقة الأولى دون الإخلال بمعدل تدفق التبريد الكلي لغلاف المفاعل',
      'تصريف الضغط الزائد نحو الشعلة',
      'إدخال غاز النيتروجين النقي لغسل العامل المساعد',
      'تغذية مكثفات البخار إلى وعاء V-409'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-16) على أن ضبط درجات حرارة الطبقة الأولى يتم عبر مناورة خطوط التجاوز لـ E-403 والفراغ الحلقي ومبادل المفاعل E-401.',
    technicalReference: 'دليل التشغيل - صفحة C-16',
    equipmentRef: 'r-401'
  },
  {
    id: 21,
    type: 'mcq',
    category: 'converter_r401_design',
    arabicCategory: 'تصميم مفاعل الأمونيا R-401 والطبقات الثلاث وحماية الغلاف',
    question: 'ماذا يحدث لمعدل تحويل غاز التخليق إلى أمونيا في مفاعل R-401 عند زيادة ضغط التشغيل الكلي؟',
    options: [
      'يزداد معدل التحويل ونسبة الأمونيا الناتجة تماشياً مع قاعدة لوشاتيليه (تقليل عدد المولات الغازية: 4 مول -> 2 مول)',
      'ينخفض معدل التحويل بسبب زيادة الاحتكاك داخل الحبيبات',
      'لا يتأثر التفاعل بالضغط على الإطلاق',
      'يتفكك الغاز إلى هيدروجين ونيتروجين نقيين'
    ],
    correctIndex: 0,
    explanation: 'وفقاً لقاعدة لوشاتيليه، تفاعل تخليق الأمونيا (1N2 + 3H2 -> 2NH3) يصاحبه انخفاض في حجم ومولات الغاز من 4 إلى 2؛ لذا فإن زيادة الضغط تدفع التوازن نحو زيادة إنتاج الأمونيا.',
    technicalReference: 'دليل التشغيل - المبادئ الثرموديناميكية لوحدة 400',
    equipmentRef: 'r-401'
  },
  {
    id: 22,
    type: 'mcq',
    category: 'converter_r401_design',
    arabicCategory: 'تصميم مفاعل الأمونيا R-401 والطبقات الثلاث وحماية الغلاف',
    question: 'كم يبلغ عدد صمامات التحكم بخطوط الإخماد (Quench Valves) المغذية لمفاعل R-401 للطبقتين الثانية والثالثة؟',
    options: [
      'صمامان رئيسيان مستقلان لغاز الإخماد (صمام للطبقة 2 وصمام للطبقة 3)',
      'صمام واحد مشترك لجميع الطبقات',
      'أربعة صمامات لكل طبقة على حدة',
      'لا توجد صمامات إخماد بل ثقوب ثابتة'
    ],
    correctIndex: 0,
    explanation: 'تمتلك كل من الطبقة الثانية والطبقة الثالثة خط إخماد مستقل مع صمام تحكم حراري آلي موصول بغرفة السيطرة DCS للتحكم الدقيق في ملف درجات الحرارة.',
    technicalReference: 'دليل التشغيل ومخطط PFD 6112P-100-400-00',
    equipmentRef: 'r-401'
  },

  // =========================================================================
  // CATEGORY 3: شبكة المبادلات الحرارية واسترجاع الطاقة (E-401, E-402, E-403) [23-32]
  // =========================================================================
  {
    id: 23,
    type: 'mcq',
    category: 'heat_recovery_train',
    arabicCategory: 'شبكة المبادلات الحرارية واسترجاع الطاقة (E-401, E-402, E-403)',
    question: 'ما هو التسلسل الدقيق لمرور الغاز المتفاعل الحار الخارج من مفاعل الأمونيا R-401 عبر سلسلة مبادلات التبريد؟',
    options: [
      'يمر أولاً في E-401 ثم في مسخن ماء المرجل E-402 ثم في مسخن غاز التغذية E-403 ثم المكثفات المائية E-404',
      'يمر في المكثفات المائية E-404 أولاً ثم في مبادل المفاعل E-401',
      'يدخل مباشرة إلى فاصل الغاز الأولي V-401 بدون تبريد',
      'يمر في مبرد التثليج E-405 ثم في مرجل E-402'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-16/C-17) صراحة على: "The converted gas leaving the Converter is cooled in the Converter Exchanger, and further cooled in the Boiler Feedwater Preheater (E-402) before entering the tube side of the Feed Preheater (E-403)... flows through the Water Cooled Condensers (E-404 A,B)".',
    technicalReference: 'دليل التشغيل - صفحة C-16 و C-17',
    equipmentRef: 'e-401'
  },
  {
    id: 24,
    type: 'mcq',
    category: 'heat_recovery_train',
    arabicCategory: 'شبكة المبادلات الحرارية واسترجاع الطاقة (E-401, E-402, E-403)',
    question: 'ما هو المائع الممتص للحرارة داخل مبادل مسخن ماء تغذية المرجل E-402 (BFW Preheater)؟',
    options: [
      'مياه تغذية المراجل عالية الضغط (HP Boiler Feedwater) القادمة من مضخات P-101 لتسخينها إلى 200°C',
      'مياه التبريد الصناعي القادمة من أبراج التبريد',
      'غاز الأمونيا المبرد السائل',
      'محلول البوتاسيوم القادم من قسم Catacarb'
    ],
    correctIndex: 0,
    explanation: 'المبادل E-402 هو مبادل استرجاع حرارة تفاعل تخليق الأمونيا؛ حيث تسخن مياه المراجل عالية الضغط (BFW) من 150°C إلى 200°C قبل توجهها لحزمة الحمل الحراري في فرن الإصلاح E-105A.',
    technicalReference: 'دليل التشغيل - صفحة C-16 ومخطط BFW 100-103-00',
    equipmentRef: 'e-402'
  },
  {
    id: 25,
    type: 'mcq',
    category: 'heat_recovery_train',
    arabicCategory: 'شبكة المبادلات الحرارية واسترجاع الطاقة (E-401, E-402, E-403)',
    question: 'في أي جانب (Side) يمر الغاز المتفاعل الخارج من E-402 داخل مسخن غاز التغذية E-403؟',
    options: [
      'يمر في جانب الأنابيب (Tube Side) ليقوم بتسخين غاز التخليق المتدفق في جانب الغلاف (Shell Side)',
      'يمر في جانب الغلاف مع تدفق مياه التبريد في الأنابيب',
      'يمر في الفراغ الحلقي الخارجي المعزول',
      'لا يمر في E-403 بل يتجاوزه مباشرة'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-17) على: "before entering the tube side of the Feed Preheater (E-403) where it heats the synthesis gas going to the Converter."',
    technicalReference: 'دليل التشغيل - صفحة C-17',
    equipmentRef: 'e-403'
  },
  {
    id: 26,
    type: 'mcq',
    category: 'heat_recovery_train',
    arabicCategory: 'شبكة المبادلات الحرارية واسترجاع الطاقة (E-401, E-402, E-403)',
    question: 'إلى أي درجة حرارة يسخن غاز التخليق داخل جانب الغلاف لمسخن التغذية E-403 قبل دخوله للمفاعل R-401؟',
    options: [
      'يسخن إلى حوالي 148°C (heated to 148°C before entering the Ammonia Converter R-401)',
      'يسخن إلى 400°C',
      'يبرد إلى 2.2°C',
      'يسخن إلى 650°C'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-18) على: "The synthesis gas then passes through the shell side of the Feed Preheater for further heating to 148°C before entering the Ammonia Converter (R-401)."',
    technicalReference: 'دليل التشغيل - صفحة C-18',
    equipmentRef: 'e-403'
  },
  {
    id: 27,
    type: 'mcq',
    category: 'heat_recovery_train',
    arabicCategory: 'شبكة المبادلات الحرارية واسترجاع الطاقة (E-401, E-402, E-403)',
    question: 'ما هي الفائدة الاقتصادية والتشغيلية المزدوجة من سلسلة المبادلات E-401 و E-402 و E-403؟',
    options: [
      'استرجاع أقصى قدر من الطاقة الحرارية للتفاعل لتوليد البخار وتسخين الغاز الداخل، مع خفض حرارة الغاز لتسهيل تكثيف الأمونيا',
      'زيادة الضغط الكلي في الحلقة دون الحاجة للضاغط K-301',
      'فصل الأكسجين عن غاز التخليق كيميائياً',
      'منع حدوث ظاهرة الاندفاع في كباس التثليج K-401'
    ],
    correctIndex: 0,
    explanation: 'التفاعل باعث بشدة للحرارة؛ وتعمل شبكة المبادلات E-401..403 على استثمار هذه الحرارة بتسخين غاز التغذية ومياه المراجل مما يرفع الكفاءة الحرارية للمجمع ويخفض حمل مياه التبريد المطلوبة في E-404.',
    technicalReference: 'دليل التشغيل - صفحة C-16 و C-17',
    equipmentRef: 'e-401'
  },
  {
    id: 28,
    type: 'mcq',
    category: 'heat_recovery_train',
    arabicCategory: 'شبكة المبادلات الحرارية واسترجاع الطاقة (E-401, E-402, E-403)',
    question: 'ما هو المسخن المخصص لحالات بدء التشغيل (Start-up Heater H-401) وكيف يتم التعامل معه في وضع التشغيل الطبيعي (Normal Run)؟',
    options: [
      'فرن تسخين يبدأ به تسخين حلقة المفاعل حتى الوصول لحرارة التنشيط الذاتي، ويكون معزولاً ومغلقاً بالكامل مع فتح صمام بايباص J-401 أثناء التشغيل الطبيعي',
      'فرن يعمل بصفة دائمة على مدار 24 ساعة لتأمين حرارة المفاعل',
      'غلاية بخار كهربائية لتشغيل مكبس K-401',
      'مسخن يعمل بغاز الأمونيا السائل المتبخر'
    ],
    correctIndex: 0,
    explanation: 'تفاعل الأمونيا تفاعل ذاتي الحرارة (Autothermal) بمجرد وصوله للحرارة المستقرة؛ لذا يستخدم المسخن H-401 فقط عند بدء التشغيل وتنشيط العامل المساعد، ثم يعزل ويفتح خط التجاوز J-401.',
    technicalReference: 'دليل التشغيل ومخطط PFD لوحدة 400',
    equipmentRef: 'h-401'
  },
  {
    id: 29,
    type: 'mcq',
    category: 'heat_recovery_train',
    arabicCategory: 'شبكة المبادلات الحرارية واسترجاع الطاقة (E-401, E-402, E-403)',
    question: 'ما هي مؤشرات حدوث تسريب داخلي (Tube Leak) في أنابيب مبادل مياه المراجل E-402؟',
    options: [
      'دخول مياه المراجل عالية الضغط إلى حلقة التخليق؛ مما يسبب ارتفاعاً حاداً في ضغط الحلقة وتسمم العامل المساعد ببخار الماء',
      'انخفاض درجة حرارة المصلح الأولي R-101 فوراً',
      'توقف فوري لكباس الهواء K-302',
      'تجمد الأمونيا في المكثف E-412'
    ],
    correctIndex: 0,
    explanation: 'ضغط مياه المراجل في E-402 يقارب ضغط الحلقة أو يتجاوزه، وتعتبر الرطوبة والماء من أشد السموم للعامل المساعد للحديد النشط حيث تؤكسده وتفقده فعاليته، مما يتطلب إيقافاً طارئاً وفحصاً دقيقاً.',
    technicalReference: 'دليل التشغيل وإجراءات السلامة - وحدة 400',
    equipmentRef: 'e-402'
  },
  {
    id: 30,
    type: 'mcq',
    category: 'heat_recovery_train',
    arabicCategory: 'شبكة المبادلات الحرارية واسترجاع الطاقة (E-401, E-402, E-403)',
    question: 'ما هو نوع السريان (Flow Configuration) في مبادل المفاعل Converter Exchanger E-401؟',
    options: [
      'سريان متعاكس (Counter-current flow) لتحقيق أقصى كفاءة استرجاع حراري بين غاز المخرج الحار وغاز المدخل البارد',
      'سريان متوازي في نفس الاتجاه',
      'سريان شعاعي بدون فواصل توجيه',
      'سريان حلزوني عشوائي'
    ],
    correctIndex: 0,
    explanation: 'تصمم مبادلات استرجاع حرارة غاز التخليق بسريان متعاكس متقاطع مع فواصل توجيه (Baffles) لتحقيق أقصى فارق درجات حرارة لوغاريثمي (LMTD) ورفع حرارة غاز المدخل إلى 400°C.',
    technicalReference: 'دليل التشغيل - صفحة C-16',
    equipmentRef: 'e-401'
  },
  {
    id: 31,
    type: 'mcq',
    category: 'heat_recovery_train',
    arabicCategory: 'شبكة المبادلات الحرارية واسترجاع الطاقة (E-401, E-402, E-403)',
    question: 'ما هي مادة الصنع المستخدمة لأنابيب المبادلين E-401 و E-402 لتحمل درجات الحرارة والضغط العالي وهجوم الهيدروجين؟',
    options: [
      'سبائك الفولاذ الكروميوم - موليبدينوم المقاومة لتقصف وهجوم الهيدروجين (Cr-Mo Alloy Steel: 1.25Cr-0.5Mo / 2.25Cr-1Mo وفق منحنيات نيلسون)',
      'الفولاذ الكربوني العادي غير المعالج',
      'سبائك الألومنيوم الخفيفة',
      'النحاس الأصفر العادي'
    ],
    correctIndex: 0,
    explanation: 'نظراً لوجود الهيدروجين تحت ضغوط تتجاوز 150-200 bar وحرارة تتعدى 350-450°C، يجب استخدام سبائك Cr-Mo المعتمدة في معايير API 941 (منحنيات نيلسون Nelson Curves) لمنع نزع الكربنة وهجوم الهيدروجين.',
    technicalReference: 'المواصفات المعدنية لوحدة تخليق الأمونيا 400',
    equipmentRef: 'e-401'
  },
  {
    id: 32,
    type: 'mcq',
    category: 'heat_recovery_train',
    arabicCategory: 'شبكة المبادلات الحرارية واسترجاع الطاقة (E-401, E-402, E-403)',
    question: 'كيف تتم مراقبة كفاءة التبادل الحراري في سلسلة E-401 و E-402 و E-403 عبر نظام الـ DCS؟',
    options: [
      'بالمراقبة المستمرة لدرجات حرارة الدخول والخروج وفروق الضغط (ΔP) وتغير معامل انتقال الحرارة الإجمالي (U-value)',
      'فقط بمشاهدة لون أنابيب المبادلات الخارجية بالعين المجردة',
      'بقياس مستوى الزيت في كباس K-301',
      'بفحص تركيز غاز الميثان في فرن الإصلاح'
    ],
    correctIndex: 0,
    explanation: 'تزود المبادلات بنقاط قياس حرارة (TI) ونقاط قياس ضغط تفاضلي (PDI) على جانبي الأنابيب والغلاف للكشف المبكر عن أي تلوث أو ترسبات أو انسدادات تؤثر على استرجاع الطاقة.',
    technicalReference: 'دليل التشغيل ونظام السيطرة DCS - وحدة 400',
    equipmentRef: 'e-403'
  },

  // =========================================================================
  // CATEGORY 4: التكثيف الأولي بمياه التبريد وفاصل V-401 وخزان التخفيف V-409 [33-42]
  // =========================================================================
  {
    id: 33,
    type: 'mcq',
    category: 'primary_condensing',
    arabicCategory: 'التكثيف الأولي بمياه التبريد وفاصل V-401 وخزان التخفيف V-409',
    question: 'ما هو وسيط التبريد المستخدم في المكثفات الأولية (Water Cooled Condensers E-404 A,B)؟',
    options: [
      'مياه التبريد الصناعية (Cooling Water) المتداولة من محطة أبراج التبريد',
      'الأمونيا السائلة المتبخرة عند ضغط 0.2 bar',
      'غاز النيتروجين المبرد',
      'محلول الكاتاكارب المنشط'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-17) صراحة على: "The converted gas leaving the Feed Preheater flows through the Water Cooled Condensers (E-404 A,B) where about 35% of the Ammonia product is condensed."',
    technicalReference: 'دليل التشغيل - صفحة C-17',
    equipmentRef: 'e-404'
  },
  {
    id: 34,
    type: 'mcq',
    category: 'primary_condensing',
    arabicCategory: 'التكثيف الأولي بمياه التبريد وفاصل V-401 وخزان التخفيف V-409',
    question: 'أين يتم فصل الأمونيا السائلة المتكثفة أولياً عن غاز التدوير غير المتكثف بعد خروجها من E-404 A,B؟',
    options: [
      'في الفاصل الأولي (Primary Separator V-401)',
      'في وعاء التثليج V-408',
      'في فاصل السحب للمرحلة الثالثة V-407',
      'في برج نزع الغازات V-103'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-17) على: "The condensed liquid ammonia is then separated from the recycle gas in the Primary Separator (V-401)."',
    technicalReference: 'دليل التشغيل - صفحة C-17',
    equipmentRef: 'v-401'
  },
  {
    id: 35,
    type: 'mcq',
    category: 'primary_condensing',
    arabicCategory: 'التكثيف الأولي بمياه التبريد وفاصل V-401 وخزان التخفيف V-409',
    question: 'إلى أي ضغط يتم تخفيض (Let down) ضغط الأمونيا السائلة الخارجة من الفاصل الأولي V-401 أثناء تدفقها إلى خزان التخفيف V-409؟',
    options: [
      'يتم تخفيضه إلى حوالي 21 kg/cm²G في خزان التخفيف Letdown Tank (V-409)',
      'يتم تخفيضه إلى الضغط الجوي 0 kg/cm²G فوراً',
      'يبقى عند ضغط الحلقة الكامل 220 kg/cm²G',
      'يرفع إلى 300 kg/cm²G'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-17) على: "The liquid ammonia is let down, decreasing to about 21 Kg/cm²G, as it flows into the Letdown Tank (V-409)."',
    technicalReference: 'دليل التشغيل - صفحة C-17',
    equipmentRef: 'v-409'
  },
  {
    id: 36,
    type: 'mcq',
    category: 'primary_condensing',
    arabicCategory: 'التكثيف الأولي بمياه التبريد وفاصل V-401 وخزان التخفيف V-409',
    question: 'ما هي الوظيفة الفيزيائية الأساسية لخزان التخفيف Letdown Tank (V-409)؟',
    options: [
      'فصل وتبخير الغازات الذائبة (Flashed Dissolved Gases) والتخلص منها قبل إرسال الأمونيا السائلة لقسم التثليج',
      'تسخين الأمونيا لدرجة الغليان',
      'إعادة كبس الأمونيا وإعادتها للمصلح الأولي',
      'تخزين الأمونيا لمدة 30 يوماً متواصلة'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-18) على: "where the dissolved gases are flashed from the product before it is sent to the Refrigeration Section."',
    technicalReference: 'دليل التشغيل - صفحة C-18',
    equipmentRef: 'v-409'
  },
  {
    id: 37,
    type: 'mcq',
    category: 'primary_condensing',
    arabicCategory: 'التكثيف الأولي بمياه التبريد وفاصل V-401 وخزان التخفيف V-409',
    question: 'أين يتجه الغاز المتبقي غير المتكثف الخارج من قمة الفاصل الأولي Primary Separator (V-401)؟',
    options: [
      'يعود إلى قسم الكبس (Compression Section) كغاز تدوير (Recycle Gas) لسحب مرحلة التدوير بضاغط K-301',
      'يصرف إلى الغلاف الجوي كعادم',
      'يرسل مباشرة إلى خزانات الأمونيا الكروية F-401',
      'يحقن في أبراج التبريد المائية'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-17) على: "The remaining gas leaving the Primary Separator returns to the Compression Section as recycle gas."',
    technicalReference: 'دليل التشغيل - صفحة C-17',
    equipmentRef: 'v-401'
  },
  {
    id: 38,
    type: 'mcq',
    category: 'primary_condensing',
    arabicCategory: 'التكثيف الأولي بمياه التبريد وفاصل V-401 وخزان التخفيف V-409',
    question: 'كيف يتم التحكم في منسوب السائل (Liquid Level) في قعر الفاصل الأولي V-401؟',
    options: [
      'بواسطة صمام تحكم بالمنسوب (LIC) ينظم تصريف الأمونيا السائلة إلى خزان V-409 ويمنع هروب الغاز عالي الضغط',
      'بالتفريغ اليدوي المتقطع كل 8 ساعات',
      'بإيقاف تدفق مياه التبريد إلى E-404',
      'بتغيير سرعة دوران محرك مضخة P-101'
    ],
    correctIndex: 0,
    explanation: 'يعمل صمام التحكم بالمنسوب LIC على الحفاظ على سدادة هيدروليكية من السائل (Liquid Seal) في قعر V-401 لمنع تسرب الغاز فائق الضغط إلى خزان V-409 المصمم لضغط 21 kg/cm²G.',
    technicalReference: 'دليل التشغيل ومخطط التحكم DCS - وحدة 400',
    equipmentRef: 'v-401'
  },
  {
    id: 39,
    type: 'mcq',
    category: 'primary_condensing',
    arabicCategory: 'التكثيف الأولي بمياه التبريد وفاصل V-401 وخزان التخفيف V-409',
    question: 'ما هو الخطر التشغيلي الجسيم إذا فشل صمام تصريف قعر V-401 وظل مفتوحاً بالكامل (Fail Open)؟',
    options: [
      'هروب غاز حلقة التخليق عالي الضغط (Blow-through) إلى خزان التخفيف V-409 مما يهدد بتجاوز ضغطه التصميمي وانفتاق صمامات الأمان',
      'تجمد الأمونيا داخل المكثفات E-404',
      'ارتفاع منسوب المياه في برج التبريد',
      'فقدان التزييت في كباس K-401'
    ],
    correctIndex: 0,
    explanation: 'ظاهرة الـ Gas Blow-through من وعاء بضغط 200 bar إلى وعاء بضغط 21 bar تمثل خطراً تشغيلياً جسيماً، لذا يزود الوعاء بإنترلوك إغلاق طارئ عند انخفاض المنسوب (Low Level Trip).',
    technicalReference: 'دليل أنظمة السلامة والإنترلوك لوحدة 400',
    equipmentRef: 'v-401'
  },
  {
    id: 40,
    type: 'mcq',
    category: 'primary_condensing',
    arabicCategory: 'التكثيف الأولي بمياه التبريد وفاصل V-401 وخزان التخفيف V-409',
    question: 'ما هي الأجهزة الداخلية المزود بها الفاصل الأولي V-401 لمنع حمل قطرات السائل مع الغاز المنصرف للضاغط؟',
    options: [
      'مانع رذاذ شبكي سلكي فائق الكفاءة (Demister Wire Mesh Pad) وعاكسات تشتيت الدخول',
      'صواني تقطير مثقبة',
      'مرشحات رملية داخلية',
      'مراوح طرد ميكانيكية داخلية'
    ],
    correctIndex: 0,
    explanation: 'يزود الوعاء V-401 بـ Demister Pad عالية الكفاءة لفصل قطرات الأمونيا السائلة وحماية غلاف ضاغط غاز التخليق K-301 (مرحلة التدوير) من دخول أي سوائل قد تؤدي لتحطيم الريش.',
    technicalReference: 'دليل المواصفات الميكانيكية للأوعية - وحدة 400',
    equipmentRef: 'v-401'
  },
  {
    id: 41,
    type: 'mcq',
    category: 'primary_condensing',
    arabicCategory: 'التكثيف الأولي بمياه التبريد وفاصل V-401 وخزان التخفيف V-409',
    question: 'لماذا صممت المكثفات E-404 في شكل هيكلين متوازيين (E-404 A,B)؟',
    options: [
      'لتوزيع الحمل الحراري الهائل، وتقليل هبوط الضغط، وتسهيل أعمال التنظيف والصيانة الدورية لمسار مياه التبريد',
      'لأن أحد الهيكلين مخصص للنيتروجين والآخر للهيدروجين',
      'لأن أحدهما يعمل بالبخار والآخر بالماء',
      'للاحتفاظ بهيكل واحد كاحتياط مغلق دائماً'
    ],
    correctIndex: 0,
    explanation: 'يعمل E-404 A و B بالتوازي لتقليل هبوط الضغط (Pressure Drop) في حلقة التخليق وتأمين مساحة تبادل حراري كافية للتعامل مع التدفق الغازي الضخم القادم من المفاعل.',
    technicalReference: 'دليل التشغيل ومخطط PFD لوحدة 400',
    equipmentRef: 'e-404'
  },
  {
    id: 42,
    type: 'mcq',
    category: 'primary_condensing',
    arabicCategory: 'التكثيف الأولي بمياه التبريد وفاصل V-401 وخزان التخفيف V-409',
    question: 'ما هي درجة الحرارة التقريبية للغاز الخارج من المكثفات المائية E-404 A,B والداخل إلى الفاصل V-401 في الظروف التصميمية؟',
    options: [
      'بين 35°C إلى 38°C (اعتماداً على درجة حرارة مياه التبريد الصيفية والشتوية)',
      'تحت الصفر المئوي (-15°C)',
      'أعلى من 120°C',
      'حوالي 4°C بالضبط'
    ],
    correctIndex: 0,
    explanation: 'حرارة التبريد المائي تحكمها حرارة مياه التبريد الصناعية القادمة من الأبراج (حوالي 30-32°C صيفاً)، مما يتيح تبريد الغاز إلى حدود 35-38°C وتكثيف حوالي 35% من الأمونيا.',
    technicalReference: 'دليل التشغيل وبيانات PFD - صفحة C-17',
    equipmentRef: 'e-404'
  },

  // =========================================================================
  // CATEGORY 5: التكثيف الثانوي والتبريد بالأمونيا (E-407, E-405, E-406, V-402) [43-54]
  // =========================================================================
  {
    id: 43,
    type: 'mcq',
    category: 'secondary_condensing',
    arabicCategory: 'التكثيف الثانوي والتبريد بالأمونيا (E-407, E-405, E-406, V-402)',
    question: 'إلى أي درجة حرارة يتم تبريد غاز التدوير القادم من مرحلة تدوير الكباس في جانب الغلاف لمبادل التبادل البارد E-407 (Cold Exchanger)؟',
    options: [
      'يتم تبريده إلى 26.5°C بالتبادل الحراري مع الغاز البارد القادم من الفاصل الثانوي V-402',
      'يتم تبريده إلى -33°C',
      'يسخن إلى 100°C',
      'يبرد إلى 0°C بواسطة مياه التبريد'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-18) على: "Recycle gas from the circulator section of the Synthesis Gas Compressor is cooled to 26.5°C in the shell side of the Cold Exchanger (E-407) by heat exchange with the cold gas from the Secondary Separator (V-402)."',
    technicalReference: 'دليل التشغيل - صفحة C-18',
    equipmentRef: 'e-407'
  },
  {
    id: 44,
    type: 'mcq',
    category: 'secondary_condensing',
    arabicCategory: 'التكثيف الثانوي والتبريد بالأمونيا (E-407, E-405, E-406, V-402)',
    question: 'إلى أي درجة حرارة يتم تبريد تيار الغاز بعد خروجه من E-407 داخل مكثف الأمونيا المبرد بالأمونيا الأولي (E-405)؟',
    options: [
      'يتم تبريده إلى 14°C في مكثف الأمونيا الأولي (Primary Ammonia-Cooled Condenser E-405)',
      'يتم تبريده إلى 50°C',
      'يتم تبريده إلى -10°C',
      'يبقى عند 26.5°C دون تغيير'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-18) على: "is further cooled to 14°C in the Primary Ammonia-Cooled Condenser (E-405), condensing more ammonia."',
    technicalReference: 'دليل التشغيل - صفحة C-18',
    equipmentRef: 'e-405'
  },
  {
    id: 45,
    type: 'mcq',
    category: 'secondary_condensing',
    arabicCategory: 'التكثيف الثانوي والتبريد بالأمونيا (E-407, E-405, E-406, V-402)',
    question: 'إلى أي درجة حرارة نهائية يتم تبريد مزيج غاز التدوير وغاز التعويض داخل مكثف الأمونيا الثانوي (E-406)؟',
    options: [
      'يتم تبريد المزيج إلى 2.2°C (cooled to 2.2°C)',
      'يبرد إلى 18°C',
      'يبرد إلى -35°C',
      'يسخن إلى 40°C'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-18) على: "The mixture is then cooled to 2.2°C, and more ammonia is condensed so that approximately 4% ammonia remain in the gas phase."',
    technicalReference: 'دليل التشغيل - صفحة C-18',
    equipmentRef: 'e-406'
  },
  {
    id: 46,
    type: 'mcq',
    category: 'secondary_condensing',
    arabicCategory: 'التكثيف الثانوي والتبريد بالأمونيا (E-407, E-405, E-406, V-402)',
    question: 'أين يتم فصل الأمونيا السائلة الناتجة من مرحلة التكثيف الثانوي عند 2.2°C؟',
    options: [
      'في الفاصل الثانوي (Secondary Separator V-402)',
      'في الفاصل الأولي V-401',
      'في فاصل السحب V-406',
      'في وعاء مستلم التثليج V-408'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-18) على: "Liquid ammonia is separated from the gas stream in the Secondary Separator (V-402) and then sent to Letdown Tank (V-409)."',
    technicalReference: 'دليل التشغيل - صفحة C-18',
    equipmentRef: 'v-402'
  },
  {
    id: 47,
    type: 'mcq',
    category: 'secondary_condensing',
    arabicCategory: 'التكثيف الثانوي والتبريد بالأمونيا (E-407, E-405, E-406, V-402)',
    question: 'إلى أين ترسل الأمونيا السائلة المفصولة في قعر كل من الفاصلين V-401 و V-402؟',
    options: [
      'ترسل كلاهما إلى خزان التخفيف Letdown Tank (V-409) مع تخفيض ضغطهما إلى 21 kg/cm²G',
      'ترسل مباشرة إلى برج التبريد المائي',
      'ترسل إلى سحب كباس غاز التخليق K-301',
      'ترسل كوقود إلى فرن H-401'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-18) على: "Product ammonia collected in both the Primary and Secondary Separators is let down in pressure to 21 Kg/cm²G in the Letdown Tank (V-409)".',
    technicalReference: 'دليل التشغيل - صفحة C-18',
    equipmentRef: 'v-409'
  },
  {
    id: 48,
    type: 'mcq',
    category: 'secondary_condensing',
    arabicCategory: 'التكثيف الثانوي والتبريد بالأمونيا (E-407, E-405, E-406, V-402)',
    question: 'أين يتجه بخار غاز التخليق البارد (عند حوالي 2.2°C) الخارج من قمة الفاصل الثانوي V-402 وإلى أي حرارة يعاد تسخينه أولاً؟',
    options: [
      'يعود إلى جانب الأنابيب لمبادل E-407 لإعادة تسخينه إلى 50°C (reheating to 50°C)',
      'يدخل مباشرة إلى مفاعل R-401 بحرارة 2.2°C',
      'يذهب إلى شعلة المحطة Flare',
      'يسخن في E-404 إلى 200°C'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-18) على: "The mixed synthesis gas vapor (at about 2.2°C) from the Secondary Separator returns to the tube side of the Cold Exchanger for reheating to 50°C."',
    technicalReference: 'دليل التشغيل - صفحة C-18',
    equipmentRef: 'e-407'
  },
  {
    id: 49,
    type: 'mcq',
    category: 'secondary_condensing',
    arabicCategory: 'التكثيف الثانوي والتبريد بالأمونيا (E-407, E-405, E-406, V-402)',
    question: 'ما هو المسار الذي يسلكه غاز التخليق بعد إعادة تسخينه إلى 50°C في E-407 قبل وصوله لمدخل المفاعل R-401؟',
    options: [
      'يمر عبر جانب الغلاف لمسخن التغذية E-403 ليرتفع تسخينه إلى 148°C ثم يدخل المفاعل',
      'يمر مباشرة إلى شعلة المحطة',
      'يعود إلى كباس K-301 لضغطه من جديد',
      'يمر في مكثف البخار السطحي'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-18) على: "The synthesis gas then passes through the shell side of the Feed Preheater for further heating to 148°C before entering the Ammonia Converter (R-401)."',
    technicalReference: 'دليل التشغيل - صفحة C-18',
    equipmentRef: 'e-403'
  },
  {
    id: 50,
    type: 'mcq',
    category: 'secondary_condensing',
    arabicCategory: 'التكثيف الثانوي والتبريد بالأمونيا (E-407, E-405, E-406, V-402)',
    question: 'لماذا يعد مبادل التبادل البارد Cold Exchanger E-407 عنصراً محورياً في كفاءة منظومة الطاقة بحلقة التخليق؟',
    options: [
      'لأنه يسترجع البرودة الفائقة للغاز الخارج من V-402 عند 2.2°C لتبريد غاز التدوير القادم إلى 26.5°C؛ مما يوفر طاقة تثليج ضخمة على كباس K-401',
      'لأنه يقوم بتوليد بخار عالي الضغط للمصنع',
      'لأنه يمنع تراكم زيت التزييت في المفاعل',
      'لأنه يقوم بتحليل غاز الأمونيا كيميائياً'
    ],
    correctIndex: 0,
    explanation: 'مبادل E-407 هو مبادل استرجاع حراري/تبريدي (Economizer / Heat Integrator) يقلل الحمل الحراري المطلوب على مكثفات التثليج E-405 و E-406 إلى أقصى حد ممكن.',
    technicalReference: 'دليل التشغيل ومبادئ استرجاع الطاقة - صفحة C-18',
    equipmentRef: 'e-407'
  },
  {
    id: 51,
    type: 'mcq',
    category: 'secondary_condensing',
    arabicCategory: 'التكثيف الثانوي والتبريد بالأمونيا (E-407, E-405, E-406, V-402)',
    question: 'ما هو وسيط التبريد المتبخر في الجانب البارد لمكثف الأمونيا الأولي E-405 وما هو ضغطه التشغيلي؟',
    options: [
      'الأمونيا السائلة المتبخرة عند ضغط 4.9 kg/cm²G ودرجة حرارة حوالي 8.0°C',
      'مياه التبريد الصناعية بضغط 4.0 kg/cm²G',
      'الفريون R-134a بضغط 15 bar',
      'مكثفات البخار منزوعة الأملاح'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-19) على: "4.9 Kg/cm²G Level: In the Primary Ammonia Cooled Condenser (E-405)... are partially vaporized at about 8.0°C and 4.9 Kg/cm²G."',
    technicalReference: 'دليل التشغيل - صفحة C-19',
    equipmentRef: 'e-405'
  },
  {
    id: 52,
    type: 'mcq',
    category: 'secondary_condensing',
    arabicCategory: 'التكثيف الثانوي والتبريد بالأمونيا (E-407, E-405, E-406, V-402)',
    question: 'ما هو وسيط التبريد المتبخر في الجانب البارد لمكثف الأمونيا الثانوي E-406 وما هو ضغطه التشغيلي؟',
    options: [
      'الأمونيا السائلة المنسابة من E-405 وتتبخر جزئياً عند ضغط 2.8 إلى 2.9 kg/cm²G وحرارة حوالي -4.0°C',
      'مياه مثلجة بحرارة +10°C',
      'غاز الميثانول المتكثف',
      'النيتروجين السائل عند -196°C'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-19) على: "2.8 Kg/cm²G Level: In the Secondary Ammonia Cooled Condenser (E-406) liquid ammonia cascaded from the Primary Ammonia Cooled Condenser is partially vaporized at about -4.0°C and 2.9 Kg/cm²G."',
    technicalReference: 'دليل التشغيل - صفحة C-19',
    equipmentRef: 'e-406'
  },
  {
    id: 53,
    type: 'mcq',
    category: 'secondary_condensing',
    arabicCategory: 'التكثيف الثانوي والتبريد بالأمونيا (E-407, E-405, E-406, V-402)',
    question: 'ما الذي يضمن عدم انتقال وتطاير قطرات الأمونيا السائلة مع تيار الغاز المتجه من الفاصل V-402 إلى أنابيب E-407؟',
    options: [
      'مانع رذاذ شبكي سلكي فائق الكفاءة (Demister Pad) وسرعة تدفق غاز منخفضة ومحسوبة في منطقة الفصل العليا',
      'تسخين قمة الفاصل بملف بخاري',
      'إبقاء الفاصل فارغاً بدون أي سائل',
      'إضافة مواد كيميائية خافضة للتوتر السطحي'
    ],
    correctIndex: 0,
    explanation: 'الفواصل الباردة V-402 مصممة بأقطار واسعة لتقليل السرعة السطحية للغاز مع شبكة Demister قوية لمنع حمل القطرات الباردة وإتلاف أسطح التبادل الحراري في E-407.',
    technicalReference: 'المواصفات التصميمية للأوعية الباردة - وحدة 400',
    equipmentRef: 'v-402'
  },
  {
    id: 54,
    type: 'mcq',
    category: 'secondary_condensing',
    arabicCategory: 'التكثيف الثانوي والتبريد بالأمونيا (E-407, E-405, E-406, V-402)',
    question: 'ما هي النتيجة التشغيلية المباشرة لانخفاض كفاءة التبريد في E-405 و E-406 وارتفاع حرارة مخرج V-402 عن 2.2°C؟',
    options: [
      'انخفاض كمية الأمونيا المتكثفة، وارتفاع تركيز الأمونيا الغازية العائدة للمفاعل عن 4%، مما يقلل دافع التحويل في R-401 ويخفض الإنتاج',
      'توقف فوري لكباس الهواء K-302',
      'انفجار فوري في أنابيب مياه المرجل E-402',
      'ارتفاع نقاوة الأمونيا المنتجة إلى 100%'
    ],
    correctIndex: 0,
    explanation: 'كلما ارتفعت حرارة مخرج V-402، تزداد نسبة الأمونيا غير المتكثفة المتبقية في الغاز العائد للمفاعل (أكثر من 4%)، مما يقلل معدل التفاعل في R-401 ويزيد عبء التدوير على كباس K-301.',
    technicalReference: 'دليل التشغيل وتحليل أداء حلقة التخليق - صفحة C-18',
    equipmentRef: 'e-406'
  },

  // =========================================================================
  // CATEGORY 6: غاز التطهير Purge Gas ومنظومة التنفيس والاسترجاع [55-64]
  // =========================================================================
  {
    id: 55,
    type: 'mcq',
    category: 'purge_vent_recovery',
    arabicCategory: 'غاز التطهير Purge Gas ومنظومة التنفيس والاسترجاع',
    question: 'من أين يتم استخلاص تيار غاز التطهير (Purge Gas Stream) في حلقة التخليق ولماذا؟',
    options: [
      'يستخلص جزء من تيار غاز التدوير (Recycle Gas) للمحافظة على نسبة الغازات الخاملة عند حوالي 10%',
      'يستخلص من مخرج المصلح الأولي مباشرة',
      'يستخلص من قعر خزان التخفيف V-409',
      'يستخلص من عادم التوربين KT-301'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-17) على: "A part of the recycle gas is extracted as the purge gas to maintain inert gas level in the recycle gas at about 10%."',
    technicalReference: 'دليل التشغيل - صفحة C-17',
    equipmentRef: 'v-403'
  },
  {
    id: 56,
    type: 'mcq',
    category: 'purge_vent_recovery',
    arabicCategory: 'غاز التطهير Purge Gas ومنظومة التنفيس والاسترجاع',
    question: 'كيف يتم استرجاع بخار الأمونيا الثمين الموجود في تيار غاز التطهير المستخلص؟',
    options: [
      'بتبريده وتثليجه في مكثف غاز التطهير Purge Condenser (E-408) بواسطة الأمونيا السائلة القادمة من مستلم التثليج V-408',
      'بحرق الغاز كاملاً مع الأمونيا في الشعلة',
      'بامتصاص الأمونيا في حمض الكبريتيك المركز',
      'بغسل الغاز بالزيت المعدني الثقيل'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-17) على: "To recover ammonia vapor contained in the purge stream, the gas is chilled in the Purge Condenser (E-408) by liquid ammonia from the Refrigeration Receiver (V-408) in the Refrigeration Section."',
    technicalReference: 'دليل التشغيل - صفحة C-17',
    equipmentRef: 'e-408'
  },
  {
    id: 57,
    type: 'mcq',
    category: 'purge_vent_recovery',
    arabicCategory: 'غاز التطهير Purge Gas ومنظومة التنفيس والاسترجاع',
    question: 'أين يتم فصل الأمونيا المتكثفة من غاز التطهير وإلى أين تتدفق السوائل المفصولة؟',
    options: [
      'تفصل في فاصل غاز التطهير (Purge Gas Separator V-403) وتتدفق السوائل إلى خزان التخفيف Letdown Tank (V-409)',
      'تفصل في الفاصل الأولي V-401 وتتدفق للبحر',
      'تفصل في الفاصل V-406 وتضخ لفرن الإصلاح',
      'تتبخر وتطرد للهواء الجوي'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-17) على: "The condensed ammonia is separated in the Purge Gas Separator (V-403) and flows into the Letdown Tank."',
    technicalReference: 'دليل التشغيل - صفحة C-17',
    equipmentRef: 'v-403'
  },
  {
    id: 58,
    type: 'mcq',
    category: 'purge_vent_recovery',
    arabicCategory: 'غاز التطهير Purge Gas ومنظومة التنفيس والاسترجاع',
    question: 'ما هي المعالجة والوجهة النهائية لغاز التطهير المفصول من قمة الوعاء V-403؟',
    options: [
      'يسخن في مسخن غاز التطهير ذي الغلاف المزدوج (E-416) ثم يرسل كغاز وقود عالي القيمة الحرارية إلى غلايات الضغط العالي (HP Boiler Unit)',
      'يبرد إلى -50°C ويرسل إلى خزان الأمونيا المبرد',
      'يحقن في شبكة مياه الشرب',
      'يرسل إلى كباس الهواء K-302'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-17) على: "The purge gas from the Purge Gas Separator is warmed in the Purge Gas Jacket Heater (E-416) flowing to the High Press. Boiler Unit."',
    technicalReference: 'دليل التشغيل - صفحة C-17',
    equipmentRef: 'e-416'
  },
  {
    id: 59,
    type: 'mcq',
    category: 'purge_vent_recovery',
    arabicCategory: 'غاز التطهير Purge Gas ومنظومة التنفيس والاسترجاع',
    question: 'كيف يتم استرجاع بخار الأمونيا المتطاير مع الغازات الخاملة المتحررة في خزان التخفيف V-409؟',
    options: [
      'بتبريدها في مكثف تنفيس الأمونيا (Ammonia Vent Condenser E-409) وفصل السائل في فاصل التنفيس (Vent Separator V-404)',
      'بإطلاقها للجو الخارجي مباشرة',
      'بحقن بخار ماء مباشر داخل خزان التخفيف',
      'بتكثيفها في المكثفات المائية E-404'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-18) على: "The flashed inert gases are cooled in the Ammonia Vent Condenser (E-409) to condense ammonia flashed over with the gases, and liquid ammonia is separated in the Vent Separator (V-404)."',
    technicalReference: 'دليل التشغيل - صفحة C-18',
    equipmentRef: 'e-409'
  },
  {
    id: 60,
    type: 'mcq',
    category: 'purge_vent_recovery',
    arabicCategory: 'غاز التطهير Purge Gas ومنظومة التنفيس والاسترجاع',
    question: 'إلى أين تتدفق الأمونيا السائلة المفصولة في فاصل التنفيس Vent Separator (V-404)؟',
    options: [
      'تتدفق إلى فاصل سحب المرحلة الأولى لكباس التثليج (First Stage Suction Separator V-405)',
      'تعود إلى المفاعل R-401',
      'تضخ إلى برج الامتصاص T-201',
      'تذهب إلى حفرة المعادلة الكيميائية'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-18) على: "Liquid ammonia from Vent Separator flows to the First Stage Suction Separator (V-405)."',
    technicalReference: 'دليل التشغيل - صفحة C-18',
    equipmentRef: 'v-404'
  },
  {
    id: 61,
    type: 'mcq',
    category: 'purge_vent_recovery',
    arabicCategory: 'غاز التطهير Purge Gas ومنظومة التنفيس والاسترجاع',
    question: 'ما هو مصير الغاز غير المتكثف المفصول من قمة فاصل التنفيس V-404؟',
    options: [
      'يُمزج مع غاز التطهير (Purge Gas) ويرسل إلى وحدة غلايات الضغط العالي (H.P. Boiler Unit) كوقود غازي',
      'يعاد إلى سحب ضاغط غاز التخليق K-301',
      'يضغط في كباس ثاني أكسيد الكربون',
      'يبرد ويخزن في اسطوانات غاز النيتروجين'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-18) على: "The separated gas is combined with the purge gas to be sent to the H.P. Boiler Unit."',
    technicalReference: 'دليل التشغيل - صفحة C-18',
    equipmentRef: 'v-404'
  },
  {
    id: 62,
    type: 'mcq',
    category: 'purge_vent_recovery',
    arabicCategory: 'غاز التطهير Purge Gas ومنظومة التنفيس والاسترجاع',
    question: 'لماذا يسخن غاز التطهير في المسخن ذي الغلاف المزدوج E-416 قبل إرساله إلى غلايات الضغط العالي؟',
    options: [
      'لتفادي وصول غاز بارد جداً قد يسبب تكثف أي قطرات متبقية وتآكل الأنابيب والمشاعل بالصدمات الحرارية',
      'لتحويل الميثان إلى هيدروجين',
      'لرفع ضغطه من 20 bar إلى 100 bar',
      'لتعقيم الغاز من البكتيريا'
    ],
    correctIndex: 0,
    explanation: 'الغاز خارج من المبادل E-408 والفاصل V-403 بدرجة حرارة شديدة البرودة (تقارب -30°C)؛ لذا يجب تسخينه في E-416 (بواسطة بخار أو ماء ساخن في الجاكيت) لرفع حرارته فوق نقطة الندى قبل دخوله خطوط وشبكات وقود الغلايات.',
    technicalReference: 'دليل التشغيل - صفحة C-17',
    equipmentRef: 'e-416'
  },
  {
    id: 63,
    type: 'mcq',
    category: 'purge_vent_recovery',
    arabicCategory: 'غاز التطهير Purge Gas ومنظومة التنفيس والاسترجاع',
    question: 'ما هي القيمة الحرارية العالية التي يتميز بها غاز التطهير (Purge Gas) المرسل إلى الغلايات؟',
    options: [
      'يحتوي على نسب مرتفعة من الهيدروجين (H₂ ~ 60-65%) والميثان (CH₄ ~ 15-20%)؛ مما يجعله وقوداً ممتازاً عالي القيمة الحرارية',
      'يحتوي فقط على غاز النيتروجين غير القابل للاشتعال',
      'يحتوي على ثاني أكسيد الكربون وبخار الماء فقط',
      'هو غاز خامل يطفئ اللهب'
    ],
    correctIndex: 0,
    explanation: 'غاز التطهير غني جداً بالهيدروجين والميثان المستخلصين من الحلقة بعد استرجاع معظم الأمونيا؛ مما يجعله وقوداً ممتازاً يوفر كميات هائلة من الغاز الطبيعي لغلايات البخار.',
    technicalReference: 'دليل التشغيل وموازنة الوقود - صفحة C-17',
    equipmentRef: 'e-416'
  },
  {
    id: 64,
    type: 'mcq',
    category: 'purge_vent_recovery',
    arabicCategory: 'غاز التطهير Purge Gas ومنظومة التنفيس والاسترجاع',
    question: 'ما هو وسيط التبريد المتبخر في كل من مكثف غاز التطهير E-408 ومكثف غاز التنفيس E-409؟',
    options: [
      'الأمونيا السائلة القادمة من مستلم التثليج V-408 وتتبخر عند أدنى مستوى ضغط (0.2 kg/cm²G وحرارة -30.0°C)',
      'مياه التبريد الصناعية بحرارة 30°C',
      'غاز الأمونيا عالي الضغط بحرارة 100°C',
      'البخار منخفض الضغط 3.5 bar'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-19) على: "0.2 Kg/cm²G Level: In the Purge Condenser (E-408) and in the Ammonia Vent Condenser (E-409) liquid ammonia from the Refrigeration Receiver is vaporized at about -30.0°C and 0.2 Kg/cm²G."',
    technicalReference: 'دليل التشغيل - صفحة C-19',
    equipmentRef: 'e-408'
  },

  // =========================================================================
  // CATEGORY 7: مستويات التثليج والتبخير الثلاثة (4.9, 2.8, 0.2 kg/cm²G) [65-74]
  // =========================================================================
  {
    id: 65,
    type: 'mcq',
    category: 'refrigeration_levels',
    arabicCategory: 'مستويات التثليج والتبخير الثلاثة (4.9, 2.8, 0.2 kg/cm²G)',
    question: 'كم يبلغ عدد مستويات الضغط ودرجة الحرارة لتبخير الأمونيا السائلة في قسم التثليج (Refrigeration Section)؟',
    options: [
      'ثلاثة مستويات ضغط وتبخير محددة (Three pressure levels: 4.9 و 2.8 و 0.2 kg/cm²G)',
      'مستوى ضغط واحد فقط لجميع المبادلات',
      'مستويان منفصلان فقط (عالي وواطئ)',
      'خمسة مستويات تبريد متتالية'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-19) بوضوح على: "The Refrigeration Section provides liquid ammonia refrigerant to cool synthesis gas process stream to lower temperatures by means of liquid ammonia evaporation at three pressure levels: 4.9, 2.8, 0.2 Kg/cm²G".',
    technicalReference: 'دليل التشغيل - صفحة C-19',
    equipmentRef: 'k-401'
  },
  {
    id: 66,
    type: 'mcq',
    category: 'refrigeration_levels',
    arabicCategory: 'مستويات التثليج والتبخير الثلاثة (4.9, 2.8, 0.2 kg/cm²G)',
    question: 'ما هي المعدات المستفيدة من مستوى التبخير الأول (4.9 kg/cm²G Level) وما هي درجة حرارته؟',
    options: [
      'مكثف الأمونيا المبرد بالأمونيا الأولي (E-405) حيث تتبخر الأمونيا جزئياً عند حوالي 8.0°C وضغط 4.9 kg/cm²G',
      'مكثف غاز التطهير E-408 عند -30°C',
      'مفاعل الأمونيا R-401 عند 400°C',
      'المكثف المائي E-404 عند 38°C'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-19) على: "4.9 Kg/cm²G Level: In the Primary Ammonia Cooled Condenser (E-405) refrigerant liquid ammonia from the Receiver (V-408) and the product ammonia from the Letdown Tank (V-409) are partially vaporized at about 8.0°C and 4.9 Kg/cm²G."',
    technicalReference: 'دليل التشغيل - صفحة C-19',
    equipmentRef: 'e-405'
  },
  {
    id: 67,
    type: 'mcq',
    category: 'refrigeration_levels',
    arabicCategory: 'مستويات التثليج والتبخير الثلاثة (4.9, 2.8, 0.2 kg/cm²G)',
    question: 'ما هي المعدات المستفيدة من مستوى التبخير الثاني (2.8 kg/cm²G Level) وما هي درجة حرارته؟',
    options: [
      'مكثف الأمونيا المبرد بالأمونيا الثانوي (E-406) حيث تتبخر الأمونيا المنسابة من E-405 عند حوالي -4.0°C وضغط 2.9 kg/cm²G',
      'مبادل التبادل البارد E-407',
      'خزان التخفيف V-409',
      'مسخن مياه المراجل E-402'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-19) على: "2.8 Kg/cm²G Level: In the Secondary Ammonia Cooled Condenser (E-406) liquid ammonia cascaded from the Primary Ammonia Cooled Condenser is partially vaporized at about -4.0°C and 2.9 Kg/cm²G."',
    technicalReference: 'دليل التشغيل - صفحة C-19',
    equipmentRef: 'e-406'
  },
  {
    id: 68,
    type: 'mcq',
    category: 'refrigeration_levels',
    arabicCategory: 'مستويات التثليج والتبخير الثلاثة (4.9, 2.8, 0.2 kg/cm²G)',
    question: 'ما هي المعدات المستفيدة من مستوى التبخير الثالث فائق البرودة (0.2 kg/cm²G Level) وما هي حرارته؟',
    options: [
      'مكثف غاز التطهير (E-408) ومكثف غاز التنفيس (E-409) حيث تتبخر الأمونيا عند حوالي -30.0°C وضغط 0.2 kg/cm²G',
      'مكثف الأمونيا الأولي E-405 عند +8°C',
      'المكثف المائي E-404 عند +35°C',
      'مبادل المفاعل E-401 عند +330°C'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-19) على: "0.2 Kg/cm²G Level: In the Purge Condenser (E-408) and in the Ammonia Vent Condenser (E-409) liquid ammonia from the Refrigeration Receiver is vaporized at about -30.0°C and 0.2 Kg/cm²G."',
    technicalReference: 'دليل التشغيل - صفحة C-19',
    equipmentRef: 'e-408'
  },
  {
    id: 69,
    type: 'mcq',
    category: 'refrigeration_levels',
    arabicCategory: 'مستويات التثليج والتبخير الثلاثة (4.9, 2.8, 0.2 kg/cm²G)',
    question: 'لماذا تم تقسيم دورة التثليج بالأمونيا إلى 3 مستويات ضغط بدلاً من التبخير بمستوى ضغط منخفض واحد؟',
    options: [
      'لتوفير طاقة الكبس الميكانيكية بضاغط K-401 إلى أقصى حد ممكن (Thermodynamic Exergy Optimization) عن طريق سحب كميات البخار عند أعلى ضغط ممكن',
      'لأن القوانين البيئية تمنع استخدام ضغط موحد',
      'لتبريد التوربين البخاري الدافع KT-401 بالماء المثلج',
      'لعدم توفر أنابيب تتحمل ضغطاً موحداً'
    ],
    correctIndex: 0,
    explanation: 'سحب الغاز المتبخر عند 4.9 kg/cm²G و 2.8 kg/cm²G يوفر طاقة كبس هائلة مقارنة بسحب كامل البخار عند الضغط المنخفض 0.2 kg/cm²G؛ حيث لا يضغط من الصفر إلا الجزء الذي احتاج فعلياً لدرجة -30°C.',
    technicalReference: 'دليل كفاءة منظومة التثليج - صفحة C-19 و C-21',
    equipmentRef: 'k-401'
  },
  {
    id: 70,
    type: 'mcq',
    category: 'refrigeration_levels',
    arabicCategory: 'مستويات التثليج والتبخير الثلاثة (4.9, 2.8, 0.2 kg/cm²G)',
    question: 'ما هي درجة حرارة الأمونيا السائلة المنتجة والجاهزة للضخ إلى خزانات التخزين الكروية من فاصل المرحلة الأولى V-405؟',
    options: [
      '-32°C (أمونيا مبردة عند حوالي -32°C تضخ بواسطة مضخات المنتج P-401 A,B إلى Ammonia Storage Tank)',
      '+25°C تحت الضغط العالي',
      '0°C بالضبط',
      '-50°C'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-19) صراحة على: "Product ammonia of -32°C is pumped to the Ammonia Storage Tank from the 1st Stage Suction Separator (V-405) by the Ammonia Product Pump (P-401AB)."',
    technicalReference: 'دليل التشغيل - صفحة C-19',
    equipmentRef: 'p-401'
  },
  {
    id: 71,
    type: 'mcq',
    category: 'refrigeration_levels',
    arabicCategory: 'مستويات التثليج والتبخير الثلاثة (4.9, 2.8, 0.2 kg/cm²G)',
    question: 'ما هو دور خزان مستلم سائل التثليج Refrigeration Receiver (V-408) في دورة التثليج؟',
    options: [
      'يستقبل الأمونيا السائلة المتكثفة بالجاذبية من مكثف الأمونيا E-412 ويغذي سوائل التبريد لمكثفات التثليج E-405 و E-408 و E-409 ونظام مانع الاندفاع',
      'يستقبل الغازات العادمة من مدخنة H-401',
      'يخزن غاز التخليق غير المعالج',
      'يغذي مياه التبريد لمكثفات E-404'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-21) على: "The liquid ammonia flows by gravity into the Refrigeration Receiver (V-408) from where it commences the evaporation cycle again by going to the Ammonia Cooled Condenser (E-405)."',
    technicalReference: 'دليل التشغيل - صفحة C-21',
    equipmentRef: 'v-408'
  },
  {
    id: 72,
    type: 'mcq',
    category: 'refrigeration_levels',
    arabicCategory: 'مستويات التثليج والتبخير الثلاثة (4.9, 2.8, 0.2 kg/cm²G)',
    question: 'كيف تنتقل الأمونيا السائلة بين مكثف E-405 ومكثف E-406 في شبكة التثليج؟',
    options: [
      'بانسياب تسلسلي هابط (Cascaded Flow) بتأثير فرق الضغط من المستوى الأعلى (4.9 kg) إلى المستوى الأدنى (2.9 kg)',
      'بمضخات طرد مركزي ميكانيكية عملاقة',
      'بضواغط هيدروليكية خاصة',
      'بالتبخير ثم إعادة التكثيف'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-19) على: "liquid ammonia cascaded from the Primary Ammonia Cooled Condenser is partially vaporized at about -4.0°C and 2.9 Kg/cm²G."',
    technicalReference: 'دليل التشغيل - صفحة C-19',
    equipmentRef: 'e-406'
  },
  {
    id: 73,
    type: 'mcq',
    category: 'refrigeration_levels',
    arabicCategory: 'مستويات التثليج والتبخير الثلاثة (4.9, 2.8, 0.2 kg/cm²G)',
    question: 'ما هي العلاقة الديناميكية الحرارية بين ضغط تبخير الأمونيا السائلة ودرجة حرارة غليانها؟',
    options: [
      'علاقة طردية مباشرة؛ كلما انخفض الضغط تنخفض درجة حرارة الغليان (عند 4.9 kg تكون +8°C، وعند 2.8 kg تكون -4°C، وعند 0.2 kg تصل إلى -30°C)',
      'علاقة عكسية؛ كلما انخفض الضغط ترتفع درجة الحرارة',
      'درجة الحرارة ثابتة دائماً عند 0°C بغض النظر عن الضغط',
      'يتغير الضغط دون أي تأثير على درجة الغليان'
    ],
    correctIndex: 0,
    explanation: 'وفقاً لخواص التشبع للأمونيا النقية (NH3 Saturation Curve)، فإن ضغط البخار المشبع يحدد بدقة درجة حرارة التبخر؛ لذا يتحكم كباس K-401 بضغوط السحب لضبط درجات حرارة التبريد بدقة.',
    technicalReference: 'دليل التشغيل وجداول تشبع الأمونيا - صفحة C-19',
    equipmentRef: 'k-401'
  },
  {
    id: 74,
    type: 'mcq',
    category: 'refrigeration_levels',
    arabicCategory: 'مستويات التثليج والتبخير الثلاثة (4.9, 2.8, 0.2 kg/cm²G)',
    question: 'ما الذي يتحكم في ثبات ضغط التبخير عند أدنى مستوى (0.2 kg/cm²G) لضمان عدم هبوطه لتحت الضغط الجوي (Vacuum)؟',
    options: [
      'التحكم في سرعة التوربين البخاري الدافع لكباس K-401 وصمامات مانع الاندفاع وتدوير الغاز المنظم لضغط السحب',
      'إغلاق صمامات السحب بالكامل',
      'ضخ مياه البحر إلى داخل فاصل السحب',
      'إيقاف ضاغط K-301 فوراً'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-21) على: "The first suction pressure is controlled by the speed of turbine... To ensure that each stage of the Refrigeration Compressor has sufficient vapor flow... anti-surge control valves are provided".',
    technicalReference: 'دليل التشغيل - صفحة C-21',
    equipmentRef: 'k-401'
  },

  // =========================================================================
  // CATEGORY 8: فواصل السحب وتدفق وتدرج السوائل ومضخات P-401 [75-84]
  // =========================================================================
  {
    id: 75,
    type: 'mcq',
    category: 'suction_separators_pumps',
    arabicCategory: 'فواصل السحب وتدفق وتدرج السوائل ومضخات P-401',
    question: 'ما هي الوظيفة المشتركة لفواصل السحب الثلاثية (Suction Separators V-405, V-406, V-407)؟',
    options: [
      'فصل قطرات الأمونيا السائلة تماماً عن البخار قبل دخوله إلى مراحل كباس التثليج K-401 لحماية الكباس من الصدمات الهيدروليكية',
      'تخزين الغاز الطبيعي المضغوط',
      'خلط مياه التبريد مع غاز التخليق',
      'تسخين الأمونيا لدرجات حرارة تفوق 200°C'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-20) على: "Vaporized ammonia, according to the pressure level, is passed through one of three stages of the Suction Separators (V-405, 406 and 407) to separate liquid before entering the Refrigeration Compressor (K-401)."',
    technicalReference: 'دليل التشغيل - صفحة C-20',
    equipmentRef: 'v-405'
  },
  {
    id: 76,
    type: 'mcq',
    category: 'suction_separators_pumps',
    arabicCategory: 'فواصل السحب وتدفق وتدرج السوائل ومضخات P-401',
    question: 'من أين يستقبل فاصل سحب المرحلة الثالثة (Third Stage Suction Separator V-407) بخار الأمونيا وأين يرسله؟',
    options: [
      'يستقبل بخار الأمونيا من E-405 ويرسله إلى نقطة السحب الجانبي (Side-stream suction) في الغلاف عالي الضغط لكباس K-401',
      'يستقبل البخار من E-408 ويرسله إلى كباس الهواء',
      'يستقبل الغاز من المصلح الثانوي R-103',
      'يستقبل عادم التوربين KT-401'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-20) على: "Ammonia vapor from the Primary Ammonia Cooled Condenser passes through the Third Stage Suction Separator (V-407) before entering at an side-stream suction point on the high pressure case of the Refrigeration Compressor."',
    technicalReference: 'دليل التشغيل - صفحة C-20',
    equipmentRef: 'v-407'
  },
  {
    id: 77,
    type: 'mcq',
    category: 'suction_separators_pumps',
    arabicCategory: 'فواصل السحب وتدفق وتدرج السوائل ومضخات P-401',
    question: 'كيف يتصرف فاصل سحب المرحلة الثالثة V-407 في حال تراكم أي سائل بداخله؟',
    options: [
      'يعمل الوعاء عادة بدون تدفق سائل؛ وإذا تشكل منسوب سائل فإنه ينساب تدريجياً (Cascaded) إلى فاصل سحب المرحلة الثانية V-406',
      'يصرف السائل فوراً إلى البحر',
      'يتبخر السائل تلقائياً بمشعل كهربائي داخلي',
      'يتم إيقاف المجمع بأكمله خلال 5 ثوان'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-20) على: "The Third Stage Suction Separator normally operates without liquid flow; if a liquid level does develop, it is cascaded into the Second Stage Suction Separator."',
    technicalReference: 'دليل التشغيل - صفحة C-20',
    equipmentRef: 'v-407'
  },
  {
    id: 78,
    type: 'mcq',
    category: 'suction_separators_pumps',
    arabicCategory: 'فواصل السحب وتدفق وتدرج السوائل ومضخات P-401',
    question: 'ما هي التيارات الغازية التي تجمع داخل فاصل سحب المرحلة الثانية (Second Stage Suction Separator V-406)؟',
    options: [
      'بخار الأمونيا من E-406 مع غاز الطرد الخارج من الغلاف منخفض الضغط (LP Case discharge) لكباس K-401 قبل دخولهما الغلاف عالي الضغط',
      'غاز التطهير مع غاز الوقود الطبيعي',
      'بخار الماء من نازع الغازات V-103',
      'غاز النيتروجين النقي فقط'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-20) على: "Ammonia vapor from the Secondary Ammonia Cooled Condenser passes through the Second Stage Suction Separator (V-406), where it combines with the discharge gas flow from the Refrigeration Compressor low pressure case, before entering the first suction point on the high pressure case".',
    technicalReference: 'دليل التشغيل - صفحة C-20',
    equipmentRef: 'v-406'
  },
  {
    id: 79,
    type: 'mcq',
    category: 'suction_separators_pumps',
    arabicCategory: 'فواصل السحب وتدفق وتدرج السوائل ومضخات P-401',
    question: 'إلى أين ينساب السائل المتكون في فاصل سحب المرحلة الثانية V-406 إذا ارتفع منسوبه؟',
    options: [
      'ينساب تدريجياً (Cascades) إلى فاصل سحب المرحلة الأولى (First Stage Suction Separator V-405)',
      'يضخ إلى المفاعل R-401',
      'يعاد إلى مكثف E-405',
      'يرسل إلى وحدة تحلية المياه'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-20) على: "The Second Stage Suction Separator normally operates without liquid flow, but if a liquid level develops, it cascades into the First Stage Suction Separator."',
    technicalReference: 'دليل التشغيل - صفحة C-20',
    equipmentRef: 'v-406'
  },
  {
    id: 80,
    type: 'mcq',
    category: 'suction_separators_pumps',
    arabicCategory: 'فواصل السحب وتدفق وتدرج السوائل ومضخات P-401',
    question: 'ما هي مصادر السوائل والأبخرة المتجمعة في فاصل سحب المرحلة الأولى First Stage Suction Separator (V-405)؟',
    options: [
      'أبخرة E-408 و E-409، وسوائل الأمونيا المنسابة بحرارة -4.0°C من E-406، وسوائل فاصلي التنفيس V-404 وغاز التطهير V-403',
      'مياه المراجل من P-101 فقط',
      'الغاز الطبيعي القادم من خط الأنابيب',
      'أبخرة عادم التوربين البخاري'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-20) على أن V-405 يستقبل أبخرة مكثفي E-408 و E-409، وتومض بداخله سوائل الأمونيا عند -4.0°C المنسابة من E-406 وسوائل الفاصلين V-404 و V-403.',
    technicalReference: 'دليل التشغيل - صفحة C-20',
    equipmentRef: 'v-405'
  },
  {
    id: 81,
    type: 'mcq',
    category: 'suction_separators_pumps',
    arabicCategory: 'فواصل السحب وتدفق وتدرج السوائل ومضخات P-401',
    question: 'ما هو مصير السائل المتبقي غير المتبخر في قعر فاصل سحب المرحلة الأولى V-405؟',
    options: [
      'يضخ بواسطة مضخات منتج الأمونيا (Ammonia Product Pump P-401 A أو B) بحرارة -32°C إلى خزانات تخزين الأمونيا (Ammonia Storage Tank)',
      'يتبخر بالكامل داخل الوعاء ويطرد للجو',
      'يعاد إلى مجمع الغاز الطبيعي',
      'يصرف إلى مجاري المياه الصناعية'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-20) صراحة على: "Liquid not flashed is pumped from the First Stage Suction Separator, by the Ammonia Product Pump (P-401 A or B), to the Ammonia Storage Tank as product."',
    technicalReference: 'دليل التشغيل - صفحة C-20',
    equipmentRef: 'p-401'
  },
  {
    id: 82,
    type: 'mcq',
    category: 'suction_separators_pumps',
    arabicCategory: 'فواصل السحب وتدفق وتدرج السوائل ومضخات P-401',
    question: 'ما هي مواصفات مضخات منتج الأمونيا P-401 A/B من حيث الحماية الميكانيكية لضخ سائل عند -32°C؟',
    options: [
      'مضخات طرد مركزي مبردة (Cryogenic Pumps) مصنوعة من مواد سبائكية تتحمل الصدمات الميكانيكية في درجات الحرارة السالبة مع مانع تسرب ميكانيكي مزدوج',
      'مضخات إزاحة موجبة بدون تبريد',
      'مضخات غاطسة مصنوعة من البلاستيك المقوى',
      'مضخات هوائية عادية'
    ],
    correctIndex: 0,
    explanation: 'ضخ سائل الأمونيا عند -32°C يتطلب مضخات مصنعة من مواد مطابقة لمواصفات الخدمة المبردة (Low-Temperature Impact Tested Steels) مع أنظمة غسيل وتبريد موانع التسرب لمنع انبعاث الأمونيا.',
    technicalReference: 'دليل المواصفات الميكانيكية للمضخات - وحدة 400',
    equipmentRef: 'p-401'
  },
  {
    id: 83,
    type: 'mcq',
    category: 'suction_separators_pumps',
    arabicCategory: 'فواصل السحب وتدفق وتدرج السوائل ومضخات P-401',
    question: 'ما هو نظام الإنترلوك والحماية الحاسم على فواصل السحب V-405 و V-406 و V-407 لمنع وصول السائل إلى ريش كباس K-401؟',
    options: [
      'مفاتيح منسوب عالية جداً (LAHH) تؤدي إلى رحلة وإيقاف طارئ فوري (Trip) لكباس K-401 والتوربين الدافع',
      'صمام تنفيس يفتح للهواء الجوي',
      'تشغيل سخانات كهربائية داخلية في مدخل الكباس',
      'تخفيض سرعة الضاغط بنسبة 5% فقط'
    ],
    correctIndex: 0,
    explanation: 'دخول أي كمية من السائل غير المتبخر إلى كباس طارد مركزي يدور بآلاف الدورات بالدقيقة يؤدي لتحطم ميكانيكي كارثي للدافعات (Impellers)؛ لذا تضبط أجهزة LAHH لإيقاف الضاغط فوراً.',
    technicalReference: 'دليل أنظمة الحماية والإنترلوك لكباس K-401',
    equipmentRef: 'v-405'
  },
  {
    id: 84,
    type: 'mcq',
    category: 'suction_separators_pumps',
    arabicCategory: 'فواصل السحب وتدفق وتدرج السوائل ومضخات P-401',
    question: 'ما هو الضغط التصميمي النسبي لفاصل سحب المرحلة الأولى V-405 مقارنة بالضغط الجوي؟',
    options: [
      'ضغط موجب طفيف جداً يقارب 0.07 kg/cm²G لضمان عدم تكون ضغط سالب (Vacuum) يمتص الهواء الجوي إلى داخل النظام',
      'ضغط تفريغ كامل (-1.0 bar)',
      'ضغط مرتفع جداً يتجاوز 50 kg/cm²G',
      'نفس ضغط حلقة التخليق 220 kg/cm²G'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-21) على أن سحب الغلاف منخفض الضغط من V-405 يعمل عند 0.07 kg/cm²G؛ وهي قيمة موجبة طفيفة تمنع تشكل فاكيوم قد يسحب أكسجين الهواء ويشكل مزيجاً قابلاً للاشتعال.',
    technicalReference: 'دليل التشغيل - صفحة C-21',
    equipmentRef: 'v-405'
  },

  // =========================================================================
  // CATEGORY 9: كباس التثليج K-401: الغلافان ومحطة التوربين البخاري [85-94]
  // =========================================================================
  {
    id: 85,
    type: 'mcq',
    category: 'refrigeration_compressor_k401',
    arabicCategory: 'كباس التثليج K-401: الغلافان ومحطة التوربين البخاري',
    question: 'ما هو النوع الميكانيكي لكباس التثليج K-401 وما هو المحرك الدافع له؟',
    options: [
      'كباس طارد مركزي (Centrifugal Type) يتكون من غلافين (Two Casings) ويدار بواسطة توربين بخاري (Steam Turbine)',
      'كباس ترددي ذو مكابس هيدروليكية يدار بمحرك ديزل',
      'كباس حلزوني مفرد يدار بمحرك كهربائي متزامن',
      'مروحة سحب محورية بدون توربين'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-21) على: "The Refrigeration Compressor is centrifugal type driven by steam turbine and consists of two casings."',
    technicalReference: 'دليل التشغيل - صفحة C-21',
    equipmentRef: 'k-401'
  },
  {
    id: 86,
    type: 'mcq',
    category: 'refrigeration_compressor_k401',
    arabicCategory: 'كباس التثليج K-401: الغلافان ومحطة التوربين البخاري',
    question: 'ما هو مسار كبس الغاز في الغلاف منخفض الضغط (Low Pressure Case) لكباس K-401 وفقاً لدليل التشغيل؟',
    options: [
      'يسحب البخار من فاصل المرحلة الأولى V-405 عند ضغط 0.07 kg/cm²G ويطرده إلى فاصل سحب المرحلة الثانية V-406',
      'يسحب من V-407 ويطرد إلى المكثف E-412 مباشرة',
      'يسحب من خزان التخفيف V-409 ويطرد للهواء',
      'يسحب من المفاعل R-401 ويطرد لمسخن E-402'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-21) على: "The low pressure case draws vapor from the First Stage Suction Separator (V-405) at 0.07 Kg/cm²G and discharges the vapor into the Second Stage Suction Separator (V-406)."',
    technicalReference: 'دليل التشغيل - صفحة C-21',
    equipmentRef: 'k-401'
  },
  {
    id: 87,
    type: 'mcq',
    category: 'refrigeration_compressor_k401',
    arabicCategory: 'كباس التثليج K-401: الغلافان ومحطة التوربين البخاري',
    question: 'ما هما مستويا ضغط السحب اللذان يغذيان الغلاف عالي الضغط (High Pressure Case) لكباس K-401؟',
    options: [
      'يسحب من فاصل المرحلة الثانية V-406 عند 2.5 kg/cm²G، ومن فاصل المرحلة الثالثة V-407 عند 4.4 kg/cm²G',
      'يسحب عند 10 kg/cm²G وعند 25 kg/cm²G',
      'يسحب عند 0.07 kg/cm²G فقط',
      'يسحب عند 100 kg/cm²G و 200 kg/cm²G'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-21) على: "The high pressure case, with suction at two pressure levels draws vapors from the Second Stage Suction Separator (V-406) at 2.5 Kg/cm²G and from the Third Stage Suction Separator (V-407) at 4.4 Kg/cm²G."',
    technicalReference: 'دليل التشغيل - صفحة C-21',
    equipmentRef: 'k-401'
  },
  {
    id: 88,
    type: 'mcq',
    category: 'refrigeration_compressor_k401',
    arabicCategory: 'كباس التثليج K-401: الغلافان ومحطة التوربين البخاري',
    question: 'أين يتم تبريد وتكثيف بخار الأمونيا النهائي المطرود من الغلاف عالي الضغط لكباس K-401؟',
    options: [
      'في مكثف الأمونيا (Ammonia Condenser E-412) حيث يتكثف إلى أمونيا سائلة تتدفق بالجاذبية إلى مستلم التثليج V-408',
      'في المكثف المائي E-404',
      'في حوض إطفاء الشعلة',
      'في الفاصل الأولي V-401'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-21) على: "The final discharge vapor from the Compressor is cooled and condensed to liquid ammonia in the Ammonia Condenser (E-412). The liquid ammonia flows by gravity into the Refrigeration Receiver (V-408)".',
    technicalReference: 'دليل التشغيل - صفحة C-21',
    equipmentRef: 'e-412'
  },
  {
    id: 89,
    type: 'mcq',
    category: 'refrigeration_compressor_k401',
    arabicCategory: 'كباس التثليج K-401: الغلافان ومحطة التوربين البخاري',
    question: 'كيف يتم التحكم في ضغط السحب الأول (First Suction Pressure) لكباس التثليج K-401؟',
    options: [
      'يتم التحكم فيه عن طريق ضبط سرعة التوربين البخاري الدافع (controlled by the speed of turbine)',
      'بواسطة صمامات خنق يدوية على مدخل الفاصل',
      'بزيادة تدفق مياه التبريد في E-412 فقط',
      'بإيقاف مرحلة الكبس الثانية مؤقتاً'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-21) صراحة على: "The first suction pressure is controlled by the speed of turbine."',
    technicalReference: 'دليل التشغيل - صفحة C-21',
    equipmentRef: 'k-401'
  },
  {
    id: 90,
    type: 'mcq',
    category: 'refrigeration_compressor_k401',
    arabicCategory: 'كباس التثليج K-401: الغلافان ومحطة التوربين البخاري',
    question: 'ما هو نوع البخار المحرك للتوربين البخاري الدافع KT-401؟',
    options: [
      'بخار الضغط المتوسط (MP Steam ~ 38-42 kg/cm²G) أو بخار الضغط العالي مع التكثيف السطحي',
      'بخار مشبع منخفض الضغط عند 1.5 bar فقط',
      'غاز الأمونيا المتبخر عالي الضغط',
      'الهواء المضغوط القادم من K-302'
    ],
    correctIndex: 0,
    explanation: 'يدار التوربين KT-401 ببخار شبكة البخار الصناعية مع حاكم سرعة هيدروليكي / إلكتروني دقيق يضبط سرعة الكباس K-401 للمحافظة على ضغوط التبخير بدقة متناهية.',
    technicalReference: 'دليل التوربينات البخارية - قسم 400 ومخطط البخار',
    equipmentRef: 'k-401'
  },
  {
    id: 91,
    type: 'mcq',
    category: 'refrigeration_compressor_k401',
    arabicCategory: 'كباس التثليج K-401: الغلافان ومحطة التوربين البخاري',
    question: 'ما هي مواصفات موانع التسرب (Shaft Seals) المستخدمة على محور دوران كباس التثليج K-401؟',
    options: [
      'موانع تسرب زيتية ميكانيكية أو موانع تسرب غازية جافة (Dry Gas Seals) تمنع تسرب غاز الأمونيا الخانق وتمنع دخول الهواء',
      'حبال قطنية مشحمة عادية (Gland Packing)',
      'حلقات مطاطية عادية بدون تزييت',
      'لا توجد موانع تسرب لوجود فراغ هوائي'
    ],
    correctIndex: 0,
    explanation: 'نظراً لسمية الأمونيا وقابليتها للاشتعال، تزود كباسات التثليج K-401 بأنظمة سيل متطورة تمنع تسرب الأمونيا إلى الغلاف الجوي أو اختلاطها بزيت التزييت.',
    technicalReference: 'المواصفات الميكانيكية لكباس K-401',
    equipmentRef: 'k-401'
  },
  {
    id: 92,
    type: 'mcq',
    category: 'refrigeration_compressor_k401',
    arabicCategory: 'كباس التثليج K-401: الغلافان ومحطة التوربين البخاري',
    question: 'ما هي مؤشرات سلامة المحامل (Bearings) في قطار كباس K-401 أثناء العمل المستمر؟',
    options: [
      'حرارة المحامل أقل من 90°C، سعة الاهتزازات (Vibration) ضمن الحدود المسموحة (أقل من 25 ميكرون)، وضغط واستقرار تدفق زيت التزييت',
      'ارتفاع صوت الكباس إلى أقصى حد ممكن',
      'تسرب الزيت من أغطية المحامل إلى الأرض',
      'تذبذب سرعة الدوران باستمرار'
    ],
    correctIndex: 0,
    explanation: 'تراقب محامل كباس K-401 عبر مجسات اهتزاز مستمرة (Bently Nevada Proximity Probes) وحساسات حرارية مزدوجة (RTDs) متصلة بنظام الإنترلوك.',
    technicalReference: 'دليل تشغيل الكباسات الطاردة - وحدة 400',
    equipmentRef: 'k-401'
  },
  {
    id: 93,
    type: 'mcq',
    category: 'refrigeration_compressor_k401',
    arabicCategory: 'كباس التثليج K-401: الغلافان ومحطة التوربين البخاري',
    question: 'ما هو الإجراء الفوري المتبع إذا حدث انقطاع مفاجئ في إمداد مياه التبريد لمكثف الأمونيا E-412؟',
    options: [
      'ارتفاع سريع في ضغط طرد كباس K-401؛ مما يوجب التدخل الفوري لخفض الحمل أو تفعيل الإنترلوك لرحلة الضاغط لحمايته من تجاوز الضغط الأقصى',
      'زيادة سرعة التوربين KT-401 للضعف',
      'إغلاق صمامات مانع الاندفاع بالكامل',
      'الاستمرار بالتشغيل دون اتخاذ أي إجراء'
    ],
    correctIndex: 0,
    explanation: 'توقف مياه التبريد في E-412 يمنع تكثيف الأمونيا، مما يؤدي إلى تراكم الغاز وارتفاع هائل في ضغط طرد الكباس (High Discharge Pressure Trip).',
    technicalReference: 'دليل إجراءات الطوارئ - وحدة 400',
    equipmentRef: 'e-412'
  },
  {
    id: 94,
    type: 'mcq',
    category: 'refrigeration_compressor_k401',
    arabicCategory: 'كباس التثليج K-401: الغلافان ومحطة التوربين البخاري',
    question: 'ما هي وظيفة وصلة التعشيق المرنة (Flexible Coupling) بين التوربين KT-401 وجسمي الضاغط K-401؟',
    options: [
      'نقل العزم الدوراني بكفاءة مع استيعاب التمددات الحرارية الطولية والانحرافات المحورية الطفيفة بين الأعمدة أثناء التشغيل',
      'زيادة سرعة الدوران بنسبة 4 إلى 1',
      'عزل الكهرباء الساكنة فقط',
      'تثبيت الكباس على القاعدة الخرسانية'
    ],
    correctIndex: 0,
    explanation: 'تستخدم وصلات التعشيق المرنة ذات الأقراص الرقيقة (Diaphragm / Disc Flexible Couplings) لامتصاص فروق التمدد الحراري بين التوربين الحار وجسمي كباس التثليج الباردين.',
    technicalReference: 'دليل الصيانة الميكانيكية لكباس K-401',
    equipmentRef: 'k-401'
  },

  // =========================================================================
  // CATEGORY 10: منظومة مانع الاندفاع وإزالة التحميص والمكثف E-412 ومستلم V-408 [95-100]
  // =========================================================================
  {
    id: 95,
    type: 'mcq',
    category: 'anti_surge_controls_receiver',
    arabicCategory: 'منظومة مانع الاندفاع وإزالة التحميص والمكثف E-412 ومستلم V-408',
    question: 'كيف يتم منع حدوث ظاهرة الاندفاع والارتجاف (Surging) في مراحل كباس التثليج K-401 وفقاً لدليل التشغيل؟',
    options: [
      'بتوفير صمامات تحكم بمانع الاندفاع (Anti-surge control valves) على كلا الغلافين لتدوير غاز الأمونيا المضغوط مع إزالة التحميص بالأمونيا السائلة من V-408',
      'بإغلاق صمام سحب الضاغط تماماً',
      'بحقن مياه التبريد داخل ريش الكباس',
      'بتقليل منسوب الزيت في المحامل'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-21) على: "To ensure that each stage of the Refrigeration Compressor has sufficient vapor flow to prevent surging of the machine anti-surge control valves are provided on both cases to recycle compressed ammonia vapor and desuperheating with liquid ammonia from the Refrigeration Receiver (V-408)."',
    technicalReference: 'دليل التشغيل - صفحة C-21',
    equipmentRef: 'k-401'
  },
  {
    id: 96,
    type: 'mcq',
    category: 'anti_surge_controls_receiver',
    arabicCategory: 'منظومة مانع الاندفاع وإزالة التحميص والمكثف E-412 ومستلم V-408',
    question: 'كيف وأين يتم الحفاظ على تدفق مانع الاندفاع لتيار المرحلة الأولى (First Stage Stream) في كباس K-401؟',
    options: [
      'يقاس التدفق عند طرد المرحلة الأولى، ويتم الحفاظ عليه بإدخال الغاز المزال تحميصه (Desuperheated gas) إلى فاصل سحب المرحلة الأولى V-405',
      'يقاس عند سحب المرحلة الثالثة ويصرف للشعلة',
      'يقاس في خزان V-409 ويضخ إلى E-404',
      'يتم قياسه يدوياً كل ساعة'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-21) على: "The flow required to avoid surge in the first stage stream, as measured at the first stage discharge, is maintained by the introduction of desuperheated gas into the First Stage Suction Separator."',
    technicalReference: 'دليل التشغيل - صفحة C-21',
    equipmentRef: 'v-405'
  },
  {
    id: 97,
    type: 'mcq',
    category: 'anti_surge_controls_receiver',
    arabicCategory: 'منظومة مانع الاندفاع وإزالة التحميص والمكثف E-412 ومستلم V-408',
    question: 'كيف وأين يتم الحفاظ على تدفق مانع الاندفاع لتيار المرحلة الثانية (Second Stage Stream) في كباس K-401؟',
    options: [
      'يقاس التدفق عند سحب المرحلة الثانية، ويتم الحفاظ عليه بإدخال الغاز المزال تحميصه إلى فاصل سحب المرحلة الثانية V-406',
      'يقاس عند مخرج المفاعل R-401',
      'يقاس في أنابيب مياه المرجل E-402',
      'يقاس في قعر الفاصل V-401'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-21) على: "The flow required to avoid surge in the second stage stream, measured at the second stage suction, is maintained by introducing desuperheated gas into the Second Stage Suction Separator."',
    technicalReference: 'دليل التشغيل - صفحة C-21',
    equipmentRef: 'v-406'
  },
  {
    id: 98,
    type: 'mcq',
    category: 'anti_surge_controls_receiver',
    arabicCategory: 'منظومة مانع الاندفاع وإزالة التحميص والمكثف E-412 ومستلم V-408',
    question: 'كيف وأين يتم الحفاظ على تدفق مانع الاندفاع لتيار المرحلة الثالثة (Third Stage Stream) في كباس K-401؟',
    options: [
      'يقاس التدفق عند طرد المرحلة الثالثة، ويتم الحفاظ عليه بإدخال الغاز المزال تحميصه إلى فاصل سحب المرحلة الثالثة V-407',
      'يقاس عند مدخل خزان التخزين الكروي',
      'يقاس في مضخات P-401',
      'يقاس في مكثف E-408'
    ],
    correctIndex: 0,
    explanation: 'ينص دليل التشغيل (صفحة C-22) على: "The flow required to prevent surge in the third stage stream, measured at the third stage discharge, is maintained by introducing desuperheated gas into the Third Stage Suction Separator."',
    technicalReference: 'دليل التشغيل - صفحة C-22',
    equipmentRef: 'v-407'
  },
  {
    id: 99,
    type: 'mcq',
    category: 'anti_surge_controls_receiver',
    arabicCategory: 'منظومة مانع الاندفاع وإزالة التحميص والمكثف E-412 ومستلم V-408',
    question: 'لماذا يعتبر إجراء إزالة التحميص (Desuperheating) بواسطة سائل الأمونيا ضرورياً جداً لغاز التدوير العائد لفواصل السحب؟',
    options: [
      'لأن ضغط الغاز يرفع حرارته بشدة، وإعادة غاز حار جداً إلى فواصل السحب يؤدي إلى زيادة حجمه النوعي وارتفاع حرارة مراحل الكبس اللاحقة وتلف الكباس',
      'لتحويل الغاز إلى نيتروجين سائل',
      'لتنظيف الفواصل من الغبار والرماد',
      'لرفع حرارة الفواصل لمنع تكون الصدأ'
    ],
    correctIndex: 0,
    explanation: 'كبس الغاز يولد حرارة انضغاط عالية (Superheat)، وإعادة الغاز الساخن إلى سحب الضاغط يرفع حرارة المدخل بشكل تراكمي خطير، لذا يحقن سائل الأمونيا ليتبخر فورياً ويمتص حرارة الانضغاط معيداً الغاز إلى حرارة التشبع الباردة.',
    technicalReference: 'دليل التشغيل ومبادئ مانع الاندفاع لكباس K-401 - صفحة C-21',
    equipmentRef: 'k-401'
  },
  {
    id: 100,
    type: 'mcq',
    category: 'anti_surge_controls_receiver',
    arabicCategory: 'منظومة مانع الاندفاع وإزالة التحميص والمكثف E-412 ومستلم V-408',
    question: 'ما هي الخلاصة الهندسية المتكاملة لضمان أقصى إنتاجية واستقرار آمن لقسم تخليق الأمونيا 400 وكباس التثليج K-401؟',
    options: [
      'المحافظة الدقيقة على نسبة الغازات الخاملة عند 10%، والتحكم بحرارة طبقات R-401 بغاز الإخماد، وضبط مستويات التثليج الثلاثة (4.9, 2.8, 0.2 kg)، وموثوقية منظومات مانع الاندفاع وإزالة التحميص بـ K-401',
      'إلغاء صمامات التبريد الكظومي وتشغيل المفاعل بأقصى حرارة ممكنة',
      'إيقاف ضاغط التثليج K-401 وتصريف غاز التطهير كاملاً للهواء',
      'إلغاء أجهزة الحماية والإنترلوك لمنع توقف الضاغط'
    ],
    correctIndex: 0,
    explanation: 'تعتمد إنتاجية وموثوقية مجمع تصنيع الأمونيا على التكامل الدقيق بين التوازن الكيميائي والحراري في المفاعل R-401 وبين الأداء الثرموديناميكي الدقيق لكباس التثليج K-401 ومستويات التبخير الثلاثة وفواصل السحب ومنظومة مانع الاندفاع.',
    technicalReference: 'دليل التشغيل الشامل لمجمع أسمدة خور الزبير رقم 3 - صفحات C-15 إلى C-22',
    equipmentRef: 'r-401'
  }
];

export const SECTION_400_CATEGORIES = [
  { id: 'all', name: 'كافة الأقسام والمحاور (100 سؤال)', count: 100 },
  { id: 'synthesis_principles', name: '1. مبادئ تفاعل تخليق الأمونيا وتوازن الغازات والحرارة (10)', count: 10 },
  { id: 'converter_r401_design', name: '2. تصميم مفاعل الأمونيا R-401 والطبقات الثلاث وحماية الغلاف (12)', count: 12 },
  { id: 'heat_recovery_train', name: '3. شبكة المبادلات الحرارية واسترجاع الطاقة E-401..403 (10)', count: 10 },
  { id: 'primary_condensing', name: '4. التكثيف الأولي بمياه التبريد وفاصل V-401 وخزان V-409 (10)', count: 10 },
  { id: 'secondary_condensing', name: '5. التكثيف الثانوي والتبريد بالأمونيا E-407/405/406 وفاصل V-402 (12)', count: 12 },
  { id: 'purge_vent_recovery', name: '6. غاز التطهير Purge Gas ومنظومة التنفيس والاسترجاع (10)', count: 10 },
  { id: 'refrigeration_levels', name: '7. مستويات التثليج والتبخير الثلاثة (4.9, 2.8, 0.2 kg) (10)', count: 10 },
  { id: 'suction_separators_pumps', name: '8. فواصل السحب وتدفق وتدرج السوائل ومضخات P-401 (10)', count: 10 },
  { id: 'refrigeration_compressor_k401', name: '9. كباس التثليج K-401: الغلافان ومحطة التوربين البخاري (10)', count: 10 },
  { id: 'anti_surge_controls_receiver', name: '10. منظومة مانع الاندفاع وإزالة التحميص والمكثف E-412 (6)', count: 6 }
];
