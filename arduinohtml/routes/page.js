const express = require('express');
const Temperature = require('../models/temperature');
const User = require('../models/user');
const ChannelKey = require('../models/channel');
const Rtsp = require('../models/rtsp');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const alert = require('alert-node');
const bcrypt = require('bcrypt-nodejs');
const { RequestHeaderFieldsTooLarge } = require('http-errors');

const moment = require('moment');//시간 설정
const { toNamespacedPath } = require('path');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('layout');
});//대문

router.get('/login', isNotLoggedIn, (req, res) => {
  console.log('로그인:');
  res.render('login/login');
});//로그인


router.get('/join', (req, res, next) => {
  res.render('join');
});//수정중

router.get('/arduino', function (req, res, next) {
  User.findOne({ email: req.session.email }, (err, user) => {
    function split(str){
      return str.split(", ")
    }
    console.log("user : ", user);
    let channel_btn = [];
    let channel_cnt = split(user.channel);
    //console.log("user channel : ", channel_cnt[0]);
    for(let i = 0 ; i < channel_cnt.length-1 ; i++)
    {
      ChannelKey.find({channelKey: channel_cnt[i]}, async(err, channel) => {
        //let trans = chn.name;
        //console.log("channel name : ", channel[0].name);
        channel_btn.push([channel[0].name, channel_cnt[i]]);
        console.log("channel name1 : ", {channel_btn, user});
      })
    }
    // channel 데이터가 없을 때 수정
    User.findOne({email: req.session.email}, (err,user) => {
      let channel = null;
      res.render('Main/main', { channel_btn, channel, user});  
    })
    //console.log("channel_btn : ",channel_btn[0][1]);
    // ChannelKey.findOne({channelKey: '525594'}, (err, channel) => {
    //   // console.log("channel field name : ", channel);
    //   // console.log("channel field name : ", channel.index.length);
    //   // console.log("channel field name : ", channel.index[1]);
    //   Temperature.find({"channel": channel.channelKey }, (err, temperature) => {
    //     // console.log("temperature : ", temperature.length);
    //     // console.log("temperature 0 : ", temperature[0]);
    //     // console.log("temperature 1 : ", temperature[1]);
    //     console.log("channel name1 : ", channel_btn[0][0]);
    //     res.render('main', { temperature, channel, channel_btn });
    //   })
    // }) 
    // let channel = null;
     //res.render('main', { channel_btn ,channel});   
  });
  
}); // email을 받아서 해당하는 data를 뿌려준다.

router.post('/sendtemperature', async (req,res,next) => { 
  //console.log("channel : ", req.body.channel);
  ChannelKey.findOne({channelKey: req.body.channel}, (err, channel) => {
        // console.log("channel field name1 : ", channel.channelKey);
        // console.log("channel field name : ", channel.index.length);
    console.log("channel field name : ", channel.index);
    Temperature.find({"channel": channel.channelKey}, (err, temperature) => {
      console.log("temperature : ", temperature[0]);
        if(temperature[0] != null)
        {
          console.log("여기 시작함...");
          let timeset = []; // 이중 배열
          timeset.push(temperature[0].createdAt);
          timeset.push(temperature[temperature.length-1].createdAt);
          let minmax = [];
          minmax.push(temperature[0].createdAt);
          minmax.push(temperature[temperature.length-1].createdAt);
          function split(str){
            return str.split("T")
          }
          //console.log("분리할 날짜 : ",temperature[0].createdAt);
          let time = [];
          for(let i = 0 ; i < temperature.length ; i++)
          {
            time.push(split(temperature[i].createdAt));
          }
          let check = channel.index;
          console.log("check : ", check.length);
          console.log("check : ", check[0]);
          console.log("check : ", check[1]);
          // console.log("날짜 분리 : ", time[0][0]);
          // console.log("날짜 분리 : ", time[1][0]);
          // console.log("날짜 분리 : ", time[2][0]);
          // console.log("날짜 분리 : ", time[3][0]);
          //console.log("날짜 분리 : ", timeset);
          // console.log("temperature 0 : ", temperature[0]);
          // console.log("temperature 1 : ", temperature[1]);
          //console.log("channel name1 : ", channel_btn[0][0]);
          res.render('temperaturetable', { temperature, channel, timeset, minmax, time, check});
        } else {
          
          let timeset = [];
          let minmax = [];
          let check = channel.index;
          res.render('temperaturetable', { temperature,channel, timeset, minmax, check});
        }
    })
  }) 
});

