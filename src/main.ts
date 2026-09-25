import { Engine3D, ViewMode3D } from './three/Engine3D';
import { Hotspot3D } from './three/ControlRoom3D';
import { EquipmentInfo, MASTER_EQUIPMENT_DATA, MASTER_QUIZ_BANK, MASTER_TEMPERATURE_POINTS, MASTER_CONTROLLER_POINTS, QuizQuestion } from './three/PlantDiagramData';
import { plantAudio } from './three/PlantAudio';
import { unitOpsManager } from './unitops/UnitOpsManager';
import { unitOpsEngine } from './unitops/UnitOpsEngine';
import { plantOpsLab } from './unitops/PlantOperationsLab';
import { plantDiagram2D } from './diagram2d/PlantDiagram2D';

let engine3D: Engine3D | null = null;
let view3DOverlay: HTMLElement | null = null;

let isTempBadgesOn = true;
let isControllersOn = true;
let isTagsOn = true;
let isFlowParticlesOn = true;
let isUIHidden = false;
let isAudioOn = false;

// Student & Quiz State
let studentName = localStorage.getItem('nh3_student_name') || 'مهندس كيميائي متدرب';
let studentUni = localStorage.getItem('nh3_student_uni') || 'جامعة البصرة - كلية الهندسة';
let quizCurrentIndex = 0;
let quizUserAnswers: number[] = new Array(MASTER_QUIZ_BANK.length).fill(-1);
let quizScore = 0;
let isQuizSubmitted = false;

