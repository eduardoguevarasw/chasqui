const express = require('express');
const router= express.Router();

//routers
router.get('/',(req,res)=>{
    //res.sendFile(path.join(__dirname,'views/index.html'));
    res.render('index.html');
})

router.get('/admin',(req,res)=>{
    //res.sendFile(path.join(__dirname,'views/index.html'));
    res.render('admin.html', {title: 'ADMINISTRADOR'});
})

module.exports=router;

