export default {
  properties: {
    id: {
      type: ["number", "string"]
    },
    module: {
      type: ["number", "string"]
    },
    accept_connection_data: {
      type: "object"
    },
    host: {
      type: ["number", "string"]
    },
    port: {
      type: ["number", "string"]
    },
    settings: {
      type: "object"
    },
    description: {
      type: ["string"]
    },
    session_id: {
      type: ["number", "string"]
    }
  },
  required: [
    "id",
    "module",
    "accept_connection_data",
    "host",
    "port",
    "settings"
  ],
  additionalProperties: false
};
