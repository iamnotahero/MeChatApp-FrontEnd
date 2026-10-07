import { useState } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'

import signinImage from '../assets/signup.jpg'

const cookies = new Cookies();

const initialState = {
    fullName: '',
    userName: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    avatarURL: '',
}
const Auth = () => {
    const [form, setForm] = useState(initialState);
    const [avatarFile, setAvatarFile] = useState(null);
    const [isSignup, setIsSignup] = useState(true);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name] : e.target.value})

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {userName, password, phoneNumber, avatarURL} = form;
        
        const URL = 'http://localhost:5000/auth';
        console.log('Form data:', form); // Log the form data to the console
        console.log('Avatar file:', avatarFile); // Log the avatar file to the console
       
        // const { data: { token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
        //     userName, password, fullName: form.fullName, phoneNumber, avatarURL 
        // }); 
        const data = new FormData();
        data.append('fullName', form.fullName);
        data.append('userName', form.userName);
        data.append('password', form.password);
        data.append('phoneNumber', form.phoneNumber);

        if (avatarFile) data.append('avatarURL', avatarFile);

        const response = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, data);
        console.log('Server response:', response.data); // Log the server response to the console
         cookies.set('token', response.data.token);
        cookies.set('userName', response.data.userName);
        cookies.set('fullName', response.data.fullName);
        cookies.set('userId', response.data.userId);

        if(isSignup){
            cookies.set('phoneNumber', phoneNumber);
            cookies.set('avatarURL', response.data.avatarURL);
            cookies.set('hashedPassword', response.data.hashedPassword);
        }

        //window.location.reload();
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup)
    }
  return (
    <div className="auth__form-container">
        <div className="auth__form-container_fields">
            <div className="auth__form-container_fields-content">
                <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                name="fullName"
                                type="text"
                                placeholder="Full Name"
                                onChange={handleChange}
                                required
                                />
                        </div>
                    )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="userName">Username</label>
                            <input
                                name="userName"
                                type="text"
                                placeholder="Username"
                                onChange={handleChange}
                                required
                                />
                        </div> 
                        {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input
                                name="phoneNumber"
                                type="text"
                                placeholder="Phone Number"
                                onChange={handleChange}
                                required
                                />
                        </div>
                        )}                                           
                        {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="avatarURL">Avatar URL</label>
                                <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
                                />
                        </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="password">Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                                />
                        </div> 
                        {isSignup && (                                                                 
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                onChange={handleChange}
                                required
                                />
                        </div> 
                        )}
                        <div className='auth__form-container_fields-content_button'>
                            <button>{isSignup ? "Sign Up" : "Sign In"}</button>
                        </div>                                                               
                </form>
                <div className='auth__form-container_fields-account'>
                    <p>
                        {isSignup
                            ? "Already have an account?"
                            : "Don't have an account"
                        }

                        <span onClick={switchMode}> 
                        {isSignup ? 'Sign In' : 'Sign Up'}
                        
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div className='auth__form-container_image'>
            <img src={signinImage} alt='Sign in' />
        </div>
    </div>
  )
}

export default Auth