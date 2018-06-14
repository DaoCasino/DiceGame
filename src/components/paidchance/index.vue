<template lang="pug">
  section.section.money-paid
    error-popup(
      v-if="error"
      :message="getErrorText"
    )
    finish-table(
      v-if="finish_table"
      :txlink="getTx"
    )
    transition(name="closeChannel")
      .close-popup(v-if="close")
        .close-popup__table
          span.close-popup__log {{ log }}
    .top-info
      h2.caption total money paid

    .paid-change
      label.input-label
        span.input-text Random num
        input.input-inp(type="text" name="your-int" :value="num" readonly)

      label.input-label
        span.input-text Win Chance
        input.input-inp(type="text" name="your-percents" :value="percent + '%'" readonly)

      label.input-label
        span.input-text Payout
        input.input-inp#payout(type="text" name="your-win" :value="payout" readonly)

      drag-slider(
        capt="Move slider to change chance to win",
        paid=true
        popup=false,
        :valueDefault="num"
        :max_amount="max_amount",
        :min_amount=1
      )

    .close-channel
      span.close-capt action:
      a.close-but(href="#" @click="closeChannel") close channel
</template>

<script>
import FinishTable from '../finishTable'
import DragSlider  from '../dragslider'
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  data () {
    return {
      log          : '',
      error        : false,
      close        : false,
      max_amount   : 65535,
      finish_table : false
    }
  },

  computed: mapState({
    num          : state => state.game.paid.num,
    getTx        : state => state.game.tx,
    payout       : state => Number(state.game.paid.payout.toFixed(2)),
    percent      : state => state.game.paid.percent,
    getErrorText : state => state.game.errorText
  }),

  methods: {
    ...mapMutations({
      updateTx     : 'game/updateTx',
      updateError  : 'game/updateError'
    }),

    closeChannel () {
      this.$DCLib.Game.Status
        .on('disconnect::info', res => {
          if (res.status === 'transactionHash') {
            this.updateTx(`https://${process.env.DC_NETWORK}.etherscan.io/tx/${res.data.transactionHash}`)
          }
        })
        .on('error', err => {
          if (err.text) {
            this.updateError(err.text)
            this.error = true
          }
        })

      this.close = true
      const dotsI = setInterval(() => {
        const items = ['wait', 'just moment', 'bankroller work, wait ))', '..', '...', 'wait when bankroller open channel', 'yes its not so fast', 'this is Blockchain 👶', 'TX mine...']
        this.log    = '⏳ ' + items[Math.floor(Math.random() * items.length)]
      }, 1500)

      this.$DCLib.Game.disconnect(res => {
        this.close        = false
        this.finish_table = true
        clearInterval(dotsI)
      })
    }
  },

  components: {
    DragSlider,
    FinishTable
  }
}
</script>

<style lang="scss">
@import './index.scss';
.close-popup {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  width: 100%;
  height: 100%;
  &__table {
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
  }
  @media screen and (max-width: 495px) {
    position: absolute;
  }
}

.money-paid {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  @media screen and (max-width: 1000px) {
    margin-top: 20px;
  }
}

.deposit-value {
  display: none;
}

.paid-change {
  margin-top: 20px;
  display: grid;
  grid-column-gap: 10px;
  grid-template-columns: 25% 25% 25%;
  justify-content: center;
}

.input-text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.input-inp {
  padding: 4px 8px;
  width: 95%;
  text-align: center;
}

.close-channel {
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.close-but {
  margin-top: 5px;
  padding: 10px;
  display: inline-table;
}
</style>
