
const path = require('path')
const webpack = require('webpack')

const HTMLWebpackPlugin = require('html-webpack-plugin')
const HTMLWebpackPugPlugin = require('html-webpack-pug-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'
const CopyPlugin = require("copy-webpack-plugin")
const dirApp = path.join(__dirname, 'app')

//const dirImages 	   = path.join(__dirname, 'app/images')

const dirStyles = path.join(__dirname, 'app/styles')
const dirViews = path.join(__dirname, 'views')
const dirNode = 'node_modules'

module.exports = {
	target: ["web", "es5"],
	entry: [
		path.join(dirApp, 'index.ts'),
		path.join(dirStyles, 'main.scss')
	],
	resolve: {
		extensions: ['.ts', '.js'],
		modules: [
			dirApp,
			dirStyles,
			dirViews,
			dirNode
		]
	},

	stats: 'errors-only',
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: [
					{
						loader: "pug-loader"
					}
				]
			},

			{
				test: /\.(js|ts)?$/,
				loader: 'esbuild-loader',
				options: {
					loader: 'ts',
					target: 'es2015'
				},
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: ''
						}
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader',
					},
					{
						loader: 'sass-loader',
					},
				]
			},

			{
				test: /\.(woff2?)$/,
				type: "asset/resource",
				generator: {
					filename: './fonts/[hash][ext]'
				}
			},

			//{
			//	test: /\.glsl|fradg|vert$/,
			//	loader: 'raw-loader',
			//	type: 'javascript/auto',
			//	exclude: /node_modules/
			//},
		]
	},

	plugins: [

		new webpack.DefinePlugin({
			IS_DEVELOPMENT
		}),

		new CopyPlugin({
			patterns: [
				{
					from: 'app/images',
					to: 'images',
					noErrorOnMissing: true,
				},
			]
		}),


		new HTMLWebpackPlugin({
			template: 'app/views/index.pug',
			filename: 'index.html'
		}),
		// Add another pug page
		// new HTMLWebpackPugPlugin(),

		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css'
		}),

		new CleanWebpackPlugin(),
	],
}

