import { Mongo } from "meteor/mongo";

import { ChatSchema, MessageSchema } from "./schema";

export const ChatsCollection = new Mongo.Collection("chats");

ChatsCollection.attachSchema(ChatSchema);

export const RawMessagesCollection = new Mongo.Collection("rawMessages");
export const MessagesCollection = new Mongo.Collection("messages");

MessagesCollection.attachSchema(MessageSchema);
