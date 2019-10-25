/**
 * Default content body. Display information as JSON source in colored format.
 */
export class RadarFormEdit {
  constructor(uid, source) {
    this.uid = uid;
    this.source = source;
    this.current_form = {};
    this.on_edit_form = () => {};
    this.on_remove_form = () => {};
    this.on_set_as_center = () => {};

    // Div - window-content
    this.ui_window = document.createElement("div");
    this.ui_window.setAttribute("class", `contentbody`);

    // Div - content-bar
    this.ui_bar = document.createElement("div");
    this.ui_bar.setAttribute("class", `bar`);
    this.ui_window.appendChild(this.ui_bar);

    // Add input - form name
    this.input_name = document.createElement("input");
    this.input_name.type = "text";
    this.ui_bar.appendChild(this.input_name);

    // Button - find
    this.button_find = document.createElement("input");
    this.button_find.type = "button";
    this.button_find.value = "find by name";
    this.button_find.onclick = e => {
      for (let i = 0; i < this.source.length; i++) {
        if (this.source[i].name === this.input_name.value) {
          this.current_form = this.source[i];
          this.set_current_form_();
          this.input_name.value = "";
          return;
        }
      }
      this.set_not_found_(this.input_name.value);
    };
    this.ui_bar.appendChild(this.button_find);

    // Button - previous
    this.button_prev = document.createElement("input");
    this.button_prev.type = "button";
    this.button_prev.value = "prev";
    this.button_prev.onclick = e => {
      if (
        (Object.entries(this.source).length === 0 &&
          this.source.constructor === Object) ||
        this.source.length < 2
      )
        return;

      let i = this.source.length;
      while (i--)
        if (this.source[i].name === this.current_form.name) {
          i--;
          break;
        }

      if (i < 0) i = this.source.length - 1;

      this.current_form = this.source[i];
      this.set_current_form_();
    };
    this.ui_bar.appendChild(this.button_prev);

    // Button - next
    this.button_next = document.createElement("input");
    this.button_next.type = "button";
    this.button_next.value = "next";
    this.button_next.onclick = e => {
      if (
        (Object.entries(this.source).length === 0 &&
          this.source.constructor === Object) ||
        this.source.length < 2
      )
        return;

      let i = 0;
      for (; i < this.source.length; i++)
        if (this.source[i].name === this.current_form.name) {
          i++;
          break;
        }

      if (i >= this.source.length) i = 0;

      this.current_form = this.source[i];
      this.set_current_form_();
    };
    this.ui_bar.appendChild(this.button_next);

    // Button - refresh
    this.button_refresh = document.createElement("input");
    this.button_refresh.type = "button";
    this.button_refresh.value = "refresh";
    this.button_refresh.onclick = e => {
      this.set_current_form_();
    };
    this.ui_bar.appendChild(this.button_refresh);

    // Button - new
    this.button_new = document.createElement("input");
    this.button_new.type = "button";
    this.button_new.value = "new";
    this.button_new.onclick = e => {
      if (
        (Object.entries(this.source).length === 0 &&
          this.source.constructor === Object) ||
        this.source.length < 2
      ) {
        this.ui_content.innerHTML =
          "<p>Error: To create new form, source must contains at least 2 points.</p>";
        return;
      }

      // 0 index is bot with additional data, so we want 1 index
      this.current_form = Object.assign({}, this.source[1]);
      for (const [key, value] of Object.entries(this.current_form))
        this.current_form[key] = "";
      this.set_current_form_();
    };
    this.ui_bar.appendChild(this.button_new);

    // Button - save
    this.button_save = document.createElement("input");
    this.button_save.type = "button";
    this.button_save.value = "save";
    this.button_save.onclick = e => {
      if (confirm("Are toy sure to SAVE this form?")) {
        const form = {};
        for (let i = 0; i < this.ui_content.children.length; i++) {
          const field_child = this.ui_content.children[i];
          for (let j = 0; j < field_child.children.length; j++) {
            const value_child = field_child.children[j];
            if (value_child.getAttribute("class") === "form-edit")
              form[value_child.getAttribute("name")] = value_child.value;
          }
        }
        this.on_edit_form(form);
        this.ui_content.innerHTML = "<p>Saving changes...</p>";
        this.ui_content.innerHTML += "<p>Click refresh to back.</p>";
      }
    };
    this.ui_bar.appendChild(this.button_save);

    // Button - remove
    this.button_remove = document.createElement("input");
    this.button_remove.type = "button";
    this.button_remove.value = "remove";
    this.button_remove.onclick = e => {
      if (confirm("Are toy sure to REMOVE this form?")) {
        const form = {};
        for (let i = 0; i < this.ui_content.children.length; i++) {
          const field_child = this.ui_content.children[i];
          for (let j = 0; j < field_child.children.length; j++) {
            const value_child = field_child.children[j];
            if (value_child.getAttribute("class") === "form-edit")
              form[value_child.getAttribute("name")] = value_child.value;
          }
        }
        this.on_remove_form(form.name);
        this.ui_content.innerHTML = "<p>REMOVING form...</p>";
        this.ui_content.innerHTML += "<p>Click refresh to back.</p>";
      }
    };
    this.ui_bar.appendChild(this.button_remove);

    // Button - set as center
    this.button_set_as_center = document.createElement("input");
    this.button_set_as_center.type = "button";
    this.button_set_as_center.value = "set as center";
    this.button_set_as_center.onclick = e => {
      this.on_set_as_center({
        name: this.current_form.name,
        x: this.current_form.x,
        y: this.current_form.y
      });
    };
    this.ui_bar.appendChild(this.button_set_as_center);

    // Div - content-body
    this.ui_content = document.createElement("div");
    this.ui_content.setAttribute("class", `radar-edit-form`);
    this.ui_window.appendChild(this.ui_content);

    this.set_current_form_();
  }

