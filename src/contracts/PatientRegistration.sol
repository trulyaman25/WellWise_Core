// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract PatientRegistration {
    struct Patient {
        address cryptoWalletAddress;
        string name;
        string gender;
        string healthID;
        string email;
        string password;
    }

    struct PatientList {
        string patient_number;
        string patient_name;
    }

    mapping(string => bool) public isPatientRegistered;
    mapping(string => Patient) public patients;
    mapping(string => mapping(uint256 => PatientList)) private Dpermission;
    mapping(string => uint256) private doctorPatientCount;
    mapping(string => mapping(string => bool)) public doctorPermissions;

    event PatientRegistered(string healthID, string name, address cryptoWalletAddress);

    function registerPatient(
        address _cryptoWalletAddress,
        string memory _name,
        string memory _gender,
        string memory _email,
        string memory _healthID,
        string memory _password
    ) public {
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

    function isRegisteredPatient(string memory _healthID) public view returns (bool) {
        return isPatientRegistered[_healthID];
    }

    function validatePassword(string memory _healthID, string memory _password) public view returns (bool) {
        require(isPatientRegistered[_healthID], "Patient not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(patients[_healthID].password));
    }

    function getPatientDetails(string memory _healthID) public view returns (
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
    ) public {
        require(!doctorPermissions[_patientNumber][_doctorNumber], "View Access already given to the Doctor!");

        // Track the patient for the doctor
        uint256 patientCount = doctorPatientCount[_doctorNumber];
        Dpermission[_doctorNumber][patientCount] = PatientList({
            patient_number: _patientNumber,
            patient_name: _patientName
        });
        doctorPatientCount[_doctorNumber]++;

        doctorPermissions[_patientNumber][_doctorNumber] = true;
    }

    function isPermissionGranted(string memory _patientNumber, string memory _doctorNumber) public view returns (bool) {
        return doctorPermissions[_patientNumber][_doctorNumber];
    }

    function getPatientList(string memory _doctorNumber) public view returns (string memory, string memory) {
        uint256 patientCount = doctorPatientCount[_doctorNumber];
        
        // Return a single patient or return just the first entry to avoid complexity
        if (patientCount > 0) {
            PatientList memory patient = Dpermission[_doctorNumber][0];  // Change index as needed
            return (patient.patient_number, patient.patient_name);
        }
        
        // If no patient, return an empty string
        return ("", "");
    }
}
