class Logger {
  constructor(options) {
    this.options = {
      module_name: "",
      file_name: "",
      show_time: true,
      show_type: true,
      print_log: true,
      print_info: true,
      print_error: true,
      print_warn: true,
      print_debug: false,
      ...options
    };
  }

  log(...args) {
    if (this.options.print_log) this.print("log", "color:black", ...args);
  }

  info(...args) {
    if (this.options.print_info) this.print("info", "color:blue", ...args);
  }

  error(...args) {
    if (this.options.print_error) this.print("error", "color:red", ...args);
  }

  warn(...args) {
    if (this.options.print_warn) this.print("warn", "color:yellow", ...args);
  }

  debug(...args) {
    if (this.options.print_debug) this.print("debug", "color:green", ...args);
  }

  print(message_type, color, ...args) {
    let time = "";
    let type = "";
    if (this.options.show_time)
      time = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      });
    if (this.options.show_type) type = message_type.toUpperCase();
    let text_1 =
      `(${time})` +
      `(${type})` +
      `<${this.options.module_name}>` +
      `{${this.options.file_name}}`;

    let text_2 = "";
    for (let arg of args) text_2 += arg + " ";

    console[message_type](`%c${text_1}\n%c${text_2}`, "color:black", color);
  }
}

function create_logger(...args) {
  return new Logger(...args);
}

export default create_logger;
