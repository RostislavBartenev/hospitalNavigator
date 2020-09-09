const User = require('../models/user.model')
const bcrypt = require('bcrypt');

const registerGet = (req, res) =>{
  res.render('register')
}

const registerPost = async (req, res, next) =>{
  const { username, password } = req.body
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  try {
    const user = new User({ username: username, password: hashedPassword })
    await user.save();
  } catch (err) {
    console.log(err.message);
    res.render('register', {err})
  }
//  res.redirect('/login')
  next()
  
}

module.exports = {
  registerGet,
  registerPost,
}
