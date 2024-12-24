import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import PatientRegistration from '../../../build/contracts/PatientRegistration.json';
import PatientForm from './forms/patientForm';
import DoctorForm from './forms/doctorForm';
import DispensaryForm from './forms/dispensaryForm';

export default function Register() {
    const [userType, setUserType] = useState('patient');
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    setWeb3(web3Instance);

                    const accounts = await web3Instance.eth.getAccounts();
                    console.log("Connected account:", accounts[0]);

                    const networkId = await web3Instance.eth.net.getId();
                    const deployedNetwork = PatientRegistration.networks[networkId];

                    if (deployedNetwork) {
                        const contractInstance = new web3Instance.eth.Contract(
                            PatientRegistration.abi,
                            deployedNetwork.address
                        );
                        setContract(contractInstance);
                        console.log("Smart contract loaded successfully.");
                    } else {
                        console.error("Smart contract not deployed on the detected network.");
                    }
                } catch (error) {
                    console.error("Error accessing MetaMask or contract:", error);
                }
            } else {
                console.error("MetaMask not detected. Please install the MetaMask extension.");
            }
        };

        init();
    }, []);
    
    return (
        <div className="h-screen w-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="max-w-md w-fit mx-auto space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-albulaHeavy">
                            <div>Register Yourself as</div>
                            <div className={`uppercase mt-2 ${userType === 'patient' ? 'text-green-400' : userType === 'doctor' ? 'text-yellow-400' : 'text-red-400'}`}>
                                {userType}
                            </div>
                        </h1>
                    </div>

                    <div className="flex rounded-full bg-gray-100 p-1">
                        {['patient', 'doctor', 'dispensary'].map((type, index) => (
                            <button key={index} className={`w-full text-sm font-albulaBold px-6 py-3 rounded-full transition-colors ${ userType === type ? type === 'patient' ? 'bg-green-400 text-white shadow' : type === 'doctor' ? 'bg-yellow-400 text-white shadow' : 'bg-red-400 text-white shadow' : 'text-gray-500 hover:text-gray-900' }`} onClick={() => setUserType(type)} >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    {userType === 'patient' && (
                        <PatientForm/>
                    )}

                    {userType === 'doctor' && (
                        <DoctorForm/>
                    )}

                    {userType === 'dispensary' && (
                        <DispensaryForm/>
                    )}

                    <div className="text-center text-sm text-gray-500 font-albulaMedium">
                        <span>Already Registered?{' '}</span>
                        <a href="/login" className="text-gray-900 hover:underline"> Log in </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
