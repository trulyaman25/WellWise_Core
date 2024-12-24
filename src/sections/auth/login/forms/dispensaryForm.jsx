import { useState } from 'react';
import Web3 from 'web3';
import DispensaryRegistration from "../../../../build/contracts/DiagnosticRegistration.json";

function DispensaryLogin({ setIsRegistered, setDispensaryDetails }) {
    const [dispensaryCredentials, setDispensaryCredentials] = useState({
        licenseNumber: '',
        password: '',
    });

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

            const isRegisteredResult = await contract.methods
                .isRegisteredDiagnostic(dispensaryLicenceNumber)
                .call();
            setIsRegistered(isRegisteredResult);

            if (isRegisteredResult) {
                const isValidPassword = await contract.methods
                    .validatePassword(dispensaryLicenceNumber, dispensaryPassword)
                    .call();

                if (isValidPassword) {
                    const diagnostic = await contract.methods
                        .getDiagnosticDetails(dispensaryLicenceNumber)
                        .call();
                    setDispensaryDetails(diagnostic);
                    console.log('Logged In');
                } else {
                    alert("Incorrect password");
                }
            } else {
                alert("Dispensary not registered");
            }
        } catch (error) {
            console.error("Error during dispensary login process:", error);
            alert("An error occurred while checking registration.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDispensaryCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <form onSubmit={handleDispensarySubmit} className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    name="licenseNumber"
                    value={dispensaryCredentials.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="Business License Number"
                    className="w-full pl-14 pr-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                />
            </div>

            <div className="relative">
                <input
                    type="password"
                    name="password"
                    value={dispensaryCredentials.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full pl-14 pr-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                />
            </div>

            <button type="submit" className="w-full mt-5 bg-gray-900 text-white px-4 py-3 rounded-full font-albulaBold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all ease-in-out duration-200">
                Login
            </button>
        </form>
    );
}

export default DispensaryLogin;