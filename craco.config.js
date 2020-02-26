/*craco.config.js*/
const path = require('path');

const loaderNameMatches = function (rule, loaderName) {
    return rule && rule.loader && typeof rule.loader === 'string' &&
        (rule.loader.indexOf(`${path.sep}${loaderName}${path.sep}`) !== -1 ||
            rule.loader.indexOf(`@${loaderName}${path.sep}`) !== -1);
};

const getLoader = function (rules, matcher) {
    let loader;
    // Array.prototype.some is used to return early if a matcher is found
    rules.some(rule => {
        return (loader = matcher(rule)
            ? rule
            : getLoader(rule.use || rule.oneOf || (Array.isArray(rule.loader) && rule.loader) || [], matcher));
    });

    return loader;
};

module.exports = {
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

            }
        }
    },
    babel: {
        plugins: [
            [
                'import',
                {
                    'libraryName': 'antd',
                    'libraryDirectory':
                        'es',
                    'style': true
                },
                'ant'
            ],
        ],
    },
    plugins: [
        /*{
            plugin: reactHotReloadPlugin
        },*/

        {
            plugin: {
                overrideWebpackConfig: ({webpackConfig}) => {
                    const lessExtension = /\.less$/;

                    const fileLoader = getLoader(
                        webpackConfig.module.rules,
                        rule => loaderNameMatches(rule, 'file-loader')
                    );
                    fileLoader.exclude.push(lessExtension);

                    const lessRules = {
                        oneOf: [{
                            test: lessExtension,
                            use: [
                                {
                                    loader: require.resolve('style-loader')
                                }, {
                                    loader: require.resolve('css-loader')
                                }, {
                                    loader: require.resolve('less-loader'),
                                    options: {
                                        modifyVars: {
                                            //todo:##########################################
                                            //todo: less variable for antd dark theme
                                            //todo:##########################################
                                            '@light': '#fff',
                                            '@dark': '#000',
                                            '@heading-color': 'fade(@light, 85)',
                                            //'@text-color': 'fade(@light, 65)',
                                            '@text-color': '#fff',
                                            '@text-color-secondary': 'fade(@light, 45)',
                                            '@disabled-color': 'fade(@light, 25)',
                                            '@primary-5': '#40a9ff',
                                            '@primary-6': '#096dd9',
                                            //todo:'@primary-color': '#77BD25',
                                            '@primary-color': '#77BD25',
                                            '@outline-color': '@primary-color',
                                            '@icon-color': 'fade(@light, 65)',
                                            '@icon-color-hover': 'fade(@light, 85)',
                                            '@border-color-base': '@border-color-split',
                                            '@btn-default-color': '@heading-color',
                                            '@btn-default-bg': '#444457',
                                            '@btn-default-border': '#444457',
                                            '@btn-ghost-color': 'fade(@light, 45)',
                                            '@btn-ghost-border': 'fade(@light, 45)',
                                            '@input-color': '@text-color',
                                            '@input-bg': 'rgba(0,0,0,.6)',
                                            '@input-disabled-bg': '#1f1f1f',
                                            '@input-placeholder-color': '@text-color-secondary',
                                            '@input-hover-border-color': 'fade(@light, 10)',
                                            '@checkbox-check-color': '#3b3b4d',
                                            '@checkbox-color': '@primary-color',
                                            '@select-border-color': '#3b3b4d',
                                            '@item-active-bg': '#272733',
                                            '@border-color-split': '#17171f',
                                            '@menu-dark-bg': '#001529',
                                            '@body-background': '#30303d',
                                            '@component-background': '#23232e',
                                            '@layout-body-background': '@body-background',
                                            '@tooltip-bg': '#191922',
                                            '@tooltip-arrow-color': '#191922',
                                            '@popover-bg': '#2d2d3b',
                                            '@success-color': '#00a854',
                                            '@info-color': '@primary-color',
                                            '@warning-color': '#ffbf00',
                                            '@error-color': '#f04134',
                                            '@menu-bg': '#30303d',
                                            '@menu-item-active-bg': 'fade(@light, 5)',
                                            '@menu-highlight-color': '@light',
                                            '@card-background': '@component-background',
                                            '@card-hover-border': '#383847',
                                            '@card-actions-background': '#30303d',
                                            '@tail-color': 'fade(@light, 10)',
                                            '@radio-button-bg': 'transparent',
                                            '@radio-button-checked-bg': 'transparent',
                                            '@radio-dot-color': '@primary-color',
                                            '@table-row-hover-bg': '#383847',
                                            '@item-hover-bg': '#383847',
                                            '@alert-text-color': 'fade(@dark, 65%)',
                                            '@tabs-horizontal-padding': '12px 0',
                                            // zIndex': 'notification > popover > tooltip
                                            '@zindex-notification': '1063',
                                            '@zindex-popover': '1061',
                                            '@zindex-tooltip': '1060',
                                            // width
                                            '@anchor-border-width': '1px',
                                            // margin
                                            '@form-item-margin-bottom': '24px',
                                            '@menu-item-vertical-margin': '0px',
                                            '@menu-item-boundary-margin': '0px',
                                            // size
                                            '@font-size-base': '14px',
                                            '@font-size-lg': '16px',
                                            '@screen-xl': '1208px',
                                            '@screen-lg': '1024px',
                                            '@screen-md': '768px',
                                            '@screen-sm': '767.9px',
                                            '@screen-xs': '375px',
                                            '@alert-message-color': '@popover-bg',
                                            '@background-color-light': '@popover-bg',
                                            '@layout-header-background': '@menu-dark-bg',
                                            '@site-text-color': '@text-color',
                                            '@site-border-color-split': 'fade(@light, 5)',
                                            '@site-heading-color': '@heading-color',
                                            '@site-header-box-shadow': '0 0.3px 0.9px rgba(0, 0, 0, 0.12), 0 1.6px 3.6px rgba(0, 0, 0, 0.12)',
                                            '@home-text-color': '@text-color',
                                            '@gray-8': '@text-color',
                                            '@background-color-base': '#555',
                                            '@skeleton-color': 'rgba(0,0,0,0.8)',
                                            '@pro-header-box-shadow': '@site-header-box-shadow',
                                        },
                                        javascriptEnabled: true
                                    }
                                }
                            ]
                        }]
                    }

                    const oneOfRule = webpackConfig.module.rules.find(rule => (
                        typeof rule.oneOf !== 'undefined'
                    ));
                    const appendTo = oneOfRule ? oneOfRule.oneOf : webpackConfig.module.rules;
                    appendTo.push(lessRules);

                    return webpackConfig;
                }
            }
        },

    ]
};
