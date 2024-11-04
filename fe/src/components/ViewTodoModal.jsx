import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ViewTodoModal({todo,show,handleClose}) {
  
    return (
        
      <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Task Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{height:"60vh"}}>
        <h5 >{todo?.title}</h5>
        <p style={{color:"#71717a"}}>{todo?.description}</p>
        <p style={{color:"#a1a1aa"}}>Created at: {todo?.created_at}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
        
      </Modal.Footer>
    </Modal>
       
  )
}

export default ViewTodoModal
