const express=require('express');
const { createUser, loginUserCtrl,getUsers,
getaUser,deleteaUser ,updateauser,blockUser,unblockUser, handleRefreshToken, logout} = require('../controller/userCtrl');
const{authMiddleware,isAdmin}=require('../middlewares/authMiddleware');
const router=express.Router();

router.post('/register',createUser);
router.post('/login',loginUserCtrl);
router.put('/refresh',handleRefreshToken);
router.get('/logout',authMiddleware,logout);
router.get('/all-users',getUsers);
router.get('/:id',authMiddleware,isAdmin,getaUser);
router.delete('/:id',deleteaUser)
router.put('/edit-user',authMiddleware,updateauser);
router.put('/block-user/:id',authMiddleware,isAdmin,blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin,unblockUser);
module.exports=router;
