import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Layout from '@/components/protected/Layout.jsx'

export default function Show() {
    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link to={ route('home.inventory.index') } className="">Inventory</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Griseofulvin (500mg)</span>
                </h2>
            </div>

            <section className="pt-3">
                <div className="product-image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#414141" className="bi bi-image"
                        viewBox="0 0 16 16">
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                        <path
                            d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z" />
                    </svg>
                </div>
                <section className="product-details d-flex flex-column gap-3 pt-4">
                    <span>Product Code:&nbsp;<span className="fw-semibold">1245547868858</span></span>
                    <span>Product Name:&nbsp;<span className="fw-semibold">Griseofulvin</span></span>
                    <span className="">Purchased:&nbsp;<span className="fw-semibold">20 November, 2025</span></span>
                    <span className="">Amount Purchased:&nbsp;<span className="fw-semibold">20MUR</span></span>
                    <span className="">Manufacturer:&nbsp;<span className="fw-semibold">Pfizer</span></span>
                    <span className="">Make Country:&nbsp;<span className="fw-semibold">China</span></span>
                    <span className="">Manufacture Date:&nbsp;<span className="fw-semibold">20 November, 2025</span></span>
                    <span className="">Expiration Date:&nbsp;<span className="fw-semibold">20 November, 2025</span></span>
                </section>
            </section>
        </Layout>
    )
}
