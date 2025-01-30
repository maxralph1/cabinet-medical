import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import swal from 'sweetalert2'; 
import { useRegimen } from '@/hooks/useRegimen.jsx'; 
import SelectedUserComponent from '@/components/protected/nested-components/SelectedUserComponent';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Create() {
    const [selectedUserItem, setSelectedUserItem] = useState(null); 

    const { regimen, createRegimen } = useRegimen(); 

    const handleSubmit = async e => {
        e.preventDefault(); 

        if (selectedUserItem) {
            const formData = new FormData(); 
            selectedUserItem && formData.append('patient', selectedUserItem?._id); 
            regimen?.data?.notes && formData.append('notes', regimen?.data?.notes); 
            // regimen?.data?.comments && formData.append('comments', regimen?.data?.comments); 
            regimen?.data?.date_start && formData.append('date_start', regimen?.data?.date_start); 
            regimen?.data?.time_start && formData.append('time_start', regimen?.data?.time_start); 
            regimen?.data?.date_end && formData.append('date_end', regimen?.data?.date_end); 
            regimen?.data?.time_end && formData.append('time_end', regimen?.data?.time_end); 

            await createRegimen(formData); 
            await regimen?.setData({}); 
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
                        to={ route('home.regimens.index') } className="">Regimens</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Add Regimen</span>
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
                                id="notes"
                                className="form-control" 
                                style={{ height: '100px' }}  
                                onChange={ e => regimen.setData({
                                    ...regimen?.data,
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
                                onChange={ e => regimen.setData({
                                    ...regimen?.data,
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
                                type="date" 
                                id="date_start" 
                                className="form-control"  
                                onChange={ e => regimen.setData({
                                    ...regimen?.data,
                                    date_start: e.target.value,
                                }) }
                                placeholder="09:00" />
                            <label htmlFor="date_start">Date Start</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="time" 
                                id="time_start" 
                                className="form-control" 
                                onChange={ e => regimen.setData({
                                    ...regimen?.data,
                                    time_start: e.target.value,
                                }) }  
                                placeholder="09:00" />
                            <label htmlFor="time_start">Time Start</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="date" 
                                id="date_end" 
                                className="form-control"  
                                onChange={ e => regimen.setData({
                                    ...regimen?.data,
                                    date_end: e.target.value,
                                }) }
                                placeholder="09:00" />
                            <label htmlFor="date_end">Date End</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="time" 
                                id="time_end" 
                                className="form-control" 
                                onChange={ e => regimen.setData({
                                    ...regimen?.data,
                                    time_end: e.target.value,
                                }) }  
                                placeholder="09:00" />
                            <label htmlFor="time_end">Time End</label>
                        </div>
                    </div>

                    {/* Regimen Administration */}

                    <section className="pt-3">
                        <h3 className="border-bottom fs-6">Administration Guide</h3>
                        
                        <div className="row align-items-center py-3">
                            <div className="form-floating mb-3 col-sm-9 col-md-6">
                                <input 
                                    type="datetime-local" 
                                    id="administration_date_time" 
                                    className="form-control"  
                                    onChange={ e => regimen.setData({
                                        ...regimen?.data,
                                        administration_date_time_item: e.target.value,
                                    }) }
                                    placeholder="09:00" />
                                <label htmlFor="administration_date_time">Administration Date and Time</label>
                            </div>
                            <div className="col-3">
                                <span>
                                    <button 
                                        type="button" 
                                        // onClick={}
                                        className="btn btn-outline-secondary border-radius-25">
                                            Add
                                    </button>
                                </span>
                            </div>
                        </div>
                    </section>

                    <div className="d-flex justify-content-end pt-4">
                        <button type="submit" className="btn btn-outline-secondary border-radius-25">Save</button>
                    </div>
                </form>
            </section>
        </Layout>
    )
}
