const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const passwordConfirmation = request.body.passwordConfirmation;

    if (password !== passwordConfirmation) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password doesnt match'
      );
    }

    const emailCheck = await usersService.emailWasAvailable(email);
    if (!emailCheck) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already taken'
      );
    }

    const success = await usersService.createUser(
      name,
      email,
      password,
      passwordConfirmation
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    const emailCheck = await usersService.emailAvailable(email);
    if (!emailCheck) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already taken'
      );
    }

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changePassword(request, response, next) {
  try {
    const id = request.params.id;
    const oldPassword = request.body.oldPassword;
    const newPassword = request.body.newPassword;
    const confirmPassword = request.body.confirmPassword;

    // Memeriksa apakah konfirmasi password baru sama dengan password baru
    if (newPassword !== confirmPassword) {
      return response.status(400).json({
        statusCode: 400,
        error: 'PASSWORD_MISMATCHED',
        message: 'Password do not match',
      });
    }

    // Memeriksa apakah password baru memiliki panjang yang sesuai
    if (newPassword.length < 6 || newPassword.length > 32) {
      return response.status(400).json({
        statusCode: 400,
        error: 'INVALID_PASSWORD_LENGTH',
        message: 'New password must be between 6 and 32 characters',
      });
    }

    // Memeriksa apakah password lama sama dengan password saat ini
    const user = await usersService.getUser(id);
    if (!user) {
      return response.status(404).json({
        statusCode: 404,
        error: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    if (user.password !== oldPassword) {
      return response.status(400).json({
        statusCode: 400,
        error: 'INVALID_OLD_PASSWORD',
        message: 'Old password is incorrect',
      });
    }

    // Update password
    const success = await usersService.updatePassword(id, newPassword);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update the password'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next (error);
  }
}

async function changeUserPassword(request, response, next) {
  try {
    const id = request.params.id;
    const oldPassword = request.body.oldPassword;
    const newPassword = request.body.newPassword;
    const confirmPassword = request.body.confirmPassword;

    if (newPassword.length < 6 || newPassword.length > 32) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password length must be between 6 and 32 characters'
      );
    }

    if (newPassword !== confirmPassword) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'New password and confirmation do not match'
      );
    }

    const success = await usersService.changeUserPassword(
      id,
      oldPassword,
      newPassword,
      confirmPassword
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change password'
      );
    }

    return response.status(200).json('Password Changed Succesfuly');
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
};
