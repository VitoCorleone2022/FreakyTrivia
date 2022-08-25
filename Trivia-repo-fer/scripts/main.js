//game variables
const GAME = {
  life: 3,
  questionCount: 0,
  score: 0,
  clickCount: 0,
  questions: null,

  async loadQuestions() {
    await axios
      .get("https://opentdb.com/api.php?amount=10&category=31&type=boolean")
      .then((questions) => {
        console.log(this);
        this.questions = questions.data.results;
      })
      .catch((err) => {
        console.log("rejected: ", err);
      });
  },

  createBooleanQuestion() {
    console.log("boolean");
    let wrongAnswer = this.questions[this.questionCount].incorrect_answers[0];
    let rightAnswer = this.questions[this.questionCount].correct_answer;

    $("#question").append(
      `<div id="wrong-btn" class="btn"> ${wrongAnswer} </div>`
    );
    $("#question").append(
      `<div id="right-btn" class="btn"> ${rightAnswer} </div>`
    );

    //interaction
    $("#right-btn").click(() => {
      console.log("this is the right answer:" + rightAnswer);
      $("#solution").text("Correct :)");
      $("#right-btn").addClass("right");
      $("#right-btn").off("click");
      $("#wrong-btn").off("click");
      this.checkGameOver();
      this.updateScoreCounter();
      this.nextButton();
    });

    $("#wrong-btn").click(() => {
      console.log("this is the wrong answer:" + wrongAnswer);
      $("#solution").text("Wrong :c");
      $("#wrong-btn").addClass("wrong");
      $("#right-btn").off("click");
      $("#wrong-btn").off("click");
      this.checkGameOver();
      this.updateLife();
      this.nextButton();
    });
  },

  createMultipleQuestion() {
    let wrongAnswer = questions.data.results[0].incorrect_answers;
    let rightAnswer = questions.data.results[0].correct_answer;
    $("#question").append(
      `<div id="right-btn" class="btn"> ${rightAnswer} </div>
           <div class="btn wrong-btn"> ${wrongAnswer[0]}</div>
           <div class="btn wrong-btn"> ${wrongAnswer[1]}</div>
           <div class="btn wrong-btn"> ${wrongAnswer[2]}</div>`
    );

    document
      .getElementById("right-btn")
      .addEventListener("click", rightButtonClick);

    document.querySelectorAll(".wrong-btn").forEach((button) => {
      button.addEventListener("click", wrongButtonClick);
    });
  },

  nextQuestion() {
    $("#question").html(
      `<div> ${this.questions[this.questionCount].question} </div>`
    );

    if (this.questions[this.questionCount].type === "boolean") {
      this.createBooleanQuestion();
    }

    if (this.questions[this.questionCount].type === "multiple") {
      this.createMultipleQuestion();
    }
  },
  updateQuestionCounter() {
    $("#questionCount").text(`${this.questionCount++}/10`);
  },
  updateScoreCounter() {
    this.score++;
    $("#scoreCount").text(`Score: ${this.score}`);
  },
  updateLife() {
    this.life--;
    $("#life").text("Life: " + this.life);
    if (this.life === 0) {
      console.log("game over!");
      $("#game").fadeOut();
      $("#finalScore").text(`Your final score is: ${this.score}`);
      $("#score").fadeIn();
    }
  },
  checkGameOver() {
    if (++this.clickCount === 10) {
      $("#game").fadeOut();
      $("#finalScore").text(`Your final score is: ${this.score}`);
      $("#score").fadeIn();
    }
  },
  nextButton() {
    $("#next-btn").fadeIn();
  },
  wrongButtonClick(event) {
    this.offButtons();
    this.nextButton();
    this.clickCounter();

    $("#solution").text("Wrong :c");
    event.target.classList.add("wrong");
    this.updateLife();
  },
  rightButtonClick() {
    this.offButtons();
    this.nextButton();
    this.clickCounter();

    $("#solution").text("Correct :)");
    $("#right-btn").addClass("right");
    this.updateScoreCounter();
  },
  offButtons() {
    console.log(document.getElementById("right-btn"));
    document
      .getElementById("right-btn")
      .removeEventListener("click", rightButtonClick);

    document.querySelectorAll(".wrong-btn").forEach((elem) => {
      elem.removeEventListener("click", wrongButtonClick);
    });
  },
  reset() {
    this.life = 3;
    this.questionCount = 0;
    this.score = 0;
    this.clickCount = 0;
    $("#life").text("Life: " + this.life);
    $("#scoreCount").text(`Score: ${this.score}`);
    $("#questionCount").text(`${this.questionCount}/10`);
    $("#next-btn").css("display", "none");
    $("#score").fadeOut();
    $("#landing").fadeIn();
  },
  async init() {
    await GAME.loadQuestions();

    $("#play-btn").click(() => {
      $("#landing").fadeOut();
      $("#game").fadeIn();
      this.nextQuestion();
    });

    $("#next-btn").click(() => {
      this.nextQuestion();
      $("#solution").text("");
      $("#next-btn").fadeOut();
    });

    $("#replay-btn").click(() => {
      reset();
    });
  },
};

(async function () {
  await GAME.init();
})();
