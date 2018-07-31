// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue        from 'vue'
import App        from './App'
import { store }  from './store'
import DC         from './lib/DCLib'

import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'

Vue.config.productionTip = false
Vue.use(DC, '$DC')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
