import { Link, useLocation } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 


export default function UserComponent({ index, users, user }) {
    const location = useLocation(); 
    const results_limit = 10;

    return (
        <li key={ user?._id } className="user w-100 border border-1 border-radius-25 d-flex flex-column px-3 py-4">
            <span className="">#
                { (users?.meta?.current_page != 1) 
                    ? (((users?.meta?.current_page - 1) * results_limit) + (index + 1))
                    : users?.meta?.current_page * (index + 1) }
            </span>

            <section className="doctor-patient d-flex justify-content-start gap-4 flex-wrap pt-3">
                <picture>
                    <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" media="(orientation: portrait)" />
                    <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" className="object-fit-cover border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                </picture>
                <div className="d-flex flex-column">
                    <span className="fw-semibold">
                        <Link 
                            to={ (location.pathname == route('home.professionals.index')) 
                                ? route('home.professionals.show', { id: user?._id })
                                : route('home.patients.show', { id: user?._id }) }>
                            { (((user?.role == 'general_practitioner') || (user?.role == 'gynaecologist')) 
                                ? 'Dr. ' : '') }
                            { user.first_name + ' ' + user?.last_name }
                        </Link>
                    </span>

                    { (location.pathname == route('home.professionals.index')) && (
                        <span>{ ((user?.role == 'general_practitioner')
                                    ? 'General Practioner' 
                                        : (user?.role == 'gynaecologist') 
                                        ? 'Gynaecologist' 
                                            : (user?.role == 'laboratory_scientist') 
                                            ? 'Laboratory Scientist' 
                                                : (user?.role == 'nurse')
                                                ? 'Nurse' 
                                                    : '' ) }
                        </span> 
                    ) }
                </div>
            </section>
            <section className="schedule w-100 d-flex justify-content-end align-items-center gap-1 flex-wrap pt-3">
                <small className="text-secondary">Account created:&nbsp;</small><span>{ dayjs.utc(user?.created_at).fromNow() }</span>
            </section>
        </li>
    )
}
