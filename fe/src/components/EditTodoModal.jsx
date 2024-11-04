import React, { useEffect, useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import TodoForm from "./CreateTodoForm.jsx";
import axios from "axios";
import EditTodoForm from "./EditTodoForm.jsx";

const EditTodoModal = ({ show, token, editTodo, handleCloseEditModal }) => {
  const [todo, setTodo] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTodo({
      title: editTodo?.title || "",
      description: editTodo?.description || "",
      status: editTodo?.status || "todo",
    });
  }, [editTodo]);

  const handleEditTask = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/todo/updatetodo/${editTodo?._id}`,
        {"title":todo?.title,
            "description":todo?.description,
            "status":todo?.status
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        setLoading(false);
        setTodo({ title: "", description: "", status: "todo" });
       handleCloseEditModal(); // Close the modal after successful creation
      }
    } catch (err) {
      setLoading(false);
      setError(
        err.response.data.error
          ? err.response.data.error
          : "An error occurred. Please try again."
      );
    }
  };

  const handleInputChange = (field, value) => {
    setTodo({ ...todo, [field]: value });
  };

  const resetModalState = () => {
    setError(null);
    setLoading(false);
    setTodo({ title: "", description: "", status: "" });
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        handleCloseEditModal();
        resetModalState(); // Reset state on close
      }}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <EditTodoForm
          title={todo?.title}
          setTitle={(value) => handleInputChange("title", value)}
          description={todo?.description}
          setDescription={(value) => handleInputChange("description", value)}
          status={todo?.status}
          setStatus={(value)=>handleInputChange("status",value)}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            handleCloseEditModal();
            resetModalState();
          }}
          disabled={loading}
        >
          Close
        </Button>

        <Button variant="primary" onClick={handleEditTask} disabled={loading}>
          {loading ? "Editing..." : "Edit Task"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditTodoModal;
