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

  static get_url_path() {
    let url_path = window.location.pathname;
    if (url_path.charAt(0) === "/" || url_path.charAt(0) === "\\")
      url_path = url_path.substring(1);
    return url_path;
  }
}

export default Util;
