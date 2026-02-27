require("dotenv").config(); // MUST be first

const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/Db");


const app = express();
const PORT = process.env.PORT || 5000;
const reviewRoutes = require("./routes/reviewroutes");
const router = require("./routes/reviewroutes");
const authmiddleware = require("./middleware/authmiddleware");

// Middlewares
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Database
connectDB();

app.use("/api/auth", require("./routes/authroutes"))
app.use("/api/partners", require("./routes/Partnerroutes"));
//review
app.use("/api/reviews", reviewRoutes);
app.use("/api/bookings", require("./routes/bookingroutes"));
app.use("/api/admin", require("./routes/Adminroutes"));

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Server & MongoDB running");
});


app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

