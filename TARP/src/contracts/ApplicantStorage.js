import Web3 from 'web3';
import ApplicantStorage from './ApplicantStorageInte.json'; // Your compiled contract ABI

let web3;
let contract;

const loadBlockchainData = async () => {
  web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = ApplicantStorage.networks[networkId];
  contract = new web3.eth.Contract(
    ApplicantStorage.abi,
    deployedNetwork && deployedNetwork.address,
  );
  return contract;
};

const setApplicantData = async (contract, name, email, phone, addressDetails) => {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.setApplicant(name, email, phone, addressDetails).send({ from: accounts[0] });
};

const getApplicantData = async (contract, address) => {
  const applicant = await contract.methods.getApplicant(address).call();
  console.log(applicant);  // Log the applicant details
  return await contract.methods.getApplicant(address).call();
};
