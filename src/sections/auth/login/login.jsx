import { useState } from 'react';
import PatientLogin from './forms/patientForm';
import DoctorLogin from './forms/doctorForm';
import DispensaryLogin from './forms/dispensaryForm';

function Login() {
    const [userType, setUserType] = useState('patient');
    const [isRegistered, setIsRegistered] = useState(false);
    const [patientDetails, setPatientDetails] = useState(null);
    const [doctorDetails, setDoctorDetails] = useState(null);
    const [dispensaryDetails, setDispensaryDetails] = useState(null);

    return (
        <div className="h-screen w-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-albulaHeavy">
                            <div>Login as</div>
                            <div className={`uppercase mt-2 ${userType === 'patient' ? 'text-green-400' : userType === 'doctor' ? 'text-yellow-400' : 'text-red-400'}`}>
                                {userType}
                            </div>
                        </h1>
                    </div>

                    <div className="flex rounded-full bg-gray-100 p-1">
                        {['patient', 'doctor', 'dispensary'].map((type) => (
                            <button key={type} className={`w-full text-sm font-albulaBold px-6 py-3 rounded-full transition-colors ${userType === type ? type === 'patient' ? 'bg-green-400 text-white shadow' : type === 'doctor' ? 'bg-yellow-400 text-white shadow' : 'bg-red-400 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`} onClick={() => setUserType(type)}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    {userType === 'patient' && (
                        <PatientLogin setIsRegistered={setIsRegistered} setPatientDetails={setPatientDetails} />
                    )}
                    {userType === 'doctor' && (
                        <DoctorLogin setIsRegistered={setIsRegistered} setDoctorDetails={setDoctorDetails} />
                    )}
                    {userType === 'dispensary' && (
                        <DispensaryLogin setIsRegistered={setIsRegistered} setDispensaryDetails={setDispensaryDetails} />
                    )}
                </div>

                <div className="text-center text-sm text-gray-500 font-albulaMedium mt-5">
                    <span>New <span className='capitalize'>{userType}</span>?{' '}</span>
                    <a href="/register" className="text-gray-900 hover:underline">Register Here</a>
                </div>
            </div>
        </div>
    );
}

export default Login;