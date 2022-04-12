/*craco.config.js*/
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

/**
 * configures worker-loader and makes sure each worker goes to a different file, as desired.
 * **/
function makeMultipleWebworkersWork(config){
    // Change the output file format so that each worker gets a unique name
    config.output.filename = 'static/js/[name].bundle.js'
    // Now, we add a rule for processing workers
    return {

        test: /\.worker\.(c|m)?[tj]s$/i,
        type: "javascript/auto",
        // include:  config.module.rules[1].include,
        use: [
            {
                loader: "worker-loader",
            },
            {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"],
                },
            },
        ]
    }
}

module.exports = {
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    },
    dev: {
        useEslint: true
    },
    eslint: {
        configure: {
            rules: {
                "no-unused-vars": "off",
                "array-callback-return": "off",
                "no-var": "off",
                "eqeqeq": "off",
                "no-useless-concat": 'off',
                "react/no-direct-mutation-state": 'off',
                'no-mixed-operators': 'off',
                'no-unreachable': 'off',
                'react/jsx-no-duplicate-props': 'off',
                'no-useless-constructor': 'off',
                'no-dupe-keys': 'off',
                'default-case': 'off',
                'react/jsx-no-target-blank': 'off',
                'no-lone-blocks': 'off',
                'no-dupe-class-members': 'off',
                'no-useless-escape': 'off',
                'no-self-assign': 'off',
                'jsx-a11y/alt-text': 'off',
                'react/style-prop-object': 'off',
                'jsx-a11y/accessible-emoji': 'off',
                'react/jsx-pascal-case': 'off',
                'jsx-a11y/iframe-has-title': 'off',
                'react-hooks/exhaustive-deps': 'off',
                'no-undef': 'off',
                'no-loop-func': 'off',
                'no-unused-expressions': 'off',
                'no-sequences': 'off',
                'no-whitespace-before-property': 'off'
            }
        }
    },
    babel: {
        plugins: [],
        "env": {
            "production": {
                "plugins": ["transform-remove-console"]// remove all console.log at production build
            }
        }
    },
    plugins: [
        {
            plugin: new webpack.WatchIgnorePlugin({ paths: [/^\.\/locale$/, /moment$/] }),
        },
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig }) => {
                    webpackConfig.module.rules.push(makeMultipleWebworkersWork(webpackConfig))
                    return webpackConfig;
                }
            }
        },

    ]
};
