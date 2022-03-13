import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import '@/plugins/components.js'
import { store } from '@/plugins/store'

Vue.config.productionTip = false

new Vue({
  store: store,
  vuetify,
  beforeCreate() {
    this.$store.commit('init')
  },
  render: (h) => h(App),
}).$mount('#app')
