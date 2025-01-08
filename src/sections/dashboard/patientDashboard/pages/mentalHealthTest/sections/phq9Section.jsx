import React, { useState } from 'react';

function PHQ9Section({ step }) {
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

    const handleAnswerChange = (value) => {
        setSelectedAnswer(value);
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [currentQuestion]: parseInt(value, 10),
        }));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(answers[currentQuestion + 1] || "");
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedAnswer(answers[currentQuestion - 1] || "");
        }
    };

    const handleSubmit = () => {
        const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
        console.log("PHQ-9 Total Score:", totalScore);
        console.log(answers);
        step(3);
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
                                <input type="radio" id={option} name="answer" value={option} checked={selectedAnswer === option} onChange={() => handleAnswerChange(option)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-[#266666] focus:ring-2" />
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

export default PHQ9Section;
