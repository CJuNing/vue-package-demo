var path = require('path')

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
    //这个参数可以把静态资源路径变成相对路径
    publicPath: '/package-demo',
    //构建好的文件放在哪个目录
    outputDir: './lib/',
    // 开发环境是否source-map
    // productionSourceMap: true,

    // // 修改打包入口
    // entry: NODE_ENV == 'development' ? './src/main.js' : './packages/switch/index.js',
    // output: {
    //     path: path.resolve(__dirname, './dist'),
    //     publicPath: '../dist/',
    //     filename: 'custom-switch.js',
    //     library: 'custom-switch', // 指定的就是你使用require时的模块名
    //     libraryTarget: 'umd', // libraryTarget会生成不同umd的代码,可以只是commonjs标准的，也可以是指amd标准的，也可以只是通过script标签引入的
    //     umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
    // }

    // 用于控制打包时候是否将css代码单独打包成css文件，默认值为true，独立打包css代码 https://cli.vuejs.org/guide/build-targets.html
    // css: {
    //     extract: false
    // }
}