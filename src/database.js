const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://root:root123@ds241258.mlab.com:41258/minor_project', {
  useCreateIndex: true,
  useNewUrlParser: true
})
  .then(db => console.log('DB connected'))
  .catch(err => console.error(err));
