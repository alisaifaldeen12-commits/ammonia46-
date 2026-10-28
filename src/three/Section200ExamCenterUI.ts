import { SECTION_200_EXAM_QUESTIONS, ExamQuestion } from './Section200MasterExam';
import { plantAudio } from './PlantAudio';

export class Section200ExamCenterUI {
  private static instance: Section200ExamCenterUI | null = null;
  private modalEl: HTMLElement | null = null;
  private activeTab: 'exam' | 'manual' | 'stats' = 'exam';
  private currentQuestionIndex: number = 0;
  private userAnswers: (number | null)[] = new Array(SECTION_200_EXAM_QUESTIONS.length).fill(null);
  private selectedCategory: string = 'all';
  private isMobileDrawerOpen: boolean = false;
  private studentName: string = localStorage.getItem('nh3_student_name') || 'مهندس كيميائي متدرب';

  public static getInstance(): Section200ExamCenterUI {
    if (!Section200ExamCenterUI.instance) {
      Section200ExamCenterUI.instance = new Section200ExamCenterUI();
    }
    return Section200ExamCenterUI.instance;
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

    let existingModal = document.getElementById('v3d-sec200-exam-modal');
    if (existingModal) {
      this.modalEl = existingModal;
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'v3d-sec200-exam-modal';
    modal.className = 'v3d-exam-modal';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="v3d-exam-card">
        <!-- Header -->
        <div class="v3d-exam-header">
          <div class="v3d-exam-title-box">
            <button class="v3d-exam-close-btn" id="v3d-sec200-exam-close" title="إغلاق الشاشة">✕</button>
            <div class="v3d-exam-header-txt">
              <h2>🧪 بنك الـ 100 سؤال ودليل تشغيل القسم 200</h2>
              <small>قسم إزالة ثاني أكسيد الكربون (كاتاكارب) والتنقية النهائية — مجمع أسمدة خور الزبير رقم 3</small>
            </div>
            <span class="v3d-exam-badge" style="background:#00e5aa;color:#04131d;">Dwg. 6112P (C-8..C-13)</span>
          </div>

          <div class="v3d-exam-header-tabs">
            <button class="v3d-exam-htab on" id="v3d-sec200-extab-exam">📝 بنك الـ 100 سؤال</button>
            <button class="v3d-exam-htab" id="v3d-sec200-extab-manual">📖 كتيب التشغيل C-8..C-13</button>
            <button class="v3d-exam-htab" id="v3d-sec200-extab-stats">📊 النتيجة والشهادة</button>
          </div>
        </div>

        <!-- Body Area -->
        <div class="v3d-exam-body" id="v3d-sec200-exam-content">
          <!-- Dynamic Content -->
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;

    // Attach Header Tabs & Close
    document.getElementById('v3d-sec200-exam-close')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.close();
    });

