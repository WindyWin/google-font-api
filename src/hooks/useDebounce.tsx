/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react";

//use debouce hook
export const useDebounce = (value: any, delay: number): any => {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        }
    }, [value, delay]);

    return debounceValue;
}
