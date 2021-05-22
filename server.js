const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const User = require('./user');
const bcrypt = require('bcryptjs');

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

app.post('/api/register', async (req, res) => {
  console.log(req.body);

  const { username, password: plainTextPassword } = req.body;

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    await User.create({
      username,
      password,
    });
    // console.log('User created successfully:', res);
  } catch (error) {
    console.log(error);
    return res.json({ status: 'error' });
  }
//   res.json({ status: 'ok');
 	res.redirect('/login');
});

app.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});
