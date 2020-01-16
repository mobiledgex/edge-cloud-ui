const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy('/api',
        {
            target: 'https://console-stage.mobiledgex.net:443',
            changeOrigin: true
        }
    ));
}
