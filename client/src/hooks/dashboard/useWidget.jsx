import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import swal from 'sweetalert2'; 


export function useWidget(widget = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 

    useEffect(() => {
        if (widget !== null) {
            const controller = new AbortController();
            getWidget(widget, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [widget]);

    async function createWidget(widget) {
        setLoading(true); 
        setErrors({}); 

        console.log(widget); 
        return axiosInstance.post('dashboard/widgets/add', { widget })
            .then(response => {
                setData(response?.data?.data)
                console.log(response); 
                // swal.fire({
                //     text: `Widget added.`, 
                //     color: '#f2f2f20', 
                //     width: 325, 
                //     position: 'top', 
                //     showConfirmButton: false
                // });
            })
            .catch(error => {
                setErrors(error?.response); 
                if (error?.response?.status == 409) {
                    swal.fire({
                        text: `${error?.response?.data?.message}`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    });
                } else {
                    swal.fire({
                        text: `${error?.response?.status}: An error occured!`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    });
                }
                console.log(error);
            })
            .finally(() => {
                setLoading(false); 
                setData({});
            });
    } 

    async function getWidget(widget) {
        // setLoading(true); 
        // console.log(id);

        // return axiosInstance.get(`widgets/${id}?page=${page}&limit=${limit}`)
        return axiosInstance.get(`dashboard/widgets/${ widget }`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function deleteWidget(widget) { 
        console.log('widget:', widget); 
        return axiosInstance.put(`dashboard/widgets/remove`, { widget })
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    return {
        widget: { data, setData, errors, loading }, 
        createWidget, 
        getWidget, 
        // updateWidget, 
        deleteWidget, 
        // restoreWidget, 
        // destroyWidget 
    }
}