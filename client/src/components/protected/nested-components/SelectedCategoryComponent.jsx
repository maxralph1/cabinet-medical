import { useEffect, useState } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 
import Constants from '@/utils/Constants.jsx'; 


export default function SelectedCategoryComponent({ selectedCategoryItems, setSelectedCategoryItems }) {
    const axiosInstance = useAxios(); 
    const [categorySearchQuery, setCategorySearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [categorySearchLoading, setCategorySearchLoading] = useState(false); 

    useEffect(() => {
        if (categorySearchQuery?.length === 0) {
            setResults([]); // Clear results if the query is empty
            return;
        }

        const fetchResults = async () => {
        setCategorySearchLoading(true);
        try {
            const response = await axiosInstance.get(`${ Constants?.serverURL }/api/v1/blog/categories?search=${categorySearchQuery}`); 
            // console.log('response:', response?.data?.data); 
            // setSelectedCategoryItems(response?.data?.data); 
            setResults(response?.data?.data); 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setCategorySearchLoading(false);
        };

        const timeoutId = setTimeout(fetchResults, 500); // Debounce search to avoid too many requests

        return () => clearTimeout(timeoutId); // Clean up on component unmount or query change
    }, [categorySearchQuery]); 

    const handleSelect = (item) => {
        if (selectedCategoryItems?.find((soughtItem) => soughtItem?._id === item?._id)) {
            console.log(`${item} is already in the list!`);
        } else if (!(selectedCategoryItems?.find((soughtItem) => soughtItem?._id === item?._id))) {
            setSelectedCategoryItems((prevItems) => [...prevItems, item]);
        }

        setResults([]); 
    }; 

    const handleRemoveItem = (itemToRemove) => {
        setSelectedCategoryItems((prevItems) => prevItems.filter(item => item !== itemToRemove));
    };

    return (
        <section className="categories pb-4">
            <section className="categories-search">
                <div style={{ position: 'relative' }}>
                    <div className="">
                        <div className="form-floating" style={{ minWidth: '250px', maxWidth: '300px' }}>
                            <input
                                type="text"
                                value={ categorySearchQuery }
                                onChange={ (e) => setCategorySearchQuery(e.target.value) } 
                                id="category-search" 
                                className="form-control" 
                                placeholder="Search category..." 
                            />
                            <label htmlFor="category-search" style={{ marginLeft: 0 }}>Search category ...</label>
                            <span className="text-secondary ps-2"><small>Start typing to search categories.</small></span>
                        </div>
                    </div> 
                    
                    {categorySearchLoading && 
                        <p className="px-3 d-flex align-items-center gap-2">
                            <span className="spinner-grow" role="status">
                            </span>
                            <span className="text-secondary"><small>Retrieving categories...</small></span>
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
                                    <div className="category d-flex justify-content-start align-items-center gap-3 pt-2">
                                        <div className="d-flex flex-column">
                                            <span className="fw-semibold">
                                                { ((item?.name)?.slice(0,1)?.toUpperCase() + item?.name?.slice(1)) }
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            <section className="selected-category pt-1 px-3">
                {selectedCategoryItems?.map((item, index) => (
                    <li key={index} className="d-flex align-items-center gap-3">
                        <div className="category d-flex justify-content-start align-items-center gap-3 pt-2">
                            <div className="d-flex flex-column">
                                <span className="fw-semibold badge rounded-pill text-bg-secondary">{ ((item?.name)?.slice(0,1)?.toUpperCase() + item?.name?.slice(1)) }
                                </span>
                            </div>
                        </div>
                        <div 
                            onClick={ () => handleRemoveItem(item) } 
                            className="cursor-pointer">
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
