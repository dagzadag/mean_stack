const express    = require('express');
const bodyParser = require('body-parser');
const path       = require('path');
const cors       = require('cors');
const passport   = require('passport');
const mongoose   = require('mongoose');
const config = require('./config/database');


const users = require('./routes/users');
//initialise express app
const app = express();
//port
const port = process.env.PORT || 3000;


//mongodb connect
mongoose.connect(config.database,{
  useNewUrlParser:true,
  useUnifiedTopology:true
});

mongoose.connection.on('connected',()=>{
  console.log("Connected to DB " + config.database);
})
mongoose.connection.on('error',(err)=>{
  console.log("Error database " + err);
})
//**********************************Middlewares********
app.use(cors());

//Static folder
app.use(express.static(path.join(__dirname,'public')));
//Body parser
app.use(bodyParser.json());
//passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport)

app.use('/users',users)

//*********************************end Middlewares****

app.listen(port,()=>{
  console.log(`listening on port : ${port}`);
})
