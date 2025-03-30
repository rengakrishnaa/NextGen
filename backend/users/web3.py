from web3 import Web3

# Connect to local Ethereum node
web3 = Web3(Web3.HTTPProvider('http://localhost:7545'))  # Adjust your network

# Load the contract ABI and address
contract_address = "0x70b06EF410A4C47c9175934ef656D66F035C3326"  # Replace with your contract address
contract_abi = [...]  # Add your contract ABI here

# Interact with the contract
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# Get user details by wallet address
def get_user_details(wallet_address):
    user_details = contract.functions.getUserDetails(wallet_address).call()
    return {
        'name': user_details[0],
        'email': user_details[1],
        'phone': user_details[2]
    }
