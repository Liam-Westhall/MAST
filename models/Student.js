
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
                //is: /^[F|S]\d{2}$/i
            }

        }, 

        requirement_version_semester: {
            type: DataTypes.STRING,
            allowNull: true,
        }, 

        requirement_version_year: {
            type: DataTypes.STRING,
            allowNull: true,
        }, 

        graduation_semester: {
            type: DataTypes.STRING,
            allowNull: true,
        }, 

        graduation_year: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        coursePlan: {
            type: DataTypes.JSON,
            allowNull: false,
        }
        
    }, {timestamps: false})

    Student.associate =  models => {
        Student.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        }),
        
        Student.hasMany(models.Student_Course, {
            foreignKey: {
                allowNull: false
            }
        }),
        
        Student.hasMany(models.Comment, {
            foreignKey: {
                allowNull: false
            }
        })
    }


    return Student
}