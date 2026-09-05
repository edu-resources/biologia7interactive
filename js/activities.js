// ქიმია VII კლასი — მოსწავლის ინტერაქტიული სავარჯიშოები და თამაშები
// სრულად გაწმენდილია მასწავლებლისა და QR კოპირების ღილაკებისგან

const PHENOMENA_ITEMS = [
  { text: "ყინულის დნობა და წყლად ქცევა", type: "physical", explain: "იცვლება მხოლოდ აგრეგატული მდგომარეობა, მოლეკულა H₂O უცვლელი რჩება." },
  { text: "რკინის ლურსმნის დაჟანგვა ჰაერზე", type: "chemical", explain: "რკინა ურთიერთქმედებს ჟანგბადთან და ტენთან, წარმოიქმნება ახალი ნივთიერება — ჟანგი (Fe₂O₃·nH₂O)." },
  { text: "ხის მორის დაწვა და ნაცრად ქცევა", type: "chemical", explain: "წვის დროს ორგანული ნივთიერებები გარდაიქმნება ნახშირორჟანგად, წყლად და ნაცრად." },
  { text: "შაქრის დაფქვა შაქრის პუდრად", type: "physical", explain: "იცვლება მხოლოდ ნაწილაკების ზომა, ნივთიერება რჩება შაქრად (საქაროზა)." },
  { text: "სუნამოს სუნის გავრცელება ოთახში (აორთქლება)", type: "physical", explain: "სითხე გარდაიქმნება ორთქლად, ქიმიური შედგენილობა არ იცვლება." },
  { text: "რძის დამჟავება და ხაჭოს წარმოქმნა", type: "chemical", explain: "ბაქტერიების მოქმედებით რძის შაქარი გარდაიქმნება რძემჟავად (ახალი ნივთიერება სუნითა და გემოთი)." },
  { text: "მინის ჭიქის გატეხვა", type: "physical", explain: "იცვლება მხოლოდ საგნის ფორმა და მთლიანობა, მინა იგივე ნივთიერებაა." },
  { text: "ვერცხლის კოვზის გამუქება ჰაერზე", type: "chemical", explain: "ვერცხლი ურთიერთქმედებს ჰაერში არსებულ გოგირდოვან ნაერთებთან და წარმოიქმნება შავი Ag₂S." }
];

const SUBSTANCES_ITEMS = [
  { text: "გამოხდილი (დისტილირებული) წყალი", type: "pure", explain: "შედგება მხოლოდ H₂O მოლეკულებისგან, მინარევების გარეშე." },
  { text: "ზღვის წყალი", type: "mixture", explain: "შეიცავს წყალს, გახსნილ მარილებს (NaCl, MgCl₂ და სხვ.) და აირებს." },
  { text: "სუფთა რკინა (Fe)", type: "pure", explain: "შედგება მხოლოდ რკინის ატომებისგან." },
  { text: "ატმოსფერული ჰაერი", type: "mixture", explain: "აირთა ბუნებრივი ნარევია (78% აზოტი, 21% ჟანგბადი, 0.9% არგონი, CO₂ და სხვ.)." },
  { text: "სუფრის შაქარი (საქაროზა C₁₂H₂₂O₁₁)", type: "pure", explain: "ერთი კონკრეტული ქიმიური ნაერთია მუდმივი შედგენილობით." },
  { text: "გრანიტის ქვა", type: "mixture", explain: "არაერთგვაროვანი ნარევია (კვარცი, მინდვრის შპატი, ქარსი)." },
  { text: "სუფთა ჟანგბადი (O₂)", type: "pure", explain: "მარტივი სუფთა ნივთიერებაა." },
  { text: "შავი ჩაის ნაყენი", type: "mixture", explain: "წყლის, მთრიმლავი ნივთიერებების, კოფეინისა და ეთერზეთების ნარევია." }
];

const MIXTURE_TYPES_ITEMS = [
  { text: "შაქრის გამჭვირვალე წყალხსნარი", type: "homo", explain: "ერთგვაროვანია: შაქრის მოლეკულები თანაბრადაა განაწილებული წყალში." },
  { text: "ქვიშიანი წყალი", type: "hetero", explain: "არაერთგვაროვანია (სუსპენზია): ქვიშის მარცვლები თვალითაც კარგად ჩანს." },
  { text: "ძროხის რძე", type: "hetero", explain: "არაერთგვაროვანია (ემულსია): ცხიმის უმცირესი წვეთები შეტივტივებულია წყალხსნარში." },
  { text: "სუფთა გაფილტრული ჰაერი", type: "homo", explain: "ერთგვაროვანი აირთა ნარევია." },
  { text: "მცენარეული ზეთისა და წყლის ნარევი", type: "hetero", explain: "არაერთგვაროვანია (ემულსია): ზეთი არ იხსნება წყალში და ტივტივებს ზედაპირზე." },
  { text: "ბრინჯაოს შენადნობი (სპილენძი და კალა)", type: "homo", explain: "ერთგვაროვანი მყარი ხსნარია." },
  { text: "ნისლი (ჰაერში შეტივტივებული წყლის წვეთები)", type: "hetero", explain: "არაერთგვაროვანია (აეროზოლი)." }
];

const SEPARATION_SCENARIOS = [
  {
    mixture: "წყალი და ქვიშა",
    correct: "filtration",
    options: [
      { id: "filtration", text: "გაფილტვრა (ფილტრაცია)", correct: true, why: "ქვიშა უხსნადია წყალში და რჩება ფილტრის ქაღალდზე." },
      { id: "distillation", text: "დისტილაცია", correct: false, why: "დისტილაცია ენერგოტევადია და ზედმეტია უხსნადი ქვიშისთვის." },
      { id: "magnetic", text: "მაგნიტით გამოყოფა", correct: false, why: "ქვიშა მაგნიტური არ არის." }
    ]
  },
  {
    mixture: "წყალი და სუფრის მარილი (მარილის მიღება)",
    correct: "evaporation",
    options: [
      { id: "filtration", text: "გაფილტვრა", correct: false, why: "მარილი წყალში გახსნილია და ფილტრის ფორებში თავისუფლად გაივლის." },
      { id: "evaporation", text: "აორთქლება და კრისტალიზაცია", correct: true, why: "წყალი ორთქლდება, ფსკერზე კი რჩება სუფთა მარილის კრისტალები." },
      { id: "magnetic", text: "მაგნიტით გამოყოფა", correct: false, why: "მარილი არ მიიზიდება მაგნიტით." }
    ]
  },
  {
    mixture: "რკინის ნაქლიბი და გოგირდის ფხვნილი",
    correct: "magnetic",
    options: [
      { id: "magnetic", text: "მაგნიტური სეპარაცია", correct: true, why: "რკინა ფერომაგნიტია და მაგნიტს მიეკვრება, გოგირდი კი ადგილზე დარჩება." },
      { id: "evaporation", text: "აორთქლება", correct: false, why: "ორივე მყარი ნივთიერებაა და არცერთი არ არის სითხეში გახსნილი." },
      { id: "filtration", text: "გაფილტვრა", correct: false, why: "სითხის გარეშე გაფილტვრა შეუძლებელია." }
    ]
  },
  {
    mixture: "წყალი და ეთილის სპირტი",
    correct: "distillation",
    options: [
      { id: "distillation", text: "დისტილაცია (გამოხდა)", correct: true, why: "სპირტი დუღს 78 °C-ზე, წყალი 100 °C-ზე — დუღილის სხვაობით სპირტი პირველი აორთქლდება და მაცივარში გაცივდება." },
      { id: "filtration", text: "გაფილტვრა", correct: false, why: "ორივე სითხე სრულად ერევა ერთმანეთს და ერთგვაროვან ხსნარს ქმნის." },
      { id: "decantation", text: "დალექვა და დეკანტაცია", correct: false, why: "სპირტი წყალში არ ილექება." }
    ]
  }
];

