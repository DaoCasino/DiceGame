<template lang="pug">
  section.section.channel(v-bind:class="{ process: isProcess }")
    error-popup(
      v-if="error"
      :message="getErrorText"
    )
    .top-info
      h2.caption rolls made
      span.deposit-value Total amount {{ getTotalAmount }} BET
      //- span.find-bankroller Bankroller {{ getBankrollerAddress }}

    .game
      label.input-label
        span.input-text.game-label Profit on Win
        input.input-inp.game-inp(v-bind:class="{error: isError}" type="text" name="your-roll" :value="profit" readonly)

      .roll
        span.roll-capt Click Roll Dice to place your bet:
        a.roll-but(href="#" @click="roll")
          span.roll-text roll dice

    .blockchain-info
      h3.blockchain-capt Channel info (in blockchain)
      .blockchain-but
        .blockchain-tx
          a.blockchain-link(:href="getTx" target="_blank") Opening Tx

        .blockchain-contract
          a.blockchain-link(href="https://ropsten.etherscan.io/address/0x5D1E47F703729fc87FdB9bA5C20fE4c1b7c7bf57" target="_blank") Contract
      span.blockchain-dispute Dispute: None
</template>

<script>
import ErrorPopup from '../errorpopup'
import DC         from '../../model/DCLib'
export default {
  data () {
    return {
      profit      : '.:.:.',
      isError     : false,
      isProcess   : false,
      error       : false,
      transaction : ''
    }
  },
  computed: {
    getTx                () { return this.$store.state.tx },
    getBankrollerAddress () { return this.$store.state.address.bankroller },
    getErrorText         () { return this.$store.state.errorText },
    getTotalAmount       () { return this.$store.state.balance.totalAmount }
  },
  methods: {
    roll () {
      const amount = this.$store.state.balance.amount
      const random = this.$store.state.paid.num
      const hash   = DC.DCLib.randomHash()

      if (amount === 0 || random === 0) {
        this.profit  = 'No bets, Please bet before playing'
        this.isError = true
        return
      }

      this.isProcess = true

      DC.Game.Status.on('error', err => {
        if (err.text) this.$store.commit('updateError', err.text)
        this.error = true
      })

      DC.Game.call('roll', [amount, random, hash], res => {
        const newPlayerBalance   = DC.Game.logic.payChannel.getBalance()
        const newBankrollBalance = DC.Game.logic.payChannel.getBankrollBalance()
        let outcome = 'lose'

        // this.transaction = 'https://ropsten.etherscan.io/tx/' + info.channel.receipt.transactionHash
        this.isProcess = false
        this.isError   = false
        this.profit    = Number(DC.DCLib.Utils.dec2bet(res.profit.toFixed(0))).toFixed(2)

        if (Math.sign(this.profit) === 1) outcome = 'win'

        const date = new Date()
        let hour, minute, sec

        hour   = date.getHours()
        minute = date.getMinutes()
        sec    = date.getSeconds()

        if (hour < 10)   hour   = `0${hour}`
        if (minute < 10) minute = `0${minute}`
        if (sec < 10)    sec    = `0${sec}`
        const time = `${hour}:${minute}:${sec}`

        const createResult = {
          timestamp : time,
          winchance : `${this.$store.state.paid.percent}%`,
          outcome   : outcome,
          user_bet  : DC.DCLib.Utils.dec2bet(res.user_bet),
          profit    : this.profit,
          action    : 'roll'
        }

        this.$store.commit('updateTotalAmount',     createResult.user_bet)
        this.$store.commit('updateInfoTable',       createResult)
        this.$store.commit('updatePlayerBalance',   Number(newPlayerBalance).toFixed(1))
        this.$store.commit('updateBankrollBalance', Number(newBankrollBalance).toFixed(1))
        DC.Game.updateState(res => {
          this.isProcess = true
        })
      })
    }
  },
  components: {
    ErrorPopup
  }
}
</script>

<style lang="scss">
@import './index.scss';

.find-bankroller {
  margin-top: 10px;
  display: block;
}

.channel {
  padding: 0 20px;
  text-align: center;
  &.process {
    pointer-events: none;
  }
  @media screen and (max-width: 1000px) {
    margin-top: 20px;
  }
}

.bet-balance {
  display: none;
}

.game {
  margin-top: 20px;
}

.input-label {
  margin: 0 auto;
  width: 95%;
  text-align: center;
}

span.game-label {
  height: inherit;
}

input.game-inp {
  margin-top: 10px;
}

.input-inp {
  padding: 4px 8px;
  margin-top: 5px;
  width: 100%;
  text-align: center;
}

.roll {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.roll-but {
  position: relative;
  margin-top: 5px;
  padding: 6px 0 5px 0;
  width: 100px;
  border-radius: 6px;
  &:hover {
    &:before {
      width: 50%;
    }
    &:after {
      width: 50%;
    }
  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 0;
    height: 100%;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: 0;
    height: 100%;
  }
}

.roll-text {
  position: relative;
  z-index: 3;
}

.blockchain-info {
  margin-top: 35px;
}

.blockchain-but {
  margin-top: 5px;
  display: flex;
  justify-content: center;
}

.blockchain-tx {
  margin-right: 10px;
}

.blockchain-link {
  padding: 10px;
  display: block;
}

.blockchain-dispute {
  margin-top: 10px;
  display: block;
}
</style>
