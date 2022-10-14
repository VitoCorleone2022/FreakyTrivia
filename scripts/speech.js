// accessibility: voice recognition

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var commands = [
  'play',
  'next',
  'replay',
  'true',
  'false',
  'question',
  'challenge',
  'yes',
  'finish',
  'freaky trivia'
];

let phrasePara = document.querySelector('.phrase');
let resultPara = document.querySelector('.voiceRecorded');
let diagnosticPara = document.querySelector('.speechOutput');

let voiceBtn = document.getElementById('voice-btn')

function talkToMe() {
  voiceBtn.disabled = true;
  $('#voice-btn').html('...listening <div id="listening-symbol">&#8283;</div>')

  // To ensure case consistency while checking with the returned output text 
  let play = commands[0].toLowerCase();
  let next = commands[1].toLowerCase();
  let replay = commands[2].toLowerCase();
  let trueBtn = commands[3].toLowerCase();
  let falseBtn = commands[4].toLowerCase();
  let askQuestion = commands[5].toLowerCase();
  let challenge = commands[6].toLowerCase();
  let yes = commands[7].toLowerCase();
  let finish = commands[8].toLowerCase();
  let frikitrivia = commands[9].toLowerCase();

  //Speech recognition list
  let recognition = new SpeechRecognition();
  let speechRecognitionList = new SpeechGrammarList();
  for (let i = 0; i < commands.length; i++) {
    speechRecognitionList.addFromString(commands[i], 1);
  }
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-UK';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  // recognition.continuous = true;
  // console.log(recognition.grammars)

  recognition.start();

  recognition.onresult = function (event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object 
    var speechResult = event.results[0][0].transcript.toLowerCase();
    diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';

    //command play
    switch (speechResult) {
      case play:
        if ($('#user-area').is(':visible')) {
          resultPara.textContent = `I heard ${play} correctly `;
          resultPara.classList.add("right");
          $("#play-btn").trigger("click")
          $("#voice-btn").delay(2000).trigger("click")
        }
        break;
      case next:
        if ($('#solution').html() !== '') {
          resultPara.textContent = `I heard ${next} correctly `;
          resultPara.classList.add("right");
          $("#next-btn").trigger("click")
          $("#voice-btn").delay(2000).trigger("click")
        }
        break;

      case trueBtn:
        resultPara.textContent = `I heard ${trueBtn} correctly `;
        resultPara.classList.add("right");
        $("div:contains('True')").trigger("click")
        $("#voice-btn").delay(2000).trigger("click")
        break;

      case falseBtn:
        resultPara.textContent = `I heard ${falseBtn} correctly `;
        resultPara.classList.add("right");
        $("div:contains('False')").trigger("click")
        $("#voice-btn").delay(2000).trigger("click")
        break;

      case replay:
        if ($('#replay-btn').is(':visible')) {
          console.log(replay);
          resultPara.textContent = `I heard ${replay} correctly `;
          $("#replay-btn").trigger("click")
          $("#voice-btn").delay(2000).trigger("click")
        }
        break;

      case askQuestion:
        if ($('#game').is(':visible')) {
          resultPara.textContent = `I heard ${askQuestion} correctly `;
          resultPara.classList.add("right");
          $('#speaker-btn').trigger("click")
          $("#voice-btn").delay(2000).trigger("click")
        }
        break;

      case challenge:
        resultPara.textContent = `I heard ${challenge} correctly `;
        resultPara.classList.add("right");
        $('#intro-btn').trigger("click")
        $("#voice-btn").delay(2000).trigger("click")
        break;

      case yes:
        if ($('#landing').is(':visible')) {
          resultPara.textContent = `I heard ${yes} correctly `;
          resultPara.classList.add("right");
          $('#yes-btn').trigger("click")
          $("#voice-btn").delay(2000).trigger("click")
        }
        break;

      case finish:
        if ($('#game').is(':visible')) {
          resultPara.textContent = `I heard ${finish} correctly `;
          resultPara.classList.add("right");
          $('#finish-btn').trigger("click")
          $("#voice-btn").delay(2000).trigger("click")
        }
        break;

      case frikitrivia:
        resultPara.textContent = `I heard ${frikitrivia} correctly `;
        resultPara.classList.add("right");
        let msg = new SpeechSynthesisUtterance();
        msg.text = 'Frikitrivia is the best app ever. Please suscribe to Frikitrivia channel for updates. And most importantly, money, money is what we need!'
        msg.lang = 'en-GB'
        msg.pitch = 2
        msg.rate = 1
        window.speechSynthesis.speak(msg);
        $("#voice-btn").delay(2000).trigger("click")
        break;

      default:
        resultPara.textContent = 'That is not an option my friend.';
        resultPara.classList.remove("right");
        resultPara.classList.add("wrong");
        $("#voice-btn").delay(2000).trigger("click")
        // break;
    }

    console.log('Confidence: ' + event.results[0][0].confidence);
  }
  recognition.onspeechend = function () {
    recognition.stop();
    voiceBtn.disabled = false;
    voiceBtn.textContent = 'FrikiTrivia';
  }
  recognition.onerror = function (event) {
    voiceBtn.disabled = false;
    voiceBtn.textContent = 'FrikiTrivia';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }
  recognition.onaudiostart = function (event) {
    //Fired when the user agent has started to capture audio.
    console.log('SpeechRecognition.onaudiostart');
  }
  recognition.onaudioend = function (event) {
    //Fired when the user agent has finished capturing audio.
    console.log('SpeechRecognition.onaudioend');
  }
  recognition.onend = function (event) {
    //Fired when the speech recognition service has disconnected.
    console.log('SpeechRecognition.onend');
  }
  recognition.onnomatch = function (event) {
    //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
    console.log('SpeechRecognition.onnomatch');
  }
  recognition.onsoundstart = function (event) {
    //Fired when any sound — recognisable speech or not — has been detected.
    console.log('SpeechRecognition.onsoundstart');
  }
  recognition.onsoundend = function (event) {
    //Fired when any sound — recognisable speech or not — has stopped being detected.
    console.log('SpeechRecognition.onsoundend');
  }
  recognition.onspeechstart = function (event) {
    //Fired when sound that is recognised by the speech recognition service as speech has been detected.
    console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function (event) {
    //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    console.log('SpeechRecognition.onstart');
  }
}

const checkBrowserCompatibility = () => {
  if ("speechSynthesis" in window) {
    console.log("Web Speech API supported!")
    voiceBtn.addEventListener('click', talkToMe);
    // window.addEventListener('click', talkToMe);
  } else {
    console.log("Web Speech API not supported :-(")
    $('#ai').hide()
  }
}

checkBrowserCompatibility()





