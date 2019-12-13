class Util {
  static get_time_hms() {
    return new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
  }
}

export default Util;
