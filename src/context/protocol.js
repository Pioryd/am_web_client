import Util from "../framework/util";
import AdminProtocolProvider from "../modules/admin/context/protocol";
import { ProtocolContext as AdminProtocolContext } from "../modules/admin/context/protocol";
import WorldCharacterProtocolProvider from "../modules/world_character/context/protocol";
import { ProtocolContext as CharacterProtocolContext } from "../modules/world_character/context/protocol";

export let ProtocolContext = {};
let ProtocolProvider = {};
const module_name = Util.get_formated_url_path().module;
if (module_name === "admin") {
  ProtocolContext = AdminProtocolContext;
  ProtocolProvider = AdminProtocolProvider;
} else if (module_name === "world_character") {
  ProtocolContext = CharacterProtocolContext;
  ProtocolProvider = WorldCharacterProtocolProvider;
}

export default ProtocolProvider;
