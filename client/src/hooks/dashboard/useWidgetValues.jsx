import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 

export default function useWidgetValues() {
    const axiosInstance = useAxios(); 
    const [widgetValues, setWidgetValues] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getWidgetValues({}, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, []); 
 
    async function getWidgetValues({}, { signal } = {}) { 
        console.log({})
        setWidgetValues([]); 
        return axiosInstance.get(`dashboard/widgets/values`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setWidgetValues(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { widgetValues, getWidgetValues }; 
}; 