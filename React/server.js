const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const app = express();
const cors = require('cors')();

const connect = require('./models');
connect();

app.set('port', process.env.PORT || 80);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors);
app.use('/auth', authRouter);



/////////////////////////////////////////////////
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
