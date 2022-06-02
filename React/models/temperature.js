const mongoose = require('mongoose');

const { Schema } = mongoose;
const tempSchema = new Schema({
  key:{
    type: String,
    required: true,
  },
  channel:{
    type: String,
    required: true,
  },
  field1: { // 배열로 추가할것! ex  [[name],[26]]
    type: Array,
    required: true,
  },
  field2: {
    type: Array,
  },
  field3: {
    type: Array,
  },
  field4: {
    type: Array,
  },
  field5: {
    type: Array,
  },
  field6: {
    type: Array,
  },
  field7: {
    type: Array,
  },
  field8: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

var model = mongoose.model('Temperature', tempSchema);
module.exports = model;