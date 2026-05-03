const fs = require('fs')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

class RelativeCaseSiteAssetUrlsPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('RelativeCaseSiteAssetUrlsPlugin', (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap(
                'RelativeCaseSiteAssetUrlsPlugin',
                (data) => {
                    if (!data.outputName.startsWith('ai-website-case-01/')) {
                        return data
                    }

                    const caseSitePageName = path.basename(data.outputName, '.html')
                    const caseSiteStylesheetLinks = [
                        '<link rel="stylesheet" href="assets/css/common.css">',
                        `<link rel="stylesheet" href="assets/css/${caseSitePageName}.css">`,
                    ].join('')

                    data.html = data.html.replace(/ai-website-case-01\/assets\//g, 'assets/')
                    data.html = data.html.replace(/<link rel="stylesheet" href="(?!https?:\/\/)[^"]+\.css">/g, '')
                    data.html = data.html.replace('</head>', `${caseSiteStylesheetLinks}</head>`)
                    data.html = data.html.replace(
                        /<script[^>]*data-case-script="properties-listing"[^>]*><\/script>/,
                        '<script src="assets/js/properties-listing.js"></script>'
                    )
                    data.html = data.html.replace(
                        /<script[^>]*data-case-script="property-detail"[^>]*><\/script>/,
                        '<script src="assets/js/property-detail.js"></script>'
                    )

                    return data
                }
            )
        })
    }
}

class CopyCaseSiteStaticAssetsPlugin {
    apply(compiler) {
        compiler.hooks.afterEmit.tap('CopyCaseSiteStaticAssetsPlugin', () => {
            const copyDirectories = ['assets/data', 'assets/css']

            copyDirectories.forEach((relativeDir) => {
                const sourceDir = path.resolve(__dirname, caseSiteDir, relativeDir)

                if (!fs.existsSync(sourceDir)) {
                    return
                }

                const destinationDir = path.resolve(__dirname, 'dist/ai-website-case-01', relativeDir)
                fs.mkdirSync(path.dirname(destinationDir), { recursive: true })
                fs.cpSync(sourceDir, destinationDir, { recursive: true })
            })
        })
    }
}

const caseSiteDir = './src/html/businesses/ai-website-case-01'
const caseSitePages = fs.readdirSync(path.resolve(__dirname, caseSiteDir))
    .filter((file) => file.endsWith('.pug') && !file.startsWith('_'))
    .map((file) => ({
        template: `${caseSiteDir}/${file}`,
        filename: `ai-website-case-01/${file.replace(/\.pug$/, '.html')}`,
        chunks: [],
        inject: false,
    }))

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
    ...caseSitePages,
]

module.exports = {
    mode: 'development',
    // devtool: 'source-map',
    entry: {
        main: './src/js/index.js',
        'ai-training': './src/js/ai-training.js',
        'properties-listing': './src/html/businesses/ai-website-case-01/assets/js/properties-listing.js',
        'property-detail': './src/html/businesses/ai-website-case-01/assets/js/property-detail.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '',
        filename: (pathData) => {
            const caseSiteScriptMap = {
                'properties-listing': 'ai-website-case-01/assets/js/properties-listing.js',
                'property-detail': 'ai-website-case-01/assets/js/property-detail.js',
            }

            return caseSiteScriptMap[pathData.chunk && pathData.chunk.name] || 'js/[name].js'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    }
                ]
            },
            {
                test: /\.(css|sass|scss)$/,
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
                test: /\.(png|jpg|jpeg|svg)$/,
                include: path.resolve(__dirname, caseSiteDir),
                type: 'asset/resource',
                generator: {
                    filename: 'ai-website-case-01/assets/images/[name][ext]'
                },
            },
            {
                test: /\.(png|jpg|jpeg|svg)$/,
                exclude: path.resolve(__dirname, caseSiteDir),
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name][ext]'
                },
            },
            {
                test: /\.mp4$/,
                include: path.resolve(__dirname, caseSiteDir),
                type: 'asset/resource',
                generator: {
                    filename: 'ai-website-case-01/assets/videos/[name][ext]'
                },
            },
            {
                test: /\.mp4$/,
                exclude: path.resolve(__dirname, caseSiteDir),
                type: 'asset/resource',
                generator: {
                    filename: 'media/[name][ext]'
                },
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.pug$/,
                use: [
                    {
                        loader: 'html-loader'
                    },
                    {
                        loader: 'pug-html-loader'
                    },
                ]
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: './style/[name].css',
        }),
        new RelativeCaseSiteAssetUrlsPlugin(),
        new CopyCaseSiteStaticAssetsPlugin(),
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
