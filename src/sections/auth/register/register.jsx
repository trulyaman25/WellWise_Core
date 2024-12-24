import { useState, useEffect } from 'react';
import PatientRegistration from "../../../build/contracts/PatientRegistration.json";
import Web3 from 'web3';

const PatientForm = ({ patientData, handleInputChange, toggleDropdown, isGenderDropdownOpen, handleSelectGender, selectedGender }) => (
    <>
        <div>
            <input
                type="text"
                name="cryptoWalletAddress"
                value={patientData.cryptoWalletAddress}
                onChange={handleInputChange}
                placeholder="Crypto Wallet Address"
                className="w-full px-6 py-3 mt-2 rounded-full text-[15px] text-center bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>

        <div>
            <input
                type="text"
                name="fullName"
                value={patientData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>

        <div className="relative">
            <div onClick={toggleDropdown} className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 focus:ring-2 focus:ring-gray-200 focus:outline-none cursor-pointer">
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
        </div>

        <div>
            <input
                type="text"
                name="healthId"
                value={patientData.healthId}
                onChange={handleInputChange}
                placeholder="National Health ID (ABHA ID)"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>

        <div>
            <input
                type="email"
                name="email"
                value={patientData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>

        <div>
            <input
                type="password"
                name="password"
                value={patientData.password}
                onChange={handleInputChange}
                placeholder="Create password"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>
    </>
);

const DoctorForm = ({ doctorData, handleInputChange, toggleGenderDropdown, isGenderDropdownOpen, handleSelectGender, selectedGender, toggleSpecializationDropdown, isSpecializationDropdownOpen, handleSpecializationSelect, selectedSpecialization }) => (
    <>
        <div>
            <input
                type="text"
                name="cryptoWalletAddress"
                value={doctorData.cryptoWalletAddress}
                onChange={handleInputChange}
                placeholder="Crypto Wallet Address"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>

        <div>
            <input
                type="text"
                name="fullName"
                value={doctorData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>

        <div className="relative">
            <div onClick={toggleGenderDropdown} className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 focus:ring-2 focus:ring-gray-200 focus:outline-none cursor-pointer">
                <span> {selectedGender || 'Select Gender'} </span>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"> &#9660; </span>
            </div>

            {isGenderDropdownOpen && (
                <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-3xl shadow-md z-10">
                    <div onClick={() => handleSelectGender('male')} className="px-6 py-3 text-gray-900 cursor-pointer hover:bg-gray-200 hover:rounded-tl-3xl hover:rounded-tr-3xl">
                        <span className='capitalize'>Male</span>
                    </div>

                    <div onClick={() => handleSelectGender('female')} className="px-6 py-3 text-gray-900 cursor-pointer hover:bg-gray-200">
                        <span className='capitalize'>Female</span>
                    </div>

                    <div onClick={() => handleSelectGender('other')} className="px-6 py-3 text-gray-900 cursor-pointer hover:bg-gray-200 hover:rounded-bl-3xl hover:rounded-br-3xl">
                        <span className='capitalize'>Other</span>
                    </div>
                </div>
            )}
        </div>

        <div>
            <input
                type="text"
                name="hospitalName"
                value={doctorData.hospitalName}
                onChange={handleInputChange}
                placeholder="Hospital Name"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>

        <div className="relative">
            <div onClick={toggleSpecializationDropdown} className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 focus:ring-2 focus:ring-gray-200 focus:outline-none cursor-pointer">
                <span> {selectedSpecialization || 'Select Specialization'} </span>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"> &#9660; </span>
            </div>

            {isSpecializationDropdownOpen && (
                <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-3xl shadow-md z-10">
                    <div onClick={() => handleSpecializationSelect('Cardiology')} className="px-6 py-3 text-gray-900 cursor-pointer hover:bg-gray-200 hover:rounded-tl-3xl hover:rounded-tr-3xl">
                        Cardiology
                    </div>
                    <div onClick={() => handleSpecializationSelect('Dermatology')} className="px-6 py-3 text-gray-900 cursor-pointer hover:bg-gray-200">
                        Dermatology
                    </div>
                    <div onClick={() => handleSpecializationSelect('Neurology')} className="px-6 py-3 text-gray-900 cursor-pointer hover:bg-gray-200">
                        Neurology
                    </div>
                    <div onClick={() => handleSpecializationSelect('Orthopedics')} className="px-6 py-3 text-gray-900 cursor-pointer hover:bg-gray-200">
                        Orthopedics
                    </div>
                    <div onClick={() => handleSpecializationSelect('Pediatrics')} className="px-6 py-3 text-gray-900 cursor-pointer hover:bg-gray-200 hover:rounded-bl-3xl hover:rounded-br-3xl">
                        Pediatrics
                    </div>
                </div>
            )}
        </div>

        <div>
            <input
                type="text"
                name="licenseNumber"
                value={doctorData.licenseNumber}
                onChange={handleInputChange}
                placeholder="Medical License Number"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>

        <div>
            <input
                type="email"
                name="email"
                value={doctorData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>

        <div>
            <input
                type="password"
                name="password"
                value={doctorData.password}
                onChange={handleInputChange}
                placeholder="Create password"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>
    </>
);

const DispensaryForm = ({ dispensaryData, handleInputChange }) => (
    <>
        <div>
            <input
                type="text"
                name="cryptoWalletAddress"
                value={dispensaryData.cryptoWalletAddress}
                onChange={handleInputChange}
                placeholder="Crypto Wallet Address"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>

        <div>
            <input
                type="text"
                name="dispensaryName"
                value={dispensaryData.dispensaryName}
                onChange={handleInputChange}
                placeholder="Dispensary Name"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>

        <div>
            <input
                type="text"
                name="hospitalName"
                value={dispensaryData.hospitalName}
                onChange={handleInputChange}
                placeholder="Hospital Name"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>

        <div>
            <input
                type="text"
                name="licenseNumber"
                value={dispensaryData.licenseNumber}
                onChange={handleInputChange}
                placeholder="Business License Number"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>

        <div>
            <input
                type="email"
                name="email"
                value={dispensaryData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>

        <div>
            <input
                type="password"
                name="password"
                value={dispensaryData.password}
                onChange={handleInputChange}
                placeholder="Create password"
                className="w-full px-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
        </div>
    </>
);

export default function Register() {
    const [userType, setUserType] = useState('patient');

    const [patientData, setPatientData] = useState({
        cryptoWalletAddress: '',
        fullName: '',
        gender: '',
        healthId: '',
        email: '',
        password: '',
    });

    const [doctorData, setDoctorData] = useState({
        cryptoWalletAddress: '',
        fullName: '',
        gender: '',
        hospitalName: '',
        specialization: '',
        licenseNumber: '',
        email: '',
        password: '',
    });

    const [dispensaryData, setDispensaryData] = useState({
        cryptoWalletAddress: '',
        dispensaryName: '',
        hospitalName: '',
        licenseNumber: '',
        email: '',
        password: '',
    });

    const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [isSpecializationDropdownOpen, setIsSpecializationDropdownOpen] = useState(false);

    const toggleGenderDropdown = () => setIsGenderDropdownOpen(!isGenderDropdownOpen);
    const handleSelectGender = (value) => {
        setSelectedGender(value);
        if(userType == 'patient'){
            patientData.gender = value;
        } else if (userType == 'doctor'){
            doctorData.gender = value;
        }
        setIsGenderDropdownOpen(false);
    };

    const toggleSpecializationDropdown = () => setIsSpecializationDropdownOpen(!isSpecializationDropdownOpen);
    const handleSpecializationSelect = (value) => {
        setSelectedSpecialization(value);
        doctorData.specialization=value;
        setIsSpecializationDropdownOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (userType === 'patient') {
            setPatientData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else if (userType === 'doctor') {
            setDoctorData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else if (userType === 'dispensary') {
            setDispensaryData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [availableAccounts, setAvailableAccounts] = useState([]);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    setWeb3(web3Instance);

                    const accounts = await web3Instance.eth.getAccounts();
                    if (accounts.length > 0) {
                        setPatientData((prevData) => ({
                            ...prevData,
                            cryptoWalletAddress: accounts[0]
                        }));
                    }

                    setAvailableAccounts(accounts);

                    const networkId = await web3Instance.eth.net.getId();
                    console.log("Network ID:", networkId);

                    const deployedNetwork = PatientRegistration.networks[networkId];
                    const contractInstance = new web3Instance.eth.Contract(
                        PatientRegistration.abi,
                        deployedNetwork && deployedNetwork.address
                    );
                    setContract(contractInstance);
                } catch (error) {
                    console.error("User denied access to accounts.");
                }
            } else {
                console.log("Please install MetaMask extension");
            }
        };

        init();
    }, []);

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
                .registerPatient(
                    patientData.cryptoWalletAddress,
                    patientData.fullName,
                    patientData.gender,
                    patientData.email,
                    patientData.healthId,
                    patientData.password
                )
                .send({ from: patientData.cryptoWalletAddress });
    
            alert("Patient registered successfully!");
            console.log("Patient registration successful");
    
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while registering the doctor.");
            console.log("Registration error:", error);
        }
    };

    const handleDoctorSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Starting doctor registration process...");
        } catch (error) {

        }
    };

    const handleDispensarySubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Starting dispensary registration process...");
        } catch (error) {

        }
    };
    

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
                            <button
                                key={index}
                                className={`w-full text-sm font-albulaBold px-6 py-3 rounded-full transition-colors ${
                                    userType === type
                                        ? type === 'patient'
                                            ? 'bg-green-400 text-white shadow'
                                            : type === 'doctor'
                                            ? 'bg-yellow-400 text-white shadow'
                                            : 'bg-red-400 text-white shadow'
                                        : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                onClick={() => setUserType(type)}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={userType == 'patient' ? handlePatientSubmit : userType == 'doctor' ? handleDoctorSubmit : handleDispensarySubmit} className="space-y-4">
                        {userType === 'patient' && (
                            <PatientForm
                                patientData={patientData}
                                handleInputChange={handleInputChange}
                                toggleDropdown={toggleGenderDropdown}
                                isGenderDropdownOpen={isGenderDropdownOpen}
                                handleSelectGender={handleSelectGender}
                                selectedGender={selectedGender}
                            />
                        )}

                        {userType === 'doctor' && (
                            <DoctorForm
                                doctorData={doctorData}
                                handleInputChange={handleInputChange}
                                toggleGenderDropdown={toggleGenderDropdown}
                                isGenderDropdownOpen={isGenderDropdownOpen}
                                handleSelectGender={handleSelectGender}
                                selectedGender={selectedGender}
                                toggleSpecializationDropdown={toggleSpecializationDropdown}
                                isSpecializationDropdownOpen={isSpecializationDropdownOpen}
                                handleSpecializationSelect={handleSpecializationSelect}
                                selectedSpecialization={selectedSpecialization}
                            />
                        )}

                        {userType === 'dispensary' && (
                            <DispensaryForm dispensaryData={dispensaryData} handleInputChange={handleInputChange} />
                        )}

                        <div>
                            <button type="submit" className="w-full mt-5 bg-gray-900 text-white px-4 py-3 rounded-full font-albulaBold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all ease-in-out duration-200" >
                                <div className="flex items-center justify-center">
                                    <span> Register </span>
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        </div>

                        <div className="text-center text-sm text-gray-500 font-albulaMedium">
                            <span>Already Registered?{' '}</span>
                            <a href="/login" className="text-gray-900 hover:underline"> Log in </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
