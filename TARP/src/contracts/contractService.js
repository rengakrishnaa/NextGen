import Web3 from 'web3';
import ApplicantStorage from './ApplicantStorageInte.json'; // Adjust the path as necessary

let web3;
let contract;

const initWeb3 = async () => {
  web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = ApplicantStorage.networks[networkId];
  contract = new web3.eth.Contract(
    ApplicantStorage.abi,
    deployedNetwork && deployedNetwork.address,
  );
};

const setApplicantData = async (name, email, phone, addressDetails) => {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.setApplicant(name, email, phone, addressDetails).send({ from: accounts[0] });
};

const getApplicantData = async (address) => {
  return await contract.methods.getApplicant(address).call();
};

export { initWeb3, setApplicantData, getApplicantData };
