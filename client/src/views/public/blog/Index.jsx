import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Layout from '@/components/public/Layout.jsx'; 
import NazimImage from '@/assets/images/nazim-transparent.png';


export default function Index() {
    return (
        <Layout>
            <h2 className="text-center text-md-start py-3">Blog</h2>
            <div className="text-center text-md-start">
                <p className="fs-5 fw-semibold">Our blog is rich with articles that focus on basic health tips.</p>
                <p className="fs-5">If you are the reader type, immerse yourself in and explore our articles to learn basic health tips with our engaging posts from our highly certified professionals.</p>
            </div>

            <section className="featured-article row align-items-center">
                <div className="col-sm-12 col-md-6">
                    <picture>
                        <img src={ NazimImage } style={{ maxWidth: '100%' }}  alt="" className="image-fluid border-radius-25" />
                    </picture>
                </div>
                <div className="col-sm-12 col-md-6 d-flex flex-column">
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
            </section>

            <section className="latest-articles pt-5">
                <h3>Latest Articles</h3>
                <ul className="list-unstyled row">
                    <li className="col-sm-12 col-md-6 col-lg-3 px-3">
                        <Link to={ route() } className="text-decoration-none">
                            <div>
                                <picture>
                                    <img src={ NazimImage } style={{ maxWidth: '100%' }} alt="" className="image-fluid border-radius-25" />
                                </picture>
                            </div>
                            <div className="d-flex flex-column">
                                <h4 className="order-2 fs-5">Where to Watch 'John Wick: Chapter 4'</h4>
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
                        </Link>
                    </li>
                    <li className="col-sm-12 col-md-6 col-lg-3 px-3">
                        <Link to={ route() } className="text-decoration-none">
                            <div>
                                <picture>
                                    <img src={ NazimImage } style={{ maxWidth: '100%' }} alt="" className="image-fluid border-radius-25" />
                                </picture>
                            </div>
                            <div className="d-flex flex-column">
                                <h4 className="order-2 fs-5">Where to Watch 'John Wick: Chapter 4'</h4>
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
                        </Link>
                    </li>
                    <li className="col-sm-12 col-md-6 col-lg-3 px-3">
                        <Link to={ route() } className="text-decoration-none">
                            <div>
                                <picture>
                                    <img src={ NazimImage } style={{ maxWidth: '100%' }} alt="" className="image-fluid border-radius-25" />
                                </picture>
                            </div>
                            <div className="d-flex flex-column">
                                <h4 className="order-2 fs-5">Where to Watch 'John Wick: Chapter 4'</h4>
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
                        </Link>
                    </li>
                    <li className="col-sm-12 col-md-6 col-lg-3 px-3">
                        <Link to={ route() } className="text-decoration-none">
                            <div>
                                <picture>
                                    <img src={ NazimImage } style={{ maxWidth: '100%' }} alt="" className="image-fluid border-radius-25" />
                                </picture>
                            </div>
                            <div className="d-flex flex-column">
                                <h4 className="order-2 fs-5">Where to Watch 'John Wick: Chapter 4'</h4>
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
                        </Link>
                    </li>
                </ul>
            </section>

            <section className="must-read-articles pt-5">
                <h3>Must Read</h3>
                <div className="row">
                    <article className="order-2 order-md-1 col-sm-12 col-md-3 p-3">
                        <Link to={ route() } className="text-decoration-none">
                            <div>
                                <picture>
                                    <img src={ NazimImage } style={{ maxWidth: '100%' }} alt="" className="image-fluid border-radius-25" />
                                </picture>
                            </div>
                            <div className="d-flex flex-column">
                                <h4 className="order-2 fs-5">Where to Watch 'John Wick: Chapter 4'</h4>
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
                        </Link>
                    </article>
                    <article 
                        className="order-1 order-md-2 col-sm-12 col-md-6 object-fit-cover border-radius-25 p-3" 
                        style={{ backgroundImage: `url(${NazimImage})`, backgroundSize: '100%', backgroundRepeat: 'no-repeat', objectFit: 'cover', minHeight: '400px' }}>
                        <div className="d-flex flex-column h-100 justify-content-end text-white" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}>
                            <h4 className="order-2 fs-5">Where to Watch 'John Wick: Chapter 4'</h4>
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
                    <article className="order-3 col-sm-12 col-md-3 p-3">
                        <Link to={ route() } className="text-decoration-none">
                            <div>
                                <picture>
                                    <img src={ NazimImage } style={{ maxWidth: '100%' }} alt="" className="image-fluid border-radius-25" />
                                </picture>
                            </div>
                            <div className="d-flex flex-column">
                                <h4 className="order-2 fs-5">Where to Watch 'John Wick: Chapter 4'</h4>
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
                        </Link>
                    </article>
                </div>
            </section>

            <section>
                
            </section>
        </Layout>
    )
}