router.post('/sendtime', async (req,res,next) => { 
  // console.log("channel : ", req.body.channel);
  // console.log("start : ", req.body.start);
  // console.log("end : ", req.body.end);
  // console.log("min : ", req.body.min);
  // console.log("max : ", req.body.max);
  // console.log("check : ", req.body.check);
  ChannelKey.findOne({channelKey: req.body.channel}, (err, channel) => {
        // console.log("channel field name1 : ", channel.channelKey);
        // console.log("channel field name : ", channel.index.length);
        // console.log("channel field name : ", channel.index[1]);
        Temperature.find({"channel": channel.channelKey, "createdAt": { "$gte":req.body.start, "$lte":req.body.end }}, (err, temperature) => {
          //console.log("위치 확인 : ",minmax);
          //console.log("temperature : ", temperature);
          let timeset = []; // 이중 배열]
          let minmax = [];
          let time = [];
          let check = [];
          check = req.body.check
          console.log("check : ", check);
          if(temperature != ""){
            timeset.push(temperature[0].createdAt);
            timeset.push(temperature[temperature.length-1].createdAt);
            minmax.push(req.body.min);
            minmax.push(req.body.max);
            function split(str){
              return str.split("T")
            }  
            for(let i = 0 ; i < temperature.length ; i++)
            {
               time.push(split(temperature[i].createdAt));
            }
            //console.log("check : ", check);
            res.render('temperaturetable', { temperature, channel, timeset, minmax, time, check});
          } else {
            res.render('temperaturetable', { temperature, channel, timeset, minmax, time, check});
          }
        })
      }) 
});

router.get('/main', function(req, res, next){
  let email = req.session.email;
  res.render('arduino', { email });
});//table temperature 화면에 session값 넘겨 주기


router.post('/managerchart', (req, res, next) => {
  User.findOne({ email: req.session.email }, (err, user) => {
    function split(str){
      return str.split(", ")
    }
    console.log("user : ", user);
    let channel_btn = [];
    let channel_cnt = split(user.channel);
    for(let i = 0 ; i < channel_cnt.length-1 ; i++)
    {
      ChannelKey.find({channelKey: channel_cnt[i]}, async(err, channel) => {
        channel_btn.push([channel[0].name, channel_cnt[i]]);
        console.log("channel name1 : ", channel_btn);
      })
    }
    User.findOne({email: req.session.email}, (err,user) => {
      let channel = null;
      res.render('Main/Chart/chart', { channel_btn, channel});  
    })
   
  });
});//그래프 메인부분

router.post('/getchartdata', async(req,res,next)=> {
  ChannelKey.findOne({channelKey: req.body.channel}, (err, channel) => {
    Temperature.find({"channel": channel.channelKey}, (err, temperature) => {
      let timeset = []; // 이중 배열
      timeset.push(temperature[0].createdAt);
      timeset.push(temperature[temperature.length-1].createdAt);
      let minmax = [];
      minmax.push(temperature[0].createdAt);
      minmax.push(temperature[temperature.length-1].createdAt);
      function split(str){
        return str.split("T")
      }
      let time = [];
      for(let i = 0 ; i < temperature.length ; i++)
      {
         time.push(split(temperature[i].createdAt));
      }
      let check = channel.index;
      res.render('Main/Chart/chartshow', { temperature, channel, timeset, minmax, time, check});
    })
  }) 
})


