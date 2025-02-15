import { useState } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useBlogCategory } from '@/hooks/blog/useBlogCategory.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Show() {
    const { id } = useParams(); 
    const { blogCategory } = useBlogCategory(id); 

    return (
        <Layout>

        </Layout>
    )
}
