const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');

// GET Index Page
router.get('/', async function(req, res, next) {
  res.render('index', {
    title: 'Members Only',
    user: req.user,
    messages: await messageController.messageList(),
  });
});

///// USER ROUTES /////

// GET Sign-Up Form
router.get('/sign-up', userController.userSignUpGet);

// POST Sign-Up Form
router.post('/sign-up', userController.userSignUpPost);

// GET Log-In Form
router.get('/log-in', userController.userLogInGet);

// POST Log-In Form
router.post('/log-in', userController.userLogInPost);

// Log-Out
router.get('/log-out', userController.userLogOut);

// GET Join Club Form
router.get('/join-club', userController.userJoinClubGet);

// POST Join Club Form
router.post('/join-club', userController.userJoinClubPost);

///// MESSAGE ROUTES /////

// GET New Message Form
router.get('/new-message', messageController.newMessageGet);

// POST New Message Form
router.post('/new-message', messageController.newMessagePost);

// Delete Message
router.post('/delete/:id', messageController.deleteMessage);

module.exports = router;