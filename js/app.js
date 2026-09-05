// ქიმია VII კლასი — მოსწავლის ინტერფეისის, ხედებისა და როუტერის მართვა
// ფიზიკა 7-ის სტანდარტით მორგებული ნავიგაცია, მოდულური თემები, ლაბორატორია და სავარჯიშოები

// 1. ტოსტ შეტყობინება
function showToast(message) {
  const toast = document.getElementById("app-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  if (window.toastTimer) clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// 2. ნავიგაციის მმართველი (AppNav)
const AppNav = {
  setActive(route) {
    let key = "home";
    if (!route || route === "home") key = "home";
    else if (route === "topics" || route.startsWith("topic-")) key = "topics";
    else if (route === "experiments" || route.startsWith("exp-") || route.startsWith("simulation-")) key = "experiments";
    else if (route === "activities" || route.startsWith("activity-")) key = "activities";
    else if (route === "glossary") key = "glossary";
    else if (route === "safety") key = "safety";
    else if (route === "quizzes" || route.startsWith("quiz-")) key = "quizzes";
    else if (route === "progress") key = "progress";
    else if (route === "help" || route === "guide") key = "help";

    const allLinks = document.querySelectorAll(".main-nav-bar .nav-btn, .mobile-nav-drawer .nav-btn");
    allLinks.forEach(link => {
      const targetRoute = link.getAttribute("data-route");
      if (targetRoute === key) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  },

  toggleMobileMenu() {
    const drawer = document.getElementById("mobileNavDrawer");
    const btn = document.getElementById("mobileMenuBtn");
    if (!drawer) return;
    const isOpen = drawer.classList.contains("open");
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      drawer.classList.add("open");
      if (btn) btn.setAttribute("aria-expanded", "true");
    }
  },

  closeMobileMenu() {
    const drawer = document.getElementById("mobileNavDrawer");
    const btn = document.getElementById("mobileMenuBtn");
    if (drawer) drawer.classList.remove("open");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }
};

// 3. როუტერი (Hash Router)
const Router = {
  init() {
    window.addEventListener("hashchange", () => this.handleRoute());

    // მობილური ჰამბურგერის კლიკის დამუშავება
    const btn = document.getElementById("mobileMenuBtn");
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        AppNav.toggleMobileMenu();
      });
    }

    // მენიუს დახურვა გარე კლიკისას
    document.addEventListener("click", (e) => {
      const drawer = document.getElementById("mobileNavDrawer");
      const toggleBtn = document.getElementById("mobileMenuBtn");
      if (drawer && drawer.classList.contains("open")) {
        if (!drawer.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
          AppNav.closeMobileMenu();
        }
      }
    });

    this.handleRoute();
  },

  navigate(hash) {
    window.location.hash = hash.startsWith("#") ? hash : "#" + hash;
  },

  handleRoute() {
    const rawHash = window.location.hash.slice(1).trim() || "home";
    AppNav.setActive(rawHash);
    AppNav.closeMobileMenu();

    const content = document.getElementById("app-content");
    if (!content) return;

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (rawHash === "home") {
      Views.renderHome(content);
    } else if (rawHash === "topics") {
      Views.renderTopics(content);
    } else if (rawHash.startsWith("topic-")) {
      Views.renderTopicDetail(content, rawHash);
    } else if (rawHash === "experiments" || rawHash === "simulations") {
      Simulations.renderList(content);
    } else if (rawHash.startsWith("exp-") || rawHash.startsWith("simulation-")) {
      Simulations.renderDetail(content, rawHash);
    } else if (rawHash === "activities") {
      Activities.renderList(content);
    } else if (rawHash.startsWith("activity-")) {
      Activities.renderDetail(content, rawHash);
    } else if (rawHash === "glossary") {
      Views.renderGlossary(content);
    } else if (rawHash === "safety") {
      Views.renderSafety(content);
    } else if (rawHash === "quizzes") {
      Views.renderQuizzes(content);
    } else if (rawHash.startsWith("quiz-")) {
      Views.renderQuizDetail(content, rawHash);
    } else if (rawHash === "progress") {
      Views.renderProgress(content);
    } else if (rawHash === "help" || rawHash === "guide") {
      Views.renderHelp(content);
    } else {
      Views.renderHome(content);
    }
  }
};

