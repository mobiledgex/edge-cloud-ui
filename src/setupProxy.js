const proxy = require('http-proxy-middleware');


module.exports = function(app) {
    app.use(proxy('/api', 
        { 
            target:`http://${process.env.REACT_APP_API_ENDPOINT}`,
            changeOrigin:true
        }
    ));
} 