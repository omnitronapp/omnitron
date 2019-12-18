import { WebApp } from "meteor/webapp";
import express from "express";
import bodyParser from "body-parser";

const Rest = express();

// Rest.use(bodyParser.json());
// Rest.use(bodyParser.urlencoded({ extended: true }));

WebApp.connectHandlers.use(Rest);

export { Rest };
