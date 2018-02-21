import Lib from '../../../model/dclib'
import state from '../../state'

<popup>
  <script>
    /* global state Lib */
    this.loading = false
    this.balance = false
    this.on('mount', () => {
      Lib.balance(res => {
        state.deposit = res.bets
      })
    })

    this.connect = () => {
      const deposit = this.refs.deposit_text.textContent
      document.querySelector('.find-bankroller').classList.add('find')
      console.log('deposit', deposit)
      if (deposit < 0.1) return

      Lib.Game.connect({
        bankroller : 'auto',
        paychannel : { deposit: deposit },
        gamedata   : {type: 'uint', value: [1, 2, 3]}
      }, (res, info) => {
        state.channel = info

        const inp          = document.querySelectorAll('.input-inp')
        const open_channel = document.querySelector('.open-channel')

        open_channel.classList.remove('anim')

        for (let i = 0; i < inp.length; i++) {
          if (inp[i].getAttribute('name') === 'your-balance') {
            inp[i].value = Lib.DCLib.Utils.dec2bet(info.channel.player_deposit)
          }
        }

        document.querySelector('#player').textContent            = Lib.DCLib.Utils.dec2bet(info.channel.player_deposit)
        document.querySelector('#bankroller').textContent        = Lib.DCLib.Utils.dec2bet(info.channel.bankroller_deposit)
        document.querySelector('.find-bankroller').style.display = 'block'
        document.querySelector('.find-bankroller').textContent   = info.bankroller_address
        document.querySelector('.find-bankroller').classList.remove('find')
        state.game_num = 35635
        document.querySelector('.blockchain-link').setAttribute('href', `https://ropsten.etherscan.io/tx/${info.channel.receipt.transactionHash}`)
      })

      this.loading = true
    }
  </script>
  
  <div class={popup:true, anim:loading}>
	  <div class="popup-table">
	    <span class="popup-text">Please, select deposit</span>
        <span class="popup-deposit" ref="deposit_text">0</span>
        <slider-module
          ref="cnt"
          data="{balance}"
          balance="{balance}"
          id="deposit"
          perentid="slider-deposit">
        </slider-module>
        <button
          class="popup-but"  
          onclick="{connect}"
        >open channel</button>
	  </div>
  </div>
  <div class={open-channel:true, anim:loading}>
    <span class="open-capt">Open game channel please waith...</span>
    <div class="open-status"></div>
  </div>
  
  <style type="less">
    .popup {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      display: flex;
      width: 100%;
      height: 100%;
      &.anim {
        top: -9999px
      }
      &-table {
        position: absolute;
        top: 50%;
        left: 50%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        text-align: center;
        width: 400px;
        height: 200px;
        @media screen and (max-width: 671px) {
            width: 300px;
        }
      }
      &-but {
        margin-top: 20px;
        padding: 10px;
        border-radius: 6px;
      }
      &-deposit {
          margin-top: 10px;
      }
      @media screen and (max-width: 355px) {
        width: 355px;
      }
    }
    .open-channel {
      position: fixed;
      top: -9999px;
      left: 0;
      z-index: 100;
      padding-top: 90px;
      display: flex;
      justify-content: center;
      width: 100%;
      height: 100%;
      &.anim {
        top: 0px
      }
    }
  </style>
</popup>