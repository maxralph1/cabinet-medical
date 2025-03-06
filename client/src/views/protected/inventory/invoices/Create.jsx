import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import swal from 'sweetalert2'; 
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css'; 
import { useInventoryInvoice } from '@/hooks/inventory/useInventoryInvoice.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 
import SelectedProductsComponent from '@/components/protected/nested-components/SelectedProductsComponent';


export default function Create() {
    /** Rich-text Editor */
    const [notesValue, setNotesValue] = useState(''); 
    /** End of Rich-text Editor */

    const [selectedProductItems, setSelectedProductItems] = useState([]); 
    console.log('selected:', selectedProductItems); 

    const { inventoryInvoice, createInventoryInvoice } = useInventoryInvoice(); 

    const handleSubmit = async e => {
        e.preventDefault(); 
        // console.log(descriptionValue); 
        console.log(selectedProductItems); 

        const selectedProductItemsString = selectedProductItems.map(item => item._id).join(',');
        console.log('id strings:', selectedProductItemsString);

        // if ((selectedProductItems) && (selectedDiagnosisTypes?.length>0)) {
        if ((selectedProductItems)?.length > 0) {
            const formData = new FormData(); 
            (selectedProductItems?.length>0) && formData.append('products', selectedProductItemsString); 
            (notesValue) && formData.append('notes', notesValue); 

            await createInventoryInvoice(formData); 
            await inventoryInvoice?.setData({}); 
            await setSelectedProductItems([]); 
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
                    <Link 
                        to={ route('home.inventory.index') } className="">Inventory</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <Link 
                        to={ route('home.inventory.invoices.index') } className="">Invoices</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Create Invoice</span>
                </h2>
            </div>

            <section className="pt-4">
                <form onSubmit={ handleSubmit } id="inventory-product-form" className="inventory-product-form">
                    <div className="row">
                        <SelectedProductsComponent 
                            selectedProductItems={ selectedProductItems } 
                            setSelectedProductItems={ setSelectedProductItems } />
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-12">
                            <FroalaEditor 
                                config={{
                                    placeholderText: "Notes on Invoice",
                                }}
                                tag="textarea" 
                                model={notesValue} 
                                onModelChange={(content) => {
                                    setNotesValue(content)
                                }} />
                        </div>
                    </div>
                    
                    <div className="row border-top pt-4">
                        {/* <div className="col-sm-12 col-md-6 d-flex justify-content-end pt-3"> */}
                        <div className="col-12 d-flex justify-content-end pt-3">
                            <button type="submit" className="btn btn-outline-secondary border-radius-25">Save Invoice</button>
                        </div>
                    </div>
                </form>
            </section>
        </Layout>
    )
}
