module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define("Student_Course", {
        department: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isIn: [['CSE', 'AMS', 'CE', 'BMI']]
            }
        },

        course_num: {
            type: DataTypes.INTEGER(3),
            allowNull: false
        },

        semester: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                //is: ["[F|S]\d{2}",'i']
            }
        },
        
        year: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        grade: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        section: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
        },

        
    }, {timestamps: false})



    return Course
}
