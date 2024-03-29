const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  questionID: String,
  questionName : String,
  option1 : String,
  option2 : String,
  option3 : String,
  option4 : String,
  level : String,
  subject : String,
  topic : String,
  uploadImage :{ data: Buffer, contentType: String }

}, {
    "freezeTableName": true
  });

module.exports = mongoose.model('Question', QuestionSchema);
