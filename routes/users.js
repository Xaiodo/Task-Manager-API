const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const router = express.Router();

router.get('/byId/:id', async (request, response) => {
  try {
    const user = await User.findOne({ _id: request.params.id }).select('-passwordHash');
    if (!user) {
      return response.status(501).json({ success: false });
    }
    return response.send(user);
  } catch (error) {
    return response.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:email', async (request, response) => {
  try {
    const user = await User.findOne({ email: request.params.email }).select('-passwordHash');
    if (!user) {
      return response.status(501).json({ success: false });
    }
    return response.send(user);
  } catch (error) {
    return response.status(500).json({ success: false, message: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, process.env.SALT),
      imageUrl: req.body.imageUrl,
    });
    const createdUser = await user.save();
    if (!createdUser) res.status(404).json({ message: 'User can not be created' });
    res.send(createdUser);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.SECRET;
  if (!user) {
    return res.status(400).json({ success: false, message: 'User not found' });
  }
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      secret,
      { expiresIn: '30d' },
    );
    return res.status(200).send({ user: user.email, token });
  }
  return res.status(400).json({ success: false, message: 'Password is wrong' });
});

module.exports = router;
