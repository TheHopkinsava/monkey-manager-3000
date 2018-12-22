module.exports = (sequelize, DataTypes) => {
    var enclo = sequelize.define('enclo', {
        NomEnclos: DataTypes.STRING,
        TypeEnclos: DataTypes.STRING,
        Taille: DataTypes.FLOAT

    });

    return enclo;
};