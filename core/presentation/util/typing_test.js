import Speed from "../../data/static/speed.js";

export default class TypingTest {
  wordsCount = 0;
  feedCount = 0;
  words = null;
  feedWords = null;
  correctInput = Array();
  incorrectInput = Array();

  constructor(words, wordsCount = 390, feedCount = 20) {
    this.wordsCount = wordsCount;
    this.feedCount = feedCount;
    this.words = words;
    this.randomizeFeedWords();
  }

  reset() {
    this.randomizeFeedWords();
    this.correctInput = Array();
    this.incorrectInput = Array();
  }

  randomizeFeedWords() {
    this.feedWords = Array();

    for (let i = 0; i < this.wordsCount; i++) {
      let randomIndex = Math.floor(Math.random() * (this.words.length - 1));
      this.feedWords.push(this.words[randomIndex]);
    }
  }

  addCorrectWord(index) {
    this.correctInput.push(index);
  }

  addIncorrectWord(index, typed) {
    this.incorrectInput.push({ index: index, typed: typed });
  }

  getFeed(startFrom = 0) {
    let result = "";

    for (let i = startFrom; i < startFrom + this.feedCount; i++) {
      result += this.getWordSpan(i);
    }

    return result;
  }

  getWordSpan(index) {
    return `<span class="word" id="word-${index}">${this.feedWords[index]}</span> `;
  }

  getResult() {
    return {
      unix: moment().valueOf(),
      wpm: this.getWpm(),
      accuracy: this.getAccuracy(),
      percentile: this.getPercentile(this.getCorrectKeys()),
      correctKeys: this.getCorrectKeys(),
      incorrectKeys: this.getIncorrectKeys(),
      correctWords: this.correctInput.length,
      incorrectWords: this.incorrectInput.length,
    };
  }

  getWpm() {
    return Math.round(this.getCorrectKeys() / 5);
  }

  getCorrectKeys() {
    let correctKeys = 0;

    this.correctInput.forEach((index) => {
      let word = this.feedWords[index];
      correctKeys += word.length + 1; // add space keystrokes
    });

    return correctKeys;
  }

  getIncorrectKeys() {
    let incorrectKeys = 0;

    this.incorrectInput.forEach((element) => {
      let correctAnswer = this.feedWords[element.index];

      element.typed.split("").forEach((letter, i) => {
        if (letter != correctAnswer.charAt(i)) incorrectKeys++;
      });
    });

    return incorrectKeys;
  }

  getAccuracy() {
    let correct = this.getCorrectKeys();
    let total = correct + this.getIncorrectKeys();
    return ((correct / total) * 100).toFixed(2);
  }

  getPercentile(cpm) {
    let percentile = 0;
    for (let i = 0; i < Speed.DISTRIBUTION.length; i++) {
      if (Speed.DISTRIBUTION[i].cpm > cpm) break;
      percentile += Speed.DISTRIBUTION[i].percentage;
    }
    return percentile.toFixed(2);
  }
}
