import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaNotesMedical } from "react-icons/fa";
import { Dropdown } from 'react-bootstrap';

const CustomNavbar = ({ user, logout }) => {
  const customImageUrl = (user) => {
    if (user?.profile_image?.startsWith("https")) {
      return user.profile_image;
    } else {
      const baseUrl = process.env.REACT_APP_BACKEND_URL.replace("/api", "");
      return `${baseUrl}/images/${user.profile_image}`;
    }
  }


  return (
    <Navbar style={{ backgroundColor: '#3374f5', color: 'white' }} variant="dark">
      <Container className="d-flex justify-content-between flex-column flex-md-row">
        
        {/* Left Part - Icon and Title */}
        <Navbar.Brand className="d-flex align-items-center mb-2 mb-md-0">
          <FaNotesMedical style={{ marginRight: '10px' }} />
          <span>Task Management App</span>
        </Navbar.Brand>
        
        {/* Right Part - User Name, Image, and Dropdown */}
        <Nav className="d-flex align-items-center">
          <Dropdown align="end">
            <Dropdown.Toggle as="div" className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
              <span style={{ marginRight: '10px', color: 'white' }}>{user?.name}</span>
              <img 
                src={customImageUrl(user)} 
                alt="user-profile" 
                width="40px" 
                height="40px" 
                style={{ borderRadius: '50%' }} 
                className="img-fluid"
                referrerPolicy="no-referrer"
              />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={logout}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
        
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
