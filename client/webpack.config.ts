import * as webpack from 'webpack'
import * as path from "path"
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as express from 'express'
import * as WebpackDevServer from "webpack-dev-server"
import {httpSSRHandler} from "./SSR/handler"

const config: webpack.Configuration = {
  entry: './App/index.tsx',
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    before: (app: express.Application, server: WebpackDevServer) => {
      //todo: improve the regex
      app.get(/^((?!\.\w+).)*$/, httpSSRHandler)
    },
    proxy: {
      '/graphql': {
        redirect: false,
        changeOrigin: true,
        target: `http://localhost:4000`,
      },
      '/api': {
        redirect: false,
        changeOrigin: true,
        target: `http://localhost:4000`,
      }

    }
  },
  module: {
    rules: [
      {
        exclude: path.resolve(__dirname, "node_modules"),
        test: /\.tsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/typescript",
              "@babel/react"
            ],
            plugins: [].filter(Boolean)
          }
        }
      }    ]
  },
  devtool: '@source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [new HtmlWebpackPlugin({
    title: "blabla",
  })]

}

export default config
