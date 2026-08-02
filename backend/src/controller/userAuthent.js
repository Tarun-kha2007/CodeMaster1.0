const User = require("../models/user");
const validate = require("../utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const Submission = require("../models/submission");
const sendEmail = require("../utils/Eamil");

const JWT_SECRET = process.env.JWT_SECRET || "48dda0e1ee047700c9e81fa470e825f8cd790f94d9bbc8b1d6ca16426847d44e";

const register = async (req, res) => {
  try {
    validate(req.body);
    const { firstName, emailId, password, otp } = req.body;

    const normalizedEmail = emailId?.toLowerCase();
    const existingUser = await User.findOne({ emailId: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    if (otp) {
      const storedOtp = await redisClient.get(`otp:${normalizedEmail}`);
      if (!storedOtp || storedOtp !== otp.toString()) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
      }
      await redisClient.del(`otp:${normalizedEmail}`);
    }

    req.body.role = "user";
    req.body.emailId = normalizedEmail;
    req.body.password = await bcrypt.hash(password, 10);
    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: "user" },
      JWT_SECRET,
      { expiresIn: 60 * 60 }
    );
    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

    try {
      await sendEmail("register", {
        firstName,
        emailId: normalizedEmail,
      });
    } catch (emailErr) {
      console.error("Welcome email warning:", emailErr);
    }

    res.status(201).json({
      user: reply,
      message: "Registered Successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message || "Registration failed" });
  }
};

const preLogin = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const normalizedEmail = emailId.toLowerCase();
    const user = await User.findOne({ emailId: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redisClient.set(`otp:${normalizedEmail}`, otp, { EX: 300 });

    try {
      await sendEmail("otp", { emailId: normalizedEmail, otp, firstName: user.firstName });
    } catch (emailErr) {
      console.error("OTP email warning:", emailErr);
    }

    console.log(`Pre-login OTP sent to ${normalizedEmail}: ${otp}`);
    return res.status(200).json({ otpRequired: true, message: "Credentials valid. OTP sent to your email." });
  } catch (err) {
    console.error("preLogin error:", err);
    return res.status(500).json({ message: "Pre-login failed: " + err.message });
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password, otp } = req.body;
    if (!emailId || !password) return res.status(400).json({ message: "Invalid Credentials" });
    const normalizedEmail = emailId.toLowerCase();
    const user = await User.findOne({ emailId: normalizedEmail });
    if (!user) return res.status(401).json({ message: "Invalid Credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid Credentials" });

    if (otp) {
      const storedOtp = await redisClient.get(`otp:${normalizedEmail}`);
      if (!storedOtp || storedOtp !== otp.toString()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      await redisClient.del(`otp:${normalizedEmail}`);
    }

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };
    const token = jwt.sign(
      { _id: user._id, emailId: normalizedEmail, role: user.role },
      JWT_SECRET,
      { expiresIn: 60 * 60 }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).json({
      user: reply,
      message: "Login Successfully",
    });
  } catch (err) {
    console.log("Error " + err);
    res.status(401).json({ message: err.message || "Login failed" });
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (token) {
      const payload = jwt.decode(token);
      if (payload?.exp) {
        await redisClient.set(`token:${token}`, "Blocked");
        await redisClient.expireAt(`token:${token}`, payload.exp);
      }
    }
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logged Out Successfully");
  } catch (err) {
    res.status(401).send("Error :" + err);
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.result._id;
    const user = await User.findById(userId).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile: " + err.message });
  }
};

const adminRegister = async (req, res) => {
  try {
    const { firstName, emailId, password } = req.body;
    req.body.role = "admin";
    req.body.password = await bcrypt.hash(password, 10);
    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: user.role },
      JWT_SECRET,
      { expiresIn: 60 * 60 }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("User Registered Successfully");
  } catch (err) {
    res.status(400).send("Error" + err);
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.result._id;
    await User.findByIdAndDelete(userId);
    res.status(200).send("Profile deleted successfully");
  } catch (err) {
    res.status(500).send("Error Occurred user not delete properly " + err);
  }
};

const checkUser = (req, res) => {
  res.json({ status: "OK" });
};

const sendOtp = async (req, res) => {
  try {
    const { emailId } = req.body;
    if (!emailId) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = emailId.toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redisClient.set(`otp:${normalizedEmail}`, otp, { EX: 300 });

    let firstName = null;
    try {
      const user = await User.findOne({ emailId: normalizedEmail });
      if (user) firstName = user.firstName;
    } catch (_) { }

    await sendEmail("otp", { emailId: normalizedEmail, otp, firstName });

    console.log(`OTP sent to ${normalizedEmail}: ${otp}`);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("sendOtp error:", err);
    res.status(500).json({ message: "Failed to send OTP: " + err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { emailId, otp } = req.body;
    if (!emailId || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const normalizedEmail = emailId.toLowerCase();
    const storedOtp = await redisClient.get(`otp:${normalizedEmail}`);

    if (!storedOtp) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (storedOtp !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    await redisClient.del(`otp:${normalizedEmail}`);

    res.status(200).json({ verified: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error("verifyOtp error:", err);
    res.status(500).json({ message: "Failed to verify OTP: " + err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { emailId, password, otp } = req.body;
    if (!emailId || !password) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const normalizedEmail = emailId.toLowerCase();

    if (otp) {
      const storedOtp = await redisClient.get(`otp:${normalizedEmail}`);
      if (!storedOtp || storedOtp !== otp.toString()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      await redisClient.del(`otp:${normalizedEmail}`);
    }

    const user = await User.findOne({ emailId: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    console.log(`Password reset for ${normalizedEmail}`);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ message: "Failed to reset password: " + err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const userId = req.result._id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: "Failed to update password: " + err.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.result._id;
    const user = await User.findById(userId).populate("problemSolved");
    if (!user) return res.status(404).json({ message: "User not found" });

    const solvedProblems = user.problemSolved || [];
    const totalSolved = solvedProblems.length;
    const easySolved = solvedProblems.filter(p => p.difficulty?.toLowerCase() === "easy").length;
    const mediumSolved = solvedProblems.filter(p => p.difficulty?.toLowerCase() === "medium").length;
    const hardSolved = solvedProblems.filter(p => p.difficulty?.toLowerCase() === "hard").length;

    const totalSubmissions = await Submission.countDocuments({ userId });
    const acceptedSubmissions = await Submission.countDocuments({ userId, status: "accepted" });

    res.status(200).json({
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      totalSubmissions,
      acceptedSubmissions,
      user: {
        firstName: user.firstName,
        emailId: user.emailId,
        role: user.role
      }
    });
  } catch (err) {
    console.error("getUserStats error:", err);
    res.status(500).json({ message: "Failed to fetch stats: " + err.message });
  }
};

module.exports = {
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
};
