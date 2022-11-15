//注意：
//require是赋值过程，import是解构过程，
//require
// require是Node内置的用于加载模块文件函数，require函数可以读取并执行一个JavaScript文件，然后返回该模块的exports对象。
// module.exports变量（用于导出模块），require函数（用于导入模块）是CommonJS定义了两个主要概念，
// module.exports属性表示当前模块对外输出的接口，当其他文件通过require函数加载该模块时实际上就是读取module.exports中的变量。
// import
// import是ES6中的语法标准也是用来加载模块文件的， import函数可以读取并执行一个JavaScript文件， 然后返回该模块的export命令指定输出的代码。 
// export与export default均可用于导出常量、 函数、 文件、 模块， export可以有多个，export default只能有一个。
//区别
// 1，require是CommonJS规范的模块化语法，import是ECMAScript 6规范的模块化语法；
// 2，require是运行时加载，import是编译时加载；
// 3，require可以写在代码的任意位置，import只能写在文件的最顶端且不可在条件语句或函数作用域中使用；
// 4，require通过module.exports导出的值就不能再变化，import通过export导出的值可以改变；
// 5；require通过module.exports导出的是exports对象，import通过export导出是指定输出的代码；
// 6，require运行时才引入模块的属性所以性能相对较低，import编译时引入模块的属性所所以性能稍高。

const path = require('path') //导入path.js模块赋值给path对象

function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/style/variable.less'),
      ],
    })
}
//module变量代表当前模块，它的exports属性是对外的接口
//通过exports可以将模块从模块中导出，其他文件加载该模块实际上就是读取module.exports变量，他们可以是变量、函数、对象等。
module.exports = {
  // baseURl: process.env.NODE_ENV === 'production' ?'/src/' :'/',
  devServer: {
    port: 8080
  }, //设置端口
  lintOnSave: false,
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  },
}