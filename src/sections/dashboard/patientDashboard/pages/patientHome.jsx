import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PatientRegistration from '../../../../build/contracts/PatientRegistration.json';
import Web3 from 'web3';

function PatientDashboard() {
    const { healthID } = useParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [patientDetails, setPatientDetails] = useState(null);

    useEffect(() => {
        console.log("Updated Patient Details: ", patientDetails);
    }, [patientDetails]);    

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    const networkId = await web3Instance.eth.net.getId();
                    const deployedNetwork = PatientRegistration.networks[networkId];

                    if (deployedNetwork) {
                        const contractInstance = new web3Instance.eth.Contract(
                            PatientRegistration.abi,
                            deployedNetwork.address
                        );

                        const patientCredentials = await contractInstance.methods
                            .getPatientCredentials(healthID)
                            .call();
                            
                        const patientPersonalDetails = await contractInstance.methods
                            .getPatientPersonalDetails(healthID)
                            .call();
                        
                        const patientContactDetails = await contractInstance.methods
                            .getPatientContactDetails(healthID)
                            .call();
                        
                        const patientMedicalDetails = await contractInstance.methods
                            .getPatientMedicalDetails(healthID)
                            .call();
                        
                        const patientLifeStyleDetails = await contractInstance.methods
                            .getPatientLifestyleDetails(healthID)
                            .call();
                        
                        const patientPolicyDetails = await contractInstance.methods
                            .getPatientPolicyDetails(healthID)
                            .call();

                        setPatientDetails({
                            credentials: {
                                walletAddress: patientCredentials[0],
                                name: String(patientCredentials[1]),
                                healthID: String(patientCredentials[2]),
                                email: String(patientCredentials[3]),
                            },
                            personalDetails: {
                                gender: String(patientPersonalDetails[0]),
                                age: String(patientPersonalDetails[1]),
                                date: String(patientPersonalDetails[2]),
                                month: String(patientPersonalDetails[3]),
                                year: String(patientPersonalDetails[4]),
                                maritalStatus: String(patientPersonalDetails[5]),
                                disabilities: String(patientPersonalDetails[6]),
                            },
                            contactDetails: {
                                contactNumber: String(patientContactDetails[0]),
                                appartmentNumber: String(patientContactDetails[1]),
                                street: String(patientContactDetails[2]),
                                city: String(patientContactDetails[3]),
                                state: String(patientContactDetails[4]),
                                country: String(patientContactDetails[5]),
                            },
                            medicalDetails: {
                                weight: String(patientMedicalDetails[0]),
                                feet: String(patientMedicalDetails[1]),
                                inches: String(patientMedicalDetails[2]),
                                allergies: String(patientMedicalDetails[3]),
                                isDiabetic: patientMedicalDetails[4],
                                isHypertension: patientMedicalDetails[5],
                            },
                            lifeStyleDetails: {
                                smokingStatus: String(patientLifeStyleDetails[0]),
                                alcoholConsumption: String(patientLifeStyleDetails[1]),
                                exerciseHabit: String(patientLifeStyleDetails[2]),
                            },
                            policyDetails: {
                                insuranceProvider: String(patientPolicyDetails[0]),
                                policyNumber: String(patientPolicyDetails[1]),
                            },
                        });
                    } else {
                        setError('Smart contract not deployed on the detected network.');
                    }
                } catch (err) {
                    setError('Error accessing MetaMask or fetching data.');
                }
            } else {
                setError('MetaMask not detected. Please install the MetaMask extension.');
            }
            setLoading(false);
        };

        init();
    }, [healthID]);

    if (loading) {
        return (
            <>
                <div className="text-center mt-10">Loading...</div>;
            </>
        )
    }

    if (error) {
        return (
            <>
                <div className="text-red-500 bg-red-100 p-4 rounded-md mt-5 mx-auto max-w-md text-center">
                    {error}
                </div>
            </>
        );
    }

    return (
        <div className="fixed w-full h-screen p-10 font-albulaRegular">
            <h1 className="text-black">
                Patient Home
            </h1>
        </div>
    );
}

export default PatientDashboard;