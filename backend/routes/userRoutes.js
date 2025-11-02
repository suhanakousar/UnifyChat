const express = require('express');
const passport = require('../controllers/passController');

const { googleLogin } = require('../controllers/googleControler');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.status(200).json({
      message: 'Google authentication successful',
      user: req.user,
    });
  }
);

router.get('/google/fail', (req, res) => {
  res.status(401).json({ message: 'Google authentication failed' });
});

router.post('/google', googleLogin);
router.get('/me', authController.protect, authController.getMe);
router.put('/update', authController.protect, userController.updateUser);
// This route must come last to avoid matching /update as a userId
router.get('/:userId', userController.getUserById);
module.exports = router;
