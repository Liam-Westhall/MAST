const bodyParser = require('body-parser')
const express = require('express')
const {Op} = require("sequelize")
const router = express.Router()

const {Student, User, sequelize, Sequelize, Degree, Comment} = require('../../models')

router.post('/', async (req, res) => {
    
    const {id} = req.body

    console.log(req.body);
    var user = await Student.findOne({where: {sbuID: id}});
    var comments = await Comment.findAll({where: {StudentId: user.id}})
    console.log(comments)
    res.send(comments)
})

router.post('/add_comment', async (req, res) => {
    const {sbuID, comment} = req.body
    var student = await Student.findOne({where: {sbuID: sbuID}});
    let new_comment = await Comment.create({
        message: comment,
        StudentId: student.id
    });

})
module.exports = router;