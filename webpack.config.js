const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
//const ExtractPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = {
  target: 'web',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: 'boundle.[hash:8].js',
    path: path.join(__dirname, 'dist')
  },
  mode: 'none',
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin(),
    new HTMLPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.jsx$/,
        use: 'babel-loader'
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: '[name]-aaa.[ext]'
            }
          }
        ]
      }
    ]
  }
}

if (isDev) {
  config.module.rules.push({
    test: /\.styl(us)?$/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true
        }
      },
      'stylus-loader'
    ]
  })
  config.devtool = '#cheap-module-eval-source-map'
  config.devServer = {
    port: 8000,
    host: '0.0.0.0',
    overlay: {
      errors: true
    },
    //open: true
    hot: true
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  config.entry = {
    app: path.join(__dirname,'./src/index.js'),
    vendor: ['vue']
  },
  config.output.filename = '[name].[chunkHash:8].js'
  let extractLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {}
  }

  config.module.rules.push({
    test: /\.styl(us)?$/,
    use: [
      extractLoader,
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true
        }
      },
      'stylus-loader'
    ]
  }),
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'styles.[contentHash:8].css'
      }),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'vendor'
      // })
    ),
    config.optimization= {
      splitChunks: {
        name: 'vendor'
      },
      runtimeChunk: {
        name: 'runtime'
      }
    }
}

module.exports = config
