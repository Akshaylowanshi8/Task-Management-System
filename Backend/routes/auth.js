const express = require("express");
const router = express.Router();
const { register, login, getMe ,getUsers} = require("../Controllers/auth.controller");
const auth = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.get("/list", auth, getUsers);
module.exports = router;
