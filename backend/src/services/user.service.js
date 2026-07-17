const User = require("../models/user.model");

const updateProfile = async (userId, { firstName, lastName, email, avatar, password }) => {
  const updateFields = { firstName, lastName, email };
  if (avatar) updateFields.avatar = avatar;
  if (password) {
    const bcrypt = require("bcryptjs");
    updateFields.password = await bcrypt.hash(password, 10);
  }

  return User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select("-password"); // Ne retourne pas le hash du mot de passe
};

module.exports = { updateProfile };
