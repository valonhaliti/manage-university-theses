const proxy = require('http-proxy-middleware');

const options = {
  pathRewrite: { 
    '^/api': '' 
  },
  target: 'http://localhost:3001',
}

module.exports = function(app) {
  app.use(proxy('/api', options));
};
