import Vue from 'vue'
import App from './App'
import pageLoading from 'components/pageLoading/index'// 页面加载动图
import 'assets/css/reset'
import 'assets/js/buryingPoint'

new Vue({
  el: '#loading',
  template: '<pageLoading/>',
  components: { pageLoading }
});

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
