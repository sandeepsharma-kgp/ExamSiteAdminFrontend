const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String
}, {
    "freezeTableName": true
  });



module.exports = mongoose.model('User', UserSchema);
