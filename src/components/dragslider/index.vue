<template lang="pug">
  .drag-slider
    .slider-capt {{capt}}
    vue-slider(
      ref="slider"
      v-model="value"
      v-bind="options"
    )
</template>

<script>
import vueSlider from 'vue-slider-component'
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  props: {
    capt         : { type: String },
    paid         : { type: Boolean },
    popup        : { type: Boolean },
    valueDefault : { type: Number },
    max_amount   : { type: Number },
    min_amount   : { type: Number }
  },

  data () {
    return {
      value: (this.$props.valueDefault && this.$props.valueDefault !== 0) ? this.valueDefault : 0,
      options: {
        tooltip: false,
        height: 25,
        max: this.$props.paid ? 65535 : this.max_amount,
        min: this.$props.min_amount,
        speed: 0.2,
        debug: false,
        interval: this.$props.paid ? 1 : 0.1,
        sliderStyle: {
          'position': 'relative',
          'top': '-2px',
          'left': '-7px',
          'width': '30px',
          'height': '30px',
          'background-color': '#d7a472'
        },
        bgStyle: {
          'cursor': 'pointer',
          'background-color': '#fff'
        },
        processStyle: {
          'cursor': 'default',
          'background-color': '#d08c49'
        }
      }
    }
  },

  watch: {
    valueDefault (val) { this.value       = val },
    max_amount   (val) { this.options.max = val }
  },

  computed: mapState({
    getNum               : state => state.game.paid.num,
    getPayout            : state => state.game.paid.payout,
    getAmount            : state => state.game.betState.amount,
    getPrevNum           : state => state.game.paid.prevNum,
    getNewAmout          : state => Number(Math.round((state.game.betState.amount - 0.1) + 'e' + 1) + 'e-' + 1),
    getBankrollerBalance : state => state.userData.balance.bankroller_balance
  }),

  beforeUpdate () {
    if (this.$props.popup) {
      this.updateDeposit(this.value)
    }

    if (!this.$props.paid && !this.$props.popup) {
      if (this.getPayout > this.getBankrollerBalance) {
        this.$refs.slider.setValue(this.getAmount)
      }

      this.updateAmount(this.value)
      this.updatePayout(this.getNum)
      this.updateMaxAmount()
    }

    if (this.$props.paid) {
      if (this.getPayout > this.getBankrollerBalance) {
        if (this.getAmount > 0.1) {
          this.updateAmount(this.getNewAmout)
        } else {
          const num = (Number((this.getNum * 1.2).toFixed()) !== 1) ? Number((this.getNum * 1.2).toFixed()) : 300
          this.updateNum(num)
        }
      } else {
        this.updateNum(this.value)
        this.updatePayout(this.getNum)
      }

      this.updatePercent(this.value)
      this.updateMaxAmount()
    }
  },

  methods: {
    ...mapMutations({
      updateNum       : 'game/updateNum',
      updatePayout    : 'game/updatePayout',
      updateAmount    : 'game/updateAmount',
      updatePercent   : 'game/updatePercent',
      updateDeposit   : 'game/updateDeposit',
      updateMaxAmount : 'game/updateMaxAmount'
    })
  },

  components: {
    vueSlider
  }
}
</script>

<style lang="scss">
@import './index.scss';
.drag-slider {
  margin-top: 10px;
  grid-column-start: 1;
  grid-column-end: 4;
}

.slider-capt {
  text-align: center;
}
</style>
