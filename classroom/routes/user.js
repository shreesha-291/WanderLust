const express= require('express')
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("Get for users")
})

// Show-users-get
router.get("/:id",(req,res)=>{
    res.send("Get for show users");
})

// Show-users-post
router.post("/",(req,res)=>{
    res.send("Post for show users");
})

//delete - users 
router.delete("/:id",(req,res)=>{
    res.send("Post for show users");
})
module.exports = router;