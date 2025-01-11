// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract MentalHealth {
    struct PatientCredentials {
        address cryptoWalletAddress;
        string healthID;
        string testID;
    }

    struct mhtChildhoodDetails {
        string questionOne;
        string questionTwo;
        string questionThree;
        string questionFour;
        string questionFive;
        string score;
    }

    struct mhtPHQ9Details {
        string questionOne;
        string questionTwo;
        string questionThree;
        string questionFour;
        string questionFive;
        string questionSix;
        string questionSeven;
        string questionEight;
        string questionNine;
        string score;
    }

    struct SentimentDetails {
        string textSentiment;
        string audioHash;
        string score;
    }

    struct VideoAnalysis {
        string blinkCount;
    }

    struct PatientMHTest {
        PatientCredentials credentials;
        mhtChildhoodDetails mhtcd;
        mhtPHQ9Details mhtphqDetails;
        SentimentDetails sentimentDetails;
        VideoAnalysis videoDetails;
    }

    mapping(string => string[]) private healthIDToTestIDs;
    mapping(string => PatientMHTest) private testIDToPatientTest;

    function initializePatientMHTest( string memory _healthID, string memory _testID, address _cryptoWalletAddress ) public {
        require(bytes(testIDToPatientTest[_testID].credentials.testID).length == 0, "TestID already exists");

        healthIDToTestIDs[_healthID].push(_testID);

        testIDToPatientTest[_testID] = PatientMHTest({
            credentials: PatientCredentials({
                healthID: _healthID,
                testID: _testID,
                cryptoWalletAddress: _cryptoWalletAddress
            }),
            mhtcd: mhtChildhoodDetails("", "", "", "", "", ""),
            mhtphqDetails: mhtPHQ9Details("", "", "", "", "", "", "", "", "", ""),
            sentimentDetails: SentimentDetails("", "", ""),
            videoDetails: VideoAnalysis("")
        });
    }

    function initializeChildhoodDetails( string memory _testID, string memory _questionOne, string memory _questionTwo, string memory _questionThree, string memory _questionFour, string memory _questionFive, string memory _score ) public {
        mhtChildhoodDetails memory mhtcd = mhtChildhoodDetails({
            questionOne: _questionOne,
            questionTwo: _questionTwo,
            questionThree: _questionThree,
            questionFour: _questionFour,
            questionFive: _questionFive,
            score: _score
        });

        testIDToPatientTest[_testID].mhtcd = mhtcd;
    }

    function initializePHQ9Details( string memory _testID, string memory _questionOne, string memory _questionTwo, string memory _questionThree, string memory _questionFour, string memory _questionFive, string memory _questionSix, string memory _questionSeven, string memory _questionEight, string memory _questionNine, string memory _score ) public {
        mhtPHQ9Details memory mhtphqDetails = mhtPHQ9Details({
            questionOne: _questionOne,
            questionTwo: _questionTwo,
            questionThree: _questionThree,
            questionFour: _questionFour,
            questionFive: _questionFive,
            questionSix: _questionSix,
            questionSeven: _questionSeven,
            questionEight: _questionEight,
            questionNine: _questionNine,
            score: _score
        });

        testIDToPatientTest[_testID].mhtphqDetails = mhtphqDetails;
    }

    function initializeSentimentDetails( string memory _testID, string memory _text, string memory _hash ) public {
        SentimentDetails memory sentimentDetails = SentimentDetails({
            textSentiment: _text,
            audioHash: _hash,
            score: ""
        });

        testIDToPatientTest[_testID].sentimentDetails = sentimentDetails;
    }

    function initializeSentimentalScore( string memory _testID, string memory _score) public {
        string memory prevText = testIDToPatientTest[_testID].sentimentDetails.textSentiment;
        string memory prevHash = testIDToPatientTest[_testID].sentimentDetails.audioHash;
        SentimentDetails memory sentimentDetails = SentimentDetails({
            textSentiment: prevText,
            audioHash: prevHash,
            score: _score
        });
        
        testIDToPatientTest[_testID].sentimentDetails = sentimentDetails;
    }

    function getAllTestIDs(string memory _healthID) public view returns (string[] memory) {
        return healthIDToTestIDs[_healthID];
    }

    function getChildhoodDetails(string memory _testID) public view returns (mhtChildhoodDetails memory) {
        return testIDToPatientTest[_testID].mhtcd;
    }

    function getPHQ9Details(string memory _testID) public view returns (mhtPHQ9Details memory) {
        return testIDToPatientTest[_testID].mhtphqDetails;
    }

    function getSentimentDetails(string memory _testID) public view returns (SentimentDetails memory) {
        return testIDToPatientTest[_testID].sentimentDetails;
    }

    function getCompleteTestDetails(string memory _testID) public view returns (PatientMHTest memory) {
        return testIDToPatientTest[_testID];
    }
}