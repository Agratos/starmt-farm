const mongoose = require('mongoose');

const { Schema } = mongoose;
const rtspSchema = new Schema({
  name:{
    type: String,
    required: true,
  },
  url: { 
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  arduinoIp:{
    type: String,
    required: true,
  }//아두이노 ip 넣는곳
});

var model = mongoose.model('Rtsp', rtspSchema);
module.exports = model;