import { SECTION_100_EXAM_QUESTIONS, ExamQuestion } from './Section100MasterExam';
import { plantAudio } from './PlantAudio';

export class Section100ExamCenterUI {
  private static instance: Section100ExamCenterUI | null = null;
  private modalEl: HTMLElement | null = null;
  private activeTab: 'exam' | 'manual' | 'stats' = 'exam';
  private currentQuestionIndex: number = 0;
  private userAnswers: (number | null)[] = new Array(SECTION_100_EXAM_QUESTIONS.length).fill(null);
  private selectedCategory: string = 'all';
  private isMobileDrawerOpen: boolean = false;
  private studentName: string = localStorage.getItem('nh3_student_name') || 'مهندس كيميائي متدرب';

  public static getInstance(): Section100ExamCenterUI {
    if (!Section100ExamCenterUI.instance) {
      Section100ExamCenterUI.instance = new Section100ExamCenterUI();
    }
    return Section100ExamCenterUI.instance;
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

    let existingModal = document.getElementById('v3d-sec100-exam-modal');
    if (existingModal) {
      this.modalEl = existingModal;
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'v3d-sec100-exam-modal';
    modal.className = 'v3d-exam-modal';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="v3d-exam-card">
        <!-- Header -->
        <div class="v3d-exam-header">
          <div class="v3d-exam-title-box">
            <button class="v3d-exam-close-btn" id="v3d-exam-close" title="إغلاق الشاشة">✕</button>
            <div class="v3d-exam-header-txt">
              <h2>🔥 بنك الـ 100 سؤال واختبار القسم 100</h2>
              <small>قسم تحويل الغاز والإصلاح ومفاعلات التحويل — مجمع أسمدة خور الزبير رقم 3</small>
            </div>
            <span class="v3d-exam-badge">Dwg. 6112P (C-2..C-8)</span>
          </div>

          <div class="v3d-exam-header-tabs">
            <button class="v3d-exam-htab on" id="v3d-extab-exam">📝 بنك الـ 100 سؤال</button>
            <button class="v3d-exam-htab" id="v3d-extab-manual">📖 كتيب التشغيل C-2</button>
            <button class="v3d-exam-htab" id="v3d-extab-stats">📊 النتيجة والشهادة</button>
          </div>
        </div>

        <!-- Body Area -->
        <div class="v3d-exam-body" id="v3d-exam-content">
          <!-- Dynamic Content -->
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;

    // Attach Header Tabs & Close
    document.getElementById('v3d-exam-close')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.close();
    });

