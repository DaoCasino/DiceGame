import riot from 'riot'

export default new class State {
  constructor () {
    riot.observable(this)
  }
}()
