module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define("Course", {
        department: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isIn: ['CSE', 'AMS', 'CE', 'BMI']
            }
        },

        courseNumber: {
            type: DataTypes.INTEGER(3),
            allowNull: false
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        semester: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                //is: ["[F|S]\d{2}",'i']
            },
        },
        
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        credits: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        section: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
        },

        days: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        totalStudents: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    }, {timestamps: false})


    return Course
}
