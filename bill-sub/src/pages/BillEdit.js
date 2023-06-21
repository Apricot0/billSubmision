import { useParams } from 'react-router-dom';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './elements/header';
import { useNavigate } from 'react-router-dom';

export default function BillEdit() {
    const { billId } = useParams();
    //console.log(billId);
    const [formData, setFormData] = useState({
        patientName: '',
        address: '',
        hospitalName: '',
        dateOfService: '',
        billAmount: '',
        billImage: null,
    });
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios
            .get(`http://localhost:8000/bills/${billId}`)
            .then((response) => {
                const existingData = {
                    patientName: response.data.patient,
                    address: response.data.address,
                    hospitalName: response.data.hospital,
                    dateOfService: response.data.date.substring(0, 10),
                    billAmount: response.data.amount,
                    billImage: null,
                }
                console.log('Existing data:', existingData);
                setFormData(existingData);
            })
            .catch((error) => {
                console.error('Error fetching existing data:', error);
                setErrorMessage('Error: Failed to fetch existing data from the server.');
            });
    }, [billId]);


    // Use `billId` to fetch the specific bill data or perform any other operations

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
        console.log(postData);
        console.log(formData);

        axios
            .post(`http://localhost:8000/modify_bill/${billId}`, formData)
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
                                required
                            />
                        </label>
                    </div>
                    <button type="submit">Confirm Changes</button>
                    <button onClick={() => navigate('/home')}>Cancel</button>
                    <div className="home-error">{errorMessage}</div>
                </div>

            </form>
        </div>
    );
}

