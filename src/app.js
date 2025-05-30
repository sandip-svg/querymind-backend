import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);


app.use(helmet());
app.use(
  helmet.hsts({
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// import route
import userRouter from "./routes/user.route.js";
import conversationRouter from "./routes/conversation.route.js";
import messageRouter from "./routes/message.route.js";

//user routes declaration
app.use("/api/v1/users", userRouter);

//conversation routes declaration
app.use("/api/v1/conversations", conversationRouter);

//message routes declaration
app.use("/api/v1/messages", messageRouter);

export default app;
