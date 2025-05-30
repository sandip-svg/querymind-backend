import rateLimit from "express-rate-limit";

// 1. For authentication endpoints (login/register)
export const authRateLimiter =  rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: "Too many login attempts, please try again later",
  standardHeaders: true,
});

// 2. For email-related endpoints (verification/password reset)
export const emailRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour
  message: "Too many email requests, please try again later",
});

// 3. For password reset endpoints
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2, // Limit each IP to 2 requests per window
  message: "Too many password reset requests, please try again later",
});

// 4. Global API limiter (optional)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
