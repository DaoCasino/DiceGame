export default {
  namespaced: true,
  state: {
    online  : 1,
    allMess : [],
    trigger : false
  },

  mutations: {
    updateOnline      (state, value) { state.online = value },

    updateChatTrigger (state, value) {
      state.trigger = value
      this.state.game.moduleActive = value
    },

    updateAllMessage (state, value) {
      if (state.allMess.length > 50) {
        state.allMess.shift()
      }

      state.allMess.push({
        name: value.name,
        mess: value.mess
      })
    }
  }
}
