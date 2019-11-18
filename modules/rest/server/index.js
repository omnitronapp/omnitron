import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import express from "express";
import bodyParser from "body-parser";
import MessageController from "./controllers/MessageController";

const Rest = express();

Rest.use(bodyParser.json());
Rest.use(bodyParser.urlencoded({ extended: true }));

WebApp.connectHandlers.use(Rest);

Rest.post("/api/message", Meteor.bindEnvironment(MessageController.sendMessage));

export { Rest };