const Activities = {
  // სავარჯიშოების მთავარი კატალოგი — დაჯგუფებული 8 კატეგორიად
  renderList(c) {
    c.innerHTML = `
      <div class="sim-catalog-header">
        <h1>🎮 ინტერაქტიული სავარჯიშოები და თამაშები</h1>
        <p style="color:var(--text-muted); font-size:1rem;">შეამოწმე ცოდნა სახალისო თამაშებით, ფორმულების კონსტრუქტორითა და კალკულატორით (8 თემატური კატეგორია)</p>
      </div>

      <div class="activity-categories-list">
        <!-- 1. ნივთიერებების კლასიფიკაცია -->
        <section class="activity-category-section">
          <div class="activity-category-header">
            <span class="activity-category-icon">🧪</span>
            <div>
              <h2 class="activity-category-title">1. ნივთიერებების კლასიფიკაცია</h2>
              <div class="activity-category-desc">სუფთა ნივთიერებები, ნარევები, მარტივი და რთული ნაერთები</div>
            </div>
          </div>
          <div class="activity-cards-grid">
            <div class="activity-card">
              <span class="badge-tag">სავარჯიშო</span>
              <h3 class="activity-card-title">„სუფთა ნივთიერება თუ ნარევი?“</h3>
              <p class="activity-card-desc">დაახარისხე 8 ყოველდღიური ნივთიერება (გამოხდილი წყალი, ზღვის წყალი, ჰაერი, შაქარი, გრანიტი) სწორი განმარტებებით.</p>
              <a href="#activity-substances" class="btn btn-primary btn-sm">▶️ დაწყება</a>
            </div>
            <div class="activity-card">
              <span class="badge-tag">თეორია &amp; მოდელი</span>
              <h3 class="activity-card-title">„მარტივი და რთული ნივთიერებები“</h3>
              <p class="activity-card-desc">გაეცანი ალოტროპიას (ალმასი და გრაფიტი; O₂ და O₃) და პრუსტის მუდმივი შედგენილობის კანონს.</p>
              <a href="#topic-1-9" class="btn btn-secondary btn-sm">📖 თემის გახსნა</a>
            </div>
          </div>
        </section>

        <!-- 2. ფიზიკური და ქიმიური მოვლენები -->
        <section class="activity-category-section">
          <div class="activity-category-header">
            <span class="activity-category-icon">🔥</span>
            <div>
              <h2 class="activity-category-title">2. ფიზიკური და ქიმიური მოვლენები</h2>
              <div class="activity-category-desc">ნივთიერებათა გარდაქმნები, აგრეგატული ცვლილებები და რეაქციის ნიშნები</div>
            </div>
          </div>
          <div class="activity-cards-grid">
            <div class="activity-card">
              <span class="badge-tag">თამაში-ტესტი</span>
              <h3 class="activity-card-title">„ქიმიური თუ ფიზიკური მოვლენა?“</h3>
              <p class="activity-card-desc">გაარჩიე ერთმანეთისგან დნობა, ჟანგვა, წვა, დაფქვა და დამჟავება მყისიერი შემოწმებით.</p>
              <a href="#activity-phenomena" class="btn btn-primary btn-sm">▶️ დაწყება</a>
            </div>
            <div class="activity-card">
              <span class="badge-tag">სიმულაცია</span>
              <h3 class="activity-card-title">„ქიმიური გარდაქმნის ინდიკატორები“</h3>
              <p class="activity-card-desc">დააკვირდი აირის გამოყოფას, ფერის შეცვლას, ნალექსა და სითბოს გამოყოფას ლაბორატორიაში.</p>
              <a href="#exp-changes" class="btn btn-secondary btn-sm">🧪 ექსპერიმენტი</a>
            </div>
          </div>
        </section>

        <!-- 3. ნარევები და მათი დაყოფა -->
        <section class="activity-category-section">
          <div class="activity-category-header">
            <span class="activity-category-icon">⚗️</span>
            <div>
              <h2 class="activity-category-title">3. ნარევები და მათი დაყოფა</h2>
              <div class="activity-category-desc">ჰომოგენური და ჰეტეროგენული სისტემები, დაყოფის 6 ლაბორატორიული მეთოდი</div>
            </div>
          </div>
          <div class="activity-cards-grid">
            <div class="activity-card">
              <span class="badge-tag">სავარჯიშო</span>
              <h3 class="activity-card-title">„ერთგვაროვანი თუ არაერთგვაროვანი?“</h3>
              <p class="activity-card-desc">გაარჩიე ერთმანეთისგან ხსნარები, სუსპენზიები, ემულსიები და აეროზოლები.</p>
              <a href="#activity-mixtures" class="btn btn-primary btn-sm">▶️ დაწყება</a>
            </div>
            <div class="activity-card">
              <span class="badge-tag">პრაქტიკული ამოცანა</span>
              <h3 class="activity-card-title">„ნარევის დაყოფის მეთოდის შემრჩევი“</h3>
              <p class="activity-card-desc">შეარჩიე სწორი მეთოდი: გაფილტვრა, აორთქლება, დისტილაცია თუ მაგნიტური გამოყოფა.</p>
              <a href="#activity-separation" class="btn btn-primary btn-sm">▶️ დაწყება</a>
            </div>
          </div>
        </section>

        <!-- 4. ნაწილაკების მოდელები -->
        <section class="activity-category-section">
          <div class="activity-category-header">
            <span class="activity-category-icon">🔬</span>
            <div>
              <h2 class="activity-category-title">4. ნაწილაკების მოდელები</h2>
              <div class="activity-category-desc">ატომები, მოლეკულები, იონები და ნაწილაკების მოძრაობა ფაზებში</div>
            </div>
          </div>
          <div class="activity-cards-grid">
            <div class="activity-card">
              <span class="badge-tag">კვლევითი მოდელი</span>
              <h3 class="activity-card-title">„ნაწილაკების მოდელი და აგრეგატული მდგომარეობა“</h3>
              <p class="activity-card-desc">მართე ტემპერატურა -20°C-დან 120°C-მდე და დააკვირდი ნაწილაკებს მყარ, თხევად და აირად ფაზებში.</p>
              <a href="#exp-particles" class="btn btn-primary btn-sm">🔬 კვლევა ▶️</a>
            </div>
            <div class="activity-card">
              <span class="badge-tag">მოლეკულური დინამიკა</span>
              <h3 class="activity-card-title">„დიფუზია ტემპერატურისა და კონცენტრაციის მიხედვით“</h3>
              <p class="activity-card-desc">შეისწავლე ნაწილაკების ქაოსური შერევის სიჩქარე ცივ და ცხელ წყალში მორევით.</p>
              <a href="#exp-diffusion" class="btn btn-secondary btn-sm">🔬 კვლევა ▶️</a>
            </div>
          </div>
        </section>

        <!-- 5. ქიმიური სიმბოლოები -->
        <section class="activity-category-section">
          <div class="activity-category-header">
            <span class="activity-category-icon">🔤</span>
            <div>
              <h2 class="activity-category-title">5. ქიმიური სიმბოლოები</h2>
              <div class="activity-category-desc">ქიმიურ ელემენტთა სახელწოდებები, სიმბოლოები და ბერცელიუსის სისტემა</div>
            </div>
          </div>
          <div class="activity-cards-grid">
            <div class="activity-card">
              <span class="badge-tag">ინტერაქტიული ბაზა</span>
              <h3 class="activity-card-title">„ქიმიურ ელემენტთა სიმბოლოები და წარმოთქმა“</h3>
              <p class="activity-card-desc">H, O, C, N, Fe, Cu, Au, Ag, Cl, Na, Ca, Al — ლათინური სახელწოდებები და ქართული შესატყვისები.</p>
              <a href="#activity-symbols" class="btn btn-primary btn-sm">▶️ გახსნა</a>
            </div>
            <div class="activity-card">
              <span class="badge-tag">თეორია</span>
              <h3 class="activity-card-title">„ქიმიური ელემენტი და ქიმიური ფორმულა“</h3>
              <p class="activity-card-desc">ინდექსისა და კოეფიციენტის როლი ნივთიერების შედგენილობის გამოსახვაში.</p>
              <a href="#topic-1-9" class="btn btn-secondary btn-sm">📖 თემის გახსნა</a>
            </div>
          </div>
        </section>

        <!-- 6. ფორმულები -->
        <section class="activity-category-section">
          <div class="activity-category-header">
            <span class="activity-category-icon">📐</span>
            <div>
              <h2 class="activity-category-title">6. ფორმულები</h2>
              <div class="activity-category-desc">ვალენტობა, ფორმულების შედგენა, Mr და მასური წილის (w%) გამოთვლა</div>
            </div>
          </div>
          <div class="activity-cards-grid">
            <div class="activity-card">
              <span class="badge-tag">კონსტრუქტორი</span>
              <h3 class="activity-card-title">„ვალენტობისა და ფორმულების კონსტრუქტორი“</h3>
              <p class="activity-card-desc">შეადგინე ქიმიური ფორმულები უმცირესი საერთო ჯერადის წესით (Al₂O₃, CaO, KCl, P₂O₅).</p>
              <a href="#activity-valence-builder" class="btn btn-primary btn-sm">🧩 აწყობა</a>
            </div>
            <div class="activity-card">
              <span class="badge-tag">კალკულატორი</span>
              <h3 class="activity-card-title">„Mr და მასური წილის (w%) კალკულატორი“</h3>
              <p class="activity-card-desc">გამოთვალე მოლეკულური მასა და თითოეული ელემენტის პროცენტული წილი ნაერთში.</p>
              <a href="#activity-mr-calculator" class="btn btn-primary btn-sm">🧮 გამოთვლა</a>
            </div>
            <div class="activity-card">
              <span class="badge-tag">წესები</span>
              <h3 class="activity-card-title">„როგორ იწერება და იკითხება ქიმიური ფორმულა?“</h3>
              <p class="activity-card-desc">საერთაშორისო წესები: H₂O — „ჰაშ-ორი-ო“, H₂SO₄ — „ჰაშ-ორი-ეს-ო-ოთხი“.</p>
              <a href="#activity-formula-reader" class="btn btn-secondary btn-sm">📖 წაკითხვა</a>
            </div>
          </div>
        </section>

        <!-- 7. ლაბორატორიული ხელსაწყოები -->
        <section class="activity-category-section">
          <div class="activity-category-header">
            <span class="activity-category-icon">🧪</span>
            <div>
              <h2 class="activity-category-title">7. ლაბორატორიული ხელსაწყოები</h2>
              <div class="activity-category-desc">ქიმიური ჭურჭელი, საზომი მოწყობილობები და მათი დანიშნულება (დანართი 1, გვ. 100–101)</div>
            </div>
          </div>
          <div class="activity-cards-grid">
            <div class="activity-card">
              <span class="badge-tag">ტრენაჟორი</span>
              <h3 class="activity-card-title">„ლაბორატორიული ჭურჭლის ამოცნობა“</h3>
              <p class="activity-card-desc">სინჯარა, ერლენმეიერის კოლბა, საზომი ცილინდრი, ძაბრი, პიპეტი, სპირტქურა, როდინი და ფაიფურის ჯამი.</p>
              <a href="#activity-glassware-quiz" class="btn btn-primary btn-sm">▶️ ამოცნობა</a>
            </div>
          </div>
        </section>

        <!-- 8. უსაფრთხოება -->
        <section class="activity-category-section">
          <div class="activity-category-header">
            <span class="activity-category-icon">🛡️</span>
            <div>
              <h2 class="activity-category-title">8. უსაფრთხოება</h2>
              <div class="activity-category-desc">უსაფრთხოების 14 ოქროს წესი, ინდივიდუალური დაცვა და GHS პიქტოგრამები</div>
            </div>
          </div>
          <div class="activity-cards-grid">
            <div class="activity-card">
              <span class="badge-tag">სიტუაციური სიმულატორი</span>
              <h3 class="activity-card-title">„უსაფრთხოების წესები და PPE სიმულატორი“</h3>
              <p class="activity-card-desc">დამცავი სათვალე, სინჯარის გაცხელების მიმართულება და ოქროს წესი: „ჯერ წყალი და მერე მჟავა!“.</p>
              <a href="#exp-safety-lab" class="btn btn-primary btn-sm">🛡️ სიმულატორი</a>
            </div>
            <div class="activity-card">
              <span class="badge-tag">სრული გზამკვლევი</span>
              <h3 class="activity-card-title">„ლაბორატორიული უსაფრთხოების სრული დაფა“</h3>
              <p class="activity-card-desc">ყველა 14 წესი და 9 საერთაშორისო GHS გამაფრთხილებელი პიქტოგრამა დეტალური განმარტებებით.</p>
              <a href="#safety" class="btn btn-secondary btn-sm">🛡️ გახსნა</a>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  // კონკრეტული სავარჯიშოს დეტალური ხედი
  renderDetail(c, actId) {
    if (actId === "activity-phenomena") {
      this.renderPhenomenaGame(c);
    } else if (actId === "activity-substances") {
      this.renderSubstancesGame(c);
    } else if (actId === "activity-mixtures") {
      this.renderMixturesGame(c);
    } else if (actId === "activity-separation") {
      this.renderSeparationGame(c);
    } else if (actId === "activity-valence-builder" || actId === "activity-valence") {
      this.renderValenceBuilder(c);
    } else if (actId === "activity-mr-calculator" || actId === "activity-calc") {
      this.renderMrCalculator(c);
    } else if (actId === "activity-glassware-quiz" || actId === "activity-glassware") {
      this.renderGlasswareQuiz(c);
    } else if (actId === "activity-formula-reader") {
      this.renderFormulaReader(c);
    } else if (actId === "activity-symbols") {
      this.renderSymbolsActivity(c);
    } else {
      this.renderList(c);
    }
  },

  // 1. ქიმიური თუ ფიზიკური მოვლენა
  renderPhenomenaGame(c) {
    let html = `
      <div class="module-view">
        <div class="module-header">
          <div class="module-meta">
            <span class="badge-tag">სავარჯიშო</span>
            <span class="page-badge">გვ. 6–28</span>
          </div>
          <h1 class="module-title">„ქიმიური თუ ფიზიკური მოვლენა?“</h1>
          <div class="module-actions">
            <a href="#activities" class="btn btn-secondary btn-sm" style="color:var(--text-main);">← სავარჯიშოების სია</a>
          </div>
        </div>

        <p style="margin-bottom:1.5rem; font-size:1.05rem; color:var(--text-muted);">
          გააანალიზე თითოეული მოვლენა: წარმოიქმნება ახალი ნივთიერება (ქიმიური მოვლენა) თუ იცვლება მხოლოდ ფორმა ან მდგომარეობა (ფიზიკური მოვლენა)?
        </p>

        <div style="display:flex; flex-direction:column; gap:1rem;">
    `;

    PHENOMENA_ITEMS.forEach((item, idx) => {
      html += `
        <div class="card" id="phenom-card-${idx}">
          <div style="font-size:1.05rem; font-weight:700; margin-bottom:0.75rem;">${idx + 1}. ${item.text}</div>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <button class="btn btn-sm btn-outline" onclick="Activities.checkPhenomAnswer(${idx}, 'physical')" id="pbtn-${idx}-physical">🔵 ფიზიკური მოვლენა</button>
            <button class="btn btn-sm btn-outline" onclick="Activities.checkPhenomAnswer(${idx}, 'chemical')" id="pbtn-${idx}-chemical">🔴 ქიმიური მოვლენა</button>
          </div>
          <div class="feedback-banner" id="pexp-${idx}" style="margin-top:0.75rem;">
            <strong>განმარტება:</strong> ${item.explain}
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    c.innerHTML = html;
  },

  checkPhenomAnswer(idx, chosenType) {
    const item = PHENOMENA_ITEMS[idx];
    const btnPhys = document.getElementById(`pbtn-${idx}-physical`);
    const btnChem = document.getElementById(`pbtn-${idx}-chemical`);
    const exp = document.getElementById(`pexp-${idx}`);
    if (!btnPhys || !btnChem || !exp) return;

    btnPhys.disabled = true;
    btnChem.disabled = true;

    if (item.type === chosenType) {
      if (chosenType === "physical") btnPhys.classList.add("btn-success");
      else btnChem.classList.add("btn-success");
      exp.classList.add("show", "success");
      AppState.markActivityComplete(`phenom-${idx}`);
    } else {
      if (chosenType === "physical") btnPhys.classList.add("btn-danger");
      else btnChem.classList.add("btn-danger");
      if (item.type === "physical") btnPhys.classList.add("btn-success");
      else btnChem.classList.add("btn-success");
      exp.classList.add("show", "warning");
    }
  },

  // 2. სუფთა ნივთიერება თუ ნარევი
  renderSubstancesGame(c) {
    let html = `
      <div class="module-view">
        <div class="module-header">
          <div class="module-meta">
            <span class="badge-tag">სავარჯიშო</span>
            <span class="page-badge">გვ. 48, 70</span>
          </div>
          <h1 class="module-title">„სუფთა ნივთიერება თუ ნარევი?“</h1>
          <div class="module-actions">
            <a href="#activities" class="btn btn-secondary btn-sm" style="color:var(--text-main);">← სავარჯიშოების სია</a>
          </div>
        </div>

        <p style="margin-bottom:1.5rem; font-size:1.05rem; color:var(--text-muted);">
          გაარჩიე სუფთა ნივთიერებები (ერთი სახის ნაწილაკები) და ნარევები (რამდენიმე ნივთიერების ერთობლიობა):
        </p>

        <div style="display:flex; flex-direction:column; gap:1rem;">
    `;

    SUBSTANCES_ITEMS.forEach((item, idx) => {
      html += `
        <div class="card" id="subst-card-${idx}">
          <div style="font-size:1.05rem; font-weight:700; margin-bottom:0.75rem;">${idx + 1}. ${item.text}</div>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <button class="btn btn-sm btn-outline" onclick="Activities.checkSubstAnswer(${idx}, 'pure')" id="sbtn-${idx}-pure">💎 სუფთა ნივთიერება</button>
            <button class="btn btn-sm btn-outline" onclick="Activities.checkSubstAnswer(${idx}, 'mixture')" id="sbtn-${idx}-mixture">🥣 ნარევი</button>
          </div>
          <div class="feedback-banner" id="sexp-${idx}" style="margin-top:0.75rem;">
            <strong>განმარტება:</strong> ${item.explain}
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    c.innerHTML = html;
  },

  checkSubstAnswer(idx, chosen) {
    const item = SUBSTANCES_ITEMS[idx];
    const btnP = document.getElementById(`sbtn-${idx}-pure`);
    const btnM = document.getElementById(`sbtn-${idx}-mixture`);
    const exp = document.getElementById(`sexp-${idx}`);
    if (!btnP || !btnM || !exp) return;

    btnP.disabled = true;
    btnM.disabled = true;

    if (item.type === chosen) {
      if (chosen === "pure") btnP.classList.add("btn-success");
      else btnM.classList.add("btn-success");
      exp.classList.add("show", "success");
      AppState.markActivityComplete(`subst-${idx}`);
    } else {
      if (chosen === "pure") btnP.classList.add("btn-danger");
      else btnM.classList.add("btn-danger");
      if (item.type === "pure") btnP.classList.add("btn-success");
      else btnM.classList.add("btn-success");
      exp.classList.add("show", "warning");
    }
  },

  // 3. ჰომოგენური თუ ჰეტეროგენული
  renderMixturesGame(c) {
    let html = `
      <div class="module-view">
        <div class="module-header">
          <div class="module-meta">
            <span class="badge-tag">სავარჯიშო</span>
            <span class="page-badge">გვ. 70–76</span>
          </div>
          <h1 class="module-title">„ერთგვაროვანი (ჰომოგენური) თუ არაერთგვაროვანი (ჰეტეროგენული)?“</h1>
          <div class="module-actions">
            <a href="#activities" class="btn btn-secondary btn-sm" style="color:var(--text-main);">← სავარჯიშოების სია</a>
          </div>
        </div>

        <p style="margin-bottom:1.5rem; font-size:1.05rem; color:var(--text-muted);">
          დაადგინე ნარევის ტიპი: ერთგვაროვანია (ნაწილაკები არ ჩანს) თუ არაერთგვაროვანი (კომპონენტები შესამჩნევია)?
        </p>

        <div style="display:flex; flex-direction:column; gap:1rem;">
    `;

    MIXTURE_TYPES_ITEMS.forEach((item, idx) => {
      html += `
        <div class="card" id="mix-card-${idx}">
          <div style="font-size:1.05rem; font-weight:700; margin-bottom:0.75rem;">${idx + 1}. ${item.text}</div>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <button class="btn btn-sm btn-outline" onclick="Activities.checkMixAnswer(${idx}, 'homo')" id="mbtn-${idx}-homo">🟢 ერთგვაროვანი</button>
            <button class="btn btn-sm btn-outline" onclick="Activities.checkMixAnswer(${idx}, 'hetero')" id="mbtn-${idx}-hetero">🟠 არაერთგვაროვანი</button>
          </div>
          <div class="feedback-banner" id="mexp-${idx}" style="margin-top:0.75rem;">
            <strong>განმარტება:</strong> ${item.explain}
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    c.innerHTML = html;
  },

  checkMixAnswer(idx, chosen) {
    const item = MIXTURE_TYPES_ITEMS[idx];
    const btnHo = document.getElementById(`mbtn-${idx}-homo`);
    const btnHe = document.getElementById(`mbtn-${idx}-hetero`);
    const exp = document.getElementById(`mexp-${idx}`);
    if (!btnHo || !btnHe || !exp) return;

    btnHo.disabled = true;
    btnHe.disabled = true;

    if (item.type === chosen) {
      if (chosen === "homo") btnHo.classList.add("btn-success");
      else btnHe.classList.add("btn-success");
      exp.classList.add("show", "success");
      AppState.markActivityComplete(`mix-${idx}`);
    } else {
      if (chosen === "homo") btnHo.classList.add("btn-danger");
      else btnHe.classList.add("btn-danger");
      if (item.type === "homo") btnHo.classList.add("btn-success");
      else btnHe.classList.add("btn-success");
      exp.classList.add("show", "warning");
    }
  },

  // 4. ნარევის დაყოფის მეთოდი
  renderSeparationGame(c) {
    let html = `
      <div class="module-view">
        <div class="module-header">
          <div class="module-meta">
            <span class="badge-tag">სავარჯიშო</span>
            <span class="page-badge">გვ. 77–87</span>
          </div>
          <h1 class="module-title">„ნარევის დაყოფის მეთოდის შემრჩევი“</h1>
          <div class="module-actions">
            <a href="#activities" class="btn btn-secondary btn-sm" style="color:var(--text-main);">← სავარჯიშოების სია</a>
          </div>
        </div>

        <p style="margin-bottom:1.5rem; font-size:1.05rem; color:var(--text-muted);">
          შეარჩიე ნარევის დაყოფის ყველაზე ეფექტური და მეცნიერულად გამართლებული მეთოდი:
        </p>

        <div style="display:flex; flex-direction:column; gap:1.25rem;">
    `;

    SEPARATION_SCENARIOS.forEach((scen, idx) => {
      html += `
        <div class="card" id="sep-card-${idx}">
          <div style="font-size:1.1rem; font-weight:700; margin-bottom:0.75rem; color:var(--primary);">
            ${idx + 1}. როგორ დავყოთ ნარევი: „${scen.mixture}“?
          </div>
          <div style="display:flex; flex-direction:column; gap:0.5rem;">
            ${scen.options.map((opt, oIdx) => `
              <button class="btn btn-outline" style="text-align:left; justify-content:flex-start;" onclick="Activities.checkSepAnswer(${idx}, ${oIdx})" id="sep-opt-${idx}-${oIdx}">
                ${opt.text}
              </button>
            `).join("")}
          </div>
          <div class="feedback-banner" id="sepexp-${idx}" style="margin-top:0.75rem;"></div>
        </div>
      `;
    });

    html += `</div></div>`;
    c.innerHTML = html;
  },

  checkSepAnswer(scenIdx, optIdx) {
    const scen = SEPARATION_SCENARIOS[scenIdx];
    const opt = scen.options[optIdx];
    const exp = document.getElementById(`sepexp-${scenIdx}`);
    if (!exp) return;

    scen.options.forEach((o, i) => {
      const btn = document.getElementById(`sep-opt-${scenIdx}-${i}`);
      if (btn) {
        btn.disabled = true;
        if (o.correct) btn.classList.add("btn-success");
        else if (i === optIdx) btn.classList.add("btn-danger");
      }
    });

    exp.innerHTML = `<strong>განმარტება:</strong> ${opt.why}`;
    exp.classList.add("show", opt.correct ? "success" : "warning");

    if (opt.correct) {
      AppState.markActivityComplete(`sep-${scenIdx}`);
    }
  },

  // 5. ვალენტობის კონსტრუქტორი
  renderValenceBuilder(c) {
    c.innerHTML = `
      <div class="module-view">
        <div class="module-header">
          <div class="module-meta">
            <span class="badge-tag">კონსტრუქტორი</span>
            <span class="page-badge">გვ. 51–55</span>
          </div>
          <h1 class="module-title">„ვალენტობისა და ფორმულების კონსტრუქტორი“</h1>
          <div class="module-actions">
            <a href="#activities" class="btn btn-secondary btn-sm" style="color:var(--text-main);">← სავარჯიშოების სია</a>
          </div>
        </div>

        <p style="margin-bottom:1.5rem; font-size:1.05rem; color:var(--text-muted);">
          აირჩიე ორი ელემენტი და შეადგინე მათი ნაერთის ქიმიური ფორმულა უმცირესი საერთო ჯერადის (უსჯ) წესით:
        </p>

        <div style="background:var(--bg-card-alt); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.5rem; max-width:620px; margin:0 auto 2rem auto;">
          <div style="display:flex; justify-content:space-around; align-items:center; margin-bottom:1.5rem; gap:1rem; flex-wrap:wrap;">
            <div style="text-align:center;">
              <label style="font-weight:700; display:block; margin-bottom:0.5rem; font-size:0.875rem;">პირველი ელემენტი</label>
              <select id="v-elem1" class="control-select" onchange="Activities.updateValenceCalc()">
                <option value="K-1">K (კალიუმი, I)</option>
                <option value="Ca-2">Ca (კალციუმი, II)</option>
                <option value="Al-3" selected>Al (ალუმინი, III)</option>
                <option value="C-4">C (ნახშირბადი, IV)</option>
                <option value="Na-1">Na (ნატრიუმი, I)</option>
              </select>
            </div>
            <div style="font-size:2rem; font-weight:800; color:var(--primary);">+</div>
            <div style="text-align:center;">
              <label style="font-weight:700; display:block; margin-bottom:0.5rem; font-size:0.875rem;">მეორე ელემენტი</label>
              <select id="v-elem2" class="control-select" onchange="Activities.updateValenceCalc()">
                <option value="O-2" selected>O (ჟანგბადი, II)</option>
                <option value="Cl-1">Cl (ქლორი, I)</option>
                <option value="S-2">S (გოგირდი, II)</option>
              </select>
            </div>
          </div>

          <div id="valence-result-box" style="background:#ffffff; border:2px dashed var(--primary); border-radius:var(--radius-md); padding:1.25rem; text-align:center;">
          </div>
        </div>
      </div>
    `;
    this.updateValenceCalc();
  },

  gcd(a, b) { return b === 0 ? a : this.gcd(b, a % b); },
  lcm(a, b) { return (a * b) / this.gcd(a, b); },

  updateValenceCalc() {
    const el1 = document.getElementById("v-elem1");
    const el2 = document.getElementById("v-elem2");
    if (!el1 || !el2) return;

    const e1 = el1.value.split("-");
    const e2 = el2.value.split("-");
    const name1 = e1[0], v1 = parseInt(e1[1]);
    const name2 = e2[0], v2 = parseInt(e2[1]);

    const l = this.lcm(v1, v2);
    const ind1 = l / v1;
    const ind2 = l / v2;

    const resBox = document.getElementById("valence-result-box");
    if (resBox) {
      resBox.innerHTML = `
        <div style="font-size:0.875rem; color:var(--text-muted); margin-bottom:0.4rem;">
          ვალენტობები: ${name1}(${v1}) და ${name2}(${v2}) • უმცირესი საერთო ჯერადი (უსჯ): <strong>${l}</strong>
        </div>
        <div style="font-size:0.875rem; color:var(--text-muted); margin-bottom:0.75rem;">
          ინდექსები: ${name1} → ${l}/${v1} = <strong>${ind1}</strong> ; ${name2} → ${l}/${v2} = <strong>${ind2}</strong>
        </div>
        <div style="font-size:2.2rem; font-weight:800; color:var(--primary); letter-spacing:0.05em;">
          ${name1}<sub>${ind1 > 1 ? ind1 : ''}</sub>${name2}<sub>${ind2 > 1 ? ind2 : ''}</sub>
        </div>
      `;
    }
  },

  // 6. Mr და მასური წილის კალკულატორი
  renderMrCalculator(c) {
    c.innerHTML = `
      <div class="module-view">
        <div class="module-header">
          <div class="module-meta">
            <span class="badge-tag">კალკულატორი</span>
            <span class="page-badge">გვ. 56–68</span>
          </div>
          <h1 class="module-title">„Mr და მასური წილის (w%) კალკულატორი“</h1>
          <div class="module-actions">
            <a href="#activities" class="btn btn-secondary btn-sm" style="color:var(--text-main);">← სავარჯიშოების სია</a>
          </div>
        </div>

        <p style="margin-bottom:1.5rem; font-size:1.05rem; color:var(--text-muted);">
          აირჩიე ნაერთი სახელმძღვანელოდან და დააკვირდი ფარდობითი მოლეკულური მასისა (Mr) და ელემენტთა მასური წილების (w%) ეტაპობრივ გამოთვლას:
        </p>

        <div style="background:var(--bg-card-alt); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.5rem; max-width:680px; margin:0 auto 2rem auto;">
          <label style="font-weight:700; display:block; margin-bottom:0.5rem; font-size:0.875rem;">აირჩიე ნივთიერება:</label>
          <select id="calc-preset-select" class="control-select" style="margin-bottom:1.25rem;" onchange="Activities.onPresetSelect()">
            <option value="H2O">წყალი (H₂O)</option>
            <option value="CO2">ნახშირორჟანგი (CO₂)</option>
            <option value="Al2O3">კორუნდი / ალუმინის ოქსიდი (Al₂O₃)</option>
            <option value="CaCO3">ცარცი / კალციუმის კარბონატი (CaCO₃)</option>
            <option value="SiO2">კვარცი / სილიციუმის დიოქსიდი (SiO₂)</option>
            <option value="Fe2O3">რკინის(III) ოქსიდი (Fe₂O₃)</option>
            <option value="CH4">მეთანი (CH₄)</option>
            <option value="H2SO4">გოგირდმჟავა (H₂SO₄)</option>
          </select>

          <div id="calc-result-display" style="background:#ffffff; border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.25rem;">
          </div>
        </div>
      </div>
    `;
    this.onPresetSelect();
  },

  onPresetSelect() {
    const sel = document.getElementById("calc-preset-select")?.value;
    const formulas = {
      "H2O": { name: "წყალი", elements: [{ sym: "H", n: 2, ar: 1 }, { sym: "O", n: 1, ar: 16 }] },
      "CO2": { name: "ნახშირორჟანგი", elements: [{ sym: "C", n: 1, ar: 12 }, { sym: "O", n: 2, ar: 16 }] },
      "Al2O3": { name: "კორუნდი", elements: [{ sym: "Al", n: 2, ar: 27 }, { sym: "O", n: 3, ar: 16 }] },
      "CaCO3": { name: "ცარცი", elements: [{ sym: "Ca", n: 1, ar: 40 }, { sym: "C", n: 1, ar: 12 }, { sym: "O", n: 3, ar: 16 }] },
      "SiO2": { name: "კვარცი", elements: [{ sym: "Si", n: 1, ar: 28 }, { sym: "O", n: 2, ar: 16 }] },
      "Fe2O3": { name: "რკინის ოქსიდი", elements: [{ sym: "Fe", n: 2, ar: 56 }, { sym: "O", n: 3, ar: 16 }] },
      "CH4": { name: "მეთანი", elements: [{ sym: "C", n: 1, ar: 12 }, { sym: "H", n: 4, ar: 1 }] },
      "H2SO4": { name: "გოგირდმჟავა", elements: [{ sym: "H", n: 2, ar: 1 }, { sym: "S", n: 1, ar: 32 }, { sym: "O", n: 4, ar: 16 }] }
    };

    const data = formulas[sel];
    if (!data) return;

    let mr = 0;
    data.elements.forEach(e => { mr += (e.n * e.ar); });

    const disp = document.getElementById("calc-result-display");
    if (!disp) return;

    let rowsHtml = data.elements.map(e => {
      const partMass = e.n * e.ar;
      const w = ((partMass / mr) * 100).toFixed(2);
      return `
        <tr>
          <td style="font-weight:700;">${e.sym} (Ar = ${e.ar})</td>
          <td>${e.n}</td>
          <td>${partMass}</td>
          <td><strong>${w} %</strong></td>
        </tr>
      `;
    }).join("");

    disp.innerHTML = `
      <div style="font-size:1.25rem; font-weight:800; color:var(--primary); margin-bottom:0.4rem;">
        Mr(${sel}) = ${mr}
      </div>
      <div style="font-size:0.875rem; color:var(--text-muted); margin-bottom:1rem;">
        გამოთვლა: ${data.elements.map(e => `${e.n} · ${e.ar}`).join(" + ")} = <strong>${mr}</strong>
      </div>
      <table class="obs-table">
        <thead>
          <tr>
            <th>ელემენტი</th>
            <th>ინდექსი (n)</th>
            <th>მასა მოლეკულაში</th>
            <th>მასური წილი (w%)</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  },

  // 7. ლაბორატორიული ჭურჭლის ამოცნობა
  renderGlasswareQuiz(c) {
    const glasswareList = window.LAB_EQUIPMENT_DATA || window.LAB_EQUIPMENT || [];
    c.innerHTML = `
      <div class="module-view">
        <div class="module-header">
          <div class="module-meta">
            <span class="badge-tag">დანართი 1</span>
            <span class="page-badge">გვ. 100–101</span>
          </div>
          <h1 class="module-title">„ლაბორატორიული ჭურჭლის ამოცნობა“</h1>
          <div class="module-actions">
            <a href="#activities" class="btn btn-secondary btn-sm" style="color:var(--text-main);">← სავარჯიშოების სია</a>
          </div>
        </div>

        <p style="margin-bottom:1.5rem; font-size:1.05rem; color:var(--text-muted);">
          გაეცანი ქიმიურ ჭურჭელსა და მათ დანიშნულებას:
        </p>

        <div class="grid-cards">
          ${glasswareList.map(eq => `
            <div class="card">
              <div class="card-top">
                <span class="badge-tag">${eq.category || "ჭურჭელი"}</span>
              </div>
              <h3 class="card-title">${eq.name}</h3>
              <p class="card-desc">${eq.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  },

  // 8. ფორმულების წაკითხვა
  renderFormulaReader(c) {
    const list = [
      { f: "H₂O", read: "ჰაშ-ორი-ო", name: "წყალი" },
      { f: "CO₂", read: "ცე-ო-ორი", name: "ნახშირორჟანგი" },
      { f: "O₂", read: "ო-ორი", name: "ჟანგბადი" },
      { f: "O₃", read: "ო-სამი", name: "ოზონი" },
      { f: "H₂SO₄", read: "ჰაშ-ორი-ეს-ო-ოთხი", name: "გოგირდმჟავა" },
      { f: "NaCl", read: "ნატრიუმ-ქლორი", name: "სუფრის მარილი" },
      { f: "CaCO₃", read: "კალციუმ-ცე-ო-სამი", name: "კალციუმის კარბონატი (ცარცი)" },
      { f: "Fe₂O₃", read: "ფერუმ-ორი-ო-სამი", name: "რკინის(III) ოქსიდი" },
      { f: "Al₂O₃", read: "ალუმინ-ორი-ო-სამი", name: "ალუმინის ოქსიდი (კორუნდი)" },
      { f: "HCl", read: "ჰაშ-ქლორი", name: "მარილმჟავა (ქლორწყალბადი)" }
    ];

    c.innerHTML = `
      <div class="module-view">
        <div class="module-header">
          <div class="module-meta">
            <span class="badge-tag">დანართი 2</span>
            <span class="page-badge">გვ. 102–103</span>
          </div>
          <h1 class="module-title">„როგორ იწერება და იკითხება ქიმიური ფორმულა?“</h1>
          <div class="module-actions">
            <a href="#activities" class="btn btn-secondary btn-sm" style="color:var(--text-main);">← სავარჯიშოების სია</a>
          </div>
        </div>

        <p style="margin-bottom:1.5rem; font-size:1.05rem; color:var(--text-muted);">
          ქიმიური ფორმულების საერთაშორისო წაკითხვის წესი:
        </p>

        <div style="overflow-x:auto;">
          <table class="obs-table">
            <thead>
              <tr>
                <th>ქიმიური ფორმულა</th>
                <th>როგორ იკითხება</th>
                <th>ნივთიერების სახელწოდება</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(item => `
                <tr>
                  <td style="font-size:1.15rem; font-weight:800; color:var(--primary);">${item.f}</td>
                  <td style="font-size:1.05rem; font-weight:600; color:#0f766e;">„${item.read}“</td>
                  <td>${item.name}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 9. ქიმიური ელემენტების სიმბოლოები და წარმოთქმა
  renderSymbolsActivity(c) {
    const elements = [
      { sym: "H", name: "წყალბადი", lat: "Hydrogenium", read: "ჰაში", z: 1, ar: 1, val: "I" },
      { sym: "He", name: "ჰელიუმი", lat: "Helium", read: "ჰელიუმი", z: 2, ar: 4, val: "0" },
      { sym: "C", name: "ნახშირბადი", lat: "Carboneum", read: "ცე", z: 6, ar: 12, val: "II, IV" },
      { sym: "N", name: "აზოტი", lat: "Nitrogenium", read: "ენ", z: 7, ar: 14, val: "I, II, III, IV, V" },
      { sym: "O", name: "ჟანგბადი", lat: "Oxygenium", read: "ო", z: 8, ar: 16, val: "II" },
      { sym: "F", name: "ფთორი", lat: "Fluorum", read: "ფთორი", z: 9, ar: 19, val: "I" },
      { sym: "Na", name: "ნატრიუმი", lat: "Natrium", read: "ნატრიუმი", z: 11, ar: 23, val: "I" },
      { sym: "Mg", name: "მაგნიუმი", lat: "Magnesium", read: "მაგნიუმი", z: 12, ar: 24, val: "II" },
      { sym: "Al", name: "ალუმინი", lat: "Aluminium", read: "ალუმინი", z: 13, ar: 27, val: "III" },
      { sym: "Si", name: "სილიციუმი", lat: "Silicium", read: "სილიციუმი", z: 14, ar: 28, val: "IV" },
      { sym: "P", name: "ფოსფორი", lat: "Phosphorus", read: "პე", z: 15, ar: 31, val: "III, V" },
      { sym: "S", name: "გოგირდი", lat: "Sulfur", read: "ესი", z: 16, ar: 32, val: "II, IV, VI" },
      { sym: "Cl", name: "ქლორი", lat: "Chlorum", read: "ქლორი", z: 17, ar: 35.5, val: "I, III, V, VII" },
      { sym: "K", name: "კალიუმი", lat: "Kalium", read: "კალიუმი", z: 19, ar: 39, val: "I" },
      { sym: "Ca", name: "კალციუმი", lat: "Calcium", read: "კალციუმი", z: 20, ar: 40, val: "II" },
      { sym: "Fe", name: "რკინა", lat: "Ferrum", read: "ფერუმი", z: 26, ar: 56, val: "II, III" },
      { sym: "Cu", name: "სპილენძი", lat: "Cuprum", read: "კუპრუმი", z: 29, ar: 64, val: "I, II" },
      { sym: "Zn", name: "თუთია", lat: "Zincum", read: "თუთია", z: 30, ar: 65, val: "II" },
      { sym: "Br", name: "ბრომი", lat: "Bromum", read: "ბრომი", z: 35, ar: 80, val: "I, III, V, VII" },
      { sym: "Ag", name: "ვერცხლი", lat: "Argentum", read: "არგენტუმი", z: 47, ar: 108, val: "I" },
      { sym: "I", name: "იოდი", lat: "Iodum", read: "იოდი", z: 53, ar: 127, val: "I, III, V, VII" },
      { sym: "Au", name: "ოქრო", lat: "Aurum", read: "აურუმი", z: 79, ar: 197, val: "I, III" },
      { sym: "Hg", name: "ვერცხლისწყალი", lat: "Hydrargyrum", read: "ჰიდრარგირიუმი", z: 80, ar: 201, val: "I, II" },
      { sym: "Pb", name: "ტყვია", lat: "Plumbum", read: "პლუმბუმი", z: 82, ar: 207, val: "II, IV" }
    ];

    c.innerHTML = `
      <div class="module-view">
        <div class="module-header">
          <div class="module-meta">
            <span class="badge-tag">ქიმიური ანბანი</span>
            <span class="page-badge">გვ. 54–63</span>
          </div>
          <h1 class="module-title">„ქიმიურ ელემენტთა სიმბოლოები, სახელწოდებები და წარმოთქმა“</h1>
          <div class="module-actions">
            <a href="#activities" class="btn btn-secondary btn-sm" style="color:var(--text-main);">← სავარჯიშოების სია</a>
          </div>
        </div>

        <p style="margin-bottom:1.5rem; font-size:1.05rem; color:var(--text-muted);">
          იენს იაკობ ბერცელიუსის (J. Berzelius, 1814 წ.) მიერ შემოღებული საერთაშორისო სისტემა: ელემენტის სიმბოლოდ გამოიყენება ლათინური სახელწოდების პირველი ასო ან პირველი და რომელიმე მომდევნო ასო.
        </p>

        <div style="margin-bottom:1.5rem; display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
          <input type="text" id="elemSearchInput" placeholder="🔍 მოძებნე ელემენტი (სიმბოლო, ქართული ან ლათინური)..." 
                 style="flex:1; min-width:280px; padding:0.75rem 1rem; border-radius:var(--radius-md); border:1px solid var(--border-color); font-size:1rem;">
          <span style="font-weight:600; color:var(--text-muted); font-size:0.95rem;">სულ: ${elements.length} ელემენტი</span>
        </div>

        <div style="overflow-x:auto;">
          <table class="obs-table" id="elemTable">
            <thead>
              <tr>
                <th style="width:70px;">სიმბოლო</th>
                <th>ქართული სახელი</th>
                <th>ლათინური სახელწოდება</th>
                <th>როგორ გამოითქმის</th>
                <th style="width:80px;">რიგითი №</th>
                <th style="width:80px;">Ar</th>
                <th>დამახასიათებელი ვალენტობა</th>
              </tr>
            </thead>
            <tbody id="elemTableBody">
              ${elements.map(el => `
                <tr>
                  <td style="font-size:1.35rem; font-weight:900; color:var(--primary); text-align:center;">${el.sym}</td>
                  <td style="font-weight:700; color:var(--text-main);">${el.name}</td>
                  <td style="font-style:italic; color:var(--text-muted);">${el.lat}</td>
                  <td style="font-weight:700; color:#0f766e;">„${el.read}“</td>
                  <td style="text-align:center; font-weight:700;">${el.z}</td>
                  <td style="text-align:center; font-weight:700;">${el.ar}</td>
                  <td><span class="badge-tag" style="background:#e0f2fe; color:#0369a1; font-weight:700;">${el.val}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const searchInput = c.querySelector("#elemSearchInput");
    const tbody = c.querySelector("#elemTableBody");
    if (searchInput && tbody) {
      searchInput.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = elements.filter(el => 
          el.sym.toLowerCase().includes(q) ||
          el.name.toLowerCase().includes(q) ||
          el.lat.toLowerCase().includes(q) ||
          el.read.toLowerCase().includes(q) ||
          String(el.z) === q
        );
        tbody.innerHTML = filtered.map(el => `
          <tr>
            <td style="font-size:1.35rem; font-weight:900; color:var(--primary); text-align:center;">${el.sym}</td>
            <td style="font-weight:700; color:var(--text-main);">${el.name}</td>
            <td style="font-style:italic; color:var(--text-muted);">${el.lat}</td>
            <td style="font-weight:700; color:#0f766e;">„${el.read}“</td>
            <td style="text-align:center; font-weight:700;">${el.z}</td>
            <td style="text-align:center; font-weight:700;">${el.ar}</td>
            <td><span class="badge-tag" style="background:#e0f2fe; color:#0369a1; font-weight:700;">${el.val}</span></td>
          </tr>
        `).join("");
      });
    }
  }
};

if (typeof window !== "undefined") {
  window.Activities = Activities;
}

