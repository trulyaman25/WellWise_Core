import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import PatientRegistration from '../../../build/contracts/PatientRegistration.json';

import PatientForm from './forms/patientForm';
import DoctorForm from './forms/doctorForm';
import DispensaryForm from './forms/dispensaryForm';

import MosiacIllustration from '/illustration/mosiacPattern.png';
import WellWiseLogo from '/favicon.png';

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

    const Frame = () => {
        return (
            <>
                <div className="w-full flex flex-col justify-between">
                    <div className='flex flex-row justify-center items-center gap-7 mt-5'>
                        <img src={WellWiseLogo} alt="Well Wise Logo" className='w-[100px] h-[100px]'/>
                        <div className='text-3xl text-[#24454a] font-albulaHeavy'>Well Wise</div>
                    </div>

                    <div className="w-full pl-24 pr-10 space-y-8">

                        <Link to="/" className="flex items-center group relative">
                            <svg className="w-5 h-5 rotate-180 mt-[3px] text-slate-800 scale-90 relative transition-transform duration-300 group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="ml-5 text-slate-800 absolute">Back to home</div>
                        </Link>

                        <div>
                            <h1 className="text-xl font-albulaSemiBold space-y-2">
                                <div>Register yourself as</div>
                                <div className={`uppercase text-3xl font-albulaHeavy mt-2 ${userType === 'patient' ? 'text-green-400' : userType === 'doctor' ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {userType}
                                </div>
                            </h1>

                            <div className="flex rounded-full bg-gray-100 p-1 mt-3">
                                {['patient', 'doctor', 'dispensary'].map((type, index) => (
                                    <button key={index} className={`w-full text-sm font-albulaBold px-6 py-3 rounded-full transition-colors ${ userType === type ? type === 'patient' ? 'bg-green-400 text-white shadow' : type === 'doctor' ? 'bg-yellow-400 text-white shadow' : 'bg-red-400 text-white shadow' : 'text-gray-500 hover:text-gray-900' }`} onClick={() => setUserType(type)} >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
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
            </>
        )
    }
    
    return (
        <div className="h-screen w-screen bg-[#e6eaf0] p-4 md:p-8 lg:px-56 lg:py-8 flex items-center justify-center">
            <div className='w-full h-full bg-white flex p-14 rounded-[30px] drop-shadow-lg'>
                <div className='w-full h-full rounded-3xl flex flex-row justify-evenly'>
                    <img src={MosiacIllustration} alt="Mosiac Illustration" className='h-full'/>
                </div>
                <Frame />
            </div>
        </div>
    );
}
