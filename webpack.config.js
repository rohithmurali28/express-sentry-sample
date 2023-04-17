const path = require('path');
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
module.exports = {
    mode: 'production',
    entry: './server.js',
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'server.js',
    },
    plugins: [
        new SentryWebpackPlugin({
            org: "foo-org", //TODO: update your org from sentry
            project: "test-express",   //TODO: update your project from sentry
            include: "./dist",
            authToken: 'bb85646208c34048a52c125c673184788a98cff3bcb54944b643e50d5754a550', //TODO: update your token from sentry
            release: Date.now(),
        })
    ],
    target: 'node',
    devtool: 'source-map',
};