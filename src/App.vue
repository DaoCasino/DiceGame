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
</template>

<script>
import HeaderPage from './components/headerpage'
import Balance from './components/balance'
import Game from './components/game'
import PaidChance from './components/paidchance'
import Popup from './components/popup'
import InfoTable from './components/infoTable'

export default {
  name: 'App',
  components: {
    HeaderPage,
    Balance,
    Game,
    PaidChance,
    Popup,
    InfoTable
  }
}
</script>

<style lang="scss">
#app {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh
}

.game__window {
  padding: 20px;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  justify-content: space-between;
  @media screen and (max-width: 1200px) {
    padding: 20px 40px;
  }
  @media screen and (max-width: 1000px) {
    grid-template-columns: 100%;
  }
}
</style>
