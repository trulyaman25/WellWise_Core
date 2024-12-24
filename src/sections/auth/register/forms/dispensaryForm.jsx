import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import DispensaryRegistration from "../../../../build/contracts/DiagnosticRegistration.json";

function DispensaryForm () {
    const [dispensaryData, setDispensaryData] = useState({
        cryptoWalletAddress: '',
        dispensaryName: '',
        hospitalName: '',
        licenseNumber: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const [web3, setWeb3] = useState(null);
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
                    const deployedNetwork = DispensaryRegistration.networks[networkId];

                    if (deployedNetwork) {
                        const contractInstance = new web3Instance.eth.Contract(
                            DispensaryRegistration.abi,
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

    const handleDispensarySubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Starting dispensary registration process...");
            
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const contract = new web3.eth.Contract(
                DispensaryRegistration.abi,
                DispensaryRegistration.networks[networkId].address
            );
            console.log("Contract initialized with address:", DispensaryRegistration.networks[networkId].address);
    
            console.log("Checking if dispensary is already registered...");
            const isDispensaryRegistered = await contract.methods
                .isRegisteredDiagnostic(dispensaryData.cryptoWalletAddress)
                .call();
            console.log("Is Dispensary Registered:", isDispensaryRegistered);
    
            if (isDispensaryRegistered) {
                alert("Dispensary already exists");
                console.log("Dispensary already exists, aborting registration");
                return;
            }
    
            console.log("Registering dispensary with the following details:", dispensaryData);

            await contract.methods
                .registerDiagnostic(
                    dispensaryData.dispensaryName,
                    dispensaryData.hospitalName,
                    dispensaryData.licenseNumber,
                    dispensaryData.email,
                    dispensaryData.password
                )
                .send({ from: dispensaryData.cryptoWalletAddress });
    
            console.log("Dispensary registration successful!");
            navigate("/login");
        } catch (error) {
            console.error("Error during dispensary registration:", error);
            alert("An error occurred while registering the diagnostic.");
        }
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDispensaryData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            <form onSubmit={handleDispensarySubmit} className="space-y-4">
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

export default DispensaryForm;