const express = require('express')
const path = require('path')
const hbs = require('hbs')
const indexRouter = require('./src/routes/index')
const registerRouter = require('./src/routes/register')
const loginRouter = require('./src/routes/login')
const mainRouter = require('./src/routes/main')
const logoutRouter = require('./src/routes/logout')
const userMiddleware = require('./middlewares/user')

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
  User.findOne({ username: username }, async (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Пользователь не найден' });

    if (!(await user.verifyPassword(password))) return done(null, false, { message: 'Неверный пароль' });
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
app.use(userMiddleware);
app.use('/', indexRouter)
app.use('/register', registerRouter, passport.authenticate('local', {
  successRedirect: '/main',
  failureRedirect: '/register',
  failureFlash: true
}))

app.use('/login', loginRouter)
app.use('/main', checkAuthenticated, mainRouter)
app.use('/logout', logoutRouter);

module.exports = app
