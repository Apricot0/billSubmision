import React from "react";
import { Link } from 'react-router-dom';

export default function Bill({ info }) {
    const formattedDate = info.date.substring(0, 10);
    return (
        <div className="bill-comp">
            <div className="bill-main">
            <Link to={`/billConfirm/${info._id}`}>
                <h3>{formattedDate}</h3>
                <h3>Amount: {info.amount}</h3>
                </Link>
            </div>
            <div className="bill-patient">
                <p>Hospital: {info.hospital}</p>
                <p>Patient: {info.patient}</p>
                <p>Address: {info.address}</p>
            </div>
        </div>
    );
}