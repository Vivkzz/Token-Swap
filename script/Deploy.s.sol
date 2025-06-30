// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Factory} from "../src/Factory.sol";
import {Router} from "../src/Router.sol";
import {TokenA} from "../src/TokenA.sol";
import {TokenB} from "../src/TokenB.sol";

contract DeployScript is Script {
    Factory public factory;
    Router public router;
    TokenA public tokenA;
    TokenB public tokenB;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy Factory
        factory = new Factory();
        console.log("Factory deployed at:", address(factory));

        // Deploy Router
        router = new Router(address(factory));
        console.log("Router deployed at:", address(router));

        // Deploy Test Tokens
        tokenA = new TokenA();
        tokenB = new TokenB();
        console.log("TokenA deployed at:", address(tokenA));
        console.log("TokenB deployed at:", address(tokenB));

        // Create initial pair
        factory.createPair(address(tokenA), address(tokenB));
        address pairAddress = factory.getPair(address(tokenA), address(tokenB));
        console.log("TokenA-TokenB Pair created at:", pairAddress);

        vm.stopBroadcast();

        // Log all addresses for frontend
        console.log("\n=== COPY THESE ADDRESSES FOR YOUR FRONTEND ===");
        console.log("FACTORY:", address(factory));
        console.log("ROUTER:", address(router));
        console.log("TOKEN_A:", address(tokenA));
        console.log("TOKEN_B:", address(tokenB));
        console.log("PAIR_ADDRESS:", pairAddress);
        console.log("===============================================");
    }
}
