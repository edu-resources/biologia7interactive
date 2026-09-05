// ქიმია VII კლასი — მოსწავლის პროგრესისა და შეფასების მართვა
// LocalStorage-ზე დაფუძნებული მკაცრი, სამართლიანი შეფასების სისტემა

const AppState = {
  progressKey: "chem7_student_progress",
  data: {
    completedTopics: [],
    completedSimulations: [],
    completedActivities: [],
    quizScores: {},
    simulationRecords: {}, // ჩატარებული ცდების მონაცემები
    totalPoints: 0,
    lastVisited: "home"
  },

  init() {
    try {
      const saved = localStorage.getItem(this.progressKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.data = Object.assign(this.data, parsed);
      }
    } catch (e) {
      console.warn("LocalStorage unavailable:", e);
    }
    this.updateHeaderProgress();
  },

  save() {
    try {
      localStorage.setItem(this.progressKey, JSON.stringify(this.data));
    } catch (e) {
      console.warn("Could not save to LocalStorage:", e);
    }
    this.updateHeaderProgress();
  },

  // თემის შესწავლის დაფიქსირება (+50 ქულა)
  markTopicComplete(topicId) {
    if (!this.data.completedTopics.includes(topicId)) {
      this.data.completedTopics.push(topicId);
      this.data.totalPoints += 50;
      this.save();
      showToast("🎉 თემა წარმატებით დამუშავდა! (+50 ქულა)");
    }
  },

  // სიმულაციის სრული 10-საფეხურიანი ციკლის დასრულება (+100 ქულა)
  // ქულა ენიჭება მხოლოდ მაშინ, როცა მოსწავლე რეალურად შეცვლის პარამეტრებს,
  // ჩაატარებს ცდას და უპასუხებს დასკვნის კითხვას!
  completeSimulation(simId, recordData) {
    if (!this.data.completedSimulations.includes(simId)) {
      this.data.completedSimulations.push(simId);
      this.data.totalPoints += 100;
    }
    if (!this.data.simulationRecords) {
      this.data.simulationRecords = {};
    }
    this.data.simulationRecords[simId] = recordData;
    this.save();
    showToast("🏆 კვლევა წარმატებით დასრულდა! (+100 ქულა)");
  },

  // სავარჯიშოს დასრულება (+40 ქულა)
  markActivityComplete(actId) {
    if (!this.data.completedActivities.includes(actId)) {
      this.data.completedActivities.push(actId);
      this.data.totalPoints += 40;
      this.save();
      showToast("⭐ სავარჯიშო შესრულებულია! (+40 ქულა)");
    }
  },

  // ტესტის შედეგის ჩაწერა
  recordQuizScore(quizId, score, total) {
    if (!this.data.quizScores) this.data.quizScores = {};
    const prevScore = this.data.quizScores[quizId]?.score || 0;
    this.data.quizScores[quizId] = { score, total, date: new Date().toLocaleDateString("ka-GE") };
    
    // ქულების დამატება მხოლოდ გაუმჯობესებულ შედეგზე
    if (score > prevScore) {
      const addedPoints = (score - prevScore) * 10;
      this.data.totalPoints += addedPoints;
    }
    this.save();
    showToast(`📝 ტესტი დასრულდა: ${score} / ${total} სწორი პასუხი!`);
  },

  // პროგრესის განულება
  resetProgress() {
    this.data = {
      completedTopics: [],
      completedSimulations: [],
      completedActivities: [],
      quizScores: {},
      simulationRecords: {},
      totalPoints: 0,
      lastVisited: "home"
    };
    try {
      localStorage.removeItem(this.progressKey);
    } catch (e) {}
    this.save();
    showToast("🔄 პროგრესი წარმატებით განულდა!");
    Router.navigate("progress");
  },

  // ჰედერში პროგრესის განახლება
  updateHeaderProgress() {
    const totalItems = (window.CHEM_MODULES ? window.CHEM_MODULES.length : 17) + (window.SIMULATION_METADATA ? window.SIMULATION_METADATA.length : 13);
    const completed = this.data.completedTopics.length + this.data.completedSimulations.length;
    const pct = Math.min(100, Math.round((completed / Math.max(1, totalItems)) * 100));

    const elBadge = document.getElementById("header-progress-pct");
    const elScore = document.getElementById("starCount") || document.getElementById("headerStarCount") || document.getElementById("header-score");
    if (elBadge) elBadge.textContent = `${pct}%`;
    if (elScore) elScore.textContent = `${this.data.totalPoints}`;
  }
};

if (typeof window !== "undefined") {
  window.AppState = AppState;
}
