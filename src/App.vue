<template lang="pug">
  #app
    .game__buttons(v-bind:class="{ none: chat }")
      button.game__but.game__but-rules(
        @focus="clearFocus"
        @click.stop="updateTrigger"
        data-name="rules"
      )
        svg.game__but-svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512")
          path.game__but-path(d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z")
      button.game__but.game__but-chat(
        @focus="clearFocus"
        @click.stop="updateTrigger"
        data-name="chat"
      )
        svg.game__but-svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512")
          path.game__but-path(d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z")
    rules
    chat
    popup
    .wrapper
      header-page
      section.game__window
        balance
        game
        paid-chance
        info-table
    footer-widget
</template>

<script>
import Game         from './components/game'
import Chat         from './components/chat'
import Popup        from './components/popup'
import Rules        from './components/rules'
import Balance      from './components/balance'
import InfoTable    from './components/infoTable'
import PaidChance   from './components/paidchance'
import HeaderPage   from './components/headerpage'
import FooterWidget from './components/footerwidget'
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      isNone  : false
    }
  },

  computed: mapState({
    chat    : state => state.chat.trigger,
    rules   : state => state.rules.trigger,
    getIter : state => state.rules.iter
  }),

  methods: {
    ...mapMutations('rules', ['updateIter', 'updateShowSlide']),

    clearFocus (e) { e.target.blur() },

    updateTrigger (e) {
      const targ = e.target
      const attr = this.getAttribute(targ)

      const flag = (this[attr])
        ? false
        : true

      if (attr === 'rules') {
        this.updateIter(0)
        this.updateShowSlide(true)
      }

      this.$store.commit(`${attr}/update${attr[0].toUpperCase() + attr.slice(1)}Trigger`, flag)
    },

    getAttribute (targ) {
      if (targ.getAttribute('data-name')) {
        return targ.getAttribute('data-name')
      }

      if (targ.parentElement) {
        return this.getAttribute(targ.parentElement)
      }
    }
  },

  components: {
    Game,
    Chat,
    Popup,
    Rules,
    Balance,
    InfoTable,
    PaidChance,
    HeaderPage,
    FooterWidget
  }
}
</script>

<style lang="scss">
.game__buttons {
  position: fixed;
  left: 0;
  z-index: 400;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%
}
.game__but {
  padding: 12px;
  @media screen and (max-width: 480px) {
    padding: 7px
  }
  &-svg {
    cursor: pointer;
    width: 20px;
    height: 20px;
    fill: #fff
  }
  &-path {
    cursor: pointer
  }
}

.game__window {
  position: relative;
  padding: 20px;
  z-index: 300;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  justify-content: space-between;
  transition: all .5s linear;
  @media screen and (max-width: 1200px) {
    padding: 20px 40px;
  }
  @media screen and (max-width: 1000px) {
    grid-template-columns: 100%;
  }
}
</style>
