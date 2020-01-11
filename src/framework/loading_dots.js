import Stopwatch from "./stopwatch";

class LoadingDots {
  constructor({ max_dots = 3, interval = 1000 }) {
    this.max_dots = max_dots;
    this.current_dot_count = 1;
    this.stop_watch = new Stopwatch(interval);
  }

  get_dots() {
    if (this.stop_watch.is_elapsed()) {
      this.current_dot_count++;
      if (this.current_dot_count > this.max_dots) this.current_dot_count = 1;
      this.stop_watch.reset();
    }

    return ".".repeat(this.current_dot_count);
  }
}

export default LoadingDots;
