import { UserChannels } from "../../../channels/collection";
import { ContactsCollection } from "../../../contacts/collections";
import { MessagesCollection } from "../../../messages/collections";
import { trimMessage } from "../../../utils";

export default {
  sendMessage(req, res) {
    /**
      {
        messageId: message_id
        userId: from.id
        username: from.username
        firstName: chat.first_name
        chatId: chat.id
        date: date
        text: text
        channel: "telegram"
      }
     */

    const messageData = req.body;

    console.log(messageData);
    const existingUserChannel = UserChannels.findOne({
      channel: messageData.channel,
      chatId: messageData.chatId,
      channelContactId: messageData.contactId
    });

    let contactId = undefined;
    if (existingUserChannel) {
      contactId = existingUserChannel.contactId;
    } else {
      contactId = ContactsCollection.insert({
        name: messageData.firstName || messageData.username,
        channels: [messageData.channel]
      });

      UserChannels.insert({
        channel: messageData.channel,
        contactId,
        channelContactId: messageData.userId,
        chatId: messageData.chatId
      });
    }

    const messageId = MessagesCollection.insert({
      contactId,
      channel: messageData.channel,
      messageId: messageData.messageId,
      message: messageData.text
    });

    ContactsCollection.update(
      { _id: contactId },
      {
        $set: {
          lastMessageId: messageId,
          lastMessageTrimmed: trimMessage(messageData.text)
        }
      }
    );

    res.send({
      contactId,
      messageId
    });
  }
};
