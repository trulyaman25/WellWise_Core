// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PatientRegistration {
    struct Patient {
        address cryptoWalletAddress;
        string name;
        string gender;
        string healthID;
        string email;
        string password;
    }

    struct PatientList{
        string patient_number;
        string patient_name;
    }

    mapping(string => bool) public isPatientRegistered;
    mapping(string => Patient) public patients;
    mapping(string => PatientList[]) private Dpermission;
    mapping(string => mapping(string => bool)) public doctorPermissions;

    event PatientRegistered(string healthID, string name, address cryptoWalletAddress);

    function registerPatient(
        address _cryptoWalletAddress,
        string memory _name,
        string memory _gender,
        string memory _email,
        string memory _healthID,
        string memory _password

    ) external {
        require(!isPatientRegistered[_healthID], "Patient already registered");

        Patient memory newPatient = Patient({
            cryptoWalletAddress: _cryptoWalletAddress,
            name: _name,
            gender: _gender,
            email: _email,    
            healthID: _healthID,        
            password: _password
        });

        patients[_healthID] = newPatient;
        isPatientRegistered[_healthID] = true;
        emit PatientRegistered(_healthID, _name, _cryptoWalletAddress);
    }

    function isRegisteredPatient(string memory _healthID) external view returns (bool) {
        return isPatientRegistered[_healthID];
    }
    
    // Add a function to validate patient's password
    function validatePassword(string memory _healthID, string memory _password) external view returns (bool) {
        require(isPatientRegistered[_healthID], "Patient not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(patients[_healthID].password));
    }

    function getPatientDetails(string memory _healthID) external view returns (
    address cryptoWalletAddress,
    string memory name,
    string memory gender,
    string memory email
    ) {
        require(isPatientRegistered[_healthID], "Patient not registered");
        Patient memory patient = patients[_healthID];
        return (patient.cryptoWalletAddress, patient.name, patient.gender, patient.email);
    }

    function grantPermission(
        string memory _patientNumber,
        string memory _doctorNumber,
        string memory _patientName
    ) external {
        require(!doctorPermissions[_patientNumber][_doctorNumber], "View Access already given to the Doctor!");
        // Check if the patient number already exists in the list
        bool exists = false;
        for (uint i = 0; i < Dpermission[_doctorNumber].length; i++) {
            if (keccak256(abi.encodePacked(Dpermission[_doctorNumber][i].patient_number)) == keccak256(abi.encodePacked(_patientNumber))) {
                exists = true;
                break;
            }
        }

        // If the patient number does not exist, add it to the list
        if (!exists) {
            PatientList memory newRecord = PatientList(
                _patientNumber,
                _patientName
            );
            Dpermission[_doctorNumber].push(newRecord);
        }
        doctorPermissions[_patientNumber][_doctorNumber] = true;
    }

    function isPermissionGranted(string memory _patientNumber,string memory _doctorNumber) external view returns (bool) {
        return doctorPermissions[_patientNumber][_doctorNumber];
    }

    function getPatientList(string memory _doctorNumber) public view returns (PatientList[] memory) {
        return Dpermission[_doctorNumber];
    }
}
