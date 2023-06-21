import {useParams } from 'react-router-dom';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './elements/header';
import { useNavigate } from 'react-router-dom';

export default function Confirmation() {
    const { billId } = useParams();
    const navigate = useNavigate();

    //console.log(billId);
    const [formData, setFormData] = useState({
        patientName: '',
        address: '',
        hospitalName: '',
        dateOfService: '',
        billAmount: '',
        billImage: null,
    });
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

    const handleOkClick = () => {
        navigate('/home');
      };
    
      const handleEditClick = () => {
        navigate(`/billEdit/${billId}`)
      };

    return (
        <div>
            <Header />
            <div className="home-container">
                <div className="home-error">{errorMessage}</div>
                <div className="bill-container">
                    <div className="bill-info">
                        <div className="bill-info-item">
                            <div className="bill-info-item-label"><h3>Patient Name</h3> </div>
                            <div className="bill-info-item-value">{formData.patientName}</div>
                        </div>
                        <div className="bill-info-item">
                            <div className="bill-info-item-label"><h3>Address</h3></div>
                            <div className="bill-info-item-value">{formData.address}</div>
                        </div>
                        <div className="bill-info-item">

                            <div className="bill-info-item-label"><h3>Hospital Name</h3></div>
                            <div className="bill-info-item-value">{formData.hospitalName}</div>
                        </div>
                        <div className="bill-info-item">
                            <div className="bill-info-item-label"><h3>Date of Service</h3></div>
                            <div className="bill-info-item-value">{formData.dateOfService}</div>
                        </div>
                        <div className="bill-info-item">
                            <div className="bill-info-item-label"><h3>Bill Amount</h3></div>
                            <div className="bill-info-item-value">{formData.billAmount}</div>
                        </div>
                        <div className="bill-info-buttons">
                            <button className="button-spacing" onClick={handleOkClick}>OK</button>
                            <button className="button-spacing"onClick={handleEditClick}>EDIT</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
