const jwt   = require('jsonwebtoken');

module.exports.authentication=(roles=[])=>{
 return(req,res,next)=>{
        if(req.header('authorization')){
        jwt.verify(req.header('authorization'),process.env.jwtSecretKey,(err,decoded)=>{
            if(err){
                res.json({error:err.message});
            }
            else{   
                if(roles.includes(decoded.role)){
                    next();
                }
                else{
                  res.json({message:"you dont have permission"});
                }
              }
            });
        }
        else {
            res.sendStatus(401);
        }
    }
 }
