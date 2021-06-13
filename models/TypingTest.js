export default class TypingTest {
  wordsCount = 0;
  feedCount = 0;
  words = null;
  correctInput = Array();
  incorrectInput = Array();

  constructor(words, wordsCount = 390, feedCount = 20) {
    this.wordsCount = wordsCount;
    this.words = this.getRandomWords(words);
    this.feedCount = feedCount;
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
    let correctKeys = 0;
    let incorrectKeys = 0;

    this.correctInput.forEach((index) => {
      let word = this.words[index];
      correctKeys += word.length + 1; // add spaces keystrokes
    });

    this.incorrectInput.forEach((element) => {
      let correctAnswer = this.words[element.index];

      element.typed.split("").forEach((letter, i) => {
        if (letter != correctAnswer.charAt(i)) incorrectKeys++;
      });
    });

    let totalKeys = correctKeys + incorrectKeys;
    let accuracy = ((correctKeys / totalKeys) * 100).toFixed(2);

    return {
      wpm: this.correctInput.length,
      totalKeys: totalKeys,
      correctKeys: correctKeys,
      incorrectKeys: incorrectKeys,
      accuracy: accuracy,
      correctWords: this.correctInput.length,
      incorrectWords: this.incorrectInput.length,
    };
  }
}
