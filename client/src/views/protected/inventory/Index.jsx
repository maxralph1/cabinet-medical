import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    return (
        <Layout>
            <div class="d-flex justify-content-between align-items-center">
                <h2 class="fs-3">Inventory</h2>
                <Link to={ route('home.inventory.create') } class="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                    <span class="mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-plus-lg"
                            viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                        </svg>
                    </span>
                    <span >Add</span>
                </Link>
            </div>

            <div class="d-flex justify-content-end pt-4">
                <span>1 - 10 of 25 results</span>
            </div>

            <section class="pt-3">
                <ul class="list-unstyled d-flex flex-column align-items-start gap-3">
                    <li class="border border-1 border-radius-25 d-flex flex-column px-3 py-4">
                        <span>#1</span>
                        <span><span class="text-secondary">Ref #:</span>&nbsp;<span>#123547QGV215484</span></span>
                        <span><span class="text-secondary">Product Code:</span>&nbsp;<span>#123547QGV215484</span></span>
                        <span class="fw-semibold fs-5">Griseofulvin</span>
                        <div class="d-flex flex-wrap column-gap-4">
                            <span class="text-secondary">Purchased:&nbsp;<span class="fw-semibold">20 November, 2025</span></span>
                            <span class="text-secondary">Amount Purchased:&nbsp;<span class="fw-semibold">20MUR</span></span>
                            <span class="text-secondary">Manufacturer:&nbsp;<span class="fw-semibold">Pfizer</span></span>
                            <span class="text-secondary">Make Country:&nbsp;<span class="fw-semibold">China</span></span>
                            <span class="text-secondary">Manufacture Date:&nbsp;<span class="fw-semibold">20 November, 2025</span></span>
                            <span class="text-secondary">Expiration Date:&nbsp;<span class="fw-semibold">20 November, 2025</span></span>
                        </div>
                    </li>
                    <li class="border border-1 border-radius-25 d-flex flex-column px-3 py-4">
                        <span>#2</span>
                        <span><span class="text-secondary">Ref #:</span>&nbsp;<span>#123547QGV215484</span></span>
                        <span><span class="text-secondary">Product Code:</span>&nbsp;<span>#123547QGV215484</span></span>
                        <span class="fw-semibold fs-5">Griseofulvin</span>
                        <div class="d-flex flex-wrap column-gap-4">
                            <span class="text-secondary">Purchased:&nbsp;<span class="fw-semibold">20 November, 2025</span></span>
                            <span class="text-secondary">Manufacturer:&nbsp;<span class="fw-semibold">Pfizer</span></span>
                            <span class="text-secondary">Make Country:&nbsp;<span class="fw-semibold">China</span></span>
                            <span class="text-secondary">Manufacture Date:&nbsp;<span class="fw-semibold">20 November, 2025</span></span>
                            <span class="text-secondary">Expiration Date:&nbsp;<span class="fw-semibold">20 November, 2025</span></span>
                        </div>
                    </li>
                </ul>
            </section>

            <section class="pagination-links d-flex justify-content-end align-items-center gap-3 pt-4">
                <span class="btn btn-sm btn-outline-secondary border-radius-25">
                    1
                </span>
                <span class="btn btn-sm btn-outline-secondary border-radius-25">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left"
                        viewBox="0 0 16 16">
                        <path
                            d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753" />
                    </svg>
                </span>
                <span class="btn btn-sm btn-outline-secondary border-radius-25">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right"
                        viewBox="0 0 16 16">
                        <path
                            d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
                    </svg>
                </span>
                <span class="btn btn-sm btn-outline-secondary border-radius-25">
                    20
                </span>
            </section>
        </Layout>
    )
}
