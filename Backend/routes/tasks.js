const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../Controllers/task.controller.js");
const auth = require("../middlewares/auth"); 

router.post("/", auth, createTask);        
router.get("/", auth, getTasks);           
router.get("/:id", auth, getTaskById);     
router.put("/:id", auth, updateTask);      
router.delete("/:id", auth, deleteTask);  

module.exports = router;
