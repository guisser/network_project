const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const User = require('./user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const JWT_SECRET= 'kjuiurozimqkmqsk@mù$$^$ù^$^mlklkjddqhggjhgqsjhgvbcv'

mongoose.connect('mongodb://localhost:27017/login-app-bd', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
// app.use('/', express.static(path.join(__dirname, 'static')));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'htmlpage.html'));
});

app.get('/login',function (req, res) {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/loginP',function (req, res) {
  res.sendFile(path.join(__dirname, 'loginPage.html'));
});

app.post('/api/loginPage', async(req,res) =>
{

  const {username, password } = req.body
  const user = await User.findOne({username}).lean()

  if(!user)
  {
    return res.json({status : 'error', error:'Invalid user/username/password'})
  }

  if(await bcrypt.compare(password, user.password)){


       const token = jwt.sign(
        {id: user._id,
        username: user.username

      }, JWT_SECRET
      )

        return res.json({status : 'ok', date : token})


  }

  res.json({status : 'error', error:'Invalid user/username/password'})

});

app.post('/api/register', async (req, res) => {
  const { username, password: plainTextPassword } = req.body;


if(!username || typeof username !== 'string'){
    return res.json({ status : 'error' , error : 'invalid username'})
  }

  if(!plainTextPassword || typeof plainTextPassword !== 'string'){
    return res.json({status : 'error' , error : 'invalid password'})
  }
  if(plainTextPassword.length < 10)
  {
    return res.json({
      status: 'error',
      error : 'password too small should be atleast 10 characters'
    })
  }
  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      username,
      password,
    });
    // console.log('User created successfully:', res);
  }
   catch (error) {
    if(error.code === 11000)
      {
        return res.json({status: 'error',error:'Username already exist'})

      }
      throw error
  }
  // res.json({ status: 'ok');
 	res.redirect('/login');
});

app.listen(9999, () => {
  console.log('Server started at http://localhost:9999');
});
