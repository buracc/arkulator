import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const store = new Vuex.Store({
  strict: true,
  state: {
    recSalePrice: -1,
    minTxAmount: -1,

    goldAmount: -1,
    goldPrice: -1.0,
    rcAmount: -1,
    rcPrice: -1.0,

    moneyConversion: -1,
    goldConversion: -1,
    rcConversion: -1,
  },
  mutations: {
    init(state) {
      state.minTxAmount = ifStored('mintx', 238)
      state.recSalePrice = ifStored('saleprice', 1000)

      state.goldAmount = ifStored('goldAmount', 1000)
      state.goldPrice = ifStored('goldPrice', 1.0)
      state.rcAmount = ifStored('rcAmount', 12000)
      state.rcPrice = ifStored('rcPrice', 100.0)

      state.moneyConversion = ifStored('moneyConversion', 100)
      state.goldConversion = ifStored('goldConversion', 1000)
      state.rcConversion = ifStored('rcConversion', 12000)
    },
    setSalePrice(state, value) {
      state.recSalePrice = value
      localStorage.setItem('saleprice', value)
    },
    setMinTxAmount(state, value) {
      state.minTxAmount = value
      localStorage.setItem('mintx', value)
    },
    setGoldAmount(state, value) {
      state.goldAmount = value
      localStorage.setItem('goldAmount', value)
    },
    setGoldPrice(state, value) {
      state.goldPrice = value
      localStorage.setItem('goldPrice', value)
    },
    setRcAmount(state, value) {
      state.rcAmount = value
      localStorage.setItem('rcAmount', value)
    },
    setRcPrice(state, value) {
      state.rcPrice = value
      localStorage.setItem('rcPrice', value)
    },
    setMoneyConversion(state, value) {
      state.moneyConversion = value
      localStorage.setItem('moneyConversion', value)
    },
    setGoldConversion(state, value) {
      state.goldConversion = value
      localStorage.setItem('goldConversion', value)
    },
    setRcConversion(state, value) {
      state.rcConversion = value
      localStorage.setItem('rcConversion', value)
    },
  },
})

function ifStored(key, defaultValue) {
  const stored = localStorage.getItem(key)
  return stored !== null ? stored : defaultValue
}
