// riot route base url set in ./src/view/app.view.js line 47
import View from './view/app.view.js'
import Lib from './model/dclib'
// import slider from './model/frontend/slider'

const App = {}
window.App = App

document.addEventListener('DOMContentLoaded', () => {
  App.view = new View()
  App.view.start()
  App.lib = Lib
  Lib.createDApp('new_dicegame')
})

// Enable SW in production
// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#making-a-progressive-web-app
// serviceWorkerRegistration.register()
