import { 
  loginWithGoogle, 
  logoutUser, 
  observeAuthState, 
  listenToUserCount, 
  testFirebaseConnection 
} from './firebase';
import { User as FirebaseUser } from 'firebase/auth';

export class FirebaseAuthWidget {
  private currentUser: FirebaseUser | null = null;
  private totalUsersCount: number = 1;
  private authGateEl: HTMLElement | null = null;
  private topbarContainerEl: HTMLElement | null = null;
  private isLoggingIn: boolean = false;
  private loginErrorMessage: string | null = null;

  constructor() {
    testFirebaseConnection();
    // Clear any legacy guest mode storage
    try {
      localStorage.removeItem('nh3_guest_mode');
    } catch (_) {}

    (window as any).dismissAuthGate = () => {
      console.warn("Guest mode bypass is disabled. Google sign-in is mandatory.");
    };
    (window as any).openAuthGate = () => this.render();
  }

  public init() {
    this.authGateEl = document.getElementById('auth-login-gate');
    this.topbarContainerEl = document.getElementById('firebase-auth-container');

    // Inject CSS styles for the Login Screen Gate & Auth Bar
    this.injectStyles();

    // Listen to real-time total user count
    listenToUserCount((count) => {
      this.totalUsersCount = Math.max(1, count);
      this.render();
    });

    // Observe Auth state
    observeAuthState((user) => {
      this.currentUser = user;
      this.render();
    });
  }

  private injectStyles() {
    if (document.getElementById('firebase-auth-gate-styles')) return;

    const style = document.createElement('style');
    style.id = 'firebase-auth-gate-styles';
    style.textContent = `
      /* Fullscreen Mandatory Auth Gate Screen */
      .auth-gate-screen {
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: linear-gradient(135deg, rgba(8, 9, 13, 0.94) 0%, rgba(10, 12, 18, 0.97) 100%),
                    url('/assets/aistudio/IMG_1672_574a69ee.jpeg') center/cover no-repeat fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        font-family: 'Cairo', system-ui, sans-serif;
        direction: rtl;
        overflow-y: auto;
        backdrop-filter: blur(10px);
      }

      .auth-gate-card {
        position: relative;
        width: 100%;
        max-width: 520px;
        background: rgba(15, 18, 26, 0.96);
        border: 2px solid rgba(0, 200, 239, 0.6);
        border-radius: 20px;
        padding: 32px 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.98), 0 0 50px rgba(0, 200, 239, 0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 16px;
        backdrop-filter: blur(20px);
        animation: authGatePop 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }

      @keyframes authGatePop {
        from { transform: scale(0.92); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }

      .auth-gate-logo-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 68px;
        height: 68px;
        background: rgba(0, 200, 239, 0.15);
        border: 2px solid #00c8ef;
        border-radius: 20px;
        font-size: 36px;
        box-shadow: 0 0 25px rgba(0, 200, 239, 0.4);
      }

      .auth-gate-org {
        font-size: 11.5px;
        color: #38bdf8;
        font-weight: 700;
        background: rgba(14, 165, 233, 0.12);
        border: 1px solid rgba(14, 165, 233, 0.35);
        padding: 4px 14px;
        border-radius: 20px;
      }

      .auth-gate-title {
        font-size: 20px;
        font-weight: 900;
        color: #ffffff;
        line-height: 1.3;
        margin-top: -2px;
      }

      .auth-gate-sub {
        font-size: 13px;
        color: #cbd5e1;
        line-height: 1.6;
        max-width: 440px;
        background: rgba(0, 200, 239, 0.08);
        border: 1px solid rgba(0, 200, 239, 0.25);
        border-radius: 12px;
        padding: 12px 16px;
      }

      .auth-gate-users-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(0, 229, 170, 0.14);
        border: 1px solid #00e5aa;
        color: #00e5aa;
        padding: 6px 18px;
        border-radius: 25px;
        font-size: 13px;
        font-weight: 800;
      }

      .auth-gate-users-badge .count-val {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 16px;
        color: #ffffff;
        font-weight: 900;
      }

      .auth-gate-actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        max-width: 420px;
        margin-top: 4px;
      }

      .auth-gate-btn-google {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        width: 100%;
        background: #ffffff;
        color: #202124;
        border: 2px solid #4285f4;
        padding: 13px 22px;
        border-radius: 14px;
        font-size: 15.5px;
        font-weight: 900;
        cursor: pointer;
        transition: all 0.25s ease;
        box-shadow: 0 6px 20px rgba(66, 133, 244, 0.35);
        font-family: 'Cairo', inherit;
      }

      .auth-gate-btn-google:hover {
        background: #f8f9fa;
        border-color: #1a73e8;
        color: #1a73e8;
        box-shadow: 0 8px 30px rgba(66, 133, 244, 0.6);
        transform: translateY(-2px);
      }

      .auth-gate-btn-google:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .auth-gate-error-box {
        width: 100%;
        max-width: 420px;
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid #ef4444;
        color: #fca5a5;
        padding: 10px 14px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 700;
        text-align: center;
      }

      .auth-gate-dev-footer {
        font-size: 11.5px;
        color: #94a3b8;
        margin-top: 6px;
        border-top: 1px dashed rgba(255, 255, 255, 0.15);
        padding-top: 10px;
        width: 100%;
      }

      .auth-gate-dev-footer b {
        color: #38bdf8;
      }

      /* Topbar Auth Widget Styles */
      .fb-auth-bar {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(7, 21, 34, 0.95);
        border: 1px solid rgba(0, 200, 239, 0.35);
        border-radius: 8px;
        padding: 4px 10px;
        font-family: 'Cairo', system-ui, sans-serif;
        direction: rtl;
      }

      .fb-users-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 700;
        color: #00e5aa;
        background: rgba(0, 229, 170, 0.12);
        border: 1px solid rgba(0, 229, 170, 0.35);
        padding: 3px 10px;
        border-radius: 6px;
        white-space: nowrap;
      }

      .fb-users-badge .count-num {
        font-family: 'IBM Plex Mono', monospace;
        font-weight: 800;
        color: #ffffff;
        font-size: 12.5px;
      }

      .fb-user-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .fb-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #00c8ef;
        object-fit: cover;
      }

      .fb-user-details {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
      }

      .fb-user-name {
        font-size: 11px;
        font-weight: 700;
        color: #e0f2fe;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .fb-user-email {
        font-size: 9.5px;
        color: #94a3b8;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .fb-logout-btn {
        background: rgba(255, 59, 48, 0.15);
        border: 1px solid rgba(255, 59, 48, 0.4);
        color: #ff8a80;
        padding: 3px 8px;
        border-radius: 6px;
        font-size: 10.5px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
        font-family: inherit;
      }

      .fb-logout-btn:hover {
        background: #ff3b30;
        color: #ffffff;
      }
    `;
    document.head.appendChild(style);
  }

