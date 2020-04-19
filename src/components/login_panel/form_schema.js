export default {
  ui: {
    accept_connection_data: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 5
      }
    },
    settings: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 5
      }
    }
  },
  json: {
    title: "Login data",
    type: "object",
    required: ["title"],
    properties: {
      id: {
        type: "string",
        title: "ID"
      },
      name: {
        type: "string",
        title: "Name"
      },
      module: {
        type: "string",
        title: "Module",
        enum: ["admin", "world_character", "virtual_world"]
      },
      accept_connection_data: {
        type: "string",
        title: "[JSON] Protocol data - accept_connection"
      },
      host: { title: "Host", type: "string" },
      port: { title: "Port", type: "number" },
      settings: {
        type: "string",
        title: "[JSON] Settings (override)"
      }
    }
  }
};
