import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import swal from 'sweetalert2'; 
import { useRegimen } from '@/hooks/useRegimen.jsx'; 
import SelectedUserComponent from '@/components/protected/nested-components/SelectedUserComponent';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Create() {
    const [selectedUserItem, setSelectedUserItem] = useState(null); 

    const [proposedAdministrationDateTime, setProposedAdministrationDateTime] = useState(); 
    const [proposedAdministrationDateTimes, setProposedAdministrationDateTimes] = useState([]); 
    console.log('proposed date times:', proposedAdministrationDateTimes); 

    const removeDateTime = (dateTimeToRemove) => {
        // Filter out the item with the specific date_time value
        const updatedDateTimes = proposedAdministrationDateTimes.filter(
            item => item.date_time !== dateTimeToRemove
        );

        // Update the state with the new filtered array
        setProposedAdministrationDateTimes(updatedDateTimes);
    };

    // useEffect(() => {
    //     console.log('proposedAdministrationDateTimes updated:', proposedAdministrationDateTimes);
    // }, [proposedAdministrationDateTimes]);

    const { regimen, createRegimen } = useRegimen(); 

    const handleSubmit = async e => {
        e.preventDefault(); 

        if (selectedUserItem) {
            const formData = new FormData(); 

            if (regimen?.data?.date_time_start && proposedAdministrationDateTimes?.length > 0) {
                swal.fire({
                    text: `Please provide either a date and time start or a list of proposed administration date and times.`, 
                    color: '#900000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
                return;
            } else {
                selectedUserItem && formData.append('patient', selectedUserItem?._id); 
                regimen?.data?.notes && formData.append('notes', regimen?.data?.notes); 
                regimen?.data?.date_time_start && formData.append('date_time_start', regimen?.data?.date_time_start); 
                regimen?.data?.frequency_value && formData.append('frequency_value', regimen?.data?.frequency_value); 
                regimen?.data?.frequency_unit && formData.append('frequency_unit', regimen?.data?.frequency_unit); 
                regimen?.data?.administrations_count && formData.append('administrations_count', regimen?.data?.administrations_count); 
                (proposedAdministrationDateTimes) && formData.append('proposed_administration_date_times', JSON.stringify(proposedAdministrationDateTimes)); 

                await createRegimen(formData); 
                await regimen?.setData({}); 
            }
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
                    {/* <div className="row">
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
                    </div> */}
                    <section className="regimen-administration-guide pt-3">
                        <h3 className="border-bottom fs-5">Administration Guide</h3>

                        <section className="pt-3">
                            <span>Add one date and time with the frequency of administration and let our AI calculate the rest for you evenly spaced out.</span>
                            <section className="row align-items-center pt-3">
                                <div className="form-floating mb-3 col-sm-6 col-md-3">
                                    <input 
                                        type="number" 
                                        min="0"
                                        id="administrations_count" 
                                        className="form-control" 
                                        onChange={ e => regimen.setData({
                                            ...regimen?.data,
                                            administrations_count: e.target.value,
                                        }) }
                                        placeholder="123" />
                                    <label htmlFor="administrations_count">Administrations Count</label>
                                </div>
                            </section>
                            <section className="row align-items-center py-3">
                                <div className="form-floating mb-3 col-sm-12 col-md-6">
                                    <input 
                                        type="datetime-local" 
                                        id="date_time_start" 
                                        className="form-control"  
                                        onChange={ e => regimen.setData({
                                            ...regimen?.data,
                                            date_time_start: e.target.value,
                                        }) }
                                        placeholder="09:00" />
                                    <label htmlFor="date_start">Date and Time Start</label>
                                </div>
                                <div className="form-floating mb-3 col-sm-6 col-md-3">
                                    <input 
                                        type="number" 
                                        min="0"
                                        id="frequency_value" 
                                        className="form-control" 
                                        onChange={ e => regimen.setData({
                                            ...regimen?.data,
                                            frequency_value: e.target.value,
                                        }) }
                                        placeholder="123" />
                                    <label htmlFor="frequency_value">Frequency</label>
                                </div>
                                <div className="form-floating mb-3 col-sm-6 col-md-3">
                                    <select 
                                        id="frequency_unit" 
                                        className="form-select" 
                                        onChange={ e => regimen.setData({
                                            ...regimen?.data,
                                            frequency_unit: e.target.value,
                                        }) }
                                        placeholder="Hourly">
                                            <option>Choose one ...</option>
                                            <option value="per_second">Per Second</option>
                                            <option value="per_minute">Per Minute</option> 
                                            <option value="hourly">Hourly</option> 
                                            <option value="daily">Daily</option> 
                                    </select>
                                    <label htmlFor="frequency_unit">Frequency Type</label>
                                </div>
                            </section>
                        </section>

                        <div className="d-flex justify-content-center border-top border-bottom mb-3"><span>OR</span></div>

                        <section className="pt-3">
                            <span>Select your preferred dates and times manually and click on the "Add" button to add date and time to list before saving all.</span>
                            <section className="row align-items-center py-3">
                                <div className="form-floating mb-3 col-sm-9 col-md-6">
                                    <input 
                                        type="datetime-local" 
                                        id="administration_date_time" 
                                        className="form-control"  
                                        value={ proposedAdministrationDateTime?.date_time ?? '' } 
                                        onChange={ e => setProposedAdministrationDateTime({
                                            ...proposedAdministrationDateTime,
                                            date_time: e.target.value,
                                        }) } 
                                        placeholder="09:00" />
                                    <label htmlFor="administration_date_time">Administration Date and Time</label>
                                </div>
                                <div className="col-3">
                                    <span>
                                        <button 
                                            type="button" 
                                            onClick={ () => {
                                                const isValidDateTime = (dateTime) => {
                                                    // Check if the given date is valid
                                                    const parsedDate = new Date(dateTime);
                                                    return !isNaN(parsedDate.getTime());
                                                }; 
                                                if (!isValidDateTime(proposedAdministrationDateTime?.date_time)) {
                                                    alert("Please provide a valid date_time.");
                                                    return;
                                                }

                                                const isDuplicate = proposedAdministrationDateTimes.some(item => item.date_time === proposedAdministrationDateTime?.date_time);
                                                if (isDuplicate) {
                                                    alert("This date and time already exists in the list."); 
                                                    return;
                                                }
                                                setProposedAdministrationDateTimes(prevItems => [...prevItems, proposedAdministrationDateTime]); 
                                                setProposedAdministrationDateTime(null); 
                                            }} 
                                            className="btn btn-outline-secondary border-radius-25">
                                                Add
                                        </button>
                                    </span>
                                </div>
                            </section>
                        </section>

                        { (proposedAdministrationDateTimes?.length > 0) && (
                            <section className="added-product-units">
                                <h4 className="fs-6">Schedules:</h4>
                                <ul className="list-unstyled">
                                    { proposedAdministrationDateTimes?.reverse()?.map((schedule, index) => {
                                        return (
                                            <li key={ index }>
                                                <span>{ index+1 }:&nbsp;</span>
                                                <span className="fw-semibold">{ schedule?.date_time }</span>
                                                <button 
                                                    onClick={ () => removeDateTime(schedule.date_time) } 
                                                    className="cursor-pointer ms-3 bg-transparent border-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FF0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                    </svg>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </section>
                        )}
                    </section>

                    <div className="d-flex justify-content-end pt-4">
                        <button type="submit" className="btn btn-outline-secondary border-radius-25">Save</button>
                    </div>
                </form>
            </section>
        </Layout>
    )
}
