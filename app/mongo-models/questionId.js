const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const QuestionIDSchema = new Schema({
  questionId: [String],
  SID: String,
  topic : String

}, {
    "freezeTableName": true
  });

module.exports = mongoose.model('QuestionID', QuestionIDSchema);
