import React from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * Display modes:
 *  - "desktop": [row]->[column_1, column_2, column_3]
 *    windows added to each column one by one
 *  - "mobile": [stack]
 *    windows added to same stack
 *  - "custom":
 *    any other configuration
 *
 * When "custom" then ignore [view_mode] change.
 *
 * [state_instance_key] is for [force_remount] GoldenLayout component.
 *
 * NOTE!
 * Algorith of detects [display_mode] is is not perfect but works.
 */
const DEFAULT_LAYOUT_CONFIG = {
  content: [
    {
      type: "row",
      isClosable: false,
      content: []
    }
  ]
};

const DEFAULT_SETTINGS = {
  config: DEFAULT_LAYOUT_CONFIG,
  __old_config_windows_names: []
};

function useGoldenLayout(props) {
  const [state_settings, set_state_settings] = React.useState({
    ...(props.settings || DEFAULT_SETTINGS)
  });
  const [state_display_mode, set_state_display_mode] = React.useState(
    props.view_mode
  );
  const [state_instance_key, set_state_instance_key] = React.useState(uuidv4());

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

  /**
   * Most important function to check if changes are equal to "custom"
   * [display_mode]. Second one is fn.add()
   */
  const is_custom_display_mode = (config) => {
    // wrong/empty config
    if (config.content == null) {
      return false;
    }
    if (
      config.content.length === 1 &&
      config.content[0].type === "row" &&
      (config.content[0].content == null ||
        config.content[0].content.length === 0 ||
        config.content[0].content[0].content == null ||
        config.content[0].content[0].content.length === 0)
    ) {
      return false;
    }
    // custom for sure
    if (
      config.content[0].type !== "row" ||
      config.content[0].content.length > 1
    ) {
      return true;
    }
    // check if mobile
    if (config.content[0].content[0].type === "stack") {
      for (const element of config.content[0].content[0].content)
        if (element.type !== "component") {
          return true;
        }

      return false;
    }
    // check if desktop
    if (
      config.content[0].content[0].type === "row" &&
      config.content[0].content[0].content != null
    ) {
      if (
        (config.content[0].content[0].content.length === 3 &&
          config.content[0].content[0].content[0].type === "column" &&
          config.content[0].content[0].content[1].type === "column" &&
          config.content[0].content[0].content[2].type === "column") ||
        (config.content[0].content[0].content.length === 2 &&
          config.content[0].content[0].content[0].type === "column" &&
          config.content[0].content[0].content[1].type === "column") ||
        (config.content[0].content[0].content.length === 1 &&
          config.content[0].content[0].content[0].type === "column")
      ) {
        return false;
      }
    }

    return true;
  };

  const fn = {
    register_components: (myLayout) => {
      for (const [window_name, values] of Object.entries(props.windows))
        myLayout.registerComponent(window_name, values.class);

      myLayout.on("stateChanged", function () {
        if (myLayout.isInitialised) {
          /**
           * NOTE !
           * myLayout.toConfig() is throwing exception when layout is:
           * saved as display_mod[mobile] and then loaded as display_mod[desktop]
           * In case of display_mod[desktop] -> display_mod[mobile] works fine.
           * Don't want to looking for reason, so bellow exception handling
           * is work around.
           */
          let config = { ...DEFAULT_LAYOUT_CONFIG };
          try {
            config = myLayout.toConfig();
          } catch (e) {}

          set_state_settings({ ...state_settings, config });
          if (is_custom_display_mode(config)) set_state_display_mode("custom");
        }
      });
    },
    /**
     * GoldenLayout component use set_gui at initialize without
     * [force_remount]
     */
    set_gui: (force_remount) => {
      function correct_windows_config(config) {
        if (config == null || config.content.length === 0)
          config = DEFAULT_LAYOUT_CONFIG;

        if (!("content" in config.content[0]))
          config.content[0].content = DEFAULT_LAYOUT_CONFIG.content;

        return config;
      }
      function get_windows_names(config_node) {
        let names = [];
        if (config_node.content == null) return names;

        for (const element of config_node.content) {
          if (element.type === "component") {
            names.push(element.component);
          } else {
            names = [...names, ...get_windows_names(element)];
          }
        }

        return names;
      }

      let settings = { ...state_settings };
      settings.config = correct_windows_config(settings.config);

      if (force_remount) {
        settings.__old_config_windows_names = get_windows_names(
          settings.config
        );
        settings.config = DEFAULT_LAYOUT_CONFIG;
      } else if (Array.isArray(settings.__old_config_windows_names)) {
        for (const name of settings.__old_config_windows_names)
          fn.add_window(name);
        settings.__old_config_windows_names = [];
      }

      set_state_settings({ ...settings });
      if (force_remount) {
        set_state_instance_key(uuidv4());
      }
      if (is_custom_display_mode(settings.config)) {
        set_state_display_mode("custom");
      }
    },
    /**
     * view_mode as ["desktop, mobile"]
     */
    set_view_mode: (view_mode) => {
      if (state_display_mode === "custom") return;
      set_state_display_mode(view_mode);
    },
    /**
     * display_mode as ["desktop, mobile", "custom"]
     */
    set_display_mode: (display_mode) => {
      if (display_mode !== state_display_mode)
        set_state_display_mode(display_mode);
    },
    /**
     * Add windows and change [display_mode] only if detect "custom" mode.
     * Weak detect only. Strong is handle by [is_custom_display_mode()].
     */
    add_window: (window_name) => {
      try {
        const root = helper.get_layout_root();
        if (root == null) return;

        let display_mode = state_display_mode;

        if (display_mode === "desktop") {
          if (root.contentItems[0].contentItems.length === 0) {
            root.contentItems[0].addChild({
              type: "row",
              content: [
                { type: "column" },
                { type: "column" },
                { type: "column" }
              ]
            });
          }

          const row_content_item = root.contentItems[0].contentItems[0];
          while (row_content_item.contentItems.length < 3)
            row_content_item.addChild({ type: "column", content: [] });

          const column_0 = row_content_item.contentItems[0];
          const column_1 = row_content_item.contentItems[1];
          const column_2 = row_content_item.contentItems[2];

          if (
            row_content_item.contentItems.length > 3 ||
            (row_content_item.contentItems.length === 3 &&
              (column_0 == null ||
                column_1 == null ||
                column_2 == null ||
                column_0.type !== "column" ||
                column_1.type !== "column" ||
                column_2.type !== "column")) ||
            (row_content_item.contentItems.length === 2 &&
              (column_0 == null ||
                column_1 == null ||
                column_0.type !== "column" ||
                column_1.type !== "column")) ||
            (row_content_item.contentItems.length === 1 &&
              (column_0 == null || column_0.type !== "column"))
          )
            display_mode = "custom";

          if (display_mode === "desktop") {
            let selected_column = column_0;
            if (column_0.contentItems.length > column_1.contentItems.length)
              selected_column = column_1;
            else if (
              column_1.contentItems.length > column_2.contentItems.length
            )
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
      } catch (e) {
        console.error("Unable to add window. Reset component.", e, e.stack);
        fn.set_gui(true);
      }
    }
  };

  React.useEffect(() => {
    if (state_display_mode !== "custom") fn.set_gui(true);
  }, [state_display_mode]);

  return {
    hook_golden_layout_instance_key: state_instance_key,
    hook_golden_layout_settings: state_settings,
    hook_golden_layout_display_mode: state_display_mode,
    hook_golden_layout_ref: ref_golden_layout,
    hook_golden_layout_fn: {
      ...fn,
      get_layout_instance: helper.get_layout_instance
    }
  };
}

export default useGoldenLayout;
