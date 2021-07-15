const {check,validationResult}  = require("express-validator");


module.exports.validationCheck = {
    register:[
        check("name").exists().withMessage("name cant be empty"),
        check("email").exists().withMessage("email cant be empty"),
        check("password").exists().withMessage("password cant be empty"),
        check("password").isLength(8).withMessage("password lenght be 8 character long")
    ],
    login:[
        check("email").exists().withMessage("email cant be empty"),
        check("password").exists().withMessage("password cant be empty")
    ],
    updateProfile:[
        check("id").exists().withMessage("id cant be empty"),
        check("name").exists().withMessage("name cant be empty"),
        check("email").exists().withMessage("email cant be empty")
    ],
    updateStatus:[
        check("id").exists().withMessage("id cant be empty"),
        check("status").exists().withMessage("status cant be empty")
    ],
    addBook:[
        check("isbn").exists().withMessage("isbn cant be empty"),
        check("title").exists().withMessage("title cant be empty"),
        check("author").exists().withMessage("author cant be empty"),
        check("category").exists().withMessage("category cant be empty"),
        check("gener").exists().withMessage("gener cant be empty"),
        check("rackno").exists().withMessage("rackno cant be empty")
    ],
    updateBook:[
        check("id").exists().withMessage("id cant be empty"),
        check("isbn").exists().withMessage("isbn cant be empty"),
        check("title").exists().withMessage("title cant be empty"),
        check("author").exists().withMessage("author cant be empty"),
        check("category").exists().withMessage("category cant be empty"),
        check("gener").exists().withMessage("gener cant be empty"),
        check("rackno").exists().withMessage("rackno cant be empty")
    ],
    issueBook:[
        check("bookid").exists().withMessage("bookid cant be empty"),
        check("userid").exists().withMessage("userid cant be empty")
    ],
    returnBook:[
        check("issueid").exists().withMessage("issued cant be empty")
    ],
    reserveBook:[
        check("bookid").exists().withMessage("bookid cant be empty"),
        check("userid").exists().withMessage("userid cant be empty")
    ]

}

module.exports.validationError=(req,res,next)=>{
       var errors = validationResult(req);
       if(!errors.isEmpty()){
           res.json({error:errors.array()});
       }
       else{
           next();
       }
}