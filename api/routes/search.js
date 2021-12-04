const router = require("express").Router()
const User = require("../models/User")
const Post = require("../models/Post");

router.get("/user/post/:username", async (req, res) => {
    console.log(req)
    try{
const user = await User.findById(req.params.id);
if(user.username === req.body.username){
    try{
        const showPost = await Post.find(
            req.params.id,
     {
      $set:req.body,
     },
        );
        res.status(200).json(showPost)
    }catch(err){
        res.status(500).json(err)
    } 
});

module.exports = router;