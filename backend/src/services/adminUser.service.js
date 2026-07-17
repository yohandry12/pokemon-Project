const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

const listUsers = () => User.find().select("-password");

const setActive = async (userId, isActive) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive },
    { new: true }
  ).select("-password");
  if (!user) throw new ApiError(404, "Utilisateur non trouvé.");
  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new ApiError(404, "Utilisateur non trouvé.");
};

module.exports = { listUsers, setActive, deleteUser };
