const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// GET User Sign-Up Form
exports.userSignUpGet = (req, res) =>
  res.render('sign-up', { title: 'Sign-Up' });

// POST User Sign-Up Form
exports.userSignUpPost = [
  // Validate and sanitize data
  body('username')
    .isAlphanumeric()
    .withMessage('Username must be alphanumeric')
    .isLength({ min: 2, max: 20 })
    .withMessage('Username must be between 2 and 20 characters long')
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        return Promise.reject('Username already in use');
      }
    })
    .trim()
    .escape(),
  body('firstname')
    .isAlphanumeric()
    .withMessage('First name must be alphanumeric')
    .isLength({ min: 2, max: 20 })
    .withMessage('First name must be between 2 and 20 characters long')
    .trim()
    .escape(),
  body('lastname')
    .isAlphanumeric()
    .withMessage('Last name must be alphanumeric')
    .isLength({ min: 2, max: 20 })
    .withMessage('Last name must be between 2 and 20 characters long')
    .trim()
    .escape(),
  body('password')
    .exists()
    .withMessage('Password must be entered')
    .isLength({ min: 2, max: 50 })
    .withMessage('Password must be between 2 and 50 characters long')
    .trim()
    .escape(),
  body('passwordConfirmation')
    .custom(
      (passwordConfirmation, { req }) =>
        passwordConfirmation === req.body.password
    )
    .withMessage("Passwords don't match")
    .trim()
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    // Render again if errors
    if (!errors.isEmpty()) {
      const user = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      });
      return res.render('sign-up', {
        title: 'Sign-Up',
        errors: errors.array(),
        user,
      });
    }
    // Sign-Up the User
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: hashedPassword,
      });
      await user.save();
      res.redirect('/');
    } catch (err) {
      next(err);
    }
  },
];

// GET Log-In Form
exports.userLogInGet = (req, res) => {
  res.render('log-in');
};

// POST Log-In Form
exports.userLogInPost = (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      res.render('log-in', {
        errors: { login: { msg: 'Internal error.' } },
        title: 'Members Only',
      });
    } else if (!user) {
      res.render('log-in', {
        errors: { login: { msg: 'Invalid username or password.' } },
        title: 'Members Only',
        username: req.body.username,
      });
    } else {
      req.login(user, function(err, done) {
        if (err) {
          done(err);
        }
        res.redirect('/');
      });
    }
  })(req, res);
};

// Log-Out the User
exports.userLogOut = (req, res) => {
  req.session.destroy(function(err) {
    if (err) throw new Error(err);
    res.redirect('/'); //Inside a callback… bulletproof!
  });
};

// GET Join Club Form
exports.userJoinClubGet = (req, res) => {
  if (req.user) {
    res.render('join-club');
  } else {
    res.redirect('/');
  }
};

// POST Join Club Form
exports.userJoinClubPost = [
  // Validate and sanitize
  body('secretCode')
    .custom(
      (secretCode) =>
        secretCode === 'mrwinny' || secretCode === 'mrwinnie'
    )
    .withMessage('Wrong password kiddo')
    .trim()
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    // Check if user signed in
    if (!req.user) res.redirect('/sign-up');
    // Render again if errors
    if (!errors.isEmpty()) {
      res.render('join-club', { errors: errors.array() });
    }
    // Change user's status
    try {
      const user = await User.findOne({ username: req.user.username });
      req.body.secretCode === 'IWANNABECOOL'
        ? (user.status = 'member')
        : (user.status = 'admin');
      await user.save();
      res.redirect('/');
    } catch (err) {
      next(err);
    }
  },
];