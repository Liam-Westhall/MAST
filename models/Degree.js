module.exports = (sequelize, DataTypes) => {
    const Degree = sequelize.define("Degree", {
        department: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isIn: [['CSE', 'AMS', 'CE', 'BMI']]
            }
        },
        track: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    is: /^[F|S]\d{2}$/i
                }
        },
        json: {
            type: DataTypes.STRING,
            allowNull: false,
        }
        }, {timestamps: false})

    return Degree
}