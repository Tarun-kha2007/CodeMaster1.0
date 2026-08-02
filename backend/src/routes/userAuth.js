const express = require('express');
const authRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const {
  register,
  preLogin,
  login,
  logout,
  getProfile,
  adminRegister,
  deleteProfile,
  checkUser,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getUserStats,
} = require('../controller/userAuthent');
const adminMiddleware = require('../middleware/adminMiddleware');

// Register
authRouter.post('/register', register);

// Pre-login check & trigger OTP
authRouter.post('/pre-login', preLogin);

// Login
authRouter.post('/login', login);

// Logout
authRouter.post('/logout', userMiddleware, logout);

// Get Profile
authRouter.get('/getprofile', userMiddleware, getProfile);

// User Solved Stats & Dashboard
authRouter.get('/stats', userMiddleware, getUserStats);

// Reset password for logged in user
authRouter.post('/reset-password', userMiddleware, resetPassword);

// Admin register
authRouter.post('/admin/register', adminMiddleware, adminRegister);

// Delete profile
authRouter.delete('/profile', userMiddleware, deleteProfile);

// Check authenticated user
authRouter.get('/check', userMiddleware, (req, res) => {
  const reply = {
    firstName: req.result.firstName,
    emailId: req.result.emailId,
    _id: req.result._id,
    role: req.result.role,
  };
  res.status(200).json({
    user: reply,
    message: "Valid User"
  });
});

// OTP - Send 6-digit code to email (for login & signup)
authRouter.post('/send-otp', sendOtp);

// OTP - Verify the submitted code
authRouter.post('/verify-otp', verifyOtp);

// Forgot Password - Reset password with email, new password & OTP
authRouter.post('/forgot-password', forgotPassword);

module.exports = authRouter;

