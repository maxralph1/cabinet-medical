import { useContext, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
import PaginationLinks from '@/components/PaginationLinks.jsx'; 
import { useBlogPublications } from '@/hooks/blog/useBlogPublications.jsx'; 
import { useBlogPublication } from '@/hooks/blog/useBlogPublication.jsx'; 
import { useBlogPublicationComment } from '@/hooks/blog/useBlogPublicationComment.jsx'; 
import { useBlogPublicationLike } from '@/hooks/blog/useBlogPublicationLike.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 
import NazimImage from '@/assets/images/nazim-transparent.png'; 


export default function Index() {
    const { user, signOut } = useContext(AuthContext); 
    console.log('user', user)

    const [blogPublicationQuery, setBlogPublicationQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 1, 
    }); 
    const { blogPublications, getBlogPublications, setBlogPublications, loading } = useBlogPublications(blogPublicationQuery); 
    const { deleteBlogPublication } = useBlogPublication(); 
    console.log(blogPublications); 

    const { blogPublicationComment, createBlogPublicationComment, deleteBlogPublicationComment } = useBlogPublicationComment(); 
    
    const handleCommentSubmit = async e => {
        e.preventDefault(); 

        const formData = new FormData(); 
        e.target.article.value && formData.append('article', e.target.article.value); 
        blogPublicationComment?.data?.content && formData.append('content', blogPublicationComment?.data?.content); 

        await createBlogPublicationComment(formData); 
        await blogPublicationComment?.setData({}); 
        // await getBlogPublications(blogPublicationQuery); 
        window.location.reload();
    }; 

    const { createBlogPublicationLike, deleteBlogPublicationLike } = useBlogPublicationLike(); 

    function calculateReadTime(content) {
        const wordCount = content.split(' ').length;
        const wordsPerMinute = 200; 
        return Math.ceil(wordCount / wordsPerMinute);
    }

    return (
        <Layout>
            <h2 className="text-center text-md-start px-2 px-md-5">Blog</h2>
            
            <section className="articles px-2 px-md-5 py-3">
                { (loading == true) 
                    ?   <div className="py-4 d-flex justify-content-center align-items-center">
                            <div className="spinner-grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>  
                        </div> 
                            : ((loading == false) && ((blogPublications == null) || (blogPublications.length == 0)))
                                ?   <div className="d-flex justify-content-center align-items-center">
                                        <span>There are no blog publications yet.</span>
                                    </div> 
                                    : ((loading == false) && (blogPublications?.data?.length > 0)) 
                                        ? <div className="d-flex flex-column gap-4">
                                            { (blogPublications?.data
                                                                    ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                                                    ?.map((blogPublication, index) => {
                                                return (
                                                    <article key={ blogPublication?._id } className="d-flex flex-column justify-content-between align-items-start">
                                                        <Link to={ route('blog.publications.show', { id: blogPublication?._id }) } className="text-decoration-none text-dark">
                                                            <h3 className="fs-5 fw-bold mb-0">{ blogPublication?.title }</h3>
                                                            <p className="text-secondary">
                                                                <span className="fst-italic">by</span>
                                                                <span>
                                                                    { ((blogPublication?.user?.role == 'general_practitioner')
                                                                        ? ' Dr.' 
                                                                            : (blogPublication?.user?.role == 'gynaecologist') 
                                                                            ? ' Dr.' 
                                                                                : (blogPublication?.user?.role == 'laboratory_scientist') 
                                                                                ? ' ' 
                                                                                    : (blogPublication?.user?.role == 'nurse')
                                                                                    ? ' ' 
                                                                                        : '' ) }
                                                                    &nbsp;
                                                                    { blogPublication?.user?.first_name + 
                                                                        ' ' + 
                                                                        blogPublication?.user?.last_name }</span>
                                                            </p>
                                                            <div 
                                                                className="preview" 
                                                                dangerouslySetInnerHTML={{ __html: (blogPublication?.content?.slice(0, 100)) + (blogPublication?.content?.length > 99 ? '...' : '') }} 
                                                            />
                                                            <p className="text-secondary d-flex gap-2 mb-2" style={{ fontSize: '0.8rem' }}>
                                                                <span>
                                                                    { dayjs.utc(blogPublication?.data?.created_at).fromNow() }
                                                                </span>
                                                                <span>-</span>
                                                                <span>{ calculateReadTime(blogPublication?.content) }&nbsp;
                                                                    min read</span>
                                                            </p>
                                                        </Link>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <section className="likes">
                                                                <div className="d-flex gap-1">
                                                                    <span 
                                                                        className="" 
                                                                        style={{ marginTop: '0.1rem' }}>
                                                                            {(blogPublication?.likes?.length > 0) && blogPublication.likes?.find(foundLike => foundLike?.user?._id == user?.user?.user_id)
                                                                                ? 
                                                                                <button 
                                                                                    onClick={ async () => {
                                                                                        await deleteBlogPublicationLike((blogPublication?.likes?.length > 0) && blogPublication.likes?.find(foundLike => foundLike?.user?._id == user?.user?.user_id));
                                                                                        await getBlogPublications(blogPublicationQuery); 
                                                                                    } }
                                                                                    className="text-decoration-none text-secondary d-flex align-items-center border-0 bg-transparent px-0">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up-fill text-info" viewBox="0 0 16 16">
                                                                                            <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                                                                                        </svg>
                                                                                </button>
                                                                                :
                                                                                <button 
                                                                                    onClick={ async () => {
                                                                                        await createBlogPublicationLike(blogPublication?._id); 
                                                                                        await getBlogPublications(blogPublicationQuery); 
                                                                                    } }
                                                                                    className="text-decoration-none text-secondary d-flex align-items-center border-0 bg-transparent px-0">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up text-info" viewBox="0 0 16 16">
                                                                                            <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                                                                        </svg>
                                                                                </button>
                                                                            }
                                                                    </span>
                                                                    <span 
                                                                        type="button" 
                                                                        data-bs-toggle="modal" data-bs-target={`#blogPublicationLike${blogPublication?._id}Modal`} 
                                                                        className="">
                                                                            { blogPublication?.likes?.length }&nbsp;like{ (blogPublication?.likes?.length > 1) ? 's' : '' }
                                                                    </span>
                                                                </div>

                                                                <section className="modal fade" id={`blogPublicationLike${blogPublication?._id}Modal`} tabIndex="-1" aria-labelledby={`blogPublicationLike${blogPublication?._id}ModalLabel`}>
                                                                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                                        <div className="modal-content">
                                                                            <div className="modal-header d-flex justify-content-between align-items-center">
                                                                                <h3 className="fs-6 pt-3" id={`blogPublicationLike${blogPublication?._id}ModalLabel`}>Likes</h3>
                                                                                <button type="button" data-bs-dismiss="modal" aria-label="Close" className="border-0 bg-transparent">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                                    </svg>
                                                                                </button>
                                                                            </div>
                                                                            <div className="modal-body pt-3">
                                                                                {/* <h4 className="fs-6">Likes hjguy</h4>
                                                                                <p>{ blogPublication?.content ? blogPublication?.content : 'N/A' }</p> */}
                                                                                <div className="d-flex flex-column gap-3">
                                                                                    { (blogPublication?.likes?.length > 0) 
                                                                                        ?   blogPublication?.likes?.map((like, index) => {
                                                                                                return (
                                                                                                    <div key={ like?._id } className="d-flex justify-content-between align-items-end">
                                                                                                        <div className="d-flex justify-content-start gap-3">
                                                                                                            { like?.user?.image_path?.url && (
                                                                                                                <div className="user-image">
                                                                                                                    <img src={ like?.user?.image_path?.url } alt={ like?.user?.first_name + ' ' + like?.user?.last_name + ' image' } />
                                                                                                                </div>
                                                                                                            )}
                                                                                                            <div className="user-names">
                                                                                                                { like?.user?.first_name + ' ' + like?.user?.last_name }
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <small className="text-secondary">{ dayjs.utc(like?.created_at).fromNow() }</small>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )
                                                                                            }) 
                                                                                        :   <div className="d-flex justify-content-center align-items-center py-3">
                                                                                                <span>There are no likes yet.</span>
                                                                                            </div> 
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            </section>
                                                            <section className="comments">
                                                                <div className="d-flex gap-1">
                                                                    <span 
                                                                        type="button" 
                                                                        data-bs-toggle="modal" data-bs-target={`#blogPublicationCommentCreate${blogPublication?._id}Modal`} 
                                                                        className="">
                                                                            { (blogPublication?.comments?.length > 0) && blogPublication.comments?.find(foundComment => foundComment?.user?._id == user?.user?.user_id) 
                                                                                ?   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-right-text-fill text-info" viewBox="0 0 16 16">
                                                                                        <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353zM3.5 3h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1"/>
                                                                                    </svg> 
                                                                                :   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-right-quote text-info" viewBox="0 0 16 16">
                                                                                        <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                                                                                        <path d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"/>
                                                                                    </svg> } 
                                                                    </span>
                                                                    <span 
                                                                        type="button" 
                                                                        data-bs-toggle="modal" data-bs-target={`#blogPublicationComment${blogPublication?._id}Modal`} 
                                                                        className="">
                                                                            { blogPublication?.comments?.length }&nbsp;comment{ (blogPublication?.comments?.length > 1) ? 's' : '' }
                                                                    </span>
                                                                </div>

                                                                <section className="blog-article-comment-create modal fade" id={`blogPublicationCommentCreate${blogPublication?._id}Modal`} tabIndex="-1" aria-labelledby={`blogPublicationCommentCreate${blogPublication?._id}ModalLabel`}>
                                                                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                                        <div className="modal-content">
                                                                            <div className="modal-header d-flex justify-content-end align-items-center">
                                                                                <h3 className="fs-6 pt-3 visually-hidden" id={`blogPublicationCommentCreate${blogPublication?._id}ModalLabel`}>Comments</h3>
                                                                                <button type="button" data-bs-dismiss="modal" aria-label="Close" className="border-0 bg-transparent">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                                    </svg>
                                                                                </button>
                                                                            </div>
                                                                            <div className="modal-body pt-3">
                                                                                <form onSubmit={ handleCommentSubmit }>
                                                                                    <div className="row">
                                                                                        <div className="form-floating mb-3 col-12">
                                                                                            <textarea 
                                                                                                value={ blogPublicationComment?.data?.content ?? '' }
                                                                                                id="content"
                                                                                                className="form-control" 
                                                                                                style={{ height: '100px' }}  
                                                                                                onChange={ e => blogPublicationComment.setData({
                                                                                                    ...blogPublicationComment?.data,
                                                                                                    content: e.target.value,
                                                                                                }) } 
                                                                                                placeholder="This is the count of the White Blood Cells." 
                                                                                                required></textarea>
                                                                                            <label htmlFor="content">Comment</label>

                                                                                            <input 
                                                                                                type="text" 
                                                                                                name="article" 
                                                                                                id="article" 
                                                                                                defaultValue={ blogPublication?._id } 
                                                                                                hidden="hidden" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <div className="col-12 d-flex justify-content-end pt-3">
                                                                                            <button type="submit" className="btn btn-outline-secondary border-radius-25">Save</button>
                                                                                        </div>
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </section>

                                                                <section className="comments-and-users modal fade" id={`blogPublicationComment${blogPublication?._id}Modal`} tabIndex="-1" aria-labelledby={`blogPublicationComment${blogPublication?._id}ModalLabel`}>
                                                                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                                        <div className="modal-content">
                                                                            <div className="modal-header d-flex justify-content-between align-items-center">
                                                                                <h3 className="fs-6 pt-3" id={`blogPublicationComment${blogPublication?._id}ModalLabel`}>Comments</h3>
                                                                                <button type="button" data-bs-dismiss="modal" aria-label="Close" className="border-0 bg-transparent">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                                    </svg>
                                                                                </button>
                                                                            </div>
                                                                            <div className="modal-body pt-3">
                                                                                <div className="d-flex flex-column gap-3">
                                                                                    { (blogPublication?.comments?.length > 0) 
                                                                                        ?   blogPublication?.comments?.map((comment, index) => {
                                                                                                return (
                                                                                                    <div key={ comment?._id } className="d-flex justify-content-between align-items-end">
                                                                                                        <div className="d-flex justify-content-start gap-3">
                                                                                                            { comment?.user?.image_path?.url && (
                                                                                                                <div className="user-image">
                                                                                                                    <img src={ comment?.user?.image_path?.url } alt={ comment?.user?.first_name + ' ' + comment?.user?.last_name + ' image' } />
                                                                                                                </div>
                                                                                                            )}
                                                                                                            <div className="user-names">
                                                                                                                { comment?.user?.first_name + ' ' + comment?.user?.last_name }
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <small className="text-secondary">{ dayjs.utc(comment?.created_at).fromNow() }</small>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )
                                                                                            }) 
                                                                                        :   <div className="d-flex justify-content-center align-items-center py-3">
                                                                                                <span>There are no comments yet.</span>
                                                                                            </div> 
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            </section>
                                                        </div>
                                                    </article>
                                                )
                                            })) }
                                        </div>
                                        : <></> }
            </section>

            <section className="px-2 px-md-5">
                { (blogPublications?.data?.length > 0) 
                    && <PaginationLinks 
                        items={ blogPublications } 
                        get_items={ getBlogPublications } 
                        set_query={ setBlogPublicationQuery } /> } 
            </section>
            
        </Layout>
    )
}
