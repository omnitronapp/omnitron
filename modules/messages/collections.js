import { Mongo } from "meteor/mongo";
import { MessageSchema } from "./schemas";

export const RawMessagesCollection = new Mongo.Collection("rawMessages");
export const MessagesCollection = new Mongo.Collection("messages");

// MessagesCollection.attachSchema(MessageSchema);
