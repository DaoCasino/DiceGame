export default {
  namespaced: true,
  state: {
    allMess : [],
    trigger : false
  },

  mutations: {
    updateChatTrigger (state, value) { state.trigger = value },

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
