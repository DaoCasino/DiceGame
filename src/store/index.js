import Vue      from 'vue'
import Vuex     from 'vuex'
import chat     from './module/chat'
import rules    from './module/rules'
import game     from './module/game'
import userData from './module/userData'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    chat,
    game,
    rules,
    userData
  }
})
