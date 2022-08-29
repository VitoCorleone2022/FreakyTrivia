//game variables
const GAME = {
  life: 3,
  questionCount: -1,  //array
  score: 0,
  clickCount: 0,
  numberOfquestions: 10,
  displayQuestionNumber: 0,
  questions: null,

  async loadQuestions() {
    await axios
      .get("https://opentdb.com/api.php?amount=10&category=31&type=boolean")
      .then((questions) => {
        console.log(this);
        console.log(questions.data.results);
        this.questions = questions.data.results
      })
      .catch((err) => {
        console.log("rejected: ", err);
      });
  },

  createBooleanQuestion() {
    console.log("boolean");
    let wrongAnswer = this.questions[this.questionCount].incorrect_answers[0];
    let rightAnswer = this.questions[this.questionCount].correct_answer;

    $("#question-card").append(
      `<div id="wrong-btn" class="btn wrong-btn"> ${wrongAnswer} </div>`
    );
    $("#question-card").append(
      `<div id="right-btn" class="btn"> ${rightAnswer} </div>`
    );
    //interaction
    $("#right-btn").click(() => {
      console.log("this is the right answer:" + rightAnswer);
      $("#solution").text("Correct :)");
      $("#right-btn").addClass("right");
      $("#right-btn").off("click");
      $("#wrong-btn").off("click");
      this.nextButton();
      this.updateScoreCounter();
      this.checkGameOver();
    });

    $("#wrong-btn").click(() => {
      console.log("this is the wrong answer:" + wrongAnswer);
      $("#solution").text("Wrong :c");
      $("#wrong-btn").addClass("wrong");
      $("#right-btn").off("click");
      $("#wrong-btn").off("click");
      this.nextButton();
      this.updateLife();
      this.checkGameOver();
    });
  },

  createMultipleQuestion() {
    let wrongAnswer = this.questions[this.questionCount].incorrect_answers;
    let rightAnswer = this.questions[this.questionCount].correct_answer;

    $("#question-card").append(
      `<div id="right-btn" class="btn"> ${rightAnswer} </div>
           <div class="btn wrong-btn"> ${wrongAnswer[0]}</div>
           <div class="btn wrong-btn"> ${wrongAnswer[1]}</div>
           <div class="btn wrong-btn"> ${wrongAnswer[2]}</div>`
    );
    //interaction

    $("#right-btn").click(this.rightButtonClick.bind(this))
    $(".wrong-btn").click(this.wrongButtonClick.bind(this))
  },

  nextQuestion() {
    this.questionCount++
    this.displayQuestionNumber++
    this.updateQuestionCounter()
    $("#question-card").html(
      `<div id="question"> ${this.questions[this.questionCount].question} <span id="speaker-btn">&#9834;</span></div>`
    );

    $('#speaker-btn').click(() => {
      let questionTalk = $('#question').text()
      this.sayThis(questionTalk);
    })


    if (this.questions[this.questionCount].type === "boolean") {
      this.createBooleanQuestion();
      this.orderAnswersRandomly()
    }

    if (this.questions[this.questionCount].type === "multiple") {
      this.createMultipleQuestion();
      this.orderAnswersRandomly()
    }
  },

  updateQuestionCounter() {
    $("#questionCount").text(`${this.displayQuestionNumber}/10`)
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
      $("#next-btn").css("display", "none");
      $("#finalScore").text(`Your final score is: ${this.score}`);
      $("#finish-btn").fadeIn();
    }
  },

  checkGameOver() {
    if (++this.clickCount === this.numberOfquestions) {
      console.log("game over!");
      $("#next-btn").css("display", "none");
      $("#finish-btn").fadeIn();
      $("#finalScore").text(`Your final score is: ${this.score}`);
    }
  },

  nextButton() {
    $("#next-btn").fadeIn();
  },

  wrongButtonClick(event) {
    this.offButtons();
    this.nextButton();
    this.checkGameOver();

    $("#solution").text("Wrong :c");
    event.target.classList.add("wrong");
    this.updateLife();
  },

  rightButtonClick() {
    this.offButtons();
    this.nextButton();
    this.checkGameOver();

    $("#solution").text("Correct :)");
    $("#right-btn").addClass("right");
    this.updateScoreCounter();
  },

  offButtons() {
    $("#right-btn").off('click').toggleClass('not-clickable')
    $(".wrong-btn").off('click').toggleClass('not-clickable')
  },

  orderAnswersRandomly() {
    //multiple answers
    if ($('.wrong-btn').length > 1) {
      let randomIndex = Math.floor(Math.random() * 4)
      console.log(randomIndex)
      $('.wrong-btn').eq(randomIndex).before($('#right-btn'))
      if (randomIndex === 0) { $('.wrong-btn').eq(randomIndex).before($('#right-btn')) }
      if (randomIndex === 1) { $('.wrong-btn').eq(randomIndex).before($('#right-btn')) }
      if (randomIndex === 2) { $('.wrong-btn').eq(randomIndex).before($('#right-btn')) }
      if (randomIndex === 3) { $('.wrong-btn').eq(2).after($('#right-btn')) }
    } else {
      //true or false
      let randomNumber = Math.floor(Math.random() * 10)
      if (randomNumber < 5) { $('.wrong-btn').eq(0).before($('#right-btn')) }
      else { $('.wrong-btn').eq(0).after($('#right-btn')) }
    }
  },

  sayThis(whatever) {
    let msg = new SpeechSynthesisUtterance();
    msg.text = whatever
    msg.lang = 'en-GB'
    msg.pitch = 2
    msg.rate = 1
    window.speechSynthesis.speak(msg);
    console.log(msg)
    console.log(whatever)
  },

  renderAvailableCommands() {
    // available commands
    if ($('#landing').is(':visible')) {
      $('#available-commands').text('yes | challenge | Freaky trivia ')
    }
    if ($('#user-area').is(':visible')) {
      $('#available-commands').text('play')
    }

    if ($('#game').is(':visible')) {
      $('#available-commands').text('question | true | false | next | finish')
    }

    if ($('#score').is(':visible')) {
      $('#available-commands').text('replay')
    }

  },

  createUser() {

  },

  deleteAllUsers() {
    window.localStorage.clear();
    console.log(window.localStorage)

  },


  displayUsers() {

  },

  reset() {
    this.life = 3;
    this.questionCount = 0;
    this.score = 0;
    this.clickCount = 0;
    $("#solution").text("");
    $("#life").text("Life: " + this.life);
    $("#scoreCount").text(`Score: ${this.score}`);
    $("#questionCount").text(`${this.questionCount}/10`);
    $("#next-btn").css("display", "none");
    $("#score").fadeOut();
    $("#landing").fadeIn();
  },

  async init() {
    await GAME.loadQuestions();

    $("#yes-btn").click(() => {
      $("#landing").fadeOut();
      $("#user-area").fadeIn();
      this.updateQuestionCounter()
      this.nextQuestion();
    });

    $("#play-btn").click(() => {
      $("#user-area").fadeOut();
      $("#game").fadeIn();
      this.updateQuestionCounter()
      this.nextQuestion();
    });

    $("#next-btn").click(() => {
      this.nextQuestion();
      $("#solution").text("");
      $("#next-btn").fadeOut();
    });

    $("#replay-btn").click(() => {
      this.reset();
    });

    $("#finish-btn").click(() => {
      $("#game").fadeOut();
      $("#score").fadeIn();
      $("#finish-btn").fadeOut();
    });

  },
};

(async function () {
  await GAME.init();
})();


// GAME.createUser()