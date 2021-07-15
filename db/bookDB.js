const bookModel        = require('../models/books').book;
const bookIssueModel   = require('../models/books').bookIssued;
const bookReserveModel = require('../models/books').bookReservation;


module.exports.getAllBooks =(page,perpage)=>{
   return new Promise((resolve,reject)=>{
        try { 
            var query   = {};
            query.skip  = (perpage*page)-perpage;
            query.limit =  parseInt(perpage);

        bookModel.find({},{},query,(err,dataa)=>{
                 if(err){
                     reject(err);
                 }
                 else if(dataa.length){
                    bookModel.find({},{}).count((err,count)=>{
                        if(err){
                            reject(err);
                        }
                        else{
                            resolve({
                                data:dataa,
                             current:page,
                               pages:Math.floor(count/perpage)
                            });
                        }
                    });
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


module.exports.addBook = (bdata)=>{
    return new Promise((resolve,reject)=>{
       try {
           let books = new bookModel({
              isbn  : bdata.isbn,
             title  : bdata.title,
             author : bdata.author,
           category : bdata.category,
             gener  : bdata.gener,
             rackNo : bdata.rackno,
             status : "available"
           });
        books.save((err,sdata)=>{
             if(err){
                 reject(err);
             }
             else{
                 resolve(sdata);
             }
        }); 
       } catch (error) {
           reject(error);
       }
    });
}

module.exports.editBook = (bid)=>{
    return new Promise((resolve,reject)=>{
            try {
             bookModel.findOne({"_id":bid},(err,bdata)=>{
                if(err){
                    reject(err);
                }
                else{
                    resolve(bdata);
                }
             });               
            } catch (error) {
                reject(error);
            }
    });
}

module.exports.updateBook = (bdata)=>{
    return new Promise((resolve,reject)=>{
         try {
             let book = {
                isbn   : bdata.isbn,
                title  : bdata.title,
                author : bdata.author,
              category : bdata.category,
                gener  : bdata.gener,
                rackNo : bdata.rackno,
                status : "available"
             }
            bookModel.updateOne({"_id":bdata.id},{$set:book},(err,udata)=>{
                if(err){
                    reject(err);
                }
                else{
                    resolve(udata);
                }
            });
         } catch (error) {
             reject(error);
         }
    });
}

module.exports.searchBook = (page,perpage,bname)=>{
    return new Promise((resolve,reject)=>{
       try {
           var query   = {};
           query.skip  = (perpage*page)-perpage;
           query.limit =  parseInt(perpage);

           bookModel.find({"title":bname},{},(err,sdata)=>{
                if(err){
                    console.log(err);
                    reject(err);
                }
                else if(sdata.length){
                    console.log(sdata)
                    bookModel.find({"title":bname}).count((err,count)=>{
                             if(err){
                                 reject(err);
                             }
                             else{
                                resolve({
                                    data:sdata,
                                    current:page,
                                    pages:Math.ceil(count/perpage)
                                });
                             }
                    });
                }
                else{
                     reject({message:'not data found'})
                }
           });
       } catch (error) {
           reject(error);
       }
    });
}

module.exports.removeBook = (bid)=>{
    return new Promise((resolve,reject)=>{
           try {
             bookModel.findOne({"_id":bid,"status":"available"},(err,bdata)=>{
                 if(err){
                     reject(err);
                 }
                 else if(bdata){
                      bookModel.deleteOne({"_id":bid},(err,deldata)=>{
                          if(err){
                              reject(err);
                          }
                          else{
                              resolve(deldata);
                          }
                      });
                 }
                 else{
                     reject({message:'book is issued.you cant delete it'})
                 }
             });   
           } catch (error) {
               reject(error);
           }
    });
}


//------------- books ends ----------------//

//------------- book issue start -----------------//




module.exports.issueBook = (rdata)=>{
    return new Promise((resolve,reject)=>{
       try {
        var duedate = new Date(Date.now() + 12096e5); //cal 14 days from now
           let bookIssue = new bookIssueModel();
           if(rdata.bookid!=null||rdata.bookid!=undefined){
           bookModel.findOne({"_id":rdata.bookid,"status":"available"},(err,bdata)=>{
               if(err){
                   reject(err);
               }
             else if(bdata){
                bookReserveModel.findOne({"bookid":rdata.bookid},(err,resvdata)=>{
                    if(err){
                        reject(err);
                    }
                    else if(resvdata){  //issued from reservation
                        reject({message:'book already reserved cant be issued'});
                    }
                    else{  //non reservation book issue
             
                    //check if the user have issued upto only 5 books
                        this.countbyBooksIssued(rdata.userid)
                        .then((count)=>{
                            if(count<=5)
                            {
                                bookIssue.bookid  = rdata.bookid;
                                bookIssue.userid  = rdata.userid;
                                bookIssue.dueDate = duedate;
        
                            this.bkIssued(bookIssue,(err,dataa)=>{  //saving to issued schema
                                    if(err){
                                        reject(err);
                                    }
                                    else{
                                        resolve(dataa);
                                    }
                                });
                            }
                            else{  //if user pass 5 books this msg be shown
                                reject({message:"your 5 book issuing limit is complete"});
                            }
                        })
                        .catch((err)=>{
                            reject(err);
                        })
                    }
                });
                      
               }
               else{
                 reject({message:'book already issued'});
               }
           });
        }
        else{
            reject({message:'provide the correct data'})
        }
       } catch (error) {
           reject(error);
       }
    });
}

module.exports.returnBook = (bkIssueID)=>{
     return new Promise((resolve,reject)=>{
         try { 
             console.log(bkIssueID)
            var duedate = new Date(Date.now() + 12096e5); //cal 14 days from now
            let bookIssue = new bookIssueModel();
            bookIssueModel.findOne({"_id":bkIssueID,"returnDate":{$exists:true}},(err,fdataa)=>{
                 if(err){
                     reject(err);
                 }
                 else if(fdataa){
                     reject({message:'book already returned'});
                 }
                 else{
                    bookIssueModel.findOneAndUpdate({"_id":bkIssueID},
                    {$set:{"returnDate":Date.now()}},{new:true},(err,udata)=>{
                      if(err){
                          reject(err);
                      }
                      else if(udata){
                         bookModel.findOneAndUpdate({'_id':udata.bookid},
                         {$set:{"status":"available"}},{new:true},(err,udataa)=>{
                             if(err){
                                 reject(err);
                             }
                             else if(udataa){
                                 bookReserveModel.findOne({"bookid":udataa.bookid},(err,fdata)=>{
                                        if(err){
                                            reject(err);
                                        }
                                        else if(fdata){
                                            bookIssue.bookid  = fdata.bookid;
                                            bookIssue.userid  = fdata.userid;
                                            bookIssue.dueDate = duedate;
                                              this.bkIssued(bookIssue,(err,idata)=>{
                                                 if(err){
                                                     reject(err);
                                                 }
                                                 else if(idata){
                                                       this.reservationRemove(fdata._id)
                                                       .then((dataa)=>{
                                                          resolve(idata);
                                                       })
                                                       .catch((err)=>{
                                                           reject(err);
                                                       })
                                                 }
                                                 else{
                                                     reject({message:'book not issued to the reserved person'});
                                                 }
                                              });
                                        }
                                        else{
                                            resolve({message:'book is returned'});
                                        }
                                 });
                             }
                         });
                      }
                      else{
                          console.log(udata)
                          reject({message:'data not saved'});
                      }
                    });       
                 }
            });
         } catch (error) {
             reject(error);
         }
     });
}

module.exports.getAllIssuedBk =(page,perpage)=>{
 return new Promise((resolve,reject)=>{
           try {
            var query   = {};
            query.skip  = (perpage*page)-perpage;
            query.limit = parseInt(perpage);

        bookIssueModel.find({},{},query,(err,dataa)=>{
                if(err){
                    reject(err);
                }
                else if(dataa.length){
                  bookIssueModel.find().count((err,count)=>{
                       if(err){
                           reject(err);
                       }
                       else{
                           resolve({
                               data: dataa,
                            current: page,
                              pages: Math.floor(count/perpage) 
                           });
                       }
                  });
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


module.exports.getUserIssueBk=(page,perpage,userid)=>{
        return new Promise((resolve,reject)=>{
             try {
                 var query={};
                 query.skip  = (page*perpage)-perpage;
                 query.limit = parseInt(perpage);
           bookIssueModel.find({"userid":userid},{},
           query,(err,fdata)=>{
                     if(err){
                         reject(err);
                     }
                     else if(fdata){
                    bookReserveModel.find({"userid":userid,"returnDate":{$eq:null}})
                    .count((err,count)=>{
                         if(err){
                             reject(err);
                         }
                         else{
                            resolve({
                               data : fdata,
                            current : page,
                              pages : Math.floor(count/perpage)
                            });      
                          }
                       });
                     }
                     else{
                        reject({message:''});
                     }
                });
             } catch (error) {
                 reject(error);
             }
        });
}

//------------- issue end -----------------//


//---------- book reservation start -----------//


module.exports.getAllReservedBook=(page,perpage)=>{
    return new Promise((resolve,reject)=>{
          try {

              var query   = {};
              query.skip  = (perpage*page)-perpage;
              query.limit = parseInt(perpage);

             bookReserveModel.find({},{},query,(err,dataa)=>{
                   if(err){
                       reject(err);
                   }
                   else if(dataa.length){
                  bookReserveModel.find().count((err,count)=>{
                        if(err){
                            reject(err);
                        }
                        else{
                            resolve({
                                data:dataa,
                             current:page,
                               pages: Math.floor(count/perpage)
                            });
                        }
                    });
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

module.exports.getUserReservBooks=(page,perpage,userid)=>{
    return new Promise((resolve,reject)=>{
        try {
            var query={};
            query.skip  = (perpage*page)-perpage;
            query.limit = parseInt(perpage);

          bookReserveModel.find({"userid":userid},{},query,(err,dataa)=>{
             if(err){
                 reject(err);
             }
             else if(!dataa.length){
              reject({message:'no data found.'});
             }
             else{
                 bookReserveModel.find({"userid":userid}).count((err,count)=>{
                      if(err){
                          reject(err);
                      }
                      else{
                          resolve({
                              data:dataa,
                              current:page,
                              pages:Math.floor(count/perpage)
                          });
                      }
                 });
             }
          }); 
        } catch (error) {
            reject(error);
        }
    });
}


module.exports.reserveBook = (dataa)=>{
    return new Promise((resolve,reject)=>{
       try {
          let resBook = new bookReserveModel({
               bookid : dataa.bookid,
               userid : dataa.userid
          });
         bookReserveModel.findOne({"bookid":dataa.bookid,"userid":dataa.userid},(err,dataa)=>{
                 if(err){
                     reject(err);
                 }
                 else if(dataa){
                     reject({message:'book  already reserved by you'});
                 }
                 else{
                    resBook.save((err,rdata)=>{
                        if(err){
                            reject(err);
                        }
                        else{
                            resolve(rdata);
                        }
                  });
                 }
         });
       } catch (error) {
         resolve(error);  
       }
    });
}



module.exports.reservationRemove=(rid)=>{
    return new Promise((resolve,reject)=>{
        try {
            bookReserveModel.findOneAndDelete({"_id":rid},(err,dataa)=>{
                if(err){
                    reject(err);
                }
                else if(dataa){
                  resolve(dataa);
                }
                else{
                    reject({message:"data not found"});
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

//---------- book reservation ends -----------//






module.exports.bkIssued=(bkIssued,cb)=>{
    try {
        bkIssued.save((err,idata)=>{
            if(err){
                cb(err,null);
            }
            else{
              bookModel.findOneAndUpdate({"_id":bkIssued.bookid},
              {$set:{"status":"issued"}},{new:true},(err,udata)=>{
                if(err){
                    cb(err,null);
                }
                else{     
                    cb(null,udata);
                }
              });
            }
         });    
    } catch (error) {
        cb(error,null);
    }
}

//will count the user book and keep it to 5
module.exports.countbyBooksIssued = (userid)=>{
    return new Promise((resolve,reject)=>{
         try {
              bookIssueModel.find({"userid":userid,"returnedDate":{$eq:null}}).count((err,count)=>{
                 if(err){
                     reject(err);
                 }
                 else{
                     resolve(count);
                 }
              });
         } catch (error) {
             reject(error);s
         }
    });
}         