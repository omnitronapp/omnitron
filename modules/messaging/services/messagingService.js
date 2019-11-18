import { HTTP } from "meteor/http";

import { ContactsCollection } from "../../contacts/collections";
import { UserChannels } from "../../channels/collection";

const tgBotUrl = "http://fb12f028.ngrok.io";

export function sendMessageToChannel(contactId, message) {
  const channel = UserChannels.findOne({
    contactId,
    channel: "telegram"
  });

  HTTP.post(`${tgBotUrl}/api/message`, {
    data: {
      chatId: channel.chatId,
      message
    }
  });
}
