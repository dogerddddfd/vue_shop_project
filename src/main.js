import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './plugins/element.js'
import './assets/css/global.css'

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */)


Vue.filter('dataFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const M = (dt.getMonth()+1+'').padStart(2,'0')
  const D =( dt.getDate() + '').padStart(2,'0')

  const hh=( dt.getHours()+'').padStart(2,'0')
  const mm = ( dt.getMinutes()+'').padStart(2,'0')
  const ss = ( dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${M}-${D} ${hh}:${mm}:${ss}`
})


Vue.config.productionTip = false
Vue.config.devtools=true

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use((config) => {
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios





new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
