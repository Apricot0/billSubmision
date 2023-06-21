import { useState } from 'react'
import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

export default function Header() {
    const isLoggedIn = document.cookie.includes('isLoggedIn=true');
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate();

    function handleLogout() {
        // Clear the login cookie and redirect to the login page
        setErrorMessage('');
        axios.post('http://localhost:8000/logout')
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    document.cookie = 'isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    window.location.href = '/';
                } else setErrorMessage('Logout failed due to server error. Please try again.');
            });
        // Redirect to the login page or home page
    }

    function handleHome() {
        navigate('/home');
        // Redirect to the login page or home page
    }
    function handleSubmit() {
        navigate('/submission');
        // Redirect to the login page or home page
    }

    return (
        <div className="header-container">
            <div className="title"><h1>Bill Control</h1></div>
            <div className="info">
                {isLoggedIn && <p>Hello, {document.cookie.split(';').find(cookie => cookie.trim().startsWith('username=')).split('=')[1]} </p>}
                <div className="menu">
                    {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
                    {isLoggedIn && <button onClick={handleHome}>Home</button>}
                    {isLoggedIn && <button onClick={handleSubmit}>Add a bill</button>}
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
        </div>

    )
}