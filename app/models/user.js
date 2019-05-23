
module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
  userId: {
       type: DataTypes.INTEGER ,
       primaryKey: true,
    },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING
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