function init3DOverlay() {
  if (!view3DOverlay) {
    view3DOverlay = document.getElementById('view3d-overlay');
  }
  if (!view3DOverlay) {
    view3DOverlay = document.createElement('div');
    view3DOverlay.id = 'view3d-overlay';
    view3DOverlay.className = 'view3d-overlay';
    document.body.appendChild(view3DOverlay);
  }

  if (view3DOverlay.getAttribute('data-initialized') === 'true') {
    return;
  }
  view3DOverlay.setAttribute('data-initialized', 'true');
  view3DOverlay.style.display = 'none';

  view3DOverlay.innerHTML = `
    <!-- Top Header Wrap -->
    <div id="v3d-header-wrap" class="v3d-header-wrap">
      <!-- 1. Top Branding Bar (Desktop/Tablet) -->
      <div class="view3d-branding-bar">
        <div class="v3d-org-box">
          <span class="v3d-org-icon">🏛</span>
          <div>
            <div class="v3d-org-ar">الهيئة العامة للمهندسين الكيميائيين في البصرة</div>
            <div class="v3d-org-en">General Union of Chemical Engineers in Basra</div>
          </div>
        </div>
        <div class="v3d-center-title">
          AMMONIA PRODUCTION PROCESS PLANT — 3D DIGITAL TWIN
          <small>Interactive 3D Process Simulation & University Digital Twin (خور الزبير)</small>
        </div>
        <div class="v3d-dev-box">
          <span class="v3d-dev-label">المطور / Developer:</span>
          <span class="v3d-dev-name">ENG.ALI SAIF AL DIN HAIDER ALNAWFAL</span>
          <span class="v3d-dev-sub">م. علي سيف الدين حيدر النوفل &nbsp;|&nbsp; © ${new Date().getFullYear()} All Rights Reserved</span>
        </div>
      </div>

      <!-- 2. Main Navigation Bar -->
      <div class="view3d-topbar">
        <div class="v3d-nav-left">
          <button class="view3d-back-btn" id="view3d-back-btn" title="الرجوع إلى الواجهة الرئيسية للمحاكي (DCS Main Dashboard)">
            <span class="v3d-btn-icon">🔙</span>
            <span class="v3d-btn-txt">الرجوع للواجهة الرئيسية</span>
          </button>
          <div class="view3d-title">
            🏭 محاكاة ومطابقة مخطط تدفق إنتاج الأمونيا
          </div>
        </div>
        
        <!-- Primary View Modes & Process Units Switcher -->
        <div class="view3d-pagetabs" id="view3d-pagetabs">
          <button class="view3d-pgtab on" id="v3d-tab-plant" data-mode="plant_overview" data-sec="overview" title="استعراض مجمع تصنيع الأمونيا بالكامل بتقنية ثلاثية الأبعاد">🌐 المصنع بالكامل 3D (Full Plant)</button>
          <button class="view3d-pgtab" id="v3d-tab-gas-sec" data-mode="plant_overview" data-sec="sec_reformer" data-splash="true" title="القسم الأول: تحويل الغاز والإصلاح الأولي 3D مع دوران 360°">🔥 1. تحويل الغاز 3D</button>
          <button class="view3d-pgtab" id="v3d-tab-co2-splash" data-mode="plant_overview" data-sec="sec_co2" data-splash="true" style="border-color:#00e5aa;color:#00e5aa;background:rgba(0,229,170,0.12);" title="القسم الخامس: منظومة إزالة واستخلاص CO₂ كاتاكارب 3D مع دوران 360°">🧪 5. إزالة CO₂ 3D</button>
          <button class="view3d-pgtab" id="v3d-tab-k301-splash" data-mode="plant_overview" data-sec="sec_k301" data-splash="true" style="border-color:#ffeb3b;color:#ffeb3b;background:rgba(255,235,59,0.12);" title="القسم السابع: ضاغط غاز التخليق K-301 والتوربين البخاري ومبرداته 3D مع دوران 360°">⚡ 7. ضاغط K-301 3D</button>
          <button class="view3d-pgtab" id="v3d-tab-synloop-splash" data-mode="plant_overview" data-sec="sec_synloop" data-splash="true" style="border-color:#00c8ef;color:#00c8ef;background:rgba(0,200,239,0.12);" title="القسم الثامن: حلقة تخليق الأمونيا والمفاعل R-401 والمبادلات 3D مع دوران 360°">⚛️ 8. حلقة تخليق الأمونيا R-401 3D</button>
          <button class="view3d-pgtab" id="v3d-tab-refrig-splash" data-mode="plant_overview" data-sec="sec_refrigeration" data-splash="true" style="border-color:#00e5aa;color:#00e5aa;background:rgba(0,229,170,0.12);" title="القسم التاسع: منظومة التثليج والتبريد ومكثفات الأمونيا 3D">❄️ 9. التثليج والتبريد 3D</button>
          <button class="view3d-pgtab" id="v3d-tab-top" data-mode="top_layout" data-sec="top_layout" title="المخطط الهندسي الأفقي العلوي (Top-Down P&ID Layout)">📐 المخطط العلوي</button>
          <button class="view3d-pgtab" id="v3d-tab-cr" data-mode="control_room" data-sec="control_room" title="غرفة السيطرة اليابانية (MHI 1977 Annunciator Panels)">🎛 غرفة السيطرة 3D</button>
          <button class="view3d-pgtab" id="v3d-tab-desulf" data-mode="plant_overview" data-sec="sec_desulf" title="إزالة الكبريت ومعالجة الغاز الطبيعي (V-115 / R-102AB)">1. إزالة الكبريت والضغط</button>
          <button class="view3d-pgtab" id="v3d-tab-reform" data-mode="plant_overview" data-sec="sec_reformer" title="فرن الإصلاح الأولي الرئيسي (Primary Reformer R-101)">2. فرن الإصلاح الأولي</button>
          <button class="view3d-pgtab" id="v3d-tab-sec-ref" data-mode="plant_overview" data-sec="sec_secondary_reformer" title="المصلح الثانوي وغلاية البخار (Secondary Reformer R-103 & E-108)">3. المصلح الثانوي</button>
          <button class="view3d-pgtab" id="v3d-tab-shift" data-mode="plant_overview" data-sec="sec_shift" title="مفاعلات التحويل بدرجات الحرارة العالية والواطئة (HTS R-104 & LTS R-105)">4. مفاعلات التحويل</button>
          <button class="view3d-pgtab" id="v3d-tab-co2" data-mode="plant_overview" data-sec="sec_co2" title="أبراج امتصاص وإزالة ثاني أكسيد الكربون (Catacarb T-201 / T-202)">5. إزالة CO₂</button>
          <button class="view3d-pgtab" id="v3d-tab-meth" data-mode="plant_overview" data-sec="sec_methanation" title="مفاعل الميثانايتر للتنقية النهائية (Methanator R-106)">6. الميثانايتر</button>
          <button class="view3d-pgtab" id="v3d-tab-comp" data-mode="plant_overview" data-sec="sec_compressor" title="ضواغط غاز التخليق والهواء والغاز الطبيعي (K-301 / K-302 / K-303)">7. ضواغط الغاز</button>
          <button class="view3d-pgtab" id="v3d-tab-synloop" data-mode="plant_overview" data-sec="sec_synloop" title="برج وحلقة تخليق الأمونيا (Ammonia Converter R-401)">8. تخليق الأمونيا</button>
          <button class="view3d-pgtab" id="v3d-tab-refrig" data-mode="plant_overview" data-sec="sec_refrigeration" title="منظومة التبريد والتثليج ومكثفات الأمونيا (K-401 & Flash Chillers)">9. التثليج والتبريد</button>
          <button class="view3d-pgtab" id="v3d-tab-storage" data-mode="plant_overview" data-sec="sec_storage" title="خزانات الأمونيا المبردة ومحطات الشحن والتحميل (F-401 & Loading)">10. الخزانات والشحن</button>
          <button class="view3d-pgtab" id="v3d-tab-steam" data-mode="plant_overview" data-sec="sec_steam" title="شبكة ومجمعات البخار ومحطات التخفيض PRDS المعزولة بالكامل (3D Steam Twin)">11. مجمع البخار ومحطات التخفيض 3D</button>
        </div>

        <div class="v3d-nav-right">
          <!-- Academic Modules Trigger Buttons -->
          <button class="v3d-edu-btn" id="v3d-btn-quiz" title="الاختبار الأكاديمي الشامل لمهندسي الكيمياء">
            <span>📝</span>
            <span>الاختبار والشهادة</span>
          </button>
          <button class="v3d-edu-btn" id="v3d-btn-search" title="البحث والانتقال السريع لأي معدة">
            <span>🔎</span>
            <span>بحث</span>
          </button>
          <button class="v3d-edu-btn" id="v3d-btn-audio" title="صوت المصنع التوربيني الواقعي">
            <span id="v3d-audio-icon">🔇</span>
          </button>
          <button class="view3d-toggle-ui-btn" id="v3d-topbar-toggleui" title="تبديل وضع ملء الشاشة وإخفاء/إظهار القوائم">
            <span class="v3d-ui-icon">👁</span>
            <span class="v3d-ui-txt">ملء الشاشة</span>
          </button>
          <button class="view3d-close-btn" id="view3d-close-btn" title="إغلاق العرض 3D والرجوع للواجهة الرئيسية">
            <span>✕</span>
            <span>خروج</span>
          </button>
        </div>
      </div>

      <!-- 3. Process Sequence Stepper Bar -->
      <div class="view3d-stepper-bar" id="view3d-stepper-bar">
        <span class="v3d-stepper-label">⚡ مسار العملية (Process Route):</span>
        <button class="v3d-step-btn" id="v3d-step-prev" title="المحطة السابقة">◀ السابق</button>
        <span class="v3d-step-badge" id="v3d-step-badge">1 / 15</span>
        <div class="v3d-step-current" id="v3d-step-current-title">1. Natural Gas Feed & Pressure Letdown (V-115 / PIC-001)</div>
        <button class="v3d-step-btn" id="v3d-step-next" title="المحطة التالية">التالي ▶</button>
      </div>

      <!-- 4. Layer Toggles & Inspection Tools Bar -->
      <div id="view3d-advanced-tools" class="view3d-advanced-tools">
        <div class="v3d-tools-scroll">
          <span class="v3d-tool-label">🔍 عزل الأقسام 3D:</span>
          <button id="v3d-toggle-isolation" class="v3d-tool-btn" style="border-color:#ff9800;color:#ffb74d;font-weight:bold;background:rgba(255,152,0,0.15);" title="التبديل بين عزل مجسم القسم 1 المستقل وإظهار المصنع بالكامل">🔥 عزل تحويل الغاز</button>
          <button id="v3d-toggle-co2-isolation" class="v3d-tool-btn" style="border-color:#00e5aa;color:#00e5aa;font-weight:bold;background:rgba(0,229,170,0.15);" title="عزل مجسم منظومة إزالة واستخلاص CO2 كاتاكارب (T-201, T-202, E-201, V-201, V-204, P-201)">🧪 عزل إزالة CO₂</button>
          <button id="v3d-toggle-k301-isolation" class="v3d-tool-btn" style="border-color:#ffeb3b;color:#ffeb3b;font-weight:bold;background:rgba(255,235,59,0.15);" title="عزل مجسم ضاغط غاز التخليق K-301 والتوربين البخاري ومبرداته ومزيتاته">⚡ عزل ضاغط K-301</button>
          <button id="v3d-toggle-synloop-isolation" class="v3d-tool-btn" style="border-color:#00c8ef;color:#00c8ef;font-weight:bold;background:rgba(0,200,239,0.15);" title="عزل مجسم حلقة تخليق الأمونيا والمفاعل R-401 والمبادلات">⚛️ عزل حلقة الأمونيا R-401</button>
          <button id="v3d-toggle-refrig-isolation" class="v3d-tool-btn" style="border-color:#00e5aa;color:#00e5aa;font-weight:bold;background:rgba(0,229,170,0.15);" title="عزل مجسم منظومة التثليج والتبريد ومكثفات الأمونيا K-401">❄️ عزل التثليج K-401</button>
          <span class="v3d-tool-sep">|</span>
          <span class="v3d-tool-label">🔍 الطبقات:</span>
          <button id="v3d-toggle-temp" class="v3d-tool-btn on" title="إظهار / إخفاء قيم درجات الحرارة">🌡 درجات الحرارة</button>
          <button id="v3d-toggle-tags" class="v3d-tool-btn on" title="إظهار / إخفاء وسوم المعدات">🏷 الوسوم</button>
          <button id="v3d-toggle-flow" class="v3d-tool-btn on" title="إظهار / إخفاء جزيئات الجريان المتحركة">✨ الجريان</button>
          <span class="v3d-tool-sep">|</span>
          <span class="v3d-tool-label">🌅 الإضاءة:</span>
          <button id="v3d-env-sunset" class="v3d-tool-btn on">🌅 الغروب</button>
          <button id="v3d-env-daylight" class="v3d-tool-btn">☀️ النهار</button>
          <button id="v3d-env-night" class="v3d-tool-btn">🌙 الليل</button>
          <span class="v3d-tool-sep">|</span>
          <button id="v3d-btn-xray" class="v3d-tool-btn" title="وضع الأشعة السينية لفحص المحفزات الداخلية">🔬 فحص داخلي (X-Ray)</button>
          <button id="v3d-btn-rotate" class="v3d-tool-btn" title="تدوير تلقائي 360°">🔄 تدوير 360°</button>
          <span class="v3d-tool-sep">|</span>
          <button id="v3d-sec400-pfd-btn" class="v3d-tool-btn" style="border-color:#00c8ef;color:#00c8ef;background:rgba(0,200,239,0.18);font-weight:bold;" title="المخطط التشغيلي والتدفق التكنولوجي الشامل لقسم تخليق وتبريد الأمونيا (Unit 400 PFD)">📋 المخطط التشغيلي للقسم 4</button>
        </div>
      </div>
    </div>

    <!-- Main 3D Canvas Viewport -->
    <div id="view3d-canvas-wrap" class="view3d-canvas-wrap">
      <!-- Floating View Mode Status Badge & Switcher -->
      <div id="v3d-mode-status-badge" class="v3d-mode-status-badge" style="position:absolute;top:14px;left:14px;z-index:40;background:rgba(5,15,25,0.88);border:1px solid #00e5aa;border-radius:8px;padding:6px 14px;display:flex;align-items:center;gap:10px;backdrop-filter:blur(8px);box-shadow:0 4px 18px rgba(0,0,0,0.6);">
        <span id="v3d-mode-badge-icon" style="font-size:16px;">🌐</span>
        <span id="v3d-mode-badge-txt" style="color:#00e5aa;font-weight:bold;font-size:12px;">وضع مجمع المصنع بالكامل 3D (Full Plant)</span>
        <button id="v3d-badge-switch-btn" style="background:#ff9800;color:#030c14;border:none;border-radius:4px;padding:3px 10px;font-size:11px;font-weight:bold;cursor:pointer;transition:all 0.2s;" title="التبديل الفوري بين عزل القسم 1 والمصنع بالكامل">🔥 عزل القسم 1</button>
      </div>

      <!-- Floating Quick Actions Dock (Return & UI Toggle) -->
      <div class="v3d-float-top-actions">
        <button id="v3d-float-back-btn" class="v3d-float-back-btn" title="الرجوع إلى الواجهة الرئيسية للمحاكي (DCS Simulator)">
          <span style="font-size:13px;">🔙</span>
          <span>الواجهة الرئيسية</span>
        </button>
        <button id="v3d-float-toggleui" class="v3d-float-toggleui" title="إظهار / إخفاء القوائم والواجهة">
          👁 إخفاء القوائم
        </button>
      </div>

      <div class="view3d-hint" id="view3d-hint">
        💡 انقر على أي معدة أو شارة حرارة لفتح بطاقة الفحص الهندسي والتركيز عليها فوراً
      </div>
      
      <!-- Floating Camera Zoom & Controls Dock -->
      <div class="v3d-controls-float">
        <button id="v3d-zoom-in" title="تكبير / Zoom In">➕</button>
        <button id="v3d-zoom-out" title="تصغير / Zoom Out">➖</button>
        <button id="v3d-reset-cam" title="إعادة الضبط / Reset View">↺ المركز</button>
        <button id="v3d-btn-rotate-float" title="تدوير 360°">🔄 دوران</button>
      </div>

      <!-- Interactive Equipment Inspector Card / Bottom Sheet -->
      <div id="view3d-info-card" class="view3d-info-card" style="display:none;">
        <div class="view3d-card-header">
          <div class="view3d-card-title-group">
            <button id="v3d-card-back-btn" class="v3d-card-back-btn" title="رجوع / إخفاء البطاقة">🔙</button>
            <span class="v3d-tag-badge" id="v3d-card-tag">R-101</span>
            <span class="v3d-card-title-txt" id="v3d-card-title">Primary Reformer Furnace</span>
          </div>
          <button id="v3d-card-close" class="v3d-card-close-btn" title="إغلاق البطاقة">✕</button>
        </div>
        <div class="view3d-card-sub" id="v3d-card-arname">فرن الإصلاح الأولي الرئيسي</div>
        <div class="view3d-card-body" id="v3d-card-desc">
          تحويل غاز الميثان الطبيعي مع البخار المحمص عند درجة حرارة 750°C إلى غاز التخليق.
        </div>
        <div class="view3d-card-metrics" id="v3d-card-metrics">
          <div class="v3d-metric-box">
            <span class="v3d-mb-label">درجة الحرارة</span>
            <span class="v3d-mb-val" id="v3d-card-temp">750 °C</span>
          </div>
          <div class="v3d-metric-box">
            <span class="v3d-mb-label">الضغط التشغيلي</span>
            <span class="v3d-mb-val" id="v3d-card-press">32 kg/cm²</span>
          </div>
        </div>
        <div class="view3d-card-footer">
          <button id="v3d-card-action" class="v3d-btn-primary">🎯 تركيز الكاميرا</button>
          <button id="v3d-card-learn-btn" class="v3d-btn-learn">📚 الشرح الهندسي والتفاعلات</button>
        </div>
      </div>

      <!-- Canvas Branding Watermark -->
      <div class="v3d-canvas-branding" id="v3d-canvas-branding">
        <span class="v3d-c-org">🏛 الهيئة العامة للمهندسين الكيميائيين في البصرة</span>
        <span class="v3d-c-dot">•</span>
        <span class="v3d-c-dev">المطور: <b>ENG.ALI SAIF AL DIN HAIDER ALNAWFAL</b></span>
        <span class="v3d-c-dot">•</span>
        <span class="v3d-c-copy">© ${new Date().getFullYear()} All Rights Reserved</span>
      </div>
    </div>

    <!-- Educational Engineering Details Drawer (الموسوعة الهندسية للمعدة - الشاشة الجانبية) -->
    <div id="v3d-edu-drawer" class="v3d-edu-drawer" style="display:none;">
      <div class="v3d-drawer-header">
        <div class="v3d-dh-title">
          <button id="v3d-drawer-back-btn" class="v3d-drawer-back-btn" title="الرجوع إلى فحص المجسم ثلاثي الأبعاد 3D">
            <span>🔙</span>
            <span>رجوع</span>
          </button>
          <span class="v3d-dh-badge" id="v3d-dh-tag">R-101</span>
          <span id="v3d-dh-name">الشرح الهندسي المتقدم والتفاعلات</span>
        </div>
        <button id="v3d-drawer-close" class="v3d-drawer-close-btn" title="إغلاق الشاشة الجانبية">✕</button>
      </div>
      <div class="v3d-drawer-body" id="v3d-drawer-body">
        <!-- Dynamic content injected here -->
      </div>
    </div>

    <!-- Interactive Quiz & Certification Modal (الاختبار الأكاديمي والشهادة) -->
    <div id="v3d-quiz-modal" class="v3d-quiz-modal" style="display:none;">
      <div class="v3d-modal-card">
        <div class="v3d-modal-header">
          <div class="v3d-mh-title">
            📝 الاختبار الأكاديمي الشامل لمهندسي الكيمياء — مصنع الأمونيا (خور الزبير)
          </div>
          <button id="v3d-quiz-close" class="v3d-modal-close-btn">✕</button>
        </div>
        <div class="v3d-modal-body" id="v3d-quiz-body">
          <!-- Quiz steps injected here -->
        </div>
      </div>
    </div>

    <!-- Quick Search / Finder Modal (البحث السريع) -->
    <div id="v3d-search-modal" class="v3d-search-modal" style="display:none;">
      <div class="v3d-search-card">
        <div class="v3d-search-header">
          <span>🔍 البحث السريع والانتقال إلى أي معدة أو محطة حرارية</span>
          <button id="v3d-search-close" class="v3d-modal-close-btn">✕</button>
        </div>
        <div class="v3d-search-input-wrap">
          <input type="text" id="v3d-search-input" placeholder="اكتب اسم المعدة أو الرمز (مثال: R-101, T-201, 750, Reformer)..." autofocus />
        </div>
        <div class="v3d-search-list" id="v3d-search-list">
          <!-- Search results -->
        </div>
      </div>
    </div>

    <!-- Master Unit 400 Operational PFD Modal (لوحة شاشة المخطط التشغيلي للقسم الرابع) -->
    <div id="v3d-sec400-pfd-modal" class="v3d-sec400-pfd-modal" style="display:none;">
      <div class="v3d-pfd-modal-card">
        <div class="v3d-pfd-modal-header">
          <div class="v3d-pfd-title-box">
            <span class="v3d-pfd-badge">DWG 6112P-100-400-00</span>
            <div class="v3d-pfd-title-txt">📋 المخطط التشغيلي والتدفق التكنولوجي الشامل لقسم تخليق وتبريد الأمونيا (Unit 400)</div>
          </div>
          <div class="v3d-pfd-header-actions">
            <button id="v3d-pfd-goto-board-btn" class="v3d-btn-primary" style="background:#00e5aa;color:#030c14;font-size:12px;padding:6px 14px;">🎯 الانتقال إلى لوحة الشاشة في المصنع 3D</button>
            <button id="v3d-sec400-pfd-close" class="v3d-modal-close-btn" title="إغلاق">✕</button>
          </div>
        </div>

        <div class="v3d-pfd-modal-body">
          <!-- Normal Run vs Startup Status Banner -->
          <div class="v3d-pfd-status-banner">
            <div class="v3d-status-item normal">
              <span class="v3d-status-dot">●</span>
              <span class="v3d-status-label">وضع التشغيل الطبيعي (Normal Operation):</span>
              <span class="v3d-status-val">صمام بايباص J-401 [مفتوح 100%] | صمامات هيتر البدء H-401 [معزولة ومغلقة تماماً]</span>
            </div>
            <div class="v3d-status-item startup">
              <span class="v3d-status-dot">●</span>
              <span class="v3d-status-label">وضع بدء التشغيل والإقلاع (Startup Mode):</span>
              <span class="v3d-status-val">صمامات دخول وخروج H-401 [مفتوحة لتسخين المحفز] | صمام بايباص J-401 [معزول ومغلق]</span>
            </div>
          </div>

          <!-- 4 Sequential Operational Flow Columns -->
          <div class="v3d-pfd-columns-grid">
            <!-- Col 1 -->
            <div class="v3d-pfd-col c1">
              <div class="v3d-col-header">
                <span class="v3d-col-num">1</span>
                <div>
                  <div class="v3d-col-title">حلقة التدوير والتثليج الأولي</div>
                  <div class="v3d-col-sub">Recycle & Primary Chilling (K-301 -> V-402)</div>
                </div>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">المحطة 1</div>
                <div class="v3d-sb-title">خروج الريسايكل من الضاغطة K-301:</div>
                <p>يخرج غاز التدوير غير المتفاعل من عجلة التدوير لضاغط K-301 بضغط <b>230 kg/cm²G</b> وحرارة 40°C ليدخل إلى <b>شيل المبادل E-407</b>.</p>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">المحطة 2</div>
                <div class="v3d-sb-title">تبريد أولي بغلاف E-407:</div>
                <p>يتم تبريد الغاز داخل غلاف E-407 بالتنازل الحراري مع غاز تيوب E-407 البارد القادم من V-402، وتنخفض حرارته إلى <b>26.5°C</b>.</p>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">المحطة 3</div>
                <div class="v3d-sb-title">من شيل E-407 إلى تيوب E-405:</div>
                <p>يخرج الغاز من شيل E-407 ويدخل إلى <b>تيوب مبرد الأمونيا الأولي E-405</b> الذي يغلي في غلافه سائل الأمونيا عند <b>+8.0°C</b>.</p>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">المحطة 4</div>
                <div class="v3d-sb-title">التبريد في E-405 إلى 14°C:</div>
                <p>يخرج الغاز من تيوب E-405 عند درجة حرارة <b>14.0°C</b> متوجهاً إلى تيوب المبادل التالي E-406.</p>
              </div>
              <div class="v3d-step-box highlight">
                <div class="v3d-sb-num">المحطة 5 (حقن Make-Up)</div>
                <div class="v3d-sb-title">حقن غاز التعويض الطازج:</div>
                <p>يصب خط غاز التعويض (Make-Up Gas) القادم من <b>V-310 بضغط 240 kg/cm²G</b> وحرارة 26°C مباشرة في الخط الرابط بين مخرج تيوب E-405 ومدخل تيوب E-406.</p>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">المحطة 6</div>
                <div class="v3d-sb-title">تيوب المبرد الثانوي العميق E-406:</div>
                <p>يدخل الخليط إلى تيوب E-406 حيث تغلي الأمونيا بالغلاف عند <b>-10.0°C</b>، مما يؤدي إلى تكثيف بخار الأمونيا إلى سائل.</p>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">المحطة 7</div>
                <div class="v3d-sb-title">الدخول إلى عازل الأمونيا الباردة V-402:</div>
                <p>يدخل الخليط إلى عازل V-402، حيث ينفصل سائل الأمونيا المكثف <b>(-10°C)</b> من القاع نحو وعاء التخفيض V-409، بينما يخرج بخار السنتسيز البارد من أعلى V-402.</p>
              </div>
            </div>

            <!-- Col 2 -->
            <div class="v3d-pfd-col c2">
              <div class="v3d-col-header">
                <span class="v3d-col-num">2</span>
                <div>
                  <div class="v3d-col-title">حلقة التسخين والتفاعل R-401</div>
                  <div class="v3d-col-sub">Preheat, J-401 Bypass & Reactor (V-402 -> R-401)</div>
                </div>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">المحطة 8</div>
                <div class="v3d-sb-title">من قمة V-402 إلى تيوب E-407:</div>
                <p>يخرج الغاز البارد <b>(-10.0°C)</b> من أعلى V-402 ويدخل إلى <b>تيوب المبادل E-407</b> ليمتص الحرارة من غاز الشيل ويرتفع إلى <b>+30.0°C</b>.</p>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">المحطة 9</div>
                <div class="v3d-sb-title">من تيوب E-407 إلى شيل E-403:</div>
                <p>يخرج الغاز من تيوب E-407 ويدخل إلى <b>شيل مسخن التغذية E-403</b>، حيث يسخن بالتنازل مع غاز التفاعل العائد إلى <b>148.2°C</b>.</p>
              </div>
              <div class="v3d-step-box highlight">
                <div class="v3d-sb-num">المحطة 10 (المطابقة الصارمة)</div>
                <div class="v3d-sb-title">من شيل E-403 إلى جدار المفاعل R-401:</div>
                <p>يخرج الغاز من شيل E-403 ويدخل حصراً إلى <b>فوهة قاع جدار حماية المفاعل R-401 (Annulus Shroud Wall)</b> لحماية جدار الضغط وتبريده <b>ولا يذهب إلى V-401 أبداً</b>.</p>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">المحطة 11</div>
                <div class="v3d-sb-title">من جدار R-401 إلى شيل المبادل E-401:</div>
                <p>يصعد الغاز عبر الفراغ الحلقي للجدار ممتصاً الحرارة، ويخرج من فوهة قمة الجدار ويدخل إلى <b>فوهة قمة غلاف المبادل E-401</b>.</p>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">المحطة 12</div>
                <div class="v3d-sb-title">تسخين التغذية في غلاف E-401 إلى 235.5°C:</div>
                <p>يسخن غاز التغذية في غلاف E-401 حتى <b>235.5°C</b> ويخرج من فوهة قاع الغلاف ليتجه إلى <b>مشعب التمرير J-401</b> وإلى قمة المفاعل R-401 (حرارة إشعال الطبقة الأولى 380°C).</p>
              </div>
              <div class="v3d-step-box highlight">
                <div class="v3d-sb-num">المحطة 13 (مشعب J-401 و H-401)</div>
                <div class="v3d-sb-title">مشعب J-401 وهندسة الصمامات:</div>
                <p>يتفرع الغاز إلى خطين:
                  <br>• <b>خط بايباص J-401 Bypass</b>: صمام بايباص مفتوح بالتشغيل الطبيعي يدخل مباشرة لقمة R-401 Bed 1 (380°C).
                  <br>• <b>خط هيتر البدء H-401</b>: خطوط الدخول والخروج للهيتر مفتوحة فقط عند الإقلاع لبدء التفاعل، وبعدها يتم عزلها وإغلاقها تماماً وفتح البايباص.
                </p>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">المحطة 14</div>
                <div class="v3d-sb-title">تفاعل هابر-بوش داخل المفاعل R-401:</div>
                <p>يدخل الغاز عند 380°C لطبقة الكاتالست الأولى Bed 1، وتحدث تفاعلات تكوين NH3 الطاردة للحرارة عبر 3 طبقات محفز مع خطوط تبريد كوينش، وتصل الحرارة إلى <b>470°C</b>.</p>
              </div>
            </div>

            <!-- Col 3 -->
            <div class="v3d-pfd-col c3">
              <div class="v3d-col-header">
                <span class="v3d-col-num">3</span>
                <div>
                  <div class="v3d-col-title">قطار التبريد وتكثيف منتج الأمونيا</div>
                  <div class="v3d-col-sub">Sequential Tube-to-Tube Effluent Train (R-401 -> V-401)</div>
                </div>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">المحطة 15</div>
                <div class="v3d-sb-title">خروج قاع R-401 إلى تيوب E-401:</div>
                <p>يخرج غاز التفاعل الساخن <b>(470.0°C)</b> من قاع المفاعل R-401 ويدخل إلى <b>تيوب المبادل E-401</b>، حيث يبرد إلى <b>336.0°C</b> مسترجعاً الحرارة لغاز التغذية.</p>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">المحطة 16</div>
                <div class="v3d-sb-title">من تيوب E-401 إلى تيوب مسخن المراجل E-402:</div>
                <p>يرتبط الخط مباشرة من تيوب E-401 إلى <b>تيوب E-402 (BFW Preheater)</b>، حيث يبرد الغاز إلى <b>196.0°C</b> بينما يسخن مياه تغذية المراجل BFW عالية الضغط.</p>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">المحطة 17</div>
                <div class="v3d-sb-title">من تيوب E-402 إلى تيوب مسخن التغذية E-403:</div>
                <p>يدخل الغاز في <b>تيوب المبادل E-403</b> ويبرد من 196°C إلى <b>93.0°C</b> معطياً حرارته لغاز الشيل الذاهب لجدار المفاعل.</p>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">المحطة 18</div>
                <div class="v3d-sb-title">من تيوب E-403 إلى تيوب مكثف المياه E-404 A/B:</div>
                <p>يخرج الغاز من تيوب E-403 ويدخل إلى <b>تيوب مكثف مياه التبريد E-404 A/B</b>، حيث تتدفق مياه التبريد C.W. بالغلاف، ويبرد الغاز إلى <b>40.0°C</b> ويتكثف الجزء الأكبر من الأمونيا.</p>
              </div>
              <div class="v3d-step-box highlight">
                <div class="v3d-sb-num">المحطة 19 (عازل V-401 وإكمال الحلقة)</div>
                <div class="v3d-sb-title">عازل الأمونيا الأولي V-401 والريسايكل:</div>
                <p>يدخل الخليط المكثف إلى V-401:
                  <br>• <b>من القاع</b>: ينفصل سائل الأمونيا (41°C) ليذهب إلى وعاء التخفيض V-409.
                  <br>• <b>من القمة</b>: يخرج خط يسمى <b>خط الريسايكل</b> ليدخل في الضاغطة K-301 (وهو نفسه خط الريسايكل الذي يخرج منها ليدخل في شيل E-407 بالمحطة 1 لإكمال دورة التدوير المغلقة).
                </p>
              </div>
            </div>

            <!-- Col 4 -->
            <div class="v3d-pfd-col c4">
              <div class="v3d-col-header">
                <span class="v3d-col-num">4</span>
                <div>
                  <div class="v3d-col-title">غاز التعويض ومنظومة التثليج K-401</div>
                  <div class="v3d-col-sub">Make-Up Gas, Refrigeration & Storage Export</div>
                </div>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">محطة Make-Up</div>
                <div class="v3d-sb-title">مسار غاز التعويض الطازج:</div>
                <p>يخرج من المرحلة الرابعة لضاغط غاز التخليق K-301 بحرارة 95°C -> يدخل <b>تيوب مبرد غاز التعويض E-315</b> ويبرد بمياه التبريد إلى 26°C -> يدخل <b>عازل V-310</b> -> يخرج من أعلى V-310 ليحقن بالخط الواصل بين تيوب E-405 وتيوب E-406.</p>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">محطة التخفيض</div>
                <div class="v3d-sb-title">وعاء تخفيض الضغط V-409:</div>
                <p>يستقبل سائل الأمونيا من قاع V-401 (41°C) وقاع V-402 (-10°C)، ويخفض الضغط إلى <b>22 kg/cm²G</b> لطرد الغازات الذائبة (Flash Gas) وإرسالها للتطهير أو التثليج.</p>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">مضخات المنتج</div>
                <div class="v3d-sb-title">مضخات منتج الأمونيا P-401 A/B:</div>
                <p>مضختان طاردتان مركزيتان (واحدة بالعمل والأخرى احتياط) تسحبان سائل الأمونيا النقي 99.8% من قاع V-409 بمعدل <b>41,437 kg/h</b> وتضخانه نحو خزانات الحفظ المبردة والتصدير عند <b>-33°C</b>.</p>
              </div>
              <div class="v3d-step-box">
                <div class="v3d-sb-num">ضاغط التثليج</div>
                <div class="v3d-sb-title">ضاغط التثليج K-401 والتوربين K-401T:</div>
                <p>ضاغط غاز الأمونيا متعدد المراحل يسحب من عوازل السحب الثلاثة: <b>V-405 (-32°C)</b> و <b>V-406 (-10°C)</b> و <b>V-407 (+8°C)</b>، ثم يضغط البخار إلى مكثف E-412 ومستقبل السائل V-408 ليعاد تدوير وسيط التبريد في E-405 و E-406.</p>
              </div>
            </div>
          </div>

          <!-- Bottom Operational Note -->
          <div class="v3d-pfd-bottom-note">
            <b>✅ تأكيد المطابقة الهندسية الكاملة:</b> تم ضبط نموذج المصنع ثلاثي الأبعاد ليعكس بدقة المسافات بين المعدات، وتوسيع المخطط لمنع أي تداخل بين خطوط الأنابيب، مع مطابقة اتجاهات الجريان وألوان السوائل والغازات حسب درجات الحرارة الفعلية.
          </div>
        </div>
      </div>
    </div>
  `;

  // Inject Styles
  const style = document.createElement('style');
  style.id = 'v3d-custom-styles';
  style.textContent = `
    .view3d-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #030c14;
      z-index: 999999;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      direction: rtl;
      user-select: none;
      -webkit-user-select: none;
    }

    .v3d-header-wrap {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      background: #091522;
      border-bottom: 2px solid #00e5aa;
      z-index: 20;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .view3d-overlay.v3d-ui-hidden .v3d-header-wrap {
      transform: translateY(-100%);
      opacity: 0;
      pointer-events: none;
      position: absolute;
    }

    .view3d-overlay.v3d-ui-hidden .v3d-canvas-branding,
    .view3d-overlay.v3d-ui-hidden .view3d-hint {
      display: none;
    }

    /* 1. Top Branding Bar */
    .view3d-branding-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 18px;
      background: #04090f;
      border-bottom: 1px solid #142738;
      font-size: 11px;
      color: #90a4ae;
      gap: 12px;
    }

    .v3d-org-box {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .v3d-org-icon {
      font-size: 18px;
      color: #00c8ef;
    }

    .v3d-org-ar {
      font-weight: bold;
      color: #00c8ef;
      font-size: 11px;
      letter-spacing: 0.5px;
    }

    .v3d-org-en {
      font-size: 8.5px;
      color: #546e7a;
      letter-spacing: 0.8px;
    }

    .v3d-center-title {
      font-weight: 800;
      color: #eceff1;
      font-size: 12px;
      text-align: center;
      letter-spacing: 1px;
      font-family: 'Courier New', Courier, monospace;
    }

    .v3d-center-title small {
      display: block;
      font-size: 9px;
      color: #00e5aa;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .v3d-dev-box {
      text-align: left;
      font-size: 9.5px;
      direction: ltr;
    }

    .v3d-dev-label {
      color: #607d8b;
      margin-right: 4px;
    }

    .v3d-dev-name {
      font-weight: bold;
      color: #00e5aa;
      letter-spacing: 0.5px;
    }

    .v3d-dev-sub {
      display: block;
      font-size: 8.5px;
      color: #455a64;
    }

    /* 2. Topbar Navigation */
    .view3d-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 14px;
      background: #091522;
      gap: 8px;
      flex-wrap: nowrap;
      overflow-x: auto;
    }

    .v3d-nav-left, .v3d-nav-right {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .view3d-back-btn {
      background: linear-gradient(135deg, #00e5aa, #00c8ef);
      border: 1px solid #00e5aa;
      color: #030c14;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 11.5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      font-weight: 800;
      white-space: nowrap;
      box-shadow: 0 0 12px rgba(0, 229, 170, 0.35);
    }

    .view3d-back-btn:hover {
      background: #00e5aa;
      color: #010408;
      box-shadow: 0 0 18px rgba(0, 229, 170, 0.6);
      transform: translateY(-1px);
    }

    .view3d-close-btn, .view3d-toggle-ui-btn, .v3d-edu-btn {
      background: #112233;
      border: 1px solid #1e3a56;
      color: #cfd8dc;
      padding: 6px 11px;
      border-radius: 5px;
      font-size: 11px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.2s ease;
      font-weight: 600;
      white-space: nowrap;
    }

    .view3d-back-btn:hover, .v3d-edu-btn:hover {
      background: #193852;
      border-color: #00c8ef;
      color: #00c8ef;
    }

    .v3d-edu-btn {
      border-color: #00c8ef;
      color: #00c8ef;
      background: rgba(0, 200, 239, 0.08);
    }

    .view3d-close-btn {
      border-color: #c0392b;
      color: #e74c3c;
    }

    .view3d-close-btn:hover {
      background: #c0392b;
      color: #fff;
    }

    .view3d-title {
      font-size: 12px;
      font-weight: bold;
      color: #00e5aa;
      margin: 0 4px;
      white-space: nowrap;
    }

    .view3d-pagetabs {
      display: flex;
      align-items: center;
      gap: 4px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-x;
      padding: 2px 4px;
      flex: 1;
      scrollbar-width: thin;
    }

    .view3d-pgtab {
      background: #0f1f2e;
      border: 1px solid #1a334a;
      color: #90a4ae;
      padding: 5px 9px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }

    .view3d-pgtab:hover {
      background: #172d42;
      color: #00e5aa;
      border-color: #00e5aa;
    }

    .view3d-pgtab.on {
      background: #00e5aa;
      border-color: #00e5aa;
      color: #030c14;
      font-weight: 800;
      box-shadow: 0 0 10px rgba(0, 229, 170, 0.4);
    }

    /* 3. Stepper Bar */
    .view3d-stepper-bar {
      display: flex;
      align-items: center;
      padding: 4px 14px;
      background: #0b1a29;
      border-top: 1px solid #13273a;
      border-bottom: 1px solid #13273a;
      gap: 10px;
      font-size: 11px;
    }

    .v3d-stepper-label {
      color: #f5a800;
      font-weight: bold;
      font-size: 11px;
      white-space: nowrap;
    }

    .v3d-step-btn {
      background: #142a3e;
      border: 1px solid #23496d;
      color: #00c8ef;
      padding: 3px 9px;
      border-radius: 4px;
      font-size: 10.5px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.15s;
    }

    .v3d-step-btn:hover {
      background: #00c8ef;
      color: #030c14;
    }

    .v3d-step-badge {
      background: #f5a800;
      color: #030c14;
      padding: 2px 7px;
      border-radius: 10px;
      font-weight: 800;
      font-size: 9.5px;
    }

    .v3d-step-current {
      color: #eceff1;
      font-weight: 600;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 11px;
      font-family: 'Courier New', monospace;
    }

    /* 4. Advanced Layer Tools */
    .view3d-advanced-tools {
      display: flex;
      align-items: center;
      padding: 4px 14px;
      background: #07121c;
      overflow-x: auto;
      border-bottom: 1px solid #102232;
    }

    .v3d-tools-scroll {
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    .v3d-tool-label {
      color: #78909c;
      font-size: 10px;
      font-weight: bold;
    }

    .v3d-tool-sep {
      color: #263238;
      margin: 0 4px;
    }

    .v3d-tool-btn {
      background: #0d1e2d;
      border: 1px solid #18334a;
      color: #78909c;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 10px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .v3d-tool-btn:hover {
      color: #00c8ef;
      border-color: #00c8ef;
    }

    .v3d-tool-btn.on {
      background: #00c8ef;
      border-color: #00c8ef;
      color: #030c14;
      font-weight: bold;
    }

    /* Main Viewport & Floats */
    .view3d-canvas-wrap {
      flex: 1;
      position: relative;
      overflow: hidden;
      background: radial-gradient(circle at center, #0a1b2a 0%, #030910 80%, #010408 100%);
    }

    .v3d-float-top-actions {
      position: absolute;
      top: 14px;
      right: 14px;
      z-index: 45;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .v3d-float-back-btn {
      background: linear-gradient(135deg, #00e5aa, #00c8ef);
      border: 1px solid #00e5aa;
      color: #030c14;
      padding: 7px 14px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 16px rgba(0, 229, 170, 0.4);
      transition: all 0.2s ease;
    }

    .v3d-float-back-btn:hover {
      background: #00e5aa;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 229, 170, 0.6);
    }

    .v3d-float-toggleui {
      background: rgba(9, 21, 34, 0.85);
      border: 1px solid #00c8ef;
      color: #00c8ef;
      padding: 7px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      transition: all 0.15s ease;
    }

    .view3d-hint {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(4, 12, 20, 0.85);
      border: 1px solid #1e3a56;
      color: #00e5aa;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 11px;
      pointer-events: none;
      z-index: 10;
      backdrop-filter: blur(4px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
      white-space: nowrap;
    }

    .v3d-controls-float {
      position: absolute;
      left: 16px;
      bottom: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      z-index: 10;
    }

    .v3d-controls-float button {
      width: 36px;
      height: 36px;
      background: rgba(9, 21, 34, 0.85);
      border: 1px solid #1e3a56;
      color: #00c8ef;
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(6px);
      transition: all 0.15s;
    }

    .v3d-controls-float button:hover {
      background: #00c8ef;
      color: #030c14;
    }

    /* Inspector Card / Bottom Sheet */
    .view3d-info-card {
      position: absolute;
      top: 20px;
      left: 20px;
      width: 330px;
      background: rgba(9, 21, 34, 0.94);
      border: 1px solid #00c8ef;
      border-radius: 10px;
      padding: 16px;
      color: #eceff1;
      z-index: 15;
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
      animation: v3dFadeIn 0.25s ease;
    }

    @keyframes v3dFadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .view3d-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #1a334a;
      padding-bottom: 8px;
      margin-bottom: 8px;
    }

    .view3d-card-title-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .v3d-tag-badge {
      background: #00c8ef;
      color: #030c14;
      padding: 2px 7px;
      border-radius: 4px;
      font-weight: 800;
      font-size: 11px;
      font-family: 'Courier New', monospace;
    }

    .v3d-card-title-txt {
      font-size: 13px;
      font-weight: bold;
      color: #ffffff;
    }

    .v3d-card-close-btn {
      background: none;
      border: none;
      color: #78909c;
      font-size: 14px;
      cursor: pointer;
    }

    .v3d-card-close-btn:hover {
      color: #e74c3c;
    }

    .v3d-card-sub {
      font-size: 11.5px;
      color: #00e5aa;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .view3d-card-body {
      font-size: 11px;
      color: #b0bec5;
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .view3d-card-metrics {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
    }

    .v3d-metric-box {
      background: #06111a;
      border: 1px solid #142738;
      border-radius: 6px;
      padding: 6px 8px;
      text-align: center;
    }

    .v3d-mb-label {
      display: block;
      font-size: 9.5px;
      color: #78909c;
      margin-bottom: 2px;
    }

    .v3d-mb-val {
      font-size: 12px;
      font-weight: bold;
      color: #f5a800;
      font-family: 'Courier New', monospace;
    }

    .view3d-card-footer {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .v3d-btn-primary {
      width: 100%;
      background: #00c8ef;
      border: none;
      color: #030c14;
      padding: 7px;
      border-radius: 5px;
      font-weight: bold;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .v3d-btn-primary:hover {
      background: #00e5aa;
    }

    .v3d-btn-learn {
      width: 100%;
      background: rgba(0, 229, 170, 0.12);
      border: 1px solid #00e5aa;
      color: #00e5aa;
      padding: 6px;
      border-radius: 5px;
      font-weight: bold;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .v3d-btn-learn:hover {
      background: #00e5aa;
      color: #030c14;
    }

    /* Watermark */
    .v3d-canvas-branding {
      position: absolute;
      right: 16px;
      bottom: 12px;
      font-size: 9.5px;
      color: #455a64;
      display: flex;
      align-items: center;
      gap: 6px;
      pointer-events: none;
      z-index: 5;
    }

    .v3d-c-org { color: #00c8ef; font-weight: bold; }
    .v3d-c-dev { color: #78909c; }
    .v3d-c-dev b { color: #00e5aa; }

    /* Educational Drawer (الموسوعة الهندسية) */
    .v3d-edu-drawer {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 480px;
      max-width: 90vw;
      background: #06111c;
      border-right: 2px solid #00e5aa;
      z-index: 9999999;
      display: flex;
      flex-direction: column;
      box-shadow: 10px 0 40px rgba(0, 0, 0, 0.85);
      animation: v3dSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes v3dSlideIn {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }

    .v3d-drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #091a2b;
      border-bottom: 1px solid #142e47;
      gap: 10px;
    }

    .v3d-dh-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: bold;
      color: #ffffff;
      font-size: 13px;
      flex: 1;
    }

    .v3d-drawer-back-btn {
      background: rgba(0, 200, 239, 0.15);
      border: 1px solid #00c8ef;
      color: #00c8ef;
      padding: 4px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s ease;
      font-family: inherit;
    }

    .v3d-drawer-back-btn:hover {
      background: #00c8ef;
      color: #030c14;
      box-shadow: 0 0 10px rgba(0, 200, 239, 0.4);
    }

    .v3d-card-back-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid #1e3a56;
      color: #7dd3fc;
      width: 26px;
      height: 26px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      transition: all 0.15s ease;
    }

    .v3d-card-back-btn:hover {
      background: rgba(0, 200, 239, 0.2);
      border-color: #00c8ef;
      color: #ffffff;
    }

    .v3d-btn-back-side {
      background: #0d2338;
      border: 1px solid #1e3a56;
      color: #cbd5e1;
      padding: 8px 14px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      font-family: inherit;
    }

    .v3d-btn-back-side:hover {
      background: #14304c;
      border-color: #00c8ef;
      color: #00c8ef;
    }

    .v3d-dh-badge {
      background: #00e5aa;
      color: #030c14;
      padding: 3px 8px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-weight: 800;
    }

    .v3d-drawer-close-btn, .v3d-modal-close-btn {
      background: none;
      border: 1px solid #1e3a56;
      color: #b0bec5;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .v3d-drawer-close-btn:hover, .v3d-modal-close-btn:hover {
      background: #c0392b;
      border-color: #c0392b;
      color: #ffffff;
    }

    .v3d-drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 18px;
      font-size: 11.5px;
      color: #cfd8dc;
      line-height: 1.6;
    }

    .v3d-edu-section {
      background: #0a1b2a;
      border: 1px solid #15324d;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 14px;
    }

    .v3d-edu-sec-title {
      color: #00c8ef;
      font-weight: bold;
      font-size: 12px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
      border-bottom: 1px solid #12283e;
      padding-bottom: 4px;
    }

    .v3d-reaction-box {
      background: #03080e;
      border-right: 3px solid #f5a800;
      padding: 10px 12px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #f5a800;
      margin: 8px 0;
      direction: ltr;
      text-align: left;
    }

    .v3d-reaction-dh {
      font-size: 10.5px;
      color: #00e5aa;
      margin-top: 4px;
    }

    /* Modals */
    .v3d-quiz-modal, .v3d-search-modal {
      position: fixed;
      inset: 0;
      background: rgba(1, 6, 11, 0.88);
      z-index: 99999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(8px);
    }

    .v3d-modal-card {
      background: #081624;
      border: 1px solid #00c8ef;
      border-radius: 12px;
      max-width: 680px;
      width: 100%;
      max-height: 88vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
      overflow: hidden;
    }

    .v3d-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      background: #0d2238;
      border-bottom: 1px solid #1a3c5e;
    }

    .v3d-mh-title {
      font-weight: bold;
      color: #00c8ef;
      font-size: 13px;
    }

    .v3d-modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      font-size: 12px;
      color: #eceff1;
    }

    .v3d-quiz-qbox {
      background: #0b1d2e;
      border: 1px solid #163654;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 16px;
    }

    .v3d-quiz-qtitle {
      font-size: 13px;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 12px;
    }

    .v3d-quiz-opt {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      background: #06111a;
      border: 1px solid #162f47;
      border-radius: 6px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .v3d-quiz-opt:hover {
      background: #11283d;
      border-color: #00c8ef;
    }

    .v3d-quiz-opt.selected {
      background: rgba(0, 200, 239, 0.15);
      border-color: #00c8ef;
      color: #00c8ef;
      font-weight: bold;
    }

    .v3d-quiz-opt.correct {
      background: rgba(0, 229, 170, 0.2);
      border-color: #00e5aa;
      color: #00e5aa;
      font-weight: bold;
    }

    .v3d-quiz-opt.wrong {
      background: rgba(231, 76, 60, 0.2);
      border-color: #e74c3c;
      color: #e74c3c;
    }

    .v3d-quiz-explain {
      margin-top: 10px;
      padding: 10px;
      background: #061320;
      border-radius: 6px;
      border-right: 3px solid #00e5aa;
      font-size: 11.5px;
      color: #b0bec5;
    }

    /* Certificate Layout */
    .v3d-cert-wrap {
      background: #ffffff;
      color: #1a2530;
      padding: 30px;
      border: 8px double #0a3d91;
      border-radius: 8px;
      text-align: center;
      position: relative;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
      direction: rtl;
    }

    .v3d-cert-org {
      font-size: 16px;
      font-weight: bold;
      color: #0a3d91;
      margin-bottom: 4px;
    }

    .v3d-cert-sub {
      font-size: 11px;
      color: #546e7a;
      letter-spacing: 1px;
      margin-bottom: 18px;
    }

    .v3d-cert-title {
      font-size: 20px;
      font-weight: 800;
      color: #b38600;
      margin-bottom: 12px;
      letter-spacing: 1px;
    }

    .v3d-cert-name {
      font-size: 22px;
      font-weight: 800;
      color: #0d233a;
      border-bottom: 2px solid #0a3d91;
      display: inline-block;
      padding: 2px 24px;
      margin: 10px 0;
    }

    .v3d-cert-desc {
      font-size: 12.5px;
      line-height: 1.7;
      color: #37474f;
      margin: 14px auto;
      max-width: 500px;
    }

    .v3d-cert-signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      padding-top: 14px;
      border-top: 1px dashed #b0bec5;
      font-size: 11px;
      color: #455a64;
    }

    .v3d-cert-seal {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      border: 2px solid #b38600;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #b38600;
      font-weight: bold;
      font-size: 10px;
      margin: 0 auto;
    }

    /* Search Modal */
    .v3d-search-card {
      background: #081624;
      border: 1px solid #00c8ef;
      border-radius: 10px;
      max-width: 540px;
      width: 100%;
      max-height: 75vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .v3d-search-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #0d2238;
      font-size: 12px;
      font-weight: bold;
      color: #00c8ef;
    }

    .v3d-search-input-wrap {
      padding: 12px 16px;
      background: #06111a;
      border-bottom: 1px solid #142e47;
    }

    .v3d-search-input-wrap input {
      width: 100%;
      background: #0b1f33;
      border: 1px solid #1f476e;
      color: #ffffff;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 12px;
      outline: none;
      box-sizing: border-box;
    }

    .v3d-search-input-wrap input:focus {
      border-color: #00c8ef;
    }

    .v3d-search-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .v3d-search-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #0c1c2b;
      border: 1px solid #16324d;
      padding: 10px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .v3d-search-item:hover {
      background: #14304c;
      border-color: #00e5aa;
    }

    .v3d-si-tag {
      background: #00c8ef;
      color: #030c14;
      padding: 2px 6px;
      border-radius: 3px;
      font-weight: bold;
      font-size: 11px;
      font-family: 'Courier New', monospace;
    }

    .v3d-si-name {
      font-weight: bold;
      color: #eceff1;
      font-size: 12px;
      margin-right: 8px;
      flex: 1;
    }

    .v3d-si-temp {
      font-size: 11px;
      color: #f5a800;
      font-family: 'Courier New', monospace;
    }

    /* Master Unit 400 Operational PFD Modal */
    .v3d-sec400-pfd-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(3, 12, 20, 0.88);
      z-index: 1000000;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(8px);
      padding: 16px;
      box-sizing: border-box;
    }

    .v3d-pfd-modal-card {
      width: 100%;
      max-width: 1350px;
      max-height: 92vh;
      background: #07121e;
      border: 2px solid #00c8ef;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 200, 239, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      direction: rtl;
    }

    .v3d-pfd-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      background: #0b1f33;
      border-bottom: 2px solid #143552;
    }

    .v3d-pfd-title-box {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .v3d-pfd-badge {
      background: #00e5aa;
      color: #030c14;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 800;
      font-family: monospace;
    }

    .v3d-pfd-title-txt {
      color: #ffffff;
      font-weight: bold;
      font-size: 15px;
    }

    .v3d-pfd-header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .v3d-pfd-modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .v3d-pfd-status-banner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      background: #040c14;
      border: 1px solid #142f47;
      border-radius: 8px;
      padding: 12px 16px;
    }

    .v3d-status-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      line-height: 1.5;
    }

    .v3d-status-item.normal .v3d-status-dot { color: #10b981; font-size: 16px; }
    .v3d-status-item.normal .v3d-status-label { color: #34d399; font-weight: bold; }
    .v3d-status-item.normal .v3d-status-val { color: #f1f5f9; }

    .v3d-status-item.startup .v3d-status-dot { color: #f59e0b; font-size: 16px; }
    .v3d-status-item.startup .v3d-status-label { color: #fbbf24; font-weight: bold; }
    .v3d-status-item.startup .v3d-status-val { color: #f1f5f9; }

    .v3d-pfd-columns-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }

    .v3d-pfd-col {
      background: #091724;
      border: 1px solid #142e47;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .v3d-pfd-col.c1 { border-top: 4px solid #0ea5e9; }
    .v3d-pfd-col.c2 { border-top: 4px solid #ea580c; }
    .v3d-pfd-col.c3 { border-top: 4px solid #dc2626; }
    .v3d-pfd-col.c4 { border-top: 4px solid #8b5cf6; }

    .v3d-col-header {
      padding: 12px 14px;
      background: #0d2133;
      border-bottom: 1px solid #163654;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .v3d-col-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #00c8ef;
      color: #030c14;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
    }

    .v3d-col-title {
      font-size: 13px;
      font-weight: bold;
      color: #ffffff;
    }

    .v3d-col-sub {
      font-size: 10px;
      color: #94a3b8;
      font-family: monospace;
    }

    .v3d-step-box {
      padding: 10px 12px;
      border-bottom: 1px solid #11263a;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 11.5px;
      line-height: 1.5;
    }

    .v3d-step-box.highlight {
      background: rgba(0, 200, 239, 0.08);
      border-right: 3px solid #00c8ef;
    }

    .v3d-sb-num {
      font-size: 10px;
      font-weight: bold;
      color: #00e5aa;
    }

    .v3d-sb-title {
      font-weight: bold;
      color: #38bdf8;
    }

    .v3d-step-box p {
      margin: 0;
      color: #cbd5e1;
    }

    .v3d-pfd-bottom-note {
      background: rgba(0, 229, 170, 0.1);
      border: 1px solid #00e5aa;
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 12px;
      color: #e2e8f0;
      line-height: 1.5;
    }

    @media (max-width: 1080px) {
      .v3d-pfd-columns-grid { grid-template-columns: 1fr 1fr; }
      .v3d-pfd-status-banner { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .v3d-pfd-columns-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 900px) {
      .view3d-branding-bar { display: none; }
      .v3d-dev-box { display: none; }
      .view3d-info-card {
        top: auto;
        bottom: 10px;
        left: 10px;
        right: 10px;
        width: auto;
        max-width: none;
        max-height: 48vh;
        overflow-y: auto;
      }
    }
  `;
  document.head.appendChild(style);

  // Stepper UI Synchronizer
  const stepCurrentTitle = document.getElementById('v3d-step-current-title');
  const stepBadge = document.getElementById('v3d-step-badge');

  const updateModeBadgeUI = (isolatedSec: string | boolean | null) => {
    const badgeIcon = document.getElementById('v3d-mode-badge-icon');
    const badgeTxt = document.getElementById('v3d-mode-badge-txt');
    const badgeSwitchBtn = document.getElementById('v3d-badge-switch-btn');
    const toggleIsoBtn = document.getElementById('v3d-toggle-isolation');
    const toggleCo2IsoBtn = document.getElementById('v3d-toggle-co2-isolation');
    const statusBadge = document.getElementById('v3d-mode-status-badge');

    const isSec1 = isolatedSec === true || isolatedSec === 'sec_reformer';
    const isSecCO2 = isolatedSec === 'sec_co2' || isolatedSec === 'sec_catacarb';
    const isSecK301 = isolatedSec === 'sec_k301' || isolatedSec === 'sec_compressor' || isolatedSec === 'sec_syngas';
    const isSecSynLoop = isolatedSec === 'sec_synloop' || isolatedSec === 'sec_synth' || isolatedSec === 'synth' || isolatedSec === 'section_7' || isolatedSec === 'sec_loop';
    const isSecRefrig = isolatedSec === 'sec_refrigeration' || isolatedSec === 'sec_k401' || isolatedSec === 'k401ref' || isolatedSec === 'sec_refrig';
    const toggleK301IsoBtn = document.getElementById('v3d-toggle-k301-isolation');
    const toggleSynLoopIsoBtn = document.getElementById('v3d-toggle-synloop-isolation');
    const toggleRefrigIsoBtn = document.getElementById('v3d-toggle-refrig-isolation');

    // Reset all buttons to default off
    if (toggleIsoBtn) {
      toggleIsoBtn.classList.remove('on');
      toggleIsoBtn.textContent = '🔥 عزل تحويل الغاز';
      toggleIsoBtn.style.borderColor = '#ff9800';
      toggleIsoBtn.style.color = '#ffb74d';
      toggleIsoBtn.style.background = 'rgba(255,152,0,0.15)';
    }
    if (toggleCo2IsoBtn) {
      toggleCo2IsoBtn.classList.remove('on');
      toggleCo2IsoBtn.textContent = '🧪 عزل إزالة CO₂';
      toggleCo2IsoBtn.style.borderColor = '#00e5aa';
      toggleCo2IsoBtn.style.color = '#00e5aa';
      toggleCo2IsoBtn.style.background = 'rgba(0,229,170,0.15)';
    }
    if (toggleK301IsoBtn) {
      toggleK301IsoBtn.classList.remove('on');
      toggleK301IsoBtn.textContent = '⚡ عزل ضاغط K-301';
      toggleK301IsoBtn.style.borderColor = '#ffeb3b';
      toggleK301IsoBtn.style.color = '#ffeb3b';
      toggleK301IsoBtn.style.background = 'rgba(255,235,59,0.15)';
    }
    if (toggleSynLoopIsoBtn) {
      toggleSynLoopIsoBtn.classList.remove('on');
      toggleSynLoopIsoBtn.textContent = '⚛️ عزل حلقة الأمونيا R-401';
      toggleSynLoopIsoBtn.style.borderColor = '#00c8ef';
      toggleSynLoopIsoBtn.style.color = '#00c8ef';
      toggleSynLoopIsoBtn.style.background = 'rgba(0,200,239,0.15)';
    }
    if (toggleRefrigIsoBtn) {
      toggleRefrigIsoBtn.classList.remove('on');
      toggleRefrigIsoBtn.textContent = '❄️ عزل التثليج K-401';
      toggleRefrigIsoBtn.style.borderColor = '#00e5aa';
      toggleRefrigIsoBtn.style.color = '#00e5aa';
      toggleRefrigIsoBtn.style.background = 'rgba(0,229,170,0.15)';
    }

    if (isSecSynLoop) {
      if (statusBadge) statusBadge.style.borderColor = '#00c8ef';
      if (badgeIcon) badgeIcon.textContent = '⚛️';
      if (badgeTxt) {
        badgeTxt.style.color = '#00c8ef';
        badgeTxt.textContent = 'وضع مجسم حلقة تخليق الأمونيا والمفاعل R-401 والمبادلات 3D (معزولة بدقة)';
      }
      if (badgeSwitchBtn) {
        badgeSwitchBtn.textContent = '🌐 إظهار المصنع كاملاً';
        badgeSwitchBtn.style.background = '#00c8ef';
        badgeSwitchBtn.style.color = '#030c14';
      }
      if (toggleSynLoopIsoBtn) {
        toggleSynLoopIsoBtn.classList.add('on');
        toggleSynLoopIsoBtn.textContent = '🌐 إظهار المصنع كاملاً';
        toggleSynLoopIsoBtn.style.borderColor = '#00c8ef';
        toggleSynLoopIsoBtn.style.background = '#00c8ef';
        toggleSynLoopIsoBtn.style.color = '#030c14';
      }
    } else if (isSecRefrig) {
      if (statusBadge) statusBadge.style.borderColor = '#00e5aa';
      if (badgeIcon) badgeIcon.textContent = '❄️';
      if (badgeTxt) {
        badgeTxt.style.color = '#00e5aa';
        badgeTxt.textContent = 'وضع مجسم منظومة التثليج ومكثفات الأمونيا K-401 ثلاثية الأبعاد 3D (معزولة)';
      }
      if (badgeSwitchBtn) {
        badgeSwitchBtn.textContent = '🌐 إظهار المصنع كاملاً';
        badgeSwitchBtn.style.background = '#00e5aa';
        badgeSwitchBtn.style.color = '#030c14';
      }
      if (toggleRefrigIsoBtn) {
        toggleRefrigIsoBtn.classList.add('on');
        toggleRefrigIsoBtn.textContent = '🌐 إظهار المصنع كاملاً';
        toggleRefrigIsoBtn.style.borderColor = '#00e5aa';
        toggleRefrigIsoBtn.style.background = '#00e5aa';
        toggleRefrigIsoBtn.style.color = '#030c14';
      }
    } else if (isSecK301) {
      if (statusBadge) statusBadge.style.borderColor = '#ffeb3b';
      if (badgeIcon) badgeIcon.textContent = '⚡';
      if (badgeTxt) {
        badgeTxt.style.color = '#ffeb3b';
        badgeTxt.textContent = 'وضع مجسم ضاغط غاز التخليق K-301 والتوربين البخاري 3D (K-301, E-315, V-310 معزولة)';
      }
      if (badgeSwitchBtn) {
        badgeSwitchBtn.textContent = '🌐 إظهار المصنع كاملاً';
        badgeSwitchBtn.style.background = '#ffeb3b';
        badgeSwitchBtn.style.color = '#030c14';
      }
      if (toggleK301IsoBtn) {
        toggleK301IsoBtn.classList.add('on');
        toggleK301IsoBtn.textContent = '🌐 إظهار المصنع كاملاً';
        toggleK301IsoBtn.style.borderColor = '#ffeb3b';
        toggleK301IsoBtn.style.background = '#ffeb3b';
        toggleK301IsoBtn.style.color = '#030c14';
      }
    } else if (isSecCO2) {
      if (statusBadge) statusBadge.style.borderColor = '#00e5aa';
      if (badgeIcon) badgeIcon.textContent = '🧪';
      if (badgeTxt) {
        badgeTxt.style.color = '#00e5aa';
        badgeTxt.textContent = 'وضع مجسم إزالة CO₂ كاتاكارب 3D (T-201, T-202, E-201, V-201, V-204, P-201 معزولة)';
      }
      if (badgeSwitchBtn) {
        badgeSwitchBtn.textContent = '🌐 إظهار المصنع كاملاً';
        badgeSwitchBtn.style.background = '#00e5aa';
        badgeSwitchBtn.style.color = '#030c14';
      }
      if (toggleCo2IsoBtn) {
        toggleCo2IsoBtn.classList.add('on');
        toggleCo2IsoBtn.textContent = '🌐 إظهار المصنع كاملاً';
        toggleCo2IsoBtn.style.borderColor = '#00e5aa';
        toggleCo2IsoBtn.style.background = '#00e5aa';
        toggleCo2IsoBtn.style.color = '#030c14';
      }
    } else if (isSec1) {
      if (statusBadge) statusBadge.style.borderColor = '#ff9800';
      if (badgeIcon) badgeIcon.textContent = '🔥';
      if (badgeTxt) {
        badgeTxt.style.color = '#ffb74d';
        badgeTxt.textContent = 'وضع مجسم قسم تحويل الغاز 3D (معدات القسم 1 معزولة بدقة دون تداخل)';
      }
      if (badgeSwitchBtn) {
        badgeSwitchBtn.textContent = '🌐 إظهار المصنع كاملاً';
        badgeSwitchBtn.style.background = '#00e5aa';
        badgeSwitchBtn.style.color = '#030c14';
      }
      if (toggleIsoBtn) {
        toggleIsoBtn.classList.add('on');
        toggleIsoBtn.textContent = '🌐 إظهار المصنع كاملاً';
        toggleIsoBtn.style.borderColor = '#ff9800';
        toggleIsoBtn.style.color = '#030c14';
        toggleIsoBtn.style.background = '#ff9800';
      }
    } else {
      if (statusBadge) statusBadge.style.borderColor = '#00e5aa';
      if (badgeIcon) badgeIcon.textContent = '🌐';
      if (badgeTxt) {
        badgeTxt.style.color = '#00e5aa';
        badgeTxt.textContent = 'وضع مجمع المصنع بالكامل 3D (Full Plant Complex)';
      }
      if (badgeSwitchBtn) {
        badgeSwitchBtn.textContent = '🔥 عزل القسم 1';
        badgeSwitchBtn.style.background = '#ff9800';
        badgeSwitchBtn.style.color = '#030c14';
      }
    }
  };

  const updateStepperUI = (stepInfo: any) => {
    if (stepCurrentTitle) stepCurrentTitle.textContent = stepInfo.title;
    if (stepBadge) stepBadge.textContent = `${stepInfo.stepIndex + 1} / ${stepInfo.totalSteps || 15}`;
    if (stepInfo.equipment) {
      showEquipmentCard(stepInfo.equipment);
    }
  };

  // Bind Main View Modes & Process Units
  const tabs = view3DOverlay.querySelectorAll('.view3d-pgtab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      plantAudio.playClick();
      tabs.forEach((t) => t.classList.remove('on'));
      const target = e.currentTarget as HTMLElement;
      target.classList.add('on');
      const mode = (target.getAttribute('data-mode') as ViewMode3D) || 'plant_overview';
      const sec = target.getAttribute('data-sec');
      const isSplash = target.getAttribute('data-splash') === 'true';
      if (engine3D) {
        if (isSplash || sec === 'sec_reformer' || sec === 'sec_co2' || sec === 'sec_k301') {
          engine3D.startSection360Splash(sec || 'sec_reformer', updateStepperUI);
          updateModeBadgeUI(sec || 'sec_reformer');
        } else if (sec && sec !== 'overview' && sec !== 'top_layout' && sec !== 'control_room') {
          engine3D.focusSection(sec, updateStepperUI);
          updateModeBadgeUI(null);
        } else {
          engine3D.setViewMode(mode);
          updateModeBadgeUI(null);
          if (stepCurrentTitle) {
            stepCurrentTitle.textContent =
              mode === 'control_room'
                ? 'غرفة السيطرة اليابانية (MHI 1977)'
                : mode === 'top_layout'
                ? 'المخطط الهندسي الأفقي العلوي (P&ID Layout)'
                : 'استعراض مجمع تصنيع الأمونيا بالكامل 3D (Full Plant Complex)';
          }
        }
      }
    });
  });

  // Isolation Toggles (Toolbar button & Canvas Floating Badge)
  const toggleIsolationAction = () => {
    plantAudio.playClick();
    if (engine3D) {
      const isIso = engine3D.toggleSection1Isolation(updateStepperUI);
      updateModeBadgeUI(isIso ? 'sec_reformer' : null);

      // Sync tabs active state
      tabs.forEach((t) => {
        const tabSec = t.getAttribute('data-sec');
        if (isIso) {
          t.classList.toggle('on', tabSec === 'sec_reformer' && t.getAttribute('data-splash') === 'true');
        } else {
          t.classList.toggle('on', tabSec === 'overview');
        }
      });
    }
  };

  const toggleCO2IsolationAction = () => {
    plantAudio.playClick();
    if (engine3D) {
      const isIso = engine3D.toggleCO2SectionIsolation(updateStepperUI);
      updateModeBadgeUI(isIso ? 'sec_co2' : null);

      // Sync tabs active state
      tabs.forEach((t) => {
        const tabSec = t.getAttribute('data-sec');
        if (isIso) {
          t.classList.toggle('on', tabSec === 'sec_co2' && t.getAttribute('data-splash') === 'true');
        } else {
          t.classList.toggle('on', tabSec === 'overview');
        }
      });
    }
  };

  const toggleK301IsolationAction = () => {
    plantAudio.playClick();
    if (engine3D) {
      const isIso = engine3D.toggleK301SectionIsolation(updateStepperUI);
      updateModeBadgeUI(isIso ? 'sec_k301' : null);

      // Sync tabs active state
      tabs.forEach((t) => {
        const tabSec = t.getAttribute('data-sec');
        if (isIso) {
          t.classList.toggle('on', tabSec === 'sec_k301' && t.getAttribute('data-splash') === 'true');
        } else {
          t.classList.toggle('on', tabSec === 'overview');
        }
      });
    }
  };

  const toggleSynLoopIsolationAction = () => {
    plantAudio.playClick();
    if (engine3D) {
      const isIso = engine3D.toggleSynLoopSectionIsolation(updateStepperUI);
      updateModeBadgeUI(isIso ? 'sec_synloop' : null);

      // Sync tabs active state
      tabs.forEach((t) => {
        const tabSec = t.getAttribute('data-sec');
        if (isIso) {
          t.classList.toggle('on', tabSec === 'sec_synloop' && t.getAttribute('data-splash') === 'true');
        } else {
          t.classList.toggle('on', tabSec === 'overview');
        }
      });
    }
  };

  const toggleRefrigIsolationAction = () => {
    plantAudio.playClick();
    if (engine3D) {
      const isIso = engine3D.toggleRefrigSectionIsolation(updateStepperUI);
      updateModeBadgeUI(isIso ? 'sec_refrigeration' : null);

      // Sync tabs active state
      tabs.forEach((t) => {
        const tabSec = t.getAttribute('data-sec');
        if (isIso) {
          t.classList.toggle('on', tabSec === 'sec_refrigeration' && t.getAttribute('data-splash') === 'true');
        } else {
          t.classList.toggle('on', tabSec === 'overview');
        }
      });
    }
  };

  document.getElementById('v3d-toggle-isolation')?.addEventListener('click', toggleIsolationAction);
  document.getElementById('v3d-toggle-co2-isolation')?.addEventListener('click', toggleCO2IsolationAction);
  document.getElementById('v3d-toggle-k301-isolation')?.addEventListener('click', toggleK301IsolationAction);
  document.getElementById('v3d-toggle-synloop-isolation')?.addEventListener('click', toggleSynLoopIsolationAction);
  document.getElementById('v3d-toggle-refrig-isolation')?.addEventListener('click', toggleRefrigIsolationAction);
  document.getElementById('v3d-badge-switch-btn')?.addEventListener('click', () => {
    if (engine3D?.plant.currentIsolatedSection === 'sec_synloop') {
      toggleSynLoopIsolationAction();
    } else if (engine3D?.plant.currentIsolatedSection === 'sec_refrigeration') {
      toggleRefrigIsolationAction();
    } else if (engine3D?.plant.currentIsolatedSection === 'sec_k301') {
      toggleK301IsolationAction();
    } else if (engine3D?.plant.currentIsolatedSection === 'sec_co2') {
      toggleCO2IsolationAction();
    } else {
      toggleIsolationAction();
    }
  });

  document.getElementById('v3d-step-prev')?.addEventListener('click', () => {
    plantAudio.playClick();
    engine3D?.stepProcessRoute('prev', updateStepperUI);
  });

  document.getElementById('v3d-step-next')?.addEventListener('click', () => {
    plantAudio.playClick();
    engine3D?.stepProcessRoute('next', updateStepperUI);
  });

  // Layer Toggles
  const toggleTempBtn = document.getElementById('v3d-toggle-temp');
  toggleTempBtn?.addEventListener('click', () => {
    plantAudio.playClick();
    isTempBadgesOn = !isTempBadgesOn;
    toggleTempBtn.classList.toggle('on', isTempBadgesOn);
    engine3D?.plant.setTemperatureBadgesVisible(isTempBadgesOn);
  });

  const toggleCtrlBtn = document.getElementById('v3d-toggle-ctrl');
  toggleCtrlBtn?.addEventListener('click', () => {
    plantAudio.playClick();
    isControllersOn = !isControllersOn;
    toggleCtrlBtn.classList.toggle('on', isControllersOn);
    engine3D?.plant.setControllersVisible(isControllersOn);
  });

  const toggleTagsBtn = document.getElementById('v3d-toggle-tags');
  toggleTagsBtn?.addEventListener('click', () => {
    plantAudio.playClick();
    isTagsOn = !isTagsOn;
    toggleTagsBtn.classList.toggle('on', isTagsOn);
    engine3D?.plant.setEquipmentTagsVisible(isTagsOn);
  });

  const toggleFlowBtn = document.getElementById('v3d-toggle-flow');
  toggleFlowBtn?.addEventListener('click', () => {
    plantAudio.playClick();
    isFlowParticlesOn = !isFlowParticlesOn;
    toggleFlowBtn.classList.toggle('on', isFlowParticlesOn);
    engine3D?.plant.setFlowParticlesVisible(isFlowParticlesOn);
  });

  // Lighting Modes
  const envSunsetBtn = document.getElementById('v3d-env-sunset');
  const envDaylightBtn = document.getElementById('v3d-env-daylight');
  const envNightBtn = document.getElementById('v3d-env-night');

  const setEnvActiveBtn = (activeBtn: HTMLElement | null) => {
    [envSunsetBtn, envDaylightBtn, envNightBtn].forEach((btn) => btn?.classList.remove('on'));
    activeBtn?.classList.add('on');
  };

  envSunsetBtn?.addEventListener('click', () => {
    plantAudio.playClick();
    setEnvActiveBtn(envSunsetBtn);
    engine3D?.setEnvironmentMode('sunset');
  });
  envDaylightBtn?.addEventListener('click', () => {
    plantAudio.playClick();
    setEnvActiveBtn(envDaylightBtn);
    engine3D?.setEnvironmentMode('daylight');
  });
  envNightBtn?.addEventListener('click', () => {
    plantAudio.playClick();
    setEnvActiveBtn(envNightBtn);
    engine3D?.setEnvironmentMode('night');
  });

  // X-Ray Mode
  const xrayBtn = document.getElementById('v3d-btn-xray');
  xrayBtn?.addEventListener('click', () => {
    plantAudio.playClick();
    if (engine3D) {
      const isXRayOn = engine3D.toggleXRayMode();
      xrayBtn.classList.toggle('on', isXRayOn);
    }
  });

  // 360 Auto-Rotate
  const rotateBtn = document.getElementById('v3d-btn-rotate');
  const rotateFloatBtn = document.getElementById('v3d-btn-rotate-float');

  const toggleRotateAction = () => {
    plantAudio.playClick();
    if (engine3D) {
      const isRot = engine3D.toggleAutoRotate();
      rotateBtn?.classList.toggle('on', isRot);
      rotateFloatBtn?.classList.toggle('on', isRot);
    }
  };

  rotateBtn?.addEventListener('click', toggleRotateAction);
  rotateFloatBtn?.addEventListener('click', toggleRotateAction);

  // Audio Soundscape Toggle
  const audioBtn = document.getElementById('v3d-btn-audio');
  const audioIcon = document.getElementById('v3d-audio-icon');
  audioBtn?.addEventListener('click', () => {
    isAudioOn = plantAudio.toggleMute();
    if (audioIcon) audioIcon.textContent = isAudioOn ? '🔊' : '🔇';
    audioBtn.classList.toggle('on', isAudioOn);
  });

  // Camera Zoom & Reset
  document.getElementById('v3d-zoom-in')?.addEventListener('click', () => {
    plantAudio.playClick();
    engine3D?.zoomIn();
  });
  document.getElementById('v3d-zoom-out')?.addEventListener('click', () => {
    plantAudio.playClick();
    engine3D?.zoomOut();
  });
  document.getElementById('v3d-reset-cam')?.addEventListener('click', () => {
    plantAudio.playClick();
    engine3D?.resetCamera();
  });

  // Toggle UI Handlers
  const toggleUI = (force?: boolean) => {
    isUIHidden = force !== undefined ? force : !isUIHidden;
    view3DOverlay?.classList.toggle('v3d-ui-hidden', isUIHidden);

    const floatBtn = document.getElementById('v3d-float-toggleui');
    const topbarBtn = document.getElementById('v3d-topbar-toggleui');

    if (floatBtn) {
      floatBtn.textContent = isUIHidden ? '👁 إظهار القوائم (Show UI)' : '👁 إخفاء القوائم (Hide UI)';
    }
    if (topbarBtn) {
      const txt = topbarBtn.querySelector('.v3d-ui-txt');
      if (txt) txt.textContent = isUIHidden ? 'إظهار القوائم' : 'ملء الشاشة';
    }

    setTimeout(() => {
      engine3D?.resize();
    }, 100);
  };

  document.getElementById('v3d-float-toggleui')?.addEventListener('click', () => toggleUI());
  document.getElementById('v3d-topbar-toggleui')?.addEventListener('click', () => toggleUI());

  // Close & Back
  const handleClose = () => {
    plantAudio.playClick();
    if (typeof (window as any).setMode === 'function') {
      (window as any).setMode('dcs');
    }
    close3D();
  };
  document.getElementById('view3d-back-btn')?.addEventListener('click', handleClose);
  document.getElementById('view3d-close-btn')?.addEventListener('click', handleClose);
  document.getElementById('v3d-float-back-btn')?.addEventListener('click', handleClose);

  // Inspector Close & Back
  const handleCardBack = () => {
    plantAudio.playClick();
    const card = document.getElementById('view3d-info-card');
    if (card) card.style.display = 'none';
  };
  document.getElementById('v3d-card-close')?.addEventListener('click', handleCardBack);
  document.getElementById('v3d-card-back-btn')?.addEventListener('click', handleCardBack);

  // Drawer Close & Back
  const handleDrawerBack = () => {
    plantAudio.playClick();
    const drawer = document.getElementById('v3d-edu-drawer');
    if (drawer) drawer.style.display = 'none';
  };
  document.getElementById('v3d-drawer-close')?.addEventListener('click', handleDrawerBack);
  document.getElementById('v3d-drawer-back-btn')?.addEventListener('click', handleDrawerBack);

  // Quiz Modal Trigger & Close
  document.getElementById('v3d-btn-quiz')?.addEventListener('click', () => {
    plantAudio.playClick();
    openQuizModal();
  });
  document.getElementById('v3d-quiz-close')?.addEventListener('click', () => {
    const qm = document.getElementById('v3d-quiz-modal');
    if (qm) qm.style.display = 'none';
  });

  // Search Modal Trigger & Close
  document.getElementById('v3d-btn-search')?.addEventListener('click', () => {
    plantAudio.playClick();
    openSearchModal();
  });
  document.getElementById('v3d-search-close')?.addEventListener('click', () => {
    const sm = document.getElementById('v3d-search-modal');
    if (sm) sm.style.display = 'none';
  });

  // Master Unit 400 Operational PFD Modal Trigger & Close
  document.getElementById('v3d-sec400-pfd-btn')?.addEventListener('click', () => {
    plantAudio.playClick();
    openSec400PfdModal();
  });
  document.getElementById('v3d-sec400-pfd-close')?.addEventListener('click', () => {
    const pm = document.getElementById('v3d-sec400-pfd-modal');
    if (pm) pm.style.display = 'none';
  });
  document.getElementById('v3d-pfd-goto-board-btn')?.addEventListener('click', () => {
    plantAudio.playClick();
    const pm = document.getElementById('v3d-sec400-pfd-modal');
    if (pm) pm.style.display = 'none';
    engine3D?.focusEquipment('unit400_master_pfd_board');
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (!view3DOverlay || view3DOverlay.style.display === 'none') return;
    if (e.key === 'Escape') {
      const pm = document.getElementById('v3d-sec400-pfd-modal');
      const qm = document.getElementById('v3d-quiz-modal');
      const sm = document.getElementById('v3d-search-modal');
      const drawer = document.getElementById('v3d-edu-drawer');
      const card = document.getElementById('view3d-info-card');
      if (pm && pm.style.display !== 'none') {
        pm.style.display = 'none';
      } else if (qm && qm.style.display !== 'none') {
        qm.style.display = 'none';
      } else if (sm && sm.style.display !== 'none') {
        sm.style.display = 'none';
      } else if (drawer && drawer.style.display !== 'none') {
        drawer.style.display = 'none';
      } else if (card && card.style.display !== 'none') {
        card.style.display = 'none';
      } else {
        close3D();
      }
    } else if (e.key === 'f' || e.key === 'F') {
      toggleUI();
    } else if (e.key === ' ') {
      toggleRotateAction();
    }
  });
}

