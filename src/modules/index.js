import admin_useParsePacketHook from "./admin/hooks/parse_packet";
import virtual_world_useParsePacketHook from "./virtual_world/hooks/parse_packet";

const Modules = {
  admin: { useParsePacketHook: admin_useParsePacketHook },
  virtual_world: { useParsePacketHook: virtual_world_useParsePacketHook }
};

export default Modules;
