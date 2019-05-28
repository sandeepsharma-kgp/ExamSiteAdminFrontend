module.exports = (sequelize, DataTypes) => {

  const Level = sequelize.define('Level', {
  ID: {
     type: DataTypes.STRING ,
     primaryKey: true,
  },
  Type: DataTypes.STRING,
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

  return Level;
};
