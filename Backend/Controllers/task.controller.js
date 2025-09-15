const Task = require("../models/Task");


const createTask = async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            createdBy: req.user.id, 
        });
        res.json(task);
    } catch (err) {
        console.error("Error creating task:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

const getTasks = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user.id;  
        const isAdmin = req.user.role === 'admin'; 

        let query = {};
        if (!isAdmin) {
            query.assignedTo = userId;
        }

        const tasks = await Task.find(query)
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email")
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const count = await Task.countDocuments(query);
        res.json({ tasks, total: count });
    } catch (err) {
        console.error("Error fetching tasks:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};



const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email");
        if (!task) return res.status(404).json({ msg: "Task not found" });
        res.json(task);
    } catch (err) {
        console.error("Error fetching task:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!task) return res.status(404).json({ msg: "Task not found" });
        res.json(task);
    } catch (err) {
        console.error("Error updating task:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ msg: "Task not found" });
        res.json({ msg: "Task deleted successfully" });
    } catch (err) {
        console.error("Error deleting task:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
