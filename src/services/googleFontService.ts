import axios from "axios";
import { axiosInstance } from "../config/axios";
import { AllFontsResponse, FontResponse } from "../types";


export const getAllFonts = () => axios.get("https://fonts.google.com/metadata/fonts").then((res) =>
    res.data as AllFontsResponse)
    .then((res) => res.familyMetadataList);

export const getFontLink = (family: string,) =>
    axiosInstance.get(`/webfonts/v1/webfonts?key=${import.meta.env.VITE_API_KEY as string}&family=${family}`)
        .then((res) => {
            if ((res.data as FontResponse).items.length > 0)
                return res.data as FontResponse;
            else throw new Error("No font found");
        });
