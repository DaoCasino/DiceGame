<template lang="pug">
  #app
    .game__buttons(v-bind:class="{ none: chat }")
      button.game__but.game__but-rules(
        @click="updateTrigger"
        data-name="rules"
      ) R
      button.game__but.game__but-chat(
        @click="updateTrigger"
        data-name="chat"
      ) C
      button.game__but.game__but-infotable(
        @click="updateTrigger"
        data-name="table"
        v-if="table"
      ) T
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
import _rules       from '@/model/rules'
import Balance      from './components/balance'
import InfoTable    from './components/infoTable'
import PaidChance   from './components/paidchance'
import HeaderPage   from './components/headerpage'
import FooterWidget from './components/footerwidget'

export default {
  name: 'App',
  data () {
    return {
      isNone: false
    }
  },

  computed: {
    chat    () { return this.$store.state.triggers.chat },
    table   () { return this.$store.state.triggers.table },
    rules   () { return this.$store.state.triggers.rules },
    getIter () { return this.$store.state.iter }
  },

  methods: {
    updateTrigger (e) {
      const targ = e.target
      const attr = targ.getAttribute('data-name')

      const flag = (this[attr]) ? false : true;

      if (attr === 'rules') {
        this.$store.commit('updateIter', 0)
        this.$store.commit('updateShowSlide', true)
      }

      this.$store.commit(`update${attr[0].toUpperCase() + attr.slice(1)}Trigger`, flag)
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
  z-index: 500;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%
}

.game__but {
  padding: 15px;
  @media screen and (max-width: 480px) {
    padding: 7px
  }
}

.game__window {
  padding: 20px;
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
