import DCLib from 'dclib'

export default new class DC {
  constructor () {
    this.DCLib = DCLib

    this.DCLib.on('ready', () => {
      this.getGameContract(gameContract => {
        window.Game = new DCLib.DApp({
          slug: 'dicetest_v32',
          contract: gameContract,
          rules: {
            depositX:2,
            maxBet:10
          }
        })
        this.Game = window.Game
      })
    })
  }

  getGameContract (callback) {
    fetch('http://127.0.0.1:8181/?get=contract&name=Dice').then(function (res) {
      return res.json()
    }).then(function (localGameContract) {
      callback({
        address:localGameContract.address,
        abi: JSON.parse(localGameContract.abi)
      })
    }).catch(function () {
      console.clear()
      callback(false)
    })
  }

  getRules () {
    return this.Game.rules
  }

  async getBalance () {
    const bets = await this.DCLib.Eth.getBalances(this.DCLib.Account.get().openkey)
    if (bets) return bets
  }
}()
