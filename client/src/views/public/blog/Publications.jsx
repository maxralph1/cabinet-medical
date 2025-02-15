import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Layout from '@/components/public/Layout.jsx'; 
import NazimImage from '@/assets/images/nazim-transparent.png'; 


export default function Publications() {
    return (
        <Layout>
            <h2 className="text-center text-md-start py-3">
                <Link to={ route('blog.index') } className="fw-normal">Blog</Link>&nbsp;
                <span className="fw-semibold">Publications</span>
            </h2>

            <section>
                <h3>Articles</h3>

                <div>
                    <article className="article row align-items-center flex-wrap">
                        <div className="col-sm-12 col-md-4">
                            <picture>
                                <img src={ NazimImage } style={{ maxWidth: '315px' }}  alt="" className="image-fluid border-radius-25" />
                            </picture>
                        </div>
                        <div className="col-sm-12 col-md-8 d-flex flex-column">
                            <h3 className="order-2">Where to Watch 'John Wick: Chapter 4'</h3>
                            <div className="order-1 d-flex align-items-center gap-3 py-3">
                                <div className="d-flex align-items-center">
                                    <span>
                                        <img 
                                            src={ NazimImage } 
                                            className="object-fit-cover border border-2 border-dark"
                                            style={{ width: '25px', height: '25px', borderRadius: '50px' }} 
                                            alt="" />
                                    </span>
                                    <span className="ms-2">John Doe</span>
                                </div>
                                <span className="separator">-</span>
                                <span>12 minutes ago</span>
                            </div>
                            <p className="order-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore alias, iste est ullam beatae incidunt tempore magni enim eum et?</p>
                            <div className="order-4 d-flex gap-2">
                                <span className="text-info">Diabetes</span>
                                <span className="separator">-</span>
                                <span>4 mins read</span>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </Layout>
    )
}
