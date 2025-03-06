export default function PaginationMeter({ current_page, 
                                            limit, 
                                            total_pages, 
                                            total_results
                                        }) 
    {
        return (
            <span>
                { ((current_page) > 1) 
                    ? (((current_page - 1) * limit) + 1) 
                    : current_page }
                        &nbsp;-&nbsp;
                    { ((current_page * (limit)) > total_results) 
                        ? (total_results)
                            : ((current_page) != 1) 
                            ? (current_page * limit) 
                                : ((current_page + (limit - 1))) } 
                        &nbsp;of&nbsp; 
                    { total_results } 
                    &nbsp;<span>result{ (total_results > 1) && 's'}</span>
            </span>
    )
}
