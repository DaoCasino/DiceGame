import DCLib from 'dclib'
import * as messaging from 'dc-messaging'

export default new class DC {
  constructor () {
    this.lib  = DCLib
    this.chat = messaging

    this.gameInit()
  }

  install (Vue) {
    Object.defineProperty(Vue.prototype, '$DC', { value: this })
  }

  gameInit () {
    setTimeout(() => {
      if (!window.Game && typeof window.Game !== 'undefined') {
        this.gameInit()
      }

      this.Game = window.Game
    }, 1000)
  }

  async getBalance () {
    const bets = await this.lib.Eth.getBalances(this.lib.Account.get().openkey)
    if (bets) return bets
  }

  chatInit () {
    return new this.chat.RTC(this.lib.Account.get().openkey, `chatRoom__DICE`)
  }
}()
