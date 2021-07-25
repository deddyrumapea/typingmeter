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
    cpm = Math.ceil(cpm / 10) * 10;
    let distData = this.getSpeedDistributionData();

    let start = 0;
    let end = distData.length - 1;
    let rankIndex = 0;

    while (start <= end) {
      let mid = Math.floor((start + end) / 2);

      if (distData[mid].cpm === cpm) {
        rankIndex = mid;
        break;
      } else if (distData[mid].cpm < cpm) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }

    let rank = 0;
    for (let i = 0; i <= rankIndex; i++) {
      rank += distData[i].percentage;
    }

    return rank.toFixed(2);
  }

  getSpeedDistributionData() {
    return [
      { cpm: 0, percentage: 0 },
      { cpm: 10, percentage: 0.05 },
      { cpm: 20, percentage: 0.05 },
      { cpm: 30, percentage: 0.1 },
      { cpm: 40, percentage: 0.3 },
      { cpm: 50, percentage: 0.9 },
      { cpm: 60, percentage: 1.2 },
      { cpm: 70, percentage: 1.5 },
      { cpm: 80, percentage: 1.9 },
      { cpm: 90, percentage: 2.4 },
      { cpm: 100, percentage: 2.8 },
      { cpm: 110, percentage: 3.2 },
      { cpm: 120, percentage: 3.6 },
      { cpm: 130, percentage: 3.9 },
      { cpm: 140, percentage: 4 },
      { cpm: 150, percentage: 4.1 },
      { cpm: 160, percentage: 4.1 },
      { cpm: 170, percentage: 4.1 },
      { cpm: 180, percentage: 4 },
      { cpm: 190, percentage: 3.9 },
      { cpm: 200, percentage: 3.7 },
      { cpm: 210, percentage: 3.6 },
      { cpm: 220, percentage: 3.4 },
      { cpm: 230, percentage: 3.2 },
      { cpm: 240, percentage: 3 },
      { cpm: 250, percentage: 2.9 },
      { cpm: 260, percentage: 2.7 },
      { cpm: 270, percentage: 2.5 },
      { cpm: 280, percentage: 2.4 },
      { cpm: 290, percentage: 2.3 },
      { cpm: 300, percentage: 2.1 },
      { cpm: 310, percentage: 2 },
      { cpm: 320, percentage: 1.8 },
      { cpm: 330, percentage: 1.7 },
      { cpm: 340, percentage: 1.6 },
      { cpm: 350, percentage: 1.5 },
      { cpm: 360, percentage: 1.4 },
      { cpm: 370, percentage: 1.3 },
      { cpm: 380, percentage: 1.2 },
      { cpm: 390, percentage: 1.1 },
      { cpm: 400, percentage: 1 },
      { cpm: 410, percentage: 0.9 },
      { cpm: 420, percentage: 0.8 },
      { cpm: 430, percentage: 0.7 },
      { cpm: 440, percentage: 0.7 },
      { cpm: 450, percentage: 0.6 },
      { cpm: 460, percentage: 0.5 },
      { cpm: 470, percentage: 0.5 },
      { cpm: 480, percentage: 0.4 },
      { cpm: 490, percentage: 0.4 },
      { cpm: 500, percentage: 0.3 },
      { cpm: 510, percentage: 0.3 },
      { cpm: 520, percentage: 0.2 },
      { cpm: 530, percentage: 0.2 },
      { cpm: 540, percentage: 0.2 },
      { cpm: 550, percentage: 0.1 },
      { cpm: 560, percentage: 0.1 },
      { cpm: 570, percentage: 0.1 },
      { cpm: 580, percentage: 0.1 },
      { cpm: 590, percentage: 0.1 },
      { cpm: 600, percentage: 0.1 },
      { cpm: 610, percentage: 0.1 },
    ];
  }
}
