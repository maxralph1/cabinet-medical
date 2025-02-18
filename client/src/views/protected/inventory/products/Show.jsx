import { useState } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import swal from 'sweetalert2'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useInventoryProduct } from '@/hooks/inventory/useInventoryProduct.jsx'; 
import { useInventoryProductUnit } from '@/hooks/inventory/useInventoryProductUnit.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Show() {
    const { id } = useParams(); 
    const { inventoryProductUnit, deleteInventoryProductUnit } = useInventoryProductUnit(); 
    const { inventoryProduct, getInventoryProduct } = useInventoryProduct(id); 
    console.log(inventoryProduct); 

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link 
                        to={ route('home.inventory.products.index') } className="">Inventory Products</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>{ (inventoryProduct?.data?.name)?.slice(0,25) }</span>
                </h2>
            </div>

            <section className="product pt-3">
                <h3><span className="fs-6 fw-light">Product Name:&nbsp;</span>{ inventoryProduct?.data?.name }</h3>

                <section className="categories pt-1 d-flex align-items-center">
                    <h4 className="fs-6 fw-light">Categories:&nbsp;&nbsp;</h4>
                    <ul className="list-unstyled d-flex justify-content-start align-items-center gap-3 pt-1">
                        {inventoryProduct?.data?.categories?.map((item, index) => (
                            <li key={index} className="category">
                                <div className="">
                                    <span className="fw-semibold badge rounded-pill text-bg-secondary">{ ((item?.inventory_category?.name)?.slice(0,1)?.toUpperCase() + item?.inventory_category?.name?.slice(1)) }
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <p className="pt-2">added by&nbsp;
                    <span>{ ((inventoryProduct?.data?.user?.first_name)?.slice(0,1)?.toUpperCase() + inventoryProduct?.data?.user?.first_name?.slice(1))
                            + ' ' 
                            + ((inventoryProduct?.data?.user?.last_name)?.slice(0,1)?.toUpperCase() + inventoryProduct?.data?.user?.last_name?.slice(1)) }</span>,&nbsp;
                    <span>{ dayjs.utc(inventoryProduct?.data?.user?.created_at).fromNow() }</span>
                </p>

                { (inventoryProduct?.data?.image_path?.url) && (
                    <section className="product-image pt-3">
                        <picture>
                            <source srcSet={ inventoryProduct?.data?.image_path?.url }
                                media="(orientation: portrait)" />
                            <img src={ inventoryProduct?.data?.image_path?.url }
                                className="object-fit-cover border border-1 border-secondary border-radius-25" style={{ width: '100%', height: '50vh' }} alt="" />
                        </picture>
                    </section>
                )}

                <section className={ (inventoryProduct?.data?.image_path?.url) ? 'description pt-5' : 'description pt-1' }>
                    <div 
                        className="preview fs-5" 
                        dangerouslySetInnerHTML={{ __html: (inventoryProduct?.data?.description) }} />
                </section>

                { (inventoryProduct?.data?.product_units?.length>0) && (
                    <section className="product-units pt-4">
                        <h4 className="fs-5">Product Units:&nbsp;&nbsp;</h4>
                        <ul className="list-unstyled pt-1">
                            { inventoryProduct?.data?.product_units?.map((item, index) => (
                                <li key={index} className="product-unit pb-2 d-flex">
                                    <span>{ index+1 }.&nbsp;</span>

                                    <div className="d-flex flex-column">
                                        <span>Product Number:&nbsp;<span className="fw-semibold">{ item?.product_number }</span></span>
                                        <span>Amount Purchased:&nbsp;<span className="fw-semibold">{ item?.amount_purchased }</span></span>
                                        <span>Manufacture Date:&nbsp;<span className="fw-semibold">{ item?.manufacture_date }</span></span>
                                        <span>Expiration Date:&nbsp;<span className="fw-semibold">{ item?.expiration_date }</span></span>
                                    </div>

                                    <div>
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
                                                        deleteInventoryProductUnit(item?._id); 
                                                        // setInventoryProducts([]);
                                                        getInventoryProduct(id); 
                                                    }
                                                });
                                            }} 
                                            className="cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                </svg>
                                        </span>
                                    </div>
                                </li>
                            )) }
                        </ul>
                    </section>
                )}
            </section>
        </Layout>
    )
}
