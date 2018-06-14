<template lang="pug">
  .popup(v-if="popup" v-bind:class="{ chat: !getChatTrigger }")
    .popup-table
      .openchannel-log(v-bind:class="{ active: isActive }")
        error-popup(
          v-if="error"
          :message="getErrorText"
        )
        .openchannel-bankroller(v-if="open")
          span.caption Bankroller address
          a.address(:href="getBnkLink" target="blank") {{ getBankrollAddress }}
        span.openchannel-capt {{ log }}
      span.popup-text Please, select deposit
        .popup-deposit {{getDeposit}} BET
        drag-slider(
          paid=false
          popup=true,
          :valueDefault="getStart / 2"
          :max_amount="getStart"
        )
        button.popup-but(
          @click="openChannel()"
        ) open channel
</template>

<script>
import DragSlider from '../dragslider'
import ErrorPopup from '../errorpopup'
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  data () {
    return {
      log         : '',
      open        : true,
      popup       : true,
      error       : false,
      isActive    : false,
      errorText   : '',
      max_deposit : this.$store.state.start
    }
  },

  created () {
    this.updateBetBalance(0)
    this.updateEthBalance(0)
  },

  computed: mapState({
    getStart           : state => state.userData.balance.betBalance,
    getDeposit         : state => state.game.betState.deposit,
    getBnkLink         : state => `https://${process.env.DC_NETWORK}.etherscan.io/address/${state.userData.address.bankroller}`,
    getErrorText       : state => state.game.errorText,
    getChatTrigger     : state => state.chat.trigger,
    getDefaultDeposit  : state => state.game.start,
    getBankrollAddress : state => state.userData.address.bankroller,
  }),

  methods: {
    ...mapMutations({
      updateTx                 : 'game/updateTx',
      updateError              : 'game/updateError',
      updateAmount             : 'game/updateAmount',
      updatePayout             : 'game/updatePayout',
      updateMaxAmount          : 'game/updateMaxAmount',
      updateBetBalance         : 'userData/updateBetBalance',
      updateEthBalance         : 'userData/updateEthBalance',
      updatePlayerBalance      : 'userData/updatePlayerBalance',
      updateBankrollBalance    : 'userData/updateBankrollBalance',
      updateBankrollAddress    : 'userData/updateBankrollAddress',
      updatePaychannelContract : 'game/updatePaychannelContract'
    }),

    openChannel () {
      if (this.getDeposit === 0) return
      let dotsI
      this.isActive = true

      this.$DCLib.Game.Status
        .on('connect::info', res => {
          if (res.status === 'transactionHash') {
            this.updateTx(`https://${process.env.DC_NETWORK}.etherscan.io/tx/${res.data.transactionHash}`)
          }

          if (res.status === 'noBankroller') {
            this.updateBankrollAddress(' 🔎 Not bankroller with the same deposit, find continue')
          }

          if (res.status === 'find_compleate') {
            this.updateBankrollAddress(res.data)
            dotsI = setInterval(() => {
              const items = ['wait', 'just moment', 'bankroller work, wait ))', '..', '...', 'wait when bankroller open channel', 'yes its not so fast', 'this is Blockchain 👶', 'TX mine...']
              this.log    = '⏳ ' + items[Math.floor(Math.random() * items.length)]
            }, 1500)
          }
        })
        .on('connect::error', err => {
          if (err.msg) this.updateError(err.msg)
          this.open  = false
          this.error = true
        })

      this.$DCLib.Game.connect({
        bankroller : 'auto',
        paychannel : { deposit: this.getDeposit },
        gamedata   : { type: 'uint', value: [1, 2, 3] }
      }, (res, info) => {
        this.popup = false
        clearInterval(dotsI)
        const bankrollerBalance = this.$DCLib.Game.logic.payChannel.getBankrollBalance()
        this.updateMaxAmount(this.getDeposit)
        this.updatePlayerBalance(this.getDeposit)
        this.updateAmount(0.1)
        this.updateBankrollBalance(Number(bankrollerBalance).toFixed(2))
        this.updatePayout()
        this.updatePaychannelContract(this.$DCLib.Game.contract_address)
      })
    }
  },

  components: {
    DragSlider,
    ErrorPopup
  }
}
</script>

<style lang="scss">
@import './index.scss';
.popup {
  position: fixed;
  z-index: 350;
  display: flex;
  width: 100vw;
  height: 100%;
  &-table {
    position: fixed;
    top: 50%;
    left: 50%;
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
    @media screen and (max-width: 480px) {
      width: 90%;
    }
  }
  &-but {
    margin-top: 20px;
    padding: 10px;
    border-radius: 6px;
  }
  &-deposit {
    margin-top: 10px;
  }
}
.openchannel-log {
  position: absolute;
  top: -9999px;
  left: 0;
  z-index: 10;
  display: none;
  width: 100%;
  height: 100%;
  transition: 3s;
  &.active {
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: 3s;
  }
}

.openchannel-bankroller {
  margin-bottom: 10px;
  text-align: center;
}

.address {
  color: #fff;
}
</style>
