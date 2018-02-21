import state from '../../state'
import Lib from '../../../model/dclib'
<money-paid>
  <script type="es6">
    /* global Lib */
    this.value = {
      lessWins: 35635,
      winChance: `50.00%`,
      payout: 'X::::'
    }

    this.flag = true
    
    this.on('mount', () => {})

    this.close = (e) => {
      e.preventDefault()
      if (this.flag) {
        this.flag = false
        Lib.Game.disconnect({session:1}, res => {
          if (res) {}
        })
      }
    }
  </script>

  <section class="section money-paid">      
    <div class="top-info">
      <h2 class="caption">total money paid</h2>
      <span class="deposit-value">.:.:.::. BET</span>
    </div>
    
    <div class="paid-change">
      <label class="input-label">
        <span class="input-text">Less than wins</span>
        <input class="input-inp" type="text" name="your-int" value="{value.lessWins}" readonly>
      </label>

      <label class="input-label">
        <span class="input-text">Win Chance</span>
        <input class="input-inp" type="text" name="your-percents" value="{value.winChance}" readonly>
      </label>

      <label class="input-label">
        <span class="input-text">Payout</span>
        <input class="input-inp" id="payout" type="text" name="your-win" value="{value.payout}" readonly>
      </label>

      <slider-module 
        title_slider="Move slider to change chance to win" 
        amount="none"
        id="paid"
        perentsid="slider-paid">
      </slider-module>
    </div>

    <div class="close-channel">
      <span class="close-capt">action:</span>
      <a class="close-but" onclick="{close}" href="#">close channel</a>
    </div>
  </section>

  <style type="less">
    .money-paid {
      padding: 0 20px;
      text-align: center;
    }

    .deposit-value {
      display: none;
    }

    .paid-change {
      margin-top: 20px;
      display: grid;
      grid-template-columns: 33% 33% 33%;
      justify-content: center;
    }

    .input-inp {
      padding: 4px 8px;
      margin-top: 5px;
      width: 90%;
      text-align: center;
    }

    .close-channel {
      margin-top: 48px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .close-but {
      margin-top: 5px;
      padding: 10px;
      display: inline-table;
    }
  </style>
</money-paid>