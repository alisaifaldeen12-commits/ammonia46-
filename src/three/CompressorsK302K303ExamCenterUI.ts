/**
 * CompressorsK302K303ExamCenterUI.ts
 * Master Technical Examination Center & Operational Manual Viewer
 * Dedicated for:
 *   1) Process Air Compressor K-302 (100 Deep Technical Questions)
 *   2) Natural Gas Compressor K-303 (100 Deep Technical Questions)
 * Derived strictly from Iraqi Fertilizer Complex No. 3 Operating Manual (Pages C-14 & C-15)
 * Blueprint: DWG NO. 6112P 100-300-00
 */

import { K302_EXAM_QUESTIONS, K302_CATEGORIES } from './K302AirExamMaster';
import { K303_EXAM_QUESTIONS, K303_CATEGORIES } from './K303GasExamMaster';
import { plantAudio } from './PlantAudio';

export type CompressorMode = 'k302' | 'k303';

export class CompressorsK302K303ExamCenterUI {
  private static instance: CompressorsK302K303ExamCenterUI | null = null;
  private modalEl: HTMLElement | null = null;

  // Active view states
  private activeCompressor: CompressorMode = 'k302';
  private activeTab: 'exam' | 'manual' | 'stats' = 'exam';
  
  // Independent question index and answers for each compressor
  private currentQIndexK302: number = 0;
  private currentQIndexK303: number = 0;
  private userAnswersK302: (number | null)[] = new Array(K302_EXAM_QUESTIONS.length).fill(null);
  private userAnswersK303: (number | null)[] = new Array(K303_EXAM_QUESTIONS.length).fill(null);

  private selectedCategory: string = 'all';
  private isMobileDrawerOpen: boolean = false;
  private studentName: string = localStorage.getItem('nh3_student_name') || 'مهندس كيمياوي / ميكانيك متدرب';

  public static getInstance(): CompressorsK302K303ExamCenterUI {
    if (!CompressorsK302K303ExamCenterUI.instance) {
      CompressorsK302K303ExamCenterUI.instance = new CompressorsK302K303ExamCenterUI();
    }
    return CompressorsK302K303ExamCenterUI.instance;
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
    if (typeof document === 'undefined' || !document.body) return;

    let existingModal = document.getElementById('v3d-k302-k303-exam-modal');
    if (existingModal) {
      this.modalEl = existingModal;
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'v3d-k302-k303-exam-modal';
    modal.className = 'v3d-exam-modal';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="v3d-exam-card" style="border-color:#0284c7;">
        <!-- Header -->
        <div class="v3d-exam-header" style="border-bottom-color:#0284c7;">
          <div class="v3d-exam-title-box">
            <button class="v3d-exam-close-btn" id="v3d-k302-303-exam-close" title="إغلاق الشاشة">✕</button>
            <div class="v3d-exam-header-txt">
              <h2 id="v3d-k302-303-header-title" style="color:#38bdf8;">⚡ بنك الـ 100 سؤال ودليل تشغيل ضاغط هواء العمليات K-302</h2>
              <small id="v3d-k302-303-header-sub">مطابقة دليل التشغيل C-14 & C-15 والمخطط الهندسي DWG NO. 6112P 100-300-00 — خور الزبير</small>
            </div>
            <span class="v3d-exam-badge" id="v3d-k302-303-header-badge" style="background:#0284c7;color:#ffffff;font-weight:bold;">Manual C-14 & C-15</span>
          </div>

          <!-- Compressor Switcher Pill Tabs -->
          <div style="display:flex;gap:8px;margin-bottom:8px;background:rgba(15,23,42,0.6);padding:4px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);">
            <button class="v3d-exam-comp-switch on" id="v3d-btn-switch-k302" style="flex:1;padding:8px 14px;border-radius:8px;font-weight:bold;font-size:13px;cursor:pointer;border:1px solid #0284c7;background:#0284c7;color:#ffffff;transition:all 0.2s;">
              💨 ضاغط هواء العمليات K-302 (100 سؤال)
            </button>
            <button class="v3d-exam-comp-switch" id="v3d-btn-switch-k303" style="flex:1;padding:8px 14px;border-radius:8px;font-weight:bold;font-size:13px;cursor:pointer;border:1px solid rgba(255,255,255,0.2);background:transparent;color:#94a3b8;transition:all 0.2s;">
              🔥 ضاغط الغاز الطبيعي K-303 (100 سؤال)
            </button>
          </div>

          <div class="v3d-exam-header-tabs">
            <button class="v3d-exam-htab on" id="v3d-k302-303-extab-exam">📝 بنك الـ 100 سؤال</button>
            <button class="v3d-exam-htab" id="v3d-k302-303-extab-manual">📖 كتيب التشغيل C-14 و C-15</button>
            <button class="v3d-exam-htab" id="v3d-k302-303-extab-stats">📊 النتيجة والشهادة</button>
          </div>
        </div>

        <!-- Body Area -->
        <div class="v3d-exam-body" id="v3d-k302-303-exam-content">
          <!-- Dynamic Content -->
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;

    // Attach Header Tabs & Close
    document.getElementById('v3d-k302-303-exam-close')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.close();
    });

