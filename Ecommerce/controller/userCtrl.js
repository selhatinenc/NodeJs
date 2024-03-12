const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const { generaterefreshToken } = require('../config/refreshtoken');
const jwt=require('jsonwebtoken');
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });

    if (!findUser) {
        const newUser = await User.create(req.body);
        res.json({ newUser });
    } else {8
        throw new Error('User already exists');
    }
});


const loginUserCtrl =asyncHandler(async(req,res)=>{
    const{email,password}=req.body;
    // check if user exists
    const user=await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        const refreshToken=await generaterefreshToken(user?._id);
        const updateuser=await User.findByIdAndUpdate(user?._id,{refreshToken:refreshToken},{new:true});
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            path:'/api/user/refresh_token',
            maxAge:72*60*60*1000, // 7 days
        });
        res.json({
            _id:updateuser?._id,
            firstname:user?.firstname,
            lastname:user?.lastname,
            email:user?.email,
            mobile:user?.mobile,
            token:generateToken(user?._id),
        });

    }
    else{
        throw new Error('Invalid email or password');
    }
    

    
});
//handle refresh token
const handleRefreshToken=asyncHandler(async(req,res)=>{

    const cookie=req.cookie;
  //  console.log(cookie);
    if(!cookie.refreshToken){
        throw new Error('No refresh token');
    }
    const refreshToken=cookie.refreshToken;
    const user=await User.findOne({refreshToken:refreshToken});
    if(!user){
        throw new Error('No user found');
    }
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{

        if(err||user.id!==decoded.id){
            throw new Error('Invalid refresh token');
        }
        const accessToken=generateToken(user?._id);
        res.json({accessToken});

        
    
    

}); });

// get All users 
const getUsers=asyncHandler(async(req,res)=>{
    try{
        const users=await User.find();
        res.json(users);
    }
    catch(err){
        throw new Error(err);
    }

  
});

// logout function
const logout=asyncHandler(async(req,res)=>{
    const cookie=req.cookie;
    if(!cookie.refreshToken){
        throw new Error('No refresh token');
    }
    const refreshToken=cookie.refreshToken;
    const user=await User.findOne({refreshToken:refreshToken});
    if(!user){
        res.clearCookie('refreshToken',{httpOnly:true,secure:true});
    
        return res.status(204);
    }
         await User.findByIdAndUpdate(refreshToken,{refreshToken:"",});

        res.clearCookie('refreshToken',{httpOnly:true,secure:true});
        return res.status(204);
});

//update a user
const updateauser=asyncHandler(async(req,res)=>{
    const { _id}=req.user;
    try {
        const updateUser= await User.findByIdAndUpdate(_id, {    
            
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            mobile:req.body.mobile,
          }, {new:true});
        res.json(updateUser
     
            );
    } catch (error) {
        throw new Error(error);
        
    }

});
// get single user
const getaUser= asyncHandler(async(req,res)=>{
    validateMongoDbId(req.params.id);
    try{
        const user=await User.findById(req.params.id);
        res.json(user);
    }
    catch(err){
        throw new Error(err);
    }

  
}
);
//delete user
const deleteaUser=asyncHandler(async(req,res)=>{
    validateMongoDbId(req.params.id);

    try{
        const deleteaUser=await User.findByIdAndDelete(req.params.id);
        res.json(deleteaUser);
    }
    catch(err){
        throw new Error(err);
    }

  
}
);

// block user
const blockUser=asyncHandler(async(req,res)=>{

    //const{id}=req.params;
    validateMongoDbId(req.params.id);

    try{
        const blockUser=await User.findByIdAndUpdate(req.params.id,{isBlocked:true},{new:true});
        res.json(blockUser);
        message="User blocked successfully";
    }
    catch(err){
        throw new Error(err);
    }

  
}
);
// unblock user 
const unblockUser= asyncHandler(async(req,res)=>{
    validateMongoDbId(req.params.id);

    try{
        const unblockUser=await User.findByIdAndUpdate(req.params.id,{isBlocked:false},{new:true});
        res.json(unblockUser);
        message="User unblocked successfully";

        
    }
    catch(err){
        throw new Error(err);
    }

  
}
);



module.exports = { 
    createUser,
    loginUserCtrl,
    getUsers,
    getaUser,
    deleteaUser,
    updateauser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout
};
