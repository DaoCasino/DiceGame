<template lang="pug">
  .error-popup
    .error-table
      span.error-message Error: {{ message }}
      a.error-reloadbut(href="#", @click="reload") restart
</template>

<script>
export default {
  props: {
    message: {type: String}
  },

  methods: {
    reload () { window.location.reload() }
  }
}
</script>

<style lang="scss">
@import './index';
.error-popup {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  width: 100%;
  height: 100%;
  @media screen and (max-width: 495px) {
    position: absolute;
  }
}

.error-table {
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

.error-reloadbut {
  margin-top: 20px;
  padding: 10px;
  border-radius: 6px;
  pointer-events: all;
}
</style>
