import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useInventory(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getInventory(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createInventory(inventory) {
        setLoading(true); 
        setErrors({}); 

        console.log(inventory); 
        return axiosInstance.post('inventory', inventory)
            .then(response => {
                setData(response?.data)
                console.log(response); 
                navigate(route('home.inventory.index'));
                swal.fire({
                    text: `Inventory added.`, 
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

    async function getInventory(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axiosInstance.get(`inventory/${id}?page=${page}&limit=${limit}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateInventory(inventory) {
        setLoading(true); 
        setErrors({}); 
        console.log(inventory);

        return axiosInstance.put(`inventory/${id}`, inventory)
            .then(() => navigate(route('home.inventorys.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteInventory(inventory) { 
        console.log('inventory:', inventory); 
        return axiosInstance.patch(`inventory/${inventory}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreInventory(inventory) {
        return axiosInstance.patch(`inventory/${inventory?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyInventory(inventory) {
        return axiosInstance.delete(`inventory/${inventory?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        inventory: { data, setData, errors, loading }, 
        createInventory, 
        getInventory, 
        updateInventory, 
        deleteInventory, 
        restoreInventory, 
        destroyInventory
    }
}