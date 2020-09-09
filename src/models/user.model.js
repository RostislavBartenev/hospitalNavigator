const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  }
});

userSchema.methods.verifyPassword = async function(password){
 return (await bcrypt.compare(password, this.password));
}


module.exports = mongoose.model('User', userSchema);
