// ============================================================================
// ANIM_ENGINE.JS — 13 ეტაპობრივი საგანმანათლებლო ანიმაციის მართვა და ვიზუალიზაცია
// ============================================================================

const AnimEngine = {
  instances: {},

  renderAnimation(animId) {
    const anim = ANIMATIONS_DATA.find(a => a.id === animId);
    if (!anim) return '';

    const firstStep = anim.steps[0];

    const pillsHtml = anim.steps.map((s, idx) => `
      <div class="anim-step-dot ${idx === 0 ? 'active' : ''}" data-anim="${animId}" data-idx="${idx}" title="${s.title}">
        ${idx + 1}
      </div>
    `).join('');

    const questionHtml = `
      <div class="sim-conclusion" id="${animId}-question-box" style="margin-top:1.5rem;">
        <div class="sim-conclusion-q">❓ საკონტროლო შეკითხვა: ${anim.question}</div>
        <div class="sim-options-list">
          ${anim.options.map((opt, idx) => `
            <button class="sim-opt-btn anim-opt-btn" data-anim="${animId}" data-idx="${idx}">
              ${opt.text}
            </button>
          `).join('')}
        </div>
        <div class="sim-explanation-box" id="${animId}-explanation"></div>
      </div>
    `;

    return `
      <div class="anim-container" id="${animId}" data-anim-id="${animId}">
        <div class="anim-header">
          <div class="sim-meta-wrap">
            <div class="sim-badges-row">
              <span class="anim-type-badge">🎬 ეტაპობრივი ანიმაცია</span>
              <span class="sim-page-badge">სახელმძღვანელო: ${anim.bookPage}</span>
            </div>
            <h3 class="sim-title">${anim.title}</h3>
            <p style="margin:0; font-size:0.9rem; color:var(--text-muted);">${anim.description}</p>
          </div>
        </div>

        <div class="anim-stage-card">
          <div id="${animId}-stage" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
            ${this.getStageSvg(animId, 0)}
          </div>
        </div>

        <div class="anim-step-banner">
          <div class="anim-step-title" id="${animId}-step-title">${firstStep.title}</div>
          <p class="anim-step-desc" id="${animId}-step-desc">${firstStep.text}</p>
        </div>

        <div class="anim-controls-bar">
          <div class="anim-btn-group">
            <button class="anim-btn" id="${animId}-prev-btn" title="წინა ეტაპი">◀ წინა</button>
            <button class="anim-btn primary" id="${animId}-play-btn" title="გაშვება / შეჩერება">▶ გაშვება</button>
            <button class="anim-btn" id="${animId}-next-btn" title="შემდეგი ეტაპი">შემდეგი ▶</button>
            <button class="anim-btn" id="${animId}-reset-btn" title="თავიდან დაწყება">⏮ თავიდან</button>
          </div>

          <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
            <div class="anim-step-pills">
              ${pillsHtml}
            </div>
            <select class="form-input" id="${animId}-speed-select" style="padding:0.3rem 0.5rem; font-size:0.85rem; width:auto;">
              <option value="4000">სიჩქარე: 1x</option>
              <option value="6000">სიჩქარე: 0.5x (ნელი)</option>
              <option value="2500">სიჩქარე: 2x (სწრაფი)</option>
            </select>
          </div>
        </div>

        ${questionHtml}
      </div>
    `;
  },

  initAnimation(animId) {
    const anim = ANIMATIONS_DATA.find(a => a.id === animId);
    if (!anim) return;

    const inst = {
      currentStep: 0,
      isPlaying: false,
      timer: null,
      speed: 4000
    };
    this.instances[animId] = inst;

    const playBtn = document.getElementById(`${animId}-play-btn`);
    const prevBtn = document.getElementById(`${animId}-prev-btn`);
    const nextBtn = document.getElementById(`${animId}-next-btn`);
    const resetBtn = document.getElementById(`${animId}-reset-btn`);
    const speedSelect = document.getElementById(`${animId}-speed-select`);

    const updateUI = () => {
      const step = anim.steps[inst.currentStep];
      const titleEl = document.getElementById(`${animId}-step-title`);
      const descEl = document.getElementById(`${animId}-step-desc`);
      const stageEl = document.getElementById(`${animId}-stage`);

      if (titleEl) titleEl.textContent = step.title;
      if (descEl) descEl.textContent = step.text;
      if (stageEl) stageEl.innerHTML = this.getStageSvg(animId, inst.currentStep);

      // Update pills
      const dots = document.querySelectorAll(`.anim-step-dot[data-anim="${animId}"]`);
      dots.forEach((dot, idx) => {
        dot.className = 'anim-step-dot';
        if (idx === inst.currentStep) dot.classList.add('active');
        else if (idx < inst.currentStep) dot.classList.add('passed');
      });

      if (playBtn) {
        playBtn.textContent = inst.isPlaying ? '⏸ შეჩერება' : '▶ გაშვება';
      }
    };

    const nextStep = () => {
      if (inst.currentStep < anim.steps.length - 1) {
        inst.currentStep++;
      } else {
        inst.currentStep = 0; // Loop or stop
      }
      updateUI();
    };

    const prevStep = () => {
      if (inst.currentStep > 0) {
        inst.currentStep--;
        updateUI();
      }
    };

    const startPlay = () => {
      inst.isPlaying = true;
      clearInterval(inst.timer);
      inst.timer = setInterval(() => {
        if (inst.currentStep < anim.steps.length - 1) {
          inst.currentStep++;
          updateUI();
        } else {
          stopPlay();
        }
      }, inst.speed);
      updateUI();
    };

    const stopPlay = () => {
      inst.isPlaying = false;
      clearInterval(inst.timer);
      updateUI();
    };

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (inst.isPlaying) stopPlay();
        else startPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopPlay();
        nextStep();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopPlay();
        prevStep();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        stopPlay();
        inst.currentStep = 0;
        updateUI();
      });
    }

    if (speedSelect) {
      speedSelect.addEventListener('change', () => {
        inst.speed = parseInt(speedSelect.value, 10);
        if (inst.isPlaying) startPlay();
      });
    }

    // Pills clicking
    const dots = document.querySelectorAll(`.anim-step-dot[data-anim="${animId}"]`);
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        stopPlay();
        inst.currentStep = parseInt(dot.getAttribute('data-idx'), 10);
        updateUI();
      });
    });

    // Post-animation question handling
    const qBtns = document.querySelectorAll(`.anim-opt-btn[data-anim="${animId}"]`);
    const explBox = document.getElementById(`${animId}-explanation`);
    qBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const opt = anim.options[idx];
        qBtns.forEach(b => b.disabled = true);
        if (opt.correct) {
          btn.classList.add('correct');
          if (explBox) {
            explBox.className = 'sim-explanation-box show';
            explBox.style.background = '#dcfce7';
            explBox.style.border = '1px solid #22c55e';
            explBox.style.color = '#14532d';
            explBox.innerHTML = `<strong>✅ სწორია!</strong> ${opt.explanation}`;
          }
          if (window.AudioSys) window.AudioSys.playSuccess();
        } else {
          btn.classList.add('wrong');
          const correctIdx = anim.options.findIndex(o => o.correct);
          if (qBtns[correctIdx]) qBtns[correctIdx].classList.add('correct');
          if (explBox) {
            explBox.className = 'sim-explanation-box show';
            explBox.style.background = '#fee2e2';
            explBox.style.border = '1px solid #ef4444';
            explBox.style.color = '#7f1d1d';
            explBox.innerHTML = `<strong>❌ არასწორია.</strong> ${opt.explanation}`;
          }
          if (window.AudioSys) window.AudioSys.playError();
        }
      });
    });
  },

  // Generates rich SVG illustrations for each animation and step
  getStageSvg(animId, stepIdx) {
    const w = 560;
    const h = 260;

    switch (animId) {
      case 'animation-scientific-method': {
        const steps = ['დაკვირვება', 'კითხვა', 'ჰიპოთეზა', 'ექსპერიმენტი', 'ანალიზი', 'დასკვნა'];
        const icons = ['🔍', '❓', '💡', '⚗️', '📊', '📜'];
        let items = '';
        for (let i = 0; i < 6; i++) {
          const x = 50 + i * 82;
          const isActive = i === stepIdx;
          const isPassed = i < stepIdx;
          const bg = isActive ? '#38bdf8' : (isPassed ? '#22c55e' : '#334155');
          items += `
            <g transform="translate(${x}, 100)">
              <circle cx="28" cy="28" r="26" fill="${bg}" stroke="#fff" stroke-width="${isActive ? '4' : '1'}"/>
              <text x="28" y="34" font-size="20" text-anchor="middle">${icons[i]}</text>
              <text x="28" y="70" font-size="10" font-weight="bold" fill="${isActive ? '#38bdf8' : '#cbd5e1'}" text-anchor="middle">${steps[i]}</text>
              ${i < 5 ? `<line x1="58" y1="28" x2="80" y2="28" stroke="${isPassed ? '#22c55e' : '#475569'}" stroke-width="3" stroke-dasharray="${isPassed ? 'none' : '4,2'}"/>` : ''}
            </g>
          `;
        }
        return `
          <svg viewBox="0 0 ${w} ${h}" class="anim-stage-svg" role="img" aria-label="სამეცნიერო კვლევის ეტაპი">
            <rect width="${w}" height="${h}" fill="#0f172a" rx="8"/>
            <text x="${w/2}" y="40" font-size="16" font-weight="bold" fill="#38bdf8" text-anchor="middle">ეტაპი ${stepIdx + 1}: ${steps[stepIdx]}</text>
            ${items}
          </svg>
        `;
      }

      case 'animation-characteristics-life': {
        const feats = ['უჯრედი', 'კვება', 'სუნთქვა', 'გამოყოფა', 'ზრდა', 'რეაქცია', 'გამრავლება'];
        const icons = ['🔬', '🍎', '🫁', '💧', '🌱', '⚡', '🐣'];
        let items = '';
        for (let i = 0; i < 7; i++) {
          const x = 40 + i * 72;
          const isActive = i === stepIdx;
          const bg = isActive ? '#10b981' : (i < stepIdx ? '#059669' : '#334155');
          items += `
            <g transform="translate(${x}, 95)">
              <rect x="0" y="0" width="56" height="70" rx="8" fill="${bg}" stroke="#fff" stroke-width="${isActive ? '3' : '1'}"/>
              <text x="28" y="32" font-size="22" text-anchor="middle">${icons[i]}</text>
              <text x="28" y="56" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">${feats[i]}</text>
            </g>
          `;
        }
        return `
          <svg viewBox="0 0 ${w} ${h}" class="anim-stage-svg" role="img" aria-label="სიცოცხლის თვისებები">
            <rect width="${w}" height="${h}" fill="#0f172a" rx="8"/>
            <text x="${w/2}" y="45" font-size="16" font-weight="bold" fill="#34d399" text-anchor="middle">${stepIdx + 1}. ${feats[stepIdx]}</text>
            ${items}
          </svg>
        `;
      }

      case 'animation-microscope-path': {
        // Ray path through microscope components
        const highlights = ['სარკე', 'კონდენსორი', 'ობიექტივი', 'ტუბუსი', 'ოკულარი'];
        return `
          <svg viewBox="0 0 ${w} ${h}" class="anim-stage-svg" role="img" aria-label="მიკროსკოპში სხივის სვლა">
            <rect width="${w}" height="${h}" fill="#0f172a" rx="8"/>
            <!-- Mirror -->
            <rect x="250" y="220" width="60" height="12" rx="3" fill="${stepIdx === 0 ? '#38bdf8' : '#64748b'}" transform="rotate(-15, 280, 226)"/>
            <!-- Condenser -->
            <rect x="260" y="175" width="40" height="15" rx="3" fill="${stepIdx === 1 ? '#38bdf8' : '#475569'}"/>
            <!-- Slide Specimen -->
            <line x1="240" y1="165" x2="320" y2="165" stroke="#22c55e" stroke-width="4"/>
            <!-- Objective Lens -->
            <rect x="265" y="130" width="30" height="22" rx="4" fill="${stepIdx === 2 ? '#38bdf8' : '#475569'}"/>
            <!-- Tube -->
            <rect x="270" y="65" width="20" height="65" fill="${stepIdx === 3 ? '#38bdf8' : '#334155'}"/>
            <!-- Eyepiece -->
            <rect x="260" y="45" width="40" height="20" rx="4" fill="${stepIdx === 4 ? '#38bdf8' : '#475569'}"/>
            <!-- Eye -->
            <text x="280" y="32" font-size="22" text-anchor="middle">👁️</text>
            <!-- Light beam -->
            <path d="M 280 220 L 280 ${220 - stepIdx * 38}" stroke="#fde047" stroke-width="5" stroke-linecap="round" opacity="0.9"/>
            <text x="120" y="130" font-size="14" font-weight="bold" fill="#38bdf8">ფოკუსირებული უბანი:</text>
            <text x="120" y="155" font-size="16" font-weight="bold" fill="#fff">${highlights[stepIdx]}</text>
          </svg>
        `;
      }

      case 'animation-hooke-cell': {
        return `
          <svg viewBox="0 0 ${w} ${h}" class="anim-stage-svg" role="img" aria-label="რობერტ ჰუკი">
            <rect width="${w}" height="${h}" fill="#0f172a" rx="8"/>
            <text x="${w/2}" y="35" font-size="15" font-weight="bold" fill="#38bdf8" text-anchor="middle">რობერტ ჰუკის აღმოჩენა (1665 წ.)</text>
            <!-- Cork Cells Grid -->
            <g transform="translate(180, 60)">
              ${Array.from({length: 16}).map((_, i) => {
                const row = Math.floor(i / 4);
                const col = i % 4;
                const stroke = stepIdx >= 2 ? '#22c55e' : '#64748b';
                return `<rect x="${col * 50}" y="${row * 40}" width="48" height="38" rx="4" fill="#1e293b" stroke="${stroke}" stroke-width="2"/>`;
              }).join('')}
            </g>
            <text x="${w/2}" y="240" font-size="13" fill="#cbd5e1" text-anchor="middle">
              ${stepIdx < 2 ? 'კორპის თხელი ანათალი მიკროსკოპში' : 'მკვდარი უჯრედების ცარიელი კედლები („სენაკები“)'}
            </text>
          </svg>
        `;
      }

      case 'animation-plant-cell-division': {
        const subTitles = ['დნმ-ის გაორმაგება', 'ბირთვის გაყოფა', 'ქრომოსომების დაცილება', 'ტიხრის წარმოქმნა', 'ორი შვილეული უჯრედი'];
        return `
          <svg viewBox="0 0 ${w} ${h}" class="anim-stage-svg" role="img" aria-label="უჯრედის გაყოფა">
            <rect width="${w}" height="${h}" fill="#0f172a" rx="8"/>
            <text x="${w/2}" y="35" font-size="15" font-weight="bold" fill="#4ade80" text-anchor="middle">${stepIdx + 1}. ${subTitles[stepIdx]}</text>
            <!-- Plant Cell Walls -->
            <rect x="140" y="60" width="280" height="150" rx="12" fill="#064e3b" stroke="#22c55e" stroke-width="8"/>
            ${stepIdx >= 3 ? `<line x1="280" y1="60" x2="280" y2="210" stroke="#86efac" stroke-width="8"/>` : ''}
            <!-- Nucleus / Chromosomes -->
            ${stepIdx === 0 ? `
              <circle cx="280" cy="135" r="35" fill="#6d28d9" stroke="#a78bfa" stroke-width="3"/>
              <text x="280" y="140" font-size="12" fill="#fff" font-weight="bold" text-anchor="middle">2x დნმ</text>
            ` : (stepIdx < 3 ? `
              <circle cx="230" cy="135" r="25" fill="#6d28d9"/>
              <circle cx="330" cy="135" r="25" fill="#6d28d9"/>
            ` : `
              <circle cx="210" cy="135" r="28" fill="#6d28d9" stroke="#a78bfa" stroke-width="2"/>
              <circle cx="350" cy="135" r="28" fill="#6d28d9" stroke="#a78bfa" stroke-width="2"/>
              <text x="210" y="140" font-size="11" fill="#fff" text-anchor="middle">ბირთვი 1</text>
              <text x="350" y="140" font-size="11" fill="#fff" text-anchor="middle">ბირთვი 2</text>
            `)}
          </svg>
        `;
      }

      case 'animation-linnaeus-hierarchy': {
        const ranks = ['სამეფო', 'ტიპი', 'კლასი', 'რიგი', 'ოჯახი', 'გვარი', 'სახეობა'];
        const examples = ['ცხოველები', 'ქორდიანები', 'ძუძუმწოვრები', 'მტაცებლები', 'ძაღლისებრნი', 'ძაღლი (Canis)', 'რუხი მგელი (Canis lupus)'];
        return `
          <svg viewBox="0 0 ${w} ${h}" class="anim-stage-svg" role="img" aria-label="სისტემატიკის იერარქია">
            <rect width="${w}" height="${h}" fill="#0f172a" rx="8"/>
            <g transform="translate(60, 40)">
              ${ranks.map((r, i) => {
                const y = i * 28;
                const isCur = i === stepIdx;
                const fill = isCur ? '#38bdf8' : (i < stepIdx ? '#22c55e' : '#475569');
                return `
                  <rect x="0" y="${y}" width="${300 - i * 22}" height="24" rx="4" fill="${fill}"/>
                  <text x="15" y="${y + 16}" font-size="12" font-weight="bold" fill="#fff">${r}: ${examples[i]}</text>
                `;
              }).join('')}
            </g>
            <text x="440" y="130" font-size="50" text-anchor="middle">🐺</text>
            <text x="440" y="170" font-size="12" font-weight="bold" fill="#38bdf8" text-anchor="middle">Canis lupus</text>
          </svg>
        `;
      }

      case 'animation-bacteria-fission': {
        return `
          <svg viewBox="0 0 ${w} ${h}" class="anim-stage-svg" role="img" aria-label="ბაქტერიის გაყოფა">
            <rect width="${w}" height="${h}" fill="#0f172a" rx="8"/>
            <text x="${w/2}" y="35" font-size="15" font-weight="bold" fill="#38bdf8" text-anchor="middle">ბაქტერიის გაყოფა (20 წუთში ერთხელ)</text>
            ${stepIdx === 0 ? `
              <rect x="220" y="90" width="120" height="70" rx="35" fill="#0284c7" stroke="#38bdf8" stroke-width="4"/>
              <circle cx="280" cy="125" r="14" fill="#fde047"/>
            ` : (stepIdx === 1 ? `
              <rect x="180" y="90" width="200" height="70" rx="35" fill="#0284c7" stroke="#38bdf8" stroke-width="4"/>
              <circle cx="230" cy="125" r="14" fill="#fde047"/>
              <circle cx="330" cy="125" r="14" fill="#fde047"/>
            ` : (stepIdx === 2 ? `
              <path d="M 180 125 C 180 90, 260 90, 275 110 C 290 90, 380 90, 380 125 C 380 160, 290 160, 275 140 C 260 160, 180 160, 180 125 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="4"/>
              <circle cx="225" cy="125" r="14" fill="#fde047"/>
              <circle cx="335" cy="125" r="14" fill="#fde047"/>
            ` : `
              <rect x="140" y="90" width="120" height="70" rx="35" fill="#0284c7" stroke="#22c55e" stroke-width="4"/>
              <circle cx="200" cy="125" r="14" fill="#fde047"/>
              <rect x="300" y="90" width="120" height="70" rx="35" fill="#0284c7" stroke="#22c55e" stroke-width="4"/>
              <circle cx="360" cy="125" r="14" fill="#fde047"/>
            `))}
          </svg>
        `;
      }

      case 'animation-bacterial-spore': {
        return `
          <svg viewBox="0 0 ${w} ${h}" class="anim-stage-svg" role="img" aria-label="ბაქტერიის სპორა">
            <rect width="${w}" height="${h}" fill="#0f172a" rx="8"/>
            <text x="${w/2}" y="35" font-size="15" font-weight="bold" fill="#f59e0b" text-anchor="middle">სპორის წარმოქმნა (გადარჩენის მექანიზმი)</text>
            <g transform="translate(${w/2}, 130)">
              <rect x="-80" y="-40" width="160" height="80" rx="40" fill="#0369a1" stroke="#38bdf8" stroke-width="3"/>
              ${stepIdx >= 2 ? `
                <circle cx="0" cy="0" r="30" fill="#78350f" stroke="#f59e0b" stroke-width="6"/>
                <circle cx="0" cy="0" r="12" fill="#fde047"/>
                <text x="0" y="4" font-size="9" font-weight="bold" fill="#fff" text-anchor="middle">დნმ</text>
              ` : `
                <circle cx="0" cy="0" r="15" fill="#fde047"/>
              `}
            </g>
            <text x="${w/2}" y="225" font-size="13" fill="#f8fafc" text-anchor="middle">
              ${stepIdx >= 2 ? 'მრავალშრიანი სქელი დამცავი გარსი (სპორა)' : 'აქტიური მგრძნობიარე ბაქტერია'}
            </text>
          </svg>
        `;
      }

      case 'animation-paramecium-cilia': {
        return `
          <svg viewBox="0 0 ${w} ${h}" class="anim-stage-svg" role="img" aria-label="ქალამანას აგებულება">
            <rect width="${w}" height="${h}" fill="#0f172a" rx="8"/>
            <g transform="translate(${w/2}, 125)">
              <!-- Slipper Body -->
              <ellipse cx="0" cy="0" rx="140" ry="50" fill="#047857" stroke="#34d399" stroke-width="3"/>
              <!-- Cilia around border -->
              ${Array.from({length: 36}).map((_, i) => {
                const ang = (i / 36) * Math.PI * 2;
                const x1 = Math.cos(ang) * 140;
                const y1 = Math.sin(ang) * 50;
                const x2 = Math.cos(ang) * 152;
                const y2 = Math.sin(ang) * 60;
                return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#a7f3d0" stroke-width="2"/>`;
              }).join('')}
              <!-- Oral Groove -->
              <ellipse cx="10" cy="-15" rx="30" ry="12" fill="#064e3b" stroke="#6ee7b7" stroke-width="2"/>
              <!-- Food Vacuoles -->
              <circle cx="-50" cy="10" r="10" fill="#f43f5e"/>
              <circle cx="60" cy="15" r="9" fill="#f43f5e"/>
              <!-- Contractile Vacuole Stars -->
              <circle cx="-90" cy="-10" r="12" fill="#38bdf8"/>
              <circle cx="90" cy="-10" r="12" fill="#38bdf8"/>
            </g>
            <text x="${w/2}" y="235" font-size="12" fill="#cbd5e1" text-anchor="middle">წამწამები (გადაადგილება) • პირის ღარი • მფეთქავი ვაკუოლები</text>
          </svg>
        `;
      }

      case 'animation-virus-infection': {
        const vSteps = ['1. მიმაგრება რეცეპტორზე', '2. დნმ-ის ინიექცია', '3. ვირუსების გამრავლება', '4. თვითაწყობა', '5. უჯრედის ლიზისი (გასკდომა)'];
        return `
          <svg viewBox="0 0 ${w} ${h}" class="anim-stage-svg" role="img" aria-label="ვირუსის შეჭრა">
            <rect width="${w}" height="${h}" fill="#0f172a" rx="8"/>
            <text x="${w/2}" y="35" font-size="15" font-weight="bold" fill="#f43f5e" text-anchor="middle">${vSteps[stepIdx]}</text>
            <!-- Bacterial Wall -->
            <rect x="60" y="160" width="440" height="80" rx="8" fill="#1e293b" stroke="${stepIdx === 4 ? '#ef4444' : '#64748b'}" stroke-width="4" stroke-dasharray="${stepIdx === 4 ? '12,6' : 'none'}"/>
            <!-- Bacteriophage on top -->
            <g transform="translate(${w/2}, ${stepIdx >= 1 ? 140 : 110})">
              <polygon points="0,-45 20,-20 -20,-20" fill="#8b5cf6" stroke="#c4b5fd" stroke-width="2"/>
              <rect x="-4" y="-20" width="8" height="20" fill="#7c3aed"/>
              <line x1="-4" y1="0" x2="-18" y2="20" stroke="#a78bfa" stroke-width="2"/>
              <line x1="4" y1="0" x2="18" y2="20" stroke="#a78bfa" stroke-width="2"/>
              ${stepIdx >= 1 ? `<line x1="0" y1="0" x2="0" y2="50" stroke="#f43f5e" stroke-width="4"/>` : ''}
            </g>
            ${stepIdx >= 2 && stepIdx < 4 ? `
              <circle cx="200" cy="200" r="10" fill="#8b5cf6"/>
              <circle cx="360" cy="200" r="10" fill="#8b5cf6"/>
            ` : ''}
          </svg>
        `;
      }

      case 'animation-yeast-budding': {
        const budSize = (stepIdx + 1) * 8;
        return `
          <svg viewBox="0 0 ${w} ${h}" class="anim-stage-svg" role="img" aria-label="საფუარას დაკვირტვა">
            <rect width="${w}" height="${h}" fill="#0f172a" rx="8"/>
            <text x="${w/2}" y="35" font-size="15" font-weight="bold" fill="#eab308" text-anchor="middle">საფუარა სოკოს დაკვირტვა (ეტაპი ${stepIdx + 1})</text>
            <!-- Mother Cell -->
            <ellipse cx="250" cy="140" rx="60" ry="45" fill="#ca8a04" stroke="#fef08a" stroke-width="3"/>
            <circle cx="250" cy="140" r="16" fill="#713f12"/>
            <!-- Growing Bud -->
            <ellipse cx="${310 + budSize/2}" cy="120" rx="${budSize}" ry="${budSize * 0.8}" fill="#eab308" stroke="#fef08a" stroke-width="2"/>
            ${stepIdx >= 1 ? `<circle cx="${310 + budSize/2}" cy="120" r="${budSize * 0.35}" fill="#713f12"/>` : ''}
          </svg>
        `;
      }

      case 'animation-mucor-lifecycle': {
        return `
          <svg viewBox="0 0 ${w} ${h}" class="anim-stage-svg" role="img" aria-label="მუკორის სპორები">
            <rect width="${w}" height="${h}" fill="#0f172a" rx="8"/>
            <text x="${w/2}" y="35" font-size="15" font-weight="bold" fill="#38bdf8" text-anchor="middle">მუკორის სპორანგიუმი და სპორები</text>
            <!-- Hypha stem -->
            <line x1="${w/2}" y1="220" x2="${w/2}" y2="100" stroke="#cbd5e1" stroke-width="6"/>
            <!-- Sporangium head -->
            <circle cx="${w/2}" cy="90" r="30" fill="${stepIdx >= 2 ? '#1e293b' : '#020617'}" stroke="#94a3b8" stroke-width="3"/>
            <!-- Burst Spores cloud -->
            ${stepIdx >= 2 ? Array.from({length: 24}).map((_, i) => {
              const ang = (i / 24) * Math.PI * 2;
              const dist = 45 + (i % 3) * 18;
              const sx = w/2 + Math.cos(ang) * dist;
              const sy = 90 + Math.sin(ang) * dist;
              return `<circle cx="${sx}" cy="${sy}" r="3" fill="#f8fafc"/>`;
            }).join('') : ''}
          </svg>
        `;
      }

      case 'animation-mushroom-spores': {
        return `
          <svg viewBox="0 0 ${w} ${h}" class="anim-stage-svg" role="img" aria-label="ქუდიანი სოკო">
            <rect width="${w}" height="${h}" fill="#0f172a" rx="8"/>
            <text x="${w/2}" y="35" font-size="15" font-weight="bold" fill="#f59e0b" text-anchor="middle">ნაყოფსხეული და სპორების გამოფრქვევა</text>
            <!-- Mycelium below ground -->
            <line x1="60" y1="210" x2="500" y2="210" stroke="#78350f" stroke-width="4"/>
            <!-- Stipe (Stem) -->
            <path d="M 260 210 L 265 120 L 295 120 L 300 210 Z" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
            <!-- Cap (Pileus) -->
            <path d="M 210 120 C 210 50, 350 50, 350 120 Z" fill="#b91c1c" stroke="#f87171" stroke-width="2"/>
            <!-- Gills under cap -->
            ${Array.from({length: 12}).map((_, i) => {
              const gx = 225 + i * 9;
              return `<line x1="${gx}" y1="120" x2="${gx}" y2="128" stroke="#fef3c7" stroke-width="2"/>`;
            }).join('')}
            <!-- Falling spores -->
            ${stepIdx >= 3 ? Array.from({length: 20}).map((_, i) => {
              const sx = 220 + (i * 7);
              const sy = 135 + (i % 4) * 15;
              return `<circle cx="${sx}" cy="${sy}" r="2" fill="#fed7aa"/>`;
            }).join('') : ''}
          </svg>
        `;
      }

      default:
        return `<svg viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#1e293b"/></svg>`;
    }
  }
};
