// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TokenA.sol";
import "../src/TokenB.sol";
import "../src/Pair.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        // 1. Deploy tokens
        TokenA tokenA = new TokenA();
        TokenB tokenB = new TokenB();

        // 2. Deploy pair
        Pair pair = new Pair(address(tokenA), address(tokenB));

        // 3. Approve pair contract to pull tokens
        tokenA.approve(address(pair), 1000 ether);
        tokenB.approve(address(pair), 1000 ether);

        // 4. Add liquidity
        pair.addLiquidity(1000 ether, 1000 ether);

        // 5. Swap 100 tokenA → tokenB
        tokenA.approve(address(pair), 100 ether);
        pair.swap(address(tokenA), 100 ether);

        vm.stopBroadcast();
    }
}
