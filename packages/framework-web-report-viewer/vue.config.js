const path = require('path')


function resolve (dir) {
  return path.join(__dirname,  dir)
}


module.exports = {
  runtimeCompiler: true, // 运行时包含编译器的版本
  lintOnSave: false, // 关闭ESLint编译
  configureWebpack : {
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
        '@components': resolve('src/components'),
        '@utils': resolve('src/utils'),
        '@pages': resolve('src/pages'),
      }
    },
  },
  css: { // 添加postcss配置
    extract: false,
    loaderOptions: {
      postcss: {
        plugins: [
          
        ]
      }
    }
  },
  devServer: {
    proxy: {
      '/report': {
        target: 'http://data.gofusion.cn',
        changeOrigin: true,
      }
    }
  },
 
}
