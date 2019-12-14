import React from "react";
import { AppContext } from "../../context/app";
function BotsManager(props) {
  const {
    context_chat_received_message,
    context_clear_chat_received_message,
    context_send_message
  } = React.useContext(AppContext);

  const main_loop = () => {
    console.log("Bot manager");
  };

  React.useEffect(() => {
    setInterval(main_loop, 1000);
  });

  return null;
}

export default BotsManager;
