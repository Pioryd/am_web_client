class Util {
  static get_time_hms(date) {
    if (date == null) date = new Date();
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
  }

  static shallow_copy(object) {
    return JSON.parse(JSON.stringify(object));
  }
}

export default Util;
