module.exports = (sequelize, DataTypes) => {

  const Topic = sequelize.define('Topic', {
  topicId: {
     type: DataTypes.STRING ,
     primaryKey: true,
  },
  topicName: DataTypes.STRING,
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
