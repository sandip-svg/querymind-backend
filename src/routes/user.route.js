import { Router } from "express";
import { verifyJWt } from "../middlewares/auth.middleware.js";
import { checkVerified } from "../middlewares/checkVerified.middleware.js";
import {
  emailRateLimiter,
  authRateLimiter,
  passwordResetLimiter,
  apiLimiter,
} from "../middlewares/rateLimit.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrntPassword,
  getCurrentUser,
  verifyEmail,
  resetPassword,
  forgetPassword,
} from "../controllers/user.controller.js";

const router = Router();

// Apply global API limiter to all routes (optional but recommended)
router.use(apiLimiter);

// Public routes with specific rate limits
router.route("/register").post(authRateLimiter, registerUser);
router.route("/login").post(authRateLimiter, loginUser);
router.route("/verify-email/:token").get(emailRateLimiter, verifyEmail);
router.route("/forget-password").post(passwordResetLimiter, forgetPassword);
router
  .route("/reset-password/:token")
  .post(passwordResetLimiter, resetPassword);

// Authenticated routes (don't need rate limiting)
router.route("/logout").post(verifyJWt, checkVerified, logoutUser);
router.route("/refresh-token").post(verifyJWt, refreshAccessToken);
router
  .route("/change-password")
  .post(verifyJWt, checkVerified, changeCurrntPassword);
router.route("/current-user").get(verifyJWt, checkVerified, getCurrentUser);

export default router;
