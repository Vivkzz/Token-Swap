// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Pair} from "./Pair.sol";

contract Router {
    address public immutable i_pair;

    constructor(address _pair) {
        i_pair = _pair;
    }

    function sortToken(address tokenA, address tokenB) public pure returns (address, address) {
        if (tokenA < tokenB) {
            return (tokenA, tokenB);
        } else {
            return (tokenB, tokenA);
        }
    }

    function addLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB) external {
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);

        IERC20(tokenA).approve(i_pair, amountA);
        IERC20(tokenB).approve(i_pair, amountB);

        Pair(i_pair).addLiquidity(amountA, amountB);
    }

    function swapExactToken(address tokenIn, uint256 amountIn) external {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(i_pair, amountIn);
        Pair(i_pair).swap(tokenIn, amountIn, msg.sender);
    }
}
