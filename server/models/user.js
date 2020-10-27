const mongoose = require('mongoose');
const { USER_ROLE } = require('../constants');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(USER_ROLE),
    required: true,
    default: USER_ROLE.REGULAR,
  },
  preferredHours: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

User.createUser = async (data) => {
  const newUser = await User(data).save();
  return newUser;
};

User.getUserByEmail = (email) =>
  User.findOne({
    email,
  });

User.countUsers = () => User.countDocuments({ role: { $ne: USER_ROLE.ADMIN } });

User.listUsers = (pageNum, pageSize) => {
  if (pageSize === -1) {
    return User.find()
      .select('-password -__v')
      .where('role')
      .ne(USER_ROLE.ADMIN)
      .sort('-createdAt')
      .lean();
  }
  return User.find()
    .select('-password -__v')
    .where('role')
    .ne(USER_ROLE.ADMIN)
    .sort('-createdAt')
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .lean();
};
User.getUserById = (id) => User.findById(id).select('-password -__v');

module.exports = User;