  public render() {
    if (!this.authGateEl) {
      this.authGateEl = document.getElementById('auth-login-gate');
    }

    if (this.currentUser) {
      // USER LOGGED IN -> Hide Auth Gate & show full app
      if (this.authGateEl) {
        this.authGateEl.style.display = 'none';
      }
      this.renderTopbarWidget();
    } else {
      // USER NOT LOGGED IN -> Show Auth Gate Mandatorily (No guest mode)
      if (this.authGateEl) {
        this.authGateEl.style.display = 'flex';
        this.renderAuthGate();
      }
      this.renderTopbarWidget();
    }
  }

  private renderAuthGate() {
    if (!this.authGateEl) return;

    this.authGateEl.className = 'auth-gate-screen';
    this.authGateEl.innerHTML = `
      <div class="auth-gate-card">
        <div class="auth-gate-logo-box">🏭</div>
        <div class="auth-gate-org">🏛 الهيئة العامة للمهندسين الكيميائيين في البصرة</div>
        <div class="auth-gate-title">🔑 تسجيل الدخول إجباري للوصول للمحاكي الرقمي</div>
        
        <!-- Founder Badge Decor with Photo -->
        <div style="display:flex;align-items:center;gap:14px;background:linear-gradient(135deg, rgba(245,158,11,0.22), rgba(217,119,6,0.12));border:1px solid rgba(245,158,11,0.55);border-radius:14px;padding:10px 14px;width:100%;box-shadow:0 4px 20px rgba(245,158,11,0.15);text-align:right;">
          <img src="/assets/aistudio/IMG_1672_574a69ee.jpeg" alt="Eng.Ali Saif Aldeen Haider Alnawfal" style="width:64px;height:64px;border-radius:10px;border:2px solid #fbbf24;object-fit:cover;box-shadow:0 4px 12px rgba(0,0,0,0.5);flex-shrink:0;" />
          <div style="display:flex;flex-direction:column;gap:2px;flex:1;">
            <div style="font-size:10.5px;font-weight:800;color:#fbbf24;">⭐ المؤسس والمهندس المطور | Founder & Lead Engineer</div>
            <div style="font-family:'IBM Plex Mono', 'Cairo', monospace, sans-serif;font-size:13.5px;font-weight:800;color:#ffffff;letter-spacing:0.3px;">Eng.Ali Saif Aldeen Haider Alnawfal</div>
            <div style="font-size:11px;color:#cbd5e1;font-weight:700;">م. علي سيف الدين حيدر النوفل</div>
            <div style="font-size:9.5px;color:#38bdf8;font-weight:700;">الهيئة العامة للمهندسين الكيميائيين في البصرة</div>
          </div>
        </div>

        <div class="auth-gate-sub">
          أهلاً بكم في نظام المحاكاة الرقمية لمجمع تصنيع الأمونيا. يتطلب استخدام النظام تسجيل الدخول عبر حساب Google الرسمي لحفظ السجلات والاختبارات والهوية الرقمية للمهندس.
        </div>

        <div class="auth-gate-users-badge">
          <span>👥 عدد المهندسين والمستخدمين المسجلين:</span>
          <span class="count-val">${this.totalUsersCount}</span>
        </div>

        ${this.loginErrorMessage ? `<div class="auth-gate-error-box">⚠️ ${this.loginErrorMessage}</div>` : ''}

        <div class="auth-gate-actions">
          <button id="gate-login-btn" class="auth-gate-btn-google" ${this.isLoggingIn ? 'disabled' : ''}>
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>${this.isLoggingIn ? 'جاري الاتصال بحساب Google...' : 'تسجيل الدخول عبر Google 🔑'}</span>
          </button>
        </div>

        <div class="auth-gate-dev-footer">
          المؤسس والمهندس المطور: <b>Eng.Ali Saif Aldeen Haider Alnawfal</b> | م. علي سيف الدين حيدر النوفل
        </div>
      </div>
    `;

    const loginBtn = this.authGateEl.querySelector('#gate-login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', async () => {
        this.isLoggingIn = true;
        this.loginErrorMessage = null;
        this.renderAuthGate();

        try {
          await loginWithGoogle();
        } catch (e: any) {
          console.error('Google login error:', e);
          this.loginErrorMessage = e?.message || 'تعذر تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.';
        } finally {
          this.isLoggingIn = false;
          this.renderAuthGate();
        }
      });
    }
  }

  private renderTopbarWidget() {
    if (!this.topbarContainerEl) {
      this.topbarContainerEl = document.getElementById('firebase-auth-container');
    }
    if (!this.topbarContainerEl) return;

    this.topbarContainerEl.innerHTML = `
      <div class="fb-auth-bar">
        <div class="fb-users-badge" title="عدد مستخدمي المحاكي المسجلين عبر Google">
          <span>👥 المستخدِمون:</span>
          <span class="count-num">${this.totalUsersCount}</span>
        </div>

        ${
          this.currentUser
            ? `
            <div class="fb-user-info">
              <img 
                src="${this.currentUser.photoURL || 'https://www.gstatic.com/images/branding/product/2x/avatar_square_blue_120dp.png'}" 
                alt="Avatar" 
                class="fb-avatar"
                onerror="this.src='https://www.gstatic.com/images/branding/product/2x/avatar_square_blue_120dp.png'"
              />
              <div class="fb-user-details">
                <span class="fb-user-name">${this.currentUser.displayName || 'مهندس أمونيا'}</span>
                <span class="fb-user-email">${this.currentUser.email || ''}</span>
              </div>
              <button id="topbar-logout-btn" class="fb-logout-btn" title="تسجيل الخروج">خروج 🚪</button>
            </div>
            `
            : `
            <button id="topbar-login-btn" class="fb-logout-btn" style="background:#4285f4;color:#ffffff;border-color:#1a73e8;padding:4px 10px;font-size:11px;" title="تسجيل الدخول عبر Google">تسجيل الدخول 🔑</button>
            `
        }
      </div>
    `;

    const logoutBtn = this.topbarContainerEl.querySelector('#topbar-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          await logoutUser();
        } catch (e) {
          console.error('Logout error:', e);
        }
      });
    }

    const loginBtn = this.topbarContainerEl.querySelector('#topbar-login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        if (this.authGateEl) {
          this.authGateEl.style.display = 'flex';
          this.renderAuthGate();
        }
      });
    }

    const sidebarLogoutBtn = document.getElementById('sidebar-logout-btn');
    if (sidebarLogoutBtn) {
      sidebarLogoutBtn.onclick = async () => {
        try {
          await logoutUser();
        } catch (e) {
          console.error('Sidebar logout error:', e);
        }
      };
    }
  }
}

export const firebaseAuthWidget = new FirebaseAuthWidget();

