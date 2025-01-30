import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useInventoryList } from '@/hooks/useInventoryList.jsx'; 
import PaginationMeter from '@/components/PaginationMeter.jsx';
import PaginationLinks from '@/components/PaginationLinks.jsx';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [inventoryQuery, setInventoryQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 10, 
    }); 
    const { inventoryList, getInventoryList, loading } = useInventoryList(inventoryQuery); 
    console.log(inventoryList); 

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">Inventory</h2>
                <Link to={ route('home.inventory.create') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center py-0">
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
                    { (inventoryList?.data?.length > 0) 
                        && <PaginationMeter 
                                current_page={ inventoryList?.meta?.current_page } 
                                limit={ inventoryList?.meta?.limit } 
                                total_pages={ inventoryList?.meta?.total_pages } 
                                total_results={ inventoryList?.meta?.total_results } /> } 
                </span> 
            </div> 

            <section className="pt-3">
                { (loading == true) 
                    ?   <div className="py-4 d-flex justify-content-center align-items-center">
                            <div className="spinner-grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>  
                        </div> 
                            : ((loading == false) && ((inventoryList?.data?.length < 1) || inventoryList?.length < 1)) 
                                ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                        <span>There are no inventory item yet.</span>
                                    </div> 
                                        : ((loading == false) && (inventoryList?.data?.length > 0)) 
                                            &&  <ul className="list-unstyled d-flex flex-column align-items-start gap-3">
                                                    { (inventoryList?.data
                                                                    ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                                                    ?.map((inventoryItem, index) => {
                                                        return (
                                                            <li key={index} className="border border-1 border-radius-25 px-3 py-4">
                                                                <div className="d-flex justify-content-between align-items-start">
                                                                    <div>
                                                                        { (inventoryItem?.image_path?.url?.length > 0) 
                                                                            ?   <picture>
                                                                                    <source srcSet={ inventoryItem?.image_path?.url } />
                                                                                    <img src={ inventoryItem?.image_path?.url }
                                                                                        className="object-fit-cover border border-1 border-secondary border-radius-15" style={{ width: '50px', height: '50px' }} alt="" />
                                                                                </picture>
                                                                            :   <span>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#414141" className="bi bi-image" viewBox="0 0 16 16">
                                                                                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                                                                        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                                                                    </svg>
                                                                                </span> }
                                                                    </div>
                                                                    <div>
                                                                        <span>
                                                                            <Link to={ route('home.inventory.edit', { id: inventoryItem?._id }) } className="btn btn-sm btn-outline-secondary border-radius-25 fw-semibold">Edit</Link>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="d-flex flex-column">
                                                                    <span><span className="text-secondary">Ref #:</span>&nbsp;<span>{ (inventoryItem?._id)?.toUpperCase() }</span></span>
                                                                    <span><span className="text-secondary">Product Code:</span>&nbsp;<span>{ inventoryItem?.product_code ? inventoryItem?.product_code : 'N/A' }</span></span>
                                                                    <span className="fw-semibold fs-5">{ inventoryItem?.product_name }</span>
                                                                    <div className="d-flex flex-wrap column-gap-4">
                                                                        <span className="text-secondary">Purchased:&nbsp;<span className="fw-semibold">{ inventoryItem?.purchase_date ? dayjs(inventoryItem?.purchase_date).format('DD MMMM, YYYY') : 'N/A' }</span></span>
                                                                        <span className="text-secondary">Amount Purchased:&nbsp;<span className="fw-semibold">{ inventoryItem?.amount_purchased ? inventoryItem?.amount_purchased : '0' }MUR</span></span>
                                                                        <span className="text-secondary">Manufacturer:&nbsp;<span className="fw-semibold">{ inventoryItem?.manufacturer ? inventoryItem?.manufacturer : 'N/A' }</span></span>
                                                                        <span className="text-secondary">Make Country:&nbsp;<span className="fw-semibold">{ inventoryItem?.make_country ? inventoryItem?.make_country : 'N/A' }</span></span>
                                                                        <span className="text-secondary">Manufacture Date:&nbsp;<span className="fw-semibold">{ inventoryItem?.manufacture_date ? dayjs(inventoryItem?.manufacture_date).format('DD MMMM, YYYY') : 'N/A' }</span></span>
                                                                        <span className="text-secondary">Expiration Date:&nbsp;<span className="fw-semibold">{ inventoryItem?.expiration_date ? dayjs(inventoryItem?.expiration_date).format('DD MMMM, YYYY') : 'N/A' }</span></span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )
                                                    }))}
                                                </ul> }                
            </section>

            { (inventoryList?.data?.length > 0) 
                && <PaginationLinks 
                    items={ inventoryList } 
                    get_items={ getInventoryList } 
                    query={ inventoryQuery } 
                    set_query={ setInventoryQuery } /> } 
        </Layout>
    )
}
