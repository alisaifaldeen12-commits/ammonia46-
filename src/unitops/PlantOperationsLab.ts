import { 
  STEAM_HEADERS_DATA, 
  SECTIONS_EQUIPMENT_DATA, 
  INTERLOCK_RULES_DATA, 
  CALCULATION_MODELS_DATA, 
  TROUBLESHOOTING_DATA, 
  STARTUP_PROCEDURES_DATA, 
  SHUTDOWN_PROCEDURES_DATA 
} from './BookOperationsData';
import { CalculationModel, TroubleScenario, StartupStepItem, ShutdownStepItem } from './BookKnowledgeBase';

export class PlantOperationsLab {
  private containerId: string;
  private activeSubTab: 'startup' | 'shutdown' | 'lab_calc' | 'troubleshoot' | 'interlocks' | 'steam_balance' = 'startup';
  
  // Interactive Simulator States
  private currentStartupStep = 1;
  private currentShutdownStep = 1;
  private activeCalcModelId: string = CALCULATION_MODELS_DATA[0].id;
  private activeScenarioId: string = 'trb-k401-trip';
  private calculationInputs: Record<string, Record<string, number>> = {};
  private activeInterlockFilter: string = 'ALL';
  private mobileDrawerOpen: boolean = false;

  constructor(containerId: string = 'operationsLabStage') {
    this.containerId = containerId;
    this.initDefaultCalculations();
  }

  private initDefaultCalculations() {
    CALCULATION_MODELS_DATA.forEach(model => {
      this.calculationInputs[model.id] = {};
      model.parameters.forEach(p => {
        this.calculationInputs[model.id][p.key] = p.defaultVal;
      });
    });
  }

  public init() {
    this.injectStyles();
    this.render();
  }

  public setSubTab(tab: 'startup' | 'shutdown' | 'lab_calc' | 'troubleshoot' | 'interlocks' | 'steam_balance') {
    this.activeSubTab = tab;
    this.mobileDrawerOpen = false;
    this.render();
  }

  public toggleMobileDrawer(force?: boolean) {
    this.mobileDrawerOpen = typeof force === 'boolean' ? force : !this.mobileDrawerOpen;
    this.render();
  }

  public render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="opslab-root">
        <!-- Backdrop for mobile drawer -->
        <div class="opslab-drawer-backdrop ${this.mobileDrawerOpen ? 'open' : ''}" onclick="window.plantOpsLab.toggleMobileDrawer(false)"></div>

        <!-- 1. SIDEBAR NAVIGATION (القائمة الجانبية والأقسام) -->
        <aside class="opslab-sidebar ${this.mobileDrawerOpen ? 'open' : ''}">
          <!-- Sidebar Top Brand / Header -->
          <div class="opslab-sidebar-header">
            <div class="opslab-brand-row">
              <span class="opslab-logo-icon">🏛️</span>
              <div class="opslab-brand-text">
                <h3>مختبر العمليات والتشغيل</h3>
                <small>ملزمة مصنع الأمونيا / 1 (م. ماجد مرسي)</small>
              </div>
              <button class="opslab-close-drawer-btn" onclick="window.plantOpsLab.toggleMobileDrawer(false)" title="إغلاق القائمة">✕</button>
            </div>
            
            <div class="opslab-author-badge">
              <span>إشراف وتطوير:</span>
              <b>م. علي سيف الدين حيدر النوفل</b>
            </div>
          </div>

          <!-- Main Sections List (الأقسام الرئيسية الستة) -->
          <div class="opslab-sections-menu">
            <div class="menu-section-label">الأقسام والوحدات الرئيسية</div>

            <button class="section-tab-btn ${this.activeSubTab === 'startup' ? 'active' : ''}" onclick="window.plantOpsLab.setSubTab('startup')">
              <span class="st-icon">🚀</span>
              <span class="st-title">تسلسل مراحل التشغيل</span>
              <span class="st-badge">${STARTUP_PROCEDURES_DATA.length}</span>
            </button>

            <button class="section-tab-btn ${this.activeSubTab === 'shutdown' ? 'active' : ''}" onclick="window.plantOpsLab.setSubTab('shutdown')">
              <span class="st-icon">🛑</span>
              <span class="st-title">إجراءات التوقف والعزل</span>
              <span class="st-badge">${SHUTDOWN_PROCEDURES_DATA.length}</span>
            </button>

            <button class="section-tab-btn ${this.activeSubTab === 'lab_calc' ? 'active' : ''}" onclick="window.plantOpsLab.setSubTab('lab_calc')">
              <span class="st-icon">🧮</span>
              <span class="st-title">مختبر الحسابات الهندسية</span>
              <span class="st-badge">${CALCULATION_MODELS_DATA.length}</span>
            </button>

            <button class="section-tab-btn ${this.activeSubTab === 'troubleshoot' ? 'active' : ''}" onclick="window.plantOpsLab.setSubTab('troubleshoot')">
              <span class="st-icon">⚠️</span>
              <span class="st-title">المشاكل والحلول الطارئة</span>
              <span class="st-badge">${TROUBLESHOOTING_DATA.length}</span>
            </button>

            <button class="section-tab-btn ${this.activeSubTab === 'interlocks' ? 'active' : ''}" onclick="window.plantOpsLab.setSubTab('interlocks')">
              <span class="st-icon">🛡️</span>
              <span class="st-title">مصفوفة الأمان والإنترلوك</span>
              <span class="st-badge">${INTERLOCK_RULES_DATA.length}</span>
            </button>

            <button class="section-tab-btn ${this.activeSubTab === 'steam_balance' ? 'active' : ''}" onclick="window.plantOpsLab.setSubTab('steam_balance')">
              <span class="st-icon">💨</span>
              <span class="st-title">موازنة شبكة البخار</span>
              <span class="st-badge">${STEAM_HEADERS_DATA.length}</span>
            </button>
          </div>

          <!-- Dynamic Sub-Items List (فهرس القسم النشط) -->
          <div class="opslab-subitems-panel">
            ${this.renderSidebarSubItems()}
          </div>
        </aside>

        <!-- 2. MAIN CONTENT AREA (منطقة العرض والتشغيل) -->
        <main class="opslab-main-viewport">
          <!-- Top Bar with Mobile Drawer Trigger & Section Info -->
          <header class="opslab-topbar">
            <button class="opslab-drawer-toggle-btn" onclick="window.plantOpsLab.toggleMobileDrawer(true)" title="فتح قائمة الأقسام">
              <span class="toggle-icon">☰</span>
              <span class="toggle-text">الأقسام والمراحل</span>
            </button>

            <div class="opslab-topbar-breadcrumb">
              <span class="bc-section">${this.getActiveSectionName()}</span>
              <span class="bc-sep">/</span>
              <span class="bc-item">${this.getActiveItemName()}</span>
            </div>

            <!-- Quick Prev/Next for sequential items -->
            <div class="opslab-topbar-nav">
              ${this.renderTopbarNavigationButtons()}
            </div>
          </header>

