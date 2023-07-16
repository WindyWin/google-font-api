import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout";
import { FontDetail, Home, NotFound } from "../pages";

const router = createBrowserRouter([
    {
        element: <Layout />

        ,
        errorElement: <NotFound />,
        children: [

            {
                path: "/",
                element: <Home />
            },
            {
                path: "/font/:id",
                element: <FontDetail />
            },

        ]

    },

]);


export default router;