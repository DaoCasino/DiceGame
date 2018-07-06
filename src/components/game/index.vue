<template lang="pug">
  section.section.channel(
    v-bind:class="{ process: isProcess, autoprocess: isAutorollProcess }"
  )
    error-popup(
      v-if="error"
      :message="getErrorText"
    )
    transition(name="autoroll-popup")
      .autoroll-over(v-if="autopopupShow")
        .autoroll-over__table
          span.autoroll-over__text {{ popupMessage }}
          button.autoroll-over__but(
            @focus="clearFocus"
            @click.prevent="autopopupShow = false"
          ) Close

    .top-info
      h2.caption rolls made
      span.deposit-value Total amount {{ getTotalAmount }} BET

    .game
      label.input-label
        span.input-text.game-label Random number
        input.input-inp.game-inp(
          v-bind:class="{error: isError}"
          type="text"
          name="your-roll"
          :value="randomNum"
          readonly
        )

      .roll
        span.roll-capt Click Roll Dice to place your bet:
        .roll-buttons
          a.roll-but.single-roll(
            href="#"
            @focus="clearFocus"
            @click.prevent="roll"
          )
            span.roll-text roll dice
          a.roll-but(
            href="#"
            @focus="clearFocus"
            @click.prevent="isAutoRoll = !isAutoRoll"
          )
            span.roll-text Auto roll
        .auto-roll
          transition(name="auto-roll")
            .auto-roll__settings(v-if="isAutoRoll")
              label.input-lavel
                span.input-text.auto-roll__min-amount Number of rolls
                input.input-inp.auto-roll__inp(
                  type="text"
                  v-model="numberRolls"
                  @keypress="isNumber"
                  ref="min_autoroll"
                )
              .auto-roll__buttons
                button.auto-roll__but.auto-roll__start(
                  @click="autoRoll"
                  v-bind:class="{ autoStart: isProcess }"
                ) start
                button.auto-roll__but.auto-roll__stop(@click="stopRoll" ref="stop") stop

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
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  data () {
    return {
      error             : false,
      profit            : '.:.:.',
      isError           : false,
      isProcess         : false,
      rollStart         : true,
      randomNum         : 0,
      isAutoRoll        : false,
      numberRolls       : '',
      transaction       : '',
      popupMessage      : 'Autoroll over',
      stopAutoRoll      : false,
      autopopupShow     : false,
      isAutorollProcess : false
    }
  },

  computed: mapState({
    getTx                : state => state.game.tx,
    getNum               : state => state.game.paid.num,
    getAmount            : state => state.game.betState.amount,
    getPayout            : state => state.game.paid.payout,
    getPercent           : state => state.game.paid.percent,
    getContract          : state => state.game.paychannelContract,
    getErrorText         : state => state.game.errorText,
    getMaxAmount         : state => state.game.betState.maxAmount,
    getTotalAmount       : state => state.game.betState.totalAmount,
    getModuleActive      : state => state.game.moduleActive,
    getChannelOpened     : state => state.game.channelOpened,
    getPlayerBalance     : state => state.userData.balance.player_balance,
    getBankrollerAddress : state => state.userData.address.bankroller,
    getBankrollerBalance : state => state.userData.balance.bankroller_balance
  }),

  mounted () {
    document.addEventListener('keyup', e => {
      if (e.key === 'Enter' && e.keyCode === 13 &&
      this.getChannelOpened && !this.getModuleActive) this.keyEnter()
    })
  },

  methods: {
    ...mapMutations({
      updateError           : 'game/updateError',
      updateAmount          : 'game/updateAmount',
      updateInfoTable       : 'game/updateInfoTable',
      updateTotalRoll       : 'game/updateTotalRoll',
      updateMaxAmount       : 'game/updateMaxAmount',
      updateTotalAmount     : 'game/updateTotalAmount',
      updatePlayerBalance   : 'userData/updatePlayerBalance',
      updateBankrollBalance : 'userData/updateBankrollBalance'
    }),

    isNumber (e) {
      e = (e) || window.event
      const charCode = (e.which) ? e.which : e.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        e.preventDefault()
      } else {
        return true
      }
    },

    clearFocus   (e) {
      e.target.blur()
    },

    stopRoll () {
      this.stopAutoRoll = true
      setTimeout(() => {
        this.isAutorollProcess = false
      }, 2222)
    },

    keyEnter () {
      if (!this.isProcess && !this.autopopupShow && !this.isAutorollProcess) this.roll()
    },

    async autoRoll (e) {
      this.isAutorollProcess = true

      if (
        this.numberRolls === '' ||
        Number(this.numberRolls) === 0
      ) {
        this.popupMessage      = 'Autoroll number is 0, roll over'
        this.autopopupShow     = true
        this.isAutorollProcess = false
        return
      }

      if (this.getPlayerBalance <= 0) {
        this.popupMessage      = 'Player balance is 0, roll over'
        this.autopopupShow     = true
        this.isAutorollProcess = false
        return
      }

      const roll = await this.roll()

      if (roll && !this.stopAutoRoll) {
        this.numberRolls = Number(this.numberRolls) - 1

        setTimeout(() => {
          this.autoRoll(e)
        }, 1111)
      }

      this.stopAutoRoll = false
    },

    roll () {
      const amount = this.getAmount
      const random = this.getNum
      const hash   = this.$DC.lib.randomHash({bet:amount, gamedata:[random]})

      if (this.getPlayerBalance * 1 <= 0) {
        this.randomNum  = 'Your balance is 0'
        this.isError = true
        return
      }

      if (amount === 0 || random === 0) {
        this.randomNum  = 'No bets, Please bet before playing'
        this.isError = true
        return
      }

      if (this.getPayout > this.getBankrollerBalance) {
        this.randomNum    = 'The bankroll does not have the money to pay'
        this.isError   = true
        this.isProcess = false
        return
      }

      if (!this.rollStart) return
      this.rollStart = false

      if (!this.isAutorollProcess) this.isProcess = true

      return new Promise((resolve, reject) => {
        this.$DC.Game.Status.on('game::error', err => {
          if (err.msg) {
            this.updateError(err.msg)
            this.profit = err.msg
          }

          this.error     = true
          this.isError   = true
          this.isProcess = false
          this.rollStart = true
          reject(new Error(err.msg))
        })

        this.$DC.Game.Game(amount, random, hash)
          .then(res => {
            const result = res.bankroller.result
            const newPlayerBalance   = this.$DC.lib.Utils.dec2bet(this.$DC.Game.logic.payChannel._getBalance().player)
            const newBankrollBalance = this.$DC.lib.Utils.dec2bet(this.$DC.Game.logic.payChannel._getBalance().bankroller)
            let outcome = 'lose'

            if (!this.isAutorollProcess) this.isProcess = false

            this.isError   = false
            this.profit    = Number(this.$DC.lib.Utils.dec2bet(result.profit.toFixed(0))).toFixed(2)
            this.randomNum = result.random_num

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
              user_bet  : this.$DC.lib.Utils.dec2bet(result.user_bet),
              profit    : this.profit,
              action    : 'roll'
            }

            this.updateTotalAmount(createResult.user_bet)
            this.updateInfoTable(createResult)
            this.updateTotalRoll(createResult.profit * 1)
            this.updatePlayerBalance(Number(newPlayerBalance).toFixed(1))
            this.updateBankrollBalance(Number(newBankrollBalance).toFixed(1));

            (this.getAmount > this.getPlayerBalance)
              ? this.updateMaxAmount(this.getPlayerBalance)
              : this.updateMaxAmount()

            this.rollStart = true
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
