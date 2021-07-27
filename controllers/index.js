import TypingTest from "../models/TypingTest.js";
import Timer from "../models/Timer.js";
import ResultHistory from "../models/ResultHistory.js";

let currentIndex = 0;
let typingTest;
let timer = new Timer();
let history = new ResultHistory();

$(document).ready(() => {
  refreshHistory();
  fetchWords(undefined, (response) => {
    let words = JSON.parse(response).words;
    typingTest = new TypingTest(words);
    startTest();
  });
});

$("#select-language").on("change", () => {
  let value = $("#select-language").val();
  $("#feed-container").addClass("visually-hidden");
  $("#feed-spinner").removeClass("visually-hidden");

  fetchWords(value, (response) => {
    let words = JSON.parse(response).words;
    typingTest = new TypingTest(words);
    startTest();
  });
});

function startTest() {
  currentIndex = 0;
  updateFeed();
  timer.reset();
  $("#result-container").addClass("visually-hidden");
  $("#feed-spinner").addClass("visually-hidden");
  $("#feed-container").removeClass("visually-hidden");
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
  $("#result-accuracy").text(result.accuracy + "%");
  $("#result-percentile").text(result.percentile + "%");
  $("#result-correct-keystrokes").text(result.correctKeys);
  $("#result-wrong-keystrokes").text(result.incorrectKeys);
  $("#result-correct-words").text(result.correctWords);
  $("#result-wrong-words").text(result.incorrectWords);

  history.save(result);
  refreshHistory();
}

$("#button-restart").click(function () {
  typingTest.reset();
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

function fetchWords(fileName = "english_200", onReady) {
  let url = `https://raw.githubusercontent.com/deddyromnan/TypingMeter/main/assets/json/${fileName}.json`;

  // alert(fileName);

  let request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      onReady(this.responseText);
    }
  };
  request.open("GET", url, true);
  request.send();
}

function refreshHistory() {
  const results = history.findAll();
  $("#table-history").find("tbody").empty();

  if (results.length === 0) {
    $("#table-history").find("tbody").append(`
    <tr>
      <td colspan="6"><i>Result history is empty.</i></td>
    </tr>
    `);
  }

  results.forEach((result, i) => {
    $("#table-history").find("tbody").append(`
      <tr>
      <td>${result.wpm}</td>
      <td>${result.accuracy}%</td>
      <td>${result.percentile}%</td>
      <td>
          <span class="badge rounded-pill bg-success">
          <i class="bi bi-check fw-bold"></i>${result.correctKeys}
          </span>
          <span class="badge rounded-pill bg-danger">
          <i class="bi bi-x fw-bold"></i>${result.incorrectKeys}
          </span>
          </td>
          <td>
          <span class="badge rounded-pill bg-success">
          <i class="bi bi-check fw-bold"></i>${result.correctWords}
          </span>
          <span class="badge rounded-pill bg-danger">
          <i class="bi bi-x fw-bold"></i>${result.incorrectWords}
          </span>
          </td>
          <td>${moment(result.unix).fromNow()}</td>
      </tr>
        `);
  });
}

$("#button-clear-history").click(() => {
  history.clear();
  refreshHistory();
});
