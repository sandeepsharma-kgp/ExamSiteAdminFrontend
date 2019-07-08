// Example model


module.exports = (sequelize, DataTypes) => {

  const Subject = sequelize.define('Subject', {
    subjectName: DataTypes.STRING,
    class: DataTypes.STRING,
    board: DataTypes.STRING,
    SID : DataTypes.STRING
  }, {
    timestamps: true
}, {
    classMethods: {
      associate: (models) => {
        // example on how to add relations
        // Article.hasMany(models.Comments);
      }
    }
  });

  return Subject;
};
