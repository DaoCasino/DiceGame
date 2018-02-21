import state from '../../state'
import Lib from '../../../model/dclib'
<slider-module>
  <script>
    /* global state Lib */
    this.move = {
      slider_one : 0,
      slider_two : 0
    }

    this.prevPosition = {
      paid    : 0,
      balance : 0,
      deposit : 0
    }

    this.depositValue = false
    this.amount       = 2

    this.fun = () => {}

    this.on('mount', () => {
      riot.observable(this.opts)

      const thumb_balance = document.querySelector('#balance')
      const thumb_paid    = document.querySelector('#paid')
      const thumb_deposit = document.querySelector('#deposit')
      // const deposit       = document.querySelector('.popup-deposit')
      const depositText   = document.querySelector('.popup-deposit')
      const thumbBut      = document.querySelectorAll('.slider-but')
      const amountElem    = document.querySelectorAll('.input-inp')
      let   coof          = 0

      const thumbElem = {
        paid: {
          but    : thumb_paid.children[0].children[1].children[0],
          slider : thumb_paid.children[0],
          fill   : thumb_paid.children[0].children[2]
        },
        balance: {
          but    : thumb_balance.children[0].children[1].children[0],
          slider : thumb_balance.children[0],
          fill   : thumb_balance.children[0].children[2]
        },
        deposit: {
          but    : thumb_deposit.children[0].children[1].children[0],
          slider : thumb_deposit.children[0],
          fill   : thumb_deposit.children[0].children[2]
        }
      }

      var counter = 0

      const inSlider = () => {
        this.prevPosition.paid             = ((thumbElem.paid.slider.offsetWidth / 2) / (thumbElem.paid.slider.offsetWidth - 20)) * 100
        thumbElem.paid.but.style.transform = `translateX(${thumbElem.paid.slider.offsetWidth / 2}px)`
        thumbElem.paid.fill.style.width    = `${thumbElem.paid.slider.offsetWidth / 2}px`
      }

      inSlider()

      const changePrevPosition = (params) => {
        if (params.thumb.getAttribute('id') === 'paid')    this.prevPosition.paid    = (params.counter / (params.width - 20)) * 100
        if (params.thumb.getAttribute('id') === 'balance') this.prevPosition.balance = (params.counter / (params.width - 20)) * 100
        if (params.thumb.getAttribute('id') === 'deposit') this.prevPosition.deposit = (params.counter / (params.width - 20)) * 100
      }

      const resazingAll = (params) => {
        const percents = ((params.elem.slider.offsetWidth - 20) / 100) * params.prevPosition

        params.elem.but.style.transform = `translateX(${percents}px)`
        params.elem.fill.style.width    = `${percents}px`
      }

      const changeAmmount = (position) => {
        const sliderWidth = thumb_balance.children[0].offsetWidth
        let amount = Math.round((Lib.DCLib.Utils.dec2bet(state.channel.channel.player_deposit) * position / (sliderWidth - 20)) * 10) / 10

        if (position >= (sliderWidth)) amount = this.a

        for (let i = 0; i < amountElem.length; i++) {
          if (amountElem[i].getAttribute('name') === 'bet-ammount') {
            amountElem[i].value = amount
            state.game_bet      = amountElem[i].value
          }
        }
      }

      const changeNumValue = position => {
        const MAX_VALUE       = 65535
        const slider_width    = thumbElem.paid.slider.offsetWidth
        const slider_percents = position / ((slider_width - 20) / 100)
        const user_num        = slider_percents * (MAX_VALUE  / 100)
        let   coofPR          = 1

        if (slider_percents <= 70.00) coofPR = 1.5
        if (slider_percents <= 50.00) coofPR = 2
        if (slider_percents <= 25.00) coofPR = 2.5
        if (slider_percents <= 10.00) coofPR = 3

        const percents_bnk = ((document.querySelector('#bet-amount').value * coofPR) / 100) * 2

        coof = (document.querySelector('#bet-amount').value * coofPR) - percents_bnk
        document.querySelector('#payout').value = coof.toFixed(2)

        for (let i = 0; i < amountElem.length; i++) {
          if (amountElem[i].getAttribute('name') === 'your-percents') {
            if (slider_percents < 1) return
            amountElem[i].value = slider_percents.toFixed(2) + '%'
          }
          if (amountElem[i].getAttribute('name') === 'your-int') {
            if (user_num < 1) return
            amountElem[i].value = Math.ceil(user_num)
            state.game_num = amountElem[i].value
          }
        }
      }

      const changeDeposit = (position) => {
        const maxBalance = state.deposit
        const sliderWidth = thumb_deposit.children[0].offsetWidth
        if (maxBalance === 0) return
        let value = Math.round((maxBalance * position / (sliderWidth - 20)) * 10) / 10
        if (isNaN(value)) value = 0
        depositText.textContent = value
      }

      const fastChange = (e) => {
        this.fun()
        this.but = e.target
        this.shift =  e.clientX - this.but.getBoundingClientRect().left - 20
        const thumb = e.target

        if (this.shift <= 0) this.shift += 20

        if (thumb.classList.contains('slider-overlay') || thumb.classList.contains('slider-filling')) {
          if (thumb.classList.contains('slider-overlay')) {
            thumb.children[0].style.transform = `translateX(${this.shift}px)`
            thumb.nextElementSibling.style.width = `${this.shift}px`

            changePrevPosition({
              thumb:thumb.children[0],
              counter: this.shift,
              width: thumb.offsetWidth
            })

            if (thumb.children[0].getAttribute('id') === 'balance') changeAmmount(this.shift)
            if (thumb.children[0].getAttribute('id') === 'deposit') changeDeposit(this.shift)
            if (thumb.children[0].getAttribute('id') === 'paid')    changeNumValue(this.shift)
          } else {
            thumb.previousElementSibling.children[0].style.transform = `translateX(${this.shift}px)`
            thumb.style.width = `${this.shift}px`

            changePrevPosition({
              thumb: thumb.previousElementSibling.children[0],
              counter: this.shift,
              width: thumb.previousElementSibling.offsetWidth
            })

            if (thumb.previousElementSibling.children[0].getAttribute('id') === 'balance') changeAmmount(this.shift)
            if (thumb.previousElementSibling.children[0].getAttribute('id') === 'deposit') changeDeposit(this.shift)
            if (thumb.previousElementSibling.children[0].getAttribute('id') === 'paid')    changeNumValue(this.shift)
          }
        }
      }

      const thumbMove = (e) => {
        const thumb    = this.but
        const sliderBg = thumb.parentNode.nextSibling.nextSibling
        let shiftX     = this.shift

        if (!thumb.classList.contains('slider-but')) return

        if (thumb.getAttribute('id') === 'balance') counter = this.move.slider_one
        if (thumb.getAttribute('id') === 'paid')    counter = this.move.slider_two

        const slider = thumb.parentNode
        const width  = slider.offsetWidth
        const step   = e.clientX - shiftX - thumb.parentNode.getBoundingClientRect().left

        counter = step

        if (thumb.getAttribute('id') === 'balance') {
          this.move.slider_one = counter
        } else {
          this.move.slider_two = counter
        }

        if (counter >= width - 20) counter = width - 20
        if (counter <= 0)          counter = 0

        changePrevPosition({
          thumb   : thumb,
          counter : counter,
          width   : width
        })

        thumb.style.transform = `translateX(${counter}px)`
        sliderBg.style.width  = `${counter + 10}px`
        this.counter          = counter

        if (thumb.getAttribute('id') === 'balance') changeAmmount(counter)
        if (thumb.getAttribute('id') === 'deposit') changeDeposit(counter)
        if (thumb.getAttribute('id') === 'paid')    changeNumValue(counter)
      }

      function mouseUp () {
        document.removeEventListener('mousemove', thumbMove)
        document.removeEventListener('mouseup',   mouseUp)
      }

      for (let i = 0; i < thumbBut.length; i++) {
        thumbBut[i].onmousedown = (e) => {
          this.but   = e.target
          this.shift = e.clientX - this.but.getBoundingClientRect().left

          document.addEventListener('mousemove', thumbMove)
          document.addEventListener('mouseup',   mouseUp)
        }

        thumbBut[i].parentNode.parentNode.addEventListener('click', fastChange)
        thumbBut[i].ondragstart = function () {
          return false
        }
      }

      window.addEventListener('resize', () => {
        resazingAll({elem:thumbElem.paid,    prevPosition:this.prevPosition.paid})
        resazingAll({elem:thumbElem.balance, prevPosition:this.prevPosition.balance})
        resazingAll({elem:thumbElem.deposit, prevPosition:this.prevPosition.deposit})
      })
    })
  </script>

  <div class="slider">
    <span class="slider-capt">{this.opts.title_slider}</span>
    <div class="slider-overlay" id="{this.opts.perentid}">
      <span class="slider-but" id="{this.opts.id}"></span>
    </div>
    <div class="slider-filling"></div>
  </div>

  <style type="less">
    slider-module {
      grid-column-start: 1;
      grid-column-end: 4;
    }

    .slider {
      position: relative;
      margin-top: 10px;
      display: block;
      text-align: center;
    }

    .slider-overlay {
      position: relative;
      margin-top: 5px;
      display: block;
      width: 100%;
      height: 25px;
    }

    .slider-filling {
        position: absolute;
        bottom: 0;
        display: block;
        height: 25px;
        background-color: #d08c49;
    }

    .slider-but {
      cursor: pointer;
      position: absolute;
      top: -2px;
      left: -5px;
      z-index: 10;
      display: block;
      width: 30px;
      height: 30px;
      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        display: block;
        width: 4px;
        height: 12px;
        transform: translate(-50%, -50%);
      }
    }
  </style>
</slider-module>