
module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define("Student", {
        sbuID: {
            type: DataTypes.INTEGER(9),
            allowNull: false
        },
        department: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        track: {
            type: DataTypes.STRING,
            allowNull: true,
        }, 

        entrySemester: {

            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                is: /^[F|S]\d{2}$/i
            }

        }, 
        
    })

    Student.associate =  models => {
        Student.belongsTo(models.User, {
            foreingKey: {
                allowNull: false
            }
        })
    }


    return Student
}