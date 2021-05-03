const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const bcrypt = require('bcrypt')

const {Student, User} = require('../../models')

//LOGIN
router.post('/', async (req, res) => {

   const {email, password} = req.body


   var user = await User.findOne({where: {email: email}}).catch((err) => console.log('caught it'));
   if(!user){ 

      return res.status(401).json({erros: [{msg: "invalid credential"}]})
   }
    //not secured use bcrypt to encrypt password... for now it fine i guess
   if  (await !bcrypt.compare(user.password, password))  return res.status(401).json({erros: [{msg: "invalid credential"}]})

   const token = jwt.sign({email: user.email, isStudent: user.isStudent}, "SECRET", {expiresIn: "1d"})
   res.json({token})

})



module.exports = router;