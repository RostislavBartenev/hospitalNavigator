const User = require('../models/user.model')
const bcrypt = require('bcrypt');

const registerGet = (req, res) =>{
  res.render('register')
}

const registerPost = async (req, res) =>{
  const { username, password } = req.body
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  try {
    const user = new User({ username: username, password: hashedPassword })
    await user.save();
  } catch (err) {
    console.log(err.message);
  }
  res.redirect('/login')
}

const login = (req, res) =>{
  res.render('login')
}

module.exports = {
  registerGet,
  registerPost,
  login
}