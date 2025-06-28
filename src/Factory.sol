// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8;

import {Pair} from "./Pair.sol";

contract Factory {
    address[] public allPair;
    mapping(address => mapping(address => address)) public getPair;

    event PairCreated(address indexed token0, address indexed token1, address indexed pair, uint256 length);

    function sortTokens(address tokenA, address tokenB) public pure returns (address token0, address token1) {
        require(tokenA != tokenB, "both token cant be same");
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "Can't be zero address");
    }

    function createPair(address token0, address token1) external {
        (token0, token1) = sortTokens(token0, token1);
        require(getPair[token0][token1] == address(0), "Pair alreaddy availabe");

        bytes memory bytecode = abi.encodePacked(type(Pair).creationCode, abi.encode(token0, token1));
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));

        address pair;
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }

        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // Easy to find in router
        allPair.push(pair);
        emit PairCreated(token0, token1, pair, allPair.length);
    }

    function allPairLength() public view returns (uint256) {
        return allPair.length;
    }
}
