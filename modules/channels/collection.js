import { Mongo } from "meteor/mongo";

/**
 * channel
 * contactId
 * channelContactId
 * chatId
 */
export const UserChannels = new Mongo.Collection("userChannels");