    document.getElementById('v3d-extab-exam')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('exam');
    });

    document.getElementById('v3d-extab-manual')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('manual');
    });

    document.getElementById('v3d-extab-stats')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('stats');
    });

    this.injectStyles();
  }

  public open(tab: 'exam' | 'manual' | 'stats' = 'exam', questionIndex: number = 0) {
    if (!this.modalEl || !document.getElementById('v3d-sec100-exam-modal')) {
      this.createModalDOM();
    }
    if (this.modalEl) {
      this.modalEl.style.display = 'flex';
      this.currentQuestionIndex = Math.max(0, Math.min(questionIndex, SECTION_100_EXAM_QUESTIONS.length - 1));
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

  private switchTab(tab: 'exam' | 'manual' | 'stats') {
    this.activeTab = tab;
    document.getElementById('v3d-extab-exam')?.classList.toggle('on', tab === 'exam');
    document.getElementById('v3d-extab-manual')?.classList.toggle('on', tab === 'manual');
    document.getElementById('v3d-extab-stats')?.classList.toggle('on', tab === 'stats');

    const container = document.getElementById('v3d-exam-content');
    if (!container) return;

    if (tab === 'exam') {
      this.renderExamView(container);
    } else if (tab === 'manual') {
      this.renderManualView(container);
    } else {
      this.renderStatsView(container);
    }
  }

  // =========================================================================
  // 1. RENDER 100-QUESTION EXAM VIEW
  // =========================================================================
  private renderExamView(container: HTMLElement) {
    const q = SECTION_100_EXAM_QUESTIONS[this.currentQuestionIndex];
    const total = SECTION_100_EXAM_QUESTIONS.length;
    const answeredCount = this.userAnswers.filter((a) => a !== null).length;
    let correctCount = 0;
    this.userAnswers.forEach((ans, idx) => {
      if (ans === SECTION_100_EXAM_QUESTIONS[idx].correctIndex) correctCount++;
    });
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    const categories = [
      { key: 'all', label: `كافة الموضوعات (${total})` },
      { key: 'gas_reception', label: '1. استقبال وضغط الغاز (1-10)' },
      { key: 'desulfurization', label: '2. إزالة الكبريت والهدرجة (11-20)' },
      { key: 'steam_mixing', label: '3. خلط البخار ومسخن E-101 (21-30)' },
      { key: 'primary_reformer', label: '4. الفرن الأولي R-101 (31-45)' },
      { key: 'convection_zone', label: '5. منطقة الحمل والمدخنة (46-55)' },
      { key: 'secondary_reformer', label: '6. المصلح الثانوي R-103 (56-70)' },
      { key: 'boiler_e108', label: '7. غلاية E-108 وبخار 71 كغم (71-80)' },
      { key: 'hts_converter', label: '8. محول HTS R-104 (81-88)' },
      { key: 'heat_recovery_train', label: '9. استرجاع الطاقة E-109/107/110 (89-94)' },
      { key: 'lts_converter', label: '10. محول LTS R-105 والميثنة (95-100)' }
    ];

    const currentAnswer = this.userAnswers[this.currentQuestionIndex];
    const isAnswered = currentAnswer !== null;
    const isCorrect = isAnswered && currentAnswer === q.correctIndex;

    const sidebarHTML = `
      <div class="v3d-sidebar-inner">
        <!-- Close button inside mobile drawer -->
        <div class="v3d-drawer-top">
          <div class="v3d-dt-title">📑 فهرس الـ 100 سؤال والتصفية</div>
          <button id="v3d-close-drawer-btn" class="v3d-drawer-x-btn">✕ إغلاق</button>
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
          <span class="v3d-filter-header">تصفية حسب المحطة الهندسية:</span>
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
          ${SECTION_100_EXAM_QUESTIONS.map((item, idx) => {
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
          <button id="v3d-reset-exam-btn" class="v3d-btn-reset">↺ إعادة ضبط كافة الإجابات</button>
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
        <div id="v3d-mobile-drawer" class="v3d-mobile-drawer-sheet ${this.isMobileDrawerOpen ? 'open' : ''}">
          <div class="v3d-drawer-backdrop" id="v3d-drawer-backdrop"></div>
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
            <button id="v3d-open-drawer-btn" class="v3d-mq-btn">
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
                    optState = 'correct-opt';
                  } else if (optIdx === currentAnswer) {
                    optState = 'wrong-opt';
                  }
                }

                return `
                  <div class="v3d-q-opt ${optState} ${currentAnswer === optIdx ? 'selected' : ''}" data-optidx="${optIdx}">
                    <span class="v3d-opt-letter">${['أ', 'ب', 'ج', 'د'][optIdx]}</span>
                    <span class="v3d-opt-txt">${opt}</span>
                    ${isAnswered && optIdx === q.correctIndex ? '<span class="v3d-opt-indicator-ok">✓ الإجابة الصحيحة</span>' : ''}
                    ${isAnswered && optIdx === currentAnswer && !isCorrect ? '<span class="v3d-opt-indicator-err">✗ اختيار غير صحيح</span>' : ''}
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Detailed Answer Feedback Card with Reference & Explanation -->
            ${isAnswered ? `
              <div class="v3d-q-feedback-card ${isCorrect ? 'fb-correct' : 'fb-wrong'}">
                <div class="v3d-fb-header">
                  <span class="v3d-fb-icon">${isCorrect ? '✅' : '❌'}</span>
                  <div class="v3d-fb-status">
                    ${isCorrect ? 'إجابة صحيحة ومطابقة لكتيب التشغيل الرسمي!' : 'إجابة غير صحيحة!'}
                  </div>
                </div>

                ${!isCorrect ? `
                  <div class="v3d-fb-correct-reveal">
                    <b>الإجابة الصحيحة المعتمدة هي:</b> 
                    <span class="v3d-reveal-opt">${['أ', 'ب', 'ج', 'د'][q.correctIndex]}. ${q.options[q.correctIndex]}</span>
                  </div>
                ` : ''}

                <div class="v3d-fb-explanation">
                  <b>💡 التحليل والتوضيح الهندسي:</b>
                  <p>${q.explanation}</p>
                </div>

                <div class="v3d-fb-reference">
                  📚 <b>المرجع في كتيب التشغيل:</b> <span>${q.technicalReference}</span>
                </div>
              </div>
            ` : `
              <div class="v3d-q-hint-box">
                💡 انقر على أحد الخيارات أعلاه لتأكيد إجابتك، وسيقوم النظام بتصحيحها فوراً مع الشرح والتحليل الفني والمرجع الرسمي.
              </div>
            `}

            <!-- Navigation Actions -->
            <div class="v3d-q-actions-bar">
              <button id="v3d-q-prev-btn" class="v3d-btn-nav" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
                ◀ السابق
              </button>
              
              <button id="v3d-q-next-unsolved-btn" class="v3d-btn-nav v3d-btn-gold">
                ⏭ غير المحلول (${total - answeredCount})
              </button>

              <button id="v3d-q-next-btn" class="v3d-btn-nav v3d-btn-primary" ${this.currentQuestionIndex === total - 1 ? 'disabled' : ''}>
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
        const q = SECTION_100_EXAM_QUESTIONS[this.currentQuestionIndex];
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
    document.getElementById('v3d-open-drawer-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.isMobileDrawerOpen = true;
      const drawer = document.getElementById('v3d-mobile-drawer');
      if (drawer) drawer.classList.add('open');
    });

    const closeDrawer = () => {
      this.isMobileDrawerOpen = false;
      const drawer = document.getElementById('v3d-mobile-drawer');
      if (drawer) drawer.classList.remove('open');
    };

    document.getElementById('v3d-close-drawer-btn')?.addEventListener('click', closeDrawer);
    document.getElementById('v3d-drawer-backdrop')?.addEventListener('click', closeDrawer);

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
    document.getElementById('v3d-q-prev-btn')?.addEventListener('click', () => {
      if (this.currentQuestionIndex > 0) {
        plantAudio.playClick();
        this.currentQuestionIndex--;
        this.renderExamView(container);
      }
    });

    // Next Button
    document.getElementById('v3d-q-next-btn')?.addEventListener('click', () => {
      if (this.currentQuestionIndex < SECTION_100_EXAM_QUESTIONS.length - 1) {
        plantAudio.playClick();
        this.currentQuestionIndex++;
        this.renderExamView(container);
      }
    });

    // Next Unsolved
    document.getElementById('v3d-q-next-unsolved-btn')?.addEventListener('click', () => {
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
    document.getElementById('v3d-reset-exam-btn')?.addEventListener('click', () => {
      if (confirm('هل أنت متأكد من إعادة ضبط كافة الإجابات وبدء الاختبار من جديد؟')) {
        plantAudio.playClick();
        this.userAnswers = new Array(SECTION_100_EXAM_QUESTIONS.length).fill(null);
        this.currentQuestionIndex = 0;
        this.isMobileDrawerOpen = false;
        this.renderExamView(container);
      }
    });
  }

  // =========================================================================
  // 2. RENDER OPERATIONAL MANUAL & PARAMETERS MATCH VIEW
  // =========================================================================
  private renderManualView(container: HTMLElement) {
    container.innerHTML = `
      <div class="v3d-manual-layout">
        <div class="v3d-manual-sidebar">
          <div class="v3d-manual-nav-title">📑 الفهرس التكنولوجي (6112P-100-100-00)</div>
          <a href="#man-sec-21" class="v3d-mnav-link">2.1 إدخال الغاز الطبيعي وضغطه</a>
          <a href="#man-sec-22a" class="v3d-mnav-link">2.2.a إزالة الكبريت والهدرجة الحفزية</a>
          <a href="#man-sec-22b" class="v3d-mnav-link">2.2.b الفرن الأولي R-101 والتغذية</a>
          <a href="#man-sec-22c" class="v3d-mnav-link">2.2.c المصلح الثانوي R-103 وضخ الهواء</a>
          <a href="#man-sec-23a" class="v3d-mnav-link">2.3.a التحويل العالي HTS R-104 ومرجل E-108</a>
          <a href="#man-sec-23b" class="v3d-mnav-link">2.3.b تجزئة الغاز واسترجاع الحرارة</a>
          <a href="#man-sec-23c" class="v3d-mnav-link">2.3.c التحويل الواطئ LTS R-105 والميثنة</a>
          <a href="#man-sec-table" class="v3d-mnav-link">📊 جدول مطابقة درجات الحرارة والضغوط</a>
        </div>

        <div class="v3d-manual-content">
          <!-- 2.1 -->
          <div class="v3d-msec" id="man-sec-21">
            <h3 class="v3d-msec-title">2.1 إدخال الغاز الطبيعي وضغطه (Introduction of Natural Gas to Plant)</h3>
            <p>يدخل الغاز الطبيعي الخام إلى حدود بطارية المصنع بضغط يتراوح بين <b>20 إلى 39 كغم/سم² قياسي (20 to 39 Kg/cm²G)</b>.</p>
            <div class="v3d-mcallout">
              <ul>
                <li><b>غاز التغذية (Process Feedstock):</b> يتم تخفيض ضغطه بواسطة صمام ومتحكم السيطرة <b>PICA-001</b> إلى حوالي <b>19 كغم/سم² قياسي</b> ويغذى مباشرة إلى ضاغط الغاز الطبيعي <b>K-303</b>.</li>
                <li><b>غاز الوقود (Fuel Gas):</b> يتم تخفيض ضغطه بواسطة <b>PICA-101</b> إلى حوالي <b>3 كغم/سم² قياسي</b> ويجهز إلى: مرجل الضغط العالي، الفرن الأولي R-101، مسخن الغاز H-101، ومسخن بدء التشغيل H-401.</li>
                <li><b>ضغط مشاعل الفرن (Burners Fuel):</b> يخفض ضغط غاز وقود مشاعل الفرن الأولي إلى حوالي <b>1.1 كغم/سم² قياسي</b> بواسطة PIC-106, PIC-115, PIC-117.</li>
              </ul>
            </div>
          </div>

          <!-- 2.2.a -->
          <div class="v3d-msec" id="man-sec-22a">
            <h3 class="v3d-msec-title">2.2.a إزالة الكبريت والهدرجة (Desulfurization)</h3>
            <p>يحتوي الغاز الخام على مركبات الكبريت (كبريتيد الهيدروجين H2S والميركابتانات Mercaptans) التي تعتبر سموماً قاتلة لمحفزات النيكل والحديد. حتى بضعة أجزاء بالمليون (ppm) كفيلة بتعطيل المحفز تماماً.</p>
            <div class="v3d-mcallout">
              <ul>
                <li><b>تدوير الهيدروجين:</b> يتم تدوير الهيدروجين من ضاغط غاز التخليق <b>K-301</b> ويخلط مع الغاز الطبيعي.</li>
                <li><b>المسخن المباشر H-101:</b> يسخن الخليط إلى <b>380°C - 400°C</b> ويسيطر على حرارة دخول مفاعل إزالة الكبريت بواسطة <b>TIC-102</b>.</li>
                <li><b>المفاعلات R-102AB:</b> تحتوي على طبقة هدرجة (Co-Mo) تحول الكبريت العضوي إلى H2S، تليها طبقة امتصاص من أكسيد الزنك (ZnO) لخفض الكبريت إلى <b>أقل من 0.2 ppm وزناً</b>:
                  <div style="font-family:monospace;color:#f59e0b;margin-top:4px;">R-SH + H2 → RH + H2S &nbsp;|&nbsp; H2S + ZnO → ZnS + H2O</div>
                </li>
              </ul>
            </div>
          </div>

          <!-- 2.2.b -->
          <div class="v3d-msec" id="man-sec-22b">
            <h3 class="v3d-msec-title">2.2.b فرن الإصلاح الأولي R-101 ومسخن التغذية E-101 (Primary Reforming)</h3>
            <p>يغادر الغاز منزوع الكبريت مفاعل R-102AB عند حرارة <b>385°C</b> عبر صمام التدفق <b>FCV-105</b>، ويخلط مع بخار محمص بدرجة <b>380°C</b> منظم بالمتحكم <b>FRCA-103</b> (مع إنذارات انخفاض الجريان FI-HC-104/106).</p>
            <div class="v3d-mcallout">
              <ul>
                <li><b>مسخن التغذية E-101:</b> يتدفق خليط الغاز والبخار بضغط <b>36 كغم/سم²</b> إلى E-101 ليسخن بغازات العادم إلى <b>520°C</b> (تسجل بـ <b>TRA-121-3</b>).</li>
                <li><b>هيكل الفرن R-101:</b> طراز توبسو (Topsoe Induced Draft Box Heater) يضم <b>200 أنبوب محشو بالمحفز</b> مثبتة عمودياً في حجرتي احتراق منفصلتين (100 أنبوب لكل حجرة).</li>
                <li><b>المشاعل الجدارية:</b> مشاعل إشعاعية موزعة على <b>6 صفوف أفقية</b> في الجدران الرأسية الطولية (480 مشعل)، وهي ذاتية السحب للهواء المحيط، وتعمل بضغط وقود <b>1.1 كغم/سم²</b>. الصفان السفليان يغذيان بخط منفصل للحفاظ على إشعال جزئي عند توقف الفرن.</li>
                <li><b>ظروف المخرج:</b> يخرج غاز العمليات من قاع الأنابيب بضغط <b>31 كغم/سم²</b> ودرجة حرارة <b>795°C</b> (وتسجل درجات المجمعات الخمسة بـ TR-101 1-5)، مع ميثان متبقي <b>9.86% بالحجم جاف</b>.</li>
                <li><b>غازات العادم:</b> تغادر حجرات الاحتراق بحرارة <b>1030°C</b> (تسجل بـ <b>TRA-101-8</b> مع إنذار حرارة عالية). مروحتا السحب <b>K-101AB</b> (إحداهما بتوربين بخاري والأخرى بمحرك كهربائي) تضبطان سحباً سالباً طفيفاً بـ <b>PIC-102</b> ونسبة الأكسجين بـ <b>AR-102</b>.</li>
              </ul>
            </div>
          </div>

          <!-- 2.2.c -->
          <div class="v3d-msec" id="man-sec-22c">
            <h3 class="v3d-msec-title">2.2.c المصلح الثانوي R-103 وضخ الهواء (Secondary Reforming)</h3>
            <p>يمر الغاز الخارج من R-101 بحرارة 795°C عبر خط التحويل المبطن بالطوب الحراري (TRA-101-6) إلى المصلح الثانوي R-103.</p>
            <div class="v3d-mcallout">
              <ul>
                <li><b>هواء العملية:</b> يضخ بواسطة ضاغط الهواء <b>K-302</b> ويسخن في <b>E-102</b> إلى <b>550°C</b> (تسجل بـ <b>TRA-121-4</b>).</li>
                <li><b>مشعل القمة والاحتراق الجزئي:</b> يختلط الهواء المسخن بالغاز في مشعل القمة ليحدث احتراق جزئي رافعاً الحرارة فوراً إلى <b>1100°C - 1150°C</b>.</li>
                <li><b>نسبة الهيدروجين إلى النيتروجين 3:1:</b> يضبط معدل تدفق الهواء بدقة بواسطة المتحكم <b>FRCA-107</b> للحفاظ على النسبة المتكافئة لتخليق الأمونيا.</li>
                <li><b>طبقة المحفز والمخرج:</b> يتدفق الغاز لأسفل عبر حشوة محفز النيكل، ويهبط الميثان إلى <b>0.3% بالحجم جاف</b> والحرارة إلى <b>969°C</b> عند ضغط <b>30 كغم/سم²</b> ليخرج من منتصف بدن المفاعل.</li>
              </ul>
            </div>
          </div>

          <!-- 2.3.a -->
          <div class="v3d-msec" id="man-sec-23a">
            <h3 class="v3d-msec-title">2.3.a غلاية E-108 ومفاعل التحويل العالي HTS R-104</h3>
            <p>يدخل غاز R-103 بحرارة 969°C إلى جانب الغلاف لمرجل <b>E-108</b> حيث يبرد سريعاً إلى <b>365°C</b> منتجاً بخاراً عالي الضغط بضغط <b>71 كغم/سم² قياسي</b> مرتبطاً بطبلة V-102A.</p>
            <div class="v3d-mcallout">
              <ul>
                <li><b>محول HTS R-104:</b> يمر الغاز عبر حشوة محفز من أكاسيد الحديد والكروم (Fe-Cr) حيث يتفاعل <b>75% من CO طارداً للحرارة</b> مع البخار لإنتاج الهيدروجين وCO2:
                  <div style="font-family:monospace;color:#00e5aa;margin-top:4px;">CO + H2O ⇌ CO2 + H2 + Heat</div>
                </li>
                <li><b>تركيز CO والمخرج:</b> ينخفض تركيز CO إلى <b>2.8%</b> وترتفع حرارة الغاز إلى حوالي <b>390°C</b>.</li>
              </ul>
            </div>
          </div>

          <!-- 2.3.b -->
          <div class="v3d-msec" id="man-sec-23b">
            <h3 class="v3d-msec-title">2.3.b تجزئة الغاز واسترجاع الحرارة (E-109 / E-107 / E-110)</h3>
            <p>يتم تجزئة التيار الخارج من R-104 إلى قسمين محكومين بحرارة دخول مفاعل الميثنة R-106:</p>
            <div class="v3d-mcallout">
              <ul>
                <li><b>الحصة الكبرى:</b> تمر عبر أنابيب غلاية الغاز المحول <b>E-109</b> وتبرد إلى <b>285°C</b> منتجة بخاراً بضغط <b>71 كغم/سم² قياسي</b>.</li>
                <li><b>الحصة الصغرى:</b> تمر عبر أنابيب مسخن غاز الميثنة <b>E-107</b> لتسخين الغاز الذاهب إلى الميثانايتر R-106.</li>
                <li><b>إعادة التوحيد ومرجل E-110:</b> يلتقي التياران ويدخلان أفقياً ومحورياً إلى أنابيب مرجل الضغط المنخفض <b>E-110</b> ليبردا إلى <b>215°C</b> مع إنتاج بخار منخفض الضغط <b>12 كغم/سم² قياسي</b> يصدّر عبر طبلة <b>V-109</b>.</li>
              </ul>
            </div>
          </div>

          <!-- 2.3.c -->
          <div class="v3d-msec" id="man-sec-23c">
            <h3 class="v3d-msec-title">2.3.c فاصل المتكاثف V-101 ومفاعل التحويل الواطئ LTS R-105</h3>
            <p>يدخل الغاز الخارج من E-110 إلى عازل المتكاثف <b>V-101</b> لفصل الرطوبة السائلة، ثم يدخل قمة مفاعل التحويل الثانوي <b>R-105</b> عند 215°C عبر فوهة القمة العلوية، <b>ويخرج خط الغاز المتحول أيضاً من قمة المفاعل العلوية (من فوق وليس من أسفل)</b> متجهاً عبر مسار الأنابيب إلى قسم 200 كاتاكارب.</p>
            <div class="v3d-mcallout">
              <ul>
                <li><b>خروج الغاز من قمة المفاعل (من فوق وليس من أسفل):</b> فوهة خروج الغاز المتحول تقع في القمة العلوية للمفاعل بجوار فوهة الدخول، بينما فتحة القاع السفلية مخصصة لتفريغ العامل المساعد ومزودة بفلنجة صماء (Blind Flange) بدون أنابيب غاز تشغيلي.</li>
                <li><b>حشوة حماية الكبريت (Sulfur Guard):</b> يمر الغاز أولاً عبر طبقة حماية علوية لحجز أي أثر للكبريت أو الكلور، ثم عبر طبقة محفز نحاس-زنك (Cu-Zn) عالي الحساسية لخفض CO إلى <b>0.33%</b>.</li>
                <li><b>الانتقال إلى قسم 200 والميثنة:</b> يغادر الغاز من القمة متجهاً إلى قسم كاتاكارب لإزالة CO2، ثم يعود ليسخن في E-106 و E-107 إلى 275°C قبل دخوله الميثانايتر R-106 لتحويل بقايا أكاسيد الكربون إلى ميثان (&lt; 5 ppm).</li>
              </ul>
            </div>
          </div>

          <!-- TABLE -->
          <div class="v3d-msec" id="man-sec-table">
            <h3 class="v3d-msec-title">📊 جدول المطابقة الرقمية الكاملة لدرجات الحرارة والضغوط والمتحكمات</h3>
            <table class="v3d-param-table">
              <thead>
                <tr>
                  <th>الموقع / المعدة</th>
                  <th>درجة الحرارة</th>
                  <th>الضغط التشغيلي</th>
                  <th>المتحكم / الأجهزة</th>
                  <th>الحالة الكيميائية وملاحظات التشغيل</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>مدخل الغاز الطبيعي (V-115)</td>
                  <td>جوية (35°C)</td>
                  <td>20 - 39 kg/cm²G</td>
                  <td>PICA-001 (19 kg)</td>
                  <td>تخفيض ضغط التغذية وتصفيته قبل K-303</td>
                </tr>
                <tr>
                  <td>مسخن الغاز المباشر H-101</td>
                  <td>380°C - 400°C</td>
                  <td>38.5 kg/cm²G</td>
                  <td>TIC-102 / HC-103</td>
                  <td>خلط الهيدروجين المدوّر لتنشيط هدرجة الكبريت</td>
                </tr>
                <tr>
                  <td>مفاعلات إزالة الكبريت R-102AB</td>
                  <td>380°C - 385°C</td>
                  <td>37.5 kg/cm²G</td>
                  <td>FCV-105</td>
                  <td>هدرجة وامتصاص الكبريت: S &lt; 0.2 ppm wt</td>
                </tr>
                <tr>
                  <td>حقن البخار المحمص ومسخن E-101</td>
                  <td>520°C (380°C steam)</td>
                  <td>36.0 kg/cm²G</td>
                  <td>FRCA-103 / TRA-121-3</td>
                  <td>خلط البخار بنسبة S/C = 3.2 والتسخين بالغاز العادم</td>
                </tr>
                <tr>
                  <td>مخرج الفرن الأولي R-101</td>
                  <td>795°C (أو 750°C)</td>
                  <td>31.0 kg/cm²G</td>
                  <td>TR-101 1-5 / PdR-104</td>
                  <td>200 أنبوب HK-40 / ميثان متبقي 9.86% vol dry</td>
                </tr>
                <tr>
                  <td>غازات عادم الفرن (Flue Gas)</td>
                  <td>1030°C</td>
                  <td>سحب خفيف (-2 mm H2O)</td>
                  <td>TRA-101-8 / PIC-102</td>
                  <td>مراوح K-101AB ومحلل الأكسجين AR-102</td>
                </tr>
                <tr>
                  <td>هواء العملية ومسخن E-102</td>
                  <td>550°C</td>
                  <td>32.0 kg/cm²G</td>
                  <td>TRA-121-4 / FRCA-107</td>
                  <td>ضاغط K-302 / ضبط نسبة H2:N2 = 3:1 بدقة</td>
                </tr>
                <tr>
                  <td>المصلح الثانوي R-103</td>
                  <td>1150°C قمّة -> 969°C قاع</td>
                  <td>30.0 kg/cm²G</td>
                  <td>FRCA-107 / TRA-101-6</td>
                  <td>احتراق جزئي + إصلاح حفزي / ميثان 0.3% vol dry</td>
                </tr>
                <tr>
                  <td>غلاية الحرارة المهدرة E-108</td>
                  <td>365°C</td>
                  <td>71 kg/cm²G steam</td>
                  <td>V-102A Drum Loops</td>
                  <td>تبريد سريع لمنع تفكك الغاز وإنتاج بخار HP</td>
                </tr>
                <tr>
                  <td>محول التحويل العالي HTS R-104</td>
                  <td>365°C مدخل -> 390°C مخرج</td>
                  <td>29.0 kg/cm²G</td>
                  <td>Inlet Temp Trim</td>
                  <td>محفز Fe-Cr / تحويل 75% من CO إلى 2.8%</td>
                </tr>
                <tr>
                  <td>غلاية الغاز المحول E-109</td>
                  <td>285°C</td>
                  <td>71 kg/cm²G steam</td>
                  <td>V-102A System</td>
                  <td>استرجاع حرارة التفاعل وتوليد بخار 71 كغم</td>
                </tr>
                <tr>
                  <td>مسخن غاز الميثنة E-107</td>
                  <td>265°C (Tube) | 310°C (Shell)</td>
                  <td>28.5 kg/cm²G</td>
                  <td>TIC-107 Trim</td>
                  <td>تسخين تيار التغذية الذاهب لمفاعل الميثنة R-106</td>
                </tr>
                <tr>
                  <td>مرجل الضغط المنخفض E-110</td>
                  <td>215°C (أو 185°C)</td>
                  <td>12 kg/cm²G steam</td>
                  <td>V-109 Drum / PIC-109</td>
                  <td>توليد بخار منخفض الضغط 12 كغم/سم²</td>
                </tr>
                <tr>
                  <td>عازل المتكاثف V-101</td>
                  <td>215°C</td>
                  <td>27.5 kg/cm²G</td>
                  <td>LIC-101</td>
                  <td>فصل أي رطوبة متكاثفة لحماية محفز النحاس</td>
                </tr>
                <tr>
                  <td>محول التحويل الواطئ LTS R-105</td>
                  <td>215°C مدخل -> 220°C مخرج</td>
                  <td>27.0 kg/cm²G</td>
                  <td>R-105 Loop Trim</td>
                  <td>محفز Cu-Zn / خفض CO إلى 0.33% vol dry</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 3. RENDER STATS & CERTIFICATE VIEW
  // =========================================================================
  private renderStatsView(container: HTMLElement) {
    const total = SECTION_100_EXAM_QUESTIONS.length;
    const answeredCount = this.userAnswers.filter((a) => a !== null).length;
    let correctCount = 0;
    this.userAnswers.forEach((ans, idx) => {
      if (ans === SECTION_100_EXAM_QUESTIONS[idx].correctIndex) correctCount++;
    });
    const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const isPassed = scorePct >= 60;

    container.innerHTML = `
      <div class="v3d-stats-layout">
        <!-- Controls Column -->
        <div class="v3d-cert-controls">
          <h3 style="color:#00c8ef;margin-bottom:12px;font-size:15px;">🎓 إعداد وتخصيص الشهادة الأكاديمية</h3>
          <p style="font-size:12px;color:#94a3b8;margin-bottom:16px;">
            أدخل اسمك وبياناتك لإصدار وثيقة تقييم واجتياز اختبار قسم 100 المعتمدة معتمدة بختم الكفاءة الهندسية:
          </p>

          <div style="margin-bottom:14px;">
            <label style="font-size:11px;color:#cbd5e1;display:block;margin-bottom:6px;font-weight:bold;">اسم المهندس / المتدرب:</label>
            <input type="text" id="v3d-input-name" class="v3d-input-text" value="${this.studentName}" placeholder="اكتب اسمك الثلاثي هنا..." />
          </div>

          <div class="v3d-cert-stat-tiles">
            <div class="v3d-cert-stat-tile">
              <span class="v3d-cst-val">${answeredCount} / ${total}</span>
              <span class="v3d-cst-lbl">الأسئلة المجابة</span>
            </div>
            <div class="v3d-cert-stat-tile">
              <span class="v3d-cst-val" style="color:#00e5aa;">${correctCount}</span>
              <span class="v3d-cst-lbl">الإجابات الصحيحة</span>
            </div>
            <div class="v3d-cert-stat-tile">
              <span class="v3d-cst-val" style="color:#f59e0b;">${scorePct}%</span>
              <span class="v3d-cst-lbl">النسبة المئوية</span>
            </div>
          </div>

          <div style="margin-top:20px;display:flex;flex-direction:column;gap:10px;">
            <button id="v3d-print-cert-btn" class="v3d-btn-nav v3d-btn-primary" style="padding:12px;font-size:13px;width:100%;text-align:center;">
              🖨️ طباعة الشهادة / تصدير PDF
            </button>
            <button id="v3d-back-to-exam-btn" class="v3d-btn-nav" style="padding:10px;font-size:12px;width:100%;text-align:center;">
              📝 متابعة حل الأسئلة
            </button>
          </div>
        </div>

        <!-- Printable Certificate Area -->
        <div class="v3d-cert-preview">
          <div class="v3d-cert-paper" id="v3d-printable-cert">
            <div class="v3d-cp-border">
              <!-- Watermark -->
              <div class="v3d-cp-header">
                <div style="font-size:11px;color:#0a3d91;font-weight:bold;">جمهورية العراق — وزارة الصناعة والمعادن</div>
                <div style="font-size:12px;color:#1e3a8a;font-weight:900;">الشركة العامة لصناعة الأسمدة الجنوبية (خور الزبير)</div>
                <div style="font-size:10px;color:#475569;">الهيئة العامة للمهندسين الكيميائيين في البصرة</div>
              </div>

              <div class="v3d-cp-badge">
                <span>وثيقة كفاءة تخصصية</span>
              </div>

              <div class="v3d-cp-title">شهادة اجتياز اختبار قسم الإصلاح والتحويل (Unit 100)</div>
              <div style="font-size:12px;color:#475569;margin-bottom:12px;">Process Flow & Operations Knowledge Exam (Dwg. 6112P-100-100-00)</div>

              <div style="font-size:13px;color:#334155;">تشهد الهيئة بأن الزميل المهندس:</div>
              <div class="v3d-cp-name" id="v3d-cert-name-display">${this.studentName}</div>

              <div style="font-size:12px;color:#334155;line-height:1.7;max-width:540px;margin:0 auto 16px;">
                قد أكمل بنجاح اختبار <b>قسم 100 (تحويل الغاز الطبيعي والإصلاح الأولي والثانوي ومفاعلات التحويل واسترجاع الحرارة)</b>، 
                وأظهر استيعاباً دقيقاً لمتغيرات درجات الحرارة والضغوط ونسب البخار والمحفزات الكيميائية وحلقات السيطرة الأوتوماتيكية.
              </div>

              <div class="v3d-cp-score-box">
                <div class="v3d-cps-item">
                  <span>الدرجة المستحقة:</span>
                  <b>${correctCount} من ${total}</b>
                </div>
                <div class="v3d-cps-item">
                  <span>النسبة المئوية:</span>
                  <b style="color:${isPassed ? '#059669' : '#dc2626'};">${scorePct}%</b>
                </div>
                <div class="v3d-cps-item">
                  <span>التقييم الفني:</span>
                  <b>${scorePct >= 90 ? 'ممتاز مع مرتبة الشرف' : scorePct >= 75 ? 'جيد جداً' : scorePct >= 60 ? 'ناجح ومؤهل' : 'بحاجة لإعادة مراجعة الكتيب'}</b>
                </div>
              </div>

              <div class="v3d-cp-footer">
                <div class="v3d-cpf-col">
                  <div>تاريخ الإصدار:</div>
                  <b>${new Date().toLocaleDateString('ar-IQ')}</b>
                </div>
                <div class="v3d-cpf-stamp">
                  <div class="v3d-stamp-inner">
                    <span>مجمع خور الزبير</span>
                    <b>معتمد رسمي</b>
                    <small>UNIT 100</small>
                  </div>
                </div>
                <div class="v3d-cpf-col">
                  <div>المشرف التكنولوجي:</div>
                  <b>م. علي سيف الدين حيدر النوفل</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event binding
    const nameInput = document.getElementById('v3d-input-name') as HTMLInputElement;
    nameInput?.addEventListener('input', (e) => {
      this.studentName = (e.target as HTMLInputElement).value || 'مهندس كيميائي متدرب';
      localStorage.setItem('nh3_student_name', this.studentName);
      const nameDisp = document.getElementById('v3d-cert-name-display');
      if (nameDisp) nameDisp.textContent = this.studentName;
    });

    document.getElementById('v3d-print-cert-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      window.print();
    });

    document.getElementById('v3d-back-to-exam-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('exam');
    });
  }

  // =========================================================================
  // 4. RESPONSIVE INDUSTRIAL STYLES
  // =========================================================================
  private injectStyles() {
    if (document.getElementById('v3d-exam-styles')) return;

    const style = document.createElement('style');
    style.id = 'v3d-exam-styles';
    style.textContent = `
      .v3d-exam-modal {
        position: fixed;
        inset: 0;
        background: rgba(2, 8, 15, 0.96);
        z-index: 999999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        backdrop-filter: blur(12px);
        font-family: 'Cairo', system-ui, -apple-system, sans-serif;
        direction: rtl;
        box-sizing: border-box;
      }

      @media (max-width: 900px) {
        .v3d-exam-modal {
          padding: 0 !important;
          inset: 0 !important;
        }
      }

      .v3d-exam-card {
        background: #061322;
        border: 2px solid #00c8ef;
        border-radius: 14px;
        width: 100%;
        max-width: 1360px;
        height: 94vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.95);
        overflow: hidden;
      }

      @media (max-width: 900px) {
        .v3d-exam-card {
          width: 100% !important;
          max-width: 100% !important;
          height: 100% !important;
          height: 100dvh !important;
          border-radius: 0 !important;
          border: none !important;
        }
      }

      /* Header */
      .v3d-exam-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        background: #081b30;
        border-bottom: 2px solid #143555;
        gap: 12px;
        flex-wrap: wrap;
        flex-shrink: 0;
      }

      .v3d-exam-title-box {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .v3d-exam-badge {
        background: #f59e0b;
        color: #030a12;
        padding: 4px 8px;
        border-radius: 4px;
        font-weight: 800;
        font-size: 11px;
        font-family: 'IBM Plex Mono', monospace;
        white-space: nowrap;
      }

      .v3d-exam-header-txt h2 {
        margin: 0;
        font-size: 14px;
        color: #ffffff;
        font-weight: 800;
      }

      .v3d-exam-header-txt small {
        color: #38bdf8;
        font-size: 11px;
        display: block;
      }

      .v3d-exam-header-tabs {
        display: flex;
        gap: 6px;
      }

      .v3d-exam-htab {
        background: #0a1828;
        border: 1px solid #1c3d5f;
        color: #94a3b8;
        padding: 6px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        font-size: 12px;
        transition: all 0.2s;
        font-family: inherit;
        white-space: nowrap;
      }

      .v3d-exam-htab:hover {
        background: #142a42;
        color: #38bdf8;
      }

      .v3d-exam-htab.on {
        background: #0284c7;
        color: #ffffff;
        border-color: #38bdf8;
        box-shadow: 0 0 12px rgba(2, 132, 199, 0.5);
      }

      .v3d-exam-close-btn {
        background: #14283d;
        border: 1px solid #23466a;
        color: #e2e8f0;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        transition: all 0.15s;
      }

      .v3d-exam-close-btn:hover {
        background: #ef4444;
        border-color: #ef4444;
        color: #ffffff;
      }

      @media (max-width: 900px) {
        .v3d-exam-header {
          padding: 8px 10px;
          gap: 8px;
        }
        .v3d-exam-title-box {
          width: 100%;
          justify-content: space-between;
        }
        .v3d-exam-header-txt h2 {
          font-size: 13px;
        }
        .v3d-exam-header-txt small {
          display: none;
        }
        .v3d-exam-badge {
          font-size: 10px;
          padding: 2px 6px;
        }
        .v3d-exam-header-tabs {
          width: 100%;
          justify-content: space-between;
          overflow-x: auto;
        }
        .v3d-exam-htab {
          flex: 1;
          padding: 6px 8px;
          font-size: 11px;
          text-align: center;
        }
      }

      .v3d-exam-body {
        flex: 1;
        overflow-y: auto;
        padding: 14px;
        background: #040c16;
        min-height: 0;
        -webkit-overflow-scrolling: touch;
      }

      @media (max-width: 900px) {
        .v3d-exam-body {
          padding: 8px;
        }
      }

      /* Exam Layout */
      .v3d-exam-layout {
        display: grid;
        grid-template-columns: 340px 1fr;
        gap: 14px;
        height: 100%;
        min-height: 0;
      }

      @media (max-width: 950px) {
        .v3d-exam-layout {
          grid-template-columns: 1fr;
          display: flex;
          flex-direction: column;
        }
        .desktop-only {
          display: none !important;
        }
      }

      .v3d-exam-sidebar {
        background: #08182b;
        border: 1px solid #143555;
        border-radius: 10px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        min-height: 0;
      }

      .v3d-sidebar-inner {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .v3d-drawer-top {
        display: none;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #193f66;
        padding-bottom: 8px;
        margin-bottom: 4px;
      }

      .v3d-dt-title {
        font-size: 13px;
        font-weight: 800;
        color: #38bdf8;
      }

      .v3d-drawer-x-btn {
        background: #193859;
        border: 1px solid #234d7a;
        color: #ffffff;
        font-size: 11.5px;
        font-weight: bold;
        padding: 4px 10px;
        border-radius: 6px;
        cursor: pointer;
        font-family: inherit;
      }

      .v3d-exam-stats-summary {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 6px;
      }

      .v3d-ess-box {
        background: #05101a;
        border: 1px solid #122b42;
        border-radius: 6px;
        padding: 6px 4px;
        text-align: center;
      }

      .v3d-ess-val {
        display: block;
        font-size: 13px;
        font-weight: 800;
        color: #38bdf8;
        font-family: 'IBM Plex Mono', monospace;
      }

      .v3d-ess-lbl {
        font-size: 9.5px;
        color: #94a3b8;
      }

      .v3d-cat-filter-wrap {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .v3d-filter-header {
        font-size: 11px;
        color: #94a3b8;
        font-weight: bold;
      }

      .v3d-cat-pills {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-height: 130px;
        overflow-y: auto;
      }

      .v3d-cat-pill {
        background: #05121f;
        border: 1px solid #122d47;
        color: #cbd5e1;
        padding: 5px 8px;
        border-radius: 5px;
        font-size: 11px;
        text-align: right;
        cursor: pointer;
        transition: all 0.15s;
        font-family: inherit;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .v3d-cat-pill:hover {
        background: #0d2742;
        color: #38bdf8;
      }

      .v3d-cat-pill.active {
        background: #0284c7;
        color: #ffffff;
        border-color: #38bdf8;
        font-weight: bold;
      }

      .v3d-q-grid-title {
        font-size: 11px;
        color: #94a3b8;
        font-weight: bold;
      }

      .v3d-q-grid {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        gap: 4px;
        max-height: 180px;
        overflow-y: auto;
        padding: 4px;
        background: #040e18;
        border-radius: 6px;
        border: 1px solid #10263c;
      }

      .v3d-qbadge {
        aspect-ratio: 1;
        border-radius: 4px;
        border: 1px solid #1a3857;
        background: #091a2b;
        color: #94a3b8;
        font-size: 10px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
        font-family: 'IBM Plex Mono', monospace;
      }

      .v3d-qbadge:hover {
        border-color: #38bdf8;
        color: #ffffff;
        background: #14324f;
      }

      .v3d-qbadge.active {
        box-shadow: 0 0 10px #00c8ef;
        border-color: #00c8ef;
        color: #00c8ef;
        font-weight: 900;
      }

      .v3d-qbadge.correct {
        background: #064e3b;
        border-color: #059669;
        color: #a7f3d0;
      }

      .v3d-qbadge.wrong {
        background: #7f1d1d;
        border-color: #dc2626;
        color: #fecaca;
      }

      .v3d-btn-reset {
        background: none;
        border: 1px dashed #475569;
        color: #94a3b8;
        font-size: 11px;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-family: inherit;
      }

      .v3d-btn-reset:hover {
        color: #ef4444;
        border-color: #ef4444;
      }

      /* Mobile Drawer Modal Sheet */
      .v3d-mobile-drawer-sheet {
        display: none;
      }

      @media (max-width: 950px) {
        .v3d-mobile-drawer-sheet.open {
          display: block;
          position: fixed;
          inset: 0;
          z-index: 1000000000;
        }
        .v3d-drawer-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
        }
        .v3d-drawer-panel {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          max-height: 85vh;
          overflow-y: auto;
          background: #08182b;
          border-top: 2px solid #00c8ef;
          border-radius: 16px 16px 0 0;
          padding: 16px;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.9);
          animation: v3dSlideUp 0.25s ease;
        }
        @keyframes v3dSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .v3d-drawer-top {
          display: flex;
        }
      }

      /* Mobile Quickbar */
      .v3d-mobile-quickbar {
        display: none;
        align-items: center;
        justify-content: space-between;
        background: #091c30;
        border: 1px solid #173859;
        border-radius: 8px;
        padding: 8px 10px;
        margin-bottom: 10px;
      }

      @media (max-width: 950px) {
        .v3d-mobile-quickbar {
          display: flex;
        }
      }

      .v3d-mq-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .v3d-mq-pill {
        background: rgba(245, 158, 11, 0.15);
        border: 1px solid #f59e0b;
        color: #f59e0b;
        font-weight: 800;
        font-size: 11px;
        padding: 3px 8px;
        border-radius: 4px;
        white-space: nowrap;
      }

      .v3d-mq-acc {
        font-size: 11px;
        color: #00e5aa;
        font-weight: bold;
      }

      .v3d-mq-btn {
        background: #0d2a48;
        border: 1px solid #00c8ef;
        color: #00c8ef;
        padding: 5px 10px;
        border-radius: 6px;
        font-weight: bold;
        font-size: 11px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        font-family: inherit;
      }

      .v3d-mq-badge {
        background: #00c8ef;
        color: #030a12;
        padding: 1px 6px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: 900;
      }

      /* Main Question Area */
      .v3d-exam-main {
        background: #071728;
        border: 1px solid #143555;
        border-radius: 10px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        min-height: 0;
      }

      @media (max-width: 900px) {
        .v3d-exam-main {
          padding: 10px;
          border-radius: 6px;
        }
      }

      .v3d-q-meta-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
        border-bottom: 1px solid #14324f;
        padding-bottom: 8px;
        flex-wrap: wrap;
        gap: 8px;
      }

      @media (max-width: 950px) {
        .v3d-q-meta-bar {
          display: none; /* replaced by mobile quickbar */
        }
      }

      .v3d-q-num-box {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .v3d-q-num {
        font-size: 14px;
        font-weight: 800;
        color: #f59e0b;
      }

      .v3d-q-type-badge {
        background: #0a2540;
        color: #38bdf8;
        border: 1px solid #1e456e;
        padding: 2px 7px;
        border-radius: 4px;
        font-size: 10.5px;
      }

      .v3d-q-cat-tag {
        background: #0e2b47;
        color: #00e5aa;
        padding: 3px 9px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: bold;
      }

      .v3d-q-text {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
        line-height: 1.6;
        margin-bottom: 16px;
      }

      @media (max-width: 900px) {
        .v3d-q-text {
          font-size: 15px;
          line-height: 1.55;
          margin-bottom: 12px;
        }
      }

      .v3d-q-options {
        display: flex;
        flex-direction: column;
        gap: 9px;
        margin-bottom: 16px;
      }

      .v3d-q-opt {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        background: #051322;
        border: 1.5px solid #133352;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.15s ease;
        color: #cbd5e1;
        min-height: 48px;
      }

      .v3d-q-opt:hover {
        background: #0b2238;
        border-color: #38bdf8;
        color: #ffffff;
      }

      .v3d-opt-letter {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #0c243c;
        border: 1px solid #1b4975;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        color: #38bdf8;
        font-size: 14px;
        flex-shrink: 0;
      }

      .v3d-opt-txt {
        flex: 1;
        font-size: 13.5px;
        line-height: 1.5;
        font-weight: 600;
      }

      .v3d-q-opt.selected {
        border-color: #38bdf8;
        background: rgba(56, 189, 248, 0.14);
      }

      .v3d-q-opt.correct-opt {
        background: rgba(16, 185, 129, 0.22) !important;
        border-color: #10b981 !important;
        color: #a7f3d0 !important;
      }

      .v3d-q-opt.correct-opt .v3d-opt-letter {
        background: #065f46;
        color: #a7f3d0;
        border-color: #10b981;
      }

      .v3d-q-opt.wrong-opt {
        background: rgba(239, 68, 68, 0.22) !important;
        border-color: #ef4444 !important;
        color: #fca5a5 !important;
      }

      .v3d-q-opt.wrong-opt .v3d-opt-letter {
        background: #991b1b;
        color: #fecaca;
        border-color: #ef4444;
      }

      .v3d-opt-indicator-ok {
        background: #065f46;
        color: #a7f3d0;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: bold;
        white-space: nowrap;
      }

      .v3d-opt-indicator-err {
        background: #991b1b;
        color: #fecaca;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: bold;
        white-space: nowrap;
      }

      /* Feedback Card */
      .v3d-q-feedback-card {
        padding: 14px;
        border-radius: 8px;
        margin-bottom: 16px;
        animation: v3dFadeIn 0.2s ease-out;
      }

      @keyframes v3dFadeIn {
        from { opacity: 0; transform: translateY(-6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .v3d-q-feedback-card.fb-correct {
        background: #04241b;
        border: 2px solid #059669;
      }

      .v3d-q-feedback-card.fb-wrong {
        background: #2b0c0c;
        border: 2px solid #dc2626;
      }

      .v3d-fb-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .v3d-fb-icon { font-size: 18px; }
      .v3d-fb-status { font-size: 13.5px; font-weight: 800; }
      .fb-correct .v3d-fb-status { color: #34d399; }
      .fb-wrong .v3d-fb-status { color: #f87171; }

      .v3d-fb-correct-reveal {
        background: rgba(0, 0, 0, 0.45);
        padding: 8px 12px;
        border-radius: 6px;
        margin-bottom: 8px;
        font-size: 13px;
        border-right: 3px solid #00e5aa;
      }

      .v3d-reveal-opt {
        color: #00e5aa;
        font-weight: bold;
        display: block;
        margin-top: 3px;
      }

      .v3d-fb-explanation {
        font-size: 12.5px;
        color: #e2e8f0;
        line-height: 1.6;
        margin-bottom: 8px;
      }

      .v3d-fb-reference {
        font-size: 11px;
        color: #94a3b8;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 6px;
      }

      .v3d-q-hint-box {
        background: #05121f;
        border: 1px dashed #1a3c5e;
        color: #94a3b8;
        padding: 10px 12px;
        border-radius: 6px;
        font-size: 12px;
        margin-bottom: 16px;
      }

      .v3d-q-actions-bar {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
        border-top: 1px solid #14324f;
        padding-top: 14px;
      }

      .v3d-btn-nav {
        background: #0b2238;
        border: 1px solid #194068;
        color: #cbd5e1;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: bold;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        font-family: inherit;
        flex: 1;
        min-width: 90px;
        text-align: center;
      }

      .v3d-btn-nav:hover:not(:disabled) {
        background: #143b63;
        color: #ffffff;
      }

      .v3d-btn-nav:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .v3d-btn-gold {
        background: #662c08;
        border-color: #b45309;
        color: #fde68a;
      }

      .v3d-btn-gold:hover:not(:disabled) {
        background: #92400e;
        color: #ffffff;
      }

      .v3d-btn-primary {
        background: #0284c7;
        border-color: #38bdf8;
        color: #ffffff;
      }

      .v3d-btn-primary:hover:not(:disabled) {
        background: #0369a1;
      }

      /* Manual Layout */
      .v3d-manual-layout {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 16px;
        height: 100%;
      }

      @media (max-width: 900px) {
        .v3d-manual-layout {
          grid-template-columns: 1fr;
          display: flex;
          flex-direction: column;
        }
      }

      .v3d-manual-sidebar {
        background: #071728;
        border: 1px solid #143555;
        border-radius: 8px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        overflow-y: auto;
      }

      .v3d-manual-nav-title {
        font-size: 12px;
        font-weight: 800;
        color: #38bdf8;
        margin-bottom: 6px;
        border-bottom: 1px solid #16385a;
        padding-bottom: 6px;
      }

      .v3d-mnav-link {
        color: #cbd5e1;
        font-size: 11.5px;
        padding: 6px 8px;
        border-radius: 4px;
        text-decoration: none;
        transition: all 0.15s;
        border-right: 2px solid transparent;
      }

      .v3d-mnav-link:hover {
        background: #0c233c;
        color: #38bdf8;
        border-right-color: #38bdf8;
      }

      .v3d-manual-content {
        background: #071728;
        border: 1px solid #143555;
        border-radius: 8px;
        padding: 16px;
        overflow-y: auto;
      }

      .v3d-msec {
        margin-bottom: 24px;
        border-bottom: 1px solid #14304c;
        padding-bottom: 16px;
      }

      .v3d-msec-title {
        font-size: 14.5px;
        font-weight: 800;
        color: #00c8ef;
        margin-bottom: 8px;
      }

      .v3d-mcallout {
        background: #04101c;
        border: 1px solid #102942;
        border-right: 3px solid #00c8ef;
        padding: 12px 14px;
        border-radius: 6px;
        margin-top: 10px;
        font-size: 12px;
        line-height: 1.7;
      }

      .v3d-mcallout ul {
        padding-right: 18px;
        margin: 0;
      }

      .v3d-mcallout li {
        margin-bottom: 6px;
      }

      .v3d-param-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
        margin-top: 10px;
      }

      .v3d-param-table th {
        background: #0c243c;
        color: #38bdf8;
        padding: 7px 9px;
        border: 1px solid #183e63;
        text-align: right;
      }

      .v3d-param-table td {
        padding: 7px 9px;
        border: 1px solid #142f4c;
        color: #cbd5e1;
      }

      .v3d-param-table tr:nth-child(even) {
        background: #040e18;
      }

      /* Stats & Certificate Layout */
      .v3d-stats-layout {
        display: grid;
        grid-template-columns: 320px 1fr;
        gap: 16px;
      }

      @media (max-width: 900px) {
        .v3d-stats-layout { grid-template-columns: 1fr; }
      }

      .v3d-cert-controls {
        background: #071728;
        border: 1px solid #143555;
        border-radius: 8px;
        padding: 16px;
      }

      .v3d-input-text {
        width: 100%;
        background: #040d16;
        border: 1px solid #1e456e;
        color: #ffffff;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 13px;
        font-family: inherit;
        box-sizing: border-box;
      }

      .v3d-cert-stat-tiles {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 6px;
        margin-top: 12px;
      }

      .v3d-cert-stat-tile {
        background: #040e18;
        border: 1px solid #10263c;
        border-radius: 6px;
        padding: 8px 4px;
        text-align: center;
      }

      .v3d-cst-val {
        display: block;
        font-size: 13px;
        font-weight: 800;
        color: #38bdf8;
        font-family: 'IBM Plex Mono', monospace;
      }

      .v3d-cst-lbl {
        font-size: 9.5px;
        color: #94a3b8;
      }

      .v3d-cert-paper {
        background: #ffffff;
        color: #1a2530;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
        text-align: center;
      }

      .v3d-cp-border {
        border: 4px double #0a3d91;
        padding: 18px;
        border-radius: 6px;
      }

      .v3d-cp-header {
        margin-bottom: 10px;
        border-bottom: 2px solid #0a3d91;
        padding-bottom: 6px;
      }

      .v3d-cp-badge {
        display: inline-block;
        background: #0a3d91;
        color: #ffffff;
        padding: 2px 12px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: bold;
        margin-bottom: 8px;
      }

      .v3d-cp-title {
        font-size: 17px;
        font-weight: 900;
        color: #b45309;
        margin-bottom: 2px;
      }

      .v3d-cp-name {
        font-size: 19px;
        font-weight: 900;
        color: #0a3d91;
        border-bottom: 2px dashed #0a3d91;
        display: inline-block;
        padding: 4px 18px;
        margin: 8px 0 12px;
      }

      .v3d-cp-score-box {
        display: flex;
        justify-content: center;
        gap: 16px;
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        padding: 8px 14px;
        max-width: 440px;
        margin: 0 auto 14px;
      }

      .v3d-cps-item {
        display: flex;
        flex-direction: column;
        font-size: 11px;
        color: #475569;
      }

      .v3d-cps-item b {
        font-size: 13px;
        color: #0f172a;
      }

      .v3d-cp-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #cbd5e1;
        padding-top: 12px;
        margin-top: 12px;
      }

      .v3d-cpf-col {
        font-size: 11px;
        color: #475569;
        text-align: right;
      }

      .v3d-cpf-stamp {
        width: 68px;
        height: 68px;
        border-radius: 50%;
        border: 2px dashed #dc2626;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #dc2626;
        transform: rotate(-12deg);
      }

      .v3d-stamp-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 8px;
        font-weight: bold;
      }

      .v3d-stamp-inner b {
        font-size: 10px;
      }
    `;

    document.head.appendChild(style);
  }
}

export const section100ExamCenter = Section100ExamCenterUI.getInstance();
