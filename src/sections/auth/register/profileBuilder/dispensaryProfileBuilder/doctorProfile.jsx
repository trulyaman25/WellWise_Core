import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DoctorRegistration from '../../../../../build/contracts/DoctorRegistration.json';
import Web3 from 'web3';
import WellWiseLogo from '/favicon.png';

import PersonalDetails from '../doctorProfileBuilder/forms/personalDetailForm';
import ContactDetails from '../doctorProfileBuilder/forms/contactDetailForm';
import EducationDetails from '../doctorProfileBuilder/forms/educationDetailForm';
import ProfessionalDetails from '../doctorProfileBuilder/forms/professionalDetailForm';

function Register() {
    const [userType, setUserType] = useState('patient');
    const [patientInitialRegistration, setPatientInitialRegistration] = useState(false);
    const [doctorInitialRegistration, setDoctorInitialRegistration] = useState(false);
    const [dispensaryInitialRegistration, setDispensaryInitialRegistration] = useState(false);

    const navigate = useNavigate();

    const { uniqueID } = useParams();

    const licenceNumber = `${uniqueID}`;

    const [Doctor, setDoctor] = useState(null);
    const [error, setError] = useState("");
    const [connectedAccount, setConnectedAccount] = useState("");
    const [web3, setWeb3] = useState();
    const [contract, setContract] = useState();

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    setWeb3(web3Instance);

                    const accounts = await web3Instance.eth.getAccounts();
                    setConnectedAccount(accounts[0]);

                    const networkId = await web3Instance.eth.net.getId();
                    const deployedNetwork = DoctorRegistration.networks[networkId];

                    if (deployedNetwork) {
                        const contractInstance = new web3Instance.eth.Contract(
                            DoctorRegistration.abi,
                            deployedNetwork.address
                        );
                        setContract(contractInstance);

                        console.log("Doctor Smart contract loaded successfully.");

                        const doctorCredentials = await contractInstance.methods
                            .getDoctorCredentials(licenceNumber)
                            .call();

                            const formattedDetails = {
                                walletAddress: doctorCredentials[0],
                                name: doctorCredentials[1],
                                licenceNumber: doctorCredentials[2],
                                email: doctorCredentials[3],
                            };

                            setDoctor(formattedDetails);
                    } else {
                        console.error("Doctor Smart contract not deployed on the detected network.");
                    }
                } catch (error) {
                    console.error("Error accessing MetaMask or contract:", error);
                }
            } else {
                alert("MetaMask not detected. Please install the MetaMask extension.");
                console.error("MetaMask not detected. Please install the MetaMask extension.");
            }
        };

        init();
    }, []);    

    const [personalSubmit, setPersonalSubmit] = useState(false);
    const [contactSubmit, setContactSubmit] = useState(false);
    const [educationSubmit, seteducationSubmit] = useState(false);
    const [professionalSubmit, setprofessionalSubmit] = useState(false);
    
    return (
        <div className="h-screen w-screen bg-[#e6eaf0] sm:p-8 lg:py-8 flex items-center justify-center">
            <div className={`w-fit bg-white flex  p-8 sm:p-14 sm:rounded-[30px] sm:drop-shadow-lg`}>
                <div className="p-4">
                    {patient ? (
                        <div>
                            <section className="flex flex-col items-center">
                                <div id="header" className="w-full flex justify-start">
                                    <img src={WellWiseLogo} alt="Well Wise Logo" className="w-[75px] h-[75px]" />
                                    <div className="ml-6">
                                        <div className="w-full text-3xl text-start font-albulaBold">
                                            Welcome,
                                        </div>
                                        <div className="w-full text-3xl text-start font-albulaHeavy capitalize mt-1 text-[#24454a]">
                                            {patient.name}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-[600px] h-[2px] mt-5 bg-slate-300 rounded-full"></div>
                                <div id="timeline" className="mt-8">
                                    <div className="w-[600px] flex justify-around items-center">
                                        <div className="font-albulaRegular text-sm text-center"> Personal <br /> Details </div>
                                        <div className="font-albulaRegular text-sm text-center"> Contact <br /> Details </div>
                                        <div className="font-albulaRegular text-sm text-center"> Education <br /> Details </div>
                                        <div className="font-albulaRegular text-sm text-center"> Professional <br /> Details </div>
                                    </div>

                                    <div className="w-[600px] h-[7px] mt-6 bg-slate-300 rounded-full relative flex justify-around items-center">
                                        <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">1</div>
                                        <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">2</div>
                                        <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">3</div>
                                        <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">4</div>
                                        <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">5</div>
                                    </div>
                                </div>
                            </section>

                            <section className="mt-14">
                                {!personalSubmit && !contactSubmit && !educationSubmit && !professionalSubmit && <PersonalDetails setPersonalSubmit={setPersonalSubmit}/>}
                                {personalSubmit && !contactSubmit && !educationSubmit && !professionalSubmit && <ContactDetails setContactSubmit={setContactSubmit}/>}
                                {personalSubmit && contactSubmit && !educationSubmit && !professionalSubmit && <EducationDetails setEducationSubmit={setEducationSubmit}/>}
                                {personalSubmit && contactSubmit && educationSubmit && !professionalSubmit && <ProfessionalDetails setProfessionalSubmit={setProfessionalSubmit}/>}
                            </section>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">Loading...</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;