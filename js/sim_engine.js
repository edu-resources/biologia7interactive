// ============================================================================
// SIM_ENGINE.JS — 12 მართვადი ინტერაქტიული სიმულაციის ძრავა
// სრული სამუშაო სივრცე: ჰიპოთეზა, სამართავი პანელი, დაკვირვების ჟურნალი, დასკვნა
// ============================================================================

const SimEngine = {
  activeSims: {},

  renderSimulation(simId) {
    const sim = SIMULATIONS_DATA.find(s => s.id === simId);
    if (!sim) return '';

    // Controls generation
    let controlsHtml = '';
    sim.controls.forEach(ctrl => {
      if (ctrl.type === 'select') {
        controlsHtml += `
          <div class="sim-ctrl-group">
            <label class="sim-ctrl-label" for="${simId}-${ctrl.id}">${ctrl.label}:</label>
            <select class="form-input" id="${simId}-${ctrl.id}">
              ${ctrl.options.map(o => `<option value="${o.val}" ${o.val === ctrl.default ? 'selected' : ''}>${o.text}</option>`).join('')}
            </select>
          </div>
        `;
      } else if (ctrl.type === 'range') {
        controlsHtml += `
          <div class="sim-ctrl-group">
            <div class="sim-ctrl-label">
              <span>${ctrl.label}:</span>
              <span class="sim-ctrl-val" id="${simId}-${ctrl.id}-val">${ctrl.default}${ctrl.unit || ''}</span>
            </div>
            <input type="range" class="form-range" id="${simId}-${ctrl.id}" min="${ctrl.min}" max="${ctrl.max}" value="${ctrl.default}">
          </div>
        `;
      } else if (ctrl.type === 'radio') {
        controlsHtml += `
          <div class="sim-ctrl-group">
            <span class="sim-ctrl-label">${ctrl.label}:</span>
            <div class="sim-radio-group">
              ${ctrl.options.map(o => `
                <label class="sim-radio-item">
                  <input type="radio" name="${simId}-${ctrl.id}" value="${o.val}" ${o.val === ctrl.default ? 'checked' : ''}>
                  <span>${o.text}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `;
      } else if (ctrl.type === 'toggle') {
        controlsHtml += `
          <div class="sim-ctrl-group sim-ctrl-toggle">
            <span class="sim-ctrl-label" style="margin:0;">${ctrl.label}</span>
            <input type="checkbox" id="${simId}-${ctrl.id}" ${ctrl.default ? 'checked' : ''} class="sim-checkbox">
          </div>
        `;
      } else if (ctrl.type === 'button_trigger') {
        controlsHtml += `
          <button class="btn btn-outline" id="${simId}-${ctrl.id}" style="width:100%; margin-top:0.35rem;">
            ${ctrl.text}
          </button>
        `;
      }
    });

    // Readouts generation
    let readoutsHtml = '';
    if (sim.readouts && sim.readouts.length > 0) {
      readoutsHtml = `
        <div class="sim-readouts-bar">
          ${sim.readouts.map(r => `
            <div class="sim-readout-card">
              <span class="sim-readout-lbl">${r.label}</span>
              <span class="sim-readout-num" id="${simId}-${r.id}-val">--</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Hypotheses generation
    let hypothesesHtml = '';
    if (sim.hypotheses && sim.hypotheses.length > 0) {
      hypothesesHtml = `
        <div class="sim-hypothesis-box" id="${simId}-hypo-box">
          <div class="sim-hypo-header">
            <span class="sim-hypo-icon">🎯</span>
            <strong>ჩემი ვარაუდი (ჰიპოთეზა):</strong> აირჩიე სავარაუდო შედეგი ექსპერიმენტის დაწყებამდე:
          </div>
          <div class="sim-hypo-list">
            ${sim.hypotheses.map(h => `
              <label class="sim-hypo-item" id="${simId}-hypo-${h.id}-item">
                <input type="radio" name="${simId}-hypothesis" value="${h.id}" data-correct="${h.correct}" data-exp="${h.explanation.replace(/"/g, '&quot;')}">
                <span>${h.text}</span>
              </label>
            `).join('')}
          </div>
          <div class="sim-hypo-feedback" id="${simId}-hypo-feedback" style="display:none;"></div>
        </div>
      `;
    }

    // Conclusion question
    const conclusionHtml = `
      <div class="sim-conclusion" id="${simId}-conclusion">
        <div class="sim-conclusion-q">❓ საკონტროლო დასკვნა: ${sim.conclusionQuestion}</div>
        <div class="sim-options-list">
          ${sim.options.map((opt, idx) => `
            <button class="sim-opt-btn" data-sim="${simId}" data-idx="${idx}">
              ${opt.text}
            </button>
          `).join('')}
        </div>
        <div class="sim-explanation-box" id="${simId}-explanation"></div>
      </div>
    `;

    return `
      <div class="sim-workspace" id="${simId}" data-sim-id="${simId}">
        <!-- Top Workspace Bar -->
        <div class="sim-top-nav">
          <button class="btn btn-outline" onclick="window.App ? window.App.switchTab('simulations') : history.back()">
            ⬅️ სიმულაციების კატალოგში დაბრუნება
          </button>
          <div class="sim-top-meta">
            <span class="badge badge-primary">${sim.chapterName}</span>
            <span class="badge badge-subtle">${sim.bookPage}</span>
            <span class="badge badge-accent">⏱️ ${sim.duration || '5-7 წუთი'}</span>
          </div>
        </div>

        <!-- Inquiry Banner -->
        <div class="sim-inquiry-card">
          <div class="sim-inquiry-label">🔬 რას ვიკვლევთ ამ სიმულაციაში?</div>
          <h2 class="sim-inquiry-heading">${sim.whatWeStudy || sim.goal}</h2>
          <p class="sim-inquiry-goal"><strong>სასწავლო მიზანი:</strong> ${sim.goal}</p>
          <div class="sim-inquiry-instruction">💡 <strong>ინსტრუქცია:</strong> ${sim.instruction}</div>
        </div>

        <!-- Hypothesis Picker -->
        ${hypothesesHtml}

        <!-- Live Readouts -->
        ${readoutsHtml}

        <!-- Main Experiment Layout -->
        <div class="sim-main-grid">
          <!-- Viewport Column -->
          <div class="sim-canvas-wrap">
            <canvas id="${simId}-canvas" width="600" height="380" class="sim-canvas" role="img" aria-label="${sim.title}"></canvas>
            <div id="${simId}-status-bar" class="sim-canvas-status">
              <span id="${simId}-status-left">სტატუსი: მზადაა</span>
              <span id="${simId}-status-right">აქტიური</span>
            </div>

            <!-- Execution Action Bar -->
            <div class="sim-execution-bar">
              <button class="btn btn-primary" id="${simId}-run-btn">▶ გაშვება</button>
              <button class="btn btn-outline" id="${simId}-reset-btn">⏮ თავიდან</button>
              <div class="sim-speed-box">
                <span style="font-size:0.85rem; font-weight:600; color:var(--text-muted);">სიჩქარე:</span>
                <select id="${simId}-speed-select" class="form-input" style="padding:0.25rem 0.5rem; font-size:0.85rem; width:auto;">
                  <option value="0.5">0.5x</option>
                  <option value="1" selected>1x</option>
                  <option value="2">2x</option>
                </select>
              </div>
              <button class="btn btn-accent" id="${simId}-log-btn" style="margin-left:auto;">
                📝 დაკვირვების დაფიქსირება
              </button>
            </div>
          </div>

          <!-- Controls Column -->
          <div class="sim-controls-panel">
            <h4 class="sim-panel-title">⚙️ სამართავი პარამეტრები</h4>
            ${controlsHtml}
            <div class="sim-output-box" id="${simId}-output">
              <div class="sim-output-title">📊 დაკვირვების შედეგი</div>
              <div id="${simId}-output-text">შეცვალეთ პარამეტრები შედეგის დასაკვირვებლად.</div>
            </div>
          </div>
        </div>

        <!-- Observation Journal -->
        <div class="sim-journal-card">
          <div class="sim-journal-head">
            <h4 style="margin:0; font-size:1.05rem; display:flex; align-items:center; gap:0.5rem;">
              📋 ჩემი დაკვირვების ჟურნალი
            </h4>
            <button class="btn btn-sm btn-outline" id="${simId}-clear-journal-btn">🗑️ გასუფთავება</button>
          </div>
          <div class="sim-table-wrap">
            <table class="sim-journal-table" id="${simId}-journal-table">
              <thead>
                <tr>
                  <th style="width:60px;">#</th>
                  <th>დაყენებული პარამეტრები</th>
                  <th>დაკვირვების მაჩვენებლები</th>
                  <th style="width:110px;">დრო</th>
                </tr>
              </thead>
              <tbody id="${simId}-journal-body">
                <tr class="empty-row">
                  <td colspan="4" style="text-align:center; color:var(--text-light); padding:1.2rem;">
                    დააჭირეთ „დაკვირვების დაფიქსირებას“ მონაცემების ჟურნალში შესატანად.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Conclusion Question -->
        ${conclusionHtml}
      </div>
    `;
  },

  initSimulation(simId) {
    const sim = SIMULATIONS_DATA.find(s => s.id === simId);
    if (!sim) return;

    const canvas = document.getElementById(`${simId}-canvas`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Hypothesis selection
    const hypoRadios = document.querySelectorAll(`input[name="${simId}-hypothesis"]`);
    const hypoFeedback = document.getElementById(`${simId}-hypo-feedback`);
    hypoRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        const isCorrect = radio.getAttribute('data-correct') === 'true';
        const exp = radio.getAttribute('data-exp');
        if (hypoFeedback) {
          hypoFeedback.style.display = 'block';
          hypoFeedback.className = 'sim-hypo-feedback ' + (isCorrect ? 'valid' : 'note');
          hypoFeedback.innerHTML = `<strong>${isCorrect ? '🎯 სწორი ვარაუდია!' : '💡 საინტერესო ჰიპოთეზაა:'}</strong> ${exp}`;
        }
        if (window.AudioSys) window.AudioSys.playClick();
      });
    });

    // Conclusion question handlers
    const optBtns = document.querySelectorAll(`.sim-opt-btn[data-sim="${simId}"]`);
    const explBox = document.getElementById(`${simId}-explanation`);
    optBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const opt = sim.options[idx];
        optBtns.forEach(b => b.disabled = true);
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
          if (window.App && window.App.addProgress) {
            window.App.addProgress('simulations', simId);
          }
        } else {
          btn.classList.add('wrong');
          const correctIdx = sim.options.findIndex(o => o.correct);
          if (optBtns[correctIdx]) optBtns[correctIdx].classList.add('correct');
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

    // Handle range inputs label update
    sim.controls.forEach(ctrl => {
      if (ctrl.type === 'range') {
        const input = document.getElementById(`${simId}-${ctrl.id}`);
        const valSpan = document.getElementById(`${simId}-${ctrl.id}-val`);
        if (input && valSpan) {
          input.addEventListener('input', () => {
            valSpan.textContent = `${input.value}${ctrl.unit || ''}`;
            this.updateSimState(simId);
          });
        }
      } else if (ctrl.type === 'select' || ctrl.type === 'radio' || ctrl.type === 'toggle') {
        const elem = document.getElementById(`${simId}-${ctrl.id}`) || document.querySelector(`input[name="${simId}-${ctrl.id}"]`);
        if (elem) {
          elem.addEventListener('change', () => this.updateSimState(simId));
        }
      }
    });

    // Speed selector
    const speedSelect = document.getElementById(`${simId}-speed-select`);
    if (speedSelect) {
      speedSelect.addEventListener('change', () => {
        const state = this.activeSims[simId];
        if (state) state.speed = parseFloat(speedSelect.value) || 1;
      });
    }

    // Trigger buttons
    const runBtn = document.getElementById(`${simId}-run-btn`);
    const resetBtn = document.getElementById(`${simId}-reset-btn`);
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        const state = this.activeSims[simId];
        if (state) {
          state.running = !state.running;
          runBtn.textContent = state.running ? '⏸ შეჩერება' : '▶ გაშვება';
        }
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetSim(simId);
        if (runBtn) runBtn.textContent = '⏸ შეჩერება';
      });
    }

    // Observation Journal logging
    const logBtn = document.getElementById(`${simId}-log-btn`);
    const journalBody = document.getElementById(`${simId}-journal-body`);
    let logCounter = 0;
    if (logBtn && journalBody) {
      logBtn.addEventListener('click', () => {
        logCounter++;
        const emptyRow = journalBody.querySelector('.empty-row');
        if (emptyRow) emptyRow.remove();

        const paramsList = [];
        sim.controls.forEach(c => {
          const el = document.getElementById(`${simId}-${c.id}`) || document.querySelector(`input[name="${simId}-${c.id}"]:checked`);
          if (el) {
            paramsList.push(`${c.label}: <strong>${el.value}${c.unit || ''}</strong>`);
          }
        });

        const readoutsList = [];
        (sim.readouts || []).forEach(r => {
          const el = document.getElementById(`${simId}-${r.id}-val`);
          if (el && el.textContent && el.textContent !== '--') {
            readoutsList.push(`${r.label}: <strong>${el.textContent}</strong>`);
          }
        });

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>#${logCounter}</strong></td>
          <td style="font-size:0.88rem;">${paramsList.join(' • ')}</td>
          <td style="font-size:0.88rem; color:var(--primary-hover);">${readoutsList.join(' • ') || document.getElementById(`${simId}-output-text`)?.textContent || 'ფიქსირებულია'}</td>
          <td><span class="badge badge-subtle">${timeStr}</span></td>
        `;
        journalBody.appendChild(tr);
        if (window.AudioSys) window.AudioSys.playSuccess();

        logBtn.textContent = '✅ ჩაწერილია!';
        setTimeout(() => { logBtn.textContent = '📝 დაკვირვების დაფიქსირება'; }, 1500);
      });
    }

    const clearJournalBtn = document.getElementById(`${simId}-clear-journal-btn`);
    if (clearJournalBtn && journalBody) {
      clearJournalBtn.addEventListener('click', () => {
        logCounter = 0;
        journalBody.innerHTML = `
          <tr class="empty-row">
            <td colspan="4" style="text-align:center; color:var(--text-light); padding:1.2rem;">
              ჟურნალი გასუფთავებულია.
            </td>
          </tr>
        `;
      });
    }

    this.setupSpecificSim(simId, canvas, ctx);
  },

  setupSpecificSim(simId, canvas, ctx) {
    if (this.activeSims[simId] && this.activeSims[simId].animId) {
      cancelAnimationFrame(this.activeSims[simId].animId);
    }
    const state = { running: true, speed: 1 };
    this.activeSims[simId] = state;

    switch (simId) {
      case 'simulation-microscope':
        this.initMicroscopeSim(simId, canvas, ctx, state);
        break;
      case 'simulation-cell-builder':
        this.initCellBuilderSim(simId, canvas, ctx, state);
        break;
      case 'simulation-osmosis':
        this.initOsmosisSim(simId, canvas, ctx, state);
        break;
      case 'simulation-euglena-phototaxis':
        this.initEuglenaSim(simId, canvas, ctx, state);
        break;
      case 'simulation-amoeba-phagocytosis':
        this.initAmoebaSim(simId, canvas, ctx, state);
        break;
      case 'simulation-bacteria-growth':
        this.initBacteriaGrowthSim(simId, canvas, ctx, state);
        break;
      case 'simulation-photosynthesis':
        this.initPhotosynthesisSim(simId, canvas, ctx, state);
        break;
      case 'simulation-transpiration':
        this.initTranspirationSim(simId, canvas, ctx, state);
        break;
      case 'simulation-food-web':
        this.initFoodWebSim(simId, canvas, ctx, state);
        break;
      case 'simulation-taxonomy-key':
        this.initTaxonomySim(simId, canvas, ctx, state);
        break;
      case 'simulation-yeast-fermentation':
        this.initYeastSim(simId, canvas, ctx, state);
        break;
      case 'simulation-mold-growth':
        this.initMoldSim(simId, canvas, ctx, state);
        break;
    }
  },

  updateSimState(simId) {
    const sim = SIMULATIONS_DATA.find(s => s.id === simId);
    if (!sim) return;
    const canvas = document.getElementById(`${simId}-canvas`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = this.activeSims[simId];
    if (state && state.draw) state.draw();
  },

  resetSim(simId) {
    const canvas = document.getElementById(`${simId}-canvas`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    this.setupSpecificSim(simId, canvas, ctx);
  },

      initMicroscopeSim(simId, canvas, ctx, state) {
    const draw = () => {
      const sample = document.getElementById(`${simId}-sample`)?.value || 'onion';
      const ocular = parseInt(document.getElementById(`${simId}-ocular`)?.value || '10', 10);
      const objective = parseInt(document.getElementById(`${simId}-objective`)?.value || '10', 10);
      const focus = parseInt(document.getElementById(`${simId}-focus`)?.value || '20', 10);
      const light = parseInt(document.getElementById(`${simId}-light`)?.value || '80', 10);

      const totalMag = ocular * objective;
      const optDiff = Math.abs(focus - 50); // Sharpest at 50%
      const blurAmount = Math.max(0, (optDiff - 5) * 0.3);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark microscope body surround
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Circular Field of View
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = 160;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      // Light backdrop
      const lightFactor = light / 100;
      ctx.fillStyle = `rgb(${Math.floor(240 * lightFactor)}, ${Math.floor(245 * lightFactor)}, ${Math.floor(235 * lightFactor)})`;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // Apply blur simulation
      if (blurAmount > 0.5) {
        ctx.filter = `blur(${blurAmount.toFixed(1)}px)`;
      }

      // Draw Specimen
      const scale = (totalMag / 100) * 1.2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      if (sample === 'onion') {
        // Onion epidermis cells
        ctx.strokeStyle = '#65a30d';
        ctx.lineWidth = 3 / scale;
        for (let row = -3; row <= 3; row++) {
          for (let col = -3; col <= 3; col++) {
            const x = col * 80 + (row % 2) * 40;
            const y = row * 45;
            ctx.fillStyle = 'rgba(236, 252, 203, 0.4)';
            ctx.fillRect(x - 38, y - 20, 76, 40);
            ctx.strokeRect(x - 38, y - 20, 76, 40);

            // Nucleus dot
            ctx.beginPath();
            ctx.arc(x - 10, y + 2, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(161, 98, 7, 0.7)';
            ctx.fill();

            // Vacuole hint
            ctx.beginPath();
            ctx.ellipse(x + 10, y - 2, 20, 10, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(132, 204, 22, 0.5)';
            ctx.stroke();
          }
        }
      } else if (sample === 'cheek') {
        // Epithelial cells
        for (let i = -2; i <= 2; i++) {
          for (let j = -2; j <= 2; j++) {
            const ox = i * 70 + (j * 15);
            const oy = j * 65;
            ctx.beginPath();
            ctx.ellipse(ox, oy, 32, 24, (i + j) * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(254, 205, 211, 0.6)';
            ctx.fill();
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 1.5 / scale;
            ctx.stroke();

            // Central nucleus
            ctx.beginPath();
            ctx.arc(ox + 2, oy - 1, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#881337';
            ctx.fill();
          }
        }
      } else {
        // Bacteria
        ctx.fillStyle = '#3b82f6';
        for (let b = 0; b < 60; b++) {
          const bx = Math.sin(b * 123) * 120;
          const by = Math.cos(b * 321) * 120;
          ctx.beginPath();
          if (b % 2 === 0) {
            ctx.ellipse(bx, by, 8, 3, b, 0, Math.PI * 2); // Bacillus rod
          } else {
            ctx.arc(bx, by, 3.5, 0, Math.PI * 2); // Coccus
          }
          ctx.fill();
        }
      }

      ctx.restore();
      ctx.restore(); // end clip

      // Eyepiece ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.lineWidth = 12;
      ctx.strokeStyle = '#1e293b';
      ctx.stroke();

      // Crosshair & scale bar
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy); ctx.lineTo(cx + 30, cy);
      ctx.moveTo(cx, cy - 30); ctx.lineTo(cx, cy + 30);
      ctx.stroke();

      // Scale bar text
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px system-ui';
      ctx.fillText(`გადიდება: ${totalMag}x (${ocular}x × ${objective}x)`, 20, 30);
      ctx.fillStyle = optDiff < 8 ? '#4ade80' : '#f87171';
      ctx.fillText(optDiff < 8 ? '✓ მკაფიო ფოკუსი' : '⚠ ბუნდოვანია (გაასწორეთ ხრახნით)', 20, 50);

      // Update output text
      const outElem = document.getElementById(`${simId}-output-text`);
      if (outElem) {
        outElem.innerHTML = `
          <strong>საერთო გადიდება:</strong> ${totalMag}-ჯერ.<br>
          <strong>ფოკუსირება:</strong> ${optDiff < 8 ? '<span style="color:#16a34a; font-weight:700;">იდეალური სიმკვეთრე!</span> ჩანს უჯრედის დეტალები.' : '<span style="color:#dc2626;">ბუნდოვანია.</span> დაარეგულირეთ ფოკუსის სლაიდერი ~50%-თან.'}
        `;
      }
    };

    state.draw = draw;
    draw();
  },

  // --------------------------------------------------------------------------
  // 2. CELL BUILDER & ORGANELLES COMPARISON SIMULATION
  // --------------------------------------------------------------------------
  initCellBuilderSim(simId, canvas, ctx, state) {
    const draw = () => {
      const cellType = document.querySelector(`input[name="${simId}-cellType"]:checked`)?.value || 'plant';
      const showPlastids = document.getElementById(`${simId}-showPlastids`)?.checked ?? true;
      const showWall = document.getElementById(`${simId}-showWall`)?.checked ?? true;
      const showVacuole = document.getElementById(`${simId}-showVacuole`)?.checked ?? true;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      if (cellType === 'plant') {
        // Plant cell: rigid hexagonal wall
        if (showWall) {
          ctx.beginPath();
          ctx.rect(cx - 180, cy - 130, 360, 260);
          ctx.lineWidth = 14;
          ctx.strokeStyle = '#22c55e';
          ctx.stroke();
          ctx.fillStyle = '#14532d';
          ctx.font = 'bold 11px system-ui';
          ctx.fillText('მყარი ცელულოზის კედელი', cx - 170, cy - 138);
        }

        // Plasma membrane inside
        ctx.beginPath();
        ctx.rect(cx - 165, cy - 115, 330, 230);
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#38bdf8';
        ctx.stroke();

        // Cytoplasm
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(cx - 163, cy - 113, 326, 226);

        // Central Vacuole
        if (showVacuole) {
          ctx.beginPath();
          ctx.ellipse(cx - 30, cy + 10, 100, 75, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#38bdf8';
          ctx.stroke();
          ctx.fillStyle = '#bae6fd';
          ctx.font = 'bold 12px system-ui';
          ctx.fillText('ცენტრალური ვაკუოლი (უჯრედის წვენი)', cx - 120, cy + 15);
        }

        // Chloroplasts
        if (showPlastids) {
          const plastidPositions = [[cx + 100, cy - 60], [cx - 110, cy - 60], [cx + 95, cy + 50], [cx - 100, cy + 60]];
          plastidPositions.forEach(([px, py]) => {
            ctx.beginPath();
            ctx.ellipse(px, py, 26, 16, 0.3, 0, Math.PI * 2);
            ctx.fillStyle = '#15803d';
            ctx.fill();
            ctx.strokeStyle = '#4ade80';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Thylakoid grana lines
            ctx.strokeStyle = '#86efac';
            ctx.beginPath();
            ctx.moveTo(px - 14, py); ctx.lineTo(px + 14, py);
            ctx.stroke();
          });
          ctx.fillStyle = '#4ade80';
          ctx.font = 'bold 11px system-ui';
          ctx.fillText('ქლოროპლასტი (ფოტოსინთეზი)', cx + 40, cy - 85);
        }

        // Nucleus
        ctx.beginPath();
        ctx.arc(cx + 80, cy - 10, 32, 0, Math.PI * 2);
        ctx.fillStyle = '#6d28d9';
        ctx.fill();
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + 80, cy - 10, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#c4b5fd';
        ctx.fill();
        ctx.fillStyle = '#ddd6fe';
        ctx.font = 'bold 12px system-ui';
        ctx.fillText('ბირთვი (დნმ)', cx + 55, cy + 35);

        // Mitochondria
        ctx.beginPath();
        ctx.ellipse(cx + 110, cy - 70, 16, 9, -0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#e11d48';
        ctx.fill();
        ctx.strokeStyle = '#fb7185';
        ctx.stroke();

      } else {
        // Animal cell: flexible rounded shape
        ctx.beginPath();
        ctx.ellipse(cx, cy, 175, 125, 0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#4c0519';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#f43f5e';
        ctx.stroke();

        ctx.fillStyle = '#fda4af';
        ctx.font = 'bold 11px system-ui';
        ctx.fillText('პლაზმური მემბრანა (კედელი არ აქვს!)', cx - 100, cy - 135);

        // Large central nucleus
        ctx.beginPath();
        ctx.arc(cx, cy, 45, 0, Math.PI * 2);
        ctx.fillStyle = '#6d28d9';
        ctx.fill();
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + 5, cy - 5, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#ddd6fe';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px system-ui';
        ctx.fillText('ბირთვი', cx - 22, cy + 5);

        // Numerous mitochondria (ATP synthesis)
        const mitoPos = [[cx - 90, cy - 50], [cx + 90, cy - 40], [cx - 100, cy + 40], [cx + 80, cy + 55]];
        mitoPos.forEach(([mx, my]) => {
          ctx.beginPath();
          ctx.ellipse(mx, my, 22, 12, 0.4, 0, Math.PI * 2);
          ctx.fillStyle = '#e11d48';
          ctx.fill();
          ctx.strokeStyle = '#fb7185';
          ctx.lineWidth = 2;
          ctx.stroke();
        });
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 11px system-ui';
        ctx.fillText('მიტოქონდრია (ენერგია/ატფ)', cx + 20, cy + 85);
      }

      // Live comparison output
      const outElem = document.getElementById(`${simId}-output-text`);
      if (outElem) {
        if (cellType === 'plant') {
          outElem.innerHTML = `
            <strong>მცენარეული უჯრედის მახასიათებლები:</strong><br>
            • აქვს მყარი <strong>ცელულოზის კედელი</strong> (უზრუნველყოფს ფორმას).<br>
            • შეიცავს <strong>ქლოროპლასტებს</strong> (ფოტოსინთეზისთვის).<br>
            • შეიცავს <strong>დიდ ცენტრალურ ვაკუოლს</strong> უჯრედის წვენით.
          `;
        } else {
          outElem.innerHTML = `
            <strong>ცხოველური უჯრედის მახასიათებლები:</strong><br>
            • <strong>არ აქვს</strong> უჯრედის კედელი (ელასტიკური მემბრანა).<br>
            • <strong>არ აქვს</strong> ქლოროპლასტები (ჰეტეროტროფია).<br>
            • ვაკუოლები პატარაა და დროებითი (მომნელებელი, მფეთქავი).
          `;
        }
      }
    };

    state.draw = draw;
    draw();
  },

  // --------------------------------------------------------------------------
  // 3. OSMOSIS & DIFFUSION SIMULATION
  // --------------------------------------------------------------------------
  initOsmosisSim(simId, canvas, ctx, state) {
    // Generate water particles and solute
    state.particles = [];
    for (let i = 0; i < 80; i++) {
      state.particles.push({
        x: Math.random() * 260 + 20,
        y: Math.random() * 280 + 50,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        type: 'water'
      });
    }

    const loop = () => {
      if (!document.getElementById(simId)) return;
      const tonicity = document.getElementById(`${simId}-tonicity`)?.value || 'hyper';
      const cellType = document.getElementById(`${simId}-membraneType`)?.value || 'plant';

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Beaker / Container
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.strokeRect(60, 40, 480, 300);

      // Semi-permeable cell membrane in center
      let cellRadiusX = 110;
      let cellRadiusY = 85;
      let stateName = 'ნორმალური (იზოტონური)';
      let stateColor = '#22c55e';

      if (tonicity === 'hypo') {
        cellRadiusX = 135;
        cellRadiusY = 105;
        stateName = cellType === 'plant' ? 'ტურგორული წნევა (გაბერილი)' : 'ჰემოლიზი (გასკდომის რისკი!)';
        stateColor = cellType === 'plant' ? '#38bdf8' : '#ef4444';
      } else if (tonicity === 'hyper') {
        cellRadiusX = 80;
        cellRadiusY = 60;
        stateName = cellType === 'plant' ? 'პლაზმოლიზი (ციტოპლაზმის შეკუმშვა)' : 'ნაოჭდებადი (გაუწყლოებული)';
        stateColor = '#f59e0b';
      }

      if (cellType === 'plant') {
        // Rigid wall stays fixed
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 8;
        ctx.strokeRect(cx - 120, cy - 90, 240, 180);
        ctx.fillStyle = '#86efac';
        ctx.font = 'bold 11px system-ui';
        ctx.fillText('უჯრედის კედელი (უცვლელია)', cx - 80, cy - 96);
      }

      // Shrunken or swollen inner membrane
      ctx.beginPath();
      ctx.ellipse(cx, cy, cellRadiusX, cellRadiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]); // porous semi-permeable membrane
      ctx.strokeStyle = '#60a5fa';
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Vacuole inside
      ctx.beginPath();
      ctx.ellipse(cx, cy, cellRadiusX * 0.6, cellRadiusY * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(14, 165, 233, 0.4)';
      ctx.fill();

      // Flow indicators (Arrows)
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px system-ui';
      if (tonicity === 'hypo') {
        ctx.fillText('🌊 წყალი შედის უჯრედში ➔➔', cx - 80, 25);
      } else if (tonicity === 'hyper') {
        ctx.fillText('⬅️⬅️ წყალი გამოდის უჯრედიდან 🌊', cx - 100, 25);
      } else {
        ctx.fillText('⚖️ დინამიკური წონასწორობა (შედის = გამოდის)', cx - 120, 25);
      }

      // Info badge
      ctx.fillStyle = stateColor;
      ctx.font = 'bold 14px system-ui';
      ctx.fillText(`მდგომარეობა: ${stateName}`, 70, 365);

      const outElem = document.getElementById(`${simId}-output-text`);
      if (outElem) {
        if (tonicity === 'hypo') {
          outElem.innerHTML = `<strong>ჰიპოტონური გარემო:</strong> წყალი დაბალი კონცენტრაციიდან უჯრედში ჩაედინება. მცენარეში იზრდება <strong>ტურგორი</strong>, რაც ღეროს სიმკვრივეს ანიჭებს.`;
        } else if (tonicity === 'hyper') {
          outElem.innerHTML = `<strong>ჰიპერტონული გარემო:</strong> მარილიანი ხსნარი უჯრედიდან წყალს იწოვს. ვითარდება <strong>პლაზმოლიზი</strong> — ვაკუოლი და ციტოპლაზმა შორდება კედელს.`;
        } else {
          outElem.innerHTML = `<strong>იზოტონური გარემო:</strong> უჯრედში და გარეთ მარილის კონცენტრაცია თანაბარია; უჯრედი ინარჩუნებს ნორმალურ ფორმას.`;
        }
      }

      if (state.running) {
        requestAnimationFrame(loop);
      }
    };

    state.draw = loop;
    loop();
  },

  // --------------------------------------------------------------------------
  // 4. EUGLENA PHOTOTAXIS SIMULATION
  // --------------------------------------------------------------------------
  initEuglenaSim(simId, canvas, ctx, state) {
    const euglenas = [];
    for (let i = 0; i < 15; i++) {
      euglenas.push({
        x: Math.random() * 400 + 100,
        y: Math.random() * 260 + 60,
        angle: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random()
      });
    }

    const loop = () => {
      if (!document.getElementById(simId)) return;
      const lightPos = document.getElementById(`${simId}-lightPos`)?.value || 'right';
      const brightness = parseInt(document.getElementById(`${simId}-lightIntensity`)?.value || '80', 10);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Pond backdrop
      ctx.fillStyle = lightPos === 'dark' ? '#020617' : '#082f49';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let targetX = canvas.width - 50;
      let targetY = canvas.height / 2;

      if (lightPos === 'left') {
        targetX = 50;
      } else if (lightPos === 'center') {
        targetX = canvas.width / 2;
        targetY = 60;
      } else if (lightPos === 'dark') {
        targetX = -999; // Random swim
      }

      // Draw Light Beam
      if (lightPos !== 'dark') {
        const radGrad = ctx.createRadialGradient(targetX, targetY, 10, targetX, targetY, 260);
        radGrad.addColorStop(0, `rgba(253, 224, 71, ${brightness / 120})`);
        radGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 260, 0, Math.PI * 2);
        ctx.fill();

        // Light bulb icon
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(targetX, targetY, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = '14px system-ui';
        ctx.fillText('💡', targetX - 7, targetY + 5);
      }

      // Update & Draw Euglenas
      euglenas.forEach(e => {
        if (state.running) {
          if (lightPos !== 'dark') {
            const dx = targetX - e.x;
            const dy = targetY - e.y;
            const targetAngle = Math.atan2(dy, dx);
            e.angle += (targetAngle - e.angle) * 0.05;
          } else {
            e.angle += (Math.random() - 0.5) * 0.2;
          }
          e.x += Math.cos(e.angle) * e.speed;
          e.y += Math.sin(e.angle) * e.speed;

          // Wall bounce
          if (e.x < 30) e.x = 30;
          if (e.x > canvas.width - 30) e.x = canvas.width - 30;
          if (e.y < 30) e.y = 30;
          if (e.y > canvas.height - 30) e.y = canvas.height - 30;
        }

        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(e.angle);

        // Spindle body
        ctx.beginPath();
        ctx.ellipse(0, 0, 22, 9, 0, 0, Math.PI * 2);
        ctx.fillStyle = lightPos === 'dark' ? '#4d7c0f' : '#65a30d';
        ctx.fill();
        ctx.strokeStyle = '#84cc16';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Red Stigma (eyespot)
        ctx.beginPath();
        ctx.arc(14, -3, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();

        // Nucleus
        ctx.beginPath();
        ctx.arc(-2, 0, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#1e1b4b';
        ctx.fill();

        // Flagellum (animated wavy line)
        ctx.beginPath();
        ctx.moveTo(22, 0);
        const wave = Math.sin(Date.now() * 0.02 + e.x) * 6;
        ctx.quadraticCurveTo(32, wave, 42, -wave);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      });

      // Output banner
      const outElem = document.getElementById(`${simId}-output-text`);
      if (outElem) {
        if (lightPos === 'dark') {
          outElem.innerHTML = `<strong>🌑 სიბნელე:</strong> ევგლენები გადავიდნენ <strong>ჰეტეროტროფულ კვებაზე</strong>. ისინი მთელი სხეულით იწოვენ წყალში გახსნილ ორგანულ ნივთიერებებს.`;
        } else {
          outElem.innerHTML = `<strong>☀️ სინათლისკენ სწრაფვა (ფოტოტაქსისი):</strong> წითელი <strong>სტიგმით</strong> სინათლის მიმართულებას აღიქვამენ და შოლტით მისკენ მიცურავენ <strong>ფოტოსინთეზისთვის</strong>.`;
        }
      }

      if (state.running) {
        requestAnimationFrame(loop);
      }
    };

    state.draw = loop;
    loop();
  },

  // --------------------------------------------------------------------------
  // 5. AMOEBA PHAGOCYTOSIS SIMULATION
  // --------------------------------------------------------------------------
  initAmoebaSim(simId, canvas, ctx, state) {
    state.foodX = 420;
    state.foodY = 190;
    state.foodEaten = false;
    state.amoebaX = 180;
    state.amoebaY = 190;

    const feedBtn = document.getElementById(`${simId}-feedAction`);
    if (feedBtn) {
      feedBtn.addEventListener('click', () => {
        state.foodX = Math.random() * 200 + 320;
        state.foodY = Math.random() * 200 + 90;
        state.foodEaten = false;
      });
    }

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      state.foodX = (e.clientX - rect.left) * (canvas.width / rect.width);
      state.foodY = (e.clientY - rect.top) * (canvas.height / rect.height);
      state.foodEaten = false;
    });

    const loop = () => {
      if (!document.getElementById(simId)) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#061325';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move amoeba towards food
      const dx = state.foodX - state.amoebaX;
      const dy = state.foodY - state.amoebaY;
      const dist = Math.hypot(dx, dy);

      if (state.running && !state.foodEaten && dist > 15) {
        state.amoebaX += (dx / dist) * 1.2;
        state.amoebaY += (dy / dist) * 1.2;
      } else if (dist <= 15 && !state.foodEaten) {
        state.foodEaten = true;
      }

      // Draw Food Particle
      if (!state.foodEaten) {
        ctx.beginPath();
        ctx.arc(state.foodX, state.foodY, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#f43f5e';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#fda4af';
        ctx.font = '11px system-ui';
        ctx.fillText('საკვები (ბაქტერია)', state.foodX - 30, state.foodY - 14);
      }

      // Draw Amoeba body with pseudopodia
      ctx.save();
      ctx.translate(state.amoebaX, state.amoebaY);

      ctx.beginPath();
      const numPoints = 12;
      const baseR = 70;
      const time = Date.now() * 0.003;
      for (let i = 0; i <= numPoints; i++) {
        const theta = (i / numPoints) * Math.PI * 2;
        let r = baseR + Math.sin(theta * 3 + time) * 16 + Math.cos(theta * 2 - time) * 12;
        // Reach out towards food
        const angleToFood = Math.atan2(dy, dx);
        const diff = Math.abs(theta - angleToFood);
        if (diff < 0.6 && !state.foodEaten) {
          r += 35; // Pseudopod extension!
        }
        const px = Math.cos(theta) * r;
        const py = Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Granular cytoplasm
      ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Nucleus
      ctx.beginPath();
      ctx.arc(-10, -5, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#4f46e5';
      ctx.fill();
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Contractile Vacuole
      ctx.beginPath();
      ctx.arc(20, -25, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.fill();

      // Food Vacuole inside if eaten
      if (state.foodEaten) {
        ctx.beginPath();
        ctx.arc(25, 10, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.5)';
        ctx.fill();
        ctx.strokeStyle = '#fb7185';
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px system-ui';
        ctx.fillText('მომნელებელი ვაკუოლი', 5, 38);
      }

      ctx.restore();

      const outElem = document.getElementById(`${simId}-output-text`);
      if (outElem) {
        if (state.foodEaten) {
          outElem.innerHTML = `<strong>✅ ფაგოციტოზი დასრულდა:</strong> ამებამ ცრუფეხებით შემოფარგლა საკვები და წარმოქმნა <strong>მომნელებელი ვაკუოლი</strong>. ფერმენტები შლიან საკვებს. დააწკაპეთ ეკრანზე ახალი საკვების დასადებად.`;
        } else {
          outElem.innerHTML = `<strong>ცრუფეხების (ფსევდოპოდიების) გამოწევა:</strong> ციტოპლაზმის დინებით ამება საკვებისკენ იშლება მის ჩასაყლაპად. დააწკაპეთ ეკრანზე საკვების გადასატანად.`;
        }
      }

      if (state.running) {
        requestAnimationFrame(loop);
      }
    };

    state.draw = loop;
    loop();
  },

  // --------------------------------------------------------------------------
  // 6. BACTERIA GROWTH SIMULATION
  // --------------------------------------------------------------------------
  initBacteriaGrowthSim(simId, canvas, ctx, state) {
    state.bacteriaList = [{ x: 300, y: 190, size: 6 }];
    state.simMinutes = 0;
    state.antisepticApplied = false;

    const sprayBtn = document.getElementById(`${simId}-antiseptic`);
    if (sprayBtn) {
      sprayBtn.addEventListener('click', () => {
        state.antisepticApplied = true;
        // Kill 90%
        state.bacteriaList = state.bacteriaList.slice(0, Math.max(1, Math.floor(state.bacteriaList.length * 0.05)));
      });
    }

    const loop = () => {
      if (!document.getElementById(simId)) return;
      const temp = document.getElementById(`${simId}-temp`)?.value || 'optimum';
      const speed = parseInt(document.getElementById(`${simId}-timeScale`)?.value || '2', 10);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Petri Dish
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const pr = 150;

      ctx.beginPath();
      ctx.arc(cx, cy, pr, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#475569';
      ctx.stroke();

      // Agar surface
      ctx.beginPath();
      ctx.arc(cx, cy, pr - 6, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a15';
      ctx.fill();

      // Simulation growth step
      if (state.running) {
        state.simMinutes += speed;
        // Division interval
        let divRate = 0;
        if (temp === 'optimum') divRate = 0.03 * speed;
        else if (temp === 'room') divRate = 0.01 * speed;
        else if (temp === 'freeze') divRate = 0; // Frozen
        else if (temp === 'boil') {
          // Dying
          state.bacteriaList = [];
        }

        if (Math.random() < divRate && state.bacteriaList.length < 350) {
          const parent = state.bacteriaList[Math.floor(Math.random() * state.bacteriaList.length)];
          if (parent) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 20 + 8;
            const nx = parent.x + Math.cos(angle) * dist;
            const ny = parent.y + Math.sin(angle) * dist;
            if (Math.hypot(nx - cx, ny - cy) < pr - 20) {
              state.bacteriaList.push({ x: nx, y: ny, size: 4 + Math.random() * 3 });
            }
          }
        }
      }

      // Draw Bacteria
      state.bacteriaList.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = temp === 'boil' ? '#64748b' : '#38bdf8';
        ctx.fill();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Overlay stats
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px system-ui';
      ctx.fillText(`სიმულირებული დრო: ${Math.floor(state.simMinutes)} წუთი`, 20, 30);
      ctx.fillText(`კოლონიის რიცხოვნობა: ${state.bacteriaList.length} ბაქტერია`, 20, 50);

      const outElem = document.getElementById(`${simId}-output-text`);
      if (outElem) {
        if (temp === 'boil') {
          outElem.innerHTML = `<strong>♨️ 80°C (პასტერიზაცია):</strong> მაღალმა ტემპერატურამ დაშალა ბაქტერიული ცილები. კოლონიები სრულად განადგურდა.`;
        } else if (temp === 'freeze') {
          outElem.innerHTML = `<strong>❄️ 0°C (მაცივარი):</strong> ბაქტერიები არ იღუპებიან, მაგრამ მათი გაყოფა და გამრავლება შეჩერებულია (ანაბიოზი).`;
        } else if (temp === 'optimum') {
          outElem.innerHTML = `<strong>🔥 37°C (ოპტიმუმი):</strong> ბაქტერიები ექსპონენციურად მრავლდებიან (ყოველ 20 წუთში რაოდენობა ორმაგდება).`;
        } else {
          outElem.innerHTML = `<strong>🌡️ 20°C (ოთახის ტემპერატურა):</strong> ზომიერი ზრდის ტემპი.`;
        }
      }

      if (state.running) {
        requestAnimationFrame(loop);
      }
    };

    state.draw = loop;
    loop();
  },

  // --------------------------------------------------------------------------
  // 7. PHOTOSYNTHESIS SIMULATION
  // --------------------------------------------------------------------------
  initPhotosynthesisSim(simId, canvas, ctx, state) {
    state.bubbles = [];

    const loop = () => {
      if (!document.getElementById(simId)) return;
      const light = parseInt(document.getElementById(`${simId}-lightPower`)?.value || '70', 10);
      const co2 = document.getElementById(`${simId}-co2Level`)?.value || 'med';
      const temp = parseInt(document.getElementById(`${simId}-tempLevel`)?.value || '25', 10);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#082f49';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;

      // Draw Beaker with water
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(cx - 120, 80, 240, 260);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.strokeRect(cx - 120, 80, 240, 260);

      // Inverted funnel with Elodea plant
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.moveTo(cx - 80, 320);
      ctx.lineTo(cx + 80, 320);
      ctx.lineTo(cx + 15, 200);
      ctx.lineTo(cx - 15, 200);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Test Tube on top
      ctx.strokeRect(cx - 16, 40, 32, 170);

      // Elodea sprig (plant branches)
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx, 310);
      ctx.lineTo(cx - 10, 240);
      ctx.lineTo(cx + 5, 220);
      ctx.stroke();

      // Leaves
      ctx.fillStyle = '#22c55e';
      for (let l = 0; l < 8; l++) {
        ctx.beginPath();
        ctx.ellipse(cx + (l % 2 === 0 ? 12 : -12), 300 - l * 10, 10, 5, (l % 2 === 0 ? 0.5 : -0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      // Photosynthesis rate calculation
      let co2Factor = co2 === 'high' ? 1.4 : (co2 === 'med' ? 1.0 : 0.4);
      let tempFactor = temp > 40 ? Math.max(0, 1 - (temp - 40) * 0.2) : (temp < 15 ? 0.3 : 1.0);
      let bubbleRate = (light / 100) * co2Factor * tempFactor * 1.5;

      // Spawn bubbles
      if (state.running && Math.random() < bubbleRate) {
        state.bubbles.push({ x: cx + (Math.random() - 0.5) * 6, y: 215, r: 3 + Math.random() * 2 });
      }

      // Draw and update bubbles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      state.bubbles.forEach((b, idx) => {
        if (state.running) b.y -= 2.5;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
      state.bubbles = state.bubbles.filter(b => b.y > 60);

      // Lamp rays
      if (light > 0) {
        ctx.save();
        ctx.strokeStyle = `rgba(253, 224, 71, ${light / 150})`;
        ctx.lineWidth = 3;
        for (let ray = 0; ray < 6; ray++) {
          ctx.beginPath();
          ctx.moveTo(60, 120 + ray * 25);
          ctx.lineTo(cx - 80, 200 + ray * 15);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Gauges
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px system-ui';
      const bubblesPerMin = Math.round(bubbleRate * 60);
      ctx.fillText(`💨 O2 ბუშტუკები: ~${bubblesPerMin} ც/წთ`, 20, 30);
      ctx.fillText(`💡 სინათლე: ${light}% | CO2: ${co2} | ტემპ: ${temp}°C`, 20, 50);

      const outElem = document.getElementById(`${simId}-output-text`);
      if (outElem) {
        outElem.innerHTML = `
          <strong>ფოტოსინთეზის სიჩქარე:</strong> ${bubblesPerMin} ბუშტუკი/წუთში.<br>
          ${bubblesPerMin > 40 ? '<span style="color:#22c55e; font-weight:700;">მაღალი ეფექტურობა!</span> სინათლისა და ნახშირორჟანგის სიუხვე ჟანგბადის ინტენსიურ გამოყოფას განაპირობებს.' : 'დაბალი სიჩქარე. სინათლის ან CO2-ის ნაკლებობა ლიმიტირებს პროცესს.'}
        `;
      }

      if (state.running) {
        requestAnimationFrame(loop);
      }
    };

    state.draw = loop;
    loop();
  },

  // --------------------------------------------------------------------------
  // 8. TRANSPIRATION SIMULATION
  // --------------------------------------------------------------------------
  initTranspirationSim(simId, canvas, ctx, state) {
    const loop = () => {
      if (!document.getElementById(simId)) return;
      const wind = document.getElementById(`${simId}-wind`)?.value || 'breeze';
      const humidity = parseInt(document.getElementById(`${simId}-humidity`)?.value || '45', 10);
      const sun = parseInt(document.getElementById(`${simId}-sunlight`)?.value || '24', 10);
      const stomata = document.querySelector(`input[name="${simId}-stomata"]:checked`)?.value || 'open';

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;

      // Potometer Setup
      // Plant Stem
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(cx, 320);
      ctx.lineTo(cx, 160);
      ctx.stroke();

      // Leaves
      const leafAngles = [-0.6, 0.6, -0.4, 0.4];
      leafAngles.forEach((ang, idx) => {
        ctx.save();
        ctx.translate(cx, 200 - idx * 20);
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.ellipse(40, 0, 45, 18, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.fill();
        ctx.strokeStyle = '#166534';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      });

      // Stomata detail box (top right)
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(canvas.width - 170, 20, 150, 100);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(canvas.width - 170, 20, 150, 100);

      // Draw Stoma pore
      ctx.fillStyle = '#fff';
      ctx.font = '10px system-ui';
      ctx.fillText('ფოთლის ბაგე (მიკროსკოპი):', canvas.width - 165, 36);

      ctx.beginPath();
      ctx.ellipse(canvas.width - 95, 75, 24, 32, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#15803d';
      ctx.fill();
      // Aperture slit
      ctx.beginPath();
      const aperture = stomata === 'open' ? 12 : 1;
      ctx.ellipse(canvas.width - 95, 75, aperture, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = stomata === 'open' ? '#38bdf8' : '#022c22';
      ctx.fill();

      // Water vapor dots escaping
      let rate = 0;
      if (stomata === 'open') {
        const windFactor = wind === 'strong' ? 1.6 : (wind === 'breeze' ? 1.0 : 0.6);
        const humFactor = (100 - humidity) / 50;
        const sunFactor = sun / 20;
        rate = Math.round(15 * windFactor * humFactor * sunFactor);

        // Draw animated vapor
        ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
        for (let v = 0; v < Math.min(rate, 25); v++) {
          const vx = cx + (Math.random() - 0.5) * 140;
          const vy = 150 - Math.random() * 80;
          ctx.beginPath();
          ctx.arc(vx, vy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Xylem flow arrows in stem
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px system-ui';
      ctx.fillText('▲ აღმავალი წყლის დინება (ქსილემა)', cx - 110, 350);

      const outElem = document.getElementById(`${simId}-output-text`);
      if (outElem) {
        outElem.innerHTML = `
          <strong>ტრანსპირაციის სიჩქარე:</strong> ${rate} მლ/საათში.<br>
          ${stomata === 'open' ? (rate > 20 ? '<strong>მაღალი აორთქლება:</strong> მშრალი ჰაერი და ქარი აჩქარებს წყლის გამოყოფას.' : 'ზომიერი აორთქლება.') : '<span style="color:#ef4444;">ბაგეები დახურულია:</span> წყლის აორთქლება თითქმის შეწყვეტილია (მცენარე იცავს თავს გაუწყლოებისგან).'}
        `;
      }

      if (state.running) {
        requestAnimationFrame(loop);
      }
    };

    state.draw = loop;
    loop();
  },

  // --------------------------------------------------------------------------
  // 9. FOOD WEB SIMULATION
  // --------------------------------------------------------------------------
  initFoodWebSim(simId, canvas, ctx, state) {
    const draw = () => {
      const wolves = parseInt(document.getElementById(`${simId}-wolvesCount`)?.value || '5', 10);
      const rabbits = parseInt(document.getElementById(`${simId}-rabbitsCount`)?.value || '30', 10);
      const grass = parseInt(document.getElementById(`${simId}-grassLevel`)?.value || '80', 10);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Landscape: Sky & Grassland
      const grassHeight = (grass / 100) * 120;
      ctx.fillStyle = `rgb(${Math.floor(20 + (100 - grass) * 1.5)}, ${Math.floor(120 * (grass / 100))}, 30)`;
      ctx.fillRect(0, canvas.height - grassHeight, canvas.width, grassHeight);

      // Draw Rabbits
      for (let r = 0; r < Math.min(rabbits, 40); r++) {
        const rx = (r * 15 + 20) % (canvas.width - 40);
        const ry = canvas.height - 25 - (r % 3) * 12;
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.ellipse(rx, ry, 9, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        // Ears
        ctx.fillRect(rx + 4, ry - 10, 2, 7);
        ctx.fillRect(rx + 7, ry - 10, 2, 7);
      }

      // Draw Wolves
      for (let w = 0; w < Math.min(wolves, 12); w++) {
        const wx = (w * 50 + 40) % (canvas.width - 60);
        const wy = canvas.height - 50 - (w % 2) * 15;
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.ellipse(wx, wy, 18, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        // Wolf Head & Ears
        ctx.beginPath();
        ctx.arc(wx + 16, wy - 4, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ecological Bar Charts
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px system-ui';
      ctx.fillText(`🌿 მცენარეები (ბალახი): ${grass}%`, 20, 30);
      ctx.fillText(`🐇 ბალახისმჭამელები: ${rabbits} ინდივიდი`, 20, 50);
      ctx.fillText(`🐺 მტაცებლები: ${wolves} ინდივიდი`, 20, 70);

      const outElem = document.getElementById(`${simId}-output-text`);
      if (outElem) {
        if (wolves === 0 && rabbits > 40) {
          outElem.innerHTML = `<strong>⚠️ ეკოლოგიური კოლაფსი (მტაცებლების გარეშე):</strong> კურდღლები უკონტროლოდ გამრავლდნენ და მთელი ბალახი გადაჭამეს. საკვების ამოწურვა მათ მასობრივ შიმშილს გამოიწვევს.`;
        } else if (grass < 30) {
          outElem.innerHTML = `<strong>⚠️ გვალვა / საკვების დეფიციტი:</strong> მცენარეების კლება გამოიწვევს ბალახისმჭამელების რიცხოვნობის მკვეთრ შემცირებას.`;
        } else {
          outElem.innerHTML = `<strong>⚖️ ბუნებრივი ბალანსი:</strong> მტაცებლები არეგულირებენ ბალახისმჭამელების რაოდენობას, რაც იცავს მცენარეულ საფარს გადაძოვისგან.`;
        }
      }
    };

    state.draw = draw;
    draw();
  },

  // --------------------------------------------------------------------------
  // 10. TAXONOMY KEY SIMULATION
  // --------------------------------------------------------------------------
  initTaxonomySim(simId, canvas, ctx, state) {
    const draw = () => {
      const specimen = document.getElementById(`${simId}-specimen`)?.value || 'wolf';

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let data = {
        name: 'რუხი მგელი',
        kingdom: 'ცხოველები (Animalia)',
        phylum: 'ქორდიანები (Chordata)',
        class: 'ძუძუმწოვრები (Mammalia)',
        order: 'მტაცებლები (Carnivora)',
        family: 'ძაღლისებრნი (Canidae)',
        genus: 'ძაღლი (Canis)',
        species: 'Canis lupus (რუხი მგელი)',
        icon: '🐺'
      };

      if (specimen === 'amanita') {
        data = {
          name: 'ცადამაყვანა (სოკო)',
          kingdom: 'სოკოები (Fungi)',
          phylum: 'ბაზიდიუმიანი სოკოები',
          class: 'აგარიკომიცეტები',
          order: 'აგარიკალები',
          family: 'ამანიტასებრნი',
          genus: 'ამანიტა (Amanita)',
          species: 'Amanita muscaria (წითელი ცადამაყვანა)',
          icon: '🍄'
        };
      } else if (specimen === 'euglena') {
        data = {
          name: 'მწვანე ევგლენა',
          kingdom: 'უმარტივესები (Protista)',
          phylum: 'ევგლენასნაირნი',
          class: 'ევგლენოიდები',
          order: 'ევგლენალები',
          family: 'ევგლენასებრნი',
          genus: 'ევგლენა (Euglena)',
          species: 'Euglena viridis (მწვანე ევგლენა)',
          icon: '🔬'
        };
      } else if (specimen === 'ecoli') {
        data = {
          name: 'ნაწლავის ჩხირი',
          kingdom: 'ბაქტერიები (Bacteria)',
          phylum: 'პროტეობაქტერიები',
          class: 'გამაპროტეობაქტერიები',
          order: 'ენტერობაქტერიალები',
          family: 'ენტერობაქტერიასებრნი',
          genus: 'ეშერიხია (Escherichia)',
          species: 'Escherichia coli (ნაწლავის ჩხირი)',
          icon: '🧫'
        };
      }

      // Draw Taxonomy Passport on Canvas
      ctx.fillStyle = '#1e293b';
      ctx.roundRect(40, 20, 520, 340, 12);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px system-ui';
      ctx.fillText(`${data.icon} სისტემატიკური პასპორტი: ${data.name}`, 60, 55);

      const items = [
        ['სამეფო (Kingdom):', data.kingdom],
        ['ტიპი / განყოფილება:', data.phylum],
        ['კლასი (Class):', data.class],
        ['რიგი (Order):', data.order],
        ['ოჯახი (Family):', data.family],
        ['გვარი (Genus):', data.genus],
        ['სახეობა (Species):', data.species]
      ];

      items.forEach(([lbl, val], idx) => {
        const y = 95 + idx * 35;
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 12px system-ui';
        ctx.fillText(lbl, 70, y);

        ctx.fillStyle = idx === 6 ? '#4ade80' : '#f8fafc';
        ctx.font = idx === 6 ? 'bold 14px system-ui' : '13px system-ui';
        ctx.fillText(val, 240, y);
      });

      const outElem = document.getElementById(`${simId}-output-text`);
      if (outElem) {
        outElem.innerHTML = `
          <strong>ბინარული ნომენკლატურა (კარლ ლინე):</strong><br>
          სახეობის სამეცნიერო სახელწოდებაა <em>${data.species}</em>. პირველი სიტყვა აღნიშნავს <strong>გვარს</strong> (დიდი ასოთი), მეორე კი — <strong>სახეობის ეპითეტს</strong>.
        `;
      }
    };

    state.draw = draw;
    draw();
  },

  // --------------------------------------------------------------------------
  // 11. YEAST FERMENTATION SIMULATION
  // --------------------------------------------------------------------------
  initYeastSim(simId, canvas, ctx, state) {
    state.balloonRadius = 20;

    const loop = () => {
      if (!document.getElementById(simId)) return;
      const sugar = parseInt(document.getElementById(`${simId}-sugar`)?.value || '30', 10);
      const temp = document.getElementById(`${simId}-waterTemp`)?.value || 'warm';

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;

      // Flask body
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(cx - 30, 160);
      ctx.lineTo(cx + 30, 160);
      ctx.lineTo(cx + 90, 320);
      ctx.lineTo(cx - 90, 320);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Yeast + Sugar liquid
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath();
      ctx.moveTo(cx - 75, 280);
      ctx.lineTo(cx + 75, 280);
      ctx.lineTo(cx + 86, 316);
      ctx.lineTo(cx - 86, 316);
      ctx.closePath();
      ctx.fill();

      // Fermentation logic
      let maxBalloon = 20;
      let bubbling = false;
      if (temp === 'warm' && sugar > 0) {
        maxBalloon = sugar === 30 ? 65 : 45;
        bubbling = true;
      }

      if (state.running) {
        if (state.balloonRadius < maxBalloon) state.balloonRadius += 0.4;
        if (state.balloonRadius > maxBalloon) state.balloonRadius -= 0.4;
      }

      // Draw Balloon on flask neck
      ctx.beginPath();
      ctx.ellipse(cx, 160 - state.balloonRadius, state.balloonRadius * 0.9, state.balloonRadius, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bubbles in liquid
      if (bubbling && state.running) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let b = 0; b < 10; b++) {
          const bx = cx + (Math.random() - 0.5) * 120;
          const by = 280 + Math.random() * 35;
          ctx.beginPath();
          ctx.arc(bx, by, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Equation banner
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 12px system-ui';
      ctx.fillText('C6H12O6 (შაქარი) ➔ 2 C2H5OH (სპირტი) + 2 CO2 (აირი) + ენერგია', cx - 180, 40);

      const outElem = document.getElementById(`${simId}-output-text`);
      if (outElem) {
        if (temp === 'warm' && sugar > 0) {
          outElem.innerHTML = `<strong>აქტიური ალკოჰოლური დუღილი:</strong> საფუარი შლის შაქარს, წარმოქმნის CO2 აირს, რომელიც საჰაერო ბუშტს ბერავს. სწორედ ეს აირი აფუებს ცომს!`;
        } else if (temp === 'hot') {
          outElem.innerHTML = `<strong>♨️ 90°C (მდუღარე წყალი):</strong> საფუარას ცოცხალი უჯრედები დაიღუპა; დუღილი არ მიმდინარეობს.`;
        } else {
          outElem.innerHTML = `დუღილი შეჩერებულია (სიცივის ან შაქრის არარსებობის გამო).`;
        }
      }

      if (state.running) {
        requestAnimationFrame(loop);
      }
    };

    state.draw = loop;
    loop();
  },

  // --------------------------------------------------------------------------
  // 12. MOLD GROWTH SIMULATION
  // --------------------------------------------------------------------------
  initMoldSim(simId, canvas, ctx, state) {
    const draw = () => {
      const moisture = document.querySelector(`input[name="${simId}-moisture"]:checked`)?.value || 'wet';
      const storage = document.getElementById(`${simId}-storage`)?.value || 'warm_bag';
      const day = parseInt(document.getElementById(`${simId}-day`)?.value || '0', 10);
      const zoom = document.getElementById(`${simId}-zoomMode`)?.checked || false;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      let growthLevel = 0;
      if (moisture === 'wet' && storage === 'warm_bag') {
        growthLevel = day; // 0 to 7
      } else if (moisture === 'wet' && storage === 'open_dry') {
        growthLevel = Math.floor(day * 0.4);
      } else if (storage === 'fridge') {
        growthLevel = Math.floor(day * 0.15);
      }

      if (!zoom) {
        // Draw Bread Slice
        ctx.fillStyle = '#d97706';
        ctx.roundRect(cx - 140, cy - 110, 280, 220, 16);
        ctx.fill();
        ctx.fillStyle = '#fef3c7';
        ctx.roundRect(cx - 125, cy - 95, 250, 190, 12);
        ctx.fill();

        // Mold Mycelium patches
        if (growthLevel > 1) {
          const patchCount = growthLevel * 12;
          ctx.fillStyle = 'rgba(241, 245, 249, 0.75)'; // White mycelium
          for (let p = 0; p < patchCount; p++) {
            const px = cx - 90 + ((p * 37) % 180);
            const py = cy - 70 + ((p * 53) % 140);
            ctx.beginPath();
            ctx.arc(px, py, 12 + (growthLevel * 2), 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Black Sporangia pinheads
        if (growthLevel >= 4) {
          ctx.fillStyle = '#020617';
          const pinCount = (growthLevel - 3) * 35;
          for (let s = 0; s < pinCount; s++) {
            const sx = cx - 80 + ((s * 23) % 160);
            const sy = cy - 60 + ((s * 41) % 120);
            ctx.beginPath();
            ctx.arc(sx, sy, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px system-ui';
        ctx.fillText(`დღე: ${day} / 7`, cx - 35, cy + 135);

      } else {
        // Microscopic Zoom View of Mucor
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Circular microscope field
        ctx.beginPath();
        ctx.arc(cx, cy, 140, 0, Math.PI * 2);
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#475569';
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, 140, 0, Math.PI * 2);
        ctx.clip();

        // Branching white hyphae
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3;
        for (let h = -2; h <= 2; h++) {
          ctx.beginPath();
          ctx.moveTo(cx + h * 40, cy + 120);
          ctx.lineTo(cx + h * 30, cy);
          ctx.lineTo(cx + h * 45, cy - 60);
          ctx.stroke();

          // Black round sporangium on top
          ctx.beginPath();
          ctx.arc(cx + h * 45, cy - 60, 16, 0, Math.PI * 2);
          ctx.fillStyle = '#020617';
          ctx.fill();
          ctx.strokeStyle = '#94a3b8';
          ctx.stroke();
        }

        ctx.restore();
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px system-ui';
        ctx.fillText('მიკროსკოპული ხედი: მუკორის ჰიფები და სპორანგიუმები („თავთავები“)', 60, 30);
      }

      const outElem = document.getElementById(`${simId}-output-text`);
      if (outElem) {
        if (growthLevel >= 5) {
          outElem.innerHTML = `<strong>დღე ${day}: სრული ობი!</strong> თეთრი მიცელიუმის თავზე მომწიფდა ათასობით შავი <strong>სპორანგიუმი</strong>, საიდანაც სპორები ჰაერში იფრქვევა.`;
        } else if (growthLevel >= 2) {
          outElem.innerHTML = `<strong>დღე ${day}: მიცელიუმის ზრდა:</strong> პურის ზედაპირზე გაჩნდა თეთრი ფაფუკი ნადები (სოკოს ჰიფების ქსელი).`;
        } else {
          outElem.innerHTML = `<strong>დღე ${day}:</strong> ობის ნიშნები ჯერ არ შეიმჩნევა (ან პირობები არახელსაყრელია: სიმშრალე/სიცივე).`;
        }
      }
    };

    state.draw = draw;
    draw();
  }
};