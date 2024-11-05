require("dotenv").config();
require("express-async-errors");

//express
const express = require("express");
const app = express();

//rest of packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const uploadfile = require("express-fileupload");

//securety packages
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");

// Data Base Connection
const connecDB = require("./db/connect");

//routes
const authRoute = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRouter");
const orderRouter = require("./routes/orderRouter");

// middlewares
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(uploadfile());
app.use(express.static("./public"));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

//middleware
app.use(notFound);
app.use(errorHandler);

//setting the server
const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;
const start = async () => {
  try {
    await connecDB(uri);
    app.listen(port, () => {
      console.log(`The server is listenning to the port ${port} ...`);
    });
  } catch (error) {
    console.error("Setup failed:", error);
    process.exit(1); // Gracefully shutting down
  }
};
start();
