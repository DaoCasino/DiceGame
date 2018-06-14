export default {
  namespaced: true,
  state: {
    balance: {
      ethBalance         : '...',
      betBalance         : '...',
      player_balance     : 0,
      bankroller_balance : 0
    },
    address: {
      player     : '...',
      bankroller : '...'
    }
  },

  mutations: {
    updateEthBalance      (state, value) { state.balance.ethBalance = value },
    updateBetBalance      (state, value) { state.balance.betBalance = value },
    updatePlayerBalance   (state, value) { state.balance.player_balance = value },
    updatePlayerAddress   (state, value) { state.address.player = value },
    updateBankrollBalance (state, value) { state.balance.bankroller_balance = value },
    updateBankrollAddress (state, value) { state.address.bankroller = value }
  }
}
