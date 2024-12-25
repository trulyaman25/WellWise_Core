import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import PatientRegistration from "../../../../build/contracts/PatientRegistration.json";

function PatientLogin({ setIsRegistered, setPatientDetails }) {
    const [patientCredentials, setPatientCredentials] = useState({
        healthID: '',
        password: '',
    });

    const navigate = useNavigate();

    const handlePatientSubmit = async (e) => {
        e.preventDefault();

        const patientHealthID = patientCredentials.healthID;
        const patientPassword = patientCredentials.password;

        try {
            console.log(`Starting login for Health ID: ${patientHealthID}`);

            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = PatientRegistration.networks[networkId];
            const contract = new web3.eth.Contract(
                PatientRegistration.abi,
                deployedNetwork && deployedNetwork.address
            );

            console.log("Checking if patient is registered...");
            const isRegisteredResult = await contract.methods
                .isRegisteredPatient(patientHealthID)
                .call();
            console.log("Is Registered:", isRegisteredResult);

            setIsRegistered(isRegisteredResult);

            if (isRegisteredResult) {
                console.log("Patient is registered, validating password...");
                const isValidPassword = await contract.methods
                    .validatePassword(patientHealthID, patientPassword)
                    .call();
                console.log("Is Valid Password:", isValidPassword);

                if (isValidPassword) {
                    const fetchPatientDetails = await contract.methods
                        .getPatientDetails(patientHealthID)
                        .call();
                    console.log("Patient details:", fetchPatientDetails);
                    console.log('Login successful');
                    console.log('Redirecting...')
                    navigate("/patient/" + patientHealthID);
                } else {
                    alert("Incorrect password");
                    console.log("Password validation failed");
                }
            } else {
                alert("Patient not registered");
                console.log("Patient not registered");
            }
        } catch (error) {
            console.error("Error during login process:", error);
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
                    className="w-full px-7 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                />
            </div>

            <div className="relative">
                <input
                    type="password"
                    name="password"
                    value={patientCredentials.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full px-7 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                />
            </div>

            <button type="submit" className="w-full mt-5 bg-gray-900 text-white px-4 py-3 rounded-full font-albulaBold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all ease-in-out duration-200">
                Login
            </button>
        </form>
    );
}

export default PatientLogin;