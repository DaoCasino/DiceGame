import DCLib from 'dclib'
import * as messaging from 'dc-messaging'

export default new class DC {
  constructor () {
    this.lib      = DCLib
    this.chat     = messaging

    this.lib.on('ready', () => {
      this.getGameContract(gameContract => {
        window.Game = new DCLib.DApp({
          slug: 'dicetest_v42',
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

  install (Vue) {
    Object.defineProperty(Vue.prototype, '$DC', { value: this })
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

  async getBalance () {
    const bets = await this.lib.Eth.getBalances(this.lib.Account.get().openkey)
    if (bets) return bets
  }

  chatInit () {
    return new this.chat.RTC(this.lib.Account.get().openkey, `chatRoom__DICE`)
  }
}()
