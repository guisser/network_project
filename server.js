
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const User = require('./modele/user')
const bcrypt = require('bcryptjs')


mongoose.connect('mongodb://localhost:27017/login-app-bd' , {
	useNewUrlParser:true,
	useUnifiedTopology:true,
	useCreateIndex: true
})
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('http://localhost:9999/api/register', async (req, res) =>
{
	console.log(req.body)

	const {username, password: plainTextPassword }= req.body

	const password = await bcrypt.hash(plainTextPassword, 10)

     try{
          await User.create({
          	username,
          	password
          })
          console.log('User created successfully:',response)
     }
     catch (error){
       console.log(error)
       return res.json({status: 'error'})
     }
	res.json({status: 'ok'})
})

app.listen(9999, () => {
	console.log('Server up at 9999')
})
