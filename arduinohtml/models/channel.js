const mongoose = require('mongoose');

const { Schema } = mongoose;
const channelSchema = new Schema({
  channelKey:{
    type: String,
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
  index:{
    type: Array, // 8개 배열
    required: true,
  },
  field1: { 
    type: String,
  },
  field2: { 
    type: String,
  },
  field3: { 
    type: String,
  },
  field4: { 
    type: String,
  },
  field5: { 
    type: String,
  },
  field6: { 
    type: String,
  },
  field7: { 
    type: String,
  },
  field8: { 
    type: String,
  },
});

var model = mongoose.model('ChannelKey', channelSchema);
module.exports = model;