import { lazy } from "react";
const FontDetail = lazy(() => import("./FontDetail/FontDetail"));
const Home = lazy(() => import("./Home/Home"));
const NotFound = lazy(() => import("./NotFound/NotFound"));

export { FontDetail, Home, NotFound };

