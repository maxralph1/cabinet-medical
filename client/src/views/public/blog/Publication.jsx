import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Layout from '@/components/public/Layout.jsx'; 
import NazimImage from '@/assets/images/nazim-transparent.png'; 


export default function Publication() {
    return (
        <Layout>
            <h2 className="text-center text-md-start py-3">
                <Link to={ route('blog.index') } className="fw-normal">Blog</Link>&nbsp;
                <Link to={ route('blog.publications.index') } className="fw-normal">Publications</Link>&nbsp;
                <span>|</span>&nbsp;
                <span className="fw-semibold">Where to Watch</span>
            </h2>

            <section className="content">
                <div>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam neque nulla fugit dolor, voluptates nisi ipsa maiores sit nobis ut iusto eos esse provident aperiam vel velit autem alias est officiis totam, amet cupiditate. Odio velit libero incidunt, odit inventore impedit, quod dignissimos numquam fugiat repudiandae possimus in enim non. Debitis laboriosam vero suscipit harum nobis ipsa odio voluptatem eum odit sit vel architecto enim unde labore iusto similique perferendis natus, officia aliquam alias placeat! Iste aspernatur rem provident aliquid nam repellat laborum molestias quasi explicabo excepturi perspiciatis repellendus quo nihil, iusto veritatis incidunt quaerat dolorem aliquam quas. Eius, fuga.</p>
                </div>
            </section>
        </Layout>
    )
}
