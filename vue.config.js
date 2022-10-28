// const { defineConfig } = require('@vue/cli-service')
// const { default: VueRouter } = require('vue-router')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   lintOnSave: false,

//   chainWebpack:config=>{
//     // 发布模式
//     config.when(process.env.NODE_ENV==='production',config=>{
//       config.entry('app').clear().add('./src/main-prod.js')

//       config.set('externals',{
//         vue:"Vue",
//         'vue-router':VueRouter,
//         axios:'axios',
//         lodash:'_',
//         echarts:'echarts',
//         nprogress:'NProgress',
//         "vue-quill-editor":'VueQuillEditor',
//       })
//     })
//     // 开发模式
//     config.when(process.env.NODE_ENV==='development',config=>{
//       config.entry('app').clear().add('./src/main-dev.js')
//     })
//   },
// })


module.exports = {
  transpileDependencies: true,
  lintOnSave: false,
  // 发布模式 
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config.plugin('html').tap(args =>{
        args[0].isProd =true
        return args
      })

      config.entry('app').clear().add('./src/main-prod.js')

      config.set('externals', {
        vue: "Vue",
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        "vue-quill-editor": 'VueQuillEditor',
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.plugin('html').tap(args =>{
        args[0].isProd =false
        return args
      })
      config.entry('app').clear().add('./src/main-dev.js')
    })
  },
}