import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import '@/plugins/components.js'
import { store } from '@/plugins/store'
import { Unas } from '@/plugins/unas'

Vue.config.productionTip = false

new Vue({
  store: store,
  provide: {
    unas: new Unas(),
  },
  vuetify,
  beforeCreate() {
    this.$store.commit('init')
  },
  render: (h) => h(App),
}).$mount('#app')
