const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
    email: {
      type: String,
      index : true, 
      required: true,
    },
    password:{
      type: String,
      validate : [

        function(password) {
        
        return password.length >= 4;
        
        },
        
        'Password should be longer'
      ]
    },
    key: {
      type: String,
      unique: true,
    },
    channel: {
      type: String
    }
});

module.exports = mongoose.model('User', userSchema);