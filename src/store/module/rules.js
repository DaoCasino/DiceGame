export default {
  namespaced: true,
  state: {
    rule: {
      img       : '',
      capt      : '',
      text      : ''
    },
    iter      : 0,
    nextBut   : 'Next',
    trigger   : true,
    showSlide : true
  },

  mutations: {
    updateIter         (state, value) { state.iter = value },
    updateNextBut      (state, value) { state.nextBut = value },
    updateShowSlide    (state, value) { state.showSlide = value },

    updateRulesTrigger (state, value) {
      state.trigger = value
      this.state.game.moduleActive = value
    },

    updateRules (state, value) {
      state.rule.img  =  'dist' + value.img
      state.rule.capt = value.capt
      state.rule.text = value.text
    }
  }
}
