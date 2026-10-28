import { SECTION_400_EXAM_QUESTIONS, ExamQuestion, SECTION_400_CATEGORIES } from './Section400MasterExam';
import { plantAudio } from './PlantAudio';

export class Section400ExamCenterUI {
  private static instance: Section400ExamCenterUI | null = null;
  private modalEl: HTMLElement | null = null;
  private activeTab: 'exam' | 'manual' | 'stats' = 'exam';
  private currentQuestionIndex: number = 0;
  private userAnswers: (number | null)[] = new Array(SECTION_400_EXAM_QUESTIONS.length).fill(null);
  private selectedCategory: string = 'all';
  private isMobileDrawerOpen: boolean = false;
  private studentName: string = localStorage.getItem('nh3_student_name') || 'مهندس تشغيل وتخليق متدرب';

  public static getInstance(): Section400ExamCenterUI {
    if (!Section400ExamCenterUI.instance) {
      Section400ExamCenterUI.instance = new Section400ExamCenterUI();
    }
    return Section400ExamCenterUI.instance;
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

    let existingModal = document.getElementById('v3d-sec400-exam-modal');
    if (existingModal) {
      this.modalEl = existingModal;
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'v3d-sec400-exam-modal';
    modal.className = 'v3d-exam-modal';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="v3d-exam-card" style="border-color:#8b5cf6;">
        <!-- Header -->
        <div class="v3d-exam-header" style="border-bottom-color:#8b5cf6;">
          <div class="v3d-exam-title-box">
            <button class="v3d-exam-close-btn" id="v3d-sec400-exam-close" title="إغلاق الشاشة">✕</button>
            <div class="v3d-exam-header-txt">
              <h2 style="color:#d8b4fe;">⚛️ بنك الـ 100 سؤال ودليل تشغيل قسم تخليق وتبريد الأمونيا وضاغط K-401</h2>
              <small>حلقة تخليق الأمونيا (R-401) ومنظومة التثليج وكباس K-401 — مجمع أسمدة خور الزبير رقم 3</small>
            </div>
            <span class="v3d-exam-badge" style="background:#8b5cf6;color:#ffffff;font-weight:bold;">Dwg. 6112P (C-15..C-22)</span>
          </div>

          <div class="v3d-exam-header-tabs">
            <button class="v3d-exam-htab on" id="v3d-sec400-extab-exam">📝 بنك الـ 100 سؤال</button>
            <button class="v3d-exam-htab" id="v3d-sec400-extab-manual">📖 كتيب التشغيل C-15..C-22</button>
            <button class="v3d-exam-htab" id="v3d-sec400-extab-stats">📊 النتيجة والشهادة</button>
          </div>
        </div>

        <!-- Body Area -->
        <div class="v3d-exam-body" id="v3d-sec400-exam-content">
          <!-- Dynamic Content -->
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;

    // Attach Header Tabs & Close
    document.getElementById('v3d-sec400-exam-close')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.close();
    });

