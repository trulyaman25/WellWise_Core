// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract DiagnosticRegistration {
    struct Diagnostic {
        address cryptoWalletAddress;
        string dispensaryName;
        string hospitalName;
        string licenseNumber;
        string email;
        string password;
    }

    mapping(string => address) private diagnosticAddresses;
    mapping(string => Diagnostic) private diagnostics;

    event DiagnosticRegistered(string licenseNumber, string dispensaryName, address cryptoWalletAddress);

    function registerDiagnostic( string memory _dispensaryName, string memory _hospitalName, string memory _licenseNumber, string memory _email, string memory _password ) public {
        require(diagnosticAddresses[_licenseNumber] == address(0), "Diagnostic already registered");
        Diagnostic memory newDiagnostic = Diagnostic({
            cryptoWalletAddress: msg.sender,
            dispensaryName: _dispensaryName,
            hospitalName: _hospitalName,
            licenseNumber: _licenseNumber,
            email: _email,
            password: _password
        });

        diagnostics[_licenseNumber] = newDiagnostic;
        diagnosticAddresses[_licenseNumber] = msg.sender;
        emit DiagnosticRegistered(_licenseNumber, _dispensaryName, msg.sender);
    }

    function isRegisteredDiagnostic(string memory _licenseNumber) public view returns (bool) {
        return diagnosticAddresses[_licenseNumber] != address(0);
    }

    function getDiagnosticDetails(string memory _licenseNumber) public view returns ( address _cryptoWalletAddress, string memory _dispensaryName, string memory _hospitalName, string memory _email ) {
        require(diagnosticAddresses[_licenseNumber] != address(0), "Diagnostic not registered");
        Diagnostic memory diagnostic = diagnostics[_licenseNumber];
        return ( diagnostic.cryptoWalletAddress, diagnostic.dispensaryName, diagnostic.hospitalName, diagnostic.email );
    }

    function validatePassword(string memory _licenseNumber, string memory _password) public view returns (bool) {
        require(diagnosticAddresses[_licenseNumber] != address(0), "Diagnostic not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(diagnostics[_licenseNumber].password));
    }
}