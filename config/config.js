const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'examsiteadminfrontend'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://Turbo:temp12345@localhost/examsiteadminfrontend_development',
    mongodb: 'mongodb://localhost/examsiteadminfrontend_development'

  },

  test: {
    root: rootPath,
    app: {
      name: 'examsiteadminfrontend'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/examsiteadminfrontend-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'examsiteadminfrontend'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/examsiteadminfrontend-production'
  }
};

module.exports = config[env];
