import React from 'react';
import { useLocation } from 'react-router-dom';

function PatientProfileBuilderForm() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const healthId = queryParams.get('healthId');

    return (
        <>
            <h1>Patient Profile Builder Form</h1>
        </>
    );
}

export default PatientProfileBuilderForm;