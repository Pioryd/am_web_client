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
2. Add module to [`ModuleWindowsMap`] in [`src/components/gui/index.js`] on the example of existing components.

#### Add general component

Add component to [`src/modules/module_name/components`] on the example of existing components.

#### Add window (component)

1. Add component to [`src/modules/module_name/windows`] on the example of existing windows.
2. Add component(window) to [`src/modules/module_name/index.js`] on the example of existing windows.

#### Add protocol

1. Create [`src/modules/module_name/hooks/parse_packet.js`], example: [`src/modules/admin/hooks/parse_packet.js`]
2. Add this protocol to [`src/context/protocol.js`] on the example of existing modules.

## More informations at [Artificial Mind](https://www.artificialmind.dev/)
