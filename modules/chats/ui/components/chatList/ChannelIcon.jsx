import React from "react";

import WhatsApp from "@material-ui/icons/WhatsApp";
import Telegram from "@material-ui/icons/Telegram";
import Facebook from "@material-ui/icons/Facebook";

export default function ChannelIcon({ channel }) {
  if (channel === "whatsapp") {
    return <WhatsApp />;
  } else if (channel === "telegram") {
    return <Telegram />;
  } else if (channel === "messenger") {
    return <Facebook />;
  } else if (channel === "vk") {
    return <img src="/img/vk-logo.png" width="35px" />;
  }

  return null;
}
