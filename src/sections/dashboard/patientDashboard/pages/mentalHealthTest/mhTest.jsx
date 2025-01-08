import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Lottie from "react-lottie";
import loaderAnimation from "/public/animations/loaderGreen.json";

import ChildhoodSection from "./sections/childhoodSection";
import PHQ9Section from "./sections/phq9Section";

function PatientMentalHealthDashboard() {
    const [showDisclaimer, setShowDisclaimer] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { healthID } = useParams();
    const [currentStep, setCurrentStep] = useState(1);

    const handleAccept = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setShowDisclaimer(false);
        }, 500);
    };

    const loaderOptions = {
        loop: true,
        autoplay: true,
        animationData: loaderAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const steps = [
        { id: 1, title: "Childhood & Past Experiences", description: "Explore past trauma and experiences." },
        { id: 2, title: "PHQ-9 Questionnaire", description: "Evaluate depression levels with PHQ-9." },
        { id: 3, title: "Sentiment Analysis", description: "Analyze sentiment from text and audio." },
        { id: 4, title: "Facial Behavior Analysis", description: "Analyze facial expressions for mental health." }
    ];    

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-[#e6eaf0]">
                <Lottie options={loaderOptions} height={150} width={150} />
            </div>
        );
    }

    if (showDisclaimer) {
        return (
            <>
                <div className="w-screen h-screen bg-[#e6eaf0] flex flex-row justify-center items-center">
                    <div className="bg-white w-[1335px] p-8 sm:p-14 sm:rounded-[30px] sm:drop-shadow-lg">
                        <h1 className="text-4xl font-albulaHeavy text-gray-800 mb-4 text-center">
                            Mental Health Test <span className="text-rose-500">Disclaimer!</span>
                        </h1>
                        <p className="text-gray-600 font-albulaRegular mb-4 mt-16">
                            Welcome to the Mental Health Test. This assessment is designed to evaluate your mental well-being through a series of sections, including questions about your past experiences, a standard PHQ-9 questionnaire, sentiment analysis, and facial behavior analysis. The results aim to provide insights into your mental health status, particularly regarding depression.
                        </p>

                        <h2 className="text-2xl font-albulaSemiBold text-gray-800 mt-10 mb-3">How the Test Works</h2>
                        <ul className="list-disc list-inside text-gray-600 mb-4 font-albulaRegular">
                            <li>Section 1: Answer questions about your childhood and past experiences.</li>
                            <li>Section 2: Complete the PHQ-9 questionnaire to assess depression levels.</li>
                            <li>Section 3: Provide text and audio responses for sentiment analysis using AI.</li>
                            <li>Section 4: Enable your webcam for verbal answers and facial behavior analysis.</li>
                        </ul>

                        <h2 className="text-2xl font-albulaSemiBold text-gray-800 mt-10 mb-3">Key Information</h2>
                        <p className="text-gray-600 mb-4 font-albulaRegular">
                            - This test leverages AI and ML to assist doctors in providing better care by analyzing patient data before suggesting solutions.<br />
                            - Your data will be securely stored and analyzed under strict privacy protocols. Video and audio data are used solely for this test and will not be shared without your consent.<br />
                            - Participation in this test is completely voluntary. You can choose to exit at any time.<br />
                        </p>

                        <h2 className="text-2xl font-albulaSemiBold text-gray-800 mt-10 mb-3">Consent</h2>
                        <p className="text-gray-600 font-albulaRegular mb-4">
                            By proceeding, you confirm that you have read and understood this disclaimer and consent to participate in the test.
                        </p>

                        <div className="flex justify-end mt-10 gap-5">
                            <Link to={`/patient/${healthID}/home`} className="text-red-500 px-6 py-3 rounded font-albulaBold hover:text-red-700 transition-all ease-in-out" >
                                Decline
                            </Link>
                            <button className="bg-[#609c9c] text-white px-6 py-3 rounded-xl font-albulaBold hover:bg-[#266666] transition-all ease-in-out" onClick={handleAccept} >
                                Accept & Proceed
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="w-screen h-screen bg-[#e6eaf0] flex justify-center items-center">
            <div className="bg-white w-fit h- p-8 sm:p-14 sm:rounded-[30px] flex flex-row justify-center items-center sm:drop-shadow-lg">
                <div id="progressTracker" className="w-fit h-fit flex flex-col">
                    {steps.map((step, index) => (
                        <div key={step.id} className={`relative flex items-center py-5 px-8 rounded-3xl ${currentStep === step.id ? "bg-[#eef8f7]" : "" } cursor-pointer`}>
                            {index < steps.length - 1 && ( <div className={`absolute left-[50px] top-[63px] w-[3px] h-[50px] z-10 ${currentStep >= step.id ? "bg-[#266666]" : "bg-gray-300" }`} ></div> )}
                            
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-black border-[3px] font-mono ${currentStep === step.id ? "border-[#266666] bg-white" : ""} ${currentStep > step.id ? "bg-[#266666]" : "bg-transparent"}`} >
                                {currentStep > step.id ? (
                                    <span className="material-icons text-sm"></span>
                                ) : (
                                    step.id
                                )}
                            </div>

                            <div className="ml-6">
                                <h3 className={`text-lg font-albulaSemiBold ${ currentStep >= step.id ? "text-[#266666]" : "text-gray-500" }`} >
                                    {step.title}
                                </h3>
                                <p className={`text-sm font-albulaRegular ${ currentStep >= step.id ? "text-[#609c9c]" : "text-gray-500" }`}>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-[2px] rounded-full bg-gray-300 mx-6 h-[600px]" />

                <div className="w-fit h-fit">
                    {currentStep === 1 && <ChildhoodSection step={setCurrentStep}/>}
                    {currentStep === 2 && <PHQ9Section step={setCurrentStep}/>}
                </div>
            </div>
        </div>
    );
}

export default PatientMentalHealthDashboard;