module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define("Course_Offerings", {
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
        
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        credits: {
            type: DataTypes.INTEGER,
            allowNull: false.valueOf,
            defaultValue: 3
        },

       // prerequisites: {
            //TODO:PREREQS
       // }

    }, {timestamps: false})


    return Course
}
