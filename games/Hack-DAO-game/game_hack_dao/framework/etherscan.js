function Etherscan() {

    this.utl = 'https://api.etherscan.io/api?';


}

Etherscan.prototype.updateBalance = function() {

    var t = this;
     bundle.utility.getBalance(web3, this.address, function(err, balance) {

        t.balance = balance/100000000000000000;
         t.show();
         t.save();
    });
};