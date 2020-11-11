const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, minlength: 2 },
  text: { type: String, required: true, minlength: 2 },
  timestamp: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

// Virtual for formatted timestamp
MessageSchema.virtual('date').get(function() {
  return moment(this.timestamp).format('Do MMM YYYY HH:mm');
});

//Export model
module.exports = mongoose.model('Message', MessageSchema);