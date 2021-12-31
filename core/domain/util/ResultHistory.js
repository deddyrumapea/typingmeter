export default class ResultHistory {
  STORAGE_KEY = "result_history";
  CAPACITY = 5;

  isStorageAvailable() {
    return typeof Storage !== "undefined";
  }

  save(result) {
    if (!this.isStorageAvailable()) return;

    let isHistoryEmpty = localStorage.getItem(this.STORAGE_KEY) === null;

    let history = isHistoryEmpty
      ? []
      : JSON.parse(localStorage.getItem(this.STORAGE_KEY));

    history.unshift(result);

    if (history.length > this.CAPACITY) {
      history.pop();
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  findAll() {
    return this.isStorageAvailable()
      ? JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || []
      : [];
  }

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
