pragma solidity ^0.4.2;

contract ERC20 {
    function balanceOf(address _addr) returns (uint);
    function transfer(address _to, uint256 _value);
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
}