router.post('/chartdata', async (req,res,next) => {
    console.log("channel : ",req.body.check); // 3, 5
    ChannelKey.findOne({channelKey: req.body.channel}, (err, channel) => {
      console.log("channel field name : ", channel.index);
      Temperature.find({"channel": channel.channelKey, "createdAt": { "$gte":req.body.start, "$lte":req.body.end }}, (err, temperature) => {
        let temp = [];
        //console.log(temperature);
        function split(str){
          return str.split("T")
        }
        for(var x = 0; x < temperature.length ; x++){ //4
          let trans = [];
          trans.push(split(temperature[x].createdAt)[0] + " " +split(temperature[x].createdAt)[1]);// 시간 들어가는 곳
          for(var y = 0 ; y < req.body.check.length ; y++){ // 2
            for(var z = 1 ; z < 9 ; z++){
              if( z == req.body.check[y]){
                if(z == 1){
                  trans.push(temperature[x].field1);
                }else if(z == 2){
                  trans.push(temperature[x].field2);
                }else if(z == 3){
                  trans.push(temperature[x].field3);
                }else if(z == 4){
                  trans.push(temperature[x].field4);
                }else if(z == 5){
                  trans.push(temperature[x].field5);
                }else if(z == 6){
                  trans.push(temperature[x].field6);
                }else if(z == 7){
                  trans.push(temperature[x].field7);
                }else if(z == 8){
                  trans.push(temperature[x].field8);
                }
                //console.log(trans);
              }               
            }
          }
          temp.push(trans);
        }
        
        let trans = [];
        for(var x = 0; x < req.body.check.length ; x++){
          for(var y = 0 ; y < 9 ; y++){
            if(req.body.check[x] == y){
              if(y == 1 ){ trans.push(channel.field1); }
              else if(y == 2 ){ trans.push(channel.field2); }
              else if(y == 3 ){ trans.push(channel.field3); }
              else if(y == 4 ){ trans.push(channel.field4); }
              else if(y == 5 ){ trans.push(channel.field5); }
              else if(y == 6 ){ trans.push(channel.field6); }
              else if(y == 7 ){ trans.push(channel.field7); }
              else if(y == 8 ){ trans.push(channel.field8); }
            }
          }
        }
        temp.push(trans);
        console.log("temp : ", temp);
        res.send(temp);
      })
    }) 
   
});//그래프 그려주는 부분 AJAX



router.get('/temperature', function (req, res, next) {
  const query = require('url').parse(req.url, true).query;

  console.log("text", query);
  let field1,field2,field3,field4,field5,field6,field7,field8;
  field1  = query.field1;
  field2  = query.field2;
  field3  = query.field3;
  field4  = query.field4;
  field5  = query.field5;
  field6  = query.field6;
  field7  = query.field7;
  field8  = query.field8;
  let key = query.key;
  let channelkey = query.channelKey;
  User.find({"userkey" : query.key}, (err,user) => {
    if(user)
    {
      ChannelKey.findOne({"channelKey": query.channelKey}, (err,channel) =>{
        var create = moment().format('YYYY-MM-DDTHH:mm:ss');
        console.log("channel : ", channel.index);
        console.log("timestamp : ", create);
        
        let temperature = new Temperature({
          key : key,
          createdAt: create,
          channel : channelkey,
          field1 : field1,
          field2 : field2,
          field3 : field3,
          field4 : field4,
          field5 : field5,
          field6 : field6,
          field7 : field7,
          field8 : field8
        });
        console.log("temperature : ", temperature);
        temperature.save();
        res.send("성공");
      })
    }
  });
  
});



router.get('/getuserkey', (req, res, next) => {
  User.findOne({ email: req.session.email }, (err, user) => {
    let key = [];
    key[0] = user.userkey;
    console.log('chart data: ', key);
    res.send(key);
  })
});

router.get('/getuser', (req, res, next) => {
  User.findOne({ email: req.session.email }, (err, user) => {
    let userId = [];
    userId[0] = req.session.email;
    console.log('chart data: ', userId);
    res.send(userId);
  })
});//그래프 그려주는 부분 AJAX

router.get('/key', (req, res, next) => {
  res.render('key');
});//그래프 띄우는 pug


router.get('/softro', (req, res, next) => {
  res.render('softro');
  //res.redirect('/BlocklyDuino-gh-pages/blockly/apps/blocklyduino/index.html');
});//blockly 연결

router.get('/teachablem', (req, res, next) => {
  res.render('teachablem');
  //res.redirect('/BlocklyDuino-gh-pages/blockly/apps/blocklyduino/index.html');
});//blockly 연결

