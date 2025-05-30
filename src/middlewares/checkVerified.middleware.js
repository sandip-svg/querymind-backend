import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const checkVerified = asyncHandler(async (req, _, next) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!req.user.verified) {
    throw new ApiError(
      403,
      "Please verify your email before accessing this resource"
    );
  }

  next();
});
