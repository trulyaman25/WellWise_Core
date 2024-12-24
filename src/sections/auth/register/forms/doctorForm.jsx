import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import DoctorRegistration from "../../../../build/contracts/DoctorRegistration.json";

function DoctorForm() {
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

    const navigate = useNavigate();
    const [web3, setWeb3] = useState(null);

    const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [isSpecializationDropdownOpen, setIsSpecializationDropdownOpen] = useState(false);

    const toggleGenderDropdown = () => setIsGenderDropdownOpen(!isGenderDropdownOpen);
    const handleSelectGender = (value) => {
        setSelectedGender(value);
        doctorData.gender = value;
        setIsGenderDropdownOpen(false);
    };

    const toggleSpecializationDropdown = () => setIsSpecializationDropdownOpen(!isSpecializationDropdownOpen);
    const handleSpecializationSelect = (value) => {
        setSelectedSpecialization(value);
        doctorData.specialization=value;
        setIsSpecializationDropdownOpen(false);
    };

    const [contract, setContract] = useState(null);

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
                    const deployedNetwork = DoctorRegistration.networks[networkId];

                    if (deployedNetwork) {
                        const contractInstance = new web3Instance.eth.Contract(
                            DoctorRegistration.abi,
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

    const handleDoctorSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Starting doctor registration process...");
    
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const contract = new web3.eth.Contract(
                DoctorRegistration.abi,
                DoctorRegistration.networks[networkId].address
            );
            console.log("Contract initialized with address:", DispensaryRegistration.networks[networkId].address);
            
            console.log("Checking if doctor is already registered...");
            const isRegDoc = await contract.methods
                .isRegisteredDoctor(doctorData.cryptoWalletAddress)
                .call();
            console.log("Is Registered Doctor:", isRegDoc);
    
            if (isRegDoc) {
                alert("Doctor already exists");
                console.log("Doctor already exists, aborting registration");
                return;
            }
    
            console.log("Registering doctor with the following details:", doctorData);
    
            await contract.methods
                .registerDoctor(
                    doctorData.fullName,
                    doctorData.gender,
                    doctorData.hospitalName,
                    doctorData.specialization,
                    doctorData.licenseNumber,
                    doctorData.email,
                    doctorData.password
                )
                .send({ from: doctorData.cryptoWalletAddress });
    
            console.log("Doctor registration successful");
            navigate("/login");
        } catch (error) {
            console.error("Error during doctor registration:", error);
            alert("An error occurred while registering the doctor.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDoctorData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            <form onSubmit={handleDoctorSubmit} className="space-y-4">
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
            </form>
        </>
    )
};

export default DoctorForm;