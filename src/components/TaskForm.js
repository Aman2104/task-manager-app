import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TokenContext } from '../App';

const TaskForm = () => {
  const token= useContext(TokenContext)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [users, setUsers] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch('http://localhost:5000/api/task/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token':token,
        },
        body: JSON.stringify({ title, description, dueDate, status, assignedUser }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        showAlert('error', data.error);
      } else {
        showAlert('success', data.success);
        setDescription('');
        setTitle('');
        setStatus('');
      }
    } catch (error) {
      setLoading(false);
      showAlert('error', error.message);
    }
  };

  const getUsers=async()=>{
    try{
      const response = await fetch('http://localhost:5000/api/users/')
      if(response.ok){
        const data = await response.json();
        console.log(data);
        setUsers(data.users);
      }
    }catch(error){
      console.error(error)
    }

  }

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };
  useEffect(() => {
    getUsers()
  }, [])
  

  return (
    <div className="mt-2 container myContainer p-3">
      <h2 className="mt-2 text-center">Add Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <input
            type="text"
            className="form-control"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="DueDate" className="form-label">
            Due date
          </label>
          <input
            type="date"
            className="form-control"
            id="DueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <label htmlFor="users">User</label>
        <select
          id="user"
          value={assignedUser}
          onChange={(e) => setAssignedUser(e.target.value)}
        >
          <option value="">Select User</option>
          {users &&
            users.map((t) => (
              <option key={t._id} value={t.username}>
                {t.username}
              </option>
            ))}
        </select>
        <div className="d-grid">
          <button type="submit" className="d-block btn btn-primary mb-3">
            Add Task
          </button>
          {isLoading && (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </form>
      {alert && (
        <div className={`alert alert-${alert.type} position-absolute top-50 start-50 translate-middle-x`} role="alert">
          {alert.message}
        </div>
      )}
    </div>
  );
};

export default TaskForm;
