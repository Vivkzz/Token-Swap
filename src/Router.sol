// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Pair} from "./Pair.sol";
import {Factory} from "./Factory.sol";

contract Router {
    Factory public factory;

    constructor(address _factory) {
        factory = Factory(_factory);
    }

    function sortToken(address tokenA, address tokenB) public pure returns (address, address) {
        if (tokenA < tokenB) {
            return (tokenA, tokenB);
        } else {
            return (tokenB, tokenA);
        }
    }

    function addLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB) external {
        address pair = factory.getPair(tokenA, tokenB);

        if (pair == address(0)) {
            factory.createPair(tokenA, tokenB);
            pair = factory.getPair(tokenA, tokenB);
        }
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);

        IERC20(tokenA).approve(pair, amountA);
        IERC20(tokenB).approve(pair, amountB);

        Pair(pair).addLiquidity(amountA, amountB, msg.sender);
    }

    function removeLiquidity(address tokenA, address tokenB, uint256 liquidity) external {
        address pair = factory.getPair(tokenA, tokenB);
        address lptoken = Pair(pair).lpTokenAddress();
        IERC20(lptoken).transferFrom(msg.sender, address(this), liquidity);

        IERC20(lptoken).approve(pair, liquidity);
        Pair(pair).removeLiquidity(liquidity, msg.sender);
    }

    function swapExactToken(address tokenIn, address tokenOut, uint256 amountIn) external {
        address pair = factory.getPair(tokenIn, tokenOut);
        require(pair != address(0), "Pair doesnt exist");

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(pair, amountIn);
        Pair(pair).swap(tokenIn, amountIn, msg.sender);
    }
}
