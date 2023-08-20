const router = require("express").Router();
const User = require("../models/User");
const bycrypt = require("bcrypt");


//REGISTER {USER}
router.post("/register", async (req,res)=>{
    try {
        //Generate new password
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(req.body.password, salt);

        //Create new user and respond
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
    
        //Save user and return response
        const user = await newUser.save();
        res.status(200).json(user)
    } catch(err){
        res.status(500).json(err);
    }
});

//LOGIN {USER}
router.post("/login", async(req,res)=>{
    //validation for email
    try{
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).send("user not found");

    //validation for passowrd
    const validPassowrd = await bycrypt.compare(req.body.password, user.password);
    !validPassowrd && res.status(400).json("invalid password");

    res.status(200).json(user);
    } catch(err){
        res.status(500).json(err);
    }
    
});

module.exports = router;