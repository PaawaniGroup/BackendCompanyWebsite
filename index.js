const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const careerRouter = require("./routes/career");
const contactRouter = require("./routes/contact");
const jobRouter = require("./routes/jobRoutes");
dotenv.config();

const app = express();

app.use(cors());
app.use("/api", careerRouter); //data handled directly by multer

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const dbURI = process.env.uri;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

app.use("/api", jobRouter);
app.use("/api", contactRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server Started! on port ${process.env.PORT}`);
});
