var addr;
var pk;
function UserClass(data) {

    this.type = "simple";
    this.name = "";
    this.balance = 0;
    this.address = '';
    this.pk =  '';
    this.cookieName =  'UserLocal';
    this.init = function () {
        //take from cookie
        var  CUser = bundle.utility.readCookie(this.cookieName);

        if(CUser) {

            User= new UserClass();
            User.setProps(JSON.parse(CUser));
            User.updateBalance();
            User.show();
        } else {
            User = this.create(bundle.Main.createAccount());
        }

        return User;
    };
    //set Props
    this.setProps = function(data) {

        for (variable in data) {

            this[variable] =  data[variable];
        }
    };
    //create a new users
    this.create = function(data) {

        this.address = data.address;
        this.pk =  data.pk;
        this.updateBalance();
        return this;
    };
    //save in storage
    this.save = function() {

        var rdata = JSON.stringify(User);
        bundle.utility.createCookie( this.cookieName, rdata, 999);
    };

    this.show = function () {

        $('.address').html(this.address);
        $('.balance').html(this.balance);
    }
}
//inheritance Etherscan
UserClass.prototype = Object.create(Etherscan.prototype);


var User = '';
function createUser() {

    User= new UserClass();
    User.init().show();
}
