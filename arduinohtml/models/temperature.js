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
    type: Number,
  },
  field2: {
    type: Number,
  },
  field3: {
    type: Number,
  },
  field4: {
    type: Number,
  },
  field5: {
    type: Number,
  },
  field6: {
    type: Number,
  },
  field7: {
    type: Number,
  },
  field8: {
    type: Number,
  },
  createdAt: {
    type: String,
    require: true,
    //default: new Date(),
    //default: getCurrentDate(),
  },
});

// function getCurrentDate(){
//   const moment = require('moment');
//   require('moment-timezone');
//   moment.tz.setDefault("Asia/Seoul");
//   var date = moment().format('YYYY-MM-DDTHH:mm:ss');
//   console.log("date", date);
//   return date;
// }


var model = mongoose.model('Temperature', tempSchema);
module.exports = model;