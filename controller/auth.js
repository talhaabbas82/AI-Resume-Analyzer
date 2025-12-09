const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {  User } = require("../schema/signup")
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("dotenv").config();




mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("Mongodb is connected"))
.catch((error)=> console.log("Mongodb is not connected", error));



async function auth(req,res){
    res.send("Hello World!!!")
};




async function Signup(req, res) {
  try {
    const { Name, userName, Email, Password } = req.body;

    
    const exist = await User.findOne({ Email });
    if (exist) {
      return res.send({
        status: 400,
        message: "User already exists",
      });
    }

    
    const hash = await bcrypt.hash(Password, 10);


    const newUser = await User.create({
      Name,
      userName,
      Email,
      Password: hash,
    });

    return res.send({
      status: 200,
      message: "User created successfully",
      user: newUser,
    });

  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Server error, user not created",
      error,
    });
  }
}

async function Login(req,res) {
  try{
     const { Email, Password } = req.body;

  const user = await User.findOne({ Email });
  if (!user) return res.json({ message: "User not found" });

  const match = await bcrypt.compare(Password, user.Password);
  if (!match) return res.json({ message: "Wrong password" });

  const token = jwt.sign({ id: User._id }, process.env.JWTSECRETKEY);
  console.log(token);

  res.json({ message: "Login successful", token });

  }
  catch(error){
       res.send({
        status: 404,
        message: "user not find",
        error,
       })
  }
}





async function home(req, res) {

    const { User } = req;
    console.log(User, "this is line 139");

    try {

        return res.send({

            status: 200,
            message: `Welcome ${User.fullName}`,
        })

    }
    catch (err) {

        console.log("SIGNUP ERROR:", err);

        return res.send({

            status: 500,
            message: "Sorry! Server is not responding"
        })
    }
}






module.exports = {auth,Signup,Login,home}