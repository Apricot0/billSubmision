import React, { useState } from 'react';
import axios from 'axios';
import Header from './elements/header';
import { useNavigate } from 'react-router-dom';
import FormData from 'form-data';

const FormPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        patientName: '',
        address: '',
        hospitalName: '',
        dateOfService: '',
        billAmount: '',
        billImage: null,
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        if (e.target.name === 'billImage') {
            setFormData({
                ...formData,
                [e.target.name]: e.target.files[0],
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const postData = new FormData();
        postData.append('patientName', formData.patientName);
        postData.append('address', formData.address);
        postData.append('hospitalName', formData.hospitalName);
        postData.append('dateOfService', formData.dateOfService);
        postData.append('billAmount', formData.billAmount);
        postData.append('billImage', formData.billImage);
        // Log the contents of the FormData object
        for (const entry of postData.entries()) {
            console.log("post data", entry);
        }
        console.log(formData);

        axios
            .post('http://localhost:8000/post_bill', formData)
            //.post('http://localhost:8000/post_bill', postData, {
            //    headers: {
            //     'content-type': 'multipart/form-data'
            //    }})
            .then((res) => {
                console.log('Form submitted successfully:', res);
                console.log("res ID", res);
                navigate(`/billConfirm/${res.data._id}`);
            })
            .catch((error) => {
                console.error('Error during form submission:', error);
                setErrorMessage('Error: Failed to submit form due to server. Please try again.');
            });
    };

    return (

        <div>
            <Header />
            <form onSubmit={handleSubmit}>
                <div className="form-container">
                    <div className="input">
                        <label>
                            Patient Name:
                            <input
                                type="text"
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="input">
                        <label>
                            Address:
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="input">
                        <label>
                            Hospital Name:
                            <input
                                type="text"
                                name="hospitalName"
                                value={formData.hospitalName}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="input">
                        <label>
                            Date of Service:
                            <input
                                type="date"
                                name="dateOfService"
                                value={formData.dateOfService}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="input">
                        <label>
                            Bill Amount:
                            <input
                                type="number"
                                name="billAmount"
                                value={formData.billAmount}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="input">
                        <label>
                            Bill Image:
                            <input
                                type="file"
                                name="billImage"
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <button type="submit">Submit</button>
                    <button onClick={() => navigate('/home')}>Cancel</button>
                    <div className="home-error">{errorMessage}</div>
                </div>

            </form>
        </div>

    );
};

export default FormPage;