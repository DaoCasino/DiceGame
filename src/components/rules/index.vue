<template lang="pug">
  transition(name="slider")
    .rules(v-if="getRulesTrigger" @click="skipTutor")
      .rules-table(ref="rulesTable")
        .rules-progress
          .rules-progress__inner(ref="progress")
        transition(name="next-slide" mode="in-out")
          .rules-body(
            v-if="getShowSlide" 
            v-bind:class="{ prev: isPrev }"
          )
            h2.rules-capt {{ getCurrentCapt }}
            img.rules-img(
              v-if="imgShow"
              :src="getCurrentImg"
            )
            p.rules-text {{ getCurrentText }}
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
import _rules from '@/model/rules'
export default {
  data () {
    return {
      prev      : false,
      iter      : 0,
      width     : 0,
      rules     : _rules,
      close     : false,
      isPrev    : false,
      imgShow   : false,
      showSkip  : true,
      prevShow  : false,
    }
  },

  computed: {
    getId           () { return this.$store.state.rules.id },
    getIter         () { return this.$store.state.iter },
    getButName      () { return this.$store.state.rules.nextBut },
    getShowSlide    () { return this.$store.state.showSlide },
    getCurrentImg   () { return this.$store.state.rules.img },
    getCurrentCapt  () { return this.$store.state.rules.capt },
    getCurrentText  () { return this.$store.state.rules.text },
    getRulesTrigger () { return this.$store.state.triggers.rules }
  }, 

  watch: {
    windowWidth (newWidth) {
      this.width = newWidth
    }
  },

  beforeMount () {
    (!localStorage.getItem('compleateTutor')) && this.$store.commit('updateRulesTrigger', true)

    this.$store.commit('updateRules', {
      img  : this.rules[this.getIter].img,
      capt : this.rules[this.getIter].capt,
      text : this.rules[this.getIter].text
    })
  },

  mounted () { 
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

  beforeUpdate () {
    this.$store.commit('updateRules', {
      img  : this.rules[this.getIter].img,
      capt : this.rules[this.getIter].capt,
      text : this.rules[this.getIter].text
    })
  },

  updated () {
    if (this.getIter === (this.rules.length - 1)) {
      this.$store.commit('updateNextBut', 'Close')
      this.close = true
      this.showSkip = false
    } else {
      this.$store.commit('updateNextBut', 'Next') 
      this.close = false
      this.showSkip = true 
    }

    this.prevShow = (this.getIter > 0) ? true : false
    this.imgShow  = (this.getIter > 0) ? true : false

    this.progressMove()
  },

  methods: {
    progressMove () {
      if (typeof this.$refs.progress !== 'undefined') {
        const OneSlide     = this.windowWidth / this.rules.length
        const currentWidth = OneSlide * (this.getIter + 1)

        this.$refs.progress.style.width = currentWidth + 'px'
      }
    },

    slideMove (e) {
      const target   = e.target
      this.$store.commit('updateShowSlide', false)

      if (target.classList.value === this.$refs.rulesBut.classList.value)
        return

      if (target.getAttribute('data-move') === 'next' && this.close) {
        this.$store.commit('updateRulesTrigger', false)
        return
      }

      if (target.getAttribute('data-move') === 'next' 
      && this.getIter < this.rules.length - 1) {
        this.isPrev = false
        this.$store.commit('updateIter', this.getIter + 1)
      }

      if (target.getAttribute('data-move') === 'prev' 
      && this.getIter > 0) {
        this.isPrev = true
        this.$store.commit('updateIter', this.getIter - 1)
      }

      setTimeout(() => this.$store.commit('updateShowSlide', true), 1)
    },

    skipTutor (e) {
      if (e.target.classList.contains('rules') 
      || e.target.classList.contains('rules-skip')) {
        this.$store.commit('updateRulesTrigger', false)
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
    min-height: 400px;
    width: 90%;
    overflow: hidden;
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
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  &-capt {
    padding-bottom: 10px;
    display: block;
    border-bottom: 2px solid $text_g;
  }
  &-img {
    margin-top: 15px;
    width: 50%;
    height: 100%;
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
