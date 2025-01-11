import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import axios from "axios";
import MentalHealth from "../../../../../../build/contracts/MentalHealth.json";

function SentimentAnalysis({ step, patientDetails, tID }) {
    const [audioHash, setAudioHash] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({ textResponse: "", audioResponse: null });
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const audioRef = useRef();
    const mediaRecorder = useRef();
    const audioChunks = useRef([]);

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

    const uploadToPinata = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const metadata = JSON.stringify({
            name: "audioResponse",
        });
        formData.append("pinataMetadata", metadata);

        const options = JSON.stringify({
            cidVersion: 0,
        });
        formData.append("pinataOptions", options);

        try {
            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    pinata_api_key: "04b26ee360171f03ae2b",
                    pinata_secret_api_key: "250fe3ce90862d18f94ced6c065a6bec5a956d528aef8ab9d737a9b3f0ca8065",
                },
            });
            return res.data.IpfsHash;
        } catch (error) {
            console.error("Error uploading to Pinata:", error);
            throw new Error("Failed to upload audio to Pinata.");
        }
    };

    const handleTextChange = (e) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            textResponse: e.target.value,
        }));
    };

    const startRecording = async () => {
        audioChunks.current = []; // Clear previous audio chunks
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder.current = new MediaRecorder(stream);

                mediaRecorder.current.ondataavailable = (event) => {
                    audioChunks.current.push(event.data);
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

    const stopRecording = async () => {
        setRecording(false);

        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = async () => {
            const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
            const localURL = URL.createObjectURL(audioBlob);

            setAudioURL(localURL);

            try {
                const hash = await uploadToPinata(new File([audioBlob], "audioResponse.wav"));
                setAudioHash(hash);
                console.log("Audio uploaded successfully. IPFS Hash:", hash);
            } catch (error) {
                console.error("Error uploading audio:", error);
            }
        };
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!audioHash) {
            alert("Audio upload is not complete. Please wait and try again.");
            return;
        }

        sendToBackend();

        try {
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const contract = new web3.eth.Contract(
                MentalHealth.abi,
                MentalHealth.networks[networkId].address
            );

            await contract.methods
                .initializeSentimentDetails(
                    tID, 
                    answers.textResponse, 
                    audioHash
                )
                .send({ from: patientDetails.walletAddress });

            console.log("Data successfully stored for sentiment analysis.");
            step(4);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while storing your sentiment analysis answers.");
        }
    };

    const sendToBackend = async (e) => {
        e.preventDefault();
    
        if (!audioHash) {
            alert("Audio upload is not complete. Please wait and try again.");
            return;
        }
    
        try {
            // Prepare the data to be sent to the backend
            const payload = {
                text_1: answers.textResponse, // Assuming `answers` contains `textResponse`
                text_2: audioHash
            };
    
            // Make a POST request to the backend
            const response = await fetch("http://localhost:5000/process_sentiment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log("Response from backend:", result);
    
            // Proceed to the next step
            step(4);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while sending your sentiment analysis data.");
        }
    };
    

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="w-full h-full p-10 mx-auto font-sans">
            <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col justify-between">
                <div>
                    <div className="p-6">
                        <h2 className="text-2xl font-albulaHeavy text-gray-800 mb-6">
                            Sentiment Analysis
                        </h2>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                            <div
                                className="bg-[#266666] h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <p className="text-lg font-albulaRegular text-gray-700 mb-6">
                            {questions[currentQuestion].text}
                        </p>

                        {questions[currentQuestion].type === "text" && (
                            <textarea
                                className="w-full h-[300px] font-albulaRegular p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#266666]"
                                rows="4"
                                placeholder="Type your response here..."
                                value={answers.textResponse}
                                onChange={handleTextChange}
                            ></textarea>
                        )}

                        {questions[currentQuestion].type === "audio" && (
                            <div className="flex flex-row justify-between items-center space-x-7">
                                <div className="flex items-center space-x-4">
                                    {recording ? (
                                        <button
                                            onClick={stopRecording}
                                            className="px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-800"
                                        >
                                            Stop Recording
                                        </button>
                                    ) : (
                                        <button
                                            onClick={startRecording}
                                            className="px-10 py-2 rounded-xl bg-[#609c9c] text-white font-albulaBold transition-colors duration-300"
                                        >
                                            Start Recording
                                        </button>
                                    )}
                                </div>

                                {audioURL && (
                                    <audio ref={audioRef} controls src={audioURL} className="w-full"></audio>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#eef8f7] rounded-3xl px-6 py-4 flex justify-between items-center">
                    <p className="text-sm font-albulaRegular text-gray-500">
                        Question {currentQuestion + 1} of {questions.length}
                    </p>

                    <div className="flex space-x-4">
                        <button onClick={handleBack} disabled={currentQuestion === 0} className="px-4 py-2 rounded-xl text-slate-600 font-albulaBold disabled:hidden" >
                            Back
                        </button>
                        {currentQuestion === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={!answers.textResponse || !audioHash}
                                className={`px-10 py-2 rounded-xl text-white font-albulaBold transition-colors duration-300 ${
                                    answers.textResponse && audioHash
                                        ? "bg-[#266666] hover:bg-[#609c9c]"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                Submit
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={
                                    questions[currentQuestion].type === "text" && !answers.textResponse
                                }
                                className={`px-4 py-2 rounded-xl text-white ${
                                    (questions[currentQuestion].type === "text" &&
                                        answers.textResponse) ||
                                    questions[currentQuestion].type === "audio"
                                        ? "bg-[#266666] hover:bg-[#609c9c]"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
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