router.post('/preview', async (req,res,next) => {
  console.log("rendering : ", req.body.markdown);
  const  md  = require('markdown-it')({ 
    html : true,
    linkify : true,
  }).use(require('markdown-it-video', { // <-- this use(package_name) is required
    youtube: { width: 640, height: 390 },
    vimeo: { width: 500, height: 281 },
    vine: { width: 600, height: 600, embed: 'simple' },
    prezi: { width: 550, height: 400 }
  }));

  var makrdownPre = md.render(req.body.markdown);
  console.log("makrdownPre : ", makrdownPre);
  res.send(makrdownPre);
})

router.post('/channelKey', (req,res,next) => { // 채널 만들기
  console.log("req.body: ", req.body);
  var result = Math.floor(Math.random() * 1000000)+100000;
  if(result>1000000){
   result = result - 100000;
  }
  console.log('채널키 확인 : ', result);
  ChannelKey.findOne({"channelKey": result}, (err,channelKey)=> {
    if(channelKey) {
      res.redirect('/channelKey');
    }
    else {
      const channelKey = new ChannelKey({
        channelKey: result,
        name: req.body.channel_name,
        index: req.body.index,
        field1:req.body.field1_name,
        field2:req.body.field2_name,
        field3:req.body.field3_name,
        field4:req.body.field4_name,
        field5:req.body.field5_name,
        field6:req.body.field6_name,
        field7:req.body.field7_name,
        field8:req.body.field8_name,
      });  
      channelKey.save()
    }
  })

  User.findOne({"email": req.session.email }, (err,user)=> {
    console.log('실행됨');
    if(user.channel == null)
    {
      user.channel = result + ", ";
      user.save();
    } else {
      user.channel += result + ", ";
      user.save();
    }

    res.redirect('/arduino');
  })

})

router.get('/channelView', (req, res, next) => {
  
  function split(str){
    return str.split(", ")
  }
  User.findOne({"email": req.session.email }, (err,user)=> {
    if(user.channel == "" || user.channel == null)
    {
      let channeldata = 0;
      console.log("길이 : ", channeldata.length);
      res.render('channel', {channeldata});
    } else {
      let chn = split(user.channel)
      let channeldata = [];
      console.log("확인중:",chn[0]);
      for(let i = 0 ; i < chn.length-1 ; i++)
      {
        ChannelKey.findOne({"channelKey": chn[i]}, (err,channelkey)=> {
          console.log("확인중 2 : ", channelkey)
          let trans = [channelkey.name, channelkey.channelKey]
          console.log("input data : ", trans);
          channeldata.push(trans);
          if(i == chn.length-2)
          {
            res.render('channel', {channeldata});
          }
        })
      }
    }
  })
});//채널키확인


router.get('/channelDelete', (req,res,next) => {
  const query = require('url').parse(req.url, true).query;

  deleteData = query.channel;

  function split(str){
    return str.split(", ")
  }

  ChannelKey.findOne({"channelKey": deleteData}, (err,channel)=> {
    console.log(channel);
    channel.remove();
  })

  User.findOne({"email": req.session.email }, (err,user)=> {
    let channel = split(user.channel)
    user.channel = "";
    for( let i = 0 ; i < channel.length-1 ; i++)
    {
      if(channel[i] != deleteData)
      {
        if(user.channel == null)
        {
          user.channel = channel[i] + ", ";
          user.save();
        } else {
          user.channel += channel[i] + ", ";
          user.save();
        }
      } 
    }
    user.save();

    res.redirect('/arduino');
  })
})


router.post('/managercam', (req, res, next) => {
  Rtsp.find({"user": req.session.email }, (err,rtsp) => {
    // console.log("rtsp : ", rtsp[0]);
    // console.log("rtsp : ", rtsp[0].name);
    // console.log("rtsp : ", rtsp[0].url);
    // console.log("rtsp : ", rtsp[0].user);
    // console.log("rtsp : ", rtsp[0].arduinoIp);
    console.log("rtsp : ", rtsp);
    if(rtsp[0] == "" || rtsp[0] == null)
    { 
      rtsp.push({
        url : "",
        name : "",
        user : "",
        arduinoIp : "",
      }); 
      res.render('Main/Cam/rtsp', {rtsp});
    } else {
      console.log("send");
      res.render('Main/Cam/rtsp', {rtsp});
    }
  })
  
});

