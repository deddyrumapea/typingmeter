import TypingTest from "../models/TypingTest.js";
import Timer from "../models/Timer.js";

let currentIndex = 0;
let typingTest;
let timer = new Timer();

$(document).ready(() => {
  let url =
    "https://raw.githubusercontent.com/deddyromnan/TypingMeter/main/assets/json/english_200.json";
  sendRequest(url, (response) => {
    let words = JSON.parse(response).words;
    typingTest = new TypingTest(words);
    startTest();
  });
});

function startTest() {
  currentIndex = 0;
  typingTest.randomizeWords();
  updateFeed();
  timer.reset();
  $("#result-container").addClass("visually-hidden");
  $("#feed-container").removeClass("visually-hidden");
  $("#feed-spinner").addClass("visually-hidden");
  $("#span-timer").text("01:00");
  $("#input-typed").prop("disabled", false);
  $("#input-typed").val("");
  $("#input-typed").focus();
}

function updateFeed(startFrom = 0) {
  let feed = typingTest.getFeed(startFrom);
  $("#feed-container").html(feed);
  setWordActive(startFrom);
}

function endTest() {
  clearInterval(timer);

  $("#input-typed").prop("disabled", true);
  $("#input-typed").val("");
  $("#result-container").removeClass("visually-hidden");
  $("#feed-container").addClass("visually-hidden");

  let result = typingTest.getResult();

  $("#result-wpm").text(`${result.wpm} WPM`);
  $("#result-keystrokes").text(
    `(${result.correctKeys} | ${result.incorrectKeys}) ${result.totalKeys}`
  );
  $("#result-accuracy").text(result.accuracy + "%");
  $("#result-correct-words").text(result.correctWords);
  $("#result-wrong-words").text(result.incorrectWords);
}

$("#button-restart").click(function () {
  startTest();
});

function setWordActive(index) {
  getCurrentWord(index).removeClass("word-error");
  getCurrentWord(index).addClass("word-active");
}

function setWordError(index) {
  getCurrentWord(index).removeClass("word-active");
  getCurrentWord(index).addClass("word-error");
}

function setWordCorrect(index) {
  getCurrentWord(index).addClass("word-correct");
}

function setWordIncorrect(index) {
  getCurrentWord(index).addClass("word-incorrect");
}

function startTimer() {
  let onTick = (seconds) => {
    $("#span-timer").text(`00:${seconds < 10 ? "0" : ""}${seconds % 60}`);
  };

  let onFinish = () => {
    endTest();
    timer.reset();
  };
  timer.start(onTick, onFinish);
}

$("#input-typed").keyup((event) => {
  let typed = $("#input-typed").val();
  let word = getCurrentWord(currentIndex).text();

  if (!timer.started && typed.length == 1) startTimer();

  if (event.key == " ") {
    typed = typed.slice(0, typed.length - 1);

    if (typed === word) {
      typingTest.addCorrectWord(currentIndex);
      setWordCorrect(currentIndex, "text-success");
    } else {
      typingTest.addIncorrectWord(currentIndex, typed);
      setWordIncorrect(currentIndex, "text-danger");
    }

    $("#input-typed").val("");
    if (typed.length > 0) currentIndex++;
    if (currentIndex % typingTest.feedCount == 0) updateFeed(currentIndex);
    setWordActive(currentIndex);
  } else {
    word = word.slice(0, typed.length);
    if (typed == word) setWordActive(currentIndex);
    else setWordError(currentIndex);
  }
});

function getCurrentWord() {
  return $(`#word-${currentIndex}`);
}

function sendRequest(url, onReady) {
  let request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      onReady(this.responseText);
    }
  };
  request.open("GET", url, true);
  request.send();
}
