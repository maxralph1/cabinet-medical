import { useContext, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { useParams } from 'react-router-dom'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import useImageHandler from '@/utils/useImageHandler';
import { useUser } from '@/hooks/useUser.jsx'; 
import { usePatientChart } from '@/hooks/usePatientChart.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Show() {
    const { username } = useParams();
    console.log(username)
    const { retrievedUser, getUser, updateUser } = useUser(username); 
    console.log(retrievedUser)

    const { patientChart, createPatientChart } = usePatientChart();

    const [toggleChartForm, setToggleChartForm] = useState(false); 
    const [toggleSettings, setToggleSettings] = useState(false); 

    const { image, handleImageClick, handleImageChange } = useImageHandler();

    const handleSettingsUpdate = async e => {
        e.preventDefault(); 

        const formData = new FormData(); 
        (image) && formData.append('user_image', retrievedUser?.data?.user_image); 
        retrievedUser?.data?.first_name && formData.append('first_name', retrievedUser?.data?.first_name); 
        retrievedUser?.data?.last_name && formData.append('last_name', retrievedUser?.data?.last_name); 
        retrievedUser?.data?.email && formData.append('email', retrievedUser?.data?.email); 
        retrievedUser?.data?.receive_notifications && formData.append('receive_notifications', retrievedUser?.data?.receive_notifications); 
        retrievedUser?.data?.show_online_status && formData.append('show_online_status', retrievedUser?.data?.show_online_status); 
        retrievedUser?.data?.verified && formData.append('verified', retrievedUser?.data?.verified); 
        retrievedUser?.data?.banned && formData.append('banned', retrievedUser?.data?.banned); 
        retrievedUser?.data?.role && formData.append('account_type', retrievedUser?.data?.role); 

        await updateUser(formData); 
        await retrievedUser?.setData({}); 
        getUser(username);
    }

    const handleChartSubmit = async e => {
        e.preventDefault(); 

        const formData = new FormData(); 
        patientChart?.data?.notes && formData.append('notes', patientChart?.data?.notes); 
        patientChart?.data?.comments && formData.append('comments', patientChart?.data?.comments); 
        formData.append('patient', retrievedUser?.data?._id); 

        await createPatientChart(formData); 
        await patientChart?.setData({}); 
        await getUser(username); 
    }

    const handleChartUpdate = async e => {
        e.preventDefault(); 

        const formData = new FormData(); 
        
    }

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">Profile</h2>
            </div>

            <section className="personal-information pt-3">
                <h3 className="fs-4 border-bottom pb-1 mb-4 d-inline-block">Personal Information</h3>
                <div className="vw-100 row row-gap-4">
                    <section className="col-sm-12 col-md-5 order-2 order-md-1">
                        <div className="d-flex justify-content-between">
                            <p className="fw-semibold">First Name:</p>
                            <p>{ ((retrievedUser?.data?.first_name)?.slice(0,1)?.toUpperCase() + (retrievedUser?.data?.first_name)?.slice(1)) }</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="fw-semibold">Last Name:</p>
                            <p>{ ((retrievedUser?.data?.last_name)?.slice(0,1)?.toUpperCase() + (retrievedUser?.data?.last_name)?.slice(1)) }</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="fw-semibold">Email Address:</p>
                            <p>{ retrievedUser?.data?.email }</p>
                        </div>
                        <div className="d-flex justify-content-between mb-0" style={{ fontSize: 'small' }}>
                            <p className="fw-semibold mb-0">Last Login:</p>
                            <p className="mb-0">{ dayjs(user?.user?.last_login_time)?.format('MMMM DD, YYYY, HH:mm') }</p>
                        </div>
                        <div className="d-flex justify-content-end" style={{ fontSize: 'small' }}>
                            <div className="fw-semibold">
                                { (dayjs()?.diff(user?.user?.last_login_time, 'hour') > 4) 
                                    ? (
                                        <div>
                                            <span>Offline</span>&nbsp;
                                            <span 
                                                style={{
                                                width: '8.5px',
                                                height: '8.5px',
                                                borderRadius: '50%',
                                                backgroundColor: 'red',
                                                display: 'inline-block',
                                                }}
                                            />
                                        </div>
                                    )
                                    : (
                                        <div>
                                            <span>Online</span>&nbsp;
                                                <span 
                                                    style={{
                                                    width: '8.5px',
                                                    height: '8.5px',
                                                    borderRadius: '50%',
                                                    // backgroundColor: isOnline ? 'green' : 'red',
                                                    backgroundColor: 'green',
                                                    display: 'inline-block',
                                                    }}
                                                />
                                        </div>
                                    )}
                            </div>
                        </div>
                    </section>

                    <section className="col-sm-12 col-md-6 order-1 order-md-2 px-3">
                        { (image || retrievedUser?.data?.user_image_path?.url) ? (
                            // <img src={image || retrievedUser?.data?.user_image_path?.url} alt="Preview" className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            
                            <picture className="w-100">
                                <source srcSet={image || retrievedUser?.data?.user_image_path?.url}
                                    media="(orientation: portrait)" />
                                <img src={image || retrievedUser?.data?.user_image_path?.url}
                                    className="object-fit-cover border border-1 border-secondary border-radius-25 d-block" 
                                    style={{ width: '150px', height: '150px' }} alt="" />
                            </picture>
                        ) : (
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="#414141" className="bi bi-image" viewBox="0 0 16 16">
                                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                </svg>
                            </span>
                        )}
                        
                    </section>
                </div>
            </section>

            <section className="medical-chart pt-5">
                <h3 className="fs-5 mb-3 border-bottom pb-1">Medical Chart</h3>

                <div className="d-flex justify-content-end pt-2">
                    <span 
                        onClick={ () => setToggleChartForm(!toggleChartForm) }
                        className="btn btn-sm btn-outline-secondary border-radius-15 py-0">
                        <span>
                            {toggleChartForm ? 'Close ' : 'Open '}   
                        </span>Chart Form
                    </span>
                </div>

                { toggleChartForm && (
                    <section className="pt-3">
                        <form onSubmit={ handleChartSubmit }>
                            <div className="row">
                                <div className="form-floating mb-3 col-12">
                                    <textarea 
                                        id="notes"
                                        className="form-control" 
                                        style={{ height: '100px' }}  
                                        value={ patientChart?.data?.notes ?? '' } 
                                        onChange={ e => patientChart.setData({
                                            ...patientChart?.data,
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
                                        value={ patientChart?.data?.comments ?? '' } 
                                        onChange={ e => patientChart.setData({
                                            ...patientChart?.data,
                                            comments: e.target.value,
                                        }) } 
                                        placeholder="This is for the medication." 
                                        required></textarea>
                                    <label htmlFor="comments">Comments</label>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end pt-3">
                                <button type="submit" className="btn btn-outline-secondary border-radius-25">Add</button>
                            </div>
                        </form>
                    </section>
                ) }

                <section>
                    { ((retrievedUser?.data?.charts?.length > 0) 
                        ? retrievedUser?.data?.charts
                                        ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                        ?.map(chart => {
                        return (
                            <article key={ chart?._id }>
                                <div className="border-bottom pt-3">
                                    <div>
                                        <h4 className="mb-0" style={{ fontSize: 'small' }}>Notes:</h4>
                                        <p className="mb-0">{ chart?.notes }</p>
                                    </div>
                                    <div className="pt-3">
                                        <h4 className="mb-0" style={{ fontSize: 'small' }}>Comments:</h4>
                                        <p className="mb-0">{ chart?.comments }</p>
                                    </div>
                                    <p className="text-secondary" style={{ fontSize: 'small'}}>
                                        <small>
                                            { dayjs(chart?.created_at)?.format('MMMM D, YYYY, HH:mm') }&nbsp;-&nbsp;
                                            <span className="fst-italic">
                                                { ((chart?.professional?.first_name)?.slice(0,1)?.toUpperCase() + (chart?.professional?.first_name)?.slice(1)) 
                                                    + ' ' 
                                                    + ((chart?.professional?.last_name)?.slice(0,1)?.toUpperCase() + (chart?.professional?.last_name)?.slice(1)) }
                                            </span>
                                        </small>
                                    </p>
                                </div>
                            </article>
                        )
                    }) : <div>No chart</div>) }
                    {/* <article>
                        <div className="">
                            <p className="mb-0">Has a history of diabetes in lineage.</p>
                            <p className="text-secondary" style={{ fontSize: 'small'}}>
                                <small>October 20, 2025, 14:00&nbsp;-&nbsp;<span className="fst-italic">Dr. User One</span></small>
                            </p>
                        </div>
                    </article>
                    <article>
                        <div className="">
                            <p className="mb-0">Patient has low tolerance to fats/oils. Do not administer corticosteriods.</p>
                            <p className="text-secondary" style={{ fontSize: 'small'}}>
                                <small>October 20, 2025, 14:00&nbsp;-&nbsp;<span className="fst-italic">Dr. User One</span></small>
                            </p>
                        </div>
                    </article> */}
                </section>
            </section>

            <section className="settings pt-5">
                <h3 className="fs-5 mb-3 border-bottom pb-1">Settings</h3>

                <div className="d-flex justify-content-end pt-2">
                    <span 
                        onClick={ () => setToggleSettings(prevState => !prevState) }
                        className="btn btn-sm btn-outline-secondary border-radius-15 py-0">
                        <span>
                            {toggleSettings ? 'Close ' : 'Open '}   
                        </span>Settings Form
                    </span>
                </div>

                { toggleSettings && (
                    <section>
                        <form onSubmit={ handleSettingsUpdate } encType="multipart/form-data" id="user-profile-form">
                            <div className="profile-image row g-2 mt-3">
                                    <div className="mb-3 position-relative"> 
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="image-upload-input"
                                            style={{ display: 'none' }} 
                                            onChange={ (e) => { retrievedUser.setData({
                                                                    ...retrievedUser?.data,
                                                                    user_image: e.target.files[0], 
                                                                });
                                                                handleImageChange(e)} }
                                        />

                                        <div onClick={handleImageClick} className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px', backgroundColor: '#f0f0f0' }}>
                                            { (image || retrievedUser?.data?.user_image_path?.url) ? (
                                                <img src={image || retrievedUser?.data?.user_image_path?.url} alt="Preview" className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="#414141" className="bi bi-image" viewBox="0 0 16 16">
                                                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                                        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                                    </svg>
                                                </span>
                                            )}
                                        </div> 
                                    </div> 
                                </div> 
                            <div className="row">
                                <div className="form-floating mb-3 col-sm-12 col-md-6">
                                    <input 
                                        type="text" 
                                        id="first_name" 
                                        className="form-control" 
                                        value={ retrievedUser?.data?.first_name ?? '' }
                                        onChange={ e => retrievedUser.setData({
                                            ...retrievedUser?.data,
                                            first_name: e.target.value,
                                        }) } 
                                        placeholder="Nazim" />
                                    <label htmlFor="first_name">First Name</label>
                                </div>
                                <div className="form-floating mb-3 col-sm-12 col-md-6">
                                    <input 
                                        type="text" 
                                        id="last_name" 
                                        className="form-control" 
                                        value={ retrievedUser?.data?.last_name ?? '' }
                                        onChange={ e => retrievedUser.setData({
                                            ...retrievedUser?.data,
                                            last_name: e.target.value,
                                        }) } 
                                        placeholder="Doe" />
                                    <label htmlFor="last_name">Last Name</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-floating mb-3 col-sm-12 col-md-6">
                                    <input 
                                        type="text" 
                                        id="username" 
                                        className="form-control" 
                                        value={ retrievedUser?.data?.username ?? '' } 
                                        disabled
                                        placeholder="@user1" />
                                    <label htmlFor="username">Username</label>
                                </div>
                                <div className="form-floating mb-3 col-sm-12 col-md-6">
                                    <input 
                                        type="email" 
                                        id="email" 
                                        className="form-control" 
                                        value={ retrievedUser?.data?.email ?? '' }
                                        onChange={ e => retrievedUser.setData({
                                            ...retrievedUser?.data,
                                            email: e.target.value,
                                        }) } 
                                        placeholder="2025-01-23" />
                                    <label htmlFor="email">Email</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="mb-3 col-sm-12 col-md-6 d-flex align-items-center gap-1 px-3 mt-2">
                                    { (retrievedUser?.data?.receive_notifications == true) 
                                        ?   <span 
                                                type="button" 
                                                onClick={ () => {
                                                    retrievedUser.setData({
                                                        ...retrievedUser?.data,
                                                        receive_notifications: false,
                                                    })
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-on" viewBox="0 0 16 16">
                                                        <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8"/>
                                                    </svg>
                                            </span>
                                        : (retrievedUser?.data?.receive_notifications == false) 
                                            ?   <span 
                                                    type="button" 
                                                    onClick={ () => {
                                                        retrievedUser.setData({
                                                            ...retrievedUser?.data,
                                                            receive_notifications: true,
                                                        })
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-off" viewBox="0 0 16 16">
                                                            <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5"/>
                                                        </svg>
                                                </span>
                                                    : '' } 
                                    <span>Enable Notifications</span>
                                </div>
                                <div className="mb-3 col-sm-12 col-md-6 d-flex align-items-center gap-1 px-3 mt-2">
                                    { (retrievedUser?.data?.show_online_status == true) 
                                        ?   <span 
                                                type="button" 
                                                onClick={ () => {
                                                    retrievedUser.setData({
                                                        ...retrievedUser?.data,
                                                        show_online_status: false,
                                                    })
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-on" viewBox="0 0 16 16">
                                                        <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8"/>
                                                    </svg>
                                            </span>
                                        : (retrievedUser?.data?.show_online_status == false) 
                                            ?   <span 
                                                    type="button" 
                                                    onClick={ () => {
                                                        retrievedUser.setData({
                                                            ...retrievedUser?.data,
                                                            show_online_status: true,
                                                        })
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-off" viewBox="0 0 16 16">
                                                            <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5"/>
                                                        </svg>
                                                </span>
                                                    : '' } 
                                    <span>Show Online Status</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="mb-3 col-sm-12 col-md-6 d-flex align-items-center gap-1 px-3 mt-2">
                                    { (retrievedUser?.data?.verified == true) 
                                        ?   <span 
                                                type="button" 
                                                onClick={ () => {
                                                    retrievedUser.setData({
                                                        ...retrievedUser?.data,
                                                        verified: false,
                                                    })
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-on" viewBox="0 0 16 16">
                                                        <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8"/>
                                                    </svg>
                                            </span>
                                        : (retrievedUser?.data?.verified == false) 
                                            ?   <span 
                                                    type="button" 
                                                    onClick={ () => {
                                                        retrievedUser.setData({
                                                            ...retrievedUser?.data,
                                                            verified: true,
                                                        })
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-off" viewBox="0 0 16 16">
                                                            <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5"/>
                                                        </svg>
                                                </span>
                                                    : '' } 
                                    <span>Verification Badge</span>
                                </div>
                                <div className="mb-3 col-sm-12 col-md-6 d-flex align-items-center gap-1 px-3 mt-2">
                                    { (retrievedUser?.data?.banned == true) 
                                        ?   <span 
                                                type="button" 
                                                onClick={ () => {
                                                    retrievedUser.setData({
                                                        ...retrievedUser?.data,
                                                        banned: false,
                                                    })
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-on" viewBox="0 0 16 16">
                                                        <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8"/>
                                                    </svg>
                                            </span>
                                        : (retrievedUser?.data?.banned == false) 
                                            ?   <span 
                                                    type="button" 
                                                    onClick={ () => {
                                                        retrievedUser.setData({
                                                            ...retrievedUser?.data,
                                                            banned: true,
                                                        })
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-off" viewBox="0 0 16 16">
                                                            <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5"/>
                                                        </svg>
                                                </span>
                                                    : '' } 
                                    <span>Ban Status</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-floating mb-3 col-6">
                                    <select 
                                        id="role" 
                                        name="role" 
                                        className="form-select" 
                                        value={ retrievedUser?.data?.role ?? '' }
                                        onChange={ e => retrievedUser.setData({
                                            ...retrievedUser?.data,
                                            role: e.target.value,
                                        }) }
                                        placeholder="pending">
                                            <option value="" disabled={retrievedUser?.data?.role !== ''}>Choose one (modify) ...</option>
                                            <option value="super-admin">Super Admin</option>
                                            <option value="admin">Admin</option>
                                            <option value="general_practitioner">General Practitioner</option>
                                            <option value="gynaecologist">Gynaecologist</option> 
                                            <option value="nurse">Nurse</option> 
                                            <option value="laboratory_scientist">Laboratory Scientist</option> 
                                            <option value="patient">Patient</option> 
                                    </select>
                                    <label htmlFor="role">User Role</label>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end pt-3">
                                <button type="submit" className="btn btn-outline-secondary border-radius-25">Update</button>
                            </div>
                        </form>
                    </section> 
                ) }
            </section>
        </Layout>
    )
}
