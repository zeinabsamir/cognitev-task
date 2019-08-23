'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,   
    last_name: DataTypes.STRING,
    country_code: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    gender: DataTypes.STRING,
    birthdate: DataTypes.STRING,
    avatar: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};