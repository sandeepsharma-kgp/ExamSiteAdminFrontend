module.exports = (sequelize, DataTypes) => {

  const Question = sequelize.define('Question', {
  questionID: DataTypes.STRING,
  questionName : DataTypes.STRING,
  option1 : DataTypes.STRING,
  option2 : DataTypes.STRING,
  option3 : DataTypes.STRING,
  option4 : DataTypes.STRING,
  level : DataTypes.STRING,
  subject : DataTypes.STRING,
  topic : DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        // example on how to add relations
        // Article.hasMany(models.Comments);
      }
    }
  });

  return Question;
};
