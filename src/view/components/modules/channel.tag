import Lib from '../../../model/dclib'
import state from '../../state'
<game-channel>
  <script>
    /* global state Lib */
    this.on('mount', () => {
    })

    this.diceRoll = () => {
      const game_balance = document.querySelector('.bet-amount')
      const inp          = document.querySelectorAll('.input-inp')
      const table        = document.querySelector('.table')
      const randomHash   = Lib.DCLib.Utils.makeSeed()
      if (game_balance.value <= 0) return
      console.log('rool')
      let win_chance, outcome

      for (let i = 0; i < inp.length; i++) {
        if (inp[i].getAttribute('name') === 'your-percents') {
          win_chance = inp[i].value
        }
      }

      console.log(state, randomHash)

      Lib.Game.call('roll', [state.game_bet, state.game_num, randomHash], res => {
        this.refs.result.value = res.profit.toFixed(0)
        game_balance.value = res.balance

        if (this.refs.result.value === '-10000000') {
          outcome = 'lose'
        } else outcome = 'win'
        console.log(state, randomHash)

        const row = document.createElement('tr')
        row.classList.add('table-rowitem')

        const create_table = `
          <td class="table-item">${res.timestamp}</th>
          <td class="table-item">${win_chance}</th>
          <td class="table-item">${outcome}</th>
          <td class="table-item">${Lib.DCLib.Utils.dec2bet(res.user_bet)}</th>
          <td class="table-item">${res.profit.toFixed(0)}</th>
          <td class="table-item">Roll</th>
        `
        row.innerHTML = create_table
        table.appendChild(row)

        if (game_balance.value <= 0) {
          game_balance.value = 0
          Lib.Game.disconnect({session:1})
        }
      })
    }
  </script>

  <section class="section channel">
    <div class="top-info">
      <h2 class="caption">your channel balance</h2>
      <span class="find-bankroller">Find bankroller...</span>
      <span class="bet-balance">.:.:.</span>
    </div>

    <div class="game">    
      <label class="input-label">
        <span class="input-text">Profit on Win</span>
        <input class="input-inp" ref="result" type="text" name="your-roll" placeholder=".:.:." readonly>
      </label>

      <div class="roll">
        <span class="roll-capt">Click Roll Dice to place your bet:</span>
        <a class="roll-but" href="#" onclick={diceRoll}>
          <span class="roll-text">roll dice</span>
        </a>
      </div>
    </div>

    <div class="blockchain-info">
      <h3 class="blockchain-capt">Channel info (in blockchain)</h3>
      <div class="blockchain-but">          
        <div class="blockchain-tx">
          <a class="blockchain-link" href="#" target="_blank">Opening Tx</a>
        </div>
                
        <div class="blockchain-contract">
          <a class="blockchain-link" href="https://ropsten.etherscan.io/address/0xf4b062b7eb7ae80fb5fdfbb3eae16399eaca3647" target="blank">Contract</a>
        </div>        
      </div>
      <span class="blockchain-dispute">Dispute: None</span>
    </div>
  </section>

  <style type="less">
    .channel {
      padding: 0 20px;
      text-align: center;
    }

    .bet-balance {
      display: none;
    }

    .game {
      margin-top: 20px;
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

    .roll {
      margin-top: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .roll-but {
      position: relative;
      margin-top: 5px;
      padding: 6px 0 5px 0;
      width: 100px;
      border-radius: 6px;
      &:hover {
        &:before {
          width: 50%;
        }
        &:after {
          width: 50%;
        }
      }
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 0;
        height: 100%;
      }
      &:after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        display: block;
        width: 0;
        height: 100%;
      }
    }

    .roll-text {
      position: relative;
      z-index: 3;
    }

    .blockchain-info {
      margin-top: 35px;
    }

    .blockchain-but {
      margin-top: 5px;
      display: flex;
      justify-content: center;
    }

    .blockchain-tx {
      margin-right: 10px;
    }

    .blockchain-link {
      padding: 10px;
      display: block;
    }

    .blockchain-dispute {
      margin-top: 10px;
      display: block;
    }
  </style>
</game-channel>