export default class WebStorageDao {
  static isStorageAvailable() {
    return typeof Storage !== "undefined";
  }

  static save(key, capacity, data) {
    if (!WebStorageDao.isStorageAvailable()) return;
    let storage =
      localStorage.getItem(key) === null
        ? []
        : JSON.parse(localStorage.getItem(key));
    storage.unshift(data);
    if (storage.length > capacity) storage.pop();
    localStorage.setItem(key, JSON.stringify(storage));
  }

  static findAll(key) {
    return WebStorageDao.isStorageAvailable()
      ? JSON.parse(localStorage.getItem(key)) || []
      : [];
  }

  static clear(key) {
    localStorage.removeItem(key);
  }
}
