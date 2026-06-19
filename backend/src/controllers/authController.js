const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const userModel = require("../models/userModel");
const { asyncHandler } = require("../utils/asyncHandler");
const { AppError } = require("../utils/appError");
const { success } = require("../utils/apiResponse");

const allowedRoles = ["ADMIN", "STAFF", "VIEWER"];

const register = asyncHandler(async (req, res) => {
  const { full_name, email, password, role = "STAFF" } = req.body;

  if (!full_name || !email || !password) {
    throw new AppError("full_name, email, and password are required", 400);
  }

  if (!allowedRoles.includes(role)) {
    throw new AppError("Invalid role", 400);
  }

  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const password_hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({ full_name, email, password_hash, role });

  return success(res, { user }, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("email and password are required", 400);
  }

  const user = await userModel.findByEmail(email);
  if (!user || !user.is_active) {
    throw new AppError("Invalid credentials", 401);
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new AppError("Invalid credentials", 401);
  }

  await userModel.updateLastLogin(user.id);

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role
    }
  });
});

const me = asyncHandler(async (req, res) => {
  return success(res, { user: req.user });
});

module.exports = {
  register,
  login,
  me
};

