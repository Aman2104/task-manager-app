import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [taskIdToUpdate, setTaskIdToUpdate] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks/');
      const data = await response.json();

      setTasks(data.tasks);
      setIsEmpty(data.tasks.length === 0);
      setLoading(false);
      console.log(data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setLoading(false);
      showAlert('error', 'Failed to fetch tasks');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/task/${taskIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        showAlert('error', data.error);
      } else {
        showAlert('success', data.success);
      }
      console.log(data);
      getData();
    } catch (error) {
      console.error('Failed to delete task:', error);
      showAlert('error', 'Failed to delete task');
    } finally {
      setTaskIdToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/task/${taskIdToUpdate}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Completed' }),
      });

      const data = await response.json();
      if (!response.ok) {
        showAlert('error', data.error);
      } else {
        showAlert('success', data.success);
      }
      console.log(data);
      getData();
    } catch (error) {
      console.error('Failed to update task:', error);
      showAlert('error', 'Failed to update task');
    } finally {
      setTaskIdToUpdate(null);
      setShowStatusConfirm(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const handleDeleteConfirm = (taskId) => {
    setTaskIdToDelete(taskId);
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setTaskIdToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleStatusConfirm = (taskId) => {
    setTaskIdToUpdate(taskId);
    setShowStatusConfirm(true);
  };

  const handleCloseStatusConfirm = () => {
    setTaskIdToUpdate(null);
    setShowStatusConfirm(false);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="container">
      <h1 className="text-center">TaskList</h1>
      {!isEmpty ? (
        <div className="d-flex flex-wrap justify-content-center">
          {tasks.map((task) => (
            <div key={task._id} className="card mb-3 col-md-3">
              <div className="card-body">
                <h5 className="card-title">{task.title}</h5>
                <p className="card-text">{task.description}</p>
                <p className="card-text">Status: {task.status}</p>
                <p className="card-text">AssignedUser: {task.assignedUser}</p>
                <p className="card-text">Due Date: {formatDate(task.dueDate)}</p>
                <div className="d-flex flex-wrap">
                  <button className="btn btn-danger" onClick={() => handleDeleteConfirm(task._id)}>
                    Delete
                  </button>
                  {task.status !== 'Completed' && task.status !== 'completed' && (
                    <button className="btn btn-primary" onClick={() => handleStatusConfirm(task._id)}>
                      Mark as Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center danger">There is no data to display</div>
      )}

      {isLoading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {alert && (
        <div className={`alert alert-${alert.type} position-absolute top-50 start-50 translate-middle`} role="alert">
          {alert.message}
        </div>
      )}

      <Modal show={showDeleteConfirm} onHide={handleCloseDeleteConfirm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteConfirm}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showStatusConfirm} onHide={handleCloseStatusConfirm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Status Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to update the status of this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStatusConfirm}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStatusChange}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TaskList;
