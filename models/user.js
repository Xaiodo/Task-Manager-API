const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  passwordHash: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
});

exports.User = mongoose.model('User', userSchema);
