const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String, required: true, minlength: 1 },
  lastname: { type: String, required: true, minlength: 1 },
  username: { type: String, required: true, minlength: 1 },
  password: { type: String, required: true, minlength: 1, trim: true },
  status: {
    type: String,
    enum: ['outsider', 'member', 'admin'],
    default: 'outsider',
  },
});

// Virtual for User's fullname
UserSchema.virtual('fullname').get(function() {
  return this.firstname + ' ' + this.lastname;
});

//Export model
module.exports = mongoose.model('User', UserSchema);