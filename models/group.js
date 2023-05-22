const mongoose = require('mongoose');

const { Schema } = mongoose;

const groupSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  secretWord: {
    type: String,
    require: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
});

exports.Group = mongoose.model('Group', groupSchema);
