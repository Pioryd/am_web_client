const lib_fs = require("fs");

function read_from_json(file_name) {
  const json = lib_fs.readFileSync(file_name, "utf8", err => {
    if (err) throw err;
  });

  return JSON.parse(json);
}

function write_to_json(file_name, data) {
  const json = JSON.stringify(data, null, 2);

  lib_fs.writeFileSync(file_name, json, "utf8", err => {
    if (err) throw err;
  });
}

module.exports = {
  read_from_json,
  write_to_json
};
