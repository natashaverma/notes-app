const router = require('express').Router();
const passport = require('passport');

// Models
const User = require('../models/User');

router.get('/users/signup', (req, res) => {
  res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password } = req.body;
  if(password != confirm_password) {
    errors.push({text: 'Password doesnt match'});
  }
  if(password.length < 4) {
    errors.push({text: 'password should contain more than 4 chars'})
  }
  if(name.length == 0) {
    errors.push({text: 'Por favor escribe un nombre.'})
  }
  if(errors.length > 0){
    res.render('users/signup', {errors, name, email, password, confirm_password});
  } else {
    // Reviso coincidencias de email
    const emailUser = await User.findOne({email: email});
    if(emailUser) {
      req.flash('error_msg', 'Email already registered');
      res.redirect('/users/signup');
    } else {
      // Guardo un nuevo usuario
      const newUser = new User({name, email, password});
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash('success_msg', 'Registered');
      res.redirect('/users/signin');
    }
  }
});

router.get('/users/signin', (req, res) => {
  res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
  successRedirect: '/notes',
  failureRedirect: '/users/signin',
  failureFlash: true
}));

router.get('/users/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Logged out!!');
  res.redirect('/users/signin');
});

module.exports = router;
