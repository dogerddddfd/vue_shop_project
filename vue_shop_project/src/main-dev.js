import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './plugins/element.js'
import './assets/css/global.css'

// 树状表
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)

// 文本输入
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


import api from './server'

Vue.prototype.$http = api



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
