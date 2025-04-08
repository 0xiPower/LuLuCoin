// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {LuLuCoin} from "../src/LuLuCoin.sol";

contract LuLuCoinTest is Test {
    LuLuCoin public llc;

    address owner = vm.addr(1);
    address user = vm.addr(2);

    function setUp() public {
        llc = new LuLuCoin(owner);
        vm.deal(owner, 10 ether);
    }

    function testSuccessIfOwnerMint() public {
        vm.startPrank(owner);
        llc.mint(10 ether);
        vm.stopPrank();
        assertEq(llc.balanceOf(owner), 10 ether);
    }

    function testRevertIfUserMint() public {
        vm.startPrank(user);
        vm.expectRevert();
        llc.mint(10 ether);
        vm.stopPrank();
        assertEq(llc.balanceOf(owner), 0 ether);
    }

    function testSuccessIfOwnerBurn() public {
        vm.startPrank(owner);
        llc.mint(10 ether);
        vm.stopPrank();
        assertEq(llc.balanceOf(owner), 10 ether);

        vm.startPrank(owner);
        llc.burn(5 ether);
        vm.stopPrank();
        assertEq(llc.balanceOf(owner), 5 ether);
    }

    function testRevertIfUserBurn() public {
        vm.startPrank(owner);
        llc.mint(10 ether);
        vm.stopPrank();
        assertEq(llc.balanceOf(owner), 10 ether);

        vm.startPrank(user);
        vm.expectRevert();
        llc.burn(5 ether);
        vm.stopPrank();

        assertEq(llc.balanceOf(owner), 10 ether);
        assertEq(llc.balanceOf(user), 0 ether);
    }
}
