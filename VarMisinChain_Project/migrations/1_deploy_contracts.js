const Betting = artifacts.require("Betting");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(Betting, {from: accounts[1]});
};
