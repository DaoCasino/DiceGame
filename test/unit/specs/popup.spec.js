import Vue from 'vue'
import Vuex from 'vuex'
import { shallow, createLocalVue } from '@vue/test-utils'
import StoreStub from '../store'
import Popup from '@/components/popup'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('popup.vue', () => {
  let store

  beforeEach(() => { store = new Vuex.Store(StoreStub) })

  it('Default deposit 0', () => {
    // Arrage
    const wrapper        = shallow(Popup, {store, localVue})
    const defaultDeposit = wrapper.find('.popup-deposit').text()
    // Assert
    expect(defaultDeposit).to.be.equal('0 BET')
  })

  it('change deposit', () => {
    const wrapper    = shallow(Popup, {store, localVue})
    const connectBut = wrapper.find('.popup-but')
  })

  it('DApp connect', () => {
    // Arrage
    const wrapper    = shallow(Popup, {store, localVue})
    const connectBut = wrapper.find('.popup-but')
    const handleOpen = sinon.stub(wrapper.vm, 'openChannel')
    // Act
    connectBut.trigger('click')
    // Assert
    expect(handleOpen.called).to.be.equal(true)
  })
})
