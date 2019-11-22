import { transports } from "../transports/";
import { Transport } from "./transport";

transports.registerTransport("telegram", new Transport());
