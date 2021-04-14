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

module.exports = router;