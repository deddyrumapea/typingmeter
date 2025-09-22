# TypingMeter

TypingMeter is a one-minute typing speed test that helps you track your words-per-minute (WPM), accuracy, and percentile right in the browser. Try it online at the [TypingMeter website](https://deddyromnan.github.io/typingmeter).

![TypingMeter screenshot](https://user-images.githubusercontent.com/14845590/175569825-1731c314-ed1c-453e-b8ca-9583d5f86ef0.png)

## Features

- **1-minute typing drills.** Start a timed test with a curated stream of random words, available in both English and Bahasa Indonesia vocabularies. The UI logic lives in [core/presentation/index.js](core/presentation/index.js), while the word pools are defined in [core/data/static/word.js](core/data/static/word.js).
- **Real-time feedback.** Words are highlighted as active, correct, or incorrect as you type, so you immediately see mistakes. This highlighting flow is handled in [core/presentation/index.js](core/presentation/index.js).
- **Detailed results.** Each run calculates WPM, accuracy, percentile ranking, and per-word/per-keystroke statistics, computed by [core/presentation/util/typing_test.js](core/presentation/util/typing_test.js).
- **Persistent history.** Your last five results are saved to the browser's local storage and can be cleared from the UI when you want a fresh start, powered by [core/presentation/index.js](core/presentation/index.js), [core/data/web_storage/web_storage_dao.js](core/data/web_storage/web_storage_dao.js), and [core/domain/model/test_result.js](core/domain/model/test_result.js).

## Getting started locally

This project is a static site that uses ES modules, so it needs to be served from a local web server.

1. **Clone the repository.**
   ```bash
   git clone https://github.com/deddyromnan/typingmeter.git
   cd typingmeter
   ```
2. **Start a static server.** Use any HTTP server you prefer, for example:
   ```bash
   # Option A: Python 3
   python3 -m http.server 8000

   # Option B: npx serve (requires Node.js)
   npx serve .
   ```
3. **Open the app.** Visit `http://localhost:8000` (or the port you chose) in your browser.

## How to use the typing test

1. Choose a language from the dropdown.
2. Start typing in the input box—the timer begins on your first keystroke.
3. Press the space bar to submit each word. The app moves the highlight to the next word automatically.
4. When the timer hits zero, review your results or restart the test to try again.

These interactions mirror the behaviour defined in [core/presentation/index.js](core/presentation/index.js).

## Customize the experience

- **Change the word pools.** Add or edit word lists in [`core/data/static/word.js`](core/data/static/word.js) to adjust the prompts or include new languages.
- **Alter the test duration.** Modify the `limit` value in [`core/presentation/util/timer.js`](core/presentation/util/timer.js) to change how long each test runs.
- **Store more history.** Update the `CAPACITY` constant in [`core/domain/model/test_result.js`](core/domain/model/test_result.js) if you want to keep more than five past results.

## Built with

- [Bootstrap 5](https://getbootstrap.com) for layout and styles.
- [Bootstrap Icons](https://icons.getbootstrap.com/) for UI icons.
- [jQuery](https://jquery.com/) and [Moment.js](https://momentjs.com/) for DOM interactions and time formatting.

All external dependencies are loaded from CDNs in [`index.html`](index.html).

## License

This project is released under the [MIT License](LICENSE).