// 4. თემატური რუბრიკების მეცნიერული მონაცემთა ბაზა (17 თემა, 11 რუბრიკა)
const TOPIC_RUBRICS_MAP = {
  "topic-intro": {
    recall: { q: "რით განსხვავდება ბუნებრივი სხეული და ნივთიერება?", a: "სხეული არის ის, რასაც გააჩნია კონკრეტული ფორმა და ზომა (მაგ. მინის ჭიქა, რკინის ლურსმანი), ხოლო ნივთიერება — ის მასალა, რისგანაც სხეული შედგება (მინა, რკინა)." },
    everyday: "ჩვენ ყოველდღიურად ვიყენებთ ათასობით ქიმიურ ნივთიერებას: სუფრის მარილს, შაქარს, ძმარს, საპონს, კბილის პასტასა და მედიკამენტებს.",
    formulas: [{ name: "საბაზისო ერთეულები", code: "m [გ, კგ], V [მლ, ლ]", desc: "მასისა და მოცულობის საზომი სიდიდეები" }],
    example: { problem: "განასხვავე სხეული და ნივთიერება: ვერცხლის კოვზი, წყალი, ალუმინის ქვაბი, სპილენძი.", steps: ["სხეულებია: ვერცხლის კოვზი, ალუმინის ქვაბი (აქვთ გარკვეული ფორმა).", "ნივთიერებებია: წყალი, სპილენძი (მასალა, რისგანაც მზადდება სხეული)."], answer: "სხეულს გააჩნია ფორმა და ზომა, ნივთიერება კი მისი შემადგენელი მასალაა." },
    takeaway: "ქიმია არის მეცნიერება ნივთიერებების, მათი თვისებებისა და ურთიერთგარდაქმნების შესახებ. ის გვეხმარება გავიგოთ სამყაროს მატერიალური საფუძველი.",
    funfact: "სიტყვა „ქიმია“ სავარაუდოდ მომდინარეობს ძველეგვიპტური სიტყვიდან „ხემ“ (შავი მიწა, ეგვიპტე) ან ბერძნული „ქიმა“-დან (შერწყმა, გამოდნობა).",
    model: { title: "უსაფრთხოების წესები და ხელსაწყოები", link: "#safety", desc: "გაეცანი ლაბორატორიულ წესებსა და პირველ ჭურჭელს." }
  },
  "topic-1-1": {
    recall: { q: "რატომ არის აკრძალული ლაბორატორიაში ნივთიერების დაგემოვნება?", a: "ბევრი ქიმიური ნივთიერება არის ტოქსიკური, მომწამვლელი ან მწვავე, რამაც შეიძლება გამოიწვიოს დამწვრობა და მოწამვლა." },
    everyday: "სახლში ქიმიური სარეცხი საშუალებების გამოყენებისას (მაგ. მათეთრებელი, მილების საწმენდი) აუცილებლად უნდა დავიცვათ უსაფრთხოების წესები და გამოვიყენოთ ხელთათმანები.",
    formulas: [{ name: "სითხეთა დუღილის ტემპერატურა", code: "t(სპირტი) = 78°C, t(წყალი) = 100°C", desc: "სხვადასხვა ნივთიერების აორთქლების სიჩქარე" }],
    example: { problem: "რატომ ორთქლდება სამედიცინო სპირტი ხელის კანზე წყალზე სწრაფად?", steps: ["სპირტის მოლეკულებს შორის მიზიდულობა უფრო სუსტია, ვიდრე წყლის მოლეკულებს შორის.", "სპირტის დუღილის ტემპერატურა (78°C) დაბალია."], answer: "სპირტი უფრო სწრაფად ორთქლდება და კანზე სიგრილის შეგრძნებას ტოვებს." },
    takeaway: "მეცნიერული კვლევა ეფუძნება 6 ეტაპს: საკვლევი კითხვა → ინფორმაცია → ჰიპოთეზა → ექსპერიმენტი → მონაცემთა ანალიზი → დასკვნა.",
    funfact: "პირველი ქიმიური ლაბორატორიები გაჩნდა ალექსანდრიაში (ძვ.წ. III საუკუნე), სადაც ალქიმიკოსები პირველად იყენებდნენ მინის გამოსახდელ კოლბებს (ალამბიკებს).",
    model: { title: "PPE და უსაფრთხოების სიმულატორი", link: "#exp-safety-lab", desc: "გამოიცადე დამცავი აღჭურვილობის შერჩევაში." }
  },
  "topic-1-2": {
    recall: { q: "რა ემართება წყლის წვეთში ჩაგდებულ საღებავს დროთა განმავლობაში?", a: "საღებავი თავისით იშლება და მთელ წყალს თანაბრად აფერადებს ნაწილაკების ქაოსური მოძრაობის (დიფუზიის) გამო." },
    everyday: "ჩაის ფერის გახსნა ჭიქაში, სუნამოს სურნელის გავრცელება ოთახში და შაქრის გადნობა წყალში დიფუზიის ყოველდღიური მაგალითებია.",
    formulas: [{ name: "დიფუზიის სიჩქარე", code: "v(ცხელი) > v(ცივი)", desc: "ტემპერატურის მატებასთან ერთად ნაწილაკების სიჩქარე იზრდება" }],
    example: { problem: "რატომ იხსნება ჩაის პაკეტი ცხელ წყალში რამდენიმე წამში, ხოლო ცივ წყალში ძალიან ნელა?", steps: ["ცხელ წყალში წყლის მოლეკულები მოძრაობენ გაცილებით დიდი სიჩქარით.", "უფრო ხშირად ეჯახებიან ჩაის ფოთლებს და ექსტრაქტს სწრაფად ანაწილებენ."], answer: "ტემპერატურის მატება ზრდის მოლეკულების კინეტიკურ ენერგიას და დიფუზიის სიჩქარეს." },
    takeaway: "ყველა ნივთიერება შედგება უმცირესი ნაწილაკებისგან, რომლებიც განუწყვეტლივ და ქაოსურად მოძრაობენ. ამ მოვლენას დიფუზია ეწოდება.",
    funfact: "ჰაერში აზოტისა და ჟანგბადის მოლეკულები ოთახის ტემპერატურაზე დაახლოებით 500 მ/წმ სიჩქარით (თვითმფრინავზე სწრაფად) მოძრაობენ!",
    model: { title: "დიფუზიის ვირტუალური კვლევა", link: "#exp-diffusion", desc: "მართე ტემპერატურა, საღებავი და მორევა." }
  },
  "topic-1-3": {
    recall: { q: "რატომ ინარჩუნებს მყარი სხეული ფორმას, სითხე კი იღებს ჭურჭლის ფორმას?", a: "მყარ სხეულში ნაწილაკები მჭიდროდ არიან დაკავშირებული და მხოლოდ ირხევიან, სითხეში კი ნაწილაკებს შეუძლიათ ერთმანეთზე გადასრიალება." },
    everyday: "ყინული (მყარი) დნება 0°C-ზე და ხდება წყალი (თხევადი), ხოლო 100°C-ზე დუღს და გადადის ორთქლში (აირადი).",
    formulas: [{ name: "ფაზური გადასვლები", code: "დნობა: მყარი → თხევადი; აორთქლება: თხევადი → აირი", desc: "აგრეგატული მდგომარეობის ცვლილება" }],
    example: { problem: "რატომ შეიძლება აირის შეკუმშვა დგუშით ადვილად, სითხისა და მყარი სხეულის კი თითქმის შეუძლებელია?", steps: ["აირში ნაწილაკებს შორის მანძილი გაცილებით დიდია თავად ნაწილაკების ზომაზე.", "სითხეში და მყარში ნაწილაკები უკვე ძალიან ახლოს არიან ერთმანეთთან."], answer: "აირში არის თავისუფალი სივრცე შეკუმშვისთვის, სითხესა და მყარში — არა." }
    takeaway: "აგრეგატული მდგომარეობის შეცვლისას ნივთიერების მოლეკულები არ იცვლება, იცვლება მხოლოდ მათ შორის მანძილი, ურთიერთქმედება და მოძრაობის თავისუფლება.",
    funfact: "წყალი ერთადერთი ბუნებრივი ნივთიერებაა დედამიწაზე, რომელიც ერთდროულად სამივე აგრეგატულ მდგომარეობაში გვხვდება ბუნებაში!",
    model: { title: "ნაწილაკების მოდელი და აგრეგატული მდგომარეობა", link: "#exp-particles", desc: "შეცვალე ტემპერატურა -20°C-დან 120°C-მდე." }
  },
  "topic-1-4": {
    recall: { q: "რა იწონის მეტს: 1 ლიტრი წყალი თუ 1 ლიტრი ზეთი?", a: "1 ლიტრი წყალი იწონის დაახლოებით 1 კგ-ს, ხოლო 1 ლიტრი ზეთი — დაახლოებით 920 გ-ს, რადგან წყლის სიმკვრივე ზეთისაზე მეტია." },
    everyday: "ხის ნაჭერი წყალში ტივტივებს, რკინის ლურსმანი კი იძირება. მცენარეული ზეთი წყლის ზედაპირზე გროვდება.",
    formulas: [{ name: "სიმკვრივის ფორმულა", code: "ρ = m / V", desc: "სიმკვრივე = მასა გაყოფილი მოცულობაზე (გ/სმ³, კგ/მ³)" }],
    example: { problem: "გამოთვალე ნივთიერების სიმკვრივე, თუ მისი მასა m = 54 გ, ხოლო მოცულობა V = 20 სმ³.", steps: ["გამოვიყენოთ სიმკვრივის ფორმულა: ρ = m / V", "ρ = 54 გ / 20 სმ³ = 2.7 გ/სმ³."], answer: "სიმკვრივეა 2.7 გ/სმ³ (ეს ნივთიერება არის ალუმინი)." }
    takeaway: "სიმკვრივე ნივთიერების მუდმივი ფიზიკური მახასიათებელია მოცემულ ტემპერატურაზე. ის გვიჩვენებს, რა მასა აქვს ნივთიერების მოცულობის ერთეულს.",
    funfact: "ოსმიუმი და ირიდიუმი ყველაზე მკვრივი ნივთიერებებია დედამიწაზე (22.6 გ/სმ³). მათი 1-ლიტრიანი ქილა 22.6 კგ-ს იწონის!",
    model: { title: "სიმკვრივისა და ფლოტაციის კვლევა", link: "#exp-density", desc: "შექმენი სითხეთა ფენები და ჩაუშვი სხეულები." }
  },
  "topic-1-5": {
    recall: { q: "რით განსხვავდება ფიზიკური და ქიმიური თვისება?", a: "ფიზიკური თვისება აღწერს ნივთიერებას სხვა ნივთიერებად გადაქცევის გარეშე (ფერი, დნობის ტემპერატურა, სიმკვრივე), ქიმიური კი — მის უნარს, გარდაიქმნას სხვა ნივთიერებად." },
    everyday: "სპილენძისგან ელექტროსადენების დამზადება ეფუძნება მის მაღალ ელექტროგამტარობას (ფიზიკური თვისება). რკინის დაჟანგვა ტენიან ჰაერზე მისი ქიმიური თვისებაა.",
    formulas: [{ name: "თვისებათა კლასიფიკაცია", code: "ფიზიკური vs ქიმიური", desc: "აგრეგატული მდგომარეობა, ფერი, სიმკვრივე vs წვა, დაჟანგვა, მჟავებთან რეაქცია" }],
    example: { problem: "დაასახელე ალუმინის 2 ფიზიკური და 1 ქიმიური თვისება.", steps: ["ფიზიკური: ვერცხლისფერი ლითონი, მსუბუქი (2.7 გ/სმ³), ელექტროგამტარი.", "ქიმიური: იწვის ჟანგბადში და წარმოქმნის ალუმინის ოქსიდს."], answer: "ფიზიკური თვისება იზომება გარდაქმნის გარეშე, ქიმიური ავლენს რეაქციის უნარს." }
    takeaway: "ყოველ ნივთიერებას გააჩნია მხოლოდ მისთვის დამახასიათებელი ფიზიკური და ქიმიური თვისებების უნიკალური ერთობლიობა.",
    funfact: "სუფთა ტიტანი იმდენად მდგრადია კოროზიის მიმართ, რომ ზღვის წყალში ათწლეულების განმავლობაში არ ჟანგდება!",
    model: { title: "ნივთიერებათა თვისებების შედარება", link: "#activity-substances", desc: "დაახარისხე მარტივი და რთული ნივთიერებები." }
  },
  "topic-1-6": {
    recall: { q: "რა ემართება შეშას წვის დროს? ეს ფიზიკური მოვლენაა თუ ქიმიური?", a: "შეშის წვა ქიმიური მოვლენაა, რადგან ხის ორგანული ნივთიერებები გარდაიქმნება ახალ ნივთიერებებად: ნახშირორჟანგად, წყლის ორთქლად და ნაცრად." },
    everyday: "საკვების მონელება, რძის დამჟავება, ასანთის ანთება და რკინის ჟანგვა ქიმიური მოვლენებია. ყინულის დნობა და შუშის გატეხვა — ფიზიკური.",
    formulas: [{ name: "ქიმიური რეაქციის 5 ნიშანი", code: "ფერშეცვლა • აირი ↑ • ნალექი ↓ • სითბო/სინათლე Q • სუნი", desc: "ახალი ნივთიერების წარმოქმნის გარეგანი ნიშნები" }],
    example: { problem: "სოდის ძმართან შერევისას შეინიშნება ბუშტუკების ენერგიული გამოყოფა. რა მოვლენაა ეს და რატომ?", steps: ["მიმდინარეობს რეაქცია სოდასა და ძმარმჟავას შორის.", "გამოიყოფა ახალი აირადი ნივთიერება — ნახშირორჟანგი CO₂."], answer: "ეს არის ქიმიური მოვლენა, რადგან გამოიყო ახალი ნივთიერება (აირის გამოყოფის ნიშნით)." }
    takeaway: "ქიმიური რეაქციის დროს საწყისი ნივთიერებები (რეაგენტები) გარდაიქმნება ახალ ნივთიერებებად (პროდუქტებად), რასაც თან ახლავს დამახასიათებელი ნიშნები.",
    funfact: "ციცინათელების სინათლე (ბიოლუმინესცენცია) ცივი ქიმიური რეაქციის შედეგია, სადაც ენერგიის 90% სინათლედ გარდაიქმნება და თითქმის არ გამოიყოფა სითბო!",
    model: { title: "ქიმიური რეაქციის ნიშნების კვლევა", link: "#exp-reaction-signs", desc: "აკონტროლე ნალექის, აირის, სითბოს და ფერის ცვლილება." }
  },
  "topic-1-7": {
    recall: { q: "რა არის ატომი და რისგან შედგება იგი?", a: "ატომი არის ნივთიერების უმცირესი, ქიმიურად განუყოფელი ნაწილაკი, რომელიც შედგება დადებითი ბირთვისა (პროტონები, ნეიტრონები) და ელექტრონული გარსისგან." },
    everyday: "ჩვენი სხეულის 99% შედგება მხოლოდ 6 ქიმიური ელემენტის ატომებისგან: ჟანგბადი, ნახშირბადი, წყალბადი, აზოტი, კალციუმი და ფოსფორი.",
    formulas: [{ name: "ატომის აღნაგობა", code: "Z = p = e⁻; A = p + n", desc: "Z — რიგითი ნომერი, p — პროტონები, e⁻ — ელექტრონები, n — ნეიტრონები" }],
    example: { problem: "ნატრიუმის ატომის რიგითი ნომერია 11, მასური რიცხვი A = 23. რამდენი პროტონი, ნეიტრონი და ელექტრონია მასში?", steps: ["პროტონების რიცხვი p = Z = 11.", "ელექტრონების რიცხვი e⁻ = Z = 11.", "ნეიტრონების რიცხვი n = A - Z = 23 - 11 = 12."], answer: "11 პროტონი, 11 ელექტრონი, 12 ნეიტრონი." }
    takeaway: "ატომი ელექტრულად ნეიტრალური სისტემაა. ელექტრონის გაცემისას ის გარდაიქმნება დადებით იონად (კატიონად), მიერთებისას კი — უარყოფით იონად (ანიონად).",
    funfact: "თუ ატომს გავადიდებდით საფეხბურთო სტადიონის ზომამდე, მისი ბირთვი ცენტრში მდებარე ბარდის მარცვლის ზომის იქნებოდა, დანარჩენი სივრცე კი — ცარიელი!",
    model: { title: "ნაწილაკებისა და იონების მოდელი", link: "#exp-particles", desc: "დააკვირდი ატომებისა და მოლეკულების ურთიერთქმედებას." }
  },
  "topic-1-8": {
    recall: { q: "რით განსხვავდება მარტივი ნივთიერება რთული ნივთიერებისგან?", a: "მარტივი ნივთიერება შედგება ერთი ქიმიური ელემენტის ატომებისგან (მაგ. O₂, Fe), ხოლო რთული — სხვადასხვა ელემენტის ატომებისგან (მაგ. H₂O, CO₂)." },
    everyday: "ჰაერში არსებული ჟანგბადი (O₂) და აზოტი (N₂) მარტივი ნივთიერებებია. წყალი (H₂O) და ნახშირორჟანგი (CO₂) — რთული ნივთიერებები.",
    formulas: [{ name: "ნივთიერებათა კლასიფიკაცია", code: "მარტივი: E; რთული: E₁E₂...", desc: "ლითონები და არალითონები vs ოქსიდები, მჟავები, ტუტეები, მარილები" }],
    example: { problem: "დააჯგუფე მარტივ და რთულ ნივთიერებებად: წყალბადი H₂, სუფრის მარილი NaCl, რკინა Fe, მეთანი CH₄.", steps: ["მარტივი ნივთიერებებია (შედგება 1 ელემენტისგან): H₂, Fe.", "რთული ნივთიერებებია (შედგება 2 ან მეტი ელემენტისგან): NaCl, CH₄."], answer: "მარტივი: H₂, Fe; რთული: NaCl, CH₄." }
    takeaway: "მარტივი ნივთიერებები იყოფა ლითონებად (Fe, Cu, Al) და არალითონებად (O₂, S, C). რთულ ნივთიერებებს ქიმიურ ნაერთებსაც უწოდებენ.",
    funfact: "ნახშირი და ალმასი ერთი და იმავე ელემენტის — ნახშირბადის (C) მარტივი ნივთიერებებია, თუმცა განსხვავებული კრისტალური მესრის გამო სრულიად განსხვავებული თვისებები აქვთ!",
    model: { title: "ნივთიერებათა კლასიფიკაციის სავარჯიშო", link: "#activity-substances", desc: "შეამოწმე თავი მარტივი და რთული ნივთიერებების ამოცნობაში." }
  },
  "topic-1-9": {
    recall: { q: "რას აღნიშნავს ქიმიურ ფორმულაში ინდექსი და კოეფიციენტი?", a: "ინდექსი (პატარა ციფრი სიმბოლოს ქვემოთ) უჩვენებს ატომების რაოდენობას მოლეკულაში, ხოლო კოეფიციენტი (დიდი ციფრი ფორმულის წინ) — მოლეკულების რაოდენობას." },
    everyday: "წყლის ფორმულა H₂O ნიშნავს, რომ წყლის მოლეკულა შედგება 2 ატომი წყალბადისა და 1 ატომი ჟანგბადისგან.",
    formulas: [{ name: "ფორმულის ჩაწერა", code: "k • A_x B_y", desc: "k — კოეფიციენტი, x და y — ინდექსები" }],
    example: { problem: "რას ნიშნავს ჩანაწერი 3H₂SO₄?", steps: ["კოეფიციენტი 3 ნიშნავს გოგირდმჟავას 3 მოლეკულას.", "თითოეულ მოლეკულაშია 2 H, 1 S და 4 O ატომი.", "სულ შეიცავს: 6 H, 3 S და 12 O ატომს."], answer: "გოგირდმჟავას სამი მოლეკულა." }
    takeaway: "ქიმიური ფორმულა არის ნივთიერების შედგენილობის პირობითი გამოსახვა ქიმიურ ელემენტთა სიმბოლოებისა და ინდექსების საშუალებით.",
    funfact: "იენს იაკობ ბერცელიუსმა 1814 წელს შემოიღო ელემენტების აღნიშვნა მათი ლათინური სახელწოდებების ასოებით, რამაც ქიმია საერთაშორისო ენად აქცია!",
    model: { title: "ქიმიურ ელემენტთა სიმბოლოების ბაზა", link: "#activity-symbols", desc: "გაეცანი 24 ელემენტის სიმბოლოს, წარმოთქმასა და Ar-ს." }
  },
  "topic-1-10": {
    recall: { q: "რა არის ვალენტობა?", a: "ვალენტობა არის ქიმიური ელემენტის ატომის უნარი, მიიერთოს სხვა ელემენტის ატომების გარკვეული რაოდენობა. წყალბადის ვალენტობა ყოველთვის I-ია, ჟანგბადის — II." },
    everyday: "წყლის (H₂O), ნახშირორჟანგის (CO₂) და ჟანგის (Fe₂O₃) ფორმულები ზუსტად ვალენტობის წესის მიხედვით ყალიბდება.",
    formulas: [{ name: "ვალენტობის წესი (უსჯ)", code: "x • I = y • II  (Al₂O₃: 2 • III = 3 • II = 6)", desc: "ინდექსისა და ვალენტობის ნამრავლები ორივე ელემენტისთვის ტოლია" }],
    example: { problem: "შეადგინე ალუმინის ოქსიდის ფორმულა, თუ ალუმინი არის III-ვალენტიანი, ხოლო ჟანგბადი — II-ვალენტიანი.", steps: ["დავწეროთ სიმბოლოები ვალენტობებით: Al^(III) O^(II)", "ვიპოვოთ უსჯ(3, 2) = 6.", "Al-ის ინდექსი: 6 / 3 = 2; O-ის ინდექსი: 6 / 2 = 3."], answer: "მიიღება ქიმიური ფორმულა: Al₂O₃." }
    takeaway: "ბინარულ ნაერთში ერთი ელემენტის ატომების რიცხვისა და მისი ვალენტობის ნამრავლი ტოლია მეორე ელემენტის ატომების რიცხვისა და მისი ვალენტობის ნამრავლისა.",
    funfact: "არსებობს მუდმივი ვალენტობის ელემენტები (H-I, O-II, Na-I, Ca-II, Al-III) და ცვლადი ვალენტობის ელემენტები (Fe-II,III; Cu-I,II; C-II,IV; S-II,IV,VI).",
    model: { title: "ვალენტობისა და ფორმულების კონსტრუქტორი", link: "#activity-valence-builder", desc: "ააწყე ფორმულები ინტერაქტიულად." }
  },
  "topic-1-11": {
    recall: { q: "როგორ გამოითვლება ნაერთის ფარდობითი მოლეკულური მასა (Mr)?", a: "Mr გამოითვლება ნაერთის შემადგენელი ყველა ატომის ფარდობითი ატომური მასების (Ar) შეკრებით ინდექსების გათვალისწინებით." },
    everyday: "მედიცინასა და კვების მრეწველობაში აუცილებელია ნივთიერების ზუსტი შედგენილობისა და მასური წილის ცოდნა.",
    formulas: [
      { name: "ფარდობითი მოლეკულური მასა", code: "Mr(A_x B_y) = x•Ar(A) + y•Ar(B)", desc: "განზომილების გარეშე სიდიდე" },
      { name: "ელემენტის მასური წილი", code: "w(A) = (x•Ar(A) / Mr) • 100%", desc: "ელემენტის წილი ნაერთის მთლიან მასაში" }
    ],
    example: { problem: "გამოთვალე წყლის (H₂O) Mr და ჟანგბადის მასური წილი მასში. Ar(H)=1, Ar(O)=16.", steps: ["Mr(H₂O) = 2•1 + 16 = 18.", "w(O) = (16 / 18) • 100% = 88.89%."], answer: "Mr(H₂O) = 18; w(O) ≈ 88.89% (წყალბადის წილია 11.11%)." },
    takeaway: "ფარდობითი მოლეკულური მასა და ელემენტის მასური წილი საშუალებას გვაძლევს რაოდენობრივად დავახასიათოთ ნივთიერების შედგენილობა.",
    funfact: "1 ატომური მასის ერთეული (1 ამე) ტოლია ნახშირბად-12 ატომის მასის 1/12 ნაწილისა და უდრის 1.66 × 10⁻²⁴ გრამს!",
    model: { title: "Mr და მასური წილის კალკულატორი", link: "#activity-mr-calculator", desc: "გამოთვალე ნებისმიერი მოლეკულის Mr და w%." }
  },
  "topic-2-1": {
    recall: { q: "რით განსხვავდება სუფთა ნივთიერება ნარევისგან?", a: "სუფთა ნივთიერება შედგება მხოლოდ ერთი სახის ნაწილაკებისგან და აქვს მუდმივი ფიზიკური მახასიათებლები (დნობისა და დუღილის ტემპერატურა). ნარევი შედგება ორი ან მეტი ნივთიერებისგან და თვისებები ცვალებადია." },
    everyday: "დისტილირებული წყალი სუფთა ნივთიერებაა (დუღს ზუსტად 100°C-ზე). ონკანისა და ზღვის წყალი ნარევებია (შეიცავს გახსნილ მარილებს).",
    formulas: [{ name: "ნარევის მასა", code: "m(ნარევის) = m₁ + m₂ + m₃...", desc: "კომპონენტთა მასების ჯამი" }],
    example: { problem: "შეურიეს 50 გ შაქარი და 200 გ წყალი. რა არის მიღებული ნარევის მასა?", steps: ["ნარევის მასა კომპონენტთა მასების ჯამია.", "m = 50 გ + 200 გ = 250 გ."], answer: "ნარევის მასაა 250 გ." }
    takeaway: "ბუნებაში ნივთიერებები უმეტესად ნარევების სახით გვხვდება (ჰაერი, ნიადაგი, მინერალური წყალი, რძე).",
    funfact: "სუფთა 24-კარატიანი ოქრო ძალიან რბილია და ადვილად იღუნება, ამიტომ საიუველირო ნაკეთობებისთვის იყენებენ ოქროს ნარევს სპილენძთან ან ვერცხლთან.",
    model: { title: "სუფთა ნივთიერება თუ ნარევი?", link: "#activity-mixtures", desc: "შეამოწმე შენი ცოდნა ნარევების ამოცნობაში." }
  },
  "topic-2-2": {
    recall: { q: "რა განსხვავებაა ერთგვაროვან (ჰომოგენურ) და არაერთგვაროვან (ჰეტეროგენულ) ნარევებს შორის?", a: "ერთგვაროვან ნარევში კომპონენტების შემჩნევა შეუძლებელია შეუიარაღებელი თვალითაც და მიკროსკოპითაც (მაგ. შაქრიანი წყალი, ჰაერი). არაერთგვაროვანში კომპონენტები შესამჩნევია (მაგ. ქვიშა და წყალი, ზეთი და წყალი)." },
    everyday: "ჩაი შაქრით ერთგვაროვანი ნარევია. ტალახიანი წყალი, რძე და ნისლი არაერთგვაროვანი ნარევებია.",
    formulas: [{ name: "ნარევთა ტიპები", code: "ჰომოგენური vs ჰეტეროგენული", desc: "ხსნარები, შენადნობები vs სუსპენზია, ემულსია, აეროზოლი" }],
    example: { problem: "დააჯგუფე: ჰაერი, წყალი და ცარცი, შაქრის წყალხსნარი, წყალი და ზეთი.", steps: ["ერთგვაროვანი (ჰომოგენური): ჰაერი, შაქრის წყალხსნარი.", "არაერთგვაროვანი (ჰეტეროგენული): წყალი და ცარცი (სუსპენზია), წყალი და ზეთი (ემულსია)."], answer: "ჰომოგენური: ჰაერი, შაქრის ხსნარი; ჰეტეროგენული: ცარციანი წყალი, ზეთიანი წყალი." }
    takeaway: "არაერთგვაროვანი ნარევები იყოფა სუსპენზიებად (სითხე + მყარი ნაწილაკები) და ემულსიებად (სითხე + შეურევადი სითხის წვეთები).",
    funfact: "მაიონეზი არის სტაბილური ემულსია — მცენარეული ზეთისა და წყლის ნარევი, რომელსაც კვერცხის გულის ლეციტინი აკავშირებს!",
    model: { title: "ერთგვაროვანი და არაერთგვაროვანი ნარევები", link: "#activity-mixtures", desc: "ინტერაქტიული დახარისხების თამაში." }
  },
  "topic-2-3": {
    recall: { q: "რა არის ხსნარი და რა კომპონენტებისგან შედგება იგი?", a: "ხსნარი არის ერთგვაროვანი სისტემა, რომელიც შედგება გამხსნელის, გახსნილი ნივთიერებისა და მათი ურთიერთქმედების პროდუქტებისგან." },
    everyday: "ოკეანეების წყალი არის მარილების გიგანტური ბუნებრივი ხსნარი. გაზიანი სასმელი არის აირის (CO₂) ხსნარი წყალში.",
    formulas: [{ name: "ხსნადობის დამოკიდებულება", code: "S(მყარი) ↑ როცა T ↑; S(აირი) ↑ როცა T ↓", desc: "მყარი ნივთიერებების ხსნადობა ტემპერატურასთან ერთად იზრდება, აირებისა კი მცირდება" }],
    example: { problem: "რატომ გამოდის თბილი გაზიანი სასმელიდან ბუშტუკები უფრო სწრაფად, ვიდრე ცივიდან?", steps: ["აირების (CO₂) ხსნადობა ტემპერატურის მატებასთან ერთად მცირდება.", "თბილ წყალში ნახშირორჟანგი ვეღარ რჩება გახსნილი და აირის სახით გამოიყოფა."], answer: "ტემპერატურის მატებისას აირების ხსნადობა სითხეში მცირდება." }
    takeaway: "ხსნარი შეიძლება იყოს უჯერი (შეიძლება კიდევ გაიხსნას), ნაჯერი (მოცემულ ტემპერატურაზე მეტი აღარ იხსნება) და ზენაჯერი.",
    funfact: "მკვდარი ზღვის წყალში მარილის კონცენტრაცია იმდენად მაღალია (დაახლოებით 34%), რომ ადამიანს წყლის ზედაპირზე უპრობლემოდ ატივტივებს!",
    model: { title: "ხსნადობისა და ხსნარის მომზადების სიმულაცია", link: "#exp-solubility", desc: "მართე ტემპერატურა და შეისწავლე ხსნადობის მრუდები." }
  },
  "topic-2-4": {
    recall: { q: "როგორ გამოითვლება გახსნილი ნივთიერების მასური წილი ხსნარში (w%)?", a: "გახსნილი ნივთიერების მასა იყოფა ხსნარის მთლიან მასაზე და მრავლდება 100%-ზე: w% = (m(ნივთ) / m(ხსნ)) × 100%." },
    everyday: "აფთიაქის იოდის სპირტხსნარი არის 5%-იანი, ძმრის ესენცია — 70%-იანი, სუფრის ძმარი — 6%-იანი, ფიზიოლოგიური ხსნარი — 0.9%-იანი NaCl.",
    formulas: [
      { name: "ხსნარის მასა", code: "m(ხსნ) = m(ნივთ) + m(გამხსნ)", desc: "ხსნარის მთლიანი მასა" },
      { name: "მასური წილი (w%)", code: "w% = [m(ნივთ) / m(ხსნ)] • 100%", desc: "გახსნილი ნივთიერების პროცენტული წილი" }
    ],
    example: { problem: "180 გ წყალში გახსნეს 20 გ სუფრის მარილი. გამოთვალე მარილის მასური წილი ხსნარში.", steps: ["ვიპოვოთ ხსნარის მასა: m(ხსნ) = 20 გ + 180 გ = 200 გ.", "გამოვთვალოთ მასური წილი: w% = (20 / 200) • 100% = 10%."], answer: "მარილის მასური წილი ხსნარში არის 10%." }
    takeaway: "მასური წილი არის უგანზომილებო სიდიდე (ან პროცენტებში გამოსახული), რომელიც გვიჩვენებს, რა წილი უკავია გახსნილ ნივთიერებას მთლიან ხსნარში.",
    funfact: "ფიზიოლოგიური ხსნარი (0.9% NaCl) ადამიანის სისხლის პლაზმის იზოტონურია, ამიტომ მისი გადასხმა უსაფრთხოა დეჰიდრატაციის დროს.",
    model: { title: "ხსნარის მასური წილის კალკულატორი", link: "#activity-mr-calculator", desc: "გამოთვალე ნებისმიერი ხსნარის კონცენტრაცია." }
  },
  "topic-2-5": {
    recall: { q: "ნარევების დაყოფის რა ძირითადი ხერხები იცით?", a: "დალექვა, გაფილტვრა, მაგნიტით დაყოფა, აორთქლება (კრისტალიზაცია), გამოხდა (დისტილაცია) და ქრომატოგრაფია." },
    everyday: "ჩაის გაფილტვრა საწურში, ზღვის წყლისგან მარილის მიღება აორთქლებით, ნავთობის დაყოფა ბენზინად და ნავთად გამოხდით.",
    formulas: [{ name: "დაყოფის 6 მეთოდი", code: "დალექვა • გაფილტვრა • მაგნიტი • აორთქლება • გამოხდა • ქრომატოგრაფია", desc: "კომპონენტთა ფიზიკურ თვისებებში განსხვავებაზე დამყარებული ხერხები" }],
    example: { problem: "როგორ დავყოთ რკინის ქლიბიბისა და გოგირდის ფხვნილის ნარევი?", steps: ["რკინა მაგნიტურია, გოგირდი — არა.", "მივუტანოთ ნარევს მაგნიტი: რკინის ნაწილაკები მიეკრობა მაგნიტს, გოგირდი დარჩება."], answer: "ნარევი იყოფა მაგნიტით ფიზიკურ თვისებათა სხვაობის გამო." }
    takeaway: "ნარევების დაყოფა ეფუძნება მათი კომპონენტების ფიზიკურ თვისებებში არსებულ განსხვავებებს (სიმკვრივე, დუღილის ტემპერატურა, მაგნიტური თვისებები, ხსნადობა).",
    funfact: "დისტილაციის აპარატი ჯერ კიდევ ძველ საბერძნეთში და არაბულ სამყაროში გამოიყენებოდა ეთერზეთებისა და სუნამოების მისაღებად!",
    model: { title: "ნარევთა დაყოფის 4 ექსპერიმენტი", link: "#exp-distillation", desc: "ჩაატარე გამოხდის, გაფილტვრის, მაგნიტისა და კრისტალიზაციის ცდები." }
  }
};

