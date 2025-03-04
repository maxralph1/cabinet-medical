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
import { useInventoryInvoices } from '@/hooks/inventory/useInventoryInvoices.jsx'; 
import { useInventoryInvoice } from '@/hooks/inventory/useInventoryInvoice.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [inventoryInvoiceQuery, setInventoryInvoiceQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 10, 
    }); 
    const { inventoryInvoices, getInventoryInvoices, setInventoryInvoices, loading } = useInventoryInvoices(inventoryInvoiceQuery); 
    const { deleteInventoryInvoice } = useInventoryInvoice();
    console.log(inventoryInvoices); 
    
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
                    <span>Invoices</span>
                </h2>
                <Link to={ route('home.inventory.invoices.create') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center py-0">
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
                    { (inventoryInvoices?.data?.length > 0) 
                        && <PaginationMeter 
                                current_page={ inventoryInvoices?.meta?.current_page } 
                                limit={ inventoryInvoices?.meta?.limit } 
                                total_pages={ inventoryInvoices?.meta?.total_pages } 
                                total_results={ inventoryInvoices?.meta?.total_results } /> } 
                </span> 
            </div>

            <div className="fs-6 d-flex align-items-center row-gap-1 column-gap-2 flex-wrap">
                <span 
                    type="button" 
                    onClick={ async () => {
                        await setInventoryInvoiceQuery(prevState => ({
                            ...prevState,
                            range: 'all', 
                            page: 1
                        })); 
                        await getInventoryInvoices(inventoryInvoiceQuery?.range); 
                    } }
                    className="d-flex flex-wrap column-gap-3 row-gap-2 pt-2 pb-3">
                    <span className={`btn btn-sm ${(inventoryInvoiceQuery?.range == 'all') ? 'btn-secondary' : 'btn-outline-secondary'} border-radius-35 py-0`}>
                        All
                    </span>
                </span>
                <span 
                    type="button" 
                    onClick={ async () => {
                        await setInventoryInvoiceQuery(prevState => ({
                            ...prevState,
                            range: 'paid', 
                            page: 1
                        })); 
                        await getInventoryInvoices(inventoryInvoiceQuery?.range); 
                    } }
                    className="d-flex flex-wrap column-gap-3 row-gap-2 pt-2 pb-3">
                    <span className={`btn btn-sm ${(inventoryInvoiceQuery?.range == 'paid') ? 'btn-secondary' : 'btn-outline-secondary'} border-radius-35 py-0`}>
                        Paid
                    </span>
                </span>
                <span 
                    type="button" 
                    onClick={ async () => {
                        await setInventoryInvoiceQuery(prevState => ({
                            ...prevState,
                            range: 'payment-in-progress', 
                            page: 1
                        })); 
                        await getInventoryInvoices(inventoryInvoiceQuery?.range); 
                    } }
                    className="d-flex flex-wrap column-gap-3 row-gap-2 pt-2 pb-3">
                    <span className={`btn btn-sm ${(inventoryInvoiceQuery?.range == 'payment-in-progress') ? 'btn-secondary' : 'btn-outline-secondary'} border-radius-35 py-0`}>
                        Payment in Progress
                    </span>
                </span>
                <span 
                    type="button" 
                    onClick={ async () => {
                        await setInventoryInvoiceQuery(prevState => ({
                            ...prevState,
                            range: 'unpaid', 
                            page: 1
                        })); 
                        await getInventoryInvoices(inventoryInvoiceQuery?.range); 
                    } }
                    className="d-flex flex-wrap column-gap-3 row-gap-2 pt-2 pb-3">
                    <span className={`btn btn-sm ${(inventoryInvoiceQuery?.range == 'unpaid') ? 'btn-secondary' : 'btn-outline-secondary'} border-radius-35 py-0`}>
                        Unpaid
                    </span>
                </span>
            </div>

            <section className="pt-3">
                { (loading == true) 
                    ?   <div className="py-4 d-flex justify-content-center align-items-center">
                            <div className="spinner-grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>  
                        </div>
                            : ((loading == false) && ((inventoryInvoices?.data?.length < 1) || inventoryInvoices?.length < 1)) 
                                ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                        <span>There are no inventory invoices yet.</span>
                                    </div> 
                                        : ((loading == false) && (inventoryInvoices?.data?.length > 0)) 
                                            ?   <ul className="inventory-invoices list-unstyled d-flex flex-column align-items-start gap-3">
                                                    { (inventoryInvoices?.data
                                                                    ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                                                    ?.map((inventoryInvoice, index) => {
                                                        return (
                                                            <li key={ inventoryInvoice?._id } className="inventory-invoice w-100 border border-1 border-radius-25 d-flex flex-column px-3 py-4">
                                                                <div className="d-flex justify-content-between">
                                                                    <section className="invoice d-flex justify-content-start gap-4 flex-wrap pt-3">
                                                                        <Link 
                                                                            to={ route('home.inventory.invoices.show', { id: inventoryInvoice?._id }) } 
                                                                            className="d-flex flex-column text-decoration-none">
                                                                            <span style={{ fontSize: 'x-small' }}>
                                                                                <span>Invoice #:</span>&nbsp;
                                                                                <span className="fw-semibold text-uppercase">{ inventoryInvoice?._id }</span>
                                                                            </span>
                                                                            <span>
                                                                                <span>Amount Payable:</span>&nbsp;
                                                                                <span className="fw-semibold">
                                                                                    {inventoryInvoice?.products?.reduce((total, product) => {
                                                                                        return total + Number(product?.inventory_product_unit?.amount_purchased || 0);
                                                                                    }, 0)} MUR
                                                                                </span>
                                                                            </span>
                                                                            <span className="d-flex align-items-start gap-2 pt-1">
                                                                                <span>Notes:</span>&nbsp;
                                                                                <span 
                                                                                    className="preview" 
                                                                                    dangerouslySetInnerHTML={{ __html: (inventoryInvoice?.notes?.slice(0, 25)) + (inventoryInvoice?.notes?.length > 24 ? '...' : '') }} 
                                                                                />
                                                                            </span>
                                                                        </Link>
                                                                    </section>
                                                                    <div className="d-flex gap-2">
                                                                        <span>
                                                                            <Link to={ route('home.inventory.invoices.show', { id: inventoryInvoice?._id }) }>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-view-list text-info" viewBox="0 0 16 16">
                                                                                    <path d="M3 4.5h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM1 2a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 2m0 12a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 14"/>
                                                                                </svg>
                                                                            </Link>
                                                                        </span>
                                                                        <span>
                                                                            <Link to={ route('home.inventory.invoices.edit', { id: inventoryInvoice?._id }) }>
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
                                                                                        deleteInventoryInvoice(inventoryInvoice?._id); 
                                                                                        // setInventoryInvoices([]);
                                                                                        getInventoryInvoices(inventoryInvoiceQuery); 
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
                                                                { (!inventoryInvoice?.paid_at) && (
                                                                    <div className="d-flex justify-content-end">
                                                                        <Link 
                                                                            to={ route('home.inventory.invoices.pay', { id: inventoryInvoice?._id }) } 
                                                                            className="btn btn-sm btn-outline-secondary border-radius-25 py-0">Pay Invoice</Link>
                                                                    </div>
                                                                ) }
                                                            </li> 
                                                        )
                                                    })) }
                                                </ul>
                                                : <></> }
            </section>

            { (inventoryInvoices?.data?.length > 0) 
                && <PaginationLinks 
                    items={ inventoryInvoices } 
                    get_items={ getInventoryInvoices } 
                    set_query={ setInventoryInvoiceQuery } /> }  
        </Layout>
    )
}
