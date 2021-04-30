module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {timestamps: false});

    return Comment;
}