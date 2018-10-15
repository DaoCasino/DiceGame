<template lang="pug">
  .popup(v-if="popup" @keydown.native="op" v-bind:class="{ chat: !getChatTrigger }")
    .popup-table
      .openchannel-log(v-bind:class="{ active: openChannelActive }")
        error-popup(
          v-if="error"
          :message="getErrorText"
        )
        .openchannel-bankroller
          span.caption {{ findBankroller.capt }}
          a.address(
            target="blank"
            :href="findBankroller.link"
            v-bind:class="{ nolink: noBankroller }"
          ) {{ findBankroller.text }}
        .openchannel-info(v-if="openChannelActive")
          span.info-capt {{ openInfo.capt }}
          a.info-text(
            target="blank"
            :href="openInfo.link"
            v-bind:class="{ nolink: noBankroller }"
          ) {{ openInfo.text }}
        span.openchannel-capt {{ log }}
      transition(name="balance-load")
        .popup-loading(v-if="balanceLoaded")
          .popup-loading__mess Loading max deposit
          .popup-loading__bar
      span.popup-text Please, select deposit
        .popup-deposit {{ getDeposit }} BET
        drag-slider(
          paid=false
          popup=true,
          :valueDefault="(getPlayerBalance < 5 && max !== 0) ? getPlayerBalance / 2 : 5"
          :max_amount="(max > getPlayerBalance) ? getPlayerBalance : max"
        )
        button.popup-but(
          @click.prevent="openChannel()"
        ) open channel
</template>

<script>
import DragSlider from '../dragslider'
import ErrorPopup from '../errorpopup'
import {
  mapState,
  mapMutations
} from 'vuex'
import { clearTimeout } from 'timers';

export default {
  data () {
    return {
      log               : '',
      open              : true,
      popup             : true,
      max               : 0,
      error             : false,
      balanceLoaded     : true,
      openInfo          : {
        capt: '',
        link: '',
        text: ''
      },
      errorText         : '',
      max_deposit       : this.$store.state.start,
      noBankroller      : false,
      findBankroller    : {
        capt: 'Bankroller address',
        link: '#',
        text: 'find ...'
      },
      openChannelActive : false
    }
  },

  created () {
    this.updateBetBalance(0)
    this.updateEthBalance(0)
  },

  mounted () {
    document.addEventListener('keyup', e => {
      e.preventDefault()

      if (e.key === 'Enter' && e.keyCode === 13 &&
      !this.openChannelActive && !this.getModuleActive) this.openChannel()
    }, {once: true})
    this.checkMax()
  },

  computed: mapState({
    getPlayerBalance   : state => state.userData.balance.betBalance,
    getDeposit         : state => state.game.betState.deposit,
    getErrorText       : state => state.game.errorText,
    getChatTrigger     : state => state.chat.trigger,
    getModuleActive    : state => state.game.moduleActive,
    getDefaultDeposit  : state => state.game.start,
    getBankrollAddress : state => state.userData.address.bankroller
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
      updateChannelOpened      : 'game/updateChannelOpened',
      updateBankrollBalance    : 'userData/updateBankrollBalance',
      updateBankrollAddress    : 'userData/updateBankrollAddress',
      updatePaychannelContract : 'game/updatePaychannelContract'
    }),

    checkMax () {
      if (typeof this.$DC.Game !== 'undefined' && this.$DC.Game.maxDeposit !== 0) {
        this.max = 1 * this.$DC.lib.Utils.dec2bet(this.$DC.Game.maxDeposit)
        this.balanceLoaded = false
        return
      }

      setTimeout(this.checkMax, 3000)
    },

    openChannel () {
      if (this.getDeposit === 0) return
      this.openChannelActive = true

      this.$DC.Game.Status
        .on('connect::info', res => {
          if (res.status === 'transactionHash') {
            const txLink = `https://${process.env.DC_NETWORK}.etherscan.io/tx/${res.data.transactionHash}`
            this.updateTx(txLink)
            this.openInfo = {
              capt: 'Transaction hash',
              link: txLink,
              text: res.data.transactionHash
            }
          }

          if (res.status === 'noBankroller') {
            this.noBankroller = true
            this.findBankroller = {
              capt: 'Bankroller address',
              link: '#',
              text: ' 🔎 Not bankroller with the same deposit, find continue'
            }
          }

          if (res.status === 'find_compleate') {
            this.noBankroller = false
            this.updateBankrollAddress(res.data)
            this.findBankroller = {
              capt: 'Bankroller address',
              link: `https://${process.env.DC_NETWORK}.etherscan.io/address/${res.data}`,
              text: res.data
            }

            this.openInfo.capt = 'ERC20 Approve'
          }
        })
        .on('connect::error', err => {
          if (err.msg) this.updateError(err.msg)
          this.open  = false
          this.error = true
        })

      this.$DC.Game.connect({
        bankroller : 'auto',
        paychannel : { deposit: this.getDeposit },
        gamedata   : { type: 'uint', value: [] }
      }, async (res, info) => {
        this.popup = false
        this.openInfo.capt = 'Open channel please wait...'
        const bankrollerBalance = this.$DC.Game.logic.payChannel.getBankrollBalance()
        const balances = await this.$DC.getBalance()
        if (balances) {
          this.updateBetBalance(res.bets * 1)
          this.updateEthBalance(Number(res.eth).toFixed(2))
        }

        this.updateMaxAmount(this.getDeposit)
        this.updatePlayerBalance(this.getDeposit)
        this.updateAmount(0.1)
        this.updateBankrollBalance(Number(bankrollerBalance).toFixed(2))
        this.updatePayout()
        this.updateChannelOpened(true)
        this.updatePaychannelContract(this.$DC.Game.contract_address)
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
  &-loading {
    position: absolute;
    z-index: 900;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    &__bar {
      height: 4px;
      width: 70%;
      background-size: 200%;
      animation: bar 1.5s 0.2s linear infinite;
    }
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

.openchannel-bankroller,
.openchannel-info {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
}

.address {
  display: block;
  max-width: 100%;
  &.nolink {
    pointer-events: none;
  }
}

.info-text {
  display: block;
  width: 80%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
