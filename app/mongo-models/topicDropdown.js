const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const TopicSchema = new Schema({
  SID: String,
  topic : [],
  topicID : String

}, {
    "freezeTableName": true
  });

module.exports = mongoose.model('TopicID', TopicSchema);
