import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useInventoryCategory(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getInventoryCategory(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createInventoryCategory(inventoryCategory) {
        setLoading(true); 
        setErrors({}); 

        // console.log(inventoryCategory); 
        return axiosInstance.post('inventory/categories', inventoryCategory)
            .then(response => {
                setData(response?.data?.data)
                console.log(response); 
                swal.fire({
                    text: `Inventory Category created.`, 
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

    async function getInventoryCategory(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axiosInstance.get(`inventory/categories/${id}?page=${page}&limit=${limit}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateInventoryCategory(inventoryCategory) {
        setLoading(true); 
        setErrors({}); 
        console.log(inventoryCategory);

        return axiosInstance.put(`inventory/categories/${id}`, inventoryCategory)
            .then(() => navigate(route('home.inventory.categories.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteInventoryCategory(inventoryCategory) { 
        console.log('inventoryCategory:', inventoryCategory); 
        return axiosInstance.patch(`inventory/categories/${inventoryCategory}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreInventoryCategory(inventoryCategory) {
        return axiosInstance.patch(`inventory/categories/${inventoryCategory?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyInventoryCategory(inventoryCategory) {
        return axiosInstance.delete(`inventory/categories/${inventoryCategory?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        inventoryCategory: { data, setData, errors, loading }, 
        createInventoryCategory, 
        getInventoryCategory, 
        updateInventoryCategory, 
        deleteInventoryCategory, 
        restoreInventoryCategory, 
        destroyInventoryCategory
    }
}