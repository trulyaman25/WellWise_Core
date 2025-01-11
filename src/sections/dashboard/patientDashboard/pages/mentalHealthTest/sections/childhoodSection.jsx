import React, { useState, useEffect } from 'react';

import Web3 from "web3";
import MentalHealth from '../../../../../../build/contracts/MentalHealth.json';

function ChildhoodSection({ step, patientDetails, tID }) {
    const handleSubmit = async (e) => {
        e.preventDefault();

        const TS = totalScore / 15.0;
        const SCORE = `${TS}`
        
        try {
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const contract = new web3.eth.Contract(
                MentalHealth.abi,
                MentalHealth.networks[networkId].address
            );

            console.log(patientDetails.healthID);
             
            await contract.methods
                .initializeChildhoodDetails(
                    tID,
                    answers.question1,
                    answers.question2,
                    answers.question3,
                    answers.question4,
                    answers.question5,
                    SCORE
                )
                .send({ from: patientDetails.walletAddress });
                
            console.log("Childhood & Past Experiences Submitted Successfully");
            step(2);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while storing Childhood & Past Experiences.");
            console.log("Storing Error error:", error);
        }
    };

    const questions = [
        "Q1) During your childhood, did you experience any significant events that caused you prolonged stress or fear? (e.g., loss of a loved one, parental separation, or exposure to violence)",
        "Q2) Were there times when you felt unsupported or unsafe in your home environment as a child? (e.g., emotional neglect, lack of affection, or unstable living conditions)",
        "Q3) Did you encounter bullying or social isolation during your school years, and how did it affect you? (e.g., exclusion, humiliation, or repetitive teasing)",
        "Q4) Can you recall situations in your childhood where you felt unable to express your emotions freely? (e.g., being told to suppress feelings or fear of judgment for showing vulnerability)",
        "Q5) Have you ever faced any traumatic events in your early years that continue to affect your thoughts or feelings today? (e.g., physical abuse, emotional manipulation, or exposure to traumatic incidents)"
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [totalScore, setTotalScore] = useState(0);

    const handleAnswerChange = (value) => {
        const oldScore = answers[`question${currentQuestion + 1}`] === "Yes" ? 2 :
                         answers[`question${currentQuestion + 1}`] === "Not Sure" ? 1 : 0;
        const newScore = value === "Yes" ? 2 : value === "Not Sure" ? 1 : 0;
    
        setSelectedAnswer(value);
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [`question${currentQuestion + 1}`]: value
        }));
        setTotalScore((prevScore) => prevScore - oldScore + newScore);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            const nextQuestion = currentQuestion + 1;
            setCurrentQuestion(nextQuestion);
            setSelectedAnswer(answers[`question${nextQuestion + 1}`] || '');
        }
    };
    
    const handleBack = () => {
        if (currentQuestion > 0) {
            const prevQuestion = currentQuestion - 1;
            setCurrentQuestion(prevQuestion);
            setSelectedAnswer(answers[`question${prevQuestion + 1}`] || '');
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="w-full h-full p-10 mx-auto font-sans">
            <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col justify-between">
                <div>
                    <div className="p-6">
                        <h2 className="text-2xl font-albulaHeavy text-gray-800 mb-6">
                            Childhood and Past Experience
                        </h2>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                            <div className="bg-[#266666] h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }} ></div>
                        </div>

                        <p className="text-lg font-albulaRegular text-gray-700 mb-6">{questions[currentQuestion]}</p>

                        <div className="space-y-4">
                            {['Yes', 'No', 'Not Sure'].map((option) => (
                                <div key={option} className="flex items-center">
                                    <input 
                                        type="radio" 
                                        id={option} 
                                        name="answer" 
                                        value={option} 
                                        checked={selectedAnswer === option} 
                                        onChange={() => handleAnswerChange(option)} 
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300" 
                                    />
                                    <label htmlFor={option} className="ml-2 font-albulaRegular text-gray-700">
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-[#eef8f7] rounded-3xl px-6 py-4 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        Question {currentQuestion + 1} of {questions.length}
                    </p>

                    <div className="flex space-x-4">
                        <button 
                            onClick={handleBack} 
                            disabled={currentQuestion === 0} 
                            className="px-4 py-2 rounded-xl text-slate-600 font-albulaBold disabled:hidden"
                        >
                            Back
                        </button>
                        {currentQuestion === questions.length - 1 ? (
                            <button onClick={handleSubmit} disabled={!selectedAnswer} className={`px-10 py-2 rounded-xl text-white font-albulaBold transition-colors duration-300 ${ selectedAnswer ? 'bg-[#609c9c] hover:bg-[#266666]' : 'bg-gray-400 cursor-not-allowed' }`} >
                                SUBMIT
                            </button>
                        ) : (
                            <button onClick={handleNext} disabled={!selectedAnswer} className={`px-4 py-2 rounded-xl text-white font-albulaBold transition-colors duration-300 ${ selectedAnswer ? 'bg-[#609c9c] hover:bg-[#266666]' : 'bg-gray-400 cursor-not-allowed' }`} >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChildhoodSection;