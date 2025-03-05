import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 

export default function useUserCount(range = 'all') {
    const axiosInstance = useAxios(); 
    const [userCount, setUserCount] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getUserCount(range, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, [range]); 
 
    async function getUserCount(range, { signal } = {}) { 
        console.log(range)
        setUserCount([]); 
        return axiosInstance.get(`dashboard/user-count?range=${range}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setUserCount(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { userCount, getUserCount }; 
}; 