function openSec400PfdModal() {
  const modal = document.getElementById('v3d-sec400-pfd-modal');
  if (!modal) return;
  modal.style.display = 'flex';
}

function showEquipmentCard(eq: EquipmentInfo) {
  const card = document.getElementById('view3d-info-card');
  const tag = document.getElementById('v3d-card-tag');
  const title = document.getElementById('v3d-card-title');
  const arname = document.getElementById('v3d-card-arname');
  const desc = document.getElementById('v3d-card-desc');
  const temp = document.getElementById('v3d-card-temp');
  const press = document.getElementById('v3d-card-press');
  const actBtn = document.getElementById('v3d-card-action');
  const learnBtn = document.getElementById('v3d-card-learn-btn');

  if (card && tag && title && desc && temp && press) {
    tag.textContent = eq.tag;
    title.textContent = eq.name;
    if (arname) arname.textContent = eq.arabicName || eq.name;
    desc.textContent = eq.description;
    temp.textContent = eq.operatingTemp;
    press.textContent = eq.operatingPress;
    card.style.display = 'block';

    if (actBtn) {
      actBtn.onclick = () => {
        plantAudio.playClick();
        engine3D?.focusEquipment(eq.id);
      };
    }

    if (learnBtn) {
      learnBtn.onclick = () => {
        plantAudio.playClick();
        openEducationalDrawer(eq);
      };
    }

    if (eq.id === 'unit400_master_pfd_board') {
      openSec400PfdModal();
    }
  }
}

