import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useRegimenAdministration(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getRegimenAdministration(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createRegimenAdministration(regimenAdministration) {
        setLoading(true); 
        setErrors({}); 

        // console.log(regimenAdministration); 
        return axiosInstance.post('regimen-administrations', regimenAdministration)
            .then(response => {
                setData(response?.data)
                // console.log(response); 
                navigate(route('home.regimen-administrations.index')); 
                swal.fire({
                    text: `RegimenAdministration added.`, 
                    color: '#000000', 
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

    async function getRegimenAdministration(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axiosInstance.get(`regimen-administrations/${id}?page=${page}&limit=${limit}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateRegimenAdministration(regimenAdministration) {
        setLoading(true); 
        setErrors({}); 
        console.log(regimenAdministration);

        return axiosInstance.put(`regimen-administrations/${id}`, regimenAdministration)
            .then(() => {
                navigate(route('home.regimen-administrations.index')); 
                swal.fire({
                    text: `RegimenAdministration updated.`, 
                    color: '#000000', 
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

    async function deleteRegimenAdministration(regimenAdministration) { 
        console.log('regimenAdministration:', regimenAdministration); 
        return axiosInstance.patch(`regimen-administrations/${regimenAdministration}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreRegimenAdministration(regimenAdministration) {
        return axiosInstance.patch(`regimen-administrations/${regimenAdministration?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyRegimenAdministration(regimenAdministration) {
        return axiosInstance.delete(`regimen-administrations/${regimenAdministration?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        regimenAdministration: { data, setData, errors, loading }, 
        createRegimenAdministration, 
        getRegimenAdministration, 
        updateRegimenAdministration, 
        deleteRegimenAdministration, 
        restoreRegimenAdministration, 
        destroyRegimenAdministration
    }
}