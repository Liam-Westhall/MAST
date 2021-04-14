module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define("Course", {
        department: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isIn: [['CSE', 'AMS', 'CE', 'BMI']]
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

        semesters: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                //is: ["[F|S]\d{2}",'i']
            },
            get() {
                return this.getDataValue('favColors').split(';')
            },
            set(val) {
               this.setDataValue('favColors',val.join(';'));
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
        }
    }, {timestamps: false})



    return Course
}
