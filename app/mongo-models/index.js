const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  questionID: String,
  questionName : String,
  option1 : String,
  option1Image : String,
  option2 : String,
  option2Image : String,
  option3 : String,
  option3Image : String,
  option4 : String,
  option4Image : String,
  imagePath : [String],
  level : String,
  SID : String,
  topicId : [String],
  Image : String,
  answerKey : [String],
  solution : String,
  solutionImage : String,
  status : String

}, {
    "freezeTableName": true
  });

module.exports = mongoose.model('Question', QuestionSchema);
