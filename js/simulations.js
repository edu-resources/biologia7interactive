// ქიმია VII კლასი — ვირტუალური სიმულაციების ინტერაქტიული ძრავი
// მოიცავს 13 სრულყოფილ სიმულაციას 10-საფეხურიანი კვლევითი ციკლით, Canvas/SVG ანიმაციებითა და რეალური ფიზიკით

const Simulations = {
  activeSimId: null,
  animId: null,
  state: {},

  // სიმულაციების გადახედვის SVG ილუსტრაციები
  getSimSvgPreview(id) {
    switch (id) {
      case "exp-particles":
        return `<svg viewBox="0 0 200 120" width="100%" height="100%">
          <rect width="200" height="120" fill="#f0f9ff"/>
          <rect x="50" y="20" width="100" height="75" rx="6" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
          <circle cx="70" cy="40" r="5" fill="#0284c7"/><circle cx="90" cy="50" r="5" fill="#0284c7"/>
          <circle cx="110" cy="35" r="5" fill="#0284c7"/><circle cx="130" cy="60" r="5" fill="#0284c7"/>
          <circle cx="80" cy="70" r="5" fill="#0284c7"/><circle cx="120" cy="75" r="5" fill="#0284c7"/>
          <path d="M85 105 Q100 90 115 105" stroke="#f59e0b" stroke-width="3" fill="none"/>
          <path d="M92 108 Q100 98 108 108" stroke="#ef4444" stroke-width="2" fill="none"/>
          <rect x="25" y="30" width="8" height="55" rx="4" fill="#cbd5e1"/>
          <rect x="27" y="60" width="4" height="25" rx="2" fill="#ef4444"/>
        </svg>`;
      case "exp-diffusion":
        return `<svg viewBox="0 0 200 120" width="100%" height="100%">
          <rect width="200" height="120" fill="#faf5ff"/>
          <path d="M70 25 L70 90 Q70 100 80 100 L120 100 Q130 100 130 90 L130 25" fill="#ffffff" stroke="#9333ea" stroke-width="2"/>
          <path d="M72 50 L72 90 Q72 98 80 98 L120 98 Q128 98 128 90 L128 50 Z" fill="#f3e8ff"/>
          <circle cx="100" cy="65" r="14" fill="#a855f7" opacity="0.8"/>
          <circle cx="90" cy="75" r="8" fill="#c084fc" opacity="0.6"/>
          <circle cx="112" cy="78" r="9" fill="#c084fc" opacity="0.6"/>
          <circle cx="100" cy="52" r="6" fill="#7e22ce"/>
        </svg>`;
      case "exp-combustion":
        return `<svg viewBox="0 0 200 120" width="100%" height="100%">
          <rect width="200" height="120" fill="#fffbeb"/>
          <path d="M60 100 L60 45 Q60 20 100 20 Q140 20 140 45 L140 100 Z" fill="#ffffff" opacity="0.7" stroke="#f59e0b" stroke-width="2"/>
          <rect x="92" y="65" width="16" height="35" rx="2" fill="#e2e8f0" stroke="#94a3b8"/>
          <line x1="100" y1="65" x2="100" y2="55" stroke="#334155" stroke-width="2"/>
          <path d="M100 55 Q106 45 100 35 Q94 45 100 55" fill="#f59e0b"/>
          <circle cx="100" cy="46" r="3" fill="#ef4444"/>
        </svg>`;
      case "exp-distillation":
        return `<svg viewBox="0 0 200 120" width="100%" height="100%">
          <rect width="200" height="120" fill="#f0fdfa"/>
          <circle cx="65" cy="75" r="22" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/>
          <rect x="62" y="35" width="6" height="20" fill="#ffffff" stroke="#0d9488" stroke-width="2"/>
          <line x1="68" y1="42" x2="140" y2="70" stroke="#0d9488" stroke-width="3"/>
          <rect x="90" y="47" width="40" height="14" rx="3" transform="rotate(22 90 47)" fill="#99f6e4" opacity="0.5" stroke="#0d9488"/>
          <path d="M140 80 L135 100 L160 100 L155 80 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>
        </svg>`;
      case "exp-filtration":
        return `<svg viewBox="0 0 200 120" width="100%" height="100%">
          <rect width="200" height="120" fill="#f8fafc"/>
          <polygon points="75,25 125,25 103,60 103,75 97,75 97,60" fill="#ffffff" stroke="#64748b" stroke-width="2"/>
          <polygon points="80,28 120,28 100,56" fill="#fef3c7"/>
          <path d="M85 80 L80 105 L120 105 L115 80 Z" fill="#ffffff" stroke="#64748b" stroke-width="2"/>
          <circle cx="100" cy="70" r="2" fill="#0284c7"/>
          <circle cx="100" cy="85" r="2" fill="#0284c7"/>
          <path d="M83 95 L117 95 L119 104 L81 104 Z" fill="#e0f2fe"/>
        </svg>`;
      case "exp-magnet":
        return `<svg viewBox="0 0 200 120" width="100%" height="100%">
          <rect width="200" height="120" fill="#fef2f2"/>
          <path d="M75 95 Q100 105 125 95" stroke="#94a3b8" stroke-width="2" fill="none"/>
          <ellipse cx="100" cy="95" rx="20" ry="4" fill="#fef08a"/>
          <path d="M85 30 L85 60 A15 15 0 0 0 115 60 L115 30" fill="none" stroke="#dc2626" stroke-width="10"/>
          <rect x="80" y="25" width="10" height="12" fill="#3b82f6"/>
          <rect x="110" y="25" width="10" height="12" fill="#dc2626"/>
          <circle cx="85" cy="70" r="1.5" fill="#334155"/><circle cx="115" cy="70" r="1.5" fill="#334155"/>
          <circle cx="95" cy="85" r="1.5" fill="#334155"/><circle cx="105" cy="88" r="1.5" fill="#334155"/>
        </svg>`;
      case "exp-solubility":
        return `<svg viewBox="0 0 200 120" width="100%" height="100%">
          <rect width="200" height="120" fill="#f0fdf4"/>
          <rect x="40" y="30" width="55" height="65" rx="4" fill="#ffffff" stroke="#16a34a" stroke-width="2"/>
          <rect x="42" y="55" width="51" height="38" fill="#dcfce7"/>
          <line x1="120" y1="95" x2="175" y2="95" stroke="#64748b" stroke-width="1.5"/>
          <line x1="120" y1="95" x2="120" y2="35" stroke="#64748b" stroke-width="1.5"/>
          <path d="M123 90 Q145 80 170 40" fill="none" stroke="#16a34a" stroke-width="2.5"/>
          <circle cx="170" cy="40" r="3" fill="#16a34a"/>
        </svg>`;
      case "exp-reaction-signs":
        return `<svg viewBox="0 0 200 120" width="100%" height="100%">
          <rect width="200" height="120" fill="#fdf4ff"/>
          <rect x="65" y="25" width="18" height="65" rx="9" fill="#ffffff" stroke="#c026d3" stroke-width="2"/>
          <path d="M66 55 L66 81 A8 8 0 0 0 82 81 L82 55 Z" fill="#fae8ff"/>
          <circle cx="74" cy="65" r="2" fill="#c026d3"/><circle cx="72" cy="72" r="3" fill="#c026d3"/>
          <circle cx="77" cy="58" r="1.5" fill="#c026d3"/>
          <rect x="115" y="25" width="18" height="65" rx="9" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
          <path d="M116 55 L116 81 A8 8 0 0 0 132 81 L132 55 Z" fill="#e0f2fe"/>
          <rect x="118" y="78" width="12" height="6" fill="#f59e0b"/>
        </svg>`;
      case "exp-conservation-mass":
        return `<svg viewBox="0 0 200 120" width="100%" height="100%">
          <rect width="200" height="120" fill="#f8fafc"/>
          <rect x="60" y="90" width="80" height="15" rx="3" fill="#e2e8f0" stroke="#475569"/>
          <line x1="100" y1="90" x2="100" y2="45" stroke="#475569" stroke-width="3"/>
          <line x1="65" y1="45" x2="135" y2="45" stroke="#475569" stroke-width="3"/>
          <path d="M72 55 L65 80 L85 80 Z" fill="#bfdbfe" stroke="#2563eb"/>
          <path d="M128 55 L121 80 L141 80 Z" fill="#bfdbfe" stroke="#2563eb"/>
          <text x="100" y="102" font-size="8" font-family="monospace" text-anchor="middle" fill="#0f172a" font-weight="bold">150.00g</text>
        </svg>`;
      case "exp-density":
        return `<svg viewBox="0 0 200 120" width="100%" height="100%">
          <rect width="200" height="120" fill="#ecfeff"/>
          <rect x="85" y="15" width="30" height="85" rx="2" fill="#ffffff" stroke="#0891b2" stroke-width="2"/>
          <rect x="87" y="72" width="26" height="26" fill="#fde047" opacity="0.8"/>
          <rect x="87" y="46" width="26" height="26" fill="#67e8f9" opacity="0.7"/>
          <rect x="87" y="25" width="26" height="21" fill="#fed7aa" opacity="0.7"/>
          <circle cx="100" cy="35" r="4" fill="#a16207"/>
          <circle cx="100" cy="58" r="4.5" fill="#15803d"/>
          <rect x="96" y="85" width="8" height="6" fill="#334155"/>
        </svg>`;
      case "exp-chromatography":
        return `<svg viewBox="0 0 200 120" width="100%" height="100%">
          <rect width="200" height="120" fill="#fdf4ff"/>
          <rect x="75" y="15" width="50" height="85" rx="4" fill="#ffffff" stroke="#8b5cf6" stroke-width="2"/>
          <rect x="90" y="20" width="20" height="70" fill="#f8fafc" stroke="#cbd5e1"/>
          <line x1="90" y1="78" x2="110" y2="78" stroke="#94a3b8" stroke-dasharray="2,2"/>
          <circle cx="100" cy="35" r="3" fill="#3b82f6"/>
          <circle cx="100" cy="50" r="3" fill="#eab308"/>
          <circle cx="100" cy="65" r="3" fill="#ec4899"/>
        </svg>`;
      case "exp-crystallization":
        return `<svg viewBox="0 0 200 120" width="100%" height="100%">
          <rect width="200" height="120" fill="#eff6ff"/>
          <ellipse cx="100" cy="85" rx="45" ry="15" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2"/>
          <polygon points="90,75 100,65 110,75 100,85" fill="#2563eb" stroke="#1e40af"/>
          <polygon points="75,80 82,72 90,80 82,88" fill="#3b82f6" stroke="#1d4ed8"/>
          <polygon points="110,80 118,74 125,80 118,87" fill="#60a5fa" stroke="#2563eb"/>
          <polygon points="95,62 100,55 105,62 100,68" fill="#93c5fd"/>
        </svg>`;
      case "exp-safety-lab":
        return `<svg viewBox="0 0 200 120" width="100%" height="100%">
          <rect width="200" height="120" fill="#fef2f2"/>
          <path d="M100 20 L135 32 L135 68 Q100 100 100 100 Q65 68 65 32 Z" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
          <rect x="80" y="42" width="16" height="12" rx="4" fill="#ffffff" stroke="#dc2626" stroke-width="1.5"/>
          <rect x="104" y="42" width="16" height="12" rx="4" fill="#ffffff" stroke="#dc2626" stroke-width="1.5"/>
          <line x1="96" y1="48" x2="104" y2="48" stroke="#dc2626" stroke-width="2"/>
          <path d="M100 64 L100 74" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="100" cy="79" r="1.5" fill="#dc2626"/>
        </svg>`;
      default:
        return `<svg viewBox="0 0 200 120" width="100%" height="100%">
          <rect width="200" height="120" fill="#f8fafc"/>
          <circle cx="100" cy="60" r="30" fill="#e2e8f0"/>
          <text x="100" y="66" text-anchor="middle" font-size="20">🔬</text>
        </svg>`;
    }
  },

  // სიმულაციების კატალოგის ჩვენება
  renderList(c) {
    const list = window.SIMULATION_METADATA || [];
    const completedList = AppState.data.completedSimulations || [];

    const difficulties = {
      "exp-particles": "სირთულე: ★★☆",
      "exp-diffusion": "სირთულე: ★☆☆",
      "exp-combustion": "სირთულე: ★★☆",
      "exp-distillation": "სირთულე: ★★★",
      "exp-filtration": "სირთულე: ★☆☆",
      "exp-magnet": "სირთულე: ★☆☆",
      "exp-solubility": "სირთულე: ★★☆",
      "exp-reaction-signs": "სირთულე: ★★☆",
      "exp-conservation-mass": "სირთულე: ★★☆",
      "exp-density": "სირთულე: ★☆☆",
      "exp-chromatography": "სირთულე: ★★☆",
      "exp-crystallization": "სირთულე: ★★☆",
      "exp-safety-lab": "სირთულე: ★☆☆"
    };

    c.innerHTML = `
      <div class="sim-catalog-header">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
          <div>
            <h1 style="font-size:2rem; font-weight:900; color:var(--text-main); margin-bottom:0.4rem;">
              🧪 ვირტუალური ქიმიური ლაბორატორია
            </h1>
            <p style="color:var(--text-muted); font-size:1rem; max-width:800px; line-height:1.5;">
              13 ინტერაქტიული კვლევითი სიმულაცია 10-საფეხურიანი სამეცნიერო ციკლით: დასვი ჰიპოთეზა, მართე პარამეტრები, შეაგროვე მონაცემები და გამოიტანე დასკვნა!
            </p>
          </div>
          <div style="background:var(--bg-card); padding:0.6rem 1.2rem; border-radius:var(--radius-md); border:1px solid var(--border-card); font-weight:700; color:var(--primary);">
            დასრულებულია: ${completedList.length} / ${list.length} (⭐ ${completedList.length * 100})
          </div>
        </div>
      </div>

      <div class="sim-catalog-grid">
        ${list.map(sim => {
          const isDone = completedList.includes(sim.id);
          const diff = difficulties[sim.id] || "სირთულე: ★★☆";
          const paramChips = (sim.parameters || []).slice(0, 3).map(p => p.name).join(" • ");

          return `
            <div class="sim-card-rich" style="${isDone ? 'border-color:#86efac;' : ''}">
              <div class="sim-card-top-row">
                <span class="badge-tag">${sim.badge}</span>
                <span class="page-badge">${sim.page}</span>
              </div>

              <div class="sim-card-preview">
                ${this.getSimSvgPreview(sim.id)}
              </div>

              <h3 class="sim-card-title">${sim.num}: ${sim.title}</h3>
              <p class="sim-card-objective">${sim.objective}</p>

              <div class="sim-meta-tags-row">
                <span class="sim-meta-tag difficulty">${diff}</span>
                <span class="sim-meta-tag duration">⏱️ 10–15 წთ</span>
                <span class="sim-meta-tag" style="background:#f0fdfa; color:#0f766e;">🔬 10 ეტაპი</span>
                ${paramChips ? `<span class="sim-meta-tag" style="background:#f8fafc; color:#475569;" title="პარამეტრები">⚙️ ${paramChips}</span>` : ''}
              </div>

              <div class="sim-card-footer">
                <a href="#${sim.id}" class="btn ${isDone ? 'btn-secondary' : 'btn-primary'} btn-sm">
                  ${isDone ? '🔄 ხელახლა ჩატარება' : '🔬 ექსპერიმენტის დაწყება ▶️'}
                </a>
                ${isDone 
                  ? '<span style="color:#16a34a; font-weight:800; font-size:0.875rem;">✅ შესრულებულია (+100⭐)</span>' 
                  : '<span style="color:var(--text-muted); font-size:0.8125rem;">+100 ⭐ დასრულებისას</span>'}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  },

  // კონკრეტული სიმულაციის სამუშაო სივრცის რენდერი
  renderDetail(c, simId) {
    const sim = (window.SIMULATION_METADATA || []).find(s => s.id === simId || s.alias === simId);
    if (!sim) {
      c.innerHTML = `<p>სიმულაცია ვერ მოიძებნა. <a href="#experiments">სიაში დაბრუნება</a></p>`;
      return;
    }

    this.stopAnimation();
    this.activeSimId = sim.id;

    // საწყისი მდგომარეობის მომზადება
    this.state = {
      simId: sim.id,
      step: 1,
      running: false,
      speed: 1,
      time: 0,
      hypothesis: null,
      conclusion: null,
      params: {},
      measurements: []
    };

    sim.parameters.forEach(p => {
      this.state.params[p.id] = p.default;
    });

    c.innerHTML = `
      <div class="sim-container">
        <!-- სიმულაციის სათაური -->
        <div class="sim-header">
          <div class="sim-title-box">
            <div class="sim-meta-tags">
              <span class="sim-tag">${sim.num}</span>
              <span class="sim-tag">${sim.page}</span>
              <span class="sim-tag" style="background:#0284c7;">🔬 ვირტუალური ლაბორატორია</span>
            </div>
            <h1>${sim.title}</h1>
          </div>
          <div>
            <a href="#experiments" class="btn btn-secondary btn-sm">← სიმულაციების სია</a>
          </div>
        </div>

        <!-- 10-საფეხურიანი კვლევითი ციკლის ზოლი -->
        <div class="inquiry-steps-bar">
          <div class="step-chip active" id="chip-step-1">1. მიზანი და კითხვა</div>
          <div class="step-chip" id="chip-step-2">2. ჩემი ვარაუდი</div>
          <div class="step-chip" id="chip-step-3">3. პარამეტრები</div>
          <div class="step-chip" id="chip-step-4">4. ექსპერიმენტი</div>
          <div class="step-chip" id="chip-step-5">5. დაკვირვება</div>
          <div class="step-chip" id="chip-step-6">6. გაზომვები</div>
          <div class="step-chip" id="chip-step-7">7. შედეგი</div>
          <div class="step-chip" id="chip-step-8">8. შედარება</div>
          <div class="step-chip" id="chip-step-9">9. დასკვნა</div>
          <div class="step-chip" id="chip-step-10">10. უკუკავშირი</div>
        </div>

        <div class="sim-body">
          <!-- 1. რას ვიკვლევ? & ჩემი ვარაუდი (ჰიპოთეზა) -->
          <div class="inquiry-box">
            <h3><span>❓</span> <span>საკვლევი კითხვა და ჩემი ვარაუდი</span></h3>
            <div class="inquiry-q">${sim.researchQuestion}</div>
            <p style="font-size:0.875rem; color:var(--text-muted); margin-bottom:0.75rem;">
              ცდის დაწყებამდე აირჩიე შენი ვარაუდი (ჰიპოთეზა):
            </p>
            <div class="hypothesis-options">
              ${sim.hypotheses.map(h => `
                <button class="hypo-btn" onclick="Simulations.selectHypothesis('${h.id}')" id="hypo-btn-${h.id}">
                  ${h.text}
                </button>
              `).join("")}
            </div>
          </div>

          <!-- 2. ინტერაქტიული სამუშაო სივრცე (Viewport + Controls) -->
          <div class="stage-workspace">
            <div class="stage-viewport" id="viewport-box">
              <canvas id="sim-canvas" width="600" height="380" class="stage-canvas"></canvas>
              <div class="stage-overlay-stats" id="sim-live-stats">
                ტემპერატურა: 25 °C | დრო: 0.0 წმ
              </div>
              <div class="stage-overlay-hud" id="sim-hud-status">
                ⏸️ მზადყოფნაში
              </div>
            </div>

            <!-- მართვის პანელი (Control Panel) -->
            <div class="sim-controls-panel">
              <div class="panel-title">
                <span>⚙️</span> <span>პარამეტრების მართვა</span>
              </div>

              ${sim.parameters.map(p => this.renderParamControlHtml(p)).join("")}

              <!-- დაწყება, შეჩერება, თავიდან დაწყება და სიჩქარე -->
              <div class="control-group" style="margin-top:0.5rem;">
                <label class="control-label">ექსპერიმენტის მართვა</label>
                <div class="btn-row">
                  <button class="btn btn-accent btn-sm" onclick="Simulations.start()" id="btn-sim-start">▶️ დაწყება</button>
                  <button class="btn btn-secondary btn-sm" style="color:var(--text-main);" onclick="Simulations.pause()" id="btn-sim-pause">⏸️ პაუზა</button>
                  <button class="btn btn-secondary btn-sm" style="color:var(--text-main);" onclick="Simulations.reset()" id="btn-sim-reset">🔄 განულება</button>
                </div>
              </div>

              <div class="control-group">
                <label class="control-label">
                  <span>პროცესის სიჩქარე</span>
                  <span class="control-value" id="speed-val-display">1.0x</span>
                </label>
                <div class="btn-row">
                  <button class="btn-toggle active" onclick="Simulations.setSpeed(0.5, this)">0.5x</button>
                  <button class="btn-toggle active" onclick="Simulations.setSpeed(1, this)">1x</button>
                  <button class="btn-toggle" onclick="Simulations.setSpeed(2, this)">2x</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. გაზომვებისა და დაკვირვების ცხრილი (Data & Measurements) -->
          <div class="data-table-box">
            <h4><span>📊</span> <span>დაკვირვების მონაცემები რეალურ დროში</span></h4>
            <div style="overflow-x:auto;">
              <table class="obs-table" id="sim-measurements-table">
                <thead>
                  <tr id="obs-table-headers">
                    <th>დრო (წმ)</th>
                    <th>მდგომარეობა / პარამეტრი</th>
                    <th>გაზომილი მნიშვნელობა</th>
                    <th>დაკვირვების შედეგი</th>
                  </tr>
                </thead>
                <tbody id="obs-table-body">
                  <tr>
                    <td colspan="4" style="text-align:center; color:var(--text-light);">დააჭირე „▶️ დაწყებას“ მონაცემების დასაფიქსირებლად</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 4. დასკვნის კითხვა და შედარება ვარაუდთან -->
          <div class="conclusion-box" id="conclusion-section">
            <h3><span>💡</span> <span>დასკვნა და ვარაუდის შემოწმება</span></h3>
            <p style="margin-bottom:1rem; font-weight:700; color:var(--text-main);">
              ${sim.conclusionQuestion}
            </p>
            <div class="conclusion-options">
              ${sim.conclusionOptions.map((opt, idx) => `
                <button class="concl-btn" onclick="Simulations.selectConclusion('${opt.id}', ${opt.correct})" id="concl-btn-${opt.id}">
                  ${opt.text}
                </button>
              `).join("")}
            </div>

            <div class="feedback-banner" id="sim-feedback-banner">
            </div>
          </div>

          <!-- სახელმძღვანელოს დამატებითი ინფორმაცია -->
          <div class="content-block" style="margin-top:1.5rem;">
            <h3>🎯 ექსპერიმენტის მიზანი და უსაფრთხოება</h3>
            <div class="concept-box">
              <div class="concept-title">მიზანი</div>
              <div class="concept-desc">${sim.objective}</div>
            </div>
            <div class="concept-box" style="border-left-color:var(--danger); background:var(--danger-light);">
              <div class="concept-title" style="color:var(--danger-text);">🛡️ უსაფრთხოების წესი</div>
              <div class="concept-desc" style="color:#7f1d1d;">${sim.safety}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Canvas ინიციალიზაცია და საწყისი კადრის დახატვა
    this.initCanvas(sim.id);
  },

  // პარამეტრის კონტროლის HTML გენერირება
  renderParamControlHtml(p) {
    if (p.type === "slider") {
      return `
        <div class="control-group">
          <label class="control-label">
            <span>${p.name}</span>
            <span class="control-value" id="val-${p.id}">${p.default} ${p.unit || ''}</span>
          </label>
          <input type="range" class="control-slider" min="${p.min}" max="${p.max}" value="${p.default}" 
                 id="ctrl-${p.id}" oninput="Simulations.onParamChange('${p.id}', this.value, '${p.unit || ''}')">
        </div>
      `;
    } else if (p.type === "select") {
      return `
        <div class="control-group">
          <label class="control-label">${p.name}</label>
          <select class="control-select" id="ctrl-${p.id}" onchange="Simulations.onParamChange('${p.id}', this.value)">
            ${p.options.map(opt => `<option value="${opt}" ${opt === p.default ? 'selected' : ''}>${opt}</option>`).join("")}
          </select>
        </div>
      `;
    } else if (p.type === "toggle") {
      return `
        <div class="control-group">
          <label class="control-label">${p.name}</label>
          <div class="btn-row">
            ${p.options.map(opt => `
              <button class="btn-toggle ${opt === p.default ? 'active' : ''}" 
                      onclick="Simulations.onToggleChange('${p.id}', '${opt}', this)">
                ${opt}
              </button>
            `).join("")}
          </div>
        </div>
      `;
    }
    return '';
  },

  // ვარაუდის (ჰიპოთეზის) არჩევა
  selectHypothesis(hypoId) {
    this.state.hypothesis = hypoId;
    document.querySelectorAll(".hypo-btn").forEach(btn => btn.classList.remove("selected"));
    const selectedBtn = document.getElementById(`hypo-btn-${hypoId}`);
    if (selectedBtn) selectedBtn.classList.add("selected");
    this.updateStepChip(2);
    showToast("ვარაუდი დაფიქსირდა! ახლა დააყენე პარამეტრები და დაიწყე ცდა.");
  },

  // პარამეტრის შეცვლა
  onParamChange(paramId, value, unit) {
    this.state.params[paramId] = isNaN(value) ? value : parseFloat(value);
    const disp = document.getElementById(`val-${paramId}`);
    if (disp) disp.textContent = `${value} ${unit || ''}`;
    this.updateStepChip(3);
    this.renderCurrentFrame();
  },

  onToggleChange(paramId, value, btnEl) {
    this.state.params[paramId] = value;
    if (btnEl && btnEl.parentElement) {
      btnEl.parentElement.querySelectorAll(".btn-toggle").forEach(b => b.classList.remove("active"));
      btnEl.classList.add("active");
    }
    this.updateStepChip(3);
    this.renderCurrentFrame();
  },

  setSpeed(sp, btnEl) {
    this.state.speed = sp;
    const disp = document.getElementById("speed-val-display");
    if (disp) disp.textContent = `${sp}x`;
    if (btnEl && btnEl.parentElement) {
      btnEl.parentElement.querySelectorAll(".btn-toggle").forEach(b => b.classList.remove("active"));
      btnEl.classList.add("active");
    }
  },

  updateStepChip(stepNum) {
    for (let i = 1; i <= 10; i++) {
      const chip = document.getElementById(`chip-step-${i}`);
      if (chip) {
        if (i < stepNum) {
          chip.className = "step-chip completed";
        } else if (i === stepNum) {
          chip.className = "step-chip active";
        } else {
          chip.className = "step-chip";
        }
      }
    }
  },

  // დაწყება, პაუზა, განულება
  start() {
    if (!this.state.hypothesis) {
      showToast("⚠️ გთხოვთ, ჯერ აირჩიოთ თქვენი ვარაუდი (ჰიპოთეზა) ზემოთ!");
      return;
    }
    this.state.running = true;
    const hud = document.getElementById("sim-hud-status");
    if (hud) {
      hud.textContent = "▶️ მიმდინარეობს...";
      hud.style.color = "#86efac";
    }
    this.updateStepChip(4);
    this.runLoop();
  },

  pause() {
    this.state.running = false;
    const hud = document.getElementById("sim-hud-status");
    if (hud) {
      hud.textContent = "⏸️ შეჩერებულია";
      hud.style.color = "#fef08a";
    }
    this.stopAnimation();
  },

  reset() {
    this.state.running = false;
    this.state.time = 0;
    this.state.measurements = [];
    this.stopAnimation();

    const tbody = document.getElementById("obs-table-body");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-light);">მონაცემები განულდა. დააჭირე „დაწყებას“ ახალი ცდისთვის</td></tr>`;
    }

    const hud = document.getElementById("sim-hud-status");
    if (hud) {
      hud.textContent = "⏸️ განულებულია";
      hud.style.color = "#38bdf8";
    }

    const banner = document.getElementById("sim-feedback-banner");
    if (banner) banner.className = "feedback-banner";

    this.initCanvas(this.activeSimId);
    this.updateStepChip(3);
  },

  stopAnimation() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  },

  // ანიმაციური მარყუჟი
  runLoop() {
    this.stopAnimation();

    const loop = () => {
      if (!this.state.running) return;
      this.state.time += (0.05 * this.state.speed);

      // განახლება და დახატვა
      this.updateSimulationPhysics();
      this.renderCurrentFrame();

      // გაზომვების დაფიქსირება ყოველ 1 წამში
      if (Math.floor(this.state.time * 20) % 20 === 0) {
        this.recordMeasurementRow();
      }

      this.animId = requestAnimationFrame(loop);
    };

    this.animId = requestAnimationFrame(loop);
  },

  // გაზომვის სტრიქონის დამატება ცხრილში
  recordMeasurementRow() {
    const tbody = document.getElementById("obs-table-body");
    if (!tbody) return;

    if (this.state.measurements.length === 0) {
      tbody.innerHTML = "";
    }

    const simId = this.activeSimId;
    const t = this.state.time.toFixed(1);
    let paramCol = "", valCol = "", obsCol = "";

    if (simId === "exp-particles") {
      const temp = this.state.params.temp || 25;
      const state = this.state.params.state || "თხევადი";
      paramCol = `მდგომარეობა: ${state}`;
      valCol = `${temp} °C`;
      obsCol = temp > 99 ? "ინტენსიური აორთქლება და აირის ქაოსური ფრენა" : (temp < 1 ? "გამყარება კრისტალურ მესრად" : "სითხის ნაწილაკების სრიალი");
    } else if (simId === "exp-diffusion") {
      const temp = this.state.params.temp || "ოთახის (25 °C)";
      const pct = Math.min(100, Math.round(this.state.time * (temp.includes("80") ? 18 : (temp.includes("10") ? 4 : 9))));
      paramCol = `ტემპერატურა: ${temp}`;
      valCol = `გავრცელება: ${pct}%`;
      obsCol = pct >= 100 ? "სრული თანაბარი შერევა მიღწეულია!" : "დიფუზიის ფრონტი ფართოვდება მოლეკულების დაჯახებით";
    } else if (simId === "exp-evaporation") {
      const l1 = this.state.params.liquid1 || "წყალი";
      const l2 = this.state.params.liquid2 || "სპირტი";
      paramCol = `${l1} vs ${l2}`;
      valCol = `t = ${t} წმ`;
      obsCol = this.state.time > 8 ? `${l2} სრულად აორთქლდა, ${l1} ჯერ კიდევ რჩება` : "ორივე სითხე თანდათან მცირდება ზომაში";
    } else if (simId === "exp-density") {
      const sample = this.state.params.sample || "რკინა";
      const v1 = this.state.params.initialWater || 50;
      paramCol = `${sample}`;
      valCol = `V₁ = ${v1} მლ`;
      obsCol = "სხეულის ჩაშვებისას წყლის დონე იწევს განდევნილი მოცულობის ტოლად";
    } else if (simId === "exp-solubility") {
      const solute = this.state.params.solute || "NaCl";
      const temp = this.state.params.temp || 20;
      const mass = this.state.params.mass || 30;
      paramCol = `${solute} (${temp} °C)`;
      valCol = `${mass} გ`;
      obsCol = mass > (temp > 60 ? 45 : 36) ? "ნაჯერი ხსნარი: ფსკერზე წარმოიქმნა ნალექი" : "უჯერი ხსნარი: მთელი მარილი სრულად გაიხსნა";
    } else {
      paramCol = "მიმდინარე პროცესი";
      valCol = `დრო: ${t} წმ`;
      obsCol = "პარამეტრების რეაქცია მიმდინარეობს გეგმაზომიერად";
    }

    const row = { time: t, param: paramCol, val: valCol, obs: obsCol };
    this.state.measurements.push(row);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-family:var(--font-mono); font-weight:700;">${row.time} წმ</td>
      <td>${row.param}</td>
      <td style="font-weight:700; color:var(--primary);">${row.val}</td>
      <td>${row.obs}</td>
    `;
    tbody.prepend(tr);

    // შევზღუდოთ ცხრილი ბოლო 6 ჩანაწერით
    while (tbody.children.length > 6) {
      tbody.removeChild(tbody.lastChild);
    }
  },

  // დასკვნის არჩევა და შეფასება
  selectConclusion(conclId, isCorrect) {
    this.state.conclusion = conclId;
    const sim = (window.SIMULATION_METADATA || []).find(s => s.id === this.activeSimId);
    if (!sim) return;

    document.querySelectorAll(".concl-btn").forEach(b => {
      b.classList.remove("correct", "wrong");
    });

    const chosenBtn = document.getElementById(`concl-btn-${conclId}`);
    const banner = document.getElementById("sim-feedback-banner");

    if (isCorrect) {
      if (chosenBtn) chosenBtn.classList.add("correct");
      if (banner) {
        banner.className = "feedback-banner show success";
        banner.innerHTML = `
          <strong>🎉 ბრწყინვალე დასკვნაა!</strong><br>
          ${sim.explanation}
        `;
      }
      this.updateStepChip(10);
      // ქულის მინიჭება მხოლოდ მაშინ, როცა ყველა საფეხური გავლილია!
      AppState.completeSimulation(sim.id, {
        hypothesis: this.state.hypothesis,
        measurementsCount: this.state.measurements.length,
        params: this.state.params,
        date: new Date().toLocaleDateString("ka-GE")
      });
    } else {
      if (chosenBtn) chosenBtn.classList.add("wrong");
      if (banner) {
        banner.className = "feedback-banner show warning";
        banner.innerHTML = `
          <strong>💡 დაფიქრდი ხელახლა:</strong> ეს პასუხი არ არის სრულად ზუსტი. გადახედე გაზომვების ცხრილს და სცადე თავიდან!
        `;
      }
      this.updateStepChip(9);
    }
  },

  // ==========================================================================
  // ფიზიკისა და CANVAS-ის გრაფიკული ძრავი (13 SIMULATIONS)
  // ==========================================================================

  initCanvas(simId) {
    const canvas = document.getElementById("sim-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // ნაწილაკების ინიციალიზაცია
    if (simId === "exp-particles") {
      this.initParticlesPhysics();
    } else if (simId === "exp-diffusion") {
      this.initDiffusionPhysics();
    }

    this.renderCurrentFrame();
  },

  initParticlesPhysics() {
    const count = this.state.params.particles || 50;
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: 100 + Math.random() * 400,
        y: 80 + Math.random() * 220,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 7,
        color: "#38bdf8"
      });
    }
  },

  initDiffusionPhysics() {
    this.diffParticles = [];
    const count = 70;
    // საღებავის წვეთი ცენტრში
    for (let i = 0; i < count; i++) {
      this.diffParticles.push({
        x: 300 + (Math.random() - 0.5) * 15,
        y: 180 + (Math.random() - 0.5) * 15,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 5,
        color: "#c084fc"
      });
    }
  },

  updateSimulationPhysics() {
    const simId = this.activeSimId;
    if (simId === "exp-particles") {
      const temp = this.state.params.temp || 25;
      const speedFactor = (temp + 50) / 40;
      const state = this.state.params.state || "თხევადი";

      this.particles.forEach(p => {
        if (state === "მყარი") {
          // რხევა საკუთარი წერტილის გარშემო
          p.x += (Math.random() - 0.5) * (temp > 0 ? 1 : 0.2);
          p.y += (Math.random() - 0.5) * (temp > 0 ? 1 : 0.2);
        } else if (state === "თხევადი") {
          // სრიალი ფსკერზე
          p.x += p.vx * speedFactor * 0.7;
          p.y += p.vy * speedFactor * 0.7 + 0.3; // გრავიტაცია
          if (p.x < 50 || p.x > 550) p.vx *= -1;
          if (p.y > 330) { p.y = 330; p.vy *= -0.8; }
          if (p.y < 160) p.vy += 0.4;
        } else {
          // აირადი — ქაოსური სწრაფი ფრენა
          p.x += p.vx * speedFactor * 1.5;
          p.y += p.vy * speedFactor * 1.5;
          if (p.x < 50 || p.x > 550) p.vx *= -1;
          if (p.y < 50 || p.y > 330) p.vy *= -1;
        }
      });
    } else if (simId === "exp-diffusion") {
      const temp = this.state.params.temp || "ოთახის (25 °C)";
      const mult = temp.includes("80") ? 3.5 : (temp.includes("10") ? 0.7 : 1.6);
      this.diffParticles.forEach(p => {
        p.x += (Math.random() - 0.5) * 2 * mult;
        p.y += (Math.random() - 0.5) * 2 * mult;
        if (p.x < 150) p.x = 150;
        if (p.x > 450) p.x = 450;
        if (p.y < 100) p.y = 100;
        if (p.y > 320) p.y = 320;
      });
    }
  },

  renderCurrentFrame() {
    const canvas = document.getElementById("sim-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const simId = this.activeSimId;

    // ფონის გასუფთავება (ლაბორატორიული მუქი ლურჯი)
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // გადამისამართება კონკრეტული სიმულაციის რენდერერზე
    if (simId === "exp-particles") {
      this.drawParticlesModel(ctx);
    } else if (simId === "exp-diffusion") {
      this.drawDiffusionModel(ctx);
    } else if (simId === "exp-evaporation") {
      this.drawEvaporationModel(ctx);
    } else if (simId === "exp-density") {
      this.drawDensityModel(ctx);
    } else if (simId === "exp-density-tower") {
      this.drawDensityTowerModel(ctx);
    } else if (simId === "exp-solubility") {
      this.drawSolubilityModel(ctx);
    } else if (simId === "exp-filtration") {
      this.drawFiltrationModel(ctx);
    } else if (simId === "exp-crystallization") {
      this.drawCrystallizationModel(ctx);
    } else if (simId === "exp-magnetic") {
      this.drawMagneticModel(ctx);
    } else if (simId === "exp-chromatography") {
      this.drawChromatographyModel(ctx);
    } else if (simId === "exp-distillation") {
      this.drawDistillationModel(ctx);
    } else if (simId === "exp-changes") {
      this.drawChangesModel(ctx);
    } else if (simId === "exp-safety-lab") {
      this.drawSafetyModel(ctx);
    } else {
      this.drawGenericLaboratory(ctx);
    }
  },

  // 1. ნაწილაკების მოდელის ხატვა
  drawParticlesModel(ctx) {
    const temp = this.state.params.temp || 25;
    const state = this.state.params.state || "თხევადი";

    // ჭურჭლის კონტური
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 40, 500, 300);

    // ნაწილაკების ხატვა
    if (this.particles) {
      this.particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = state === "მყარი" ? "#38bdf8" : (state === "თხევადი" ? "#0284c7" : "#f43f5e");
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 6;
        ctx.fill();
      });
    }
    ctx.shadowBlur = 0;

    // თერმომეტრის სკალა მარჯვნივ
    ctx.fillStyle = "#334155";
    ctx.fillRect(565, 50, 15, 270);
    const mercuryHeight = Math.max(10, Math.min(260, (temp + 30) * 1.8));
    ctx.fillStyle = temp > 80 ? "#ef4444" : (temp < 5 ? "#38bdf8" : "#f59e0b");
    ctx.fillRect(565, 320 - mercuryHeight, 15, mercuryHeight);

    // წარწერა
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px system-ui";
    ctx.fillText(`მდგომარეობა: ${state} (${temp} °C)`, 65, 30);
    ctx.fillText(`${temp} °C`, 560, 40);
  },

  // 2. დიფუზიის მოდელის ხატვა
  drawDiffusionModel(ctx) {
    // ქიმიური ჭიქა
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(140, 80);
    ctx.lineTo(140, 330);
    ctx.arcTo(140, 340, 160, 340, 10);
    ctx.lineTo(440, 340);
    ctx.arcTo(460, 340, 460, 330, 10);
    ctx.lineTo(460, 80);
    ctx.stroke();

    // წყალი ჭიქაში
    ctx.fillStyle = "rgba(2, 132, 199, 0.25)";
    ctx.fillRect(143, 110, 314, 227);

    // საღებავის ნაწილაკები
    if (this.diffParticles) {
      const sub = this.state.params.substance || "კალიუმის პერმანგანატი";
      const color = sub.includes("ლურჯი") ? "#38bdf8" : (sub.includes("ყავისფერი") ? "#b45309" : "#c084fc");
      this.diffParticles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px system-ui";
    ctx.fillText("ქიმიური ჭიქა: დიფუზიის პროცესი", 160, 65);
  },

  // 3. აორთქლების მოდელის ხატვა
  drawEvaporationModel(ctx) {
    const l1 = this.state.params.liquid1 || "გამოხდილი წყალი";
    const l2 = this.state.params.liquid2 || "სპირტი";

    // ორი საათის მინა
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;

    // მინა 1
    ctx.beginPath();
    ctx.arc(190, 260, 100, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // მინა 2
    ctx.beginPath();
    ctx.arc(410, 260, 100, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // სითხე 1 (წყალი)
    const t = this.state.time;
    const r1 = Math.max(0, 30 - t * 0.4);
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.ellipse(190, 310, r1 * 1.5, r1 * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // სითხე 2 (სპირტი / აცეტონი)
    const mult2 = l2.includes("აცეტონი") ? 3.5 : 1.8;
    const r2 = Math.max(0, 30 - t * mult2);
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.ellipse(410, 310, r2 * 1.5, r2 * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // წარწერები
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 13px system-ui";
    ctx.fillText(l1, 130, 220);
    ctx.fillStyle = "#34d399";
    ctx.fillText(l2, 350, 220);

    if (r2 <= 0) {
      ctx.fillStyle = "#fef08a";
      ctx.fillText("✨ სრულად აორთქლდა!", 340, 310);
    }
  },

  // 4. სიმკვრივის მოდელის ხატვა (სასწორი და მენზურა)
  drawDensityModel(ctx) {
    const sample = this.state.params.sample || "რკინის ჭანჭიკი (Fe)";
    const v1 = this.state.params.initialWater || 50;
    const isSubmerged = this.state.running && this.state.time > 1;

    // სასწორი მარცხნივ
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(80, 240, 160, 80);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(95, 255, 130, 40);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px monospace";
    ctx.fillText(isSubmerged ? "0.0 გ" : "157.4 გ", 125, 282);

    // მენზურა მარჯვნივ
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;
    ctx.strokeRect(360, 60, 80, 260);

    // წყლის დონე
    const waterHeight = (v1 / 100) * 240;
    const totalWaterH = isSubmerged ? waterHeight + 48 : waterHeight;
    ctx.fillStyle = "rgba(2, 132, 199, 0.4)";
    ctx.fillRect(362, 320 - totalWaterH, 76, totalWaterH);

    // სხეული
    if (isSubmerged) {
      ctx.fillStyle = "#64748b";
      ctx.fillRect(385, 275, 30, 40);
      // ძაფი
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(400, 275);
      ctx.lineTo(400, 40);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#64748b";
      ctx.fillRect(145, 205, 30, 35);
    }

    // სკალის ნიშნულები
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px monospace";
    ctx.fillText("100 მლ", 445, 80);
    ctx.fillText("70 მლ", 445, 150);
    ctx.fillText("50 მლ", 445, 200);
  },

  // 5. სიმკვრივის კოშკი
  drawDensityTowerModel(ctx) {
    // მაღალი ცილინდრი
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 4;
    ctx.strokeRect(230, 40, 140, 280);

    // ფენები
    // ზეთი (ზემოთ)
    ctx.fillStyle = "rgba(251, 191, 36, 0.8)";
    ctx.fillRect(233, 43, 134, 90);
    // წყალი (შუაში)
    ctx.fillStyle = "rgba(2, 132, 199, 0.7)";
    ctx.fillRect(233, 133, 134, 95);
    // თაფლი (ფსკერზე)
    ctx.fillStyle = "rgba(180, 83, 9, 0.9)";
    ctx.fillRect(233, 228, 134, 89);

    // ტექსტები
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px system-ui";
    ctx.fillText("ზეთი (0.92)", 265, 85);
    ctx.fillText("წყალი (1.00)", 265, 180);
    ctx.fillText("თაფლი (1.42)", 265, 275);

    // მყარი სხეული
    const solid = this.state.params.solidObj || "ხის კუბი";
    if (this.state.running) {
      let targetY = 70; // ხე
      let solidColor = "#854d0e";
      if (solid.includes("პლასტმასი")) { targetY = 175; solidColor = "#dc2626"; }
      else if (solid.includes("რეზინი")) { targetY = 225; solidColor = "#334155"; }
      else if (solid.includes("სპილენძი")) { targetY = 295; solidColor = "#ea580c"; }
      else if (solid.includes("ყინული")) { targetY = 130; solidColor = "#a5f3fc"; }

      ctx.fillStyle = solidColor;
      ctx.fillRect(285, targetY, 30, 25);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.strokeRect(285, targetY, 30, 25);
    }
  },

  // 6. ხსნადობის მოდელი
  drawSolubilityModel(ctx) {
    const temp = this.state.params.temp || 20;
    const mass = this.state.params.mass || 30;
    const maxSoluble = (temp > 60) ? 42 : 36;
    const precipitate = Math.max(0, mass - maxSoluble);

    // ჭიქა
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;
    ctx.strokeRect(180, 80, 240, 240);

    // ხსნარი
    ctx.fillStyle = precipitate > 0 ? "rgba(2, 132, 199, 0.45)" : "rgba(2, 132, 199, 0.25)";
    ctx.fillRect(182, 130, 236, 188);

    // ნალექი ფსკერზე
    if (precipitate > 0) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(200, 305, 200, Math.min(15, precipitate * 0.4));
    }

    // მინის წკირი
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(350, 40);
    ctx.lineTo(260, 310);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px system-ui";
    ctx.fillText(`ტემპერატურა: ${temp} °C • დამატებული მასა: ${mass} გ`, 190, 65);
    if (precipitate > 0) {
      ctx.fillStyle = "#fde047";
      ctx.fillText(`⚠️ ნაჯერი ხსნარი: ნალექია ~${precipitate.toFixed(0)} გ`, 200, 290);
    } else {
      ctx.fillStyle = "#86efac";
      ctx.fillText("✅ უჯერი ხსნარი (სრულად გაიხსნა)", 210, 290);
    }
  },

  // 7. გაფილტვრის მოდელი
  drawFiltrationModel(ctx) {
    // შტატივი
    ctx.fillStyle = "#475569";
    ctx.fillRect(80, 330, 440, 20); // ფუძე
    ctx.fillRect(120, 40, 14, 300); // ღერო
    ctx.fillRect(120, 150, 120, 10); // რგოლი

    // ძაბრი რგოლში
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(190, 110);
    ctx.lineTo(270, 110);
    ctx.lineTo(235, 170);
    ctx.lineTo(235, 220);
    ctx.lineTo(225, 220);
    ctx.lineTo(225, 170);
    ctx.closePath();
    ctx.stroke();

    // ფილტრის ქაღალდი (კონუსი)
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.moveTo(195, 115);
    ctx.lineTo(265, 115);
    ctx.lineTo(230, 168);
    ctx.closePath();
    ctx.fill();

    // ქვიშის ნალექი ფილტრში
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.moveTo(205, 125);
    ctx.lineTo(255, 125);
    ctx.lineTo(230, 165);
    ctx.closePath();
    ctx.fill();

    // მიმღები ჭიქა ქვემოთ
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;
    ctx.strokeRect(200, 230, 60, 90);

    // ფილტრატი ჭიქაში
    ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
    ctx.fillRect(202, 270, 56, 48);

    // წვეთები
    if (this.state.running) {
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(230, 225 + (Math.sin(this.state.time * 6) + 1) * 15, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // 8. კრისტალიზაციის მოდელი
  drawCrystallizationModel(ctx) {
    // სამფეხა სადგამი
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(200, 240);
    ctx.lineTo(160, 340);
    ctx.moveTo(360, 240);
    ctx.lineTo(400, 340);
    ctx.stroke();

    // აზბესტის ბადე
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(190, 235, 180, 6);

    // ფაიფურის ჯამი
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(280, 210, 65, 0, Math.PI);
    ctx.fill();
    ctx.stroke();

    // სპირტქურა ქვემოთ
    ctx.fillStyle = "#334155";
    ctx.fillRect(250, 290, 60, 50);
    // ალი
    if (this.state.params.flame !== "ჩამქრალი") {
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.ellipse(280, 275, 10, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.ellipse(280, 278, 6, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // მარილის კრისტალები
    if (this.state.time > 4) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(240, 210, 80, 15);
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 11px system-ui";
      ctx.fillText("NaCl კრისტალები", 235, 205);
    }
  },

  // 9. მაგნიტური სეპარაცია
  drawMagneticModel(ctx) {
    // პეტრის ჯამი
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;
    ctx.strokeRect(160, 260, 280, 50);

    // გოგირდი (ყვითელი ფხვნილი)
    ctx.fillStyle = "#facc15";
    ctx.fillRect(165, 285, 270, 20);

    // რკინის ნაქლიბი
    ctx.fillStyle = "#475569";
    const dist = this.state.params.magnetDist || 5;
    const isAttracted = dist < 4 || (this.state.running && this.state.time > 2);

    if (isAttracted) {
      // რკინა მიკრულია მაგნიტზე
      ctx.fillRect(260, 150, 80, 15);
    } else {
      // რკინა ჯამშია
      ctx.fillRect(175, 285, 250, 10);
    }

    // მუდმივი მაგნიტი (U-ფორმის ან ძელი)
    const magY = Math.min(220, 80 + dist * 15);
    // წითელი პოლუსი N
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(250, magY - 40, 40, 40);
    // ლურჯი პოლუსი S
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(310, magY - 40, 40, 40);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px system-ui";
    ctx.fillText("N", 265, magY - 15);
    ctx.fillText("S", 325, magY - 15);
  },

  // 10. ქაღალდის ქრომატოგრაფია
  drawChromatographyModel(ctx) {
    // ჭიქა
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;
    ctx.strokeRect(200, 50, 200, 280);

    // გამხსნელი ფსკერზე
    ctx.fillStyle = "rgba(56, 189, 248, 0.3)";
    ctx.fillRect(202, 290, 196, 38);

    // ქაღალდის ზოლი
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(260, 60, 80, 250);

    // სასტარტო ხაზი
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(260, 280);
    ctx.lineTo(340, 280);
    ctx.stroke();

    // საღებავის ლაქები (აცოცება)
    const t = Math.min(12, this.state.time);
    const rise = t * 12;

    // ყვითელი (ყველაზე მაღლა)
    ctx.fillStyle = "#eab308";
    ctx.beginPath();
    ctx.arc(300, Math.max(100, 275 - rise * 1.3), 8, 0, Math.PI * 2);
    ctx.fill();

    // ცისფერი
    ctx.fillStyle = "#06b6d4";
    ctx.beginPath();
    ctx.arc(300, Math.max(140, 275 - rise * 0.9), 8, 0, Math.PI * 2);
    ctx.fill();

    // მეწამული
    ctx.fillStyle = "#d946ef";
    ctx.beginPath();
    ctx.arc(300, Math.max(180, 275 - rise * 0.6), 8, 0, Math.PI * 2);
    ctx.fill();
  },

  // 11. დისტილაცია (გამოხდა)
  drawDistillationModel(ctx) {
    // ვიურცის კოლბა
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(140, 240, 50, 0, Math.PI * 2);
    ctx.stroke();
    // კოლბის ყელი
    ctx.strokeRect(130, 110, 20, 85);

    // ლიბიხის მაცივარი (ირიბი მილი)
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(150, 140);
    ctx.lineTo(380, 240);
    ctx.stroke();

    // მიმღები კოლბა
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 3;
    ctx.strokeRect(380, 240, 60, 80);

    // დისტილატი მიმღებში
    ctx.fillStyle = "rgba(56, 189, 248, 0.6)";
    ctx.fillRect(382, 280, 56, 38);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px system-ui";
    ctx.fillText("ვიურცის კოლბა", 100, 310);
    ctx.fillText("ლიბიხის მაცივარი", 230, 160);
    ctx.fillText("მიმღები", 390, 340);
  },

  // 12. მოვლენების ლაბორატორია
  drawChangesModel(ctx) {
    const sample = this.state.params.reactionSample || "ცარცი (CaCO₃)";
    // სინჯარა
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(270, 70);
    ctx.lineTo(270, 280);
    ctx.arcTo(270, 310, 300, 310, 30);
    ctx.arcTo(330, 310, 330, 280, 30);
    ctx.lineTo(330, 70);
    ctx.stroke();

    // სითხე სინჯარაში
    ctx.fillStyle = sample.includes("CuSO₄") ? "rgba(2, 132, 199, 0.8)" : "rgba(241, 245, 249, 0.4)";
    ctx.fillRect(273, 190, 54, 110);

    // ბუშტუკები (აირის გამოყოფა)
    if (this.state.running && sample.includes("CaCO₃")) {
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(285 + (i * 5), 260 - ((this.state.time * 30 + i * 15) % 80), 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  // 13. უსაფრთხოების ტრენაჟორი
  drawSafetyModel(ctx) {
    const goggles = this.state.params.ppeGoggles || "ჩაცმულია";
    const angle = this.state.params.heatingAngle || "სწორი";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px system-ui";
    ctx.fillText("ლაბორატორიული უსაფრთხოების ვირტუალური კონტროლი", 100, 50);

    // სტატუსის ბარათები
    ctx.fillStyle = goggles.includes("✅") ? "#16a34a" : "#dc2626";
    ctx.fillRect(100, 100, 400, 50);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`დამცავი სათვალე: ${goggles}`, 120, 130);

    ctx.fillStyle = angle.includes("სწორი") ? "#16a34a" : "#dc2626";
    ctx.fillRect(100, 180, 400, 50);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`გაცხელების მიმართულება: ${angle}`, 120, 210);

    ctx.fillStyle = "#0284c7";
    ctx.fillRect(100, 260, 400, 50);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("ოქროს წესი: „ჯერ წყალი და მერე მჟავა!“", 120, 290);
  },

  drawGenericLaboratory(ctx) {
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 16px system-ui";
    ctx.fillText("ქიმიური ლაბორატორიის სამუშაო სივრცე", 150, 180);
  }
};

if (typeof window !== "undefined") {
  window.Simulations = Simulations;
}
