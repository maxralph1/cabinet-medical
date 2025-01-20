import { useContext, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Layout from '@/components/auth/Layout.jsx'; 


export default function SignUpAsStaff() {
    const [username, setUsername] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [firstName, setFirstName] = useState(''); 
    const [lastName, setLastName] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [passwordRepeat, setPasswordRepeat] = useState(''); 
    const [accountType, setAccountType] = useState('');

    console.log('account type:', accountType); 

    let { signUp } = useContext(AuthContext); 

    const handleSubmit = async e => {
        e.preventDefault(); 

        if (password != passwordRepeat) {
            swal.fire({
                text: 'Passwords do not match', 
                color: "#900000",
                width: 300,
                position: 'top',
                showConfirmButton: false,
            });
        } else if (password == passwordRepeat) { 
            let account_type; 
            signUp(username, email, firstName, lastName, password, account_type = (accountType || 'patient')); 
        }
    }

    return (
        <Layout>
            <section className="auth-form col-sm-12 col-md-6 d-flex flex-column justify-content-center py-2 gap-3">
                <div className="d-flex flex-column align-items-center gap-3">
                    <span>Logo</span>
                    <h2>Staff Sign Up</h2>
                </div>
                <form onSubmit={ handleSubmit } id="auth-form" className="auth-form">
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="text" 
                                id="first_name" 
                                className="form-control" 
                                onChange={ e => setFirstName(e.target.value) } 
                                placeholder="Max" />
                            <label htmlFor="first_name">First Name</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="text" 
                                id="last_name" 
                                className="form-control" 
                                onChange={ e => setLastName(e.target.value) } 
                                placeholder="Ralph" />
                            <label htmlFor="last_name">Last Name</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="text" 
                                id="username" 
                                className="form-control" 
                                onChange={ e => setUsername(e.target.value) } 
                                placeholder="maxralph" />
                            <label htmlFor="username">Username</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="email" 
                                id="email" 
                                className="form-control" 
                                onChange={ e => setEmail(e.target.value) } 
                                placeholder="max@ralph.com" />
                            <label htmlFor="email">Email</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="password" 
                                id="password" 
                                className="form-control" 
                                onChange={ e => setPassword(e.target.value) } 
                                placeholder="Pfizer" />
                            <label htmlFor="password">Password</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="password" 
                                id="repeat_password" 
                                className="form-control" 
                                onChange={ e => setPasswordRepeat(e.target.value) } 
                                placeholder="China" />
                            <label htmlFor="repeat_password">Repeat Password</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <select 
                                id="account_type" 
                                className="form-select" 
                                onChange={ e => setAccountType(e.target.value) } 
                                placeholder="Nurse">
                                    <option>Choose one ...</option>
                                    <option value="general_practitioner">General Practitioner</option>
                                    <option value="gynaecologist">Gynaecologist</option> 
                                    <option value="nurse">Nurse</option> 
                                    <option value="laboratory_scientist">Laboratory Scientist</option> 
                            </select>
                            <label htmlFor="account_type">Account Type</label>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pt-3">
                        <button type="submit" className="btn btn-outline-secondary border-radius-25">Sign Up</button>
                    </div>
                </form>

                <section className="auth-options px-5 pt-3 gap-3 d-flex flex-column align-items-center gap-3"> 
                    <span className="">
                        <Link to={ route('sign-in')} className="text-dark fw-bold">Sign in</Link>&nbsp;if you already have an account
                    </span> 
                    <span className="">
                        Forgot your password?<Link to={ route('password-reset-request') } className="text-dark fw-bold">&nbsp;
                        Reset Password</Link>
                    </span> 
                </section>
            </section>
        </Layout>
    )
}
