<template lang="pug">
  header.header
    .logo
      a.logo-link(href="https://platform.dao.casino" target="blank")
        img.logo-img(:src="logo" alt="Dao Casino")
    wallet-widget
</template>

<script>
import WalletWidget from '../walletwidget'
export default {
  data () {
    return {
      logo: require('../../assets/img/logo.png')
    }
  },

  components: {
    WalletWidget
  }
}
</script>

<style lang="scss">
@import './index.scss';
.header {
  position: relative;
  margin: 30px 0 10px 0;
  display: flex;
  width: 100%;
  @media screen and (max-width: 740px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.logo {
  @media screen and (max-width: 740px) {
    margin-bottom: 10px;
  }
}
</style>