  update(source) {
    if (source !== undefined) this.source = source;

    for (let i = 0; i < this.source.length; i++) {
      if (this.current_form.name === this.source[i].name) {
        this.current_form = this.source[i];
      }
    }
  }

  set_current_form_by_name(name) {
    for (let i = 0; i < this.source.length; i++) {
      if (this.source[i].name === name) {
        this.current_form = this.source[i];
        this.set_current_form_();
        return;
      }
    }
  }

  set_log(log) {
    let color = "green";

    if (log.substring(0, 5).includes("Error")) color = "red";

    this.ui_content.innerHTML = `<p style="color: ${color}">${log}</p>`;
    this.ui_content.innerHTML += "<p>Click refresh to back.</p>";
  }

  set_current_form_() {
    if (
      Object.entries(this.current_form).length === 0 &&
      this.current_form.constructor === Object
    ) {
      this.set_not_found_();
      return;
    }

    if (this.current_form.name !== "") {
      let found = false;
      for (let i = 0; i < this.source.length; i++)
        if (this.source[i].name == this.current_form.name) found = true;

      if (found == false) {
        if (this.source.length > 0) {
          this.current_form = this.source[0];
        } else {
          this.set_not_found_();
          return;
        }
      }
    }

    this.ui_content.innerHTML = "";

    for (const [key, value] of Object.entries(this.current_form)) {
      // Form label
      const field_div = document.createElement("div");
      field_div.setAttribute("class", `form-field`);

      // Key
      const form_label = document.createElement("div");
      form_label.setAttribute("class", `form-label`);
      form_label.style.color = "#ff0000";
      form_label.innerHTML = `[${key}]`;
      field_div.appendChild(form_label);

      // Value
      const form_edit = document.createElement("input");
      form_edit.setAttribute("class", `form-edit`);
      const change_background_color = element => {
        if (element.value.substring(0, 1) === "#")
          element.style.backgroundColor = element.value;
        else element.style.backgroundColor = "#ffffff";
      };
      form_edit.onchange = e => change_background_color(e.currentTarget);
      form_edit.onkeypress = e => change_background_color(e.currentTarget);
      form_edit.type = "text";
      form_edit.name = key;
      form_edit.value = value;
      // Set value color
      form_edit.style.color = "#ff8c00"; // Number
      if (typeof value === "string" || value instanceof String)
        form_edit.style.color = "#008000";
      if (typeof value === "boolean" || value instanceof Boolean)
        form_edit.style.color = "#0000ff";
      if (typeof value === null) form_edit.style.color = "#ff00ff";
      change_background_color(form_edit);
      field_div.appendChild(form_edit);
      this.ui_content.appendChild(field_div);
    }
  }

  set_not_found_(value) {
    if (value === undefined) value = "";
    this.ui_content.innerHTML = `<p>Not found: "${value}"</p>`;
  }
}
