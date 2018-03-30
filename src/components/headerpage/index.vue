<template lang="pug">
  header.header
    .logo
      a.logo-link(href="https://platform.dao.casino")
        img.logo-img(src="/static/img/logo.png" alt="Dao Casino")
    wallet
</template>

<script>
import Wallet from '../wallet'
export default {
  components: {
    Wallet
  }
}
</script>

<style lang="scss">
@import './index.scss';

.header {
  position: relative;
  margin: 30px 0;
  display: flex;
  width: 100%;
  height: 20px;
}
</style>
