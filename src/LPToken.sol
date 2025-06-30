// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LPToken is ERC20 {
    address public pair;

    constructor(string memory name, string memory symbol, address _pair) ERC20(name, symbol) {
        pair = _pair;
    }

    modifier onlyPair() {
        require(msg.sender == pair, "Only pair contract can access it");
        _;
    }

    function mint(address to, uint256 amount) external onlyPair {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyPair {
        _burn(from, amount);
    }
}
