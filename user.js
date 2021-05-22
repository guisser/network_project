const mongoose = require('mongoose')

const UserShema = new mongoose.Schema({
	username:{type: String, required: true, unique: true},
    password:{type: String, required: true},
},
{collections: 'users'}
)

const model = mongoose.model('UserShema', UserShema)

module.exports = model