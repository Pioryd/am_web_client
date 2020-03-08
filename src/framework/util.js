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

  static get_formatted_url_path() {
    let url_path = window.location.pathname;
    if (url_path.charAt(0) === "/" || url_path.charAt(0) === "\\")
      url_path = url_path.substring(1);

    let formatted_vars = {};
    const parts = url_path.split("/");
    for (const part of parts) {
      const splitted_part = part.split(":");
      if (splitted_part.length !== 2) continue;
      formatted_vars[splitted_part[0].toLowerCase()] = splitted_part[1];
    }
    return formatted_vars;
  }

  static shallow_copy(object) {
    return JSON.parse(JSON.stringify(object));
  }
}

export default Util;
