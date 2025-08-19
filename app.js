const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// Set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Error handler
app.use((req, res) => {
  res.status(404).render("error", { message: "Page Not Found" });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
