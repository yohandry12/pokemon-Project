const userService = require("../services/user.service");

const updateProfile = async (req, res) => {
  try {
    const updatedUser = await userService.updateProfile(req.user._id, req.body);
    res.json({ message: "Profil mis à jour", user: updatedUser });
  } catch (err) {
    console.error("Erreur update profil :", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { updateProfile };
