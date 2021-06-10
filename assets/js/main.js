let started = false;

let wordsCount = 390;
let feedCount = 20;

let timer = null;
let timeLimit = 59;

let currentIndex = 0;
let correctWords = Array();
let incorrectWords = Array();

let request = new XMLHttpRequest();
let requestUrl =
  "https://raw.githubusercontent.com/deddyromnan/TypingMeter/main/assets/json/english_200.json";
let response = Array();

request.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    response = randomWords(JSON.parse(this.responseText).words);
    startTest();
  }
};
request.open("GET", requestUrl, true);
request.send();

function randomWords(words) {
  let result = Array();
  for (let i = 0; i < wordsCount; i++) {
    let word = words[Math.floor(Math.random() * words.length)];
    result.push(word);
  }
  return result;
}

function spanifyWords(words) {
  let result = Array();
  words.forEach((word, i) => {
    result.push(`<span class="word" wordnumber="${i}">${word}</span> `);
  });
  return result;
}

function feedWords(startFrom = 0, count = feedCount) {
  let words = spanifyWords(response);
  let wordsSpan = "";
  for (let i = startFrom; i < startFrom + count; i++) {
    wordsSpan += words[i];
  }
  $("#paragraph-words").html(wordsSpan);
  highlightWord(startFrom);
}

function restartTest() {
  startTest();
}

function endTest() {
  clearInterval(timer);

  $("#input-typed").prop("disabled", true);
  $("#input-typed").val("");
  $("#card-result").removeClass("visually-hidden");

  let correctKeystrokes = 0;
  let incorrectKeystrokes = 0;

  correctWords.forEach((element) => {
    correctKeystrokes += element.length;
  });
  correctKeystrokes += correctWords.length; // add spaces keystrokes

  incorrectWords.forEach((element) => {
    let wrongIndex = element[0];
    let correctAnswer = response[wrongIndex];

    element[1].split("").forEach((letter, i) => {
      if (letter != correctAnswer.charAt(i)) incorrectKeystrokes++;
    });
  });

  let totalKeystrokes = correctKeystrokes + incorrectKeystrokes;
  let accuracy = ((correctKeystrokes / totalKeystrokes) * 100).toFixed(2);

  $("#result-wpm").text(`${correctWords.length} WPM`);
  $("#result-keystrokes").text(
    `(${correctKeystrokes} | ${incorrectKeystrokes}) ${totalKeystrokes}`
  );
  $("#result-accuracy").text(accuracy);
  $("#result-correct-words").text(correctWords.length);
  $("#result-wrong-words").text(incorrectWords.length);
}

function startTest() {
  response = randomWords(response);
  started = false;
  currentIndex = 0;
  correctWords = Array();
  incorrectWords = Array();
  feedWords();
  resetTimer();
  $("#spinner-words").addClass("visually-hidden");
  $("#input-typed").prop("disabled", false);
  $("#input-typed").val("");
  $("#input-typed").focus();
}

function startTimer() {
  started = true;
  let seconds = timeLimit;
  timer = setInterval(() => {
    if (seconds <= 0) endTest();
    $("#span-timer").text(`00:${seconds < 10 ? "0" : ""}${seconds % 60}`);
    seconds--;
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  $("#span-timer").text("01:00");
}

function highlightWord(index = 0, color = "bg-secondary") {
  let previousWord = $(`span[wordnumber="${index - 1}"]`);
  previousWord.removeClass(color);

  let currentWord = $(`span[wordnumber="${index}"]`);
  currentWord.removeClass();
  currentWord.addClass("active");
}

function setWordColor(index = 0, color = "text-body") {
  let currentWord = $(`span[wordnumber="${index}"]`);
  currentWord.removeClass();
  currentWord.addClass(color);
}

$("#button-restart").click(function () {
  restartTest();
});

$("#input-typed").keyup(function (event) {
  let typed = $("#input-typed").val();
  let currentWord = $(`span[wordnumber="${currentIndex}"]`).text();
  if (!started && typed.length == 1) startTimer();

  if (event.key == " ") {
    typed = typed.slice(0, typed.length - 1);

    if (typed === currentWord) {
      correctWords.push(typed);
      setWordColor(currentIndex, "text-success");
    } else {
      incorrectWords.push([currentIndex, typed]);
      setWordColor(currentIndex, "text-danger");
    }

    $("#input-typed").val("");
    if (typed.length > 0) currentIndex++;
    if (currentIndex % feedCount == 0) feedWords(currentIndex);
    highlightWord(currentIndex);
  } else {
    currentWord = currentWord.slice(0, typed.length);
    let correct = typed == currentWord;
    highlightWord(currentIndex, correct ? "bg-secondary" : "bg-danger");
  }
});
