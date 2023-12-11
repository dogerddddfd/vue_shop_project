var express = require('express');
var router = express.Router();
var path = require("path");

var root = '/home/WORKDIR'

router.get("/", (req, res) => {
   res.sendFile(`/public/dist/index.html`,{root});
 });

router.get('/*',(req,res)=>{
   res.sendFile(`/public/dist/${req.path}`,{root});
})

 module.exports = router;