import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useInventoryProduct(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getInventoryProduct(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createInventoryProduct(inventoryProduct) {
        setLoading(true); 
        setErrors({}); 

        // console.log(inventoryProduct); 
        return axiosInstance.post('inventory/products', inventoryProduct)
            .then(response => {
                setData(response?.data?.data)
                console.log(response); 
                swal.fire({
                    text: `Inventory Product created.`, 
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

    async function getInventoryProduct(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axiosInstance.get(`inventory/products/${id}?page=${page}&limit=${limit}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateInventoryProduct(inventoryProduct) {
        setLoading(true); 
        setErrors({}); 
        console.log(inventoryProduct);

        return axiosInstance.put(`inventory/products/${id}`, inventoryProduct)
            .then(() => navigate(route('home.blog.publications.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteInventoryProduct(inventoryProduct) { 
        console.log('inventoryProduct:', inventoryProduct); 
        return axiosInstance.patch(`inventory/products/${inventoryProduct}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreInventoryProduct(inventoryProduct) {
        return axiosInstance.patch(`inventory/products/${inventoryProduct?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyInventoryProduct(inventoryProduct) {
        return axiosInstance.delete(`inventory/products/${inventoryProduct?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        inventoryProduct: { data, setData, errors, loading }, 
        createInventoryProduct, 
        getInventoryProduct, 
        updateInventoryProduct, 
        deleteInventoryProduct, 
        restoreInventoryProduct, 
        destroyInventoryProduct
    }
}