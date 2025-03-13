import { useState } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import swal from 'sweetalert2'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import { useInventoryProduct } from '@/hooks/inventory/useInventoryProduct.jsx'; 
import { useInventoryProductUnit } from '@/hooks/inventory/useInventoryProductUnit.jsx'; 
import SelectedCategoryComponent from '@/components/protected/nested-components/SelectedCategoryComponent';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Edit() {
    const { id } = useParams(); 
    const { inventoryProduct, getInventoryProduct } = useInventoryProduct(id); 
    console.log(inventoryProduct); 

    /** Product Units */
    // const [productUnits, setProductUnits] = useState([]); 
    // console.log('product units:', productUnits); 

    const { inventoryProductUnit, deleteInventoryProductUnit } = useInventoryProductUnit(); 

    const [productUnitComponents, setProductUnitComponents] = useState({
        product_number: null, 
        amount_purchased: null, 
        manufacture_date: null,  
        expiration_date: null
    }); 
    console.log(productUnitComponents); 
    /** End of Product Units */

    // const { inventoryProduct, createInventoryProduct } = useInventoryProduct(); 

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

    /** Rich-text Editor */
    const [descriptionValue, setDescriptionValue] = useState('');
    const [notesValue, setNotesValue] = useState(''); 
    /** End of Rich-text Editor */

    const [selectedCategoryItems, setSelectedCategoryItems] = useState([]); 
    // console.log('selected:', selectedCategoryItems); 

    const handleSubmit = async e => {
        e.preventDefault(); 
        // console.log(descriptionValue); 
        console.log(selectedCategoryItems); 

        const selectedCategoryItemsString = selectedCategoryItems.map(item => item._id).join(',');
        console.log('id strings:', selectedCategoryItemsString);

        // if ((selectedCategoryItems) && (selectedDiagnosisTypes?.length>0)) {
        if ((selectedCategoryItems)?.length > 0) {
            const formData = new FormData(); 
            (selectedCategoryItems?.length>0) && formData.append('categories', selectedCategoryItemsString); 
            (image) && formData.append('image', inventoryProduct?.data?.image); 
            inventoryProduct?.data?.name && formData.append('name', inventoryProduct?.data?.name); 
            (descriptionValue) && formData.append('description', descriptionValue); 
            (notesValue) && formData.append('notes', notesValue); 
            inventoryProduct?.data?.amount_purchased && formData.append('amount_purchased', inventoryProduct?.data?.amount_purchased); 
            inventoryProduct?.data?.manufacturer && formData.append('manufacturer', inventoryProduct?.data?.manufacturer); 
            inventoryProduct?.data?.make_country && formData.append('make_country', inventoryProduct?.data?.make_country); 
            (productUnits) && formData.append('product_units', JSON.stringify(productUnits)); 

            await createInventoryProduct(formData); 
            await inventoryProduct?.setData({}); 
            await setSelectedCategoryItems([]); 
            await setDescriptionValue(''); 
            await setNotesValue(''); 
        } else {
            swal.fire({
                text: `Please select a category.`, 
                color: '#900000', 
                width: 325, 
                position: 'top', 
                showConfirmButton: false
            });
        }
    }; 
    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link to={ route('home.inventory.index') }>Inventory</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <Link 
                        to={ route('home.inventory.products.index') } className="">Products</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Edit Inventory Product</span>
                </h2>
            </div>

            <section className="pt-4">
                <form onSubmit={ handleSubmit } id="inventory-product-form" className="inventory-product-form">
                    <div className="row">
                        <SelectedCategoryComponent 
                            selectedCategoryItems={ selectedCategoryItems } 
                            setSelectedCategoryItems={ setSelectedCategoryItems } />
                    </div>
                    { (inventoryProduct?.data?.categories?.length > 0) && (
                        <section className="added-categories pb-3">
                            <h4 className="fs-6">Previous Categories:</h4>
                            <ul className="list-unstyled">
                                { inventoryProduct?.data?.categories?.reverse()?.map((category, index) => {
                                    return (
                                        <li key={index} className="d-flex align-items-center gap-3">
                                            <div className="category d-flex justify-content-start align-items-center gap-3 pt-2">
                                                <div className="d-flex flex-column">
                                                    <span className="fw-semibold badge rounded-pill text-bg-secondary">{ ((category?.inventory_category?.name)?.slice(0,1)?.toUpperCase() + (category?.inventory_category?.name)?.slice(1)) }
                                                    </span>
                                                </div>
                                            </div>
                                            <div 
                                                onClick={ async () => {
                                                    await deleteInventoryProductCategory(); 
                                                    await getInventoryProduct(id);
                                                } } 
                                                className="cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FF0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                </svg>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </section>
                    ) }
                    <div className="image row g-2 ">
                        <div className="mb-3 position-relative"> 
                            <input
                                type="file"
                                accept="image/*"
                                id="image-upload-input"
                                style={{ display: 'none' }} 
                                onChange={ (e) => { inventoryProduct.setData({
                                                        ...inventoryProduct?.data,
                                                        image: e.target.files[0], 
                                                    });
                                                    handleImageChange(e)} }
                            />

                            <div onClick={handleImageClick} className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '150px', height: '150px', backgroundColor: '#f0f0f0' }}>
                                { inventoryProduct?.data?.imange_path?.url ? (
                                    <img src={inventoryProduct?.data?.imange_path?.url} alt="Preview" className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                value={ inventoryProduct?.data?.name ?? '' }
                                id="name" 
                                className="form-control" 
                                onChange={ e => inventoryProduct.setData({
                                    ...inventoryProduct?.data,
                                    name: e.target.value,
                                }) } 
                                placeholder="WBC Count" 
                                required />
                            <label htmlFor="name">Name</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-12">
                            <FroalaEditor 
                                config={{
                                    placeholderText: "Description of Product",
                                }}
                                tag="textarea" 
                                model={inventoryProduct?.data?.description ?? descriptionValue} 
                                onModelChange={(content) => {
                                    setDescriptionValue(content)
                                }} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-12">
                            <FroalaEditor 
                                config={{
                                    placeholderText: "Notes on Product",
                                }}
                                tag="textarea" 
                                model={inventoryProduct?.data?.notes ?? notesValue} 
                                onModelChange={(content) => {
                                    setNotesValue(content)
                                }} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="text" 
                                id="amount_purchased" 
                                className="form-control" 
                                onChange={ e => inventoryProduct.setData({
                                    ...inventoryProduct?.data,
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
                                onChange={ e => inventoryProduct.setData({
                                    ...inventoryProduct?.data,
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
                                onChange={ e => inventoryProduct.setData({
                                    ...inventoryProduct?.data,
                                    make_country: e.target.value,
                                }) } 
                                placeholder="China" 
                                required />
                            <label htmlFor="make_country">Make Country</label>
                        </div>
                    </div>

                    <section className="product-units pt-4 px-3">
                        <h3 className="fs-5 fw-semibold border-bottom">Add Product Units:</h3>
                        <section className="product-unit-form">
                            <div className="row">
                                <div className="form-floating mb-3 col-sm-12 col-md-6">
                                    <input 
                                        type="text" 
                                        id="product_number" 
                                        className="form-control" 
                                        value={ productUnitComponents?.product_number ?? '' } 
                                        onChange={ e => setProductUnitComponents({
                                            ...productUnitComponents,
                                            product_number: e.target.value,
                                        }) } 
                                        placeholder="Pfizer" />
                                    <label htmlFor="product_number">Product Number</label>
                                </div>
                                <div className="form-floating mb-3 col-sm-12 col-md-6">
                                    <input 
                                        type="number" 
                                        id="amount_purchased" 
                                        className="form-control" 
                                        value={ productUnitComponents?.amount_purchased ?? '' } 
                                        onChange={ e => setProductUnitComponents({
                                            ...productUnitComponents,
                                            amount_purchased: e.target.value,
                                        }) } 
                                        placeholder="123.00" />
                                    <label htmlFor="amount_purchased">Amount Purchased (in MUR)</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-floating mb-3 col-sm-12 col-md-6">
                                    <input 
                                        type="date" 
                                        id="manufature_date" 
                                        className="form-control" 
                                        value={ productUnitComponents?.manufacture_date ?? '' } 
                                        onChange={ e => setProductUnitComponents({
                                            ...productUnitComponents,
                                            manufacture_date: e.target.value,
                                        }) } 
                                        placeholder="2025-01-01" />
                                    <label htmlFor="manufature_date">Manufacture Date</label>
                                </div>
                                <div className="form-floating mb-3 col-sm-12 col-md-6">
                                    <input 
                                        type="date" 
                                        id="expiration_date" 
                                        className="form-control" 
                                        value={ productUnitComponents?.expiration_date ?? '' } 
                                        onChange={ e => setProductUnitComponents({
                                            ...productUnitComponents,
                                            expiration_date: e.target.value,
                                        }) } 
                                        placeholder="2025-01-01" />
                                    <label htmlFor="expiration_date">Expiration Date</label>
                                </div>
                            </div>

                            <div className="row pb-4">
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <button 
                                        type="button" 
                                        onClick={ () => {
                                            setProductUnits(prevItems => [...prevItems, productUnitComponents]); 
                                            setProductUnitComponents({});
                                        }} 
                                        className="btn btn-outline-secondary border-radius-25">
                                            Add Product Unit to List
                                    </button>
                                </div>
                            </div>
                        </section>
                    </section>

                    { (inventoryProduct?.data?.product_units?.length > 0) && (
                        <section className="added-product-units">
                            <h4 className="fs-6">Added Product Units:</h4>
                            <ul className="list-unstyled">
                                { inventoryProduct?.data?.product_units?.reverse()?.map((unit, index) => {
                                    return (
                                        <li key={ index } className="d-flex gap-2 flex-wrap">
                                            <span>{ index+1 }.&nbsp;</span>

                                            <div>
                                                <p className="mb-0">Product Number:&nbsp;<span className="fw-semibold">{ unit?.product_number }</span></p>
                                                <p className="mb-0">Amount Purchased:&nbsp;<span className="fw-semibold">{ unit?.amount_purchased }</span></p>
                                                <p className="mb-0">Manufacture Date:&nbsp;<span className="fw-semibold">{ dayjs(unit?.manufacture_date).format('ddd, MMM D, YYYY h:mm A') }</span></p>
                                                <p className="mb-0">Manufacture Date:&nbsp;<span className="fw-semibold">{ dayjs(unit?.expiration_date).format('ddd, MMM D, YYYY h:mm A') }</span></p>
                                            </div>

                                            <span 
                                                onClick={ async () => {
                                                    await deleteInventoryProductUnit(unit?._id); 
                                                    await getInventoryProduct(id);
                                                } } 
                                                className="bg-transparent border-0"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                </svg>
                                            </span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </section>
                    ) }
                    
                    <div className="row border-top pt-4">
                        {/* <div className="col-sm-12 col-md-6 d-flex justify-content-end pt-3"> */}
                        <div className="col-12 d-flex justify-content-end pt-3">
                            <button type="submit" className="btn btn-outline-secondary border-radius-25">Save Product</button>
                        </div>
                    </div>
                </form>
            </section>
        </Layout>
    )
}
