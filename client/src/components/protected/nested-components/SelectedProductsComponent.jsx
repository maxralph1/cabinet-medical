import { useEffect, useState } from 'react'; 
import { useLocation } from 'react-router-dom'; 
import swal from 'sweetalert2'; 
import useAxios from '@/utils/useAxios.jsx'; 
import Constants from '@/utils/Constants.jsx'; 


export default function SelectedProductComponent({ selectedProductItems, setSelectedProductItems }) {
    const location = useLocation(); 

    const axiosInstance = useAxios(); 
    const [productSearchQuery, setProductSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [productSearchLoading, setProductSearchLoading] = useState(false); 

    useEffect(() => {
        if (productSearchQuery?.length === 0) {
            setResults([]); // Clear results if the query is empty
            return;
        }

        const fetchResults = async () => {
        setProductSearchLoading(true);
        try {
            const response = await axiosInstance.get(`${ Constants?.serverURL }/api/v1/inventory/products?search=${productSearchQuery}`); 
            // console.log('response:', response?.data?.data); 
            // setSelectedProductItems(response?.data?.data); 
            setResults(response?.data?.data); 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setProductSearchLoading(false);
        };

        const timeoutId = setTimeout(fetchResults, 500); // Debounce search to avoid too many requests

        return () => clearTimeout(timeoutId); // Clean up on component unmount or query change
    }, [productSearchQuery]); 

    const handleSelect = (item) => {
        if (selectedProductItems?.find((soughtItem) => soughtItem?._id === item?._id)) {
            // console.log(`${item} is already in the list!`); 
            swal.fire({
                text: `${item} is already in the list!`, 
                color: '#900000', 
                width: 325, 
                position: 'top', 
                showConfirmButton: false
            });
        } else if (!(selectedProductItems?.find((soughtItem) => soughtItem?._id === item?._id))) {
            if (item?.product_units?.length<1) {
                // console.log(`Item is not in stock!`); 
                swal.fire({
                    text: `Item ${item?.name} is not in stock!`, 
                    color: '#900000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
            });
            } else {
                setSelectedProductItems((prevItems) => [...prevItems, item]);
            }
        }

        setResults([]); 
    }; 

    const handleRemoveItem = (itemToRemove) => {
        setSelectedProductItems((prevItems) => prevItems.filter(item => item !== itemToRemove));
    };

    return (
        <section className="products pb-4">
            <section className="products-search">
                <div style={{ position: 'relative' }}>
                    <div className="">
                        <div className="form-floating" style={{ minWidth: '250px', maxWidth: '300px' }}>
                            <input
                                type="text"
                                value={ productSearchQuery }
                                onChange={ (e) => setProductSearchQuery(e.target.value) } 
                                id="product-search" 
                                className="form-control" 
                                placeholder="Search product..." 
                            />
                            <label htmlFor="product-search" style={{ marginLeft: 0 }}>Search product ...</label>
                            <span className="text-secondary ps-2"><small>Start typing to search products.</small></span>
                        </div>
                    </div> 
                    
                    {productSearchLoading && 
                        <p className="px-3 d-flex align-items-center gap-2">
                            <span className="spinner-grow" role="status">
                            </span>
                            <span className="text-secondary"><small>Retrieving products...</small></span>
                        </p>}
                    {results.length > 0 && (
                        <ul
                            style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            // width: '100%',
                            // maxWidth: '400px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            margin: 0,
                            padding: 0,
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '25px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                            zIndex: 1000,
                            }}
                        >
                            {results.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={ () => handleSelect(item) } 
                                    style={{
                                        padding: '10px',
                                        cursor: 'pointer',
                                        backgroundColor: '#fff',
                                        borderBottom: '1px solid #ddd',
                                    }}
                                >
                                    <div className="product d-flex justify-content-start align-items-center gap-3 pt-2">
                                        <div className="d-flex flex-column">
                                            <span className="fw-semibold">
                                                { ((item?.name)?.slice(0,1)?.toUpperCase() + item?.name?.slice(1)) + ' (' + (item?.product_units?.length) + ' in stock)' }
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            <section className={` selected-product px-3 ${(selectedProductItems?.length>0) ? 'pt-4' : 'pt-1'} `}>
                { (selectedProductItems?.length>0) && (
                    <h3 className="fs-6 fw-bold">Selected Products:</h3>
                ) }
                {selectedProductItems?.map((item, index) => (
                    <li key={index} className="product d-flex justify-content-start pt-3 border-top border-bottom">
                        <span>{ index+1 }.&nbsp;</span>
                        <div className="d-flex flex-column">
                            <h4 className="fs-6 pb-2"><span className="fw-light">Product Name:</span>&nbsp;<span className="fw-semibold">{ item?.name }</span></h4>
                            <p>Product Description:&nbsp;
                                <span 
                                    className="fw-semibold preview" 
                                    dangerouslySetInnerHTML={{ __html: (item?.description?.slice(0, 25)) + (item?.description?.length > 24 ? '...' : '') }} 
                                />
                            </p>
                            <p>Product Notes:&nbsp;
                                <span 
                                    className="fw-semibold preview" 
                                    dangerouslySetInnerHTML={{ __html: (item?.notes?.slice(0, 25)) + (item?.notes?.length > 24 ? '...' : '') }} 
                                />
                            </p>
                            {/* <span>Product Notes:&nbsp;<span className="fw-semibold">{ item?.notes }</span></span> */}
                            <p>Regular Worth:&nbsp;<span className="fw-semibold">{ item?.amount_purchased }MUR</span></p>
                            <p>Stock Count: { item?.product_units?.length }</p>
                        </div>
                        <div 
                            onClick={ () => handleRemoveItem(item) } 
                            className="cursor-pointer ms-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FF0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                            </svg>
                        </div>
                    </li>
                ))}
            </section>
        </section>
    )
}
