import React from 'react';
import Header from './elements/header';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Bill from './elements/bill';
export default function Home() {
  //const isLoggedIn = document.cookie.includes('isLoggedIn=true');
  const [bills, setBills] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/bills`)
        console.log("bills", response.data);
        setBills(response.data)
      } catch (error) {
        console.error(error)
        setErrorMessage('Error: Failed to fetch bills. Please try again.')
      }
    }
    fetchBills()
  }, [])

  let billItems
  if (bills.length === 0) {
    billItems = (
      <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }}>
        No Bills
      </p>
    )
  } else {
    billItems = bills.map((bill) => (
      <div key={bill._id}>
        <Bill info={bill} />
      </div>
    ))
  }
  return (
    <div>
      <Header />
      <div className="home-container">
        <div className="home-error">{errorMessage}</div>
        {billItems}
      </div>
    </div>
  );
}