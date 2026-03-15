const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req,res) => {

    const {name,email,password} = req.body;

    try {

        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json(user);

    } catch(error){
        res.status(500).json({message:error.message});
    }
};


exports.loginUser = async (req,res) => {

    const {email,password} = req.body;

    try {

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
//why do we need to generate a token here? 
// because we need to authenticate the user and 
// authorize the user to access the protected routes. 
// we can use the token to verify the user's identity and grant access to the protected routes.
        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );
//why do we send the response sent to the frontend?
// we send the response to the frontend so that the frontend can store the token in the local 
// storage and use it to authenticate the user and authorize the user to access the protected routes.
        res.json({
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        });

    } catch(error){
        res.status(500).json({message:error.message});
    }

};

exports.getUserProfile = async (req, res) => {

  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }

};