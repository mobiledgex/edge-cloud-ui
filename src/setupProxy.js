const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(proxy('/api',
        {
            target: 'https://mc-stage.mobiledgex.net:9900',
            changeOrigin: true
        }
    ));
}
