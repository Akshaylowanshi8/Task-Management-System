import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./css/CreateTask.css"; // reuse same CSS

const UpdateTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "Low",
        assignedTo: "",
        status: "pending",  
    });

    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await API.get(`/tasks/${id}`);
                setForm({
                    title: res.data.title,
                    description: res.data.description,
                    dueDate: res.data.dueDate?.split("T")[0] || "",
                    priority: res.data.priority,
                    assignedTo: res.data.assignedTo?._id || res.data.assignedTo || "",
                    status: res.data.status || "pending", 
                });
            } catch (error) {
                console.error("Failed to fetch task:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const res = await API.get("auth/list");
                setUsers(res.data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchTask();
        fetchUsers();
    }, [id]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/tasks/${id}`, form);
            alert("Task updated successfully!");
            navigate("/dashboard");
        } catch (error) {
            alert("Failed to update task!");
        }
    };

    return (
        <form className="task-form" onSubmit={ handleSubmit }>
            <h2>Update Task</h2>

            <input
                name="title"
                placeholder="Task Title"
                value={ form.title }
                onChange={ handleChange }
                required
            />

            <textarea
                name="description"
                placeholder="Task Description"
                value={ form.description }
                onChange={ handleChange }
                rows="4"
            ></textarea>

            <input
                type="date"
                name="dueDate"
                value={ form.dueDate }
                onChange={ handleChange }
            />

            <select name="priority" value={ form.priority } onChange={ handleChange }>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
            </select>

            <select
                name="assignedTo"
                value={ form.assignedTo }
                onChange={ handleChange }
                required
            >
                <option value="">Select User</option>
                { users.map((user) => (
                    <option key={ user._id } value={ user._id }>
                        { user.username || user.email }
                    </option>
                )) }
            </select>

            <select
                name="status"
                value={ form.status }
                onChange={ handleChange }
                required
            >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>

            <div className="task-buttons">
                <button
                    type="button"
                    className="btn back"
                    onClick={ () => navigate(-1) }
                >
                    ← Back
                </button>
                <button type="submit">Update Task</button>
            </div>
        </form>
    );
};

export default UpdateTask;
