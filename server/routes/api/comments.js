const express = require('express')
const {Op} = require("sequelize")
const router = express.Router()

const {Student, User, sequelize, Sequelize, Degree, Comment} = require('../../models')

router.get('/', async (req, res) => {

    var comments = await Comment.findAll()
    res.send(comments)
})

module.exports = router;