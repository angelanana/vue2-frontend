const path = require('path')
const { defineConfig } = require('@vue/cli-service')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const os = require('os')
// cpu核数
const threads = os.cpus().length

const productionGzipExtensions = ['js', 'css']
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = defineConfig({
  publicPath: './',
  // outputDir: 在npm run build时 生成文件的目录 type:string, default:'dist'
  outputDir: 'production_dist',
  transpileDependencies: true,
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
      .set('_a', resolve('src/apis'))
      .set('_u', resolve('src/utils'))
      .set('_v', resolve('src/views'))
    // config.module
    //   .rule('js')
    //   .exclude
    //   .add(/\.worker.js$/)
    //   .end()
    //   .use('thread-loader')
    //   .loader('thread-loader')
    //   .options({
    //     workers: threads
    //   })
    //   .end()
  },
  configureWebpack: config => {
    config.cache = {
      type: 'filesystem'
    }
    if (
      process.env.NODE_ENV !== 'development' &&
      process.env.NODE_ENV !== 'test'
    ) {
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp(`\\.(${productionGzipExtensions.join('|')})$`),
          threshold: 10240,
          minRatio: 0.8
        })
      )
      config.plugins.push(
        new TerserPlugin({
          terserOptions: {
            warnings: false,
            parallel: threads,
            compress: {
              drop_debugger: true, // console
              drop_console: true,
              pure_funcs: ['console.log'] // 移除console
            }
          }
        })
      )
    }
  },
  devServer: {
    port: 8080, // 端口号
    host: 'localhost',
    https: false, // https:{type:Boolean}
    // open: true, // 配置自动启动浏览器
    historyApiFallback: true,
    allowedHosts: 'all'
  },
})
