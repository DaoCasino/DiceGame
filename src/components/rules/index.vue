<template lang="pug">
  transition(name="slider")
    .rules(v-if="getRulesTrigger" @click.prevent="skipTutor")
      .rules-table(ref="rulesTable")
        .rules-progress
          .rules-progress__inner(ref="progress")
        transition(name="next-slide" mode="in-out")
          .rules-body(
            v-if="getShowSlide"
            v-bind:class="{ prev: isPrev }"
          )
            .rules-body__container(v-bind:class="{ first: !prevShow }")
              h2.rules-capt {{ getRule.capt }}
              .rules-img(v-bind:class="{ image: prevShow }")
                img.rules-img__item(
                  v-if="imgShow"
                  :src="getRule.img"
                )
              p.rules-text {{ getRule.text }}
        .rules-buttons(@click="slideMove" ref="rulesBut")
          button.rules-but.rules-skip(
            @click="skipTutor"
            v-if="showSkip"
          ) Skip
          button.rules-but.rules-prev(
            v-if="prevShow"
            data-move="prev"
          ) Prev
          button.rules-but.rules-next(
            data-move="next"
            ref="next"
          ) {{ getButName }}
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  data () {
    return {
      prev      : false,
      iter      : 0,
      width     : 0,
      rules     : [
        {
          img     : '',
          capt    : 'Welcome to the Dice game',
          text    : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero esse quia perspiciatis, quisquam nulla consectetur in, similique aperiam, eum corporis repudiandae laborum. Natus necessitatibus adipisci nemo voluptatibus temporibus nesciunt architecto? Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero esse quia perspiciatis, quisquam nulla consectetur in, similique aperiam, eum corporis repudiandae laborum. Natus necessitatibus adipisci nemo voluptatibus temporibus nesciunt architecto? Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero esse quia perspiciatis, quisquam nulla consectetur in, similique aperiam, eum corporis repudiandae laborum. Natus necessitatibus adipisci nemo voluptatibus temporibus nesciunt architecto? Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero esse quia perspiciatis, quisquam nulla consectetur in, similique aperiam, eum corporis repudiandae laborum. Natus necessitatibus adipisci nemo voluptatibus temporibus nesciunt architecto?'
        },
        {
          img  : require('src/assets/img/popup.jpg'),
          capt : 'Start game',
          text : 'Choоse your BET with this Slider button Push the button "OPEN Channel" to open Game Channel You can\'t open the Game channel when BET =0'
        },
        {
          img  : require('src/assets/img/openchannel.jpg'),
          capt : 'Open channel',
          text : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero esse quia perspiciatis, quisquam nulla consectetur in, similique aperiam, eum corporis repudiandae laborum. Natus necessitatibus adipisci nemo voluptatibus temporibus nesciunt architecto?'
        },
        {
          img  : require('src/assets/img/popup.jpg'),
          capt : 'Start game',
          text : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero esse quia perspiciatis, quisquam nulla consectetur in, similique aperiam, eum corporis repudiandae laborum. Natus necessitatibus adipisci nemo voluptatibus temporibus nesciunt architecto?'
        },
        {
          img  : require('src/assets/img/openchannel.jpg'),
          capt : 'Open channel',
          text : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero esse quia perspiciatis, quisquam nulla consectetur in, similique aperiam, eum corporis repudiandae laborum. Natus necessitatibus adipisci nemo voluptatibus temporibus nesciunt architecto?'
        }
      ],
      close     : false,
      isPrev    : false,
      imgShow   : false,
      showSkip  : true,
      prevShow  : false
    }
  },

  computed: mapState({
    getIter         : state => state.rules.iter,
    getRule         : state => state.rules.rule,
    getButName      : state => state.rules.nextBut,
    getShowSlide    : state => state.rules.showSlide,
    getRulesTrigger : state => state.rules.trigger
  }),

  watch: {
    windowWidth (newWidth) {
      this.width = newWidth
    }
  },

  beforeMount () {
    this.$nextTick(() => {
      if (typeof this.$refs.rulesTable !== 'undefined') {
        this.windowWidth = parseInt(getComputedStyle(this.$refs.rulesTable).width)
        this.progressMove()
      }

      window.addEventListener('resize', () => {
        if (typeof this.$refs.rulesTable !== 'undefined') {
          this.windowWidth = parseInt(getComputedStyle(this.$refs.rulesTable).width)
          this.progressMove()
        }
      })
    })
  },

  mounted () {
    (localStorage.getItem('compleateTutor')) && this.updateRulesTrigger(false)

    this.updateRules({
      img  : this.rules[this.getIter].img,
      capt : this.rules[this.getIter].capt,
      text : this.rules[this.getIter].text
    })
  },

  beforeUpdate () {
    this.updateRules({
      img  : this.rules[this.getIter].img,
      capt : this.rules[this.getIter].capt,
      text : this.rules[this.getIter].text
    })
  },

  updated () {
    if (this.getIter === (this.rules.length - 1)) {
      this.updateNextBut('Close')
      this.close    = true
      this.showSkip = false
    } else {
      this.updateNextBut('Next')
      this.close    = false
      this.showSkip = true
    }

    this.prevShow = (this.getIter > 0) ? true : false
    this.imgShow  = (this.getIter > 0) ? true : false

    this.progressMove()
  },

  methods: {
    ...mapMutations('rules', [
      'updateIter',
      'updateRules',
      'updateNextBut',
      'updateShowSlide',
      'updateRulesTrigger'
    ]),

    progressMove () {
      if (typeof this.$refs.progress !== 'undefined') {
        const OneSlide     = this.windowWidth / this.rules.length
        const currentWidth = OneSlide * (this.getIter + 1)

        this.$refs.progress.style.width = currentWidth + 'px'
      }
    },

    slideMove (e) {
      const target = e.target

      if (target.classList.value === 'rules-buttons') {
        return
      }

      this.updateShowSlide(false)

      if (target.getAttribute('data-move') === 'next' && this.close) {
        localStorage.setItem('compleateTutor', true)
        this.updateRulesTrigger(false)
        return
      }

      if (target.getAttribute('data-move') === 'next' &&
      this.getIter < this.rules.length - 1) {
        this.isPrev = false
        this.updateIter(this.getIter + 1)
      }

      if (target.getAttribute('data-move') === 'prev' && this.getIter > 0) {
        this.isPrev = true
        this.updateIter(this.getIter - 1)
      }

      setTimeout(() => this.updateShowSlide(true), 0)
    },

    skipTutor (e) {
      if (e.target.classList.contains('rules') ||
      e.target.classList.contains('rules-skip')) {
        localStorage.setItem('compleateTutor', true)
        this.updateRulesTrigger(false)
      }
    }
  }
}
</script>

