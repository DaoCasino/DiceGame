<info-table>
  <script></script>

  <table class="table">
    <tr class="table-row">
      <th class="table-capt">timestamp</th>
      <th class="table-capt">win chance</th>
      <th class="table-capt">outcome</th>
      <th class="table-capt">bet amount</th>
      <th class="table-capt">profit</th>
      <th class="table-capt">action</th>
    </tr>
  </table>

  <style type="less">
    .table {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      &-row {
        margin-top: 10px;
        display: flex;
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
        width: 16.666%;
      }
      &-item {
        width: 16.666%;
      }
    }
  </style>
</info-table>
