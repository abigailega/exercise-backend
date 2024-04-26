const joi = require('joi');

module.exports = {
  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joi.string().min(6).max(32).required().label('Password'),
      passwordConfirmation: joi
        .string()
        .valid(joi.ref('password'))
        .required()
        .label('password confirm')
        .messages({'any.only': 'Passwords not match',
        }),
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },


  changeUserPassword: {
    body: {
      oldPassword: joi.string().min(6).required().label('Old Password'),
      newPassword: joi.string().min(6).required().label('New Password'),
      confirmPassword: joi
        .string()
        .valid(joi.ref('newPassword'))
        .required() 
        .label('password confirm')
        .messages({'any.only': 'Passwords not match',
        }),
    },
  },
};
