import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 


export default function UserProfileComponent({ retrievedUser, image }) {
    return (
        <section className="personal-information pt-3">
            <h3 className="fs-4 border-bottom pb-1 mb-4 d-inline-block">Personal Information</h3>
            <div className="w-100 row row-gap-4">
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
                    { (retrievedUser?.data?.role != 'patient') && (
                        <div className="d-flex justify-content-between">
                            <p className="fw-semibold">Role:</p>
                            <p>{ (retrievedUser?.data?.role == 'general_practitioner') ? 'General Practitioner'
                                : (retrievedUser?.data?.role == 'gynaecologist') ? 'Gynaecologist'
                                : (retrievedUser?.data?.role == 'nurse') ? 'Nurse'
                                : (retrievedUser?.data?.role == 'laboratory_scientist') ? 'Laboratory Scientist'
                                : (retrievedUser?.data?.role == 'admin') ? 'Admin'
                                : (retrievedUser?.data?.role == 'super-admin') ? 'Super-Admin'
                                : '' }</p>
                        </div> 
                    ) }

                    { (retrievedUser?.data?.last_login_time) && (
                        <>
                            <div className="d-flex justify-content-between mb-0" style={{ fontSize: 'small' }}>
                                <p className="fw-semibold mb-0">Last Login:</p>
                                <p className="mb-0">{ dayjs(retrievedUser?.data?.last_login_time)?.format('MMMM DD, YYYY, HH:mm') }</p>
                            </div>
                            <div className="d-flex justify-content-end" style={{ fontSize: 'small' }}>
                                <div className="fw-semibold">
                                    { (dayjs()?.diff(retrievedUser?.data?.last_login_time, 'hour') > 4) 
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
                        </>
                    ) }
                </section>

                <section className="col-sm-12 col-md-6 order-1 order-md-2 px-3">
                    { (retrievedUser?.data?.user_image_path?.url) ? (
                        <picture className="w-100">
                            <source srcSet={retrievedUser?.data?.user_image_path?.url}
                                media="(orientation: portrait)" />
                            <img src={retrievedUser?.data?.user_image_path?.url}
                                className="object-fit-cover border border-1 border-secondary border-radius-25 d-block" 
                                style={{ width: '150px', height: '150px' }} alt="" />
                        </picture>
                    ) : (
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="#414141" className="bi bi-image" viewBox="0 0 16 16">
                                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                            </svg>
                        </span>
                    )}
                    
                </section>
            </div>
        </section>
    )
}
