import { SECTION_300_EXAM_QUESTIONS, ExamQuestion, SECTION_300_CATEGORIES } from './Section300MasterExam';
import { plantAudio } from './PlantAudio';

export class Section300ExamCenterUI {
  private static instance: Section300ExamCenterUI | null = null;
  private modalEl: HTMLElement | null = null;
  private activeTab: 'exam' | 'manual' | 'stats' = 'exam';
  private currentQuestionIndex: number = 0;
  private userAnswers: (number | null)[] = new Array(SECTION_300_EXAM_QUESTIONS.length).fill(null);
  private selectedCategory: string = 'all';
  private isMobileDrawerOpen: boolean = false;
  private studentName: string = localStorage.getItem('nh3_student_name') || 'مهندس ميكانيك / كيمياوي متدرب';

  public static getInstance(): Section300ExamCenterUI {
    if (!Section300ExamCenterUI.instance) {
      Section300ExamCenterUI.instance = new Section300ExamCenterUI();
    }
    return Section300ExamCenterUI.instance;
  }

  private constructor() {
    if (typeof document !== 'undefined') {
      if (document.body) {
        this.createModalDOM();
      } else {
        document.addEventListener('DOMContentLoaded', () => this.createModalDOM());
      }
    }
  }

  private createModalDOM() {
    if (typeof document === 'undefined') return;
    if (!document.body) return;

    let existingModal = document.getElementById('v3d-sec300-exam-modal');
    if (existingModal) {
      this.modalEl = existingModal;
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'v3d-sec300-exam-modal';
    modal.className = 'v3d-exam-modal';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="v3d-exam-card">
        <!-- Header -->
        <div class="v3d-exam-header" style="border-bottom-color:#f59e0b;">
          <div class="v3d-exam-title-box">
            <button class="v3d-exam-close-btn" id="v3d-sec300-exam-close" title="إغلاق الشاشة">✕</button>
            <div class="v3d-exam-header-txt">
              <h2>⚡ بنك الـ 100 سؤال ودليل تشغيل ضاغط غاز التخليق K-301 والتوربين</h2>
              <small>قسم الكبس والتدوير (Compression & Circulator) — مجمع أسمدة خور الزبير رقم 3</small>
            </div>
            <span class="v3d-exam-badge" style="background:#ffeb3b;color:#04131d;font-weight:bold;">Dwg. 6112P (C-13..C-14)</span>
          </div>

          <div class="v3d-exam-header-tabs">
            <button class="v3d-exam-htab on" id="v3d-sec300-extab-exam">📝 بنك الـ 100 سؤال</button>
            <button class="v3d-exam-htab" id="v3d-sec300-extab-manual">📖 كتيب التشغيل C-13..C-14</button>
            <button class="v3d-exam-htab" id="v3d-sec300-extab-stats">📊 النتيجة والشهادة</button>
          </div>
        </div>

        <!-- Body Area -->
        <div class="v3d-exam-body" id="v3d-sec300-exam-content">
          <!-- Dynamic Content -->
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;

    // Attach Header Tabs & Close
    document.getElementById('v3d-sec300-exam-close')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.close();
    });

