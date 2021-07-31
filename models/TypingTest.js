import DataSource from "./DataSource.js";

export default class TypingTest {
  wordsCount = 0;
  feedCount = 0;
  words = null;
  correctInput = Array();
  incorrectInput = Array();

  constructor(words, wordsCount = 390, feedCount = 20) {
    this.wordsCount = wordsCount;
    this.feedCount = feedCount;
    this.words = words;
    this.randomizeWords();
  }

  reset() {
    this.randomizeWords();
    this.correctInput = Array();
    this.incorrectInput = Array();
  }

  addCorrectWord(index) {
    this.correctInput.push(index);
  }

  addIncorrectWord(index, typed) {
    this.incorrectInput.push({ index: index, typed: typed });
  }

  getRandomWords(words) {
    let result = Array();

    for (let i = 0; i < this.wordsCount; i++) {
      let randomIndex = Math.floor(Math.random() * (words.length - 1));
      let word = words[randomIndex];
      result.push(word);
    }

    return result;
  }

  randomizeWords() {
    this.words = this.getRandomWords(this.words);
  }

  getFeed(startFrom = 0) {
    let result = "";

    for (let i = startFrom; i < startFrom + this.feedCount; i++) {
      result += this.getWordSpan(i);
    }

    return result;
  }

  getWordSpan(index) {
    return `<span class="word" id="word-${index}">${this.words[index]}</span> `;
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
      let word = this.words[index];
      correctKeys += word.length + 1; // add space keystrokes
    });

    return correctKeys;
  }

  getIncorrectKeys() {
    let incorrectKeys = 0;

    this.incorrectInput.forEach((element) => {
      let correctAnswer = this.words[element.index];

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
    for (let i = 0; i < DataSource.SPEED_DISTRIBUTION.length; i++) {
      if (DataSource.SPEED_DISTRIBUTION[i].cpm > cpm) break;
      percentile += DataSource.SPEED_DISTRIBUTION[i].percentage;
    }
    return percentile.toFixed(2);
  }
}
