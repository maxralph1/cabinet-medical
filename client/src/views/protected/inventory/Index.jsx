import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    return (
        <Layout>
            <div className="">
                <h2 className="fs-3">Inventory</h2>

                <section className="d-flex flex-column align-items-start gap-3 flex-wrap pt-4">
                    <Link to={ route('home.inventory.categories.index') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                        <span>Go to Categories</span>
                    </Link>
                    <Link to={ route('home.inventory.products.index') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                        <span>Go to Products</span>
                    </Link>
                    <Link to={ route('home.inventory.invoices.index') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                        <span>Invoices</span>
                    </Link>
                    <Link to={ route('home.inventory.invoices.create') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                        <span>Raise Invoice</span>
                    </Link>
                </section>
            </div>
        </Layout>
    )
}