// 5. მოსწავლის ხედების რენდერერი (Views)
const Views = {
  // მთავარი გვერდი (Home)
  renderHome(c) {
    const modules = window.CHEM_MODULES || [];
    const completedTopics = AppState.data.completedTopics || [];
    const nextTopic = modules.find(m => !completedTopics.includes(m.id)) || modules[0];
    const nextTopicId = nextTopic ? nextTopic.id : "topic-intro";
    const nextTopicNum = nextTopic ? `${nextTopic.num}` : "შესავალი";
    const totalModules = modules.length || 17;
    const completedCount = completedTopics.length;
    const totalSims = window.SIMULATION_METADATA ? window.SIMULATION_METADATA.length : 13;
    const completedSims = (AppState.data.completedSimulations || []).length;
    const totalStars = AppState.data.totalPoints || 0;
    const pct = Math.min(100, Math.round(((completedCount + completedSims) / (totalModules + totalSims)) * 100));

    c.innerHTML = `
      <!-- Hero ბარათი -->
      <section class="hero-card">
        <div class="hero-content">
          <div class="hero-tag">
            <span>🔬 VII კლასის ქიმია</span>
            <span>•</span>
            <span>ინტერაქტიული საგანმანათლებლო რესურსი</span>
          </div>
          <h1 class="hero-title">აღმოაჩინე ქიმიის საოცარი სამყარო!</h1>
          <p class="hero-desc">
            გამოიკვლიე ნივთიერებები მიკროსკოპულ დონეზე, მართე ტემპერატურა და მოცულობა ვირტუალურ ცდებში, შექმენი მოლეკულები და მოემზადე გაკვეთილებისთვის ხალისით!
          </p>
          <div class="hero-buttons">
            <a href="#${nextTopicId}" class="btn btn-primary">
              ${completedCount > 0 ? `🚀 სწავლის გაგრძელება (${nextTopicNum})` : '🚀 სწავლის დაწყება'}
            </a>
            <a href="#experiments" class="btn btn-secondary">🧪 ვირტუალური ლაბორატორია</a>
            <a href="#activities" class="btn btn-secondary">🧩 სავარჯიშოები</a>
          </div>
        </div>
      </section>

      <!-- მოსწავლის პროგრესის დიდი ბარათი -->
      <div class="hero-progress-card">
        <div class="hero-progress-header">
          <div class="hero-progress-title">
            <span>📊</span>
            <span>ჩემი სასწავლო პროგრესი</span>
          </div>
          <div class="hero-progress-pct">${pct}% გავლილია</div>
        </div>
        <div class="progress-track-bar">
          <div class="progress-fill-bar" style="width: ${pct}%;"></div>
        </div>
        <div class="stats-four-grid">
          <div class="stat-item-box">
            <div class="stat-item-val">${completedCount} / ${totalModules}</div>
            <div class="stat-item-lbl">📚 თემები</div>
          </div>
          <div class="stat-item-box">
            <div class="stat-item-val">${completedSims} / ${totalSims}</div>
            <div class="stat-item-lbl">🧪 კვლევები</div>
          </div>
          <div class="stat-item-box">
            <div class="stat-item-val">⭐ ${totalStars}</div>
            <div class="stat-item-lbl">ვარსკვლავები</div>
          </div>
          <div class="stat-item-box">
            <div class="stat-item-val">${pct}%</div>
            <div class="stat-item-lbl">საერთო დონე</div>
          </div>
        </div>
      </div>

      <!-- 6 მთავარი განყოფილების დიდი ბარათები -->
      <div class="main-sections-grid">
        <a href="#topics" class="section-feature-card">
          <div class="card-icon-tag-row">
            <div class="card-big-icon" style="background:#e0f2fe; color:#0284c7;">📚</div>
            <span class="card-counter-tag">17 თემა • გვ. 6–87</span>
          </div>
          <h3>თემები და პარაგრაფები</h3>
          <p>სახელმძღვანელოს ყველა თავი სტრუქტურირებული მიზნებით, მოდელებით, ფორმულებითა და ცოდნის შემოწმებით.</p>
          <div class="card-action-link">გადასვლა →</div>
        </a>

        <a href="#experiments" class="section-feature-card">
          <div class="card-icon-tag-row">
            <div class="card-big-icon" style="background:#dcfce7; color:#16a34a;">🧪</div>
            <span class="card-counter-tag">13 ექსპერიმენტი</span>
          </div>
          <h3>ვირტუალური ლაბორატორია</h3>
          <p>10-საფეხურიანი სამეცნიერო კვლევითი ციკლი: ჰიპოთეზა, ცვლადების მართვა, დაკვირვება და დასკვნა.</p>
          <div class="card-action-link">გადასვლა →</div>
        </a>

        <a href="#activities" class="section-feature-card">
          <div class="card-icon-tag-row">
            <div class="card-big-icon" style="background:#fef3c7; color:#d97706;">🧩</div>
            <span class="card-counter-tag">8 კატეგორია</span>
          </div>
          <h3>ინტერაქტიული სავარჯიშოები</h3>
          <p>მოვლენების დახარისხება, ნარევების დაყოფა, ვალენტობა, ფორმულები, სიმბოლოები და ჭურჭლის ქვიზი.</p>
          <div class="card-action-link">გადასვლა →</div>
        </a>

        <a href="#quizzes" class="section-feature-card">
          <div class="card-icon-tag-row">
            <div class="card-big-icon" style="background:#f3e8ff; color:#7c3aed;">📝</div>
            <span class="card-counter-tag">თემატური + შემაჯამებელი</span>
          </div>
          <h3>ტესტები და გამოცდები</h3>
          <p>შეამოწმე ცოდნა მყისიერი შეფასებითა და დეტალური მეცნიერული განმარტებებით თითოეულ შეკითხვაზე.</p>
          <div class="card-action-link">გადასვლა →</div>
        </a>

        <a href="#glossary" class="section-feature-card">
          <div class="card-icon-tag-row">
            <div class="card-big-icon" style="background:#ccfbf1; color:#0f766e;">📖</div>
            <span class="card-counter-tag">სრული ტერმინოლოგია</span>
          </div>
          <h3>ქიმიური ლექსიკონი</h3>
          <p>VII კლასის ყველა საბაზისო ცნება, განმარტება, ბერცელიუსის სიმბოლოები და ქიმიური ფორმულები.</p>
          <div class="card-action-link">გადასვლა →</div>
        </a>

        <a href="#safety" class="section-feature-card">
          <div class="card-icon-tag-row">
            <div class="card-big-icon" style="background:#fee2e2; color:#dc2626;">🛡️</div>
            <span class="card-counter-tag">14 წესი • 9 GHS ნიშანი</span>
          </div>
          <h3>ლაბორატორიული უსაფრთხოება</h3>
          <p>უსაფრთხო მუშაობის ოქროს წესები, საერთაშორისო გამაფრთხილებელი პიქტოგრამები და PPE მოთხოვნები.</p>
          <div class="card-action-link">გადასვლა →</div>
        </a>
      </div>

      <!-- რჩეული ელემენტები (Spotlights) -->
      <div class="spotlights-section">
        <div class="spotlight-card">
          <span class="spotlight-badge" style="background:#e0f2fe; color:#0369a1;">🔬 რჩეული სიმულაცია</span>
          <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:0.4rem; color:var(--text-main);">
            ნაწილაკების მოდელი და აგრეგატული მდგომარეობა
          </h3>
          <p style="font-size:0.875rem; color:var(--text-muted); line-height:1.5; margin-bottom:1rem; flex:1;">
            შეცვალე ტემპერატურა -20°C-დან 120°C-მდე და დააკვირდი ნაწილაკების მოძრაობას მყარ, თხევად და აირად ფაზებში.
          </p>
          <a href="#exp-particles" class="btn btn-primary btn-sm">🔬 კვლევის დაწყება ▶️</a>
        </div>

        <div class="spotlight-card">
          <span class="spotlight-badge" style="background:#fef3c7; color:#92400e;">🧩 რეკომენდებული სავარჯიშო</span>
          <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:0.4rem; color:var(--text-main);">
            ვალენტობისა და ფორმულების კონსტრუქტორი
          </h3>
          <p style="font-size:0.875rem; color:var(--text-muted); line-height:1.5; margin-bottom:1rem; flex:1;">
            შეადგინე ქიმიური ფორმულები უმცირესი საერთო ჯერადის წესით (Al₂O₃, CaO, P₂O₅, KCl, Fe₂O₃).
          </p>
          <a href="#activity-valence-builder" class="btn btn-primary btn-sm">🧩 ფორმულის აწყობა ▶️</a>
        </div>

        <div class="spotlight-card">
          <span class="spotlight-badge" style="background:#f3e8ff; color:#6b21a8;">🏆 შემაჯამებელი გამოწვევა</span>
          <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:0.4rem; color:var(--text-main);">
            VII კლასის ქიმიის დიდი შემაჯამებელი ტესტი
          </h3>
          <p style="font-size:0.875rem; color:var(--text-muted); line-height:1.5; margin-bottom:1rem; flex:1;">
            15 შეკითხვა მთელი სახელმძღვანელოს მასალიდან: ნივთიერებები, ფორმულები, მოვლენები და ნარევები.
          </p>
          <a href="#quiz-final" class="btn btn-primary btn-sm">📝 გამოცდის დაწყება ▶️</a>
        </div>
      </div>
    `;
  },

  // თემების კატალოგი (Topics)
  renderTopics(c) {
    const modules = window.CHEM_MODULES || [];
    const completedTopics = AppState.data.completedTopics || [];

    const chapters = [
      { id: "intro", title: "შესავალი: ქიმია — საბუნებისმეტყველო მეცნიერება", pages: "გვ. 6–7", filter: m => m.id === "topic-intro" },
      { id: "ch1", title: "თავი 1: ნივთიერებები ჩვენ ირგვლივ", pages: "გვ. 8–68", filter: m => m.id.startsWith("topic-1-") },
      { id: "ch2", title: "თავი 2: ნარევები ჩვენ ირგვლივ", pages: "გვ. 69–87", filter: m => m.id.startsWith("topic-2-") }
    ];

    let html = `
      <div class="sim-catalog-header">
        <h1 style="font-size:2rem; font-weight:900; color:var(--text-main); margin-bottom:0.4rem;">
          📚 სასწავლო თემების კატალოგი
        </h1>
        <p style="color:var(--text-muted); font-size:1rem; line-height:1.5;">
          VII კლასის ქიმიის სახელმძღვანელოს 17 თემა 11 პედაგოგიური რუბრიკით: მიზნები, მოდელები, თეორია, ფორმულები, ამოცანები და ტესტები.
        </p>
      </div>
    `;

    chapters.forEach(ch => {
      const chModules = modules.filter(ch.filter);
      const chDone = chModules.filter(m => completedTopics.includes(m.id)).length;
      const chPct = Math.round((chDone / Math.max(1, chModules.length)) * 100);

      html += `
        <div style="margin-top:2.5rem; margin-bottom:1.25rem; display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:0.5rem; border-bottom:2px solid var(--border-color); padding-bottom:0.6rem;">
          <div>
            <h2 style="font-size:1.4rem; font-weight:800; color:var(--text-main); margin-bottom:0.2rem;">${ch.title}</h2>
            <span style="font-size:0.875rem; color:var(--text-muted); font-weight:600;">${ch.pages} • ${chModules.length} თემა</span>
          </div>
          <div style="font-size:0.875rem; font-weight:700; color:var(--primary);">
            პროგრესი: ${chDone} / ${chModules.length} (${chPct}%)
          </div>
        </div>

        <div class="main-sections-grid">
          ${chModules.map(mod => {
            const isDone = completedTopics.includes(mod.id);
            return `
              <div class="section-feature-card" style="${isDone ? 'border-color:#86efac;' : ''}">
                <div class="card-icon-tag-row">
                  <span class="badge-tag">${mod.num}</span>
                  <span class="card-counter-tag">${mod.pages}</span>
                </div>
                <h3>${mod.title}</h3>
                <p>${mod.desc}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:0.75rem;">
                  <a href="#${mod.id}" class="btn ${isDone ? 'btn-secondary' : 'btn-primary'} btn-sm">
                    ${isDone ? "🔄 განხილვა" : "შესწავლა ▶️"}
                  </a>
                  ${isDone ? '<span style="color:#16a34a; font-weight:800; font-size:0.875rem;">✅ გავლილია</span>' : ''}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;
    });

    c.innerHTML = html;
  },

  // თემის დეტალური ხედი (Topic Detail — ორსვეტიანი განლაგება 11 რუბრიკით)
  renderTopicDetail(c, topicId) {
    const modules = window.CHEM_MODULES || [];
    const mod = modules.find(m => m.id === topicId);
    if (!mod) {
      c.innerHTML = `<p style="padding:2rem;">თემა ვერ მოიძებნა. <a href="#topics">თემების სიაში დაბრუნება</a></p>`;
      return;
    }

    const currentIndex = modules.findIndex(m => m.id === topicId);
    const prevMod = currentIndex > 0 ? modules[currentIndex - 1] : null;
    const nextMod = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;
    const isDone = AppState.data.completedTopics.includes(mod.id);
    const rubrics = TOPIC_RUBRICS_MAP[mod.id] || TOPIC_RUBRICS_MAP["topic-intro"];

    c.innerHTML = `
      <div class="topics-layout">
        <!-- მარცხენა ფიქსირებული გვერდითი პანელი (Topics Sidebar) -->
        <aside class="topics-sidebar">
          <div class="topics-sidebar-header">
            <span class="topics-sidebar-title">📚 თემების სია (17)</span>
          </div>
          <div class="topics-sidebar-list">
            ${modules.map(m => {
              const isActive = m.id === topicId;
              const isItemDone = AppState.data.completedTopics.includes(m.id);
              return `
                <a href="#${m.id}" class="topic-nav-item ${isActive ? 'active' : ''}">
                  <span class="topic-nav-icon">${isItemDone ? '✅' : '📖'}</span>
                  <div class="topic-nav-info">
                    <div class="topic-nav-badge">${m.num} • ${m.pages}</div>
                    <div class="topic-nav-title" title="${m.title}">${m.title}</div>
                  </div>
                  ${isItemDone ? '<span class="status-check">✓</span>' : ''}
                </a>
              `;
            }).join("")}
          </div>
        </aside>

        <!-- მარჯვენა სამუშაო დაფა (11 პედაგოგიური რუბრიკა) -->
        <main class="topic-content-display">
          <!-- თემის სათაურის ბარათი -->
          <div class="topic-header-card">
            <div class="topic-tag-row">
              <span class="topic-num-tag">${mod.num}</span>
              <span class="topic-badge-tag">${mod.chapter}</span>
              <span class="topic-page-tag">${mod.pages}</span>
            </div>
            <h2>${mod.title}</h2>
            <p class="topic-lead-summary">${mod.desc}</p>
          </div>

          <!-- 1. რას ვისწავლით ამ თემაში (Learn Rubric) -->
          <div class="rubric-card learn-rubric">
            <div class="rubric-header">
              <span class="rubric-icon">🎯</span>
              <h4>რას ვისწავლით ამ თემაში</h4>
            </div>
            <div class="rubric-body">
              <ul class="learn-goals-list">
                ${mod.keyConcepts.map(kc => `<li><strong>${kc.title}:</strong> ${kc.desc}</li>`).join("")}
              </ul>
            </div>
          </div>

          <!-- 2. გაიხსენე (Recall Rubric) -->
          <div class="rubric-card recall-rubric">
            <div class="rubric-header">
              <span class="rubric-icon">❓</span>
              <h4>გაიხსენე</h4>
            </div>
            <div class="rubric-body">
              <div class="recall-question">
                ${rubrics.recall.q}
              </div>
              <button class="btn btn-secondary btn-sm" onclick="Views.toggleRecall('${mod.id}')" style="margin-top:0.5rem;">
                💡 პასუხის ნახვა / მინიშნება
              </button>
              <div id="recall-answer-${mod.id}" style="display:none; margin-top:0.75rem; padding:0.75rem 1rem; background:#ffffff; border-radius:var(--radius-sm); border:1px solid #fed7aa; color:#9a3412; font-weight:600;">
                ${rubrics.recall.a}
              </div>
            </div>
          </div>

          <!-- 3. ინტერაქტიული მოდელი / დაკვირვება (Model Rubric) -->
          <div class="rubric-card model-rubric">
            <div class="rubric-header">
              <span class="rubric-icon">🔬</span>
              <h4>ინტერაქტიული მოდელი და დაკვირვება</h4>
            </div>
            <div class="rubric-body">
              <p style="font-size:0.95rem; color:var(--text-muted); margin-bottom:1rem;">
                ${rubrics.model.desc}
              </p>
              <a href="${rubrics.model.link}" class="btn btn-accent btn-sm">
                🔬 ${rubrics.model.title} ▶️
              </a>
            </div>
          </div>

          <!-- 4. ძირითადი ცნებები და განმარტებები (Core Theory) -->
          <div style="margin:1.75rem 0;">
            <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-main); margin-bottom:0.75rem;">
              📖 ძირითადი ცნებები და განმარტებები
            </h3>
            <p style="font-size:1.05rem; line-height:1.7; color:var(--text-main); margin-bottom:1.25rem;">
              ${mod.summary}
            </p>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem;">
              ${mod.keyConcepts.map(kc => `
                <div class="concept-box">
                  <div class="concept-title">${kc.title}</div>
                  <div class="concept-desc">${kc.desc}</div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- 5. ქიმია ჩვენ ირგვლივ (Everyday Chemistry) -->
          <div class="rubric-card everyday-rubric">
            <div class="rubric-header">
              <span class="rubric-icon">🌍</span>
              <h4>ქიმია ჩვენ ირგვლივ</h4>
            </div>
            <div class="rubric-body">
              <p style="font-size:0.95rem; color:#1e3a8a; line-height:1.6;">
                ${rubrics.everyday}
              </p>
            </div>
          </div>

          <!-- 6. ძირითადი ფორმულები და სიდიდეები (Formulas Rubric) -->
          <div class="rubric-card formulas-rubric">
            <div class="rubric-header">
              <span class="rubric-icon">📐</span>
              <h4>ძირითადი ფორმულები და სიდიდეები</h4>
            </div>
            <div class="rubric-body">
              <div class="formulas-grid">
                ${rubrics.formulas.map(f => `
                  <div class="formula-chip">
                    <span class="formula-name">${f.name}</span>
                    <span class="formula-code">${f.code}</span>
                    <span class="formula-desc">${f.desc}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- 7. ამოცანის ამოხსნის ნიმუში (Worked Example) -->
          <div class="rubric-card example-rubric">
            <div class="rubric-header">
              <span class="rubric-icon">💡</span>
              <h4>ამოცანის ამოხსნის ნიმუში</h4>
            </div>
            <div class="rubric-body">
              <div class="example-problem">
                ${rubrics.example.problem}
              </div>
              <div style="display:flex; flex-direction:column; gap:0.35rem; margin-bottom:0.75rem;">
                ${rubrics.example.steps.map((st, i) => `
                  <div class="example-solution-step"><strong>ნაბიჯი ${i + 1}:</strong> ${st}</div>
                `).join("")}
              </div>
              <div style="padding:0.6rem 0.9rem; background:#f1f5f9; border-radius:var(--radius-sm); font-weight:700; color:var(--text-main);">
                <strong>პასუხი:</strong> ${rubrics.example.answer}
              </div>
            </div>
          </div>

          <!-- 8. შეამოწმე გაგება (Check Understanding) -->
          <div class="rubric-card check-rubric">
            <div class="rubric-header">
              <span class="rubric-icon">✍️</span>
              <h4>შეამოწმე გაგება (მყისიერი უკუკავშირით)</h4>
            </div>
            <div class="rubric-body">
              <div id="quiz-container-${mod.id}" style="display:flex; flex-direction:column; gap:1.25rem;">
                ${mod.quiz.map((qObj, qIdx) => `
                  <div class="card" id="qbox-${mod.id}-${qIdx}" style="background:#ffffff; border:1px solid #e9d5ff;">
                    <div style="font-size:1.05rem; font-weight:700; margin-bottom:0.75rem; color:var(--text-main);">
                      ${qIdx + 1}. ${qObj.q}
                    </div>
                    <div style="display:flex; flex-direction:column; gap:0.5rem;">
                      ${qObj.options.map((opt, oIdx) => `
                        <button class="btn btn-outline" style="text-align:left; justify-content:flex-start;" 
                                onclick="Views.checkQuizAnswer('${mod.id}', ${qIdx}, ${oIdx})" id="qopt-${mod.id}-${qIdx}-${oIdx}">
                          <span style="font-weight:700; color:var(--text-muted); margin-right:0.35rem;">${String.fromCharCode(65 + oIdx)})</span>
                          <span>${opt}</span>
                        </button>
                      `).join("")}
                    </div>
                    <div class="feedback-banner" id="qexp-${mod.id}-${qIdx}">
                      <strong>განმარტება:</strong> ${qObj.explanation}
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- 9. მთავარი დასკვნა (Core Takeaway) -->
          <div class="rubric-card takeaway-rubric">
            <div class="rubric-header">
              <span class="rubric-icon">📌</span>
              <h4>მთავარი დასკვნა</h4>
            </div>
            <div class="rubric-body">
              <p class="takeaway-text">${rubrics.takeaway}</p>
            </div>
          </div>

          <!-- 10. ეს საინტერესოა! (Fun Fact) -->
          <div class="rubric-card funfact-rubric">
            <div class="rubric-header">
              <span class="rubric-icon">✨</span>
              <h4>ეს საინტერესოა!</h4>
            </div>
            <div class="rubric-body">
              <p class="funfact-text">${rubrics.funfact}</p>
            </div>
          </div>

          <!-- 11. ახალი ტერმინები და ცნებები (Terms Chips) -->
          <div class="rubric-card terms-rubric">
            <div class="rubric-header">
              <span class="rubric-icon">📚</span>
              <h4>ახალი ტერმინები და ცნებები</h4>
            </div>
            <div class="rubric-body">
              <div class="terms-row">
                ${mod.keyTerms.map(t => `<a href="#glossary" class="term-chip">📖 ${t}</a>`).join("")}
              </div>
            </div>
          </div>

          <!-- თემის ნავიგაციის ღილაკები -->
          <div class="topic-nav-actions">
            <div>
              ${prevMod ? `<a href="#${prevMod.id}" class="btn btn-secondary btn-sm" style="color:var(--text-main);">← ${prevMod.num}. ${prevMod.title}</a>` : ''}
            </div>
            <div>
              <button onclick="Views.toggleTopicCompletion('${mod.id}')" class="btn btn-sm ${isDone ? 'btn-outline' : 'btn-accent'}" id="btn-complete-${mod.id}">
                ${isDone ? "✓ გავლილია (ხელახლა მონიშვნა)" : "✅ თემის დასრულება (+50 ⭐)"}
              </button>
            </div>
            <div>
              ${nextMod ? `<a href="#${nextMod.id}" class="btn btn-primary btn-sm">${nextMod.num}. ${nextMod.title} →</a>` : ''}
            </div>
          </div>
        </main>
      </div>
    `;
  },

  toggleRecall(topicId) {
    const el = document.getElementById(`recall-answer-${topicId}`);
    if (el) {
      el.style.display = el.style.display === "none" ? "block" : "none";
    }
  },

  toggleTopicCompletion(topicId) {
    AppState.markTopicComplete(topicId);
    const btn = document.getElementById(`btn-complete-${topicId}`);
    if (btn) {
      btn.textContent = "✓ გავლილია";
      btn.className = "btn btn-sm btn-outline";
    }
  },

  checkQuizAnswer(topicId, qIdx, oIdx) {
    const mod = (window.CHEM_MODULES || []).find(m => m.id === topicId);
    if (!mod || !mod.quiz[qIdx]) return;
    const qObj = mod.quiz[qIdx];
    const exp = document.getElementById(`qexp-${topicId}-${qIdx}`);

    mod.quiz[qIdx].options.forEach((opt, i) => {
      const btn = document.getElementById(`qopt-${topicId}-${qIdx}-${i}`);
      if (btn) {
        btn.disabled = true;
        if (i === qObj.correct) btn.classList.add("btn-success");
        else if (i === oIdx) btn.classList.add("btn-danger");
      }
    });

    if (exp) {
      exp.classList.add("show", oIdx === qObj.correct ? "success" : "warning");
    }

    if (oIdx === qObj.correct) {
      AppState.data.totalPoints += 10;
      AppState.save();
      showToast("სწორია! (+10 ⭐)");
    }
  },

  // ლექსიკონი (Glossary)
  renderGlossary(c) {
    c.innerHTML = `
      <div class="sim-catalog-header">
        <h1 style="font-size:2rem; font-weight:900; color:var(--text-main); margin-bottom:0.4rem;">
          📖 ქიმიური ტერმინების ლექსიკონი
        </h1>
        <p style="color:var(--text-muted); font-size:1rem; line-height:1.5;">
          VII კლასის ქიმიის სახელმძღვანელოს ყველა ძირითადი ცნება, მეცნიერული განმარტება და ფორმულა
        </p>
      </div>

      <div style="display:flex; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap;">
        <input type="text" id="glossary-search" class="control-select" style="flex:1; min-width:260px;" 
               placeholder="🔍 მოძებნე ტერმინი ან განმარტება..." oninput="Views.filterGlossary()">
        <select id="glossary-category" class="control-select" style="width:220px;" onchange="Views.filterGlossary()">
          <option value="all">ყველა კატეგორია</option>
          <option value="ზოგადი">ზოგადი</option>
          <option value="ნაწილაკები">ნაწილაკები</option>
          <option value="აგრეგატული">აგრეგატული მდგომარეობა</option>
          <option value="ფაზური">ფაზური გადასვლები</option>
          <option value="აგებულება">ატომის აგებულება</option>
          <option value="ფორმულა">ფორმულები და ვალენტობა</option>
          <option value="ნარევები">ნარევები და დაყოფა</option>
        </select>
      </div>

      <div class="main-sections-grid" id="glossary-grid">
      </div>
    `;
    this.filterGlossary();
  },

  filterGlossary() {
    const search = (document.getElementById("glossary-search")?.value || "").toLowerCase().trim();
    const cat = document.getElementById("glossary-category")?.value || "all";
    const grid = document.getElementById("glossary-grid");
    if (!grid) return;

    const terms = window.GLOSSARY_TERMS || [];
    const filtered = terms.filter(t => {
      const matchSearch = t.term.toLowerCase().includes(search) || t.def.toLowerCase().includes(search);
      const matchCat = cat === "all" || t.category === cat;
      return matchSearch && matchCat;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);">ტერმინი ვერ მოიძებნა.</p>`;
      return;
    }

    grid.innerHTML = filtered.map(t => `
      <div class="section-feature-card">
        <div class="card-icon-tag-row">
          <span class="badge-tag">${t.category}</span>
          <span class="card-counter-tag">თემა ${t.topic}</span>
        </div>
        <h3 style="color:var(--primary);">${t.term}</h3>
        <p>${t.def}</p>
        ${t.formula ? `<div style="font-family:var(--font-mono); font-weight:700; color:#0f766e; margin-bottom:0.5rem; background:#f0fdf4; padding:0.25rem 0.5rem; border-radius:4px; display:inline-block;">${t.formula}</div>` : ''}
        ${t.example ? `<div style="font-size:0.8125rem; color:var(--text-muted); border-top:1px solid var(--border-card); padding-top:0.5rem; margin-top:auto;"><strong>მაგალითი:</strong> ${t.example}</div>` : ''}
      </div>
    `).join("");
  },

  // უსაფრთხოების წესები და ნიშნები (Safety)
  renderSafety(c) {
    const rules = window.LAB_SAFETY_RULES || [];
    const hazards = [
      { name: "აალებადი ნივთიერება", desc: "ადვილად აალებადი სითხე ან აირი (მაგ. სპირტი, აცეტონი). მოარიდე ცეცხლს!" },
      { name: "მწვავე ტოქსიკურობა (შხამი)", desc: "სასიკვდილო ან მძიმე მოწამვლის გამომწვევი ნივთიერება." },
      { name: "კოროზიული (მწვავე)", desc: "კანის ძლიერი დამწვრობისა და ლითონის დაშლის გამომწვევი (მაგ. მჟავები და ტუტეები)." },
      { name: "მჟანგავი", desc: "აჩქარებს წვას და შეიძლება გამოიწვიოს ხანძარი (მაგ. ჟანგბადი, პერმანგანატი)." }
    ];

    c.innerHTML = `
      <div class="sim-catalog-header">
        <h1 style="font-size:2rem; font-weight:900; color:var(--text-main); margin-bottom:0.4rem;">
          🛡️ ლაბორატორიული უსაფრთხოების წესები
        </h1>
        <p style="color:var(--text-muted); font-size:1rem; line-height:1.5;">
          სასკოლო ქიმიის ლაბორატორიაში უსაფრთხო მუშაობის 14 ოქროს წესი (გვ. 10–11) და საერთაშორისო გამაფრთხილებელი ნიშნები
        </p>
      </div>

      <div style="margin-bottom:2.5rem;">
        <h2 style="font-size:1.35rem; font-weight:800; color:var(--danger); margin-bottom:1rem;">
          ⚠️ ლაბორატორიაში უსაფრთხო მუშაობის 14 ოქროს წესი
        </h2>
        <div class="main-sections-grid">
          ${rules.map(r => `
            <div class="section-feature-card" style="border-left:4px solid var(--danger);">
              <div style="font-size:1.75rem; margin-bottom:0.5rem;">${r.icon}</div>
              <h3 style="font-size:1.05rem;">${r.id}. ${r.title}</h3>
              <p style="font-size:0.875rem;">${r.text}</p>
            </div>
          `).join("")}
        </div>
      </div>

      <div>
        <h2 style="font-size:1.35rem; font-weight:800; color:var(--primary); margin-bottom:1rem;">
          🏷️ GHS საერთაშორისო გამაფრთხილებელი პიქტოგრამები
        </h2>
        <div class="main-sections-grid">
          ${hazards.map(h => `
            <div class="section-feature-card" style="border:2px solid #fecaca; background:#fff5f5;">
              <div class="card-icon-tag-row">
                <span style="font-size:1.75rem;">🛑</span>
                <span class="badge-tag" style="background:#fee2e2; color:#991b1b;">საშიშროება</span>
              </div>
              <h3 style="color:#991b1b; font-size:1.05rem;">${h.name}</h3>
              <p style="font-size:0.875rem; color:#7f1d1d;">${h.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  },

  // ტესტები და გამოცდები (Quizzes)
  renderQuizzes(c) {
    const modules = window.CHEM_MODULES || [];

    c.innerHTML = `
      <div class="sim-catalog-header">
        <h1 style="font-size:2rem; font-weight:900; color:var(--text-main); margin-bottom:0.4rem;">
          📝 ცოდნის შესამოწმებელი ტესტები
        </h1>
        <p style="color:var(--text-muted); font-size:1rem; line-height:1.5;">
          თემატური ტესტები და დიდი შემაჯამებელი გამოცდა მყისიერი შეფასებითა და მეცნიერული განმარტებებით
        </p>
      </div>

      <div class="card" style="background:linear-gradient(135deg, #0f172a, #0369a1); color:#ffffff; margin-bottom:2rem; padding:2rem; border-radius:var(--radius-lg);">
        <h2 style="font-size:1.6rem; font-weight:900; margin-bottom:0.5rem; color:#ffffff;">🏆 VII კლასის შემაჯამებელი დიდი ტესტი</h2>
        <p style="color:#cbd5e1; margin-bottom:1.25rem; font-size:1rem; line-height:1.6;">
          15 შეკითხვა მთელი სახელმძღვანელოს მასალიდან: ნივთიერებები, აგრეგატული მდგომარეობები, სიმკვრივე, ატომები, ფორმულები, ვალენტობა, ნარევები და უსაფრთხოება.
        </p>
        <div>
          <a href="#quiz-final" class="btn btn-primary">გამოცდის დაწყება ▶️</a>
        </div>
      </div>

      <h2 style="font-size:1.35rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">თემატური ტესტები:</h2>
      <div class="main-sections-grid">
        ${modules.map(m => `
          <div class="section-feature-card">
            <div class="card-icon-tag-row">
              <span class="badge-tag">${m.num}</span>
              <span class="card-counter-tag">${m.quiz.length} კითხვა</span>
            </div>
            <h3>${m.title}</h3>
            <p>${m.desc}</p>
            <div style="margin-top:auto; padding-top:0.75rem;">
              <a href="#${m.id}" class="btn btn-primary btn-sm">ტესტის გავლა ▶️</a>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  },

  // შემაჯამებელი გამოცდის დეტალური ხედი
  renderQuizDetail(c, quizId) {
    if (quizId === "quiz-final") {
      const allQ = [];
      (window.CHEM_MODULES || []).forEach(m => {
        m.quiz.forEach(q => {
          allQ.push(Object.assign({}, q, { topicTitle: m.title }));
        });
      });

      const selectedQ = allQ.slice(0, 15);

      c.innerHTML = `
        <div class="module-view">
          <div class="module-header">
            <div class="module-meta">
              <span class="badge-tag">დიდი გამოცდა</span>
              <span class="page-badge">${selectedQ.length} კითხვა</span>
            </div>
            <h1 class="module-title">VII კლასის ქიმიის შემაჯამებელი ტესტი</h1>
            <div class="module-actions">
              <a href="#quizzes" class="btn btn-secondary btn-sm" style="color:var(--text-main);">← ტესტების სია</a>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            ${selectedQ.map((qObj, idx) => `
              <div class="card" id="final-qbox-${idx}">
                <div style="font-size:0.75rem; color:var(--primary); font-weight:700; margin-bottom:0.25rem;">${qObj.topicTitle}</div>
                <div style="font-size:1.05rem; font-weight:700; margin-bottom:0.75rem;">${idx + 1}. ${qObj.q}</div>
                <div style="display:flex; flex-direction:column; gap:0.5rem;">
                  ${qObj.options.map((opt, oIdx) => `
                    <button class="btn btn-outline" style="text-align:left; justify-content:flex-start;" 
                            onclick="Views.checkFinalAnswer(${idx}, ${oIdx}, ${qObj.correct})" id="final-btn-${idx}-${oIdx}">
                      <span style="font-weight:700; color:var(--text-muted); margin-right:0.35rem;">${String.fromCharCode(65 + oIdx)})</span>
                      <span>${opt}</span>
                    </button>
                  `).join("")}
                </div>
                <div class="feedback-banner" id="final-exp-${idx}">
                  <strong>განმარტება:</strong> ${qObj.explanation}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
  },

  checkFinalAnswer(qIdx, selectedIdx, correctIdx) {
    const exp = document.getElementById(`final-exp-${qIdx}`);
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`final-btn-${qIdx}-${i}`);
      if (btn) {
        btn.disabled = true;
        if (i === correctIdx) btn.classList.add("btn-success");
        else if (i === selectedIdx) btn.classList.add("btn-danger");
      }
    }

    if (exp) {
      exp.classList.add("show", selectedIdx === correctIdx ? "success" : "warning");
    }

    if (selectedIdx === correctIdx) {
      AppState.data.totalPoints += 15;
      AppState.save();
      showToast("სწორია! (+15 ⭐)");
    }
  },

  // მოსწავლის პირადი პროგრესი (Progress)
  renderProgress(c) {
    const modules = window.CHEM_MODULES || [];
    const completedTopics = AppState.data.completedTopics || [];
    const completedSims = AppState.data.completedSimulations || [];
    const totalSims = window.SIMULATION_METADATA ? window.SIMULATION_METADATA.length : 13;
    const pct = Math.min(100, Math.round(((completedTopics.length + completedSims.length) / (modules.length + totalSims)) * 100));

    c.innerHTML = `
      <div class="sim-catalog-header">
        <h1 style="font-size:2rem; font-weight:900; color:var(--text-main); margin-bottom:0.4rem;">
          📊 ჩემი პირადი პროგრესი
        </h1>
        <p style="color:var(--text-muted); font-size:1rem; line-height:1.5;">
          შენი მიღწევები, დაგროვილი ვარსკვლავები და შესწავლილი თემები
        </p>
      </div>

      <div class="hero-progress-card" style="margin-bottom:2rem;">
        <div class="hero-progress-header">
          <div class="hero-progress-title">
            <span>📈</span>
            <span>საერთო პროგრესი</span>
          </div>
          <div class="hero-progress-pct">${pct}%</div>
        </div>
        <div class="progress-track-bar">
          <div class="progress-fill-bar" style="width: ${pct}%;"></div>
        </div>
        <div class="stats-four-grid">
          <div class="stat-item-box">
            <div class="stat-item-val">⭐ ${AppState.data.totalPoints}</div>
            <div class="stat-item-lbl">დაგროვილი ქულა</div>
          </div>
          <div class="stat-item-box">
            <div class="stat-item-val">${completedTopics.length} / ${modules.length}</div>
            <div class="stat-item-lbl">შესწავლილი თემა</div>
          </div>
          <div class="stat-item-box">
            <div class="stat-item-val">${completedSims.length} / ${totalSims}</div>
            <div class="stat-item-lbl">ჩატარებული კვლევა</div>
          </div>
          <div class="stat-item-box">
            <div class="stat-item-val">${pct}%</div>
            <div class="stat-item-lbl">კურსის დონე</div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:2rem; padding:1.5rem;">
        <h3 class="card-title">შესწავლილი თემების ჩამონათვალი</h3>
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:1rem;">
          ${modules.map(m => {
            const isDone = completedTopics.includes(m.id);
            return `
              <span class="badge-tag" style="background:${isDone ? '#dcfce7' : '#f1f5f9'}; color:${isDone ? '#15803d' : '#64748b'}; font-size:0.875rem;">
                ${isDone ? '✓' : '○'} ${m.num}. ${m.title}
              </span>
            `;
          }).join("")}
        </div>
      </div>

      <div class="card" style="border:1px solid #fecaca; background:#fff5f5; padding:1.5rem;">
        <h3 style="color:#991b1b; font-size:1.15rem; margin-bottom:0.5rem;">⚠️ პროგრესის განულება</h3>
        <p style="color:#7f1d1d; font-size:0.875rem; margin-bottom:1rem;">
          თუ გსურს კურსის თავიდან გავლა, შეგიძლია გაანულო შენი ქულები და გავლილი თემები.
        </p>
        <div>
          <button onclick="Views.openResetModal()" class="btn btn-danger btn-sm">პროგრესის განულება</button>
        </div>
      </div>
    `;
  },

  openResetModal() {
    const modal = document.getElementById("reset-modal");
    if (modal) modal.classList.add("active");
  },

  closeResetModal() {
    const modal = document.getElementById("reset-modal");
    if (modal) modal.classList.remove("active");
  },

  confirmReset() {
    this.closeResetModal();
    AppState.resetProgress();
  },

  // 6. დახმარება (Help) — მოსწავლეზე ორიენტირებული გზამკვლევი
  renderHelp(c) {
    c.innerHTML = `
      <div class="module-view">
        <div class="module-header">
          <div class="module-meta">
            <span class="badge-tag">გზამკვლევი</span>
          </div>
          <h1 class="module-title">❓ როგორ გამოვიყენო ქიმიის სასწავლო რესურსი?</h1>
        </div>

        <div class="content-block">
          <h3>📚 როგორ ვისწავლო თემები?</h3>
          <p style="font-size:1.05rem; line-height:1.7; color:var(--text-muted);">
            გახსენი მენიუ <strong>„თემები“</strong> და აირჩიე გაკვეთილი. მარცხენა გვერდით პანელზე ნებისმიერ დროს შეგიძლია გადახვიდე სხვა თემაზე.
            თითოეული თემა დაყოფილია 11 სასწავლო რუბრიკად: მიზნები, გაიხსენე, ვირტუალური მოდელი, თეორია, ქიმია ჩვენ ირგვლივ, ფორმულები, ამოცანის ნიმუში, ცოდნის შემოწმება, მთავარი დასკვნა, საინტერესო ფაქტები და ტერმინები.
          </p>
        </div>

        <div class="content-block">
          <h3>🧪 როგორ ჩავატარო ვირტუალური ექსპერიმენტი?</h3>
          <p style="font-size:1.05rem; line-height:1.7; color:var(--text-muted); margin-bottom:0.75rem;">
            ვირტუალური ლაბორატორია მოიცავს 13 კვლევით სიმულაციას 10-საფეხურიანი სამეცნიერო ციკლით:
          </p>
          <ul style="padding-left:1.5rem; line-height:1.8; color:var(--text-muted);">
            <li><strong>1. მიზანი და კითხვა:</strong> გაეცანი კვლევის მიზანს და აღჭურვილობას.</li>
            <li><strong>2. ჩემი ვარაუდი:</strong> აირჩიე მეცნიერული ჰიპოთეზა ცდის ჩატარებამდე.</li>
            <li><strong>3. პარამეტრები:</strong> მართე ტემპერატურა, კონცენტრაცია და მოცულობა სლაიდერებით.</li>
            <li><strong>4. ექსპერიმენტი:</strong> დააჭირე „▶️ დაწყებას“ და უყურე ცოცხალ პროცესს ეკრანზე.</li>
            <li><strong>5. გაზომვები და ცხრილი:</strong> შეაგროვე მონაცემები რეალურ დროში.</li>
            <li><strong>6. დასკვნა:</strong> უპასუხე შემაჯამებელ კითხვას და დააგროვე 100 ⭐!</li>
          </ul>
        </div>

        <div class="content-block">
          <h3>🎮 სავარჯიშოები და თამაშები</h3>
          <p style="font-size:1.05rem; line-height:1.7; color:var(--text-muted);">
            გამოსცადე თავი 8 ინტერაქტიულ კატეგორიაში: მოვლენების დახარისხება, ნარევების დაყოფა, ვალენტობის კონსტრუქტორი, Mr კალკულატორი, ქიმიური სიმბოლოების ბაზა და ჭურჭლის ამოცნობა.
          </p>
        </div>

        <div class="content-block">
          <h3>⭐ ვარსკვლავები და ოფლაინ მუშაობა</h3>
          <p style="font-size:1.05rem; line-height:1.7; color:var(--text-muted);">
            შენი ყველა ვარსკვლავი, გავლილი თემა და ტესტის შედეგი ავტომატურად ინახება ბრაუზერში. რესურსი მუშაობს 100% ინტერნეტის გარეშე!
          </p>
        </div>
      </div>
    `;
  }
};

if (typeof window !== "undefined") {
  window.AppNav = AppNav;
  window.Router = Router;
  window.Views = Views;
  window.showToast = showToast;
}