    document.getElementById('v3d-btn-switch-k302')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.setCompressor('k302');
    });

    document.getElementById('v3d-btn-switch-k303')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.setCompressor('k303');
    });

    document.getElementById('v3d-k302-303-extab-exam')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('exam');
    });

    document.getElementById('v3d-k302-303-extab-manual')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('manual');
    });

    document.getElementById('v3d-k302-303-extab-stats')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.switchTab('stats');
    });
  }

  public open(comp: CompressorMode = 'k302', tab: 'exam' | 'manual' | 'stats' = 'exam', qIndex: number = 0) {
    if (!this.modalEl || !document.getElementById('v3d-k302-k303-exam-modal')) {
      this.createModalDOM();
    }
    if (this.modalEl) {
      this.modalEl.style.display = 'flex';
      this.activeCompressor = comp;
      if (comp === 'k302') {
        this.currentQIndexK302 = Math.max(0, Math.min(qIndex, K302_EXAM_QUESTIONS.length - 1));
      } else {
        this.currentQIndexK303 = Math.max(0, Math.min(qIndex, K303_EXAM_QUESTIONS.length - 1));
      }
      this.selectedCategory = 'all';
      this.isMobileDrawerOpen = false;
      this.updateHeaderUI();
      this.switchTab(tab);
    }
  }

  public close() {
    if (this.modalEl) {
      this.modalEl.style.display = 'none';
      this.isMobileDrawerOpen = false;
    }
  }

  public setCompressor(comp: CompressorMode) {
    this.activeCompressor = comp;
    this.selectedCategory = 'all';
    this.isMobileDrawerOpen = false;
    this.updateHeaderUI();
    this.renderCurrentTab();
  }

  public switchTab(tab: 'exam' | 'manual' | 'stats') {
    this.activeTab = tab;

    // Update Header tab classes
    const tabs = ['exam', 'manual', 'stats'] as const;
    tabs.forEach((t) => {
      const btn = document.getElementById(`v3d-k302-303-extab-${t}`);
      if (btn) {
        if (t === tab) {
          btn.classList.add('on');
        } else {
          btn.classList.remove('on');
        }
      }
    });

    this.renderCurrentTab();
  }

  private updateHeaderUI() {
    const isK302 = this.activeCompressor === 'k302';
    const titleEl = document.getElementById('v3d-k302-303-header-title');
    const subEl = document.getElementById('v3d-k302-303-header-sub');
    const badgeEl = document.getElementById('v3d-k302-303-header-badge');
    const btn302 = document.getElementById('v3d-btn-switch-k302');
    const btn303 = document.getElementById('v3d-btn-switch-k303');

    if (isK302) {
      if (titleEl) {
        titleEl.innerHTML = '⚡ بنك الـ 100 سؤال ودليل تشغيل ضاغط هواء العمليات K-302';
        titleEl.style.color = '#38bdf8';
      }
      if (subEl) {
        subEl.innerText = 'هواء العمليات إلى المصلح الثانوي R-103 (34 بار)، سحوبات اليوريا والكاتاكارب وهواء الأجهزة — دليل C-14';
      }
      if (badgeEl) {
        badgeEl.style.background = '#0284c7';
        badgeEl.style.color = '#ffffff';
        badgeEl.innerText = 'K-302 Manual C-14';
      }
      if (btn302) {
        btn302.style.background = '#0284c7';
        btn302.style.color = '#ffffff';
        btn302.style.borderColor = '#0284c7';
      }
      if (btn303) {
        btn303.style.background = 'transparent';
        btn303.style.color = '#94a3b8';
        btn303.style.borderColor = 'rgba(255,255,255,0.2)';
      }
    } else {
      if (titleEl) {
        titleEl.innerHTML = '🔥 بنك الـ 100 سؤال ودليل تشغيل ضاغط الغاز الطبيعي K-303';
        titleEl.style.color = '#fbbf24';
      }
      if (subEl) {
        subEl.innerText = 'تغذية قسم تحويل الغاز والإصلاح (40 بار)، فاصل السوائل V-111 ومبرد التدوير الراجع E-308 — دليل C-14/C-15';
      }
      if (badgeEl) {
        badgeEl.style.background = '#d97706';
        badgeEl.style.color = '#ffffff';
        badgeEl.innerText = 'K-303 Manual C-14/15';
      }
      if (btn302) {
        btn302.style.background = 'transparent';
        btn302.style.color = '#94a3b8';
        btn302.style.borderColor = 'rgba(255,255,255,0.2)';
      }
      if (btn303) {
        btn303.style.background = '#d97706';
        btn303.style.color = '#ffffff';
        btn303.style.borderColor = '#d97706';
      }
    }
  }

  private renderCurrentTab() {
    const container = document.getElementById('v3d-k302-303-exam-content');
    if (!container) return;

    if (this.activeTab === 'exam') {
      this.renderExamView(container);
    } else if (this.activeTab === 'manual') {
      this.renderManualView(container);
    } else if (this.activeTab === 'stats') {
      this.renderStatsView(container);
    }
  }

  // =========================================================================
  // 1. RENDER 100-QUESTION EXAM VIEW
  // =========================================================================
  private renderExamView(container: HTMLElement) {
    const isK302 = this.activeCompressor === 'k302';
    const questions = isK302 ? K302_EXAM_QUESTIONS : K303_EXAM_QUESTIONS;
    const categories = isK302 ? K302_CATEGORIES : K303_CATEGORIES;
    const currentQIdx = isK302 ? this.currentQIndexK302 : this.currentQIndexK303;
    const userAnswers = isK302 ? this.userAnswersK302 : this.userAnswersK303;
    const total = questions.length;

    const q = questions[currentQIdx];

    // Stats calculations
    const answeredCount = userAnswers.filter((a) => a !== null).length;
    const correctCount = userAnswers.filter((a, idx) => a !== null && a === questions[idx].correctIndex).length;
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    const currentAnswer = userAnswers[currentQIdx];
    const isAnswered = currentAnswer !== null;
    const isCorrect = isAnswered && currentAnswer === q.correctIndex;

    const accentColor = isK302 ? '#0284c7' : '#d97706';
    const accentLight = isK302 ? '#38bdf8' : '#fbbf24';

    const sidebarHTML = `
      <div class="v3d-sidebar-inner">
        <!-- Close button inside mobile drawer -->
        <div class="v3d-drawer-top">
          <div class="v3d-dt-title" style="color:${accentLight};">📑 فهرس أسئلة ${isK302 ? 'الضاغط K-302' : 'الضاغط K-303'}</div>
          <button id="v3d-k302-303-close-drawer-btn" class="v3d-drawer-x-btn">✕ إغلاق</button>
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
            <span class="v3d-ess-val" style="color:${accentLight};">${accuracy}%</span>
            <span class="v3d-ess-lbl">نسبة الدقة</span>
          </div>
        </div>

        <!-- Category Filter Pills -->
        <div class="v3d-cat-filter-wrap">
          <span class="v3d-filter-header">تصفية حسب المنظومة الهندسية:</span>
          <div class="v3d-cat-pills">
            ${categories.map((c) => `
              <button class="v3d-cat-pill ${this.selectedCategory === c.id ? 'active' : ''}" data-cat="${c.id}">
                ${c.name}
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
          ${questions.map((item, idx) => {
            const isMatchCat = this.selectedCategory === 'all' || item.category === this.selectedCategory;
            if (!isMatchCat) return '';
            const ans = userAnswers[idx];
            let statusClass = 'unanswered';
            if (ans !== null) {
              statusClass = ans === item.correctIndex ? 'correct' : 'wrong';
            }
            const isCurrent = idx === currentQIdx ? 'current' : '';
            return `
              <button class="v3d-qm-cell ${statusClass} ${isCurrent}" data-qidx="${idx}" title="سؤال ${item.id}: ${item.arabicCategory}">
                ${item.id}
              </button>
            `;
          }).join('')}
        </div>

        <div class="v3d-qmatrix-legend">
          <span><i class="v3d-leg-dot correct"></i> صحيح</span>
          <span><i class="v3d-leg-dot wrong"></i> خاطئ</span>
          <span><i class="v3d-leg-dot current"></i> الحالي</span>
          <span><i class="v3d-leg-dot unanswered"></i> لم يُحل</span>
        </div>
      </div>
    `;

    // Question options
    const optionsHTML = q.options.map((optText, optIdx) => {
      let optClass = 'v3d-opt-btn';
      let badge = String.fromCharCode(65 + optIdx); // A, B, C, D

      if (isAnswered) {
        if (optIdx === q.correctIndex) {
          optClass += ' correct';
        } else if (optIdx === currentAnswer) {
          optClass += ' wrong';
        } else {
          optClass += ' disabled';
        }
      }

      return `
        <button class="${optClass}" data-opt="${optIdx}">
          <span class="v3d-opt-badge">${badge}</span>
          <span class="v3d-opt-txt">${optText}</span>
        </button>
      `;
    }).join('');

    const explanationHTML = isAnswered ? `
      <div class="v3d-expl-box ${isCorrect ? 'correct' : 'wrong'}">
        <div class="v3d-expl-header">
          <span>${isCorrect ? '✅ إجابة نموذجية دقيقة ومطابقة للدليل الفني' : '❌ إجابة غير دقيقة — راجع التفسير الهندسي'}</span>
          <span class="v3d-expl-tag" style="background:${accentColor};color:#ffffff;">${q.technicalReference}</span>
        </div>
        <p class="v3d-expl-content">${q.explanation}</p>
        <div class="v3d-expl-meta">
          <span>المعدة المرتبطة: <b>${q.equipmentRef}</b></span>
          <span>المصدر: <b>كتيب التشغيل C-14 & C-15</b></span>
        </div>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="v3d-exam-layout">
        <!-- Sidebar Navigation Drawer -->
        <aside class="v3d-exam-sidebar ${this.isMobileDrawerOpen ? 'open' : ''}" id="v3d-k302-303-exam-sidebar">
          ${sidebarHTML}
        </aside>

        <!-- Main Question Area -->
        <main class="v3d-exam-main">
          <!-- Mobile Drawer Toggle Trigger Bar -->
          <div class="v3d-mobile-drawer-bar">
            <button id="v3d-k302-303-toggle-drawer-btn" class="v3d-toggle-drawer-btn" style="border-color:${accentColor};color:${accentLight};">
              📑 فهرس الـ 100 سؤال والتصفية (${answeredCount}/100)
            </button>
            <div class="v3d-mob-stat-chip">الدقة: <b>${accuracy}%</b></div>
          </div>

          <div class="v3d-qcard">
            <!-- Question Header -->
            <div class="v3d-qcard-header">
              <div class="v3d-qcard-meta">
                <span class="v3d-qnum-badge" style="background:${accentColor};color:#ffffff;">سؤال ${q.id} من ${total}</span>
                <span class="v3d-qcat-badge">${q.arabicCategory}</span>
              </div>
              <div class="v3d-qcard-tools">
                <button id="v3d-k302-303-reset-exam-btn" class="v3d-tool-btn" title="إعادة تعيين الاختبار الحالي">🔄 إعادة تعيين</button>
              </div>
            </div>

            <!-- Question Body -->
            <div class="v3d-qcard-body">
              <h3 class="v3d-qtxt">${q.question}</h3>
              <div class="v3d-options-grid">
                ${optionsHTML}
              </div>
              ${explanationHTML}
            </div>

            <!-- Bottom Navigation Bar -->
            <div class="v3d-qnav-bar">
              <button class="v3d-qnav-btn prev" id="v3d-k302-303-q-prev-btn" ${currentQIdx === 0 ? 'disabled' : ''}>
                ⬅️ السؤال السابق
              </button>
              <div class="v3d-qnav-center">
                <button class="v3d-qnav-btn jump-unsolved" id="v3d-k302-303-q-next-unsolved-btn" style="border-color:${accentColor};">
                  ⚡ الانتقال لأول سؤال غير محلول
                </button>
              </div>
              <button class="v3d-qnav-btn next" id="v3d-k302-303-q-next-btn" ${currentQIdx === total - 1 ? 'disabled' : ''}>
                السؤال التالي ➡️
              </button>
            </div>
          </div>
        </main>
      </div>
    `;

    // Attach Event Listeners
    this.attachExamEvents(container);
  }

  private attachExamEvents(container: HTMLElement) {
    const isK302 = this.activeCompressor === 'k302';
    const questions = isK302 ? K302_EXAM_QUESTIONS : K303_EXAM_QUESTIONS;
    const currentQIdx = isK302 ? this.currentQIndexK302 : this.currentQIndexK303;
    const userAnswers = isK302 ? this.userAnswersK302 : this.userAnswersK303;

    // Toggle Mobile Drawer
    document.getElementById('v3d-k302-303-toggle-drawer-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.isMobileDrawerOpen = true;
      document.getElementById('v3d-k302-303-exam-sidebar')?.classList.add('open');
    });

    document.getElementById('v3d-k302-303-close-drawer-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      this.isMobileDrawerOpen = false;
      document.getElementById('v3d-k302-303-exam-sidebar')?.classList.remove('open');
    });

    // Options Click
    container.querySelectorAll('.v3d-opt-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const optIdx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-opt') || '-1', 10);
        if (optIdx >= 0 && userAnswers[currentQIdx] === null) {
          if (optIdx === questions[currentQIdx].correctIndex) {
            plantAudio.playSuccess();
          } else {
            plantAudio.playAlert();
          }
          if (isK302) {
            this.userAnswersK302[currentQIdx] = optIdx;
          } else {
            this.userAnswersK303[currentQIdx] = optIdx;
          }
          this.renderExamView(container);
        }
      });
    });

    // Question Matrix Cell Jump
    container.querySelectorAll('.v3d-qm-cell').forEach((cell) => {
      cell.addEventListener('click', (e) => {
        plantAudio.playClick();
        const targetQIdx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-qidx') || '0', 10);
        if (isK302) {
          this.currentQIndexK302 = targetQIdx;
        } else {
          this.currentQIndexK303 = targetQIdx;
        }
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
    document.getElementById('v3d-k302-303-q-prev-btn')?.addEventListener('click', () => {
      if (isK302) {
        if (this.currentQIndexK302 > 0) {
          plantAudio.playClick();
          this.currentQIndexK302--;
          this.renderExamView(container);
        }
      } else {
        if (this.currentQIndexK303 > 0) {
          plantAudio.playClick();
          this.currentQIndexK303--;
          this.renderExamView(container);
        }
      }
    });

    // Next Button
    document.getElementById('v3d-k302-303-q-next-btn')?.addEventListener('click', () => {
      if (isK302) {
        if (this.currentQIndexK302 < K302_EXAM_QUESTIONS.length - 1) {
          plantAudio.playClick();
          this.currentQIndexK302++;
          this.renderExamView(container);
        }
      } else {
        if (this.currentQIndexK303 < K303_EXAM_QUESTIONS.length - 1) {
          plantAudio.playClick();
          this.currentQIndexK303++;
          this.renderExamView(container);
        }
      }
    });

    // Next Unsolved
    document.getElementById('v3d-k302-303-q-next-unsolved-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      const currentIdx = isK302 ? this.currentQIndexK302 : this.currentQIndexK303;
      const curAnswers = isK302 ? this.userAnswersK302 : this.userAnswersK303;

      const nextUnsolved = curAnswers.findIndex((a, idx) => a === null && idx > currentIdx);
      if (nextUnsolved !== -1) {
        if (isK302) this.currentQIndexK302 = nextUnsolved;
        else this.currentQIndexK303 = nextUnsolved;
      } else {
        const firstUnsolved = curAnswers.findIndex((a) => a === null);
        if (firstUnsolved !== -1) {
          if (isK302) this.currentQIndexK302 = firstUnsolved;
          else this.currentQIndexK303 = firstUnsolved;
        } else {
          alert(`تهانينا! لقد قمت بالإجابة على جميع أسئلة ${isK302 ? 'ضاغط هواء K-302' : 'ضاغط غاز K-303'} بنجاح.`);
        }
      }
      this.renderExamView(container);
    });

    // Reset Exam
    document.getElementById('v3d-k302-303-reset-exam-btn')?.addEventListener('click', () => {
      const compLabel = isK302 ? 'ضاغط هواء العمليات K-302' : 'ضاغط الغاز الطبيعي K-303';
      if (confirm(`هل أنت متأكد من إعادة ضبط كافة الإجابات وبدء اختبار ${compLabel} من جديد؟`)) {
        plantAudio.playClick();
        if (isK302) {
          this.userAnswersK302 = new Array(K302_EXAM_QUESTIONS.length).fill(null);
          this.currentQIndexK302 = 0;
        } else {
          this.userAnswersK303 = new Array(K303_EXAM_QUESTIONS.length).fill(null);
          this.currentQIndexK303 = 0;
        }
        this.isMobileDrawerOpen = false;
        this.renderExamView(container);
      }
    });
  }

  private getFilteredQuestions() {
    const questions = this.activeCompressor === 'k302' ? K302_EXAM_QUESTIONS : K303_EXAM_QUESTIONS;
    if (this.selectedCategory === 'all') return questions;
    return questions.filter((q) => q.category === this.selectedCategory);
  }

  // =========================================================================
  // 2. RENDER OPERATIONAL MANUAL VIEW (C-14 & C-15)
  // =========================================================================
  private renderManualView(container: HTMLElement) {
    container.innerHTML = `
      <div class="v3d-manual-layout">
        <div class="v3d-manual-sidebar">
          <div class="v3d-manual-nav-title" style="color:#38bdf8;">📑 فهرس كتيب التشغيل C-14 و C-15</div>
          <a href="#man-k302-text" class="v3d-mnav-link">2.5 ضاغط هواء العمليات K-302 (النص الحرفي C-14)</a>
          <a href="#man-k302-withdrawals" class="v3d-mnav-link">السحوبات الجانبية الثلاثة (اليوريا، الكاتاكارب، الأجهزة)</a>
          <a href="#man-k302-antisurge" class="v3d-mnav-link">منظومة مانع الارتجاف والتفريغ الجوي (Blow-off)</a>
          <a href="#man-k303-text" class="v3d-mnav-link highlight" style="border-color:#d97706;color:#fbbf24;">2.6 ضاغط الغاز الطبيعي K-303 (النص الحرفي C-14/15)</a>
          <a href="#man-k303-drain" class="v3d-mnav-link">فاصل السوائل V-111 والكبس إلى 40 كغم/سم²</a>
          <a href="#man-k303-bypass" class="v3d-mnav-link">مبرد التدوير الراجع E-308 وحلقة الارتجاف المغلقة</a>
          <a href="#man-comp-comparison" class="v3d-mnav-link">📊 جدول المقارنة الفنية الشاملة بين K-302 و K-303</a>
          <a href="#man-pfd-parameters" class="v3d-mnav-link">📐 مطابقة معاملات المخطط الهندسي DWG 6112P</a>
        </div>

        <div class="v3d-manual-content">
          <!-- Banner -->
          <div class="v3d-man-banner" style="border-color:#0284c7;">
            <h2>📖 الدليل التشغيلي الرسمي لضاغطي هواء العمليات K-302 والغاز الطبيعي K-303</h2>
            <p>مأخوذ حرفياً وبالكامل من وثائق التشغيل الأصلية لمشروع أسمدة خور الزبير رقم 3 (صفحات C-14 و C-15)</p>
          </div>

          <!-- Section 2.5: Process Air Compressor K-302 -->
          <div class="v3d-man-section" id="man-k302-text">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#0284c7;color:#ffffff;">2.5</span>
              <div>
                <h3>ضاغط هواء العمليات (Process Air Compressor K-302)</h3>
                <small>Manual C-14 — الفقرة 2.5 مع المخطط DWG 6112P-100-300-00</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <div class="v3d-man-callout" style="background:rgba(2,132,199,0.08);border-color:#0284c7;">
                <p><b>النص الحرفي من كتيب التشغيل (Verbatim Text from Manual C-14):</b></p>
                <p style="font-family:'Courier New', monospace;direction:ltr;text-align:left;">
                  <i>"Atmospheric air passes through Air Intake Stack (H-301) and Filter (F-301) to separate sand, dust, etc. and enters 1st stage of the Process Air Compressor. Compressed air from an intermediate point at the first case flows to First Stage Air Cooler (E-305) where heat of compression is removed. Any condensed water is knocked out in First Stage Air Separator (V-305) and drawn off to sewer.
                  <br><br>
                  Flow into remaining stages and cases with respective interstage coolers and interstage separators, discarding water to sewer.
                  <br><br>
                  Before entering the 4th stage, a portion of the air is withdrawn for:
                  <br>&nbsp;&nbsp;1. Urea Unit
                  <br>&nbsp;&nbsp;2. Catacarb Solution
                  <br>&nbsp;&nbsp;3. Instrument Air Requirements
                  <br><br>
                  Process air enters 4th stage, compressed to about 34 kg/cm²G, and flows to the Gas Reform Section. Discharge pressure is maintained by control of the Turbine speed. Flow required to avoid surge, as measured at the discharge, is maintained by venting air to the atmosphere."</i>
                </p>
              </div>
            </div>
          </div>

          <!-- Detailed K-302 Withdrawals -->
          <div class="v3d-man-section" id="man-k302-withdrawals">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#0284c7;color:#ffffff;">2.5.a</span>
              <div>
                <h3>تحليل السحوبات الجانبية الثلاثة قبل المرحلة الرابعة</h3>
                <small>الوظائف الكيميائية والهندسية الحاسمة لسلامة المجمع</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <div class="v3d-man-grid3">
                <div class="v3d-mg-card" style="border-top:3px solid #0284c7;">
                  <h4 style="color:#38bdf8;">1. تيار وحدة اليوريا (Urea Unit Passivation)</h4>
                  <p>يُحقن الأكسجين الموجود في الهواء لعمل <b>تخميل مستمر (Passivation)</b> لأسطح المعادن المقاومة للصدأ في مفاعل اليوريا، لمنع تآكل كربامات الأمونيوم (Ammonium Carbamate) العنيف جداً.</p>
                </div>
                <div class="v3d-mg-card" style="border-top:3px solid #00e5aa;">
                  <h4 style="color:#00e5aa;">2. تيار محلول الكاتاكارب (Catacarb Oxidation)</h4>
                  <p>يستخدم لأكسدة مانع التآكل الفناديومي باستمرار للحفاظ عليه بحالة التأكسد الخماسية <b>(V5+)</b>، مما يحمي أبراج امتصاص وتجريد CO2 بالقسم 200 من الصدأ والتآكل.</p>
                </div>
                <div class="v3d-mg-card" style="border-top:3px solid #f59e0b;">
                  <h4 style="color:#f59e0b;">3. هواء الأجهزة والمجفف (Instrument Air Dryer)</h4>
                  <p>يُرسل إلى مجفف هواء الأجهزة <b>(Instrument Air Dryer)</b> لتزويد صمامات التحكم وأجهزة القياس بهواء فائق الجفاف (نقطة ندى -40°C) خالٍ تماماً من الرطوبة والزيوت.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- K-302 Anti-Surge -->
          <div class="v3d-man-section" id="man-k302-antisurge">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#0284c7;color:#ffffff;">2.5.b</span>
              <div>
                <h3>منظومة حماية الارتجاف والتفريغ الجوي (Atmospheric Blow-off)</h3>
                <small>التحكم عند الطرد والتصريف المباشر للجو</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                يُقاس التدفق الحرج لمنع الارتجاف عند <b>طرد الضاغط (Measured at the discharge)</b>. وعند اقتراب نقطة التشغيل من حد الارتجاف، يفتح صمام التنفيس الجوي السريع (Blow-off Valve) المزود بكاتم صوت لطرد الهواء الزائد إلى الجو، وهو إجراء آمن تماماً واقتصادي لأن الهواء غاز طبيعي غير سام وغير قابل للاشتعال.
              </p>
            </div>
          </div>

          <!-- Section 2.6: Natural Gas Compressor K-303 -->
          <div class="v3d-man-section" id="man-k303-text">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#d97706;color:#ffffff;">2.6</span>
              <div>
                <h3>ضاغط الغاز الطبيعي (Natural Gas Compressor K-303)</h3>
                <small>Manual C-14 & C-15 — الفقرة 2.6 مع المخطط DWG 6112P-100-300-00</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <div class="v3d-man-callout" style="background:rgba(217,119,6,0.08);border-color:#d97706;">
                <p><b>النص الحرفي من كتيب التشغيل (Verbatim Text from Manual C-14 & C-15):</b></p>
                <p style="font-family:'Courier New', monospace;direction:ltr;text-align:left;">
                  <i>"Natural gas from battery limit passes through Natural Gas Drain Separator (V-111) to knock out pipeline liquids/condensate and enters K-303 and compressed to 40 kg/cm²G, flowing to the Gas Reform Section.
                  <br><br>
                  Discharge pressure is maintained by control of the Turbine speed.
                  <br><br>
                  Flow required to avoid surge, as measured at the suction, is maintained by returning natural gas from the compressor discharge through the Natural Gas By-Pass Cooler (E-308)."</i>
                </p>
              </div>
            </div>
          </div>

          <!-- K-303 Details -->
          <div class="v3d-man-section" id="man-k303-drain">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#d97706;color:#ffffff;">2.6.a</span>
              <div>
                <h3>فاصل تصريف السوائل V-111 وضغط 40 كغم/سم² قياسي</h3>
                <small>حماية الضاغط من الصدمات الهيدروليكية والتغذية لقسم الإصلاح</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                يستقبل الفاصل V-111 الغاز الطبيعي القادم من حدود البطارية (Battery Limit) عند ضغط 19 كغم/سم² مطلق وحرارة 40°C. يقوم الوعاء بحجز أي مكثفات أو هيدروكربونات ثقيلة سائلة أو مياه متجمعة في شبكة الأنابيب، ويصرفها بنظام مغلق إلى شبكة تصريف الهيدروكربونات لحماية دواليب الضاغط الطارد المركزي من التدمير بالصدمة السائلة (Liquid Slug).
                <br><br>
                يضغط الضاغط الغاز إلى <b>40 kg/cm²G (نحو 41 كغم/سم² مطلق)</b> عند 117°C ليدخل إلى قسم إصلاح الغاز لتغذية مسخنات التغذية ومفاعلات إزالة الكبريت (Desulfurizer R-102) ومحارق الفرن الأولي R-101.
              </p>
            </div>
          </div>

          <!-- K-303 Anti-Surge & E-308 -->
          <div class="v3d-man-section" id="man-k303-bypass">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#d97706;color:#ffffff;">2.6.b</span>
              <div>
                <h3>مبرد خط التدوير الجانبي E-308 وحلقة الارتجاف المغلقة</h3>
                <small>حماية الآلة من الارتجاف وتفادي الارتفاع الحراري التراكمي</small>
              </div>
            </div>
            <div class="v3d-man-text">
              <p>
                <b>لماذا لا يجوز تفريغ الغاز الطبيعي للجو؟</b>
                <br>الغاز الطبيعي يتكون من 72.5% ميثان و 15.4% إيثان و 5.9% بروبان، وهو غاز سريع الاشتعال والانفجار، ولذلك يحظر تفريغه في الجو ويجب إعادته في حلقة مغلقة.
                <br><br>
                <b>أهمية مبرد التدوير E-308:</b>
                <br>عند إعادة تدوير الغاز المضغوط الساخن (117°C) إلى السحب، سترتفع حرارة الغاز تدريجياً مع كل دورة مما يؤدي لتلف الأختام والكراسي (Thermal Runaway). يقوم المبادل E-308 بتبريد تيار الغاز الراجع إلى 43°C بواسطة مياه التبريد CW، ثم إعادته إلى سحب الضاغط عند الفاصل V-111.
              </p>
            </div>
          </div>

          <!-- Comparison Table -->
          <div class="v3d-man-section" id="man-comp-comparison">
            <div class="v3d-man-sec-title">
              <span class="v3d-mst-num" style="background:#0284c7;color:#ffffff;">📊</span>
              <div>
                <h3>المقارنة الفنية الشاملة بين K-302 و K-303 بحسب دليلي C-14 و C-15</h3>
                <small>جدول مقارنة للمهندسين الكيميائيين والميكانيكيين</small>
              </div>
            </div>
            <div class="v3d-param-table-wrap">
              <table class="v3d-param-table">
                <thead>
                  <tr>
                    <th>المعيار الفني</th>
                    <th>ضاغط هواء العمليات K-302</th>
                    <th>ضاغط الغاز الطبيعي K-303</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>الغاز المضغوط</b></td>
                    <td>هواء جوي (78% N2, 21% O2)</td>
                    <td>غاز طبيعي هيدروكربوني (72.5% CH4, 15.4% C2H6)</td>
                  </tr>
                  <tr>
                    <td><b>مصدر السحب</b></td>
                    <td>مدخنة H-301 وفلتر F-301 وفاصل V-308</td>
                    <td>حدود البطارية (Battery Limit) عبر فاصل V-111</td>
                  </tr>
                  <tr>
                    <td><b>ضغط السحب</b></td>
                    <td>1.033 kg/cm²A (الضغط الجوي)</td>
                    <td>19.0 kg/cm²A (Normal)</td>
                  </tr>
                  <tr>
                    <td><b>ضغط الطرد النهائي</b></td>
                    <td><b>34.0 kg/cm²G</b> (~35.0 kg/cm²A)</td>
                    <td><b>40.0 kg/cm²G</b> (~41.0 kg/cm²A)</td>
                  </tr>
                  <tr>
                    <td><b>درجة حرارة الطرد</b></td>
                    <td>167.0 °C</td>
                    <td>117.0 °C</td>
                  </tr>
                  <tr>
                    <td><b>وجهة الغاز المضغوط</b></td>
                    <td>المصلح الثانوي R-103 (خلاط الحارق)</td>
                    <td>قسم إصلاح الغاز (إزالة الكبريت R-102 ومحارق R-101)</td>
                  </tr>
                  <tr>
                    <td><b>السحوبات البينية</b></td>
                    <td>3 سحوبات قبل مرحلة 4: (اليوريا، كاتاكارب، هواء الأجهزة)</td>
                    <td>لا توجد سحوبات جانبية وسيطة</td>
                  </tr>
                  <tr>
                    <td><b>وسيلة التحكم بضغط الطرد</b></td>
                    <td>التحكم بسرعة التوربين البخاري K-302T</td>
                    <td>التحكم بسرعة التوربين البخاري K-303T</td>
                  </tr>
                  <tr>
                    <td><b>نقطة قياس تدفق مانع الارتجاف</b></td>
                    <td>تُقاس عند <b>الطرد (At the discharge)</b></td>
                    <td>تُقاس عند <b>السحب (At the suction)</b></td>
                  </tr>
                  <tr>
                    <td><b>آلية منع الارتجاف (Anti-Surge)</b></td>
                    <td>تنفيس الهواء إلى الغلاف الجوي (Blow-off to atmosphere)</td>
                    <td>تدوير الغاز عبر مبرد التدوير E-308 إلى السحب</td>
                  </tr>
                  <tr>
                    <td><b>المبردات المائية الملحقة</b></td>
                    <td>3 مبردات بينية: E-305 و E-306 و E-307</td>
                    <td>مبرد تدوير جانبي وحيد: E-308</td>
                  </tr>
                  <tr>
                    <td><b>فواصل السوائل والرطوبة</b></td>
                    <td>فواصل الرطوبة: V-305 و V-306 و V-307 (طرح للمجاري)</td>
                    <td>فاصل سوائل الغاز V-111 (تصريف هيدروكربوني مغلق)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 3. RENDER STATS & ACCREDITED CERTIFICATE VIEW
  // =========================================================================
  private renderStatsView(container: HTMLElement) {
    const isK302 = this.activeCompressor === 'k302';
    const questions = isK302 ? K302_EXAM_QUESTIONS : K303_EXAM_QUESTIONS;
    const categories = isK302 ? K302_CATEGORIES : K303_CATEGORIES;
    const userAnswers = isK302 ? this.userAnswersK302 : this.userAnswersK303;
    const total = questions.length;

    const answeredCount = userAnswers.filter((a) => a !== null).length;
    const correctCount = userAnswers.filter((a, idx) => a !== null && a === questions[idx].correctIndex).length;
    const wrongCount = answeredCount - correctCount;
    const unansweredCount = total - answeredCount;
    const scorePct = Math.round((correctCount / total) * 100);

    const isPassed = scorePct >= 70;
    const compNameAr = isK302 ? 'ضاغط هواء العمليات K-302' : 'ضاغط الغاز الطبيعي K-303';
    const compCode = isK302 ? 'K-302' : 'K-303';

    // Breakdown by category
    const catBreakdownHTML = categories.filter((c) => c.id !== 'all').map((cat) => {
      const catQuestions = questions.filter((q) => q.category === cat.id);
      const catTotal = catQuestions.length;
      let catCorrect = 0;
      let catAnswered = 0;

      catQuestions.forEach((q) => {
        const qIdx = questions.findIndex((item) => item.id === q.id);
        const ans = userAnswers[qIdx];
        if (ans !== null) {
          catAnswered++;
          if (ans === q.correctIndex) {
            catCorrect++;
          }
        }
      });

      const catPct = catTotal > 0 ? Math.round((catCorrect / catTotal) * 100) : 0;

      return `
        <div class="v3d-cat-stat-row">
          <div class="v3d-csr-info">
            <span class="v3d-csr-name">${cat.name}</span>
            <span class="v3d-csr-counts">${catCorrect} / ${catTotal} صحيح (${catAnswered} تم حلها)</span>
          </div>
          <div class="v3d-csr-bar-wrap">
            <div class="v3d-csr-bar" style="width:${catPct}%;background:${isK302 ? '#0284c7' : '#d97706'};"></div>
          </div>
          <span class="v3d-csr-pct">${catPct}%</span>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="v3d-stats-layout">
        <!-- Summary Cards -->
        <div class="v3d-stats-summary-grid">
          <div class="v3d-stat-box">
            <span class="v3d-sb-num" style="color:${isK302 ? '#38bdf8' : '#fbbf24'};">${scorePct}%</span>
            <span class="v3d-sb-lbl">الدرجة المئوية الشاملة</span>
          </div>
          <div class="v3d-stat-box">
            <span class="v3d-sb-num" style="color:#10b981;">${correctCount}</span>
            <span class="v3d-sb-lbl">إجابات صحيحة</span>
          </div>
          <div class="v3d-stat-box">
            <span class="v3d-sb-num" style="color:#ef4444;">${wrongCount}</span>
            <span class="v3d-sb-lbl">إجابات خاطئة</span>
          </div>
          <div class="v3d-stat-box">
            <span class="v3d-sb-num" style="color:#94a3b8;">${unansweredCount}</span>
            <span class="v3d-sb-lbl">أسئلة متبقية</span>
          </div>
        </div>

        <!-- Student Name Bar -->
        <div class="v3d-student-input-wrap">
          <label>اسم المهندس / المتدرب للشهادة المعتمدة:</label>
          <div class="v3d-si-row">
            <input type="text" id="v3d-k302-303-student-input" value="${this.studentName}" placeholder="أدخل اسمك الكامل هنا..." />
            <button id="v3d-k302-303-save-student-btn" class="v3d-btn-primary">حفظ الاسم</button>
          </div>
        </div>

        <!-- Category Progress Breakdown -->
        <div class="v3d-cat-progress-section">
          <h3>📊 تفصيل النتيجة حسب المنظومات التشغيلية لـ ${compNameAr}:</h3>
          <div class="v3d-csr-list">
            ${catBreakdownHTML}
          </div>
        </div>

        <!-- Official Certificate Box -->
        <div class="v3d-cert-wrapper">
          <div class="v3d-cert-card" id="v3d-k302-303-printable-cert">
            <div class="v3d-cert-border">
              <div class="v3d-cert-header">
                <div class="v3d-ch-logo">🏛️</div>
                <div class="v3d-ch-text">
                  <h3>جمهورية العراق — وزارة الصناعة والمعادن</h3>
                  <h4>الهيئة العامة للمهندسين الكيميائيين في البصرة & الشركة العامة لصناعة الأسمدة</h4>
                  <small>مشروع أسمدة خور الزبير رقم 3 — وحدة كبس وتغذية الغازات (DWG 6112P / C-14 & C-15)</small>
                </div>
                <div class="v3d-ch-badge">${isPassed ? 'مُعتمد بنجاح' : 'قيد التدريب'}</div>
              </div>

              <div class="v3d-cert-body">
                <h2>شهادة كفاءة مهنية واجتياز اختبار ${compNameAr}</h2>
                <p>تشهد اللجنة الاستشارية الفنية بأن المهندس / المتدرب:</p>
                <div class="v3d-cert-candidate-name">${this.studentName}</div>
                <p>
                  قد أكمل بنجاح الاختبار التخصصي الشامل لـ <b>${compNameAr} (${compCode})</b>،
                  وحقق درجة كفاءة بلغت <b>${scorePct}%</b> (${correctCount} من إجمالي 100 سؤال هندسي تخصصي)،
                  مع الإحاطة الكاملة بمتطلبات كتيب التشغيل C-14 و C-15 والمخطط الهندسي 6112P.
                </p>

                <div class="v3d-cert-meta-grid">
                  <div><b>المعدة:</b> ${compCode}</div>
                  <div><b>النتيجة:</b> ${isPassed ? 'ناجح ومؤهل للتشغيل' : 'يحتاج إلى مراجعة الدليل'}</div>
                  <div><b>تاريخ الاختبار:</b> ${new Date().toLocaleDateString('ar-IQ')}</div>
                  <div><b>الرقم التسلسلي:</b> NH3-${compCode}-${Date.now().toString().slice(-6)}</div>
                </div>
              </div>

              <div class="v3d-cert-footer">
                <div class="v3d-cf-sign">
                  <span>المهندس المشرف / المطور:</span>
                  <b>ENG. ALI SAIF AL DIN HAIDER ALNAWFAL</b>
                  <small>م. علي سيف الدين حيدر النوفل</small>
                </div>
                <div class="v3d-cf-seal">
                  <div class="v3d-seal-ring">
                    <span>ختم الاعتماد</span>
                    <small>خور الزبير 3</small>
                  </div>
                </div>
                <div class="v3d-cf-sign">
                  <span>رئيس لجنة التقييم:</span>
                  <b>لجنة تشغيل مصانع الأمونيا واليوريا</b>
                  <small>مجمع أسمدة خور الزبير</small>
                </div>
              </div>
            </div>
          </div>

          <div class="v3d-cert-actions">
            <button class="v3d-btn-primary" id="v3d-k302-303-print-cert-btn">🖨️ طباعة الشهادة الرسمية (PDF / Print)</button>
          </div>
        </div>
      </div>
    `;

    // Attach student name save
    document.getElementById('v3d-k302-303-save-student-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      const input = document.getElementById('v3d-k302-303-student-input') as HTMLInputElement;
      if (input && input.value.trim()) {
        this.studentName = input.value.trim();
        localStorage.setItem('nh3_student_name', this.studentName);
        this.renderStatsView(container);
      }
    });

    // Attach Print
    document.getElementById('v3d-k302-303-print-cert-btn')?.addEventListener('click', () => {
      plantAudio.playClick();
      window.print();
    });
  }
}

export const compressorsK302K303ExamCenter = CompressorsK302K303ExamCenterUI.getInstance();

export function openK302Exam(tab: 'exam' | 'manual' | 'stats' = 'exam', qIndex: number = 0) {
  CompressorsK302K303ExamCenterUI.getInstance().open('k302', tab, qIndex);
}

export function openK303Exam(tab: 'exam' | 'manual' | 'stats' = 'exam', qIndex: number = 0) {
  CompressorsK302K303ExamCenterUI.getInstance().open('k303', tab, qIndex);
}

if (typeof window !== 'undefined') {
  (window as any).openK302Exam = openK302Exam;
  (window as any).openK303Exam = openK303Exam;
  (window as any).compressorsK302K303ExamCenter = compressorsK302K303ExamCenter;
}
