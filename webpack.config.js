const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    // devtool: 'source-map',
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '',
        filename: 'js/index.js'
    },
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    }
                ]
            },
            {
                test: /\.(css|sass|scss)/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|svg)/,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name][ext]'
                },
            },
            {
                test: /\.pug/,
                use: [
                    {
                        loader: 'html-loader'
                    },
                    {
                        loader: 'pug-html-loader'
                    },
                ]
            },
            {
                test: /\.json/,
                use: [
                    {
                        loader: 'json-loader',
                    }
                ]
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: './style/main.css',
        }),
        new HtmlWebpackPlugin({
            template: './src/html/index.pug',
            favicon: path.resolve(__dirname, './src/img/icon.png'),
            // filename: 'index.pug'
        })
    ],
    externals: {
        jquery: 'jQuery',
        aos: 'AOS',
        modaal: 'modaal'
    }
}
