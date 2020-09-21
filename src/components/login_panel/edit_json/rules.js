export default {
  properties: {
    id: {
      type: ["number", "string"]
    },
    module: {
      type: ["number", "string"]
    },
    connection_accept_data: {
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
    "connection_accept_data",
    "host",
    "port",
    "settings",
    "session_id"
  ],
  additionalProperties: false
};
