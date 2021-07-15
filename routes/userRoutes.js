const express   = require('express');
const userDB    = require('../db/userDB');
const auth      = require('../middleware/authentirize').authentication;
const {validationCheck,validationError}  = require('../middleware/validations');

const router    = express.Router();


/**
 * @api {post} /user/register     register user          
 * @apiName  Register          
 * @apiGroup User
 * 
 * @apiParam {String} name             usernames
 * @apiParam {String} email            email
 * @apiParam {String} password         password 
 * 
 * @apiPermission anyone
 * 
 * 
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 {
    "data": {
        "role": "user",
        "status": "active",
        "_id": "60efcff48754dc1e20a4646b",
        "name": "test003",
        "email": "test003@g.com",
        "password": "$2b$10$IfWe9aXzhu1KqQI.WuT75Ovs4mQGKz8iW0/dbxtVAzHKozH4sdIHy",
        "__v": 0
    },
    "msg": "success"
}
 *
 * 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "err.message"
 *     }
 */
router.post('/register',validationCheck.register,validationError,(req,res)=>{
     userDB.registerUser(req.body)
     .then((data)=>{
          res.json({data:data,msg:'success'});
     })
     .catch((err)=>{
          res.json({error:err.message});
     })
});


/**
 * @api {post} /user/login             user login         
 * @apiName  Login          
 * @apiGroup User
 * 
 * @apiParam {String} email            email
 * @apiParam {String} password         password 
 * 
 * @apiPermission anyone
 * 
 * 
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZWZjZmY0ODc1NGRjMWUyMGE0NjQ2YiIsInJvbGUiOiJ1c2VyIiwicGFzc3dvcmQiOiIkMmIkMTAkSWZXZTlhWHpodTFLcVFJLld1VDc1T3ZzNG1RR0t6OGlXMC9kYnh0VkF6SEtvekg0c2RJSHkiLCJpYXQiOjE2MjYzMjk1NDUsImV4cCI6MTYyNjkzNDM0NX0.OHSX7XYn5Qyw7MJfrqhffjnTpIHcOFZwcntGP1ygP2s",
    "msg": "success"
}
 *
 * 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "err.message"
 *     }
 */
router.post('/login',validationCheck.login,validationError,(req,res)=>{

    userDB.checkEmail(req.body.email)
    .then((dataa)=>{
       return userDB.matchPassword(req.body.password,dataa)
    }) 
    .then((token)=>{
        res.json({token:token,msg:'success'});
    })
    .catch((err)=>{
        res.json({error:err.message});
    })
});


/**
 * @api {get} /user/showall?page=1&perpage=5      showall user         
 * @apiName  ShowAll          
 * @apiGroup User
 * 
 * 
 * @apiPermission admin
 * 
 * 
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 {
    "data": {
        "data": [
            {
                "role": "admin",
                "status": "active",
                "_id": "60ef182f8b61ba16482b6e14",
                "name": "test01",
                "email": "test01@t.com",
                "password": "$2b$10$nUDgCd12j9jWJtRXxDwH/.pPqwXQ7oAVEF4UqdVmI5YQ5pumvbovK",
                "__v": 0
            },
            {
                "role": "user",
                "status": "active",
                "_id": "60ef196e8b61ba16482b6e18",
                "name": "test001",
                "email": "test001@g.com",
                "password": "$2b$10$ThwWOIbrW3VndXhdw9M2Curx6G3SyzTD4y46tIQC7VDkhE9AUVUd6",
                "__v": 0
            }
        ],
        "current": 1,
        "pages": 0
    },
    "msg": "success"
}
 *
 * 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "err.message"
 *     }
 */
router.get('/showall',auth("admin"),(req,res)=>{
   var page=1,perpage=5

    if(req.query.page!=null || req.query.page!=undefined){
         page=req.query.page;
    }
   
    if(req.query.perpage!=null || req.query.perpage!=undefined){
        perpage=req.query.perpage;
   }

    userDB.getAllUsers(page,perpage)
    .then((data)=>{
        res.json({data:data,msg:'success'});
    })
    .catch((err)=>{
        res.json({error:err});
    })
});



/**
 * @api {get} /user/editprofile/:id      edit user         
 * @apiName  Edit User         
 * @apiGroup User
 * 
 * @apiPermission user,admin
 * 
 * @apiParam {String} id   userid
 * 
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "data": {
        "role": "user",
        "status": "active",
        "_id": "60efcff48754dc1e20a4646b",
        "name": "test003",
        "email": "test003@g.com",
        "password": "$2b$10$IfWe9aXzhu1KqQI.WuT75Ovs4mQGKz8iW0/dbxtVAzHKozH4sdIHy",
        "__v": 0
    }
}
 *
 * 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "err.message"
 *     }
 */
router.get('/editprofile/:id',auth("user,admin"),(req,res)=>{
    userDB.editProfile(req.params.id)
    .then((data)=>{
        res.json({data:data});
    })
    .catch((err)=>{
        res.json({error:err.message});
    })
});




/**
 * @api {put} /user/updateprofile    update profile       
 * @apiName  Update Profile         
 * @apiGroup User
 * 
 * 
 * @apiPermission  user,admin
 * 
 * @apiParam {String} id      userid
 * @apiParam {String} name    username
 * @apiParam {String} email   email
 * 
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "data": {
        "role": "user",
        "status": "active",
        "_id": "60efcff48754dc1e20a4646b",
        "name": "test003",
        "email": "test003@gm.com",
        "password": "$2b$10$IfWe9aXzhu1KqQI.WuT75Ovs4mQGKz8iW0/dbxtVAzHKozH4sdIHy",
        "__v": 0
    },
    "msg": "success"
}
 *
 * 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "err.message"
 *     }
 */
router.put('/updateprofile',auth("user,admin"),validationCheck.updateProfile,validationError,(req,res)=>{
       userDB.updateProfile(req.body)
       .then((data)=>{
           res.json({data:data,msg:"success"});
       })
       .catch((err)=>{
           res.json({error:err.message});
       })
});


/**
 * @api {put} /user/updatestatus    update status      
 * @apiName  Update Status         
 * @apiGroup User
 * 
 * 
 * @apiPermission admin
 * 
 * @apiParam {String} id       userid
 * @apiParam {String} status   blocked,active
 * 
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "data": {
        "role": "user",
        "status": "blocked",
        "_id": "60efcff48754dc1e20a4646b",
        "name": "test003",
        "email": "test003@gm.com",
        "password": "$2b$10$IfWe9aXzhu1KqQI.WuT75Ovs4mQGKz8iW0/dbxtVAzHKozH4sdIHy",
        "__v": 0
    },
    "msg": "success"
}
 *
 * 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "err.message"
 *     }
 */
router.put('/updatestatus',auth("admin"),validationCheck.updateStatus,validationError,(req,res)=>{
     userDB.updateStatus(req.body)
     .then((data)=>{
         res.json({data:data,msg:'success'});
     })
     .catch((err)=>{
         res.json({error:err.message});
     })
});

module.exports = router;