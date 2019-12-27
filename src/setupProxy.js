const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/api', 
        { 
            target:'http://10.156.106.74:9900',
            changeOrigin:true
        }
    ));
} 