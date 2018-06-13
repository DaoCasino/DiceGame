<template lang="pug">
  section.section.channel(v-bind:class="{ process: isProcess }")
    error-popup(
      v-if="error"
      :message="getErrorText"
    )
    transition(name="autoroll-popup")
      .autoroll-over(v-if="autorollShow")
        .autoroll-over__table
          span.autoroll-over__text Auto roll over
          button.autoroll-over__but(@click.prevent="autorollHide") Close

    .top-info
      h2.caption rolls made
      span.deposit-value Total amount {{ getTotalAmount }} BET

    .game
      label.input-label
        span.input-text.game-label Profit on Win
        input.input-inp.game-inp(v-bind:class="{error: isError}" type="text" name="your-roll" :value="profit" readonly)

      .roll
        span.roll-capt Click Roll Dice to place your bet:
        .roll-buttons
          a.roll-but(href="#" @click="roll")
            span.roll-text roll dice
          a.roll-but(href="#" @click="isAutoRoll = !isAutoRoll" @keydup.13="roll")
            span.roll-text Auto roll
        .auto-roll
          transition(name="auto-roll")
            .auto-roll__settings(v-if="isAutoRoll")
              label.input-lavel
                span.input-text.auto-roll__min-amount Min amount
                input.input-inp.auto-roll__inp(
                  type="text"
                  max="getMaxAmount"
                  @keypress="isNumber"
                  ref="min_autoroll"
                )
              .auto-roll__buttons
                button.auto-roll__but.auto-roll__start(@click="autoRoll") start
                button.auto-roll__but.auto-roll__stop(@click="stopAutoRoll = false" ref="stop") stop


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
import DC         from '@/lib/DCLib'
export default {
  data () {
    return {
      profit       : '.:.:.',
      error        : false,
      isError      : false,
      isProcess    : false,
      isAutoRoll   : false,
      transaction  : '',
      autorollShow : false,
      stopAutoRoll : true
    }
  },

  computed: {
    getTx                () { return this.$store.state.tx },
    getNum               () { return this.$store.state.paid.num },
    getAmount            () { return this.$store.state.game.amount },
    getPayout            () { return this.$store.state.paid.payout },
    getPercent           () { return this.$store.state.paid.percent },
    getContract          () { return this.$store.state.paychannelContract },
    getErrorText         () { return this.$store.state.errorText },
    getMaxAmount         () { return this.$store.state.game.maxAmount },
    getTotalAmount       () { return this.$store.state.game.totalAmount },
    getPlayerBalance     () { return this.$store.state.balance.player_balance },
    getBankrollerAddress () { return this.$store.state.address.bankroller },
    getBankrollerBalance () { return this.$store.state.balance.bankroller_balance }
  },

  methods: {
    isNumber (e) {
      e = (e) || window.event
      const charCode = (e.which) ? e.which : e.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) 
      && charCode !== 46) {
        e.preventDefault()
      } else {
        return true
      }
    },

    autorollHide () { this.autorollShow = false },

    async autoRoll (e) {
      const value = Number(this.$refs.min_autoroll.value)
      if (value < 0.1 || value > this.getBankrollerBalance
      ||  value >= this.getPlayerBalance) {
        this.autorollShow = true
        return
      }

      const roll = await this.roll()
      
      if (roll && this.stopAutoRoll) {
        setTimeout(() => {
          this.autoRoll(e)
        }, 1111)
      }
      
      this.stopAutoRoll = true
    },

    roll () {
      return new Promise ((resolve, reject) => {
        const amount = this.getAmount
        const random = this.getNum

        if (amount === 0 || random === 0) {
          this.profit  = 'No bets, Please bet before playing'
          this.isError = true
          return
        }

        const hash = DC.DCLib.randomHash({bet:amount, gamedata:[random]})

        this.isProcess = true

        if (this.getPayout > this.getBankrollerBalance) {
          this.profit    = 'The bankroll does not have the money to pay'
          this.isProcess = false
          return
        }

        DC.Game.Status.on('game::error', err => {
          if (err.msg) {
            this.$store.commit('updateError', err.msg)
          }

          this.isError   = true
          this.isProcess = false

          reject(new Error(err.msg))
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
              winchance : `${this.getPercent}%`,
              outcome   : outcome,
              user_bet  : DC.DCLib.Utils.dec2bet(result.user_bet),
              profit    : this.profit,
              action    : 'roll'
            }

            this.$store.commit('updateTotalAmount',     createResult.user_bet)
            this.$store.commit('updateInfoTable',       createResult)
            this.$store.commit('updatePlayerBalance',   Number(newPlayerBalance).toFixed(1))
            this.$store.commit('updateBankrollBalance', Number(newBankrollBalance).toFixed(1))
            this.$store.commit('updateMaxAmount')
            resolve(createResult)
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
  &-buttons {
    margin: 5px;
  }
  &-but {
    position: relative;
    margin-right: 6px;
    padding: 6px 6px 5px 6px;
    width: 100px;
    border-radius: $radius;
    &:last-child {
      margin-right: 0;
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
      height: 100%
    }
  }
  &-text {
    position: relative;
    z-index: 3
  }
}

.auto-roll {
  width: 100%;
  overflow: hidden;
  &__settings {
    margin-top: 15px;
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%
  }
  &__stop {
    pointer-events: all
  }
  &__buttons {
    margin-top: 15px;
  }
  &__but {
    cursor: pointer;
    padding: 6px 20px;
    margin-right: 6px;
    &:last-child {
      margin-right: 0;
    }
  }
}

.autoroll {
  &-over {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    &__table {
      position: fixed;
      padding: 20px;
      display: flex;
      flex-direction: column;
      text-align: center;
      justify-content: center;
      max-width: 400px;
      min-width: 290px;
      max-height: 250px;
      width: 100%;
      overflow: hidden;
      border-radius: $radius;
      @media screen and (max-width: 480px) {
        width: 90%;
      }
    }
    &__but {
      cursor: pointer;
      padding: 5px 0;
      margin: 20px auto 0 auto;
      width: 40%;
      border-radius: $radius
    }
  }
}

.blockchain-info {
  margin-top: 35px
}

.blockchain-but {
  margin-top: 5px;
  display: flex;
  justify-content: center
}

.blockchain-tx {
  margin-right: 10px
}

.blockchain-link {
  padding: 10px;
  display: block
}

.blockchain-dispute {
  margin-top: 10px;
  display: block
}
</style>