function openEducationalDrawer(eq: EquipmentInfo) {
  const drawer = document.getElementById('v3d-edu-drawer');
  const tag = document.getElementById('v3d-dh-tag');
  const name = document.getElementById('v3d-dh-name');
  const body = document.getElementById('v3d-drawer-body');

  if (!drawer || !tag || !name || !body) return;

  tag.textContent = eq.tag;
  name.textContent = eq.arabicName ? `${eq.arabicName} (${eq.name})` : eq.name;

  const l = eq.learning;

  body.innerHTML = `
    <div class="v3d-edu-section">
      <div class="v3d-edu-sec-title">📖 ما هي هذه المعدة؟ (What is it?)</div>
      <p>${l?.whatIsIt || eq.description}</p>
    </div>

    ${eq.chemicalReaction ? `
    <div class="v3d-edu-section">
      <div class="v3d-edu-sec-title">🧪 التفاعلات الكيميائية والديناميكا الحرارية (Reaction & Thermodynamics)</div>
      <div class="v3d-reaction-box">${eq.chemicalReaction}</div>
      <div class="v3d-reaction-dh">
        💡 <b>ملاحظة هندسية:</b> استجابة الاتزان لمبدأ لوشاتيليه (Le Chatelier): درجات الحرارة والضغوط محكومة بمعدلات التحويل القصوى.
      </div>
    </div>
    ` : ''}

    <div class="v3d-edu-section">
      <div class="v3d-edu-sec-title">⚙️ الوظيفة التشغيلية (What it does)</div>
      <p>${l?.whatItDoes || 'تقوم المعدة بمعالجة التيار المغذي وضبط ظروف الضغط والحرارة للمرحلة اللاحقة.'}</p>
      <p style="margin-top:6px;color:#00e5aa;"><b>لماذا تم اختيارها في التصميم:</b> ${l?.whyUsed || 'لتحقيق أعلى كفاءة حرارية ومطابقة مواصفات العملية.'}</p>
    </div>

    <div class="v3d-edu-section">
      <div class="v3d-edu-sec-title">🔄 التيارات الداخلة والخارجة (Streams & Mass Balance)</div>
      <p><b>الداخل:</b> <span style="color:#00c8ef;">${l?.whatEnters || eq.inletStream}</span></p>
      <p style="margin-top:4px;"><b>الخارج:</b> <span style="color:#f5a800;">${l?.whatLeaves || eq.outletStream}</span></p>
    </div>

    <div class="v3d-edu-section">
      <div class="v3d-edu-sec-title">🔬 المحفز والمواصفات الداخلية (Catalyst & Internals)</div>
      <p><b>نوع الحشوة / المحفز:</b> ${eq.catalystOrInternals}</p>
      <p style="margin-top:6px;"><b>العملية الداخلية:</b> ${l?.internalProcess || 'تلامس طور غازي مع سطح المحفز النشط لخفض طاقة التنشيط.'}</p>
    </div>

    <div class="v3d-edu-section">
      <div class="v3d-edu-sec-title">🎛 متغيرات السيطرة والتشغيل الحرج (Key Control Parameters)</div>
      <p><b>المتغير الرئيسي:</b> ${l?.keyParameter || 'درجة الحرارة والضغط ومعدل الجريان'}</p>
      <p style="margin-top:4px;"><b>أجهزة السيطرة المرتبطة:</b> ${(eq.controllers && eq.controllers.length > 0) ? eq.controllers.join(', ') : 'حلقات أوتوماتيكية مدمجة'}</p>
    </div>

    <div class="v3d-edu-section">
      <div class="v3d-edu-sec-title">⚡ تحليل الحساسية "ماذا لو؟" (What-If Operational Sensitivity)</div>
      <div style="background:#030910;border-radius:6px;padding:10px;border-right:3px solid #00c8ef;">
        ${l?.whatIfSensitivity || 'أي انحراف عن القيم التصميمية يؤدي إلى تدني كفاءة التحويل وتأثر المراحل اللاحقة.'}
      </div>
    </div>

    <div style="margin-top:16px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
      <button id="v3d-drawer-return-bottom-btn" class="v3d-btn-back-side" style="padding:9px 16px;">🔙 رجوع للـ 3D</button>
      <button id="v3d-drawer-focus-btn" class="v3d-btn-primary" style="padding:9px 16px;width:auto;flex:1;">🎯 توجيه الكاميرا للمعدة</button>
    </div>
  `;

  document.getElementById('v3d-drawer-return-bottom-btn')?.addEventListener('click', () => {
    plantAudio.playClick();
    drawer.style.display = 'none';
  });

  document.getElementById('v3d-drawer-focus-btn')?.addEventListener('click', () => {
    plantAudio.playClick();
    drawer.style.display = 'none';
    engine3D?.focusEquipment(eq.id);
  });

  drawer.style.display = 'flex';
}