          <!-- Main Content Body -->
          <div class="opslab-body-card">
            ${this.renderSubTabContent()}
          </div>
        </main>
      </div>
    `;
  }

  // Sidebar Sub-Items based on Active Section
  private renderSidebarSubItems(): string {
    if (this.activeSubTab === 'startup') {
      return `
        <div class="subitems-header">
          <span>مراحل تسلسل التشغيل (الفصل الثاني)</span>
          <small>${this.currentStartupStep} من ${STARTUP_PROCEDURES_DATA.length}</small>
        </div>
        <div class="subitems-scroll-list">
          ${STARTUP_PROCEDURES_DATA.map(step => `
            <button 
              class="subitem-btn ${step.stepNum === this.currentStartupStep ? 'active' : (step.stepNum < this.currentStartupStep ? 'passed' : '')}"
              onclick="window.plantOpsLab.selectStartupStep(${step.stepNum})"
            >
              <span class="subitem-num">${step.stepNum}</span>
              <span class="subitem-text">${step.stageNameAr}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    if (this.activeSubTab === 'shutdown') {
      return `
        <div class="subitems-header">
          <span>مراحل التوقف والعزل (الفصل الثالث)</span>
          <small>${this.currentShutdownStep} من ${SHUTDOWN_PROCEDURES_DATA.length}</small>
        </div>
        <div class="subitems-scroll-list">
          ${SHUTDOWN_PROCEDURES_DATA.map(step => `
            <button 
              class="subitem-btn sd ${step.stepNum === this.currentShutdownStep ? 'active' : ''}"
              onclick="window.plantOpsLab.selectShutdownStep(${step.stepNum})"
            >
              <span class="subitem-num sd">${step.stepNum}</span>
              <span class="subitem-text">${step.stageNameAr}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    if (this.activeSubTab === 'lab_calc') {
      return `
        <div class="subitems-header">
          <span>نماذج الحسابات الهندسية (10 معادلات)</span>
        </div>
        <div class="subitems-scroll-list">
          ${CALCULATION_MODELS_DATA.map((model, idx) => `
            <button 
              class="subitem-btn calc ${model.id === this.activeCalcModelId ? 'active' : ''}"
              onclick="window.plantOpsLab.selectCalcModel('${model.id}')"
            >
              <span class="subitem-num calc">${idx + 1}</span>
              <span class="subitem-text">${model.titleAr}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    if (this.activeSubTab === 'troubleshoot') {
      return `
        <div class="subitems-header">
          <span>حالات الاضطراب والطوارئ (الفصل الرابع)</span>
        </div>
        <div class="subitems-scroll-list">
          ${TROUBLESHOOTING_DATA.map((sc, idx) => `
            <button 
              class="subitem-btn trb ${sc.id === this.activeScenarioId ? 'active' : ''}"
              onclick="window.plantOpsLab.selectScenario('${sc.id}')"
            >
              <span class="subitem-num trb">${idx + 1}</span>
              <span class="subitem-text">${sc.titleAr}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    if (this.activeSubTab === 'interlocks') {
      return `
        <div class="subitems-header">
          <span>تصنيف شروط الأمان (SIS Filters)</span>
        </div>
        <div class="subitems-scroll-list">
          <button class="subitem-btn ${this.activeInterlockFilter === 'ALL' ? 'active' : ''}" onclick="window.plantOpsLab.setInterlockFilter('ALL')">
            <span class="subitem-num">★</span>
            <span class="subitem-text">كافة قواعد الأمان (${INTERLOCK_RULES_DATA.length})</span>
          </button>
          <button class="subitem-btn ${this.activeInterlockFilter === 'Total S/D' ? 'active' : ''}" onclick="window.plantOpsLab.setInterlockFilter('Total S/D')">
            <span class="subitem-num" style="background:#ff3b30;color:#fff;">🛑</span>
            <span class="subitem-text">توقف كلي (Total Shutdown)</span>
          </button>
          <button class="subitem-btn ${this.activeInterlockFilter === 'Partial S/D' ? 'active' : ''}" onclick="window.plantOpsLab.setInterlockFilter('Partial S/D')">
            <span class="subitem-num" style="background:#f5a800;color:#000;">⚠️</span>
            <span class="subitem-text">توقف جزئي (Partial Shutdown)</span>
          </button>
          <button class="subitem-btn ${this.activeInterlockFilter === 'Trip' ? 'active' : ''}" onclick="window.plantOpsLab.setInterlockFilter('Trip')">
            <span class="subitem-num" style="background:#00c8ef;color:#000;">⚡</span>
            <span class="subitem-text">رحلة طارئة (Equipment Trip)</span>
          </button>
        </div>
      `;
    }

    if (this.activeSubTab === 'steam_balance') {
      return `
        <div class="subitems-header">
          <span>خطوط وشبكات البخار (Steam Headers)</span>
        </div>
        <div class="subitems-scroll-list">
          ${STEAM_HEADERS_DATA.map((hdr, idx) => `
            <div class="subitem-steam-pill">
              <b class="sh-tag">${hdr.name}</b>
              <span>${hdr.type} (${hdr.temp})</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    return '';
  }

  private getActiveSectionName(): string {
    switch (this.activeSubTab) {
      case 'startup': return '🚀 تسلسل مراحل التشغيل';
      case 'shutdown': return '🛑 إجراءات التوقف والعزل';
      case 'lab_calc': return '🧮 مختبر الحسابات الهندسية';
      case 'troubleshoot': return '⚠️ سيناريوهات الطوارئ والأعطال';
      case 'interlocks': return '🛡️ مصفوفة الأمان والإنترلوك';
      case 'steam_balance': return '💨 موازنة شبكة البخار';
    }
  }

  private getActiveItemName(): string {
    if (this.activeSubTab === 'startup') {
      const step = STARTUP_PROCEDURES_DATA.find(s => s.stepNum === this.currentStartupStep);
      return step ? `المرحلة ${step.stepNum}: ${step.stageNameAr}` : '';
    }
    if (this.activeSubTab === 'shutdown') {
      const step = SHUTDOWN_PROCEDURES_DATA.find(s => s.stepNum === this.currentShutdownStep);
      return step ? `المرحلة ${step.stepNum}: ${step.stageNameAr}` : '';
    }
    if (this.activeSubTab === 'lab_calc') {
      const model = CALCULATION_MODELS_DATA.find(m => m.id === this.activeCalcModelId);
      return model ? model.titleAr : 'نماذج الحسابات';
    }
    if (this.activeSubTab === 'troubleshoot') {
      const sc = TROUBLESHOOTING_DATA.find(s => s.id === this.activeScenarioId);
      return sc ? sc.titleAr : 'الحالات الطارئة';
    }
    if (this.activeSubTab === 'interlocks') {
      return `فلتر: ${this.activeInterlockFilter}`;
    }
    if (this.activeSubTab === 'steam_balance') {
      return 'المخطط والمواصفات الكاملة';
    }
    return '';
  }

  private renderTopbarNavigationButtons(): string {
    if (this.activeSubTab === 'startup') {
      return `
        <button class="topbar-nav-btn" ${this.currentStartupStep <= 1 ? 'disabled' : ''} onclick="window.plantOpsLab.selectStartupStep(${this.currentStartupStep - 1})" title="المرحلة السابقة">
          ❮ السابق
        </button>
        <span class="topbar-step-badge">${this.currentStartupStep} / ${STARTUP_PROCEDURES_DATA.length}</span>
        <button class="topbar-nav-btn" ${this.currentStartupStep >= STARTUP_PROCEDURES_DATA.length ? 'disabled' : ''} onclick="window.plantOpsLab.selectStartupStep(${this.currentStartupStep + 1})" title="المرحلة التالية">
          التالي ❯
        </button>
      `;
    }

    if (this.activeSubTab === 'shutdown') {
      return `
        <button class="topbar-nav-btn" ${this.currentShutdownStep <= 1 ? 'disabled' : ''} onclick="window.plantOpsLab.selectShutdownStep(${this.currentShutdownStep - 1})" title="المرحلة السابقة">
          ❮ السابق
        </button>
        <span class="topbar-step-badge">${this.currentShutdownStep} / ${SHUTDOWN_PROCEDURES_DATA.length}</span>
        <button class="topbar-nav-btn" ${this.currentShutdownStep >= SHUTDOWN_PROCEDURES_DATA.length ? 'disabled' : ''} onclick="window.plantOpsLab.selectShutdownStep(${this.currentShutdownStep + 1})" title="المرحلة التالية">
          التالي ❯
        </button>
      `;
    }

    if (this.activeSubTab === 'lab_calc') {
      const curIdx = CALCULATION_MODELS_DATA.findIndex(m => m.id === this.activeCalcModelId);
      return `
        <button class="topbar-nav-btn" ${curIdx <= 0 ? 'disabled' : ''} onclick="window.plantOpsLab.selectCalcModel('${CALCULATION_MODELS_DATA[Math.max(0, curIdx - 1)].id}')">
          ❮ النموذج السابق
        </button>
        <span class="topbar-step-badge">${curIdx + 1} / ${CALCULATION_MODELS_DATA.length}</span>
        <button class="topbar-nav-btn" ${curIdx >= CALCULATION_MODELS_DATA.length - 1 ? 'disabled' : ''} onclick="window.plantOpsLab.selectCalcModel('${CALCULATION_MODELS_DATA[Math.min(CALCULATION_MODELS_DATA.length - 1, curIdx + 1)].id}')">
          النموذج التالي ❯
        </button>
      `;
    }

    if (this.activeSubTab === 'troubleshoot') {
      const curIdx = TROUBLESHOOTING_DATA.findIndex(s => s.id === this.activeScenarioId);
      return `
        <button class="topbar-nav-btn" ${curIdx <= 0 ? 'disabled' : ''} onclick="window.plantOpsLab.selectScenario('${TROUBLESHOOTING_DATA[Math.max(0, curIdx - 1)].id}')">
          ❮ الحالة السابقة
        </button>
        <span class="topbar-step-badge">${curIdx + 1} / ${TROUBLESHOOTING_DATA.length}</span>
        <button class="topbar-nav-btn" ${curIdx >= TROUBLESHOOTING_DATA.length - 1 ? 'disabled' : ''} onclick="window.plantOpsLab.selectScenario('${TROUBLESHOOTING_DATA[Math.min(TROUBLESHOOTING_DATA.length - 1, curIdx + 1)].id}')">
          الحالة التالية ❯
        </button>
      `;
    }

    return '';
  }

  private renderSubTabContent(): string {
    switch (this.activeSubTab) {
      case 'startup':
        return this.renderStartupTab();
      case 'shutdown':
        return this.renderShutdownTab();
      case 'lab_calc':
        return this.renderLabCalcTab();
      case 'troubleshoot':
        return this.renderTroubleshootTab();
      case 'interlocks':
        return this.renderInterlocksTab();
      case 'steam_balance':
        return this.renderSteamBalanceTab();
      default:
        return '';
    }
  }

  // ==========================================
  // VIEW: 1. STARTUP SEQUENCE (تسلسل التشغيل)
  // ==========================================
  private renderStartupTab(): string {
    const activeStep = STARTUP_PROCEDURES_DATA.find(s => s.stepNum === this.currentStartupStep) || STARTUP_PROCEDURES_DATA[0];

    return `
      <div class="opslab-step-detail-card">
        <div class="step-card-header">
          <div class="sch-left">
            <div class="step-chip-row">
              <span class="step-chip">المرحلة رقم ${activeStep.stepNum} من ${STARTUP_PROCEDURES_DATA.length}</span>
              <span class="step-chip sec">الوحدة التشغيلية: ${activeStep.controllersAction[0]?.tag ? activeStep.controllersAction[0].tag.substring(0, 4) : 'Unit 100'}</span>
            </div>
            <h2 class="step-h2-title">${activeStep.stageNameAr}</h2>
          </div>
        </div>

        <div class="step-card-body">
          <!-- Full Text from Manual -->
          <div class="opslab-panel">
            <div class="panel-tag">📜 النص والإجراء التشغيلي المعتمد (من الملزمة الأصلية):</div>
            <p class="source-text">${activeStep.descAr}</p>
          </div>

          <!-- Operational Checks Matrix & Controllers Grid -->
          <div class="opslab-checks-grid">
            <div class="opslab-panel checks">
              <div class="panel-tag">🔍 الفحوصات والشروط التشغيلية الواجب توفرها (Pre-Startup Checks):</div>
              <ul class="checks-list">
                ${activeStep.checksAr.map(c => `
                  <li>
                    <span class="chk-icon">✔</span>
                    <span>${c}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Controllers & Actuators Action -->
            <div class="opslab-panel controllers">
              <div class="panel-tag">🎛️ حالة المسيطرات والصمامات في هذه الخطوة (Controllers & Valves):</div>
              <div class="ctrls-action-grid">
                ${activeStep.controllersAction.map(ca => `
                  <div class="ctrl-action-item">
                    <span class="ca-tag">${ca.tag}</span>
                    <span class="ca-act">${ca.action}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          ${activeStep.cautionAr ? `
            <div class="opslab-caution-box">
              <span class="caution-icon">⚠️</span>
              <div class="caution-text">
                <b>تنبيه هندسي حرج:</b> ${activeStep.cautionAr}
              </div>
            </div>
          ` : ''}

          <!-- Bottom Navigation Bar for smooth flow -->
          <div class="step-bottom-nav">
            <button class="nav-step-btn prev large" ${this.currentStartupStep <= 1 ? 'disabled' : ''} onclick="window.plantOpsLab.selectStartupStep(${this.currentStartupStep - 1})">
              ❮ الخطوة السابقة (${this.currentStartupStep > 1 ? STARTUP_PROCEDURES_DATA[this.currentStartupStep - 2].stageNameAr : 'البداية'})
            </button>
            <button class="nav-step-btn next large" ${this.currentStartupStep >= STARTUP_PROCEDURES_DATA.length ? 'disabled' : ''} onclick="window.plantOpsLab.selectStartupStep(${this.currentStartupStep + 1})">
              الخطوة التالية (${this.currentStartupStep < STARTUP_PROCEDURES_DATA.length ? STARTUP_PROCEDURES_DATA[this.currentStartupStep].stageNameAr : 'المرحلة النهائية'}) ❯
            </button>
          </div>
        </div>
      </div>
    `;
  }

  public selectStartupStep(stepNum: number) {
    this.currentStartupStep = Math.max(1, Math.min(STARTUP_PROCEDURES_DATA.length, stepNum));
    this.mobileDrawerOpen = false;
    this.render();
  }

  // ==========================================
  // VIEW: 2. SHUTDOWN PROCEDURES (إجراءات التوقف)
  // ==========================================
  private renderShutdownTab(): string {
    const activeStep = SHUTDOWN_PROCEDURES_DATA.find(s => s.stepNum === this.currentShutdownStep) || SHUTDOWN_PROCEDURES_DATA[0];

    return `
      <div class="opslab-step-detail-card">
        <div class="step-card-header">
          <div class="sch-left">
            <div class="step-chip-row">
              <span class="step-chip sd">تسلسل التوقف - مرحلة ${activeStep.stepNum} من ${SHUTDOWN_PROCEDURES_DATA.length}</span>
              <span class="step-type-pill ${activeStep.type.replace(/\s+/g, '-').toLowerCase()}">${activeStep.type}</span>
            </div>
            <h2 class="step-h2-title">${activeStep.stageNameAr}</h2>
          </div>
        </div>

        <div class="step-card-body">
          <div class="opslab-panel">
            <div class="panel-tag">📜 النص والإجراء التفصيلي من الملزمة:</div>
            <p class="source-text">${activeStep.descAr}</p>
          </div>

          <!-- Valves Sequence Table -->
          <div class="opslab-panel">
            <div class="panel-tag">🔒 تسلسل عزل وغلق الصمامات والمعدات (Valves Isolation Sequence):</div>
            <div class="opslab-table-wrap">
              <table class="opslab-table">
                <thead>
                  <tr>
                    <th>رمز الصمام / المعدة (Tag)</th>
                    <th>الحالة المطلوبة (Target Position)</th>
                    <th>الإجراء التفصيلي (Operational Action)</th>
                  </tr>
                </thead>
                <tbody>
                  ${activeStep.valvesSequence.map(vs => `
                    <tr>
                      <td><span class="tag-badge">${vs.tag}</span></td>
                      <td><span class="status-badge ${vs.state.toLowerCase().includes('close') ? 'closed' : (vs.state.toLowerCase().includes('open') ? 'open' : 'modulate')}">${vs.state}</span></td>
                      <td>عزل ومراقبة لمنع الضغوط العكسية وتأمين المفاعل وحماية الحشوات</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${activeStep.cautionAr ? `
            <div class="opslab-caution-box red">
              <span class="caution-icon">🛑</span>
              <div class="caution-text">
                <b>تحذير سلامة تشغيلية:</b> ${activeStep.cautionAr}
              </div>
            </div>
          ` : ''}

          <!-- Bottom Navigation Bar -->
          <div class="step-bottom-nav">
            <button class="nav-step-btn prev large" ${this.currentShutdownStep <= 1 ? 'disabled' : ''} onclick="window.plantOpsLab.selectShutdownStep(${this.currentShutdownStep - 1})">
              ❮ المرحلة السابقة (${this.currentShutdownStep > 1 ? SHUTDOWN_PROCEDURES_DATA[this.currentShutdownStep - 2].stageNameAr : 'البداية'})
            </button>
            <button class="nav-step-btn next large" ${this.currentShutdownStep >= SHUTDOWN_PROCEDURES_DATA.length ? 'disabled' : ''} onclick="window.plantOpsLab.selectShutdownStep(${this.currentShutdownStep + 1})">
              المرحلة التالية (${this.currentShutdownStep < SHUTDOWN_PROCEDURES_DATA.length ? SHUTDOWN_PROCEDURES_DATA[this.currentShutdownStep].stageNameAr : 'المرحلة النهائية'}) ❯
            </button>
          </div>
        </div>
      </div>
    `;
  }

  public selectShutdownStep(stepNum: number) {
    this.currentShutdownStep = Math.max(1, Math.min(SHUTDOWN_PROCEDURES_DATA.length, stepNum));
    this.mobileDrawerOpen = false;
    this.render();
  }

  // ==========================================
  // VIEW: 3. LAB CALCULATIONS (مختبر الحسابات التفاعلي)
  // ==========================================
  private renderLabCalcTab(): string {
    const model = CALCULATION_MODELS_DATA.find(m => m.id === this.activeCalcModelId) || CALCULATION_MODELS_DATA[0];
    const inputs = this.calculationInputs[model.id] || {};
    const calcResult = model.calculate(inputs);

    return `
      <div class="opslab-calc-wrapper">
        <div class="opslab-step-detail-card">
          <div class="step-card-header">
            <div class="sch-left">
              <div class="step-chip-row">
                <span class="step-chip">النموذج الحسابي رقم ${CALCULATION_MODELS_DATA.findIndex(m => m.id === model.id) + 1} من ${CALCULATION_MODELS_DATA.length}</span>
                <span class="step-chip sec">حسابات كيميائية وهندسية</span>
              </div>
              <h2 class="step-h2-title">${model.titleAr}</h2>
            </div>
          </div>

          <div class="step-card-body">
            <div class="opslab-panel">
              <div class="panel-tag">📖 الوصف والأساس العلمي للنموذج:</div>
              <p class="source-text">${model.descriptionAr}</p>
            </div>

            <!-- Mathematical Formula Display -->
            <div class="calc-formula-box">
              <span class="formula-label">📐 الصيغة والمعادلة الرياضية المعتمدة:</span>
              <code>${model.formulaTex}</code>
            </div>

            <!-- Parameters Inputs -->
            <div class="opslab-panel">
              <div class="panel-tag">⚙️ إدخال المتغيرات والبارامترات التشغيلية الحية:</div>
              <div class="calc-inputs-grid">
                ${model.parameters.map(p => `
                  <div class="calc-input-group">
                    <label>
                      <span>${p.nameAr}</span>
                      <small class="unit-tag">${p.unit}</small>
                    </label>
                    <input 
                      type="number" 
                      value="${inputs[p.key] ?? p.defaultVal}" 
                      step="${(p.max && p.max <= 10) ? '0.01' : '1'}"
                      min="${p.min ?? 0}" 
                      max="${p.max ?? 999999}" 
                      oninput="window.plantOpsLab.updateCalcInput('${model.id}', '${p.key}', this.value)"
                    />
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Calculation Output & Steps -->
            <div class="calc-result-box">
              <div class="result-head">
                <span class="res-label">النتيجة النهائية المحسوبة (Calculated Value):</span>
                <div class="res-val-wrap">
                  <span class="res-number">${calcResult.result}</span>
                  <span class="res-unit">${calcResult.unit}</span>
                </div>
              </div>

              <div class="calc-steps-toggle">
                <details open>
                  <summary>خطوات التعويض والحل التفصيلية خطوة بخطوة</summary>
                  <div class="steps-content">
                    ${calcResult.steps.map(s => `<p class="step-line">• ${s}</p>`).join('')}
                  </div>
                </details>
              </div>

              ${calcResult.statusNote ? `
                <div class="calc-status-note">
                  <span class="note-icon">💡</span>
                  <span>${calcResult.statusNote}</span>
                </div>
              ` : ''}
            </div>

            <!-- Bottom Navigation Bar -->
            <div class="step-bottom-nav">
              <button class="nav-step-btn prev large" onclick="window.plantOpsLab.prevCalcModel()">
                ❮ النموذج السابق
              </button>
              <button class="nav-step-btn next large" onclick="window.plantOpsLab.nextCalcModel()">
                النموذج التالي ❯
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  public selectCalcModel(id: string) {
    this.activeCalcModelId = id;
    this.mobileDrawerOpen = false;
    this.render();
  }

  public prevCalcModel() {
    const curIdx = CALCULATION_MODELS_DATA.findIndex(m => m.id === this.activeCalcModelId);
    if (curIdx > 0) {
      this.selectCalcModel(CALCULATION_MODELS_DATA[curIdx - 1].id);
    }
  }

  public nextCalcModel() {
    const curIdx = CALCULATION_MODELS_DATA.findIndex(m => m.id === this.activeCalcModelId);
    if (curIdx < CALCULATION_MODELS_DATA.length - 1) {
      this.selectCalcModel(CALCULATION_MODELS_DATA[curIdx + 1].id);
    }
  }

  public updateCalcInput(modelId: string, paramKey: string, val: string) {
    if (!this.calculationInputs[modelId]) this.calculationInputs[modelId] = {};
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      this.calculationInputs[modelId][paramKey] = parsed;
      this.render();
    }
  }

  // ==========================================
  // VIEW: 4. TROUBLESHOOTING SIMULATOR (المشاكل والحلول)
  // ==========================================
  private renderTroubleshootTab(): string {
    const activeScenario = TROUBLESHOOTING_DATA.find(s => s.id === this.activeScenarioId) || TROUBLESHOOTING_DATA[0];

    return `
      <div class="opslab-step-detail-card">
        <div class="step-card-header">
          <div class="sch-left">
            <div class="step-chip-row">
              <span class="step-chip trb">اضطراب تشغيلي حرج - Diagnostic & Action Plan</span>
            </div>
            <h2 class="step-h2-title">${activeScenario.titleAr}</h2>
          </div>
        </div>

        <div class="step-card-body">
          <!-- Cause Box -->
          <div class="opslab-panel cause">
            <div class="panel-tag">⚡ أسباب حدوث المشكلة الجذرية (Root Causes):</div>
            <p class="source-text">${activeScenario.causeAr}</p>
          </div>

          <div class="opslab-checks-grid">
            <!-- Indicators -->
            <div class="opslab-panel indicators">
              <div class="panel-tag">🚨 المؤشرات والعوارض في غرفة السيطرة (Symptoms & Alarms):</div>
              <ul class="trouble-list">
                ${activeScenario.indicatorsAr.map(ind => `<li>• ${ind}</li>`).join('')}
              </ul>
            </div>

            <!-- Effects -->
            <div class="opslab-panel effects">
              <div class="panel-tag">💥 التأثيرات الفورية على باقي الأقسام (Plant Impacts):</div>
              <ul class="trouble-list">
                ${activeScenario.effectsAr.map(eff => `<li>• ${eff}</li>`).join('')}
              </ul>
            </div>
          </div>

          <!-- Actions Split: CCR vs Field -->
          <div class="actions-split-grid">
            <div class="action-card ccr">
              <div class="action-card-head">
                <span class="icon">🎛️</span>
                <h3>إجراءات مهندس غرفة السيطرة (C.C.R Operator Actions)</h3>
              </div>
              <ul class="action-steps">
                ${activeScenario.ccrActionsAr.map(a => `<li><span class="chk">✔</span> ${a}</li>`).join('')}
              </ul>
            </div>

            <div class="action-card field">
              <div class="action-card-head">
                <span class="icon">🔧</span>
                <h3>إجراءات المشغل الحقلي (Field Operator Actions)</h3>
              </div>
              <ul class="action-steps">
                ${activeScenario.fieldActionsAr.map(a => `<li><span class="chk">✔</span> ${a}</li>`).join('')}
              </ul>
            </div>
          </div>

          <!-- Bottom Navigation Bar -->
          <div class="step-bottom-nav">
            <button class="nav-step-btn prev large" onclick="window.plantOpsLab.prevScenario()">
              ❮ الحالة السابقة
            </button>
            <button class="nav-step-btn next large" onclick="window.plantOpsLab.nextScenario()">
              الحالة التالية ❯
            </button>
          </div>
        </div>
      </div>
    `;
  }

  public selectScenario(id: string) {
    this.activeScenarioId = id;
    this.mobileDrawerOpen = false;
    this.render();
  }

  public prevScenario() {
    const curIdx = TROUBLESHOOTING_DATA.findIndex(s => s.id === this.activeScenarioId);
    if (curIdx > 0) {
      this.selectScenario(TROUBLESHOOTING_DATA[curIdx - 1].id);
    }
  }

  public nextScenario() {
    const curIdx = TROUBLESHOOTING_DATA.findIndex(s => s.id === this.activeScenarioId);
    if (curIdx < TROUBLESHOOTING_DATA.length - 1) {
      this.selectScenario(TROUBLESHOOTING_DATA[curIdx + 1].id);
    }
  }

  // ==========================================
  // VIEW: 5. INTERLOCKS MATRIX (مصفوفة الأمان)
  // ==========================================
  private renderInterlocksTab(): string {
    const filtered = this.activeInterlockFilter === 'ALL' 
      ? INTERLOCK_RULES_DATA 
      : INTERLOCK_RULES_DATA.filter(r => r.type === this.activeInterlockFilter);

    return `
      <div class="opslab-interlocks-container">
        <div class="interlocks-filter-bar">
          <div class="if-title">
            <h3>مصفوفة الحماية والربط التداخلي للسلامة (Interlock Matrix - الفصل الخامس)</h3>
            <p>جدول يوضح أسباب وشروط التوقف الكلي (Total S/D)، التوقف الجزئي (Partial S/D)، والرحلات الطارئة (Trip) ومواضع الصمامات.</p>
          </div>
          <div class="filter-buttons">
            <button class="filter-btn ${this.activeInterlockFilter === 'ALL' ? 'active' : ''}" onclick="window.plantOpsLab.setInterlockFilter('ALL')">الكل (${INTERLOCK_RULES_DATA.length})</button>
            <button class="filter-btn ${this.activeInterlockFilter === 'Total S/D' ? 'active' : ''}" onclick="window.plantOpsLab.setInterlockFilter('Total S/D')">توقف كلي (Total S/D)</button>
            <button class="filter-btn ${this.activeInterlockFilter === 'Partial S/D' ? 'active' : ''}" onclick="window.plantOpsLab.setInterlockFilter('Partial S/D')">توقف جزئي (Partial S/D)</button>
            <button class="filter-btn ${this.activeInterlockFilter === 'Trip' ? 'active' : ''}" onclick="window.plantOpsLab.setInterlockFilter('Trip')">رحلة طارئة (Trip)</button>
          </div>
        </div>

        <div class="opslab-table-wrap">
          <table class="opslab-table interlock">
            <thead>
              <tr>
                <th>رقم الشرط (ID)</th>
                <th>المحفز أو الحساس (Initiator / Tag)</th>
                <th>قيمة التفعيل (Setpoint)</th>
                <th>نوع الإغلاق (Type)</th>
                <th>الإجراء والتأثير التشغيلي (Interlock Action)</th>
                <th>الصمامات المتأثرة (Valves Position)</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(rule => `
                <tr>
                  <td><span class="tag-badge id">${rule.id}</span></td>
                  <td><b class="initiator-tag">${rule.initiator}</b></td>
                  <td><code class="sp-code">${rule.setpoint}</code></td>
                  <td><span class="status-badge ${rule.type.replace(/\s+/g, '-').toLowerCase()}">${rule.type}</span></td>
                  <td class="action-cell">${rule.actionAr}</td>
                  <td>
                    <div class="valves-tag-wrap">
                      ${rule.valvesAffected.map(v => `
                        <span class="v-pill ${v.state.replace(/\s+/g, '-')}">${v.tag}: ${v.state}</span>
                      `).join('')}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  public setInterlockFilter(filter: string) {
    this.activeInterlockFilter = filter;
    this.render();
  }

  // ==========================================
  // VIEW: 6. STEAM BALANCE & HEADERS (موازنة البخار)
  // ==========================================
  private renderSteamBalanceTab(): string {
    return `
      <div class="opslab-steam-container">
        <div class="steam-intro-card">
          <h2>مخطط ومواصفات خطوط البخار الخمسة (Steam Headers System)</h2>
          <p>تعتمد وحدة الأمونيا على استهلاك وتوليد وتصدير أربعة أنواع رئيسية من البخار (S65, S39, S25, S12, S3) لتشغيل التوربينات والمفاعلات ومبادلات الحرارة.</p>
        </div>

        <div class="steam-cards-grid">
          ${STEAM_HEADERS_DATA.map(hdr => `
            <div class="steam-spec-card">
              <div class="ssc-head">
                <div class="ssc-tag">${hdr.name}</div>
                <div class="ssc-temp">${hdr.temp}</div>
              </div>
              <div class="ssc-type">${hdr.type}</div>

              <div class="ssc-section">
                <span class="sec-label">مصادر التوليد (Generation Sources):</span>
                <ul class="sec-list">
                  ${hdr.generationSources.map(s => `<li>• ${s}</li>`).join('')}
                </ul>
              </div>

              <div class="ssc-section">
                <span class="sec-label">المستهلكون والمعدات (Consumers):</span>
                <ul class="sec-list">
                  ${hdr.consumers.map(c => `<li>• ${c}</li>`).join('')}
                </ul>
              </div>

              <div class="ssc-section">
                <span class="sec-label">مسيطلات الضغط والحرارة (Controllers):</span>
                <div class="tags-cloud">
                  ${hdr.controllers.map(ctrl => `<span class="c-tag">${ctrl}</span>`).join('')}
                </div>
              </div>

              <div class="ssc-footer">
                <span class="vent-label">صمام التنفيس (Vent): <b>${hdr.ventValve}</b></span>
                <p class="notes">${hdr.notes}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================
  // CSS STYLING INJECTION
  // ==========================================
  private injectStyles() {
    let style = document.getElementById('opslab-styles') as HTMLStyleElement;
    if (!style) {
      style = document.createElement('style');
      style.id = 'opslab-styles';
      document.head.appendChild(style);
    }
    style.textContent = `
      /* Root Container */
      .opslab-root {
        display: flex;
        flex-direction: row;
        width: 100%;
        min-height: calc(100vh - 120px);
        background: #02070e;
        color: #e2eef8;
        font-family: 'Segoe UI', system-ui, -apple-system, Tahoma, Geneva, Verdana, sans-serif;
        direction: rtl;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #14304c;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        position: relative;
        box-sizing: border-box;
      }

      /* Mobile Drawer Backdrop */
      .opslab-drawer-backdrop {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        z-index: 998;
      }
      .opslab-drawer-backdrop.open {
        display: block;
      }

      /* 1. SIDEBAR NAVIGATION */
      .opslab-sidebar {
        width: 320px;
        min-width: 300px;
        background: #05101a;
        border-left: 1px solid #14304c;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        z-index: 999;
        max-height: 100vh;
        max-height: 100dvh;
        overflow: hidden;
        transition: transform 0.25s ease;
      }

      .opslab-sidebar-header {
        padding: 16px;
        border-bottom: 1px solid #132e4a;
        background: linear-gradient(180deg, #091a2b 0%, #05101a 100%);
      }

      .opslab-brand-row {
        display: flex;
        align-items: center;
        gap: 10px;
        position: relative;
      }

      .opslab-logo-icon {
        font-size: 24px;
        flex-shrink: 0;
      }

      .opslab-brand-text h3 {
        margin: 0;
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
        letter-spacing: -0.2px;
      }
      .opslab-brand-text small {
        display: block;
        font-size: 10.5px;
        color: #00c8ef;
        margin-top: 2px;
      }

      .opslab-close-drawer-btn {
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        background: #0d2238;
        border: 1px solid #1a4267;
        color: #8da4b8;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        align-items: center;
        justify-content: center;
      }

      .opslab-author-badge {
        margin-top: 10px;
        padding: 6px 10px;
        background: rgba(0, 229, 170, 0.06);
        border: 1px solid rgba(0, 229, 170, 0.2);
        border-radius: 6px;
        font-size: 10.5px;
        color: #8da4b8;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .opslab-author-badge b {
        color: #00e5aa;
        font-size: 11px;
      }

      /* Sections Menu (Primary 6 Modules) */
      .opslab-sections-menu {
        padding: 12px 10px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        border-bottom: 1px solid #132e4a;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        touch-action: pan-y;
        max-height: 48vh;
      }

      .menu-section-label {
        font-size: 10.5px;
        font-weight: bold;
        color: #5c7992;
        padding: 0 6px 4px;
        text-transform: uppercase;
      }

      .section-tab-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #081624;
        border: 1px solid #132e4a;
        color: #a4bccc;
        padding: 9px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
        text-align: right;
        width: 100%;
        touch-action: pan-y;
      }
      .section-tab-btn:hover {
        background: #0c2338;
        border-color: #00c8ef;
        color: #ffffff;
      }
      .section-tab-btn.active {
        background: #0d2842;
        border-color: #00e5aa;
        color: #ffffff;
        box-shadow: 0 2px 12px rgba(0, 229, 170, 0.15);
      }
      .section-tab-btn .st-icon {
        font-size: 16px;
        flex-shrink: 0;
      }
      .section-tab-btn .st-title {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .section-tab-btn .st-badge {
        font-size: 10px;
        background: rgba(0, 200, 239, 0.15);
        color: #00c8ef;
        padding: 2px 6px;
        border-radius: 10px;
        font-family: 'Courier New', monospace;
        font-weight: bold;
      }
      .section-tab-btn.active .st-badge {
        background: #00e5aa;
        color: #02070e;
      }

      /* Sub-items Panel (List of Steps, Models, Troubleshoots) */
      .opslab-subitems-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 10px;
        background: #030a12;
        touch-action: pan-y;
      }

      .subitems-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
        font-weight: bold;
        color: #00c8ef;
        padding: 4px 6px 8px;
        border-bottom: 1px solid #0f2438;
        margin-bottom: 8px;
      }
      .subitems-header small {
        color: #728c9f;
        font-family: 'Courier New', monospace;
      }

      .subitems-scroll-list {
        flex: 1;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        touch-action: pan-y;
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding-left: 4px;
        scrollbar-width: thin;
      }

      .subitem-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #061422;
        border: 1px solid #11283e;
        color: #9cb5c9;
        padding: 7px 10px;
        border-radius: 6px;
        font-size: 11.5px;
        cursor: pointer;
        transition: all 0.12s ease;
        text-align: right;
        width: 100%;
        line-height: 1.35;
        touch-action: pan-y;
      }
      .subitem-btn:hover {
        background: #0c2033;
        border-color: #00c8ef;
        color: #ffffff;
      }
      .subitem-btn.active {
        background: #0e2942;
        border-color: #00e5aa;
        color: #ffffff;
        font-weight: bold;
        box-shadow: 0 0 10px rgba(0, 229, 170, 0.2);
      }
      .subitem-btn.active.sd {
        border-color: #f5a800;
        box-shadow: 0 0 10px rgba(245, 168, 0, 0.2);
      }
      .subitem-btn.active.trb {
        border-color: #ff3b30;
        box-shadow: 0 0 10px rgba(255, 59, 48, 0.2);
      }
      .subitem-btn.passed {
        border-color: #0c3b32;
        background: #04121a;
      }

      .subitem-num {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(0, 229, 170, 0.12);
        color: #00e5aa;
        font-size: 10px;
        font-weight: bold;
        font-family: 'Courier New', monospace;
        flex-shrink: 0;
      }
      .subitem-num.sd {
        background: rgba(245, 168, 0, 0.15);
        color: #f5a800;
      }
      .subitem-num.trb {
        background: rgba(255, 59, 48, 0.15);
        color: #ff3b30;
      }
      .subitem-num.calc {
        background: rgba(0, 200, 239, 0.15);
        color: #00c8ef;
      }
      .subitem-btn.active .subitem-num {
        background: #00e5aa;
        color: #02070e;
      }
      .subitem-btn.active.sd .subitem-num {
        background: #f5a800;
        color: #02070e;
      }
      .subitem-btn.active.trb .subitem-num {
        background: #ff3b30;
        color: #ffffff;
      }
      .subitem-btn.active.calc .subitem-num {
        background: #00c8ef;
        color: #02070e;
      }

      .subitem-text {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .subitem-steam-pill {
        background: #081726;
        border: 1px solid #14304c;
        border-radius: 6px;
        padding: 8px 10px;
        font-size: 11px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .subitem-steam-pill .sh-tag {
        color: #00e5aa;
        font-family: 'Courier New', monospace;
        font-size: 12px;
      }

      /* 2. MAIN VIEWPORT */
      .opslab-main-viewport {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        background: #02070e;
        overflow-y: auto;
      }

      /* Top Bar */
      .opslab-topbar {
        background: #05101a;
        border-bottom: 1px solid #14304c;
        padding: 12px 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        position: sticky;
        top: 0;
        z-index: 40;
      }

      .opslab-drawer-toggle-btn {
        display: none;
        background: #091d2e;
        border: 1px solid #00c8ef;
        color: #00c8ef;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        align-items: center;
        gap: 6px;
      }

      .opslab-topbar-breadcrumb {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 600;
        flex: 1;
      }
      .bc-section {
        color: #00c8ef;
      }
      .bc-sep {
        color: #3b5a75;
      }
      .bc-item {
        color: #ffffff;
        font-weight: bold;
      }

      .opslab-topbar-nav {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .topbar-nav-btn {
        background: #081726;
        border: 1px solid #163654;
        color: #a4bccc;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 11.5px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.15s ease;
        white-space: nowrap;
      }
      .topbar-nav-btn:hover:not(:disabled) {
        background: #00c8ef;
        color: #02070e;
        border-color: #00c8ef;
      }
      .topbar-nav-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .topbar-step-badge {
        background: #091a2b;
        color: #00e5aa;
        border: 1px solid #143654;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-family: 'Courier New', monospace;
        font-weight: bold;
      }

      /* Body Area */
      .opslab-body-card {
        padding: 18px 20px 40px;
        flex: 1;
      }

      /* Step Detail Card */
      .opslab-step-detail-card {
        background: #05101a;
        border: 1px solid #14304c;
        border-radius: 10px;
        padding: 18px 20px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }

      .step-card-header {
        border-bottom: 1px solid #132e4a;
        padding-bottom: 12px;
      }
      .step-chip-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 6px;
      }
      .step-chip {
        font-size: 10px;
        font-weight: bold;
        color: #00e5aa;
        background: rgba(0, 229, 170, 0.1);
        padding: 2px 10px;
        border-radius: 12px;
        border: 1px solid #00e5aa;
        display: inline-block;
      }
      .step-chip.sd { color: #f5a800; border-color: #f5a800; background: rgba(245, 168, 0, 0.1); }
      .step-chip.trb { color: #ff3b30; border-color: #ff3b30; background: rgba(255, 59, 48, 0.1); }
      .step-chip.sec { color: #00c8ef; border-color: #00c8ef; background: rgba(0, 200, 239, 0.1); }

      .step-type-pill {
        font-size: 9px;
        font-weight: bold;
        padding: 2px 8px;
        border-radius: 4px;
        background: rgba(0, 200, 239, 0.2);
        color: #00c8ef;
      }

      .step-h2-title {
        font-size: clamp(15px, 2vw, 19px);
        color: #ffffff;
        margin: 4px 0 0;
        line-height: 1.4;
        font-weight: 800;
      }

      .opslab-panel {
        background: #02070e;
        border: 1px solid #142e47;
        border-radius: 8px;
        padding: 14px 16px;
        margin-bottom: 12px;
      }
      .panel-tag {
        font-size: 11.5px;
        font-weight: bold;
        color: #00c8ef;
        margin-bottom: 8px;
      }
      .source-text {
        font-size: 13px;
        line-height: 1.7;
        color: #d1e2f0;
        margin: 0;
      }

      .opslab-checks-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 12px;
      }
      .checks-list, .trouble-list {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 12px;
        color: #a4bccc;
      }
      .checks-list li {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        line-height: 1.45;
      }
      .chk-icon {
        color: #00e5aa;
        font-weight: bold;
        flex-shrink: 0;
      }

      .ctrls-action-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      .ctrl-action-item {
        background: #05101a;
        border: 1px solid #163654;
        border-radius: 6px;
        padding: 8px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 6px;
      }
      .ca-tag {
        font-size: 11px;
        font-weight: bold;
        color: #00e5aa;
        font-family: 'Courier New', monospace;
        flex-shrink: 0;
      }
      .ca-act {
        font-size: 10.5px;
        color: #8da4b8;
        text-align: left;
        direction: ltr;
      }

      .opslab-caution-box {
        background: rgba(245, 168, 0, 0.08);
        border: 1px solid #f5a800;
        border-radius: 8px;
        padding: 12px 14px;
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 12px;
      }
      .opslab-caution-box.red {
        background: rgba(255, 59, 48, 0.08);
        border-color: #ff3b30;
      }
      .caution-icon {
        font-size: 20px;
        flex-shrink: 0;
      }
      .caution-text {
        font-size: 12px;
        color: #e2eef8;
        line-height: 1.5;
      }

      .step-bottom-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        border-top: 1px solid #132e4a;
        padding-top: 16px;
        margin-top: 8px;
        flex-wrap: wrap;
      }
      .nav-step-btn {
        background: #081624;
        border: 1px solid #183a5c;
        color: #a4bccc;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.15s;
        white-space: nowrap;
      }
      .nav-step-btn:hover:not(:disabled) {
        background: #00c8ef;
        color: #030a12;
      }
      .nav-step-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .nav-step-btn.large {
        padding: 10px 20px;
        font-size: 12.5px;
      }

      /* 3. CALCULATIONS VIEW */
      .opslab-calc-wrapper {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .calc-formula-box {
        background: #02070e;
        border: 1px solid #142e47;
        border-radius: 6px;
        padding: 10px 14px;
        margin-bottom: 12px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        color: #00e5aa;
        direction: ltr;
        text-align: left;
      }
      .formula-label {
        display: block;
        font-size: 10.5px;
        color: #5c7992;
        margin-bottom: 4px;
        font-family: 'Segoe UI', system-ui, sans-serif;
        direction: rtl;
        text-align: right;
      }
      .calc-inputs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
      }
      .calc-input-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .calc-input-group label {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: #8da4b8;
      }
      .unit-tag {
        color: #f5a800;
        font-family: 'Courier New', monospace;
      }
      .calc-input-group input {
        background: #05101a;
        border: 1px solid #163654;
        color: #ffffff;
        padding: 7px 10px;
        border-radius: 6px;
        font-size: 13px;
        font-family: 'Courier New', monospace;
      }
      .calc-input-group input:focus {
        border-color: #00c8ef;
        outline: none;
      }
      .calc-result-box {
        background: #02070e;
        border: 1px solid #163654;
        border-radius: 8px;
        padding: 14px 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 10px;
      }
      .result-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }
      .res-label {
        font-size: 12px;
        color: #8da4b8;
        font-weight: bold;
      }
      .res-val-wrap {
        display: flex;
        align-items: baseline;
        gap: 6px;
        direction: ltr;
      }
      .res-number {
        font-size: 22px;
        font-weight: 800;
        color: #00e5aa;
        font-family: 'Courier New', monospace;
      }
      .res-unit {
        font-size: 12px;
        color: #00c8ef;
      }
      .calc-steps-toggle details {
        font-size: 11.5px;
        color: #8da4b8;
      }
      .calc-steps-toggle summary {
        cursor: pointer;
        color: #00c8ef;
        font-weight: bold;
      }
      .steps-content {
        margin-top: 8px;
        background: #05101a;
        border: 1px solid #142e47;
        border-radius: 6px;
        padding: 8px 12px;
      }
      .step-line {
        margin: 4px 0;
        font-family: 'Courier New', monospace;
        font-size: 11px;
        color: #c4d7e6;
        direction: ltr;
        text-align: left;
      }
      .calc-status-note {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 11px;
        color: #f5a800;
        background: rgba(245, 168, 0, 0.08);
        padding: 6px 10px;
        border-radius: 6px;
      }

      /* 4. TROUBLESHOOTING ACTIONS */
      .actions-split-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 12px;
      }
      .action-card {
        background: #02070e;
        border: 1px solid #163654;
        border-radius: 8px;
        padding: 14px 16px;
      }
      .action-card.ccr { border-top: 3px solid #00c8ef; }
      .action-card.field { border-top: 3px solid #f5a800; }
      .action-card-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        border-bottom: 1px solid #12283e;
        padding-bottom: 8px;
      }
      .action-card-head h3 {
        font-size: 13px;
        margin: 0;
        color: #ffffff;
      }
      .action-steps {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 11.5px;
        color: #c4d7e6;
        line-height: 1.5;
      }
      .action-steps .chk {
        color: #00e5aa;
        font-weight: bold;
      }

      /* 5. INTERLOCKS TABLE */
      .opslab-interlocks-container {
        background: #05101a;
        border: 1px solid #14304c;
        border-radius: 10px;
        padding: 18px 20px;
      }
      .interlocks-filter-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 16px;
        border-bottom: 1px solid #132e4a;
        padding-bottom: 12px;
        gap: 12px;
      }
      .if-title h3 {
        font-size: 15px;
        color: #00c8ef;
        margin: 0 0 4px;
      }
      .if-title p {
        font-size: 11.5px;
        color: #728c9f;
        margin: 0;
      }
      .filter-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .filter-btn {
        background: #02070e;
        border: 1px solid #142e47;
        color: #8da4b8;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 11.5px;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .filter-btn.active {
        background: #00c8ef;
        border-color: #00c8ef;
        color: #030a12;
        font-weight: bold;
      }
      .opslab-table-wrap {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      .opslab-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11.5px;
        min-width: 600px;
      }
      .opslab-table th {
        background: #02070e;
        color: #00c8ef;
        padding: 10px 12px;
        text-align: right;
        border-bottom: 1px solid #142e47;
        font-weight: bold;
        white-space: nowrap;
      }
      .opslab-table td {
        padding: 10px 12px;
        border-bottom: 1px solid #0f2438;
        color: #c4d7e6;
        vertical-align: middle;
      }
      .tag-badge {
        background: #0b2238;
        color: #00e5aa;
        padding: 2px 8px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-weight: bold;
        display: inline-block;
      }
      .tag-badge.id { color: #f5a800; }
      .sp-code {
        color: #f5a800;
        font-family: 'Courier New', monospace;
      }
      .initiator-tag {
        color: #ffffff;
      }
      .action-cell {
        line-height: 1.45;
        max-width: 300px;
      }
      .status-badge {
        font-size: 9.5px;
        font-weight: bold;
        padding: 3px 8px;
        border-radius: 4px;
        display: inline-block;
        white-space: nowrap;
      }
      .status-badge.total-s/d, .status-badge.closed { background: rgba(255, 59, 48, 0.2); color: #ff3b30; }
      .status-badge.partial-s/d { background: rgba(245, 168, 0, 0.2); color: #f5a800; }
      .status-badge.trip { background: rgba(255, 59, 48, 0.3); color: #ff3b30; }
      .status-badge.open { background: rgba(0, 229, 170, 0.2); color: #00e5aa; }
      .status-badge.modulate { background: rgba(0, 200, 239, 0.2); color: #00c8ef; }

      .valves-tag-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        max-width: 320px;
      }
      .v-pill {
        font-size: 9px;
        font-family: 'Courier New', monospace;
        padding: 2px 6px;
        border-radius: 3px;
        white-space: nowrap;
      }
      .v-pill.close { background: rgba(255, 59, 48, 0.2); color: #ff3b30; }
      .v-pill.open { background: rgba(0, 229, 170, 0.2); color: #00e5aa; }
      .v-pill.min { background: rgba(245, 168, 0, 0.2); color: #f5a800; }
      .v-pill.still-open { background: #0c2b3d; color: #00c8ef; }
      .v-pill.still-close { background: #261619; color: #9c6c74; }

      /* 6. STEAM BALANCES */
      .steam-intro-card {
        background: #05101a;
        border: 1px solid #14304c;
        border-radius: 10px;
        padding: 16px 20px;
        margin-bottom: 16px;
      }
      .steam-intro-card h2 {
        font-size: 16px;
        color: #00c8ef;
        margin: 0 0 6px;
      }
      .steam-intro-card p {
        font-size: 12px;
        color: #8da4b8;
        margin: 0;
        line-height: 1.55;
      }
      .steam-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
        gap: 14px;
      }
      .steam-spec-card {
        background: #05101a;
        border: 1px solid #163654;
        border-radius: 8px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .ssc-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .ssc-tag {
        font-size: 20px;
        font-weight: 800;
        color: #00e5aa;
        font-family: 'Courier New', monospace;
      }
      .ssc-temp {
        font-size: 13px;
        color: #f5a800;
        font-weight: bold;
        font-family: 'Courier New', monospace;
      }
      .ssc-type {
        font-size: 11px;
        color: #8da4b8;
      }
      .ssc-section {
        border-top: 1px solid #10263c;
        padding-top: 8px;
      }
      .sec-label {
        display: block;
        font-size: 10.5px;
        color: #00c8ef;
        margin-bottom: 4px;
        font-weight: bold;
      }
      .sec-list {
        margin: 0;
        padding: 0;
        list-style: none;
        font-size: 11px;
        color: #c4d7e6;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .tags-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .c-tag {
        font-size: 9.5px;
        background: #0d2238;
        color: #00e5aa;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
      }
      .ssc-footer {
        border-top: 1px solid #10263c;
        padding-top: 8px;
        margin-top: auto;
      }
      .vent-label {
        font-size: 10.5px;
        color: #8da4b8;
      }
      .vent-label b { color: #f5a800; }
      .notes {
        font-size: 10.5px;
        color: #728c9f;
        margin: 4px 0 0;
        line-height: 1.45;
      }

      /* Responsive Breakpoints */
      @media (max-width: 900px) {
        .opslab-root {
          flex-direction: column;
          min-height: auto;
        }
        .opslab-sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          right: 0;
          transform: translateX(100%);
          box-shadow: -5px 0 25px rgba(0,0,0,0.8);
          max-width: 85vw;
        }
        .opslab-sidebar.open {
          transform: translateX(0);
        }
        .opslab-close-drawer-btn {
          display: flex;
        }
        .opslab-drawer-toggle-btn {
          display: inline-flex;
        }
        .opslab-checks-grid { grid-template-columns: 1fr; }
        .ctrls-action-grid { grid-template-columns: 1fr; }
        .actions-split-grid { grid-template-columns: 1fr; }
      }
    `;
  }
}

export const plantOpsLab = new PlantOperationsLab();
(window as any).plantOpsLab = plantOpsLab;
(window as any)._opslabInit = () => plantOpsLab.init();

