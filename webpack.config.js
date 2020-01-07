const rewireLess = require('react-app-rewire-less');

module.exports = {
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader', // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            modifyVars: {
                                'hack': `true; @import "./src/css/components/antd/transfer.less";`, // Override with less file
                            },
                            javascriptEnabled: true,
                        },
                    },
                ],
            },
        ],
    },
};


module.exports = function override(config, env) {
    config = rewireLess.withLoaderOptions({
        modifyVars: {
            'hack': `true; @import "src/css/components/antd/transfer.less";`, // Override with less file
        },
        javascriptEnabled: true
    })(config, env);

    return config;
};
