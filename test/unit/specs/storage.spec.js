import Vue from 'vue'
import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import StoreStub from '../store'
import { store } from '@/store'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Vuex storage', () => {
  let state

  beforeEach(() => {
    state = store._modules.root._rawModule.state
  })

  it('default state', () => {
    const storeDef = StoreStub.state
    expect(state).to.be.equal(storeDef)
  })

  it('update player balance', () => {
    store.commit('updatePlayerBalance', 1)
    expect(state.balance.player_balance).to.be.equal(1)
  })

  it('update transaction hash', () => {
    const tx = '0x2b80158c49b4b04845616880066ee4e68b304f9ada1bdc3526b6d40933d938c0'
    store.commit('updateTx', tx)
    expect(state.tx).to.be.equal(tx)
  })

  it('update error text', () => {
    const text = 'Error'
    store.commit('updateError', text)
    expect(state.errorText).to.be.equal(text)
  })

  it('update balance', () => {
    store.commit('updateBalance', 1)
    expect(state.balance.deposit).to.be.equal(1)
  })

  it('update bankroller balance', () => {
    store.commit('updateBankrollBalance', 1)
    expect(state.balance.bankroller_balance).to.be.equal(1)
  })

})
