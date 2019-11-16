import { Mongo } from "meteor/mongo";
import { MessageSchema } from "./schemas";

export const MessagesCollection = new Mongo.Collection("messages");

MessagesCollection.attachSchema(MessageSchema);
