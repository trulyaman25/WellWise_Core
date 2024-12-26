// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract DoctorRegistration {
    struct DoctorCredentials {
        address walletAddress;
        string doctorName;
        string licenseNumber;
        string email;
        string password;
    }

    struct DoctorPersonalDetails {
        string gender;
        uint256 age;
        uint256 date;
        uint256 month;
        uint256 year;
        bool maritalStatus;
    }

    struct DoctorContactDetails {
        uint256 contactNumber;
        string appartmentNumber;
        string street;
        string city;
        string state;
        string country;
    }

    struct DoctorEducationalDetails {
        string specialization;
        string heighestQualification;
        uint256 experience;
        string medicalSchool;
        uint256 graduationYear;
    }

    struct DoctorProfessionalDetails {
        string hospitalName;
        string designation;
        string department;
        uint256 consultantFees;
    }

    struct Doctor {
        DoctorCredentials credential;
        DoctorPersonalDetails personalDetails;
        DoctorContactDetails contactDetails;
        DoctorEducationalDetails educationalDetails;
        DoctorProfessionalDetails professionalDetails;
    }

    mapping(string => address) private doctorAddresses;
    mapping(string => Doctor) private doctors;

    event DoctorRegistered(string licenseNumber, string doctorName, address cryptoWalletAddress);

    function registerDoctorCredentials(
        string memory _name,
        string memory _medicalLicenseNumber,
        string memory _email,
        string memory _password
    ) public {
        doctors[_medicalLicenseNumber].credential = DoctorCredentials({
            walletAddress: msg.sender,
            doctorName: _name,
            licenseNumber: _medicalLicenseNumber,
            email: _email,
            password: _password
        });

        doctorAddresses[_medicalLicenseNumber] = msg.sender;
        emit DoctorRegistered(_medicalLicenseNumber, _name, msg.sender);
    }

    function registerDoctorPersonalDetails(
        string memory _licenseNumber,
        string memory _gender,
        uint256 _age,
        uint256 _date,
        uint256 _month,
        uint256 _year,
        bool _maritalStatus
    ) public {
        require(doctorAddresses[_licenseNumber] != address(0), "Doctor not found");
        doctors[_licenseNumber].personalDetails = DoctorPersonalDetails({
            gender: _gender,
            age: _age,
            date: _date,
            month: _month,
            year: _year,
            maritalStatus: _maritalStatus
        });
    }

    function registerDoctorContactDetails(
        string memory _licenseNumber,
        uint256 _contactNumber,
        string memory _appartmentNumber,
        string memory _street,
        string memory _city,
        string memory _state,
        string memory _country
    ) public {
        require(doctorAddresses[_licenseNumber] != address(0), "Doctor not found");
        doctors[_licenseNumber].contactDetails = DoctorContactDetails({
            contactNumber: _contactNumber,
            appartmentNumber: _appartmentNumber,
            street: _street,
            city: _city,
            state: _state,
            country: _country
        });
    }

    function registerDoctorEducationalDetails(
        string memory _licenseNumber,
        string memory _specialization,
        string memory _highestQualification,
        uint256 _experience,
        string memory _medicalSchool,
        uint256 _graduationYear
    ) public {
        require(doctorAddresses[_licenseNumber] != address(0), "Doctor not found");
        doctors[_licenseNumber].educationalDetails = DoctorEducationalDetails({
            specialization: _specialization,
            heighestQualification: _highestQualification,
            experience: _experience,
            medicalSchool: _medicalSchool,
            graduationYear: _graduationYear
        });
    }

    function registerDoctorProfessionalDetails(
        string memory _licenseNumber,
        string memory _hospitalName,
        string memory _designation,
        string memory _department,
        uint256 _consultantFees
    ) public {
        require(doctorAddresses[_licenseNumber] != address(0), "Doctor not found");
        doctors[_licenseNumber].professionalDetails = DoctorProfessionalDetails({
            hospitalName: _hospitalName,
            designation: _designation,
            department: _department,
            consultantFees: _consultantFees
        });
    }

    function validatePassword(string memory _licenseNumber, string memory _password) public view returns (bool) {
        require(doctorAddresses[_licenseNumber] != address(0), "Doctor not found");
        DoctorCredentials memory credentials = doctors[_licenseNumber].credential;
        return (keccak256(abi.encodePacked(credentials.password)) == keccak256(abi.encodePacked(_password)));
    }

    function isDoctorRegistered(string memory _licenseNumber) public view returns (bool) {
        return doctorAddresses[_licenseNumber] != address(0);
    }

    function getDoctorCredentials(string memory _licenseNumber) public view returns ( string memory doctorName, string memory licenseNumber, string memory email, address walletAddress ) {
        require(doctorAddresses[_licenseNumber] != address(0), "Doctor not registered");

        Doctor storage doctor = doctors[_licenseNumber];

        return (
            doctor.credential.doctorName,
            doctor.credential.licenseNumber,
            doctor.credential.email,
            doctor.credential.walletAddress
        );
    }

    function getDoctorPersonalDetails(string memory _licenseNumber) public view returns ( string memory gender, uint256 age, uint256 date, uint256 month, uint256 year, bool maritalStatus ) {
        require(doctorAddresses[_licenseNumber] != address(0), "Doctor not registered");

        Doctor storage doctor = doctors[_licenseNumber];

        return (
            doctor.personalDetails.gender,
            doctor.personalDetails.age,
            doctor.personalDetails.date,
            doctor.personalDetails.month,
            doctor.personalDetails.year,
            doctor.personalDetails.maritalStatus
        );
    }

    function getDoctorContactDetails(string memory _licenseNumber) public view returns ( uint256 contactNumber, string memory appartmentNumber, string memory street, string memory city, string memory state, string memory country ) {
        require(doctorAddresses[_licenseNumber] != address(0), "Doctor not registered");

        Doctor storage doctor = doctors[_licenseNumber];

        return (
            doctor.contactDetails.contactNumber,
            doctor.contactDetails.appartmentNumber,
            doctor.contactDetails.street,
            doctor.contactDetails.city,
            doctor.contactDetails.state,
            doctor.contactDetails.country
        );
    }

    function getDoctorEducationalDetails(string memory _licenseNumber) public view returns ( string memory specialization, string memory highestQualification, uint256 experience, string memory medicalSchool, uint256 graduationYear ) {
        require(doctorAddresses[_licenseNumber] != address(0), "Doctor not registered");

        Doctor storage doctor = doctors[_licenseNumber];

        return (
            doctor.educationalDetails.specialization,
            doctor.educationalDetails.heighestQualification,
            doctor.educationalDetails.experience,
            doctor.educationalDetails.medicalSchool,
            doctor.educationalDetails.graduationYear
        );
    }

    function getDoctorProfessionalDetails(string memory _licenseNumber) public view returns ( string memory hospitalName, string memory designation, string memory department, uint256 consultantFees ) {
        require(doctorAddresses[_licenseNumber] != address(0), "Doctor not registered");

        Doctor storage doctor = doctors[_licenseNumber];

        return (
            doctor.professionalDetails.hospitalName,
            doctor.professionalDetails.designation,
            doctor.professionalDetails.department,
            doctor.professionalDetails.consultantFees
        );
    }
}