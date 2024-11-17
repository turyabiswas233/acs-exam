const dotenv = require("dotenv");
const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const cors = require("cors");
const resultRoute = require("./route/result.rote.js");
const authRoute = require("./route/auth.route.js"); // const the = require route
const userRouter = require("./route/user.route.js"); // Import the auth route
const {
  updateUser,
  updateHSC,
  updateSSC,
} = require("./route/updateuser.route.js"); // Import the auth route
// Import the admin route
const adminAuth = require("./route/admin/auth.route.js");
const adminInfo = require("./route/admin/user.route.js");
const adminUsersRoute = require("./route/admin/users.route.js");
const adminRole = require("./route/admin/role.route.js");
const adminLeaderboard = require("./route/admin/leaderboard.route.js");
// Import the exam routes
const questionRouter = require("./route/questions.route.js");
const examRouter = require("./route/admin/exam.route.js");
const publicExamRouter = require("./route/exam/exam.route.js");
const leaderboardRouter = require("./route/exam/leaderboard.route.js");
const analysis = require("./route/admin/analysis.route.js");

// image upload routes
const uploadRouter = require("./route/exam/uploadImage.route.js");

dotenv.config({ path: [".env", ".env.local"] });

const app = express();
const PORT = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI;
const BASE_URL = process.env.BASE_URL.split(",");

// Connect to MongoDB
mongoose
  .connect(URI)
  .then(() => console.log("Connected to MongoDB server"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });
// Define the rate limit rule
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 5 minutes",
});

app.use(limiter);
app.use(
  cors({
    origin: [...BASE_URL],
    methods: ["POST", "GET", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);
app.use(express.json({ limit: "20kb" }));

// API Routes
app.use("/api/result", resultRoute);
app.use("/api/auth/signup", authRoute); // Use the auth route
app.use("/api/user", userRouter); // Use the USER route
app.use("/api/user/update", updateUser); // Use the USER route
app.use("/api/user/update", updateHSC); // Use the USER/HSC route
app.use("/api/user/update", updateSSC); // Use the USER/SSC route
// app.use("/api/questions", questionRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/live-exam", publicExamRouter);

//admin request
app.use("/sadmin/adminRole", adminRole);
app.use("/sadmin/auth/signup", adminAuth);
app.use("/sadmin/auth/signin", adminInfo);
app.use("/sadmin/sudo", adminUsersRoute);
app.use("/sadmin/leaderboard", adminLeaderboard);
app.use("/sadmin/exam", examRouter);
app.use("/analysis", analysis);

// image upload

app.use("/api/file", uploadRouter);

//never touch it
// if (process.env.NODE_ENV == "production") {
//   app.use(express.static("./output"));
//   app.get("/*", async (req, res) => {
//     res.sendFile(path.resolve("output", "index.html"));
//   });
// }

app.get("/", async (req, res) => {
  res.status(200).send({
    data:
      "server connected and working well, baseurl-length:" + BASE_URL.length,
  });
});

// Start the server
app.listen(PORT, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
  } else {
    console.log(`Server is running on http://localhost:${PORT}`);
  }
  console.log(BASE_URL);
});
