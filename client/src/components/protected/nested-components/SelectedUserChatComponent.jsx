import { useEffect, useState } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 
import Constants from '@/utils/Constants.jsx'; 
import { useChats } from '@/hooks/useChats.jsx';
import { useChat } from '@/hooks/useChat.jsx'; 


export default function SelectedUserChatComponent({ selectedUserItem, setSelectedUserItem }) {
    const axiosInstance = useAxios(); 
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [userSearchLoading, setUserSearchLoading] = useState(false); 
    const { chats, getChats } = useChats();
    const { chat, createChat } = useChat();

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

    const handleSelect = async (item) => {
        setSelectedUserItem(item); 
        // setSelectedPatient(item); 
        console.log(item); 
        // Create a new chat using the selected User "item"
        await createChat(item?._id); 
        await getChats(); 
        window.location.reload();
        setResults([]); 
        // setSelectedUserItem('');
        // console.log(selectedUserItem)
        // console.log(item)
    };

    // const [selectedPatient, setSelectedPatient] = useState(selectedUserItem); 
    // console.log(selectedPatient); 

    return (
        <section className="users w-100 pb-4">
            <section className="users-search">
                <div style={{ position: 'relative' }}>
                    <div className="">
                        <div className="form-floating" style={{ width: '100%' }}>
                            <input
                                type="text"
                                value={ userSearchQuery }
                                onChange={ (e) => setUserSearchQuery(e.target.value) } 
                                id="user-search" 
                                className="form-control" 
                                placeholder="Search user..." 
                            />
                            <label htmlFor="user-search" style={{ marginLeft: 0 }}>Search user ...</label>
                        </div>
                    </div> 
                    
                    {userSearchLoading && 
                        <p className="px-3 d-flex align-items-center gap-2">
                            <span className="spinner-grow" role="status">
                            </span>
                            <span className="text-secondary"><small>Retrieving users...</small></span>
                        </p>}
                    {results.length > 0 && (
                    <ul
                        style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        width: '100%',
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
        </section>
    )
}
