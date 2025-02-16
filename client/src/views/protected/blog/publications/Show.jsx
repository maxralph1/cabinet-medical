import { useState } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useBlogPublication } from '@/hooks/blog/useBlogPublication.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Show() {
    const { id } = useParams(); 
    const { blogPublication, updateBlogPublication } = useBlogPublication(id); 
    console.log(blogPublication); 

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link 
                        to={ route('home.blog.publications.index') } className="">Blog Publications</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Publication</span>
                </h2>
            </div>

            <section className="publication pt-3">
                <h3>{ blogPublication?.data?.title }</h3>

                <section className="categories pt-1">
                    <ul className="list-unstyled d-flex justify-content-start align-items-center gap-3">
                        {blogPublication?.data?.categories?.map((item, index) => (
                            <li key={index} className="category">
                                <div className="">
                                    <span className="fw-semibold badge rounded-pill text-bg-secondary">{ ((item?.blog_category?.name)?.slice(0,1)?.toUpperCase() + item?.blog_category?.name?.slice(1)) }
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <p className="pt-4">by&nbsp;
                    <span>{ ((blogPublication?.data?.user?.first_name)?.slice(0,1)?.toUpperCase() + blogPublication?.data?.user?.first_name?.slice(1))
                            + ' ' 
                            + ((blogPublication?.data?.user?.last_name)?.slice(0,1)?.toUpperCase() + blogPublication?.data?.user?.last_name?.slice(1)) }</span>,&nbsp;
                    <span>{ dayjs.utc(blogPublication?.data?.user?.created_at).fromNow() }</span>
                </p>

                { (blogPublication?.data?.image_path?.url) && (
                    <section className="publication-image pt-3">
                        <picture>
                            <source srcSet={ blogPublication?.data?.image_path?.url }
                                media="(orientation: portrait)" />
                            <img src={ blogPublication?.data?.image_path?.url }
                                className="object-fit-cover border border-1 border-secondary border-radius-25" style={{ width: '100%', height: '50vh' }} alt="" />
                        </picture>
                    </section>
                )}

                <section className="content pt-4">
                    <div 
                        className="preview fs-5" 
                        dangerouslySetInnerHTML={{ __html: (blogPublication?.data?.content) }} 
                    />
                </section>
            </section>
        </Layout>
    )
}
