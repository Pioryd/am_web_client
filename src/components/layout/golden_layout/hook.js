import React from "react";

/**
 * Display modes:
 *  - desktop: [row]->[column_1, column_2, column_3]
 *    windows added to each column one by one
 *  - mobile: [stack]
 *    windows added to same stack
 *  - custom:
 *    any other configuration
 */
const DEFAULT_CONFIG = {
  content: [
    {
      type: "row",
      isClosable: false,
      content: []
    }
  ]
};

function useGoldenLayout(props) {
  const [state_windows_config, set_state_windows_config] = React.useState(null);
  const [state_display_mode, set_state_display_mode] = React.useState("custom");

  const ref_golden_layout = React.createRef();

  const helper = {
    get_layout_root: () => {
      if (
        ref_golden_layout != null &&
        ref_golden_layout.current != null &&
        ref_golden_layout.current.goldenLayoutInstance != null &&
        ref_golden_layout.current.goldenLayoutInstance.root != null
      )
        return ref_golden_layout.current.goldenLayoutInstance.root;
      else return null;
    },
    get_layout_instance: () => {
      if (
        ref_golden_layout != null &&
        ref_golden_layout.current != null &&
        ref_golden_layout.current.goldenLayoutInstance != null
      )
        return ref_golden_layout.current.goldenLayoutInstance;
      else return null;
    }
  };

  const add_window = (window_name, content_ui) => {
    const root = helper.get_layout_root();
    if (root == null) return;

    let display_mode = state_display_mode;

    if (display_mode === "desktop") {
      if (root.contentItems[0].contentItems.length === 0) {
        root.contentItems[0].addChild({
          type: "row",
          content: [{ type: "column" }, { type: "column" }, { type: "column" }]
        });
      }

      const row_content_item = root.contentItems[0].contentItems[0];
      const column_0 = row_content_item.contentItems[0];
      const column_1 = row_content_item.contentItems[1];
      const column_2 = row_content_item.contentItems[2];

      if (
        row_content_item.contentItems.length > 3 ||
        column_0 == null ||
        column_1 == null ||
        column_2 == null
      )
        display_mode = "custom";

      if (display_mode === "desktop") {
        let selected_column = column_0;
        if (column_0.contentItems.length > column_1.contentItems.length)
          selected_column = column_1;
        else if (column_1.contentItems.length > column_2.contentItems.length)
          selected_column = column_2;

        selected_column.addChild({
          title: props.windows[window_name].title,
          type: "react-component",
          component: window_name,
          props: {
            id: { window_name },
            key: window_name,
            title: props.windows[window_name].title
          }
        });
      }
    }

    if (display_mode === "mobile") {
      if (root.contentItems[0].contentItems.length === 0)
        root.contentItems[0].addChild({ type: "stack" });

      const stack_content_item = root.contentItems[0].contentItems[0];

      if (
        root.contentItems[0].contentItems.length > 1 ||
        stack_content_item.type !== "stack"
      )
        display_mode = "custom";

      if (display_mode === "mobile") {
        stack_content_item.addChild({
          title: props.windows[window_name].title,
          type: "react-component",
          component: window_name,
          props: {
            id: { window_name },
            key: window_name,
            title: props.windows[window_name].title
          }
        });
      }
    }

    if (display_mode === "custom") {
      if (root.contentItems[0].contentItems.length === 0)
        root.contentItems[0].addChild({ type: "stack" });

      const stack_content_item = root.contentItems[0].contentItems[0];

      stack_content_item.addChild({
        title: props.windows[window_name].title,
        type: "react-component",
        component: window_name,
        props: {
          id: { window_name },
          key: window_name,
          title: props.windows[window_name].title
        }
      });
    }

    if (state_display_mode !== display_mode)
      set_state_display_mode(display_mode);
  };

  const get_saved_states = () => {
    let saved_states = localStorage.getItem("am_gl_saved_states");
    try {
      if (saved_states != null) return JSON.parse(saved_states);
    } catch (e) {
      localStorage.removeItem("am_gl_saved_states");
    }
  };

  const set_gui = () => {
    const load_windows_config = () => {
      let config = DEFAULT_CONFIG;
      let saved_states = get_saved_states();

      if (saved_states != null) {
        const saved_state = saved_states[props.settings.id];
        if (
          saved_state != null &&
          // props.login_data.id === saved_state.login_data_id &&
          saved_state.config.content.length > 0
        )
          config = saved_state.config;
      }

      if (!("content" in config.content[0]))
        config.content[0].content = DEFAULT_CONFIG.content;

      return config;
    };
    const set_display_mode = (windows_config) => {
      let display_mode = props.is_desktop_or_laptop ? "desktop" : "mobile";

      if (windows_config.content[0].content.length > 0) {
        display_mode =
          windows_config.content[0].content[0].type === "row"
            ? "desktop"
            : "mobile";
      }

      set_state_display_mode(display_mode);

      return windows_config;
    };
    let windows_config = load_windows_config();
    set_display_mode(windows_config);

    set_state_windows_config(windows_config);
  };

  const register_components = (myLayout) => {
    for (const [window_name, values] of Object.entries(props.windows))
      myLayout.registerComponent(window_name, values.class);

    myLayout.on("stateChanged", function () {
      if (myLayout.isInitialised) {
        const login_data_id = props.settings.id;
        const saved_state = {
          config: myLayout.toConfig(),
          login_data_id
        };

        let saved_states = get_saved_states() || {};
        saved_states[login_data_id] = saved_state;
        localStorage.setItem(
          "am_gl_saved_states",
          JSON.stringify(saved_states)
        );
      }
    });
  };

  return {
    hook_golden_layout_ref: ref_golden_layout,
    hook_golden_layout_config: state_windows_config,
    hook_golden_layout_display_mode: state_display_mode,
    hook_golden_layout_fn: {
      register_components,
      set_gui,
      add_window,
      get_layout_instance: helper.get_layout_instance
    }
  };
}

export default useGoldenLayout;
