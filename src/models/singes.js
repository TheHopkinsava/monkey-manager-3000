module.exports = (sequelize, DataTypes) => {
    var singe = sequelize.define('singe', {
        nomSinge: DataTypes.STRING,
        poidSinge: DataTypes.FLOAT,
        espece: DataTypes.STRING,
        age:DataTypes.FLOAT,
        sexe:DataTypes.STRING,
        couleur:DataTypes.STRING
        
    });

    return singe;
};