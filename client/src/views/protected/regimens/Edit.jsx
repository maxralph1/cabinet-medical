import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
import { useRegimen } from '@/hooks/useRegimen.jsx'; 
import SelectedUserComponent from '@/components/protected/nested-components/SelectedUserComponent';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Edit() {
    const { id } = useParams(); 
    const { regimen, getRegimen, updateRegimen } = useRegimen(id); 
    console.log(regimen); 

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

    const handleSubmit = async e => {
        e.preventDefault(); 

        // if (selectedUserItem) {
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
                regimen?.data?.comments && formData.append('comments', regimen?.data?.comments); 
                regimen?.data?.date_time_start && formData.append('date_time_start', regimen?.data?.date_time_start); 
                regimen?.data?.frequency_value && formData.append('frequency_value', regimen?.data?.frequency_value); 
                regimen?.data?.frequency_unit && formData.append('frequency_unit', regimen?.data?.frequency_unit); 
                regimen?.data?.administrations_count && formData.append('administrations_count', regimen?.data?.administrations_count); 
                (proposedAdministrationDateTimes) && formData.append('proposed_administration_date_times', JSON.stringify(proposedAdministrationDateTimes)); 

                await updateRegimen(formData); 
                await regimen?.setData({}); 
            }
        // } else {
        //     // console.log('Please select a patient and at least one diagnosis type.'); 
        //     swal.fire({
        //         text: `Please search and select a patient.`, 
        //         color: '#900000', 
        //         width: 325, 
        //         position: 'top', 
        //         showConfirmButton: false
        //     });
        // }
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
                    { (regimen?.data?.patient) && (
                        <section className="selected-user pt-2 pb-4 px-3">
                            <article className="d-flex align-items-center gap-3">
                                <div className="patient-doctor d-flex justify-content-start align-items-center gap-3 pt-2">
                                    <picture>
                                        <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                            media="(orientation: portrait)" />
                                        <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                            className="object-fit-cover border border-1 border-secondary border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                                    </picture>
                                    <div className="d-flex flex-column">
                                        <span className="fw-semibold">{ ((regimen?.data?.patient?.first_name)?.slice(0,1)?.toUpperCase() + regimen?.data?.patient?.first_name?.slice(1))
                                                                        + ' ' 
                                                                        + ((regimen?.data?.patient?.last_name)?.slice(0,1)?.toUpperCase() + regimen?.data?.patient?.last_name?.slice(1)) }
                                        </span>
                                        <span>Patient has a history of diabetes in lineage.</span>
                                    </div>
                                </div>
                            </article>
                        </section>
                    ) }

                    <div className="row">
                        <div className="form-floating mb-3 col-12">
                            <textarea 
                                id="notes"
                                value={ regimen?.data?.notes ?? '' }
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
                                value={ regimen?.data?.comments ?? '' }
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
                                <h4 className="fs-6">Added Schedules:</h4>
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

                        { (regimen?.data?.regimen_administrations?.length>0) && (
                            <section className="product-units pt-4">
                                <h4 className="fs-5">Schedule:&nbsp;&nbsp;</h4>
                                <ul className="list-unstyled pt-1">
                                    { regimen?.data?.regimen_administrations?.map((item, index) => (
                                        <li key={index} className="product-unit pb-2 d-flex">
                                            <span>{ index+1 }.&nbsp;</span>
        
                                            <div className="d-flex flex-column">
                                                <span>Administration Date & Time:&nbsp;<span className="fw-semibold">{ dayjs(item?.proposed_administration_date_time).format('ddd, MMM D, YYYY h:mm A') }</span></span>
                                            </div>
        
                                            <div className="ms-2">
                                                <span 
                                                    onClick={ () => {
                                                        swal.fire({
                                                            text: "Are you sure you want to delete this?", 
                                                            showCancelButton: true,
                                                            confirmButtonColor: "#FF0000",
                                                            cancelButtonColor: "#414741",
                                                            confirmButtonText: "Yes!", 
                                                            cancelButtonText: "No!", 
                                                            customClass: {
                                                                confirmButton: 'swal2-confirm-button', 
                                                                cancelButton: 'swal2-cancel-button'
                                                            }, 
                                                        }).then((result) => {
                                                            if (result.isConfirmed) {
                                                                deleteRegimenAdministration(item?._id); 
                                                                // setRegimens([]);
                                                                getRegimen(id); 
                                                            }
                                                        });
                                                    }} 
                                                    className="cursor-pointer">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                        </svg>
                                                </span>
                                            </div>
                                        </li>
                                    )) }
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
