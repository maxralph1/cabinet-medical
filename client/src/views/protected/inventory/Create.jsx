import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Create() {
    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3"><a href="#" className="">Inventory</a>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill"
                        viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Add Inventory</span>
                </h2>
            </div>

            <section className="pt-3">
                <form action="#">
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" fill="#414141" className="bi bi-image"
                                viewBox="0 0 16 16">
                                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                                <path
                                    d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z" />
                            </svg>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input type="text" className="form-control" id="product_name" placeholder="Griseofulvin (500mg)" />
                            <label htmlFor="product_name">Product Name</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input type="text" className="form-control" id="product_code" placeholder="2548547054895958" />
                            <label htmlFor="product_code">Product Code</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input type="text" className="form-control" id="manufacturer" placeholder="Pfizer" />
                            <label htmlFor="manufacturer">Manufacturer</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input type="text" className="form-control" id="make_country" placeholder="China" />
                            <label htmlFor="make_country">Make Country</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <select className="form-select" id="product_type" aria-label="Product type">
                                <option>Select ...</option>
                                <option value="medication">Medication</option>
                                <option value="surgical_equipment">Surgical Equipment</option>
                            </select>
                            <label htmlFor="product_type">Product Type</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input type="text" className="form-control" id="amount_purchased" placeholder="123MUR" />
                            <label htmlFor="amount_purchased">Amount Purchased</label>
                        </div>
                    </div> 
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input type="date" className="form-control" id="manufacture_date" placeholder="Pfizer" />
                            <label htmlFor="manufacture_date">Manufacture Date</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input type="date" className="form-control" id="expiration_date" placeholder="China" />
                            <label htmlFor="expiration_date">Expiration Date</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input type="date" className="form-control" id="purchase_date" placeholder="Pfizer" />
                            <label htmlFor="purchase_date">Purchase Date</label>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pt-3">
                        <button type="submit" className="btn btn-outline-secondary border-radius-25">Save</button>
                    </div>
                </form>
            </section>
        </Layout>
    )
}
