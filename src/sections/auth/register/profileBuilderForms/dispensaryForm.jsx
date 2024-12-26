import React from 'react';
import { useLocation } from 'react-router-dom';

function DispensaryProfileBuilderForm () {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const licenseNumber = queryParams.get('licenseNumber');

    return (
        <>
            <h1>Dispensary Profile Builder Form</h1>
        </>
    )
};

export default DispensaryProfileBuilderForm;