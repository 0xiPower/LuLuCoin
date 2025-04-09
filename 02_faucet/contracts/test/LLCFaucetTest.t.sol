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

    modifier ownerDeposit() {
        vm.startPrank(owner);
        llc.approve(address(faucet), 1_000);
        faucet.deposit(1_000);
        vm.stopPrank();
        vm.warp(block.timestamp + dripInterval);

        _;
    }

    function setUp() public {
        llc = new LuLuCoin(owner);
        faucet = new LLCFaucet(address(llc), dripInterval, dripLimit, owner);

        vm.deal(owner, 1_000 ether);
        vm.deal(user, 1_000 ether);

        vm.prank(owner);
        llc.mint(1_000);
        llc.approve(address(faucet), 1_000);
    }

    function testSuccessIfOwnerLimit() public {
        uint256 newLimit = 200;
        vm.startPrank(owner);
        faucet.setDripLimit(newLimit);
        vm.stopPrank();

        assertEq(newLimit, faucet.getDripLimit());
    }

    function testSuccessIfOwnerSetDripInterval() public {
        uint256 newInterval = 20 seconds;
        vm.startPrank(owner);
        faucet.setDripInterval(newInterval);
        vm.stopPrank();

        assertEq(newInterval, faucet.getDripInterval());
    }

    function testSuccessIfOwnerSetTokenAddress() public {
        address newTokenAddress = vm.addr(3);
        vm.startPrank(owner);
        faucet.setTokenAddress(newTokenAddress);
        vm.stopPrank();

        assertEq(newTokenAddress, faucet.tokenAddress());
    }

    function testSuccessIfOwnerDeposit() public {
        vm.startPrank(owner);
        llc.approve(address(faucet), 1_000);
        faucet.deposit(1_000);
        vm.stopPrank();

        assertEq(llc.balanceOf(address(faucet)), 1_000);
    }

    function testSuccessIfUserDrip() public ownerDeposit {
        vm.prank(user);
        faucet.drip(1);

        assertEq(llc.balanceOf(user), 1);
    }

    function testRevertIfTimeHasNotPassed() public {
        vm.startPrank(owner);
        llc.approve(address(faucet), 1_000);
        faucet.deposit(1_000);
        vm.stopPrank();
        vm.prank(user);
        vm.expectRevert();
        faucet.drip(1);
    }

    function testRevertIfAmountLimit() public ownerDeposit {
        vm.prank(user);
        vm.expectRevert();
        faucet.drip(101);
    }

    function testRevertIfFaucetEmpty() public ownerDeposit {
        vm.startPrank(owner);
        faucet.setDripLimit(2_000);
        vm.stopPrank();
        vm.prank(user);
        faucet.drip(1_000);
        assertEq(1_000, llc.balanceOf(user));
        assertEq(0, llc.balanceOf(address(llc)));
        vm.warp(block.timestamp + dripInterval);
        vm.expectRevert();
        faucet.drip(1);
    }

    function testDripTimeRightAfterUserDrip() public ownerDeposit {
        vm.prank(user);
        faucet.drip(1);
        assertEq(block.timestamp, faucet.getDripTime(user));
    }
}
