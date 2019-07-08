// Example model


module.exports = (sequelize, DataTypes) => {

  const UniqueSubject = sequelize.define('UniqueSubject', {
    subjectName: DataTypes.STRING
  }, {
    timestamps: true
}, {
    classMethods: {
      associate: (models) => {
      }
    }
  });

  return UniqueSubject;
};
