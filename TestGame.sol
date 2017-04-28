pragma solidity ^0.4.9;

contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
}

contract ERC20 {
    function balanceOf(address _addr) returns (uint);
    function transfer(address _to, uint256 _value);
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
}

contract TestGame is owned {
    address addr_erc20 = 0xdD0cfBF5ec4D6eF914549992498F63237c71884d;
    ERC20 erc;
    
    function TestGame() { // Constructor
        erc = ERC20(addr_erc20);
    }
    
    function rollDice(uint256 _value) {
        if(!erc.transferFrom(msg.sender, this, _value)){
            throw;
        }
        
        if(1==1){
            erc.transfer(msg.sender, _value*2);
        }
    }
    
    function getBank() public constant returns(uint) {
        return erc.balanceOf(this);
    }
}