<template lang="pug">
  .table
    table.table-body
      tr.table-row
        th.table-capt.show timestamp
        th.table-capt win chance
        th.table-capt outcome
        th.table-capt bet amount
        th.table-capt profit
        th.table-capt.show action
      tr.table-row(v-for="item in getInfo")
        td.table-item.show {{ item.timestamp }}
        td.table-item {{ item.winchance }}
        td.table-item {{ item.outcome }}
        td.table-item {{ item.user_bet }}
        td.table-item {{ item.profit }}
        td.table-item.show {{ item.action }}
</template>

<script>
export default {
  computed: {
    getInfo () { return this.$store.state.game.info_table }
  }
}
</script>

<style lang="scss">
@import './index';
.table {
  margin-top: 20px;
  min-width: 300px;
  display: grid;
  grid-column: 1/12;
  flex-direction: column;
  align-items: stretch;
  &-row {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    &:first-child {
      margin-top: 0
    }
  }
  &-rowitem {
    padding: 10px 0 0 0;
    display: flex;
    margin-top: 10px;
  }
  &-capt {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 16.666%;
  }
  &-item {
    width: 16.666%;
  }
  @media screen and (max-width: 480px) {
    &-capt,
    &-item {
      width: 30%;
    }
  }
  @media screen and (max-width: 1000px) {
    grid-column: inherit
  }
}

.show {
  @media screen and (max-width: 480px) {
    display: none;
  }
}
</style>
