// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

contract ApplicantStorage {
    struct Applicant {
        string name;
        string email;
        string phone;
        string addressDetails;
    }

    mapping(address => Applicant) private applicants;

    function setApplicant(string memory _name, string memory _email, string memory _phone, string memory _addressDetails) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(bytes(_phone).length > 0, "Phone cannot be empty");
        require(bytes(_addressDetails).length > 0, "Address cannot be empty");
        
        applicants[msg.sender] = Applicant(_name, _email, _phone, _addressDetails);
    }

    function getApplicant(address _applicantAddress) public view returns (string memory, string memory, string memory, string memory) {
        Applicant memory applicant = applicants[_applicantAddress];
        return (applicant.name, applicant.email, applicant.phone, applicant.addressDetails);
    }
}
