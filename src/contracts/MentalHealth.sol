// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract MentalHealth {
    struct mhtChildhoodDetails {
        string questionOne;
        string questionTwo;
        string questionThree;
        string questionFour;
        string questionFive;
    }

    struct mhtphq9SectionOne {
        string questionOne;
        string questionTwo;
        string questionThree;
        string questionFour;
        string questionFive;
    }

    struct mhtphq9SectionTwo {
        string questionSix;
        string questionSeven;
        string questionEight;
        string questionNine;
    }

    struct PatientMHTest {
        address cryptoWalletAddress;
        string healthID;
        string testID;
        mhtChildhoodDetails mhtcd;
        mhtphq9SectionOne mhtphqOne;
        mhtphq9SectionTwo mhtphqTwo;
        string textSentiment;
        string audioHash;
    }

    mapping(string => PatientMHTest) private patientTests;

    function initializePatientMHTest( string memory _healthID, string memory _testID, address _cryptoWalletAddress ) public {
        patientTests[_healthID] = PatientMHTest({
            healthID: _healthID,
            testID: _testID,
            cryptoWalletAddress: _cryptoWalletAddress,
            mhtcd: mhtChildhoodDetails("", "", "", "", ""),
            mhtphqOne: mhtphq9SectionOne("", "", "", "", ""),
            mhtphqTwo: mhtphq9SectionTwo("", "", "", ""),
            textSentiment: "",
            audioHash: ""
        });
    }

    function initializeChildhoodDetails( string memory _healthID, string memory _questionOne, string memory _questionTwo, string memory _questionThree, string memory _questionFour, string memory _questionFive ) public {
        mhtChildhoodDetails memory mhtcd = mhtChildhoodDetails({
            questionOne: _questionOne,
            questionTwo: _questionTwo,
            questionThree: _questionThree,
            questionFour: _questionFour,
            questionFive: _questionFive
        });

        patientTests[_healthID].mhtcd = mhtcd;
    }

    function initializePHQ9SectionOne( string memory _healthID, string memory _questionOne, string memory _questionTwo, string memory _questionThree, string memory _questionFour, string memory _questionFive ) public {
        mhtphq9SectionOne memory mhtphqOne = mhtphq9SectionOne({
            questionOne: _questionOne,
            questionTwo: _questionTwo,
            questionThree: _questionThree,
            questionFour: _questionFour,
            questionFive: _questionFive
        });

        patientTests[_healthID].mhtphqOne = mhtphqOne;
    }

    function initializePHQ9SectionTwo( string memory _healthID, string memory _questionSix, string memory _questionSeven, string memory _questionEight, string memory _questionNine ) public {
        mhtphq9SectionTwo memory mhtphqTwo = mhtphq9SectionTwo({
            questionSix: _questionSix,
            questionSeven: _questionSeven,
            questionEight: _questionEight,
            questionNine: _questionNine
        });

        patientTests[_healthID].mhtphqTwo = mhtphqTwo;
    }

    function initializeSentimentAnalysis(string memory _healthID, string memory _text, string memory _hash) public {
        patientTests[_healthID].textSentiment = _text;
        patientTests[_healthID].audioHash = _hash;
    }

    function getSentimentAnalysis(string memory _healthID) public view returns ( string memory text, string memory audioHash){
        return(
            patientTests[_healthID].textSentiment,
            patientTests[_healthID].audioHash
        );
    }

    function getChildhoodDetails(string memory _healthID) public view returns ( string memory questionOne, string memory questionTwo, string memory questionThree, string memory questionFour, string memory questionFive ) {
        mhtChildhoodDetails memory mhtcd = patientTests[_healthID].mhtcd;
        return (
            mhtcd.questionOne,
            mhtcd.questionTwo,
            mhtcd.questionThree,
            mhtcd.questionFour,
            mhtcd.questionFive
        );
    }

    function getPHQ9SectionOne(string memory _healthID) public view returns ( string memory questionOne, string memory questionTwo, string memory questionThree, string memory questionFour, string memory questionFive ) {
        mhtphq9SectionOne memory mhtphqOne = patientTests[_healthID].mhtphqOne;
        return (
            mhtphqOne.questionOne,
            mhtphqOne.questionTwo,
            mhtphqOne.questionThree,
            mhtphqOne.questionFour,
            mhtphqOne.questionFive
        );
    }

    function getPHQ9SectionTwo(string memory _healthID) public view returns ( string memory questionSix, string memory questionSeven, string memory questionEight, string memory questionNine ) {
        mhtphq9SectionTwo memory mhtphqTwo = patientTests[_healthID].mhtphqTwo;
        return (
            mhtphqTwo.questionSix,
            mhtphqTwo.questionSeven,
            mhtphqTwo.questionEight,
            mhtphqTwo.questionNine
        );
    }
}