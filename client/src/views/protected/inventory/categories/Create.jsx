import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useInventoryCategory } from '@/hooks/inventory/useInventoryCategory.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Create() {
    const { inventoryCategory, createInventoryCategory } = useInventoryCategory(); 

    const handleSubmit = async e => {
        e.preventDefault(); 

        const formData = new FormData(); 
        inventoryCategory?.data?.name && formData.append('name', inventoryCategory?.data?.name); 
        inventoryCategory?.data?.description && formData.append('description', inventoryCategory?.data?.description); 

        await createInventoryCategory(formData); 
        await inventoryCategory?.setData({}); 
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
                        to={ route('home.inventory.categories.index') } className="">Categories</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Add Inventory Category</span>
                </h2>
            </div>

            <section className="pt-4">
                <form onSubmit={ handleSubmit } id="inventory-category-form" className="inventory-category-form">
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="text" 
                                value={ inventoryCategory?.data?.name ?? '' }
                                id="name" 
                                className="form-control" 
                                onChange={ e => inventoryCategory.setData({
                                    ...inventoryCategory?.data,
                                    name: e.target.value,
                                }) } 
                                placeholder="WBC Count" 
                                required />
                            <label htmlFor="name">Name</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <textarea 
                                value={ inventoryCategory?.data?.description ?? '' }
                                id="description"
                                className="form-control" 
                                style={{ height: '100px' }}  
                                onChange={ e => inventoryCategory.setData({
                                    ...inventoryCategory?.data,
                                    description: e.target.value,
                                }) } 
                                placeholder="This is the count of the White Blood Cells." 
                                required></textarea>
                            <label htmlFor="description">Description</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-md-6 d-flex justify-content-end pt-3">
                            <button type="submit" className="btn btn-outline-secondary border-radius-25">Save</button>
                        </div>
                    </div>
                </form>
            </section>
        </Layout>
    )
}
