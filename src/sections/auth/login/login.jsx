import { useState } from 'react';
import { Lock, User } from 'lucide-react';

export default function Login() {
    const [userType, setUserType] = useState('patient');
    const [patientCredentials, setPatientCredentials] = useState({
        healthID: '',
        password: '',
    })

    const [doctorCredentials, setDoctorCredentials] = useState({
        licenseNumber: '',
        password: '',
    })

    const [dispensaryCredentials, setDispensaryCredentials] = useState({
        licenseNumber: '',
        password: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (userType === 'patient') {
            setPatientCredentials((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else if (userType === 'doctor') {
            setDoctorCredentials((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else if (userType === 'dispensary') {
            setDispensaryCredentials((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("User Type: ", userType);
        if(userType == 'patient'){
            console.log(patientCredentials);
        } else if (userType == 'doctor'){
            console.log(doctorCredentials);
        } else {
            console.log(dispensaryCredentials);
        }
    };

    const getPlaceholder = () => {
        switch (userType) {
            case 'patient':
                return 'National Health ID (ABHA ID)';
            case 'doctor':
                return 'Medical License Number';
            case 'dispensary':
                return 'Business License Number';
            default:
                return 'ID';
        }
    };

    return (
        <div className="h-screen w-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-albulaHeavy">
                            <div>Login as</div>
                            <div className={`uppercase mt-2 ${ userType === 'patient' ? 'text-green-400' : userType === 'doctor' ? 'text-yellow-400' : 'text-red-400' }`}>
                                {userType}
                            </div>
                        </h1>
                    </div>

                    <div className="flex rounded-full bg-gray-100 p-1">
                        {['patient', 'doctor', 'dispensary'].map((type) => (
                            <button key={type} className={`w-full text-sm font-albulaBold px-6 py-3 rounded-full transition-colors ${ userType === type ? type === 'patient' ? 'bg-green-400 text-white shadow' : type === 'doctor' ? 'bg-yellow-400 text-white shadow' : 'bg-red-400 text-white shadow' : 'text-gray-500 hover:text-gray-900' }`} onClick={() => setUserType(type)} >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name={userType === 'patient' ? 'healthID' : 'licenseNumber'}
                                value={
                                    userType === 'patient'
                                        ? patientCredentials.healthID
                                        : userType === 'doctor'
                                        ? doctorCredentials.licenseNumber
                                        : dispensaryCredentials.licenseNumber
                                }
                                onChange={handleInputChange}
                                placeholder={getPlaceholder()}
                                className="w-full pl-14 pr-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                            />

                        </div>

                        <div className="relative">
                            <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                name="password"
                                value={userType == 'patient' ? patientCredentials.password : userType == 'doctor' ? doctorCredentials.password : dispensaryCredentials.password}
                                onChange={handleInputChange}
                                placeholder="Password"
                                className="w-full pl-14 pr-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                            />
                        </div>

                        <div>
                            <button type="submit" className="w-full mt-5 bg-gray-900 text-white px-4 py-3 rounded-full font-albulaBold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all ease-in-out duration-200" >
                                <div className="flex items-center justify-center">
                                    <span>Login</span>
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        </div>

                        <div className="text-center text-sm text-gray-500 font-albulaMedium">
                            <span>New <span className='capitalize'>{userType}</span>?{' '}</span>
                            <a href="/register" className="text-gray-900 hover:underline">Register Here</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}