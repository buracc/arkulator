import Vue from 'vue'

const requireComponent = require.context('@/components/', true, /[A-Z]\w+\.(vue|js)$/)

requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.split('/').pop().replace('./', '').replace('.vue', '')

  Vue.component(componentName, componentConfig.default || componentConfig)
})
