import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useBlogCategory(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getBlogCategory(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createBlogCategory(blogCategory) {
        setLoading(true); 
        setErrors({}); 

        // console.log(blogCategory); 
        return axiosInstance.post('blog/categories', blogCategory)
            .then(response => {
                setData(response?.data?.data)
                console.log(response); 
                swal.fire({
                    text: `Blog Category created.`, 
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

    async function getBlogCategory(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axiosInstance.get(`blog/categories/${id}?page=${page}&limit=${limit}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateBlogCategory(blogCategory) {
        setLoading(true); 
        setErrors({}); 
        console.log(blogCategory);

        return axiosInstance.put(`blog/categories/${id}`, blogCategory)
            .then(() => navigate(route('home.blog.categories.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteBlogCategory(blogCategory) { 
        console.log('blogCategory:', blogCategory); 
        return axiosInstance.patch(`blog/categories/${blogCategory}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreBlogCategory(blogCategory) {
        return axiosInstance.patch(`blog/categories/${blogCategory?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyBlogCategory(blogCategory) {
        return axiosInstance.delete(`blog/categories/${blogCategory?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        blogCategory: { data, setData, errors, loading }, 
        createBlogCategory, 
        getBlogCategory, 
        updateBlogCategory, 
        deleteBlogCategory, 
        restoreBlogCategory, 
        destroyBlogCategory
    }
}