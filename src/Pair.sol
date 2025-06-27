// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Pair {
    address public token0;
    address public token1;

    uint256 public reserve0;
    uint256 public reserve1;

    constructor(address _token0, address _token1) {
        token0 = _token0;
        token1 = _token1;
    }

    function getReserve() public view returns (uint256, uint256) {
        return (reserve0, reserve1);
    }

    function addLiquidity(uint256 amount0, uint256 amount1) external {
        IERC20(address(token0)).transferFrom(msg.sender, address(this), amount0);
        IERC20(address(token1)).transferFrom(msg.sender, address(this), amount1);

        reserve0 += amount0;
        reserve1 += amount1;
    }

    function swap(address tokenIn, uint256 amountIn) external {
        require(tokenIn == token0 || tokenIn == token1, "Invalid Token");

        address tokenOut;
        uint256 reserveIn;
        uint256 reserveOut;

        if (tokenIn == token0) {
            tokenOut = token1;
            reserveIn = reserve0;
            reserveOut = reserve1;
        } else {
            tokenOut = token0;
            reserveIn = reserve1;
            reserveOut = reserve0;
        }

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // taking 0.03% as fees per swap
        uint256 amountInAfterFees = amountIn * 997 / 1000;

        // numerator is little tricky for logic other else is easy
        uint256 numerator = amountInAfterFees * reserveOut;
        uint256 denominator = reserveIn + amountInAfterFees;
        uint256 amountOut = numerator / denominator;

        IERC20(tokenOut).transfer(msg.sender, amountOut);

        if (tokenIn == token0) {
            reserve0 += amountIn;
            reserve1 -= amountOut;
        } else {
            reserve1 += amountIn;
            reserve0 -= amountOut;
        }
    }
}