function openQuizModal() {
  const modal = document.getElementById('v3d-quiz-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const body = document.getElementById('v3d-quiz-body');
  if (!body) return;

  if (isQuizSubmitted) {
    renderQuizCertificate(body);
    return;
  }

  const q: QuizQuestion = MASTER_QUIZ_BANK[quizCurrentIndex];
  const total = MASTER_QUIZ_BANK.length;
  const currentAnswer = quizUserAnswers[quizCurrentIndex];

  body.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
      <span style="font-weight:bold;color:#f5a800;">السؤال ${quizCurrentIndex + 1} من ${total}</span>
      <span style="background:#0a1d2e;padding:4px 10px;border-radius:12px;color:#00c8ef;font-size:11px;">القسم: ${q.category || 'عام'}</span>
    </div>

    <div class="v3d-quiz-qbox">
      <div class="v3d-quiz-qtitle">${q.question}</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${q.options.map((opt, i) => `
          <div class="v3d-quiz-opt ${currentAnswer === i ? 'selected' : ''}" data-idx="${i}">
            <span style="font-weight:bold;width:20px;height:20px;border-radius:50%;background:#142d44;display:flex;align-items:center;justify-content:center;font-size:10px;">${['أ', 'ب', 'ج', 'د'][i]}</span>
            <span>${opt}</span>
          </div>
        `).join('')}
      </div>

      ${currentAnswer !== -1 ? `
        <div class="v3d-quiz-explain">
          <b>💡 التوضيح الهندسي:</b> ${q.explanation}
        </div>
      ` : ''}
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:18px;">
      <button id="v3d-q-prev" class="v3d-step-btn" ${quizCurrentIndex === 0 ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>◀ السؤال السابق</button>
      <div>
        ${quizCurrentIndex === total - 1 ? `
          <button id="v3d-q-submit" class="v3d-btn-primary" style="padding:7px 18px;background:#00e5aa;">✓ إنهاء الاختبار وعرض الشهادة</button>
        ` : `
          <button id="v3d-q-next" class="v3d-btn-primary" style="padding:7px 18px;">التالي ▶</button>
        `}
      </div>
    </div>
  `;

  // Bind option clicks
  body.querySelectorAll('.v3d-quiz-opt').forEach((optEl) => {
    optEl.addEventListener('click', (e) => {
      plantAudio.playClick();
      const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-idx') || '0', 10);
      quizUserAnswers[quizCurrentIndex] = idx;
      renderQuizQuestion();
    });
  });

  document.getElementById('v3d-q-prev')?.addEventListener('click', () => {
    if (quizCurrentIndex > 0) {
      plantAudio.playClick();
      quizCurrentIndex--;
      renderQuizQuestion();
    }
  });

  document.getElementById('v3d-q-next')?.addEventListener('click', () => {
    if (quizCurrentIndex < total - 1) {
      plantAudio.playClick();
      quizCurrentIndex++;
      renderQuizQuestion();
    }
  });

  document.getElementById('v3d-q-submit')?.addEventListener('click', () => {
    plantAudio.playSuccess();
    quizScore = 0;
    MASTER_QUIZ_BANK.forEach((qItem, idx) => {
      if (quizUserAnswers[idx] === qItem.correctIndex) {
        quizScore++;
      }
    });
    isQuizSubmitted = true;
    renderQuizQuestion();
  });
}

function renderQuizCertificate(container: HTMLElement) {
  const total = MASTER_QUIZ_BANK.length;
  const percentage = Math.round((quizScore / total) * 100);
  const isPassed = percentage >= 60;

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:20px;">
      <div style="font-size:18px;font-weight:bold;color:${isPassed ? '#00e5aa' : '#f5a800'};">
        ${isPassed ? '🎉 تهانينا! لقد اجتزت الاختبار الأكاديمي بنجاح' : '⚠️ نتيجة الاختبار بحاجة لمراجعة'}
      </div>
      <div style="font-size:13px;color:#b0bec5;margin-top:6px;">
        الدرجة المحققة: <b>${quizScore} من ${total}</b> (${percentage}%)
      </div>
    </div>

    <!-- Student Name Form -->
    <div style="background:#091a2a;padding:14px;border-radius:8px;margin-bottom:18px;border:1px solid #163654;">
      <label style="display:block;margin-bottom:6px;color:#00c8ef;font-weight:bold;">الاسم الكامل للطالب / المتدرب:</label>
      <input type="text" id="v3d-cert-student-input" value="${studentName}" style="width:100%;padding:8px 12px;background:#03080e;border:1px solid #1e3a56;color:#ffffff;border-radius:6px;box-sizing:border-box;margin-bottom:8px;" />
      <label style="display:block;margin-bottom:6px;color:#00c8ef;font-weight:bold;">الجامعة / الكلية / المؤسسة:</label>
      <input type="text" id="v3d-cert-uni-input" value="${studentUni}" style="width:100%;padding:8px 12px;background:#03080e;border:1px solid #1e3a56;color:#ffffff;border-radius:6px;box-sizing:border-box;" />
    </div>

    <!-- The Printable Certificate -->
    <div class="v3d-cert-wrap" id="v3d-printable-cert">
      <div class="v3d-cert-org">🏛 الهيئة العامة للمهندسين الكيميائيين في البصرة</div>
      <div class="v3d-cert-sub">GENERAL UNION OF CHEMICAL ENGINEERS — BASRA</div>
      <div class="v3d-cert-title">شهادة إتمام محاكاة مصنع الأمونيا الرقمي</div>
      <p style="font-size:11px;color:#546e7a;">يشهد الفريق الهندسي والأكاديمي بأن:</p>
      <div class="v3d-cert-name" id="v3d-cert-display-name">${studentName}</div>
      <p style="font-size:11px;color:#0a3d91;font-weight:bold;" id="v3d-cert-display-uni">${studentUni}</p>
      <div class="v3d-cert-desc">
        قد أتم بنجاح التدريب التفاعلي ثلاثي الأبعاد على تشغيل ومطابقة مجمع إنتاج الأمونيا (Khor Al-Zubair Ammonia Plant) واجتاز بنجاح الاختبار التقييمي بنسبة <b>${percentage}%</b>، ملمّاً بمراحل الإصلاح الأولي والثانوي، تحويل أول أكسيد الكربون، إزالة CO₂، والميثانايتر، وحلقة تخليق الأمونيا.
      </div>
      <div class="v3d-cert-seal">
        ختم معتمد<br>VERIFIED
      </div>
      <div class="v3d-cert-signatures">
        <div>
          <b>التاريخ:</b> ${new Date().toLocaleDateString('ar-IQ')}<br>
          <b>رمز الوثيقة:</b> NH3-DZ-${Math.floor(100000 + Math.random() * 900000)}
        </div>
        <div>
          <b>المطور والمشرف العام:</b><br>
          <span style="color:#0a3d91;font-weight:bold;">ENG. ALI SAIF AL DIN HAIDER ALNAWFAL</span><br>
          <small>م. علي سيف الدين حيدر النوفل</small>
        </div>
      </div>
    </div>

    <div style="display:flex;justify-content:space-between;margin-top:18px;">
      <button id="v3d-cert-retake" class="v3d-step-btn">↺ إعادة الاختبار</button>
      <button id="v3d-cert-print" class="v3d-btn-primary" style="padding:8px 20px;background:#f5a800;color:#030c14;">🖨 طباعة / حفظ الشهادة PDF</button>
    </div>
  `;

  const sInput = document.getElementById('v3d-cert-student-input') as HTMLInputElement;
  const uInput = document.getElementById('v3d-cert-uni-input') as HTMLInputElement;
  const sDisplay = document.getElementById('v3d-cert-display-name');
  const uDisplay = document.getElementById('v3d-cert-display-uni');

  sInput?.addEventListener('input', () => {
    studentName = sInput.value;
    localStorage.setItem('nh3_student_name', studentName);
    if (sDisplay) sDisplay.textContent = studentName;
  });

  uInput?.addEventListener('input', () => {
    studentUni = uInput.value;
    localStorage.setItem('nh3_student_uni', studentUni);
    if (uDisplay) uDisplay.textContent = studentUni;
  });

  document.getElementById('v3d-cert-retake')?.addEventListener('click', () => {
    plantAudio.playClick();
    quizCurrentIndex = 0;
    quizUserAnswers.fill(-1);
    isQuizSubmitted = false;
    renderQuizQuestion();
  });

  document.getElementById('v3d-cert-print')?.addEventListener('click', () => {
    window.print();
  });
}

function openSearchModal() {
  const modal = document.getElementById('v3d-search-modal');
  const input = document.getElementById('v3d-search-input') as HTMLInputElement;
  const list = document.getElementById('v3d-search-list');

  if (!modal || !input || !list) return;

  const renderList = (filterText: string = '') => {
    const q = filterText.trim().toLowerCase();
    const matches = MASTER_EQUIPMENT_DATA.filter((eq) => {
      if (!q) return true;
      return (
        eq.tag.toLowerCase().includes(q) ||
        eq.name.toLowerCase().includes(q) ||
        (eq.arabicName && eq.arabicName.toLowerCase().includes(q)) ||
        eq.section.toLowerCase().includes(q) ||
        eq.operatingTemp.toLowerCase().includes(q)
      );
    });

    list.innerHTML = matches.map((eq) => `
      <div class="v3d-search-item" data-id="${eq.id}">
        <span class="v3d-si-tag">${eq.tag}</span>
        <span class="v3d-si-name">${eq.arabicName ? `${eq.arabicName} — ` : ''}${eq.name}</span>
        <span class="v3d-si-temp">${eq.operatingTemp}</span>
      </div>
    `).join('');

    list.querySelectorAll('.v3d-search-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        plantAudio.playClick();
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          modal.style.display = 'none';
          engine3D?.focusEquipment(id);
        }
      });
    });
  };

  input.value = '';
  renderList();

  input.oninput = () => {
    renderList(input.value);
  };

  modal.style.display = 'flex';
  setTimeout(() => input.focus(), 50);
}

