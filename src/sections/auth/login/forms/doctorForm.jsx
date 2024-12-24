import { useState } from 'react';
import Web3 from 'web3';
import DoctorRegistration from "../../../../build/contracts/DoctorRegistration.json";

function DoctorLogin({ setIsRegistered, setDoctorDetails }) {
    const [doctorCredentials, setDoctorCredentials] = useState({
        licenseNumber: '',
        password: '',
    });

    const handleDoctorSubmit = async (e) => {
        e.preventDefault();

        const doctorLicenceNumber = doctorCredentials.licenseNumber;
        const doctorPassword = doctorCredentials.password;

        try {
            console.log("Starting the doctor login process...");
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = DoctorRegistration.networks[networkId];
            const contract = new web3.eth.Contract(
                DoctorRegistration.abi,
                deployedNetwork && deployedNetwork.address
            );

            const isRegisteredResult = await contract.methods
                .isRegisteredDoctor(doctorLicenceNumber)
                .call();
            setIsRegistered(isRegisteredResult);

            if (isRegisteredResult) {
                const isValidPassword = await contract.methods
                    .validatePassword(doctorLicenceNumber, doctorPassword)
                    .call();

                if (isValidPassword) {
                    const fetchDoctorDetails = await contract.methods
                        .getDoctorDetails(doctorLicenceNumber)
                        .call();
                    setDoctorDetails(fetchDoctorDetails);
                    console.log('Logged In');
                } else {
                    alert("Incorrect password");
                }
            } else {
                alert("Doctor not registered");
            }
        } catch (error) {
            console.error("Error during doctor login process:", error);
            alert("An error occurred while checking registration.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDoctorCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <form onSubmit={handleDoctorSubmit} className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    name="licenseNumber"
                    value={doctorCredentials.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="Medical License Number"
                    className="w-full pl-14 pr-6 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                />
            </div>

            <div className="relative">
                <input
                    type="password"
                    name="password"
                    value={doctorCredentials.password}
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

export default DoctorLogin;