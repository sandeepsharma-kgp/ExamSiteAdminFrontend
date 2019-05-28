// Example model


module.exports = (sequelize, DataTypes) => {

  const UniqueSubject = sequelize.define('UniqueSubject', {
  // subjectID: {
  //    type: DataTypes.STRING ,
  //    primaryKey: true,
  // },
    subjectName: DataTypes.STRING
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

  return UniqueSubject;
};
