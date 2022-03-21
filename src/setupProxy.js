const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(createProxyMiddleware('/ws/api',
        {
            target: process.env.REACT_APP_API_ENDPOINT,
            ws: true,
            changeOrigin: false,
            secure: false,
            headers: { Host: process.env.REACT_APP_API_ENDPOINT_HOSTNAME, Origin: `https://${process.env.REACT_APP_API_ENDPOINT_HOSTNAME}` },
            pathRewrite: {
                '^/ws/api': '/ws/api'
            },
            // onProxyReqWs: (proxyReq, req, socket) => {
            //     socket.on('error', function (error) {
            //         console.warn('Websockets error.', error);
            //     });
            // }
        }
    ))
    app.use(createProxyMiddleware('/api',
        {
            target: process.env.REACT_APP_API_ENDPOINT,
            changeOrigin: true
        }
    ))
}
