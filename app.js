const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const favicon = require('serve-favicon')
const session = require('cookie-session')
require('./fn/dbconnect')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(
  express.urlencoded({
    extended: false
  })
)
app.use(
  session({
    name: 'session',
    keys: ['onion ninja'],
    maxAge: 60 * 1000 // 1 mins
  })
)
app.use(cookieParser())
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static(path.join(__dirname, 'public')))

function isLogged(req, res, next) {
  if (req.session.uid) {
    next()
  } else {
    res.render('user/login')
  }
}

const indexRouter = require('./routes/index.route')
const usersRouter = require('./routes/user.route')
const productRouter = require('./routes/product.route')

app.use('/', indexRouter)
app.use('/tai-khoan', isLogged, usersRouter)
app.use('/san-pham', productRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).render('error404')
})

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
