const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const alert = require('alert-node');
const User = require('../models/user')
const router = express.Router();
require('passport');
require('express-session');


router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/user');
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(req.body.password, salt, null, function(err, hash) {
          if (err) return next(err);       
          User.findOne({"email": req.body.email}, (err,user)=> {
            if(user) {
              alert('이미 가입되어 있습니다.');
            }
            else {
              const user = new User({
                email: req.body.email,
                password: hash,
                channel: "",
              });  
              user.save()
            }
          })
      });
    });
    return res.redirect('/login');
}); //router.post('/join 끝


router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      alert('이메일이 없습니다.');
      return res.redirect('/');
    } else { 
      bcrypt.compare(req.body.password, user.password, (err, isM) => {
      if (!isM) {
        console.log('비밀번호가 틀렸습니다.');
        return res.redirect('/');
      } else {
        req.session.email = req.body.email;
        return req.session.save(() => {
          res.redirect("/arduino");
        })   
      } 
    });
  }});
});

router.get('/logout', (req, res) => {
  console.log('삭제전: ', req.session.email);
  req.logout();
  req.session.destroy(); 
  res.redirect('/');
  console.log('삭제후: ', req.session);
});

router.get('/key', (req, res, next) => {
  let email = req.session.email;
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(email, salt, null, function(err, hash) {
        if (err) return next(err);       
        User.findOne({"email": req.session.email}, (err,user)=> {
            if(user.userkey == null)
            {
              user.userkey= hash;
              user.save();
              console.log('해쉬 확인중 만들어진 key: ', hash, ',,  user.userkey : ', user.userkey);
              res.redirect('/arduino');
            } else {
              res.redirect('/arduino');
            }
        })
    });
  });
});//키확인

module.exports = router;
