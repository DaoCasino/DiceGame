<template lang="pug">
  #app
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
import Popup        from './components/popup'
import Balance      from './components/balance'
import InfoTable    from './components/infoTable'
import PaidChance   from './components/paidchance'
import HeaderPage   from './components/headerpage'
import FooterWidget from './components/footerwidget'

export default {
  name: 'App',
  components: {
    Game,
    Popup,
    Balance,
    InfoTable,
    PaidChance,
    HeaderPage,
    FooterWidget
  }
}
</script>

<style lang="scss">
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
