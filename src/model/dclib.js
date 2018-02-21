import DCLib from 'dclib'

export default new class Lib {
  constructor () {
    this.DCLib = DCLib
    this.DCLib.Account.initAccount()
    this.openkey = this.DCLib.Account.get().openkey
    this.Game = false
  }

  createDApp (slug) {
    this.DCLib.on('ready', () => {
      this.Game = new this.DCLib.DApp({slug: slug})
    })
  }

  async balance (callback = false) {
    const betBalance = await this.DCLib.Eth.getBalances(this.openkey)
    if (betBalance) {
      if (callback) callback(betBalance)
    }
  }

  roll (userBet, userNum, randomHash, callback = false) {
    const rollGame = this.Game.logic.roll(userBet, userNum, randomHash)
    if (callback) callback(rollGame)
  }
}()
