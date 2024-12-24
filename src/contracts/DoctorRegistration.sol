// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract DoctorRegistration {
    struct Doctor {
        address cryptoWalletAddress;
        string doctorName;
        string gender;
        string hospitalName;
        string specialization;
        string licenseNumber;
        string email;
        string password;
    }

    struct PatientList {
        string patient_number;
        string patient_name;
    }

    mapping(string => address) private doctorAddresses;
    mapping(string => Doctor) private doctors;
    mapping(string => PatientList[]) private Dpermission;
    mapping(string => mapping(string => bool)) public doctorPermissions;

    event DoctorRegistered(string licenseNumber, string doctorName, address cryptoWalletAddress);
    event PatientPermissionGranted(string doctorNumber, string patientNumber, string patientName);

    function registerDoctor(
        string memory _doctorName,
        string memory _hospitalName,
        string memory _gender,
        string memory _email,
        string memory _licenseNumber,
        string memory _specialization,
        string memory _password
    ) public {
        require(doctorAddresses[_licenseNumber] == address(0), "Doctor already registered");

        Doctor memory newDoctor = Doctor({
            cryptoWalletAddress: msg.sender,
            doctorName: _doctorName,
            hospitalName: _hospitalName,
            gender: _gender,
            email: _email,
            licenseNumber: _licenseNumber,
            specialization: _specialization,
            password: _password
        });

        doctors[_licenseNumber] = newDoctor;
        doctorAddresses[_licenseNumber] = msg.sender;
        emit DoctorRegistered(_licenseNumber, _doctorName, msg.sender);
    }

    function isRegisteredDoctor(string memory _licenseNumber) public view returns (bool) {
        return doctorAddresses[_licenseNumber] != address(0);
    }

    function getDoctorDetails(string memory _licenseNumber)
        public
        view
        returns (
            address,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        require(doctorAddresses[_licenseNumber] != address(0), "Doctor not registered");
        Doctor memory doctor = doctors[_licenseNumber];
        return (
            doctor.cryptoWalletAddress,
            doctor.doctorName,
            doctor.hospitalName,
            doctor.gender,
            doctor.email,
            doctor.specialization
        );
    }

    function validatePassword(string memory _licenseNumber, string memory _password) public view returns (bool) {
        require(doctorAddresses[_licenseNumber] != address(0), "Doctor not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(doctors[_licenseNumber].password));
    }

    function grantPermission(
        string memory _patientNumber,
        string memory _doctorNumber,
        string memory _patientName
    ) public {
        PatientList memory newRecord = PatientList({
            patient_number: _patientNumber,
            patient_name: _patientName
        });
        Dpermission[_doctorNumber].push(newRecord);
        doctorPermissions[_patientNumber][_doctorNumber] = true;
        emit PatientPermissionGranted(_doctorNumber, _patientNumber, _patientName);
    }

    function isPermissionGranted(string memory _patientNumber, string memory _doctorNumber) public view returns (bool) {
        return doctorPermissions[_patientNumber][_doctorNumber];
    }

    function revokePermission(string memory _patientNumber, string memory _doctorNumber) public {
        doctorPermissions[_patientNumber][_doctorNumber] = false;

        for (uint i = 0; i < Dpermission[_doctorNumber].length; i++) {
            if (
                keccak256(abi.encodePacked(Dpermission[_doctorNumber][i].patient_number)) ==
                keccak256(abi.encodePacked(_patientNumber))
            ) {
                for (uint j = i; j < Dpermission[_doctorNumber].length - 1; j++) {
                    Dpermission[_doctorNumber][j] = Dpermission[_doctorNumber][j + 1];
                }
                Dpermission[_doctorNumber].length--;
                break;
            }
        }
    }

    function getPatientCount(string memory _doctorNumber) public view returns (uint) {
        return Dpermission[_doctorNumber].length;
    }

    function getPatientByIndex(string memory _doctorNumber, uint index) public view returns (string memory, string memory) {
        require(index < Dpermission[_doctorNumber].length, "Invalid index");
        PatientList memory patient = Dpermission[_doctorNumber][index];
        return (patient.patient_number, patient.patient_name);
    }
}