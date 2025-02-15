import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import Layout from '@/components/protected/Layout.jsx'; 

export default function Index() {
    return (
        <Layout>
            <div className="">
                <h2 className="fs-3">Blog</h2>

                <section className="d-flex flex-column align-items-start gap-3 flex-wrap pt-4">
                    <Link to={ route('home.blog.categories.index') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                        <span>Go to Categories</span>
                    </Link>
                    <Link to={ route('home.blog.publications.index') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                        <span>Go to Publications</span>
                    </Link>
                </section>
            </div>
        </Layout>
    )
}
