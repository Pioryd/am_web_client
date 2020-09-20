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
    },
    description: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 2
      }
    }
  },
  json: {
    title: "Login data",
    type: "object",
    required: [""],
    properties: {
      id: {
        type: "string",
        title: "ID"
      },
      module: {
        type: "string",
        title: "Module",
        enum: ["admin", "virtual_world"]
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
      },
      description: {
        type: "string",
        title: "Description"
      },
      session_id: {
        type: "string",
        title: "SessionID"
      }
    }
  }
};
