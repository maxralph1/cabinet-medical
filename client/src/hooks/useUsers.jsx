import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useUsers(userQuery) {
    const axiosInstance = useAxios(); 
    const [users, setUsers] = useState([]); 

    useEffect(() => {
        if (userQuery !== null) {
            const controller = new AbortController(); 
            getUsers(userQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [userQuery]); 

    async function getUsers(userQuery, { signal } = {}) { 
        console.log(userQuery);
        return axiosInstance.get(`users?role=${userQuery?.role}&range=${userQuery?.range}&page=${userQuery?.page}&limit=${userQuery?.limit}`, { signal }) 
            .then(response => setUsers(response?.data))
            .catch(error => console.log(error));
    } 

    return { users, getUsers }; 
} 
