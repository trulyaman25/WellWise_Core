import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PatientRegistration from '../../../../../build/contracts/PatientRegistration.json';
import MentalHealth from '../../../../../build/contracts/MentalHealth.json';
import Web3 from 'web3';

function TestDashboard() {
    const { healthID, testID } = useParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [patientDetails, setPatientDetails] = useState(null);
    const [testIDS, setTestIDS] = useState([]);
    const [mentalHealthData, setMentalHealthData] = useState(null);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();

                    const networkId = await web3Instance.eth.net.getId();

                    // Patient Details
                    const patientDeployedNetwork = PatientRegistration.networks[networkId];
                    if (patientDeployedNetwork) {
                        const patientContract = new web3Instance.eth.Contract(
                            PatientRegistration.abi,
                            patientDeployedNetwork.address
                        );

                        const patientCredentials = await patientContract.methods
                            .getPatientCredentials(healthID)
                            .call();
                        const patientPersonalDetails = await patientContract.methods
                            .getPatientPersonalDetails(healthID)
                            .call();
                        const patientContactDetails = await patientContract.methods
                            .getPatientContactDetails(healthID)
                            .call();
                        const patientMedicalDetails = await patientContract.methods
                            .getPatientMedicalDetails(healthID)
                            .call();
                        const patientLifeStyleDetails = await patientContract.methods
                            .getPatientLifestyleDetails(healthID)
                            .call();
                        const patientPolicyDetails = await patientContract.methods
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
                                dateOfBirth: `${patientPersonalDetails[2]}-${patientPersonalDetails[3]}-${patientPersonalDetails[4]}`,
                                maritalStatus: String(patientPersonalDetails[5]),
                                disabilities: String(patientPersonalDetails[6]),
                            },
                            contactDetails: {
                                contactNumber: String(patientContactDetails[0]),
                                address: `${patientContactDetails[1]}, ${patientContactDetails[2]}, ${patientContactDetails[3]}, ${patientContactDetails[4]}, ${patientContactDetails[5]}`,
                            },
                            medicalDetails: {
                                weight: String(patientMedicalDetails[0]),
                                height: `${patientMedicalDetails[1]}ft ${patientMedicalDetails[2]}in`,
                                allergies: String(patientMedicalDetails[3]),
                                diabetic: patientMedicalDetails[4] ? 'Yes' : 'No',
                                hypertension: patientMedicalDetails[5] ? 'Yes' : 'No',
                            },
                            lifeStyleDetails: {
                                smoking: String(patientLifeStyleDetails[0]),
                                alcohol: String(patientLifeStyleDetails[1]),
                                exercise: String(patientLifeStyleDetails[2]),
                            },
                            policyDetails: {
                                insuranceProvider: String(patientPolicyDetails[0]),
                                policyNumber: String(patientPolicyDetails[1]),
                            },
                        });
                    } else {
                        setError('Patient Registration smart contract not deployed on the detected network.');
                    }

                    const mentalHealthDeployedNetwork = MentalHealth.networks[networkId];
                    if (mentalHealthDeployedNetwork) {
                        const mentalHealthContract = new web3Instance.eth.Contract(
                            MentalHealth.abi,
                            mentalHealthDeployedNetwork.address
                        );

                        const fetchedTestIDs = await mentalHealthContract.methods
                            .getAllTestIDs(healthID)
                            .call();

                        const fetchedChildhoodDetails = await mentalHealthContract.methods
                            .getChildhoodDetails(testID)
                            .call();
                        const fetchedPHQ9Details = await mentalHealthContract.methods
                            .getPHQ9Details(testID)
                            .call();
                        const fetchSentimentDetails = await mentalHealthContract.methods
                            .getSentimentDetails(testID)
                            .call();

                        setTestIDS(fetchedTestIDs);
                        setMentalHealthData({
                            childhoodDetails: fetchedChildhoodDetails,
                            PHQ9Details: fetchedPHQ9Details,
                            sentimentDetails: fetchSentimentDetails,
                        });
                    } else {
                        setError('MentalHealth smart contract not deployed on the detected network.');
                    }
                } catch (err) {
                    console.error(err);
                    setError('Error accessing MetaMask or fetching data.');
                }
            } else {
                setError('MetaMask not detected. Please install the MetaMask extension.');
            }
            setLoading(false);
        };

        init();
    }, [healthID, testID]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="fixed w-[calc(100%-160px)] h-screen py-10 pr-10 font-albulaRegular">
                <div className="w-full h-[80px] bg-[#d4eceb] rounded-[30px] px-10 flex flex-row justify-between items-center">
                    <div>
                        <span className="font-albulabold text-2xl text-[#124444]">
                            Hey
                        </span>
                        <span className="font-albulaHeavy text-2xl ml-2 text-[#124444]">
                            {patientDetails.credentials.name}
                        </span>
                    </div>

                    <div>
                        <span className="font-albulaRegular text-xl">
                            Test ID:
                        </span>
                        <span className="font-albulaBold text-xl ml-2">
                            {testID}
                        </span>
                    </div>
                </div>

                <div className="font-albulaHeavy text-2xl text-[#124444] flex flex-row justify-center items-center mt-10">
                    Mental Health Test Summary
                </div>

                <div className="w-[500px] h-[500px] bg-[#e2f1f0] rounded-[30px] mt-10 px-10 flex flex-row justify-between items-center">

                </div>
            </div>
        </>
    );
}

export default TestDashboard;