    document.getElementById('v3d-sec300-extab-exam')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('exam');
    });

    document.getElementById('v3d-sec300-extab-manual')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('manual');
    });

    document.getElementById('v3d-sec300-extab-stats')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('stats');
    });

    this.injectStyles();
  }

  public open(tab: 'exam' | 'manual' | 'stats' = 'exam', questionIndex: number = 0) {
    if (!this.modalEl || !document.getElementById('v3d-sec300-exam-modal')) {
      this.createModalDOM();
    }
    if (this.modalEl) {
      this.modalEl.style.display = 'flex';
      this.currentQuestionIndex = Math.max(0, Math.min(questionIndex, SECTION_300_EXAM_QUESTIONS.length - 1));
      this.isMobileDrawerOpen = false;
      this.switchTab(tab);
    }
  }

  public close() {
    if (this.modalEl) {
      this.modalEl.style.display = 'none';
      this.isMobileDrawerOpen = false;
    }
  }

  public switchTab(tab: 'exam' | 'manual' | 'stats') {
    this.activeTab = tab;

    // Header buttons
    const bExam = document.getElementById('v3d-sec300-extab-exam');
    const bManual = document.getElementById('v3d-sec300-extab-manual');
    const bStats = document.getElementById('v3d-sec300-extab-stats');

    bExam?.classList.toggle('on', tab === 'exam');
    bManual?.classList.toggle('on', tab === 'manual');
    bStats?.classList.toggle('on', tab === 'stats');

    const container = document.getElementById('v3d-sec300-exam-content');
    if (!container) return;

    if (tab === 'exam') {
      this.renderExamView(container);
    } else if (tab === 'manual') {
      this.renderManualView(container);
    } else if (tab === 'stats') {
      this.renderStatsView(container);
    }
  }

  // =========================================================================
  // 1. RENDER 100-QUESTION EXAM VIEW
  // =========================================================================
  private renderExamView(container: HTMLElement) {
    const q = SECTION_300_EXAM_QUESTIONS[this.currentQuestionIndex];
    const total = SECTION_300_EXAM_QUESTIONS.length;

    // Stats calculations
    const answeredCount = this.userAnswers.filter((a) => a !== null).length;
    const correctCount = this.userAnswers.filter((a, idx) => a !== null && a === SECTION_300_EXAM_QUESTIONS[idx].correctIndex).length;
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    const categories = SECTION_300_CATEGORIES.map((c) => ({
      key: c.id,
      label: c.name
    }));

    const currentAnswer = this.userAnswers[this.currentQuestionIndex];
    const isAnswered = currentAnswer !== null;
    const isCorrect = isAnswered && currentAnswer === q.correctIndex;

    const sidebarHTML = `
      <div class="v3d-sidebar-inner">
        <!-- Close button inside mobile drawer -->
        <div class="v3d-drawer-top">
          <div class="v3d-dt-title" style="color:#ffeb3b;">📑 فهرس أسئلة الضاغط K-301 والتصفية</div>
          <button id="v3d-sec300-close-drawer-btn" class="v3d-drawer-x-btn">✕ إغلاق</button>
        </div>

        <div class="v3d-exam-stats-summary">
          <div class="v3d-ess-box">
            <span class="v3d-ess-val">${answeredCount} / ${total}</span>
            <span class="v3d-ess-lbl">تم حلها</span>
          </div>
          <div class="v3d-ess-box">
            <span class="v3d-ess-val" style="color:#10b981;">${correctCount}</span>
            <span class="v3d-ess-lbl">إجابات صحيحة</span>
          </div>
          <div class="v3d-ess-box">
            <span class="v3d-ess-val" style="color:#ffeb3b;">${accuracy}%</span>
            <span class="v3d-ess-lbl">نسبة الدقة</span>
          </div>
        </div>

        <!-- Category Filter Pills -->
        <div class="v3d-cat-filter-wrap">
          <span class="v3d-filter-header">تصفية حسب المنظومة الهندسية:</span>
          <div class="v3d-cat-pills">
            ${categories.map((c) => `
              <button class="v3d-cat-pill ${this.selectedCategory === c.key ? 'active' : ''}" data-cat="${c.key}">
                ${c.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Question Grid Matrix -->
        <div class="v3d-qmatrix-header">
          <span>جدول الأسئلة (انقر للانتقال المباشر):</span>
          <small>${this.getFilteredQuestions().length} سؤال ظاهر</small>
        </div>
        <div class="v3d-qmatrix-grid">
          ${SECTION_300_EXAM_QUESTIONS.map((item, idx) => {
            const isMatchCat = this.selectedCategory === 'all' || item.category === this.selectedCategory;
            if (!isMatchCat) return '';
            const ans = this.userAnswers[idx];
            let statusClass = 'unanswered';
            if (ans !== null) {
              statusClass = ans === item.correctIndex ? 'correct' : 'wrong';
            }
            const isCurrent = idx === this.currentQuestionIndex ? 'current' : '';
            return `
              <button class="v3d-qm-cell ${statusClass} ${isCurrent}" data-qidx="${idx}" title="سؤال ${item.id}: ${item.arabicCategory}">
                ${item.id}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.innerHTML = `
      <div class="v3d-exam-layout">
        <!-- Desktop Sidebar -->
        <aside class="v3d-exam-sidebar desktop-only">
          ${sidebarHTML}
        </aside>

        <!-- Main Examination Center -->
        <main class="v3d-exam-main-panel">
          <!-- Top Breadcrumb & Mobile Drawer Trigger -->
          <div class="v3d-emp-topbar">
            <div class="v3d-emp-meta">
              <span class="v3d-emp-cat-badge">${q.arabicCategory}</span>
              <span class="v3d-emp-qnum">السؤال ${q.id} من ${total}</span>
              <span class="v3d-emp-eqtag" title="رمز المعدة الهندسية">${q.equipmentRef.toUpperCase()}</span>
            </div>

            <div class="v3d-emp-actions">
              <button id="v3d-sec300-open-drawer-btn" class="v3d-btn-drawer-toggle mobile-only">
                📑 جدول الـ 100 سؤال
              </button>
              <button id="v3d-sec300-reset-exam-btn" class="v3d-btn-reset-exam" title="تصفير الإجابات وبدء الاختبار من جديد">
                🔄 تصفير الاختبار
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="v3d-progress-track">
            <div class="v3d-progress-fill" style="width: ${((this.currentQuestionIndex + 1) / total) * 100}%; background:#ffeb3b;"></div>
          </div>

          <!-- Question Content Box -->
          <div class="v3d-question-box">
            <div class="v3d-question-text">
              <h3>${q.question}</h3>
            </div>

            <!-- Options Grid -->
            <div class="v3d-options-list">
              ${q.options.map((opt, optIdx) => {
                let optClass = 'v3d-opt-btn';
                let icon = '⚪';

                if (isAnswered) {
                  if (optIdx === q.correctIndex) {
                    optClass += ' correct-opt';
                    icon = '✅';
                  } else if (optIdx === currentAnswer) {
                    optClass += ' wrong-opt';
                    icon = '❌';
                  } else {
                    optClass += ' disabled-opt';
                  }
                }

                return `
                  <button class="${optClass}" data-optidx="${optIdx}" ${isAnswered ? 'disabled' : ''}>
                    <span class="v3d-opt-icon">${icon}</span>
                    <span class="v3d-opt-text">${opt}</span>
                    <span class="v3d-opt-key">${['A', 'B', 'C', 'D'][optIdx]}</span>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Explanation & Technical Source Box (Shown after answer) -->
            ${isAnswered ? `
              <div class="v3d-feedback-box ${isCorrect ? 'correct' : 'wrong'}">
                <div class="v3d-fb-header">
                  <span class="v3d-fb-icon">${isCorrect ? '🎉 إجابة صحيحة ومطابقة للكود الهندسي!' : '⚠️ إجابة غير صحيحة — راجع التفسير الفني أدناه:'}</span>
                  <span class="v3d-fb-ref">المصدر: ${q.technicalReference}</span>
                </div>
                <div class="v3d-fb-body">
                  <p><b>التفسير العلمي والميكانيكي:</b> ${q.explanation}</p>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Question Navigation Buttons Footer -->
          <div class="v3d-exam-nav-footer">
            <button id="v3d-sec300-q-prev-btn" class="v3d-qnav-btn prev" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
              ◀ السؤال السابق
            </button>

            <div class="v3d-qnav-center-info">
              <span>نسبة الإنجاز: <b>${Math.round((answeredCount / total) * 100)}%</b></span>
            </div>

            <button id="v3d-sec300-q-next-btn" class="v3d-qnav-btn next" ${this.currentQuestionIndex === total - 1 ? 'disabled' : ''}>
              السؤال التالي ▶
            </button>

            <button id="v3d-sec300-q-next-unsolved-btn" class="v3d-qnav-btn jump-unsolved" title="الانتقال المباشر لأول سؤال لم تتم الإجابة عليه">
              ⏩ السؤال غير المحلول التالي
            </button>
          </div>
        </main>
      </div>

      <!-- Mobile Overlay Drawer Sheet -->
      <div id="v3d-sec300-mobile-drawer" class="v3d-mobile-drawer-sheet ${this.isMobileDrawerOpen ? 'open' : ''}">
        <div class="v3d-drawer-backdrop" id="v3d-sec300-drawer-backdrop"></div>
        <div class="v3d-drawer-panel">
          ${sidebarHTML}
        </div>
      </div>
    `;

    // Attach Event Listeners
    // Mobile Drawer Open / Close
    document.getElementById('v3d-sec300-open-drawer-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.isMobileDrawerOpen = true;
      const drawer = document.getElementById('v3d-sec300-mobile-drawer');
      drawer?.classList.add('open');
    });

    const closeDrawerAction = () => {
      this.isMobileDrawerOpen = false;
      const drawer = document.getElementById('v3d-sec300-mobile-drawer');
      drawer?.classList.remove('open');
    };

    document.getElementById('v3d-sec300-close-drawer-btn')?.addEventListener('click', closeDrawerAction);
    document.getElementById('v3d-sec300-drawer-backdrop')?.addEventListener('click', closeDrawerAction);

    // Option Clicks
    if (!isAnswered) {
      container.querySelectorAll('.v3d-opt-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const optIdx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-optidx') || '0', 10);
          this.userAnswers[this.currentQuestionIndex] = optIdx;
          if (optIdx === q.correctIndex) {
            plantAudio.playSuccess();
          } else {
            plantAudio.playAlert();
          }
          this.renderExamView(container);
        });
      });
    }

    // Question Matrix Cells Click
    container.querySelectorAll('.v3d-qm-cell').forEach((cell) => {
      cell.addEventListener('click', (e) => {
        plantAudio.playClick();
        const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-qidx') || '0', 10);
        this.currentQuestionIndex = idx;
        this.isMobileDrawerOpen = false;
        this.renderExamView(container);
      });
    });

    // Category Filter Pills
    container.querySelectorAll('.v3d-cat-pill').forEach((el) => {
      el.addEventListener('click', (e) => {
        plantAudio.playClick();
        this.selectedCategory = (e.currentTarget as HTMLElement).getAttribute('data-cat') || 'all';
        this.renderExamView(container);
      });
    });

    // Prev Button
    document.getElementById('v3d-sec300-q-prev-btn')?.addEventListener('click', () => {
      if (this.currentQuestionIndex > 0) {
        plantAudio.playClick();
        this.currentQuestionIndex--;
        this.renderExamView(container);
      }
    });

    // Next Button
    document.getElementById('v3d-sec300-q-next-btn')?.addEventListener('click', () => {
      if (this.currentQuestionIndex < SECTION_300_EXAM_QUESTIONS.length - 1) {
        plantAudio.playClick();
        this.currentQuestionIndex++;
        this.renderExamView(container);
      }
    });

    // Next Unsolved
    document.getElementById('v3d-sec300-q-next-unsolved-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      const nextUnsolved = this.userAnswers.findIndex((a, idx) => a === null && idx > this.currentQuestionIndex);
      if (nextUnsolved !== -1) {
        this.currentQuestionIndex = nextUnsolved;
      } else {
        const firstUnsolved = this.userAnswers.findIndex((a) => a === null);
        if (firstUnsolved !== -1) {
          this.currentQuestionIndex = firstUnsolved;
        } else {
          alert('تهانينا! لقد قمت بالإجابة على جميع أسئلة ضاغط K-301 الـ 100 بنجاح.');
        }
      }
      this.renderExamView(container);
    });

    // Reset Exam
    document.getElementById('v3d-sec300-reset-exam-btn')?.addEventListener('click', () => {
      if (confirm('هل أنت متأكد من إعادة ضبط كافة الإجابات وبدء اختبار ضاغط غاز التخليق K-301 من جديد؟')) {
        plantAudio.playClick();
        this.userAnswers = new Array(SECTION_300_EXAM_QUESTIONS.length).fill(null);
        this.currentQuestionIndex = 0;
        this.isMobileDrawerOpen = false;
        this.renderExamView(container);
      }
    });
  }

  // =========================================================================
  // 2. RENDER OPERATIONAL MANUAL VIEW (C-13 & C-14)
  // =========================================================================
  private renderManualView(container: HTMLElement) {
    container.innerHTML = `
      <div class="v3d-manual-layout">
        <div class="v3d-manual-sidebar">
          <div class="v3d-manual-nav-title" style="color:#ffeb3b;">📑 الفهرس التكنولوجي (C-13..C-14)</div>
          <a href="#man-sec3-c13-overview" class="v3d-mnav-link">2.4.a نظرة عامة على قسم الكبس (C-13)</a>
          <a href="#man-sec3-c13-casings" class="v3d-mnav-link">2.4.b هيكل الضاغط K-301 والأجسام الثلاثة (C-13)</a>
          <a href="#man-sec3-c13-antisurge" class="v3d-mnav-link">2.4.c منظومة مانع الارتجاف المستقلة (C-13)</a>
          <a href="#man-sec3-turbine" class="v3d-mnav-link">2.4.d التوربين البخاري الدافع KT-301 (C-13)</a>
          <a href="#man-sec3-coolers" class="v3d-mnav-link">2.4.e المبردات البينية E-301..304 وفواص السحب V-301..304</a>
          <a href="#man-sec3-lube-seals" class="v3d-mnav-link">2.4.f منظومة التزييت والسيل الجاف والاهتزازات</a>
          <a href="#man-sec3-params" class="v3d-mnav-link highlight" style="border-color:#ffeb3b;color:#fef08a;">📊 جدول المطابقة والمعاملات التشغيلية</a>
          <a href="#man-sec3-interlocks" class="v3d-mnav-link">🎛 مصفوفة الإنترلوك والرحلة الطارئة (ESD Matrix)</a>
        </div>

        <div class="v3d-manual-content">
          <!-- Banner -->
          <div class="v3d-man-banner" style="border-left-color:#ffeb3b;">
            <span class="v3d-mb-badge" style="background:#ffeb3b;color:#05101a;">مستند رسمي معتمد — Dwg. 6112P-100-300-00</span>
            <h2>دليل التشغيل والمواصفات التكنولوجية لقسم ضواغط الغاز وضاغط غاز التخليق K-301</h2>
            <p>مجمع أسمدة خور الزبير رقم 3 — صفحات التشغيل الرسمية C-13 و C-14 ومخططات MHI</p>
          </div>

          <!-- Section 2.4.a C-13 Overview -->
          <div class="v3d-man-section" id="man-sec3-c13-overview">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#ffeb3b;color:#04131d;">2.4.a</span>
              <div>
                <h3>نظرة عامة على قسم الكبس (Section 2.4 Compression)</h3>
                <small>الصفحة C-13 من دليل التشغيل المعتمد</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                يضم قسم الكبس في مجمع تصنيع الأمونيا ثلاث ماكينات توربينية كبرى طاردة مركزية (Centrifugal Compressors)، تدار جميعها بواسطة توربينات بخارية متطورة (Driven by Steam Turbines):
              </p>
              <ul>
                <li><b>ضاغط غاز التخليق ومرحلة التدوير (Syn Gas Compressor & Circulator K-301):</b> ماكينة ثلاثية الأجسام (3-casings machine) لكبس غاز التعويض إلى <b>239 kg/cm²G</b> وتدوير غاز حلقة التخليق.</li>
                <li><b>ضاغط هواء العمليات (Process Air Compressor K-302):</b> ماكينة ثلاثية الأجسام (3-casings machine) لكبس الهواء الجوي إلى <b>34 kg/cm²G</b> لتغذية فرن الإصلاح الثانوي R-103.</li>
                <li><b>ضاغط الغاز الطبيعي (Natural Gas Compressor K-303):</b> ماكينة أحادية الجسم (1-casing machine) لكبس غاز التغذية الطبيعي إلى <b>40 kg/cm²G</b> لتغذية أفران الإصلاح.</li>
              </ul>
            </div>
          </div>

          <!-- Section 2.4.b K-301 Casings -->
          <div class="v3d-man-section" id="man-sec3-c13-casings">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#ffeb3b;color:#04131d;">2.4.b</span>
              <div>
                <h3>هيكل الضاغط K-301 والأجسام الثلاثة (K-301 Machine Architecture)</h3>
                <small>دليل التشغيل صفحة C-13 ومخطط PFD 6112P-100-300-00</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                يتكون ضاغط غاز التخليق K-301 من <b>4 مراحل لكبس غاز التعويض (4 Make-up Stages)</b> ومرحلة واحدة متكاملة لتدوير غاز حلقة التخليق (1 Recycle Stage)، موزعة على <b>3 أجسام أسطوانية (3 Casings)</b>:
              </p>
              <div class="v3d-man-callout" style="background:rgba(255,235,59,0.08);border-color:#ffeb3b;">
                <p><b>النص الحرفي من دليل التشغيل (Manual C-13):</b></p>
                <p><i>"The Syn Gas Compressor & Circulator (K-301) consists of 4 make-up stages and 1 recycle stage housed in 3 casings. Each make-up stage has an intercooler to cool down to 43°C and save compression power, and a suction drain separator to protect the compressor from liquid suction troubles. Suction gas enters the L.P. casing at 43°C and 25 kg/cm²G after passing through Precooler E-301 and Precooler Separator V-301. The High Pressure Casing houses the 4th make-up stage and the recycle stage, separated from each other by a diaphragm. Make-up final discharge pressure is about 239 kg/cm²G at normal speed. Compression head of Circulator is designed for 28.6 kg/cm²G at normal speed. First stage suction pressure is maintained at 25 kg/cm²G by turbine speed control."</i></p>
              </div>
              <p>
                <b>تفصيل الأجسام الثلاثة ميكانيكياً:</b>
                <br>• <b>كابينة الضغط المنخفض (LP Casing - Case 1):</b> تستقبل الغاز من V-301 عند 25 kg/cm²G وتضغطه إلى 44.5 kg/cm²G وترسله إلى المبرد E-302 والفاصل V-302.
                <br>• <b>كابينة الضغط المتوسط (MP Casing - Case 2):</b> تستقبل الغاز من V-302 وترفع الضغط في المرحلة الثانية إلى نحو 105-110 kg/cm²G وتدفعه للمبرد E-303 والفاصل V-303.
                <br>• <b>كابينة الضغط العالي والتدوير (HP Casing - Case 3):</b> تضم المرحلة الثالثة والمرحلة الرابعة (ترفع الضغط النهائي إلى 239 kg/cm²G) بالإضافة لعجلة التدوير (Circulator Impeller) التي تعطي رفعاً ضاغطاً قدره 28.6 kg/cm²G، ويفصل بين غاز التعويض وغاز التدوير حاجز ديافرام داخلي ثقيل (Diaphragm).
              </p>
            </div>
          </div>

          <!-- Section 2.4.c Anti-Surge Systems -->
          <div class="v3d-man-section" id="man-sec3-c13-antisurge">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#ffeb3b;color:#04131d;">2.4.c</span>
              <div>
                <h3>منظومة مانع الارتجاف المستقلة (Anti-Surge Control Loops)</h3>
                <small>الدليل C-13 وحماية الآلة من الانهيار الديناميكي</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                نظراً لتباين كثافة الغاز وظروف الانضغاط، تم تصميم ثلاث حلقات مانع ارتجاف مستقلة تماماً (Separate Anti-Surge Controls) تضمن بقاء التدفق أعلى من خط الحد الأدنى الآمن:
              </p>
              <div class="v3d-man-grid3">
                <div class="v3d-mg-card">
                  <h4>1. حلقة المرحلتين 1 و 2 (Stages 1 & 2)</h4>
                  <p>يقاس التدفق عند <b>سحب المرحلة الأولى (1st stage suction)</b> ويتم الحفاظ عليه بإعادة تدوير غاز التعويض المبرد من <b>طرد المرحلة الثانية (2nd stage discharge)</b> عبر صمام مانع الارتجاف السريع FV-301.</p>
                </div>
                <div class="v3d-mg-card">
                  <h4>2. حلقة المرحلتين 3 و 4 (Stages 3 & 4)</h4>
                  <p>يقاس التدفق عند <b>سحب المرحلة الثالثة (3rd stage suction)</b> ويتم الحفاظ عليه بإعادة تدوير غاز التعويض من <b>طرد المرحلة الرابعة (4th stage discharge)</b> عبر صمام مانع الارتجاف FV-302.</p>
                </div>
                <div class="v3d-mg-card">
                  <h4>3. حلقة مرحلة التدوير (Recycle Stage)</h4>
                  <p>يقاس التدفق عند <b>سحب مرحلة التدوير (Recycle suction)</b> ويتم الحفاظ عليه بإعادة غاز التدوير إلى سحب التدوير عبر <b>مكثفات ومبردات مائية (Water-Cooled Condensers)</b> عبر صمام FV-303.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2.4.d Steam Turbine Driver -->
          <div class="v3d-man-section" id="man-sec3-turbine">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#ffeb3b;color:#04131d;">2.4.d</span>
              <div>
                <h3>التوربين البخاري الدافع KT-301 والمكثف السطحي</h3>
                <small>المحرك الرئيسي بقدرة 18.5 MW وشبكة البخار</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                يدار القطار بواسطة التوربين البخاري KT-301 (Multistage Extraction / Condensing):
                <br>• <b>مدخل البخار عالي الضغط HP:</b> 105 kg/cm²G عند 510°C قادماً من مراجل E-108.
                <br>• <b>استخراج البخار المتوسط MP Extraction:</b> يستخرج البخار عند 38 kg/cm²G لتغذية مراجل إعادة الغلي لمحلول كاتاكارب E-201 بمعدل يصل إلى 82 طن/ساعة.
                <br>• <b>عادم التوربين والمكثف السطحي:</b> يتمدد البخار المتبقي حتى ضغط الفراغ 0.10 kg/cm²A في المكثف السطحي المائي أسفل المنصة، وتسحب مضخات المتكثف P-302 الماء النقي لإعادته لشبكة مياه المراجل BFW.
                <br>• <b>التحكم بالسرعة وضغط السحب:</b> يتحكم حاكم السرعة (Woodward Governor) بصمامات البخار ليحافظ على ضغط سحب الضاغط ثابتاً عند <b>25 kg/cm²G</b> عند سرعة دوران طبيعية تقارب 10,000 RPM.
                <br>• <b>جهاز التدوير البطيء Turning Gear:</b> يدور العمود بسرعة 20-30 RPM أثناء الإحماء والتبريد لمنع تقعر العمود الحراري (Thermal Rotor Sag).
              </p>
            </div>
          </div>

          <!-- Section 2.4.e Coolers and Separators -->
          <div class="v3d-man-section" id="man-sec3-coolers">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#ffeb3b;color:#04131d;">2.4.e</span>
              <div>
                <h3>المبردات البينية E-301..304 وفواص السحب V-301..304</h3>
                <small>إزالة حرارة الانضغاط وحماية العجلات من قطرات السوائل</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                <b>هندسة مسارات المبردات (Shell & Tube Design Philosophy):</b>
                <br>• <b>المبرد الأولي E-301:</b> يمر الغاز في <b>الغلاف (Shell Side)</b> لتقليل هبوط الضغط عند ضغط 25 kg/cm²G، ويمر ماء التبريد WC/WCR في <b>الأنابيب (Tube Side)</b> لتسهيل التنظيف الدوري.
                <br>• <b>المبردات اللاحقة E-302 و E-303 و E-315:</b> يمر الغاز عالي الضغط في <b>الأنابيب (Tube Side)</b> لاحتوائه بأمان داخل أنابيب سميكة غير ملحومة، بينما يمر ماء التبريد في الغلاف (Shell Side).
                <br>• <b>عوازل السحب (V-301, V-302, V-303, V-310):</b> أوعية فصل عمودية مزودة بموزعات حلزونية ووسائد سلكية شبكية (Wire Mesh Demisters) تفصل قطرات الماء المتكثفة بنسبة 99.9% لمنع تآكل ريش العجلات الدافعة، ومزودة بمفاتيح حماية LAHH لرحلة الضاغط الفورية في حال ارتفاع السائل.
              </p>
            </div>
          </div>

          <!-- Section 2.4.f Parameters Match Table -->
          <div class="v3d-man-section" id="man-sec3-params">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#ffeb3b;color:#04131d;">📊</span>
              <div>
                <h3>جدول المطابقة الهندسية الشاملة لضاغط غاز التخليق K-301 (PFD & Manual Match)</h3>
                <small>مطابقة تامة مع كتيب التشغيل C-13 ومخطط PFD 6112P-100-300-00</small>
              </div>
            </div>
            <div class="v3d-param-table-wrap">
              <table class="v3d-param-table">
                <thead>
                  <tr>
                    <th>رمز المعدة</th>
                    <th>اسم المعدة بالدليل</th>
                    <th>ضغط الدخول</th>
                    <th>ضغط الخروج</th>
                    <th>الحرارة</th>
                    <th>الملاحظات الهندسية ومطابقة C-13</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>K-301 (LP)</b></td>
                    <td>كابينة الضغط المنخفض (Case 1)</td>
                    <td>25.0 kg/cm²G</td>
                    <td>44.5 kg/cm²G</td>
                    <td>43°C -> 135°C</td>
                    <td>تستقبل الغاز من V-301، يديرها KT-301 بسرعة 10,000 RPM</td>
                  </tr>
                  <tr>
                    <td><b>E-301</b></td>
                    <td>مبرد غاز التخليق الأولي Precooler</td>
                    <td>25.5 kg/cm²G</td>
                    <td>25.0 kg/cm²G</td>
                    <td>135°C -> 43°C</td>
                    <td>الغاز بالشيل / ماء التبريد WC/WCR بالأنابيب (ΔP منخفض)</td>
                  </tr>
                  <tr>
                    <td><b>V-301</b></td>
                    <td>عازل قطرات مبرد السحب Precooler KO Drum</td>
                    <td>25.0 kg/cm²G</td>
                    <td>25.0 kg/cm²G</td>
                    <td>43°C</td>
                    <td>يفصل ماء تفاعل الميثانايتر لحماية عجلات كابينة LP</td>
                  </tr>
                  <tr>
                    <td><b>E-302</b></td>
                    <td>مبرد المرحلة الأولى 1st Stage Cooler</td>
                    <td>44.5 kg/cm²G</td>
                    <td>44.0 kg/cm²G</td>
                    <td>135°C -> 43°C</td>
                    <td>الغاز بالتيوب / ماء التبريد بالشيل (يزيل حرارة انضغاط LP)</td>
                  </tr>
                  <tr>
                    <td><b>V-302</b></td>
                    <td>عازل قطرات المرحلة الأولى 1st Stage Separator</td>
                    <td>44.0 kg/cm²G</td>
                    <td>44.0 kg/cm²G</td>
                    <td>43°C</td>
                    <td>سحب المرحلة الثانية؛ مرتبط بخط مانع الارتجاف FV-301</td>
                  </tr>
                  <tr>
                    <td><b>K-301 (MP)</b></td>
                    <td>كابينة الضغط المتوسط (Case 2)</td>
                    <td>44.0 kg/cm²G</td>
                    <td>110.0 kg/cm²G</td>
                    <td>43°C -> 140°C</td>
                    <td>المرحلة الثانية للكبس؛ متصلة بوصلة ديافرام مرنة</td>
                  </tr>
                  <tr>
                    <td><b>E-303</b></td>
                    <td>مبرد المرحلة الثانية 2nd Stage Cooler</td>
                    <td>110.0 kg/cm²G</td>
                    <td>108.0 kg/cm²G</td>
                    <td>140°C -> 43°C</td>
                    <td>الغاز بالتيوب / ماء التبريد بالشيل</td>
                  </tr>
                  <tr>
                    <td><b>V-303</b></td>
                    <td>عازل قطرات المرحلة الثانية 2nd Stage Separator</td>
                    <td>108.0 kg/cm²G</td>
                    <td>108.0 kg/cm²G</td>
                    <td>43°C</td>
                    <td>سحب المرحلة الثالثة بكابينة HP؛ تفريغ آلي للمتكثف</td>
                  </tr>
                  <tr>
                    <td><b>K-301 (HP)</b></td>
                    <td>كابينة الضغط العالي والتدوير (Case 3)</td>
                    <td>108.0 / 210 kg/cm²G</td>
                    <td>239.0 / 239 kg/cm²G</td>
                    <td>43°C -> 135°C</td>
                    <td>تضم المرحلة 4 وعجلة التدوير يفصل بينهما ديافرام داخلي</td>
                  </tr>
                  <tr>
                    <td><b>KT-301</b></td>
                    <td>التوربين البخاري الدافع Steam Turbine</td>
                    <td>105.0 kg/cm²G (510°C)</td>
                    <td>38 bar MP / 0.1 barA</td>
                    <td>510°C -> 45°C</td>
                    <td>قدرة 18.5 MW، حاكم سرعة يضبط ضغط سحب الضاغط عند 25 kg/cm²G</td>
                  </tr>
                  <tr>
                    <td><b>FV-301</b></td>
                    <td>صمام مانع الارتجاف للمرحلتين 1 و 2</td>
                    <td>طرد المرحلة 2</td>
                    <td>سحب المرحلة 1</td>
                    <td>مبرد</td>
                    <td>سريع الفتح (&lt;1s)، Fail Open لحماية كابينة LP و MP</td>
                  </tr>
                  <tr>
                    <td><b>FV-302</b></td>
                    <td>صمام مانع الارتجاف للمرحلتين 3 و 4</td>
                    <td>طرد المرحلة 4</td>
                    <td>سحب المرحلة 3</td>
                    <td>مبرد</td>
                    <td>سريع الفتح (&lt;1s)، Fail Open لحماية كابينة HP</td>
                  </tr>
                  <tr>
                    <td><b>FV-303</b></td>
                    <td>صمام مانع الارتجاف لمرحلة التدوير</td>
                    <td>طرد التدوير</td>
                    <td>سحب التدوير</td>
                    <td>عبر مكثفات مائية</td>
                    <td>يحمي عجلة تدوير حلقة الأمونيا (Circulator Head 28.6 bar)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Section 2.4.g Interlocks and Trips -->
          <div class="v3d-man-section" id="man-sec3-interlocks">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#ffeb3b;color:#04131d;">2.4.g</span>
              <div>
                <h3>مصفوفة الإنترلوك والإيقاف الاضطراري لقطار الضاغط K-301 (ESD Matrix)</h3>
                <small>الحماية الشاملة للآلة ضد الانهيار الميكانيكي والديناميكي</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>تتم برمجة مصفوفة الإيقاف الاضطراري (Emergency Trip Matrix) لتغلق صمام البخار الرئيسي للتوربين في أقل من 0.2 ثانية وتفتح صمامات مانع الارتجاف بالكامل (100% FO) عند تحقق أي من الشروط التالية:</p>
              <ul>
                <li><b>هبوط ضغط زيت التزييت (Lube Oil Pressure Low-Low PALL):</b> هبوط الضغط عن 1.4 kg/cm²G.</li>
                <li><b>زيادة سرعة التوربين (Turbine Overspeed Trip):</b> وصول السرعة إلى 110-112% (حوالي 11,200 RPM).</li>
                <li><b>ارتفاع الاهتزازات الميكانيكية (Radial Shaft Vibration High-High VAHH):</b> تجاوز الاهتزاز 65 µm (pk-pk) على أي من محامل القطار.</li>
                <li><b>تحرك العمود المحوري (Axial Displacement High-High ZAHH):</b> تحرك العمود بأكثر من ±0.45 mm لحماية محمل الدفع الثرست.</li>
                <li><b>ارتفاع منسوب السائل في فواص السحب (V-301, V-302, V-303 LAHH):</b> لمنع دخول قطرات السائل إلى العجلات الدافعة.</li>
                <li><b>ارتفاع ضغط عادم التوربين / فقدان الفراغ في المكثف السطحي (PAHH):</b> ارتفاع ضغط المكثف عن 0.35 kg/cm²A.</li>
                <li><b>أزرار الطوارئ اليدوية (Emergency Push Buttons):</b> في لوحة السيطرة أو ميدانياً على المنصة.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 3. RENDER STATS & CERTIFICATE VIEW
  // =========================================================================
  private renderStatsView(container: HTMLElement) {
    const total = SECTION_300_EXAM_QUESTIONS.length;
    const answeredCount = this.userAnswers.filter((a) => a !== null).length;
    const correctCount = this.userAnswers.filter((a, idx) => a !== null && a === SECTION_300_EXAM_QUESTIONS[idx].correctIndex).length;
    const wrongCount = answeredCount - correctCount;
    const scorePct = Math.round((correctCount / total) * 100);
    const isPassed = scorePct >= 70;

    container.innerHTML = `
      <div class="v3d-stats-layout">
        <!-- Performance Overview Cards -->
        <div class="v3d-stats-cards">
          <div class="v3d-sc-item">
            <span class="v3d-sc-lbl">مجموع الأسئلة</span>
            <span class="v3d-sc-val">${total}</span>
          </div>
          <div class="v3d-sc-item">
            <span class="v3d-sc-lbl">الأسئلة المحلولة</span>
            <span class="v3d-sc-val" style="color:#38bdf8;">${answeredCount}</span>
          </div>
          <div class="v3d-sc-item">
            <span class="v3d-sc-lbl">الإجابات الصحيحة</span>
            <span class="v3d-sc-val" style="color:#10b981;">${correctCount}</span>
          </div>
          <div class="v3d-sc-item">
            <span class="v3d-sc-lbl">الإجابات الخاطئة</span>
            <span class="v3d-sc-val" style="color:#ef4444;">${wrongCount}</span>
          </div>
          <div class="v3d-sc-item highlight" style="border-color:#ffeb3b;">
            <span class="v3d-sc-lbl">النتيجة الإجمالية</span>
            <span class="v3d-sc-val" style="color:${isPassed ? '#10b981' : '#ef4444'};">${scorePct}%</span>
            <span class="v3d-sc-sub">${isPassed ? '✅ مؤهل للاعتماد الميكانيكي' : '⚠️ يحتاج لمراجعة الدليل الفني'}</span>
          </div>
        </div>

        <!-- Student Certificate Generator Box -->
        <div class="v3d-cert-box">
          <div class="v3d-cert-header">
            <h3>🎓 شهادة إتمام التقييم التخصصي لضاغط غاز التخليق K-301 والتوربين KT-301</h3>
            <p>الهيئة العامة للمهندسين الكيميائيين والميكانيكيين في البصرة — مجمع أسمدة خور الزبير رقم 3</p>
          </div>

          <div class="v3d-cert-input-row">
            <label for="v3d-sec300-student-name">اسم المهندس / المتدرب:</label>
            <input type="text" id="v3d-sec300-student-name" value="${this.studentName}" placeholder="أدخل اسمك الكامل هنا..." />
            <button id="v3d-sec300-save-name-btn" class="v3d-cert-action-btn" style="background:#ffeb3b;color:#04131d;">حفظ الاسم وتحديث الشهادة</button>
          </div>

          <!-- Official Diploma Render -->
          <div class="v3d-diploma-paper" id="v3d-sec300-diploma">
            <div class="v3d-dip-border">
              <div class="v3d-dip-logo">🏭</div>
              <div class="v3d-dip-title">شهادة كفاءة مهنية في ميكانيكا وتشغيل ضواغط غاز التخليق والتوربينات</div>
              <div class="v3d-dip-sub">Professional Proficiency Certificate in Synthesis Gas Compression (Unit 300 / K-301 & KT-301)</div>

              <div class="v3d-dip-body">
                <p>تشهد إدارة التدريب الهندسي بمجمع الأسمدة بأن المهندس:</p>
                <h2 id="v3d-sec300-cert-name-display">${this.studentName}</h2>
                <p>
                  قد أتم بنجاح الاختبار التخصصي الشامل المكون من <b>100 سؤال هندسي وميكانيكي معمق</b>،
                  المشتقة من دليل التشغيل المعتمد (Dwg. 6112P-100-300-00 - صفحة C-13 و C-14)،
                  والخاصة بقطار ضاغط غاز التخليق K-301 ذي الأجسام الثلاثة ومرحلة التدوير (239 kg/cm²G)،
                  والتوربين البخاري الدافع KT-301 (18.5 MW)، ومنظومات مانع الارتجاف المستقلة، والمبردات البينية وفواص السحب.
                </p>

                <div class="v3d-dip-meta">
                  <div class="v3d-dm-col">
                    <span>درجة الامتحان: <b>${scorePct}%</b></span>
                    <span>التقييم: <b>${isPassed ? 'ناجح ومؤهل للتشغيل الميداني' : 'مستمع / تحت التدريب'}</b></span>
                  </div>
                  <div class="v3d-dm-col">
                    <span>التاريخ: <b>${new Date().toLocaleDateString('ar-EG')}</b></span>
                    <span>الرقم المرجعي: <b>NH3-K301-CERT-${Date.now().toString().slice(-6)}</b></span>
                  </div>
                </div>

                <div class="v3d-dip-signatures">
                  <div class="v3d-sig-box">
                    <span>رئيس قسم الآلات الدوارة والتوربينات</span>
                    <b>م. ميكانيك استشاري</b>
                  </div>
                  <div class="v3d-sig-box">
                    <span>المشرف الفني لقطاع الضواغط الكبرى</span>
                    <b>إدارة تشغيل مجمع الأمونيا</b>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="v3d-cert-footer-actions">
            <button id="v3d-sec300-print-cert-btn" class="v3d-btn-print">🖨️ طباعة الشهادة الرسمية أو الحفظ كـ PDF</button>
            <button id="v3d-sec300-back-exam-btn" class="v3d-btn-back-exam" style="border-color:#ffeb3b;color:#fef08a;">📝 العودة للأسئلة لتحسين الدرجة</button>
          </div>
        </div>
      </div>
    `;

    // Event Listeners for Name Save and Print
    document.getElementById('v3d-sec300-save-name-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      const input = document.getElementById('v3d-sec300-student-name') as HTMLInputElement;
      if (input && input.value.trim()) {
        this.studentName = input.value.trim();
        localStorage.setItem('nh3_student_name', this.studentName);
        const nameDisp = document.getElementById('v3d-sec300-cert-name-display');
        if (nameDisp) nameDisp.textContent = this.studentName;
        alert('تم تحديث الاسم في الشهادة بنجاح!');
      }
    });

    document.getElementById('v3d-sec300-print-cert-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      window.print();
    });

    document.getElementById('v3d-sec300-back-exam-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('exam');
    });
  }

  // =========================================================================
  // HELPER: Filter Questions
  // =========================================================================
  private getFilteredQuestions(): ExamQuestion[] {
    if (this.selectedCategory === 'all') {
      return SECTION_300_EXAM_QUESTIONS;
    }
    return SECTION_300_EXAM_QUESTIONS.filter((q) => q.category === this.selectedCategory);
  }

  // =========================================================================
  // STYLES INJECTION (Self-contained, responsive, industrial theme)
  // =========================================================================
  private injectStyles() {
    if (document.getElementById('v3d-sec300-exam-styles')) return;

    const style = document.createElement('style');
    style.id = 'v3d-sec300-exam-styles';
    style.textContent = `
      .v3d-exam-modal {
        position: fixed;
        inset: 0;
        z-index: 99999999;
        background: rgba(3, 10, 18, 0.92);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        box-sizing: border-box;
        direction: rtl;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .v3d-exam-card {
        width: 100%;
        max-width: 1350px;
        height: 94vh;
        background: #05101a;
        border: 2px solid #ffeb3b;
        border-radius: 12px;
        box-shadow: 0 16px 50px rgba(0, 0, 0, 0.85);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .v3d-exam-header {
        background: #071728;
        border-bottom: 2px solid #ffeb3b;
        padding: 12px 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex-shrink: 0;
      }

      .v3d-exam-title-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .v3d-exam-close-btn {
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid #ef4444;
        color: #ef4444;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
      }
      .v3d-exam-close-btn:hover {
        background: #ef4444;
        color: #ffffff;
      }

      .v3d-exam-header-txt h2 {
        margin: 0;
        font-size: 16px;
        color: #ffeb3b;
        font-weight: 800;
      }

      .v3d-exam-header-txt small {
        color: #94a3b8;
        font-size: 11.5px;
      }

      .v3d-exam-badge {
        font-size: 11px;
        font-family: monospace;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: bold;
      }

      .v3d-exam-header-tabs {
        display: flex;
        gap: 8px;
      }

      .v3d-exam-htab {
        background: #0a2138;
        border: 1px solid #163654;
        color: #cbd5e1;
        padding: 6px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
        transition: all 0.15s ease;
      }
      .v3d-exam-htab:hover {
        background: #103254;
        color: #ffffff;
      }
      .v3d-exam-htab.on {
        background: #ffeb3b;
        color: #030c14;
        border-color: #ffeb3b;
      }

      .v3d-exam-body {
        flex: 1;
        overflow: hidden;
        display: flex;
        position: relative;
      }

      /* 1. Exam Layout */
      .v3d-exam-layout {
        display: flex;
        width: 100%;
        height: 100%;
      }

      .v3d-exam-sidebar {
        width: 320px;
        flex-shrink: 0;
        background: #071424;
        border-left: 1px solid #142e47;
        overflow-y: auto;
      }

      .v3d-sidebar-inner {
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .v3d-exam-stats-summary {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
        background: #091a2e;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #153250;
      }
      .v3d-ess-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .v3d-ess-val {
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
        font-family: monospace;
      }
      .v3d-ess-lbl {
        font-size: 10px;
        color: #94a3b8;
      }

      .v3d-cat-filter-wrap {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .v3d-filter-header {
        font-size: 11px;
        color: #ffeb3b;
        font-weight: bold;
      }
      .v3d-cat-pills {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .v3d-cat-pill {
        background: #091a2d;
        border: 1px solid #142e47;
        color: #94a3b8;
        padding: 5px 8px;
        border-radius: 6px;
        text-align: right;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .v3d-cat-pill:hover {
        background: #0e2742;
        color: #ffffff;
      }
      .v3d-cat-pill.active {
        background: rgba(255, 235, 59, 0.18);
        border-color: #ffeb3b;
        color: #fef08a;
        font-weight: bold;
      }

      .v3d-qmatrix-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
        color: #cbd5e1;
        font-weight: bold;
        border-top: 1px solid #153250;
        padding-top: 10px;
      }
      .v3d-qmatrix-header small { color: #ffeb3b; font-family: monospace; }

      .v3d-qmatrix-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 5px;
        max-height: 280px;
        overflow-y: auto;
        padding-right: 4px;
      }
      .v3d-qm-cell {
        height: 32px;
        border-radius: 5px;
        border: 1px solid #142e47;
        background: #091a2d;
        color: #cbd5e1;
        font-weight: bold;
        font-size: 11px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
        font-family: monospace;
      }
      .v3d-qm-cell:hover {
        border-color: #ffeb3b;
        background: #0e2947;
      }
      .v3d-qm-cell.correct {
        background: rgba(16, 185, 129, 0.25);
        border-color: #10b981;
        color: #34d399;
      }
      .v3d-qm-cell.wrong {
        background: rgba(239, 68, 68, 0.25);
        border-color: #ef4444;
        color: #fca5a5;
      }
      .v3d-qm-cell.current {
        box-shadow: 0 0 0 2px #ffeb3b;
      }

      /* Main Exam Center */
      .v3d-exam-main-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        background: #040d16;
        padding: 16px 24px;
        gap: 12px;
      }

      .v3d-emp-topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .v3d-emp-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .v3d-emp-cat-badge {
        background: rgba(255, 235, 59, 0.15);
        border: 1px solid #ffeb3b;
        color: #fef08a;
        font-size: 11px;
        padding: 3px 8px;
        border-radius: 4px;
        font-weight: bold;
      }
      .v3d-emp-qnum {
        font-size: 12px;
        color: #ffffff;
        font-weight: bold;
      }
      .v3d-emp-eqtag {
        font-size: 10px;
        font-family: monospace;
        background: #092036;
        border: 1px solid #173d62;
        color: #38bdf8;
        padding: 2px 6px;
        border-radius: 4px;
      }

      .v3d-emp-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .v3d-btn-drawer-toggle {
        background: #ffeb3b;
        color: #030c14;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 11.5px;
        font-weight: bold;
        cursor: pointer;
      }
      .v3d-btn-reset-exam {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid #163654;
        color: #94a3b8;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.15s;
      }
      .v3d-btn-reset-exam:hover {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
        border-color: #ef4444;
      }

      .v3d-progress-track {
        height: 6px;
        background: #091a2d;
        border-radius: 3px;
        overflow: hidden;
      }
      .v3d-progress-fill {
        height: 100%;
        background: #ffeb3b;
        transition: width 0.25s ease;
      }

      .v3d-question-box {
        background: #071626;
        border: 1px solid #132e47;
        border-radius: 10px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .v3d-question-text h3 {
        margin: 0;
        font-size: 16px;
        line-height: 1.6;
        color: #f8fafc;
        font-weight: 700;
      }

      .v3d-options-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .v3d-opt-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        background: #091e33;
        border: 1px solid #173858;
        padding: 12px 16px;
        border-radius: 8px;
        color: #e2e8f0;
        font-size: 13.5px;
        cursor: pointer;
        text-align: right;
        transition: all 0.15s ease;
      }
      .v3d-opt-btn:hover:not(:disabled) {
        background: #113458;
        border-color: #ffeb3b;
        color: #ffffff;
      }
      .v3d-opt-icon { font-size: 14px; }
      .v3d-opt-text { flex: 1; line-height: 1.4; }
      .v3d-opt-key {
        font-family: monospace;
        font-size: 11px;
        background: rgba(0, 0, 0, 0.35);
        padding: 2px 6px;
        border-radius: 4px;
        color: #94a3b8;
      }

      .v3d-opt-btn.correct-opt {
        background: rgba(16, 185, 129, 0.25) !important;
        border-color: #10b981 !important;
        color: #ffffff !important;
        font-weight: bold;
      }
      .v3d-opt-btn.wrong-opt {
        background: rgba(239, 68, 68, 0.25) !important;
        border-color: #ef4444 !important;
        color: #fca5a5 !important;
      }
      .v3d-opt-btn.disabled-opt {
        opacity: 0.6;
        cursor: default;
      }

      .v3d-feedback-box {
        border-radius: 8px;
        padding: 14px 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .v3d-feedback-box.correct {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid #10b981;
      }
      .v3d-feedback-box.wrong {
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid #ef4444;
      }
      .v3d-fb-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
      }
      .v3d-fb-icon { font-size: 13px; font-weight: bold; }
      .v3d-feedback-box.correct .v3d-fb-icon { color: #34d399; }
      .v3d-feedback-box.wrong .v3d-fb-icon { color: #fca5a5; }
      .v3d-fb-ref { font-size: 11px; color: #94a3b8; font-family: monospace; }
      .v3d-fb-body p { margin: 0; font-size: 12.5px; line-height: 1.6; color: #cbd5e1; }

      .v3d-exam-nav-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-top: auto;
        padding-top: 12px;
        border-top: 1px solid #142e47;
      }
      .v3d-qnav-btn {
        background: #092036;
        border: 1px solid #163654;
        color: #ffffff;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
        transition: all 0.15s;
      }
      .v3d-qnav-btn:hover:not(:disabled) {
        background: #113354;
        border-color: #ffeb3b;
        color: #ffeb3b;
      }
      .v3d-qnav-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .v3d-qnav-btn.jump-unsolved {
        background: rgba(255, 235, 59, 0.15);
        border-color: #ffeb3b;
        color: #fef08a;
      }
      .v3d-qnav-center-info { font-size: 11.5px; color: #94a3b8; }
      .v3d-qnav-center-info b { color: #ffeb3b; font-family: monospace; }

      /* 2. Manual View */
      .v3d-manual-layout {
        display: flex;
        width: 100%;
        height: 100%;
      }
      .v3d-manual-sidebar {
        width: 290px;
        flex-shrink: 0;
        background: #071526;
        border-left: 1px solid #142d47;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        overflow-y: auto;
      }
      .v3d-manual-nav-title {
        font-size: 12px;
        color: #ffeb3b;
        font-weight: bold;
        margin-bottom: 6px;
      }
      .v3d-mnav-link {
        background: #091a2e;
        border: 1px solid #142e47;
        color: #cbd5e1;
        padding: 7px 10px;
        border-radius: 6px;
        font-size: 11px;
        text-decoration: none;
        line-height: 1.4;
        transition: all 0.15s;
      }
      .v3d-mnav-link:hover {
        background: #0f2c4d;
        color: #ffffff;
        border-color: #ffeb3b;
      }
      .v3d-mnav-link.highlight {
        border-color: #ffeb3b;
        color: #fef08a;
        background: rgba(255, 235, 59, 0.12);
        font-weight: bold;
      }

      .v3d-manual-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px 28px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        background: #030a12;
      }
      .v3d-man-banner {
        background: #07182b;
        border-right: 4px solid #ffeb3b;
        padding: 16px 20px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .v3d-mb-badge {
        font-size: 11px;
        font-family: monospace;
        background: #ffeb3b;
        color: #030c14;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: bold;
        align-self: flex-start;
      }
      .v3d-man-banner h2 { margin: 4px 0; font-size: 17px; color: #f8fafc; font-weight: 800; }
      .v3d-man-banner p { margin: 0; font-size: 12px; color: #94a3b8; }

      .v3d-man-section {
        background: #061423;
        border: 1px solid #122b44;
        border-radius: 8px;
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .v3d-man-sec-title {
        display: flex;
        align-items: center;
        gap: 12px;
        border-bottom: 1px solid #122b44;
        padding-bottom: 8px;
      }
      .v3d-mst-num {
        background: #ffeb3b;
        color: #030c14;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 12px;
        font-family: monospace;
      }
      .v3d-man-sec-title h3 { margin: 0; font-size: 15px; color: #ffeb3b; font-weight: 700; }
      .v3d-man-sec-title small { font-size: 11px; color: #94a3b8; }

      .v3d-man-text {
        font-size: 12.5px;
        line-height: 1.7;
        color: #cbd5e1;
      }
      .v3d-man-text p { margin-bottom: 8px; }
      .v3d-man-text ul { padding-right: 20px; margin-bottom: 8px; }
      .v3d-man-text li { margin-bottom: 6px; }

      .v3d-man-callout {
        border-right: 3px solid #ffeb3b;
        padding: 10px 14px;
        border-radius: 6px;
        margin: 10px 0;
      }

      .v3d-man-grid3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-top: 10px;
      }
      .v3d-mg-card {
        background: #091d33;
        border: 1px solid #163654;
        border-radius: 6px;
        padding: 10px 12px;
      }
      .v3d-mg-card h4 { margin: 0 0 6px 0; color: #ffeb3b; font-size: 12px; }
      .v3d-mg-card p { margin: 0; font-size: 11.5px; line-height: 1.5; color: #cbd5e1; }

      .v3d-param-table-wrap {
        overflow-x: auto;
      }
      .v3d-param-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11.5px;
        text-align: right;
      }
      .v3d-param-table th {
        background: #0a2139;
        color: #ffeb3b;
        padding: 8px 10px;
        border: 1px solid #163654;
        font-weight: bold;
      }
      .v3d-param-table td {
        padding: 7px 10px;
        border: 1px solid #163654;
        color: #e2e8f0;
      }
      .v3d-param-table tr:nth-child(even) {
        background: #061729;
      }

      /* 3. Stats & Certificate View */
      .v3d-stats-layout {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        box-sizing: border-box;
      }

      .v3d-stats-cards {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 12px;
      }
      .v3d-sc-item {
        background: #071729;
        border: 1px solid #153250;
        border-radius: 8px;
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 4px;
      }
      .v3d-sc-lbl { font-size: 11px; color: #94a3b8; }
      .v3d-sc-val { font-size: 20px; font-weight: 800; color: #ffffff; font-family: monospace; }
      .v3d-sc-item.highlight {
        background: rgba(255, 235, 59, 0.08);
      }
      .v3d-sc-sub { font-size: 10px; color: #cbd5e1; }

      .v3d-cert-box {
        background: #061423;
        border: 1px solid #142d47;
        border-radius: 10px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .v3d-cert-header h3 { margin: 0; color: #ffeb3b; font-size: 16px; }
      .v3d-cert-header p { margin: 4px 0 0 0; color: #94a3b8; font-size: 11.5px; }

      .v3d-cert-input-row {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        background: #091a2e;
        padding: 10px 14px;
        border-radius: 6px;
      }
      .v3d-cert-input-row label { font-size: 12px; color: #cbd5e1; font-weight: bold; }
      .v3d-cert-input-row input {
        flex: 1;
        min-width: 220px;
        background: #040e1a;
        border: 1px solid #163654;
        color: #ffffff;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 12px;
        font-family: inherit;
      }
      .v3d-cert-action-btn {
        border: none;
        padding: 7px 16px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
      }

      /* Diploma */
      .v3d-diploma-paper {
        background: #040d16;
        border: 2px solid #ffeb3b;
        padding: 16px;
        border-radius: 8px;
        box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.6);
      }
      .v3d-dip-border {
        border: 1px dashed rgba(255, 235, 59, 0.4);
        padding: 24px;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 12px;
        border-radius: 6px;
      }
      .v3d-dip-logo { font-size: 36px; }
      .v3d-dip-title { font-size: 18px; font-weight: 800; color: #ffeb3b; }
      .v3d-dip-sub { font-size: 11px; color: #94a3b8; font-family: monospace; }
      .v3d-dip-body p { margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.7; }
      .v3d-dip-body h2 { margin: 8px 0; color: #ffffff; font-size: 24px; font-weight: 900; }
      .v3d-dip-meta {
        display: flex;
        justify-content: space-around;
        background: #071728;
        padding: 12px;
        border-radius: 6px;
        margin: 12px 0;
        font-size: 12px;
        color: #cbd5e1;
      }
      .v3d-dm-col { display: flex; flex-direction: column; gap: 4px; text-align: right; }
      .v3d-dm-col b { color: #ffeb3b; font-family: monospace; }
      .v3d-dip-signatures {
        display: flex;
        justify-content: space-around;
        margin-top: 16px;
      }
      .v3d-sig-box {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 11px;
        color: #94a3b8;
      }
      .v3d-sig-box b { color: #ffffff; }

      .v3d-cert-footer-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
      }
      .v3d-btn-print {
        background: #10b981;
        border: none;
        color: #030c14;
        padding: 8px 18px;
        border-radius: 6px;
        font-size: 12.5px;
        font-weight: bold;
        cursor: pointer;
      }
      .v3d-btn-back-exam {
        background: rgba(255, 235, 59, 0.15);
        border: 1px solid #ffeb3b;
        color: #fef08a;
        padding: 8px 18px;
        border-radius: 6px;
        font-size: 12.5px;
        font-weight: bold;
        cursor: pointer;
      }

      /* Mobile Drawer */
      .mobile-only { display: none; }
      @media (max-width: 900px) {
        .desktop-only { display: none; }
        .mobile-only {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .v3d-mobile-drawer-sheet {
          position: fixed;
          inset: 0;
          z-index: 999999999;
          display: none;
        }
        .v3d-mobile-drawer-sheet.open { display: block; }
        .v3d-drawer-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
        }
        .v3d-drawer-panel {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 85vw;
          max-width: 360px;
          background: #071322;
          border-left: 2px solid #ffeb3b;
          overflow-y: auto;
        }
        .v3d-drawer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid #163654;
        }
        .v3d-dt-title { font-weight: bold; color: #ffeb3b; font-size: 13px; }
        .v3d-drawer-x-btn {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
        }
        .v3d-stats-cards { grid-template-columns: repeat(2, 1fr); }
      }
    `;

    document.head.appendChild(style);
  }
}

export const section300ExamCenter = Section300ExamCenterUI.getInstance();
