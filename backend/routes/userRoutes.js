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
  (req, res, next) => {
    console.log('/auth/google/callback hit. query:', req.query);
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        console.error('passport.authenticate error:', err);
        return res.status(500).send('Authentication error — check server logs.');
      }
      if (!user) {
        console.warn('No user returned from passport; info:', info);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('req.logIn error:', loginErr);
          return res.status(500).send('Login error — check server logs.');
        }
        console.log('Login successful, redirecting to frontend');
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/`);
      });
    })(req, res, next);
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
