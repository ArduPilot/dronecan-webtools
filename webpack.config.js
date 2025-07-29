const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    // entry: './src/index.js',
    entry: {
        main: './src/index.js',
        subscriber: './src/subscriber.js',
        bus_monitor: './src/bus_monitor.js',
        esc_panel: './src/esc_panel.js',
        actuator_panel: './src/actuator_panel.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        fallback: {
            "util": require.resolve("util/"),
            "buffer": require.resolve("buffer/"),
            "underscore": require.resolve("underscore/modules/index.js"),
            "crypto": require.resolve("crypto-browserify"),
            "long": require.resolve("long"),
            "vm": require.resolve("vm-browserify"),
            "stream": require.resolve("stream-browserify"),
            "process": require.resolve("process/browser")
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            template: './public/subscriber.html',
            filename: 'subscriber.html',
            chunks: ['subscriber']
        }),
        new HtmlWebpackPlugin({
            template: './public/bus_monitor.html',
            filename: 'bus_monitor.html',
            chunks: ['bus_monitor']
        }),
        new HtmlWebpackPlugin({
            template: './public/esc_panel.html',
            filename: 'esc_panel.html',
            chunks: ['esc_panel']
        }),
        new HtmlWebpackPlugin({
            template: './public/actuator_panel.html',
            filename: 'actuator_panel.html',
            chunks: ['actuator_panel']
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
            util: 'util',
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 8080,
    },
};