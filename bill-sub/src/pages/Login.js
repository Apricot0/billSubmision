import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

export default function Login() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVerification, setPasswordVerification] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.post('http://localhost:8000/login')
          .then(res => {
            if (res.data.status === 'SESSION') {
              setIsLoggedIn(true);
            }
            console.log("from welcome", res);
          })
          .catch(error => {
            console.error('Error during login request:', error);
            setErrorMessage('Network Error during login request');
          });
      }, []);

    const handleRegister = async () => {
        console.log('Registering user...');
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Password Verification:', passwordVerification);

        if (password !== passwordVerification) {
            setErrorMessage('Password and Confirm Password do not match');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Invalid email format');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/register', {
                username,
                email,
                password,
            });

            if (response.status === 200) {
                setErrorMessage('Registration successful');

                setSelectedOption('login');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(`Registration failed: ${error.response.data.message}`);
            } else {
                setErrorMessage('Registration failed due to server error. Please try again.');
            }
        }
    };


    const handleLogin = async () => {
        console.log('Logging in user...');
        console.log('Email:', email);
        console.log('Password:', password);

        try {
            const response = await axios.post('http://localhost:8000/login', {
                email,
                password,
            });

            if (response.status === 200) {
                console.log(response)
                document.cookie = "isLoggedIn=true";
                console.log(response.data.user);
                document.cookie = "username=" + response.data.user;
                setIsLoggedIn(true);
                setErrorMessage('Login successful');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(`Login failed: ${error.response.data.message}`);
            } else {
                setErrorMessage('Login failed due to server error. Please try again.');
            }
        }
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        setErrorMessage('');
    };

    if (isLoggedIn) {
        navigate('/home');
    } else {
        return (

            <div className="page_container">
                <div className="welcome_page">
                    <h1>Welcome to the Bill Submission</h1>
                    <p>Please select an option:</p>

                    <select value={selectedOption} onChange={handleOptionChange}>
                        <option value="">Select an option</option>
                        <option value="register">Register as a new user</option>
                        <option value="login">Login as an existing user</option>
                    </select>

                    {selectedOption === 'register' && (
                        <div className="form-container">
                            <h2>Register as a new user</h2>
                            <input className="input" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                            <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                            <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                            <input
                                className="input"
                                type="password"
                                placeholder="Confirm Password"
                                value={passwordVerification}
                                onChange={e => setPasswordVerification(e.target.value)}
                            />
                            <button className='botButton' onClick={handleRegister}>Sign Up</button>
                        </div>
                    )}

                    {selectedOption === 'login' && (
                        <div className="form-container">
                            <h2>Login as an existing user</h2>
                            <input className="input" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                            <input className="input" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                            <button className='botButton' onClick={handleLogin}>Login</button>
                        </div>
                    )}
                    <p className='welcome_error'>{errorMessage}</p>
                </div>
            </div>
        );
    }

}