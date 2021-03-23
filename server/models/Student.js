
module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define("Student", {
        sbuID: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
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
                notEmpty: true
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