import React, { useState, useEffect, useRef } from 'react';
import Web3 from "web3";
import MentalHealth from '../../../../../../build/contracts/MentalHealth.json';

function SentimentAnalysis({ step, patientDetails }) {
    const [audioHash, setAudioHash] = useState("sdsd");

    const handleSubmit = async (e) => {
        // e.preventDefault();
        // try {
        //     const web3 = new Web3(window.ethereum);
        //     const networkId = await web3.eth.net.getId();
        //     const contract = new web3.eth.Contract(
        //         MentalHealth.abi,
        //         MentalHealth.networks[networkId].address
        //     );

        //     await contract.methods
        //         .initializeSentimentAnalysis(
        //             patientDetails.healthID,
        //             answers.textResponse,
        //             audioHash
        //         )
        //         .send({ from: patientDetails.walletAddress });

        //     console.log("Successfully Stored your Sentiment Analysis");
        //     handleNext();
            step(4);
        // } catch (error) {
        //     console.error("Error:", error);
        //     alert("An error occurred while Stored your sentiment analysis answers.");
        //     console.log("Storing Error error:", error);
        // }
    };

    const questions = [
        {
            id: 1,
            text: "Can you describe how you've been feeling emotionally over the past week?",
            type: "text",
        },
        {
            id: 2,
            text: "Please record your response to the question: 'What has been on your mind lately?'",
            type: "audio",
        },
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({ textResponse: '', audioResponse: null });
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const audioRef = useRef();
    const mediaRecorder = useRef();

    const handleTextChange = (e) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            textResponse: e.target.value,
        }));
    };

    const startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder.current = new MediaRecorder(stream);

                const audioChunks = [];
                mediaRecorder.current.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.current.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioFile = new File([audioBlob], 'audioResponse.wav');
                    setAnswers((prevAnswers) => ({
                        ...prevAnswers,
                        audioResponse: audioFile,
                    }));

                    setAudioURL(URL.createObjectURL(audioBlob));
                };

                mediaRecorder.current.start();
                setRecording(true);
            } catch (error) {
                console.error("Error accessing microphone:", error);
                alert("Microphone access is required to record audio.");
            }
        } else {
            alert("Audio recording is not supported on this browser.");
        }
    };

    const stopRecording = () => {
        mediaRecorder.current.stop();
        setRecording(false);
    };

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
                        Sentiment Analysis
                    </h2>

                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                        <div className="bg-[#266666] h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }}></div>
                    </div>

                    <p className="text-lg font-albulaRegular text-gray-700 mb-4">
                        {questions[currentQuestion].text}
                    </p>

                    {questions[currentQuestion].type === "text" && (
                        <textarea className="w-full p-4 border font-albulaRegular border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#266666]" rows="4" placeholder="Type your response here..." value={answers.textResponse} onChange={handleTextChange} ></textarea>
                    )}

                    {questions[currentQuestion].type === "audio" && (
                        <div className="flex items-center space-x-4">
                            {recording ? (
                                <button onClick={stopRecording} className="px-6 py-2 rounded-xl bg-red-600 text-white font-albulaBold hover:bg-red-800" >
                                    Stop Recording
                                </button>
                            ) : (
                                <button onClick={startRecording} className="px-6 py-2 rounded-xl bg-[#609c9c] text-white font-albulaBold hover:bg-[#266666]" >
                                    Start Recording
                                </button>
                            )}

                            {audioURL && (
                                <audio ref={audioRef} controls src={audioURL} className="ml-4"></audio>
                            )}
                        </div>
                    )}
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
                            <button onClick={handleSubmit} disabled={!answers.textResponse || !answers.audioResponse} className={`px-10 py-2 rounded-xl text-white font-albulaBold transition-colors duration-300 ${ answers.textResponse && answers.audioResponse ? 'bg-[#609c9c] hover:bg-[#266666]' : 'bg-gray-400 cursor-not-allowed' }`} >
                                SUBMIT
                            </button>
                        ) : (
                            <button onClick={handleNext} disabled={ questions[currentQuestion].type === "text" && !answers.textResponse } className={`px-4 py-2 rounded-xl text-white font-albulaBold transition-colors duration-300 ${ (questions[currentQuestion].type === "text" && answers.textResponse) || questions[currentQuestion].type === "audio" ? 'bg-[#609c9c] hover:bg-[#266666]' : 'bg-gray-400 cursor-not-allowed' }`} >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SentimentAnalysis;
