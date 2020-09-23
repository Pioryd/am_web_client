/**
 * NOTE !
 * CONST settings.
 *
 * Loaded by [context/app]
 * Any changes should be done only, by creating [session] in [LoginPanel].
 * Contains settings only from root[components, contexts, hooks]
 * Modules settings should have own.
 */
const config = {
  /** context/packet_manager */
  packet: { queue_size: 10 },
  /** context/connection_manager */
  connection: {
    auto_reconnect: true,
    debug: true,
    logger: {
      print_log: true,
      print_info: true,
      print_error: true,
      print_warn: true,
      print_debug: true
    },
    send_delay: 0,
    packet_timeout: 0,
    host: "localhost",
    port: "3000",
    poll_interval: 500,
    start_as_enabled: 1,
    accept_data: {}
  }
};

export default config;
