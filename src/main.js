import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue);

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;
new Vue({
    modules: ['bootstrap-vue/nuxt'],
    render: ren => ren(App),
}).$mount('#app'); //el: '#app'

