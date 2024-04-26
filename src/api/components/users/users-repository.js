const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @param {string} passwordConfirmation - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password, passwordConfirmation) {
  return User.create({
    name,
    email,
    password,
    passwordConfirmation,
  });
}

/**
 * Checking if email is available to use

 * @param {string} email - Email
 * @returns {Promise}
 */
// Fungsi untuk memeriksa ketersediaan alamat email
async function checkEmailWasAvailable(email) {
  try {
    const users = await User.find({ email: email });
    return users.length === 0; // Mengembalikan true jika tidak ada pengguna dengan alamat email tersebut
  } catch (error) {
    console.error('Error:', error);
    return false; // Mengembalikan false jika terjadi kesalahan saat mencari pengguna
  }
}

// Contoh penggunaan
const email = 'contoh@contoh.com';

checkEmailWasAvailable(email)
  .then((isAvailable) => {
    if (isAvailable) {
      console.log('Alamat email tersedia.');
    } else {
      console.log('Email already taken. Please choose another one.');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Update user's password
 * @param {string} id - User ID
 * @param {string} newPassword - Hashed new password
 * @returns {Promise}
 */

async function updatePassword(id, newPassword) {
  return User.findByIdAndUpdate(id, { password: newPassword });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  checkEmailWasAvailable,
  updateUser,
  deleteUser,
  updatePassword,
};
