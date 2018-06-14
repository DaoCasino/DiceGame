export default {
  namespaced: true,
  state: {
    img       : '',
    capt      : '',
    text      : '',
    iter      : 0,
    nextBut   : 'Next',
    trigger   : true,
    showSlide : true
  },

  mutations: {
    updateIter         (state, value) { state.iter = value },
    updateNextBut      (state, value) { state.nextBut = value },
    updateShowSlide    (state, value) { state.showSlide = value },
    updateRulesTrigger (state, value) { state.trigger = value },

    updateRules (state, value) {
      state.img  = value.img
      state.capt = value.capt
      state.text = value.text
    }
  }
}
