import React from "react";

import { WhatsApp, Telegram, Facebook } from "@material-ui/icons";

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
