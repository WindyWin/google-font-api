import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IFilterState } from "../types";


const initialState: IFilterState = {
    "query": "",
    "preview.text": "",
    "preview.size": 40,
    "preview.text_type": "sentence",
    "category": ['Display', 'Handwriting', 'Monospace', 'Sans Serif', 'Serif'],
    "subset": "",
    "stylecount": 0,
    "vfonly": false,
    "coloronly": false,
    "sort": "trending",
}

export const useFilter = () => {
    const [filterParam, setFilterParam] = useSearchParams();

    const [filterState, setFilterState] = useState<IFilterState>({
        ...initialState
    });

    useEffect(() => {
        let filterObject: { [k: string]: string | string[] | boolean | number } = Object.fromEntries(filterParam);

        // cast value type not string
        if (filterObject["category"]) {
            filterObject = { ...filterObject, "category": (filterObject["category"] as string).split(",").map(String) };
        }
        if (filterObject["vfonly"]) {
            filterObject = { ...filterObject, "vfonly": filterObject["vfonly"] === "true" };
        }
        if (filterObject["coloronly"]) {
            filterObject = { ...filterObject, "coloronly": filterObject["coloronly"] === "true" };
        }
        if (filterObject["stylecount"]) {
            filterObject = { ...filterObject, "stylecount": parseInt(filterObject["stylecount"] as string) };
        }

        setFilterState({ ...initialState, ...filterObject });
    }, [])



    const addUpdateFilter = (key: keyof IFilterState
        , value: number | string | string[] | boolean) => {
        const newFilterState = { ...filterState, [key]: value };
        setFilterState(newFilterState);
        const newFilterParam = Object.entries(newFilterState)
            .filter(([key, value]) => value !== undefined && value !== initialState[key])
            .map(([key, value]) => [key, Array.isArray(value) ? value.join(",") : value?.toString() ?? ""]);
        setFilterParam(new URLSearchParams(newFilterParam));
    }


    // const removeFilter = (key: keyof IFilterState
    // ) => {
    //     const newFilterState = { ...filterState, [key]: initialState[key] };
    //     setFilterParam(new URLSearchParams(newFilterState));
    // }

    const removeAllFilter = () => {
        setFilterState(initialState);
        setFilterParam(new URLSearchParams());
    }


    return { filterState, setFilterState, addUpdateFilter, removeAllFilter }


}