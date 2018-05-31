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
    this.$store.commit('updateBetBalance', 0)
    this.$store.commit('updateEthBalance', 0)
  },

  computed: {
    getStart           () { return this.$store.state.balance.betBalance },
    getDeposit         () { return this.$store.state.balance.deposit },
    getBnkLink         () { return `https://${process.env.DC_NETWORK}.etherscan.io/address/${this.$store.state.address.bankroller}` },
    getBankrollAddress () { return this.$store.state.address.bankroller },
    getDefaultDeposit  () { return this.$store.state.balance.start },
    getErrorText       () { return this.$store.state.errorText }
  },

  methods: {
    openChannel () {
      if (this.$store.state.balance.deposit === 0) return
      let dotsI
      this.isActive = true

      DC.Game.Status
        .on('connect::info', res => {
          if (res.status === 'transactionHash') {
            this.$store.commit('updateTx', `https://${process.env.DC_NETWORK}.etherscan.io/tx/${res.data.transactionHash}`)
          }

          if (res.status === 'noBankroller') {
            this.$store.commit('updateBankrollAddress', ' 🔎 Not bankroller with the same deposit, find continue')
          }

          if (res.status === 'find_compleate') {
            this.$store.commit('updateBankrollAddress', res.data)
            dotsI = setInterval(() => {
              const items = ['wait', 'just moment', 'bankroller work, wait ))', '..', '...', 'wait when bankroller open channel', 'yes its not so fast', 'this is Blockchain 👶', 'TX mine...']
              this.log    = '⏳ ' + items[Math.floor(Math.random() * items.length)]
            }, 1500)
          }
        })
        .on('connect::error', err => {
          if (err.msg) this.$store.commit('updateError', err.msg)
          this.open  = false
          this.error = true
        })

      DC.Game.connect({
        bankroller : 'auto',
        paychannel : { deposit: this.getDeposit },
        gamedata   : { type: 'uint', value: [1, 2, 3] }
      }, (res, info) => {
        this.popup = false
        clearInterval(dotsI)
        const bankrollerBalance = DC.Game.logic.payChannel.getBankrollBalance()
        this.$store.commit('updatePlayerBalance', this.getDeposit)
        this.$store.commit('updateAmount', 0.1)
        this.$store.commit('updateBankrollBalance', Number(bankrollerBalance).toFixed(2))
        this.$store.commit('updatePayout')
        this.$store.commit('updatePaychannelContract', DC.Game.contract_address)
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
  position: absolute;
  z-index: 100;
  display: flex;
  width: 100vw;
  height: 120%;
  &.anim {
    transform: translateY(-9999px)
  }
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
