
module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  createdAt: DataTypes.STRING,
  updatedAt: DataTypes.STRING
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

  return User;
};
