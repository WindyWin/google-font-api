import { useState } from "react";

export const usePagination = (initialPageSize: number, initMaximumItems: number) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [maximumItems, setMaximumItems] = useState(initMaximumItems);

    const goToNextPage = () => {
        console.log(pageNumber);
        console.log(pageNumber * initialPageSize, maximumItems)
        if (pageNumber * initialPageSize < maximumItems) {
            setPageNumber(pageNumber => pageNumber + 1);
            return true;
        }
        return false;
    }
    const updateNewListPagination = (maximumItems: number) => {
        setMaximumItems(maximumItems);
        setPageNumber(1);
    }

    return { pageNumber, maximumItems, goToNextPage, setPageNumber, updateNewListPagination }

}