import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

// Creates, renders, and mounts the app
new Vue({
    modules: ['bootstrap-vue/nuxt'],
    render: ren => ren(App)
}).$mount('#app'); //el: '#app'

