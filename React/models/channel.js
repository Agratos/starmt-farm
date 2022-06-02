const mongoose = require('mongoose');

const { Schema } = mongoose;
const channelSchema = new Schema({
  channelKey:{
    type: String,
    required: true,
  }
});

var model = mongoose.model('ChannelKey', channelSchema);
module.exports = model;