// Unit Operations DCS Center - User Interface & Interactive Management
import { unitOpsEngine } from './UnitOpsEngine';
import { SectionId, ControllerPoint, UnitSectionData } from './UnitOpsTypes';

export class UnitOpsManager {
  private containerId = 'unitOpsStage';
  private selectedFaceplate: { secId: SectionId; tag: string } | null = null;
  private trendAnimationId: number | null = null;

  constructor() {
    unitOpsEngine.subscribe((secId) => {
      if (secId === unitOpsEngine.activeSectionId) {
        this.renderSectionContent(false);
      }
      this.updateSectionTabsBadges();
      if (this.selectedFaceplate && this.selectedFaceplate.secId === secId) {
        this.updateFaceplateModalContent();
      }
    });
  }

  public init() {
    this.injectStyles();
    const stage = document.getElementById(this.containerId);
    if (!stage) return;

    stage.className = 'app-stage-container uops-stage';
    stage.style.flexDirection = 'column';
    stage.style.overflowY = 'auto';
    stage.style.overflowX = 'hidden';

    stage.innerHTML = `
      <div class="uops-inner-container">
        <!-- Top Branding Header -->
        <div class="uops-header">
          <div class="uops-header-left">
            <div class="uops-logo-badge">🏛 الهيئة العامة للمهندسين الكيميائيين في البصرة</div>
            <h1 class="uops-title">التشغيل المركزي للأقسام <small>Unit Operations & Section DCS Console</small></h1>
            <p class="uops-subtitle">نظام المحاكاة والتشغيل التفاعلي المستقل لكل قسم من أقسام مصنع الأمونيا بالاعتماد على مسيطراته الخاصة ومحاكاة الاستجابة الديناميكية</p>
          </div>
          <div class="uops-header-right">
            <div class="uops-author-tag">
              <span class="uops-author-title">إعداد وتطوير:</span>
              <span class="uops-author-name">م. علي سيف الدين حيدر النوفل</span>
              <span class="uops-author-sub">ENG. ALI SAIF AL DIN HAIDER ALNAWFAL</span>
            </div>
          </div>
        </div>

        <!-- Section Navigation Bar -->
        <div class="uops-nav-bar" id="uops-nav-bar"></div>

        <!-- Section Main Body Mount -->
        <div class="uops-body" id="uops-body"></div>
      </div>

      <!-- Detailed Faceplate Modal -->
      <div class="uops-modal-backdrop" id="uops-faceplate-modal" style="display:none">
        <div class="uops-modal-card" id="uops-modal-card"></div>
      </div>
    `;

    this.renderSectionTabs();
    this.renderSectionContent(true);
  }

  public selectSection(secId: SectionId) {
    unitOpsEngine.activeSectionId = secId;
    this.renderSectionTabs();
    this.renderSectionContent(true);
  }

  private renderSectionTabs() {
    const navBar = document.getElementById('uops-nav-bar');
    if (!navBar) return;

    const sections = Object.values(unitOpsEngine.sections);
    
    // Grouping for intuitive industrial navigation
    let html = '';
    sections.forEach((sec) => {
      const isSelected = sec.id === unitOpsEngine.activeSectionId;
      const statusBadge = this.getStatusBadgeHTML(sec.status);
      
      html += `
        <button class="uops-tab-btn ${isSelected ? 'active' : ''}" onclick="window._uopsSelectSection('${sec.id}')">
          <div class="uops-tab-num">${sec.numberStr}</div>
          <div class="uops-tab-name">${sec.nameAr}</div>
          <div class="uops-tab-sub">${sec.nameEn}</div>
          <div class="uops-tab-status-wrap" id="uops-tab-status-${sec.id}">${statusBadge}</div>
        </button>
      `;
    });

    navBar.innerHTML = html;
  }

  private updateSectionTabsBadges() {
    const sections = Object.values(unitOpsEngine.sections);
    sections.forEach((sec) => {
      const el = document.getElementById(`uops-tab-status-${sec.id}`);
      if (el) {
        el.innerHTML = this.getStatusBadgeHTML(sec.status);
      }
    });
  }

  private getStatusBadgeHTML(status: string): string {
    switch (status) {
      case 'RUNNING':
        return `<span class="uops-badge-status running"><span class="uops-dot"></span>تشغيل RUNNING</span>`;
      case 'WARMING':
        return `<span class="uops-badge-status warming"><span class="uops-dot"></span>استعداد WARM-UP</span>`;
      case 'TRIPPED':
        return `<span class="uops-badge-status tripped"><span class="uops-dot"></span>رحلة طارئة TRIP</span>`;
      case 'SHUTDOWN':
      default:
        return `<span class="uops-badge-status shutdown"><span class="uops-dot"></span>متوقف STOP</span>`;
    }
  }

