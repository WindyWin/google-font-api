import { useState } from "react";

export const usePagination = (initialPageSize: number, initMaximumItems: number) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [maximumItems, setMaximumItems] = useState(initMaximumItems);

    function goToNextPage() {
        setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, Math.ceil(maximumItems / initialPageSize)));
    }
    function updateNewListPagination(maximumItems: number) {
        setMaximumItems(maximumItems);
        setPageNumber(1);
    }

    return { pageNumber, maximumItems, goToNextPage, setPageNumber, updateNewListPagination }

}