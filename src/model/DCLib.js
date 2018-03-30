import DCLib from 'dclib'

export default new class DC {
  constructor () {
    this.DCLib = DCLib
    this.DCLib.Account.initAccount()
    this.createDApp()
  }

  createDApp () {
    this.DCLib.on('ready', () => {
      window.Game = new DCLib.DApp({slug: 'dicetest_v32'})
      this.Game = window.Game
    })
  }

  async getBalance () {
    const bets = await this.DCLib.Eth.getBalances(this.DCLib.Account.get().openkey)
    if (bets) return bets
  }
}()