  public renderSectionContent(fullRebuild: boolean = false) {
    const body = document.getElementById('uops-body');
    if (!body) return;

    const sec = unitOpsEngine.getSection(unitOpsEngine.activeSectionId);
    if (!sec) return;

    if (fullRebuild) {
      body.innerHTML = `
        <!-- Section Overview & Control Header -->
        <div class="uops-section-head-card">
          <div class="uops-sh-left">
            <div class="uops-sh-tag">${sec.numberStr} &bull; ${sec.nameEn}</div>
            <h2 class="uops-sh-title">${sec.nameAr}</h2>
            <div class="uops-sh-equip">⚙ المعدات الرئيسية: <span>${sec.equipmentSummary}</span></div>
            <p class="uops-sh-desc">${sec.descriptionAr}</p>
          </div>
          <div class="uops-sh-right">
            <div class="uops-status-box">
              <div class="uops-sb-label">الحالة التشغيلية للقسم:</div>
              <div id="uops-current-status-badge">${this.getStatusBadgeHTML(sec.status)}</div>
              <div class="uops-load-meter">
                <div class="uops-load-head">
                  <span>حمل القسم (Section Load)</span>
                  <span id="uops-load-val"><b>${sec.loadPct}</b>%</span>
                </div>
                <input type="range" min="0" max="120" step="1" value="${sec.loadPct}" class="uops-range-slider"
                  oninput="window._uopsSetSectionLoad('${sec.id}', +this.value)">
              </div>
            </div>
            <!-- Section Command Actions -->
            <div class="uops-actions-group">
              <button class="uops-act-btn start" onclick="window._uopsSetStatus('${sec.id}', 'RUNNING')">▶ بدء التشغيل (Start)</button>
              <button class="uops-act-btn warm" onclick="window._uopsSetStatus('${sec.id}', 'WARMING')">⏸ استعداد دافئ (Standby)</button>
              <button class="uops-act-btn stop" onclick="window._uopsSetStatus('${sec.id}', 'SHUTDOWN')">⏹ إيقاف آمن (Shutdown)</button>
              <button class="uops-act-btn trip" onclick="window._uopsSetStatus('${sec.id}', 'TRIPPED')">🚨 رحلة طارئة (ESD Trip)</button>
            </div>
          </div>
        </div>

        <!-- Section Key Performance Indicators (KPIs) -->
        <div class="uops-kpis-grid" id="uops-kpis-grid">
          ${this.renderKPIsHTML(sec)}
        </div>

        <!-- Controllers & Faceplates Grid -->
        <div class="uops-section-block">
          <div class="uops-block-header">
            <div class="uops-bh-title">🎛 مصفوفة المسيطرات وغرف التحكم الخاصة بالقسم (DCS Faceplates)</div>
            <div class="uops-bh-hint">تحكم في كل مسيطر على حدة (تغيير النمط AUTO/MAN، تعديل Set Point، فتح الصمامات، وضبط الـ PID)</div>
          </div>
          <div class="uops-controllers-grid" id="uops-controllers-grid">
            ${this.renderControllersGridHTML(sec)}
          </div>
        </div>

        <!-- Disturbance & Training Scenarios (if available) -->
        ${sec.disturbances && sec.disturbances.length > 0 ? `
          <div class="uops-section-block">
            <div class="uops-block-header">
              <div class="uops-bh-title">🧪 حقن الاضطرابات والسيناريوهات التدريبية (Disturbance Injection)</div>
              <div class="uops-bh-hint">اختبر استجابة مسيطرات القسم التلقائية عند حدوث طوارئ واضطرابات هيدروليكية وحرارية</div>
            </div>
            <div class="uops-disturbances-grid">
              ${this.renderDisturbancesHTML(sec)}
            </div>
          </div>
        ` : ''}

        <!-- Safety Interlocks & SIS Matrix -->
        <div class="uops-section-block">
          <div class="uops-block-header">
            <div class="uops-bh-title">🛡 مصفوفة الأمان والربط التداخلي للقسم (Safety Instrumented Systems - SIS)</div>
            <div class="uops-bh-hint">الحدود الحرجة وحالات الإغلاق والرحلة الطارئة الآلية لحماية المعدات والبيئة</div>
          </div>
          <div class="uops-interlocks-table-wrap">
            <table class="uops-table">
              <thead>
                <tr>
                  <th>رمز الأمان (Tag)</th>
                  <th>شرط الرحلة الطارئة (Trip Condition)</th>
                  <th>الإجراء التنفيذي الآلي (ESD Action)</th>
                  <th>حالة الحلقة (Status)</th>
                </tr>
              </thead>
              <tbody>
                ${sec.interlocks.map(i => `
                  <tr>
                    <td><span class="uops-tag-badge">${i.tag}</span></td>
                    <td><b>${i.conditionAr}</b></td>
                    <td>${i.actionAr}</td>
                    <td><span class="uops-status-tag ${i.status}">${i.status.toUpperCase()}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section Operating Manual Guide -->
        <div class="uops-section-block">
          <div class="uops-block-header">
            <div class="uops-bh-title">📖 الدليل الإجرائي القياسي لتشغيل القسم (Standard Operating Procedures - SOP)</div>
          </div>
          <div class="uops-sop-grid">
            <div class="uops-sop-card">
              <div class="uops-sop-title">🚀 خطوات الإقلاع والتشغيل الأولي (Startup Procedure)</div>
              <ul class="uops-sop-list">
                ${sec.operatingGuide.startupStepsAr.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>
            <div class="uops-sop-card">
              <div class="uops-sop-title">⏹ خطوات الإيقاف والعزل الآمن (Shutdown Procedure)</div>
              <ul class="uops-sop-list">
                ${sec.operatingGuide.shutdownStepsAr.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>
            <div class="uops-sop-card safety">
              <div class="uops-sop-title">⚠️ إرشادات وتوصيات السلامة والتشغيل الحرج</div>
              <ul class="uops-sop-list">
                ${sec.operatingGuide.safetyNotesAr.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    } else {
      // Light update for live variables
      const kpisGrid = document.getElementById('uops-kpis-grid');
      if (kpisGrid) kpisGrid.innerHTML = this.renderKPIsHTML(sec);

      const statusBadge = document.getElementById('uops-current-status-badge');
      if (statusBadge) statusBadge.innerHTML = this.getStatusBadgeHTML(sec.status);

      const loadVal = document.getElementById('uops-load-val');
      if (loadVal) loadVal.innerHTML = `<b>${sec.loadPct}</b>%`;

      // Update individual controller readings smoothly
      sec.controllers.forEach(c => {
        const pvEl = document.getElementById(`uops-pv-${c.tag}`);
        if (pvEl) pvEl.textContent = c.pv.toFixed(c.decimals);

        const pvBar = document.getElementById(`uops-pvbar-${c.tag}`);
        if (pvBar) {
          const pct = Math.max(0, Math.min(100, ((c.pv - c.min) / (c.max - c.min || 1)) * 100));
          pvBar.style.width = `${pct}%`;
          pvBar.className = `uops-bar-fill ${c.isTripped ? 'tripped' : (c.alarms.h && c.pv >= c.alarms.h ? 'warn' : 'normal')}`;
        }

        const mvVal = document.getElementById(`uops-mv-val-${c.tag}`);
        if (mvVal) mvVal.textContent = `${c.mv.toFixed(1)}%`;

        const mvBar = document.getElementById(`uops-mvbar-${c.tag}`);
        if (mvBar) mvBar.style.width = `${c.mv}%`;

        const tripAlert = document.getElementById(`uops-trip-alert-${c.tag}`);
        if (tripAlert) {
          tripAlert.style.display = c.isTripped ? 'block' : 'none';
        }
      });
    }
  }

  private renderKPIsHTML(sec: UnitSectionData): string {
    return sec.kpis.map(k => `
      <div class="uops-kpi-card ${k.status}">
        <div class="uops-kpi-label">${k.labelAr} <small>${k.labelEn}</small></div>
        <div class="uops-kpi-val-row">
          <span class="uops-kpi-num">${k.value}</span>
          <span class="uops-kpi-unit">${k.unit}</span>
        </div>
      </div>
    `).join('');
  }

  private renderControllersGridHTML(sec: UnitSectionData): string {
    return sec.controllers.map(c => {
      const pvPct = Math.max(0, Math.min(100, ((c.pv - c.min) / (c.max - c.min || 1)) * 100));
      const spPct = Math.max(0, Math.min(100, ((c.sp - c.min) / (c.max - c.min || 1)) * 100));
      const isAlarm = (c.alarms.h && c.pv >= c.alarms.h) || (c.alarms.l && c.pv <= c.alarms.l);

      return `
        <div class="uops-ctrl-card ${c.isTripped ? 'tripped' : isAlarm ? 'alarm' : ''}" id="uops-card-${c.tag}">
          <!-- Card Header -->
          <div class="uops-cc-head">
            <div class="uops-cc-tag-wrap">
              <span class="uops-type-pill ${c.type.toLowerCase()}">${c.type}</span>
              <span class="uops-ctrl-tag">${c.tag}</span>
            </div>
            <div class="uops-mode-switch">
              <button class="uops-mode-btn ${c.mode === 'AUTO' ? 'on' : ''}" onclick="window._uopsSetControllerMode('${sec.id}', '${c.tag}', 'AUTO')">AUTO</button>
              <button class="uops-mode-btn ${c.mode === 'MAN' ? 'on' : ''}" onclick="window._uopsSetControllerMode('${sec.id}', '${c.tag}', 'MAN')">MAN</button>
              <button class="uops-mode-btn ${c.mode === 'CAS' ? 'on' : ''}" onclick="window._uopsSetControllerMode('${sec.id}', '${c.tag}', 'CAS')">CAS</button>
            </div>
          </div>

          <div class="uops-cc-title">${c.nameAr}</div>
          <div class="uops-cc-sub">${c.nameEn}</div>

          <!-- Trip / Alarm Banner -->
          <div class="uops-trip-alert" id="uops-trip-alert-${c.tag}" style="display: ${c.isTripped ? 'block' : 'none'}">
            🚨 تجاوز حدود الأمان (TRIP ALARM)
          </div>

          <!-- Process Variable (PV) Display -->
          <div class="uops-pv-display">
            <div class="uops-meter-label">القراءة الحالية (PV):</div>
            <div class="uops-pv-number-row">
              <span class="uops-pv-big" id="uops-pv-${c.tag}">${c.pv.toFixed(c.decimals)}</span>
              <span class="uops-pv-unit">${c.unit}</span>
            </div>
            <div class="uops-gauge-track">
              <div class="uops-bar-fill ${c.isTripped ? 'tripped' : isAlarm ? 'warn' : 'normal'}" id="uops-pvbar-${c.tag}" style="width: ${pvPct}%"></div>
              <div class="uops-sp-marker" style="left: ${spPct}%" title="Set Point: ${c.sp}"></div>
            </div>
            <div class="uops-range-labels">
              <span>${c.min}</span>
              <span>نطاق القياس</span>
              <span>${c.max}</span>
            </div>
          </div>

          <!-- Set Point (SP) Control Row -->
          <div class="uops-sp-control-row">
            <div class="uops-sp-head">
              <span class="uops-sp-lbl">قيمة الضبط (SP):</span>
              <div class="uops-sp-stepper">
                <button class="uops-step-btn" onclick="window._uopsNudgeSP('${sec.id}', '${c.tag}', -1)">-</button>
                <input type="number" step="${c.decimals === 0 ? 1 : 0.1}" value="${c.sp}" class="uops-sp-input"
                  onchange="window._uopsSetControllerSP('${sec.id}', '${c.tag}', +this.value)">
                <button class="uops-step-btn" onclick="window._uopsNudgeSP('${sec.id}', '${c.tag}', 1)">+</button>
              </div>
            </div>
            <input type="range" min="${c.min}" max="${c.max}" step="${c.decimals === 0 ? 1 : 0.1}" value="${c.sp}"
              class="uops-sp-slider" oninput="window._uopsSetControllerSP('${sec.id}', '${c.tag}', +this.value)">
          </div>

          <!-- Manipulated Variable (MV% / Output Valve) -->
          <div class="uops-mv-row">
            <div class="uops-mv-head">
              <span class="uops-mv-lbl">صمام الخرج (${c.valveTag || 'MV Out'}):</span>
              <span class="uops-mv-val" id="uops-mv-val-${c.tag}">${c.mv.toFixed(1)}%</span>
            </div>
            <div class="uops-mv-track">
              <div class="uops-mv-fill" id="uops-mvbar-${c.tag}" style="width: ${c.mv}%"></div>
            </div>
            ${c.mode === 'MAN' ? `
              <div class="uops-man-slider-wrap">
                <input type="range" min="0" max="100" step="0.5" value="${c.mv}" class="uops-man-slider"
                  oninput="window._uopsSetControllerMV('${sec.id}', '${c.tag}', +this.value)">
              </div>
            ` : ''}
          </div>

          <!-- Faceplate & Tuning Trigger -->
          <div class="uops-cc-actions">
            <button class="uops-btn-faceplate" onclick="window._uopsOpenFaceplate('${sec.id}', '${c.tag}')">
              🎛 الواجهة التفصيلية ومخطط التتبع (Faceplate &amp; PID)
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  private renderDisturbancesHTML(sec: UnitSectionData): string {
    return sec.disturbances.map(d => `
      <div class="uops-dist-card ${d.severity} ${d.applied ? 'applied' : ''}">
        <div class="uops-dist-head">
          <span class="uops-dist-sev ${d.severity}">${d.severity === 'critical' ? '🔴 حرج CRITICAL' : '🟡 متوسط MEDIUM'}</span>
          <button class="uops-dist-btn ${d.applied ? 'active' : ''}" onclick="window._uopsToggleDisturbance('${sec.id}', '${d.id}')">
            ${d.applied ? '✓ الاضطراب مفعّل (إلغاء)' : '⚡ حقن الاضطراب (Inject)'}
          </button>
        </div>
        <div class="uops-dist-title">${d.titleAr}</div>
        <div class="uops-dist-desc">${d.descriptionAr}</div>
        <div class="uops-dist-hint">💡 <b>إجراء الاستعادة الموصى به:</b> ${d.recoveryHintAr}</div>
      </div>
    `).join('');
  }

  // Faceplate Detailed Modal & PID Tuning
  public openFaceplate(secId: SectionId, tag: string) {
    this.selectedFaceplate = { secId, tag };
    const modal = document.getElementById('uops-faceplate-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    this.updateFaceplateModalContent();
  }

  public closeFaceplate() {
    this.selectedFaceplate = null;
    const modal = document.getElementById('uops-faceplate-modal');
    if (modal) modal.style.display = 'none';
    if (this.trendAnimationId) {
      cancelAnimationFrame(this.trendAnimationId);
      this.trendAnimationId = null;
    }
  }

  private updateFaceplateModalContent() {
    if (!this.selectedFaceplate) return;
    const card = document.getElementById('uops-modal-card');
    if (!card) return;

    const sec = unitOpsEngine.getSection(this.selectedFaceplate.secId);
    if (!sec) return;
    const c = sec.controllers.find(item => item.tag === this.selectedFaceplate!.tag);
    if (!c) return;

    card.innerHTML = `
      <div class="uops-modal-header">
        <div class="uops-mh-title">
          <span class="uops-type-pill ${c.type.toLowerCase()}">${c.type}</span>
          <span class="uops-mh-tag">${c.tag}</span>
          <span class="uops-mh-name">${c.nameAr} &bull; ${c.nameEn}</span>
        </div>
        <button class="uops-modal-close" onclick="window._uopsCloseFaceplate()">✕</button>
      </div>

      <div class="uops-modal-body">
        <div class="uops-fp-grid">
          <!-- Left: Real-time Multi-Pen Trend Chart -->
          <div class="uops-fp-chart-col">
            <div class="uops-chart-head">
              <span>📈 مخطط التتبع الزمني الحي (Real-time DCS Trend)</span>
              <div class="uops-trend-legend">
                <span class="leg-sp">■ SP (قيمة الضبط)</span>
                <span class="leg-pv">■ PV (القراءة الحقيقية)</span>
                <span class="leg-mv">■ MV% (الخرج)</span>
              </div>
            </div>
            <div class="uops-canvas-box">
              <canvas id="uops-trend-canvas" width="560" height="240"></canvas>
            </div>
            <div class="uops-fp-desc-box">
              <b>الوظيفة في العملية:</b> ${c.description}
            </div>
          </div>

          <!-- Right: Interactive Tuning & Controls -->
          <div class="uops-fp-controls-col">
            <div class="uops-fp-mode-box">
              <label>نمط التحكم (Control Mode):</label>
              <div class="uops-mode-switch large">
                <button class="uops-mode-btn ${c.mode === 'AUTO' ? 'on' : ''}" onclick="window._uopsSetControllerMode('${sec.id}', '${c.tag}', 'AUTO')">AUTO</button>
                <button class="uops-mode-btn ${c.mode === 'MAN' ? 'on' : ''}" onclick="window._uopsSetControllerMode('${sec.id}', '${c.tag}', 'MAN')">MANUAL</button>
                <button class="uops-mode-btn ${c.mode === 'CAS' ? 'on' : ''}" onclick="window._uopsSetControllerMode('${sec.id}', '${c.tag}', 'CAS')">CASCADE</button>
              </div>
            </div>

            <div class="uops-fp-readings-box">
              <div class="uops-fp-row">
                <span>القراءة الحالية (PV):</span>
                <b class="uops-val-highlight pv">${c.pv.toFixed(c.decimals)} ${c.unit}</b>
              </div>
              <div class="uops-fp-row">
                <span>قيمة الضبط (SP):</span>
                <div class="uops-sp-edit-box">
                  <input type="number" step="${c.decimals === 0 ? 1 : 0.1}" value="${c.sp}"
                    onchange="window._uopsSetControllerSP('${sec.id}', '${c.tag}', +this.value)">
                  <span>${c.unit}</span>
                </div>
              </div>
              <div class="uops-fp-row">
                <span>صمام الخرج (${c.valveTag || 'MV'}):</span>
                <b class="uops-val-highlight mv">${c.mv.toFixed(1)}%</b>
              </div>
            </div>

            <!-- Manual MV Output Adjuster (when in MAN mode) -->
            ${c.mode === 'MAN' ? `
              <div class="uops-fp-man-box">
                <label>التحكم اليدوي المباشر بالصمام (Manual Valve Position):</label>
                <input type="range" min="0" max="100" step="0.5" value="${c.mv}" class="uops-man-slider"
                  oninput="window._uopsSetControllerMV('${sec.id}', '${c.tag}', +this.value)">
              </div>
            ` : ''}

            <!-- PID Tuning Section -->
            <div class="uops-pid-tuning-card">
              <div class="uops-pid-head">⚙ معايير ضبط الـ PID (Tuning Parameters)</div>
              <div class="uops-pid-grid">
                <div class="uops-pid-field">
                  <label>ربح التناسب (Kp - Proportional):</label>
                  <input type="number" step="0.1" min="0.1" max="20" value="${c.pid.kp}" id="uops-pid-kp"
                    onchange="window._uopsUpdatePID('${sec.id}', '${c.tag}')">
                </div>
                <div class="uops-pid-field">
                  <label>زمن التكامل (Ti - Integral Sec):</label>
                  <input type="number" step="1" min="1" max="300" value="${c.pid.ti}" id="uops-pid-ti"
                    onchange="window._uopsUpdatePID('${sec.id}', '${c.tag}')">
                </div>
                <div class="uops-pid-field">
                  <label>زمن التفاضل (Td - Derivative Sec):</label>
                  <input type="number" step="0.1" min="0" max="30" value="${c.pid.td}" id="uops-pid-td"
                    onchange="window._uopsUpdatePID('${sec.id}', '${c.tag}')">
                </div>
              </div>
            </div>

            <!-- Alarm Thresholds -->
            <div class="uops-alarms-card">
              <div class="uops-alarms-head">🔔 حدود الإنذار والرحلة الطارئة (Alarm Limits)</div>
              <div class="uops-alarms-row">
                ${c.alarms.hh !== undefined ? `<span>HH: <b>${c.alarms.hh}</b></span>` : ''}
                ${c.alarms.h !== undefined ? `<span>H: <b>${c.alarms.h}</b></span>` : ''}
                ${c.alarms.l !== undefined ? `<span>L: <b>${c.alarms.l}</b></span>` : ''}
                ${c.alarms.ll !== undefined ? `<span>LL: <b>${c.alarms.ll}</b></span>` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.drawTrendChart(c);
  }

  private drawTrendChart(c: ControllerPoint) {
    const canvas = document.getElementById('uops-trend-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Background Grid
    ctx.fillStyle = '#06101c';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#122538';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    if (!c.history || c.history.length < 2) return;

    const range = c.max - c.min || 1;
    const padding = 20;
    const graphH = h - padding * 2;
    const graphW = w - padding * 2;

    // Helper for PV/SP to Y
    const toY = (val: number) => {
      const norm = (val - c.min) / range;
      return h - padding - norm * graphH;
    };

    // Helper for MV% to Y
    const toYMV = (val: number) => {
      return h - padding - (val / 100) * graphH;
    };

    // 1. Draw SP Line (Yellow/Gold)
    ctx.strokeStyle = '#f5a800';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    c.history.forEach((pt, idx) => {
      const x = padding + (idx / (c.history.length - 1)) * graphW;
      const y = toY(pt.sp);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Draw MV% Line (Teal/Cyan)
    ctx.strokeStyle = '#00e5aa';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    c.history.forEach((pt, idx) => {
      const x = padding + (idx / (c.history.length - 1)) * graphW;
      const y = toYMV(pt.mv);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 3. Draw PV Line (Bright Blue / Alarm Red)
    ctx.strokeStyle = c.isTripped ? '#ff3b30' : '#00c8ef';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    c.history.forEach((pt, idx) => {
      const x = padding + (idx / (c.history.length - 1)) * graphW;
      const y = toY(pt.pv);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  private injectStyles() {
    if (document.getElementById('uops-styles')) return;
    const style = document.createElement('style');
    style.id = 'uops-styles';
    style.textContent = `
      .uops-stage, #unitOpsStage {
        display: flex;
        flex-direction: column !important;
        width: 100%;
        height: 100%;
        min-height: 0;
        background: #030a12;
        color: #e2eef8;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        direction: rtl;
        overflow-y: auto !important;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        touch-action: pan-y;
        overscroll-behavior-y: contain;
        padding: 16px 20px 80px;
        box-sizing: border-box;
      }

      .uops-inner-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        gap: 16px;
        box-sizing: border-box;
      }

      .uops-stage::-webkit-scrollbar, #unitOpsStage::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      .uops-stage::-webkit-scrollbar-track, #unitOpsStage::-webkit-scrollbar-track {
        background: #02080e;
      }
      .uops-stage::-webkit-scrollbar-thumb, #unitOpsStage::-webkit-scrollbar-thumb {
        background: #143557;
        border-radius: 4px;
      }
      .uops-stage::-webkit-scrollbar-thumb:hover, #unitOpsStage::-webkit-scrollbar-thumb:hover {
        background: #00c8ef;
      }

      /* 1. Header & Branding */
      .uops-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(135deg, #071524 0%, #0d2238 100%);
        border: 1px solid #163654;
        border-right: 4px solid #00e5aa;
        border-radius: 8px;
        padding: 14px 20px;
        margin-bottom: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      }

      .uops-logo-badge {
        font-size: 11px;
        font-weight: bold;
        color: #00c8ef;
        margin-bottom: 4px;
      }

      .uops-title {
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
        margin: 0 0 4px;
        display: flex;
        align-items: baseline;
        gap: 10px;
      }

      .uops-title small {
        font-size: 11px;
        color: #00e5aa;
        font-weight: 500;
        font-family: 'Courier New', monospace;
      }

      .uops-subtitle {
        font-size: 11.5px;
        color: #8da4b8;
        margin: 0;
        max-width: 750px;
        line-height: 1.4;
      }

      .uops-author-tag {
        text-align: left;
        direction: ltr;
        background: #05101a;
        border: 1px solid #142a3e;
        padding: 8px 14px;
        border-radius: 6px;
      }

      .uops-author-title {
        display: block;
        font-size: 9px;
        color: #5c7992;
        margin-bottom: 2px;
      }

      .uops-author-name {
        display: block;
        font-size: 11px;
        font-weight: bold;
        color: #00e5aa;
      }

      .uops-author-sub {
        display: block;
        font-size: 8.5px;
        color: #3b5266;
      }

      /* 2. Navigation Tabs Bar */
      .uops-nav-bar {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        touch-action: pan-x;
        padding-bottom: 8px;
        margin-bottom: 16px;
        scrollbar-width: thin;
      }

      .uops-tab-btn {
        flex: 1;
        min-width: 140px;
        background: #081624;
        border: 1px solid #15324d;
        border-radius: 6px;
        padding: 10px 12px;
        text-align: right;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .uops-tab-btn:hover {
        background: #0e243a;
        border-color: #00c8ef;
      }

      .uops-tab-btn.active {
        background: #0f2c47;
        border-color: #00e5aa;
        box-shadow: 0 0 14px rgba(0, 229, 170, 0.25);
      }

      .uops-tab-num {
        font-size: 9px;
        font-weight: 800;
        color: #f5a800;
        font-family: 'Courier New', monospace;
      }

      .uops-tab-name {
        font-size: 12px;
        font-weight: bold;
        color: #ffffff;
        white-space: nowrap;
      }

      .uops-tab-sub {
        font-size: 9.5px;
        color: #728c9f;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .uops-tab-status-wrap {
        margin-top: 4px;
      }

      /* Status Badges */
      .uops-badge-status {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 9.5px;
        font-weight: bold;
        padding: 2px 7px;
        border-radius: 10px;
        font-family: 'Courier New', monospace;
      }

      .uops-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
      }

      .uops-badge-status.running {
        background: rgba(0, 229, 170, 0.15);
        border: 1px solid #00e5aa;
        color: #00e5aa;
      }
      .uops-badge-status.running .uops-dot { background: #00e5aa; box-shadow: 0 0 6px #00e5aa; }

      .uops-badge-status.warming {
        background: rgba(245, 168, 0, 0.15);
        border: 1px solid #f5a800;
        color: #f5a800;
      }
      .uops-badge-status.warming .uops-dot { background: #f5a800; box-shadow: 0 0 6px #f5a800; }

      .uops-badge-status.tripped {
        background: rgba(255, 59, 48, 0.18);
        border: 1px solid #ff3b30;
        color: #ff3b30;
      }
      .uops-badge-status.tripped .uops-dot { background: #ff3b30; box-shadow: 0 0 6px #ff3b30; animation: uopsBlink 0.8s infinite; }

      .uops-badge-status.shutdown {
        background: rgba(114, 140, 159, 0.15);
        border: 1px solid #3d566c;
        color: #728c9f;
      }
      .uops-badge-status.shutdown .uops-dot { background: #5c7992; }

      @keyframes uopsBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }

      /* 3. Section Overview & Control Header */
      .uops-section-head-card {
        display: flex;
        justify-content: space-between;
        background: #081624;
        border: 1px solid #183a5c;
        border-radius: 8px;
        padding: 16px 20px;
        margin-bottom: 16px;
        gap: 20px;
      }

      .uops-sh-left { flex: 1; }
      .uops-sh-tag {
        font-size: 11px;
        color: #00c8ef;
        font-weight: 700;
        margin-bottom: 4px;
        font-family: 'Courier New', monospace;
      }
      .uops-sh-title {
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
        margin: 0 0 8px;
      }
      .uops-sh-equip {
        font-size: 11.5px;
        color: #f5a800;
        margin-bottom: 6px;
      }
      .uops-sh-equip span { color: #e2eef8; font-weight: 600; }
      .uops-sh-desc {
        font-size: 12px;
        color: #8da4b8;
        line-height: 1.5;
        margin: 0;
      }

      .uops-sh-right {
        min-width: 320px;
        background: #05101a;
        border: 1px solid #132a40;
        border-radius: 6px;
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .uops-status-box {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .uops-sb-label {
        font-size: 10px;
        color: #728c9f;
        font-weight: 600;
      }

      .uops-load-meter {
        background: #03080e;
        border: 1px solid #142e47;
        border-radius: 5px;
        padding: 8px 10px;
      }
      .uops-load-head {
        display: flex;
        justify-content: space-between;
        font-size: 10.5px;
        color: #8da4b8;
        margin-bottom: 4px;
      }
      .uops-load-head b { color: #f5a800; font-size: 12px; font-family: 'Courier New', monospace; }

      .uops-range-slider {
        width: 100%;
        accent-color: #00c8ef;
        cursor: pointer;
      }

      .uops-actions-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
      }

      .uops-act-btn {
        padding: 7px 10px;
        border-radius: 4px;
        font-size: 10.5px;
        font-weight: 700;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.15s;
        text-align: center;
      }
      .uops-act-btn.start {
        background: rgba(0, 229, 170, 0.15);
        border-color: #00e5aa;
        color: #00e5aa;
      }
      .uops-act-btn.start:hover { background: #00e5aa; color: #030a12; }

      .uops-act-btn.warm {
        background: rgba(245, 168, 0, 0.15);
        border-color: #f5a800;
        color: #f5a800;
      }
      .uops-act-btn.warm:hover { background: #f5a800; color: #030a12; }

      .uops-act-btn.stop {
        background: rgba(114, 140, 159, 0.15);
        border-color: #3d566c;
        color: #8da4b8;
      }
      .uops-act-btn.stop:hover { background: #3d566c; color: #fff; }

      .uops-act-btn.trip {
        background: rgba(255, 59, 48, 0.18);
        border-color: #ff3b30;
        color: #ff3b30;
      }
      .uops-act-btn.trip:hover { background: #ff3b30; color: #fff; }

      /* 4. Section KPIs */
      .uops-kpis-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 10px;
        margin-bottom: 16px;
      }

      .uops-kpi-card {
        background: #081726;
        border: 1px solid #163654;
        border-radius: 6px;
        padding: 10px 14px;
        transition: all 0.2s;
      }
      .uops-kpi-card.normal { border-right: 3px solid #00e5aa; }
      .uops-kpi-card.warn { border-right: 3px solid #f5a800; background: rgba(245, 168, 0, 0.06); }
      .uops-kpi-card.alarm { border-right: 3px solid #ff3b30; background: rgba(255, 59, 48, 0.1); }

      .uops-kpi-label {
        font-size: 11px;
        color: #8da4b8;
        margin-bottom: 4px;
        display: flex;
        justify-content: space-between;
      }
      .uops-kpi-label small { color: #5c7992; font-family: 'Courier New', monospace; }

      .uops-kpi-val-row {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }
      .uops-kpi-num {
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
        font-family: 'Courier New', monospace;
      }
      .uops-kpi-unit {
        font-size: 10.5px;
        color: #00c8ef;
      }

      /* 5. Controllers Matrix (DCS Faceplates) */
      .uops-section-block {
        background: #071524;
        border: 1px solid #14304c;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
      }

      .uops-block-header {
        border-bottom: 1px solid #132e4a;
        padding-bottom: 10px;
        margin-bottom: 14px;
      }
      .uops-bh-title {
        font-size: 14px;
        font-weight: bold;
        color: #00c8ef;
        margin-bottom: 2px;
      }
      .uops-bh-hint {
        font-size: 10.5px;
        color: #728c9f;
      }

      .uops-controllers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
        gap: 12px;
      }

      .uops-ctrl-card {
        background: #05101a;
        border: 1px solid #163654;
        border-radius: 6px;
        padding: 12px 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        transition: border-color 0.2s, box-shadow 0.2s;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .uops-ctrl-card:hover {
        border-color: #00c8ef;
      }
      .uops-ctrl-card.alarm {
        border-color: #ff3b30;
        background: rgba(255, 59, 48, 0.05);
      }
      .uops-ctrl-card.tripped {
        border-color: #ff3b30;
        box-shadow: 0 0 12px rgba(255, 59, 48, 0.4);
      }

      .uops-cc-head {
        border-bottom: 1px solid #12283e;
        padding-bottom: 6px;
      }
      .uops-cc-tag-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2px;
      }
      .uops-type-pill {
        font-size: 8.5px;
        font-weight: 800;
        padding: 1px 5px;
        border-radius: 3px;
        background: #0d2a45;
        color: #00c8ef;
      }
      .uops-cc-tag {
        font-size: 13px;
        font-weight: 800;
        color: #00e5aa;
        font-family: 'Courier New', monospace;
      }
      .uops-mode-badge {
        font-size: 9px;
        font-weight: 800;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
      }
      .uops-mode-badge.auto { background: #0b3829; color: #00e5aa; border: 1px solid #00e5aa; }
      .uops-mode-badge.man { background: #3d2f09; color: #f5a800; border: 1px solid #f5a800; }
      .uops-mode-badge.cas { background: #0c2b3d; color: #00c8ef; border: 1px solid #00c8ef; }

      .uops-cc-name {
        font-size: 11.5px;
        font-weight: bold;
        color: #ffffff;
      }
      .uops-cc-desc {
        font-size: 9.5px;
        color: #728c9f;
      }

      .uops-cc-trip-alert {
        background: #ff3b30;
        color: #ffffff;
        font-size: 10px;
        font-weight: bold;
        padding: 3px 6px;
        border-radius: 3px;
        text-align: center;
        animation: uopsBlink 0.8s infinite;
      }

      /* Faceplate Dynamic Readings & Bars */
      .uops-cc-readings {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .uops-pv-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }
      .uops-pv-row span { font-size: 10px; color: #8da4b8; }
      .uops-val-lg {
        font-size: 16px;
        font-weight: 800;
        color: #00c8ef;
        font-family: 'Courier New', monospace;
      }
      .uops-unit { font-size: 10px; color: #728c9f; margin-right: 3px; }

      .uops-bar-track {
        position: relative;
        height: 8px;
        background: #03080e;
        border: 1px solid #142e47;
        border-radius: 4px;
        overflow: hidden;
      }
      .uops-bar-fill {
        height: 100%;
        transition: width 0.3s ease;
      }
      .uops-bar-fill.normal { background: linear-gradient(90deg, #00c8ef, #00e5aa); }
      .uops-bar-fill.warn { background: #f5a800; }
      .uops-bar-fill.tripped { background: #ff3b30; }

      .uops-sp-marker {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #f5a800;
        box-shadow: 0 0 4px #f5a800;
      }

      /* Setpoint & Output Controls */
      .uops-cc-sp-ctrl, .uops-cc-mv-ctrl {
        background: #071726;
        border: 1px solid #132e4a;
        border-radius: 4px;
        padding: 6px 8px;
      }

      .uops-sp-head, .uops-mv-head {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: #8da4b8;
        margin-bottom: 4px;
      }
      .uops-sp-head b { color: #f5a800; font-family: 'Courier New', monospace; }
      .uops-mv-head b { color: #00e5aa; font-family: 'Courier New', monospace; }

      .uops-sp-nudge-btns {
        display: flex;
        gap: 4px;
      }
      .uops-nudge-btn {
        flex: 1;
        background: #0d2238;
        border: 1px solid #1c456d;
        color: #f5a800;
        border-radius: 3px;
        font-size: 9.5px;
        font-weight: bold;
        padding: 3px 0;
        cursor: pointer;
      }
      .uops-nudge-btn:hover { background: #f5a800; color: #030a12; }

      .uops-mv-slider {
        width: 100%;
        accent-color: #00e5aa;
        cursor: pointer;
      }

      .uops-cc-modes {
        display: flex;
        gap: 4px;
      }
      .uops-mode-btn {
        flex: 1;
        background: #0a1b2b;
        border: 1px solid #183a5a;
        color: #728c9f;
        padding: 4px 0;
        border-radius: 3px;
        font-size: 9.5px;
        font-weight: bold;
        cursor: pointer;
      }
      .uops-mode-btn.active {
        background: #00c8ef;
        border-color: #00c8ef;
        color: #030a12;
      }

      .uops-cc-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #12283e;
        padding-top: 6px;
      }
      .uops-open-fp-btn {
        background: rgba(0, 200, 239, 0.1);
        border: 1px solid #00c8ef;
        color: #00c8ef;
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 10px;
        font-weight: bold;
        cursor: pointer;
      }
      .uops-open-fp-btn:hover { background: #00c8ef; color: #030a12; }
      .uops-valve-tag {
        font-size: 9.5px;
        color: #5c7992;
        font-family: 'Courier New', monospace;
      }

      /* 6. Disturbance Scenarios */
      .uops-disturbances-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 12px;
      }

      .uops-dist-card {
        background: #05101a;
        border: 1px solid #15324d;
        border-radius: 6px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 8px;
      }
      .uops-dist-card.active {
        border-color: #ff3b30;
        background: rgba(255, 59, 48, 0.08);
      }

      .uops-dist-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .uops-dist-tag { font-size: 9.5px; color: #f5a800; font-weight: bold; }
      .uops-dist-badge {
        font-size: 8.5px;
        font-weight: bold;
        padding: 1px 5px;
        border-radius: 3px;
      }
      .uops-dist-badge.critical { background: rgba(255, 59, 48, 0.2); color: #ff3b30; }
      .uops-dist-badge.medium { background: rgba(245, 168, 0, 0.2); color: #f5a800; }
      .uops-dist-badge.low { background: rgba(0, 200, 239, 0.2); color: #00c8ef; }

      .uops-dist-title { font-size: 12px; font-weight: bold; color: #ffffff; }
      .uops-dist-desc { font-size: 10.5px; color: #8da4b8; line-height: 1.4; }
      .uops-dist-hint {
        font-size: 9.5px;
        color: #00e5aa;
        background: #030910;
        padding: 4px 6px;
        border-radius: 3px;
      }

      .uops-dist-btn {
        width: 100%;
        padding: 6px;
        border-radius: 4px;
        font-size: 10.5px;
        font-weight: bold;
        cursor: pointer;
        border: 1px solid #ff3b30;
        background: rgba(255, 59, 48, 0.15);
        color: #ff3b30;
      }
      .uops-dist-btn.active {
        background: #ff3b30;
        color: #fff;
      }

      /* 7. SIS Table */
      .uops-interlocks-table-wrap {
        overflow-x: auto;
      }
      .uops-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
      }
      .uops-table th {
        background: #05101a;
        color: #00c8ef;
        padding: 8px 10px;
        text-align: right;
        border-bottom: 1px solid #142e47;
      }
      .uops-table td {
        padding: 8px 10px;
        border-bottom: 1px solid #0f2438;
        color: #c4d7e6;
      }
      .uops-tag-badge {
        background: #0b2238;
        color: #00e5aa;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-weight: bold;
      }
      .uops-status-tag {
        font-size: 9px;
        font-weight: bold;
        padding: 2px 6px;
        border-radius: 3px;
      }
      .uops-status-tag.healthy { background: rgba(0, 229, 170, 0.15); color: #00e5aa; }
      .uops-status-tag.armed { background: rgba(245, 168, 0, 0.15); color: #f5a800; }
      .uops-status-tag.tripped { background: rgba(255, 59, 48, 0.2); color: #ff3b30; }

      /* 8. SOP Cards */
      .uops-sop-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 12px;
      }
      .uops-sop-card {
        background: #05101a;
        border: 1px solid #142e47;
        border-radius: 6px;
        padding: 12px 14px;
      }
      .uops-sop-card.safety { border-color: #f5a800; background: rgba(245, 168, 0, 0.03); }
      .uops-sop-title {
        font-size: 12px;
        font-weight: bold;
        color: #00c8ef;
        margin-bottom: 8px;
        border-bottom: 1px solid #10263c;
        padding-bottom: 4px;
      }
      .uops-sop-card.safety .uops-sop-title { color: #f5a800; }
      .uops-sop-list {
        margin: 0;
        padding-right: 18px;
        font-size: 11px;
        color: #8da4b8;
        line-height: 1.6;
      }

      /* 9. Modal Faceplate Dialog */
      .uops-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(1, 6, 12, 0.85);
        backdrop-filter: blur(6px);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .uops-modal-card {
        background: #071726;
        border: 1px solid #00c8ef;
        border-radius: 8px;
        max-width: 720px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
      }

      .uops-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #092036;
        border-bottom: 1px solid #143557;
      }
      .uops-mh-title-wrap {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .uops-modal-close {
        background: none;
        border: 1px solid #1c456d;
        color: #8da4b8;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
      }
      .uops-modal-close:hover { background: #ff3b30; color: #fff; border-color: #ff3b30; }

      .uops-modal-body {
        padding: 16px;
      }

      .uops-fp-details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 16px;
      }

      .uops-trend-canvas {
        width: 100%;
        height: 180px;
        background: #03080e;
        border: 1px solid #142e47;
        border-radius: 6px;
      }

      .uops-trend-legend {
        display: flex;
        gap: 14px;
        font-size: 10px;
        margin-top: 6px;
      }
      .uops-tl-item { display: flex; align-items: center; gap: 4px; }
      .uops-tl-dot { width: 8px; height: 8px; border-radius: 2px; }

      .uops-pid-box {
        background: #040d16;
        border: 1px solid #132a40;
        border-radius: 6px;
        padding: 10px 12px;
      }
      .uops-pid-inputs {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 8px;
        margin-top: 6px;
      }
      .uops-pid-field {
        display: flex;
        flex-direction: column;
        font-size: 10px;
        color: #8da4b8;
      }
      .uops-pid-field input {
        background: #071524;
        border: 1px solid #18385a;
        color: #ffffff;
        padding: 4px 6px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 11px;
        margin-top: 2px;
      }
      .uops-btn-save-pid {
        grid-column: span 3;
        background: #00c8ef;
        border: none;
        color: #030a12;
        padding: 6px;
        border-radius: 4px;
        font-weight: bold;
        font-size: 11px;
        cursor: pointer;
        margin-top: 4px;
      }

      @media (max-width: 900px) {
        .uops-stage, #unitOpsStage {
          padding: 12px 10px 100px;
        }
        .uops-header {
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          padding: 14px 16px;
        }
        .uops-header-right {
          width: 100%;
        }
        .uops-author-tag {
          text-align: right;
          direction: rtl;
        }
        .uops-title {
          font-size: 16px;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }
        .uops-title small {
          font-size: 10.5px;
        }
        .uops-subtitle {
          font-size: 11px;
          line-height: 1.5;
        }
        .uops-section-head-card {
          flex-direction: column;
          padding: 14px 12px;
          gap: 14px;
        }
        .uops-sh-right {
          min-width: 100%;
          padding: 10px 12px;
          box-sizing: border-box;
        }
        .uops-kpis-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        .uops-controllers-grid {
          grid-template-columns: 1fr;
          gap: 10px;
        }
        .uops-disturbances-grid {
          grid-template-columns: 1fr;
        }
        .uops-sop-grid {
          grid-template-columns: 1fr;
        }
        .uops-fp-details-grid {
          grid-template-columns: 1fr;
        }
        .uops-pid-inputs {
          grid-template-columns: 1fr 1fr 1fr;
        }
      }

      @media (max-width: 480px) {
        .uops-stage, #unitOpsStage {
          padding: 8px 6px 110px;
        }
        .uops-header {
          padding: 10px 12px;
          border-radius: 6px;
        }
        .uops-tab-btn {
          min-width: 120px;
          padding: 8px 8px;
        }
        .uops-tab-name {
          font-size: 11px;
        }
        .uops-tab-sub {
          font-size: 8.5px;
        }
        .uops-kpis-grid {
          grid-template-columns: 1fr;
        }
        .uops-actions-group {
          grid-template-columns: 1fr 1fr;
          gap: 4px;
        }
        .uops-act-btn {
          font-size: 9.5px;
          padding: 8px 4px;
        }
        .uops-sh-title {
          font-size: 15px;
        }
        .uops-sh-desc {
          font-size: 11px;
        }
        .uops-table th, .uops-table td {
          padding: 6px 6px;
          font-size: 10px;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

export const unitOpsManager = new UnitOpsManager();

// Attach global helper functions for DOM onclick events
(window as any)._uopsSelectSection = (secId: SectionId) => {
  unitOpsManager.selectSection(secId);
};

(window as any)._uopsSetStatus = (secId: SectionId, status: any) => {
  unitOpsEngine.setSectionStatus(secId, status);
};

(window as any)._uopsSetSectionLoad = (secId: SectionId, load: number) => {
  const sec = unitOpsEngine.sections[secId];
  if (sec) {
    sec.loadPct = load;
    unitOpsManager.renderSectionContent(false);
  }
};

(window as any)._uopsSetControllerMode = (secId: SectionId, tag: string, mode: 'AUTO' | 'MAN' | 'CAS') => {
  unitOpsEngine.updateControllerMode(secId, tag, mode);
};

(window as any)._uopsSetControllerSP = (secId: SectionId, tag: string, sp: number) => {
  unitOpsEngine.updateControllerSP(secId, tag, sp);
};

(window as any)._uopsSetControllerMV = (secId: SectionId, tag: string, mv: number) => {
  unitOpsEngine.updateControllerMV(secId, tag, mv);
};

(window as any)._uopsNudgeSP = (secId: SectionId, tag: string, step: number) => {
  const sec = unitOpsEngine.sections[secId];
  if (!sec) return;
  const c = sec.controllers.find(item => item.tag === tag);
  if (c) {
    const delta = c.decimals === 0 ? step * 10 : step * 1.0;
    unitOpsEngine.updateControllerSP(secId, tag, c.sp + delta);
  }
};

(window as any)._uopsUpdatePID = (secId: SectionId, tag: string) => {
  const kpEl = document.getElementById('uops-pid-kp') as HTMLInputElement;
  const tiEl = document.getElementById('uops-pid-ti') as HTMLInputElement;
  const tdEl = document.getElementById('uops-pid-td') as HTMLInputElement;
  if (kpEl && tiEl && tdEl) {
    unitOpsEngine.updatePID(secId, tag, +kpEl.value, +tiEl.value, +tdEl.value);
  }
};

(window as any)._uopsToggleDisturbance = (secId: SectionId, distId: string) => {
  unitOpsEngine.toggleDisturbance(secId, distId);
};

(window as any)._uopsOpenFaceplate = (secId: SectionId, tag: string) => {
  unitOpsManager.openFaceplate(secId, tag);
};

(window as any)._uopsCloseFaceplate = () => {
  unitOpsManager.closeFaceplate();
};
