<template lang="pug">
  .finish-overlay
    .finish-table
      a.transaction-link(:href="txlink" target="_blank") Transaction
      a.close-link(href="#" @click="closeGame") Close game
      h3 Show results
      table.result-table
        tr.table-row.finish-row
          th.table-capt.show timestamp
          th.table-capt.show win chance
          th.table-capt outcome
          th.table-capt bet amount
          th.table-capt profit
          th.table-capt.show action
        tr.table-row(v-for="item in getInfo")
          td.table-item.show {{ item.timestamp }}
          td.table-item.show {{ item.winchance }}
          td.table-item {{ item.outcome }}
          td.table-item {{ item.user_bet }}
          td.table-item {{ item.profit }}
          td.table-item.show {{ item.action }}
</template>

<script>
import InfoTable from '../infoTable'
export default {
  props: {
    txlink: { type: String }
  },

  data () {
    return {
      show: true
    }
  },

  computed: {
    getTx   () { return this.$store.state.tx },
    getInfo () { return this.$store.state.info_table }
  },

  methods: {
    closeGame () { window.location.reload() }
  },

  components: {
    InfoTable
  }
}
</script>

<style lang="scss" scoped>
@import './index';
.show {
  @media screen and (max-width: 1000px) {
    display: none;
  }
}

.result-table {
  width: 100%;
}

.table-row {
  &.finish-row {
    margin: 5px;
  }
}

.table-capt,
.table-item {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  @media screen and (max-width: 1000px) {
    width: 100%;
  }
}

.finish-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.finish-table {
  position: fixed;
  padding: 50px;
  min-width: 350px;
  width: 90%;
}

.transaction-link {
  margin-right: 20px;
}

.transaction-link, .close-link {
  margin-bottom: 20px;
  padding: 10px;
  display: inline-block;
}
</style>
