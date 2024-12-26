import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import PatientRegistration from "../../../../build/contracts/PatientRegistration.json";

function PatientForm() {
    const [patientData, setPatientData] = useState({
        cryptoWalletAddress: '',
        fullName: '',
        healthId: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
    const [selectedGender, setSelectedGender] = useState('');
    
    const toggleGenderDropdown = () => setIsGenderDropdownOpen(!isGenderDropdownOpen);
    const handleSelectGender = (value) => {
        setSelectedGender(value);
        patientData.gender = value;
        setIsGenderDropdownOpen(false);
    };
    
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [availableAccounts, setAvailableAccounts] = useState([]);

    const handlePatientSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Starting patient registration process...");
    
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const contract = new web3.eth.Contract(
                PatientRegistration.abi,
                PatientRegistration.networks[networkId].address
            );
            console.log("Contract initialized with address:", PatientRegistration.networks[networkId].address);
            
            console.log("Checking if patient is already registered...");
            const isRegPatient = await contract.methods
                .isRegisteredPatient(patientData.healthId)
                .call();
                console.log("Is Registered Patient:", isRegPatient);
                
                if (isRegPatient) {
                    alert("Patient already exists");
                    console.log("Patient already exists, aborting registration");
                    return;
                }
                
                console.log("Registering patient with the following details:", patientData);
                
                await contract.methods
                .registerPatientCredentials(
                    patientData.healthId,
                    patientData.fullName,
                    patientData.email,
                    patientData.password,
                    patientData.cryptoWalletAddress
                )
                .send({ from: patientData.cryptoWalletAddress });
                
                console.log("Patient registration successful");
                
                const PatientData = await contract.methods
                    .getPatientCredentials(patientData.healthId)
                    .call();
                console.log(PatientData.name);

            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred while registering the doctor.");
            console.log("Registration error:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            <form onSubmit={handlePatientSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        name="cryptoWalletAddress"
                        value={patientData.cryptoWalletAddress}
                        onChange={handleInputChange}
                        placeholder="Crypto Wallet Address"
                        className="w-full px-6 py-3 rounded-full text-sm bg-white border border-[#e6eaf0] text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-gray-700 focus:outline-none"
                    />
                </div>
            
                <div>
                    <input
                        type="text"
                        name="fullName"
                        value={patientData.fullName}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className="w-full px-6 py-3 rounded-full text-sm bg-white border border-[#e6eaf0] text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-gray-700 focus:outline-none"
                    />
                </div>
            
                {/* <div className="relative">
                    <div onClick={toggleGenderDropdown} className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 focus:ring-2 focus:ring-gray-200 focus:outline-none cursor-pointer">
                        <span> {selectedGender || 'Select Gender'} </span>
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"> &#9660; </span>
                    </div>
            
                    {isGenderDropdownOpen && (
                        <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-3xl shadow-md z-10">
                            <div onClick={() => handleSelectGender('male')} className="px-6 py-3 text-gray-900 cursor-pointer hover:bg-gray-200 hover:rounded-tl-3xl hover:rounded-tr-3xl">
                                Male
                            </div>
            
                            <div onClick={() => handleSelectGender('female')} className="px-6 py-3 text-gray-900 cursor-pointer hover:bg-gray-200">
                                Female
                            </div>
            
                            <div onClick={() => handleSelectGender('other')} className="px-6 py-3 text-gray-900 cursor-pointer hover:bg-gray-200 hover:rounded-bl-3xl hover:rounded-br-3xl">
                                Other
                            </div>
                        </div>
                    )}
                </div> */}
            
                <div>
                    <input
                        type="text"
                        name="healthId"
                        value={patientData.healthId}
                        onChange={handleInputChange}
                        placeholder="National Health ID (ABHA ID)"
                        className="w-full px-6 py-3 rounded-full text-sm bg-white border border-[#e6eaf0] text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-gray-700 focus:outline-none"
                    />
                </div>
            
                <div>
                    <input
                        type="email"
                        name="email"
                        value={patientData.email}
                        onChange={handleInputChange}
                        placeholder="Email address"
                        className="w-full px-6 py-3 rounded-full text-sm bg-white border border-[#e6eaf0] text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-gray-700 focus:outline-none"
                    />
                </div>
            
                <div>
                    <input
                        type="password"
                        name="password"
                        value={patientData.password}
                        onChange={handleInputChange}
                        placeholder="Create password"
                        className="w-full px-6 py-3 rounded-full text-sm bg-white border border-[#e6eaf0] text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-gray-700 focus:outline-none"
                    />
                </div>

                <div>
                    <button type="submit" className="w-full mt-5 bg-[#1a3235] text-white px-4 py-3 rounded-full font-albulaBold hover:bg-[#2d555b] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all ease-in-out duration-200" >
                        <div className="flex items-center justify-center">
                            <span> Register </span>
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                </div>
            </form>
        </>
    )
};

export default PatientForm;