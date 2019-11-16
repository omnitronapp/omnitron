import { Mongo } from "meteor/mongo";
import { ContactSchema } from "./schemas";
export const ContactsCollection = new Mongo.Collection("contacts");

ContactsCollection.attachSchema(ContactSchema);
