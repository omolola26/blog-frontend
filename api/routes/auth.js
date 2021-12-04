const router = require("express").Router();
//const { Router } = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");

router.post("/register", async (req, res) => {
  try{
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt)
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPass,
  });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    // if (!user) {
    //   res.status(400).json("Wrong credentials!");
    // }
    !user && res.status(400).json("Wrong credentials!");
    const validate = await bcrypt.compare(req.body.password, user.password);
    !validate && res.status(400).json("Wrong  credentials!");

    
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put("/:id", async (req, res) =>{
if(req.body.userId === req.params.id){
  if(req.body.password) {
    const salt = await bcrypt.genSalt(10);
     req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  try{
const updatedUser = await User.findByIdAndUpdate(
  req.params.id,
  {
  $set: req.body,
},
{ new: true }
);
res.status(200).json(updatedUser)
  } catch (err) {
    res.status(500).json(err);
  }
} else {
  res.status(401).json("You can update only your account!")
}
});


router.delete("/:id", async (req, res) =>{
  if(req.body.userId === req.params.id){
try{

const user = await User.findById(req.params.id);
    try{
      await Post.deleteMany({ username: user.username });
  await User.findByIdAndDelete(req.params.id) 
    res.status(200).json("User has been deleted...");
  }  catch (err) {
      res.status(500).json(err);
    }
} catch(err){
  res.status(404).json("User not found!");
}
  } else {
    res.status(401).json("You can delete only your account!")
  }
  });
module.exports = router;
