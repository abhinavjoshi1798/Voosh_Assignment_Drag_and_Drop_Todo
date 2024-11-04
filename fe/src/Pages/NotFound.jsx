import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className='min-vh-100 d-flex justify-content-center align-items-center flex-column'>
      <img src="/images/404.svg" className='img-fluid' style={{width:"500px",height:"500px"}}
      alt="404 image" />
      <Link to="/login"><Button className='btn-primary'>Login</Button></Link> 
    </div>
  )
}

export default NotFound
