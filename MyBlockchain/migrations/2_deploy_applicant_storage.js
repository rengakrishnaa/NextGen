const ApplicantStorage = artifacts.require("ApplicantStorage");

module.exports = function(deployer) {
    deployer.deploy(ApplicantStorage);
};
