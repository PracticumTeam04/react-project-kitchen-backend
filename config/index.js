module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',
  HOST: process.env.NODE_ENV === 'production' ? process.env.HOST : 'http://localhost:3000',
};
