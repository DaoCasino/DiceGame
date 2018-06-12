/* global DCLib fetch */

function getGameContract (callback) {
  fetch('http://127.0.0.1:8181/?get=contract&name=Dice').then(function (res) {
    return res.json()
  }).then(function (localGameContract) {
    callback({
      address:localGameContract.address,
      abi: JSON.parse(localGameContract.abi)
    })
  }).catch(function () {
    callback(false)
  })
}

(function () {
  getGameContract(function (gameContract) {
    return new DCLib.DApp({
      slug     : 'dicetest_v42',
      contract : gameContract
    })
  })
})()
