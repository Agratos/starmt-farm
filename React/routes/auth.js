const express = require('express');
const bcrypt = require('bcrypt-nodejs');
//const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const User = require('../models/user')
const router = express.Router();
require('passport');

router.post("/login", (req, res) => {
    console.log("접속함 ",req.body);
    let email = req.body.email;
    let password = req.body.password;
    
    User.findOne({ email: email }, (err, user) => {
        if (!user) {
            return res.send(JSON.stringify({
                "message": "Email이 틀렸습니다."
            }));
        } else { 
        bcrypt.compare(password, user.password, (err, isM) => {
        if (!isM) {
            return res.send(JSON.stringify({
                "message": "비밀번호가 틀렸습니다."
            }));
        } else {
            return res.send(JSON.stringify({
                "email":user.email,
                "key":user.key,
                "channel":user.channel
            }));
        }
        });
    }});
});

module.exports = router;
