// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {LuLuCoin} from "../src/LuLuCoin.sol";
import {LLCFaucet} from "../src/LLCFaucet.sol"; 

contract LLCFaucetTest is Test {
    LuLuCoin public llc;
    LLCFaucet public faucet;
    address owner = vm.addr(1);
    address user = vm.addr(2);

    uint256 dripInterval = 10 seconds;
    uint256 public dripLimit = 100;

    function setUp() public {
        llc = new LuLuCoin(owner);
        faucet = new LLCFaucet(address(llc), dripInterval, dripLimit, owner);

        vm.deal(owner, 1_000 ether);
        vm.deal(user, 1_000 ether);

        vm.prank(owner);
        llc.mint(1_000);
        llc.approve(address(faucet), 1_000);
    }
}