/* global DCLib fetch */

function getGameContract (callback) {
  if (!process.env.DC_NETWORK || process.env.DC_NETWORK !== 'local') {
    callback(false)
    return
  }

  fetch('http://127.0.0.1:8181/?get=contract&name=Dice').then(function (res) {
    return res.json()
  }).then(function (localGameContract) {
    callback({
      address:localGameContract.address,
      abi: JSON.parse(localGameContract.abi)
    })
  })
}

(function () {
  getGameContract(function (gameContract) {
    return new DCLib.DApp({
      slug     : 'dice_dev',
      contract : gameContract,
      rules: {
        depositX:2
      }
    })
  })
})()
