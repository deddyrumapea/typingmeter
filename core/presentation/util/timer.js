export default class Timer {
  interval = null;
  started = false;
  limit = 59;
  seconds = 0;

  start(onTick, onFinish) {
    this.seconds = this.limit;
    this.started = true;
    this.interval = setInterval(() => {
      if (this.seconds <= 0) onFinish();
      onTick(this.seconds);
      this.seconds--;
    }, 1000);
  }

  reset() {
    clearInterval(this.interval);
    this.timer = null;
    this.started = false;
    this.seconds = 0;
  }
}
