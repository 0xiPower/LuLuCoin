// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract LLCFaucet is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public token;
    address public tokenAddress;
    uint256 public dripInterval;
    uint256 public dripLimit;

    mapping(address => uint256) dripTime;

    error LLCFaucet__IntervalHasNotPassed();

    error LLCFaucet__ExceedLimit();
    error LLCFaucet__FaucetEmpty();
    error LLCFaucet__InvalidAmount();
    event LLCFaucet__Drip(address indexed Receiver, uint256 indexed Amount);
    event LLCFaucet__OwnerDeposit(uint256 indexed amount);

    constructor(
        address _tokenAddress,
        uint256 _dripInterval,
        uint256 _dripLimit,
        address _owner
    ) Ownable(_owner) {
        tokenAddress = _tokenAddress;
        dripInterval = _dripInterval;
        dripLimit = _dripLimit;
        token = IERC20(_tokenAddress);
    }

    function drip(uint256 _amount) external {
        uint256 targetAmount = _amount;
        if (block.timestamp < dripTime[_msgSender()] + dripInterval) {
            revert LLCFaucet__IntervalHasNotPassed();
        }
        if (targetAmount > dripLimit) {
            revert LLCFaucet__ExceedLimit();
        }
        if (token.balanceOf(address(this)) < targetAmount) {
            revert LLCFaucet__FaucetEmpty();
        }
        dripTime[_msgSender()] = block.timestamp;
        token.safeTransfer(_msgSender(), targetAmount);
        emit LLCFaucet__Drip(_msgSender(), targetAmount);
    }

    function deposit(uint256 _amount) external onlyOwner {
        if (_amount > token.balanceOf(_msgSender())) {
            revert LLCFaucet__InvalidAmount();
        }
        token.safeTransferFrom(_msgSender(), address(this), _amount);
        emit LLCFaucet__OwnerDeposit(_amount);
    }

    function setDripInterval(uint256 _newDripInterval) public onlyOwner {
        dripInterval = _newDripInterval;
    }

    function setDripLimit(uint256 _newDripLimit) public onlyOwner {
        dripLimit = _newDripLimit;
    }

    function setTokenAddress(address _newTokenAddress) public onlyOwner {
        tokenAddress = _newTokenAddress;
    }

    function getDripTime(address _user) external view returns (uint256) {
        return dripTime[_user];
    }

    function getDripInterval() external view returns (uint256) {
        return dripInterval;
    }

    function getDripLimit() external view returns (uint256) {
        return dripLimit;
    }
}
