import React from 'react';
import { useLocation } from 'react-router-dom';

function DoctorProfileBuilderForm() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const licenseNumber = queryParams.get('licenseNumber');

    return (
        <>
            <h1>Doctor Profile Builder Form</h1>
        </>
    );
}

export default DoctorProfileBuilderForm;