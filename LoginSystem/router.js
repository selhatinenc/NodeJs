var express=require('express');
var router=express.Router();

const credentials={
    email:"adming@gmail.com",
    password:"admin"
}
//login user
router.post('/login',(req,res)=>{
    
    if(req.body.email==credentials.email && req.body.password==credentials.password){
        req.session.user=req.body.email;
        res.redirect('/route/dashboard');

    }
    
    else
    res.end('invalid');
});
//route for dashboard
router.get('/dashboard',(req,res)=>{
    if(req.session.user){
        res.render('dashboard',{user:req.session.user});
    }
    else
    res.send('Unauthorized');
});

// route for logout
router.get('/logout',(req,res)=>{
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send('error');
        }
        else{
            console.log("user logged out.");
            res.render('base',{title:'Express',logout:'logout successfully'});

        }
    });
});
module.exports=router; 
