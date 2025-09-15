import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  
import API from "../api/axios";
import "./css/CreateTask.css";

const CreateTask = () => {
    const navigate = useNavigate(); 
    const [form, setForm] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "Low",
        assignedTo: "",
    });

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await API.get("auth/list");
                setUsers(res.data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/tasks", form);
            alert("Task created successfully!");
            setForm({
                title: "",
                description: "",
                dueDate: "",
                priority: "Low",
                assignedTo: "",
            });
            navigate("/dashboard"); 
        } catch (error) {
            alert("Failed to create task!");
        }
    };

    return (
        <form className="task-form" onSubmit={ handleSubmit }>
            <h2>Create Task</h2>

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
                placeholder="dueDate"
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

            <div className="task-buttons">
                <button
                    type="button"
                    className="btn back"
                    onClick={ () => navigate(-1) }
                >
                    ← Back
                </button>
                <button type="submit">Create Task</button>

            </div>
        </form>
    );
};

export default CreateTask;
