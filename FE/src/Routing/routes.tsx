import React from "react";
import { GeneralConfig } from "../Config/config";

// eslint-disable-next-line react-refresh/only-export-components
const Home = React.lazy(() => import("../Pages/Home/Home"));

const routes = [{ path: GeneralConfig.HOME_URL, element: <Home /> }];

export default routes;
