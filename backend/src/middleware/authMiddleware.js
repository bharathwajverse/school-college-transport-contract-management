const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const userModel = require("../models/userModel");
const { AppError } = require("../utils/appError");

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new AppError("Unauthorized", 401);
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await userModel.findById(payload.id);

    if (!user || !user.is_active) {
      throw new AppError("Unauthorized", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new AppError("Unauthorized", 401));
  }
}

module.exports = { authMiddleware };

