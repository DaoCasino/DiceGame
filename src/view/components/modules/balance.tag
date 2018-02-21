import state from '../../state'
import Lib from '../../../model/dclib'
<gameBalance>
  <script>
    this.input_value = {
      balance: '.::.',
      amount: 0
    }

    this.balance_info = [
      {
        name: 'Player balance: ',
        id: 'player',
        value: '.::::.'
      },
      {
        name: 'Bankroller balance: ',
        id: 'bankroller',
        value: '.::::.'
      }
    ]

    this.on('mount', () => {

    })
  </script>

  <section class="section game-balance">      
    <div class="top-info">
      <h2 class="caption">total rolls made</h2>
      <span class="deposit-value">.:.:.::.</span>
    </div>

    <div class="input-deposit">
      <label class="input-label">
        <span class="input-text">Your Balance</span>
        <input class="input-inp" id="your-balance" type="text" name="your-balance" value="{input_value.balance}" readonly>
      </label>

      <label class="input-label">
        <span class="input-text">Bet amount</span>
        <input class="input-inp bet-amount" id="bet-amount" ref="bet_am" type="text" name="bet-ammount" value="0" readonly>
      </label>
      
      <slider-module 
        amount="{input_value.balance}" 
        title_slider="Adjust Bet amount"
        id="balance"
        perentsid="slider-balance">
      </slider-module>
    </div>

    <div class="balance-info">
      <ul class="balance-list">
        <li class="balance-item" each={item, k in balance_info}>
          <span class="balance-name">{item.name}</span>
          <span class="balance-value" id="{item.id}">{item.value}</span>
        </li>
      </ul>
    </div>
  </section>

  <style type="less">
    .caption {
      margin-top: 5px;
      display: block;
    }

    .deposit-value {
      display: none;
    }

    .input-deposit {
      margin-top: 20px;
      padding: 0 20px;
      display: grid;
      justify-items: stretch;
      justify-content: center;
      grid-template-columns: 50% 50%;
    }

    .input-label {
      margin: 0 auto;
      width: 95%;
      text-align: center;
    }

    .input-inp {
      padding: 4px 8px;
      margin-top: 5px;
      width: 100%;
      text-align: center;
    }

    .balance-info {
      margin-top: 40px;
      padding: 0 20px;
      width: 100%;
    }
  </style>
</gameBalance>