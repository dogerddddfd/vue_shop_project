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
      config.plugin('html').tap(args => {
        args[0].isProd = true
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
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
      config.entry('app').clear().add('./src/main-dev.js')

    })
  },


  devServer: {
    port:8080,
    host:'127.0.0.1',
    open:true,
    https:false,
    proxy: {
      '/api': {    //这里的/api表示的意思是以/api开头的才生效 ->刷下面的重点
        target: "http://192.168.3.78:8888",
        changOrigin: true,   //如果接口跨域这里就要这个参数配置
        // pathRewrite: {
        //   '^/api': '/api' 
        // }
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production' ? './home/' : '/',
}