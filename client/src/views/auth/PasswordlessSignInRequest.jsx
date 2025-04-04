import { useContext, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Layout from '@/components/auth/Layout.jsx'; 
import Logo from '@/assets/images/logo.jpg';  


export default function PasswordlessSignInRequest() {
    const [username, setUsername] = useState(''); 

    let { passwordlessSignInRequest } = useContext(AuthContext); 

    const handleSubmit = async e => {
        e.preventDefault(); 

        passwordlessSignInRequest(username); 
    }

    return (
        <Layout>
            <section className="auth-form col-sm-12 col-md-6 d-flex flex-column justify-content-center py-2 gap-3">
                <div className="d-flex flex-column align-items-center gap-3">
                    <span className="" style={{ width: '100px', height: '100px' }}>
                        <img src={ Logo } alt="Logo" className="h-100 w-100 object-fit-cover border-radius-15" />
                    </span>
                    <h2>Passwordless SignIn</h2>
                </div>
                <form onSubmit={ handleSubmit } id="auth-form" className="auth-form">
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-12">
                            <input 
                                type="text" 
                                id="username" 
                                className="form-control" 
                                onChange={ e => setUsername(e.target.value) } 
                                placeholder="maxralph" />
                            <label htmlFor="username">Username</label>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pt-3">
                        <button type="submit" className="btn btn-outline-secondary border-radius-25">Sign In</button>
                    </div>
                </form>

                <section className="auth-options px-1 pt-3 gap-3 d-flex flex-column align-items-sm-start align-items-md-center gap-3">
                    <span className=""><Link to={ route('sign-up') } className="text-dark fw-bold">Sign Up</Link>&nbsp;if you do not already have an account</span> 
                    <span className="">Forgot your password?<Link to={ route('password-reset-request') } className="text-dark fw-bold">&nbsp;Reset Password</Link></span> 
                </section>
            </section>
        </Layout>
    )
} 