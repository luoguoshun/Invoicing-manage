 //  export default {
 //   /**
 //    * @description 配置显示在浏览器标签的title
 //    */
 //   title: 'iView-admin',
 //   /**
 //    * @description token在Cookie中存储的天数，默认1天
 //    */
 //   cookieExpires: 1,
 //   /**
 //    * @description 是否使用国际化，默认为false
 //    *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
 //    *              用来在菜单中显示文字
 //    */
 //   useI18n: true,
 //   /**
 //    * @description api请求基础路径
 //    */
 //   baseUrl: {
 //     dev: 'https://www.easy-mock.com/mock/5add9213ce4d0e69998a6f51/iview-admin/',
 //     pro: 'https://produce.com'
 //   },
 //   /**
 //    * @description 默认打开的首页的路由name值，默认为home
 //    */
 //   homeName: 'home',
 //   /**
 //    * @description 需要加载的插件
 //    */
 //   plugin: {
 //     'error-store': {
 //       showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
 //       developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
 //     }
 //   }
 // }

 'use strict'

 const path = require('path')

 module.exports = {
   dev: {

     // Paths
     assetsSubDirectory: 'static',
     assetsPublicPath: '/',
     proxyTable: {},

     // Various Dev Server settings
     host: 'localhost', // can be overwritten by process.env.HOST
     port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
     autoOpenBrowser: false,
     errorOverlay: true,
     notifyOnErrors: true,
     poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

     devtool: 'cheap-module-eval-source-map',

     cacheBusting: true,

     cssSourceMap: true
   },

   build: {
     // Template for index.html
     index: path.resolve(__dirname, '../dist/index.html'),

     // Paths
     assetsRoot: path.resolve(__dirname, '../dist'),
     assetsSubDirectory: 'static',
     assetsPublicPath: '/',

     /**
      * Source Maps
      */

     productionSourceMap: true,
     // https://webpack.js.org/configuration/devtool/#production
     devtool: '#source-map',

     //默认情况下，Gzip关闭了许多流行的静态主机，如
     //Surge或Netlify已经为您打包了所有静态资产。
     //在设置为“true”之前，请确保：
     //npm安装--保存dev压缩webpack插件
     productionGzip: false,
     productionGzipExtensions: ['js', 'css'],

     //运行带有额外参数的build命令
     //生成完成后查看捆绑包分析器报告：
     //`npm运行生成--报告`
     //设置为“true”或“false”以始终打开或关闭它
     bundleAnalyzerReport: process.env.npm_config_report
   }
 }