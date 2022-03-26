import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

const vuetifyOpts = {
  theme: { dark: true },
  icons: {
    iconfont: 'mdi',
    values: {
      goldIcon: {
        component: 'GoldIcon',
      },
      crystalIcon: {
        component: 'CrystalIcon',
      },
      royalCrystalIcon: {
        component: 'RoyalCrystalIcon',
      },
    },
  },
}

export default new Vuetify(vuetifyOpts)
