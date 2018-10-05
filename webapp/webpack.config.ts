import * as HTMLWebpackPlugin from 'html-webpack-plugin'
import * as path from 'path';
import * as webpack from 'webpack';
import * as wds from 'webpack-dev-server';

const Config: webpack.Configuration & {devServer: wds.Configuration} = {
  entry: './src/index.tsx',
  output: {
    filename: "[name].bundle.[hash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
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
              ["@babel/preset-env", {
                "exclude": ["transform-regenerator"]
              }],
              "@babel/typescript",
              "@babel/react"
            ],
            plugins: [
              "@babel/plugin-proposal-object-rest-spread",
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-syntax-dynamic-import"
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin(),
  ],
  devtool: 'cheap-module-source-map',
  devServer: {
    historyApiFallback: true,
    https: true,
    proxy: {
      '/api': 'https://staging.quepasaalpujarra.com'
    }
  }
}

export default Config
