const express   = require('express');
const http      = require('http');
const mongoose  = require('mongoose');
const path      = require('path');

require('dotenv').config();

//db connection
mongoose.connect(process.env.mongconn,{useNewUrlParser:true,useCreateIndex:true})
.then(()=>console.log('connected to db'))
.catch((err)=>console.log('connection err',err))

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static(path.resolve(__dirname,'public/')));

//apis
app.use('/api/v1',require('./routes/routes'));

const port  = process.env.PORT || 3000;

http.createServer(app).listen(port,()=>console.log(`server run at port ${port}`));