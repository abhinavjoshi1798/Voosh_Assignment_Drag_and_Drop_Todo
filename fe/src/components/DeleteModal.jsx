import axios from 'axios';
import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DeleteModal({ show, 
  todoId, 
  token, 
  handleCloseDeleteModal,
  onDeleteStart,
  onDeleteEnd,
  loading }) {
    // const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)
  const handleDeleteTodo = async () => {
    try {
        // setLoading(true)
        onDeleteStart(todoId)
      
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/todo/deletetodo/${todoId}`, {
            headers: {
            Authorization: token
        }
    }
      );
      if (response.status === 200) {
        // setLoading(false);
        onDeleteEnd(todoId); 
        handleCloseDeleteModal()
      
      }
     
      
    } catch (error) {
        setError(true)
        // setLoading(false)
        onDeleteEnd(todoId); 
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <Modal show={show} 
    // onHide={() => handleCloseDeleteModal()}
    
    onHide={handleCloseDeleteModal}>
      <Modal.Header closeButton>
        <Modal.Title>Deleting Todo...!</Modal.Title>
      </Modal.Header>

      <Modal.Body>
      {error && <Alert variant="danger">{error}</Alert>}
        <p>Are you sure you want to delete this todo? This action cannot be undone.</p> 
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseDeleteModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleDeleteTodo}
        disabled={loading}>
           {loading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
