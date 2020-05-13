module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "plugin:react/recommended",
        "airbnb"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
        strict: 0,
        "indent": ["error", 4],
        quotes: ["error", "double"],
        "object-curly-spacing": [2, "always"],
        "react/prop-types": [0],
        "max-len": [2, { code: 3500 }],
        // "off" or 0 - turn the rule off
        // "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
        // "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
        // "no-var": 0,
        "camelcase": 0,
        "no-console": 0,
        "no-plusplus": 0,
        "vars-on-top": 0,
        "no-unused-vars": 0,
        "no-underscore-dangle": 0, // var _foo;
        "comma-dangle": 0,
        "func-names": 0, // setTimeout(function () {}, 0);
        "prefer-arrow-callback": 0, // setTimeout(function () {}, 0);
        "prefer-template": 0,
        "no-nested-ternary": 0,
        "max-classes-per-file": 0,
        "arrow-parens": ["error", "as-needed"], // a => {}
        "no-restricted-syntax": [0, "ForOfStatement"],
        "no-param-reassign": ["error", { "props": false }],
        "react/jsx-filename-extension": 0,
        "react/jsx-indent": 0,
        "react/jsx-indent-props": 0

    }
};
