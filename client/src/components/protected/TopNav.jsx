import { useContext } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx';
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 


export default function TopNav() {
    const { signOut } = useContext(AuthContext); 

    return (
        <nav className="main-nav">
            <ul className="nav-list list-unstyled d-flex flex-column gap-2 align-items-end">
                <li className="fw-semibold">
                    <Link to={ route('home.index') }>
                        Home
                    </Link>
                </li>
                <li className="fw-semibold">
                    <Link to={ route('home.appointments.index') }>
                        Appointments
                    </Link>
                </li>
                <li className="fw-semibold">
                    <Link to={ route('home.regimens.index') }>
                        Regimens
                    </Link>
                </li>
                <li className="fw-semibold">
                    <Link to={ route('home.patients.index') }>
                        Patients
                    </Link>
                </li>
                <li className="fw-semibold">
                    <Link to={ route('home.professionals.index') }>
                        Professionals
                    </Link>
                </li>
                <li className="fw-semibold">
                    <Link to={ route('home.departments.index') }>
                        Departments
                    </Link>
                </li>
                <li className="fw-semibold">
                    <Link to={ route('home.inventory.index') }>
                        Inventory
                    </Link>
                </li>
                <li className="fw-semibold">
                    <Link to={ route('home.settings.index') }>
                        Settings
                    </Link>
                </li>
                <li 
                    onClick={ signOut }
                    className="text-danger cursor-pointer">Sign Out</li>
            </ul>
        </nav>
    )
}
