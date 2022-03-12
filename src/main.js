import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import '@/plugins/components.js'
import Vuex from 'vuex'

Vue.use(Vuex)

Vue.config.productionTip = false

const store = new Vuex.Store({
  strict: true,
  state: {
    recSalePrice: 800,
    minTxAmount: 238,
  },
  mutations: {
    setSalePrice(state, value) {
      state.recSalePrice = value
    },
    setMinTxAmount(state, value) {
      state.minTxAmount = value
    },
  },
})

new Vue({
  store: store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
