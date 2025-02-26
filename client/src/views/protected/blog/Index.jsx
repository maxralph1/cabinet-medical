import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    return (
        <Layout>
            <div className="">
                <h2 className="fs-3">Blog</h2>

                <section className="d-flex flex-column align-items-start gap-3 flex-wrap pt-4">
                    <Link to={ route('home.blog.categories.index') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                        <span className="d-flex align-items-center">
                            <span>View Categories</span>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
                                </svg>
                            </span>
                        </span>
                    </Link>
                    <Link to={ route('home.blog.publications.index') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                        <span className="d-flex align-items-center">
                            <span>Publications</span>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
                                </svg>
                            </span>
                        </span>
                    </Link>
                </section>
            </div>
        </Layout>
    )
}