export function open3D(initialMode: ViewMode3D = 'plant_overview', initialSection?: string) {
  toggleSidebar(false);

  const dashboardView = document.getElementById('dashboard-view');
  if (dashboardView) dashboardView.style.display = 'none';

  const diagram2dStage = document.getElementById('diagram2dStage');
  if (diagram2dStage) diagram2dStage.style.display = 'none';

  const unitOpsStage = document.getElementById('unitOpsStage');
  if (unitOpsStage) unitOpsStage.style.display = 'none';

  const operationsLabStage = document.getElementById('operationsLabStage');
  if (operationsLabStage) operationsLabStage.style.display = 'none';

  init3DOverlay();
  if (!view3DOverlay) return;

  view3DOverlay.classList.remove('hidden');
  view3DOverlay.classList.add('open');
  view3DOverlay.style.display = 'flex';

  const container = document.getElementById('view3d-canvas-wrap');
  if (container && !engine3D) {
    engine3D = new Engine3D(container);

    engine3D.setEquipmentSelectCallback((eq: EquipmentInfo) => {
      plantAudio.playClick();
      showEquipmentCard(eq);
    });

    engine3D.setHotspotSelectCallback((hotspot: Hotspot3D) => {
      plantAudio.playClick();
      const card = document.getElementById('view3d-info-card');
      const tag = document.getElementById('v3d-card-tag');
      const title = document.getElementById('v3d-card-title');
      const arname = document.getElementById('v3d-card-arname');
      const desc = document.getElementById('v3d-card-desc');
      if (card && title && desc) {
        if (tag) tag.textContent = 'PANEL';
        if (arname) arname.textContent = hotspot.name;
        title.textContent = hotspot.name;
        desc.textContent = hotspot.description;
        card.style.display = 'block';
      }
    });

    if ((window as any).ResizeObserver) {
      const ro = new ResizeObserver(() => {
        engine3D?.resize();
      });
      ro.observe(container);
    }
  } else if (engine3D) {
    engine3D.start();
  }

  const effectiveSec = initialSection || (initialMode === 'control_room' ? 'control_room' : initialMode === 'top_layout' ? 'top_layout' : 'overview');

  // Sync active tab
  const tabs = view3DOverlay.querySelectorAll('.view3d-pgtab');
  tabs.forEach((t) => {
    const tabSec = t.getAttribute('data-sec');
    const tabMode = t.getAttribute('data-mode');
    if (initialSection) {
      t.classList.toggle('on', tabSec === initialSection);
    } else {
      t.classList.toggle('on', tabSec === effectiveSec || (tabMode === initialMode && (tabSec === 'overview' || tabSec === initialMode)));
    }
  });

  setTimeout(() => {
    engine3D?.resize();
    const stepCurrentTitle = document.getElementById('v3d-step-current-title');
    const stepBadge = document.getElementById('v3d-step-badge');

    const updateStepperUI = (stepInfo: any) => {
      if (stepCurrentTitle) stepCurrentTitle.textContent = stepInfo.title;
      if (stepBadge) stepBadge.textContent = `${stepInfo.stepIndex + 1} / ${stepInfo.totalSteps || 15}`;
      if (stepInfo.equipment) {
        showEquipmentCard(stepInfo.equipment);
      }
    };

    if (initialSection && initialSection !== 'overview' && initialSection !== 'all') {
      engine3D?.focusSection(initialSection, updateStepperUI);
    } else {
      engine3D?.setViewMode(initialMode);
      if (stepCurrentTitle) {
        stepCurrentTitle.textContent = initialMode === 'control_room' ? 'غرفة السيطرة اليابانية (MHI 1977)' : initialMode === 'top_layout' ? 'المخطط الهندسي الأفقي العلوي (P&ID Layout)' : 'استعراض مجمع تصنيع الأمونيا بالكامل 3D';
      }
    }
  }, 60);
}

