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
    recSalePrice: 1000,
    minTxAmount: 238,
  },
  mutations: {
    setSalePrice(state, value) {
      state.recSalePrice = value
      localStorage.setItem('saleprice', value)
    },
    setMinTxAmount(state, value) {
      state.minTxAmount = value
      localStorage.setItem('mintx', value)
    },
  },
  getters: {
    getSalePrice: (state) => {
      const storage = localStorage.getItem('saleprice')
      return storage !== null ? storage : state.recSalePrice
    },
    getMinTxAmount: (state) => {
      const storage = localStorage.getItem('mintx')
      return storage !== null ? storage : state.minTxAmount
    },
  },
})

new Vue({
  store: store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
