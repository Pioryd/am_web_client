# Artificial Mind - Web Client

![Node.js CI](https://github.com/Pioryd/am_web_client/workflows/Node.js%20CI/badge.svg?branch=master)

![Web Client GUI](https://github.com/Pioryd/am_web_client/blob/master/.github/web_client.png)

## Install and run

```powershell
npm install
npm start
```

## Example of login data

You can find in [Artificial mind example project](https://github.com/Pioryd/am_web_client)

## Errors

- If You cant do nothing. And only errors are displayed.
  - Clear `[localStorage]`(Developer Tools or browser history).

## Project extension

When adding, take an example from existing ones.

### Main components

#### Main window

1. Add component to [`src/components/windows`] on the example of existing components.
2. Add component(window) to [`src/components/windows/index.js`] on the example of [`Settings`] component.

### Root elements

- **Add hook**
  - Add hook to [`src/hooks`]
- **Add context**
  - Add context to [`src/context`]
- **Add framework lib**
  - Add lib to [`src/framework`]

### Add new module

1. Create module folder named as module name in [`src/modules`] on the example of existing components.
2. Create [`index.js`] on the example of existing components.
3. Import module to [`src/modules/index.js`].

#### Add general component

Add component to [`src/modules/module_name/components`] on the example of existing components.

#### Add window (component)

1. Add pure component to [`src/modules/module_name/windows`] on the example of existing windows.
2. Import component(window) to [`src/modules/module_name/index.js`] on the example of existing windows.

#### Example GUI

##### multi_window

```javascript
export default {
  windows: {
    example_window: { class: ExampleWindowInstance, title: "window name" }
  },
  gui_type: "multi_window",
  settings: {}
};
```

##### grid

```javascript
export default {
  windows: {
    example_window: { class: ExampleWindowInstance, title: "window name" }
  },
  grid_layouts: {
    className: "layout",
    items: 1,
    rowHeight: 3,
    width: 1200,
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 1 },
    layouts: {
      lg: [
        { i: "0", x: 0, y: 5, w: 1.5, h: 55 }
      ]
    }
  },
  gui_type: "grid",
  navigation_enabled_windows_list: false,
  settings: {}
};
```

## More informations at [Artificial Mind](https://www.artificialmind.dev/)
