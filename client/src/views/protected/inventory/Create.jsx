import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useInventory } from '@/hooks/useInventory.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Create() {
    /** Image Processing */
    const [image, setImage] = useState(null); 

    const handleImageClick = () => {
        document.getElementById('image-upload-input').click();
    }; 

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImage(reader.result); 
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    }; 

    const handleRemoveImage = () => {
        setImage(null);
    }; 
    /** End of Image Processing */

    const { inventory, createInventory } = useInventory(); 

    const handleSubmit = async e => {
        e.preventDefault(); 

        const formData = new FormData(); 
        (image) && formData.append('image_path', inventory?.data?.image); 
        inventory?.data?.product_name && formData.append('product_name', inventory?.data?.product_name); 
        inventory?.data?.product_code && formData.append('product_code', inventory?.data?.product_code); 
        inventory?.data?.product_type && formData.append('product_type', inventory?.data?.product_type); 
        inventory?.data?.product_description && formData.append('product_description', inventory?.data?.product_description); 
        inventory?.data?.amount_purchased && formData.append('amount_purchased', inventory?.data?.amount_purchased); 
        inventory?.data?.manufacturer && formData.append('manufacturer', inventory?.data?.manufacturer); 
        inventory?.data?.make_country && formData.append('make_country', inventory?.data?.make_country); 
        inventory?.data?.manufacture_date && formData.append('manufacture_date', inventory?.data?.manufacture_date); 
        inventory?.data?.expiration_date && formData.append('expiration_date', inventory?.data?.expiration_date); 
        inventory?.data?.purchase_date && formData.append('purchase_date', inventory?.data?.purchase_date); 

        await createInventory(formData); 
        await inventory?.setData({}); 
        setImage(null); 

    }

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link 
                        to={ route('home.inventory.index') } className="">Inventory</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Add Inventory</span>
                </h2>
            </div>

            <section className="pt-3">
                <form onSubmit={ handleSubmit } encType="multipart/form-data">
                    <div className="logo row g-2 ">
                        <div className="mb-3 position-relative"> 
                            <input
                                type="file"
                                accept="image/*"
                                id="image-upload-input"
                                style={{ display: 'none' }} 
                                onChange={ (e) => { inventory.setData({
                                                        ...inventory?.data,
                                                        image: e.target.files[0], 
                                                    });
                                                    handleImageChange(e)} }
                            />

                            <div onClick={handleImageClick} className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '150px', height: '150px', backgroundColor: '#f0f0f0' }}>
                                { image ? (
                                    <img src={image} alt="Preview" className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" fill="#414141" className="bi bi-image" viewBox="0 0 16 16">
                                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                        </svg>
                                    </span>
                                )}
                            </div> 

                            {/* Remove button */}
                            {image && (
                                <span 
                                    onClick={handleRemoveImage} 
                                    className="bg-transparent border-0"
                                    style={{
                                        position: 'absolute', 
                                        top: '0', 
                                        left: '155px', 
                                        cursor: 'pointer',
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                    </svg>
                                </span>
                            )}
                        </div> 
                    </div> 
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="text" 
                                id="product_name" 
                                className="form-control" 
                                onChange={ e => inventory.setData({
                                    ...inventory?.data,
                                    product_name: e.target.value,
                                }) } 
                                placeholder="Griseofulvin (500mg)" 
                                required />
                            <label htmlFor="product_name">Product Name</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="text" 
                                id="product_code" 
                                className="form-control" 
                                onChange={ e => inventory.setData({
                                    ...inventory?.data,
                                    product_code: e.target.value,
                                }) } 
                                placeholder="2548547054895958" 
                                required />
                            <label htmlFor="product_code">Product Code</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-12">
                            <textarea 
                                id="product_description"
                                className="form-control" 
                                style={{ height: '100px' }}  
                                onChange={ e => inventory.setData({
                                    ...inventory?.data,
                                    product_description: e.target.value,
                                }) } 
                                placeholder="This is the best medication."></textarea>
                            <label htmlFor="product_description">Product Description</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <select 
                                id="product_type" 
                                className="form-select" 
                                onChange={ e => inventory.setData({
                                    ...inventory?.data,
                                    product_type: e.target.value,
                                }) } 
                                aria-label="Product type" 
                                required>
                                    <option>Select ...</option>
                                    <option value="medication">Medication</option>
                                    <option value="surgical_equipment">Surgical Equipment</option>
                                    <option value="others">Others</option>
                            </select>
                            <label htmlFor="product_type">Product Type</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="text" 
                                id="amount_purchased" 
                                className="form-control" 
                                onChange={ e => inventory.setData({
                                    ...inventory?.data,
                                    amount_purchased: e.target.value,
                                }) } 
                                placeholder="123.00" 
                                required />
                            <label htmlFor="amount_purchased">Amount Purchased (in MUR)</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="text" 
                                id="manufacturer" 
                                className="form-control" 
                                onChange={ e => inventory.setData({
                                    ...inventory?.data,
                                    manufacturer: e.target.value,
                                }) } 
                                placeholder="Pfizer" 
                                required />
                            <label htmlFor="manufacturer">Manufacturer</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="text" 
                                id="make_country" 
                                className="form-control" 
                                onChange={ e => inventory.setData({
                                    ...inventory?.data,
                                    make_country: e.target.value,
                                }) } 
                                placeholder="China" 
                                required />
                            <label htmlFor="make_country">Make Country</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="date" 
                                className="form-control" 
                                id="manufacture_date" 
                                onChange={ e => inventory.setData({
                                    ...inventory?.data,
                                    manufacture_date: e.target.value,
                                }) } 
                                placeholder="2025-01-23" 
                                required />
                            <label htmlFor="manufacture_date">Manufacture Date</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="date" 
                                id="expiration_date" 
                                className="form-control" 
                                onChange={ e => inventory.setData({
                                    ...inventory?.data,
                                    expiration_date: e.target.value,
                                }) } 
                                placeholder="2025-01-23" 
                                required />
                            <label htmlFor="expiration_date">Expiration Date</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="date" 
                                id="purchase_date" 
                                className="form-control" 
                                onChange={ e => inventory.setData({
                                    ...inventory?.data,
                                    purchase_date: e.target.value,
                                }) } 
                                placeholder="2025-01-23" />
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
