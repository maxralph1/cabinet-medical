import { useEffect, useState } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 
import Constants from '@/utils/Constants.jsx'; 


export default function SelectedUserComponent({ selectedUserItem, setSelectedUserItem }) {
    const axiosInstance = useAxios(); 
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [userSearchLoading, setUserSearchLoading] = useState(false); 

    useEffect(() => {
        if (userSearchQuery?.length === 0) {
            setResults([]); // Clear results if the query is empty
            return;
        }

        const fetchResults = async () => {
        setUserSearchLoading(true);
        try {
            const response = await axiosInstance.get(`${ Constants?.serverURL }/api/v1/users?search=${userSearchQuery}`); 
            // console.log('response:', response?.data?.data); 
            setSelectedUserItem(response?.data?.data); 
            setResults(response?.data?.data); 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setUserSearchLoading(false);
        };

        const timeoutId = setTimeout(fetchResults, 500); // Debounce search to avoid too many requests

        return () => clearTimeout(timeoutId); // Clean up on component unmount or query change
    }, [userSearchQuery]); 

    const handleSelect = (item) => {
        setSelectedUserItem(item); 
        setSelectedPatient(item); 

        setResults([]); 
    };

    const [selectedPatient, setSelectedPatient] = useState(null); 
    console.log(selectedPatient); 

    return (
        <section className="users pb-4">
            <section className="users-search">
                <div style={{ position: 'relative' }}>
                    <div className="">
                        <div className="form-floating" style={{ minWidth: '250px', maxWidth: '300px' }}>
                            <input
                                type="text"
                                value={ userSearchQuery }
                                onChange={ (e) => setUserSearchQuery(e.target.value) } 
                                id="user-search" 
                                className="form-control" 
                                placeholder="Search patient..." 
                            />
                            <label htmlFor="user-search" style={{ marginLeft: 0 }}>Search patient ...</label>
                            <span className="text-secondary ps-2"><small>Start typing to search patients.</small></span>
                        </div>
                    </div> 
                    
                    {userSearchLoading && 
                        <p className="px-3 d-flex align-items-center gap-2">
                            <span className="spinner-grow" role="status">
                            </span>
                            <span className="text-secondary"><small>Retrieving patients...</small></span>
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
                            onClick={() => handleSelect(item)}
                            style={{
                            padding: '10px',
                            cursor: 'pointer',
                            backgroundColor: '#fff',
                            borderBottom: '1px solid #ddd',
                            }}
                        >
                            <div className="patient-doctor d-flex justify-content-start align-items-center gap-3 pt-2">
                                <picture>
                                    <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                        media="(orientation: portrait)" />
                                    <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                        className="object-fit-cover border border-1 border-secondary border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                                </picture>
                                <div className="d-flex flex-column">
                                    <span className="fw-semibold">
                                        { ((item?.first_name)?.slice(0,1)?.toUpperCase() + item?.first_name?.slice(1))
                                            + ' ' 
                                            + ((item?.last_name)?.slice(0,1)?.toUpperCase() + item?.last_name?.slice(1)) }
                                    </span>
                                </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                    )}
                </div>
            </section>

            { (selectedPatient) && (
                <section className="selected-user pt-1 px-3">
                    <article className="d-flex align-items-center gap-3">
                        <div className="patient-doctor d-flex justify-content-start align-items-center gap-3 pt-2">
                            <picture>
                                <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                    media="(orientation: portrait)" />
                                <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                    className="object-fit-cover border border-1 border-secondary border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                            </picture>
                            <div className="d-flex flex-column">
                                <span className="fw-semibold">{ ((selectedPatient?.first_name)?.slice(0,1)?.toUpperCase() + selectedPatient?.first_name?.slice(1))
                                                                + ' ' 
                                                                + ((selectedPatient?.last_name)?.slice(0,1)?.toUpperCase() + selectedPatient?.last_name?.slice(1)) }
                                </span>
                                <span>Patient has a history of diabetes in lineage.</span>
                            </div>
                        </div>
                        <div 
                            onClick={ () => setSelectedPatient(null) } 
                            className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FF0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                            </svg>
                        </div>
                    </article>
                </section>
            ) }
        </section>
    )
}
