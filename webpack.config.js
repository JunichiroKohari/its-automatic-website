const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const pages = [
    {
        template: './src/html/index.pug',
        filename: 'index.html',
        chunks: ['main'],
    },
    {
        template: './src/html/businesses/ai_training.pug',
        filename: 'ai_training.html',
        chunks: ['ai-training'],
    },
    {
        template: './src/html/businesses/tokushoho.pug',
        filename: 'tokushoho.html',
        chunks: ['ai-training'],
    },
]

module.exports = {
    mode: 'development',
    // devtool: 'source-map',
    entry: {
        main: './src/js/index.js',
        'ai-training': './src/js/ai-training.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '',
        filename: 'js/[name].js'
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
            filename: './style/[name].css',
        }),
        ...pages.map((page) => new HtmlWebpackPlugin({
            ...page,
            favicon: path.resolve(__dirname, './src/img/icon.png'),
        })),
    ],
    externals: {
        jquery: 'jQuery',
        aos: 'AOS',
        modaal: 'modaal'
    }
}
