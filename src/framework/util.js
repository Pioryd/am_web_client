export default {
  get_time_hms: (date) => {
    if (date == null) date = new Date();
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
  },
  command_args_to_array: (text) => {
    const re = /^"[^"]*"$/; // Check if argument is surrounded with double-quotes
    const re2 = /^([^"]|[^"].*?[^"])$/; // Check if argument is NOT surrounded with double-quotes

    let arr = [];
    let argPart = null;

    text &&
      text.split(" ").forEach(function (arg) {
        if ((re.test(arg) || re2.test(arg)) && !argPart) {
          arr.push(arg);
        } else {
          argPart = argPart ? argPart + " " + arg : arg;
          // If part is complete (ends with a double quote), we can add it to the array
          if (/"$/.test(argPart)) {
            arr.push(argPart);
            argPart = null;
          }
        }
      });

    return arr;
  }
};
