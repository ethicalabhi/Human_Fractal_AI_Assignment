const mongoose = require('mongoose');
const mongId   = mongoose.Schema.Types.ObjectId;

const bookSchema = new mongoose.Schema({
     isbn:{
         type:String,
         required:true,
         unique:true,
         minLength:[13,"isbn number should be 13 digit"],
         maxLength:[13,"isbn number should be 13 digit"]
     },
     title:{
         type:String,
         required:true,
         unique:true
     },
     author:{
         type:String,
         required:true
     },
     category:{
         type:String,
         required:true
     },
     gener:{
         type:String,
         required:true
     },
     rackNo:{
         type:String,
         required:true
     },
     status:{
         type:String
     }
});

const issuedSchema = new mongoose.Schema({
       bookid:{
           type: mongId,
           reference:'books',
           required:true
       },
      userid:{
          type:mongId,
          reference:'users',
          required:true
      },
      issueDate:{
          type:Date,
          default:Date.now()
      },
      dueDate:{
          type:Date,
          required:true
      },
      returnDate:{
          type:Date
      }
});

const bookReservationSchema = new mongoose.Schema({
        bookid:{
            type:mongId,
            reference:"books",
            required:true
        },
        userid:{
            type:mongId,
            reference:"users",
            required:true
        },
        reservedDate:{
            type:Date,
            default:Date.now()
        }
});

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"    //user,admin
    },
    status:{
        type:String,
        default:'active'    //active,blocked
    }
});

var book = mongoose.model('books',bookSchema);
var bookIssued = mongoose.model('bookissueds',issuedSchema);
var bookReservation = mongoose.model('bookreservations',bookReservationSchema); 
var users = mongoose.model('users',userSchema);      

module.exports={
    book,
    bookIssued,
    bookReservation,
    users
}