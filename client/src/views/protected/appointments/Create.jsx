import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { usePatients } from '@/hooks/usePatients.jsx'; 
import { useVoiceToText } from '@/utils/useVoiceToText.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import { getDayOfWeek, getDaysOfMonth, getAllDatesOfYear } from '@/utils/ScheduleManager.js';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Create() {
    const [proposedTimeStart, setproposedTimeStart] = useState(''); 
    const [proposedTimeEnd, setproposedTimeEnd] = useState(''); 

    const year = 2025;
    console.log(getAllDatesOfYear(2025));

    const [selectedPatient, setSelectedPatient] = useState({}); 
    const [showPatients, setShowPatients] = useState(true); 
    console.log(selectedPatient); 
    const [searchKey, setSearchKey] = useState(''); 

    const { handleStartListening, 
            // handleStopListening, 
            voiceText, 
            setVoiceText,
            isListening, 
            setIsListening } = useVoiceToText(); 

    const [userQuery, setUserQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 10, 
        search_key: searchKey, 
    }); 
    const { patients, getPatients, setPatients, loading } = usePatients(userQuery); 
    console.log(patients); 

    const handleSubmit = async e => {
        e.preventDefault(); 

        if (proposedTimeStart > proposedTimeEnd) {
            swal.fire({
                text: 'The end time must be higher than the start time.', 
                color: "#900000",
                width: 300,
                position: 'top',
                showConfirmButton: false,
            });
        } else if (proposedTimeStart < proposedTimeEnd) { 
            /** Proceed */ 
        }
    }

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link 
                        to={ route('home.appointments.index') } className="">Appointments</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Add Appointment</span>
                </h2>
            </div>

            <section className="pt-3">
                <div className="search">
                    <div className="search-container border border-dark" style={{ minWidth: '250px', maxWidth: '300px' }}>
                        { !isListening &&
                            <span 
                                type="button" 
                                onClick={ handleStartListening }
                                className="voice-icon cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic-fill"
                                    viewBox="0 0 16 16">
                                    <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z"></path>
                                    <path
                                        d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5">
                                    </path>
                                </svg>
                            </span> }
                        <input 
                            type="text" 
                            value={ voiceText } 
                            onChange={ (e) => setVoiceText(e.target.value) }
                            placeholder="Search patient ..." 
                            className="" />

                        <span 
                            type="button" 
                            onClick={ async () => {
                                setSearchKey(voiceText); 
                                scrollToTop(); 
                                let firstPage = 1
                                setUserQuery(prevState => ({
                                    ...prevState, 
                                    page: firstPage, 
                                    search_key: searchKey
                                })); 
                                await getPatients(userQuery); 
                                setIsListening(false); 
                            } }
                            className="search-icon">
                                <svg width="16"
                                    height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
                                        stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                        </span>
                    </div>
                </div> 

                <section className="user-results">
                    <ul className="list-unstyled d-flex flex-column gap-3 pt-3">
                        { showPatients && patients?.data?.map((patient, index) => {
                            return (
                                <li key={ patient?._id } className="border border-1 border-secondary border-radius-25 p-3" style={{ maxWidth: '700px' }}>
                                    <div className="d-flex justify-content-end">
                                        <div 
                                            type="button" 
                                            onClick={ async () => {
                                                setSelectedPatient(patient); 
                                                console.log(selectedPatient);
                                                // await setPatients([]); 
                                                setShowPatients(false); 
                                            } }
                                            className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                                            <span className="mb-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-plus-lg"
                                                    viewBox="0 0 16 16">
                                                    <path fillRule="evenodd"
                                                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                                                </svg>
                                            </span>
                                            <span>Select</span>
                                        </div>
                                    </div>
                                    <div className="patient-doctor d-flex justify-content-start align-items-center gap-3 pt-2">
                                        <picture>
                                            <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                                media="(orientation: portrait)" />
                                            <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                                className="object-fit-cover border border-1 border-secondary border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                                        </picture>
                                        <div className="d-flex flex-column">
                                            <span className="fw-semibold">
                                                { ((patient?.first_name)?.slice(0,1)?.toUpperCase() + patient?.first_name?.slice(1))
                                                    + ' ' 
                                                    + ((patient?.last_name)?.slice(0,1)?.toUpperCase() + patient?.last_name?.slice(1)) }
                                            </span>
                                            <span>Patient has a history of diabetes in lineage.</span>
                                        </div>
                                    </div>
                                </li>
                            )
                        }) }
                    </ul>
                </section> 

                { (showPatients==false) && selectedPatient && (
                    <section className="selected-user pt-4">
                        <article className="patient-doctor d-flex justify-content-start align-items-center gap-3 pt-2">
                            <picture>
                                <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                    media="(orientation: portrait)" />
                                <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                    className="object-fit-cover border border-1 border-secondary border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                            </picture>
                            <div className="d-flex flex-column">
                                <span className="fw-semibold">{ ((selectedPatient?.first_name)?.slice(0,1)?.toUpperCase() + selectedPatient?.first_name?.slice(1))
                                                                + ' ' 
                                                                + ((selectedPatient?.last_name)?.slice(0,1)?.toUpperCase() + selectedPatient?.last_name?.slice(1)) }
                                </span>
                                <span>Patient has a history of diabetes in lineage.</span>
                            </div>
                        </article>
                    </section>
                )}

                <section className="appointment-booking pt-5">
                    <span className="d-flex align-items-center justify-content-between">
                        <h3 className="border-bottom pb-1 fs-5">Appointment Booking</h3>
                        <a href="#add-new-appointment" className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                            <span className="mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                                    className="bi bi-plus-lg" viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                                </svg>
                            </span>
                            <span>Add</span>
                        </a>
                    </span>

                    <section className="calendar pt-3">
                        <div className="years d-flex justify-content-start align-items-center flex-wrap gap-3">
                            <article className="">2025</article>
                            <article className="">2026</article>
                        </div>
                        <div className="months">
                            <div className="nav-scroller">
                                <nav className="months nav justify-content-between gap-2 py-3" style={{ width: '100vw', overflowY: 'hidden' }}>
                                    <article>January</article>
                                    <article>February</article>
                                    <article>March</article>
                                    <article>April</article>
                                    <article>May</article>
                                    <article>June</article>
                                    <article>July</article>
                                    <article>August</article>
                                    <article>September</article>
                                    <article>October</article>
                                    <article>November</article>
                                    <article>December</article>
                                </nav>
                            </div> 
                        </div>
                        <div className="dates">
                            <div className="nav-scroller">
                                <nav className="dates nav justify-content-between gap-2 py-3" style={{ width: '100vw', overflowY: 'hidden' }}>
                                    <article>1</article>
                                    <article>2</article>
                                    <article>3</article>
                                    <article>4</article>
                                    <article>5</article>
                                    <article>6</article>
                                    <article>7</article>
                                    <article>8</article>
                                    <article>9</article>
                                    <article>10</article>
                                    <article>11</article>
                                    <article>12</article>
                                    <article>13</article>
                                    <article>14</article>
                                    <article>15</article>
                                    <article>16</article>
                                    <article>17</article>
                                    <article>18</article>
                                    <article>18</article>
                                    <article>18</article>
                                    <article>18</article>
                                    <article>18</article>
                                    <article>18</article>
                                    <article>18</article>
                                    <article>18</article>
                                    <article>18</article>
                                    <article>18</article>
                                    <article>18</article>
                                </nav>
                            </div> 
                        </div>
                        <div className="appointments d-flex flex-column gap-3 pt-3">
                            <article className="border-radius-35 p-2 d-flex align-items-center gap-3" style={{ backgroundColor: '#f2f2f2', maxWidth: '500px' }}>
                                <picture>
                                    <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                        media="(orientation: portrait)" />
                                    <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                        className="object-fit-cover border border-1 border-secondary border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                                </picture>
                                <div className="d-flex flex-column">
                                    <span className="fw-semibold">Meet with Dr. Smith</span>
                                    <span>20:00 - 21:00</span>
                                </div>
                            </article>
                            <article className="border-radius-35 p-2 d-flex align-items-center gap-3" style={{ backgroundColor: '#f2f2f2', maxWidth: '500px' }}>
                                <picture>
                                    <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                        media="(orientation: portrait)" />
                                    <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                        className="object-fit-cover border border-1 border-secondary border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                                </picture>
                                <div className="d-flex flex-column">
                                    <span className="fw-semibold">Meet with Dr. Smith</span>
                                    <span>20:00 - 21:00</span>
                                </div>
                            </article>
                        </div>
                    </section>

                    <section className="new-appointment pt-5" id="add-new-appointment">
                        <div className="time-range">
                            <h4 className="border-bottom fw-semibold fs-6">Time Slot</h4>
                            <div>
                                <form onSubmit={ handleSubmit } id="auth-form" className="auth-form">
                                    <div className="row">
                                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                                            <input 
                                                type="time" 
                                                min="09:00" max="18:00" 
                                                id="proposed_time_start" 
                                                className="form-control" 
                                                onChange={ e => setproposedTimeStart(e.target.value) } 
                                                placeholder="09:00" />
                                            <label htmlFor="proposed_time_start">Proposed Start Time</label>
                                        </div>
                                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                                            <input 
                                                type="time" 
                                                min="09:00" max="18:00" 
                                                id="proposed_time_end" 
                                                className="form-control" 
                                                onChange={ e => setproposedTimeEnd(e.target.value) } 
                                                placeholder="09:00" />
                                            <label htmlFor="proposed_time_end">Proposed End Time</label>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end pt-3">
                                        <button type="submit" className="btn btn-outline-secondary border-radius-25">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </section>
            </section>
        </Layout>
    )
}
