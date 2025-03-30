pragma solidity ^0.7.3;

contract UserAuth {

    struct User {
        string name;
        string email;
        string phone;
        string encryptedDataHash;
        bool isRegistered;
    }

    mapping(address => User) public users;

    // Register a user
    function registerUser(
        string memory _name,
        string memory _email,
        string memory _phone,
        string memory _encryptedDataHash
    ) public {
        require(!users[msg.sender].isRegistered, "User is already registered.");

        users[msg.sender] = User({
            name: _name,
            email: _email,
            phone: _phone,
            encryptedDataHash: _encryptedDataHash,
            isRegistered: true
        });
    }

    // Authenticate user and fetch details
    function getUserDetails(address _walletAddress) public view returns (string memory, string memory, string memory, string memory) {
        require(users[_walletAddress].isRegistered, "User not found.");

        User memory user = users[_walletAddress];
        return (user.name, user.email, user.phone, user.encryptedDataHash);
    }
}
