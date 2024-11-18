import "./TaskManager.css";

import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]); 
  const [newTask, setNewTask] = useState({ title: "", description: "" }); 
  const [editTask, setEditTask] = useState(null); 

  // Fetch tasks when the component loads
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!newTask.title || !newTask.description) {
      alert("Please fill in both Title and Description.");
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/tasks", newTask);
      setNewTask({ title: "", description: "" }); 
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Update an existing task
  const updateTask = async () => {
    if (!editTask || !editTask.title || !editTask.description) {
      alert("Please fill in both Title and Description for the task.");
      return;
    }
    try {
      await axios.put(`http://localhost:3000/api/tasks/${editTask.id}`, editTask);
      setEditTask(null); 
      fetchTasks(); 
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`);
      fetchTasks(); 
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h3>{editTask ? "Edit Task" : "Add Task"}</h3>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Title"
          value={editTask ? editTask.title : newTask.title}
          onChange={(e) =>
            editTask
              ? setEditTask({ ...editTask, title: e.target.value })
              : setNewTask({ ...newTask, title: e.target.value })
          }
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={editTask ? editTask.description : newTask.description}
          onChange={(e) =>
            editTask
              ? setEditTask({ ...editTask, description: e.target.value })
              : setNewTask({ ...newTask, description: e.target.value })
          }
        ></textarea>
        <button
          className="btn btn-primary"
          onClick={editTask ? updateTask : addTask}
        >
          {editTask ? "Update Task" : "Add Task"}
        </button>
        {editTask && (
          <button
            className="btn btn-secondary ml-3"
            onClick={() => setEditTask(null)}
          >
            Cancel
          </button>
        )}
      </div>

      <h3>Task List</h3>
      <ul className="list-group">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{task.title}</strong>
              <p>{task.description}</p>
            </div>
            <div>
              <button
                className="btn btn-info btn-sm mr-2"
                onClick={() => setEditTask(task)} 
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm ml-2"
                onClick={() => deleteTask(task.id)} >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;


