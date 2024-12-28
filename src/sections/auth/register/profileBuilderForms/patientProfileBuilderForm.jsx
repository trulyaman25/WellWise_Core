import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Web3 from "web3";
import PatientRegistration from "../../../../build/contracts/PatientRegistration.json";

import WellWiseLogo from "/favicon.png";

function PatientProfileBuilderForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const healthId = queryParams.get("healthId");

    const [patient, setPatient] = useState(null);
    const [error, setError] = useState("");
    const [patientPersonalDetails, setPatientPersonalDetails] = useState({
        gender: "Male",
        age: 21,
        date: 25,
        month: 7,
        year: 2003,
        maritalStatus: false,
        disabilities: "NA",
    });
    const [connectedAccount, setConnectedAccount] = useState("");

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            try {
                if (window.ethereum) {
                    const web3 = new Web3(window.ethereum);
                    await window.ethereum.enable();
                    const networkId = await web3.eth.net.getId();
                    const contractInstance = new web3.eth.Contract(
                        PatientRegistration.abi,
                        PatientRegistration.networks[networkId]?.address
                    );

                    const accounts = await web3.eth.getAccounts();
                    setConnectedAccount(accounts[0]);
                    
                    if (isMounted) {
                        const patientCredentials = await contractInstance.methods
                        .getPatientCredentials(healthId)
                        .call();

                        const formattedDetails = {
                            walletAddress: patientCredentials[0],
                            name: patientCredentials[1],
                            healthID: patientCredentials[2],
                            email: patientCredentials[3],
                        };

                        setPatient(formattedDetails);
                    }
                } else if (isMounted) {
                    console.log("Ethereum wallet not found. Please install MetaMask.");
                }
            } catch (err) {
                if (isMounted) {
                    console.log("Error accessing MetaMask or contract");
                }
            }
        };

        init();

        return () => {
            isMounted = false;
        };
    }, [healthId]);

    const [personalSubmit, setPersonalSubmit] = useState(false);
    const [contactSubmit, setContactSubmit] = useState(false);
    const [medicalSubmit, setMedicalSubmit] = useState(false);
    const [lifeStyleSubmit, setLifeStyleSubmit] = useState(false);
    const [insuranceSubmit, setInsuranceSubmit] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const contract = new web3.eth.Contract(
                PatientRegistration.abi,
                PatientRegistration.networks[networkId].address
            );
            console.log("Building patient's personal profile with the following details:", patientPersonalDetails);
             
            if(!personalSubmit && !contactSubmit && !medicalSubmit && !lifeStyleSubmit && !insuranceSubmit){
                await contract.methods
                    .registerPatientPersonalDetails(
                        healthId,
                        patientPersonalDetails.gender,
                        patientPersonalDetails.age,
                        patientPersonalDetails.date,
                        patientPersonalDetails.month,
                        patientPersonalDetails.year,
                        patientPersonalDetails.maritalStatus,
                        patientPersonalDetails.disabilities
                    )
                    .send({ from: connectedAccount });
                    
                console.log("Personal Details Submitted Successfully");
                setPersonalSubmit(true);
            } else if (personalSubmit && !contactSubmit && !medicalSubmit && !lifeStyleSubmit && !insuranceSubmit){
                await contract.methods
                    .registerPatientContactDetails(
                        healthId,
                    )
                    .send({ from: connectedAccount });
                    
                console.log("Contact Details Submitted Successfully");
                setContactSubmit(true);
            } else if (personalSubmit && contactSubmit && !medicalSubmit && !lifeStyleSubmit && !insuranceSubmit) {
                await contract.methods
                    .registerPatientMedicalDetails(
                        healthId,
                    )
                    .send({ from: connectedAccount });
                    
                console.log("Medical Details Submitted Successfully");
                setMedicalSubmit(true);
            } else if (personalSubmit && contactSubmit && medicalSubmit && !lifeStyleSubmit && !insuranceSubmit) {
                await contract.methods
                .registerPatientLifeStyleDetails(
                    healthId,
                )
                .send({ from: connectedAccount });
                
                console.log("LifeStyle Details Submitted Successfully");
                setLifeStyleSubmit(true);
            } else {
                await contract.methods
                .registerPatientInsuranceDetails(
                    healthId,
                )
                .send({ from: connectedAccount });
                
                console.log("Insurance Details Submitted Successfully");
                setInsuranceSubmit(true);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while registering personal details.");
            console.log("Form Builder error:", error);
        }
    };

    const PersonalDetails = () => {
        return (
            <>
                <h1 className="font-albulaSemiBold text-2xl">Personal Details</h1>
                <form onSubmit={handleSubmit}>
                    <section>
                        
                    </section>

                    <div className="flex flex-row justify-end items-center">
                        <button onClick={handleSubmit} className="bg-[#24454a] text-white font-albulaMedium px-7 py-2 rounded-xl hover:bg-[#2d555b] transition-all ease-in-out" >
                            Next
                        </button>
                    </div>
                </form>
            </>
        )
    }

    const ContactDetails = () => {
        return (
            <>
                <h1 className="font-albulaSemiBold text-2xl">Contact Details</h1>
                <form onSubmit={handleSubmit}>
                    <section>
                        
                    </section>

                    <div className="flex flex-row justify-end items-center">
                        <button onClick={handleSubmit} className="bg-[#24454a] text-white font-albulaMedium px-7 py-2 rounded-xl hover:bg-[#2d555b] transition-all ease-in-out" >
                            Next
                        </button>
                    </div>
                </form>
            </>
        )
    }

    const MedicalDetails = () => {
        return (
            <>
                <h1 className="font-albulaSemiBold text-2xl">Medical Details</h1>
                <form onSubmit={handleSubmit}>
                    <section>

                    </section>

                    <div className="flex flex-row justify-end items-center">
                        <button onClick={handleSubmit} className="bg-[#24454a] text-white font-albulaMedium px-7 py-2 rounded-xl hover:bg-[#2d555b] transition-all ease-in-out" >
                            Next
                        </button>
                    </div>
                </form>
            </>
        )
    }

    const LifeStyleDetails = () => {
        return (
            <>
                <h1 className="font-albulaSemiBold text-2xl">LifeStyle Details</h1>
                <form onSubmit={handleSubmit}>
                    <section>
                        
                    </section>

                    <div className="flex flex-row justify-end items-center">
                        <button onClick={handleSubmit} className="bg-[#24454a] text-white font-albulaMedium px-7 py-2 rounded-xl hover:bg-[#2d555b] transition-all ease-in-out" >
                            Next
                        </button>
                    </div>
                </form>
            </>
        )
    }
    const InsuranceDetails = () => {
        return (
            <>
                <h1 className="font-albulaSemiBold text-2xl">Insurance Details</h1>
                <form onSubmit={handleSubmit}>
                    <section>
                        
                    </section>

                    <div className="flex flex-row justify-end items-center">
                        <button onClick={handleSubmit} className="bg-[#24454a] text-white font-albulaMedium px-7 py-2 rounded-xl hover:bg-[#2d555b] transition-all ease-in-out" >
                            Next
                        </button>
                    </div>
                </form>
            </>
        )
    }

    return (
        <div className="p-4">
            {patient ? (
                <div>
                    <section className="flex flex-col items-center">
                        <div id="header" className="w-full flex justify-start">
                            <img src={WellWiseLogo} alt="Well Wise Logo" className="w-[75px] h-[75px]" />
                            <div className="ml-6">
                                <div className="w-full text-3xl text-start font-albulaBold">
                                    Welcome,
                                </div>
                                <div className="w-full text-3xl text-start font-albulaHeavy capitalize mt-1 text-[#24454a]">
                                    {patient.name}
                                </div>
                            </div>
                        </div>

                        <div className="w-[600px] h-[2px] mt-5 bg-slate-300 rounded-full"></div>
                        <div id="timeline" className="mt-8">
                            <div className="w-[600px] flex justify-around items-center">
                                <div className="font-albulaRegular text-sm text-center"> Personal <br /> Details </div>
                                <div className="font-albulaRegular text-sm text-center"> Contact <br /> Details </div>
                                <div className="font-albulaRegular text-sm text-center"> Medical <br /> Details </div>
                                <div className="font-albulaRegular text-sm text-center"> Life Style <br /> Details </div>
                                <div className="font-albulaRegular text-sm text-center"> Insurance <br /> Details </div>
                            </div>

                            <div className="w-[600px] h-[7px] mt-6 bg-slate-300 rounded-full relative flex justify-around items-center">
                                <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">1</div>
                                <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">2</div>
                                <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">3</div>
                                <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">4</div>
                                <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">5</div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-14">
                        {!personalSubmit && <PersonalDetails />}
                        {personalSubmit && !contactSubmit && <ContactDetails />}
                        {personalSubmit && contactSubmit && !medicalSubmit && <MedicalDetails />}
                        {personalSubmit && contactSubmit && medicalSubmit && !lifeStyleSubmit && <LifeStyleDetails />}
                        {personalSubmit && contactSubmit && medicalSubmit && lifeStyleSubmit && !insuranceSubmit && <InsuranceDetails />}
                    </section>
                </div>
            ) : (
                <div className="text-center text-gray-500">Loading...</div>
            )}
        </div>
    );
}

export default PatientProfileBuilderForm;