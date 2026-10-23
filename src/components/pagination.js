import {getPages} from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
    const pageTemplate = pages.querySelector('label');
    pages.innerHTML = '';

    let pageCount;

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        if (action?.name === 'first') page = 1;
        else if (action?.name === 'prev') page = Math.max(1, page - 1);
        else if (action?.name === 'next') page = Math.min(pageCount, page + 1);
        else if (action?.name === 'last') page = pageCount;
        else if (action?.name === 'page') page = Number(action.value);

        return Object.assign({}, query, {
            limit,
            page
        });
    };

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);

        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            return createPage(pageTemplate.cloneNode(true), pageNumber, pageNumber === page);
        }));

        fromRow.textContent = (page - 1) * limit + 1;
        toRow.textContent = Math.min(page * limit, total);
        totalRows.textContent = total;
    };

    return { updatePagination, applyPagination };
};