import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import MentalHealth from '../../../../../../build/contracts/MentalHealth.json';

function PHQ9Section({ step, patientDetails }) {
    const handleSubmitOne = async (e) => {
        e.preventDefault();
        // try {
        //     const web3 = new Web3(window.ethereum);
        //     const networkId = await web3.eth.net.getId();
        //     const contract = new web3.eth.Contract(
        //         MentalHealth.abi,
        //         MentalHealth.networks[networkId].address
        //     );

        //     await contract.methods
        //         .initializePHQ9SectionOne(
        //             patientDetails.healthID,
        //             answers.question1,
        //             answers.question2,
        //             answers.question3,
        //             answers.question4,
        //             answers.question5,
        //         )
        //         .send({ from: patientDetails.walletAddress });

        //     console.log("Successfully Saved your PHQ9 Progress");
            handleNext();
        // } catch (error) {
        //     console.error("Error:", error);
        //     alert("An error occurred while saving your progress.");
        //     console.log("Storing Error error:", error);
        // }
    };

    const handleSubmitTwo = async (e) => {
        e.preventDefault();
        // try {
        //     const web3 = new Web3(window.ethereum);
        //     const networkId = await web3.eth.net.getId();
        //     const contract = new web3.eth.Contract(
        //         MentalHealth.abi,
        //         MentalHealth.networks[networkId].address
        //     );

        //     await contract.methods
        //         .initializePHQ9SectionTwo(
        //             patientDetails.healthID,
        //             answers.question6,
        //             answers.question7,
        //             answers.question8,
        //             answers.question9
        //         )
        //         .send({ from: patientDetails.walletAddress });

        //     console.log("Mental Health Smart contract loaded successfully.");
            console.log("Total Score:", totalScore / 27.0);
            step(3);
        // } catch (error) {
        //     console.error("Error:", error);
        //     alert("An error occurred while saving your progress.");
        //     console.log("Storing Error error:", error);
        // }
    };

    const questions = [
        "Q1) Have you lost interest in doing things you usually enjoy?",
        "Q2) Have you been feeling down, sad, or hopeless lately?",
        "Q3) Are you having trouble sleeping, or maybe sleeping too much?",
        "Q4) Do you often feel tired or like you don’t have much energy?",
        "Q5) Has your appetite changed — eating too little or too much?",
        "Q6) Do you feel bad about yourself, like you’ve let yourself or others down?",
        "Q7) Is it hard to focus on things, like reading or watching TV?",
        "Q8) Have you noticed feeling really restless or the opposite — super slow, like others might notice?",
        "Q9) Have you had any thoughts about not wanting to be here or hurting yourself?"
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [totalScore, setTotalScore] = useState(0);

    const handleAnswerChange = (value) => {
        const oldScore = answers[`question${currentQuestion + 1}`] === "3" ? 3 :
                         answers[`question${currentQuestion + 1}`] === "2" ? 2 : 
                         answers[`question${currentQuestion + 1}`] === "1" ? 1 : 0;
        const newScore = value === "3" ? 3 : value === "2" ? 2 : value === "1" ? 1 : 0;
    
        setSelectedAnswer(value);
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [`question${currentQuestion + 1}`]: value
        }));
        setTotalScore((prevScore) => prevScore - oldScore + newScore);
    };

    useEffect(() => {
        setSelectedAnswer(answers[`question${currentQuestion + 1}`] || "");
    }, [currentQuestion, answers]);

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="w-full max-w-2xl mx-auto font-sans">
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-albulaHeavy text-gray-800 mb-6">
                        PHQ-9 Assessment
                    </h2>

                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                        <div className="bg-[#266666] h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }} ></div>
                    </div>

                    <p className="text-lg font-albulaRegular text-gray-700 mb-6">{questions[currentQuestion]}</p>

                    <div className="space-y-4">
                        {['0', '1', '2', '3'].map((option, index) => (
                            <div key={option} className="flex items-center">
                                <input type="radio" id={option} 
                                    name="answer" 
                                    value={option} 
                                    checked={selectedAnswer === option} 
                                    onChange={() => handleAnswerChange(option)} 
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-[#266666] focus:ring-2" />
                                <label htmlFor={option} className="ml-2 font-albulaRegular text-gray-700">
                                    {['Not at all', 'Several days', 'More than half the days', 'Nearly every day'][index]}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#eef8f7] rounded-3xl px-6 py-4 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        Question {currentQuestion + 1} of {questions.length}
                    </p>

                    <div className="flex space-x-4">
                        <button onClick={handleBack} disabled={currentQuestion === 0} className="px-4 py-2 rounded-xl text-slate-600 font-albulaBold disabled:hidden" >
                            Back
                        </button>
                        {
                            currentQuestion === 4 || currentQuestion === 8 ? (
                                <button 
                                    onClick={(e) => {
                                        if (currentQuestion === 8) {
                                            handleSubmitTwo(e);
                                        } else {
                                            handleSubmitOne(e);
                                        }
                                    }} 
                                    disabled={!selectedAnswer} 
                                    className={`px-10 py-2 rounded-xl text-white font-albulaBold transition-colors duration-300 ${ selectedAnswer ? 'bg-[#609c9c] hover:bg-[#266666]' : 'bg-gray-400 cursor-not-allowed' }`} >
                                    {currentQuestion === 8 ? 'SUBMIT' : 'Save Your Progress'}
                                </button>
                            ) : (
                                <button onClick={handleNext} disabled={!selectedAnswer} className={`px-4 py-2 rounded-xl text-white font-albulaBold transition-colors duration-300 ${ selectedAnswer ? 'bg-[#609c9c] hover:bg-[#266666]' : 'bg-gray-400 cursor-not-allowed' }`} >
                                    Next
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PHQ9Section;