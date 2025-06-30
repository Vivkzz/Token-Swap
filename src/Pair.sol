// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {LPToken} from "./LPToken.sol";

contract Pair {
    LPToken public lptoken;
    address public token0;
    address public token1;

    uint256 public reserve0;
    uint256 public reserve1;

    constructor(address _token0, address _token1) {
        token0 = _token0;
        token1 = _token1;

        // we can give general naming but it will create same lp token name for all tokens
        string memory name = string(abi.encodePacked("LP-", ERC20(token0).symbol(), "-", ERC20(token1).symbol()));
        string memory symbol = string(abi.encodePacked("LP-", ERC20(token0).symbol(), ERC20(token1).symbol()));
        lptoken = new LPToken(name, symbol, address(this));
    }

    function getReserve() public view returns (uint256, uint256) {
        return (reserve0, reserve1);
    }

    function addLiquidity(uint256 amount0, uint256 amount1, address to) external {
        IERC20(address(token0)).transferFrom(msg.sender, address(this), amount0);
        IERC20(address(token1)).transferFrom(msg.sender, address(this), amount1);

        reserve0 += amount0;
        reserve1 += amount1;

        uint256 liquidity;
        // initial liquidity : sqrt(t1*t2) mean
        // later liquidity : min((amount0 * totalsupply of lp / reserve0) ,(amount1 * totalsupply of lp / reserve1))
        if (lptoken.totalSupply() == 0) {
            liquidity = sqrt(amount0 * amount1);
        } else {
            liquidity = min((amount0 * lptoken.totalSupply()) / reserve0, (amount1 * lptoken.totalSupply()) / reserve1);
        }
        //potential error if we use msg.sender it will be router so we have taken to
        lptoken.mint(to, liquidity);
    }

    function min(uint256 x, uint256 y) internal pure returns (uint256) {
        return x < y ? x : y;
    }

    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function removeLiquidity(uint256 liquidity, address to) external {
        uint256 totalSupply = lptoken.totalSupply();
        uint256 amount0 = (liquidity * reserve0) / totalSupply;
        uint256 amount1 = (liquidity * reserve1) / totalSupply;

        require(amount0 > 0 && amount1 > 0, "Insufficient liquidity burned");

        lptoken.burn(msg.sender, liquidity);

        IERC20(token0).transfer(to, amount0);
        IERC20(token1).transfer(to, amount1);

        reserve0 -= amount0;
        reserve1 -= amount1;
    }

    function swap(address tokenIn, uint256 amountIn, address to) external {
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

        IERC20(tokenOut).transfer(to, amountOut);

        if (tokenIn == token0) {
            reserve0 += amountIn;
            reserve1 -= amountOut;
        } else {
            reserve1 += amountIn;
            reserve0 -= amountOut;
        }
    }

    function lpTokenAddress() external view returns (address) {
        return address(lptoken);
    }
}
