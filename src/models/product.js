export default function (sequelize, DataTypes) {
    return sequelize.define('Products', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING,
            unique: true
        },
        name: {
            type: DataTypes.STRING
        },
        reviews: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        }
    });
}
