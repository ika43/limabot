const mongoose = require('mongoose');
const validator = require('validator');

const model = mongoose.model('User', {
  senderId: {
    type: String,
    required: [true, 'Sender id is required']
  },
  firstname: {
    type: String,
    required: [true, 'Firstname is required'],
    validate: {
      validator(firstname) {
        return validator.isAlphanumeric(firstname);
      },
    },
  },
  lastname: {
    type: String,
    required: [true, 'Lastname is required'],
    validate: {
      validator(firstname) {
        return validator.isAlphanumeric(firstname);
      },
    },
  },
  createdAt: {
    type: Date,
    required: [true, 'CreatedAt is required'],
  }
});

module.exports = model;