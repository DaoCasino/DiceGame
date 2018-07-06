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
        :max_amount="getMaxAmount"
        :min_amount=0.1
      )

    .balance-info
      h2.channel-balance Channel balance
      table.balance-table
        tr.balance-table__row
          td.balance-table__name Player:
          td.balance-table__value {{ getBalance }}
          td.balance-table__curr BET
        tr.balance-table__row
          td.balance-table__name Bankroller:
          td.balance-table__value {{ getBankrollerBalance }}
          td.balance-table__curr BET
</template>

<script>
import DragSlider from '../dragslider'
import {
  mapState
} from 'vuex'

export default {
  computed: mapState({
    getAmount            : state => Number(state.game.betState.amount),
    getBalance           : state => Number(state.userData.balance.player_balance),
    getMaxAmount         : state => Number(state.game.betState.maxAmount),
    getBankrollerBalance : state => Number(state.userData.balance.bankroller_balance)
  }),

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

.balance-body {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.balance-info {
  margin-top: 40px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
