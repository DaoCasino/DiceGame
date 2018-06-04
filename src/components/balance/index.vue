<template lang="pug">
  section.section.game-balance
    .top-info
      h2.caption your channel balance

    .input-deposit
      label.input-label
        span.input-text Max amount
        input.input-inp(type="text" name="your-balance" :value="getMaxAmount" readonly)

      label.input-label
        span.input-text Your amount
        input.input-inp.bet-amount(ref="bet_am" type="text" name="bet-ammount" :value="getAmount" readonly)

      drag-slider(
        capt="Adjust Bet amount",
        paid=false
        popup=false
        :valueDefault="getAmount"
        :max_amount="getBalance"
        :min_amount=0.1
      )

    .balance-info
      h2.channel-balance Channel balance
      span.player-balance Player: {{getBalance}} BET
      span.bankroller-balance Bankroller: {{getBankrollerBalance}} BET
</template>

<script>
import DragSlider from '../dragslider'
export default {
  computed: {
    getBalance           () { return Number(this.$store.state.balance.player_balance) },
    getMaxAmount         () { return Number(this.$store.state.game.maxAmount) },
    getBankrollerBalance () { return Number(this.$store.state.balance.bankroller_balance) },
    getAmount            () { return this.$store.state.game.amount }
  },

  components: {
    DragSlider
  }
}
</script>

<style lang="scss">
@import './index.scss';
.caption {
  margin-top: 5px;
  display: block;
}

.deposit-value {
  display: none;
}

.input-deposit {
  margin-top: 20px;
  padding: 0 20px;
  display: grid;
  justify-items: stretch;
  justify-content: center;
  grid-template-columns: 50% 50%;
}

.input-label {
  margin: 0 auto;
  width: 95%;
  text-align: center;
}

.input-inp {
  padding: 4px 8px;
  width: 100%;
  text-align: center;
}

.balance-info {
  margin-top: 40px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.player-balance {
  margin-top: 10px;
}
</style>
