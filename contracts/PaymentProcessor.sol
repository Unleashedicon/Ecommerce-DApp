// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract PaymentProcessor is Initializable {
    address public admin;

    event PaymentDone(
        address indexed payer,
        uint amount,
        uint paymentId,
        uint date
    );

    function initialize() public initializer {
        admin = msg.sender;
    }

    function placeOrder(uint paymentId) external payable {
        require(msg.value > 0, "Invalid amount: Amount must be greater than 0");

        emit PaymentDone(msg.sender, msg.value, paymentId, block.timestamp);
    }

    function withdrawProfits() external onlyAdmin {
        uint balance = address(this).balance;
        require(balance > 0, "Profits must be greater than 0 in order to withdraw!");
        (bool sent, ) = admin.call{value: balance}("");
        require(sent, "Failed to send Ether");
    }

    function setNewAdmin(address _newAdmin) external onlyAdmin {
        admin = _newAdmin;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function.");
        _;
    }
}
