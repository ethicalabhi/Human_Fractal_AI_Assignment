const userModel   = require('../models/books').users;
const bcrypt      = require('bcrypt');
const jwt         = require('jsonwebtoken');

module.exports.passHashing = (user,cb)=>{
    bcrypt.genSalt(10,(err,salt)=>{
        if(err){
            cb(err,null);
        }
        else{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                  if(err){
                      cb(err,null);
                  }
                  else{
                      user.password = hash;
                      user.save((err,data)=>{
                          if(err){
                              cb(err,null);
                          }
                          else{
                              cb(null,data);
                          }
                      });
                  }
            });
        }
     }); 
}


module.exports.registerUser = (udata)=>{
     return new Promise((resolve,reject)=>{
         try {
            let user  = new userModel();
            user.name  = udata.name,
            user.email = udata.email,
            user.password = udata.password
          userModel.find({"email":udata.email},(err,edata)=>{
               if(err){
                   reject(err);
               }
               else if(!edata.length){
                userModel.findOne({"role":"admin"},{role:1},(err,rdata)=>{
                    if(err){
                        reject(err);
                    }
                    else if(rdata){
                        
                         user.role = "user";
                        this.passHashing(user,(err,sdata)=>{
                           if(err){
                               reject(err);
                           }
                           else{
                               resolve(sdata);
                           }
                        });
                    }
                    else{
                      
                      user.role  = "admin";
                     
                      this.passHashing(user,(err,sdata)=>{
                         if(err){
                             reject(err);
                         }
                         else{
                             resolve(sdata);
                         }
                      });
                    }
                });
               }
               else{
                   reject({message:"user is already registered"});
               }
          });        
         } catch (error) {
           reject(error);   
         }
     });
}

module.exports.checkEmail = (email)=>{
return new Promise((resolve,reject)=>{
 try {
      userModel.find({"email":email,"status":"active"},{password:1,_id:1,role:1},(err,fdata)=>{
          if(err){
              reject(err);
          }
          else if(fdata){
              resolve(fdata);
          }
          else{
              reject({message:'user not found'});
          }
      });
    } catch (error) {
     reject(error);
   }
  });
}

module.exports.matchPassword=(password,udata)=>{
    return new Promise((resolve,reject)=>{
        try {
            console.log(udata);
         bcrypt.compare(password,udata[0].password,(err,match)=>{
             if(err){
                 reject(err);
             }
             else if(match){
                   var token = jwt.sign({
                    id:udata[0]._id,
                  role:udata[0].role,
                 password:udata[0].password 
                  },process.env.jwtSecretKey,{ expiresIn:"7d"});
                  console.log(token)
                resolve(token);  
             }
             else{
                 reject({message:'wrong username password'});
             }
           });               
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.getAllUsers = (page,perpage)=>{
    return new Promise((resolve,reject)=>{
        try {
            userModel.find({},{},(err,dataa)=>{
                if(err){
                   reject(err);
                }
                else if(dataa){
                    userModel.find({},{}).count((err,count)=>{
                        if(err){
                            reject(err);
                        }
                        else{
                            resolve({
                                data:dataa,
                                current:page,
                                pages:Math.floor(count/perpage)
                            })
                        }
                    });
               }
                else{
                   reject({message:"no data found"});
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.editProfile = (userid) =>{
    return new Promise((resolve,reject)=>{
        try {
          userModel.findOne({"_id":userid},(err,dataa)=>{
                if(err){
                    reject(err);
                }
                else if(dataa){
                   resolve(dataa);
                }
                else{
                    reject({message:"no data found"});
                }
          });  
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.updateProfile =(userdata)=>{
    return new Promise((resolve,reject)=>{
         try {
             let user = {
                 name:userdata.name,
                 email:userdata.email
             }
             console.log(userdata);
             userModel.findOneAndUpdate({"_id":userdata.id},{$set:user},{new:true},(err,dataa)=>{
                 if(err){
                     reject(err);
                 }
                 else if(dataa){
                     resolve(dataa);
                 }
                 else{
                     reject({message:'no data found'}); 
                 }
             });
         } catch (error) {
             reject(error);
         }
    });
}


module.exports.updateStatus = (userdata)=>{
    return new Promise((resolve,reject)=>{
        try {
           userModel.findOneAndUpdate({"_id":userdata.id},{$set:{"status":userdata.status}},{new:true},(err,udata)=>{
              if(err){
                  reject(err);
              }
              else if(udata){
                  resolve(udata);
              }
              else{
                  reject({message:"no data found"});
              }
           });
        } catch (error) {
           reject(error); 
        }
    });
}