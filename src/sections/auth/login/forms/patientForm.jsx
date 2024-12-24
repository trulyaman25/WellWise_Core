import { useState } from 'react';
import Web3 from 'web3';
import PatientRegistration from "../../../../build/contracts/PatientRegistration.json";

function PatientLogin({ setIsRegistered, setPatientDetails }) {
    const [patientCredentials, setPatientCredentials] = useState({
        healthID: '',
        password: '',
    });

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
            );

            const isRegisteredResult = await contract.methods
                .isRegisteredPatient(patientHealthID)
                .call();
            setIsRegistered(isRegisteredResult);

            if (isRegisteredResult) {
                const isValidPassword = await contract.methods
                    .validatePassword(patientHealthID, patientPassword)
                    .call();

                if (isValidPassword) {
                    const fetchPatientDetails = await contract.methods
                        .getPatientDetails(patientHealthID)
                        .call();
                    setPatientDetails(fetchPatientDetails);
                    console.log('Logged In');
                } else {
                    alert("Incorrect password");
                }
            } else {
                alert("Patient not registered");
            }
        } catch (error) {
            console.error("Error checking registration:", error);
            alert("An error occurred while checking registration.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <form onSubmit={handlePatientSubmit} className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    name="healthID"
                    value={patientCredentials.healthID}
                    onChange={handleInputChange}
                    placeholder="National Health ID (ABHA ID)"
                    className="w-full pl-14 pr-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                />
            </div>

            <div className="relative">
                <input
                    type="password"
                    name="password"
                    value={patientCredentials.password}
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

export default PatientLogin;