router.post('/makechannel', (req,res,next)=>{
  res.render('Main/Channel/makechannel')
})

router.post('/savertsp', async(req,res,next)=> {
  console.log("rtsp : " , req.body);
  console.log("user : ", req.session.email);

  const rtsp = new Rtsp({
    name: req.body.name,
    url: req.body.url,
    user: req.session.email,
    arduinoIp: req.body.arduinoIp,
  });  
  rtsp.save()
  console.log("순서상1")
  res.redirect('/arduino');
  //res.redirect('/rtsp');
  // Stream = require('node-rtsp-stream')
  // stream = new Stream({
  //   name: 'name',
  //   streamUrl: req.body.rtsp,
  //   wsPort: 9999,
  //   ffmpegOptions: { // options ffmpeg flags
  //     '-stats': '', // an option with no neccessary value uses a blank string
  //     '-r': 30, // options with required values specify the value after the key
  //     '-max_muxing_queue_size' : 1024,
  //   }
  // })
  //console.log("stream : ", stream.streamUrl);
  //res.send();
})

let rtsp_count = 9998;
router.post('/sendrtsp', async(req,res,next) => {
  Stream = require('node-rtsp-stream')
  rtsp_count ++;
  console.log("번호", rtsp_count)
  stream = new Stream({
    name: 'name',
    streamUrl: req.body.rtsp,
    wsPort: rtsp_count,
    ffmpegOptions: { // options ffmpeg flags
      '-stats': '', // an option with no neccessary value uses a blank string
      '-r': 30, // options with required values specify the value after the key
      '-max_muxing_queue_size' : 1024,
    }
  })
  console.log("stream : ", stream.streamUrl);
  res.send();
})

router.post('/makecam', (req,res,next)=>{
  res.render('Main/Cam/makertsp');
})

router.get('/rtspDelete', (req,res,next) => {
  const query = require('url').parse(req.url, true).query;
  deleteData = query.rtsp;
  function split(str){
    return str.split(", ")
  }
  Rtsp.findOne({"_id": deleteData}, (err,rtsp)=> {
    console.log(rtsp);
    rtsp.remove();
  })
  res.redirect('/managerrtsp')
})

router.get('/managerrtsp', async(req,res,next) => {
  Rtsp.find({"user": req.session.email }, (err,rtsp) => {
    // console.log("rtsp : ", rtsp[0]);
    // console.log("rtsp : ", rtsp[0].name);
    // console.log("rtsp : ", rtsp[0].url);
    // console.log("rtsp : ", rtsp[0].user);
    if(rtsp[0] == "" || rtsp[0] == null)
    { 
      rtsp.push({
        url : "",
        name : "",
        user : "",
        _id : "",
      }); 
      res.render('Main/cam/managerrtsp', {rtsp, });
    } else {
      res.render('Main/cam/managerrtsp', {rtsp});
    }
  })
})

router.post('/managerchannel', async (req,res,next) => { 
  function split(str){
    return str.split(", ")
  }
  User.findOne({"email": req.session.email }, (err,user)=> {
    console.log("1");
    if(user.channel == "" || user.channel == null)
    {
      let channeldata = 0;
      console.log("2");
      res.render('Main/Channel/channel', {channeldata});
    } else {
      let chn = split(user.channel)
      let channeldata = [];
      console.log("확인중:",chn.length);
      console.log("확인중:",chn);
      for(let i = 0 ; i < chn.length-1 ; i++)
      {
        ChannelKey.findOne({"channelKey": chn[i]}, (err,channelkey)=> {
          console.log("확인중 2 : ", channelkey)
          let trans = [channelkey.name, channelkey.channelKey]
          console.log("input data : ", trans);
          channeldata.push(trans);
          if(i == chn.length-2)
          {
            res.render('Main/Channel/channel', {channeldata});
          }
        })
      }
    }
  })
});

router.get('/servo', (req,res,next)=>{
  res.render('Servo/servo');
})

router.post('/servosend', async (req,res,next) => { 

});

module.exports = router;