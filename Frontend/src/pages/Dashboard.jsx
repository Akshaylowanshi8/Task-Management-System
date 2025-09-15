import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import "./css/Dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); 
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const fetchTasks = async (pageNumber = 1) => {
    try {
      const res = await API.get(`/tasks?page=${pageNumber}&limit=${limit}`);
      setTasks(res.data.tasks);
      setTotalPages(Math.ceil(res.data.total / limit)); 
      setPage(pageNumber);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleStatusChange = (taskId, status) => {
    API.put(`/tasks/${taskId}`, { status })
      .then(() => fetchTasks(page)) 
      .catch(err => console.error("Failed to update status:", err));
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      API.delete(`/tasks/${taskId}`)
        .then(() => fetchTasks(page)) 
        .catch(err => console.error("Failed to delete task:", err));
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, { username || "User" }</h2>

        <div className="header-actions">
          { role === "admin" && (
            <>
              <button
                onClick={ () => navigate("/create-task") }
                className="btn btn-blue"
              >
                + Create Task
              </button>
              <button
                onClick={ () => navigate("/register") }
                className="btn btn-green"
              >
                + Add User
              </button>
            </>
          ) }
          <button onClick={ handleLogout } className="btn btn-red">
            Logout
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Due Date</th>
              { role === "admin" ? <th>Assigned To</th> : <th>Created By</th> }
              <th>Status</th>
              { role === "admin" && <th className="text-center">Actions</th> }
            </tr>
          </thead>
          <tbody>
            { tasks.length > 0 ? (
              tasks.map((t) => (
                <tr key={ t._id }>
                  <td>
                    <Link to={ `/tasks/${t._id}` } className="task-link">
                      { t.title }
                    </Link>
                  </td>
                  <td>
                    <span className={ `badge priority-${t.priority.toLowerCase()}` }>
                      { t.priority }
                    </span>
                  </td>
                  <td>{ new Date(t.dueDate).toDateString() }</td>
                  { role === "admin" ? (
                    <td>{ t.assignedTo?.username || "Unassigned" }</td>
                  ) : (
                    <td>{ t.createdBy?.username || "Admin" }</td>
                  ) }
                  <td>
                    { role === "user" ? (
                      <select
                        value={ t.status }
                        onChange={ e => handleStatusChange(t._id, e.target.value) }
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      <span className={ `badge status-${t.status.toLowerCase()}` }>
                        { t.status }
                      </span>
                    ) }
                  </td>

                  { role === "admin" && (
                    <td className="text-center">
                      <button
                        onClick={ () => navigate(`/tasks/edit/${t._id}`) }
                        className="btn btn-indigo"
                      >
                        Edit
                      </button>
                      <button
                        onClick={ () => handleDeleteTask(t._id) }
                        className="btn btn-red"
                      >
                        Delete
                      </button>
                    </td>
                  ) }
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No tasks available
                </td>
              </tr>
            ) }
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={ () => fetchTasks(page - 1) }
          disabled={ page === 1 }
        >
          Previous
        </button>
        <span>Page { page } of { totalPages }</span>
        <button
          onClick={ () => fetchTasks(page + 1) }
          disabled={ page === totalPages }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
