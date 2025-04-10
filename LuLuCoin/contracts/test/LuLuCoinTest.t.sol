// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
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
        vm.expectRevert(); // 非合约所有者无法调用函数, 故->提前预测事件回滚
        llc.mint(10 ether);
        vm.stopPrank();
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
        vm.expectRevert(); // 非合约所有者无法调用函数, 故->提前预测事件回滚
        llc.burn(5 ether);
        vm.stopPrank();
        assertEq(llc.balanceOf(owner), 10 ether);
        assertEq(llc.balanceOf(user), 0 ether);
    }
}
