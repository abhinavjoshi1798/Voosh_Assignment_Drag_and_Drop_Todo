import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Button, Form, FormControl, Spinner } from "react-bootstrap";
import CreateTodoModal from "../components/CreateTodoModal";
import axios from "axios";
import { Todo } from "../components/Todo";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EditTodoModal from "../components/EditTodoModal";
import DeleteModal from "../components/DeleteModal";
import ViewTodoModal from "../components/ViewTodoModal";

function Dashboard() {
  const { token, user, logout } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editTodo, setEditTodo] = useState({});

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState(null);

  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [done, setDone] = useState([]);

  const [isLoading, setIsLoading] = useState(false); // Loading state for drag-and-drop

  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [selectedType, setSelectedType] = useState("");

  const [viewtodo, setViewTodo] = useState(null);
  const [showViewTodoModal, setShowViewTodoModal] = useState(false);

  const [viewLoadingId, setViewLoadingId] = useState(null);
  const [editLoadingId, setEditLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});

  const handleShowModal = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
    fetchData(); // Refresh tasks after adding a new one
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    fetchData();
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/todo/gettodo`,
        {
          headers: { Authorization: token },
        }
      );
      setTodos(response?.data?.todos?.todo);
      setInProgress(response?.data?.todos?.in_progress);
      setDone(response?.data?.todos?.done);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const updateTodoStatus = async (todoId, newStatus) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/todo/updatetodo/${todoId}`,
        { status: newStatus },
        {
          headers: { Authorization: token },
        }
      );
      if (response.status === 200) {
        setIsLoading(false);
        fetchData(); // Refresh the lists after updating the status
      }
    } catch (error) {
      console.error("Error updating todo status:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDragEnd = (result) => {
    if (isLoading) return; // Prevent drag-and-drop while loading
    const { destination, source } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    let movedItem;
    let active = Array.from(todos);
    let doing = Array.from(inProgress);
    let complete = Array.from(done);

    // Remove from source
    if (source.droppableId === "TodosList") {
      movedItem = active[source.index];
      active?.splice(source.index, 1);
    } else if (source.droppableId === "DoingList") {
      movedItem = doing[source.index];
      doing?.splice(source.index, 1);
    } else {
      movedItem = complete[source.index];
      complete?.splice(source.index, 1);
    }

    // Add to destination
    if (destination.droppableId === "TodosList") {
      active?.splice(destination.index, 0, movedItem);
      updateTodoStatus(movedItem._id, "todo");
    } else if (destination.droppableId === "DoingList") {
      doing?.splice(destination.index, 0, movedItem);
      updateTodoStatus(movedItem._id, "in_progress");
    } else {
      complete?.splice(destination.index, 0, movedItem);
      updateTodoStatus(movedItem._id, "done");
    }

    setTodos(active);
    setInProgress(doing);
    setDone(complete);
  };

  const handleEdit = async (id) => {
    setEditLoading(true);
    setEditLoadingId(id);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/todo/getsingletodo/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      setEditTodo(response.data.todo);
      setEditLoading(false);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching singletodo/id :", error);
      setEditLoading(false);
    }
    setEditLoadingId(null);
  };

  const handleDelete = (id) => {
    setDeleteTodoId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteStart = (id) => {
    setDeleteLoading((prev) => ({ ...prev, [id]: true }));
  };

  const handleDeleteEnd = (id) => {
    setDeleteLoading((prev) => ({ ...prev, [id]: false }));
    fetchData();
  };

  // const handleCloseDeleteModal = (id) => {

  //   setShowDeleteModal(false);
  //   fetchData();
  // };

  const handleView = async (id) => {
    try {
      setViewLoadingId(id);
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/todo/getsingletodo/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      if (response.status === 200) {
        setViewTodo(response.data.todo);
        setShowViewTodoModal(true);
        setIsLoading(false);
        setViewLoadingId(null);
      }
    } catch (error) {
      console.error("Error fetching singletodo/id in handleView:", error);
      setViewLoadingId(null);
      setIsLoading(false);
    }
  };

  const fetchSearchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/todo/search?q=${searchQuery}`,
        {
          headers: { Authorization: token },
        }
      );
      if (response.status === 200) {
        setIsLoading(false);

        setTodos(response?.data?.todos?.todo);
        setInProgress(response?.data?.todos?.in_progress);
        setDone(response?.data?.todos?.done);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setIsLoading(false);
    }
  };

  const debounceSearchData = useCallback(() => {
    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      fetchSearchData();
    }, 500);

    setSearchTimeout(timeout);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debounceSearchData();
  };

  const handleSelectChange = async (event) => {
    try {
      setSelectedType(event.target.value);
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/todo/sorteddata?sortBy=${selectedType}`,
        { headers: { Authorization: token } }
      );
      if (response.status === 200) {
        setTodos(response?.data?.todos?.todo);
        setInProgress(response?.data?.todos?.in_progress);
        setDone(response?.data?.todos?.done);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setIsLoading(false);
    }
  };

  const handleCloseViewTodoModal = () => {
    setShowViewTodoModal(false);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Navbar user={user} logout={logout} />

        {/* Add Todo Button */}
        <div className="container d-flex justify-content-between align-items-center">
          <Button
            style={{ margin: "10px", background: "#3374f5" }}
            onClick={handleShowModal}
            disabled={isLoading} // Disable button when loading
          >
            Add Task
          </Button>
          {/* Loading Spinner */}
          {isLoading && (
            <span>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </span>
          )}
        </div>

        <div
          className="container 
        d-flex 
        flex-column flex-md-row 
        justify-content-between"
        >
          <FormControl
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginBottom: "10px", maxWidth: "200px" }}
          />

          <Form.Group
            controlId="typeSelect"
            className="d-flex justify-content-around align-items-center"
          >
            <Form.Label className="mt-2 mx-2">Sort By</Form.Label>
            <Form.Select
              value={selectedType}
              onChange={handleSelectChange}
              aria-label="Select task type"
              style={{ width: "210px" }}
            >
              <option value="">Choose Sorting Order</option>{" "}
              {/* Placeholder option */}
              <option value="recent">Recent</option>
              <option value="earlier">Earlier</option>
            </Form.Select>
          </Form.Group>
        </div>

        {/* {JSON.stringify(token)}  */}

        <CreateTodoModal
          show={showModal}
          handleClose={handleCloseModal}
          token={token}
        />

        <div className="container">
          <div className="row">
            <Droppable droppableId="TodosList" isDropDisabled={isLoading}>
              {(provided) => (
                <div
                  className="col-lg-4 col-md-6 col-12 todoColumnContainer"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="container gridColumnHeading">
                    <h5>Todo</h5>
                  </div>
                  {todos?.map((el, index) => (
                    <Draggable
                      key={el._id}
                      draggableId={el._id}
                      index={index}
                      isDragDisabled={isLoading}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Todo
                            todo={el}
                            handleEdit={() => handleEdit(el._id)}
                            handleView={() => handleView(el._id)}
                            handleDelete={() => handleDelete(el._id)}
                            // editLoading={editLoading}
                            loading={isLoading}
                            editLoading={editLoadingId === el._id}
                            viewLoading={viewLoadingId === el._id} // Pass specific loading state
                            deleteLoading={deleteLoadingId === el._id}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Droppable droppableId="DoingList" isDropDisabled={isLoading}>
              {(provided) => (
                <div
                  className="col-lg-4 col-md-6 col-12 todoColumnContainer"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="container gridColumnHeading">
                    <h5>In Progress</h5>
                  </div>
                  {inProgress?.map((el, index) => (
                    <Draggable
                      key={el._id}
                      draggableId={el._id}
                      index={index}
                      isDragDisabled={isLoading}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Todo
                            // editLoading={editLoading}
                            loading={isLoading}
                            todo={el}
                            handleEdit={() => handleEdit(el._id)}
                            handleView={() => handleView(el._id)}
                            handleDelete={() => handleDelete(el._id)}
                            editLoading={editLoadingId === el._id}
                            viewLoading={viewLoadingId === el._id} // Pass specific loading state
                            deleteLoading={deleteLoadingId === el._id}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Droppable droppableId="DoneList" isDropDisabled={isLoading}>
              {(provided) => (
                <div
                  className="col-lg-4 col-md-6 col-12 todoColumnContainer"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="container gridColumnHeading">
                    <h5>Done</h5>
                  </div>
                  {done?.map((el, index) => (
                    <Draggable
                      key={el._id}
                      draggableId={el._id}
                      index={index}
                      isDragDisabled={isLoading}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Todo
                            todo={el}
                            handleEdit={() => handleEdit(el._id)}
                            handleView={() => handleView(el._id)}
                            handleDelete={() => handleDelete(el._id)}
                            // editLoading={editLoading}
                            loading={isLoading}
                            editLoading={editLoadingId === el._id}
                            viewLoading={viewLoadingId === el._id} // Pass specific loading state
                            deleteLoading={deleteLoadingId === el._id}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>

        <EditTodoModal
          show={showEditModal}
          token={token}
          editTodo={editTodo}
          handleCloseEditModal={handleCloseEditModal}
        />

        <DeleteModal
          show={showDeleteModal}
          handleCloseDeleteModal={() => setShowDeleteModal(false)}
          todoId={deleteTodoId}
          token={token}
          onDeleteStart={handleDeleteStart}
          onDeleteEnd={handleDeleteEnd}
          loading={deleteLoading[deleteTodoId]}
        />

        <ViewTodoModal
          todo={viewtodo}
          show={showViewTodoModal}
          handleClose={handleCloseViewTodoModal}
        />
      </DragDropContext>
    </>
  );
}

export default Dashboard;
