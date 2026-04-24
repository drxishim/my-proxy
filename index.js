const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use(express.static('public'));

app.use('/proxy', createProxyMiddleware({ 
    target: 'http://example.com',
    router: function(req) { return req.query.url; },
    changeOrigin: true,
    ws: true,
    pathRewrite: { '^/proxy': '' },
    onProxyReq: function(proxyReq, req, res) {
        proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    },
    onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        delete proxyRes.headers['x-frame-options'];
        delete proxyRes.headers['content-security-policy'];
    }
}));

app.listen(3000, () => console.log('Proxy running!'));
