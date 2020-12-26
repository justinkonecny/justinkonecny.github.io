import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;

// Creates, renders, and mounts the app
new Vue({
    modules: ['bootstrap-vue/nuxt'],
    render: ren => ren(App)
}).$mount('#app'); //el: '#app'

