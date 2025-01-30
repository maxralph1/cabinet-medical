import scrollToTop from '@/utils/ScrollToTop.jsx'; 


export default function PaginationLinks({   items, 
                                            get_items, 
                                            query,
                                            set_query
                                        }) {
    return (
        <section className="pagination-links d-flex justify-content-end align-items-center gap-3 pt-4">
            <span 
                type="button" 
                onClick={ async () => { 
                    scrollToTop(); 
                    let firstPage = 1
                        set_query(prevState => ({
                            ...prevState, 
                            page: firstPage 
                        })); 
                        await get_items(query);  
                    } }
                className="btn btn-sm btn-outline-secondary border-radius-25">
                1
            </span>

            { (items?.meta?.total_pages > 1) && 
                <>
                    <span 
                        onClick={ async () => { 
                            scrollToTop(); 
                            let previousPage = ((items?.meta?.current_page >= 1) ? (items?.meta?.current_page - 1) : 1)
                            set_query(prevState => ({
                                ...prevState, 
                                page: previousPage
                            })); 
                            await get_items(query); 
                        } }
                        className="btn btn-sm btn-outline-secondary border-radius-25">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            className="bi bi-caret-left" viewBox="0 0 16 16">
                            <path
                                d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753" />
                        </svg>
                    </span> 
                    <span 
                        onClick={ async () => { 
                            scrollToTop(); 
                            let nextPage = ((items?.meta?.current_page < items?.meta?.total_pages) ? (items?.meta?.current_page + 1) : items?.meta?.total_pages)
                            set_query(prevState => ({
                                ...prevState, 
                                page: nextPage
                            })); 
                            await get_items(query); 
                        } } 
                        className="btn btn-sm btn-outline-secondary border-radius-25">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            className="bi bi-caret-right" viewBox="0 0 16 16">
                            <path
                                d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
                        </svg>
                    </span>
                    <span 
                        onClick={ async () => { 
                            scrollToTop(); 
                            let lastPage = items?.meta?.total_pages
                            set_query(prevState => ({
                                ...prevState, 
                                page: lastPage
                            })); 
                            await get_items(query); 
                        } } 
                        className="btn btn-sm btn-outline-secondary border-radius-25">
                        { items?.meta?.total_pages }
                    </span>
                </>
            }
        </section>
    )
}
