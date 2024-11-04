import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import TodoForm from './CreateTodoForm.jsx';
import axios from 'axios';

const CreateTodoModal = ({ show, handleClose, token }) => {
    const [todo, setTodo] = useState({ title: "", description: "" ,status:"todo"});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreateTask = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/todo/createtodo`, todo, {
                headers: {
                    Authorization: token
                }
            });
            
            if (response.status === 200) {
                setLoading(false);
                setTodo({title: "", description: "" ,status:"todo"})
                handleClose(); // Close the modal after successful creation
            }
        } catch (err) {
            setLoading(false);
            setError(err.response.data.error ? err.response.data.error : 'An error occurred. Please try again.');
        }
    };
  
    const handleInputChange = (field, value) => {
        setTodo({ ...todo, [field]: value });
    };

    const resetModalState = () => {
        setError(null);
        setLoading(false);
        setTodo({ title: "", description: "", status: "todo" });
    };

    return (
        <Modal show={show}  onHide={() => {
            handleClose();
            resetModalState(); // Reset state on close
        }}  backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Add New Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <TodoForm 
                    title={todo?.title} 
                    setTitle={(value) => handleInputChange('title', value)} 
                    description={todo?.description} 
                    setDescription={(value) => handleInputChange('description', value)} 
                />
            </Modal.Body>
           
            <Modal.Footer>
                <Button variant="secondary" onClick={()=>{handleClose();
                   resetModalState();
                }}
                disabled={loading}>
                    Close
                </Button>

                <Button variant="primary" 
                onClick={handleCreateTask} 
                disabled={loading}>
                    {loading ? 'Creating...' : 'Create Task'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateTodoModal;
