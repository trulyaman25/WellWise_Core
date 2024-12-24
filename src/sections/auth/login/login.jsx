import { useState } from 'react';
import { Lock, User } from 'lucide-react';
import Web3 from 'web3';
import PatientRegistration from "../../../build/contracts/PatientRegistration.json";
import DoctorRegistration from "../../../build/contracts/DoctorRegistration.json";
import DispensaryRegistration from "../../../build/contracts/DiagnosticRegistration.json";
import { useNavigate } from "react-router-dom";

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

    const navigate = useNavigate();
    const [isRegistered, setIsRegistered] = useState(false);

    const handlePatientSubmit = async (e) => {
        e.preventDefault();
    
        const patientHealthID = patientCredentials.healthID;
        const patientPassword = patientCredentials.password;
    
        try {
            console.log("Starting the Login process...");
    
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = PatientRegistration.networks[networkId];
            const contract = new web3.eth.Contract(
                PatientRegistration.abi,
                deployedNetwork && deployedNetwork.address
            )
    
            console.log("Patient Health ID:", patientHealthID);
            console.log("Patient Password:", patientPassword);
    
            const isRegisteredResult = await contract.methods
                .isRegisteredPatient(patientHealthID)
                .call();
            console.log("Is Registered Result:", isRegisteredResult);
    
            setIsRegistered(isRegisteredResult);
    
            if (isRegisteredResult) {
                console.log("Patient is registered, checking password...");
    
                const isValidPassword = await contract.methods
                    .validatePassword(patientHealthID, patientPassword)
                    .call();
                console.log("Is Valid Password:", isValidPassword);
    
                if (isValidPassword) {
                    const fetchPatientDetails = await contract.methods
                        .getPatientDetails(patientHealthID)
                        .call();
                    console.log("Patient details:", fetchPatientDetails);
                    console.log('Logged In');
                } else {
                    alert("Incorrect password");
                    console.log("Password validation failed");
                }
            } else {
                alert("Patient not registered");
                console.log("Patient not registered");
            }
        } catch (error) {
            console.error("Error checking registration:", error);
            alert("An error occurred while checking registration.");
        }
    };

    const [doctorDetails, setDoctorDetails] = useState(null);

    const handleDoctorSubmit = async (e) => {
        e.preventDefault();
    
        const doctorLicenceNumber = doctorCredentials.licenseNumber;
        const doctorPassword = doctorCredentials.password;
    
        try {
            console.log("Starting the doctor login process...");
    
            const web3 = new Web3(window.ethereum);    
            const networkId = await web3.eth.net.getId();    
            const deployedNetwork = DoctorRegistration.networks[networkId];    
            const contract = new web3.eth.Contract(
                DoctorRegistration.abi,
                deployedNetwork && deployedNetwork.address
            );
    
            console.log("Doctor License Number:", doctorLicenceNumber);
            console.log("Doctor Password:", doctorPassword);
    
            const isRegisteredResult = await contract.methods
                .isRegisteredDoctor(doctorLicenceNumber)
                .call();
            console.log("Is Registered Doctor:", isRegisteredResult);
    
            setIsRegistered(isRegisteredResult);
    
            if (isRegisteredResult) {
                console.log("Doctor is registered, validating password...");
    
                const isValidPassword = await contract.methods
                    .validatePassword(doctorLicenceNumber, doctorPassword)
                    .call();
                console.log("Is Valid Password:", isValidPassword);
    
                if (isValidPassword) {
                    console.log("Password is valid. Fetching doctor details...");
                    const fetchDoctorDetails = await contract.methods
                        .getDoctorDetails(doctorLicenceNumber)
                        .call();

                    setDoctorDetails(fetchDoctorDetails);
                    console.log("Doctor details:", doctorDetails);
                    console.log('Logged In');
                } else {
                    console.log("Password validation failed.");
                    alert("Incorrect password");
                }
            } else {
                console.log("Doctor not registered.");
                alert("Doctor not registered");
            }
        } catch (error) {
            console.error("Error during doctor login process:", error);
            alert("An error occurred while checking registration.");
        }
    };

    const [dispensaryDetails, setDispensaryDetails] = useState(null);
    
    const handleDispensarySubmit = async (e) => {
        e.preventDefault();
    
        const dispensaryLicenceNumber = dispensaryCredentials.licenseNumber;
        const dispensaryPassword = dispensaryCredentials.password;
    
        try {
            console.log("Starting the dispensary login process...");
    
            const web3 = new Web3(window.ethereum);    
            const networkId = await web3.eth.net.getId();    
            const deployedNetwork = DispensaryRegistration.networks[networkId];
    
            const contract = new web3.eth.Contract(
                DispensaryRegistration.abi,
                deployedNetwork && deployedNetwork.address
            );

            console.log("Dispensary License Number:", dispensaryLicenceNumber);
            console.log("Dispensary Password:", dispensaryPassword);
    
            console.log("Checking if dispensary is registered...");
            const isRegisteredResult = await contract.methods
                .isRegisteredDiagnostic(dispensaryLicenceNumber)
                .call();
            console.log("Is Registered Diagnostic:", isRegisteredResult);
    
            setIsRegistered(isRegisteredResult);
    
            if (isRegisteredResult) {
                console.log("Dispensary is registered. Validating password...");
                const isValidPassword = await contract.methods
                    .validatePassword(dispensaryLicenceNumber, dispensaryPassword)
                    .call();
                console.log("Is Valid Password:", isValidPassword);
    
                if (isValidPassword) {
                    console.log("Password is valid. Fetching dispensary details...");
                    const diagnostic = await contract.methods
                        .getDiagnosticDetails(dispensaryLicenceNumber)
                        .call();
                    
                    setDispensaryDetails(diagnostic);
                    console.log("Dispensary Details:", dispensaryDetails);
                    console.log('Logged In');
                } else {
                    console.log("Invalid password provided.");
                    alert("Incorrect password");
                }
            } else {
                console.log("Dispensary not registered.");
                alert("Diagnostic not registered");
            }
        } catch (error) {
            console.error("Error during login process:", error);
            alert("An error occurred while checking registration.");
        }
    };
    
    

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

                    <form onSubmit={userType == 'patient' ? handlePatientSubmit : userType == 'doctor' ? handleDoctorSubmit : handleDispensarySubmit} className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name={userType === 'patient' ? 'healthID' : 'licenseNumber'}
                                value={userType === 'patient'
                                    ? patientCredentials.healthID
                                    : userType === 'doctor'
                                    ? doctorCredentials.licenseNumber
                                    : dispensaryCredentials.licenseNumber}
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
                            <button type="submit" className="w-full mt-5 bg-gray-900 text-white px-4 py-3 rounded-full font-albulaBold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all ease-in-out duration-200">
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