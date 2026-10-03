import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    const pageTemplate = pages.querySelector('label');
    pages.innerHTML = '';

    return (data, state, action) => {
        const rowsCount = data.length;
        const pageCount = Math.ceil(rowsCount / state.rowsPerPage);
        let page = Math.min(state.page, pageCount);

        if (action?.name === 'first') page = 1;
        else if (action?.name === 'prev') page = Math.max(1, page - 1);
        else if (action?.name === 'next') page = Math.min(pageCount, page + 1);
        else if (action?.name === 'last') page = pageCount;
        else if (action?.name === 'page') page = Number(action.value);

        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            return createPage(pageTemplate.cloneNode(true), pageNumber, pageNumber === page);
        }));

        fromRow.textContent = (page - 1) * state.rowsPerPage + 1;
        toRow.textContent = Math.min(page * state.rowsPerPage, rowsCount);
        totalRows.textContent = rowsCount;

        const start = (page - 1) * state.rowsPerPage;
        return data.slice(start, start + state.rowsPerPage);
    }
};