const { body, validationResult } = require('express-validator');
const Message = require('../models/message');

// GET New Message Form
exports.newMessageGet = (req, res) =>
  req.user
    ? res.render('new-message', { title: 'Create New Message' })
    : res.redirect('/log-in');

// POST New Message Form
exports.newMessagePost = [
  body('title')
    .isLength({ min: 2, max: 20 })
    .withMessage('Title must be between 2 and 20 characters long')
    .trim()
    .escape(),
  body('text')
    .isLength({ min: 2 })
    .withMessage('Message must be at least 2 characters long')
    .trim()
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    // Check if user signed in
    if (!req.user) res.redirect('/sign-up');
    // Render again if errors
    if (!errors.isEmpty()) {
      const message = new Message({
        title: req.body.title,
        text: req.body.text,
      });
      res.render('new-message', { message, errors: errors.array() });
    }
    try {
      const message = new Message({
        title: req.body.title,
        text: req.body.text,
        timestamp: Date.now(),
        author: req.user._id,
      });
      await message.save();
      res.redirect('/');
    } catch (err) {
      next(err);
    }
  },
];

// Message List
exports.messageList = async (req, res, next) => {
  try {
    return Object.values(await Message.find().populate('author')).reverse();
  } catch (error) {
    next(err);
  }
};

// Delete message
exports.deleteMessage = async (req, res, next) => {
  if (req.user.status === 'admin') {
    try {
      await Message.findByIdAndDelete(req.params.id);
      res.redirect('/');
    } catch (err) {
      next(err);
    }
  }
};