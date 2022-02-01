export default class TestResult {
  static STORAGE_KEY = "test_result";
  static CAPACITY = 5;

  unixTime;
  wpm;
  accuracy;
  percentile;
  correctKeys;
  incorrectKeys;
  correctWords;
  incorrectWords;
}
