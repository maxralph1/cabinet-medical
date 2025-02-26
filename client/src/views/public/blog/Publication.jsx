import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useBlogPublication } from '@/hooks/blog/useBlogPublication.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 
// import NazimImage from '@/assets/images/nazim-transparent.png'; 


export default function Publication() {
    const { id } = useParams(); 
    const { blogPublication, updateBlogPublication } = useBlogPublication(id); 
    console.log(blogPublication); 

    function calculateReadTime(content) {
        const wordCount = content?.split(' ')?.length;
        const wordsPerMinute = 200; 
        return Math.ceil(wordCount / wordsPerMinute);
    }

    return (
        <Layout>
            <h2 className="text-center text-md-start py-3">
                <Link to={ route('blog.index') } className="fw-normal">Blog</Link>&nbsp;
                <span>|</span>&nbsp;
                <span className="fw-semibold">{ blogPublication?.data?.title }</span>
            </h2>

            <section className="content">
                <p className="text-secondary mb-0">
                    <span className="fst-italic">by</span>
                    <span>
                        { ((blogPublication?.data?.user?.role == 'general_practitioner')
                            ? ' Dr.' 
                                : (blogPublication?.data?.user?.role == 'gynaecologist') 
                                ? ' Dr.' 
                                    : (blogPublication?.data?.user?.role == 'laboratory_scientist') 
                                    ? ' ' 
                                        : (blogPublication?.data?.user?.role == 'nurse')
                                        ? ' ' 
                                            : '' ) }
                        &nbsp;
                        { blogPublication?.data?.user?.first_name + 
                            ' ' + 
                            blogPublication?.data?.user?.last_name }</span>
                </p>
                <p className="text-secondary d-flex gap-2" style={{ fontSize: '0.8rem' }}>
                    <span>
                        { dayjs.utc(blogPublication?.data?.created_at).fromNow() }
                    </span>
                    <span>-</span>
                    <span>{ calculateReadTime(blogPublication?.data?.content) }&nbsp;min read</span>
                </p>

                { blogPublication?.data?.image_path?.url && (
                    <section className="publication-image pt-3 pb-5">
                        <picture>
                            <source srcSet={ blogPublication?.data?.image_path?.url }
                                media="(orientation: portrait)" />
                            <img src={ blogPublication?.data?.image_path?.url }
                                className="object-fit-cover border border-1 border-secondary border-radius-25" style={{ width: '100%', height: '50vh' }} alt="" />
                        </picture>
                    </section>
                ) }

                <div 
                    className="preview" 
                    dangerouslySetInnerHTML={{ __html: blogPublication?.data?.content }} 
                />
            </section>
        </Layout>
    )
}
