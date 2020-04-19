import React from "react";

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
  const [
    state_is_desktop_or_laptop,
    set_state_is_desktop_or_laptop
  ] = React.useState(false);

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

    if (state_is_desktop_or_laptop) {
      if (root.contentItems[0].contentItems.length === 0) {
        root.contentItems[0].addChild({
          type: "row",
          content: [{ type: "column" }, { type: "column" }, { type: "column" }]
        });
      }
      const column_0 = root.contentItems[0].contentItems[0].contentItems[0];
      const column_1 = root.contentItems[0].contentItems[0].contentItems[1];
      const column_2 = root.contentItems[0].contentItems[0].contentItems[2];

      let selected_column = column_0;
      if (column_0.contentItems.length > column_1.contentItems.length)
        selected_column = column_1;
      else if (column_1.contentItems.length > column_2.contentItems.length)
        selected_column = column_2;

      selected_column.addChild({
        title: props.windows_map[window_name].title,
        type: "react-component",
        component: window_name,
        props: {
          id: { window_name },
          key: window_name,
          title: props.windows_map[window_name].title
        }
      });
    } else {
      if (root.contentItems[0].contentItems.length === 0) {
        root.contentItems[0].addChild({ type: "stack" });
      }

      root.contentItems[0].contentItems[0].addChild({
        title: props.windows_map[window_name].title,
        type: "react-component",
        component: window_name,
        props: {
          id: { window_name },
          key: window_name,
          title: props.windows_map[window_name].title
        }
      });
    }
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

      return config;
    };
    const set_desktop_or_laptop = (windows_config) => {
      let is_desktop_or_laptop = props.is_desktop_or_laptop;

      if (!("content" in windows_config.content[0])) {
        windows_config.content[0].content = DEFAULT_CONFIG.content;
      }

      if (windows_config.content[0].content.length > 0) {
        is_desktop_or_laptop =
          windows_config.content[0].content[0].type === "row";
      }

      set_state_is_desktop_or_laptop(is_desktop_or_laptop);
      return windows_config;
    };
    let windows_config = load_windows_config();
    windows_config = set_desktop_or_laptop(windows_config);

    set_state_windows_config(windows_config);
  };

  const register_components = (myLayout) => {
    for (const [window_name, values] of Object.entries(props.windows_map))
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
    hook_windows_config: state_windows_config,
    hook_golden_layout_fn: {
      register_components,
      set_gui,
      add_window,
      get_layout_instance: helper.get_layout_instance
    }
  };
}

export default useGoldenLayout;
