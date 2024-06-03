// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Betting {
    address payable public bank;
    address payable public player;
    uint256 public betAmount;
    uint256 public odds; // Oranları bir ölçekleme faktörü ile saklıyoruz
    event BetPlaced(address indexed player, uint256 amount, uint256 odds);
    event PayoutSuccess(address indexed player, uint256 payout);
    event ErrorLog(string message);
    event Funded(uint256 amount);


    modifier onlyBank() {
        require(msg.sender == bank, "This function is restricted to the bank");
        _;
    }

    constructor() {
        bank = payable(msg.sender);
    }

    function placeBet(uint256 _odds) public payable {
        require(msg.value > 0, "Bet amount must be greater than zero");
        player = payable(msg.sender);
        betAmount = msg.value;
        odds = _odds;
        emit BetPlaced(player, betAmount, odds);
    }

    function win() public {
        require(msg.sender == player, "Only the player can call this function");
        uint256 payout = (betAmount * odds) / 100; // Oranları 100 ile ölçekliyoruz
        require(address(this).balance >= payout, "Insufficient balance in contract");
        (bool success, ) = player.call{value: payout}("");
        require(success, "Transfer failed.");
        emit PayoutSuccess(player, payout);
        resetBet();
    }

    function fundContract() public payable onlyBank {
        require(msg.value > 0, "Fund amount must be greater than zero");
        emit Funded(msg.value);
    }

    function withdrawContract(uint256 amount) public onlyBank {
        require(amount <= address(this).balance, "Insufficient balance in contract");
        (bool success, ) = bank.call{value: amount}("");
        require(success, "Transfer failed.");
        emit ErrorLog("Withdraw successful");
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function resetBet() internal {
        betAmount = 0;
        odds = 0;
        player = payable(address(0));
    }
}
