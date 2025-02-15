import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import PaginationMeter from '@/components/PaginationMeter.jsx';
import PaginationLinks from '@/components/PaginationLinks.jsx';
import { useBlogCategories } from '@/hooks/blog/useBlogCategories.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [blogCategoryQuery, setBlogCategoryQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 10, 
    }); 
    const { blogCategories, getBlogCategories, loading } = useBlogCategories(blogCategoryQuery); 
    console.log(blogCategories); 

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link to={ route('home.blog.index') }>Blog</Link>&nbsp;Categories
                </h2>
                <Link to={ route('home.blog.categories.create') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center py-0">
                    <span className="mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                            className="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                        </svg>
                    </span>
                    <span>Add</span>
                </Link>
            </div>

            <div className="d-flex justify-content-end pt-3">
                <span>
                    { (blogCategories?.data?.length > 0) 
                        && <PaginationMeter 
                                current_page={ blogCategories?.meta?.current_page } 
                                limit={ blogCategories?.meta?.limit } 
                                total_pages={ blogCategories?.meta?.total_pages } 
                                total_results={ blogCategories?.meta?.total_results } /> } 
                </span> 
            </div>

            <section className="pt-3">
                { (loading == true) 
                    ?   <div className="py-4 d-flex justify-content-center align-items-center">
                            <div className="spinner-grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>  
                        </div>
                            : ((loading == false) && ((blogCategories?.data?.length < 1) || blogCategories?.length < 1)) 
                                ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                        <span>There are no blog categories yet.</span>
                                    </div> 
                                        : ((loading == false) && (blogCategories?.data?.length > 0)) 
                                            ?   <ul className="blog-categories list-unstyled d-flex flex-column align-items-start gap-3">
                                                    { (blogCategories?.data?.map((blogCategory, index) => {
                                                        return (
                                                            <li key={ blogCategory?._id } className="blog-category w-100 border border-1 border-radius-25 d-flex flex-column px-3 py-4">
                                                                <div className="category d-flex justify-content-start gap-4 flex-wrap pt-3">
                                                                    <Link 
                                                                        to={ route('home.blog.categories.show', { id: blogCategory?._id }) } 
                                                                        className="d-flex flex-column text-decoration-none">
                                                                        <span className="fw-semibold">{ blogCategory?.name }</span>
                                                                        <span>{ blogCategory?.description }</span>
                                                                    </Link>
                                                                </div>
                                                            </li> 
                                                        )
                                                    })) }
                                                </ul>
                                                : <></> }
            </section>

            { (blogCategories?.data?.length > 0) 
                && <PaginationLinks 
                    items={ blogCategories } 
                    get_items={ getBlogCategories } 
                    set_query={ setBlogCategoryQuery } /> }  
        </Layout>
    )
}
