const proxy = require('http-proxy-middleware');

const options = {
  pathRewrite: {
    '^/api': ''
  },
}

module.exports = function(app) {
  app.use(proxy('/api', { 
    target: 'http://localhost:3001', 
    pathRewrite: { '^/api': '' }
  }));
};
