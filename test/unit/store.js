module.exports = {
  state: {
    balance: {
      start              : '...',
      ethBalance         : '...',
      deposit            : 0,
      player_balance     : 0,
      bankroller_balance : 0,
      amount             : 0,
      totalAmount        : 0
    },
    paid: {
      num     : 32767,
      percent : 50,
      payout  : 0
    },
    address: {
      bankroller : '...',
      player     : '...'
    },
    errorText  : '',
    info_table : [],
    tx         : ''
  },
  mutations: {
    updateTx              (state, value) { state.tx = value },
    updateError           (state, value) { state.errorText = value },
    updateBalance         (state, value) { state.balance.deposit = value },
    updatePlayerBalance   (state, value) { state.balance.player_balance = value },
    updateBankrollBalance (state, value) { state.balance.bankroller_balance = value },
    updateAmount          (state, value) { state.balance.amount = value },
    updateStart           (state, value) { state.balance.start = value },
    updateNum             (state, value) { state.paid.num = value },
    updateBankrollAddress (state, value) { state.address.bankroller = value },
    updatePlayerAddress   (state, value) { state.address.player = value },
    updateEthBalance      (state, value) { state.balance.ethBalance = value },
    updateInfoTable       (state, value) { state.info_table.push(value) },

    updateTotalAmount (state, value) {
      let newValue = state.balance.totalAmount += Number(value)
      state.balance.totalAmount = Number(newValue.toFixed(1))
    },
    updatePercent (state, value) {
      const percent = 100 / (65535 / value)
      state.paid.percent = percent.toFixed(1)
    },
    updatePayout (state) {
      let userBet  = state.balance.amount
      let userNum  = state.paid.num
      const payout = userBet * (65535 / userNum)
      state.paid.payout = payout
    }
  }
}
