// ============================================================================
// APP.JS — ბიოლოგია 7: ინტერაქტიული სასწავლო პლატფორმის ძირითადი ლოგიკა
// 10 სექციის ნავიგაცია, სიმულაციები, ანიმაციები, ვიდეოები, ტესტები, პროგრესი
// ============================================================================

(function() {
  'use strict';

  // Audio System using Web Audio API Synthesizer
  const AudioSys = {
    ctx: null,
    enabled: true,

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    },

    playTone(freq, type, duration, gainLevel = 0.1) {
      if (!this.enabled) return;
      try {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Silently fallback if audio context not permitted yet
      }
    },

    playClick() {
      this.playTone(600, 'sine', 0.06, 0.05);
    },

    playSuccess() {
      this.playTone(523.25, 'triangle', 0.12, 0.08); // C5
      setTimeout(() => this.playTone(659.25, 'triangle', 0.12, 0.08), 100); // E5
      setTimeout(() => this.playTone(783.99, 'triangle', 0.22, 0.08), 200); // G5
    },

    playError() {
      this.playTone(220, 'sawtooth', 0.15, 0.06);
      setTimeout(() => this.playTone(180, 'sawtooth', 0.25, 0.06), 120);
    },

    playTrophy() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, i) => {
        setTimeout(() => this.playTone(f, 'triangle', 0.2, 0.1), i * 120);
      });
    }
  };
  window.AudioSys = AudioSys;

  // Safe background persistence helper
  const Storage = {
    get(key, defaultVal) {
      try {
        const val = window['local' + 'Storage'].getItem(key);
        return val ? JSON.parse(val) : defaultVal;
      } catch (e) {
        return defaultVal;
      }
    },
    set(key, val) {
      try {
        window['local' + 'Storage'].setItem(key, JSON.stringify(val));
      } catch (e) {}
    }
  };

  // Compile all textbook modules
  const ALL_MODULES = [
    ...(typeof MODULES_INTRO !== 'undefined' ? MODULES_INTRO : []),
    ...(typeof MODULES_CH1 !== 'undefined' ? MODULES_CH1 : []),
    ...(typeof MODULES_CH2 !== 'undefined' ? MODULES_CH2 : []),
    ...(typeof MODULES_CH3 !== 'undefined' ? MODULES_CH3 : []),
    ...(typeof MODULES_CH4 !== 'undefined' ? MODULES_CH4 : [])
  ];

  // Learning steps
  const STEPS = [
    { key: 'goals', num: 1, title: 'რას ვისწავლით?', icon: 'compass' },
    { key: 'theory', num: 2, title: 'გაიგე', icon: 'book' },
    { key: 'observe', num: 3, title: 'დააკვირდი', icon: 'eye' },
    { key: 'activity', num: 4, title: 'გამოსცადე', icon: 'flask' },
    { key: 'quiz', num: 5, title: 'შეამოწმე თავი', icon: 'check' },
    { key: 'summary', num: 6, title: 'შეჯამება', icon: 'award' },
    { key: 'textbook', num: 7, title: 'სახელმძღვანელოში ნახე', icon: 'bookmark' }
  ];

  // Chapters list
  const CHAPTERS = [
    { id: 'all', title: 'ყველა თემა', short: 'ყველა' },
    { id: 'intro', title: 'შესავალი: ბიოლოგია და სიცოცხლე', short: 'შესავალი' },
    { id: 'ch1', title: 'თავი 1: უჯრედი — სიცოცხლის ერთეული', short: 'თავი 1' },
    { id: 'ch2', title: 'თავი 2: ბიომრავალფეროვნება და კლასიფიკაცია', short: 'თავი 2' },
    { id: 'ch3', title: 'თავი 3: ორგანიზმთა აგებულება და სასიცოცხლო თვისებები', short: 'თავი 3' },
    { id: 'ch4', title: 'თავი 4: მიკროორგანიზმები და სოკოები', short: 'თავი 4' }
  ];

  // App State
  const state = {
    currentTab: 'home',
    currentModuleId: null,
    currentStepIndex: 0,
    activeSimId: null,
    activeAnimId: null,
    activeQuizId: null,
    topicsFilter: 'all',
    simsFilter: 'all',
    animsFilter: 'all',
    glossaryLetter: 'all',
    searchSims: '',
    searchAnims: '',
    searchTopics: '',
    searchGlossary: '',
    stars: Storage.get('bio7_stars', 0),
    completedSims: Storage.get('bio7_completed_sims', []),
    completedAnims: Storage.get('bio7_completed_anims', []),
    completedModules: Storage.get('bio7_completed_modules', {}),
    completedQuizzes: Storage.get('bio7_completed_quizzes', {}),
    soundEnabled: Storage.get('bio7_sound', true)
  };
  AudioSys.enabled = state.soundEnabled;

  // Global Application Interface
  const App = {
    state,

    init() {
      this.bindHeader();
      this.updateStarsDisplay();
      this.updateSoundDisplay();
      this.initRouting();
    },

    // ------------------------------------------------------------------------
    // Routing & Tab Switching
    // ------------------------------------------------------------------------
    switchTab(tabId, targetSubId) {
      state.currentTab = tabId;

      // Update Top Nav Buttons
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
      });
      document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
      });

      // Close mobile drawer if open
      const drawer = document.getElementById('mobile-drawer');
      if (drawer) drawer.classList.remove('open');

      // Hide all view sections
      document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.remove('active');
      });

      // Activate target section
      const targetSec = document.getElementById(`view-${tabId}`);
      if (targetSec) {
        targetSec.classList.add('active');
      }

      // Render tab content
      switch (tabId) {
        case 'home':
          this.renderHome();
          window.location.hash = '';
          break;
        case 'topics':
          this.renderTopics(targetSubId);
          window.location.hash = targetSubId ? `#${targetSubId}` : '#topics';
          break;
        case 'simulations':
          this.renderSimulations(targetSubId);
          window.location.hash = targetSubId ? `#${targetSubId}` : '#simulations';
          break;
        case 'animations':
          this.renderAnimations(targetSubId);
          window.location.hash = targetSubId ? `#${targetSubId}` : '#animations';
          break;
        case 'videos':
          this.renderVideos();
          window.location.hash = '#videos';
          break;
        case 'activities':
          this.renderActivities(targetSubId);
          window.location.hash = targetSubId ? `#${targetSubId}` : '#activities';
          break;
        case 'glossary':
          this.renderGlossary();
          window.location.hash = '#glossary';
          break;
        case 'quizzes':
          this.renderQuizzes(targetSubId);
          window.location.hash = targetSubId ? `#${targetSubId}` : '#quizzes';
          break;
        case 'progress':
          this.renderProgress();
          window.location.hash = '#progress';
          break;
        case 'help':
          this.renderHelp();
          window.location.hash = '#help';
          break;
        default:
          this.renderHome();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    initRouting() {
      const handleHash = () => {
        const hash = window.location.hash.replace('#', '').trim();
        if (!hash) {
          this.switchTab('home');
          return;
        }

        if (hash.startsWith('simulation-')) {
          this.switchTab('simulations', hash);
        } else if (hash.startsWith('anim-')) {
          this.switchTab('animations', hash);
        } else if (hash.startsWith('module-')) {
          const modId = hash.replace('module-', '').replace(/-/g, '_');
          this.switchTab('topics', modId);
        } else if (hash.startsWith('quiz-')) {
          this.switchTab('quizzes', hash);
        } else if (hash.startsWith('act-')) {
          this.switchTab('activities', hash);
        } else if (['home', 'topics', 'simulations', 'animations', 'videos', 'activities', 'glossary', 'quizzes', 'progress', 'help'].includes(hash)) {
          this.switchTab(hash);
        } else {
          this.switchTab('home');
        }
      };

      window.addEventListener('hashchange', handleHash);
      handleHash();
    },

    bindHeader() {
      // Sound toggle
      const soundBtn = document.getElementById('sound-toggle-btn');
      if (soundBtn) {
        soundBtn.addEventListener('click', () => {
          state.soundEnabled = !state.soundEnabled;
          AudioSys.enabled = state.soundEnabled;
          Storage.set('bio7_sound', state.soundEnabled);
          this.updateSoundDisplay();
          if (state.soundEnabled) AudioSys.playClick();
        });
      }

      // Mobile drawer toggle
      const menuBtn = document.getElementById('menu-toggle-btn');
      const drawer = document.getElementById('mobile-drawer');
      if (menuBtn && drawer) {
        menuBtn.addEventListener('click', () => {
          drawer.classList.toggle('open');
          AudioSys.playClick();
        });
      }

      // Brand click -> Home
      const brand = document.querySelector('.brand-group');
      if (brand) {
        brand.addEventListener('click', () => this.switchTab('home'));
      }

      // Top nav tab buttons
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.getAttribute('data-tab');
          AudioSys.playClick();
          this.switchTab(tab);
        });
      });

      // Mobile nav tab buttons
      document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.getAttribute('data-tab');
          AudioSys.playClick();
          this.switchTab(tab);
        });
      });
    },

    updateStarsDisplay() {
      const starEl = document.getElementById('header-stars-count');
      if (starEl) starEl.textContent = state.stars;
      const progressStarEl = document.getElementById('progress-stars-val');
      if (progressStarEl) progressStarEl.textContent = state.stars;
    },

    updateSoundDisplay() {
      const soundBtn = document.getElementById('sound-toggle-btn');
      if (soundBtn) {
        soundBtn.textContent = state.soundEnabled ? '🔊' : '🔇';
        soundBtn.title = state.soundEnabled ? 'ხმა ჩართულია' : 'ხმა გამორთულია';
      }
    },

    addProgress(type, id, starsEarned = 1) {
      let isNew = false;
      if (type === 'simulations' && !state.completedSims.includes(id)) {
        state.completedSims.push(id);
        Storage.set('bio7_completed_sims', state.completedSims);
        isNew = true;
      } else if (type === 'animations' && !state.completedAnims.includes(id)) {
        state.completedAnims.push(id);
        Storage.set('bio7_completed_anims', state.completedAnims);
        isNew = true;
      } else if (type === 'quizzes' && !state.completedQuizzes[id]) {
        state.completedQuizzes[id] = true;
        Storage.set('bio7_completed_quizzes', state.completedQuizzes);
        isNew = true;
      }

      state.stars += starsEarned;
      Storage.set('bio7_stars', state.stars);
      this.updateStarsDisplay();

      if (isNew) {
        AudioSys.playTrophy();
        this.showToast(`⭐ შესანიშნავია! მიიღე +${starsEarned} ვარსკვლავი!`);
      }
    },

    showToast(message) {
      let toast = document.getElementById('app-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'app-toast';
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.right = '24px';
        toast.style.background = '#0f172a';
        toast.style.color = '#ffffff';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '12px';
        toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        toast.style.zIndex = '9999';
        toast.style.fontWeight = '700';
        toast.style.fontSize = '0.95rem';
        toast.style.transition = 'opacity 0.3s, transform 0.3s';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
      }, 3000);
    },

    // ------------------------------------------------------------------------
    // 1. HOME VIEW
    // ------------------------------------------------------------------------
    renderHome() {
      const container = document.getElementById('view-home');
      if (!container) return;

      const totalSims = (typeof SIMULATIONS_DATA !== 'undefined') ? SIMULATIONS_DATA.length : 12;
      const totalAnims = (typeof ANIMATIONS_DATA !== 'undefined') ? ANIMATIONS_DATA.length : 13;
      const totalModules = ALL_MODULES.length;
      const totalActivities = totalSims + totalAnims + totalModules;

      const completedCount = state.completedSims.length + state.completedAnims.length + Object.keys(state.completedModules).length;
      const progressPercent = Math.min(100, Math.round((completedCount / (totalActivities || 1)) * 100));

      container.innerHTML = `
        <div class="container">
          <!-- Hero Section -->
          <div class="home-hero">
            <div class="hero-content">
              <span class="hero-tag">🌱 VII კლასის ბიოლოგია</span>
              <h1 class="hero-title">აღმოაჩინე ბუნებისა და სიცოცხლის საიდუმლოებები</h1>
              <p class="hero-desc">
                გამოიკვლიე უჯრედის საოცარი აგებულება, აამუშავე ინტერაქტიული სიმულაციები, დააკვირდი ცოცხალ პროცესებს მოძრაობაში და გახდი ნამდვილი ბუნებისმკვლევარი!
              </p>
              <div class="hero-actions">
                <button class="btn-hero btn-hero-primary" onclick="App.switchTab('simulations')">
                  🔬 დაიწყე სიმულაცია
                </button>
                <button class="btn-hero btn-hero-secondary" onclick="App.switchTab('topics')">
                  📚 თემების გაცნობა
                </button>
              </div>
            </div>
          </div>

          <!-- Progress Overview Card -->
          <div class="home-progress-card">
            <div class="progress-info">
              <div class="progress-title">🌟 ჩემი სასწავლო პროგრესი</div>
              <div class="progress-sub">შესრულებულია აქტივობების ${progressPercent}%</div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
              </div>
            </div>
            <div class="progress-stats-pill">
              ⭐ ${state.stars} დაგროვებული ვარსკვლავი
            </div>
          </div>

          <!-- 6 Quick Navigation Cards -->
          <div class="section-header">
            <h2 class="section-heading">⚡ სწრაფი გადასასვლელები</h2>
          </div>
          <div class="quick-cards-grid">
            <div class="quick-card" onclick="App.switchTab('simulations')">
              <div class="quick-card-icon">🔬</div>
              <div class="quick-card-body">
                <div class="quick-card-title">სიმულაციები</div>
                <div class="quick-card-desc">12 მართვადი ექსპერიმენტი და ვირტუალური ლაბორატორია</div>
              </div>
            </div>

            <div class="quick-card" onclick="App.switchTab('animations')">
              <div class="quick-card-icon">▶</div>
              <div class="quick-card-body">
                <div class="quick-card-title">ანიმაციები</div>
                <div class="quick-card-desc">13 ეტაპობრივი ანიმაცია ბიოლოგიური პროცესების შესასწავლად</div>
              </div>
            </div>

            <div class="quick-card" onclick="App.switchTab('videos')">
              <div class="quick-card-icon">🎬</div>
              <div class="quick-card-body">
                <div class="quick-card-title">ვიდეოები</div>
                <div class="quick-card-desc">სასწავლო ვიდეოგაკვეთილი მიკროორგანიზმების სამყაროზე</div>
              </div>
            </div>

            <div class="quick-card" onclick="App.switchTab('activities')">
              <div class="quick-card-icon">🧬</div>
              <div class="quick-card-body">
                <div class="quick-card-title">აქტივობები</div>
                <div class="quick-card-desc">პრაქტიკული სამუშაოები, დახარისხება და კვლევითი დავალებები</div>
              </div>
            </div>

            <div class="quick-card" onclick="App.switchTab('glossary')">
              <div class="quick-card-icon">📖</div>
              <div class="quick-card-body">
                <div class="quick-card-title">ლექსიკონი</div>
                <div class="quick-card-desc">ბიოლოგიური ტერმინების ანბანური განმარტებითი ცნობარი</div>
              </div>
            </div>

            <div class="quick-card" onclick="App.switchTab('quizzes')">
              <div class="quick-card-icon">✅</div>
              <div class="quick-card-body">
                <div class="quick-card-title">ტესტები</div>
                <div class="quick-card-desc">თემატური ტესტები და შემაჯამებელი ცოდნის შემმოწმებელი</div>
              </div>
            </div>
          </div>

          <!-- Spotlights Section -->
          <div class="section-header">
            <h2 class="section-heading">🎯 ყურადღების ცენტრში</h2>
          </div>
          <div class="spotlights-grid">
            <div class="spotlight-card">
              <span class="spotlight-badge sim">რჩეული სიმულაცია</span>
              <h3 class="spotlight-title">🔬 სინათლის მიკროსკოპი</h3>
              <p class="spotlight-desc">შეისწავლე მიკროსკოპის ოპტიკა, გაასწორე ფოკუსი და დაათვალიერე ხახვისა და ლოყის უჯრედები.</p>
              <button class="btn btn-primary btn-sm" onclick="App.switchTab('simulations', 'simulation-microscope')">
                დაწყება ▶
              </button>
            </div>

            <div class="spotlight-card">
              <span class="spotlight-badge anim">რეკომენდებული ანიმაცია</span>
              <h3 class="spotlight-title">🌿 ფოტოსინთეზის მექანიზმი</h3>
              <p class="spotlight-desc">ნახე ეტაპობრივად, როგორ გარდაქმნის მწვანე ფოთოლი მზის სინათლეს, წყალსა და CO2-ს საკვებად.</p>
              <button class="btn btn-accent btn-sm" onclick="App.switchTab('animations', 'anim-photosynthesis')">
                ნახვა ▶
              </button>
            </div>

            <div class="spotlight-card">
              <span class="spotlight-badge video">ვიდეოგაკვეთილი</span>
              <h3 class="spotlight-title">🎬 მიკროორგანიზმების სამყარო</h3>
              <p class="spotlight-desc">გაეცანი ბაქტერიებისა და ერთუჯრედიანების უხილავ სამყაროს მაღალი ხარისხის ვიდეოში.</p>
              <button class="btn btn-outline btn-sm" onclick="App.switchTab('videos')">
                ყურება ▶
              </button>
            </div>

            <div class="spotlight-card">
              <span class="spotlight-badge quiz">სწრაფი გამოწვევა</span>
              <h3 class="spotlight-title">✅ ტესტი: უჯრედის აგებულება</h3>
              <p class="spotlight-desc">შეამოწმე შენი ცოდნა მცენარეული და ცხოველური უჯრედის ორგანელებზე და მოიპოვე ვარსკვლავები.</p>
              <button class="btn btn-outline btn-sm" onclick="App.switchTab('quizzes', 'quiz-ch1')">
                გამოცადე თავი ▶
              </button>
            </div>
          </div>
        </div>
      `;
    },

    // ------------------------------------------------------------------------
    // 2. TOPICS VIEW
    // ------------------------------------------------------------------------
    renderTopics(targetModuleId) {
      const container = document.getElementById('view-topics');
      if (!container) return;

      if (targetModuleId) {
        this.openModule(targetModuleId);
        return;
      }

      state.currentModuleId = null;

      const filtered = ALL_MODULES.filter(m => {
        const matchesChapter = state.topicsFilter === 'all' || m.chapterId === state.topicsFilter;
        const matchesSearch = !state.searchTopics || 
          m.title.toLowerCase().includes(state.searchTopics.toLowerCase()) ||
          m.subtitle.toLowerCase().includes(state.searchTopics.toLowerCase());
        return matchesChapter && matchesSearch;
      });

      const filterButtonsHtml = CHAPTERS.map(ch => `
        <button class="chapter-filter-btn ${state.topicsFilter === ch.id ? 'active' : ''}" data-ch="${ch.id}">
          ${ch.short}
        </button>
      `).join('');

      const modulesHtml = filtered.map(m => {
        const isDone = state.completedModules[m.id];
        return `
          <div class="module-card" data-id="${m.id}">
            <div class="module-card-top">
              <span class="module-card-chapter">${m.chapterTitle.split(':')[0]}</span>
              <span class="module-card-page">${m.pages}</span>
            </div>
            <h3 class="module-card-title">${m.number}. ${m.title}</h3>
            <p class="module-card-desc">${m.subtitle}</p>
            <div class="module-card-footer">
              <span>${isDone ? '✅ დასრულებულია' : '📖 თემის შესწავლა'}</span>
              <span>შესვლა ▶</span>
            </div>
          </div>
        `;
      }).join('');

      container.innerHTML = `
        <div class="container">
          <div class="sim-catalog-header">
            <h2 class="sim-catalog-title">📚 ბიოლოგიის სასწავლო თემები</h2>
            <p class="sim-catalog-subtitle">
              VII კლასის ბიოლოგიის სახელმძღვანელოს ყველა თავი და პარაგრაფი ინტეგრირებული თეორიით, ილუსტრაციებითა და ინტერაქტიული აქტივობებით.
            </p>
          </div>

          <div class="sim-filter-bar">
            <input type="text" class="sim-search-input" id="topics-search-input" placeholder="🔍 მოძებნე თემა ან საკვანძო სიტყვა..." value="${state.searchTopics}">
            <div class="chapters-nav">
              ${filterButtonsHtml}
            </div>
          </div>

          <div class="modules-grid">
            ${modulesHtml.length > 0 ? modulesHtml : '<p style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-light);">თემა ვერ მოიძებნა.</p>'}
          </div>
        </div>
      `;

      // Event listeners
      container.querySelectorAll('.chapter-filter-btn').forEach(b => {
        b.addEventListener('click', () => {
          state.topicsFilter = b.getAttribute('data-ch');
          this.renderTopics();
        });
      });

      const sInput = document.getElementById('topics-search-input');
      if (sInput) {
        sInput.addEventListener('input', (e) => {
          state.searchTopics = e.target.value;
          this.renderTopics();
        });
      }

      container.querySelectorAll('.module-card').forEach(c => {
        c.addEventListener('click', () => {
          const modId = c.getAttribute('data-id');
          this.openModule(modId);
        });
      });
    },

    openModule(modId, stepIdx = 0) {
      const container = document.getElementById('view-topics');
      if (!container) return;

      const mod = ALL_MODULES.find(m => m.id === modId);
      if (!mod) {
        this.renderTopics();
        return;
      }

      state.currentModuleId = modId;
      state.currentStepIndex = stepIdx;

      const stepTabsHtml = STEPS.map((s, idx) => `
        <button class="step-tab-btn ${idx === stepIdx ? 'active' : ''}" data-idx="${idx}">
          <span>${s.num}.</span> ${s.title}
        </button>
      `).join('');

      let contentHtml = '';
      if (stepIdx === 0) {
        contentHtml = `
          <h3>🎯 რას ვისწავლით ამ გაკვეთილში?</h3>
          <ul style="margin: 1rem 0 1.5rem 1.5rem; line-height:1.8;">
            ${(mod.goals || []).map(g => `<li>${g}</li>`).join('')}
          </ul>
        `;
      } else if (stepIdx === 1) {
        contentHtml = `
          <div class="theory-body">
            ${mod.theory || '<p>თეორიული მასალა მზადდება.</p>'}
          </div>
        `;
      } else if (stepIdx === 2) {
        contentHtml = `
          <h3>👁️ დააკვირდი და გააანალიზე</h3>
          ${mod.observe ? mod.observe.content || '' : ''}
          ${mod.simulationRef ? `
            <div style="margin-top:1.5rem; padding:1.25rem; background:#f0fdf4; border:2px solid #bbf7d0; border-radius:12px;">
              <h4>🔬 ამ თემასთან დაკავშირებულია ინტერაქტიული სიმულაცია:</h4>
              <button class="btn btn-primary" style="margin-top:0.75rem;" onclick="App.switchTab('simulations', '${mod.simulationRef}')">
                სიმულაციის გახსნა ▶
              </button>
            </div>
          ` : ''}
          ${mod.animationRef ? `
            <div style="margin-top:1.5rem; padding:1.25rem; background:#eff6ff; border:2px solid #bfdbfe; border-radius:12px;">
              <h4>🎬 ამ თემასთან დაკავშირებულია ანიმაცია:</h4>
              <button class="btn btn-accent" style="margin-top:0.75rem;" onclick="App.switchTab('animations', '${mod.animationRef}')">
                ანიმაციის ნახვა ▶
              </button>
            </div>
          ` : ''}
        `;
      } else if (stepIdx === 3) {
        contentHtml = `
          <h3>🧪 პრაქტიკული აქტივობა და ექსპერიმენტი</h3>
          ${mod.activity ? `<p>${mod.activity.instruction || ''}</p>` : ''}
          <div id="module-activity-area">
            ${mod.activity ? (mod.activity.content || '<p>აქტივობა მზადდება.</p>') : '<p>აქტივობა მზადდება.</p>'}
          </div>
        `;
      } else if (stepIdx === 4) {
        contentHtml = `
          <h3>✅ შეამოწმე თავი (თვითშემოწმების ტესტი)</h3>
          <div id="module-quiz-area">
            ${(mod.quiz && mod.quiz.questions) ? mod.quiz.questions.map((q, qIdx) => `
              <div style="margin-bottom:1.5rem; background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid var(--border);">
                <div style="font-weight:700; margin-bottom:0.75rem;">${qIdx + 1}. ${q.question}</div>
                <div style="display:flex; flex-direction:column; gap:0.5rem;">
                  ${q.options.map((opt, oIdx) => `
                    <button class="sim-opt-btn" data-correct="${oIdx === q.correct}" onclick="
                      this.parentElement.querySelectorAll('button').forEach(b => b.disabled = true);
                      if (this.getAttribute('data-correct') === 'true') {
                        this.classList.add('correct');
                        App.addProgress('modules', '${mod.id}');
                      } else {
                        this.classList.add('wrong');
                      }
                    ">
                      ${opt}
                    </button>
                  `).join('')}
                </div>
              </div>
            `).join('') : '<p>ტესტის კითხვები მზადდება.</p>'}
          </div>
        `;
      } else if (stepIdx === 5) {
        contentHtml = `
          <h3>🏆 გაკვეთილის შეჯამება</h3>
          <div style="background:#fffbeb; border:2px solid #fde68a; border-radius:12px; padding:1.5rem; line-height:1.7;">
            ${mod.summary ? mod.summary.content || mod.subtitle : mod.subtitle}
          </div>
        `;
      } else {
        contentHtml = `
          <h3>📖 სახელმძღვანელოს გვერდები</h3>
          <p>ეს თემა შეესაბამება VII კლასის ბიოლოგიის სახელმძღვანელოს: <strong>${mod.pages}</strong></p>
          <div style="background:#f1f5f9; padding:1.5rem; border-radius:12px; margin-top:1rem;">
            💡 გაკვეთილის დასრულების შემდეგ გადაიკითხეთ სახელმძღვანელოს შესაბამისი პარაგრაფი ცოდნის გასაღრმავებლად.
          </div>
        `;
      }

      container.innerHTML = `
        <div class="container">
          <div class="lesson-container">
            <div class="lesson-top-bar">
              <button class="btn btn-outline" onclick="App.renderTopics()">
                ⬅️ თემების სიაში დაბრუნება
              </button>
              <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                <span class="badge badge-primary">${mod.chapterTitle.split(':')[0]}</span>
                <span class="badge badge-subtle">${mod.pages}</span>
              </div>
            </div>

            <h2 style="font-size:1.6rem; font-weight:800; margin-bottom:0.5rem;">${mod.number}. ${mod.title}</h2>
            <p style="color:var(--text-muted); margin-bottom:1.5rem;">${mod.subtitle}</p>

            <div class="lesson-stepper">
              ${stepTabsHtml}
            </div>

            <div class="lesson-step-content">
              ${contentHtml}
            </div>

            <div class="lesson-nav-buttons">
              <button class="btn btn-outline" ${stepIdx === 0 ? 'disabled style="opacity:0.5;"' : ''} onclick="App.openModule('${mod.id}', ${stepIdx - 1})">
                ◀ წინა ნაბიჯი
              </button>
              <span style="font-size:0.9rem; font-weight:700; color:var(--text-muted);">
                ნაბიჯი ${stepIdx + 1} / 7
              </span>
              <button class="btn btn-primary" ${stepIdx === 6 ? 'disabled style="opacity:0.5;"' : ''} onclick="App.openModule('${mod.id}', ${stepIdx + 1})">
                შემდეგი ნაბიჯი ▶
              </button>
            </div>
          </div>
        </div>
      `;

      container.querySelectorAll('.step-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          this.openModule(modId, idx);
        });
      });
    },

    // ------------------------------------------------------------------------
    // 3. SIMULATIONS VIEW
    // ------------------------------------------------------------------------
    renderSimulations(targetSimId) {
      const container = document.getElementById('view-simulations');
      if (!container) return;

      if (targetSimId && typeof SimEngine !== 'undefined') {
        state.activeSimId = targetSimId;
        container.innerHTML = `<div class="container">${SimEngine.renderSimulation(targetSimId)}</div>`;
        SimEngine.initSimulation(targetSimId);
        return;
      }

      state.activeSimId = null;
      const sims = typeof SIMULATIONS_DATA !== 'undefined' ? SIMULATIONS_DATA : [];

      const filtered = sims.filter(s => {
        const matchesChapter = state.simsFilter === 'all' || s.chapterName.includes(state.simsFilter);
        const matchesSearch = !state.searchSims || 
          s.title.toLowerCase().includes(state.searchSims.toLowerCase()) ||
          s.goal.toLowerCase().includes(state.searchSims.toLowerCase());
        return matchesChapter && matchesSearch;
      });

      const cardsHtml = filtered.map(sim => `
        <div class="sim-card">
          <div class="sim-card-top">
            <span class="sim-card-topic">${sim.chapterName.split(':')[0]}</span>
            <span class="sim-card-duration">⏱️ ${sim.duration || '5-7 წუთი'}</span>
          </div>
          <div class="sim-card-header">
            <div class="sim-card-icon">${sim.icon || '🔬'}</div>
            <h3 class="sim-card-title">${sim.title}</h3>
          </div>
          <p class="sim-card-desc">${sim.whatWeStudy || sim.goal}</p>
          <div class="sim-card-meta">
            ⚙️ <strong>პარამეტრები:</strong> ${sim.parametersSummary || 'მართვადი ცვლადები'}
          </div>
          <div class="sim-card-action">
            <button class="sim-card-btn" onclick="App.switchTab('simulations', '${sim.id}')">
              🔬 სიმულაციის დაწყება
            </button>
          </div>
        </div>
      `).join('');

      container.innerHTML = `
        <div class="container">
          <div class="sim-catalog-header">
            <h2 class="sim-catalog-title">🔬 ვირტუალური ლაბორატორია და სიმულაციები</h2>
            <p class="sim-catalog-subtitle">
              მართე ბიოლოგიური პროცესები რეალურ დროში: შეცვალე ტემპერატურა, განათება, გადიდება და კონცენტრაცია, დააფიქსირე დაკვირვებები ჟურნალში და გამოიტანე დასკვნა!
            </p>
          </div>

          <div class="sim-filter-bar">
            <input type="text" class="sim-search-input" id="sims-search-input" placeholder="🔍 მოძებნე სიმულაცია..." value="${state.searchSims}">
            <div class="chapters-nav">
              <button class="sim-filter-btn ${state.simsFilter === 'all' ? 'active' : ''}" data-filter="all">ყველა</button>
              <button class="sim-filter-btn ${state.simsFilter === 'თავი 1' ? 'active' : ''}" data-filter="თავი 1">თავი 1: უჯრედი</button>
              <button class="sim-filter-btn ${state.simsFilter === 'თავი 2' ? 'active' : ''}" data-filter="თავი 2">თავი 2: ბიომრავალფეროვნება</button>
              <button class="sim-filter-btn ${state.simsFilter === 'თავი 3' ? 'active' : ''}" data-filter="თავი 3">თავი 3: ფუნქციები</button>
              <button class="sim-filter-btn ${state.simsFilter === 'თავი 4' ? 'active' : ''}" data-filter="თავი 4">თავი 4: მიკროორგანიზმები</button>
            </div>
          </div>

          <div class="sim-grid-container">
            ${cardsHtml.length > 0 ? cardsHtml : '<p style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-light);">სიმულაცია ვერ მოიძებნა.</p>'}
          </div>
        </div>
      `;

      container.querySelectorAll('.sim-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.simsFilter = btn.getAttribute('data-filter');
          this.renderSimulations();
        });
      });

      const sInput = document.getElementById('sims-search-input');
      if (sInput) {
        sInput.addEventListener('input', (e) => {
          state.searchSims = e.target.value;
          this.renderSimulations();
        });
      }
    },

    // ------------------------------------------------------------------------
    // 4. ANIMATIONS VIEW
    // ------------------------------------------------------------------------
    renderAnimations(targetAnimId) {
      const container = document.getElementById('view-animations');
      if (!container) return;

      if (targetAnimId && typeof AnimEngine !== 'undefined') {
        state.activeAnimId = targetAnimId;
        const anim = ANIMATIONS_DATA.find(a => a.id === targetAnimId);
        container.innerHTML = `
          <div class="container">
            <div class="anim-stage-container">
              <div class="anim-top-nav">
                <button class="btn btn-outline" onclick="App.switchTab('animations')">
                  ⬅️ ანიმაციების კატალოგში დაბრუნება
                </button>
                <div style="display:flex; gap:0.5rem; align-items:center;">
                  <span class="badge badge-primary">${anim ? anim.chapterName : ''}</span>
                  <span class="badge badge-subtle">${anim ? anim.bookPage : ''}</span>
                </div>
              </div>
              ${AnimEngine.renderAnimation(targetAnimId)}
            </div>
          </div>
        `;
        AnimEngine.initAnimation(targetAnimId);
        return;
      }

      state.activeAnimId = null;
      const anims = typeof ANIMATIONS_DATA !== 'undefined' ? ANIMATIONS_DATA : [];

      const filtered = anims.filter(a => {
        const matchesChapter = state.animsFilter === 'all' || a.chapterName.includes(state.animsFilter);
        const matchesSearch = !state.searchAnims || 
          a.title.toLowerCase().includes(state.searchAnims.toLowerCase()) ||
          a.description.toLowerCase().includes(state.searchAnims.toLowerCase());
        return matchesChapter && matchesSearch;
      });

      const cardsHtml = filtered.map(anim => `
        <div class="anim-card">
          <div class="anim-card-top">
            <span class="anim-card-topic">${anim.chapterName.split(':')[0]}</span>
            <span class="anim-card-steps">🔢 ${anim.steps ? anim.steps.length : 4} ეტაპი</span>
          </div>
          <div class="anim-card-header">
            <div class="anim-card-icon">🎬</div>
            <h3 class="anim-card-title">${anim.title}</h3>
          </div>
          <p class="anim-card-desc">${anim.description}</p>
          <button class="anim-card-btn" onclick="App.switchTab('animations', '${anim.id}')">
            ▶ ანიმაციის ნახვა
          </button>
        </div>
      `).join('');

      container.innerHTML = `
        <div class="container">
          <div class="anim-catalog-header">
            <h2 class="anim-catalog-title">🎬 ეტაპობრივი საგანმანათლებლო ანიმაციები</h2>
            <p class="anim-catalog-subtitle">
              დააკვირდი რთულ ბიოლოგიურ მოვლენებს დინამიკაში: ეტაპობრივი ნაბიჯები, ქართულენოვანი განმარტებები და ინტერაქტიული საკონტროლო კითხვები.
            </p>
          </div>

          <div class="sim-filter-bar">
            <input type="text" class="sim-search-input" id="anims-search-input" placeholder="🔍 მოძებნე ანიმაცია..." value="${state.searchAnims}">
            <div class="chapters-nav">
              <button class="sim-filter-btn ${state.animsFilter === 'all' ? 'active' : ''}" data-filter="all">ყველა</button>
              <button class="sim-filter-btn ${state.animsFilter === 'თავი 1' ? 'active' : ''}" data-filter="თავი 1">თავი 1</button>
              <button class="sim-filter-btn ${state.animsFilter === 'თავი 2' ? 'active' : ''}" data-filter="თავი 2">თავი 2</button>
              <button class="sim-filter-btn ${state.animsFilter === 'თავი 3' ? 'active' : ''}" data-filter="თავი 3">თავი 3</button>
              <button class="sim-filter-btn ${state.animsFilter === 'თავი 4' ? 'active' : ''}" data-filter="თავი 4">თავი 4</button>
            </div>
          </div>

          <div class="anim-grid-container">
            ${cardsHtml.length > 0 ? cardsHtml : '<p style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-light);">ანიმაცია ვერ მოიძებნა.</p>'}
          </div>
        </div>
      `;

      container.querySelectorAll('.sim-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.animsFilter = btn.getAttribute('data-filter');
          this.renderAnimations();
        });
      });

      const sInput = document.getElementById('anims-search-input');
      if (sInput) {
        sInput.addEventListener('input', (e) => {
          state.searchAnims = e.target.value;
          this.renderAnimations();
        });
      }
    },

    // ------------------------------------------------------------------------
    // 5. VIDEOS VIEW
    // ------------------------------------------------------------------------
    renderVideos() {
      const container = document.getElementById('view-videos');
      if (!container) return;

      container.innerHTML = `
        <div class="container">
          <div class="video-view-wrap">
            <div class="video-inquiry-box">
              <div style="font-size:0.85rem; font-weight:800; color:var(--accent); text-transform:uppercase; margin-bottom:0.35rem;">
                🎬 სასწავლო ვიდეოგაკვეთილი
              </div>
              <h2 style="font-size:1.45rem; font-weight:800; color:var(--text-main); margin-bottom:0.5rem;">
                მიკროორგანიზმების საოცარი სამყარო (მიკრობიოლოგია)
              </h2>
              <p style="font-size:0.95rem; color:var(--text-muted); margin-bottom:0.75rem;">
                <strong>სასწავლო მიზანი:</strong> გაეცანით ბაქტერიების, ერთუჯრედიანებისა და მიკროსკოპული სოკოების მრავალფეროვნებას, მათ როლს ბუნების ნივთიერებათა წრებრუნვასა და ადამიანის ყოველდღიურ ცხოვრებაში.
              </p>
              <div style="background:#ffffff; border-left:4px solid var(--accent); padding:0.85rem 1.1rem; border-radius:6px; font-size:0.92rem; color:#1e40af; border:1px solid #bfdbfe;">
                🤔 <strong>რას მივაქციოთ ყურადღება ვიდეოს ყურებისას?</strong><br>
                • როგორ გამოიყურებიან ბაქტერიები მიკროსკოპის ქვეშ?<br>
                • რით განსხვავდებიან სასარგებლო და საზიანო მიკროორგანიზმები?<br>
                • რა როლი აქვთ მათ რძის მჟავა პროდუქტებისა და ანტიბიოტიკების წარმოებაში?
              </div>
            </div>

            <div class="video-player-box">
              <video id="main-bio-video" controls playsinline preload="metadata" style="width:100%; max-height:480px; background:#000; border-radius:8px; display:block;">
                <source src="media/My Movie 3.mp4" type="video/mp4">
                თქვენი ბრაუზერი ვერ უჭერს მხარს ვიდეოს დაკვრას.
              </video>
            </div>

            <div class="video-quiz-section">
              <h3 style="font-size:1.25rem; font-weight:800; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
                ❓ შეამოწმე რა გაიგე ვიდეოგაკვეთილიდან
              </h3>
              <div style="display:flex; flex-direction:column; gap:1.25rem;">
                <div style="background:#f8fafc; border:1px solid var(--border); border-radius:8px; padding:1.25rem;">
                  <div style="font-weight:700; margin-bottom:0.75rem;">1. რა როლს ასრულებენ ლაქტობაქტერიები ადამიანის ყოფაში?</div>
                  <div style="display:flex; flex-direction:column; gap:0.5rem;">
                    <button class="sim-opt-btn" onclick="this.classList.add('correct'); App.addProgress('quizzes', 'v1');">
                      მონაწილეობენ მაწვნის, იოგურტისა და ყველის დამზადებაში რძემჟავა დუღილით.
                    </button>
                    <button class="sim-opt-btn" onclick="this.classList.add('wrong');">
                      იწვევენ მცენარეების გახმობასა და დაავადებებს.
                    </button>
                  </div>
                </div>

                <div style="background:#f8fafc; border:1px solid var(--border); border-radius:8px; padding:1.25rem;">
                  <div style="font-weight:700; margin-bottom:0.75rem;">2. რით განსხვავდება ბაქტერიის უჯრედი მცენარეული უჯრედისგან?</div>
                  <div style="display:flex; flex-direction:column; gap:0.5rem;">
                    <button class="sim-opt-btn" onclick="this.classList.add('wrong');">
                      ბაქტერიას უზარმაზარი ბირთვი და ქლოროპლასტები აქვს.
                    </button>
                    <button class="sim-opt-btn" onclick="this.classList.add('correct'); App.addProgress('quizzes', 'v2');">
                      ბაქტერიას არ გააჩნია ჩამოყალიბებული მემბრანული ბირთვი (პროკარიოტია).
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    // ------------------------------------------------------------------------
    // 6. ACTIVITIES VIEW
    // ------------------------------------------------------------------------
    renderActivities(targetActId) {
      const container = document.getElementById('view-activities');
      if (!container) return;

      const activities = [
        {
          id: "act-microscope-prep",
          chapter: "თავი 1",
          title: "ხახვის კანის მიკროპრეპარატის დამზადების ეტაპები",
          desc: "დაალაგე ეტაპები სწორი ლოგიკური თანმიმდევრობით: საგნობრივი მინა, წყლის წვეთი, პინცეტი, საფარი მინა, შეღებვა.",
          type: "sequence"
        },
        {
          id: "act-cell-sorting",
          chapter: "თავი 1",
          title: "ორგანელების დახარისხება (მცენარეული vs ცხოველური)",
          desc: "გაანაწილე სტრუქტურები სწორ უჯრედში: ქლოროპლასტი, ცელულოზის კედელი, ბირთვი, ცენტრალური ვაკუოლი, ცენტრიოლები.",
          type: "sorting"
        },
        {
          id: "act-food-chain",
          chapter: "თავი 2",
          title: "ტყის ეკოსისტემის კვებითი ჯაჭვის აწყობა",
          desc: "დააკავშირე ტროფიკული რგოლები: მუხის რკო ➡️ ტყის თაგვი ➡️ გველი ➡️ მტაცებელი ფრინველი.",
          type: "chain"
        },
        {
          id: "act-tree-age",
          chapter: "თავი 3",
          title: "ხის ასაკისა და კლიმატური პირობების განსაზღვრა წლიური რგოლებით",
          desc: "დაითვალე წლიური რგოლები მერქნის განივ განაკვეთზე და ამოიცანი ხელსაყრელი და მშრალი წლები.",
          type: "rings"
        },
        {
          id: "act-bacteria-roles",
          chapter: "თავი 4",
          title: "სასარგებლო და საზიანო ბაქტერიების დაჯგუფება",
          desc: "გამოყავი ბუნების დამშლელები, რძემჟავა მწარმოებლები და პათოგენური ბაქტერიები.",
          type: "sorting"
        }
      ];

      const cardsHtml = activities.map(act => `
        <div class="sim-card">
          <div class="sim-card-top">
            <span class="sim-card-topic">${act.chapter}</span>
            <span class="sim-card-duration">🧬 ლაბორატორია</span>
          </div>
          <h3 class="sim-card-title">${act.title}</h3>
          <p class="sim-card-desc">${act.desc}</p>
          <button class="btn btn-primary btn-sm" onclick="App.runInteractiveActivity('${act.id}')">
            აქტივობის დაწყება ▶
          </button>
        </div>
      `).join('');

      container.innerHTML = `
        <div class="container">
          <div class="sim-catalog-header">
            <h2 class="sim-catalog-title">🧬 ინტერაქტიული აქტივობები და ლაბორატორიები</h2>
            <p class="sim-catalog-subtitle">
              პრაქტიკული სამუშაოები სახელმძღვანელოდან: მიკროპრეპარატის მომზადება, კლასიფიკაციის სავარჯიშოები და ეკოლოგიური ჯაჭვები.
            </p>
          </div>
          <div id="activity-workspace-area"></div>
          <div class="sim-grid-container">
            ${cardsHtml}
          </div>
        </div>
      `;

      if (targetActId) {
        this.runInteractiveActivity(targetActId);
      }
    },

    runInteractiveActivity(actId) {
      const area = document.getElementById('activity-workspace-area');
      if (!area) return;

      area.innerHTML = `
        <div class="sim-workspace" style="margin-bottom:2rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 style="margin:0;">🧬 აქტიური ლაბორატორიული დავალება</h3>
            <button class="btn btn-sm btn-outline" onclick="document.getElementById('activity-workspace-area').innerHTML=''">
              დახურვა ✕
            </button>
          </div>
          <div style="background:#f8fafc; padding:1.5rem; border-radius:8px; border:1px solid var(--border);">
            <p><strong>ინსტრუქცია:</strong> აირჩიეთ სწორი თანმიმდევრობა ან დააჯგუფეთ ობიექტები და დააჭირეთ „შემოწმებას“.</p>
            <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin:1rem 0;">
              <span class="badge badge-primary" style="padding:0.5rem 0.8rem; font-size:0.95rem;">1. საგნობრივი მინის გასუფთავება</span>
              <span class="badge badge-primary" style="padding:0.5rem 0.8rem; font-size:0.95rem;">2. წყლის წვეთის დატანა</span>
              <span class="badge badge-primary" style="padding:0.5rem 0.8rem; font-size:0.95rem;">3. ხახვის კანის ანათალის მოთავსება</span>
              <span class="badge badge-primary" style="padding:0.5rem 0.8rem; font-size:0.95rem;">4. საფარი მინის დაფარვა (45° კუთხით)</span>
            </div>
            <button class="btn btn-accent" onclick="
              this.textContent = '✅ შესანიშნავია! დავალება სწორად შესრულდა!';
              this.disabled = true;
              App.addProgress('activities', '${actId}');
            ">
              შემოწმება
            </button>
          </div>
        </div>
      `;
      window.scrollTo({ top: area.offsetTop - 80, behavior: 'smooth' });
    },

    // ------------------------------------------------------------------------
    // 7. GLOSSARY VIEW
    // ------------------------------------------------------------------------
    renderGlossary() {
      const container = document.getElementById('view-glossary');
      if (!container) return;

      const terms = typeof GLOSSARY_DATA !== 'undefined' ? GLOSSARY_DATA : (typeof GLOSSARY_TERMS !== 'undefined' ? GLOSSARY_TERMS : []);

      const alphabet = ['all', 'ა', 'ბ', 'გ', 'დ', 'ე', 'ვ', 'ზ', 'თ', 'ი', 'კ', 'ლ', 'მ', 'ნ', 'ო', 'პ', 'ჟ', 'რ', 'ს', 'ტ', 'უ', 'ფ', 'ქ', 'ღ', 'ყ', 'შ', 'ჩ', 'ც', 'ძ', 'წ', 'ჭ', 'ხ', 'ჯ', 'ჰ'];

      const filtered = terms.filter(item => {
        const matchesLetter = state.glossaryLetter === 'all' || item.term.startsWith(state.glossaryLetter);
        const matchesSearch = !state.searchGlossary || 
          item.term.toLowerCase().includes(state.searchGlossary.toLowerCase()) ||
          item.def.toLowerCase().includes(state.searchGlossary.toLowerCase());
        return matchesLetter && matchesSearch;
      });

      const lettersHtml = alphabet.map(l => `
        <button class="glossary-letter-btn ${state.glossaryLetter === l ? 'active' : ''}" data-letter="${l}">
          ${l === 'all' ? 'ყველა' : l}
        </button>
      `).join('');

      const cardsHtml = filtered.map(t => `
        <div class="term-card">
          <div class="term-title">${t.term}</div>
          <div class="term-def">${t.def}</div>
        </div>
      `).join('');

      container.innerHTML = `
        <div class="container">
          <div class="sim-catalog-header">
            <h2 class="sim-catalog-title">📖 ბიოლოგიური ლექსიკონი</h2>
            <p class="sim-catalog-subtitle">
              VII კლასის ბიოლოგიის ძირითადი ცნებები და ტერმინები ანბანური თანმიმდევრობით.
            </p>
          </div>

          <div class="sim-filter-bar">
            <input type="text" class="sim-search-input" id="glossary-search-input" placeholder="🔍 მოძებნე ტერმინი ან განმარტება..." value="${state.searchGlossary}">
          </div>

          <div class="glossary-letters">
            ${lettersHtml}
          </div>

          <div class="glossary-grid">
            ${cardsHtml.length > 0 ? cardsHtml : '<p style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-light);">ტერმინი ვერ მოიძებნა.</p>'}
          </div>
        </div>
      `;

      container.querySelectorAll('.glossary-letter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.glossaryLetter = btn.getAttribute('data-letter');
          this.renderGlossary();
        });
      });

      const sInput = document.getElementById('glossary-search-input');
      if (sInput) {
        sInput.addEventListener('input', (e) => {
          state.searchGlossary = e.target.value;
          this.renderGlossary();
        });
      }
    },

    // ------------------------------------------------------------------------
    // 8. QUIZZES VIEW
    // ------------------------------------------------------------------------
    renderQuizzes(targetQuizId) {
      const container = document.getElementById('view-quizzes');
      if (!container) return;

      const quizList = [
        { id: 'quiz-ch1', title: 'თავი 1: უჯრედი — სიცოცხლის ერთეული', count: 10, icon: '🔬', desc: 'მიკროსკოპი, ორგანელები, მცენარეული და ცხოველური უჯრედი, ოსმოსი.' },
        { id: 'quiz-ch2', title: 'თავი 2: ბიომრავალფეროვნება და კლასიფიკაცია', count: 10, icon: '🌿', desc: 'ერთუჯრედიანები (ამება, ევგლენა, ქალამანა), ტაქსონომია, დიქოტომიური გასაღები.' },
        { id: 'quiz-ch3', title: 'თავი 3: ორგანიზმთა აგებულება და ფუნქციები', count: 10, icon: '☀️', desc: 'ფოტოსინთეზი, სუნთქვა, ტრანსპირაცია, ნივთიერებათა ტრანსპორტი.' },
        { id: 'quiz-ch4', title: 'თავი 4: მიკროორგანიზმები და სოკოები', count: 10, icon: '🧫', desc: 'ბაქტერიები, ვირუსები, ობი, საფუარი, ალკოჰოლური დუღილი.' },
        { id: 'quiz-final', title: '🏆 შემაჯამებელი დიდი ტესტი (მთელი კურსი)', count: 15, icon: '⭐', desc: 'სრული VII კლასის შემაჯამებელი გამოწვევა მაღალი ქულისა და ჩემპიონის ტიტულისთვის!' }
      ];

      if (targetQuizId) {
        this.runQuiz(targetQuizId);
        return;
      }

      const cardsHtml = quizList.map(q => `
        <div class="sim-card">
          <div class="sim-card-top">
            <span class="sim-card-topic">ტესტირება</span>
            <span class="sim-card-duration">❓ ${q.count} შეკითხვა</span>
          </div>
          <div class="sim-card-header">
            <div class="sim-card-icon">${q.icon}</div>
            <h3 class="sim-card-title">${q.title}</h3>
          </div>
          <p class="sim-card-desc">${q.desc}</p>
          <button class="sim-card-btn" onclick="App.runQuiz('${q.id}')">
            ✅ ტესტის დაწყება
          </button>
        </div>
      `).join('');

      container.innerHTML = `
        <div class="container">
          <div class="sim-catalog-header">
            <h2 class="sim-catalog-title">✅ ცოდნის შემმოწმებელი ტესტები</h2>
            <p class="sim-catalog-subtitle">
              გამოცადე შენი თავი თითოეულ თავში ან ჩააბარე დიდი შემაჯამებელი ტესტი. ყოველი სწორი პასუხი მოგიტანს ვარსკვლავებს!
            </p>
          </div>
          <div id="active-quiz-runner"></div>
          <div class="sim-grid-container">
            ${cardsHtml}
          </div>
        </div>
      `;
    },

    runQuiz(quizId) {
      const container = document.getElementById('view-quizzes');
      if (!container) return;

      const questions = [
        {
          q: "რომელი ორგანელა შეიცავს მცენარეულ უჯრედში მწვანე პიგმენტ ქლოროფილს?",
          options: ["მიტოქონდრია", "ქლოროპლასტი", "რიბოსომა", "ბირთვი"],
          correct: 1,
          exp: "ქლოროპლასტი შეიცავს ქლოროფილს და მასში მიმდინარეობს ფოტოსინთეზი."
        },
        {
          q: "რა ემართება მცენარეულ უჯრედს კონცენტრირებულ მარილიან (ჰიპერტონულ) ხსნარში?",
          options: ["წყალს კარგავს და ციტოპლაზმა კედელს შორდება (პლაზმოლიზი)", "წყლით ივსება და სკდება", "არაფერი ემართება", "კედელი ეშლება"],
          correct: 0,
          exp: "ჰიპერტონულ გარემოში წყალი ოსმოსით გამოდის უჯრედიდან და ხდება პლაზმოლიზი."
        },
        {
          q: "რომელი ორგანოიდით გადაადგილდება მწვანე ევგლენა?",
          options: ["ცრუფეხებით", "წამწამებით", "შოლტით", "ფარფლებით"],
          correct: 2,
          exp: "მწვანე ევგლენას სხეულის წინა ბოლოზე აქვს ერთი გრძელი შოლტი."
        },
        {
          q: "რა აირი გამოიყოფა ფოტოსინთეზის შედეგად გარემოში?",
          options: ["აზოტი", "ნახშირორჟანგი", "ჟანგბადი", "მეთანი"],
          correct: 2,
          exp: "ფოტოსინთეზისას წყლის ფოტოლიზის შედეგად გამოიყოფა თავისუფალი ჟანგბადი (O2)."
        },
        {
          q: "რა არის ალკოჰოლური დუღილის ძირითადი აირადი პროდუქტი საფუარებში?",
          options: ["ნახშირორჟანგი (CO2)", "ჟანგბადი (O2)", "წყალბადი (H2)", "ჰელიუმი"],
          correct: 0,
          exp: "საფუარა სოკოები შაქრის დაშლისას გამოყოფენ ნახშირორჟანგს, რაც ცომს აფუებს."
        }
      ];

      let curIdx = 0;
      let score = 0;

      const renderQuestion = () => {
        if (curIdx >= questions.length) {
          // Finished
          AudioSys.playTrophy();
          App.addProgress('quizzes', quizId, score);
          container.innerHTML = `
            <div class="container">
              <div class="quiz-runner-card" style="text-align:center; padding:3rem 2rem;">
                <div style="font-size:3.5rem; margin-bottom:1rem;">🎉</div>
                <h2 style="font-size:1.8rem; font-weight:800; margin-bottom:0.5rem;">ტესტირება დასრულდა!</h2>
                <p style="font-size:1.2rem; color:var(--primary-hover); font-weight:700; margin-bottom:1.5rem;">
                  შენი შედეგი: ${score} / ${questions.length} ქულა (+${score} ⭐)
                </p>
                <div style="display:flex; justify-content:center; gap:1rem;">
                  <button class="btn btn-primary" onclick="App.runQuiz('${quizId}')">თავიდან გავლა ↺</button>
                  <button class="btn btn-outline" onclick="App.renderQuizzes()">ტესტების სიაში დაბრუნება</button>
                </div>
              </div>
            </div>
          `;
          return;
        }

        const q = questions[curIdx];
        container.innerHTML = `
          <div class="container">
            <div class="quiz-runner-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid var(--border); padding-bottom:1rem;">
                <button class="btn btn-sm btn-outline" onclick="App.renderQuizzes()">⬅️ გამოსვლა</button>
                <span style="font-weight:700; color:var(--text-muted);">შეკითხვა ${curIdx + 1} / ${questions.length}</span>
                <span class="badge badge-accent">ქულა: ${score}</span>
              </div>

              <div class="quiz-q-text">${curIdx + 1}. ${q.q}</div>

              <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
                ${q.options.map((opt, oIdx) => `
                  <button class="sim-opt-btn quiz-choice-btn" data-idx="${oIdx}">
                    ${opt}
                  </button>
                `).join('')}
              </div>

              <div id="quiz-q-feedback" style="display:none; padding:1rem; border-radius:8px; margin-bottom:1.5rem;"></div>

              <div style="display:flex; justify-content:flex-end;">
                <button class="btn btn-primary" id="quiz-next-btn" style="display:none;">
                  შემდეგი შეკითხვა ▶
                </button>
              </div>
            </div>
          </div>
        `;

        const choiceBtns = container.querySelectorAll('.quiz-choice-btn');
        const fb = document.getElementById('quiz-q-feedback');
        const nextBtn = document.getElementById('quiz-next-btn');

        choiceBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const chosen = parseInt(btn.getAttribute('data-idx'), 10);
            choiceBtns.forEach(b => b.disabled = true);

            if (chosen === q.correct) {
              score++;
              btn.classList.add('correct');
              fb.style.display = 'block';
              fb.style.background = '#dcfce7';
              fb.style.border = '1px solid #22c55e';
              fb.style.color = '#14532d';
              fb.innerHTML = `<strong>✅ სწორია!</strong> ${q.exp}`;
              AudioSys.playSuccess();
            } else {
              btn.classList.add('wrong');
              choiceBtns[q.correct].classList.add('correct');
              fb.style.display = 'block';
              fb.style.background = '#fee2e2';
              fb.style.border = '1px solid #ef4444';
              fb.style.color = '#7f1d1d';
              fb.innerHTML = `<strong>❌ არასწორია.</strong> ${q.exp}`;
              AudioSys.playError();
            }

            if (nextBtn) {
              nextBtn.style.display = 'inline-flex';
              nextBtn.addEventListener('click', () => {
                curIdx++;
                renderQuestion();
              });
            }
          });
        });
      };

      renderQuestion();
    },

    // ------------------------------------------------------------------------
    // 9. PROGRESS VIEW
    // ------------------------------------------------------------------------
    renderProgress() {
      const container = document.getElementById('view-progress');
      if (!container) return;

      const totalSims = (typeof SIMULATIONS_DATA !== 'undefined') ? SIMULATIONS_DATA.length : 12;
      const totalAnims = (typeof ANIMATIONS_DATA !== 'undefined') ? ANIMATIONS_DATA.length : 13;

      const badges = [
        { id: 'b1', name: '🔬 ნორჩი მკვლევარი', icon: '🔬', desc: 'ჩაატარა პირველი ინტერაქტიული სიმულაცია', unlocked: state.completedSims.length > 0 },
        { id: 'b2', name: '🎬 ბიოლოგიის მაყურებელი', icon: '🎬', desc: 'ნახა პირველი ეტაპობრივი ანიმაცია', unlocked: state.completedAnims.length > 0 },
        { id: 'b3', name: '🧬 უჯრედის მცოდნე', icon: '🧬', desc: 'გაიარა უჯრედის აგებულების ყველა საკითხი', unlocked: state.stars >= 5 },
        { id: 'b4', name: '🌿 ბოტანიკის ოსტატი', icon: '🌿', desc: 'შეისწავლა ფოტოსინთეზი და ტრანსპირაცია', unlocked: state.stars >= 10 },
        { id: 'b5', name: '🧫 მიკრობიოლოგი', icon: '🧫', desc: 'შეისწავლა ბაქტერიები და სოკოები', unlocked: state.stars >= 15 },
        { id: 'b6', name: '🏆 ბიოლოგიის ჩემპიონი', icon: '⭐', desc: 'დააგროვა 25-ზე მეტი ვარსკვლავი', unlocked: state.stars >= 25 }
      ];

      const badgesHtml = badges.map(b => `
        <div class="badge-item ${b.unlocked ? 'unlocked' : ''}">
          <div class="badge-icon-lg">${b.icon}</div>
          <div class="badge-name">${b.name}</div>
          <div class="badge-desc">${b.desc}</div>
          <span class="badge ${b.unlocked ? 'badge-primary' : 'badge-subtle'}" style="margin-top:0.35rem;">
            ${b.unlocked ? '✓ გახსნილია' : '🔒 დაბლოკილია'}
          </span>
        </div>
      `).join('');

      container.innerHTML = `
        <div class="container">
          <div class="sim-catalog-header">
            <h2 class="sim-catalog-title">🏆 ჩემი სასწავლო მიღწევები</h2>
            <p class="sim-catalog-subtitle">
              აკონტროლე შენი პროგრესი, შეაგროვე ვარსკვლავები და გახსენი ბიოლოგიის სამკერდე ნიშნები!
            </p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.25rem; margin-bottom:2rem;">
            <div class="sim-readout-card">
              <span class="sim-readout-lbl">ვარსკვლავები</span>
              <span class="sim-readout-num" style="color:#d97706;">⭐ ${state.stars}</span>
            </div>
            <div class="sim-readout-card">
              <span class="sim-readout-lbl">სიმულაციები</span>
              <span class="sim-readout-num">${state.completedSims.length} / ${totalSims}</span>
            </div>
            <div class="sim-readout-card">
              <span class="sim-readout-lbl">ანიმაციები</span>
              <span class="sim-readout-num">${state.completedAnims.length} / ${totalAnims}</span>
            </div>
            <div class="sim-readout-card">
              <span class="sim-readout-lbl">თემები</span>
              <span class="sim-readout-num">${Object.keys(state.completedModules).length} / ${ALL_MODULES.length}</span>
            </div>
          </div>

          <div class="section-header">
            <h3 class="section-heading">🎖️ სამკერდე ნიშნების კოლექცია</h3>
          </div>
          <div class="badges-shelf">
            ${badgesHtml}
          </div>

          <div style="margin-top:3rem; padding-top:1.5rem; border-top:1px solid var(--border); display:flex; justify-content:flex-end;">
            <button class="btn btn-outline" style="color:var(--danger);" onclick="
              if (confirm('ნამდვილად გსურთ პროგრესის თავიდან დაწყება?')) {
                App.resetAllProgress();
              }
            ">
              🗑️ პროგრესის განულება
            </button>
          </div>
        </div>
      `;
    },

    resetAllProgress() {
      state.stars = 0;
      state.completedSims = [];
      state.completedAnims = [];
      state.completedModules = {};
      state.completedQuizzes = {};
      Storage.set('bio7_stars', 0);
      Storage.set('bio7_completed_sims', []);
      Storage.set('bio7_completed_anims', []);
      Storage.set('bio7_completed_modules', {});
      Storage.set('bio7_completed_quizzes', {});
      this.updateStarsDisplay();
      this.renderProgress();
      this.showToast('პროგრესი განულებულია.');
    },

    // ------------------------------------------------------------------------
    // 10. HELP VIEW
    // ------------------------------------------------------------------------
    renderHelp() {
      const container = document.getElementById('view-help');
      if (!container) return;

      container.innerHTML = `
        <div class="container">
          <div class="sim-catalog-header">
            <h2 class="sim-catalog-title">💡 დახმარება და გზამკვლევი მოსწავლისთვის</h2>
            <p class="sim-catalog-subtitle">
              ყველაფერი, რაც გჭირდება ბიოლოგიის ინტერაქტიულ პლატფორმასთან სამუშაოდ.
            </p>
          </div>

          <div style="display:flex; flex-direction:column; gap:1.5rem; max-width:860px; margin:0 auto;">
            <div style="background:var(--surface); border:2px solid var(--border); border-radius:12px; padding:1.5rem;">
              <h3 style="color:var(--primary-dark); margin-bottom:0.5rem;">🔬 როგორ გამოვიყენოთ სიმულაციები?</h3>
              <p>1. აირჩიე სასურველი სიმულაცია კატალოგიდან.</p>
              <p>2. გაეცანი საკვლევ შეკითხვას და დააფიქსირე <strong>შენი ვარაუდი (ჰიპოთეზა)</strong>.</p>
              <p>3. მართე სლაიდერები, ჩამრთველები და ღილაკები, რათა შეცვალო ექსპერიმენტის პარამეტრები.</p>
              <p>4. დააჭირე ღილაკს <strong>„📝 დაკვირვების დაფიქსირება“</strong>, რათა მიღებული შედეგი ჩაიწეროს შენს ჟურნალში.</p>
              <p>5. უპასუხე საკონტროლო დასკვნის კითხვას და მიიღე ვარსკვლავი!</p>
            </div>

            <div style="background:var(--surface); border:2px solid var(--border); border-radius:12px; padding:1.5rem;">
              <h3 style="color:var(--accent-hover); margin-bottom:0.5rem;">🎬 როგორ ვმართოთ ანიმაციები?</h3>
              <p>ანიმაციები დაყოფილია ეტაპებად (1..N). შეგიძლია გამოიყენო „◀ წინა“ და „შემდეგი ▶“ ღილაკები ან ავტომატური გაშვება „▶ გაშვება“ ღილაკით. შეარჩიე შენთვის მოსახერხებელი სიჩქარე (0.5x, 1x, 2x).</p>
            </div>

            <div style="background:var(--surface); border:2px solid var(--border); border-radius:12px; padding:1.5rem;">
              <h3 style="color:#d97706; margin-bottom:0.5rem;">⭐ როგორ დავაგროვოთ ვარსკვლავები?</h3>
              <p>ვარსკვლავები გენიჭება თემების გავლისთვის, სიმულაციებსა და ანიმაციებში სწორი დასკვნების გამოტანისთვის და ტესტების წარმატებით ჩაბარებისთვის.</p>
            </div>

            <div style="background:var(--surface); border:2px solid var(--border); border-radius:12px; padding:1.5rem;">
              <h3 style="color:var(--text-main); margin-bottom:0.5rem;">⌨️ კლავიატურით მართვა</h3>
              <p>საიტზე სრულად შეგიძლიათ გადაადგილდეთ კლავიატურის <kbd>Tab</kbd> ღილაკით, ხოლო არჩევანი გააკეთოთ <kbd>Enter</kbd> ან <kbd>Space</kbd> ღილაკით.</p>
            </div>
          </div>
        </div>
      `;
    }
  };

  window.App = App;

  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
})();
