
  module.exports = (sequelize, DataTypes) => {

    const Topic = sequelize.define('Topic', {
      quesID: String,
      ques: String,
      option1: String,
      option2: String,
      option3: String,
      option4: String,
      level: String,
      subject: String,
      topic: String
      }, {
      timestamps: false
  }, {
      classMethods: {
        associate: (models) => {
          // example on how to add relations
          // Article.hasMany(models.Comments);
        }
      }
    });

    return Topic;
  };
