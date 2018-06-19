export default {
  namespaced: true,
  state: {
    betState: {
      amount: 0,
      deposit: 0,
      maxAmount: 0,
      totalAmount: 0
    },
    paid: {
      num     : 32767,
      payout  : 0,
      prevNum : 0,
      percent : 50
    },
    tx                 : '',
    flag               : true,
    start              : '...',
    errorText          : '',
    info_table         : [],
    paychannelContract : ''
  },

  mutations: {
    updateNum                (state, value) { state.paid.num = value },
    updateTx                 (state, value) { state.tx = value },
    updateError              (state, value) { state.errorText = value },
    updateStart              (state, value) { state.start = value },
    updateAmount             (state, value) { state.betState.amount  = value },
    updateDeposit            (state, value) { state.betState.deposit = value },
    updateInfoTable          (state, value) { state.info_table.push(value) },
    updatePaychannelContract (state, value) { state.paychannelContract = `https://${process.env.DC_NETWORK}.etherscan.io/address/${value}` },

    updateMaxAmount (state) {
      for (let i = state.betState.amount; i <= this.state.userData.balance.player_balance; i = Number(Math.round((i + 0.1) + 'e' + 1) + 'e-' + 1)) {
        const payout = (i * (65535 - 65535 * 0.02) / state.paid.num) - i

        if (this.state.userData.balance.player_balance >= this.state.userData.balance.bankroller_balance) {
          state.betState.maxAmount = this.state.userData.balance.bankroller_balance
          return
        }

        if (i >= this.state.userData.balance.player_balance) {
          state.betState.maxAmount = this.state.userData.balance.player_balance
          return
        }

        if (payout >= this.state.userData.balance.bankroller_balance) {
          state.betState.maxAmount = Number(Math.round((i - 0.1) + 'e' + 1) + 'e-' + 1)
          return
        }
      }
    },

    updateTotalAmount (state, value) {
      let newValue = Number(Math.round((state.betState.totalAmount + parseFloat(value)) + 'e' + 1) + 'e-' + 1)
      state.betState.totalAmount = newValue
    },

    updatePercent (state, value) {
      let percent = 100 / (65535 / value)
      if (percent < 1.0) percent = 1.0
      if (state.paid.payout >= this.state.userData.balance.bankroller_balance) return
      state.paid.percent = percent.toFixed(1)
    },

    updatePayout (state, value = 32356) {
      const MAX_NUM = 65535
      const userBet = state.betState.amount
      let   payout  = (userBet * (MAX_NUM - MAX_NUM * 0.02) / value) - userBet

      if (payout < 0.00) payout = 0.00

      state.paid.payout = Number(payout)
    }
  }
}
