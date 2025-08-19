const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Users page (not used in To-Do app)");
});

module.exports = router;
