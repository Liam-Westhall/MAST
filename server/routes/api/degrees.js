const express = require('express')
const {Op} = require("sequelize")
const router = express.Router()

const {Student, User, sequelize, Sequelize, Degree} = require('../../models')

router.get('/', async (req, res) => {

    var degrees = await Degree.findAll().catch((err) => console.log('caught it'));
    res.send(degrees)
})

module.exports = router;