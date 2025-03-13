import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import swal from 'sweetalert2'; 
import { useMedicalBill } from '@/hooks/useMedicalBill.jsx'; 
import SelectedUserComponent from '@/components/protected/nested-components/SelectedUserComponent';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Create() {
    const [selectedUserItem, setSelectedUserItem] = useState(null); 

    const { medicalBill, createMedicalBill } = useMedicalBill(); 

    const handleSubmit = async e => {
        e.preventDefault(); 

        if (selectedUserItem) {
            const formData = new FormData(); 
            selectedUserItem && formData.append('patient', selectedUserItem?._id);
            medicalBill?.data?.purpose && formData.append('purpose', medicalBill?.data?.purpose); 
            medicalBill?.data?.notes && formData.append('notes', medicalBill?.data?.notes); 
            medicalBill?.data?.comments && formData.append('comments', medicalBill?.data?.comments); 
            medicalBill?.data?.amount && formData.append('amount', medicalBill?.data?.amount); 

            await createMedicalBill(formData); 
            await medicalBill?.setData({}); 
        } else {
            // console.log('Please select a patient and at least one diagnosis type.'); 
            swal.fire({
                text: `Please search and select a patient.`, 
                color: '#900000', 
                width: 325, 
                position: 'top', 
                showConfirmButton: false
            });
        }
    }

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link 
                        to={ route('home.medical-bills.index') } className="">Medical Bills</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Add Medical Bill</span>
                </h2>
            </div>

            <section className="pt-3">
                <form onSubmit={ handleSubmit }>
                    <SelectedUserComponent 
                        selectedUserItem={ selectedUserItem } 
                        setSelectedUserItem={ setSelectedUserItem } />

                    <div className="row">
                        <div className="form-floating mb-3 col-12">
                            <textarea 
                                id="purpose"
                                className="form-control" 
                                style={{ height: '100px' }}  
                                onChange={ e => medicalBill.setData({
                                    ...medicalBill?.data,
                                    purpose: e.target.value,
                                }) } 
                                placeholder="This is for the medication." 
                                required></textarea>
                            <label htmlFor="purpose">Purpose</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-12">
                            <textarea 
                                id="notes"
                                className="form-control" 
                                style={{ height: '100px' }}  
                                onChange={ e => medicalBill.setData({
                                    ...medicalBill?.data,
                                    notes: e.target.value,
                                }) } 
                                placeholder="This is for the medication." 
                                required></textarea>
                            <label htmlFor="notes">Notes</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-12">
                            <textarea 
                                id="comments"
                                className="form-control" 
                                style={{ height: '100px' }}  
                                onChange={ e => medicalBill.setData({
                                    ...medicalBill?.data,
                                    comments: e.target.value,
                                }) } 
                                placeholder="This is for the medication." 
                                required></textarea>
                            <label htmlFor="comments">Comments</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="number" 
                                id="amount" 
                                step="0.01" 
                                min="0"  
                                className="form-control" 
                                onChange={ e => medicalBill.setData({
                                    ...medicalBill?.data,
                                    amount: e.target.value,
                                }) } 
                                placeholder="123.00" 
                                required />
                            <label htmlFor="amount">Amount (in MUR)</label>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pt-3">
                        <button type="submit" className="btn btn-outline-secondary border-radius-25">Save</button>
                    </div>
                </form>
            </section>
        </Layout>
    )
}
