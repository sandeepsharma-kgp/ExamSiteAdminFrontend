const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const TopicSchema = new Schema({
  SID: String,
  topicId : []

}, {
    "freezeTableName": true
  });

module.exports = mongoose.model('TopicID', TopicSchema);
