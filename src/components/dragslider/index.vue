<template lang="pug">
  .drag-slider
    .slider-capt {{capt}}
    vue-slider(
      v-model="value"
      v-bind="options"
    )
</template>

<script>
import vueSlider from 'vue-slider-component'
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
        speed: 0.1,
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

  updated () {
    if (this.$props.popup) {
      this.$store.commit('updateBalance', this.value)
    }

    if (!this.$props.paid && !this.$props.popup) {
      this.$store.commit('updateAmount', this.value)
      this.$store.commit('updatePayout', this.$store.state.paid.num)
    }

    if (this.$props.paid) {
      this.$store.commit('updatePayout', this.value)

      if (this.$store.state.paid.payout < this.$store.state.balance.bankroller_balance) {
        this.$store.commit('updateNum', this.value)
      } else {
        this.value = this.$store.state.paid.num
      }

      this.$store.commit('updatePercent', this.value)
    }
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
