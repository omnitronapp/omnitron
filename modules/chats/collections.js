import { Mongo } from "meteor/mongo";

import { ChatSchema } from "./schema";

export const ChatsCollection = new Mongo.Collection("chats");

ChatsCollection.attachSchema(ChatSchema);
