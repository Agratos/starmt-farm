const mongoose = require('mongoose');
const { schema } = require('./temperature');

const { Schema } = mongoose;
schema.plugin(require('mongoose-beautiful-unique-validation'));

const userSchema = new Schema({
    email: {
      type: String,
      index : true, 
      required: true,
      unique: true,
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
    userkey: {
      type: String,
      unique: true,
    },
    channel: {
      type: String
    }
});

module.exports = mongoose.model('User', userSchema);