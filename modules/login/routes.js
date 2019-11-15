import { MDNRouter } from "../router";
import LoginPage from "./ui/pages/loginPage";
import MainPage from "./ui/pages/mainPage";

MDNRouter.addRoute("/login", LoginPage);
MDNRouter.addRoute("/", MainPage, { exact: true });
