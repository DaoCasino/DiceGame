var DefaultBuilder = require("truffle-default-builder");

module.exports = {
  build: new DefaultBuilder({
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js",
      "javascripts/pixi.min.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  }),
  mocha: {
    useColors: true
  },
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gas: 4700000,
      network_id: "*"
    },
    test: {
      host: "46.101.244.101",
      port: 8546,
      network_id: "*"
    },
    testnet: {
      host: "localhost",
      port: 8545,
      network_id: 3,
      gas: 4700000,
      gasPrice: 100000000000,
      from: "0x7e1952131872feee40061360d7ccaf0a72964f9c"
    }
  }
};
