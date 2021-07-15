const bookDB   = require('../db/bookDB');
const auth     = require('../middleware/authentirize').authentication;
const{validationCheck,validationError} = require("../middleware/validations");

const express   =  require('express');
const router    = express.Router();

//----------- BOOKS PART -------------//

/**
 * @api {get} /book/showall?page=1&perpage=5    showall books      
 * @apiName  Show All         
 * @apiGroup Books
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
                "_id": "60ef1b538b61ba16482b6e25",
                "isbn": "1234567890122",
                "title": "demo book2",
                "author": "demo 1",
                "category": "abc",
                "gener": "xyz",
                "rackNo": null,
                "status": "issued",
                "__v": 0
            },
            {
                "_id": "60ef27548b61ba16482b6e41",
                "isbn": "1234567890111",
                "title": "demo book3",
                "author": "demo ",
                "category": "abc",
                "gener": "xyz",
                "rackNo": "1b",
                "status": "available",
                "__v": 0
            }
        ],
        "current": "1",
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
  
    if(req.query.page!=undefined || req.query.page!=null){
       page = req.query.page;  
    }
    if(req.query.perpage!=undefined || req.query.perpage!=null){
       perpage = req.query.perpage;  
    }
    bookDB.getAllBooks(page,perpage)
    .then((data)=>{
       res.json({data:data,msg:'success'});
    })
    .catch((err)=>{
       res.json({error:err.message});
    })
});


/**
 * @api {post} /book/add   add book      
 * @apiName  Add Book         
 * @apiGroup Books
 * 
 * 
 * @apiPermission admin
 * 
 * @apiparam {String} isbn      book isbn
 * @apiparam {String} title     book name
 * @apiparam {String} author    book author
 * @apiparam {String} category  book category
 * @apiparam {String} gener     book gener
 * @apiparam {String} rackno    book rackno
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "data": {
        "_id": "60efd7d21ceac128885117bc",
        "isbn": "1234567890001",
        "title": "demo book4",
        "author": "demo ",
        "category": "abc",
        "gener": "xyz",
        "rackNo": "1b",
        "status": "available",
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
router.post('/add',auth("admin"),validationCheck.addBook,validationError,(req,res)=>{
  bookDB.addBook(req.body)
  .then((data)=>{
       res.json({data:data,msg:'success'});
  })
  .catch((err)=>{
      res.json({error:err.message});
  })
});


/**
 * @api {get} /book/search?bname=title,page=1&perpage=5  search book      
 * @apiName  Search Book         
 * @apiGroup Books
 * 
 * 
 * @apiPermission user,admin
 * 
 * @apiparam {String} bname  book title
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "data": {
        "data": [
            {
                "_id": "60efd7d21ceac128885117bc",
                "isbn": "1234567890001",
                "title": "demo book4",
                "author": "demo ",
                "category": "abc",
                "gener": "xyz",
                "rackNo": "1b",
                "status": "available",
                "__v": 0
            }
        ],
        "current": 1,
        "pages": 1
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
router.get('/search',auth("user,admin"),(req,res)=>{
    var page=1,perpage=5,bname=''
  
    if(req.query.page!=undefined || req.query.page!=null){
       page = req.query.page;  
    }
    if(req.query.perpage!=undefined || req.query.perpage!=null){
       perpage = req.query.perpage;  
    }
    if(req.query.bname!=undefined || req.query.bname!=null){
      bname = req.query.bname;  
   }
   console.log(bname);
      bookDB.searchBook(page,perpage,bname)
      .then((data)=>{
            res.json({data:data,msg:'success'});
      })
      .catch((err)=>{
           res.json({error:err.message});
      })
   
  });
  

/**
 * @api {get} /book/:id      edit book
 * @apiName  Edit Book         
 * @apiGroup Books
 * 
 * 
 * @apiPermission admin
 * 
 * @apiparam {String} id  book id
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "data": {
        "_id": "60efd7d21ceac128885117bc",
        "isbn": "1234567890001",
        "title": "demo book4",
        "author": "demo ",
        "category": "abc",
        "gener": "xyz",
        "rackNo": "1b",
        "status": "available",
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
router.get('/:id',auth("admin"),(req,res)=>{
     bookDB.editBook(req.params.id)
     .then((data)=>{
         res.json({data:data,msg:"success"});
     })
     .catch((err)=>{
          res.json({error:err.message});
     })
});



/**
 * @api {put} /book/update      update book
 * @apiName  Update Book         
 * @apiGroup Books
 * 
 * 
 * @apiPermission admin
 * 
 * @apiparam {String} id        book id
 * @apiparam {String} isbn      book isbn
 * @apiparam {String} title     book name
 * @apiparam {String} author    book author
 * @apiparam {String} category  book category
 * @apiparam {String} gener     book gener
 * @apiparam {String} rackno    book rackno
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "data": {
        "_id": "60efd7d21ceac128885117bc",
        "isbn": "1234567890001",
        "title": "demo book",
        "author": "demo ",
        "category": "abc",
        "gener": "xyz",
        "rackNo": "1b",
        "status": "available",
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
router.put('/update',auth("admin"),validationCheck.updateBook,validationError,(req,res)=>{
  bookDB.updateBook(req.body)
  .then((data)=>{
      res.json({data:data,msg:'success'});
  })
  .catch((err)=>{
      res.json({error:err.message});
  })
});



/**
 * @api {delete} /book/remove/:id      delete book
 * @apiName  Delete Book         
 * @apiGroup Books
 * 
 * 
 * @apiPermission admin
 * 
 * @apiparam {String} id  book id
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "data": {
        "_id": "60efd7d21ceac128885117bc",
        "isbn": "1234567890001",
        "title": "demo book",
        "author": "demo ",
        "category": "abc",
        "gener": "xyz",
        "rackNo": "1b",
        "status": "available",
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
router.delete('/remove/:id',auth("admin"),(req,res)=>{
  bookDB.removeBook(req.params.id)
  .then((data)=>{
      res.json({data:data});
  })
  .catch((err)=>{
      res.json({error:err});
  })
});

//----------- XXXXXXX -------------//


//------- BOOKS ISSUE PART ------//



/**
 * @api {get} /book/issued/showall?page=1&perpage=5      showall issued books
 * @apiName  ShowAll Issued Books         
 * @apiGroup Books
 * 
 * 
 * @apiPermission admin
 * 
 * @apiparam {String} id  book id
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "data": {
        "data": [
            {
                "issueDate": "2021-07-14T16:57:35.581Z",
                "_id": "60ef28188b61ba16482b6e43",
                "bookid": "60ef1b538b61ba16482b6e25",
                "userid": "60ef196e8b61ba16482b6e18",
                "dueDate": "2021-07-28T18:08:24.331Z",
                "__v": 0,
                "returnDate": "2021-07-14T18:13:06.813Z"
            },
            {
                "issueDate": "2021-07-14T16:57:35.581Z",
                "_id": "60ef29648b61ba16482b6e52",
                "bookid": "60ef1b538b61ba16482b6e25",
                "userid": "60ef196e8b61ba16482b6e18",
                "dueDate": "2021-07-28T18:13:56.866Z",
                "__v": 0,
                "returnDate": "2021-07-14T18:25:18.179Z"
            },
            {
                "issueDate": "2021-07-14T18:25:17.393Z",
                "_id": "60ef2c8dc4d5960a78adb0a2",
                "bookid": "60ef1b538b61ba16482b6e25",
                "userid": "60ef196e8b61ba16482b6e18",
                "dueDate": "2021-07-28T18:27:25.456Z",
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
router.get('/issued/showall',auth("admin"),(req,res)=>{
  var page=1,perpage=5
  if(req.query.page!=null || req.query.page!=undefined){
       page = req.query.page;
  }
  if(req.query.perpage!=null || req.query.perpage!=undefined){
      perpage = req.query.perpage;
  }
  bookDB.getAllIssuedBk(page,perpage)
  .then((data)=>{
     res.json({data:data,msg:'success'});
  })
  .catch((err)=>{
     res.json({error:err.message});
  });
});



/**
 * @api {get} /book/issued/user/:id      show books issued to user
 * @apiName  ShowUser Books         
 * @apiGroup Books
 * 
 * 
 * @apiPermission user,admin
 * 
 * @apiparam {String} id  user id
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "data": {
        "data": [
            {
                "issueDate": "2021-07-14T16:57:35.581Z",
                "_id": "60ef28188b61ba16482b6e43",
                "bookid": "60ef1b538b61ba16482b6e25",
                "userid": "60ef196e8b61ba16482b6e18",
                "dueDate": "2021-07-28T18:08:24.331Z",
                "__v": 0,
                "returnDate": "2021-07-14T18:13:06.813Z"
            },
            {
                "issueDate": "2021-07-14T16:57:35.581Z",
                "_id": "60ef29648b61ba16482b6e52",
                "bookid": "60ef1b538b61ba16482b6e25",
                "userid": "60ef196e8b61ba16482b6e18",
                "dueDate": "2021-07-28T18:13:56.866Z",
                "__v": 0,
                "returnDate": "2021-07-14T18:25:18.179Z"
            },
            {
                "issueDate": "2021-07-14T18:25:17.393Z",
                "_id": "60ef2c8dc4d5960a78adb0a2",
                "bookid": "60ef1b538b61ba16482b6e25",
                "userid": "60ef196e8b61ba16482b6e18",
                "dueDate": "2021-07-28T18:27:25.456Z",
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
router.get('/issued/user/:id',auth("user,admin"),(req,res)=>{
 var page=1,perpage=5
 if(req.query.page!=null || req.query.page!=undefined){
      page = req.query.page;
 }
 if(req.query.perpage!=null || req.query.perpage!=undefined){
     perpage = req.query.perpage;
 }
   bookDB.getUserIssueBk(page,perpage,req.params.id)
   .then((data)=>{
       res.json({data:data,msg:'success'});
   })
   .catch((err)=>{
      res.json({error:err.message});
   })
});


/**
 * @api {add} /book/issue     issue book
 * @apiName  Issue Book         
 * @apiGroup Books
 * 
 * 
 * @apiPermission admin
 * 
 * @apiparam {String} bookid  book id
 * @apiparam {String} userid  user id
 * 
 *  
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "data": {
        "_id": "60efd7d21ceac128885117bc",
        "isbn": "1234567890001",
        "title": "demo book4",
        "author": "demo ",
        "category": "abc",
        "gener": "xyz",
        "rackNo": "1b",
        "status": "issued",
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
router.post('/issue',auth("admin"),validationCheck.issueBook,validationError,(req,res)=>{
   bookDB.issueBook(req.body)
   .then((data)=>{
     res.json({data:data,msg:'success'});
   })    
   .catch((err)=>{
       res.json({error:err.message});
   })
});


/**
 * @api {put} /book/return      return book
 * @apiName  Return Book         
 * @apiGroup Books
 * 
 * 
 * @apiPermission admin
 * 
 * @apiparam {String} issueid  bookissued id (_id)
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "data": {
        "message": "book is returned"
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
router.put('/return',auth("admin"),validationCheck.returnBook,validationError,(req,res)=>{
   bookDB.returnBook(req.body.issueid)
   .then((data)=>{
           res.json({data:data,msg:'success'});
   })
   .catch((err)=>{
         res.json({error:err.message});
   })
});

//--------- XXXXXXXXXX --------//


//-------- BOOKS RESERVATION-----//


/**
 * @api {get} /book/reserved/showall?page=1&perpage=5      showall reserved books
 * @apiName  Show Reserved Books         
 * @apiGroup Books
 * 
 * 
 * @apiPermission admin
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "data": {
        "data": [
            {
                "reservedDate": "2021-07-15T07:12:32.207Z",
                "_id": "60efe0193d58b303e4d6f4f0",
                "bookid": "60efd7d21ceac128885117bc",
                "userid": "60ef196e8b61ba16482b6e18",
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
router.get('/reserved/showall',auth("admin"),(req,res)=>{
  var perpage=5,page=1

if(req.query.page!=null || req.query.page!=undefined){
      page = req.query.page;
}

if(req.query.perpage!=null || req.query.perpage!=undefined){
     perpage = req.query.perpage;
}
 
  bookDB.getAllReservedBook(page,perpage)
  .then((data)=>{
     res.json({data:data,msg:'success'});
    })
  .catch((err)=>{
     res.json({error:err.message});
   })  
});



/**
 * @api {get} /book/reserved/user/:id      show reserved books by user
 * @apiName  ShowUser Reserved Books         
 * @apiGroup Books
 * 
 * 
 * @apiPermission user,admin
 * 
 * @apiparam {String} id  userid
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "data": {
        "data": [
            {
                "reservedDate": "2021-07-15T07:12:32.207Z",
                "_id": "60efe0193d58b303e4d6f4f0",
                "bookid": "60efd7d21ceac128885117bc",
                "userid": "60ef196e8b61ba16482b6e18",
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
router.get('/reserved/user/:id',auth("user,admin"),(req,res)=>{
  var perpage=5,page=1

if(req.query.page!=null || req.query.page!=undefined){
      page = req.query.page;
}

if(req.query.perpage!=null || req.query.perpage!=undefined){
     perpage = req.query.perpage;
}

    bookDB.getUserReservBooks(page,perpage,req.params.id)
    .then((data)=>{
         res.json({data:data,msg:'success'});
    })
    .catch((err)=>{
         res.json({error:err.message});
    })
  });


  
/**
 * @api {add} /book/reserved      reserve book
 * @apiName  Reserve Book         
 * @apiGroup Books
 * 
 * 
 * @apiPermission user,admin
 * 
 * @apiparam {String} bookid  book id
 * @apiparam {String} userid  user id
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "data": {
        "reservedDate": "2021-07-15T07:12:32.207Z",
        "_id": "60efe0193d58b303e4d6f4f0",
        "bookid": "60efd7d21ceac128885117bc",
        "userid": "60ef196e8b61ba16482b6e18",
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
router.post('/reserve',auth("user,admin"),validationCheck.reserveBook,validationError,(req,res)=>{
   bookDB.reserveBook(req.body)
   .then((data)=>{
       res.json({data:data,msg:'success'});
   })
   .catch((err)=>{
      res.json({error:err.message});
   })
});



/**
 * @api {get} /book/remove/:id      cancelbook reservation
 * @apiName  CancelBook Reservation        
 * @apiGroup Books
 * 
 * 
 * @apiPermission user,admin
 * 
 * @apiparam {String} id  book_reservation id
 * 
 * @apiSampleRequest off
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
   json data,
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
router.delete('/reserve/:id',auth("user,admin"),(req,res)=>{
     bookDB.reservationRemove(req.params.id)
     .then((data)=>{
        res.json({data:data,msg:'success'});
     })
     .catch((err)=>{
       res.json({error:err.message});
     })
});

//--------- XXXXXXXXX ---------//



module.exports = router;