    document.getElementById('v3d-sec200-extab-exam')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('exam');
    });

    document.getElementById('v3d-sec200-extab-manual')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('manual');
    });

    document.getElementById('v3d-sec200-extab-stats')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('stats');
    });

    this.injectStyles();
  }

  public open(tab: 'exam' | 'manual' | 'stats' = 'exam', questionIndex: number = 0) {
    if (!this.modalEl || !document.getElementById('v3d-sec200-exam-modal')) {
      this.createModalDOM();
    }
    if (this.modalEl) {
      this.modalEl.style.display = 'flex';
      this.currentQuestionIndex = Math.max(0, Math.min(questionIndex, SECTION_200_EXAM_QUESTIONS.length - 1));
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
    const bExam = document.getElementById('v3d-sec200-extab-exam');
    const bManual = document.getElementById('v3d-sec200-extab-manual');
    const bStats = document.getElementById('v3d-sec200-extab-stats');

    bExam?.classList.toggle('on', tab === 'exam');
    bManual?.classList.toggle('on', tab === 'manual');
    bStats?.classList.toggle('on', tab === 'stats');

    const container = document.getElementById('v3d-sec200-exam-content');
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
    const q = SECTION_200_EXAM_QUESTIONS[this.currentQuestionIndex];
    const total = SECTION_200_EXAM_QUESTIONS.length;

    // Stats calculations
    const answeredCount = this.userAnswers.filter((a) => a !== null).length;
    const correctCount = this.userAnswers.filter((a, idx) => a !== null && a === SECTION_200_EXAM_QUESTIONS[idx].correctIndex).length;
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    const categories = [
      { key: 'all', label: '🌐 كافة الأسئلة (100)' },
      { key: 'catacarb_chemistry', label: '🧪 كيمياء كاتاكارب والمثبط (1-14)' },
      { key: 'absorber_t201', label: '🗼 برج الامتصاص T-201 (15-28)' },
      { key: 'stripper_t202', label: '🔥 برج التجريد ومراجل الغلي (29-42)' },
      { key: 'hydraulic_turbine_p201ht', label: '⚡ التوربين P-201HT والمضخات (43-54)' },
      { key: 'lean_circuit_p202_e204', label: '💧 مضخات ومبادلات Lean (55-66)' },
      { key: 'filtration_antifoam', label: '🛡️ الفلاتر ومانع الرغوة والأكسدة (67-78)' },
      { key: 'overhead_system', label: '❄️ مكثفات القمة وتصدير CO2 (79-88)' },
      { key: 'degasser_methanation', label: '⚛️ عازل V-209 والميثانايتر (89-100)' }
    ];

    const currentAnswer = this.userAnswers[this.currentQuestionIndex];
    const isAnswered = currentAnswer !== null;
    const isCorrect = isAnswered && currentAnswer === q.correctIndex;

    const sidebarHTML = `
      <div class="v3d-sidebar-inner">
        <!-- Close button inside mobile drawer -->
        <div class="v3d-drawer-top">
          <div class="v3d-dt-title">📑 فهرس الـ 100 سؤال والتصفية</div>
          <button id="v3d-sec200-close-drawer-btn" class="v3d-drawer-x-btn">✕ إغلاق</button>
        </div>

        <div class="v3d-exam-stats-summary">
          <div class="v3d-ess-box">
            <span class="v3d-ess-val">${answeredCount} / ${total}</span>
            <span class="v3d-ess-lbl">تم حلها</span>
          </div>
          <div class="v3d-ess-box">
            <span class="v3d-ess-val" style="color:#00e5aa;">${correctCount}</span>
            <span class="v3d-ess-lbl">إجابات صحيحة</span>
          </div>
          <div class="v3d-ess-box">
            <span class="v3d-ess-val" style="color:#f59e0b;">${accuracy}%</span>
            <span class="v3d-ess-lbl">نسبة الدقة</span>
          </div>
        </div>

        <!-- Category Filter Pills -->
        <div class="v3d-cat-filter-wrap">
          <span class="v3d-filter-header">تصفية حسب المنظومة التشغيلية:</span>
          <div class="v3d-cat-pills">
            ${categories.map((c) => `
              <button class="v3d-cat-pill ${this.selectedCategory === c.key ? 'active' : ''}" data-cat="${c.key}">
                ${c.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 100 Question Badges Grid -->
        <div class="v3d-q-grid-title">فهرس الأسئلة (انقر للانتقال المباشر):</div>
        <div class="v3d-q-grid">
          ${SECTION_200_EXAM_QUESTIONS.map((item, idx) => {
            const ans = this.userAnswers[idx];
            let statusClass = 'unanswered';
            if (ans !== null) {
              statusClass = ans === item.correctIndex ? 'correct' : 'wrong';
            }
            const isActive = idx === this.currentQuestionIndex;
            const matchesCat = this.selectedCategory === 'all' || item.category === this.selectedCategory;
            if (!matchesCat) return '';

            return `
              <button class="v3d-qbadge ${statusClass} ${isActive ? 'active' : ''}" data-qidx="${idx}" title="السؤال ${idx + 1}: ${item.arabicCategory}">
                ${idx + 1}
              </button>
            `;
          }).join('')}
        </div>

        <div style="margin-top:14px;text-align:center;">
          <button id="v3d-sec200-reset-exam-btn" class="v3d-btn-reset">↺ إعادة ضبط كافة الإجابات</button>
        </div>
      </div>
    `;

    container.innerHTML = `
      <div class="v3d-exam-layout">
        <!-- Desktop Sidebar -->
        <div class="v3d-exam-sidebar desktop-only">
          ${sidebarHTML}
        </div>

        <!-- Mobile Drawer Overlay -->
        <div id="v3d-sec200-mobile-drawer" class="v3d-mobile-drawer-sheet ${this.isMobileDrawerOpen ? 'open' : ''}">
          <div class="v3d-drawer-backdrop" id="v3d-sec200-drawer-backdrop"></div>
          <div class="v3d-drawer-panel">
            ${sidebarHTML}
          </div>
        </div>

        <!-- Main Question Area -->
        <div class="v3d-exam-main">
          <!-- Mobile Sticky Quick Bar -->
          <div class="v3d-mobile-quickbar">
            <div class="v3d-mq-left">
              <span class="v3d-mq-pill">السؤال ${q.id} من ${total}</span>
              <span class="v3d-mq-acc">دقة: ${accuracy}%</span>
            </div>
            <button id="v3d-sec200-open-drawer-btn" class="v3d-mq-btn">
              <span>📑 فهرس الـ 100 سؤال</span>
              <span class="v3d-mq-badge">${answeredCount}/${total}</span>
            </button>
          </div>

          <!-- Question Meta Header -->
          <div class="v3d-q-meta-bar">
            <div class="v3d-q-num-box">
              <span class="v3d-q-num">السؤال رقم ${q.id} من أصل ${total}</span>
              <span class="v3d-q-type-badge">${q.type === 'fill_blank' ? '✏️ اختبار فراغات' : '🔘 اختيار من متعدد'}</span>
            </div>
            <div class="v3d-q-cat-tag">📌 ${q.arabicCategory}</div>
          </div>

          <!-- Question Body -->
          <div class="v3d-q-card">
            <div class="v3d-q-text">${q.question}</div>

            <!-- Options List -->
            <div class="v3d-q-options">
              ${q.options.map((opt, optIdx) => {
                let optState = '';
                if (isAnswered) {
                  if (optIdx === q.correctIndex) {
                    optState = 'opt-correct';
                  } else if (optIdx === currentAnswer) {
                    optState = 'opt-wrong';
                  } else {
                    optState = 'opt-disabled';
                  }
                }

                return `
                  <div class="v3d-q-opt ${optState}" data-optidx="${optIdx}">
                    <span class="v3d-opt-marker">${String.fromCharCode(65 + optIdx)}</span>
                    <span class="v3d-opt-txt">${opt}</span>
                    ${isAnswered && optIdx === q.correctIndex ? '<span class="v3d-opt-icon">✔ إجابة صحيحة</span>' : ''}
                    ${isAnswered && optIdx === currentAnswer && !isCorrect ? '<span class="v3d-opt-icon wrong">✕ إجابتك غير صحيحة</span>' : ''}
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Feedback & Technical Explanation Box -->
            ${isAnswered ? `
              <div class="v3d-q-feedback-box ${isCorrect ? 'fb-correct' : 'fb-wrong'}">
                <div class="v3d-fb-title">
                  ${isCorrect ? '✅ إجابة نموذجية دقيقة ومطابقة للدليل!' : '⚠️ إجابة غير صحيحة — راجع التفسير الهندسي أدناه:'}
                </div>
                <div class="v3d-fb-explanation">
                  <b>الشرح الفني التخصصي:</b> ${q.explanation}
                </div>
                <div class="v3d-fb-footer">
                  <span class="v3d-fb-ref">📚 المرجع الهندسي: <b>${q.technicalReference}</b></span>
                  <span class="v3d-fb-tag">🏷 كود المعدة في المخطط: <b>${q.equipmentRef.toUpperCase()}</b></span>
                </div>
              </div>
            ` : `
              <div class="v3d-q-hint-box">
                💡 انقر على أحد الخيارات الأربعة أعلاه لتسجيل إجابتك واستعراض الشرح الهندسي المستند لدليل التشغيل C-8 إلى C-13.
              </div>
            `}

            <!-- Navigation Controls -->
            <div class="v3d-q-actions">
              <button id="v3d-sec200-q-prev-btn" class="v3d-btn-nav" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
                ◀ السابق
              </button>

              <button id="v3d-sec200-q-next-unsolved-btn" class="v3d-btn-nav v3d-btn-orange" title="الانتقال إلى السؤال التالي غير المحلول">
                ⏩ السؤال غير المحلول التالي
              </button>

              <button id="v3d-sec200-q-next-btn" class="v3d-btn-nav v3d-btn-primary" ${this.currentQuestionIndex === total - 1 ? 'disabled' : ''}>
                التالي ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindExamEvents(container);
  }

  private bindExamEvents(container: HTMLElement) {
    // Option Click
    container.querySelectorAll('.v3d-q-opt').forEach((el) => {
      el.addEventListener('click', (e) => {
        const optIdx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-optidx') || '0', 10);
        const q = SECTION_200_EXAM_QUESTIONS[this.currentQuestionIndex];
        this.userAnswers[this.currentQuestionIndex] = optIdx;

        if (optIdx === q.correctIndex) {
          plantAudio.playSuccess();
        } else {
          plantAudio.playAlert();
        }

        this.renderExamView(container);
      });
    });

    // Mobile Drawer Open / Close
    document.getElementById('v3d-sec200-open-drawer-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.isMobileDrawerOpen = true;
      const drawer = document.getElementById('v3d-sec200-mobile-drawer');
      if (drawer) drawer.classList.add('open');
    });

    const closeDrawer = () => {
      this.isMobileDrawerOpen = false;
      const drawer = document.getElementById('v3d-sec200-mobile-drawer');
      if (drawer) drawer.classList.remove('open');
    };

    document.getElementById('v3d-sec200-close-drawer-btn')?.addEventListener('click', closeDrawer);
    document.getElementById('v3d-sec200-drawer-backdrop')?.addEventListener('click', closeDrawer);

    // Question Grid Badges Jump
    container.querySelectorAll('.v3d-qbadge').forEach((el) => {
      el.addEventListener('click', (e) => {
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
    document.getElementById('v3d-sec200-q-prev-btn')?.addEventListener('click', () => {
      if (this.currentQuestionIndex > 0) {
        plantAudio.playClick();
        this.currentQuestionIndex--;
        this.renderExamView(container);
      }
    });

    // Next Button
    document.getElementById('v3d-sec200-q-next-btn')?.addEventListener('click', () => {
      if (this.currentQuestionIndex < SECTION_200_EXAM_QUESTIONS.length - 1) {
        plantAudio.playClick();
        this.currentQuestionIndex++;
        this.renderExamView(container);
      }
    });

    // Next Unsolved
    document.getElementById('v3d-sec200-q-next-unsolved-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      const nextUnsolved = this.userAnswers.findIndex((a, idx) => a === null && idx > this.currentQuestionIndex);
      if (nextUnsolved !== -1) {
        this.currentQuestionIndex = nextUnsolved;
      } else {
        const firstUnsolved = this.userAnswers.findIndex((a) => a === null);
        if (firstUnsolved !== -1) {
          this.currentQuestionIndex = firstUnsolved;
        } else {
          alert('تهانينا! لقد قمت بالإجابة على جميع الأسئلة الـ 100 بنجاح.');
        }
      }
      this.renderExamView(container);
    });

    // Reset Exam
    document.getElementById('v3d-sec200-reset-exam-btn')?.addEventListener('click', () => {
      if (confirm('هل أنت متأكد من إعادة ضبط كافة الإجابات وبدء اختبار القسم 200 من جديد؟')) {
        plantAudio.playClick();
        this.userAnswers = new Array(SECTION_200_EXAM_QUESTIONS.length).fill(null);
        this.currentQuestionIndex = 0;
        this.isMobileDrawerOpen = false;
        this.renderExamView(container);
      }
    });
  }

  // =========================================================================
  // 2. RENDER OPERATIONAL MANUAL & PARAMETERS MATCH VIEW (C-8..C-13)
  // =========================================================================
  private renderManualView(container: HTMLElement) {
    container.innerHTML = `
      <div class="v3d-manual-layout">
        <div class="v3d-manual-sidebar">
          <div class="v3d-manual-nav-title">📑 الفهرس التكنولوجي (C-8..C-13)</div>
          <a href="#man-sec2-c8" class="v3d-mnav-link">2.3.a امتصاص CO2 بنظام كاتاكارب (C-8)</a>
          <a href="#man-sec2-c9" class="v3d-mnav-link">2.3.b تجريد المحلول ومراجل إعادة الغلي (C-9)</a>
          <a href="#man-sec2-c10" class="v3d-mnav-link">2.3.c التوربين P-201HT وحلقة Semi-Lean (C-10)</a>
          <a href="#man-sec2-c11" class="v3d-mnav-link">2.3.d حلقة Lean ومثبط الفاناديوم والفلترة (C-11)</a>
          <a href="#man-sec2-c12" class="v3d-mnav-link">2.3.e مكثفات القمة E-205 وتصدير CO2 (C-12)</a>
          <a href="#man-sec2-c13" class="v3d-mnav-link">2.3.f عازل V-204 والميثانايتر R-106 (C-12/C-13)</a>
          <a href="#man-sec2-params" class="v3d-mnav-link highlight">📊 جدول المطابقة والمعاملات التشغيلية</a>
          <a href="#man-sec2-loops" class="v3d-mnav-link">🎛 حلقات السيطرة والمتحكمات الرئيسية</a>
        </div>

        <div class="v3d-manual-content">
          <!-- Banner -->
          <div class="v3d-man-banner">
            <span class="v3d-mb-badge">مستند رسمي معتمد — Dwg. 6112P-100-200-00</span>
            <h2>دليل التشغيل والمواصفات التكنولوجية لقسم إزالة ثاني أكسيد الكربون (كاتاكارب)</h2>
            <p>مجمع أسمدة خور الزبير رقم 3 — صفحات التشغيل الرسمية C-8 و C-9 و C-10 و C-11 و C-12 و C-13</p>
          </div>

          <!-- Section 2.3.a C-8 -->
          <div class="v3d-man-section" id="man-sec2-c8">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num">2.3.a</span>
              <div>
                <h3>امتصاص ثاني أكسيد الكربون بنظام كاتاكارب (Catacarb Absorption)</h3>
                <small>الصفحة C-8 من دليل التشغيل المعتمد</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                تعتمد عملية كاتاكارب (Catacarb Process) على الامتصاص الكيميائي الانتقائي لغاز ثاني أكسيد الكربون في محلول ساخن من <b>كربونات البوتاسيوم (Hot Potassium Carbonate - K₂CO₃)</b> المنشط بمادة حفازة خاصة لتسريع معدل ترطيب وامتصاص الغاز، والمضاف إليه <b>مركب الفاناديوم (Vanadium Corrosion Inhibitor)</b> لحماية معدن الكربون ستيل من التآكل وتكوين طبقة أكسيد حامية غير منفذة.
              </p>
              <div class="v3d-chem-box">
                <div class="v3d-cb-title">معادلة الامتصاص الكيميائي العكوسة:</div>
                <div class="v3d-cb-eq">K₂CO₃ + CO₂ + H₂O ⇌ 2 KHCO₃ &nbsp;&nbsp; (طارد للحرارة Exothermic)</div>
                <div class="v3d-cb-desc">تتم عملية الامتصاص عند ضغط يقارب <b>27 kg/cm²G</b> حيث ينخفض تركيز CO₂ في الغاز من حوالي 18% إلى <b>0.1% على الأساس الجاف (About 0.1% Dry Basis)</b>.</div>
              </div>
              <p>
                يخرج الغاز المعالج النظيف من قمة برج الامتصاص T-201 ليتجه مباشرة إلى وعاء حجز القطرات V-204 ومنه إلى قسم الميثنة (Methanation) لتحويل البقايا إلى ميثان غير ضار.
              </p>
            </div>
          </div>

          <!-- Section 2.3.b C-9 -->
          <div class="v3d-man-section" id="man-sec2-c9">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num">2.3.b</span>
              <div>
                <h3>تجريد المحلول واسترجاع الطاقة في T-202 ومراجل الغلي E-201 و E-202</h3>
                <small>الصفحة C-9 من دليل التشغيل المعتمد</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                تتم استعادة المحلول وفصل غاز CO₂ في برج التجريد <b>T-202 (CO₂ Regenerator)</b> العامل عند ضغط منخفض جداً يقارب <b>0.7 kg/cm²G</b> بواسطة بخار التجريد الصاعد من مراجل إعادة الغلي (Reboilers).
              </p>
              <div class="v3d-param-grid">
                <div class="v3d-pg-card">
                  <span class="v3d-pgc-lbl">المرجل الرئيسي E-201</span>
                  <span class="v3d-pgc-val">90% من حرارة التجريد</span>
                  <p>يزودها غاز العملية القادم من مفاعل التحويل الواطئ؛ يدخل الغاز للمرجل عند <b>185°C</b> بعد إزالة تحميصه بحقن المتكثف.</p>
                </div>
                <div class="v3d-pg-card">
                  <span class="v3d-pgc-lbl">المرجل البخاري E-202</span>
                  <span class="v3d-pgc-val">10% من حرارة التجريد</span>
                  <p>يزودها بخار بضغط <b>3 kg/cm²G</b> للضبط الحراري الدقيق وتأمين التجريد أثناء انخفاض حمل المصنع.</p>
                </div>
                <div class="v3d-pg-card">
                  <span class="v3d-pgc-lbl">حقن المتكثف P-206 A/B</span>
                  <span class="v3d-pgc-val">Desuperheating Injection</span>
                  <p>تسحب مضخات P-206 المتكثف من عازل V-201 وتحقنه في غاز العملية قبل E-201 لتعديل درجة الحرارة بدقة.</p>
                </div>
                <div class="v3d-pg-card">
                  <span class="v3d-pgc-lbl">تغذية البرج T-201</span>
                  <span class="v3d-pgc-val">127°C Gas Feed</span>
                  <p>يخرج الغاز المبرد من فاصل المرجل V-201 ليدخل إلى قاع برج الامتصاص T-201 عند <b>127°C</b>.</p>
                </div>
              </div>
              <p>
                ينفصل متكثف غاز العملية في V-201، ويذهب المتكثف إلى برج نزع الغازات <b>V-209</b> ليجرد بواسطة منفاخ الهواء <b>K-201</b> ثم يضخ بواسطة <b>P-208</b> إلى برج التبريد.
              </p>
            </div>
          </div>

          <!-- Section 2.3.c C-10 -->
          <div class="v3d-man-section" id="man-sec2-c10">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num">2.3.c</span>
              <div>
                <h3>التوربين الهيدروليكي P-201HT ومضخات المحلول شبه المنقى P-201 A/B</h3>
                <small>الصفحة C-10 من دليل التشغيل المعتمد</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                يخرج المحلول الغني (Rich Solution) من قاع برج الامتصاص T-201 عند <b>112°C وضغط 27 kg/cm²G</b>. وللاستفادة من هذا الضغط الهائل، يمرر المحلول عبر صمام السيطرة <b>LRC-202-1V</b> ليدير <b>التوربين الهيدروليكي P-201HT</b>.
              </p>
              <ul>
                <li><b>التكامل الميكانيكي:</b> يتصل التوربين P-201HT على عمود مشترك مع المحرك الكهربائي ومضخة المحلول شبه المنقى P-201A، مما يوفر أكثر من 50% من استهلاك الطاقة الكهربائية.</li>
                <li><b>صمام التجاوز LRC-202-2V:</b> يعمل بنظام التحكم المنقسم (Split-range) لتمرير الفائض من المحلول الغني متجاوزاً التوربين ليصب في خط الصعود إلى قمة T-202.</li>
                <li><b>سحب تيار Semi-Lean:</b> يُسحب المحلول شبه المنقى من الصينية الوسطى لبرج التجريد T-202 عند <b>114°C</b> بواسطة P-201 A/B.</li>
                <li><b>مبرد Semi-Lean E-207:</b> يبرد المحلول من <b>114°C إلى 105°C</b> بواسطة مياه التبريد، ثم يضخ بضغط <b>28 kg/cm²G</b> إلى منتصف T-201 فوق الأقسام المحشوة السفلية الثلاثة.</li>
              </ul>
            </div>
          </div>

          <!-- Section 2.3.d C-11 -->
          <div class="v3d-man-section" id="man-sec2-c11">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num">2.3.d</span>
              <div>
                <h3>حلقة المحلول المنقى Lean ومثبط الفاناديوم والفلترة والموازنة المائية</h3>
                <small>الصفحة C-11 من دليل التشغيل المعتمد</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                يستقر في قاع T-202 محلول منقى تماماً وعالي النقاوة (Very Lean Solution) عند <b>120°C</b>:
              </p>
              <ul>
                <li><b>مبادل مياه المراجل E-204:</b> يبرد المحلول المنقى إلى <b>80°C</b> مسخناً مياه تغذية المراجل BFW. ويتم التحكم بالحرارة بدقة بواسطة خط تجاوز مياه المراجل والمتحكم <b>TIC-203</b>.</li>
                <li><b>مضخات Lean P-202 A/B:</b> تضخ المحلول المبرد (80°C) بضغط <b>28.5 kg/cm²G</b> إلى قمة برج الامتصاص T-201 لإجراء التنقية النهائية لـ CO₂.</li>
                <li><b>فلتر المحلول F-201:</b> يمر تيار جانبي (Side Stream) من خط دفع P-202 عبر الفلتر F-201 لاصطياد الشوائب وقشور الصدأ ومنع انسداد الرشاشات.</li>
                <li><b>أكسدة مثبط الفاناديوم (FIC-206):</b> يحقن تيار هواء محكوم من ضاغط هواء العملية عبر FIC-206 عند مخرج التوربين P-201HT لإبقاء الفاناديوم في حالته خماسية التكافؤ النشطة (Active Pentavalent V⁵⁺).</li>
                <li><b>حقن مانع الرغوة P-205 A/B:</b> تحقن المضخات جرعات دقيقة من مادة مانع الرغوة من الخزان V-206 في خطوط المحلول لمنع حدوث الفوران في الأبراج.</li>
                <li><b>صواني الغسيل والموازنة المائية:</b> يحتوي أعلى T-202 على <b>4 صواني غسيل (4 Wash Trays)</b> تستقبل المتكثف الحامضي الراجع من V-203 لمنع تطاير أملاح البوتاسيوم.</li>
              </ul>
            </div>
          </div>

          <!-- Section 2.3.e C-12 -->
          <div class="v3d-man-section" id="man-sec2-c12">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num">2.3.e</span>
              <div>
                <h3>مكثفات القمة E-205 A/B، فاصل V-203، وتصدير غاز CO₂ إلى قسم اليوريا</h3>
                <small>الصفحة C-12 من دليل التشغيل المعتمد</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                تخرج أبخرة غاز ثاني أكسيد الكربون المشبعة ببخار الماء من أعلى برج التجريد T-202 عند <b>97°C</b> وتدخل إلى:
              </p>
              <ul>
                <li><b>مكثفات القمة E-205 A/B:</b> تبرد الغاز من <b>97°C إلى 50°C</b> بمياه التبريد لتكثيف بخار الماء المرافق.</li>
                <li><b>فاصل الغاز الحامضي V-203:</b> يفصل المتكثف المائي عن غاز CO₂. يعاد المتكثف كغسيل راجع لقمة T-202 أو يرسل الفائض عبر <b>P-203 A/B</b> إلى برج نزع الغازات V-209.</li>
                <li><b>تصدير CO₂ إلى قسم اليوريا:</b> يصدر غاز CO₂ النقي (99.9%) بمعدل تصميمي يقارب <b>61,000 kg/h</b> إلى وحدة اليوريا، ويتم التحكم بضغط النظام وتنفيس الفائض بواسطة الصمام <b>PIC-202</b>.</li>
                <li><b>خزانات الحفظ V-205 و V-207:</b> خزان الحفظ V-205 مزود بملف بخاري لحفظ المحلول فوق 50°C لمنع التبلور، وحوض التجميع V-207 ومضخته P-204 لتجميع واسترجاع أي تسريب.</li>
              </ul>
            </div>
          </div>

          <!-- Section 2.3.f C-12 & C-13 -->
          <div class="v3d-man-section" id="man-sec2-c13">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num">2.3.f</span>
              <div>
                <h3>عازل V-204، مفاعل الميثانايتر R-106، ومبردات غاز التخليق (C-12 & C-13)</h3>
                <small>الصفحتان C-12 و C-13 من دليل التشغيل المعتمد</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                <b>وعاء عزل قمة الامتصاص V-204 (Absorber Overhead Knockout Drum):</b> يمر الغاز المعالج الخارج من قمة T-201 عبر V-204 لاصطياد أي رذاذ أو قطرات محمولة من محلول كربونات البوتاسيوم لحماية محفز النيكل في الميثانايتر من التسمم القاتل.
              </p>
              <div class="v3d-chem-box">
                <div class="v3d-cb-title">تفاعلات الميثنة في المفاعل R-106 (Methanator):</div>
                <div class="v3d-cb-eq">CO + 3 H₂ ⇌ CH₄ + H₂O &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; CO₂ + 4 H₂ ⇌ CH₄ + 2 H₂O</div>
                <div class="v3d-cb-desc">تفاعلات طاردة للحرارة بشدة؛ يسخن الغاز في E-106 و E-107 إلى <b>310°C (TIC-124)</b>، وتنخفض أكاسيد الكربون إلى <b>أقل من 10 ppm</b>.</div>
              </div>
              <p>
                <b>تركيب الغاز المعالج الجاف المتجه للضاغط K-301:</b>
                <br>• هيدروجين H₂: <b>74.06%</b>
                <br>• نيتروجين N₂: <b>24.69%</b>
                <br>• ميثان CH₄: <b>0.85%</b>
                <br>• أرغون Ar: <b>0.42%</b>
                <br>• أكاسيد الكربون (CO + CO₂): <b>< 10 ppm</b>
              </p>
              <p>
                يمر الغاز بعد R-106 عبر مبرد غاز التخليق <b>E-301</b> والفاصل <b>V-301</b> لفصل الماء الناتج من تفاعل الميثنة قبل دخوله إلى ضاغط غاز التخليق <b>K-301</b>.
              </p>
            </div>
          </div>

          <!-- Section 2 Operating Parameters Table -->
          <div class="v3d-man-section" id="man-sec2-params">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num">📊</span>
              <div>
                <h3>جدول المطابقة الهندسية الشامل لقسم إزالة CO₂ (القسم 200)</h3>
                <small>مطابقة تامة وشاملة مع المخطط PFD ودليل التشغيل C-8 إلى C-13</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <div class="v3d-table-responsive">
                <table class="v3d-ptable">
                  <thead>
                    <tr>
                      <th>رمز المعدة</th>
                      <th>اسم المعدة بالعربية</th>
                      <th>درجة الحرارة التصميمية</th>
                      <th>الضغط التشغيلي</th>
                      <th>الدور الهندسي في العملية</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><b>T-201</b></td>
                      <td>برج امتصاص كاتاكارب</td>
                      <td>127°C قاع / 105°C وسط / 80°C قمة</td>
                      <td>27.0 kg/cm²G</td>
                      <td>امتصاص CO₂ ثنائي المراحل وخفضه إلى 0.1% جاف</td>
                    </tr>
                    <tr>
                      <td><b>T-202</b></td>
                      <td>برج تجريد واسترجاع CO₂</td>
                      <td>120°C قاع / 114°C وسط / 97°C قمة</td>
                      <td>0.7 kg/cm²G</td>
                      <td>تجريد المحلول بالحرارة وتوليد CO₂ عالي النقاوة</td>
                    </tr>
                    <tr>
                      <td><b>E-201</b></td>
                      <td>مرجل إعادة غلي كاتاكارب</td>
                      <td>185°C دخول غاز / 120°C خروج غاز</td>
                      <td>28.0 kg/cm²G غاز / 0.7 kg/cm²G محلول</td>
                      <td>تأمين 90% من حرارة التجريد بغاز العملية</td>
                    </tr>
                    <tr>
                      <td><b>E-202</b></td>
                      <td>مرجل الغلي البخاري الإضافي</td>
                      <td>143°C بخار / 120°C غليان المحلول</td>
                      <td>3.0 kg/cm²G بخار / 0.7 kg/cm²G محلول</td>
                      <td>تأمين 10% المتبقية من حرارة التجريد بالبخار</td>
                    </tr>
                    <tr>
                      <td><b>P-201HT</b></td>
                      <td>توربين استرجاع الطاقة الهيدروليكية</td>
                      <td>112°C محلول غني</td>
                      <td>27.0 kg/cm²G مدخل ➔ 0.7 kg/cm²G مخرج</td>
                      <td>استرجاع الطاقة الميكانيكية وتدوير عمود P-201A</td>
                    </tr>
                    <tr>
                      <td><b>P-201 A/B</b></td>
                      <td>مضخات المحلول شبه المنقى</td>
                      <td>114°C سحب</td>
                      <td>0.7 kg/cm²G سحب ➔ 28.0 kg/cm²G دفع</td>
                      <td>ضخ ~75% من المحلول إلى منتصف برج T-201</td>
                    </tr>
                    <tr>
                      <td><b>E-207</b></td>
                      <td>مبرد المحلول شبه المنقى</td>
                      <td>114°C مدخل ➔ 105°C مخرج</td>
                      <td>28.0 kg/cm²G جانب الأنابيب</td>
                      <td>تبريد تيار Semi-Lean بمياه التبريد قبل T-201</td>
                    </tr>
                    <tr>
                      <td><b>E-204</b></td>
                      <td>مبادل مياه المراجل ومحلول Lean</td>
                      <td>120°C مدخل ➔ 80°C مخرج المحلول</td>
                      <td>0.7 kg/cm²G قشرة / 42 kg/cm²G أنابيب</td>
                      <td>تبريد المحلول المنقى وتسخين مياه تغذية المراجل</td>
                    </tr>
                    <tr>
                      <td><b>P-202 A/B</b></td>
                      <td>مضخات المحلول المنقى Lean</td>
                      <td>80°C سحب المحلول المبرد</td>
                      <td>0.7 kg/cm²G سحب ➔ 28.5 kg/cm²G دفع</td>
                      <td>ضخ المحلول المنقى إلى قمة صواني T-201</td>
                    </tr>
                    <tr>
                      <td><b>F-201</b></td>
                      <td>فلتر تنقية المحلول المنقى</td>
                      <td>80°C تيار جانبي (Side Stream)</td>
                      <td>28.5 kg/cm²G (هبوط الضغط < 0.7 kg/cm²)</td>
                      <td>إزالة الشوائب وأكسيد الحديد وجسيمات الكربون</td>
                    </tr>
                    <tr>
                      <td><b>E-205 A/B</b></td>
                      <td>مكثفات القمة المزدوجة</td>
                      <td>97°C مدخل ➔ 50°C مخرج</td>
                      <td>0.65 kg/cm²G جانب القشرة</td>
                      <td>تبريد وتكثيف بخار الماء المرافق لغاز CO₂</td>
                    </tr>
                    <tr>
                      <td><b>V-203</b></td>
                      <td>فاصل الغاز الحامضي</td>
                      <td>50°C</td>
                      <td>0.60 kg/cm²G</td>
                      <td>فصل متكثف الماء وتصدير 61,000 kg/h CO₂ لليوريا</td>
                    </tr>
                    <tr>
                      <td><b>P-203 A/B</b></td>
                      <td>مضخات الترجيع الحامضي</td>
                      <td>50°C</td>
                      <td>0.60 kg/cm²G سحب ➔ 3.5 kg/cm²G دفع</td>
                      <td>إرجاع المتكثف لصواني الغسيل وإرسال الفائض لـ V-209</td>
                    </tr>
                    <tr>
                      <td><b>V-209</b></td>
                      <td>برج نزع الغازات المذابة</td>
                      <td>60°C - 80°C</td>
                      <td>ضغط جوي (Atmospheric)</td>
                      <td>تجريد H₂ و CH₄ بالهواء قبل إرسال الماء للتبريد</td>
                    </tr>
                    <tr>
                      <td><b>K-201</b></td>
                      <td>منفاخ هواء التجريد</td>
                      <td>حرارة الجو المحيط</td>
                      <td>دفع هواء منخفض الضغط لبرج V-209</td>
                      <td>تأمين تيار هواء التجريد لمنع مخاطر الانفجار</td>
                    </tr>
                    <tr>
                      <td><b>V-204</b></td>
                      <td>وعاء عزل قمة برج الامتصاص</td>
                      <td>77°C</td>
                      <td>26.5 kg/cm²G</td>
                      <td>حجز رذاذ البوتاسيوم وحماية محفز النيكل في R-106</td>
                    </tr>
                    <tr>
                      <td><b>R-106</b></td>
                      <td>مفاعل الميثانايتر للتنقية</td>
                      <td>310°C مدخل ➔ 350°C مخرج</td>
                      <td>26.0 kg/cm²G</td>
                      <td>هدرجة بقايا أكاسيد الكربون إلى ميثان (< 10 ppm)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Section 2 Control Loops Table -->
          <div class="v3d-man-section" id="man-sec2-loops">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num">🎛</span>
              <div>
                <h3>حلقات السيطرة والمتحكمات الرئيسية لقسم كاتاكارب</h3>
                <small>أنظمة التحكم الموزع (DCS Loops) ومحددات السلامة</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <div class="v3d-table-responsive">
                <table class="v3d-ptable">
                  <thead>
                    <tr>
                      <th>رمز المتحكم</th>
                      <th>المتغير المتحكم به</th>
                      <th>الصمام أو الجهاز المنفذ</th>
                      <th>القيمة المستهدفة (Set Point)</th>
                      <th>الأهمية التشغيلية والسلامة</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><b>LRC-202-1V</b></td>
                      <td>منسوب قاع برج T-201 الرئيسي</td>
                      <td>صمام تغذية التوربين P-201HT</td>
                      <td>50% منسوب القاع</td>
                      <td>التحكم بالمنسوب وتدوير التوربين لاسترجاع الطاقة</td>
                    </tr>
                    <tr>
                      <td><b>LRC-202-2V</b></td>
                      <td>منسوب قاع T-201 التبادلي</td>
                      <td>صمام تجاوز التوربين إلى T-202</td>
                      <td>Split-Range (> 55% أو عطل التوربين)</td>
                      <td>تصريف الفائض وضمان عدم فيضان قاع T-201</td>
                    </tr>
                    <tr>
                      <td><b>TIC-203</b></td>
                      <td>حرارة المحلول المنقى من E-204</td>
                      <td>صمام تجاوز مياه المراجل BFW Bypass</td>
                      <td><b>80°C</b> دقيقة</td>
                      <td>ضمان أقصى كفاءة امتصاص ومنع التبلور</td>
                    </tr>
                    <tr>
                      <td><b>FIC-206</b></td>
                      <td>سريان هواء أكسدة الفاناديوم</td>
                      <td>صمام هواء العملية إلى مخرج P-201HT</td>
                      <td>وفق تحليل المختبر الدوري</td>
                      <td>الحفاظ على الفاناديوم في الحالة النشطة V⁵⁺</td>
                    </tr>
                    <tr>
                      <td><b>PIC-202</b></td>
                      <td>ضغط قمة برج التجريد T-202</td>
                      <td>صمام تنفيس غاز CO₂ إلى الجو</td>
                      <td><b>0.69 kg/cm²G</b></td>
                      <td>حماية البرج من زيادة الضغط وتصريف الفائض</td>
                    </tr>
                    <tr>
                      <td><b>LIC-203</b></td>
                      <td>منسوب المتكثف الحامضي في V-203</td>
                      <td>صمامات تصريف P-203 إلى T-202 / V-209</td>
                      <td>50% منسوب</td>
                      <td>منع سحب الماء إلى ضواغط قسم اليوريا</td>
                    </tr>
                    <tr>
                      <td><b>LIC-201</b></td>
                      <td>منسوب متكثف غاز العملية في V-201</td>
                      <td>صمام سحب مضخات الحقن P-206 A/B</td>
                      <td>50% منسوب</td>
                      <td>منع حمل الماء إلى قاع برج الامتصاص T-201</td>
                    </tr>
                    <tr>
                      <td><b>TIC-124</b></td>
                      <td>حرارة مدخل الميثانايتر R-106</td>
                      <td>صمام وقود مسخن الغاز E-107</td>
                      <td><b>310°C</b></td>
                      <td>تأمين حرارة إشعال تفاعل هدرجة أكاسيد الكربون</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
    const total = SECTION_200_EXAM_QUESTIONS.length;
    const answeredCount = this.userAnswers.filter((a) => a !== null).length;
    const correctCount = this.userAnswers.filter((a, idx) => a !== null && a === SECTION_200_EXAM_QUESTIONS[idx].correctIndex).length;
    const scorePct = Math.round((correctCount / total) * 100);

    const isPassed = scorePct >= 70;
    const isCompleted = answeredCount === total;

    container.innerHTML = `
      <div class="v3d-stats-layout">
        <!-- Student Info Header Card -->
        <div class="v3d-student-card">
          <div class="v3d-sc-left">
            <span class="v3d-sc-avatar">🎓</span>
            <div>
              <div class="v3d-sc-name-box">
                <input type="text" id="v3d-sec200-student-name-input" value="${this.studentName}" placeholder="اكتب اسم المتدرب الثلاثي هنا..." class="v3d-student-input" />
                <button id="v3d-sec200-save-name-btn" class="v3d-btn-save-name">💾 حفظ الاسم</button>
              </div>
              <small class="v3d-sc-sub">الهيئة العامة للمهندسين الكيميائيين في البصرة — برنامج التدريب الميداني لمجمع أسمدة خور الزبير</small>
            </div>
          </div>
          <div class="v3d-sc-badge ${isPassed ? 'pass' : 'fail'}">
            ${isPassed ? '🎖 مؤهل للشهادة التخصصية' : '⚠️ يحتاج إلى استكمال وإعادة مراجعة'}
          </div>
        </div>

        <!-- Metric Badges Row -->
        <div class="v3d-stats-cards">
          <div class="v3d-metric-badge">
            <span class="v3d-mb-num">${answeredCount} / ${total}</span>
            <span class="v3d-mb-lbl">الأسئلة المجاب عنها</span>
          </div>
          <div class="v3d-metric-badge" style="border-color:#00e5aa;">
            <span class="v3d-mb-num" style="color:#00e5aa;">${correctCount}</span>
            <span class="v3d-mb-lbl">الإجابات الصحيحة</span>
          </div>
          <div class="v3d-metric-badge" style="border-color:#f87171;">
            <span class="v3d-mb-num" style="color:#f87171;">${answeredCount - correctCount}</span>
            <span class="v3d-mb-lbl">الإجابات الخاطئة</span>
          </div>
          <div class="v3d-metric-badge" style="border-color:#f59e0b;">
            <span class="v3d-mb-num" style="color:#f59e0b;">${scorePct}%</span>
            <span class="v3d-mb-lbl">النتيجة الإجمالية</span>
          </div>
        </div>

        <!-- Official Academic Certificate Preview -->
        <div class="v3d-cert-frame ${isPassed ? 'unlocked' : 'locked'}">
          ${isPassed ? `
            <div class="v3d-cert-paper" id="v3d-sec200-printable-cert">
              <div class="v3d-cp-header">
                <div class="v3d-cp-org">
                  <span>🏛 الهيئة العامة للمهندسين الكيميائيين في البصرة</span>
                  <small>General Union of Chemical Engineers in Basra</small>
                </div>
                <div class="v3d-cp-emblem">🧪</div>
                <div class="v3d-cp-serial">
                  <span>كود الاعتماد: NH3-CATACARB-200-${Math.floor(100000 + Math.random() * 900000)}</span>
                  <small>مجمع أسمدة خور الزبير رقم 3</small>
                </div>
              </div>

              <div class="v3d-cp-body">
                <div class="v3d-cp-title">شهادة اجتياز الكفاءة التخصصية في تشغيل قسم كاتاكارب</div>
                <div class="v3d-cp-subtitle">Certificate of Technical Proficiency in Catacarb CO₂ Removal Operation</div>

                <div class="v3d-cp-txt">
                  تشهد الهيئة العامة للمهندسين الكيميائيين في البصرة بأن المهندس/ـة:
                  <div class="v3d-cp-student-name">${this.studentName}</div>
                  قد اجتاز بنجاح وتفوق الاختبار التخصصي الشامل لـ <b>100 سؤال هندسي متقدم</b> في تشغيل ومحاكاة <b>قسم إزالة ثاني أكسيد الكربون (كاتاكارب) والتنقية النهائية بالميثانايتر (Section 200 - Dwg. 6112P)</b>، بنسبة نجاح بلغت:
                  <div class="v3d-cp-score">${scorePct}% &nbsp; (بتقدير ${scorePct >= 90 ? 'امتياز مع مرتبة الشرف' : scorePct >= 80 ? 'جيد جداً عالٍ' : 'جيد'})</div>
                </div>

                <div class="v3d-cp-sigs">
                  <div class="v3d-cps-box">
                    <span class="v3d-cps-role">مشرف التدريب والتحكم الرقمي</span>
                    <span class="v3d-cps-name">م. علي سيف الدين حيدر النوفل</span>
                    <small>ENG.ALI SAIF AL DIN HAIDER ALNAWFAL</small>
                  </div>
                  <div class="v3d-cps-seal">
                    <div class="v3d-seal-circle">
                      <span>معتمد</span>
                      <span>BASRA</span>
                      <span>${new Date().getFullYear()}</span>
                    </div>
                  </div>
                  <div class="v3d-cps-box">
                    <span class="v3d-cps-role">رئيس لجنة الطاقة والصناعات البتروكيمياوية</span>
                    <span class="v3d-cps-name">الهيئة العامة للمهندسين الكيميائيين</span>
                    <small>General Union of Chemical Engineers</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="v3d-cert-actions">
              <button id="v3d-sec200-print-cert-btn" class="v3d-btn-print">🖨️ طباعة الشهادة الرسمية أو تصدير PDF</button>
            </div>
          ` : `
            <div class="v3d-cert-locked-msg">
              <span style="font-size:42px;">🔒</span>
              <h3>الشهادة مقفلة حالياً</h3>
              <p>للحصول على شهادة الكفاءة التخصصية المعتمدة لقسم كاتاكارب، يجب تحقيق نسبة نجاح لا تقل عن <b>70%</b> (حل 70 سؤالاً صحيحاً على الأقل من أصل 100).</p>
              <button id="v3d-sec200-return-exam-btn" class="v3d-btn-nav v3d-btn-primary" style="margin-top:14px;">
                ◀ العودة لحل الأسئلة وتحسين النتيجة
              </button>
            </div>
          `}
        </div>
      </div>
    `;

    // Event listeners
    document.getElementById('v3d-sec200-save-name-btn')?.addEventListener('click', () => {
      const input = document.getElementById('v3d-sec200-student-name-input') as HTMLInputElement;
      if (input && input.value.trim()) {
        this.studentName = input.value.trim();
        localStorage.setItem('nh3_student_name', this.studentName);
        plantAudio.playSuccess();
        alert('تم حفظ الاسم بنجاح وتحديث بيانات الشهادة.');
        this.renderStatsView(container);
      }
    });

    document.getElementById('v3d-sec200-print-cert-btn')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('v3d-sec200-return-exam-btn')?.addEventListener('click', () => {
      this.switchTab('exam');
    });
  }

  // =========================================================================
  // CSS STYLES INJECTION
  // =========================================================================
  private injectStyles() {
    if (document.getElementById('v3d-sec200-exam-styles')) return;

    const style = document.createElement('style');
    style.id = 'v3d-sec200-exam-styles';
    style.textContent = `
      .v3d-exam-modal {
        position: fixed;
        inset: 0;
        z-index: 99999999;
        background: rgba(2, 6, 12, 0.88);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        direction: rtl;
        font-family: system-ui, -apple-system, sans-serif;
      }

      .v3d-exam-card {
        background: #071322;
        border: 2px solid #00e5aa;
        box-shadow: 0 0 50px rgba(0, 229, 170, 0.25);
        border-radius: 14px;
        width: 100%;
        max-width: 1350px;
        height: 92vh;
        max-height: 950px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      /* Header */
      .v3d-exam-header {
        background: #0a1c30;
        border-bottom: 2px solid #143554;
        padding: 12px 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .v3d-exam-title-box {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .v3d-exam-close-btn {
        background: rgba(239, 68, 68, 0.2);
        border: 1px solid #ef4444;
        color: #ef4444;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .v3d-exam-close-btn:hover {
        background: #ef4444;
        color: #ffffff;
      }

      .v3d-exam-header-txt {
        flex: 1;
      }

      .v3d-exam-header-txt h2 {
        margin: 0;
        font-size: 18px;
        color: #00e5aa;
        font-weight: 800;
      }

      .v3d-exam-header-txt small {
        color: #94a3b8;
        font-size: 12px;
      }

      .v3d-exam-badge {
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: bold;
      }

      .v3d-exam-header-tabs {
        display: flex;
        gap: 8px;
        border-top: 1px solid #143554;
        padding-top: 8px;
      }

      .v3d-exam-htab {
        background: #0f2742;
        border: 1px solid #1e4970;
        color: #cbd5e1;
        padding: 6px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }

      .v3d-exam-htab:hover {
        background: #183e66;
        color: #ffffff;
      }

      .v3d-exam-htab.on {
        background: #00e5aa;
        color: #04131d;
        border-color: #00e5aa;
      }

      /* Body Area */
      .v3d-exam-body {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      /* 1. Exam Layout */
      .v3d-exam-layout {
        display: flex;
        flex: 1;
        height: 100%;
        overflow: hidden;
      }

      .v3d-exam-sidebar {
        width: 340px;
        background: #06111e;
        border-left: 1px solid #143554;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }

      .v3d-sidebar-inner {
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .v3d-drawer-top {
        display: none;
      }

      .v3d-exam-stats-summary {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
        background: #0b1e33;
        padding: 8px;
        border-radius: 8px;
        border: 1px solid #194066;
      }

      .v3d-ess-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .v3d-ess-val {
        font-size: 14px;
        font-weight: 800;
        color: #38bdf8;
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
        color: #00e5aa;
        font-weight: bold;
      }

      .v3d-cat-pills {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .v3d-cat-pill {
        background: #091a2c;
        border: 1px solid #163654;
        color: #cbd5e1;
        padding: 5px 8px;
        border-radius: 6px;
        font-size: 11px;
        text-align: right;
        cursor: pointer;
        transition: all 0.15s;
      }

      .v3d-cat-pill:hover {
        background: #143554;
        color: #ffffff;
      }

      .v3d-cat-pill.active {
        background: rgba(0, 229, 170, 0.2);
        border-color: #00e5aa;
        color: #00e5aa;
        font-weight: bold;
      }

      .v3d-q-grid-title {
        font-size: 11px;
        color: #94a3b8;
        font-weight: bold;
        margin-top: 4px;
      }

      .v3d-q-grid {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        gap: 4px;
        max-height: 220px;
        overflow-y: auto;
        padding: 4px;
        background: #081626;
        border-radius: 6px;
        border: 1px solid #132d47;
      }

      .v3d-qbadge {
        height: 26px;
        border-radius: 4px;
        font-size: 10.5px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.15s;
      }

      .v3d-qbadge.unanswered {
        background: #0f2742;
        color: #94a3b8;
        border-color: #1e4970;
      }

      .v3d-qbadge.correct {
        background: #059669;
        color: #ffffff;
        border-color: #10b981;
      }

      .v3d-qbadge.wrong {
        background: #dc2626;
        color: #ffffff;
        border-color: #ef4444;
      }

      .v3d-qbadge.active {
        box-shadow: 0 0 0 2px #f59e0b;
        transform: scale(1.08);
      }

      .v3d-btn-reset {
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid #ef4444;
        color: #ef4444;
        padding: 5px 12px;
        border-radius: 6px;
        font-size: 11px;
        cursor: pointer;
        width: 100%;
        transition: all 0.2s;
      }

      .v3d-btn-reset:hover {
        background: #ef4444;
        color: #ffffff;
      }

      /* Main Question Box */
      .v3d-exam-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 20px 24px;
        background: #050e18;
      }

      .v3d-mobile-quickbar {
        display: none;
      }

      .v3d-q-meta-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #143554;
      }

      .v3d-q-num-box {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .v3d-q-num {
        font-size: 15px;
        font-weight: 800;
        color: #00e5aa;
      }

      .v3d-q-type-badge {
        background: #0f2b48;
        color: #38bdf8;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 11px;
      }

      .v3d-q-cat-tag {
        font-size: 12px;
        color: #f59e0b;
        font-weight: bold;
      }

      .v3d-q-card {
        background: #09192c;
        border: 1px solid #163c62;
        border-radius: 12px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .v3d-q-text {
        font-size: 17px;
        line-height: 1.6;
        color: #f8fafc;
        font-weight: 700;
      }

      .v3d-q-options {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .v3d-q-opt {
        background: #0c223c;
        border: 2px solid #19446e;
        border-radius: 10px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .v3d-q-opt:hover {
        background: #14365d;
        border-color: #00e5aa;
        transform: translateX(-4px);
      }

      .v3d-opt-marker {
        width: 30px;
        height: 30px;
        border-radius: 8px;
        background: #133355;
        color: #38bdf8;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 14px;
      }

      .v3d-opt-txt {
        flex: 1;
        font-size: 14.5px;
        color: #e2e8f0;
        font-weight: 600;
        line-height: 1.4;
      }

      .v3d-opt-icon {
        font-size: 12px;
        font-weight: bold;
        color: #10b981;
      }

      .v3d-opt-icon.wrong {
        color: #ef4444;
      }

      .v3d-q-opt.opt-correct {
        background: rgba(16, 185, 129, 0.2);
        border-color: #10b981;
      }

      .v3d-q-opt.opt-wrong {
        background: rgba(239, 68, 68, 0.2);
        border-color: #ef4444;
      }

      .v3d-q-opt.opt-disabled {
        opacity: 0.55;
        cursor: default;
      }

      .v3d-q-feedback-box {
        border-radius: 10px;
        padding: 14px 18px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .v3d-q-feedback-box.fb-correct {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid #10b981;
      }

      .v3d-q-feedback-box.fb-wrong {
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid #ef4444;
      }

      .v3d-fb-title {
        font-size: 14px;
        font-weight: 800;
      }

      .fb-correct .v3d-fb-title { color: #10b981; }
      .fb-wrong .v3d-fb-title { color: #ef4444; }

      .v3d-fb-explanation {
        font-size: 13.5px;
        color: #e2e8f0;
        line-height: 1.6;
      }

      .v3d-fb-footer {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-top: 4px;
        padding-top: 6px;
        border-top: 1px dashed rgba(255, 255, 255, 0.15);
        font-size: 11.5px;
        color: #94a3b8;
      }

      .v3d-fb-footer b { color: #38bdf8; }

      .v3d-q-hint-box {
        background: rgba(56, 189, 248, 0.08);
        border: 1px dashed #0284c7;
        color: #38bdf8;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 12.5px;
      }

      .v3d-q-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 10px;
        padding-top: 12px;
        border-top: 1px solid #15395f;
      }

      .v3d-btn-nav {
        background: #0f2a49;
        border: 1px solid #1e4b77;
        color: #ffffff;
        padding: 8px 18px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }

      .v3d-btn-nav:hover:not(:disabled) {
        background: #173d67;
      }

      .v3d-btn-nav:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }

      .v3d-btn-primary {
        background: #00e5aa;
        color: #04131d;
        border-color: #00e5aa;
      }

      .v3d-btn-primary:hover:not(:disabled) {
        background: #10f1b6;
      }

      .v3d-btn-orange {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
        border-color: #f59e0b;
      }

      .v3d-btn-orange:hover:not(:disabled) {
        background: #f59e0b;
        color: #04131d;
      }

      /* 2. Manual Layout */
      .v3d-manual-layout {
        display: flex;
        flex: 1;
        height: 100%;
        overflow: hidden;
      }

      .v3d-manual-sidebar {
        width: 320px;
        background: #06111e;
        border-left: 1px solid #143554;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        overflow-y: auto;
      }

      .v3d-manual-nav-title {
        font-size: 12px;
        font-weight: 800;
        color: #00e5aa;
        margin-bottom: 8px;
      }

      .v3d-mnav-link {
        background: #091a2c;
        border: 1px solid #143554;
        color: #cbd5e1;
        padding: 8px 10px;
        border-radius: 6px;
        font-size: 12px;
        text-decoration: none;
        transition: all 0.15s;
        display: block;
      }

      .v3d-mnav-link:hover {
        background: #123354;
        color: #ffffff;
      }

      .v3d-mnav-link.highlight {
        border-color: #f59e0b;
        color: #f59e0b;
        font-weight: bold;
      }

      .v3d-manual-content {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
        background: #050d17;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .v3d-man-banner {
        background: linear-gradient(135deg, #0d2847 0%, #061424 100%);
        border: 2px solid #00e5aa;
        border-radius: 12px;
        padding: 18px 22px;
      }

      .v3d-mb-badge {
        background: #00e5aa;
        color: #04131d;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: bold;
      }

      .v3d-man-banner h2 {
        margin: 8px 0 4px 0;
        font-size: 20px;
        color: #ffffff;
      }

      .v3d-man-banner p {
        margin: 0;
        font-size: 13px;
        color: #94a3b8;
      }

      .v3d-man-section {
        background: #091829;
        border: 1px solid #163654;
        border-radius: 10px;
        padding: 18px;
      }

      .v3d-man-sec-title {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        border-bottom: 1px solid #143554;
        padding-bottom: 8px;
      }

      .v3d-mst-num {
        background: #00e5aa;
        color: #04131d;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 13px;
      }

      .v3d-man-sec-title h3 {
        margin: 0;
        font-size: 16px;
        color: #f8fafc;
      }

      .v3d-man-sec-title small {
        color: #94a3b8;
        font-size: 11px;
      }

      .v3d-man-text {
        font-size: 14px;
        line-height: 1.7;
        color: #cbd5e1;
      }

      .v3d-chem-box {
        background: #040e1a;
        border: 1px solid #0284c7;
        border-radius: 8px;
        padding: 12px 16px;
        margin: 12px 0;
      }

      .v3d-cb-title {
        color: #38bdf8;
        font-size: 12px;
        font-weight: bold;
      }

      .v3d-cb-eq {
        font-family: monospace;
        font-size: 15px;
        color: #00e5aa;
        font-weight: bold;
        margin: 6px 0;
        direction: ltr;
        text-align: right;
      }

      .v3d-cb-desc {
        font-size: 12px;
        color: #94a3b8;
      }

      .v3d-param-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 10px;
        margin: 14px 0;
      }

      .v3d-pg-card {
        background: #051322;
        border: 1px solid #1a3f66;
        border-radius: 8px;
        padding: 12px;
      }

      .v3d-pgc-lbl {
        display: block;
        font-size: 12px;
        color: #f59e0b;
        font-weight: bold;
      }

      .v3d-pgc-val {
        display: block;
        font-size: 14px;
        color: #00e5aa;
        font-weight: 800;
        margin: 4px 0;
      }

      .v3d-pg-card p {
        margin: 0;
        font-size: 12px;
        color: #94a3b8;
        line-height: 1.5;
      }

      .v3d-table-responsive {
        overflow-x: auto;
      }

      .v3d-ptable {
        width: 100%;
        border-collapse: collapse;
        font-size: 12.5px;
        text-align: right;
      }

      .v3d-ptable th {
        background: #0d2744;
        color: #00e5aa;
        padding: 8px 12px;
        border: 1px solid #173d66;
        font-weight: 700;
      }

      .v3d-ptable td {
        padding: 8px 12px;
        border: 1px solid #143554;
        color: #cbd5e1;
      }

      .v3d-ptable tr:nth-child(even) {
        background: #071526;
      }

      /* 3. Stats & Certificate Layout */
      .v3d-stats-layout {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
        background: #050d17;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .v3d-student-card {
        background: #091a2c;
        border: 1px solid #163654;
        border-radius: 12px;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .v3d-sc-left {
        display: flex;
        align-items: center;
        gap: 14px;
        flex: 1;
      }

      .v3d-sc-avatar {
        font-size: 32px;
      }

      .v3d-sc-name-box {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .v3d-student-input {
        background: #071424;
        border: 1px solid #1b446d;
        color: #ffffff;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 14px;
        width: 280px;
        outline: none;
      }

      .v3d-student-input:focus {
        border-color: #00e5aa;
      }

      .v3d-btn-save-name {
        background: #00e5aa;
        color: #04131d;
        border: none;
        padding: 6px 14px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
      }

      .v3d-sc-sub {
        color: #94a3b8;
        font-size: 11.5px;
        display: block;
        margin-top: 4px;
      }

      .v3d-sc-badge {
        padding: 6px 14px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: bold;
      }

      .v3d-sc-badge.pass {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
        border: 1px solid #10b981;
      }

      .v3d-sc-badge.fail {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
        border: 1px solid #f59e0b;
      }

      .v3d-stats-cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
      }

      .v3d-metric-badge {
        background: #091a2c;
        border: 1px solid #163654;
        border-radius: 10px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .v3d-mb-num {
        font-size: 22px;
        font-weight: 800;
        color: #38bdf8;
      }

      .v3d-mb-lbl {
        font-size: 11.5px;
        color: #94a3b8;
        margin-top: 4px;
      }

      .v3d-cert-frame {
        border-radius: 12px;
        padding: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .v3d-cert-paper {
        background: #ffffff;
        color: #0f172a;
        width: 100%;
        max-width: 900px;
        border: 12px solid #0f2742;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        border-radius: 6px;
        padding: 30px 40px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .v3d-cp-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #0f2742;
        padding-bottom: 12px;
      }

      .v3d-cp-org {
        display: flex;
        flex-direction: column;
      }

      .v3d-cp-org span {
        font-size: 15px;
        font-weight: 800;
        color: #0f2742;
      }

      .v3d-cp-org small {
        font-size: 10.5px;
        color: #475569;
      }

      .v3d-cp-emblem {
        font-size: 40px;
      }

      .v3d-cp-serial {
        text-align: left;
        display: flex;
        flex-direction: column;
      }

      .v3d-cp-serial span {
        font-size: 11px;
        font-weight: bold;
        color: #0f2742;
      }

      .v3d-cp-serial small {
        font-size: 10px;
        color: #64748b;
      }

      .v3d-cp-body {
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .v3d-cp-title {
        font-size: 22px;
        font-weight: 800;
        color: #0f2742;
      }

      .v3d-cp-subtitle {
        font-size: 12px;
        color: #475569;
        font-family: sans-serif;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .v3d-cp-txt {
        font-size: 14px;
        line-height: 1.8;
        color: #334155;
        margin-top: 8px;
      }

      .v3d-cp-student-name {
        font-size: 24px;
        font-weight: 800;
        color: #0284c7;
        margin: 6px 0;
        text-decoration: underline;
      }

      .v3d-cp-score {
        font-size: 18px;
        font-weight: 800;
        color: #059669;
        margin-top: 4px;
      }

      .v3d-cp-sigs {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 24px;
        padding-top: 14px;
        border-top: 1px solid #cbd5e1;
      }

      .v3d-cps-box {
        display: flex;
        flex-direction: column;
        text-align: center;
        gap: 2px;
      }

      .v3d-cps-role {
        font-size: 11px;
        color: #64748b;
      }

      .v3d-cps-name {
        font-size: 13px;
        font-weight: 800;
        color: #0f2742;
      }

      .v3d-cps-box small {
        font-size: 9.5px;
        color: #94a3b8;
      }

      .v3d-cps-seal {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .v3d-seal-circle {
        width: 70px;
        height: 70px;
        border: 2px dashed #0284c7;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #0284c7;
        font-size: 9px;
        font-weight: bold;
        transform: rotate(-15deg);
      }

      .v3d-cert-actions {
        margin-top: 16px;
      }

      .v3d-btn-print {
        background: #0284c7;
        color: #ffffff;
        border: none;
        padding: 10px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
      }

      .v3d-btn-print:hover {
        background: #0369a1;
      }

      .v3d-cert-locked-msg {
        background: #091a2c;
        border: 1px dashed #1e4a74;
        border-radius: 12px;
        padding: 40px;
        text-align: center;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      .v3d-cert-locked-msg h3 {
        margin: 0;
        color: #f59e0b;
        font-size: 18px;
      }

      .v3d-cert-locked-msg p {
        margin: 0;
        font-size: 13px;
        color: #94a3b8;
        line-height: 1.6;
      }

      /* Mobile Responsive Styles */
      @media (max-width: 900px) {
        .v3d-exam-modal { padding: 4px; }
        .v3d-exam-card { height: 96vh; }
        .desktop-only { display: none !important; }
        .v3d-mobile-quickbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #0b1e33;
          border: 1px solid #163d66;
          border-radius: 8px;
          padding: 8px 12px;
          margin-bottom: 12px;
        }
        .v3d-mq-btn {
          background: #00e5aa;
          color: #04131d;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: bold;
          font-size: 12px;
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
          border-left: 2px solid #00e5aa;
          overflow-y: auto;
        }
        .v3d-drawer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid #163654;
        }
        .v3d-dt-title { font-weight: bold; color: #00e5aa; font-size: 13px; }
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

export const section200ExamCenter = Section200ExamCenterUI.getInstance();
