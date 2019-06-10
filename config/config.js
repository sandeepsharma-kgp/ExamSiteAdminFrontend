const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';
var dotenv = require('dotenv');
//
// db.connect({
//   host: process.env.DB_HOST,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASS
// })

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'examsiteadminfrontend'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://' + process.env.DB_USER + ':' +  process.env.DB_PASS + '@' + process.env.DB_HOST + '/examsiteadminfrontend_development',
    mongodb: 'mongodb://' + process.env.DB_HOST + '/examsiteadminfrontend_development'

  },

  // test: {
  //   root: rootPath,
  //   app: {
  //     name: 'examsiteadminfrontend'
  //   },
  //   port: process.env.PORT || 3000,
  //   db: 'mysql://localhost/examsiteadminfrontend-test'
  // },

  production: {
    root: rootPath,
    app: {
      name: 'examsiteadminfrontend'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://' + process.env.DB_HOST + '/examsiteadminfrontend-production'
  }
};

module.exports = config[env];
