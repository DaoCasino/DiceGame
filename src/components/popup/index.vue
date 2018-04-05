<template lang="pug">
  .popup(v-if="popup")
    .popup-table
      .openchannel-log(v-bind:class="{ active: isActive }")
        error-popup(
          v-if="error"
          :message="getErrorText"
        )
        .openchannel-bankroller(v-if="open")
          span.caption Bankroller address
          span.address {{ getBankrollAddress }}
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
import DC         from '../../model/DCLib'
export default {
  data () {
    return {
      popup       : true,
      isActive    : false,
      open        : true,
      error       : false,
      log         : '',
      errorText   : '',
      max_deposit : this.$store.state.balance.start
    }
  },
  beforeCreate () {
    this.$store.commit('updateStart', 0)
    this.$store.commit('updateEthBalance', 0)
  },
  computed: {
    getStart           () { return this.$store.state.balance.start },
    getDeposit         () { return this.$store.state.balance.deposit },
    getBankrollAddress () { return this.$store.state.address.bankroller },
    getDefaultDeposit  () { return this.$store.state.balance.start },
    getErrorText       () { return this.$store.state.errorText }
  },
  methods: {
    openChannel () {
      if (this.$store.state.balance.deposit === 0) return
      let dotsI
      const deposit = this.getDeposit
      this.isActive = true

      DC.Game.Status
        .on('connect::info', res => {
          if (res.status === 'noBankroller') this.$store.commit('updateBankrollAddress', ' 🔎 Not bankroller with the same deposit, find continue')
          if (res.status === 'find_compleate') {
            this.$store.commit('updateBankrollAddress', res.data)
            dotsI = setInterval(() => {
              const items = ['wait', 'just moment', 'bankroller work, wait ))', '..', '...', 'wait when bankroller open channel', 'yes its not so fast', 'this is Blockchain 👶', 'TX mine...']
              this.log    = '⏳ ' + items[Math.floor(Math.random() * items.length)]
            }, 1500)
          }
        })
        .on('error', err => {
          if (err.text) this.$store.commit('updateError', err.text)
          this.open  = false
          this.error = true
        })

      DC.Game.connect({
        bankroller : 'auto',
        paychannel : { deposit: deposit },
        gamedata   : { type: 'uint', value: [1, 2, 3] }
      }, (res, info) => {
        this.popup = false
        clearInterval(dotsI)
        const bankrollerBalance = DC.Game.logic.payChannel.getBankrollBalance()
        this.$store.commit('updatePlayerBalance', this.getDeposit)
        this.$store.commit('updateAmount', 0.1)
        this.$store.commit('updateBankrollBalance', Number(bankrollerBalance).toFixed(1))
        this.$store.commit('updatePayout')
        this.$store.commit('updateTx', `https://ropsten.etherscan.io/tx/${info.channel.receipt.transactionHash}`)
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
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  width: 100%;
  height: 100%;
  &.anim {
    top: -9999px
  }
  &-table {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    width: 400px;
    height: 200px;
    overflow: hidden;
    // @media screen and (max-width: 671px) {
    //     width: 300px;
    // }
  }
  &-but {
    margin-top: 20px;
    padding: 10px;
    border-radius: 6px;
  }
  &-deposit {
      margin-top: 10px;
  }
  @media screen and (max-width: 495px) {
    // width: 355px;
    position: absolute;
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
  font-size: 12px;
  color: #fff;
}
</style>
