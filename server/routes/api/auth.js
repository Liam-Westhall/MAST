const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const {Student, User} = require('../../models')

//LOGIN
router.post('/', async (req, res) => {

   const {email, password} = req.body

   var user = await User.findOne({where: {email: email}})
   if(!user) return res.status(401).json({erros: [{msg: "invalid credential"}]})

    //not secured use bcrypt to encrypt password... for now it fine i guess
   if (user.password != password)  return res.status(401).json({erros: [{msg: "invalid credential"}]})

   const token = jwt.sign({email: user.email}, "SECRET", {expiresIn: "1d"})

   res.json({token})

})



module.exports = router;