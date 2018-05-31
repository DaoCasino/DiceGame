<template lang="pug">
  section.section.channel(v-bind:class="{ process: isProcess }")
    error-popup(
      v-if="error"
      :message="getErrorText"
    )
    .top-info
      h2.caption rolls made
      span.deposit-value Total amount {{ getTotalAmount }} BET

    .game
      label.input-label
        span.input-text.game-label Profit on Win
        input.input-inp.game-inp(v-bind:class="{error: isError}" type="text" name="your-roll" :value="profit" readonly)

      .roll
        span.roll-capt Click Roll Dice to place your bet:
        a.roll-but(href="#" @click="roll" @keydup.13="roll")
          span.roll-text roll dice

    .blockchain-info
      h3.blockchain-capt Channel info (in blockchain)
      .blockchain-but
        .blockchain-tx
          a.blockchain-link(:href="getTx" target="_blank") tx hash

        .blockchain-contract
          a.blockchain-link(:href="getContract" target="_blank") Contract
      span.blockchain-dispute Dispute: True
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
    getContract          () { return this.$store.state.paychannelContract },
    getErrorText         () { return this.$store.state.errorText },
    getTotalAmount       () { return this.$store.state.balance.totalAmount },
    getBankrollerAddress () { return this.$store.state.address.bankroller }
  },

  methods: {
    roll () {
      const amount = this.$store.state.balance.amount
      const random = this.$store.state.paid.num

      if (amount === 0 || random === 0) {
        this.profit  = 'No bets, Please bet before playing'
        this.isError = true
        return
      }

      const hash = DC.DCLib.randomHash({bet:amount, gamedata:[random]})

      this.isProcess = true
      
      if (this.$store.state.paid.payout >= this.$store.state.balance.bankroller_balance) {
        this.$store.commit('updateNum', this.$store.state.paid.num + 1000)
        this.profit    = 'The bankroll does not have the money to pay'
        this.isError   = true
        this.isProcess = false
        return
      }

      DC.Game.Status.on('game::error', err => {
        if (err.msg) {
          this.$store.commit('updateError', err.msg)
        }

        throw new Error('The bankroll does not have the money to pay')
      })

      DC.Game.Game(amount, random, hash)
        .then(res => {
          const result = res.bankroller.result
          const newPlayerBalance   = DC.DCLib.Utils.dec2bet(DC.Game.logic.payChannel._getBalance().player)
          const newBankrollBalance = DC.DCLib.Utils.dec2bet(DC.Game.logic.payChannel._getBalance().bankroller)
          let outcome = 'lose'

          this.isProcess = false
          this.isError   = false
          this.profit    = Number(DC.DCLib.Utils.dec2bet(result.profit.toFixed(0))).toFixed(2)

          if (Math.sign(this.profit) === 1) {
            outcome = 'win'
          }

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
            user_bet  : DC.DCLib.Utils.dec2bet(result.user_bet),
            profit    : this.profit,
            action    : 'roll'
          }

          this.$store.commit('updateTotalAmount',     createResult.user_bet)
          this.$store.commit('updateInfoTable',       createResult)
          this.$store.commit('updatePlayerBalance',   Number(newPlayerBalance).toFixed(1))
          this.$store.commit('updateBankrollBalance', Number(newBankrollBalance).toFixed(1))
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
