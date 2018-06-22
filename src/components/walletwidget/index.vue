<template lang="pug">
  .game-wallet
    .wallet-table
      a.wallet-address(:href="getLink" target="_blank") {{ getAddress }}
      .wallet-balance
        .wallet-balance
          span.wallet-capt Balance:
          span.wallet-value {{ getBetBalance }}
          span.wallet-name Bet /
          span.wallet-value {{ getEthBalance }}
          span.wallet-name Eth
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  data () {
    return {
      eth: 0,
      player_address: '...'
    }
  },

  computed: mapState({
    getLink       : state => `https://ropsten.etherscan.io/address/${state.userData.address.player}`,
    getAddress    : state => state.userData.address.player || 0,
    getBetBalance : state => state.userData.balance.betBalance || 0,
    getEthBalance : state => state.userData.balance.ethBalance
  }),

  async beforeCreate () {
    await this.$DC.lib.Account.initAccount()
    if (this.$DC.lib.Account.get().openkey) {
      this.updatePlayerAddress(this.$DC.lib.Account.get().openkey)

      setTimeout(async () => {
        const balance = await this.$DC.lib.Eth.getBalances(this.$DC.lib.Account.get().openkey)
        if (balance) {
          this.updateBetBalance(parseInt(balance.bets))
          this.updateEthBalance(Number(balance.eth).toFixed(2))
        }
      }, 2000)
    }
  },

  methods: {
    ...mapMutations({
      updateBetBalance    : 'userData/updateBetBalance',
      updateEthBalance    : 'userData/updateEthBalance',
      updatePlayerAddress : 'userData/updatePlayerAddress'
    })
  }
}
</script>

<style lang="scss">
@import './index';
.game-wallet {
  margin-left: 10px;
  @media screen and (max-width: 740px) {
    margin-left: inherit;
    width: 100%;
  }
}

.wallet-table {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  @media screen and (max-width: 740px) {
    max-width: 100%;
    justify-content: center;
    align-items: center;
  }
}

.wallet-address {
  width: 100%;
  display: block;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  // overflow: hidden;
  @media screen and (max-width: 650px) {
    text-overflow: inherit;
    overflow: inherit;
  }
}

.wallet-value {
  margin-left: 5px;
}

.wallet-name {
  margin-left: 5px;
}
</style>
