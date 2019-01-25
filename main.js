import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: ren => ren(App),
}).$mount('#app') //el: '#app'

