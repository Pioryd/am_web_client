import { syntax_highlight } from "./util.js";

/**
 * Default content body. Display information as JSON source in colored format.
 */
export class Default {
  constructor(uid, source) {
    this.uid = uid;
    this.source = source;

    // Div - window-content
    this.ui_window = document.createElement("div");
    this.ui_window.setAttribute("class", `contentbody`);

    // Div - content-bar
    this.ui_bar = document.createElement("div");
    this.ui_bar.setAttribute("class", `bar`);
    this.ui_window.appendChild(this.ui_bar);

    // Div - content-body
    this.ui_content = document.createElement("pre");
    this.ui_window.appendChild(this.ui_content);

    this.update(this.source);
  }

  update(source) {
    if (source !== undefined) this.source = source;

    this.ui_content.innerHTML = syntax_highlight(
      JSON.stringify(this.source, undefined, 2)
    );
  }
}
