import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
import PaginationMeter from '@/components/PaginationMeter.jsx';
import PaginationLinks from '@/components/PaginationLinks.jsx';
import { useInventoryProductUnits } from '@/hooks/inventory/useInventoryProductUnits.jsx'; 
import { useInventoryProductUnit } from '@/hooks/inventory/useInventoryProductUnit.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [inventoryProductUnitQuery, setInventoryProductUnitQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 10, 
    }); 
    const { inventoryProductUnits, getInventoryProductUnits, setInventoryProductUnits, loading } = useInventoryProductUnits(inventoryProductUnitQuery); 
    const { deleteInventoryProductUnit } = useInventoryProductUnit();
    console.log(inventoryProductUnits); 

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
                    <span>Stock</span>
                </h2>
                <Link to={ route('home.inventory.products.create') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center py-0">
                    <span className="mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                            className="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                        </svg>
                    </span>
                    <span>Add</span>
                </Link>
            </div>

            <div className="d-flex justify-content-end pt-3">
                <span>
                    { (inventoryProductUnits?.data?.length > 0) 
                        && <PaginationMeter 
                                current_page={ inventoryProductUnits?.meta?.current_page } 
                                limit={ inventoryProductUnits?.meta?.limit } 
                                total_pages={ inventoryProductUnits?.meta?.total_pages } 
                                total_results={ inventoryProductUnits?.meta?.total_results } /> } 
                </span> 
            </div>

            <section className="pt-3">
                { (loading == true) 
                    ?   <div className="py-4 d-flex justify-content-center align-items-center">
                            <div className="spinner-grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>  
                        </div>
                            : ((loading == false) && ((inventoryProductUnits?.data?.length < 1) || inventoryProductUnits?.length < 1)) 
                                ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                        <span>There are no inventory products yet.</span>
                                    </div> 
                                        : ((loading == false) && (inventoryProductUnits?.data?.length > 0)) 
                                            ?   <ul className="inventory-products list-unstyled d-flex flex-column align-items-start gap-3">
                                                    { (inventoryProductUnits?.data
                                                                    ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                                                    ?.map((inventoryProductUnit, index) => {
                                                        return (
                                                            <li key={ inventoryProductUnit?._id } className="inventory-product w-100 border border-1 border-radius-25 d-flex flex-column px-3 py-4">
                                                                <div className="d-flex justify-content-between">
                                                                    <section className="product d-flex justify-content-start gap-4 flex-wrap pt-3">
                                                                        <Link 
                                                                            to={ route('home.inventory.products.show', { id: inventoryProductUnit?._id }) } 
                                                                            className="d-flex flex-column text-decoration-none">
                                                                            <p className="fw-semibold">{ inventoryProductUnit?.inventory_product?.name }</p>
                                                                            <div 
                                                                                className="preview" 
                                                                                dangerouslySetInnerHTML={{ __html: (inventoryProductUnit?.inventory_product?.description?.slice(0, 25)) + (inventoryProductUnit?.inventory_product?.description?.length > 24 ? '...' : '') }} 
                                                                            />
                                                                            { inventoryProductUnit?.product_number && (
                                                                                <p className="my-0">Product Number:&nbsp;<span className="fw-semibold">{ inventoryProductUnit?.product_number }</span></p>
                                                                            )}
                                                                            { inventoryProductUnit?.amount_purchased && (
                                                                                <p className="my-0">Amount Purchased:&nbsp;<span className="fw-semibold">{ inventoryProductUnit?.amount_purchased?.toFixed(2) }</span></p>
                                                                            ) } 
                                                                            { inventoryProductUnit?.manufacture_date && (
                                                                                <p className="my-0">Manufacture Date:&nbsp;<span className="fw-semibold">{ dayjs(inventoryProductUnit?.manufacture_date).format('ddd, MMM D, YYYY h:mm A') }</span></p>
                                                                            ) }
                                                                            { inventoryProductUnit?.expiration_date && (
                                                                                <p className="my-0">Expiration Date:&nbsp;<span className="fw-semibold">{ dayjs.utc(inventoryProductUnit?.expiration_date).fromNow() }</span></p>
                                                                            ) }
                                                                        </Link>
                                                                    </section>
                                                                    <div className="d-flex gap-2">
                                                                        <span>
                                                                            <Link to={ route('home.inventory.products.show', { id: inventoryProductUnit?.inventory_product?._id }) }>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-view-list text-info" viewBox="0 0 16 16">
                                                                                    <path d="M3 4.5h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM1 2a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 2m0 12a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 14"/>
                                                                                </svg>
                                                                            </Link>
                                                                        </span>
                                                                        <span>
                                                                            <Link to={ route('home.inventory.products.edit', { id: inventoryProductUnit?.inventory_product?._id }) }>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill text-warning" viewBox="0 0 16 16">
                                                                                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                                                                </svg>
                                                                            </Link>
                                                                        </span>
                                                                        <span 
                                                                            onClick={ () => {
                                                                                swal.fire({
                                                                                    text: "Are you sure you want to delete this?", 
                                                                                    showCancelButton: true,
                                                                                    confirmButtonColor: "#FF0000",
                                                                                    cancelButtonColor: "#414741",
                                                                                    confirmButtonText: "Yes!", 
                                                                                    cancelButtonText: "No!", 
                                                                                    customClass: {
                                                                                        confirmButton: 'swal2-confirm-button', 
                                                                                        cancelButton: 'swal2-cancel-button'
                                                                                    }, 
                                                                                }).then((result) => {
                                                                                    if (result.isConfirmed) {
                                                                                        deleteInventoryProductUnit(inventoryProductUnit?._id); 
                                                                                        // setInventoryProducts([]);
                                                                                        getInventoryProductUnits(inventoryProductUnitQuery); 
                                                                                    }
                                                                                });
                                                                            }} 
                                                                            className="cursor-pointer">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                                                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                                </svg>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </li> 
                                                        )
                                                    })) }
                                                </ul>
                                                : <></> }
            </section>

            { (inventoryProductUnits?.data?.length > 0) 
                && <PaginationLinks 
                    items={ inventoryProductUnits } 
                    get_items={ getInventoryProductUnits } 
                    set_query={ setInventoryProductUnitQuery } /> }  
        </Layout>
    )
}
