const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const cors = require('cors');
require('dotenv').config();
require('bcrypt-nodejs');



const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const communityRouter = require('./routes/community');
const connect = require('./models');
const app = express();

const SerialPort = require("serialport");

const sp = new SerialPort("COM4", { baudRate:9600, autoOpen:false });


connect();

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('express-ejs-extend'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 80);
app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge:  24000 * 60 * 60
  },
}));
app.use(flash());
app.use(methodOverride('_method'));

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/community', communityRouter);

app.use(function(req, res, next) { 
  res.locals.user = req.session.user; 
  next(); 
 }); 

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});


function timeDelay(timeout) {
	return new Promise((resolve) => {
		setTimeout(resolve, timeout);
	});
}

sp.open(function() {
	timeDelay(5000);
	sp.on("error", function(error) {
		console.log("Error : ", error.message);
	});
	sp.write("Hello SAAK", function(error) {
		if(error) {
			return console.log("Error on write : ", error.message);
		} else {
			console.log("메세지가 정상적으로 입력되었습니다.");
		}
	});
});


// Stream = require('node-rtsp-stream')
//   stream = new Stream({
//   name: 'name',
//   streamUrl: 'rtsp://root303:root303@220.68.233.124:554/stream1',
//   wsPort: 9999,
//   ffmpegOptions: { // options ffmpeg flags
//     '-stats': '', // an option with no neccessary value uses a blank string
//     '-r': 30, // options with required values specify the value after the key
//     '-max_muxing_queue_size' : 1024,
//   }
// })

