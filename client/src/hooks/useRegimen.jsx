import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useRegimen(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getRegimen(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createRegimen(regimen) {
        setLoading(true); 
        setErrors({}); 

        // console.log(regimen); 
        return axiosInstance.post('regimens', regimen)
            .then(response => {
                setData(response?.data)
                // console.log(response); 
                navigate(route('home.regimens.index')); 
                swal.fire({
                    text: `Regimen added.`, 
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

    async function getRegimen(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axiosInstance.get(`regimens/${id}?page=${page}&limit=${limit}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateRegimen(regimen) {
        setLoading(true); 
        setErrors({}); 
        console.log(regimen);

        return axiosInstance.put(`regimens/${id}`, regimen)
            .then(() => {
                navigate(route('home.regimens.index')); 
                swal.fire({
                    text: `Regimen updated.`, 
                    color: '#f2f2f20', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
            })
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteRegimen(regimen) { 
        console.log('regimen:', regimen); 
        return axiosInstance.patch(`regimens/${regimen}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreRegimen(regimen) {
        return axiosInstance.patch(`regimens/${regimen?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyRegimen(regimen) {
        return axiosInstance.delete(`regimens/${regimen?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        regimen: { data, setData, errors, loading }, 
        createRegimen, 
        getRegimen, 
        updateRegimen, 
        deleteRegimen, 
        restoreRegimen, 
        destroyRegimen
    }
}