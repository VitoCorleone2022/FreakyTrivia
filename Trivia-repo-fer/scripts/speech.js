
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
  'challenge'
];

let phrasePara = document.querySelector('.phrase');
let resultPara = document.querySelector('.voiceRecorded');
let diagnosticPara = document.querySelector('.speechOutput');

let voiceBtn = document.getElementById('voice-btn')

function talkToMe() {
  voiceBtn.disabled = true;
  voiceBtn.textContent = '... listening';

  // To ensure case consistency while checking with the returned output text 
  let play = commands[0].toLowerCase();
  let next = commands[1].toLowerCase();
  let replay = commands[2].toLowerCase();
  let trueBtn = commands[3].toLowerCase();
  let falseBtn = commands[4].toLowerCase();
  let askQuestion = commands[5].toLowerCase();
  let challenge = commands[6].toLowerCase();

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
        if ($('#landing').is(':visible')) {
          resultPara.textContent = `I heard ${play} correctly `;
          resultPara.style.background = 'lime';
          $("#play-btn").trigger("click")
          $("#voice-btn").delay(2000).trigger("click")
        }
        
        break;
        case next:
          if ($('#solution').html() !== '') {
          resultPara.textContent = `I heard ${next} correctly `;
          resultPara.style.background = 'lime';
          $("#next-btn").trigger("click")
          $("#voice-btn").delay(2000).trigger("click")
        }
        break;

      case trueBtn:
        resultPara.textContent = `I heard ${trueBtn} correctly `;
        resultPara.style.background = 'lime';
        $("div:contains('True')").trigger("click")
        $("#voice-btn").delay(2000).trigger("click")
        break;

      case falseBtn:
        resultPara.textContent = `I heard ${falseBtn} correctly `;
        resultPara.style.background = 'lime';
        $("div:contains('False')").trigger("click")
        $("#voice-btn").delay(2000).trigger("click")
        break;

      case replay:
        if ($('#replay-btn').is(':visible')) {
          console.log(replay);
          resultPara.textContent = `I heard ${replay} correctly `;
          resultPara.style.background = 'lime';
          $("#replay-btn").trigger("click")
          $("#voice-btn").delay(2000).trigger("click")
        }
        break;

      case askQuestion:
        resultPara.textContent = `I heard ${askQuestion} correctly `;
        resultPara.style.background = 'lime';
        $('#speaker-btn').trigger("click")
        $("#voice-btn").delay(2000).trigger("click")
        break;

      case challenge:
        resultPara.textContent = `I heard ${challenge} correctly `;
        resultPara.style.background = 'lime';
        $('#intro-btn').trigger("click")
        $("#voice-btn").delay(2000).trigger("click")

        break;

      default:
        resultPara.textContent = 'That is not an option my friend.';
        resultPara.style.background = 'red';
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



$('#intro').click(() => {
  let introTalk = $('#intro').text()
  GAME.sayThis(introTalk);
})






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





