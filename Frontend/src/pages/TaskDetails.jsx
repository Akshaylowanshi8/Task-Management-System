import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./css/TaskDetails.css"
const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await API.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        console.error("Failed to fetch task:", err);
      }
    };
    fetchTask();
  }, [id]);

  if (!task) return <p className="loading">Loading...</p>;

  return (
    <div className="task-details-container">
      <div className={`task-card priority-${task.priority}`}>
        <h2 className="task-title">{task.title}</h2>
        <p className="task-desc">{task.description}</p>

        <div className="task-meta">
          <span className={`status ${task.status.toLowerCase()}`}>
            {task.status}
          </span>
          <span className="due-date">
            Due: {new Date(task.dueDate).toDateString()}
          </span>
        </div>

        <div className="priority-label">Priority: {task.priority}</div>

        <div className="task-actions">
          <button className="btn back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <button
            className="btn edit"
            onClick={() => navigate(`/tasks/edit/${task._id}`)}
          >
            Edit Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