<style lang="scss">
@import './index';
.rules {
  position: fixed;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  &-table {
    position: fixed;
    padding: 10px 20px 20px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 1000px;
    height: 60%;
    height: 50%;
    min-width: 300px;
    width: 90%;
    overflow: hidden;
    @media screen and (max-height: 420px) {
      height: 90%;
    }
  }
  &-progress {
    position: absolute;
    top: -1px;
    margin-right: auto;
    width: 100%;
    height: 7px;
    &__inner {
      height: 100%;
      z-index: 100;
    }
  }
  &-body {
    position: relative;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    overflow-y: auto;
    &__container {
      height: 100%;
      text-align: center;
    }
  }
  &-capt {
    padding-bottom: 10px;
    display: inline-block;
    text-align: center;
    border-bottom: 2px solid $text_g;
  }
  &-img {
    position: relative;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    overflow: hidden;
    &.image {
      height: 50%;
    }
    &__item {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      display: block;
      max-width: 70%;
      max-height: 100%;
    }
  }
  &-text {
    margin: 15px 0;
    display: block;
  }
  &-buttons {
    margin-top: auto;
    margin-left: auto
  }
  &-but {
    margin-top: 10px;
    margin-right: 10px;
    padding: 10px 20px;
    font-family: $prox_b;
    font-size: 16px;
    line-height: 1.4;
    color: #fff;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
