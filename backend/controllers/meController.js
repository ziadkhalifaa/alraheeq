export const getMe = async (req, res) => {
  res.json({
    username: req.user.username,
    role: req.user.role,
  });
};