export function openSection3D(sec: string = 'sec_reformer', isSplash: boolean = true) {
  open3D('plant_overview', sec);
  setTimeout(() => {
    const stepCurrentTitle = document.getElementById('v3d-step-current-title');
    const stepBadge = document.getElementById('v3d-step-badge');
    const badgeIcon = document.getElementById('v3d-mode-badge-icon');
    const badgeTxt = document.getElementById('v3d-mode-badge-txt');
    const badgeSwitchBtn = document.getElementById('v3d-badge-switch-btn');
    const toggleIsoBtn = document.getElementById('v3d-toggle-isolation');
    const statusBadge = document.getElementById('v3d-mode-status-badge');

    const secTitles: Record<string, { icon: string; title: string; color: string }> = {
      sec_reformer: { icon: '🔥', title: 'وضع مجسم قسم تحويل الغاز 3D (360° Reforming Unit - معزول)', color: '#ff9800' },
      sec_co2: { icon: '🌀', title: 'وضع مجسم قسم إزالة CO₂ كاتاكارب 3D (360° Catacarb - معزول)', color: '#00e5aa' },
      sec_k301: { icon: '⚡', title: 'وضع مجسم قسم ضاغط غاز التخليق K-301 والتوربين ومبرداته 3D (معزول)', color: '#ffeb3b' },
      sec_synloop: { icon: '⚛️', title: 'وضع مجسم برج وحلقة تخليق الأمونيا R-401 ثلاثي الأبعاد 3D (معزول)', color: '#00c8ef' },
      sec_refrigeration: { icon: '❄️', title: 'وضع مجسم منظومة التثليج والتبريد ومكثفات الأمونيا 3D (معزول)', color: '#00e5aa' },
      sec_steam: { icon: '💨', title: 'وضع مجسم شبكة ومجمعات البخار ومحطات التخفيض PRDS المعزولة بالكامل 3D', color: '#38bdf8' },
      sec_storage: { icon: '🛢️', title: 'وضع مجسم خزانات الأمونيا الكروية F-401 ومحطة الشحن 3D', color: '#00c8ef' },
      sec_desulf: { icon: '💨', title: 'وضع مجسم قسم إزالة الكبريت وضغط الغاز الطبيعي K-303 ثلاثي الأبعاد 3D', color: '#ff9800' },
    };

    const info = secTitles[sec] || secTitles.sec_reformer;

    if (statusBadge) statusBadge.style.borderColor = info.color;
    if (badgeIcon) badgeIcon.textContent = info.icon;
    if (badgeTxt) {
      badgeTxt.style.color = info.color;
      badgeTxt.textContent = info.title;
    }
    if (badgeSwitchBtn) {
      badgeSwitchBtn.textContent = '🌐 إظهار المصنع كاملاً';
      badgeSwitchBtn.style.background = '#00e5aa';
      badgeSwitchBtn.style.color = '#030c14';
    }
    if (toggleIsoBtn) {
      toggleIsoBtn.classList.add('on');
      toggleIsoBtn.textContent = '🌐 إظهار المصنع كاملاً';
      toggleIsoBtn.style.borderColor = '#00e5aa';
      toggleIsoBtn.style.color = '#00e5aa';
      toggleIsoBtn.style.background = 'rgba(0,229,170,0.15)';
    }

    if (isSplash && engine3D) {
      engine3D.startSection360Splash(sec, (stepInfo: any) => {
        if (stepCurrentTitle) stepCurrentTitle.textContent = stepInfo.title;
        if (stepBadge) stepBadge.textContent = `${stepInfo.stepIndex + 1} / ${stepInfo.totalSteps || 15}`;
        if (stepInfo.equipment) {
          showEquipmentCard(stepInfo.equipment);
        }
      });
    }
  }, 120);
}

