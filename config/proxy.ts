export default {
  dev: {
    '/api/': {
      target: 'http://localhost:3000/',
      changeOrigin: true,
      pathRewrite: { '^/api/': '' },
    },
  },
};
