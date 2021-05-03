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

   let result = await bcrypt.compare(password, user.password);
   
   if (!result){
      return res.status(401).json({erros: [{msg: "invalid credential"}]})
   }

   const token = jwt.sign({email: user.email, isStudent: user.isStudent}, "SECRET", {expiresIn: "1d"})
   res.json({token})

})

router.post('/newUser/', async(req, res) => {
   const {firstName, lastName, email, password} = req.body;

   var check = await User.findOne({where: {email: email}}).catch((err) => console.log('caught it'));
   if(check){ 
      return res.status(401).json({erros: [{msg: "Already Exists"}]})
   }

   let salt_rounds = 10;

   const hashed = bcrypt.hashSync(password, salt_rounds);

   let user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashed,
      isStudent: false
   }).catch((err) => console.log('caught it1'));

})



module.exports = router;