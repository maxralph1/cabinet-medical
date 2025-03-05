import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import swal from 'sweetalert2'; 


export function useWidget(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 

    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getWidget(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createWidget(widget) {
        setLoading(true); 
        setErrors({}); 

        // console.log(widget); 
        return axiosInstance.post('widgets/add', widget)
            .then(response => {
                setData(response?.data?.data)
                console.log(response); 
                swal.fire({
                    text: `Widget added.`, 
                    color: '#f2f2f20', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
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

    async function getWidget(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        // return axiosInstance.get(`widgets/${id}?page=${page}&limit=${limit}`)
        return axiosInstance.get(`widgets/${id}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    // async function updateWidget(widget) {
    //     setLoading(true); 
    //     setErrors({}); 
    //     console.log(widget);

    //     return axiosInstance.put(`widgets/${id}`, widget)
    //         // .then(() => navigate(route('home.blog.publications.index')))
    //         .then(() => navigate(route('home.blog.index')))
    //         .catch(error => setErrors(error?.response))
    //         .finally(() => {
    //             setLoading(false); 
    //             setData({}); 
    //         });
    // }

    async function deleteWidget(widget) { 
        console.log('widget:', widget); 
        return axiosInstance.put(`widgets/remove`, widget)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    // async function restoreWidget(widget) {
    //     return axiosInstance.patch(`widgets/${widget?._id}/restore`)
    //         .then(() => {})
    //         .catch(error => setErrors(error?.response))
    //         .finally(() => setLoading(false)); 
    // } 

    // async function destroyWidget(widget) {
    //     return axiosInstance.delete(`widgets/${widget?._id}`)
    //         .then(() => {})
    //         .catch(error => setErrors(error?.response))
    //         .finally(() => setLoading(false)); 
    // } 

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