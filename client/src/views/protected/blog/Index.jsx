import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import PaginationMeter from '@/components/PaginationMeter.jsx';
import PaginationLinks from '@/components/PaginationLinks.jsx';
import { useAppointments } from '@/hooks/useAppointments.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 

export default function Index() {
    return (
        <Layout>
            
        </Layout>
    )
}
