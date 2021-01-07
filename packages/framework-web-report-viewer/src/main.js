import Vue from 'vue'
import App from '@/App.vue'


import 'element-ui/lib/theme-chalk/index.css';
import '@/style/index.less' // global css
import ElementUI from 'element-ui';
Vue.use(ElementUI);

/*  
按需引入element,组件内部自己引入
*/

Vue.config.productionTip = false//关闭vue开发环境的提示
 new Vue({
  components:{
    App
  },
  template:'<App/>',
}).$mount('#app')
