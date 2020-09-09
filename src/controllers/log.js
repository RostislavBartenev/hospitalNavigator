const passport = require('passport')

const loginGet = (req, res) =>{
  res.render('login')
}


const loginPost = passport.authenticate('local', {
  successRedirect: '/main',
  failureRedirect: '/login',
  failureFlash: true })

module.exports = {
  loginGet,
  loginPost
}
