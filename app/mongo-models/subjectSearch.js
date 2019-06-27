const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const SubjectArraySchema = new Schema({
  questionId: [String],
  SID: String,

}, {
    "freezeTableName": true
  });

module.exports = mongoose.model('SubjectArray', SubjectArraySchema);
