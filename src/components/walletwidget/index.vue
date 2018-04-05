<template lang="pug">
  .game-wallet
    .wallet-table
      a.wallet-address(:href="getLink" target="_blank") Address: {{ getAddress }}
      .wallet-balance
        .wallet-balance
          span.wallet-capt Balance:
          span.wallet-value {{ getBetBalance }}
          span.wallet-name Bet /
          span.wallet-value {{ getEthBalance }}
          span.wallet-name Eth
</template>

<script>
import DC from '../../model/DCLib'
export default {
  data () {
    return {
      eth: 0,
      player_address: '...'
    }
  },

  async beforeCreate () {
    await DC.DCLib.Account.initAccount()
    if (DC.DCLib.Account.get().openkey) {
      this.$store.commit('updatePlayerAddress', DC.DCLib.Account.get().openkey)

      setTimeout(async () => {
        const balance = await DC.DCLib.Eth.getBalances(DC.DCLib.Account.get().openkey)
        if (balance) {
          this.$store.commit('updateStart', parseInt(balance.bets))
          this.$store.commit('updateEthBalance', Number(balance.eth).toFixed(2))
        }
      }, 2000)
    }
  },

  computed: {
    getAddress    () { return this.$store.state.address.player || 0 },
    getBetBalance () { return this.$store.state.balance.start || 0 },
    getEthBalance () { return this.$store.state.balance.ethBalance },
    getLink       () { return `https://ropsten.etherscan.io/address/${this.$store.state.address.player}` }
  }
}
</script>

<style lang="scss">
@import './index';
.game-wallet {
  margin-left: 10px;
}

.wallet-table {
  max-width: 300px;
}
.wallet-address {
  width: 100%;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wallet-value {
  margin-left: 5px;
}

.wallet-name {
  margin-left: 5px;
}
</style>