export function openCO2Section3D(isSplash: boolean = true) {
  openSection3D('sec_co2', isSplash);
}

export function openControlRoom3D() {
  open3D('control_room');
}

export function openPlant3D(sec?: string) {
  open3D('plant_overview', sec || 'overview');
  setTimeout(() => {
    const badgeIcon = document.getElementById('v3d-mode-badge-icon');
    const badgeTxt = document.getElementById('v3d-mode-badge-txt');
    const badgeSwitchBtn = document.getElementById('v3d-badge-switch-btn');
    const toggleIsoBtn = document.getElementById('v3d-toggle-isolation');
    const statusBadge = document.getElementById('v3d-mode-status-badge');

    if (statusBadge) statusBadge.style.borderColor = '#00e5aa';
    if (badgeIcon) badgeIcon.textContent = '🌐';
    if (badgeTxt) {
      badgeTxt.style.color = '#00e5aa';
      badgeTxt.textContent = 'وضع مجمع المصنع بالكامل 3D (Full Plant Complex)';
    }
    if (badgeSwitchBtn) {
      badgeSwitchBtn.textContent = '🔥 عزل القسم 1';
      badgeSwitchBtn.style.background = '#ff9800';
      badgeSwitchBtn.style.color = '#030c14';
    }
    if (toggleIsoBtn) {
      toggleIsoBtn.classList.remove('on');
      toggleIsoBtn.textContent = '🔥 عزل القسم 1 فقط';
      toggleIsoBtn.style.borderColor = '#ff9800';
      toggleIsoBtn.style.color = '#ffb74d';
      toggleIsoBtn.style.background = 'rgba(255,152,0,0.15)';
    }

    if (engine3D) {
      engine3D.plant.isolateSection(null);
      engine3D.setViewMode('plant_overview');
    }
  }, 120);
}

export function close3D() {
  if (engine3D) {
    engine3D.stopGuidedTour();
    engine3D.stop();
  }
  const card = document.getElementById('view3d-info-card');
  if (card) card.style.display = 'none';

  if (view3DOverlay) {
    view3DOverlay.classList.remove('open');
    view3DOverlay.style.display = 'none';
  }
}

export function closeAllOverlaysAndGoHome() {
  close3D();

  const diagram2dStage = document.getElementById('diagram2dStage');
  if (diagram2dStage) diagram2dStage.style.display = 'none';

  const unitOpsStage = document.getElementById('unitOpsStage');
  if (unitOpsStage) unitOpsStage.style.display = 'none';

  const operationsLabStage = document.getElementById('operationsLabStage');
  if (operationsLabStage) operationsLabStage.style.display = 'none';

  const dashboardView = document.getElementById('dashboard-view');
  if (dashboardView) dashboardView.style.display = 'flex';
}

export function openPlantDiagram2D() {
  toggleSidebar(false);
  close3D();

  const dashboardView = document.getElementById('dashboard-view');
  if (dashboardView) dashboardView.style.display = 'none';

  const unitOpsStage = document.getElementById('unitOpsStage');
  if (unitOpsStage) unitOpsStage.style.display = 'none';

  const operationsLabStage = document.getElementById('operationsLabStage');
  if (operationsLabStage) operationsLabStage.style.display = 'none';

  const diagram2dStage = document.getElementById('diagram2dStage');
  if (diagram2dStage) {
    diagram2dStage.style.display = 'flex';
    plantDiagram2D.init(diagram2dStage);
  }
}

export function openUnitOps() {
  toggleSidebar(false);
  close3D();

  const dashboardView = document.getElementById('dashboard-view');
  if (dashboardView) dashboardView.style.display = 'none';

  const operationsLabStage = document.getElementById('operationsLabStage');
  if (operationsLabStage) operationsLabStage.style.display = 'none';

  const unitOpsStage = document.getElementById('unitOpsStage');
  if (unitOpsStage) {
    unitOpsStage.style.display = 'flex';
    unitOpsStage.style.flexDirection = 'column';
    unitOpsManager.init();
  }
}

export function openOpsLab() {
  toggleSidebar(false);
  close3D();

  const dashboardView = document.getElementById('dashboard-view');
  if (dashboardView) dashboardView.style.display = 'none';

  const unitOpsStage = document.getElementById('unitOpsStage');
  if (unitOpsStage) unitOpsStage.style.display = 'none';

  const operationsLabStage = document.getElementById('operationsLabStage');
  if (operationsLabStage) {
    operationsLabStage.style.display = 'flex';
    operationsLabStage.style.flexDirection = 'column';
    plantOpsLab.init();
  }
}

// Global window bindings
export function openSection2D(sheetId: string) {
  openPlantDiagram2D();
  if (plantDiagram2D) {
    plantDiagram2D.switchSheet(sheetId as any);
  }
}

(window as any).openSection2D = openSection2D;
(window as any)._tsOpenSection2D = openSection2D;
(window as any).openPlantDiagram2D = openPlantDiagram2D;
(window as any)._tsOpenPlantDiagram2D = openPlantDiagram2D;
(window as any).openUnitOps = openUnitOps;
(window as any)._tsOpenUnitOps = openUnitOps;
(window as any).openOpsLab = openOpsLab;
(window as any)._tsOpenOpsLab = openOpsLab;
(window as any).closeAllOverlaysAndGoHome = closeAllOverlaysAndGoHome;
(window as any)._tsCloseAllOverlaysAndGoHome = closeAllOverlaysAndGoHome;

(window as any).openCO2Section3D = openCO2Section3D;
(window as any)._tsOpenCO2Section3D = openCO2Section3D;
export function toggleSidebar(force?: boolean) {
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('app-sidebar-backdrop');
  if (!sidebar) return;

  const isMobile = window.innerWidth <= 900;
  if (force !== undefined) {
    if (isMobile) {
      sidebar.classList.toggle('open', force);
      if (backdrop) backdrop.classList.toggle('active', force);
    } else {
      sidebar.classList.toggle('collapsed', !force);
    }
    return;
  }

  if (isMobile) {
    const willOpen = !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', willOpen);
    if (backdrop) backdrop.classList.toggle('active', willOpen);
  } else {
    sidebar.classList.toggle('collapsed');
  }
}

(window as any).toggleSidebar = toggleSidebar;
(window as any)._tsToggleSidebar = toggleSidebar;

(window as any).openSection3D = openSection3D;
(window as any)._tsOpenSection3D = openSection3D;
(window as any).open3D = open3D;
(window as any)._tsOpen3D = open3D;
(window as any).openControlRoom3D = openControlRoom3D;
(window as any)._tsOpenControlRoom3D = openControlRoom3D;
(window as any).openPlant3D = openPlant3D;
(window as any)._tsOpenPlant3D = openPlant3D;
(window as any).close3D = close3D;
(window as any)._tsClose3D = close3D;
(window as any).unitOpsManager = unitOpsManager;
(window as any).unitOpsEngine = unitOpsEngine;
(window as any).plantOpsLab = plantOpsLab;
(window as any)._uopsInit = () => openUnitOps();
(window as any)._opslabInit = () => openOpsLab();

function wire3DButtons() {
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  if (toggleBtn) {
    toggleBtn.onclick = (e) => {
      e.stopPropagation();
      toggleSidebar();
    };
  }

  const backdrop = document.getElementById('app-sidebar-backdrop');
  if (backdrop) {
    backdrop.onclick = () => {
      toggleSidebar(false);
    };
  }

  const btnPfd = document.getElementById('mode-pfd2d');
  if (btnPfd) btnPfd.onclick = () => {
    openPlantDiagram2D();
  };

  const btnOpslab = document.getElementById('mode-opslab');
  if (btnOpslab) btnOpslab.onclick = () => {
    openOpsLab();
  };

  const btnUops = document.getElementById('mode-uops');
  if (btnUops) btnUops.onclick = () => {
    openUnitOps();
  };

  const btn3d = document.getElementById('mode-3d');
  if (btn3d) btn3d.onclick = () => {
    open3D('plant_overview');
  };

  const side3d = document.getElementById('rb-3d');
  if (side3d) side3d.onclick = () => {
    open3D('plant_overview');
  };

  const btnPlant3d = document.getElementById('mode-plant3d');
  if (btnPlant3d) btnPlant3d.onclick = () => {
    openPlant3D();
  };

  const btnCr3d = document.getElementById('mode-cr3d');
  if (btnCr3d) btnCr3d.onclick = () => {
    openControlRoom3D();
  };

  const view3dBtn = document.getElementById('view3d-btn');
  if (view3dBtn) view3dBtn.onclick = () => {
    open3D('plant_overview');
  };

  const dcsTo3d = document.getElementById('dcs-btn-to-3d');
  if (dcsTo3d) dcsTo3d.onclick = () => {
    openPlant3D();
  };
}

function initApp() {
  init3DOverlay();
  wire3DButtons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
