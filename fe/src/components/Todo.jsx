import React from 'react'
import { Button } from 'react-bootstrap'

export const Todo = ({todo,handleEdit, handleDelete, handleView, editLoading,loading, viewLoading, deleteLoading}) => {
 
  return (
    <div className='container todo'>
      <div>
      <h6>{todo?.title}</h6>
      <p>{todo?.description}</p>
      </div>
     
      <div className="footer">
        <p>Created at : {todo?.created_at}</p>
        <div className='btnContainer'>
         
          <Button variant="danger" className='mx-1'
          onClick={() => handleDelete(todo._id)} disabled={deleteLoading}>Delete</Button>
          <Button className='editBtn mx-1' 
          onClick={() => handleEdit(todo._id)}
          disabled={editLoading} >{editLoading ? "Loading..." : "Edit"}</Button>
          <Button variant="primary" className='mx-1'
          onClick={() => handleView(todo._id)} disabled={viewLoading}>{viewLoading?"Loading":"View Details"}</Button>
         
        </div>
      </div>
    </div>
  )
}
