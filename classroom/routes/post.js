const express= require('express')
const router = express.Router();
router.get("/",(req,res)=>{
    res.send("Get for posts")
})

// Show
router.get("/:id",(req,res)=>{
    res.send("Get for post id");
})

//post
router.post("/",(req,res)=>{
    res.send("Post for posts");
})

// delete
router.delete("/:id",(req,res)=>{
    res.send("delete for post id");
})
module.exports = router;
