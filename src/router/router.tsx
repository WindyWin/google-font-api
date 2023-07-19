import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout";
import ThemeProvider from "../context/ThemeContext";
import { FontDetail, Home, NotFound } from "../pages";


const router = createBrowserRouter([
    {
        element: <ThemeProvider><Layout /></ThemeProvider>
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