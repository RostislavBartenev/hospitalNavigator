const express = require('express')
const path = require('path')
const hbs = require('hbs')
const indexRouter = require('./src/routes/index')
const registerRouter = require('./src/routes/register')
const loginRouter = require('./src/routes/login')
const checkAuthenticated = require('./middlewares/checkAuth')
const flash = require('express-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./src/models/user.model')

const app = express()

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src', 'views'))
hbs.registerPartials(path.join(__dirname, 'src', 'views', 'partials'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false);
      if (!user.verifyPassword(password)) return done(null, false);
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user))
})

app.get('/', indexRouter)
app.use('/register', registerRouter)
app.use('/login', loginRouter)

app.post('/login', passport.authenticate('local', {
  successRedirect: '/main',
  failureRedirect: '/login',
  failureFlash: true })
);

app.get('/main', (req, res) => {
  res.render('main')
})

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = app