    document.getElementById('v3d-sec400-extab-exam')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('exam');
    });

    document.getElementById('v3d-sec400-extab-manual')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('manual');
    });

    document.getElementById('v3d-sec400-extab-stats')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('stats');
    });

    this.injectStyles();
  }

  public open(tab: 'exam' | 'manual' | 'stats' = 'exam', questionIndex: number = 0) {
    if (!this.modalEl || !document.getElementById('v3d-sec400-exam-modal')) {
      this.createModalDOM();
    }
    if (this.modalEl) {
      this.modalEl.style.display = 'flex';
      this.currentQuestionIndex = Math.max(0, Math.min(questionIndex, SECTION_400_EXAM_QUESTIONS.length - 1));
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
    const bExam = document.getElementById('v3d-sec400-extab-exam');
    const bManual = document.getElementById('v3d-sec400-extab-manual');
    const bStats = document.getElementById('v3d-sec400-extab-stats');

    bExam?.classList.toggle('on', tab === 'exam');
    bManual?.classList.toggle('on', tab === 'manual');
    bStats?.classList.toggle('on', tab === 'stats');

    const container = document.getElementById('v3d-sec400-exam-content');
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
  // 1. RENDER 100-QUESTION EXAM VIEW (Identical structure to Sections 100, 200, 300)
  // =========================================================================
  private renderExamView(container: HTMLElement) {
    const q = SECTION_400_EXAM_QUESTIONS[this.currentQuestionIndex];
    const total = SECTION_400_EXAM_QUESTIONS.length;

    // Stats calculations
    const answeredCount = this.userAnswers.filter((a) => a !== null).length;
    const correctCount = this.userAnswers.filter((a, idx) => a !== null && a === SECTION_400_EXAM_QUESTIONS[idx].correctIndex).length;
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    const categories = SECTION_400_CATEGORIES.map((c) => ({
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
          <div class="v3d-dt-title" style="color:#d8b4fe;">📑 فهرس أسئلة القسم الرابع و K-401</div>
          <button id="v3d-sec400-close-drawer-btn" class="v3d-drawer-x-btn">✕ إغلاق</button>
        </div>

        <div class="v3d-exam-stats-summary" style="border-color:#3b1e68;">
          <div class="v3d-ess-box">
            <span class="v3d-ess-val">${answeredCount} / ${total}</span>
            <span class="v3d-ess-lbl">تم حلها</span>
          </div>
          <div class="v3d-ess-box">
            <span class="v3d-ess-val" style="color:#10b981;">${correctCount}</span>
            <span class="v3d-ess-lbl">إجابات صحيحة</span>
          </div>
          <div class="v3d-ess-box">
            <span class="v3d-ess-val" style="color:#d8b4fe;">${accuracy}%</span>
            <span class="v3d-ess-lbl">نسبة الدقة</span>
          </div>
        </div>

        <!-- Category Filter Pills -->
        <div class="v3d-cat-filter-wrap">
          <span class="v3d-filter-header" style="color:#d8b4fe;">تصفية حسب المنظومة الهندسية:</span>
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
          <small style="color:#d8b4fe;">${this.getFilteredQuestions().length} سؤال ظاهر</small>
        </div>
        <div class="v3d-qmatrix-grid">
          ${SECTION_400_EXAM_QUESTIONS.map((item, idx) => {
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
              <span class="v3d-emp-cat-badge" style="background:rgba(139,92,246,0.18);border-color:#8b5cf6;color:#d8b4fe;">${q.arabicCategory}</span>
              <span class="v3d-emp-qnum">السؤال ${q.id} من ${total}</span>
              <span class="v3d-emp-eqtag" title="رمز المعدة الهندسية">${q.equipmentRef.toUpperCase()}</span>
            </div>

            <div class="v3d-emp-actions">
              <button id="v3d-sec400-open-drawer-btn" class="v3d-btn-drawer-toggle mobile-only" style="background:#8b5cf6;color:#ffffff;">
                📑 جدول الـ 100 سؤال
              </button>
              <button id="v3d-sec400-reset-exam-btn" class="v3d-btn-reset-exam" title="تصفير الإجابات وبدء الاختبار من جديد">
                🔄 تصفير الاختبار
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="v3d-progress-track">
            <div class="v3d-progress-fill" style="width: ${((this.currentQuestionIndex + 1) / total) * 100}%; background:#8b5cf6;"></div>
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
                  <span class="v3d-fb-icon">${isCorrect ? '🎉 إجابة صحيحة ومطابقة للكود الهندسي ودليل التشغيل!' : '⚠️ إجابة غير صحيحة — راجع التفسير الفني أدناه:'}</span>
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
            <button id="v3d-sec400-q-prev-btn" class="v3d-qnav-btn prev" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
              ◀ السؤال السابق
            </button>

            <div class="v3d-qnav-center-info">
              <span>نسبة الإنجاز: <b>${Math.round((answeredCount / total) * 100)}%</b></span>
            </div>

            <button id="v3d-sec400-q-next-btn" class="v3d-qnav-btn next" ${this.currentQuestionIndex === total - 1 ? 'disabled' : ''}>
              السؤال التالي ▶
            </button>

            <button id="v3d-sec400-q-next-unsolved-btn" class="v3d-qnav-btn jump-unsolved" style="background:rgba(139,92,246,0.18);border-color:#8b5cf6;color:#d8b4fe;" title="الانتقال المباشر لأول سؤال لم تتم الإجابة عليه">
              ⏩ السؤال غير المحلول التالي
            </button>
          </div>
        </main>
      </div>

      <!-- Mobile Overlay Drawer Sheet -->
      <div id="v3d-sec400-mobile-drawer" class="v3d-mobile-drawer-sheet ${this.isMobileDrawerOpen ? 'open' : ''}">
        <div class="v3d-drawer-backdrop" id="v3d-sec400-drawer-backdrop"></div>
        <div class="v3d-drawer-panel">
          ${sidebarHTML}
        </div>
      </div>
    `;

    // Attach Event Listeners
    // Mobile Drawer Open / Close
    document.getElementById('v3d-sec400-open-drawer-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.isMobileDrawerOpen = true;
      const drawer = document.getElementById('v3d-sec400-mobile-drawer');
      drawer?.classList.add('open');
    });

    const closeDrawerAction = () => {
      this.isMobileDrawerOpen = false;
      const drawer = document.getElementById('v3d-sec400-mobile-drawer');
      drawer?.classList.remove('open');
    };

    document.getElementById('v3d-sec400-close-drawer-btn')?.addEventListener('click', closeDrawerAction);
    document.getElementById('v3d-sec400-drawer-backdrop')?.addEventListener('click', closeDrawerAction);

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
    document.getElementById('v3d-sec400-q-prev-btn')?.addEventListener('click', () => {
      if (this.currentQuestionIndex > 0) {
        plantAudio.playClick();
        this.currentQuestionIndex--;
        this.renderExamView(container);
      }
    });

    // Next Button
    document.getElementById('v3d-sec400-q-next-btn')?.addEventListener('click', () => {
      if (this.currentQuestionIndex < SECTION_400_EXAM_QUESTIONS.length - 1) {
        plantAudio.playClick();
        this.currentQuestionIndex++;
        this.renderExamView(container);
      }
    });

    // Next Unsolved
    document.getElementById('v3d-sec400-q-next-unsolved-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      const nextUnsolved = this.userAnswers.findIndex((a, idx) => a === null && idx > this.currentQuestionIndex);
      if (nextUnsolved !== -1) {
        this.currentQuestionIndex = nextUnsolved;
      } else {
        const firstUnsolved = this.userAnswers.findIndex((a) => a === null);
        if (firstUnsolved !== -1) {
          this.currentQuestionIndex = firstUnsolved;
        } else {
          alert('تهانينا! لقد قمت بالإجابة على جميع أسئلة قسم تخليق وتبريد الأمونيا الـ 100 بنجاح.');
        }
      }
      this.renderExamView(container);
    });

    // Reset Exam
    document.getElementById('v3d-sec400-reset-exam-btn')?.addEventListener('click', () => {
      if (confirm('هل أنت متأكد من إعادة ضبط كافة الإجابات وبدء اختبار القسم الرابع والضاغط K-401 من جديد؟')) {
        plantAudio.playClick();
        this.userAnswers = new Array(SECTION_400_EXAM_QUESTIONS.length).fill(null);
        this.currentQuestionIndex = 0;
        this.isMobileDrawerOpen = false;
        this.renderExamView(container);
      }
    });
  }

  // =========================================================================
  // 2. RENDER OPERATIONAL MANUAL VIEW (C-15 to C-22)
  // =========================================================================
  private renderManualView(container: HTMLElement) {
    container.innerHTML = `
      <div class="v3d-manual-layout">
        <div class="v3d-manual-sidebar">
          <div class="v3d-manual-nav-title" style="color:#d8b4fe;">📑 الفهرس التكنولوجي (C-15..C-22)</div>
          <a href="#man-sec4-c15-overview" class="v3d-mnav-link">2.5.a مبادئ تخليق الأمونيا وحلقة التفاعل (C-15)</a>
          <a href="#man-sec4-c15-r401" class="v3d-mnav-link">2.5.b مفاعل R-401 والطبقات الثلاث والفراغ الحلقي</a>
          <a href="#man-sec4-c16-primary" class="v3d-mnav-link">2.5.c شبكة استرجاع الحرارة والتكثيف الأولي (E-401..404 & V-401)</a>
          <a href="#man-sec4-c17-secondary" class="v3d-mnav-link">2.5.d التكثيف الثانوي والتبريد بالأمونيا (E-407/405/406 & V-402)</a>
          <a href="#man-sec4-c18-purge" class="v3d-mnav-link">2.5.e مسار غاز التطهير والتنفيس (Purge Gas, E-408, V-403, E-416)</a>
          <a href="#man-sec4-c19-letdown" class="v3d-mnav-link">2.5.f وعاء تخفيض الضغط V-409 ومضخات المنتج P-401</a>
          <a href="#man-sec4-c20-k401" class="v3d-mnav-link">2.5.g ضاغط التبريد K-401 والتوربين البخاري KT-401</a>
          <a href="#man-sec4-c21-separators" class="v3d-mnav-link">2.5.h فواصل سحب التبريد ومستويات التبخير الثلاثة</a>
          <a href="#man-sec4-c22-antisurge" class="v3d-mnav-link">2.5.i منظومة مانع الارتجاف وإزالة التحميص ومستلم V-408</a>
          <a href="#man-sec4-params" class="v3d-mnav-link highlight" style="border-color:#8b5cf6;color:#d8b4fe;">📊 جدول المطابقة والمعاملات التشغيلية</a>
          <a href="#man-sec4-interlocks" class="v3d-mnav-link">🎛 مصفوفة الإنترلوك والرحلة الطارئة (ESD Matrix)</a>
        </div>

        <div class="v3d-manual-content">
          <!-- Banner -->
          <div class="v3d-man-banner" style="border-left-color:#8b5cf6;">
            <span class="v3d-mb-badge" style="background:#8b5cf6;color:#ffffff;">مستند رسمي معتمد — Dwg. 6112P-100-400-00</span>
            <h2>دليل التشغيل والمواصفات التكنولوجية لقسم تخليق وتبريد الأمونيا وضاغط التثليج K-401</h2>
            <p>مجمع أسمدة خور الزبير رقم 3 — صفحات التشغيل الرسمية C-15 إلى C-22 ومخططات MHI المعتمدة</p>
          </div>

          <!-- Section 2.5.a C-15 Overview -->
          <div class="v3d-man-section" id="man-sec4-c15-overview">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#8b5cf6;color:#ffffff;">2.5.a</span>
              <div>
                <h3>مبادئ تخليق الأمونيا وحلقة التفاعل (Section 2.5 SYNTHESIS)</h3>
                <small>الصفحة C-15 من دليل التشغيل المعتمد</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                يقوم هذا القسم بالدمج التحفيزي بين غازي الهيدروجين والنيتروجين لإنتاج الأمونيا (NH₃) وفصل الأمونيا عن تيار الغاز المتبقي لإعادة تدويره.
              </p>
              <ul>
                <li><b>مكونات الغاز:</b> يحتوي غاز التخليق على الهيدروجين (H₂) والنيتروجين (N₂) ونسبة من الأمونيا، بالإضافة إلى الشوائب الخاملة غير المتفاعلة كالميثان (CH₄) والأرغون (Ar).</li>
                <li><b>حلقة التخليق المغلقة (Synthesis Loop):</b> يمر الغاز فوق العامل المساعد داخل المفاعل <b>R-401</b>، ثم يبرد في سلسلة مبادلات لتكثيف الأمونيا وفصلها في عازل الضغط العالي V-401.</li>
                <li><b>التدوير والتثليج:</b> يعاد الغاز غير المتفاعل إلى مرحلة التدوير بالضاغط K-301، ثم يبرد في قطار التثليج (E-407, E-405, E-406) حيث يخلط مع غاز التعويض الطازج لتكثيف الجزء المتبقي وفصله في V-402 قبل العودة للمفاعل.</li>
              </ul>
            </div>
          </div>

          <!-- Section 2.5.b R-401 Design -->
          <div class="v3d-man-section" id="man-sec4-c15-r401">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#8b5cf6;color:#ffffff;">2.5.b</span>
              <div>
                <h3>مفاعل الأمونيا R-401 والطبقات الثلاث والفراغ الحلقي</h3>
                <small>دليل التشغيل صفحة C-15 و C-16</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                يتكون مفاعل الأمونيا R-401 من سلة داخلية للعامل المساعد (Catalyst Basket) تضم 3 طبقات عامل مساعد منفصلة، وغلاف خارجي حاوٍ للضغط، وبينهما فراغ حلقي (Annular Space):
              </p>
              <div class="v3d-man-callout" style="background:rgba(139,92,246,0.08);border-color:#8b5cf6;">
                <p><b>النص الحرفي من دليل التشغيل (Manual C-15):</b></p>
                <p><i>"The ammonia converter (R-401) consists of an inner catalyst basket and an outer pressure shell. The catalyst basket contains 3 catalyst beds. The major part of the gas from the feed gas preheater (E-403) enters the annular space between the inner catalyst basket and the outer pressure shell to keep the outer pressure shell cool. The remaining gas is used as quench gas for temperature control of the 2nd and 3rd catalyst beds."</i></p>
              </div>
              <p>
                <b>آلية التبريد والتسخين الدقيقة:</b>
                <br>• يمر الجزء الأكبر من الغاز عبر الفراغ الحلقي لحماية الغلاف الخارجي من الإجهادات الحرارية وهجوم الهيدروجين عند الضغط العالي.
                <br>• يسخن الغاز الخارج من الفراغ الحلقي إلى نحو <b>400°C</b> في جانب الغلاف لمبادل المفاعل <b>E-401</b> قبل دخوله الطبقة الأولى Bed 1.
                <br>• يستخدم غاز الإخماد (Quench Gas) لتبريد الغاز المتفاعل الخارج بين الطبقة 1 و 2، وبين الطبقة 2 و 3.
              </p>
            </div>
          </div>

          <!-- Section 2.5.c Heat Recovery & Primary Condensing -->
          <div class="v3d-man-section" id="man-sec4-c16-primary">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#8b5cf6;color:#ffffff;">2.5.c</span>
              <div>
                <h3>قطار استرجاع الحرارة والتكثيف الأولي (E-401..404 & V-401)</h3>
                <small>الدليل C-16 ومكثفات مياه التبريد</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                يخرج الغاز المتفاعل الساخن من الطبقة الثالثة لمفاعل R-401 ويتم استرجاع حرارته وتكثيف الأمونيا عبر المراحل التالية:
              </p>
              <div class="v3d-man-grid3">
                <div class="v3d-mg-card">
                  <h4>1. استرجاع الحرارة الثلاثي</h4>
                  <p>يبرد الغاز بالتتابع في:
                    <br>• <b>E-401:</b> مبادل المفاعل لتسخين التغذية.
                    <br>• <b>E-402:</b> مسخن ماء المرجل (يسخن BFW إلى 200°C).
                    <br>• <b>E-403 (Tubes):</b> يسخن غاز الدخول إلى 148°C.
                  </p>
                </div>
                <div class="v3d-mg-card">
                  <h4>2. التكثيف الأولي E-404 A,B</h4>
                  <p>يمر الغاز إلى مكثفات مياه التبريد <b>E-404 A,B</b> حيث يتكثف حوالي <b>35% من إنتاج الأمونيا</b> بواسطة مياه التبريد الصناعية.</p>
                </div>
                <div class="v3d-mg-card">
                  <h4>3. العازل الأولي V-401</h4>
                  <p>تفصل الأمونيا السائلة وتخفض إلى <b>21 kg/cm²G</b> أثناء تدفقها إلى خزان التخفيف <b>V-409</b>، بينما يعود الغاز غير المتفاعل إلى ضاغط K-301.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2.5.d Secondary Condensing & Chilling -->
          <div class="v3d-man-section" id="man-sec4-c17-secondary">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#8b5cf6;color:#ffffff;">2.5.d</span>
              <div>
                <h3>التكثيف الثانوي والتبريد بالأمونيا (E-407, E-405, E-406, V-402)</h3>
                <small>تحقيق أقصى تكثيف وإنتاجية (Manual C-17)</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                يتم استخلاص الـ 65% المتبقية من الأمونيا عبر قطار التبريد العميق بالأمونيا السائلة المتبخرة:
                <br>• <b>المبادل البارد E-407:</b> يبرد غاز التدوير القادم من مرحلة التدوير بالضاغط إلى <b>26.5°C</b> بالتبادل الحراري مع الغاز البارد الخارج من V-402.
                <br>• <b>المكثف الأولي E-405:</b> يبرد الغاز إلى <b>14°C</b> بتبخير الأمونيا عند ضغط 4.9 kg/cm²G ودرجة حرارة 8.0°C.
                <br>• <b>المكثف الثانوي E-406:</b> يخلط الغاز بغاز التعويض من K-301 ويبرد الخليط إلى <b>2.2°C</b> بتبخير الأمونيا عند ضغط 2.9 kg/cm²G ودرجة حرارة -4.0°C.
                <br>• <b>نتائج التكثيف:</b> يتكثف حوالي <b>65% من مجمل إنتاج الأمونيا</b> في هذا القطار، ولا يتبقى سوى <b>4% أمونيا</b> في الطور الغازي.
                <br>• <b>إعادة التسخين:</b> يخرج الغاز من العازل الثانوي V-402 بحرارة 2.2°C ويعاد تسخينه في أنابيب E-407 إلى <b>50°C</b> ثم في غلاف E-403 إلى <b>148°C</b> قبل العودة إلى R-401.
              </p>
            </div>
          </div>

          <!-- Section 2.5.e Purge Gas -->
          <div class="v3d-man-section" id="man-sec4-c18-purge">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#8b5cf6;color:#ffffff;">2.5.e</span>
              <div>
                <h3>مسار غاز التطهير والتنفيس (Purge Gas, E-408, V-403, E-416)</h3>
                <small>الحفاظ على الغازات الخاملة عند 10% واسترجاع الأمونيا (Manual C-18)</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                <b>التحكم بالغازات الخاملة (Inerts Control):</b>
                <br>• لمنع تراكم الغازات الخاملة (الميثان والأرغون) في حلقة التخليق، يتم سحب تيار تطهير مستمر (Purge Gas) من أعلى الفاصل الأولي V-401 للحفاظ على تركيز الخوامل عند <b>10%</b>.
                <br>• <b>المكثف E-408 والفاصل V-403:</b> يبرد غاز التطهير في E-408 بواسطة سائل الأمونيا القادم من المستلم V-408 لاسترجاع معظم الأمونيا ونقلها إلى V-409.
                <br>• <b>المسخن E-416:</b> يسخن غاز التطهير المتبقي في E-416 ثم يرسل كوقود غازي عالي القيمة لمراجل الضغط العالي (HP Boilers).
              </p>
            </div>
          </div>

          <!-- Section 2.5.f Letdown Drum & Pumps -->
          <div class="v3d-man-section" id="man-sec4-c19-letdown">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#8b5cf6;color:#ffffff;">2.5.f</span>
              <div>
                <h3>وعاء تخفيض الضغط V-409 ومضخات المنتج P-401 A,B</h3>
                <small>فصل غاز الوميض وضخ المنتج بدرجة حرارة -32°C (Manual C-19)</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                • يستقبل وعاء التخفيض <b>V-409</b> سائل الأمونيا من V-401 و V-402 و V-403 عند ضغط مخفض قدره <b>21 kg/cm²G</b>.
                <br>• تفصل الغازات الذائبة ومتبقيات الغاز الخامل كغاز وميض (Flash Gas)، وتبرد في <b>E-409</b> وتفصل في <b>V-404</b> لترسل إلى وقود المراجل.
                <br>• يتدفق سائل الأمونيا من V-409 و V-404 إلى فاصل سحب المرحلة الأولى <b>V-405</b> عند درجة حرارة <b>-32°C</b>.
                <br>• تسحب مضخات منتج الأمونيا <b>P-401 A,B</b> الأمونيا السائلة (-32°C) من قاع V-405 وتضخها مباشرة إلى خزانات الأمونيا الكروية والجوية للتصدير ومجمع اليوريا.
              </p>
            </div>
          </div>

          <!-- Section 2.5.g K-401 Compressor & KT-401 Turbine -->
          <div class="v3d-man-section" id="man-sec4-c20-k401">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#8b5cf6;color:#ffffff;">2.5.g</span>
              <div>
                <h3>ضاغط التبريد K-401 والتوربين البخاري KT-401</h3>
                <small>الماكينة الطاردة المركزية ذات الجسمين (Manual C-20)</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                <b>هيكل كباس التثليج K-401:</b>
                <br>• كباس طارد مركزي يتكون من <b>غلافين (2-casing machine)</b> يدار بواسطة التوربين البخاري <b>KT-401</b>.
                <br>• <b>غلاف الضغط المنخفض (LP Casing):</b> يسحب بخار الأمونيا من فاصل السحب الأول <b>V-405</b> عند ضغط <b>0.07 kg/cm²G</b> ويطرده إلى فاصل السحب الثاني <b>V-406</b>.
                <br>• <b>غلاف الضغط العالي (HP Casing):</b> يستقبل الغاز من فاصل السحب الثاني <b>V-406</b> عند <b>2.5 kg/cm²G</b> ومن فاصل السحب الثالث <b>V-407</b> عند <b>4.4 kg/cm²G</b>، ويضغطهما معاً ويطردهما إلى مكثف الأمونيا <b>E-412</b>.
                <br>• <b>التكثيف والمستلم:</b> تتكثف الأمونيا في E-412 وتتدفق بالجاذبية إلى مستلم الأمونيا <b>V-408</b> لتغذية فواصل التثليج.
                <br>• <b>التحكم بالضغط الأول:</b> يتم الحفاظ على ضغط سحب المرحلة الأولى ثابتاً عبر التحكم في سرعة التوربين البخاري KT-401.
              </p>
            </div>
          </div>

          <!-- Section 2.5.h Separators & Evaporation Levels -->
          <div class="v3d-man-section" id="man-sec4-c21-separators">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#8b5cf6;color:#ffffff;">2.5.h</span>
              <div>
                <h3>فواصل سحب التبريد ومستويات التبخير الثلاثة والتسييل المتسلسل</h3>
                <small>V-405 (-33°C), V-406 (-8°C), V-407 (+13°C) (Manual C-21)</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                <b>مستويات التبخير والتسييل المتسلسل (Liquid Cascade):</b>
                <br>• <b>المستوى الثالث (+13°C / 4.4 kg/cm²G):</b> يستقبل V-407 الأمونيا من V-408، ويبخر في E-405 عند 4.9 kg/cm²G (+8°C).
                <br>• <b>المستوى الثاني (-8°C / 2.5 kg/cm²G):</b> يستقبل V-406 سائل الأمونيا المتدفق ذاتياً من قاع V-407 عبر صمام السيطرة على المنسوب، ويبخر في E-406 عند 2.9 kg/cm²G (-4°C).
                <br>• <b>المستوى الأول (-33°C / 0.07 kg/cm²G):</b> يستقبل V-405 سائل الأمونيا المتدفق ذاتياً من قاع V-406 عبر صمام السيطرة، ويبخر في E-408.
              </p>
            </div>
          </div>

          <!-- Section 2.5.i Anti-Surge & Desuperheating -->
          <div class="v3d-man-section" id="man-sec4-c22-antisurge">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#8b5cf6;color:#ffffff;">2.5.i</span>
              <div>
                <h3>منظومة مانع الارتجاف وإزالة التحميص ومستلم الأمونيا V-408</h3>
                <small>Anti-Surge & Desuperheating System (Manual C-22)</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                • <b>صمامات مانع الارتجاف (Anti-Surge Valves):</b> تم تزويد كلا الغلافين بصمامات مانع ارتجاف مستقلة تعيد تدوير الغاز المضغوط إلى فواصل السحب المقابلة لمنع حدوث الارتجاف عند تدني الأحمال.
                <br>• <b>إزالة التحميص بسائل الأمونيا (Desuperheating):</b> يتم حقن سائل الأمونيا المأخوذ من المستلم V-408 في خطوط تدوير مانع الارتجاف ليتبخر فورياً ويزيل حرارة الانضغاط العالية، مانعاً ارتفاع حرارة الغاز الداخل لفواصل السحب.
              </p>
            </div>
          </div>

          <!-- Section 2.5.j Parameters Match Table -->
          <div class="v3d-man-section" id="man-sec4-params">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#8b5cf6;color:#ffffff;">📊</span>
              <div>
                <h3>جدول المطابقة الهندسية الشاملة لقسم تخليق الأمونيا وكباس K-401</h3>
                <small>مطابقة تامة مع كتيب التشغيل C-15 إلى C-22 ومخطط PFD 6112P-100-400-00</small>
              </div>
            </div>
            <div class="v3d-param-table-wrap">
              <table class="v3d-param-table">
                <thead>
                  <tr>
                    <th>رمز المعدة</th>
                    <th>اسم المعدة بالدليل</th>
                    <th>الضغط التشغيلي</th>
                    <th>الحرارة</th>
                    <th>الملاحظات الهندسية ومطابقة C-15..C-22</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>R-401</b></td>
                    <td>مفاعل تخليق الأمونيا Ammonia Converter</td>
                    <td>220 - 230 kg/cm²G</td>
                    <td>400°C -> 505°C</td>
                    <td>سلة داخلية بـ 3 طبقات محفز، وفراغ حلقي لتبريد الغلاف</td>
                  </tr>
                  <tr>
                    <td><b>E-401</b></td>
                    <td>مبادل حرارة المفاعل Effluent/Feed Exchanger</td>
                    <td>225 kg/cm²G</td>
                    <td>400°C (Inlet Bed 1)</td>
                    <td>يسخن غاز الدخول في الغلاف ويبرد مخرج المفاعل في الأنابيب</td>
                  </tr>
                  <tr>
                    <td><b>E-402</b></td>
                    <td>مسخن ماء تغذية المراجل BFW Preheater</td>
                    <td>224 kg/cm²G</td>
                    <td>BFW: 200°C</td>
                    <td>يسترجع حرارة التفاعل لتسخين مياه المراجل إلى 200°C</td>
                  </tr>
                  <tr>
                    <td><b>E-403</b></td>
                    <td>مسخن غاز التغذية Feed Gas Preheater</td>
                    <td>222 kg/cm²G</td>
                    <td>148°C (Feed Exit)</td>
                    <td>يسخن غاز التغذية في الغلاف ويبرد منتج التفاعل في الأنابيب</td>
                  </tr>
                  <tr>
                    <td><b>E-404 A,B</b></td>
                    <td>المكثفات المائية Water-Cooled Condensers</td>
                    <td>220 kg/cm²G</td>
                    <td>41°C</td>
                    <td>تكثف حوالي 35% من إنتاج الأمونيا بمياه التبريد</td>
                  </tr>
                  <tr>
                    <td><b>V-401</b></td>
                    <td>عازل الضغط العالي الأولي Primary Separator</td>
                    <td>218 kg/cm²G</td>
                    <td>41°C</td>
                    <td>يفصل الأمونيا السائلة ويرسلها بضغط 21 kg إلى V-409</td>
                  </tr>
                  <tr>
                    <td><b>E-407</b></td>
                    <td>المبادل البارد Cold Exchanger</td>
                    <td>216 kg/cm²G</td>
                    <td>26.5°C -> 50°C</td>
                    <td>يتبادل الحرارة بين غاز التدوير الساخن وغاز V-402 البارد</td>
                  </tr>
                  <tr>
                    <td><b>E-405</b></td>
                    <td>مبرد الأمونيا الأولي NH3 Chiller</td>
                    <td>214 kg/cm²G</td>
                    <td>14.0°C (Shell: 8°C)</td>
                    <td>تبريد بتبخير الأمونيا عند 4.9 kg/cm²G</td>
                  </tr>
                  <tr>
                    <td><b>E-406</b></td>
                    <td>مبرد الأمونيا الثانوي Secondary NH3 Chiller</td>
                    <td>212 kg/cm²G</td>
                    <td>2.2°C (Shell: -4°C)</td>
                    <td>تبريد بتبخير الأمونيا عند 2.9 kg/cm²G، يكثف 65% من الإنتاج</td>
                  </tr>
                  <tr>
                    <td><b>V-402</b></td>
                    <td>العازل الثانوي البارد Secondary Separator</td>
                    <td>210 kg/cm²G</td>
                    <td>2.2°C</td>
                    <td>يفصل الأمونيا السائلة نحو V-409 والغاز البارد نحو E-407</td>
                  </tr>
                  <tr>
                    <td><b>V-409</b></td>
                    <td>وعاء تخفيض الضغط Ammonia Letdown Drum</td>
                    <td>21.0 kg/cm²G</td>
                    <td>13°C</td>
                    <td>يفصل غاز الوميض ويرسل السائل إلى V-405</td>
                  </tr>
                  <tr>
                    <td><b>K-401 (LP)</b></td>
                    <td>كباس التثليج - غلاف الضغط المنخفض</td>
                    <td>0.07 -> 2.5 kg/cm²G</td>
                    <td>-32°C -> 55°C</td>
                    <td>يسحب من V-405 ويطرد إلى فاصل السحب الثاني V-406</td>
                  </tr>
                  <tr>
                    <td><b>K-401 (HP)</b></td>
                    <td>كباس التثليج - غلاف الضغط العالي</td>
                    <td>2.5 & 4.4 -> 17.5 kg</td>
                    <td>-8°C -> 110°C</td>
                    <td>يسحب من V-406 و V-407 ويطرد لمكثف الأمونيا E-412</td>
                  </tr>
                  <tr>
                    <td><b>KT-401</b></td>
                    <td>التوربين البخاري الدافع لكباس التثليج</td>
                    <td>38 bar MP Steam</td>
                    <td>-</td>
                    <td>تحكم بالسرعة لتثبيت ضغط سحب المرحلة الأولى V-405</td>
                  </tr>
                  <tr>
                    <td><b>V-405</b></td>
                    <td>فاصل سحب المرحلة الأولى 1st Suction Drum</td>
                    <td>0.07 kg/cm²G</td>
                    <td>-32°C</td>
                    <td>تضخ منه مضخات P-401 A,B الأمونيا السائلة للتخزين</td>
                  </tr>
                  <tr>
                    <td><b>V-406</b></td>
                    <td>فاصل سحب المرحلة الثانية 2nd Suction Drum</td>
                    <td>2.5 kg/cm²G</td>
                    <td>-8°C</td>
                    <td>يستقبل سائل الأمونيا المتسلسل من V-407</td>
                  </tr>
                  <tr>
                    <td><b>V-407</b></td>
                    <td>فاصل سحب المرحلة الثالثة 3rd Suction Drum</td>
                    <td>4.4 kg/cm²G</td>
                    <td>+13°C</td>
                    <td>يستقبل سائل الأمونيا من مستلم المكثف V-408</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Section 2.5.k Interlocks -->
          <div class="v3d-man-section" id="man-sec4-interlocks">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#8b5cf6;color:#ffffff;">2.5.k</span>
              <div>
                <h3>مصفوفة الإنترلوك والإيقاف الاضطراري لحلقة التخليق وكباس K-401 (ESD Matrix)</h3>
                <small>الحماية الشاملة للمفاعل R-401 والضاغط K-401 ضد الحوادث</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>تتم برمجة مصفوفة الإيقاف الاضطراري للقسم الرابع وفق الشروط الحاكمة التالية:</p>
              <ul>
                <li><b>ارتفاع منسوب السائل في فواصل سحب كباس التثليج (V-405, V-406, V-407 LAHH):</b> رحلة فورية لكباس K-401 لحماية الريش من ابتلاع السائل.</li>
                <li><b>ارتفاع درجات حرارة طبقات المفاعل R-401 (Bed 1, 2, 3 TAHH > 530°C):</b> فتح صمامات الإخماد الكظومي وعزل هيتر البدء H-401 فوراً.</li>
                <li><b>انخفاض ضغط زيت التزييت لكباس K-401 (PALL < 1.4 kg/cm²G):</b> رحلة فورية للتوربين KT-401 وتشغيل مضخة الزيت المساعدة.</li>
                <li><b>ارتفاع ضغط طرد كباس التثليج K-401 (PAHH > 19.5 kg/cm²G):</b> فتح صمامات مانع الارتجاف لتفادي الضغط الزائد قبل صمامات الأمان.</li>
                <li><b>ارتفاع منسوب سائل الأمونيا في العازل الأولي V-401 LAHH:</b> لمنع مرور سائل الأمونيا إلى عجلة التدوير بضاغط غاز التخليق K-301.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 3. RENDER STATS & CERTIFICATE VIEW (Identical structure to Section 300)
  // =========================================================================
  private renderStatsView(container: HTMLElement) {
    const total = SECTION_400_EXAM_QUESTIONS.length;
    const answeredCount = this.userAnswers.filter((a) => a !== null).length;
    const correctCount = this.userAnswers.filter((a, idx) => a !== null && a === SECTION_400_EXAM_QUESTIONS[idx].correctIndex).length;
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
            <span class="v3d-sc-val" style="color:#d8b4fe;">${answeredCount}</span>
          </div>
          <div class="v3d-sc-item">
            <span class="v3d-sc-lbl">الإجابات الصحيحة</span>
            <span class="v3d-sc-val" style="color:#10b981;">${correctCount}</span>
          </div>
          <div class="v3d-sc-item">
            <span class="v3d-sc-lbl">الإجابات الخاطئة</span>
            <span class="v3d-sc-val" style="color:#ef4444;">${wrongCount}</span>
          </div>
          <div class="v3d-sc-item highlight" style="border-color:#8b5cf6;">
            <span class="v3d-sc-lbl">النتيجة الإجمالية</span>
            <span class="v3d-sc-val" style="color:${isPassed ? '#10b981' : '#ef4444'};">${scorePct}%</span>
            <span class="v3d-sc-sub">${isPassed ? '✅ مؤهل للاعتماد الكيميائي والتشغيلي' : '⚠️ يحتاج لمراجعة الدليل الفني'}</span>
          </div>
        </div>

        <!-- Student Certificate Generator Box -->
        <div class="v3d-cert-box">
          <div class="v3d-cert-header">
            <h3>🎓 شهادة إتمام التقييم التخصصي لقسم تخليق وتبريد الأمونيا وكباس K-401</h3>
            <p>الهيئة العامة للمهندسين الكيميائيين في البصرة — مجمع أسمدة خور الزبير رقم 3</p>
          </div>

          <div class="v3d-cert-input-row">
            <label for="v3d-sec400-student-name">اسم المهندس / المتدرب:</label>
            <input type="text" id="v3d-sec400-student-name" value="${this.studentName}" placeholder="أدخل اسمك الكامل هنا..." />
            <button id="v3d-sec400-save-name-btn" class="v3d-cert-action-btn" style="background:#8b5cf6;color:#ffffff;">حفظ الاسم وتحديث الشهادة</button>
          </div>

          <!-- Official Diploma Render -->
          <div class="v3d-diploma-paper" id="v3d-sec400-diploma">
            <div class="v3d-dip-border" style="border-color:#8b5cf6;">
              <div class="v3d-dip-logo">⚛️</div>
              <div class="v3d-dip-title" style="color:#c084fc;">شهادة كفاءة مهنية في تشغيل وهندسة حلقة تخليق الأمونيا ومنظومة التثليج</div>
              <div class="v3d-dip-sub">Professional Proficiency Certificate in Ammonia Synthesis & Refrigeration (Section 400 / R-401 & K-401)</div>

              <div class="v3d-dip-body">
                <p>تشهد إدارة التدريب الهندسي بمجمع الأسمدة بأن المهندس:</p>
                <h2 id="v3d-sec400-cert-name-display" style="color:#e9d5ff;">${this.studentName}</h2>
                <p>
                  قد أتم بنجاح الاختبار التخصصي الشامل المكون من <b>100 سؤال هندسي وعملياتي معمق</b>،
                  المشتقة من دليل التشغيل المعتمد (Dwg. 6112P-100-400-00 - صفحات C-15 إلى C-22)،
                  والخاصة بمفاعل تخليق الأمونيا R-401، وشبكة استرجاع الحرارة والتكثيف الأولي والثانوي،
                  وكباس التثليج K-401 ذي الغلافين والتوربين KT-401، ومستويات التبخير الثلاثة، وفواصل السحب، ومنظومة مانع الارتجاف.
                </p>

                <div class="v3d-dip-meta">
                  <div class="v3d-dm-col">
                    <span>درجة الامتحان: <b>${scorePct}%</b></span>
                    <span>التقييم: <b>${isPassed ? 'ناجح ومؤهل للتشغيل الميداني وغرفة السيطرة' : 'مستمع / تحت التدريب'}</b></span>
                  </div>
                  <div class="v3d-dm-col">
                    <span>التاريخ: <b>${new Date().toLocaleDateString('ar-EG')}</b></span>
                    <span>الرقم المرجعي: <b>NH3-SEC400-CERT-${Date.now().toString().slice(-6)}</b></span>
                  </div>
                </div>

                <div class="v3d-dip-signatures">
                  <div class="v3d-sig-box">
                    <span>رئيس قسم تخليق وتبريد الأمونيا</span>
                    <b>م. كيميائي استشاري</b>
                  </div>
                  <div class="v3d-sig-box">
                    <span>مدير إدارة تشغيل مجمع الأمونيا</span>
                    <b>الإدارة الهندسية العامة</b>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="v3d-cert-footer-actions">
            <button id="v3d-sec400-print-cert-btn" class="v3d-btn-print">🖨️ طباعة الشهادة الرسمية أو الحفظ كـ PDF</button>
            <button id="v3d-sec400-back-exam-btn" class="v3d-btn-back-exam" style="border-color:#8b5cf6;color:#d8b4fe;">📝 العودة للأسئلة لتحسين الدرجة</button>
          </div>
        </div>
      </div>
    `;

    // Event Listeners for Name Save and Print
    document.getElementById('v3d-sec400-save-name-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      const input = document.getElementById('v3d-sec400-student-name') as HTMLInputElement;
      if (input && input.value.trim()) {
        this.studentName = input.value.trim();
        localStorage.setItem('nh3_student_name', this.studentName);
        const nameDisp = document.getElementById('v3d-sec400-cert-name-display');
        if (nameDisp) nameDisp.textContent = this.studentName;
        alert('تم تحديث الاسم في الشهادة بنجاح!');
      }
    });

    document.getElementById('v3d-sec400-print-cert-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      window.print();
    });

    document.getElementById('v3d-sec400-back-exam-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('exam');
    });
  }

  // =========================================================================
  // HELPER: Filter Questions
  // =========================================================================
  private getFilteredQuestions(): ExamQuestion[] {
    if (this.selectedCategory === 'all') {
      return SECTION_400_EXAM_QUESTIONS;
    }
    return SECTION_400_EXAM_QUESTIONS.filter((q) => q.category === this.selectedCategory);
  }

  // =========================================================================
  // STYLES INJECTION (Self-contained, responsive, industrial theme matching Sec 300)
  // =========================================================================
  private injectStyles() {
    if (document.getElementById('v3d-sec400-exam-styles')) return;

    const style = document.createElement('style');
    style.id = 'v3d-sec400-exam-styles';
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
        border: 2px solid #8b5cf6;
        border-radius: 12px;
        box-shadow: 0 16px 50px rgba(0, 0, 0, 0.85);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .v3d-exam-header {
        background: #071728;
        border-bottom: 2px solid #8b5cf6;
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
        color: #d8b4fe;
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
        background: #8b5cf6;
        color: #ffffff;
        border-color: #8b5cf6;
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
        color: #d8b4fe;
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
        background: rgba(139, 92, 246, 0.22);
        border-color: #8b5cf6;
        color: #d8b4fe;
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
      .v3d-qmatrix-header small { color: #d8b4fe; font-family: monospace; }

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
        border-color: #8b5cf6;
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
        box-shadow: 0 0 0 2px #8b5cf6;
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
        background: rgba(139, 92, 246, 0.18);
        border: 1px solid #8b5cf6;
        color: #d8b4fe;
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
        background: #8b5cf6;
        color: #ffffff;
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
        background: #8b5cf6;
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
        background: #17153a;
        border-color: #8b5cf6;
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
        background: #17153a;
        border-color: #8b5cf6;
        color: #d8b4fe;
      }
      .v3d-qnav-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .v3d-qnav-btn.jump-unsolved {
        background: rgba(139, 92, 246, 0.18);
        border-color: #8b5cf6;
        color: #d8b4fe;
      }
      .v3d-qnav-center-info { font-size: 11.5px; color: #94a3b8; }
      .v3d-qnav-center-info b { color: #d8b4fe; font-family: monospace; }

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
        color: #d8b4fe;
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
        background: #17153a;
        color: #ffffff;
        border-color: #8b5cf6;
      }
      .v3d-mnav-link.highlight {
        border-color: #8b5cf6;
        color: #d8b4fe;
        background: rgba(139, 92, 246, 0.14);
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
        border-right: 4px solid #8b5cf6;
        padding: 16px 20px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .v3d-mb-badge {
        font-size: 11px;
        font-family: monospace;
        background: #8b5cf6;
        color: #ffffff;
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
        background: #8b5cf6;
        color: #ffffff;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 12px;
        font-family: monospace;
      }
      .v3d-man-sec-title h3 { margin: 0; font-size: 15px; color: #d8b4fe; font-weight: 700; }
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
        border-right: 3px solid #8b5cf6;
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
      .v3d-mg-card h4 { margin: 0 0 6px 0; color: #d8b4fe; font-size: 12px; }
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
        color: #d8b4fe;
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
        background: rgba(139, 92, 246, 0.1);
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
      .v3d-cert-header h3 { margin: 0; color: #d8b4fe; font-size: 16px; }
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
        border: 2px solid #8b5cf6;
        padding: 16px;
        border-radius: 8px;
        box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.6);
      }
      .v3d-dip-border {
        border: 1px dashed rgba(139, 92, 246, 0.4);
        padding: 24px;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 12px;
        border-radius: 6px;
      }
      .v3d-dip-logo { font-size: 36px; }
      .v3d-dip-title { font-size: 18px; font-weight: 800; color: #d8b4fe; }
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
      .v3d-dm-col b { color: #d8b4fe; font-family: monospace; }
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
        background: rgba(139, 92, 246, 0.15);
        border: 1px solid #8b5cf6;
        color: #d8b4fe;
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
          border-left: 2px solid #8b5cf6;
          overflow-y: auto;
        }
        .v3d-drawer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid #163654;
        }
        .v3d-dt-title { font-weight: bold; color: #d8b4fe; font-size: 13px; }
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

export const section400ExamCenter = Section400ExamCenterUI.getInstance();
