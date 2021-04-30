const express = require('express')
const router = express.Router()

const {User} = require('../../models')

router.get('/', async (req, res) => {

    var users = await User.findAll().catch((err) => console.log('caught it'));
    res.send(users)
})

//USE FOR TESTING. CAN DELETE LATER!!!!!!!!!
router.get('/new', async (req, res) => {

    try{

        await User.create({
            firstName: "John",
            lastName: "Doe",
            email: "johnDoe@mail.com",
            password: "123",
            isStudent: false
        }).catch((err) => console.log('caught it'));
        

    }catch (err) {
        console.log(err)
    }
   

   /*
   await User.create({
    firstName: "Alice",
    lastName: "PointA",
    email: "alice@mail.com"
    }) 

    await User.create({
        firstName: "Bob",
        lastName: "PointB",
        email: "bobe@mail.com"
    })
    */

    res.send("Users added!!!!")
})

module.exports = router;