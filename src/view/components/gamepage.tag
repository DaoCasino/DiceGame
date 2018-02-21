<game-page>
  <script>
    this.on('mount', () => {
    })
  </script>

  <popup></popup>
  <section class="setction gamewindow">
    <gameBalance></gameBalance>
    <game-channel></game-channel>
    <money-paid></money-paid>        
  </section>

  <section class="section game-info">
    <info-table></info-table>
  </section>
  
  <style type='less'>
    .gamewindow {
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

    game-balance,
    game-channel,
    money-paid {
        @media screen and (max-width: 1000px) {
        margin-bottom: 30px;
      }
    }

    .game-info {
      padding: 20px;
      width: 100%;
    }
  </style>
</game-page>